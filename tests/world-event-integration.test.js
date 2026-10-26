import test from 'node:test';
import assert from 'node:assert/strict';
import {CHARACTERS,ignoreChest} from '../src/game.js';
import {createRun,createHardcoreRun,createBossRushRun,activateEventTrinket,spawnEnemy,updateRun,resolveRift} from '../src/engine.js';
import {dropTrinket,collectNearbyTrinket,chooseTrinket} from '../src/trinkets.js';
import {saveRun,loadRun,RUN_SAVE_KEY} from '../src/run-save.js';
import {finishBossIntro} from '../src/boss-intro.js';
import {ensureWorld} from '../src/world.js';
import {WORLD_EVENT_FIRST_AT} from '../src/world-events.js';

const hero=CHARACTERS.find(c=>c.id==='guts');
const memory=()=>({data:new Map(),getItem(k){return this.data.get(k)||null;},setItem(k,v){this.data.set(k,v);},removeItem(k){this.data.delete(k);}});
function quiet(create=createRun){
 const g=create(hero,3);g.invuln=1e6;g.p.nextXp=1e9;g.spawn=g.eliteAt=1e9;g.rifts.nextAt=1e9;g.chestRandom=()=>.99;g.p.regen=0;
 for(const id of Object.keys(g.p.weapons))g.p.cooldowns[id]=1e9;
 ensureWorld(g);for(const o of g.world.objects.values())o.hp=0;g.world.active=[];g.world.circles=[];return g;
}
function equip(g,id,slot=0){const drop=dropTrinket(g,id,g.p.x,g.p.y);assert.ok(drop);drop.age=.5;g.p.moving=true;assert.ok(collectNearbyTrinket(g));assert.ok(chooseTrinket(g,slot));g.p.moving=false;}
function resume(g){g.status=g.resumeStatus;delete g.resumeStatus;g.chestRandom=()=>.99;return g;}
function steps(g,seconds){for(let t=0;t<seconds;t+=.02)updateRun(g,.02);}

// These tests use the actual engine callback, rather than a successful stub, so
// starting, consuming, saving and finishing the encounter share one transaction.
test('carried Beherit survives a checkpoint, activates from paused details and cannot activate twice',()=>{
 const g=quiet(),store=memory();equip(g,'beherit',1);assert.equal(g.events.active,null);assert.ok(saveRun(g,store));
 const loaded=loadRun(store);assert.equal(loaded.status,'paused');assert.equal(loaded.resumeStatus,'playing');assert.equal(loaded.trinkets.equipped[1],'beherit');
 assert.ok(activateEventTrinket(loaded,1));assert.equal(loaded.status,'playing');assert.equal(loaded.resumeStatus,undefined);assert.equal(loaded.trinkets.equipped[1],null);assert.equal(loaded.events.active.id,'eclipse');assert.ok(loaded.bossIntro);assert.equal(loaded.enemies.filter(e=>e.eventBoss).length,1);assert.equal(loaded.enemies.filter(e=>e.eventEnemy).length,4);
 const ids=loaded.enemies.map(e=>e.id);assert.equal(activateEventTrinket(loaded,1),false);assert.deepEqual(loaded.enemies.map(e=>e.id),ids);
 assert.ok(saveRun(loaded,store));const after=loadRun(store);assert.equal(after.trinkets.equipped[1],null);assert.equal(after.events.active.serial,1);assert.equal(after.enemies.filter(e=>e.eventBoss).length,1);
});

test('actual rejected starts preserve the item, pause state and ordinary encounter',()=>{
 const setups=[g=>{spawnEnemy(g,true,false,'frieza');},g=>{g.rifts.portal={bossId:'beerus',serial:1,x:400,y:0};},g=>{g.wave=5;g.waveState.index=5;g.waveState.bossSpawned=false;}];
 for(const setup of setups){const g=quiet();equip(g,'beherit');setup(g);g.status='paused';g.resumeStatus='playing';const before=structuredClone(g.trinkets),ids=g.enemies.map(e=>e.id);assert.equal(activateEventTrinket(g,0),false);assert.deepEqual(g.trinkets,before);assert.equal(g.status,'paused');assert.equal(g.resumeStatus,'playing');assert.equal(g.events.active,null);assert.deepEqual(g.enemies.map(e=>e.id),ids);}
});

test('weather and natural event arrivals respect simulation pauses, ordinary bosses, rifts and Boss Rush',()=>{
 const g=quiet(createHardcoreRun);g.time=WORLD_EVENT_FIRST_AT;g.status='paused';updateRun(g,20);assert.equal(g.events.active,null);assert.equal(g.events.weather.age,0);g.status='playing';
 const boss=spawnEnemy(g,true,false,'frieza');boss.attackCD=1e9;updateRun(g,.01);assert.equal(g.events.active,null);g.enemies=[];
 g.rifts.portal={bossId:'beerus',serial:1,x:1000,y:0,age:0};updateRun(g,.01);assert.equal(g.events.active,null);g.rifts.portal=null;
 updateRun(g,.01);assert.equal(g.events.active.id,'eclipse');assert.equal(g.events.active.source,'natural');assert.ok(g.bossIntro);const age=g.events.active.age;updateRun(g,.2);assert.equal(g.events.active.age,age,'entrance freezes the event clock');
 const rush=quiet(createBossRushRun);rush.time=10000;rush.trinkets.equipped[0]='beherit';assert.equal(activateEventTrinket(rush,0),false);updateRun(rush,30);assert.equal(rush.events.active,null);assert.equal(rush.events.weather.age,0);assert.equal(rush.trinkets.equipped[0],'beherit');
});

test('mid-cast event checkpoints retain exact telegraphs, weather, item consumption and suspended wave budget',()=>{
 const g=quiet(),store=memory();equip(g,'raigodrum');g.waveState.spawned=5;g.events.weather={id:'rain',index:1,age:23.5,duration:60};assert.ok(activateEventTrinket(g,0));finishBossIntro(g);const boss=g.enemies.find(e=>e.eventBoss);boss.attackCD=0;updateRun(g,.02);updateRun(g,.3);assert.ok(boss.worldEventAttack);assert.ok(g.hazards.length);const cast=structuredClone(boss.worldEventAttack),hazards=structuredClone(g.hazards),active=structuredClone(g.events.active),wave=structuredClone(g.waveState);
 assert.ok(saveRun(g,store));const loaded=loadRun(store);assert.ok(loaded);assert.equal(loaded.trinkets.equipped[0],null);assert.deepEqual(loaded.events.active,active);assert.deepEqual(loaded.enemies.find(e=>e.eventBoss).worldEventAttack,cast);assert.deepEqual(loaded.hazards,hazards);assert.deepEqual(loaded.events.weather,g.events.weather);assert.deepEqual(loaded.waveState,wave);
 const clock=loaded.time;updateRun(loaded,2);assert.equal(loaded.time,clock);resume(loaded);updateRun(loaded,.02);assert.ok(loaded.events.active.age>active.age);assert.deepEqual(loaded.waveState,wave);assert.equal(loaded.enemies.filter(e=>e.eventBoss).length,1);
});

test('event victory waits for adds, grants one three-reward cache, and returns to its existing ordinary wave',()=>{
 const g=quiet(),store=memory();equip(g,'frostseal');const ordinary=spawnEnemy(g,false,false,'soldier');Object.assign(ordinary,{x:1200,y:0,attackCD:1e9});g.waveState.spawned=4;assert.ok(activateEventTrinket(g,0));finishBossIntro(g);const boss=g.enemies.find(e=>e.eventBoss),wave=structuredClone(g.waveState);boss.hp=0;steps(g,1.7);
 assert.equal(g.bossKills,1);assert.equal(g.characterXp,60);assert.ok(g.events.active);assert.equal(g.money,0);assert.deepEqual(g.waveState,wave);assert.equal(g.chests.length,0);
 for(const e of g.enemies)if(e.eventEnemy)e.hp=0;updateRun(g,.02);updateRun(g,.02);assert.equal(g.events.active,null);assert.equal(g.events.history.length,1);assert.equal(g.money,300);assert.equal(g.bossKills,1);assert.equal(g.characterXp,64);assert.equal(g.status,'chest');assert.equal(g.chestKind,'event');assert.equal(g.rewards.length,3);assert.ok(g.enemies.some(e=>e.id===ordinary.id));assert.deepEqual(g.waveState,{...wave,elapsed:wave.elapsed+.02});assert.equal(g.events.nextAt,g.time+240);
 assert.ok(ignoreChest(g));g.status='playing';g.gems=[];assert.ok(saveRun(g,store));const loaded=resume(loadRun(store));const paid=[loaded.money,loaded.characterXp,loaded.bossKills];loaded.spawn=0;updateRun(loaded,.01);assert.deepEqual([loaded.money,loaded.characterXp,loaded.bossKills],paid);assert.equal(loaded.events.history.length,1);assert.ok(loaded.waveState.spawned>wave.spawned,'ordinary wave budget resumes');assert.equal(loaded.events.active,null);assert.equal(resolveRift(loaded,true),false);
});

test('legacy saved runs gain a full event grace period instead of an immediate overdue boss',()=>{
 const g=quiet(),store=memory();g.time=500;assert.ok(saveRun(g,store));const snapshot=JSON.parse(store.getItem(RUN_SAVE_KEY));delete snapshot.run.events;store.setItem(RUN_SAVE_KEY,JSON.stringify(snapshot));const loaded=loadRun(store);assert.ok(loaded);assert.equal(loaded.events.nextAt,500+WORLD_EVENT_FIRST_AT);resume(loaded);updateRun(loaded,.01);assert.equal(loaded.events.active,null);assert.equal(loaded.events.weather.id,'clear');
});
