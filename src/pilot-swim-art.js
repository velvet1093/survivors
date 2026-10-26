import {raster,outline,pilotPixels} from './pixel-characters.js';

// Ordinary swim-team clothing and wrap robes for the three female EVA pilots.
// Their canonical faces, glasses and hair remain separate from each unit's armor.
import {PILOT_SWIM_OUTFITS} from './pilot-swim-outfits.js';
export {PILOT_SWIM_OUTFITS} from './pilot-swim-outfits.js';
const byId=new Map(PILOT_SWIM_OUTFITS.map(look=>[look.id,look]));
const SKIN='#ffe2c6',SKIN_SHADOW='#d7ac96',INK='#293347';
function blossom(r,x,y,petal,center){r.rect(x-2,y,5,2,petal);r.rect(x,y-2,2,5,petal);r.rect(x,y,2,2,center);}
function hairBack(r,base,walk,bob){
 const {poly:P,line:L,rect:R}=r;
 if(base==='asuka')for(const side of [-1,1]){const x=side<0?15:39,sway=walk*side*.4;P([[x-3,18-bob],[x+2,19-bob],[x+5+sway,42],[x+2+sway,50],[x-2+sway,47],[x-3,34]],'#78463d');P([[x-2,21-bob],[x+1,23-bob],[x+3+sway,41],[x+1+sway,46],[x-1,37]],'#bd7547');L(x,25-bob,x+1+sway,42,'#e3a25e');}
 if(base==='mari')for(const [x,side]of [[16,-1],[39,1]]){const sway=walk*side*.3;L(x,24-bob,x-1+sway,49,'#443445',4);for(const yy of [31,36,41,46]){R(x-2+sway,yy,3,3,'#73504c');R(x+sway,yy+1,2,2,'#aa7b6b');}R(x-2+sway,49,4,2,'#cb7e9c');P([[x-1+sway,50],[x+2+sway,50],[x+2+sway,55],[x-2+sway,54]],'#73504c');}
}
export function pilotSwimPixels({skin,frame=0,moving=false,attack=false,pose='',expression='neutral',blink=false}={}){
 const look=byId.get(skin);if(!look)return null;
 frame=((frame%4)+4)%4;const r=raster(),{rect:R,poly:P,line:L}=r,bob=moving?frame%2:0,walk=moving?[0,2,0,-2][frame]:0,cast=attack||!!pose,robe=skin.endsWith('bathsuit'),base=look.evaBase,trim=look.neon;
 hairBack(r,base,walk,bob);
 // Swim shorts under the one-piece; wrap robes have a knee-length closed hem.
 for(const [x,sway]of [[21,-walk],[31,walk]]){
  R(x+sway,54,5,15,SKIN_SHADOW);R(x+sway+1,55,3,13,SKIN);L(x+sway+1,60,x+sway+1,66,'#f7dbc1');
  P([[x-1,51],[x+6,51],[x+6+sway,58],[x-1+sway,58]],look.shade);R(x+sway,53,5,4,look.armor);L(x+sway,57,x+sway+4,57,trim);
  R(x+sway-1,68,8,3,look.shade);R(x+sway,67,5,2,SKIN);L(x+sway,68,x+sway+5,70,trim);R(x+sway-1,71,8,1,'#b1afa1');
 }
 const pulse=cast?[0,2,-1,1][frame]:0,hands=[[14-walk*.3,53+walk*.3],[cast?43+pulse:40+walk*.3,cast?39-pulse:53-walk*.3]];
 for(const [i,[hx,hy]]of hands.entries()){
  const sx=i?35:19,ex=i?(cast?40:38):16-walk*.2,ey=i&&cast?43:46-bob;
  L(sx,39-bob,ex,ey,robe?look.shade:SKIN_SHADOW,6);L(sx+1,40-bob,ex+1,ey,robe?look.armor:SKIN,4);
  L(ex,ey,hx,hy,robe?look.shade:SKIN_SHADOW,4);L(ex+1,ey,hx+1,hy,robe?look.armor:SKIN,3);
  if(robe)L(hx-1,hy-1,hx+4,hy-1,look.light,2);
  R(hx,hy,4,4,SKIN);R(hx,hy+3,3,1,SKIN_SHADOW);
 }
 if(robe){
  // Broad crossed lapels, tied sash and a closed swinging robe skirt.
  P([[20,36-bob],[25,36-bob],[28,39-bob],[32,36-bob],[36,38-bob],[37,49],[39+walk*.3,64],[34,67],[28,66],[21,67],[17+walk*.3,64],[19,48]],look.shade);
  P([[21,38-bob],[26,39-bob],[29,42-bob],[33,38-bob],[35,40],[34,51],[36+walk*.3,63],[30,64],[24,63],[19+walk*.3,65],[21,49]],look.armor);
  P([[23,36-bob],[28,40-bob],[34,36-bob],[34,40-bob],[28,47],[22,40-bob]],look.light);L(23,37-bob,30,45,look.shade,2);L(33,37-bob,25,46,look.armor,2);
  R(20,48,16,5,trim);L(21,49,34,49,look.light);P([[31,50],[37,48],[39,51],[35,54]],look.shade);P([[32,51],[37,50],[37,52],[33,53]],look.light);L(35,53,37+walk*.3,61,trim,2);
  L(25,54,23+walk*.3,63,look.light);L(31,55,33+walk*.3,64,look.shade);L(20+walk*.3,65,25,66,look.light);
  if(base==='rei'){L(21,57,34,59,look.light);L(21,60,35,62,look.light);R(24,55,2,1,trim);}
  else{blossom(r,base==='asuka'?24:31,58,look.light,trim);blossom(r,base==='asuka'?31:23,62,trim,look.light);}
 }else{
  // A fitted but plain athletic one-piece with straight coverage and team panels.
  P([[22,36-bob],[26,36-bob],[28,39-bob],[31,36-bob],[34,37-bob],[36,44],[34,51],[35,55],[21,55],[22,50],[20,43]],look.shade);
  P([[23,38-bob],[27,39-bob],[31,38-bob],[33,39-bob],[34,44],[31,50],[33,53],[23,53],[24,49],[22,43]],look.armor);
  P([[24,37-bob],[27,39-bob],[30,39-bob],[32,37-bob],[32,40-bob],[28,43-bob],[24,40-bob]],look.light);
  L(22,40-bob,24,49,look.light,2);L(33,40-bob,31,49,look.light,2);R(22,50,13,3,trim);L(23,52,33,52,look.light);
  if(base==='rei'){P([[26,43],[31,43],[33,46],[30,48],[25,47]],'#5c9eb3');R(27,44,3,1,look.light);R(28,46,2,1,trim);}
  if(base==='asuka'){R(26,42,4,6,trim);R(24,44,8,2,trim);R(27,43,2,1,look.light);R(31+walk,54,3,2,look.light);}
  if(base==='mari'){blossom(r,28,45,look.light,trim);R(31+walk,54,3,1,trim);L(26,42,26,48,look.shade);}
 }
 // Copy only the canonical head, retaining each pilot's face, eye and hair shapes.
 const head=pilotPixels({skin:base,expression,blink});
 for(let y=0;y<39;y++)for(let x=10;x<45;x++)if(y<37||(x>=21&&x<=35)){const color=head[y*56+x];if(color)r.put(x,y-bob,color);}
 if(base==='asuka'){blossom(r,16,18-bob,robe?look.light:trim,look.armor);blossom(r,39,18-bob,robe?look.light:trim,look.armor);}
 if(base==='rei'){R(16,19-bob,3,2,robe?trim:'#f2e6c6');R(17,18-bob,1,4,look.light);}
 if(base==='mari'){R(15,18-bob,4,2,trim);R(37,18-bob,4,2,trim);}
 return outline(r.pixels,INK);
}

/** Dress the existing articulated EVA with each pilot's matching water theme. */
export function paintPilotEvaSwim(r,look,{frame=0,moving=false,pose='',attack=false,bob=moving?frame%2:0,step=moving?[0,2,0,-2][frame]:0}={}){
 if(!byId.has(look.id))return false;
 const {rect:R,poly:P,line:L}=r,base=look.evaBase,robe=look.id.endsWith('bathsuit'),trim=look.neon,deep=look.shade;
 for(const x of [13,40]){R(x,29-bob,3,10,look.armor);R(x,29-bob,1,7,look.light);R(x,35-bob,3,2,trim);}
 // Individual eye layouts remain readable through sealed swim-mask plates.
 if(base==='rei'){
  P([[23,18-bob],[33,18-bob],[36,22-bob],[32,27-bob],[24,27-bob],[21,23-bob]],deep);R(25,20-bob,7,5,look.light);R(27,21-bob,3,3,'#78bbc8');R(28,21-bob,1,2,'#c56c7d');R(25,19-bob,6,1,trim);
 }else{
  P([[21,19-bob],[35,19-bob],[38,24-bob],[35,29-bob],[21,29-bob],[18,24-bob]],deep);
  const xs=base==='mari'?[21,26,31]:[22,30];for(const x of xs)for(const y of [22,26]){R(x,y-bob,base==='mari'?3:5,2,look.light);R(x+1,y-bob,1,1,trim);}
  L(20,19-bob,35,19-bob,trim);
 }
 if(robe){
  P([[20,35-bob],[25,35-bob],[28,39],[32,35-bob],[36,37],[36,46],[39,58],[35,60],[29,57],[23,60],[17,57],[20,46]],deep);
  P([[21,37-bob],[25,38-bob],[28,42],[33,37-bob],[35,39],[33,47],[36,56],[31,56],[28,53],[22,57],[20,55],[23,46]],look.armor);
  L(23,35-bob,30,43,look.light,2);L(33,35-bob,25,45,look.light,2);R(20,46,16,4,trim);L(21,47,34,47,look.light);P([[33,47],[38,45],[39,49],[35,52]],look.light);L(35,51,38,57,trim,2);
  L(24,50,22,56,look.light);L(32,51,34,56,deep);R(25,43,6,2,deep);
 }else{
  P([[21,35-bob],[25,35-bob],[28,39],[32,35-bob],[36,38-bob],[34,46],[29,50],[23,47],[20,39]],look.light);
  P([[24,37-bob],[28,40],[32,37-bob],[33,42],[29,47],[25,45]],look.armor);R(26,40,5,2,trim);R(28,42,2,3,trim);
  R(21,50,15,4,deep);L(22,50,34,50,trim);R(23,54,3,6,look.armor);R(31,54,3,6,look.armor);
  // Compact snorkel follows the head, while the mask keeps the unit's own optics.
  L(38,26-bob,40,27-bob,look.light,2);L(40,27-bob,40,15-bob,trim,2);L(40,15-bob,44,15-bob,trim,2);R(43,14-bob,3,3,deep);
 }
 for(const [x,v]of [[20,-step],[31,step]]){
  R(x+v,59,5,6,deep);L(x+v+1,60,x+v+1,64,look.light);
  P([[x+v-2,65],[x+v+5,65],[x+v+9,70],[x+v+8,72],[x+v-3,72]],robe?look.armor:trim);L(x+v,67,x+v+5,70,look.light);L(x+v+2,67,x+v+7,70,look.light);
 }
 return true;
}
