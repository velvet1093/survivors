import test from 'node:test';
import assert from 'node:assert/strict';
import {CHARACTERS} from '../src/game.js';
import {SKINS,skinFor} from '../src/skins.js';
import {characterPixels,SPRITE_WIDTH,SPRITE_HEIGHT} from '../src/pixel-characters.js';
import {pajamaPixels} from '../src/pajama-art.js';
import {PAJAMA_OUTFITS} from '../src/pajama-outfits.js';
import {newProfile,sanitizeProfile,saveProfile,loadProfile} from '../src/progression.js';
import {createRun} from '../src/engine.js';
import {saveRun,loadRun} from '../src/run-save.js';
const frame=(id,options={})=>characterPixels(id,{skin:'pajamas',...options});
const memory=()=>{const values=new Map();return{getItem:key=>values.get(key)||null,setItem:(key,value)=>values.set(key,value),removeItem:key=>values.delete(key)};};
// Compare garment geometry and pattern boundaries independently of its palette.
function garmentPattern(pixels){const colors=new Map();return pixels.slice(36*SPRITE_WIDTH).map(color=>{if(!color)return 0;if(!colors.has(color))colors.set(color,colors.size+1);return colors.get(color);}).join(',');}

test('all heroes receive one named original pajama outfit with distinct clothing rather than a palette swap',()=>{
 assert.deepEqual(Object.keys(PAJAMA_OUTFITS).sort(),CHARACTERS.map(hero=>hero.id).sort());
 const designs=[];
 for(const hero of CHARACTERS){
  const choices=SKINS[hero.id].filter(skin=>skin.id==='pajamas');assert.equal(choices.length,1,hero.id);assert.ok(choices[0].name.length>4,hero.id+' named outfit');assert.equal(skinFor(hero.id,'pajamas').id,'pajamas');
  const art=frame(hero.id);assert.equal(art.length,SPRITE_WIDTH*SPRITE_HEIGHT);assert.ok(art.filter(Boolean).length>650,hero.id+' complete body');assert.ok(new Set(art.filter(Boolean)).size>=10,hero.id+' shaded face, hair and pajamas');
  for(const skin of ['default','casual']){const previous=characterPixels(hero.id,{skin});assert.notDeepEqual(art,previous,hero.id+' new '+skin+' design');assert.notEqual(garmentPattern(art),garmentPattern(previous),hero.id+' new clothing shape/pattern beyond '+skin+' colors');}
  designs.push(JSON.stringify(art));
 }
 assert.equal(new Set(designs).size,CHARACTERS.length);
});

test('pajamas animate walking, casting and expressions in bounded native pixel frames',()=>{
 for(const hero of CHARACTERS){
  const idle=frame(hero.id),walks=Array.from({length:4},(_,index)=>frame(hero.id,{moving:true,frame:index}));assert.ok(new Set(walks.map(pixels=>JSON.stringify(pixels))).size>=3,hero.id+' walking frames');
  const expressions=[{attack:true},{blink:true},{expression:'hurt'},{expression:'focused'},{pose:hero.id==='erza'?'nakagami':'ultimate'}];
  for(const expression of expressions)assert.notDeepEqual(frame(hero.id,expression),idle,hero.id+' '+JSON.stringify(expression));
  for(const pixels of [...walks,...expressions.map(expression=>frame(hero.id,expression))]){assert.equal(pixels.length,SPRITE_WIDTH*SPRITE_HEIGHT);for(const color of pixels)assert.ok(color===null||/^#[a-f\d]{6}$/i.test(color),hero.id+' valid native colors');}
 }
 const rage=Array.from({length:4},(_,frameIndex)=>JSON.stringify(frame('shinji',{pose:'berserk',frame:frameIndex})));assert.ok(new Set(rage).size>=3,'Shinji retains his active frenzy animation in pajamas');
});

test('pajama selection persists through profile and run saves without changing statistics or progression',()=>{
 const profile=newProfile();profile.coins=453;profile.characters.goku.xp=27;profile.characters.goku.totalXp=123;profile.characters.goku.skills={ki:1};
 for(const hero of CHARACTERS)profile.skins[hero.id]='pajamas';const storage=memory();assert.ok(saveProfile(profile,storage));const loaded=loadProfile(storage);assert.equal(loaded.coins,453);assert.equal(loaded.characters.goku.xp,27);assert.equal(loaded.characters.goku.totalXp,123);assert.equal(loaded.characters.goku.skills.ki,1);
 for(const hero of CHARACTERS){
  assert.equal(loaded.skins[hero.id],'pajamas');const wearing=createRun(hero,0,loaded),original=createRun(hero,0,{...loaded,skins:{}});assert.equal(wearing.p.skin,'pajamas');
  for(const key of ['damage','move','maxHp','maxShield','cooldown','regen','dodge'])assert.equal(wearing.p[key],original.p[key],hero.id+' '+key+' is cosmetic');
  assert.ok(saveRun(wearing,storage));assert.equal(loadRun(storage).p.skin,'pajamas',hero.id+' active-run appearance persists');
 }
 const legacy=sanitizeProfile({version:1,coins:67,skins:{goku:'supersaiyan'},characters:{goku:{xp:32,totalXp:88,skills:{ki:2}}}});assert.equal(legacy.coins,67);assert.equal(legacy.skins.goku,'supersaiyan');assert.equal(legacy.characters.goku.xp,32);assert.equal(legacy.characters.goku.skills.ki,2);
});

test('pajamas preserve transformed bodies, Saiyan hair stages and Erza armor weapon cues',()=>{
 for(const [id,options]of [['eren',{form:1}],['rimuru',{form:'slime',pose:'predator'}],['samus',{pose:'bomb'}]]){assert.equal(pajamaPixels(id,options),null,id+' uses its transformation renderer');assert.notDeepEqual(frame(id),frame(id,options),id+' transformed body is visible');}
 assert.notDeepEqual(frame('goku'),frame('goku',{form:1}));assert.notDeepEqual(frame('goku',{form:1}),frame('goku',{form:4}));
 const armors=[0,1,2].map(form=>JSON.stringify(frame('erza',{form})));assert.equal(new Set(armors).size,3,'Erza armor choices keep different weapon cues over pajamas');
});
