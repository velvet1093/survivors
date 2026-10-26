import {CHARACTERS} from './game.js';
import {portrait} from './portraits.js';
import {icon,SPECIAL_ICONS} from './icons.js';
import {TIER_CATEGORIES,TIERS,tierEntries,filterTierEntries,TIER_BASIS} from './tier-lists.js';

const escape=value=>String(value??'').replace(/[&<>"']/g,char=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
const heroFor=id=>CHARACTERS.find(hero=>hero.id===id);
function entryArt(entry,profile){
 const hero=heroFor(entry.heroId||entry.id);
 if(entry.kind==='character'&&hero)return portrait(hero,profile?.skins?.[hero.id]||'default');
 return icon(entry.icon||(entry.kind==='ultimate'?SPECIAL_ICONS[entry.heroId]:entry.id));
}
function entrySubtitle(entry){
 if(entry.subtitle)return entry.subtitle;
 if(entry.kind==='character')return heroFor(entry.heroId||entry.id)?.series||'CHARACTER';
 if(entry.kind==='ultimate')return heroFor(entry.heroId)?.name||'ULTIMATE';
 return entry.evolved?'EVOLUTION / FUSION':'BASE ITEM';
}
// Simulated-run results, when the entry has them, shown as a compact stat strip.
function measuredStrip(entry){
 const m=entry.measured;if(!m?.stats?.length)return '';
 return `<div class="tier-measured" aria-label="Simulated run results"><small>MEASURED · ${escape(m.label)}</small><dl>${m.stats.map(([label,value])=>`<div><dt>${escape(label)}</dt><dd>${escape(value)}</dd></div>`).join('')}</dl></div>`;
}
/** Opens a read-only balance guide. The caller owns pausing and resuming a run. */
export function showTierList(host,{category='characters',onClose,profile=null}={}){
 let active=TIER_CATEGORIES.some(tab=>tab.id===category)?category:'characters',query='',form='all',selected=null;
 const close=()=>{if(onClose)onClose();else host.innerHTML='';};
 host.innerHTML=`<div class="modal-backdrop tier-list-backdrop"><section class="modal tier-list-modal" role="dialog" aria-modal="true" aria-labelledby="tier-list-title"><header class="tier-heading"><div><span class="tier-eyebrow">THE RIFT / BUILD GUIDE</span><h2 id="tier-list-title">The tier lists.</h2></div><button id="close-tier-list" class="icon-button tier-close" aria-label="Close tier list">×</button></header><div class="tier-guide-intro"><strong>CURRENT BALANCE</strong><p>Compare the roster, shape your build and explore every evolution.</p><details class="tier-basis"><summary>How these rankings work <span aria-hidden="true">⌄</span></summary><p>${escape(TIER_BASIS)}</p><p id="tier-category-criteria"></p><dl class="tier-definitions">${TIERS.map(tier=>`<div style="--tier-color:${tier.color}"><dt>${escape(tier.id)} · ${escape(tier.label)}</dt><dd>${escape(tier.description)}</dd></div>`).join('')}</dl><p>Entries within a tier are alphabetical. Tap an entry for the comparison behind its rank, its limitations and when to choose it.</p></details></div><div class="tier-tabs" role="tablist" aria-label="Tier list category">${TIER_CATEGORIES.map(tab=>`<button id="tier-tab-${tab.id}" role="tab" data-tier-category="${tab.id}" aria-controls="tier-results">${escape(tab.label)}</button>`).join('')}</div><div class="tier-tools"><div class="tier-search"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true"><circle cx="10.5" cy="10.5" r="6.5"/><path d="m16 16 5 5"/></svg><input id="tier-query" type="search" placeholder="Search a name, anime or effect…" aria-label="Search tier list" autocomplete="off"><button id="clear-tier-query" aria-label="Clear tier list search" hidden>×</button></div><select id="tier-form" aria-label="Filter item tier list"><option value="all">All forms</option><option value="base">Base items</option><option value="evolved">Evolutions & fusions</option></select></div><div class="tier-list-context"><p id="tier-category-description"></p><span id="tier-result-count" role="status" aria-live="polite"></span></div><div id="tier-results" class="tier-results" role="tabpanel" tabindex="0"></div><div class="tier-footer"><span>${TIERS.map(tier=>`<i aria-hidden="true" style="--tier-color:${tier.color}">${escape(tier.id)}</i> ${escape(tier.label)}`).join(' ')}</span><small>Rankings guide choices; your build still matters.</small></div></section></div>`;
 const root=host.querySelector('.tier-list-modal'),results=root.querySelector('#tier-results'),search=root.querySelector('#tier-query'),formSelect=root.querySelector('#tier-form'),clearButton=root.querySelector('#clear-tier-query');
 function renderResults(){
  const entries=filterTierEntries(active,{query,form}),all=tierEntries(active),scroll=results.scrollTop;
  if(selected&&!entries.some(entry=>entry.id===selected))selected=null;
  root.querySelector('#tier-result-count').textContent=`${entries.length} / ${all.length} ${active==='passives'?'passive items':active}`;
  clearButton.hidden=!query;
  results.innerHTML=entries.length?TIERS.map(tier=>{
   const group=entries.filter(entry=>entry.tier===tier.id);if(!group.length)return '';
   const chosen=group.find(entry=>entry.id===selected),detail=chosen?`<article class="tier-entry-detail" id="tier-detail-${tier.id}" style="--entry-color:${chosen.color};--tier-color:${tier.color}" aria-label="${escape(chosen.name)} ranking details" tabindex="-1"><div class="tier-detail-heading"><b class="tier-detail-badge" title="${escape(tier.description)}">${escape(tier.id)}</b><div><span>${escape(tier.label)} / ${escape(entrySubtitle(chosen))}</span><h3>${escape(chosen.name)}</h3></div><button class="tier-detail-close" data-tier-collapse aria-label="Close ${escape(chosen.name)} details">×</button></div><p class="tier-verdict">${escape(chosen.reason)}</p>${measuredStrip(chosen)}<div class="tier-rank-reason"><small>WHY ${escape(tier.id)} TIER</small><p>${escape(chosen.comparison)}</p></div><div class="tier-detail-copy"><div><small>HOLDING IT BACK</small><p>${escape(chosen.caution)}</p></div><div><small>BEST WITH</small><p>${escape(chosen.bestWith)}</p></div></div>${chosen.description?`<details class="tier-ability-description"><summary>${chosen.kind==='character'?'READ THE KIT':chosen.kind==='ultimate'?'READ THE ABILITY':'READ THE ITEM'}</summary><p>${escape(chosen.description)}</p></details>`:''}<button class="tier-return" data-tier-collapse-end>BACK TO ENTRIES <span aria-hidden="true">↑</span></button></article>`:'';
   return `<section class="tier-row" style="--tier-color:${tier.color}" aria-labelledby="tier-label-${tier.id}"><div class="tier-row-label"><h3 id="tier-label-${tier.id}">${escape(tier.id)}</h3><span>${escape(tier.label)}</span><small>${group.length}</small></div><div class="tier-row-content"><div class="tier-entry-grid">${group.map(entry=>`<button class="tier-entry ${entry.id===selected?'selected':''} ${entry.kind==='character'?'tier-character':''}" data-tier-entry="${escape(entry.id)}" style="--entry-color:${entry.color}" aria-label="${escape(entry.name)}, ${tier.id} tier. Show ranking details." aria-expanded="${entry.id===selected}"${entry.id===selected?` aria-controls="tier-detail-${tier.id}"`:''}><span class="tier-entry-art">${entryArt(entry,profile)}</span><strong>${escape(entry.name)}</strong><small>${escape(entrySubtitle(entry))}</small>${entry.evolved?'<span class="tier-evolved-mark" aria-label="Evolved or fused">✦</span>':''}</button>`).join('')}</div>${detail}</div></section>`;
  }).join(''):`<div class="tier-empty"><span aria-hidden="true">◇</span><h3>No matches in this branch.</h3><p>Try another name, effect or form.</p><button id="reset-tier-filters">CLEAR FILTERS</button></div>`;
  results.scrollTop=scroll;
  results.querySelectorAll('[data-tier-entry]').forEach(button=>button.onclick=()=>{
   const id=button.dataset.tierEntry;selected=selected===id?null:id;renderResults();
   const updated=Array.from(results.querySelectorAll('[data-tier-entry]')).find(entry=>entry.dataset.tierEntry===id);updated?.focus({preventScroll:true});
   if(selected){const detail=results.querySelector('.tier-entry-detail');if(detail)results.scrollTop+=detail.getBoundingClientRect().top-results.getBoundingClientRect().top-8;detail?.focus({preventScroll:true});}
  });
  const collapse=()=>{const id=selected;selected=null;renderResults();const entry=Array.from(results.querySelectorAll('[data-tier-entry]')).find(entry=>entry.dataset.tierEntry===id);if(entry){const box=entry.getBoundingClientRect(),view=results.getBoundingClientRect();if(box.top<view.top||box.bottom>view.bottom)results.scrollTop+=box.top-view.top-8;}entry?.focus({preventScroll:true});};
  results.querySelector('[data-tier-collapse]')?.addEventListener('click',collapse);results.querySelector('[data-tier-collapse-end]')?.addEventListener('click',collapse);
  results.querySelector('#reset-tier-filters')?.addEventListener('click',()=>{query='';form='all';search.value='';formSelect.value='all';renderResults();search.focus({preventScroll:true});});
 }
 function setCategory(value){
  active=value;query='';form='all';selected=null;search.value='';formSelect.value='all';formSelect.hidden=!['weapons','passives'].includes(active);
  root.querySelectorAll('[data-tier-category]').forEach(button=>{const current=button.dataset.tierCategory===active;button.classList.toggle('active',current);button.setAttribute('aria-selected',String(current));button.tabIndex=current?0:-1;});
  root.querySelector('#tier-category-criteria').textContent=TIER_CATEGORIES.find(tab=>tab.id===active).criteria;results.setAttribute('aria-labelledby','tier-tab-'+active);root.querySelector('#tier-category-description').textContent=TIER_CATEGORIES.find(tab=>tab.id===active).description;results.scrollTop=0;renderResults();
 }
 root.querySelector('#close-tier-list').onclick=close;
 root.querySelectorAll('[data-tier-category]').forEach(button=>{
  button.onclick=()=>setCategory(button.dataset.tierCategory);
  button.onkeydown=event=>{const keys=['ArrowRight','ArrowLeft','Home','End'];if(!keys.includes(event.key))return;event.preventDefault();const index=TIER_CATEGORIES.findIndex(tab=>tab.id===active),next=event.key==='Home'?0:event.key==='End'?TIER_CATEGORIES.length-1:(index+(event.key==='ArrowRight'?1:-1)+TIER_CATEGORIES.length)%TIER_CATEGORIES.length;setCategory(TIER_CATEGORIES[next].id);root.querySelector('#tier-tab-'+active).focus({preventScroll:true});};
 });
 search.oninput=()=>{query=search.value;selected=null;results.scrollTop=0;renderResults();};
 formSelect.onchange=()=>{form=formSelect.value;selected=null;results.scrollTop=0;renderResults();};
 clearButton.onclick=()=>{query='';search.value='';selected=null;renderResults();search.focus({preventScroll:true});};
 setCategory(active);root.querySelector('#close-tier-list').focus({preventScroll:true});
 return {close};
}
