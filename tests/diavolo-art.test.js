import test from 'node:test';import assert from 'node:assert/strict';
import {diavoloPixels,kingCrimsonPixels,CRIMSON_SCALE,DIAVOLO_COLORS as D} from '../src/diavolo-art.js';
const colors=p=>new Set(p.filter(Boolean)),region=(p,x,y,w,h)=>Array.from({length:h},(_,dy)=>p.slice((y+dy)*56+x,(y+dy)*56+x+w)).flat(),count=(p,color)=>p.filter(c=>c===color).length;
test('Diavolo has spotted waist-length pink hair, green eyes and a sheer mesh shirt distinct from Doppio',()=>{
 const original=diavoloPixels(),doppio=diavoloPixels({skin:'doppio'});for(const p of [original,doppio]){assert.equal(p.length,56*76);assert.ok(p.filter(Boolean).length>700);assert.ok(colors(p).size>=15);}assert.notDeepEqual(original,doppio);
 const hair=p=>count(p,D.hair)+count(p,D.shade)+count(p,D.light);
 assert.ok(count(original,D.spot)>25,'dark leopard spots remain visible');assert.ok(count(region(original,17,36,22,16),D.mesh)+count(region(original,17,36,22,16),'#b88a90')>40,'mesh lattice crosses chest');assert.ok(colors(original).has(D.green));
 assert.ok(hair(region(original,12,40,8,16))>20,'long hair falls past his shoulders');assert.equal(hair(region(doppio,12,40,8,16)),0,'Doppio has a short crop');
 assert.ok(count(region(doppio,17,36,22,16),D.lilac)>50,'Doppio has a lilac sweater');assert.ok(count(doppio,D.khaki)>40,'and khaki trousers');
});
test('both human designs preserve walk, attack, blink and hurt/focused poses without a tiny embedded Stand',()=>{
 for(const skin of ['default','doppio']){const still=diavoloPixels({skin});assert.notDeepEqual(still,diavoloPixels({skin,moving:true,frame:1}));assert.notDeepEqual(diavoloPixels({skin,moving:true,frame:1}),diavoloPixels({skin,moving:true,frame:3}));assert.notDeepEqual(still,diavoloPixels({skin,attack:true}));assert.notDeepEqual(still,diavoloPixels({skin,blink:true}));assert.notDeepEqual(still,diavoloPixels({skin,expression:'hurt'}));assert.notDeepEqual(still,diavoloPixels({skin,expression:'focused'}));assert.ok(!colors(diavoloPixels({skin,attack:true})).has('#b54f6b'),'full runtime Stand is rendered separately');}
});
test('larger King Crimson has red muscular armor, pale cross lattice, Epitaph eyes and articulated lunge frames',()=>{
 const still=kingCrimsonPixels(),punch=kingCrimsonPixels({attack:true});assert.equal(still.length,56*76);assert.ok(still.filter(Boolean).length>1000);assert.ok(CRIMSON_SCALE>=1.15);assert.ok(colors(still).has('#b54f6b'));assert.ok(colors(still).has('#e8e6d3'));assert.ok(colors(still).has('#afcd79'));assert.ok(count(region(still,16,30,26,24),'#e8e6d3')>55,'cross lattice reads across the chest');assert.ok(count(region(still,24,3,11,11),'#afcd79')>=2,'Epitaph has separate green eyes');assert.notDeepEqual(still,punch);assert.notDeepEqual(punch,kingCrimsonPixels({frame:1,attack:true}));assert.notDeepEqual(still,kingCrimsonPixels({frame:1}));
});
