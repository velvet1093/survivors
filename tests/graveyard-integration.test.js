import test from 'node:test';
import assert from 'node:assert/strict';
import {CHARACTERS,MAPS,ignoreChest} from '../src/game.js';
import {createRun,createHardcoreRun,createBossRushRun,spawnEnemy,updateRun,activateEventTrinket} from '../src/engine.js';
import {BOSSES,ENEMIES,REGULAR_BOSS_IDS,MAP_ENEMIES,MAP_BOSSES,updateEnemyAI} from '../src/enemies.js';
import {naturalWorldEventsFor,canStartWorldEvent} from '../src/world-events.js';
import {chooseRushDraft,getRushDraftChoices,beginBossRush} from '../src/boss-rush.js';
import {finishBossIntro} from '../src/boss-intro.js';
import {dropTrinket,collectNearbyTrinket,chooseTrinket} from '../src/trinkets.js';
import {ensureWorld,damageProp,onWater} from '../src/world.js';
import {saveRun,loadRun} from '../src/run-save.js';

const hero=CHARACTERS.find(c=>c.id==='guts'),map=MAPS.findIndex(m=>m.id==='graveyard');
const memory=()=>({data:new Map(),getItem(k){return this.data.get(k)||null},setItem(k,v){this.data.set(k,v)},removeItem(k){this.data.delete(k)}});
function quiet(create=createRun,index=map){
 const g=create(hero,index);g.spawn=g.eliteAt=g.invuln=g.p.nextXp=g.events.nextAt=g.rifts.nextAt=1e9;g.p.regen=0;g.chestRandom=()=>.99;
 for(const id of Object.keys(g.p.weapons))g.p.cooldowns[id]=1e9;
 ensureWorld(g);return g;
}
function resume(g){g.status=g.resumeStatus||'playing';delete g.resumeStatus;g.chestRandom=()=>.99;return g;}
function sim(g,seconds){for(let t=0;t<seconds-1e-8;t+=.02)updateRun(g,Math.min(.02,seconds-t));}
function equip(g,id,slot=0){const d=dropTrinket(g,id,g.p.x,g.p.y);assert.ok(d);d.age=.5;g.p.moving=true;assert.ok(collectNearbyTrinket(g));assert.ok(chooseTrinket(g,slot));g.p.moving=false;}
const events=[['hollowlantern','ghostparade','peronaparade'],['tombkey','tombwake','ainztomb']];

test('the appended graveyard preserves existing map identities, mode equipment and destroyed world progress',()=>{
 assert.equal(MAPS.length,17);assert.equal(map,16);assert.deepEqual(MAPS.slice(0,16).map(m=>m.id),['garden','ruins','moon','labyrinth','marineford','citadel','castle','forest','zebes','shiganshina','leafvillage','tournament','tempest','tokyo','shibuya','eclipse']);
 assert.deepEqual(MAP_ENEMIES.graveyard,['gravezombie','coffincrawler','lanternwisp','shadowstitch','hollowghost']);assert.deepEqual(MAP_BOSSES.graveyard.slice(0,2),['ryuma','moriah']);
 assert.deepEqual(new Set(MAP_BOSSES.graveyard),new Set(REGULAR_BOSS_IDS));
 for(const create of [createRun,createHardcoreRun,createBossRushRun]){
  const g=quiet(create);assert.equal(g.map.id,'graveyard');assert.ok(g.p.weapons.dragonslayer);assert.ok(g.p.passives.brand);assert.equal(onWater(g.map,650,0,8),false);
  if(g.mode==='hardcore'){assert.deepEqual(Object.keys(g.p.weapons),['dragonslayer']);assert.deepEqual(Object.keys(g.p.passives),['brand']);}
 }
 const g=quiet(),crate=g.world.active.find(o=>o.id==='starter:crate'),store=memory();assert.ok(crate);assert.ok(damageProp(g,crate,999,0,0,()=>.99));g.money=137;g.characterXp=43;
 assert.ok(saveRun(g,store));const loaded=loadRun(store);assert.ok(loaded);assert.equal(loaded.status,'paused');assert.equal(loaded.map.id,'graveyard');assert.equal(loaded.money,137);assert.equal(loaded.characterXp,43);assert.ok(loaded.world.destroyed.has(crate.id));assert.ok(!loaded.world.active.some(o=>o.id===crate.id));
});

test('a saved 31-boss gauntlet appends only the two graveyard opponents and retains its exact active fight',()=>{
 const g=quiet(createBossRushRun,3);while(g.status==='rush-draft')assert.ok(chooseRushDraft(g,getRushDraftChoices(g)[0].id));assert.ok(beginBossRush(g));
 const original=REGULAR_BOSS_IDS.filter(id=>!['ryuma','moriah'].includes(id));assert.equal(original.length,31);Object.assign(g.rush,{order:[...original],total:31,cleared:6,round:7});
 const e=spawnEnemy(g,true,false,original[6]);Object.assign(e,{hp:731,maxHp:6000,x:210,y:-10,speed:0,attackCD:999});g.rush.activeBossId=e.id;g.money=177;g.characterXp=49;g.bossKills=6;g.kills=6;g.time=245;g.p.hp=73;
 const store=memory();assert.ok(saveRun(g,store));const loaded=loadRun(store);assert.ok(loaded);assert.equal(loaded.rush.total,33);assert.deepEqual(loaded.rush.order.slice(0,31),original);assert.deepEqual(loaded.rush.order.slice(31),['ryuma','moriah']);
 assert.deepEqual([loaded.rush.cleared,loaded.rush.round,loaded.rush.activeBossId],[6,7,e.id]);assert.deepEqual([loaded.money,loaded.characterXp,loaded.bossKills,loaded.kills,loaded.time,loaded.p.hp],[177,49,6,6,245,73]);
 assert.equal(loaded.enemies.length,1);assert.equal(loaded.enemies[0].archetype,e.archetype);assert.equal(loaded.enemies[0].hp,731);assert.equal(loaded.enemies[0].maxHp,6000);
 assert.ok(saveRun(loaded,store));const again=loadRun(store);assert.ok(again);assert.deepEqual(again.rush.order,loaded.rush.order);assert.equal(new Set(again.rush.order).size,33);
 for(const [,event,boss]of events){assert.ok(!again.rush.order.includes(boss));assert.equal(BOSSES[boss].eventId,event);}
});

test('Ryuma and Moriah use the real paused warning clock and clear their first-form attacks before the second phase',()=>{
 for(const id of ['ryuma','moriah']){
  const g=quiet(),e=spawnEnemy(g,true,false,id);Object.assign(e,{x:-220,y:0,speed:0,attackCD:0});updateEnemyAI(g,e,.01);const u=structuredClone(e.graveyardAttack),hazards=structuredClone(g.hazards),windup=e.windup;
  assert.ok(u&&hazards.length);assert.ok(hazards.every(h=>h.sourceId===e.id&&h.sourceClock&&h.cancelWithSource));g.freeze=1;g.voidRadius=1000;updateRun(g,.1);assert.deepEqual(e.graveyardAttack,u);assert.deepEqual(g.hazards,hazards);assert.equal(e.windup,windup);
  g.freeze=0;e.hp=e.maxHp*.4;updateRun(g,.01);assert.equal(e.enraged,true);assert.ok(g.bossIntro);assert.equal(e.graveyardAttack,null);assert.ok(!g.hazards.some(h=>h.sourceId===e.id));finishBossIntro(g);
  e.attackCD=0;updateEnemyAI(g,e,.01);assert.ok(e.graveyardAttack);assert.ok(g.hazards.length>=hazards.length);e.attackCD=999;updateEnemyAI(g,e,.17);
  const cast=structuredClone(e.graveyardAttack),marks=structuredClone(g.hazards),store=memory();assert.ok(saveRun(g,store));const loaded=loadRun(store);assert.ok(loaded);assert.equal(loaded.enemies.find(v=>v.id===e.id).enraged,true);assert.deepEqual(loaded.enemies.find(v=>v.id===e.id).graveyardAttack,cast);assert.deepEqual(loaded.hazards,marks);
 }
});

test('graveyard natural events have their own two-entry rotation while other maps retain the existing three',()=>{
 const g=quiet();assert.deepEqual(naturalWorldEventsFor(g).map(v=>v.id),['ghostparade','tombwake']);
 for(const id of ['garden','tokyo','eclipse'])assert.deepEqual(naturalWorldEventsFor({...g,map:MAPS.find(m=>m.id===id)}).map(v=>v.id),['eclipse','storm','blizzard']);
 for(let i=0;i<3;i++){
  const run=quiet();run.events.naturalIndex=i;run.events.nextAt=120;run.time=120;updateRun(run,.01);assert.equal(run.events.active.id,events[i%2][1]);assert.equal(run.events.active.source,'natural');assert.equal(run.events.naturalIndex,i+1);assert.equal(run.enemies.filter(e=>e.eventBoss).length,1);assert.equal(run.enemies.filter(e=>e.eventEnemy).length,4);
  assert.ok(run.enemies.every(e=>ENEMIES[e.archetype]||BOSSES[e.archetype]));
 }
 const rush=quiet(createBossRushRun);assert.equal(canStartWorldEvent({...rush,status:'playing'}),false);const rift=quiet();rift.riftArena={id:'primordialnight'};assert.equal(canStartWorldEvent(rift),false);
});

test('both graveyard event items remain dormant in a saved slot and consume only after an eligible explicit use on another map',()=>{
 for(const [item,event,bossId]of events){
  const g=quiet(createRun,0),store=memory();equip(g,item,1);assert.equal(g.events.active,null);assert.ok(saveRun(g,store));const loaded=loadRun(store);assert.ok(loaded);assert.equal(loaded.trinkets.equipped[1],item);
  const blocker=spawnEnemy(loaded,true,false,'frieza');blocker.attackCD=1e9;const before=structuredClone(loaded.trinkets);assert.equal(activateEventTrinket(loaded,1),false);assert.deepEqual(loaded.trinkets,before);assert.equal(loaded.status,'paused');assert.equal(loaded.events.active,null);
  loaded.enemies=[];assert.ok(activateEventTrinket(loaded,1));assert.equal(loaded.map.id,'garden');assert.equal(loaded.events.active.id,event);assert.equal(loaded.trinkets.equipped[1],null);assert.equal(loaded.enemies.filter(e=>e.archetype===bossId).length,1);assert.equal(activateEventTrinket(loaded,1),false);
  assert.ok(saveRun(loaded,store));const again=loadRun(store);assert.ok(again);assert.equal(again.trinkets.equipped[1],null);assert.equal(again.events.active.id,event);assert.equal(again.enemies.filter(e=>e.eventBoss).length,1);
 }
});

test('active graveyard event casts, invader limits and ordinary wave budgets survive a paused checkpoint exactly',()=>{
 for(const [item,event]of events){
  const g=quiet(),store=memory();equip(g,item);assert.ok(activateEventTrinket(g,0));finishBossIntro(g);const e=g.enemies.find(e=>e.eventBoss);e.attackCD=0;updateRun(g,.02);updateRun(g,.2);assert.ok(e.worldEventAttack);assert.ok(g.hazards.length);
  const active=structuredClone(g.events.active),u=structuredClone(e.worldEventAttack),hazards=structuredClone(g.hazards),wave=structuredClone(g.waveState);assert.ok(saveRun(g,store));const loaded=loadRun(store);assert.ok(loaded);assert.equal(loaded.events.active.id,event);assert.deepEqual(loaded.events.active,active);assert.deepEqual(loaded.enemies.find(v=>v.eventBoss).worldEventAttack,u);assert.deepEqual(loaded.hazards,hazards);assert.deepEqual(loaded.waveState,wave);
  const time=loaded.time;updateRun(loaded,5);assert.equal(loaded.time,time);assert.deepEqual(loaded.events.active,active);resume(loaded);updateRun(loaded,.02);assert.ok(loaded.events.active.age>active.age);assert.deepEqual(loaded.waveState,wave);assert.equal(loaded.enemies.filter(v=>v.eventBoss).length,1);assert.ok(loaded.enemies.filter(v=>v.eventEnemy&&v.hp>0).length<=6);
 }
});

test('each graveyard event waits for surviving invaders and pays one normal three-choice cache across reload',()=>{
 for(const [item]of events){
  const g=quiet(),store=memory();equip(g,item);const ordinary=spawnEnemy(g,false,false,'soldier');Object.assign(ordinary,{x:1200,y:0,attackCD:1e9,speed:0});assert.ok(activateEventTrinket(g,0));finishBossIntro(g);const e=g.enemies.find(e=>e.eventBoss),wave=structuredClone(g.waveState);e.hp=0;e.enraged=true;sim(g,1.8);
  assert.ok(g.events.active);assert.equal(g.money,0);assert.equal(g.bossKills,1);assert.equal(g.chests.length,0);assert.deepEqual(g.waveState,wave);for(const add of g.enemies)if(add.eventEnemy)add.hp=0;updateRun(g,.02);updateRun(g,.02);
  assert.equal(g.events.active,null);assert.equal(g.events.history.length,1);assert.equal(g.money,300);assert.equal(g.bossKills,1);assert.equal(g.status,'chest');assert.equal(g.chestKind,'event');assert.equal(g.rewards.length,3);assert.ok(g.enemies.some(v=>v.id===ordinary.id));
  assert.ok(ignoreChest(g));g.status='playing';g.gems=[];assert.ok(saveRun(g,store));const loaded=resume(loadRun(store));const paid=[loaded.money,loaded.characterXp,loaded.bossKills];updateRun(loaded,.03);assert.deepEqual([loaded.money,loaded.characterXp,loaded.bossKills],paid);assert.equal(loaded.events.history.length,1);assert.equal(loaded.events.active,null);
 }
});
