import {raster,outline} from './pixel-characters.js';

// Shared proportions and ink match Aura and the human/Colossal Bertholdt art.
// Individual artists still define each silhouette, outfit, anatomy and props.
export const ENEMY_INK='#29303e';
export const ENEMY_SKIN={base:'#e9c7a6',shade:'#bc927e',light:'#f6dfc3'};
const limit=(n,max)=>Math.max(-max,Math.min(max,Math.round(n)));
export function enemyArtFrame(m={}){
 const r=raster();return {r,R:r.rect,P:r.poly,L:r.line,leg:limit((m.leg||0)*.5,3),arm:limit((m.arm||0)*.5,3),tail:limit((m.tail||0)*.4,4),head:limit(m.head||0,2),attack:!!m.attack,enraged:!!m.enraged,ink:ENEMY_INK,finish:()=>outline(r.pixels,ENEMY_INK)};
}
export function enemyFace(r,{x=28,y=0,tone=ENEMY_SKIN.base,shade=ENEMY_SKIN.shade,light=ENEMY_SKIN.light,eye='#638888',mouth='#9c736a',narrow=false}={}){
 const {rect:R,poly:P,line:L}=r,dx=x-28;
 P([[18+dx,15+y],[23+dx,11+y],[31+dx,11+y],[37+dx,16+y],[36+dx,24+y],[32+dx,29+y],[28+dx,32+y],[23+dx,29+y],[19+dx,24+y]],shade);
 P([[20+dx,16+y],[24+dx,13+y],[31+dx,13+y],[35+dx,17+y],[34+dx,24+y],[31+dx,28+y],[27+dx,30+y],[23+dx,27+y],[20+dx,22+y]],tone);
 R(17+dx,20+y,3,5,tone);R(35+dx,20+y,3,5,tone);R(21+dx,18+y,2,3,light);
 for(const xx of [21+dx,30+dx]){L(xx,21+y,xx+3,21+y,ENEMY_INK);R(xx,22+y,4,narrow?1:2,'#eee9dc');R(xx+1,22+y,1,narrow?1:2,eye);}
 L(27+dx,23+y,27+dx,25+y,shade);L(25+dx,28+y,29+dx,28+y,mouth);
}
export function enemyLegs(r,{leg=0,top=49,left=20,right=31,width=6,cloth='#576379',shade='#354255',light='#8892a0',boots='#3d3b43',bootLight='#74666b'}={}){
 const {rect:R,poly:P,line:L}=r;
 for(const [x,d]of [[left,-leg],[right,leg]]){
  P([[x,top],[x+width,top],[x+width+d,62],[x+width-1+d,69],[x-1+d,68]],shade);
  P([[x+1,top+2],[x+width-1,top+2],[x+width-1+d,60],[x+width-2+d,65],[x+d,64]],cloth);
  L(x+1,top+3,x+1+d,61,light);R(x+d-1,63,width+1,7,boots);R(x+d,64,2,4,bootLight);R(x+d-3,69,width+5,3,boots);R(x+d-2,70,width+3,1,bootLight);
 }
}
export function enemyTorso(r,{top=32,bottom=51,base='#8d799d',shade='#56445e',light='#bca3c3',wide=0}={}){
 const {poly:P,line:L}=r;
 P([[19-wide,top],[24,top-2],[31,top-2],[37+wide,top+2],[39+wide,top+11],[35,bottom],[20,bottom],[16-wide,top+11]],shade);
 P([[21-wide,top+1],[25,top-1],[31,top],[35+wide,top+3],[34,bottom-3],[22,bottom-2],[19-wide,top+11]],base);
 L(22-wide,top+3,23,bottom-5,light);L(34+wide,top+5,33,bottom-5,shade);
}
export function enemyArms(r,{arm=0,attack=false,base='#8d799d',shade='#56445e',light='#bca3c3',hands=ENEMY_SKIN.base,width=4}={}){
 const {rect:R,line:L}=r,rightY=attack?40:51;
 L(18,34,13-arm,49,shade,width+1);L(18,34,14-arm,47,base,width);L(17,35,14-arm,43,light);
 L(36,34,41+arm,rightY-2,shade,width+1);L(36,34,40+arm,rightY-3,base,width);L(37,35,39+arm,rightY-5,light);
 R(11-arm,49,5,5,hands);R(39+arm,rightY,5,5,hands);
}
