const TAU=Math.PI*2;
function polygon(c,points,fill){c.fillStyle=fill;c.beginPath();points.forEach(([x,y],i)=>i?c.lineTo(x,y):c.moveTo(x,y));c.closePath();c.fill();}
export function drawBlackFlame(c,s,reduced=false){
 c.save();c.rotate(Math.atan2(s.vy||0,s.vx||1));const phase=reduced?0:s.age||0,fused=!!s.fused,size=fused?1.18:1;
 c.scale(size,size);polygon(c,[[-23,0],[-12,-4],[-16,-9],[-4,-5],[4,-11],[12,-4],[16,0],[11,7],[3,10],[-4,5],[-15,7],[-11,3]],'#26394d');
 polygon(c,[[-16,0],[-8,-2],[-9,-6],[-1,-3],[5,-8],[11,-3],[13,1],[8,6],[2,6],[-4,3],[-10,4]],fused?'#788ebc':'#76bad2');
 polygon(c,[[-5,0],[-2,-3],[4,-3],[8,0],[4,4],[-1,3]],'#273044');polygon(c,[[0,-2],[4,-1],[6,1],[2,3],[-1,1]],fused?'#c7b9df':'#b7e4ea');
 if(fused){c.strokeStyle='#b3cbd5';c.lineWidth=1;c.beginPath();c.ellipse(1,0,18,7,phase*.8,0,TAU);c.stroke();}
 c.fillStyle='#d5eee6';c.fillRect(7,-3,2,2);c.restore();
}
export function drawGluttony(c,g,layer='under'){
 const u=g.ultimate;if(!u||u.type!=='rimuru')return;const p=g.p,age=p.reducedMotion?0:u.age,r=u.r||240,x=u.x??p.x,y=u.y??p.y;
 c.save();
 if(layer==='under'){
  c.fillStyle='#3d779728';c.beginPath();c.arc(x,y,r,0,TAU);c.fill();c.strokeStyle='#97d6df88';c.lineWidth=1.5;c.setLineDash([4,9]);c.beginPath();c.arc(x,y,r,0,TAU);c.stroke();c.setLineDash([]);
  for(let i=0;i<3;i++){c.strokeStyle=i===0?'#6d94c477':'#bddfe26b';c.lineWidth=1;c.beginPath();c.ellipse(x,y-7,40+i*12,13+i*7,age*.22+i*.7,0,TAU);c.stroke();}
  c.fillStyle='#28374877';c.beginPath();c.ellipse(x,y-4,29,14,0,0,TAU);c.fill();
 }else{
  for(let i=0;i<10;i++){const a=i*2.399+age*.45,rr=30+((i*23-age*33)%Math.max(1,r-35)+Math.max(1,r-35))%Math.max(1,r-35);c.fillStyle=i%2?'#9bcbd4bb':'#6c8facbb';c.fillRect(Math.round(x+Math.cos(a)*rr),Math.round(y+Math.sin(a)*rr*.65),3,2);}
 }
 c.restore();
}
