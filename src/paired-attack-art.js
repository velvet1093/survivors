// Original attack drawings read the same saved positions and clocks as combat.
// They never move a target, create a hitbox or change a projectile's state.
const TAU=Math.PI*2;
const clamp=n=>Math.max(0,Math.min(1,Number.isFinite(n)?n:0));
const finite=(n,fallback=0)=>Number.isFinite(n)?n:fallback;
const line=(c,points,color,width=1)=>{c.strokeStyle=color;c.lineWidth=width;c.lineCap='round';c.lineJoin='round';c.beginPath();points.forEach(([x,y],i)=>i?c.lineTo(x,y):c.moveTo(x,y));c.stroke();};
const poly=(c,points,color,edge=null)=>{c.fillStyle=color;c.beginPath();points.forEach(([x,y],i)=>i?c.lineTo(x,y):c.moveTo(x,y));c.closePath();c.fill();if(edge){c.strokeStyle=edge;c.lineWidth=1.5;c.stroke();}};
function disc(c,x,y,r,color,edge=null,width=1.5){c.fillStyle=color;c.beginPath();c.arc(x,y,Math.max(.1,r),0,TAU);c.fill();if(edge){c.strokeStyle=edge;c.lineWidth=width;c.stroke();}}
function ring(c,x,y,r,color,width=1){c.strokeStyle=color;c.lineWidth=width;c.beginPath();c.arc(x,y,Math.max(.1,r),0,TAU);c.stroke();}
function spiral(c,r,t,reduced=false){
 disc(c,0,0,r,'#76c3d8','#293c56',2);disc(c,-r*.12,-r*.13,r*.75,'#aedee5');
 // Opposed streams cross within a solid, outlined chakra sphere.
 for(let i=0;i<3;i++){
  const angle=i*TAU/3+(reduced?0:t*2.5);c.save();c.rotate(angle);c.strokeStyle=i===1?'#f1f2d2':'#5a9cbe';c.lineWidth=Math.max(1.5,r*.09);c.beginPath();c.ellipse(0,0,r*.83,r*.31,.4,-.4,Math.PI*1.7);c.stroke();c.restore();
 }
 disc(c,-r*.2,-r*.24,Math.max(1.5,r*.2),'#f4f4dc');ring(c,0,0,r*.9,'#ceeef0',1);
}
function kunai(c,t,reduced=false){
 // Three prongs and a paper seal distinguish the Flying Raijin tool.
 c.save();c.rotate(t);line(c,[[-22,0],[-4,0]],'#273849',6);line(c,[[-20,0],[-3,0]],'#c7a974',3);
 poly(c,[[-4,-4],[14,-4],[25,0],[14,4],[-4,4]],'#abbcc1','#26374a');line(c,[[0,-2],[16,-2],[22,0]],'#edf0d8',1.5);
 poly(c,[[2,-3],[8,-10],[20,-11],[13,-5]],'#a7bdc2','#26374a');poly(c,[[2,3],[8,10],[20,11],[13,5]],'#a7bdc2','#26374a');
 line(c,[[-5,-7],[-5,7]],'#e3c483',2);c.fillStyle='#e6d8ba';c.fillRect(-16,-3,6,6);line(c,[[-14,-2],[-12,0],[-14,2]],'#927d67',1);
 if(!reduced)line(c,[[-31,0],[-23,0]],'#e8d9a255',2);c.restore();
}
function petal(c,x,y,size,angle,color='#c4a2db'){
 c.save();c.translate(x,y);c.rotate(angle);poly(c,[[-size,0],[-size*.3,-size*.55],[size*.6,-size*.35],[size,0],[size*.25,size*.6],[-size*.45,size*.35]],color,'#514b74');line(c,[[-size*.6,0],[size*.6,0]],'#efe0e9',Math.max(.8,size*.15));c.restore();
}
function blossom(c,x,y,size,angle=0){
 // A single compound path keeps a garden of flowers inexpensive on phones.
 c.fillStyle='#c9a7da';c.strokeStyle='#65547c';c.lineWidth=1;c.beginPath();
 for(let i=0;i<5;i++){
  const a=angle+i*TAU/5,dx=Math.cos(a),dy=Math.sin(a),xx=x+dx*size*.46,yy=y+dy*size*.46;
  for(const [j,[px,py]]of [[-size*.5,0],[0,-size*.34],[size*.6,0],[0,size*.34]].entries()){
   const tx=xx+dx*px-dy*py,ty=yy+dy*px+dx*py;j?c.lineTo(tx,ty):c.moveTo(tx,ty);
  }c.closePath();
 }c.fill();c.stroke();
 disc(c,x,y,Math.max(1.2,size*.2),'#e8d49a');
}
function garden(c,s,reduced){
 const age=finite(s.bloomAge),r=Math.max(12,finite(s.r,140)),remaining=finite(s.life,1),fade=Math.min(1,age/.18,remaining/.45),t=reduced?0:age;
 c.save();c.translate(s.x,s.y);c.globalAlpha*=Math.max(.15,fade);disc(c,0,0,r,'#59466b2c');ring(c,0,0,r,'#b19bc780',1.5);ring(c,0,0,r*.9,'#bcb4d329',1);
 // Boundary flowers identify the fixed poisonous garden without obscuring foes.
 for(let i=0;i<8;i++){
  const a=i*TAU/8,rr=r*(.8+(i%3)*.035),x=Math.cos(a)*rr,y=Math.sin(a)*rr;
  line(c,[[x,y+5],[x-3,y-6],[x+2,y-15]],'#8caa8b88',1.5);blossom(c,x,y-7,5.5,a);
 }
 for(let i=0;i<(reduced?5:9);i++){
  const a=i*2.399,rr=r*(.15+(i%5)*.14),x=Math.cos(a)*rr+(reduced?0:Math.sin(t*.7+i)*6),y=Math.sin(a)*rr-(reduced?0:(t*8+i*11)%20);petal(c,x,y,3.5,a+(reduced?0:t*.2),'#cdb0db');
 }
 c.globalAlpha*=.6;for(let i=0;i<3;i++){const rr=r*(.25+i*.23);c.strokeStyle='#a5b8a355';c.lineWidth=1;c.beginPath();c.ellipse(0,4,rr,rr*.38,0,0,TAU);c.stroke();}c.restore();
}
function cone(c,s,reduced){
 const r=Math.max(20,finite(s.r,240)),half=Math.max(.1,Math.min(1.4,finite(s.halfAngle,.42))),t=reduced?0:finite(s.age),fade=Math.min(1,Math.max(0,finite(s.life,1))/.2);
 c.save();c.translate(s.x,s.y);c.rotate(finite(s.angle));c.globalAlpha*=fade;
 c.fillStyle='#c97b4722';c.beginPath();c.moveTo(0,0);c.arc(0,0,r,-half,half);c.closePath();c.fill();c.clip();
 for(let i=0;i<9;i++){
  const angle=(i%3-1)*half*.58,q=(i+1)/10,xx=r*q,yy=Math.sin(angle)*xx,span=20+r*.12,flare=reduced?0:Math.sin(t*9+i)*5;
  poly(c,[[xx-span,yy],[xx-4,yy-9-flare],[xx+span*.52,yy-4],[xx+span,yy],[xx+span*.45,yy+5],[xx-7,yy+11+flare]],i%2?'#d88f5bc2':'#aa5b4fa6');
  poly(c,[[xx-span*.45,yy],[xx,yy-4],[xx+span*.6,yy],[xx-3,yy+5]],'#f2c987d6');
 }
 line(c,[[6,0],[r*.32,0],[r*.63,0],[r*.92,0]],'#fff0bb',3);c.restore();
}
function dragon(c,s,reduced){
 const dx=finite(s.tx,s.x+finite(s.r,640))-s.x,dy=finite(s.ty,s.y)-s.y,length=Math.max(1,Math.hypot(dx,dy)),width=Math.max(10,finite(s.width,45)),t=reduced?0:finite(s.age),fade=Math.min(1,Math.max(0,finite(s.life,1))/.2);
 c.save();c.translate(s.x,s.y);c.rotate(Math.atan2(dy,dx));c.globalAlpha*=fade;
 // Everything remains inside the full fixed breath corridor.
 c.beginPath();c.rect(0,-width,length,width*2);c.clip();c.fillStyle='#c77b4b22';c.fillRect(0,-width,length,width*2);
 for(let j=0;j<3;j++){
  const side=j-1,points=[];for(let i=0;i<=10;i++){const x=length*i/10,y=side*width*.43+(reduced?Math.sin(i*1.3+side):Math.sin(i*1.3+side-t*4))*width*.14;points.push([x,y]);}
  line(c,points,j===1?'#d99158':'#a75a50',width*(j===1?.85:.55));line(c,points,'#efc58b',j===1?width*.3:3);
 }
 for(const side of [-1,1]){
  const points=[];for(let i=0;i<=12;i++){const x=length*i/12,y=side*width*.65+(i%2?1:-1)*width*.12;points.push([x,y]);}line(c,points,'#ecd991',2.5);line(c,points,'#fff3c4',1);
 }
 // A horned dragon mouth travels only decoratively through its own breath.
 const head=length*.8,hh=width*.58;c.save();c.translate(head,0);poly(c,[[-hh*2,0],[-hh,-hh*.75],[hh*.3,-hh*.65],[hh*1.3,-hh*.2],[hh*1.6,0],[hh*.6,hh*.28],[hh*1.35,hh*.55],[0,hh*.78],[-hh*1.4,hh*.45]],'#dc9f61','#593b46');
 poly(c,[[-hh,-hh*.45],[-hh*1.35,-hh*1.4],[0,-hh*.65]],'#e7d397');poly(c,[[-hh*.6,hh*.5],[-hh*1.5,hh*1.15],[-hh*.8,0]],'#c07c52');line(c,[[0,-hh*.3],[hh*.4,-hh*.25]],'#fff4c2',2);line(c,[[hh*.4,hh*.28],[hh,hh*.22]],'#754a49',2);
 for(let i=0;i<3;i++)poly(c,[[hh*.1+i*5,hh*.25],[hh*.2+i*5,hh*.48],[hh*.3+i*5,hh*.25]],'#f5e2b6');c.restore();c.restore();
}

export const PAIRED_PROJECTILE_TYPES=['raijinrasengan','dragonflame','dragonroar','wisteriapetals','wisteriagarden'];
// World coordinates. This hook runs before ordinary projectile transforms so
// fields, cones and beams retain their actual persisted combat footprints.
export function drawPairedProjectile(c,s,{zoom=1,reducedMotion=false}={}){
 if(!PAIRED_PROJECTILE_TYPES.includes(s.type)||s.life<=0||![s.x,s.y].every(Number.isFinite))return false;
 if(s.type==='dragonflame'){cone(c,s,reducedMotion);return true;}
 if(s.type==='dragonroar'){dragon(c,s,reducedMotion);return true;}
 if(s.type==='wisteriagarden'&&s.state==='bloom'){garden(c,s,reducedMotion);return true;}
 c.save();c.translate(s.x,s.y);const visible=Math.max(1,.7/Math.max(.35,finite(zoom,1)));c.scale(visible,visible);
 if(s.type==='raijinrasengan'){
  kunai(c,Math.atan2(finite(s.vy),finite(s.vx,1)),reducedMotion);
  if(s.state==='marked'){c.globalAlpha*=.75;spiral(c,14,finite(s.age),reducedMotion);ring(c,0,0,19,'#eed793',1.5);}
 }else if(s.type==='wisteriagarden'){
  const age=clamp(finite(s.age)/Math.max(.1,finite(s.flight,.45))),lift=Math.sin(age*Math.PI)*36;c.translate(0,-lift);blossom(c,0,0,9,reducedMotion?0:finite(s.age)*2);disc(c,0,0,3,'#c8d9a8','#4a5c65');
 }else{
  const angle=Math.atan2(finite(s.vy),finite(s.vx,1));if(!reducedMotion)line(c,[[-Math.cos(angle)*15,-Math.sin(angle)*15],[0,0]],'#c5a8dc55',3);petal(c,0,0,7,angle+(reducedMotion?0:Math.sin(finite(s.age)*8)*.25));
 }
 c.restore();return true;
}

export const PAIRED_EFFECT_TYPES=['paired-rasengan','paired-flash-impact','paired-flash-link','paired-wisteria-bloom','paired-petal-hit'];
export function drawPairedEffect(c,e,progress,reduced=false){
 if(!PAIRED_EFFECT_TYPES.includes(e.type))return false;
 const t=clamp(progress),r=Math.max(4,finite(e.r,30));
 c.save();c.globalAlpha*=Math.max(0,1-t)*.85;
 if(e.type==='paired-flash-link'){
  const points=(e.points||[]).filter(p=>p&&[p.x,p.y].every(Number.isFinite)).map(p=>[p.x,p.y]);
  if(points.length>1){line(c,points,'#eedda25a',5);line(c,points,'#eaf1cf',1.5);for(const [x,y]of points){ring(c,x,y,10,'#e1cb88',1.5);line(c,[[x-4,y],[x+4,y],[x,y-5],[x,y+5]],'#f3e4b5',1);}}
 }else if([e.x,e.y].every(Number.isFinite)){
  c.translate(e.x,e.y);
  if(e.type==='paired-rasengan'||e.type==='paired-flash-impact'){
   const radius=r*(reduced?.72:.35+t*.6);spiral(c,radius,finite(e.max,.42)*t,reduced);ring(c,0,0,r*.97,e.type==='paired-flash-impact'?'#e1c883':'#a5dce4',1.5);
   if(!reduced)for(let i=0;i<7;i++){const a=i*TAU/7+t*.6,d=r*(.45+t*.45);line(c,[[Math.cos(a)*d*.7,Math.sin(a)*d*.7],[Math.cos(a+.1)*d,Math.sin(a+.1)*d]],'#ecf5de',1.5);}
   if(e.type==='paired-flash-impact'){c.save();c.translate(-r*.58,-r*.36);c.scale(.5,.5);kunai(c,-.8,true);c.restore();}
  }else{
   ring(c,0,0,r*(reduced?.82:.4+t*.5),'#b6a4cd',1.5);
   for(let i=0;i<(reduced?5:9);i++){const a=i*2.399,d=r*(reduced?.5:.2+t*.62);petal(c,Math.cos(a)*d,Math.sin(a)*d,Math.min(8,r*.16),a+(reduced?0:t*.4));}
   if(e.type==='paired-wisteria-bloom')blossom(c,0,0,Math.min(17,r*.3),reduced?0:t*.3);
  }
 }
 c.restore();return true;
}
