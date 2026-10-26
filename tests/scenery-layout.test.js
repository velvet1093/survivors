import test from 'node:test';
import assert from 'node:assert/strict';
import {CHARACTERS,MAPS} from '../src/game.js';
import {createRun} from '../src/engine.js';
import {layoutProps,ensureWorld,colliders,damageProp,moveBody} from '../src/world.js';
import {SCENERY_VERSION,cityCoordinate,mapLandmarks} from '../src/scenery-layout.js';
import {saveRun,loadRun} from '../src/run-save.js';

const map=id=>MAPS.find(m=>m.id===id);
const run=id=>{const g=createRun(CHARACTERS[0],MAPS.findIndex(m=>m.id===id));ensureWorld(g);return g;};
const storage=()=>({values:new Map(),getItem(k){return this.values.get(k);},setItem(k,v){this.values.set(k,v);},removeItem(k){this.values.delete(k);}});

test('city stations have two fixed addresses and never repeat in distant street blocks',()=>{
 for(const id of ['tokyo','shibuya']){
  const scenery=layoutProps(map(id),-5000,-5000,10000,10000).filter(o=>!Number.isFinite(o.hp));
  assert.deepEqual(scenery.filter(o=>o.type==='gate').map(o=>[o.x,o.y]),[[-260,-145],[260,-145]]);
  assert.equal(layoutProps(map(id),8000,8000,2000,2000).filter(o=>o.type==='gate').length,0);
  const buildings=scenery.filter(o=>o.type==='rock');assert.ok(buildings.length>100);
  for(const b of buildings){
   const localY=((b.y%960)+960)%960;
   assert.ok(localY===300||localY===745);
   assert.ok(Math.abs(cityCoordinate(b.x))>=185,'facades stay outside the road and sidewalk');
   assert.ok(Math.abs(cityCoordinate(b.y))>=110);
   assert.ok(b.seed<.66=== (localY===300),'store fronts and apartments occupy consistent rows');
  }
 }
});

test('all maps use fixed landmarks and one Leaf monument, with scenery stable across camera windows',()=>{
 for(const m of MAPS){
  const whole=layoutProps(m,-3000,-3000,6000,6000),part=layoutProps(m,-700,-700,1400,1400);
  assert.equal(whole.filter(o=>o.type==='gate').length,mapLandmarks(m).filter(o=>o.type==='gate').length,m.id);
  for(const p of part.filter(o=>!Number.isFinite(o.hp)&&Math.abs(o.x)<600&&Math.abs(o.y)<600))assert.deepEqual(whole.find(o=>o.id===p.id),p,m.id+' consistent address');
 }
 const leaf=layoutProps(map('leafvillage'),-6000,-6000,12000,12000).filter(o=>o.type==='rock'&&o.seed>.78);
 assert.equal(leaf.length,1);assert.equal(leaf[0].id,'landmark:hokage');
 const tempest=layoutProps(map('tempest'),-6000,-6000,12000,12000).filter(o=>o.type==='rock');
 assert.ok(tempest.every(o=>Math.abs(o.x)<600&&Math.abs(o.y)<800),'Tempest huts stay inside the village');
});

test('supplies have the same existence and address at camera edges as in the complete neighborhood',()=>{
 for(const m of MAPS){
  const whole=layoutProps(m,-4000,-4000,8000,8000),all=new Map(whole.map(o=>[o.id,o]));
  for(const [left,top,w,h]of [[-700,-700,700,600],[0,0,390,844],[-1023,511,320,390],[177,-281,1440,900]]){
   const part=layoutProps(m,left,top,w,h);
   for(const p of part.filter(o=>o.id.startsWith('supply:')))assert.deepEqual(all.get(p.id),p,m.id+' consistent supply '+p.id);
   for(const p of whole.filter(o=>o.id.startsWith('supply:')&&o.x>=left&&o.x<=left+w&&o.y>=top&&o.y<=top+h))assert.ok(part.some(o=>o.id===p.id),m.id+' no supply omitted inside camera');
  }
 }
 assert.ok(!layoutProps(map('tokyo'),-700,-700,700,600).some(o=>o.id==='supply:-4:-4'));
});

test('building fronts block their outer edges while courtyard routes and generic rocks keep their geometry',()=>{
 for(const [id,x]of [['tokyo',55],['shibuya',55],['leafvillage',44],['shiganshina',36],['tempest',44]]){
  const g=run(id),house={id:'house',type:'rock',x:200,y:300,seed:.3,r:25,hp:Infinity,maxHp:Infinity};g.world.active=[house];g.world.circles=colliders(g);
  assert.equal(g.world.circles.length,3,id+' three overlapping base circles');
  const body={x:200+x,y:350};moveBody(g,body,0,-35,8);assert.ok(body.y>315||body.x>200+x,id+' collision at facade outer edge');
  const passage={x:295,y:350};moveBody(g,passage,0,-100,8);assert.equal(passage.x,295);assert.ok(Math.abs(passage.y-250)<1e-6,id+' open space beside facade');
 }
 const g=run('forest');g.world.active=[{id:'rock',type:'rock',x:200,y:300,seed:.3,r:25,hp:Infinity,maxHp:Infinity}];assert.equal(colliders(g).length,1);
});

test('scenery migration preserves old finite supplies, their wounds and destruction ledger',()=>{
 const g=run('shibuya');g.world.sceneryVersion=0;
 const pot={...g.world.active.find(o=>o.id==='starter:pot'),id:'scenery:old-pot',x:-370,y:140,hp:7,maxHp:22,mass:0};
 const crate={...g.world.active.find(o=>o.id==='starter:crate'),id:'supply:old-crate',x:420,y:180,hp:19,maxHp:38,mass:1};
 const retired={id:'scenery:old-metro',x:125,y:125,type:'gate',hp:Infinity,maxHp:Infinity,mass:0};
 g.world.objects.set(pot.id,pot);g.world.objects.set(crate.id,crate);g.world.objects.set(retired.id,retired);g.world.destroyed.add('scenery:broken-pot');
 const money=g.money,broken=g.broken;
 ensureWorld(g);assert.equal(g.world.sceneryVersion,SCENERY_VERSION);assert.ok(!g.world.objects.has(retired.id));
 assert.equal(g.world.objects.get(pot.id),pot);assert.equal(g.world.objects.get(crate.id),crate);assert.ok(g.world.active.includes(pot));assert.ok(g.world.active.includes(crate));
 assert.equal(pot.hp,7);assert.equal(crate.hp,19);assert.ok(g.world.destroyed.has('scenery:broken-pot'));assert.equal(g.money,money);assert.equal(g.broken,broken);assert.equal(g.pickups.length,0);
 assert.ok(damageProp(g,pot,999,0,0,()=>.1));ensureWorld(g);assert.equal(g.pickups.length,1);assert.ok(!g.world.active.some(o=>o.id===pot.id));
});

test('resuming an old checkpoint keeps rewards and places the player clear of new scenery',()=>{
 const g=run('tokyo'),store=storage();g.world.sceneryVersion=0;g.money=117;g.kills=42;g.p.x=200;g.p.y=300;
 const supply=g.world.active.find(o=>o.id==='starter:pot');damageProp(g,supply,999,0,0,()=>.95);
 saveRun(g,store);const loaded=loadRun(store);assert.ok(loaded);assert.equal(loaded.money,117);assert.equal(loaded.kills,42);assert.ok(loaded.world.destroyed.has(supply.id));
 assert.ok(colliders(loaded).every(c=>Math.hypot(c.x-loaded.p.x,c.y-loaded.p.y)>=c.r+8-.01));
 assert.equal(loaded.world.sceneryVersion,SCENERY_VERSION);assert.equal(loaded.pickups.length,0);
});
