import {newWaveState} from '../src/waves.js';
import test from 'node:test';
import assert from 'node:assert/strict';
import {CHARACTERS,ITEMS,FUSIONS,createPlayer,getUpgradePool,applyChoice,refreshStats} from '../src/game.js';
import {createRun,updateRun,useDash,useSpecial,hitPlayer,spawnEnemy,castWeapon} from '../src/engine.js';
import {queueBossIntro,finishBossIntro,bossIntroMarkup} from '../src/boss-intro.js';
import {BOSSES,makeEnemy,updateEnemyAI} from '../src/enemies.js';
import {newProfile,sanitizeProfile,creditRun,saveProfile,loadProfile} from '../src/progression.js';
import {characterPixels,pilotPixels} from '../src/pixel-characters.js';
import {applyStatus,hasStatus} from '../src/status.js';
const kurumi=CHARACTERS.find(c=>c.id==='kurumi');
function quiet(c=kurumi){const g=createRun(c);g.events.nextAt=1e9;g.spawn=g.eliteAt=99999;g.p.nextXp=99999;return g;}
function target(g,{boss=false,x=140,y=0}={}){const e=makeEnemy(g,boss?'frieza':'soldier',boss);Object.assign(e,{x,y,hp:10000,maxHp:10000,speed:0,attackCD:9999});g.enemies.push(e);return e;}
function steps(g,n=30){for(let i=0;i<n;i++)updateRun(g,.02);}


function finishDeath(g){for(let i=0;i<90&&g.status==='playing'&&g.enemies.some(e=>e.boss&&e.hp<=0&&!e.deathComplete);i++)updateRun(g,.02);}
test('natural boss entrances freeze combat, statuses, projectiles, cooldowns and player movement',()=>{
 const g=quiet();g.time=120;g.wave=5;g.waveState=newWaveState(5);g.nextBossWave=5;updateRun(g,.01);assert.ok(g.bossIntro&&g.enemies.some(e=>e.boss&&e.name===g.bossIntro.name));
 g.p.hp=50;g.p.cooldowns.clockshot=7;g.special=6;g.dashCD=8;applyStatus(g.p,'poison',3,{power:10});g.enemyShots=[{x:30,y:10,age:0,life:7,vx:100,vy:0,r:5,damage:20}];g.hazards=[{x:0,y:0,age:0,delay:.5,duration:1,damage:20,shape:'circle',r:50}];
 const before=JSON.stringify([g.time,g.p,g.enemyShots,g.hazards,g.enemies,g.special,g.dashCD]);
 assert.equal(useDash(g),false);assert.equal(useSpecial(g),false);assert.equal(hitPlayer(g,100),false);updateRun(g,.4,{x:1,y:1});
 assert.equal(JSON.stringify([g.time,g.p,g.enemyShots,g.hazards,g.enemies,g.special,g.dashCD]),before);assert.ok(g.bossIntro.age>.3);
});
test('entrances finish automatically with a grace period, can be skipped, and never repeat for a wave',()=>{
 const g=quiet();g.time=120;g.wave=5;g.waveState=newWaveState(5);g.nextBossWave=5;updateRun(g,.01);const time=g.time;g.invuln=0;for(let i=0;i<400&&g.bossIntro;i++)updateRun(g,.02);assert.equal(g.bossIntro,null);assert.ok(g.invuln>.7);assert.equal(g.time,time);updateRun(g,.02);assert.equal(g.enemies.filter(e=>e.boss).length,1);assert.equal(g.bossIntro,null);
 g.enemies=[];g.time=270;g.wave=10;g.waveState=newWaveState(10);g.nextBossWave=10;updateRun(g,.01);assert.ok(g.bossIntro);assert.equal(finishBossIntro(g),true);assert.equal(finishBossIntro(g),false);assert.equal(g.nextBossWave,15);updateRun(g,.02);assert.equal(g.bossIntro,null);
});
test('paused entrances do not advance; multiple arrivals keep individual titles in order',()=>{
 const g=quiet();for(const wave of [5,10,15])queueBossIntro(g,spawnEnemy(g,true,false,undefined),wave);assert.equal(g.bossIntro.wave,5);assert.equal(g.bossIntroQueue.length,2);g.status='paused';updateRun(g,3);assert.equal(g.bossIntro.age,0);g.status='playing';finishBossIntro(g);assert.equal(g.bossIntro.wave,10);finishBossIntro(g);assert.equal(g.bossIntro.wave,15);finishBossIntro(g);assert.equal(g.bossIntro,null);
});
test('every boss has a cut-in with its actual sprite, title, wave and accessible skip button',()=>{
 for(const [id,def]of Object.entries(BOSSES)){const g=quiet();const e=spawnEnemy(g,true,false,id);queueBossIntro(g,e,5);const html=bossIntroMarkup(g.bossIntro);assert.ok(html.includes(def.name));assert.ok(html.includes(def.title));assert.ok(html.includes('<rect'));assert.ok(html.includes('id="skip-intro"'));assert.ok(html.includes('aria-modal="true"'));}
 const g=quiet();g.p.reducedMotion=true;queueBossIntro(g,spawnEnemy(g,true,false,'frieza'),5);assert.equal(g.bossIntro.duration,1.2);
});
test('boss chests remain guaranteed and awarded once after an entrance',()=>{
 const g=quiet();g.time=120;g.wave=5;g.waveState=newWaveState(5);g.nextBossWave=5;updateRun(g,.01);finishBossIntro(g);const boss=g.enemies.find(e=>e.boss);boss.hp=0;boss.x=600;boss.y=0;updateRun(g,.01);finishDeath(g);assert.equal(g.chests.length,1);assert.equal(g.characterXp,25);updateRun(g,.01);assert.equal(g.chests.length,1);assert.equal(g.bossKills,1);
});
test('Kurumi has unique starting items, a shared loot pool and a fully playable fusion',()=>{
 const g=quiet();assert.deepEqual(g.p.weapons,{clockshot:1});assert.deepEqual(g.p.passives,{timepiece:1});assert.equal(g.p.cooldown,.94);
 const other=createPlayer(CHARACTERS[0]);for(const id of ['clockshot','timepiece'])assert.ok(getUpgradePool(other).some(c=>c.id===id));
 g.p.weapons.clockshot=5;g.p.passives.timepiece=3;refreshStats(g.p);const f=FUSIONS.find(f=>f.id==='zafkiel');assert.ok(f);assert.ok(applyChoice(g.p,{kind:'fusion',id:f.id}));castWeapon(g,'clockshot',{x:300,y:0});assert.equal(g.shots.length,5);assert.ok(g.shots.every(q=>q.fused&&q.pierce===5));assert.equal(g.shots[1].delay,.07);
});
test('clock bullets actually damage, curse and slow targets; reserve extends marks and fusion stuns',()=>{
 const g=quiet();g.p.x=0;g.p.y=0;const e=target(g,{x:130,y:0});g.p.cooldowns.clockshot=999;castWeapon(g,'clockshot',e);steps(g,16);assert.ok(e.hp<10000);assert.ok(hasStatus(e,'slow'));assert.ok(hasStatus(e,'cursed'));assert.ok(e.statuses.slow.remaining>2.3);
 g.shots=[];g.p.fusions.clockshot='zafkiel';g.p.weapons.clockshot=5;e.statuses={};e.ccRecovery=0;castWeapon(g,'clockshot',e);let stunned=false;for(let i=0;i<45;i++){updateRun(g,.02);stunned ||= hasStatus(e,'stun');}assert.ok(stunned);assert.ok(Number.isFinite(g.p.cooldowns.clockshot));
});
test('clock domain slows movement, attack clocks and hostile shots, but leaves the player in control',()=>{
 const normal=quiet(),clock=quiet();const a=target(normal,{x:150,y:100}),b=target(clock,{x:150,y:100});a.speed=b.speed=90;a.attackCD=b.attackCD=2;useSpecial(clock);assert.equal(clock.ultimate.shadows.length,3);
 updateEnemyAI(normal,a,.1);updateEnemyAI(clock,b,.1);assert.ok(b.attackCD>a.attackCD);assert.ok(Math.hypot(b.x-150,b.y-100)<Math.hypot(a.x-150,a.y-100));
 const shot={x:0,y:-120,vx:100,vy:0,life:4,age:0,r:3,damage:5,color:'#fff',kind:'orb'};normal.enemyShots=[{...shot}];clock.enemyShots=[{...shot}];normal.p.cooldowns.clockshot=clock.p.cooldowns.clockshot=999;updateRun(normal,.02);updateRun(clock,.02,{x:1,y:0});assert.ok(clock.enemyShots[0].x<normal.enemyShots[0].x);assert.ok(clock.p.x>0);assert.ok(useDash(clock));assert.ok(clock.shots.length>=8);
});
test('Kurumi ultimate finishes once and mastery affects her volleys and shadow damage',()=>{
 const profile=newProfile();profile.characters.kurumi.skills={marks:2,echo:2,night:1,doubles:1};const base=quiet(),g=createRun(kurumi,0,profile);g.spawn=g.eliteAt=99999;const e=target(g);castWeapon(g,'clockshot',e);castWeapon(base,'clockshot',{x:140,y:0});assert.equal(g.shots.length,base.shots.length+2);assert.ok(g.shots[0].damage>base.shots[0].damage);
 g.shots=[];g.p.cooldowns.clockshot=999;useSpecial(g);assert.equal(g.ultimate.duration,7.6);updateRun(g,.02);assert.ok(g.shots[0].damage>24*g.p.damage);g.ultimate.age=7.5;const hp=e.hp;updateRun(g,.02);assert.ok(e.hp<hp);assert.ok(hasStatus(e,'stun'));g.ultimate.age=7.6;updateRun(g,.02);assert.equal(g.ultimate,null);assert.equal(g.p.pose,'');
});
test('legacy saves preserve money, EVA selections and goddess selection while adding Kurumi mastery',()=>{
 const p=sanitizeProfile({version:1,coins:87,skins:{shinji:'mari',madoka:'goddess'},characters:{madoka:{xp:45,totalXp:90,skills:{soul:1}}}});assert.equal(p.characters.kurumi.xp,0);assert.equal(p.characters.madoka.xp,45);assert.equal(p.skins.madoka,'goddess');const g=createRun(kurumi,0,p);g.characterXp=12;creditRun(p,g);const storage={data:'',getItem(){return this.data},setItem(k,v){this.data=v}};saveProfile(p,storage);const saved=loadProfile(storage);assert.equal(saved.characters.kurumi.xp,12);assert.equal(saved.coins,87);assert.equal(saved.skins.shinji,'mari');
});
test('redrawn pilots, Esdeath, Kurumi and Ultimate Madoka retain expressive animation and distinct silhouettes',()=>{
 const ids=['esdeath','kurumi','madoka'];for(const id of ids){const skin=id==='madoka'?'goddess':'default';const base=characterPixels(id,{skin});assert.ok(base.filter(Boolean).length>700);assert.notDeepEqual(base,characterPixels(id,{skin,moving:true,frame:1}));assert.notDeepEqual(base,characterPixels(id,{skin,blink:true}));}
 for(const skin of ['default','asuka','rei','mari'])assert.notDeepEqual(pilotPixels({skin}),pilotPixels({skin,blink:true}));
 const a=characterPixels('madoka'),b=characterPixels('madoka',{skin:'goddess'});assert.ok(b.filter(Boolean).length>a.filter(Boolean).length);assert.ok(b.some((c,i)=>c&&a[i]===null),'wings and long hair extend the silhouette');
});
