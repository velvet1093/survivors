// Rift calamities fight in three acts. The first ends at half health with the boss's own
// rift trial; the second is its shifted form; at a quarter health it makes a Final Stand:
// it roars behind a brief shield, attacks faster and the arena closes in around the fight.
// A calamity cleared without taking damage pays a Flawless bonus.
const TAU=Math.PI*2;
export const FINAL_STAND_AT=.25,FINAL_SHIELD=1.5,FINAL_SHRINK=.72,FINAL_HASTE=.35,FLAWLESS_BONUS=.5;
export const RIFT_FINALES={
 foundereren:'THE RUMBLING CONSUMES ALL',beerus:'HAKAI · THE GOD GETS SERIOUS',walpurgisrift:'THE LAST CURTAIN FALLS',aizenrift:'THE HŌGYOKU AWAKENS',
 madararift:'INFINITE TSUKUYOMI RISES',sukunaheian:'THE KING OF CURSES UNLEASHED',borosrift:'COLLAPSING STAR',darknessdevil:'THE PRIMORDIAL FEAR DEEPENS',
 deathdevil:'THE LAST SILENCE',acnologia:'THE APOCALYPSE DRAGON ROARS',milim:'MILIM STOPS PLAYING',
};
export const riftPhase=(e)=>!e?1:e.riftFinal?3:e.enraged?2:1;
const activeBoss=g=>{const r=g.rifts?.active;return r&&g.riftArena?(g.enemies||[]).find(e=>e.id===r.bossEntityId&&e.hp>0):null;};
export function updateRiftPhases(g,dt){
 const e=activeBoss(g);if(!e||!(dt>0))return;const arena=g.riftArena;arena.phase=riftPhase(e);
 if(!e.riftFinal&&e.enraged&&e.hp<=e.maxHp*FINAL_STAND_AT){
  e.riftFinal=true;e.finalShield=FINAL_SHIELD;e.attackCD=Math.min(e.attackCD||0,1.2);arena.baseRadius??=arena.radius||760;arena.phase=3;
  const line=RIFT_FINALES[arena.bossId]||'FINAL STAND';g.toast='FINAL STAND · '+line;g.toastTime=4;g.shake=Math.max(g.shake||0,10);
  g.effects.push({type:'rift-final',x:e.x,y:e.y,r:260,color:e.color,text:line,life:2,max:2});
 }
 if(e.finalShield>0)e.finalShield=Math.max(0,e.finalShield-dt);
 if(e.riftFinal){
  // Attacks recover faster, and the arena boundary closes in over about six seconds.
  if((e.attackCD||0)>0)e.attackCD-=dt*FINAL_HASTE;
  const base=arena.baseRadius??(arena.baseRadius=arena.radius||760);arena.radius=Math.max(base*FINAL_SHRINK,(arena.radius||base)-dt*base*(1-FINAL_SHRINK)/6);
 }
}
export const riftShielded=e=>!!(e?.riftBoss&&e.finalShield>0);
export function markRiftHurt(g){if(g.rifts?.active)g.rifts.active.hurt=true;}
// Flawless needs the whole fight: reaching the Final Stand without taking damage.
export function flawlessBonus(active,boss){return active&&!active.hurt&&boss?.riftFinal?FLAWLESS_BONUS:0;}
// Arena dressing that grows with each act: glowing cracks after the trial, then a burning,
// collapsing rim in the Final Stand.
export function drawArenaPhase(c,arena,time=0,reduced=false){
 const phase=arena.phase||1;if(phase<2)return;const r=arena.radius||760,accent=arena.accent||'#e0c0f0',t=reduced?0:time;
 c.save();c.lineCap='round';
 for(let i=0;i<9;i++){const a=i*TAU/9+.35,len=r*(.35+((i*37)%5)/12);c.strokeStyle=accent+(phase>2?'88':'44');c.lineWidth=phase>2?3:2;c.beginPath();c.moveTo(Math.cos(a)*40,Math.sin(a)*40);
  for(let k=1;k<=4;k++){const d=40+len*k/4,j=Math.sin(i*7+k*3)*.12;c.lineTo(Math.cos(a+j)*d,Math.sin(a+j)*d);}c.stroke();}
 if(phase>2){const pulse=.5+Math.sin(t*5)*.5;c.strokeStyle='#ff4a5a'+Math.round(120+pulse*100).toString(16);c.lineWidth=8;c.strokeRect(-r,-r,r*2,r*2);c.strokeStyle='#ffd0a8aa';c.lineWidth=2;c.strokeRect(-r+6,-r+6,r*2-12,r*2-12);
  for(let i=0;i<24;i++){const side=i%4,u=((i*0.137+t*.15)%1)*2-1,x=side<2?u*r:side===2?-r:r,y=side<2?(side?r:-r):u*r;c.fillStyle=i%2?'#ff7a5a':'#ffd08a';c.fillRect(x-2,y-2-(t*20+i*9)%14,3,3);}}
 c.restore();
}
// The Final Stand banner and shockwave over the boss.
export function drawRiftPhaseEffect(c,e,progress,reduced=false){
 if(e.type!=='rift-final')return false;const t=Math.max(0,Math.min(1,progress));
 c.save();const ring=e.r*(.2+t*.8);c.globalAlpha*=1-t;c.strokeStyle=e.color||'#ff6a7a';c.lineWidth=6*(1-t)+2;c.beginPath();c.ellipse(e.x,e.y,ring,ring*.6,0,0,TAU);c.stroke();
 c.globalAlpha=Math.min(1,(1-t)*3);c.textAlign='center';c.font='bold 16px sans-serif';c.fillStyle='#1a0a14';c.fillText('FINAL STAND',e.x+2,e.y-110+2);c.fillStyle='#ff6a7a';c.fillText('FINAL STAND',e.x,e.y-110);
 c.font='bold 10px sans-serif';c.fillStyle='#ffe0d0';c.fillText(e.text||'',e.x,e.y-94);c.restore();return true;
}
