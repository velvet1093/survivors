import {SKIN} from '../src/hero-kit.js';
import test from 'node:test';
import assert from 'node:assert/strict';
import {CHARACTERS} from '../src/game.js';
import {characterPixels,pilotPixels,SPRITE_WIDTH,SPRITE_HEIGHT} from '../src/pixel-characters.js';
import {casualPixels} from '../src/casual-art.js';
import {pajamaPixels} from '../src/pajama-art.js';
import {SKINS} from '../src/skins.js';
import {portrait,pilotPortrait} from '../src/portraits.js';
import {createRun} from '../src/engine.js';
import {newProfile} from '../src/progression.js';
import {saveRun,loadRun} from '../src/run-save.js';

const shinji=CHARACTERS.find(hero=>hero.id==='shinji');
const eva=(skin,options={})=>characterPixels('shinji',{skin,...options});

test('every Shinji skin has a complete EVA body separately from its human pilot',()=>{
 const bodies=[];
 for(const skin of SKINS.shinji){
  const body=eva(skin.id),pilot=pilotPixels({skin:skin.id});
  assert.equal(body.length,SPRITE_WIDTH*SPRITE_HEIGHT);
  assert.ok(body.filter(Boolean).length>800,skin.id+' full EVA silhouette');
  assert.ok(body.includes(skin.armor),skin.id+' themed armor');
  assert.ok(body.includes(skin.shade),skin.id+' articulated shadow plates');
  assert.ok(body.includes(skin.neon),skin.id+' themed trim');
  assert.ok(!body.includes(SKIN.base),skin.id+' EVA keeps a mechanical face');
  assert.notDeepEqual(body,pilot,skin.id+' pilot is distinct from the combat unit');
  assert.ok(pilot.includes(SKIN.base),skin.id+' pilot keeps a human face');
  bodies.push(JSON.stringify(body));
 }
 assert.equal(new Set(bodies).size,SKINS.shinji.length);
});

test('themed EVA outfits preserve weapon and frenzy animations on every unit',()=>{
 for(const {id}of SKINS.shinji){
  const idle=eva(id),longinus=eva(id,{evolved:'longinus'});
  assert.notDeepEqual(idle,eva(id,{attack:true}),id+' rifle recoil');
  assert.notDeepEqual(idle,longinus,id+' Longinus replaces the rifle');
  assert.ok(longinus.includes('#b4466a'),id+' visible forked spear');
  const rage=Array.from({length:4},(_,frame)=>eva(id,{frame,pose:'berserk'}));
  assert.ok(new Set(rage.map(p=>JSON.stringify(p))).size>=3,id+' moving arms and jaw');
  for(const pixels of [idle,longinus,...rage])for(const color of pixels)assert.ok(color===null||/^#[a-f\d]{6}$/i.test(color),id+' valid colors');
 }
});

test('casual and pajama roster portraits show both the matching EVA and dressed pilot',()=>{
 for(const skin of ['casual','pajamas']){
  const roster=portrait(shinji,skin),avatar=pilotPortrait(skin);
  const look=SKINS.shinji.find(item=>item.id===skin);
  assert.ok(roster.includes(look.armor),skin+' EVA armor appears in the roster');
  assert.ok(roster.includes(SKIN.base),skin+' pilot appears beside the EVA');
  assert.ok(avatar.includes(SKIN.base),skin+' HUD keeps the pilot face');
  assert.ok(!avatar.includes(look.armor),skin+' HUD does not crop the EVA as a human face');
 }
});

test('themed EVA units remain cosmetic through run checkpoint restoration',()=>{
 const values=new Map(),storage={getItem:key=>values.get(key)||null,setItem:(key,value)=>values.set(key,value),removeItem:key=>values.delete(key)};
 for(const skin of ['casual','pajamas']){
  const profile=newProfile();profile.skins.shinji=skin;
  const themed=createRun(shinji,0,profile),original=createRun(shinji);
  for(const stat of ['damage','move','maxHp','maxShield','cooldown'])assert.equal(themed.p[stat],original.p[stat],skin+' '+stat);
  assert.ok(themed.p.unitName.startsWith('EVA-01'));
  assert.ok(saveRun(themed,storage));
  const restored=loadRun(storage);assert.equal(restored.p.skin,skin);assert.equal(restored.p.unitName,themed.p.unitName);
  assert.deepEqual(eva(restored.p.skin),eva(skin));
 }
});
