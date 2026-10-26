import test from 'node:test';
import assert from 'node:assert/strict';
import {CHARACTERS,ITEMS,FUSIONS,applyChoice,fusionReady,forbiddenItem} from '../src/game.js';
import {createRun,createHardcoreRun} from '../src/engine.js';
import {newProfile,sanitizeProfile,buyNode,progressionBonuses,CHARACTER_TREES,nodeParents,saveProfile,loadProfile} from '../src/progression.js';
import {gainStruggle} from '../src/guts.js';
import {saveRun,loadRun} from '../src/run-save.js';
import {tierEntries,filterTierEntries} from '../src/tier-lists.js';

const hero=id=>CHARACTERS.find(c=>c.id===id);
const memory=()=>({data:new Map(),getItem(k){return this.data.get(k);},setItem(k,v){this.data.set(k,v);},removeItem(k){this.data.delete(k);}});

test('Guts appends to saved roster identities and legacy profiles gain an untrained mastery without losing progress',()=>{
 assert.deepEqual(CHARACTERS.slice(0,17).map(c=>c.id),['goku','gojo','naruto','madoka','maomao','shinji','esdeath','kurumi','frieren','samus','megumi','eren','yuki','diavolo','rimuru','featherine','erza']);
 assert.equal(CHARACTERS[17].id,'guts');
 const profile=sanitizeProfile({coins:240,characters:{goku:{xp:73,totalXp:125,skills:{ki:2}}},general:{vigor:1},selection:{character:'goku',map:'shibuya'}});
 assert.equal(profile.coins,240);assert.equal(profile.characters.goku.xp,73);assert.equal(profile.characters.goku.skills.ki,2);assert.deepEqual(profile.characters.guts,{xp:0,totalXp:0,skills:{}});
 profile.characters.guts.xp=500;const before=profile.characters.goku.xp;assert.ok(buyNode(profile,'character','iron','guts'));assert.equal(profile.characters.guts.xp,480);assert.equal(profile.characters.goku.xp,before);assert.equal(profile.coins,240);
 profile.selection.character='guts';const storage=memory();assert.ok(saveProfile(profile,storage));const restored=loadProfile(storage);assert.equal(restored.selection.character,'guts');assert.equal(restored.characters.guts.skills.iron,1);assert.equal(restored.characters.goku.skills.ki,2);
});

test('Guts mastery joins require their branches and grant live signature and Struggle bonuses only to him',()=>{
 const profile=newProfile();profile.characters.guts.xp=30000;const tree=CHARACTER_TREES.guts;
 assert.equal(tree.length,12);assert.equal(buyNode(profile,'character','struggler','guts'),false);
 const pending=new Set(tree.map(n=>n.id));
 while(pending.size){let trained=0;for(const id of pending){const n=tree.find(n=>n.id===id);if(nodeParents(n).every(parent=>profile.characters.guts.skills[parent]>0)){while(buyNode(profile,'character',id,'guts')){}pending.delete(id);trained++;}}assert.ok(trained,'every mastery branch is reachable');}
 const bonuses=progressionBonuses(profile,'guts'),g=createRun(hero('guts'),0,profile),base=createRun(hero('guts')),other=createRun(hero('goku'),0,profile);
 assert.equal(g.p.weapons.dragonslayer,2);assert.ok(g.p.maxHp>base.p.maxHp);assert.ok(g.p.move>base.p.move);assert.ok(bonuses.signatureDamage>.5);assert.ok(bonuses.struggleGain>.4);
 gainStruggle(g,10);gainStruggle(base,10);assert.ok(g.mechanic.value>base.mechanic.value);assert.equal(progressionBonuses(profile,'goku').struggleGain,undefined);assert.equal(other.p.maxHp,createRun(hero('goku')).p.maxHp);
});

test('Hardcore Guts evolves his own signature pair and retains its identity through a checkpoint',()=>{
 const g=createHardcoreRun(hero('guts')),fusion=FUSIONS.find(f=>f.id==='berserkeredge');
 assert.deepEqual(Object.keys(g.p.weapons),['dragonslayer']);assert.deepEqual(Object.keys(g.p.passives),['brand']);assert.equal(forbiddenItem(g.p,'ki'),true);assert.equal(forbiddenItem(g.p,'senzu'),true);
 while(g.p.weapons.dragonslayer<ITEMS.dragonslayer.max)assert.ok(applyChoice(g.p,{kind:'item',id:'dragonslayer'}));
 while(g.p.passives.brand<ITEMS.brand.max)assert.ok(applyChoice(g.p,{kind:'item',id:'brand'}));
 assert.ok(fusionReady(g.p,fusion));assert.ok(applyChoice(g.p,{kind:'fusion',id:fusion.id}));const storage=memory();assert.ok(saveRun(g,storage));const restored=loadRun(storage);
 assert.equal(restored.p.id,'guts');assert.equal(restored.p.fusions.dragonslayer,'berserkeredge');assert.deepEqual(Object.keys(restored.p.passives),['brand']);assert.equal(restored.p.hardcore,true);
});

test('Guts and his signature gear have discoverable placement explanations that include their melee limits',()=>{
 const entries=filterTierEntries('characters',{query:'Berserk'});assert.ok(entries.some(e=>e.id==='guts'));
 const character=tierEntries('characters').find(e=>e.id==='guts'),weapon=tierEntries('weapons').find(e=>e.id==='dragonslayer'),evolved=tierEntries('weapons').find(e=>e.id==='berserkeredge'),passive=tierEntries('passives').find(e=>e.id==='brand'),ultimate=tierEntries('ultimates').find(e=>e.id==='guts');
 assert.equal(character.tier,'A');assert.equal(weapon.tier,'B');assert.equal(evolved.tier,'A');assert.match(character.caution,/short reach/);assert.match(weapon.caution,/exclusive to Guts/);assert.match(evolved.comparison,/close|cleave/);assert.match(passive.comparison,/no|cannot/);assert.match(ultimate.comparison,/25% damage reduction/);assert.match(ultimate.caution,/immunity/);
});
