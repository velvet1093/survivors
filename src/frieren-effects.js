// Frieren's effects: Zoltraak as a tapered white ray fired from a turning spell circle, with
// sparks shed along its length and a flare where it ends. Ancient Magic's rays gain a gold
// rim and a second, outer circle. A small Zoltraak bolt is drawn for projectile variants.
const TAU=Math.PI*2;
function poly(c,points,color){c.fillStyle=color;c.beginPath();points.forEach(([x,y],i)=>i?c.lineTo(x,y):c.moveTo(x,y));c.closePath();c.fill();}
function diamond(c,x,y,r,color){poly(c,[[x,y-r],[x+r*.6,y],[x,y+r],[x-r*.6,y]],color);}
// A spell circle seen edge-on, facing along +x: two rings, spokes and rune ticks.
function spellCircle(c,r,spin,{rim,glow}){
 c.save();c.scale(.36,1);c.lineWidth=1.6;
 c.strokeStyle=glow;c.lineWidth=4;c.beginPath();c.arc(0,0,r+1,0,TAU);c.stroke();
 c.strokeStyle=rim;c.lineWidth=1.4;c.beginPath();c.arc(0,0,r,0,TAU);c.stroke();c.beginPath();c.arc(0,0,r*.66,0,TAU);c.stroke();
 for(let i=0;i<8;i++){const a=i*TAU/8+spin;c.beginPath();c.moveTo(Math.cos(a)*r*.66,Math.sin(a)*r*.66);c.lineTo(Math.cos(a)*r,Math.sin(a)*r);c.stroke();}
 c.fillStyle=rim;for(let i=0;i<16;i++){const a=i*TAU/16-spin*1.5;c.fillRect(Math.cos(a)*r*.83-1,Math.sin(a)*r*.83-1,2,2);}
 c.restore();
}
export function drawZoltraakRay(c,e,progress,reduced=false){
 if(e.type!=='zoltraak')return false;
 const t=Math.max(0,Math.min(1,progress)),gold=!!e.fused,len=Math.hypot(e.tx-e.x,e.ty-e.y),w=Math.max(1.5,e.width*(1-t*.6));
 const P=gold?{halo:'#f4dc9a55',body:'#f8eec8',rim:'#e8c870',glow:'#f4dc9a66',spark:'#fff0b8'}:{halo:'#bfe8d455',body:'#e8f6ec',rim:'#9ad8bc',glow:'#bfe8d466',spark:'#e8fff4'};
 c.save();c.translate(e.x,e.y);c.rotate(Math.atan2(e.ty-e.y,e.tx-e.x));
 // Halo, body and core taper in from the circle and narrow to a point at the far end.
 poly(c,[[0,-w*.6],[18,-w*1.6],[len,-w*.9],[len+12,0],[len,w*.9],[18,w*1.6],[0,w*.6]],P.halo);
 poly(c,[[0,-w*.35],[16,-w],[len,-w*.55],[len+8,0],[len,w*.55],[16,w],[0,w*.35]],P.body);
 poly(c,[[2,-w*.15],[16,-w*.35],[len,-w*.2],[len+5,0],[len,w*.2],[16,w*.35],[2,w*.15]],'#ffffff');
 if(gold){c.strokeStyle=P.rim;c.lineWidth=1;c.beginPath();c.moveTo(16,-w*1.05);c.lineTo(len,-w*.6);c.moveTo(16,w*1.05);c.lineTo(len,w*.6);c.stroke();}
 // Sparks drift off the ray as it fades.
 if(!reduced)for(let i=0;i<10;i++){const along=(i/10+t*.35)%1*len,side=(i%2?1:-1)*(w*1.3+t*14+(i%3)*3);diamond(c,along,side,2.2*(1-t)+.6,P.spark);}
 // The firing circle, and a second one behind it for Ancient Magic.
 const spin=reduced?0:t*2.2;spellCircle(c,w*2.4+8,spin,P);if(gold){c.save();c.translate(-6,0);spellCircle(c,w*3.4+12,-spin,P);c.restore();}
 // A starburst where the ray ends.
 const f=(1-t)*(w+6);for(let i=0;i<4;i++){c.save();c.translate(len,0);c.rotate(i*Math.PI/4);poly(c,[[-f,0],[0,-1.2],[f,0],[0,1.2]],i%2?P.spark:'#ffffff');c.restore();}
 c.restore();return true;
}
// A short Zoltraak bolt in the projectile's local, rotated frame.
export function drawZoltraakBolt(c,s,reduced=false){
 poly(c,[[-30,-2],[4,-5],[22,0],[4,5],[-30,2]],'#bfe8d466');poly(c,[[-22,-1],[4,-3],[20,0],[4,3],[-22,1]],'#e8f6ec');poly(c,[[-10,0],[4,-1.4],[16,0],[4,1.4]],'#ffffff');
 if(!reduced){const a=(s.age||0)*8;c.strokeStyle='#9ad8bc';c.lineWidth=1;c.beginPath();c.ellipse(-2,0,2.5,6,0,a,a+Math.PI*1.4);c.stroke();}
}
