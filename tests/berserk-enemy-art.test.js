import test from 'node:test';
import assert from 'node:assert/strict';
import {BERSERK_PALETTES,berserkEnemyPixels} from '../src/berserk-enemy-art.js';
import {enemyMotion,ENEMY_MOTION_NAMES} from '../src/enemy-animation.js';

const ids=Object.keys(BERSERK_PALETTES),bosses=['zodd','grunbeld','femto'];
const region=(pixels,x,y,w,h)=>Array.from({length:h},(_,dy)=>pixels.slice((y+dy)*56+x,(y+dy)*56+x+w)).flat();
const count=pixels=>pixels.filter(Boolean).length;

test('all seven Berserk threats keep the native outlined body protocol, distinct silhouettes and deterministic attack frames',()=>{
 const bodies=new Set();
 for(const id of ids){
  const idle=berserkEnemyPixels(id),attack=berserkEnemyPixels(id,{attack:1});
  assert.equal(idle.length,56*76);assert.ok(count(idle)>1200,id+' is a fully drawn body');assert.ok(new Set(idle.filter(Boolean)).size>=8);
  assert.deepEqual(idle,berserkEnemyPixels(id));assert.notDeepEqual(idle,attack,id+' has a separate attack gesture');assert.ok(idle.filter(Boolean).every(color=>/^#[0-9a-f]{6}$/i.test(color)));
  bodies.add(JSON.stringify(idle));
 }
 assert.equal(bodies.size,7);assert.equal(berserkEnemyPixels('not-an-apostle'),null);
});

test('Apostle release redraws Zodd and Grunbeld as monsters and opens Femto’s dark wings',()=>{
 for(const id of bosses){
  const resting=berserkEnemyPixels(id),released=berserkEnemyPixels(id,{enraged:true});
  assert.equal(released.length,56*76);assert.notDeepEqual(resting,released);assert.ok(count(released)>count(resting));assert.notDeepEqual(released,berserkEnemyPixels(id,{enraged:true,attack:1}));
 }
 const zodd=berserkEnemyPixels('zodd',{enraged:true});
 assert.ok(region(zodd,4,0,47,18).includes('#e7d3ad'),'Zodd’s ivory bull horns rise above the mane');
 const dragon=berserkEnemyPixels('grunbeld',{enraged:true});
 assert.ok(region(dragon,29,20,20,22).includes('#e7d3ad'),'the dragon has a separate projecting toothy jaw');
 const femto=berserkEnemyPixels('femto',{enraged:true});
 assert.ok(count(region(femto,0,10,13,44))>100&&count(region(femto,44,10,12,44))>100,'Femto spreads wings on both sides');
 assert.ok(region(femto,13,2,31,9).includes('#ab91b6'),'broken gravity halo stays above the falcon helm');
});

test('Berserk body motion animates its own limbs and wings while reduced motion holds a stable pose',()=>{
 for(const id of ids){
  for(const enraged of [false,true]){
   const e={archetype:id,enraged,moving:true},motion=enemyMotion(e,.27);
   assert.ok(ENEMY_MOTION_NAMES[id]);assert.notDeepEqual(berserkEnemyPixels(id,{enraged}),berserkEnemyPixels(id,motion),id+' animates');
   assert.deepEqual(enemyMotion(e,.27,true),enemyMotion(e,3.7,true),id+' quiet body is stable');
  }
 }
});
