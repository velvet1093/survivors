import {raster,outline} from './pixel-characters.js';
import {drawCasualHairBack,drawCasualFace,drawCasualHairFront} from './casual-art.js';

import {CUTE_SWIM_OUTFITS} from './cute-swim-outfits.js';
export {CUTE_SWIM_OUTFITS} from './cute-swim-outfits.js';
const INK='#2b3042',SKIN='#ffe0c6',SHADE='#d2a58f',IVORY='#fff0de';
const COLORS={
 madoka:{c:'#e9a6c0',d:'#a9618a',l:'#ffdae5',edge:'#fff0df',accent:'#b66a8e'},
 maomao:{c:'#6daf9b',d:'#35695f',l:'#bce1c1',edge:'#eee0b5',accent:'#a36f8b'},
 kurumi:{c:'#494252',d:'#252c3c',l:'#87758c',edge:'#f0e6db',accent:'#bf6d85'},
};
function flower(r,x,y,p){
 const {rect:R}=r;for(const [dx,dy]of [[0,-2],[-2,0],[2,0],[0,2]])R(x+dx,y+dy,2,2,p.l);R(x,y,2,2,p.edge);R(x,y,1,1,p.accent);
}
function bow(r,x,y,p){
 const {poly:P,rect:R}=r;P([[x,y],[x-5,y-3],[x-5,y+3],[x,y+2]],p.accent);P([[x+1,y],[x+6,y-3],[x+6,y+3],[x+1,y+2]],p.accent);R(x-3,y-1,3,1,p.l);R(x+2,y-1,3,1,p.l);R(x,y,2,3,p.edge);
}
function feet(r,m,p,long){
 const {rect:R,line:L}=r,start=long?65:56;
 for(const [x,w]of [[21,-m.walk],[31,m.walk]]){
  R(x+w,start,4,70-start,SHADE);R(x+w+1,start,3,69-start,SKIN);R(x+w-2,69,8,3,p.d);R(x+w-1,68,5,2,SKIN);L(x+w-1,69,x+w+4,70,p.edge);L(x+w+1,69,x+w+1,70,p.accent);R(x+w-2,72,8,1,'#aaa99c');
 }
}
function arms(r,m,p,robe){
 const {line:L,rect:R,poly:P}=r,pulse=m.cast?[0,-2,1,-1][m.frame]:0;
 const hands=[[13-m.walk*.3,m.cast?46-pulse:53+m.walk*.3],[m.cast?43+pulse:40+m.walk*.3,m.cast?36+pulse:53-m.walk*.3]];
 for(const [i,[hx,hy]]of hands.entries()){
  const sx=i?36:19,ex=i?(m.cast?40:39):16-m.walk*.2,ey=i&&m.cast?41:46+m.y;
  L(sx,39+m.y,ex,ey,SHADE,5);L(sx+1,39+m.y,ex+1,ey,SKIN,4);L(ex,ey,hx,hy,SHADE,4);L(ex+1,ey,hx+1,hy,SKIN,3);
  if(robe){
   const side=i?1:-1;P([[sx-2,38+m.y],[sx+4,39+m.y],[hx+side*4,hy+5],[hx-side*3,hy+7],[ex-side*4,ey+6]],p.d);
   P([[sx,39+m.y],[sx+3,40+m.y],[hx+side*2,hy+3],[hx-side*2,hy+5],[ex-side*2,ey+3]],p.c);
   L(sx,40+m.y,ex,ey+3,p.l);L(hx-side*3,hy+5,hx+side*3,hy+4,p.edge,2);
  }else{
   // Broad shoulder bands and a small flounce belong to the one-piece suit.
   L(sx,39+m.y,ex,43+m.y,p.c,3);L(sx,39+m.y,ex,42+m.y,p.edge);
   if(m.id==='madoka')P([[sx-2,39+m.y],[sx+3,38+m.y],[ex+3,43+m.y],[ex-3,44+m.y]],p.l);
  }
  R(hx,hy,4,4,SKIN);R(hx,hy+3,3,1,SHADE);
 }return hands;
}
function swimsuit(r,m,p){
 const {poly:P,line:L,rect:R}=r,{y,walk,id}=m;
 // A high, round neckline and solid one-piece bodice under a separate swim skirt.
 P([[21,37+y],[26,36+y],[31,36+y],[36,38+y],[37,46],[34,54],[21,54],[19,46]],p.d);
 P([[23,38+y],[26,39+y],[31,39+y],[34,38+y],[35,46],[32,53],[23,53],[21,45]],p.c);
 P([[24,35+y],[28,38+y],[32,35+y],[32,38+y],[29,41+y],[25,39+y]],p.edge);
 L(22,41+y,23,50,p.l);L(34,42+y,33,50,p.d);R(20,50,16,3,p.accent);R(22,50,12,1,p.l);
 const hem=id==='madoka'?61:id==='maomao'?59:62,sway=walk*.55;
 P([[20,51],[35,51],[38+sway,hem-3],[40+sway,hem],[35+sway,hem+2],[28,hem],[20+sway,hem+2],[16+sway,hem]],p.d);
 P([[22,53],[33,53],[35+sway,hem-3],[37+sway,hem],[30,hem-1],[23,hem],[19+sway,hem]],p.c);
 for(const x of [22,27,32])L(x,53,x+sway,hem-1,p.l);
 if(id==='madoka'){
  // Two scalloped tiers with a rose-ribbon center.
  for(const [yy,width]of [[56,20],[61,25]])for(let i=0;i<width;i+=5){R(28-width/2+i+sway,yy,4,2,p.l);R(29-width/2+i+sway,yy+2,2,1,p.edge);}
  bow(r,27,43+y,p);R(27,47+y,2,2,p.edge);R(24,48+y,1,1,p.edge);R(31,48+y,1,1,p.edge);
 }else if(id==='maomao'){
  P([[24,41+y],[29,39+y],[33,42+y],[29,47],[25,45]],p.edge);L(26,42+y,29,45,p.l);
  P([[33,51],[38,49],[39,54],[34,55]],p.accent);L(36,54,38+sway,62,p.edge,2);flower(r,23+sway,56,p);
 }else{
  bow(r,27,42+y,p);for(const [x,yy]of [[24,47],[31,47],[22,56],[28,57],[34,56]])R(x+(yy>50?sway:0),yy,2,2,p.edge);
  for(const x of [17,22,27,32,37]){R(x+sway,61,3,2,p.edge);R(x+1+sway,63,1,1,p.accent);}R(27,51,3,2,p.edge);
 }
}
function bathrobe(r,m,p){
 const {poly:P,line:L,rect:R}=r,{y,walk,id}=m,sway=walk*.45;
 // Loose overlapping panels, wide sleeves, a tied obi and a modest knee-length hem.
 P([[21,36+y],[26,35+y],[32,35+y],[36,38+y],[38,48],[36,57],[40+sway,67],[34+sway,69],[28,67],[21+sway,69],[16+sway,67],[19,55],[18,45]],p.d);
 P([[22,38+y],[27,37+y],[33,38+y],[35,46],[33,55],[36+sway,65],[30,66],[24,65],[19+sway,66],[21,54],[20,46]],p.c);
 P([[24,35+y],[28,39+y],[32,35+y],[32,39+y],[28,44],[23,40+y]],p.edge);
 P([[22,37+y],[28,42],[33,48],[30,50],[24,44],[20,40+y]],p.l);L(22,38+y,31,48,p.edge);
 P([[34,37+y],[30,40],[25,48],[23,48],[28,39+y]],p.d);L(33,38+y,25,47,p.edge);
 R(19,49,18,4,p.accent);R(21,49,14,1,p.edge);bow(r,32,50,p);
 P([[33,53],[37,54],[36+sway,63],[32+sway,61]],p.accent);L(34,55,34+sway,61,p.l);
 L(25,54,22+sway,65,p.l);L(30,55,32+sway,65,p.d);L(19+sway,66,25,67,p.edge);L(30,67,37+sway,65,p.edge);
 if(id==='madoka'){flower(r,24,57,p);flower(r,31+sway,63,p);R(22,43,1,1,p.edge);R(35,46,1,1,p.edge);}
 if(id==='maomao'){
  for(const [x,yy]of [[24,57],[31,60],[22+sway,64]]){P([[x,yy-2],[x+3,yy],[x,yy+3],[x-3,yy]],p.edge);L(x-1,yy,x+1,yy+1,p.l);}
  R(20,48,3,2,p.edge);R(32,42,3,3,p.accent);R(33,42,1,1,p.edge);
 }
 if(id==='kurumi'){
  for(const [x,yy]of [[24,58],[32,63]]){R(x-2,yy-2,5,5,p.accent);R(x-1,yy-1,3,3,p.d);L(x,yy-1,x,yy,p.edge);L(x,yy,x+1,yy+1,p.edge);}
  for(const x of [18,22,26,30,34,38])R(x+sway,67,2,1,p.edge);
 }
}
function accessories(r,m,p,hands){
 const {poly:P,line:L,rect:R}=r,{id,y,cast}=m;
 if(id==='madoka'){flower(r,12,21+y,p);flower(r,43,21+y,p);bow(r,27,37+y,p);}
 if(id==='maomao'){P([[38,14+y],[41,11+y],[43,14+y],[40,17+y]],p.edge);L(37,16+y,44,10+y,p.l);}
 if(id==='kurumi'){bow(r,15,24+y,p);bow(r,38,24+y,p);R(13,28+y,2,3,p.accent);R(40,28+y,2,3,p.accent);}
 if(cast&&id==='maomao'){const [x,yy]=hands[1];R(x+1,yy-6,3,2,p.edge);R(x,yy-4,5,6,p.d);R(x+1,yy-3,3,4,'#b9d3aa');R(x+1,yy-3,1,2,'#f4f0cf');}
 if(cast&&id==='kurumi'){const [x,yy]=hands[1];R(x,yy,9,3,'#76534e');R(x+6,yy-2,5,3,'#c5a57c');R(x+10,yy-1,2,2,p.edge);R(x+1,yy+2,3,4,'#533d43');}
}
export function cuteSwimPixels(id,skinId,{frame=0,moving=false,pose='',attack=false,expression='neutral',blink=false,form=0}={}){
 if(!CUTE_SWIM_OUTFITS[id]?.some(s=>s.id===skinId))return null;
 frame=((frame%4)+4)%4;const m={id,frame,moving,pose,attack,expression,blink,form,walk:moving?[0,2,0,-2][frame]:0,y:moving?-(frame%2):0,cast:attack||!!pose},p=COLORS[id],r=raster(),robe=skinId==='bathsuit';
 drawCasualHairBack(r,id,m);feet(r,m,p,robe);const hands=arms(r,m,p,robe);if(robe)bathrobe(r,m,p);else swimsuit(r,m,p);
 drawCasualFace(r,id,m);drawCasualHairFront(r,id,m);accessories(r,m,p,hands);return outline(r.pixels,INK);
}
