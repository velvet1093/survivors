import test from 'node:test';
import assert from 'node:assert/strict';
import {CHARACTERS} from '../src/game.js';
import {createRun,spawnEnemy,updateRun} from '../src/engine.js';
import {updateEnemyRecall,enemyRecallDistance,ENEMY_RECALL_LIMIT,ENEMY_RECALL_COOLDOWN} from '../src/enemy-recall.js';
import {onWater,pointCollider,ensureWorld} from '../src/world.js';
import {updateEnemyAI} from '../src/enemies.js';
import {saveRun,loadRun} from '../src/run-save.js';
const hero=CHARACTERS[0];
function run(){const g=createRun(hero,3);g.events.nextAt=g.rifts.nextAt=g.spawn=g.invuln=g.p.nextXp=1e9;g.p.weapons={};return g;}
function far(g,boss=false,id=boss?'frieza':'soldier'){const e=spawnEnemy(g,boss,false,id);Object.assign(e,{x:g.p.x+6000,y:g.p.y+2000,attackCD:0});return e;}
const memory=()=>({data:new Map(),getItem(k){return this.data.get(k)},setItem(k,v){this.data.set(k,v)},removeItem(k){this.data.delete(k)}});

test('distant surviving enemies reappear just outside phone, landscape and desktop views without new bodies or loot',()=>{
 for(const [w,h,zoom]of [[390,844,.9],[844,390,.9],[1440,1000,.9],[390,844,.45]]){
  const g=run();g.view={w,h};g.zoom=zoom;const e=far(g);e.hp=17;e.maxHp=100;e.eventEnemy=true;e.eventSerial=5;e.ownerId=73;const id=g.id;
  assert.equal(updateEnemyRecall(g,.02),1);assert.ok(Math.abs(e.x-g.p.x)>w/zoom/2||Math.abs(e.y-g.p.y)>h/zoom/2);assert.ok(Math.hypot(e.x-g.p.x,e.y-g.p.y)<enemyRecallDistance(g));assert.ok(Math.hypot(e.x-g.p.x,e.y-g.p.y)>=220);assert.equal(e.hp,17);assert.equal(e.maxHp,100);assert.equal(e.ownerId,73);assert.equal(e.eventSerial,5);assert.equal(e.id,id);assert.equal(g.enemies.length,1);assert.equal(g.kills,0);assert.equal(g.money,0);assert.equal(e.recallCooldown,ENEMY_RECALL_COOLDOWN);assert.ok(e.attackCD>=1.5);
 }
});

test('nearby enemies, defeated bodies, paused runs and bounded rift arenas keep their positions',()=>{
 const g=run(),near=spawnEnemy(g,false,false,'soldier'),dead=far(g,true);near.x=30;near.y=0;dead.hp=0;assert.equal(updateEnemyRecall(g,.1),0);assert.equal(near.x,30);assert.equal(dead.x,6000);
 for(const blocked of [g=>g.status='paused',g=>g.bossIntro={},g=>g.riftArena={radius:760},g=>g.rifts.active={}]){const h=run(),e=far(h);blocked(h);assert.equal(updateEnemyRecall(h,3),0);assert.equal(e.x,6000);assert.equal(e.recallCooldown,undefined);}
});

test('recall cancels only the relocated caster’s old attacks and grants time before its next attack',()=>{
 const g=run(),e=far(g,true);Object.assign(e,{hp:37,enraged:true,bossUltimate:{age:2},worldEventAttack:{age:1},dash:2,kvx:400,kvy:-300});g.enemyShots=[{sourceId:e.id},{sourceId:900}];g.hazards=[{sourceId:e.id},{sourceId:900}];
 assert.equal(updateEnemyRecall(g,.02),1);assert.deepEqual(g.enemyShots,[{sourceId:900}]);assert.deepEqual(g.hazards,[{sourceId:900}]);assert.equal(e.bossUltimate,null);assert.equal(e.worldEventAttack,null);assert.equal(e.dash,0);assert.equal(e.kvx,0);assert.equal(e.kvy,0);assert.equal(e.hp,37);assert.equal(e.enraged,true);assert.ok(e.ultimateCD>=3);updateEnemyAI(g,e,.02);assert.deepEqual(g.hazards,[{sourceId:900}]);assert.deepEqual(g.enemyShots,[{sourceId:900}]);
});

test('recall avoids scenery, river water and existing bodies, and a blocked ring leaves enemies intact',()=>{
 const g=run();g.map={id:'garden'};g.p.x=650;const e=far(g);g.world.circles=[{x:900,y:100,r:180,object:{hp:Infinity,type:'rock'}}];assert.equal(updateEnemyRecall(g,.02),1);assert.equal(onWater(g.map,e.x,e.y,12),false);assert.equal(pointCollider(g,e.x,e.y,12),null);
 const h=run(),units=Array.from({length:10},()=>far(h));assert.equal(updateEnemyRecall(h,.02),10);for(const a of units)for(const b of units)if(a!==b)assert.ok(Math.hypot(a.x-b.x,a.y-b.y)>25);
 const blocked=run(),enemy=far(blocked);blocked.world.circles=[{x:0,y:0,r:20000,object:{hp:Infinity,type:'rock'}}];assert.equal(updateEnemyRecall(blocked,.02),0);assert.equal(enemy.x,6000);assert.ok(enemy.hp>0);
});

test('large carryover groups relocate in bounded batches and cannot churn while a recall cooldown is active',()=>{
 const g=run();for(let i=0;i<ENEMY_RECALL_LIMIT+3;i++)far(g);assert.equal(updateEnemyRecall(g,.02),ENEMY_RECALL_LIMIT);assert.equal(updateEnemyRecall(g,.02),3);const e=g.enemies[0],position={x:e.x,y:e.y};g.p.x+=10000;assert.equal(updateEnemyRecall(g,.02),0);assert.deepEqual({x:e.x,y:e.y},position);assert.ok(updateEnemyRecall(g,ENEMY_RECALL_COOLDOWN)>0);
});

test('real engine recalls preserve kill budgets and checkpoints retain the relocated identity and health',()=>{
 const g=run(),e=far(g);ensureWorld(g);e.hp=31;updateRun(g,.02);assert.equal(e.recallCount,1);assert.equal(g.waveState.spawned,0);assert.equal(g.enemies[0].id,e.id);assert.equal(e.hp,31);const store=memory();assert.ok(saveRun(g,store));const loaded=loadRun(store);assert.ok(loaded);const saved=loaded.enemies.find(v=>v.id===e.id);assert.equal(saved.hp,31);assert.equal(saved.recallCount,1);assert.equal(saved.recallCooldown,e.recallCooldown);assert.equal(saved.x,e.x);assert.equal(saved.y,e.y);assert.equal(loaded.kills,0);
});

test('ordinary circle attacks carry caster identity and the original cast position for charge FX and recall cleanup',()=>{
 const g=run(),e=spawnEnemy(g,true,false,'orochimaru');Object.assign(e,{x:180,y:20,attackCD:0,skill:2});updateEnemyAI(g,e,.01);assert.equal(g.hazards.length,4);for(const h of g.hazards){assert.equal(h.shape,'circle');assert.equal(h.sourceId,e.id);assert.equal(h.source,'orochimaru');assert.equal(h.sourceX,e.x);assert.equal(h.sourceY,e.y);assert.ok(h.delay>=1);}
});
