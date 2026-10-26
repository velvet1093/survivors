import test from 'node:test';
import assert from 'node:assert/strict';
import {CHARACTERS} from '../src/game.js';
import {createRun} from '../src/engine.js';
import {ensureWorld,moveBody} from '../src/world.js';
import {RIFT_ARENAS,createRiftArena,restoreRiftArena,drawRiftArena} from '../src/rift-arena.js';

function canvas(){let depth=0;const ops=[];const c=new Proxy({save(){depth++;ops.push(['save']);},restore(){depth--;assert.ok(depth>=0);ops.push(['restore']);}},{get(o,k){if(k in o)return o[k];return(...args)=>{for(const value of args)if(typeof value==='number')assert.ok(Number.isFinite(value),String(k));ops.push([k,...args]);};},set(o,k,v){if(typeof v==='number')assert.ok(Number.isFinite(v),String(k));o[k]=v;ops.push(['set',k,v]);return true;}});return{c,ops,depth:()=>depth};}
function run(time=12){const g=createRun(CHARACTERS[0]);g.time=time;g.riftArena=createRiftArena('deathdevil',7);return g;}

// These checks exercise the actual bounded movement and terrain renderer. The
// arena scenery never supplies hidden colliders or overwrites the selected map.
test('Death has a distinct 800-unit Last Silence arena that restores the saved encounter clock and identity',()=>{
 const arena=createRiftArena('deathdevil',7);assert.deepEqual(arena,{...RIFT_ARENAS.deathdevil,bossId:'deathdevil',enteredAt:7,version:1});assert.equal(arena.id,'lastsilence');assert.equal(arena.name,'Hell · The Last Silence');assert.equal(arena.radius,800);
 const saved=JSON.parse(JSON.stringify({...arena,enteredAt:19})),g={time:52,riftArena:saved,rifts:{active:{bossId:'deathdevil'}}};assert.equal(restoreRiftArena(g).enteredAt,19);assert.equal(g.riftArena.radius,800);assert.equal(g.riftArena.bossId,'deathdevil');g.rifts.active=null;assert.equal(restoreRiftArena(g),null);assert.equal(g.riftArena,null);
 assert.equal(createRiftArena('not-a-boss'),null);
});

test('the ash plain leaves its center traversable and creates no random buildings, pickups, hazards or resource rewards',()=>{
 const g=run(),map=g.map;g.money=93;g.characterXp=22;g.world.active=[{id:'outside-building',x:0,y:0,r:200}];g.world.circles=[{x:0,y:0,r:200}];assert.deepEqual(ensureWorld(g),[]);assert.deepEqual(g.world.circles,[]);
 Object.assign(g.p,{x:-300,y:0});moveBody(g,g.p,600,0,8);assert.equal(g.p.x,300);assert.equal(g.p.y,0);moveBody(g,g.p,3000,-3000,8);assert.equal(g.p.x,792);assert.equal(g.p.y,-792);assert.equal(g.map,map);assert.equal(g.money,93);assert.equal(g.characterXp,22);assert.equal(g.pickups.length,0);assert.equal(g.hazards.length,0);assert.equal(g.chests.length,0);
});

test('Last Silence has deterministic finite scenery and balanced canvas state without changing encounter or resource data',()=>{
 const g=run(),before=structuredClone(g),a=canvas(),b=canvas();assert.equal(drawRiftArena(a.c,g,-900,-980,1800,1900),true);assert.equal(drawRiftArena(b.c,g,-900,-980,1800,1900),true);assert.deepEqual(a.ops,b.ops);assert.equal(a.depth(),0);assert.ok(a.ops.length>1000&&a.ops.length<20000,'bounded flower, curtain and inverted skyline work');assert.deepEqual(g,before);
 assert.ok(a.ops.some(op=>op[0]==='set'&&op[2]==='#32323a'),'ashen ground');assert.ok(a.ops.some(op=>op[0]==='fillRect'&&op[2]<-800),'hanging architecture lies beyond the northern rim');assert.equal(drawRiftArena({}, {riftArena:null},0,0,10,10),false);
});

test('reduced-motion ash and curtains stay fixed across time while normal motion follows only the saved simulation clock',()=>{
 const a=canvas(),b=canvas(),c=canvas(),d=canvas();drawRiftArena(a.c,run(2),-900,-980,1800,1900,true);drawRiftArena(b.c,run(140),-900,-980,1800,1900,true);assert.deepEqual(a.ops,b.ops);
 drawRiftArena(c.c,run(2),-900,-980,1800,1900,false);drawRiftArena(d.c,run(3),-900,-980,1800,1900,false);assert.notDeepEqual(c.ops,d.ops);assert.equal(c.depth(),0);assert.equal(d.depth(),0);
 const old=run(2),oldDraw=canvas();old.riftArena=createRiftArena('darknessdevil',7);drawRiftArena(oldDraw.c,old,-900,-980,1800,1900,true);assert.notDeepEqual(oldDraw.ops,a.ops,'white curtains and ash do not reuse Darkness terrain');
});
