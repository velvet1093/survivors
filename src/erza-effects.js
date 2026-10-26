const TAU=Math.PI*2;
const line=(c,points,color,width=1)=>{c.strokeStyle=color;c.lineWidth=width;c.lineCap='round';c.lineJoin='round';c.beginPath();points.forEach(([x,y],i)=>i?c.lineTo(x,y):c.moveTo(x,y));c.stroke();};
function sword(c,length=24,color='#d9e6ec'){
 c.fillStyle='#263247';c.beginPath();c.moveTo(length,0);c.lineTo(-6,-5);c.lineTo(-6,5);c.closePath();c.fill();
 c.fillStyle=color;c.beginPath();c.moveTo(length-2,0);c.lineTo(-4,-3);c.lineTo(-4,3);c.closePath();c.fill();
 line(c,[[-4,0],[length-5,0]],'#fff8e8',1);line(c,[[-8,-7],[-8,7]],'#dcc292',3);line(c,[[-8,0],[-16,0]],'#6b4560',4);line(c,[[-16,-2],[-16,2]],'#d8bd82',2);
}
export function drawErzaSword(c,s,{zoom=1,reducedMotion=false}={}){
 if(s.delay&&s.age<s.delay)return;c.save();c.translate(s.x,s.y);c.rotate(Math.atan2(s.vy,s.vx));const scale=Math.max(.85,.7/zoom);c.scale(scale,scale);
 if(!reducedMotion)line(c,[[-36,0],[-8,0]],s.color+'66',4);sword(c,23,s.color);c.restore();
}
export function drawErzaEffect(c,e,t,reducedMotion=false){
 if(!e.type?.startsWith('erza-'))return false;
 c.save();c.translate(e.x,e.y);
 if(e.type==='erza-requip'){
  const r=e.r*(.4+t*.6);c.strokeStyle=e.color;c.lineWidth=2;c.beginPath();c.ellipse(0,15,r,r*.42,0,0,TAU);c.stroke();
  for(let i=0;i<8;i++){const a=i*TAU/8+(reducedMotion?0:t*.3),x=Math.cos(a)*r*.65,y=Math.sin(a)*r*.4-20;c.fillStyle=i%2?e.color:'#fff2dc';c.globalAlpha=.8*(1-t);c.fillRect(x-2,y-8,4,16);}
 }else if(e.type==='erza-wheel'){
  for(let i=0;i<Math.min(7,e.blades||3);i++){const a=e.angle+(i-((e.blades||3)-1)/2)*.38,x=Math.cos(a)*e.r*.4,y=Math.sin(a)*e.r*.4;c.save();c.translate(x,y);c.rotate(a);c.scale(.7,.7);sword(c,19,e.color);c.restore();}
 }else if(e.type==='erza-slash'){
  c.rotate(e.angle);const reach=e.r,phase=reducedMotion?.55:t;
  if(e.form===3){
   // A single steel-edged sword sweep makes the neutral starting stance clear.
   c.strokeStyle='#29364b';c.lineWidth=7;c.beginPath();c.arc(0,0,reach*.78,-1.15+phase*.6,.3+phase*.9);c.stroke();
   c.strokeStyle=e.fused?'#f3d6a8':'#c8dfe8';c.lineWidth=3;c.stroke();c.strokeStyle='#f8f4df';c.lineWidth=1;c.stroke();
   c.save();c.rotate(-.9+phase*1.65);c.translate(reach*.45,0);sword(c,reach*.32,e.fused?'#f0d9af':'#e0edf1');c.restore();
  }else if(e.form===2){c.strokeStyle='#283545';c.fillStyle='#a2c6d53d';c.lineWidth=6;c.beginPath();c.moveTo(reach*.6,-reach*.47);c.lineTo(reach*.91,-reach*.23);c.lineTo(reach,0);c.lineTo(reach*.91,reach*.23);c.lineTo(reach*.6,reach*.47);c.stroke();c.lineWidth=2;c.strokeStyle='#e2f1f3';c.stroke();line(c,[[reach*.45,-18],[reach*.9,0],[reach*.45,18]],'#bedee9',3);}
  else{for(let i=0;i<(e.fused?3:2);i++){const off=(i-.5)*.18,start=-1.5+phase*.8+off,end=.5+phase*.9+off;c.strokeStyle='#2c253d';c.lineWidth=8;c.beginPath();c.arc(0,0,reach*(.7+i*.1),start,end);c.stroke();c.strokeStyle=i?'#ecdaf3':'#b69bcf';c.lineWidth=3;c.stroke();}c.save();c.rotate(-.9+phase*1.8);c.translate(reach*.5,0);sword(c,reach*.3,'#e0d7e8');c.restore();}
 }else if(e.type==='erza-sever'){
  c.rotate(e.angle);const length=e.r*(.5+Math.min(1,t*3)*.9);line(c,[[-length,-length*.25],[length,length*.25]],'#4d3a49',11*(1-t)+2);line(c,[[-length,-length*.25],[length,length*.25]],e.color,6*(1-t)+1);line(c,[[-length*.9,-length*.225],[length*.9,length*.225]],'#fff8dd',2);c.strokeStyle=e.color;c.lineWidth=1.5;c.beginPath();c.arc(0,0,e.r*(.35+t*.65),.3,2.6);c.stroke();
 }
 c.restore();return true;
}
export function drawErzaUltimate(c,g){
 const u=g.ultimate;if(u?.type!=='erza')return;c.save();const quiet=!!g.p.reducedMotion;
 for(const cut of u.strikes||[]){if(cut.done)continue;const remaining=cut.at-u.age;if(remaining>.95)continue;c.save();c.translate(cut.x,cut.y);c.rotate(cut.angle);c.strokeStyle='#f1d49b';c.lineWidth=1.5;c.setLineDash([5,6]);c.beginPath();c.arc(0,0,u.r,0,TAU);c.stroke();c.setLineDash([]);line(c,[[-u.r*.68,0],[u.r*.68,0]],'#f7dda166',3);line(c,[[0,-9],[0,9]],'#fff0c2',2);c.restore();}
 if(u.age<.9){const radius=45+u.age*24;c.globalAlpha=.55;c.strokeStyle='#e7c68c';c.lineWidth=2;c.beginPath();c.ellipse(g.p.x,g.p.y-20,radius,radius*.55,0,0,TAU);c.stroke();for(let i=0;i<7;i++){const a=i*TAU/7+(quiet?0:u.age*.5);line(c,[[g.p.x+Math.cos(a)*radius*.8,g.p.y-20+Math.sin(a)*radius*.45],[g.p.x+Math.cos(a)*radius,g.p.y-20+Math.sin(a)*radius*.55]],'#fff0b8',3);}}
 c.restore();
}
export function drawErzaBarrier(c,g){
 if(g.p.id!=='erza'||g.mechanic.form!==2||g.mechanic.barrier<=0)return;
 const p=g.p,ratio=g.mechanic.barrier/(g.mechanic.barrierMax||30),x=p.x+p.facing*22,y=p.y-24;c.save();c.globalAlpha=.25+.5*ratio;c.fillStyle='#98c8df22';c.strokeStyle='#c4e5ef';c.lineWidth=2;c.beginPath();c.moveTo(x,y-30);c.lineTo(x+p.facing*17,y-13);c.lineTo(x+p.facing*17,y+10);c.lineTo(x,y+25);c.lineTo(x-p.facing*8,y+10);c.lineTo(x-p.facing*8,y-13);c.closePath();c.fill();c.stroke();line(c,[[x,y-20],[x,y+16]],'#edf6e4',1);c.restore();
}
