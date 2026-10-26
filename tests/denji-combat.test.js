import test from 'node:test';
import assert from 'node:assert/strict';
import {CHARACTERS,ITEMS,applyChoice} from '../src/game.js';
import {createRun,createHardcoreRun,castWeapon,spawnEnemy,updateRun,useSpecial,resolveRift} from '../src/engine.js';
import {heroDamageBonus,heroMoveBonus,heroResistance} from '../src/hero-mechanics.js';
import {hasStatus,clearStatuses} from '../src/status.js';
import {ensureWorld} from '../src/world.js';
import {saveRun,loadRun} from '../src/run-save.js';
import {updateRifts} from '../src/rift-encounters.js';
import {finishBossIntro} from '../src/boss-intro.js';
import {gainRev} from '../src/denji.js';
const hero=CHARACTERS.find(c=>c.id==='denji');
const close=(a,b)=>assert.ok(Math.abs(a-b)<1e-8,`${a} ≈ ${b}`);
function quiet(g){g.events.nextAt=g.rifts.nextAt=g.spawn=g.eliteAt=g.nextBossWave=g.p.nextXp=1e9;g.p.regen=g.p.dodge=0;g.invuln=999;ensureWorld(g);for(const o of g.world.objects.values())o.hp=0;g.world.active=[];g.world.circles=[];for(const id of Object.keys(g.p.weapons))g.p.cooldowns[id]=999;return g;}
const run=()=>quiet(createRun(hero,3));
function enemy(g,x=80,y=0,boss=false){const e=spawnEnemy(g,boss,false,boss?'frieza':'soldier');Object.assign(e,{x,y,hp:10000,maxHp:10000,speed:0,attackCD:999,ultimateCD:999});return e;}
function prop(g,x=70,y=0){const o={id:'test:crate',kind:'prop',type:'crate',x,y,r:17,hp:25,maxHp:25,mass:1,vx:0,vy:0,hit:0};g.world.active.push(o);g.world.objects.set(o.id,o);return o;}
function sim(g,seconds,hold=null){for(let t=0;t<seconds-1e-8;t+=.02){if(hold)Object.assign(hold,{x:80,y:0,kvx:0,kvy:0});updateRun(g,Math.min(.02,seconds-t));}}
const store=()=>({data:new Map(),getItem(k){return this.data.get(k)},setItem(k,v){this.data.set(k,v)},removeItem(k){this.data.delete(k)}});

test('Denji starts with chainsaw and Blood Engine, and connected sweeps cut forward enemies without creating ranged shots',()=>{
 const g=run(),front=enemy(g),side=enemy(g,30,70),rear=enemy(g,-80),far=enemy(g,350),box=prop(g,65,-25);assert.equal(g.p.maxHp,130);close(g.p.damage,1.04);assert.equal(castWeapon(g,'chainsaw',front),true);
 for(const e of [front,side]){assert.ok(e.hp<10000);assert.ok(hasStatus(e,'bleeding'));assert.ok(Math.hypot(e.kvx,e.kvy)>0);}assert.equal(rear.hp,10000);assert.equal(far.hp,10000);assert.ok(box.hp<=0);assert.equal(g.shots.length,0);close(g.mechanic.value,17.6);assert.equal(g.effects.filter(e=>e.type==='denji-slash').length,1);
});

test('a ready Rev sweep is not wasted on distant, defeated, phantom or supply targets',()=>{
 const g=run(),far=enemy(g,500);g.mechanic.value=100;assert.equal(castWeapon(g,'chainsaw',far),false);assert.equal(g.mechanic.value,100);assert.equal(g.effects.length,0);far.hp=0;castWeapon(g,'chainsaw',far);assert.equal(g.mechanic.value,100);
 castWeapon(g,'chainsaw',{id:99999,kind:'enemy',hp:100,x:80,y:0,r:14});assert.equal(g.mechanic.value,100);assert.ok(!g.effects.some(e=>e.empowered));const box=prop(g);castWeapon(g,'chainsaw',box);assert.ok(box.hp<=0);assert.equal(g.mechanic.value,100);assert.ok(!g.effects.some(e=>e.empowered));
 const edge=enemy(g,130);assert.equal(castWeapon(g,'chainsaw',edge),true);assert.ok(edge.hp<10000);close(g.mechanic.value,17.6);assert.equal(g.effects.at(-1).empowered,true);
});

test('full Rev empowers exactly one connected sweep and Blood Engine ranks and mastery change only its gain',()=>{
 const g=run(),e=enemy(g);g.mechanic.value=100;const before=e.hp;castWeapon(g,'chainsaw',e);const empowered=before-e.hp;const next=e.hp;castWeapon(g,'chainsaw',e);close(empowered,(next-e.hp)*1.6);close(g.mechanic.value,35.2);const [a,b]=g.effects.filter(e=>e.type==='denji-slash');close(a.r,b.r*1.2);assert.equal(a.empowered,true);assert.equal(b.empowered,false);
 g.mechanic.value=0;g.p.passives.bloodengine=3;g.p.meta.revGain=.2;gainRev(g,10);close(g.mechanic.value,15);gainRev(g,-50);close(g.mechanic.value,15);gainRev(g,10000);assert.equal(g.mechanic.value,100);
});

test('ordinary, elite and boss kills grant their Rev once through actual loot processing',()=>{
 const g=run(),a=enemy(g,400),b=enemy(g,450),c=enemy(g,500,0,true);b.elite=true;a.hp=b.hp=c.hp=0;updateRun(g,.02);close(g.mechanic.value,(6+12)*1.1);sim(g,1.6);close(g.mechanic.value,(6+12+24)*1.1);sim(g,.2);close(g.mechanic.value,46.2);assert.equal(g.kills,3);
});

test('Chainsaw Man transforms and heals only on actual enemy damage, with a hard per-activation cap',()=>{
 const g=run(),e=enemy(g,80,0,true);g.p.hp=30;assert.equal(useSpecial(g),true);assert.equal(g.p.hp,30);assert.equal(g.p.form,1);assert.equal(g.p.pose,'chainsaw');assert.equal(heroDamageBonus(g),1.3);assert.equal(heroMoveBonus(g),1.12);assert.equal(heroResistance(g),.8);updateRun(g,.02);assert.equal(g.p.hp,32);assert.equal(g.ultimate.healed,2);assert.equal(g.ultimate.pulses,1);assert.ok(hasStatus(e,'bleeding'));
 sim(g,7.8,e);assert.equal(g.ultimate.healed,24);assert.equal(g.p.hp,54);assert.ok(e.hp>0,'bosses retain a real health pool and cannot be executed');sim(g,.3,e);assert.equal(g.ultimate,null);assert.equal(g.p.form,0);assert.equal(g.p.pose,'');assert.equal(g.p.hp,54);assert.equal(heroDamageBonus(g),1);assert.equal(heroMoveBonus(g),1);assert.equal(heroResistance(g),1);
});

test('ultimate misses and scenery damage cannot heal Denji, and the final crosscut cannot replay',()=>{
 const g=run();prop(g);g.p.hp=40;useSpecial(g);sim(g,1.1);assert.equal(g.p.hp,40);assert.equal(g.ultimate.healed,0);const a=enemy(g,170),b=enemy(g,-170);g.ultimate.age=g.ultimate.duration-.14;g.ultimate.tick=99;updateRun(g,.02);assert.ok(a.hp<10000);assert.ok(b.hp<10000);assert.equal(g.ultimate.impacted,true);assert.equal(g.effects.filter(e=>e.type==='denji-slash'&&e.full).length,1);const hp=[a.hp,b.hp];clearStatuses(a);clearStatuses(b);updateRun(g,.02);assert.deepEqual([a.hp,b.hp],hp);assert.equal(g.effects.filter(e=>e.type==='denji-slash'&&e.full).length,1);assert.equal(g.p.hp,40);
});

test('shared chainsaws have no Denji meter while Hardcore can max and evolve the signature loadout',()=>{
 const other=quiet(createRun(CHARACTERS[0],3)),target=enemy(other);other.p.weapons.chainsaw=1;other.mechanic.value=100;castWeapon(other,'chainsaw',target);assert.ok(target.hp<10000);assert.equal(other.mechanic.value,100);assert.ok(!other.effects.some(e=>e.type==='denji-slash'&&e.empowered));
 const g=quiet(createHardcoreRun(hero,3));while(g.p.weapons.chainsaw<ITEMS.chainsaw.max)assert.ok(applyChoice(g.p,{kind:'item',id:'chainsaw'}));while(g.p.passives.bloodengine<ITEMS.bloodengine.max)assert.ok(applyChoice(g.p,{kind:'item',id:'bloodengine'}));assert.ok(applyChoice(g.p,{kind:'fusion',id:'chainsawoverdrive'}));const e=enemy(g,170);g.p.cooldowns.chainsaw=0;updateRun(g,.02);assert.ok(e.hp<10000);assert.ok(g.p.cooldowns.chainsaw>.5&&g.p.cooldowns.chainsaw<.7);assert.ok(g.effects.some(e=>e.type==='denji-slash'&&e.fused));assert.deepEqual(Object.keys(g.p.weapons),['chainsaw']);assert.deepEqual(Object.keys(g.p.passives),['bloodengine']);assert.equal(g.p.maxHp,150);
});

test('the transformed body, Rev meter, remaining healing budget and exact ultimate age checkpoint together',()=>{
 const g=run(),e=enemy(g);g.p.hp=30;useSpecial(g);sim(g,.6,e);g.mechanic.value=73;g.status='paused';const before=structuredClone(g.ultimate),hp=g.p.hp;updateRun(g,2);assert.deepEqual(g.ultimate,before);assert.equal(g.p.hp,hp);const storage=store();assert.ok(saveRun(g,storage));const loaded=loadRun(storage);assert.ok(loaded);assert.equal(loaded.p.form,1);assert.equal(loaded.p.pose,'chainsaw');assert.equal(loaded.mechanic.value,73);assert.deepEqual(loaded.ultimate,before);assert.equal(loaded.p.hp,hp);loaded.status='playing';sim(loaded,8);assert.equal(loaded.ultimate,null);assert.equal(loaded.p.form,0);assert.equal(loaded.p.pose,'');
});

test('rifts suspend and restore the transformed body, heal budget and Rev without duplicating an ultimate',()=>{
 const g=run(),e=enemy(g);g.p.hp=30;useSpecial(g);sim(g,.6,e);g.enemies=[];const before=structuredClone(g.ultimate);g.time=180;g.rifts.nextAt=180;assert.ok(updateRifts(g,.01,{},()=>0));g.p.x=g.rifts.portal.x;g.p.y=g.rifts.portal.y;updateRifts(g,.01);assert.equal(g.status,'rift');assert.ok(resolveRift(g,true));finishBossIntro(g);assert.equal(g.p.form,0);assert.equal(g.ultimate,null);assert.deepEqual(g.rifts.active.suspended.ultimate,before);const storage=store();saveRun(g,storage);const loaded=loadRun(storage);assert.ok(loaded);assert.equal(loaded.p.form,0);assert.deepEqual(loaded.rifts.active.suspended.ultimate,before);loaded.status='playing';loaded.chestRandom=()=>.99;loaded.enemies.find(e=>e.riftBoss).hp=0;for(let i=0;i<110&&loaded.rifts.active;i++)updateRun(loaded,.02);assert.equal(loaded.rifts.active,null);assert.equal(loaded.p.form,1);assert.equal(loaded.p.pose,'chainsaw');assert.deepEqual(loaded.ultimate,before);
});
