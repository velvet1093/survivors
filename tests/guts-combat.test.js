import test from 'node:test';
import assert from 'node:assert/strict';
import {CHARACTERS,ITEMS,applyChoice} from '../src/game.js';
import {createRun,createHardcoreRun,castWeapon,spawnEnemy,updateRun,hitPlayer,useSpecial,resolveRift} from '../src/engine.js';
import {heroDamageBonus,heroMoveBonus,heroResistance} from '../src/hero-mechanics.js';
import {hasStatus,clearStatuses} from '../src/status.js';
import {ensureWorld} from '../src/world.js';
import {saveRun,loadRun} from '../src/run-save.js';
import {updateRifts} from '../src/rift-encounters.js';
import {finishBossIntro} from '../src/boss-intro.js';

const hero=CHARACTERS.find(c=>c.id==='guts');
const close=(a,b,message)=>assert.ok(Math.abs(a-b)<1e-8,message||`${a} ≈ ${b}`);
function quiet(g){
 g.events.nextAt=1e9; g.spawn=g.eliteAt=g.nextBossWave=g.p.nextXp=1e9;g.p.regen=g.p.dodge=0;g.invuln=999;ensureWorld(g);
 for(const o of g.world.objects.values())o.hp=0;g.world.active=[];g.world.circles=[];
 for(const id of Object.keys(g.p.weapons))g.p.cooldowns[id]=999;
 return g;
}
const run=()=>quiet(createRun(hero,3));
function enemy(g,x=100,y=0,{boss=false,elite=false}={}){
 const e=spawnEnemy(g,boss,elite,boss?'frieza':'zoomer');Object.assign(e,{x,y,hp:10000,maxHp:10000,speed:0,attackCD:999,ultimateCD:999});return e;
}
function prop(g,x=75,y=0,hp=50){const o={id:'test:crate',kind:'prop',type:'crate',x,y,r:17,hp,maxHp:hp,mass:1,vx:0,vy:0,hit:0};g.world.active.push(o);g.world.objects.set(o.id,o);return o;}
function simulate(g,seconds){for(let t=0;t<seconds-1e-8;t+=.02)updateRun(g,Math.min(.02,seconds-t));}
const storage=()=>({data:new Map(),getItem(k){return this.data.get(k);},setItem(k,v){this.data.set(k,v);},removeItem(k){this.data.delete(k);}});

test('an out-of-range target or supply cannot spend a ready Struggle swing',()=>{
 const g=run(),far=enemy(g,500);g.mechanic.value=100;const before=JSON.stringify({effects:g.effects,aim:g.p.aimAngle,attack:g.p.attackTimer});
 assert.equal(castWeapon(g,'dragonslayer',far),false);assert.equal(g.mechanic.value,100);assert.equal(far.hp,10000);assert.equal(JSON.stringify({effects:g.effects,aim:g.p.aimAngle,attack:g.p.attackTimer}),before);
 const box=prop(g);assert.equal(castWeapon(g,'dragonslayer',box),true);assert.ok(box.hp<=0);assert.equal(g.broken,1);assert.equal(g.mechanic.value,100);assert.equal(g.effects.filter(e=>e.type==='guts-slash').at(-1).empowered,false);
 const edge=enemy(g,170);assert.equal(castWeapon(g,'dragonslayer',edge),true);assert.ok(edge.hp<10000,'the ready swing uses its extended reach before spending the meter');assert.equal(g.mechanic.value,18);
});

test('a stale defeated or phantom target does not consume a full meter on a missed cleave',()=>{
 const g=run(),dead=enemy(g);dead.hp=0;g.mechanic.value=100;castWeapon(g,'dragonslayer',dead);assert.equal(g.mechanic.value,100);assert.ok(!g.effects.some(e=>e.type==='guts-slash'&&e.empowered));
 castWeapon(g,'dragonslayer',{kind:'enemy',id:99999,hp:100,maxHp:100,x:100,y:0,r:14});assert.equal(g.mechanic.value,100);assert.ok(!g.effects.some(e=>e.type==='guts-slash'&&e.empowered));
});

test('Dragonslayer cuts a broad forward group and nearby supplies, while rear and distant enemies stay safe',()=>{
 const g=run(),front=enemy(g,100),side=enemy(g,35,105),rear=enemy(g,-100),far=enemy(g,400),box=prop(g,80,-30);
 assert.equal(castWeapon(g,'dragonslayer',front),true);assert.ok(front.hp<10000);assert.ok(side.hp<10000);assert.equal(rear.hp,10000);assert.equal(far.hp,10000);
 for(const e of [front,side]){assert.ok(hasStatus(e,'bleeding'));assert.ok(Math.hypot(e.kvx,e.kvy)>0);}
 assert.ok(box.hp<=0);assert.equal(g.broken,1);assert.equal(g.mechanic.value,18,'a cleave grants Struggle once even when it hits several enemies');assert.equal(g.shots.length,0);
});

test('successful hits, ordinary/elite/boss defeats and actual damage build Struggle through the engine',()=>{
 const g=run(),regular=enemy(g,400),elite=enemy(g,450,0,{elite:true}),boss=enemy(g,500,0,{boss:true});
 regular.hp=elite.hp=boss.hp=0;updateRun(g,.02);assert.equal(g.mechanic.value,18,'ordinary and elite deaths grant6+12 before the boss death completes');simulate(g,1.6);assert.equal(g.mechanic.value,42,'a boss grants24 after its once-only death reward');assert.equal(g.kills,3);
 simulate(g,.2);assert.equal(g.mechanic.value,42,'cleared enemies cannot pay Struggle again');
 g.mechanic.value=0;g.invuln=0;const hp=g.p.hp;assert.equal(hitPlayer(g,10),true);const lost=hp-g.p.hp;close(g.mechanic.value,lost*.6);
 const value=g.mechanic.value;assert.equal(hitPlayer(g,10),false);assert.equal(g.mechanic.value,value,'invulnerability prevents both damage and charge gain');
 g.invuln=0;assert.equal(hitPlayer(g,40),true);close(g.mechanic.value,value+20,'one large hit cannot exceed the20gain cap');
});

test('a ready cleave spends its empowerment once and immediately starts earning the next meter',()=>{
 const g=run(),target=enemy(g);g.mechanic.value=100;const start=target.hp;castWeapon(g,'dragonslayer',target);const first=start-target.hp;assert.equal(g.mechanic.value,18);
 const before=target.hp;castWeapon(g,'dragonslayer',target);const second=before-target.hp;close(first,second*1.7);assert.equal(g.mechanic.value,36);
 const swings=g.effects.filter(e=>e.type==='guts-slash');assert.equal(swings.length,2);assert.equal(swings[0].empowered,true);assert.equal(swings[1].empowered,false);close(swings[0].r,swings[1].r*1.2);
});

test('Berserker Armor keeps HP, improves real damage/movement/resistance, pulses attacks and restores the base form',()=>{
 const g=run(),target=enemy(g);g.p.hp=90;assert.equal(useSpecial(g),true);assert.equal(g.p.hp,90);assert.equal(g.p.form,1);assert.equal(g.p.pose,'berserk');assert.equal(heroDamageBonus(g),1.35);assert.equal(heroMoveBonus(g),1.15);assert.equal(heroResistance(g),.75);
 const start=target.hp;updateRun(g,.02);close(start-target.hp,32*g.p.damage*1.35);assert.equal(g.ultimate.pulses,1);assert.ok(hasStatus(target,'bleeding'));
 g.invuln=0;const hp=g.p.hp;assert.equal(hitPlayer(g,20),true);close(hp-g.p.hp,20*.75*(1-g.p.damageReduction));g.invuln=999;
 const x=g.p.x;updateRun(g,.1,{x:1,y:0});close(g.p.x-x,g.p.move*1.15*.1);
 simulate(g,.8);assert.ok(g.ultimate.pulses>=2);simulate(g,7.2);assert.equal(g.ultimate,null);assert.equal(g.p.form,0);assert.equal(g.p.pose,'');assert.equal(heroDamageBonus(g),1);assert.equal(heroMoveBonus(g),1);assert.equal(heroResistance(g),1);assert.ok(g.special>0);assert.equal(g.p.weapons.dragonslayer,1);
});

test('the finishing armor sweep hits every direction once and cannot replay while the armor expires',()=>{
 const g=run(),front=enemy(g,170),rear=enemy(g,-170);useSpecial(g);g.ultimate.age=g.ultimate.duration-.16;g.ultimate.tick=99;
 updateRun(g,.02);assert.ok(g.ultimate.impacted);assert.ok(front.hp<10000);assert.ok(rear.hp<10000);assert.equal(g.effects.filter(e=>e.type==='guts-slash'&&e.full).length,1);
 const hp=[front.hp,rear.hp];clearStatuses(front);clearStatuses(rear);updateRun(g,.02);assert.deepEqual([front.hp,rear.hp],hp);assert.equal(g.effects.filter(e=>e.type==='guts-slash'&&e.full).length,1);
 simulate(g,.2);assert.equal(g.ultimate,null);assert.equal(g.p.form,0);
});

test('paused armor and Struggle checkpoint exactly, then resume until the saved armor ends',()=>{
 const g=run();g.p.skin='goldenage';const target=enemy(g,120);useSpecial(g);simulate(g,.6);g.mechanic.value=73;g.status='paused';const before=structuredClone(g.ultimate),hp=target.hp,cooldown=g.special;
 updateRun(g,3);assert.deepEqual(g.ultimate,before);assert.equal(target.hp,hp);assert.equal(g.special,cooldown);
 const store=storage();assert.ok(saveRun(g,store));const restored=loadRun(store);assert.ok(restored);assert.equal(restored.status,'paused');assert.equal(restored.p.form,1);assert.equal(restored.p.pose,'berserk');assert.equal(restored.p.skin,'goldenage');assert.equal(restored.mechanic.value,73);assert.deepEqual(restored.ultimate,before);
 updateRun(restored,2);assert.deepEqual(restored.ultimate,before);restored.status='playing';simulate(restored,7.5);assert.equal(restored.ultimate,null);assert.equal(restored.p.form,0);assert.equal(restored.p.skin,'goldenage');assert.ok(restored.enemies[0].hp<hp);
});

test('Hardcore maxed Astral Edge really reaches beyond the base sword and keeps automatic cadence valid',()=>{
 const g=quiet(createHardcoreRun(hero,3));while(g.p.weapons.dragonslayer<ITEMS.dragonslayer.max)assert.ok(applyChoice(g.p,{kind:'item',id:'dragonslayer'}));while(g.p.passives.brand<ITEMS.brand.max)assert.ok(applyChoice(g.p,{kind:'item',id:'brand'}));assert.ok(applyChoice(g.p,{kind:'fusion',id:'berserkeredge'}));
 const target=enemy(g,200);g.p.cooldowns.dragonslayer=0;updateRun(g,.02);assert.ok(target.hp<10000);assert.ok(hasStatus(target,'bleeding'));assert.ok(g.p.cooldowns.dragonslayer>.8&&g.p.cooldowns.dragonslayer<1.2);assert.ok(g.effects.some(e=>e.type==='guts-slash'&&e.fused));assert.deepEqual(Object.keys(g.p.weapons),['dragonslayer']);assert.deepEqual(Object.keys(g.p.passives),['brand']);
});

test('a rift suspends the armor and its bonuses, checkpoints unarmored, then restores the same armor on return',()=>{
 const g=run();useSpecial(g);simulate(g,.6);const armor=structuredClone(g.ultimate);assert.equal(g.p.form,1);assert.equal(heroDamageBonus(g),1.35);
 g.time=180;assert.ok(updateRifts(g,.01,{},()=>0));g.p.x=g.rifts.portal.x;g.p.y=g.rifts.portal.y;updateRifts(g,.01);assert.equal(g.status,'rift');
 assert.ok(resolveRift(g,true));finishBossIntro(g);assert.equal(g.p.form,0);assert.equal(g.p.pose,'');assert.equal(g.ultimate,null);assert.deepEqual(g.rifts.active.suspended.ultimate,armor);assert.equal(heroDamageBonus(g),1);assert.equal(heroMoveBonus(g),1);assert.equal(heroResistance(g),1);
 simulate(g,.2);assert.deepEqual(g.rifts.active.suspended.ultimate,armor,'the old armor does not age in the separate arena');
 const store=storage();assert.ok(saveRun(g,store));const restored=loadRun(store);assert.ok(restored.rifts.active);assert.equal(restored.p.form,0);assert.equal(restored.ultimate,null);assert.deepEqual(restored.rifts.active.suspended.ultimate,armor);assert.equal(heroDamageBonus(restored),1);
 restored.status='playing';restored.chestRandom=()=>.99;const boss=restored.enemies.find(e=>e.riftBoss);boss.hp=0;
 for(let i=0;i<100&&restored.rifts.active;i++)updateRun(restored,.02);
 assert.equal(restored.rifts.active,null);assert.equal(restored.riftArena,null);assert.equal(restored.rifts.cleared,1);assert.equal(restored.p.form,1);assert.equal(restored.p.pose,'berserk');close(restored.ultimate.age,armor.age);assert.equal(restored.ultimate.pulses,armor.pulses);assert.equal(heroDamageBonus(restored),1.35);assert.equal(heroMoveBonus(restored),1.15);assert.equal(heroResistance(restored),.75);
 assert.equal(restored.status,'chest');assert.equal(restored.rewards.length,5);
 // The reward screen pauses the returned world. Resume without training its
 // offered gear so this test can observe the saved armor's original bonuses.
 restored.rewards=[];restored.chests=[];restored.gems=[];restored.status='playing';simulate(restored,armor.duration-armor.age+.1);
 assert.equal(restored.ultimate,null);assert.equal(restored.p.form,0);assert.equal(restored.p.pose,'');assert.equal(heroDamageBonus(restored),1);assert.equal(heroMoveBonus(restored),1);assert.equal(heroResistance(restored),1);assert.equal(restored.rifts.cleared,1);
});
