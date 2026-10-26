import test from 'node:test';
import assert from 'node:assert/strict';
import {CHARACTERS} from '../src/game.js';
import {SKINS,skinFor} from '../src/skins.js';
import {newProfile,saveProfile,loadProfile} from '../src/progression.js';
import {createRun,useSpecial} from '../src/engine.js';
import {saveRun,loadRun} from '../src/run-save.js';
import {updateUltimate} from '../src/ultimates.js';
import {heroDamageBonus,heroMoveBonus,heroResistance} from '../src/hero-mechanics.js';
import {characterPixels} from '../src/pixel-characters.js';
import {portrait} from '../src/portraits.js';
import {queuePlayerDeath} from '../src/friendly-death.js';
import {friendlyDeathPixels} from '../src/friendly-death-art.js';
const guts=CHARACTERS.find(c=>c.id==='guts');
const storage=()=>({data:new Map(),getItem(k){return this.data.get(k)},setItem(k,v){this.data.set(k,v)},removeItem(k){this.data.delete(k)}});
const api={damage(){},burst(){},shoot(){}};

test('the reference Berserker outfit stays fully armored while walking and attacking, including outside the ultimate',()=>{
 assert.equal(SKINS.guts.filter(s=>s.id==='berserker').length,1);assert.equal(skinFor('guts','berserker').name,'Berserker Armor');
 const idle=characterPixels('guts',{skin:'berserker'});assert.equal(idle.length,56*76);assert.ok(idle.filter(Boolean).length>1500);
 assert.notDeepEqual(idle,characterPixels('guts'));assert.notDeepEqual(idle,characterPixels('guts',{form:1}),'the reference outfit has its own armor design');
 const faces=new Set(['#dcb394','#a87a67','#efd1b1']);assert.ok(!idle.some(c=>faces.has(c)),'the armor and gauntlets cover all exposed skin');
 const walking=Array.from({length:4},(_,frame)=>characterPixels('guts',{skin:'berserker',moving:true,frame}));assert.ok(new Set(walking.map(p=>JSON.stringify(p))).size>=3);
 assert.notDeepEqual(idle,characterPixels('guts',{skin:'berserker',attack:true}));
 assert.match(portrait(guts,'berserker'),/shape-rendering="crispEdges"/);
});

test('selecting Berserker is cosmetic and survives profile and unfinished-run checkpoints',()=>{
 const store=storage(),profile=newProfile();profile.skins.guts='berserker';profile.coins=73;profile.characters.guts.xp=81;
 assert.ok(saveProfile(profile,store));const restored=loadProfile(store);assert.equal(restored.skins.guts,'berserker');assert.equal(restored.coins,73);assert.equal(restored.characters.guts.xp,81);
 const g=createRun(guts,15,restored),plainProfile={...restored,skins:{...restored.skins,guts:'default'}},plain=createRun(guts,15,plainProfile);
 for(const key of ['hp','maxHp','damage','move','area','cooldown','damageReduction','maxShield','regen'])assert.equal(g.p[key],plain.p[key],key);
 assert.equal(heroDamageBonus(g),1);assert.equal(heroMoveBonus(g),1);assert.equal(heroResistance(g),1);assert.deepEqual(g.p.weapons,plain.p.weapons);
 assert.ok(saveRun(g,store));const resumed=loadRun(store);assert.equal(resumed.p.skin,'berserker');assert.equal(resumed.p.form,0);assert.equal(heroDamageBonus(resumed),1);
 assert.deepEqual(characterPixels('guts',{skin:resumed.p.skin,form:resumed.p.form}),characterPixels('guts',{skin:'berserker'}));
});

test('armor cooldown expiry and defeat preserve the selected Berserker appearance without permanent ultimate bonuses',()=>{
 const profile=newProfile();profile.skins.guts='berserker';const g=createRun(guts,15,profile),store=storage();
 assert.ok(useSpecial(g));assert.equal(heroDamageBonus(g),1.35);assert.ok(saveRun(g,store));const loaded=loadRun(store);loaded.status='playing';
 updateUltimate(loaded,loaded.ultimate.duration+.01,api);assert.equal(loaded.ultimate,null);assert.equal(loaded.p.form,0);assert.equal(loaded.p.skin,'berserker');assert.equal(heroDamageBonus(loaded),1);assert.equal(heroResistance(loaded),1);
 loaded.p.hp=0;const death=queuePlayerDeath(loaded);assert.equal(death.hero.skin,'berserker');assert.deepEqual(friendlyDeathPixels(death),characterPixels('guts',{skin:'berserker',form:0,expression:'hurt'}));
});
