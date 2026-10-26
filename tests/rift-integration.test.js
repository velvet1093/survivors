import test from 'node:test';
import assert from 'node:assert/strict';
import {CHARACTERS,chestOffers,resolveChestReward,ignoreChest} from '../src/game.js';
import {createRun,createHardcoreRun,createBossRushRun,spawnEnemy,updateRun,damageEnemy,resolveRift} from '../src/engine.js';
import {beginBossRush,configureRushLoadout} from '../src/boss-rush.js';
import {finishBossIntro} from '../src/boss-intro.js';
import {ensureWorld} from '../src/world.js';
import {saveRun,loadRun} from '../src/run-save.js';

const hero=CHARACTERS.find(c=>c.id==='goku');
const storage=()=>{const data=new Map();return{getItem:k=>data.get(k)||null,setItem:(k,v)=>data.set(k,v),removeItem:k=>data.delete(k)};};
function quiet(create=createRun){
 const g=create(hero,3);g.events.nextAt=1e9;g.chestRandom=()=>.99;g.spawn=g.eliteAt=g.nextBossWave=1e9;g.p.nextXp=1e9;g.p.regen=0;g.invuln=1e6;g.p.cooldowns={ki:1e6};ensureWorld(g);return g;
}
function approach(g,bossId='foundereren'){
 g.rifts.portal={bossId,x:g.p.x,y:g.p.y,age:0,serial:++g.rifts.opened};updateRun(g,.01);assert.equal(g.status,'rift');
}
function enter(g,bossId='foundereren'){
 approach(g,bossId);assert.ok(resolveRift(g,true));assert.ok(g.bossIntro);finishBossIntro(g);return g.enemies.find(e=>e.riftBoss);
}
function resume(g){g.status=g.resumeStatus;g.chestRandom=()=>.99;return g;}


function finishDeath(g){for(let i=0;i<90&&g.status==='playing'&&g.enemies.some(e=>e.boss&&e.hp<=0&&!e.deathComplete);i++)updateRun(g,.02);}
test('timed rifts require approaching and opting in, while a declined portal resumes either survival mode',()=>{
 for(const create of [createRun,createHardcoreRun]){
  const g=quiet(create);g.time=180;updateRun(g,.01);assert.equal(g.status,'playing');assert.ok(g.rifts.portal);assert.equal(g.enemies.length,0);
  Object.assign(g.p,{x:g.rifts.portal.x,y:g.rifts.portal.y});updateRun(g,.01);assert.equal(g.status,'rift');const clock=g.time;updateRun(g,10);assert.equal(g.time,clock);
  const save=storage();assert.ok(saveRun(g,save));const loaded=loadRun(save);assert.equal(loaded.resumeStatus,'rift');assert.equal(loaded.rifts.portal.bossId,g.rifts.portal.bossId);
  resume(loaded);assert.ok(resolveRift(loaded,false));assert.equal(loaded.status,'playing');assert.equal(loaded.rifts.portal,null);assert.equal(loaded.rifts.declined,1);assert.ok(loaded.rifts.nextAt>loaded.time);assert.equal(loaded.enemies.length,0);
 }
});

test('a rift isolates its powerful boss and suppresses every overdue normal spawn until the encounter is cleared',()=>{
 const g=quiet(),mob=spawnEnemy(g,false,false,'soldier');Object.assign(mob,{x:350,y:20,attackCD:999});
 g.shots=[{type:'ki',x:0,y:0,life:1,hits:new Set()}];g.fields=[{kind:'blue'}];const e=enter(g,'beerus');assert.equal(g.enemies.length,1);assert.equal(g.rifts.active.suspended.enemies[0].id,mob.id);assert.equal(g.shots.length,0);assert.equal(g.fields.length,0);
 assert.ok(e.maxHp>8000);g.spawn=g.eliteAt=0;g.nextBossWave=5;g.time=300;updateRun(g,.01);assert.equal(g.enemies.length,1);assert.equal(g.enemies[0].id,e.id);assert.equal(g.nextBossWave,5);assert.equal(g.rifts.active.bossEntityId,e.id);
 e.hp=0;updateRun(g,.01);assert.ok(g.rifts.active);finishDeath(g);assert.equal(g.rifts.active,null);assert.ok(g.enemies.some(other=>other.id===mob.id));assert.equal(g.nextBossWave,5);assert.equal(g.status,'chest');assert.equal(g.rewards.length,5);
});

test('rift overkill preserves the stronger second phase and saves the exact active encounter',()=>{
 const g=quiet(),e=enter(g,'walpurgisrift');damageEnemy(g,e,1e12);assert.ok(e.hp>0&&e.hp<e.maxHp*.5);updateRun(g,.01);assert.equal(e.enraged,false);assert.equal(g.riftTrial.kind,'spotlights');assert.equal(g.rifts.cleared,0);assert.equal(g.chests.length,0);
 const expected=structuredClone(g.riftTrial),store=storage();assert.ok(saveRun(g,store));const loaded=resume(loadRun(store));assert.equal(loaded.rifts.active.bossEntityId,e.id);assert.equal(loaded.enemies[0].hp,e.hp);assert.deepEqual(loaded.riftTrial,expected);
 while(loaded.riftTrial){const target=loaded.riftTrial.goals[loaded.riftTrial.stage];Object.assign(loaded.p,{x:target.x,y:target.y});for(let i=0;i<41;i++)updateRun(loaded,.02);}
 assert.equal(loaded.enemies[0].enraged,true);assert.equal(loaded.enemies.filter(other=>other.riftBoss).length,1);assert.equal(loaded.rifts.cleared,0);
});

test('one rift victory grants large rewards once and its five optional offers retain evolution priority',()=>{
 const g=quiet();g.p.weapons.ki=5;g.p.passives.senzu=3;g.p.hp=30;const e=enter(g);e.hp=0;updateRun(g,.01);finishDeath(g);
 assert.equal(g.money,900);assert.equal(g.kills,1);assert.equal(g.bossKills,1);assert.equal(g.characterXp,150);assert.equal(g.rifts.cleared,1);assert.equal(g.rifts.history.length,1);assert.equal(g.p.hp,30+g.p.maxHp*.35);assert.equal(g.rewards.length,5);assert.equal(g.chestKind,'rift');assert.equal(g.gems.reduce((sum,gem)=>sum+gem.value,0),250);
 assert.equal(g.rewards[0].id,'kamehameha');assert.equal(g.p.fusions.ki,undefined);assert.ok(resolveChestReward(g,false,()=>0));assert.equal(g.rewards[1].id,'kamehameha');assert.ok(resolveChestReward(g,true,()=>0));assert.equal(g.p.fusions.ki,'kamehameha');assert.ok(ignoreChest(g));
 const paid=[g.money,g.kills,g.bossKills,g.characterXp,g.rifts.cleared];g.status='playing';updateRun(g,.01);assert.deepEqual([g.money,g.kills,g.bossKills,g.characterXp,g.rifts.cleared],paid);
});

test('a mimic guards the same promised offers, survives leaving the area, and cannot impersonate its recovered chest twice',()=>{
 const g=quiet(),offers=chestOffers(g.p,3,()=>0),chest={x:0,y:0,source:'Frieza',rewardCount:3,rewardOffers:offers};g.chests=[chest];g.chestRandom=()=>0;updateRun(g,.01);
 const e=g.enemies.find(enemy=>enemy.archetype==='mimic');assert.ok(e);assert.equal(g.status,'playing');assert.equal(g.chests.length,1);assert.equal(chest.mimicLocked,true);assert.deepEqual(chest.rewardOffers,offers);assert.equal(g.rewards.length,0);
 g.p.x=e.x+3000;updateRun(g,.01);assert.ok(g.enemies.some(enemy=>enemy.id===e.id),'the locked chest guard cannot despawn at the normal mob leash');g.p.x=e.x;g.p.y=e.y;e.hp=0;updateRun(g,.01);
 assert.equal(g.status,'chest');assert.equal(g.chestKind,'mimic');assert.equal(g.chests.length,0);assert.deepEqual(g.rewards,offers);assert.equal(g.kills,1);assert.equal(g.bossKills,0);assert.equal(g.characterXp,5);assert.equal(g.money,0);assert.equal(g.chestOpeningComplete,false);
 g.chestOpeningComplete=true;resolveChestReward(g,false,()=>0);const store=storage();assert.ok(saveRun(g,store));const loaded=loadRun(store);assert.equal(loaded.resumeStatus,'chest');assert.equal(loaded.chestOpeningComplete,true);assert.equal(loaded.chestIndex,1);assert.equal(loaded.rewards[0].decision,'ignored');
});

test('Boss Rush waits for a mimic and its recovered chest across a checkpoint before advancing',()=>{
 const g=quiet(createBossRushRun);assert.ok(configureRushLoadout(g,{weapons:['ki','blue','red','kunai','odmblades'],passives:['senzu','eyes','power','magnet','headband']}));assert.ok(beginBossRush(g));
 g.p.cooldowns=Object.fromEntries(Object.keys(g.p.weapons).map(id=>[id,999]));g.chestRandom=()=>0;updateRun(g,.01);finishBossIntro(g);const first=g.enemies.find(e=>e.boss);first.hp=0;updateRun(g,.01);finishDeath(g);
 assert.equal(g.rush.cleared,1);assert.equal(g.rush.awaitingLoot,true);assert.equal(g.chests[0].mimicLocked,true);assert.ok(g.enemies.some(e=>e.archetype==='mimic'));assert.equal(g.rifts.opened,0);
 const store=storage();assert.ok(saveRun(g,store));const loaded=resume(loadRun(store));loaded.chestRandom=()=>0;updateRun(loaded,3);assert.equal(loaded.rush.cleared,1);assert.equal(loaded.rush.activeBossId,null);assert.ok(loaded.enemies.every(e=>e.archetype==='mimic'));
 const mimic=loaded.enemies[0];mimic.hp=0;updateRun(loaded,.01);assert.equal(loaded.status,'chest');assert.equal(loaded.rush.cleared,1);assert.ok(ignoreChest(loaded));loaded.status='playing';updateRun(loaded,2.1);assert.ok(loaded.bossIntro);assert.equal(loaded.rush.round,2);assert.ok(loaded.enemies.some(e=>e.boss));
});
