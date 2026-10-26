import test from 'node:test';
import assert from 'node:assert/strict';
import {CHARACTERS} from '../src/game.js';
import {createRun,spawnEnemy,updateRun} from '../src/engine.js';
import {BOSSES,ENEMIES,MAP_BOSSES,MAP_ENEMIES,REGULAR_BOSS_IDS,updateEnemyAI} from '../src/enemies.js';
import {DEVIL_BOSSES,DEVIL_ENEMIES} from '../src/devil-enemies.js';
import {bossPhases} from '../src/boss-phase-guide.js';
import {BOSS_CINEMATICS} from '../src/boss-intro.js';
import {applyStatus} from '../src/status.js';
import {saveRun,loadRun} from '../src/run-save.js';
import {segmentDistance,PLAYER_RADIUS} from '../src/world.js';
const run=()=>{const g=createRun(CHARACTERS[0],3);g.events.nextAt=g.rifts.nextAt=g.spawn=g.invuln=g.p.nextXp=1e9;g.p.weapons={};g.p.regen=g.p.dodge=0;return g;};
function cast(id,skill=1,fierce=false){const g=run(),e=spawnEnemy(g,true,false,id);Object.assign(e,{x:-250,y:-30,speed:0,attackCD:0,skill:skill-1,enraged:fierce});updateEnemyAI(g,e,.01);return{g,e};}
const memory=()=>({data:new Map(),getItem(k){return this.data.get(k)},setItem(k,v){this.data.set(k,v)},removeItem(k){this.data.delete(k)}});
const covers=(h,x,y)=>h.shape==='line'?segmentDistance(x,y,h.x,h.y,h.tx,h.ty)<h.width+PLAYER_RADIUS:Math.hypot(x-h.x,y-h.y)<h.r+PLAYER_RADIUS;
const sim=(g,seconds)=>{for(let t=0;t<seconds-1e-8;t+=.01)updateRun(g,Math.min(.01,seconds-t));};

test('Chainsaw Man enemies appear in related urban pools and new regular bosses join every rotation without replacing openers',()=>{
 for(const [id,def]of Object.entries(DEVIL_ENEMIES)){assert.equal(ENEMIES[id],def);assert.ok(MAP_ENEMIES.tokyo.includes(id));assert.ok(MAP_ENEMIES.shibuya.includes(id));assert.equal(def.family,'chainsawman');}
 for(const id of Object.keys(DEVIL_BOSSES)){assert.ok(REGULAR_BOSS_IDS.includes(id));assert.ok(Object.values(MAP_BOSSES).every(pool=>pool.includes(id)));assert.equal(bossPhases(id).length,2);assert.equal(BOSS_CINEMATICS[id].beats.length,3);assert.ok(bossPhases(id).every(p=>p.description.length>100));}
 assert.equal(MAP_BOSSES.tokyo[0],'dio');assert.equal(MAP_BOSSES.shibuya[0],'sukuna');assert.equal(MAP_BOSSES.eclipse[0],'zodd');assert.equal(MAP_BOSSES.zebes[0],'kraid');
});

test('all three devil bosses have three distinct fixed warned signatures in each phase',()=>{
 for(const id of Object.keys(DEVIL_BOSSES)){
  const styles=new Set();for(const fierce of [false,true])for(let skill=1;skill<=3;skill++){
   const {g,e}=cast(id,skill,fierce),u=e.devilAttack;assert.ok(u);styles.add(u.style);assert.ok(g.hazards.length);assert.ok(g.hazards.every(h=>h.delay>=1.2&&h.sourceClock&&h.cancelWithSource&&h.sourceId===e.id));
   const marks=JSON.stringify(u.marks),facing=e.facing,x=e.x,y=e.y;g.p.x=650;g.p.y=350;updateEnemyAI(g,e,.2);assert.equal(JSON.stringify(u.marks),marks);assert.equal(e.facing,facing);assert.equal(e.x,x);assert.equal(e.y,y);assert.ok(e.attackCD>u.duration-u.age);
  }assert.equal(styles.size,3,id);
 }
 assert.equal(cast('katanaman',1).g.hazards.length,1);assert.equal(cast('katanaman',1,true).g.hazards.length,2);assert.equal(cast('batdevil',2).g.hazards.length,3);assert.equal(cast('batdevil',2,true).g.hazards.length,5);assert.equal(cast('eternitydevil',1).g.hazards.length,3);assert.equal(cast('eternitydevil',1,true).g.hazards.length,5);
});

test('Sonic Roar and Flesh Labyrinth retain a broad real escape opening in both phases',()=>{
 for(const fierce of [false,true])for(const [id,skill,radius]of [['batdevil',1,175],['eternitydevil',2,180]]){
  const {g,e}=cast(id,skill,fierce),u=e.devilAttack,x=u.targetX+Math.cos(u.gapAngle)*radius,y=u.targetY+Math.sin(u.gapAngle)*radius;assert.ok(g.hazards.every(h=>!covers(h,x,y)),id+' opening');
 }
});

test('all four new roaming devils use delayed source-owned attacks with distinct geometry',()=>{
 const shapes=new Set();for(const id of Object.keys(DEVIL_ENEMIES)){const g=run(),e=spawnEnemy(g,false,false,id);Object.assign(e,{x:180,y:0,speed:0,attackCD:0});updateEnemyAI(g,e,.01);assert.ok(g.hazards.length,id);assert.ok(g.hazards.every(h=>h.sourceId===e.id&&h.cancelWithSource&&h.delay>=1));shapes.add(JSON.stringify(g.hazards.map(h=>[h.shape,h.r,h.width,h.delay])));}
 assert.equal(shapes.size,4);
});

test('devil casts checkpoint their exact warnings and freeze with stuns, time stops and Kurumi’s domain',()=>{
 for(const id of Object.keys(DEVIL_BOSSES)){
  const {g,e}=cast(id,2);sim(g,.25);const marks=JSON.stringify(e.devilAttack.marks),age=e.devilAttack.age,hage=g.hazards[0].age,store=memory();assert.ok(saveRun(g,store));const loaded=loadRun(store),boss=loaded.enemies[0];assert.deepEqual(boss.devilAttack,e.devilAttack);assert.equal(JSON.stringify(loaded.hazards),JSON.stringify(g.hazards));loaded.status='playing';
  applyStatus(boss,'stun',2);sim(loaded,.1);assert.equal(boss.devilAttack.age,age);assert.equal(loaded.hazards[0].age,hage);boss.statuses={};
  loaded.ultimate={type:'kurumi',x:boss.x,y:boss.y,r:800,age:0,duration:10,shadows:[],slowCD:999};sim(loaded,.1);assert.ok(Math.abs(boss.devilAttack.age-age-.07)<1e-8);assert.ok(Math.abs(loaded.hazards[0].age-hage-.07)<1e-8);assert.equal(JSON.stringify(boss.devilAttack.marks),marks);
  loaded.ultimate=null;loaded.freeze=5;loaded.voidRadius=1000;const frozen=boss.devilAttack.age,warning=loaded.hazards[0].age,windup=boss.windup;sim(loaded,.1);assert.equal(boss.devilAttack.age,frozen);assert.equal(loaded.hazards[0].age,warning);assert.equal(boss.windup,windup);
 }
});

test('Iai Cut remains harmless during warning and can be escaped sideways before it lands',()=>{
 for(const evade of [false,true]){const {g,e}=cast('katanaman',1);g.invuln=0;const hp=g.p.hp;sim(g,1.15);assert.equal(g.p.hp,hp);if(evade){g.p.x=0;g.p.y=230;}sim(g,.4);assert.equal(g.p.hp<hp,!evade);assert.ok(e.hp>0);}
});
