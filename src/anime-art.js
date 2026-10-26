const TAU=Math.PI*2;
function polygon(c,x,y,r,n,color,width=1,angle=0){c.strokeStyle=color;c.lineWidth=width;c.beginPath();for(let i=0;i<=n;i++){const a=i*TAU/n+angle,xx=x+Math.cos(a)*r,yy=y+Math.sin(a)*r;i?c.lineTo(xx,yy):c.moveTo(xx,yy);}c.stroke();}
export function enemyAura(c,e,time,reduced=false){
 if(e.armorTime>0){const color=e.archetype==='sachiel'?'#f4daa0':'#c2dda9';polygon(c,e.x,e.y-e.r*.8,e.r*1.25,8,color+'aa',2,Math.PI/8);polygon(c,e.x,e.y-e.r*.8,e.r*1.4,8,color+'44',1,Math.PI/8);}
 if(e.balanceTimer>0){polygon(c,e.x,e.y,e.r*1.8,6,'#dfc1e666',1,reduced?0:time*.12);}
 if(e.compassTimer>0){const r=e.r*1.8;polygon(c,e.x,e.y,r,6,'#a7cce599',2);for(let i=0;i<6;i++){const a=i*TAU/6;c.strokeStyle='#e6bddc88';c.beginPath();c.moveTo(e.x,e.y);c.lineTo(e.x+Math.cos(a)*r,e.y+Math.sin(a)*r);c.stroke();}}
}
export function hazardEmblem(c,h,progress){
 const x=h.shape==='circle'?h.x:(h.x+h.tx)/2,y=h.shape==='circle'?h.y:(h.y+h.ty)/2;
 if(h.label==='SOUL BALANCE'){
   c.strokeStyle='#eed7a6';c.lineWidth=2;c.beginPath();c.moveTo(x,y-19);c.lineTo(x,y+17);c.moveTo(x-23,y-11);c.lineTo(x+23,y-11);c.moveTo(x-14,y-11);c.lineTo(x-14,y+6);c.moveTo(x+14,y-11);c.lineTo(x+14,y+6);c.stroke();for(const side of [-1,1]){const xx=x+side*14;c.fillStyle='#e8cfa477';c.beginPath();c.moveTo(xx-9,y+6);c.lineTo(xx+9,y+6);c.lineTo(xx+5,y+12);c.lineTo(xx-5,y+12);c.fill();}
 }else if(h.label==='GUILLOTINE'){
   c.fillStyle='#f1d9e4bb';c.beginPath();c.moveTo(x-15,y-45+progress*35);c.lineTo(x+15,y-45+progress*35);c.lineTo(x+15,y-31+progress*35);c.lineTo(x-15,y-23+progress*35);c.fill();
 }else if(h.label==='ANGEL CROSS'||h.label==='LIGHT LANCE'){
   c.fillStyle='#f9e6b077';c.fillRect(x-1,y-9,3,18);c.fillRect(x-8,y-3,17,3);
 }
}
export function evaEffects(c,g,layer='under'){
 const u=g.ultimate;if(u?.type!=='shinji')return;const p=g.p,age=p.reducedMotion?0:u.age;
 if(layer==='under'){
   const r=90+Math.sin(age*4)*3;polygon(c,p.x,p.y,r,8,'#e5d6a288',2,Math.PI/8);polygon(c,p.x,p.y,r+8,8,'#b0df9e55',1,Math.PI/8);for(let i=0;i<8;i++){const a=i*TAU/8+Math.PI/8;c.fillStyle='#b9dc9a66';c.fillRect(Math.round(p.x+Math.cos(a)*r),Math.round(p.y+Math.sin(a)*r),3,3);}
 }else{for(let i=0;i<8;i++){const a=i*2.399,phase=(age*.8+i/8)%1;c.fillStyle=i%2?'#b5dc8daa':'#ccb0ec88';c.fillRect(Math.round(p.x+Math.cos(a)*(18+phase*12)),Math.round(p.y-10-phase*70),2,5);}}
}
export function drawEvaStrike(c,e,progress){
 if(e.type==='eva-claw'){
   c.save();c.translate(e.x,e.y);c.rotate(e.angle||0);c.strokeStyle='#dcf1b5';c.lineWidth=3;for(let i=-1;i<=1;i++){c.beginPath();c.arc(12+i*9,i*14,Math.max(1,e.r*(.2+progress*.8)), -.65,.65);c.stroke();}c.restore();
 }else if(e.type==='at-burst')polygon(c,e.x,e.y,e.r*(.1+progress*.9),8,'#e9dca7',3,Math.PI/8);
}
