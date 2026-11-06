import test from 'node:test';import assert from 'node:assert/strict';
import {drawZoltraakRay,drawZoltraakBolt} from '../src/frieren-effects.js';
import {drawShiraoriEffect} from '../src/shiraori-effects.js';
import {drawRimuruEffect,drawBlackFlame,drawGluttony} from '../src/rimuru-art-effects.js';
import {CHARACTERS} from '../src/game.js';import {createRun,castWeapon,spawnEnemy,updateRun} from '../src/engine.js';
import {summonBrood} from '../src/shiraori.js';
function context(){const calls=[],state={globalAlpha:1},c=new Proxy(state,{get:(o,k)=>k in o?o[k]:(...args)=>{for(const v of args)if(typeof v==='number')assert.ok(Number.isFinite(v),String(k));calls.push([k,...args]);},set:(o,k,v)=>{if(typeof v==='number')assert.ok(Number.isFinite(v),String(k));o[k]=v;calls.push(['set',k,v]);return true;}});return {c,calls};}
test('the new effects are pure, balanced and finite at every stage, and ignore other types',()=>{
 const cases=[[drawZoltraakRay,{type:'zoltraak',x:0,y:0,tx:300,ty:40,width:7}],[drawZoltraakRay,{type:'zoltraak',x:0,y:0,tx:300,ty:40,width:10,fused:true}],[drawRimuruEffect,{type:'blackflame-burst',x:5,y:5,r:50}],[drawRimuruEffect,{type:'blackflame-burst',x:5,y:5,r:50,fused:true}],...['spider-hatch','spider-bite','venom-splash','queen-stomp'].map(type=>[drawShiraoriEffect,{type,x:3,y:4,r:40}])];
 for(const [draw,e]of cases)for(const p of [0,.3,.99])for(const quiet of [false,true]){const {c,calls}=context(),before=JSON.stringify(e);assert.equal(draw(c,e,p,quiet),true);assert.equal(JSON.stringify(e),before);assert.equal(calls.filter(a=>a[0]==='save').length,calls.filter(a=>a[0]==='restore').length);assert.ok(calls.length<1500);}
 for(const draw of [drawZoltraakRay,drawRimuruEffect,drawShiraoriEffect])assert.equal(draw({}, {type:'nova'},0),false);
 for(const fused of [false,true]){const {c}=context();drawBlackFlame(c,{vx:1,vy:0,age:.2,fused});drawZoltraakBolt(c,{age:.2});}
 const {c}=context();for(const layer of ['under','over'])drawGluttony(c,{p:{x:0,y:0},ultimate:{type:'rimuru',age:1,r:200}},layer);
});
test('the engine emits the new effect types for each hero',()=>{
 const run=id=>{const g=createRun(CHARACTERS.find(c=>c.id===id));g.spawn=g.eliteAt=g.nextBossWave=1e6;g.p.nextXp=1e6;g.events&&(g.events.nextAt=1e9);return g;};
 const f=run('frieren'),e=spawnEnemy(f,false,false,'zoomer');Object.assign(e,{x:150,y:-26,hp:1e5,maxHp:1e5,speed:0,attackCD:999});f.effects=[];castWeapon(f,'zoltraak',e);
 assert.ok(f.effects.some(x=>x.type==='zoltraak'&&x.fused===false));
 const s=run('shiraori');s.effects=[];summonBrood(s,1,1);assert.ok(s.effects.some(x=>x.type==='spider-hatch'));
 const r=run('rimuru'),t=spawnEnemy(r,false,false,'zoomer');Object.assign(t,{x:60,y:-20,hp:1e5,maxHp:1e5,speed:0,attackCD:999});r.effects=[];castWeapon(r,'blackflame',t);for(let i=0;i<60&&!r.effects.some(x=>x.type==='blackflame-burst');i++)updateRun(r,.02,{x:0,y:0});
 assert.ok(r.effects.some(x=>x.type==='blackflame-burst'));
});
