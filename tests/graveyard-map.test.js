import test from 'node:test';
import assert from 'node:assert/strict';
import {GRAVEYARD_MAP,GRAVEYARD_WORLD_PALETTES,GRAVEYARD_SUPPLIES,GRAVEYARD_SUPPLY_DEFS,GRAVEYARD_SUPPLY_GEOMETRY,drawGraveyardTerrain,drawGraveyardProp,drawGraveyardSupply,graveyardMapPreview,graveyardCoordinate,graveyardSceneryLayout,graveyardSceneryFrontage,graveyardSupplyPositionAllowed} from '../src/graveyard-map.js';
import {CHARACTERS,MAPS} from '../src/game.js';
import {createRun} from '../src/engine.js';
import {layoutProps,ensureWorld,colliders,onWater,moveBody,damageProp} from '../src/world.js';
import {MAP_SUPPLIES,supplyGeometry,drawMapSupply} from '../src/map-supplies.js';
import {saveRun,loadRun} from '../src/run-save.js';
function collector(){const ops=[],R=(...args)=>{assert.ok(args.slice(0,4).every(Number.isFinite));assert.ok(args[2]>=0&&args[3]>=0);assert.match(args[4],/^#[0-9a-f]{6,8}$/i);ops.push(['rect',...args]);},P=(points,color)=>{assert.ok(points.flat().every(Number.isFinite));assert.match(color,/^#[0-9a-f]{6,8}$/i);ops.push(['poly',points,color]);};return{ops,R,P};}
const run=()=>{const g=createRun(CHARACTERS[0],MAPS.findIndex(m=>m.id==='graveyard'));ensureWorld(g);return g;};

test('graveyard terrain is deterministic, dry and separate from other maps, with original local preview art',()=>{
 assert.equal(GRAVEYARD_MAP.id,'graveyard');assert.ok(GRAVEYARD_WORLD_PALETTES.graveyard);
 for(const [cx,cy]of [[0,0],[-2,-3],[3,2]]){const a=collector(),b=collector();assert.equal(drawGraveyardTerrain(GRAVEYARD_MAP,cx,cy,a.R,a.P),true);drawGraveyardTerrain(GRAVEYARD_MAP,cx,cy,b.R,b.P);assert.deepEqual(a.ops,b.ops);assert.ok(a.ops.length>2000&&a.ops.length<10000);}
 const noop=collector();assert.equal(drawGraveyardTerrain({id:'garden'},0,0,noop.R,noop.P),false);assert.equal(noop.ops.length,0);
 for(const x of [-2000,-100,0,650,900,2000])for(const y of [-2000,0,400,1300])assert.equal(onWater(GRAVEYARD_MAP,x,y,8),false);
 const preview=graveyardMapPreview(GRAVEYARD_MAP);assert.match(preview,/shape-rendering="crispEdges"/);assert.ok(preview.includes('<circle'));assert.ok(!/https?:|<script|NaN|undefined/.test(preview));assert.equal(graveyardMapPreview({id:'garden'}),null);
});

test('fixed grave plots leave all repeated avenues open and contain just one mausoleum and entrance',()=>{
 const whole=graveyardSceneryLayout(GRAVEYARD_MAP,-2200,-2200,4400,4400),part=graveyardSceneryLayout(GRAVEYARD_MAP,-700,-700,1400,1400);
 assert.equal(whole.filter(v=>v.id==='landmark:graveyard-gate').length,1);assert.equal(whole.filter(v=>v.id==='landmark:graveyard-mausoleum').length,1);assert.equal(whole.filter(v=>v.type==='rock'&&v.seed>=.9).length,1);assert.ok(whole.filter(v=>v.type==='rock').length>70);
 for(const item of part)assert.deepEqual(whole.find(v=>v.id===item.id),item,'a camera window never changes an address or variant');
 for(const v of whole.filter(v=>v.id.startsWith('scenery:'))){assert.ok(Math.abs(graveyardCoordinate(v.x))>=200);assert.ok(Math.abs(graveyardCoordinate(v.y))>=190);assert.ok(!/NaN|undefined/.test(v.id));assert.ok([v.x,v.y,v.seed].every(Number.isFinite));}
 assert.equal(graveyardSceneryLayout({id:'garden'},0,0,200,200),null);assert.deepEqual(graveyardSceneryFrontage(GRAVEYARD_MAP,{type:'rock',seed:.95}),{offset:43,radius:30});assert.equal(graveyardSceneryFrontage(GRAVEYARD_MAP,{type:'rock',seed:.7}),null);
 for(const n of [-1920,-960,0,960,1920]){assert.equal(graveyardSupplyPositionAllowed(GRAVEYARD_MAP,n,300),false);assert.equal(graveyardSupplyPositionAllowed(GRAVEYARD_MAP,300,n),false);}
 assert.equal(graveyardSupplyPositionAllowed(GRAVEYARD_MAP,410,415),true);
});

test('tombstones, mausoleum, open iron gate and lantern trees have distinct finite native silhouettes',()=>{
 const art=[];for(const [type,seed]of [['rock',.2],['rock',.4],['rock',.7],['rock',.95],['tree',.3],['gate',.3]]){const c=collector();assert.equal(drawGraveyardProp(GRAVEYARD_MAP,type,c.R,c.P,seed),true);assert.ok(c.ops.length>=10&&c.ops.length<200);art.push(JSON.stringify(c.ops));}assert.equal(new Set(art).size,6);
 const c=collector();assert.equal(drawGraveyardProp({id:'garden'},'tree',c.R,c.P),false);assert.equal(drawGraveyardProp(GRAVEYARD_MAP,'unregistered',c.R,c.P),false);assert.equal(c.ops.length,0);
});

test('actual world collision matches the open roads, gate gap and wide mausoleum base',()=>{
 const g=run();g.world.active=layoutProps(GRAVEYARD_MAP,-1100,-1100,2200,2200).filter(v=>!Number.isFinite(v.hp));g.world.circles=colliders(g);
 for(const [dx,dy]of [[900,0],[-900,0],[0,900],[0,-900]]){const body={x:0,y:0};moveBody(g,body,dx,dy,8);assert.ok(Math.hypot(body.x-dx,body.y-dy)<1,'cardinal avenue and gate passage remain walkable');}
 const maus=g.world.active.find(v=>v.id==='landmark:graveyard-mausoleum'),base=g.world.circles.filter(v=>v.object===maus);assert.equal(base.length,3);assert.deepEqual(base.map(v=>v.x-maus.x),[-43,0,43]);
 const blocked={x:maus.x,y:maus.y+90};moveBody(g,blocked,0,-90,8);assert.ok(blocked.y>=maus.y+37,'the broad painted base remains solid');
});

test('three themed supplies use matching sizes, normal one-time drops and preserve destruction in a graveyard checkpoint',()=>{
 const g=run(),starter=g.world.active.filter(v=>v.id.startsWith('starter:'));assert.equal(starter.length,3);assert.deepEqual(MAP_SUPPLIES.graveyard,GRAVEYARD_SUPPLIES);assert.deepEqual(starter.map(v=>v.type),GRAVEYARD_SUPPLIES);
 const art=[];for(const v of starter){const d=GRAVEYARD_SUPPLY_DEFS[v.type],[scale,radius]=GRAVEYARD_SUPPLY_GEOMETRY[d.form],a=collector(),b=collector();assert.deepEqual(supplyGeometry(v.type),{scale,radius});assert.equal(v.r,radius);assert.equal(v.visualScale,scale);assert.ok(v.hp>0&&Number.isFinite(v.hp));assert.equal(drawGraveyardSupply(v.type,a.R,a.P),true);assert.equal(drawMapSupply(v.type,b.R,b.P),true);assert.deepEqual(a.ops,b.ops);assert.ok(a.ops.length>=10);art.push(JSON.stringify(a.ops));}assert.equal(new Set(art).size,3);
 const coffin=starter[0];assert.equal(damageProp(g,coffin,999,0,0,()=>.1),true);assert.equal(damageProp(g,coffin,999),false);assert.equal(g.pickups.length,1);ensureWorld(g);assert.ok(!g.world.active.some(v=>v.id===coffin.id));
 const data=new Map(),store={getItem:k=>data.get(k),setItem:(k,v)=>data.set(k,v),removeItem:k=>data.delete(k)};g.money=137;assert.ok(saveRun(g,store));const restored=loadRun(store);assert.ok(restored);assert.equal(restored.map.id,'graveyard');assert.equal(restored.money,137);assert.ok(restored.world.destroyed.has(coffin.id));assert.ok(!restored.world.active.some(v=>v.id===coffin.id));assert.equal(MAPS[16].id,'graveyard');assert.equal(MAPS[15].id,'eclipse');
});
