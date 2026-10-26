import test from 'node:test';
import assert from 'node:assert/strict';
import {CHARACTERS,refreshStats} from '../src/game.js';
import {createRun,castWeapon,damageEnemy,spawnEnemy,updateRun} from '../src/engine.js';
import {castPairedWeapon,updatePairedShot,pairedWeaponReach,pairedWeaponCooldown} from '../src/paired-weapons.js';
import {heroToxin} from '../src/hero-mechanics.js';
import {hasStatus} from '../src/status.js';
import {ensureWorld} from '../src/world.js';
import {saveRun,loadRun} from '../src/run-save.js';

const close=(a,b)=>assert.ok(Math.abs(a-b)<1e-8,`${a} ≈ ${b}`);
const api={damage:damageEnemy,toxin:heroToxin};
function run(hero='goku'){
 const g=createRun(CHARACTERS.find(c=>c.id===hero),3);g.events.nextAt=g.rifts.nextAt=g.spawn=g.eliteAt=g.nextBossWave=g.p.nextXp=1e9;g.invuln=999;
 ensureWorld(g);for(const o of g.world.objects.values())o.hp=0;g.world.active=[];g.world.circles=[];g.p.weapons={};g.p.passives={};g.p.fusions={};g.p.cooldowns={};g.p.meta={};refreshStats(g.p);g.p.regen=g.p.dodge=0;return g;
}
function enemy(g,x=120,y=0){const e=spawnEnemy(g,false,false,'soldier');Object.assign(e,{x,y,hp:100000,maxHp:100000,r:10,speed:0,attackCD:999,ultimateCD:999});return e;}
function cast(g,id,target,fusion=null,rank=5,power=1){g.p.weapons[id]=rank;if(fusion)g.p.fusions[id]=fusion;assert.equal(castPairedWeapon(g,id,target,power,{},api),true);return g.shots.at(-1);}
function step(g,s,seconds,dt=.02){for(let t=0;t<seconds-1e-9;t+=dt)updatePairedShot(g,s,Math.min(dt,seconds-t),api);}
const store=()=>({data:new Map(),getItem(k){return this.data.get(k)},setItem(k,v){this.data.set(k,v)},removeItem(k){this.data.delete(k)}});

test('Rasengan is a local impact with pushback, rejects distant targets and scales its radius with weapon area',()=>{
 const g=run(),near=enemy(g,120),side=enemy(g,120,58),rear=enemy(g,-120),far=enemy(g,500);g.p.weapons.rasengan=5;
 assert.equal(castPairedWeapon(g,'rasengan',far,1,{},api),false);assert.equal(g.effects.length,0);assert.equal(far.hp,100000);
 cast(g,'rasengan',near);close(near.hp,100000-36);assert.ok(side.hp<100000);assert.equal(rear.hp,100000);assert.ok(near.kvx>0);assert.ok(hasStatus(near,'slow'));assert.equal(g.shots.length,0);
 near.hp=0;assert.equal(castPairedWeapon(g,'rasengan',near,1,{},api),false);const base=pairedWeaponReach(g,'rasengan');g.p.area=1.5;close(pairedWeaponReach(g,'rasengan'),base*1.5);
});

test('Dragon Flame stays at its casting location and deals three finite forward pulses with burning',()=>{
 const g=run(),front=enemy(g,140,-18),rear=enemy(g,-100,-18),side=enemy(g,140,130),s=cast(g,'dragonflame',front);const origin={x:s.x,y:s.y};g.p.x=500;g.p.y=500;
 step(g,s,1);assert.deepEqual({x:s.x,y:s.y},origin);assert.equal(s.pulses,3);close(front.hp,100000-27);assert.equal(rear.hp,100000);assert.equal(side.hp,100000);assert.ok(hasStatus(front,'burning'));
 const hp=front.hp;step(g,s,3);assert.equal(s.pulses,3);assert.equal(front.hp,hp);
});

test('Lightning Flame Dragon Roar reaches a fixed long lane and caps damage at five pulses',()=>{
 const g=run(),target=enemy(g,500,-18),near=enemy(g,180,-18),outside=enemy(g,250,110),s=cast(g,'dragonflame',target,'dragonroar');
 assert.equal(s.type,'dragonroar');updatePairedShot(g,s,.02,api);assert.ok(hasStatus(target,'stun'));assert.ok(hasStatus(target,'burning'));step(g,s,2);assert.equal(s.pulses,5);close(target.hp,100000-60);close(near.hp,100000-60);assert.equal(outside.hp,100000);
 const first=s;const second=cast(g,'dragonflame',outside,'dragonroar');assert.equal(first.life,0);assert.ok(second.life>0);assert.equal(g.shots.filter(shot=>shot.life>0&&shot.type==='dragonroar').length,1);
});

test('Flying Raijin: Rasengan marks at most three distinct foes, skips out-of-range jumps and never teleports its owner',()=>{
 const g=run(),first=enemy(g,100,-18),second=enemy(g,270,-18),third=enemy(g,440,-18),fourth=enemy(g,610,-18),s=cast(g,'rasengan',first,'raijinrasengan');const owner={x:g.p.x,y:g.p.y};step(g,s,2.4);
 assert.deepEqual([...s.hits],[first.id,second.id,third.id]);assert.equal(s.jumpsLeft,0);for(const e of [first,second,third])close(e.hp,100000-46);assert.equal(fourth.hp,100000);assert.deepEqual({x:g.p.x,y:g.p.y},owner);assert.equal(s.life,0);
 const h=run(),a=enemy(h,100,-18),b=enemy(h,400,-18),shot=cast(h,'rasengan',a,'raijinrasengan');step(h,shot,1);assert.deepEqual([...shot.hits],[a.id]);assert.equal(b.hp,100000);
});

test('Wisteria Petals pierce only a bounded number of enemies and do not hit the same foe twice',()=>{
 const g=run(),targets=[100,200,300,400,500].map(x=>enemy(g,x,-18)),s=cast(g,'wisteriapetals',targets[0]);assert.equal(g.shots.length,5);
 // Test one straight petal independently of the rest of the fan.
 s.vx=400;s.vy=0;s.x=s.ox=0;s.y=s.oy=-18;step(g,s,1.5);assert.equal(s.hits.size,4);for(const e of targets.slice(0,4)){close(e.hp,100000-14);assert.ok(hasStatus(e,'poison'));}assert.equal(targets[4].hp,100000);assert.ok(s.life<=0);
 const hp=targets[0].hp;step(g,s,1);assert.equal(targets[0].hp,hp);
});

test('Wisteria Garden lands after its seed flight, then pulses exactly nine times and applies poison and slow',()=>{
 const g=run('maomao'),target=enemy(g,200,-18),outside=enemy(g,500,-18),s=cast(g,'poison',target,'wisteriagarden');assert.equal(s.sourceWeapon,'poison');assert.equal(s.state,'seed');step(g,s,.4);assert.equal(target.hp,100000);assert.equal(g.mechanic.value,0);step(g,s,.06);assert.equal(s.state,'bloom');assert.equal(s.pulses,1);close(target.hp,100000-9);assert.equal(g.mechanic.value,4);assert.ok(hasStatus(target,'poison'));assert.ok(hasStatus(target,'slow'));
 step(g,s,5);assert.equal(s.pulses,9);close(target.hp,100000-81);assert.equal(outside.hp,100000);assert.equal(g.mechanic.value,36);const hp=target.hp;step(g,s,4);assert.equal(target.hp,hp);
});

test('refreshing Wisteria Garden cancels the previous garden and a miss cannot build Precise Dose',()=>{
 const g=run('maomao'),target=enemy(g,200,-18),old=cast(g,'poison',target,'wisteriagarden');step(g,old,.6);const before=target.hp,next=cast(g,'poison',target,'wisteriagarden');assert.equal(old.life,0);assert.equal(g.shots.filter(s=>s.type==='wisteriagarden'&&s.life>0).length,1);step(g,old,1);assert.equal(target.hp,before);
 target.x=800;const value=g.mechanic.value;step(g,next,5);assert.equal(g.mechanic.value,value);assert.equal(next.pulses,9);
});

test('Maomao keeps Poison Vial signature mastery and spends Precise Dose once on an empowered fused garden',()=>{
 const g=run('maomao'),target=enemy(g,200,-18);g.p.weapons={poison:5};g.p.fusions.poison='wisteriagarden';g.p.meta.signatureDamage=.2;g.p.meta.signatureArea=.3;g.p.meta.poisonDuration=.5;g.mechanic.value=0;assert.equal(castWeapon(g,'poison',target),true);const normal=g.shots.at(-1);close(normal.damage,9*2.4*2*1.2);close(normal.r,142*1.3);close(normal.poisonDuration,4.5);
 g.mechanic.value=100;g.p.hp=30;assert.equal(castWeapon(g,'poison',target),true);const empowered=g.shots.at(-1);assert.equal(normal.life,0);close(empowered.damage,normal.damage*1.3);close(empowered.r,normal.r*1.4);assert.equal(g.mechanic.value,0);assert.equal(g.p.hp,36);step(g,empowered,.6);assert.equal(g.mechanic.value,4);assert.ok(target.hp<100000);
});

test('the engine keeps failed Rasengan attempts ready and uses each paired weapon’s own base and fused cadence',()=>{
 const g=run(),far=enemy(g,600);g.p.weapons={rasengan:5};g.p.cooldowns.rasengan=0;updateRun(g,.02);assert.equal(g.effects.some(e=>e.type==='paired-rasengan'),false);assert.ok(g.p.cooldowns.rasengan<=0);
 const cases=[['rasengan',null,1.25],['rasengan','raijinrasengan',1.9],['dragonflame',null,1.75],['dragonflame','dragonroar',2.8],['wisteriapetals',null,1.2],['poison','wisteriagarden',2.8]];
 for(const [id,fusion,base]of cases){const h=run(),e=enemy(h,90,-18);h.p.weapons={[id]:5};h.p.cooldowns={[id]:0};if(fusion)h.p.fusions[id]=fusion;h.p.cooldown=.8;close(pairedWeaponCooldown(h,id),base);updateRun(h,.02);close(h.p.cooldowns[id],base*.72*.8);assert.ok(h.shots.length||h.effects.some(f=>f.type==='paired-rasengan'));assert.ok(e.hp>0);}
});

test('in-flight pairs retain hit sets, garden flight and pulse timers across a paused checkpoint without replaying damage',()=>{
 for(const [id,fusion,targetX]of [['rasengan','raijinrasengan',100],['dragonflame','dragonroar',300],['poison','wisteriagarden',200]]){
  const g=run('maomao'),e=enemy(g,targetX,-18);g.p.weapons={[id]:5};g.p.fusions[id]=fusion;g.p.cooldowns[id]=999;castWeapon(g,id,e);const s=g.shots.at(-1);step(g,s,id==='poison'?.25:.2);g.status='paused';const before=structuredClone(s),hp=e.hp;updateRun(g,2);assert.deepEqual(s,before);assert.equal(e.hp,hp);
  const storage=store();assert.ok(saveRun(g,storage));const loaded=loadRun(storage);assert.ok(loaded);assert.deepEqual(loaded.shots,g.shots);assert.equal(loaded.status,'paused');if(s.hits)assert.ok(loaded.shots[0].hits instanceof Set);const oldHP=loaded.enemies[0].hp;updateRun(loaded,3);assert.equal(loaded.enemies[0].hp,oldHP);assert.deepEqual(loaded.shots,g.shots);
  loaded.status='playing';loaded.p.cooldowns[id]=999;updateRun(loaded,.02);assert.ok(loaded.shots[0].age>s.age);assert.ok(Number.isFinite(loaded.shots[0].life));
 }
});
