import {raster,outline} from './pixel-characters.js';
export const CRIMSON_SCALE=1.18;
const INK='#302d40',PINK='#d48dac',PINK_DARK='#82456f',PINK_LIGHT='#f3bdd0',SPOT='#613c62',SKIN='#d5aa96',PALE='#f2d3ba';
function eyes(r,{y=0,blink=false,expression='neutral',doppio=false}={}){
 const {rect:R,line:L}=r,closed=blink||expression==='hurt',focus=expression==='focused'||expression==='ultimate';
 for(const x of [21,31]){L(x,27+y,x+4,26+y,INK);if(closed){L(x+1,29+y,x+4,29+y,INK);continue;}R(x+1,28+y,4,2,'#f2ead4');R(x+2,28+y,2,3,doppio?'#9cab88':'#77ae88');R(x+2,29+y,1,2,INK);R(x+2,28+y,1,1,'#eef1ce');if(focus)R(x+1,28+y,4,1,INK);}
 L(26,34+y,30,34+y,expression==='hurt'?'#b98083':'#8c656c');if(!closed&&!doppio)R(31,33+y,1,1,'#aa7880');
}
// Larger, muscular armor planes keep the Stand distinct from the smaller human sprites.
export function kingCrimsonPixels({frame=0,attack=false}={}){
 const r=raster(),{rect:R,poly:P,line:L}=r,phase=((frame%4)+4)%4,step=[0,1,0,-1][phase],red='#b54f6b',shade='#743c58',lit='#e5909e',white='#e8e6d3',grey='#aebbc0',green='#afcd79',fist=attack?[1,3,1,0][phase]:0;
 for(const [x,d]of [[18,-step],[32,step]]){P([[x,47],[x+8,47],[x+7+d,58],[x+8+d,68],[x-1+d,68],[x+d,56]],shade);P([[x+2,49],[x+6,49],[x+5+d,59],[x+6+d,66],[x+1+d,66]],red);L(x+2,51,x+6+d,58,white);L(x+6,52,x+1+d,62,white);L(x+2+d,61,x+6+d,67,white);R(x+d-3,68,12,3,white);R(x+d-2,68,9,1,grey);}
 P([[18,29],[26,27],[34,28],[40,31],[42,40],[37,49],[31,54],[23,52],[16,46],[13,37]],shade);
 P([[18,30],[26,29],[29,33],[33,29],[39,32],[39,40],[34,45],[30,43],[25,46],[18,41]],red);
 P([[19,32],[25,31],[28,34],[27,39],[21,39],[17,36]],lit);P([[31,34],[35,31],[39,33],[40,37],[35,40],[30,39]],lit);R(25,42,4,4,red);R(31,42,4,4,red);R(26,47,8,4,red);
 for(const [x,y,tx,ty]of [[18,32,34,48],[23,29,40,45],[16,39,29,52],[19,44,34,29],[22,51,40,33],[30,50,40,40]])L(x,y,tx,ty,white);
 R(23,51,13,3,white);R(28,51,4,3,green);R(25,54,9,3,shade);
 const lx=attack?8:11,ly=attack?39-fist:47,rx=attack?45+fist:43,ry=attack?33-fist:47;
 L(16,32,lx,ly-4,shade,8);L(40,32,rx-2,ry-3,red,8);L(16,32,lx+1,ly-3,lit,4);L(41,32,rx-1,ry-3,lit,4);
 L(14,34,lx+2,ly-3,white);L(42,34,rx-2,ry-2,white);L(13,39,lx+5,ly-1,white);L(41,39,rx,ry,white);
 for(const [x,y]of [[lx,ly],[rx,ry]]){P([[x-4,y-3],[x+3,y-4],[x+7,y-1],[x+7,y+6],[x+2,y+8],[x-4,y+5]],grey);P([[x-3,y-3],[x+3,y-3],[x+6,y],[x+5,y+5],[x,y+6],[x-3,y+3]],white);R(x-1,y,6,3,red);R(x,y,4,1,lit);L(x-1,y+4,x+4,y+4,shade);}
 // Thick white collar plates frame the broad red torso.
 P([[16,24],[23,26],[29,30],[35,26],[40,24],[44,29],[40,36],[34,33],[29,36],[23,33],[17,36],[12,29]],grey);P([[16,25],[23,28],[29,32],[35,28],[40,25],[42,29],[38,33],[33,31],[29,34],[24,31],[18,33],[14,29]],white);
 P([[18,13],[23,8],[33,8],[39,14],[38,24],[34,29],[24,29],[18,24]],shade);P([[20,13],[24,10],[32,10],[36,14],[36,23],[32,27],[25,27],[21,23]],red);
 P([[21,17],[27,15],[29,19],[32,15],[36,17],[34,24],[29,28],[24,25]],white);R(22,18,5,3,INK);R(31,18,5,3,INK);R(23,19,3,1,green);R(31,19,3,1,green);P([[27,20],[30,20],[32,24],[29,26],[26,24]],grey);R(26,24,7,1,shade);L(24,12,33,26,lit);L(33,12,24,25,lit);R(18,15,3,8,white);R(36,15,3,8,white);
 // Epitaph is a complete tiny face embedded high in the brow, with its own eyes.
 P([[23,8],[24,3],[29,1],[34,4],[35,10],[31,15],[25,12]],shade);P([[25,6],[29,3],[32,5],[33,10],[29,13],[25,10]],lit);R(26,7,2,1,INK);R(30,7,2,1,INK);R(27,8,1,1,green);R(30,8,1,1,green);R(28,11,3,1,white);
 return outline(r.pixels,INK);
}
export function diavoloPixels({frame=0,moving=false,pose='',attack=false,expression='neutral',blink=false,skin='default'}={}){
 frame=((frame%4)+4)%4;const r=raster(),{rect:R,poly:P,line:L}=r,doppio=skin==='doppio',walk=moving?[0,2,0,-2][frame]:0,y=moving?-(frame%2):0,cast=attack||pose==='erasure',pants=doppio?'#b6a07b':'#79558d',dark=doppio?'#786959':'#493b62',highlight=doppio?'#d8bf96':'#ab7aa8',sweater='#987aa8';
 // Diavolo's long patterned curtains form a wide, straight silhouette down to his hips.
 if(!doppio){P([[15,18+y],[18,10+y],[26,6+y],[34,8+y],[40,15+y],[41,29],[43,54],[37,58],[33,42],[23,51],[13,56],[12,44]],PINK_DARK);P([[17,17+y],[21,10+y],[28,9+y],[35,12+y],[38,19+y],[38,42],[40,52],[37,54],[33,38],[23,46],[15,51],[16,28]],PINK);L(16,29,15-walk*.3,50,PINK_LIGHT);L(38,26,39+walk*.3,49,PINK_LIGHT);}
 else{P([[16,19+y],[18,11+y],[24,7+y],[33,8+y],[39,13+y],[41,22+y],[38,33+y],[33,37+y],[21,36+y],[15,31+y],[13,23+y]],PINK_DARK);P([[17,17+y],[23,10+y],[31,10+y],[37,15+y],[39,24+y],[35,31+y],[22,31+y],[16,25+y]],PINK);}
 for(const [x,d]of [[20,-walk],[31,walk]]){P([[x,48],[x+7,48],[x+7+d,58],[x+8+d,68],[x-2+d,68],[x+d,57]],dark);P([[x+2,50],[x+6,50],[x+5+d,59],[x+6+d,66],[x+d,66],[x+1+d,57]],pants);L(x+2,52,x+3+d,62,highlight);R(x-3+d,68,12,3,INK);R(x-2+d,68,8,1,doppio?'#ba9f8b':'#ae89a9');}
 const lx=cast?(doppio?18:12):16,ly=cast?(doppio?28:41):51,rx=cast?46:41,ry=cast?39:51;
 L(20,38,lx,ly,doppio?sweater:SKIN,5);L(37,38,rx,ry,doppio?sweater:SKIN,5);if(doppio){L(lx-1,ly,lx+3,ly,'#d0a1c2',3);L(rx-1,ry,rx+3,ry,'#d0a1c2',3);}R(lx-1,ly,5,5,PALE);R(rx-1,ry,5,5,PALE);
 if(doppio){P([[22,35],[26,34],[32,34],[37,37],[36,46],[33,49],[22,49],[20,42]],sweater);P([[26,35],[28,38],[31,35],[33,40],[30,44],[26,42]],'#e6bed0');R(23,47,12,2,'#bc91b5');R(23,49,12,3,SKIN);R(23,52,12,2,dark);L(23,38,22,45,'#b999bb',2);}
 else{P([[22,35],[26,33],[33,34],[37,37],[36,47],[38,52],[21,52],[19,43]],SKIN);P([[22,35],[25,34],[29,38],[33,34],[36,36],[35,48],[37,52],[20,52],[20,43]],'#483550');P([[24,36],[29,40],[33,36],[34,44],[30,49],[24,46],[22,40]],SKIN);
  for(const [x,yy,tx,ty]of [[22,37,35,50],[26,35,36,45],[21,44,32,34],[24,50,36,38],[20,48,28,40]])L(x,yy,tx,ty,'#644066');L(23,51,35,51,'#ae7e9c',2);R(27,51,5,3,'#dac0b3');R(28,51,3,2,'#7b5b72');}
 P([[19,21+y],[24,16+y],[33,16+y],[38,22+y],[37,30+y],[32,36+y],[24,35+y],[19,29+y]],SKIN);P([[22,21+y],[26,18+y],[33,19+y],[36,24+y],[34,30+y],[30,33+y],[24,31+y],[21,26+y]],PALE);
 eyes(r,{y,blink,expression:pose==='erasure'?'ultimate':expression,doppio});
 if(doppio){
  // The curled side locks and lifted center part separate Doppio from the long-haired skin.
  P([[16,23+y],[17,15+y],[22,10+y],[28,9+y],[34,11+y],[39,17+y],[40,24+y],[36,30+y],[33,25+y],[33,18+y],[29,22+y],[26,17+y],[22,23+y],[20,31+y],[16,30+y]],PINK);
  P([[19,17+y],[23,12+y],[27,11+y],[26,17+y],[22,20+y]],PINK_LIGHT);P([[29,12+y],[33,13+y],[36,17+y],[34,21+y],[32,17+y]],PINK_LIGHT);
  P([[15,23+y],[19,21+y],[22,24+y],[21,30+y],[17,33+y],[13,29+y]],PINK_DARK);P([[16,24+y],[19,23+y],[20,26+y],[18,29+y],[15,28+y]],PINK_LIGHT);R(16,25+y,2,2,PINK);
  P([[36,22+y],[40,22+y],[43,26+y],[41,31+y],[37,32+y],[34,28+y]],PINK_DARK);P([[37,24+y],[40,24+y],[41,27+y],[38,29+y],[36,27+y]],PINK_LIGHT);R(38,25+y,2,2,PINK);
 }else{
  P([[15,24+y],[17,15+y],[23,9+y],[30,8+y],[37,12+y],[40,20+y],[38,30+y],[35,33+y],[34,22+y],[31,17+y],[28,22+y],[25,17+y],[21,24+y],[19,34+y],[16,34+y]],PINK);
  P([[19,18+y],[22,12+y],[27,11+y],[26,17+y],[22,22+y]],PINK_LIGHT);P([[29,11+y],[33,12+y],[37,17+y],[36,23+y],[33,19+y]],PINK_LIGHT);
  // Dark hollow spots read as a leopard pattern at both portrait and combat scale.
  for(const [x,yy]of [[19,15+y],[29,10+y],[35,16+y],[16,27+y],[36,29],[15,37],[38,42],[16,48],[37,50]]){R(x,yy,3,1,SPOT);R(x-1,yy+1,2,2,SPOT);R(x+2,yy+1,1,2,SPOT);R(x,yy+3,3,1,SPOT);R(x+1,yy+1,1,1,'#e4a4bb');}
 }
 return outline(r.pixels,INK);
}
