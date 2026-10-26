import test from 'node:test';
import assert from 'node:assert/strict';
import {CHARACTERS,createPlayer,refreshStats,applyChoice,ITEMS} from '../src/game.js';
import {createRun,createHardcoreRun,createBossRushRun,updateRun,spawnEnemy} from '../src/engine.js';
import {newWaveState,waveBudget,ensureWaveState,updateWaves,waveProgress} from '../src/waves.js';
import {makeEnemy} from '../src/enemies.js';
import {enemyPressure} from '../src/difficulty.js';
import {finishBossIntro} from '../src/boss-intro.js';
import {saveRun,loadRun} from '../src/run-save.js';

const hero=CHARACTERS.find(c=>c.id==='goku');
function quiet(create=createRun){const g=create(hero,3);g.events.nextAt=1e9;g.invuln=1e6;g.spawn=g.eliteAt=1e6;g.p.weapons={};g.p.nextXp=1e9;g.rifts.nextAt=1e9;g.chestRandom=()=>.99;return g;}
const storage=()=>{const data=new Map();return{getItem:k=>data.get(k)||null,setItem:(k,v)=>data.set(k,v),removeItem:k=>data.delete(k)};};
const stubSpawn=(g,boss=false,elite=false)=>{const e={id:++g.id,boss,elite,hp:10,name:boss?'Boss':'Enemy'};g.enemies.push(e);return e;};

test('minute pressure scales enemies without advancing a fresh wave timer from the survival clock',()=>{
 for(const create of [createRun,createHardcoreRun]){
  const g=quiet(create),e=spawnEnemy(g,false,false,'soldier');e.x=800;e.y=0;e.attackCD=1e6;const original=e.maxHp;g.time=180;updateRun(g,.01);
  assert.equal(g.wave,1);assert.equal(g.waveState.index,1);assert.ok(e.maxHp>original);assert.equal(e.pressureMinute,3);assert.equal(e.damageScale,enemyPressure(180).damage);assert.equal(g.enemies.filter(e=>e.boss).length,0);
  assert.equal(makeEnemy(g,'soldier').maxHp,e.maxHp,'fresh and surviving enemies share minute pressure at the same wave');
 }
});

test('finite spawn budgets stop new enemies and an early clear advances after the final kill and break',()=>{
 const g={mode:'survival',wave:1,time:0,enemies:[],rifts:{},p:{meta:{}},id:0,characterXp:0,spawn:0,waveSpawnDelay:.5,waveState:newWaveState()};
 while(g.waveState.spawned<g.waveState.budget){g.spawn=0;updateWaves(g,.02,{spawn:stubSpawn});}
 assert.equal(g.enemies.length,waveBudget(1));const ids=g.id;g.spawn=0;updateWaves(g,10,{spawn:stubSpawn});assert.equal(g.id,ids);assert.equal(g.wave,1);
 for(const e of g.enemies)e.hp=0;g.enemies.at(-1).hp=1;updateWaves(g,10,{spawn:stubSpawn});assert.equal(g.waveState.stage,'combat');g.enemies.at(-1).hp=0;
 updateWaves(g,.02,{spawn:stubSpawn});assert.equal(g.waveState.stage,'intermission');updateWaves(g,1,{spawn:stubSpawn});assert.equal(g.wave,1);updateWaves(g,1,{spawn:stubSpawn});assert.equal(g.wave,2);assert.equal(g.characterXp,3);assert.equal(g.waveState.spawned,0);
});

test('boss waves create one boss and an early clear waits through its death and every escort',()=>{
 const g=quiet();g.wave=5;g.waveState=newWaveState(5);g.spawn=0;updateRun(g,.01);assert.ok(g.bossIntro);const boss=g.enemies.find(e=>e.boss);assert.ok(boss);assert.equal(g.nextBossWave,10);finishBossIntro(g);boss.attackCD=1e6;
 for(let i=0;i<12;i++){g.spawn=0;updateRun(g,.02);for(const e of g.enemies)if(!e.boss){e.x=900;e.y=0;e.attackCD=1e6;}}
 assert.equal(g.enemies.filter(e=>e.boss).length,1);assert.equal(g.waveState.spawned,g.waveState.budget);boss.hp=0;updateRun(g,.01);assert.equal(g.bossKills,0);assert.equal(g.wave,5);assert.equal(g.waveState.stage,'combat');
 for(let i=0;i<80;i++)updateRun(g,.02);assert.equal(g.bossKills,1);assert.equal(g.wave,5);assert.equal(g.waveState.stage,'combat');for(const e of g.enemies)e.hp=0;
 updateRun(g,.02);updateRun(g,.02);assert.equal(g.waveState.stage,'intermission');updateRun(g,2.01);assert.equal(g.wave,6);assert.equal(g.nextBossWave,10);
});

test('rift fights suspend the finite wave budget and wave progress survives a session checkpoint',()=>{
 const g=quiet();g.waveState.spawned=4;g.rifts.active={bossId:'beerus',bossEntityId:7};g.spawn=0;const before=structuredClone(g.waveState);assert.equal(updateWaves(g,90,{spawn:stubSpawn}),false);assert.deepEqual(g.waveState,before);
 g.rifts.active=null;const mob=spawnEnemy(g);mob.x=900;mob.y=0;g.spawn=999;const store=storage();assert.ok(saveRun(g,store));const loaded=loadRun(store);assert.equal(loaded.waveState.spawned,4);assert.equal(loaded.wave,1);assert.equal(loaded.resumeStatus,'playing');assert.equal(waveProgress(loaded).remaining,waveBudget(1)-4+1);
 const legacy={wave:7,enemies:[{hp:10,boss:false},{hp:10,boss:false}]};assert.equal(ensureWaveState(legacy).spawned,2);assert.equal(legacy.waveState.index,7);assert.equal(ensureWaveState(legacy).spawned,2);
});

test('normal wave enemies cannot disappear merely by running outside the old despawn leash',()=>{
 const g=quiet(),e=spawnEnemy(g);e.x=5000;e.y=0;e.attackCD=1e6;updateRun(g,.01);assert.ok(g.enemies.some(enemy=>enemy.id===e.id));assert.equal(g.wave,1);assert.ok(waveProgress(g).alive>0);
});

test('the shield item nerfs preserve other bonuses and intrinsic Titan shielding',()=>{
 const p=createPlayer(hero);p.passives={soulgem:3,atfield:3,heartkreuz:3,energytank:3};refreshStats(p);assert.equal(p.maxShield,30+33+21);assert.ok(Math.abs(p.damageReduction-(.12+.105))<1e-9);assert.equal(p.shieldRecharge,9);
 p.passives={energytank:3,atfield:3};p.fusions={};refreshStats(p);const shield=p.maxShield,hp=p.maxHp;assert.ok(applyChoice(p,{kind:'fusion',id:'adaptivebarrier'}));assert.equal(p.maxShield,shield+20);assert.equal(p.maxHp,hp);assert.equal(p.shieldRecharge,7);refreshStats(p);assert.equal(p.maxShield,shield+20);
 const titan=createPlayer(CHARACTERS.find(c=>c.id==='eren'));titan.erenForm='titan';titan.passives={};refreshStats(titan);assert.equal(titan.maxShield,45);assert.equal(titan.shieldRecharge,8);
 assert.match(ITEMS.atfield.description,/11 shield/);assert.match(ITEMS.soulgem.description,/10 HP shield/);
});

test('Boss Rush retains its independent preparation and wave rules',()=>{
 const g=createBossRushRun(hero),before=structuredClone(g.waveState);assert.equal(updateWaves(g,999,{spawn:()=>{throw Error('must not spawn');}}),false);assert.deepEqual(g.waveState,before);assert.equal(g.status,'rush-draft');
});
