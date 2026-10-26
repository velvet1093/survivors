import {newWaveState} from '../src/waves.js';
import test from 'node:test';import assert from 'node:assert/strict';
import {CHARACTERS,MAPS,MAX_SLOTS,createPlayer,applyChoice,getUpgradePool,openChest,refreshStats} from '../src/game.js';
import {createRun,updateRun,spawnEnemy,damageEnemy,hitPlayer,castWeapon,useSpecial} from '../src/engine.js';
import {HERO_MECHANICS,heroKill,heroToxin,heroFreeze,heroDamageBonus,SAIYAN_STAGES} from '../src/hero-mechanics.js';
import {finishBossIntro} from '../src/boss-intro.js';
import {MAP_SUPPLIES,SUPPLY_DEFS} from '../src/map-supplies.js';
import {ensureWorld,layoutProps,damageProp,moveBody,onWater,colliders} from '../src/world.js';
import {MAP_ENEMIES,MAP_BOSSES,BOSSES,bossForWave} from '../src/enemies.js';
import {characterPixels} from '../src/pixel-characters.js';
import {newProfile,saveProfile,loadProfile} from '../src/progression.js';
import {makeGem} from '../src/xp.js';import {projectileScale} from '../src/projectiles.js';
const normalBossIds=Object.keys(BOSSES).filter(id=>!BOSSES[id].riftOnly&&!BOSSES[id].eventOnly);
const hero=id=>CHARACTERS.find(c=>c.id===id);
function quiet(id='goku',map=0){const g=createRun(hero(id),map);g.events.nextAt=1e9;g.spawn=g.eliteAt=g.nextBossWave=1e6;g.p.nextXp=1e6;g.p.cooldowns[g.p.weapon]=999;g.p.regen=0;return g;}
function tick(g,seconds){for(let i=0;i<Math.round(seconds/.02);i++)updateRun(g,.02);}
function enemy(g,x=180,y=0){const e=spawnEnemy(g,false,false,'soldier');Object.assign(e,{x,y,hp:10000,maxHp:10000,speed:0,attackCD:999});return e;}

test('five weapons and five passives are independent; a sixth cannot enter through upgrades or chests',()=>{
 assert.equal(MAX_SLOTS,5);const p=createPlayer(hero('goku'));for(const id of ['blue','rosebow','clockshot','icelance','eyes','soulgem','timepiece','demonextract'])assert.ok(applyChoice(p,{kind:'item',id}));assert.equal(Object.keys(p.weapons).length,5);assert.equal(Object.keys(p.passives).length,5);assert.equal(applyChoice(p,{kind:'item',id:'shuriken'}),false);assert.equal(applyChoice(p,{kind:'item',id:'headband'}),false);assert.ok(!getUpgradePool(p).some(c=>c.id==='shuriken'||c.id==='headband'));for(let i=0;i<30;i++)openChest(p,()=>.99);assert.equal(Object.keys(p.weapons).length,5);assert.equal(Object.keys(p.passives).length,5);
});
test('all heroes have a distinct fresh mechanic and it never leaks between runs',()=>{
 assert.deepEqual(Object.keys(HERO_MECHANICS).sort(),CHARACTERS.map(c=>c.id).sort());for(const c of CHARACTERS){const a=quiet(c.id),b=quiet(c.id);a.mechanic.value=10;assert.equal(b.mechanic.value,0);assert.equal(a.mechanic.id,c.id);}
});
test('Goku advances through timed Saiyan stages, changes damage without compounding and stops at Blue',()=>{
 const g=quiet(),e=enemy(g);for(const [i,time]of [0,60,150,300,480,900].entries()){g.time=time;updateRun(g,.001);const stage=Math.min(i,4);assert.equal(g.mechanic.stage,stage);const before=e.hp;damageEnemy(g,e,100);assert.ok(Math.abs(before-e.hp-100*[1,1.12,1.24,1.36,1.5][stage])<1e-6);refreshStats(g.p);assert.ok(Math.abs(heroDamageBonus(g)-[1,1.12,1.24,1.36,1.5][stage])<1e-8);}assert.equal(g.mechanic.value,g.mechanic.max);assert.equal(SAIYAN_STAGES[4].name,'Super Saiyan Blue');
 const base=characterPixels('goku'),ss=characterPixels('goku',{form:1}),long=characterPixels('goku',{form:3}),blue=characterPixels('goku',{form:4});assert.notDeepEqual(base,ss);assert.notDeepEqual(ss,long);assert.notDeepEqual(long,blue);
});
test('EVA rage builds from actual kills and damage, boosts combat for eight seconds, and works for every pilot',()=>{
 for(const skin of ['default','asuka','rei','mari']){const profile=newProfile();profile.skins.shinji=skin;const g=createRun(hero('shinji'),0,profile);g.spawn=g.eliteAt=g.nextBossWave=1e6;g.p.weapons={};g.p.nextXp=1e6;hitPlayer(g,40);assert.equal(g.mechanic.value,40);for(let i=0;i<15;i++){const e=enemy(g,700+i,100);e.hp=0;}updateRun(g,.02);assert.equal(g.mechanic.value,100);updateRun(g,.02);assert.equal(g.mechanic.active,8);assert.equal(g.mechanic.value,0);const e=enemy(g),before=e.hp;damageEnemy(g,e,100);assert.ok(Math.abs(before-e.hp-140)<1e-6);g.status='paused';updateRun(g,5);assert.equal(g.mechanic.active,8);g.status='playing';tick(g,8.02);assert.equal(g.mechanic.active,0);assert.equal(heroDamageBonus(g),1);}
});
test('Infinity negates one direct hit, lets damage over time through, and recharges only during play',()=>{
 const g=quiet('gojo');g.p.dodge=0;tick(g,8.02);assert.equal(g.mechanic.value,8);const hp=g.p.hp;assert.equal(hitPlayer(g,20),false);assert.equal(g.p.hp,hp);assert.equal(g.mechanic.value,0);assert.ok(hitPlayer(g,2,{dot:true}));assert.equal(g.p.hp,hp-2);g.status='paused';updateRun(g,10);assert.equal(g.mechanic.value,0);g.status='playing';tick(g,8.02);assert.equal(g.mechanic.value,8);
});
test('Naruto gains chakra by movement and kills, then spends it on a larger, stronger signature volley',()=>{
 const g=quiet('naruto');updateRun(g,.1,{x:1,y:0});assert.ok(g.mechanic.value>.69);heroKill(g,{});assert.ok(g.mechanic.value>10);g.mechanic.value=100;castWeapon(g,'shuriken',{x:250,y:0});assert.equal(g.shots.length,3);assert.equal(g.mechanic.value,0);assert.equal(g.shots[0].damage,22*1.25);g.p.weapons.ki=1;g.mechanic.value=100;castWeapon(g,'ki',{x:250,y:0});assert.equal(g.mechanic.value,100);
});
test('Madoka earns hope from collected XP, then her bow repairs shield, heals and adds arrows',()=>{
 const g=quiet('madoka');g.gems=[makeGem(0,0,40,0)];updateRun(g,.02);assert.equal(g.mechanic.value,100);g.p.hp=40;g.p.shield=0;castWeapon(g,'rosebow',{x:250,y:0});assert.equal(g.shots.length,4);assert.equal(g.mechanic.value,0);assert.equal(g.p.hp,45);assert.equal(g.p.shield,8);
});
test('Maomao builds toxicology through poison-circle contact and spends it on a larger healing dose',()=>{
 const g=quiet('maomao'),e=enemy(g);g.fields=[{kind:'poison',x:e.x,y:e.y,r:60,life:30,max:30,age:0,tick:0,damage:1,poisonPower:1}];updateRun(g,.02);assert.equal(g.mechanic.value,4);for(let i=0;i<24;i++)heroToxin(g);assert.equal(g.mechanic.value,100);g.p.hp=50;castWeapon(g,'poison',e);assert.equal(g.p.hp,56);assert.equal(g.shots[0].cloudRadius,47*1.4);assert.equal(g.shots[0].damage,5*1.3);assert.equal(g.mechanic.value,0);
});
test('Esdeath gains dominion only from successful freezes and gets temporary armor and damage',()=>{
 const g=quiet('esdeath'),e=enemy(g,100);castWeapon(g,'icelance',e);tick(g,.4);assert.ok(g.mechanic.value>=5);while(g.mechanic.value<100)heroFreeze(g);updateRun(g,.02);assert.equal(g.mechanic.active,6);g.p.dodge=0;g.p.shield=0;g.invuln=0;const hp=g.p.hp;hitPlayer(g,20);assert.equal(g.p.hp,hp-15);const hpEnemy=e.hp;damageEnemy(g,e,100);assert.equal(e.hp,hpEnemy-125);tick(g,6.02);assert.equal(g.mechanic.active,0);
});
test('Kurumi banks stolen seconds on kills and spends them on her next ultimate, only once',()=>{
 const g=quiet('kurumi');for(let i=0;i<20;i++)heroKill(g,{});assert.equal(g.mechanic.value,10);assert.ok(useSpecial(g));assert.ok(Math.abs(g.special-(60*.94-10))<1e-8);assert.equal(g.ultimate.duration,8.5);assert.equal(g.mechanic.value,0);assert.equal(useSpecial(g),false);
});
test('mechanic timers, progression and charge stay frozen during every combat interruption',()=>{
 for(const id of CHARACTERS.map(c=>c.id))for(const status of ['paused','upgrade','chest']){const g=quiet(id);g.mechanic.value=3;g.mechanic.active=2;g.status=status;const before=JSON.stringify(g.mechanic);updateRun(g,20,{x:1,y:0});assert.equal(JSON.stringify(g.mechanic),before);}
 const g=quiet('goku');g.time=120;g.wave=5;g.waveState=newWaveState(5);g.nextBossWave=5;updateRun(g,.01);const before=JSON.stringify(g.mechanic);updateRun(g,.1);assert.equal(JSON.stringify(g.mechanic),before);finishBossIntro(g);
});
test('every map gets three distinct themed supplies that retain collision and probabilistic one-time drops',()=>{
 assert.equal(MAPS.length,17);assert.equal(new Set(Object.values(MAP_SUPPLIES).flat()).size,51);for(const [index,map]of MAPS.entries()){const g=quiet('goku',index);ensureWorld(g);const supplies=g.world.active.filter(o=>o.id.startsWith('starter:'));assert.equal(supplies.length,3);assert.deepEqual(supplies.map(o=>o.type),MAP_SUPPLIES[map.id]);for(const o of supplies){assert.ok(Number.isFinite(o.hp));assert.ok(o.name);assert.ok(SUPPLY_DEFS[o.type]);}
 const a=supplies[0];damageProp(g,a,1000,0,0,()=>.9);assert.equal(g.pickups.length,0);assert.equal(damageProp(g,a,1000),false);const b=supplies[1];damageProp(g,b,1000,0,0,()=>.1);assert.equal(g.pickups.length,1);ensureWorld(g);assert.ok(!g.world.active.some(o=>o.id===a.id||o.id===b.id));assert.ok(g.world.debris.length>0);}
});
test('Castle and Forest have traversable clearings, complete enemy pools and full rotating boss lists',()=>{
 for(const [id,boss]of [['castle','aura'],['forest','orochimaru']]){const index=MAPS.findIndex(m=>m.id===id),g=quiet('goku',index);assert.equal(bossForWave(id,5),boss);assert.equal(new Set(MAP_BOSSES[id]).size,normalBossIds.length);for(let i=0;i<30;i++)assert.ok(MAP_ENEMIES[id].includes(spawnEnemy(g).archetype));ensureWorld(g);g.world.circles=colliders(g);const body={x:0,y:0};moveBody(g,body,50,0,8);assert.ok(body.x>45);assert.equal(onWater(g.map,650,0),true);assert.equal(onWater(g.map,650+Math.sin(1)*90,400),false);assert.deepEqual(layoutProps(g.map,-500,-500,1000,1000),layoutProps(g.map,-500,-500,1000,1000));}
});
test('Spring Court skin has its own outfit silhouette and animated face, and saves without changing stats',()=>{
 const a=characterPixels('maomao'),b=characterPixels('maomao',{skin:'spring'});assert.notDeepEqual(a,b);assert.notDeepEqual(b,characterPixels('maomao',{skin:'spring',moving:true,frame:1}));assert.notDeepEqual(b,characterPixels('maomao',{skin:'spring',blink:true}));const profile=newProfile();profile.coins=87;profile.skins.maomao='spring';profile.characters.maomao.xp=52;const storage={data:'',getItem(){return this.data},setItem(k,v){this.data=v}};saveProfile(profile,storage);const p=loadProfile(storage);assert.equal(p.skins.maomao,'spring');assert.equal(p.characters.maomao.xp,52);assert.equal(p.coins,87);const normal=createRun(hero('maomao')),skin=createRun(hero('maomao'),0,p);for(const key of ['maxHp','damage','move','cooldown'])assert.equal(normal.p[key],skin.p[key]);
});
test('projectiles retain a minimum readable size at every camera zoom without changing combat radii',()=>{
 for(const z of [.6,.9,1,1.65])assert.ok(projectileScale(z)*z>=.64);const g=quiet('shinji');castWeapon(g,'pallet',{x:300,y:0});assert.ok(g.shots.every(s=>s.r===4));assert.ok(projectileScale(.6)>projectileScale(1.65));
});
