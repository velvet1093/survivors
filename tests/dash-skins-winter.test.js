import test from 'node:test';
import assert from 'node:assert/strict';
import {CHARACTERS,MAPS,applyChoice} from '../src/game.js';
import {createRun,updateRun,useDash,useSpecial,hitPlayer,spawnEnemy,castWeapon} from '../src/engine.js';
import {applyStatus,hasStatus,updateStatuses} from '../src/status.js';
import {SKINS,skinFor} from '../src/skins.js';
import {newProfile,sanitizeProfile,creditRun,saveProfile,loadProfile} from '../src/progression.js';
import {characterPixels,pilotPixels} from '../src/pixel-characters.js';
import {ENEMIES,BOSSES,MAP_ENEMIES,featuredBosses,updateEnemyAI} from '../src/enemies.js';
import {WAR_ENEMIES,WAR_BOSSES} from '../src/war-enemies.js';
import {bestiary} from '../src/bestiary.js';
const esdeath=CHARACTERS.find(c=>c.id==='esdeath'),shinji=CHARACTERS.find(c=>c.id==='shinji');
const quiet=(c=CHARACTERS[0],map=3,p=null)=>{const g=createRun(c,map,p);g.spawn=1e6;g.eliteAt=1e6;g.p.nextXp=1e6;g.p.weapons={};g.p.regen=0;return g;};
const sim=(g,t,input={x:0,y:0})=>{for(let i=0;i<Math.round(t/.02);i++)updateRun(g,.02,input);};
function target(g,x=130,y=0,id='soldier',boss=false){const e=spawnEnemy(g,boss,false,id);Object.assign(e,{x,y,hp:10000,maxHp:10000,speed:0,attackCD:999});return e;}
test('dash grants invincibility, uses a normalized direction and starts a ten-second cooldown',()=>{
 const g=quiet();g.p.dodge=0;const hp=g.p.hp;assert.ok(useDash(g,{x:1,y:-1}));assert.equal(g.dashCD,10);assert.equal(hitPlayer(g,1000),false);applyStatus(g.p,'poison',2,{power:20});updateRun(g,.1);assert.equal(g.p.hp,hp);assert.ok(g.p.x>0&&g.p.y<0);assert.ok(Math.abs(Math.hypot(g.p.x,g.p.y)-95)<.01);assert.equal(useDash(g,{x:1,y:0}),false);sim(g,.14);assert.equal(g.dash,null);g.invuln=0;assert.ok(hitPlayer(g,1));
});
test('dash respects collision, freezes while paused and becomes ready after ten active seconds',()=>{
 const g=quiet();g.world.active=[{id:'wall',kind:'prop',type:'rock',x:40,y:0,r:20,hp:Infinity}];g.world.circles=[{x:40,y:0,r:20,object:g.world.active[0]}];useDash(g,{x:1,y:0});g.status='paused';updateRun(g,1);assert.equal(g.dash.age,0);assert.equal(g.dashCD,10);g.status='playing';updateRun(g,.02);assert.ok(g.p.x<=19.01);sim(g,9.96);assert.ok(g.dashCD>0);sim(g,.04);assert.equal(g.dashCD,0);assert.ok(useDash(g));
});
test('stun and freeze prevent starting a dash but the player can move and use an ultimate during one',()=>{
 const g=quiet();applyStatus(g.p,'stun',1);assert.equal(useDash(g),false);updateStatuses(g.p,2);updateStatuses(g.p,1);assert.ok(useDash(g,{x:0,y:1}));assert.ok(useSpecial(g));const y=g.p.y;updateRun(g,.02,{x:1,y:0});assert.ok(g.p.y>y);
});
test('cosmetic choices persist, invalid choices fall back, and skins never change character stats',()=>{
 const p=newProfile();p.coins=80;p.skins.shinji='asuka';const storage={v:'',setItem(k,v){this.v=v;},getItem(){return this.v;}};assert.ok(saveProfile(p,storage));const loaded=loadProfile(storage);assert.equal(loaded.skins.shinji,'asuka');const a=createRun(shinji,0,loaded),b=createRun(shinji);for(const k of ['maxHp','damage','move','maxShield','cooldown'])assert.equal(a.p[k],b.p[k]);assert.equal(a.p.displayName,'Asuka');assert.equal(a.p.unitName,'EVA-02');a.characterXp=10;creditRun(loaded,a);assert.equal(loaded.characters.shinji.xp,10);assert.equal(skinFor('shinji','unknown').id,'default');assert.equal(sanitizeProfile({skins:{shinji:'bad'}}).skins.shinji,'default');
});
test('all character skins and the four EVA/pilot designs render as distinct pixel frames',()=>{
 for(const c of CHARACTERS){const all=SKINS[c.id];assert.ok(all.length>=2);assert.equal(new Set(all.map(s=>JSON.stringify(characterPixels(c.id,{skin:s.id})))).size,all.length);}
 const eva=SKINS.shinji.filter(s=>['default','asuka','rei','mari'].includes(s.id));assert.equal(eva.length,4);assert.equal(new Set(eva.map(s=>JSON.stringify(pilotPixels({skin:s.id})))).size,4);
});
test('old saves receive skin and Esdeath wallets without losing earned progress',()=>{
 const p=sanitizeProfile({version:1,coins:90,general:{power:2},characters:{shinji:{xp:43,totalXp:60,skills:{sync:1}}}});assert.equal(p.coins,90);assert.equal(p.characters.shinji.xp,43);assert.equal(p.characters.shinji.skills.sync,1);assert.equal(p.characters.esdeath.xp,0);assert.deepEqual(p.skins,{});
});
test('Esdeath carries her unique ice items and lances freeze enemies in actual combat',()=>{
 const g=createRun(esdeath,3);g.spawn=999;g.eliteAt=999;g.p.cooldowns.icelance=999;const e=target(g);castWeapon(g,'icelance',e);assert.ok(g.shots.length>=2);sim(g,.4);assert.ok(e.hp<10000);assert.ok(hasStatus(e,'frozen')||e.statusImmunity?.control>0);assert.equal(g.p.freezeResistance,.25);
});
test('ice fusion and mastery alter volley count, Mahapadma radius and duration',()=>{
 const p=newProfile();p.characters.esdeath.skills={barrage:2,dominion:1,eternal:1};const g=createRun(esdeath,3,p);g.p.weapons.icelance=5;g.p.passives.demonextract=3;assert.ok(applyChoice(g.p,{kind:'fusion',id:'icecrown'}));castWeapon(g,'icelance',{x:150,y:0});assert.equal(g.shots.length,9);assert.ok(useSpecial(g));assert.equal(g.ultimate.duration,5);assert.ok(Math.abs(g.ultimate.r-480*1.12)<.001);
});
test('Mahapadma freezes enemy AI, hostile bullet lifetime and hazard clocks but not player movement',()=>{
 const g=quiet(esdeath),e=target(g,150);e.speed=80;e.attackCD=0;g.enemyShots=[{x:70,y:20,vx:100,vy:0,life:2,age:0,r:5,damage:10,kind:'ki'}];g.hazards=[{shape:'circle',x:0,y:0,r:50,age:0,delay:.1,duration:1,damage:10,label:'ICE MINE'}];useSpecial(g);const x=e.x;sim(g,.3,{x:-1,y:0});assert.equal(e.x,x);assert.equal(g.enemyShots[0].x,70);assert.equal(g.enemyShots[0].life,2);assert.equal(g.hazards[0].age,0);assert.ok(g.p.x<0);g.hazards=[];sim(g,4.4);assert.equal(g.ultimate,null);assert.ok(e.hp<10000);
});
test('frozen shares crowd-control recovery with stun and bosses recover faster',()=>{
 const boss={hp:100,boss:true};applyStatus(boss,'frozen',1);assert.equal(boss.statuses.frozen.remaining,.35);assert.equal(applyStatus(boss,'stun',1),false);updateStatuses(boss,.4);assert.equal(applyStatus(boss,'frozen',1),false);updateStatuses(boss,2.1);assert.ok(applyStatus(boss,'stun',1));const g=createRun(esdeath);applyStatus(g.p,'frozen',1);assert.equal(g.p.statuses.frozen.remaining,.75);
});
test('new maps have complete spawn families, enemy mechanics and their own opening bosses',()=>{
 assert.equal(MAPS.length,17);assert.ok(featuredBosses('marineford').includes('akainu'));assert.ok(featuredBosses('citadel').includes('budo'));for(const map of ['marineford','citadel'])assert.ok(MAP_ENEMIES[map].every(id=>ENEMIES[id]));for(const [id,def] of Object.entries(WAR_ENEMIES)){const g=quiet(),e=target(g,200,0,id);e.attackCD=0;updateEnemyAI(g,e,.02);assert.ok(g.hazards.length||g.enemyShots.length,id);assert.ok(def.description);}
});
test('admirals and imperial bosses have distinct telegraphs and enrage phases',()=>{
 for(const id of Object.keys(WAR_BOSSES)){const g=quiet(),e=target(g,240,0,id,true);for(let i=0;i<3;i++){e.attackCD=0;updateEnemyAI(g,e,.02);}assert.ok(g.hazards.length>0,id);assert.ok(g.hazards.every(h=>h.delay>=.5));e.hp=e.maxHp*.4;updateEnemyAI(g,e,.02);assert.ok(e.enraged);}
});
test('bestiary searches anime and mechanics and filters bosses separately',()=>{
 assert.ok(bestiary({query:'Akainu'}).includes('MAGMA')||bestiary({query:'Akainu'}).includes('Akainu'));const entries=s=>(s.match(/class="bestiary-entry"/g)||[]).length;assert.equal(entries(bestiary({kind:'boss'})),Object.keys(BOSSES).length);assert.equal(entries(bestiary({query:'One Piece',kind:'boss'})),8);assert.equal(entries(bestiary({query:'nonexistent-creature'})),0);
});
