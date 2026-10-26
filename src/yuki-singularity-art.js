const TAU=Math.PI*2;
const circle=(c,x,y,r,fill)=>{c.fillStyle=fill;c.beginPath();c.arc(x,y,Math.max(.1,r),0,TAU);c.fill();};
const strokeCircle=(c,x,y,r,color,width=1)=>{c.strokeStyle=color;c.lineWidth=width;c.beginPath();c.arc(x,y,Math.max(.1,r),0,TAU);c.stroke();};
const hash=n=>{const x=Math.sin(n*127.1+19.7)*43758.5453;return x-Math.floor(x);};
const polygon=(c,points,color)=>{c.fillStyle=color;c.beginPath();points.forEach(([x,y],i)=>i?c.lineTo(x,y):c.moveTo(x,y));c.closePath();c.fill();};

function chargeArt(c,g,u,over){
 const quiet=!!g.p.reducedMotion,progress=Math.max(0,Math.min(1,u.age/(u.chargeDuration||2))),phase=quiet?0:u.age,x=u.x,y=u.y-10;
 if(over){
  c.strokeStyle='#f6e5b4';c.lineWidth=1;c.beginPath();c.moveTo(x-12-progress*22,y);c.lineTo(x+12+progress*22,y);c.stroke();
  return;
 }
 const edge=34+progress*62,core=4+progress*9;
 const glow=c.createRadialGradient(x,y,core,x,y,edge*1.3);glow.addColorStop(0,'#f7edcf30');glow.addColorStop(.7,'#c4b6a218');glow.addColorStop(1,'#262c3b00');c.fillStyle=glow;c.fillRect(x-edge*1.3,y-edge*1.3,edge*2.6,edge*2.6);
 for(let i=0;i<3;i++){
  c.strokeStyle=i===0?'#f1e8cebb':'#cad1d377';c.lineWidth=i===0?1.5:1;c.beginPath();c.ellipse(x,y,edge*(.6+i*.2),edge*(.18+i*.09),phase*(i%2?-.8:.65)+i*.75,0,TAU);c.stroke();
 }
 const count=quiet?12:30;
 for(let i=0;i<count;i++){
  const a=i*2.399+phase*.2,travel=quiet?.5:1-((phase*.75+i*.137)%1),r=core+travel*edge;
  const dx=Math.cos(a),dy=Math.sin(a),length=3+progress*8;
  c.strokeStyle=i%3?'#ede7d36f':'#252b3bab';c.lineWidth=i%4?1:2;c.beginPath();c.moveTo(x+dx*r,y+dy*r);c.lineTo(x+dx*(r+length),y+dy*(r+length));c.stroke();
 }
 strokeCircle(c,x,y,core+3,'#f8f0d5',2);circle(c,x,y,core,'#090d18');
 // A broken ring closes steadily, making the two-second release readable.
 c.setLineDash([3,6]);strokeCircle(c,x,y,edge+10,'#d6c49b66');c.setLineDash([]);c.strokeStyle='#f4dba0';c.lineWidth=2;c.beginPath();c.arc(x,y,edge+10,-Math.PI/2,-Math.PI/2+TAU*progress);c.stroke();
}

export function drawYukiSingularity(c,g,layer='under'){
 const u=g.ultimate;if(u?.type!=='yuki')return;
 const chargeDuration=u.chargeDuration??0,charging=u.age<chargeDuration,over=layer==='over';
 c.save();
 if(charging){chargeArt(c,g,u,over);c.restore();return;}
 const quiet=!!g.p.reducedMotion,elapsed=Math.max(0,u.age-chargeDuration),time=quiet?0:elapsed,x=u.x,y=u.y-10;
 const bloom=Math.min(1,elapsed/.38),collapse=u.impacted?Math.max(.12,Math.min(1,(u.duration-u.age)/.2)):1,core=(32+u.r*.095)*(.3+bloom*.7)*collapse;
 if(over){
  // Foreground lensing never fills over the caster, preserving her silhouette.
  c.strokeStyle='#fbefd0bd';c.lineWidth=1.4;c.beginPath();c.ellipse(x,y,core*1.7,core*.3,-.1,0,Math.PI);c.stroke();
  c.strokeStyle='#e8c16c';c.lineWidth=quiet?1:1.25;c.beginPath();c.moveTo(x-core*2.65,y);c.lineTo(x+core*2.65,y);c.stroke();
  c.strokeStyle='#fff5ce';c.lineWidth=.65;c.beginPath();c.moveTo(x-core*1.8,y-1);c.lineTo(x+core*1.8,y-1);c.stroke();c.restore();return;
 }
 const reach=u.r*(.72+bloom*.12),shadow=c.createRadialGradient(x,y,core*.8,x,y,reach);
 shadow.addColorStop(0,'#070c15bb');shadow.addColorStop(.55,'#151c296f');shadow.addColorStop(1,'#0a102000');c.fillStyle=shadow;c.fillRect(x-reach,y-reach,reach*2,reach*2);
 // Bent ground fractures and broken orbit arcs suggest space curving inward.
 for(let i=0;i<10;i++){
  const a=i*2.399+time*.035,r=core*1.3+hash(i+41)*(reach-core*1.3);
  c.strokeStyle=i%2?'#e4ddd442':'#171d2c99';c.lineWidth=i%3?1:2;c.beginPath();c.ellipse(x,y,r,r*(.45+hash(i+7)*.4),a,a*.1,a*.1+.65+hash(i+11)*1.6);c.stroke();
 }
 // Radial black ink spikes, with white strips between them, echo manga hatching.
 const rays=quiet?56:124;
 for(let i=0;i<rays;i++){
  const a=i*TAU/rays+hash(i+5)*.035+time*.025,inside=core*(1.14+hash(i+2)*.12),outside=core*(1.55+hash(i+17)*1.05),width=.012+hash(i+9)*.023;
  polygon(c,[[x+Math.cos(a-width)*inside,y+Math.sin(a-width)*inside],[x+Math.cos(a)*outside,y+Math.sin(a)*outside],[x+Math.cos(a+width)*inside,y+Math.sin(a+width)*inside]],i%4?'#0b1120c9':'#e8e7dc9f');
 }
 // A brilliant white annulus surrounds an absolute dark event horizon.
 const accretion=c.createRadialGradient(x,y,core*.84,x,y,core*1.42);accretion.addColorStop(0,'#fff9e9');accretion.addColorStop(.38,'#fbf5e8');accretion.addColorStop(.72,'#d9dfda99');accretion.addColorStop(1,'#e6e7dc00');circle(c,x,y,core*1.42,accretion);
 for(let i=0;i<(quiet?28:70);i++){
  const a=i*2.399+time*.055,r0=core*(1.03+hash(i+32)*.09),r1=core*(1.22+hash(i+14)*.25);
  c.strokeStyle=i%3?'#fff9e6d9':'#9fa6a5bb';c.lineWidth=i%4?1:2;c.beginPath();c.moveTo(x+Math.cos(a)*r0,y+Math.sin(a)*r0);c.lineTo(x+Math.cos(a+.025)*r1,y+Math.sin(a+.025)*r1);c.stroke();
 }
 circle(c,x,y,core,'#040710');strokeCircle(c,x,y,core+.5,'#fff7df',1.7);
 // Floating masonry has lit faces, dark undersides, and a small inward trail.
 for(let i=0;i<(quiet?10:25);i++){
  const a=i*2.399+time*(.1+hash(i+18)*.1),turn=quiet?.5:(time*.11+hash(i+77))%1,r=core*1.7+(reach-core*1.7)*(1-turn),px=x+Math.cos(a)*r,py=y+Math.sin(a)*r,s=2+hash(i+8)*5;
  c.strokeStyle='#c1c3b44f';c.lineWidth=1;c.beginPath();c.moveTo(px+Math.cos(a+.18)*s*2,py+Math.sin(a+.18)*s*2);c.lineTo(px,py);c.stroke();
  c.save();c.translate(px,py);c.rotate(a+time*.2);polygon(c,[[-s,-s*.5],[s*.2,-s],[s,s*.25],[s*.35,s],[-s*.8,s*.55]],'#666f79');polygon(c,[[-s,-s*.5],[s*.2,-s],[s,s*.25],[-s*.2,s*.15]],'#bab9a8');c.fillStyle='#e1d6b4';c.fillRect(-s*.35,-s*.5,Math.max(1,s*.65),1);c.restore();
 }
 if(!quiet&&elapsed<.45){c.globalAlpha=(1-elapsed/.45)*.25;strokeCircle(c,x,y,core*(1.7+elapsed*3),'#fff2cc',2);}
 c.restore();
}
