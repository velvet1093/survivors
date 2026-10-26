import {applyStatus} from './status.js';
import {damagePropsInRadius,damageProp} from './world.js';
import {heroFateHit} from './hero-mechanics.js';
export function crimsonStrike(g,{x,y,angle,reach,power,arc=-.05,echo=false,ultimate=false},damage){
 let hit=false;g.effects.push({type:'crimson-strike',x,y,r:reach,angle,echo,fused:echo,ultimate,color:'#e3a1b7',life:.32,max:.32});
 for(const e of g.enemies){const dx=e.x-x,dy=e.y-y,d=Math.hypot(dx,dy);if(e.hp<=0||d>reach+e.r||Math.cos(Math.atan2(dy,dx)-angle)<arc)continue;
   damage(g,e,44*power,'#f0b7c7');if(echo||ultimate)applyStatus(e,'cursed',3);applyStatus(e,'stun',.25);
   const strength=(echo?150:110)*(e.boss?.2:1)/(d||1);e.kvx=(e.kvx||0)+dx*strength;e.kvy=(e.kvy||0)+dy*strength;hit=true;
 }
 if(ultimate)damagePropsInRadius(g,x,y,reach,44*power);else for(const o of g.world.active)if(o.hp>0&&Math.hypot(o.x-x,o.y-y)<reach+o.r&&Math.cos(Math.atan2(o.y-y,o.x-x)-angle)>=arc)damageProp(g,o,44*power);
 return hit;
}
export const crimsonReach=p=>(120+(p.weapons.crimson||1)*9+(p.fusions.crimson?35:0))*p.area;
export function castCrimson(g,target,power,damage){
 const p=g.p,rank=p.weapons.crimson,fused=!!p.fusions.crimson,reach=crimsonReach(p),angle=Math.atan2(target.y-p.y,target.x-p.x);
 if(crimsonStrike(g,{x:p.x,y:p.y,angle,reach,power},damage))heroFateHit(g);
 if(fused){g.crimsonEchoes??=[];g.crimsonEchoes.push({x:p.x,y:p.y,angle,reach,power:power*.55,delay:.2});}
}
export function updateCrimsonEchoes(g,dt,damage){
 if(g.ultimate?.type==='diavolo')return;
 for(const echo of g.crimsonEchoes||[]){echo.delay-=dt;if(echo.delay<=0)crimsonStrike(g,{...echo,echo:true},damage);}
 g.crimsonEchoes=(g.crimsonEchoes||[]).filter(e=>e.delay>0);
}
