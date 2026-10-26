import {applyStatus} from './status.js';
import {damageProp,damagePropsInRadius,segmentDistance,pointCollider} from './world.js';

export const PAIRED_WEAPON_IDS=['rasengan','dragonflame','wisteriapetals'];
const live=g=>g.enemies.filter(e=>e.hp>0);
const distance=(a,b)=>Math.hypot(a.x-b.x,a.y-b.y);
const effect=(g,type,data)=>g.effects.push({type,life:.35,max:.35,...data});
const area=(g,id,boost={})=>g.p.area*(boost.area||1)*(id===g.p.weapon?1+(g.p.meta.signatureArea||0):1);
export const isPairedWeapon=(g,id)=>PAIRED_WEAPON_IDS.includes(id)||id==='poison'&&g.p.fusions.poison==='wisteriagarden';
export function pairedWeaponReach(g,id){return id==='rasengan'&&!g.p.fusions.rasengan?(112+(g.p.weapons.rasengan||1)*8)*g.p.area*(id===g.p.weapon?1+(g.p.meta.signatureArea||0):1):Infinity;}
export function pairedWeaponCooldown(g,id){
 if(!isPairedWeapon(g,id))return null;
 if(id==='rasengan')return g.p.fusions[id]==='raijinrasengan'?1.9:1.25;
 if(id==='dragonflame')return g.p.fusions[id]==='dragonroar'?2.8:1.75;
 return g.p.fusions[id]==='wisteriagarden'?2.8:1.2;
}
function knock(e,x,y,force){const dx=e.x-x,dy=e.y-y,d=Math.hypot(dx,dy)||1;e.kvx=dx/d*force*(e.boss?.2:1);e.kvy=dy/d*force*(e.boss?.2:1);}
function coneContains(unit,s){const d=distance(unit,s);return d<s.r+(unit.r||0)&&(d<24||Math.cos(Math.atan2(unit.y-s.y,unit.x-s.x)-s.angle)>Math.cos(s.halfAngle));}
function fixedChannel(g,s,elapsed,api){
 s.tick-=elapsed;
 while(s.tick<=1e-8&&s.pulses<s.maxPulses){
  for(const e of live(g))if(s.type==='dragonroar'?segmentDistance(e.x,e.y,s.x,s.y,s.tx,s.ty)<s.width+(e.r||0):coneContains(e,s)){
   const before=e.hp;api.damage(g,e,s.damage,s.color);if(e.hp<before){applyStatus(e,'burning',2.5,{power:s.burnPower,source:s.id});if(s.type==='dragonroar'&&!s.hits.has(e.id))applyStatus(e,'stun',.35);s.hits.add(e.id);}
  }
  for(const o of g.world.active)if(o.hp>0&&(s.type==='dragonroar'?segmentDistance(o.x,o.y,s.x,s.y,s.tx,s.ty)<s.width+o.r:coneContains(o,s)))damageProp(g,o,s.damage);
  s.pulses++;s.tick+=s.interval;
 }
}
function flashImpact(g,s,target,api){
 s.x=target.x;s.y=target.y;s.hits.add(target.id);api.damage(g,target,s.damage,s.color);applyStatus(target,'bleeding',2,{power:s.damage*.08,source:s.id});
 for(const e of live(g))if(e!==target&&distance(e,s)<s.blastRadius+(e.r||0))api.damage(g,e,s.blastDamage,'#b5dfe2');
 for(const e of live(g))if(distance(e,s)<s.blastRadius+(e.r||0)){applyStatus(e,'stun',.25);knock(e,s.ox,s.oy,90);}
 damagePropsInRadius(g,s.x,s.y,s.blastRadius,s.blastDamage);
 effect(g,'paired-flash-impact',{x:s.x,y:s.y,r:s.blastRadius,angle:Math.atan2(s.vy,s.vx),color:'#b6e3e4',fused:true,life:.42,max:.42});
 api.burst?.(g,s.x,s.y,'#e8dba9',7,80);s.state='marked';s.jumpDelay=.16;
}
function gardenPulse(g,s,api){
 for(const e of live(g))if(distance(e,s)<s.r+(e.r||0)){
  const hp=e.hp;api.damage(g,e,s.damage,s.color);
  if(e.hp<hp){api.toxin?.(g);applyStatus(e,'poison',s.poisonDuration,{power:s.poisonPower,source:s.statusSource});applyStatus(e,'slow',.8,{power:.35});}
 }
 damagePropsInRadius(g,s.x,s.y,s.r,s.damage);s.pulses++;
}

// The engine supplies rank, fusion and hero multipliers once in power. These
// attacks use its damage callback so boss resistance and kill credit still apply.
export function castPairedWeapon(g,id,target,power,boost={},api){
 if(!isPairedWeapon(g,id))return false;
 const p=g.p,rank=p.weapons[id],fusion=p.fusions[id],scale=area(g,id,boost),aim=Math.atan2(target.y-p.y,target.x-p.x);
 if(id==='rasengan'&&fusion!=='raijinrasengan'){
  if(target.hp<=0||distance(p,target)>pairedWeaponReach(g,id)+(target.r||0))return false;
  const reach=pairedWeaponReach(g,id),d=Math.min(reach,distance(p,target)),x=p.x+Math.cos(aim)*d,y=p.y+Math.sin(aim)*d,r=(42+rank*4)*scale;
  effect(g,'paired-rasengan',{x,y,r,angle:aim,color:'#a7dfe7',life:.42,max:.42});
  for(const e of live(g))if(Math.hypot(e.x-x,e.y-y)<r+(e.r||0)){api.damage(g,e,36*power,'#bce7e5');applyStatus(e,'slow',.75,{power:.3});knock(e,p.x,p.y,95);}
  damagePropsInRadius(g,x,y,r,36*power);return true;
 }
 if(id==='rasengan'){
  const y=p.y-18,a=Math.atan2(target.y-y,target.x-p.x),speed=680;
  g.shots.push({id:++g.id,type:'raijinrasengan',sourceWeapon:id,x:p.x,y,ox:p.x,oy:y,vx:Math.cos(a)*speed,vy:Math.sin(a)*speed,r:5,age:0,life:2.2,max:2.2,rank,fused:true,state:'kunai',hits:new Set(),jumpsLeft:2,initialJumps:2,jumpDelay:0,blastRadius:82*scale,damage:46*power,blastDamage:18*power,color:'#e9d7a1'});return true;
 }
 if(id==='dragonflame'){
  for(const shot of g.shots)if(shot.sourceWeapon===id&&['dragonflame','dragonroar'].includes(shot.type))shot.life=0;
  const fused=fusion==='dragonroar',y=p.y-18,a=Math.atan2(target.y-y,target.x-p.x),r=(fused?640:210+rank*18)*scale,max=fused?1.1:.72;
  g.shots.push({id:++g.id,type:fused?'dragonroar':'dragonflame',sourceWeapon:id,x:p.x,y,ox:p.x,oy:y,tx:p.x+Math.cos(a)*r,ty:y+Math.sin(a)*r,angle:a,r,halfAngle:.42,width:45*scale,vx:0,vy:0,age:0,life:max,max,rank,fused,damage:(fused?12:9)*power,burnPower:(fused?3:4)*power,hits:new Set(),tick:0,pulses:0,maxPulses:fused?5:3,interval:fused?.22:.25,color:fused?'#e8c28c':'#eda97a'});return true;
 }
 if(fusion==='wisteriagarden'){
  for(const shot of g.shots)if(shot.type==='wisteriagarden')shot.life=0;
  const y=p.y-18,a=Math.atan2(target.y-y,target.x-p.x),d=Math.min(430,Math.hypot(target.x-p.x,target.y-y)),tx=p.x+Math.cos(a)*d,ty=y+Math.sin(a)*d,idNumber=++g.id;
  g.shots.push({id:idNumber,type:'wisteriagarden',sourceWeapon:id,x:p.x,y,ox:p.x,oy:y,tx,ty,vx:(tx-p.x)/.45,vy:(ty-y)/.45,r:142*scale,age:0,life:4.65,max:4.65,flight:.45,bloomAge:0,state:'seed',rank,fused:true,tick:0,pulses:0,maxPulses:9,damage:9*power,poisonPower:4*power,poisonDuration:3*(1+(p.meta.poisonDuration||0)),statusSource:'wisteria:'+idNumber,color:'#c7a7dc'});return true;
 }
 const y=p.y-18,a=Math.atan2(target.y-y,target.x-p.x),n=3+Math.floor(rank/2),serial=++g.id;
 for(let i=0;i<n;i++){
  const angle=a+(i-(n-1)/2)*.18;
  g.shots.push({id:++g.id,type:'wisteriapetals',sourceWeapon:id,x:p.x,y,ox:p.x,oy:y,vx:Math.cos(angle)*400,vy:Math.sin(angle)*400,r:5,age:0,life:1.6,max:1.6,rank,fused:false,damage:14*power,poisonPower:3*power,poisonDuration:2.5*(1+(p.meta.poisonDuration||0)),pierce:2+Math.floor(rank/2),hits:new Set(),statusSource:'wisteria:'+serial,color:'#c4a2df'});
 }
 return true;
}

export function updatePairedShot(g,s,dt,api){
 if(!['raijinrasengan','dragonflame','dragonroar','wisteriapetals','wisteriagarden'].includes(s.type))return false;
 if(s.life<=0)return true;
 const elapsed=Math.min(s.life,Math.max(0,dt)),oldAge=s.age;s.age+=elapsed;s.life-=Math.max(0,dt);
 if(s.type==='dragonflame'||s.type==='dragonroar'){fixedChannel(g,s,elapsed,api);return true;}
 if(s.type==='wisteriagarden'){
  if(s.age<s.flight){const t=s.age/s.flight;s.x=s.ox+(s.tx-s.ox)*t;s.y=s.oy+(s.ty-s.oy)*t;return true;}
  if(s.state==='seed'){s.state='bloom';s.x=s.tx;s.y=s.ty;s.vx=s.vy=0;effect(g,'paired-wisteria-bloom',{x:s.x,y:s.y,r:s.r,color:s.color,life:.45,max:.45});}
  const activeElapsed=Math.max(0,s.age-s.flight)-Math.max(0,oldAge-s.flight);s.bloomAge=Math.max(0,s.age-s.flight);s.tick-=activeElapsed;
  if(activeElapsed>0)while(s.tick<=1e-8&&s.pulses<s.maxPulses){gardenPulse(g,s,api);s.tick+=.5;}
  return true;
 }
 if(s.type==='raijinrasengan'&&s.state==='marked'){
  s.jumpDelay-=elapsed;if(s.jumpDelay>0)return true;
  const next=live(g).filter(e=>!s.hits.has(e.id)&&distance(e,s)<=255&&distance(e,g.p)<=700).sort((a,b)=>distance(a,s)-distance(b,s))[0];
  if(s.jumpsLeft<=0||!next||s.life<=0){s.life=0;return true;}
  s.jumpsLeft--;s.ox=s.x;s.oy=s.y;s.vx=next.x-s.x;s.vy=next.y-s.y;
  effect(g,'paired-flash-link',{points:[{x:s.x,y:s.y},{x:next.x,y:next.y}],color:'#ead9a6',life:.18,max:.18});flashImpact(g,s,next,api);return true;
 }
 if(s.life<=0)return true;
 s.ox=s.x;s.oy=s.y;s.x+=s.vx*elapsed;s.y+=s.vy*elapsed;
 const candidates=live(g).filter(e=>!s.hits.has(e.id)&&segmentDistance(e.x,e.y,s.ox,s.oy,s.x,s.y)<(e.r||0)+s.r).sort((a,b)=>distance(a,{x:s.ox,y:s.oy})-distance(b,{x:s.ox,y:s.oy}));
 if(s.type==='raijinrasengan'){if(candidates[0])flashImpact(g,s,candidates[0],api);return true;}
 for(const e of candidates){
  s.hits.add(e.id);const hp=e.hp;api.damage(g,e,s.damage,s.color);if(e.hp<hp){applyStatus(e,'poison',s.poisonDuration,{power:s.poisonPower,source:s.statusSource});effect(g,'paired-petal-hit',{x:e.x,y:e.y-12,r:16,color:s.color,life:.2,max:.2});}
  if(--s.pierce<=0){s.life=0;break;}
 }
 if(s.life>0){const obstacle=pointCollider(g,s.x,s.y,s.r);if(obstacle){if(!s.hits.has(obstacle.id)){s.hits.add(obstacle.id);damageProp(g,obstacle,s.damage);}s.life=0;}}
 return true;
}
