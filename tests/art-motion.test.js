import test from 'node:test';
import assert from 'node:assert/strict';
import {bowPose} from '../src/bow.js';
import {enemyMotion,ENEMY_MOTION_NAMES} from '../src/enemy-animation.js';
import {ENEMIES,BOSSES,makeEnemy,updateEnemyAI} from '../src/enemies.js';
import {createRun,castWeapon} from '../src/engine.js';
import {CHARACTERS} from '../src/game.js';
const dot=(v,a)=>v.x*Math.cos(a)+v.y*Math.sin(a);
const delta=(a,b)=>({x:a.x-b.x,y:a.y-b.y});
test('bow curve bulges toward firing direction and string stays toward archer in all quadrants',()=>{
  for(const angle of [0,Math.PI/4,Math.PI/2,Math.PI,Math.PI*1.5,Math.PI*1.75])for(const facing of [-1,1]){
    const pose=bowPose({x:25,y:80,aimAngle:angle,facing,attackTimer:.3});
    const tipMid={x:(pose.upperTip.x+pose.lowerTip.x)/2,y:(pose.upperTip.y+pose.lowerTip.y)/2};
    assert.ok(dot(delta(pose.limbCenter,tipMid),angle)>0,'limbs face outward');
    assert.ok(dot(delta(pose.string,tipMid),angle)<0,'string draws toward body');
    assert.ok(dot(delta(pose.arrowHead,pose.grip),angle)>0,'arrowhead faces target');
  }
});
test('bow aiming is independent of the body walking left or right',()=>{
  const p={x:0,y:0,aimAngle:Math.PI*.25,attackTimer:0};
  assert.deepEqual(bowPose({...p,facing:-1}),bowPose({...p,facing:1}));
});
test('Madoka arrows start at the held bow muzzle and point at the actual target',()=>{
  for(const target of [{x:150,y:0},{x:-150,y:0},{x:0,y:-150},{x:0,y:150}]){
    const g=createRun(CHARACTERS[3]);g.p.facing=target.x>0?-1:1;castWeapon(g,'rosebow',target);const s=g.shots[0],pose=bowPose(g.p);
    assert.ok(Math.abs(s.x-pose.muzzle.x)<.001);assert.ok(Math.abs(s.y-pose.muzzle.y)<.001);
    assert.ok(s.vx*(target.x-s.x)+s.vy*(target.y-s.y)>0);
    assert.ok(Math.cos(pose.angle)*s.vx+Math.sin(pose.angle)*s.vy>430);
  }
});
test('every enemy and boss has its own distinct movement profile',()=>{
  const ids=[...Object.keys(ENEMIES),...Object.keys(BOSSES)];assert.deepEqual(Object.keys(ENEMY_MOTION_NAMES).sort(),[...ids].sort());
  const signatures=ids.map(archetype=>JSON.stringify([.17,.43,.81].map(time=>enemyMotion({archetype,moving:true,phase:0},time))));
  assert.equal(new Set(signatures).size,ids.length);
});
test('each movement cycle animates over time without changing physical coordinates',()=>{
  for(const archetype of Object.keys(ENEMY_MOTION_NAMES)){
    const e={archetype,x:15,y:25,moving:true,phase:0};const a=enemyMotion(e,.1),b=enemyMotion(e,.37);
    assert.notDeepEqual(a,b,archetype);assert.equal(e.x,15);assert.equal(e.y,25);
    for(const value of Object.values(a))assert.ok(Number.isFinite(value));
  }
});
test('reduced motion removes root transforms and limb cycling for all enemy types',()=>{
  for(const archetype of Object.keys(ENEMY_MOTION_NAMES))assert.deepEqual(enemyMotion({archetype},0,true),enemyMotion({archetype},4,true));
});
test('enemy animation time slows inside Unlimited Void',()=>{
  const g=createRun(CHARACTERS[1]),e=makeEnemy(g,'saibaman');e.x=140;e.y=0;g.freeze=5;g.voidRadius=420;
  updateEnemyAI(g,e,.2);assert.ok(e.animTime>0&&e.animTime<.02);
  g.freeze=0;const frozen=e.animTime;updateEnemyAI(g,e,.2);assert.ok(e.animTime-frozen>.19);
});
