import test from 'node:test';
import assert from 'node:assert/strict';
import {CHARACTERS,ITEMS,FUSIONS,SET_BONDS,createPlayer,refreshStats,applyChoice,fusionReady,getUpgradePool,getChoices,effectivePassiveRank,consumedFusionIngredient,setBondChoices,setBondMembers,setTier,setBonus,bondPreview} from '../src/game.js';
import {createRun} from '../src/engine.js';
import {saveRun,loadRun} from '../src/run-save.js';
import {SET_ITEM_ART_IDS,setItemPixels} from '../src/set-item-art.js';
import {icon} from '../src/icons.js';
import {rarityFor} from '../src/rarity.js';
import {cardDef} from '../src/spire-cards.js';

const hero=id=>CHARACTERS.find(c=>c.id===id),near=(a,b)=>assert.ok(Math.abs(a-b)<1e-9,`${a} equals ${b}`);
const memory=()=>({data:new Map(),getItem(k){return this.data.get(k)},setItem(k,v){this.data.set(k,v)},removeItem(k){this.data.delete(k)}});
const keys=['maxHp','damage','damageReduction','area','cooldown','move','dodge','magnet','regen','healing'];
const stats=p=>Object.fromEntries(keys.map(k=>[k,p[k]]));
function bare(id='goku'){const p=createPlayer(hero(id));p.weapons={};p.passives={};p.fusions={};refreshStats(p);return p;}
const max=(p,id)=>{p.passives[id]=ITEMS[id].max;refreshStats(p);};
// Bond every piece of a set one maxed piece at a time.
function bondAll(p,set){for(const id of set.members){max(p,id);const c=setBondChoices(p).find(c=>c.set===set.id);if(c)assert.ok(applyChoice(p,c));}}

test('three four-piece sets define pieces, a bond slot, a finished relic and an awakening',()=>{
 assert.deepEqual(SET_BONDS.map(s=>s.id),['philosopherstone','piratelegacy','hinokami']);
 for(const s of SET_BONDS){
  assert.equal(s.members.length,4);
  for(const id of s.members){assert.equal(ITEMS[id].type,'passive');assert.equal(ITEMS[id].max,3);assert.ok(!ITEMS[id].fusionOnly);assert.ok(ITEMS[id].description.length>60);assert.equal(rarityFor(id).id,'common');}
  for(const id of [s.bond,s.id,s.awaken]){assert.equal(ITEMS[id].fusionOnly,true);assert.equal(ITEMS[id].max,1);}
  const whole=FUSIONS.find(f=>f.id===s.id),wake=FUSIONS.find(f=>f.id===s.awaken);
  assert.deepEqual(whole.ingredients,s.members);assert.equal(whole.resultItem,s.id);
  assert.deepEqual(wake.ingredients,[s.id,s.catalyst]);assert.deepEqual(wake.consumedIngredients,[s.id,s.catalyst,...s.members]);
  assert.equal(ITEMS[s.catalyst].type,'passive');assert.ok(!ITEMS[s.catalyst].fusionOnly);
  assert.equal(rarityFor(s.bond).id,'legendary');assert.equal(rarityFor(s.id).id,'mythic');assert.equal(rarityFor(s.awaken).id,'mythic');
 }
});

test('maxed pieces bond one at a time, keep their bonuses and free a slot with each step',()=>{
 for(const s of SET_BONDS){
  const p=bare(),[a,b,c,d]=s.members;
  max(p,a);assert.equal(setBondChoices(p).filter(x=>x.set===s.id).length,0,'one maxed piece cannot start a bond');
  max(p,b);const loose=stats(p),start=setBondChoices(p).find(x=>x.set===s.id);
  assert.deepEqual({id:start.id,with:start.with},{id:b,with:a});
  const preview=bondPreview(p,start);assert.deepEqual([preview.count,preview.total,preview.complete,preview.id],[2,4,false,s.bond]);
  assert.ok(applyChoice(p,start));assert.deepEqual(p.passives,{[s.bond]:1});assert.deepEqual(setBondMembers(p,s),[a,b]);assert.deepEqual(stats(p),loose,'bonding keeps both bonuses');
  for(const id of [a,b]){assert.equal(effectivePassiveRank(p,id),3);assert.ok(consumedFusionIngredient(p,id));assert.ok(!getUpgradePool(p).some(x=>x.id===id),id+' is not offered again');}
  max(p,c);const three=stats(p);assert.ok(applyChoice(p,setBondChoices(p).find(x=>x.set===s.id)));assert.deepEqual(p.passives,{[s.bond]:1});assert.deepEqual(stats(p),three);
  max(p,d);const last=setBondChoices(p).find(x=>x.set===s.id);assert.equal(bondPreview(p,last).complete,true);assert.equal(bondPreview(p,last).id,s.id);
  assert.ok(applyChoice(p,last));assert.deepEqual(p.passives,{[s.id]:1});assert.equal(p.fusions[s.id],s.id);assert.equal(setTier(p,s),1);assert.equal(p.setBonds[s.id],undefined);
  for(const id of s.members)assert.equal(effectivePassiveRank(p,id),3);
  assert.equal(setBondChoices(p).filter(x=>x.set===s.id).length,0,'a finished set offers no more bonds');
 }
});

test('the finished relic adds its completion bonus on top of every piece bonus',()=>{
 for(const s of SET_BONDS){
  const loose=bare();for(const id of s.members)max(loose,id);
  const built=bare();bondAll(built,s);
  const b=s.bonus;
  near(built.damage,loose.damage+(b.damage||0));near(built.area,loose.area+(b.area||0));near(built.cooldown,loose.cooldown-(b.cooldown||0));
  near(built.move,loose.move+hero('goku').move*(b.move||0));near(built.magnet,loose.magnet+115*(b.magnet||0));near(built.maxHp,loose.maxHp);near(built.damageReduction,loose.damageReduction);
  near(setBonus(built).damage,b.damage);
 }
});

test('holding all four maxed pieces offers the whole set as one fusion instead of bond steps',()=>{
 for(const s of SET_BONDS){
  const p=bare();for(const id of s.members)max(p,id);
  assert.ok(fusionReady(p,FUSIONS.find(f=>f.id===s.id)));assert.equal(setBondChoices(p).filter(x=>x.set===s.id).length,0);
  assert.deepEqual(getChoices(p,()=>.5)[0],{kind:'fusion',id:s.id});
  const via=bare();bondAll(via,s);assert.ok(applyChoice(p,{kind:'fusion',id:s.id}));assert.deepEqual(p.passives,via.passives);assert.deepEqual(stats(p),stats(via));
 }
});

test('awakening absorbs the relic and its maxed catalyst, keeps every bonus and frees the catalyst slot',()=>{
 for(const s of SET_BONDS){
  const p=bare();bondAll(p,s);const wake=FUSIONS.find(f=>f.id===s.awaken);
  assert.equal(fusionReady(p,wake),false,'the catalyst must be maxed');p.passives[s.catalyst]=2;refreshStats(p);assert.equal(fusionReady(p,wake),false);
  max(p,s.catalyst);assert.ok(fusionReady(p,wake));assert.ok(getUpgradePool(p).some(c=>c.kind==='fusion'&&c.id===s.awaken));
  const before=stats(p);assert.ok(applyChoice(p,{kind:'fusion',id:s.awaken}));
  assert.deepEqual(p.passives,{[s.awaken]:1});assert.equal(setTier(p,s),2);
  for(const id of [...s.members,s.catalyst]){assert.equal(effectivePassiveRank(p,id),3,id+' keeps max rank');assert.ok(consumedFusionIngredient(p,id));}
  const gain=k=>(s.awakenBonus[k]||0)-(s.bonus[k]||0);
  near(p.damage,before.damage+gain('damage'));near(p.area,before.area+gain('area'));near(p.cooldown,before.cooldown-gain('cooldown'));near(p.dodge,before.dodge+gain('dodge'));near(p.regen,before.regen+gain('regen'));
 }
});

test('absorbed catalysts still unlock their owners’ weapon evolutions',()=>{
 const gojo=bare('gojo');bondAll(gojo,SET_BONDS[2]);max(gojo,'eyes');assert.ok(applyChoice(gojo,{kind:'fusion',id:'transparentworld'}));
 gojo.weapons={blue:5,red:5};refreshStats(gojo);assert.ok(fusionReady(gojo,FUSIONS.find(f=>f.id==='purple')),'Hollow Purple still sees Six Eyes');
 const eren=bare('eren');bondAll(eren,SET_BONDS[1]);max(eren,'freedom');assert.ok(applyChoice(eren,{kind:'fusion',id:'gearfifth'}));
 assert.equal(effectivePassiveRank(eren,'freedom'),3,'Thunder Spears still sees Key of Freedom');
});

test('bonds never appear in Hardcore, and results are never raw items',()=>{
 const p=bare();for(const id of SET_BONDS[0].members.slice(0,2))max(p,id);p.hardcore=true;assert.deepEqual(setBondChoices(p),[]);
 const q=createPlayer(hero('goku'));for(const s of SET_BONDS)for(const id of [s.bond,s.id,s.awaken]){assert.ok(!getUpgradePool(q).some(c=>c.kind==='item'&&c.id===id));assert.equal(applyChoice(q,{kind:'item',id}),false);}
 assert.equal(applyChoice(q,{kind:'bond',set:'philosopherstone',id:'redstone'}),false,'no bond without maxed pieces');
});

test('a half-built bond and a pending bond choice survive a checkpoint reload',()=>{
 const g=createRun(hero('goku')),s=SET_BONDS[0];g.p.passives={};g.p.fusions={};
 for(const id of s.members.slice(0,2))max(g.p,id);assert.ok(applyChoice(g.p,setBondChoices(g.p)[0]));max(g.p,s.members[2]);
 g.status='upgrade';g.levelChoices=[setBondChoices(g.p)[0],{kind:'heal',id:'heal'}];const before=stats(g.p),storage=memory();
 assert.ok(saveRun(g,storage));const loaded=loadRun(storage);assert.ok(loaded);
 assert.deepEqual(loaded.p.setBonds,{[s.id]:s.members.slice(0,2)});assert.deepEqual(stats(loaded.p),before);
 assert.deepEqual(loaded.levelChoices[0],{kind:'bond',set:s.id,id:s.members[2]});assert.ok(applyChoice(loaded.p,loaded.levelChoices[0]));assert.deepEqual(setBondMembers(loaded.p,s),s.members.slice(0,3));
});

test('every new item has its own native pixel icon and a card version',()=>{
 const drawings=new Set();
 for(const s of SET_BONDS)for(const id of [...s.members,s.bond,s.id,s.awaken]){
  assert.ok(SET_ITEM_ART_IDS.includes(id),id);const p=setItemPixels(id);assert.equal(p.length,1024);assert.ok(p.filter(Boolean).length>150,id+' has a full silhouette');
  assert.match(icon(id),new RegExp('data-pixel-icon="'+id+'"'));drawings.add(JSON.stringify(p));
 }
 assert.equal(drawings.size,21);assert.equal(setItemPixels('unknown'),null);
 for(const s of SET_BONDS){assert.ok(cardDef(s.members[0]));assert.ok(cardDef('fusion:'+s.id));assert.deepEqual(cardDef('fusion:'+s.awaken).ingredients,['fusion:'+s.id,s.catalyst]);}
});
