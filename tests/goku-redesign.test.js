import test from 'node:test';import assert from 'node:assert/strict';
import {gokuPixels,GOKU_HAIR} from '../src/goku-art.js';
const colors=p=>new Set(p.filter(Boolean));
const region=(p,x,y,w,h)=>Array.from({length:h},(_,dy)=>p.slice((y+dy)*56+x,(y+dy)*56+x+w)).flat();
test('reference Goku has friendly open anime eyes, a visible grin, bare arms and the orange/blue gi',()=>{
 const p=gokuPixels(),focused=gokuPixels({expression:'focused'});assert.equal(p.length,56*76);assert.ok(p.filter(Boolean).length>850);for(const c of GOKU_HAIR.base)assert.ok(colors(p).has(c));for(const c of ['#f1a14e','#294b79','#bd5b5b'])assert.ok(colors(p).has(c));
 const eyes=region(p,19,25,19,7),focusedEyes=region(focused,19,25,19,7);assert.ok(eyes.filter(c=>c==='#fff4dc').length>focusedEyes.filter(c=>c==='#fff4dc').length,'neutral eyes open wider than the combat stare');assert.ok(region(p,26,34,6,2).includes('#fff4dc'),'neutral mouth has the reference grin');assert.ok(region(p,26,27,5,7).includes('#ffdfb8'),'skin separates both eyes');
 assert.notDeepEqual(p,gokuPixels({blink:true}));assert.notDeepEqual(p,gokuPixels({expression:'hurt'}));assert.notDeepEqual(p,focused);assert.ok(region(p,12,39,6,8).includes('#edbd96'),'sleeveless upper arms stay visible');
});
test('all Saiyan stages retain the reference face and outfit while matching saved skin/form palettes',()=>{
 const base=gokuPixels(),ss=gokuPixels({form:1}),ss2=gokuPixels({form:2}),ss3=gokuPixels({form:3}),blue=gokuPixels({form:4});assert.deepEqual(ss,gokuPixels({skin:'supersaiyan'}));for(const p of [ss,ss2,ss3])for(const c of GOKU_HAIR.gold)assert.ok(colors(p).has(c));for(const c of GOKU_HAIR.blue)assert.ok(colors(blue).has(c));for(const p of [base,ss,ss2,ss3,blue]){assert.ok(colors(p).has('#f1a14e'));assert.ok(colors(p).has('#fff4dc'));}
 assert.notDeepEqual(ss,ss2);assert.notDeepEqual(ss2,ss3);assert.ok(region(ss3,10,32,37,18).filter(c=>GOKU_HAIR.gold.includes(c)).length>region(ss,10,32,37,18).filter(c=>GOKU_HAIR.gold.includes(c)).length+30,'SS3 keeps a long mane');assert.notDeepEqual(blue,base);
});
test('Goku walks, gathers ki, throws and attacks with separately articulated bare arms',()=>{
 const idle=gokuPixels();assert.notDeepEqual(idle,gokuPixels({moving:true,frame:1}));assert.notDeepEqual(gokuPixels({moving:true,frame:1}),gokuPixels({moving:true,frame:3}));const gather=gokuPixels({pose:'gather'}),throwing=gokuPixels({pose:'throw'}),attack=gokuPixels({attack:true});for(const p of [gather,throwing,attack])assert.notDeepEqual(idle,p);assert.notDeepEqual(gather,throwing);assert.notDeepEqual(throwing,attack);assert.deepEqual(gokuPixels({frame:5,moving:true}),gokuPixels({frame:1,moving:true}));
});
