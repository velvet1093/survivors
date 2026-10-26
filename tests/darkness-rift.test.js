import test from 'node:test';
import assert from 'node:assert/strict';
import {CHARACTERS} from '../src/game.js';
import {createRun,spawnEnemy,resolveRift,updateRun} from '../src/engine.js';
import {ENEMIES,BOSSES,MAP_ENEMIES,REGULAR_BOSS_IDS,updateEnemyAI} from '../src/enemies.js';
import {DARKNESS_SERVANT_LIMIT,darknessRiftAttack} from '../src/darkness-rift.js';
import {RIFT_ENCOUNTERS} from '../src/rift-encounters.js';
import {RIFT_ARENAS} from '../src/rift-arena.js';
import {clearOrphanRiftSummons} from '../src/rift-superbosses.js';
import {finishBossIntro} from '../src/boss-intro.js';
import {segmentDistance,PLAYER_RADIUS} from '../src/world.js';
import {saveRun,loadRun} from '../src/run-save.js';

const hero=CHARACTERS[0];
const memory=()=>({data:new Map(),getItem(k){return this.data.get(k)||null;},setItem(k,v){this.data.set(k,v);},removeItem(k){this.data.delete(k);}});
function run(){const g=createRun(hero,3);g.events.nextAt=g.rifts.nextAt=g.spawn=g.invuln=g.p.nextXp=1e9;g.p.weapons={};g.p.regen=0;g.chestRandom=()=>.99;return g;}
function enter(){const g=run();g.p.x=1200;g.p.y=900;const regular=spawnEnemy(g,false,false,'soldier');Object.assign(regular,{x:1500,y:1000,attackCD:1e9});g.rifts.portal={bossId:'darknessdevil',x:1200,y:900,age:0,serial:1};g.rifts.opened=8;g.status='rift';assert.ok(resolveRift(g,true));finishBossIntro(g);return{g,boss:g.enemies.find(e=>e.riftBoss),regular};}
function launch(g,e,skill=1){e.skill=skill;return darknessRiftAttack(g,e,g.p,0,{hazard:(g,h)=>g.hazards.push(h),summon:(g,parent,id,count)=>{for(let i=0;i<count;i++){const s=spawnEnemy(g,false,false,id);s.ownerId=parent.id;}}});}
const servants=g=>g.enemies.filter(e=>e.riftSummon&&e.hp>0);
const covers=(h,x,y)=>h.shape==='line'?segmentDistance(x,y,h.x,h.y,h.tx,h.ty)<h.width+PLAYER_RADIUS:Math.hypot(h.x-x,h.y-y)<h.r+PLAYER_RADIUS;
function sim(g,seconds){for(let t=0;t<seconds-1e-8;t+=.02)updateRun(g,Math.min(.02,seconds-t));}

test('the eighth calamity has a unique primordial arena and encounter-only boss and servant roster',()=>{
 assert.equal(RIFT_ENCOUNTERS[7].id,'darknessdevil');assert.equal(RIFT_ENCOUNTERS.length,9);assert.equal(BOSSES.darknessdevil.riftOnly,true);assert.ok(!REGULAR_BOSS_IDS.includes('darknessdevil'));assert.equal(RIFT_ARENAS.darknessdevil.id,'primordialnight');
 for(const id of ['hellhand','darknessfragment']){assert.equal(ENEMIES[id].riftOnly,true);assert.ok(Object.values(MAP_ENEMIES).every(pool=>!pool.includes(id)));}
 const {g,boss}=enter();assert.equal(g.riftArena.bossId,'darknessdevil');assert.equal(g.riftArena.name,'Hell · The Primordial Night');assert.equal(boss.archetype,'darknessdevil');assert.equal(BOSSES.darknessdevil.hp,27000);assert.ok(boss.hp>10000);assert.equal(g.enemies.length,1);
});

test('Severance and Primordial Night retain real escape routes while every final impact stays fixed',()=>{
 for(const enraged of [false,true])for(const skill of [1,2,3]){
  const g=run();g.lastMove={x:1,y:0};const e=spawnEnemy(g,true,false,'darknessdevil');Object.assign(e,{x:-250,y:-50,enraged});launch(g,e,skill);const u=e.riftAttack,marks=JSON.stringify(u.marks);
  assert.ok(u.name);assert.ok(g.hazards.every(h=>h.delay>=1.5&&h.sourceClock&&h.bossUltimate&&h.cancelWithSource&&h.sourceId===e.id));assert.ok(g.hazards.every(h=>h.delay+h.duration<e.attackCD));
  if(skill===1){const lanes=g.hazards.filter(h=>h.shape==='line');assert.equal(lanes.length,4);assert.ok(lanes.every(h=>!covers(h,0,0)));assert.ok(g.hazards.find(h=>h.shape==='circle').delay>Math.max(...lanes.map(h=>h.delay+h.duration)));}
  if(skill===2){const x=u.x+Math.cos(u.gapAngle)*u.radius,y=u.y+Math.sin(u.gapAngle)*u.radius;assert.ok(g.hazards.every(h=>!covers(h,x,y)));assert.ok(g.hazards.some(h=>covers(h,0,0)));}
  if(skill===3)assert.equal(g.hazards.length,enraged?5:4);
  e.attackCD=999;g.p.x=450;g.p.y=200;updateEnemyAI(g,e,.1);assert.equal(JSON.stringify(u.marks),marks,'cast geometry never tracks the new player position');
 }
});

test('Darkness summons real attackable servants at caps two and three, with only six bodies across the fight',()=>{
 const {g,boss}=enter();launch(g,boss,1);assert.equal(servants(g).length,2);assert.deepEqual(servants(g).map(e=>e.archetype),['hellhand','darknessfragment']);const original=servants(g).map(e=>e.id);
 for(const s of servants(g)){assert.ok(s.hp>150);assert.equal(s.ownerId,boss.id);assert.equal(s.riftSerial,boss.riftSerial);assert.ok(s.attackCD>=2.2);assert.ok(Math.hypot(s.x-g.p.x,s.y-g.p.y)>220);}
 launch(g,boss,1);assert.deepEqual(servants(g).map(e=>e.id),original);assert.equal(boss.darknessSummonedTotal,2);
 boss.enraged=true;launch(g,boss,3);assert.equal(servants(g).length,3);assert.equal(boss.darknessSummonedTotal,3);
 servants(g).forEach(s=>s.hp=0);launch(g,boss,1);assert.equal(servants(g).length,3);assert.equal(boss.darknessSummonedTotal,DARKNESS_SERVANT_LIMIT);
 servants(g).forEach(s=>s.hp=0);launch(g,boss,3);assert.equal(servants(g).length,0);assert.equal(boss.darknessSummonedTotal,DARKNESS_SERVANT_LIMIT,'a long fight cannot mint an endless servant farm');
 const edge=enter();edge.g.p.x=740;edge.g.p.y=-740;edge.boss.enraged=true;launch(edge.g,edge.boss,1);for(const s of servants(edge.g)){assert.ok(Math.abs(s.x)<=760-s.r);assert.ok(Math.abs(s.y)<=760-s.r);assert.ok(Math.hypot(s.x-edge.g.p.x,s.y-edge.g.p.y)>200);}
});

test('servant attacks warn real fixed shapes and their source clocks slow with Kurumi instead of releasing early',()=>{
 for(const id of ['hellhand','darknessfragment']){
  const {g,boss}=enter();launch(g,boss,1);g.hazards=[];boss.attackCD=999;const s=servants(g).find(e=>e.archetype===id);Object.assign(s,{x:100,y:0,speed:0,attackCD:0});updateEnemyAI(g,s,.01);s.attackCD=999;
  assert.equal(g.hazards.length,id==='hellhand'?1:2);assert.ok(g.hazards.every(h=>h.sourceId===s.id&&h.cancelWithSource&&h.sourceClock&&!h.bossUltimate&&h.delay>=1.35));const h=g.hazards[0],marks=g.hazards.map(h=>[h.x,h.y,h.tx,h.ty]);
  g.ultimate={type:'kurumi',x:0,y:0,r:1000,age:0,duration:10,shadows:[],slowCD:999};const windup=s.windup,age=h.age;sim(g,.1);assert.ok(Math.abs(h.age-age-.035)<1e-8);assert.ok(Math.abs(windup-s.windup-.035)<1e-8);assert.deepEqual(g.hazards.filter(h=>h.sourceId===s.id).map(h=>[h.x,h.y,h.tx,h.ty]),marks);
 }
});

test('a mid-cast checkpoint preserves servant health, summoning budget and fixed warnings before one return reward',()=>{
 const {g,boss,regular}=enter(),store=memory();boss.attackCD=0;updateEnemyAI(g,boss,.01);sim(g,.25);assert.ok(boss.riftAttack);assert.equal(servants(g).length,2);servants(g)[0].hp-=50;const cast=structuredClone(boss.riftAttack),hazards=structuredClone(g.hazards),units=servants(g).map(s=>({id:s.id,hp:s.hp,ownerId:s.ownerId}));assert.ok(saveRun(g,store));const loaded=loadRun(store);assert.ok(loaded);assert.deepEqual(loaded.enemies.find(e=>e.riftBoss).riftAttack,cast);assert.deepEqual(loaded.hazards,hazards);assert.deepEqual(servants(loaded).map(s=>({id:s.id,hp:s.hp,ownerId:s.ownerId})),units);assert.equal(loaded.enemies.find(e=>e.riftBoss).darknessSummonedTotal,2);assert.equal(loaded.riftArena.id,'primordialnight');
  const savedTime=loaded.time;updateRun(loaded,2);assert.equal(loaded.time,savedTime);loaded.status='playing';delete loaded.resumeStatus;loaded.chestRandom=()=>.99;const parent=loaded.enemies.find(e=>e.riftBoss);parent.enraged=true;parent.hp=0;sim(loaded,1.8);
  assert.equal(servants(loaded).length,0);assert.equal(loaded.riftArena,null);assert.equal(loaded.rifts.cleared,1);assert.equal(loaded.kills,1);assert.equal(loaded.bossKills,1);assert.equal(loaded.money,900);assert.ok(loaded.enemies.some(e=>e.id===regular.id));assert.deepEqual([loaded.p.x,loaded.p.y],[1200,900]);assert.ok(loaded.chests.some(c=>c.rewardCount===5)||loaded.rewards.length===5);
  const money=loaded.money;sim(loaded,.3);assert.equal(loaded.money,money);assert.equal(loaded.rifts.cleared,1);
});

test('a dying Darkness owner and legacy orphan servants cannot persist or deal invisible damage after loading',()=>{
 const {g,boss}=enter(),store=memory();launch(g,boss,1);const child=servants(g)[0],normal=spawnEnemy(g,false,false,'soldier');g.enemyShots=[{sourceId:child.id,damage:999},{sourceId:normal.id,damage:5}];g.hazards=[{sourceId:child.id,damage:999},{sourceId:normal.id,damage:5}];boss.hp=0;assert.ok(saveRun(g,store));const loaded=loadRun(store);assert.ok(loaded);assert.equal(servants(loaded).length,0);assert.deepEqual(loaded.enemyShots,[{sourceId:normal.id,damage:5}]);assert.deepEqual(loaded.hazards,[{sourceId:normal.id,damage:5}]);assert.equal(loaded.kills,0);assert.equal(loaded.money,0);assert.equal(clearOrphanRiftSummons(loaded),0);
});
