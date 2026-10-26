import test from 'node:test';
import assert from 'node:assert/strict';
import {CHARACTERS,ITEMS,FUSIONS,applyChoice,MAPS} from '../src/game.js';
import {newProfile,sanitizeProfile,creditRun,buyNode} from '../src/progression.js';
import {createRun,spawnEnemy,castWeapon,updateRun,useSpecial,hitPlayer,damageEnemy} from '../src/engine.js';
import {ENEMIES,BOSSES,MAP_BOSSES,bossForWave,updateEnemyAI} from '../src/enemies.js';
import {ANIME_ENEMIES,ANIME_BOSSES,ANIME_NAMES} from '../src/anime-enemies.js';
import {hasStatus} from '../src/status.js';
import {faceState} from '../src/expressions.js';
import {characterPixels,pilotPixels} from '../src/pixel-characters.js';
const normalBossIds=Object.keys(BOSSES).filter(id=>!BOSSES[id].riftOnly&&!BOSSES[id].eventOnly);
const shinji=CHARACTERS.find(c=>c.id==='shinji');
function quiet(hero=shinji){const g=createRun(hero,3);g.spawn=9999;g.eliteAt=9999;g.p.nextXp=1e9;g.p.regen=0;g.p.cooldowns={pallet:999};return g;}
function target(g,x=150,y=0,id='soldier',boss=false){const e=spawnEnemy(g,boss,false,id);Object.assign(e,{x,y,hp:10000,maxHp:10000,speed:0,attackCD:999});return e;}
function sim(g,seconds,input={x:0,y:0}){for(let i=0;i<Math.round(seconds/.02);i++)updateRun(g,.02,input);}
test('Shinji starts in EVA-01 with a unique rifle, AT shield, fusion and mastery wallet',()=>{
 const g=quiet();assert.equal(g.p.weapon,'pallet');assert.equal(g.p.weapons.pallet,1);assert.equal(g.p.passives.atfield,1);assert.equal(g.p.shield,11);assert.equal(g.p.shieldRecharge,9);assert.ok(ITEMS.pallet&&ITEMS.atfield);assert.ok(FUSIONS.some(f=>f.weapon==='pallet'));const p=newProfile();g.characterXp=25;creditRun(p,g);assert.equal(p.characters.shinji.xp,25);assert.equal(p.characters.goku.xp,0);
});
test('old saves retain all currency and purchases while gaining an empty Shinji tree',()=>{
 const p=sanitizeProfile({version:1,coins:63,general:{power:2},characters:{goku:{xp:90,totalXp:100,skills:{ki:2}}}});assert.equal(p.coins,63);assert.equal(p.general.power,2);assert.equal(p.characters.goku.skills.ki,2);assert.equal(p.characters.goku.xp,90);assert.equal(p.characters.shinji.xp,0);
});
test('rifle rounds leave in a staggered burst and damage the target',()=>{
 const g=quiet(),e=target(g);castWeapon(g,'pallet',e);assert.equal(g.shots.length,3);const x=g.shots[1].x;updateRun(g,.02);assert.ok(g.shots[0].x>x);assert.equal(g.shots[1].x,x);sim(g,.5);assert.ok(e.hp<10000);assert.ok(g.shots.every(s=>Number.isFinite(s.x)&&Number.isFinite(s.y)));
});
test('Spear of Longinus pierces a line of enemies and stuns without hitting distant off-axis targets',()=>{
 const g=quiet(),a=target(g,150),b=target(g,260),c=target(g,180,150);g.p.weapons.pallet=5;g.p.passives.atfield=3;assert.ok(applyChoice(g.p,{kind:'fusion',id:'positron'}));castWeapon(g,'pallet',a);assert.equal(a.hp,10000);sim(g,.3);assert.ok(hasStatus(a,'stun'));sim(g,.2);assert.ok(a.hp<10000&&b.hp<10000);assert.equal(c.hp,10000);assert.ok(g.shots.some(s=>s.type==='longinus'));
});
test('AT Field reduces incoming damage, absorbs it and recharges after nine seconds',()=>{
 const g=quiet();g.p.dodge=0;const hp=g.p.hp;hitPlayer(g,20);assert.ok(Math.abs(g.p.hp-(hp-8.2))<1e-8);assert.equal(g.p.shield,0);sim(g,8.9);assert.equal(g.p.shield,0);sim(g,.2);assert.equal(g.p.shield,11);
});
test('Berserk strikes, deflects nearby projectiles, speeds up movement, and ends cleanly',()=>{
 const g=quiet(),e=target(g,110);g.p.weapons={};g.enemyShots=[{x:60,y:0,vx:0,vy:0,life:5,age:0,r:4,damage:10}];assert.ok(useSpecial(g));updateRun(g,.02);assert.equal(g.enemyShots.length,0);assert.ok(e.hp<10000);assert.equal(g.p.pose,'berserk');const x=g.p.x;sim(g,.1,{x:-1,y:0});assert.ok(g.p.x-x< -g.p.move*.1);g.status='paused';const age=g.ultimate.age;updateRun(g,1);assert.equal(g.ultimate.age,age);g.status='playing';sim(g,6.1);assert.equal(g.ultimate,null);assert.equal(g.p.pose,'');assert.ok(g.special>0);
});
test('Shinji mastery changes burst count, shield, starting rank, duration and actual ultimate damage',()=>{
 const p=newProfile();p.characters.shinji.xp=1000;assert.ok(buyNode(p,'character','sync','shinji'));assert.ok(buyNode(p,'character','burst','shinji'));p.characters.shinji.skills={sync:1,field:1,burst:2,resolve:1,pilot:1,beast:1};const g=createRun(shinji,3,p);assert.equal(g.p.weapons.pallet,2);assert.equal(g.p.maxShield,19);const e=target(g,100);castWeapon(g,'pallet',e);assert.equal(g.shots.length,5);g.p.weapons={};g.shots=[];useSpecial(g);assert.equal(g.ultimate.duration,6.6);updateRun(g,.02);assert.ok(e.hp<10000-52);
});
test('expressions respond to attacks, damage, recovery and reduced motion while blindfold stays opaque',()=>{
 const g=quiet(CHARACTERS[0]);assert.equal(faceState(g.p,0).expression,'neutral');castWeapon(g,'ki',target(g));assert.equal(faceState(g.p,0).expression,'focused');g.p.dodge=0;hitPlayer(g,10);assert.equal(faceState(g.p,0).expression,'hurt');g.p.weapons={};sim(g,.5);assert.equal(faceState(g.p,0).expression,'neutral');assert.equal(faceState({...g.p,reducedMotion:true},4.6).blink,false);assert.ok(faceState(g.p,4.6).blink);const a=characterPixels('gojo'),b=characterPixels('gojo',{expression:'hurt'});for(let y=25;y<32;y++)for(let x=18;x<38;x++)assert.equal(a[y*56+x],b[y*56+x]);assert.notDeepEqual(a,b);assert.notDeepEqual(pilotPixels(),characterPixels('shinji'));
});
test('dodging does not trigger the hurt expression and ki cannot burn off-axis enemies',()=>{
 const g=quiet(CHARACTERS[0]);g.p.dodge=1;assert.equal(hitPlayer(g,10),false);assert.equal(faceState(g.p,0).expression,'neutral');const a=target(g,100),b=target(g,100,200);g.p.cooldowns.ki=999;castWeapon(g,'ki',a);sim(g,.5);assert.ok(hasStatus(a,'burning'));assert.equal(hasStatus(b,'burning'),false);
});
test('all anime worlds and the new curse types have reachable spawn definitions',()=>{
 assert.equal(Object.keys(ANIME_NAMES).length,20);assert.equal(ANIME_NAMES.chainsawman,'Chainsaw Man');for(const id of ['jogo','hanami','dagon','flyhead','transfigured'])assert.equal(ENEMIES[id].family,'jjk');assert.equal(Object.keys(ENEMIES).length,80);assert.equal(normalBossIds.length,36);assert.equal(Object.values(BOSSES).filter(boss=>boss.riftOnly).length,11);for(const id of Object.keys(ANIME_ENEMIES)){let found=false;for(const i of MAPS.map((_,i)=>i)){const g=createRun(shinji,i);g.wave=4;for(let k=0;k<180;k++)if(spawnEnemy(g).archetype===id)found=true;}assert.ok(found,id+' should be reachable');}
});
test('early waves omit advanced curses and all maps rotate through all regular bosses',()=>{
 const g=createRun(shinji,2);for(let i=0;i<80;i++)assert.ok(!['jogo','hanami','dagon'].includes(spawnEnemy(g).archetype));for(const map of MAPS){assert.equal(new Set(MAP_BOSSES[map.id]).size,normalBossIds.length);assert.deepEqual(new Set(Array.from({length:normalBossIds.length},(_,i)=>bossForWave(map.id,(i+1)*5))),new Set(normalBossIds));}assert.equal(bossForWave('garden',5),'aura');assert.equal(bossForWave('moon',5),'mahito');
});
test('Aura warns before soul balance, summons bound soldiers, and dispels them on defeat',()=>{
 const g=quiet();g.p.weapons={};const e=target(g,240,0,'aura',true);e.attackCD=0;updateEnemyAI(g,e,.01);const h=g.hazards.find(h=>h.label==='SOUL BALANCE');assert.ok(h&&h.delay>=1.5);g.p.dodge=0;g.p.shield=0;const hp=g.p.hp;updateRun(g,.02);assert.equal(g.p.hp,hp);e.attackCD=0;updateEnemyAI(g,e,.01);const children=g.enemies.filter(s=>s.ownerId===e.id);assert.equal(children.length,3);assert.ok(g.hazards.some(h=>h.label==='GUILLOTINE'));for(const s of children){s.x=500;s.y=400;}e.hp=0;e.x=500;updateRun(g,.02);assert.equal(g.enemies.filter(s=>s.ownerId===e.id).length,0);sim(g,1.6);assert.ok(g.chests.some(c=>c.source==='Aura the Guillotine'));
});
test('Jogo, Hanami and Dagon use burning vents, temporary bark armor, and slowing fish',()=>{
 const g=quiet();g.p.weapons={};const jogo=target(g,220,0,'jogo');jogo.attackCD=0;updateEnemyAI(g,jogo,.01);assert.ok(g.hazards.some(h=>h.label==='VOLCANIC VENT'&&h.status==='burning'));assert.ok(g.enemyShots.some(s=>s.kind==='ember'));const hanami=target(g,240,100,'hanami');hanami.attackCD=0;updateEnemyAI(g,hanami,.01);assert.ok(hanami.armorTime>0);const hp=hanami.hp;damageEnemy(g,hanami,100);assert.equal(hanami.hp,hp-60);hanami.attackCD=999;updateEnemyAI(g,hanami,2);assert.equal(hanami.armorTime,0);damageEnemy(g,hanami,100);assert.equal(hanami.hp,hp-160);const dagon=target(g,240,-100,'dagon');dagon.attackCD=0;updateEnemyAI(g,dagon,.01);assert.ok(g.enemyShots.some(s=>s.kind==='fish'));assert.equal(dagon.waterWalker,true);
});
test('new bosses have distinct multi-phase attacks and turn dangerous only after telegraphs',()=>{
 for(const [id,label] of [['mahito','SELF-EMBODIMENT'],['akaza','COMPASS NEEDLE'],['sachiel','LIGHT LANCE']]){const g=quiet(),e=target(g,220,0,id,true);g.p.weapons={};for(let i=0;i<3;i++){e.attackCD=0;updateEnemyAI(g,e,.01);}assert.ok(g.hazards.some(h=>h.label===label),id);assert.ok(g.hazards.every(h=>h.delay>=.5));e.hp=e.maxHp*.4;updateEnemyAI(g,e,.01);assert.ok(e.enraged);}
});
