import {BOSS_ULTIMATES} from './boss-ultimates.js';
const TAU=Math.PI*2;
const ring=(c,x,y,r,col,w=2)=>{c.strokeStyle=col;c.lineWidth=w;c.beginPath();c.arc(x,y,r,0,TAU);c.stroke();};
const stroke=(c,points,col,width=1)=>{c.strokeStyle=col;c.lineWidth=width;c.beginPath();points.forEach(([x,y],i)=>i?c.lineTo(x,y):c.moveTo(x,y));c.stroke();};
function crow(c,x,y,spread){
 c.fillStyle='#252637';c.beginPath();c.moveTo(x,y+7);c.lineTo(x-5,y);c.lineTo(x-17,y-spread);c.lineTo(x-12,y-9-spread);c.lineTo(x-3,y-4);c.lineTo(x+2,y-8);c.lineTo(x+6,y-4);c.lineTo(x+18,y-9-spread);c.lineTo(x+13,y-spread);c.lineTo(x+5,y+2);c.fill();c.fillStyle='#ed9fa9';c.fillRect(x+2,y-5,2,2);
}
function knife(c,x,y,angle,color){
 c.save();c.translate(x,y);c.rotate(angle);c.fillStyle='#202838';c.fillRect(-12,-3,8,6);c.fillStyle='#a9b7be';c.fillRect(-5,-5,3,10);c.fillStyle=color;c.beginPath();c.moveTo(-2,-3);c.lineTo(13,0);c.lineTo(-2,3);c.fill();stroke(c,[[0,0],[9,0]],'#fff2cb');c.restore();
}
export function drawBossUltimate(c,e,reduced=false){
 const u=e.bossUltimate,def=BOSS_ULTIMATES[e.archetype];if(!u||!def)return;c.save();const t=u.age,charge=Math.min(1,t/def.charge);c.globalAlpha=.8;
 if(e.archetype==='frieza'){
  const flight=reduced?(t>=def.charge?1:0):Math.max(0,Math.min(1,(t-def.charge+.6)/.6)),r=18+charge*34,x=e.x+(u.x-e.x)*flight,y=e.y-105+(u.y-e.y+105)*flight;if(t>=def.charge)ring(c,u.x,u.y,90+Math.min(1,(t-def.charge)/.65)*55,'#f9d79699',3);ring(c,x,y,r+8,def.color+'77');c.fillStyle='#a65b68';c.beginPath();c.arc(x,y,r,0,TAU);c.fill();c.fillStyle='#e9a45e';c.beginPath();c.arc(x-3,y-3,r*.83,0,TAU);c.fill();c.fillStyle='#ffe8a1';c.fillRect(x-r*.45,y-r*.45,r*.55,r*.15);for(let i=0;i<6;i++){const a=i*TAU/6+(reduced?0:t*.3);c.fillStyle='#f5cf83';c.fillRect(x+Math.cos(a)*(r+14),y+Math.sin(a)*(r+14),3,3);}
 }else if(e.archetype==='sukuna'){
  ring(c,u.x,u.y,205,'#f1a0b74d');for(let i=0;i<8;i++){const a=i*TAU/8;c.fillStyle='#d4a0b4';c.fillRect(u.x+Math.cos(a)*205-2,u.y+Math.sin(a)*205-2,4,4);}const x=e.x,y=e.y-65;c.fillStyle='#614356';c.fillRect(x-27,y-18,54,5);c.fillRect(x-21,y-13,5,38);c.fillRect(x+16,y-13,5,38);c.fillStyle='#e0a0a5';c.fillRect(x-31,y-22,62,4);c.fillRect(x-24,y-9,48,3);
 }else if(e.archetype==='aura'){
  const x=e.x,y=e.y-78;c.strokeStyle='#ecd0ac';c.lineWidth=2;c.beginPath();c.moveTo(x,y-20);c.lineTo(x,y+20);c.moveTo(x-36,y-5);c.lineTo(x+36,y-5);c.stroke();for(const side of [-1,1]){const tilt=reduced?0:Math.sin(t*2)*5*side;c.beginPath();c.moveTo(x+side*32,y-5);c.lineTo(x+side*32,y+15+tilt);c.stroke();c.fillStyle=side<0?'#aa93c9':'#e4bc8c';c.fillRect(x+side*32-12,y+16+tilt,24,3);ring(c,x+side*32,y+8+tilt,6,side<0?'#cfc0f1':'#fae3b3');}
 }else if(e.archetype==='motherbrain'){
  const x=u.origin?.x??e.x,y=u.origin?.y??e.y-55,colors=['#efb3cf','#b3e5d3','#f5d89b'];
  for(let i=0;i<3;i++)ring(c,x,y,8+charge*17+i*5,colors[i],2);
  c.fillStyle='#fff1cf';c.fillRect(x-3-charge*3,y-3-charge*3,6+charge*6,6+charge*6);
  if(!reduced&&t<def.charge)for(let i=0;i<12;i++){const a=i*2.399+t,dist=14+(1-(t*.7+i/12)%1)*40;c.fillStyle=colors[i%3];c.fillRect(x+Math.cos(a)*dist-1,y+Math.sin(a)*dist*.75-1,3,3);}
  for(const beam of u.brainBeams||[]){
   if(t<beam.delay||t>beam.delay+beam.duration)continue;
   const age=t-beam.delay,fade=Math.min(1,age/.09,(beam.duration-age)/.14),angle=Math.atan2(beam.ty-beam.y,beam.tx-beam.x),nx=-Math.sin(angle),ny=Math.cos(angle);
   c.globalAlpha=Math.max(.15,fade);
   stroke(c,[[beam.x,beam.y],[beam.tx,beam.ty]],'#a8dfcf55',beam.width*2+13);
   stroke(c,[[beam.x,beam.y],[beam.tx,beam.ty]],'#a6d9ca',beam.width*2);
   stroke(c,[[beam.x,beam.y],[beam.tx,beam.ty]],'#fbf4d6',beam.width*1.35);
   for(let i=0;i<3;i++){const offset=(i-1)*beam.width*.53;stroke(c,[[beam.x+nx*offset,beam.y+ny*offset],[beam.tx+nx*offset,beam.ty+ny*offset]],colors[i],4);}
   c.save();c.translate(beam.x,beam.y);c.rotate(angle);c.strokeStyle='#fff8de';c.lineWidth=4;c.beginPath();c.ellipse(0,0,9,beam.width*1.2,0,0,TAU);c.stroke();c.restore();
   if(!reduced)ring(c,beam.x,beam.y,20+age*80,'#d8ecd68c',3);
  }
 }else if(e.archetype==='bertholdt'){
  for(let i=0;i<8;i++){const a=i*2.399,age=reduced?.5:(t*.35+i*.13)%1,x=e.x+Math.cos(a)*(20+age*90),y=e.y-35-age*100;c.globalAlpha=(1-age)*.35;c.fillStyle='#f1e6cd';c.fillRect(x-8,y-8,16+age*14,20+age*12);}c.globalAlpha=.7;ring(c,e.x,e.y,155,'#ead4ad66');
 }else if(e.archetype==='itachi'){
  const radius=u.radius||132,gap=u.gapAngle??u.angle;c.strokeStyle='#d889a6aa';c.lineWidth=2;c.beginPath();c.arc(u.x,u.y,radius,gap+.35,gap+TAU-.35);c.stroke();
  for(const [i,seal]of (u.illusionSeals||[]).entries()){c.globalAlpha=t>3.85?.25:.8;crow(c,seal.x,seal.y-7,reduced?0:Math.sin(t*3+i)*3);}
  c.globalAlpha=.85;const eyeY=u.y-10;c.fillStyle='#382638';c.beginPath();c.moveTo(u.x-32,eyeY);c.quadraticCurveTo(u.x,eyeY-24,u.x+32,eyeY);c.quadraticCurveTo(u.x,eyeY+24,u.x-32,eyeY);c.fill();ring(c,u.x,eyeY,11+charge*4,'#ed9da9',2);c.fillStyle='#ed9da9';c.fillRect(u.x-2,eyeY-2,4,4);
  for(let i=0;i<3;i++){const a=i*TAU/3+(reduced?0:t*.3);c.fillStyle='#ed9da9';c.fillRect(u.x+Math.cos(a)*8-2,eyeY+Math.sin(a)*8-2,4,4);}
  const gx=u.x+Math.cos(gap)*(radius+34),gy=u.y+Math.sin(gap)*(radius+34);c.save();c.translate(gx,gy);c.rotate(gap);stroke(c,[[-8,-8],[0,0],[-8,8]],'#b6eed7',3);c.restore();c.fillStyle='#f0c3d2';c.font='600 8px "DM Sans",sans-serif';c.textAlign='center';c.fillText('GENJUTSU · ESCAPE THE OPEN SEAL',u.x,u.y+36);
 }else if(e.archetype==='ulquiorra'){
  for(const beam of u.ceros||[]){const active=t>=beam.delay&&t<=beam.delay+beam.duration,angle=Math.atan2(beam.ty-beam.y,beam.tx-beam.x),gather=Math.min(1,t/beam.delay),r=4+gather*11;c.globalAlpha=active?1:.8;
   ring(c,beam.x,beam.y,r+6,'#88e8b480',2);c.fillStyle='#28615b';c.beginPath();c.arc(beam.x,beam.y,r,0,TAU);c.fill();c.fillStyle='#b9ffc8';c.beginPath();c.arc(beam.x-2,beam.y-2,r*.58,0,TAU);c.fill();
   if(active){stroke(c,[[beam.x,beam.y],[beam.tx,beam.ty]],'#64cda66b',beam.width*2+10);stroke(c,[[beam.x,beam.y],[beam.tx,beam.ty]],'#8bf0a9',beam.width*2);stroke(c,[[beam.x,beam.y],[beam.tx,beam.ty]],'#ecffd1',4);}
   else if(t<beam.delay&&!reduced)for(let i=0;i<6;i++){const a=i*TAU/6+t,dist=22+(1-(t*.7+i/6)%1)*20;c.fillStyle='#b1f3bf';c.fillRect(beam.x+Math.cos(a)*dist-1,beam.y+Math.sin(a)*dist-1,2,2);}
   stroke(c,[[beam.x-Math.cos(angle)*10,beam.y-Math.sin(angle)*10],[beam.x,beam.y]],'#e0ffd0',2);
  }
 }else if(e.archetype==='dio'){
  ring(c,u.x,u.y,177,'#ead49c66');for(let i=0;i<12;i++){const a=i*TAU/12-Math.PI/2;stroke(c,[[u.x+Math.cos(a)*167,u.y+Math.sin(a)*167],[u.x+Math.cos(a)*177,u.y+Math.sin(a)*177]],i%3?'#b5a48f':'#f4dda4',i%3?1:3);}
  const hand=-Math.PI/2+Math.min(1,t/4.1)*TAU;stroke(c,[[u.x,u.y],[u.x+Math.cos(hand)*54,u.y+Math.sin(hand)*54]],'#efd9a9',2);
  for(const lane of u.knifeLanes||[]){if(t>lane.delay+lane.duration)continue;const a=Math.atan2(lane.ty-lane.y,lane.tx-lane.x),flight=t<lane.delay?0:reduced?.5:Math.min(1,(t-lane.delay)/lane.duration);for(let i=0;i<3;i++){const q=Math.min(.98,(i+1)/5+flight*.4);knife(c,lane.x+(lane.tx-lane.x)*q,lane.y+(lane.ty-lane.y)*q,a,lane.wave?'#ccb9ee':'#f5dda0');}}
  if(t>=3.2){const drop=reduced?0:Math.max(0,(4.1-t)*45),x=u.x,y=u.y-drop;c.fillStyle='#444151';c.fillRect(x-38,y-15,76,30);c.fillStyle='#c4a46a';c.fillRect(x-30,y-21,60,29);c.fillStyle='#f0d99d';c.fillRect(x-26,y-17,52,8);for(const side of [-1,1]){c.fillStyle='#2c3041';c.fillRect(x+side*26-9,y+5,18,12);c.fillStyle='#9b927b';c.fillRect(x+side*26-6,y+8,12,5);}}
 }else if(e.archetype==='kraid'){
  for(const row of u.spikeRows||[]){if(t>row.delay+row.duration)continue;const active=t>=row.delay,rise=active?15:8,dx=Math.cos(row.angle),dy=Math.sin(row.angle);
   for(const [start,end]of [[-225,row.gap-58],[row.gap+58,225]])for(let v=start+12;v<end;v+=25){const x=row.x+dx*v,y=row.y+dy*v;c.fillStyle=active?'#fff0bb':'#b6c7a2';c.strokeStyle='#334444';c.lineWidth=1;c.beginPath();c.moveTo(x-dx*7,y-dy*7);c.lineTo(x+dy*rise,y-dx*rise);c.lineTo(x+dx*7,y+dy*7);c.closePath();c.fill();c.stroke();}
   const x=row.x+dx*row.gap,y=row.y+dy*row.gap;c.globalAlpha=.75;stroke(c,[[x-dy*9-dx*6,y+dx*9-dy*6],[x,y],[x+dy*9-dx*6,y-dx*9-dy*6]],'#b6eed7',2);
  }
  c.globalAlpha=.9;for(let i=-1;i<=1;i++){const x=e.x+i*15,y=e.y+3;c.fillStyle='#384c49';c.fillRect(x-5,y-6,10,12);c.fillStyle='#e3d5a4';c.beginPath();c.moveTo(x-3,y-3);c.lineTo(x+13*charge,y);c.lineTo(x-3,y+3);c.fill();}
 }
 c.globalAlpha=1;const yy=e.y-Math.max(85,e.r*2.8)-28;c.fillStyle='#18202ce8';c.fillRect(e.x-90,yy-13,180,26);c.strokeStyle=def.color;c.lineWidth=1;c.strokeRect(e.x-90,yy-13,180,26);c.fillStyle=def.color;c.font='600 8px "DM Sans",sans-serif';c.textAlign='center';c.fillText(def.name,e.x,yy-2,170);c.fillStyle='#4d4858';c.fillRect(e.x-80,yy+4,160,3);c.fillStyle=def.color;c.fillRect(e.x-80,yy+4,160*charge,3);c.restore();
}
