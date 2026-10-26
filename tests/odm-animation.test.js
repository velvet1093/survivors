import test from 'node:test';import assert from 'node:assert/strict';
import {CHARACTERS,applyChoice} from '../src/game.js';import {createRun,castWeapon,spawnEnemy,updateRun} from '../src/engine.js';import {ensureWorld} from '../src/world.js';import {clearStatuses,hasStatus} from '../src/status.js';import {drawOdmAttack} from '../src/odm-art.js';
function run(id='eren'){const g=createRun(CHARACTERS.find(c=>c.id===id),3);g.spawn=g.eliteAt=g.nextBossWave=1e9;g.p.nextXp=1e9;g.p.regen=0;g.invuln=999;ensureWorld(g);for(const o of g.world.objects.values())o.hp=0;g.world.active=[];g.world.circles=[];for(const id of Object.keys(g.p.weapons))g.p.cooldowns[id]=999;return g;}
function enemy(g,x,y=0){const e=spawnEnemy(g,false,false,'zoomer');Object.assign(e,{x,y,hp:10000,maxHp:10000,speed:0,attackCD:999});return e;}
function sim(g,time){for(let i=0;i<Math.round(time/.02);i++)updateRun(g,.02);}

test('ODM visual resolves the original cone once and snapshots the grapples without moving the owner',()=>{
 const g=run(),front=enemy(g,90),rear=enemy(g,-90),far=enemy(g,500),off=enemy(g,-50,110),before={x:g.p.x,y:g.p.y};castWeapon(g,'odmblades',front);
 assert.equal(front.hp,9976);assert.equal(rear.hp,10000);assert.equal(far.hp,10000);assert.equal(off.hp,10000);assert.ok(hasStatus(front,'bleeding'));assert.deepEqual({x:g.p.x,y:g.p.y},before);assert.equal(g.dash,null);assert.equal(g.dashCD,0);
 const effect=g.effects.find(e=>e.type==='odm-slash');assert.equal(effect.max,.48);assert.equal(effect.r,123);assert.equal(effect.rank,1);assert.equal(effect.angle,0);assert.equal(effect.hookDistance,90);assert.equal(g.p.attackTimer,.42);const snapshot=structuredClone(effect);front.x=300;g.p.x=20;clearStatuses(front);sim(g,.3);assert.equal(front.hp,9976);for(const key of ['x','y','r','angle','hookDistance','hookSpread'])assert.equal(effect[key],snapshot[key]);sim(g,.2);assert.ok(!g.effects.includes(effect));
});
test('rank, area, direction and scenery damage remain tied to the actual ODM cone',()=>{
 const g=run();g.p.weapons.odmblades=5;g.p.area=2;const target=enemy(g,-250),behind=enemy(g,200);const props=[{id:'front',kind:'prop',x:-90,y:0,r:10,hp:1000,maxHp:1000,solid:true,type:'crate',vx:0,vy:0},{id:'rear',kind:'prop',x:90,y:0,r:10,hp:1000,maxHp:1000,solid:true,type:'crate',vx:0,vy:0}];g.world.active=props;for(const p of props)g.world.objects.set(p.id,p);
 castWeapon(g,'odmblades',target);const power=1+(5-1)*.35;assert.ok(Math.abs(10000-target.hp-24*power)<1e-8);assert.equal(behind.hp,10000);assert.ok(Math.abs(1000-props[0].hp-30*power)<1e-8);assert.equal(props[1].hp,1000);const effect=g.effects.find(e=>e.type==='odm-slash');assert.equal(effect.r,310);assert.equal(effect.angle,Math.PI);assert.equal(effect.hookDistance,250);assert.ok(effect.hookSpread>0);
});
test('borrowed ODM uses the same visual and pauses freeze its complete animation',()=>{
 const g=run('goku');g.p.weapons.odmblades=1;g.p.cooldowns.odmblades=999;const e=enemy(g,60,80);castWeapon(g,'odmblades',e);const effect=g.effects.find(e=>e.type==='odm-slash');assert.equal(effect.angle,Math.atan2(80,60));const first=effect.slashSide;castWeapon(g,'odmblades',e);assert.equal(g.effects.at(-1).slashSide,-first);g.status='paused';const before=structuredClone(g.effects);updateRun(g,3);assert.deepEqual(g.effects,before);
});
test('Thunder Spears retain their own projectile attack and never emit the unevolved blade animation',()=>{
 const g=run();g.p.weapons.odmblades=5;g.p.passives.freedom=3;assert.ok(applyChoice(g.p,{kind:'fusion',id:'scoutassault'}));castWeapon(g,'odmblades',enemy(g,100));assert.equal(g.shots.length,2);assert.ok(g.shots.every(s=>s.type==='thunderspear'));assert.ok(!g.effects.some(e=>e.type==='odm-slash'));
});
test('all ODM launch, cross-cut and follow-through frames draw finite immutable snapshots, including reduced motion',()=>{
 const calls=[],context=new Proxy({globalAlpha:1},{get(target,key){if(key in target)return target[key];return (...args)=>{for(const value of args)if(typeof value==='number')assert.ok(Number.isFinite(value),`${String(key)} received ${value}`);calls.push(key);};},set(target,key,value){target[key]=value;return true;}}),effect={x:20,y:30,r:155,angle:0,rank:5,hookDistance:120,hookSpread:24,slashSide:1},before=structuredClone(effect);
 for(const angle of [0,Math.PI/2,Math.PI,-Math.PI/2])for(const reduced of [false,true])for(const progress of [0,.12,.25,.5,.75,1])drawOdmAttack(context,{...effect,angle},progress,reduced);
 assert.deepEqual(effect,before);assert.ok(calls.includes('quadraticCurveTo'));assert.ok(calls.includes('fillRect'));assert.ok(calls.includes('rotate'));assert.ok(calls.includes('arc'));
});
