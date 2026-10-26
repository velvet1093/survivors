import test from 'node:test';
import assert from 'node:assert/strict';
import {CHARACTERS} from '../src/game.js';
import {createRun,spawnEnemy,updateRun} from '../src/engine.js';
import {ENEMIES,BOSSES,MAP_ENEMIES,MAP_BOSSES,REGULAR_BOSS_IDS,featuredBosses,updateEnemyAI} from '../src/enemies.js';
import {BERSERK_ENEMIES,BERSERK_BOSSES} from '../src/berserk-enemies.js';
import {bossPhases} from '../src/boss-phase-guide.js';
import {BOSS_CINEMATICS,finishBossIntro} from '../src/boss-intro.js';
import {saveRun,loadRun} from '../src/run-save.js';
import {applyStatus} from '../src/status.js';
import {PLAYER_RADIUS,segmentDistance} from '../src/world.js';
function run(){const g=createRun(CHARACTERS[0],3);g.spawn=g.eliteAt=g.nextBossWave=g.p.nextXp=g.invuln=1e6;g.p.weapons={};g.p.regen=g.p.dodge=0;return g;}
function cast(id,skill,enraged=false){const g=run(),e=spawnEnemy(g,true,false,id);Object.assign(e,{x:-250,y:-30,speed:0,attackCD:0,skill:skill-1,enraged});updateEnemyAI(g,e,.01);return {g,e};}
const covered=(h,x,y)=>h.shape==='line'?segmentDistance(x,y,h.x,h.y,h.tx,h.ty)<h.width+PLAYER_RADIUS:Math.hypot(x-h.x,y-h.y)<h.r+PLAYER_RADIUS;
const sim=(g,n)=>{for(let i=0;i<n;i++)updateRun(g,.01);};

test('Eclipse has four exclusive Berserk threats, three themed first bosses and every regular boss',()=>{
 assert.deepEqual(MAP_ENEMIES.eclipse,Object.keys(BERSERK_ENEMIES));assert.ok(['zodd','grunbeld','femto'].every(id=>featuredBosses('eclipse').includes(id)));
 assert.equal(MAP_BOSSES.eclipse.length,REGULAR_BOSS_IDS.length);
 for(const [id,def]of Object.entries(BERSERK_ENEMIES)){assert.equal(ENEMIES[id].family,'berserk');const g=run(),e=spawnEnemy(g,false,false,id);Object.assign(e,{x:190,y:30,speed:0,attackCD:0});updateEnemyAI(g,e,.01);assert.ok(g.hazards.length||g.enemyShots.length,def.name+' attacks');}
 for(const id of Object.keys(BERSERK_BOSSES)){assert.equal(BOSSES[id].family,'berserk');assert.equal(bossPhases(id).length,2);assert.equal(BOSS_CINEMATICS[id].beats.length,3);}
});

test('every new boss has three distinct warned rotations that grow in phase II and retain fixed geometry',()=>{
 for(const id of Object.keys(BERSERK_BOSSES)){
  const styles=new Set();
  for(const enraged of [false,true])for(let skill=1;skill<=3;skill++){
   const {g,e}=cast(id,skill,enraged),u=e.berserkAttack;styles.add(u.style);assert.ok(g.hazards.length);assert.ok(g.hazards.every(h=>h.delay>=1.1&&h.sourceClock&&h.sourceId===e.id&&h.cancelWithSource));
   const marks=JSON.stringify(u.marks),geometry=g.hazards.map(h=>[h.x,h.y,h.tx,h.ty,h.r]);g.p.x=500;g.p.y=500;e.attackCD=999;updateEnemyAI(g,e,.1);assert.equal(JSON.stringify(u.marks),marks);assert.deepEqual(g.hazards.map(h=>[h.x,h.y,h.tx,h.ty,h.r]),geometry);assert.equal(e.facing,u.facing);
  }
  assert.equal(styles.size,3);
 }
 assert.ok(cast('zodd',1,true).g.hazards[0].width>cast('zodd',1).g.hazards[0].width);
 assert.equal(cast('grunbeld',1,true).g.hazards.length,3);assert.equal(cast('grunbeld',2,true).g.hazards.length,4);
 assert.ok(cast('femto',2,true).g.hazards[0].width>cast('femto',2).g.hazards[0].width);
});

test('Zodd and Femto leave real broken-halo escape corridors in both phases',()=>{
 for(const enraged of [false,true])for(const [id,skill]of [['zodd',3],['femto',1]]){
  const {g,e}=cast(id,skill,enraged),u=e.berserkAttack,center=id==='zodd'?{x:u.x,y:u.y}:{x:u.targetX,y:u.targetY},r=id==='zodd'?180:enraged?170:150;
  const x=center.x+Math.cos(u.gapAngle)*r,y=center.y+Math.sin(u.gapAngle)*r;assert.ok(g.hazards.every(h=>!covered(h,x,y)),id+' escape opening');
 }
});

test('all three bosses transform below half health and clear their old warnings',()=>{
 for(const id of Object.keys(BERSERK_BOSSES)){
  const {g,e}=cast(id,1);e.hp=e.maxHp*.49;updateEnemyAI(g,e,.01);assert.ok(e.enraged&&e.transformed);assert.equal(g.bossIntro.transformation,true);assert.equal(e.name,BERSERK_BOSSES[id].shiftName);assert.equal(g.hazards.length,0);finishBossIntro(g);
 }
});

test('saved Berserk casts and their warnings freeze with source controls and resume without re-aiming',()=>{
 const {g,e}=cast('femto',2);sim(g,25);const values=new Map(),storage={getItem:k=>values.get(k)||null,setItem:(k,v)=>values.set(k,v),removeItem:k=>values.delete(k)};assert.ok(saveRun(g,storage));const loaded=loadRun(storage),b=loaded.enemies[0];assert.deepEqual(b.berserkAttack,e.berserkAttack);assert.deepEqual(loaded.hazards,g.hazards);loaded.status='playing';
 const age=b.berserkAttack.age,hage=loaded.hazards[0].age;applyStatus(b,'stun',2);sim(loaded,10);assert.equal(b.berserkAttack.age,age);assert.equal(loaded.hazards[0].age,hage);b.statuses={};loaded.freeze=3;loaded.voidRadius=1000;sim(loaded,10);assert.equal(b.berserkAttack.age,age);assert.equal(loaded.hazards[0].age,hage);loaded.freeze=0;sim(loaded,10);assert.ok(Math.abs(b.berserkAttack.age-age-.1)<1e-8);assert.ok(Math.abs(loaded.hazards[0].age-hage-.1)<1e-8);
});

test('Berserk bosses create no regular enemies in Boss Rush and cancel attacks on defeat',()=>{
 for(const id of Object.keys(BERSERK_BOSSES)){const {g,e}=cast(id,3,true);g.mode='bossrush';assert.equal(g.enemies.length,1);assert.equal(g.enemyShots.length,0);e.hp=0;updateRun(g,.01);assert.equal(g.hazards.length,0);}
});

test('Grunbeld cannot damage during the fire warning and a lateral escape avoids its release',()=>{
 for(const evade of [false,true]){
  const {g,e}=cast('grunbeld',1);g.invuln=0;e.attackCD=999;const hp=g.p.hp;sim(g,135);assert.equal(g.p.hp,hp);
  if(evade)g.p.y+=180;sim(g,25);assert.equal(g.p.hp<hp,!evade);
 }
});
