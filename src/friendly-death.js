const positive=value=>Number.isFinite(value)&&value>0;
const finite=(value,fallback=0)=>Number.isFinite(value)?value:fallback;
const copy=value=>typeof structuredClone==='function'?structuredClone(value):JSON.parse(JSON.stringify(value));
const summonKinds=new Set(['mahoraga','frierenGolem','whiteDog','blackDog','nue','clone','shadow']);

// Corpse visuals keep their own immutable snapshot. Removing a combat entity or
// summoning its replacement cannot move, heal or duplicate the departure.
export function queueSummonDeath(g,s,{kind=s?.kind,hero=null,reason='defeated'}={}){
 if(!s||!summonKinds.has(kind)||s.deathQueued)return null;
 g.summonDeaths??=[];
 const existing=g.summonDeaths.find(d=>d.entityId===s.id&&d.kind===kind);
 if(existing){s.deathQueued=true;return existing;}
 s.deathQueued=true;
 const quiet=!!g.p?.reducedMotion,departing=['whiteDog','blackDog','nue','clone','shadow'].includes(kind);
 const death={entityId:s.id,kind,reason,age:0,duration:quiet?.25:kind==='frierenGolem'?1.25:kind==='mahoraga'?1.2:.7,
  x:finite(s.x),y:finite(s.y),time:finite(g.time),quiet,
  unit:copy({...s,attackAnim:0,moving:false,beam:null,slam:null}),
  ...(hero?{hero:copy({...hero,moving:false,pose:'',attackTimer:0,shield:0,clone:kind==='clone'})}:{}),departing};
 g.summonDeaths.push(death);if(g.summonDeaths.length>24)g.summonDeaths.splice(0,g.summonDeaths.length-24);
 return death;
}

export function queuePlayerDeath(g){
 if(g.playerDeath||!g.p||g.p.hp>0||g.won)return g.playerDeath||null;
 const p=g.p,form=p.id==='erza'?(p.erzaForm||0):g.mechanic?.id==='goku'?g.mechanic.stage:(p.form||0),pose=p.id==='samus'&&p.pose==='bomb'?'bomb':p.id==='rimuru'&&g.ultimate?.type==='rimuru'?'predator':p.id==='shinji'&&g.mechanic?.active>0?'berserk':'';
 const quiet=!!p.reducedMotion;
 g.playerDeath={kind:'player',age:0,duration:quiet?.25:1.35,quiet,x:finite(p.x),y:finite(p.y),time:finite(g.time),
  hero:copy({...p,form,moving:false,pose,attackTimer:0,shield:0,hurtTimer:0}),complete:false};
 p.moving=false;p.attackTimer=0;g.dash=null;g.shake=0;g.checkpointRequested=true;return g.playerDeath;
}

export const playerDeathPending=g=>!!g?.playerDeath&&!g.playerDeath.complete&&g.playerDeath.age<g.playerDeath.duration;

// The engine advances this in combat. The UI advances it only after game over,
// leaving gameplay clocks, rewards and all hostile actions frozen during defeat.
export function updateFriendlyDeaths(g,dt){
 if(!g||!positive(dt)||g.bossIntro||!['playing','over'].includes(g.status))return;
 const step=Math.min(dt,1);
 for(const death of g.summonDeaths||[])death.age+=step;
 g.summonDeaths=(g.summonDeaths||[]).filter(d=>d.age<d.duration);
 if(g.status==='over'){
  const death=queuePlayerDeath(g);
  if(death){death.age=Math.min(death.duration,death.age+step);death.complete=death.age>=death.duration;}
 }
}

export function restoreFriendlyDeaths(g){
 g.summonDeaths=Array.isArray(g.summonDeaths)?g.summonDeaths.filter(d=>d&&summonKinds.has(d.kind)&&Number.isFinite(d.x)&&Number.isFinite(d.y)&&Number.isFinite(d.age)&&positive(d.duration)&&d.age>=0&&d.age<d.duration&&d.unit).slice(-24):[];
 const death=g.playerDeath;
 if(death&&(!death.hero||!Number.isFinite(death.x)||!Number.isFinite(death.y)||!Number.isFinite(death.age)||!positive(death.duration)))g.playerDeath=null;
 if(g.p?.hp>0)g.playerDeath=null;
 return g.summonDeaths;
}

// Naruto and Kurumi remove their decoy arrays when the ultimate finishes. The
// engine captures them before that update and queues their smoke once afterward.
export function queueDepartedDecoys(g,before){
 const live=new Set([...(g.cloneUnits||[]).map(s=>'clone:'+s.id),...(g.ultimate?.shadows||[]).map(s=>'shadow:'+s.id)]);
 for(const record of before||[])if(!live.has(record.kind+':'+record.unit.id))queueSummonDeath(g,record.unit,{kind:record.kind,hero:record.hero,reason:'expired'});
}
