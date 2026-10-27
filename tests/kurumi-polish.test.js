import test from 'node:test';import assert from 'node:assert/strict';
import {kurumiPixels,KURUMI_COLORS as K,WHITE_QUEEN_COLORS as Q} from '../src/kurumi-art.js';
import {kurumiIconPixels,KURUMI_ICON_IDS} from '../src/kurumi-icons.js';
import {icon,SPECIAL_ICONS} from '../src/icons.js';
import {PIXEL_ITEM_IDS} from '../src/pixel-items.js';
const region=(p,x,y,w,h)=>Array.from({length:h},(_,dy)=>p.slice((y+dy)*56+x,(y+dy)*56+x+w)).flat();
const count=(p,...cs)=>p.filter(c=>cs.includes(c)).length;
test('Astral Dress layers red and black ruffle tiers over black platform boots',()=>{
 const p=kurumiPixels();
 const rows=[50,53,57,60].map(y=>count(region(p,14,y,28,1),'#1b1419'));
 assert.ok(rows.some(n=>n>12)&&rows.some(n=>n<8),'black and red tiers alternate down the skirt');
 assert.ok(count(region(p,20,60,18,11),'#1b1419')>40,'tall black boots below the hem');
 assert.ok(count(region(p,20,67,18,3),'#a3332e')>=8,'red-trimmed platform soles');
});
test('Gothic, school and White Queen follow their reference outfits',()=>{
 const g=kurumiPixels({skin:'gothic'});
 assert.ok(count(region(g,20,62,16,5),'#1d1824','#3a3346')>15,'black tights');
 assert.ok(count(region(g,22,42,12,7),'#272936')>30,'black corset vest over the white blouse');
 const s=kurumiPixels({skin:'school'});
 assert.ok(count(region(s,16,48,24,12),'#3d5a9a','#2b4174','#5a78b8')>150,'blue pleated skirt');
 assert.ok(count(region(s,20,40,16,10),'#1e1b26')>40,'black blazer');
 assert.ok(count(region(s,8,50,12,18),K.hair,K.shade,K.light,K.sheen)>40&&count(region(s,38,50,12,18),K.hair,K.shade,K.light,K.sheen)>40,'long low twin tails reach below the waist on both sides');
 const q=kurumiPixels({skin:'whitequeen'});
 assert.ok(count(region(q,2,30,10,30),Q.hair,Q.hairShade,Q.hairLight)>60&&count(region(q,44,30,10,30),Q.hair,Q.hairShade,Q.hairLight)>60,'silver twin tails');
 assert.ok(count(region(q,19,38,18,9),Q.trim)>12,'a great bow outlined across the breast');
 assert.ok(count(region(q,14,0,28,6),Q.silver,Q.lace)<40,'a small tiara rather than a tall crown');
});
test('Kurumi items use the redrawn pixel icons and drop the generic art',()=>{
 for(const id of KURUMI_ICON_IDS){const p=kurumiIconPixels(id);assert.equal(p.length,1024);assert.ok(p.filter(Boolean).length>300,id);assert.ok(icon(id).includes('<rect'),id);assert.ok(!PIXEL_ITEM_IDS.includes(id),id);}
 assert.equal(new Set(KURUMI_ICON_IDS.map(id=>JSON.stringify(kurumiIconPixels(id)))).size,4);
 assert.equal(SPECIAL_ICONS.kurumi,'clockdomain');assert.equal(kurumiIconPixels('rosebow'),null);
});
