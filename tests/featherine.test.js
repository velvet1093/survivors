import test from 'node:test';import assert from 'node:assert/strict';
import {CHARACTERS,ITEMS,FUSIONS,createPlayer,getUpgradePool,applyChoice,refreshStats} from '../src/game.js';
import {createRun,damageEnemy,spawnEnemy,updateRun,useSpecial} from '../src/engine.js';
import {heroAuthorityHit,heroKill,mechanicLabel,updateHeroMechanic} from '../src/hero-mechanics.js';
import {castQuill,updateQuillShot,FEATHERINE_ULTIMATE,startFeatherineUltimate,updateFeatherineUltimate} from '../src/featherine.js';
import {hasStatus,applyStatus} from '../src/status.js';import {ensureWorld} from '../src/world.js';
import {saveRun,loadRun} from '../src/run-save.js';

const hero=()=>CHARACTERS.find(c=>c.id==='featherine');
function run(){const g=createRun(hero());ensureWorld(g);for(const o of g.world.objects.values())o.hp=0;g.world.active=[];g.world.circles=[];g.spawn=g.eliteAt=g.nextBossWave=1e6;return g;}
const enemy=(id,x,y=-25,boss=false)=>({id,x,y,hp:1000,maxHp:1000,r:10,boss,archetype:boss?'frieza':'soldier',lastDamagedAt:0,statuses:{}});
function flight(g,s,seconds){for(let i=0;i<Math.ceil(seconds/.01)&&s.life>0;i++)updateQuillShot(g,s,.01,{damage:damageEnemy});}
const store=()=>({value:null,getItem(){return this.value},setItem(k,v){this.value=v},removeItem(){this.value=null}});
function engineFixture(){const g=run();g.invuln=999;g.p.nextXp=1e9;const e=spawnEnemy(g,false,false,'zoomer');Object.assign(e,{x:140,y:-25,hp:10000,maxHp:10000,speed:0,attackCD:999});return {g,e};}

test('Featherine has a shared quill/passive recipe and Memory Fragment affects working damage and area stats',()=>{
 const p=createPlayer(hero());assert.deepEqual(p.weapons,{quill:1});assert.deepEqual(p.passives,{memoryfragment:1});assert.equal(p.damage,1.05);assert.equal(p.area,1.05);assert.equal(hero().hp,100);assert.equal(hero().move,220);
 const other=createPlayer(CHARACTERS[0]);for(const id of ['quill','memoryfragment'])assert.ok(getUpgradePool(other).some(c=>c.id===id));assert.equal(ITEMS.quill.max,5);assert.equal(ITEMS.memoryfragment.max,3);
 assert.equal(applyChoice(p,{kind:'fusion',id:'finalchapter'}),false);p.weapons.quill=5;p.passives.memoryfragment=3;refreshStats(p);assert.ok(applyChoice(p,{kind:'fusion',id:'finalchapter'}));assert.equal(p.fusions.quill,FUSIONS.find(f=>f.id==='finalchapter').id);assert.equal(p.damage,1.15);assert.equal(p.area,1.15);
});
test('quill ranks add visible projectiles and piercing, while full Authority empowers exactly the next volley',()=>{
 const g=run(),target=enemy(1,200);g.enemies=[target];assert.equal(castQuill(g,target,1),2);assert.equal(g.shots[0].pierce,1);g.shots=[];g.p.weapons.quill=5;g.p.fusions.quill='finalchapter';assert.equal(castQuill(g,target,1),5);assert.equal(g.shots[0].pierce,5);
 g.shots=[];heroAuthorityHit(g,100);assert.equal(g.mechanic.value,100);assert.match(mechanicLabel(g),/REVISION READY/);assert.equal(castQuill(g,target,1),6);assert.ok(g.shots.every(s=>s.revision&&s.damage===32&&s.pierce===7));assert.equal(g.mechanic.value,0);assert.equal(g.mechanic.serial,1);assert.match(mechanicLabel(g),/RED TRUTH/);
 g.shots=[];assert.equal(castQuill(g,target,1),5);assert.ok(g.shots.every(s=>!s.revision&&s.damage===20));updateHeroMechanic(g,1.3);assert.match(mechanicLabel(g),/0 \/ 100/);
});
test('piercing quills strike distinct targets with swept collisions, apply curse and build scaled Authority',()=>{
 const g=run();g.p.weapons.quill=5;g.enemies=[enemy(1,90),enemy(2,140),enemy(3,190),enemy(4,240)];castQuill(g,g.enemies[0],1);const s=g.shots[0];g.shots=[s];flight(g,s,2);assert.equal(s.hits.size,3);assert.equal(s.life,0);assert.ok(g.enemies.slice(0,3).every(e=>e.hp===980&&hasStatus(e,'cursed')));assert.equal(g.enemies[3].hp,1000);assert.ok(Math.abs(g.mechanic.value-26.4)<1e-8);
 const hp=g.enemies[0].hp;s.life=1;s.pierce=2;s.targetId=1;s.x=0;s.y=-25;flight(g,s,1);assert.equal(g.enemies[0].hp,hp,'victim history survives retargeting');
});
test('Final Chapter writes area glyphs, slows secondary victims and never grants Authority for splash alone',()=>{
 const g=run();g.p.fusions.quill='finalchapter';g.enemies=[enemy(1,110),enemy(2,115,12)];castQuill(g,g.enemies[0],1);const s=g.shots[0];g.shots=[s];while(!s.hits.size&&s.life>0)flight(g,s,.01);
 assert.ok(g.enemies.every(e=>e.hp<1000));assert.ok(hasStatus(g.enemies[1],'slow'));assert.ok(hasStatus(g.enemies[1],'cursed'));assert.equal(s.hits.size,1);assert.ok(Math.abs(g.mechanic.value-8.8)<1e-8);assert.ok(g.effects.some(e=>e.type==='script-glyph'&&e.red&&e.r>50));
});
test('quill launch delays, pauses and boss entrances preserve flight position, time and victims',()=>{
 const g=run(),e=enemy(1,250);g.enemies=[e];castQuill(g,e,1);const s=g.shots[1],x=s.x;updateQuillShot(g,s,.02,{damage:damageEnemy});assert.equal(s.x,x);updateQuillShot(g,s,.04,{damage:damageEnemy});assert.ok(s.x>x&&s.x-x<4);
 const snapshot=JSON.stringify(s,(_,v)=>v instanceof Set?[...v]:v);g.status='paused';updateQuillShot(g,s,9,{damage:damageEnemy});assert.equal(JSON.stringify(s,(_,v)=>v instanceof Set?[...v]:v),snapshot);g.status='playing';g.bossIntro={name:'Frieza'};updateQuillShot(g,s,9,{damage:damageEnemy});assert.equal(JSON.stringify(s,(_,v)=>v instanceof Set?[...v]:v),snapshot);assert.equal(updateQuillShot(g,{type:'ki'},.02,{}),false);
});
test('quills break supplies once and stop at solid scenery without damaging indestructible objects',()=>{
 for(const hp of [5,Infinity]){const g=run();const prop={id:'quill-prop',x:45,y:-25,r:8,hp,maxHp:hp,mass:1,vx:0,vy:0,type:'crate',kind:'prop'},target=enemy(1,120);g.world.active=[prop];g.enemies=[target];castQuill(g,target,1);const s=g.shots[0];g.shots=[s];flight(g,s,.2);assert.ok(s.propHits.has(prop.id));if(hp===Infinity){assert.equal(prop.hp,Infinity);assert.equal(s.life,0);assert.equal(target.hp,1000);}else{assert.ok(prop.hp<0);assert.ok(g.world.destroyed.has(prop.id));assert.equal(g.broken,1);}}
});
test('Authority gain honors Memory Fragments/mastery, kills, caps and never charges another hero',()=>{
 const g=run();g.p.passives.memoryfragment=3;g.p.meta.authorityGain=.3;heroAuthorityHit(g,10);assert.equal(g.mechanic.value,16);heroKill(g,{boss:false,elite:false});assert.equal(g.mechanic.value,25.6);heroKill(g,{boss:true});assert.ok(Math.abs(g.mechanic.value-64)<1e-8);heroAuthorityHit(g,100);assert.equal(g.mechanic.value,100);
 const other=createRun(CHARACTERS[0]);heroAuthorityHit(other,100);assert.equal(other.mechanic.value,0);
});
test('The Last Page cancels only nearby shots, slows and curses living targets, and respects boss resistance',()=>{
 const g=run();g.enemies=[enemy(1,100,0),enemy(2,-100,0,true),enemy(3,600,0)];g.enemyShots=[{x:30,y:0},{x:600,y:0}];applyStatus(g.p,'poison',3,{power:5});g.ultimate={type:'featherine',x:0,y:0,age:0,duration:5,tick:0};assert.ok(startFeatherineUltimate(g));assert.equal(g.p.pose,'author');assert.equal(hasStatus(g.p,'poison'),false);assert.equal(g.ultimate.duration,FEATHERINE_ULTIMATE.duration);
 updateFeatherineUltimate(g,g.ultimate,.02,{damage:damageEnemy});assert.equal(g.enemyShots.length,1);assert.equal(g.enemyShots[0].x,600);assert.equal(g.ultimate.erased,1);assert.ok(hasStatus(g.enemies[0],'slow'));assert.ok(hasStatus(g.enemies[0],'cursed'));assert.ok(Math.abs((1000-g.enemies[1].hp)/(1000-g.enemies[0].hp)-.8)<1e-8);assert.equal(g.enemies[2].hp,1000);
 const hp=g.enemies[0].hp;g.status='paused';g.ultimate.tick=0;updateFeatherineUltimate(g,g.ultimate,10,{damage:damageEnemy});assert.equal(g.enemies[0].hp,hp);g.status='playing';g.bossIntro={};updateFeatherineUltimate(g,g.ultimate,10,{damage:damageEnemy});assert.equal(g.enemies[0].hp,hp);
});
test('The Last Page final sentence occurs once, uses mastery damage and creates readable crimson glyphs',()=>{
 const g=run();g.p.meta.ultimateDamage=.5;g.enemies=[enemy(1,100,0)];g.ultimate={type:'featherine',x:0,y:0,age:4.9,duration:5,tick:1};startFeatherineUltimate(g);updateFeatherineUltimate(g,g.ultimate,.02,{damage:(run,e,v,c)=>damageEnemy(run,e,v*(1+(run.p.meta.ultimateDamage||0)),c)});const hp=g.enemies[0].hp;assert.ok(Math.abs(hp-(1000-165*1.05*1.5))<1e-8);assert.equal(g.ultimate.impacted,true);assert.ok(hasStatus(g.enemies[0],'stun'));assert.ok(g.effects.some(e=>e.type==='script-glyph'&&e.red));updateFeatherineUltimate(g,g.ultimate,.02,{damage:damageEnemy});assert.equal(g.enemies[0].hp,hp);
});
test('Featherine quill victim sets, Authority, active writing stage and skin choice checkpoint normally',()=>{
 const g=run(),storage=store();g.p.skin='shrine';g.enemies=[enemy(1,100),enemy(2,220)];g.p.weapons.quill=5;castQuill(g,g.enemies[0],1);const s=g.shots[0];g.shots=[s];while(!s.hits.size&&s.life>0)flight(g,s,.01);g.ultimate={type:'featherine',x:15,y:20,age:2,duration:5,tick:.3};startFeatherineUltimate(g);saveRun(g,storage);const restored=loadRun(storage);assert.ok(restored);assert.equal(restored.p.skin,'shrine');assert.equal(restored.status,'paused');assert.ok(restored.shots[0].hits instanceof Set);assert.deepEqual(restored.shots[0].hits,s.hits);assert.equal(restored.mechanic.value,g.mechanic.value);assert.equal(restored.ultimate.age,2);assert.equal(restored.ultimate.x,15);assert.equal(restored.ultimate.r,g.ultimate.r);
});
test('engine auto-casts quills with a finite cooldown and resolves real projectile hits into Authority',()=>{
 const {g,e}=engineFixture();updateRun(g,.02);assert.equal(g.shots.length,2);assert.ok(g.shots.every(s=>s.type==='quill'&&Number.isFinite(s.damage)));assert.equal(g.p.cooldowns.quill,1.2);assert.equal(e.hp,10000);
 for(let i=0;i<25;i++)updateRun(g,.02);
 assert.ok(e.hp<10000,'automatic projectiles reach the live enemy through updateRun');assert.ok(hasStatus(e,'cursed'));assert.ok(Math.abs(g.mechanic.value-17.6)<1e-8,'both primary quills award their Memory Fragment-scaled Authority');assert.ok(Number.isFinite(g.p.cooldowns.quill)&&g.p.cooldowns.quill>0&&g.p.cooldowns.quill<1.2);assert.equal(g.shots.length,0,'rank-one quills are removed after their first impact');assert.equal(g.status,'playing');
});
test('engine useSpecial starts The Last Page, cancels nearby hostile fire and deals its first written verse',()=>{
 const {g,e}=engineFixture();g.p.cooldowns.quill=999;g.enemyShots=[{x:40,y:0,vx:0,vy:0,life:20,age:0,r:3,damage:1},{x:600,y:0,vx:0,vy:0,life:20,age:0,r:3,damage:1}];assert.ok(useSpecial(g));assert.equal(g.special,60);assert.equal(g.ultimate.type,'featherine');assert.equal(g.ultimate.duration,5);assert.equal(useSpecial(g),false);
 updateRun(g,.02);assert.ok(Math.abs((10000-e.hp)-24*g.p.damage)<1e-8);assert.ok(hasStatus(e,'cursed')&&hasStatus(e,'slow'));assert.equal(g.ultimate.verses,1);assert.equal(g.ultimate.erased,1);assert.equal(g.enemyShots.length,1);assert.equal(g.enemyShots[0].x,600);assert.equal(g.p.pose,'author');assert.ok(Math.abs(g.mechanic.value-22)<1e-8);assert.ok(g.special<60&&g.special>59);
});
test('engine applies Last Page ultimate mastery exactly once to both verses and the final sentence',()=>{
 const base=engineFixture(),mastered=engineFixture();mastered.g.p.meta.ultimateDamage=.2;
 for(const {g} of [base,mastered]){g.p.cooldowns.quill=999;assert.ok(useSpecial(g));updateRun(g,.02);}
 const verse=10000-base.e.hp,masteredVerse=10000-mastered.e.hp;assert.ok(Math.abs(verse-24*base.g.p.damage)<1e-8);assert.ok(Math.abs(masteredVerse/verse-1.2)<1e-8,'20% mastery yields 1.2 times channel damage, never 1.44');
 const finish=[];for(const {g,e} of [base,mastered]){e.statuses={};g.ultimate.age=g.ultimate.duration-.14;g.ultimate.tick=1;const before=e.hp;updateRun(g,.03);finish.push(before-e.hp);assert.equal(g.ultimate.impacted,true);const after=e.hp;updateRun(g,.02);assert.equal(e.hp,after,'the final sentence fires once');updateRun(g,.11);assert.equal(g.ultimate,null);}
 assert.ok(Math.abs(finish[0]-165*base.g.p.damage)<1e-8);assert.ok(Math.abs(finish[1]/finish[0]-1.2)<1e-8,'20% mastery also scales the final sentence once');
});
