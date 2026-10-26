const TAU=Math.PI*2;
const path=(c,points,color,width=1)=>{c.strokeStyle=color;c.lineWidth=width;c.lineCap='round';c.lineJoin='round';c.beginPath();points.forEach(([x,y],i)=>i?c.lineTo(x,y):c.moveTo(x,y));c.stroke();};
function blade(c,length,hot,teethOffset=0){
 const width=Math.max(5,length*.055);
 c.fillStyle='#25303d';c.beginPath();c.roundRect(6,-width-3,length,width*2+6,Math.min(6,width));c.fill();
 c.fillStyle=hot?'#d7c5aa':'#a9bdc2';c.beginPath();c.roundRect(9,-width,length-5,width*2,Math.min(4,width));c.fill();path(c,[[12,-width+2],[length-4,-width+2]],'#f3edcd',2);path(c,[[14,0],[length-4,0]],'#566c79',2);
 for(let i=18;i<length-5;i+=9){const x=i+teethOffset;for(const side of [-1,1]){c.fillStyle=hot?'#fff0c4':'#dbe4d5';c.beginPath();c.moveTo(x-3,side*width);c.lineTo(x+2,side*(width+6));c.lineTo(x+5,side*width);c.closePath();c.fill();}}
 c.fillStyle='#8c4d34';c.beginPath();c.roundRect(-10,-12,27,24,5);c.fill();c.fillStyle=hot?'#e3a15c':'#c77c43';c.beginPath();c.roundRect(-7,-9,20,17,3);c.fill();path(c,[[-5,-8],[8,-8]],'#f0c17a',2);path(c,[[-7,-12],[-7,-18],[6,-18],[9,-12]],'#293743',4);path(c,[[-5,0],[3,0]],'#68453c',3);
}
export function drawDenjiSlash(c,e,progress,reduced=false){
 if(e.type!=='denji-slash')return false;
 const t=Math.max(0,Math.min(1,progress)),side=e.side<0?-1:1,r=Math.max(25,e.r||110),hot=!!(e.empowered||e.fused||e.ultimate),span=e.full?TAU:e.fused?4.2:3.6,angle=(-span/2+(reduced?.55:t)*span)*side,fade=Math.min(1,(1-t)*3);
 c.save();c.translate(e.x,e.y);c.rotate(e.angle||0);c.globalAlpha*=fade;
 if(!reduced){c.strokeStyle=hot?'#da916955':'#91a7ae44';c.lineWidth=r*.15;c.beginPath();c.arc(0,0,r*.72,side<0?angle:angle-.65,side<0?angle+.65:angle);c.stroke();}
 if(e.full||reduced){c.strokeStyle=hot?'#dfae81':'#adc5c4';c.globalAlpha*=.55;c.lineWidth=2;c.beginPath();c.arc(0,0,r*.96,e.full?0:-span/2,e.full?TAU:span/2);c.stroke();c.globalAlpha/= .55;}
 c.save();c.rotate(angle);blade(c,r*.86,hot,reduced?0:Math.floor(t*12)%3);c.restore();
 if(!reduced)for(let i=0;i<(hot?11:7);i++){const a=angle+side*(i%3-.5)*.12,d=r*(.66+t*.4),x=Math.cos(a)*d,y=Math.sin(a)*d;path(c,[[x,y],[x+Math.cos(a)*6,y+Math.sin(a)*6]],i%3?'#e6c78d':'#f3ead0',i%3?1:2);}
 c.restore();return true;
}
export function drawDenjiUltimate(c,g,reduced=false){
 const u=g.ultimate;if(u?.type!=='denji')return false;
 const p=g.p,t=Math.max(0,u.age||0),fade=Math.min(1,t*3,Math.max(0,u.duration-t)),r=47*(p.area||1);
 c.save();c.globalAlpha=.65*fade;c.strokeStyle='#d99d66';c.lineWidth=2;c.beginPath();c.ellipse(p.x,p.y+2,r,r*.3,0,0,TAU);c.stroke();
 for(let i=0;i<10;i++){const a=i*TAU/10+(reduced?0:t*.18),x=p.x+Math.cos(a)*r,y=p.y+Math.sin(a)*r*.3;path(c,[[x,y],[x+Math.cos(a)*6,y+Math.sin(a)*2]],'#a9b6ae',1.5);}
 if(t<.75){c.globalAlpha=(1-t/.75)*.6;c.strokeStyle='#edb16e';c.beginPath();c.ellipse(p.x,p.y-28,20+t*33,32+t*28,0,0,TAU);c.stroke();}
 if(!reduced)for(let i=0;i<8;i++){const a=i*2.399,q=(t*.7+i*.13)%1,x=p.x+Math.cos(a)*(18+q*22),y=p.y-15-q*50;c.globalAlpha=(1-q)*.4*fade;c.fillStyle=i%2?'#bf7447':'#e6bb7e';c.fillRect(x,y,2,3);}
 c.restore();return true;
}
