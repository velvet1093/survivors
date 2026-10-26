import {applyStatus} from './status.js';
import {heroPredation} from './hero-mechanics.js';
import {pointCollider,damagePropsInRadius,moveBody} from './world.js';
const distance=(a,b)=>Math.hypot(a.x-b.x,a.y-b.y);
export function castBlackFlame(g,target,power){
 const p=g.p,rank=p.weapons.blackflame,fused=!!p.fusions.blackflame,n=1+(rank>=3?1:0)+(rank>=5?1:0)+(fused?1:0),aim=Math.atan2(target.y-p.y+20,target.x-p.x);
 for(let i=0;i<n;i++){const angle=aim+(i-(n-1)/2)*.17;g.shots.push({type:'blackflame',x:p.x,y:p.y-20,ox:p.x,oy:p.y-20,vx:Math.cos(angle)*380,vy:Math.sin(angle)*380,r:7,life:2.1,age:0,damage:23*power,rank,fused,hits:new Set(),targetId:target.kind==='prop'?null:target.id,color:'#a5d9f0',delay:i*.065});}
}
function impact(g,s,{damage,burst}){
 if(s.impacted)return;s.impacted=true;s.life=0;const radius=(32+s.rank*7+(s.fused?24:0))*g.p.area;
 g.effects.push({type:'nova',x:s.x,y:s.y,r:radius,color:'#9ccfeb',life:.32,max:.32});damagePropsInRadius(g,s.x,s.y,radius,s.damage*.6);
 for(const e of g.enemies)if(e.hp>0&&distance(e,s)<radius+e.r){damage(g,e,s.damage,'#b9e7ee');applyStatus(e,'burning',s.fused?4:2.5,{power:s.damage*.13,source:'blackflame'});if(s.fused){applyStatus(e,'cursed',3);const d=distance(e,s);if(d>8)moveBody(g,e,(s.x-e.x)/d*Math.min(35,d-8)*(e.boss?.15:1),(s.y-e.y)/d*Math.min(35,d-8)*(e.boss?.15:1),Math.min(e.r*.6,19));}}
 burst(g,s.x,s.y,'#9dc9e9',7,80);
}
export function updateBlackFlame(g,s,dt,callbacks){
 if(s.type!=='blackflame')return false;s.age+=dt;s.life-=dt;if(s.delay&&s.age<s.delay)return true;
 const candidates=g.enemies.filter(e=>e.hp>0&&distance(e,g.p)<700);let target=candidates.find(e=>e.id===s.targetId);if(!target){target=candidates.sort((a,b)=>distance(a,s)-distance(b,s))[0];s.targetId=target?.id;}
 if(target){const a=Math.atan2(target.y-s.y,target.x-s.x),blend=Math.min(1,dt*7);s.vx+=(Math.cos(a)*400-s.vx)*blend;s.vy+=(Math.sin(a)*400-s.vy)*blend;}
 s.ox=s.x;s.oy=s.y;s.x+=s.vx*dt;s.y+=s.vy*dt;const obstacle=pointCollider(g,s.x,s.y,s.r*g.p.area);if(obstacle){impact(g,s,callbacks);return true;}
 for(const e of candidates)if(distance(e,s)<e.r+s.r*g.p.area){impact(g,s,callbacks);break;}
 if(s.life<=0&&!s.impacted)impact(g,s,callbacks);return true;
}
export function updateGluttony(g,dt,{damage,burst}){
 const p=g.p,u=g.ultimate;p.pose='predator';u.x=p.x;u.y=p.y;
 const before=g.enemyShots.length;g.enemyShots=g.enemyShots.filter(s=>distance(s,p)>u.r*.68);const absorbed=before-g.enemyShots.length;if(absorbed)heroPredation(g,absorbed*3);
 for(const e of g.enemies){const d=distance(e,p);if(e.hp>0&&d<u.r&&d>16){const step=Math.min(d-16,130*dt*(e.boss?.15:1));moveBody(g,e,(p.x-e.x)/d*step,(p.y-e.y)/d*step,Math.min(e.r*.6,19));}}
 if(u.tick<=0){for(const e of g.enemies)if(e.hp>0&&distance(e,p)<u.r){const execute=!e.boss&&e.hp<=e.maxHp*.2;damage(g,e,execute?e.hp*2:21*p.damage,'#b5e3ef');if(execute&&e.hp<=0){const heal=Math.min(4,30-(u.healed||0));p.hp=Math.min(p.maxHp,p.hp+heal);u.healed=(u.healed||0)+heal;burst(g,e.x,e.y,'#bfdfe4',8,50);}}damagePropsInRadius(g,p.x,p.y,u.r,20*p.damage);u.tick=.4;}
}
