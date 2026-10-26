const TAU=Math.PI*2,INK='#24223a';
function path(c,points,color,width=1){c.strokeStyle=color;c.lineWidth=width;c.lineJoin='round';c.lineCap='round';c.beginPath();points.forEach(([x,y],i)=>i?c.lineTo(x,y):c.moveTo(x,y));c.stroke();}
function disc(c,x,y,r,color){c.fillStyle=color;c.beginPath();c.arc(x,y,Math.max(.1,r),0,TAU);c.fill();}
function ring(c,x,y,r,color,width=1,start=0,end=TAU){c.strokeStyle=color;c.lineWidth=width;c.beginPath();c.arc(x,y,Math.max(.1,r),start,end);c.stroke();}
function star(c,x,y,r,color){path(c,[[x-r,y],[x+r,y]],color,1);path(c,[[x,y-r],[x,y+r]],color,1);}
function charge(c,progress,reduced){
 const t=Math.max(0,Math.min(1,progress)),angle=(reduced?0:t*1.25),separation=19*(1-t)+2;
 // Attraction and repulsion curve in from opposite sides before imaginary mass forms.
 for(const side of [-1,1]){
  const a=angle+Math.PI*(side>0?1:0),x=Math.cos(a)*separation,y=Math.sin(a)*separation*.7,color=side<0?'#73c8ee':'#ed739e',light=side<0?'#d3f4f1':'#ffc6d4';
  path(c,[[x*1.8,y*1.8],[x*1.35,y*1.2],[x,y]],INK,5);path(c,[[x*1.8,y*1.8],[x*1.35,y*1.2],[x,y]],color,2);
  disc(c,x,y,6.4,INK);disc(c,x,y,4.8,color);disc(c,x-1.2,y-1.2,2.1,light);ring(c,x,y,7.6,light,1,a+.2,a+2.8);
 }
 if(t>.25){const r=2+(t-.25)*8;disc(c,0,0,r+1,INK);disc(c,0,0,r,'#9562be');disc(c,-1,-1,r*.55,'#dcaff2');disc(c,0,0,r*.22,'#fff1ed');}
 for(let i=0;i<4;i++){const a=i*TAU/4+.4,r=14*(1-t)+9;star(c,Math.cos(a)*r,Math.sin(a)*r,1+t,'#c4a2db');}
}

// Local coordinates: drawPlayerProjectile already translates/scales the canvas.
// These dimensions deliberately remain independent of the collision radius.
export function drawHollowPurpleProjectile(c,s,reduced=false){
 c.save();
 const charging=(s.charge||0)>0&&s.age<s.charge;
 if(charging){charge(c,s.age/s.charge,reduced);c.restore();return;}
 c.rotate(Math.atan2(s.vy||0,s.vx||1));
 const age=reduced?0:Math.max(0,s.age-(s.charge||0)),r=Math.max(10,Math.min(18,(s.r||26)*.66)),phase=age*3;
 // Two slender, opaque colored wakes meet at the purple core; the broad dark
 // edging keeps each ribbon visible against grass, snow and glowing effects.
 for(const side of [-1,1]){
  const points=[[-r*3.1,side*r*.38],[-r*2.3,side*r*.7],[-r*1.5,side*r*.45],[-r*.7,side*r*.1]],color=side<0?'#7cc8ef':'#ef79a7';
  path(c,points,INK,6);path(c,points,color,3);path(c,points.map(([x,y])=>[x,y-side*.7]),side<0?'#cff0f0':'#ffd2df',1);
 }
 disc(c,0,0,r+2,INK);disc(c,0,0,r,'#67418e');disc(c,-r*.1,-r*.12,r*.82,'#9663c2');
 disc(c,-r*.18,-r*.24,r*.55,'#c18ade');disc(c,r*.08,r*.06,r*.44,'#b17dd7');
 ring(c,0,0,r*.91,'#d6a8ec',1.3,-1.9,-.2);ring(c,0,0,r*.76,'#e7c0f6',1.2,.45,2.45);
 // Broken arcs and angular flares sell unstable imaginary mass, without a
 // large translucent glow obscuring the characters and nearby attacks.
 for(let i=0;i<6;i++){
  const a=i*TAU/6+phase,d=r*(1.04+(i%2)*.09),x=Math.cos(a)*d,y=Math.sin(a)*d;
  path(c,[[Math.cos(a-.12)*r*.85,Math.sin(a-.12)*r*.85],[x,y],[Math.cos(a+.15)*r*1.25,Math.sin(a+.15)*r*1.25]],i%2?'#c592e4':'#f0d2f4',1.2);
 }
 disc(c,-r*.05,-r*.08,r*.3,'#edd2f5');disc(c,-r*.06,-r*.09,r*.18,'#fff5eb');
 path(c,[[-r*.62,-r*.04],[r*.68,-r*.04]],'#fff4ee',.8);c.restore();
}
export function drawHollowPurpleConvergence(c,e,progress,reduced=false){c.save();c.translate(e.x,e.y);charge(c,progress,reduced);c.restore();}
export function drawHollowPurpleImpact(c,e,progress,reduced=false){
 const t=Math.max(0,Math.min(1,progress)),r=Math.max(1,(e.r||100)*(.15+t*.85)),fade=1-t;
 c.save();c.translate(e.x,e.y);c.globalAlpha*=fade;
 disc(c,0,0,r,'#9866bd16');ring(c,0,0,r,INK,3.5);ring(c,0,0,r,'#d3a0eb',1.7);
 for(const side of [-1,1])ring(c,0,0,r*.78,side<0?'#8fd4ed':'#f0a0c0',1.4,side<0?-.5:Math.PI-.5,side<0?1.6:Math.PI+1.6);
 const core=18*Math.pow(fade,.5);disc(c,0,0,core+2,INK);disc(c,0,0,core,'#a771cc');disc(c,-2,-2,core*.65,'#deaff0');disc(c,-1,-1,core*.3,'#fff1e9');
 for(let i=0;i<10;i++){const a=i*2.399+(reduced?0:.25),d=r*(.62+(i%3)*.13);path(c,[[Math.cos(a)*d*.8,Math.sin(a)*d*.8],[Math.cos(a+.04)*d,Math.sin(a+.04)*d]],i%2?'#deb5f0':'#f4d7e9',1.5);}
 c.restore();
}

let iconCache;
export function hollowPurpleItemPixels(id){
 if(id!=='purple')return null;if(iconCache)return iconCache;
 const p=Array(32*32).fill(null),put=(x,y,color)=>{x=Math.round(x);y=Math.round(y);if(x>=0&&x<32&&y>=0&&y<32)p[y*32+x]=color;},R=(x,y,w,h,color)=>{for(let yy=Math.round(y);yy<Math.round(y+h);yy++)for(let xx=Math.round(x);xx<Math.round(x+w);xx++)put(xx,yy,color);},L=(x,y,tx,ty,color,w=1)=>{const n=Math.max(Math.abs(tx-x),Math.abs(ty-y),1);for(let i=0;i<=n;i++)R(x+(tx-x)*i/n,y+(ty-y)*i/n,w,w,color);},O=(x,y,rx,ry,color)=>{for(let yy=0;yy<32;yy++)for(let xx=0;xx<32;xx++)if(((xx+.5-x)/rx)**2+((yy+.5-y)/ry)**2<=1)put(xx,yy,color);};
 L(2,10,8,9,INK,5);L(7,9,16,14,INK,5);L(2,10,8,9,'#83c7eb',3);L(8,10,16,15,'#9bdaf0',2);
 L(2,25,9,24,INK,5);L(8,24,17,19,INK,5);L(2,25,9,24,'#e578a5',3);L(8,24,17,19,'#f4b6cf',2);
 O(20,16,11,11,INK);O(20,16,9,9,'#67418e');O(19,15,8,8,'#9864c6');O(18,13,5,5,'#bc8adf');O(21,17,5,5,'#b17ed9');
 L(17,8,23,8,'#dab3ef');L(26,12,27,17,'#dfb6ef');L(15,21,20,24,'#e5b8ef');
 O(20,16,3.4,3.4,'#e3baf3');O(19,15,1.8,1.8,'#fff2e8');L(14,16,25,16,'#f4dcec');
 L(12,6,10,3,'#ba91db',2);L(28,24,31,27,'#dbb2ed');R(6,15,2,2,'#e7bfdc');R(27,3,2,2,'#e6c9f1');
 const out=[...p];for(let y=0;y<32;y++)for(let x=0;x<32;x++)if(p[y*32+x])for(const [dx,dy]of [[-1,0],[1,0],[0,-1],[0,1]]){const xx=x+dx,yy=y+dy;if(xx>=0&&xx<32&&yy>=0&&yy<32&&!p[yy*32+xx])out[yy*32+xx]=INK;}
 iconCache=out;return out;
}
