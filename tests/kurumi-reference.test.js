import test from 'node:test';import assert from 'node:assert/strict';
import {kurumiPixels} from '../src/kurumi-art.js';
const region=(p,x,y,w,h)=>Array.from({length:h},(_,dy)=>p.slice((y+dy)*56+x,(y+dy)*56+x+w)).flat();
const colors=p=>new Set(p.filter(Boolean)),count=(p,c)=>p.filter(x=>x===c).length;
test('Kurumi reference outfits have distinct silhouettes and colors instead of simple recolors',()=>{
 const arts=['default','gothic','crimson','school'].map(skin=>kurumiPixels({skin}));for(const p of arts){assert.equal(p.length,56*76);assert.ok(p.filter(Boolean).length>750);assert.ok(colors(p).size>=15);}assert.equal(new Set(arts.map(p=>JSON.stringify(p))).size,4);
 assert.ok(colors(arts[0]).has('#b85160'));assert.ok(colors(arts[1]).has('#f4e8e2'));assert.ok(colors(arts[2]).has('#a5658d')||colors(arts[2]).has('#95558e'));assert.ok(colors(arts[3]).has('#6866a1'));
 assert.ok(count(region(arts[2],13,61,32,9),'#353340')+count(region(arts[2],13,61,32,9),'#45404f')>35,'Victorian gown extends down to the ankles');
 assert.ok(count(region(arts[3],15,49,27,12),'#6866a1')>35,'school skin has a visible purple pleated skirt');
 const gothic=arts[1];
 assert.ok(count(region(gothic,22,41,13,11),'#141b27')+count(region(gothic,22,41,13,11),'#272936')>80,'reference skin has a fitted black corset instead of a white bodice');
 assert.ok(count(region(gothic,14,56,29,10),'#f4e8e2')+count(region(gothic,14,56,29,10),'#fff7ec')>90,'split velvet overskirt reveals a separate white layered petticoat');
 assert.ok(count(region(gothic,19,52,19,10),'#8c7c91')>20,'scalloped fold seams separate the white ruffle tiers');
 assert.ok(count(region(gothic,10,8,12,10),'#b94e64')>12,'loose hair has a red rose ornament');
 assert.ok(count(region(gothic,0,20,16,10),'#c6c7bd')>=15,'idle pose visibly raises the long flintlock');
});
test('gothic reference dress keeps a small white eyepatch almost hidden under her fringe in every pose',()=>{
 for(const options of [{},{moving:true,frame:1,expression:'focused'},{moving:true,frame:3,blink:true},{expression:'hurt'},{attack:true},{pose:'clock'}]){
  const p=kurumiPixels({skin:'gothic',...options}),y=options.moving?-(options.frame%2):0,eye=region(p,30,26+y,6,5),peek=count(eye,'#f2efed')+count(eye,'#c8c1cb');
  assert.ok(count(eye,'#f2efed')>0&&peek<=6,'only a small white patch edge peeks below the fringe');
  assert.ok(count(eye,'#252732')+count(eye,'#161c28')+count(eye,'#505065')>=20,'hair covers most of the patch area');
  assert.ok(!region(p,30,25+y,9,10).includes('#d9b45f'),'gold eye stays hidden');
  assert.ok(!region(p,30,25+y,9,10).includes('#151d28'),'old oversized black patch is absent');
  assert.ok(!region(p,19,21+y,12,6).includes('#6f6573'),'no exposed strap crosses above the visible eye');
 }
 const base=kurumiPixels();assert.ok(colors(base).has('#ba4b64'));assert.ok(colors(base).has('#d9b45f'));
 for(const skin of ['crimson','school']){const p=kurumiPixels({skin});assert.ok(!region(p,30,25,9,10).includes('#d9b45f'));assert.ok(count(region(p,30,25,9,10),'#252732')>12,'long fringe hides left eye');}
});
test('every Kurumi skin keeps animated eyes, hair, clothing and a readable flintlock attack',()=>{
 for(const skin of ['default','gothic','crimson','school']){const still=kurumiPixels({skin});assert.notDeepEqual(still,kurumiPixels({skin,blink:true}));assert.notDeepEqual(still,kurumiPixels({skin,expression:'hurt'}));assert.notDeepEqual(still,kurumiPixels({skin,moving:true,frame:1}));assert.notDeepEqual(kurumiPixels({skin,moving:true,frame:1}),kurumiPixels({skin,moving:true,frame:3}));const cast=kurumiPixels({skin,attack:true});assert.notDeepEqual(still,cast);assert.ok(count(region(cast,42,36,13,9),'#c6c7bd')+count(region(cast,42,36,13,9),'#b5bac5')>=8,'long flintlock barrel points away from her hand');assert.deepEqual(kurumiPixels({skin,pose:'clock'}),kurumiPixels({skin,attack:true,expression:'ultimate'}));}
});
