import {drawSalvationProjectile} from './soul-gem-art.js';
import {drawFeatherineShot} from './featherine-effects.js';
import {drawKurumiClockShot} from './kurumi-shot-art.js';
import {drawBlackFlame} from './rimuru-art-effects.js';
import {drawGarudaProjectile} from './garuda-art.js';
import {drawPurple} from './combat-art.js';
import {drawHollowPurpleProjectile} from './hollow-purple-art.js';
import {drawShadowGarden,drawRasenFlash} from './multi-fusion-art.js';
import {drawPalletRound,drawLonginus} from './eva-effects.js';
import {drawPoisonVial} from './maomao-effects.js';
import {drawRedOrb} from './gojo-effects.js';
import {drawPairedProjectile} from './paired-attack-art.js';
const TAU=Math.PI*2;
const line=(c,points,color,width)=>{c.strokeStyle=color;c.lineWidth=width;c.lineCap='round';c.lineJoin='round';c.beginPath();points.forEach(([x,y],i)=>i?c.lineTo(x,y):c.moveTo(x,y));c.stroke();};
const poly=(c,points,color,edge='#202136')=>{c.fillStyle=color;c.strokeStyle=edge;c.lineWidth=2;c.beginPath();points.forEach(([x,y],i)=>i?c.lineTo(x,y):c.moveTo(x,y));c.closePath();c.fill();c.stroke();};
const disc=(c,x,y,r,color,edge='#202136')=>{c.fillStyle=color;c.strokeStyle=edge;c.lineWidth=2;c.beginPath();c.arc(x,y,r,0,TAU);c.fill();c.stroke();};

// Minimum screen-space size and opaque ink borders keep shots readable on every map.
// These are visual dimensions only: collision radii stay in the combat simulation.
export function projectileScale(zoom=1,area=1,fused=false){return Math.max(.8,.64/zoom)*Math.min(1.45,area)*(fused?1.15:1);}
export function drawPlayerProjectile(c,s,{zoom=1,area=1,reducedMotion=false}={}){
 if(drawSalvationProjectile(c,s,{zoom,area,reducedMotion})||drawPairedProjectile(c,s,{zoom,area,reducedMotion}))return;
 if(s.type==='chimeragarden'){drawShadowGarden(c,s,reducedMotion);return;}
 if(s.delay&&s.age<s.delay)return;
 c.save();c.translate(s.x,s.y-(s.type==='poison'?Math.sin(Math.min(1,s.age/.55)*Math.PI)*65:0));const size=projectileScale(zoom,area,s.fused);c.scale(size,size);
 const angle=Math.atan2(s.vy,s.vx),trail=(color,length=28)=>{line(c,[[-length,0],[4,0]],'#172136',8);line(c,[[-length+3,0],[4,0]],color,5);line(c,[[-length*.6,0],[5,0]],'#fff7e5',2);};
 if(s.type==='clockshot'){drawKurumiClockShot(c,s,reducedMotion);
 }else if(s.type==='rasenflash'){drawRasenFlash(c,s,reducedMotion);
 }else if(s.type==='quill'){drawFeatherineShot(c,s,reducedMotion);
 }else if(s.type==='blackflame'){drawBlackFlame(c,s,reducedMotion);
 }else if(s.type==='garuda'){
  c.rotate(angle);drawGarudaProjectile(c,s,reducedMotion);
 }else if(s.type==='blue'){if(s.fused)drawHollowPurpleProjectile(c,s,reducedMotion);else drawPurple(c,s,reducedMotion);}
 else if(s.type==='poison'){
  if(!reducedMotion)c.rotate(Math.sin(s.age*6)*.7);drawPoisonVial(c,s,reducedMotion);
 }else if(s.type==='shuriken'){
  c.rotate(reducedMotion?0:s.age*17);const r=Math.max(12,s.r);poly(c,[[0,-r],[4,-4],[r,0],[4,4],[0,r],[-4,4],[-r,0],[-4,-4]],s.fused?'#b2ffe5':'#b8e8e7');line(c,[[0,-r+3],[0,0],[r-3,0]],'#f4fff3',2);disc(c,0,0,3,'#437c7d');
 }else{
  c.rotate(angle);
  if(s.type==='longinus')drawLonginus(c,s,reducedMotion);
  else if(s.type==='thunderspear'){if(s.stuck){disc(c,0,0,5,'#e7b365');}else{trail('#edbd72',18);poly(c,[[-12,-4],[6,-4],[17,0],[6,4],[-12,4]],'#7e9c89');poly(c,[[5,-4],[17,0],[5,4]],'#c2d1ca');line(c,[[-8,-2],[4,-2]],'#d6e0b7',2);line(c,[[-8,-5],[-14,-7]],'#b89b6b',2);line(c,[[-8,5],[-14,7]],'#b89b6b',2);}}
  else if(s.type==='ki'){const charging=s.age<s.charge;if(charging){disc(c,0,0,8+(s.age/s.charge)*7,'#b9e9ff');disc(c,-2,-2,4,'#fff9e0');}else{trail('#92d5fc',s.fused?60:32);c.strokeStyle='#253d5b';c.lineWidth=s.fused?10:7;c.beginPath();c.arc(1,0,s.fused?19:12,-1.1,1.1);c.stroke();c.strokeStyle='#bceeff';c.lineWidth=s.fused?6:4;c.stroke();disc(c,6,0,s.fused?8:4,'#fff8df');}}
  else if(s.type==='red')drawRedOrb(c,s,reducedMotion);
  else if(s.type==='missile'||s.type==='supermissile'){trail(s.color,22);poly(c,[[-8,-4],[7,-4],[14,0],[7,4],[-8,4]],s.type==='supermissile'?'#a6d5a3':'#e6d9cb');poly(c,[[5,-4],[14,0],[5,4]],s.type==='supermissile'?'#6ca489':'#d1777b');poly(c,[[-8,-4],[-12,-8],[-10,0],[-12,8],[-8,4]],'#8e9da4');}
  else if(s.type==='powerbeam'){trail(s.color,s.charged?24:16);disc(c,3,0,s.charged?8:4,s.beamStage>=2?'#dbf7fc':s.fused?'#b9f5d6':'#ffe0a1');disc(c,5,-1,s.charged?3:1.5,'#fffae0');}
  else if(s.type==='zoltraak'){trail('#c2e7d7',30);poly(c,[[20,0],[3,-4],[-5,0],[3,4]],'#f0f4cd');}
  else if(s.type==='pallet')drawPalletRound(c,s,reducedMotion);
  else if(s.type==='icelance'){trail('#6bc6ed',23);poly(c,[[22,0],[-3,-6],[-13,0],[-3,6]],'#b2eafa');line(c,[[-10,0],[19,0]],'#f5fffc',2);line(c,[[-3,-4],[5,0],[-3,4]],'#64aed7',1);}
  else if(s.type==='rosebow'){trail('#f391c7',34);poly(c,[[21,0],[7,-7],[10,0],[7,7]],'#fff1c5');poly(c,[[-24,0],[-15,-6],[-10,0],[-15,6]],'#ffd8ec');disc(c,7,0,3,'#ee8ebd');}
  else{trail('#d2c3e9',26);poly(c,[[17,0],[0,-5],[-9,0],[0,5]],s.fused?'#ffe9ae':'#e7edfa');line(c,[[0,0],[13,0]],'#fff8ed',2);}
 }
 c.restore();
}
