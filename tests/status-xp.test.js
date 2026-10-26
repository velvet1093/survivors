import test from 'node:test';
import assert from 'node:assert/strict';
import {STATUS_EFFECTS,applyStatus,hasStatus,updateStatuses,statusModifiers,clearStatuses} from '../src/status.js';
import {XP_GEMS,gemTier,enemyXpValue,makeGem} from '../src/xp.js';
import {CHARACTERS} from '../src/game.js';
import {createRun,castWeapon,spawnEnemy,updateRun,damageEnemy,hitPlayer,useSpecial} from '../src/engine.js';
import {damageProp,ensureWorld,rollBreakableDrop,collectPickup} from '../src/world.js';
const quiet=(index=0)=>{const g=createRun(CHARACTERS[index],3);g.spawn=1e6;g.eliteAt=1e6;g.p.weapons={};g.p.regen=0;g.p.nextXp=1e6;return g;};
function target(g,x=180,y=0){const e=spawnEnemy(g,false,false,'soldier');Object.assign(e,{x,y,speed:0,attackCD:1e6,hp:10000,maxHp:10000});return e;}
function sim(g,t,input={x:0,y:0}){for(let i=0;i<Math.round(t/.02);i++)updateRun(g,.02,input);}
test('poison delivers the same damage across frame sizes and stops at expiration',()=>{
 function run(step){const e={hp:100};applyStatus(e,'poison',2,{power:6});let damage=0;for(let t=0;t<3-1e-8;t+=step)updateStatuses(e,step,v=>{damage+=v;e.hp-=v;});assert.equal(hasStatus(e,'poison'),false);return damage;}
 assert.equal(run(.02),12);assert.equal(run(.5),12);assert.equal(run(3),12);
});
test('one poison circle refreshes a dose; overlapping distinct circles cap at three',()=>{
 const e={hp:100};for(let i=0;i<20;i++)applyStatus(e,'poison',3,{power:4,source:'circle-a'});assert.equal(e.statuses.poison.stacks,1);applyStatus(e,'poison',3,{power:4,source:'circle-b'});applyStatus(e,'poison',3,{power:4,source:'circle-c'});applyStatus(e,'poison',3,{power:4,source:'circle-d'});assert.equal(e.statuses.poison.stacks,3);let hit=0;updateStatuses(e,.5,v=>hit+=v);assert.equal(hit,6);
});
test('burning and bleeding deal distinct damage and can be cleansed',()=>{
 const e={hp:100};applyStatus(e,'burning',2,{power:8});applyStatus(e,'bleeding',3,{power:4});let hit=0;updateStatuses(e,.5,v=>hit+=v);assert.equal(hit,6);clearStatuses(e,['burning']);assert.equal(hasStatus(e,'burning'),false);assert.equal(hasStatus(e,'bleeding'),true);clearStatuses(e);assert.equal(Object.keys(e.statuses).length,0);
});
test('a curse increases actual incoming damage and expires without changing base stats',()=>{
 const g=quiet(),e=target(g);applyStatus(e,'cursed',1);damageEnemy(g,e,100);assert.equal(e.hp,9880);updateStatuses(e,1);damageEnemy(g,e,100);assert.equal(e.hp,9780);g.p.dodge=0;g.p.shield=0;applyStatus(g.p,'cursed',1);const hp=g.p.hp;hitPlayer(g,10);assert.equal(g.p.hp,hp-12);
});
test('stun stops enemy movement and attacks; bosses recover faster and resist repeated stun',()=>{
 const g=quiet(),e=target(g);e.speed=80;e.attackCD=0;applyStatus(e,'stun',1);const x=e.x;sim(g,.4);assert.equal(e.x,x);assert.equal(g.enemyShots.length,0);sim(g,.7);assert.ok(e.x!==x);assert.ok(g.enemyShots.length>0);
 const boss=spawnEnemy(g,true,false,'frieza');assert.ok(applyStatus(boss,'stun',1));assert.equal(boss.statuses.stun.remaining,.35);assert.equal(applyStatus(boss,'stun',1),false);updateStatuses(boss,.4);assert.equal(applyStatus(boss,'stun',1),false);updateStatuses(boss,2.1);assert.ok(applyStatus(boss,'stun',1));
});
test('slow changes movement, while stun also blocks auto-attacks and ultimate activation',()=>{
 const g=quiet();g.p.weapons={ki:1};target(g);applyStatus(g.p,'stun',1);const x=g.p.x;assert.equal(useSpecial(g),false);sim(g,.4,{x:1,y:0});assert.equal(g.p.x,x);assert.equal(g.effects.filter(e=>e.type==='beam').length,0);clearStatuses(g.p);applyStatus(g.p,'slow',1,{power:.5});const start=g.p.x;sim(g,.1,{x:1,y:0});assert.ok(Math.abs(g.p.x-start-g.p.move*.05)<.1);
});
test('status damage bypasses contact immunity but still consumes shields',()=>{
 const g=quiet(3);g.p.regen=0;g.invuln=99;g.p.shield=3;const hp=g.p.hp;applyStatus(g.p,'poison',1,{power:8});sim(g,.5);assert.equal(g.p.shield,0);assert.equal(g.p.hp,hp-1);sim(g,.5);assert.equal(g.p.hp,hp-5);
});
test('enemy venom and cursed projectiles inflict their statuses only on a successful hit',()=>{
 const g=quiet();g.p.dodge=0;g.enemyShots=[{x:0,y:0,vx:0,vy:0,age:0,life:1,r:6,damage:5,kind:'curse'}];updateRun(g,.02);assert.ok(hasStatus(g.p,'cursed'));g.invuln=0;g.hazards=[{age:0,delay:0,duration:1,shape:'circle',x:0,y:0,r:30,damage:2,label:'VENOM'}];updateRun(g,.02);assert.ok(hasStatus(g.p,'poison'));clearStatuses(g.p);g.invuln=10;updateRun(g,.02);assert.equal(hasStatus(g.p,'poison'),false);
});
test('paused runs freeze enemy and player status timers and damage',()=>{
 const g=quiet(),e=target(g);applyStatus(g.p,'poison',3,{power:4});applyStatus(e,'burning',2,{power:8});g.status='paused';const hp=g.p.hp;updateRun(g,1);assert.equal(g.p.statuses.poison.remaining,3);assert.equal(e.statuses.burning.remaining,2);assert.equal(g.p.hp,hp);
});
test('Maomao circle poisons enemies on entry, persists after exit, then disappears',()=>{
 const g=quiet(4),e=target(g,120);g.p.weapons.poison=1;g.p.cooldowns.poison=999;castWeapon(g,'poison',e);sim(g,.6);const pool=g.fields[0];assert.equal(pool.kind,'poison');assert.ok(pool.life>3);assert.ok(hasStatus(e,'poison'));const hp=e.hp;e.x=500;e.y=500;sim(g,1);assert.ok(e.hp<hp);sim(g,4);assert.equal(g.fields.length,0);assert.equal(hasStatus(e,'poison'),false);
});
test('Jade Alchemy throws three vials that form distinct, stackable poison circles',()=>{
 const g=quiet(4),e=target(g,120);g.p.weapons.poison=5;g.p.fusions.poison='elixir';g.p.cooldowns.poison=999;castWeapon(g,'poison',e);assert.equal(g.shots.length,3);sim(g,.6);assert.equal(g.fields.length,3);assert.equal(new Set(g.fields.map(f=>f.id)).size,3);assert.equal(e.statuses.poison.stacks,3);
});
test('Blue pulls enemies, applies curse and slow, and damages on final collapse',()=>{
 const g=quiet(1),e=target(g,150),other=target(g,205);g.p.weapons.blue=1;g.p.cooldowns.blue=999;castWeapon(g,'blue',e);const x=other.x;sim(g,.3);assert.ok(other.x<x);assert.ok(hasStatus(e,'cursed'));assert.ok(hasStatus(e,'slow'));const hp=e.hp;sim(g,1.8);assert.equal(g.fields.length,0);assert.ok(e.hp<hp);assert.ok(g.effects.some(q=>q.type==='blue-collapse'));
});
test('Hollow Purple converges before moving and curses enemies it pierces',()=>{
 const g=quiet(1),e=target(g,150,-18);g.p.weapons.blue=5;g.p.cooldowns.blue=999;g.p.fusions.blue='purple';castWeapon(g,'blue',e);const x=g.shots[0].x;sim(g,.2);assert.equal(g.shots[0].x,x);sim(g,.75);assert.ok(e.hp<10000);assert.ok(hasStatus(e,'cursed'));assert.ok(g.shots.some(s=>s.type==='blue'&&s.x>150));
});
test('weapon damage sources apply burning, stun and bleeding in actual combat',()=>{
 for(const [weapon,status,index] of [['ki','burning',0],['lightning','stun',0],['shuriken','bleeding',2]]){const g=quiet(index),e=target(g,100);g.p.weapons[weapon]=1;g.p.cooldowns[weapon]=999;castWeapon(g,weapon,e);sim(g,.5);assert.ok(hasStatus(e,status),weapon+' should inflict '+status);}
});
test('Panacea clears harmful statuses and protects Maomao from new poison while active',()=>{
 const g=quiet(4);applyStatus(g.p,'poison',3,{power:4});applyStatus(g.p,'burning',3,{power:4});assert.ok(useSpecial(g));assert.equal(Object.keys(g.p.statuses).length,0);g.invuln=0;g.p.dodge=0;g.hazards=[{age:0,delay:0,duration:1,shape:'circle',x:0,y:0,r:30,damage:2,label:'VENOM'}];updateRun(g,.02);assert.equal(hasStatus(g.p,'poison'),false);
});
test('breakables can drop nothing, never reroll after destruction, and successful rolls still work',()=>{
 assert.equal(rollBreakableDrop(()=>.6),null);assert.equal(rollBreakableDrop(()=>.999),null);const values=[.59,.1];assert.equal(rollBreakableDrop(()=>values.shift()),'money');const g=quiet();ensureWorld(g);const a=g.world.active.find(o=>o.id==='starter:crate');assert.ok(damageProp(g,a,100,0,0,()=>.9));assert.equal(g.pickups.length,0);assert.equal(damageProp(g,a,100,0,0,()=>.1),false);ensureWorld(g);assert.ok(!g.world.active.some(o=>o.id===a.id));const b=g.world.active.find(o=>o.id==='starter:pot');damageProp(g,b,100,0,0,()=>.1);assert.equal(g.pickups.length,1);
});
test('XP drop tiers include ordinary rare drops, elite gems and stronger later boss rewards',()=>{
 assert.deepEqual([.1,.8,.999].map(n=>enemyXpValue({},1,()=>n)),[1,3,10]);assert.equal(enemyXpValue({elite:true},1,()=>.5),10);assert.equal(enemyXpValue({elite:true},1,()=>.1),25);assert.equal(enemyXpValue({boss:true},5),25);assert.equal(enemyXpValue({boss:true},10),50);assert.equal(XP_GEMS.length,5);assert.equal(new Set(XP_GEMS.map(g=>g.color)).size,5);assert.equal(gemTier(14).value,10);assert.equal(makeGem(10,20,50).tier,'ruby');
});
test('all XP gem tiers grant their actual value once and work with magnets',()=>{
 for(const t of XP_GEMS){const g=quiet();g.gems=[makeGem(0,0,t.value,0)];updateRun(g,.02);assert.equal(g.p.xp,t.value);assert.equal(g.gems.length,0);updateRun(g,.02);assert.equal(g.p.xp,t.value);}
 const g=quiet();g.gems=XP_GEMS.map(t=>makeGem(5000,5000,t.value));collectPickup(g,{kind:'magnet'});assert.ok(g.gems.every(gem=>gem.attracted));
});
