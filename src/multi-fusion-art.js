const TAU=Math.PI*2;
const line=(c,points,color,width=1)=>{c.strokeStyle=color;c.lineWidth=width;c.beginPath();points.forEach(([x,y],i)=>i?c.lineTo(x,y):c.moveTo(x,y));c.stroke();};
export function drawShadowGarden(c,s,reduced=false){
 if(s.life<=0)return;const t=reduced?0:s.age,r=s.r,alpha=Math.min(1,s.age/.2,s.life/.4);
 c.save();c.translate(s.x,s.y);c.globalAlpha=alpha;c.fillStyle='#222c466e';c.strokeStyle='#a6bcdc';c.lineWidth=1.5;c.beginPath();c.arc(0,0,r,0,TAU);c.fill();c.stroke();c.strokeStyle='#b4aec37d';c.setLineDash([5,9]);c.beginPath();c.arc(0,0,r*.93,0,TAU);c.stroke();c.setLineDash([]);
 for(let i=0;i<10;i++){const a=i*TAU/10,rr=r*(.32+.5*((i*.31)%1)),x=Math.cos(a+t*.05)*rr,y=Math.sin(a+t*.05)*rr;c.fillStyle='#1c263dbb';c.beginPath();c.ellipse(x,y,13,8,0,0,TAU);c.fill();line(c,[[x-8,y],[x-7,y-11],[x-4,y-18],[x-2,y-11],[x+2,y-18],[x+5,y-11],[x+8,y-10],[x+7,y]],'#7486a18f',2);}
 for(let i=0;i<6;i++){const a=i*TAU/6+t*.08,x=Math.cos(a)*r*.87,y=Math.sin(a)*r*.87;line(c,[[x-5,y-5],[x+1,y],[x-2,y+5],[x+5,y+1]],'#b8cef0',1.5);}c.restore();
}
// Local coordinates after the standard projectile visibility scale.
export function drawRasenFlash(c,s,reduced=false){
 c.save();c.rotate(Math.atan2(s.vy,s.vx));line(c,[[-25,0],[7,0]],'#253746',7);line(c,[[-22,0],[7,0]],'#e7d39c',3);c.fillStyle='#c7dfd5';c.strokeStyle='#273b49';c.lineWidth=1.5;c.beginPath();c.moveTo(19,0);c.lineTo(3,-5);c.lineTo(-7,0);c.lineTo(3,5);c.closePath();c.fill();c.stroke();line(c,[[-8,-6],[-8,6]],'#e8bd70',2);line(c,[[-13,0],[-7,0]],'#977953',3);
 c.strokeStyle='#b9f3df';c.lineWidth=1.5;const angle=reduced?0:s.age*8;c.beginPath();c.arc(3,0,s.marked?16:10,angle,angle+5);c.stroke();line(c,[[0,-3],[4,0],[0,3]],'#fff2c7');if(s.marked){line(c,[[-21,-10],[19,10]],'#f3df9b',1);line(c,[[-16,14],[12,-16]],'#bdebd2',1);}c.restore();
}
