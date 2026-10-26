import test from 'node:test';
import assert from 'node:assert/strict';
import {openSaveStorage,SAVE_STORAGE_KEYS} from '../src/save-storage.js';
import {readCloudRecord,writeCloudRecord,connectCloud} from '../src/cloud-save.js';

// A minimal stand-in for the artifact database: documents by path, plus a write log.
function fakeDb(){
 const docs=new Map(),log=[];
 const ref=path=>({path,async get(){const d=docs.get(path);return {exists:!!d,data:()=>d&&structuredClone(d)};},async set(data){log.push(['set',path]);docs.set(path,structuredClone(data));},async delete(){log.push(['delete',path]);docs.delete(path);}});
 return {docs,log,doc:ref};
}
const memory=()=>{const d=new Map();return {getItem:k=>d.has(k)?d.get(k):null,setItem:(k,v)=>d.set(k,String(v)),removeItem:k=>d.delete(k)};};
const PROFILE=SAVE_STORAGE_KEYS[0],RUN=SAVE_STORAGE_KEYS[1];
const tick=ms=>new Promise(r=>setTimeout(r,ms));

test('cloud records round-trip in chunks and a half-written copy is ignored',async()=>{
 const db=fakeDb(),cloud={db,uid:'u_1'},big='x'.repeat(400*1024);
 assert.equal(await writeCloudRecord(cloud,{key:RUN,value:big,revision:5,updatedAt:1}),3);
 assert.equal((await readCloudRecord(cloud,RUN)).value,big);
 db.docs.get(`data/users/u_1/${RUN}~1`).revision=4;assert.equal(await readCloudRecord(cloud,RUN),null,'mixed revisions are not stitched');
 assert.equal(await writeCloudRecord(cloud,{key:RUN,value:'small',revision:6,updatedAt:2},3),1);assert.ok(!db.docs.has(`data/users/u_1/${RUN}~2`),'surplus chunks are removed');
 await writeCloudRecord(cloud,{key:RUN,value:null,deleted:true,revision:7,updatedAt:3},1);assert.equal((await readCloudRecord(cloud,RUN)).deleted,true);
 assert.ok([...db.docs.keys()].every(p=>p.startsWith('data/users/u_1/')),'everything stays in the private per-player area');
 assert.equal(await connectCloud({host:undefined}),null);assert.equal(await connectCloud({host:{use:async()=>null}}),null);
});
test('a fresh browser (new game version) restores progress from the cloud, and new saves sync back',async()=>{
 const db=fakeDb(),cloud={db,uid:'u_1'};
 await writeCloudRecord(cloud,{key:PROFILE,value:'{"coins":900}',revision:Date.now()-1000,updatedAt:Date.now()-1000});
 const store=await openSaveStorage({localStorage:memory(),indexedDB:null,cloud,cloudDelay:5});
 assert.equal(store.getItem(PROFILE),'{"coins":900}','the cloud copy is in place before the game reads it');
 assert.equal(store.status().cloud,'synced');
 store.setItem(PROFILE,'{"coins":950}');await tick(30);await store.flushCloud();
 assert.equal((await readCloudRecord(cloud,PROFILE)).value,'{"coins":950}');
});
test('existing local progress is uploaded when the cloud is empty, and an older cloud copy never wins',async()=>{
 const db=fakeDb(),cloud={db,uid:'u_2'},local=memory();
 const first=await openSaveStorage({localStorage:local,indexedDB:null,cloud:null});first.setItem(PROFILE,'{"coins":40}');
 const second=await openSaveStorage({localStorage:local,indexedDB:null,cloud,cloudDelay:5});await tick(1600);await second.flushCloud();
 assert.equal((await readCloudRecord(cloud,PROFILE)).value,'{"coins":40}');
 await writeCloudRecord(cloud,{key:PROFILE,value:'{"coins":1}',revision:1,updatedAt:1});
 const third=await openSaveStorage({localStorage:local,indexedDB:null,cloud});assert.equal(third.getItem(PROFILE),'{"coins":40}');
});
test('without the viewer the game keeps saving locally exactly as before',async()=>{
 const store=await openSaveStorage({localStorage:memory(),indexedDB:null});store.setItem(PROFILE,'{"coins":3}');
 assert.equal(store.getItem(PROFILE),'{"coins":3}');assert.equal(store.status().cloud,'offline');assert.equal(store.persistent,true);
});
