import {companionLeash} from './companion-ai.js';
import {heroMassHit} from './hero-mechanics.js';
import {applyStatus} from './status.js';
import {damageProp,damagePropsInRadius,segmentDistance} from './world.js';
const distance=(a,b)=>Math.hypot(a.x-b.x,a.y-b.y);
const BASE_BONUS_BOUNCES=3,GARUDA_RULES_VERSION=3;
export function garudaStats(rank=1,fused=false){rank=Math.max(1,Math.min(5,rank||1));const bounceRange=200+rank*20,speed=445+rank*18;return {maxHits:rank+1+BASE_BONUS_BOUNCES+(fused?3:0),bounceRange,speed,life:4+rank*.25+BASE_BONUS_BOUNCES*bounceRange/speed};}
export function garudaOrbitPosition(g,phase=0){const radius=Math.min(66,companionLeash(g)*.45),a=g.p.reducedMotion?-.35:phase;return {x:g.p.x+Math.cos(a)*radius,y:g.p.y-25+Math.sin(a)*radius*.48,angle:a+Math.PI/2};}
export function newGaruda(g){return g.p.id==='yuki'?{...garudaOrbitPosition(g),phase:0,age:0,inFlight:false,flightId:null,flightSerial:0,rulesVersion:2}:null;}
function activeFlight(g){const flights=(g.shots||[]).filter(s=>s.type==='garuda'&&s.life>0);return flights.find(s=>s.garudaFlightId!=null&&s.garudaFlightId===g.garuda?.flightId)||flights[0]||null;}
// Renderers also consult the actual shot list so old paused saves never show a
// second Garuda before their migration has been applied.
export function garudaCompanionVisible(g){return g.p.id==='yuki'&&!!g.garuda&&!g.garuda.inFlight&&!activeFlight(g);}
export function garudaShotVisible(g,s){return s.type!=='garuda'||g.p.id!=='yuki'||s.life>0&&s===activeFlight(g);}
function hydrateShot(s){
 const stats=garudaStats(s.rank,s.fused);s.hits??=new Set();s.propHits??=new Set();
 // Upgrade an airborne checkpoint once, preserving spent hits and any recall.
 // Extra travel time lets the new ricochets reach targets at full bounce range.
 if((s.garudaRulesVersion||0)<GARUDA_RULES_VERSION){
  const extra=Math.max(0,stats.maxHits-(s.maxHits??stats.maxHits));s.maxHits=stats.maxHits;
  if(s.remaining!=null)s.remaining=Math.max(0,Math.min(s.maxHits-s.hits.size,s.remaining+extra));
  if(s.life!=null&&!s.returning)s.life+=extra*stats.bounceRange/stats.speed;
 }
 for(const key of ['maxHits','bounceRange','speed'])s[key]??=stats[key];
 s.life??=stats.life;s.age??=0;s.remaining??=Math.max(0,s.maxHits-s.hits.size);s.garudaRulesVersion=GARUDA_RULES_VERSION;
 if(s.remaining<=0)s.returning=true;
}
function flightPose(g,s){if(g.p.id==='yuki'&&s.garudaFlightId===g.garuda?.flightId)Object.assign(g.garuda,{x:s.x,y:s.y,angle:Math.atan2(s.vy,s.vx)});}
function dockGaruda(g,s){
 s.life=0;
 if(g.p.id!=='yuki'||s.garudaFlightId!==g.garuda?.flightId)return;
 Object.assign(g.garuda,garudaOrbitPosition(g,g.garuda.phase||0),{inFlight:false,flightId:null});
}
export function reconcileGaruda(g){
 if(g.p.id!=='yuki')return null;
 g.garuda??=newGaruda(g);const companion=g.garuda,flight=activeFlight(g);
 companion.rulesVersion=2;companion.flightSerial??=0;companion.inFlight=!!flight;
 if(!flight){companion.flightId=null;return null;}
 hydrateShot(flight);
 if(flight.garudaFlightId==null)flight.garudaFlightId=++companion.flightSerial;
 companion.flightSerial=Math.max(companion.flightSerial,flight.garudaFlightId);companion.flightId=flight.garudaFlightId;flight.physicalGaruda=true;
 // The former projection system allowed several copies. Keep one physical
 // flight and merge their victim history so no already-hit enemy is struck twice.
 const previousHits=flight.hits.size;
 for(const other of g.shots||[])if(other!==flight&&other.type==='garuda'&&other.life>0){hydrateShot(other);for(const id of other.hits)flight.hits.add(id);for(const id of other.propHits)flight.propHits.add(id);other.life=0;other.returning=true;}
 flight.remaining=Math.max(0,flight.remaining-(flight.hits.size-previousHits));if(!flight.remaining)flight.returning=true;
 flightPose(g,flight);return flight;
}
export function updateGaruda(g,dt){
 if(g.p.id!=='yuki'){g.garuda=null;return;}
 // Migration and binding are safe while paused; clocks and positions stay frozen.
 const flight=reconcileGaruda(g);if(g.status!=='playing'||g.bossIntro)return;
 const s=g.garuda;s.age=(s.age||0)+dt;if(!g.p.reducedMotion)s.phase=(s.phase||0)+dt*1.35;
 if(!flight)Object.assign(s,garudaOrbitPosition(g,s.phase||0));
}
const visibleTarget=(g,e)=>e.hp>0&&distance(e,g.p)<=companionLeash(g)*.94;
function nextTarget(g,s,first=false){return g.enemies.filter(e=>visibleTarget(g,e)&&!s.hits.has(e.id)&&(first||distance(e,s)<=s.bounceRange)).reduce((best,e)=>!best||distance(e,s)<distance(best,s)?e:best,null);}
export function castGaruda(g,target,power){
 if(g.p.id==='yuki'&&reconcileGaruda(g))return false;
 const p=g.p,rank=p.weapons.garuda,fused=!!p.fusions.garuda,origin=g.garuda||{x:p.x,y:p.y-20},a=Math.atan2(target.y-origin.y,target.x-origin.x),stats=garudaStats(rank,fused);
 const s={type:'garuda',garudaRulesVersion:GARUDA_RULES_VERSION,x:origin.x,y:origin.y,ox:origin.x,oy:origin.y,vx:Math.cos(a)*stats.speed,vy:Math.sin(a)*stats.speed,age:0,life:stats.life,damage:28*power,rank,fused,mass:g.mechanic?.id==='yuki'&&g.mechanic.active>0,r:8,color:'#d9dfd0',hits:new Set(),propHits:new Set(),remaining:stats.maxHits,maxHits:stats.maxHits,bounceRange:stats.bounceRange,speed:stats.speed,targetId:target.kind!=='prop'&&visibleTarget(g,target)?target.id:null,targetProp:target.kind==='prop'?target.id:null,returning:false};
 if(p.id==='yuki'){s.physicalGaruda=true;s.garudaFlightId=++g.garuda.flightSerial;Object.assign(g.garuda,{inFlight:true,flightId:s.garudaFlightId});}
 g.shots.push(s);return s;
}
function returnHome(g,s,dt){
 const home=g.p.id==='yuki'?garudaOrbitPosition(g,g.garuda?.phase||0):{x:g.p.x,y:g.p.y-20},dx=home.x-s.x,dy=home.y-s.y,d=Math.hypot(dx,dy),step=Math.min(d,s.speed*1.35*dt);
 if(d<10||step>=d){s.x=home.x;s.y=home.y;dockGaruda(g,s);return;}
 s.vx=dx/(d||1)*s.speed;s.vy=dy/(d||1)*s.speed;s.x+=dx/(d||1)*step;s.y+=dy/(d||1)*step;flightPose(g,s);
}
function impact(g,s,e,{damage,burst}){
 s.hits.add(e.id);s.remaining--;heroMassHit(g);damage(g,e,s.damage,s.color);
 const d=Math.hypot(s.vx,s.vy)||1,k=(s.mass?240:120)*(e.boss?.25:1);e.kvx=(e.kvx||0)+s.vx/d*k;e.kvy=(e.kvy||0)+s.vy/d*k;
 const radius=(s.fused?72:30)*g.p.area*(s.mass?1.35:1);g.effects.push({type:'nova',x:e.x,y:e.y,r:radius,color:'#e9c28f',life:.3,max:.3});
 if(s.fused||s.mass)for(const other of g.enemies)if(other!==e&&other.hp>0&&distance(e,other)<radius){damage(g,other,s.damage*.45,s.color);applyStatus(other,'stun',.25);}
 damagePropsInRadius(g,e.x,e.y,radius,s.damage*.5);burst?.(g,e.x,e.y,'#e5dfc4',6,60);
}
export function updateGarudaShot(g,s,dt,callbacks){
 if(s.type!=='garuda')return false;if(g.status!=='playing'||g.bossIntro)return true;
 if(g.p.id==='yuki'){
  // This also supports direct calls and checkpoints predating the companion.
  if(!g.shots.includes(s)&&s.life>0)g.shots.push(s);
  if(reconcileGaruda(g)!==s)return true;
 }
 hydrateShot(s);if(s.life<=0)return true;s.age+=dt;s.life-=dt;s.ox=s.x;s.oy=s.y;
 if(s.life<=0){if(s.returning){dockGaruda(g,s);return true;}s.returning=true;s.targetId=null;s.targetProp=null;s.life=1.5;}
 const leash=companionLeash(g),away=distance(s,g.p);if(away>leash){const dx=s.x-g.p.x,dy=s.y-g.p.y;s.x=g.p.x+dx/away*leash;s.y=g.p.y+dy/away*leash;s.ox=s.x;s.oy=s.y;s.returning=true;}
 if(s.returning){returnHome(g,s,dt);return true;}
 let target=g.enemies.find(e=>e.id===s.targetId&&visibleTarget(g,e)&&!s.hits.has(e.id));
 if(!target&&!s.targetProp){target=nextTarget(g,s,s.hits.size===0);s.targetId=target?.id??null;}
 const prop=s.targetProp?g.world.active.find(o=>o.id===s.targetProp&&o.hp>0):null;
 if(!target&&!prop){s.returning=true;returnHome(g,s,dt);return true;}
 const aim=target||prop,dx=aim.x-s.x,dy=aim.y-s.y,d=Math.hypot(dx,dy)||1,step=Math.min(d,s.speed*dt);s.vx=dx/d*s.speed;s.vy=dy/d*s.speed;s.x+=dx/d*step;s.y+=dy/d*step;
 // Flight is swept between frames, so fast ricochets cannot tunnel through a victim.
 for(const o of g.world.active){if(o.hp<=0||s.propHits.has(o.id)||segmentDistance(o.x,o.y,s.ox,s.oy,s.x,s.y)>o.r+s.r*g.p.area)continue;s.propHits.add(o.id);damageProp(g,o,s.damage,s.vx*.15,s.vy*.15);if(!Number.isFinite(o.hp)||o.id===s.targetProp){s.returning=true;s.targetProp=null;flightPose(g,s);return true;}}
 const contact=g.enemies.filter(e=>visibleTarget(g,e)&&!s.hits.has(e.id)&&segmentDistance(e.x,e.y,s.ox,s.oy,s.x,s.y)<e.r+s.r*g.p.area).sort((a,b)=>distance(a,{x:s.ox,y:s.oy})-distance(b,{x:s.ox,y:s.oy}))[0];
 if(contact){impact(g,s,contact,callbacks);if(s.remaining<=0){s.returning=true;s.targetId=null;}else{const next=nextTarget(g,s);s.targetId=next?.id??null;if(!next)s.returning=true;}}
 flightPose(g,s);return true;
}
