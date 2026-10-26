import {raster,outline} from './pixel-characters.js';
import {mix} from './hero-kit.js';
// Esdeath, from the reference art: knee-length light-blue hair that deepens toward
// the tips, uneven bangs with one strand falling between her eyes, sharp half-lidded
// blue eyes, a faint confident smile at rest, a cruel grin in a fight and a wide-eyed
// sadistic smile when she unleashes Mahapadma.
const INK='#26304a',SKIN='#f6d9c6',SKIN_LIGHT='#ffe9da',SKIN_SHADE='#d6aa98',LASH='#1e2740';
export const ESDEATH_COLORS={hair:'#a9d8f1',hairMid:'#82b8e8',hairDeep:'#5a88d4',hairShade:'#3d62a6',hairLight:'#e2f4ff',iris:'#3f86d6',irisDark:'#1f4588'};
const C=ESDEATH_COLORS;

// ---- Hair ----
function backHair(r,y,walk){
 const {poly:P,line:L}=r,w=walk*.6;
 // Long straight curtain, light at the crown and deep blue by the knees.
 P([[15,20+y],[18,10+y],[24,6+y],[33,6+y],[39,10+y],[42,20+y],[43,40],[45+w,60],[42+w,70],[14+w,70],[11+w,60],[13,40]],C.hairShade);
 P([[16,20+y],[19,11+y],[24,8+y],[33,8+y],[38,11+y],[41,20+y],[42,40],[43+w,59],[41+w,68],[15+w,68],[13+w,59],[14,40]],C.hairDeep);
 P([[16,20+y],[19,11+y],[24,8+y],[33,8+y],[38,11+y],[41,20+y],[41,36],[42+w*.6,50],[14+w*.6,50],[15,36]],C.hairMid);
 P([[16,20+y],[19,11+y],[24,8+y],[33,8+y],[38,11+y],[41,20+y],[40,32],[16,32]],C.hair);
 for(const x of [17,39])L(x,30,x+w*.6,62,C.hairLight);
 for(const x of [20,36])L(x,40,x+w*.8,66,C.hairShade);
}
function frontHair(r,y){
 const {poly:P,line:L}=r;
 // Fringe to the lashes with uneven locks, side locks framing her face to the chest.
 P([[16,26+y],[16,15+y],[21,9+y],[28,7+y],[35,9+y],[40,15+y],[40,26+y],[38,24+y],[36,21+y],[34,24+y],[31,21+y],[29,23+y],[27,21+y],[24,24+y],[22,21+y],[19,24+y]],C.hairMid);
 P([[17,24+y],[17,15+y],[22,10+y],[28,8+y],[34,10+y],[39,15+y],[39,24+y],[37,21+y],[35,19+y],[33,22+y],[31,19+y],[29,21+y],[27,19+y],[24,22+y],[22,19+y],[19,22+y]],C.hair);
 L(21,12+y,27,9+y,C.hairLight);L(29,9+y,34,11+y,C.hairLight);for(const x of [23,32])L(x,13+y,x,20+y,C.hairMid);
 // The strand that falls between her eyes.
 L(28,20+y,28,29+y,C.hair);L(29,21+y,29,27+y,C.hairMid);
 for(const [x,d]of [[16,-1],[38,1]]){P([[x,20+y],[x+2,20+y],[x+2+d,44],[x+d,46],[x-1+d,40]],C.hairMid);P([[x,21+y],[x+1,21+y],[x+1+d,42],[x+d,43]],C.hair);}
}
function cap(r,y,pal){
 const {poly:P,rect:R,line:L}=r;
 // Peaked officer's cap: white crown, black band and visor, dark cross emblem.
 P([[15,11+y],[18,6+y],[28,5+y],[38,6+y],[41,11+y],[37,12+y],[19,12+y]],pal.shade);
 P([[16,10+y],[19,7+y],[28,6+y],[37,7+y],[40,10+y],[36,11+y],[20,11+y]],pal.main);L(20,7+y,27,6+y,pal.light);
 R(18,11+y,20,2,'#1f2029');P([[18,13+y],[38,13+y],[36,15+y],[20,15+y]],'#2c2e3a');L(21,14+y,35,14+y,'#4a4c5c');
 // Small dark badge on the crown.
 R(27,7+y,2,3,'#2a2c38');R(26,8+y,4,1,'#2a2c38');r.put(28,8+y,'#9aa2ae');
}

// ---- Face ----
function face(r,{y,blink,expression,cast,blush}){
 const {poly:P,rect:R,line:L,put}=r,hurt=expression==='hurt',ult=expression==='ultimate',focus=(cast||expression==='focused')&&!ult;
 P([[19,19+y],[24,14+y],[33,15+y],[37,21+y],[36,29+y],[31,34+y],[25,34+y],[20,30+y],[18,25+y]],SKIN_SHADE);
 P([[21,20+y],[25,17+y],[32,17+y],[35,22+y],[34,29+y],[30,32+y],[25,31+y],[21,27+y]],SKIN_LIGHT);
 R(18,24+y,3,4,SKIN);R(35,24+y,3,4,SKIN);
 for(const [x,side]of [[21,-1],[31,1]]){
  const outer=side<0?x-1:x+4;
  if(hurt){L(x,25+y,x+3,26+y,LASH);L(x,27+y,x+3,26+y,LASH);continue;}
  if(blink){L(x,27+y,x+3,27+y,LASH);put(outer,26+y,LASH);continue;}
  // Heavy, half-lowered upper lid; wide open only when she lets loose.
  const top=ult?25:26,rows=ult?3:focus?1:2;
  L(x,top-1+y,x+3,top-1+y,LASH);put(outer,top+y,LASH);L(side<0?x-1:x+2,top-2+y,side<0?x+1:x+4,top-2+y,LASH);
  R(x,top+y,4,rows,'#f4f9ff');R(x+1,top+y,2,rows,C.iris);R(x+1,top+y,2,1,C.irisDark);if(rows>1)put(x+(side<0?2:1),top+1+y,'#cfeaff');
  if(focus)L(x,top+1+y,x+3,top+1+y,mix(LASH,SKIN,.5));
 }
 if(blush&&!hurt)for(const x of [20,21,34,35])put(x,29+y,mix('#e88a9a',SKIN,.35));
 // Mouth: a faint confident smile, a cruel grin, a sadistic laugh, or a grimace.
 const lip='#b06a76',dark='#6a2a3a',teeth='#fbf6f2';
 if(hurt){L(26,31+y,29,31+y,teeth);L(26,32+y,29,32+y,dark);put(25,32+y,dark);put(30,32+y,dark);}
 else if(ult){put(24,30+y,dark);put(31,30+y,dark);L(25,31+y,30,31+y,teeth);L(25,32+y,30,32+y,dark);L(26,33+y,29,33+y,'#c0606e');}
 else if(focus){put(25,30+y,lip);put(30,30+y,lip);L(26,31+y,29,31+y,teeth);L(26,32+y,29,32+y,dark);}
 else{L(26,32+y,29,32+y,lip);put(30,31+y,lip);put(25,31+y,mix(lip,SKIN,.5));}
}

// ---- Weapons ----
function rapier(r,hx,hy,tx,ty,{ice=false}={}){
 const {line:L,rect:R}=r,blade=ice?'#bfe8ff':'#dfe6ee';
 L(hx,hy,tx,ty,ice?'#6fb4e8':'#8f9aaa',2);L(hx,hy,tx,ty,blade);R(hx-2,hy-1,5,2,'#c9a45a');R(hx-1,hy,3,3,'#2a2c38');
}
function iceShards(r){
 const {poly:P,put}=r;
 for(const [x,y,h]of [[6,30,8],[48,28,9],[10,12,6],[45,10,7],[3,52,6],[51,50,6]]){P([[x,y-h],[x+2,y],[x,y+2],[x-2,y]],'#9fd8f4');put(x,y-h+2,'#f2fbff');}
}

// ---- Outfits ----
const UNIFORM={main:'#f2f5f8',shade:'#c3ccd8',light:'#ffffff'},MIDNIGHT={main:'#455c80',shade:'#293b61',light:'#8ca5c0'};
const BLACK='#22232e',BLACK_LIGHT='#4a4c5c';
function uniform(pal){
 return {
  cap:pal,sleeve:{color:BLACK,shade:'#14151c',cuff:BLACK_LIGHT},
  back(r,y,walk){
   // Long dark cape with a ruffled hem, worn behind the hair.
   const w=walk*.5;r.poly([[18,35+y],[38,35+y],[46+w,64],[44+w,70],[38,67],[33,71],[28,67],[23,71],[18,67],[12+w,70],[10+w,64]],'#1d2540');
   r.poly([[19,36+y],[37,36+y],[44+w,63],[40+w,67],[34,65],[28,64],[22,65],[16+w,67],[12+w,63]],'#2e3a63');
  },
  legs(r,x,d){
   // Thigh-high boots with laced black garter tops.
   r.poly([[x,50],[x+6,50],[x+6+d,68],[x+4+d,71],[x-1+d,71],[x-1+d,66]],pal.shade);r.rect(x+1,51,4,16,pal.main);r.line(x+1,52,x+1+d,66,pal.light);
   r.rect(x-1,49,7,3,BLACK);r.put(x+1,50,pal.main);r.put(x+3,50,pal.main);r.put(x+2,51,pal.main);r.rect(x-1+d,70,6,1,'#1f2029');
  },
  body(r,y,walk){
   const {poly:P,rect:R,line:L,put}=r;
   // Short flared dress skirt with a front slit.
   P([[20,43],[36,43],[40+walk*.3,52],[16+walk*.3,52]],pal.shade);P([[21,43],[35,43],[38+walk*.3,51],[18+walk*.3,51]],pal.main);
   L(28,45,28+walk*.3,51,pal.shade);L(23,45,21+walk*.3,50,pal.light);
   // Double-breasted bodice open at the chest, black lapels, choker and cross buckle.
   P([[20,34+y],[25,32+y],[32,32+y],[37,34+y],[36,44],[20,44]],pal.shade);P([[21,34+y],[25,33+y],[32,33+y],[36,35+y],[35,43],[21,43]],pal.main);
   P([[25,33+y],[31,33+y],[28,38+y]],SKIN);put(28,36+y,SKIN_SHADE);
   P([[23,33+y],[25,33+y],[28,38+y],[27,39+y]],BLACK);P([[31,33+y],[33,33+y],[29,39+y],[28,38+y]],BLACK);
   put(25,41+y,'#2a2c38');put(31,41+y,'#2a2c38');
   R(20,43,17,2,BLACK);R(27,42,3,4,BLACK);R(26,43,5,2,BLACK);put(28,43,'#9aa2ae');
   R(25,31+y,7,2,BLACK);put(28,32+y,'#9aa2ae');
  },
  shoulders(r,y){
   // White puffed caps over the black sleeves.
   for(const s of [-1,1]){const p=(x,yy)=>[28+s*x,yy+y];r.poly([p(6,34),p(9,32),p(13,33),p(12,38),p(7,38)],pal.shade);r.poly([p(7,34),p(9,33),p(12,34),p(11,37)],pal.main);}
  },
 };
}
const LOOKS={
 default:uniform(UNIFORM),
 winter:uniform(MIDNIGHT),
 sweater:{
  // Winter Knit: ribbed cream turtleneck, black pleats, thigh-highs, brown laced
  // heeled boots, a crossbody bag and a wristwatch.
  blush:true,sleeve:{color:'#efe6d6',shade:'#c9bca6',cuff:'#ded2bd'},watch:true,
  legs(r,x,d){
   r.rect(x,51,5,10,'#1f1f28');r.line(x+1,52,x+1,60,'#3a3a48');
   r.poly([[x-1,59],[x+6,59],[x+6+d,68],[x+4+d,71],[x-1+d,71]],'#8a4a2e');r.rect(x,60,5,8,'#a85f3a');for(let yy=61;yy<67;yy+=2)r.line(x+1,yy,x+3,yy+1,'#f0d8b8');r.rect(x+4+d,70,2,1,'#3a2418');r.rect(x-1+d,71,6,1,'#3a2418');
  },
  body(r,y,walk){
   const {poly:P,rect:R,line:L}=r;
   P([[20,46],[36,46],[40+walk*.3,54],[16+walk*.3,54]],'#14151c');P([[21,46],[35,46],[38+walk*.3,53],[18+walk*.3,53]],'#24252f');
   for(const a of [-6,-2,2,6])L(28+a*.6,47,28+a*1.5+walk*.3,53,'#3a3b48');
   P([[20,33+y],[25,31+y],[32,31+y],[37,33+y],[37,48],[19,48]],'#c9bca6');P([[21,33+y],[25,32+y],[32,32+y],[36,34+y],[36,47],[20,47]],'#efe6d6');
   for(let x=22;x<36;x+=2)L(x,35+y,x,46,'#ddd0bb');R(24,30+y,9,4,'#efe6d6');for(let x=25;x<32;x+=2)L(x,30+y,x,33+y,'#ddd0bb');
   R(19,46,19,2,'#1f1f28');R(30,46,4,2,'#9aa2ae');R(31,46,2,2,'#1f1f28');
   // Crossbody strap and bag at the hip.
   L(33,32+y,20,47,'#3a2a24',2);P([[14,46],[22,46],[23,53],[13,53]],'#8a4a2e');R(15,47,7,2,'#a85f3a');R(17,49,2,2,'#c9a45a');
  },
 },
 blackdress:{
  // Midnight Lace: long-sleeved black lace dress with a sheer scalloped hem.
  sleeve:{color:'#24252f',shade:'#14151c',cuff:'#4a4c5c'},
  legs(r,x,d){r.rect(x,58,5,9,SKIN);r.rect(x+1,59,2,7,SKIN_LIGHT);r.rect(x-1+d,67,7,3,'#1a1a22');r.rect(x+4+d,70,2,1,'#1a1a22');},
  body(r,y,walk){
   const {poly:P,rect:R,line:L,put}=r;
   P([[20,33+y],[25,31+y],[32,31+y],[37,33+y],[38,46],[42+walk*.4,60],[14+walk*.4,60],[18,46]],'#14151c');
   P([[21,33+y],[25,32+y],[32,32+y],[36,34+y],[37,46],[40+walk*.4,59],[16+walk*.4,59],[19,46]],'#24252f');
   for(let x=15+walk*.4;x<41+walk*.4;x+=3){put(x,59,'#4a4c5c');put(x+1,60,'#4a4c5c');}
   for(const [x,yy]of [[23,40],[31,38],[26,50],[34,52],[20,55]]){put(x,yy,'#4a4c5c');put(x+1,yy+1,'#4a4c5c');}
   P([[25,32+y],[31,32+y],[28,36+y]],SKIN);R(25,30+y,7,2,'#14151c');R(19,45,19,2,'#3a3b48');
  },
 },
 casual:{
  // City Stroll: navy peacoat over a white blouse, slim dark trousers, ankle boots.
  sleeve:{color:'#2f3e66',shade:'#1d2846',cuff:'#4a5a86'},
  legs(r,x,d){r.poly([[x,50],[x+5,50],[x+5+d,66],[x+d,66]],'#22263a');r.line(x+1,51,x+1+d,64,'#3a4058');r.rect(x-1+d,66,7,4,'#3a2a24');r.rect(x-1+d,69,7,1,'#1a1410');},
  body(r,y){
   const {poly:P,rect:R,line:L,put}=r;
   P([[19,33+y],[25,31+y],[32,31+y],[38,33+y],[39,54],[17,54]],'#1d2846');P([[20,33+y],[25,32+y],[32,32+y],[37,34+y],[38,53],[18,53]],'#2f3e66');
   P([[24,32+y],[32,32+y],[31,46],[25,46]],'#f4f6f8');P([[24,32+y],[28,36+y],[32,32+y]],'#ffffff');
   L(24,33+y,25,53,'#1d2846');L(31,33+y,31,53,'#1d2846');for(const yy of [40,46])for(const x of [22,34])put(x,yy,'#c9a45a');
   R(17,46,22,2,'#24304e');
  },
 },
 pajamas:{
  // Snowflake Nightgown: long pale-blue gown with snowflakes and a frilled hem.
  sleeve:{color:'#cfe4f6',shade:'#9bbcdc',cuff:'#ffffff'},
  legs(r,x,d){r.rect(x-1+d,66,7,4,'#ffffff');r.rect(x+d,66,5,1,'#cfe4f6');r.rect(x-1+d,69,7,1,'#b9c8d6');},
  body(r,y,walk){
   const {poly:P,rect:R,line:L,put}=r;
   P([[20,33+y],[25,31+y],[32,31+y],[37,33+y],[40,48],[44+walk*.4,66],[12+walk*.4,66],[16,48]],'#9bbcdc');
   P([[21,33+y],[25,32+y],[32,32+y],[36,34+y],[39,48],[42+walk*.4,65],[14+walk*.4,65],[17,48]],'#cfe4f6');
   for(let x=13+walk*.4;x<44+walk*.4;x+=3){R(x,65,2,2,'#ffffff');put(x+2,66,'#e4eef8');}
   for(const [x,yy]of [[22,44],[33,48],[26,56],[36,60],[19,60]]){L(x-1,yy,x+1,yy,'#ffffff');L(x,yy-1,x,yy+1,'#ffffff');}
   R(22,31+y,13,2,'#ffffff');R(21,44,15,1,'#ffffff');
  },
 },
 swimsuit:{
  // Glacial Tide: navy one-piece with ice-blue wave stripes and a snowflake, sheer sarong.
  legs(r,x,d){r.rect(x,49,5,18,SKIN);r.rect(x+1,50,2,16,SKIN_LIGHT);r.rect(x-1+d,67,7,3,'#cfe4f6');r.rect(x+d,67,5,1,'#3f86d6');},
  body(r,y,walk){
   const {poly:P,rect:R,line:L,put}=r;
   R(21,33+y,15,6,SKIN);R(22,34+y,13,4,SKIN_LIGHT);
   P([[21,37+y],[35,37+y],[36,46],[33,50],[23,50],[20,46]],'#1d2846');P([[22,37+y],[34,37+y],[35,46],[32,49],[24,49],[21,46]],'#2f3e66');
   for(const yy of [42,45])for(let x=22;x<35;x++)put(x,yy+((x%4)<2?0:1),'#8ccdf2');
   L(27,39+y,29,39+y,'#ffffff');L(28,38+y,28,40+y,'#ffffff');L(23,34+y,23,37+y,'#2f3e66');L(33,34+y,33,37+y,'#2f3e66');
   P([[30,48],[37,47],[40+walk,62],[32+walk,60]],mix('#9fd0f0','#ffffff',.35));R(34,46,3,3,'#3f86d6');
  },
 },
 bikini:{
  // Frostflower Bikini: white-and-blue bikini with snowflake flowers, a flower clip.
  legs(r,x,d){r.rect(x,48,5,19,SKIN);r.rect(x+1,49,2,17,SKIN_LIGHT);r.rect(x-1+d,67,7,3,'#ffffff');r.rect(x+d,67,5,1,'#3f86d6');},
  body(r,y){
   const {poly:P,rect:R,put}=r;
   R(21,33+y,15,16,SKIN);R(22,34+y,13,14,SKIN_LIGHT);put(28,45,SKIN_SHADE);
   for(const x of [22,29]){P([[x,37+y],[x+5,37+y],[x+4,41+y],[x+1,41+y]],'#3f86d6');put(x+2,38+y,'#ffffff');put(x+2,39+y,'#cfeaff');}
   P([[21,47],[35,47],[34,50],[22,50]],'#3f86d6');R(27,48,2,1,'#ffffff');R(21,47,1,2,'#ffffff');R(35,47,1,2,'#ffffff');
  },
  after(r,y){r.rect(37,14+y,3,3,'#ffffff');r.put(38,15+y,'#3f86d6');},
 },
 bathsuit:{
  // Polar Pool One-Piece: white high-neck suit with navy trim and a blue snowflake.
  legs(r,x,d){r.rect(x,50,5,17,SKIN);r.rect(x+1,51,2,15,SKIN_LIGHT);r.rect(x-1+d,67,7,3,'#2f3e66');r.rect(x+d,67,5,1,'#8ccdf2');},
  body(r,y){
   const {poly:P,rect:R,line:L}=r;
   P([[21,31+y],[35,31+y],[36,46],[33,51],[23,51],[20,46]],'#c3ccd8');P([[22,31+y],[34,31+y],[35,46],[32,50],[24,50],[21,46]],'#f6f8fa');
   R(23,31+y,11,2,'#2f3e66');L(21,46,24,50,'#2f3e66');L(35,46,32,50,'#2f3e66');
   L(26,40+y,30,40+y,'#3f86d6');L(28,38+y,28,42+y,'#3f86d6');L(26,38+y,30,42+y,'#8ccdf2');L(30,38+y,26,42+y,'#8ccdf2');
  },
 },
};

export function esdeathPixels({frame=0,moving=false,pose='',attack=false,expression='neutral',blink=false,skin='default'}={}){
 frame=((frame%4)+4)%4;
 const look=LOOKS[skin]||LOOKS.default,special=!!pose;
 if(special&&expression!=='hurt')expression='ultimate';
 const r=raster(),{rect:R,line:L}=r,walk=moving?[0,1.5,0,-1.5][frame]:0,y=moving?-(frame%2):0,cast=attack||special;
 look.back?.(r,y,walk);
 backHair(r,y,walk);
 for(const [x,d]of [[21,-walk],[30,walk]])look.legs(r,x,d);
 look.body(r,y,walk);
 // Arms: hand on hip with the rapier at her side; thrust on attack; both raised to
 // summon ice for her ultimate.
 const lx=special?11:cast?13:22,ly=special?24:cast?44:45,rx=special?45:cast?47:41,ry=special?24:cast?37:49;
 for(const [sx,sy,hx,hy,elbow]of [[19,37+y,lx,ly,!cast&&!special],[37,37+y,rx,ry,false]]){
  const mx=elbow?14:Math.round((sx+hx)/2),my=elbow?43:Math.round((sy+hy)/2);
  for(const [ax,ay,bx,by]of [[sx,sy,mx,my],[mx,my,hx,hy]]){L(ax,ay,bx,by,SKIN_SHADE,5);L(ax,ay,bx,by-1,SKIN,3);
   if(look.sleeve){L(ax,ay,bx,by,look.sleeve.shade,5);L(ax,ay,bx,by-1,look.sleeve.color,3);}}
  if(look.sleeve)R(hx-2,hy-2,5,2,look.sleeve.cuff);
  R(hx-1,hy-1,4,4,SKIN_LIGHT);
  if(look.watch&&sx<28)R(hx-2,hy-3,5,2,'#5a3a2a');
 }
 look.shoulders?.(r,y);
 if(special){iceShards(r);rapier(r,rx,ry,rx+4,ry-16,{ice:true});}
 else if(cast)rapier(r,rx,ry,54,30,{ice:true});
 else rapier(r,rx+1,ry+2,47,70);
 R(25,30+y,7,5,SKIN);R(26,31+y,4,3,SKIN_LIGHT);
 face(r,{y,blink,expression,cast,blush:look.blush});
 frontHair(r,y);
 if(look.cap)cap(r,y,look.cap);
 look.after?.(r,y);
 return outline(r.pixels,INK);
}
