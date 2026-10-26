import test from 'node:test';
import assert from 'node:assert/strict';
import {CHARACTERS,ITEMS,refreshStats,applyChoice} from '../src/game.js';
import {createRun,createHardcoreRun,createBossRushRun,updateRun} from '../src/engine.js';
import {dropTrinket,collectNearbyTrinket,chooseTrinket,refineTrinket,unequipTrinket,trinketMaxRefinement,trinketRefinement,trinketStarCount,trinketName,trinketBonus,restoreTrinkets} from '../src/trinkets.js';
import {wishOptions,wishEvolutions,wishUpgradeCandidates,resolveWish,restoreShenron} from '../src/shenron.js';
import {saveRun,loadRun} from '../src/run-save.js';
const hero=id=>CHARACTERS.find(c=>c.id===id);
const run=(id='goku',hardcore=false)=>{const g=(hardcore?createHardcoreRun:createRun)(hero(id));g.spawn=g.eliteAt=g.nextBossWave=1e8;g.p.nextXp=1e8;g.invuln=1e8;return g;};
const memory=()=>{const map=new Map();return {setItem:(k,v)=>map.set(k,v),getItem:k=>map.get(k)||null,removeItem:k=>map.delete(k)};};
function offer(g,id='dragonmarble'){const d=dropTrinket(g,id,g.p.x,g.p.y);assert.ok(d);d.age=1;g.p.moving=true;assert.ok(collectNearbyTrinket(g));}
function equip(g,id='dragonmarble',slot=0){offer(g,id);assert.ok(chooseTrinket(g,slot));}
function summon(g){equip(g);for(let rank=1;rank<=7;rank++){offer(g);assert.ok(refineTrinket(g));assert.equal(trinketRefinement(g,'dragonmarble'),rank);if(rank<7)assert.equal(g.status,'playing');}assert.equal(g.status,'wish');return g;}
const close=(a,b)=>assert.ok(Math.abs(a-b)<1e-8,`${a} ≈ ${b}`);

test('Dragon Ball alone refines seven times, raises stars and summons once at its seventh refinement',()=>{
 const g=run();assert.equal(trinketMaxRefinement('scoutscarf'),3);assert.equal(trinketMaxRefinement('dragonmarble'),7);assert.equal(trinketStarCount(0),1);assert.equal(trinketStarCount(6),7);assert.equal(trinketStarCount(7),7);assert.equal(trinketName('dragonmarble',5),'6-Star Dragon Ball');
 summon(g);assert.equal(g.trinkets.wish.pending,true);assert.equal(g.trinkets.wish.summoned,true);assert.equal(g.trinkets.wish.granted,null);close(trinketBonus(g).coins,1.225);assert.equal(dropTrinket(g,'dragonmarble',0,0),null);
 const before=structuredClone({time:g.time,p:g.p,trinkets:g.trinkets});updateRun(g,2,{x:1,y:1});assert.deepEqual({time:g.time,p:g.p,trinkets:g.trinkets},before);
 assert.ok(resolveWish(g,'stats'));assert.equal(g.trinkets.wish.pending,false);assert.equal(unequipTrinket(g,0),true);equip(g);for(let i=0;i<7;i++){offer(g);assert.ok(refineTrinket(g));}assert.equal(g.status,'playing');assert.equal(g.trinkets.wish.granted,'stats');assert.equal(resolveWish(g,'stats'),false);
});

test('Shenron wishes are explicit and reject unavailable or repeated actions',()=>{
 const g=run();assert.equal(resolveWish(g,'stats'),false);summon(g);const before=structuredClone(g.p);assert.equal(resolveWish(g,'missing'),false);assert.equal(resolveWish(g,'evolution','missing'),false);assert.deepEqual(g.p,before);g.status='paused';assert.equal(resolveWish(g,'stats'),false);g.status='wish';g.bossIntro={};assert.equal(resolveWish(g,'stats'),false);g.bossIntro=null;assert.ok(resolveWish(g,'stats'));assert.equal(resolveWish(g,'levels'),false);
});

test('wish evolution ignores weapon levels and missing ingredients but grants no foreign items',()=>{
 const g=summon(run('gojo'));delete g.p.weapons.red;delete g.p.passives.eyes;refreshStats(g.p);assert.equal(g.p.weapons.blue,1);assert.ok(wishEvolutions(g).some(f=>f.id==='purple'));
 const result=resolveWish(g,'evolution','purple');assert.equal(result.evolutionId,'purple');assert.deepEqual(g.p.weapons,{blue:5});assert.deepEqual(g.p.passives,{});assert.equal(g.p.fusions.blue,'purple');assert.equal(g.p.shenronEvolution,'purple');
 const stored=memory();saveRun(g,stored);const loaded=loadRun(stored);assert.equal(loaded.p.fusions.blue,'purple');assert.equal(loaded.p.shenronEvolution,'purple');
});

test('wish evolution consumes an owned second weapon and protects already evolved secondary weapons',()=>{
 const g=summon(run('gojo'));assert.ok(resolveWish(g,'evolution','purple'));assert.deepEqual(g.p.weapons,{blue:5});
 const other=summon(run('megumi'));other.p.weapons.nue=5;other.p.passives.talisman=3;assert.ok(applyChoice(other.p,{kind:'fusion',id:'stormnue'}));assert.ok(!wishEvolutions(other).some(f=>f.id==='chimeragarden'));assert.ok(wishEvolutions(other).some(f=>f.id==='totality'));assert.ok(resolveWish(other,'evolution','totality'));assert.equal(other.p.fusions.nue,'stormnue');assert.equal(other.p.weapons.nue,5);
});

test('wish evolves both Eren form weapons together and preserves Hardcore signature-only inventory',()=>{
 const g=summon(run('eren',true));assert.ok(resolveWish(g,'evolution','scoutassault'));assert.equal(g.p.sharedFormRank,5);assert.deepEqual(g.p.formWeapons,{odmblades:5,titanfists:5});assert.deepEqual(g.p.fusions,{odmblades:'scoutassault',titanfists:'titanquake'});assert.deepEqual(Object.keys(g.p.passives),['freedom']);const stored=memory();saveRun(g,stored);const loaded=loadRun(stored);assert.equal(loaded.mode,'hardcore');assert.deepEqual(loaded.p.fusions,g.p.fusions);assert.equal(loaded.p.sharedFormRank,5);
 const naruto=summon(run('naruto',true));assert.ok(wishEvolutions(naruto).some(f=>f.id==='rasenflash'));assert.ok(resolveWish(naruto,'evolution','rasenflash'));assert.deepEqual(naruto.p.weapons,{shuriken:5});assert.deepEqual(naruto.p.passives,{headband:1});saveRun(naruto,stored);const restored=loadRun(stored);assert.equal(restored.p.fusions.shuriken,'rasenflash');assert.deepEqual(restored.p.passives,{headband:1});
});

test('five random wish levels affect only owned equipment, honor caps, and report limited remaining ranks',()=>{
 const g=summon(run());g.p.weapons={ki:4};g.p.passives={senzu:2};const before=structuredClone({meta:g.p.meta,level:g.p.level,xp:g.p.xp});const result=resolveWish(g,'levels',null,()=>0);assert.equal(result.upgrades.length,2);assert.deepEqual(g.p.weapons,{ki:5});assert.deepEqual(g.p.passives,{senzu:3});assert.deepEqual({meta:g.p.meta,level:g.p.level,xp:g.p.xp},before);
 const many=summon(run('gojo'));const changes=resolveWish(many,'levels',null,()=>0);assert.equal(changes.upgrades.length,5);assert.deepEqual(Object.keys(many.p.weapons),['blue','red']);assert.deepEqual(Object.keys(many.p.passives),['eyes']);assert.equal(many.p.weapons.blue,5);assert.equal(many.p.weapons.red,2);
 const full=summon(run());full.p.weapons={ki:5};full.p.passives={senzu:3};assert.equal(wishUpgradeCandidates(full).length,0);assert.equal(wishOptions(full).find(o=>o.id==='levels').available,false);assert.equal(resolveWish(full,'levels'),false);assert.equal(full.status,'wish');
});

test('Shenron stat blessing lasts the whole match, does not compound and never changes profile bonuses',()=>{
 const g=summon(run());const base={damage:g.p.damage,move:g.p.move,maxHp:g.p.maxHp,regen:g.p.regen},meta=structuredClone(g.p.meta);assert.ok(resolveWish(g,'stats'));const blessed={damage:g.p.damage,move:g.p.move,maxHp:g.p.maxHp,regen:g.p.regen};close(blessed.damage,base.damage*1.2);close(blessed.move,base.move*1.1);close(blessed.maxHp,base.maxHp*1.2);close(blessed.regen,base.regen+1);for(let i=0;i<10;i++)refreshStats(g.p);assert.deepEqual({damage:g.p.damage,move:g.p.move,maxHp:g.p.maxHp,regen:g.p.regen},blessed);assert.deepEqual(g.p.meta,meta);unequipTrinket(g,0);refreshStats(g.p);assert.deepEqual({damage:g.p.damage,move:g.p.move,maxHp:g.p.maxHp,regen:g.p.regen},blessed);
 const stored=memory();saveRun(g,stored);const loaded=loadRun(stored);assert.deepEqual({damage:loaded.p.damage,move:loaded.p.move,maxHp:loaded.p.maxHp,regen:loaded.p.regen},blessed);assert.deepEqual(loaded.p.meta,meta);assert.equal(run().p.shenronBlessing,undefined);
});

test('pending wishes and seven-star ranks survive checkpoints; malformed and legacy states normalize',()=>{
 const g=summon(run()),stored=memory();saveRun(g,stored);const loaded=loadRun(stored);assert.equal(loaded.status,'paused');assert.equal(loaded.resumeStatus,'wish');assert.equal(loaded.trinkets.wish.pending,true);assert.equal(trinketRefinement(loaded,'dragonmarble'),7);loaded.status=loaded.resumeStatus;delete loaded.resumeStatus;assert.ok(resolveWish(loaded,'stats'));saveRun(loaded,stored);assert.equal(loadRun(stored).trinkets.wish.granted,'stats');
 const old=run();restoreTrinkets(old,{equipped:['dragonmarble','scoutscarf'],refinements:{dragonmarble:99,scoutscarf:99},wish:{pending:true,summoned:true,granted:'invalid'}});assert.equal(trinketRefinement(old,'dragonmarble'),7);assert.equal(trinketRefinement(old,'scoutscarf'),3);restoreShenron(old);assert.equal(old.status,'wish');restoreTrinkets(old,{});restoreShenron(old);assert.equal(old.status,'playing');assert.equal(old.p.shenronBlessing,false);
});

test('Boss Rush preserves an unresolved wish and disables equipment levels for a maxed build',()=>{
 const g=createBossRushRun(hero('goku'));g.rush.stage='combat';g.status='playing';g.p.weapons={ki:5,blue:5,shuriken:5,orbit:5,lightning:5};g.p.passives={senzu:3,eyes:3,headband:3,magnet:3,power:3};refreshStats(g.p);summon(g);
 assert.equal(wishOptions(g).find(option=>option.id==='levels').available,false);assert.equal(wishOptions(g).find(option=>option.id==='stats').available,true);
 const store=memory();assert.ok(saveRun(g,store));const loaded=loadRun(store);assert.equal(loaded.mode,'bossrush');assert.equal(loaded.resumeStatus,'wish');assert.equal(loaded.rush.stage,'combat');loaded.status=loaded.resumeStatus;delete loaded.resumeStatus;assert.ok(resolveWish(loaded,'evolution','kamehameha'));assert.equal(loaded.p.fusions.ki,'kamehameha');assert.equal(loaded.rush.stage,'combat');assert.equal(loaded.trinkets.wish.pending,false);
});
