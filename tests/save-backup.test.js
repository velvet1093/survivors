import test from 'node:test';
import assert from 'node:assert/strict';
import {newProfile,SAVE_KEY,CHARACTER_TREES} from '../src/progression.js';
import {CHARACTERS} from '../src/game.js';
import {createRun} from '../src/engine.js';
import {saveRun,loadRun,RUN_SAVE_KEY} from '../src/run-save.js';
import {createSaveBackup,parseSaveBackup,importSaveBackup,BACKUP_FORMAT} from '../src/save-backup.js';

function memory(){const data=new Map();return {getItem:key=>data.get(key)??null,setItem:(key,value)=>data.set(key,String(value)),removeItem:key=>data.delete(key),data};}
function progressed(){const p=newProfile();p.coins=321;p.general.vigor=2;p.characters.yuki.xp=97;p.characters.yuki.prestige=3;p.characters.yuki.skills[CHARACTER_TREES.yuki[0].id]=2;p.skins.yuki='midnight';p.pet='pochita';return p;}

test('portable backups preserve the exact typed checkpoint, ledger and permanent profile in a fresh store',async()=>{
 const profile=progressed(),source=memory(),g=createRun(CHARACTERS.find(c=>c.id==='yuki'));g.time=82;g.money=24;profile.credited[g.runId]={coins:24,xp:0};g.world.destroyed.add('supply:1:2');g.shots=[{x:0,y:0,life:1,hits:new Set([41])}];g.spawn=Infinity;saveRun(g,source);source.setItem('anime-best','83');const original=source.getItem(RUN_SAVE_KEY);
 const backup=createSaveBackup(profile,source,{now:1_700_000_000_000});assert.equal(backup.format,BACKUP_FORMAT);assert.equal(backup.run,original);assert.equal(backup.bestKills,83);
 const target=memory(),restored=newProfile();await importSaveBackup(restored,target,JSON.stringify(backup));assert.equal(target.getItem(RUN_SAVE_KEY),original);assert.equal(restored.coins,321);assert.equal(restored.characters.yuki.prestige,3);assert.equal(restored.skins.yuki,'midnight');assert.deepEqual(restored.credited,profile.credited);const loaded=loadRun(target);assert.equal(loaded.spawn,Infinity);assert.ok(loaded.world.destroyed.has('supply:1:2'));assert.ok(loaded.shots[0].hits instanceof Set);assert.ok(loaded.shots[0].hits.has(41));assert.equal(loaded.resumeStatus,'playing');
});

test('malformed portable files and invalid run payloads cannot mutate either current profile or storage',async()=>{
 const current=progressed(),store=memory();store.setItem(SAVE_KEY,JSON.stringify(current));store.setItem(RUN_SAVE_KEY,'existing checkpoint');store.setItem('anime-best','12');const beforeProfile=structuredClone(current),beforeStorage=[...store.data];const good=createSaveBackup(newProfile(),memory());
 for(const bad of ['not json',JSON.stringify({...good,version:9}),JSON.stringify({...good,run:'{"version":1,"run":{}}'}),JSON.stringify({...good,profile:[]}),JSON.stringify({...good,run:41})]){await assert.rejects(importSaveBackup(current,store,bad));assert.deepEqual(current,beforeProfile);assert.deepEqual([...store.data],beforeStorage);}
});

test('legacy profile import replaces progression and removes an unrelated active run and best score',async()=>{
 const store=memory(),profile=progressed();store.setItem(RUN_SAVE_KEY,'old unrelated run');store.setItem('anime-best','500');const imported=newProfile();imported.coins=77;imported.bestKills=8;const result=await importSaveBackup(profile,store,JSON.stringify(imported));assert.equal(result.legacy,true);assert.equal(result.hasRun,false);assert.equal(profile.coins,77);assert.equal(store.getItem(RUN_SAVE_KEY),null);assert.equal(store.getItem('anime-best'),'8');assert.deepEqual(profile.credited,{});
});

test('a full import commits all three related keys in one adapter batch and waits for durability',async()=>{
 const store=memory(),calls=[];store.batch=entries=>{calls.push(entries);for(const [key,value]of entries)value===null?store.removeItem(key):store.setItem(key,value);};let flushed=false;store.flush=async()=>{flushed=true;return true;};const profile=newProfile(),file=createSaveBackup(progressed(),memory());await importSaveBackup(profile,store,file);assert.equal(calls.length,1);assert.deepEqual(calls[0].map(([key])=>key),[SAVE_KEY,RUN_SAVE_KEY,'anime-best']);assert.equal(flushed,true);assert.equal(profile.coins,321);
});

test('failed storage replacement rolls back its partial write and keeps the shared profile unchanged',async()=>{
 const store=memory(),profile=progressed();store.setItem(SAVE_KEY,'old profile');store.setItem(RUN_SAVE_KEY,'old run');store.setItem('anime-best','7');const before=[...store.data],original=structuredClone(profile),write=store.setItem;let failed=false;store.setItem=(key,value)=>{if(!failed&&key==='anime-best'){failed=true;throw Error('quota');}write(key,value);};await assert.rejects(importSaveBackup(profile,store,createSaveBackup(newProfile(),memory())),/unchanged/);assert.deepEqual(profile,original);assert.deepEqual([...store.data].sort(),before.sort());
});

test('an absent or invalid checkpoint does not prevent exporting the permanent profile',()=>{
 const p=progressed(),store=memory();store.setItem(RUN_SAVE_KEY,'broken');const backup=createSaveBackup(p,store);assert.equal(backup.run,null);assert.equal(parseSaveBackup(JSON.stringify(backup)).profile.characters.yuki.prestige,3);assert.throws(()=>parseSaveBackup('x'.repeat(16*1024*1024+1)),/large/);
});
