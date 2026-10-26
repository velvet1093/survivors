import test from 'node:test';
import assert from 'node:assert/strict';
import {ERZA_WEAPON_ICON_IDS,erzaWeaponPixels,erzaWeaponArt} from '../src/erza-weapon-icons.js';

test('each Requip form and awakened weapon has a distinct colored native pixel illustration',()=>{
 assert.equal(ERZA_WEAPON_ICON_IDS.length,8);
 const frames=ERZA_WEAPON_ICON_IDS.map(erzaWeaponPixels);
 assert.equal(new Set(frames.map(frame=>JSON.stringify(frame))).size,8);
 for(const pixels of frames){assert.equal(pixels.length,1024);assert.ok(pixels.filter(Boolean).length>200);assert.ok(new Set(pixels.filter(Boolean)).size>=7);assert.ok(pixels.includes('#293245'));}
 assert.equal(erzaWeaponPixels('unknown'),null);assert.equal(erzaWeaponArt('unknown'),null);
});

test('weapon families have different silhouettes and preserve their identity when awakened',()=>{
 const bases=ERZA_WEAPON_ICON_IDS.filter(id=>!id.endsWith('-arsenal'));
 const mask=pixels=>pixels.map(c=>!!c).join('');
 assert.equal(new Set(bases.map(id=>mask(erzaWeaponPixels(id)))).size,4);
 for(const id of bases){
  const normal=erzaWeaponPixels(id),strong=erzaWeaponPixels(id+'-arsenal');
  let shared=0,coverage=0;for(let i=0;i<1024;i++){if(normal[i])coverage++;if(normal[i]&&strong[i])shared++;}
  assert.ok(shared/coverage>.85,'awakening retains the weapon silhouette');
  assert.notEqual(erzaWeaponArt(id),erzaWeaponArt(id+'-arsenal'));
  const art=erzaWeaponArt(id);assert.ok(art.includes('<path fill="#'));assert.ok(!art.includes('undefined'));assert.strictEqual(erzaWeaponArt(id),art);
 }
});
