import {WORLD_EVENTS} from './world-event-data.js';
import {EVENT_TRIGGER_ITEMS} from './event-trigger-items.js';
import {canStartWorldEvent} from './world-events.js';

const escape=value=>String(value??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const eventFor=id=>WORLD_EVENTS.find(event=>event.id===id);
const weatherNames={clear:'Clear skies',rain:'Rainfall',snow:'Snowfall'};
const weatherColors={clear:'#d6c5a0',rain:'#a4c4df',snow:'#c7e3ed'};
const signs={
 ghostparade:'<path d="M4 18V8a6 6 0 0 1 12 0v10l-3-2-3 2-3-2zM7 8v2m6-2v2M8 13h4"/>',
 tombwake:'<path d="M4 19V7l6-5 6 5v12M2 19h16M8 9h4m-2-2v6M6 4 4 2m10 2 2-2"/>',
 eclipse:'<circle cx="10" cy="10" r="7"/><path d="M10 0v2m0 16v2M0 10h2m16 0h2M3 3l1 1m12 12 1 1M3 17l1-1M16 4l1-1"/>',
 storm:'<path d="M5 10a4 4 0 0 1 0-8 5 5 0 0 1 8 0 4 4 0 0 1 2 8M11 8l-5 6h4l-1 5 6-8h-4z"/>',
 blizzard:'<path d="M10 1v18M2 5l16 10M2 15 18 5M7 3l3 3 3-3M7 17l3-3 3 3M3 8l4 1-1-4M14 15l-1-4 4 1M3 12l4-1-1 4M14 5l-1 4 4-1"/>',
 rain:'<path d="M4 10a4 4 0 0 1 1-8 5 5 0 0 1 8 0 4 4 0 0 1 2 8H4m1 3-2 4m7-4-2 4m7-4-2 4"/>',
 snow:'<path d="M10 1v18M2 5l16 10M2 15 18 5M7 3l3 3 3-3M7 17l3-3 3 3"/>',
 clear:'<circle cx="10" cy="10" r="4"/><path d="M10 0v3m0 14v3M0 10h3m14 0h3M3 3l2 2m10 10 2 2M3 17l2-2M15 5l2-2"/>',
};
export function worldEventSymbol(id){return `<svg viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${signs[id]||signs.clear}</svg>`;}

// Details open while combat is paused. Availability uses the state that will
// resume, without changing it or spending the stored item.
export function eventUseBlockReason(g){
 if(!g||g.mode==='bossrush')return 'World events are unavailable in Boss Rush.';
 if((g.p?.hp??1)<=0||g.status==='over')return 'Start a living run to use this item.';
 const pending=g.status==='paused'?(g.resumeStatus||'playing'):g.status;
 if(pending!=='playing')return 'Finish the current choice before using an event item.';
 if(g.events?.active)return 'Clear the current world event before summoning another.';
 if(g.riftArena||g.rifts?.active||g.rifts?.portal)return 'Finish or leave the current rift first.';
 if(g.bossIntro)return 'Wait until the boss entrance ends.';
 if(g.enemies?.some(e=>e.boss&&(e.hp>0||e.hp<=0&&!e.deathComplete)))return 'Defeat the current boss and let its final animation finish.';
 if(g.trinkets?.pending||g.trinkets?.wish?.pending)return 'Resolve the current trinket or wish first.';
 const wave=g.waveState;if(wave?.version===1&&wave.index%5===0&&!wave.bossSpawned)return 'The next regular boss is arriving. Defeat it first.';
 if(!canStartWorldEvent({...g,status:'playing',resumeStatus:undefined}))return 'Finish the current encounter before summoning this event.';
 return '';
}

// The string changes only when the weather or objective changes, so the main
// HUD can reuse it without announcing a timer every animation frame.
export function worldEventHud(g){
 if(!g?.events||g.mode==='bossrush'||g.riftArena||g.rifts?.active)return '';
 const active=g.events.active,def=eventFor(active?.id);
 if(def){
  const living=(g.enemies||[]).filter(e=>e.hp>0&&e.eventSerial===active.serial),adds=living.filter(e=>e.eventEnemy&&!e.eventBoss).length;
  const boss=living.find(e=>e.eventBoss||e.id===active.bossEntityId),bossAlive=!!boss||(!active.bossDefeated&&!!active.bossEntityId);
  const objective=bossAlive?`Defeat the event boss${adds?' · '+adds+' '+(adds===1?'invader':'invaders'):''}`:adds?`Clear ${adds} remaining ${adds===1?'invader':'invaders'}`:'Final threat defeated';
  return `<div class="world-event-status event-active" data-world-event="${escape(def.id)}" style="--event:${def.color}" role="status" aria-live="polite"><span class="world-event-symbol">${worldEventSymbol(def.id)}</span><div><strong>${escape(def.name)}</strong><small>${objective}</small></div></div>`;
 }
 const weather=g.events.weather?.id;
 if(!weatherNames[weather])return '';
 return `<div class="world-event-status weather-only" data-weather="${weather}" style="--event:${weatherColors[weather]}" role="status" aria-live="polite"><span class="world-event-symbol">${worldEventSymbol(weather)}</span><div><strong>${weatherNames[weather]}</strong><small>WEATHER</small></div></div>`;
}

export function worldEventGuide(){
 return `<article class="world-events-guide"><small>WEATHER & WORLD EVENTS</small><h3>A changing battlefield.</h3><p>Rain and snow change the atmosphere. World events bring themed invaders and a special boss into your current map. Ordinary wave spawning waits while the event is active; defeat the boss and its remaining event enemies to clear it and claim the event cache.</p><p>Events can arrive naturally during Survival and Hardcore. Thriller Bark Graveyard has its own Hollow Lantern and Great Tomb event rotation; stored event items can invite their encounters onto other maps. Event items also drop from enemies: equip one in any of your three trinket slots, keep it for later, then open its slot and choose <b>USE EVENT ITEM</b>. Picking one up never activates it. A successful use consumes the item and frees its slot; it has no passive bonus and cannot be refined. Boss Rush excludes world events.</p><div class="world-event-guide-grid">${WORLD_EVENTS.map(event=>{const trigger=EVENT_TRIGGER_ITEMS.find(item=>item.eventId===event.id);return `<section style="--event:${event.color}"><span class="world-event-guide-symbol">${worldEventSymbol(event.id)}</span><div><small>${escape(trigger?.name||'EVENT ITEM')}</small><h4>${escape(event.name)}</h4><p>${escape(event.description)}</p></div></section>`;}).join('')}</div></article>`;
}
