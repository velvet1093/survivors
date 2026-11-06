import test from 'node:test';import assert from 'node:assert/strict';
import {characterPixels} from '../src/pixel-characters.js';
import {FRIEREN_ART as F} from '../src/frieren-art.js';
import {frierenIconPixels,FRIEREN_ICON_IDS} from '../src/frieren-icons.js';
import {rimuruIconPixels,RIMURU_ICON_IDS} from '../src/rimuru-icons.js';
import {icon} from '../src/icons.js';import {PIXEL_ITEM_IDS} from '../src/pixel-items.js';
const region=(p,x,y,w,h)=>Array.from({length:h},(_,dy)=>p.slice((y+dy)*56+x,(y+dy)*56+x+w)).flat();
const count=(p,...cs)=>p.filter(c=>cs.includes(c)).length;
test('Frieren wears the gold-trimmed capelet, black tights and brown boots, or the black-and-white maid dress',()=>{
 const mage=characterPixels('frieren'),maid=characterPixels('frieren',{skin:'maid'});
 assert.ok(count(region(mage,15,36,26,10),F.gold,F.goldDark)>20,'gold-trimmed capelet');
 assert.ok(count(region(mage,20,55,16,8),F.tights)>20,'black tights');
 assert.ok(count(region(mage,20,62,16,9),F.boot)>40,'brown boots');
 assert.ok(count(region(mage,40,4,14,14),F.orb,F.gold,F.goldLight,F.goldDark)>25,'crescent staff head with its red orb');
 assert.ok(count(region(maid,15,47,26,15),F.maid)>60&&count(region(maid,19,40,18,20),'#fbfaf6')>80,'black dress under a white apron');
 assert.ok(count(region(maid,20,62,16,6),'#eef0f4')>15,'white tights');
 for(const skin of ['default','maid'])for(const o of [{blink:true},{expression:'hurt'},{attack:true},{moving:true,frame:1}])assert.notDeepEqual(characterPixels('frieren',{skin,...o}),characterPixels('frieren',{skin}));
});
test('Rimuru wears the long blue coat with a streaming scarf, or the Demon Lord coat with fur collar and katana',()=>{
 const t=characterPixels('rimuru'),d=characterPixels('rimuru',{skin:'demonlord'});
 assert.ok(count(region(t,2,36,18,18),'#d7cdb2')>20,'scarf ends stream out behind him');
 assert.ok(count(region(t,15,38,26,24),'#486b97')>150,'long blue coat');
 assert.ok(count(region(d,18,36,20,7),'#14161e')>25,'black fur collar');
 assert.ok(count(region(d,36,40,18,16),'#0c0d10','#2e3038')>12,'sheathed katana');
 assert.ok(count(region(d,2,42,18,26),'#1e2230','#12141c')>30,'trailing coat tail');
});
test('Unveiled Shiraori carries her red scythe in a white dress with silver knee boots',()=>{
 const u=characterPixels('shiraori',{skin:'unveiled'}),hood=characterPixels('shiraori');
 assert.ok(count(region(u,0,6,20,20),'#d8283a','#7a1020')>25,'red scythe blade');
 assert.ok(count(region(u,20,58,16,13),'#c8ccd8','#f0f2f6','#8a8e9c')>50,'silver knee boots');
 assert.ok(count(hood,'#f4f0f4','#ffffff')>400,'the hooded robe is white');
 assert.notDeepEqual(u,hood);
});
test('Frieren and Rimuru items use their redrawn pixel icons',()=>{
 for(const [ids,px]of [[FRIEREN_ICON_IDS,frierenIconPixels],[RIMURU_ICON_IDS,rimuruIconPixels]])for(const id of ids){const p=px(id);assert.equal(p.length,1024);assert.ok(p.filter(Boolean).length>250,id);assert.ok(icon(id).includes('<rect'),id);assert.ok(!PIXEL_ITEM_IDS.includes(id),id);}
 assert.equal(new Set([...FRIEREN_ICON_IDS.map(frierenIconPixels),...RIMURU_ICON_IDS.map(rimuruIconPixels)].map(p=>JSON.stringify(p))).size,6);
});
