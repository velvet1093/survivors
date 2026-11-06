// Jinwoo's effects: Kamish's Wrath's crimson-black dagger arcs, his shadows' violet slashes,
// bashes and claws, Tank's frost slam, Tusk's fireball, Kaisel's dive, Bellion's blade wave,
// shadow smoke when a soldier rises, the System's blue notification window, and the Arise
// domain of the Shadow Monarch.
const TAU=Math.PI*2,ease=t=>1-(1-t)**3;
function arc(c,x,y,r,a0,a1,color,width){c.strokeStyle=color;c.lineWidth=width;c.lineCap='round';c.beginPath();c.arc(x,y,Math.max(.5,r),a0,a1);c.stroke();}
function poly(c,points,color){c.fillStyle=color;c.beginPath();points.forEach(([x,y],i)=>i?c.lineTo(x,y):c.moveTo(x,y));c.closePath();c.fill();}
function crescent(c,x,y,r,angle,spread,t,{outer,inner,core}){
 // A filled crescent sweeping across `spread` radians around `angle`.
 const a0=angle-spread/2,a1=a0+spread*Math.min(1,t*2.4+.2);
 c.fillStyle=outer;c.beginPath();c.arc(x,y,r,a0,a1);c.arc(x,y,r*.62,a1,a0,true);c.closePath();c.fill();
 c.fillStyle=inner;c.beginPath();c.arc(x,y,r*.94,a0+.08,a1);c.arc(x,y,r*.76,a1,a0+.08,true);c.closePath();c.fill();
 arc(c,x,y,r*.88,a0+.15,a1,core,1.2);
}
const DRAW={
 'jinwoo-slash'(c,e,t){c.globalAlpha*=1-t;const s=e.side||1;crescent(c,e.x,e.y,e.r*(.8+t*.25),e.angle+s*.15,2.1,t,{outer:'#3a0a14cc',inner:'#c8283add',core:'#ffd0d8'});
  for(let i=0;i<4;i++){const a=e.angle+(i-1.5)*.4,d=e.r*(.7+t*.5);c.fillStyle=i%2?'#9a8cff':'#ff6070';c.fillRect(e.x+Math.cos(a)*d-1,e.y+Math.sin(a)*d-1,2,2);}},
 'dagger-throw'(c,e,t){const k=Math.min(1,t*2.5),x=e.x+(e.tx-e.x)*k,y=e.y+(e.ty-e.y)*k,a=Math.atan2(e.ty-e.y,e.tx-e.x);c.globalAlpha*=1-Math.max(0,t-.4)/.6;
  c.strokeStyle='#c8283a66';c.lineWidth=3;c.beginPath();c.moveTo(e.x+(x-e.x)*.4,e.y+(y-e.y)*.4);c.lineTo(x,y);c.stroke();
  c.save();c.translate(x,y);c.rotate(a+t*14);poly(c,[[-6,-1.5],[8,0],[-6,1.5]],'#c8283a');poly(c,[[-6,-.6],[6,0],[-6,.6]],'#ff8090');c.fillStyle='#d8a830';c.fillRect(-8,-2,2,4);c.restore();},
 'shadow-slash'(c,e,t){c.globalAlpha*=1-t;const red=!!e.red;c.save();c.translate(e.x,e.y-8);c.rotate(e.angle+.9);
  poly(c,[[-18,-2],[0,-4-e.grade*.4],[18,-1],[0,2]],red?'#5a0a18cc':'#2a2050cc');poly(c,[[-14,-1],[0,-2.5],[14,-.5],[0,1]],red?'#ff7080':'#b0a4ff');c.restore();},
 'shadow-bash'(c,e,t){c.globalAlpha*=1-t;const r=10+ease(t)*16;arc(c,e.x,e.y-8,r,e.angle-1,e.angle+1,'#c8ccec',3*(1-t)+1);arc(c,e.x,e.y-8,r*.7,e.angle-.8,e.angle+.8,'#6a5ab8',2);},
 'shadow-claw'(c,e,t){c.globalAlpha*=1-t;c.save();c.translate(e.x,e.y-8);c.rotate(e.angle);for(let i=-1;i<=1;i++){c.strokeStyle=i?'#7ab08a':'#d8ffe0';c.lineWidth=1.6;c.beginPath();c.moveTo(-8,i*4-6);c.lineTo(8,i*4+4);c.stroke();}c.restore();},
 'tank-slam'(c,e,t){const r=e.r*(.3+ease(t)*.7);c.globalAlpha*=1-t;c.fillStyle='#1a1430aa';c.beginPath();c.ellipse(e.x,e.y,r,r*.55,0,0,TAU);c.fill();
  c.strokeStyle='#a8e0ff';c.lineWidth=3*(1-t)+1;c.beginPath();c.ellipse(e.x,e.y,r,r*.55,0,0,TAU);c.stroke();
  for(let i=0;i<10;i++){const a=i*TAU/10,d=r*.8;poly(c,[[e.x+Math.cos(a)*d,e.y+Math.sin(a)*d*.55-7],[e.x+Math.cos(a)*d-2,e.y+Math.sin(a)*d*.55],[e.x+Math.cos(a)*d+2,e.y+Math.sin(a)*d*.55]],'#d8f4ff');}},
 'tusk-fire'(c,e,t){const k=Math.min(1,t*3),x=e.sx+(e.x-e.sx)*k,y=e.sy+(e.y-e.sy)*k-Math.sin(k*Math.PI)*24;
  if(t<.34){c.fillStyle='#ffb070';c.beginPath();c.arc(x,y,5,0,TAU);c.fill();c.fillStyle='#fff0c0';c.beginPath();c.arc(x,y,2.2,0,TAU);c.fill();return;}
  const u=(t-.34)/.66,r=e.r*(.4+ease(u)*.6);c.globalAlpha*=1-u;c.fillStyle='#d8783a88';c.beginPath();c.arc(e.x,e.y,r,0,TAU);c.fill();c.fillStyle='#ffd070';c.beginPath();c.arc(e.x,e.y,r*.45,0,TAU);c.fill();
  for(let i=0;i<7;i++){const a=i*TAU/7,d=r*(.7+u*.3);poly(c,[[e.x+Math.cos(a)*d,e.y+Math.sin(a)*d-6],[e.x+Math.cos(a)*d-2.5,e.y+Math.sin(a)*d+2],[e.x+Math.cos(a)*d+2.5,e.y+Math.sin(a)*d+2]],i%2?'#ff9a4a':'#ffe08a');}},
 'kaisel-dive'(c,e,t){c.globalAlpha*=1-t;c.strokeStyle='#5a8ab8';c.lineWidth=4*(1-t)+1;c.beginPath();c.moveTo(e.sx,e.sy);c.lineTo(e.x,e.y);c.stroke();
  const r=e.r*(.3+ease(t)*.7);c.strokeStyle='#b8d8f8';c.lineWidth=2;c.beginPath();c.ellipse(e.x,e.y,r,r*.55,0,0,TAU);c.stroke();for(let i=0;i<6;i++){const a=i*TAU/6+t;c.fillStyle='#1a2a44';c.fillRect(e.x+Math.cos(a)*r-2,e.y+Math.sin(a)*r*.55-2,4,4);}},
 'bellion-sweep'(c,e,t){c.globalAlpha*=1-t;crescent(c,e.x,e.y,e.r*(.55+ease(t)*.45),e.angle,1.9,t,{outer:'#1a1428cc',inner:'#8a7cd8dd',core:'#f0ecff'});},
 'arise-rise'(c,e,t){c.globalAlpha*=1-t*.8;const r=e.r||20;c.fillStyle='#1a1430aa';c.beginPath();c.ellipse(e.x,e.y,r,r*.45,0,0,TAU);c.fill();
  for(let i=0;i<6;i++){const x=e.x+(i-2.5)*r*.32,h=(10+(i*7)%9)*ease(t)+4;c.strokeStyle=i%2?'#7a6ad8':'#3a2a78';c.lineWidth=2.5;c.beginPath();c.moveTo(x,e.y);c.quadraticCurveTo(x+(i%2?4:-4),e.y-h*.6,x,e.y-h-6);c.stroke();}
  c.fillStyle='#d8d0ff';c.fillRect(e.x-3,e.y-14*ease(t)-6,2,1);c.fillRect(e.x+2,e.y-14*ease(t)-6,2,1);},
 'system-window'(c,e,t){
  // The System's notification: a translucent blue window that pops in and fades.
  const pop=Math.min(1,t*6),w=118*pop,h=34*pop;c.globalAlpha*=t>.75?(1-t)*4:1;
  c.fillStyle='#0a1a3add';c.fillRect(e.x-w/2,e.y-h/2,w,h);c.strokeStyle='#7ac8ff';c.lineWidth=1.5;c.strokeRect(e.x-w/2,e.y-h/2,w,h);
  if(pop>=1){c.fillStyle='#bfe8ff';c.font='bold 9px sans-serif';c.textAlign='center';c.fillText('[ DAILY QUEST COMPLETE ]',e.x,e.y-3);c.fillStyle='#ffffff';c.font='8px sans-serif';c.fillText('ALL STATS +2 · HP RESTORED',e.x,e.y+9);}},
};
export function drawJinwooEffect(c,e,progress,reduced=false){
 const draw=DRAW[e.type];if(!draw)return false;c.save();draw(c,e,Math.max(0,Math.min(1,reduced&&e.type!=='system-window'?Math.min(progress,.5):progress)));c.restore();return true;
}
// Arise: the Shadow Monarch's domain spreads beneath him; shadow smoke drifts upward over it.
export function drawAriseDomain(c,g,layer='under'){
 const u=g.ultimate;if(!u||u.type!=='jinwoo')return;const p=g.p,age=p.reducedMotion?0:u.age,r=u.r||300,fade=Math.min(1,u.age*3,(u.duration-u.age)*2);
 c.save();c.globalAlpha*=Math.max(0,fade);
 if(layer==='under'){
  c.fillStyle='#120c2655';c.beginPath();c.ellipse(p.x,p.y,r,r*.6,0,0,TAU);c.fill();c.strokeStyle='#7a6ad8aa';c.lineWidth=2;c.beginPath();c.ellipse(p.x,p.y,r,r*.6,0,0,TAU);c.stroke();
  c.strokeStyle='#9a8cff55';c.lineWidth=1;c.setLineDash([6,10]);c.beginPath();c.ellipse(p.x,p.y,r*.72,r*.43,0,age*.3,age*.3+TAU);c.stroke();c.setLineDash([]);
  for(let i=0;i<12;i++){const a=i*TAU/12+age*.2;c.fillStyle='#3a2a78';c.beginPath();c.ellipse(p.x+Math.cos(a)*r*.86,p.y+Math.sin(a)*r*.52,6,3,0,0,TAU);c.fill();}
 }else{
  for(let i=0;i<22;i++){const ph=(age*.4+i/22)%1,a=i*2.399,d=40+((i*37)%Math.max(1,r-50)),x=p.x+Math.cos(a)*d+Math.sin(age*2+i)*4,y=p.y+Math.sin(a)*d*.6-ph*60;
   c.fillStyle=i%3?'#5a4aa899':'#9a8cffaa';c.beginPath();c.ellipse(x,y,2.5*(1-ph)+1,5*(1-ph)+1.5,0,0,TAU);c.fill();}
 }
 c.restore();
}
