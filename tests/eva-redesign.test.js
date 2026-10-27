import test from 'node:test';import assert from 'node:assert/strict';
import {characterPixels,pilotPixels} from '../src/pixel-characters.js';
import {icon,SPECIAL_ICONS} from '../src/icons.js';
import {EVA_ICON_IDS} from '../src/eva-icons.js';
import {drawEvaEffect} from '../src/eva-effects.js';
const UNITS=['default','rei','asuka','mari'];
test('each EVA unit and pilot has its own design',()=>{
 assert.equal(new Set(UNITS.map(skin=>JSON.stringify(characterPixels('shinji',{skin})))).size,4);
 assert.equal(new Set(UNITS.map(skin=>JSON.stringify(pilotPixels({skin})))).size,4);
 for(const skin of UNITS){const idle=characterPixels('shinji',{skin});assert.notDeepEqual(characterPixels('shinji',{skin,pose:'berserk'}),idle);assert.notDeepEqual(characterPixels('shinji',{skin,attack:true}),idle);}
 // Unit-01 keeps its green trim and orange collar; Unit-00 its red eye; Unit-08 its six green eyes.
 assert.ok(characterPixels('shinji').includes('#72c844'));assert.ok(characterPixels('shinji').includes('#f0a030'));
 assert.ok(characterPixels('shinji',{skin:'rei'}).includes('#ff4a3a'));assert.ok(characterPixels('shinji',{skin:'mari'}).filter(c=>c==='#7cf06c').length>=6);
});
test('Shinji’s items and ultimate use the new EVA icons and effects',()=>{
 assert.equal(SPECIAL_ICONS.shinji,'berserk');
 for(const id of EVA_ICON_IDS)assert.match(icon(id),new RegExp('data-pixel-icon="'+id+'"'));
 const c=new Proxy({},{get:(t,k)=>k in t?t[k]:()=>({}),set:(t,k,v)=>{t[k]=v;return true;}});
 for(const type of ['pallet-muzzle','eva-claw','at-burst'])assert.ok(drawEvaEffect(c,{type,x:0,y:0,r:100,angle:0},.5),type);
 assert.equal(drawEvaEffect(c,{type:'nova'},.5),false);
});
