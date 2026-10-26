import test from 'node:test';
import assert from 'node:assert/strict';
import {CHARACTERS,createPlayer,applyChoice} from '../src/game.js';
import {newRifts,updateRifts,chooseRift,riftCombatActive,defeatedRiftBoss,tryChestMimic,defeatedMimic,resolveChestContents,restoreRifts,mimicAttack,RIFT_ENCOUNTERS,MIMIC_CHANCE} from '../src/rift-encounters.js';
import {drawRifts,drawRiftCompass} from '../src/rift-event-art.js';
function run(){return {mode:'survival',status:'playing',time:180,wave:7,p:{...createPlayer(CHARACTERS[0]),x:0,y:0},rifts:newRifts(),enemies:[],enemyShots:[],hazards:[],chests:[],trinkets:{},id:0,shots:[],fields:[],crimsonEchoes:[],gems:[],money:0,kills:0,bossKills:0,characterXp:0,spawn:-1,eliteAt:180,nextBossWave:10,invuln:0,zoom:.9};}
function spawn(g,boss,elite,id){const e={id:++g.id,archetype:id,name:RIFT_ENCOUNTERS.find(d=>d.id===id)?.name||'Mimic',x:0,y:0,hp:100,maxHp:100,boss,elite,speed:50,attackCD:0};g.enemies.push(e);return e;}
function open(g){assert.ok(updateRifts(g,.02,{},()=>0));g.p.x=g.rifts.portal.x;g.p.y=g.rifts.portal.y;updateRifts(g,.02);assert.equal(g.status,'rift');}
test('optional rifts open after three minutes, require approach and stop in Boss Rush or interruptions',()=>{
 const g=run();g.time=179.9;assert.equal(updateRifts(g,.1),false);assert.equal(g.rifts.portal,null);g.time=180;assert.ok(updateRifts(g,.1,{},()=>0));assert.equal(g.status,'playing');assert.equal(g.rifts.portal.bossId,'foundereren');assert.equal(g.rifts.portal.x,165);g.status='paused';const age=g.rifts.portal.age;updateRifts(g,10);assert.equal(g.rifts.portal.age,age);g.status='playing';g.p.x=165;updateRifts(g,.1);assert.equal(g.status,'rift');const rush=run();rush.mode='bossrush';assert.equal(updateRifts(rush,99),false);assert.equal(rush.rifts.portal,null);
});
test('portals wait for ordinary bosses and loot and choose a reachable spawn point',()=>{
 for(const blocker of ['boss','chest']){const g=run();if(blocker==='boss')g.enemies.push({boss:true,hp:10});else g.chests.push({x:0,y:0});assert.equal(updateRifts(g,.1),false);assert.equal(g.rifts.portal,null);}
 const g=run();let attempts=0;updateRifts(g,.1,{blocked:()=>++attempts<5},()=>0);assert.equal(attempts,5);assert.ok(g.rifts.portal);
});
test('declining consumes that portal and waits five minutes; expiry does the same without entering',()=>{
 const g=run();open(g);assert.ok(chooseRift(g,false));assert.equal(g.status,'playing');assert.equal(g.rifts.portal,null);assert.equal(g.rifts.nextAt,480);assert.equal(g.rifts.declined,1);assert.equal(chooseRift(g,true,{spawn}),false);
 const h=run();updateRifts(h,.1,{},()=>0);h.time=255;updateRifts(h,75);assert.equal(h.rifts.portal,null);assert.equal(h.rifts.nextAt,555);
});
test('entering isolates the superboss, preserves regular enemies and clears outgoing attacks',()=>{
 const g=run(),regular={id:77,x:0,y:0,hp:80,boss:false};g.enemies.push(regular);g.enemyShots=[{x:10,y:10,life:3}];g.hazards=[{delay:1,age:.2}];g.shots=[{life:3}];g.fields=[{life:4}];open(g);let intros=0;assert.ok(chooseRift(g,true,{spawn,queueIntro:()=>intros++}));assert.equal(intros,1);assert.ok(riftCombatActive(g));assert.equal(g.enemies.length,1);assert.ok(g.enemies[0].riftBoss);assert.equal(g.enemies[0].archetype,'foundereren');assert.equal(g.rifts.active.suspended.enemies[0],regular);assert.equal(g.enemyShots.length,0);assert.equal(g.hazards.length,0);assert.equal(g.shots.length,0);assert.equal(g.fields.length,0);assert.equal(g.rifts.portal,null);assert.ok(g.invuln>=2);
});
test('rift defeat gives one large reward, restores suspended enemies safely and prevents a boss backlog',()=>{
 const g=run(),regular={id:77,x:165,y:0,hp:80,boss:false};g.enemies.push(regular);open(g);chooseRift(g,true,{spawn});const boss=g.enemies[0];boss.hp=0;g.time=420;g.p.hp=10;g.p.meta.coinGain=.2;
 assert.ok(defeatedRiftBoss(g,boss,{coinMultiplier:()=>1.5}));assert.equal(g.money,1620);assert.equal(g.bossKills,1);assert.equal(g.characterXp,150);assert.equal(g.chests.length,1);assert.equal(g.chests[0].rewardCount,5);assert.equal(g.chests[0].tier,'rift');assert.equal(g.gems[0].value,250);assert.ok(g.p.hp>10);assert.ok(Math.hypot(regular.x-g.p.x,regular.y-g.p.y)>=150);assert.ok(g.nextBossWave>Math.floor(g.time/30)+1);assert.equal(g.rifts.active,null);assert.equal(g.rifts.nextAt,720);
 assert.ok(defeatedRiftBoss(g,boss));assert.equal(g.chests.length,1);assert.equal(g.money,1620);assert.equal(g.bossKills,1);
});
test('each new portal advances to a different unique superboss',()=>{
 const g=run();const seen=[];for(let i=0;i<RIFT_ENCOUNTERS.length+1;i++){open(g);seen.push(g.rifts.portal.bossId);chooseRift(g,false);g.time=g.rifts.nextAt;}assert.deepEqual(seen,[...RIFT_ENCOUNTERS.map(e=>e.id),RIFT_ENCOUNTERS[0].id]);
});
test('five percent mimic rolls once per chest and never consumes or duplicates its promised loot',()=>{
 assert.equal(MIMIC_CHANCE,.05);const g=run(),chest={x:0,y:0,source:'Frieza',rewardCount:5};g.chests.push(chest);g.p.weapons.ki=5;g.p.passives.senzu=3;
 assert.ok(tryChestMimic(g,chest,{spawn},()=>0));const mimic=g.enemies[0];assert.equal(mimic.boss,false);assert.equal(chest.mimicLocked,true);assert.equal(g.chests.length,1);assert.equal(chest.rewardOffers.length,5);assert.equal(chest.rewardOffers[0].id,'kamehameha');const original=structuredClone(chest.rewardOffers);assert.ok(tryChestMimic(g,chest,{spawn},()=>0));assert.equal(g.enemies.length,1);
 mimic.hp=0;assert.ok(defeatedMimic(g,mimic));assert.equal(chest.mimicLocked,false);assert.ok(chest.mimicDefeated);assert.deepEqual(resolveChestContents(g,chest,()=>.99),original);assert.equal(tryChestMimic(g,chest,{spawn},()=>0),false);assert.equal(g.enemies.length,1);const kills=g.kills;assert.ok(defeatedMimic(g,mimic));assert.equal(g.kills,kills);
 const noMimic={x:0,y:0};assert.equal(tryChestMimic(g,noMimic,{spawn},()=>.05),false);assert.equal(tryChestMimic(g,noMimic,{spawn},()=>0),false);
});
test('mimic recovery preserves reward slots while prioritizing newly unlocked evolutions',()=>{
 const g=run(),chest={x:0,y:0,rewardCount:3};g.chests.push(chest);tryChestMimic(g,chest,{spawn},()=>0);assert.equal(chest.rewardOffers[0].kind,'item');g.p.weapons.ki=5;g.p.passives.senzu=3;const mimic=g.enemies[0];mimic.hp=0;defeatedMimic(g,mimic);const offers=resolveChestContents(g,chest,()=>0);assert.equal(offers.length,3);assert.equal(offers[0].id,'kamehameha');applyChoice(g.p,offers[0]);const again=resolveChestContents(g,chest,()=>0);assert.equal(again.length,3);assert.notEqual(again[0].id,'kamehameha');
});
test('mimics warn their biting lunge and have a separate treasure spit attack',()=>{
 const g=run(),e={id:9,x:0,y:0,color:'#e6ba77',behavior:'mimic',skill:1};let shots=0;const api={fan:()=>shots++,hazard:(g,h)=>g.hazards.push(h)};assert.ok(mimicAttack(g,e,g.p,0,api));assert.equal(g.hazards[0].delay,.85);assert.equal(g.hazards[0].cancelWithSource,true);assert.equal(g.hazards[0].sourceId,9);assert.ok(e.dash>e.windup);e.skill=2;mimicAttack(g,e,g.p,0,api);assert.equal(shots,1);assert.equal(mimicAttack(g,{behavior:'curse'},g.p,0,api),false);
});
test('rift and mimic state survives serialization without rerolls and legacy or orphan state recovers safely',()=>{
 const g=run();open(g);const pending=JSON.parse(JSON.stringify(g));restoreRifts(pending);assert.equal(pending.status,'rift');assert.equal(pending.rifts.portal.bossId,'foundereren');chooseRift(g,true,{spawn});const restored=JSON.parse(JSON.stringify(g));restoreRifts(restored);assert.ok(riftCombatActive(restored));assert.equal(restored.rifts.active.bossEntityId,g.rifts.active.bossEntityId);
 const h=run(),chest={x:0,y:0,rewardCount:3};h.chests.push(chest);tryChestMimic(h,chest,{spawn},()=>0);const saved=JSON.parse(JSON.stringify(h));restoreRifts(saved);assert.equal(saved.chests[0].mimicLocked,true);assert.deepEqual(saved.chests[0].rewardOffers,chest.rewardOffers);saved.enemies=[];restoreRifts(saved);assert.equal(saved.chests[0].mimicLocked,false);assert.equal(saved.chests[0].mimicChecked,true);
 const legacy=run();delete legacy.rifts;restoreRifts(legacy);assert.equal(legacy.rifts.nextAt,180);legacy.status='paused';legacy.resumeStatus='rift';restoreRifts(legacy);assert.equal(legacy.resumeStatus,'playing');
});
test('portal art and offscreen compass draw in both motion settings without changing simulation state',()=>{
 const g=run();updateRifts(g,.1,{},()=>0);const before=JSON.stringify(g.rifts),commands=[];const c=new Proxy({createRadialGradient:()=>({addColorStop(){}})},{get:(t,k)=>k in t?t[k]:(...args)=>commands.push([k,...args]),set:(t,k,v)=>(t[k]=v,true)});
 for(const quiet of [false,true]){drawRifts(c,g,quiet);g.p.x=2000;drawRiftCompass(c,g,390,844,quiet);g.p.x=0;}
 assert.equal(JSON.stringify(g.rifts),before);assert.ok(commands.some(([k])=>k==='fillText'));assert.ok(commands.some(([k,...args])=>k==='fillText'&&args[0]==='RIFT'));
});
