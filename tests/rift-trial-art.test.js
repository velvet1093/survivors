import test from 'node:test';
import assert from 'node:assert/strict';
import {CHARACTERS} from '../src/game.js';
import {createRun,resolveRift} from '../src/engine.js';
import {finishBossIntro} from '../src/boss-intro.js';
import {RIFT_TRIALS,beginRiftTrial,updateRiftTrial,finishRiftTrial} from '../src/rift-trials.js';
import {drawRiftTrialWorld,drawRiftTrialOverlay} from '../src/rift-trial-art.js';
import {riftTrialHud} from '../src/rift-trial-ui.js';

function canvas(){
 const calls=[],stack=[];let depth=0;const state={globalAlpha:1,save(){stack.push({...state});depth++;calls.push(['save']);},restore(){assert.ok(depth>0);depth--;const old=stack.pop();for(const k of Object.keys(state))if(typeof state[k]!=='function')delete state[k];Object.assign(state,old);calls.push(['restore']);},createRadialGradient(...args){assert.ok(args.every(Number.isFinite));calls.push(['gradient',...args]);return{addColorStop(offset,color){assert.ok(Number.isFinite(offset));calls.push(['stop',offset,color]);}};}};
 const c=new Proxy(state,{get:(o,k)=>k in o?o[k]:(...args)=>{for(const arg of args)if(typeof arg==='number')assert.ok(Number.isFinite(arg),String(k));calls.push([k,...args]);},set(o,k,v){if(typeof v==='number')assert.ok(Number.isFinite(v),String(k));o[k]=v;calls.push(['set',k,v]);return true;}});return{c,calls,depth:()=>depth};
}
function trial(id){const g=createRun(CHARACTERS[0]);g.status='rift';g.rifts.portal={bossId:id,serial:1,x:0,y:0,age:0};assert.ok(resolveRift(g,true));finishBossIntro(g);const e=g.enemies.find(e=>e.riftBoss);e.hp=e.maxHp*.49;assert.ok(beginRiftTrial(g,e));return g;}

test('all nine live trial states render distinct bounded scenery and warnings without modifying objectives',()=>{
 const signatures=new Set();for(const id of Object.keys(RIFT_TRIALS))for(const quiet of [false,true]){
  const g=trial(id);updateRiftTrial(g,4.6);if(id==='darknessdevil'){g.p.x=g.riftTrial.goals[0].x+50;g.p.y=g.riftTrial.goals[0].y+20;}
  const before=structuredClone(g),{c,calls,depth}=canvas();assert.ok(drawRiftTrialWorld(c,g,quiet));assert.ok(drawRiftTrialOverlay(c,g,390,844,quiet));assert.equal(depth(),0);assert.deepEqual(g,before);assert.ok(calls.length<4500,'finite drawing cost');assert.ok(calls.some(([k])=>k==='fill'||k==='fillRect'));signatures.add(JSON.stringify(calls));
  if(quiet){const other=canvas();drawRiftTrialWorld(other.c,g,true);drawRiftTrialOverlay(other.c,g,390,844,true);assert.equal(JSON.stringify(calls),JSON.stringify(other.calls),'same saved challenge has identical quiet geometry');}
 }
 assert.equal(signatures.size,12,'all eleven themes differ; only Darkness adds a decorative nonessential pulse in normal motion');
});

test('blackout conceals far remains but reveals recognizable nearby suit parts and keeps source warnings above its veil',()=>{
 const g=trial('darknessdevil');g.p.x=0;g.p.y=0;const far=canvas();drawRiftTrialWorld(far.c,g,true);assert.equal(far.calls.filter(([k])=>k==='fillRect').length,0,'suit art never reveals far-away collection points');
 const goal=g.riftTrial.goals[0];g.p.x=goal.x+50;g.p.y=goal.y;const near=canvas();drawRiftTrialWorld(near.c,g,true);assert.ok(near.calls.filter(([k])=>k==='fillRect').length>100,'nearby helmet has detailed native suit and visor pixels');
 g.riftTrial.hazards=[{shape:'circle',x:g.p.x,y:g.p.y,r:56,age:.4,delay:1.8,duration:.4,damage:8}];const overlay=canvas();drawRiftTrialOverlay(overlay.c,g,390,844,true);assert.ok(overlay.calls.some(([k,,color])=>k==='stop'&&color==='#010407fc'),'the outer arena is near-black');assert.ok(overlay.calls.findIndex(([k])=>k==='fillRect')<overlay.calls.findIndex(([k])=>k==='arc'),'fixed warning boundaries draw after the darkness mask');
});

test('blackout completion uses its saved afterglow clock and malformed/inactive records do not draw',()=>{
 const g=trial('darknessdevil');finishRiftTrial(g);g.riftTrialAfterglow.age=.4;const before=structuredClone(g),a=canvas(),b=canvas();assert.ok(drawRiftTrialOverlay(a.c,g,844,390));assert.ok(drawRiftTrialOverlay(b.c,g,844,390));assert.equal(JSON.stringify(a.calls),JSON.stringify(b.calls));assert.deepEqual(g,before);
 g.riftTrialAfterglow.age=g.riftTrialAfterglow.duration;assert.equal(drawRiftTrialOverlay(canvas().c,g,844,390),false);
 for(const g of [{},{p:{x:0,y:0}},{p:{x:0,y:0},riftTrial:{bossId:'other',age:0}},{p:{x:NaN,y:0},riftTrial:{bossId:'darknessdevil',age:0}}]){const a=canvas();assert.equal(drawRiftTrialWorld(a.c,g),false);assert.equal(drawRiftTrialOverlay(a.c,g,390,844),false);assert.equal(a.calls.length,0);}
});

test('every live challenge explains its actual objective and counted progress in the persistent touch-transparent HUD',()=>{
 for(const id of Object.keys(RIFT_TRIALS)){const g=trial(id),before=structuredClone(g),html=riftTrialHud(g);assert.ok(html.includes(RIFT_TRIALS[id].name.replace(/’/g,'’')));assert.ok(html.includes('RIFT CHALLENGE · PHASE II'));assert.equal((html.match(/<i class=/g)||[]).length,RIFT_TRIALS[id].total);assert.ok(html.includes('aria-label="0 of '+RIFT_TRIALS[id].total+' completed"'));assert.ok(!/undefined|NaN/.test(html));assert.deepEqual(g,before);}
 assert.equal(riftTrialHud({}), '');
 const defeated=trial('darknessdevil');defeated.status='over';assert.equal(riftTrialHud(defeated),'','defeat removes the challenge objective behind the results');
});
