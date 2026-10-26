import test from 'node:test';
import assert from 'node:assert/strict';
import {CHARACTERS} from '../src/game.js';
import {createRun} from '../src/engine.js';
import {characterPixels} from '../src/pixel-characters.js';
import {referenceOutfitPixels} from '../src/character-reference-skins.js';
import {SKINS} from '../src/skins.js';
import {newProfile,sanitizeProfile} from '../src/progression.js';
import {saveRun,loadRun} from '../src/run-save.js';

const outfits=[['naruto','hokage','seal'],['madoka','school','hope'],['esdeath','sweater','ice'],['esdeath','blackdress','ice']];
const memory=()=>({value:null,setItem(k,v){this.value=v;},getItem(){return this.value;},removeItem(){this.value=null;}});
test('reference outfits use independent animated art through the normal character renderer',()=>{
 const designs=[];
 for(const [id,skin,pose]of outfits){
  assert.ok(SKINS[id].some(s=>s.id===skin));const still=characterPixels(id,{skin});
  assert.deepEqual(still,referenceOutfitPixels(id,{skin}));assert.notDeepEqual(still,characterPixels(id));assert.equal(still.length,56*76);assert.ok(still.filter(Boolean).length>700);designs.push(JSON.stringify(still));
  for(const options of [{moving:true,frame:1},{attack:true},{pose},{blink:true},{expression:'hurt'}])assert.notDeepEqual(still,characterPixels(id,{skin,...options}),`${id}/${skin} keeps ${JSON.stringify(options)} animation`);
  assert.notDeepEqual(characterPixels(id,{skin,moving:true,frame:1}),characterPixels(id,{skin,moving:true,frame:3}));
 }
 assert.equal(new Set(designs).size,outfits.length);assert.equal(referenceOutfitPixels('naruto',{skin:'sage'}),null);assert.equal(referenceOutfitPixels('madoka',{skin:'goddess'}),null);assert.equal(referenceOutfitPixels('esdeath',{skin:'winter'}),null);
});

test('new cosmetic selections survive profile cleanup and run checkpoints without changing stats or old choices',()=>{
 for(const [id,skin]of outfits){
  const profile=newProfile();profile.skins[id]=skin;profile.coins=321;profile.characters[id].xp=45;
  const cleaned=sanitizeProfile(profile);assert.equal(cleaned.skins[id],skin);assert.equal(cleaned.coins,321);assert.equal(cleaned.characters[id].xp,45);
  const character=CHARACTERS.find(c=>c.id===id),g=createRun(character,0,cleaned),base=createRun(character);assert.equal(g.p.skin,skin);
  for(const key of ['damage','maxHp','move','cooldown','regen'])assert.equal(g.p[key],base.p[key]);
  const storage=memory();assert.ok(saveRun(g,storage));assert.equal(loadRun(storage).p.skin,skin);
 }
 const legacy=sanitizeProfile({skins:{naruto:'sage',madoka:'goddess',esdeath:'winter'}});assert.equal(legacy.skins.naruto,'sage');assert.equal(legacy.skins.madoka,'goddess');assert.equal(legacy.skins.esdeath,'winter');
});
