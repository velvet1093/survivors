import test from 'node:test';
import assert from 'node:assert/strict';
import {CHARACTERS} from '../src/game.js';
import {createRun,spawnEnemy,damageEnemy,useSpecial,updateRun} from '../src/engine.js';
import {updateUltimate,ULTIMATES} from '../src/ultimates.js';
import {companionLeash} from '../src/companion-ai.js';
import {ensureWorld} from '../src/world.js';
import {saveRun,loadRun} from '../src/run-save.js';
import {frierenGolemPixels,frierenGolemIconPixels32} from '../src/frieren-golem-art.js';

const memory=()=>({data:new Map(),setItem(k,v){this.data.set(k,v)},getItem(k){return this.data.get(k)}});
function fixture(){
 const g=createRun(CHARACTERS.find(c=>c.id==='frieren'),3);g.spawn=g.eliteAt=g.nextBossWave=1e9;ensureWorld(g);
 for(const o of g.world.objects.values())o.hp=0;g.world.active=[];g.world.circles=[];
 const e=spawnEnemy(g,false,false,'zoomer');Object.assign(e,{x:120,y:0,hp:10000,maxHp:10000,speed:0,attackCD:999});
 g.p.cooldowns.zoltraak=999;g.invuln=999;assert.ok(useSpecial(g));return {g,e};
}
const damage=(g,e,v)=>{e.hp-=v;};
function tick(g,seconds,fn=damage){for(let t=0;t<seconds-1e-8;t+=.01)updateUltimate(g,Math.min(.01,seconds-t),{damage:fn,burst(){}});}

test('Frieren summons a persistent physical guardian with distinct punch and beam tells, rather than launching lances',()=>{
 const {g,e}=fixture();assert.equal(ULTIMATES.frieren.name,'Ancient Stone Golem');assert.equal(g.special,60);assert.equal(g.ultimate.duration,10);
 assert.equal(g.ultimate.golem.phase,'forming');tick(g,.54);assert.equal(e.hp,10000);assert.equal(g.shots.length,0);
 tick(g,.08);assert.equal(g.ultimate.golem.phase,'slam-windup');assert.equal(e.hp,10000);
 tick(g,.45);assert.ok(e.hp<10000);assert.ok(e.statuses.stun.remaining>0);assert.ok(g.ultimate.golem.slam);assert.ok(e.kvx>0);
 tick(g,1);assert.equal(g.ultimate.golem.phase,'beam-windup');const hp=e.hp;tick(g,.24);assert.equal(e.hp,hp,'beam wind-up cannot deal damage');
 tick(g,.5);assert.ok(e.hp<hp);assert.ok(g.ultimate.golem.beam);assert.ok(e.statuses.cursed.remaining>0);assert.equal(g.shots.length,0);
 tick(g,7.5);assert.equal(g.ultimate,null);assert.equal(g.p.pose,'');
});
test('the mouth beam hits its visible line and never attacks enemies beyond the player leash',()=>{
 const {g,e}=fixture(),offAxis=spawnEnemy(g,false,false,'zoomer'),far=spawnEnemy(g,false,false,'zoomer');
 Object.assign(offAxis,{x:120,y:110,hp:10000,maxHp:10000});Object.assign(far,{x:600,y:0,hp:10000,maxHp:10000});
 const s=g.ultimate.golem;Object.assign(s,{phase:'beam-windup',phaseAge:.64,aim:{x:e.x,y:e.y-e.r*.35},attackIndex:2,targetId:e.id});tick(g,.3);
 assert.ok(e.hp<10000);assert.equal(offAxis.hp,10000);assert.equal(far.hp,10000);assert.ok(s.beam.width>0);
});
test('the golem patrols locally, has movement freedom, and recalls with Frieren after a teleport or zoom change',()=>{
 const {g,e}=fixture();e.x=1200;tick(g,1);const s=g.ultimate.golem,start={x:s.x,y:s.y};g.time=2;tick(g,.8);assert.notDeepEqual({x:s.x,y:s.y},start);assert.equal(e.hp,10000);
 assert.ok(Math.hypot(s.x-g.p.x,s.y-g.p.y)<=companionLeash(g));g.p.x=1500;g.p.y=800;tick(g,.01);assert.ok(Math.hypot(s.x-g.p.x,s.y-g.p.y)<=companionLeash(g));
 g.view={w:390,h:700};g.zoom=g.targetZoom=1.4;tick(g,.01);assert.ok(Math.hypot(s.x-g.p.x,s.y-g.p.y)<=companionLeash(g)-21);assert.equal(e.hp,10000);
});
test('golem phase, targeting, HP and beam pulses persist through pause and save',()=>{
 const {g,e}=fixture(),s=g.ultimate.golem;Object.assign(s,{phase:'beam-windup',phaseAge:.64,aim:{x:e.x,y:e.y-e.r*.35},attackIndex:2,targetId:e.id});tick(g,.38);
 const storage=memory(),snapshot=JSON.stringify(s),age=g.ultimate.age;
 for(const status of ['paused','chest','upgrade']){g.status=status;tick(g,1);assert.equal(JSON.stringify(s),snapshot);assert.equal(g.ultimate.age,age);}
 g.status='playing';g.bossIntro={age:0};tick(g,1);assert.equal(JSON.stringify(s),snapshot);g.bossIntro=null;
 assert.ok(saveRun(g,storage));const r=loadRun(storage);assert.equal(r.status,'paused');assert.deepEqual(r.ultimate.golem,s);assert.equal(r.ultimate.age,age);r.status='playing';
 const before=e.hp,restoredBefore=r.enemies[0].hp;tick(g,.31);tick(r,.31);assert.equal(before-e.hp,restoredBefore-r.enemies[0].hp);assert.deepEqual(r.ultimate.golem,g.ultimate.golem);
});
test('engine applies ultimate damage mastery once to golem attacks and duration mastery extends its casting animation',()=>{
 const base=fixture(),mastered=fixture();mastered.g.p.meta.ultimateDamage=.2;
 for(const {g}of [base,mastered])for(let i=0;i<56;i++)updateRun(g,.02);
 const first=10000-base.e.hp,second=10000-mastered.e.hp;assert.ok(first>0);assert.ok(Math.abs(second/first-1.2)<1e-8);
 const g=fixture().g;g.ultimate=null;g.special=0;g.p.meta.ultimateDuration=.6;assert.ok(useSpecial(g));assert.equal(g.ultimate.duration,10.6);tick(g,10.2);assert.ok(g.ultimate.golem);tick(g,.41);assert.equal(g.ultimate,null);
});
test('stone guardian poses remain distinct at rest, while charging, and when striking; its icon keeps the stone and violet palette',()=>{
 const poses=['forming','idle','slam-windup','slam','beam-windup','beam'].map(phase=>JSON.stringify(frierenGolemPixels({phase,charge:.25})));
 assert.equal(new Set(poses).size,6);assert.notDeepEqual(frierenGolemPixels({frame:0}),frierenGolemPixels({frame:1}));
 const icon=frierenGolemIconPixels32();assert.equal(icon.length,32*32);assert.ok(new Set(icon.filter(Boolean)).size>=10);assert.ok(icon.includes('#f0addc'));
});
