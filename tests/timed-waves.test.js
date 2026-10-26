import test from 'node:test';
import assert from 'node:assert/strict';
import {WAVE_MAX_SECONDS,WAVE_ENEMY_LIMIT,newWaveState,ensureWaveState,updateWaves,waveProgress} from '../src/waves.js';
import {CHARACTERS} from '../src/game.js';
import {createRun,spawnEnemy,updateRun} from '../src/engine.js';
import {saveRun,loadRun} from '../src/run-save.js';

const run=(index=1)=>({mode:'survival',status:'playing',wave:index,time:0,waveState:newWaveState(index),enemies:[],bossDeaths:[],rifts:{},events:{active:null},p:{meta:{}},spawn:9999,id:0,kills:0,characterXp:0,money:0});
const spawn=(g,boss=false,elite=false)=>{const e={id:++g.id,hp:100,maxHp:100,boss,elite,bossChoice:g.nextBossWave};g.enemies.push(e);return e;};
const pendingDeath=(g,e)=>e.boss&&e.hp<=0&&!e.deathComplete;
const api={spawn,pendingDeath};
const memory=()=>({data:new Map(),getItem(k){return this.data.get(k)||null;},setItem(k,v){this.data.set(k,v);},removeItem(k){this.data.delete(k);}});

test('survival and hardcore force exactly one next wave at sixty active seconds while preserving unfinished enemies',()=>{
 for(const mode of ['survival','hardcore']){
  const g=run();g.mode=mode;const enemy=spawn(g);enemy.hp=42;g.waveState.elapsed=59.99;g.waveState.spawned=g.waveState.budget;
  updateWaves(g,.009,api);assert.equal(g.wave,1);assert.ok(waveProgress(g).remainingTime>0);
  updateWaves(g,.001,api);assert.equal(g.wave,2);assert.equal(g.waveState.elapsed,0);assert.equal(waveProgress(g).remainingTime,WAVE_MAX_SECONDS);assert.equal(g.enemies[0],enemy);assert.equal(enemy.hp,42);assert.equal(g.kills,0);assert.equal(g.characterXp,0,'unfinished waves give no clear bonus');assert.equal(g.spawn,0);assert.ok(g.checkpointRequested);
  updateWaves(g,.01,api);assert.ok(g.waveState.spawned>0);assert.ok(g.enemies.length>1);assert.equal(g.enemies[0].id,enemy.id);
 }
 const g=run();updateWaves(g,999,api);assert.equal(g.wave,2,'one delayed frame never fast-forwards many encounters');
});

test('a boss arrival carries across timed waves and waits for the old boss death before spawning once',()=>{
 const g=run(4),old=spawn(g,true);g.waveState.elapsed=59.99;updateWaves(g,.01,api);assert.equal(g.wave,5);assert.deepEqual(g.waveState.pendingBossWaves,[5]);
 updateWaves(g,.01,api);assert.equal(g.enemies.filter(e=>e.boss).length,1);assert.equal(g.waveState.bossSpawned,false);
 updateWaves(g,60,api);assert.equal(g.wave,6);assert.deepEqual(g.waveState.pendingBossWaves,[5]);old.hp=0;updateWaves(g,.01,api);assert.equal(g.enemies.filter(e=>e.boss).length,1,'a dying boss still blocks the arrival');
 old.deathComplete=true;let announced=0;assert.equal(updateWaves(g,.01,{...api,queueIntro:(g,boss,wave)=>{announced++;assert.equal(wave,5);}}),true);
 const arrival=g.enemies.find(e=>e!==old&&e.boss);assert.ok(arrival);assert.equal(arrival.bossChoice,5);assert.equal(arrival.bossWave,5);assert.equal(g.nextBossWave,10);assert.deepEqual(g.waveState.pendingBossWaves,[]);assert.equal(announced,1);
 updateWaves(g,.01,api);assert.equal(g.enemies.filter(e=>e.hp>0&&e.boss).length,1);
});

test('multiple overdue bosses preserve their order without overlapping or disappearing at a minute boundary',()=>{
 const g=run(4),old=spawn(g,true);for(let i=0;i<7;i++)updateWaves(g,60,api);assert.equal(g.wave,11);assert.deepEqual(g.waveState.pendingBossWaves,[5,10]);
 old.hp=0;old.deathComplete=true;updateWaves(g,.01,api);const first=g.enemies.find(e=>e.hp>0&&e.boss);assert.equal(first.bossChoice,5);assert.deepEqual(g.waveState.pendingBossWaves,[10]);
 updateWaves(g,.01,api);assert.equal(g.enemies.filter(e=>e.hp>0&&e.boss).length,1);first.hp=0;first.deathComplete=true;updateWaves(g,.01,api);const second=g.enemies.find(e=>e.hp>0&&e.boss);assert.equal(second.bossChoice,10);assert.deepEqual(g.waveState.pendingBossWaves,[]);
});

test('menus, entrances, events, rift arenas and Boss Rush never advance the ordinary wave clock',()=>{
 const blocks=[g=>g.status='paused',g=>g.status='upgrade',g=>g.status='chest',g=>g.bossIntro={},g=>g.rifts.active={},g=>g.riftArena={},g=>g.events.active={},g=>g.mode='bossrush'];
 for(const block of blocks){const g=run();g.waveState.elapsed=19.75;block(g);const state=structuredClone(g.waveState);assert.equal(updateWaves(g,100,{spawn:()=>{throw Error('suspended wave must not spawn');}}),false);assert.deepEqual(g.waveState,state);}
});

test('the saved wave clock and queued arrival resume from their exact checkpoint instead of restarting',()=>{
 const g=createRun(CHARACTERS[0],3);g.wave=6;g.waveState=newWaveState(6);Object.assign(g.waveState,{elapsed:43.2,spawned:4,pendingBossWaves:[5]});g.events.nextAt=g.rifts.nextAt=g.spawn=g.invuln=g.p.nextXp=1e9;g.p.weapons={};const old=spawnEnemy(g,true,false,'frieza');old.attackCD=1e9;const store=memory();assert.ok(saveRun(g,store));
 const loaded=loadRun(store);assert.ok(loaded);assert.deepEqual(loaded.waveState,g.waveState);updateRun(loaded,20);assert.equal(loaded.waveState.elapsed,43.2);loaded.status='playing';delete loaded.resumeStatus;updateRun(loaded,.25);assert.equal(loaded.waveState.elapsed,43.45);assert.deepEqual(loaded.waveState.pendingBossWaves,[5]);assert.equal(loaded.enemies.filter(e=>e.boss).length,1);
});

test('legacy and malformed clocks gain a fresh minute independently of the saved survival time',()=>{
 const g=run(7);g.time=10000;delete g.waveState.elapsed;delete g.waveState.pendingBossWaves;ensureWaveState(g);assert.equal(g.waveState.elapsed,0);assert.equal(waveProgress(g).remainingTime,60);updateWaves(g,.01,api);assert.equal(g.wave,7);assert.equal(g.waveState.elapsed,.01);
 for(const elapsed of [NaN,Infinity,-5]){const h=run();h.waveState.elapsed=elapsed;ensureWaveState(h);assert.equal(h.waveState.elapsed,0);}
});

test('an early clear keeps its short break and mastery reward, even when the minute cap ends the break',()=>{
 const g=run();g.waveState.spawned=g.waveState.budget;updateWaves(g,.01,api);assert.equal(g.waveState.stage,'intermission');updateWaves(g,1.99,api);assert.equal(g.wave,1);updateWaves(g,.01,api);assert.equal(g.wave,2);assert.equal(g.characterXp,3);
 const late=run();Object.assign(late.waveState,{elapsed:59.5,stage:'intermission',intermission:2});updateWaves(late,.5,api);assert.equal(late.wave,2);assert.equal(late.characterXp,3);assert.equal(late.waveState.elapsed,0);
 const invaded=run();Object.assign(invaded.waveState,{elapsed:59.5,stage:'intermission',intermission:2});spawn(invaded);updateWaves(invaded,.5,api);assert.equal(invaded.wave,2);assert.equal(invaded.characterXp,0,'a late mimic or summon cancels clear credit even at the minute boundary');
});

test('wave timers continue at the live enemy limit and spawn budgets wait for room without removing survivors',()=>{
 const g=run(8);for(let i=0;i<WAVE_ENEMY_LIMIT;i++)spawn(g);g.spawn=0;updateWaves(g,.02,api);assert.equal(g.enemies.length,WAVE_ENEMY_LIMIT);assert.equal(g.waveState.spawned,0);
 const survivorIds=g.enemies.map(e=>e.id);updateWaves(g,60,api);assert.equal(g.wave,9);assert.deepEqual(g.enemies.map(e=>e.id),survivorIds);updateWaves(g,.02,api);assert.equal(g.enemies.length,WAVE_ENEMY_LIMIT);assert.equal(g.waveState.spawned,0);
 g.enemies[0].hp=0;g.spawn=0;updateWaves(g,.02,api);assert.equal(g.enemies.filter(e=>e.hp>0).length,WAVE_ENEMY_LIMIT);assert.equal(g.waveState.spawned,1);
});

test('queued regular boss arrivals take priority over an overdue world event or rift portal',()=>{
 const g=createRun(CHARACTERS[0],3);g.wave=6;g.waveState=newWaveState(6);g.waveState.pendingBossWaves=[5];g.time=500;g.events.nextAt=g.rifts.nextAt=500;g.invuln=g.spawn=g.p.nextXp=1e9;g.p.weapons={};updateRun(g,.01);
 assert.equal(g.events.active,null);assert.equal(g.rifts.portal,null);assert.equal(g.enemies.filter(e=>e.boss).length,1);assert.equal(g.enemies.find(e=>e.boss).bossWave,5);assert.ok(g.bossIntro);assert.deepEqual(g.waveState.pendingBossWaves,[]);
});
