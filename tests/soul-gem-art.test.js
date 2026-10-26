import test from 'node:test';
import assert from 'node:assert/strict';
import {SOUL_GEM_ART_IDS,SOUL_GEM_COLORS,soulGemPixels,soulGemIcon,drawSalvationProjectile,drawSalvationEffect} from '../src/soul-gem-art.js';
import {icon} from '../src/icons.js';
import {drawPlayerProjectile} from '../src/projectiles.js';
import {bowPixels,bowPose,bowSvg} from '../src/bow.js';
import {SPRITE_WIDTH,SPRITE_HEIGHT} from '../src/pixel-characters.js';
function canvas(){let depth=0;const ops=[],c=new Proxy({globalAlpha:1,save(){depth++;ops.push(['save']);},restore(){depth--;assert.ok(depth>=0);ops.push(['restore']);}},{get(t,k){return k in t?t[k]:(...args)=>{assert.ok(args.filter(v=>typeof v==='number').every(Number.isFinite),String(k));ops.push([k,...args]);};},set(t,k,v){if(typeof v==='number')assert.ok(Number.isFinite(v),String(k));t[k]=v;ops.push(["set",k,v]);return true;}});return{c,ops,depth:()=>depth};}
const shot=(i=0,extra={})=>({type:'salvation-arrow',colorIndex:i,x:50,y:60,vx:300,vy:40,age:.4,life:1.8,max:2.5,r:7,hits:new Set([101]),...extra});

test('all five Soul Gems, their Quintet and Salvation have distinct native outlined art in the real inventory hook',()=>{
 const drawings=new Set(),silhouettes=new Set();for(const id of SOUL_GEM_ART_IDS){const p=soulGemPixels(id);assert.equal(p.length,1024);assert.ok(p.filter(Boolean).length>240,id+' readable complete silhouette');assert.ok(p.every(c=>c===null||/^#[0-9a-f]{6}$/i.test(c)));assert.ok(p.includes('#293346'));drawings.add(JSON.stringify(p));silhouettes.add(p.map(c=>c?'1':'0').join(''));assert.match(icon(id),new RegExp('data-pixel-icon="'+id+'"'));assert.match(soulGemIcon(id),/<rect /);assert.ok(!icon(id).includes('http'));}
 assert.equal(drawings.size,7);assert.ok(silhouettes.size>=6,'the gem mounts differ in outline as well as colour');assert.equal(soulGemPixels('unknown'),null);assert.equal(soulGemIcon('unknown'),null);
 const final=soulGemPixels('salvation');for(const color of SOUL_GEM_COLORS)assert.ok(final.includes(color),'each wish remains visible on the fusion bow');
});

test('Soul Gems of the Quintet keeps all five distinct wishes readable in one cached passive icon',()=>{
 const pixels=soulGemPixels('quintet'),before=[...pixels];
 for(const color of SOUL_GEM_COLORS)assert.ok(pixels.filter(c=>c===color).length>=8,'each of the five crystals has a readable coloured body');
 assert.ok(pixels.includes('#8795a3'),'the silver linked mount differs from the individual gold mounts');
 assert.match(icon('quintet'),/data-pixel-icon="quintet"/);
 assert.notDeepEqual(pixels,soulGemPixels('salvation'));for(const id of SOUL_GEM_ART_IDS.slice(0,5))assert.notDeepEqual(pixels,soulGemPixels(id));
 assert.equal(soulGemPixels('quintet'),pixels,'repeated inventory draws reuse the native cache');assert.deepEqual(pixels,before,'rendering the fusion does not modify its pixel source');
});

test('Salvation projectiles read the saved wish colour and use the real projectile hook without changing hit records',()=>{
 const distinct=new Set();for(let i=0;i<5;i++)for(const quiet of [false,true]){
  const s=shot(i),before=structuredClone(s),a=canvas();assert.equal(drawSalvationProjectile(a.c,s,{zoom:.45,reducedMotion:quiet}),true);assert.equal(a.depth(),0);assert.deepEqual(s,before);assert.ok(a.ops.length>30&&a.ops.length<700);if(!quiet)distinct.add(JSON.stringify(a.ops));const b=canvas();drawPlayerProjectile(b.c,s,{zoom:.45,reducedMotion:quiet});assert.deepEqual(a.ops,b.ops,'live hook has identical geometry');assert.deepEqual(s,before);
 }
 assert.equal(distinct.size,5);assert.equal(drawSalvationProjectile({},shot(0,{type:'other'})),false);assert.equal(drawSalvationProjectile({},shot(0,{life:0})),false);
 const a=canvas(),b=canvas();drawSalvationProjectile(a.c,shot(3));drawSalvationProjectile(b.c,shot(0,{wish:3}));assert.deepEqual(a.ops,b.ops,'wish alias is safe for persisted earlier casts');
});

test('Salvation arrows remain deterministic after checkpoints and reduced motion removes decorative movement',()=>{
 for(let i=0;i<5;i++)for(const quiet of [false,true]){const a=canvas(),b=canvas(),s=shot(i);drawSalvationProjectile(a.c,s,{reducedMotion:quiet});drawSalvationProjectile(b.c,structuredClone(s),{reducedMotion:quiet});assert.deepEqual(a.ops,b.ops);}
 const a=canvas(),b=canvas();drawSalvationProjectile(a.c,shot(0),{reducedMotion:true});drawSalvationProjectile(b.c,shot(0,{age:2.2}),{reducedMotion:true});assert.deepEqual(a.ops,b.ops);
 const d=canvas(),e=canvas();drawSalvationProjectile(d.c,shot(0));drawSalvationProjectile(e.c,shot(0,{age:1.1}));assert.notDeepEqual(d.ops,e.ops,'decorative petals move only with simulation time');
});

test('five-wish casting and impact seals are finite, bounded and read-only at every saved phase',()=>{
 for(const type of ['salvation-cast','salvation-bloom'])for(const quiet of [false,true])for(const progress of [0,.25,.8,1]){
  const e={type,x:50,y:80,r:95,life:.4,max:.6,colorIndex:2},before=structuredClone(e),a=canvas(),b=canvas();assert.equal(drawSalvationEffect(a.c,e,progress,quiet),true);drawSalvationEffect(b.c,structuredClone(e),progress,quiet);assert.deepEqual(a.ops,b.ops);assert.equal(a.depth(),0);assert.ok(a.ops.length<700);assert.deepEqual(e,before);assert.ok(!a.ops.some(([method])=>['fillRect','clearRect','shadowBlur'].includes(method)),'no screen-covering flash');
 }
 assert.equal(drawSalvationEffect({}, {type:'other'},.5),false);
});

test('the in-hand Salvation bow has a separate cache and all five gems while retaining the original aimed muzzle and pull poses',()=>{
 for(let pull=0;pull<=4;pull++){
  const base=bowPixels(pull),before=[...base],evolved=bowPixels(pull,'salvation');assert.equal(evolved.length,SPRITE_WIDTH*SPRITE_HEIGHT);assert.notDeepEqual(evolved,base);assert.deepEqual(bowPixels(pull),before,'evolved cache never replaces original bow');assert.equal(bowPixels(pull,'unknown'),base);for(const color of SOUL_GEM_COLORS)assert.ok(evolved.includes(color),'five gems on every pull frame');assert.match(bowSvg(pull,'salvation'),/rect /);
  for(const angle of [0,Math.PI/2,Math.PI,-Math.PI/2]){const p={x:30,y:50,aimAngle:angle,attackTimer:pull*.3/4};assert.deepEqual(bowPose({...p,fusions:{rosebow:'salvation'}}),bowPose({...p,fusions:{rosebow:'ultimate'}}));}
 }
});
