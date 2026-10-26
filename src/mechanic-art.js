import {SAIYAN_STAGES} from './hero-mechanics.js';
const TAU=Math.PI*2;
export function drawHeroMechanic(c,g,reduced=false){
 const m=g.mechanic,p=g.p;if(!m)return;
 const color=m.id==='diavolo'&&(m.value>=100||m.counter>0)?'#edb4c1':m.id==='goku'&&m.stage>0?SAIYAN_STAGES[m.stage].color:m.id==='yuki'&&m.active>0?'#efc49c':m.id==='shinji'&&m.active>0?'#cee996':m.id==='esdeath'&&m.active>0?'#b6e9fb':m.id==='gojo'&&m.value>=m.max?'#c4b7ff':null;
 if(!color)return;c.save();const phase=reduced?0:g.time;
 c.strokeStyle=color+'cc';c.lineWidth=1.5;c.beginPath();c.ellipse(p.x,p.y-23,22+Math.sin(phase*4)*2,31,0,0,TAU);c.stroke();
 for(let i=0;i<6;i++){const a=i*TAU/6+phase*.5,x=p.x+Math.cos(a)*26,y=p.y-25+Math.sin(a)*32;c.fillStyle=color;c.fillRect(Math.round(x),Math.round(y),2,3);}
 if(m.id==='goku'&&m.stage>=2){c.strokeStyle='#c1ecff';c.lineWidth=1.5;for(const side of [-1,1]){c.beginPath();c.moveTo(p.x+side*19,p.y-47);c.lineTo(p.x+side*25,p.y-35);c.lineTo(p.x+side*19,p.y-28);c.lineTo(p.x+side*26,p.y-15);c.stroke();}}
 if(m.id==='shinji'&&m.active>0){
  const age=m.activeAge||0,roar=Math.max(0,1-age/.85);c.strokeStyle='#e3f6bc';c.lineWidth=2;
  for(let i=0;i<3;i++){const r=30+((phase*28+i*15)%46);c.globalAlpha=roar>0?roar*.8:.28;c.beginPath();c.ellipse(p.x,p.y-23,r*.7,r,0,-.8,.8);c.stroke();c.beginPath();c.ellipse(p.x,p.y-23,r*.7,r,0,Math.PI-.8,Math.PI+.8);c.stroke();}
  c.globalAlpha=1;for(let i=0;i<5;i++){const a=i*2.399+phase*1.5,r=25+(i%2)*8;c.fillStyle=i%2?'#e3f5bd':'#b3d87d';c.fillRect(Math.round(p.x+Math.cos(a)*r),Math.round(p.y-26+Math.sin(a)*r),2,5);}
 }
 c.restore();
}
