import {trinketBonus,trinketFoodCollected} from './trinkets.js';
import {MAP_SUPPLIES,SUPPLY_DEFS,supplyGeometry} from './map-supplies.js';
import {SCENERY_VERSION,sceneryLayout,sceneryFrontage,supplyPositionAllowed,riverMap} from './scenery-layout.js';
// One deterministic layout is shared by drawing, collision and destruction.
export const hash=(x,y)=>{const n=Math.sin(x*127.1+y*311.7)*43758.5453;return n-Math.floor(n);};
export const PLAYER_RADIUS=8;
const hasRiver=riverMap;
export function createWorld(){return {sceneryVersion:SCENERY_VERSION,objects:new Map(),destroyed:new Set(),active:[],debris:[]};}
function prop(id,x,y,type,seed=0){const stats={tree:[12,Infinity,0],rock:[25,Infinity,0],gate:[0,Infinity,0],lantern:[9,24,0],crate:[17,38,1],pot:[12,22,0]};const def=SUPPLY_DEFS[type];const [baseR,hp,mass]=stats[def?.base||type],geometry=supplyGeometry(type),r=geometry?.radius||baseR;return {name:def?.name,debrisColor:def?.body,id,x,y,type,seed,visualScale:geometry?.scale||1,r,hp,maxHp:hp,mass,vx:0,vy:0,hit:0,kind:'prop'};}
export function layoutProps(map,left,top,w,h){
  const list=sceneryLayout(map,left,top,w,h).map(o=>prop(o.id,o.x,o.y,o.type,o.seed));
  // Supply cells extend up to 360/395 units beyond the requested right/bottom
  // edges. Include every neighboring facade when deciding whether a supply
  // fits, so changing the camera window cannot mint a previously hidden crate.
  const supplyBlockers=sceneryLayout(map,left-400,top-400,w+800,h+800);
  for(let x=Math.floor((left-190)/240);x<Math.ceil((left+w+190)/240);x++)for(let y=Math.floor((top-100)/240);y<Math.ceil((top+h+220)/240);y++){
    const bx=x*240+170,by=y*240+175;
    if(!supplyPositionAllowed(map,bx,by)||supplyBlockers.some(o=>Math.abs(o.x-bx)<90&&Math.abs(o.y-by)<50))continue;
    if(hash(x-6,y+13)>.32)list.push(prop(`supply:${x}:${y}`,bx,by,MAP_SUPPLIES[map.id][Math.floor(hash(y,x)*3)],hash(x+19,y-7)));
  }
  // Supplies near the first clearing make the interaction discoverable.
  list.push(prop('starter:crate',105,85,MAP_SUPPLIES[map.id][0]),prop('starter:pot',-110,80,MAP_SUPPLIES[map.id][1]),prop('starter:lantern',160,-90,MAP_SUPPLIES[map.id][2]));
  return list;
}
export function ensureWorld(g){
  if(g.riftArena){g.world.active=[];g.world.circles=[];return g.world.active;}
  const migrate=g.world.sceneryVersion!==SCENERY_VERSION;
  if(migrate){
    // Only indestructible scenery changes addresses. Existing supplies, pushed
    // crates, damage and the destruction ledger keep their original identity.
    for(const [id,o]of g.world.objects)if(!Number.isFinite(o.maxHp))g.world.objects.delete(id);
    g.world.sceneryVersion=SCENERY_VERSION;
  }
  const w=g.view.w/g.zoom+380,h=g.view.h/g.zoom+420;
  const layout=layoutProps(g.map,g.p.x-w/2,g.p.y-h/2,w,h);
  const active=[];
  for(const candidate of layout){if(g.world.destroyed.has(candidate.id))continue;let obj=g.world.objects.get(candidate.id);if(!obj){obj=candidate;g.world.objects.set(obj.id,obj);}if(Math.hypot(obj.x-g.p.x,obj.y-g.p.y)<Math.hypot(w,h))active.push(obj);}
  const included=new Set(active.map(o=>o.id));
  for(const o of g.world.objects.values())if((o.mass||Number.isFinite(o.maxHp))&&o.hp>0&&!g.world.destroyed.has(o.id)&&!included.has(o.id)&&Math.hypot(o.x-g.p.x,o.y-g.p.y)<Math.hypot(w,h))active.push(o);
  for(const o of active){const geometry=supplyGeometry(o.type);if(geometry){o.r=geometry.radius;o.visualScale=geometry.scale;}}
  g.world.active=active;
  if(migrate){g.world.circles=colliders(g);resolve(g,g.p,PLAYER_RADIUS,false,null);}
  // Undamaged static objects can be recreated from the deterministic layout.
  if(g.world.objects.size>600)for(const [id,o] of g.world.objects)if(!o.mass&&o.hp===o.maxHp&&Math.hypot(o.x-g.p.x,o.y-g.p.y)>2400)g.world.objects.delete(id);
  return active;
}
export function colliders(g){
  const circles=[];
  for(const o of g.world.active){
    if(o.hp<=0)continue;
    if(o.type==='gate')circles.push({x:o.x-46,y:o.y,r:9,object:o},{x:o.x+46,y:o.y,r:9,object:o});
    else{const front=sceneryFrontage(g.map,o);if(front)for(const offset of [-front.offset,0,front.offset])circles.push({x:o.x+offset,y:o.y,r:front.radius,object:o});else circles.push({x:o.x,y:o.y,r:o.r,object:o});}
  }
  return circles;
}
export function onWater(map,x,y,r=0){if(!hasRiver(map))return false;const stream=650+Math.sin(y/400)*90,bridge=Math.abs(((y%800)+800)%800-400)<38-r;return Math.abs(x-stream)<91+r&&!bridge;}
function resolve(g,body,r,push,ignore){
  for(let pass=0;pass<2;pass++)for(const c of g.world.circles||colliders(g)){
    if(c.object===ignore||c.object.hp<=0)continue;
    const dx=body.x-c.x,dy=body.y-c.y,d=Math.hypot(dx,dy),min=r+c.r;
    if(d>=min)continue;
    const nx=d>1e-5?dx/d:1,ny=d>1e-5?dy/d:0,overlap=min-d;
    if(push&&c.object.mass){const force=overlap*16;c.object.vx-=nx*force;c.object.vy-=ny*force;}
    body.x+=nx*(overlap+.02);body.y+=ny*(overlap+.02);
  }
}
export function moveBody(g,body,dx,dy,r=PLAYER_RADIUS,{push=false,flying=false,ignore=null}={}){
  const steps=Math.max(1,Math.ceil(Math.hypot(dx,dy)/6)),sx=dx/steps,sy=dy/steps;
  for(let i=0;i<steps;i++){
    const ox=body.x,oy=body.y;body.x+=sx;resolve(g,body,r,push,ignore);if(!g.riftArena&&!flying&&onWater(g.map,body.x,body.y,r)){body.x=ox;}
    body.y+=sy;resolve(g,body,r,push,ignore);if(!g.riftArena&&!flying&&onWater(g.map,body.x,body.y,r)){body.y=oy;}
    if(g.riftArena){const edge=Math.max(40,(g.riftArena.radius||760)-r);body.x=Math.max(-edge,Math.min(edge,body.x));body.y=Math.max(-edge,Math.min(edge,body.y));}
  }
}
export function navigateEnemy(g,e,dx,dy,dt){
  const r=Math.min(e.r*.6,19),flying=e.waterWalker||['flyhead','aura','frieza','walpurgis','butterfly','familiar','cursedeye'].includes(e.archetype);
  let mx=dx,my=dy;
  // Steer around nearby obstacles instead of collecting in a motionless pile.
  for(const c of g.world.circles||[]){const ex=e.x-c.x,ey=e.y-c.y,d=Math.hypot(ex,ey),limit=r+c.r+24;if(d<limit&&d>0&&mx*ex+my*ey<0){const side=e.id%2?1:-1;mx+=ex/d*e.speed*.8-ey/d*e.speed*.6*side;my+=ey/d*e.speed*.8+ex/d*e.speed*.6*side;}}
  if(!g.riftArena&&!flying&&onWater(g.map,e.x+mx*dt,e.y+my*dt,r)){
    const by=Math.floor(e.y/800)*800+400;mx=0;my=Math.sign(by-e.y)*e.speed;
  }
  moveBody(g,e,mx*dt,my*dt,r,{push:!!e.boss,flying});
}
export function separateEnemies(g){
  const cells=new Map(),size=48;
  for(const e of g.enemies){if(e.hp<=0)continue;const x=Math.floor(e.x/size),y=Math.floor(e.y/size);for(let i=-1;i<=1;i++)for(let j=-1;j<=1;j++)for(const other of cells.get(`${x+i}:${y+j}`)||[]){const dx=e.x-other.x,dy=e.y-other.y,d=Math.hypot(dx,dy),min=(e.r+other.r)*.52;if(d>=min)continue;const nx=d?dx/d:1,ny=d?dy/d:0,force=Math.min(3,(min-d)*.35);e.x+=nx*force;e.y+=ny*force;if(!other.boss){other.x-=nx*force;other.y-=ny*force;}}
    const key=`${x}:${y}`;if(!cells.has(key))cells.set(key,[]);cells.get(key).push(e);
  }
}
export function pointCollider(g,x,y,r=0){for(const c of g.world.circles||colliders(g)){if(c.object.hp>0&&Math.hypot(x-c.x,y-c.y)<r+c.r&&c.object.type!=='gate')return c.object;if(c.object.type==='gate'&&Math.hypot(x-c.x,y-c.y)<r+c.r)return c.object;}return null;}
export function segmentDistance(x,y,ax,ay,bx,by){const dx=bx-ax,dy=by-ay,t=Math.max(0,Math.min(1,((x-ax)*dx+(y-ay)*dy)/(dx*dx+dy*dy||1)));return Math.hypot(x-ax-t*dx,y-ay-t*dy);}
export const BREAKABLE_DROP_CHANCE=.6;
export function rollBreakableDrop(random=Math.random){return random()<BREAKABLE_DROP_CHANCE?rollDrop(random):null;}
export function rollDrop(random=Math.random){const n=random();return n<.42?'money':n<.7?'food':n<.83?'magnet':n<.93?'energy':'boots';}
export function spawnPickup(g,kind,x,y){const a=Math.random()*Math.PI*2;g.pickups.push({id:++g.id,kind,x,y,vx:Math.cos(a)*45,vy:Math.sin(a)*45,z:8,vz:110,age:0,phase:Math.random()*6});}
export function damageProp(g,o,damage,kx=0,ky=0,random=Math.random){
  if(!o||o.hp<=0||!Number.isFinite(o.hp))return false;
  o.hp-=damage;o.hit=.15;o.vx+=kx*(o.mass?1:0);o.vy+=ky*(o.mass?1:0);
  if(o.hp>0)return false;
  g.world.destroyed.add(o.id);g.broken++;
  const drop=rollBreakableDrop(random);if(drop)spawnPickup(g,drop,o.x,o.y);
  for(let i=0;i<10&&g.world.debris.length<140;i++){const a=Math.random()*Math.PI*2;g.world.debris.push({x:o.x,y:o.y,vx:Math.cos(a)*(30+Math.random()*100),vy:Math.sin(a)*60,z:15,vz:70+Math.random()*100,life:2.5,color:o.debrisColor||(o.type==='crate'?'#b9946e':o.type==='pot'?'#ca9e91':'#a8b3ad'),angle:a,spin:(Math.random()-.5)*10});}
  g.effects.push({type:'nova',x:o.x,y:o.y,r:26,color:'#e9d2ab',life:.25,max:.25});return true;
}
export function damagePropsInRadius(g,x,y,r,damage,knock=50){for(const o of g.world.active)if(o.hp>0&&Math.hypot(o.x-x,o.y-y)<r+o.r){const d=Math.hypot(o.x-x,o.y-y)||1;damageProp(g,o,damage,(o.x-x)/d*knock,(o.y-y)/d*knock);}}
export function collectPickup(g,pickup){
  const p=g.p;let text='';
  if(pickup.kind==='food'){const heal=30*(p.healing||1)*trinketBonus(g).healing;p.hp=Math.min(p.maxHp,p.hp+heal);trinketFoodCollected(g);text='FOOD · +'+Math.round(heal)+' HP';}
  else if(pickup.kind==='money'){const coins=10*(1+(p.meta?.coinGain||0))*trinketBonus(g).coins;g.money+=coins;text='+'+Math.round(coins)+' COINS';}
  else if(pickup.kind==='magnet'){for(const gem of g.gems)gem.attracted=true;text='MAGNET · ALL XP DRAWN IN';g.magnetPulse=1;}
  else if(pickup.kind==='energy'){const refund=6+trinketBonus(g).energy;g.special=Math.max(0,g.special-refund);text='ENERGY · −'+refund+'s ULTIMATE COOLDOWN';}
  else if(pickup.kind==='boots'){g.haste=12+trinketBonus(g).boots;text='SWIFT BOOTS · +25% SPEED FOR '+g.haste+'s';}
  g.toast=text;g.toastTime=2.5;g.pickupsCollected++;pickup.collected=true;
}
export function updateWorld(g,dt){
  g.world.circles=colliders(g);
  for(const o of g.world.active){o.hit=Math.max(0,o.hit-dt);if(o.mass&&o.hp>0&&(Math.abs(o.vx)+Math.abs(o.vy)>.1)){moveBody(g,o,o.vx*dt,o.vy*dt,o.r,{ignore:o});o.vx*=Math.exp(-7*dt);o.vy*=Math.exp(-7*dt);}}
  g.world.circles=colliders(g);
  for(const q of g.world.debris){q.x+=q.vx*dt;q.y+=q.vy*dt;q.z+=q.vz*dt;q.vz-=480*dt;if(q.z<0){q.z=0;q.vz=Math.abs(q.vz)*.3;q.vx*=.6;q.vy*=.6;}q.angle+=q.spin*dt;q.life-=dt;}
  g.world.debris=g.world.debris.filter(q=>q.life>0);
  for(const q of g.pickups){q.age+=dt;q.x+=q.vx*dt;q.y+=q.vy*dt;q.vx*=Math.exp(-5*dt);q.vy*=Math.exp(-5*dt);q.z+=q.vz*dt;q.vz-=420*dt;if(q.z<0){q.z=0;q.vz=Math.abs(q.vz)>.8?Math.abs(q.vz)*.25:0;}
    if(q.age>.3&&q.z<12&&Math.hypot(q.x-g.p.x,q.y-g.p.y)<24)collectPickup(g,q);
  }
  g.pickups=g.pickups.filter(q=>!q.collected);
}
