const TAU=Math.PI*2;
const polygon=(c,points,fill)=>{c.fillStyle=fill;c.beginPath();points.forEach(([x,y],i)=>i?c.lineTo(x,y):c.moveTo(x,y));c.closePath();c.fill();};
function glyph(c,x,y,r,color,angle=0){
 c.save();c.translate(x,y);c.rotate(angle);c.strokeStyle='#26283d';c.lineWidth=4;c.beginPath();c.moveTo(-r*.65,r*.15);c.lineTo(r*.6,-r*.15);c.moveTo(-r*.15,-r*.6);c.lineTo(r*.1,r*.65);c.moveTo(-r*.45,-r*.4);c.lineTo(r*.45,r*.4);c.stroke();
 c.strokeStyle=color;c.lineWidth=1.5;c.stroke();c.beginPath();c.arc(0,0,r*.7,0,TAU);c.stroke();c.fillStyle='#efdba5';c.fillRect(-1,-1,3,3);c.restore();
}

// Called in projectile-local space after the shared visibility scale/translation.
export function drawFeatherineShot(c,s,reduced=false){
 c.save();c.rotate(Math.atan2(s.vy||0,s.vx||1));const red=s.fused||s.revision;
 c.strokeStyle='#25283b';c.lineWidth=6;c.beginPath();c.moveTo(-21,0);c.lineTo(14,0);c.stroke();c.strokeStyle=red?'#dc8ba5':'#a891d2';c.lineWidth=3;c.stroke();
 polygon(c,[[-17,-1],[-12,-7],[-2,-10],[6,-8],[1,-3],[14,0],[3,3],[-1,8],[-8,6],[-15,2]],red?'#b85f85':'#8f7cb8');
 polygon(c,[[-13,-1],[-8,-6],[-1,-7],[0,-3],[9,0],[-2,3],[-6,5],[-10,3]],red?'#efadba':'#d4bde9');
 c.strokeStyle='#fff0d1';c.lineWidth=1.5;c.beginPath();c.moveTo(-16,1);c.lineTo(13,0);c.stroke();polygon(c,[[10,-2],[19,0],[10,2]],'#f2d6a5');
 for(const [x,y]of [[-8,-4],[-4,-6],[-5,4]]){c.strokeStyle=red?'#7a3c64':'#5a5085';c.lineWidth=1;c.beginPath();c.moveTo(x,y);c.lineTo(x+4,0);c.stroke();}
 if(red){c.strokeStyle='#e7c58c';c.lineWidth=1;c.beginPath();c.ellipse(0,0,17,10,reduced?0:s.age*.4,0,TAU);c.stroke();}
 c.fillStyle='#f9e5ba';c.fillRect(15,-1,2,2);c.restore();
}

export function drawFeatherineGlyphs(c,g){
 c.save();for(const e of g.effects)if(e.type==='script-glyph'){
  const t=1-e.life/(e.max||.38),r=e.r*(.45+t*.5);c.globalAlpha=Math.max(0,e.life/(e.max||.38));glyph(c,e.x,e.y,r,e.red?'#e3a2ad':'#c7afe4',g.p.reducedMotion?0:t*.3);
  if(e.red){c.strokeStyle='#ead29b';c.lineWidth=1;c.beginPath();c.moveTo(e.x-r,e.y);c.lineTo(e.x+r,e.y);c.stroke();}
 }c.restore();
}

export function drawFeatherineUltimate(c,g,layer='under'){
 const u=g.ultimate;if(u?.type!=='featherine')return;const reduced=g.p.reducedMotion,age=reduced?0:u.age,r=u.r*Math.min(1,u.age/.35),x=u.x,y=u.y;
 c.save();
 if(layer==='under'){
  c.fillStyle='#4a355e30';c.beginPath();c.arc(x,y,r,0,TAU);c.fill();
  for(let i=0;i<3;i++){c.strokeStyle=['#d6bce5bb','#9f779baa','#d9be8f88'][i];c.lineWidth=i===0?2:1;c.beginPath();c.arc(x,y,r*(1-i*.08),0,TAU);c.stroke();}
  for(let i=0;i<12;i++){const a=i*TAU/12+age*.045;glyph(c,x+Math.cos(a)*r*.86,y+Math.sin(a)*r*.86,11,i%3?'#cbb1e1':'#e6c88e',a+.4);}
  c.strokeStyle='#d5c1e344';c.lineWidth=1;c.beginPath();for(let i=0;i<6;i++){const a=i*TAU/6-Math.PI/2,xx=x+Math.cos(a)*r*.73,yy=y+Math.sin(a)*r*.73;i?c.lineTo(xx,yy):c.moveTo(xx,yy);}c.closePath();c.stroke();
  const last=u.age>u.duration-.6;c.globalAlpha=last?.85:.45;glyph(c,x,y,r*.22,last?'#e9acb4':'#d2b4e8',-Math.PI/7);
 }else{
  // Loose manuscript leaves rise above the fixed stage; still leaves in reduced motion.
  for(let i=0;i<10;i++){const a=i*2.399+age*.16,rr=r*(.32+(i%4)*.14),px=x+Math.cos(a)*rr,py=y+Math.sin(a)*rr*.7-18-Math.sin(age*.7+i)*5;c.save();c.translate(px,py);c.rotate(reduced?-.12:Math.sin(age*.7+i)*.22);c.fillStyle='#d4c8df99';c.fillRect(-4,-6,8,12);c.fillStyle=i%3?'#8c779d':'#ba6e8e';for(let row=0;row<3;row++)c.fillRect(-2,-3+row*3,4-(row%2),1);c.restore();}
  if(u.age>u.duration-.5){const progress=Math.min(1,(u.age-u.duration+.5)/.5);c.strokeStyle='#ecd29d';c.lineWidth=2;c.beginPath();c.moveTo(x-r*.8,y-3);c.lineTo(x-r*.8+r*1.6*progress,y-3);c.stroke();c.strokeStyle='#ca7197';c.lineWidth=5;c.beginPath();c.moveTo(x-r*.7,y+4);c.lineTo(x-r*.7+r*1.4*progress,y+4);c.stroke();}
 }
 c.restore();
}
