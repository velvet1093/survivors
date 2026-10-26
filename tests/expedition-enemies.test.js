import test from 'node:test';
import assert from 'node:assert/strict';
import {EXPEDITION_ENEMIES,EXPEDITION_BOSSES,EXPEDITION_RIFT_BOSSES,expeditionAttack} from '../src/expedition-enemies.js';
import {EXPEDITION_PALETTES,expeditionEnemyPixels} from '../src/expedition-enemy-art.js';
import {drawExpeditionAttack} from '../src/expedition-attack-art.js';
import {CHARACTERS} from '../src/game.js';
import {createRun,spawnEnemy,updateRun} from '../src/engine.js';
import {ENEMIES,BOSSES,MAP_ENEMIES,MAP_BOSSES,REGULAR_BOSS_IDS,featuredBosses,updateEnemyAI} from '../src/enemies.js';
import {enemyPixels} from '../src/pixel-enemies.js';
import {RIFT_ENCOUNTERS} from '../src/rift-encounters.js';
import {RIFT_TRIALS,beginRiftTrial,updateRiftTrial,riftTrialText,restoreRiftTrial} from '../src/rift-trials.js';
import {createRiftArena} from '../src/rift-arena.js';
import {BOSS_CINEMATICS} from '../src/boss-intro.js';
import {bossPhases} from '../src/boss-phase-guide.js';
import {ANIME_NAMES} from '../src/anime-enemies.js';

function run(){const g=createRun(CHARACTERS[0]);g.spawn=g.eliteAt=g.events.nextAt=g.rifts.nextAt=g.p.nextXp=g.invuln=1e9;g.p.weapons={};g.p.regen=g.p.dodge=0;g.lastMove={x:1,y:0};return g;}
function cast(id,skill=1,enraged=false){const g=run(),boss=!!BOSSES[id],e=spawnEnemy(g,boss,false,id);Object.assign(e,{x:-250,y:0,speed:0,attackCD:0,skill:skill-1,enraged});updateEnemyAI(g,e,.01);return{g,e};}
const geometry=h=>[h.shape,h.x,h.y,h.tx,h.ty,h.r,h.width,h.delay,h.duration];
const canvas=()=>{let depth=0;const calls=[];return {calls,depth:()=>depth,c:new Proxy({},{get:(_,k)=>k==='save'?()=>{depth++;calls.push(k);}:k==='restore'?()=>{depth--;calls.push(k);}:typeof k==='string'?(...a)=>calls.push(k):undefined,set:()=>true})};};

test('six expedition enemies, three bosses and two rift bosses join the game without replacing existing rotations',()=>{
 assert.equal(Object.keys(EXPEDITION_ENEMIES).length,6);assert.equal(Object.keys(EXPEDITION_BOSSES).length,3);assert.equal(Object.keys(EXPEDITION_RIFT_BOSSES).length,2);
 assert.equal(ANIME_NAMES.fairytail,'Fairy Tail');assert.ok(ANIME_NAMES.tensura.includes('Slime'));
 for(const [id,def]of Object.entries(EXPEDITION_ENEMIES)){assert.strictEqual(ENEMIES[id],def);assert.ok(Object.values(MAP_ENEMIES).some(pool=>pool.includes(id)),id+' spawns somewhere');const {g,e}=cast(id);assert.ok(e.expeditionAttack,id);assert.ok(g.hazards.length||g.enemyShots.length,id+' actually attacks');}
 for(const [id,def]of Object.entries(EXPEDITION_BOSSES)){assert.strictEqual(BOSSES[id],def);assert.ok(REGULAR_BOSS_IDS.includes(id));assert.ok(def.shiftName&&def.shiftRadius);assert.ok(BOSS_CINEMATICS[id]);assert.equal(bossPhases(id).length,2);}
 for(const id of Object.keys(EXPEDITION_RIFT_BOSSES)){assert.ok(BOSSES[id].riftOnly);assert.ok(!REGULAR_BOSS_IDS.includes(id));assert.ok(RIFT_ENCOUNTERS.some(r=>r.id===id));assert.ok(RIFT_TRIALS[id]);assert.ok(createRiftArena(id));assert.ok(BOSS_CINEMATICS[id]);for(const pool of Object.values(MAP_BOSSES))assert.ok(!pool.includes(id));}
 // Openings that players already know stay first; the new bosses join from wave 15.
 assert.ok(featuredBosses('garden').includes('aura'));assert.ok(featuredBosses('tempest').includes('kars'));assert.ok(featuredBosses('tempest').includes('geld'));assert.ok(featuredBosses('castle').includes('jellal'));assert.ok(featuredBosses('forest').includes('kokushibo'));
 assert.equal(expeditionAttack({},{archetype:'aura'},{},0,{}),false);
});

test('all nine expedition boss patterns warn fixed, finite, source-owned positions and finish before the next cast',()=>{
 const styles=new Set();
 for(const id of Object.keys(EXPEDITION_BOSSES))for(const fierce of [false,true])for(let skill=1;skill<=3;skill++){
  const {g,e}=cast(id,skill,fierce),u=e.expeditionAttack;styles.add(u.style);assert.ok(u.marks.length);assert.equal(u.marks.length,g.hazards.length);assert.equal(g.enemyShots.length,0);
  assert.ok(g.hazards.every(h=>h.sourceClock&&h.cancelWithSource&&h.sourceId===e.id&&h.source===id&&h.delay>=1.1&&h.damage>=20&&h.damage<=35&&h.delay+h.duration<=u.duration&&h.delay+h.duration<e.attackCD),id+' '+u.style);
  for(const h of g.hazards)for(const key of ['x','y','tx','ty','r','width','delay','duration','damage'])if(h[key]!==undefined)assert.ok(Number.isFinite(h[key]),id+' '+key);
  const fixed=g.hazards.map(geometry);e.attackCD=999;g.p.x=-600;g.p.y=500;updateEnemyAI(g,e,.15);assert.deepEqual(g.hazards.map(geometry),fixed,'warnings do not track');
 }
 assert.equal(styles.size,9);
});

test('rift bosses keep an open side in their rings and appear in the rift rotation',()=>{
 for(const fierce of [false,true]){
  const {g,e}=cast('acnologia',2,fierce),u=e.riftAttack,ring=g.hazards.filter(h=>h.label.includes('CRATER'));
  assert.equal(u.style,'apocalypsewing');const gap=u.gapAngle,p={x:Math.cos(gap)*200,y:Math.sin(gap)*200};
  assert.ok(ring.every(h=>Math.hypot(h.x-p.x,h.y-p.y)>h.r+12),'the escape side stays open');
  const nova=cast('milim',1,fierce).g.hazards;assert.ok(nova.some(h=>h.label==='MILIM · DRAGO NOVA'));
 }
 const ids=RIFT_ENCOUNTERS.map(r=>r.id);assert.deepEqual(ids.slice(-2),['acnologia','milim']);
});

test('new sprites are complete native pixel art that animates and changes when enraged or attacking',()=>{
 for(const id of Object.keys(EXPEDITION_PALETTES)){
  const p=expeditionEnemyPixels(id);assert.equal(p.length,56*76);assert.ok(p.filter(Boolean).length>350,id);assert.ok(p.every(c=>c===null||/^#[a-f0-9]{6}$/i.test(c)),id+' valid colours');assert.deepEqual(enemyPixels(id),p);
  assert.notDeepEqual(p,expeditionEnemyPixels(id,{attack:true}),id+' attack pose');assert.notDeepEqual(p,expeditionEnemyPixels(id,{leg:6,arm:6,tail:6}),id+' animates');
  if(BOSSES[id])assert.notDeepEqual(p,expeditionEnemyPixels(id,{enraged:true}),id+' enraged form');
 }
});

test('expedition attack flourishes read saved marks only and keep the canvas balanced',()=>{
 for(const id of [...Object.keys(EXPEDITION_ENEMIES),...Object.keys(EXPEDITION_BOSSES)])for(let skill=1;skill<=3;skill++){
  const {e}=cast(id,skill,skill===3),before=JSON.stringify(e),{c,calls,depth}=canvas();
  assert.equal(drawExpeditionAttack(c,e,skill===2),true,id);assert.equal(depth(),0);assert.equal(JSON.stringify(e),before);assert.ok(calls.length<1500);
 }
});

function trialRun(id){
 const g=run();g.rifts.active={bossId:id,serial:1,startedAt:0,bossEntityId:null,rewarded:false};g.riftArena=createRiftArena(id);
 const e=spawnEnemy(g,true,false,id);Object.assign(e,{x:0,y:-300,riftBoss:true,hp:e.maxHp*.5,attackCD:999,speed:0});g.rifts.active.bossEntityId=e.id;g.enemies=[e];g.p.x=0;g.p.y=140;
 assert.ok(beginRiftTrial(g,e),id);return {g,e,q:g.riftTrial};
}
test('Catch the Dragon Lacrima and Keep Up with Milim are distinct, completable and survive restores',()=>{
 {const {g,e,q}=trialRun('acnologia');assert.equal(q.kind,'orbit');const start=q.goals.map(v=>[v.x,v.y]);updateRiftTrial(g,1,{hitPlayer:()=>{}});assert.notDeepEqual(q.goals.map(v=>[v.x,v.y]),start,'crystals ride the storm');
  assert.ok(restoreRiftTrial(g));for(let i=0;i<3&&g.riftTrial;i++){const v=q.goals.find(v=>!v.done);g.p.x=v.x;g.p.y=v.y;updateRiftTrial(g,.02,{hitPlayer:()=>{}});}assert.equal(g.riftTrial,null);assert.equal(e.enraged,true);}
 {const {g,e,q}=trialRun('milim');assert.equal(q.kind,'tag');assert.ok(riftTrialText(g).detail.includes('Milim'));
  // Standing still lets the afterimage get away and its ring drains.
  updateRiftTrial(g,4,{hitPlayer:()=>{}});assert.equal(q.progress,0);
  for(let k=0;k<200&&g.riftTrial;k++){const v=q.goals[q.stage];g.p.x=v.x;g.p.y=v.y;updateRiftTrial(g,.05,{hitPlayer:()=>{}});if(k===20&&g.riftTrial)assert.ok(restoreRiftTrial(g));}
  assert.equal(g.riftTrial,null);assert.equal(e.enraged,true);}
});
