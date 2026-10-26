import test from 'node:test';
import assert from 'node:assert/strict';
import {DEATH_BOSSES,deathRiftAttack} from '../src/death-rift.js';
import {DEATH_ATTACK_STYLES,drawDeathRiftAttack} from '../src/death-attack-art.js';
import {drawRiftAttack,RIFT_ATTACK_STYLES} from '../src/rift-attack-art.js';
function canvas(){let depth=0;const ops=[],c=new Proxy({globalAlpha:1,save(){depth++;ops.push(['save']);},restore(){depth--;assert.ok(depth>=0);ops.push(['restore']);}},{get(t,k){return k in t?t[k]:(...args)=>{assert.ok(args.filter(v=>typeof v==='number').every(Number.isFinite),String(k));ops.push([k,...args]);};},set(t,k,v){if(typeof v==='number')assert.ok(Number.isFinite(v),String(k));t[k]=v;ops.push(['set',k,v]);return true;}});return{c,ops,depth:()=>depth};}
function cast(skill,enraged=false){const e={...DEATH_BOSSES.deathdevil,archetype:'deathdevil',id:2,x:-200,y:-100,hp:100,skill,enraged,attackCD:0},g={lastMove:{x:1,y:0}};assert.ok(deathRiftAttack(g,e,{x:40,y:70},.7,{hazard(){}}));return e;}
test('all three Death scenes render their actual fixed marks through the live rift hook with bounded drawing work',()=>{
 const styles=new Set();for(const skill of [0,1,2])for(const enraged of [false,true])for(const quiet of [false,true]){const e=cast(skill,enraged);styles.add(e.riftAttack.style);for(const age of [0,1.7,2.3,3.1,e.riftAttack.duration-.1]){e.riftAttack.age=age;const before=structuredClone(e),a=canvas(),b=canvas();assert.ok(drawDeathRiftAttack(a.c,e,quiet));assert.equal(a.depth(),0);assert.deepEqual(e,before);assert.ok(a.ops.length<2000);drawRiftAttack(b.c,e,quiet);assert.deepEqual(a.ops,b.ops,'live hook preserves Death geometry');assert.ok(!a.ops.some(([method])=>['fillRect','clearRect','shadowBlur'].includes(method)),'effects never cover the screen');}}
 assert.deepEqual([...styles].sort(),[...DEATH_ATTACK_STYLES].sort());for(const style of styles)assert.ok(RIFT_ATTACK_STYLES.includes(style));
});
test('Death effects are deterministic at a checkpoint and leave the combat marks and escape directions untouched',()=>{
 for(const skill of [0,1,2])for(const quiet of [false,true]){const e=cast(skill,true);e.riftAttack.age=1.8;const before=JSON.stringify(e.riftAttack.marks),a=canvas(),b=canvas();drawRiftAttack(a.c,e,quiet);drawRiftAttack(b.c,structuredClone(e),quiet);assert.deepEqual(a.ops,b.ops);assert.equal(JSON.stringify(e.riftAttack.marks),before);assert.equal(e.riftAttack.gapAngle,0);}
 const e=cast(2),a=canvas();drawRiftAttack(a.c,e);assert.ok(a.ops.some(([k])=>k==='clip'));assert.equal(a.ops.filter(([k])=>k==='rect').length,e.riftAttack.marks.filter(h=>h.shape==='line').length,'each bone lane is clipped to its own fixed warning');
});
test('Death effect hooks reject inactive or malformed attack records without drawing',()=>{
 const source=cast(1);for(const patch of [{hp:0},{archetype:'other'},{riftAttack:null},{riftAttack:{...source.riftAttack,age:NaN}},{riftAttack:{...source.riftAttack,age:source.riftAttack.duration}},{riftAttack:{...source.riftAttack,style:'other'}},{riftAttack:{...source.riftAttack,x:Infinity}}]){const a=canvas();assert.equal(drawDeathRiftAttack(a.c,{...source,...patch}),false);assert.equal(a.ops.length,0);}
});
