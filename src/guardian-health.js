import {statusModifiers} from './status.js';
import {queueSummonDeath} from './friendly-death.js';
import {segmentDistance} from './world.js';

const levelSteps=g=>Math.max(0,Math.floor(Number.isFinite(g.p.level)?g.p.level:1)-1);
// Level growth stays linear beyond the early game. Rank, gear and mastery still
// apply independently; these factors are derived from the owner, never stacked.
export const summonLevelPower=g=>1+levelSteps(g)*.025;
export const guardianMaxHp=(g,kind)=>Math.round((kind==='mahoraga'?480:380)*(1+levelSteps(g)*.03)*(1+(g.p.meta?.summonDuration||0)*.3)*(1+(g.p.meta?.ultimateDuration||0)*.1));
export function ensureGuardianHealth(g,s,kind=s.kind){
 const limit=guardianMaxHp(g,kind),previous=s.maxHp;
 // Updating a level or migrating a checkpoint keeps its health percentage. A
 // dead guardian stays dead, and restoring a wounded guardian is not a recast.
 if(Number.isFinite(previous)&&previous>0&&Number.isFinite(s.hp)&&limit!==previous)s.hp=Math.max(0,Math.min(1,s.hp/previous))*limit;
 s.maxHp=limit;
 if(!Number.isFinite(s.hp))s.hp=limit;
 s.hp=Math.max(0,Math.min(limit,s.hp));s.guardian=true;s.contactCD=Math.max(0,s.contactCD||0);return s;
}
export function guardianTarget(g,e,currentTarget=g.p){
 if(e.boss)return currentTarget;
 let best=currentTarget,d=Math.hypot(e.x-best.x,e.y-best.y);
 for(const s of [g.golem,...(g.summons||[]).filter(s=>s.kind==='mahoraga')])if(s&&s.hp>0){const range=Math.hypot(e.x-s.x,e.y-s.y);if(range<260&&range<d){best=s;d=range;}}
 return best;
}
export function hurtGuardian(g,s,amount,{burst,adapt=false}={}){
 if(!(s.hp>0)||!(amount>0))return false;
 const resistance=s.kind==='mahoraga'?Math.min(.55,(s.adaptation||0)*.12):.15;
 s.hp=Math.max(0,s.hp-amount*(1-resistance));s.hit=.14;
 if(adapt&&s.kind==='mahoraga'&&s.wheelCD<=0){s.adaptation=Math.min(4,(s.adaptation||0)+1);s.wheelCD=.55;burst?.(g,s.x,s.y-45,'#eddb9b',7,45);}
 if(s.hp<=0){queueSummonDeath(g,s);burst?.(g,s.x,s.y-25,s.kind==='mahoraga'?'#dce3c8':'#c7ae87',20,85);g.toast=s.kind==='mahoraga'?'MAHORAGA HAS FALLEN':'THE STONE GUARDIAN HAS FALLEN';g.toastTime=3;g.checkpointRequested=true;}
 return true;
}
// Damage is attached to the physical guardian. It never silently drains its
// owner's HP, and projectiles intercepted here cannot hit the player afterward.
export function updateGuardianHealth(g,s,dt,{burst}={}){
 if(!(s.hp>0))return;
 s.contactCD=Math.max(0,(s.contactCD||0)-dt);s.hit=Math.max(0,(s.hit||0)-dt);
 const radius=s.kind==='mahoraga'?34:29;
 for(const q of g.enemyShots||[])if(q.life>0&&Math.hypot(q.x-s.x,q.y-s.y)<radius+(q.r||0)){
  if(g.ultimate?.type==='esdeath'&&Math.hypot(q.x-g.ultimate.x,q.y-g.ultimate.y)<g.ultimate.r)continue;
  q.life=0;hurtGuardian(g,s,q.damage||0,{burst,adapt:true});if(s.hp<=0)return;
 }
 if(s.contactCD>0)return;
 for(const e of g.enemies||[])if(e.hp>0&&statusModifiers(e).canAct&&Math.hypot(e.x-s.x,e.y-s.y)<radius+(e.r||0)*.6){
  if(g.ultimate?.type==='esdeath'&&Math.hypot(e.x-g.ultimate.x,e.y-g.ultimate.y)<g.ultimate.r)continue;
  hurtGuardian(g,s,(e.boss?24:e.elite?17:10)*(e.damageScale||1),{burst,adapt:true});s.contactCD=.65;return;
 }
 for(const h of g.hazards||[]){
  if(h.cancelWithSource&&!g.enemies.some(e=>e.id===h.sourceId&&e.hp>0))continue;
  if(h.age<h.delay||h.age>h.delay+h.duration)continue;
  const touches=h.shape==='circle'?Math.hypot(h.x-s.x,h.y-s.y)<h.r+radius:segmentDistance(s.x,s.y,h.x,h.y,h.tx,h.ty)<(h.width||0)+radius;
  if(touches){hurtGuardian(g,s,h.damage||0,{burst,adapt:true});s.contactCD=.65;return;}
 }
}
export function drawGuardianHealth(c,s,label,color='#a9d8b5',width=42,height=4){
 if(!(s?.hp>0)||!(s.maxHp>0))return;
 const x=Math.round(s.x-width/2),y=Math.round(s.y-(s.kind==='mahoraga'?77:97));
 c.save();c.fillStyle='#101622e8';c.fillRect(x-2,y-2,width+4,height+4);c.fillStyle='#354348';c.fillRect(x,y,width,height);c.fillStyle=color;c.fillRect(x,y,Math.max(0,width*s.hp/s.maxHp),height);
 c.font='600 7px "DM Sans",sans-serif';c.textAlign='center';c.fillStyle='#f1e7d2';c.fillText(label+' '+Math.ceil(s.hp)+' / '+Math.ceil(s.maxHp),s.x,y-5);c.restore();
}
