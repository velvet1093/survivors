import test from 'node:test';
import assert from 'node:assert/strict';
import {CHARACTERS,ITEMS,FUSIONS,createPlayer,refreshStats,fusionType,fusionBase,fusionIngredients,fusionConsumedIngredients,fusionRequirement,fusionReady,effectivePassiveRank,consumedFusionIngredient,getUpgradePool,getChoices,chestOffers,applyChoice} from '../src/game.js';
import {createRun,createHardcoreRun,createBossRushRun,castWeapon,damageEnemy} from '../src/engine.js';
import {configureRushLoadout,evolveRushWeapon,getRushDraftPool,getRushDraftChoices,chooseRushDraft,beginBossRush} from '../src/boss-rush.js';
import {ultimateCooldown} from '../src/ultimates.js';
import {saveRun,loadRun} from '../src/run-save.js';
import {updatePairedShot} from '../src/paired-weapons.js';
import {heroToxin} from '../src/hero-mechanics.js';

const addedItems=['rasengan','dragonflame','wisteriapetals','griefseed','manacrystal'];
const pairs={raijinrasengan:['rasengan','kunai'],dragonroar:['dragonflame','lightning'],wisteriagarden:['poison','wisteriapetals'],purifiedsoul:['soulgem','griefseed'],sagecodex:['grimoire','manacrystal']};
const recipe=id=>FUSIONS.find(f=>f.id===id),hero=id=>CHARACTERS.find(c=>c.id===id);
const store=()=>({data:new Map(),getItem(k){return this.data.get(k)},setItem(k,v){this.data.set(k,v)},removeItem(k){this.data.delete(k)}});
function equipped(id){const p=createPlayer(hero('goku'));p.weapons={};p.passives={};for(const ingredient of fusionIngredients(recipe(id)))(ITEMS[ingredient].type==='weapon'?p.weapons:p.passives)[ingredient]=ITEMS[ingredient].max;refreshStats(p);return p;}
const close=(a,b)=>assert.ok(Math.abs(a-b)<1e-9,`${a} equals ${b}`);

test('five new ingredients unlock five exact two-item recipes, with no hidden passive requirement for the active pairs',()=>{
 for(const id of addedItems){assert.ok(ITEMS[id]);assert.equal(ITEMS[id].max,ITEMS[id].type==='weapon'?5:3);assert.ok(ITEMS[id].name&&ITEMS[id].description&&ITEMS[id].series);}
 for(const [id,ingredients]of Object.entries(pairs)){
  const f=recipe(id),p=equipped(id);assert.ok(f);assert.deepEqual(fusionIngredients(f),ingredients);assert.equal(fusionIngredients(f).length,2);assert.ok(fusionReady(p,f));assert.equal(fusionRequirement(f),ingredients.map(key=>`${ITEMS[key].name} LV ${ITEMS[key].max}`).join(' + '));
  if(fusionType(f)==='weapon'){assert.equal(f.passive,undefined);assert.deepEqual(p.passives,{});}
  for(const key of ingredients){const inv=ITEMS[key].type==='weapon'?p.weapons:p.passives;inv[key]--;assert.equal(fusionReady(p,f),false,key+' must be maxed');inv[key]++;}
  assert.ok(getChoices(p,()=>.9).some(choice=>choice.kind==='fusion'&&choice.id===id));
 }
 const purple=recipe('purple');assert.deepEqual(fusionIngredients(purple),['blue','red','eyes']);const p=createPlayer(hero('gojo'));p.weapons={blue:5,red:5};p.passives={};assert.equal(fusionReady(p,purple),false);p.passives.eyes=3;assert.ok(fusionReady(p,purple),'Hollow Purple keeps its existing three ingredients');
});

test('each paired recipe consumes only its declared secondary, frees one slot and cannot replay or offer its absorbed item',()=>{
 for(const id of Object.keys(pairs)){
  const f=recipe(id),p=equipped(id),category=fusionType(f)==='weapon'?'weapons':'passives',consumed=fusionConsumedIngredients(f),count=Object.keys(p[category]).length;
  assert.equal(consumed.length,1);for(const ingredient of consumed)p.cooldowns[ingredient]=7;
  assert.ok(applyChoice(p,{kind:'fusion',id}));assert.equal(p.fusions[fusionBase(f)],id);assert.equal(Object.keys(p[category]).length,count-1);assert.equal(p[category][fusionBase(f)],ITEMS[fusionBase(f)].max);
  for(const ingredient of consumed){assert.equal(p[category][ingredient],undefined);assert.equal(p.cooldowns[ingredient],undefined);assert.ok(consumedFusionIngredient(p,ingredient));assert.ok(!getUpgradePool(p).some(c=>c.id===ingredient));assert.equal(applyChoice(p,{kind:'item',id:ingredient}),false);}
  assert.equal(applyChoice(p,{kind:'fusion',id}),false);assert.ok(!getUpgradePool(p).some(c=>c.id===id));
 }
 for(const [id,secondary,evolution]of [['raijinrasengan','kunai','raijin'],['dragonroar','lightning','tempest'],['wisteriagarden','wisteriapetals','wisteriagarden']]){const p=equipped(id);p.fusions[secondary]=evolution;assert.equal(fusionReady(p,recipe(id)),false,'an evolved secondary cannot be consumed');}
});

test('Purified Soul Gem preserves its two supports, adds food healing, respects faster shields and keeps Madoka’s evolution available',()=>{
 const p=equipped('purifiedsoul');p.hp=57;p.shield=9;p.shieldTimer=6.5;const before={damage:p.damage,shield:p.maxShield,cooldown:p.cooldown,magnet:p.magnet,healing:p.healing};
 close(p.cooldown,.91);close(p.magnet,115*1.15);assert.ok(applyChoice(p,{kind:'fusion',id:'purifiedsoul'}));assert.equal(p.passives.griefseed,undefined);assert.equal(effectivePassiveRank(p,'griefseed'),3);assert.equal(p.hp,57);assert.equal(p.shield,9);assert.equal(p.maxShield,before.shield);assert.equal(p.shieldTimer,6.5);assert.equal(p.shieldRecharge,8);close(p.damage,before.damage);close(p.cooldown,before.cooldown);close(p.magnet,before.magnet);close(p.healing,before.healing+.2);close(ultimateCooldown(p),60*.91);
 p.weapons.rosebow=5;assert.ok(fusionReady(p,recipe('ultimate')));assert.ok(applyChoice(p,{kind:'fusion',id:'ultimate'}));refreshStats(p);refreshStats(p);assert.equal(p.maxShield,before.shield);assert.equal(p.shieldRecharge,8);close(p.healing,before.healing+.2);
 const h=createPlayer(hero('goku'));h.passives={energytank:3,atfield:3,soulgem:3,griefseed:3};refreshStats(h);assert.ok(applyChoice(h,{kind:'fusion',id:'adaptivebarrier'}));const shield=h.maxShield;assert.ok(applyChoice(h,{kind:'fusion',id:'purifiedsoul'}));assert.equal(h.shieldRecharge,7);assert.equal(h.maxShield,shield,'purification never adds another copy of the shield');
});

test('Sage’s Codex preserves Mana Crystal and Grimoire statistics and adds its cooldown once through repeated refreshes and another evolution',()=>{
 const p=equipped('sagecodex'),before={damage:p.damage,area:p.area,cooldown:p.cooldown};close(before.area,1.36);close(before.damage,1.24);
 assert.ok(applyChoice(p,{kind:'fusion',id:'sagecodex'}));assert.equal(p.passives.manacrystal,undefined);assert.equal(effectivePassiveRank(p,'manacrystal'),3);close(p.damage,before.damage);close(p.area,before.area);close(p.cooldown,before.cooldown-.06);close(ultimateCooldown(p),60*.94);
 p.weapons.zoltraak=5;assert.ok(fusionReady(p,recipe('ancientmagic')));assert.ok(applyChoice(p,{kind:'fusion',id:'ancientmagic'}));for(let i=0;i<4;i++)refreshStats(p);close(p.cooldown,.94);close(p.damage,before.damage);close(p.area,before.area);
});

test('treasure prioritizes each ready pair without mutating the player or forecasting a consumed ingredient as a later reward',()=>{
 for(const id of Object.keys(pairs)){
  const p=equipped(id),before=structuredClone(p),offers=chestOffers(p,5,()=>.99);assert.deepEqual(offers[0],{kind:'fusion',id});assert.deepEqual(p,before);const consumed=fusionConsumedIngredients(recipe(id));assert.ok(offers.slice(1).every(choice=>!consumed.includes(choice.id)));assert.ok(offers.slice(1).some(choice=>choice.kind==='item'),'freed slots can receive another item');
 }
});

function fullRush(id){
 const g=createBossRushRun(hero('goku'));const f=recipe(id),parts=fusionIngredients(f),unique=items=>[...new Set(items)].slice(0,5);
 const weapons=unique(['ki',...parts.filter(key=>ITEMS[key].type==='weapon'),'blue','orbit','clockshot','pallet','crimson']);
 const passives=unique(['senzu',...parts.filter(key=>ITEMS[key].type==='passive'),'eyes','timepiece','energytank','power','scroll']);
 assert.ok(configureRushLoadout(g,{weapons,passives}));assert.equal(g.status,'rush-fusion');return g;
}
test('Boss Rush grants one new maxed pick after every paired fusion and saves the consumed slot and restored full loadout',()=>{
 for(const id of Object.keys(pairs)){
  const g=fullRush(id),f=recipe(id),category=fusionType(f)==='weapon'?'weapons':'passives',consumed=fusionConsumedIngredients(f);assert.ok(evolveRushWeapon(g,id));assert.equal(g.status,'rush-draft');assert.equal(Object.keys(g.p[category]).length,4);assert.equal(beginBossRush(g),false);
  const pool=getRushDraftPool(g);assert.ok(pool.length);assert.ok(pool.every(choice=>ITEMS[choice.id].type===fusionType(f)&&!consumed.includes(choice.id)));assert.ok(chooseRushDraft(g,getRushDraftChoices(g,()=>.9)[0].id));assert.equal(g.status,'rush-fusion');assert.equal(Object.keys(g.p[category]).length,5);assert.ok(beginBossRush(g));
  const storage=store();assert.ok(saveRun(g,storage));const loaded=loadRun(storage);assert.ok(loaded);assert.equal(loaded.resumeStatus,'playing');assert.equal(loaded.p.fusions[fusionBase(f)],id);assert.equal(Object.keys(loaded.p[category]).length,5);for(const key of consumed)assert.equal(loaded.p[category][key],undefined);
 }
});

test('Hardcore signatures exclude every new foreign ingredient and cannot forge a paired recipe while ordinary runs can acquire them',()=>{
 for(const c of CHARACTERS){const g=createHardcoreRun(c);assert.ok(getUpgradePool(g.p).every(choice=>!addedItems.includes(choice.id)));for(const id of addedItems)assert.equal(applyChoice(g.p,{kind:'item',id}),false);for(const id of Object.keys(pairs)){const p=equipped(id);Object.assign(p,{id:c.id,weapon:c.weapon,hardcore:true});assert.equal(fusionReady(p,recipe(id)),false);}}
 const p=createPlayer(hero('goku'));for(const id of addedItems)assert.ok(getUpgradePool(p).some(choice=>choice.id===id));
});

test('an unfinished older run keeps its original loadout and progress while the shared upgrade pool gains the new ingredients',()=>{
 const g=createRun(hero('denji'));g.time=137;g.money=44;g.characterXp=27;g.waveState.elapsed=31.25;g.mechanic.value=62;g.p.weapons.chainsaw=5;g.p.passives.bloodengine=3;g.p.fusions.chainsaw='chainsawoverdrive';refreshStats(g.p);g.p.hp=73;
 const storage=store();assert.ok(saveRun(g,storage));const loaded=loadRun(storage);assert.ok(loaded);assert.equal(loaded.status,'paused');assert.equal(loaded.time,137);assert.equal(loaded.money,44);assert.equal(loaded.characterXp,27);assert.equal(loaded.waveState.elapsed,31.25);assert.equal(loaded.mechanic.value,62);assert.equal(loaded.p.hp,73);assert.deepEqual(loaded.p.weapons,{chainsaw:5});assert.deepEqual(loaded.p.passives,{bloodengine:3});assert.deepEqual(loaded.p.fusions,{chainsaw:'chainsawoverdrive'});for(const id of addedItems)assert.ok(getUpgradePool(loaded.p).some(choice=>choice.id===id));
});

test('both passive pairs retain their absorbed bonuses and cooldowns through a saved checkpoint and later stat refresh',()=>{
 const g=createRun(hero('frieren'));g.p.passives={grimoire:3,manacrystal:3,soulgem:3,griefseed:3};refreshStats(g.p);
 assert.ok(applyChoice(g.p,{kind:'fusion',id:'sagecodex'}));assert.ok(applyChoice(g.p,{kind:'fusion',id:'purifiedsoul'}));g.p.hp=62;g.p.shield=7;g.p.shieldTimer=3.25;g.special=22.5;g.secondarySpecial=31.75;
 const stats={area:g.p.area,damage:g.p.damage,cooldown:g.p.cooldown,healing:g.p.healing,magnet:g.p.magnet,maxShield:g.p.maxShield,shieldRecharge:g.p.shieldRecharge};
 const storage=store();assert.ok(saveRun(g,storage));const loaded=loadRun(storage);assert.ok(loaded);assert.deepEqual(loaded.p.passives,{grimoire:3,soulgem:3});assert.deepEqual(loaded.p.fusions,{grimoire:'sagecodex',soulgem:'purifiedsoul'});assert.equal(loaded.special,22.5);assert.equal(loaded.secondarySpecial,31.75);
 for(let i=0;i<3;i++)refreshStats(loaded.p);for(const [key,value]of Object.entries(stats))close(loaded.p[key],value);close(loaded.p.cooldown,.85);assert.equal(loaded.p.hp,62);assert.equal(loaded.p.shield,7);assert.equal(loaded.p.shieldTimer,3.25);assert.equal(effectivePassiveRank(loaded.p,'manacrystal'),3);assert.equal(effectivePassiveRank(loaded.p,'griefseed'),3);
});

test('Maomao keeps poison as the garden signature and resumes a flying seed and its finite toxic pulses from checkpoints',()=>{
 const g=createRun(hero('maomao'));g.p.weapons={poison:5,wisteriapetals:5};g.p.passives={};refreshStats(g.p);assert.ok(applyChoice(g.p,{kind:'fusion',id:'wisteriagarden'}));
 const target={id:702,x:120,y:-18,r:15,hp:100000,maxHp:100000,boss:false};g.enemies=[target];g.mechanic.value=28;assert.ok(castWeapon(g,'poison',target));let shot=g.shots[0];assert.equal(shot.sourceWeapon,'poison');assert.equal(shot.rank,5);assert.equal(shot.state,'seed');assert.equal(g.p.weapon,'poison');assert.equal(g.p.weapons.wisteriapetals,undefined);
 const api={damage:damageEnemy,toxin:heroToxin};updatePairedShot(g,shot,.2,api);assert.equal(g.mechanic.value,28);const storage=store();assert.ok(saveRun(g,storage));const flying=loadRun(storage);assert.ok(flying);shot=flying.shots[0];assert.equal(shot.sourceWeapon,'poison');assert.equal(shot.state,'seed');close(shot.age,.2);assert.equal(flying.mechanic.value,28);
 updatePairedShot(flying,shot,.26,api);assert.equal(shot.state,'bloom');assert.equal(shot.pulses,1);assert.equal(flying.mechanic.value,32);assert.ok(flying.enemies[0].hp<target.hp);assert.ok(saveRun(flying,storage));const blooming=loadRun(storage);assert.ok(blooming);const saved=blooming.shots[0],hp=blooming.enemies[0].hp;assert.equal(saved.state,'bloom');assert.equal(saved.pulses,1);assert.equal(saved.sourceWeapon,'poison');updatePairedShot(blooming,saved,.1,api);assert.equal(saved.pulses,1,'reloading does not replay the first pulse');assert.equal(blooming.enemies[0].hp,hp);assert.equal(blooming.mechanic.value,32);updatePairedShot(blooming,saved,.4,api);assert.equal(saved.pulses,2);assert.equal(blooming.mechanic.value,36);assert.ok(blooming.enemies[0].hp<hp);
});
