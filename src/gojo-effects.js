// Gojo's Limitless effects: Cursed Blue as an attracting vortex with spiralling arms,
// Reversal Red as a crackling crimson orb that bursts into a repulsive shockwave, the
// glowing orb at his fingertips while casting, and the Unlimited Void domain, a starfield
// of endless information streaming inward.
const TAU=Math.PI*2;
const path=(c,points,color,width=1)=>{c.strokeStyle=color;c.lineWidth=width;c.lineCap='round';c.lineJoin='round';c.beginPath();points.forEach(([x,y],i)=>i?c.lineTo(x,y):c.moveTo(x,y));c.stroke();};
const disc=(c,x,y,r,color)=>{c.fillStyle=color;c.beginPath();c.arc(x,y,Math.max(.1,r),0,TAU);c.fill();};
const ease=t=>1-(1-t)**3;
// ---- Cursed Blue field (world coordinates) ----
export function drawBlueVortex(c,f,reduced=false){
 const age=reduced?.5:f.age,fade=Math.min(1,f.life/.6),enter=ease(Math.min(1,f.age/.2)),r=f.r*(.3+enter*.7),collapse=f.life<.35?1-f.life/.35:0;
 c.save();c.globalAlpha*=fade*Math.min(1,f.age/.1+.2);
 c.fillStyle='#0a1430aa';c.beginPath();c.arc(f.x,f.y,r,0,TAU);c.fill();
 // Four spiral arms wind inward toward the core.
 for(let k=0;k<4;k++){const pts=[];for(let i=0;i<=18;i++){const t=i/18,a=k*TAU/4+age*2.6+t*4.2,d=r*(1-t)*(1-collapse*.6);pts.push([f.x+Math.cos(a)*d,f.y+Math.sin(a)*d*.85]);}
  path(c,pts,'#2a70d0aa',4);path(c,pts,'#7ad4ff',1.6);}
 // Debris and light pulled in along the arms.
 for(let i=0;i<20;i++){const t=(age*.9+i/20)%1,a=i*2.399+age*1.8,d=r*(1-t);c.fillStyle=i%3?'#9ae4ff':'#ffffff';c.fillRect(Math.round(f.x+Math.cos(a)*d),Math.round(f.y+Math.sin(a)*d*.85),2,2);}
 c.strokeStyle='#5ab8ff66';c.lineWidth=1;c.beginPath();c.arc(f.x,f.y,r,0,TAU);c.stroke();
 const core=6+Math.sin(age*9)*1.2+collapse*6;disc(c,f.x,f.y,core+5,'#3a9aff55');disc(c,f.x,f.y,core+2,'#bff0ff');disc(c,f.x,f.y,core,'#050a1c');
 c.strokeStyle='#e8fbff';c.lineWidth=1.5;c.beginPath();c.arc(f.x,f.y,core+2,age*3,age*3+4);c.stroke();
 c.restore();
}
// ---- Projectiles (local coordinates, rotated to the flight direction) ----
export function drawRedOrb(c,s,reduced=false){
 const age=reduced?0:s.age;
 // A trailing crimson streak, an orb of repulsive force and crackling arcs.
 path(c,[[-26,0],[0,0]],'#5a0a1a',8);path(c,[[-24,0],[0,0]],'#e0304a',5);path(c,[[-14,0],[2,0]],'#ffb0b8',2);
 disc(c,0,0,11,'#e0304a44');disc(c,0,0,8,'#7a0a1e');disc(c,0,0,6.5,'#f0405a');disc(c,-1,-1,3.5,'#ffd8dc');disc(c,-1.5,-1.5,1.6,'#ffffff');
 for(let i=0;i<4;i++){const a=i*TAU/4+age*9,b=a+.7;path(c,[[Math.cos(a)*8,Math.sin(a)*8],[Math.cos(a+.35)*12,Math.sin(a+.35)*12],[Math.cos(b)*10,Math.sin(b)*10]],i%2?'#ff8090':'#ffe0e4',1.2);}
 if(!reduced){c.strokeStyle='#ff6a7a88';c.lineWidth=1;c.beginPath();c.arc(0,0,12+(age*20)%6,0,TAU);c.stroke();}
}
// ---- Effects ----
function redBurst(c,e,t){
 const r=(e.r||60)*(.15+ease(t)*.85),fade=1-t;
 c.save();c.globalAlpha*=fade;
 disc(c,e.x,e.y,r,'#e0304a22');c.strokeStyle='#ff5a6a';c.lineWidth=4*(1-t)+1;c.beginPath();c.arc(e.x,e.y,r,0,TAU);c.stroke();
 c.strokeStyle='#ffd0d6';c.lineWidth=1.5;c.beginPath();c.arc(e.x,e.y,r*.72,0,TAU);c.stroke();
 // Repulsion streaks fling outward.
 for(let i=0;i<14;i++){const a=i*TAU/14+.2,d0=r*.35,d1=r*(.8+(i%3)*.12);path(c,[[e.x+Math.cos(a)*d0,e.y+Math.sin(a)*d0],[e.x+Math.cos(a)*d1,e.y+Math.sin(a)*d1]],i%2?'#ff8090':'#ffe8ea',1.5);}
 const core=10*(1-t);disc(c,e.x,e.y,core+3,'#ff6a7a');disc(c,e.x,e.y,core,'#ffffff');
 c.restore();
}
function blueCast(c,e,t){
 // A thread of cyan light runs from his fingers to where Blue opens, beaded with orbs.
 path(c,[[e.x,e.y],[e.tx,e.ty]],'#2a70d066',3);path(c,[[e.x,e.y],[e.tx,e.ty]],'#9ae4ff',1);
 for(let i=0;i<5;i++){const k=(t+i/5)%1,x=e.x+(e.tx-e.x)*k,y=e.y+(e.ty-e.y)*k;disc(c,x,y,2.5,'#bff0ff');disc(c,x,y,1.2,'#ffffff');}
}
function voidCollapse(c,e,t){
 const r=e.r*(1-ease(t)),fade=1-t*.6;c.save();c.globalAlpha*=fade;
 c.strokeStyle='#e8dcff';c.lineWidth=4;c.beginPath();c.arc(e.x,e.y,Math.max(.1,r),0,TAU);c.stroke();
 for(let i=0;i<16;i++){const a=i*TAU/16+t;path(c,[[e.x+Math.cos(a)*r,e.y+Math.sin(a)*r],[e.x+Math.cos(a)*r*.2,e.y+Math.sin(a)*r*.2]],i%2?'#b8a0ff':'#ffffff',1.5);}
 disc(c,e.x,e.y,8+t*20,'#ffffff');c.restore();
}
export function drawGojoEffect(c,e,progress,reduced=false){
 const t=Math.max(0,Math.min(1,progress));
 if(e.type==='red-impact')redBurst(c,e,t);
 else if(e.type==='blue-cast')blueCast(c,e,t);
 else if(e.type==='void-collapse')voidCollapse(c,e,t);
 else return false;
 return true;
}
// The orb that gathers at his fingertips while casting Blue or Red.
export function drawCastOrb(c,x,y,kind,scale=1,time=0){
 const red=kind==='red',k=1+Math.sin(time*18)*.15;
 disc(c,x,y,7*scale*k,red?'#ff4a6044':'#4ab8ff44');disc(c,x,y,4*scale,red?'#f0405a':'#5ac8ff');disc(c,x-.5*scale,y-.5*scale,2*scale,'#ffffff');
 c.strokeStyle=red?'#ffc0c8':'#c8f0ff';c.lineWidth=1;c.beginPath();c.arc(x,y,6*scale,time*8,time*8+3.5);c.stroke();
}
// ---- Unlimited Void ----
export function drawUnlimitedVoid(c,u,reduced=false){
 const age=reduced?0:u.age,r=u.r*ease(Math.min(1,u.age/.45));if(r<2)return;
 const grad=c.createRadialGradient(u.x,u.y,4,u.x,u.y,r);grad.addColorStop(0,'#1a1040e8');grad.addColorStop(.6,'#0c0a24d8');grad.addColorStop(1,'#2a1a5a40');
 c.fillStyle=grad;c.beginPath();c.arc(u.x,u.y,r,0,TAU);c.fill();
 c.save();c.beginPath();c.arc(u.x,u.y,Math.max(1,r-2),0,TAU);c.clip();
 // A slowly turning starfield.
 for(let i=0;i<60;i++){const a=i*2.399+age*.05,d=r*Math.sqrt((i+.5)/60);c.fillStyle=i%5===0?'#ffffff':i%2?'#b8c0f0':'#8a7ad0';c.fillRect(Math.round(u.x+Math.cos(a)*d),Math.round(u.y+Math.sin(a)*d),i%7===0?2:1,i%7===0?2:1);}
 // Endless information streaming toward the centre.
 for(let i=0;i<26;i++){const t=(age*.35+i/26)%1,a=i*2.399,d0=r*(1-t),d1=Math.max(0,d0-10-t*14);path(c,[[u.x+Math.cos(a)*d0,u.y+Math.sin(a)*d0],[u.x+Math.cos(a)*d1,u.y+Math.sin(a)*d1]],i%3?'#e8e4ffaa':'#a8e0ff',1);}
 // Tilted event-horizon rings around a bright singularity.
 for(let i=1;i<=3;i++){c.strokeStyle=['#c8b4ff66','#8aa8ff44','#f0c0ff33'][i-1];c.lineWidth=1;c.beginPath();c.ellipse(u.x,u.y,r*(.3+i*.2),r*(.08+i*.06),age*.15*i,0,TAU);c.stroke();}
 disc(c,u.x,u.y,7,'#ffffff55');disc(c,u.x,u.y,3.5,'#ffffff');
 c.restore();
 c.strokeStyle='#d8c8ff';c.lineWidth=2;c.beginPath();c.arc(u.x,u.y,r,age*.2,age*.2+TAU);c.stroke();
 c.strokeStyle='#8a6ae066';c.lineWidth=1;c.setLineDash([4,10]);c.beginPath();c.arc(u.x,u.y,r+5,-age*.3,TAU-age*.3);c.stroke();c.setLineDash([]);
}
