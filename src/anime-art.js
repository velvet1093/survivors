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
