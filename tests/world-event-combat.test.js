import test from 'node:test';
import assert from 'node:assert/strict';
import {CHARACTERS} from '../src/game.js';
import {createRun,spawnEnemy,updateRun} from '../src/engine.js';
import {BOSSES,ENEMIES,MAP_BOSSES,MAP_ENEMIES,REGULAR_BOSS_IDS,updateEnemyAI} from '../src/enemies.js';
import {WORLD_EVENTS,EVENT_BOSSES,EVENT_ENEMIES} from '../src/world-event-data.js';
import {bossPhases} from '../src/boss-phase-guide.js';
import {BOSS_CINEMATICS} from '../src/boss-intro.js';
import {saveRun,loadRun} from '../src/run-save.js';
import {applyStatus} from '../src/status.js';
import {segmentDistance,PLAYER_RADIUS} from '../src/world.js';
const run=()=>{const g=createRun(CHARACTERS[0],3);g.spawn=g.eliteAt=g.nextBossWave=g.invuln=g.p.nextXp=1e9;g.p.weapons={};g.p.regen=g.p.dodge=0;return g;};
function cast(id,skill=1,fierce=false){const g=run(),e=spawnEnemy(g,true,false,id);Object.assign(e,{x:-250,y:-30,speed:0,attackCD:0,skill:skill-1,enraged:fierce});updateEnemyAI(g,e,.01);e.attackCD=999;return{g,e};}
const sim=(g,seconds)=>{for(let t=0;t<seconds-1e-8;t+=.01)updateRun(g,Math.min(.01,seconds-t));};
const memory=()=>({data:new Map(),getItem(k){return this.data.get(k)},setItem(k,v){this.data.set(k,v)},removeItem(k){this.data.delete(k)}});
const covers=(h,x,y)=>h.shape==='line'?segmentDistance(x,y,h.x,h.y,h.tx,h.ty)<h.width+PLAYER_RADIUS:Math.hypot(x-h.x,y-h.y)<h.r+PLAYER_RADIUS;

test('weather and Eclipse rosters are related, event-exclusive and absent from regular map and Boss Rush orders',()=>{
 assert.deepEqual(WORLD_EVENTS.map(e=>e.id),['eclipse','storm','blizzard','ghostparade','tombwake']);assert.equal(REGULAR_BOSS_IDS.length,36);
 for(const event of WORLD_EVENTS){assert.ok(event.name&&event.color&&event.weather&&event.triggerId);assert.equal(event.enemies,event.enemyIds);assert.ok(EVENT_BOSSES[event.bossId]);for(const id of event.enemies)assert.ok(ENEMIES[id],id);}
 for(const [id,e]of Object.entries(EVENT_BOSSES)){assert.equal(BOSSES[id].eventOnly,true);assert.ok(!REGULAR_BOSS_IDS.includes(id));assert.ok(Object.values(MAP_BOSSES).every(pool=>!pool.includes(id)));assert.equal(bossPhases(id).length,2);assert.equal(BOSS_CINEMATICS[id].beats.length,3);assert.match(bossPhases(id)[0].description,/Event only/);}
 for(const id of Object.keys(EVENT_ENEMIES))assert.ok(Object.values(MAP_ENEMIES).every(pool=>!pool.includes(id)));
});

test('all event bosses have three fixed warned signatures in each phase with source-bound clocks',()=>{
 for(const id of Object.keys(EVENT_BOSSES)){
  const styles=new Set();
  for(const fierce of [false,true])for(let skill=1;skill<=3;skill++){
   const {g,e}=cast(id,skill,fierce),u=e.worldEventAttack;assert.ok(u);styles.add(u.style);assert.ok(g.hazards.length);
   assert.ok(g.hazards.every(h=>h.delay>=1.1&&h.sourceClock&&h.cancelWithSource&&h.sourceId===e.id));
   const geometry=JSON.stringify(u.marks),facing=e.facing,x=e.x,y=e.y;g.p.x=700;g.p.y=300;updateEnemyAI(g,e,.3);assert.equal(JSON.stringify(u.marks),geometry);assert.equal(e.facing,facing);assert.equal(e.x,x);assert.equal(e.y,y);
  }
  assert.equal(styles.size,3,id+' has three distinct attack cycles');
 }
 assert.equal(cast('tempestlord',1).g.hazards.length,3);assert.equal(cast('tempestlord',1,true).g.hazards.length,5);
 assert.equal(cast('frostregent',2).g.hazards.length,3);assert.equal(cast('frostregent',2,true).g.hazards.length,5);
 assert.ok(cast('eclipsefemto',2,true).g.hazards[0].width>cast('eclipsefemto',2).g.hazards[0].width);
});

test('each God Hand and Ice Age halo retains a wide escape opening in both phases',()=>{
 for(const fierce of [false,true])for(const id of ['eclipsefemto','frostregent']){
  const {g,e}=cast(id,1,fierce),u=e.worldEventAttack,origin=id==='eclipsefemto'?{x:g.p.x,y:g.p.y}:e,radius=id==='eclipsefemto'?(fierce?185:165):190;
  const x=origin.x+Math.cos(u.gapAngle)*radius,y=origin.y+Math.sin(u.gapAngle)*radius;
  assert.ok(g.hazards.every(h=>!covers(h,x,y)),id+' safe halo opening');
 }
});

test('event-exclusive roaming enemies use actual warned attacks without leaking into ordinary spawn pools',()=>{
 for(const id of Object.keys(EVENT_ENEMIES)){const g=run(),e=spawnEnemy(g,false,false,id);Object.assign(e,{x:180,y:0,speed:0,attackCD:0});updateEnemyAI(g,e,.01);assert.ok(g.hazards.length||g.enemyShots.length,id);assert.ok(g.hazards.every(h=>h.delay>=1));}
});

test('event boss warnings and poses freeze together, preserve their aim through saves and slow together in Kurumi’s domain',()=>{
 for(const id of Object.keys(EVENT_BOSSES)){
  const {g,e}=cast(id,2);sim(g,.3);const age=e.worldEventAttack.age,hage=g.hazards[0].age,marks=JSON.stringify(e.worldEventAttack.marks),store=memory();assert.ok(saveRun(g,store));const loaded=loadRun(store),boss=loaded.enemies[0];assert.equal(loaded.status,'paused');assert.deepEqual(boss.worldEventAttack,e.worldEventAttack);loaded.status='playing';
  applyStatus(boss,'stun',2);sim(loaded,.2);assert.equal(boss.worldEventAttack.age,age);assert.equal(loaded.hazards[0].age,hage);
  boss.statuses={};loaded.ultimate={type:'kurumi',x:boss.x,y:boss.y,r:800,age:0,duration:10,shadows:[],slowCD:999};sim(loaded,.1);assert.ok(Math.abs(boss.worldEventAttack.age-age-.07)<1e-8);assert.ok(Math.abs(loaded.hazards[0].age-hage-.07)<1e-8);assert.equal(JSON.stringify(boss.worldEventAttack.marks),marks);
  loaded.ultimate=null;loaded.freeze=5;loaded.voidRadius=1000;const frozen=boss.worldEventAttack.age,warning=loaded.hazards[0].age,windup=boss.windup;sim(loaded,.1);assert.equal(boss.worldEventAttack.age,frozen);assert.equal(loaded.hazards[0].age,warning);assert.equal(boss.windup,windup);
 }
});

test('El Thor deals no damage before release and its fixed marks allow a clean lateral escape',()=>{
 for(const evade of [false,true]){
  const {g,e}=cast('tempestlord',1);g.invuln=0;const hp=g.p.hp;sim(g,1);assert.equal(g.p.hp,hp);
  if(evade){g.p.x=250;g.p.y=230;}
  sim(g,.7);assert.equal(g.p.hp<hp,!evade);assert.ok(e.hp>0);
 }
});
