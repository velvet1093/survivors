import test from 'node:test';
import assert from 'node:assert/strict';
import {CHARACTERS} from '../src/game.js';
import {createRun,spawnEnemy,damageEnemy,useSpecial,updateRun} from '../src/engine.js';
import {applyStatus} from '../src/status.js';
import {updateUltimate} from '../src/ultimates.js';
import {FRIEREN_BARRAGE,useSecondaryUltimate} from '../src/frieren-barrage.js';
import {drawFrierenBarrage} from '../src/frieren-barrage-art.js';
import {ensureWorld} from '../src/world.js';
import {saveRun,loadRun} from '../src/run-save.js';
const memory=()=>{const m=new Map();return {getItem:k=>m.get(k)??null,setItem:(k,v)=>m.set(k,v),removeItem:k=>m.delete(k)};};
const rawDamage=(g,e,v)=>{e.hp-=v;};
function fixture(){
 const g=createRun(CHARACTERS.find(c=>c.id==='frieren'),3);ensureWorld(g);g.world.active=[];g.world.circles=[];for(const o of g.world.objects.values())o.hp=0;
 g.spawn=g.eliteAt=g.nextBossWave=g.invuln=g.p.nextXp=1e9;g.p.cooldowns.zoltraak=1e9;
 const e=spawnEnemy(g,false,false,'zoomer');Object.assign(e,{x:250,y:0,hp:1e5,maxHp:1e5,speed:0,attackCD:1e9});return {g,e};
}
function tick(g,seconds,damage=rawDamage){for(let age=0;age<seconds-1e-8;age+=.01)updateUltimate(g,Math.min(.01,seconds-age),{damage,burst(){}});}

test('Frieren’s second ultimate has its own cooldown and cannot bypass character, status or action locks',()=>{
 const {g}=fixture();g.special=47;g.p.cooldown=.8;g.p.meta.ultimateCooldown=.1;assert.ok(useSecondaryUltimate(g));assert.equal(g.special,47);assert.equal(g.secondarySpecial,75*.8*.9);assert.equal(g.secondarySpecialMax,g.secondarySpecial);assert.equal(g.ultimate.type,'frieren-barrage');assert.equal(g.ultimateSerial,1);assert.equal(g.ultimate.chargeDuration,FRIEREN_BARRAGE.chargeDuration);
 assert.equal(useSecondaryUltimate(g),false);assert.equal(useSpecial(g),false);
 for(const condition of ['other-hero','paused','intro','stun','frozen','dash','cooldown','dead']){
  const {g}=fixture();if(condition==='other-hero')g.p.id='goku';if(condition==='paused')g.status='paused';if(condition==='intro')g.bossIntro={};if(condition==='stun'||condition==='frozen')applyStatus(g.p,condition,1);if(condition==='dash')g.dash={};if(condition==='cooldown')g.secondarySpecial=.1;if(condition==='dead')g.p.hp=0;
  const before=JSON.stringify(g);assert.equal(useSecondaryUltimate(g),false,condition);assert.equal(JSON.stringify(g),before,condition+' leaves all state unchanged');
 }
});

test('barrage charges before dealing damage, fires one broad once-only blast and clears only intersecting shots',()=>{
 const {g,e}=fixture();assert.ok(useSecondaryUltimate(g));const origin=structuredClone(g.ultimate.beams);assert.equal(origin.length,1);assert.equal(origin[0].width,84*g.p.area);assert.equal(origin[0].damage,600);
 const side=spawnEnemy(g,false,false,'zoomer'),behind=spawnEnemy(g,false,false,'zoomer'),far=spawnEnemy(g,false,false,'zoomer');Object.assign(side,{x:250,y:230,hp:1e5});Object.assign(behind,{x:-250,y:0,hp:1e5});Object.assign(far,{x:1250,y:0,hp:1e5});
 const line=g.ultimate.beams[0],mid={x:(line.x+line.tx)/2,y:(line.y+line.ty)/2};g.enemyShots=[{x:mid.x,y:mid.y,r:5},{x:mid.x,y:mid.y+250,r:5}];
 tick(g,1.19);assert.equal(e.hp,1e5);assert.ok(g.ultimate.beams.every(b=>!b.done));assert.equal(g.enemyShots.length,2);
 g.p.x=-400;g.p.y=500;tick(g,.22);assert.equal(e.hp,1e5-600*g.p.damage);assert.equal(g.ultimate.beams.filter(b=>b.done).length,1);assert.equal(g.enemyShots.length,1);assert.equal(g.enemyShots[0].y,mid.y+250);
 for(const [i,b]of g.ultimate.beams.entries())for(const key of ['x','y','tx','ty','angle'])assert.equal(b[key],origin[i][key],'moving caster cannot retarget '+key);
 const hp=e.hp;tick(g,.55);assert.equal(e.hp,hp);assert.equal(e.hp,1e5-600*g.p.damage);assert.equal(side.hp,1e5);assert.equal(behind.hp,1e5);assert.equal(far.hp,1e5);assert.ok(g.ultimate.beams.every(b=>b.done));assert.ok(e.statuses.cursed.remaining>0);tick(g,1.2);assert.equal(e.hp,hp);assert.equal(g.ultimate,null);
});

test('barrage respects pause and intro clocks and a checkpoint after impact cannot replay the single blast',()=>{
 const {g,e}=fixture(),store=memory();useSecondaryUltimate(g);tick(g,1.42);assert.equal(g.ultimate.beams.filter(b=>b.done).length,1);const before=JSON.stringify(g.ultimate);
 for(const status of ['paused','upgrade','chest']){g.status=status;tick(g,1);assert.equal(JSON.stringify(g.ultimate),before);}
 g.status='playing';g.bossIntro={};tick(g,1);assert.equal(JSON.stringify(g.ultimate),before);g.bossIntro=null;
 assert.ok(saveRun(g,store));const restored=loadRun(store);assert.ok(restored);assert.equal(restored.status,'paused');assert.equal(restored.secondarySpecial,g.secondarySpecial);assert.deepEqual(restored.ultimate,g.ultimate);restored.status='playing';const a=e.hp,b=restored.enemies.find(x=>x.id===e.id).hp;tick(g,2);tick(restored,2);assert.equal(a-e.hp,b-restored.enemies.find(x=>x.id===e.id).hp);assert.equal(a-e.hp,0);
});

test('an older unfinished volley keeps its spent hits on reload and the next activation uses one blast',()=>{
 const {g,e}=fixture(),store=memory();useSecondaryUltimate(g);const beam=g.ultimate.beams[0];delete g.ultimate.barrageVersion;g.ultimate.duration=3.7;g.ultimate.age=1.42;
 g.ultimate.beams=[0,1,2].map(i=>{const b={...beam,width:36,at:1.2+i*.55,damageAt:1.38+i*.55,done:i===0,released:i===0};delete b.damage;delete b.duration;return b;});e.hp-=200*g.p.damage;
 assert.ok(saveRun(g,store));const restored=loadRun(store);assert.equal(restored.ultimate.beams.length,3);restored.status='playing';const target=restored.enemies.find(s=>s.id===e.id),before=target.hp;tick(restored,2.4);assert.equal(before-target.hp,400*g.p.damage);assert.equal(restored.ultimate,null);
 restored.secondarySpecial=0;assert.ok(useSecondaryUltimate(restored));assert.equal(restored.ultimate.beams.length,1);assert.equal(restored.ultimate.barrageVersion,2);
});

test('engine applies barrage ultimate mastery once while the independent living golem keeps fighting',()=>{
 const a=fixture(),b=fixture();b.g.p.meta.ultimateDamage=.25;
 for(const {g}of [a,b]){useSecondaryUltimate(g);for(let i=0;i<73;i++)updateRun(g,.02);}
 const left=1e5-a.e.hp,right=1e5-b.e.hp;assert.ok(left>0);assert.ok(Math.abs(right/left-1.25)<1e-8,'shared engine callback applies ultimate mastery once');
 const {g,e}=fixture();e.x=350;assert.ok(useSpecial(g));const guardian=g.golem,id=guardian.id;guardian.hp=guardian.maxHp/2;g.ultimate=null;assert.ok(g.special>0);assert.ok(useSecondaryUltimate(g));const age=guardian.age;for(let i=0;i<50;i++)updateRun(g,.02);assert.strictEqual(g.golem,guardian);assert.equal(g.golem.id,id);assert.ok(g.golem.age>age);assert.equal(g.golem.hp,g.golem.maxHp/2);assert.equal(g.ultimate.type,'frieren-barrage');
});

test('barrage art renders the detailed charge and all dark-core beam stages without changing gameplay, including reduced motion',()=>{
 const {g}=fixture();useSecondaryUltimate(g);const signatures=new Set();
 for(const quiet of [false,true])for(const age of [.5,1.23,1.4,1.8,2.15]){
  g.p.reducedMotion=quiet;g.ultimate.age=age;const calls=[],state={};const c=new Proxy(state,{get:(o,k)=>k in o?o[k]:(...args)=>{for(const a of args)if(typeof a==='number')assert.ok(Number.isFinite(a),String(k));calls.push([k,...args]);},set:(o,k,v)=>{if(typeof v==='number')assert.ok(Number.isFinite(v),String(k));o[k]=v;return true;}}),before=JSON.stringify(g.ultimate);
  assert.ok(drawFrierenBarrage(c,g,'under'));assert.ok(drawFrierenBarrage(c,g,'over'));assert.equal(JSON.stringify(g.ultimate),before);assert.equal(calls.filter(c=>c[0]==='save').length,calls.filter(c=>c[0]==='restore').length);assert.ok(calls.length<2500);assert.ok(calls.some(c=>c[0]==='ellipse'));signatures.add(JSON.stringify(calls));
 }
 assert.ok(signatures.size>=6);assert.equal(drawFrierenBarrage({},{}),false);
});
