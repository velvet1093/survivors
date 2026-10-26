import test from 'node:test';
import assert from 'node:assert/strict';
import {CHARACTERS} from '../src/game.js';
import {createRun,spawnEnemy,resolveRift,updateRun} from '../src/engine.js';
import {riftSuperbossAttack,clearOrphanRiftSummons} from '../src/rift-superbosses.js';
import {RIFT_MINIONS,riftAttack} from '../src/rift-enemies.js';
import {finishBossIntro} from '../src/boss-intro.js';
import {saveRun,loadRun} from '../src/run-save.js';

const hero=CHARACTERS.find(c=>c.id==='goku');
function run(){const g=createRun(hero);g.spawn=g.eliteAt=99999;g.p.nextXp=g.invuln=99999;g.p.weapons={};return g;}
function launch(g,e){
 return riftSuperbossAttack(g,e,g.p,0,{
  hazard:(g,h)=>g.hazards.push(h),
  summon:(g,parent,id,count)=>{for(let i=0;i<count;i++){const s=spawnEnemy(g,false,false,id);s.ownerId=parent.id;}},
 });
}
const colossals=g=>g.enemies.filter(e=>e.archetype==='rumblingcolossal'&&e.hp>0);
const storage=()=>({data:new Map(),getItem(k){return this.data.get(k)||null;},setItem(k,v){this.data.set(k,v);},removeItem(k){this.data.delete(k);}});

test('Founding Eren summons real living Colossals, caps their number and replenishes only missing slots',()=>{
 const g=run(),e=spawnEnemy(g,true,false,'foundereren');e.riftBoss=true;e.riftSerial=7;e.skill=1;
 launch(g,e);assert.equal(colossals(g).length,2);
 const original=colossals(g).map(s=>s.id);
 for(const s of colossals(g)){assert.equal(s.boss,false);assert.equal(s.ownerId,e.id);assert.equal(s.riftSummon,true);assert.equal(s.riftSerial,7);assert.equal(s.spriteId,'bertholdt');assert.ok(s.hp>300);assert.ok(Math.hypot(s.x-g.p.x,s.y-g.p.y)>250);assert.ok(s.attackCD>=2);}
 launch(g,e);assert.deepEqual(colossals(g).map(s=>s.id),original);
 e.skill=3;launch(g,e);assert.equal(colossals(g).length,2);
 colossals(g)[0].hp=0;launch(g,e);assert.equal(colossals(g).length,2);assert.equal(colossals(g).filter(s=>original.includes(s.id)).length,1);
 assert.equal(new Set(colossals(g).map(s=>s.riftColossalSlot)).size,2);assert.ok(Math.hypot(colossals(g)[0].x-colossals(g)[1].x,colossals(g)[0].y-colossals(g)[1].y)>100);
 e.enraged=true;launch(g,e);assert.equal(colossals(g).length,3);launch(g,e);assert.equal(colossals(g).length,3);
 assert.ok(colossals(g).every(s=>s.archetype==='rumblingcolossal'&&!s.boss));
});

test('Colossal spawn points stay inside the arena and away from a player at its edge',()=>{
 const g=run();g.riftArena={radius:760};g.p.x=0;g.p.y=-740;
 const e=spawnEnemy(g,true,false,'foundereren');e.skill=1;e.enraged=true;launch(g,e);
 assert.equal(colossals(g).length,3);
 for(const s of colossals(g)){assert.ok(Math.abs(s.x)<=760-s.r&&Math.abs(s.y)<=760-s.r);assert.ok(Math.hypot(s.x-g.p.x,s.y-g.p.y)>200);}
});

test('Colossals alternate warned stomps and steam without summoning more enemies',()=>{
 const g=run(),s={...RIFT_MINIONS.rumblingcolossal,id:77,x:100,y:100,archetype:'rumblingcolossal',skill:1},p={x:0,y:0};
 const api={hazard:(g,h)=>g.hazards.push(h),summon:()=>assert.fail('Colossals cannot summon adds')};
 assert.ok(riftAttack(g,s,p,0,api));assert.equal(g.hazards[0].label,'COLOSSAL STOMP · MOVE OUT');assert.equal(g.hazards[0].delay,1.5);assert.equal(g.hazards[0].x,0);
 s.skill=2;riftAttack(g,s,p,0,api);assert.equal(g.hazards[1].label,'COLOSSAL · SCALDING STEAM');assert.equal(g.hazards[1].x,s.x);assert.equal(g.hazards[1].delay,1.7);
 assert.ok(g.hazards.every(h=>h.cancelWithSource&&h.sourceId===s.id));
 s.x=700;s.y=700;s.skill=3;riftAttack(g,s,p,0,api);assert.equal(g.hazards.length,2,'a distant Colossal must walk into reach before stomping');
});

test('orphaned Colossals and their attacks disappear with the founder without touching unrelated enemies',()=>{
 const g=run(),e=spawnEnemy(g,true,false,'foundereren');e.skill=1;launch(g,e);
 const normal=spawnEnemy(g,false,false,'soldier'),add=colossals(g)[0];
 g.enemyShots=[{sourceId:add.id},{sourceId:normal.id}];g.hazards=[{sourceId:add.id},{sourceId:normal.id}];
 assert.equal(clearOrphanRiftSummons(g),0);e.hp=0;
 assert.equal(clearOrphanRiftSummons(g),2);assert.equal(colossals(g).length,0);assert.ok(g.enemies.includes(normal));assert.ok(g.enemies.includes(e));
 assert.deepEqual(g.enemyShots,[{sourceId:normal.id}]);assert.deepEqual(g.hazards,[{sourceId:normal.id}]);
 assert.equal(clearOrphanRiftSummons(g),0);
});

test('summoned Colossals save their health and ownership and cannot escape into the restored map',()=>{
 const g=run(),store=storage(),regular=spawnEnemy(g,false,false,'soldier');regular.x=420;regular.y=200;
 g.rifts.portal={bossId:'foundereren',x:0,y:0,age:0,serial:1};g.rifts.opened=1;g.status='rift';assert.ok(resolveRift(g,true));finishBossIntro(g);
 const e=g.enemies.find(s=>s.riftBoss);e.skill=1;launch(g,e);colossals(g)[0].hp-=100;
 const before=colossals(g).map(s=>({id:s.id,hp:s.hp,ownerId:s.ownerId}));assert.ok(saveRun(g,store));const restored=loadRun(store);
 assert.deepEqual(colossals(restored).map(s=>({id:s.id,hp:s.hp,ownerId:s.ownerId})),before);
 restored.status='playing';const founder=restored.enemies.find(s=>s.riftBoss);founder.enraged=true;founder.hp=0;restored.p.reducedMotion=true;
 for(let i=0;i<15;i++)updateRun(restored,.1);
 assert.equal(colossals(restored).length,0);assert.equal(restored.riftArena,null);assert.equal(restored.rifts.cleared,1);assert.ok(restored.enemies.some(s=>s.id===regular.id));
});
