import {bowPose} from './bow.js';
import {applyStatus} from './status.js';
import {damagePropsInRadius,segmentDistance} from './world.js';

export const SALVATION_COLORS=['#f6add5','#a5dafa','#f5d48b','#ee9a9f','#c7b1ed'];
const SPEED=540,MAX_HITS=4,LIFETIME=2.5;
const distance=(a,b)=>Math.hypot(a.x-b.x,a.y-b.y);
const live=g=>g.enemies.filter(e=>e.hp>0);
const effect=(g,type,data)=>g.effects.push({type,life:.45,max:.45,...data});

// Rank, fusion, hero and empowered-cast damage enter once through power. The
// five wishes retain Threads of Hope and signature projectile mastery bonuses.
export function castSalvation(g,id,target,power,boost={},api){
 if(id!=='rosebow'||g.p.fusions.rosebow!=='salvation')return false;
 if(!target||target.hp<=0||!Number.isFinite(power)||power<=0)return false;
 const p=g.p,area=p.area*(boost.area||1)*(id===p.weapon?1+(p.meta?.signatureArea||0):1);
 p.aimAngle=Math.atan2(target.y-(p.y-20),target.x-p.x);
 const count=Math.min(20,5+Math.max(0,Math.floor(boost.projectiles||0))+Math.max(0,Math.floor(id===p.weapon?p.meta?.projectiles||0:0))),pinkCount=Math.ceil(count/5);
 const bow=bowPose(p),origin=bow.muzzle,others=live(g).filter(e=>e.id!==target.id&&distance(e,p)<=950).sort((a,b)=>distance(a,target)-distance(b,target)),targets=[target,...others];
 for(let i=0;i<count;i++){
  const mark=targets[i%targets.length],angle=Math.atan2(mark.y-origin.y,mark.x-origin.x)+(i-(count-1)/2)*.13;
  g.shots.push({id:++g.id,type:'salvation-arrow',sourceWeapon:'rosebow',x:origin.x,y:origin.y,ox:origin.x,oy:origin.y,vx:Math.cos(angle)*SPEED,vy:Math.sin(angle)*SPEED,targetId:mark.id,colorIndex:i%5,color:SALVATION_COLORS[i%5],age:0,life:LIFETIME,max:LIFETIME,r:6*area,blastRadius:90*area,rank:p.weapons.rosebow,fused:true,holy:true,damage:38*power,blastDamage:38*power*.35,hits:new Set(),pierce:MAX_HITS,healed:0,healCap:2/pinkCount});
 }
 effect(g,'salvation-cast',{x:origin.x,y:origin.y,r:48*area,colorIndex:0,color:SALVATION_COLORS[0],colors:[...SALVATION_COLORS],life:.6,max:.6,angle:p.aimAngle});
 return true;
}
function guide(g,s,elapsed){
 const candidates=live(g).filter(e=>!s.hits.has(e.id)&&distance(e,s)<=950);
 const target=candidates.find(e=>e.id===s.targetId)||candidates.sort((a,b)=>distance(a,s)-distance(b,s))[0];
 if(!target)return;
 s.targetId=target.id;const angle=Math.atan2(target.y-s.y,target.x-s.x),blend=1-Math.exp(-7*elapsed);
 let vx=s.vx+(Math.cos(angle)*SPEED-s.vx)*blend,vy=s.vy+(Math.sin(angle)*SPEED-s.vy)*blend;
 const length=Math.hypot(vx,vy)||1;s.vx=vx/length*SPEED;s.vy=vy/length*SPEED;
}
function wishStatus(e,s){
 if(s.colorIndex===1)applyStatus(e,'slow',1,{power:.35});
 else if(s.colorIndex===2)applyStatus(e,'stun',.3);
 else if(s.colorIndex===3)applyStatus(e,'burning',2,{power:s.damage*.1,source:s.id});
 else if(s.colorIndex===4)applyStatus(e,'cursed',2);
}
function impact(g,s,e,api){
 const before=e.hp;api.damage(g,e,s.damage,s.color);
 if(e.hp>=before)return;
 wishStatus(e,s);
 if(s.colorIndex===0){const heal=Math.min(.5,Math.max(0,s.healCap-s.healed),Math.max(0,g.p.maxHp-g.p.hp));g.p.hp+=heal;s.healed+=heal;}
 for(const other of live(g))if(other.id!==e.id&&distance(other,e)<s.blastRadius+(other.r||0)){
  const hp=other.hp;api.damage(g,other,s.blastDamage,s.color);if(other.hp<hp)wishStatus(other,s);
 }
 damagePropsInRadius(g,e.x,e.y,s.blastRadius,s.blastDamage);
 effect(g,'salvation-bloom',{x:e.x,y:e.y,r:s.blastRadius,colorIndex:s.colorIndex,color:s.color,colors:[...SALVATION_COLORS],angle:Math.atan2(s.vy,s.vx)});
 api.burst?.(g,e.x,e.y,s.color,5,85);
}
export function updateSalvationShot(g,s,dt,api){
 if(s.type!=='salvation-arrow')return false;
 if(s.life<=0)return true;
 const elapsed=Math.min(s.life,Math.max(0,Number.isFinite(dt)?dt:0));
 if(elapsed<=0)return true;
 s.age+=elapsed;s.life=Math.max(0,s.life-elapsed);
 guide(g,s,elapsed);s.ox=s.x;s.oy=s.y;s.x+=s.vx*elapsed;s.y+=s.vy*elapsed;
 // Swept collisions cannot pass through small enemies during a long frame.
 // Candidates remain finite and each arrow can cause at most four impacts.
 const crossed=live(g).filter(e=>!s.hits.has(e.id)&&segmentDistance(e.x,e.y,s.ox,s.oy,s.x,s.y)<(e.r||0)+s.r).sort((a,b)=>distance(a,{x:s.ox,y:s.oy})-distance(b,{x:s.ox,y:s.oy}));
 for(const e of crossed){
  if(e.hp<=0)continue;s.hits.add(e.id);impact(g,s,e,api);
  if(--s.pierce<=0){s.life=0;break;}
 }
 return true;
}
