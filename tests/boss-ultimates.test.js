import test from 'node:test';import assert from 'node:assert/strict';
import {CHARACTERS} from '../src/game.js';import {createRun,spawnEnemy,updateRun,hitPlayer,useDash} from '../src/engine.js';import {updateEnemyAI,BOSSES} from '../src/enemies.js';
import {BOSS_ULTIMATES} from '../src/boss-ultimates.js';import {finishBossIntro} from '../src/boss-intro.js';import {saveRun,loadRun} from '../src/run-save.js';
import {ensureWorld} from '../src/world.js';import {applyStatus} from '../src/status.js';import {bestiary} from '../src/bestiary.js';
import {PETS,petPixels} from '../src/pets.js';import {newProfile,sanitizeProfile} from '../src/progression.js';
const memory=()=>({data:new Map(),getItem(k){return this.data.get(k)},setItem(k,v){this.data.set(k,v)},removeItem(k){this.data.delete(k)}});
function run(){const g=createRun(CHARACTERS[0],3);g.spawn=g.eliteAt=g.nextBossWave=1e6;g.p.weapons={};g.p.nextXp=1e6;g.p.dodge=g.p.regen=0;ensureWorld(g);return g;}
function ready(g,id){const e=spawnEnemy(g,true,false,id);Object.assign(e,{x:220,y:0,attackCD:999,speed:0});if(['motherbrain','bertholdt'].includes(id)){e.hp=e.maxHp*.49;updateEnemyAI(g,e,.02);finishBossIntro(g);}e.ultimateCD=0;updateEnemyAI(g,e,.02);return e;}
for(const id of Object.keys(BOSS_ULTIMATES)){
 
function finishDeath(g){for(let i=0;i<90&&g.status==='playing'&&g.enemies.some(e=>e.boss&&e.hp<=0&&!e.deathComplete);i++)updateRun(g,.02);}
test(id+' ultimate has a long warning, a unique attack pattern and suppresses normal attacks',()=>{
  const g=run(),e=ready(g,id),def=BOSS_ULTIMATES[id];assert.equal(e.bossUltimate.name,def.name);assert.equal(e.bossUltimate.age,0);assert.ok(g.hazards.length);assert.ok(g.hazards.every(h=>h.bossUltimate&&h.sourceId===e.id&&h.delay>=2));assert.ok(g.toast.includes(def.name));const shots=g.enemyShots.length,skill=e.skill;updateEnemyAI(g,e,.2);assert.equal(e.skill,skill);assert.equal(g.enemyShots.length,shots);assert.equal(e.x,220);assert.equal(e.bossUltimate.age,.2);assert.equal(e.moving,false);assert.ok(bestiary({query:def.name,kind:'boss'}).includes(BOSSES[id].name));
 });
 test(id+' ultimate respects cooldowns, stops on pause and restores its telegraphs from a checkpoint',()=>{
  const g=run(),e=ready(g,id),s=memory();updateRun(g,.2);const age=e.bossUltimate.age,warning=g.hazards[0].age;g.status='paused';updateRun(g,3);assert.equal(e.bossUltimate.age,age);assert.equal(g.hazards[0].age,warning);saveRun(g,s);const loaded=loadRun(s);assert.equal(loaded.status,'paused');assert.deepEqual(loaded.enemies[0].bossUltimate,e.bossUltimate);assert.deepEqual(loaded.hazards,g.hazards);loaded.status='playing';updateEnemyAI(loaded,loaded.enemies[0],BOSS_ULTIMATES[id].duration);assert.equal(loaded.enemies[0].bossUltimate,null);assert.equal(loaded.enemies[0].ultimateCD,BOSS_ULTIMATES[id].cooldown);updateEnemyAI(loaded,loaded.enemies[0],.1);assert.equal(loaded.enemies[0].bossUltimate,null);
 });
 test(id+' marked ultimate is cancelled when its boss dies and awards a chest once',()=>{
  const g=run(),e=ready(g,id);e.hp=0;updateRun(g,.02);finishDeath(g);assert.ok(!g.hazards.some(h=>h.bossUltimate&&h.sourceId===e.id));assert.equal(g.chests.filter(c=>c.source===e.name).length,1);updateRun(g,.02);assert.equal(g.chests.filter(c=>c.source===e.name).length,1);
 });
}
test('normal bosses get an opening grace period and old saves do not trigger an ultimate immediately',()=>{
 const g=run(),e=spawnEnemy(g,true,false,'frieza');Object.assign(e,{x:220,y:0,attackCD:999,speed:0});assert.equal(e.ultimateCD,undefined);updateEnemyAI(g,e,.02);assert.ok(e.ultimateCD>17);assert.equal(e.bossUltimate,undefined);e.ultimateCD=1;updateEnemyAI(g,e,.5);assert.equal(e.bossUltimate,undefined);updateEnemyAI(g,e,.6);assert.ok(e.bossUltimate);
});
test('Mother Brain and Bertholdt unlock ultimates only after transformation',()=>{
 for(const id of ['motherbrain','bertholdt']){const g=run(),e=spawnEnemy(g,true,false,id);Object.assign(e,{x:200,y:0,ultimateCD:0,attackCD:999});updateEnemyAI(g,e,.02);assert.ok(!e.bossUltimate);assert.ok(!g.hazards.some(h=>h.bossUltimate));e.hp=e.maxHp*.49;updateEnemyAI(g,e,.02);assert.equal(e.ultimateCD,8);assert.ok(g.bossIntro);finishBossIntro(g);e.ultimateCD=0;updateEnemyAI(g,e,.02);assert.ok(e.bossUltimate);}
});
test('Esdeath and Unlimited Void freeze both ultimate charging and its hazard timers',()=>{
 for(const type of ['esdeath','gojo']){const g=run(),e=ready(g,'frieza');g.ultimate={type,x:e.x,y:e.y,r:800,age:0,duration:10};if(type==='gojo'){g.freeze=5;g.voidRadius=800;}const age=e.bossUltimate.age,hage=g.hazards[0].age;updateRun(g,.1);assert.equal(e.bossUltimate.age,age);assert.equal(g.hazards[0].age,hage);}
});
test('control effects and Kurumi slow apply consistently to charge and warning clocks',()=>{
 const g=run(),e=ready(g,'frieza');applyStatus(e,'stun',2);const age=e.bossUltimate.age,hage=g.hazards[0].age;updateRun(g,.05);assert.equal(e.bossUltimate.age,age);assert.equal(g.hazards[0].age,hage);e.statuses={};g.ultimate={type:'kurumi',x:e.x,y:e.y,r:800,age:0,duration:10,shadows:[],slowCD:999};updateRun(g,.1);assert.ok(Math.abs(e.bossUltimate.age-.07)<1e-8);assert.ok(Math.abs(g.hazards[0].age-.07)<1e-8);
});
test('Supernova deals no early damage and can be dodged with movement or dash invulnerability',()=>{
 const g=run(),e=ready(g,'frieza');e.hp=e.maxHp;const h=g.hazards[0],hp=g.p.hp;for(let i=0;i<10;i++)updateRun(g,.02);assert.equal(g.p.hp,hp);h.age=h.delay-.01;g.invuln=0;useDash(g,{x:0,y:1});updateRun(g,.02);assert.equal(g.p.hp,hp);g.dash=null;g.p.x=h.x-200;g.p.y=h.y;g.invuln=0;updateRun(g,.02);assert.equal(g.p.hp,hp);g.p.x=h.x;g.p.y=h.y;g.invuln=0;updateRun(g,.02);assert.ok(g.p.hp<hp);
});
test('new pets are animated cosmetics and their selections sanitize and save with a run',()=>{
 for(const id of ['pikachu','totoro','happy','kero']){assert.ok(PETS.some(p=>p.id===id));assert.ok(petPixels(id).filter(Boolean).length>150);assert.notDeepEqual(petPixels(id,0),petPixels(id,1));const p=newProfile();p.pet=id;const clean=sanitizeProfile(p);assert.equal(clean.pet,id);const g=createRun(CHARACTERS[0],3,clean),s=memory();assert.equal(g.pet.id,id);assert.deepEqual(g.p.weapons,{ki:1});assert.equal(hitPlayer(g,10),true);saveRun(g,s);assert.equal(loadRun(s).pet.id,id);}
});

test('multiple bosses take turns using ultimates so their large warnings do not overlap',()=>{
 const g=run(),first=ready(g,'frieza'),second=spawnEnemy(g,true,false,'sukuna');Object.assign(second,{x:240,y:100,ultimateCD:0,attackCD:999});updateEnemyAI(g,second,.1);assert.equal(second.bossUltimate,undefined);updateEnemyAI(g,first,BOSS_ULTIMATES.frieza.duration);assert.equal(first.bossUltimate,null);updateEnemyAI(g,second,.1);assert.equal(second.bossUltimate.name,BOSS_ULTIMATES.sukuna.name);
});
