import test from 'node:test';
import assert from 'node:assert/strict';
import {TOKYO_MAPS,TOKYO_WORLD_PALETTES,drawTokyoTerrain,drawTokyoProp,tokyoMapPreview} from '../src/tokyo-maps.js';
import {CHARACTERS,MAPS} from '../src/game.js';
import {createRun,createHardcoreRun,createBossRushRun,spawnEnemy} from '../src/engine.js';
import {ENEMIES,BOSSES,MAP_ENEMIES,MAP_BOSSES,featuredBosses,makeEnemy} from '../src/enemies.js';
import {MAP_SUPPLIES,SUPPLY_DEFS,supplyGeometry,drawMapSupply} from '../src/map-supplies.js';
import {ensureWorld,layoutProps,colliders,moveBody,onWater,damageProp} from '../src/world.js';
import {newProfile,sanitizeProfile} from '../src/progression.js';
import {saveRun,loadRun} from '../src/run-save.js';
const normalBossIds=Object.keys(BOSSES).filter(id=>!BOSSES[id].riftOnly&&!BOSSES[id].eventOnly);
const index=id=>MAPS.findIndex(map=>map.id===id);
function collector(){const ops=[],R=(...v)=>{assert.ok(v.slice(0,4).every(Number.isFinite));assert.match(v[4],/^#[0-9a-f]{6,8}$/i);ops.push(['r',...v]);},P=(points,color)=>{assert.ok(points.flat().every(Number.isFinite));assert.match(color,/^#[0-9a-f]{6,8}$/i);ops.push(['p',points,color]);};return{ops,R,P};}
const storage=()=>{const m=new Map();return{setItem:(k,v)=>m.set(k,v),getItem:k=>m.get(k)||null,removeItem:k=>m.delete(k)};};

test('Tokyo maps append after thirteen saved identities and have distinct deterministic city art',()=>{
 assert.deepEqual(MAPS.slice(0,13).map(m=>m.id),['garden','ruins','moon','labyrinth','marineford','citadel','castle','forest','zebes','shiganshina','leafvillage','tournament','tempest']);
 assert.deepEqual(MAPS.slice(13,15).map(m=>m.id),['tokyo','shibuya']);assert.equal(TOKYO_MAPS.length,2);
 const terrain=[],props=[],previews=[];
 for(const map of TOKYO_MAPS){assert.ok(map.name&&map.tag&&map.subtitle&&TOKYO_WORLD_PALETTES[map.id]);const a=collector(),b=collector();assert.ok(drawTokyoTerrain(map,0,0,a.R,a.P));assert.ok(drawTokyoTerrain(map,0,0,b.R,b.P));assert.deepEqual(a.ops,b.ops);assert.ok(a.ops.length>250,map.id+' street detail');terrain.push(JSON.stringify(a.ops));const p=collector();for(const kind of ['tree','rock','gate'])assert.ok(drawTokyoProp(map,kind,p.R,p.P,.82));assert.ok(p.ops.length>40);props.push(JSON.stringify(p.ops));const preview=tokyoMapPreview(map);assert.match(preview,/shape-rendering="crispEdges"/);assert.ok(!preview.includes('http'));previews.push(preview);}
 assert.equal(new Set(terrain).size,2);assert.equal(new Set(props).size,2);assert.equal(new Set(previews).size,2);assert.equal(drawTokyoTerrain(MAPS[0],0,0,()=>{},()=>{}),false);assert.equal(tokyoMapPreview(MAPS[0]),null);
});

test('city scenery keeps a clear crossing and dry, traversable urban streets',()=>{
 for(const map of TOKYO_MAPS){const g=createRun(CHARACTERS[0],index(map.id));ensureWorld(g);assert.deepEqual(layoutProps(map,-1000,-1000,2000,2000),layoutProps(map,-1000,-1000,2000,2000));assert.ok(g.world.active.some(o=>o.id==='fort:entrance'));g.world.circles=colliders(g);const body={x:0,y:0};moveBody(g,body,600,0,8);assert.ok(body.x>590,map.id+' central road');
  for(const y of [-900,0,155,400,850])assert.equal(onWater(map,650+Math.sin(y/400)*90,y,8),false,map.id+' no inherited river');const start=colliders(g).filter(c=>Math.hypot(c.x,c.y)<25);assert.equal(start.length,0);}
});

test('each city provides three original sized destructibles with real collision and one-time drops',()=>{
 const identities=[];for(const map of TOKYO_MAPS){const g=createRun(CHARACTERS[0],index(map.id));ensureWorld(g);const starter=g.world.active.filter(o=>o.id.startsWith('starter:'));assert.equal(starter.length,3);assert.deepEqual(starter.map(o=>o.type),MAP_SUPPLIES[map.id]);const art=[];
  for(const o of starter){identities.push(o.type);assert.ok(SUPPLY_DEFS[o.type]&&o.name);assert.ok(Number.isFinite(o.hp)&&o.hp>0);const geometry=supplyGeometry(o.type);assert.equal(o.r,geometry.radius);assert.equal(o.visualScale,geometry.scale);assert.ok(o.r>=10&&o.r<=25);assert.ok(colliders(g).some(c=>c.object===o&&c.r===o.r));const c=collector();assert.ok(drawMapSupply(o.type,c.R,c.P));assert.ok(c.ops.length>=7);assert.ok(new Set(c.ops.map(op=>op.at(-1))).size>=4);art.push(JSON.stringify(c.ops));}
  assert.equal(new Set(art).size,3);const [a,b]=starter;assert.ok(damageProp(g,a,9999,0,0,()=>.1));assert.equal(g.pickups.length,1);assert.equal(damageProp(g,a,9999),false);assert.ok(damageProp(g,b,9999,0,0,()=>.95));assert.equal(g.pickups.length,1);ensureWorld(g);assert.ok(!g.world.active.some(o=>o.id===a.id||o.id===b.id));}
 assert.equal(new Set(identities).size,6);
});

test('Shibuya has JJK curses, Tokyo has urban Stand threats, and both retain all regular bosses',()=>{
 for(const [id,first,next]of [['tokyo','dio','kira'],['shibuya','sukuna','mahito']]){const g=createRun(CHARACTERS[0],index(id));g.wave=20;assert.ok(featuredBosses(id).includes(first));assert.ok(featuredBosses(id).includes(next));assert.equal(new Set(MAP_BOSSES[id]).size,normalBossIds.length);for(const enemy of MAP_ENEMIES[id])assert.ok(ENEMIES[enemy]&&makeEnemy(g,enemy).hp>0);{const kinds=Array.from({length:200},()=>spawnEnemy(g).archetype);assert.ok(kinds.every(k=>ENEMIES[k]&&!BOSSES[k]));assert.ok(kinds.filter(k=>MAP_ENEMIES[id].includes(k)).length>110,'map enemies are favoured');}}
 assert.deepEqual(new Set(MAP_ENEMIES.shibuya.map(id=>ENEMIES[id].family)),new Set(['jjk','chainsawman']));for(const id of ['curse','cursedeye','flyhead','transfigured','jogo','hanami','dagon'])assert.ok(MAP_ENEMIES.shibuya.includes(id));for(const id of ['zombiedevil','leechfiend','batspawn','eternityflesh'])for(const city of ['tokyo','shibuya'])assert.ok(MAP_ENEMIES[city].includes(id));assert.ok(MAP_ENEMIES.tokyo.includes('badcompany')&&MAP_ENEMIES.tokyo.includes('highwaystar'));
});

test('Tokyo choices and destroyed city supplies restore in Survival, Hardcore and Boss Rush',()=>{
 for(const map of TOKYO_MAPS)for(const create of [createRun,createHardcoreRun,createBossRushRun]){const profile=newProfile();profile.selection.map=map.id;assert.equal(sanitizeProfile(profile).selection.map,map.id);const g=create(CHARACTERS[0],index(map.id),profile),store=storage();ensureWorld(g);const supply=g.world.active.find(o=>o.id==='starter:crate');assert.ok(damageProp(g,supply,9999,0,0,()=>.95));assert.ok(saveRun(g,store));const restored=loadRun(store);assert.ok(restored);assert.equal(restored.map.id,map.id);assert.equal(restored.mode,g.mode);assert.ok(restored.world.destroyed.has(supply.id));assert.ok(!restored.world.active.some(o=>o.id===supply.id));if(g.mode==='bossrush')assert.deepEqual(restored.rush.order,g.rush.order);}
});
