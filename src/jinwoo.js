import {applyStatus} from './status.js';
import {damagePropsInRadius} from './world.js';
import {refreshStats,effectivePassiveRank} from './game.js';
import {SHADOWS,SHADOW_IDS,STAT_IDS,shadowGradePower,shadowGradeSpeed} from './jinwoo-data.js';

// Sung Jinwoo's kit. Kamish's Wrath slashes in front of him, every shadow in the Shadow
// Inventory fights as a lasting summon, kills progress the System's Daily Quest, and the
// Arise ultimate empowers the army and raises fallen enemies as temporary soldiers.
const TAU=Math.PI*2;
export const SHADOW_KIND_PREFIX='shadow-';
export const RISEN_KIND='shadow-risen';
export const RISEN_LIMIT=12;
export const isShadowKind=kind=>typeof kind==='string'&&kind.startsWith(SHADOW_KIND_PREFIX);
export const shadowOf=s=>s.kind===RISEN_KIND?'shadowsoldier':s.kind.slice(SHADOW_KIND_PREFIX.length);
export const JINWOO_ULTIMATE={name:'Arise',duration:8,color:'#9a8af0',description:'Command the army: for eight seconds every shadow deals 60% more damage and attacks 40% faster inside a domain of the Shadow Monarch. Each enemy that falls within it rises as a shadow soldier that fights for ten seconds, up to twelve at once.'};
const ariseActive=g=>g.ultimate?.type==='jinwoo';

// Keep each shadow in the inventory on the field, at its current grade and damage. The Shadow
// Soldier card raises a squad: two soldiers at Normal grade and one more per grade.
export const squadSize=(id,grade)=>id==='shadowsoldier'?1+grade:1;
const SHADOW_POWER=1.05;
export function syncShadowArmy(g){
 const p=g.p;if(p.id!=='jinwoo'||!p.shadows)return;g.summons??=[];
 const empower=ariseActive(g)?1.6*(1+(p.meta?.ultimateDamage||0)):1,mastery=1+(p.meta?.signatureDamage||0);
 for(const [i,id]of SHADOW_IDS.filter(id=>p.shadows[id]).entries()){
  const kind=SHADOW_KIND_PREFIX+id,grade=p.shadows[id];
  for(let slot=0;slot<squadSize(id,grade);slot++){let s=g.summons.find(s=>s.kind===kind&&(s.slot||0)===slot);
   if(!s){const a=(i+slot*.6)*2.399;s={id:++g.id,kind,slot,x:p.x+Math.cos(a)*34,y:p.y+Math.sin(a)*22,age:0,attackCD:.2+i*.1+slot*.15,adaptation:0};g.summons.push(s);g.effects.push({type:'arise-rise',x:s.x,y:s.y,r:22,life:.6,max:.6});}
   Object.assign(s,{life:Infinity,grade,rank:grade,fused:grade>=5,baseDamage:SHADOWS[id].damage*SHADOW_POWER*shadowGradePower(grade)*p.damage*(p.shadowPower||1)*mastery*empower});}
 }
}
// Movement and reach for the shared summon loop.
export function shadowTuning(g,s){
 const def=SHADOWS[shadowOf(s)],grade=s.kind===RISEN_KIND?1:s.grade||1,haste=ariseActive(g)?.6:1;
 return {r:def.r,speed:def.speed,chase:def.chase,reach:def.reach,cooldown:def.cooldown*shadowGradeSpeed(grade)*haste/((g.p.attackSpeed||1)),flying:!!def.flying};
}
export function shadowAttack(g,s,target,targets,{damage,burst}){
 const id=shadowOf(s),def=SHADOWS[id],grade=s.kind===RISEN_KIND?1:s.grade||1,area=g.p.area,dmg=s.damage,angle=Math.atan2(target.y-s.y,target.x-s.x);
 const fx=(type,extra={})=>g.effects.push({type,x:target.x,y:target.y,angle,color:def.color,grade,life:.3,max:.3,...extra});
 const near=(x,y,r)=>targets.filter(e=>Math.hypot(e.x-x,e.y-y)<r+e.r);
 if(target.kind==='prop'){damagePropsInRadius(g,target.x,target.y,24,dmg);fx('shadow-slash');return;}
 if(def.style==='slash'){damage(g,target,dmg,'#c8c0f0');fx('shadow-slash');}
 else if(def.style==='bash'){damage(g,target,dmg,'#d0d4e8');applyStatus(target,'stun',.35+.05*grade);if(!target.boss){target.kvx=Math.cos(angle)*220;target.kvy=Math.sin(angle)*220;}fx('shadow-bash');}
 else if(def.style==='lunge'){for(const e of near(target.x,target.y,26)){damage(g,e,dmg,'#f0a0a8');applyStatus(e,'bleeding',2.5,{power:dmg*.12,source:'igris'});}s.x+=Math.cos(angle)*18;s.y+=Math.sin(angle)*18;fx('shadow-slash',{red:true});}
 else if(def.style==='slam'){const r=def.radius*(1+.1*(grade-1))*area;for(const e of near(s.x,s.y,r)){damage(g,e,dmg,'#c8e8f8');applyStatus(e,'slow',1.2,{power:.4,source:'tank'});}damagePropsInRadius(g,s.x,s.y,r,dmg);g.effects.push({type:'tank-slam',x:s.x,y:s.y,r,life:.45,max:.45});}
 else if(def.style==='fire'){const r=def.radius*(1+.1*(grade-1))*area;for(const e of near(target.x,target.y,r)){damage(g,e,dmg,'#f8b070');applyStatus(e,'burning',3,{power:dmg*.1,source:'tusk'});}g.effects.push({type:'tusk-fire',x:target.x,y:target.y,sx:s.x,sy:s.y-22,r,life:.5,max:.5});}
 else if(def.style==='claw'){damage(g,target,dmg,'#b0e0b8');applyStatus(target,'poison',2.5,{power:dmg*.1,source:'beru'});fx('shadow-claw');}
 else if(def.style==='dive'){const r=def.radius*(1+.1*(grade-1))*area;for(const e of near(target.x,target.y,r)){damage(g,e,dmg,'#b8d8f8');if(!e.boss){const d=Math.hypot(e.x-target.x,e.y-target.y)||1;e.kvx=(e.x-target.x)/d*180;e.kvy=(e.y-target.y)/d*180;}}g.effects.push({type:'kaisel-dive',x:target.x,y:target.y,sx:s.x,sy:s.y-30,r,life:.45,max:.45});s.x=target.x-Math.cos(angle)*20;s.y=target.y-Math.sin(angle)*20;}
 else if(def.style==='sweep'){const r=def.radius*(1+.1*(grade-1))*area;for(const e of targets){const d=Math.hypot(e.x-s.x,e.y-s.y),a=Math.atan2(e.y-s.y,e.x-s.x),diff=Math.abs(((a-angle+Math.PI*3)%TAU)-Math.PI);if(d<r+e.r&&diff<.95)damage(g,e,dmg,'#e0d0ff');}g.effects.push({type:'bellion-sweep',x:s.x,y:s.y-12,angle,r,life:.4,max:.4});}
 burst(g,target.x,target.y,def.color,2,30);
}
// Kamish's Wrath: quick dagger slashes in a forward arc, faster with Agility. With nothing in
// reach he throws the dagger at the nearest enemy instead, for a little less damage.
export function updateJinwoo(g,dt,{damage,target}){
 const p=g.p;if(p.id!=='jinwoo')return;
 p.daggerCD=Math.max(0,(p.daggerCD||0)-dt);
 if(!target||p.daggerCD>0)return;const d=Math.hypot(target.x-p.x,target.y-(p.y-16));if(d>270*p.area+(target.r||0))return;
 const angle=Math.atan2(target.y-(p.y-16),target.x-p.x),reach=70*p.area,dmg=16*p.damage*(p.daggerPower||1)*(1+(p.meta?.daggerDamage||0))*(ariseActive(g)?1.25:1);
 p.daggerCD=.55*p.cooldown;p.attackTimer=.22;p.aimAngle=angle;p.facing=Math.cos(angle)<0?-1:1;p.slashSide=-(p.slashSide||1);
 if(d>92*p.area+(target.r||0)){if(target.kind==='prop'){damagePropsInRadius(g,target.x,target.y,20,dmg*.8);}else damage(g,target,dmg*.8,'#f0a0b0');g.effects.push({type:'dagger-throw',x:p.x,y:p.y-16,tx:target.x,ty:target.y-8,life:.22,max:.22});return;}
 for(const e of g.enemies){if(e.hp<=0)continue;const ed=Math.hypot(e.x-p.x,e.y-(p.y-16)),a=Math.atan2(e.y-(p.y-16),e.x-p.x),diff=Math.abs(((a-angle+Math.PI*3)%TAU)-Math.PI);if(ed<reach+e.r&&diff<1.05)damage(g,e,dmg,'#f0a0b0');}
 damagePropsInRadius(g,p.x+Math.cos(angle)*40,p.y-16+Math.sin(angle)*40,34,dmg);
 g.effects.push({type:'jinwoo-slash',x:p.x,y:p.y-16,angle,r:reach,side:p.slashSide,life:.2,max:.2});
}
// The Daily Quest: kills count toward it; completing it raises every stat by two and heals.
export const DAILY_QUEST_REWARD=2;
export function jinwooKill(g,e){
 const p=g.p,m=g.mechanic;if(p.id!=='jinwoo'||m?.id!=='jinwoo')return;
 m.value+=(e?.boss?20:e?.elite?5:1)*(1+effectivePassiveRank(p,'blackheart')*.15+(p.meta?.questGain||0));
 if(m.value>=m.max){m.value=0;m.stage=(m.stage||0)+1;for(const id of STAT_IDS)p.stats[id]+=DAILY_QUEST_REWARD;const oldMax=p.maxHp;refreshStats(p);p.hp=Math.min(p.maxHp,p.hp+Math.max(0,p.maxHp-oldMax)+p.maxHp*.3);
  g.toast='DAILY QUEST COMPLETE · ALL STATS +'+DAILY_QUEST_REWARD;g.toastTime=3;g.effects.push({type:'system-window',x:p.x,y:p.y-60,life:1.2,max:1.2});m.serial=(m.serial||0)+1;}
 // Arise: enemies that fall inside the domain return as shadow soldiers.
 if(ariseActive(g)&&e&&Math.hypot(e.x-p.x,e.y-p.y)<(g.ultimate.r||300)){g.summons??=[];if(g.summons.filter(s=>s.kind===RISEN_KIND).length<RISEN_LIMIT){g.summons.push({id:++g.id,kind:RISEN_KIND,x:e.x,y:e.y,age:0,attackCD:.3,adaptation:0,life:10,grade:1,rank:1,baseDamage:10*p.damage*(p.shadowPower||1)});g.effects.push({type:'arise-rise',x:e.x,y:e.y,r:20,life:.6,max:.6});}}
}
export function startArise(g){
 const p=g.p;p.pose='arise';g.ultimate.r=300*p.area*(1+(p.meta.ultimateArea||0));
 for(const s of g.summons||[])if(isShadowKind(s.kind))s.attackCD=0;
 syncShadowArmy(g);g.toast='ARISE';g.toastTime=2;
}
