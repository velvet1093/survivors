import test from 'node:test';import assert from 'node:assert/strict';
import {characterPixels} from '../src/pixel-characters.js';
import {SKINS} from '../src/skins.js';
import {icon,SPECIAL_ICONS} from '../src/icons.js';
import {MADOKA_ICON_IDS} from '../src/madoka-icons.js';
import {drawMadokaEffect,drawRoseArrow,drawLawWings,drawLawOfCycles} from '../src/madoka-effects.js';
test('every Madoka outfit has its own design and animates',()=>{
 const ids=SKINS.madoka.map(s=>s.id);assert.equal(ids.length,8);
 assert.equal(new Set(ids.map(skin=>JSON.stringify(characterPixels('madoka',{skin})))).size,ids.length);
 for(const skin of ids){const idle=characterPixels('madoka',{skin});for(const o of [{attack:true},{pose:'ascend'},{blink:true},{moving:true,frame:1}])assert.notDeepEqual(characterPixels('madoka',{skin,...o}),idle,skin+' '+JSON.stringify(o));}
 // Pink eyes everywhere except the golden-eyed goddess.
 assert.ok(characterPixels('madoka').includes('#e0508a'));assert.ok(characterPixels('madoka',{skin:'goddess'}).includes('#f0c040'));
});
test('Madoka’s weapon and ultimate use the new icons and light effects',()=>{
 assert.equal(SPECIAL_ICONS.madoka,'lawofcycles');for(const id of MADOKA_ICON_IDS)assert.match(icon(id),new RegExp('data-pixel-icon="'+id+'"'));
 const c=new Proxy({},{get:(t,k)=>k in t?t[k]:()=>({}),set:(t,k,v)=>{t[k]=v;return true;}});
 assert.ok(drawMadokaEffect(c,{type:'rose-bloom',x:0,y:0,r:30},.5));assert.equal(drawMadokaEffect(c,{type:'nova'},.5),false);
 drawRoseArrow(c,{age:.2});drawRoseArrow(c,{age:.2,fused:true});drawLawWings(c,0,0,1,1);const g={p:{x:0,y:0},ultimate:{age:1}};drawLawOfCycles(c,g,'under');drawLawOfCycles(c,g,'over');
});
