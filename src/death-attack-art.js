// Death's scenery follows the same fixed marks and saved clock as its hazards.
// These drawings never add hitboxes or move the openings in a warning.
export const DEATH_ATTACK_STYLES=['memento','palecrown','lasthorizon'];
const TAU=Math.PI*2,clamp=n=>Math.max(0,Math.min(1,Number.isFinite(n)?n:0));
const BONE='#dcd8c9',LIGHT='#f4edd9',INK='#282a38',SHADE='#8c9092';
const alpha=(c,factor)=>{c.globalAlpha=(Number.isFinite(c.globalAlpha)?c.globalAlpha:1)*factor;};
function line(c,points,color,width=1){c.strokeStyle=color;c.lineWidth=width;c.lineCap='round';c.lineJoin='round';c.beginPath();points.forEach(([x,y],i)=>i?c.lineTo(x,y):c.moveTo(x,y));c.stroke();}
function poly(c,points,color,edge=null){c.fillStyle=color;c.beginPath();points.forEach(([x,y],i)=>i?c.lineTo(x,y):c.moveTo(x,y));c.closePath();c.fill();if(edge){c.strokeStyle=edge;c.lineWidth=1.5;c.stroke();}}
function oval(c,x,y,rx,ry,color){c.fillStyle=color;c.beginPath();c.ellipse(x,y,Math.max(.1,rx),Math.max(.1,ry),0,0,TAU);c.fill();}
function skull(c,r,active){
 const s=Math.min(22,r*.3);poly(c,[[-s,-s*.5],[-s*.65,-s],[s*.65,-s],[s,-s*.5],[s*.8,s*.55],[s*.42,s],[-s*.42,s],[-s*.8,s*.55]],BONE,INK);
 for(const side of [-1,1])oval(c,side*s*.44,-s*.22,s*.23,s*.3,INK);
 poly(c,[[0,s*.04],[-s*.14,s*.4],[s*.14,s*.4]],INK);
 line(c,[[-s*.48,s*.58],[s*.48,s*.58]],INK,active?3:1.5);
 for(let i=-2;i<=2;i++)line(c,[[i*s*.17,s*.47],[i*s*.17,s*.82]],active?LIGHT:SHADE,1);
}
function coffin(c,h,u,progress,active,quiet){
 const r=h.r,s=r*.55,t=quiet?0:Math.min(1,Math.max(0,u.age-h.delay)/Math.max(.1,h.duration||.5));
 c.save();c.translate(h.x,h.y);c.rotate((u.angle||0)*.25+(quiet?0:Math.sin(u.age*2)*.025));
 alpha(c,active?.75:.25+progress*.22);
 poly(c,[[-s*.55,-s],[-s*.82,-s*.5],[-s*.6,s],[s*.6,s],[s*.82,-s*.5],[s*.55,-s]],INK,BONE);
 line(c,[[0,-s*.63],[0,s*.54]],BONE,2);line(c,[[-s*.34,-s*.25],[s*.34,-s*.25]],BONE,2);
 if(active){alpha(c,.65);for(let i=0;i<6;i++){const a=i*TAU/6,rr=r*(.55+t*.25);poly(c,[[Math.cos(a)*rr,Math.sin(a)*rr],[Math.cos(a+.12)*(rr-10),Math.sin(a+.12)*(rr-10)],[Math.cos(a-.08)*(rr-7),Math.sin(a-.08)*(rr-7)]],LIGHT);}}
 else{alpha(c,.55);for(const side of [-1,1])line(c,[[side*s*.95,-s*.3],[side*s*1.12,-s*.06],[side*s*.95,s*.2]],SHADE,1.5);}
 c.restore();
}
function boneLane(c,h,u,progress,active,quiet){
 const dx=h.tx-h.x,dy=h.ty-h.y,length=Math.hypot(dx,dy),w=Math.max(2,h.width);if(length<1)return;
 c.save();c.translate(h.x,h.y);c.rotate(Math.atan2(dy,dx));c.beginPath();c.rect(0,-w,length,w*2);c.clip();
 alpha(c,active?.72:.18+progress*.17);
 line(c,[[0,0],[length,0]],INK,w*1.35);line(c,[[0,0],[length,0]],BONE,active?w*.8:w*.3);
 const count=Math.min(9,Math.max(2,Math.floor(length/100)));
 for(let i=0;i<count;i++){
  const x=(i+.5)*length/count,joint=Math.min(w*.65,10),sway=quiet?0:Math.sin(u.age*3+i)*w*.045;
  poly(c,[[x-joint*1.5,0],[x-joint,-joint+sway],[x+joint,-joint*.65+sway],[x+joint*1.5,0],[x+joint,joint*.65+sway],[x-joint,joint+sway]],active?LIGHT:SHADE,INK);
 }
 if(u.style==='lasthorizon'){alpha(c,.7);for(const side of [-1,1])line(c,[[0,side*w*.86],[length,side*w*.86]],LIGHT,active?2:1);}
 c.restore();
}
export function drawDeathRiftAttack(c,e,reducedMotion=false){
 const u=e?.riftAttack;
 if(e?.archetype!=='deathdevil'||e.hp<=0||!u||!DEATH_ATTACK_STYLES.includes(u.style)||!Number.isFinite(u.age)||u.age<0||!Number.isFinite(u.duration)||u.age>=u.duration||![u.x,u.y,u.angle].every(Number.isFinite))return false;
 c.save();
 for(const h of (u.marks||[]).slice(0,32)){
  if(!h||![h.x,h.y,h.delay].every(Number.isFinite)||h.delay<0)continue;
  const duration=Number.isFinite(h.duration)?h.duration:.5,after=u.age-h.delay;
  if(after>duration+.15)continue;
  const active=after>=0,progress=clamp(u.age/Math.max(.01,h.delay)),fade=active?clamp(1-Math.max(0,after-duration)/.15):1;
  c.save();alpha(c,fade);
  if(h.shape==='line'&&[h.tx,h.ty,h.width].every(Number.isFinite))boneLane(c,h,u,progress,active,reducedMotion);
  else if(h.shape==='circle'&&Number.isFinite(h.r)&&h.r>0){
   if(u.style==='memento'&&h.label?.includes('COFFIN'))coffin(c,h,u,progress,active,reducedMotion);
   else{c.translate(h.x,h.y);alpha(c,active?.6:.2+progress*.16);skull(c,h.r,active);if(active){c.strokeStyle=BONE;c.lineWidth=1.5;c.beginPath();c.arc(0,0,h.r*.75,0,TAU);c.stroke();}}
  }
  c.restore();
 }
 c.restore();return true;
}
