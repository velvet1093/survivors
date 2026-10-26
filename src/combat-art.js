import {activeStatuses} from './status.js';
import {gemTier} from './xp.js';
const TAU=Math.PI*2;
const ring=(c,x,y,r,color,width=1)=>{c.strokeStyle=color;c.lineWidth=width;c.beginPath();c.arc(x,y,Math.max(.1,r),0,TAU);c.stroke();};
function dot(c,x,y,w,hOrColor,color=hOrColor){c.fillStyle=color;c.fillRect(Math.round(x),Math.round(y),w,typeof hOrColor==='number'?hOrColor:w);}
export function drawGem(c,gem,time,reduced=false){
 const tier=gemTier(gem.value),s=tier.size,x=Math.round(gem.x),y=Math.round(gem.y+(reduced?0:Math.sin(time*3+(gem.phase||0))*2));
 dot(c,x-s,y+s,s*2,2,'#14283455');
 c.fillStyle=tier.shade;c.beginPath();c.moveTo(x,y-s-1);c.lineTo(x+s,y);c.lineTo(x,y+s+1);c.lineTo(x-s,y);c.closePath();c.fill();
 c.fillStyle=tier.color;c.beginPath();c.moveTo(x,y-s+1);c.lineTo(x+s-2,y);c.lineTo(x,y+s-1);c.lineTo(x-s+1,y);c.fill();
 dot(c,x-1,y-s+2,2,Math.max(2,s-2),tier.light);dot(c,x+1,y+1,Math.max(1,s-3),1,tier.shade);
 if(gem.value>=25){dot(c,x-s-2,y,2,2,tier.light);dot(c,x+s+1,y,2,2,tier.light);dot(c,x,y-s-4,1,2,tier.light);}
}
function statusGlyph(c,id,x,y,color){
 const pixel=(xx,yy,w=1,h=1)=>dot(c,x+xx,y+yy,w,h,color);
 if(id==='frozen'){pixel(3,0,1,8);pixel(0,2);pixel(1,3);pixel(2,4);pixel(4,4);pixel(5,3);pixel(6,2);pixel(0,6);pixel(1,5);pixel(5,5);pixel(6,6);}
 else if(id==='poison'){pixel(2,0,3);pixel(1,1,5,3);pixel(2,5,3);dot(c,x+2,y+2,1,1,'#293847');dot(c,x+4,y+2,1,1,'#293847');pixel(1,7);pixel(5,7);}
 else if(id==='burning'){pixel(3,0,1,5);pixel(2,2,3,4);pixel(1,4,5,3);pixel(2,7,3);dot(c,x+3,y+5,1,2,'#ffe7a9');}
 else if(id==='cursed'){pixel(1,1,1,5);pixel(5,1,1,5);pixel(2,0,3);pixel(2,6,3);pixel(3,2,1,3);pixel(0,3);pixel(6,3);}
 else if(id==='stun'){pixel(3,0,1,7);pixel(0,3,7);pixel(1,1);pixel(5,1);pixel(1,5);pixel(5,5);}
 else if(id==='slow'){pixel(0,0,7);pixel(0,7,7);pixel(1,1);pixel(5,1);pixel(2,2,3);pixel(3,3,1,2);pixel(2,5,3);pixel(1,6,5);}
 else{pixel(3,0,1,2);pixel(2,2,3,2);pixel(1,4,5,3);pixel(2,7,3);dot(c,x+2,y+4,1,2,'#ffe1d7');}
}
export function drawUnitStatuses(c,unit,time,reduced=false,isPlayer=false){
 const statuses=activeStatuses(unit);if(!statuses.length)return;const y=unit.y-(isPlayer?65:unit.r*3.4+14),start=unit.x-statuses.length*5;
 for(let i=0;i<statuses.length;i++){const s=statuses[i],x=start+i*10;dot(c,x-1,y-1,9,10,'#1b2139dd');statusGlyph(c,s.id,x,y,s.color);if(s.stacks>1){c.fillStyle='#fff3d9';c.font='bold 6px sans-serif';c.textAlign='left';c.fillText(String(s.stacks),x+5,y+9);}}
 if(reduced)return;
 for(let i=0;i<Math.min(3,statuses.length);i++){const s=statuses[i],phase=(time*1.4+i*.34)%1,x=unit.x+Math.sin(time*2+i*2.4)*13,y=unit.y-7-phase*27;dot(c,x,y,2,2,s.color);}
}
export function drawCombatField(c,f,reduced=false){
 const age=reduced?.5:f.age,fade=Math.min(1,f.life/.6),r=f.r,enter=Math.min(1,f.age/.14);c.save();c.globalAlpha=fade*enter;
 if(f.kind==='poison'){
   const fused=f.fused,pale=fused?'#e0c5f2':'#d8ecaa',edge=fused?'#bc9ed3':'#a5ce77';
   c.fillStyle=fused?'#76608355':'#5d915c66';c.beginPath();c.arc(f.x,f.y,r,0,TAU);c.fill();ring(c,f.x,f.y,r,edge+'bb',2);ring(c,f.x,f.y,r-4,edge+'44');
   for(let i=0;i<14;i++){const a=i*2.399+age*.16,d=r*(.15+((i*7)%13)/16),x=f.x+Math.cos(a)*d,y=f.y+Math.sin(a)*d,phase=(age*.45+i*.17)%1;ring(c,Math.round(x),Math.round(y-phase*7),2+phase*3,edge+(phase<.6?'99':'44'));if(i%3===0)dot(c,x-2,y+3,3,1,pale+'77');}
   // A central poison mark and short fading fumes make the pool readable at any zoom.
   c.save();c.translate(Math.round(f.x-4),Math.round(f.y-4));c.scale(1.3,1.3);statusGlyph(c,'poison',0,0,pale+'aa');c.restore();
   for(let i=0;i<8;i++){const a=i*TAU/8;dot(c,f.x+Math.cos(a)*(r-7),f.y+Math.sin(a)*(r-7),2,2,pale+'aa');}
   if(f.panacea){ring(c,f.x,f.y,r-10,'#eee5ad66',1);}
 }else{
   const core=8+Math.sin(age*9)*1.2;c.fillStyle='#142a4a77';c.beginPath();c.arc(f.x,f.y,r,0,TAU);c.fill();ring(c,f.x,f.y,r,'#8fcbf666',1);ring(c,f.x,f.y,r*.7,'#5c99e455',2);
   for(let i=0;i<22;i++){const t=(age*.85+i/22)%1,a=i*2.399+age*1.5,d=core+(r-core)*(1-t),x=f.x+Math.cos(a)*d,y=f.y+Math.sin(a)*d;dot(c,x,y,2,2,i%3?'#8ed5f3':'#e9f7ff');if(i%3===0){c.strokeStyle='#5c9fe788';c.beginPath();c.arc(f.x,f.y,d,a-.5,a);c.stroke();}}
   c.fillStyle='#0a142b';c.beginPath();c.arc(f.x,f.y,core,0,TAU);c.fill();ring(c,f.x,f.y,core+2,'#c1f4ff',2);ring(c,f.x,f.y,core+5,'#64aaf2aa',2);
 }
 c.restore();
}
export function drawPurple(c,s,reduced=false){
 if(s.age<(s.charge||0)){
   const t=s.age/(s.charge||1),r=20*(1-t)+6;for(const side of [-1,1]){const x=side*r,y=Math.sin(t*Math.PI)*side*10;c.fillStyle=side<0?'#7acfff':'#ff8baf';c.beginPath();c.arc(x,y,6,0,TAU);c.fill();ring(c,x,y,9,(side<0?'#a4e7ff':'#ffc0d4')+'66',2);}return;
 }
 c.rotate(Math.atan2(s.vy,s.vx));const age=reduced?0:s.age,r=s.r;
 for(let i=4;i>0;i--){c.fillStyle=['#78559411','#9f76c422','#ba94e044','#cdb7f366'][4-i];c.beginPath();c.ellipse(-i*12,0,r*(1-i*.1),r*(1-i*.12),0,0,TAU);c.fill();}
 c.fillStyle='#6e4e9c';c.beginPath();c.arc(0,0,r,0,TAU);c.fill();ring(c,0,0,r,'#d8c5f6',2);ring(c,0,0,r*.6,'#b49ae0',2);
 c.strokeStyle='#f5d9fb';c.lineWidth=2;c.beginPath();for(let i=0;i<9;i++){const a=age*4+i*TAU/8,rr=r*(i%2?.65:1.14),x=Math.cos(a)*rr,y=Math.sin(a)*rr;if(i)c.lineTo(x,y);else c.moveTo(x,y);}c.stroke();dot(c,-3,-3,6,6,'#f2e5ff');
}
