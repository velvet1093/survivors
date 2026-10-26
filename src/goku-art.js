import {raster,outline} from './pixel-characters.js';
const INK='#192039',TONE='#edbd96',LIGHT='#ffdfb8',SHADE='#c8896e',WHITE='#fff4dc';
export const GOKU_HAIR={base:['#182331','#101520','#354459'],gold:['#ecd064','#ab7d32','#fff1a3'],blue:['#67c9e8','#357697','#b5f4f2']};
// The reference's cheerful face and broad sleeveless gi are kept in compact,
// stepped clusters; one forelock sits between the eyes instead of masking them.
export function gokuPixels({frame=0,moving=false,pose='',attack=false,expression='neutral',blink=false,skin='default',form=0}={}){
 frame=((frame%4)+4)%4;const r=raster(),{rect:R,poly:P,line:L}=r,stage=form||(skin==='supersaiyan'?1:0),[hair,hairShade,hairLight]=stage===4?GOKU_HAIR.blue:stage>0?GOKU_HAIR.gold:GOKU_HAIR.base,walk=moving?[0,2,0,-2][frame]:0,y=moving?-(frame%2):0,gi='#f1a14e',giShade='#ba6135',giLight='#ffd084',blue='#294b79',blueShade='#1e3153',blueLight='#6283a2',red='#bd5b5b',gather=pose==='gather',throwing=pose==='throw',cast=attack||throwing,focused=cast||['focused','ultimate'].includes(expression),hurt=expression==='hurt';
 // An asymmetric crown: the large left sweep, center spike and right fans.
 if(stage===3){P([[15,16+y],[20,7+y],[30,3+y],[38,9+y],[43,23+y],[42,34],[48,45],[39,43],[43,52],[34,48],[31,54],[24,45],[16,50],[11,44],[16,34],[9,36],[13,25]],hairShade);P([[18,16+y],[24,8+y],[31,7+y],[36,13+y],[39,25+y],[37,34],[43,42],[35,40],[38,47],[31,44],[29,48],[23,39],[18,44],[20,33],[14,34]],hair);L(38,27,40,38,hairLight);L(18,28,16,39,hairLight);}
 else {P([[16,26+y],[6,20+y],[14,16+y],[5,11+y],[18,12+y],[13,3+y],[25,9+y],[29,1+y],[33,10+y],[41,4+y],[39,14+y],[51,11+y],[43,20+y],[51,22+y],[39,28+y],[32,32+y],[22,31+y]],hairShade);P([[15,22+y],[10,20+y],[20,17+y],[11,13+y],[22,15+y],[18,8+y],[27,13+y],[29,7+y],[32,16+y],[38,10+y],[35,20+y],[44,16+y],[38,25+y],[32,29+y],[22,28+y]],hair);L(10,14+y,19,16+y,hairLight);L(31,10+y,32,15+y,hairLight);}
 // Baggy orange trousers with tapered ankles, blue boots and red piping.
 for(const [x,d]of [[18,-walk],[31,walk]]){
  P([[x,50],[x+9,50],[x+10+d,57],[x+7+d,65],[x+d,65],[x-2+d,58]],giShade);P([[x+1,51],[x+7,51],[x+7+d,58],[x+4+d,63],[x+1+d,62],[x-1+d,57]],gi);L(x+2,53,x+3+d,57,giLight);L(x+7,54,x+4+d,61,giShade);L(x+d,61,x+4+d,63,giLight);
  P([[x+d,64],[x+7+d,64],[x+7+d,68],[x+10+d,71],[x-2+d,71],[x-1+d,67]],blueShade);R(x+d,65,6,4,blue);L(x+1+d,65,x+1+d,69,red);L(x+d,69,x+7+d,70,red);R(x+d-1,71,10,1,'#bec9c7');R(x+2+d,64,4,1,'#e0bd7c');
 }
 // Wide shoulders and bare upper arms, with a small blue undershirt at the V.
 P([[18,37+y],[23,35+y],[34,35+y],[40,38+y],[39,47],[35,53],[20,53],[16,45]],giShade);P([[19,38+y],[24,36+y],[28,42],[32,36+y],[38,39+y],[36,48],[32,52],[21,51],[18,44]],gi);P([[20,38+y],[24,37+y],[27,43],[23,49],[20,48],[18,42]],giLight);P([[32,37+y],[37,40+y],[34,48],[29,51],[26,47]],giShade);P([[24,35+y],[33,35+y],[29,43]],blueShade);P([[26,36+y],[32,36+y],[29,40]],blue);P([[25,34+y],[32,34+y],[30,37+y],[27,37+y]],TONE);L(23,38+y,27,43,giShade);L(27,43,24,48,giLight);
 R(20,50,16,4,blueShade);R(21,50,13,2,blue);R(25,51,6,1,blueLight);P([[31,51],[35,52],[38,61],[34,60]],blue);P([[32,53],[34,53],[35,60],[33,59]],blueLight);P([[30,51],[33,53],[31,57],[29,55]],blueShade);
 // The chest badge stays small enough to read as cloth, with a dark glyph.
 R(32,41+y,6,6,'#f2e1bc');R(33,42+y,4,4,INK);R(34,42+y,1,4,'#f2e1bc');R(33,43+y,4,1,'#f2e1bc');
 const lx=gather?7:cast?35:13,ly=gather?16:cast?42:49,rx=gather?48:cast?48:43,ry=gather?16:throwing?33:cast?40:48;
 L(17,40+y,lx,ly-3,SHADE,7);L(38,40+y,rx,ry-3,TONE,7);L(18,40+y,lx+1,ly-4,TONE,4);L(39,40+y,rx+1,ry-4,LIGHT,4);L(16,41+y,lx,ly-5,LIGHT,2);L(38,41+y,rx,ry-5,SHADE,1);R(lx-1,ly-3,6,4,blue);R(rx-1,ry-3,6,4,blue);R(lx-1,ly,6,5,TONE);R(rx-1,ry,6,5,LIGHT);R(lx,ly+1,3,1,LIGHT);R(rx,ry+3,4,1,SHADE);R(16,37+y,4,3,gi);R(38,37+y,3,3,giLight);
 // A wider cheek/jaw and visible ears support the reference's friendly smile.
 P([[17,25+y],[13,23+y],[14,30+y],[19,32+y]],TONE);P([[38,25+y],[42,23+y],[42,30+y],[37,32+y]],TONE);R(15,25+y,2,3,SHADE);R(39,25+y,2,3,SHADE);
 P([[18,20+y],[23,16+y],[34,17+y],[39,22+y],[39,30+y],[36,35+y],[30,39+y],[24,37+y],[19,33+y],[16,27+y]],TONE);P([[21,22+y],[33,19+y],[37,23+y],[37,30+y],[33,35+y],[29,37+y],[23,34+y],[20,29+y]],LIGHT);L(19,29+y,21,33+y,SHADE);L(21,33+y,25,36+y,SHADE);
 const brow=stage===3?TONE:hairShade,iris=stage>0?'#3f9691':INK,closed=blink||hurt;
 if(closed){L(20,28+y,25,29+y,INK);L(31,29+y,36,28+y,INK);}
 else if(focused){P([[20,26+y],[25,27+y],[25,31+y],[20,30+y]],WHITE);P([[31,27+y],[36,26+y],[36,30+y],[31,31+y]],WHITE);L(20,26+y,25,27+y,INK);L(31,27+y,36,26+y,INK);R(24,27+y,1,4,iris);R(31,27+y,1,4,iris);}
 else{P([[20,27+y],[21,25+y],[24,25+y],[26,27+y],[26,31+y],[20,31+y]],WHITE);P([[31,27+y],[32,25+y],[35,25+y],[37,27+y],[37,31+y],[31,31+y]],WHITE);R(23,27+y,2,4,iris);R(32,27+y,2,4,iris);L(21,25+y,24,25+y,INK);L(32,25+y,35,25+y,INK);}
 if(focused){L(20,23+y,25,25+y,brow);L(31,25+y,36,23+y,brow);}else{L(20,23+y,24,22+y,brow);L(32,22+y,36,23+y,brow);}R(28,30+y,1,2,SHADE);R(27,32+y,2,1,TONE);L(20,32+y,22,32+y,TONE);L(35,32+y,37,31+y,TONE);
 if(hurt){R(26,35+y,6,2,'#925d58');R(28,35+y,3,1,'#f2c1a1');}else if(focused){L(26,35+y,31,35+y,'#945e53');}else{P([[25,34+y],[33,34+y],[32,37+y],[27,37+y]],'#98654f');R(26,34+y,6,2,WHITE);R(28,36+y,3,1,'#f3b99a');}
 // A long central forelock, low side bangs and minimal black-hair highlights.
 P([[16,25+y],[12,18+y],[20,18+y],[16,11+y],[25,15+y],[27,8+y],[32,15+y],[38,9+y],[36,18+y],[45,15+y],[39,23+y],[37,27+y],[34,22+y],[32,18+y],[28,22+y],[26,26+y],[25,22+y],[23,19+y],[20,23+y],[19,29+y]],hair);P([[18,18+y],[21,20+y],[19,15+y],[25,18+y],[28,13+y],[30,18+y],[27,22+y],[26,25+y],[25,21+y],[23,18+y],[21,22+y]],hairShade);L(29,12+y,31,16+y,hairLight);L(17,19+y,20,21+y,hairLight);
 if(stage===2){P([[35,11+y],[39,3+y],[38,14+y]],hairLight);L(22,13+y,24,17+y,hairLight);}
 return outline(r.pixels,INK);
}
