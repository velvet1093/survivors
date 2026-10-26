import test from 'node:test';import assert from 'node:assert/strict';
import {yukiPixels} from '../src/yuki-art.js';
import {GARUDA_COLORS,garudaGeometry,paintGaruda} from '../src/garuda-art.js';
import {itemPixels} from '../src/pixel-items.js';
import {raster} from '../src/pixel-characters.js';
const count=(pixels,color)=>pixels.filter(c=>c===color).length;
const region=(pixels,x,y,w,h)=>Array.from({length:h},(_,dy)=>pixels.slice((y+dy)*56+x,(y+dy)*56+x+w)).flat();
test('Yuki reference outfits have distinct silhouettes, clothing palettes and animated expressions',()=>{
 const base=yukiPixels(),uniform=yukiPixels({skin:'midnight'});assert.ok(base.filter(Boolean).length>600);assert.ok(uniform.filter(Boolean).length>600);
 assert.ok(count(region(base,16,48,26,18),'#a85567')>35,'red baggy trousers are visible');assert.ok(count(region(uniform,16,48,26,18),'#8295a6')>35,'blue-gray uniform trousers are visible');
 assert.ok(count(region(base,20,43,16,5),'#ecc9b0')>12,'crop top leaves a natural midriff');assert.ok(count(region(uniform,20,43,16,5),'#444456')>12,'uniform covers the midriff');
 assert.notDeepEqual(yukiPixels({blink:true}),base);assert.notDeepEqual(yukiPixels({expression:'hurt'}),base);assert.notDeepEqual(yukiPixels({attack:true}),base);assert.notDeepEqual(yukiPixels({moving:true,frame:1}),yukiPixels({moving:true,frame:3}));
});
test('Garuda flight art and icons retain the skeletal blades and red eye at small sizes',()=>{
 const r=raster();paintGaruda(r,{x:30,y:35,scale:.7});for(const color of [GARUDA_COLORS.bone,GARUDA_COLORS.blade,GARUDA_COLORS.eye])assert.ok(count(r.pixels,color)>0);
 const geometry=garudaGeometry(0,true),animated=garudaGeometry(.7,false);assert.notDeepEqual(geometry,animated);assert.deepEqual(garudaGeometry(1,true),garudaGeometry(5,true),'reduced-motion pose remains steady');
 for(const id of ['garuda','starcrusher']){const pixels=itemPixels(id);assert.ok(count(pixels,'#d5d5c6')>0);assert.ok(count(pixels,'#8293b4')>0);assert.ok(count(pixels,'#d56b69')>0);}
 assert.notDeepEqual(itemPixels('garuda'),itemPixels('starcrusher'));
});
