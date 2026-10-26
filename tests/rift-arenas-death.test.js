import test from 'node:test';
import assert from 'node:assert/strict';
import {CHARACTERS} from '../src/game.js';
import {createRun,spawnEnemy} from '../src/engine.js';
import {ensureWorld,moveBody,onWater} from '../src/world.js';
import {chooseRift,defeatedRiftBoss,restoreRifts} from '../src/rift-encounters.js';
import {RIFT_ARENAS,drawRiftArena} from '../src/rift-arena.js';
import {queueBossDeaths,updateBossDeaths,bossDeathPending,restoreBossDeaths} from '../src/boss-death.js';
import {BOSSES} from '../src/enemies.js';
const hero=CHARACTERS.find(c=>c.id==='goku');
function run(id='foundereren'){
 const g=createRun(hero);ensureWorld(g);g.p.x=1200;g.p.y=-330;g.status='rift';g.rifts.portal={bossId:id,x:g.p.x,y:g.p.y,serial:1,age:0};return g;
}
function enter(g){assert.ok(chooseRift(g,true,{spawn:spawnEnemy}));return g.enemies.find(e=>e.riftBoss);}
const encode=(k,v)=>v instanceof Set?{$set:[...v]}:v instanceof Map?{$map:[...v]}:v===Infinity?{$inf:true}:v;
const decode=(k,v)=>v?.$set?new Set(v.$set):v?.$map?new Map(v.$map):v?.$inf?Infinity:v;

test('all rifts teleport into distinct bounded arenas without changing the selected map',()=>{
 for(const id of Object.keys(RIFT_ARENAS)){
  const g=run(id),originWorld=g.world,originMap=g.map,boss=enter(g);assert.ok(boss.riftBoss);
  assert.equal(g.map,originMap);assert.equal(g.riftArena.bossId,id);assert.notEqual(g.world,originWorld);assert.deepEqual([g.p.x,g.p.y],[0,140]);assert.equal(g.rifts.active.suspended.world,originWorld);assert.deepEqual(g.rifts.active.suspended.player,{x:1200,y:-330});assert.equal(ensureWorld(g).length,0);
  g.p.x=620;g.p.y=0;assert.ok(onWater(g.map,650,0,8));moveBody(g,g.p,70,0,8);assert.ok(Math.abs(g.p.x-690)<1e-8,'originating map river cannot block arena movement');moveBody(g,g.p,2000,2000,8);assert.ok(g.p.x<=RIFT_ARENAS[id].radius-8&&g.p.y<=RIFT_ARENAS[id].radius-8);
 }
});

test('victory returns to the exact world and drops rewards at the return position while preserving the paused wave',()=>{
 const g=run('beerus'),world=g.world;world.destroyed.add('starter:crate');g.pickups=[{id:8,x:1180,y:-330}];g.gems=[{value:25,x:1210,y:-320}];g.trinkets.drops=[{id:9,x:1200,y:-350,itemId:'dragonmarble'}];g.waveState={version:1,remaining:7};const wave=g.waveState;
 g.golem={x:1190,y:-340,hp:77,maxHp:200};g.summons=[{kind:'mahoraga',x:1220,y:-340,hp:140,maxHp:200}];const e=enter(g);assert.equal(g.pickups.length,0);assert.equal(g.gems.length,0);assert.equal(g.trinkets.drops.length,0);g.golem.hp=35;g.summons[0].hp=90;g.p.x=420;g.p.y=650;g.time=1200;e.hp=0;const nextBoss=g.nextBossWave;assert.ok(defeatedRiftBoss(g,e));
 assert.equal(g.riftArena,null);assert.equal(g.world,world);assert.ok(world.destroyed.has('starter:crate'));assert.deepEqual([g.p.x,g.p.y],[1200,-330]);assert.equal(g.waveState,wave);assert.equal(g.nextBossWave,nextBoss);assert.equal(g.golem.hp,35);assert.equal(g.summons[0].hp,90);assert.ok(Math.hypot(g.golem.x-g.p.x,g.golem.y-g.p.y)<90);assert.equal(g.pickups[0].id,8);assert.equal(g.trinkets.drops[0].id,9);assert.ok(g.gems.some(v=>v.value===25));assert.equal(g.chests[0].x,1200);assert.equal(g.chests[0].y,-330);assert.ok(g.gems.some(v=>v.value===250&&v.x===1245));
});

test('an active arena and suspended world survive checkpoint serialization, including an unfinished death',()=>{
 const g=run('walpurgisrift'),e=enter(g);g.rifts.active.suspended.world.destroyed.add('remembered');e.hp=0;queueBossDeaths(g);updateBossDeaths(g,.45);const r=JSON.parse(JSON.stringify(g,encode),decode);restoreRifts(r);restoreBossDeaths(r);assert.equal(r.map.id,g.map.id);assert.equal(r.riftArena.bossId,'walpurgisrift');assert.ok(r.rifts.active.suspended.world.destroyed.has('remembered'));assert.ok(bossDeathPending(r,r.enemies[0]));assert.equal(r.bossDeaths[0].age,.45);updateBossDeaths(r,1.1);assert.ok(r.enemies[0].deathComplete);assert.ok(defeatedRiftBoss(r,r.enemies[0]));assert.equal(r.riftArena,null);assert.ok(r.world.destroyed.has('remembered'));assert.deepEqual([r.p.x,r.p.y],[1200,-330]);
});

test('arena art has separate terrain identities and works in reduced motion without changing state',()=>{
 const signatures=[];
 for(const id of Object.keys(RIFT_ARENAS)){
  const g=run(id);enter(g);const state=JSON.stringify(g.riftArena),commands=[];
  const c=new Proxy({},{get:(o,k)=>k in o?o[k]:(...args)=>{for(const a of args)if(typeof a==='number')assert.ok(Number.isFinite(a));commands.push([k,...args]);},set:(o,k,v)=>(o[k]=v,true)});
  for(const reduced of [false,true])assert.ok(drawRiftArena(c,g,-850,-850,1700,1700,reduced));assert.equal(JSON.stringify(g.riftArena),state);signatures.push(JSON.stringify(commands));
 }
 assert.equal(new Set(signatures).size,Object.keys(RIFT_ARENAS).length);
});

test('every boss has one saved death animation that cancels its attacks and gates rewards until completion',()=>{
 for(const [id,def]of Object.entries(BOSSES)){
  const e={...def,id:7,archetype:id,x:5,y:10,hp:0,maxHp:def.hp,boss:true},g={p:{},status:'playing',enemies:[e],enemyShots:[{sourceId:7},{sourceId:8}],hazards:[{sourceId:7},{sourceId:8}],invuln:0};
  assert.equal(queueBossDeaths(g),1);assert.equal(queueBossDeaths(g),0);assert.equal(g.enemyShots.length,1);assert.equal(g.hazards.length,1);assert.ok(bossDeathPending(g,e));g.status='paused';updateBossDeaths(g,10);assert.equal(g.bossDeaths[0].age,0);g.status='playing';g.bossIntro={};updateBossDeaths(g,10);assert.equal(g.bossDeaths[0].age,0);g.bossIntro=null;updateBossDeaths(g,1);assert.ok(bossDeathPending(g,e));updateBossDeaths(g,.46);assert.equal(bossDeathPending(g,e),false);assert.equal(e.deathComplete,true);assert.equal(queueBossDeaths(g),0);
 }
 const g={status:'playing',p:{reducedMotion:true},enemies:[{id:1,archetype:'frieza',hp:0,boss:true,family:'dragonball'}]};queueBossDeaths(g);assert.ok(g.bossDeaths[0].duration<.3);updateBossDeaths(g,.3);assert.equal(bossDeathPending(g,g.enemies[0]),false);
});
