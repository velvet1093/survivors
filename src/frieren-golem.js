import {ensureGuardianHealth,updateGuardianHealth,summonLevelPower} from './guardian-health.js';
import {companionHome,companionLeash,nearbyCompanionTargets,recallCompanion} from './companion-ai.js';
import {applyStatus} from './status.js';
import {queueSummonDeath} from './friendly-death.js';
import {damageProp,damagePropsInRadius,moveBody,segmentDistance} from './world.js';

export const FRIEREN_GOLEM_DURATION=10;
export const GOLEM_PHASE_SECONDS={forming:.55,'slam-windup':.45,slam:.36,'beam-windup':.65,beam:1.15};
const distance=(a,b)=>Math.hypot(a.x-b.x,a.y-b.y);
const mouth=s=>({x:s.x+(s.facing||1)*4,y:s.y-65});
const area=g=>(g.p.area||1)*(1+(g.p.meta.ultimateArea||0));

// The guardian outlives its summoning animation and is saved independently.
export function restoreFrierenGolem(g){
 if(!g.golem&&g.ultimate?.type==='frieren'&&g.ultimate.golem)g.golem=g.ultimate.golem;
 if(g.golem){ensureGuardianHealth(g,g.golem,'frierenGolem');g.golem.kind='frierenGolem';if(g.golem.hp<=0){queueSummonDeath(g,g.golem);g.golem=null;}}
 if(g.ultimate?.type==='frieren'){if(g.golem)g.ultimate.golem=g.golem;else delete g.ultimate.golem;}
 return g.golem;
}
export function startFrierenGolem(g){
 const u=g.ultimate;if(!u||u.type!=='frieren')return null;
 let s=restoreFrierenGolem(g);
 if(!s){s=ensureGuardianHealth(g,{id:++g.id,kind:'frierenGolem',x:g.p.x+g.p.facing*65,y:g.p.y+18,age:0,phase:'forming',phaseAge:0,attackCD:0,attackIndex:0,facing:g.p.facing||1,walk:0,moving:false,targetId:null,beam:null,slam:null},'frierenGolem');g.golem=s;}
 s.hp=s.maxHp;s.hit=0;u.golem=s;recallCompanion(g,s,55);contain(g,s);g.p.pose='spell';return s;
}
function contain(g,s){
 const leash=Math.max(5,companionLeash(g)-22),d=distance(s,g.p);
 if(d>leash){s.x=g.p.x+(s.x-g.p.x)/d*leash;s.y=g.p.y+(s.y-g.p.y)/d*leash;}
}
function transition(s,phase){s.phase=phase;s.phaseAge=0;s.moving=false;}
function cancelAttack(s){transition(s,'idle');s.attackCD=.2;s.beam=null;s.targetId=null;s.aim=null;}
function knock(e,x,y,source){let dx=e.x-x,dy=e.y-y;if(Math.hypot(dx,dy)<.01){dx=e.x-source.x;dy=e.y-source.y;}const d=Math.hypot(dx,dy)||1;e.kvx=(e.kvx||0)+dx/d*175*(e.boss?.2:1);e.kvy=(e.kvy||0)+dy/d*175*(e.boss?.2:1);}
function beginAttack(g,s,target){
 s.targetId=target.id;s.facing=target.x<s.x?-1:1;s.attackIndex++;
 if(s.attackIndex%2){s.aim={x:target.x,y:target.y};s.slamTarget={...s.aim};s.slamRadius=60*area(g);transition(s,'slam-windup');}
 else{transition(s,'beam-windup');s.aim={x:target.x,y:target.y-(target.r||12)*.35};}
}
function slam(g,s,{damage,burst}){
 const r=60*area(g),x=s.aim.x,y=s.aim.y;s.slam={x,y,r,age:0,duration:.72};
 const power=g.p.damage*summonLevelPower(g);
 for(const e of nearbyCompanionTargets(g))if(Math.hypot(e.x-x,e.y-y)<r+(e.r||0)){damage(g,e,118*power,'#ead2a6');applyStatus(e,'stun',.7);knock(e,x,y,s);}
 damagePropsInRadius(g,x,y,r,120*power,110);burst?.(g,x,y,'#ddc6a2',15,100);transition(s,'slam');
}
function beginBeam(g,s){
 const from=mouth(s),dx=s.aim.x-from.x,dy=s.aim.y-from.y,d=Math.hypot(dx,dy)||1;
 let tx=s.aim.x+dx/d*55,ty=s.aim.y+dy/d*55;
 const leash=companionLeash(g),endD=Math.hypot(tx-g.p.x,ty-g.p.y);
 if(endD>leash){tx=g.p.x+(tx-g.p.x)/endD*leash;ty=g.p.y+(ty-g.p.y)/endD*leash;}
 s.beam={...from,tx,ty,width:13*area(g),age:0,duration:GOLEM_PHASE_SECONDS.beam,tick:0};transition(s,'beam');
}
function beamTick(g,s,dt,{damage,burst}){
 const b=s.beam;if(!b)return;Object.assign(b,mouth(s));b.age=s.phaseAge;b.tick-=dt;
 if(b.tick<=1e-8){
  const power=g.p.damage*summonLevelPower(g);
  for(const e of nearbyCompanionTargets(g))if(segmentDistance(e.x,e.y-(e.r||12)*.35,b.x,b.y,b.tx,b.ty)<b.width+(e.r||0)){damage(g,e,42*power,'#f2b6e5');applyStatus(e,'cursed',2.5);}
  if(g.world?.active)for(const o of g.world.active)if(o.hp>0&&segmentDistance(o.x,o.y,b.x,b.y,b.tx,b.ty)<o.r+b.width)damageProp(g,o,28*power);
  burst?.(g,b.tx,b.ty,'#e8aedb',2,35);b.tick+=.2;
 }
}
function step(g,s,dt,callbacks){
 s.age+=dt;s.phaseAge+=dt;s.attackCD=Math.max(0,s.attackCD-dt);
 if(s.slam){s.slam.age+=dt;if(s.slam.age>=s.slam.duration)s.slam=null;}
 if(s.phase!=='beam'&&s.beam){s.beam.age+=dt;if(s.beam.age>s.beam.duration+.18)s.beam=null;}
 // Recall a separated summon with its owner; an interrupted attack cannot remain behind.
 if(distance(s,g.p)>Math.max(companionLeash(g)*2,companionLeash(g)+180)){recallCompanion(g,s,55);cancelAttack(s);}
 contain(g,s);
 if(s.phase==='forming'){if(s.phaseAge>=GOLEM_PHASE_SECONDS.forming)transition(s,'idle');return;}
 if(s.phase==='slam-windup'){if(s.phaseAge>=GOLEM_PHASE_SECONDS['slam-windup'])slam(g,s,callbacks);return;}
 if(s.phase==='slam'){if(s.phaseAge>=GOLEM_PHASE_SECONDS.slam){transition(s,'idle');s.attackCD=.32;}return;}
 if(s.phase==='beam-windup'){if(s.phaseAge>=GOLEM_PHASE_SECONDS['beam-windup'])beginBeam(g,s);return;}
 if(s.phase==='beam'){beamTick(g,s,dt,callbacks);if(s.phaseAge>=GOLEM_PHASE_SECONDS.beam){transition(s,'idle');s.attackCD=.42;}return;}
 const targets=nearbyCompanionTargets(g),target=targets.reduce((best,e)=>!best||distance(s,e)<distance(s,best)?e:best,null);
 const home=companionHome(g,s,55),goal=target||home,dx=goal.x-s.x,dy=goal.y-s.y,d=Math.hypot(dx,dy),melee=s.attackIndex%2===0;
 s.targetId=target?.id??null;
 const range=target?(melee?62+(target.r||0):195):15;
 s.moving=d>range;
 if(s.moving){s.facing=dx<0?-1:1;s.walk+=dt*8;const travel=Math.min(d-range,205*dt);moveBody(g,s,dx/d*travel,dy/d*travel,16,{flying:true});contain(g,s);}
 if(target&&d<=range+2&&s.attackCD<=0)beginAttack(g,s,target);
}
export function updateFrierenGolem(g,dt,callbacks){
 if(g.status!=='playing'||g.bossIntro||!(dt>0))return;
 const s=restoreFrierenGolem(g);if(!s)return;
 if(g.ultimate?.type==='frieren')g.p.pose='spell';
 updateGuardianHealth(g,s,dt,callbacks);if(s.hp<=0){g.golem=null;if(g.ultimate?.type==='frieren')delete g.ultimate.golem;return;}
 // Small deterministic steps keep attack tells and beam pulses stable across frame rates.
 let remaining=Math.max(0,dt);
 while(remaining>1e-8){const elapsed=Math.min(.025,remaining);step(g,s,elapsed,callbacks);remaining-=elapsed;}
}
