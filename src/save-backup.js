import {SAVE_KEY,sanitizeProfile} from './progression.js';
import {RUN_SAVE_KEY,loadRun} from './run-save.js';

export const BACKUP_FORMAT='anime-survivors-backup';
export const BACKUP_VERSION=1;
export const BACKUP_FILENAME='anime-survivors-backup.json';
const MAX_BACKUP_BYTES=16*1024*1024;
const object=value=>!!value&&typeof value==='object'&&!Array.isArray(value);
const score=value=>Number.isFinite(value)?Math.max(0,Math.floor(value)):0;
const validProfile=value=>object(value)&&value.version===1&&object(value.characters)&&object(value.general);
const temporaryStorage=run=>({getItem:key=>key===RUN_SAVE_KEY?run:null});

// Keep the checkpoint's existing Map/Set/Infinity encoding byte-for-byte. The
// regular loader still validates and migrates it before it can enter a game.
function validRun(raw){return typeof raw==='string'&&raw.length<=MAX_BACKUP_BYTES&&!!loadRun(temporaryStorage(raw));}
export function createSaveBackup(profile,storage,{now=Date.now()}={}){
 const clean=sanitizeProfile(profile);
 let run=null,best=clean.bestKills;
 try{const raw=storage?.getItem(RUN_SAVE_KEY);if(raw&&validRun(raw))run=raw;best=Math.max(best,score(Number(storage?.getItem('anime-best')||0)));}catch{}
 return {format:BACKUP_FORMAT,version:BACKUP_VERSION,exportedAt:new Date(now).toISOString(),profile:clean,run,bestKills:best};
}

export function parseSaveBackup(input){
 if(typeof input==='string'&&input.length>MAX_BACKUP_BYTES)throw Error('This backup is too large.');
 let raw;try{raw=typeof input==='string'?JSON.parse(input):input;}catch{throw Error('Choose an Anime Survivors backup file.');}
 const legacy=validProfile(raw)&&raw.format===undefined;
 if(!legacy&&(!object(raw)||raw.format!==BACKUP_FORMAT||raw.version!==BACKUP_VERSION||!validProfile(raw.profile)||!Object.hasOwn(raw,'run')||!(raw.run===null||typeof raw.run==='string')))throw Error('Choose an Anime Survivors backup file.');
 const profile=sanitizeProfile(legacy?raw:raw.profile),run=legacy?null:raw.run;
 if(run!==null&&!validRun(run))throw Error('This backup has an invalid saved run. Your current save is unchanged.');
 return {profile,run,bestKills:Math.max(profile.bestKills,legacy?0:score(raw.bestKills)),legacy};
}

// Import stages validation first, then writes profile, ledger and checkpoint as
// one adapter batch. A legacy profile cannot keep an unrelated run's earnings.
export async function importSaveBackup(profile,storage,input){
 const parsed=parseSaveBackup(input);
 if(!storage?.getItem||!storage?.setItem||!storage?.removeItem)throw Error('Saving is unavailable in this browser.');
 const entries=[[SAVE_KEY,JSON.stringify(parsed.profile)],[RUN_SAVE_KEY,parsed.run],['anime-best',String(parsed.bestKills)]];
 const previous=entries.map(([key])=>[key,storage.getItem(key)]);
 const write=values=>{if(storage.batch)return storage.batch(values);for(const [key,value]of values){if(value===null)storage.removeItem(key);else storage.setItem(key,value);}};
 try{
  write(entries);
  if(storage.flush&&await storage.flush()===false)throw Error('Could not save this backup.');
 }catch{
  try{write(previous);if(storage.flush)await storage.flush();}catch{}
  throw Error('Could not store this backup. Your current save is unchanged.');
 }
 // Clear stale properties before replacing the existing shared profile object.
 for(const key of Object.keys(profile))delete profile[key];
 Object.assign(profile,parsed.profile);
 return {legacy:parsed.legacy,hasRun:parsed.run!==null,profile,bestKills:parsed.bestKills};
}
