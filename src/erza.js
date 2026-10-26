import {applyStatus,clearStatuses,statusModifiers} from './status.js';
import {damageProp,damagePropsInRadius,segmentDistance} from './world.js';

export const ERZA_FORMS=[
 {id:'wheel',name:'Heaven’s Wheel',color:'#d9e5ed',description:'Piercing ranged swords. Balanced movement and defense.',move:1,resistance:1,cadence:1},
 {id:'blackwing',name:'Black Wing',color:'#b99fd6',description:'Fast close-range bleeding cuts and +22% movement; take 8% more damage.',move:1.22,resistance:1.08,cadence:.78},
 {id:'adamantine',name:'Adamantine',color:'#a9d7e5',description:'Heavy stunning shield bashes, 30% damage resistance and a stored barrier; move 18% slower.',move:.82,resistance:.7,cadence:1.35},
 // Appended so existing checkpoints keep the original armor indices.
 {id:'base',name:'Heart Kreuz',color:'#b4c9de',description:'Erza’s starting silver armor and blue skirt. A balanced single-sword cleave, with normal movement and no special armor bonus.',move:1,resistance:1,cadence:1},
];
const distance=(a,b)=>Math.hypot(a.x-b.x,a.y-b.y);
export const erzaForm=g=>ERZA_FORMS[g.p.id==='erza'?Math.max(0,Math.min(ERZA_FORMS.length-1,Math.floor(g.mechanic?.form||0))):0];
export const erzaSwitchCooldown=p=>Math.max(1,3*(1-(p.meta?.requipCooldown||0)));
export function requipReach(g){const p=g.p,form=erzaForm(g),rank=p.weapons.requip||1;return form.id==='wheel'?Infinity:(form.id==='blackwing'?145+rank*8:form.id==='base'?125+rank*7:115+rank*7)*p.area*(p.fusions.requip?1.22:1);}
export function newErzaMechanic(){return {form:3,switchCD:0,switchMax:3,barrier:30,barrierMax:30,barrierAge:0,requipAge:0};}
export function switchErzaForm(g,requestedIndex){
 if(g.p.id!=='erza'||g.status!=='playing'||g.bossIntro||g.ultimate||g.dash||!statusModifiers(g.p).canAct||(g.mechanic.switchCD||0)>0)return false;
 const next=requestedIndex===undefined?((g.mechanic.form||0)+1)%ERZA_FORMS.length:requestedIndex;
 if(!Number.isInteger(next)||next<0||next>=ERZA_FORMS.length||next===g.mechanic.form)return false;
 const m=g.mechanic;m.form=next;g.p.erzaForm=next;m.switchMax=erzaSwitchCooldown(g.p);m.switchCD=m.switchMax;m.requipAge=.45;m.serial++;g.p.pose='requip';
 g.effects.push({type:'erza-requip',x:g.p.x,y:g.p.y-22,r:68,color:ERZA_FORMS[next].color,life:.45,max:.45,form:next});
 g.toast='REQUIP · '+ERZA_FORMS[next].name.toUpperCase();g.toastTime=2;return true;
}
export function updateErzaMechanic(g,dt){
 if(g.p.id!=='erza')return;
 const m=g.mechanic;m.form=Math.max(0,Math.min(ERZA_FORMS.length-1,Math.floor(m.form||0)));g.p.erzaForm=m.form;
 m.switchMax=erzaSwitchCooldown(g.p);m.switchCD=Math.max(0,(m.switchCD||0)-dt);m.max=m.switchMax;m.value=m.max-m.switchCD;
 m.requipAge=Math.max(0,(m.requipAge||0)-dt);if(!m.requipAge&&g.p.pose==='requip')g.p.pose='';
 m.barrierMax=30;m.barrier=Math.max(0,Math.min(m.barrierMax,m.barrier??m.barrierMax));m.barrierAge??=0;
 if(m.form===2&&m.barrier<m.barrierMax){m.barrierAge+=dt;if(m.barrierAge>=8){m.barrier=m.barrierMax;m.barrierAge=0;}}
}
// This reserve survives every switch. Changing armor never heals or refills it.
export function absorbErzaBarrier(g,damage){
 if(g.p.id!=='erza'||g.mechanic.form!==2)return 0;
 const m=g.mechanic,absorbed=Math.min(damage,m.barrier||0);m.barrier-=absorbed;if(absorbed)m.barrierAge=0;return absorbed;
}
export function castRequip(g,target,power,damage){
 const p=g.p,rank=p.weapons.requip||1,fused=!!p.fusions.requip,form=erzaForm(g),angle=Math.atan2(target.y-p.y,target.x-p.x);
 p.attackTimer=.4;p.castKind='requip';
 if(form.id==='wheel'){
  const n=3+Math.floor((rank-1)/2)+(fused?2:0)+(p.id==='erza'?(p.meta.erzaSwordCount||0):0),y=p.y-22;
  for(let i=0;i<n;i++){
   const a=angle+(i-(n-1)/2)*.13;
   g.shots.push({type:'requip-sword',sourceWeapon:'requip',x:p.x,y,ox:p.x,oy:y,vx:Math.cos(a)*490,vy:Math.sin(a)*490,life:1.55,age:0,delay:i*.045,r:5,damage:18*power,pierce:1+Math.floor(rank/2)+(fused?1:0),hits:new Set(),propHits:new Set(),color:fused?'#f4d7a5':'#d6e6ef',rank,fused,blade:i});
  }
  g.effects.push({type:'erza-wheel',x:p.x,y:p.y-22,r:48,angle,color:form.color,life:.4,max:.4,blades:n});return true;
 }
 const wing=form.id==='blackwing',base=form.id==='base',reach=requipReach(g);
 if(distance(target,p)>reach+(target.r||0))return false;
 g.effects.push({type:'erza-slash',x:p.x,y:p.y-17,r:reach,angle,color:form.color,form:base?3:wing?1:2,fused,life:.4,max:.4});
 const threshold=base?.25:wing?-.1:.15;
 for(const e of g.enemies){
  const d=distance(e,p),dot=Math.cos(Math.atan2(e.y-p.y,e.x-p.x)-angle);if(e.hp<=0||d>reach+e.r||dot<threshold)continue;
  damage(g,e,(base?34:wing?48:42)*power,form.color);
  if(wing)applyStatus(e,'bleeding',fused?4:3,{power:6*power,source:'black-wing'});else if(!base)applyStatus(e,'stun',fused?.8:.45);
  const force=(base?65:wing?90:180)*(e.boss?.2:1)/(d||1);e.kvx=(e.kvx||0)+(e.x-p.x)*force;e.kvy=(e.kvy||0)+(e.y-p.y)*force;
 }
 for(const o of g.world.active)if(o.hp>0&&distance(o,p)<=reach+o.r&&Math.cos(Math.atan2(o.y-p.y,o.x-p.x)-angle)>=threshold)damageProp(g,o,(base?34:45)*power);
 return true;
}
export function updateRequipSword(g,s,dt,{damage,burst}){
 if(s.type!=='requip-sword')return false;
 if(g.status!=='playing'||g.bossIntro)return true;
 const previous=s.age||0;s.age=previous+dt;s.life-=dt;const travel=Math.max(0,s.age-Math.max(previous,s.delay||0));if(!travel||s.life<=0)return true;
 s.hits??=new Set();s.propHits??=new Set();s.ox=s.x;s.oy=s.y;s.x+=s.vx*travel;s.y+=s.vy*travel;
 const radius=s.r*g.p.area;
 for(const o of g.world.active){if(o.hp<=0||s.propHits.has(o.id)||segmentDistance(o.x,o.y,s.ox,s.oy,s.x,s.y)>o.r+radius)continue;s.propHits.add(o.id);damageProp(g,o,s.damage);if(!Number.isFinite(o.hp)||o.hp>0){s.life=0;return true;}}
 const contacts=g.enemies.filter(e=>e.hp>0&&!s.hits.has(e.id)&&segmentDistance(e.x,e.y,s.ox,s.oy,s.x,s.y)<e.r+radius).sort((a,b)=>distance(a,{x:s.ox,y:s.oy})-distance(b,{x:s.ox,y:s.oy}));
 for(const e of contacts){s.hits.add(e.id);damage(g,e,s.damage,s.color);if(s.fused)applyStatus(e,'bleeding',2.5,{power:s.damage*.12,source:'heavens-arsenal'});burst?.(g,e.x,e.y,s.color,4,40);if(--s.pierce<=0){s.life=0;break;}}
 return true;
}
export const ERZA_ULTIMATE={name:'Nakagami: Divine Severance',duration:2.8,color:'#f0d49e',description:'Channel Nakagami armor for 0.9 seconds, then unleash seven golden spatial cuts at fixed marked targets. Each cut damages and briefly stuns nearby enemies, destroys scenery and erases hostile shots inside its area. Your Requip armor returns when the sequence ends.'};
export function startErzaUltimate(g){
 const p=g.p,u=g.ultimate;clearStatuses(p);p.pose='nakagami';u.strikes=[];u.cuts=0;u.r=82*p.area*(1+(p.meta.ultimateArea||0));
 const targets=g.enemies.filter(e=>e.hp>0&&distance(e,p)<500).sort((a,b)=>distance(a,p)-distance(b,p));
 for(let i=0;i<7;i++){const e=targets[i%Math.max(1,targets.length)],a=i*Math.PI*2/7-Math.PI/2;u.strikes.push({x:e?e.x+Math.cos(a)*18:p.x+Math.cos(a)*150,y:e?e.y+Math.sin(a)*18:p.y+Math.sin(a)*150,at:.9+i*.2,angle:a+.6,done:false});}
}
export function updateErzaUltimate(g,u,dt,{damage,burst}){
 if(g.status!=='playing'||g.bossIntro)return;g.p.pose='nakagami';
 for(const cut of u.strikes||[]){if(cut.done||u.age<cut.at)continue;cut.done=true;u.cuts++;
  for(const e of g.enemies)if(e.hp>0&&distance(e,cut)<u.r+e.r){damage(g,e,82*g.p.damage,ERZA_ULTIMATE.color);applyStatus(e,'stun',.22);}
  damagePropsInRadius(g,cut.x,cut.y,u.r,85*g.p.damage);g.enemyShots=g.enemyShots.filter(s=>distance(s,cut)>u.r+(s.r||0));
  g.effects.push({type:'erza-sever',x:cut.x,y:cut.y,r:u.r,angle:cut.angle,color:ERZA_ULTIMATE.color,life:.5,max:.5});burst?.(g,cut.x,cut.y,'#f4dfab',9,100);
 }
}
