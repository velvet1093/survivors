import test from 'node:test';import assert from 'node:assert/strict';
import {rimuruPixels,RIMURU_COLORS} from '../src/rimuru-art.js';
const count=(pixels,color)=>pixels.filter(c=>c===color).length,region=(pixels,x,y,w,h)=>Array.from({length:h},(_,dy)=>pixels.slice((y+dy)*56+x,(y+dy)*56+x+w)).flat();
test('Rimuru has a compact blue fringe, small gold eyes and a scarf; the Demon Lord coat has a distinct cut',()=>{
 const base=rimuruPixels(),lord=rimuruPixels({skin:'demonlord'});assert.equal(base.length,56*76);assert.ok(base.filter(Boolean).length>700);assert.ok(count(base,RIMURU_COLORS.hair)>100);assert.ok(count(region(base,20,25,18,6),RIMURU_COLORS.gold)>=4);assert.ok(count(base,RIMURU_COLORS.scarf)>30);assert.ok(count(lord,RIMURU_COLORS.gold)>20);assert.notDeepEqual(base,lord);assert.notDeepEqual(region(base,14,48,29,18),region(lord,14,48,29,18));
});
test('Rimuru sprite retains facial expressions, spell pose and articulated walk frames',()=>{
 const idle=rimuruPixels();for(const options of [{blink:true},{expression:'hurt'},{expression:'focused'},{attack:true},{moving:true,frame:1}])assert.notDeepEqual(rimuruPixels(options),idle);assert.notDeepEqual(rimuruPixels({moving:true,frame:1}),rimuruPixels({moving:true,frame:3}));assert.ok(count(rimuruPixels({attack:true}),'#7dc6e5')>0);
});
test('Gluttony has a recognizably blue slime body with simple eyes, distinct squish frames and blink',()=>{
 const base=rimuruPixels({pose:'predator'});assert.notDeepEqual(base,rimuruPixels());assert.ok(count(base,'#73bedb')>200);assert.ok(count(region(base,16,55,24,7),RIMURU_COLORS.ink)>6);assert.equal(count(base,RIMURU_COLORS.gold),0);assert.notDeepEqual(base,rimuruPixels({pose:'predator',blink:true}));assert.notDeepEqual(rimuruPixels({pose:'predator',moving:true,frame:1}),rimuruPixels({pose:'predator',moving:true,frame:3}));assert.deepEqual(rimuruPixels({form:'slime'}),base);
});
