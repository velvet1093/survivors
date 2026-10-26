import {createSaveBackup,importSaveBackup,BACKUP_FILENAME} from './save-backup.js';
import {loadRun} from './run-save.js';
import {formatTime} from './game.js';

function storageStatus(storage){
 try{if(storage?.status)return {persistent:storage.persistent??false,...storage.status()};}catch{}
 return {persistent:!!storage,driver:storage?'browser':'memory',lastSavedAt:null,recovered:false};
}
function savedLabel(status){
 if(!status.persistent)return 'SESSION ONLY';
 if(status.pending)return 'SAVING LOCALLY…';
 if(status.cloud==='synced')return 'CLOUD SYNC ON';
 return status.recovered?'LOCAL BACKUP RECOVERED':'AUTOSAVE ON';
}
function dateLabel(time){return time?new Date(time).toLocaleString(undefined,{month:'short',day:'numeric',hour:'numeric',minute:'2-digit'}):'';}
const escape=value=>String(value).replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;');

export function showSaveManager(host,profile,storage,{onClose,onImport,beforeExport}={}){
 const status=storageStatus(storage),run=loadRun(storage),skills=Object.values(profile.general||{}).reduce((a,b)=>a+b,0)+Object.values(profile.characters||{}).reduce((sum,c)=>sum+Object.values(c.skills||{}).reduce((a,b)=>a+b,0),0);
 host.innerHTML=`<div class="modal-backdrop"><section class="modal save-manager" role="dialog" aria-modal="true" aria-labelledby="save-manager-title"><div class="save-manager-heading"><div><span class="eyebrow">YOUR NEXT CHAPTER</span><h2 id="save-manager-title">Save & backup.</h2></div><button id="close-save-manager" class="icon-button" aria-label="Close save manager">×</button></div><div class="save-local-state ${status.persistent?'':'session-only'}"><i aria-hidden="true"></i><div><strong id="local-save-label">${savedLabel(status)}</strong><span id="local-save-time">${status.cloud==='synced'?'Synced to your claude.ai account'+(status.cloudSyncedAt?' · '+dateLabel(status.cloudSyncedAt):'')+' · kept across game updates and devices.':status.persistent?(status.lastSavedAt?'Saved '+dateLabel(status.lastSavedAt):'Progress stays in this browser between sessions.'):'Export a backup to keep this session’s progress.'}</span></div></div><p>Coins, skills, prestige, outfits and your unfinished run save locally. Updates opened at the same browser address keep this save automatically.</p><div class="save-summary"><span><b>${Math.floor(profile.coins||0).toLocaleString()}</b>COINS</span><span><b>${skills}</b>SKILL RANKS</span><span><b>${run?'CONTINUE':'READY'}</b>${run?escape((run.p.displayName||run.p.name)+' · '+formatTime(run.time)):'NO RUN IN PROGRESS'}</span></div><div class="save-transfer-note"><strong>Taking your save to an update?</strong><p>Export a backup here, then import it if the update opens at a different address or in another browser. The file includes your profile and saved run.</p></div><div class="save-manager-buttons"><button class="primary" id="export-backup">EXPORT BACKUP</button><label class="secondary save-import-label" tabindex="0">IMPORT BACKUP<input id="import-backup" type="file" accept="application/json,.json"></label></div><p class="save-import-note">Import replaces your local progress and saved run. Older profile-only saves are also supported.</p><details class="save-text-tools"><summary>Copy or paste a backup</summary><label for="backup-text">BACKUP TEXT</label><textarea id="backup-text" spellcheck="false" autocomplete="off" placeholder="Paste an exported Anime Survivors backup here."></textarea><div><button class="secondary" id="copy-backup">COPY CURRENT BACKUP</button><button class="secondary" id="restore-backup-text">IMPORT TEXT</button></div></details><p id="save-manager-status" role="status" aria-live="polite"></p></section></div>`;
 const panel=host.querySelector('.save-manager'),message=host.querySelector('#save-manager-status'),textarea=host.querySelector('#backup-text');
 let busy=false;
 const say=(text,error=false)=>{message.textContent=text;message.classList.toggle('save-error',error);};
 const close=()=>{if(!busy)onClose?.();};
 host.querySelector('#close-save-manager').onclick=close;
 const refresh=()=>{const next=storageStatus(storage);host.querySelector('#local-save-label').textContent=savedLabel(next);host.querySelector('#local-save-time').textContent=next.cloud==='synced'?'Synced to your claude.ai account'+(next.cloudSyncedAt?' · '+dateLabel(next.cloudSyncedAt):'')+' · kept across game updates and devices.':next.persistent?(next.lastSavedAt?'Saved '+dateLabel(next.lastSavedAt):'Progress stays in this browser between sessions.'):'Export a backup to keep this session’s progress.';};
 const backupText=async()=>{await beforeExport?.();if(storage?.flush)await storage.flush();refresh();return JSON.stringify(createSaveBackup(profile,storage),null,2);};
 host.querySelector('#export-backup').onclick=async()=>{
  try{const text=await backupText(),url=URL.createObjectURL(new Blob([text],{type:'application/json'})),a=document.createElement('a');a.href=url;a.download=BACKUP_FILENAME;a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);say('Backup exported with your profile and saved run.');}catch{say('Could not download. Use Copy current backup below.',true);}
 };
 const restore=async text=>{
  if(busy)return;busy=true;panel.setAttribute('aria-busy','true');
  try{const result=await importSaveBackup(profile,storage,text);refresh();say(result.legacy?'Profile imported. Start a new run with your restored progress.':result.hasRun?'Backup imported. Your saved run is ready to continue.':'Backup imported. Your progress is restored.');await onImport?.(result);}catch(error){say(error.message||'Could not import this backup.',true);}finally{busy=false;panel.removeAttribute('aria-busy');}
 };
 const file=host.querySelector('#import-backup');file.onchange=async()=>{const selected=file.files?.[0];if(!selected)return;try{await restore(await selected.text());}catch{say('Could not read this file.',true);}file.value='';};
 const label=host.querySelector('.save-import-label');label.onkeydown=e=>{if(['Enter','Space'].includes(e.code)){e.preventDefault();file.click();}};
 host.querySelector('#copy-backup').onclick=async()=>{try{const text=await backupText();textarea.value=text;try{await navigator.clipboard.writeText(text);say('Backup copied. Paste it in the updated game to restore.');}catch{textarea.focus();textarea.select();say('Backup text is selected. Copy it using your device’s copy command.');}}catch{say('Could not prepare a backup.',true);}};
 host.querySelector('#restore-backup-text').onclick=()=>restore(textarea.value);
 panel.onkeydown=e=>{
  if(e.code==='Escape'){e.preventDefault();e.stopPropagation();close();return;}
  if(e.code!=='Tab')return;
  const controls=[...panel.querySelectorAll('button,input,textarea,summary,[tabindex="0"]')].filter(el=>!el.disabled&&el.getClientRects().length),first=controls[0],last=controls.at(-1);
  if(e.shiftKey&&document.activeElement===first){e.preventDefault();last?.focus();}else if(!e.shiftKey&&document.activeElement===last){e.preventDefault();first?.focus();}
 };
 host.querySelector('#close-save-manager').focus({preventScroll:true});
 return {refresh};
}
