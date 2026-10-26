import {WORLD_EVENTS} from './world-event-data.js';
import {onWater} from './world.js';

export const WORLD_EVENT_FIRST_AT=120;
export const WORLD_EVENT_INTERVAL=240;
export const WEATHER_SECONDS=60;
export const WORLD_EVENT_PACK_INTERVAL=14;
export const WORLD_EVENT_MINION_LIMIT=6;
export const WORLD_EVENT_MINIONS=12;
const WEATHER_CYCLE=['clear','rain','clear','snow'];
const TAU=Math.PI*2;
const finite=(n,fallback=0)=>Number.isFinite(n)?n:fallback;
const count=n=>Math.max(0,Math.floor(finite(n)));
const definition=id=>WORLD_EVENTS.find(e=>e.id===id);
const eventUnits=(g,a)=>g.enemies.filter(e=>e.eventSerial===a.serial&&(e.eventBoss||e.eventEnemy));

export function newWorldEvents(){
 return {version:1,nextAt:WORLD_EVENT_FIRST_AT,serial:0,naturalIndex:0,active:null,history:[],weather:{id:'clear',age:0,duration:WEATHER_SECONDS,index:0}};
}
export const eventCombatActive=g=>!!g.events?.active;
// Map-specific encounters form their own natural rotation. Stored event items
// remain explicit invitations and may be used on any eligible battlefield.
export function naturalWorldEventsFor(g){
 const themed=WORLD_EVENTS.filter(event=>event.mapIds?.includes(g.map?.id));
 return themed.length?themed:WORLD_EVENTS.filter(event=>!event.mapIds?.length);
}
function pendingBoss(g){
 if(g.waveState?.pendingBossWaves?.length)return true;
 if((g.bossDeaths||[]).some(d=>d.age<d.duration))return true;
 if((g.enemies||[]).some(e=>e.boss&&(e.hp>0||e.hp<=0&&!e.deathComplete)))return true;
 const wave=Math.max(1,count(g.wave)||1);
 return wave%5===0&&g.waveState?.bossSpawned!==true;
}
export function canStartWorldEvent(g){
 return !!g?.p&&g.p.hp>0&&g.mode!=='bossrush'&&g.status==='playing'&&!g.bossIntro&&!g.events?.active&&!g.riftArena&&!g.rifts?.active&&!g.rifts?.portal&&!g.trinkets?.pending&&!g.trinkets?.wish?.pending&&!pendingBoss(g);
}
function blocked(g,x,y,r,api){
 if(api.blocked?.(x,y,r))return true;
 if(g.map?.id&&onWater(g.map,x,y,r))return true;
 if(g.world?.circles?.some(c=>c.object?.hp!==0&&Math.hypot(c.x-x,c.y-y)<c.r+r))return true;
 return (g.world?.active||[]).some(o=>o.hp>0&&o.type!=='gate'&&Math.hypot(o.x-x,o.y-y)<(o.r||0)+r);
}
function point(g,api,angle,radius,bodyRadius){
 for(let i=0;i<24;i++){
  const a=angle+(i%12)*TAU/12,d=radius+(i>=12?65:0),x=g.p.x+Math.cos(a)*d,y=g.p.y+Math.sin(a)*d;
  if(!blocked(g,x,y,bodyRadius,api))return {x,y};
 }
 return null;
}
function pack(g,a,api){
 const def=definition(a.id),ids=def.enemies||def.enemyIds,alive=eventUnits(g,a).filter(e=>!e.eventBoss&&e.hp>0).length;
 const amount=Math.min(4,WORLD_EVENT_MINIONS-a.spawned),space=Math.min(WORLD_EVENT_MINION_LIMIT-alive,Math.max(0,210-g.enemies.length));
 if(amount<=0||space<amount||!ids?.length)return false;
 let added=0;
 for(let i=0;i<amount;i++){
  const index=a.spawned,where=point(g,api,index*2.399+a.serial*.43,260+(index%2)*45,20);if(!where)break;
  const e=api.spawn(g,false,false,ids[index%ids.length]);if(!e)break;
  Object.assign(e,where,{eventEnemy:true,eventBoss:false,eventId:a.id,eventSerial:a.serial,ownerId:a.bossEntityId});
  e.attackCD=Math.max(1.5,e.attackCD||0);a.spawned++;added++;
 }
 if(added)a.packIndex++;
 a.packAt=a.age+(added?WORLD_EVENT_PACK_INTERVAL:3);
 return added>0;
}
export function startWorldEvent(g,id,api={},options={}){
 const def=definition(id);if(!def||!canStartWorldEvent(g)||typeof api.spawn!=='function')return false;
 const where=point(g,api,-Math.PI/5,210,30);if(!where)return false;
 const boss=api.spawn(g,true,false,def.bossId);if(!boss||!(boss.hp>0))return false;
 const state=g.events??=newWorldEvents(),serial=state.serial+1;
 Object.assign(boss,where,{eventBoss:true,eventEnemy:false,eventId:id,eventSerial:serial});boss.attackCD=Math.max(2.2,boss.attackCD||0);
 const a={id,serial,source:options.source||'item',bossId:def.bossId,bossEntityId:boss.id,startedAt:finite(g.time),age:0,spawned:0,packIndex:0,packAt:WORLD_EVENT_PACK_INTERVAL,bossDefeated:false,bossProcessed:false,rewarded:false,weather:def.weather||id};
 state.serial=serial;state.active=a;if(a.source==='natural')state.naturalIndex++;
 pack(g,a,api);g.boss=true;g.invuln=Math.max(g.invuln||0,1.2);g.toast=def.name.toUpperCase()+' · WORLD EVENT';g.toastTime=5;g.checkpointRequested=true;
 api.queueIntro?.(g,boss,g.wave);return true;
}
// Called only after the normal boss death animation. Its ordinary chest and
// boss payment are replaced by the once-only event completion cache.
export function defeatedEventBoss(g,e){
 if(!e?.eventBoss||e.hp>0)return false;
 if(e.eventRewarded)return true;e.eventRewarded=true;
 const a=g.events?.active;if(!a||a.serial!==e.eventSerial||a.bossEntityId!==e.id)return true;
 a.bossDefeated=true;a.bossProcessed=true;
 g.kills=(g.kills||0)+1;g.bossKills=(g.bossKills||0)+1;g.characterXp=(g.characterXp||0)+60*(1+(g.p.meta?.masteryGain||0));g.checkpointRequested=true;
 return true;
}
function finish(g,a,api){
 const state=g.events,def=definition(a.id),already=a.rewarded||state.history.some(h=>h.serial===a.serial);
 a.rewarded=true;
 if(!already){
  const coins=Math.round(300*(1+(g.p.meta?.coinGain||0))*(api.coinMultiplier?.(g)??1));
  g.money=(g.money||0)+coins;
  const gem=api.makeGem?api.makeGem(g.p.x+34,g.p.y+10,120):{x:g.p.x+34,y:g.p.y+10,value:120,phase:0,tier:'ruby'};(g.gems??=[]).push(gem);
  const cacheId='world-event-cache:'+a.serial;
  if(!(g.chests||[]).some(c=>c.id===cacheId))(g.chests??=[]).push({id:cacheId,x:g.p.x,y:g.p.y,boss:true,source:def.name,rewardCount:3,tier:'event',kind:'event',color:def.color,eventReward:true,eventId:a.id,eventSerial:a.serial});
  state.history.push({serial:a.serial,id:a.id,bossId:a.bossId,source:a.source,completedAt:finite(g.time)});if(state.history.length>30)state.history.shift();
  g.toast=def.name.toUpperCase()+' CLEARED · +'+coins+' COINS · THREE REWARDS';g.toastTime=6;
 }
 state.active=null;state.nextAt=finite(g.time)+WORLD_EVENT_INTERVAL;g.boss=g.enemies.some(e=>e.boss&&e.hp>0);g.invuln=Math.max(g.invuln||0,1);g.checkpointRequested=true;
}
function updateWeather(state,dt){
 const w=state.weather;w.age+=dt;
 if(w.age>=WEATHER_SECONDS){const steps=Math.floor(w.age/WEATHER_SECONDS);w.age%=WEATHER_SECONDS;w.index=(w.index+steps)%WEATHER_CYCLE.length;w.id=WEATHER_CYCLE[w.index];}
}
export function updateWorldEvents(g,dt,api={}){
 if(g.status!=='playing'||g.bossIntro||g.mode==='bossrush'||g.riftArena||g.rifts?.active)return false;
 const state=g.events??=newWorldEvents(),step=Math.max(0,finite(dt));
 if(state.active){
  const a=state.active;a.age+=step;
  const boss=g.enemies.find(e=>e.id===a.bossEntityId&&e.eventBoss&&e.eventSerial===a.serial);
  if(boss?.hp>0&&a.spawned<WORLD_EVENT_MINIONS&&a.packIndex<3&&a.age>=a.packAt&&typeof api.spawn==='function')pack(g,a,api);
  if(a.bossProcessed&&!eventUnits(g,a).some(e=>e.hp>0||e.eventBoss&&!e.deathComplete))finish(g,a,api);
  return true;
 }
 updateWeather(state,step);
 const natural=naturalWorldEventsFor(g);
 if(finite(g.time)>=state.nextAt&&canStartWorldEvent(g)&&natural.length)return startWorldEvent(g,natural[state.naturalIndex%natural.length].id,api,{source:'natural'});
 return false;
}
function clearOrphans(g,keepSerial=null,keepId=null){
 const removed=(g.enemies||[]).filter(e=>(e.eventBoss||e.eventEnemy)&&(e.eventSerial!==keepSerial||e.eventId!==keepId)),ids=new Set(removed.map(e=>e.id));
 g.enemies=(g.enemies||[]).filter(e=>!ids.has(e.id));g.enemyShots=(g.enemyShots||[]).filter(s=>!ids.has(s.sourceId));g.hazards=(g.hazards||[]).filter(h=>!ids.has(h.sourceId));
 g.bossDeaths=(g.bossDeaths||[]).filter(d=>!ids.has(d.id));return ids.size;
}
export function restoreWorldEvents(g,raw=g.events){
 const base=newWorldEvents(),state={...base,version:1,nextAt:Math.max(0,finite(raw?.nextAt,finite(g.time)+WORLD_EVENT_FIRST_AT)),serial:Math.min(1e9,count(raw?.serial)),naturalIndex:count(raw?.naturalIndex),history:Array.isArray(raw?.history)?raw.history.filter(h=>h&&Number.isFinite(h.serial)&&definition(h.id)).slice(-30):[]};
 const w=raw?.weather,index=count(w?.index)%WEATHER_CYCLE.length;
 state.weather={id:WEATHER_CYCLE[index],age:Math.max(0,finite(w?.age))%WEATHER_SECONDS,index,duration:WEATHER_SECONDS};
 const a=raw?.active,def=definition(a?.id),boss=def&&(g.enemies||[]).find(e=>e.id===a.bossEntityId&&e.archetype===def.bossId),serial=count(a?.serial);
 if(def&&serial>0&&Number.isFinite(a.bossEntityId)&&g.mode!=='bossrush'&&!g.riftArena&&!g.rifts?.active&&(boss||a.bossProcessed)){
  const restored={id:def.id,serial,source:a.source==='natural'?'natural':'item',bossId:def.bossId,bossEntityId:a.bossEntityId,startedAt:Math.max(0,finite(a.startedAt)),age:Math.max(0,finite(a.age)),spawned:Math.min(WORLD_EVENT_MINIONS,count(a.spawned)),packIndex:Math.min(3,count(a.packIndex)),packAt:Math.max(0,finite(a.packAt,WORLD_EVENT_PACK_INTERVAL)),bossDefeated:!!a.bossDefeated,bossProcessed:!!a.bossProcessed,rewarded:!!a.rewarded,weather:def.weather||def.id};
  if(boss){Object.assign(boss,{eventBoss:true,eventId:def.id,eventSerial:serial});if(boss.hp>0){restored.bossDefeated=false;restored.bossProcessed=false;}}
  state.active=restored;state.serial=Math.max(state.serial,serial);clearOrphans(g,serial,def.id);
 }else{
  if(a){state.nextAt=Math.max(state.nextAt,finite(g.time)+60);}
  clearOrphans(g);
 }
 g.events=state;g.boss=(g.enemies||[]).some(e=>e.boss&&e.hp>0);return state;
}
