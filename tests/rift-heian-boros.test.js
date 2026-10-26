import test from 'node:test';
import assert from 'node:assert/strict';
import {CHARACTERS} from '../src/game.js';
import {createRun,spawnEnemy} from '../src/engine.js';
import {updateEnemyAI} from '../src/enemies.js';
import {PLAYER_RADIUS,segmentDistance} from '../src/world.js';
import {saveRun,loadRun} from '../src/run-save.js';

function attack(id,skill,enraged=false){
 const g=createRun(CHARACTERS[0]);g.spawn=g.eliteAt=1e9;g.p.x=0;g.p.y=0;g.lastMove={x:1,y:0};
 const e=spawnEnemy(g,true,false,id);Object.assign(e,{x:-220,y:-80,speed:0,attackCD:0,skill:skill-1,enraged});updateEnemyAI(g,e,.01);return {g,e};
}
const covers=(h,x,y)=>h.shape==='circle'?Math.hypot(h.x-x,h.y-y)<h.r+PLAYER_RADIUS:segmentDistance(x,y,h.x,h.y,h.tx,h.ty)<h.width+PLAYER_RADIUS;

test('Heian Shrine leaves a true open side in both phases and follows its radial cuts with a central execution',()=>{
 for(const enraged of [false,true]){
  const {g,e}=attack('sukunaheian',1,enraged),u=e.riftAttack,escape={x:u.x+Math.cos(u.gapAngle)*u.radius,y:u.y+Math.sin(u.gapAngle)*u.radius};
  assert.equal(u.style,'shrine');assert.equal(u.spokes.length,9);assert.ok(g.hazards.every(h=>!covers(h,escape.x,escape.y)));
  const cuts=g.hazards.filter(h=>h.shape==='line'),execution=g.hazards.find(h=>h.shape==='circle');assert.ok(cuts.every(h=>!covers(h,0,0)),'the initial hollow circle gives a readable first tell');assert.ok(covers(execution,0,0));assert.ok(execution.delay>Math.max(...cuts.map(h=>h.delay+h.duration)));
 }
});

test('Heian world cuts add one staged slash when enraged and Furnace reserves a broken-halo escape wedge',()=>{
 const normal=attack('sukunaheian',2),fierce=attack('sukunaheian',2,true);
 assert.equal(normal.e.riftAttack.lines.length,4);assert.equal(fierce.e.riftAttack.lines.length,5);
 for(const {g,e}of [normal,fierce]){const lines=e.riftAttack.lines;assert.ok(lines.slice(1).every((h,i)=>h.delay>lines[i].delay));assert.ok(g.hazards.every(h=>covers(h,0,0)));}
 for(const enraged of [false,true]){const {g,e}=attack('sukunaheian',3,enraged),u=e.riftAttack,halo=g.hazards.filter(h=>h.label==='FURNACE · BROKEN BURNING HALO');assert.equal(halo.length,6);const escape={x:u.x+Math.cos(u.gapAngle)*295,y:u.y+Math.sin(u.gapAngle)*295};assert.ok(halo.every(h=>!covers(h,escape.x,escape.y)));assert.ok(g.hazards.find(h=>h.label==='FURNACE · LEAVE THE CORE').delay>g.hazards.find(h=>h.shape==='line').delay+.5);}
});

test('Boros locks chest and roaring beams on the captured target and always leaves a reachable lateral exit',()=>{
 for(const enraged of [false,true])for(const skill of [2,3]){
  const {g,e}=attack('borosrift',skill,enraged),u=e.riftAttack,beam=g.hazards.find(h=>h.shape==='line');assert.ok(covers(beam,0,0));assert.equal(u.beam.x,beam.x);assert.equal(u.beam.tx,beam.tx);assert.equal(u.beam.delay,skill===3?2.75:1.9);
  const lateral={x:-Math.sin(u.angle)*430,y:Math.cos(u.angle)*430};assert.ok(g.hazards.every(h=>!covers(h,lateral.x,lateral.y)),'move out of the warned beam and beyond its side craters');assert.ok(430<190*beam.delay+180,'ordinary movement plus a dash can leave the full marked pattern');
  const before=g.hazards.map(h=>[h.x,h.y,h.tx,h.ty]);g.p.x=500;g.p.y=300;e.attackCD=999;updateEnemyAI(g,e,.1);assert.deepEqual(g.hazards.map(h=>[h.x,h.y,h.tx,h.ty]),before,'late movement does not redirect an already warned cannon');
 }
 assert.equal(attack('borosrift',1).e.riftAttack.copies.length,3);assert.equal(attack('borosrift',1,true).e.riftAttack.copies.length,4);
});

test('all six new rotations retain warning geometry and phase-specific scene data through checkpoints',()=>{
 for(const id of ['sukunaheian','borosrift'])for(let skill=1;skill<=3;skill++){
  const {g,e}=attack(id,skill,true),data=new Map(),storage={getItem:k=>data.get(k)??null,setItem:(k,v)=>data.set(k,v),removeItem:k=>data.delete(k)};e.riftAttack.age=.75;g.hazards.forEach(h=>h.age=.75);assert.ok(saveRun(g,storage));const restored=loadRun(storage);assert.ok(restored);assert.deepEqual(restored.enemies.find(s=>s.id===e.id).riftAttack,e.riftAttack);assert.deepEqual(restored.hazards,g.hazards);assert.equal(restored.enemies.find(s=>s.id===e.id).enraged,true);
 }
});
