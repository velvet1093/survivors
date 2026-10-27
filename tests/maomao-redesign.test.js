import test from 'node:test';import assert from 'node:assert/strict';
import {characterPixels} from '../src/pixel-characters.js';
import {icon,SPECIAL_ICONS} from '../src/icons.js';
import {MAOMAO_ICON_IDS} from '../src/maomao-icons.js';
import {drawMaomaoEffect,drawPoisonPool,drawPoisonVial} from '../src/maomao-effects.js';
const LOOKS=['default','dancer','spring','palace'];
test('Maomao’s four outfits are distinct and animate',()=>{
 assert.equal(new Set(LOOKS.map(skin=>JSON.stringify(characterPixels('maomao',{skin})))).size,4);
 for(const skin of LOOKS){const idle=characterPixels('maomao',{skin});assert.notDeepEqual(characterPixels('maomao',{skin,attack:true}),idle,skin+' throw');assert.notDeepEqual(characterPixels('maomao',{skin,pose:'brew'}),idle,skin+' brew');assert.notDeepEqual(characterPixels('maomao',{skin,moving:true,frame:1}),idle,skin+' walk');}
 // Her violet eyes and freckles survive in every outfit.
 for(const skin of LOOKS){const px=characterPixels('maomao',{skin});assert.ok(px.includes('#7a72c8'));assert.ok(px.includes('#d89a84'));}
});
test('Maomao’s items and ultimate use her new icons and effects',()=>{
 assert.equal(SPECIAL_ICONS.maomao,'panaceagarden');
 for(const id of MAOMAO_ICON_IDS)assert.match(icon(id),new RegExp('data-pixel-icon="'+id+'"'));
 assert.equal(new Set(MAOMAO_ICON_IDS.map(id=>icon(id))).size,MAOMAO_ICON_IDS.length);
 const c=new Proxy({},{get:(t,k)=>k in t?t[k]:()=>({}),set:(t,k,v)=>{t[k]=v;return true;}});
 assert.ok(drawMaomaoEffect(c,{type:'vial-shatter',x:0,y:0,r:40},.5));assert.equal(drawMaomaoEffect(c,{type:'nova'},.5),false);
 for(const f of [{},{fused:true},{panacea:true}])drawPoisonPool(c,{x:0,y:0,r:50,age:1,life:2,...f});drawPoisonVial(c,{age:.2});
});
test('every Maomao outfit, including off-duty ones, shares her face and has its own design',async()=>{
 const {SKINS}=await import('../src/skins.js');const ids=SKINS.maomao.map(s=>s.id);assert.equal(ids.length,9);
 assert.equal(new Set(ids.map(skin=>JSON.stringify(characterPixels('maomao',{skin})))).size,ids.length);
 for(const skin of ids){const px=characterPixels('maomao',{skin});assert.ok(px.includes('#7a72c8'),skin+' violet eyes');assert.ok(px.includes('#d89a84'),skin+' freckles');assert.notDeepEqual(characterPixels('maomao',{skin,attack:true}),px,skin+' throw');}
});
