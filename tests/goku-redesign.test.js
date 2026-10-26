import test from 'node:test';import assert from 'node:assert/strict';
import {gokuPixels,GOKU_HAIR,GOKU_COLORS as C} from '../src/goku-art.js';
const colors=p=>new Set(p.filter(Boolean));
const region=(p,x,y,w,h)=>Array.from({length:h},(_,dy)=>p.slice((y+dy)*56+x,(y+dy)*56+x+w)).flat();
const count=(p,cs)=>p.filter(c=>cs.includes(c)).length;
test('Goku has black spikes, the orange gi over a navy undershirt, wristbands, belt and blue boots',()=>{
 const p=gokuPixels();assert.equal(p.length,56*76);assert.ok(p.filter(Boolean).length>850);
 for(const c of GOKU_HAIR.base)assert.ok(colors(p).has(c));for(const c of [C.gi,C.navy,C.red])assert.ok(colors(p).has(c));
 assert.ok(count(region(p,2,0,52,28),GOKU_HAIR.base)>250,'large spiky hair mass');
 assert.notDeepEqual(p,gokuPixels({blink:true}));assert.notDeepEqual(p,gokuPixels({expression:'hurt'}));assert.notDeepEqual(p,gokuPixels({expression:'focused'}));
});
test('all Saiyan stages change only hair and eyes, with an SS3 mane and Blue hair',()=>{
 const base=gokuPixels(),ss=gokuPixels({form:1}),ss2=gokuPixels({form:2}),ss3=gokuPixels({form:3}),blue=gokuPixels({form:4});assert.deepEqual(ss,gokuPixels({skin:'supersaiyan'}));
 for(const p of [ss,ss2,ss3])for(const c of GOKU_HAIR.gold)assert.ok(colors(p).has(c));for(const c of GOKU_HAIR.blue)assert.ok(colors(blue).has(c));for(const p of [base,ss,ss2,ss3,blue])assert.ok(colors(p).has(C.gi));
 assert.notDeepEqual(ss,ss2);assert.notDeepEqual(ss2,ss3);assert.notDeepEqual(blue,base);
 assert.ok(count(region(ss3,10,32,37,22),GOKU_HAIR.gold)>count(region(ss,10,32,37,22),GOKU_HAIR.gold)+30,'SS3 keeps a long mane');
});
test('Goku walks, gathers ki, throws and attacks with separately articulated arms in every outfit',()=>{
 for(const skin of ['default','casual','pajamas','swimsuit']){
  const idle=gokuPixels({skin});assert.notDeepEqual(idle,gokuPixels({skin,moving:true,frame:1}));assert.notDeepEqual(gokuPixels({skin,moving:true,frame:1}),gokuPixels({skin,moving:true,frame:3}));
  const gather=gokuPixels({skin,pose:'gather'}),throwing=gokuPixels({skin,pose:'throw'}),attack=gokuPixels({skin,attack:true});for(const p of [gather,throwing,attack])assert.notDeepEqual(idle,p);assert.notDeepEqual(gather,throwing);assert.notDeepEqual(throwing,attack);
 }
 assert.deepEqual(gokuPixels({frame:5,moving:true}),gokuPixels({frame:1,moving:true}));
});
