import {trainingRifts,trainingOpenRift,trainingRoster,trainingSpawn,trainingItems,setItemLevel,trainingFusions,grantFusion,grantTrinket,setGodMode,setNaturalSpawns,clearEnemies,fullHeal,readyUltimate,levelUp} from './training.js';
import {TRINKETS,trinketIcon} from './trinkets.js';
import {ITEMS,MAX_SLOTS,CHARACTERS} from './game.js';
import {ANIME_NAMES} from './anime-enemies.js';
import {enemyPixels} from './pixel-enemies.js';
import {pixelsSvg} from './pixel-characters.js';
import {icon} from './icons.js';
import {rarityBadge} from './rarity.js';

// The Training panel: summon anything, grant any item, fusion or trinket, and toggle
// sandbox tools. Choices persist between openings so repeated tests are quick.
const ui={tab:'summon',query:'',kind:'all',count:1,elite:false,phase2:false,itemType:'all'};
const portraits=new Map();
const KIND_LABEL={enemy:'ENEMY',boss:'BOSS',rift:'RIFT BOSS',event:'EVENT BOSS'};
const esc=s=>String(s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'})[c]);
const match=(...text)=>!ui.query||text.join(' ').toLowerCase().includes(ui.query.toLowerCase().trim());

function summonGrid(){
 const list=trainingRoster().filter(e=>(ui.kind==='all'||e.kind===ui.kind)&&match(e.name,e.id,ANIME_NAMES[e.family]||''));
 return list.map(e=>`<button class="training-card" data-summon="${e.id}" style="--item:${e.color||'#c3add9'}"><span class="training-sprite">${portraitFor(e)}</span><small>${KIND_LABEL[e.kind]} · ${esc(ANIME_NAMES[e.family]||e.family)}</small><strong>${esc(e.name)}</strong></button>`).join('')||'<p class="training-empty">No matches.</p>';
}
function portraitFor(e){const key=e.id+(ui.phase2&&e.kind!=='enemy'?'|2':'');if(!portraits.has(key))portraits.set(key,`<svg viewBox="0 0 56 76" shape-rendering="crispEdges" aria-hidden="true">${pixelsSvg(enemyPixels(e.id,ui.phase2&&e.kind!=='enemy'?{enraged:1}:{}))}</svg>`);return portraits.get(key);}
function riftGrid(){
 return trainingRifts().filter(r=>match(r.name,r.title,ANIME_NAMES[r.family]||'')).map(r=>`<button class="training-card" data-rift="${r.id}" style="--item:${r.color||'#c3add9'}"><span class="training-sprite">${portraitFor({id:r.id,kind:'rift'})}</span><small>${esc(r.title)}</small><strong>${esc(r.name)}</strong></button>`).join('')||'<p class="training-empty">No matches.</p>';
}
function itemRows(g){
 const p=g.p,items=trainingItems(p).filter(i=>(ui.itemType==='all'||i.type===ui.itemType)&&match(i.name,i.id)).sort((a,b)=>(b.level>0)-(a.level>0)||a.locked-b.locked||a.name.localeCompare(b.name));
 return items.map(i=>`<div class="training-row ${i.level?'owned':''}" style="--item:${ITEMS[i.id].color||'#c3add9'}"><span class="training-icon">${icon(i.id)}</span><div>${rarityBadge(i.id)}<small>${i.type.toUpperCase()}${i.fused?' · FUSED':''}${i.locked?' · UNAVAILABLE':''}</small><strong>${esc(i.name)}</strong><span class="training-level">${i.level?'LV '+i.level+' / '+i.max:'NOT EQUIPPED'}</span></div><div class="training-actions">${i.locked?'':`<button data-level="${i.id}" data-to="${i.level-1}" ${i.level?'':'disabled'} aria-label="Lower ${esc(i.name)}">−</button><button data-level="${i.id}" data-to="${i.level+1}" ${i.level>=i.max?'disabled':''} aria-label="Raise ${esc(i.name)}">+</button><button data-level="${i.id}" data-to="${i.max}" ${i.level>=i.max?'disabled':''}>MAX</button><button data-level="${i.id}" data-to="0" ${i.level?'':'disabled'}>REMOVE</button>`}</div></div>`).join('')||'<p class="training-empty">No matches.</p>';
}
function fusionRows(g){
 return trainingFusions(g.p).filter(f=>match(f.name,f.id)).map(f=>`<div class="training-row ${f.active?'owned':''}" style="--item:${f.color||'#c3add9'}"><span class="training-icon">${icon(f.id)}</span><div>${rarityBadge(f.id)}<small>${f.active?'ACTIVE':f.locked?(f.required?(CHARACTERS.find(c=>c.id===f.required)?.name||f.required).toUpperCase()+' ONLY':'NOT AVAILABLE FOR THIS HERO OR FORM'):'FUSION'} · ${f.ingredients.map(id=>ITEMS[id]?.name||id).map(esc).join(' + ')}</small><strong>${esc(f.name)}</strong></div><div class="training-actions"><button data-fusion="${f.id}" ${f.active||f.locked?'disabled':''}>${f.active?'OWNED':'GRANT'}</button></div></div>`).join('')||'<p class="training-empty">No matches.</p>';
}
function trinketRows(){
 return TRINKETS.filter(t=>match(t.name,t.series)).map(t=>`<div class="training-row" style="--item:${t.color}"><span class="training-icon">${trinketIcon(t.id)}</span><div><small>${esc(t.series.toUpperCase())}</small><strong>${esc(t.name)}</strong></div><div class="training-actions"><button data-trinket="${t.id}">GIVE</button></div></div>`).join('')||'<p class="training-empty">No matches.</p>';
}
function tools(g){
 const t=g.training,toggle=(id,on,label,detail)=>`<button class="training-toggle" data-tool="${id}" aria-pressed="${on}"><strong>${label}</strong><span>${on?'ON':'OFF'}</span><small>${detail}</small></button>`;
 return `<div class="training-tools">${toggle('god',t.god,'GOD MODE','Take no damage or status ticks.')}${toggle('natural',t.natural,'NATURAL SPAWNS','Waves, boss waves, world events and rifts run as in Survival.')}
 <button class="training-toggle" data-tool="clear"><strong>CLEAR THE FIELD</strong><small>Remove every enemy, warning and projectile.</small></button>
 <button class="training-toggle" data-tool="heal"><strong>FULL HEAL</strong><small>Restore HP and shield and clear statuses.</small></button>
 <button class="training-toggle" data-tool="ultimate"><strong>READY ULTIMATE</strong><small>Reset ultimate, second ultimate and dash cooldowns.</small></button>
 <button class="training-toggle" data-tool="level"><strong>LEVEL UP</strong><small>Fill the XP bar and open a normal level-up choice.</small></button></div>`;
}
function body(g){
 if(ui.tab==='summon')return `<div class="training-filters"><input id="training-query" type="search" placeholder="Search enemies, bosses or anime" value="${esc(ui.query)}" aria-label="Search the roster"><select id="training-kind" aria-label="Kind">${['all','enemy','boss','rift','event'].map(k=>`<option value="${k}" ${ui.kind===k?'selected':''}>${k==='all'?'ALL':KIND_LABEL[k]+'S'}</option>`).join('')}</select><label>COUNT <select id="training-count">${[1,3,5,10,25].map(n=>`<option ${ui.count===n?'selected':''}>${n}</option>`).join('')}</select></label><label><input type="checkbox" id="training-elite" ${ui.elite?'checked':''}> ELITE</label><label><input type="checkbox" id="training-phase2" ${ui.phase2?'checked':''}> BOSS PHASE II</label></div><p class="training-hint">Tap to summon around you. Bosses are limited to 3 at a time per tap; elite applies to ordinary enemies.</p><div class="training-grid" id="training-list">${summonGrid()}</div>`;
 if(ui.tab==='rifts')return `<div class="training-filters"><input id="training-query" type="search" placeholder="Search rifts" value="${esc(ui.query)}" aria-label="Search rifts"></div><p class="training-hint">Choose a calamity to open its rift portal beside you, then step in to get the usual rift prompt: its own arena, the half-health challenge and the rift reward. Opening a rift clears the field.</p><div class="training-grid" id="training-list">${riftGrid()}</div>`;
 if(ui.tab==='items'){const p=g.p;return `<div class="training-filters"><input id="training-query" type="search" placeholder="Search weapons and passives" value="${esc(ui.query)}" aria-label="Search items"><select id="training-type" aria-label="Item type">${['all','weapon','passive'].map(k=>`<option value="${k}" ${ui.itemType===k?'selected':''}>${k.toUpperCase()}</option>`).join('')}</select><span class="training-slots">WEAPONS ${Object.keys(p.weapons).length} / ${MAX_SLOTS} · PASSIVES ${Object.keys(p.passives).length} / ${MAX_SLOTS}</span></div><div class="training-rows" id="training-list">${itemRows(g)}</div>`;}
 if(ui.tab==='fusions')return `<div class="training-filters"><input id="training-query" type="search" placeholder="Search fusions" value="${esc(ui.query)}" aria-label="Search fusions"></div><p class="training-hint">Granting a fusion equips its ingredients at max rank first, including earlier evolutions. Free slots if it says they are full.</p><div class="training-rows" id="training-list">${fusionRows(g)}</div>`;
 if(ui.tab==='trinkets')return `<div class="training-filters"><input id="training-query" type="search" placeholder="Search trinkets" value="${esc(ui.query)}" aria-label="Search trinkets"></div><p class="training-hint">Giving a trinket opens the usual equip or refine prompt.</p><div class="training-rows" id="training-list">${trinketRows()}</div>`;
 return tools(g);
}
function list(g){return ui.tab==='summon'?summonGrid():ui.tab==='rifts'?riftGrid():ui.tab==='items'?itemRows(g):ui.tab==='fusions'?fusionRows(g):ui.tab==='trinkets'?trinketRows():'';}

export function showTrainingPanel(host,g,{spawn,onClose,onChange,onTrinket}){
 const tabs=[['summon','SUMMON'],['rifts','RIFTS'],['items','ITEMS'],['fusions','FUSIONS'],['trinkets','TRINKETS'],['tools','TOOLS']];
 let status='';
 const render=()=>{
  const scroll=host.querySelector('#training-list')?.scrollTop||0;
  host.innerHTML=`<div class="modal-backdrop"><section class="modal training-panel" role="dialog" aria-modal="true" aria-labelledby="training-title"><div class="training-heading"><div><span class="eyebrow">TRAINING MODE · NOTHING HERE IS SAVED TO YOUR PROFILE</span><h2 id="training-title">The training grounds.</h2></div><button class="icon-button" id="close-training" aria-label="Close training panel">×</button></div><div class="training-tabs" role="tablist">${tabs.map(([id,label])=>`<button role="tab" data-training-tab="${id}" aria-selected="${ui.tab===id}" class="${ui.tab===id?'active':''}">${label}</button>`).join('')}</div><p class="training-status" role="status">${esc(status)}</p>${body(g)}<button class="primary" id="training-resume">BACK TO THE FIGHT ${icon('arrow')}</button></section></div>`;
  const listEl=host.querySelector('#training-list');if(listEl)listEl.scrollTop=scroll;
  bind();
 };
 const refreshList=()=>{const el=host.querySelector('#training-list');if(el){el.innerHTML=list(g);bindList();}};
 const say=text=>{status=text;const el=host.querySelector('.training-status');if(el)el.textContent=text;};
 const bindList=()=>{
  host.querySelectorAll('[data-summon]').forEach(b=>b.onclick=()=>{const made=trainingSpawn(g,b.dataset.summon,{count:ui.count,elite:ui.elite,phase2:ui.phase2},spawn);say(made.length?`Summoned ${made.length} × ${made[0].name}.`:'Nothing could be summoned.');onChange?.();});
  host.querySelectorAll('[data-rift]').forEach(b=>b.onclick=()=>{const why=trainingOpenRift(g,b.dataset.rift);if(why){say(why);return;}onChange?.();onClose();});
  host.querySelectorAll('[data-level]').forEach(b=>b.onclick=()=>{const why=setItemLevel(g,b.dataset.level,+b.dataset.to);say(why||`${ITEMS[b.dataset.level].name} set to ${+b.dataset.to?'level '+b.dataset.to:'removed'}.`);onChange?.();render();});
  host.querySelectorAll('[data-fusion]').forEach(b=>b.onclick=()=>{const why=grantFusion(g,b.dataset.fusion);say(why||'Fusion granted.');onChange?.();render();});
  host.querySelectorAll('[data-trinket]').forEach(b=>b.onclick=()=>{if(grantTrinket(g,b.dataset.trinket))onTrinket?.();else say('Finish the current trinket prompt first.');});
 };
 const bind=()=>{
  host.querySelector('#close-training').onclick=onClose;host.querySelector('#training-resume').onclick=onClose;
  host.querySelectorAll('[data-training-tab]').forEach(b=>b.onclick=()=>{ui.tab=b.dataset.trainingTab;ui.query='';status='';render();});
  const q=host.querySelector('#training-query');if(q)q.oninput=()=>{ui.query=q.value;refreshList();};
  const on=(id,fn)=>{const el=host.querySelector(id);if(el)el.onchange=()=>{fn(el);refreshList();};};
  on('#training-kind',el=>ui.kind=el.value);on('#training-count',el=>ui.count=+el.value);on('#training-elite',el=>ui.elite=el.checked);on('#training-phase2',el=>ui.phase2=el.checked);on('#training-type',el=>ui.itemType=el.value);
  host.querySelectorAll('[data-tool]').forEach(b=>b.onclick=()=>{
   const t=b.dataset.tool;
   if(t==='god'){setGodMode(g,!g.training.god);say('God mode '+(g.training.god?'on.':'off.'));}
   else if(t==='natural'){setNaturalSpawns(g,!g.training.natural);say('Natural spawns '+(g.training.natural?'on.':'off.'));}
   else if(t==='clear'){clearEnemies(g);say('The field is clear.');}
   else if(t==='heal'){fullHeal(g);say('Fully healed.');}
   else if(t==='ultimate'){readyUltimate(g);say('Ultimate and dash are ready.');}
   else if(t==='level'){levelUp(g);onChange?.();onClose();return;}
   onChange?.();render();
  });
  bindList();
 };
 render();host.querySelector('#training-query,[data-training-tab].active')?.focus();
}
