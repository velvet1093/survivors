import test from 'node:test';
import assert from 'node:assert/strict';
import {CHARACTERS} from '../src/game.js';
import {SKINS,skinFor} from '../src/skins.js';
import {characterPixels,SPRITE_WIDTH,SPRITE_HEIGHT} from '../src/pixel-characters.js';
import {casualPixels,CASUAL_OUTFITS} from '../src/casual-art.js';
import {newProfile,sanitizeProfile,saveProfile,loadProfile} from '../src/progression.js';
import {createRun} from '../src/engine.js';

const frame=(id,extra={})=>characterPixels(id,{skin:'casual',...extra});
test('every hero has one named casual outfit with original clothing and recognizable individual artwork',()=>{
 const designs=[];
 for(const hero of CHARACTERS){
  const casual=SKINS[hero.id].filter(s=>s.id==='casual');assert.equal(casual.length,1,hero.id);
  assert.ok(casual[0].name.length>4);assert.equal(skinFor(hero.id,'casual').id,'casual');
  const pixels=frame(hero.id);assert.equal(pixels.length,SPRITE_WIDTH*SPRITE_HEIGHT);
  assert.ok(pixels.filter(Boolean).length>800,hero.id+' has a complete silhouette');
  assert.ok(new Set(pixels.filter(Boolean)).size>=12,hero.id+' has shaded clothing, face and hair');
  assert.notDeepEqual(pixels,characterPixels(hero.id),hero.id+' is a new outfit');
  designs.push(JSON.stringify(pixels));
 }
 assert.equal(new Set(designs).size,CHARACTERS.length);
 assert.equal(Object.keys(CASUAL_OUTFITS).length,CHARACTERS.length-1);
});
test('casual outfits animate clothing and hands, facial expressions, and walking without leaving the canvas',()=>{
 for(const hero of CHARACTERS){
  const base=frame(hero.id),walking=Array.from({length:4},(_,i)=>frame(hero.id,{frame:i,moving:true}));
  assert.ok(new Set(walking.map(p=>JSON.stringify(p))).size>=3,hero.id+' walk');
  for(const opts of [{attack:true},{blink:true},{expression:'hurt'},{expression:'focused'}])assert.notDeepEqual(base,frame(hero.id,opts),hero.id+' '+JSON.stringify(opts));
  for(const pixels of walking)for(const color of pixels)assert.ok(color===null||/^#[0-9a-f]{6}$/i.test(color),hero.id+' valid native pixels');
 }
});
test('casual skin selection saves for all heroes without changing their combat stats or mastery wallets',()=>{
 const profile=newProfile();for(const hero of CHARACTERS)profile.skins[hero.id]='casual';
 const values=new Map(),storage={getItem:k=>values.get(k)||null,setItem:(k,v)=>values.set(k,v)};
 assert.equal(saveProfile(profile,storage),true);const loaded=loadProfile(storage);
 for(const hero of CHARACTERS){assert.equal(loaded.skins[hero.id],'casual');const casual=createRun(hero,0,loaded),base=createRun(hero);for(const key of ['damage','move','maxHp','maxShield','cooldown'])assert.equal(casual.p[key],base.p[key],hero.id+' '+key);assert.equal(casual.p.skin,'casual');}
 const legacy=sanitizeProfile({version:1,coins:87,characters:{goku:{xp:13,totalXp:101,skills:{ki:1}}}});assert.equal(legacy.coins,87);assert.equal(legacy.characters.goku.xp,13);assert.deepEqual(legacy.skins,{});
});
test('casual art preserves transformed bodies and Goku hair stages',()=>{
 for(const id of ['eren','rimuru']){const opts=id==='eren'?{form:1}:{form:'slime',pose:'predator'};assert.equal(casualPixels(id,opts),null);assert.notDeepEqual(frame(id),frame(id,opts));}
 assert.equal(casualPixels('samus',{pose:'bomb'}),null);
 assert.notDeepEqual(frame('goku'),frame('goku',{form:1}));assert.notDeepEqual(frame('goku',{form:1}),frame('goku',{form:4}));
});
