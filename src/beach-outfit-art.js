import {raster,outline} from './pixel-characters.js';
import {drawCasualHairBack,drawCasualFace,drawCasualHairFront} from './casual-art.js';
import {erzaPixels} from './erza-art.js';

// Ordinary beachwear uses the same compact silhouettes and neutral action poses
// as the rest of the roster. Every suit is individually cut and patterned.
import {BEACH_OUTFITS} from './beach-outfits.js';
export {BEACH_OUTFITS} from './beach-outfits.js';
const INK='#2b3042',SKIN='#ffe0c6',SKIN_SHADE='#d2a58f',WHITE='#fff1dd';
const COLORS={
 esdeath:{main:'#d7edf0',shade:'#86aac4',light:'#ffffff',trim:'#45718e',detail:'#79b5d5'},
 yuki:{main:'#b95c68',shade:'#783e59',light:'#f39e96',trim:'#f3d493',detail:'#ead09d'},
 samus:{main:'#e8a057',shade:'#a96344',light:'#ffcf89',trim:'#3d6d90',detail:'#95d4dc'},
 erza:{main:'#cc6176',shade:'#873d5c',light:'#f5a8ad',trim:'#f7e7d7',detail:'#81a375'},
 frieren:{main:'#dce4d5',shade:'#99b1aa',light:'#fff7e3',trim:'#9a83b0',detail:'#c8b0ce'},
 featherine:{main:'#a28bb7',shade:'#635078',light:'#decae6',trim:'#c9d69d',detail:'#e2d19f'},
};
function flower(r,x,y,petal,center){const {rect:R}=r;R(x-2,y,5,1,petal);R(x,y-2,1,5,petal);R(x-1,y-1,3,3,petal);R(x,y,1,1,center);}
function star(r,x,y,c){r.line(x-2,y,x+2,y,c);r.line(x,y-2,x,y+2,c);r.rect(x-1,y-1,3,3,c);}
function rearHair(r,id,m){
 if(id!=='erza'){drawCasualHairBack(r,id,m);return;}
 const {poly:P,line:L}=r,{y,walk}=m;
 P([[17,18+y],[21,10+y],[32,9+y],[38,16+y],[40,34],[43+walk,49],[40+walk,58],[34,53],[31,42],[24,48],[17-walk,57],[12-walk,54],[15,40]],'#672b40');
 P([[18,21+y],[23,13+y],[32,12+y],[36,19+y],[37,35],[40+walk,48],[38+walk,53],[34,47],[30,36],[23,44],[17-walk,52],[15-walk,51],[18,35]],'#b34250');
 L(18,31,16-walk*.5,48,'#d45a5e');L(37,28,39+walk*.5,48,'#f28a78');
}
function legs(r,m,c){
 const {poly:P,rect:R,line:L}=r;
 for(const [x,step]of [[21,-m.walk],[31,m.walk]]){
  P([[x,52],[x+5,52],[x+4+step,66],[x+3+step,70],[x-1+step,70]],SKIN_SHADE);
  P([[x+1,53],[x+4,53],[x+3+step,65],[x+3+step,68],[x+step,68]],SKIN);
  R(x-2+step,69,8,3,c.shade);R(x-1+step,68,6,2,SKIN);L(x-1+step,69,x+4+step,70,c.trim);L(x+1+step,68,x+1+step,70,c.trim);L(x-2+step,72,x+5+step,72,'#b7afa6');
 }
}
function arms(r,m,c,robe){
 const {line:L,rect:R}=r,{walk,y,cast,frame}=m,pulse=cast?[0,-2,1,-1][frame]:0;
 const hands=[[14-walk*.3,cast?47-pulse:53+walk*.4],[cast?43+pulse:40+walk*.3,cast?35+pulse:53-walk*.4]];
 for(const [i,[hx,hy]]of hands.entries()){
  const sx=i?36:19,ex=i?(cast?40:39):16-walk*.2,ey=i&&cast?41:46+y;
  L(sx,39+y,ex,ey,robe?c.shade:SKIN_SHADE,5);L(sx+1,40+y,ex+1,ey,robe?c.main:SKIN,3);
  L(ex,ey,hx,hy,robe?c.shade:SKIN_SHADE,4);L(ex+1,ey,hx+1,hy,robe?c.main:SKIN,3);
  if(robe){L(sx+1,40+y,ex+1,ey,c.light);L(hx-1,hy-1,hx+3,hy-1,c.trim,2);}
  R(hx,hy,4,4,SKIN);R(hx,hy+3,3,1,SKIN_SHADE);
 }return hands;
}
function bikini(r,id,m,c){
 const {poly:P,rect:R,line:L}=r,{y,walk}=m;
 // Straight athletic torso, shoulder straps, a separate swim top and high-waist
 // bottoms keep the two-piece shape readable without anatomical contours.
 P([[23,35+y],[32,35+y],[35,41],[34,51],[22,51],[21,41]],SKIN_SHADE);
 P([[24,36+y],[31,36+y],[33,41],[32,51],[23,51],[23,41]],SKIN);
 const bandeau=id==='samus',halterneck=id==='yuki';
 if(halterneck){L(26,36+y,22,42,c.trim,2);L(30,36+y,34,42,c.trim,2);}
 else{L(22,37+y,23,43,c.trim,2);L(33,37+y,33,43,c.trim,2);}
 P([[21,40+y],[35,40+y],[35,45],[33,47],[22,46],[20,43]],c.shade);
 P([[22,41+y],[34,41+y],[34,44],[31,45],[23,45],[21,43]],c.main);
 L(22,41+y,33,41+y,c.light);L(22,45,33,45,c.trim);
 if(bandeau){R(23,42,10,1,c.trim);R(27,42,3,2,c.detail);}
 else if(id==='esdeath'){flower(r,27,43,c.trim,c.light);R(32,43,1,1,c.light);}
 else if(id==='yuki'){star(r,28,43,c.trim);}
 else{flower(r,24,43,c.light,c.detail);flower(r,32,43,c.light,c.detail);}
 P([[21,50],[35,50],[36,54],[32,59],[28,57],[24,59],[20,54]],c.shade);
 P([[22,51],[34,51],[34,54],[31,57],[28,55],[24,57],[22,54]],c.main);
 L(22,51,33,51,c.trim);L(23,54,25,56,c.light);L(31,56,33,54,c.light);
 if(id==='esdeath'){
  // A light side sarong drapes from one hip, keeping the rest of the suit clear.
  P([[33,50],[37,52],[38+walk*.3,59],[35+walk*.3,63],[32,59]],c.shade);
  P([[34,52],[36,53],[36+walk*.3,59],[34+walk*.3,61],[33,58]],c.light);flower(r,35,52,c.trim,c.light);
 }else if(id==='yuki'){R(21,51,2,3,c.trim);L(22,54,20-walk*.3,58,c.trim);L(22,54,24-walk*.3,58,c.light);}
 else if(id==='samus'){R(29,52,4,2,c.trim);R(30,52,2,1,c.detail);}
 else{for(const [x,yy]of [[23,52],[29,54],[33,52]]){R(x,yy,2,2,c.light);R(x+1,yy,1,1,c.detail);}}
}
function onePiece(r,id,m,c){
 const {poly:P,rect:R,line:L}=r,{y,walk}=m;
 L(23,36+y,23,42,c.trim,2);L(32,36+y,32,42,c.trim,2);
 P([[23,38+y],[32,38+y],[36,43],[34,52],[34,56],[30,59],[28,56],[25,59],[21,56],[22,50],[20,43]],c.shade);
 P([[24,39+y],[31,39+y],[33,43],[32,50],[32,54],[30,56],[28,53],[25,56],[23,54],[24,48],[22,43]],c.main);
 P([[24,39+y],[28,42+y],[32,39+y],[32,42],[28,45],[23,42]],c.trim);L(24,44,24,51,c.light);
 if(id==='samus'){
  P([[24,43],[27,45],[27,51],[24,54],[22,52]],c.trim);P([[32,43],[29,45],[29,51],[32,54],[34,52]],c.trim);R(27,46,3,3,c.detail);L(25,53,30,53,c.light);
 }else if(id==='esdeath'){
  star(r,28,46,c.trim);L(22,51,33,51,c.light);P([[22,51],[34,51],[36+walk*.3,56],[32,58],[28,57],[23,58],[20+walk*.3,56]],c.main);L(23,56,33,56,c.light);
 }else if(id==='frieren'){
  // A flared two-tier swim dress and scalloped white frills.
  P([[21,49],[35,49],[37+walk*.4,56],[39+walk*.4,60],[34,63],[28,61],[22,63],[17+walk*.4,60]],c.shade);
  P([[22,50],[34,50],[35+walk*.4,55],[37+walk*.4,59],[32,60],[27,58],[21,61],[19+walk*.4,59]],c.main);
  for(const [x,yy]of [[20,54],[25,55],[30,55],[35,54],[19,60],[24,61],[30,61],[35,60]]){R(x+walk*.3,yy,3,2,c.light);R(x+walk*.3+1,yy+2,1,1,c.trim);}flower(r,28,44,c.trim,c.light);
 }else if(id==='featherine'){
  P([[21,50],[35,50],[37+walk*.4,56],[39+walk*.4,61],[34,64],[28,61],[22,64],[17+walk*.4,61],[19,55]],c.shade);
  for(const [x,yy]of [[22,52],[27,51],[32,52]])P([[x,yy],[x+4,yy],[x+5+walk*.3,59],[x+2,62],[x-1+walk*.3,59]],x===27?c.light:c.main);
  L(21,51,34,51,c.trim);R(27,50,3,3,c.detail);flower(r,28,45,c.trim,c.light);
 }
}
function robe(r,id,m,c){
 const {poly:P,rect:R,line:L}=r,{y,walk}=m,short=id==='frieren',length=short?63:id==='featherine'?69:66;
 P([[20,36+y],[25,34+y],[31,34+y],[37,37+y],[37,48],[39+walk*.4,length-5],[40+walk*.4,length],[32,length+2],[26,length],[18,length+2],[15+walk*.4,length-1],[19,49],[17,42]],c.shade);
 P([[22,37+y],[26,36+y],[31,36+y],[34,39+y],[34,48],[36+walk*.4,length-5],[37+walk*.4,length-1],[30,length],[25,length-2],[19+walk*.4,length],[18,55],[21,46],[20,41]],c.main);
 P([[24,35+y],[28,39+y],[32,35+y],[34,37+y],[28,44],[21,38+y]],WHITE);L(23,37+y,29,43,c.trim);L(31,36+y,25,46,c.trim,2);
 R(20,49,16,4,c.trim);L(21,50,34,50,c.light);P([[28,49],[25,47],[23,49],[26,52],[31,52],[34,49],[32,47]],c.shade);R(27,49,4,3,c.light);
 L(27,52,25,length-4,c.trim,2);L(30,52,32,length-3,c.trim,2);
 L(22,55,20+walk*.4,length-2,c.light);L(33,56,35+walk*.4,length-1,c.light);
 if(id==='yuki'){for(const [x,yy]of [[22,43],[32,58],[21,61]])star(r,x+walk*.2,yy,c.light);}
 if(id==='erza'){for(const [x,yy]of [[23,43],[33,58],[20,61]]){P([[x-1,yy],[x+2,yy-1],[x+3,yy+2],[x,yy+4],[x-2,yy+2]],c.light);R(x,yy-1,2,1,c.detail);R(x,yy+1,1,1,c.main);}}
 if(id==='frieren'){for(const x of [20,24,28,32,36])L(x+walk*.3,length-1,x+walk*.3+2,length-1,c.trim);flower(r,33,45,c.trim,c.light);}
 if(id==='featherine'){for(const [x,yy]of [[22,43],[32,57],[21,62]]){P([[x,yy-2],[x+3,yy],[x+2,yy+3],[x,yy+5],[x-2,yy+3],[x-3,yy]],c.trim);L(x-1,yy,x+1,yy+2,c.light);}R(32,39,3,3,c.detail);L(33,42,33,46,c.trim);}
}
function head(r,id,m){
 if(id!=='erza'){drawCasualFace(r,id,m);drawCasualHairFront(r,id,m);return;}
 const source=erzaPixels({...m,skin:'casual'});for(let y=0;y<34;y++)for(let x=12;x<=41;x++){const color=source[y*56+x];if(color)r.put(x,y,color);}
}
function accessories(r,id,m,c,hands){
 const {poly:P,rect:R,line:L}=r,{y,cast,frame,form}=m;
 if(id==='esdeath')flower(r,15,22+y,c.main,c.trim);
 if(id==='yuki'){L(17,20+y,38,20+y,c.trim);R(21,18+y,5,3,c.trim);R(30,18+y,5,3,c.trim);R(22,18+y,3,1,c.light);R(31,18+y,3,1,c.light);}
 if(id==='samus'){
  const [x,hy]=hands[1],yy=cast?hy-2:hy-3;R(x+1,yy,8,4,c.trim);R(x+7,yy+1,3,2,c.detail);L(x+2,yy,x+7,yy,c.light);flower(r,41,17+y,c.main,c.trim);
 }
 if(id==='frieren'){
  const [x,hy]=hands[1],tx=cast?49:46,ty=cast?17+[0,1,-1,2][frame]:24;
  L(x+1,hy+2,tx,ty,'#847168',3);L(x+1,hy+2,tx,ty,'#d1b99a');P([[tx,ty-8],[tx+5,ty-4],[tx+4,ty+2],[tx,ty+5],[tx-4,ty+1],[tx-5,ty-4]],'#9f759e');P([[tx,ty-6],[tx+3,ty-3],[tx+2,ty+1],[tx,ty+3],[tx-2,ty],[tx-3,ty-3]],'#e9c4dc');R(tx-1,ty-4,2,3,'#fff1dd');flower(r,14,20+y,c.trim,c.light);
 }
 if(id==='featherine'){
  // Slim silver crescent staff stays separate from her open side crescents.
  L(6,21,5,72,'#625773',3);L(6,23,6,71,'#c3aec4');P([[6,22],[2,18],[1,13],[3,7],[6,4],[5,10],[4,15],[7,18],[10,15],[10,10],[8,5],[12,9],[13,14],[11,19]],'#887a9a');P([[6,20],[3,17],[3,13],[5,8],[4,14],[7,17],[10,14],[10,10],[12,14],[10,18]],'#e7dce2');R(5,21,4,2,c.detail);R(6,69,2,3,c.detail);
 }
 if(id==='erza'){
  const index=typeof form==='number'?Math.max(0,Math.min(3,form)):0,[x,hy]=hands[1];
  if(index===2){P([[x-4,hy-7],[x+4,hy-9],[x+9,hy-4],[x+8,hy+4],[x+2,hy+9],[x-4,hy+3]],'#557a93');P([[x-2,hy-5],[x+3,hy-7],[x+7,hy-3],[x+6,hy+3],[x+2,hy+6],[x-2,hy+2]],'#b9dce0');L(x+2,hy-5,x+2,hy+5,c.trim);}
  else{const tx=cast?51:49,ty=cast?13+[0,1,-1,2][frame]:52;L(x,hy+2,tx,ty,index===1?'#795d94':'#7897a5',3);L(x,hy+1,tx,ty,index===1?'#c6afde':'#d7e9e0',2);L(x-3,hy+1,x+4,hy+3,c.trim,2);L(x,hy+3,x-2,hy+9,c.shade,2);}
  if(m.pose==='nakagami'){L(x,hy,51,10,'#e3c488',3);L(x,hy,51,10,'#fff2c9');star(r,46,16,'#ead39a');}
 }
}
export function beachOutfitPixels(id,skinId,{frame=0,moving=false,pose='',attack=false,expression='neutral',blink=false,form=0}={}){
 if(!BEACH_OUTFITS[id]?.some(outfit=>outfit.id===skinId)||(id==='samus'&&pose==='bomb'))return null;
 frame=((frame%4)+4)%4;const m={frame,moving,pose,attack,expression,blink,form,walk:moving?[0,2,0,-2][frame]:0,y:moving?-(frame%2):0,cast:attack||!!pose},c=COLORS[id],r=raster();
 const isRobe=skinId==='bathsuit'&&['yuki','erza','frieren','featherine'].includes(id);
 rearHair(r,id,m);legs(r,m,c);const hands=arms(r,m,c,isRobe);
 if(skinId==='bikini')bikini(r,id,m,c);else if(isRobe)robe(r,id,m,c);else onePiece(r,id,m,c);
 head(r,id,m);accessories(r,id,m,c,hands);return outline(r.pixels,INK);
}
