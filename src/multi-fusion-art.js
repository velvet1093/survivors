const TAU=Math.PI*2;
const line=(c,points,color,width=1)=>{c.strokeStyle=color;c.lineWidth=width;c.beginPath();points.forEach(([x,y],i)=>i?c.lineTo(x,y):c.moveTo(x,y));c.stroke();};
// A sea of living shadow covering the hit area: a rippling rim, the Ten Shadows sigil turning
// at its heart, and Divine Dog heads and Nue wings surfacing and sinking within.
export function drawShadowGarden(c,s,reduced=false){
 if(s.life<=0)return;const t=reduced?0:s.age,r=s.r,ry=r,alpha=Math.min(1,s.age/.2,s.life/.4);
 c.save();c.translate(s.x,s.y);c.globalAlpha=alpha;
 const rim=n=>{c.beginPath();for(let i=0;i<=48;i++){const a=i*TAU/48,w=1+Math.sin(a*7+t*2.2)*.018+Math.sin(a*3-t*1.4)*.014;i?c.lineTo(Math.cos(a)*r*n*w,Math.sin(a)*ry*n*w):c.moveTo(Math.cos(a)*r*n*w,Math.sin(a)*ry*n*w);}c.closePath();};
 c.fillStyle='#06080fb8';rim(1);c.fill();c.strokeStyle='#5d74b0';c.lineWidth=2;c.stroke();
 c.fillStyle='#141b30b0';rim(.78);c.fill();c.fillStyle='#1d2744a0';rim(.5);c.fill();
 // Ten Shadows sigil: a ring of ten marks around the shadow-dog hand sign.
 c.save();c.rotate(t*.25);c.strokeStyle='#7d92c8';c.lineWidth=1.5;c.beginPath();c.arc(0,0,r*.34,0,TAU);c.stroke();
 for(let i=0;i<10;i++){const a=i*TAU/10;line(c,[[Math.cos(a)*r*.28,Math.sin(a)*r*.28],[Math.cos(a)*r*.42,Math.sin(a)*r*.42]],'#9eb6e5',2);}c.restore();

 const k=Math.max(1,r/100);line(c,[[-9,4],[-7,-6],[-3,-1],[3,-1],[7,-6],[9,4],[0,8],[-9,4]].map(([x,y])=>[x*k*1.6,y*k*1.6]),'#9eb6e5',2);
 // Shikigami silhouettes rise from the shadow and sink back on a slow cycle.
 for(let i=0;i<7;i++){const a=i*TAU/7+.4,rr=.45+.35*((i*.53)%1),px=Math.cos(a+t*.06)*r*rr,py=Math.sin(a+t*.06)*ry*rr,phase=(t*.45+i/7)%1,h=Math.sin(phase*Math.PI);
  if(h<.08)continue;c.save();c.translate(px,py);c.scale(k,k);const x=0,y=0;c.fillStyle='#090c16';c.beginPath();c.ellipse(x,y,12,4,0,0,TAU);c.fill();
  if(i%3===2){// Nue: a pair of spread wings with a pale mask.
   const w=14*h;c.fillStyle='#1a1f36';c.beginPath();c.moveTo(x,y-4*h);c.lineTo(x-w,y-14*h);c.lineTo(x-w*.6,y-2);c.lineTo(x,y-2);c.lineTo(x+w*.6,y-2);c.lineTo(x+w,y-14*h);c.closePath();c.fill();c.fillStyle='#d8cdb8';c.fillRect(x-2,y-8*h,4,4);}
  else{// Divine Dog: a wolf head with two tall ears and a glinting eye.
   const top=y-18*h,col=i%3?'#1a2034':'#c4ccc8';c.fillStyle=col;c.beginPath();c.moveTo(x-7,y);c.lineTo(x-7,top+6);c.lineTo(x-5,top);c.lineTo(x-2,top+5);c.lineTo(x+2,top+5);c.lineTo(x+5,top);c.lineTo(x+7,top+6);c.lineTo(x+10,top+9);c.lineTo(x+7,y);c.closePath();c.fill();c.fillStyle=i%3?'#e8b04a':'#c0404e';c.fillRect(x+2,top+7,2,2);}
  c.restore();}
 // Wisps of shadow curling up off the rim.
 for(let i=0;i<10;i++){const a=i*TAU/10+t*.1,x=Math.cos(a)*r*.96,y=Math.sin(a)*ry*.96,h=(8+Math.sin(t*3+i)*4)*k;line(c,[[x,y],[x+Math.sin(t*2+i)*3,y-h*.5],[x,y-h]],'#3c4f86',2);}
 c.restore();
}
// Local coordinates after the standard projectile visibility scale.
export function drawRasenFlash(c,s,reduced=false){
 c.save();c.rotate(Math.atan2(s.vy,s.vx));line(c,[[-25,0],[7,0]],'#253746',7);line(c,[[-22,0],[7,0]],'#e7d39c',3);c.fillStyle='#c7dfd5';c.strokeStyle='#273b49';c.lineWidth=1.5;c.beginPath();c.moveTo(19,0);c.lineTo(3,-5);c.lineTo(-7,0);c.lineTo(3,5);c.closePath();c.fill();c.stroke();line(c,[[-8,-6],[-8,6]],'#e8bd70',2);line(c,[[-13,0],[-7,0]],'#977953',3);
 c.strokeStyle='#b9f3df';c.lineWidth=1.5;const angle=reduced?0:s.age*8;c.beginPath();c.arc(3,0,s.marked?16:10,angle,angle+5);c.stroke();line(c,[[0,-3],[4,0],[0,3]],'#fff2c7');if(s.marked){line(c,[[-21,-10],[19,10]],'#f3df9b',1);line(c,[[-16,14],[12,-16]],'#bdebd2',1);}c.restore();
}
