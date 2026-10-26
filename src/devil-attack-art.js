const TAU=Math.PI*2;
const line=(c,points,color,width=1)=>{c.strokeStyle=color;c.lineWidth=width;c.lineCap='round';c.lineJoin='round';c.beginPath();points.forEach(([x,y],i)=>i?c.lineTo(x,y):c.moveTo(x,y));c.stroke();};
function ring(c,x,y,r,color,width=1){c.strokeStyle=color;c.lineWidth=width;c.beginPath();c.arc(x,y,Math.max(.1,r),0,TAU);c.stroke();}
function mouth(c,x,y,r,p,reduced){
 c.save();c.translate(x,y);c.scale(1,.65);c.fillStyle='#332b4399';c.beginPath();c.arc(0,0,r*.74,0,TAU);c.fill();ring(c,0,0,r*.77,'#b97f96',3);
 for(let i=0;i<12;i++){const a=i*TAU/12,d=r*.65,tx=Math.cos(a)*d,ty=Math.sin(a)*d,inner=d-(reduced?8:7+Math.sin(p*Math.PI)*7);c.fillStyle=i%2?'#e8c9b3':'#a99b9a';c.beginPath();c.moveTo(tx-Math.sin(a)*4,ty+Math.cos(a)*4);c.lineTo(Math.cos(a)*inner,Math.sin(a)*inner);c.lineTo(tx+Math.sin(a)*4,ty-Math.cos(a)*4);c.fill();}
 c.restore();
}
// The renderer follows saved source-clock marks exactly. Essential warning
// rings remain in drawHazards; these overlays never move their aim or hit area.
export function drawDevilAttack(c,e,reduced=false){
 const u=e.devilAttack;if(!u||!e.boss||e.hp<=0||!Number.isFinite(u.age))return false;
 c.save();const age=u.age,steel=e.archetype==='katanaman',bat=e.archetype==='batdevil',color=steel?'#d6e2dc':bat?'#d8ba9f':'#d4a2b0';
 if(age<1.3){const x=u.x??e.x,y=(u.y??e.y)-Math.max(35,e.r*1.3),charge=Math.min(1,age/1.3);c.globalAlpha=.55;ring(c,x,y,6+charge*10,color,1.5);
  if(!reduced)for(let i=0;i<4;i++){const a=i*Math.PI/2+age*.6,d=22-charge*8;line(c,[[x+Math.cos(a)*d,y+Math.sin(a)*d],[x+Math.cos(a)*(d-4),y+Math.sin(a)*(d-4)]],color,1.5);}
 }
 for(const m of u.marks||[]){
  const duration=m.duration||.4,phase=(age-(m.delay||0))/duration;if(phase<0||phase>1)continue;
  c.globalAlpha=reduced?.65:1-phase*.55;
  if(m.shape==='line'){
   const dx=m.tx-m.x,dy=m.ty-m.y,a=Math.atan2(dy,dx),nx=-Math.sin(a),ny=Math.cos(a);
   if(steel){line(c,[[m.x,m.y],[m.tx,m.ty]],'#4c5a6b',Math.max(4,m.width*1.5));line(c,[[m.x,m.y],[m.tx,m.ty]],'#d3ded6',4);line(c,[[m.x,m.y],[m.tx,m.ty]],'#fff1d2',1.5);
    if(!reduced)for(let i=1;i<8;i++){const q=i/8,xx=m.x+dx*q,yy=m.y+dy*q,side=i%2?1:-1;line(c,[[xx,yy],[xx+nx*side*12,yy+ny*side*12]],'#a7b3b5',1);}
   }else if(bat){for(let i=1;i<8;i++){const q=i/8,xx=m.x+dx*q,yy=m.y+dy*q;c.save();c.translate(xx,yy);c.rotate(a);c.strokeStyle=i%2?'#e5c5a9':'#876b7d';c.lineWidth=2;c.beginPath();c.arc(0,0,10+m.width*.55,-1.1,1.1);c.stroke();c.restore();}}
   else{line(c,[[m.x,m.y],[m.tx,m.ty]],'#69435e',m.width*1.5);line(c,[[m.x,m.y],[m.tx,m.ty]],'#d2a8a8',3);for(let i=1;i<8;i++){const q=i/8,xx=m.x+dx*q,yy=m.y+dy*q,s=i%2?1:-1;line(c,[[xx,yy],[xx+nx*s*11,yy+ny*s*11],[xx+nx*s*13+Math.cos(a)*5,yy+ny*s*13+Math.sin(a)*5]],'#e2c6af',2);}}
  }else if(m.shape==='circle'){
   if(steel){ring(c,m.x,m.y,m.r*(reduced?.85:.5+phase*.45),'#b9c9c8',2);for(let i=0;i<4;i++){const a=i*Math.PI/2+.4;line(c,[[m.x+Math.cos(a)*m.r*.25,m.y+Math.sin(a)*m.r*.25],[m.x+Math.cos(a)*m.r*.83,m.y+Math.sin(a)*m.r*.83]],'#f2e9cf',2);}}
   else if(bat){const radius=m.r*(reduced?.8:.5+phase*.4);for(const scale of [.5,.85,1]){c.strokeStyle=scale===1?'#dfc2a6':'#8d7584';c.lineWidth=2;c.beginPath();c.ellipse(m.x,m.y,radius*scale,radius*scale*.7,0,0,TAU);c.stroke();}if(!reduced)for(let i=0;i<5;i++){const a=i*TAU/5,x=m.x+Math.cos(a)*radius*.7,y=m.y+Math.sin(a)*radius*.5;c.fillStyle='#cfaa95';c.fillRect(x,y-Math.sin(phase*Math.PI)*12,3,4);}}
   else mouth(c,m.x,m.y,m.r,phase,reduced);
  }
 }
 c.restore();return true;
}
