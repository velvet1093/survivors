// One timed-effect model for enemies and the player. Damage callbacks keep this module pure.
export const STATUS_EFFECTS={
 frozen:{name:'Frozen',color:'#b2e1fa',icon:'status-frozen',description:'Ice stops movement and attacks. Bosses resist repeated immobilization.',maxStacks:1},
 poison:{name:'Poison',color:'#a7de80',icon:'status-poison',description:'Toxic damage over time. Separate poison circles stack up to 3 doses.',interval:.5,maxStacks:3},
 burning:{name:'Burning',color:'#ffad69',icon:'status-burning',description:'Fire damage over time. Stronger flames replace weaker ones.',interval:.5,maxStacks:1},
 cursed:{name:'Cursed',color:'#c4a0f2',icon:'status-cursed',description:'Take 20% more damage while marked.',maxStacks:1},
 stun:{name:'Stun',color:'#ffe3a0',icon:'status-stun',description:'Stops movement and attacks. Bosses recover faster and resist repeated stuns.',maxStacks:1},
 slow:{name:'Slow',color:'#94d7ed',icon:'status-slow',description:'Movement speed is reduced. Stronger slows take priority.',maxStacks:1},
 bleeding:{name:'Bleeding',color:'#ed9da9',icon:'status-bleeding',description:'Cuts deal lingering damage after a blade strikes.',interval:.5,maxStacks:1},
};
export function hasStatus(unit,id){return (unit.statuses?.[id]?.remaining||0)>0;}
export function activeStatuses(unit){return Object.entries(unit.statuses||{}).filter(([,s])=>s.remaining>0).map(([id,s])=>({id,...STATUS_EFFECTS[id],...s}));}
export function applyStatus(unit,id,duration,{power=0,source=null}={}){
 const def=STATUS_EFFECTS[id];if(!def||unit.hp<=0||!Number.isFinite(duration)||duration<=0)return false;
 const control=id==='stun'||id==='frozen';if(control&&((unit.statusImmunity?.control||unit.statusImmunity?.stun||0)>0||hasStatus(unit,'stun')||hasStatus(unit,'frozen')))return false;
 const seconds=duration*(unit.boss&&control?.35:1)*(id==='frozen'?1-(unit.freezeResistance||0):1),statuses=unit.statuses??={},old=statuses[id],strength=Math.max(0,Number.isFinite(power)?power:0);
 if(old){old.remaining=Math.max(old.remaining,seconds);old.power=Math.max(old.power,strength);if(source!==null&&!old.sources.includes(source)){old.sources.push(source);old.stacks=Math.min(def.maxStacks,old.stacks+1);if(old.sources.length>12)old.sources.shift();}}
 else statuses[id]={remaining:seconds,power:strength,stacks:1,tick:def.interval||0,sources:source===null?[]:[source]};
 return true;
}
export function clearStatuses(unit,ids=Object.keys(STATUS_EFFECTS)){for(const id of ids)delete unit.statuses?.[id];}
export function statusModifiers(unit){return {speed:(hasStatus(unit,'stun')||hasStatus(unit,'frozen'))?0:hasStatus(unit,'slow')?Math.max(.15,1-(unit.statuses.slow.power||.4)):1,damageTaken:hasStatus(unit,'cursed')?1.2:1,canAct:!hasStatus(unit,'stun')&&!hasStatus(unit,'frozen')};}
export function updateStatuses(unit,dt,onDamage){
 if(!(dt>0))return;
 for(const id of Object.keys(unit.statusImmunity||{})){unit.statusImmunity[id]=Math.max(0,unit.statusImmunity[id]-dt);if(!unit.statusImmunity[id])delete unit.statusImmunity[id];}
 for(const [id,s] of Object.entries(unit.statuses||{})){
   const def=STATUS_EFFECTS[id],elapsed=Math.min(s.remaining,dt);s.remaining=Math.max(0,s.remaining-dt);
   if(def.interval){s.tick-=elapsed;while(s.tick<=1e-8&&unit.hp>0){onDamage?.(s.power*s.stacks*def.interval,def.color,id);s.tick+=def.interval;}}
   if(s.remaining<=1e-8){delete unit.statuses[id];if(id==='stun'||id==='frozen'){unit.statusImmunity??={};unit.statusImmunity[id]=unit.boss?2:.6;unit.statusImmunity.control=unit.boss?2:.6;}}
 }
}
