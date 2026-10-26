import test from 'node:test';
import assert from 'node:assert/strict';
import {CHARACTERS} from '../src/game.js';
import {createRun,spawnEnemy,updateRun} from '../src/engine.js';
import {updateEnemyAI} from '../src/enemies.js';
import {finishBossIntro,bossIntroMarkup} from '../src/boss-intro.js';
import {bossPhases} from '../src/boss-phase-guide.js';
import {motherBrainMuzzle} from '../src/motherbrain-combat.js';
import {saveRun,loadRun} from '../src/run-save.js';
import {applyStatus} from '../src/status.js';

const memory=()=>({data:new Map(),getItem(k){return this.data.get(k)},setItem(k,v){this.data.set(k,v)},removeItem(k){this.data.delete(k)}});
function run(){
 const g=createRun(CHARACTERS[0],8);g.spawn=g.eliteAt=g.nextBossWave=1e6;g.p.weapons={};g.p.regen=g.p.dodge=0;g.p.nextXp=1e6;g.world.active=[];g.world.circles=[];
 const e=spawnEnemy(g,true,false,'motherbrain');Object.assign(e,{x:300,y:20,attackCD:999,ultimateCD:999});return {g,e};
}
function walking(){const v=run();v.e.hp=v.e.maxHp*.49;updateEnemyAI(v.g,v.e,.01);finishBossIntro(v.g);v.g.invuln=0;v.e.attackCD=v.e.ultimateCD=999;return v;}
function cast(style){const v=walking();v.e.skill={rinka:0,beam:1,stomp:2}[style];v.e.attackCD=0;updateEnemyAI(v.g,v.e,.01);return v;}
const sim=(g,seconds)=>{for(let t=0;t<seconds-.0001;t+=.01)updateRun(g,Math.min(.01,seconds-t));};

test('Mother Brain keeps the armored stationary tank and reveals a different biological-body entrance',()=>{
 const {g,e}=run(),x=e.x,y=e.y;e.attackCD=0;updateEnemyAI(g,e,.01);assert.equal(e.x,x);assert.equal(e.y,y);assert.equal(g.enemyShots.length,10);assert.ok(e.armorTime>0);assert.equal(e.motherBrainAttack,undefined);
 e.hp=e.maxHp*.49;updateEnemyAI(g,e,.01);assert.equal(e.armorTime,0);assert.equal(g.enemyShots.length,0);assert.equal(g.bossIntro.transformation,true);assert.match(bossIntroMarkup(g.bossIntro),/BIOLOGICAL BODY/);assert.match(bossPhases('motherbrain')[1].description,/Crushing Steps/);
});

test('the walking eye fires a seven-ring aimed fan from its visible head with no tank armor',()=>{
 const {g,e}=cast('rinka'),u=e.motherBrainAttack;assert.equal(u.style,'rinka');assert.equal(g.enemyShots.length,7);assert.equal(e.armorTime,0);
 const muzzle=motherBrainMuzzle(e,true);for(const s of g.enemyShots){assert.equal(s.kind,'rinka');assert.equal(s.sourceId,e.id);assert.equal(s.sourceX,muzzle.x);assert.equal(s.sourceY,muzzle.y);assert.ok(s.y<e.y-100);}
 assert.equal(e.moving,false);assert.ok(e.attackCD>u.duration+.7);
});

test('the mouth beam locks a fixed path, deals no charge damage and allows a sideways escape',()=>{
 for(const evade of [false,true]){
  const {g,e}=cast('beam'),u=e.motherBrainAttack,h=g.hazards[0],hp=g.p.hp;e.attackCD=e.ultimateCD=999;
  assert.equal(h.label,'HYPER BEAM');assert.equal(h.delay,1.6);assert.ok(h.sourceClock&&h.cancelWithSource);assert.deepEqual({x:h.x,y:h.y},motherBrainMuzzle(e));
  const lane=JSON.stringify([h.x,h.y,h.tx,h.ty]),facing=e.facing;sim(g,1.5);assert.equal(g.p.hp,hp);
  if(evade){g.p.x+=Math.sin(u.angle)*140;g.p.y-=Math.cos(u.angle)*140;}
  sim(g,.15);assert.equal(JSON.stringify([h.x,h.y,h.tx,h.ty]),lane);assert.equal(e.facing,facing);assert.equal(g.p.hp<hp,!evade);
 }
});

test('three crushing steps stay at the original target and disappear if Mother Brain dies',()=>{
 const {g,e}=cast('stomp'),u=e.motherBrainAttack;assert.equal(u.stomps.length,3);assert.equal(g.hazards.length,3);assert.ok(g.hazards.every(h=>h.sourceId===e.id&&h.delay>=1.1&&h.cancelWithSource));
 const locations=g.hazards.map(h=>[h.x,h.y]),last=locations.at(-1);assert.ok(Math.hypot(last[0]-g.p.x,last[1]-g.p.y)<1);g.p.x=-200;g.p.y=200;e.attackCD=e.ultimateCD=999;sim(g,.4);assert.deepEqual(g.hazards.map(h=>[h.x,h.y]),locations);
 e.hp=0;updateRun(g,.01);assert.ok(!g.hazards.some(h=>h.sourceId===e.id));
});

test('saved normal cast, fixed aim and warning clocks resume together and freeze with the source',()=>{
 const {g,e}=cast('beam');e.attackCD=e.ultimateCD=999;sim(g,.4);const s=memory();saveRun(g,s);const restored=loadRun(s),b=restored.enemies[0];
 assert.deepEqual(b.motherBrainAttack,e.motherBrainAttack);assert.deepEqual(restored.hazards,g.hazards);restored.status='playing';restored.invuln=0;
 const age=b.motherBrainAttack.age,hage=restored.hazards[0].age;applyStatus(b,'stun',2);sim(restored,.2);assert.equal(b.motherBrainAttack.age,age);assert.equal(restored.hazards[0].age,hage);
 b.statuses={};restored.ultimate={type:'kurumi',x:b.x,y:b.y,r:800,age:0,duration:10,shadows:[],slowCD:999};sim(restored,.1);assert.ok(Math.abs(b.motherBrainAttack.age-age-.07)<1e-8);assert.ok(Math.abs(restored.hazards[0].age-hage-.07)<1e-8);
});

test('Rainbow Hyper Beam waits for the normal cast then braces for one fixed prismatic beam',()=>{
 const {g,e}=cast('rinka');e.ultimateCD=0;updateEnemyAI(g,e,.01);assert.equal(e.bossUltimate,null);e.attackCD=999;updateEnemyAI(g,e,1);updateEnemyAI(g,e,.01);
 const u=e.bossUltimate;assert.equal(u.name,'RAINBOW HYPER BEAM');assert.equal(u.brainBeams.length,1);assert.equal(u.brainBeams[0].delay,2.3);assert.ok(u.brainBeams[0].width>26);assert.deepEqual(u.origin,motherBrainMuzzle(e));
 const beam=JSON.stringify(u.brainBeams),facing=e.facing,x=e.x,y=e.y;g.p.x=900;g.p.y=900;updateEnemyAI(g,e,.2);assert.equal(JSON.stringify(u.brainBeams),beam);assert.equal(e.facing,facing);assert.equal(e.x,x);assert.equal(e.y,y);
});

test('older walking saves need no new cast fields and keep existing warned attacks intact',()=>{
 const {g,e}=walking(),s=memory();delete e.motherBrainAttack;g.hazards.push({shape:'line',x:300,y:20,tx:-400,ty:20,width:32,delay:1.6,duration:.35,age:.75,damage:38,label:'HYPER BEAM',sourceId:e.id});saveRun(g,s);
 const loaded=loadRun(s),boss=loaded.enemies[0];assert.equal(boss.enraged,true);assert.equal(loaded.hazards[0].age,.75);loaded.status='playing';boss.attackCD=0;boss.skill=1;updateEnemyAI(loaded,boss,.01);assert.equal(boss.motherBrainAttack.style,'beam');assert.equal(loaded.hazards[0].age,.75);
});

test('time stop holds the walking mouth, beam warning and recovery clock together',()=>{
 const {g,e}=cast('beam');e.attackCD=e.ultimateCD=999;sim(g,.3);
 const age=e.motherBrainAttack.age,hage=g.hazards[0].age,windup=e.windup,facing=e.facing;
 g.freeze=5;g.voidRadius=1000;g.p.x=500;sim(g,.2);
 assert.equal(e.motherBrainAttack.age,age);assert.equal(g.hazards[0].age,hage);assert.equal(e.windup,windup);assert.equal(e.facing,facing);
 g.freeze=0;sim(g,.1);assert.ok(Math.abs(e.motherBrainAttack.age-age-.1)<1e-8);assert.ok(Math.abs(g.hazards[0].age-hage-.1)<1e-8);
});

test('a field crossing only the beam cannot desynchronize a source outside that field',()=>{
 const {g,e}=cast('beam');e.attackCD=e.ultimateCD=999;const h=g.hazards[0],age=e.motherBrainAttack.age;
 g.ultimate={type:'esdeath',x:(h.x+h.tx)/2,y:(h.y+h.ty)/2,r:20,age:0,duration:10};
 sim(g,.1);assert.ok(Math.abs(e.motherBrainAttack.age-age-.1)<1e-8);assert.ok(Math.abs(h.age-.1)<1e-8);
});

test('the prismatic ultimate uses the same source clock when only its lane crosses a stopped field',()=>{
 const {g,e}=walking();e.ultimateCD=0;updateEnemyAI(g,e,.01);const h=g.hazards[0],age=e.bossUltimate.age;
 g.ultimate={type:'esdeath',x:(h.x+h.tx)/2,y:(h.y+h.ty)/2,r:20,age:0,duration:10};
 sim(g,.1);assert.ok(Math.abs(e.bossUltimate.age-age-.1)<1e-8);assert.ok(Math.abs(h.age-.1)<1e-8);
});
