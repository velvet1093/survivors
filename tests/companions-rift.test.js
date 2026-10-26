import test from 'node:test';import assert from 'node:assert/strict';
import {CHARACTERS,MAPS,refreshStats} from '../src/game.js';
import {createRun,updateRun,useSpecial,spawnEnemy,damageEnemy} from '../src/engine.js';
import {newProfile,sanitizeProfile,saveProfile,loadProfile,GENERAL_TREE,CHARACTER_TREES} from '../src/progression.js';
import {skillIcon,SKILL_ART} from '../src/skill-icons.js';
import {ultimateCooldown,ULTIMATE_COOLDOWN} from '../src/ultimates.js';
import {enemyPressure,strengthenEnemy} from '../src/difficulty.js';
import {ENEMIES,BOSSES,MAP_ENEMIES,MAP_BOSSES,makeEnemy,updateEnemyAI} from '../src/enemies.js';
import {RIFT_ENEMIES,RIFT_BOSSES} from '../src/rift-enemies.js';
import {petFor,petPixels,updatePet} from '../src/pets.js';
import {characterPixels} from '../src/pixel-characters.js';
import {enemyPixels} from '../src/pixel-enemies.js';
import {enemyMotion} from '../src/enemy-animation.js';
import {bestiary} from '../src/bestiary.js';
const hero=id=>CHARACTERS.find(c=>c.id===id);
function quiet(id='maomao',profile=null){const g=createRun(hero(id),3,profile);g.events.nextAt=1e9;g.spawn=g.eliteAt=g.nextBossWave=1e6;g.p.weapons={};g.p.nextXp=1e6;g.p.regen=0;g.p.dodge=0;return g;}
function target(g,id='soldier',boss=false,x=200,y=100){const e=spawnEnemy(g,boss,false,id);Object.assign(e,{x,y,speed:0,attackCD:9999});return e;}

test('all skill nodes have different illustrated art, including nodes that shared item icons',()=>{
 const arts=[];for(const n of GENERAL_TREE){assert.ok(SKILL_ART.general[n.id]);arts.push(skillIcon('general',n));}for(const [id,tree]of Object.entries(CHARACTER_TREES))for(const n of tree){assert.ok(SKILL_ART[id][n.id]);arts.push(skillIcon('character',n,id));}const count=GENERAL_TREE.length+Object.values(CHARACTER_TREES).reduce((sum,t)=>sum+t.length,0);assert.equal(arts.length,count);assert.equal(new Set(arts).size,count);for(const art of arts){assert.ok(art.includes('data-skill-art='));assert.ok(art.includes('<path'));assert.ok(art.includes('aria-hidden="true"'));}assert.notEqual(SKILL_ART.goku.ki,SKILL_ART.goku.focus);
});
test('ultimates start from a one-minute base, equipment/mastery reductions still apply, and pause stops the timer',()=>{
 assert.equal(ULTIMATE_COOLDOWN,60);for(const c of CHARACTERS){const g=quiet(c.id);assert.ok(useSpecial(g));assert.equal(g.special,ultimateCooldown(g.p));assert.equal(g.specialMax,ultimateCooldown(g.p));const before=g.special;g.status='paused';updateRun(g,5);assert.equal(g.special,before);}
 const g=quiet('goku');assert.equal(ultimateCooldown(g.p),60);g.p.passives.eyes=3;g.p.meta.ultimateCooldown=.09;refreshStats(g.p);assert.ok(Math.abs(ultimateCooldown(g.p)-60*.76*.91)<1e-8);
});
test('newly spawned enemies get more health, damage, speed and faster attacks as time advances',()=>{
 const early=quiet(),late=quiet();late.time=600;for(const [id,boss]of [['soldier',false],['frieza',true]]){const a=makeEnemy(early,id,boss),b=makeEnemy(late,id,boss);assert.ok(b.maxHp>a.maxHp);assert.ok(b.speed>a.speed);assert.ok(b.damageScale>a.damageScale);a.x=b.x=200;a.y=b.y=0;a.attackCD=b.attackCD=0;updateEnemyAI(early,a,.01);updateEnemyAI(late,b,.01);assert.ok(b.attackCD<a.attackCD);}
 assert.ok(late.enemyShots.length||late.hazards.length);assert.ok(enemyPressure(600).projectileSpeed>1);
});
test('enemies already alive strengthen once per minute while retaining their health percentage',()=>{
 const e={hp:50,maxHp:100,speed:80,attackCD:4,pressureMinute:0};strengthenEnemy(e,60);assert.ok(e.maxHp>100);assert.ok(Math.abs(e.hp/e.maxHp-.5)<1e-8);assert.ok(e.speed>80);assert.ok(e.attackCD<4);const hp=e.hp;strengthenEnemy(e,65);assert.equal(e.hp,hp);strengthenEnemy(e,120);assert.ok(e.hp>hp);assert.ok(Math.abs(e.hp/e.maxHp-.5)<1e-8);e.hp=0;const max=e.maxHp;strengthenEnemy(e,300);assert.equal(e.hp,0);assert.equal(e.maxHp,max);
});
test('time scaling affects actual contact damage and warned attacks without shortening warnings',()=>{
 const a=quiet(),b=quiet();b.time=600;const ea=target(a,'soldier',false,0,0),eb=target(b,'soldier',false,0,0);const ha=a.p.hp,hb=b.p.hp;updateRun(a,.01);updateRun(b,.01);assert.ok(hb-b.p.hp>ha-a.p.hp);
 for(const g of [a,b]){g.enemies=[];g.enemyShots=[];g.hazards=[];const e=target(g,'frieza',true,200,0);e.attackCD=0;updateEnemyAI(g,e,.01);}assert.ok(b.hazards[0].damage>a.hazards[0].damage);assert.equal(a.hazards[0].delay,b.hazards[0].delay);
});
test('new enemies and bosses are reachable, animate distinctly and expose their mechanics in the bestiary',()=>{
 assert.equal(Object.keys(RIFT_ENEMIES).length,6);assert.equal(Object.keys(RIFT_BOSSES).length,3);for(const id of Object.keys(RIFT_ENEMIES)){assert.ok(Object.values(MAP_ENEMIES).some(ids=>ids.includes(id)));const g=quiet(),e=target(g,id);e.attackCD=0;updateEnemyAI(g,e,.02);assert.ok(g.enemyShots.length||g.hazards.length);assert.ok(bestiary({query:RIFT_ENEMIES[id].name}).includes(RIFT_ENEMIES[id].description));}
 for(const id of Object.keys(RIFT_BOSSES)){for(const map of MAPS)assert.ok(MAP_BOSSES[map.id].includes(id));const g=quiet(),e=target(g,id,true);for(let i=0;i<3;i++){e.attackCD=0;updateEnemyAI(g,e,.02);}assert.ok(g.hazards.length);assert.ok(g.hazards.every(h=>h.delay>=.6));e.hp=e.maxHp*.4;updateEnemyAI(g,e,.01);assert.ok(id==='cell'?e.cellStage===1:e.enraged);}
 const ids=Object.keys({...RIFT_ENEMIES,...RIFT_BOSSES});assert.equal(new Set(ids.map(id=>JSON.stringify(enemyPixels(id)))).size,9);for(const id of ids)assert.notDeepEqual(enemyMotion({archetype:id},.1),enemyMotion({archetype:id},.4));
});
test('Hollow shots heal their source only on an actual player hit, and dash denies the heal',()=>{
 for(const dash of [false,true]){const g=quiet(),e=target(g,'hollow');e.hp=e.maxHp*.5;e.attackCD=0;updateEnemyAI(g,e,.01);const s=g.enemyShots[0];g.enemyShots=[s];Object.assign(s,{x:0,y:0,vx:0,vy:0});if(dash)g.dash={age:0,duration:.22,x:0,y:0};const hp=e.hp;updateRun(g,.01);assert.equal(e.hp>hp,!dash);}
});
test('Perfect Cell regenerates only after three seconds without damage and pauses regeneration in Mahapadma',()=>{
 const g=quiet('esdeath'),e=target(g,'cell',true);e.cellStage=2;e.enraged=true;e.hp=e.maxHp*.3;g.time=4;const hp=e.hp;updateEnemyAI(g,e,.1);assert.ok(e.hp>hp);damageEnemy(g,e,1);const after=e.hp;updateEnemyAI(g,e,.1);assert.equal(e.hp,after);g.time=8;useSpecial(g);const before=e.hp;updateEnemyAI(g,e,.5);assert.equal(e.hp,before);g.ultimate=null;updateEnemyAI(g,e,.1);assert.ok(e.hp>before);
});
test('Cell Juniors repair themselves on alternating attacks and clock shots curve',()=>{
 const g=quiet(),e=target(g,'celljunior');e.hp=e.maxHp*.5;e.skill=1;e.attackCD=0;const hp=e.hp;updateEnemyAI(g,e,.01);assert.ok(e.hp>hp);const w=target(g,'timewraith');w.attackCD=0;updateEnemyAI(g,w,.01);const s=g.enemyShots.find(s=>s.turn);assert.ok(s);const angle=Math.atan2(s.vy,s.vx);updateRun(g,.05);assert.notEqual(Math.atan2(s.vy,s.vx),angle);
});
test('all three reference skins have different silhouettes, expressive faces and unchanged gameplay stats',()=>{
 const p=newProfile();for(const [id,skin]of [['kurumi','gothic'],['maomao','dancer'],['gojo','female']]){p.skins[id]=skin;const normal=createRun(hero(id)),alt=createRun(hero(id),0,p);for(const k of ['maxHp','damage','move','cooldown'])assert.equal(normal.p[k],alt.p[k]);const pixels=characterPixels(id,{skin});assert.notDeepEqual(pixels,characterPixels(id));assert.notDeepEqual(pixels,characterPixels(id,{skin,blink:true}));assert.notDeepEqual(pixels,characterPixels(id,{skin,moving:true,frame:1}));}
});
test('Baby Metroid and pet selection survive save roundtrips; older saves default to no companion',()=>{
 assert.equal(sanitizeProfile({coins:50}).pet,'none');assert.equal(petFor('unknown').id,'none');const p=newProfile();p.pet='metroid';p.skins.gojo='female';p.coins=55;const storage={data:'',getItem(){return this.data},setItem(k,v){this.data=v}};saveProfile(p,storage);const saved=loadProfile(storage);assert.equal(saved.pet,'metroid');assert.equal(saved.skins.gojo,'female');assert.equal(saved.coins,55);const g=createRun(hero('gojo'),0,saved);assert.equal(g.pet.id,'metroid');assert.ok(petPixels('metroid').filter(Boolean).length>200);assert.ok(new Set(petPixels('metroid').filter(Boolean)).size>8);
});
test('pets trail their owner visually, freeze during interruptions and have no combat or pickup role',()=>{
 const p=newProfile();p.pet='metroid';const a=quiet('maomao'),b=quiet('maomao',p);for(const key of ['damage','move','maxHp','magnet','cooldown','dodge'])assert.equal(a.p[key],b.p[key]);b.p.x=100;updatePet(b,.1);assert.ok(b.pet.x>-35);assert.ok(b.pet.x<65);assert.equal(b.enemies.length,0);assert.equal(b.cloneUnits.length,0);assert.equal(b.shots.length,0);assert.equal(b.gems.length,0);const before=JSON.stringify(b.pet);for(const status of ['paused','upgrade','chest']){b.status=status;updateRun(b,1);assert.equal(JSON.stringify(b.pet),before);}assert.deepEqual(petPixels('none').filter(Boolean),[]);
});
