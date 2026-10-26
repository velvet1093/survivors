import test from 'node:test';
import assert from 'node:assert/strict';
import {CHARACTERS} from '../src/game.js';
import {createRun,createHardcoreRun} from '../src/engine.js';
import {saveRun,loadRun} from '../src/run-save.js';
import {EVENT_TRIGGER_ITEMS,eventTriggerFor,isEventTrigger} from '../src/event-trigger-items.js';
import {
 TRINKETS,newTrinkets,trinketFor,trinketPixels,trinketIcon,trinketMaxRefinement,trinketRefinement,trinketDescription,trinketEffect,trinketBonus,
 dropTrinket,rollEnemyTrinket,collectNearbyTrinket,chooseTrinket,refineTrinket,ignoreTrinket,restoreTrinkets,canUseEventTrinket,useEventTrinket,
} from '../src/trinkets.js';
const hero=CHARACTERS.find(c=>c.id==='guts');
const run=()=>createHardcoreRun(hero,15);
const store=()=>({data:new Map(),getItem(k){return this.data.get(k)},setItem(k,v){this.data.set(k,v)},removeItem(k){this.data.delete(k)}});
function equip(g,id,slot=0){const drop=dropTrinket(g,id,g.p.x,g.p.y);assert.ok(drop);drop.age=.5;g.p.moving=true;assert.ok(collectNearbyTrinket(g));assert.ok(chooseTrinket(g,slot));return drop;}

test('five consumable event items have distinct native art, explicit use descriptions and no passive or refinement effects',()=>{
 assert.deepEqual(EVENT_TRIGGER_ITEMS.map(item=>[item.id,item.eventId]),[['beherit','eclipse'],['raigodrum','storm'],['frostseal','blizzard'],['hollowlantern','ghostparade'],['tombkey','tombwake']]);
 const art=[];for(const item of EVENT_TRIGGER_ITEMS){assert.equal(eventTriggerFor(item.id),item);assert.ok(isEventTrigger(item.id));assert.equal(trinketFor(item.id),item);assert.ok(TRINKETS.includes(item));assert.equal(trinketMaxRefinement(item.id),0);assert.deepEqual(trinketEffect(item.id,99),{});assert.match(trinketDescription(item.id),/consumed only (?:when|if) the event begins/i);assert.match(trinketDescription(item.id),/cannot be refined/i);assert.ok(!trinketDescription(item.id).includes('undefined'));
  const pixels=trinketPixels(item.id);assert.equal(pixels.length,1024);assert.ok(pixels.filter(Boolean).length>100);assert.ok(new Set(pixels.filter(Boolean)).size>=5);assert.ok(pixels.every(c=>c===null||/^#[a-f\d]{6}$/i.test(c)));art.push(JSON.stringify(pixels));assert.match(trinketIcon(item.id),new RegExp(`data-trinket-art="${item.id}"`));pixels.fill(null);assert.ok(trinketPixels(item.id).some(Boolean));
 }assert.equal(new Set(art).size,5);assert.equal(eventTriggerFor('missing'),null);
});

test('a discovered Beherit uses one of the same three trinket slots and remains dormant until explicit activation',()=>{
 const g=run(),stats=structuredClone(g.p),bonus=trinketBonus(g);equip(g,'ramencharm',0);equip(g,'beherit',1);equip(g,'frostseal',2);
 assert.deepEqual(g.trinkets.equipped,['ramencharm','beherit','frostseal']);assert.equal(g.status,'playing');assert.equal(g.events?.active??null,null);assert.deepEqual(g.p,stats);assert.deepEqual(trinketBonus(g),{...bonus,healing:1.1});
 let calls=0;assert.ok(useEventTrinket(g,1,{startEvent(id){calls++;assert.equal(id,'eclipse');return true;}}));assert.equal(calls,1);assert.deepEqual(g.trinkets.equipped,['ramencharm',null,'frostseal']);assert.equal(g.trinkets.refinements.beherit,undefined);assert.equal(useEventTrinket(g,1,{startEvent(){calls++;return true;}}),false);assert.equal(calls,1);
});

test('blocked or failed activation never consumes a stored event item or calls the event starter in invalid states',()=>{
 const g=run();equip(g,'beherit');const inventory=structuredClone(g.trinkets);let calls=0;const api={startEvent(){calls++;return true;}};
 for(const slot of [-1,3,.5])assert.equal(useEventTrinket(g,slot,api),false);
 for(const patch of [{status:'upgrade'},{status:'paused',resumeStatus:'chest'},{bossIntro:{}},{mode:'bossrush'},{riftArena:{}},{rifts:{active:{}}},{events:{active:{}}}]){
  const before={status:g.status,resumeStatus:g.resumeStatus,bossIntro:g.bossIntro,mode:g.mode,riftArena:g.riftArena,rifts:g.rifts,events:g.events};Object.assign(g,patch);assert.equal(canUseEventTrinket(g,0),false);assert.equal(useEventTrinket(g,0,api),false);assert.deepEqual(g.trinkets,inventory);Object.assign(g,before);
 }
 assert.equal(calls,0);assert.equal(useEventTrinket(g,0,{startEvent(){calls++;return false;}}),false);assert.equal(useEventTrinket(g,0,{startEvent(){return {started:true};}}),false);assert.deepEqual(g.trinkets,inventory);assert.equal(calls,1);
});

test('a paused player can explicitly activate later while unresolved reward screens remain blocked',()=>{
 const g=run();equip(g,'raigodrum');g.status='paused';g.resumeStatus='playing';assert.ok(canUseEventTrinket(g,0));
 assert.ok(useEventTrinket(g,0,{startEvent(id){assert.equal(g.status,'paused');assert.equal(id,'storm');g.status='playing';delete g.resumeStatus;return true;}}));assert.equal(g.status,'playing');assert.equal(g.resumeStatus,undefined);assert.equal(g.trinkets.equipped[0],null);
});

test('event consumables cannot refine, stack a duplicate or improve unrelated keepsakes',()=>{
 const g=run();equip(g,'beherit',1);assert.equal(dropTrinket(g,'beherit',0,0),null);assert.equal(trinketRefinement(g,'beherit'),0);
 g.trinkets.pending={itemId:'beherit',x:0,y:0};g.status='trinket';assert.equal(refineTrinket(g),false);assert.equal(chooseTrinket(g,2),false);assert.ok(ignoreTrinket(g));assert.deepEqual(g.trinkets.equipped,[null,'beherit',null]);assert.equal(g.trinkets.refinements.beherit,0);
});

test('stored and dropped event items survive checkpoints with sanitized ranks and consume once after resuming',()=>{
 const g=run(),storage=store();equip(g,'beherit',0);equip(g,'scoutscarf',1);dropTrinket(g,'frostseal',80,60);g.trinkets.refinements.beherit=99;
 assert.ok(saveRun(g,storage));const loaded=loadRun(storage);assert.ok(loaded);assert.equal(loaded.status,'paused');assert.equal(loaded.resumeStatus,'playing');assert.deepEqual(loaded.trinkets.equipped,['beherit','scoutscarf',null]);assert.equal(loaded.trinkets.refinements.beherit,0);assert.equal(loaded.trinkets.drops[0].itemId,'frostseal');
 let starts=0;assert.ok(useEventTrinket(loaded,0,{startEvent(id){starts++;assert.equal(id,'eclipse');loaded.status='playing';delete loaded.resumeStatus;return true;}}));assert.equal(starts,1);assert.ok(saveRun(loaded,storage));const after=loadRun(storage);assert.deepEqual(after.trinkets.equipped,[null,'scoutscarf',null]);assert.equal(useEventTrinket(after,0,{startEvent(){starts++;return true;}}),false);assert.equal(starts,1);
 restoreTrinkets(g,{equipped:['raigodrum','frostseal','beherit'],refinements:{raigodrum:10,frostseal:Infinity,beherit:-2}});assert.deepEqual(g.trinkets.refinements,{raigodrum:0,frostseal:0,beherit:0});
});

test('event triggers have lower random loot weight and never occupy Boss Rush reward drops',()=>{
 const totals=new Map();for(let i=0;i<85;i++){const g={mode:'survival',trinkets:newTrinkets(),p:{x:0,y:0}};const drop=rollEnemyTrinket(g,{boss:true,x:20,y:0},()=>(i+.5)/85);assert.ok(drop);totals.set(drop.itemId,(totals.get(drop.itemId)||0)+1);}
 for(const item of TRINKETS)assert.equal(totals.get(item.id),isEventTrigger(item.id)?1:4,item.id+' weighted draw interval');
 const g={mode:'bossrush',trinkets:newTrinkets(),p:{x:0,y:0}};assert.equal(dropTrinket(g,'beherit',0,0),null);const drop=rollEnemyTrinket(g,{boss:true,x:20,y:0},()=>.999);assert.ok(drop);assert.ok(!isEventTrigger(drop.itemId));
});
