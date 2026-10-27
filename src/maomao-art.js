import {canvas,motion,selout,mix,head,eye} from './hero-kit.js';
// Maomao from The Apothecary Diaries. Shared features: near-black green hair with a blunt
// fringe and straight side locks, violet-blue eyes, freckles and a small flat mouth.
//  Apothecary: green wrap top with a pale crossed collar and yellow-green cuffs over a
//   long maroon skirt, a small bun tied with a blue ribbon and beaded side braids.
//  Palace: the same cut in court lilac over a navy skirt.
//  Spring Court: twin buns, a pink wide-sleeved robe over a white blouse, a green sash
//   with long ties, a teal shawl looped over the arms and a magenta skirt with a white hem.
//  Crimson Dancer: long loose hair with a blue rose, a red cropped wrap with mint-lined
//   flowing sleeves and purple ruffles, a beaded lilac hip ruffle and a red skirt with a
//   mint ruffled hem.
export const MAOMAO_ART={ink:'#16201e',hair:['#0e1e1c','#1e3a34','#3a5e52'],iris:'#7a72c8',irisDark:'#3e3a80'};
const c=MAOMAO_ART,SK={base:'#ffe2c6',shade:'#ebb9a0',deep:'#cf8d84',light:'#fff2e4'};
const LOOKS={
 default:{top:['#2e6a3e','#5aa060','#86c47e'],collar:'#9ad8a4',inner:'#f2f2ea',cuff:'#c4dc6a',skirt:['#4a1428','#7a2a48','#9a4462'],shoe:'#244a3a'},
 palace:{top:['#5a4a78','#9a7ab8','#c4aad8'],collar:'#e2d0ee',inner:'#f6f0f8',cuff:'#e8c868',skirt:['#1c2638','#394e68','#566c88'],shoe:'#2a3448'},
 spring:{top:['#b05a7a','#e89ab4','#f8c4d4'],collar:'#ffffff',inner:'#f6f6f2',cuff:'#f8c4d4',skirt:['#6a1a44','#b03a78','#d0609a'],shoe:'#5a2a44',sash:['#6a9a3a','#a8d070'],shawl:['#5a9ea4','#9ad4d8','#d4f0f0'],hem:'#e8f0f4'},
 dancer:{top:['#8a1a1e','#d83a3a','#f06a5a'],collar:'#7a4ab0',inner:'#cfe8de',cuff:'#cfe8de',skirt:['#9a2026','#e0504a','#f88070'],shoe:'#6a1a1e',hip:['#a888c4','#e0ccf0'],hem:['#7aa8a0','#cfe8de']},
};
const shift=(pts,y)=>pts.map(([x,yy])=>[x,yy+y]);
function face(r,m){
 const {y,blink,expression}=m,hurt=expression==='hurt',focus=expression==='focused'||expression==='ultimate'||m.cast;
 head(r,y,{skin:SK});
 for(const [x,side]of [[21,-1],[31,1]])eye(r,x,26+y,{iris:c.iris,irisDark:c.irisDark,side,closed:blink,hurt,focus,lash:c.hair[0]});
 // Her freckles, scattered across both cheeks.
 for(const [x,yy]of [[20,32],[22,33],[23,32],[33,32],[34,33],[36,32]])r.put(x,yy+y,'#d89a84');
 if(hurt){r.rect(27,34+y,3,2,'#8f4f5c');}else if(expression==='ultimate'){r.rect(27,34+y,3,1,'#a06060');r.put(30,33+y,'#a06060');}
 else{r.rect(27,35+y,3,1,'#a97476');r.put(30,34+y,'#a97476');}
}
function hairBack(r,m,look){
 const {y,walk}=m,H=c.hair,{poly:P,line:L}=r;
 if(look==='dancer'){// Loose hair falling to the waist, swaying as she turns.
  P(shift([[15,22],[17,12],[28,9],[39,12],[41,22],[43,40],[45+walk*.5,54],[38,52],[36,40],[20,40],[18,52],[11+walk*.5,54],[13,40]],y),H[0]);
  P(shift([[16,24],[40,24],[42,40],[43+walk*.5,51],[39,49],[37,38],[19,38],[17,49],[13+walk*.5,51],[14,40]],y),H[1]);L(15,28+y,13+walk*.5,50,H[2]);L(41,28+y,43+walk*.5,50,H[2]);return;}
 P(shift([[15,24],[17,13],[28,10],[39,13],[41,24],[40,36],[16,36]],y),H[0]);
}
function hairFront(r,m,look){
 const {y}=m,H=c.hair,{poly:P,line:L,rect:R,put}=r;
 // Dome and the blunt, straight-cut fringe.
 P(shift([[16,26],[16,17],[20,12],[28,10],[36,12],[40,17],[40,26],[38,26],[36,24],[20,24],[18,26]],y),H[1]);
 P(shift([[19,25],[19,20],[37,20],[37,25],[34,25],[33,24],[30,25],[27,24],[24,25],[22,24]],y),H[1]);
 for(const x of [21,25,29,33])L(x,23+y,x,24+y,H[0]);L(20,21+y,36,21+y,H[2]);L(19,15+y,26,12+y,H[2]);L(29,12+y,35,14+y,H[2]);
 // Straight side locks framing the face.
 for(const x of [16,38]){R(x,24+y,3,14,H[1]);L(x+(x<28?0:2),25+y,x+(x<28?0:2),37+y,H[0]);L(x+1,26+y,x+1,36+y,H[2]);}
 if(look==='default'||look==='palace'){
  // A small bun high at the back tied with a blue ribbon, and thin beaded braids.
  P(shift([[33,10],[36,6],[40,7],[41,11],[38,13]],y),H[1]);L(36,8+y,39,8+y,H[2]);
  // Ribbon bow: two loops either side of a knot, with short tails.
  for(const [bx,by]of [[30,6],[35,6]]){R(bx-1,by-1+y,3,3,'#5a78d0');put(bx,by+y,'#2a3a90');}R(32,6+y,2,2,'#a8bcf0');L(32,8+y,31,11+y,'#5a78d0');L(33,8+y,35,10+y,'#5a78d0');
  for(const x of [17,39]){L(x,37+y,x,45+y,H[0]);for(const yy of [39,42])put(x,yy+y,yy===39?'#d04a4a':'#4aa070');put(x,45+y,'#e0c060');}
 }else if(look==='spring'){
  // Twin buns on top with pale ribbons.
  for(const x of [20,36]){r.poly(shift([[x-4,13],[x-3,8],[x,6],[x+3,8],[x+4,13]],y),H[1]);L(x-2,9+y,x+1,7+y,H[2]);R(x-3,13+y,7,1,'#f8c4d4');}
 }else{
  // A blue rose pinned above her right ear.
  const rx=37,ry=16+y;R(rx,ry,5,5,'#2a3a9a');R(rx+1,ry+1,3,3,'#4a6ad8');put(rx+2,ry+2,'#a8c0ff');put(rx,ry,'#1a2470');
 }
}
function skirt(r,m,look,L){
 const {walk}=m,{poly:P,line:Ln,rect:R}=r,S=L.skirt;
 if(look==='dancer'){
  // A flared red skirt whose mint ruffled hem flips with each step.
  P([[20,52],[36,52],[46+walk,68],[10+walk,68]],S[0]);P([[21,53],[35,53],[44+walk,67],[12+walk,67]],S[1]);
  for(const fx of [-8,-2,4,10])Ln(28+fx*.4,54,28+fx*1.4+walk,66,S[2]);Ln(30,53,36+walk,67,L.hem[1],2);
  for(let i=0;i<9;i++){const x=10+walk+i*4;P([[x,67],[x+4,67],[x+3,71],[x-1,70]],i%2?L.hem[0]:L.hem[1]);}
  // Lilac hip ruffle with a row of gold coin beads.
  P([[19,49],[37,49],[40,55],[34,57],[28,55],[22,57],[16,55]],L.hip[0]);P([[20,50],[36,50],[38,54],[33,55],[28,53],[23,55],[18,54]],L.hip[1]);
  for(let x=20;x<37;x+=3)r.put(x,51,'#e0b040');return;}
 // A long A-line skirt to the floor with soft vertical folds.
 P([[20,48],[36,48],[42+walk*.5,69],[14+walk*.5,69]],S[0]);P([[21,49],[35,49],[40+walk*.5,68],[16+walk*.5,68]],S[1]);
 for(const fx of [-6,0,6])Ln(28+fx*.5,51,28+fx*1.3+walk*.5,67,S[2]);Ln(23,50,18+walk*.5,67,S[0]);
 if(L.hem){R(15+walk*.5,67,27,3,L.hem);Ln(16+walk*.5,68,41+walk*.5,68,'#c4d4dc');}
 // Slippers peek out under the hem.
 for(const x of [22,30])R(x-walk*.3,69,6,2,L.shoe);
}
function top(r,m,look,L){
 const {y}=m,{poly:P,rect:R,line:Ln,put}=r,T=L.top;
 if(look==='dancer'){
  // Cropped red wrap tied under the bust, purple ruffle trim, bare midriff.
  R(23,45+y,11,5,SK.base);R(23,48+y,11,1,SK.shade);
  P(shift([[20,37],[36,37],[37,45],[19,45]],y),T[0]);P(shift([[21,38],[35,38],[36,44],[20,44]],y),T[1]);Ln(22,38+y,22,43+y,T[2]);
  P(shift([[24,37],[28,42],[32,37]],y),SK.base);for(let x=20;x<37;x+=2){put(x,45+y,L.collar);put(x+1,46+y,mix(L.collar,'#ffffff',.3));}
  Ln(24,37+y,28,42+y,L.collar);Ln(32,37+y,28,42+y,L.collar);put(28,43+y,'#e0e0f0');return;}
 // Wrap top: pale inner collar, a wide crossed outer collar band and a hip-length hem.
 P(shift([[19,37],[37,37],[39,51],[17,51]],y),T[0]);P(shift([[20,38],[36,38],[38,50],[18,50]],y),T[1]);Ln(21,40+y,20,49+y,T[2]);
 P(shift([[25,37],[31,37],[28,41]],y),L.inner);
 Ln(24,37+y,33,47+y,L.collar,2);Ln(32,37+y,28,42+y,mix(L.collar,T[0],.3),2);
 if(look==='spring'){// Green sash with long ties hanging to the knee.
  R(19,46+y,19,3,L.sash[0]);R(19,46+y,19,1,L.sash[1]);for(const [x,d]of [[26,-1],[29,1]]){Ln(x,49+y,x+d*2,60,L.sash[0],2);Ln(x,49+y,x+d*2,59,L.sash[1]);}}
}
function arms(r,m,look,L){
 const {y,walk,cast,pose,frame}=m,{poly:P,rect:R,line:Ln,put}=r,T=L.top;
 const brew=pose==='brew';
 if(look==='dancer'&&!cast){
  // Dancing: one arm raised overhead trailing a long sheer sleeve, the other held out.
  const sway=[0,1,2,1][frame];
  Ln(36,40+y,42,30+y,SK.base,3);Ln(42,30+y,44,22+y-sway,SK.base,2);R(43,20+y-sway,3,3,SK.base);
  P(shift([[36,38],[44,24-sway],[50,22-sway],[52,30],[47,42],[40,44]],y),L.cuff);P(shift([[37,39],[43,28-sway],[45,32],[40,42]],y),T[1]);
  Ln(20,40+y,13,46+y,SK.base,3);R(11,45+y,3,3,SK.base);P(shift([[20,38],[14,43],[8,48],[10,54],[16,50],[21,44]],y),L.cuff);P(shift([[20,39],[15,44],[17,47],[21,43]],y),T[1]);
  return;}
 if(cast||brew){
  // A raised hand holds a stoppered vial; when brewing both hands cradle it at the chest.
  const hx=brew?28:46,hy=brew?49:36;
  for(const [sx,ex,ey]of brew?[[19,25,48],[37,31,48]]:[[19,22,47],[37,hx,hy]]){
   Ln(sx,40+y,ex,ey+y,T[0],6);Ln(sx,40+y,ex,ey-1+y,T[1],4);Ln(sx,39+y,ex,ey-2+y,T[2]);R(ex-2,ey+y,6,3,L.cuff);R(ex-1,ey+2+y,3,2,SK.base);}
  const vy=hy-6+y;R(hx-2,vy,5,6,'#cfeee0');R(hx-1,vy+2,3,3,'#5ac080');put(hx-1,vy+2,'#c8ffd8');R(hx-1,vy-2,3,2,'#a87a4a');
  if(brew)for(const [dx,dy]of [[-2,-5],[2,-7],[0,-10]])put(hx+dx,vy+dy-(frame%2),'#9ae0a8');
  return;}
 // Wide sleeves; hands clasped politely in front of the waist.
 for(const [sx,side]of [[19,-1],[37,1]]){const X=d=>28+side*d;
  P(shift([[X(9),38],[X(14),41],[X(16),52],[X(8),53],[X(3),48],[X(5),42]],y),T[0]);P(shift([[X(9),39],[X(13),42],[X(15),51],[X(8),52],[X(4),48],[X(6),43]],y),T[1]);
  Ln(X(13),43+y,X(15),50+y,T[2]);P(shift([[X(16),48],[X(16),53],[X(7),54],[X(4),49]],y),L.cuff);Ln(X(15),52+y,X(8),53+y,mix(L.cuff,'#000000',.25));}
 R(25,47+y,7,3,SK.base);R(25,49+y,7,1,SK.shade);put(28,48+y,SK.shade);
 if(look==='spring'){// The teal shawl loops over both forearms and trails at the sides.
  const S=L.shawl;Ln(15,44+y,24,49+y,S[1],2);Ln(41,44+y,32,49+y,S[1],2);for(const [x,d]of [[14,-1],[42,1]]){Ln(x,44+y,x+d*3+walk*.5,60,S[0],2);Ln(x,45+y,x+d*3+walk*.5,59,S[2]);}
  // A small medicine bottle in hand.
  R(32,44+y,3,4,'#3a5ab0');R(33,43+y,1,1,'#d8d8e8');}
}
const cache=new Map();
export function maomaoPixels({frame=0,moving=false,pose='',attack=false,expression='neutral',blink=false,skin='default'}={}){
 const look=LOOKS[skin]?skin:'default',key=[frame,moving,pose,attack,expression,blink,look].join(':');if(cache.has(key))return cache.get(key);
 const mo=motion({frame,moving}),m={frame:((frame%4)+4)%4,moving,pose,attack,expression,blink,walk:mo.walk*2,y:mo.y,cast:attack},L=LOOKS[look],r=canvas();
 // A throwing or brewing arm comes forward over the side locks.
 const forward=m.cast||pose==='brew';
 hairBack(r,m,look);skirt(r,m,look,L);top(r,m,look,L);if(!forward)arms(r,m,look,L);face(r,m);hairFront(r,m,look);if(forward)arms(r,m,look,L);
 const result=selout(r.pixels,c.ink);cache.set(key,result);return result;
}
