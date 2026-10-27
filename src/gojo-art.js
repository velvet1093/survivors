import {canvas,motion,selout,mix,head,eye} from './hero-kit.js';
// Satoru Gojo. Shared features: tall white hair, pale skin and a confident half smile.
//  High Collar: spiky upswept hair, the black blindfold and a black uniform with a tall
//   standing collar, picked out in sharp purple highlights.
//  Unsealed: the blindfold off, hair falling over the brow and glowing blue Six Eyes.
//  Female Gojo: long white hair, round sunglasses pushed up on the head, blue eyes and a
//   navy high-collared uniform dress with long sleeves and dark stockings.
//  Summer Shades: round dark shades, a light-blue shirt with rolled sleeves, navy belt and
//   hip pouch, grey trousers and navy sneakers.
//  Six Eyes Slumber: lilac pajamas printed with little eyes and a sleep mask with cartoon eyes.
//  Infinity Reef: round shades, an open sky-blue beach shirt over a white tank and navy
//   board shorts with cyan waves.
// At rest one hand is in his pocket; casting stretches the other hand forward, and the
// domain pose raises the crossed-finger Unlimited Void sign beside his face.
export const GOJO_ART={ink:'#14121c',hair:['#b4b2cc','#ececf4','#ffffff'],six:'#5ad8ff',sixDark:'#1a78c8'};
const c=GOJO_ART,SK={base:'#ffe2c6',shade:'#ebb9a0',deep:'#cf8d84',light:'#fff2e4'};
const LOOKS={
 default:{hair:'spiky',eyes:'blindfold',coat:['#0e0c14','#1c1828','#2e2840'],sheen:['#5a3a90','#8a64c8'],pants:['#0e0c14','#1c1828'],shoe:['#08080c','#4a4a58'],body:'uniform'},
 unsealed:{hair:'fallen',eyes:'six',coat:['#0e0c14','#1c1828','#2e2840'],sheen:['#5a3a90','#8a64c8'],pants:['#0e0c14','#1c1828'],shoe:['#08080c','#4a4a58'],body:'uniform'},
 female:{hair:'long',eyes:'six',coat:['#141c40','#1e2a5a','#34447a'],sheen:['#3a4c8a','#5a70b0'],pants:['#14141c','#24242e'],shoe:['#0a0a10','#3a3a48'],body:'dress'},
 casual:{hair:'spiky',eyes:'shades',shirt:['#6a8ab8','#a8c4e8','#d4e4f8'],pants:['#2e2e34','#4a4a50'],belt:'#1e2a4a',shoe:['#1a2448','#3a4a78'],body:'shirt'},
 pajamas:{hair:'spiky',eyes:'mask',shirt:['#8a7ac0','#c4b8e8','#e4dcf8'],pants:['#8a7ac0','#c4b8e8'],shoe:['#e8e8f0','#ffffff'],body:'pajamas'},
 swimsuit:{hair:'spiky',eyes:'shades',shirt:['#3a8ac0','#8ad0f0','#c8ecfa'],pants:['#141c40','#1e2a5a'],shoe:['#e0c890','#f4e4b8'],body:'beach'},
};
const shift=(pts,y)=>pts.map(([x,yy])=>[x,yy+y]);
function eyesFor(r,m,L){
 const {y,blink,expression}=m,{rect:R,line:Ln,put}=r,hurt=expression==='hurt',focus=expression==='focused'||expression==='ultimate'||m.cast;
 if(L.eyes==='blindfold'){// The black blindfold wraps the whole brow line.
  R(17,24+y,23,6,'#121216');R(17,(blink?26:25)+y,23,1,'#3a3a48');R(18,28+y,21,1,'#08080c');R(38,23+y,3,3,'#121216');return;}
 if(L.eyes==='mask'){// A sleep mask with cartoon eyes drawn on it.
  R(17,25+y,23,6,'#1a1a24');R(17,25+y,23,1,'#4a4a5a');for(const x of [21,31]){if(blink){Ln(x,28+y,x+3,28+y,'#ffffff');continue;}R(x,27+y,4,2,'#ffffff');put(x+(x<28?2:1),27+y,'#1a1a24');}Ln(21,26+y,24,26+y,'#ffffff');Ln(31,26+y,34,26+y,'#ffffff');return;}
 if(L.eyes==='shades'){// Small round dark shades.
  // Blinking dims the glint on the lenses.
  for(const x of [20,31]){R(x,27+y,6,5,'#0e1428');R(x+1,28+y,4,3,'#1e2c58');if(!blink){put(x+1,28+y,'#6a8ad0');put(x+2,28+y,'#4a6ab0');}else R(x+1,30+y,4,1,'#0e1428');}Ln(26,28+y,30,28+y,'#2a2a34');Ln(18,28+y,20,28+y,'#2a2a34');Ln(37,28+y,39,28+y,'#2a2a34');return;}
 // Six Eyes: vivid sky-blue irises under white lashes.
 for(const [x,side]of [[21,-1],[31,1]])eye(r,x,26+y,{iris:c.six,irisDark:c.sixDark,side,closed:blink,hurt,focus,lash:'#c8c8dc'});
 if(!blink&&!hurt)for(const x of [22,32])put(x,29+y,'#e8fcff');
}
function mouthFor(r,m){
 const {y,expression}=m,{rect:R,put}=r;
 if(expression==='hurt'){R(27,35+y,3,2,'#8f4f5c');return;}
 if(expression==='focused'){R(26,35+y,5,1,'#a86a6a');return;}
 if(expression==='ultimate'){R(26,34+y,5,2,'#8a4a52');R(27,34+y,3,1,'#fff4ee');return;}
 // A lopsided, self-assured smile.
 R(26,35+y,4,1,'#a86a6a');put(30,34+y,'#a86a6a');put(25,34+y,'#d8a090');
}
function hairBack(r,m,L){
 const {y,walk}=m,H=c.hair,{poly:P,line:Ln}=r;
 if(L.hair==='long'){// Long hair flowing to the waist and sweeping out to one side.
  P(shift([[15,22],[17,12],[28,9],[39,12],[42,22],[44,40],[48+walk*.5,56],[40,54],[37,40],[20,40],[18,54],[12+walk*.5,54],[14,40]],y),H[0]);
  P(shift([[16,24],[40,24],[42,40],[45+walk*.5,53],[40,51],[37,38],[19,38],[17,51],[14+walk*.5,51],[15,40]],y),H[1]);for(const [x0,x1]of [[16,14],[41,45]])Ln(x0,28+y,x1+walk*.5,50,H[2]);return;}
 P(shift([[16,30],[15,20],[20,13],[36,13],[41,20],[40,30]],y),H[0]);
}
function hairFront(r,m,L){
 const {y}=m,H=c.hair,{poly:P,line:Ln,rect:R,put}=r;
 if(L.hair==='spiky'){
  // Upswept spikes in every direction, a few falling over the band.
  const crown=[[16,27],[13,22],[16,18],[12,12],[18,13],[17,6],[23,10],[23,2],[28,8],[30,1],[33,8],[37,2],[37,10],[43,7],[40,14],[45,16],[40,20],[42,26],[40,27],[37,23],[34,25],[31,21],[28,25],[25,21],[22,25],[19,22]];
  P(shift(crown,y),H[0]);
  P(shift([[17,24],[14,19],[18,16],[14,10],[20,13],[20,5],[26,11],[30,3],[33,11],[37,5],[37,12],[43,9],[39,16],[44,18],[39,21],[36,21],[33,20],[29,22],[25,19],[21,21]],y),H[1]);
  for(const [x0,y0,x1,y1]of [[21,7,23,14],[30,4,30,12],[36,7,34,14],[15,12,19,16],[42,11,39,16],[25,13,27,17]])Ln(x0,y0+y,x1,y1+y,H[2]);
  return;}
 if(L.hair==='fallen'){// With the blindfold off the hair falls softly over the brow.
  P(shift([[15,31],[14,22],[17,15],[15,10],[21,12],[23,6],[28,10],[32,6],[35,11],[41,10],[39,16],[42,22],[41,31],[39,26],[37,22],[35,27],[32,22],[30,28],[27,22],[24,27],[21,22],[19,27],[17,32]],y),H[0]);
  P(shift([[16,29],[15,22],[18,16],[17,12],[22,13],[24,8],[28,12],[32,8],[34,13],[39,12],[38,17],[40,22],[40,28],[38,24],[35,24],[32,21],[29,25],[26,21],[23,25],[20,22],[18,27]],y),H[1]);
  for(const [x0,y0,x1,y1]of [[19,14,24,10],[29,11,33,9],[22,17,21,23],[33,17,35,23],[27,15,28,21]])Ln(x0,y0+y,x1,y1+y,H[2]);
  return;}
 // Female Gojo: a long side-swept fringe and round sunglasses resting on the head.
 P(shift([[15,30],[15,19],[19,13],[28,10],[37,13],[41,19],[41,31],[38,25],[35,22],[30,24],[25,20],[21,24],[19,28],[17,33]],y),H[1]);
 for(const [x0,y0,x1,y1]of [[19,15,26,12],[29,12,36,15],[22,20,20,26],[36,20,39,28]])Ln(x0,y0+y,x1,y1+y,H[2]);
 for(const x of [20,30]){R(x,11+y,7,5,'#0e1428');R(x+1,12+y,5,3,'#1e2c58');put(x+1,12+y,'#6a8ad0');}Ln(27,12+y,29,12+y,'#2a2a34');R(25,12+y,1,1,'#2a2a34');
}
function legs(r,m,L,{top=54,bare=false,shorts=0,stocking=false}={}){
 const {walk}=m,{rect:R,line:Ln}=r;
 for(const [i,x]of [[0,22],[1,30]]){const d=i?walk:-walk;
  if(bare||shorts){R(x+d*.5,top,5,67-top,SK.base);R(x+4+d*.5,top,1,67-top,SK.shade);}
  if(shorts){R(x-1+d*.4,top-2,7,shorts,L.pants[1]);R(x-1+d*.4,top-2,7,1,L.pants[0]);for(const yy of [top,top+3])Ln(x+d*.4,yy,x+5+d*.4,yy+1,'#5ad0f0');}
  if(stocking){R(x+d*.5,top+4,5,63-top,L.pants[1]);R(x+d*.5,top+4,5,1,L.pants[0]);}
  if(!bare&&!shorts&&!stocking){R(x+d*.5,top,5,67-top,L.pants[1]);R(x+4+d*.5,top,1,67-top,L.pants[0]);if(L.sheen)Ln(x+1+d*.5,top+2,x+1+d*.5,top+9,L.sheen[0]);}
  R(x-1+d*.5,67,7,3,L.shoe[0]);R(x+d*.5,67,4,1,L.shoe[1]);R(x-1+d*.5,69,7,1,mix(L.shoe[0],'#000000',.5));
 }
}
function torso(r,m,L){
 const {y}=m,{poly:P,rect:R,line:Ln,put}=r;
 if(L.body==='uniform'||L.body==='dress'){
  const hem=L.body==='dress'?58:55,C=L.coat;
  P(shift([[18,37],[38,37],[40,hem],[16,hem]],y*0),C[0]);P(shift([[19,38],[37,38],[39,hem-1],[17,hem-1]],0),C[1]);
  // Sharp purple folds catching the light, as on the reference uniform.
  for(const [x0,y0,x1,y1]of [[20,40,25,44],[33,39,37,42],[22,47,27,46],[31,50,36,49],[19,52,22,54],[34,45,38,47]])Ln(x0,y0,x1,y1,L.sheen[1]);Ln(21,41,21,50,L.sheen[0]);
  Ln(28,39,28,hem-1,C[0]);if(L.body==='dress'){put(30,44,'#d8b04a');Ln(36,hem-4,37,hem-1,C[0]);}
  // The tall standing collar rises to the jaw.
  R(22,32+y,13,7,C[0]);R(23,33+y,11,6,C[1]);Ln(28,33+y,28,38+y,C[0]);Ln(23,33+y,33,33+y,L.sheen[0]);
  return;}
 const S=L.shirt;
 if(L.body==='shirt'){
  P([[18,37],[38,37],[39,51],[17,51]],S[0]);P([[19,38],[37,38],[38,50],[18,50]],S[1]);Ln(28,41,28,50,S[0]);Ln(20,40,21,49,S[2]);for(const yy of [43,46,49])put(29,yy,S[2]);
  // Open collar with turned-down points.
  P(shift([[25,36],[31,36],[28,41]],y),SK.base);P(shift([[22,35],[26,35],[27,40],[24,39]],y),S[2]);P(shift([[34,35],[30,35],[29,40],[32,39]],y),S[2]);
  R(17,50,22,2,L.belt);R(27,50,3,2,'#c8ccd8');R(28,51,1,1,L.belt);
  // A small navy pouch clipped at the hip.
  R(15,51,4,7,L.belt);R(16,52,2,1,'#3a4a7a');return;}
 if(L.body==='pajamas'){
  P([[18,37],[38,37],[39,52],[17,52]],S[0]);P([[19,38],[37,38],[38,51],[18,51]],S[1]);Ln(28,39,28,51,S[0]);
  P(shift([[24,36],[32,36],[28,41]],y),SK.base);Ln(24,36+y,28,41+y,S[0]);Ln(32,36+y,28,41+y,S[0]);for(const yy of [43,47])R(28,yy,1,1,'#ffffff');
  // Little blue Six Eyes printed over the fabric.
  for(const [x,yy]of [[21,41],[34,43],[22,48],[33,49]]){R(x,yy,3,2,'#ffffff');put(x+1,yy,'#3aa8e8');}return;}
 // Beach: an open sky-blue shirt over a white tank top.
 R(22,38,13,13,'#f6f6f0');R(22,38,13,1,'#d8d8d0');
 for(const side of [-1,1]){const X=d=>28+side*d;P([[X(5),36],[X(10),37],[X(11),51],[X(6),51]],S[0]);P([[X(6),37],[X(9),38],[X(10),50],[X(7),50]],S[1]);}
 for(const [x,yy]of [[19,42],[36,45],[20,48]])r.put(x,yy,'#ffffff');
}
function arms(r,m,L,look){
 const {y,walk,cast,pose}=m,{rect:R,line:Ln,put}=r,domain=pose==='domain';
 const sleeve=L.coat||L.shirt,short=L.body==='shirt'||L.body==='beach';
 const seg=(sx,sy,ex,ey,hx,hy)=>{
  Ln(sx,sy,ex,ey,sleeve[0],5);Ln(sx,sy,ex,ey-1,sleeve[1],3);if(L.sheen)Ln(sx+1,sy,ex+1,ey-1,L.sheen[1]);
  if(short){// Rolled sleeves stop at the elbow.
   R(ex-2,ey-1,5,2,sleeve[2]);Ln(ex,ey,hx,hy,SK.shade,4);Ln(ex,ey,hx,hy-1,SK.base,3);}
  else{Ln(ex,ey,hx,hy,sleeve[0],5);Ln(ex,ey,hx,hy-1,sleeve[1],3);}};
 // Left arm: relaxed at rest, the palm turned out casually.
 seg(19,39+y,16,46+y,15,52+walk*.3);R(13,52+y,4,4,SK.base);R(13,55+y,4,1,SK.shade);
 if(cast){// Right hand stretched forward with two fingers raised to cast.
  seg(37,39+y,42,38+y,46,37+y);R(45,35+y,4,4,SK.base);R(46,31+y,1,4,SK.base);R(48,31+y,1,4,SK.base);return;}
 if(domain){// The Unlimited Void sign: index finger crossed over the middle beside the face.
  seg(37,39+y,41,44+y,40,34+y);R(38,31+y,4,4,SK.base);R(39,26+y,1,5,SK.base);R(40,27+y,1,4,SK.shade);put(39,26+y,SK.light);return;}
 // Right hand tucked into the trouser pocket.
 seg(37,39+y,40,46+y,37,51+walk*.2);R(35,51,4,1,mix(L.pants?L.pants[0]:sleeve[0],'#000000',.3));
}
const cache=new Map();
export function gojoPixels({frame=0,moving=false,pose='',attack=false,expression='neutral',blink=false,skin='default'}={}){
 const look=LOOKS[skin]?skin:'default',key=[frame,moving,pose,attack,expression,blink,look].join(':');if(cache.has(key))return cache.get(key);
 if(pose==='ultimate')pose='domain';
 const mo=motion({frame,moving}),m={frame:((frame%4)+4)%4,moving,pose,attack,expression,blink,walk:mo.walk*2,y:mo.y,cast:attack},L=LOOKS[look],r=canvas();
 hairBack(r,m,L);
 if(L.body==='dress')legs(r,m,L,{top:57,bare:true,stocking:true});else if(L.body==='beach')legs(r,m,L,{top:56,shorts:6});else legs(r,m,L,{top:53});
 torso(r,m,L);arms(r,m,L,look);head(r,m.y,{skin:SK});eyesFor(r,m,L);mouthFor(r,m);hairFront(r,m,L);
 if(m.pose==='domain'){const {rect:R,put}=r;R(38,31+m.y,4,4,SK.base);R(39,26+m.y,1,5,SK.base);R(40,27+m.y,1,4,SK.shade);put(39,26+m.y,SK.light);}
 const result=selout(r.pixels,c.ink);cache.set(key,result);return result;
}
