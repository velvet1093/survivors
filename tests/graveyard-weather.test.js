import test from 'node:test';
import assert from 'node:assert/strict';
import {drawGraveyardWeather} from '../src/graveyard-weather.js';
function canvas(){const ops=[],c=new Proxy({},{get(o,k){return k in o?o[k]:(...args)=>{for(const v of args)if(typeof v==='number')assert.ok(Number.isFinite(v),String(k));ops.push([k,...args]);};},set(o,k,v){if(typeof v==='number')assert.ok(Number.isFinite(v),String(k));o[k]=v;ops.push(['set',k,v]);return true;}});return{c,ops};}
test('graveyard mist and both event atmospheres are finite, bounded and read-only on phone and desktop',()=>{
 for(const id of [null,'ghostparade','tombwake'])for(const [w,h]of [[390,844],[1440,1000],[844,390]])for(const quiet of [false,true]){
  const g={map:{id:'graveyard'},time:137,events:{active:id?{id,age:12.75}:null}},before=structuredClone(g),a=canvas();
  assert.equal(drawGraveyardWeather(a.c,g,w,h,quiet),true);assert.deepEqual(g,before);assert.ok(a.ops.length<250);assert.equal(a.ops.filter(v=>v[0]==='save').length,a.ops.filter(v=>v[0]==='restore').length);
 }
});
test('haunted weather follows the saved event clock while reduced motion stays still',()=>{
 for(const id of ['ghostparade','tombwake']){
  const g={map:{id:'tokyo'},time:1,events:{active:{id,age:8.2}}},a=canvas(),b=canvas(),later=canvas(),quiet=canvas(),quietLater=canvas();
  drawGraveyardWeather(a.c,g,390,844);drawGraveyardWeather(b.c,structuredClone(g),390,844);assert.deepEqual(a.ops,b.ops);
  drawGraveyardWeather(quiet.c,g,390,844,true);g.events.active.age+=4;drawGraveyardWeather(later.c,g,390,844);drawGraveyardWeather(quietLater.c,g,390,844,true);assert.notDeepEqual(a.ops,later.ops);assert.deepEqual(quiet.ops,quietLater.ops);
 }
});
test('the new atmosphere does not spill into unrelated maps, rift arenas or Boss Rush',()=>{
 for(const g of [{map:{id:'garden'},events:{}},{map:{id:'graveyard'},events:{},mode:'bossrush'},{map:{id:'graveyard'},events:{active:{id:'ghostparade'}},riftArena:{id:'primordialnight'}}]){
  const a=canvas();assert.equal(drawGraveyardWeather(a.c,g,390,844),false);assert.equal(a.ops.length,0);
 }
});
