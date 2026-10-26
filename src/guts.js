import {applyStatus,clearStatuses} from './status.js';
import {damageProp,damagePropsInRadius} from './world.js';

export const GUTS_ULTIMATE={name:'Berserker Armor',duration:8,color:'#dca3a1',description:'Don the black wolf armor for eight seconds: gain 35% damage, 15% movement speed and 25% damage resistance. Repeated Dragonslayer cleaves cut nearby enemies and a final circular strike throws them back. You still take damage; no HP is consumed. Mastery extends the armor and strengthens its strikes.'};
export function syncGutsArmor(g){if(g.p?.id!=='guts')return;g.p.form=g.ultimate?.type==='guts'?1:0;if(g.p.form)g.p.pose='berserk';else if(g.p.pose==='berserk')g.p.pose='';}
export function gainStruggle(g,amount){const m=g.mechanic;if(m?.id==='guts'&&amount>0)m.value=Math.min(100,m.value+amount*(1+(g.p.meta.struggleGain||0)));}
export function dragonslayerReach(p,area=1){return (p.fusions.dragonslayer?205:125+(p.weapons.dragonslayer||1)*10)*p.area*(1+(p.weapon==='dragonslayer'?(p.meta.signatureArea||0):0))*area;}
export function gutsAttackReach(g){return dragonslayerReach(g.p,g.mechanic?.id==='guts'&&g.mechanic.value>=100?1.2:1);}
function knock(e,x,y,strength){const dx=e.x-x,dy=e.y-y,d=Math.hypot(dx,dy)||1;e.kvx=dx/d*strength*(e.boss?.22:1);e.kvy=dy/d*strength*(e.boss?.22:1);}
function slashEffect(g,{angle,reach,empowered=false,fused=false,ultimate=false,full=false}){
 g.gutsSwing=(g.gutsSwing||0)+1;g.effects.push({type:'guts-slash',x:g.p.x,y:g.p.y-16,r:reach,angle,side:g.gutsSwing%2?1:-1,empowered,fused,ultimate,full,color:empowered||ultimate?'#e8b2ad':'#d2d8db',life:.5,max:.5});
}
export function castDragonslayer(g,target,power,boost,damage){
 const p=g.p,reach=dragonslayerReach(p,boost.area),angle=Math.atan2(target.y-p.y,target.x-p.x),fused=!!p.fusions.dragonslayer;
 p.attackTimer=.48;slashEffect(g,{angle,reach,empowered:!!boost.struggle,fused});let hits=0;
 for(const e of g.enemies)if(e.hp>0&&Math.hypot(e.x-p.x,e.y-p.y)<reach+e.r&&Math.cos(Math.atan2(e.y-p.y,e.x-p.x)-angle)>(fused?-.45:-.22)){
  damage(g,e,54*power,'#d9d9d5');applyStatus(e,'bleeding',fused?3.5:2,{power:power*(fused?6:3),source:'dragonslayer'});knock(e,p.x,p.y,boost.struggle?240:145);hits++;
 }
 for(const o of g.world.active)if(o.hp>0&&Math.hypot(o.x-p.x,o.y-p.y)<reach+o.r&&Math.cos(Math.atan2(o.y-p.y,o.x-p.x)-angle)>(fused?-.45:-.22))damageProp(g,o,60*power);
 if(hits)gainStruggle(g,18);return true;
}
export function startGutsUltimate(g){const p=g.p,u=g.ultimate;p.form=1;p.pose='berserk';u.name=GUTS_ULTIMATE.name;u.tick=0;u.pulses=0;clearStatuses(p);}
export function updateGutsUltimate(g,u,dt,{damage}){
 const p=g.p;p.form=1;p.pose='berserk';
 if(u.tick<=0&&u.age<u.duration-.2){
  let target=null;for(const e of g.enemies)if(e.hp>0&&Math.hypot(e.x-p.x,e.y-p.y)<220*p.area&&(!target||Math.hypot(e.x-p.x,e.y-p.y)<Math.hypot(target.x-p.x,target.y-p.y)))target=e;
  const angle=target?Math.atan2(target.y-p.y,target.x-p.x):p.aimAngle||0,reach=185*p.area*(1+(p.meta.ultimateArea||0));p.aimAngle=angle;p.attackTimer=.4;u.pulses++;
  slashEffect(g,{angle,reach,empowered:true,fused:!!p.fusions.dragonslayer,ultimate:true});
  for(const e of g.enemies)if(e.hp>0&&Math.hypot(e.x-p.x,e.y-p.y)<reach+e.r&&Math.cos(Math.atan2(e.y-p.y,e.x-p.x)-angle)>-.3){damage(g,e,32*p.damage,'#e6b4af');applyStatus(e,'bleeding',2,{power:4*p.damage*(1+(p.meta.ultimateDamage||0)),source:'berserker-armor'});knock(e,p.x,p.y,160);}
  damagePropsInRadius(g,p.x,p.y,reach,30*p.damage);u.tick=.8;
 }
 if(u.age>=u.duration-.15&&!u.impacted){
  u.impacted=true;const reach=230*p.area*(1+(p.meta.ultimateArea||0));slashEffect(g,{angle:p.aimAngle||0,reach,empowered:true,ultimate:true,full:true});
  for(const e of g.enemies)if(e.hp>0&&Math.hypot(e.x-p.x,e.y-p.y)<reach+e.r){damage(g,e,120*p.damage,'#f0c8be');knock(e,p.x,p.y,280);}damagePropsInRadius(g,p.x,p.y,reach,100*p.damage);
 }
}
