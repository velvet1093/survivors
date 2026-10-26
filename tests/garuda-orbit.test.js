import test from 'node:test';import assert from 'node:assert/strict';
import {CHARACTERS} from '../src/game.js';import {createRun,damageEnemy,updateRun,castWeapon} from '../src/engine.js';
import {newGaruda,updateGaruda,castGaruda,updateGarudaShot,garudaStats,reconcileGaruda,garudaCompanionVisible,garudaShotVisible} from '../src/garuda.js';
import {companionLeash} from '../src/companion-ai.js';import {ensureWorld} from '../src/world.js';import {saveRun,loadRun} from '../src/run-save.js';import {hasStatus} from '../src/status.js';
const hero=id=>CHARACTERS.find(c=>c.id===id),memory=()=>({data:new Map(),getItem(k){return this.data.get(k)},setItem(k,v){this.data.set(k,v)},removeItem(k){this.data.delete(k)}});
function run(id='yuki'){const g=createRun(hero(id),3);g.spawn=g.eliteAt=g.nextBossWave=1e6;g.p.nextXp=1e6;g.p.cooldowns.garuda=999;ensureWorld(g);for(const o of g.world.objects.values())o.hp=0;g.world.active=[];updateGaruda(g,.01);return g;}
function enemy(id,x,y=0,hp=1000){return {id,x,y,hp,maxHp:hp,r:12,boss:false,elite:false,slow:0,orbitCD:0,attackCD:999,speed:0,archetype:'zoomer',color:'#aac',lastDamagedAt:0};}
function step(g,s,seconds){for(let i=0;i<Math.ceil(seconds/.02)&&s.life>0;i++){updateGaruda(g,.02);updateGarudaShot(g,s,.02,{damage:damageEnemy});}}
test('Garuda is a persistent flying companion that circles Yuki, follows movement, freezes on pause and stays on screen',()=>{
 const g=run();assert.ok(g.garuda);const first={...g.garuda};updateGaruda(g,.5);assert.notEqual(g.garuda.x,first.x);assert.notEqual(g.garuda.y,first.y);g.p.x=800;g.p.y=-300;g.view={w:390,h:844};g.zoom=g.targetZoom=1.65;updateGaruda(g,.1);assert.ok(Math.hypot(g.garuda.x-g.p.x,g.garuda.y-g.p.y)<companionLeash(g));const state=JSON.stringify(g.garuda);g.status='paused';updateGaruda(g,10);updateRun(g,10);assert.equal(JSON.stringify(g.garuda),state);g.status='playing';g.p.reducedMotion=true;updateGaruda(g,.1);const quiet={x:g.garuda.x,y:g.garuda.y,angle:g.garuda.angle};updateGaruda(g,2);assert.deepEqual({x:g.garuda.x,y:g.garuda.y,angle:g.garuda.angle},quiet);assert.equal(newGaruda(run('goku')),null);
});
test('rank upgrades increase ricochet hit limits and bounce reach; evolution grants three further victims',()=>{
 for(let rank=1;rank<=5;rank++){const g=run();g.p.weapons.garuda=rank;g.enemies=Array.from({length:10},(_,i)=>enemy(i+1,110+(i%3)*43,-70+Math.floor(i/3)*43));const s=castGaruda(g,g.enemies[0],1);assert.equal(s.maxHits,rank+4);assert.equal(s.x,g.garuda.x);assert.equal(s.y,g.garuda.y);step(g,s,4);assert.equal(s.hits.size,rank+4);assert.equal(g.enemies.filter(e=>e.hp<1000).length,rank+4);assert.equal(s.life,0);}
 const g=run();g.p.weapons.garuda=5;g.p.fusions.garuda='starcrusher';g.enemies=Array.from({length:14},(_,i)=>enemy(i+1,80+(i%4)*42,-70+Math.floor(i/4)*42));const s=castGaruda(g,g.enemies[0],1);assert.equal(s.maxHits,12);step(g,s,6);assert.equal(s.hits.size,12);assert.equal(s.remaining,0);assert.equal(s.life,0);assert.ok(garudaStats(5).bounceRange>garudaStats(1).bounceRange);
});
test('ricochets hit distinct living enemies and build Star Rage; isolated casts return to Yuki without repeated damage',()=>{
 const g=run();g.enemies=[enemy(1,110,-25),enemy(2,155,40),enemy(3,210,-20)];g.p.weapons.garuda=3;const s=castGaruda(g,g.enemies[0],1);step(g,s,3);assert.equal(s.hits.size,3);assert.ok(g.enemies.every(e=>e.hp===972));assert.ok(Math.abs(g.mechanic.value-39.6)<1e-7);assert.equal(s.life,0);const solo=run();solo.enemies=[enemy(1,110,-25)];const q=castGaruda(solo,solo.enemies[0],1);step(solo,q,3);assert.equal(q.hits.size,1);assert.equal(solo.enemies[0].hp,972);assert.equal(q.life,0);
});
test('Garuda retargets when a victim dies, refuses distant enemies and recalls after the owner moves away',()=>{
 const g=run();g.enemies=[enemy(1,120,-25),enemy(2,160,30)];const s=castGaruda(g,g.enemies[0],1);g.enemies[0].hp=0;step(g,s,2);assert.ok(s.hits.has(2));assert.equal(s.hits.has(1),false);const far=run();far.view={w:390,h:844};far.enemies=[enemy(1,1000)];const q=castGaruda(far,far.enemies[0],1);step(far,q,2);assert.equal(far.enemies[0].hp,1000);assert.equal(q.life,0);const move=run();move.enemies=[enemy(1,250)];const m=castGaruda(move,move.enemies[0],1);move.p.x=1200;updateGaruda(move,.02);updateGarudaShot(move,m,.02,{damage:damageEnemy});assert.ok(m.returning);assert.ok(Math.hypot(m.x-move.p.x,m.y-move.p.y)<=companionLeash(move));
});
test('mass and fusion preserve area impacts, enemy control and breakable-scenery damage',()=>{
 const g=run();g.p.fusions.garuda='starcrusher';g.mechanic.active=8;g.enemies=[enemy(1,110,-25),enemy(2,120,10)];const prop={id:'garuda-test-prop',kind:'prop',type:'crate',x:140,y:-25,r:12,hp:500,maxHp:500,mass:1,seed:.2};g.world.active=[prop];const s=castGaruda(g,g.enemies[0],1);step(g,s,.16);assert.ok(g.enemies[0].hp<1000);assert.ok(g.enemies[1].hp<1000);assert.ok(hasStatus(g.enemies[1],'stun'));assert.ok(prop.hp<500);assert.ok(g.effects.some(e=>e.type==='nova'&&e.r>72));
});
test('Garuda companion, ricochet history and remaining bounces checkpoint without duplicate strikes',()=>{
 const g=run(),storage=memory();g.p.weapons.garuda=4;g.enemies=[enemy(1,100,-25),enemy(2,170,30),enemy(3,220,-10)];const s=castGaruda(g,g.enemies[0],1);while(s.hits.size<1&&s.life>0)step(g,s,.02);const hp=g.enemies[0].hp;saveRun(g,storage);const r=loadRun(storage);assert.equal(r.status,'paused');assert.deepEqual(r.garuda,g.garuda);assert.ok(r.shots[0].hits instanceof Set);assert.ok(r.shots[0].propHits instanceof Set);assert.equal(r.shots[0].remaining,s.remaining);r.status='playing';step(r,r.shots[0],3);assert.equal(r.enemies[0].hp,hp);assert.equal(r.shots[0].hits.size,3);
});
test('old airborne Garuda checkpoints gain bounded ricochets while preserving previous victims',()=>{
 const g=run();g.enemies=[enemy(1,100),enemy(2,160)];const old={type:'garuda',x:120,y:0,vx:450,vy:0,r:8,age:.4,life:1,rank:2,fused:false,damage:28,hits:new Set([1]),color:'#a0d8b2'};updateGarudaShot(g,old,.02,{damage:damageEnemy});assert.equal(old.garudaRulesVersion,3);assert.equal(old.maxHits,6);assert.ok(old.hits.has(1));step(g,old,2);assert.equal(g.enemies[0].hp,1000);assert.ok(old.hits.has(2));assert.equal(old.life,0);
});
test('version-two saved flights receive three extra bounces once, including evolution, without replaying victims',()=>{
 for(const fused of [false,true]){
  const g=run(),storage=memory();g.p.weapons.garuda=5;if(fused)g.p.fusions.garuda='starcrusher';g.enemies=[enemy(1,-100),enemy(2,160)];
  const s=castGaruda(g,g.enemies[0],1),oldMax=fused?9:6;Object.assign(s,{garudaRulesVersion:2,maxHits:oldMax,remaining:oldMax-1,hits:new Set([1]),life:2});
  saveRun(g,storage);const loaded=loadRun(storage),flight=loaded.shots[0];assert.equal(flight.maxHits,oldMax+3);assert.equal(flight.remaining,oldMax+2);assert.deepEqual(flight.hits,new Set([1]));assert.ok(flight.life>2);assert.equal(flight.garudaRulesVersion,3);
  const budget={life:flight.life,remaining:flight.remaining,maxHits:flight.maxHits};for(let i=0;i<5;i++)updateGaruda(loaded,10);assert.deepEqual({life:flight.life,remaining:flight.remaining,maxHits:flight.maxHits},budget);
  saveRun(loaded,storage);const again=loadRun(storage).shots[0];assert.deepEqual({life:again.life,remaining:again.remaining,maxHits:again.maxHits},budget);
  loaded.status='playing';step(loaded,flight,3);assert.equal(loaded.enemies[0].hp,1000);assert.ok(flight.hits.has(2));
 }
});
test('upgrading a returning flight preserves its recall and never extends its return timer',()=>{
 const g=run();g.enemies=[enemy(1,100)];const s=castGaruda(g,g.enemies[0],1);Object.assign(s,{garudaRulesVersion:2,maxHits:2,remaining:0,hits:new Set([1,2]),returning:true,life:.8});reconcileGaruda(g);assert.equal(s.maxHits,5);assert.equal(s.remaining,3);assert.equal(s.returning,true);assert.equal(s.life,.8);step(g,s,2);assert.equal(s.life,0);assert.equal(g.enemies[0].hp,1000);assert.ok(garudaCompanionVisible(g));
});

const visibleGarudas=g=>(garudaCompanionVisible(g)?1:0)+g.shots.filter(s=>s.type==='garuda'&&s.life>0&&garudaShotVisible(g,s)).length;
test('Yuki sends her one physical Garuda away, shows no orbiting copy, and regains it after the return',()=>{
 const g=run();g.enemies=[enemy(1,150,-50),enemy(2,210,50)];assert.equal(visibleGarudas(g),1);assert.ok(garudaCompanionVisible(g));const departure={x:g.garuda.x,y:g.garuda.y},s=castGaruda(g,g.enemies[0],1);
 assert.equal(g.garuda.inFlight,true);assert.equal(g.garuda.flightId,s.garudaFlightId);assert.equal(garudaCompanionVisible(g),false);assert.equal(visibleGarudas(g),1);step(g,s,.08);assert.ok(Math.hypot(s.x-departure.x,s.y-departure.y)>20);assert.equal(g.garuda.x,s.x);assert.equal(g.garuda.y,s.y);assert.equal(castGaruda(g,g.enemies[0],1),false);assert.equal(g.shots.filter(s=>s.type==='garuda'&&s.life>0).length,1);
 for(let i=0;i<150&&s.life>0;i++){step(g,s,.02);assert.equal(visibleGarudas(g),1);}assert.equal(s.life,0);assert.equal(g.garuda.inFlight,false);assert.equal(g.garuda.flightId,null);assert.ok(garudaCompanionVisible(g));const again=castGaruda(g,g.enemies[0],1);assert.ok(again);assert.notEqual(again.garudaFlightId,s.garudaFlightId);
});
test('busy physical Garuda casts keep the ready cooldown, while other heroes can retain multiple shared-weapon shots',()=>{
 const g=run();g.enemies=[enemy(1,180,-50)];castGaruda(g,g.enemies[0],1);g.p.cooldowns.garuda=0;assert.equal(castWeapon(g,'garuda',g.enemies[0]),false);assert.equal(g.p.cooldowns.garuda,0);assert.equal(g.shots.filter(s=>s.type==='garuda'&&s.life>0).length,1);
 const other=run('goku');other.p.weapons.garuda=1;other.enemies=[enemy(1,180)];assert.ok(castGaruda(other,other.enemies[0],1));assert.ok(castGaruda(other,other.enemies[0],1));assert.equal(other.shots.filter(s=>s.type==='garuda'&&s.life>0).length,2);assert.ok(other.shots.every(s=>garudaShotVisible(other,s)));
});
test('physical Garuda recall flies home after its flight budget expires and remains paused during interruptions',()=>{
 const g=run();g.enemies=[enemy(1,240)];const s=castGaruda(g,g.enemies[0],1);s.x=210;s.y=30;s.life=.01;step(g,s,.02);assert.ok(s.returning);assert.ok(s.life>0);assert.equal(g.garuda.inFlight,true);assert.equal(visibleGarudas(g),1);
 const before=JSON.stringify({companion:g.garuda,shot:s},(_,value)=>value instanceof Set?[...value]:value);g.status='chest';updateGaruda(g,10);updateGarudaShot(g,s,10,{damage:damageEnemy});assert.equal(JSON.stringify({companion:g.garuda,shot:s},(_,value)=>value instanceof Set?[...value]:value),before);g.status='playing';step(g,s,2);assert.equal(s.life,0);assert.ok(garudaCompanionVisible(g));assert.equal(visibleGarudas(g),1);
});
test('saved physical departures keep a single flight, its position and hit history while the side companion stays hidden',()=>{
 const g=run(),storage=memory();g.p.weapons.garuda=4;g.enemies=[enemy(1,100,-25),enemy(2,190,30),enemy(3,230,-20)];const s=castGaruda(g,g.enemies[0],1);while(!s.hits.size&&s.life>0)step(g,s,.02);const firstHp=g.enemies[0].hp,flightId=s.garudaFlightId;saveRun(g,storage);const r=loadRun(storage);reconcileGaruda(r);assert.equal(r.garuda.flightId,flightId);assert.equal(r.garuda.inFlight,true);assert.equal(garudaCompanionVisible(r),false);assert.equal(visibleGarudas(r),1);assert.equal(r.shots[0].x,s.x);assert.ok(r.shots[0].hits.has(1));r.status='playing';step(r,r.shots[0],3);assert.equal(r.enemies[0].hp,firstHp);assert.ok(garudaCompanionVisible(r));
});
test('legacy overlapping projections migrate to one physical Garuda and merge all prior victim history',()=>{
 const g=run();g.enemies=[enemy(1,100),enemy(2,130),enemy(3,170)];g.enemies[0].hp=900;g.enemies[1].hp=900;
 const old=(x,hits)=>({type:'garuda',garudaRulesVersion:1,x,y:0,vx:460,vy:0,r:8,age:.4,life:2,rank:2,fused:false,damage:28,hits:new Set(hits),propHits:new Set(),remaining:3-hits.length,maxHits:3,speed:480,bounceRange:240,color:'#d9dfd0'});const a=old(140,[1]),b=old(145,[2]);g.shots=[a,b];delete g.garuda.inFlight;delete g.garuda.flightId;assert.equal(visibleGarudas(g),1,'renderer hides duplicates even before migration');const storage=memory();saveRun(g,storage);const loaded=loadRun(storage);assert.equal(loaded.status,'paused');assert.equal(loaded.shots.filter(s=>s.type==='garuda'&&s.life>0).length,1);assert.equal(visibleGarudas(loaded),1);assert.equal(garudaCompanionVisible(loaded),false);assert.deepEqual(loaded.shots.find(s=>s.life>0).hits,new Set([1,2]));assert.equal(loaded.shots.find(s=>s.life>0).remaining,4);const selected=reconcileGaruda(g);assert.equal(selected,a);assert.equal(b.life,0);assert.deepEqual(a.hits,new Set([1,2]));assert.equal(a.remaining,4);assert.equal(visibleGarudas(g),1);step(g,a,3);assert.equal(g.enemies[0].hp,900);assert.equal(g.enemies[1].hp,900);assert.ok(g.enemies[2].hp<1000);assert.equal(a.hits.size,3);assert.ok(garudaCompanionVisible(g));
});
