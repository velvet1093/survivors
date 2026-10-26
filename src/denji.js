import {applyStatus,clearStatuses} from './status.js';
import {damageProp,damagePropsInRadius} from './world.js';

export const DENJI_ULTIMATE={name:'Chainsaw Man',duration:8,color:'#e8a178',description:'Pull the starter cord and transform into Chainsaw Man for eight seconds: gain 30% damage, 12% movement speed and 20% damage resistance. Rapid nearby chainsaw sweeps inflict bleeding. A sweep that actually damages an enemy restores 2 HP, capped at 24 HP per activation; supplies and missed cuts never heal you. Finish with a broad crosscut. You still take damage, and bosses cannot be executed.'};
export function syncDenjiForm(g){if(g.p?.id!=='denji')return;g.p.form=g.ultimate?.type==='denji'?1:0;if(g.p.form)g.p.pose='chainsaw';else if(g.p.pose==='chainsaw')g.p.pose='';}
export function gainRev(g,amount){if(g.mechanic?.id!=='denji'||!(amount>0))return;g.mechanic.value=Math.min(100,g.mechanic.value+amount*(1+(g.p.passives.bloodengine||0)*.1+(g.p.meta.revGain||0)));}
export function chainsawReach(p,area=1){return (p.fusions.chainsaw?175:90+(p.weapons.chainsaw||1)*10)*p.area*(1+(p.weapon==='chainsaw'?(p.meta.signatureArea||0):0))*area;}
export function denjiAttackReach(g){return chainsawReach(g.p,g.mechanic?.id==='denji'&&g.mechanic.value>=100?1.2:1);}
function knock(e,x,y,strength){const dx=e.x-x,dy=e.y-y,d=Math.hypot(dx,dy)||1;e.kvx=dx/d*strength*(e.boss?.2:1);e.kvy=dy/d*strength*(e.boss?.2:1);}
function slash(g,{angle,reach,empowered=false,fused=false,ultimate=false,full=false}){
 g.denjiSwing=(g.denjiSwing||0)+1;g.effects.push({type:'denji-slash',x:g.p.x,y:g.p.y-16,r:reach,angle,side:g.denjiSwing%2?1:-1,empowered,fused,ultimate,full,color:empowered||ultimate?'#edb08b':'#d9ded9',life:ultimate?.4:.34,max:ultimate?.4:.34});
}
export function castChainsaw(g,target,power,boost,damage){
 const p=g.p,reach=chainsawReach(p,boost.area),angle=Math.atan2(target.y-p.y,target.x-p.x),fused=!!p.fusions.chainsaw;
 p.attackTimer=.32;slash(g,{angle,reach,empowered:!!boost.rev,fused});let hits=0;
 for(const e of g.enemies)if(e.hp>0&&Math.hypot(e.x-p.x,e.y-p.y)<reach+e.r&&Math.cos(Math.atan2(e.y-p.y,e.x-p.x)-angle)>(fused?-.3:.05)){
  const hp=e.hp;damage(g,e,(fused?43:36)*power,'#e7bc9c');if(e.hp<hp){applyStatus(e,'bleeding',fused?3.5:2,{power:power*(fused?5:2.5),source:'chainsaw'});knock(e,p.x,p.y,boost.rev?145:75);hits++;}
 }
 for(const o of g.world.active)if(o.hp>0&&Math.hypot(o.x-p.x,o.y-p.y)<reach+o.r&&Math.cos(Math.atan2(o.y-p.y,o.x-p.x)-angle)>(fused?-.3:.05))damageProp(g,o,42*power);
 if(hits)gainRev(g,16);return true;
}
export function startDenjiUltimate(g){const p=g.p,u=g.ultimate;p.form=1;p.pose='chainsaw';u.name=DENJI_ULTIMATE.name;u.tick=0;u.pulses=0;u.healed=0;clearStatuses(p);}
function bloodRecovery(g,u,connected){if(!connected)return;const p=g.p,amount=Math.min(2,Math.max(0,24-(u.healed||0)),Math.max(0,p.maxHp-p.hp));if(amount>0){p.hp+=amount;u.healed=(u.healed||0)+amount;}}
export function updateDenjiUltimate(g,u,dt,{damage}){
 const p=g.p;p.form=1;p.pose='chainsaw';
 if(u.tick<=0&&u.age<u.duration-.15){
  let target=null;for(const e of g.enemies)if(e.hp>0&&Math.hypot(e.x-p.x,e.y-p.y)<200*p.area&&(!target||Math.hypot(e.x-p.x,e.y-p.y)<Math.hypot(target.x-p.x,target.y-p.y)))target=e;
  const angle=target?Math.atan2(target.y-p.y,target.x-p.x):p.aimAngle||0,reach=150*p.area*(1+(p.meta.ultimateArea||0));p.aimAngle=angle;p.attackTimer=.3;u.pulses++;
  slash(g,{angle,reach,empowered:true,fused:!!p.fusions.chainsaw,ultimate:true});let connected=false;
  for(const e of g.enemies)if(e.hp>0&&Math.hypot(e.x-p.x,e.y-p.y)<reach+e.r&&Math.cos(Math.atan2(e.y-p.y,e.x-p.x)-angle)>-.15){
   const hp=e.hp;damage(g,e,24*p.damage,'#e8b18d');if(e.hp<hp){connected=true;applyStatus(e,'bleeding',2,{power:3*p.damage*(1+(p.meta.ultimateDamage||0)),source:'chainsaw-man'});knock(e,p.x,p.y,65);}
  }
  bloodRecovery(g,u,connected);damagePropsInRadius(g,p.x,p.y,reach,18*p.damage);u.tick=.45;
 }
 if(u.age>=u.duration-.13&&!u.impacted){
  u.impacted=true;const reach=195*p.area*(1+(p.meta.ultimateArea||0));slash(g,{angle:p.aimAngle||0,reach,empowered:true,ultimate:true,full:true});
  for(const e of g.enemies)if(e.hp>0&&Math.hypot(e.x-p.x,e.y-p.y)<reach+e.r){damage(g,e,70*p.damage,'#f0c39f');knock(e,p.x,p.y,175);}damagePropsInRadius(g,p.x,p.y,reach,60*p.damage);
 }
}
