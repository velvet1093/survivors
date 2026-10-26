import {raster,outline} from './pixel-characters.js';
export const RIMURU_COLORS={hair:'#9ccbdc',hairShade:'#5f8eaf',hairLight:'#d6eef0',gold:'#e5bd68',coat:'#486b97',coatShade:'#2d415e',coatLight:'#7b9fbb',scarf:'#d7cdb2',ink:'#293743'};
export function rimuruPixels({frame=0,moving=false,pose='',attack=false,expression='neutral',blink=false,skin='default',form=0}={}){
 const r=raster(),{rect:R,poly:P,line:L}=r,c=RIMURU_COLORS,ink=c.ink;frame=((frame%4)+4)%4;
 if(pose==='predator'||form==='slime'){
  const squish=moving?[0,3,0,-2][frame]:0,top=37+squish,side=squish*.6;
  P([[8-side,63],[9-side,53],[14-side,44+squish],[22,top],[32,top-1],[41+side,44+squish],[47+side,55],[48+side,65],[42,70],[15,70]],c.hairShade);
  P([[10-side,62],[12-side,53],[17-side,45+squish],[24,top+2],[32,top+1],[40+side,46+squish],[45+side,57],[45,65],[39,68],[17,68]],'#73bedb');
  P([[14,52+squish],[19,44+squish],[25,41+squish],[32,41+squish],[38,46+squish],[38,50+squish],[31,48+squish],[22,49+squish]],'#a6dfea');
  P([[13,58+squish],[15,52+squish],[19,49+squish],[21,50+squish],[18,56+squish],[16,59+squish]],'#d9f5ee');
  R(35,47+squish,4,2,'#e4f7ef');L(19,67,38,67,'#a8e0e5',1);
  const ey=57+Math.round(squish*.6),closed=blink||expression==='hurt';
  if(closed){L(17,ey,22,ey+1,ink);L(33,ey+1,38,ey,ink);}else{L(17,ey-1,19,ey+1,ink);L(19,ey+1,22,ey+1,ink);L(33,ey+1,36,ey+1,ink);L(36,ey+1,38,ey-1,ink);}
  if(expression==='focused'||expression==='ultimate'){L(17,ey-3,22,ey-2,'#43677b');L(33,ey-2,38,ey-3,'#43677b');}
  L(26,ey+5,29,ey+5,'#547e92');return outline(r.pixels,ink);
 }
 const demon=skin==='demonlord',walk=moving?[0,2,0,-2][frame]:0,y=moving?-(frame%2):0,cast=attack||pose==='spell',tone='#f2d8bd',skinShade='#c9a58e',coat=demon?'#3b3c50':c.coat,coatShade=demon?'#242c3d':c.coatShade,coatLight=demon?'#656277':c.coatLight;
 // A compact, side-parted blue bob wraps the face without hiding both eyes.
 P([[15,20+y],[17,12+y],[24,7+y],[33,8+y],[40,14+y],[42,27+y],[39,41],[32,40],[28,33],[21,40],[14,37]],c.hairShade);
 P([[17,20+y],[20,13+y],[25,10+y],[33,11+y],[38,16+y],[39,32],[35,37],[20,37],[17,32]],c.hair);
 // Boots and separate legs remain visible below both coat lengths.
 for(const [x,d]of [[19,-walk],[31,walk]]){P([[x,51],[x+7,51],[x+7+d,65],[x+d,68],[x-1+d,62]],'#313849');L(x+2,55,x+2+d,64,'#53616f',1);R(x+d-2,67,11,4,'#252f3d');R(x+d-1,67,7,2,'#657785');R(x+d-1,70,9,1,'#92a0a3');}
 // The traveller's coat has a thick scarf; the Lord's coat has a long divided hem.
 P(demon?[[19,36+y],[36,36+y],[40,45],[41+walk,65],[33,67],[28,58],[23,67],[15+walk,65],[16,47]]:[[18,37+y],[37,37+y],[40,48],[37+walk,60],[30,61],[28,56],[24,61],[17+walk,60],[16,47]],coatShade);
 P(demon?[[21,39],[27,42],[27,57],[23,64],[18+walk,63],[19,47]]:[[21,40],[27,43],[27,55],[24,58],[19+walk,57],[19,47]],coat);
 P(demon?[[30,42],[34,39],[37,47],[38+walk,63],[34,64],[30,57]]:[[30,43],[34,40],[37,47],[35+walk,58],[30,57]],coat);
 L(21,43,21,54,coatLight);L(35,44,35,53,coatLight);R(20,49,16,3,'#293b50');R(26,49,5,3,demon?c.gold:'#a5b8b4');R(27,50,3,1,'#f1deac');
 if(demon){P([[20,35+y],[24,34+y],[28,41],[32,34+y],[36,35+y],[34,42],[29,44],[23,41]],'#242b3b');L(22,39,25,45,c.gold);L(33,39,31,45,c.gold);L(26,44,25,62,'#af945e');L(30,44,32,62,'#d9ba77');R(21,44,3,2,c.gold);R(34,44,3,2,c.gold);L(19+walk,63,23,65,'#b69c66');L(34,65,38+walk,63,'#d3b375');}
 else{P([[18,35+y],[23,33+y],[34,33+y],[39,36+y],[38,42+y],[34,44],[22,43],[17,40]],'#9d9f94');P([[19,35+y],[24,34+y],[33,34+y],[38,36+y],[36,40+y],[31,42],[21,40]],c.scarf);R(22,36+y,12,3,'#eee4ca');P([[33,39],[38,39],[42+walk,54],[37+walk,55],[33,47]],c.scarf);L(37,43,40+walk,52,'#a9ae9e');R(19,37+y,3,4,'#f0e5c8');}
 // A small spell is held in the forward hand; the other arm keeps a quiet idle pose.
 L(18,39+y,cast?11:14,cast?34:51,coatShade,6);L(19,40+y,cast?12:15,cast?34:50,coat,3);R(cast?9:12,cast?31:50,5,5,tone);
 L(37,39+y,cast?45:41,cast?32:51,coatShade,6);L(37,40+y,cast?44:40,cast?33:50,coatLight,2);R(cast?43:39,cast?29:50,5,5,tone);R(cast?44:40,cast?29:50,2,2,'#ffe9ca');
 if(cast){P([[43,26],[40,23],[43,18],[45,22],[49,17],[51,24],[48,28]],'#36546e');P([[43,25],[43,21],[46,24],[49,21],[49,25],[46,27]],'#7dc6e5');R(45,23,2,3,'#d2eff0');}
 // Warm small gold eyes and a slight smile read clearly at native resolution.
 P([[18,20+y],[23,15+y],[33,16+y],[39,23+y],[36,31+y],[31,36+y],[24,35+y],[19,29+y]],skinShade);
 P([[20,21+y],[24,17+y],[32,18+y],[37,23+y],[35,30+y],[31,34+y],[24,33+y],[20,28+y]],tone);
 const closed=blink||expression==='hurt',focused=['focused','ultimate'].includes(expression);
 for(const x of [22,32]){L(x,25+y,x+3,25+y,ink);if(closed){L(x,27+y,x+3,27+y,ink);continue;}R(x,26+y,4,3,'#f5ecd5');R(x+1,26+y,2,3,c.gold);R(x+1,27+y,1,2,'#735e45');R(x+1,26+y,1,1,'#fff5cf');if(focused)R(x===22?x:x+3,25+y,1,2,ink);}
 L(26,33+y,30,33+y,'#a27b70');if(expression==='hurt')R(27,34+y,2,1,'#bd8d7e');
 // Low triangular fringe, silver-blue highlights and long ear-level locks.
 P([[16,23+y],[16,15+y],[21,10+y],[28,8+y],[35,11+y],[40,17+y],[41,27+y],[37,34+y],[35,24+y],[32,18+y],[29,24+y],[26,20+y],[22,24+y],[20,19+y],[19,31+y],[16,35+y]],c.hair);
 P([[19,17+y],[23,12+y],[28,11+y],[26,17+y],[23,21+y],[21,18+y]],c.hairLight);P([[30,12+y],[34,13+y],[37,18+y],[38,23+y],[35,20+y],[33,17+y]],'#c5e7ea');L(17,25+y,17,32+y,'#bfdee4');L(38,26+y,37,34+y,c.hairShade);
 return outline(r.pixels,ink);
}
