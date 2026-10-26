import test from 'node:test';
import assert from 'node:assert/strict';
import {primalDevilPixels,PRIMAL_DEVIL_PALETTES} from '../src/primal-devil-art.js';
import {enemyPixels,ENEMY_PALETTES} from '../src/pixel-enemies.js';
import {devilEnemyPixels} from '../src/devil-enemy-art.js';
import {riftSuperbossPixels,drawRiftBossAura} from '../src/rift-superboss-art.js';
import {enemyMotion,ENEMY_MOTION_NAMES} from '../src/enemy-animation.js';
function canvas(){let depth=0;const ops=[],c=new Proxy({globalAlpha:1,save(){depth++;ops.push(['save']);},restore(){depth--;assert.ok(depth>=0);ops.push(['restore']);}},{get(t,k){return k in t?t[k]:(...args)=>{assert.ok(args.filter(x=>typeof x==='number').every(Number.isFinite),String(k));ops.push([k,...args]);};},set(t,k,v){if(typeof v==='number')assert.ok(Number.isFinite(v),String(k));t[k]=v;ops.push(['set',k,v]);return true;}});return{c,ops,depth:()=>depth};}

test('both primordial references have complete native bodies through live enemy and portrait routes',()=>{
 const native=[];for(const id of Object.keys(PRIMAL_DEVIL_PALETTES)){
  const pixels=primalDevilPixels(id);assert.equal(pixels.length,56*76);assert.ok(pixels.filter(Boolean).length>900);assert.ok(pixels.every(c=>c===null||/^#[0-9a-f]{6}$/i.test(c)));assert.deepEqual(enemyPixels(id),pixels);assert.ok(ENEMY_PALETTES[id]);assert.ok(ENEMY_MOTION_NAMES[id]);native.push(pixels);
 }
 assert.notDeepEqual(...native);assert.deepEqual(devilEnemyPixels('darknessdevil'),native[0]);assert.deepEqual(riftSuperbossPixels('deathdevil'),native[1]);assert.equal(primalDevilPixels('unknown'),null);
 const darkCape=native[0].filter(c=>c==='#171c28').length,whiteCurtain=native[1].filter(c=>c==='#d8dace').length;assert.ok(darkCape>300,'Darkness keeps a substantial black mantle');assert.ok(whiteCurtain>300,'Death keeps a substantial white curtain');
});

test('casting, second phases and articulated motion stay distinguishable, deterministic and in the native grid',()=>{
 for(const id of Object.keys(PRIMAL_DEVIL_PALETTES)){
  const base=primalDevilPixels(id);assert.notDeepEqual(base,primalDevilPixels(id,{attack:1}));assert.notDeepEqual(base,primalDevilPixels(id,{enraged:1}));assert.notDeepEqual(base,primalDevilPixels(id,enemyMotion({archetype:id,moving:true},.31)));
  for(const pose of [{arm:4,leg:-4,tail:4,attack:1},{arm:-4,leg:4,tail:-4,enraged:1},{arm:NaN,leg:Infinity,tail:-Infinity}]){const a=primalDevilPixels(id,pose);assert.equal(a.length,56*76);assert.deepEqual(a,primalDevilPixels(id,{...pose}));assert.ok(a.every(c=>c===null||/^#[0-9a-f]{6}$/i.test(c)));}
  assert.deepEqual(enemyMotion({archetype:id,moving:true},0,true),enemyMotion({archetype:id,moving:true},99,true));
  assert.ok(enemyMotion({archetype:id,windup:1},0,true).attack>.8,'the essential casting pose remains through the warned windup');
 }
});

test('ritual sword and white curtain auras use finite saved clocks, bounded draws and no combat mutation',()=>{
 for(const id of Object.keys(PRIMAL_DEVIL_PALETTES))for(const reduced of [false,true]){
  const e={archetype:id,hp:100,x:30,y:70,r:55,color:'#d2d4c1',animTime:.7,riftAttack:{age:.5,duration:3,color:'#ded6c8'}},before=structuredClone(e),a=canvas(),b=canvas();assert.equal(drawRiftBossAura(a.c,e,0,reduced),true);assert.equal(a.depth(),0);assert.ok(a.ops.length<200);drawRiftBossAura(b.c,e,99,reduced);assert.deepEqual(a.ops,b.ops,'world wall-clock cannot advance a saved pose');assert.deepEqual(e,before);
 }
 assert.equal(drawRiftBossAura({}, {archetype:'deathdevil',hp:0}),false);
});
