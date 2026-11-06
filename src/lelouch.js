import {applyStatus,clearStatuses,hasStatus} from './status.js';
import {damagePropsInRadius,moveBody} from './world.js';
import {effectivePassiveRank} from './game.js';

// Lelouch & C.C.'s kit.
// Absolute Command (Geass): the enemies nearest the target obey for a few seconds. They
// stop attacking the player, chase other enemies and strike them. Bosses are only stunned.
// The Power of the King commands twice as many, and each order ends with “Die”: the
// commanded enemy falls and bursts.
// C.C. follows Lelouch and fires her pistol at nearby enemies.
// Checkmate: kills fill the meter, and kills involving a commanded enemy fill it faster.
// When it is full, the next Geass commands every ordinary enemy in a wide radius.
// Gawain (ultimate): they board the knightmare together. It is untouchable, fires twin
// Hadron Cannons and lashes out with slash harkens.
export const GEASS_RANGE=240,MASS_COMMAND_RANGE=340,CC_RANGE=380;
export const GAWAIN_SECONDS=30,GAWAIN_KILL_TIME={normal:.4,elite:1,boss:4};
export const LELOUCH_ULTIMATE={name:'Gawain',duration:GAWAIN_SECONDS,color:'#d8304a',description:'Lelouch and C.C. board the Gawain for thirty seconds, and every kill keeps it in the field longer: +0.4 seconds per ordinary enemy, +1 per elite and +4 per boss, up to thirty seconds remaining. C.C. pilots and Lelouch commands. The knightmare is untouchable, fires its twin Hadron Cannons through the crowd every 1.4 seconds and lashes the four nearest enemies with slash harkens twice a second.'};
const commanded=e=>(e.geass||0)>0;
export function geassDuration(g,rank){return 2.6+rank*.3+(g.p.meta?.geassDuration||0);}
function command(g,e,{power,rank,fused,damage}){
 if(e.boss||e.riftBoss){damage(g,e,30*power,'#ff5a6a');applyStatus(e,'stun',.5);return false;}
 const time=geassDuration(g,rank);e.geass=time;e.geassMax=time;e.geassPower=power;e.geassDie=fused;e.geassTick=0;applyStatus(e,'stun',time);damage(g,e,12*power,'#ff5a6a');return true;
}
export function castGeass(g,target,{power,rank,fused,damage,effect}){
 const p=g.p,m=g.mechanic,mass=m?.id==='lelouch'&&m.value>=m.max;
 const from={x:target.x,y:target.y},range=(mass?MASS_COMMAND_RANGE:GEASS_RANGE)*p.area;
 let pool=g.enemies.filter(e=>e.hp>0&&!commanded(e)&&Math.hypot(e.x-from.x,e.y-from.y)<range+(e.r||0));
 if(mass){pool=pool.filter(e=>!e.boss&&!e.riftBoss).concat(pool.filter(e=>e.boss||e.riftBoss));}
 else{const n=(1+Math.ceil(rank/2)+(p.meta?.geassTargets||0))*(fused?2:1);pool=pool.sort((a,b)=>Math.hypot(a.x-from.x,a.y-from.y)-Math.hypot(b.x-from.x,b.y-from.y)).slice(0,n);}
 if(target.hp>0&&!pool.includes(target)&&!commanded(target)&&Number.isFinite(target.maxHp)&&!mass)pool[0]=target;
 const hits=[];for(const e of pool){if(!e||e.hp<=0)continue;command(g,e,{power,rank,fused,damage});hits.push({x:e.x,y:e.y});}
 if(mass){m.value=0;m.serial=(m.serial||0)+1;g.toast='CHECKMATE · ALL OF YOU, OBEY ME!';g.toastTime=3;g.shake=Math.max(g.shake||0,6);
  g.effects.push({type:'geass-mass',x:p.x,y:p.y,r:range,life:1,max:1});}
 effect(g,'geass-command',{x:p.x,y:p.y-34,targets:hits,mass,life:.45,max:.45});
 return true;
}
// C.C. stays at Lelouch's shoulder and fires her pistol at whatever comes close.
export function updatePartner(g,dt){
 const p=g.p,cc=g.partner||(g.partner={x:p.x-24,y:p.y-4,facing:1,walk:0,moving:false,cd:.4,attackTimer:0,aimAngle:0});
 const hx=p.x-(p.facing||1)*24,hy=p.y-5,dx=hx-cc.x,dy=hy-cc.y,d=Math.hypot(dx,dy);
 if(d>320){cc.x=hx;cc.y=hy;}else{const k=Math.min(1,dt*7);cc.x+=dx*k;cc.y+=dy*k;}
 const speed=d*7;cc.moving=speed>20&&d>3;if(cc.moving){cc.walk+=dt*9;if(Math.abs(dx)>2)cc.facing=dx<0?-1:1;}
 cc.attackTimer=Math.max(0,cc.attackTimer-dt);if(cc.attackTimer>0)cc.facing=Math.cos(cc.aimAngle)<0?-1:1;
 return cc;
}
export function updateLelouch(g,dt,{damage,burst,shoot}){
 const p=g.p;if(p.id!=='lelouch')return;
 const cc=updatePartner(g,dt);
 if(g.ultimate?.type!=='lelouch'){
  cc.cd-=dt;
  const rank=Math.max(1,effectivePassiveRank(p,'witchcode')),fused=!!p.fusions?.geass;
  if(cc.cd<=0){let t=null,best=CC_RANGE;for(const e of g.enemies){if(e.hp<=0||commanded(e))continue;const dd=Math.hypot(e.x-cc.x,e.y-cc.y);if(dd<best){best=dd;t=e;}}
   if(t){cc.cd=(.72-rank*.06)*p.cooldown;const y=cc.y-26,aim=Math.atan2(t.y-y,t.x-cc.x);cc.aimAngle=aim;cc.attackTimer=.25;
    for(const off of fused?[-.06,.06]:[0]){const a=aim+off,q=shoot(g,'ccshot',cc.x+Math.cos(aim)*12,y,a,(10+rank*3)*p.damage,rank,fused);q.vx=Math.cos(a)*560;q.vy=Math.sin(a)*560;q.r=4;q.pierce=fused?1:0;q.color='#a8f080';}
    g.effects.push({type:'cc-muzzle',x:cc.x+Math.cos(aim)*16,y:y+Math.sin(aim)*16,angle:aim,life:.1,max:.1});}
   else cc.cd=.15;}
 }
 // Commanded enemies chase the nearest free enemy and strike it.
 for(const e of g.enemies){
  if(!commanded(e))continue;if(e.hp<=0){e.geass=0;continue;}
  e.geass-=dt;e.geassTick-=dt;
  let foe=null,best=320;for(const o of g.enemies){if(o===e||o.hp<=0||commanded(o))continue;const dd=Math.hypot(o.x-e.x,o.y-e.y);if(dd<best){best=dd;foe=o;}}
  if(foe&&best>(e.r||10)+(foe.r||10)+4){const step=Math.max(70,(e.speed||60)*1.25)*dt;moveBody(g,e,(foe.x-e.x)/best*step,(foe.y-e.y)/best*step,Math.min((e.r||10)*.6,19));e.moving=true;e.facing=foe.x<e.x?-1:1;}
  if(e.geassTick<=0){e.geassTick=.45;const reach=(e.r||10)+22;
   for(const o of g.enemies)if(o!==e&&o.hp>0&&!commanded(o)&&Math.hypot(o.x-e.x,o.y-e.y)<reach+(o.r||10)){damage(g,o,16*e.geassPower,'#ff7a8a');if(o.hp<=0)o.commandedKill=true;}
   }
  if(e.geass<=0){e.geass=0;if(hasStatus(e,'stun'))clearStatuses(e,['stun']);
   if(e.geassDie){const r=70*p.area;g.effects.push({type:'geass-die',x:e.x,y:e.y,r,life:.5,max:.5});
    for(const o of g.enemies)if(o!==e&&o.hp>0&&Math.hypot(o.x-e.x,o.y-e.y)<r+(o.r||10)){damage(g,o,40*e.geassPower,'#ff4a6a');if(o.hp<=0)o.commandedKill=true;}
    e.commandedKill=true;damage(g,e,e.hp+1,'#ff4a6a');burst(g,e.x,e.y,'#ff4a6a',10,120);}}
 }
}
// Kills during the Gawain extend it, never past thirty seconds remaining.
export function extendGawain(g,e){
 const u=g.ultimate;if(u?.type!=='lelouch')return 0;const add=e?.boss?GAWAIN_KILL_TIME.boss:e?.elite?GAWAIN_KILL_TIME.elite:GAWAIN_KILL_TIME.normal;
 const before=u.duration;u.duration=Math.min(u.age+GAWAIN_SECONDS+(g.p.meta?.ultimateDuration||0),u.duration+add);return u.duration-before;
}
export function lelouchKill(g,e){
 extendGawain(g,e);
 const m=g.mechanic;if(m?.id!=='lelouch'||m.value>=m.max)return;
 const base=e?.boss?30:e?.commandedKill||commanded(e)?10:3;
 m.value=Math.min(m.max,m.value+base*(1+effectivePassiveRank(g.p,'witchcode')*.1+(g.p.meta?.checkmateGain||0)));
 if(m.value>=m.max){g.toast='CHECKMATE READY · THE NEXT GEASS COMMANDS THEM ALL';g.toastTime=2.5;}
}
export const isCommanded=commanded;
export function startGawain(g){
 const p=g.p,u=g.ultimate;p.pose='gawain';clearStatuses(p);u.tick=.5;u.harken=.2;u.r=620*p.area*(1+(p.meta.ultimateArea||0));
 g.toast='GAWAIN · C.C. PILOTS, LELOUCH COMMANDS';g.toastTime=3;g.shake=Math.max(g.shake||0,6);
 g.effects.push({type:'gawain-land',x:p.x,y:p.y,r:120,life:.7,max:.7});
}
export function updateGawain(g,u,dt,{damage,burst}){
 const p=g.p;p.pose='gawain';g.invuln=Math.max(g.invuln||0,.35);
 // The cooldown waits for the knightmare to leave the field.
 g.special=Math.max(g.special||0,g.specialMax||0);u.tick-=dt;p.gawainFiring=Math.max(0,(p.gawainFiring||0)-dt);u.harken-=dt;
 const alive=g.enemies.filter(e=>e.hp>0).sort((a,b)=>Math.hypot(a.x-p.x,a.y-p.y)-Math.hypot(b.x-p.x,b.y-p.y));
 if(u.tick<=0){u.tick=1.4;const t=alive[0],sy=p.y-62,aim=t?Math.atan2(t.y-sy,t.x-p.x):(p.facing<0?Math.PI:0),len=u.r||620,width=26;
  for(const side of [-1,1]){const ox=p.x+side*16,oy=sy,cx=Math.cos(aim),cy=Math.sin(aim);
   for(const e of g.enemies){if(e.hp<=0)continue;const rx=e.x-ox,ry=e.y-oy,along=rx*cx+ry*cy;if(along<0||along>len)continue;if(Math.abs(rx*-cy+ry*cx)<width+(e.r||10))damage(g,e,110*p.damage,'#ff6a8a');}
   damagePropsInRadius(g,ox+cx*len*.5,oy+cy*len*.5,width*2,90*p.damage);}
  p.gawainFiring=.45;g.effects.push({type:'hadron',x:p.x,y:sy,angle:aim,length:len,life:.55,max:.55});g.shake=Math.max(g.shake||0,4);p.facing=Math.cos(aim)<0?-1:1;}
 if(u.harken<=0){u.harken=.5;const hits=alive.filter(e=>Math.hypot(e.x-p.x,e.y-p.y)<300).slice(0,4);
  for(const e of hits){damage(g,e,45*p.damage,'#ffd27a');if(!e.boss)applyStatus(e,'stun',.3);}
  if(hits.length)g.effects.push({type:'harken',x:p.x,y:p.y-40,targets:hits.map(e=>({x:e.x,y:e.y-(e.r||10)})),life:.3,max:.3});
  if(hits.length)burst(g,hits[0].x,hits[0].y,'#ffd27a',5,80);}
}
