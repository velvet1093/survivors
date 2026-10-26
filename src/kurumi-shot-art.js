const TAU=Math.PI*2;
const palette=white=>white?{ink:'#34384c',dark:'#727d9e',red:'#bccded',light:'#edf7ff',gold:'#d2d7e5',core:'#ffffff',shadow:'#6574a5'}:{ink:'#302331',dark:'#7c354d',red:'#d95975',light:'#ffbba9',gold:'#e7bc70',core:'#fff0ce',shadow:'#503047'};
const line=(c,points,color,width=1)=>{c.strokeStyle=color;c.lineWidth=width;c.beginPath();points.forEach(([x,y],i)=>i?c.lineTo(x,y):c.moveTo(x,y));c.stroke();};
const poly=(c,points,color)=>{c.fillStyle=color;c.beginPath();points.forEach(([x,y],i)=>i?c.lineTo(x,y):c.moveTo(x,y));c.closePath();c.fill();};
function ring(c,x,y,r,color,width=1){c.strokeStyle=color;c.lineWidth=width;c.beginPath();c.arc(x,y,Math.max(.5,r),0,TAU);c.stroke();}
function dial(c,r,p,{rotation=0,fused=false}={}){
 ring(c,0,0,r,p.ink,3);ring(c,0,0,r,p.gold,1.3);
 for(let i=0;i<12;i++){const a=i*TAU/12+rotation,major=i%3===0;line(c,[[Math.cos(a)*(r-(major?3:2)),Math.sin(a)*(r-(major?3:2))],[Math.cos(a)*(r-1),Math.sin(a)*(r-1)]],major?p.core:p.gold,major?1.6:1);}
 line(c,[[0,-r*.65],[0,0],[r*.4,r*.16]],p.core,1.3);
 c.fillStyle=p.red;c.fillRect(-1,-1,2,2);
 if(fused){ring(c,0,0,r+3,p.red,1);for(let i=0;i<4;i++){const a=i*TAU/4+Math.PI/4;line(c,[[Math.cos(a)*(r+4),Math.sin(a)*(r+4)],[Math.cos(a)*(r+7),Math.sin(a)*(r+7)]],p.gold,1);}}
}

// Called in the projectile's local, scaled context, before velocity rotation.
// The scarlet round has a pointed nose, gold clock core and stepped ink wake;
// its evolved counterpart gains an additional orbiting seal and longer wake.
export function drawKurumiClockShot(c,s,reduced=false){
 const p=palette(!!s.whiteQueen),fused=!!s.fused,age=Math.max(0,s.age||0),tail=fused?37:27;
 c.save();c.rotate(Math.atan2(s.vy||0,s.vx||1));c.lineJoin='miter';
 poly(c,[[-tail-3,-2],[-18,-6],[-5,-4],[4,-7],[17,0],[4,7],[-5,4],[-18,6],[-tail-3,2]],p.ink);
 poly(c,[[-tail,-1],[-17,-3],[-5,-2],[3,-5],[14,0],[3,5],[-5,2],[-17,3]],p.red);
 poly(c,[[-18,-1],[-5,-1],[3,-3],[12,0],[3,3],[-5,1]],p.light);
 poly(c,[[4,-4],[14,0],[4,4],[6,0]],p.core);
 c.fillStyle=p.dark;c.fillRect(-23,-3,6,1);c.fillRect(-20,3,7,1);
 c.save();c.translate(-3,0);dial(c,4.3,p);c.restore();
 if(fused){
  c.save();c.translate(-14,0);c.scale(.6,1);dial(c,8,p,{rotation:reduced?0:age*.9});c.restore();
  line(c,[[-30,-5],[-19,-7],[-11,-5]],p.gold,1);line(c,[[-30,5],[-19,7],[-11,5]],p.gold,1);
  for(let i=0;i<3;i++){const offset=reduced?0:Math.sin(age*5+i)*.6;c.fillStyle=p.gold;c.fillRect(-24-i*5,Math.round(offset)-1,2,2);}
 }
 c.restore();
}

// Called in world coordinates for the engine's clock-muzzle and clock-mark
// effects. New metadata is cosmetic; legacy effects still render correctly.
export function drawKurumiClockEffect(c,e,progress,reduced=false){
 if(e.type!=='clock-muzzle'&&e.type!=='clock-mark')return false;
 const p=palette(!!e.whiteQueen),fused=!!e.fused,t=Math.max(0,Math.min(1,progress)),r=e.r||18;
 c.save();c.translate(e.x,e.y);c.lineCap='round';c.lineJoin='round';
 if(e.type==='clock-muzzle'){
  c.rotate(e.angle||0);const open=reduced?1:Math.min(1,t*5+.5),size=r*.5;
  // An upright dial at the barrel and a short powder-flash spear, not a
  // general explosion. The ink-colored rim keeps it visible on pale floors.
  c.save();c.scale(.48,1);dial(c,size,p,{rotation:reduced?0:t*.25,fused});c.restore();
  poly(c,[[1,-4*open],[8,-3],[17+open*9,0],[8,3],[1,4*open]],p.ink);
  poly(c,[[3,-2],[11,-2],[22,0],[11,2],[3,2]],p.gold);
  poly(c,[[4,-1],[14,-1],[21,0],[14,1],[4,1]],p.core);
  if(!reduced)for(const side of [-1,1]){line(c,[[-2,side*7],[-7-t*6,side*(11+t*3)]],p.red,1.5);c.fillStyle=p.gold;c.fillRect(-7-t*6,side*(11+t*3)-1,2,2);}
 }else{
  const spread=reduced?.85:.55+t*.4;c.scale(spread,spread);
  // The impact stamps a complete clock face over the target, then its four
  // broken tick marks peel away. Gold hands and a red split show stolen time.
  c.globalAlpha*=1-t*.6;dial(c,r*.72,p,{rotation:reduced?0:t*.16,fused});
  line(c,[[-r*.31,-r*.58],[-r*.08,-r*.16],[-r*.21,r*.11],[r*.26,r*.54]],p.red,fused?3:2);
  if(!reduced)for(let i=0;i<4;i++){const a=i*TAU/4+.45,rr=r*(.9+t*.55),x=Math.cos(a)*rr,y=Math.sin(a)*rr;poly(c,[[x-2,y],[x+1,y-4],[x+2,y+1],[x-1,y+3]],i%2?p.red:p.gold);}
 }
 c.restore();return true;
}
