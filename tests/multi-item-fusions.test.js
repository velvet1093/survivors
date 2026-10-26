import test from 'node:test';
import assert from 'node:assert/strict';
import {CHARACTERS,ITEMS,FUSIONS,createPlayer,refreshStats,fusionBase,fusionType,fusionIngredients,fusionConsumedIngredients,fusionReady,consumedFusionIngredient,effectivePassiveRank,applyChoice,getUpgradePool,chestOffers} from '../src/game.js';
import {createRun,createBossRushRun} from '../src/engine.js';
import {configureRushLoadout,evolveRushWeapon,getRushDraftPool,getRushDraftChoices,chooseRushDraft,beginBossRush} from '../src/boss-rush.js';
import {castMultiItemFusion,updateMultiItemShot} from '../src/multi-item-fusions.js';
import {saveRun,loadRun} from '../src/run-save.js';
const hero=id=>CHARACTERS.find(c=>c.id===id),recipe=id=>FUSIONS.find(f=>f.id===id);
const added=['chimeragarden','rasenflash','panaceapouch','adaptivebarrier'];
function equipped(id){const p=createPlayer(hero('goku')),f=recipe(id);p.weapons={};p.passives={};for(const item of fusionIngredients(f))(ITEMS[item].type==='weapon'?p.weapons:p.passives)[item]=ITEMS[item].max;refreshStats(p);return p;}
const enemy=(id,x,y=0)=>({id,x,y,hp:10000,maxHp:10000,r:12});
const api={damage(g,e,amount){e.hp-=amount;},burst(){}};

test('new multi-item recipes require every maxed ingredient, retain their base and free the consumed category',()=>{
 for(const id of added){const f=recipe(id),p=equipped(id),type=fusionType(f)==='weapon'?'weapons':'passives';
  assert.equal(fusionReady(p,f),true);
  for(const ingredient of fusionIngredients(f)){const inventory=ITEMS[ingredient].type==='weapon'?p.weapons:p.passives;inventory[ingredient]--;assert.equal(fusionReady(p,f),false,ingredient);inventory[ingredient]++;}
  const slots=Object.keys(p[type]).length;assert.ok(applyChoice(p,{kind:'fusion',id}));assert.equal(p.fusions[fusionBase(f)],id);assert.equal(Object.keys(p[type]).length,slots-1);
  for(const ingredient of fusionConsumedIngredients(f)){assert.equal(p[type][ingredient],undefined);assert.ok(consumedFusionIngredient(p,ingredient));assert.ok(!getUpgradePool(p).some(c=>c.id===ingredient));assert.equal(applyChoice(p,{kind:'item',id:ingredient}),false);}
  assert.equal(applyChoice(p,{kind:'fusion',id}),false);
 }
});
test('dual-active recipes cannot consume already evolved secondary weapons',()=>{
 for(const [id,secondary,evolution]of [['chimeragarden','nue','stormnue'],['rasenflash','kunai','raijin']]){const p=equipped(id);p.fusions[secondary]=evolution;assert.equal(fusionReady(p,recipe(id)),false);}
});
test('Panacea Pouch retains Senzu health and healing, improves recovery, and still enables Kamehameha',()=>{
 const p=equipped('panaceapouch');p.weapons.ki=5;p.hp=75;const before={hp:p.maxHp,regen:p.regen,healing:p.healing};
 assert.ok(applyChoice(p,{kind:'fusion',id:'panaceapouch'}));assert.equal(p.hp,75);assert.equal(p.maxHp,before.hp);assert.equal(p.regen,before.regen+1);assert.equal(p.healing,before.healing+.25);assert.equal(effectivePassiveRank(p,'senzu'),3);assert.equal(p.passives.senzu,undefined);assert.ok(fusionReady(p,recipe('kamehameha')));
 assert.ok(applyChoice(p,{kind:'fusion',id:'kamehameha'}));refreshStats(p);assert.equal(p.maxHp,before.hp);assert.equal(p.regen,before.regen+1);
});
test('Adaptive Barrier retains both ingredients and strengthens shield recharge without repeated stat growth',()=>{
 const p=equipped('adaptivebarrier');p.weapons.pallet=5;p.shield=10;const before={hp:p.maxHp,shield:p.maxShield,resistance:p.damageReduction};
 assert.ok(applyChoice(p,{kind:'fusion',id:'adaptivebarrier'}));assert.equal(p.maxHp,before.hp);assert.equal(p.maxShield,before.shield+20);assert.equal(p.shield,30);assert.equal(p.damageReduction,before.resistance);assert.equal(p.shieldRecharge,7);assert.equal(effectivePassiveRank(p,'atfield'),3);assert.ok(fusionReady(p,recipe('positron')));
 refreshStats(p);refreshStats(p);assert.equal(p.maxShield,before.shield+20);assert.ok(applyChoice(p,{kind:'fusion',id:'positron'}));assert.equal(p.shieldRecharge,7);
});
test('normal chests guarantee eligible passive fusions and forecast later rewards using freed slots',()=>{
 for(const id of ['panaceapouch','adaptivebarrier']){const p=equipped(id),before=structuredClone(p),offers=chestOffers(p,3,()=>0);assert.equal(offers[0].kind,'fusion');assert.equal(offers[0].id,id);assert.ok(offers.slice(1).some(c=>c.kind==='item'));assert.deepEqual(p,before);}
});
test('Boss Rush reopens max-item drafting after passive fusion and never offers its absorbed ingredient',()=>{
 const g=createBossRushRun(hero('maomao'));
 assert.ok(configureRushLoadout(g,{weapons:['poison','ki','blue','orbit','pallet'],passives:['herbs','senzu','energytank','atfield','power']}));
 assert.ok(evolveRushWeapon(g,'panaceapouch'));assert.equal(g.status,'rush-draft');assert.equal(beginBossRush(g),false);assert.ok(getRushDraftPool(g).every(c=>ITEMS[c.id].type==='passive'&&c.id!=='senzu'));assert.ok(chooseRushDraft(g,getRushDraftChoices(g)[0].id));assert.equal(g.status,'rush-fusion');
 assert.ok(evolveRushWeapon(g,'adaptivebarrier'));assert.equal(g.status,'rush-draft');assert.ok(getRushDraftPool(g).every(c=>!['senzu','atfield'].includes(c.id)));assert.ok(chooseRushDraft(g,getRushDraftChoices(g)[0].id));assert.ok(beginBossRush(g));assert.equal(g.p.fusions.herbs,'panaceapouch');assert.equal(g.p.fusions.energytank,'adaptivebarrier');
});
test('Chimera Shadow Garden unites both shikigami weapons and pulses damaging shadow control',()=>{
 const g=createRun(hero('megumi'));g.p=equipped('chimeragarden');g.p.id='megumi';g.p.weapon='shadows';applyChoice(g.p,{kind:'fusion',id:'chimeragarden'});g.enemies=[enemy(100,60),enemy(101,800)];
 assert.ok(castMultiItemFusion(g,'shadows',g.enemies[0],2,{duration:1.2}));assert.deepEqual(g.summons.map(s=>s.kind).sort(),['blackDog','nue','whiteDog']);assert.ok(g.summons.every(s=>s.fused));const field=g.shots.find(s=>s.type==='chimeragarden');assert.ok(Math.abs(field.max-5.4)<1e-9);
 assert.ok(updateMultiItemShot(g,field,.02,api));assert.ok(g.enemies[0].hp<10000);assert.equal(g.enemies[1].hp,10000);assert.ok(g.enemies[0].statuses.cursed);assert.ok(g.enemies[0].statuses.slow);assert.ok(g.enemies[0].kvx<0);
 const hp=g.enemies[0].hp;updateMultiItemShot(g,field,.7,api);assert.ok(g.enemies[0].hp<hp);assert.ok(castMultiItemFusion(g,'shadows',g.enemies[0],2));assert.equal(field.life,0);assert.equal(g.shots.filter(s=>s.type==='chimeragarden'&&s.life>0).length,1);
});
test('Rasen Flash hits four distinct marks with wind blasts, visible jumps, and no player teleport',()=>{
 const g=createRun(hero('naruto'));g.p=equipped('rasenflash');g.p.weapon='shuriken';applyChoice(g.p,{kind:'fusion',id:'rasenflash'});g.enemies=[100,230,360,490,620].map((x,i)=>enemy(i+100,x));
 assert.ok(castMultiItemFusion(g,'shuriken',g.enemies[0],2));const shot=g.shots[0];for(let i=0;i<100&&shot.life>0;i++)assert.ok(updateMultiItemShot(g,shot,.02,api));
 assert.equal(shot.hits.size,4);assert.ok(g.enemies.slice(0,4).every(e=>e.hp<10000&&e.statuses.bleeding));assert.equal(g.enemies[4].hp,10000);assert.ok(g.effects.filter(e=>e.type==='lightning').length===3);assert.equal(g.p.x,0);assert.equal(g.p.y,0);assert.equal(shot.life,0);
 assert.equal(updateMultiItemShot(g,{type:'ki'},.02,api),false);
});
test('checkpoints preserve combined passives, consumed summon slots and the state of fusion attacks',()=>{
 const storage={data:new Map(),getItem(k){return this.data.get(k);},setItem(k,v){this.data.set(k,v);},removeItem(k){this.data.delete(k);}};
 const g=createRun(hero('megumi'));g.p.weapons={shadows:5,nue:5,shuriken:5,kunai:5};g.p.passives={talisman:3,scroll:3,herbs:3,senzu:3};refreshStats(g.p);
 for(const id of ['chimeragarden','rasenflash','panaceapouch'])assert.ok(applyChoice(g.p,{kind:'fusion',id}));g.enemies=[enemy(100,100),enemy(101,230)];castMultiItemFusion(g,'shadows',g.enemies[0],2);castMultiItemFusion(g,'shuriken',g.enemies[0],2);const flash=g.shots.find(s=>s.type==='rasenflash');updateMultiItemShot(g,flash,.15,api);
 assert.ok(saveRun(g,storage));const restored=loadRun(storage);assert.ok(restored);assert.equal(restored.p.weapons.nue,undefined);assert.equal(restored.p.weapons.kunai,undefined);assert.equal(restored.p.passives.senzu,undefined);assert.equal(effectivePassiveRank(restored.p,'senzu'),3);assert.equal(restored.p.regen,g.p.regen);assert.equal(restored.p.fusions.herbs,'panaceapouch');assert.deepEqual(restored.shots.find(s=>s.type==='rasenflash').hits,flash.hits);assert.equal(restored.shots.find(s=>s.type==='rasenflash').jumpDelay,flash.jumpDelay);assert.ok(restored.shots.some(s=>s.type==='chimeragarden'));
});
