import test from 'node:test';
import assert from 'node:assert/strict';
import {CHARACTERS} from '../src/game.js';
import {SKINS,skinFor} from '../src/skins.js';
import {BEACH_OUTFITS} from '../src/beach-outfits.js';
import {CUTE_SWIM_OUTFITS} from '../src/cute-swim-outfits.js';
import {PILOT_SWIM_OUTFITS} from '../src/pilot-swim-outfits.js';
import {characterPixels,pilotPixels} from '../src/pixel-characters.js';
import {pilotPortrait,portrait} from '../src/portraits.js';
import {newProfile,saveProfile,loadProfile} from '../src/progression.js';
import {createRun} from '../src/engine.js';
import {saveRun,loadRun} from '../src/run-save.js';
const humanOutfits=Object.entries({...BEACH_OUTFITS,...CUTE_SWIM_OUTFITS}).flatMap(([id,outfits])=>outfits.map(skin=>({id,...skin})));
const memory=()=>{const map=new Map();return {getItem:k=>map.get(k)||null,setItem:(k,v)=>map.set(k,v),removeItem:k=>map.delete(k)};};
const heroFor=id=>CHARACTERS.find(c=>c.id===id);

test('nine female heroes and Rei, Asuka and Mari have distinct additional swim and bath outfits',()=>{
 assert.equal(humanOutfits.length,18);assert.equal(PILOT_SWIM_OUTFITS.length,6);assert.equal(Object.keys({...BEACH_OUTFITS,...CUTE_SWIM_OUTFITS}).length,9);
 const artwork=[];
 for(const [heroId,outfits]of Object.entries({...BEACH_OUTFITS,...CUTE_SWIM_OUTFITS}))for(const outfit of outfits){
  assert.equal(skinFor(heroId,outfit.id).name,outfit.name);assert.equal(SKINS[heroId].filter(s=>s.id===outfit.id).length,1);
  const pixels=characterPixels(heroId,{skin:outfit.id});assert.equal(pixels.length,56*76);assert.ok(pixels.filter(Boolean).length>650,heroId+' full outfit');assert.ok(pixels.every(c=>c===null||/^#[a-f\d]{6}$/i.test(c)),heroId+' valid colors');
  for(const skin of ['default','casual','pajamas','swimsuit'])assert.notDeepEqual(pixels,characterPixels(heroId,{skin}),heroId+' distinct from '+skin);artwork.push(JSON.stringify(pixels));
 }
 assert.equal(new Set(artwork).size,18);
 for(const pilot of ['Rei','Asuka','Mari'])assert.equal(PILOT_SWIM_OUTFITS.filter(s=>s.pilot===pilot).length,2);
});

test('new swimwear keeps walking, attack and facial animation in both portraits and combat',()=>{
 for(const [id,outfits]of Object.entries({...BEACH_OUTFITS,...CUTE_SWIM_OUTFITS}))for(const outfit of outfits){
  const idle=characterPixels(id,{skin:outfit.id}),walk=Array.from({length:4},(_,frame)=>characterPixels(id,{skin:outfit.id,frame,moving:true}));
  assert.ok(new Set(walk.map(p=>JSON.stringify(p))).size>=3,id+' '+outfit.id+' walking');
  for(const options of [{attack:true},{blink:true},{expression:'hurt'}])assert.notDeepEqual(characterPixels(id,{skin:outfit.id,...options}),idle,id+' '+outfit.id+' '+JSON.stringify(options));
 }
 assert.notDeepEqual(characterPixels('samus',{skin:'bikini'}),characterPixels('samus',{skin:'bikini',pose:'bomb'}));
 for(const skin of ['bikini','bathsuit'])assert.equal(new Set([0,1,2].map(form=>JSON.stringify(characterPixels('erza',{skin,form})))).size,3,'Erza form gear: '+skin);
});

test('female EVA pilot swimwear has paired unit artwork and retains each unit and weapon identity',()=>{
 const units=[],pilots=[];
 for(const skin of PILOT_SWIM_OUTFITS){
  assert.equal(skinFor('shinji',skin.id).pilot,skin.pilot);const pilot=pilotPixels({skin:skin.id}),eva=characterPixels('shinji',{skin:skin.id});
  assert.notDeepEqual(pilot,eva);assert.ok(pilot.includes('#ffe2c6')||pilot.includes('#ffe0c6'));assert.ok(eva.includes(skin.armor));assert.ok(!eva.includes('#ffe0c6')&&!eva.includes('#ffe2c6'));
  assert.ok(pilotPortrait(skin.id).includes(skin.hair));assert.ok(portrait(heroFor('shinji'),skin.id).includes(skin.armor));
  assert.notDeepEqual(pilot,pilotPixels({skin:skin.evaBase}));for(const options of [{blink:true},{expression:'hurt'},{attack:true}])assert.notDeepEqual(pilot,pilotPixels({skin:skin.id,...options}));
  assert.ok(new Set([0,1,2,3].map(frame=>JSON.stringify(pilotPixels({skin:skin.id,frame,moving:true})))).size>=3);
  assert.notDeepEqual(eva,characterPixels('shinji',{skin:skin.id,attack:true}));assert.ok(characterPixels('shinji',{skin:skin.id,evolved:'longinus'}).includes('#b4466a'));
  assert.ok(new Set([0,1,2,3].map(frame=>JSON.stringify(characterPixels('shinji',{skin:skin.id,pose:'berserk',frame})))).size>=3);
  units.push(JSON.stringify(eva));pilots.push(JSON.stringify(pilot));
 }assert.equal(new Set(units).size,6);assert.equal(new Set(pilots).size,6);
});

test('all new wardrobe selections survive profile and run saves without changing combat or progression',()=>{
 const store=memory(),profile=newProfile();profile.coins=83;const choices=[];
 for(const [id,outfits]of Object.entries({...BEACH_OUTFITS,...CUTE_SWIM_OUTFITS}))for(const outfit of outfits)choices.push([id,outfit.id]);for(const skin of PILOT_SWIM_OUTFITS)choices.push(['shinji',skin.id]);
 for(const [id,skin]of choices){profile.skins[id]=skin;assert.ok(saveProfile(profile,store));const loaded=loadProfile(store);assert.equal(loaded.skins[id],skin);assert.equal(loaded.coins,83);const g=createRun(heroFor(id),0,loaded),base=createRun(heroFor(id),0,{...loaded,skins:{}});
  for(const stat of ['damage','move','maxHp','maxShield','cooldown','regen','dodge'])assert.equal(g.p[stat],base.p[stat],id+' '+skin+' '+stat);assert.deepEqual(g.p.meta,base.p.meta);assert.ok(saveRun(g,store));const restored=loadRun(store);assert.equal(restored.p.skin,skin);assert.equal(restored.p.displayName,skinFor(id,skin).pilot||heroFor(id).name);assert.equal(restored.p.unitName,skinFor(id,skin).unit||'');
 }
});
