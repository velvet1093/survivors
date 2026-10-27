import test from 'node:test';import assert from 'node:assert/strict';
import {characterPixels} from '../src/pixel-characters.js';
import {SKINS} from '../src/skins.js';
import {icon,SPECIAL_ICONS} from '../src/icons.js';
import {GOJO_ICON_IDS} from '../src/gojo-icons.js';
import {drawGojoEffect,drawBlueVortex,drawRedOrb,drawUnlimitedVoid,drawCastOrb} from '../src/gojo-effects.js';
test('every Gojo outfit has its own design with cast and domain poses',()=>{
 const ids=SKINS.gojo.map(s=>s.id);assert.equal(ids.length,6);
 assert.equal(new Set(ids.map(skin=>JSON.stringify(characterPixels('gojo',{skin})))).size,ids.length);
 for(const skin of ids){const idle=characterPixels('gojo',{skin});assert.notDeepEqual(characterPixels('gojo',{skin,attack:true}),idle,skin+' cast');assert.notDeepEqual(characterPixels('gojo',{skin,pose:'domain'}),idle,skin+' domain');assert.notDeepEqual(characterPixels('gojo',{skin,blink:true}),idle,skin+' blink');}
 // The blindfold stays on the High Collar look; Unsealed and Female Gojo show the Six Eyes.
 assert.ok(characterPixels('gojo').includes('#121216'));for(const skin of ['unsealed','female'])assert.ok(characterPixels('gojo',{skin}).includes('#5ad8ff'));
});
test('Gojo’s items and domain use the new icons and Limitless effects',()=>{
 assert.equal(SPECIAL_ICONS.gojo,'void');for(const id of GOJO_ICON_IDS)assert.match(icon(id),new RegExp('data-pixel-icon="'+id+'"'));
 assert.equal(new Set(GOJO_ICON_IDS.map(id=>icon(id))).size,GOJO_ICON_IDS.length);
 const c=new Proxy({},{get:(t,k)=>k in t?t[k]:()=>({addColorStop(){}}),set:(t,k,v)=>{t[k]=v;return true;}});
 for(const type of ['red-impact','blue-cast','void-collapse'])assert.ok(drawGojoEffect(c,{type,x:0,y:0,tx:10,ty:10,r:60},.5),type);
 assert.equal(drawGojoEffect(c,{type:'nova'},.5),false);
 drawBlueVortex(c,{x:0,y:0,r:50,age:1,life:1});drawRedOrb(c,{age:.2});drawUnlimitedVoid(c,{x:0,y:0,r:100,age:1});drawCastOrb(c,0,0,'red');
});
