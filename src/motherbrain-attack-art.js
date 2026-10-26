const TAU=Math.PI*2;
const stroke=(c,points,color,width=1)=>{c.strokeStyle=color;c.lineWidth=width;c.beginPath();points.forEach(([x,y],i)=>i?c.lineTo(x,y):c.moveTo(x,y));c.stroke();};
function ring(c,x,y,r,color,width=2){c.strokeStyle=color;c.lineWidth=width;c.beginPath();c.arc(x,y,Math.max(1,r),0,TAU);c.stroke();}

// Damage remains in the saved, fixed warning geometry. This draws the same
// lane from the walking form's mouth, plus its eye flare and crushing footfalls.
export function drawMotherBrainAttack(c,e,reduced=false){
 const u=e.motherBrainAttack;if(e.hp<=0||e.archetype!=='motherbrain'||!e.enraged||!u)return;
 c.save();c.lineCap='round';
 if(u.style==='beam'&&u.beam){
  const b=u.beam,t=u.age,charge=Math.min(1,t/b.delay),active=t>=b.delay&&t<b.delay+b.duration;
  if(t<b.delay){
   ring(c,b.x,b.y,7+charge*12,'#e9aa7066',2);ring(c,b.x,b.y,4+charge*7,'#ffe5af',2);
   c.fillStyle='#fff0c8';c.fillRect(b.x-3,b.y-3,6,6);
   if(!reduced)for(let i=0;i<7;i++){const a=i*TAU/7+t*.65,r=17+(1-(t*.8+i/7)%1)*24;c.fillStyle=i%2?'#d69270':'#ffe0a0';c.fillRect(Math.round(b.x+Math.cos(a)*r),Math.round(b.y+Math.sin(a)*r),3,3);}
  }else if(active){
   const fade=reduced?.85:Math.min(1,(b.delay+b.duration-t)*8),w=b.width*2;c.globalAlpha=fade;
   stroke(c,[[b.x,b.y],[b.tx,b.ty]],'#653f49',w+4);stroke(c,[[b.x,b.y],[b.tx,b.ty]],'#e89c65',w);stroke(c,[[b.x,b.y],[b.tx,b.ty]],'#f9d68e',w*.66);stroke(c,[[b.x,b.y],[b.tx,b.ty]],'#fff6cf',w*.24);
   ring(c,b.x,b.y,14,'#fff1c2',4);
   if(!reduced){const angle=Math.atan2(b.ty-b.y,b.tx-b.x),nx=-Math.sin(angle),ny=Math.cos(angle);for(let i=1;i<7;i++){const q=i/7,x=b.x+(b.tx-b.x)*q,y=b.y+(b.ty-b.y)*q,offset=Math.sin(i*2.3+t*8)*4;stroke(c,[[x+nx*(w*.4+offset),y+ny*(w*.4+offset)],[x-nx*(w*.4+offset),y-ny*(w*.4+offset)]],'#ffedbd88',2);}}
  }
 }else if(u.style==='stomp'){
  for(const s of u.stomps||[]){
   const age=u.age-s.delay;if(age<0||age>s.duration+.15)continue;
   const p=Math.min(1,age/(s.duration+.15)),r=s.r*(reduced?.9:.55+p*.45);c.globalAlpha=(1-p)*.85;
   c.strokeStyle='#e7c59b';c.lineWidth=3;c.beginPath();c.ellipse(s.x,s.y,r,r*.62,0,0,TAU);c.stroke();
   for(let i=0;i<7;i++){const a=i*TAU/7,x=s.x+Math.cos(a)*r*.75,y=s.y+Math.sin(a)*r*.46;stroke(c,[[s.x+Math.cos(a)*12,s.y+Math.sin(a)*7],[x,y],[x+Math.cos(a+.45)*12,y+Math.sin(a+.45)*7]],'#624b43',2);if(!reduced){c.fillStyle=i%2?'#d3b393':'#947b67';c.fillRect(Math.round(x),Math.round(y-Math.sin(p*Math.PI)*18),4+i%3,3+i%2);}}
  }
 }else if(u.style==='rinka'&&u.origin){
  const p=Math.min(1,u.age/u.duration);c.globalAlpha=(1-p)*.7;
  ring(c,u.origin.x,u.origin.y,8+(reduced?0:p*11),'#f6cb87',2);
 }
 c.restore();
}
