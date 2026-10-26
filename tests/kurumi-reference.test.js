import test from 'node:test';import assert from 'node:assert/strict';
import {kurumiPixels,KURUMI_COLORS as K,KURUMI_OUTFIT_IDS} from '../src/kurumi-art.js';
import {SKINS} from '../src/skins.js';
const region=(p,x,y,w,h)=>Array.from({length:h},(_,dy)=>p.slice((y+dy)*56+x,(y+dy)*56+x+w)).flat();
const colors=p=>new Set(p.filter(Boolean)),count=(p,...cs)=>p.filter(x=>cs.includes(x)).length;
const hair=p=>count(p,K.hair,K.shade,K.light,K.sheen);
test('every Kurumi skin has its own redrawn outfit and silhouette',()=>{
 assert.deepEqual([...KURUMI_OUTFIT_IDS].sort(),SKINS.kurumi.map(s=>s.id).sort(),'each listed skin has a dedicated design');
 const arts=KURUMI_OUTFIT_IDS.map(skin=>kurumiPixels({skin}));
 for(const p of arts){assert.equal(p.length,56*76);assert.ok(p.filter(Boolean).length>900);assert.ok(colors(p).size>=15);assert.ok(p.every(c=>c===null||/^#[0-9a-f]{6}$/.test(c)));}
 assert.equal(new Set(arts.map(p=>JSON.stringify(p))).size,arts.length);
});
test('Astral Dress keeps the flared uneven twin tails, red dress and golden clock eye',()=>{
 const p=kurumiPixels();
 assert.ok(hair(region(p,4,14,14,46))>200,'long left tail flares past the shoulder');
 assert.ok(hair(region(p,38,14,14,40))>150,'shorter right tail');
 assert.ok(hair(region(p,4,14,14,46))>hair(region(p,38,14,14,40)),'tails are deliberately uneven');
 assert.ok(count(region(p,14,44,28,20),K.red)>60,'red tiered skirt');
 assert.ok(count(region(p,30,24,7,7),K.gold,'#9c7334')>=4,'clock eye on her left side');
 assert.ok(count(region(p,20,24,7,7),K.iris)>=2,'red right eye');
});
test('gothic dress hides the clock eye under a small eyepatch; school and Midnight Rose hide it under the fringe',()=>{
 for(const options of [{},{moving:true,frame:1,expression:'focused'},{moving:true,frame:3,blink:true},{expression:'hurt'},{attack:true},{pose:'clock'}]){
  const p=kurumiPixels({skin:'gothic',...options}),y=options.moving?-(options.frame%2):0,area=region(p,30,22+y,9,10);
  assert.ok(count(area,K.patch)>0&&count(area,K.patch)<=10,'only a small patch edge peeks below the fringe');
  assert.ok(!area.includes(K.gold),'gold eye stays hidden');
 }
 assert.ok(count(region(kurumiPixels({skin:'gothic'}),10,10,12,10),'#b94e64')>4,'loose hair has a red rose ornament');
 for(const skin of ['crimson','school']){const p=kurumiPixels({skin});assert.ok(!region(p,30,22,9,10).includes(K.gold));assert.ok(hair(region(p,30,22,9,10))>40,'long fringe covers her left eye');}
});
test('every Kurumi skin keeps animated eyes, hair, clothing and a readable flintlock attack',()=>{
 for(const skin of KURUMI_OUTFIT_IDS){const still=kurumiPixels({skin});assert.notDeepEqual(still,kurumiPixels({skin,blink:true}));assert.notDeepEqual(still,kurumiPixels({skin,expression:'hurt'}));assert.notDeepEqual(still,kurumiPixels({skin,moving:true,frame:1}));assert.notDeepEqual(kurumiPixels({skin,moving:true,frame:1}),kurumiPixels({skin,moving:true,frame:3}));const cast=kurumiPixels({skin,attack:true});assert.notDeepEqual(still,cast);assert.ok(count(region(cast,42,38,14,8),'#3d3441','#6c6070')>=8,skin+' flintlock barrel points away from her hand');assert.deepEqual(kurumiPixels({skin,pose:'clock'}),kurumiPixels({skin,attack:true,expression:'ultimate'}));}
});
