import test from 'node:test';import assert from 'node:assert/strict';
import {CHARACTERS,MAPS} from '../src/game.js';import {createRun,spawnEnemy,updateRun,hitPlayer} from '../src/engine.js';
import {JOJO_ENEMIES,JOJO_BOSSES} from '../src/jojo-enemies.js';import {ENEMIES,BOSSES,MAP_ENEMIES,MAP_BOSSES,bossForWave,updateEnemyAI} from '../src/enemies.js';
import {ANIME_NAMES} from '../src/anime-enemies.js';import {enemyPixels} from '../src/pixel-enemies.js';import {enemyMotion,ENEMY_MOTION_NAMES} from '../src/enemy-animation.js';import {bestiary} from '../src/bestiary.js';import {saveRun,loadRun} from '../src/run-save.js';
const hero=CHARACTERS.find(c=>c.id==='goku');
function quiet(){const g=createRun(hero,3);g.spawn=g.eliteAt=g.nextBossWave=1e6;g.p.nextXp=1e6;g.p.weapons={};g.p.regen=g.p.dodge=0;return g;}
function enemy(g,id,boss=false){const e=spawnEnemy(g,boss,false,id);Object.assign(e,{x:200,y:60,speed:0,attackCD:0});return e;}
const memory=()=>({data:new Map(),getItem(k){return this.data.get(k)},setItem(k,v){this.data.set(k,v)},removeItem(k){this.data.delete(k)}});

function finishDeath(g){for(let i=0;i<90&&g.status==='playing'&&g.enemies.some(e=>e.boss&&e.hp<=0&&!e.deathComplete);i++)updateRun(g,.02);}
test('all JoJo threats are playable, registered in the bestiary and reachable without replacing first map bosses',()=>{
 assert.equal(Object.keys(JOJO_ENEMIES).length,5);assert.equal(Object.keys(JOJO_BOSSES).length,3);assert.equal(ANIME_NAMES.jojo,'JoJo’s Bizarre Adventure');
 for(const [id,def]of Object.entries(JOJO_ENEMIES)){assert.equal(ENEMIES[id],def);assert.ok(Object.values(MAP_ENEMIES).some(pool=>pool.includes(id)));assert.ok(bestiary({query:def.name}).includes(def.description));}
 for(const [id,def]of Object.entries(JOJO_BOSSES)){assert.equal(BOSSES[id],def);for(const m of MAPS)assert.ok(MAP_BOSSES[m.id].includes(id));assert.ok(bestiary({query:def.name,kind:'boss'}).includes(def.description));}
 assert.equal(bossForWave('castle',5),'aura');assert.equal(bossForWave('castle',10),'dio');assert.equal(bossForWave('forest',5),'orochimaru');assert.equal(bossForWave('forest',10),'kars');assert.equal(bossForWave('zebes',5),'kraid');assert.equal(bossForWave('shiganshina',5),'annie');assert.equal(bestiary({query:'JoJo',kind:'boss'}).match(/bestiary-entry/g).length,3);
});
test('JoJo pixel art and motion are distinct for every threat, including Kars wings in phase two',()=>{
 const ids=Object.keys({...JOJO_ENEMIES,...JOJO_BOSSES}),art=ids.map(id=>JSON.stringify(enemyPixels(id)));assert.equal(new Set(art).size,8);
 for(const id of ids){assert.ok(enemyPixels(id).filter(Boolean).length>350);assert.ok(ENEMY_MOTION_NAMES[id]);const a=enemyMotion({archetype:id},.1),b=enemyMotion({archetype:id},.4);assert.notDeepEqual(a,b);assert.ok(Object.values(a).every(Number.isFinite));assert.notDeepEqual(enemyPixels(id,a),enemyPixels(id,b));assert.deepEqual(enemyMotion({archetype:id},.1,true),enemyMotion({archetype:id},.4,true));}
 assert.notDeepEqual(enemyPixels('kars'),enemyPixels('kars',{enraged:1}));
});
test('each normal JoJo enemy executes its specific attack and all warnings belong to the source',()=>{
 for(const id of Object.keys(JOJO_ENEMIES)){const g=quiet(),e=enemy(g,id);updateEnemyAI(g,e,.01);assert.equal(e.skill,1);assert.ok(g.hazards.length||g.enemyShots.length);assert.ok(g.hazards.every(h=>h.sourceId===e.id&&h.delay>=.8));assert.ok(g.enemyShots.every(s=>s.sourceId===e.id));}
 const g=quiet(),tank=enemy(g,'sheerheart');updateEnemyAI(g,tank,.01);assert.ok(tank.armorTime>1);assert.ok(tank.windup>1);assert.equal(g.hazards[0].label,'SHEER HEART ATTACK');assert.equal(g.hazards[0].r,112);
});
test('vampire and Highway Star healing requires a direct hit; dash denies healing and drain shots curve',()=>{
 for(const id of ['stonevampire','highwaystar'])for(const dash of [false,true]){const g=quiet(),e=enemy(g,id);e.hp=e.maxHp*.5;updateEnemyAI(g,e,.01);const s=g.enemyShots[0];assert.ok(s.leech>0);g.hazards=[];g.enemyShots=[s];Object.assign(s,{x:0,y:0,vx:0,vy:0});if(dash)g.dash={age:0,duration:.22,x:0,y:0};const hp=e.hp;updateRun(g,.01);assert.equal(e.hp>hp,!dash);}
 const g=quiet(),e=enemy(g,'highwaystar');updateEnemyAI(g,e,.01);const s=g.enemyShots[0],angle=Math.atan2(s.vy,s.vx);updateRun(g,.05);assert.notEqual(Math.atan2(s.vy,s.vx),angle);
});
test('DIO locks stopped knives before time resumes, leaving gaps and adding a later crossed lane in phase two',()=>{
 const g=quiet(),e=enemy(g,'dio',true);updateEnemyAI(g,e,.01);const knives=g.hazards.filter(h=>h.label==='THE WORLD · STOPPED KNIVES');assert.equal(knives.length,5);assert.ok(knives.every(h=>h.delay>=1.7&&h.width===10));const positions=knives.map(h=>[h.x,h.y,h.tx,h.ty]);g.p.x=300;g.p.y=-100;updateEnemyAI(g,e,.2);assert.deepEqual(knives.map(h=>[h.x,h.y,h.tx,h.ty]),positions);
 e.enraged=true;e.skill=0;e.attackCD=0;g.hazards=[];updateEnemyAI(g,e,.01);assert.ok(g.hazards.some(h=>h.label==='TIME RESUMES · CROSS KNIVES'&&h.delay>=2));
});
test('Kira remembers bomb positions, bounds autonomous tanks and serializes remembered attacks',()=>{
 const g=quiet(),e=enemy(g,'kira',true);g.p.x=50;g.p.y=75;updateEnemyAI(g,e,.01);assert.deepEqual(e.bombMemory,{x:50,y:75});e.attackCD=0;updateEnemyAI(g,e,.01);assert.equal(g.enemies.filter(s=>s.archetype==='sheerheart').length,1);g.p.x=300;g.p.y=200;e.attackCD=0;updateEnemyAI(g,e,.01);const remembered=g.hazards.find(h=>h.label==='BITES THE DUST · REMEMBERED BOMB');assert.equal(remembered.x,50);assert.equal(remembered.y,75);assert.ok(g.hazards.some(h=>h.label==='BITES THE DUST · NEW FATE'&&h.x===300));
 for(let i=0;i<5;i++){e.enraged=true;e.skill=1;e.attackCD=0;updateEnemyAI(g,e,.01);}assert.equal(g.enemies.filter(s=>s.archetype==='sheerheart').length,3);
 const storage=memory();saveRun(g,storage);const saved=loadRun(storage);assert.deepEqual(saved.enemies.find(s=>s.archetype==='kira').bombMemory,{x:50,y:75});assert.equal(saved.hazards.find(h=>h.label===remembered.label).sourceId,e.id);
});
test('Kars alternates warned blades, bending feathers, light spokes and phase-two vampire summons',()=>{
 const g=quiet(),e=enemy(g,'kars',true);updateEnemyAI(g,e,.01);assert.ok(g.hazards.some(h=>h.label==='BRILLIANT BONE BLADES'));e.attackCD=0;updateEnemyAI(g,e,.01);assert.ok(g.enemyShots.every(s=>Math.abs(s.turn)===.18));e.enraged=true;e.attackCD=0;updateEnemyAI(g,e,.01);assert.equal(g.hazards.filter(h=>h.label==='ULTIMATE LIFE · LIGHT SPOKE').length,8);assert.equal(g.enemies.filter(s=>s.archetype==='stonevampire'&&s.ownerId===e.id).length,2);assert.ok(e.armorTime>0);
});
test('JoJo warnings pause with combat and cannot deal damage before activation',()=>{
 const g=quiet(),e=enemy(g,'kira',true);e.x=400;e.y=100;updateEnemyAI(g,e,.01);const hp=g.p.hp;updateRun(g,.5);assert.equal(g.p.hp,hp);const before=g.hazards[0].age;g.status='paused';updateRun(g,10);assert.equal(g.hazards[0].age,before);g.status='playing';updateRun(g,.81);assert.ok(g.p.hp<hp);
});
test('JoJo bosses enter phase two and grant one chest on final defeat without orphaned hazards',()=>{
 for(const id of Object.keys(JOJO_BOSSES)){const g=quiet(),e=enemy(g,id,true);e.hp=e.maxHp*.4;updateEnemyAI(g,e,.01);assert.equal(e.enraged,true);assert.ok(g.hazards.length||g.enemyShots.length);e.hp=0;e.x=400;e.y=100;updateRun(g,.01);assert.equal(g.chests.length,0);finishDeath(g);assert.equal(g.chests.length,1);assert.equal(g.bossKills,1);assert.ok(!g.hazards.some(h=>h.sourceId===e.id));updateRun(g,.01);assert.equal(g.chests.length,1);}
});
