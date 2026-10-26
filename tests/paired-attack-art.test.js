import test from 'node:test';
import assert from 'node:assert/strict';
import {drawPairedProjectile,drawPairedEffect,PAIRED_PROJECTILE_TYPES,PAIRED_EFFECT_TYPES} from '../src/paired-attack-art.js';
import {drawPlayerProjectile} from '../src/projectiles.js';
function canvas(){let depth=0;const ops=[],c=new Proxy({globalAlpha:1,save(){depth++;ops.push(['save']);},restore(){depth--;assert.ok(depth>=0);ops.push(['restore']);}},{get(t,k){return k in t?t[k]:(...args)=>{assert.ok(args.filter(v=>typeof v==='number').every(Number.isFinite),String(k));ops.push([k,...args]);};},set(t,k,v){if(typeof v==='number')assert.ok(Number.isFinite(v),String(k));t[k]=v;return true;}});return{c,ops,depth:()=>depth};}
const shot=(type,extra={})=>({type,x:10,y:20,tx:620,ty:20,vx:300,vy:10,angle:0,age:.32,life:1,max:1,r:type==='dragonflame'?280:type==='wisteriagarden'?142:5,width:45,halfAngle:.42,flight:.45,bloomAge:1.2,state:'bloom',fused:['raijinrasengan','dragonroar','wisteriagarden'].includes(type),sourceWeapon:type==='wisteriagarden'?'poison':type,...extra});

test('five new shot types have distinct finite drawings and use the real projectile hook without changing combat state',()=>{
 const unique=new Set();for(const type of PAIRED_PROJECTILE_TYPES){const s=shot(type),before=JSON.stringify(s),a=canvas();assert.equal(drawPairedProjectile(a.c,s),true);assert.equal(a.depth(),0);assert.equal(JSON.stringify(s),before);assert.ok(a.ops.length>12);assert.ok(a.ops.length<600);unique.add(JSON.stringify(a.ops));const b=canvas();drawPlayerProjectile(b.c,s,{zoom:.7,area:1.2});assert.ok(b.ops.length>12);assert.equal(b.depth(),0);assert.equal(JSON.stringify(s),before);}
 assert.equal(unique.size,5);assert.equal(drawPairedProjectile({},shot('other')),false);assert.equal(drawPairedProjectile({},shot('dragonflame',{life:0})),false);
});

test('moving and fixed attacks are deterministic from saved clocks and retain calm reduced-motion geometry',()=>{
 for(const type of PAIRED_PROJECTILE_TYPES){for(const quiet of [false,true]){const s=shot(type),a=canvas(),b=canvas();drawPairedProjectile(a.c,s,{reducedMotion:quiet});drawPairedProjectile(b.c,structuredClone(s),{reducedMotion:quiet});assert.deepEqual(a.ops,b.ops,type+' checkpoint geometry');}
  const a=canvas(),b=canvas();drawPairedProjectile(a.c,shot(type),{reducedMotion:true});drawPairedProjectile(b.c,shot(type,{age:40,bloomAge:20}),{reducedMotion:true});assert.deepEqual(a.ops,b.ops,type+' static quiet pose');
 }
 const a=canvas(),b=canvas();drawPairedProjectile(a.c,shot('dragonflame'));drawPairedProjectile(b.c,shot('dragonflame',{age:.6}));assert.notDeepEqual(a.ops,b.ops,'fire moves with its simulation clock');
});

test('garden seed, blooming field and Flying Raijin marked orb stay visually different within bounded drawing work',()=>{
 const states=[shot('wisteriagarden',{state:'seed'}),shot('wisteriagarden'),shot('raijinrasengan',{state:'kunai'}),shot('raijinrasengan',{state:'marked'})],drawings=[];
 for(const s of states){const a=canvas(),before=JSON.stringify(s);assert.equal(drawPairedProjectile(a.c,s,{zoom:.45,reducedMotion:false}),true);assert.equal(a.depth(),0);assert.equal(JSON.stringify(s),before);assert.ok(a.ops.length<600);drawings.push(JSON.stringify(a.ops));}
 assert.notEqual(drawings[0],drawings[1]);assert.notEqual(drawings[2],drawings[3]);
});

test('dragon cone and roar keep their scenery within the engine’s fixed cone and breath corridor',()=>{
 const a=canvas();drawPairedProjectile(a.c,shot('dragonflame'));assert.ok(a.ops.some(([k,x,y,r,start,end])=>k==='arc'&&x===0&&y===0&&r===280&&start===-.42&&end===.42));assert.ok(a.ops.some(([k])=>k==='clip'));
 const b=canvas();drawPairedProjectile(b.c,shot('dragonroar'));assert.ok(b.ops.some(([k,x,y,w,h])=>k==='rect'&&x===0&&y===-45&&w===610&&h===90));assert.ok(b.ops.some(([k])=>k==='clip'));assert.ok(!b.ops.some(([k])=>k==='shadowBlur'),'the dragon uses solid lines, not an opaque full-screen flash');
});

test('all five paired impacts and links use finite fixed positions without mutating damage or target records',()=>{
 for(const type of PAIRED_EFFECT_TYPES)for(const quiet of [false,true])for(const progress of [0,.25,.8,1]){const e={type,x:40,y:50,r:90,life:.3,max:.45,points:[{x:0,y:0},{x:40,y:50}]},before=JSON.stringify(e),a=canvas();assert.equal(drawPairedEffect(a.c,e,progress,quiet),true);assert.equal(a.depth(),0);assert.ok(a.ops.length<500);assert.equal(JSON.stringify(e),before);const b=canvas();drawPairedEffect(b.c,structuredClone(e),progress,quiet);assert.deepEqual(a.ops,b.ops);}
 assert.equal(drawPairedEffect({}, {type:'other'},.5),false);
});
