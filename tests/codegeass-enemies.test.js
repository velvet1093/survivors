import test from 'node:test';
import assert from 'node:assert/strict';
import {CODEGEASS_ENEMIES,CODEGEASS_BOSSES,codeGeassAttack} from '../src/codegeass-enemies.js';
import {CODEGEASS_PALETTES,codeGeassEnemyPixels} from '../src/codegeass-enemy-art.js';
import {CHARACTERS} from '../src/game.js';
import {createRun,spawnEnemy} from '../src/engine.js';
import {ENEMIES,BOSSES,MAP_ENEMIES,MAP_BOSSES,REGULAR_BOSS_IDS,updateEnemyAI} from '../src/enemies.js';
import {enemyPixels} from '../src/pixel-enemies.js';
import {BOSS_CINEMATICS} from '../src/boss-intro.js';
import {bossPhases} from '../src/boss-phase-guide.js';
import {ANIME_NAMES} from '../src/anime-enemies.js';

function run(){const g=createRun(CHARACTERS[0]);g.spawn=g.eliteAt=g.events.nextAt=g.rifts.nextAt=g.p.nextXp=g.invuln=1e9;g.p.weapons={};g.p.regen=g.p.dodge=0;g.lastMove={x:1,y:0};return g;}
function cast(id,skill=1,enraged=false){const g=run(),boss=!!BOSSES[id],e=spawnEnemy(g,boss,false,id);Object.assign(e,{x:-250,y:0,speed:0,attackCD:0,skill:skill-1,enraged});updateEnemyAI(g,e,.01);return{g,e};}
const geometry=h=>[h.shape,h.x,h.y,h.tx,h.ty,h.r,h.width,h.delay,h.duration];

test('five Code Geass enemies and three bosses join the game, led by the Tokyo Settlement',()=>{
 assert.equal(Object.keys(CODEGEASS_ENEMIES).length,5);assert.equal(Object.keys(CODEGEASS_BOSSES).length,3);assert.equal(ANIME_NAMES.codegeass,'Code Geass');
 for(const [id,def]of Object.entries(CODEGEASS_ENEMIES)){assert.strictEqual(ENEMIES[id],def);assert.ok(MAP_ENEMIES.tokyo.includes(id),id+' occupies Tokyo');const {g,e}=cast(id);assert.ok(e.expeditionAttack,id);assert.ok(g.hazards.length||g.enemyShots.length,id+' actually attacks');}
 for(const [id,def]of Object.entries(CODEGEASS_BOSSES)){assert.strictEqual(BOSSES[id],def);assert.ok(REGULAR_BOSS_IDS.includes(id));assert.ok(MAP_BOSSES.tokyo.includes(id));assert.ok(def.shiftName&&def.shiftRadius);assert.ok(BOSS_CINEMATICS[id]);assert.equal(bossPhases(id).length,2);}
 assert.equal(codeGeassAttack({},{archetype:'aura'},{},0,{}),false);
});
test('all nine boss patterns warn fixed, finite, source-owned positions and finish before the next cast',()=>{
 const styles=new Set();
 for(const id of Object.keys(CODEGEASS_BOSSES))for(const fierce of [false,true])for(let skill=1;skill<=3;skill++){
  const {g,e}=cast(id,skill,fierce),u=e.expeditionAttack;styles.add(u.style);assert.ok(u.marks.length);assert.equal(u.marks.length,g.hazards.length);assert.equal(g.enemyShots.length,0);
  assert.ok(g.hazards.every(h=>h.sourceClock&&h.cancelWithSource&&h.sourceId===e.id&&h.source===id&&h.delay>=1.1&&h.damage>=20&&h.damage<=35&&h.delay+h.duration<=u.duration&&h.delay+h.duration<e.attackCD),id+' '+u.style);
  for(const h of g.hazards)for(const key of ['x','y','tx','ty','r','width','delay','duration','damage'])if(h[key]!==undefined)assert.ok(Number.isFinite(h[key]),id+' '+key);
  const fixed=g.hazards.map(geometry);e.attackCD=999;g.p.x=-600;g.p.y=500;updateEnemyAI(g,e,.15);assert.deepEqual(g.hazards.map(geometry),fixed,'warnings do not track');
 }
 assert.equal(styles.size,9);
});
test('rings leave their escape side open',()=>{
 for(const [id,skill,label]of [['suzaku',3,'SLASH RING'],['charles',1,'ALL HAIL BRITANNIA']])for(const fierce of [false,true]){
  const {g,e}=cast(id,skill,fierce),gap=e.expeditionAttack.gapAngle,p={x:Math.cos(gap)*150,y:Math.sin(gap)*150};
  const ring=g.hazards.filter(h=>h.label.endsWith(label));assert.ok(ring.length>=5);assert.ok(ring.every(h=>Math.hypot(h.x-p.x,h.y-p.y)>h.r+10),id+' leaves an opening');
 }
});
test('sprites are complete native pixel art that animates and changes when enraged or attacking',()=>{
 for(const id of Object.keys(CODEGEASS_PALETTES)){
  const p=codeGeassEnemyPixels(id);assert.equal(p.length,56*76);assert.ok(p.filter(Boolean).length>350,id);assert.ok(p.every(c=>c===null||/^#[a-f0-9]{6}$/i.test(c)),id+' valid colours');assert.deepEqual(enemyPixels(id),p);
  assert.notDeepEqual(p,codeGeassEnemyPixels(id,{attack:true}),id+' attack pose');assert.notDeepEqual(p,codeGeassEnemyPixels(id,{leg:6,arm:6,tail:6}),id+' animates');
  if(BOSSES[id])assert.notDeepEqual(p,codeGeassEnemyPixels(id,{enraged:true}),id+' enraged form');
  assert.ok(new Set(p.filter(Boolean)).size>=12,id+' is shaded with a full palette');
 }
});
