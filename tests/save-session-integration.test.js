import test from 'node:test';
import assert from 'node:assert/strict';
import {openSaveStorage} from '../src/save-storage.js';
import {createSaveBackup,importSaveBackup} from '../src/save-backup.js';
import {newProfile,loadProfile,saveProfile,buyNode,prestigeCharacter,CHARACTER_TREES,creditRun,SAVE_KEY} from '../src/progression.js';
import {CHARACTERS} from '../src/game.js';
import {createRun,spawnEnemy} from '../src/engine.js';
import {saveRun,loadRun,RUN_SAVE_KEY} from '../src/run-save.js';
import {tryChestMimic} from '../src/rift-encounters.js';
import {summonShenron} from '../src/shenron.js';

const hero=id=>CHARACTERS.find(c=>c.id===id);
function local(){const values=new Map();return {getItem:k=>values.get(k)??null,setItem:(k,v)=>values.set(k,String(v)),removeItem:k=>values.delete(k)};}
const session=localStorage=>openSaveStorage({localStorage,indexedDB:null});
function checkpoint(profile,g,storage){creditRun(profile,g);const entries=new Map(),stage={setItem:(k,v)=>entries.set(k,v),removeItem:k=>entries.set(k,null)};assert.ok(saveProfile(profile,stage));saveRun(g,stage);storage.batch([...entries].filter(([k])=>!k.endsWith('.backup')));}

test('a legacy local profile gains new defaults while purchases, prestige and preferences persist through another session',async()=>{
 const backing=local();backing.setItem(SAVE_KEY,JSON.stringify({version:1,coins:2000,general:{vigor:1},characters:{goku:{xp:50,totalXp:5000,skills:Object.fromEntries(CHARACTER_TREES.goku.map(n=>[n.id,n.max]))}}}));
 let storage=await session(backing),profile=loadProfile(storage);assert.equal(profile.characters.yuki.xp,0);assert.equal(profile.characters.erza.xp,0);assert.ok(buyNode(profile,'general','power'));assert.ok(prestigeCharacter(profile,'goku'));profile.selection={character:'goku',map:'shibuya',mode:'hardcore',difficulty:'hard'};profile.skins.goku='pajamas';profile.pet='metroid';profile.audio={muted:true,music:.2,sfx:.45};profile.ui={hidden:true};assert.ok(saveProfile(profile,storage));await storage.flush();storage.close();
 storage=await session(backing);profile=loadProfile(storage);assert.equal(profile.coins,1970);assert.equal(profile.general.power,1);assert.equal(profile.general.vigor,1);assert.equal(profile.characters.goku.prestige,1);assert.equal(profile.characters.goku.totalXp,5000);assert.equal(profile.characters.goku.xp,0);assert.ok(Object.values(profile.characters.goku.skills).every(rank=>rank===0));assert.equal(profile.skins.goku,'pajamas');assert.equal(profile.pet,'metroid');assert.deepEqual(profile.selection,{character:'goku',map:'shibuya',mode:'hardcore',difficulty:'hard'});assert.deepEqual(profile.audio,{muted:true,music:.2,sfx:.45});assert.equal(profile.ui.hidden,true);storage.close();
});

test('new sessions resume one reward ledger and finished checkpoints never recover from an older local backup',async()=>{
 const backing=local();let storage=await session(backing),profile=newProfile(),g=createRun(hero('yuki'));g.money=90;g.characterXp=125;checkpoint(profile,g,storage);await storage.flush();storage.close();
 storage=await session(backing);profile=loadProfile(storage);g=loadRun(storage);assert.ok(g);assert.deepEqual(creditRun(profile,g),{coins:0,xp:0});assert.equal(profile.coins,90);assert.equal(profile.characters.yuki.xp,125);g.money+=17;g.characterXp+=31;checkpoint(profile,g,storage);assert.equal(profile.coins,107);assert.equal(profile.characters.yuki.xp,156);await storage.flush();storage.close();
 storage=await session(backing);profile=loadProfile(storage);g=loadRun(storage);assert.deepEqual(creditRun(profile,g),{coins:0,xp:0});g.p.hp=0;g.status='over';checkpoint(profile,g,storage);await storage.flush();storage.close();storage=await session(backing);assert.equal(loadRun(storage),null);assert.equal(storage.getItem(RUN_SAVE_KEY+'.backup'),null);assert.equal(loadProfile(storage).coins,107);storage.close();
});

test('a complete portable save preserves unresolved rifts, guarded mimic loot and a pending Shenron wish between stores',async()=>{
 for(const kind of ['rift','mimic','wish']){
  const source=await session(local()),profile=newProfile(),g=createRun(hero('yuki'));g.time=180;g.money=91;g.characterXp=32;g.world.destroyed.add('supply:retained');
  if(kind==='rift'){g.rifts.opened=1;g.rifts.portal={bossId:'beerus',x:12,y:20,age:9,serial:1};g.status='rift';}
  if(kind==='mimic'){const chest={x:10,y:20,source:'Original Boss',rewardCount:5};g.chests=[chest];assert.ok(tryChestMimic(g,chest,{spawn:spawnEnemy},()=>0));g.enemies[0].hp-=35;}
  if(kind==='wish'){g.trinkets.equipped[0]='dragonmarble';g.trinkets.refinements.dragonmarble=7;assert.ok(summonShenron(g));}
  checkpoint(profile,g,source);const file=createSaveBackup(profile,source),raw=source.getItem(RUN_SAVE_KEY),target=await session(local()),restored=newProfile();await importSaveBackup(restored,target,JSON.stringify(file));assert.equal(target.getItem(RUN_SAVE_KEY),raw);const loaded=loadRun(target);assert.ok(loaded);assert.equal(loaded.resumeStatus,kind==='mimic'?'playing':kind);assert.ok(loaded.world.destroyed.has('supply:retained'));assert.deepEqual(creditRun(restored,loaded),{coins:0,xp:0});
  if(kind==='rift')assert.deepEqual(loaded.rifts.portal,g.rifts.portal);
  if(kind==='mimic'){assert.equal(loaded.chests[0].mimicLocked,true);assert.deepEqual(loaded.chests[0].rewardOffers,g.chests[0].rewardOffers);assert.equal(loaded.enemies[0].hp,g.enemies[0].hp);assert.equal(loaded.chests[0].rewardCount,5);}
  if(kind==='wish'){assert.equal(loaded.trinkets.refinements.dragonmarble,7);assert.equal(loaded.trinkets.wish.pending,true);assert.equal(loaded.trinkets.wish.granted,null);}
  source.close();target.close();
 }
});

test('invalid portable checkpoints leave the durable profile, active run and ledger untouched',async()=>{
 const storage=await session(local()),profile=newProfile(),g=createRun(hero('erza'));g.money=50;g.characterXp=20;checkpoint(profile,g,storage);const before=structuredClone(profile),run=storage.getItem(RUN_SAVE_KEY),storedProfile=storage.getItem(SAVE_KEY),file=createSaveBackup(newProfile(),storage);file.run='{"version":1,"run":{"p":{"hp":10}}}';await assert.rejects(importSaveBackup(profile,storage,file));assert.deepEqual(profile,before);assert.equal(storage.getItem(RUN_SAVE_KEY),run);assert.equal(storage.getItem(SAVE_KEY),storedProfile);assert.equal(loadRun(storage).p.erzaForm,3);storage.close();
});
