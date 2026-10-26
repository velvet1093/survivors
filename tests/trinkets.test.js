import test from 'node:test';
import assert from 'node:assert/strict';
import {CHARACTERS,ITEMS,refreshStats,getUpgradePool} from '../src/game.js';
import {createRun,createHardcoreRun,spawnEnemy,updateRun,useSpecial} from '../src/engine.js';
import {ensureWorld,collectPickup} from '../src/world.js';
import {saveRun,loadRun,RUN_SAVE_KEY} from '../src/run-save.js';
import {
 TRINKETS,TRINKET_SLOTS,TRINKET_MAX_REFINEMENT,TRINKET_DROP_LIMIT,TRINKET_DROP_CHANCE,trinketFor,trinketIcon,trinketPixels,TRINKET_ART_IDS,
 newTrinkets,trinketBonus,dropTrinket,rollEnemyTrinket,collectNearbyTrinket,chooseTrinket,ignoreTrinket,unequipTrinket,
 trinketEnemyDefeated,trinketFoodCollected,trinketUltimateUsed,updateTrinkets,restoreTrinkets,trinketRefinement,trinketEffect,trinketDescription,refineTrinket,isEventTrigger,
} from '../src/trinkets.js';
const hero=id=>CHARACTERS.find(c=>c.id===id);
const close=(actual,expected)=>assert.ok(Math.abs(actual-expected)<1e-8,`${actual} ≈ ${expected}`);
const memory=()=>{const data=new Map();return {getItem:key=>data.get(key)||null,setItem:(key,value)=>data.set(key,value),removeItem:key=>data.delete(key)};};
function quiet(g=createRun(hero('goku'),3)){
 g.spawn=g.eliteAt=g.nextBossWave=1e8;g.p.nextXp=1e8;g.p.regen=0;g.invuln=1e8;g.p.weapons={};
 ensureWorld(g);for(const object of g.world.objects.values())object.hp=0;g.world.active=[];g.world.circles=[];return g;
}
function offer(g,id){const drop=dropTrinket(g,id,g.p.x,g.p.y);assert.ok(drop,id);drop.age=.5;g.p.moving=true;assert.equal(collectNearbyTrinket(g),true);return drop;}
function equip(g,id,slot=0){offer(g,id);assert.equal(chooseTrinket(g,slot),true);}
function refine(g,id,times=1){for(let i=0;i<times;i++){offer(g,id);assert.equal(refineTrinket(g),true);}}
function simulate(g,seconds,input={x:0,y:0}){for(let i=0;i<Math.round(seconds/.02);i++)updateRun(g,.02,input);}


function finishDeath(g){for(let i=0;i<90&&g.status==='playing'&&g.enemies.some(e=>e.boss&&e.hp<=0&&!e.deathComplete);i++)updateRun(g,.02);}
test('anime keepsakes and event consumables have distinct bounded colored icons and complete descriptions',()=>{
 assert.equal(TRINKETS.length,25);assert.equal(TRINKET_SLOTS,3);assert.equal(new Set(TRINKETS.map(item=>item.id)).size,25);assert.deepEqual(new Set(TRINKET_ART_IDS),new Set(TRINKETS.map(item=>item.id)));
 const artwork=[];for(const item of TRINKETS){assert.equal(trinketFor(item.id),item);for(const key of ['name','series','color','description'])assert.ok(item[key],item.id+' '+key);const pixels=trinketPixels(item.id);assert.equal(pixels.length,32*32);assert.ok(new Set(pixels.filter(Boolean)).size>=5);assert.ok(pixels.filter(Boolean).length>100);assert.match(trinketIcon(item.id),/class="trinket-icon"/);assert.ok(!trinketIcon(item.id).includes('http'));artwork.push(JSON.stringify(pixels));pixels.fill(null);assert.ok(trinketPixels(item.id).some(Boolean),'icons return isolated pixel arrays');}assert.equal(new Set(artwork).size,25);assert.equal(trinketFor('unknown'),null);assert.equal(trinketFor(null),null);
});

test('enemy drop rolls use bounded rarity and give a first boss discovery exactly once',()=>{
 for(const [type,chance]of [['normal',TRINKET_DROP_CHANCE.normal],['elite',TRINKET_DROP_CHANCE.elite],['boss',TRINKET_DROP_CHANCE.boss]]){
  const g=quiet();g.trinkets.firstBossDropped=true;const e={x:100,y:80,elite:type==='elite',boss:type==='boss'};assert.equal(rollEnemyTrinket(g,e,()=>chance),null);assert.equal(rollEnemyTrinket(g,e,()=>0),null,'a resolved enemy never rolls twice');const lucky={...e,trinketLooted:false};assert.ok(rollEnemyTrinket(g,lucky,()=>chance/2),type);assert.equal(g.trinkets.drops.length,1);
 }
 const g=quiet(),boss={x:90,y:60,boss:true};assert.ok(rollEnemyTrinket(g,boss,()=>.999));assert.equal(g.trinkets.firstBossDropped,true);assert.equal(rollEnemyTrinket(g,boss,()=>0),null);assert.equal(rollEnemyTrinket(g,{x:90,y:60,boss:true},()=>.999),null);
});

test('drops allow refinable equipped copies, exclude pending and existing copies, and respect the world cap',()=>{
 const g=quiet();equip(g,'ramencharm');offer(g,'dragonmarble');assert.ok(dropTrinket(g,'ramencharm',10,10));assert.equal(dropTrinket(g,'ramencharm',10,10),null);assert.equal(dropTrinket(g,'dragonmarble',10,10),null);assert.equal(dropTrinket(g,'unknown',10,10),null);assert.equal(dropTrinket(g,'leafkeychain',NaN,10),null);
 for(const item of TRINKETS)dropTrinket(g,item.id,100,100);assert.equal(g.trinkets.drops.length,TRINKET_DROP_LIMIT);assert.equal(new Set(g.trinkets.drops.map(drop=>drop.uid)).size,TRINKET_DROP_LIMIT);assert.equal(new Set(g.trinkets.drops.map(drop=>drop.itemId)).size,TRINKET_DROP_LIMIT);assert.equal(dropTrinket(g,'fairytailstamp',100,100),null);
});

test('walking over a settled drop opens a frozen offer without automatically equipping it',()=>{
 const g=quiet(),drop=dropTrinket(g,'ramencharm',0,0);g.p.moving=true;assert.equal(collectNearbyTrinket(g),false,'fresh drops have a short landing grace');drop.age=.5;g.p.moving=false;assert.equal(collectNearbyTrinket(g),false,'standing on a newly dropped item does not interrupt combat');g.p.moving=true;assert.equal(collectNearbyTrinket(g),true);assert.equal(g.status,'trinket');assert.equal(g.p.moving,false);assert.equal(g.trinkets.drops.length,0);assert.equal(g.trinkets.pending.itemId,'ramencharm');assert.deepEqual(g.trinkets.equipped,[null,null,null]);const before=JSON.stringify({state:g.trinkets,time:g.time,x:g.p.x});updateRun(g,2,{x:1,y:0});assert.equal(JSON.stringify({state:g.trinkets,time:g.time,x:g.p.x}),before);
});

test('real walking collects trinkets after existing level-up and chest interactions have priority',()=>{
 const direct=quiet(),drop=dropTrinket(direct,'ramencharm',20,0);drop.age=.5;updateRun(direct,.02,{x:1,y:0});assert.equal(direct.status,'trinket');assert.equal(direct.trinkets.pending.itemId,'ramencharm');assert.ok(direct.p.x>0);assert.deepEqual(direct.trinkets.equipped,[null,null,null]);
 const level=quiet();dropTrinket(level,'ramencharm',20,0).age=.5;level.p.nextXp=1;level.gems=[{x:0,y:0,value:1,phase:0}];updateRun(level,.02,{x:1,y:0});assert.equal(level.status,'upgrade');assert.equal(level.trinkets.pending,null);assert.equal(level.trinkets.drops.length,1);level.status='playing';level.p.nextXp=1e8;updateRun(level,.02,{x:1,y:0});assert.equal(level.status,'trinket');
 const chest=quiet();dropTrinket(chest,'ramencharm',20,0).age=.5;chest.chests=[{x:20,y:0,source:'TEST CACHE',mimicChecked:true}];updateRun(chest,.02,{x:1,y:0});assert.equal(chest.status,'chest');assert.equal(chest.trinkets.pending,null);assert.equal(chest.trinkets.drops.length,1);
});

test('three slots equip or explicitly replace, while leave consumes the offer and invalid actions do nothing',()=>{
 const g=quiet();for(const [slot,id]of ['ramencharm','dragonmarble','leafkeychain'].entries())equip(g,id,slot);assert.deepEqual(g.trinkets.equipped,['ramencharm','dragonmarble','leafkeychain']);offer(g,'scoutscarf');const before=structuredClone(g.trinkets);for(const slot of [-1,3,1.5])assert.equal(chooseTrinket(g,slot),false);assert.deepEqual(g.trinkets,before);g.status='paused';assert.equal(chooseTrinket(g,1),false);assert.equal(ignoreTrinket(g),false);g.status='trinket';g.bossIntro={};assert.equal(chooseTrinket(g,1),false);g.bossIntro=null;assert.equal(chooseTrinket(g,1),true);assert.deepEqual(g.trinkets.equipped,['ramencharm','scoutscarf','leafkeychain']);assert.equal(g.trinkets.pending,null);assert.equal(g.trinkets.drops.length,0);assert.equal(trinketBonus(g).coins,1);assert.equal(trinketBonus(g).move,1.03);
 offer(g,'dragonmarble');assert.equal(ignoreTrinket(g),true);assert.equal(g.status,'playing');assert.equal(g.trinkets.pending,null);g.p.moving=true;assert.equal(collectNearbyTrinket(g),false,'leaving cannot immediately reopen the same drop');
});

test('real enemy defeat creates a first-boss trinket once alongside the usual rewards',()=>{
 const g=quiet(),e=spawnEnemy(g,true,false,'frieza');Object.assign(e,{x:180,y:90,hp:0});updateRun(g,.02);finishDeath(g);assert.equal(g.kills,1);assert.equal(g.bossKills,1);assert.equal(g.chests.length,1);assert.equal(g.trinkets.drops.length,1);assert.equal(g.trinkets.drops[0].x,180);assert.equal(g.trinkets.drops[0].y,90);assert.equal(g.trinkets.firstBossDropped,true);assert.equal(g.trinkets.kills,1);updateRun(g,.02);assert.equal(g.trinkets.drops.length,1);assert.equal(g.trinkets.kills,1);
 const store=memory();saveRun(g,store);const loaded=loadRun(store);loaded.status='playing';updateRun(loaded,.02);assert.equal(loaded.trinkets.drops.length,1);assert.equal(loaded.kills,1,'saved deaths cannot pay again');
});

test('Hardcore trinkets occupy separate slots and never grant foreign weapons or passives',()=>{
 const g=quiet(createHardcoreRun(hero('erza'),3));g.p.weapons={requip:1};const before=structuredClone({weapons:g.p.weapons,passives:g.p.passives,meta:g.p.meta,damage:g.p.damage,maxHp:g.p.maxHp});equip(g,'scoutscarf',0);equip(g,'ramencharm',1);equip(g,'dragonmarble',2);assert.deepEqual({weapons:g.p.weapons,passives:g.p.passives,meta:g.p.meta,damage:g.p.damage,maxHp:g.p.maxHp},before);assert.equal(g.p.hardcore,true);for(const choice of getUpgradePool(g.p))if(choice.kind==='item')assert.equal(choice.id,ITEMS[choice.id].type==='weapon'?'requip':'heartkreuz');
 const store=memory();saveRun(g,store);const r=loadRun(store);assert.equal(r.mode,'hardcore');assert.deepEqual(r.p.passives,{heartkreuz:1});assert.deepEqual(r.trinkets.equipped,['scoutscarf','ramencharm','dragonmarble']);
});

test('scarf movement and leaf pickup range affect real simulation and disappear cleanly when removed',()=>{
 const base=quiet(),scarf=quiet();equip(scarf,'scoutscarf');const unchanged=structuredClone({move:scarf.p.move,meta:scarf.p.meta});simulate(base,.5,{x:1,y:0});simulate(scarf,.5,{x:1,y:0});close(scarf.p.x,base.p.x*1.03);assert.deepEqual({move:scarf.p.move,meta:scarf.p.meta},unchanged);assert.equal(unequipTrinket(scarf,0),true);const bx=base.p.x,sx=scarf.p.x;simulate(base,.3,{x:1,y:0});simulate(scarf,.3,{x:1,y:0});close(scarf.p.x-sx,base.p.x-bx);
 const normal=quiet(),leaf=quiet();equip(leaf,'leafkeychain');for(const g of [normal,leaf])g.gems=[{x:120,y:0,value:1,phase:0}];updateRun(normal,.02);updateRun(leaf,.02);assert.equal(normal.gems[0].attracted,undefined);assert.equal(leaf.gems[0].attracted,true);assert.equal(leaf.p.magnet,normal.p.magnet);unequipTrinket(leaf,0);assert.equal(trinketBonus(leaf).magnet,1);
});

test('food, coin, boots and energy trinkets add only their small pickup bonuses without stacking stats',()=>{
 const g=quiet();equip(g,'ramencharm');g.p.hp=1;collectPickup(g,{kind:'food'});close(g.p.hp,34);unequipTrinket(g,0);g.p.hp=1;collectPickup(g,{kind:'food'});assert.equal(g.p.hp,31);
 equip(g,'dragonmarble');collectPickup(g,{kind:'money'});close(g.money,10.5);g.kills=7;const e=spawnEnemy(g,false,false,'soldier');Object.assign(e,{x:400,y:0,hp:0});updateRun(g,.02);close(g.money,12.6);unequipTrinket(g,0);collectPickup(g,{kind:'money'});close(g.money,22.6);
 equip(g,'strawhatpin');collectPickup(g,{kind:'boots'});assert.equal(g.haste,14);unequipTrinket(g,0);collectPickup(g,{kind:'boots'});assert.equal(g.haste,12);
 equip(g,'capsulebadge');g.special=10;collectPickup(g,{kind:'energy'});assert.equal(g.special,3);unequipTrinket(g,0);g.special=10;collectPickup(g,{kind:'energy'});assert.equal(g.special,4);
 const meta=structuredClone(g.p.meta),stats={move:g.p.move,damage:g.p.damage,maxHp:g.p.maxHp};refreshStats(g.p);assert.deepEqual(g.p.meta,meta);assert.deepEqual({move:g.p.move,damage:g.p.damage,maxHp:g.p.maxHp},stats);
});

test('dango and bell count only equipped kills; cosmetic items do not change combat statistics',()=>{
 const g=quiet();g.p.hp=50;equip(g,'dangobox',0);equip(g,'beckoningbell',1);for(let i=0;i<9;i++)trinketEnemyDefeated(g);assert.equal(g.p.hp,50);trinketEnemyDefeated(g);assert.equal(g.p.hp,51);for(let i=0;i<10;i++)trinketEnemyDefeated(g);assert.equal(g.p.hp,52);assert.ok(g.numbers.some(n=>n.amount==='MEW!'));assert.ok(g.trinkets.cosmetic.bell>0);
 const stats={damage:g.p.damage,maxHp:g.p.maxHp,move:g.p.move,cooldown:g.p.cooldown};equip(g,'soulribbon',2);collectPickup(g,{kind:'food'});assert.ok(g.trinkets.cosmetic.sparkle>0);offer(g,'fairytailstamp');chooseTrinket(g,2);assert.ok(useSpecial(g));assert.ok(g.trinkets.cosmetic.stamp>0);assert.deepEqual({damage:g.p.damage,maxHp:g.p.maxHp,move:g.p.move,cooldown:g.p.cooldown},stats);
 g.ultimate=null;g.special=0;unequipTrinket(g,0);unequipTrinket(g,1);for(let i=0;i<20;i++)trinketEnemyDefeated(g);assert.equal(g.p.hp,82,'unequipped dango heals no further HP');
});

test('pause and boss entrances freeze thought, cosmetic and drop clocks',()=>{
 const g=quiet();equip(g,'memorybookmark');dropTrinket(g,'penguinplush',80,0);g.trinkets.cosmetic.sparkle=1;updateTrinkets(g,29);assert.equal(g.trinkets.cosmetic.bookmark,0);g.status='paused';const before=structuredClone(g.trinkets);updateTrinkets(g,5);updateRun(g,5);assert.deepEqual(g.trinkets,before);g.status='playing';g.bossIntro={age:0,duration:100};updateTrinkets(g,5);updateRun(g,.02);assert.deepEqual(g.trinkets,before);g.bossIntro=null;updateTrinkets(g,1);assert.ok(g.trinkets.cosmetic.bookmark>0);assert.ok(g.numbers.some(n=>String(n.amount).includes('CHAPTER')));assert.equal(g.trinkets.reading,0);
});

test('equipped slots, ground drops, pending offer and effect counters survive a real run checkpoint',()=>{
 const g=quiet();equip(g,'dangobox',0);equip(g,'memorybookmark',2);g.trinkets.dangoKills=7;g.trinkets.reading=17.5;g.trinkets.cosmetic.bookmark=.8;dropTrinket(g,'capsulebadge',80,60);offer(g,'ramencharm');const before=structuredClone(g.trinkets),store=memory();assert.ok(saveRun(g,store));const r=loadRun(store);assert.ok(r);assert.equal(r.status,'paused');assert.equal(r.resumeStatus,'trinket');assert.deepEqual(r.trinkets,before);updateRun(r,3);assert.deepEqual(r.trinkets,before);r.status=r.resumeStatus;delete r.resumeStatus;assert.equal(chooseTrinket(r,1),true);assert.deepEqual(r.trinkets.equipped,['dangobox','ramencharm','memorybookmark']);assert.equal(r.trinkets.dangoKills,7,'equipping another item preserves existing counters');assert.equal(r.trinkets.reading,17.5);saveRun(r,store);const later=loadRun(store);assert.deepEqual(later.trinkets.equipped,r.trinkets.equipped);assert.equal(later.trinkets.pending,null);assert.deepEqual(later.p.meta,r.p.meta);
});

test('legacy runs default to empty slots and malformed saves clamp slots, identities, counters and drop bounds',()=>{
 const g=quiet(),store=memory();delete g.trinkets;assert.ok(saveRun(g,store));const legacy=loadRun(store);assert.deepEqual(legacy.trinkets,newTrinkets());
 const raw={equipped:['ramencharm','ramencharm','missing','scoutscarf'],refinements:{ramencharm:999,scoutscarf:2,missing:3},serial:0,kills:-8,reading:Infinity,dangoKills:33,bellKills:48,pending:{uid:'trinket:8',itemId:'dragonmarble',x:1,y:2,age:3},drops:[{uid:'trinket:8',itemId:'leafkeychain',x:20,y:30,age:-2},{uid:'trinket:9',itemId:'leafkeychain',x:20,y:30},{itemId:'unknown',x:0,y:0},{itemId:'scoutscarf',x:NaN,y:0},...TRINKETS.map((item,i)=>({uid:'trinket:8',itemId:item.id,x:1e12,y:-1e12,age:Infinity}))],cosmetic:{bell:Infinity,sparkle:999}};
 const state=restoreTrinkets(g,raw);assert.deepEqual(state.equipped,['ramencharm',null,null]);assert.equal(state.pending.itemId,'dragonmarble');assert.equal(g.status,'trinket');assert.ok(state.drops.length<=TRINKET_DROP_LIMIT);const all=[state.pending,...state.drops];assert.equal(new Set(all.map(d=>d.uid)).size,all.length);assert.equal(new Set([...state.equipped.filter(Boolean),...all.map(d=>d.itemId)]).size,1+all.length);assert.ok(all.every(d=>Number.isFinite(d.x)&&Number.isFinite(d.y)&&Math.abs(d.x)<=1e7&&Math.abs(d.y)<=1e7&&d.age>=0));assert.equal(state.dangoKills,3);assert.equal(state.bellKills,8);assert.equal(state.kills,0);assert.equal(state.cosmetic.bell,0);assert.equal(state.cosmetic.sparkle,2);
 g.status='paused';g.resumeStatus='trinket';restoreTrinkets(g,{pending:{itemId:'missing',x:0,y:0}});assert.equal(g.resumeStatus,'playing');assert.equal(g.trinkets.pending,null);
});

test('duplicates explicitly refine an equipped trinket three times without taking another slot',()=>{
 const g=quiet();equip(g,'ramencharm');assert.equal(TRINKET_MAX_REFINEMENT,3);assert.equal(trinketRefinement(g,'ramencharm'),0);
 const stats=structuredClone(g.p),equipped=[...g.trinkets.equipped];
 for(let rank=1;rank<=3;rank++){
  offer(g,'ramencharm');assert.equal(trinketRefinement(g,'ramencharm'),rank-1,'pickup alone cannot improve an effect');
  assert.equal(chooseTrinket(g,1),false,'copies cannot occupy another slot');
  g.status='paused';assert.equal(refineTrinket(g),false);g.status='trinket';g.bossIntro={};assert.equal(refineTrinket(g),false);g.bossIntro=null;
  assert.equal(refineTrinket(g),true);assert.equal(g.status,'playing');assert.equal(trinketRefinement(g,'ramencharm'),rank);assert.equal(g.trinkets.pending,null);assert.deepEqual(g.trinkets.equipped,equipped);assert.deepEqual(g.p,stats);assert.match(g.toast,new RegExp('REFINED \\+'+rank));
 }
 assert.equal(dropTrinket(g,'ramencharm',0,0),null,'fully refined copies no longer drop');assert.equal(refineTrinket(g),false);
 g.trinkets.pending={itemId:'ramencharm',x:0,y:0};g.status='trinket';assert.equal(refineTrinket(g),false,'even an injected fourth copy cannot raise the cap');assert.equal(ignoreTrinket(g),true);
 const other=quiet();offer(other,'leafkeychain');assert.equal(refineTrinket(other),false,'new items need to be equipped first');assert.equal(chooseTrinket(other,0),true);offer(other,'leafkeychain');assert.equal(ignoreTrinket(other),true);assert.equal(trinketRefinement(other,'leafkeychain'),0,'leaving a copy preserves the current refinement');
});

test('enemy drop candidates include equipped trinkets until their third refinement',()=>{
 const g=quiet();equip(g,'ramencharm');const duplicate=rollEnemyTrinket(g,{boss:true,x:90,y:0},()=>0);assert.equal(duplicate.itemId,'ramencharm');duplicate.x=g.p.x;duplicate.y=g.p.y;duplicate.age=.5;g.p.moving=true;assert.ok(collectNearbyTrinket(g));assert.ok(refineTrinket(g));refine(g,'ramencharm',2);
 const other=rollEnemyTrinket(g,{boss:true,x:90,y:0},()=>0);assert.equal(other.itemId,'dragonmarble','a capped item is removed from actual random loot candidates');
});

test('refined stat trinkets improve actual movement and pickups without compounding player statistics',()=>{
 const base=quiet(),scarf=quiet();equip(scarf,'scoutscarf');refine(scarf,'scoutscarf',3);simulate(base,.4,{x:1,y:0});simulate(scarf,.4,{x:1,y:0});close(scarf.p.x,base.p.x*1.075);assert.equal(scarf.p.move,base.p.move);
 const g=quiet(),meta=structuredClone(g.p.meta);equip(g,'ramencharm');refine(g,'ramencharm',3);g.p.hp=1;collectPickup(g,{kind:'food'});close(g.p.hp,38.5);equip(g,'dragonmarble');refine(g,'dragonmarble',3);collectPickup(g,{kind:'money'});close(g.money,11.25);
 equip(g,'strawhatpin');refine(g,'strawhatpin',3);collectPickup(g,{kind:'boots'});assert.equal(g.haste,17);equip(g,'capsulebadge');refine(g,'capsulebadge',3);g.special=10;collectPickup(g,{kind:'energy'});close(g.special,1.5);
 equip(g,'leafkeychain');refine(g,'leafkeychain',3);close(trinketBonus(g).magnet,1.2);const noLeaf=quiet();for(const run of [g,noLeaf])run.gems=[{x:132,y:0,value:1,phase:0}];updateRun(g,.02);updateRun(noLeaf,.02);assert.equal(g.gems[0].attracted,true);assert.equal(noLeaf.gems[0].attracted,undefined);
 assert.deepEqual(g.p.meta,meta);refreshStats(g.p);close(trinketBonus(g).magnet,1.2);assert.deepEqual(g.p.meta,meta);assert.equal(unequipTrinket(g,0),true);assert.equal(trinketBonus(g).magnet,1);
});

test('refinement improves every small or cosmetic effect and displays its exact new amount',()=>{
 for(const item of TRINKETS.filter(item=>!isEventTrigger(item.id))){const effects=[0,1,2,3].map(rank=>trinketEffect(item.id,rank));assert.equal(new Set(effects.map(effect=>JSON.stringify(effect))).size,4,item.id);assert.equal(new Set([0,1,2,3].map(rank=>trinketDescription(item.id,rank))).size,4,item.id+' descriptions');assert.deepEqual(trinketEffect(item.id,-7),effects[0]);assert.deepEqual(trinketEffect(item.id,Infinity),effects[0]);assert.deepEqual(trinketEffect(item.id,99),trinketEffect(item.id,item.id==='dragonmarble'?7:3));}
 assert.equal(trinketDescription('missing',2),'');assert.deepEqual(trinketEffect('missing',2),{});
 const g=quiet();g.p.hp=50;equip(g,'dangobox',0);equip(g,'beckoningbell',1);equip(g,'memorybookmark',2);for(const id of g.trinkets.equipped)refine(g,id,3);for(let i=0;i<7;i++)trinketEnemyDefeated(g);assert.equal(g.trinkets.cosmetic.bell,0);trinketEnemyDefeated(g);assert.ok(g.trinkets.cosmetic.bell>1.5);for(let i=0;i<2;i++)trinketEnemyDefeated(g);close(g.p.hp,52.5);updateTrinkets(g,14.9);assert.equal(g.trinkets.cosmetic.bookmark,0);updateTrinkets(g,.1);assert.ok(g.trinkets.cosmetic.bookmark>1.5);
 equip(g,'soulribbon');refine(g,'soulribbon',3);collectPickup(g,{kind:'food'});close(g.trinkets.cosmetic.sparkle,1.9);assert.equal(trinketEffect('soulribbon',3).hearts,9);equip(g,'fairytailstamp');refine(g,'fairytailstamp',3);assert.ok(useSpecial(g));close(g.trinkets.cosmetic.stamp,1.8);assert.equal(trinketEffect('fairytailstamp',3).sparks,9);assert.equal(trinketEffect('penguinplush',3).footprints,6);
 assert.match(trinketDescription('scoutscarf',3),/7\.5%/);assert.match(trinketDescription('memorybookmark',3),/15 active seconds/);
});

test('replacement and removal discard only the affected item refinement',()=>{
 const g=quiet();equip(g,'scoutscarf',0);equip(g,'ramencharm',1);refine(g,'scoutscarf',3);refine(g,'ramencharm',2);equip(g,'leafkeychain',0);assert.deepEqual(g.trinkets.refinements,{ramencharm:2,leafkeychain:0});assert.equal(trinketBonus(g).move,1);assert.equal(unequipTrinket(g,1),true);assert.deepEqual(g.trinkets.refinements,{leafkeychain:0});equip(g,'ramencharm',1);assert.equal(trinketRefinement(g,'ramencharm'),0,'discarded levels do not carry into a new copy');
});

test('refinement ranks and an unresolved duplicate survive checkpoints with paused clocks',()=>{
 const g=quiet();equip(g,'ramencharm');refine(g,'ramencharm',2);offer(g,'ramencharm');const store=memory();assert.ok(saveRun(g,store));const loaded=loadRun(store);assert.equal(loaded.status,'paused');assert.equal(loaded.resumeStatus,'trinket');assert.equal(loaded.trinkets.pending.itemId,'ramencharm');assert.deepEqual(loaded.trinkets.refinements,{ramencharm:2});assert.equal(refineTrinket(loaded),false);loaded.status=loaded.resumeStatus;delete loaded.resumeStatus;assert.ok(refineTrinket(loaded));close(trinketBonus(loaded).healing,1.25);assert.ok(saveRun(loaded,store));assert.equal(trinketRefinement(loadRun(store),'ramencharm'),3);
});

test('legacy refinement migration clamps ranks and retains only valid refinable world copies',()=>{
 const g=quiet();restoreTrinkets(g,{equipped:['ramencharm','dragonmarble','leafkeychain'],refinements:{ramencharm:Infinity,dragonmarble:-4,leafkeychain:2.9,scoutscarf:3},pending:{itemId:'leafkeychain',x:0,y:0},drops:[{itemId:'leafkeychain',x:2,y:2},{itemId:'ramencharm',x:3,y:3}]});assert.deepEqual(g.trinkets.refinements,{ramencharm:0,dragonmarble:0,leafkeychain:2});assert.equal(g.trinkets.pending.itemId,'leafkeychain');assert.deepEqual(g.trinkets.drops.map(drop=>drop.itemId),['ramencharm']);
 restoreTrinkets(g,{equipped:['ramencharm','beckoningbell','memorybookmark'],refinements:{ramencharm:99,beckoningbell:3,memorybookmark:3},bellKills:19,reading:29,pending:{itemId:'ramencharm',x:0,y:0},drops:[{itemId:'ramencharm',x:0,y:0}]});assert.equal(g.trinkets.pending,null);assert.deepEqual(g.trinkets.drops,[]);assert.equal(g.status,'playing');assert.equal(trinketRefinement(g,'ramencharm'),3);assert.ok(g.trinkets.bellKills<8);assert.ok(g.trinkets.reading<=15);
 restoreTrinkets(g,{equipped:['scoutscarf']});assert.deepEqual(g.trinkets.refinements,{scoutscarf:0});close(trinketBonus(g).move,1.03);
});


test('new small-perk keepsakes combine additively with existing bonuses and affect real pickups',()=>{
 const g=quiet();equip(g,'transmutationpin',0);refine(g,'transmutationpin',3);equip(g,'dragonmarble',1);close(trinketBonus(g).coins,1.125);collectPickup(g,{kind:'money'});close(g.money,11.25);unequipTrinket(g,0);collectPickup(g,{kind:'money'});close(g.money,21.75);
 equip(g,'hunterlicense',0);refine(g,'hunterlicense',3);equip(g,'leafkeychain',1);refine(g,'leafkeychain',3);close(trinketBonus(g).magnet,1.35);g.gems=[{x:150,y:0,value:1,phase:0}];updateRun(g,.02);assert.equal(g.gems[0].attracted,true);assert.equal(g.p.magnet,115);
 equip(g,'nichirinbell',0);refine(g,'nichirinbell',3);collectPickup(g,{kind:'boots'});close(g.haste,14.5);equip(g,'strawhatpin',1);refine(g,'strawhatpin',3);collectPickup(g,{kind:'boots'});close(g.haste,19.5);
 equip(g,'spiritbadge',0);refine(g,'spiritbadge',3);equip(g,'capsulebadge',1);refine(g,'capsulebadge',3);g.special=10;collectPickup(g,{kind:'energy'});close(g.special,.25);unequipTrinket(g,0);g.special=10;collectPickup(g,{kind:'energy'});close(g.special,1.5);
});

test('new purely playful keepsakes scale their own cosmetic events without adding combat stats',()=>{
 const g=quiet(),stats=structuredClone(g.p);equip(g,'papercrane',0);refine(g,'papercrane',3);trinketFoodCollected(g);close(g.trinkets.cosmetic.cranes,1.85);assert.equal(trinketEffect('papercrane',3).cranes,5);
 equip(g,'pochitacharm',1);refine(g,'pochitacharm',3);for(let i=0;i<5;i++)trinketEnemyDefeated(g);assert.equal(g.trinkets.cosmetic.chainsaw,0);trinketEnemyDefeated(g);assert.ok(g.numbers.some(n=>n.amount==='VROOM!'));close(g.trinkets.cosmetic.chainsaw,1.95);
 equip(g,'moonbrooch',2);refine(g,'moonbrooch',3);trinketUltimateUsed(g);close(g.trinkets.cosmetic.moon,1.95);assert.equal(trinketEffect('moonbrooch',3).sparks,10);
 equip(g,'bebopcassette',0);refine(g,'bebopcassette',3);updateTrinkets(g,11.9);assert.equal(g.trinkets.cosmetic.music,0);updateTrinkets(g,.1);close(g.trinkets.cosmetic.music,1.95);assert.equal(trinketEffect('bebopcassette',3).notes,5);
 for(const key of ['damage','move','maxHp','maxShield','cooldown','regen','dodge','meta'])assert.deepEqual(g.p[key],stats[key],key+' remains cosmetic');
});

test('new cosmetic counters freeze during interruptions, refine cleanly and discard independently',()=>{
 const g=quiet();equip(g,'pochitacharm',0);equip(g,'bebopcassette',1);g.trinkets.pochitaKills=10;g.trinkets.jazz=20;refine(g,'pochitacharm',3);refine(g,'bebopcassette',3);assert.ok(g.trinkets.pochitaKills<6);assert.ok(g.trinkets.jazz<=12);g.status='paused';const before=structuredClone(g.trinkets);updateTrinkets(g,5);assert.deepEqual(g.trinkets,before);g.status='playing';g.bossIntro={};updateTrinkets(g,5);assert.deepEqual(g.trinkets,before);g.bossIntro=null;
 assert.ok(unequipTrinket(g,0));assert.equal(g.trinkets.pochitaKills,0);assert.equal(g.trinkets.jazz,before.jazz);assert.ok(unequipTrinket(g,1));assert.equal(g.trinkets.jazz,0);
});

test('new keepsake ranks, ground discoveries and playful counters survive saves and sanitize legacy data',()=>{
 const g=quiet(),stored=memory();equip(g,'pochitacharm',0);equip(g,'bebopcassette',1);equip(g,'moonbrooch',2);for(const id of g.trinkets.equipped)refine(g,id,3);g.trinkets.pochitaKills=4;g.trinkets.jazz=7.5;trinketUltimateUsed(g);dropTrinket(g,'papercrane',80,20);const before=structuredClone(g.trinkets);assert.ok(saveRun(g,stored));const loaded=loadRun(stored);assert.deepEqual(loaded.trinkets,before);
 restoreTrinkets(g,{equipped:['pochitacharm','bebopcassette','spiritbadge'],refinements:{pochitacharm:3,bebopcassette:3,spiritbadge:3},pochitaKills:99,jazz:999,cosmetic:{music:Infinity,cranes:99}});assert.ok(g.trinkets.pochitaKills<6);assert.equal(g.trinkets.jazz,12);assert.equal(g.trinkets.cosmetic.music,0);assert.equal(g.trinkets.cosmetic.cranes,2);assert.equal(trinketRefinement(g,'spiritbadge'),3);
 restoreTrinkets(g,{equipped:['papercrane']});assert.equal(g.trinkets.pochitaKills,0);assert.equal(g.trinkets.jazz,0);assert.equal(g.trinkets.cosmetic.cranes,0);assert.equal(trinketRefinement(g,'papercrane'),0);
});
