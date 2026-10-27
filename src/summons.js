import {ensureGuardianHealth,updateGuardianHealth,summonLevelPower} from './guardian-health.js';
import {companionLeash,nearbyCompanionTargets,companionHome,recallCompanion} from './companion-ai.js';
import {navigateEnemy,damagePropsInRadius,damageProp} from './world.js';
import {applyStatus} from './status.js';
import {queueSummonDeath} from './friendly-death.js';
import {SPIDER_KINDS,spiderTuning,spiderAttack} from './shiraori.js';
import {heroSpiderBite} from './hero-mechanics.js';
const mahoragaDamage=g=>85*g.p.damage*(1+(g.p.meta.ultimateDamage||0))*summonLevelPower(g);
// The Queen Taratect stomps every enemy around it, so each hit is smaller than Mahoraga's.
const queenDamage=g=>28*g.p.damage*(1+(g.p.meta.ultimateDamage||0))*summonLevelPower(g);
// Ultimate guardians stay until defeated, scale with the owner's level, and keep one copy each.
export const GUARDIAN_SUMMONS=['mahoraga','queentaratect'];
const guardianDamage=(g,kind)=>kind==='queentaratect'?queenDamage(g):mahoragaDamage(g);
function refreshTemporarySummon(g,s){
 // Legacy temporary summons stored only damage, before level scaling existed.
 if(!Number.isFinite(s.baseDamage))s.baseDamage=s.damage;
 s.damage=s.baseDamage*summonLevelPower(g);return s;
}
export function summonPack(g,rank,power,fused=false,durationBoost=1){
 g.summons??=[];const duration=(7+rank)*(1+(g.p.passives.talisman||0)*.12+(g.p.meta.summonDuration||0))*durationBoost;
 for(const [i,kind]of ['whiteDog','blackDog'].entries()){
  let s=g.summons.find(s=>s.kind===kind);if(!s){s={id:++g.id,kind,x:g.p.x+(i-1)*26,y:g.p.y+22,age:0,attackCD:i*.2,adaptation:0};g.summons.push(s);}Object.assign(s,{life:duration,baseDamage:25*power,fused,rank});refreshTemporarySummon(g,s);
 }
}
export function summonNue(g,rank,power,fused=false,durationBoost=1){
 g.summons??=[];const duration=(8+rank)*(1+(g.p.passives.talisman||0)*.12+(g.p.meta.summonDuration||0))*durationBoost;let s=g.summons.find(s=>s.kind==='nue');if(!s){s={id:++g.id,kind:'nue',x:g.p.x+28,y:g.p.y-15,age:0,attackCD:.25,adaptation:0};g.summons.push(s);}Object.assign(s,{life:duration,baseDamage:28*power,fused,rank});refreshTemporarySummon(g,s);
}
export function restorePersistentSummons(g){
 g.summons??=[];
 const kept=new Set();
 g.summons=g.summons.filter(s=>{if(!GUARDIAN_SUMMONS.includes(s.kind))return true;if(kept.has(s.kind))return false;ensureGuardianHealth(g,s);if(s.hp<=0){queueSummonDeath(g,s);return false;}kept.add(s.kind);s.life=Infinity;s.damage=guardianDamage(g,s.kind);return true;});
 return g.summons;
}
export function summonMahoraga(g){
 restorePersistentSummons(g);let s=g.summons.find(s=>s.kind==='mahoraga');
 if(!s){s=ensureGuardianHealth(g,{id:++g.id,kind:'mahoraga',x:g.p.x+55,y:g.p.y-10,age:0,attackCD:.3,adaptation:0,wheelCD:0});g.summons.push(s);}
 // Recasting restores this same General to full health, retaining adaptation.
 Object.assign(s,{life:Infinity,hp:s.maxHp,hit:0,damage:mahoragaDamage(g)});recallCompanion(g,s);return s;
}
// Recasting fully heals the same living Queen rather than summoning a second one.
export function summonQueen(g){
 restorePersistentSummons(g);let s=g.summons.find(s=>s.kind==='queentaratect');
 if(!s){s=ensureGuardianHealth(g,{id:++g.id,kind:'queentaratect',x:g.p.x+60,y:g.p.y-8,age:0,attackCD:.4,adaptation:0});g.summons.push(s);}
 Object.assign(s,{life:Infinity,hp:s.maxHp,hit:0,damage:queenDamage(g),fused:false,rank:1});recallCompanion(g,s);return s;
}
export function updateSummons(g,dt,{damage,burst}){
 if(g.status!=='playing'||g.bossIntro||!(dt>0))return;restorePersistentSummons(g);for(const s of g.summons){const guard=GUARDIAN_SUMMONS.includes(s.kind);if(!guard){refreshTemporarySummon(g,s);s.life-=dt;}s.age+=dt;s.attackCD-=dt;s.attackAnim=Math.max(0,(s.attackAnim||0)-dt);s.wheelCD=Math.max(0,(s.wheelCD||0)-dt);if(s.life<=0){queueSummonDeath(g,s,{reason:'expired'});continue;}if(guard&&s.hp<=0)continue;
 recallCompanion(g,s);const home=companionHome(g,s);
 const targets=nearbyCompanionTargets(g),target=targets.reduce((a,b)=>!a||Math.hypot(b.x-s.x,b.y-s.y)<Math.hypot(a.x-s.x,a.y-s.y)?b:a,null)||g.world.active.filter(o=>Number.isFinite(o.hp)&&o.hp>0&&Math.hypot(o.x-g.p.x,o.y-g.p.y)<companionLeash(g)*.9&&Math.hypot(o.x-s.x,o.y-s.y)<60+o.r).sort((a,b)=>Math.hypot(a.x-s.x,a.y-s.y)-Math.hypot(b.x-s.x,b.y-s.y))[0],maho=s.kind==='mahoraga',bird=s.kind==='nue',spider=SPIDER_KINDS.includes(s.kind)?spiderTuning(s.kind):null;
 const tx=target?.x??home.x,ty=target?.y??home.y,dx=tx-s.x,dy=ty-s.y,d=Math.hypot(dx,dy)||1;s.facing=dx<0?-1:1;s.moving=target?.kind==='prop'?false:d>(target?(spider?spider.chase:bird?130:maho?65:25):15);
 if(s.moving){s.r=spider?spider.r:maho?25:10;s.speed=target?(spider?spider.speed:bird?230:maho?200:290):400;s.waterWalker=bird;s.boss=maho;navigateEnemy(g,s,dx/d*s.speed,dy/d*s.speed,dt);}recallCompanion(g,s);
 if(guard){updateGuardianHealth(g,s,dt,{burst});if(s.hp<=0)continue;}
 if(target&&s.attackCD<=0&&d<(spider?spider.reach:bird?310:maho?175:55)+target.r){s.attackCD=spider?spider.cooldown:bird?1.5:maho?1:.8;s.attackAnim=.35;
 if(spider&&(s.kind==='queentaratect'||target.kind!=='prop'))spiderAttack(g,s,target,targets,{damage,burst,onBite:heroSpiderBite});
 else if(!maho&&target.kind==='prop'){damageProp(g,target,s.damage);burst(g,target.x,target.y,'#c8d0df',4,35);}
 else if(maho){const r=130*g.p.area;for(const e of targets)if(Math.hypot(e.x-s.x,e.y-s.y)<r+e.r){damage(g,e,s.damage*(1+s.adaptation*.15),'#f5e6b6');applyStatus(e,'stun',.35);e.kvx=(e.x-s.x)*1.1;e.kvy=(e.y-s.y)*1.1;}damagePropsInRadius(g,s.x,s.y,r,s.damage);g.effects.push({type:'eva-claw',x:s.x,y:s.y-20,angle:Math.atan2(dy,dx),r,color:'#e5dbbb',life:.3,max:.3});}
 else if(bird){const hit=targets.filter(e=>e===target||(s.fused&&Math.hypot(e.x-target.x,e.y-target.y)<160)).slice(0,s.fused?4:1);const points=[{x:s.x,y:s.y-25}];for(const e of hit){damage(g,e,s.damage,'#c8d0ff');applyStatus(e,'stun',.4);points.push({x:e.x,y:e.y});}g.effects.push({type:'lightning',points,color:'#b7caff',life:.22,max:.22});}
 else{damage(g,target,s.damage,'#c9d2e4');applyStatus(target,'bleeding',2,{power:s.damage*.1,source:'divine-dog'});burst(g,target.x,target.y,'#bbc9dc',4,35);}
 }
 }g.summons=g.summons.filter(s=>GUARDIAN_SUMMONS.includes(s.kind)?s.hp>0:s.life>0);g.enemyShots=g.enemyShots.filter(q=>q.life>0);
}
