import {applyStatus} from './status.js';
import {damagePropsInRadius} from './world.js';

// Shiraori's spiders are temporary companions that share the summons update loop.
// Spiderlings dart in and bite with poison; the evolved Arch Taratects spread that
// poison to nearby enemies and web them; the ultimate's Queen Taratect stomps and
// spits webs around the hero as a lasting guardian until it is defeated.
export const SPIDER_KINDS=['spiderling','archtaratect','queentaratect'];
export const SHIRAORI_ULTIMATE={name:'Queen Taratect',duration:2,color:'#e9dff0',description:'Call one Queen Taratect with its own HP. It remains until defeated, stays near Shiraori, stomps every enemy around it, poisons and slows them with spat webs, and draws enemies and shots away from her at the cost of its HP. It arrives with a fresh brood of spiderlings and grows stronger with your level. Recasting fully heals the same living Queen.'};
// Two spiderlings at rank 1, one more at ranks 2 and 4; Shiraori adds one per Parallel
// Minds rank and per Larger Clutch mastery rank.
export function broodCount(p,rank){return 2+(rank>=2?1:0)+(rank>=4?1:0)+(p.id==='shiraori'?(p.passives.parallelminds||0)+(p.meta.projectiles||0):0);}
export function summonBrood(g,rank,power,fused=false,boost={}){
 g.summons??=[];const p=g.p,kind=fused?'archtaratect':'spiderling',count=broodCount(p,rank)+(boost.projectiles||0);
 const life=(6+rank)*(1+(p.meta.summonDuration||0))*(boost.duration||1),damage=(fused?16:11)*power;
 // Recasting refreshes the living brood, swaps it to the evolved kind, and hatches any missing spiders.
 const brood=g.summons.filter(s=>s.kind==='spiderling'||s.kind==='archtaratect');
 for(let slot=0;slot<count;slot++){
  let s=brood.find(s=>s.slot===slot);
  if(!s){const a=slot*2.399;s={id:++g.id,slot,x:p.x+Math.cos(a)*20,y:p.y+Math.sin(a)*14,age:0,attackCD:slot*.12,adaptation:0};g.summons.push(s);}
  Object.assign(s,{kind,life,baseDamage:damage,damage,fused,rank});
 }
 g.effects.push({type:'nova',x:p.x,y:p.y,r:46,color:fused?'#f0e6f4':'#d9cde4',life:.35,max:.35});
 return count;
}
// The Queen arrives with a fresh brood of spiderlings at the hero's Spider Brood rank.
export function startShiraoriUltimate(g,summonQueen){g.p.pose='summon';g.ultimate.name=SHIRAORI_ULTIMATE.name;summonQueen(g);const p=g.p;summonBrood(g,p.weapons.spiderbrood||1,p.damage,!!p.fusions.spiderbrood,{duration:1});}
// Movement tuning for each spider kind, read by the shared summon loop.
export const spiderTuning=kind=>kind==='queentaratect'?{r:26,speed:170,chase:70,reach:150,cooldown:1.1}:kind==='archtaratect'?{r:9,speed:320,chase:18,reach:44,cooldown:.6}:{r:7,speed:340,chase:16,reach:38,cooldown:.7};
export function spiderAttack(g,s,target,targets,{damage,burst,onBite}){
 if(s.kind==='queentaratect'){
  const r=125*g.p.area*(1+(g.p.meta.ultimateArea||0));
  for(const e of targets)if(Math.hypot(e.x-s.x,e.y-s.y)<r+e.r){damage(g,e,s.damage,'#efe6f4');applyStatus(e,'poison',3,{power:s.damage*.06,source:'queen-taratect'});applyStatus(e,'slow',1.5,{power:.45,source:'queen-taratect'});e.kvx=(e.x-s.x)*.8;e.kvy=(e.y-s.y)*.8;}
  damagePropsInRadius(g,s.x,s.y,r,s.damage);g.effects.push({type:'nova',x:s.x,y:s.y,r,color:'#e9dff0',life:.4,max:.4});
  return;
 }
 if(target.kind==='prop')return;
 damage(g,target,s.damage,s.fused?'#f2e8f6':'#ddd0e8');applyStatus(target,'poison',2.5,{power:s.damage*(s.fused?.12:.1),source:s.kind});
 // The Arch Taratect's venom splashes onto the three enemies closest to its prey.
 if(s.fused){for(const e of targets.filter(e=>e!==target&&Math.hypot(e.x-target.x,e.y-target.y)<70+e.r).sort((a,b)=>Math.hypot(a.x-target.x,a.y-target.y)-Math.hypot(b.x-target.x,b.y-target.y)).slice(0,3)){applyStatus(e,'poison',2.5,{power:s.damage*.06,source:'archtaratect'});applyStatus(e,'slow',1.2,{power:.35,source:'archtaratect'});}
  g.effects.push({type:'nova',x:target.x,y:target.y,r:70,color:'#e9e1ef',life:.3,max:.3});}
 burst(g,target.x,target.y,'#d7c8e2',3,30);onBite?.(g);
}
