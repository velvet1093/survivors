const TAU=Math.PI*2;
const stroke=(c,points,color,width=1)=>{c.strokeStyle=color;c.lineWidth=width;c.beginPath();points.forEach(([x,y],i)=>i?c.lineTo(x,y):c.moveTo(x,y));c.stroke();};
function seal(c,x,y,r,color,width=2){c.strokeStyle=color;c.lineWidth=width;c.beginPath();c.arc(x,y,Math.max(1,r),0,TAU);c.stroke();}
// Pure visual overlays use the same persisted marks as their damage warnings.
export function drawBerserkBossAttack(c,e,reduced=false){
 const u=e.berserkAttack;if(!u||!e.boss||e.hp<=0)return;
 c.save();c.lineCap='round';const age=u.age;
 if(e.archetype==='femto'){
  const x=u.x,y=u.y-Math.max(45,e.r*1.6),charge=Math.min(1,age/1.25);c.globalAlpha=.5;
  seal(c,x,y,8+charge*10,'#cbbbe7',2);seal(c,x,y,16+charge*17,'#78639288',1);
  if(!reduced)for(let i=0;i<7;i++){const a=i*TAU/7+age*.6;c.fillStyle='#d7c6ee';c.fillRect(x+Math.cos(a)*28-1,y+Math.sin(a)*16-1,2,2);}
 }
 for(const m of u.marks){
  const active=age>=m.delay&&age<m.delay+m.duration;if(!active)continue;
  const p=(age-m.delay)/m.duration;c.globalAlpha=reduced?.7:(1-p*.6);
  if(m.shape==='line'){
   if(u.style==='dragonbreath'){
    stroke(c,[[m.x,m.y],[m.tx,m.ty]],'#6d3d3f',m.width*2+5);stroke(c,[[m.x,m.y],[m.tx,m.ty]],'#db8c59',m.width*2);stroke(c,[[m.x,m.y],[m.tx,m.ty]],'#f9d38b',m.width*.85);
    if(!reduced)for(let i=1;i<9;i++){const q=i/9,x=m.x+(m.tx-m.x)*q,y=m.y+(m.ty-m.y)*q;c.fillStyle=i%2?'#ffe5ae':'#b7614f';c.fillRect(Math.round(x+Math.sin(i*2.3+age*5)*8),Math.round(y-9-p*12),4,6);}
   }else if(u.style==='lances'){
    const dx=m.tx-m.x,dy=m.ty-m.y,nx=-Math.sin(u.angle),ny=Math.cos(u.angle);
    for(let i=1;i<8;i++){const q=i/8,x=m.x+dx*q,y=m.y+dy*q,h=reduced?22:16+Math.sin(p*Math.PI)*22;c.fillStyle='#583e4d';c.beginPath();c.moveTo(x-nx*9,y-ny*9);c.lineTo(x,y-h);c.lineTo(x+nx*9,y+ny*9);c.closePath();c.fill();stroke(c,[[x,y-h+3],[x+nx*3,y+ny*3]],'#eac0a5',3);}
   }else{
    stroke(c,[[m.x,m.y],[m.tx,m.ty]],e.archetype==='femto'?'#483450':'#765d59',m.width*2);stroke(c,[[m.x,m.y],[m.tx,m.ty]],e.archetype==='femto'?'#d8c7ed':'#e8d3b6',3);
    if(u.style==='hornrush'&&!reduced){const q=Math.min(1,p*1.5),x=m.x+(m.tx-m.x)*q,y=m.y+(m.ty-m.y)*q;seal(c,x,y,12+p*17,'#d8bea2',2);}
   }
  }else if(e.archetype==='femto'){
   seal(c,m.x,m.y,m.r*(reduced?.85:.7+p*.3),'#cab7e5',2);seal(c,m.x,m.y,m.r*.5,'#6f5587',3);
   c.fillStyle='#241f3899';c.beginPath();c.arc(m.x,m.y,m.r*.52,0,TAU);c.fill();
   for(let i=0;i<6;i++){const a=i*TAU/6+(reduced?0:age*.5),r=m.r*.8;stroke(c,[[m.x+Math.cos(a)*r,m.y+Math.sin(a)*r],[m.x+Math.cos(a+.13)*r*.4,m.y+Math.sin(a+.13)*r*.4]],'#c1a8dd',1);}
  }else{
   const r=m.r*(reduced?.9:.65+p*.35);c.strokeStyle='#d9bc9c';c.lineWidth=3;c.beginPath();c.ellipse(m.x,m.y,r,r*.58,0,0,TAU);c.stroke();
   for(let i=0;i<6;i++){const a=i*TAU/6,x=m.x+Math.cos(a)*r*.7,y=m.y+Math.sin(a)*r*.42;stroke(c,[[m.x+Math.cos(a)*8,m.y+Math.sin(a)*5],[x,y]],'#4b3a42',2);c.fillStyle=u.style==='bastion'?'#dab0a6':'#bfa58a';c.fillRect(x,y-(reduced?0:Math.sin(p*Math.PI)*16),4,5);}
  }
 }
 c.restore();
}
