import {damagePropsInRadius,moveBody} from './world.js';

export const YUKI_CHARGE_SECONDS=2;
export const YUKI_ACTIVE_SECONDS=5;

export function prepareYukiUltimate(g){
 const u=g.ultimate;
 Object.assign(u,{rulesVersion:2,chargeDuration:YUKI_CHARGE_SECONDS,phase:'charging',charge:0,released:false,name:'Maximum: Black Hole · Charging'});
 g.p.pose='singularity-charge';g.mechanic.value=100;u.r=270*(1+(g.p.meta.ultimateArea||0));
}

export function updateYukiUltimate(g,dt,{damage,burst}){
 const u=g.ultimate,p=g.p;
 // Older checkpoints already had an active five-second hole: keep it active.
 if(!u.rulesVersion)Object.assign(u,{rulesVersion:2,chargeDuration:0,phase:'active',charge:1,released:true});
 const chargeDuration=u.chargeDuration||0;
 if(u.age<chargeDuration){u.phase='charging';u.charge=u.age/chargeDuration;u.tick=0;p.pose='singularity-charge';return;}
 const activeDt=Math.max(0,Math.min(u.age,u.duration)-Math.max(u.age-dt,chargeDuration));
 if(!u.released){
  u.released=true;u.phase='active';u.charge=1;u.name='Maximum: Black Hole';u.tick=0;
  if(!p.reducedMotion)g.shake=Math.max(g.shake||0,4);
  burst?.(g,u.x,u.y,'#eee6ce',p.reducedMotion?8:24,100);
 }
 p.pose='mass';u.phase=u.impacted?'collapsing':'active';
 for(const e of g.enemies){
  const dx=u.x-e.x,dy=u.y-e.y,d=Math.hypot(dx,dy);
  if(e.hp>0&&d<u.r&&d>12){const step=Math.min(d-12,170*activeDt*(e.boss?.16:1));moveBody(g,e,dx/d*step,dy/d*step,Math.min(e.r*.6,19));}
 }
 g.enemyShots=g.enemyShots.filter(s=>Math.hypot(s.x-u.x,s.y-u.y)>u.r*.6);
 // The shared engine callback applies ultimate mastery to enemy damage once.
 const power=p.damage;
 if(u.tick<=0){
  for(const e of g.enemies)if(e.hp>0&&Math.hypot(e.x-u.x,e.y-u.y)<u.r)damage(g,e,24*power,'#f5e6c9');
  damagePropsInRadius(g,u.x,u.y,u.r,25*power);u.tick=.45;
 }
 if(u.age>=u.duration-.2&&!u.impacted){
  u.impacted=true;u.phase='collapsing';
  for(const e of g.enemies)if(e.hp>0&&Math.hypot(e.x-u.x,e.y-u.y)<u.r)damage(g,e,150*power,'#fff1d4');
  burst?.(g,u.x,u.y,'#eee5cf',p.reducedMotion?10:32,140);
 }
}
