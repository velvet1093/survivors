import test from 'node:test';
import assert from 'node:assert/strict';
import {WORLD_EVENTS} from '../src/world-event-data.js';
import {naturalWorldEventsFor,WORLD_EVENT_FIRST_AT,WORLD_EVENT_INTERVAL,WEATHER_SECONDS,WORLD_EVENT_MINIONS,WORLD_EVENT_MINION_LIMIT,newWorldEvents,canStartWorldEvent,startWorldEvent,updateWorldEvents,eventCombatActive,defeatedEventBoss,restoreWorldEvents} from '../src/world-events.js';

function run(){return {mode:'survival',status:'playing',time:0,wave:2,waveState:{version:1,index:2,bossSpawned:false},p:{hp:100,maxHp:100,x:0,y:0,meta:{}},view:{w:390,h:844},zoom:.9,map:{id:'tokyo'},world:{active:[],circles:[]},rifts:{active:null,portal:null},trinkets:{pending:null,wish:{pending:false}},events:newWorldEvents(),enemies:[],enemyShots:[],hazards:[],gems:[],chests:[],money:0,kills:0,bossKills:0,characterXp:0,id:0,bossDeaths:[]};}
function spawn(g,boss,elite,id){const e={id:++g.id,archetype:id,name:id,x:0,y:0,r:boss?45:18,hp:100,maxHp:100,boss,elite,attackCD:0};g.enemies.push(e);return e;}
const api={spawn};
const boss=g=>g.enemies.find(e=>e.eventBoss);
const adds=g=>g.enemies.filter(e=>e.eventEnemy&&e.hp>0);
function defeated(g){const e=boss(g);e.hp=0;e.deathComplete=true;assert.ok(defeatedEventBoss(g,e));return e;}
function clear(g){const e=defeated(g);for(const add of adds(g))add.hp=0;updateWorldEvents(g,.01,api);return e;}

test('ordinary rain and snow advance only during active play and resume after an event',()=>{
 const g=run();updateWorldEvents(g,WEATHER_SECONDS-1,api);assert.equal(g.events.weather.id,'clear');updateWorldEvents(g,1,api);assert.equal(g.events.weather.id,'rain');assert.equal(g.events.weather.age,0);
 const before=structuredClone(g.events.weather);
 for(const status of ['paused','upgrade','trinket','wish','over']){g.status=status;updateWorldEvents(g,30,api);assert.deepEqual(g.events.weather,before);}
 g.status='playing';g.bossIntro={};updateWorldEvents(g,30,api);assert.deepEqual(g.events.weather,before);g.bossIntro=null;
 g.rifts.active={};updateWorldEvents(g,30,api);assert.deepEqual(g.events.weather,before);g.rifts.active=null;
 assert.ok(startWorldEvent(g,'eclipse',api));updateWorldEvents(g,20,api);assert.deepEqual(g.events.weather,before);assert.equal(g.events.active.age,20);
 clear(g);updateWorldEvents(g,WEATHER_SECONDS*2,api);assert.equal(g.events.weather.id,'snow');
 const rush=run();rush.mode='bossrush';updateWorldEvents(rush,10000,api);assert.equal(rush.events.weather.id,'clear');assert.equal(rush.events.weather.age,0);
});

test('natural events start at two minutes and cycle through themed bosses with four initial minions',()=>{
 const g=run();g.time=WORLD_EVENT_FIRST_AT-.01;assert.equal(updateWorldEvents(g,.01,api),false);assert.equal(g.events.active,null);
 const seen=[];
 for(const def of naturalWorldEventsFor(g)){g.time=g.events.nextAt;assert.ok(updateWorldEvents(g,.01,api));seen.push(g.events.active.id);assert.equal(boss(g).archetype,def.bossId);assert.equal(g.events.active.source,'natural');assert.equal(adds(g).length,4);assert.ok(adds(g).every(e=>def.enemies.includes(e.archetype)&&e.eventSerial===g.events.active.serial));clear(g);assert.equal(g.events.nextAt,g.time+WORLD_EVENT_INTERVAL);g.enemies=[];}
 assert.deepEqual(seen,['eclipse','storm','blizzard']);assert.equal(g.events.naturalIndex,3);
});

test('event activation waits for busy encounters and dying bosses but permits ignored ground treasure',()=>{
 const blockers=[g=>g.mode='bossrush',g=>g.status='paused',g=>g.bossIntro={},g=>g.riftArena={},g=>g.rifts.active={},g=>g.rifts.portal={},g=>g.trinkets.pending={},g=>g.trinkets.wish.pending=true,g=>g.enemies.push({boss:true,hp:10}),g=>g.enemies.push({boss:true,hp:0,deathComplete:false}),g=>g.bossDeaths.push({age:.2,duration:1.45}),g=>{g.wave=5;g.waveState={bossSpawned:false};},g=>g.p.hp=0];
 for(const block of blockers){const g=run();block(g);const before=structuredClone(g.events);assert.equal(canStartWorldEvent(g),false);assert.equal(startWorldEvent(g,'eclipse',api),false);assert.deepEqual(g.events,before);}
 const g=run();g.mode=undefined;g.chests.push({x:0,y:0});assert.ok(canStartWorldEvent(g));assert.ok(startWorldEvent(g,'storm',api));assert.equal(startWorldEvent(g,'blizzard',api),false);
 const h=run();h.wave=5;h.waveState={bossSpawned:true};h.enemies.push({boss:true,hp:0,deathComplete:true});assert.ok(canStartWorldEvent(h));
});

test('finite reinforcement packs respect the alive cap, stop at twelve and stop immediately when their boss dies',()=>{
 const g=run();startWorldEvent(g,'storm',api);updateWorldEvents(g,15,api);assert.equal(adds(g).length,4,'a complete new pack waits for enough room');
 adds(g).slice(0,2).forEach(e=>e.hp=0);updateWorldEvents(g,.01,api);assert.equal(adds(g).length,WORLD_EVENT_MINION_LIMIT);assert.equal(g.events.active.spawned,8);
 adds(g).slice(0,4).forEach(e=>e.hp=0);updateWorldEvents(g,15,api);assert.equal(adds(g).length,WORLD_EVENT_MINION_LIMIT);assert.equal(g.events.active.spawned,WORLD_EVENT_MINIONS);
 adds(g).forEach(e=>e.hp=0);updateWorldEvents(g,200,api);assert.equal(g.events.active.spawned,WORLD_EVENT_MINIONS);assert.equal(adds(g).length,0);
 const h=run();startWorldEvent(h,'blizzard',api);boss(h).hp=0;updateWorldEvents(h,200,api);assert.equal(h.events.active.spawned,4);assert.equal(h.events.active.bossProcessed,false);assert.ok(eventCombatActive(h),'death animation must finish first');
});

test('an event pays its boss XP and completion treasure once, after every remaining event enemy is cleared',()=>{
 const g=run();g.p.meta={coinGain:.2,masteryGain:.5};startWorldEvent(g,'eclipse',api);const e=defeated(g);assert.equal(g.kills,1);assert.equal(g.bossKills,1);assert.equal(g.characterXp,90);assert.equal(g.chests.length,0);assert.equal(g.money,0);
 updateWorldEvents(g,1,api);assert.ok(g.events.active);assert.equal(g.chests.length,0);for(const add of adds(g))add.hp=0;
 g.time=143;updateWorldEvents(g,.02,{...api,coinMultiplier:()=>1.5});assert.equal(g.money,540);assert.equal(g.gems[0].value,120);assert.equal(g.chests.length,1);assert.equal(g.chests[0].rewardCount,3);assert.equal(g.chests[0].eventReward,true);assert.equal(g.events.active,null);assert.equal(g.events.history.length,1);
 defeatedEventBoss(g,e);updateWorldEvents(g,.02,api);assert.equal(g.money,540);assert.equal(g.kills,1);assert.equal(g.characterXp,90);assert.equal(g.chests.length,1);
});

test('spawn points avoid rivers and scenery and a blocked battlefield cannot consume an event attempt',()=>{
 const g=run();g.map={id:'garden'};g.p={...g.p,x:650,y:0};g.world.circles=[{x:820,y:-120,r:90,object:{hp:Infinity}}];
 assert.ok(startWorldEvent(g,'blizzard',api));for(const e of g.enemies){const stream=650+Math.sin(e.y/400)*90;assert.ok(Math.abs(e.x-stream)>=91+Math.min(e.r,30));assert.ok(Math.hypot(e.x-820,e.y+120)>=90+Math.min(e.r,30));}
 const h=run(),before=structuredClone(h.events);assert.equal(startWorldEvent(h,'eclipse',{...api,blocked:()=>true}),false);assert.equal(h.enemies.length,0);assert.deepEqual(h.events,before);
 assert.equal(startWorldEvent(h,'unknown',api),false);assert.equal(startWorldEvent(h,'eclipse',{}),false);
});

test('checkpoint restoration keeps exact weather, cast ownership, finite pack progress and already processed boss state',()=>{
 const g=run();g.events.weather={id:'rain',index:1,duration:WEATHER_SECONDS,age:17.4};startWorldEvent(g,'storm',api);updateWorldEvents(g,6.25,api);const a=structuredClone(g.events.active),saved=structuredClone(g);restoreWorldEvents(saved);assert.deepEqual(saved.events.active,a);assert.deepEqual(saved.events.weather,g.events.weather);assert.ok(boss(saved).eventBoss);assert.equal(saved.events.serial,1);
 defeated(saved);saved.enemies=saved.enemies.filter(e=>!e.eventBoss);const after=structuredClone(saved);restoreWorldEvents(after);assert.ok(after.events.active.bossProcessed);adds(after).forEach(e=>e.hp=0);updateWorldEvents(after,.1,api);assert.equal(after.chests.length,1);assert.equal(after.characterXp,60);
 const paid=structuredClone(after);restoreWorldEvents(paid);updateWorldEvents(paid,.1,api);assert.equal(paid.money,300);assert.equal(paid.chests.length,1);
});

test('orphan or conflicting event saves release normal waves and remove only event-owned attacks',()=>{
 const g=run();startWorldEvent(g,'eclipse',api);const a=g.events.active,ids=g.enemies.map(e=>e.id);g.enemyShots=[{sourceId:ids[1]},{sourceId:999}];g.hazards=[{sourceId:ids[0]},{sourceId:999}];g.enemies=g.enemies.filter(e=>!e.eventBoss);g.enemies.push({id:999,hp:10,boss:false});g.time=500;restoreWorldEvents(g);assert.equal(g.events.active,null);assert.equal(g.events.nextAt,560);assert.deepEqual(g.enemies.map(e=>e.id),[999]);assert.deepEqual(g.enemyShots,[{sourceId:999}]);assert.deepEqual(g.hazards,[{sourceId:ids[0]},{sourceId:999}],'missing source IDs are not mistaken for unrelated attacks');
 const h=run();startWorldEvent(h,'storm',api);h.mode='bossrush';restoreWorldEvents(h);assert.equal(h.events.active,null);assert.equal(h.enemies.length,0);
 const legacy=run();delete legacy.events;restoreWorldEvents(legacy);assert.equal(legacy.events.nextAt,WORLD_EVENT_FIRST_AT);assert.equal(legacy.events.weather.id,'clear');
});
