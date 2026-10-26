import test from 'node:test';
import assert from 'node:assert/strict';
import {CHARACTERS} from '../src/game.js';
import {createRun,createBossRushRun,spawnEnemy,resolveRift,updateRun} from '../src/engine.js';
import {BOSSES,MAP_BOSSES,REGULAR_BOSS_IDS,updateEnemyAI} from '../src/enemies.js';
import {DEATH_BOSSES,deathRiftAttack} from '../src/death-rift.js';
import {RIFT_ENCOUNTERS,updateRifts} from '../src/rift-encounters.js';
import {RIFT_ARENAS} from '../src/rift-arena.js';
import {finishBossIntro} from '../src/boss-intro.js';
import {PLAYER_RADIUS,segmentDistance} from '../src/world.js';
import {applyStatus} from '../src/status.js';
import {saveRun,loadRun} from '../src/run-save.js';
import {encounterPressure} from '../src/difficulty.js';
const memory=()=>({data:new Map(),getItem(k){return this.data.get(k)||null},setItem(k,v){this.data.set(k,v)},removeItem(k){this.data.delete(k)}});
function run(){const g=createRun(CHARACTERS[0]);g.spawn=g.invuln=g.p.nextXp=g.events.nextAt=g.rifts.nextAt=1e9;g.p.weapons={};g.p.regen=0;g.chestRandom=()=>.99;g.lastMove={x:1,y:0};return g;}
function encounter(skill=1,enraged=false){const g=run(),e=spawnEnemy(g,true,false,'deathdevil');Object.assign(e,{x:-250,y:-50,enraged,speed:0,attackCD:0,skill:skill-1});updateEnemyAI(g,e,.01);return{g,e};}
const covers=(h,x,y)=>h.shape==='line'?segmentDistance(x,y,h.x,h.y,h.tx,h.ty)<h.width+PLAYER_RADIUS:Math.hypot(h.x-x,h.y-y)<h.r+PLAYER_RADIUS;
const geometry=h=>[h.shape,h.x,h.y,h.tx,h.ty,h.r,h.width,h.delay,h.duration];
function sim(g,seconds){for(let t=0;t<seconds-1e-8;t+=.02)updateRun(g,Math.min(.02,seconds-t));}
function enter(){const g=run();g.p.x=1200;g.p.y=900;const regular=spawnEnemy(g,false,false,'soldier');Object.assign(regular,{x:1500,y:1000,attackCD:1e9});g.rifts.opened=9;g.rifts.portal={bossId:'deathdevil',x:g.p.x,y:g.p.y,age:0,serial:9};g.status='rift';assert.ok(resolveRift(g,true));finishBossIntro(g);return{g,e:g.enemies.find(e=>e.riftBoss),regular};}

test('Death Devil appends a ninth optional encounter without entering ordinary waves or the boss gauntlet',()=>{
 assert.equal(RIFT_ENCOUNTERS.length,11);assert.deepEqual(RIFT_ENCOUNTERS.slice(0,8).map(e=>e.id),['foundereren','beerus','walpurgisrift','aizenrift','madararift','sukunaheian','borosrift','darknessdevil']);assert.equal(RIFT_ENCOUNTERS[8].id,'deathdevil');assert.strictEqual(BOSSES.deathdevil,DEATH_BOSSES.deathdevil);assert.equal(BOSSES.deathdevil.hp,30000);assert.equal(BOSSES.deathdevil.riftOnly,true);assert.equal(BOSSES.deathdevil.family,'chainsawman');assert.ok(!REGULAR_BOSS_IDS.includes('deathdevil'));assert.ok(Object.values(MAP_BOSSES).every(pool=>!pool.includes('deathdevil')));assert.ok(!createBossRushRun(CHARACTERS[0]).rush.order.includes('deathdevil'));assert.equal(RIFT_ARENAS.deathdevil.id,'lastsilence');
 const {g,e}=enter();assert.equal(g.riftArena.id,'lastsilence');assert.equal(g.enemies.length,1);assert.equal(e.archetype,'deathdevil');assert.equal(e.hp,DEATH_BOSSES.deathdevil.hp*encounterPressure(g).hp*(1+(g.wave/5-1)*.65));assert.equal(e.hp,e.maxHp);assert.equal(deathRiftAttack(g,{archetype:'other'},g.p,0,{}),false);
});

test('all three Death casts use finite fixed source-owned warnings with distinct phases and bounded density',()=>{
 for(const fierce of [false,true])for(const skill of [1,2,3]){const {g,e}=encounter(skill,fierce),u=e.riftAttack;assert.equal(u.style,['memento','palecrown','lasthorizon'][skill-1]);assert.ok(u.name&&u.origin);assert.equal(u.marks.length,g.hazards.length);assert.ok(g.hazards.length<20);assert.equal(g.enemies.length,1,'Death never creates reinforcements');for(const h of g.hazards){assert.equal(h.sourceId,e.id);assert.equal(h.source,'deathdevil');assert.ok(h.sourceClock&&h.cancelWithSource&&h.bossUltimate);assert.ok(h.delay>=1.6);assert.ok(h.delay+h.duration<e.attackCD);for(const key of ['x','y','tx','ty','r','width','delay','duration','damage'])if(h[key]!==undefined)assert.ok(Number.isFinite(h[key]),key);}
 const before=u.marks.map(geometry);g.p.x=530;g.p.y=250;e.x+=100;e.attackCD=999;updateEnemyAI(g,e,.1);assert.deepEqual(u.marks.map(geometry),before,'moving cannot retarget a cast that has already warned');}
});

test('Memento Mori keeps its escape direction open and separates the final toll from the spiral seals',()=>{
 for(const fierce of [false,true]){const {g,e}=encounter(1,fierce),marks=e.riftAttack.marks,seals=marks.slice(0,-1),final=marks.at(-1);assert.equal(seals.length,fierce?7:5);assert.ok(seals.every(h=>h.shape==='circle'));assert.ok(marks.every(h=>!covers(h,350,0)),'the open side remains a real escape route');assert.ok(final.delay>Math.max(...seals.map(h=>h.delay+h.duration)));assert.ok(covers(final,0,0));assert.ok(seals.every((h,i)=>i===0||h.delay>seals[i-1].delay));}
});

test('Pale Crown stops inward blades before the center and leaves a broad corridor until the separate core blast',()=>{
 for(const fierce of [false,true]){const {g,e}=encounter(2,fierce),u=e.riftAttack,blades=u.marks.filter(h=>h.shape==='line'),core=u.marks.at(-1);assert.equal(blades.length,fierce?9:7);assert.equal(u.innerRadius,120);assert.equal(u.outerRadius,500);assert.ok(blades.every(h=>!covers(h,0,0)),'the central pocket is initially safe');assert.ok(u.marks.every(h=>!covers(h,350,0)),'a wide outward route stays available');assert.ok(core.delay>Math.max(...blades.map(h=>h.delay+h.duration)));assert.ok(covers(core,0,0));}
});

test('Last Horizon warns two side mouths before its central mouth, with a separately delayed phase-two crossing',()=>{
 for(const fierce of [false,true]){const {g,e}=encounter(3,fierce),marks=e.riftAttack.marks,a=e.riftAttack.angle,safe={x:Math.cos(a)*80-Math.sin(a)*80,y:Math.sin(a)*80+Math.cos(a)*80};assert.equal(marks.length,fierce?4:3);assert.ok(marks.every(h=>h.shape==='line'));assert.ok(!covers(marks[0],0,0)&&!covers(marks[1],0,0));assert.ok(covers(marks[2],0,0));assert.ok(marks[2].delay>Math.max(marks[0].delay+marks[0].duration,marks[1].delay+marks[1].duration));assert.ok(marks.every(h=>!covers(h,safe.x,safe.y)),'a diagonal safe space survives the whole pattern');if(fierce){assert.ok(marks[3].delay>marks[2].delay+marks[2].duration);const central=marks[2],cross=marks[3],dot=(central.tx-central.x)*(cross.tx-cross.x)+(central.ty-central.y)*(cross.ty-cross.y);assert.ok(Math.abs(dot)<1e-7,'the final cut is perpendicular to the saved central lane');}}
});

test('real phase-two AI adds seals and blades without shortening the original warning times',()=>{
 const {g,e}=encounter(1);e.hp=e.maxHp*.4;e.attackCD=0;e.windup=0;e.skill=0;e.riftAttack=null;g.hazards=[];updateEnemyAI(g,e,.01);assert.equal(e.enraged,true);assert.equal(e.riftAttack.style,'memento');assert.equal(g.hazards.length,8);assert.equal(g.hazards[0].delay,1.6);assert.ok(g.hazards[0].r>50);
});

test('Death cast, windup and hazard clocks pause for menus, immobilization and time stop, and slow with Kurumi',()=>{
 for(const stop of ['paused','status','freeze','esdeath']){const {g,e}=encounter(2);e.attackCD=999;const cast=structuredClone(e.riftAttack),hazards=structuredClone(g.hazards),windup=e.windup;if(stop==='paused')g.status='paused';if(stop==='status')applyStatus(e,'stun',1);if(stop==='freeze'){g.freeze=1;g.voidRadius=1000;}if(stop==='esdeath')g.ultimate={type:'esdeath',x:0,y:0,r:1000,age:0,duration:10};sim(g,.1);assert.deepEqual(e.riftAttack,cast,stop+' cast clock');assert.deepEqual(g.hazards,hazards,stop+' warning clock');assert.equal(e.windup,windup,stop+' windup');}
 const {g,e}=encounter(2);e.attackCD=999;g.ultimate={type:'kurumi',x:0,y:0,r:1000,age:0,duration:10,shadows:[],slowCD:999};const age=e.riftAttack.age,warning=g.hazards[0].age,windup=e.windup;sim(g,.1);assert.ok(Math.abs(e.riftAttack.age-age-.07)<1e-8);assert.ok(Math.abs(g.hazards[0].age-warning-.07)<1e-8);assert.ok(Math.abs(windup-e.windup-.07)<1e-8);
});

test('Last Horizon deals actual damage only after the marked central release while its early middle remains safe',()=>{
 const {g,e}=encounter(3);g.invuln=0;g.p.hp=g.p.maxHp=300;g.p.shield=0;g.p.dodge=0;e.attackCD=999;sim(g,2.9);assert.equal(g.p.hp,300);sim(g,.3);assert.ok(g.p.hp<300);assert.ok(g.p.hp>0);
});

test('a Death rift checkpoint retains its fixed attack and returns its suspended map with a single reward payment',()=>{
 const {g,e,regular}=enter();e.speed=0;e.attackCD=0;updateEnemyAI(g,e,.01);sim(g,.2);assert.ok(e.riftAttack);const cast=structuredClone(e.riftAttack),hazards=structuredClone(g.hazards),storage=memory();assert.ok(saveRun(g,storage));const loaded=loadRun(storage);assert.ok(loaded);assert.equal(loaded.riftArena.id,'lastsilence');const boss=loaded.enemies.find(e=>e.riftBoss);assert.deepEqual(boss.riftAttack,cast);assert.deepEqual(loaded.hazards,hazards);const time=loaded.time;updateRun(loaded,2);assert.equal(loaded.time,time);assert.deepEqual(boss.riftAttack,cast);loaded.status='playing';delete loaded.resumeStatus;loaded.chestRandom=()=>.99;boss.hp=0;boss.enraged=true;sim(loaded,1.8);assert.equal(loaded.riftArena,null);assert.equal(loaded.rifts.active,null);assert.equal(loaded.rifts.cleared,1);assert.equal(loaded.money,900);assert.equal(loaded.bossKills,1);assert.equal(loaded.kills,1);assert.deepEqual([loaded.p.x,loaded.p.y],[1200,900]);assert.ok(loaded.enemies.some(e=>e.id===regular.id));assert.ok(!loaded.hazards.some(h=>h.sourceId===boss.id));assert.ok(loaded.chests.some(c=>c.rewardCount===5)||loaded.rewards.length===5);sim(loaded,.3);assert.equal(loaded.money,900);assert.equal(loaded.rifts.cleared,1);
});

test('existing eight-rift progress is retained and discovers Death as the new next calamity',()=>{
 const g=run();g.time=1000;g.rifts.opened=8;g.rifts.cleared=3;g.rifts.nextAt=900;g.rifts.history=[{serial:1,bossId:'foundereren',defeatedAt:200}];const storage=memory();assert.ok(saveRun(g,storage));const loaded=loadRun(storage);assert.ok(loaded);assert.equal(loaded.rifts.opened,8);assert.equal(loaded.rifts.cleared,3);assert.deepEqual(loaded.rifts.history,g.rifts.history);loaded.status='playing';delete loaded.resumeStatus;assert.equal(updateRifts(loaded,.01,{},()=>0),true);assert.equal(loaded.rifts.portal.bossId,'deathdevil');assert.equal(loaded.rifts.opened,9);
});
