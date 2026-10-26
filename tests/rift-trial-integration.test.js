import test from 'node:test';
import assert from 'node:assert/strict';
import {CHARACTERS} from '../src/game.js';
import {createRun,spawnEnemy,resolveRift,updateRun,damageEnemy,castWeapon,useSpecial,useDash} from '../src/engine.js';
import {finishBossIntro} from '../src/boss-intro.js';
import {saveRun,loadRun} from '../src/run-save.js';
import {applyStatus} from '../src/status.js';
import {RIFT_TRIALS,riftTrialActive} from '../src/rift-trials.js';

const hero=id=>CHARACTERS.find(c=>c.id===id);
const memory=()=>({data:new Map(),getItem(k){return this.data.get(k)||null},setItem(k,v){this.data.set(k,v)},removeItem(k){this.data.delete(k)}});
function quiet(g){
 g.spawn=g.invuln=g.p.nextXp=g.events.nextAt=g.rifts.nextAt=1e9;
 g.p.weapons={};g.p.regen=0;g.chestRandom=()=>.99;
 return g;
}
function enter(id='darknessdevil',character='goku'){
 const g=quiet(createRun(hero(character),3));g.p.x=1200;g.p.y=900;
 const regular=spawnEnemy(g,false,false,'soldier');Object.assign(regular,{x:1800,y:1100,speed:0,attackCD:1e9});
 g.rifts.portal={bossId:id,x:g.p.x,y:g.p.y,age:0,serial:1};g.status='rift';assert.ok(resolveRift(g,true));finishBossIntro(g);
 const boss=g.enemies.find(e=>e.riftBoss);Object.assign(boss,{speed:0,attackCD:1e9});
 return {g,boss,regular};
}
function sim(g,seconds,input={x:0,y:0}){
 for(let t=0;t<seconds-1e-8;t+=.02)updateRun(g,Math.min(.02,seconds-t),input);
}
function start(g,boss){boss.hp=boss.maxHp*.49;updateRun(g,.02);assert.ok(riftTrialActive(g));return g.riftTrial;}
function collectDarkness(g){
 while(riftTrialActive(g)){
  const q=g.riftTrial,goal=q.goals.find(p=>!p.done),before=q.progress;
  assert.ok(goal,'an unfinished astronaut part remains reachable');
  // Begin outside the pickup zone and enter using the actual movement loop.
  g.p.x=goal.x-goal.r-55;g.p.y=goal.y;const from=g.p.x;
  for(let t=0;t<2&&riftTrialActive(g)&&g.riftTrial.progress===before;t+=.02)updateRun(g,.02,{x:1,y:0});
  assert.ok(g.p.x>from,'the normal movement input remains available in darkness');
  assert.ok(!riftTrialActive(g)||g.riftTrial.progress>before,'walking over a part collects it');
 }
}

test('every live calamity enters its own challenge at half HP before the ordinary second-phase AI can act',()=>{
 const kinds=new Set();
 for(const id of Object.keys(RIFT_TRIALS)){
  const {g,boss}=enter(id),hp=boss.hp;
  damageEnemy(g,boss,1e12);assert.ok(boss.hp>0&&boss.hp<hp,'overkill stops at the transition instead of skipping the challenge');
  updateRun(g,.02);assert.ok(riftTrialActive(g),id);assert.equal(g.riftTrial.bossId,id);assert.equal(g.riftTrial.bossEntityId,boss.id);assert.equal(g.riftTrial.kind,RIFT_TRIALS[id].kind);kinds.add(g.riftTrial.kind);
  assert.equal(boss.enraged,false,'combat phase two waits for its objective');assert.equal(g.bossIntro,null);assert.equal(g.money,0);assert.equal(g.bossKills,0);assert.equal(g.rifts.cleared,0);
 }
 assert.equal(kinds.size,9,'each calamity has a distinct movement objective');
});

test('damage-over-time and a spent ultimate impact crossing half HP enter the objective before another boss action',()=>{
 for(const source of ['poison','spirit-bomb']){
  const {g,boss}=enter();boss.hp=boss.maxHp*.5+1;boss.attackCD=0;
  if(source==='poison'){assert.ok(applyStatus(boss,'poison',3,{power:999999}));boss.statuses.poison.tick=0;}
  else{assert.ok(useSpecial(g));g.ultimate.age=1.79;}
  updateRun(g,.02);assert.ok(riftTrialActive(g),source);assert.equal(boss.enraged,false);assert.equal(boss.riftAttack,null);assert.equal(g.hazards.length,0);assert.ok(boss.hp>0);
  if(source==='spirit-bomb'){
   const hp=boss.hp;assert.equal(g.riftTrial.suspendedUltimate.impacted,true);collectDarkness(g);assert.equal(g.ultimate.impacted,true);updateRun(g,.04);assert.equal(boss.hp,hp,'returning from the search does not replay an already spent Spirit Bomb hit');
  }
 }
});

test('Darkness vanishes until three astronaut parts are found, then returns alive in phase two exactly once',()=>{
 const {g,boss}=enter(),q=start(g,boss),hp=boss.hp;
 assert.equal(q.kind,'blackout');assert.equal(q.hideBoss,true);assert.equal(q.total,3);assert.equal(q.goals.length,3);assert.equal(q.progress,0);
 collectDarkness(g);assert.equal(riftTrialActive(g),false);assert.equal(boss.enraged,true);assert.equal(boss.hp,hp);assert.ok(boss.attackCD>=2);assert.ok(g.invuln>0);assert.equal(g.rifts.cleared,0);assert.equal(g.money,0);assert.equal(g.chests.length,0);
 sim(g,.3);assert.equal(riftTrialActive(g),false,'a completed challenge does not recur while the boss remains below half HP');assert.ok(boss.hp>0);
});

test('all nine movement objectives can finish through the live run loop and return to their own stronger attack rotation',()=>{
 for(const id of Object.keys(RIFT_TRIALS)){
  const {g,boss}=enter(id);start(g,boss);const hp=boss.hp;
  for(let steps=0;steps<1000&&riftTrialActive(g);steps++){
   const q=g.riftTrial;
   let destination;
   if(q.kind==='offerings')destination=q.carrying?q.shrine:q.goals.find(p=>!p.done);
   else if(q.kind==='mirrors')destination=q.goals.find(p=>p.real);
   else if(q.kind==='shelters')destination=q.goals.find(p=>p.active);
   else if(q.kind==='procession')destination=q.sanctuary;
   else if(q.kind==='vents')destination=q.goals.some(p=>p.armed&&!p.done)?{x:0,y:0}:q.goals.find(p=>!p.done);
   else destination=q.goals.find(p=>p.active&&!p.done)||q.goals.find(p=>!p.done);
   assert.ok(destination,id+' presents its next movement target');g.p.x=destination.x;g.p.y=destination.y;updateRun(g,.04);
  }
  assert.equal(riftTrialActive(g),false,id+' can complete without a soft lock');assert.equal(boss.enraged,true);assert.equal(boss.hp,hp);assert.equal(g.money,0);assert.equal(g.rifts.cleared,0);assert.equal(g.enemies.filter(e=>e.boss).length,1);
  // Objective completion hands control back to the existing real boss AI.
  g.p.x=0;g.p.y=140;boss.x=155;boss.y=60;boss.attackCD=0;boss.windup=0;updateRun(g,.02);
  assert.equal(riftTrialActive(g),false);assert.ok(boss.riftAttack&&g.hazards.length,id+' resumes its phase-two attack pattern');
 }
});

test('trial isolation blocks direct and automatic offense while preserving an active guardian and ultimate for later',()=>{
 const {g,boss}=enter('darknessdevil','frieren');
 assert.ok(useSpecial(g));assert.ok(g.golem);g.p.weapons={zoltraak:5};g.p.cooldowns.zoltraak=.7;
 start(g,boss);const q=g.riftTrial,guardian=structuredClone(g.golem),ultimate=structuredClone(q.suspendedUltimate),cooldown=g.p.cooldowns.zoltraak,special=g.special,hp=boss.hp;
 assert.ok(ultimate);assert.equal(g.ultimate,null);assert.equal(castWeapon(g,'zoltraak',boss),false);assert.equal(useSpecial(g),false);damageEnemy(g,boss,999999);
 sim(g,.4);assert.equal(boss.hp,hp);assert.deepEqual(g.golem,guardian);assert.deepEqual(g.riftTrial.suspendedUltimate,ultimate);assert.equal(g.p.cooldowns.zoltraak,cooldown);assert.equal(g.special,special);assert.equal(g.shots.length,0);
 collectDarkness(g);const {golem:expectedGolem,...expectedCast}=ultimate,{golem:liveGolem,...liveCast}=g.ultimate;
 assert.deepEqual(liveCast,expectedCast,'the pending ultimate resumes at its exact saved cast age');assert.equal(liveGolem,g.golem);assert.equal(liveGolem.phaseAge,expectedGolem.phaseAge);assert.equal(liveGolem.hp,expectedGolem.hp);assert.equal(boss.hp,hp);
});

test('blackout clears old servants and attacks, suppresses contact, and permits movement and a defensive dash without regenerating',()=>{
 const {g,boss}=enter();const child=spawnEnemy(g,false,false,'hellhand');Object.assign(child,{ownerId:boss.id,riftSummon:true,x:g.p.x,y:g.p.y,attackCD:0});
 g.enemyShots=[{sourceId:child.id,x:g.p.x,y:g.p.y,vx:0,vy:0,r:20,damage:999,life:8,age:0}];g.hazards=[{sourceId:boss.id,shape:'circle',x:g.p.x,y:g.p.y,r:400,age:1,delay:0,duration:10,damage:999}];
 applyStatus(g.p,'poison',8,{power:999});start(g,boss);
 assert.equal(g.enemies.filter(e=>e.riftSummon).length,0);assert.equal(g.enemyShots.length,0);assert.equal(g.hazards.length,0);
 Object.assign(boss,{x:g.p.x,y:g.p.y});g.p.hp=50;g.p.shield=0;g.p.regen=20;g.p.maxShield=20;g.p.shieldRecharge=.1;g.p.shieldTimer=0;g.invuln=0;
 const elapsed=g.time,wave=structuredClone(g.waveState),x=g.p.x;sim(g,.2,{x:1,y:0});assert.ok(g.p.x>x);assert.ok(g.time>elapsed);assert.deepEqual(g.waveState,wave);assert.equal(g.p.hp,50);assert.equal(g.p.shield,0);
 g.dashCD=0;assert.ok(useDash(g,{x:1,y:0}));const from=g.p.x;sim(g,.1);assert.ok(g.p.x>from,'dash keeps its normal movement during a challenge');assert.equal(g.p.hp,50);
});

test('a partial blackout checkpoints fixed part positions and challenge clocks, pauses on reload, and resumes unfinished progress',()=>{
 const {g,boss}=enter(),q=start(g,boss),first=q.goals[0];g.p.x=first.x;g.p.y=first.y;updateRun(g,.02);assert.equal(q.progress,1);
 const expected=structuredClone(g.riftTrial),storage=memory();assert.ok(saveRun(g,storage));const loaded=loadRun(storage);assert.ok(loaded);assert.equal(loaded.status,'paused');assert.deepEqual(loaded.riftTrial,expected);
 const position=[loaded.p.x,loaded.p.y],time=loaded.time;updateRun(loaded,10,{x:1,y:0});assert.deepEqual(loaded.riftTrial,expected);assert.deepEqual([loaded.p.x,loaded.p.y],position);assert.equal(loaded.time,time);
 loaded.status='playing';delete loaded.resumeStatus;collectDarkness(loaded);assert.equal(riftTrialActive(loaded),false);assert.equal(loaded.enemies.find(e=>e.riftBoss).enraged,true);assert.equal(loaded.rifts.cleared,0);assert.equal(loaded.money,0);
 assert.ok(saveRun(loaded,storage));const completed=loadRun(storage);assert.ok(completed);completed.status='playing';delete completed.resumeStatus;sim(completed,.1);assert.equal(riftTrialActive(completed),false,'a resumed completed phase does not repeat its search');
});

test('transformed Guts and Denji resume their exact ultimate and form after a saved challenge without resetting spent healing',()=>{
 for(const id of ['guts','denji']){
  const {g,boss}=enter('darknessdevil',id);assert.ok(useSpecial(g));g.ultimate.age=2.1;g.ultimate.pulses=5;if(id==='denji')g.ultimate.healed=12;
  const ultimate=structuredClone(g.ultimate),hp=g.p.hp;assert.equal(g.p.form,1);start(g,boss);
  const storage=memory();assert.ok(saveRun(g,storage));const loaded=loadRun(storage);assert.ok(loaded);assert.deepEqual(loaded.riftTrial.suspendedUltimate,ultimate);loaded.status='playing';delete loaded.resumeStatus;collectDarkness(loaded);
  assert.deepEqual(loaded.ultimate,ultimate,id+' resumes the same cast, with spent pulse/healing records');assert.equal(loaded.p.form,1);assert.equal(loaded.p.pose,id==='denji'?'chainsaw':'berserk');assert.equal(loaded.p.hp,hp);assert.equal(loaded.special,g.special);
 }
});

test('a saved golem interlude restores the same wounded guardian and reconnects the pending ultimate to its live object',()=>{
 const {g,boss}=enter('darknessdevil','frieren');assert.ok(useSpecial(g));g.golem.hp-=30;start(g,boss);const hp=g.golem.hp,id=g.golem.id,age=g.golem.phaseAge;
 const storage=memory();assert.ok(saveRun(g,storage));const loaded=loadRun(storage);assert.ok(loaded);loaded.status='playing';delete loaded.resumeStatus;collectDarkness(loaded);
 assert.equal(loaded.golem.hp,hp);assert.equal(loaded.golem.id,id);assert.equal(loaded.golem.phaseAge,age);assert.equal(loaded.ultimate.golem,loaded.golem,'JSON copies are rebound to the one live guardian');assert.equal(loaded.summons.filter(s=>s.kind==='frierenGolem').length,0);
});

test('older enraged rift saves and manually spawned catalog bosses do not unexpectedly begin a challenge',()=>{
 const old=enter();old.boss.enraged=true;old.boss.hp=old.boss.maxHp*.3;delete old.boss.riftTrialDone;delete old.boss.riftTrialStarted;delete old.g.riftTrial;
 const storage=memory();assert.ok(saveRun(old.g,storage));const loaded=loadRun(storage);assert.ok(loaded);loaded.status='playing';delete loaded.resumeStatus;sim(loaded,.1);assert.equal(riftTrialActive(loaded),false);assert.equal(loaded.enemies.find(e=>e.riftBoss).enraged,true);
 const g=quiet(createRun(hero('goku'),3)),boss=spawnEnemy(g,true,false,'darknessdevil');Object.assign(boss,{hp:boss.maxHp*.3,speed:0,attackCD:999});updateRun(g,.02);assert.equal(riftTrialActive(g),false,'a catalog test spawn is not an entered rift');
});

test('finishing the search pays nothing; the later actual boss defeat restores the suspended world and rewards only once',()=>{
 const {g,boss,regular}=enter();start(g,boss);collectDarkness(g);assert.equal(g.riftArena.bossId,'darknessdevil');assert.equal(g.rifts.active.bossEntityId,boss.id);assert.equal(g.money,0);assert.equal(g.kills,0);assert.equal(g.characterXp,0);
 boss.hp=0;sim(g,1.8);assert.equal(g.rifts.cleared,1);assert.equal(g.riftArena,null);assert.equal(g.rifts.active,null);assert.equal(g.money,900);assert.equal(g.bossKills,1);assert.equal(g.kills,1);assert.deepEqual([g.p.x,g.p.y],[1200,900]);assert.ok(g.enemies.some(e=>e.id===regular.id));assert.ok(g.rewards.length===5||g.chests.some(c=>c.rewardCount===5));
 const storage=memory();assert.ok(saveRun(g,storage));const loaded=loadRun(storage);assert.ok(loaded);loaded.status='playing';delete loaded.resumeStatus;sim(loaded,.2);assert.equal(loaded.money,900);assert.equal(loaded.rifts.cleared,1);assert.equal(loaded.bossKills,1);assert.equal(riftTrialActive(loaded),false);
});
