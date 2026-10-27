import {canvas,motion,selout,mix,head,eye} from './hero-kit.js';
// Madoka Kaname. Shared features: short pink twin tails tied with red ribbons, round
// pink eyes, a soft blush and a small smile.
//  Magical Girl: big red bows, white puffed sleeves and gloves, a cream bodice laced in
//   pink, a red choker with her Soul Gem, a white bubble skirt with pink petal points,
//   white socks and red strapped shoes.
//  Ultimate Madoka: floor-length pink hair with white wing ornaments, golden eyes, a white
//   capelet and layered gown edged in black, opening onto a starry cosmos, and white
//   stockings with tiny wings at the ankles.
//  Mitakihara School Uniform: a cream blazer with red trim, red bow tie, dark plaid
//   pleated skirt, white thigh-high socks and brown loafers.
//  Rose Sunday: a white blouse under a rose pinafore with a yellow satchel.
//  Rose Ribbon Nightdress: a long pale pink nightdress with frills and bunny slippers.
//  Rosewater Swim Dress: a polka-dot pink swim dress with a flared skirt.
//  Rosewater Ruffles: a white top and pink bottoms layered in ruffles.
//  Little Rose Bathrobe: a fluffy pink robe with a bunny-eared hood.
export const MADOKA_ART={ink:'#3a1a2a',iris:'#e0508a',irisDark:'#9a2a5a'};
const c=MADOKA_ART,SK={base:'#ffe2c6',shade:'#ebb9a0',deep:'#cf8d84',light:'#fff2e4'};
const PINK=['#b0507a','#f090b8','#ffc8dc'],GODDESS=['#c87aa4','#f8b8d4','#ffe8f2'];
const LOOKS={
 default:{hair:'tails',ribbon:'big',body:'magical',sleeve:{upper:null,fore:null,puff:true,cuff:'#ffffff'}},
 goddess:{hair:'goddess',body:'goddess',sleeve:{upper:['#d8d0dc','#ffffff','#ffffff'],fore:['#d8d0dc','#ffffff','#ffffff'],cape:true}},
 school:{hair:'tails',ribbon:'small',body:'school',sleeve:{upper:['#c8b890','#f2e8cc','#fffaee'],fore:['#c8b890','#f2e8cc','#fffaee'],cuff:'#c0303a'}},
 casual:{hair:'tails',ribbon:'small',body:'pinafore',sleeve:{upper:['#d8d0dc','#ffffff','#ffffff'],fore:null,puff:true}},
 pajamas:{hair:'low',ribbon:'small',body:'nightdress',sleeve:{upper:['#d8a0b8','#f8d0e0','#fff0f6'],fore:['#d8a0b8','#f8d0e0','#fff0f6'],cuff:'#ffffff'}},
 swimsuit:{hair:'tails',ribbon:'small',body:'swimdress',sleeve:null},
 cuteswim:{hair:'tails',ribbon:'flower',body:'ruffles',sleeve:null},
 bathsuit:{hair:'hood',body:'bathrobe',sleeve:{upper:['#d890ac','#f8b8d0','#ffe0ec'],fore:['#d890ac','#f8b8d0','#ffe0ec'],cuff:'#ffffff'}},
};
const shift=(pts,y)=>pts.map(([x,yy])=>[x,yy+y]);
function face(r,m,L){
 const {y,blink,expression}=m,hurt=expression==='hurt',focus=expression==='focused'||m.cast,gold=L.hair==='goddess';
 head(r,y,{skin:SK});
 for(const [x,side]of [[21,-1],[31,1]])eye(r,x,26+y,{iris:gold?'#f0c040':c.iris,irisDark:gold?'#b07a10':c.irisDark,side,closed:blink,hurt,focus,lash:'#6a2a44'});
 for(const x of [19,20,35,36])r.put(x,33+y,'#f4a0a8');
 if(hurt)r.rect(27,34+y,3,2,'#8f4f5c');else if(expression==='ultimate'){r.rect(27,34+y,3,2,'#c0606a');r.put(28,34+y,'#fff4ee');}else{r.put(27,34+y,'#c0707a');r.rect(28,35+y,2,1,'#c0707a');r.put(30,34+y,'#c0707a');}
}
function hairBack(r,m,L){
 const {y,walk}=m,{poly:P,line:Ln}=r,H=L.hair==='goddess'?GODDESS:PINK;
 if(L.hair==='goddess'){// Floor-length hair streaming out behind her on both sides.
  for(const s of [-1,1]){const X=d=>28+s*d;P(shift([[X(8),18],[X(13),22],[X(16),40],[X(19)+walk*.5,58],[X(17)+walk*.5,71],[X(12),71],[X(10),56],[X(8),40]],y*0),H[0]);P(shift([[X(9),22],[X(12),24],[X(14),40],[X(16)+walk*.5,58],[X(15)+walk*.5,69],[X(12),69],[X(11),56],[X(9),40]],0),H[1]);Ln(X(12),30,X(15)+walk*.5,66,H[2]);}
  P(shift([[15,22],[17,12],[28,9],[39,12],[41,22],[40,34],[16,34]],y),H[0]);return;}
 if(L.hair==='hood'){// The bathrobe hood with two floppy bunny ears.
  P(shift([[14,28],[14,16],[20,9],[36,9],[42,16],[42,28],[38,34],[18,34]],y),'#d890ac');P(shift([[15,27],[16,16],[21,11],[35,11],[40,16],[41,27]],y),'#f8b8d0');
  for(const s of [-1,1]){P(shift([[28+s*6,11],[28+s*12,1],[28+s*14,4],[28+s*9,13]],y),'#f8b8d0');P(shift([[28+s*7,10],[28+s*12,3],[28+s*12,6],[28+s*9,11]],y),'#ffd8e4');}return;}
 P(shift([[16,30],[15,20],[20,13],[36,13],[41,20],[40,30]],y),H[0]);
 if(L.hair==='low')for(const s of [-1,1]){const x=28+s*12;P(shift([[x-2,30],[x+2,30],[x+2+s,46],[x-1+s,48],[x-3+s,44]],y),H[0]);P(shift([[x-1,31],[x+1,31],[x+1+s,44],[x-1+s,44]],y),H[1]);}
}
function hairFront(r,m,L){
 const {y,walk}=m,{poly:P,line:Ln,rect:R,put}=r,H=L.hair==='goddess'?GODDESS:PINK;
 if(L.hair==='hood'){// Only a fringe shows under the hood.
  P(shift([[18,25],[19,18],[24,14],[32,14],[37,18],[38,25],[35,22],[32,24],[29,21],[26,24],[23,21],[20,24]],y),H[1]);Ln(21,17+y,27,15+y,H[2]);return;}
 // Rounded crown with soft, pointed bangs and side locks.
 P(shift([[16,27],[16,18],[20,12],[28,9],[36,12],[40,18],[40,27],[38,23],[36,26],[33,21],[30,25],[27,20],[24,25],[21,21],[19,26]],y),H[1]);
 for(const [x0,y0,x1,y1]of [[19,15,26,11],[29,11,35,14],[22,17,21,22],[34,17,36,22]])Ln(x0,y0+y,x1,y1+y,H[2]);
 for(const x of [16,38]){R(x,24+y,3,10,H[1]);Ln(x+(x<28?0:2),25+y,x+(x<28?0:2),33+y,H[0]);}
 if(L.hair==='goddess'){// White wing ornaments rise from the sides of her head.
  for(const s of [-1,1]){const X=d=>28+s*d;P(shift([[X(9),16],[X(14),8],[X(15),12],[X(12),18]],y),'#ffffff');P(shift([[X(10),17],[X(16),11],[X(16),15],[X(12),19]],y),'#f4eef8');Ln(X(11),15+y,X(14),10+y,'#d8d0e8');}
  return;}
 if(L.hair==='low'){R(15,30+y,3,2,'#e04a5a');R(39,30+y,3,2,'#e04a5a');return;}
 // Short twin tails that flick outward, tied above each ear.
 for(const s of [-1,1]){const X=d=>28+s*d,sway=walk*.4*s;
  P(shift([[X(10),14],[X(16),15],[X(19)+sway,22],[X(18)+sway,30],[X(15),27],[X(12),20]],y),H[0]);P(shift([[X(11),15],[X(15),16],[X(17)+sway,22],[X(17)+sway,28],[X(14),24]],y),H[1]);Ln(X(13),17+y,X(16)+sway,25+y,H[2]);}
 if(L.ribbon==='big')for(const s of [-1,1]){const X=d=>28+s*d;// Big red bows.
  P(shift([[X(9),10],[X(15),6],[X(15),14]],y),'#c0303a');P(shift([[X(10),10],[X(14),7],[X(14),13]],y),'#e84a5a');P(shift([[X(9),11],[X(3),7],[X(5),14]],y),'#c0303a');R(Math.min(X(8),X(10)),9+y,3,3,'#a02030');}
 else if(L.ribbon==='flower')for(const s of [-1,1]){const x=28+s*11,yy=13+y;for(const [dx,dy]of [[-2,0],[2,0],[0,-2],[0,2]])R(x+dx,yy+dy,2,2,'#ffffff');R(x,yy,2,2,'#f8c040');}
 else for(const s of [-1,1]){const X=d=>28+s*d;P(shift([[X(10),12],[X(14),9],[X(14),15]],y),'#c0303a');P(shift([[X(10),12],[X(6),9],[X(7),14]],y),'#c0303a');put(X(10),12+y,'#e84a5a');}
}
function legs(r,m,{top,sock,sockTop,shoe,strap,frill}){
 const {walk}=m,{rect:R,line:Ln}=r;
 for(const [i,x]of [[0,22],[1,30]]){const d=i?walk:-walk;R(x+d*.5,top,4,67-top,SK.base);R(x+3+d*.5,top,1,67-top,SK.shade);
  if(sock){R(x+d*.5,sockTop,4,67-sockTop,sock);R(x+3+d*.5,sockTop,1,67-sockTop,mix(sock,'#000000',.15));if(frill)R(x-1+d*.5,sockTop,6,1,'#ffffff');}
  R(x-1+d*.5,67,6,3,shoe);R(x+d*.5,67,3,1,mix(shoe,'#ffffff',.3));R(x-1+d*.5,69,6,1,mix(shoe,'#000000',.4));if(strap)Ln(x+d*.5,66,x+4+d*.5,66,shoe);}
}
function body(r,m,L){
 const {y,walk}=m,{poly:P,rect:R,line:Ln,put}=r,b=L.body;
 if(b==='magical'){
  legs(r,m,{top:54,sock:'#ffffff',sockTop:58,shoe:'#c0303a',strap:true,frill:true});
  // Bubble skirt in white tiers with pink petal points hanging over it.
  P([[18,47],[38,47],[43+walk*.4,56],[13+walk*.4,56]],'#d8d0dc');P([[19,48],[37,48],[41+walk*.4,55],[15+walk*.4,55]],'#ffffff');for(let x=15;x<42;x+=3)put(x+walk*.4,55,'#f0d8e4');
  for(const [x0,w]of [[17,5],[23,4],[29,4],[34,5]]){P([[x0,47],[x0+w,47],[x0+w/2+walk*.3,54]],'#b03060');P([[x0+.8,47],[x0+w-.8,47],[x0+w/2+walk*.3,52.5]],'#f070a8');}
  // Cream bodice laced in pink, a pink bow at the waist and the red choker with her Soul Gem.
  P(shift([[21,38],[35,38],[34,48],[22,48]],y),'#d8c078');P(shift([[22,39],[34,39],[33,47],[23,47]],y),'#f8e8a8');for(const yy of [41,44])Ln(26,yy+y,30,yy+2+y,'#f070a8'),Ln(30,yy+y,26,yy+2+y,'#f070a8');
  R(19,46+y,18,2,'#f070a8');R(24,45+y,8,3,'#f070a8');R(27,45+y,2,3,'#b03060');
  R(25,36+y,7,2,'#c0303a');P(shift([[28,38],[30,40],[28,42],[26,40]],y),'#e04a8a');put(28,39+y,'#ffc0e0');return;}
 if(b==='school'){
  legs(r,m,{top:53,sock:'#ffffff',sockTop:55,shoe:'#6a4a2a'});
  // Dark plaid pleated skirt.
  P([[19,47],[37,47],[40+walk*.4,54],[16+walk*.4,54]],'#1e1e28');P([[20,48],[36,48],[39+walk*.4,53],[17+walk*.4,53]],'#34343e');
  for(const x of [20,25,30,35])Ln(x,48,x-1+walk*.4,53,'#9a9aa8');Ln(18+walk*.4,51,38+walk*.4,51,'#c8c8d0');for(const x of [22,28,33])Ln(x,48,x+walk*.4,53,'#1a1a22');
  // Cream blazer with red-trimmed hem, white collar and a big red bow tie.
  P(shift([[19,37],[37,37],[38,48],[18,48]],y),'#c8b890');P(shift([[20,38],[36,38],[37,47],[19,47]],y),'#f2e8cc');Ln(18,48,38,48,'#c0303a');for(let x=19;x<38;x+=2)put(x,49,'#c0303a');
  for(const x of [22,32])Ln(x,44+y,x+2,44+y,'#a89870');
  P(shift([[24,36],[32,36],[28,40]],y),'#ffffff');P(shift([[23,37],[28,40],[25,41]],y),'#f4f4f4');
  P(shift([[28,39],[23,37],[23,42]],y),'#c0303a');P(shift([[28,39],[33,37],[33,42]],y),'#c0303a');R(27,38+y,3,3,'#a02030');Ln(27,41+y,26,45+y,'#a02030');Ln(29,41+y,30,45+y,'#a02030');return;}
 if(b==='goddess'){
  // A cosmos glimmers inside the gown's open front, above white stockings with tiny wings.
  P([[25,48],[31,48],[40,71],[16,71]],'#2a1a5a');P([[26,52],[30,52],[36,71],[20,71]],'#3a2a78');for(const [x,yy]of [[24,58],[32,60],[27,64],[21,68],[35,68],[29,55],[19,70],[37,70],[26,69]])put(x,yy,yy%2?'#ffffff':'#e0c8ff');
  for(const [i,x]of [[0,23],[1,29]]){const d=i?walk:-walk;R(x+d*.5,54,4,15,'#f4f0f8');R(x+3+d*.5,54,1,15,'#d8d0e0');P([[x+d*.5,66],[x-3+d*.5,63],[x-1+d*.5,67]],'#ffffff');R(x+d*.5,69,4,2,'#f4f0f8');}
  // Layered white gown edged in black, sweeping down to the floor on either side.
  for(const s of [-1,1]){const X=d=>28+s*d;for(const [top,inner,out]of [[46,3,13],[52,6,16],[58,9,18]]){P([[X(inner),top],[X(out-6),top],[X(out)+walk*.4,top+12],[X(inner+3)+walk*.3,top+12]],'#ffffff');Ln(X(inner+3)+walk*.3,top+12,X(out)+walk*.4,top+12,'#2a2a3a');Ln(X(out-6),top,X(out)+walk*.4,top+12,'#e0d8e8');}}
  P(shift([[21,37],[35,37],[34,49],[22,49]],y),'#d8d0dc');P(shift([[22,38],[34,38],[33,48],[23,48]],y),'#ffffff');R(23,47+y,10,2,'#f4c0dc');
  // A short white capelet over the shoulders.
  P(shift([[17,37],[39,37],[42,45],[36,44],[28,46],[20,44],[14,45]],y),'#e8e0ec');P(shift([[18,38],[38,38],[40,44],[35,43],[28,45],[21,43],[16,44]],y),'#ffffff');Ln(14,45+y,20,44+y,'#a898b8');Ln(36,44+y,42,45+y,'#a898b8');
  put(28,39+y,'#f8b8d4');return;}
 if(b==='pinafore'){
  legs(r,m,{top:56,sock:'#ffffff',sockTop:61,shoe:'#c0303a',strap:true});
  // A white blouse with a rounded collar under a rose pinafore dress to the knee.
  R(21,37+y,15,6,'#ffffff');P(shift([[23,36],[28,39],[25,40]],y),'#f4f0f4');P(shift([[33,36],[28,39],[31,40]],y),'#f4f0f4');put(28,38+y,'#c0303a');
  P(shift([[21,40],[35,40],[36,47],[20,47]],y),'#c8608a');P(shift([[22,41],[34,41],[35,46],[21,46]],y),'#e888b0');for(const x of [23,33])Ln(x,37+y,x,41+y,'#c8608a');
  P([[20,47],[36,47],[40+walk*.4,58],[16+walk*.4,58]],'#c8608a');P([[21,48],[35,48],[38+walk*.4,57],[18+walk*.4,57]],'#e888b0');R(25,50,6,4,'#c8608a');R(26,51,4,2,'#f4a8c8');
  for(const x of [24,32])put(x,43+y,'#ffffff');
  // A yellow satchel on a strap across the body.
  Ln(35,38+y,22,49,'#c89830');R(18,48,6,5,'#e8c040');R(19,48,4,1,'#f8e080');put(21,50,'#a07820');return;}
 if(b==='nightdress'){
  for(const x of [22,30]){R(x-1-walk*.3,66,7,4,'#ffffff');R(x-walk*.3,64,2,3,'#ffffff');R(x+3-walk*.3,64,2,3,'#ffffff');put(x-walk*.3,65,'#f8b8d0');put(x+3-walk*.3,65,'#f8b8d0');put(x+2-walk*.3,67,'#3a2a3a');}
  // A long nightdress with frilled collar and hem and a red ribbon.
  P([[19,40],[37,40],[41+walk*.4,65],[15+walk*.4,65]],'#d8a0b8');P([[20,41],[36,41],[39+walk*.4,64],[17+walk*.4,64]],'#f8d0e0');for(let x=16;x<41;x+=3)r.rect(x+walk*.4,64,2,2,'#ffffff');for(const fx of [-5,1,7])Ln(28+fx*.5,44,28+fx*1.2+walk*.4,62,'#fff0f6');
  P(shift([[21,37],[35,37],[36,42],[20,42]],y),'#f8d0e0');for(let x=21;x<36;x+=2){put(x,37+y,'#ffffff');put(x+1,38+y,'#ffffff');}
  R(25,40+y,7,3,'#e04a5a');R(27,40+y,3,3,'#b02a3a');Ln(27,43+y,26,47+y,'#e04a5a');Ln(29,43+y,30,47+y,'#e04a5a');return;}
 if(b==='bathrobe'){
  legs(r,m,{top:57,shoe:'#f8b8d0'});
  P([[19,40],[37,40],[39+walk*.4,59],[17+walk*.4,59]],'#d890ac');P([[20,41],[36,41],[38+walk*.4,58],[18+walk*.4,58]],'#f8b8d0');for(let x=18;x<39;x+=2)r.put(x+walk*.4,58,'#ffffff');
  P(shift([[20,37],[36,37],[37,42],[19,42]],y),'#f8b8d0');P(shift([[24,37],[32,37],[28,43]],y),SK.base);Ln(24,37+y,29,45+y,'#ffffff',2);Ln(32,37+y,28,42+y,'#ffffff',2);
  R(19,47+y,18,2,'#ffffff');Ln(31,49+y,33,55,'#ffffff');for(const [x,yy]of [[22,51],[34,53],[25,55]])put(x,yy,'#ffe0ec');return;}
 // Swimwear: bare shoulders and legs.
 legs(r,m,{top:53,shoe:b==='ruffles'?'#f8a0c4':'#f070a8',strap:true});R(20,37+y,17,3,SK.base);R(20,39+y,17,1,SK.shade);
 if(b==='swimdress'){
  P(shift([[21,40],[35,40],[36,48],[20,48]],y),'#c8508a');P(shift([[22,41],[34,41],[35,47],[21,47]],y),'#f080b0');for(const x of [23,33])Ln(x,37+y,x,40+y,'#c8508a');
  P([[19,48],[37,48],[41+walk*.4,55],[15+walk*.4,55]],'#c8508a');P([[20,49],[36,49],[39+walk*.4,54],[17+walk*.4,54]],'#f080b0');
  for(const [x,yy]of [[24,43],[31,45],[27,46],[22,51],[30,52],[35,50],[26,53]])put(x,yy+(yy<48?y:0),'#ffffff');R(26,40+y,5,2,'#e04a5a');put(28,40+y,'#b02a3a');return;}
 // Ruffles: a white top with pink ruffled straps and layered pink ruffle bottoms.
 P(shift([[21,40],[35,40],[36,47],[20,47]],y),'#d8d0dc');P(shift([[22,41],[34,41],[35,46],[21,46]],y),'#ffffff');
 for(let x=19;x<38;x+=2){put(x,39+y,'#f8a0c4');put(x+1,40+y,'#f070a8');}R(23,47+y,11,3,SK.base);
 for(const [yy,k]of [[49,0],[52,1]]){P([[19-k,yy],[37+k,yy],[39+k+walk*.4,yy+4],[17-k+walk*.4,yy+4]],k?'#f070a8':'#f8a0c4');for(let x=17-k;x<40+k;x+=3)put(x+walk*.4,yy+4,'#ffffff');}
}
function arms(r,m,L){
 const {y,cast,pose,walk}=m,{rect:R,line:Ln,poly:P}=r,S=L.sleeve,pray=['hope','ascend','ultimate'].includes(pose);
 // At rest her arms hang at her sides; the aimed bow arm is drawn with the bow itself.
 const plan=pray?[[19,39,23,45,27,42],[37,39,33,45,30,42]]:cast?[[19,39,17,46,16,52],[37,39,39,45,34,42]]:[[19,39,17,46,16,52+walk*.3],[37,39,39,46,40,52-walk*.3]];
 for(const [sx,sy,ex,ey,hx,hy]of plan){
  const up=S?.upper,fo=S?.fore;
  if(up){Ln(sx,sy+y,ex,ey+y,up[0],5);Ln(sx,sy+y,ex,ey-1+y,up[1],3);}else{Ln(sx,sy+y,ex,ey+y,SK.shade,4);Ln(sx,sy+y,ex,ey-1+y,SK.base,3);}
  if(fo){Ln(ex,ey+y,hx,hy+y,fo[0],4);Ln(ex,ey+y,hx,hy-1+y,fo[1],3);}else{Ln(ex,ey+y,hx,hy+y,SK.shade,4);Ln(ex,ey+y,hx,hy-1+y,SK.base,3);}
  if(S?.cuff)R(hx-2,hy-1+y,4,2,S.cuff);
  const glove=L.body==='magical'||L.body==='goddess';R(hx-1,hy+y,3,3,glove?'#ffffff':SK.base);R(hx-1,hy+2+y,3,1,glove?'#d8d0dc':SK.shade);
  // Round puffed shoulders or the goddess's capelet sit over the arm.
  if(S?.puff){r.poly(shift([[sx-3,37],[sx+3,37],[sx+4,42],[sx-4,42]],y),'#d8d0dc');r.poly(shift([[sx-2,38],[sx+2,38],[sx+3,41],[sx-3,41]],y),'#ffffff');}
 }
}
const cache=new Map();
export function madokaPixels({frame=0,moving=false,pose='',attack=false,expression='neutral',blink=false,skin='default'}={}){
 const look=LOOKS[skin]?skin:'default',key=[frame,moving,pose,attack,expression,blink,look].join(':');if(cache.has(key))return cache.get(key);
 const mo=motion({frame,moving}),m={frame:((frame%4)+4)%4,moving,pose,attack,expression,blink,walk:mo.walk*2,y:mo.y,cast:attack},L=LOOKS[look],r=canvas();
 hairBack(r,m,L);body(r,m,L);arms(r,m,L);face(r,m,L);hairFront(r,m,L);
 if(L.body==='goddess'){// The capelet covers the upper arms.
  const {poly:P,line:Ln}=r,y=m.y;P(shift([[17,37],[23,37],[22,43],[14,45]],y),'#e8e0ec');P(shift([[39,37],[33,37],[34,43],[42,45]],y),'#e8e0ec');Ln(14,45+y,20,44+y,'#a898b8');Ln(36,44+y,42,45+y,'#a898b8');}
 const result=selout(r.pixels,c.ink);cache.set(key,result);return result;
}
