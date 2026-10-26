// Keep the historical keys stable across game builds. The database is a second
// local copy, not an account or a service, and shares the browser's origin rules.
import {connectCloud,readCloudRecord,writeCloudRecord} from './cloud-save.js';
export const SAVE_STORAGE_KEYS=['anime-survivors-progress-v1','anime-survivors-run-v1','anime-best','anime-survivors-spire-v1'];
export const SAVE_DATABASE='anime-survivors-local-saves-v1';
const META_KEY='anime-survivors-save-meta-v1';
const BACKUP_SUFFIX='.backup';
const rotating=key=>SAVE_STORAGE_KEYS.slice(0,2).includes(key);
const browserValue=name=>{try{return globalThis[name];}catch{return undefined;}};
const json=value=>{try{return JSON.parse(value||'null');}catch{return null;}};
const metadata=value=>value&&typeof value==='object'&&!Array.isArray(value)?value:{};

function openDatabase(factory,name,timeout=1500){
 if(!factory?.open)return Promise.resolve(null);
 return new Promise(resolve=>{
  let settled=false,timer;
  const finish=value=>{if(settled){value?.close?.();return;}settled=true;clearTimeout(timer);resolve(value);};
  try{
   const request=factory.open(name,1);
   request.onupgradeneeded=()=>{const db=request.result;if(!db.objectStoreNames.contains('saves'))db.createObjectStore('saves',{keyPath:'key'});};
   request.onsuccess=()=>finish(request.result);request.onerror=()=>finish(null);request.onblocked=()=>finish(null);
   timer=setTimeout(()=>finish(null),timeout);
  }catch{finish(null);}
 });
}
function readDatabase(db){
 if(!db)return Promise.resolve([]);
 return new Promise(resolve=>{try{const request=db.transaction('saves','readonly').objectStore('saves').getAll();request.onsuccess=()=>resolve(Array.isArray(request.result)?request.result:[]);request.onerror=()=>resolve([]);}catch{resolve([]);}});
}
function writeDatabase(db,records){
 return new Promise(resolve=>{try{const tx=db.transaction('saves','readwrite');tx.oncomplete=()=>resolve(true);tx.onabort=tx.onerror=()=>resolve(false);const store=tx.objectStore('saves');for(const record of records)store.put(record);}catch{resolve(false);}});
}

export async function openSaveStorage(options={}){
 const local=Object.prototype.hasOwnProperty.call(options,'localStorage')?options.localStorage:browserValue('localStorage');
 const factory=Object.prototype.hasOwnProperty.call(options,'indexedDB')?options.indexedDB:browserValue('indexedDB');
 const now=options.now||Date.now,records=new Map(),cache=new Map(),mirrored=new Map();
 let localAvailable=false,db=await openDatabase(factory,options.databaseName||SAVE_DATABASE,options.openTimeout??1500),idbAvailable=!!db;
 let recovered=false,lastSavedAt=null,pending=0,error=null,queue=Promise.resolve(),lastDurable=true;
 try{const probe='anime-survivors-save-probe';local.setItem(probe,'1');local.removeItem(probe);localAvailable=true;}catch{}
 let meta={};try{meta=metadata(json(local?.getItem(META_KEY)));}catch{}
 for(const key of SAVE_STORAGE_KEYS){
  let value=null,backup=null;try{value=local?.getItem(key)??null;backup=local?.getItem(key+BACKUP_SUFFIX)??null;}catch{}
  const m=metadata(meta[key]),deleted=m.deleted===true;
  const record={key,value:deleted?null:value,backup:deleted?null:backup,revision:Number(m.revision)||0,updatedAt:Number(m.updatedAt)||0,deleted};
  records.set(key,record);if(record.value!==null)cache.set(key,record.value);if(record.backup!==null)cache.set(key+BACKUP_SUFFIX,record.backup);
  if(record.updatedAt)lastSavedAt=Math.max(lastSavedAt||0,record.updatedAt);
 }
 const persisted=await readDatabase(db);
 for(const record of persisted){
  if(!SAVE_STORAGE_KEYS.includes(record?.key)||!Number.isFinite(record.revision))continue;
  mirrored.set(record.key,{...record});
  const current=records.get(record.key),newer=record.revision>current.revision;
  if(newer||record.revision===current.revision&&current.value===null&&!current.deleted&&typeof record.value==='string'){
   records.set(record.key,{...record});cache.delete(record.key);cache.delete(record.key+BACKUP_SUFFIX);
   if(!record.deleted&&typeof record.value==='string')cache.set(record.key,record.value);
   if(!record.deleted&&typeof record.backup==='string')cache.set(record.key+BACKUP_SUFFIX,record.backup);
   recovered=true;if(record.updatedAt)lastSavedAt=Math.max(lastSavedAt||0,record.updatedAt);
  }
 }
 const writeLocal=changed=>{
  if(!localAvailable)return false;
  const previous=[];let oldMeta;
  try{
   oldMeta=local.getItem(META_KEY);
   for(const record of changed){
    for(const key of [record.key,record.key+BACKUP_SUFFIX])previous.push([key,local.getItem(key)]);
    // A deletion is recorded in metadata first so an interrupted cleanup cannot
    // revive the previous checkpoint from a mirror or a rolling backup.
    meta[record.key]={revision:record.revision,updatedAt:record.updatedAt,deleted:record.deleted};
   }
   if(changed.some(record=>record.deleted))local.setItem(META_KEY,JSON.stringify(meta));
   for(const record of changed){
    if(record.deleted)local.removeItem(record.key);else local.setItem(record.key,record.value);
    if(record.backup===null||record.deleted)local.removeItem(record.key+BACKUP_SUFFIX);else local.setItem(record.key+BACKUP_SUFFIX,record.backup);
   }
   local.setItem(META_KEY,JSON.stringify(meta));return true;
  }catch{
   // If the database is also unavailable, preserve the previous durable save.
   for(const [key,value]of previous)try{if(value===null)local.removeItem(key);else local.setItem(key,value);}catch{}
   try{if(oldMeta===null)local.removeItem(META_KEY);else if(oldMeta!==undefined)local.setItem(META_KEY,oldMeta);}catch{}
   localAvailable=false;return false;
  }
 };
 const mirror=(changed,localDone)=>{
  if(!idbAvailable)return;
  pending++;
  queue=queue.then(async()=>{
   const done=await writeDatabase(db,changed);
   if(!done){idbAvailable=false;if(!localDone){lastDurable=false;error='Browser storage could not keep the latest save. Export a backup before closing.';}}
   else {for(const record of changed)mirrored.set(record.key,{...record});if(!localDone){lastDurable=true;error=null;}}
  }).catch(()=>{idbAvailable=false;if(!localDone){lastDurable=false;error='Browser storage could not keep the latest save. Export a backup before closing.';}}).finally(()=>pending--);
 };
 // Repair a recovered local copy immediately. Legacy values are mirrored only
 // after a caller validates them, so a corrupt local value cannot overwrite a
 // healthy database mirror while the profile/run parser is still starting.
 const initial=[...records.values()].filter(record=>record.value!==null||record.deleted);
 if(recovered)writeLocal(initial);
 const deletions=initial.filter(record=>record.deleted);
 if(deletions.length&&idbAvailable)mirror(deletions,localAvailable);
 // ---- Cloud copy (claude.ai artifact database) ----
 const cloudState={cloud:null,known:new Map(),pending:new Map(),timer:null,busy:Promise.resolve(),status:'connecting',syncedAt:null};
 const schedule=delay=>{if(cloudState.cloud&&cloudState.pending.size&&!cloudState.timer)cloudState.timer=setTimeout(pushCloud,delay);};
 function pushCloud(){
  clearTimeout(cloudState.timer);cloudState.timer=null;const cloud=cloudState.cloud;if(!cloud||!cloudState.pending.size)return cloudState.busy;
  const batch=[...cloudState.pending.values()];cloudState.pending.clear();
  cloudState.busy=cloudState.busy.then(async()=>{
   for(const record of batch){
    try{const chunks=await writeCloudRecord(cloud,record,cloudState.known.get(record.key)?.chunks||0);cloudState.known.set(record.key,{revision:record.revision,chunks});cloudState.status='synced';cloudState.syncedAt=now();}
    catch{cloudState.status='error';if(!cloudState.pending.has(record.key))cloudState.pending.set(record.key,record);}
   }
   if(cloudState.pending.size)schedule(30000);
  }).catch(()=>{});
  return cloudState.busy;
 }
 // Run saves change every few seconds; the cloud gets the latest value at most every 8 s per key.
 const queueCloud=changed=>{for(const record of changed)cloudState.pending.set(record.key,{...record,backup:null});schedule(options.cloudDelay??8000);};
 const applyCloud=rows=>{
  const changed=[];
  for(const [index,key]of SAVE_STORAGE_KEYS.entries()){
   const row=rows[index],current=records.get(key);
   if(!row){if(current.value!==null)cloudState.pending.set(key,{...current,backup:null});continue;}
   cloudState.known.set(key,{revision:row.revision,chunks:row.chunks});
   if(row.revision>current.revision){
    // The cloud copy is newer: it becomes current and the local value stays as its backup.
    const record={key,value:row.deleted?null:row.value,backup:row.deleted?null:current.value??current.backup,revision:row.revision,updatedAt:row.updatedAt,deleted:row.deleted};
    records.set(key,record);cache.delete(key);cache.delete(key+BACKUP_SUFFIX);if(record.value!==null)cache.set(key,record.value);if(record.backup!==null)cache.set(key+BACKUP_SUFFIX,record.backup);
    changed.push(record);lastSavedAt=Math.max(lastSavedAt||0,record.updatedAt);
   }else if(current.revision>row.revision&&(current.value!==null||current.deleted))cloudState.pending.set(key,{...current,backup:null});
  }
  if(changed.length){writeLocal(changed);mirror(changed,localAvailable);}
  schedule(1500);
  return changed.map(record=>record.key);
 };
 const cloudSource=Object.prototype.hasOwnProperty.call(options,'cloud')?Promise.resolve(options.cloud):connectCloud();
 const cloudLoad=cloudSource.then(async cloud=>{
  if(!cloud){cloudState.status='offline';return [];}
  const rows=await Promise.all(SAVE_STORAGE_KEYS.map(key=>readCloudRecord(cloud,key).catch(()=>undefined)));
  // If any read failed, never risk overwriting a newer cloud save with this device's copy.
  if(rows.includes(undefined)){cloudState.status='error';return [];}
  cloudState.cloud=cloud;cloudState.status='synced';cloudState.syncedAt=now();return applyCloud(rows);
 }).catch(()=>{cloudState.status='error';return [];});
 const adapter={
  getItem(key){key=String(key);if(key.endsWith(BACKUP_SUFFIX)&&records.get(key.slice(0,-BACKUP_SUFFIX.length))?.deleted)return null;if(cache.has(key))return cache.get(key);if(records.has(key))return null;try{return local?.getItem(key)??null;}catch{return null;}},
  setItem(key,value){return this.batch([[String(key),String(value)]]);},
  removeItem(key){return this.batch([[String(key),null]]);},
  batch(entries){
   if(!Array.isArray(entries))throw new TypeError('Save entries must be pairs.');
   const updates=new Map(entries.map(([key,value])=>[String(key),value===null?null:String(value)])),changed=[];
   for(const [key,value]of updates){
    const prior=records.get(key)||{key,value:null,backup:null,revision:0,updatedAt:0,deleted:false};
    if(prior.value===value&&(value!==null||prior.deleted))continue;
    const record={key,value,backup:value===null?null:rotating(key)&&prior.value!==null?prior.value:prior.backup,revision:Math.max(prior.revision+1,Math.floor(now())),updatedAt:now(),deleted:value===null};
    changed.push(record);records.set(key,record);cache.delete(key);cache.delete(key+BACKUP_SUFFIX);
    if(value!==null)cache.set(key,value);if(record.backup!==null)cache.set(key+BACKUP_SUFFIX,record.backup);
   }
   if(!changed.length){if(!lastDurable)throw new Error(error||'The latest save is only available for this session.');return true;}
   const localDone=writeLocal(changed);lastSavedAt=Math.max(...changed.map(record=>record.updatedAt));lastDurable=localDone||idbAvailable||!!cloudState.cloud;
   if(lastDurable)error=null;else error='Browser storage is unavailable. Export a backup before closing.';
   mirror(changed,localDone);queueCloud(changed);
   if(!lastDurable)throw new Error(error);
   return true;
  },
  recoverItem(key,value){
   const priorBackup=cache.get(key+BACKUP_SUFFIX)??null;
   this.setItem(key,value);
   const record=records.get(key);record.backup=priorBackup;cache.delete(key+BACKUP_SUFFIX);if(priorBackup!==null)cache.set(key+BACKUP_SUFFIX,priorBackup);
   recovered=true;writeLocal([record]);mirror([{...record}],localAvailable);queueCloud([record]);return value;
  },
  getRecoveryValues(key){if(records.get(key)?.deleted)return [];const record=mirrored.get(key);return record&&!record.deleted?[record.value,record.backup].filter(value=>typeof value==='string'):[];},
  confirmValid(key,value){const record=records.get(key),saved=mirrored.get(key);if(record&&record.value===value&&idbAvailable&&saved?.revision!==record.revision)mirror([{...record}],localAvailable);},
  async flush(){await queue;return lastDurable;},
  // Sends pending cloud writes now, e.g. when the tab is hidden or closed.
  flushCloud(){return pushCloud();},
  get persistent(){return localAvailable||idbAvailable||!!cloudState.cloud;},
  status(){return {driver:localAvailable?(idbAvailable?'localStorage + IndexedDB':'localStorage'):idbAvailable?'IndexedDB':'memory',persistent:this.persistent,lastSavedAt,recovered,pending:pending>0,error,cloud:cloudState.status,cloudSyncedAt:cloudState.syncedAt||null};},
  close(){db?.close?.();clearTimeout(cloudState.timer);},
 };
 // Wait briefly for the cloud copy so a newer save from another version or device
 // is in place before the game reads it; a later arrival is applied and reported.
 const early=await Promise.race([cloudLoad.then(keys=>({keys})),new Promise(resolve=>setTimeout(()=>resolve(null),options.cloudTimeout??8000))]);
 if(!early)cloudLoad.then(keys=>{if(keys.length)options.onRemoteChange?.(keys);});
 return adapter;
}

// Validators consume raw strings so run saves can use their Map/Set decoder.
// Plain Storage objects remain supported by tests, legacy callers and imports.
export function readSavedValue(storage,key,validate=()=>true){
 const good=value=>{if(typeof value!=='string')return false;try{return !!validate(value);}catch{return false;}};
 let current=null;try{current=storage?.getItem(key)??null;}catch{}
 if(good(current)){storage?.confirmValid?.(key,current);return current;}
 let backup=null;try{backup=[...(storage?.getRecoveryValues?.(key)||[]),storage?.getItem(key+BACKUP_SUFFIX)].find(good)??null;}catch{}
 if(backup===null)return null;
 try{if(storage?.recoverItem)storage.recoverItem(key,backup);else storage?.setItem(key,backup);}catch{}
 return backup;
}
export function writeSavedValue(storage,key,value){try{storage.setItem(key,String(value));return true;}catch{return false;}}
export function removeSavedValue(storage,key){try{storage?.removeItem(key);if(!storage?.batch)storage?.removeItem(key+BACKUP_SUFFIX);return true;}catch{return false;}}
