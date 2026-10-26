import test from 'node:test';
import assert from 'node:assert/strict';
import {CHARACTERS,applyChoice,refreshStats} from '../src/game.js';
import {createRun,createHardcoreRun,castWeapon,spawnEnemy,updateRun,hitPlayer,useSpecial} from '../src/engine.js';
import {ERZA_FORMS,switchErzaForm,erzaSwitchCooldown} from '../src/erza.js';
import {heroMoveBonus,heroResistance} from '../src/hero-mechanics.js';
import {newProfile} from '../src/progression.js';
import {applyStatus,clearStatuses,hasStatus} from '../src/status.js';
import {ensureWorld} from '../src/world.js';
import {saveRun,loadRun,RUN_SAVE_KEY} from '../src/run-save.js';
import {drawErzaSword,drawErzaEffect,drawErzaUltimate,drawErzaBarrier} from '../src/erza-effects.js';
const hero=id=>CHARACTERS.find(c=>c.id===id);
function quiet(g){g.spawn=g.eliteAt=g.nextBossWave=1e9;g.p.nextXp=1e9;g.p.regen=0;g.invuln=999;ensureWorld(g);for(const o of g.world.objects.values())o.hp=0;g.world.active=[];g.world.circles=[];for(const id of Object.keys(g.p.weapons))g.p.cooldowns[id]=999;return g;}
const run=(id='erza',profile)=>quiet(createRun(hero(id),3,profile));
function enemy(g,x=100,y=0){const e=spawnEnemy(g,false,false,'zoomer');Object.assign(e,{x,y,hp:10000,maxHp:10000,speed:0,attackCD:999});return e;}
function simulate(g,seconds){for(let i=0;i<Math.round(seconds/.02);i++)updateRun(g,.02);}
function memory(){const values=new Map();return{getItem:key=>values.get(key)||null,setItem:(key,value)=>values.set(key,value),removeItem:key=>values.delete(key)};}

test('Requip cycles the base stance and three distinct armor forms with an active cooldown and never heals or resets weapon progression',()=>{
 const g=run();g.p.hp=60;g.p.weapons.requip=4;g.p.fusions.requip='heavensarsenal';g.p.shield=3;
 assert.equal(g.mechanic.form,3);assert.equal(g.p.erzaForm,3);assert.equal(switchErzaForm(g),true);assert.equal(g.mechanic.form,0);assert.equal(g.p.erzaForm,0);simulate(g,3.02);assert.equal(switchErzaForm(g),true);assert.equal(g.mechanic.form,1);assert.equal(g.p.erzaForm,1);assert.equal(g.mechanic.switchCD,3);assert.equal(switchErzaForm(g),false);
 assert.equal(heroMoveBonus(g),1.22);assert.equal(heroResistance(g),1.08);simulate(g,3.02);assert.equal(switchErzaForm(g),true);assert.equal(g.mechanic.form,2);assert.equal(heroMoveBonus(g),.82);assert.equal(heroResistance(g),.7);
 assert.equal(g.p.hp,60);assert.equal(g.p.shield,3);assert.equal(g.p.weapons.requip,4);assert.equal(g.p.fusions.requip,'heavensarsenal');assert.equal(g.p.weapon,'requip');
 simulate(g,3.02);assert.equal(switchErzaForm(g),true);assert.equal(g.mechanic.form,3);assert.equal(heroMoveBonus(g),1);assert.equal(heroResistance(g),1);assert.equal(ERZA_FORMS.length,4);assert.equal(switchErzaForm(run('goku')),false);
});

test('armor switching respects pause, boss entrances, disable statuses, ultimate and dash',()=>{
 const g=run();g.status='paused';assert.equal(switchErzaForm(g),false);g.status='playing';g.bossIntro={};assert.equal(switchErzaForm(g),false);g.bossIntro=null;
 for(const status of ['stun','frozen']){applyStatus(g.p,status,1);assert.equal(switchErzaForm(g),false);clearStatuses(g.p);}
 g.dash={};assert.equal(switchErzaForm(g),false);g.dash=null;g.ultimate={type:'erza'};assert.equal(switchErzaForm(g),false);g.ultimate=null;
 assert.equal(switchErzaForm(g,9),false);assert.equal(switchErzaForm(g,3),false);assert.equal(switchErzaForm(g,2),true);
 const before=structuredClone(g.mechanic);g.status='paused';updateRun(g,4);assert.deepEqual(g.mechanic,before);
});

test('Heaven’s Wheel sends physical piercing swords while Black Wing and Adamantine resolve different close attacks',()=>{
 const wheel=run(),front=enemy(wheel,140);switchErzaForm(wheel,0);assert.equal(castWeapon(wheel,'requip',front),true);assert.equal(wheel.shots.length,3);assert.ok(wheel.shots.every(s=>s.type==='requip-sword'&&s.sourceWeapon==='requip'));simulate(wheel,.5);assert.ok(front.hp<10000);
 const wing=run(),near=enemy(wing,100),rear=enemy(wing,-100),far=enemy(wing,500);switchErzaForm(wing,1);assert.equal(castWeapon(wing,'requip',near),true);assert.equal(wing.shots.length,0);assert.ok(near.hp<10000);assert.ok(hasStatus(near,'bleeding'));assert.equal(rear.hp,10000);assert.equal(far.hp,10000);assert.equal(castWeapon(wing,'requip',far),false);
 const tank=run(),victim=enemy(tank,90);switchErzaForm(tank,2);castWeapon(tank,'requip',victim);assert.ok(hasStatus(victim,'stun'));assert.ok(!hasStatus(victim,'bleeding'));assert.ok(victim.kvx>0);assert.ok(tank.effects.some(e=>e.type==='erza-slash'&&e.form===2));
});

test('Adamantine stores one finite barrier across swaps and only recharges in its own armor',()=>{
 const g=run();g.p.shield=0;g.p.dodge=0;g.invuln=0;switchErzaForm(g,2);assert.equal(hitPlayer(g,50),true);assert.ok(Math.abs(g.p.hp-(g.p.maxHp-5))<1e-9);assert.equal(g.mechanic.barrier,0);
 simulate(g,3.02);switchErzaForm(g,0);simulate(g,10);assert.equal(g.mechanic.barrier,0);switchErzaForm(g,2);assert.equal(g.mechanic.barrier,0);simulate(g,4.8);assert.equal(g.mechanic.barrier,0);simulate(g,3.3);assert.equal(g.mechanic.barrier,30);
});

test('mastery improves switching and sword count, while evolution remains shared by all forms and borrowed swords stay Wheel',()=>{
 const p=newProfile();p.characters.erza.skills={requip:2,arsenal:1};const g=run('erza',p);assert.ok(Math.abs(erzaSwitchCooldown(g.p)-2.4)<1e-9);switchErzaForm(g,1);assert.ok(Math.abs(g.mechanic.switchCD-2.4)<1e-9);g.mechanic.switchCD=0;switchErzaForm(g,0);g.p.weapons.requip=5;g.p.passives.heartkreuz=3;assert.equal(applyChoice(g.p,{kind:'fusion',id:'heavensarsenal'}),true);refreshStats(g.p);assert.equal(g.p.maxShield,21);castWeapon(g,'requip',enemy(g,150));assert.equal(g.shots.length,8);
 for(const form of [1,2,3,0]){g.mechanic.switchCD=0;switchErzaForm(g,form);assert.equal(g.p.weapons.requip,5);assert.equal(g.p.fusions.requip,'heavensarsenal');}
 const other=run('goku');other.p.weapons.requip=1;other.p.erzaForm=2;castWeapon(other,'requip',enemy(other,150));assert.equal(other.shots.length,3);assert.equal(switchErzaForm(other),false);
});

test('Nakagami charges before seven fixed cuts, clears shots inside impacts and cannot repeat resolved cuts',()=>{
 const g=run(),victim=enemy(g,140);g.enemyShots=[{x:140,y:0,vx:0,vy:0,r:3,life:99,age:0,damage:1,kind:'ki',color:'#fff'},{x:600,y:400,vx:0,vy:0,r:3,life:99,age:0,damage:1,kind:'ki',color:'#fff'}];
 assert.equal(useSpecial(g),true);assert.equal(g.ultimate.type,'erza');assert.equal(g.ultimate.strikes.length,7);const marks=g.ultimate.strikes.map(s=>({x:s.x,y:s.y}));simulate(g,.88);assert.equal(victim.hp,10000);assert.equal(g.enemyShots.length,2);assert.equal(g.ultimate.cuts,0);
 simulate(g,.04);assert.equal(g.ultimate.cuts,1);assert.ok(victim.hp<10000);assert.equal(g.enemyShots.length,1);assert.deepEqual(g.ultimate.strikes.map(s=>({x:s.x,y:s.y})),marks);
 const active=g.ultimate;simulate(g,1.4);assert.equal(active.cuts,7);const hp=victim.hp;simulate(g,.3);assert.equal(victim.hp,hp);simulate(g,.3);assert.equal(g.ultimate,null);assert.equal(g.p.pose,'');assert.ok(g.special>0);
});

test('Erza form, cooldown, spent barrier, sword hits and partially resolved ultimate survive real checkpoints including Hardcore',()=>{
 const g=quiet(createHardcoreRun(hero('erza'),3));switchErzaForm(g,2);g.mechanic.barrier=7;g.mechanic.barrierAge=2;const e=enemy(g,150);g.mechanic.switchCD=0;switchErzaForm(g,0);castWeapon(g,'requip',e);assert.equal(useSpecial(g),true);simulate(g,1.14);const memoryStore=memory();assert.equal(saveRun(g,memoryStore),true);const restored=loadRun(memoryStore);
 assert.equal(restored.mode,'hardcore');assert.equal(restored.p.erzaForm,0);assert.equal(restored.mechanic.form,0);assert.equal(restored.mechanic.barrier,7);assert.ok(restored.mechanic.switchCD>0);assert.ok(restored.shots.every(s=>s.type==='requip-sword'&&s.hits instanceof Set));assert.equal(restored.ultimate.cuts,g.ultimate.cuts);assert.deepEqual(restored.ultimate.strikes,g.ultimate.strikes);
 const before=JSON.stringify(restored.ultimate);updateRun(restored,3);assert.equal(JSON.stringify(restored.ultimate),before);restored.status='playing';simulate(restored,2);assert.equal(restored.ultimate,null);assert.equal(JSON.parse(memoryStore.getItem(RUN_SAVE_KEY)).version,1);
});

test('Erza swords, all armor effects and charge markers render finite snapshots in reduced motion',()=>{
 const calls=[],c=new Proxy({globalAlpha:1},{get(target,key){return key in target?target[key]:(...args)=>{for(const n of args)if(typeof n==='number')assert.ok(Number.isFinite(n),String(key));calls.push(key);};},set(target,key,value){target[key]=value;return true;}});
 const g=run();switchErzaForm(g,2);useSpecial(g);const before=structuredClone(g.ultimate);
 for(const reduced of [false,true]){g.p.reducedMotion=reduced;drawErzaSword(c,{x:1,y:2,vx:490,vy:0,age:.4,delay:0,color:'#eed4aa'},{zoom:.5,reducedMotion:reduced});drawErzaUltimate(c,g);drawErzaBarrier(c,g);for(const type of ['erza-requip','erza-wheel','erza-slash','erza-sever'])for(const form of [1,2,3])for(const t of [0,.5,1])assert.equal(drawErzaEffect(c,{type,x:5,y:8,r:70,angle:.8,color:'#ecd4aa',form,blades:4},t,reduced),true);}
 assert.deepEqual(g.ultimate,before);assert.ok(calls.includes('arc'));assert.ok(calls.includes('fill'));assert.ok(calls.includes('rotate'));
});
