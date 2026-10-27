// Madoka's effects: pink light arrows tipped with a rosebud (white-gold once she becomes
// Ultimate Madoka), a rose that blooms where each arrow lands, and the Law of Cycles: great
// feathered wings, a halo and drifting feathers over a ring of starlight.
const TAU=Math.PI*2;
const path=(c,points,color,width=1)=>{c.strokeStyle=color;c.lineWidth=width;c.lineCap='round';c.lineJoin='round';c.beginPath();points.forEach(([x,y],i)=>i?c.lineTo(x,y):c.moveTo(x,y));c.stroke();};
const disc=(c,x,y,r,color)=>{c.fillStyle=color;c.beginPath();c.arc(x,y,Math.max(.1,r),0,TAU);c.fill();};
const ease=t=>1-(1-t)**3;
function sparkle(c,x,y,r,color){c.fillStyle=color;c.beginPath();c.moveTo(x,y-r);c.lineTo(x+r*.3,y-r*.3);c.lineTo(x+r,y);c.lineTo(x+r*.3,y+r*.3);c.lineTo(x,y+r);c.lineTo(x-r*.3,y+r*.3);c.lineTo(x-r,y);c.lineTo(x-r*.3,y-r*.3);c.closePath();c.fill();}
// ---- Projectile (local coordinates, rotated to the flight direction) ----
export function drawRoseArrow(c,s,reduced=false){
 const gold=!!s.fused,age=reduced?0:s.age,glow=gold?'#fff0c8':'#ffb8dc',core=gold?'#ffffff':'#fff0f8',shaft=gold?'#f8d878':'#f070a8';
 // A trail of light, a slender shaft, fletching and a rosebud arrowhead.
 path(c,[[-34,0],[6,0]],glow+'55',8);path(c,[[-30,0],[8,0]],shaft,2.5);path(c,[[-22,0],[8,0]],core,1);
 for(const s0 of [-1,1]){c.fillStyle=gold?'#ffffff':'#ffd8ec';c.beginPath();c.moveTo(-26,0);c.lineTo(-32,s0*6);c.lineTo(-22,s0*1.5);c.closePath();c.fill();}
 c.fillStyle='#4a9a4a';c.beginPath();c.moveTo(6,0);c.lineTo(9,-3);c.lineTo(11,0);c.lineTo(9,3);c.closePath();c.fill();
 c.fillStyle=gold?'#ffe080':'#e0306a';c.beginPath();c.ellipse(13,0,4.5,3.5,0,0,TAU);c.fill();c.fillStyle=gold?'#fff8e0':'#ff8ab8';c.beginPath();c.ellipse(13.5,-.8,2.6,2,0,0,TAU);c.fill();
 if(!reduced)for(let i=0;i<4;i++){const ph=(age*3+i/4)%1;sparkle(c,-14-ph*24,Math.sin(i*2.3+age*6)*4,1.6*(1-ph)+.5,i%2?glow:'#ffffff');}
}
// ---- Effects ----
function roseBloom(c,e,t){
 const r=(e.r||30)*(.3+ease(t)*.7),fade=1-t,gold=!!e.fused;
 c.save();c.globalAlpha*=fade;
 // Five petals open outward around a bright heart, ringed by a soft burst.
 c.strokeStyle=gold?'#ffe8a8':'#ffb8dc';c.lineWidth=2*(1-t)+.5;c.beginPath();c.arc(e.x,e.y,r,0,TAU);c.stroke();
 for(let i=0;i<5;i++){const a=i*TAU/5+t*.8,px=e.x+Math.cos(a)*r*.45,py=e.y+Math.sin(a)*r*.45;c.fillStyle=gold?'#fff0c8':i%2?'#f070a8':'#ff9ac4';c.beginPath();c.ellipse(px,py,r*.32,r*.18,a,0,TAU);c.fill();}
 disc(c,e.x,e.y,r*.18+1,gold?'#ffffff':'#ffe0ee');
 for(let i=0;i<6;i++){const a=i*TAU/6+.5,d=r*(.8+t*.4);sparkle(c,e.x+Math.cos(a)*d,e.y+Math.sin(a)*d,2.5*(1-t)+.5,'#ffffff');}
 c.restore();
}
export function drawMadokaEffect(c,e,progress,reduced=false){
 if(e.type!=='rose-bloom')return false;
 roseBloom(c,e,Math.max(0,Math.min(1,progress)));return true;
}
// Feathered wings spread behind her during the Law of Cycles (native sprite units).
export function drawLawWings(c,x,y,native,time=0,reduced=false){
 const flap=reduced?0:Math.sin(time*3)*2;c.save();c.translate(x,y);c.scale(native,native);
 for(const s of [-1,1]){
  // Three feather rows fan out from the shoulder, longest at the bottom.
  for(let row=2;row>=0;row--)for(let i=0;i<6;i++){const ang=(-.9+i*.32)+row*.1,len=14+i*2.4+row*5,bx=s*6,by=-2+row*3,tx=bx+s*Math.cos(ang)*len,ty=by+Math.sin(ang)*len*.7-flap*(1-i/6);
   c.fillStyle=row===2?'#f4c8e0':row===1?'#ffe4f2':'#ffffff';c.beginPath();c.moveTo(bx,by);c.lineTo(tx,ty-2);c.lineTo(tx+s*2,ty+1.5);c.closePath();c.fill();}
  c.strokeStyle='#e8a8cc';c.lineWidth=.6;for(let i=0;i<6;i++){const ang=-.9+i*.32,len=14+i*2.4;c.beginPath();c.moveTo(s*6,-2);c.lineTo(s*6+s*Math.cos(ang)*len,-2+Math.sin(ang)*len*.7-flap*(1-i/6));c.stroke();}
 }
 c.restore();
}
// Law of Cycles: a ring of starlight on the ground and a halo with drifting feathers above.
export function drawLawOfCycles(c,g,layer='under'){
 const u=g.ultimate,p=g.p,age=p.reducedMotion?0:u.age;
 if(layer==='under'){
  const r=140+Math.sin(age*2)*5;c.strokeStyle='#ffcee588';c.lineWidth=1.5;c.beginPath();c.ellipse(p.x,p.y,r,r*.55,0,0,TAU);c.stroke();
  c.strokeStyle='#ffe8a866';c.lineWidth=1;c.setLineDash([3,10]);c.beginPath();c.ellipse(p.x,p.y,r-12,(r-12)*.55,0,-age*.3,TAU-age*.3);c.stroke();c.setLineDash([]);
  for(let i=0;i<8;i++){const a=i*TAU/8+age*.25;sparkle(c,p.x+Math.cos(a)*r,p.y+Math.sin(a)*r*.55,4+Math.sin(age*4+i),'#fff4d8');}
  return;}
 // A golden halo and feathers drifting down around her.
 c.strokeStyle='#ffe8a8cc';c.lineWidth=1.5;c.beginPath();c.ellipse(p.x,p.y-74,14,4,-.1,0,TAU);c.stroke();c.strokeStyle='#ffffff88';c.lineWidth=.8;c.beginPath();c.ellipse(p.x,p.y-74,11,3,-.1,0,TAU);c.stroke();
 for(let i=0;i<14;i++){const ph=(age*.25+i/14)%1,a=i*2.399,x=p.x+Math.cos(a)*(40+(i*13)%90)+Math.sin(age+i)*6,y=p.y-120+ph*150;
  c.save();c.translate(x,y);c.rotate(Math.sin(age*2+i)*.8);c.fillStyle=i%3?'#ffe4f2cc':'#ffffffcc';c.beginPath();c.ellipse(0,0,2,5,0,0,TAU);c.fill();c.strokeStyle='#e8a8cc';c.lineWidth=.6;c.beginPath();c.moveTo(0,-5);c.lineTo(0,5);c.stroke();c.restore();}
 for(let i=0;i<16;i++){const a=i*2.399+age*.2,r=70+((i*17)%110);sparkle(c,p.x+Math.cos(a)*r,p.y-70+Math.sin(a)*r*.5,1.5+Math.sin(age*4+i),'#ffe2f1bb');}
}
