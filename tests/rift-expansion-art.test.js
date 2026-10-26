import test from 'node:test';
import assert from 'node:assert/strict';
import {riftSuperbossPixels,RIFT_SUPERBOSS_PALETTES,drawRiftBossAura} from '../src/rift-superboss-art.js';
import {RIFT_ARENAS,createRiftArena,restoreRiftArena,drawRiftArena} from '../src/rift-arena.js';

const ids=['aizenrift','madararift'];
function canvas(){
 const calls=[],state={};
 const c=new Proxy(state,{get:(o,k)=>k in o?o[k]:(...a)=>{assert.ok(a.every(v=>typeof v!=='number'||Number.isFinite(v)),k+' has finite geometry');calls.push([k,...a]);},set:(o,k,v)=>{o[k]=v;return true;}});
 return {c,calls};
}
test('new ascended rift bosses have distinct native bodies, casting poses and unleashed details',()=>{
 const arts=[];
 for(const id of ids){
  const art=riftSuperbossPixels(id),cast=riftSuperbossPixels(id,{attack:true,arm:4,leg:3,tail:3}),unleashed=riftSuperbossPixels(id,{enraged:true});
  assert.equal(art.length,56*76);assert.ok(art.filter(Boolean).length>1100,id+' has an articulated body');
  assert.ok(new Set(art.filter(Boolean)).size>=14,id+' retains separate material highlights');
  assert.notDeepEqual(art,cast);assert.notDeepEqual(art,unleashed);assert.deepEqual(art,riftSuperbossPixels(id));
  for(const color of RIFT_SUPERBOSS_PALETTES[id])assert.ok(art.includes(color),id+' renders each material');
  const v=canvas();assert.equal(drawRiftBossAura(v.c,{archetype:id,hp:100,r:40,x:0,y:0},4,true),true);
  assert.equal(v.calls.filter(a=>a[0]==='save').length,v.calls.filter(a=>a[0]==='restore').length);
  assert.ok(v.calls.length<120);arts.push(art);
 }
 assert.notDeepEqual(arts[0],arts[1]);
});

test('new bounded arenas restore their own layout and draw deterministic quiet scenery',()=>{
 const views=[];
 for(const id of ids){
  const arena=createRiftArena(id,12);assert.equal(arena.bossId,id);assert.equal(arena.enteredAt,12);assert.equal(arena.radius,760);
  const g={time:20,rifts:{active:{bossId:id}},riftArena:structuredClone(arena)};restoreRiftArena(g);
  assert.equal(g.riftArena.id,RIFT_ARENAS[id].id);assert.equal(g.riftArena.name,RIFT_ARENAS[id].name);assert.equal(g.riftArena.enteredAt,12);
  const v=canvas(),saved=JSON.stringify(g);assert.equal(drawRiftArena(v.c,g,-900,-900,1800,1800,true),true);assert.equal(JSON.stringify(g),saved);
  assert.equal(v.calls.filter(a=>a[0]==='save').length,v.calls.filter(a=>a[0]==='restore').length);assert.ok(v.calls.length<10000);
  assert.ok(v.calls.some(a=>a[0]==='strokeRect'&&a[1]===-760&&a[3]===1520),'collision rim has a visible border');
  g.time=100;const quiet=canvas();drawRiftArena(quiet.c,g,-900,-900,1800,1800,true);assert.deepEqual(v.calls,quiet.calls);
  views.push(v.calls);
 }
 assert.notDeepEqual(views[0],views[1]);
});
