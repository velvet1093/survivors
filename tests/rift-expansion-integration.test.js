import test from 'node:test';
import assert from 'node:assert/strict';
import {CHARACTERS} from '../src/game.js';
import {createRun,resolveRift,updateRun} from '../src/engine.js';
import {updateEnemyAI,REGULAR_BOSS_IDS} from '../src/enemies.js';
import {finishBossIntro,BOSS_CINEMATICS} from '../src/boss-intro.js';
import {bossPhases} from '../src/boss-phase-guide.js';
import {saveRun,loadRun} from '../src/run-save.js';
import {RIFT_ENCOUNTERS} from '../src/rift-encounters.js';
const memory=()=>({data:new Map(),getItem(k){return this.data.get(k)??null;},setItem(k,v){this.data.set(k,v);},removeItem(k){this.data.delete(k);}});
function enter(id){const g=createRun(CHARACTERS[0]);g.p.x=1200;g.p.y=900;g.spawn=g.eliteAt=1e9;g.p.nextXp=g.invuln=1e9;g.p.cooldowns={ki:1e9};g.rifts.portal={bossId:id,x:1200,y:900,serial:1,age:0};g.rifts.opened=1;g.status='rift';assert.ok(resolveRift(g,true));finishBossIntro(g);return g;}

test('new rift bosses integrate with unique arenas, saved attacks, phases and once-only return rewards',()=>{
 const arenaIds=new Set();
 for(const id of ['aizenrift','madararift']){
  assert.ok(RIFT_ENCOUNTERS.some(e=>e.id===id));assert.ok(!REGULAR_BOSS_IDS.includes(id));assert.ok(BOSS_CINEMATICS[id]);assert.equal(bossPhases(id).length,2);
  const g=enter(id),boss=g.enemies.find(e=>e.riftBoss),store=memory();arenaIds.add(g.riftArena.id);boss.attackCD=0;updateEnemyAI(g,boss,.01);assert.ok(boss.riftAttack);assert.ok(g.hazards.length);
  assert.ok(saveRun(g,store));const restored=loadRun(store);assert.equal(restored.riftArena.bossId,id);assert.deepEqual(restored.enemies[0].riftAttack,boss.riftAttack);assert.deepEqual(restored.hazards,g.hazards);
  restored.status='playing';const e=restored.enemies[0];e.enraged=true;e.hp=0;
  for(let i=0;i<20;i++)updateRun(restored,.1);
  assert.equal(restored.riftArena,null);assert.deepEqual([restored.p.x,restored.p.y],[1200,900]);assert.equal(restored.rifts.cleared,1);assert.equal(restored.money,900);assert.equal(restored.bossKills,1);assert.equal(restored.chests.length+restored.rewards.length>0,true);
  updateRun(restored,.1);assert.equal(restored.money,900);assert.equal(restored.rifts.cleared,1);
 }
 assert.equal(arenaIds.size,2);
});

test('Eren’s actual Colossals checkpoint with their owner and disappear before hostile attacks or rewards when he dies',()=>{
 const g=enter('foundereren'),boss=g.enemies[0],store=memory();boss.attackCD=0;updateEnemyAI(g,boss,.01);
 const colossals=g.enemies.filter(e=>e.riftSummon);assert.equal(colossals.length,2);assert.ok(colossals.every(e=>!e.boss&&e.ownerId===boss.id&&e.hp>0));
 assert.ok(saveRun(g,store));const saved=loadRun(store);assert.equal(saved.enemies.filter(e=>e.riftSummon).length,2);
 const child=colossals[0];g.enemyShots=[{sourceId:child.id,x:g.p.x,y:g.p.y,vx:0,vy:0,r:20,damage:999,life:10,age:0}];g.hazards=[{sourceId:child.id,shape:'circle',x:g.p.x,y:g.p.y,r:100,age:3,delay:1,duration:10,damage:999}];boss.hp=0;g.invuln=0;const hp=g.p.hp;
 updateRun(g,.01);assert.equal(g.enemies.filter(e=>e.riftSummon).length,0);assert.equal(g.enemyShots.length,0);assert.equal(g.hazards.length,0);assert.equal(g.p.hp,hp);assert.equal(g.kills,0,'dismissing a summon cannot farm enemy rewards');
 assert.ok(saveRun(g,store));const dying=loadRun(store);assert.equal(dying.enemies.filter(e=>e.riftSummon).length,0);dying.status='playing';
 for(let i=0;i<20;i++)updateRun(dying,.1);assert.equal(dying.rifts.cleared,1);assert.equal(dying.kills,1);assert.equal(dying.riftArena,null);
});

test('loading a founder death with legacy orphan Colossals cancels their attacks without healing or rewarding them',()=>{
 const g=enter('foundereren'),boss=g.enemies[0],store=memory();boss.attackCD=0;updateEnemyAI(g,boss,.01);const child=g.enemies.find(e=>e.riftSummon);boss.hp=0;g.enemyShots=[{sourceId:child.id,damage:100}];g.hazards=[{sourceId:child.id,damage:100}];assert.ok(saveRun(g,store));const restored=loadRun(store);
 assert.ok(restored);assert.equal(restored.enemies.filter(e=>e.riftSummon).length,0);assert.equal(restored.enemyShots.length,0);assert.equal(restored.hazards.length,0);assert.equal(restored.kills,0);
});
