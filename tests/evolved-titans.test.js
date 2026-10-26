import test from 'node:test';import assert from 'node:assert/strict';
import {CHARACTERS,FUSIONS,applyChoice} from '../src/game.js';import {createRun,spawnEnemy,castWeapon,updateRun,useSpecial} from '../src/engine.js';
import {ensureWorld,damageProp,colliders} from '../src/world.js';import {saveRun,loadRun} from '../src/run-save.js';import {MAP_SUPPLIES,supplyGeometry} from '../src/map-supplies.js';
import {MAP_ENEMIES,updateEnemyAI} from '../src/enemies.js';import {hasStatus} from '../src/status.js';import {TITAN_ENEMIES} from '../src/titan-enemies.js';import {enemyPixels} from '../src/pixel-enemies.js';
const memory=()=>({data:new Map(),getItem(k){return this.data.get(k)},setItem(k,v){this.data.set(k,v)},removeItem(k){this.data.delete(k)}});
function run(id='eren',map=3){const g=createRun(CHARACTERS.find(c=>c.id===id),map);g.spawn=g.eliteAt=g.nextBossWave=1e6;g.p.nextXp=1e6;g.p.regen=0;ensureWorld(g);g.world.active=[];g.world.circles=[];for(const id of Object.keys(g.p.weapons))g.p.cooldowns[id]=999;return g;}
function enemy(g,x=150,y=0){const e=spawnEnemy(g,false,false,'zoomer');Object.assign(e,{x,y,hp:10000,maxHp:10000,speed:0,attackCD:9999});return e;}
function sim(g,t){for(let i=0;i<Math.round(t/.02);i++)updateRun(g,.02);}
function evolve(g){const id=g.p.id==='shinji'?'pallet':'odmblades',passive=g.p.id==='shinji'?'atfield':'freedom';g.p.weapons[id]=5;g.p.passives[passive]=3;assert.ok(applyChoice(g.p,{kind:'fusion',id:g.p.id==='shinji'?'positron':'scoutassault'}));g.p.cooldowns[id]=999;return id;}
test('fusion recipes retain saved IDs and ingredients but name the new evolved weapons',()=>{
 const long=FUSIONS.find(f=>f.id==='positron'),thunder=FUSIONS.find(f=>f.id==='scoutassault');assert.equal(long.name,'Spear of Longinus');assert.equal(long.weapon,'pallet');assert.equal(long.passive,'atfield');assert.equal(thunder.name,'Thunder Spears');assert.equal(thunder.weapon,'odmblades');assert.equal(thunder.passive,'freedom');
});
test('Longinus travels, pierces targets, returns, and cannot hit the same enemy twice in one pass',()=>{
 const g=run('shinji'),id=evolve(g),a=enemy(g,150),b=enemy(g,260),off=enemy(g,180,160);castWeapon(g,id,a);assert.equal(a.hp,10000);assert.equal(g.shots.length,1);assert.equal(g.shots[0].type,'longinus');sim(g,.35);assert.ok(a.hp<10000);assert.ok(hasStatus(a,'cursed'));const hp=a.hp;sim(g,.2);assert.equal(a.hp,hp);assert.ok(b.hp<10000);assert.equal(off.hp,10000);sim(g,.55);assert.ok(g.shots[0].returning);sim(g,.7);assert.ok(a.hp<hp);assert.equal(g.shots.length,0);
});
test('Thunder Spears stick with a brief fuse, then damage an area exactly once',()=>{
 const g=run(),id=evolve(g),a=enemy(g,130),b=enemy(g,145,45),off=enemy(g,130,220);castWeapon(g,id,a);assert.equal(g.shots.length,2);assert.ok(g.shots.every(s=>s.type==='thunderspear'));sim(g,.28);assert.ok(g.shots.some(s=>s.stuck));assert.equal(b.hp,10000);b.armorTime=5;sim(g,.5);assert.equal(b.armorTime,0);assert.ok(a.hp<10000&&b.hp<10000);assert.equal(off.hp,10000);assert.ok(hasStatus(b,'bleeding'));assert.equal(g.shots.length,0);const hp=b.hp;sim(g,.02);assert.equal(b.hp,hp);assert.ok(g.effects.some(e=>e.type==='thunder-blast'));
});
test('Thunder Spear fuses follow a moving host and detonate after it is killed',()=>{
 const g=run(),id=evolve(g),a=enemy(g,100);castWeapon(g,id,a);sim(g,.22);const spear=g.shots.find(s=>s.stuck);assert.ok(spear);a.x=180;a.y=50;sim(g,.02);assert.equal(spear.x,a.x);assert.equal(spear.y,a.y-5);a.hp=0;sim(g,.5);assert.ok(spear.exploded);assert.ok(!g.shots.includes(spear));assert.ok(g.effects.some(e=>e.type==='thunder-blast'));
});
test('evolved projectiles break supplies, and Longinus can pierce scenery',()=>{
 for(const character of ['shinji','eren']){const g=run(character),id=evolve(g);ensureWorld(g);const prop=g.world.active.find(o=>Number.isFinite(o.hp));for(const o of g.world.active)if(o!==prop&&Number.isFinite(o.hp))g.world.destroyed.add(o.id);Object.assign(prop,{x:110,y:0,hp:1,maxHp:1});g.world.active=[prop];g.world.circles=colliders(g);const e=enemy(g,200);castWeapon(g,id,e);sim(g,.8);assert.ok(g.world.destroyed.has(prop.id));assert.equal(g.broken,1);}
});
test('Eren keeps Thunder Spears when shifting away and back, without firing them in Titan form',()=>{
 const g=run(),id=evolve(g),e=enemy(g,130);useSpecial(g);assert.equal(g.p.weapon,'titanfists');assert.equal(g.p.weapons.odmblades,undefined);assert.equal(g.p.fusions.odmblades,'scoutassault');sim(g,1.2);g.special=0;useSpecial(g);assert.equal(g.p.weapon,'odmblades');g.shots=[];castWeapon(g,id,e);assert.equal(g.shots[0].type,'thunderspear');
});
test('new projectiles, return hit sets and attached fuses survive a paused checkpoint',()=>{
 for(const character of ['eren','shinji']){const g=run(character),id=evolve(g),e=enemy(g,100),s=memory();castWeapon(g,id,e);sim(g,.22);g.status='paused';const before=JSON.stringify(g.shots,(_,v)=>v instanceof Set?[...v]:v);updateRun(g,3);assert.equal(JSON.stringify(g.shots,(_,v)=>v instanceof Set?[...v]:v),before);saveRun(g,s);const loaded=loadRun(s);assert.equal(loaded.status,'paused');assert.equal(loaded.p.fusions[id],g.p.fusions[id]);for(const q of loaded.shots){assert.ok(q.hits instanceof Set);assert.ok(q.returnHits instanceof Set);}loaded.status='playing';for(const id of Object.keys(loaded.p.weapons))loaded.p.cooldowns[id]=999;sim(loaded,2);assert.ok(loaded.shots.length===0);}
});
test('older fused equipment checkpoints automatically use the new attacks without losing progression',()=>{
 const g=run('shinji'),s=memory();evolve(g);g.money=70;g.kills=88;saveRun(g,s);const loaded=loadRun(s);assert.equal(loaded.money,70);assert.equal(loaded.kills,88);assert.equal(loaded.p.passives.atfield,3);castWeapon(loaded,'pallet',enemy(loaded));assert.equal(loaded.shots[0].type,'longinus');
});
test('all themed supplies use compact matching collision profiles, including old moved objects',()=>{
 for(const map of [0,3,4,6,7,8,9]){const g=run('goku',map);ensureWorld(g);const o=g.world.active.find(o=>o.id.startsWith('starter:'));const geometry=supplyGeometry(o.type);assert.ok(geometry.scale>=.5&&geometry.scale<=.9);assert.equal(o.visualScale,geometry.scale);assert.equal(o.r,geometry.radius);o.r=100;o.visualScale=1;o.x+=20;const x=o.x;o.hp-=1;const hp=o.hp;ensureWorld(g);assert.equal(o.r,geometry.radius);assert.equal(o.visualScale,geometry.scale);assert.equal(o.x,x);assert.equal(o.hp,hp);}
});
test('Smiling, Bearded, Crawling and Small Titans are reachable, use unique attacks and have different silhouettes',()=>{
 const arts=[],patterns=[];for(const id of ['smilingtitan','beardedtitan','crawlingtitan','smalltitan']){const g=run('goku',9),e=spawnEnemy(g,false,false,id);Object.assign(e,{x:200,y:0,attackCD:0});updateEnemyAI(g,e,.02);assert.equal(e.family,'aot');assert.ok(MAP_ENEMIES.shiganshina.includes(id));assert.ok(g.hazards.length);assert.ok(g.hazards.every(h=>h.delay>=.8));assert.ok(TITAN_ENEMIES[id].description);arts.push(JSON.stringify(enemyPixels(id)));patterns.push(g.hazards.map(h=>h.label).join('|'));}assert.equal(new Set(arts).size,4);assert.equal(new Set(patterns).size,4);
});
