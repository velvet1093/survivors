import test from 'node:test';import assert from 'node:assert/strict';
import {characterPixels} from '../src/pixel-characters.js';
import {SKINS} from '../src/skins.js';
test('Eren’s four outfits are distinct, keep their Titan form, and animate',()=>{
 const looks=['default','cloak','yeagerist','infiltrator'];assert.deepEqual(SKINS.eren.slice(0,4).map(s=>s.id),looks);
 assert.equal(new Set(looks.map(skin=>JSON.stringify(characterPixels('eren',{skin})))).size,4);
 for(const skin of looks){const idle=characterPixels('eren',{skin});assert.notDeepEqual(characterPixels('eren',{skin,attack:true}),idle,skin+' attack pose');assert.notDeepEqual(characterPixels('eren',{skin,moving:true,frame:1}),idle,skin+' walk');assert.notDeepEqual(characterPixels('eren',{skin,form:1}),idle,skin+' titan');}
 // The infiltrator leans on a wooden crutch that reaches the ground.
 const inf=characterPixels('eren',{skin:'infiltrator'});assert.ok([69,70,71].some(y=>inf.slice(y*56,y*56+16).includes('#8a6440')));
});
test('Eren’s items and ultimate use his own pixel icons',async()=>{
 const {icon,SPECIAL_ICONS}=await import('../src/icons.js'),{EREN_ICON_IDS}=await import('../src/eren-icons.js');
 assert.equal(SPECIAL_ICONS.eren,'titanshift');
 for(const id of EREN_ICON_IDS)assert.match(icon(id),new RegExp('data-pixel-icon="'+id+'"'));
 assert.equal(new Set(EREN_ICON_IDS.map(id=>icon(id))).size,EREN_ICON_IDS.length);
});
