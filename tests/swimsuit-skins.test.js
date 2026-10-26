import test from 'node:test';
import assert from 'node:assert/strict';
import {CHARACTERS} from '../src/game.js';
import {SKINS,skinFor} from '../src/skins.js';
import {characterPixels,pilotPixels,SPRITE_WIDTH,SPRITE_HEIGHT} from '../src/pixel-characters.js';
import {swimsuitPixels,SWIMSUIT_OUTFITS} from '../src/swimsuit-art.js';
import {portrait,pilotPortrait} from '../src/portraits.js';
import {newProfile,saveProfile,loadProfile} from '../src/progression.js';
import {createRun} from '../src/engine.js';
import {saveRun,loadRun} from '../src/run-save.js';
const frame=(id,options={})=>characterPixels(id,{skin:'swimsuit',...options});
const memory=()=>{const values=new Map();return {getItem:key=>values.get(key)||null,setItem:(key,value)=>values.set(key,value),removeItem:key=>values.delete(key)};};

test('every hero has a complete distinct swimsuit themed outfit beyond existing clothing',()=>{
 assert.deepEqual(Object.keys(SWIMSUIT_OUTFITS).sort(),CHARACTERS.map(c=>c.id).sort());const outfits=[];
 for(const hero of CHARACTERS){
  assert.equal(SKINS[hero.id].filter(s=>s.id==='swimsuit').length,1,hero.id);assert.equal(skinFor(hero.id,'swimsuit').name,SWIMSUIT_OUTFITS[hero.id]);
  const art=frame(hero.id);assert.equal(art.length,SPRITE_WIDTH*SPRITE_HEIGHT);assert.ok(art.filter(Boolean).length>650,hero.id+' complete body');assert.ok(new Set(art.filter(Boolean)).size>10,hero.id+' shaded original art');
  for(const skin of ['default','casual','pajamas'])assert.notDeepEqual(art,characterPixels(hero.id,{skin}),hero.id+' distinct from '+skin);
  for(const color of art)assert.ok(color===null||/^#[a-f\d]{6}$/i.test(color));outfits.push(JSON.stringify(art));
 }assert.equal(new Set(outfits).size,CHARACTERS.length);
});

test('swim outfits preserve bounded walking, casting, hurt and blink animation',()=>{
 for(const hero of CHARACTERS){
  const idle=frame(hero.id),walks=Array.from({length:4},(_,frameIndex)=>frame(hero.id,{frame:frameIndex,moving:true}));
  assert.ok(new Set(walks.map(a=>JSON.stringify(a))).size>=3,hero.id+' moving legs and garment');
  for(const pose of [{attack:true},{blink:true},{expression:'hurt'},{pose:hero.id==='erza'?'nakagami':'ultimate'}])assert.notDeepEqual(frame(hero.id,pose),idle,hero.id+' '+JSON.stringify(pose));
 }
});

test('swim selection persists without changing stats, mastery or progression',()=>{
 const profile=newProfile(),storage=memory();profile.coins=71;
 for(const hero of CHARACTERS)profile.skins[hero.id]='swimsuit';assert.ok(saveProfile(profile,storage));const loaded=loadProfile(storage);assert.equal(loaded.coins,71);
 for(const hero of CHARACTERS){
  assert.equal(loaded.skins[hero.id],'swimsuit');const run=createRun(hero,0,loaded),base=createRun(hero,0,{...loaded,skins:{}});
  for(const stat of ['damage','move','maxHp','maxShield','cooldown','regen','dodge'])assert.equal(run.p[stat],base.p[stat],hero.id+' cosmetic '+stat);
  assert.ok(saveRun(run,storage));assert.equal(loadRun(storage).p.skin,'swimsuit');
 }
});

test('swim skins retain transformations and provide Shinji a matching aquatic EVA plus human pilot',()=>{
 for(const [id,options]of [['eren',{form:1}],['rimuru',{form:'slime',pose:'predator'}],['samus',{pose:'bomb'}]]){assert.equal(swimsuitPixels(id,options),null);assert.notDeepEqual(frame(id),frame(id,options));}
 assert.notDeepEqual(frame('goku'),frame('goku',{form:1}));assert.notDeepEqual(frame('goku',{form:1}),frame('goku',{form:4}));
 assert.equal(new Set([0,1,2].map(form=>JSON.stringify(frame('erza',{form})))).size,3);
 const eva=frame('shinji'),pilot=pilotPixels({skin:'swimsuit'});assert.notDeepEqual(eva,pilot);assert.ok(pilot.includes('#ffe0c6'));assert.ok(!eva.includes('#ffe0c6'));
 assert.deepEqual(pilot,swimsuitPixels('shinji'));assert.ok(portrait(CHARACTERS.find(c=>c.id==='shinji'),'swimsuit').includes('#5598af'));assert.ok(pilotPortrait('swimsuit').includes('#ffe0c6'));
 assert.notDeepEqual(eva,frame('shinji',{attack:true}));assert.ok(frame('shinji',{evolved:'longinus'}).includes('#b4466a'));assert.ok(new Set([0,1,2,3].map(frameIndex=>JSON.stringify(frame('shinji',{pose:'berserk',frame:frameIndex})))).size>=3);
});
