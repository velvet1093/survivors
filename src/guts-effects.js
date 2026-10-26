const TAU=Math.PI*2;
const path=(c,points,color,width=1)=>{c.strokeStyle=color;c.lineWidth=width;c.lineCap='round';c.lineJoin='round';c.beginPath();points.forEach(([x,y],i)=>i?c.lineTo(x,y):c.moveTo(x,y));c.stroke();};
function brand(c,x,y,size,color,width=2){
 const s=size/18;path(c,[[x,y-12*s],[x,y+12*s]],color,width);
 path(c,[[x-7*s,y-12*s],[x-2*s,y-7*s],[x-7*s,y-2*s],[x,y+3*s],[x+7*s,y-2*s],[x+2*s,y-7*s],[x+7*s,y-12*s]],color,width);
 path(c,[[x-7*s,y+5*s],[x,y+12*s],[x+7*s,y+5*s]],color,width);
}
function dragonslayer(c,reach,hot=false){
 const length=reach*.9,width=Math.max(5,reach*.075);
 c.fillStyle='#25313f';c.beginPath();c.moveTo(13,-width-2);c.lineTo(length-10,-width-3);c.lineTo(length+5,-width*.45);c.lineTo(length+5,width*.7);c.lineTo(length-10,width+3);c.lineTo(13,width+2);c.closePath();c.fill();
 c.fillStyle=hot?'#c1b9b4':'#b2c1c5';c.beginPath();c.moveTo(16,-width+1);c.lineTo(length-9,-width+1);c.lineTo(length+2,-width*.2);c.lineTo(length+2,width*.45);c.lineTo(length-10,width);c.lineTo(16,width);c.closePath();c.fill();
 path(c,[[17,-width+1],[length-10,-width+1],[length,-width*.2]],'#f1f1dd',2);
 path(c,[[18,width*.55],[length-12,width*.55]],'#7c8e96',1.5);
 path(c,[[11,-width-5],[11,width+5]],'#26303e',5);path(c,[[11,-width-4],[11,width+4]],'#b7a17c',2);
 path(c,[[9,0],[-5,0]],'#624b40',5);path(c,[[8,-1],[-4,-1]],'#ac8e66',1);path(c,[[-5,-3],[-5,3]],'#d0b78c',3);
 if(hot)path(c,[[length*.5,-width+2],[length*.54,width-1],[length*.63,-width+2]],'#ba6c68',1.5);
}

// One tangible slab blade drives each attack, with a swept metallic wake. It
// shares the engine's angle, reach and side rather than introducing a new hit.
export function drawGutsSlash(c,e,progress,reduced=false){
 if(e.type!=='guts-slash')return false;
 const t=Math.max(0,Math.min(1,progress)),s=e.side<0?-1:1,r=Math.max(20,e.r||90),hot=!!(e.empowered||e.fused||e.ultimate),phase=reduced?.55:t,span=e.full?TAU:e.fused?4.1:3.6,start=-span/2,angle=(start+phase*span)*s,fade=reduced?1-t:Math.min(1,(1-t)*2.4);
 c.save();c.translate(e.x,e.y);c.rotate(e.angle||0);c.globalAlpha*=fade;
 // The quiet pose retains the whole hit footprint. A finishing cleave has no
 // blind rear arc, so its steel rim is a complete ring in either motion mode.
 if(e.full||reduced){c.save();c.globalAlpha*=e.full?.6:.35;c.strokeStyle=hot?'#dba6a0':'#d3e2df';c.lineWidth=e.full?3:2;c.beginPath();c.arc(0,0,r*.96,e.full?0:start,e.full?TAU:start+span);c.stroke();c.restore();}
 if(!reduced){
  c.save();c.strokeStyle=hot?'#9d555f55':'#8ca8b552';c.lineWidth=r*.16;c.beginPath();c.arc(0,0,r*.75,s<0?angle:angle-.72,s<0?angle+.72:angle);c.stroke();c.restore();
  for(let i=2;i>=1;i--){c.save();c.globalAlpha*=.1+(2-i)*.08;c.rotate(angle-s*i*.14);dragonslayer(c,r,hot);c.restore();}
 }
 c.save();c.rotate(angle);dragonslayer(c,r,hot);c.restore();
 // A sharp edge and short directional chips make the weight legible at the
 // end of the arc. Quiet mode keeps the blade and removes flying debris.
 c.strokeStyle=hot?'#e4bab1':'#e4ece0';c.lineWidth=hot?3:2;c.beginPath();c.arc(0,0,r*.87,s<0?angle:angle-.4,s<0?angle+.4:angle);c.stroke();
 if(!reduced&&t>.35){for(let i=0;i<6;i++){const a=angle+s*(i-.5)*.13,dist=r*(.75+Math.max(0,t-.35)*.4),x=Math.cos(a)*dist,y=Math.sin(a)*dist;c.fillStyle=i%2?'#ac9d83':'#e8d9b0';c.fillRect(Math.round(x),Math.round(y),i%2?3:5,2);}}
 if(hot){c.strokeStyle='#d3827a';c.lineWidth=1.5;c.beginPath();c.arc(0,0,r*.98,s<0?angle:angle-.58,s<0?angle+.58:angle);c.stroke();}
 c.restore();return true;
}

export function drawGutsUltimate(c,g,reduced=false){
 const u=g.ultimate;if(u?.type!=='guts')return false;const p=g.p,age=u.age||0,fade=Math.min(1,age*2.5,Math.max(0,u.duration-age)),radius=(u.r||90)*.5;
 c.save();c.globalAlpha=.45*fade;
 c.strokeStyle='#b86468';c.lineWidth=1.5;c.beginPath();c.ellipse(p.x,p.y+2,radius,radius*.34,0,0,TAU);c.stroke();
 if(!reduced)for(let i=0;i<9;i++){
  const a=i*2.399+age*.2,t=(age*.45+i*.17)%1,x=p.x+Math.cos(a)*(15+t*radius*.5),y=p.y-10-t*55;
  c.globalAlpha=(1-t)*.22*fade;c.fillStyle=i%3?'#3b3340':'#ab5e63';c.fillRect(Math.round(x),Math.round(y),4+i%3,7+i%4);
 }
 c.globalAlpha=.7*fade;brand(c,p.x,p.y-61,12,'#d68a80',1.6);
 if(age<.8){c.globalAlpha=(1-age/.8)*.6;c.strokeStyle='#e6b69c';c.lineWidth=2;c.beginPath();c.ellipse(p.x,p.y-18,24+age*35,35+age*25,0,0,TAU);c.stroke();}
 c.restore();return true;
}
