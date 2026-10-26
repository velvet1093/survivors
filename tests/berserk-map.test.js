import test from 'node:test';
import assert from 'node:assert/strict';
import {BERSERK_MAP,BERSERK_WORLD_PALETTES,drawBerserkTerrain,drawBerserkProp,berserkMapPreview} from '../src/berserk-map.js';
import {CHARACTERS,MAPS} from '../src/game.js';
import {createRun} from '../src/engine.js';
import {layoutProps,ensureWorld,colliders,onWater,moveBody,damageProp} from '../src/world.js';
import {MAP_SUPPLIES,SUPPLY_DEFS,supplyGeometry,drawMapSupply} from '../src/map-supplies.js';
import {saveRun,loadRun} from '../src/run-save.js';
const collector=()=>{const ops=[],R=(...args)=>{assert.ok(args.slice(0,4).every(Number.isFinite));assert.match(args[4],/^#[0-9a-f]{6,8}$/i);ops.push(['r',...args]);},P=(points,color)=>{assert.ok(points.flat().every(Number.isFinite));assert.match(color,/^#[0-9a-f]{6,8}$/i);ops.push(['p',points,color]);};return{ops,R,P};};
function run(){const g=createRun(CHARACTERS[0],MAPS.findIndex(m=>m.id==='eclipse'));ensureWorld(g);return g;}

test('Eclipse has original deterministic dry ritual terrain, fossil props and an eclipsed-sky preview',()=>{
 assert.equal(BERSERK_MAP.id,'eclipse');assert.ok(BERSERK_WORLD_PALETTES.eclipse);
 const a=collector(),b=collector();assert.equal(drawBerserkTerrain(BERSERK_MAP,0,0,a.R,a.P),true);drawBerserkTerrain(BERSERK_MAP,0,0,b.R,b.P);assert.deepEqual(a.ops,b.ops);assert.ok(a.ops.length>2000);
 const sprites=['tree','rock','gate'].map(type=>{const c=collector();assert.equal(drawBerserkProp(BERSERK_MAP,type,c.R,c.P,.3),true);assert.ok(c.ops.length>=12);return JSON.stringify(c.ops);});assert.equal(new Set(sprites).size,3);
 const preview=berserkMapPreview(BERSERK_MAP);assert.match(preview,/shape-rendering="crispEdges"/);assert.match(preview,/<circle/);assert.ok(!preview.includes('http'));assert.equal(berserkMapPreview({id:'garden'}),null);assert.equal(drawBerserkTerrain({id:'garden'},0,0,a.R,a.P),false);
 for(const x of [-2000,0,650,900])for(const y of [-2000,0,400,1300])assert.equal(onWater(BERSERK_MAP,x,y,8),false);
});

test('Eclipse fossil colonnades have fixed addresses and open cardinal escape avenues',()=>{
 const g=run(),scene=layoutProps(BERSERK_MAP,-2200,-2200,4400,4400),subset=layoutProps(BERSERK_MAP,-700,-700,1400,1400),gates=scene.filter(o=>o.type==='gate');assert.equal(gates.length,1);assert.equal(gates[0].id,'landmark:ossuary');assert.deepEqual([gates[0].x,gates[0].y],[0,-560]);
 for(const o of subset.filter(o=>!Number.isFinite(o.hp)&&Math.abs(o.x)<600&&Math.abs(o.y)<600))assert.deepEqual(scene.find(c=>c.id===o.id),o);
 assert.ok(scene.filter(o=>o.type==='tree').length>20);assert.ok(scene.filter(o=>o.type==='rock').length>5);assert.ok(scene.filter(o=>!Number.isFinite(o.hp)&&o.type!=='gate').every(o=>Math.abs(o.x)>85&&Math.abs(o.y)>80));
 g.world.active=g.world.active.filter(o=>!Number.isFinite(o.hp));g.world.circles=colliders(g);const east={x:0,y:0},north={x:0,y:0};moveBody(g,east,700,0,8);moveBody(g,north,0,-700,8);assert.ok(east.x>690);assert.ok(north.y<-690);
});

test('Berserk supplies have original art, sized collision and one-time normal drops',()=>{
 const g=run(),starter=g.world.active.filter(o=>o.id.startsWith('starter:'));assert.equal(starter.length,3);assert.deepEqual(starter.map(o=>o.type),MAP_SUPPLIES.eclipse);
 const arts=[];for(const o of starter){assert.ok(SUPPLY_DEFS[o.type].name);assert.ok(Number.isFinite(o.hp)&&o.hp>0);const geo=supplyGeometry(o.type);assert.equal(o.r,geo.radius);assert.equal(o.visualScale,geo.scale);assert.ok(colliders(g).some(c=>c.object===o&&c.r===o.r));const c=collector();assert.equal(drawMapSupply(o.type,c.R,c.P),true);assert.ok(c.ops.length>=10);assert.ok(new Set(c.ops.map(op=>op.at(-1))).size>=4);arts.push(JSON.stringify(c.ops));}
 assert.equal(new Set(arts).size,3);const crate=starter[0];assert.ok(damageProp(g,crate,999,0,0,()=>.1));assert.equal(g.pickups.length,1);assert.equal(damageProp(g,crate,999),false);ensureWorld(g);assert.ok(!g.world.active.some(o=>o.id===crate.id));assert.equal(g.pickups.length,1);
});

test('the appended Eclipse identity and destroyed supplies survive a checkpoint',()=>{
 assert.equal(MAPS[15].id,'eclipse');const g=run(),data=new Map(),storage={getItem:k=>data.get(k),setItem:(k,v)=>data.set(k,v),removeItem:k=>data.delete(k)};
 const crate=g.world.active.find(o=>o.id==='starter:crate');damageProp(g,crate,999,0,0,()=>.95);g.money=137;assert.ok(saveRun(g,storage));const restored=loadRun(storage);assert.ok(restored);assert.equal(restored.map.id,'eclipse');assert.equal(restored.money,137);assert.ok(restored.world.destroyed.has(crate.id));assert.ok(!restored.world.active.some(o=>o.id===crate.id));assert.equal(onWater(restored.map,650,0,8),false);
});
