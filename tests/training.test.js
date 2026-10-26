import test from 'node:test';
import assert from 'node:assert/strict';
import {CHARACTERS,FUSIONS,ITEMS,MAX_SLOTS} from '../src/game.js';
import {createTrainingRun,spawnEnemy,updateRun,resolveRift} from '../src/engine.js';
import {RIFT_ENCOUNTERS} from '../src/rift-encounters.js';
import {BOSSES,ENEMIES} from '../src/enemies.js';
import {TRINKETS} from '../src/trinkets.js';
import {newProfile,creditRun} from '../src/progression.js';
import {saveRun,loadRun} from '../src/run-save.js';
import {trainingOpenRift,trainingRoster,trainingSpawn,setItemLevel,grantFusion,trainingFusions,grantTrinket,setGodMode,setNaturalSpawns,clearEnemies,levelUp} from '../src/training.js';

const hero=id=>CHARACTERS.find(c=>c.id===id);
const storage=()=>({data:null,getItem(){return this.data;},setItem(k,v){this.data=v;},removeItem(){this.data=null;}});
const run=(g,seconds,input={x:0,y:0})=>{for(let t=0;t<seconds&&g.status==='playing';t+=.025)updateRun(g,.025,input);};

test('training starts empty: no waves, bosses, rifts or world events unless natural spawns are switched on',()=>{
 const g=createTrainingRun(hero('goku'));assert.equal(g.mode,'training');run(g,240);
 assert.equal(g.enemies.length,0);assert.equal(g.bossIntro,null);assert.equal(g.rifts.portal,null);assert.ok(!g.events?.active);
 assert.ok(setNaturalSpawns(g,true));run(g,20);assert.ok(g.enemies.length>0,'natural waves resume on demand');
});
test('every enemy, boss, rift boss and event boss can be summoned and fought without errors',()=>{
 const roster=trainingRoster();assert.equal(roster.length,Object.keys(ENEMIES).length+Object.keys(BOSSES).length);
 for(const kind of ['enemy','boss','rift','event'])assert.ok(roster.some(e=>e.kind===kind),kind);
 for(const e of roster){const g=createTrainingRun(hero('goku'));setGodMode(g,true);const hp=g.p.hp;
  const made=trainingSpawn(g,e.id,{count:2},spawnEnemy);assert.equal(made.length,2,e.id);assert.ok(made.every(m=>m.archetype===e.id&&m.trainingSummon));
  run(g,3,{x:.4,y:.2});if(g.bossIntro)g.bossIntro=null;assert.equal(g.p.hp,hp,e.id+' god mode blocks damage');}
});
test('summons can start in Phase II, and rift bosses change form at half health without a rift',()=>{
 for(const [id,name]of [['jellal','Jellal · Sema Unleashed'],['acnologia','Acnologia · Black Dragon'],['milim','Milim Nava · Dragon Armor']]){const g=createTrainingRun(hero('goku'));const [e]=trainingSpawn(g,id,{phase2:true},spawnEnemy);assert.ok(e.enraged);assert.equal(e.name,name);}
 const g=createTrainingRun(hero('goku'));setGodMode(g,true);const [e]=trainingSpawn(g,'acnologia',{},spawnEnemy);e.hp=e.maxHp*.45;run(g,.1);
 assert.ok(e.enraged);assert.equal(e.name,'Acnologia · Black Dragon');
 const many=trainingSpawn(g,'eisenwald',{count:10,elite:true},spawnEnemy);assert.equal(many.length,10);assert.ok(many.every(m=>m.elite));
 assert.ok(clearEnemies(g));assert.equal(g.enemies.length,0);
});
test('any weapon or passive can be set to any level or removed, within the slot limit',()=>{
 const g=createTrainingRun(hero('goku')),p=g.p;
 assert.equal(setItemLevel(g,'senzu',ITEMS.senzu.max),'');assert.equal(p.passives.senzu,ITEMS.senzu.max);
 assert.equal(setItemLevel(g,'senzu',1),'');assert.equal(p.passives.senzu,1);assert.equal(setItemLevel(g,'senzu',0),'');assert.ok(!p.passives.senzu);
 const weapons=Object.keys(ITEMS).filter(id=>ITEMS[id].type==='weapon'&&!ITEMS[id].fusionOnly&&id!=='titanfists'&&id!=='odmblades');
 for(const id of weapons)setItemLevel(g,id,1);assert.equal(Object.keys(p.weapons).length,MAX_SLOTS);
 assert.match(setItemLevel(g,weapons.find(id=>!p.weapons[id]),1),/slots are full/);
});
test('fusions grant their ingredients first; only hero- or form-locked recipes are refused',()=>{
 for(const f of FUSIONS){const c=hero(f.requiredCharacter)||hero('goku'),g=createTrainingRun(c),info=trainingFusions(g.p).find(x=>x.id===f.id),why=grantFusion(g,f.id);
  if(info.locked)assert.ok(why,f.id+' explains the lock');else{assert.equal(why,'',f.id);assert.ok(trainingFusions(g.p).find(x=>x.id===f.id).active,f.id+' active');}}
});
test('trinkets go through the usual prompt, level-ups queue, and nothing is credited to the profile',()=>{
 const g=createTrainingRun(hero('goku'));assert.ok(grantTrinket(g,TRINKETS[0].id));assert.equal(g.status,'trinket');assert.equal(g.trinkets.pending.itemId,TRINKETS[0].id);
 levelUp(g);assert.ok(g.p.xp>=g.p.nextXp);
 const profile=newProfile();g.money=500;g.characterXp=300;g.kills=99;assert.deepEqual(creditRun(profile,g),{coins:0,xp:0});assert.equal(profile.coins,newProfile().coins);assert.equal(profile.bestKills||0,0);
});
test('training runs save and restore with their mode and switches',()=>{
 const g=createTrainingRun(hero('goku')),s=storage();setGodMode(g,true);trainingSpawn(g,'vulcan',{count:3},spawnEnemy);setItemLevel(g,'senzu',3);
 assert.ok(saveRun(g,s));const r=loadRun(s);assert.equal(r.mode,'training');assert.equal(r.training.god,true);assert.equal(r.training.natural,false);assert.equal(r.p.passives.senzu,3);
 r.status='playing';delete r.resumeStatus;const before=r.enemies.length;run(r,30);assert.ok(r.enemies.length<=before,'no natural spawns after a restore');
});
test('any rift can be opened on demand, entered and fought; natural rifts stay closed',()=>{
 for(const {id}of RIFT_ENCOUNTERS){
  const g=createTrainingRun(hero('goku'));setGodMode(g,true);trainingSpawn(g,'vulcan',{count:3},spawnEnemy);
  assert.equal(trainingOpenRift(g,id),'',id);assert.equal(g.rifts.portal.bossId,id);assert.equal(g.enemies.length,0,'the field is cleared');
  Object.assign(g.p,{x:g.rifts.portal.x,y:g.rifts.portal.y});run(g,.1);assert.equal(g.status,'rift',id+' prompts on approach');
  assert.ok(resolveRift(g,true),id);assert.equal(g.status,'playing');assert.equal(g.rifts.active.bossId,id);
  const boss=g.enemies.find(e=>e.riftBoss);assert.equal(boss.archetype,id);run(g,3,{x:.3,y:.1});if(g.bossIntro)g.bossIntro=null;
 }
 const g=createTrainingRun(hero('goku'));g.time=5000;run(g,30);assert.equal(g.rifts.portal,null,'no natural rift opens');
 assert.equal(trainingOpenRift(g,'nope'),'Unknown rift');
});
