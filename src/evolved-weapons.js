import {applyStatus} from './status.js';
import {damagePropsInRadius,damageProp,pointCollider,segmentDistance} from './world.js';
const distance=(a,b)=>Math.hypot(a.x-b.x,a.y-b.y);
export function castEvolvedWeapon(g,weapon,target,power){
 if(!['odmblades','pallet'].includes(weapon)||!g.p.fusions[weapon])return false;
 const p=g.p,y=p.y-24,aim=Math.atan2(target.y-y,target.x-p.x),longinus=weapon==='pallet';
 for(let i=0;i<(longinus?1:2);i++){const a=aim+(longinus?0:(i-.5)*.13),speed=longinus?620:490;
  g.shots.push({type:longinus?'longinus':'thunderspear',sourceWeapon:weapon,x:p.x+Math.cos(a)*14,y,ox:p.x,oy:y,vx:Math.cos(a)*speed,vy:Math.sin(a)*speed,age:0,life:longinus?3.5:1.6,delay:longinus?0:i*.12,r:longinus?6:4,rank:p.weapons[weapon],fused:true,damage:(longinus?46:38)*power,color:longinus?'#ea8895':'#edce8b',hits:new Set(),returnHits:new Set(),power,blastRadius:82*p.area,returning:false});
 }
 return true;
}
function thunderBlast(g,s,{damage,burst}){
 if(s.exploded)return;s.exploded=true;s.life=0;
 g.effects.push({type:'thunder-blast',x:s.x,y:s.y,r:s.blastRadius,color:'#efd59b',life:.42,max:.42});
 for(const e of g.enemies)if(e.hp>0&&distance(e,s)<s.blastRadius+e.r){e.armorTime=0;damage(g,e,s.damage,s.color);applyStatus(e,'stun',.45);applyStatus(e,'bleeding',2.5,{power:s.damage*.08,source:'thunder-spears'});const d=distance(e,s)||1;e.kvx=(e.x-s.x)/d*105;e.kvy=(e.y-s.y)/d*105;}
 damagePropsInRadius(g,s.x,s.y,s.blastRadius,s.damage);burst(g,s.x,s.y,'#eecb8d',18,170);g.shake=Math.max(g.shake,3);
}
// These shots own their movement so their collision can use the whole traveled segment.
export function updateEvolvedShot(g,s,dt,api){
 if(!['longinus','thunderspear'].includes(s.type))return false;
 s.age+=dt;s.life-=dt;if(s.age<(s.delay||0))return true;
 if(s.type==='thunderspear'&&s.stuck){
  const host=s.stuckEnemy?g.enemies.find(e=>e.id===s.stuckId):g.world.active.find(o=>o.id===s.stuckId);if(host){s.x=host.x;s.y=host.y-5;}s.fuse-=dt;if(s.fuse<=0||s.life<=0)thunderBlast(g,s,api);return true;
 }
 if(s.life<=0){if(s.type==='thunderspear')thunderBlast(g,s,api);return true;}
 if(s.type==='longinus'&&s.age>=.9&&!s.returning){s.returning=true;}
 if(s.returning){const dx=g.p.x-s.x,dy=g.p.y-24-s.y,d=Math.hypot(dx,dy)||1;if(d<680*dt+10){s.life=0;return true;}s.vx=dx/d*680;s.vy=dy/d*680;}
 s.ox=s.x;s.oy=s.y;s.x+=s.vx*dt;s.y+=s.vy*dt;
 if(s.type==='thunderspear'){
  const obstacle=pointCollider(g,s.x,s.y,s.r);if(obstacle){s.stuck=true;s.stuckId=obstacle.id;s.stuckEnemy=false;s.fuse=.32;s.vx=0;s.vy=0;return true;}
  for(const e of g.enemies)if(e.hp>0&&segmentDistance(e.x,e.y,s.ox,s.oy,s.x,s.y)<e.r+s.r){s.stuck=true;s.stuckId=e.id;s.stuckEnemy=true;s.fuse=.32;api.damage(g,e,s.damage*.15,s.color);s.vx=0;s.vy=0;break;}
 }else{
  const hits=s.returning?s.returnHits:s.hits;
  for(const e of g.enemies)if(e.hp>0&&!hits.has(e.id)&&segmentDistance(e.x,e.y,s.ox,s.oy,s.x,s.y)<e.r+s.r*g.p.area){hits.add(e.id);api.damage(g,e,s.damage*(s.returning?.55:1),s.color);applyStatus(e,'cursed',3);applyStatus(e,'stun',.3);api.burst(g,e.x,e.y,'#edb0b6',5,80);}
  for(const o of g.world.active)if(o.hp>0&&Number.isFinite(o.hp)&&!hits.has(o.id)&&segmentDistance(o.x,o.y,s.ox,s.oy,s.x,s.y)<o.r+s.r){hits.add(o.id);damageProp(g,o,s.damage*(s.returning?.55:1));}
 }
 return true;
}
