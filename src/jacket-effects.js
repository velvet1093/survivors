// Jacket's effects in Hotline Miami's neon palette: tracer bullets (spinning throwing knives
// for the Biker), a tumbling hammer, a muzzle flash, the hammer smash's magenta-cyan
// shockwave, a Combo pop-up, and the Hotline Rampage's pulsing neon floor grid.
const TAU=Math.PI*2,ease=t=>1-(1-t)**3;
function poly(c,points,color){c.fillStyle=color;c.beginPath();points.forEach(([x,y],i)=>i?c.lineTo(x,y):c.moveTo(x,y));c.closePath();c.fill();}
// Called in the projectile's local frame, already rotated to its flight direction.
export function drawJacketShot(c,s,reduced=false){
 if(s.type==='hammer'){const spin=reduced?0:(s.age||0)*16;c.save();c.rotate(spin);c.fillStyle='#8a5a30';c.fillRect(-10,-1.5,16,3);c.fillStyle='#5a5e6a';c.fillRect(4,-6,7,12);c.fillStyle='#d8dce8';c.fillRect(4,-6,7,2);c.fillStyle='#d82838';c.fillRect(9,2,2,2);c.restore();return true;}
 if(s.type!=='uzi')return false;
 if(s.knife){const spin=reduced?0:(s.age||0)*22;c.save();c.rotate(spin);poly(c,[[-7,-1.5],[8,0],[-7,1.5]],'#d8dce8');c.fillStyle='#3a2a20';c.fillRect(-10,-1.5,4,3);c.restore();return true;}
 c.strokeStyle=s.fused?'#ff6aaa66':'#ffe08a55';c.lineWidth=3;c.beginPath();c.moveTo(-16,0);c.lineTo(3,0);c.stroke();
 c.fillStyle=s.fused?'#ff8ac0':'#fff0b0';c.fillRect(-7,-1,10,2);c.fillStyle='#ffffff';c.fillRect(1,-1,3,2);return true;
}
const DRAW={
 'uzi-muzzle'(c,e,t){if(e.knife)return;c.save();c.translate(e.x,e.y);c.rotate(e.angle);c.globalAlpha*=1-t;poly(c,[[0,-4],[12,0],[0,4],[3,0]],'#ffe08a');poly(c,[[0,-2],[7,0],[0,2]],'#ffffff');c.restore();},
 'hammer-smash'(c,e,t){const r=e.r*(.3+ease(t)*.7);c.globalAlpha*=1-t;c.lineWidth=4*(1-t)+1;c.strokeStyle='#ff4a9a';c.beginPath();c.ellipse(e.x,e.y,r,r*.55,0,0,TAU);c.stroke();
  c.strokeStyle='#4ac8d8';c.lineWidth=2;c.beginPath();c.ellipse(e.x,e.y,r*.7,r*.38,0,0,TAU);c.stroke();
  for(let i=0;i<8;i++){const a=i*TAU/8+.2,d=r*(.6+t*.4);c.fillStyle=i%2?'#d82838':'#ff8ab8';c.fillRect(e.x+Math.cos(a)*d-2,e.y+Math.sin(a)*d*.55-2-t*8,3,3);}},
 'combo-pop'(c,e,t){c.globalAlpha*=t>.6?(1-t)/.4:1;const s=1+Math.sin(Math.min(1,t*4)*Math.PI)*.25;c.save();c.translate(e.x,e.y-t*18);c.scale(s,s);c.textAlign='center';c.font='bold 14px sans-serif';
  c.fillStyle='#4ac8d8';c.fillText(e.chain+'x COMBO',2,2);c.fillStyle='#ff4a9a';c.fillText(e.chain+'x COMBO',0,0);c.font='bold 9px sans-serif';c.fillStyle='#ffffff';c.fillText('LETHAL FRENZY',0,12);c.restore();},
};
export function drawJacketEffect(c,e,progress,reduced=false){const draw=DRAW[e.type];if(!draw)return false;c.save();draw(c,e,Math.max(0,Math.min(1,reduced&&e.type!=='combo-pop'?Math.min(progress,.5):progress)));c.restore();return true;}
// Hotline Rampage: a pulsing magenta and cyan floor grid around Jacket.
export function drawRampage(c,g,layer='under'){
 const u=g.ultimate;if(!u||u.type!=='jacket')return;const p=g.p,age=p.reducedMotion?0:u.age,r=u.r||280,fade=Math.max(0,Math.min(1,u.age*4,(u.duration-u.age)*2));
 c.save();c.globalAlpha*=fade;
 if(layer==='under'){
  c.fillStyle='#2a0a2a44';c.beginPath();c.ellipse(p.x,p.y,r,r*.6,0,0,TAU);c.fill();
  c.save();c.beginPath();c.ellipse(p.x,p.y,r,r*.6,0,0,TAU);c.clip();c.lineWidth=1;
  for(let i=-8;i<=8;i++){c.strokeStyle=i%2?'#ff4a9a44':'#4ac8d844';c.beginPath();c.moveTo(p.x+i*r/8,p.y-r);c.lineTo(p.x+i*r/8,p.y+r);c.stroke();c.beginPath();c.moveTo(p.x-r,p.y+i*r*.6/8+((age*20)%(r*.6/8)));c.lineTo(p.x+r,p.y+i*r*.6/8+((age*20)%(r*.6/8)));c.stroke();}
  c.restore();const pulse=1+Math.sin(age*8)*.03;c.strokeStyle='#ff4a9a';c.lineWidth=2;c.beginPath();c.ellipse(p.x,p.y,r*pulse,r*.6*pulse,0,0,TAU);c.stroke();
 }else{
  for(let i=0;i<10;i++){const a=i*2.399+age,d=40+(i*29)%(r-40);c.fillStyle=i%2?'#ff4a9acc':'#4ac8d8cc';c.fillRect(p.x+Math.cos(a)*d,p.y+Math.sin(a)*d*.6-20-(age*30+i*7)%40,2,6);}
 }
 c.restore();
}
