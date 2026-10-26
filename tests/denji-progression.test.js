import test from 'node:test';
import assert from 'node:assert/strict';
import {CHARACTERS,ITEMS,FUSIONS,applyChoice,fusionReady,forbiddenItem} from '../src/game.js';
import {createRun,createHardcoreRun,useSpecial} from '../src/engine.js';
import {newProfile,sanitizeProfile,buyNode,progressionBonuses,CHARACTER_TREES,nodeParents,saveProfile,loadProfile,prestigeCharacter,prestigeState} from '../src/progression.js';
import {gainRev} from '../src/denji.js';
import {saveRun,loadRun} from '../src/run-save.js';
import {tierEntries,filterTierEntries} from '../src/tier-lists.js';
import {skillIcon} from '../src/skill-icons.js';

const hero=id=>CHARACTERS.find(c=>c.id===id);
const memory=()=>({data:new Map(),getItem(k){return this.data.get(k)||null;},setItem(k,v){this.data.set(k,v);},removeItem(k){this.data.delete(k);}});
function train(profile){
 const tree=CHARACTER_TREES.denji,pending=new Set(tree.map(n=>n.id));
 while(pending.size){let trained=0;for(const id of pending){const n=tree.find(n=>n.id===id);if(nodeParents(n).every(parent=>profile.characters.denji.skills[parent]>0)){while(buyNode(profile,'character',id,'denji')){}pending.delete(id);trained++;}}assert.ok(trained,'every mastery branch is reachable');}
 return tree;
}

test('Denji appends to the roster and legacy profiles gain untrained mastery while preserving existing progression',()=>{
 assert.equal(CHARACTERS[17].id,'guts');assert.equal(CHARACTERS[18].id,'denji');
 const profile=sanitizeProfile({coins:300,characters:{goku:{xp:81,totalXp:140,skills:{ki:2}}},general:{vigor:1},selection:{character:'goku',map:'shibuya'}});
 assert.equal(profile.coins,300);assert.equal(profile.characters.goku.xp,81);assert.equal(profile.characters.goku.skills.ki,2);assert.deepEqual(profile.characters.denji,{xp:0,totalXp:0,skills:{}});
 profile.characters.denji.xp=100;assert.ok(buyNode(profile,'character','teeth','denji'));assert.equal(profile.characters.denji.xp,80);assert.equal(profile.characters.goku.xp,81);assert.equal(profile.coins,300);
 profile.selection.character='denji';const store=memory();assert.ok(saveProfile(profile,store));const restored=loadProfile(store);assert.equal(restored.selection.character,'denji');assert.equal(restored.characters.denji.skills.teeth,1);assert.equal(restored.characters.goku.skills.ki,2);
});

test('Denji mastery joins require their branches and improve his actual signature, Rev, transformation and movement',()=>{
 const profile=newProfile();profile.characters.denji.xp=100000;assert.equal(buyNode(profile,'character','dream','denji'),false);assert.equal(buyNode(profile,'character','promise','denji'),false);const tree=train(profile);assert.equal(tree.length,12);
 const bonuses=progressionBonuses(profile,'denji'),g=createRun(hero('denji'),0,profile),base=createRun(hero('denji')),other=createRun(hero('goku'),0,profile);
 assert.equal(g.p.weapons.chainsaw,2);assert.ok(g.p.maxHp>base.p.maxHp);assert.ok(g.p.move>base.p.move);assert.ok(bonuses.signatureDamage>.5);assert.ok(bonuses.revGain>.4);gainRev(g,10);gainRev(base,10);assert.ok(g.mechanic.value>base.mechanic.value);
 assert.ok(useSpecial(g));assert.ok(useSpecial(base));assert.ok(g.ultimate.duration>base.ultimate.duration);assert.equal(progressionBonuses(profile,'goku').revGain,undefined);assert.equal(other.p.maxHp,createRun(hero('goku')).p.maxHp);
 const icons=tree.map(n=>skillIcon('character',n,'denji'));assert.ok(icons.every(svg=>svg.includes('data-skill-art="denji:')));assert.equal(new Set(icons).size,12);
});

test('Denji prestige resets only his mastery and persists the earned rank and permanent bonuses',()=>{
 const profile=newProfile();profile.characters.denji.xp=100000;profile.characters.denji.totalXp=800;profile.characters.goku.skills.ki=1;profile.characters.goku.xp=55;train(profile);assert.equal(prestigeState(profile,'denji').canPrestige,true);assert.ok(prestigeCharacter(profile,'denji'));
 assert.equal(profile.characters.denji.prestige,1);assert.equal(profile.characters.denji.xp,0);assert.deepEqual(profile.characters.denji.skills,{});assert.equal(profile.characters.denji.totalXp,800);assert.equal(profile.characters.goku.xp,55);assert.equal(profile.characters.goku.skills.ki,1);assert.equal(prestigeCharacter(profile,'denji'),false);
 const store=memory();assert.ok(saveProfile(profile,store));const restored=loadProfile(store),bonuses=progressionBonuses(restored,'denji');assert.equal(restored.characters.denji.prestige,1);assert.equal(bonuses.damage,.05);assert.equal(bonuses.hp,10);assert.equal(bonuses.masteryGain,.1);assert.equal(restored.characters.goku.skills.ki,1);
});

test('Hardcore Denji evolves only his signature pair and keeps the fusion and own passive through a checkpoint',()=>{
 const g=createHardcoreRun(hero('denji')),fusion=FUSIONS.find(f=>f.id==='chainsawoverdrive');assert.deepEqual(Object.keys(g.p.weapons),['chainsaw']);assert.deepEqual(Object.keys(g.p.passives),['bloodengine']);assert.equal(forbiddenItem(g.p,'ki'),true);assert.equal(forbiddenItem(g.p,'senzu'),true);
 while(g.p.weapons.chainsaw<ITEMS.chainsaw.max)assert.ok(applyChoice(g.p,{kind:'item',id:'chainsaw'}));while(g.p.passives.bloodengine<ITEMS.bloodengine.max)assert.ok(applyChoice(g.p,{kind:'item',id:'bloodengine'}));assert.ok(fusionReady(g.p,fusion));assert.ok(applyChoice(g.p,{kind:'fusion',id:fusion.id}));
 const store=memory();assert.ok(saveRun(g,store));const restored=loadRun(store);assert.ok(restored);assert.equal(restored.p.id,'denji');assert.equal(restored.p.fusions.chainsaw,'chainsawoverdrive');assert.deepEqual(Object.keys(restored.p.passives),['bloodengine']);assert.equal(restored.p.hardcore,true);
});

test('Denji, both chainsaws, Blood Engine and Chainsaw Man have searchable tier explanations of their actual limits',()=>{
 assert.ok(filterTierEntries('characters',{query:'Chainsaw Man'}).some(e=>e.id==='denji'));
 const hero=tierEntries('characters').find(e=>e.id==='denji'),weapon=tierEntries('weapons').find(e=>e.id==='chainsaw'),evolved=tierEntries('weapons').find(e=>e.id==='chainsawoverdrive'),passive=tierEntries('passives').find(e=>e.id==='bloodengine'),ultimate=tierEntries('ultimates').find(e=>e.id==='denji');
 assert.equal(hero.tier,'A');assert.equal(weapon.tier,'B');assert.equal(evolved.tier,'A');assert.equal(passive.tier,'B');assert.equal(ultimate.tier,'A');assert.match(hero.comparison,/close|reach/);assert.match(weapon.caution,/only to Denji/);assert.match(evolved.comparison,/melee/);assert.match(passive.comparison,/30 maximum HP and 12%/);assert.match(ultimate.comparison,/24 per activation/);assert.match(ultimate.caution,/distant|Distant/);
});
