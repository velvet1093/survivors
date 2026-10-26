import {ITEMS,FUSIONS,CHARACTERS,fusionIngredients,fusionBase,fusionReady,forbiddenItem} from './game.js';
import {icon} from './icons.js';
import {rarityFor,rarityBadge} from './rarity.js';

// In-run recipe index. It opens over whatever is on screen (a level-up, a chest,
// the pause menu or live combat) and closes back to it without touching the run.
const state={filter:null,query:''};
const esc=s=>String(s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'})[c]);
// How far the player is along one ingredient.
function part(p,f,id){
 const item=ITEMS[id],base=fusionBase(f),evo=id===base&&f.requiresEvolution?FUSIONS.find(x=>x.id===f.requiresEvolution):null;
 const inv=item.type==='weapon'?p.weapons:p.passives,rank=inv[id]||0;
 const done=evo?p.fusions[base]===evo.id&&rank>=item.max:item.fusionOnly?rank>=item.max:rank>=item.max;
 return {id,iconId:evo?evo.id:id,name:evo?evo.name:item.name,rank,max:item.max,done,owned:rank>0,evolution:!!evo};
}
export function recipeStatus(p,f){
 const parts=fusionIngredients(f).map(id=>part(p,f,id)),base=fusionBase(f);
 const active=p.fusions[base]===f.id||!!(f.resultItem&&(p.weapons[f.resultItem]||p.passives[f.resultItem]));
 const locked=!!f.requiredCharacter&&f.requiredCharacter!==p.id||parts.some(x=>!ITEMS[x.id].fusionOnly&&forbiddenItem(p,x.id));
 const ready=!active&&!locked&&fusionReady(p,f);
 return {parts,active,locked,ready,owned:parts.some(x=>x.owned),done:parts.filter(x=>x.done).length};
}
function card(p,f){
 const s=recipeStatus(p,f),r=rarityFor(f.id),hero=f.requiredCharacter&&CHARACTERS.find(c=>c.id===f.requiredCharacter)?.name;
 const chip=s.active?'ACTIVE':s.ready?'READY TO FUSE':s.locked?(hero?hero.toUpperCase()+' ONLY':'NOT AVAILABLE NOW'):`${s.done} / ${s.parts.length} MAXED`;
 return `<article class="index-recipe ${s.ready?'ready':''} ${s.active?'active':''} ${s.locked?'locked':''}" data-rarity="${r.id}" style="--item:${f.color};--rarity:${r.color}">
 <div class="index-recipe-head"><span class="item-art">${icon(f.id)}</span><div>${rarityBadge(f.id)}<h3>${esc(f.name)}</h3></div><b class="index-chip">${chip}</b></div>
 <div class="index-parts">${s.parts.map(x=>`<span class="index-part ${x.done?'done':x.owned?'owned':''}" title="${esc(x.name)}">${icon(x.iconId)}<small>${esc(x.name)}</small><em>${x.evolution?(x.done?'EVOLVED ✓':'EVOLUTION'):x.done?'MAX ✓':x.owned?'LV '+x.rank+' / '+x.max:'NEED LV '+x.max}</em></span>`).join('<i aria-hidden="true">+</i>')}</div>
 <p>${esc(f.description.includes('→')?f.description.split('→').slice(1).join('→').trim():f.description)}</p></article>`;
}
function list(p){
 const q=state.query.toLowerCase().trim();
 const rows=FUSIONS.filter(f=>{const s=recipeStatus(p,f);if(state.filter==='ready'&&!s.ready)return false;if(state.filter==='mine'&&!(s.owned||s.active))return false;return !q||[f.name,...fusionIngredients(f).map(id=>ITEMS[id].name)].join(' ').toLowerCase().includes(q);});
 const order=f=>{const s=recipeStatus(p,f);return s.ready?0:s.active?1:s.locked?4:s.owned?2:3;};
 return rows.sort((a,b)=>order(a)-order(b)||recipeStatus(p,b).done-recipeStatus(p,a).done).map(f=>card(p,f)).join('')||'<p class="index-empty">No recipes match. Try ALL or clear the search.</p>';
}
export function showRecipeIndex(host,g,{onClose}={}){
 const p=g.p;state.filter??='mine';
 if(state.filter==='mine'&&!FUSIONS.some(f=>recipeStatus(p,f).owned))state.filter='all';
 const filters=[['mine','USES MY ITEMS'],['ready','READY'],['all','ALL']];
 const render=()=>{host.innerHTML=`<div class="modal-backdrop recipe-index-backdrop"><section class="modal recipe-index" role="dialog" aria-modal="true" aria-labelledby="recipe-index-title"><div class="recipe-index-heading"><div><span class="eyebrow">RECIPE INDEX · YOUR CURRENT LOADOUT</span><h2 id="recipe-index-title">Every fusion, at a glance.</h2></div><button class="icon-button" id="close-recipe-index" aria-label="Close recipe index">×</button></div><div class="recipe-index-filters"><input id="recipe-index-query" type="search" placeholder="Search a fusion or ingredient" value="${esc(state.query)}" aria-label="Search recipes">${filters.map(([id,label])=>`<button data-index-filter="${id}" aria-pressed="${state.filter===id}">${label}</button>`).join('')}</div><p class="recipe-index-note">Max every ingredient, then a level-up or chest offers the fusion first. Green ticks are complete; levels show your progress.</p><div class="recipe-index-list" id="recipe-index-list">${list(p)}</div><button class="primary" id="recipe-index-back">BACK <span aria-hidden="true">↩</span></button></section></div>`;
  const close=()=>{host.innerHTML='';onClose?.();};
  host.querySelector('#close-recipe-index').onclick=close;host.querySelector('#recipe-index-back').onclick=close;
  host.querySelectorAll('[data-index-filter]').forEach(b=>b.onclick=()=>{state.filter=b.dataset.indexFilter;render();});
  const q=host.querySelector('#recipe-index-query');q.oninput=()=>{state.query=q.value;host.querySelector('#recipe-index-list').innerHTML=list(p);};
 };
 render();host.querySelector('#recipe-index-query').focus({preventScroll:true});
}
export const recipeIndexOpen=host=>!!host?.querySelector('.recipe-index');
