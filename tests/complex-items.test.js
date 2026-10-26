import test from 'node:test';
import assert from 'node:assert/strict';
import {CHARACTERS,ITEMS,FUSIONS,createPlayer,refreshStats,fusionType,fusionBase,fusionIngredients,fusionConsumedIngredients,fusionReady,fusionRequirement,effectivePassiveRank,consumedFusionIngredient,getUpgradePool,getChoices,chestOffers,applyChoice,resolveChestReward,hasComposite} from '../src/game.js';
import {createRun,createHardcoreRun,createBossRushRun} from '../src/engine.js';
import {configureRushLoadout,getRushDraftPool,getRushDraftChoices,chooseRushDraft,evolveRushWeapon,beginBossRush} from '../src/boss-rush.js';
import {saveRun,loadRun} from '../src/run-save.js';
import {heroAuthorityHit,heroKill} from '../src/hero-mechanics.js';
import {ultimateCooldown} from '../src/ultimates.js';

const parts={sageregalia:['headband','scroll','toadoil','sagebeads','sagecloak'],chozosuit:['energytank','morphball','variasuit','gravitysuit'],witcharchive:['memoryfragment','goldenbutterfly','truthseal','witchring']};
const additions=['toadoil','sagebeads','sagecloak','morphball','variasuit','gravitysuit','goldenbutterfly','truthseal','witchring'];
const hero=id=>CHARACTERS.find(c=>c.id===id),recipe=id=>FUSIONS.find(f=>f.id===id),train=(p,id)=>applyChoice(p,{kind:'fusion',id}),near=(a,b)=>assert.ok(Math.abs(a-b)<1e-9,`${a} equals ${b}`);
const memory=()=>({data:new Map(),getItem(k){return this.data.get(k)},setItem(k,v){this.data.set(k,v)},removeItem(k){this.data.delete(k)}});
const statKeys=['maxHp','maxShield','shieldRecharge','damage','damageReduction','area','cooldown','move','dodge','magnet','regen','healing','freezeResistance'];
const stats=p=>Object.fromEntries(statKeys.map(key=>[key,p[key]]));
function equipped(id,character='goku'){const p=createPlayer(hero(character));p.weapons={};p.passives=Object.fromEntries(parts[id].map(key=>[key,3]));p.fusions={};refreshStats(p);return p;}
function adaptive(){const p=equipped('chozosuit','samus');p.passives.atfield=3;refreshStats(p);assert.ok(train(p,'adaptivebarrier'));return p;}

// These recipes add shared supports and combine actual equipped ingredients,
// rather than offering the result as a free pickup or duplicating its bonuses.
test('nine new supports and three complete composite recipes have exact named ingredients and rank caps',()=>{
 for(const id of additions){assert.equal(ITEMS[id].type,'passive');assert.equal(ITEMS[id].max,3);assert.ok(ITEMS[id].series&&ITEMS[id].description.length>40);}
 for(const [id,ingredients]of Object.entries(parts)){const f=recipe(id);assert.ok(f);assert.equal(ITEMS[id].fusionOnly,true);assert.equal(ITEMS[id].max,1);assert.equal(fusionType(f),'passive');assert.equal(fusionBase(f),id);assert.equal(f.resultItem,id);assert.deepEqual(fusionIngredients(f),ingredients);assert.deepEqual(fusionConsumedIngredients(f),ingredients);for(const key of ingredients)assert.ok(fusionRequirement(f).includes(ITEMS[key].name));}
});

test('each set requires every physically equipped maxed ingredient and can be assembled without a hero or weapon prerequisite',()=>{
 for(const [id,ingredients]of Object.entries(parts)){const p=equipped(id);assert.ok(fusionReady(p,recipe(id)));for(const key of ingredients){p.passives[key]=2;assert.equal(fusionReady(p,recipe(id)),false,key+' must be maxed');p.passives[key]=3;delete p.passives[key];assert.equal(fusionReady(p,recipe(id)),false,key+' must be present');p.passives[key]=3;}assert.ok(train(p,id));assert.ok(hasComposite(p,id));}
});

test('Sage ingredients grant their stated mixed recovery, movement, area and focus effects',()=>{
 const p=equipped('sageregalia');near(p.move,hero('goku').move*1.3);near(p.dodge,.15);near(p.area,1.45);near(p.regen,1.6);near(p.healing,1.15);near(p.cooldown,.94);near(p.magnet,115*1.09);near(p.damage,1.09);near(p.damageReduction,.06);near(p.maxHp,hero('goku').hp);near(ultimateCooldown(p),60*.94);
});

test('Chozo ingredients grant combined HP, armor and mobility while freeze resistance stays capped',()=>{
 const p=equipped('chozosuit');near(p.maxHp,hero('goku').hp+69);near(p.damageReduction,.165);near(p.move,hero('goku').move*1.09);near(p.dodge,.03);near(p.magnet,115*1.15);near(p.freezeResistance,.3);p.passives.demonextract=3;refreshStats(p);near(p.freezeResistance,.9);
});

test('witch relics grant damage, area, collection and cooldown effects before assembly',()=>{
 const p=equipped('witcharchive');near(p.damage,1.27);near(p.area,1.24);near(p.magnet,115*1.15);near(p.cooldown,.94);near(p.regen,1);near(p.dodge,0);near(ultimateCooldown(p),60*.94);
});

test('each composite consumes all source items, frees the correct slots, preserves stats and cannot grow again on refresh',()=>{
 for(const [id,ingredients]of Object.entries(parts)){const p=equipped(id),before=stats(p);p.hp=57;p.shieldTimer=6.5;const shield=p.shield;for(const key of ingredients)p.cooldowns[key]=7;assert.ok(train(p,id));assert.deepEqual(p.passives,{[id]:1});assert.equal(p.fusions[id],id);assert.equal(p.hp,57);assert.equal(p.shield,shield);assert.equal(p.shieldTimer,6.5);assert.equal(ingredients.length-Object.keys(p.passives).length,ingredients.length-1);for(const key of ingredients){assert.equal(effectivePassiveRank(p,key),3);assert.equal(p.cooldowns[key],undefined);assert.ok(consumedFusionIngredient(p,key));assert.equal(applyChoice(p,{kind:'item',id:key}),false);assert.ok(!getUpgradePool(p).some(c=>c.kind==='item'&&c.id===key));}for(let n=0;n<4;n++)refreshStats(p);assert.deepEqual(stats(p),before);assert.equal(train(p,id),false);}
});

test('absorbed legacy supports still unlock their original weapon evolutions',()=>{
 for(const [id,weapons,evolutions]of [['sageregalia',['shuriken','kunai'],['rasen','raijin']],['chozosuit',['powerbeam'],['plasmabeam']],['witcharchive',['quill'],['finalchapter']]]){const p=equipped(id);assert.ok(train(p,id));for(const weapon of weapons)p.weapons[weapon]=5;for(const evolution of evolutions){assert.ok(fusionReady(p,recipe(evolution)),evolution+' remains available');assert.ok(train(p,evolution));}assert.equal(p.passives[id],1);}
});

test('Featherine keeps Memory Fragment Authority gain for connected hits and kills after the Archive absorbs it',()=>{
 const g=createRun(hero('featherine'));g.p=equipped('witcharchive','featherine');g.p.meta.authorityGain=.15;heroAuthorityHit(g);near(g.mechanic.value,8*1.45);g.mechanic.value=0;assert.ok(train(g.p,'witcharchive'));assert.equal(g.p.passives.memoryfragment,undefined);heroAuthorityHit(g);near(g.mechanic.value,8*1.45);g.mechanic.value=0;heroKill(g,{boss:false,elite:false});near(g.mechanic.value,6*1.45);g.mechanic.value=0;heroKill(g,{boss:true});near(g.mechanic.value,24*1.45);
});

test('an Adaptive Barrier can be absorbed into Chozo while preserving its extra shield, fast recharge and AT Field recipe',()=>{
 const p=adaptive(),before=stats(p);p.hp=63;p.shield=12;p.shieldTimer=6.25;assert.ok(fusionReady(p,recipe('chozosuit')));assert.ok(train(p,'chozosuit'));assert.equal(p.chozoBarrier,true);assert.equal(p.fusions.energytank,undefined);assert.deepEqual(p.passives,{chozosuit:1});assert.deepEqual(stats(p),before);assert.equal(p.hp,63);assert.equal(p.shield,12);assert.equal(p.shieldTimer,6.25);assert.equal(effectivePassiveRank(p,'atfield'),3);assert.equal(p.maxShield,53);assert.equal(p.shieldRecharge,7);near(p.damageReduction,.285);assert.ok(consumedFusionIngredient(p,'atfield'));assert.equal(applyChoice(p,{kind:'item',id:'atfield'}),false);p.weapons.pallet=5;assert.ok(fusionReady(p,recipe('positron')));assert.ok(train(p,'positron'));refreshStats(p);assert.equal(p.maxShield,53);assert.equal(p.shieldRecharge,7);
});

test('Chozo ancestry grants no shield or absorbed AT rank without a real formed suit and does not leak into plain suits',()=>{
 const p=adaptive();assert.ok(train(p,'chozosuit'));delete p.passives.chozosuit;refreshStats(p);assert.equal(hasComposite(p,'chozosuit'),false);assert.equal(effectivePassiveRank(p,'atfield'),0);assert.equal(p.maxShield,0);assert.equal(p.shieldRecharge,10);near(p.damageReduction,0);
 const forged=createPlayer(hero('goku'));forged.chozoBarrier=true;refreshStats(forged);assert.equal(effectivePassiveRank(forged,'atfield'),0);assert.equal(forged.maxShield,0);forged.passives={chozosuit:1};refreshStats(forged);assert.equal(hasComposite(forged,'chozosuit'),false);assert.equal(effectivePassiveRank(forged,'atfield'),0);
 const plain=equipped('chozosuit');plain.chozoBarrier=true;assert.ok(train(plain,'chozosuit'));assert.equal(plain.chozoBarrier,false);assert.equal(plain.maxShield,0);
});

test('ordinary level-ups and chests offer complete set fusions without chance gates or changing equipment during forecasts',()=>{
 for(const id of Object.keys(parts))for(const roll of [0,.5,.99]){const p=equipped(id),before=structuredClone(p);assert.equal(getChoices(p,()=>roll)[0].id,id);const rewards=chestOffers(p,3,()=>roll);assert.equal(rewards[0].id,id);assert.deepEqual(p,before);assert.ok(rewards.every(c=>!(c.kind==='item'&&ITEMS[c.id].fusionOnly)));}
});

test('composite results never appear as raw items, configured rewards or foreign Hardcore equipment',()=>{
 for(const character of CHARACTERS){const p=createPlayer(character),pool=getUpgradePool(p),hardcore=createHardcoreRun(character);for(const id of Object.keys(parts)){assert.ok(!pool.some(c=>c.kind==='item'&&c.id===id));assert.equal(applyChoice(p,{kind:'item',id,maxLevel:true}),false);const forged=equipped(id,character.id);forged.hardcore=true;assert.equal(fusionReady(forged,recipe(id)),false);}for(const id of additions){assert.ok(pool.some(c=>c.kind==='item'&&c.id===id));assert.ok(!getUpgradePool(hardcore.p).some(c=>c.id===id));assert.equal(applyChoice(hardcore.p,{kind:'item',id}),false);}}
 const g=createBossRushRun(hero('goku'));for(const id of Object.keys(parts)){assert.ok(!getRushDraftPool(g).some(c=>c.id===id));assert.equal(configureRushLoadout(g,{weapons:['ki'],passives:['senzu',id]}),false);}
});

test('Boss Rush refills every slot freed by each set with maxed picks and keeps absorbed sources blocked',()=>{
 for(const [id,character]of [['sageregalia','naruto'],['chozosuit','samus'],['witcharchive','featherine']]){const g=createBossRushRun(hero(character)),weapons=[...new Set([hero(character).weapon,'ki','blue','orbit','clockshot','pallet'])].slice(0,5),passives=[...parts[id],...(parts[id].length===4?['power']:[])];assert.ok(configureRushLoadout(g,{weapons,passives}));assert.ok(evolveRushWeapon(g,id));assert.equal(g.status,'rush-draft');assert.equal(Object.keys(g.p.passives).length,6-parts[id].length);assert.equal(beginBossRush(g),false);let picks=0;while(g.status==='rush-draft'){const choice=getRushDraftChoices(g)[0];assert.ok(choice&&!parts[id].includes(choice.id)&&!ITEMS[choice.id].fusionOnly);assert.ok(chooseRushDraft(g,choice.id));assert.equal(g.p.passives[choice.id],ITEMS[choice.id].max);picks++;}assert.equal(picks,parts[id].length-1);assert.equal(g.p.passives[id],1);assert.ok(beginBossRush(g));const storage=memory();assert.ok(saveRun(g,storage));const loaded=loadRun(storage);assert.ok(loaded);assert.equal(loaded.p.passives[id],1);assert.equal(loaded.p.fusions[id],id);assert.equal(Object.keys(loaded.p.passives).length,5);}
});

test('each composite and Adaptive ancestry retain accepted choices and stable stats across checkpoint reloads',()=>{
 for(const [id,ancestry]of [['sageregalia',false],['chozosuit',false],['chozosuit',true],['witcharchive',false]]){const g=createRun(hero('goku'));g.p=ancestry?adaptive():equipped(id);g.status='chest';g.chestVersion=2;g.chestIndex=0;g.rewards=[{kind:'fusion',id}];const storage=memory();assert.ok(saveRun(g,storage));let loaded=loadRun(storage);assert.ok(loaded);assert.equal(loaded.resumeStatus,'chest');loaded.status='chest';assert.ok(resolveChestReward(loaded,true,()=>.99));const before=stats(loaded.p);assert.equal(loaded.p.passives[id],1);assert.equal(loaded.rewards[0].decision,'taken');assert.ok(saveRun(loaded,storage));loaded=loadRun(storage);assert.ok(loaded);assert.equal(loaded.chestIndex,1);assert.equal(loaded.rewards[0].decision,'taken');assert.equal(loaded.p.passives[id],1);for(let n=0;n<3;n++)refreshStats(loaded.p);assert.deepEqual(stats(loaded.p),before);if(ancestry){assert.equal(loaded.p.chozoBarrier,true);assert.equal(effectivePassiveRank(loaded.p,'atfield'),3);assert.equal(loaded.p.shieldRecharge,7);}}
});

test('two complete sets coexist within the five-slot progression without duplicating shared statistics',()=>{
 const p=equipped('sageregalia');assert.ok(train(p,'sageregalia'));for(const key of parts.chozosuit)for(let n=0;n<3;n++)assert.ok(applyChoice(p,{kind:'item',id:key}));assert.equal(Object.keys(p.passives).length,5);assert.ok(train(p,'chozosuit'));assert.deepEqual(p.passives,{sageregalia:1,chozosuit:1});near(p.damage,1.09);near(p.area,1.45);near(p.move,hero('goku').move*1.39);near(p.dodge,.18);near(p.damageReduction,.225);near(p.maxHp,hero('goku').hp+69);near(p.magnet,115*1.24);near(p.freezeResistance,.3);for(let n=0;n<4;n++)refreshStats(p);near(p.damageReduction,.225);near(p.move,hero('goku').move*1.39);
});
