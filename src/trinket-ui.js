import {TRINKETS,trinketMaxRefinement,trinketStarCount,trinketName,trinketFor,trinketIcon,trinketRefinement,trinketDescription,chooseTrinket,refineTrinket,ignoreTrinket,unequipTrinket} from './trinkets.js';
import {eventTriggerFor,isEventTrigger} from './event-trigger-items.js';
import {eventUseBlockReason} from './world-event-ui.js';
const equipped=g=>g.trinkets?.equipped||[null,null,null];
const explanation='Enemies sometimes drop anime keepsakes or event items. Walk over one to compare it, then equip it in one of three slots. Keepsake duplicates refine up to +3; Dragon Balls allow seven refinements to summon Shenron. Event items stay stored until you explicitly use them from their slot. Each new run starts with empty slots.';
const rankName=(rank,id)=>isEventTrigger(id)?'ONE USE':id==='dragonmarble'?`${trinketStarCount(rank)} STARS`:rank?`+${rank}`:'BASE';
const eventName=id=>({eclipse:'ECLIPSE',storm:'THUNDERSTORM',blizzard:'BLIZZARD'}[id]||'WORLD EVENT');
const storedTag='<div class="trinket-event-tag">STORED EVENT ITEM · ONE USE</div>';
function refinementProgress(rank,id){
 const max=trinketMaxRefinement(id);
 return `<div class="trinket-refinement-progress ${id==='dragonmarble'?'dragon-refinements':''}" aria-label="Refined ${rank} of ${max} times"><strong>${rankName(rank,id)}</strong><span aria-hidden="true">${Array.from({length:max},(_,i)=>`<i class="${i<rank?'filled':''}"></i>`).join('')}</span><small>${rank===max?'FULLY REFINED':`${rank} / ${max} REFINEMENTS`}</small></div>`;
}
export function trinketRow(g){
 return `<div class="trinket-row" role="group" aria-label="Three trinket slots"><span>TRK</span>${equipped(g).map((id,i)=>{const t=trinketFor(id),rank=trinketRefinement(g,id),description=trinketDescription(id,rank),trigger=isEventTrigger(id);return `<button class="trinket-slot ${t?'equipped':'empty'} ${rank?'refined':''} ${trigger?'event-item':''}" data-trinket-slot="${i}" style="--trinket:${t?.color||'#bda8d2'}" aria-label="${t?trinketName(id,rank)+', '+rankName(rank,id)+'. '+description:'Empty trinket slot '+(i+1)+'. About trinkets.'}" title="${t?trinketName(id,rank)+' · '+rankName(rank,id)+' · '+description:'Trinket slot '+(i+1)+' · Enemy drops'}">${t?trinketIcon(id,rank):'<span>◇</span>'}<small>${trigger?'USE':id==='dragonmarble'?trinketStarCount(rank)+'★':t&&rank?'+'+rank:i+1}</small></button>`;}).join('')}<small class="trinket-slot-caption">ENEMY<br>DROPS</small></div>`;
}
export function trinketCatalog(){
 return TRINKETS.map(t=>`<article class="codex-item trinket-catalog-item" style="--item:${t.color}"><span class="trinket-catalog-art">${trinketIcon(t.id)}</span><div><small>${t.series.toUpperCase()} · ${isEventTrigger(t.id)?'EVENT ITEM':'TRINKET'}</small><h3>${t.name}</h3><p>${trinketDescription(t.id)}</p>${isEventTrigger(t.id)?'<p class="trinket-event-note"><b>KEEP FOR LATER</b> Equip in a trinket slot, then open that slot to use it. One use; no refinements.</p>':`<p class="trinket-catalog-refinement"><b>AT +${trinketMaxRefinement(t.id)}</b> ${trinketDescription(t.id,trinketMaxRefinement(t.id))}</p>`}</div></article>`).join('');
}
export function showTrinketOffer(host,g,{onResolved}){
 const t=trinketFor(g.trinkets?.pending?.itemId);if(!t)return false;
 const trigger=isEventTrigger(t.id),duplicate=equipped(g).includes(t.id),rank=trinketRefinement(g,t.id),canRefine=!trigger&&duplicate&&rank<trinketMaxRefinement(t.id);
 let choice;
 if(trigger&&duplicate){
  choice=`${storedTag}<p class="trinket-description">${trinketDescription(t.id)}</p><p class="trinket-choice-note">You already carry this event item. Open its equipped slot when you are ready to use it. A second copy does not activate or refine it.</p>`;
 }else if(duplicate){
  choice=`${refinementProgress(rank,t.id)}${canRefine?`<div class="trinket-refinement-compare"><div><small>CURRENT / ${rankName(rank,t.id)}</small><p>${trinketDescription(t.id,rank)}</p></div><span aria-hidden="true">↓</span><div class="trinket-next-effect"><small>REFINED / +${rank+1}</small><p>${trinketDescription(t.id,rank+1)}</p></div></div><button id="refine-trinket" class="primary">${t.id==='dragonmarble'&&rank===6&&!g.trinkets.wish?.summoned?'SUMMON SHENRON':'REFINE TO +'+(rank+1)} <span aria-hidden="true">✦</span></button><p class="trinket-choice-note">Use this duplicate to improve your equipped trinket. No extra slot needed.${t.id==='dragonmarble'?' The seventh refinement summons Shenron for one wish per run.':''}</p>`:'<p class="trinket-description">This keepsake is already fully refined.</p>'}`;
 }else{
  choice=`${trigger?storedTag:''}<p class="trinket-description">${trinketDescription(t.id)}</p><div class="trinket-slot-heading"><strong>CHOOSE A SLOT</strong><span>${equipped(g).filter(Boolean).length} / 3 EQUIPPED</span></div><div class="trinket-equip-slots">${equipped(g).map((id,i)=>{const old=trinketFor(id),oldRank=trinketRefinement(g,id);return `<button data-equip-trinket="${i}" class="${old?'occupied':''}" style="--slot-color:${old?.color||t.color}"><small>SLOT ${i+1}${old?' / '+rankName(oldRank,id):''}</small><span class="trinket-replace-icon">${old?trinketIcon(id,oldRank):'<i>◇</i>'}</span><strong>${old?trinketName(id,oldRank):'Empty slot'}</strong><span class="trinket-replace-description">${old?trinketDescription(id,oldRank):'Room for a new keepsake.'}</span><b>${old?'REPLACE':trigger?'STORE HERE':'EQUIP HERE'} <span aria-hidden="true">→</span></b></button>`;}).join('')}</div><p class="trinket-choice-note">${trigger?'Picking it up only stores it. Open its slot later and choose USE EVENT ITEM to summon the event. ':''}Replacing discards the old trinket and its refinements.${trigger?'':' Duplicates refine keepsakes up to +3, or Dragon Balls up to +7 to summon Shenron.'}</p>`;
 }
 host.innerHTML=`<div class="modal-backdrop"><section class="modal trinket-modal ${duplicate&&!trigger?'trinket-refinement-modal':''} ${trigger?'trinket-event-modal':''}" role="dialog" aria-modal="true" aria-labelledby="trinket-offer-title" style="--trinket:${t.color}"><span class="eyebrow">${trigger?(duplicate?'ALREADY STORED / EVENT ITEM':'EVENT ITEM / KEEP FOR LATER'):duplicate?'DUPLICATE FOUND / REFINE YOUR KEEPSAKE':'ENEMY DROP / A LITTLE SOMETHING'}</span><div class="trinket-offer-art">${trinketIcon(t.id,rank)}</div><small class="trinket-series">${t.series}</small><h2 id="trinket-offer-title">${trinketName(t.id,rank)}</h2>${choice}<button id="leave-trinket" class="secondary">LEAVE THIS TRINKET</button><span class="trinket-pause-note">Combat is paused while you choose.</span></section></div>`;
 host.querySelectorAll('[data-equip-trinket]').forEach(button=>button.onclick=()=>{if(chooseTrinket(g,Number(button.dataset.equipTrinket)))onResolved();});
 host.querySelector('#refine-trinket')?.addEventListener('click',()=>{if(refineTrinket(g))onResolved();});
 host.querySelector('#leave-trinket').onclick=()=>{if(ignoreTrinket(g))onResolved();};
 (host.querySelector('#refine-trinket')||host.querySelector(`[data-equip-trinket="${Math.max(0,equipped(g).findIndex(id=>!id))}"]`)||host.querySelector('#leave-trinket')).focus({preventScroll:true});return true;
}
export function showTrinketDetails(host,g,slot,{onResume,onChange,onUseEvent}={}){
 const render=(message='')=>{
  const t=trinketFor(equipped(g)[slot]),rank=trinketRefinement(g,t?.id),trigger=eventTriggerFor(t?.id),blocked=trigger?eventUseBlockReason(g):'',available=trigger&&!blocked&&typeof onUseEvent==='function';
  const eventControls=trigger?`${storedTag}<p class="event-item-availability ${blocked?'blocked':''}" id="event-item-availability" role="status">${blocked||message||'Ready when you are. Using this item starts its event here, consumes the item and frees this slot.'}</p><button id="use-event-trinket" class="primary" ${available?'':'disabled'}><span>USE EVENT ITEM</span><small>SUMMON ${eventName(trigger.eventId)}</small></button><p class="trinket-choice-note">Keep it equipped to use later. Event items grant no passive bonus and cannot be refined.</p>`:'';
  host.innerHTML=`<div class="modal-backdrop"><section class="modal trinket-detail" role="dialog" aria-modal="true" aria-labelledby="trinket-detail-title" style="--trinket:${t?.color||'#c3add9'}"><span class="eyebrow">TRINKETS / SLOT ${slot+1} OF 3</span>${t?`<div class="trinket-offer-art">${trinketIcon(t.id,rank)}</div><small class="trinket-series">${t.series}</small>`:'<div class="trinket-empty-symbol" aria-hidden="true">◇</div>'}<h2 id="trinket-detail-title">${t?trinketName(t.id,rank):'Little finds. Small joys.'}</h2>${t&&!trigger?refinementProgress(rank,t.id):''}<p>${t?trinketDescription(t.id,rank):explanation}</p>${eventControls}${t?`${trigger?'':rank<trinketMaxRefinement(t.id)?`<div class="trinket-next-effect"><small>NEXT / +${rank+1}</small><p>${trinketDescription(t.id,rank+1)}</p></div><p class="trinket-choice-note">Find another copy from enemies to refine this trinket.${t.id==='dragonmarble'?' Seven refinements summon Shenron for one wish per run.':''}</p>`:'<p class="trinket-choice-note">All refinements complete.</p>'}<p class="trinket-choice-note">Replacing or removing discards this trinket${trigger?'':' and its refinements'}.</p><button id="remove-trinket" class="secondary">REMOVE THIS TRINKET</button>`:'<p class="trinket-choice-note">Three trinkets per run. Small perks, playful effects and stored event items. Your weapon and passive slots stay separate.</p>'}<button id="close-trinket-detail" class="primary">BACK TO THE FIGHT <span aria-hidden="true">↗</span></button></section></div>`;
  host.querySelector('#close-trinket-detail').onclick=()=>onResume?.();
  host.querySelector('#remove-trinket')?.addEventListener('click',()=>{if(unequipTrinket(g,slot)){onChange?.();onResume?.();}});
  host.querySelector('#use-event-trinket')?.addEventListener('click',()=>{
   if(!available||eventUseBlockReason(g))return;
   if(onUseEvent(slot)===true){onChange?.();host.innerHTML='';}
   else render(eventUseBlockReason(g)||'The event could not start. Your item is still stored; you can try again later.');
  });
  (available?host.querySelector('#use-event-trinket'):host.querySelector('#close-trinket-detail')).focus({preventScroll:true});
 };
 render();
}
