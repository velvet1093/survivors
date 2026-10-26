import test from 'node:test';
import assert from 'node:assert/strict';
import {CHARACTERS,ITEMS,FUSIONS,createPlayer,getUpgradePool,getChoices,applyChoice,rerollChoices,openChest,forbiddenWeapon,forbiddenPassive,effectivePassiveRank,fusionReady,fusionIngredients,inactiveFormWeapon,refreshStats} from '../src/game.js';
import {initializeHardcore,signatureWeaponIds,signaturePassiveIds} from '../src/hardcore.js';
import {createRun,castWeapon,useSpecial,updateRun} from '../src/engine.js';
import {switchErzaForm} from '../src/erza.js';
import {saveRun,loadRun} from '../src/run-save.js';
const hero=id=>CHARACTERS.find(c=>c.id===id);
const hardcore=id=>initializeHardcore(createRun(hero(id)),hero(id));
const memory=()=>{const values=new Map();return{getItem:key=>values.get(key)||null,setItem:(key,value)=>values.set(key,value),removeItem:key=>values.delete(key)};};
const max=(p,inventory,id)=>{while((p[inventory][id]||0)<ITEMS[id].max)assert.ok(applyChoice(p,{kind:'item',id}));};

test('Hardcore preserves normal run stats and limits every hero to canonical weapons and one passive',()=>{
 for(const character of CHARACTERS){
  const normal=createRun(character),g=initializeHardcore(createRun(character),character),allowed=signatureWeaponIds(character);
  assert.equal(g.mode,'hardcore');assert.equal(g.p.hardcore,true);assert.deepEqual(g.p.signatureWeapons,allowed);assert.deepEqual(g.p.signaturePassives,[character.passive]);
  assert.equal(g.p.maxHp,normal.p.maxHp);assert.equal(g.p.damage,normal.p.damage);assert.equal(g.p.move,normal.p.move);
  assert.deepEqual(g.p.weapons,normal.p.weapons);
  for(const choice of getUpgradePool(g.p))if(choice.kind==='item'&&ITEMS[choice.id].type==='weapon')assert.ok(allowed.includes(choice.id));
  for(const [id,item]of Object.entries(ITEMS))if(item.type==='passive')assert.equal(getUpgradePool(g.p).some(c=>c.id===id),id===character.passive,character.id+' only upgrades its own passive');
 }
 assert.deepEqual(signatureWeaponIds(hero('gojo')),['blue','red']);assert.deepEqual(signatureWeaponIds(hero('megumi')),['shadows','nue']);assert.deepEqual(signatureWeaponIds(hero('eren')),['odmblades','titanfists']);
});

test('random choices, rerolls and five-reward chests never offer foreign weapons or passives',()=>{
 for(const {id}of CHARACTERS){
  const p=hardcore(id).p,allowed=signatureWeaponIds(hero(id));p.rerollsLeft=30;
  const valid=choice=>{if(choice.kind==='item')assert.ok(ITEMS[choice.id].type==='weapon'?allowed.includes(choice.id):choice.id===hero(id).passive);};
  for(let i=0;i<20;i++){const choices=getChoices(p,()=>i/20);choices.forEach(valid);(rerollChoices(p,choices,()=>1-(i+1)/21)||[]).forEach(valid);openChest(p,()=>.95).forEach(valid);}
 }
});

test('direct grants and casts reject foreign weapons even if a mixed inventory is injected',()=>{
 const g=hardcore('goku');assert.equal(applyChoice(g.p,{kind:'item',id:'blue'}),false);assert.equal(g.p.weapons.blue,undefined);
 g.p.weapons.blue=5;const before=JSON.stringify({shots:g.shots,fields:g.fields,effects:g.effects});
 assert.equal(forbiddenWeapon(g.p,'blue'),true);assert.equal(castWeapon(g,'blue',{x:100,y:0,r:10}),false);assert.equal(JSON.stringify({shots:g.shots,fields:g.fields,effects:g.effects}),before);
 g.p.signatureWeapons=['blue'];assert.equal(forbiddenWeapon(g.p,'blue'),true,'a mutable checkpoint list cannot redefine the hero signature');
});

test('Gojo and Megumi retain their two-weapon signature fusions and Eren retains both forms',()=>{
 for(const [id,fusion,weapon,passive]of [['gojo','purple','blue','eyes'],['megumi','chimeragarden','shadows','talisman']]){
  const g=hardcore(id);for(const key of signatureWeaponIds(hero(id)))max(g.p,'weapons',key);max(g.p,'passives',passive);
  assert.ok(fusionReady(g.p,FUSIONS.find(f=>f.id===fusion)));assert.equal(openChest(g.p,()=>0)[0].id,fusion);assert.ok(applyChoice(g.p,{kind:'fusion',id:fusion}));assert.equal(g.p.fusions[weapon],fusion);
 }
 const eren=hardcore('eren');max(eren.p,'weapons','odmblades');max(eren.p,'passives','freedom');assert.ok(applyChoice(eren.p,{kind:'fusion',id:'scoutassault'}));assert.ok(useSpecial(eren));
 assert.equal(eren.p.weapon,'titanfists');assert.equal(eren.p.weapons.titanfists,5);assert.equal(eren.p.fusions.titanfists,'titanquake');assert.equal(forbiddenWeapon(eren.p,'titanfists'),false);assert.equal(forbiddenWeapon(eren.p,'odmblades'),false);
});

test('foreign weapons and passive ingredients cannot unlock fusions even from a mixed inventory',()=>{
 const p=hardcore('naruto').p;p.weapons={shuriken:5,kunai:5};p.passives={scroll:3,herbs:3,senzu:3};
 assert.equal(fusionReady(p,FUSIONS.find(f=>f.id==='rasenflash')),false);assert.equal(applyChoice(p,{kind:'fusion',id:'rasenflash'}),false);
 assert.equal(applyChoice(p,{kind:'fusion',id:'panaceapouch'}),false);assert.equal(p.fusions.herbs,undefined);
 for(const [id,fusion]of [['goku','panaceapouch'],['maomao','panaceapouch'],['shinji','adaptivebarrier'],['samus','adaptivebarrier']]){const mixed=hardcore(id).p;mixed.passives={herbs:3,senzu:3,energytank:3,atfield:3};assert.equal(fusionReady(mixed,FUSIONS.find(f=>f.id===fusion)),false);assert.equal(applyChoice(mixed,{kind:'fusion',id:fusion}),false);}
});

test('a complete signature build always receives recovery instead of an empty upgrade screen',()=>{
 const p=hardcore('goku').p;p.weapons={ki:5};p.passives={senzu:3};p.fusions={ki:'kamehameha'};refreshStats(p);p.hp=1;
 assert.deepEqual(getChoices(p),[{kind:'heal',id:'heal'}]);const chest=openChest(p,()=>.99);assert.equal(chest.length,5);assert.ok(chest.every(c=>c.kind==='heal'));
 assert.equal(applyChoice(p,chest[0]),true);assert.equal(p.hp,51);
});

test('Hardcore mode, native in-flight attacks and pending upgrades survive a checkpoint',()=>{
 const g=hardcore('gojo'),store=memory();castWeapon(g,'red',{x:180,y:0});g.status='upgrade';g.levelChoices=getChoices(g.p,()=>.4);const pending=structuredClone(g.levelChoices);
 assert.equal(saveRun(g,store),true);const resumed=loadRun(store);assert.ok(resumed);assert.equal(resumed.mode,'hardcore');assert.equal(resumed.resumeStatus,'upgrade');assert.equal(resumed.status,'paused');assert.equal(resumed.p.hardcore,true);assert.deepEqual(resumed.p.signatureWeapons,['blue','red']);assert.deepEqual(resumed.levelChoices,pending);assert.equal(resumed.shots[0].type,'red');assert.equal(resumed.shots.length,g.shots.length);
});

test('native Blue vortices and Maomao ultimate poison fields remain active through Hardcore checkpoints',()=>{
 for(const id of ['gojo','maomao']){
  const g=hardcore(id),store=memory();g.spawn=g.eliteAt=999;g.p.cooldowns=Object.fromEntries(Object.keys(g.p.weapons).map(id=>[id,999]));
  if(id==='gojo')castWeapon(g,'blue',{x:180,y:0});else{assert.ok(useSpecial(g));updateRun(g,.01);assert.ok(g.fields.some(f=>f.panacea));}
  assert.ok(g.fields.length);const fields=structuredClone(g.fields);saveRun(g,store);assert.deepEqual(loadRun(store).fields,fields);
 }
});

test('Erza’s native Heaven’s Wheel swords survive a Hardcore checkpoint',()=>{
 const g=hardcore('erza'),store=memory();assert.ok(switchErzaForm(g,0));castWeapon(g,'requip',{x:180,y:0});
 assert.ok(g.shots.some(s=>s.type==='requip-sword'),'the actual native attack emits a physical sword');
 const swords=structuredClone(g.shots);assert.ok(saveRun(g,store));const resumed=loadRun(store);assert.ok(resumed);assert.equal(resumed.mode,'hardcore');assert.deepEqual(resumed.shots,swords);
});

test('restored Hardcore derives restrictions from the hero and cleans foreign weapons, attacks and offers',()=>{
 const g=hardcore('naruto'),store=memory();g.p.signatureWeapons=['shuriken','kunai'];g.p.weapons={shuriken:5,kunai:5};g.p.fusions={shuriken:'rasenflash'};g.p.cooldowns.kunai=4;g.p.passives.herbs=3;g.shots=[{type:'kunai',hits:new Set(),life:1}];g.status='chest';g.rewards=[{kind:'item',id:'kunai',level:5}];g.chestIndex=0;g.levelChoices=[{kind:'item',id:'kunai',level:5}];
 assert.ok(saveRun(g,store));const resumed=loadRun(store);assert.ok(resumed);assert.deepEqual(resumed.p.signatureWeapons,['shuriken']);assert.deepEqual(resumed.p.weapons,{shuriken:5});assert.equal(resumed.p.cooldowns.kunai,undefined);assert.equal(resumed.p.fusions.shuriken,undefined);assert.equal(resumed.p.passives.herbs,undefined);assert.deepEqual(resumed.p.passives,{headband:1});assert.equal(resumed.shots.length,0);assert.equal(resumed.levelChoices,null);assert.deepEqual(resumed.rewards,[{kind:'heal',id:'heal'}]);
 const clean=hardcore('goku');clean.shots=[{type:'quill',hits:new Set(),life:1}];saveRun(clean,store);assert.equal(loadRun(store).shots.length,0,'foreign attack snapshots are removed even without a mixed inventory');
});

test('Survival checkpoints ignore stray Hardcore metadata and preserve the shared weapon pool',()=>{
 const g=createRun(hero('goku')),store=memory();g.p.hardcore=true;g.p.signatureWeapons=['ki'];g.p.signaturePassives=['senzu'];g.p.weapons.blue=2;g.p.passives.herbs=2;saveRun(g,store);const resumed=loadRun(store);assert.ok(resumed);assert.equal(resumed.mode,'survival');assert.equal(resumed.p.hardcore,undefined);assert.equal(resumed.p.signaturePassives,undefined);assert.equal(resumed.p.passives.herbs,2);assert.equal(resumed.p.weapons.blue,2);assert.equal(forbiddenWeapon(resumed.p,'blue'),false);assert.ok(getUpgradePool(resumed.p).some(c=>c.id==='red'));
 const plain=createPlayer(hero('goku'));assert.equal(forbiddenWeapon(plain,'blue'),false);assert.equal(forbiddenPassive(plain,'herbs'),false);assert.ok(applyChoice(plain,{kind:'item',id:'herbs'}));
});


test('foreign passive grants and hidden absorbed bonuses cannot change Hardcore hero statistics',()=>{
 for(const character of CHARACTERS){
  const g=hardcore(character.id),p=g.p,base=structuredClone(p),own=character.passive;
  for(const [id,item]of Object.entries(ITEMS))if(item.type==='passive'&&id!==own){assert.equal(applyChoice(p,{kind:'item',id}),false);assert.equal(p.passives[id],undefined);p.passives[id]=item.max;assert.equal(effectivePassiveRank(p,id),0);}
  p.fusions.herbs='panaceapouch';p.fusions.energytank='adaptivebarrier';p.passive='power';p.signaturePassives=['power'];refreshStats(p);
  for(const key of ['maxHp','regen','healing','cooldown','move','dodge','magnet','area','freezeResistance','damage','maxShield','damageReduction','shieldRecharge'])assert.equal(p[key],base[key],character.id+' '+key+' ignores foreign passive bonuses');
  const foreign=own==='power'?'herbs':'power';assert.equal(forbiddenPassive(p,foreign),true);assert.equal(applyChoice(p,{kind:'item',id:foreign}),false);assert.deepEqual(signaturePassiveIds(character),[own]);
 }
});

test('legacy support fusions restore the hero’s absorbed passive and remove foreign power without healing',()=>{
 for(const [id,own,foreign,fusion,weapon,evolution]of [['goku','senzu','herbs','panaceapouch','ki','kamehameha'],['shinji','atfield','energytank','adaptivebarrier','pallet','positron']]){
  const g=hardcore(id),store=memory();g.p.hardcore=false;g.p.passives={[foreign]:3,power:3};g.p.weapons[weapon]=5;g.p.fusions={[foreign]:fusion,[weapon]:evolution};refreshStats(g.p);g.p.shield=g.p.maxShield;g.p.hp=55;g.p.hardcore=true;g.p.passive=foreign;g.p.signaturePassives=[foreign];
  assert.ok(saveRun(g,store));const resumed=loadRun(store);assert.ok(resumed);assert.equal(resumed.p.passive,own);assert.deepEqual(resumed.p.signaturePassives,[own]);assert.deepEqual(resumed.p.passives,{[own]:3});assert.deepEqual(resumed.p.fusions,{[weapon]:evolution});assert.equal(resumed.p.hp,55,'migration never heals');
  const expected=hardcore(id);expected.p.passives[own]=3;refreshStats(expected.p);for(const key of ['maxHp','damage','regen','maxShield','area','damageReduction'])assert.equal(resumed.p[key],expected.p[key],id+' '+key+' no longer includes foreign support');
  assert.ok(resumed.p.shield<=resumed.p.maxShield);saveRun(resumed,store);assert.deepEqual(loadRun(store).p.passives,{[own]:3},'cleanup is stable on later reloads');
 }
});

test('legacy foreign passive rewards and fusions are replaced while taken chest history stays intact',()=>{
 const g=hardcore('maomao'),store=memory();g.p.passives={herbs:2,senzu:3};g.status='chest';g.chestIndex=1;g.rewards=[{kind:'item',id:'senzu',level:3,decision:'taken'},{kind:'item',id:'power',level:1},{kind:'fusion',id:'panaceapouch'}];g.levelChoices=[{kind:'item',id:'senzu',level:3}];
 saveRun(g,store);const restored=loadRun(store);assert.ok(restored);assert.deepEqual(restored.p.passives,{herbs:2});assert.equal(restored.levelChoices,null);assert.deepEqual(restored.rewards,[{kind:'item',id:'senzu',level:3,decision:'taken'},{kind:'heal',id:'heal'},{kind:'heal',id:'heal'}]);assert.equal(restored.chestIndex,1);assert.equal(restored.resumeStatus,'chest');
});


test('every hero can max and evolve its native weapons using only its own passive',()=>{
 for(const character of CHARACTERS){
  const allowed=signatureWeaponIds(character),p=hardcore(character.id).p;for(const id of Object.keys(p.weapons))max(p,'weapons',id);max(p,'passives',character.passive);
  const recipes=FUSIONS.filter(f=>fusionIngredients(f).every(id=>ITEMS[id].type==='weapon'?allowed.includes(id)&&!inactiveFormWeapon(p,id):id===character.passive));assert.ok(recipes.length,character.id+' has a native evolution');
  for(const recipe of recipes){const candidate=structuredClone(p);assert.equal(fusionReady(candidate,recipe),true,recipe.id);assert.equal(applyChoice(candidate,{kind:'fusion',id:recipe.id}),true,recipe.id);assert.deepEqual(Object.keys(candidate.passives),[character.passive]);}
 }
});

test('a removed legacy support fusion cannot leave a resumed run on an empty fusion screen',()=>{
 for(const paused of [false,true]){
  const g=hardcore('maomao'),store=memory();g.p.weapons.poison=5;g.p.passives={herbs:3,senzu:3};g.p.fusions.poison='elixir';g.status=paused?'paused':'fusion';if(paused)g.resumeStatus='fusion';g.levelChoices=[{kind:'fusion',id:'panaceapouch'}];
  saveRun(g,store);const restored=loadRun(store);assert.ok(restored);assert.equal(restored.resumeStatus,'upgrade');assert.equal(restored.levelChoices,null);assert.deepEqual(getChoices(restored.p),[{kind:'heal',id:'heal'}]);
 }
});
