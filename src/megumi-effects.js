// Megumi's Ten Shadows attack effects: the shadow pool his shikigami rise from,
// Divine Dog bites, Nue's diving lightning strike, and the shadow hands that the
// Chimera Shadow Garden raises under enemies.
const TAU=Math.PI*2;
const path=(c,points,color,width=1)=>{c.strokeStyle=color;c.lineWidth=width;c.lineCap='round';c.lineJoin='round';c.beginPath();points.forEach(([x,y],i)=>i?c.lineTo(x,y):c.moveTo(x,y));c.stroke();};
const ease=t=>1-(1-t)**3;
function shadowPool(c,x,y,r,rim){
 c.fillStyle='#07090f';c.beginPath();c.ellipse(x,y,r,r*.38,0,0,TAU);c.fill();
 c.fillStyle='#161d33';c.beginPath();c.ellipse(x,y,r*.72,r*.26,0,0,TAU);c.fill();
 c.strokeStyle=rim;c.lineWidth=1.5;c.beginPath();c.ellipse(x,y,r,r*.38,0,0,TAU);c.stroke();
}
// A wavy tendril of shadow rising from (x,y).
function tendril(c,x,y,h,lean,phase,color,width){
 const pts=[];for(let i=0;i<=6;i++){const f=i/6;pts.push([x+lean*f*h*.3+Math.sin(phase+f*5)*3*f,y-h*f]);}path(c,pts,color,width);
}
function shadowSummon(c,e,t,reduced){
 const r=(e.r||40)*(.35+.65*ease(Math.min(1,t*1.8))),rise=Math.sin(Math.min(1,t*1.4)*Math.PI),rim=e.fused?'#c6d6ff':'#4e6194';
 shadowPool(c,e.x,e.y,r,rim);
 for(let i=0;i<9;i++){const a=i*TAU/9+.3,x=e.x+Math.cos(a)*r*.85,y=e.y+Math.sin(a)*r*.32,h=(10+(i*7)%9)*rise*(e.bird?1.5:1.1);
  tendril(c,x,y,h,Math.cos(a),reduced?0:t*8+i,'#0b0e1a',4);tendril(c,x,y,h*.8,Math.cos(a),reduced?0:t*8+i,'#2c3a62',1.5);}
 if(!reduced)for(let i=0;i<6;i++){const a=i*2.4,d=r*.5*((i*.37)%1),y=e.y-t*38-(i%3)*6;c.fillStyle=e.fused?'#d6e2ff':'#6a7cb0';c.fillRect(e.x+Math.cos(a)*d,y,2,2);}
 // The Ten Shadows sign glows above the pool as the shikigami emerges.
 c.save();c.globalAlpha*=rise;c.strokeStyle=rim;c.lineWidth=1;c.beginPath();c.arc(e.x,e.y-r*.15,r*.32,0,TAU);c.stroke();
 for(let i=0;i<10;i++){const a=i*TAU/10+(reduced?0:t);path(c,[[e.x+Math.cos(a)*r*.26,e.y-r*.15+Math.sin(a)*r*.26],[e.x+Math.cos(a)*r*.36,e.y-r*.15+Math.sin(a)*r*.36]],rim,1);}c.restore();
}
function dogBite(c,e,t,reduced){
 const white=e.white,mark=white?'#f2f6f2':'#1a2030',glow=e.fused?'#e05468':white?'#a8b8d0':'#7d8fd6',size=e.fused?22:16;
 c.save();c.translate(e.x,e.y);c.rotate(e.angle||0);
 // Three raking claw marks sweep across the target.
 const sweep=reduced?1:Math.min(1,t*3);
 for(let i=-1;i<=1;i++){const y=i*6,pts=[];for(let k=0;k<=8;k++){const f=k/8*sweep;pts.push([-size+f*size*2,y+Math.sin(f*Math.PI)*-5+f*4]);}
  path(c,pts,'#0b0e1a',5);path(c,pts,glow,3);path(c,pts,mark,1.2);}
 // The jaws snap shut: two fang rows close from above and below.
 const gap=(reduced?.2:1-ease(Math.min(1,t*2.4)))*12+2;
 for(const side of [-1,1]){c.fillStyle=white?'#d8dee0':'#2a3248';c.beginPath();c.moveTo(-size*.8,side*gap);c.quadraticCurveTo(0,side*(gap+9),size*.8,side*gap);c.closePath();c.fill();
  c.fillStyle='#fbfaf2';for(let k=0;k<4;k++){const x=-size*.55+k*size*.37;c.beginPath();c.moveTo(x-2.5,side*gap);c.lineTo(x,side*(gap-5));c.lineTo(x+2.5,side*gap);c.closePath();c.fill();}}
 c.restore();
}
// Deterministic jagged bolt so a strike holds its shape across frames.
function bolt(a,b,seed){const pts=[[a.x,a.y]],n=7,len=Math.hypot(b.x-a.x,b.y-a.y)||1,nx=-(b.y-a.y)/len,ny=(b.x-a.x)/len;
 for(let k=1;k<n;k++){const f=k/n,j=Math.sin(seed*12.9+k*78.2)*Math.min(18,len*.12);pts.push([a.x+(b.x-a.x)*f+nx*j,a.y+(b.y-a.y)*f+ny*j]);}pts.push([b.x,b.y]);return pts;}
function nueStrike(c,e,t,reduced){
 const pts=e.points||[];if(pts.length<2)return;const fused=e.fused,glow=fused?'#8fbaff':'#b9a8ff',core='#fffdf0',seed=e.seed||1;
 c.save();c.shadowColor=glow;c.shadowBlur=reduced?0:14;
 for(let i=1;i<pts.length;i++){const from=fused&&i>1?pts[i-1]:pts[0],line=bolt(from,pts[i],seed+i);
  path(c,line,glow+'55',fused?10:8);path(c,line,glow,3);path(c,line,core,1.2);
  // A forked branch splits off the bolt halfway down.
  const m=line[3];path(c,[m,[m[0]+Math.sin(seed+i)*14,m[1]+10],[m[0]+Math.sin(seed+i*2)*20,m[1]+20]],glow,1.5);}
 c.restore();
 // Impact flash and a ring of sparks at each target.
 for(let i=1;i<pts.length;i++){const p=pts[i],r=8+ease(t)*16;c.strokeStyle=fused?'#ffe08a':glow;c.lineWidth=2*(1-t)+.5;c.beginPath();c.ellipse(p.x,p.y,r,r*.5,0,0,TAU);c.stroke();
  for(let k=0;k<6;k++){const a=k*TAU/6+seed,d=r*.9;path(c,[[p.x+Math.cos(a)*d*.4,p.y+Math.sin(a)*d*.2],[p.x+Math.cos(a)*d,p.y+Math.sin(a)*d*.5]],core,1);}}
 // Loose feathers drift down from Nue's wings.
 if(!reduced){const s=pts[0];for(let k=0;k<3;k++){const x=s.x+(k-1)*12+Math.sin(t*6+k)*4,y=s.y+t*26+k*3;c.save();c.translate(x,y);c.rotate(Math.sin(t*5+k)*.6);c.fillStyle=fused?'#8a7ac0':'#7a6488';c.beginPath();c.ellipse(0,0,2,5,0,0,TAU);c.fill();path(c,[[0,-5],[0,5]],'#d8cdb8',.8);c.restore();}}
}
// Shadow hands burst from the ground beneath each enemy the garden catches.
function shadowGrasp(c,e,t,reduced){
 const rise=Math.sin(Math.min(1,t)*Math.PI);
 for(const [i,p]of (e.points||[]).entries()){
  c.fillStyle='#07090fcc';c.beginPath();c.ellipse(p.x,p.y+4,14,5,0,0,TAU);c.fill();
  for(let k=0;k<4;k++){const x=p.x-9+k*6,h=(12+((i+k)*5)%8)*rise;tendril(c,x,p.y+4,h,(k-1.5)*.4,reduced?0:t*6+k,'#0b0e1a',4);tendril(c,x,p.y+4,h*.85,(k-1.5)*.4,reduced?0:t*6+k,'#3a4c80',1.2);}
 }
}
export function drawMegumiEffect(c,e,progress,reduced=false){
 const t=Math.max(0,Math.min(1,progress));
 if(e.type==='shadow-summon')shadowSummon(c,e,t,reduced);
 else if(e.type==='dog-bite')dogBite(c,e,t,reduced);
 else if(e.type==='nue-strike')nueStrike(c,e,t,reduced);
 else if(e.type==='shadow-grasp')shadowGrasp(c,e,t,reduced);
 else return false;
 return true;
}
