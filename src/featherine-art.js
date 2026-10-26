import {raster,outline} from './pixel-characters.js';

const INK='#30313f',HAIR='#48364f',HAIR_SHADE='#2b293a',HAIR_LIGHT='#796080',HAIR_GLINT='#ac8ba9',SKIN='#efcbbb',SKIN_LIGHT='#ffe0cc',SKIN_SHADE='#bf968d';
function memoryDevice(r,y=0,layer='back'){
 const {poly:P,line:L}=r,points=ps=>ps.map(([x,yy])=>[x,yy+y]);
 if(layer==='front'){
  // Only the lower tips cross in front of the side locks. Both taper toward
  // the cheeks; neither goes over the crown or across her eyes.
  P(points([[9,22],[12,25],[16,29],[21,33],[18,32],[12,29],[8,25]]),'#819098');
  P(points([[10,23],[13,26],[17,30],[20,32],[16,30],[11,27]]),'#f2f0e4');
  P(points([[46,22],[45,26],[41,30],[35,33],[37,30],[41,26],[43,22]]),'#819098');
  P(points([[45,23],[43,27],[39,30],[36,32],[40,28],[43,23]]),'#f2f0e4');return;
 }
 // The connecting band is concealed behind the head. The visible parts emerge
 // beside the upper hair, bow outward, and return forward along the face.
 L(16,16+y,39,16+y,'#85949d',3);L(16,16+y,39,16+y,'#dce0d8');
 P(points([[20,12],[15,13],[11,15],[8,18],[7,21],[8,24],[11,27],[15,30],[20,33],[18,30],[14,26],[12,23],[12,20],[14,17],[17,16],[20,15]]),'#819098');
 P(points([[18,14],[14,15],[11,18],[9,21],[10,24],[13,27],[19,31],[16,28],[13,24],[11,21],[13,18],[16,16],[18,15]]),'#dce0d8');
 L(13,16+y,9,20+y,'#fff7e9');L(9,22+y,12,26+y,'#f2f0e4');
 P(points([[35,13],[40,14],[44,17],[46,20],[46,23],[44,26],[41,29],[35,33],[37,29],[40,26],[42,23],[42,21],[40,18],[37,17],[35,16]]),'#819098');
 P(points([[37,15],[40,16],[43,19],[44,22],[43,25],[40,28],[36,32],[39,28],[42,24],[43,22],[41,19],[37,16]]),'#dce0d8');
 L(40,16+y,44,20+y,'#fff7e9');L(45,22+y,42,27+y,'#f2f0e4');
}
function shrineStaff(r,{y=0,moving=false,frame=0}={}){
 const {poly:P,line:L,rect:R}=r,top=moving&&frame%2?-1:0;
 // Full-height wooden staff with a forked silver crescent, rather than a cane.
 L(6,15+top,5,72,'#654b49',3);L(6,17+top,6,71,'#b0957a');R(5,69,3,4,'#8d7062');R(5,71,3,1,'#d8c3a1');
 const points=ps=>ps.map(([x,yy])=>[x,yy+top]);
 P(points([[6,19],[3,16],[1,12],[2,7],[5,3],[7,2],[5,7],[4,11],[6,14],[9,13],[11,10],[10,6],[8,3],[11,5],[14,10],[13,15],[9,19]]),'#756f8b');
 P(points([[6,17],[4,15],[3,11],[4,7],[6,4],[5,9],[6,13],[8,15],[11,13],[12,10],[11,7],[13,10],[12,14],[8,17]]),'#c9c5d4');
 L(4,8+top,3,12+top,'#f4e8de');L(11,12+top,9,15+top,'#f4e8de');R(5,17+top,5,2,'#ab94ba');R(6,19+top,3,2,'#d3bf8a');
}

function face(r,{y=0,blink=false,expression='neutral',cast=false}={}){
 const {rect:R,poly:P,line:L}=r,closed=blink||expression==='hurt',focused=cast||['focused','ultimate'].includes(expression);
 P([[19,20+y],[23,16+y],[32,16+y],[37,21+y],[36,29+y],[32,34+y],[26,35+y],[21,31+y],[18,26+y]],SKIN_SHADE);
 P([[21,21+y],[24,18+y],[32,18+y],[35,22+y],[34,29+y],[30,32+y],[25,32+y],[21,28+y]],SKIN_LIGHT);
 R(18,25+y,3,4,SKIN);R(35,25+y,3,4,SKIN);
 for(const x of [21,31]){
  L(x,25+y,x+3,25+y,INK);
  if(closed){L(x,27+y,x+3,27+y,INK);continue;}
  R(x,26+y,4,3,'#f3e5d9');R(x+1,26+y,2,3,'#9a78a5');R(x+1,27+y,1,2,'#4d3e61');R(x+1,26+y,1,1,'#ffeddc');
  if(focused)R(x,26+y,4,1,INK);
 }
 L(26,32+y,29,32+y,expression==='hurt'?'#a5727f':'#a5777b');if(!closed&&!focused)R(30,31+y,1,1,'#c19392');
}
function medal(r,x,y){const {rect:R,poly:P,line:L}=r;R(x,y,5,4,'#d6bd76');R(x+1,y+1,1,3,'#a45b79');R(x+2,y+1,1,3,'#6b8cb2');R(x+3,y+1,1,3,'#71a07b');P([[x+2,y+5],[x+4,y+7],[x+2,y+10],[x,y+7]],'#dabf76');R(x+1,y+6,2,2,'#f2dfaa');L(x+2,y+10,x+2,y+14,'#dbe4ca');}
export function featherinePixels({frame=0,moving=false,pose='',attack=false,expression='neutral',blink=false,skin='default'}={}){
 frame=((frame%4)+4)%4;
 const r=raster(),{rect:R,poly:P,line:L}=r,walk=moving?[0,2,0,-2][frame]:0,y=moving?-(frame%2):0,shrine=skin==='shrine',cast=attack||pose==='author',ultimate=pose==='author',pink='#df9ca7',pinkShade='#a66880',pinkLight='#f3bcc0',green='#83a45b',greenShade='#4e734b',greenLight='#b4c77b',gold='#d9be74';
 if(shrine)shrineStaff(r,{y,moving,frame});
 memoryDevice(r,y);
 // Long straight violet hair fans behind the sleeves and gown in separate locks.
 P([[16,18+y],[19,11+y],[26,9+y],[34,10+y],[40,17+y],[41,33],[43+walk,49],[49+walk,59],[43+walk,60],[37,53],[39+walk,65],[32,61],[29,43],[23,57],[15-walk,63],[12-walk,56],[14,37]],HAIR_SHADE);
 P([[17,20+y],[21,13+y],[28,11+y],[35,13+y],[38,19+y],[38,34],[40+walk,49],[45+walk,56],[39+walk,52],[35,43],[36+walk,58],[32,52],[29,34],[23,47],[17-walk,57],[15,52],[17,35]],HAIR);
 L(17,31,16-walk*.4,52,HAIR_LIGHT);L(37,28,39+walk*.4,48,HAIR_LIGHT);L(20,37,19-walk*.4,52,'#665071');
 // White tabi and red straps are shown under the two distinct hems.
 for(const [x,d]of [[21,-walk],[31,walk]]){
  P([[x,58],[x+5,58],[x+5+d,69],[x+3+d,72],[x-2+d,71]],'#bdbbc7');R(x+d,61,4,8,'#f0eadf');
  P([[x-1+d,69],[x+4+d,69],[x+6+d,72],[x-3+d,72]],'#9b5966');L(x+d,69,x+2+d,71,'#df9a99');R(x-2+d,72,7,1,'#d4c3a2');
 }
 if(shrine){
  // One continuous, floor-length wrap skirt. A shorter diagonal front panel
  // opens over one boot; the deep folds never split into two trouser legs.
  P([[20,44],[35,44],[38,52],[41+walk*.5,61],[43+walk,66],[37+walk*.5,69],[29,70],[22,72],[11+walk*.5,70],[12+walk*.5,64],[15,55]],'#4c293d');
  P([[21,46],[34,46],[36,54],[38+walk*.5,62],[36+walk*.5,67],[28,68],[22,70],[14+walk*.5,68],[15+walk*.5,61],[18,53]],'#8e354d');
  P([[22,47],[26,46],[24,56],[22+walk*.3,67],[17+walk*.5,68],[18,59]],'#b04e64');
  P([[27,47],[30,47],[29,57],[27,68],[23,69],[25,57]],'#a64359');
  P([[31,47],[34,47],[37,54],[40+walk*.6,60],[43+walk,64],[39+walk*.5,66],[32,63],[27,62],[24,64],[20,67],[17+walk*.4,68],[23,61],[28,55]],'#b34c61');
  P([[32,48],[35,51],[36,56],[33,59],[29,61],[25,62],[29,56]],'#c46778');
  L(22,49,19+walk*.3,63,'#d0808b');L(28,48,26,57,'#693047');L(34,51,32,58,'#833249');
  L(18+walk*.4,68,24,64,'#dc8c94');L(27,62,32,63,'#d27c87');L(33,64,39+walk*.5,66,'#d27c87');L(14+walk*.5,69,21,71,'#a95a6b');
  P([[19,35+y],[25,33+y],[32,33+y],[38,36+y],[36,45],[20,45],[17,40+y]],'#c9cab4');
  P([[22,34+y],[27,35+y],[32,34+y],[35,37+y],[32,43],[23,43],[20,38+y]],'#f0eadb');
  P([[23,34+y],[27,38+y],[32,34+y],[34,36+y],[28,43],[21,37+y]],'#9baa78');L(24,36+y,28,40+y,'#e1dfb5');
 }else{
  // Wide off-shoulder gown: overlapping petal panels and a weighted scalloped hem.
  P([[20,42],[35,42],[39+walk*.5,53],[44+walk,66],[43+walk,71],[35,73],[28,72],[20,73],[11+walk,71],[11+walk,66],[17+walk*.5,52]],pinkShade);
  P([[22,44],[33,44],[36+walk*.5,53],[40+walk,66],[39+walk,70],[33,71],[27,69],[20,71],[14+walk,69],[15+walk,63],[20+walk*.5,51]],pink);
  P([[23,46],[27,46],[24+walk*.3,61],[22+walk*.4,69],[17+walk,68],[19+walk*.4,55]],pinkLight);
  P([[31,45],[34,47],[36+walk*.5,56],[39+walk,66],[35,68],[32,61],[30,52]],'#c17f95');
  L(14+walk,69,21,71,'#edb2b5');L(23,71,31,71,'#edb2b5');L(34,71,40+walk,69,'#edb2b5');
  // Gold diagonal sash, with narrow rainbow edge, follows the reference's hem.
  P([[15+walk*.3,52],[20,55],[27,61],[38+walk,65],[40+walk,69],[31,66],[23,61],[17+walk*.4,58],[13+walk*.3,55]],'#c3b14e');
  L(16+walk*.3,53,24,59,'#eee184',2);L(25,60,37+walk,65,'#eee184',2);L(26,63,38+walk,68,'#b56880');L(28,63,38+walk,67,'#6199a2');
  P([[20,35+y],[24,33+y],[32,33+y],[36,35+y],[37,42],[33,46],[22,45],[18,40+y]],pinkShade);
  P([[21,35+y],[26,36+y],[31,34+y],[34,36+y],[34,41],[31,44],[23,43],[20,39+y]],pinkLight);
  P([[21,35+y],[24,34+y],[29,39+y],[33,35+y],[35,36+y],[29,43],[25,41]],pink);
  L(22,34+y,28,38+y,'#9e667e');L(28,38+y,33,34+y,'#9e667e');
 }
 // Detached pink bell sleeves reveal bare shoulders and narrow wrist ties.
 const leftHand=cast?37:48,rightHand=ultimate?34:cast?39:49;
 L(18,36+y,cast?10:14,leftHand-1,SKIN,4);L(37,36+y,cast?44:41,rightHand-1,SKIN,4);
 P([[16,38+y],[20,40+y],[18,leftHand+5],[12-walk*.4,leftHand+10],[7-walk*.4,leftHand+6],[10,leftHand-1]],pinkShade);
 P([[16,40+y],[18,41+y],[16,leftHand+4],[11-walk*.4,leftHand+7],[9-walk*.4,leftHand+5],[12,leftHand]],pink);
 L(12,leftHand+2,11-walk*.4,leftHand+6,pinkLight);
 P([[36,38+y],[39,37+y],[45,rightHand-1],[50+walk*.4,rightHand+7],[46+walk*.4,rightHand+11],[39,rightHand+6]],pinkShade);
 P([[38,39+y],[40,39+y],[43,rightHand],[47+walk*.4,rightHand+6],[45+walk*.4,rightHand+8],[41,rightHand+4]],pink);
 L(43,rightHand+1,46+walk*.4,rightHand+6,pinkLight);
 R(cast?8:12,leftHand-1,4,4,SKIN_LIGHT);R(cast?43:40,rightHand-1,4,4,SKIN_LIGHT);
 L(16,38+y,19,39+y,'#9a556b');L(36,38+y,39,39+y,'#9a556b');
 // Purple obi, gold cord and a small white tassel sit over both costumes.
 P([[20,42],[35,42],[36,47],[32,49],[21,48]],'#684568');R(22,43,11,3,'#9d6f97');L(20,46,35,45,gold);R(26,44,4,4,'#e2c58c');R(27,45,2,2,'#faf0d2');L(28,48,28,54,'#b98988');R(27,53,3,3,'#efe1cc');
 // A long green stole runs over the viewer-right shoulder, with an independent tail.
 P([[33,32+y],[39,32+y],[38,43],[39+walk*.35,59],[37+walk*.35,69],[31+walk*.2,68],[31,52],[33,42]],greenShade);
 P([[34,33+y],[38,33+y],[36,43],[37+walk*.3,59],[35+walk*.3,67],[32+walk*.2,66],[33,51],[34,42]],green);
 L(35,43,34+walk*.2,63,greenLight);for(let x=31;x<38;x+=2)L(x+walk*.25,66,x+walk*.25,70,greenLight);
 medal(r,33,35+y);
 if(shrine){
  // A second, shorter scarf end fans from the back over the crimson hakama.
  P([[34,34+y],[40,30+y],[44+walk,32+y],[48+walk,42],[44+walk,46],[39,40]],greenShade);
  P([[36,34+y],[40,32+y],[42+walk,33+y],[46+walk,42],[43+walk,44],[40,39]],green);L(41+walk,34+y,44+walk,41,greenLight);
 }
 if(ultimate){
  // The Author pose suspends an open fragment/book above her palm.
  P([[4,30],[10,27],[17,29],[17,35],[11,34],[5,37]],'#d5c18c');P([[5,29],[10,28],[10,33],[5,35]],'#f2e8cc');P([[11,28],[16,29],[16,34],[11,33]],'#e0d7c0');L(6,30,9,29,'#9b809a');L(12,30,15,31,'#9b809a');R(10,25,1,2,'#e9d9a9');
 }else if(cast){
  L(9,37,14,25,'#c2b7c6',2);P([[10,31],[9,26],[12,20],[16,17],[16,24],[13,29]],'#c6a9d5');L(11,29,15,20,'#ece2ee');
 }else if(!shrine){
  // A wooden walking staff is visible at her side, ending at the foot line.
  L(43,48,43,71,'#785a49',2);L(43,48,43,68,'#b29365');R(42,46,3,4,'#c3a476');R(42,46,3,1,'#eee0b2');
 }
 if(shrine){L(7,leftHand,cast?10:13,leftHand,SKIN,3);R(4,leftHand-1,4,4,SKIN_LIGHT);R(5,leftHand,1,3,SKIN_SHADE);}
 R(24,31+y,8,5,SKIN);R(25,32+y,5,3,SKIN_LIGHT);
 face(r,{y,blink,expression,cast});
 // A low blunt fringe keeps the compact face readable below the memory ring.
 P([[17,27+y],[15,20+y],[17,13+y],[22,9+y],[29,8+y],[36,11+y],[40,17+y],[40,29+y],[37,35+y],[35,25+y],[34,19+y],[22,20+y],[20,28+y],[19,35+y],[16,35+y]],HAIR);
 P([[18,20+y],[19,14+y],[23,11+y],[29,10+y],[35,13+y],[38,18+y],[37,24+y],[34,20+y],[32,22+y],[22,23+y],[20,24+y]],HAIR_LIGHT);
 for(const x of [21,25,29,33])L(x,14+y,x-1,22+y,HAIR);
 L(22,12+y,28,10+y,HAIR_GLINT);L(35,16+y,37,20+y,'#94749b');L(18,28+y,18,34+y,'#7d5a84');
 if(shrine){P([[17,12+y],[13,7+y],[18,8+y],[21,13+y]],green);L(16,8+y,18,12+y,greenLight);R(19,13+y,2,2,'#e0c58b');}
 memoryDevice(r,y,'front');
 return outline(r.pixels,INK);
}
