import {drawGuardianHealth} from './guardian-health.js';
import {raster,outline,pixelRuns} from './pixel-characters.js';

const TAU=Math.PI*2,INK='#38323e',STONE='#b7a381',LIGHT='#e9d8ac',SHADE='#857562';
const clamp=(x,a=0,b=1)=>Math.max(a,Math.min(b,x));

// One broad, carved silhouette, with daylight between each floating stone segment.
export function frierenGolemPixels({frame=0,phase='idle',charge=0}={}){
 const r=raster(),{rect,poly,line}=r,hover=[0,1,0,-1][frame%4],raising=phase==='slam-windup',striking=phase==='slam',beam=phase==='beam',charging=phase==='beam-windup',forming=phase==='forming',split=forming?Math.round((1-clamp(charge))*5):0,armSplit=Math.min(1,split);
 const block=(x,y,w,h)=>{
  poly([[x+2,y],[x+w-3,y],[x+w,y+3],[x+w-1,y+h-2],[x+w-4,y+h],[x+1,y+h-1],[x,y+3]],STONE);
  poly([[x+2,y],[x+w-3,y],[x+w-5,y+3],[x+3,y+3],[x+1,y+h-3],[x,y+3]],LIGHT);
  poly([[x+w-3,y],[x+w,y+3],[x+w-1,y+h-2],[x+w-4,y+h],[x+w-5,y+3]],SHADE);
  line(x+2,y+h-2,x+w-5,y+h-1,'#a59175',1);
 };
 const body=hover+(striking?2:0),head=hover+(charging||beam?-1:0);
 // Detached shin stones have broken top faces instead of human knees and feet.
 for(const [x,dy] of [[15,hover],[33,-hover]]){
  block(x,57+dy+split,10,12);poly([[x+1,59+dy+split],[x+5,61+dy+split],[x+4,65+dy+split],[x+7,68+dy+split]],'#8e7d65');rect(x+2,58+dy+split,5,1,'#f3e1b6');
 }
 // Broad pelvis and torso are separate slabs, each with its own beveled face.
 block(19,49+body,20,5);block(17,27+body,24,20);
 poly([[20,30+body],[31,29+body],[35,33+body],[33,39+body],[36,44+body],[22,44+body],[19,40+body]],'#d1bd94');
 line(28,28+body,26,34+body,'#746553',1);line(26,34+body,29,37+body,'#746553',1);line(29,37+body,27,42+body,'#746553',1);line(27,42+body,31,46+body,'#746553',1);line(27,35+body,23,35+body,'#746553',1);line(32,31+body,36,30+body,'#f0dfb5',1);
 // A small violet rune is embedded in the chest, never a smooth sci-fi plate.
 poly([[34,36+body],[36,38+body],[34,41+body],[32,38+body]],beam?'#ffe4f5':charging?'#eb9dc3':'#97718a');rect(34,37+body,1,2,'#f2cfdb');
 for(const side of [-1,1]){
  const sx=side<0?5-armSplit:42+armSplit,sy=26+body-(raising?3:0),fy=raising?18+(side>0?4:0):striking?50:44+(side<0?hover:-hover),fx=side<0?2-armSplit:43+armSplit;
  block(sx,sy,10,10);block(side<0?5-armSplit:43+armSplit,raising?32:39+body,8,5);
  block(fx,fy,11,12);line(fx+4,fy+2,fx+5,fy+7,'#796854',1);line(fx+5,fy+7,fx+8,fy+9,'#796854',1);line(fx+3,fy+4,fx+8,fy+4,'#f5e3b8',1);rect(fx+2,fy+9,2,1,'#796854');rect(fx+5,fy+10,2,1,'#796854');
 }
 // The squared head is cut from the same rock, with a slanted brow and a mouth slit.
 block(18,8+head-split,21,15);
 poly([[20,10+head-split],[34,10+head-split],[37,12+head-split],[35,14+head-split],[22,14+head-split]],'#dbca9f');
 line(20,15+head-split,26,16+head-split,'#776452',1);line(31,16+head-split,36,15+head-split,'#776452',1);
 rect(22,16+head-split,4,2,'#453641');rect(31,16+head-split,4,2,'#453641');rect(23,16+head-split,2,1,charging||beam?'#f4b4dc':'#b99a9f');rect(32,16+head-split,2,1,charging||beam?'#f4b4dc':'#b99a9f');
 line(27,10+head-split,28,13+head-split,'#8c785f',1);line(28,13+head-split,27,15+head-split,'#8c785f',1);rect(28,17+head-split,2,2,'#a58c70');
 rect(23,20+head-split,12,2,'#4b3447');rect(25,20+head-split,9,1,beam?'#fff2fa':charging?'#f4b2dd':'#ca8bad');if(beam){rect(25,19+head-split,9,1,'#e9a0d6');rect(26,21+head-split,8,1,'#ffe5f5');}
 return outline(r.pixels,INK);
}

let icon;
export function frierenGolemIconPixels32(){
 if(icon)return icon;
 const p=Array(32*32).fill(null),R=(x,y,w,h,c)=>{for(let yy=y;yy<y+h;yy++)for(let xx=x;xx<x+w;xx++)if(xx>=0&&xx<32&&yy>=0&&yy<32)p[yy*32+xx]=c;},L=(x,y,tx,ty,c)=>{const n=Math.max(Math.abs(tx-x),Math.abs(ty-y),1);for(let i=0;i<=n;i++)R(Math.round(x+(tx-x)*i/n),Math.round(y+(ty-y)*i/n),1,1,c);};
 R(7,15,18,14,STONE);R(8,16,15,3,LIGHT);R(23,17,2,12,SHADE);R(3,17,4,6,LIGHT);R(1,24,7,6,STONE);R(25,17,4,6,STONE);R(25,24,6,6,SHADE);R(25,24,4,4,STONE);R(2,25,4,2,LIGHT);
 R(8,2,16,11,STONE);R(9,2,13,3,LIGHT);R(22,4,2,9,SHADE);R(10,7,4,2,INK);R(18,7,4,2,INK);R(11,7,2,1,'#d7a8bf');R(19,7,2,1,'#d7a8bf');R(12,11,9,2,'#633c5e');R(13,11,7,1,'#f0addc');R(15,9,2,2,SHADE);
 L(16,16,14,21,'#85725d');L(14,21,17,24,'#85725d');L(17,24,16,28,'#85725d');R(19,21,2,3,'#b383a4');R(19,21,1,2,'#f0c2dc');L(3,10,5,10,'#d9b4cf');L(4,9,4,11,'#d9b4cf');L(27,4,29,4,'#e4c8a2');L(28,3,28,5,'#e4c8a2');
 icon=[...p];for(let y=0;y<32;y++)for(let x=0;x<32;x++)if(p[y*32+x])for(const [dx,dy]of [[-1,0],[1,0],[0,-1],[0,1]]){const xx=x+dx,yy=y+dy;if(xx>=0&&xx<32&&yy>=0&&yy<32&&!p[yy*32+xx])icon[yy*32+xx]=INK;}return icon;
}

const cache=new Map();
export function drawFrierenGolem(c,s,reduced=false,hideUi=false){
 if(!s)return;const frame=reduced?0:Math.floor(s.moving?(s.walk||0):(s.age||0)*5)%4,charge=s.phase==='forming'?clamp((s.phaseAge||0)/.55):0,key=[frame,s.phase,Math.round(charge*5)].join(':');
 if(!cache.has(key)){
  const cv=document.createElement('canvas');cv.width=56;cv.height=76;const cc=cv.getContext('2d');for(const run of pixelRuns(frierenGolemPixels({frame,phase:s.phase,charge:Math.round(charge*5)/5}))){cc.fillStyle=run.color;cc.fillRect(run.x,run.y,run.width,1);}cache.set(key,cv);
 }
 c.save();c.globalAlpha*=s.opacity??1;c.translate(Math.round(s.x),Math.round(s.y));c.imageSmoothingEnabled=false;c.scale((s.facing||1)*1.3,1.3);c.drawImage(cache.get(key),-28,-71);c.restore();if(!hideUi)drawGuardianHealth(c,s,'GOLEM','#d6c29b',48);
}

function ellipse(c,x,y,rx,ry,color,fill=false){c.beginPath();c.ellipse(x,y,Math.max(.1,rx),Math.max(.1,ry),0,0,TAU);if(fill){c.fillStyle=color;c.fill();}else{c.strokeStyle=color;c.stroke();}}
function mouth(c,s,quiet){
 const x=s.x+(s.facing||1)*4,y=s.y-65,charge=clamp((s.phaseAge||0)/.6),r=3+charge*7;
 ellipse(c,x,y,r*1.8,r*1.2,'#b66eac33',true);ellipse(c,x,y,r,r*.65,'#dca2cc',true);ellipse(c,x,y,r*.5,r*.45,'#fff1fb',true);
 c.lineWidth=1;for(let i=0;i<4;i++){const a=i*TAU/4+(quiet?0:(s.age||0)),d=r+8+(quiet?0:Math.sin(s.age*9+i)*3);c.strokeStyle='#efc1e5';c.beginPath();c.moveTo(x+Math.cos(a)*d,y+Math.sin(a)*d);c.lineTo(x+Math.cos(a)*(d-4),y+Math.sin(a)*(d-4));c.stroke();}
}
export function drawFrierenGolemEffects(c,g,layer='under'){
 const s=g.golem||g.ultimate?.golem;if(!s||s.hp<=0)return;const quiet=!!g.p.reducedMotion,t=quiet?0:s.age||0;c.save();
 if(layer==='under'){
  ellipse(c,s.x,s.y-1,33,11,'#19243045',true);c.lineWidth=1;ellipse(c,s.x,s.y-1,27,8,'#dcbdc65c');
  if(s.phase==='forming'){
   const p=clamp((s.phaseAge||0)/.55),r=37+p*7;c.lineWidth=1.5;ellipse(c,s.x,s.y,r,r*.38,'#ead7b1');c.setLineDash([4,5]);ellipse(c,s.x,s.y,r+7,(r+7)*.38,'#d5a6cbaa');c.setLineDash([]);
   for(let i=0;i<8;i++){const a=i*TAU/8+t*.4,x=s.x+Math.cos(a)*r,y=s.y+Math.sin(a)*r*.38;c.fillStyle='#f0e2c6';c.fillRect(x-2,y-2,4,4);}
  }
  if(s.phase==='slam-windup'){
   const target=s.slamTarget||s.target||{x:s.x+(s.facing||1)*42,y:s.y},r=s.slamRadius||58;c.setLineDash([4,5]);ellipse(c,target.x,target.y,r,r*.45,'#ebcad69a');c.setLineDash([]);
  }
  if(s.slam){
   const a=clamp(1-s.slam.age/(s.slam.duration||.6)),{x,y,r}=s.slam;c.globalAlpha*=a;
   ellipse(c,x,y,r*(1-a*.4),r*.45*(1-a*.4),'#e3c7aa',false);ellipse(c,x,y,r*.52,r*.2,'#806a6680',true);
   for(let i=0;i<8;i++){const angle=i*2.399,x0=x+Math.cos(angle)*r*.2,y0=y+Math.sin(angle)*r*.12,x1=x+Math.cos(angle+.1)*r*.53,y1=y+Math.sin(angle+.1)*r*.35;c.strokeStyle='#b2967d';c.lineWidth=2;c.beginPath();c.moveTo(x0,y0);c.lineTo(x1,y1);c.lineTo(x+Math.cos(angle)*r*.88,y+Math.sin(angle)*r*.5);c.stroke();}
  }
 }else{
  if(s.phase==='beam-windup')mouth(c,s,quiet);
  if(s.beam){
   const b=s.beam,age=b.age||0,p=clamp(age/.12),fade=clamp(((b.duration||1.15)-age)/.16),width=(b.width||13)*Math.max(.15,p)*fade,dx=b.tx-b.x,dy=b.ty-b.y,d=Math.hypot(dx,dy)||1;c.globalAlpha*=fade;c.lineCap='round';
   for(const [scale,color]of [[2.15,'#9d5fa53d'],[1.25,'#b66ab9a8'],[.72,'#efacdf'],[.27,'#fff0f8']]){c.strokeStyle=color;c.lineWidth=width*scale;c.beginPath();c.moveTo(b.x,b.y);c.lineTo(b.tx,b.ty);c.stroke();}
   const end=Math.atan2(dy,dx)+Math.PI/2;
   for(let i=0;i<3;i++){const f=.2+i*.3+(quiet?0:(age*.3)% .2),x=b.x+dx*f,y=b.y+dy*f;c.strokeStyle='#fbe0f4a0';c.lineWidth=1;c.beginPath();c.ellipse(x,y,width*.8,width*.35,end,0,TAU);c.stroke();}
   ellipse(c,b.x,b.y,width*.8,width*.65,'#ffe9f7',true);ellipse(c,b.tx,b.ty,width*.8,width*.6,'#ebb7dfa0',true);
   if(!quiet)for(let i=0;i<5;i++){const a=i*2.399+age*3,rr=width*(1.3+.3*Math.sin(age*6+i));c.fillStyle='#efd0e8';c.fillRect(b.tx+Math.cos(a)*rr,b.ty+Math.sin(a)*rr,2,2);}
  }
  if(s.slam){
   const a=clamp(1-s.slam.age/(s.slam.duration||.6));c.globalAlpha*=a;
   for(let i=0;i<(quiet?4:9);i++){const angle=i*2.399,dist=(.3+.6*(1-a))*s.slam.r,x=s.slam.x+Math.cos(angle)*dist,y=s.slam.y+Math.sin(angle)*dist*.4-(quiet?3:Math.sin((1-a)*Math.PI)*14);c.fillStyle=i%2?'#b3a081':'#e3cfa5';c.fillRect(Math.round(x),Math.round(y),3+i%3,3);}
  }
 }
 c.restore();
}
