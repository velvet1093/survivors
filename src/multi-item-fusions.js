import {summonPack,summonNue} from './summons.js';
import {applyStatus} from './status.js';
import {damagePropsInRadius,segmentDistance} from './world.js';

const distance=(a,b)=>Math.hypot(a.x-b.x,a.y-b.y);
const effect=(g,type,data)=>g.effects.push({type,life:.32,max:.32,...data});
const liveEnemies=g=>g.enemies.filter(e=>e.hp>0);

// Called before ordinary weapon casts. Power already includes rank, fusion and hero bonuses.
export function castMultiItemFusion(g,weapon,target,power,boost={}){
 const p=g.p,fusion=p.fusions[weapon],signature=weapon===p.weapon;
 if(fusion==='chimeragarden'&&weapon==='shadows'){
  const rank=p.weapons.shadows,duration=boost.duration||1;
  summonPack(g,rank,power,true,duration);summonNue(g,rank,power,true,duration);
  // One active garden at a time; refreshing it never leaves stale damage fields behind.
  for(const shot of g.shots)if(shot.type==='chimeragarden')shot.life=0;
  const life=4.5*duration,r=175*p.area*(boost.area||1)*(1+(signature?(p.meta.signatureArea||0):0));
  g.shots.push({id:++g.id,type:'chimeragarden',sourceWeapon:weapon,x:p.x,y:p.y,ox:p.x,oy:p.y,vx:0,vy:0,r,life,max:life,age:0,tick:0,damage:16*power,power,rank,fused:true,color:'#9eb6e5'});
  effect(g,'nova',{x:p.x,y:p.y,r,color:'#819dd1',life:.5,max:.5});return true;
 }
 if(fusion==='rasenflash'&&weapon==='shuriken'){
  const y=p.y-18,aim=Math.atan2(target.y-y,target.x-p.x),speed=720;
  g.shots.push({id:++g.id,type:'rasenflash',sourceWeapon:weapon,x:p.x,y,ox:p.x,oy:y,vx:Math.cos(aim)*speed,vy:Math.sin(aim)*speed,r:4,life:2.6,age:0,rank:p.weapons[weapon],fused:true,damage:32*power,blastDamage:18*power,blastRadius:68*p.area*(boost.area||1)*(1+(signature?(p.meta.signatureArea||0):0)),jumpsLeft:3+(signature?(p.meta.projectiles||0):0)+(boost.projectiles||0),hits:new Set(),jumpDelay:0,color:'#f4df9a',power});
  effect(g,'nova',{x:p.x,y,r:23,color:'#e2ecac',life:.18,max:.18});return true;
 }
 return false;
}

function gardenPulse(g,s,api){
 const points=[];
 for(const e of liveEnemies(g))if(distance(e,s)<s.r+(e.r||0)){
  api.damage(g,e,s.damage,s.color);applyStatus(e,'cursed',1.1);applyStatus(e,'slow',.85,{power:.4});
  const d=distance(e,s)||1;e.kvx=(s.x-e.x)/d*55;e.kvy=(s.y-e.y)/d*55;
  if(points.length<7)points.push({x:e.x,y:e.y});
 }
 damagePropsInRadius(g,s.x,s.y,s.r,s.damage);
 effect(g,'nova',{x:s.x,y:s.y,r:s.r,color:'#7e9fca',life:.42,max:.42});
 if(points.length)effect(g,'lightning',{points:[{x:s.x,y:s.y},...points],color:'#c3caf1',life:.22,max:.22});
}

function flashImpact(g,s,target,api){
 s.x=target.x;s.y=target.y;s.hits.add(target.id);api.damage(g,target,s.damage,s.color);
 for(const e of liveEnemies(g))if(distance(e,s)<s.blastRadius+(e.r||0)){
  api.damage(g,e,s.blastDamage,'#b4efc4');applyStatus(e,'bleeding',3,{power:s.blastDamage*.14,source:'rasen-flash'});applyStatus(e,'stun',.2);
 }
 damagePropsInRadius(g,s.x,s.y,s.blastRadius,s.damage+s.blastDamage);
 effect(g,'nova',{x:s.x,y:s.y,r:s.blastRadius,color:'#a8ecc3',life:.28,max:.28});
 effect(g,'eva-claw',{x:s.x,y:s.y,r:s.blastRadius*.8,angle:Math.atan2(s.vy,s.vx),color:'#eef6bf',life:.2,max:.2});
 api.burst?.(g,s.x,s.y,'#d8e8a6',8,95);s.jumpDelay=.12;s.marked=true;
}

// Owns movement/collision for these two shot types. Damage uses the engine callback,
// preserving boss resistance, phase transitions and kill credit.
export function updateMultiItemShot(g,s,dt,api){
 if(!['chimeragarden','rasenflash'].includes(s.type))return false;
 if(s.life<=0)return true;
 const elapsed=Math.min(s.life,dt);s.age+=elapsed;s.life-=dt;
 if(s.type==='chimeragarden'){
  s.tick-=elapsed;while(s.tick<=0){gardenPulse(g,s,api);s.tick+=.6;}return true;
 }
 if(s.life<=0)return true;
 if(s.marked){
  s.jumpDelay-=elapsed;if(s.jumpDelay>0)return true;
  const next=liveEnemies(g).filter(e=>!s.hits.has(e.id)&&distance(e,s)<=285&&distance(e,g.p)<650).sort((a,b)=>distance(a,s)-distance(b,s))[0];
  if(s.jumpsLeft<=0||!next){s.life=0;return true;}
  s.jumpsLeft--;s.ox=s.x;s.oy=s.y;
  effect(g,'lightning',{points:[{x:s.x,y:s.y},{x:next.x,y:next.y}],color:'#ffebb0',life:.18,max:.18});
  s.vx=next.x-s.x;s.vy=next.y-s.y;flashImpact(g,s,next,api);return true;
 }
 s.ox=s.x;s.oy=s.y;s.x+=s.vx*dt;s.y+=s.vy*dt;
 const crossed=liveEnemies(g).filter(e=>segmentDistance(e.x,e.y,s.ox,s.oy,s.x,s.y)<(e.r||0)+s.r).sort((a,b)=>Math.hypot(a.x-s.ox,a.y-s.oy)-Math.hypot(b.x-s.ox,b.y-s.oy))[0];
 if(crossed)flashImpact(g,s,crossed,api);
 return true;
}
