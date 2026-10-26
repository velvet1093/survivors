import {drawExpeditionRiftAttack} from './expedition-attack-art.js';
import {drawDeathRiftAttack,DEATH_ATTACK_STYLES} from './death-attack-art.js';
// Scenic, non-damaging illustrations for the fixed rift attack telegraphs.
// Every position and beat uses the persisted riftAttack clock, so pause, time
// stop and checkpoint recovery retain the same scene. No hitboxes live here.
const TAU=Math.PI*2;
const clamp=n=>Math.max(0,Math.min(1,n));
const line=(c,points,color,width=1)=>{c.strokeStyle=color;c.lineWidth=width;c.beginPath();points.forEach(([x,y],i)=>i?c.lineTo(x,y):c.moveTo(x,y));c.stroke();};
const poly=(c,points,color)=>{c.fillStyle=color;c.beginPath();points.forEach(([x,y],i)=>i?c.lineTo(x,y):c.moveTo(x,y));c.closePath();c.fill();};
const ring=(c,x,y,r,color,width=1)=>{c.strokeStyle=color;c.lineWidth=width;c.beginPath();c.arc(x,y,Math.max(.01,r),0,TAU);c.stroke();};
const oval=(c,x,y,rx,ry,color)=>{c.fillStyle=color;c.beginPath();c.ellipse(x,y,Math.max(.01,rx),Math.max(.01,ry),0,0,TAU);c.fill();};

function foot(c,x,y,angle,size,color,alpha){
 c.save();c.translate(x,y);c.rotate(angle+Math.PI/2);c.globalAlpha=alpha;
 poly(c,[[-size*.36,size*.4],[-size*.42,0],[-size*.24,-size*.34],[size*.2,-size*.38],[size*.4,-size*.05],[size*.24,size*.44]],color);
 line(c,[[-size*.24,size*.34],[-size*.27,0],[-size*.12,-size*.25]],'#f0e0bf',1.5);
 for(let i=0;i<4;i++)oval(c,-size*.22+i*size*.15,-size*.46+Math.abs(i-1.5)*size*.025,size*.07,size*.1,color);
 c.restore();
}

function titanGhost(c,x,y,scale,alpha){
 c.save();c.translate(x,y);c.scale(scale,scale);c.globalAlpha=alpha;
 // An incomplete steaming Colossal silhouette suggests the distant procession;
 // the open drawing stays far lighter than a live boss or a danger boundary.
 poly(c,[[-7,-55],[0,-61],[7,-55],[6,-43],[0,-39],[-6,-44]],'#b99383');
 line(c,[[-9,-43],[-17,-36],[-20,-15]],'#d2b899',3);line(c,[[9,-43],[17,-36],[20,-15]],'#d2b899',3);
 poly(c,[[-8,-42],[8,-42],[10,-23],[6,-12],[-6,-12],[-10,-23]],'#9d8175');
 line(c,[[-7,-34],[7,-34]],'#e2cbaa');line(c,[[-8,-28],[8,-28]],'#e2cbaa');line(c,[[-6,-22],[6,-22]],'#e2cbaa');
 line(c,[[-5,-12],[-6,0]],'#d5bda0',4);line(c,[[5,-12],[6,0]],'#d5bda0',4);
 line(c,[[-5,-50],[-2,-50]],'#f2d19b');line(c,[[2,-50],[5,-50]],'#f2d19b');
 c.restore();
}

function founder(c,e,u,quiet){
 const t=u.age,color=u.color||'#e0c39b';
 if(u.style==='rumbling'){
  const a=u.angle,travel=quiet?0:clamp(t/2.6)*140;
  for(const lane of [-2,-1,1,2]){
   const x=u.x-Math.sin(a)*lane*132,y=u.y+Math.cos(a)*lane*132;
   for(let i=0;i<3;i++){
    const d=-245+i*190+travel;
    titanGhost(c,x+Math.cos(a)*d,y+Math.sin(a)*d,.62,.18);
    foot(c,x+Math.cos(a)*(d-24),y+Math.sin(a)*(d-24),a,25,color,.13);
   }
  }
  foot(c,u.x,u.y,a,e.enraged?96:76,color,t>=3.25?.34:.17);
 }else if(u.style==='ribs'){
  for(let i=2;i<11;i++){
   const a=(u.gapAngle||0)+i*TAU/12,x=u.x+Math.cos(a)*(u.radius||190),y=u.y+Math.sin(a)*(u.radius||190),rise=quiet?1:clamp(t/1.5);
   c.globalAlpha=.26;c.save();c.translate(x,y);c.rotate(a+Math.PI/2);
   // These decorative ribs sit within the dangerous seals, never the open arc.
   line(c,[[-14,11],[-20,-13*rise],[-15,-38*rise],[0,-53*rise],[15,-38*rise],[20,-13*rise],[14,11]],color,3);
   line(c,[[-12,8],[-16,-14*rise],[-11,-34*rise],[0,-46*rise]],'#f2e5c6',1.5);c.restore();
  }
 }else if(u.style==='footfall'){
  const n=e.enraged?5:4;
  for(let i=0;i<n;i++){
   const delay=1.55+i*.5,active=t>=delay&&t<delay+.5;
   if(t>delay+.55)continue;
   foot(c,u.x+Math.cos(u.angle)*i*105,u.y+Math.sin(u.angle)*i*105,u.angle,e.enraged?73:60,color,active?.37:.16);
  }
 }
}

function orb(c,x,y,r,color,quiet,t,active=false){
 c.globalAlpha=active?.42:.3;
 oval(c,x,y,r,r,'#5c4384');oval(c,x-r*.15,y-r*.16,r*.75,r*.75,color);
 c.globalAlpha=.44;line(c,[[x-r*.45,y-r*.5],[x-r*.05,y-r*.68],[x+r*.3,y-r*.52]],'#e5cdf0',Math.max(1,r*.07));
 c.globalAlpha=.3;ring(c,x,y,r+7,color,1.5);
 for(let i=0;i<6;i++){
  const a=i*TAU/6+(quiet?0:t*.35),near=r+12,far=r+22;
  line(c,[[x+Math.cos(a)*near,y+Math.sin(a)*near],[x+Math.cos(a+.05)*far,y+Math.sin(a+.05)*far]],color,1.5);
 }
}

function catAfterimage(c,x,y,angle,alpha){
 c.save();c.translate(x,y);c.rotate(angle+.12);c.globalAlpha=alpha;
 // A small line silhouette, kept apart from the attack's long lane boundaries.
 poly(c,[[-5,-40],[-9,-58],[-4,-53],[0,-43],[4,-53],[9,-58],[5,-40],[7,-32],[3,-26],[-3,-26],[-7,-32]],'#ad8cce');
 line(c,[[-5,-25],[5,-25],[7,-10],[-6,-10],[-5,-25]],'#d6b6ee',2);
 line(c,[[-6,-23],[-12,-11]],'#bc9dda',2);line(c,[[6,-23],[14,-29],[21,-29]],'#bc9dda',2);
 line(c,[[-4,-10],[-5,1]],'#bc9dda',3);line(c,[[4,-10],[6,1]],'#bc9dda',3);
 line(c,[[7,-9],[17,-5],[20,-15]],'#bc9dda',2);c.restore();
}

function beerus(c,e,u,quiet){
 const t=u.age,color=u.color||'#cba9f3';
 if(u.style==='hakai'){
  const charge=quiet?.78:clamp(t/1.9),r=12+charge*27;
  orb(c,u.x,u.y-35,r,color,quiet,t,t>=1.9&&t<2.45);
  for(let i=0;i<4;i++){
   const a=u.angle+Math.PI/4+i*Math.PI/2,x=u.x+Math.cos(a)*190,y=u.y+Math.sin(a)*190;
   if(t<=3.25)orb(c,x,y-9,9,color,quiet,t,t>=2.65);
  }
 }else if(u.style==='destruction'){
  const charge=quiet?.85:clamp(t/2.5),r=25+charge*(u.radius||160)*.36;
  const drop=quiet?0:Math.max(0,1-clamp((t-1.8)/.7))*60;
  orb(c,u.x,u.y-drop,r,color,quiet,t,t>=2.5&&t<3.15);
  c.globalAlpha=.2;ring(c,u.x,u.y,(u.radius||160)*.45,color);
  if(t>=3.15)for(let i=2;i<11;i++){
   const a=(u.gapAngle||0)+i*TAU/12;orb(c,u.x+Math.cos(a)*245,u.y+Math.sin(a)*245,10,color,quiet,t,t>=3.5);
  }
 }else if(u.style==='afterimages'){
  const n=e.enraged?4:3;
  for(let i=0;i<n;i++){
   const delay=1.5+i*.6,a=u.angle+(i-1)*.4,active=t>=delay&&t<=delay+.5;
   if(t>delay+.55)continue;
   const d=55+i*23;catAfterimage(c,e.x+Math.cos(a)*d,e.y+Math.sin(a)*d,a-u.angle,active?.42:.2);
  }
 }
}

function gear(c,x,y,r,angle,color,alpha){
 c.globalAlpha=alpha;ring(c,x,y,r,color,2);ring(c,x,y,r*.65,color);
 for(let i=0;i<12;i++){
  const a=i*TAU/12+angle;
  line(c,[[x+Math.cos(a)*r*.87,y+Math.sin(a)*r*.87],[x+Math.cos(a)*r*1.12,y+Math.sin(a)*r*1.12]],color,3);
 }
 for(let i=0;i<4;i++){
  const a=i*TAU/4+angle;line(c,[[x+Math.cos(a)*r*.18,y+Math.sin(a)*r*.18],[x+Math.cos(a)*r*.6,y+Math.sin(a)*r*.6]],color);
 }
}

function walpurgis(c,e,u,quiet){
 const t=u.age,color=u.color||'#efacce';
 if(u.style==='stage'){
  for(const row of u.rows||[]){
   if(t>row.delay+.55)continue;const active=t>=row.delay;
   for(const [start,end]of [[-330,row.gap-78],[row.gap+78,330]]){
    for(let d=start+18;d<end-8;d+=38){
     const x=row.x+Math.cos(row.angle)*d,y=row.y+Math.sin(row.angle)*d;
     c.save();c.translate(x,y);c.rotate(row.angle);c.globalAlpha=active?.3:.18;
     // Damaged theatrical floorboards leave the deliberately clear gap intact.
     poly(c,[[-13,-13],[13,-13],[15,10],[3,15],[-14,9]],'#a8799e');
     line(c,[[-10,-10],[-8,8]],color);line(c,[[0,-9],[3,10]],'#e0becb');line(c,[[8,-9],[11,6]],color);c.restore();
    }
   }
  }
 }else if(u.style==='clock'){
  for(let i=2;i<11;i++){
   const a=(u.gapAngle||0)+i*TAU/12,x=u.x+Math.cos(a)*(u.radius||185),y=u.y+Math.sin(a)*(u.radius||185);
   gear(c,x,y,22,quiet?i: t*.6+i,color,.29);
  }
  // Disconnected clock hands point within the marked center, never across the
  // safe opening between the gears.
  c.globalAlpha=.26;line(c,[[u.x-2,u.y-35],[u.x,u.y],[u.x+25,u.y-12]],color,2);
 }else if(u.style==='buildings'){
  const n=e.enraged?5:3,base=u.angle-Math.PI/4;
  for(let i=0;i<n;i++){
   const delay=1.7+i*.42;if(t>delay+.6)continue;
   const offset=(i-(n-1)/2)*152,x=u.x-Math.sin(base)*offset,y=u.y+Math.cos(base)*offset;
   const fall=quiet?0:(1-clamp(t/delay))*58;
   c.save();c.translate(x,y-fall);c.rotate(u.angle+Math.PI/2);c.globalAlpha=t>=delay?.33:.2;
   // Narrow tower outlines fall along the existing building-sized lane. Their
   // footprint stays smaller than that lane and its label remains visible.
   poly(c,[[-21,-72],[-13,-80],[15,-80],[22,-72],[22,68],[-21,68]],'#6a5277');
   line(c,[[-21,68],[-21,-72],[-13,-80],[15,-80],[22,-72],[22,68]],color,2);
   line(c,[[-13,-72],[15,-72]],'#e8c8d5');
   for(let row=0;row<6;row++)for(const col of [-1,1]){c.fillStyle=(row+i)%3?'#c2a6c8':'#dac4b2';c.fillRect(col*10-3,-60+row*21,5,8);}
   line(c,[[-21,10],[-5,3],[-9,-10],[5,-20]],'#d1a8be');c.restore();
  }
 }
}

function butterflyGhost(c,x,y,alpha){
 c.save();c.translate(x,y);c.globalAlpha=alpha;
 for(const side of [-1,1]){
  poly(c,[[side*4,-24],[side*19,-42],[side*27,-44],[side*23,-23],[side*8,-9]],'#cbb8dd');
  poly(c,[[side*7,-17],[side*24,-19],[side*22,-1],[side*13,6],[side*4,-9]],'#cbb8dd');
  line(c,[[side*8,-23],[side*21,-36]],'#f2dff3',1.5);
 }
 poly(c,[[-4,-32],[3,-34],[7,-27],[5,-11],[9,6],[3,10],[0,4],[-4,11],[-8,6],[-4,-12]],'#eee1eb');
 oval(c,0,-37,5,7,'#d5bfd1');poly(c,[[0,-25],[3,-20],[0,-16],[-3,-20]],'#8a699b');
 c.restore();
}

function aizen(c,e,u,quiet){
 const t=u.age,color=u.color||'#d8b9e6';
 // A faint broken reflection remains while the persisted sequence recovers;
 // it carries no danger boundary and never follows the moving player.
 c.globalAlpha=.09;line(c,[[u.x-12,u.y+7],[u.x-5,u.y-8],[u.x+10,u.y-4],[u.x+4,u.y+11]],color);
 if(u.style==='illusions'){
  for(const p of u.points||[]){
   const delay=p.delay??1.6;if(t>delay+.65)continue;
   butterflyGhost(c,p.x,p.y,t>=delay?.28:.17);
   c.globalAlpha=.23;ring(c,p.x,p.y,16,color);line(c,[[p.x-11,p.y-12],[p.x+10,p.y+10]],'#eee0f0');
  }
 }else if(u.style==='prison'){
  const r=u.radius||185,rise=quiet?1:clamp(t/1.8);
  for(let i=2;i<11;i++){
   const a=(u.gapAngle||0)+i*TAU/12,x=u.x+Math.cos(a)*r,y=u.y+Math.sin(a)*r;
   c.globalAlpha=.24;
   // Black coffin blades stand inside the actual marked seals; the escape arc
   // stays empty. Perspective tops suggest a cage without painting a false wall.
   poly(c,[[x-7,y+7],[x-7,y-40*rise],[x,y-48*rise],[x+8,y-39*rise],[x+8,y+8]],'#171626');
   line(c,[[x-7,y-40*rise],[x,y-48*rise],[x+8,y-39*rise]],color,1.5);
   line(c,[[x,y-40*rise],[x,y+5]],'#6e507d',2);
  }
  c.globalAlpha=.18;poly(c,[[u.x-26,u.y+17],[u.x-26,u.y-48*rise],[u.x,u.y-61*rise],[u.x+27,u.y-48*rise],[u.x+27,u.y+18],[u.x,u.y+29]],'#131526');
  line(c,[[u.x-26,u.y-48*rise],[u.x,u.y-61*rise],[u.x+27,u.y-48*rise]],'#c6a4d4',2);
 }else if(u.style==='fragor'){
  for(const p of u.points||[]){
   const delay=p.delay??2;if(t>delay+.7)continue;const active=t>=delay,r=active?20:13;
   c.globalAlpha=active?.35:.23;oval(c,p.x,p.y-10,r,r,'#635074');oval(c,p.x-2,p.y-12,r*.63,r*.7,color);
   line(c,[[p.x-5,p.y-15],[p.x+1,p.y-18],[p.x+5,p.y-13]],'#f7e3f5',2);
   c.globalAlpha=.2;ring(c,p.x,p.y,r+8,color);
   for(let i=0;i<3;i++){const a=i*TAU/3+(quiet?0:t*.3);line(c,[[p.x+Math.cos(a)*(r+4),p.y+Math.sin(a)*(r+4)],[p.x+Math.cos(a+.1)*(r+12),p.y+Math.sin(a+.1)*(r+12)]],color);}
  }
 }
}

function meteor(c,x,y,r,alpha){
 c.globalAlpha=alpha;
 poly(c,[[x-r*.8,y-r*.3],[x-r*.5,y-r*.8],[x+r*.25,y-r*.95],[x+r*.8,y-r*.4],[x+r*.9,y+r*.35],[x+r*.3,y+r*.8],[x-r*.5,y+r*.7],[x-r*.9,y+r*.2]],'#6c666c');
 poly(c,[[x-r*.64,y-r*.2],[x-r*.35,y-r*.6],[x+r*.25,y-r*.72],[x+r*.6,y-r*.33],[x+r*.33,y-r*.15],[x-r*.1,y-r*.31]],'#b8a8a2');
 line(c,[[x-r*.32,y-r*.6],[x-r*.05,y-r*.1],[x+r*.22,y+r*.03],[x+r*.13,y+r*.52]],'#ddc3ba',2);
 line(c,[[x-r*.65,y+r*.16],[x-r*.23,y+r*.11],[x-r*.05,y-r*.1],[x+r*.53,y-r*.3]],'#423d4b',3);
}

function limboGhost(c,x,y,angle,alpha){
 c.save();c.translate(x,y);c.rotate(angle*.08);c.globalAlpha=alpha;
 poly(c,[[-5,-41],[-9,-48],[-7,-55],[-2,-50],[3,-55],[7,-48],[6,-41],[9,-37],[6,-30],[-6,-30],[-9,-37]],'#b5bdc5');
 poly(c,[[-7,-29],[7,-29],[12,-17],[8,-9],[13,5],[5,9],[0,5],[-5,9],[-13,5],[-8,-9],[-12,-17]],'#b5bdc5');
 line(c,[[-8,-25],[-15,-11]],'#d4cfdd',3);line(c,[[8,-25],[17,-27],[23,-20]],'#d4cfdd',3);
 line(c,[[-4,8],[-5,16]],'#d4cfdd',3);line(c,[[4,8],[6,16]],'#d4cfdd',3);
 for(const dx of [-3,3])oval(c,dx,-22,1.2,1.5,'#3d3c4a');
 c.restore();
}

function madara(c,e,u,quiet){
 const t=u.age,color=u.color||'#cdb5c5';
 c.globalAlpha=.09;line(c,[[u.x-13,u.y+4],[u.x-4,u.y-5],[u.x+5,u.y+3],[u.x+13,u.y-6]],color);
 if(u.style==='meteors'){
  for(const [i,p]of (u.points||[]).entries()){
   const delay=p.delay??(2+i*.8);if(t>delay+.65)continue;
   const r=Math.min(60,(p.r||100)*.4),drop=quiet?0:(1-clamp(t/delay))*65;
   meteor(c,p.x,p.y-drop,r,t>=delay?.35:.23);
   c.globalAlpha=.17;ring(c,p.x,p.y,r*.85,color,2);
   if(!quiet&&t<delay){c.globalAlpha=.19;line(c,[[p.x-r*.3,p.y-drop-r],[p.x-r*.45,p.y-drop-r-28]],color,2);line(c,[[p.x+r*.35,p.y-drop-r*.8],[p.x+r*.18,p.y-drop-r-36]],color,2);}
  }
 }else if(u.style==='orbs'){
  for(let i=2;i<11;i++){
   const a=(u.gapAngle||0)+i*TAU/12,x=u.x+Math.cos(a)*(u.radius||190),y=u.y+Math.sin(a)*(u.radius||190);
   c.globalAlpha=.3;oval(c,x,y-4,12,12,'#242232');line(c,[[x-6,y-9],[x-2,y-12],[x+4,y-10]],'#8f839b',2);
   c.globalAlpha=.17;ring(c,x,y,18,color);
  }
 }else if(u.style==='limbo'){
  for(const p of u.copies||[]){
   const delay=p.delay??1.5;if(t>delay+.65)continue;
   limboGhost(c,p.x,p.y,p.angle??u.angle,t>=delay?.3:.17);
   c.globalAlpha=.18;ring(c,p.x,p.y,20,color);
  }
 }
}

function cutFragment(c,p,t,color,quiet){
 const delay=p.delay??1.6;if(t>delay+.8)return;
 const dx=p.tx-p.x,dy=p.ty-p.y,d=Math.hypot(dx,dy)||1,nx=-dy/d,ny=dx/d,active=t>=delay;
 c.globalAlpha=active?.34:.16;
 // Split, narrow cracks follow the true warned center line, never widening its
 // hitbox or crossing into the deliberate escape openings.
 for(const [start,end]of [[.03,.27],[.36,.61],[.72,.97]]){
  const m=(start+end)/2,s=quiet?3:Math.sin(t*1.8+start)*3;
  line(c,[[p.x+dx*start,p.y+dy*start],[p.x+dx*m+nx*s,p.y+dy*m+ny*s],[p.x+dx*end,p.y+dy*end]],color,active?3:1.5);
 }
}
function shrineGhost(c,x,y,color){
 c.save();c.translate(x,y);c.globalAlpha=.16;
 poly(c,[[-45,-22],[-47,-75],[-26,-98],[27,-98],[49,-75],[45,-22]],'#34212b');
 line(c,[[-54,-76],[-30,-104],[30,-104],[55,-76]],'#c8a08c',5);
 line(c,[[-51,-77],[51,-77]],color,3);
 poly(c,[[-34,-25],[-34,-65],[-23,-76],[23,-76],[34,-65],[34,-25]],'#1a1925');
 line(c,[[-34,-25],[-34,-65],[-23,-76],[23,-76],[34,-65],[34,-25]],'#b18e83',3);
 for(let i=-2;i<=2;i++){poly(c,[[i*11-3,-73],[i*11+4,-73],[i*11,-61]],'#dec2a4');poly(c,[[i*11-3,-25],[i*11+4,-25],[i*11,-36]],'#dec2a4');}
 line(c,[[-45,-18],[-45,-8],[45,-8],[45,-18]],'#89777c',4);c.restore();
}
function flameShard(c,x,y,r,alpha){
 c.globalAlpha=alpha;
 poly(c,[[x-r*.65,y+r*.4],[x-r*.4,y-r*.6],[x-r*.1,y-r*.15],[x+r*.25,y-r],[x+r*.46,y-r*.18],[x+r*.7,y+r*.4],[x,y+r*.72]],'#a65f58');
 poly(c,[[x-r*.32,y+r*.35],[x-r*.12,y-r*.25],[x+r*.1,y],[x+r*.27,y-r*.43],[x+r*.36,y+r*.35],[x,y+r*.52]],'#edbc8e');
}
function heian(c,e,u,quiet){
 const t=u.age,color=u.color||'#e4b09c';
 c.globalAlpha=.09;line(c,[[u.x-15,u.y+7],[u.x-6,u.y-4],[u.x+2,u.y+3],[u.x+14,u.y-8]],color);
 if(u.style==='shrine'){
  shrineGhost(c,u.x,u.y,color);
  for(const p of u.spokes||[])cutFragment(c,p,t,color,quiet);
 }else if(u.style==='worldslash'){
  for(const p of u.lines||[])cutFragment(c,p,t,'#f0d6bd',quiet);
  // Floating broken seal panels stay inside the existing central warning.
  c.globalAlpha=.12;
  for(const side of [-1,1])poly(c,[[u.x+side*17,u.y-15],[u.x+side*29,u.y-35],[u.x+side*32,u.y-6],[u.x+side*21,u.y+9]],'#a27e86');
 }else if(u.style==='furnace'){
  const o=u.origin||{x:e.x,y:e.y-45},target=u.target||{x:u.x,y:u.y},dx=target.x-o.x,dy=target.y-o.y,a=Math.atan2(dy,dx),progress=quiet?.78:clamp(t/1.65),x=o.x+dx*progress,y=o.y+dy*progress;
  c.save();c.translate(x,y);c.rotate(a);c.globalAlpha=t<1.9?.31:.12;
  poly(c,[[-39,-5],[8,-5],[8,-12],[35,0],[8,12],[8,5],[-39,5],[-28,0]],'#c98b68');
  line(c,[[-30,0],[24,0]],'#f7d9a2',3);line(c,[[8,-9],[28,0],[8,9]],'#f5c98d',2);c.restore();
  for(const p of u.points||[])if(t<=(p.delay??3.7)+.65)flameShard(c,p.x,p.y,Math.min(24,(p.r||40)*.46),t>=(p.delay??3.7)?.3:.18);
  if(t<3.6)flameShard(c,u.x,u.y,quiet?30:22+clamp(t/2.9)*20,.2);
 }
}
function borosGhost(c,x,y,angle,alpha){
 c.save();c.translate(x,y);c.rotate(angle+.35);c.globalAlpha=alpha;
 poly(c,[[-4,-43],[-12,-51],[-5,-49],[-3,-58],[2,-50],[10,-55],[7,-46],[10,-40],[5,-34],[-5,-34]],'#d1bdd5');
 line(c,[[-4,-42],[4,-42]],'#9ed9d4',2);
 poly(c,[[-8,-33],[8,-33],[13,-23],[7,-8],[-6,-7],[-12,-23]],'#c69abb');
 line(c,[[-9,-30],[-22,-24],[-31,-30]],'#dfb4d5',5);line(c,[[8,-30],[22,-35],[31,-30]],'#dfb4d5',5);
 line(c,[[-5,-7],[-14,8],[-23,12]],'#d4a8cd',5);line(c,[[5,-7],[20,-2],[31,7]],'#d4a8cd',5);
 c.restore();
}
function stellarBeam(c,beam,t,color,quiet,charged=false){
 if(!beam)return;const {x,y,tx,ty}=beam,delay=beam.delay??2,duration=beam.duration??.65;
 if(t>delay+duration+.25)return;
 const dx=tx-x,dy=ty-y,a=Math.atan2(dy,dx),length=Math.hypot(dx,dy)||1,active=t>=delay,width=beam.width||35,charge=quiet?1:clamp(t/delay);
 c.save();c.translate(x,y);c.rotate(a);
 c.globalAlpha=active?.3:.2;
 // The charged cannon gathers in the cyclopean chest, then a stepped luminous
 // core travels along its real beam line. Outer danger remains engine-drawn.
 oval(c,0,0,14+charge*13,18+charge*15,'#a47dba');
 oval(c,0,0,7+charge*8,10+charge*9,charged?'#bce5de':'#edcfe5');
 for(const side of [-1,1])line(c,[[-20,side*14],[-9,side*21],[4,side*19]],color,2);
 if(active){
  poly(c,[[0,-width*.38],[length*.14,-width*.48],[length*.43,-width*.3],[length*.72,-width*.43],[length,-width*.25],[length,width*.25],[length*.72,width*.43],[length*.43,width*.3],[length*.14,width*.48],[0,width*.38]],charged?'#d2b0d5':'#aa8abf');
  c.globalAlpha=.45;line(c,[[0,0],[length,0]],'#f3e4e2',Math.max(3,width*.17));
  for(const side of [-1,1])line(c,[[length*.12,side*width*.24],[length*.4,side*width*.12],[length*.67,side*width*.25],[length*.93,side*width*.13]],color,2);
 }else{
  c.globalAlpha=.14;line(c,[[20,0],[Math.min(length,150),0]],color,2);
 }
 c.restore();
}
function boros(c,e,u,quiet){
 const t=u.age,color=u.color||'#ddb0e0';
 c.globalAlpha=.09;line(c,[[u.x-14,u.y+5],[u.x-3,u.y-9],[u.x+10,u.y-2],[u.x+6,u.y+10]],color);
 if(u.style==='meteoric'){
  for(const p of u.copies||[]){
   const delay=p.delay??1.55;if(t>delay+.7)continue;borosGhost(c,p.x,p.y,p.angle??u.angle,t>=delay?.32:.17);
   const a=p.angle??u.angle;c.globalAlpha=.19;
   for(const side of [-1,1])line(c,[[p.x-Math.cos(a)*48+Math.sin(a)*side*11,p.y-Math.sin(a)*48-Math.cos(a)*side*11],[p.x-Math.cos(a)*83+Math.sin(a)*side*11,p.y-Math.sin(a)*83-Math.cos(a)*side*11]],color,2);
  }
 }else{
  stellarBeam(c,u.beam,t,color,quiet,u.style==='roaring');
  for(const p of u.points||[]){
   const delay=p.delay??3.5;if(t>delay+.7)continue;const active=t>=delay,r=Math.min(30,(p.r||60)*.35);
   if(u.style==='roaring'){
    meteor(c,p.x,p.y,r,active?.31:.16);c.globalAlpha=.18;line(c,[[p.x-r,p.y+r*.5],[p.x-r*.3,p.y+r*.3],[p.x,p.y+r],[p.x+r*.5,p.y+r*.45],[p.x+r,p.y+r*.55]],color,2);
   }else{
    c.globalAlpha=active?.31:.18;poly(c,[[p.x-r,p.y],[p.x-r*.5,p.y-r],[p.x+r*.4,p.y-r*.8],[p.x+r,p.y+r*.2],[p.x,p.y+r]],'#94739f');
    line(c,[[p.x-r*.45,p.y-r*.35],[p.x,p.y-r*.6],[p.x+r*.45,p.y-r*.25]],'#e7c7e5',2);
   }
  }
 }
}

function darknessPalm(c,x,y,scale,angle,alpha){
 c.save();c.translate(x,y);c.rotate(angle);c.scale(scale,scale);c.globalAlpha=alpha;
 poly(c,[[-11,10],[-13,-2],[-9,-11],[-5,-10],[-4,-19],[0,-20],[3,-12],[7,-17],[10,-15],[10,-6],[14,-10],[17,-7],[14,6],[8,15],[-3,18]],'#7b8584');
 line(c,[[-8,7],[-7,-6],[-4,-10]],'#d8d8c5',2);line(c,[[0,9],[0,-15]],'#d8d8c5',2);line(c,[[6,8],[7,-10]],'#c7cbba',2);line(c,[[9,10],[13,-2]],'#c7cbba',2);
 line(c,[[-5,11],[1,9],[8,12]],'#303b43',2);c.restore();
}
function darkness(c,e,u,quiet){
 const t=u.age,ink='#171d2c',bone='#d4d5bf',color=u.color||bone;
 // The saved origin stays with the cast even if the live body is pushed.
 const origin=u.origin||{x:e.x,y:e.y-65};
 c.globalAlpha=.2;ring(c,origin.x,origin.y,quiet?13:10+clamp(t/1.4)*6,color,1.5);
 for(const mark of u.marks||[]){
  const age=t-mark.delay,active=age>=0,duration=mark.duration||.5;if(age>duration+.2)continue;
  const fade=quiet?.55:active?Math.max(.12,1-age/(duration+.2)):.42;
  if(mark.shape==='line'){
   const dx=mark.tx-mark.x,dy=mark.ty-mark.y,a=Math.atan2(dy,dx),length=Math.hypot(dx,dy),reach=Math.min(78,length*.1);
   c.globalAlpha=active?fade*.42:.12;line(c,[[mark.x,mark.y],[mark.tx,mark.ty]],ink,active?mark.width*.65:3);
   if(active){c.globalAlpha=fade*.52;line(c,[[mark.x,mark.y],[mark.tx,mark.ty]],bone,1.6);}
   for(let i=1;i<=3;i++){const q=i/4,x=mark.x+dx*q,y=mark.y+dy*q;darknessPalm(c,x,y,quiet?.7:active?.72:.45,a-Math.PI/2,fade*.4);c.globalAlpha=fade*.2;line(c,[[x-Math.cos(a)*reach,y-Math.sin(a)*reach],[x,y]],color,2);}
  }else if(mark.shape==='circle'){
   const r=mark.r||40,x=mark.x,y=mark.y;
   c.globalAlpha=active?fade*.45:.15;oval(c,x,y,r*.62,r*.42,ink);ring(c,x,y,r*.64,color,1.5);
   if(u.style==='fallingstars'){
    const size=Math.min(36,r*.55),fall=quiet?0:active?0:(1-clamp(t/mark.delay))*r*.7;
    c.globalAlpha=fade*.45;poly(c,[[x,y-size-fall],[x+size*.23,y-size*.22-fall],[x+size,y-fall],[x+size*.22,y+size*.2-fall],[x,y+size*.7-fall],[x-size*.22,y+size*.2-fall],[x-size,y-fall],[x-size*.2,y-size*.2-fall]],'#8e9692');
    c.globalAlpha=fade*.55;line(c,[[x,y-size*.58-fall],[x,y+size*.35-fall]],bone,2);line(c,[[x-size*.4,y-fall],[x+size*.4,y-fall]],bone,1.5);
    if(active){c.globalAlpha=fade*.22;for(let i=0;i<6;i++){const a=i*TAU/6;line(c,[[x+Math.cos(a)*r*.36,y+Math.sin(a)*r*.36],[x+Math.cos(a+.15)*r*.75,y+Math.sin(a+.15)*r*.75]],bone,1.5);}}
   }else{
    const palm=Math.min(1.3,r/45),spread=active?.4:.2;
    for(const side of [-1,1])darknessPalm(c,x+side*r*spread,y+4,palm,-side*.45,fade*.52);
    c.globalAlpha=fade*.36;ring(c,x,y,Math.min(15,r*.2),bone,1.5);oval(c,x,y,3,6,ink);
   }
  }
 }
}

export const RIFT_ATTACK_STYLES=['rumbling','ribs','footfall','hakai','afterimages','destruction','stage','clock','buildings','illusions','prison','fragor','meteors','orbs','limbo','shrine','worldslash','furnace','meteoric','starcannon','roaring','severance','primordial','fallingstars','dragonroar','apocalypsewing','blackdescent','drago','milimrush','stardust',...DEATH_ATTACK_STYLES];
export function drawRiftAttack(c,e,reducedMotion=false){
 if(e?.archetype==='deathdevil')return drawDeathRiftAttack(c,e,reducedMotion);
 if(e?.archetype==='acnologia'||e?.archetype==='milim')return drawExpeditionRiftAttack(c,e,reducedMotion);
 const u=e?.riftAttack;
 if(e?.hp<=0||!u||!Number.isFinite(u.age)||u.age<0||u.age>=u.duration||!RIFT_ATTACK_STYLES.includes(u.style))return false;
 if(!['foundereren','beerus','walpurgisrift','aizenrift','madararift','sukunaheian','borosrift','darknessdevil'].includes(e.archetype)||![u.x,u.y,u.angle].every(Number.isFinite))return false;
 c.save();
 if(e.archetype==='foundereren')founder(c,e,u,reducedMotion);
 else if(e.archetype==='beerus')beerus(c,e,u,reducedMotion);
 else if(e.archetype==='walpurgisrift')walpurgis(c,e,u,reducedMotion);
 else if(e.archetype==='aizenrift')aizen(c,e,u,reducedMotion);
 else if(e.archetype==='madararift')madara(c,e,u,reducedMotion);
 else if(e.archetype==='sukunaheian')heian(c,e,u,reducedMotion);
 else if(e.archetype==='darknessdevil')darkness(c,e,u,reducedMotion);
 else boros(c,e,u,reducedMotion);
 c.restore();return true;
}
