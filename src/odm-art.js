const TAU=Math.PI*2,INK='#23343e';
const clamp=n=>Math.max(0,Math.min(1,n));
const mix=(a,b,t)=>a+(b-a)*t;
function line(c,points,color,width=1){c.strokeStyle=color;c.lineWidth=width;c.lineJoin='round';c.lineCap='round';c.beginPath();points.forEach(([x,y],i)=>i?c.lineTo(x,y):c.moveTo(x,y));c.stroke();}
function polygon(c,points,color){c.fillStyle=color;c.beginPath();points.forEach(([x,y],i)=>i?c.lineTo(x,y):c.moveTo(x,y));c.closePath();c.fill();}
function hook(c,x,y,side,alpha){
 c.save();c.translate(x,y);c.globalAlpha*=alpha;
 line(c,[[-6,-side*3],[0,0],[5,-side*3]],INK,4);line(c,[[-6,-side*3],[0,0],[5,-side*3]],'#c7ded7',2);
 line(c,[[0,0],[-1,side*5]],'#e7ebd0',2);c.fillStyle='#8ca7a4';c.fillRect(-2,-2,4,3);c.restore();
}
function blade(c,x,y,angle,length,alpha=1){
 c.save();c.translate(x,y);c.rotate(angle);c.globalAlpha*=alpha;
 // Thick ink, two steel planes, and the replaceable blade's segment notches.
 polygon(c,[[-6,-3],[2,-3],[length,-2],[length+7,0],[length,3],[2,3],[-6,2]],INK);
 polygon(c,[[1,-2],[length,-1],[length+5,0],[length,1],[1,2]],'#b6d1d1');
 line(c,[[2,-2],[length-1,-1],[length+4,0]],'#f4f6df',1.4);
 for(let k=9;k<length-2;k+=6)line(c,[[k,-1.5],[k-2,1.8]],'#64818b',1);
 c.fillStyle='#51716f';c.fillRect(-9,-3,8,6);c.fillStyle='#b8c7b9';c.fillRect(-8,-3,3,2);
 line(c,[[-1,-5],[-1,5]],'#d6c49a',2);c.fillStyle='#e4c8a2';c.fillRect(-11,-2,4,4);c.restore();
}
function slashRibbon(c,reach,side,cut,quiet){
 const end=mix(side*1.12,-side*.92,cut),start=end+side*(quiet?.48:.78),inner=reach*.36,outer=reach*.87;
 c.beginPath();c.arc(0,0,outer,Math.min(start,end),Math.max(start,end));c.arc(0,0,inner,Math.max(start,end),Math.min(start,end),true);c.closePath();c.fillStyle=side<0?'#c6e6d128':'#94c9db30';c.fill();
 c.strokeStyle=side<0?'#edf4d7':'#b7e2e6';c.lineWidth=quiet?2:3;c.beginPath();c.arc(0,0,outer,Math.min(start,end),Math.max(start,end));c.stroke();
 c.strokeStyle='#1f3445';c.lineWidth=1;c.beginPath();c.arc(0,0,outer+3,Math.min(start,end),Math.max(start,end));c.stroke();
}

// World-space visual only. The cast already resolves its unchanged damage cone.
// Every coordinate comes from the cast snapshot, so movement cannot bend a cable.
export function drawOdmAttack(c,e,progress,reduced=false){
 const t=clamp(progress),reach=Math.max(20,e.r||123),flight=e.hookDistance||reach*.78,spread=e.hookSpread||Math.min(24,reach*.17),launch=clamp(t/.22),cut=clamp((t-.16)/.52),retract=clamp((t-.72)/.28),side=e.slashSide||1;
 c.save();c.translate(e.x,e.y);c.rotate(e.angle||0);
 const cableFade=1-retract*.8;
 for(const hand of [-1,1]){
  const end=flight*launch*(1-retract*.84),ey=hand*spread*launch*(1-retract*.84),startY=hand*8,slack=reduced?0:Math.sin(Math.PI*launch)*(1-retract)*14;
  c.strokeStyle=INK;c.lineWidth=3;c.beginPath();c.moveTo(-4,startY);c.quadraticCurveTo(end*.48,ey*.5+hand*slack,end,ey);c.stroke();
  c.strokeStyle='#b2c5c6';c.lineWidth=1;c.beginPath();c.moveTo(-4,startY);c.quadraticCurveTo(end*.48,ey*.5+hand*slack,end,ey);c.stroke();
  if(launch>.15)hook(c,end,ey,hand,cableFade);
 }
 // Two compact hip housings and rearward exhaust tie the motion to ODM gear.
 for(const hand of [-1,1]){
  c.fillStyle=INK;c.fillRect(-10,hand*9-4,11,7);c.fillStyle='#799391';c.fillRect(-9,hand*9-3,8,4);line(c,[[-8,hand*9-2],[-3,hand*9-2]],'#d7e4d6');
 }
 if(!reduced&&t<.72){
  const exhaust=Math.sin(Math.PI*clamp(t/.72));
  for(const hand of [-1,1]){
   const yy=hand*9;
   polygon(c,[[-11,yy-3],[-26-exhaust*21,yy-5],[-22-exhaust*14,yy],[-29-exhaust*18,yy+4],[-11,yy+3]],'#87bec257');
   line(c,[[-12,yy],[-25-exhaust*15,yy]],'#d7ede0',3);
   for(let i=0;i<3;i++){c.fillStyle=i%2?'#c3d5d780':'#e3eddf7d';c.fillRect(-24-i*9-exhaust*8,yy+(i%2?5:-6),4-i,3-i*.5);}
  }
 }
 if(t>.12){
  const fade=1-retract*.65,poseCut=reduced?.52:cut;
  c.save();c.globalAlpha*=fade;
  for(const hand of [-1,1]){
   const h=hand*side,angle=mix(h*1.12,-h*.92,poseCut),advance=(reduced?.62:Math.sin(poseCut*Math.PI))*(1-retract*.7),x=8+advance*reach*.32,y=hand*8,length=Math.min(38,22+(e.rank||1)*2.5);
   if(!reduced&&cut>.06&&cut<.95){blade(c,x-8,y+hand*5,angle+hand*.18,length,.18);blade(c,x-15,y+hand*8,angle+hand*.32,length,.09);}
   slashRibbon(c,reach,h,poseCut,reduced);blade(c,x,y,angle,length);
  }
  if(!reduced&&cut>.3&&cut<.88){
   const impactX=reach*.67,rr=6+Math.sin(cut*Math.PI)*7;
   line(c,[[impactX-rr,-rr],[impactX+rr,rr]],'#f4efd6',2);line(c,[[impactX-rr,rr],[impactX+rr,-rr]],'#9ad9dc',2);
   for(let i=0;i<4;i++){const a=(i-1.5)*.3;line(c,[[reach*.44,Math.sin(a)*reach*.3],[reach*.86,Math.sin(a)*reach*.46]],'#dceadc6b',1);}
  }
  c.restore();
 }
 c.restore();
}
