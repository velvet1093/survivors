// Clear a finite encounter for a short break, or keep the pressure moving with
// fresh reinforcements after one minute. Unfinished enemies carry into the next
// wave; regular boss arrivals queue so surviving bosses never overlap.
export const WAVE_BREAK_SECONDS=2;
export const WAVE_MAX_SECONDS=60;
export const WAVE_ENEMY_LIMIT=210;
export function waveBudget(index){return index%5===0?Math.min(24,8+Math.floor(index/5)*2):Math.min(80,12+(index-1)*4);}
export function newWaveState(index=1){
 index=Math.max(1,Math.floor(Number.isFinite(index)?index:1));
 return {version:1,index,budget:waveBudget(index),spawned:0,bossSpawned:false,eliteSpawned:false,stage:'combat',intermission:0,elapsed:0,pendingBossWaves:index%5===0?[index]:[]};
}
export function ensureWaveState(g){
 const index=Math.max(1,Math.floor(Number.isFinite(g.wave)?g.wave:1));
 if(!g.waveState||g.waveState.version!==1||g.waveState.index!==index){
  const legacy=!!g.enemies?.length,state=newWaveState(index);
  if(legacy){
   state.spawned=Math.min(state.budget,g.enemies.filter(e=>!e.boss&&!e.riftBoss&&e.archetype!=='mimic').length);
   state.bossSpawned=g.nextBossWave>index||g.enemies.some(e=>e.boss&&!e.riftBoss);
  }
  if(index%5===0&&g.nextBossWave>index)state.bossSpawned=true;
  g.waveState=state;
 }
 const s=g.waveState;s.budget=waveBudget(index);s.spawned=Math.max(0,Math.min(s.budget,Math.floor(s.spawned||0)));s.intermission=Math.max(0,Number(s.intermission)||0);
 // Old checkpoints receive a full minute, rather than inheriting the run clock.
 s.elapsed=Number.isFinite(s.elapsed)?Math.max(0,Math.min(WAVE_MAX_SECONDS,s.elapsed)):0;
 const queued=Array.isArray(s.pendingBossWaves)?s.pendingBossWaves:[];
 s.pendingBossWaves=[...new Set(queued.filter(w=>Number.isInteger(w)&&w>0&&w<=index&&w%5===0&&!(w===index&&s.bossSpawned)))].sort((a,b)=>a-b);
 if(index%5===0&&!s.bossSpawned&&!s.pendingBossWaves.includes(index))s.pendingBossWaves.push(index);
 if(!['combat','intermission'].includes(s.stage))s.stage='combat';
 return s;
}
export function waveProgress(g){
 const s=g.waveState||newWaveState(g.wave),alive=(g.enemies||[]).filter(e=>!e.riftBoss&&(e.hp>0||e.boss&&e.hp<=0&&!e.deathComplete));
 const pendingBosses=Array.isArray(s.pendingBossWaves)?s.pendingBossWaves.length:s.index%5===0&&!s.bossSpawned?1:0,elapsed=Number.isFinite(s.elapsed)?Math.max(0,Math.min(WAVE_MAX_SECONDS,s.elapsed)):0;
 return {wave:s.index,spawned:s.spawned,budget:s.budget,alive:alive.length,remaining:Math.max(0,s.budget-s.spawned)+alive.length+pendingBosses,stage:s.stage,intermission:s.intermission,elapsed,remainingTime:Math.max(0,WAVE_MAX_SECONDS-elapsed),pendingBosses,minute:Math.floor(g.time/60)};
}
function advanceWave(g,s,timedOut){
 const pending=s.pendingBossWaves.slice();g.wave=s.index+1;g.waveState=newWaveState(g.wave);
 g.waveState.pendingBossWaves=[...pending,...g.waveState.pendingBossWaves];
 g.spawn=timedOut?0:Math.min(g.spawn,.25);
 // The mastery payment still belongs to clearing a wave, not avoiding it.
 if(!timedOut||s.stage==='intermission')g.characterXp+=3*(1+(g.p.meta?.masteryGain||0));
 g.toast='WAVE '+g.wave+' · '+(timedOut&&s.stage!=='intermission'?'ONE MINUTE · REINFORCEMENTS':g.wave%5===0?'BOSS WAVE':'CLEAR EVERY ENEMY');g.toastTime=3;g.checkpointRequested=true;
}
export function updateWaves(g,dt,{spawn,queueIntro,pendingDeath=()=>false}={}){
 if(g.mode==='bossrush'||g.status&&g.status!=='playing'||g.bossIntro||g.riftArena||g.rifts?.active||g.events?.active)return false;
 const s=ensureWaveState(g),step=Number.isFinite(dt)?Math.max(0,dt):0,living=g.enemies.some(e=>!e.riftBoss&&(e.hp>0||pendingDeath(g,e)));
 s.elapsed=Math.min(WAVE_MAX_SECONDS,s.elapsed+step);
 // A late mimic or summon cancels a clear, including on the timeout frame.
 if(s.stage==='intermission'&&living){s.stage='combat';s.intermission=0;if(s.elapsed<WAVE_MAX_SECONDS-1e-9)return false;}
 if(s.elapsed>=WAVE_MAX_SECONDS-1e-9){advanceWave(g,s,true);return false;}
 if(s.stage==='intermission'){
  s.intermission=Math.max(0,s.intermission-step);
  if(s.intermission>1e-9)return false;
  advanceWave(g,s,false);return false;
 }
 const bossBusy=g.enemies.some(e=>e.boss&&(e.hp>0||pendingDeath(g,e)))||(g.bossDeaths||[]).some(d=>d.age<d.duration);
 if(s.pendingBossWaves.length&&!bossBusy){
  const bossWave=s.pendingBossWaves[0];g.nextBossWave=bossWave;
  const boss=spawn(g,true,false,undefined);if(boss){s.pendingBossWaves.shift();if(bossWave===s.index)s.bossSpawned=true;boss.bossWave=bossWave;g.boss=true;g.nextBossWave=bossWave+5;queueIntro?.(g,boss,bossWave);return true;}
 }
 if(s.spawned<s.budget&&g.spawn<=0){
  const room=Math.max(0,WAVE_ENEMY_LIMIT-g.enemies.filter(e=>e.hp>0).length),batch=Math.min(s.budget-s.spawned,2+Math.floor((s.index-1)/4),room);
  for(let i=0;i<batch;i++){
   const elite=s.index>=3&&s.index%5!==0&&!s.eliteSpawned&&s.spawned>=s.budget-1;
   const enemy=spawn(g,false,elite);if(!enemy)break;s.spawned++;if(elite)s.eliteSpawned=true;
  }
  // The caller supplies the difficulty-adjusted delay to keep it centralized.
  g.spawn=g.waveSpawnDelay||1;
 }
 if(s.spawned>=s.budget&&!s.pendingBossWaves.length&&!g.enemies.some(e=>!e.riftBoss&&(e.hp>0||pendingDeath(g,e)))){
  s.stage='intermission';s.intermission=WAVE_BREAK_SECONDS;g.toast='WAVE '+s.index+' CLEARED · NEXT WAVE IN 2s';g.toastTime=2;g.checkpointRequested=true;
 }
 return false;
}
