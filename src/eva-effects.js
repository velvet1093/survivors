// Shinji's EVA combat effects: Pallet Rifle tracers and muzzle flash, the Spear of
// Longinus, berserk claw rakes, and AT Fields drawn as the series' orange octagonal
// ripples (the passive shield, the berserk aura and the closing shockwave).
const TAU=Math.PI*2;
const path=(c,points,color,width=1)=>{c.strokeStyle=color;c.lineWidth=width;c.lineCap='round';c.lineJoin='round';c.beginPath();points.forEach(([x,y],i)=>i?c.lineTo(x,y):c.moveTo(x,y));c.stroke();};
const ease=t=>1-(1-t)**3;
// Octagon outline; sy flattens it for ground-level fields.
function octagon(c,x,y,r,{color,width=1,fill,sy=1,angle=Math.PI/8}){c.beginPath();for(let i=0;i<=8;i++){const a=i*TAU/8+angle,xx=x+Math.cos(a)*r,yy=y+Math.sin(a)*r*sy;i?c.lineTo(xx,yy):c.moveTo(xx,yy);}c.closePath();if(fill){c.fillStyle=fill;c.fill();}if(color){c.strokeStyle=color;c.lineWidth=width;c.stroke();}}
// A layered AT Field: an orange octagon with inner echoes, as when it blocks a strike.
export function atField(c,x,y,r,{alpha=1,sy=1,phase=0}={}){
 c.save();c.globalAlpha*=alpha;
 octagon(c,x,y,r,{fill:'#ff8a2026',color:'#ff8a20',width:3,sy});octagon(c,x,y,r,{color:'#ffe0a0',width:1,sy});
 for(const k of [.82,.64,.46])octagon(c,x,y,r*((k+phase*.18)%1||k),{color:'#ffb050'+(k>.6?'dd':'99'),width:1.5,sy});
 c.restore();
}
// ---- Projectiles (local coordinates, already rotated to the flight direction) ----
export function drawPalletRound(c,s,reduced=false){
 // A heavy tracer: dark streak, hot orange body and a white-hot core.
 path(c,[[-30,0],[4,0]],'#2a1a10',7);path(c,[[-26,0],[4,0]],'#f08a2a',4);path(c,[[-14,0],[6,0]],'#ffe0a0',2);
 c.fillStyle='#fff6dc';c.beginPath();c.ellipse(5,0,4,2.4,0,0,TAU);c.fill();
 if(!reduced){c.fillStyle='#ffb04a88';c.beginPath();c.ellipse(0,0,9,4,0,0,TAU);c.fill();}
}
export function drawLonginus(c,s,reduced=false){
 const t=reduced?0:s.age*14;
 // Crimson aura trailing the spear.
 if(!reduced){c.fillStyle='#d0304a33';c.beginPath();c.ellipse(-10,0,34,9,0,0,TAU);c.fill();}
 path(c,[[-34,0],[8,0]],'#3a0c18',6);path(c,[[-33,0],[8,0]],'#a82440',4);path(c,[[-31,-1],[8,-1]],'#f07a8a',1);
 // Twin tines twisting around each other into two points.
 for(const s0 of [-1,1]){const pts=[];for(let i=0;i<=10;i++){const f=i/10,x=6+f*32,w=Math.sin(f*Math.PI*1.5+t*.2*s0)*4*s0+s0*f*5;pts.push([x,w]);}path(c,pts,'#5a1020',4);path(c,pts,'#d8405a',2);}
 c.fillStyle='#ffd0d8';for(const s0 of [-1,1]){c.beginPath();c.moveTo(38,s0*5);c.lineTo(44,s0*7);c.lineTo(37,s0*7.5);c.fill();}
}
// ---- Effects ----
function muzzle(c,e,t){
 c.save();c.translate(e.x,e.y);c.rotate(e.angle||0);const k=1-t;
 c.fillStyle=`rgba(255,210,120,${.9*k})`;c.beginPath();c.moveTo(0,-5);c.lineTo(22*k+6,0);c.lineTo(0,5);c.closePath();c.fill();
 c.fillStyle=`rgba(255,255,235,${k})`;c.beginPath();c.ellipse(3,0,6*k+2,3*k+1,0,0,TAU);c.fill();
 for(const s of [-1,1])path(c,[[2,s*2],[10*k+4,s*(8*k+3)]],`rgba(255,190,90,${k})`,2);
 c.restore();
}
function claws(c,e,t,reduced){
 // Three ragged rakes tear outward from the berserk EVA, glowing green.
 c.save();c.translate(e.x,e.y);c.rotate(e.angle||0);const reach=e.r*(.25+ease(Math.min(1,t*1.6))*.75),fade=1-t;
 for(let i=-1;i<=1;i++){const pts=[];for(let k=0;k<=10;k++){const f=k/10,x=reach*(.25+f*.75),y=i*16*f-Math.sin(f*Math.PI)*10+i*5+(reduced?0:Math.sin(f*11+i)*1.2);pts.push([x,y]);}
  // Each rake tapers from a thick root to a sharp tip.
  for(let k=1;k<pts.length;k++){const w=1-k/pts.length;path(c,[pts[k-1],pts[k]],`rgba(20,16,30,${.7*fade})`,2+w*7);path(c,[pts[k-1],pts[k]],`rgba(130,220,90,${fade})`,1+w*4);}
  path(c,pts.slice(0,7),`rgba(236,255,200,${fade})`,1);}
 c.restore();
}
function shockwave(c,e,t){
 // The closing AT Field burst: nested octagons racing outward.
 for(const lag of [0,.12,.24]){const k=Math.max(0,Math.min(1,(t-lag)/(1-lag)));if(k<=0)continue;atField(c,e.x,e.y,e.r*(.08+ease(k)*.92),{alpha:(1-k)*.9,sy:.55});}
}
export function drawEvaEffect(c,e,progress,reduced=false){
 const t=Math.max(0,Math.min(1,progress));
 if(e.type==='pallet-muzzle')muzzle(c,e,t);
 else if(e.type==='eva-claw')claws(c,e,t,reduced);
 else if(e.type==='at-burst')shockwave(c,e,t);
 else return false;
 return true;
}
// Berserk aura: an AT Field octagon on the ground and green sparks rising off the unit.
export function drawEvaAura(c,g,layer='under'){
 const u=g.ultimate;if(u?.type!=='shinji')return;const p=g.p,age=p.reducedMotion?0:u.age;
 if(layer==='under'){const r=92+Math.sin(age*4)*3;atField(c,p.x,p.y,r,{alpha:.75,sy:.5,phase:(age*.6)%1});return;}
 for(let i=0;i<10;i++){const a=i*2.399,phase=(age*.9+i/10)%1;c.fillStyle=i%3?'#9be070cc':'#ffb24aaa';c.fillRect(Math.round(p.x+Math.cos(a)*(16+phase*14)),Math.round(p.y-8-phase*74),2,i%2?5:3);}
}
// The AT Field passive shield around the EVA while it holds charge.
export function drawAtFieldShield(c,x,y,scale,time=0,reduced=false){
 c.save();c.translate(x,y-26*scale);c.scale(1,1.2);atField(c,0,0,24*scale,{alpha:.55,phase:reduced?0:(time*.5)%1});c.restore();
}
