import {damageProp,segmentDistance} from './world.js';
import {applyStatus,statusModifiers} from './status.js';

export const FRIEREN_BARRAGE={
 name:'Ancient Magic: Annihilation Barrage',
 color:'#c4d9ff',icon:'annihilationbarrage',cooldown:75,duration:2.3,chargeDuration:1.2,
 description:'Gather ancient magic for 1.2 seconds, then release one massive black-core blast edged in brilliant blue-white light. A single impact pierces enemies, curses survivors and destroys hostile shots and breakable supplies along its broad, fixed path. It has its own 75-second base cooldown; the stone golem remains available and any living guardian keeps fighting.',
};
export const FRIEREN_BARRAGE_CHARGE=1.2;
export const FRIEREN_BARRAGE_BEAM_SECONDS=1.05;
const bodyY=e=>e.y-(e.r||0)*.35;
const aimTarget=g=>(g.enemies||[]).filter(e=>e.hp>0).reduce((best,e)=>!best||Math.hypot(e.x-g.p.x,e.y-g.p.y)<Math.hypot(best.x-g.p.x,best.y-g.p.y)?e:best,null);
const beamContact=(beam,x,y,r=0)=>segmentDistance(x,y,beam.x,beam.y,beam.tx,beam.ty)<beam.width+r;

export function useSecondaryUltimate(g){
 if(g?.p?.id!=='frieren'||g.status!=='playing'||g.bossIntro||g.riftTrial||g.ultimate||g.dash||!(g.p.hp>0)||!statusModifiers(g.p).canAct||(g.secondarySpecial||0)>0)return false;
 const p=g.p,target=aimTarget(g),origin={x:p.x,y:p.y-24};
 const angle=target?Math.atan2(bodyY(target)-origin.y,target.x-origin.x):Number.isFinite(p.aimAngle)?p.aimAngle:p.facing<0?Math.PI:0;
 const area=Math.max(.2,(p.area||1)*(1+(p.meta?.ultimateArea||0))),length=800*area,width=84*area;
 const {x,y}=origin,at=FRIEREN_BARRAGE_CHARGE;
 const beams=[{x,y,tx:x+Math.cos(angle)*length,ty:y+Math.sin(angle)*length,angle,length,width,at,damageAt:at+.18,damage:600,duration:FRIEREN_BARRAGE_BEAM_SECONDS,released:false,done:false}];
 const cooldown=FRIEREN_BARRAGE.cooldown*Math.max(.1,p.cooldown||1)*Math.max(.1,1-(p.meta?.ultimateCooldown||0));
 g.secondarySpecial=g.secondarySpecialMax=cooldown;
 g.ultimate={type:'frieren-barrage',barrageVersion:2,name:FRIEREN_BARRAGE.name+' · Charging',age:0,duration:FRIEREN_BARRAGE.duration,chargeDuration:FRIEREN_BARRAGE_CHARGE,phase:'charging',charge:0,released:false,x:origin.x,y:origin.y,angle,r:length,beams,tick:0,impacted:false};
 g.ultimateSerial=(g.ultimateSerial||0)+1;g.invuln=Math.max(g.invuln||0,.4);p.pose='spell';p.aimAngle=angle;
 g.toast='ANNIHILATION BARRAGE · GATHERING ANCIENT MAGIC';g.toastTime=FRIEREN_BARRAGE_CHARGE;
 return true;
}

export function updateFrierenBarrage(g,dt,{damage,burst}={}){
 const u=g.ultimate;if(u?.type!=='frieren-barrage'||g.status!=='playing'||g.bossIntro||!(dt>0))return false;
 const p=g.p;u.charge=Math.min(1,Math.max(0,u.age/u.chargeDuration));p.pose='spell';
 if(u.age<u.chargeDuration){u.phase='charging';return true;}
 u.phase='active';u.name=FRIEREN_BARRAGE.name;u.released=true;
 for(const beam of u.beams){
  if(u.age>=beam.at&&!beam.released){
   beam.released=true;
   burst?.(g,beam.x,beam.y,FRIEREN_BARRAGE.color,p.reducedMotion?4:11,65);
   if(!p.reducedMotion)g.shake=Math.max(g.shake||0,2.5);
  }
  if(u.age>=beam.damageAt&&!beam.done){
   // The first impact follows the drawn front's short travel, never the charge.
   // done is checkpointed, so resuming a finished beam cannot hit twice.
   beam.done=true;
   for(const e of g.enemies||[])if(e.hp>0&&beamContact(beam,e.x,bodyY(e),e.r||0)){
    // Older in-progress casts keep their saved 200-damage lanes and spent
    // flags; new casts concentrate the complete burst into one impact.
    damage?.(g,e,(beam.damage??200)*(p.damage||1),FRIEREN_BARRAGE.color);
    applyStatus(e,'cursed',2.5);
    const knock=e.boss?.2:1;e.kvx=(e.kvx||0)+Math.cos(beam.angle)*180*knock;e.kvy=(e.kvy||0)+Math.sin(beam.angle)*180*knock;
   }
   for(const prop of g.world?.active||[])if(Number.isFinite(prop.hp)&&prop.hp>0&&beamContact(beam,prop.x,prop.y,prop.r||0))damageProp(g,prop,240*(p.damage||1));
  }
  if(u.age>=beam.damageAt&&u.age<beam.at+(beam.duration??1.2))g.enemyShots=(g.enemyShots||[]).filter(s=>!beamContact(beam,s.x,s.y,s.r||0));
 }
 u.impacted=u.beams.every(b=>b.done);
 return true;
}
