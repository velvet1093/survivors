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
// Off-duty outfits share the same face and add their own hairstyles:
//  Market Day: a rust headscarf, cream tunic, short indigo jacket, olive skirt and an herb basket.
//  Moonlit Herb Robe: a low ponytail and a navy sleeping robe printed with moons and leaves.
//  Jade Lagoon: the ribboned bun, a jade one-piece with white trim and a teal sarong.
//  Jade Lotus Swimsuit: twin pigtails with lotus pins, a ruffled jade top and pink frilled skirt.
//  Lotus Bathhouse Wrap: hair wrapped in a towel, a lotus-print bath robe and wooden geta.
export const MAOMAO_ART={ink:'#16201e',hair:['#0e1e1c','#1e3a34','#3a5e52'],iris:'#7a72c8',irisDark:'#3e3a80'};
const c=MAOMAO_ART,SK={base:'#ffe2c6',shade:'#ebb9a0',deep:'#cf8d84',light:'#fff2e4'};
const LOOKS={
 default:{top:['#2e6a3e','#5aa060','#86c47e'],collar:'#9ad8a4',inner:'#f2f2ea',cuff:'#c4dc6a',skirt:['#4a1428','#7a2a48','#9a4462'],shoe:'#244a3a'},
 palace:{top:['#5a4a78','#9a7ab8','#c4aad8'],collar:'#e2d0ee',inner:'#f6f0f8',cuff:'#e8c868',skirt:['#1c2638','#394e68','#566c88'],shoe:'#2a3448'},
 spring:{top:['#b05a7a','#e89ab4','#f8c4d4'],collar:'#ffffff',inner:'#f6f6f2',cuff:'#f8c4d4',skirt:['#6a1a44','#b03a78','#d0609a'],shoe:'#5a2a44',sash:['#6a9a3a','#a8d070'],shawl:['#5a9ea4','#9ad4d8','#d4f0f0'],hem:'#e8f0f4'},
 dancer:{top:['#8a1a1e','#d83a3a','#f06a5a'],collar:'#7a4ab0',inner:'#cfe8de',cuff:'#cfe8de',skirt:['#9a2026','#e0504a','#f88070'],shoe:'#6a1a1e',hip:['#a888c4','#e0ccf0'],hem:['#7aa8a0','#cfe8de']},
 casual:{top:['#c8bca0','#ece2c8','#fffaf0'],collar:'#d8ccb0',inner:'#fffaf0',coat:['#22344a','#3a5a7a','#5a7a9a'],skirt:['#3e4a28','#6a7a48','#8a9a62'],sash:'#8a5a3a',scarf:['#7a3220','#b85a3a','#e08a5a'],shoe:'#c8a060',sleeve:'coat'},
 pajamas:{top:['#1c2440','#2a3458','#44507a'],collar:'#8a9ad0',inner:'#d8d0f0',cuff:'#8a9ad0',skirt:['#1c2440','#2a3458','#44507a'],sash:'#b8a8e0',shoe:'#d8d0f0',print:['#f0d880','#7ac86a']},
 swimsuit:{suit:['#1e5a48','#3a9a7a','#6ac8a8'],trim:'#f4f4ec',sarong:['#3a8a8a','#7ad0c0','#c0f0e8'],shoe:'#e0c890',sleeve:null},
 cuteswim:{suit:['#35695f','#6daf9b','#bce1c1'],trim:'#eee0b5',frill:['#a3506f','#e8a0b8','#f8d0dc'],shoe:'#e890a8',sleeve:null},
 bathsuit:{top:['#c8c4bc','#f2eee8','#ffffff'],collar:'#e890a8',inner:'#ffffff',cuff:'#f8d0dc',skirt:['#c8c4bc','#f2eee8','#ffffff'],sash:'#e890a8',shoe:'#a07850',print:['#e890a8','#7ac86a']},
};
// Hairstyle per outfit.
const HAIR={default:'bun',palace:'bun',swimsuit:'bun',spring:'twin',dancer:'loose',casual:'scarf',pajamas:'lowtail',cuteswim:'lotus',bathsuit:'towel'};
// Outfits drawn by the off-duty helpers below rather than the court robes.
const OFF_DUTY=new Set(['casual','pajamas','swimsuit','cuteswim','bathsuit']);
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
 if(HAIR[look]==='loose'){// Loose hair falling to the waist, swaying as she turns.
  P(shift([[15,22],[17,12],[28,9],[39,12],[41,22],[43,40],[45+walk*.5,54],[38,52],[36,40],[20,40],[18,52],[11+walk*.5,54],[13,40]],y),H[0]);
  P(shift([[16,24],[40,24],[42,40],[43+walk*.5,51],[39,49],[37,38],[19,38],[17,49],[13+walk*.5,51],[14,40]],y),H[1]);L(15,28+y,13+walk*.5,50,H[2]);L(41,28+y,43+walk*.5,50,H[2]);return;}
 P(shift([[15,24],[17,13],[28,10],[39,13],[41,24],[40,36],[16,36]],y),H[0]);
 if(HAIR[look]==='lowtail'){// A long ponytail tied low at the nape, falling behind her back.
  P(shift([[21,36],[35,36],[36,48],[33,54],[23,54],[20,48]],y),H[0]);P(shift([[23,37],[33,37],[34,48],[31,52],[25,52],[22,48]],y),H[1]);L(26,38+y,25,51+y,H[2]);}
 if(HAIR[look]==='lotus')for(const x of [12,44]){// Twin pigtails tied low behind the ears.
  P(shift([[x-2,30],[x+2,30],[x+3,40],[x+1,47],[x-1,47],[x-3,40]],y),H[0]);P(shift([[x-1,31],[x+1,31],[x+2,40],[x,45],[x-2,40]],y),H[1]);L(x,32+y,x,44+y,H[2]);}
}
function hairFront(r,m,look){
 const {y}=m,H=c.hair,{poly:P,line:L,rect:R,put}=r;
 // Dome and the blunt, straight-cut fringe.
 P(shift([[16,26],[16,17],[20,12],[28,10],[36,12],[40,17],[40,26],[38,26],[36,24],[20,24],[18,26]],y),H[1]);
 P(shift([[19,25],[19,20],[37,20],[37,25],[34,25],[33,24],[30,25],[27,24],[24,25],[22,24]],y),H[1]);
 for(const x of [21,25,29,33])L(x,23+y,x,24+y,H[0]);L(20,21+y,36,21+y,H[2]);L(19,15+y,26,12+y,H[2]);L(29,12+y,35,14+y,H[2]);
 // Straight side locks framing the face.
 for(const x of [16,38]){R(x,24+y,3,14,H[1]);L(x+(x<28?0:2),25+y,x+(x<28?0:2),37+y,H[0]);L(x+1,26+y,x+1,36+y,H[2]);}
 const style=HAIR[look];
 if(style==='scarf'){// A rust headscarf tied over the crown, its knot and tails at the back.
  const S=LOOKS.casual.scarf;P(shift([[16,19],[18,12],[24,9],[33,9],[39,12],[41,19],[38,18],[28,16],[18,18]],y),S[1]);L(18,17+y,38,17+y,S[0]);L(21,12+y,33,10+y,S[2]);
  P(shift([[37,12],[42,9],[44,12],[41,15]],y),S[1]);L(42,13+y,45,20+y,S[0],2);L(41,14+y,43,21+y,S[1]);return;}
 if(style==='towel'){// Hair wrapped up in a white bath towel.
  P(shift([[15,21],[15,15],[20,10],[28,8],[36,10],[41,15],[41,21],[37,19],[28,18],[19,19]],y),'#e8e4dc');P(shift([[16,20],[17,15],[21,11],[28,9],[35,11],[39,15],[40,19],[28,17]],y),'#f8f6f2');
  for(const [x0,y0,x1,y1]of [[18,17,25,11],[24,18,32,10],[31,18,38,13]])L(x0,y0+y,x1,y1+y,'#d8d2c8');R(33,7+y,4,3,'#f8f6f2');L(33,9+y,36,9+y,'#d8d2c8');return;}
 if(style==='lotus'){// Pink lotus pins where the pigtails are tied.
  for(const x of [13,43]){const yy=29+y;for(const [dx,dy]of [[-2,0],[2,0],[0,-2],[-1,-1],[1,-1]])R(x+dx,yy+dy,2,2,'#f8b8cc');R(x,yy,2,2,'#e87098');put(x,yy-1,'#ffe07a');}return;}
 if(style==='lowtail')return;
 if(style==='bun'){
  // A small bun high at the back tied with a blue ribbon, and thin beaded braids.
  P(shift([[33,10],[36,6],[40,7],[41,11],[38,13]],y),H[1]);L(36,8+y,39,8+y,H[2]);
  // Ribbon bow: two loops either side of a knot, with short tails.
  for(const [bx,by]of [[30,6],[35,6]]){R(bx-1,by-1+y,3,3,'#5a78d0');put(bx,by+y,'#2a3a90');}R(32,6+y,2,2,'#a8bcf0');L(32,8+y,31,11+y,'#5a78d0');L(33,8+y,35,10+y,'#5a78d0');
  for(const x of [17,39]){L(x,37+y,x,45+y,H[0]);for(const yy of [39,42])put(x,yy+y,yy===39?'#d04a4a':'#4aa070');put(x,45+y,'#e0c060');}
 }else if(style==='twin'){
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
// ---- Off-duty outfits ----
function bareLegs(r,m,top,shoe,{geta=false}={}){
 const {walk}=m,{rect:R,line:Ln}=r;
 for(const [i,x]of [[0,22],[1,30]]){const d=i?walk:-walk;R(x+d*.5,top,4,67-top,SK.base);R(x+3+d*.5,top,1,67-top,SK.shade);
  if(geta){R(x-1+d*.5,68,6,2,shoe);R(x-1+d*.5,70,2,1,mix(shoe,'#000000',.4));R(x+3+d*.5,70,2,1,mix(shoe,'#000000',.4));Ln(x+d*.5,67,x+2+d*.5,68,'#c83a3a');Ln(x+4+d*.5,67,x+2+d*.5,68,'#c83a3a');}
  else{R(x-1+d*.5,67,6,2,shoe);R(x-1+d*.5,69,6,1,mix(shoe,'#000000',.35));Ln(x+d*.5,66,x+3+d*.5,66,shoe);}}
}
function prints(r,y0,y1,x0,x1,colors,seed=0){
 // A scattered pattern of small moons/lotus marks and leaves.
 for(let i=0;i<7;i++){const x=Math.round(x0+((i*7+seed*3)%11)/11*(x1-x0)),y=Math.round(y0+((i*5+seed)%9)/9*(y1-y0));r.put(x,y,colors[i%2]);r.put(x+1,y,colors[i%2]);if(i%2===0)r.put(x,y-1,colors[0]);}
}
function offDutyBody(r,m,look,L){
 const {y,walk}=m,{poly:P,rect:R,line:Ln,put}=r;
 if(look==='casual'){
  bareLegs(r,m,61,L.shoe);
  P([[20,48],[36,48],[40+walk*.5,63],[16+walk*.5,63]],L.skirt[0]);P([[21,49],[35,49],[38+walk*.5,62],[18+walk*.5,62]],L.skirt[1]);for(const fx of [-5,1,7])Ln(28+fx*.5,50,28+fx*1.2+walk*.5,61,L.skirt[2]);
  top(r,m,look,L);
  // Short indigo jacket worn open over the tunic, belted with a brown sash.
  for(const side of [-1,1]){const X=d=>28+side*d;P(shift([[X(4),37],[X(10),37],[X(11),50],[X(6),50]],y),L.coat[0]);P(shift([[X(5),38],[X(9),38],[X(10),49],[X(7),49]],y),L.coat[1]);}
  R(19,47+y,18,2,L.sash);return;}
 if(look==='pajamas'||look==='bathsuit'){
  const knee=look==='bathsuit',hem=knee?58:65;
  if(knee)bareLegs(r,m,57,L.shoe,{geta:true});else for(const x of [22,30])R(x-walk*.3,66,7,3,L.shoe),R(x-walk*.3,66,7,1,'#ffffff');
  // The robe continues straight down from the sash, opening slightly at the hem.
  P([[19,48],[37,48],[38+walk*.4,hem],[18+walk*.4,hem]],L.skirt[0]);P([[20,49],[36,49],[37+walk*.4,hem-1],[19+walk*.4,hem-1]],L.skirt[1]);Ln(28,49,29+walk*.4,hem-1,L.skirt[0]);Ln(21,50,20+walk*.4,hem-2,L.skirt[2]);
  prints(r,51,hem-3,20,36,L.print,look==='bathsuit'?2:0);
  top(r,m,look,L);prints(r,40+y,46+y,20,36,L.print,5);R(19,47+y,18,2,L.sash);R(19,47+y,18,1,mix(L.sash,'#ffffff',.35));
  if(knee){Ln(31,49+y,33,55,L.sash,2);}else{Ln(30,49+y,31,54,L.sash);Ln(31,49+y,33,53,L.sash);}
  return;}
 // Swimwear: bare shoulders, arms and legs.
 bareLegs(r,m,look==='cuteswim'?54:52,L.shoe);
 R(20,37+y,17,3,SK.base);R(20,39+y,17,1,SK.shade);
 if(look==='swimsuit'){
  P(shift([[21,40],[35,40],[36,46],[34,54],[22,54],[20,46]],y),L.suit[0]);P(shift([[22,41],[34,41],[35,46],[33,53],[23,53],[21,46]],y),L.suit[1]);Ln(23,42+y,22,51+y,L.suit[2]);
  P(shift([[25,40],[31,40],[28,43]],y),SK.base);Ln(22,40+y,25,40+y,L.trim);Ln(31,40+y,34,40+y,L.trim);Ln(25,40+y,28,43+y,L.trim);Ln(31,40+y,28,43+y,L.trim);
  for(const x of [23,33])Ln(x,37+y,x,40+y,L.suit[0]);Ln(22,53,34,53,L.trim);
  // Teal sarong knotted at the left hip, draping diagonally to the knee.
  P([[19,50],[37,51],[36+walk*.4,61],[30,60],[24+walk*.4,62]],L.sarong[0]);P([[20,51],[36,52],[35+walk*.4,59],[30,58],[25+walk*.4,60]],L.sarong[1]);Ln(21,52,26+walk*.4,59,L.sarong[2]);
  R(18,49,4,4,L.sarong[0]);R(19,50,2,2,L.sarong[2]);Ln(19,53,17+walk*.4,58,L.sarong[0],2);return;}
 // Jade top with a cream ruffle at the neckline and a layered pink frilled skirt.
 P(shift([[21,40],[35,40],[36,48],[20,48]],y),L.suit[0]);P(shift([[22,41],[34,41],[35,47],[21,47]],y),L.suit[1]);Ln(23,42+y,22,46+y,L.suit[2]);
 for(let x=21;x<36;x+=2){put(x,40+y,L.trim);put(x+1,41+y,L.trim);}for(const x of [23,33])Ln(x,37+y,x,40+y,L.suit[0]);
 for(const [yy,k]of [[47,0],[51,1]]){const F=L.frill;P([[19-k,yy],[37+k,yy],[39+k+walk*.4,yy+5],[17-k+walk*.4,yy+5]],F[k?0:1]);for(let x=17-k;x<40+k;x+=3)put(x+walk*.4,yy+5,F[2]);}
 R(26,47,5,2,L.suit[1]);put(28,47,L.trim);
}
function offDutyArms(r,m,look,L){
 const {y,walk,cast,pose,frame}=m,{rect:R,line:Ln,put}=r,brew=pose==='brew';
 const sleeve=L.sleeve==='coat'?L.coat:null;
 const plan=brew?[[19,24,46,25,48],[37,32,46,31,48]]:cast?[[19,16,45,15,51],[37,41,37,46,36]]:[[19,16,45,15,51+walk*.3],[37,40,45,41,51-walk*.3]];
 for(const [sx,ex,ey,hx,hy]of plan){
  if(sleeve){Ln(sx,39+y,ex,ey+y,sleeve[0],5);Ln(sx,39+y,ex,ey-1+y,sleeve[1],3);}else{Ln(sx,39+y,ex,ey+y,SK.shade,4);Ln(sx,39+y,ex,ey-1+y,SK.base,3);}
  Ln(ex,ey+y,hx,hy+y,SK.shade,4);Ln(ex,ey+y,hx,hy-1+y,SK.base,3);R(hx-1,hy+y,3,3,SK.base);R(hx-1,hy+2+y,3,1,SK.shade);}
 if(cast||brew){const hx=brew?28:46,vy=(brew?42:30)+y;R(hx-2,vy,5,6,'#cfeee0');R(hx-1,vy+2,3,3,'#5ac080');put(hx-1,vy+2,'#c8ffd8');R(hx-1,vy-2,3,2,'#a87a4a');
  if(brew)for(const [dx,dy]of [[-2,-5],[2,-7],[0,-10]])put(hx+dx,vy+dy-(frame%2),'#9ae0a8');return;}
 if(look==='casual'){// A woven basket of fresh herbs hangs from her left arm.
  const bx=10,by=50+y;R(bx,by,10,6,'#7a5a30');R(bx+1,by+1,8,4,'#b08850');for(const x of [bx+2,bx+5,bx+8])Ln(x,by+1,x,by+4,'#8a6a3a');Ln(bx+1,by+3,bx+8,by+3,'#8a6a3a');
  Ln(bx+1,by,bx+5,by-5,'#7a5a30');Ln(bx+5,by-5,bx+9,by,'#7a5a30');for(const [x,h]of [[bx+2,4],[bx+4,6],[bx+7,5]])Ln(x,by,x+1,by-h,'#4a9a4a');put(bx+4,by-6,'#ffffff');}
}
const cache=new Map();
export function maomaoPixels({frame=0,moving=false,pose='',attack=false,expression='neutral',blink=false,skin='default'}={}){
 const look=LOOKS[skin]?skin:'default',key=[frame,moving,pose,attack,expression,blink,look].join(':');if(cache.has(key))return cache.get(key);
 // The generic ultimate pose shows her brewing.
 if(pose==='ultimate')pose='brew';
 const mo=motion({frame,moving}),m={frame:((frame%4)+4)%4,moving,pose,attack,expression,blink,walk:mo.walk*2,y:mo.y,cast:attack},L=LOOKS[look],r=canvas();
 // A throwing or brewing arm comes forward over the side locks.
 const forward=m.cast||pose==='brew';
 if(OFF_DUTY.has(look)){
  // Robes keep the wide-sleeved arms; the rest bare their arms or roll their sleeves.
  const drawArms=()=>L.top&&look!=='casual'?arms(r,m,look,L):offDutyArms(r,m,look,L);
  hairBack(r,m,look);offDutyBody(r,m,look,L);if(!forward)drawArms();face(r,m);hairFront(r,m,look);if(forward)drawArms();
 }else{hairBack(r,m,look);skirt(r,m,look,L);top(r,m,look,L);if(!forward)arms(r,m,look,L);face(r,m);hairFront(r,m,look);if(forward)arms(r,m,look,L);}
 const result=selout(r.pixels,c.ink);cache.set(key,result);return result;
}
