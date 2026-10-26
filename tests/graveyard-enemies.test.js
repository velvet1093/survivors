import test from 'node:test';
import assert from 'node:assert/strict';
import {GRAVEYARD_ENEMIES,GRAVEYARD_BOSSES,graveyardAttack,updateGraveyardCast} from '../src/graveyard-enemies.js';
import {CHARACTERS,MAPS} from '../src/game.js';
import {createRun,spawnEnemy,updateRun} from '../src/engine.js';
import {ENEMIES,BOSSES,MAP_ENEMIES,MAP_BOSSES,bossForWave,REGULAR_BOSS_IDS,updateEnemyAI} from '../src/enemies.js';
import {finishBossIntro} from '../src/boss-intro.js';
import {applyStatus} from '../src/status.js';
import {saveRun,loadRun} from '../src/run-save.js';
import {segmentDistance,PLAYER_RADIUS} from '../src/world.js';

const memory=()=>({data:new Map(),getItem(k){return this.data.get(k)||null},setItem(k,v){this.data.set(k,v)},removeItem(k){this.data.delete(k)}});
function run(){const g=createRun(CHARACTERS[0],MAPS.findIndex(m=>m.id==='graveyard'));g.spawn=g.eliteAt=g.events.nextAt=g.rifts.nextAt=g.p.nextXp=g.invuln=1e9;g.p.weapons={};g.p.regen=g.p.dodge=0;g.lastMove={x:1,y:0};return g;}
function cast(id,skill=1,enraged=false){const g=run(),boss=!!GRAVEYARD_BOSSES[id],e=spawnEnemy(g,boss,false,id);Object.assign(e,{x:-250,y:0,speed:0,attackCD:0,skill:skill-1,enraged});updateEnemyAI(g,e,.01);return{g,e};}
function sim(g,seconds){for(let t=0;t<seconds-1e-9;t+=.01)updateRun(g,Math.min(.01,seconds-t));}
const geometry=h=>[h.shape,h.x,h.y,h.tx,h.ty,h.r,h.width,h.delay,h.duration];
const covered=(h,x,y)=>h.shape==='line'?segmentDistance(x,y,h.x,h.y,h.tx,h.ty)<h.width+PLAYER_RADIUS:Math.hypot(x-h.x,y-h.y)<h.r+PLAYER_RADIUS;

test('the graveyard has five thematic ordinary enemies and two real opening bosses without replacing earlier maps',()=>{
 assert.equal(Object.keys(GRAVEYARD_ENEMIES).length,5);assert.equal(Object.keys(GRAVEYARD_BOSSES).length,2);
 assert.deepEqual(MAP_ENEMIES.graveyard,Object.keys(GRAVEYARD_ENEMIES));assert.deepEqual([5,10].map(w=>bossForWave('graveyard',w)),['ryuma','moriah']);
 assert.equal(new Set(MAP_BOSSES.graveyard).size,REGULAR_BOSS_IDS.length);
 for(const [id,def]of Object.entries(GRAVEYARD_ENEMIES)){assert.strictEqual(ENEMIES[id],def);assert.equal(def.family,'onepiece');assert.ok(!def.eventOnly&&!def.riftOnly);const {g,e}=cast(id);assert.ok(e.graveyardAttack);assert.ok(g.hazards.length||g.enemyShots.length,id+' actually attacks');}
 for(const [id,def]of Object.entries(GRAVEYARD_BOSSES)){assert.strictEqual(BOSSES[id],def);assert.ok(REGULAR_BOSS_IDS.includes(id));assert.ok(!def.eventOnly&&!def.riftOnly);assert.ok(def.shiftName&&def.shiftRadius);}
 assert.equal(bossForWave('garden',5),'aura');assert.equal(bossForWave('tokyo',5),'dio');
 assert.equal(graveyardAttack({}, {archetype:'other'}, {},0,{}),false);
});

test('all six boss patterns warn finite source-owned positions and finish before another cast can begin',()=>{
 const styles=new Set();
 for(const id of Object.keys(GRAVEYARD_BOSSES))for(const fierce of [false,true])for(let skill=1;skill<=3;skill++){
  const {g,e}=cast(id,skill,fierce),u=e.graveyardAttack;styles.add(u.style);assert.ok(u.marks.length);assert.equal(u.marks.length,g.hazards.length);assert.equal(g.enemyShots.length,0);assert.equal(g.enemies.length,1);
  assert.ok(g.hazards.length<=7);assert.ok(g.hazards.every(h=>h.sourceClock&&h.cancelWithSource&&h.sourceId===e.id&&h.source===id&&h.delay>=1.1&&h.damage>=20&&h.damage<=35&&h.delay+h.duration<=u.duration&&h.delay+h.duration<e.attackCD));
  for(const h of g.hazards)for(const key of ['x','y','tx','ty','r','width','delay','duration','damage'])if(h[key]!==undefined)assert.ok(Number.isFinite(h[key]),id+' '+key);
  const fixed=g.hazards.map(geometry),marks=structuredClone(u.marks),facing=u.facing;e.attackCD=999;g.p.x=-600;g.p.y=500;updateEnemyAI(g,e,.15);assert.deepEqual(g.hazards.map(geometry),fixed);assert.deepEqual(e.graveyardAttack.marks,marks);assert.equal(e.facing,facing,'the drawn casting pose cannot turn away from its fixed attack');
 }
 assert.equal(styles.size,6);
});

test('the sword grave and shadow bats retain real escape arcs in both phases',()=>{
 for(const fierce of [false,true])for(const [id,skill]of [['ryuma',3],['moriah',1]]){
  const {g,e}=cast(id,skill,fierce),u=e.graveyardAttack,x=u.targetX+Math.cos(u.gapAngle)*u.radius,y=u.targetY+Math.sin(u.gapAngle)*u.radius;
  assert.ok(g.hazards.every(h=>!covered(h,x,y)),id+' opening is outside every hitbox');assert.ok(g.hazards.some(h=>covered(h,u.targetX,u.targetY)),'standing in the original center is still dangerous');
  const outer=g.hazards.slice(0,-1),last=g.hazards.at(-1);assert.ok(last.delay>Math.max(...outer.map(h=>h.delay+h.duration)),'the central release is a separate later warning');
 }
});

test('crescent cuts leave corridors and the spear procession can be escaped sideways',()=>{
 for(const fierce of [false,true]){
  const crescent=cast('ryuma',2,fierce);assert.equal(crescent.g.hazards.length,fierce?5:3);assert.ok(crescent.g.hazards.every(h=>!covered(h,0,50)));assert.ok(crescent.g.hazards.some(h=>covered(h,0,0)));
  const tower=cast('moriah',3,fierce);assert.equal(tower.g.hazards.length,fierce?5:3);assert.ok(tower.g.hazards.every(h=>!covered(h,0,180)));assert.ok(tower.g.hazards.every((h,i,list)=>i===0||h.delay>list[i-1].delay));
 }
 assert.equal(cast('ryuma',1,true).g.hazards.length,2);assert.equal(cast('moriah',2,true).g.hazards.length,3);
});

test('graveyard casts and their delayed damage share pause, stun, freeze and checkpoint clocks',()=>{
 const {g,e}=cast('moriah',2);e.attackCD=999;sim(g,.2);const store=memory();assert.ok(saveRun(g,store));const loaded=loadRun(store);assert.ok(loaded);const boss=loaded.enemies.find(v=>v.id===e.id),before=structuredClone(boss.graveyardAttack),hazards=structuredClone(loaded.hazards),windup=boss.windup;
 assert.deepEqual(before,e.graveyardAttack);updateRun(loaded,2);assert.deepEqual(boss.graveyardAttack,before);assert.deepEqual(loaded.hazards,hazards);loaded.status='playing';delete loaded.resumeStatus;
 applyStatus(boss,'stun',2);sim(loaded,.1);assert.deepEqual(boss.graveyardAttack,before);assert.deepEqual(loaded.hazards,hazards);assert.equal(boss.windup,windup);
 boss.statuses={};loaded.freeze=2;loaded.voidRadius=1000;sim(loaded,.1);assert.deepEqual(boss.graveyardAttack,before);assert.deepEqual(loaded.hazards,hazards);assert.equal(boss.windup,windup);
 loaded.freeze=0;sim(loaded,.1);assert.ok(Math.abs(boss.graveyardAttack.age-before.age-.1)<1e-8);assert.ok(Math.abs(loaded.hazards[0].age-hazards[0].age-.1)<1e-8);assert.deepEqual(boss.graveyardAttack.marks,before.marks);
});

test('both graveyard bosses transform once below half HP and discard the old form’s attacks',()=>{
 for(const id of Object.keys(GRAVEYARD_BOSSES)){
  const {g,e}=cast(id,1);e.hp=e.maxHp*.49;e.attackCD=999;updateEnemyAI(g,e,.01);assert.ok(e.enraged&&e.transformed);assert.equal(e.name,GRAVEYARD_BOSSES[id].shiftName);assert.equal(g.hazards.length,0);assert.equal(e.graveyardAttack,null);assert.ok(g.bossIntro.transformation);finishBossIntro(g);
  e.attackCD=0;updateEnemyAI(g,e,.01);assert.ok(e.graveyardAttack);assert.equal(g.bossIntro,null,'the transformed body cannot start the same entrance twice');
 }
});

test('Flying Dragon Draw only damages after release and a lateral escape avoids the real hitbox',()=>{
 for(const evade of [false,true]){
  const {g,e}=cast('ryuma',1);e.attackCD=999;g.invuln=0;const hp=g.p.hp;sim(g,1.2);assert.equal(g.p.hp,hp);
  if(evade)g.p.y=150;sim(g,.2);assert.equal(g.p.hp<hp,!evade);e.hp=0;sim(g,.02);assert.ok(!g.hazards.some(h=>h.sourceId===e.id),'dying cancels unfinished source-owned cuts');
 }
});

test('cast helpers are finite, expire at their saved duration, and hold their geometry when frozen',()=>{
 const {e}=cast('ryuma',3),u=e.graveyardAttack,marks=JSON.stringify(u.marks);updateGraveyardCast(e,1,true);assert.equal(u.age,0);for(const dt of [-1,NaN,Infinity])updateGraveyardCast(e,dt);assert.equal(u.age,0);updateGraveyardCast(e,.5);assert.equal(u.age,.5);assert.equal(JSON.stringify(u.marks),marks);updateGraveyardCast(e,u.duration);assert.equal(e.graveyardAttack,null);
 const {g,e:hollow}=cast('hollowghost');assert.equal(hollow.graveyardAttack.style,'hollowfan');assert.equal(g.enemyShots.length,3);assert.ok(g.enemyShots.every(s=>s.kind==='drain'),'the fan uses the existing actual slowing-shot status');
});
