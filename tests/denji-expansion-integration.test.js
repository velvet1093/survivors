import test from 'node:test';
import assert from 'node:assert/strict';
import {CHARACTERS,ITEMS} from '../src/game.js';
import {createBossRushRun,spawnEnemy,updateRun} from '../src/engine.js';
import {chooseRushDraft,getRushDraftChoices,beginBossRush} from '../src/boss-rush.js';
import {BOSSES,REGULAR_BOSS_IDS} from '../src/enemies.js';
import {saveRun,loadRun} from '../src/run-save.js';

const addedBosses=['katanaman','batdevil','eternitydevil'];
const expeditionBosses=['jellal','geld','kokushibo'];
const appendedBosses=[...addedBosses,'ryuma','moriah'];
const legacyOrder=()=>REGULAR_BOSS_IDS.filter(id=>!appendedBosses.includes(id)&&!expeditionBosses.includes(id));
const memory=()=>({data:new Map(),getItem(k){return this.data.get(k)||null;},setItem(k,v){this.data.set(k,v);},removeItem(k){this.data.delete(k);}});
function legacyCombat(){
 const g=createBossRushRun(CHARACTERS[0],3);
 while(g.status==='rush-draft')assert.ok(chooseRushDraft(g,getRushDraftChoices(g)[0].id));
 assert.ok(beginBossRush(g));
 const order=legacyOrder();assert.equal(order.length,28);Object.assign(g.rush,{order,total:28,cleared:4,round:5,intermission:0});
 const boss=spawnEnemy(g,true,false,order[4]);Object.assign(boss,{x:210,y:0,hp:734,maxHp:4200,speed:0,attackCD:999});g.rush.activeBossId=boss.id;
 g.p.hp=73;g.invuln=g.p.nextXp=1e9;for(const id of Object.keys(g.p.weapons))g.p.cooldowns[id]=1e9;g.time=245;g.money=177;g.characterXp=49;g.kills=4;g.bossKills=4;
 return {g,boss,order};
}

test('a saved 28-boss gauntlet gains the new bosses without changing its current fight or earned progress',()=>{
 const {g,boss,order}=legacyCombat(),store=memory();assert.ok(saveRun(g,store));const loaded=loadRun(store);assert.ok(loaded);assert.equal(loaded.status,'paused');assert.equal(loaded.resumeStatus,'playing');
 assert.equal(loaded.rush.total,36);assert.deepEqual(loaded.rush.order.slice(0,28),order);assert.deepEqual(new Set(loaded.rush.order.slice(28,33)),new Set(appendedBosses));assert.deepEqual(loaded.rush.order.slice(33),expeditionBosses);assert.equal(loaded.rush.cleared,4);assert.equal(loaded.rush.round,5);assert.equal(loaded.rush.activeBossId,boss.id);
 assert.equal(loaded.money,177);assert.equal(loaded.characterXp,49);assert.equal(loaded.kills,4);assert.equal(loaded.bossKills,4);assert.equal(loaded.p.hp,73);assert.equal(loaded.time,245);
 assert.equal(loaded.enemies.length,1);assert.equal(loaded.enemies[0].archetype,boss.archetype);assert.equal(loaded.enemies[0].hp,734);assert.equal(loaded.enemies[0].maxHp,4200);
 loaded.status='playing';delete loaded.resumeStatus;updateRun(loaded,.02);assert.equal(loaded.enemies.filter(e=>e.boss).length,1);assert.equal(loaded.rush.activeBossId,boss.id);assert.equal(loaded.rush.cleared,4);assert.equal(loaded.money,177);
 assert.ok(saveRun(loaded,store));const again=loadRun(store);assert.equal(again.rush.order.length,36);assert.equal(new Set(again.rush.order).size,36);assert.deepEqual(again.rush.order,loaded.rush.order);
});

test('Denji participates in the real max-level Boss Rush draft with his signature equipment and new regular boss roster',()=>{
 const hero=CHARACTERS.find(c=>c.id==='denji');assert.ok(hero);const g=createBossRushRun(hero,3);assert.equal(g.p.weapons.chainsaw,ITEMS.chainsaw.max);assert.equal(g.p.passives.bloodengine,ITEMS.bloodengine.max);assert.equal(g.rush.total,36);
 for(const id of addedBosses){assert.ok(g.rush.order.includes(id));assert.ok(!BOSSES[id].riftOnly&&!BOSSES[id].eventOnly);}
 assert.ok(!g.rush.order.includes('darknessdevil'));assert.equal(g.p.form||0,0);assert.equal(g.mechanic.id,'denji');
 const store=memory();assert.ok(saveRun(g,store));const loaded=loadRun(store);assert.ok(loaded);assert.equal(loaded.p.id,'denji');assert.equal(loaded.resumeStatus,'rush-draft');assert.equal(loaded.rush.total,36);assert.equal(loaded.p.weapons.chainsaw,ITEMS.chainsaw.max);assert.equal(loaded.p.passives.bloodengine,ITEMS.bloodengine.max);
});
