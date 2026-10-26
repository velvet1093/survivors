import test from 'node:test';
import assert from 'node:assert/strict';
import {CHARACTERS} from '../src/game.js';
import {createRun,updateRun,castWeapon,spawnEnemy} from '../src/engine.js';
import {castSalvation,updateSalvationShot,SALVATION_COLORS} from '../src/salvation.js';
import {hasStatus} from '../src/status.js';
import {saveRun,loadRun} from '../src/run-save.js';

const close=(a,b)=>assert.ok(Math.abs(a-b)<1e-8,`${a} ≈ ${b}`);
const api={damage(g,e,n){if(!e.invulnerable)e.hp-=n;}};
function run(){
 const g=createRun(CHARACTERS.find(c=>c.id==='madoka'),3);g.p.weapons={rosebow:5};g.p.passives={};g.p.fusions={rosebow:'salvation'};g.p.meta={};g.p.area=1;g.p.regen=0;g.p.cooldowns.rosebow=999;g.spawn=g.eliteAt=g.nextBossWave=g.events.nextAt=g.rifts.nextAt=g.p.nextXp=1e9;g.invuln=999;g.world.active=[];g.world.circles=[];return g;
}
function enemy(g,x=150,y=0,extra={}){const e={id:++g.id,x,y,r:10,hp:10000,maxHp:10000,...extra};g.enemies.push(e);return e;}
function cast(g,target,power=1,boost={}){assert.equal(castSalvation(g,'rosebow',target,power,boost,api),true);return g.shots;}
function straight(s,x=0,y=0){Object.assign(s,{x,y,ox:x,oy:y,vx:540,vy:0});return s;}
function step(g,s,seconds,dt=.02){for(let t=0;t<seconds-1e-9;t+=dt)updateSalvationShot(g,s,Math.min(dt,seconds-t),api);}
const store=()=>({data:new Map(),getItem(k){return this.data.get(k)},setItem(k,v){this.data.set(k,v)},removeItem(k){this.data.delete(k)}});

test('Salvation handles only the final rose bow, with five distinct wishes and independent initial marks',()=>{
 const g=run(),targets=Array.from({length:5},(_,i)=>enemy(g,150+i*70,i*20)),position={x:g.p.x,y:g.p.y};
 assert.equal(castSalvation(g,'ki',targets[0],1,{},api),false);g.p.fusions.rosebow='ultimate';assert.equal(castSalvation(g,'rosebow',targets[0],1,{},api),false);g.p.fusions.rosebow='salvation';assert.equal(castSalvation(g,'rosebow',null,1,{},api),false);assert.equal(castSalvation(g,'rosebow',targets[0],NaN,{},api),false);
 const shots=cast(g,targets[0]);assert.equal(shots.length,5);assert.deepEqual(shots.map(s=>s.color),SALVATION_COLORS);assert.deepEqual(shots.map(s=>s.colorIndex),[0,1,2,3,4]);assert.equal(new Set(shots.map(s=>s.targetId)).size,5);assert.ok(shots.every(s=>s.sourceWeapon==='rosebow'&&s.type==='salvation-arrow'&&s.holy&&s.pierce===4&&s.life===2.5&&s.hits instanceof Set));assert.deepEqual({x:g.p.x,y:g.p.y},position);assert.equal(g.effects[0].type,'salvation-cast');assert.equal(g.effects[0].colors.length,5);
});

test('Threads of Hope and signature projectile mastery survive the five-wish evolution without multiplying the healing budget',()=>{
 for(const [bonus,mastery,expected]of [[0,0,5],[3,0,8],[3,2,10],[0,3,8],[100,100,20]]){
  const g=run(),e=enemy(g);g.p.meta.projectiles=mastery;const shots=cast(g,e,1,{projectiles:bonus});assert.equal(shots.length,expected);assert.deepEqual(shots.slice(0,5).map(s=>s.colorIndex),[0,1,2,3,4]);assert.ok(shots.every((s,i)=>s.colorIndex===i%5));close(shots.filter(s=>s.colorIndex===0).reduce((n,s)=>n+s.healCap,0),2);
 }
 const g=run(),e=enemy(g);g.p.weapon='ki';g.p.meta.projectiles=4;assert.equal(cast(g,e,1,{projectiles:3}).length,8,'foreign signature mastery does not add rose arrows');
});

test('damage receives the supplied rank and empowered multipliers once while area applies its own cast and signature modifiers',()=>{
 const g=run(),e=enemy(g);g.p.area=1.2;g.p.meta.signatureArea=.25;g.p.meta.signatureDamage=.8;const s=cast(g,e,2.4*2*1.3,{area:1.4})[0];close(s.damage,38*2.4*2*1.3);close(s.blastDamage,s.damage*.35);close(s.blastRadius,90*1.2*1.4*1.25);close(s.r,6*1.2*1.4*1.25);
});

test('swept light arrows pierce four distinct enemies and cannot replay spent collisions after expiration',()=>{
 const g=run(),targets=[100,250,400,550,700,850].map(x=>enemy(g,x));const s=straight(cast(g,targets[0])[1]);updateSalvationShot(g,s,1.7,api);assert.deepEqual([...s.hits],targets.slice(0,4).map(e=>e.id));assert.equal(s.pierce,0);assert.equal(s.life,0);for(const e of targets.slice(0,4))close(e.hp,10000-38);assert.equal(targets[4].hp,10000);assert.equal(targets[5].hp,10000);const hp=targets[0].hp;updateSalvationShot(g,s,10,api);assert.equal(targets[0].hp,hp);
 assert.equal(updateSalvationShot(g,{type:'rosebow'},.1,api),false);
});

test('each wish applies its distinct effect only on a connected damaging hit, with bounded pink healing',()=>{
 const effects=[null,'slow','stun','burning','cursed'];
 for(let i=0;i<5;i++){
  const g=run(),e=enemy(g,120);g.p.hp=50;const s=straight(cast(g,e)[i]);updateSalvationShot(g,s,.25,api);assert.ok(e.hp<10000);if(effects[i])assert.ok(hasStatus(e,effects[i]));close(g.p.hp,i===0?50.5:50);assert.equal(g.effects.filter(v=>v.type==='salvation-bloom').length,1);
  const h=run(),immune=enemy(h,120,0,{invulnerable:true});h.p.hp=50;const blocked=straight(cast(h,immune)[i]);updateSalvationShot(h,blocked,.25,api);assert.equal(immune.hp,10000);assert.equal(h.p.hp,50);assert.equal(immune.statuses,undefined);assert.equal(h.effects.filter(v=>v.type==='salvation-bloom').length,0);
 }
 const g=run(),targets=[100,250,400,550,700].map(x=>enemy(g,x));g.p.hp=50;const s=straight(cast(g,targets[0])[0]);updateSalvationShot(g,s,1.5,api);close(g.p.hp,52);close(s.healed,2);step(g,s,10);close(g.p.hp,52);
});

test('wish blooms damage nearby enemies and scenery once per impact, without healing from splash or terrain',()=>{
 const g=run(),direct=enemy(g,120),splash=enemy(g,120,50),far=enemy(g,120,150);g.p.hp=50;
 const prop={id:'test-prop',x:120,y:35,r:10,hp:10000,vx:0,vy:0};g.world.active=[prop];const s=straight(cast(g,direct)[0]);updateSalvationShot(g,s,.25,api);close(direct.hp,10000-38);close(splash.hp,10000-38*.35);assert.equal(far.hp,10000);close(prop.hp,10000-38*.35);close(g.p.hp,50.5);assert.deepEqual([...s.hits],[direct.id]);
 // Holy arrows pass straight through geometry without dealing direct prop hits.
 const h=run(),e=enemy(h,700);h.p.hp=50;const obstacle={id:'wall',x:120,y:0,r:60,hp:10000,vx:0,vy:0};h.world.active=[obstacle];const holy=straight(cast(h,e)[0]);updateSalvationShot(h,holy,.25,api);assert.equal(obstacle.hp,10000);assert.equal(h.p.hp,50);assert.ok(holy.life>0);assert.equal(holy.hits.size,0);
});

test('homing respects saved initial marks, then retargets a new living enemy after the first hit',()=>{
 const g=run(),first=enemy(g,150),second=enemy(g,350,100),s=straight(cast(g,first)[0]);assert.equal(s.targetId,first.id);updateSalvationShot(g,s,.3,api);assert.ok(s.hits.has(first.id));updateSalvationShot(g,s,.03,api);assert.equal(s.targetId,second.id);assert.ok(s.vy>0);const oldHits=s.hits.size;second.hp=0;updateSalvationShot(g,s,.03,api);assert.equal(s.hits.size,oldHits);
});

test('a final-arrow checkpoint preserves targets, consumed hit sets, flight clocks and the remaining pink healing budget',()=>{
 const g=run(),e=enemy(g,120),next=enemy(g,400);g.p.hp=50;const s=straight(cast(g,e)[0]);updateSalvationShot(g,s,.25,api);const storage=store();assert.ok(saveRun(g,storage));const loaded=loadRun(storage);assert.ok(loaded);assert.equal(loaded.status,'paused');assert.deepEqual(loaded.shots,g.shots);assert.ok(loaded.shots[0].hits instanceof Set);close(loaded.shots[0].healed,.5);close(loaded.shots[0].healCap,2);const age=loaded.shots[0].age,hp=loaded.enemies[0].hp;updateRun(loaded,3);assert.equal(loaded.shots[0].age,age);assert.equal(loaded.enemies[0].hp,hp);updateSalvationShot(loaded,loaded.shots[0],.5,api);assert.ok(loaded.shots[0].age>age);assert.ok(loaded.shots[0].hits.has(next.id));assert.ok(loaded.shots[0].healed<=2);
});

test('the real engine preserves Madoka’s empowered volley, signature scaling and final-bow cadence',()=>{
 const g=run(),e=spawnEnemy(g,false,false,'soldier');Object.assign(e,{x:650,y:0,hp:100000,maxHp:100000,speed:0,attackCD:999,ultimateCD:999});g.p.damage=1;g.p.meta={signatureDamage:.2,signatureArea:.3,signatureCooldown:.1,projectiles:2};g.p.cooldown=.8;g.mechanic.value=100;g.p.hp=50;g.p.maxShield=30;g.p.shield=0;
 assert.equal(castWeapon(g,'rosebow',e),true);assert.equal(g.shots.length,10);assert.ok(g.shots.every(s=>s.type==='salvation-arrow'));close(g.shots[0].damage,38*2.4*2*1.2);close(g.shots[0].blastRadius,90*1.3);assert.equal(g.mechanic.value,0);assert.equal(g.p.hp,55);assert.equal(g.p.shield,8);
 g.shots=[];g.p.cooldowns.rosebow=0;updateRun(g,.01);assert.equal(g.shots.length,7);close(g.p.cooldowns.rosebow,1.6*.72*.8*.9);assert.ok(g.shots.every(s=>s.age>0&&s.age<=.01));
});

test('extra pink arrows share a two-HP healing limit across the whole empowered volley',()=>{
 const g=run(),targets=[100,250,400,550].map(x=>enemy(g,x));g.p.hp=50;const shots=cast(g,targets[0],1,{projectiles:3}),pink=shots.filter(s=>s.colorIndex===0);assert.equal(pink.length,2);
 for(const s of pink){straight(s);updateSalvationShot(g,s,1.5,api);assert.equal(s.hits.size,4);close(s.healed,1);}close(g.p.hp,52);
});
