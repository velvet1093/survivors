import test from 'node:test';
import assert from 'node:assert/strict';
import {GRAVEYARD_EVENTS,GRAVEYARD_EVENT_BOSSES,GRAVEYARD_EVENT_ENEMIES,GRAVEYARD_TRIGGER_ITEMS,graveyardEventAttack} from '../src/graveyard-events.js';
import {CHARACTERS} from '../src/game.js';
import {createRun,spawnEnemy,updateRun} from '../src/engine.js';
import {BOSSES,ENEMIES,REGULAR_BOSS_IDS,MAP_BOSSES,MAP_ENEMIES,updateEnemyAI} from '../src/enemies.js';
import {WORLD_EVENTS,updateWorldEventCast} from '../src/world-event-data.js';
import {saveRun,loadRun} from '../src/run-save.js';
import {applyStatus} from '../src/status.js';
import {segmentDistance,PLAYER_RADIUS} from '../src/world.js';

function fixture(id,skill=1,enraged=false){
 const g={lastMove:{x:1,y:0},hazards:[]},e={...GRAVEYARD_EVENT_BOSSES[id],id:7,archetype:id,boss:true,x:-240,y:-30,hp:100,skill,enraged,attackCD:0},p={x:0,y:0};
 assert.equal(graveyardEventAttack(g,e,p,.6,{hazard:(g,h)=>g.hazards.push(structuredClone(h))}),true);return{g,e,p};
}
const covers=(h,x,y)=>h.shape==='line'?segmentDistance(x,y,h.x,h.y,h.tx,h.ty)<h.width+PLAYER_RADIUS:Math.hypot(x-h.x,y-h.y)<h.r+PLAYER_RADIUS;
const memory=()=>({data:new Map(),getItem(k){return this.data.get(k)},setItem(k,v){this.data.set(k,v)},removeItem(k){this.data.delete(k)}});
function live(id,skill=1,enraged=false){const g=createRun(CHARACTERS[0],3);g.spawn=g.eliteAt=g.p.nextXp=g.events.nextAt=g.rifts.nextAt=1e9;g.p.weapons={};g.p.dodge=g.p.regen=0;g.p.shield=0;g.invuln=1e9;const e=spawnEnemy(g,true,false,id);Object.assign(e,{x:-240,y:-30,speed:0,attackCD:0,skill:skill-1,enraged});updateEnemyAI(g,e,.01);e.attackCD=999;return{g,e};}
const sim=(g,t)=>{for(let elapsed=0;elapsed<t-1e-8;elapsed+=.02)updateRun(g,Math.min(.02,t-elapsed));};

test('graveyard visitations bind their themed rosters, trigger items and exclusive boss identities',()=>{
 assert.deepEqual(GRAVEYARD_EVENTS.map(e=>e.id),['ghostparade','tombwake']);assert.deepEqual(GRAVEYARD_EVENTS.map(e=>e.bossId),['peronaparade','ainztomb']);
 for(const def of GRAVEYARD_EVENTS){assert.deepEqual(def.mapIds,['graveyard']);assert.equal(def.enemies,def.enemyIds);assert.ok(def.enemies.length===4);assert.ok(WORLD_EVENTS.some(e=>e.id===def.id));const item=GRAVEYARD_TRIGGER_ITEMS.find(i=>i.id===def.triggerId);assert.equal(item.eventId,def.id);assert.equal(item.category,'event');assert.equal(item.consumable,true);assert.ok(item.description.includes('consumed only'));for(const id of def.enemies)assert.ok(ENEMIES[id],id);}
 for(const [id,e]of Object.entries(GRAVEYARD_EVENT_BOSSES)){assert.equal(BOSSES[id].eventOnly,true);assert.equal(e.riftOnly,undefined);assert.ok(!REGULAR_BOSS_IDS.includes(id));assert.ok(Object.values(MAP_BOSSES).every(pool=>!pool.includes(id)));}
 for(const id of Object.keys(GRAVEYARD_EVENT_ENEMIES))assert.ok(Object.values(MAP_ENEMIES).every(pool=>!pool.includes(id)));
});

test('all six event signatures have fixed saved geometry, bounded density and complete source-owned warning clocks in both phases',()=>{
 const styles=new Set();for(const id of Object.keys(GRAVEYARD_EVENT_BOSSES))for(const fierce of [false,true])for(let skill=1;skill<=3;skill++){
  const {g,e,p}=fixture(id,skill,fierce),u=e.worldEventAttack;styles.add(u.style);assert.ok(u.name);assert.equal(u.age,0);assert.equal(u.version,1);assert.deepEqual(u.target,{x:0,y:0});assert.ok(u.marks.length>0&&u.marks.length<=10);assert.equal(u.marks.length,g.hazards.length);assert.equal(e.windup,u.duration);assert.ok(e.attackCD>=u.duration+.79);
  for(const h of u.marks){assert.equal(h.sourceId,e.id);assert.equal(h.source,id);assert.equal(h.cancelWithSource,true);assert.equal(h.sourceClock,true);assert.ok(h.delay>=1.2);assert.ok(h.damage>=22&&h.damage<=34);assert.ok(h.delay+h.duration<=u.duration);for(const key of ['x','y','tx','ty','r','width','delay','duration','damage'])if(h[key]!==undefined)assert.ok(Number.isFinite(h[key]),key);}
  const marks=structuredClone(u.marks);p.x=850;p.y=-640;e.x=530;e.y=200;updateWorldEventCast(e,.2);assert.deepEqual(u.marks,marks,'a released warning cannot track later positions');assert.ok(Math.abs(u.age-.2)<1e-9);updateWorldEventCast(e,1,true);assert.ok(Math.abs(u.age-.2)<1e-9,'frozen cast does not advance');
 }
 assert.equal(styles.size,6);
});

test('Perona’s procession and hollow halo leave real escape space and a separately warned final center',()=>{
 for(const fierce of [false,true]){
  const procession=fixture('peronaparade',1,fierce),marks=procession.e.worldEventAttack.marks,rows=marks.slice(0,-1),core=marks.at(-1);assert.equal(rows.length,fierce?8:6);assert.ok(rows.every(h=>!covers(h,0,0)),'the first procession leaves its central corridor');assert.ok(covers(core,0,0));assert.ok(core.delay>Math.max(...rows.map(h=>h.delay+h.duration)));
  const halo=fixture('peronaparade',2,fierce);assert.equal(halo.e.worldEventAttack.marks.length,fierce?8:6);assert.ok(halo.e.worldEventAttack.marks.every(h=>!covers(h,350,0)),'the movement-facing halo wedge remains traversable');
  const hex=fixture('peronaparade',3,fierce),opening=hex.e.worldEventAttack.angle+.3;assert.equal(hex.e.worldEventAttack.marks.filter(h=>h.shape==='line').length,fierce?3:2);assert.ok(hex.e.worldEventAttack.marks.every(h=>!covers(h,Math.cos(opening)*350,Math.sin(opening)*350)),'the crossed hex still has space between its fixed lanes');
 }
});

test('Ainz’s cage doorway and Fallen Down halo remain open while Grasp Heart advances in a fixed procession',()=>{
 for(const fierce of [false,true]){
  const prison=fixture('ainztomb',1,fierce),u=prison.e.worldEventAttack;assert.equal(u.marks.filter(h=>h.shape==='line').length,5);assert.ok(u.marks.every(h=>!covers(h,350,0)),'the cage doorway faces the escape direction');assert.ok(covers(u.marks.at(-1),0,0));assert.ok(u.marks.at(-1).delay>Math.max(...u.marks.slice(0,-1).map(h=>h.delay+h.duration)));
  const hearts=fixture('ainztomb',2,fierce).e.worldEventAttack.marks;assert.equal(hearts.length,fierce?5:3);for(let i=0;i<hearts.length;i++){assert.equal(hearts[i].x,i*115);assert.equal(hearts[i].y,0);if(i)assert.ok(hearts[i].delay>hearts[i-1].delay);}
  const light=fixture('ainztomb',3,fierce).e.worldEventAttack.marks;assert.equal(light.length,fierce?9:7);assert.ok(light.every(h=>!covers(h,350,0)),'the light pillar and broken halo have a shared exit');assert.ok(light[0].delay+light[0].duration<light[1].delay);
 }
});

test('event servants use actual warned attacks and unknown enemies are left untouched',()=>{
 for(const [id,def]of Object.entries(GRAVEYARD_EVENT_ENEMIES)){const g={hazards:[]},e={...def,archetype:id,id:5,x:0,y:0,boss:false};assert.equal(graveyardEventAttack(g,e,{x:100,y:0},0,{hazard:(g,h)=>g.hazards.push(h)}),true);assert.equal(g.hazards.length,1);assert.ok(g.hazards[0].delay>=1.2);assert.equal(g.hazards[0].sourceId,5);assert.equal(g.hazards[0].cancelWithSource,true);}
 const g={},e={archetype:'soldier'};assert.equal(graveyardEventAttack(g,e,{},0,{}),false);assert.deepEqual(e,{archetype:'soldier'});assert.deepEqual(g,{});
});

test('actual event AI preserves casting poses, saved marks and time-stop clocks',()=>{
 for(const id of Object.keys(GRAVEYARD_EVENT_BOSSES)){
  const {g,e}=live(id,2);assert.ok(e.worldEventAttack);sim(g,.2);const age=e.worldEventAttack.age,warning=g.hazards[0].age,marks=structuredClone(e.worldEventAttack.marks),position=[e.x,e.y],store=memory();assert.ok(saveRun(g,store));const loaded=loadRun(store);assert.ok(loaded);assert.equal(loaded.status,'paused');const boss=loaded.enemies.find(v=>v.id===e.id);assert.deepEqual(boss.worldEventAttack,e.worldEventAttack);loaded.status='playing';applyStatus(boss,'stun',2);sim(loaded,.2);assert.equal(boss.worldEventAttack.age,age);assert.equal(loaded.hazards[0].age,warning);boss.statuses={};loaded.freeze=5;loaded.voidRadius=1000;sim(loaded,.1);assert.equal(boss.worldEventAttack.age,age);assert.equal(loaded.hazards[0].age,warning);assert.deepEqual([boss.x,boss.y],position);assert.deepEqual(boss.worldEventAttack.marks,marks);
  loaded.freeze=0;loaded.ultimate={type:'kurumi',x:boss.x,y:boss.y,r:1000,age:0,duration:10,shadows:[],slowCD:999};sim(loaded,.1);assert.ok(Math.abs(boss.worldEventAttack.age-age-.07)<1e-8);assert.ok(Math.abs(loaded.hazards[0].age-warning-.07)<1e-8);assert.deepEqual(boss.worldEventAttack.marks,marks);
 }
});

test('Grasp Heart delays real damage and permits moving away from its locked marks',()=>{
 for(const evade of [false,true]){const {g,e}=live('ainztomb',2);g.invuln=0;const hp=g.p.hp;sim(g,1.3);assert.equal(g.p.hp,hp);if(evade){g.p.x=0;g.p.y=250;}sim(g,.35);assert.equal(g.p.hp<hp,!evade);assert.ok(e.hp>0);}
});
