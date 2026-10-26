import {applyStatus,clearStatuses} from './status.js';
import {heroAuthorityHit} from './hero-mechanics.js';
import {damageProp,damagePropsInRadius,segmentDistance} from './world.js';

const distance=(a,b)=>Math.hypot(a.x-b.x,a.y-b.y);
const INK='#bca3e0',RED_TRUTH='#e7a3b1';
export const FEATHERINE_ULTIMATE={name:'The Last Page',duration:5,color:'#dab9e8',description:'Open a fixed author’s stage for five seconds. Its written verses curse and slow nearby enemies, erase hostile projectiles and end with a crimson final sentence. Bosses retain their damage resistance.'};

export function castQuill(g,target,power){
 const p=g.p,rank=p.weapons.quill||1,fused=!!p.fusions.quill,m=g.mechanic,revision=m?.id==='featherine'&&m.value>=m.max;
 if(revision){m.value=0;m.revision=1.2;m.serial++;g.toast='REVISION · RED TRUTH';g.toastTime=2.5;}
 const n=2+(rank>=3?1:0)+(rank>=5?1:0)+(fused?1:0)+(revision?1:0)+(p.weapon==='quill'?(p.meta.projectiles||0):0),y=p.y-25,angle=Math.atan2(target.y-y,target.x-p.x),speed=fused?470:440;
 for(let i=0;i<n;i++){
  const a=angle+(i-(n-1)/2)*.105;
  g.shots.push({type:'quill',x:p.x,y,ox:p.x,oy:y,vx:Math.cos(a)*speed,vy:Math.sin(a)*speed,speed,r:4.5,age:0,life:2.4,delay:i*.055,rank,fused,revision,damage:20*power*(revision?1.6:1),pierce:1+Math.floor((rank-1)/2)+(fused?2:0)+(revision?2:0),hits:new Set(),propHits:new Set(),targetId:target.kind==='prop'?null:target.id,color:fused||revision?RED_TRUTH:INK,glyphArea:p.area*(p.weapon==='quill'?1+(p.meta.signatureArea||0):1)});
 }
 return n;
}

function writeImpact(g,s,e,{damage,burst}){
 s.hits.add(e.id);s.pierce--;heroAuthorityHit(g,8);
 damage(g,e,s.damage,s.color);applyStatus(e,'cursed',s.fused?3.5:2.5,{source:'quill'});
 const glyph=s.fused||s.revision,radius=(s.fused?52:s.revision?38:17)*(s.glyphArea||g.p.area);
 g.effects.push({type:'script-glyph',x:e.x,y:e.y,r:radius,color:s.color,life:.38,max:.38,red:glyph,serial:e.id});
 if(glyph){
  for(const other of g.enemies)if(other!==e&&other.hp>0&&distance(e,other)<radius+other.r){damage(g,other,s.damage*.4,s.color);applyStatus(other,'cursed',3,{source:'red-truth'});applyStatus(other,'slow',.7,{power:.3,source:'red-truth'});}
  damagePropsInRadius(g,e.x,e.y,radius,s.damage*.45);
 }
 burst?.(g,e.x,e.y,glyph?'#f0d194':'#cbb6e8',4,45);
 if(s.pierce<=0)s.life=0;
}

export function updateQuillShot(g,s,dt,callbacks){
 if(s.type!=='quill')return false;
 if(g.status!=='playing'||g.bossIntro)return true;
 const previous=s.age||0;s.age=previous+dt;s.life-=dt;
 s.hits??=new Set();s.propHits??=new Set();
 const travelDt=Math.max(0,s.age-Math.max(previous,s.delay||0));if(!travelDt||s.life<=0)return true;
 const nearby=g.enemies.filter(e=>e.hp>0&&!s.hits.has(e.id)&&distance(e,g.p)<760);
 let target=nearby.find(e=>e.id===s.targetId);if(!target)target=nearby.reduce((best,e)=>!best||distance(e,s)<distance(best,s)?e:best,null);
 if(target){s.targetId=target.id;const a=Math.atan2(target.y-s.y,target.x-s.x),blend=Math.min(1,travelDt*(s.fused?5:3));s.vx+=(Math.cos(a)*(s.speed||440)-s.vx)*blend;s.vy+=(Math.sin(a)*(s.speed||440)-s.vy)*blend;}
 s.ox=s.x;s.oy=s.y;s.x+=s.vx*travelDt;s.y+=s.vy*travelDt;
 const radius=s.r*g.p.area;
 for(const o of g.world.active){
  if(o.hp<=0||s.propHits.has(o.id)||segmentDistance(o.x,o.y,s.ox,s.oy,s.x,s.y)>o.r+radius)continue;
  s.propHits.add(o.id);damageProp(g,o,s.damage,s.vx*.08,s.vy*.08);
  if(!Number.isFinite(o.hp)||o.hp>0){s.life=0;return true;}
 }
 const contacts=nearby.filter(e=>segmentDistance(e.x,e.y,s.ox,s.oy,s.x,s.y)<e.r+radius).sort((a,b)=>distance(a,{x:s.ox,y:s.oy})-distance(b,{x:s.ox,y:s.oy}));
 for(const e of contacts){writeImpact(g,s,e,callbacks);if(s.life<=0)break;}
 return true;
}

// startUltimate creates the common timer/cooldown, then calls this initializer.
export function startFeatherineUltimate(g){
 const p=g.p,u=g.ultimate;if(!u)return false;
 Object.assign(u,{type:'featherine',name:FEATHERINE_ULTIMATE.name,r:245*p.area*(1+(p.meta.ultimateArea||0)),erased:0,verses:0});
 p.pose='author';clearStatuses(p);heroAuthorityHit(g,20);return true;
}

// The shared ultimate loop owns age/tick advancement and final cleanup.
export function updateFeatherineUltimate(g,u,dt,{damage,burst}){
 if(g.status!=='playing'||g.bossIntro||u?.type!=='featherine')return;
 // Enemy damage is scaled by the shared ultimate callback in the engine.
 const p=g.p,power=p.damage;p.pose='author';
 const before=g.enemyShots.length;g.enemyShots=g.enemyShots.filter(s=>distance(s,u)>u.r*.87);u.erased=(u.erased||0)+before-g.enemyShots.length;
 if(u.tick<=0){
  for(const e of g.enemies)if(e.hp>0&&distance(e,u)<u.r+e.r){damage(g,e,24*power,'#d7bae9');applyStatus(e,'cursed',2,{source:'last-page'});applyStatus(e,'slow',.8,{power:.55,source:'last-page'});}
  damagePropsInRadius(g,u.x,u.y,u.r,23*power);u.verses=(u.verses||0)+1;u.tick=.5;
 }
 if(u.age>=u.duration-.12&&!u.impacted){
  u.impacted=true;
  for(const e of g.enemies)if(e.hp>0&&distance(e,u)<u.r+e.r){damage(g,e,165*power,RED_TRUTH);applyStatus(e,'cursed',4,{source:'final-sentence'});applyStatus(e,'stun',.4);g.effects.push({type:'script-glyph',x:e.x,y:e.y,r:54*p.area,color:RED_TRUTH,life:.6,max:.6,red:true,serial:e.id});}
  damagePropsInRadius(g,u.x,u.y,u.r,150*power);burst?.(g,u.x,u.y,'#e8c79a',28,130);
 }
}
