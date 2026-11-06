// Rimuru's effects: Black Flame as a black-fire comet trailing flickering tongues rimmed in
// azure, bursting into a ring of black fire on impact; Beelzebub adds a violet devouring
// vortex. Gluttony spreads a wobbling slime dome that swirls everything into its stomach.
const TAU=Math.PI*2,ease=t=>1-(1-t)**3;
function polygon(c,points,fill){c.fillStyle=fill;c.beginPath();points.forEach(([x,y],i)=>i?c.lineTo(x,y):c.moveTo(x,y));c.closePath();c.fill();}
// A flame tongue pointing toward -x (behind a projectile) or up (in a burst).
function tongue(c,len,w,wob,rim,body){
 polygon(c,[[3,0],[0,-w-1],[-len*.55,-w*.55+wob],[-len-2,wob*1.6],[-len*.55,w*.45+wob],[0,w+1]],rim);
 polygon(c,[[1.5,0],[0,-w],[-len*.5,-w*.45+wob],[-len,wob*1.4],[-len*.5,w*.35+wob],[0,w]],body);
}
export function drawBlackFlame(c,s,reduced=false){
 c.save();c.rotate(Math.atan2(s.vy||0,s.vx||1));const age=reduced?0:s.age||0,fused=!!s.fused,size=fused?1.2:1,rim=fused?'#9a78e0':'#3a8ae0';
 c.scale(size,size);
 // Trailing tongues of black fire, each wavering on its own beat.
 for(let i=4;i>=0;i--){const wob=Math.sin(age*18+i*1.7)*2.2;c.save();c.translate(-4-i*5,Math.sin(age*11+i)*1.5);tongue(c,15-i*1.5,7-i*.9,wob,rim,i%2?'#141a28':'#222a3c');c.restore();}
 // The head: a black fireball with an azure rim and a cyan heart.
 c.fillStyle=rim;c.beginPath();c.arc(2,0,8,0,TAU);c.fill();c.fillStyle='#141a28';c.beginPath();c.arc(2,0,6.5,0,TAU);c.fill();
 c.fillStyle=fused?'#c8b0ff':'#7ad4ff';c.beginPath();c.arc(3,0,2.6+Math.sin(age*20)*.5,0,TAU);c.fill();c.fillStyle='#e8f8ff';c.fillRect(3,-1,2,2);
 if(fused){c.strokeStyle='#b89aff';c.lineWidth=1.2;for(let k=0;k<2;k++){c.beginPath();c.ellipse(2,0,13,5,age*3+k*Math.PI/2,0,Math.PI*1.3);c.stroke();}}
 c.restore();
}
function burst(c,e,t){
 const r=(e.r||40)*(.35+ease(t)*.65),fused=!!e.fused,rim=fused?'#9a78e0':'#3a8ae0',fade=1-t;c.globalAlpha*=fade;
 // Shock ring of azure light.
 c.strokeStyle=rim;c.lineWidth=3*(1-t)+1;c.beginPath();c.ellipse(e.x,e.y,r,r*.62,0,0,TAU);c.stroke();
 // Black flame tongues leap up around the ring.
 for(let i=0;i<10;i++){const a=i*TAU/10+.3,x=e.x+Math.cos(a)*r*.82,y=e.y+Math.sin(a)*r*.5,h=(10+(i%3)*4)*(1-t*.6);c.save();c.translate(x,y);c.rotate(Math.PI/2);tongue(c,h,3.5,Math.sin(t*10+i)*1.5,rim,'#141a28');c.restore();}
 // A dark core, and for Beelzebub a violet vortex dragging inward.
 c.fillStyle='#141a28cc';c.beginPath();c.ellipse(e.x,e.y,r*.42*(1-t*.5),r*.26*(1-t*.5),0,0,TAU);c.fill();
 if(fused){c.strokeStyle='#b89aff';c.lineWidth=1.4;for(let k=0;k<3;k++){c.beginPath();for(let i=0;i<=20;i++){const u=i/20,ang=k*TAU/3+u*4+t*6,d=r*.7*(1-u);const px=e.x+Math.cos(ang)*d,py=e.y+Math.sin(ang)*d*.6;i?c.lineTo(px,py):c.moveTo(px,py);}c.stroke();}}
 for(let i=0;i<8;i++){const a=i*2.399,d=r*(.4+t*.8);c.fillStyle=i%2?'#7ad4ff':'#d2f0f8';c.fillRect(e.x+Math.cos(a)*d-1,e.y+Math.sin(a)*d*.6-1-t*10,2,2);}
}
export function drawRimuruEffect(c,e,progress,reduced=false){
 if(e.type!=='blackflame-burst')return false;c.save();burst(c,e,Math.max(0,Math.min(1,reduced?Math.min(progress,.5):progress)));c.restore();return true;
}
export function drawGluttony(c,g,layer='under'){
 const u=g.ultimate;if(!u||u.type!=='rimuru')return;const p=g.p,age=p.reducedMotion?0:u.age,r=u.r||240,x=u.x??p.x,y=u.y??p.y;
 c.save();
 if(layer==='under'){
  // A slime dome spread over the ground, its edge wobbling as it swallows.
  c.fillStyle='#3a8ac026';c.beginPath();for(let i=0;i<=48;i++){const a=i/48*TAU,rr=r*(1+Math.sin(a*5+age*3)*.025+Math.sin(a*3-age*2)*.02);const px=x+Math.cos(a)*rr,py=y+Math.sin(a)*rr*.62;i?c.lineTo(px,py):c.moveTo(px,py);}c.closePath();c.fill();
  c.strokeStyle='#8ad0f4aa';c.lineWidth=2;c.stroke();
  // Spiral currents drawing everything toward the stomach at the centre.
  c.strokeStyle='#a6dfea55';c.lineWidth=1.2;for(let k=0;k<4;k++){c.beginPath();for(let i=0;i<=30;i++){const t=i/30,ang=k*TAU/4+t*5-age*1.4,d=r*.92*(1-t)+18;const px=x+Math.cos(ang)*d,py=y+Math.sin(ang)*d*.62;i?c.lineTo(px,py):c.moveTo(px,py);}c.stroke();}
  c.fillStyle='#14243a99';c.beginPath();c.ellipse(x,y-2,26+Math.sin(age*4)*2,14+Math.sin(age*4)*1,0,0,TAU);c.fill();
  c.strokeStyle='#7ad4ff88';c.lineWidth=1;c.beginPath();c.ellipse(x,y-2,30,16,0,0,TAU);c.stroke();
 }else{
  // Droplets and debris spiral inward and vanish into the slime.
  for(let i=0;i<18;i++){const ph=((i*.137+age*.35)%1),ang=i*2.399+ph*5,d=(1-ph)*r*.95+12;const px=x+Math.cos(ang)*d,py=y+Math.sin(ang)*d*.62-6*ph;
   c.fillStyle=i%3?'#a6dfeacc':'#4aa8e0cc';c.beginPath();c.ellipse(px,py,2.5*(1-ph)+1,2*(1-ph)+1,0,0,TAU);c.fill();}
 }
 c.restore();
}
