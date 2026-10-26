import test from 'node:test';import assert from 'node:assert/strict';
import {NEW_ANIME_MAPS,ANIME_WORLD_PALETTES,drawAnimeTerrain,drawAnimeProp,animeMapPreview} from '../src/anime-maps.js';
import {CHARACTERS,MAPS} from '../src/game.js';import {createRun,spawnEnemy} from '../src/engine.js';
import {MAP_ENEMIES,MAP_BOSSES,BOSSES,ENEMIES,bossForWave,makeEnemy} from '../src/enemies.js';
import {MAP_SUPPLIES,SUPPLY_DEFS,supplyGeometry,drawMapSupply} from '../src/map-supplies.js';
import {layoutProps,ensureWorld,onWater,moveBody,colliders,damageProp} from '../src/world.js';
import {newProfile,sanitizeProfile} from '../src/progression.js';import {saveRun,loadRun} from '../src/run-save.js';
const normalBossIds=Object.keys(BOSSES).filter(id=>!BOSSES[id].riftOnly&&!BOSSES[id].eventOnly);
const storage=()=>({values:new Map(),setItem(k,v){this.values.set(k,v)},getItem(k){return this.values.get(k)}});
function run(map){const g=createRun(CHARACTERS[0],MAPS.findIndex(m=>m.id===map.id));g.map=map;g.spawn=g.eliteAt=g.nextBossWave=1e6;g.p.cooldowns.ki=999;g.p.nextXp=1e6;ensureWorld(g);return g;}
function collector(){const ops=[],R=(...values)=>{assert.ok(values.slice(0,4).every(Number.isFinite));assert.match(values[4],/^#[0-9a-f]{6,8}$/i);ops.push(['r',...values]);},P=(points,color)=>{assert.ok(points.flat().every(Number.isFinite));assert.match(color,/^#[0-9a-f]{6,8}$/i);ops.push(['p',points,color]);};return {ops,R,P};}
test('anime maps append after the original ten identities and have distinct pixel scenes and menu previews',()=>{
 assert.deepEqual(MAPS.slice(0,10).map(m=>m.id),['garden','ruins','moon','labyrinth','marineford','citadel','castle','forest','zebes','shiganshina']);const scenes=[],props=[],previews=[];
 for(const map of NEW_ANIME_MAPS){assert.ok(MAPS.findIndex(m=>m.id===map.id)>=10);assert.ok(map.subtitle&&map.tag&&map.color);assert.ok(ANIME_WORLD_PALETTES[map.id]);const a=collector(),b=collector();assert.ok(drawAnimeTerrain(map,0,0,a.R,a.P));assert.ok(drawAnimeTerrain(map,0,0,b.R,b.P));assert.deepEqual(a.ops,b.ops);assert.ok(a.ops.length>600);scenes.push(JSON.stringify(a.ops));const prop=collector();for(const type of ['tree','rock','gate'])assert.ok(drawAnimeProp(map,type,prop.R,prop.P));props.push(JSON.stringify(prop.ops));const preview=animeMapPreview(map);assert.ok(preview.includes('shape-rendering="crispEdges"'));previews.push(preview);}
 assert.equal(new Set(scenes).size,3);assert.equal(new Set(props).size,3);assert.equal(new Set(previews).size,3);
});
test('each new map has three unique sized supplies with real colliders and probabilistic single-use drops',()=>{
 const ids=[];for(const map of NEW_ANIME_MAPS){const g=run(map),starter=g.world.active.filter(o=>o.id.startsWith('starter:'));assert.equal(starter.length,3);assert.deepEqual(starter.map(o=>o.type),MAP_SUPPLIES[map.id]);ids.push(...MAP_SUPPLIES[map.id]);for(const o of starter){assert.ok(o.name&&SUPPLY_DEFS[o.type]);assert.ok(Number.isFinite(o.hp)&&o.hp>0);const geo=supplyGeometry(o.type);assert.equal(o.r,geo.radius);assert.equal(o.visualScale,geo.scale);assert.ok(geo.radius>=10&&geo.radius<=25);const art=collector();assert.ok(drawMapSupply(o.type,art.R,art.P));assert.ok(art.ops.length>=5);assert.ok(new Set(art.ops.map(op=>op.at(-1))).size>=3);g.world.circles=colliders(g);assert.ok(g.world.circles.some(c=>c.object===o&&c.r===geo.radius));}
 const [a,b]=starter;damageProp(g,a,10000,0,0,()=>.95);assert.equal(g.pickups.length,0);assert.equal(damageProp(g,a,10000),false);damageProp(g,b,10000,0,0,()=>.1);assert.equal(g.pickups.length,1);ensureWorld(g);assert.ok(!g.world.active.some(o=>o.id===a.id||o.id===b.id));assert.equal(g.broken,2);assert.ok(g.world.debris.length>0);}
 assert.equal(new Set(ids).size,9);
});
test('new maps preserve clear starts, deterministic landmarks and matching river or arena physics',()=>{
 for(const map of NEW_ANIME_MAPS){const g=run(map);assert.deepEqual(layoutProps(map,-600,-600,1200,1200),layoutProps(map,-600,-600,1200,1200));const body={x:0,y:0};g.world.circles=colliders(g);moveBody(g,body,45,0,8);assert.ok(body.x>40);assert.ok(g.world.active.some(o=>o.id==='fort:entrance'));
 if(map.id==='tournament'){for(const y of [-800,0,150,400,800])assert.equal(onWater(map,650+Math.sin(y/400)*90,y,8),false);g.world.active=[];g.world.circles=[];const crossing={x:530,y:0};moveBody(g,crossing,240,0,8);assert.ok(crossing.x>760);}else{assert.equal(onWater(map,650,0,8),true);assert.equal(onWater(map,650+Math.sin(1)*90,400,8),false);}}
});
test('Leaf, Tournament and Tempest use thematic encounter pools and keep full rotating boss access',()=>{
 for(const [id,opening,next]of [['leafvillage','orochimaru','itachi'],['tournament','frieza','cell'],['tempest','kars','aura']]){assert.equal(bossForWave(id,5),opening);assert.equal(bossForWave(id,10),next);const map=NEW_ANIME_MAPS.find(m=>m.id===id),g=run(map);g.wave=4;for(const type of MAP_ENEMIES[id]){assert.ok(ENEMIES[type]);assert.ok(makeEnemy(g,type).hp>0);}for(let i=0;i<30;i++)assert.ok(MAP_ENEMIES[id].includes(spawnEnemy(g).archetype));assert.equal(new Set(MAP_BOSSES[id]).size,normalBossIds.length);}
 assert.ok(MAP_ENEMIES.leafvillage.every(id=>ENEMIES[id].family==='naruto'||id==='spiderdemon'));assert.ok(MAP_ENEMIES.tournament.includes('celljunior'));
});
test('new map choice, destroyed scenery and current procedural world restore from saves',()=>{
 for(const map of NEW_ANIME_MAPS){const profile=newProfile();profile.selection.map=map.id;assert.equal(sanitizeProfile(profile).selection.map,map.id);const g=run(map),s=storage(),o=g.world.active.find(o=>o.id==='starter:crate');damageProp(g,o,10000,0,0,()=>.95);assert.ok(saveRun(g,s));const restored=loadRun(s);assert.equal(restored.map.id,map.id);assert.equal(restored.status,'paused');assert.ok(restored.world.destroyed.has(o.id));assert.ok(!restored.world.active.some(p=>p.id===o.id));}
});
