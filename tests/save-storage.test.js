import test from 'node:test';
import assert from 'node:assert/strict';
import {openSaveStorage,readSavedValue,writeSavedValue,removeSavedValue,SAVE_STORAGE_KEYS} from '../src/save-storage.js';
const [PROFILE,RUN]=SAVE_STORAGE_KEYS;
function memory(initial={}){
 const data=new Map(Object.entries(initial));return {data,fail:null,getItem:key=>data.get(key)??null,setItem(key,value){if(this.fail?.(key))throw Error('quota');data.set(key,String(value));},removeItem(key){if(this.fail?.(key))throw Error('quota');data.delete(key);},clear(){data.clear();}};
}
// A small asynchronous IndexedDB fixture exercises requests, upgrades, atomic
// transactions and failure callbacks; browser tests cover the browser's engine.
function database(){
 const rows=new Map();let made=false;
 const factory={rows,failWrites:false,open(){
  const request={};queueMicrotask(()=>{
   const db={objectStoreNames:{contains:()=>made},createObjectStore(){made=true;},close(){},transaction(name,mode){
    const staged=new Map(rows),tx={objectStore(){return {getAll(){const result={};queueMicrotask(()=>{result.result=[...rows.values()].map(value=>structuredClone(value));result.onsuccess?.();});return result;},put(record){staged.set(record.key,structuredClone(record));}};}};
    if(mode==='readwrite')queueMicrotask(()=>{if(factory.failWrites){tx.onabort?.();return;}rows.clear();for(const [key,value]of staged)rows.set(key,value);tx.oncomplete?.();});return tx;
   }};
   request.result=db;if(!made)request.onupgradeneeded?.();request.onsuccess?.();
  });return request;
 }};return factory;
}
const valid=raw=>{try{return !!JSON.parse(raw)?.version;}catch{return false;}};

test('legacy stable keys survive reopen, changed saves rotate once, and identical writes keep the backup',async()=>{
 const local=memory({[PROFILE]:'{"version":1,"coins":12}'}),store=await openSaveStorage({localStorage:local,indexedDB:null,now:()=>100});
 assert.equal(store.getItem(PROFILE),'{"version":1,"coins":12}');assert.equal(store.status().driver,'localStorage');assert.equal(store.persistent,true);
 assert.ok(writeSavedValue(store,PROFILE,'{"version":1,"coins":20}'));assert.equal(store.getItem(PROFILE+'.backup'),'{"version":1,"coins":12}');
 assert.ok(writeSavedValue(store,PROFILE,'{"version":1,"coins":20}'));assert.equal(store.getItem(PROFILE+'.backup'),'{"version":1,"coins":12}');
 assert.ok(writeSavedValue(store,PROFILE,'{"version":1,"coins":35}'));assert.equal(store.getItem(PROFILE+'.backup'),'{"version":1,"coins":20}');
 const again=await openSaveStorage({localStorage:local,indexedDB:null});assert.equal(readSavedValue(again,PROFILE,valid),'{"version":1,"coins":35}');assert.equal(again.status().lastSavedAt,100);
});

test('a corrupt primary recovers the latest valid rolling backup instead of silently starting over',async()=>{
 const local=memory(),store=await openSaveStorage({localStorage:local,indexedDB:null});
 store.setItem(PROFILE,'{"version":1,"coins":80}');store.setItem(PROFILE,'{"version":1,"coins":100}');
 local.setItem(PROFILE,'{}');const reopened=await openSaveStorage({localStorage:local,indexedDB:null});
 assert.equal(readSavedValue(reopened,PROFILE,valid),'{"version":1,"coins":80}');assert.equal(reopened.status().recovered,true);assert.equal(local.getItem(PROFILE),'{"version":1,"coins":80}');
 assert.equal(readSavedValue(memory({[PROFILE]:'bad',[PROFILE+'.backup']:'[]'}),PROFILE,valid),null);
});

test('the IndexedDB mirror restores a missing local save and its current backup after a new session',async()=>{
 const local=memory(),idb=database(),store=await openSaveStorage({localStorage:local,indexedDB:idb,now:()=>200});
 store.setItem(PROFILE,'{"version":1,"coins":40}');store.setItem(PROFILE,'{"version":1,"coins":75}');assert.ok(await store.flush());
 local.clear();const reopened=await openSaveStorage({localStorage:local,indexedDB:idb});assert.equal(readSavedValue(reopened,PROFILE,valid),'{"version":1,"coins":75}');assert.equal(reopened.getItem(PROFILE+'.backup'),'{"version":1,"coins":40}');assert.ok(reopened.status().recovered);assert.equal(local.getItem(PROFILE),'{"version":1,"coins":75}');assert.ok(await reopened.flush());
});

test('a valid current database mirror beats an invalid primary and an older local backup',async()=>{
 const local=memory(),idb=database(),store=await openSaveStorage({localStorage:local,indexedDB:idb});store.setItem(PROFILE,'{"version":1,"coins":40}');store.setItem(PROFILE,'{"version":1,"coins":75}');await store.flush();
 local.setItem(PROFILE,'broken');const reopened=await openSaveStorage({localStorage:local,indexedDB:idb});assert.equal(readSavedValue(reopened,PROFILE,valid),'{"version":1,"coins":75}');await reopened.flush();assert.equal(idb.rows.get(PROFILE).value,'{"version":1,"coins":75}');
});

test('finished runs delete all current and backup copies and a tombstone prevents revival after restart',async()=>{
 const local=memory(),idb=database(),store=await openSaveStorage({localStorage:local,indexedDB:idb});store.setItem(RUN,'{"version":1,"run":1}');store.setItem(RUN,'{"version":1,"run":2}');await store.flush();assert.ok(removeSavedValue(store,RUN));assert.ok(await store.flush());
 assert.equal(store.getItem(RUN),null);assert.equal(store.getItem(RUN+'.backup'),null);assert.equal(idb.rows.get(RUN).deleted,true);assert.equal(idb.rows.get(RUN).backup,null);
 local.clear();const reopened=await openSaveStorage({localStorage:local,indexedDB:idb});assert.equal(readSavedValue(reopened,RUN,valid),null);assert.equal(reopened.getItem(RUN+'.backup'),null);
});

test('IndexedDB remains durable when local storage is unavailable, while total failure stays honestly session-only',async()=>{
 const local=memory();local.fail=()=>true;const idb=database(),store=await openSaveStorage({localStorage:local,indexedDB:idb});assert.equal(store.status().driver,'IndexedDB');assert.ok(writeSavedValue(store,PROFILE,'{"version":1,"coins":99}'));assert.ok(await store.flush());
 const reopened=await openSaveStorage({localStorage:local,indexedDB:idb});assert.equal(readSavedValue(reopened,PROFILE,valid),'{"version":1,"coins":99}');
 const failed=await openSaveStorage({localStorage:local,indexedDB:null});assert.equal(writeSavedValue(failed,PROFILE,'{"version":1}'),false);assert.equal(writeSavedValue(failed,PROFILE,'{"version":1}'),false);assert.equal(failed.getItem(PROFILE),'{"version":1}');assert.equal(failed.persistent,false);assert.equal(await failed.flush(),false);assert.ok(failed.status().error);
});

test('a profile and run batch share one database transaction, including a deleted run, and surface async failures',async()=>{
 const local=memory(),idb=database(),store=await openSaveStorage({localStorage:local,indexedDB:idb});
 store.batch([[PROFILE,'{"version":1,"coins":100}'],[RUN,'{"version":1,"run":1}']]);assert.ok(await store.flush());assert.equal(idb.rows.get(PROFILE).value,'{"version":1,"coins":100}');assert.equal(idb.rows.get(RUN).value,'{"version":1,"run":1}');
 store.batch([[PROFILE,'{"version":1,"coins":125}'],[RUN,null]]);await store.flush();assert.equal(idb.rows.get(PROFILE).value,'{"version":1,"coins":125}');assert.equal(idb.rows.get(RUN).deleted,true);
 const blocked=memory();blocked.fail=()=>true;const bad=database(),unwritable=await openSaveStorage({localStorage:blocked,indexedDB:bad});bad.failWrites=true;assert.ok(writeSavedValue(unwritable,PROFILE,'{"version":1}'));assert.equal(await unwritable.flush(),false);assert.equal(unwritable.status().driver,'memory');assert.ok(unwritable.status().error);
});

test('partial local failures roll back a multi-key update while keeping exportable current-session data',async()=>{
 const local=memory(),store=await openSaveStorage({localStorage:local,indexedDB:null});store.batch([[PROFILE,'{"version":1,"coins":10}'],[RUN,'{"version":1,"run":1}']]);
 local.fail=key=>key===RUN;assert.equal(writeSavedValue(store,RUN,'{"version":1,"run":2}'),false);assert.equal(local.getItem(RUN),'{"version":1,"run":1}');assert.equal(store.getItem(RUN),'{"version":1,"run":2}');assert.equal(store.status().driver,'memory');
 const plain=memory({[RUN]:'{"version":1}',[RUN+'.backup']:'{"version":1}'});assert.ok(removeSavedValue(plain,RUN));assert.equal(plain.getItem(RUN+'.backup'),null);
});


test('a finished run stays deleted before its mirror transaction finishes, including failed local cleanup',async()=>{
 const local=memory(),idb=database(),store=await openSaveStorage({localStorage:local,indexedDB:idb});
 store.setItem(RUN,'{"version":1,"run":1}');store.setItem(RUN,'{"version":1,"run":2}');await store.flush();
 local.fail=key=>key===RUN||key===RUN+'.backup';assert.ok(removeSavedValue(store,RUN));
 assert.equal(readSavedValue(store,RUN,valid),null,'a pending deletion outranks the older live database mirror');
 assert.equal(store.getItem(RUN+'.backup'),null,'failed local cleanup cannot expose a stale backup');
 await store.flush();assert.equal(idb.rows.get(RUN).deleted,true);
});
