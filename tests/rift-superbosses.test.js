import test from 'node:test';
import assert from 'node:assert/strict';
import {CHARACTERS} from '../src/game.js';
import {createRun,spawnEnemy,updateRun} from '../src/engine.js';
import {BOSSES,REGULAR_BOSS_IDS,MAP_BOSSES,updateEnemyAI} from '../src/enemies.js';
import {RIFT_SUPERBOSSES} from '../src/rift-superbosses.js';
import {bossPhases} from '../src/boss-phase-guide.js';
import {segmentDistance,PLAYER_RADIUS} from '../src/world.js';

function encounter(id,skill=1,enraged=false) {
  const g=createRun(CHARACTERS[0]);g.spawn=g.eliteAt=g.nextBossWave=Infinity;
  Object.assign(g.p,{weapons:{},dodge:0,regen:0,shield:0,nextXp:1e9});
  g.lastMove={x:1,y:0};
  const e=spawnEnemy(g,true,false,id);
  Object.assign(e,{x:-220,y:0,speed:0,attackCD:0,skill:skill-1,enraged});
  updateEnemyAI(g,e,.01);
  return {g,e};
}
const covers=(h,x,y)=>h.shape==='circle'?Math.hypot(h.x-x,h.y-y)<h.r+PLAYER_RADIUS:
  segmentDistance(x,y,h.x,h.y,h.tx,h.ty)<h.width+PLAYER_RADIUS;

test('rift superbosses are much tougher than ordinary bosses and cannot replace normal wave or Boss Rush bosses',()=>{
  assert.deepEqual(Object.keys(RIFT_SUPERBOSSES),['foundereren','beerus','walpurgisrift','aizenrift','madararift','sukunaheian','borosrift','darknessdevil','deathdevil']);
  assert.equal(REGULAR_BOSS_IDS.length,33);
  for(const id of Object.keys(RIFT_SUPERBOSSES)) {
    assert.equal(BOSSES[id].riftOnly,true);
    assert.ok(BOSSES[id].hp>=18000);
    assert.ok(BOSSES[id].hp>BOSSES.walpurgis.hp*7);
    for(const [map,order]of Object.entries(MAP_BOSSES))assert.ok(!order.includes(id),map+' excludes '+id);
    const phases=bossPhases(id);
    assert.equal(phases.length,2);assert.ok(phases[0].description.includes('Rift only'));
    assert.ok(phases[1].threshold.includes('50%'));
  }
  for(const order of Object.values(MAP_BOSSES))assert.deepEqual(new Set(order),new Set(REGULAR_BOSS_IDS));
});

test('every rift boss has three distinct attacks that warn fixed positions and finish before their next attack',()=>{
  const styles=new Set();
  for(const id of Object.keys(RIFT_SUPERBOSSES))for(let skill=1;skill<=3;skill++)for(const enraged of [false,true]) {
    const {g,e}=encounter(id,skill,enraged),tell=e.riftAttack;
    assert.ok(tell?.name,id+' skill '+skill);styles.add(tell.style);
    assert.ok(g.hazards.length>=3);assert.equal(g.enemyShots.length,0);
    assert.ok(g.hazards.every(h=>h.delay>=1.5&&h.damage>=30&&h.damage<=70));
    assert.ok(g.hazards.every(h=>h.sourceId===e.id&&h.cancelWithSource&&h.bossUltimate));
    assert.ok(g.hazards.every(h=>h.delay+h.duration<=e.attackCD));
    const positions=g.hazards.map(h=>[h.x,h.y,h.tx,h.ty]);
    g.p.x=500;g.p.y=300;e.attackCD=999;updateEnemyAI(g,e,.15);
    assert.deepEqual(g.hazards.map(h=>[h.x,h.y,h.tx,h.ty]),positions,'warnings do not track movement');
  }
  assert.equal(styles.size,Object.keys(RIFT_SUPERBOSSES).length*3);
});

test('Rumbling, rib cage and witch clock retain broad real escape corridors in both phases',()=>{
  for(const enraged of [false,true]) {
    const rumble=encounter('foundereren',1,enraged),lanes=rumble.g.hazards.filter(h=>h.shape==='line');
    assert.equal(lanes.length,4);assert.ok(lanes.every(h=>!covers(h,0,0)));
    const final=rumble.g.hazards.find(h=>h.shape==='circle');assert.ok(covers(final,0,0));
    assert.ok(final.delay>Math.max(...lanes.map(h=>h.delay+h.duration)));
    for(const id of ['foundereren','walpurgisrift']) {
      const {g,e}=encounter(id,2,enraged),tell=e.riftAttack;
      const escape={x:tell.x+Math.cos(tell.gapAngle)*tell.radius,y:tell.y+Math.sin(tell.gapAngle)*tell.radius};
      assert.ok(g.hazards.every(h=>!covers(h,escape.x,escape.y)),id+' open side remains safe');
      assert.ok(g.hazards.some(h=>covers(h,tell.x,tell.y)),id+' center still dangerous');
    }
  }
});

test('Stage Collapse alternates safe row gaps and God of Destruction strikes can be sidestepped',()=>{
  for(const enraged of [false,true]) {
    const {g,e}=encounter('walpurgisrift',1,enraged),rows=e.riftAttack.rows;
    assert.equal(rows.length,enraged?4:3);
    for(let i=0;i<rows.length;i++) {
      const row=rows[i],x=row.x+Math.cos(row.angle)*row.gap,y=row.y+Math.sin(row.angle)*row.gap,
        marks=g.hazards.filter(h=>h.delay===row.delay);
      assert.equal(marks.length,2);assert.ok(marks.every(h=>!covers(h,x,y)));
      if(i)assert.notEqual(Math.sign(row.gap),Math.sign(rows[i-1].gap));
    }
    const beerus=encounter('beerus',2,enraged);
    assert.equal(beerus.g.hazards.length,enraged?4:3);
    assert.ok(beerus.g.hazards.every(h=>!covers(h,0,-190)),'move sideways out of the fixed fan');
    assert.ok(beerus.g.hazards.some(h=>covers(h,0,0)),'standing on the old aim line is punished');
  }
});

test('rift damage is delayed, pauses with combat/time stop and cancels after the source dies',()=>{
  const {g,e}=encounter('beerus',1),h=g.hazards[0],hp=g.p.hp;
  for(let i=0;i<20;i++)updateRun(g,.04);assert.equal(g.p.hp,hp,'charging Hakai cannot hurt');
  const before=h.age;g.status='paused';updateRun(g,1);assert.equal(h.age,before);g.status='playing';
  g.ultimate={type:'esdeath',x:e.x,y:e.y,r:1000};
  updateRun(g,.2);assert.equal(h.age,before,'time stop freezes delayed attacks');
  g.ultimate=null;g.invuln=0;h.age=h.delay-.01;updateRun(g,.02);assert.ok(g.p.hp<hp,'Hakai does damage after release');
  e.hp=0;g.p.x=800;g.p.y=800;updateRun(g,.02);updateRun(g,.02);
  assert.ok(g.hazards.every(mark=>mark.sourceId!==e.id));
});
