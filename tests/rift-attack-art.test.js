import test from 'node:test';
import assert from 'node:assert/strict';
import {drawRiftAttack,RIFT_ATTACK_STYLES} from '../src/rift-attack-art.js';
import {riftSuperbossAttack,RIFT_SUPERBOSSES} from '../src/rift-superbosses.js';

function canvasLog(){
 const calls=[],state={};
 const c=new Proxy(state,{get:(obj,key)=>key in obj?obj[key]:(...args)=>{for(const arg of args)if(typeof arg==='number')assert.ok(Number.isFinite(arg),key+' receives finite coordinates');calls.push([key,...args]);},set:(obj,key,value)=>{if(typeof value==='number')assert.ok(Number.isFinite(value),key+' is finite');obj[key]=value;calls.push(['set',key,value]);return true;}});
 return {c,calls};
}

test('all registered rift attack scenes render their real attack marks with finite bounded canvas work',()=>{
 const styles=new Set();
 for(const id of Object.keys(RIFT_SUPERBOSSES))for(let skill=0;skill<3;skill++)for(const enraged of [false,true]){
  const e={...RIFT_SUPERBOSSES[id],archetype:id,id:1,x:120,y:-80,hp:100,skill,enraged,attackCD:0,windup:0};
  const g={lastMove:{x:1,y:0},toast:'',toastTime:0};
  riftSuperbossAttack(g,e,{x:0,y:0},.7,{hazard:()=>{}});styles.add(e.riftAttack.style);
  for(const reduced of [false,true])for(const age of [0,1.6,e.riftAttack.duration-.1]){
   e.riftAttack.age=age;const {c,calls}=canvasLog(),before=JSON.stringify(e);
   assert.equal(drawRiftAttack(c,e,reduced),true);assert.equal(JSON.stringify(e),before,'art never changes damage or attack state');
   assert.equal(calls.filter(a=>a[0]==='save').length,calls.filter(a=>a[0]==='restore').length,'canvas transforms balance');
   assert.ok(calls.length<2000,'scene has a bounded small number of strokes');
   const marks=e.riftAttack.marks,settled=marks?.length&&marks.every(h=>age-h.delay>(h.duration||.5)+.15);
   assert.ok(settled||calls.some(a=>a[0]==='stroke'||a[0]==='fill'),'scene draws while its marks are pending or active');
   if(reduced){const second=canvasLog();drawRiftAttack(second.c,e,true);assert.deepEqual(calls,second.calls,'quiet scene is deterministic at a paused attack clock');}
  }
 }
 assert.deepEqual([...styles].sort(),[...RIFT_ATTACK_STYLES].sort());
});

test('rift attack art ignores dead, expired, unknown and malformed encounters',()=>{
 for(const e of [{},{hp:0,riftAttack:{age:1,duration:2}},{hp:1,archetype:'foundereren',riftAttack:{style:'ribs',age:2,duration:2}},{hp:1,archetype:'other',riftAttack:{style:'hakai',age:1,duration:2,x:0,y:0,angle:0}},{hp:1,archetype:'beerus',riftAttack:{style:'hakai',age:1,duration:2,x:NaN,y:0,angle:0}}]){
  const {c,calls}=canvasLog();assert.equal(drawRiftAttack(c,e),false);assert.equal(calls.length,0);
 }
});
