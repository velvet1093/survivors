import {CHARACTERS,ITEMS} from './game.js';
import {SKINS,skinFor} from './skins.js';
import {portrait} from './portraits.js';
import {icon} from './icons.js';
import {prestigeState,masteryLevel} from './progression.js';
import {ULTIMATES} from './ultimates.js';
import {FRIEREN_BARRAGE} from './frieren-barrage.js';
import {erzaWeaponAppearance} from './erza-equipment.js';

const escape=value=>String(value??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const normalize=value=>String(value??'').normalize('NFD').replace(/\p{Diacritic}/gu,'').toLowerCase().trim();
const roles=['Striker','Sorcerer','Assassin','Magical Girl','Apothecary','EVA Pilot','Ice General','Time Spirit','Elven Mage','Bounty Hunter','Summoner','Titan Shifter','Star Rage','Stand User','Slime Sovereign','Author of Miracles','Requip Knight','Black Swordsman','Chainsaw Hybrid'];
export const heroRole=hero=>roles[CHARACTERS.indexOf(hero)]||'Legend';
// Five readable ratings for the showcase: the authored power, attack speed and range
// scores, plus health and mobility scaled from each hero's base stats.
const scale=(value,low,step)=>Math.max(1,Math.min(5,Math.round((value-low)/step)+1));
export function heroStats(hero){
 return [
  {id:'power',label:'POWER',value:hero.power,detail:''},
  {id:'speed',label:'ATTACK SPEED',value:hero.speed,detail:''},
  {id:'range',label:'RANGE',value:hero.range,detail:''},
  {id:'health',label:'HEALTH',value:scale(hero.hp,95,15),detail:hero.hp+' HP'},
  {id:'mobility',label:'MOBILITY',value:scale(hero.move,205,17),detail:hero.move+' MOVE'},
 ];
}
const searchText=CHARACTERS.map((hero,i)=>normalize([hero.name,hero.id,hero.title,hero.series,roles[i],ITEMS[hero.weapon].name,ULTIMATES[hero.id].name,hero.id==='frieren'?FRIEREN_BARRAGE.name:'',...SKINS[hero.id].map(s=>s.pilot||'')].join(' ')));
const magnifier='<svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.7"><circle cx="10.5" cy="10.5" r="6.5"/><path d="m15.5 15.5 5 5"/></svg>';

export function selectionTools(){
 const series=[...new Set(CHARACTERS.map(c=>c.series))].sort((a,b)=>a.localeCompare(b));
 return `<div class="section-heading roster-heading"><h2 id="legend-heading"><span>01 /</span> CHOOSE YOUR LEGEND</h2><span id="roster-count">${CHARACTERS.length} LEGENDS</span></div><div class="roster-tools"><label class="roster-search" for="character-search">${magnifier}<input id="character-search" type="search" placeholder="Search legends or anime" aria-label="Search characters, anime or abilities" autocomplete="off" spellcheck="false" aria-controls="character-roster"></label><select id="character-series" aria-label="Filter by anime series" aria-controls="character-roster"><option value="all">All anime series</option>${series.map(s=>`<option value="${escape(s)}">${escape(s)}</option>`).join('')}</select><button id="clear-character-search" type="button" hidden>RESET</button></div><p id="roster-status" class="roster-status" role="status" aria-live="polite" hidden></p>`;
}

export function characterCards(profile,selected){
 return CHARACTERS.map((hero,i)=>{
  const rank=prestigeState(profile,hero.id).rank,role=roles[i]||'Legend',level=masteryLevel(profile,hero.id);
  return `<button type="button" class="character ${i===selected?'selected':''}" data-character="${i}" data-hero="${hero.id}" style="--accent:${hero.color}" aria-pressed="${i===selected}" aria-label="${escape(hero.name+' · '+hero.series+' · '+role+(i===selected?' · selected':''))}"><span class="character-stage"><span class="character-number" aria-hidden="true">${String(i+1).padStart(2,'0')}</span>${rank?`<span class="hero-prestige-badge">✦ P${rank}</span>`:''}<span class="selection-indicator" aria-hidden="true">${i===selected?'✓':''}</span><span class="portrait"><span class="portrait-halo"></span>${portrait(hero,profile.skins[hero.id])}</span></span><span class="character-meta"><small>${escape(hero.series)}</small><strong>${escape(hero.name)}</strong><span class="character-tags"><span class="role">${escape(role.toUpperCase())}</span><span class="mastery-tag">LV ${level}</span></span></span></button>`;
 }).join('');
}

const selectedName=(hero,profile)=>{const skin=skinFor(hero.id,profile.skins[hero.id]);return skin.pilot||hero.name;};
export function selectedProfileHeading(hero,profile){
 const skin=skinFor(hero.id,profile.skins[hero.id]),rank=prestigeState(profile,hero.id).rank,level=masteryLevel(profile,hero.id),outfits=SKINS[hero.id].length;
 const stats=heroStats(hero).map(s=>`<div class="hero-stat" data-stat="${s.id}"><dt>${s.label}${s.detail?`<small>${s.detail}</small>`:''}</dt><dd aria-label="${s.value} out of 5">${Array.from({length:5},(_,i)=>`<i class="${i<s.value?'on':''}"></i>`).join('')}</dd></div>`).join('');
 return `<div class="selected-profile-heading hero-showcase-top"><div class="showcase-stage" aria-hidden="true"><span class="showcase-number">${String(CHARACTERS.indexOf(hero)+1).padStart(2,'0')}</span><span class="showcase-glow"></span><span class="showcase-floor"></span><span class="profile-portrait showcase-portrait">${portrait(hero,skin.id)}</span></div><div class="profile-identity"><span class="small-label">${escape(hero.title)}</span><h2>${escape(selectedName(hero,profile))}</h2><p>${escape(hero.series)}${skin.unit?' · '+escape(skin.unit):''}${skin.id!=='default'?' · '+escape(skin.name):''}</p><div class="showcase-tags"><span>${escape(heroRole(hero).toUpperCase())}</span><span>MASTERY LV ${level}</span>${rank?`<span class="prestige-tag">✦ PRESTIGE ${rank}</span>`:''}<span>${outfits} OUTFIT${outfits===1?'':'S'}</span></div></div><dl class="hero-stats">${stats}</dl><button class="profile-change" id="change-character" type="button">CHOOSE ANOTHER LEGEND</button></div>`;
}
export function selectionDock(hero,profile){
 return `<aside class="selection-dock" aria-label="Selected character shortcuts" style="--accent:${hero.color}" hidden><span class="selection-dock-portrait" aria-hidden="true">${portrait(hero,profile.skins[hero.id])}</span><div class="selection-dock-copy"><small>SELECTED LEGEND</small><strong>${escape(selectedName(hero,profile))}</strong></div><button id="view-character" type="button">VIEW PROFILE</button><button id="choose-map" type="button">CHOOSE MAP</button></aside>`;
}

// DOM replacement must not send a keyboard user back to the start of the page.
export function captureSelectionView(host){
 if(!host.querySelector('.shell'))return null;
 const active=document.activeElement;let selector=null;
 if(host.contains(active)){
  for(const attr of ['data-character','data-skin','data-pet','data-mode','data-map'])if(active.hasAttribute(attr)){selector=`[${attr}="${CSS.escape(active.getAttribute(attr))}"]`;break;}
  if(!selector&&active.id)selector='#'+CSS.escape(active.id);
 }
 return {x:window.scrollX,y:window.scrollY,rosterScroll:host.querySelector('#character-roster')?.scrollLeft||0,selector,hero:host.querySelector('.character.selected')?.dataset.hero,outfitScroll:host.querySelector('.skin-options')?.scrollLeft||0};
}
export function restoreSelectionView(host,view){
 if(!view)return;
 window.scrollTo({left:view.x,top:view.y,behavior:'instant'});
 const roster=host.querySelector('#character-roster');if(roster)roster.scrollLeft=view.rosterScroll||0;
 if(view.hero===host.querySelector('.character.selected')?.dataset.hero){const rail=host.querySelector('.skin-options');if(rail)rail.scrollLeft=view.outfitScroll;}
 const active=view.selector&&host.querySelector(view.selector);if(active&&!active.hidden)active.focus({preventScroll:true});
}

export function bindCharacterSelection(host,state,{reducedMotion=false}={}){
 const search=host.querySelector('#character-search'),series=host.querySelector('#character-series'),clear=host.querySelector('#clear-character-search'),cards=[...host.querySelectorAll('[data-character]')],empty=host.querySelector('#roster-empty'),count=host.querySelector('#roster-count'),status=host.querySelector('#roster-status'),shell=host.querySelector('.shell'),dock=host.querySelector('.selection-dock');
 search.value=state.query;series.value=state.series;
 function filter(announce=false){
  state.query=search.value;state.series=series.value;const terms=normalize(state.query).split(/\s+/).filter(Boolean);let visible=0;
  for(const card of cards){const i=Number(card.dataset.character),matches=(state.series==='all'||CHARACTERS[i].series===state.series)&&terms.every(term=>searchText[i].includes(term));card.hidden=!matches;if(matches)visible++;}
  const filtered=!!terms.length||state.series!=='all';count.textContent=filtered?`${visible} / ${CHARACTERS.length} LEGENDS`:`${CHARACTERS.length} LEGENDS`;empty.hidden=visible>0;clear.hidden=!filtered;
  status.textContent=announce?(visible?`${visible} ${visible===1?'legend matches':'legends match'}.`:'No legends match. Try another name or reset the filters.'):'';status.hidden=!announce;
 }
 const reset=()=>{state.query='';state.series='all';search.value='';series.value='all';filter(true);search.focus({preventScroll:true});};
 search.oninput=()=>filter(true);series.onchange=()=>filter(true);clear.onclick=reset;host.querySelector('#reset-roster').onclick=reset;
 search.onkeydown=e=>{if(e.key==='Escape'){e.preventDefault();reset();}};filter();
 const jump=selector=>{const target=host.querySelector(selector);if(!target)return;target.focus({preventScroll:true});target.scrollIntoView({behavior:reducedMotion?'auto':'smooth',block:'start'});};
 host.querySelector('#view-character').onclick=()=>jump('#character-profile');host.querySelector('#choose-map').onclick=()=>jump('#map-selection');host.querySelector('#change-character').onclick=()=>{jump('#legend-heading');search.focus({preventScroll:true});};
 const rail=host.querySelector('.skin-options'),outfit=rail?.querySelector('.active');if(outfit){const a=outfit.getBoundingClientRect(),b=rail.getBoundingClientRect();rail.scrollLeft+=a.left-b.left-(b.width-a.width)/2;}
 let observer;
 if(typeof IntersectionObserver==='function'){
  const visible=new Set();observer=new IntersectionObserver(entries=>{for(const e of entries)e.isIntersecting?visible.add(e.target):visible.delete(e.target);dock.hidden=visible.size===0;shell.classList.toggle('has-selection-dock',!dock.hidden);},{threshold:0});
  observer.observe(host.querySelector('#character-select'));observer.observe(host.querySelector('#character-profile'));
 }else{dock.hidden=false;shell.classList.add('has-selection-dock');}
 return {dispose(){observer?.disconnect();}};
}
