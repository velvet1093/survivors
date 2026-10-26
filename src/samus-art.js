import {raster,outline} from './pixel-characters.js';

// The Varia armor uses the same palette anchors as the Gravity Suit tint map.
export function variaSuitPixels({frame=0,moving=false,pose='',attack=false,expression='neutral',blink=false}={}){
 const r=raster(),{rect:R,poly:P,line:L}=r;
 const ink='#283a46',orange='#d9954f',shade='#8c573d',light='#f1c67a',gold='#e2a450',red='#ac5854',redLight='#df8068',redDark='#713e45',joint='#334550',jointLight='#657679',cannon='#6b9877',cannonDark='#365b52',cannonLight='#afd4a4',visor='#72d5e8';
 frame=((frame%4)+4)%4;const stride=moving?[0,2,0,-2][frame]:0,bob=moving?-(frame%2):0,fire=attack||pose==='cannon';
 if(pose==='bomb'){
  P([[17,64],[13,56],[16,47],[24,42],[33,43],[40,49],[42,57],[38,66],[30,70],[22,69]],shade);
  P([[18,62],[16,55],[19,49],[25,46],[32,47],[37,51],[39,57],[35,64],[29,67],[23,66]],orange);
  P([[21,49],[25,47],[25,65],[21,63]],light);P([[32,48],[35,51],[34,64],[31,66]],gold);
  L(17,53,38,56,joint,3);L(22,47,25,67,red,2);L(32,48,31,66,red,2);R(25,54,6,6,'#78d3b1');R(27,55,2,4,'#d5f4cf');
  return outline(r.pixels,ink);
 }
 // Separate hip joints, thigh shells, kneecaps and long armored greaves.
 for(const [x,step]of [[19,-stride],[31,stride]]){
  P([[x,47],[x+7,47],[x+8+step,56],[x+6+step,61],[x+step,60],[x-2+step,55]],joint);
  P([[x,48],[x+6,48],[x+6+step,55],[x+3+step,58],[x-1+step,55]],gold);
  P([[x+1,49],[x+3,49],[x+3+step,54],[x+1+step,56]],light);
  P([[x-1+step,57],[x+5+step,56],[x+8+step,61],[x+7+step,68],[x+3+step,71],[x-2+step,69]],shade);
  P([[x+step,59],[x+5+step,58],[x+6+step,63],[x+5+step,68],[x+1+step,69],[x-1+step,67]],orange);
  P([[x+1+step,61],[x+3+step,61],[x+2+step,68],[x+step,68]],light);
  P([[x+step,55],[x+4+step,55],[x+6+step,58],[x+4+step,61],[x+step,60],[x-2+step,58]],redDark);
  P([[x+step,56],[x+3+step,56],[x+4+step,58],[x+2+step,59],[x+step,59]],red);R(x+step,57,2,1,redLight);
  P([[x+step,67],[x+5+step,67],[x+8+step,70],[x+7+step,72],[x-4+step,72],[x-4+step,70]],orange);
  L(x-3+step,70,x+2+step,69,light);R(x-3+step,72,10,1,joint);R(x+4+step,69,1,2,shade);
 }
 // Red breastplate over a narrow, articulated gold abdominal shell.
 P([[18,30+bob],[37,30+bob],[40,38+bob],[35,45],[35,50],[29,54],[21,50],[21,45],[16,37+bob]],joint);
 P([[20,30+bob],[28,32+bob],[36,30+bob],[38,35+bob],[35,39+bob],[29,41+bob],[21,38+bob],[18,34+bob]],redDark);
 P([[20,31+bob],[28,33+bob],[35,31+bob],[37,34+bob],[33,37+bob],[28,38+bob],[22,36+bob]],red);
 L(21,32+bob,27,34+bob,redLight);L(30,34+bob,35,32+bob,redLight);R(22,35+bob,3,2,shade);R(31,35+bob,3,2,shade);
 P([[23,38+bob],[28,40+bob],[33,38+bob],[34,43],[30,49],[27,50],[23,46],[21,42]],gold);
 P([[24,39+bob],[27,41+bob],[27,47],[25,46],[23,42]],light);P([[29,41+bob],[32,39+bob],[32,44],[29,48]],orange);
 L(28,40+bob,28,49,shade);L(23,42,27,44,shade);L(29,44,33,42,shade);L(24,46,27,47,shade);L(29,47,32,45,shade);
 P([[21,45],[24,47],[28,51],[33,47],[36,45],[35,50],[29,54],[22,51]],shade);
 P([[22,46],[27,49],[28,52],[23,50]],orange);P([[30,50],[34,47],[34,50],[30,53]],light);R(27,49,3,3,joint);
 // Round shoulder domes are separate plates with a bright upper rim and dark vent base.
 for(const x of [6,35]){
  P([[x,29+bob],[x+3,25+bob],[x+9,23+bob],[x+14,26+bob],[x+16,32+bob],[x+14,39+bob],[x+9,42+bob],[x+2,39+bob],[x-1,34+bob]],shade);
  P([[x+1,29+bob],[x+5,25+bob],[x+10,25+bob],[x+13,28+bob],[x+14,33+bob],[x+12,37+bob],[x+7,39+bob],[x+2,36+bob]],orange);
  P([[x+3,28+bob],[x+6,26+bob],[x+10,27+bob],[x+10,29+bob],[x+5,30+bob]],light);
  L(x+11,27+bob,x+12,31+bob,red);L(x+12,31+bob,x+10,35+bob,shade);L(x+10,35+bob,x+11,37+bob,shade);
  L(x+3,37+bob,x+10,39+bob,joint,2);L(x+4,38+bob,x+10,40+bob,jointLight);R(x+5,39+bob,5,1,joint);
 }
 // Her free hand remains a distinct gauntlet; the cannon arm keeps its own elbow joint.
 L(12,40+bob,11,47,redDark,5);L(12,40+bob,11,45,orange,3);R(10,44,4,3,joint);
 P([[8,47],[13,46],[16,49],[15,54],[11,56],[8,53]],redDark);P([[9,48],[12,48],[14,50],[13,54],[10,53]],orange);L(10,49,12,50,light);R(9,53,4,2,joint);R(12,50,1,3,shade);
 const cy=fire?39:45;
 L(43,40+bob,43,cy+2,redDark,5);R(40,40+bob,6,4,joint);R(42,40+bob,4,1,jointLight);
 P([[38,cy],[41,cy-3],[47,cy-2],[51,cy+1],[51,cy+7],[47,cy+10],[40,cy+9],[37,cy+5]],cannonDark);
 P([[39,cy],[43,cy-2],[47,cy],[49,cy+3],[48,cy+7],[43,cy+8],[39,cy+6]],cannon);
 L(40,cy,44,cy-1,cannonLight);L(40,cy+6,44,cy+7,'#83b38c');
 for(const x of [42,45,48]){R(x,cy+1,1,5,cannonDark);R(x+1,cy+1,1,1,cannonLight);}
 R(49,cy+1,4,7,cannonDark);R(52,cy+1,2,7,joint);R(53,cy+2,2,5,fire?'#e5f4b0':'#91ccb5');R(54,cy+3,1,3,fire?'#fff8d5':joint);
 // Compact red helmet with a central crest, cyan faceplate and mechanical jaw vents.
 P([[18,21+bob],[17,16+bob],[20,11+bob],[25,7+bob],[31,7+bob],[36,11+bob],[39,17+bob],[38,24+bob],[34,30+bob],[23,30+bob]],redDark);
 P([[19,20+bob],[19,16+bob],[22,12+bob],[26,9+bob],[31,9+bob],[35,12+bob],[37,17+bob],[36,24+bob],[32,28+bob],[24,28+bob]],red);
 P([[21,16+bob],[23,12+bob],[27,10+bob],[28,15+bob],[25,18+bob]],redLight);L(29,9+bob,29,18+bob,redDark);L(30,10+bob,31,15+bob,redLight);
 P([[20,18+bob],[26,20+bob],[30,20+bob],[37,18+bob],[35,24+bob],[30,27+bob],[25,25+bob],[22,23+bob]],joint);
 P([[21,19+bob],[26,21+bob],[31,21+bob],[36,19+bob],[34,23+bob],[30,25+bob],[25,23+bob],[23,22+bob]],expression==='hurt'?'#f1d199':visor);
 L(24,21+bob,28,22+bob,expression==='hurt'?'#fff1bf':'#c0f0ef');R(30,22+bob,3,1,expression==='hurt'?'#fff1bf':'#a1e7ee');
 P([[23,25+bob],[27,26+bob],[30,28+bob],[33,26+bob],[35,25+bob],[33,29+bob],[25,29+bob]],redDark);
 R(25,26+bob,2,2,redLight);R(32,26+bob,2,2,red);R(27,28+bob,4,1,jointLight);R(18,19+bob,2,5,orange);R(37,19+bob,2,5,shade);
 return outline(r.pixels,ink);
}
