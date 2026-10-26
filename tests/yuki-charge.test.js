import test from 'node:test';import assert from 'node:assert/strict';
import {CHARACTERS} from '../src/game.js';import {createRun,spawnEnemy,damageEnemy,useSpecial,updateRun} from '../src/engine.js';import {updateUltimate,ULTIMATES} from '../src/ultimates.js';import {ensureWorld} from '../src/world.js';import {saveRun,loadRun} from '../src/run-save.js';import {characterPixels} from '../src/pixel-characters.js';
const yuki=CHARACTERS.find(c=>c.id==='yuki'),memory=()=>({data:new Map(),setItem(k,v){this.data.set(k,v)},getItem(k){return this.data.get(k)}});
function fixture(){const g=createRun(yuki,3);g.spawn=g.eliteAt=g.nextBossWave=1e9;ensureWorld(g);for(const o of g.world.objects.values())o.hp=0;g.world.active=[];g.world.circles=[];const e=spawnEnemy(g,false,false,'zoomer');Object.assign(e,{x:120,y:0,hp:10000,maxHp:10000,speed:0});g.enemyShots=[{x:50,y:0,vx:0,vy:0,life:20,age:0,r:3,damage:1}];assert.ok(useSpecial(g));return {g,e};}
const tick=(g,t)=>{for(let i=0;i<Math.round(t/.01);i++)updateUltimate(g,.01,{damage:damageEnemy,burst(){}});};
test('Yuki compresses mass for two seconds before any black-hole damage, pull or shot absorption',()=>{
 const {g,e}=fixture();assert.equal(g.special,60);assert.equal(g.ultimate.duration,7);assert.equal(g.ultimate.phase,'charging');assert.equal(g.p.pose,'singularity-charge');tick(g,1.99);assert.equal(e.hp,10000);assert.equal(e.x,120);assert.equal(g.enemyShots.length,1);assert.equal(g.ultimate.released,false);tick(g,.02);assert.equal(g.ultimate.released,true);assert.equal(g.ultimate.phase,'active');assert.equal(g.p.pose,'mass');assert.ok(e.hp<10000);assert.ok(e.x<120);assert.equal(g.enemyShots.length,0);
});
test('release has five full seconds plus mastery duration, a fixed center, resisted boss pull and one final collapse',()=>{
 const {g,e}=fixture();const b=spawnEnemy(g,true,false,'cell');Object.assign(b,{x:-120,y:0,hp:10000,maxHp:10000,cellStage:2,enraged:true});g.p.x=450;g.p.y=90;tick(g,2.1);assert.equal(g.ultimate.x,0);assert.equal(g.ultimate.y,0);assert.ok(Math.abs(e.x)<Math.abs(b.x));tick(g,4.71);assert.equal(g.ultimate.impacted,true);const after=e.hp;tick(g,.1);assert.ok(e.hp<=after);assert.equal(g.ultimate.impacted,true);tick(g,.11);assert.equal(g.ultimate,null);
 const second=fixture();second.g.ultimate=null;second.g.special=0;second.g.p.meta.ultimateDuration=2;assert.ok(useSpecial(second.g));assert.equal(second.g.ultimate.duration,9);assert.equal(ULTIMATES.yuki.duration,7);
});
test('charging freezes during pause, chest decisions and boss entrances, and restores at the saved charge age',()=>{
 const {g,e}=fixture(),storage=memory();tick(g,1.1);const age=g.ultimate.age;for(const status of ['paused','chest']){g.status=status;tick(g,4);assert.equal(g.ultimate.age,age);}g.status='playing';g.bossIntro={id:'test',age:0};tick(g,4);assert.equal(g.ultimate.age,age);g.bossIntro=null;saveRun(g,storage);const r=loadRun(storage);assert.equal(r.ultimate.age,age);assert.equal(r.ultimate.phase,'charging');assert.equal(r.ultimate.released,false);assert.equal(r.status,'paused');tick(r,2);assert.equal(r.ultimate.age,age);r.status='playing';tick(r,.91);assert.equal(r.ultimate.released,true);assert.ok(r.enemies[0].hp<e.hp);
});
test('legacy already-active holes remain active and the charging pose is visibly distinct in both outfits',()=>{
 const {g,e}=fixture();Object.assign(g.ultimate,{duration:5,age:1});for(const key of ['rulesVersion','chargeDuration','phase','charge','released'])delete g.ultimate[key];tick(g,.01);assert.equal(g.ultimate.chargeDuration,0);assert.equal(g.ultimate.phase,'active');assert.ok(e.hp<10000);
 for(const skin of ['default','midnight'])assert.notDeepEqual(characterPixels('yuki',{skin,pose:'singularity-charge'}),characterPixels('yuki',{skin,pose:'mass'}));
});
test('engine applies Yuki ultimate mastery once after charging and once to the final mass collapse',()=>{
 const base=fixture(),mastered=fixture();mastered.g.p.meta.ultimateDamage=.2;
 for(const {g,e} of [base,mastered]){g.p.cooldowns.garuda=999;g.invuln=999;e.attackCD=999;for(let i=0;i<99;i++)updateRun(g,.02);assert.equal(e.hp,10000,'the real engine preserves the full two-second charge');for(let i=0;i<2;i++)updateRun(g,.02);assert.equal(g.ultimate.released,true);assert.ok(e.hp<10000);}
 const tickDamage=10000-base.e.hp,masteredTickDamage=10000-mastered.e.hp;assert.ok(Math.abs(masteredTickDamage/tickDamage-1.2)<1e-8,'20% mastery yields 1.2 times active damage, never 1.44');
 const collapse=[];for(const {g,e} of [base,mastered]){g.ultimate.age=g.ultimate.duration-.22;g.ultimate.tick=1;const before=e.hp;updateRun(g,.03);collapse.push(before-e.hp);assert.equal(g.ultimate.impacted,true);const after=e.hp;updateRun(g,.02);assert.equal(e.hp,after,'the mass collapse fires once');}
 assert.ok(collapse[0]>0);assert.ok(Math.abs(collapse[1]/collapse[0]-1.2)<1e-8,'the engine also applies mastery to the final collapse exactly once');
});
