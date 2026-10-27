import {canvas,motion,limb,selout,mix} from './hero-kit.js';
// Shiraori: pale skin, long lavender-white hair falling in loose strands over her face,
// a long braid over her left shoulder, glowing red eyes and a red choker. Her base look
// is the white hooded robe: wide bell sleeves with lilac diamond inlays and gold cuffs,
// a beige under-bust band and belt, a long trailing cloak and frilled white socks.
export const SHIRAORI_ART={ink:'#2a2433',hair:'#e4dcef',hairDark:'#9e8eb8',hairLight:'#ffffff',hairMid:'#c4b6d8',eye:'#e2303e',eyeDark:'#8a1020'};
const c=SHIRAORI_ART,SK={base:'#fbeee8',shade:'#e0c4c4',deep:'#c49aa0',light:'#ffffff'};
const ROBE=['#9c8e7c','#e6dccc','#fff8ee'],TRIM='#d6bfa0',TRIM_DARK='#a88e70',LILAC='#d8a8d8',GOLD='#e6cf7a',CHOKER='#c8283a';
const shift=(pts,y)=>pts.map(([x,yy])=>[x,yy+y]);
function layer(r,pts,[dark,mid,light],y=0){const p=shift(pts,y);r.poly(p,dark);const cx=p.reduce((s,q)=>s+q[0],0)/p.length,cy=p.reduce((s,q)=>s+q[1],0)/p.length;r.poly(p.map(([x,yy])=>{const dx=cx-x,dy=cy-yy,l=Math.hypot(dx,dy)||1;return [x+dx/l,yy+dy/l];}),mid);if(light){const left=[...p].sort((a,b)=>a[0]-b[0]).slice(0,2);r.line(left[0][0]+1,left[0][1],left[1][0]+1,left[1][1],light);}}

// ---- Shared head: long hair behind, face with spider-red eyes, strands and braid ----
function hairBack(r,m,{long=true}={}){
 const {y,walk}=m,H=[c.hairDark,c.hair,c.hairLight];
 layer(r,[[15,18],[20,9],[36,9],[41,18],[42,34],[44+walk,52],[41+walk,60],[36,54],[31,44],[25,44],[20,54],[15-walk,60],[12-walk,52],[14,34]].map(([x,yy])=>[x,long||yy<40?yy:Math.min(yy,46)]),H,y);
 r.line(15,30+y,14-walk,52,c.hairLight);r.line(41,30+y,43+walk,50,c.hairDark);r.line(17,34+y,17-walk,54,c.hairMid);r.line(39,34+y,40+walk,54,c.hairMid);
}
function face(r,m){
 const {y,blink,expression,cast}=m,{rect:R,line:L,poly:P,put}=r,ink=c.ink,hurt=expression==='hurt',focus=cast||expression==='focused'||expression==='ultimate';
 R(25,36+y,6,4,SK.shade);
 P([[18,19+y],[38,19+y],[38,29+y],[36,34+y],[31,38+y],[25,38+y],[20,34+y],[18,29+y]],SK.shade);
 P([[19,19+y],[37,19+y],[37,29+y],[35,33+y],[30,37+y],[26,37+y],[21,33+y],[19,29+y]],SK.base);
 R(36,25+y,1,4,SK.shade);
 for(const [x,side]of [[21,-1],[31,1]]){
  if(blink){L(x,29+y,x+3,29+y,ink);put(side<0?x-1:x+4,28+y,ink);continue;}
  if(hurt){L(x,27+y,x+3,29+y,ink);L(x,29+y,x+3,27+y,ink);continue;}
  // Large crimson eyes with a ring of tiny highlights, like her spider's many eyes.
  R(x,27+y,4,4,'#fff6f4');R(x+(side<0?1:0),27+y,3,4,c.eye);R(x+(side<0?1:0),27+y,3,1,c.eyeDark);
  put(x+(side<0?2:1),29+y,'#5a0610');put(x+(side<0?1:0),28+y,'#ffc8cc');put(x+(side<0?3:2),29+y,'#ffb0b8');put(x+(side<0?2:1),30+y,'#ff8a96');
  L(x-(side<0?1:0),26+y,x+3+(side>0?1:0),26+y,ink);if(focus)L(x-(side<0?1:0),25+y,x+3+(side>0?1:0),side<0?26+y:25+y,ink);else put(side<0?x-1:x+4,27+y,ink);
 }
 R(20,32+y,2,1,mix(SK.deep,SK.base,.4));R(35,32+y,2,1,mix(SK.deep,SK.base,.4));
 // A small open mouth: her blank, faintly surprised look; a gentle smile when focused.
 if(hurt){R(26,34+y,4,2,'#7a2a3a');put(27,34+y,'#fff4ee');}
 else if(expression==='ultimate'){R(26,33+y,4,3,'#7a2a3a');R(27,35+y,2,1,'#f0a0a8');}
 else if(focus){L(26,34+y,29,35+y,'#b0606a');put(30,34+y,'#b0606a');}
 else{R(27,33+y,3,2,'#9a3a4a');R(28,34+y,1,1,'#f2a07a');}
 // Red choker at the throat.
 R(24,37+y,9,2,CHOKER);R(25,37+y,7,1,'#ec5a66');
}
function hairFront(r,m){
 const {y,walk}=m,{poly:P,line:L}=r;
 // Loose fringe falling in long strands, one between the eyes.
 P(shift([[16,32],[15,20],[18,13],[24,9],[33,10],[39,15],[41,22],[40,33],[38,40],[36,26],[33,21],[30,25],[28,19],[27,34],[25,22],[22,26],[20,24],[19,38]],y),c.hairDark);
 P(shift([[17,28],[17,19],[21,13],[26,11],[33,12],[37,16],[39,23],[38,31],[36,23],[33,19],[30,22],[28,17],[27,30],[25,19],[22,23],[20,21],[18,33]],y),c.hair);
 L(21,15+y,27,12+y,c.hairLight);L(31,13+y,36,17+y,c.hairLight);L(28,18+y,28,29+y,c.hairLight);L(17,22+y,17,31+y,c.hairLight);
 for(const [x0,y0,x1,y1]of [[24,13,22,22],[31,14,33,20],[19,20,19,30],[37,19,38,30]])L(x0,y0+y,x1,y1+y,c.hairMid);
 // The long braid over her left shoulder, plaited in alternating segments.
 for(let i=0;i<8;i++){const yy=33+i*3+y*(i<3?1:0),x=38+(i>3?walk*.5:0)+Math.round(i*.25);P([[x,yy],[x+4,yy],[x+5,yy+2],[x+2,yy+4],[x-1,yy+2]],c.hairDark);P([[x+1,yy],[x+3,yy],[x+4,yy+2],[x+2,yy+3],[x,yy+2]],i%2?c.hairMid:c.hair);r.put(x+1+(i%2),yy+1,c.hairLight);}
 r.rect(39+walk*.5,57,4,2,c.hairDark);L(40+walk*.5,59,41+walk*.5,62,c.hair);
}

// ---- Robe pieces ----
function hood(r,m,{front}){
 const {y}=m;
 if(!front){layer(r,[[13,24],[14,13],[19,6],[28,3],[37,6],[42,13],[43,24],[42,38],[14,38]],ROBE,y);return;}
 // The hood's rim frames her face and sits low over the crown.
 const {poly:P,line:L}=r;
 P(shift([[14,30],[15,16],[20,9],[28,6],[36,9],[41,16],[42,30],[39,30],[38,17],[33,11],[28,10],[23,11],[18,17],[17,30]],y),ROBE[0]);
 P(shift([[15,29],[16,16],[21,10],[28,7],[35,10],[40,16],[41,29],[39,28],[38,18],[33,12],[23,12],[18,18],[17,28]],y),ROBE[1]);
 L(17,17+y,22,11+y,ROBE[2]);L(23,9+y,33,9+y,ROBE[2]);
}
function cloak(r,m){
 const {y,walk}=m;
 // Long trailing cloak behind the legs, flaring at the hem.
 layer(r,[[17,38],[39,38],[43+walk*.5,62],[46+walk,70],[40,71],[28,69],[16,71],[10-walk,70],[13-walk*.5,62]].map(([x,yy],i)=>[x,i<2?yy+y:yy]),ROBE);
 r.line(14-walk*.5,58,12-walk,68,ROBE[2]);r.line(42+walk*.5,58,44+walk,68,ROBE[0]);r.line(16,66,40,66,mix(ROBE[0],ROBE[1],.5));
}
function socks(r,m){
 const {walk}=m,{rect:R}=r;
 for(const [x,d]of [[22,-walk],[29,walk]]){
  R(x+d,58,5,4,SK.base);R(x+4+d,58,1,4,SK.shade);
  R(x+d,62,5,7,'#f4f2f6');R(x+4+d,62,1,7,'#c8c2d0');for(let i=0;i<5;i+=2)R(x+i+d,61,1,1,'#ffffff');R(x-1+d,62,7,1,'#e0dce6');
  R(x-1+d,69,7,2,'#d8d2e0');R(x-1+d,70,7,1,'#a8a2b4');
 }
}
function dress(r,m){
 const {y,walk}=m,{poly:P,line:L,rect:R}=r;
 layer(r,[[19,39],[37,39],[39,50],[41+walk*.4,60],[15+walk*.4,60],[17,50]].map(([x,yy],i)=>[x,i<2?yy+y:yy]),ROBE);
 // Centre slit and folds.
 L(28,48,28+walk*.3,59,ROBE[0]);L(23,49,20+walk*.4,59,ROBE[0]);L(33,49,36+walk*.4,59,ROBE[0]);L(24,50,22+walk*.4,59,ROBE[2]);L(34,51,37+walk*.4,59,mix(ROBE[0],ROBE[1],.5));
 // Square neckline with a keyhole, under-bust band and belt.
 P(shift([[24,39],[32,39],[31,42],[25,42]],y),'#f6f2f8');r.put(28,41+y,ROBE[0]);
 R(19,43+y,18,2,TRIM);R(19,44+y,18,1,TRIM_DARK);R(19,48,18,2,TRIM);R(19,49,18,1,TRIM_DARK);
}
function sleeves(r,m,{raise=0}={}){
 const {y,walk,cast,frame}=m,{poly:P,rect:R,line:L,put}=r,pulse=cast?[0,-2,0,1][frame]:0,sway=walk*.3;
 const OPEN='#7a6c5c',hands=[];
 for(let i=0;i<2;i++){
  const raised=i===1&&cast||i===0&&cast&&raise>1,X=x=>i?56-x:x;
  if(raised){
   // A raised arm: the bell sleeve falls back from the wrist toward the shoulder.
   const hx=X(10)+(i?pulse:-pulse),hy=31+pulse;
   P([[X(21),39+y],[X(16),40+y],[hx-(i?-3:3),hy+2],[hx+(i?-4:4),hy-1],[X(12),47+y],[X(19),47+y]],ROBE[0]);
   P([[X(20),40+y],[X(17),41+y],[hx-(i?-2:2),hy+2],[hx+(i?-3:3),hy],[X(13),46+y],[X(18),46+y]],ROBE[1]);
   L(X(12),46+y,X(19),46+y,OPEN);L(hx-2,hy+1,hx+2,hy+1,GOLD);R(hx-1,hy-2,3,3,SK.base);hands.push([hx,hy]);continue;
  }
  const hx=X(14)+(i?-sway:sway),hy=55+(i?-sway:sway);
  // Wide bell sleeve hanging from the shoulder past the hand.
  const pts=[[X(22),39+y],[X(17),40+y],[X(12)+(i?-sway:sway),58],[X(10)+(i?-sway:sway),62],[X(20)+(i?-sway:sway),61],[X(22),50]];
  P(pts,ROBE[0]);P([[X(21),40+y],[X(18),41+y],[X(13)+(i?-sway:sway),58],[X(12)+(i?-sway:sway),60],[X(19)+(i?-sway:sway),59],[X(21),50]],ROBE[1]);
  L(X(18),41+y,X(13)+(i?-sway:sway),57,i?ROBE[0]:ROBE[2]);L(X(21),42+y,X(20)+(i?-sway:sway),58,mix(ROBE[0],ROBE[1],.4));
  // The dark bell opening with the hand resting inside it, and a gold cuff band above.
  P([[X(11)+(i?-sway:sway),60],[X(20)+(i?-sway:sway),59],[X(20)+(i?-sway:sway),61],[X(11)+(i?-sway:sway),62]],OPEN);
  L(X(12)+(i?-sway:sway),56,X(20)+(i?-sway:sway),56,GOLD);R(hx-1,59,3,2,SK.base);
  const ex=X(17),ey=47+y;P([[ex,ey-3],[ex+2,ey],[ex,ey+3],[ex-2,ey]],LILAC);put(ex,ey,'#f4dcf4');
  hands.push([hx,hy]);
 }
 return hands;
}
function webSigil(r,x,y,{big=false}={}){
 const {line:L,put}=r,s=big?7:4,col='#c7a0e8';
 for(let i=0;i<6;i++){const a=i*Math.PI/3;L(x,y,x+Math.round(Math.cos(a)*s),y+Math.round(Math.sin(a)*s),col);}
 for(const k of [.5,1])for(let i=0;i<6;i++){const a=i*Math.PI/3,b=(i+1)*Math.PI/3;L(x+Math.round(Math.cos(a)*s*k),y+Math.round(Math.sin(a)*s*k),x+Math.round(Math.cos(b)*s*k),y+Math.round(Math.sin(b)*s*k),'#e8d4ff');}
 put(x,y,'#ffffff');
}

// ---- Outfits ----
function robeLook(r,m,{hooded}){
 if(hooded)hood(r,m,{front:false});hairBack(r,m);cloak(r,m);socks(r,m);dress(r,m);
 const hands=sleeves(r,m,{raise:m.pose?2:0});face(r,m);hairFront(r,m);if(hooded)hood(r,m,{front:true});
 return hands;
}
function casualLook(r,m){
 const {y,walk}=m,{rect:R,poly:P,line:L}=r;hairBack(r,m);
 // Black pleated skirt, black thigh socks and white sneakers.
 for(const [x,d]of [[22,-walk],[29,walk]]){R(x+d,57,5,11,'#2a2632');R(x+d,57,5,2,SK.base);R(x-1+d,68,7,3,'#f2f0f4');R(x-1+d,70,7,1,'#a8a4b0');R(x+d,68,3,1,'#c8283a');}
 P([[19,50],[37,50],[40+walk*.4,58],[16+walk*.4,58]],'#1e1a24');P([[20,51],[36,51],[38+walk*.4,57],[18+walk*.4,57]],'#34303e');for(const x of [22,26,30,34])L(x,52,x+walk*.3,57,'#4a4656');
 // Oversized white hoodie with a black spider on the chest and kangaroo pocket.
 layer(r,[[18,38],[38,38],[40,52],[16,52]],['#bdb8c6','#f2f0f4','#ffffff'],y);
 P(shift([[24,44],[32,44],[33,49],[23,49]],y),'#dcd8e2');R(25,40+y,6,1,'#dcd8e2');
 r.rect(27,40+y,3,3,'#1e1a24');for(const [x0,y0,x1,y1]of [[26,40,24,38],[30,40,32,38],[26,42,24,44],[30,42,32,44]])L(x0,y0+y,x1,y1+y,'#1e1a24');
 const pulse=m.cast?[0,-2,0,1][m.frame]:0,hands=[[14-walk*.3,53+walk*.3],[m.cast?45+pulse:41+walk*.3,m.cast?34+pulse:53-walk*.3]];
 for(const [i,[hx,hy]]of hands.entries()){const sx=i?37:19;limb(r,sx,40+y,hx,hy,{color:'#dcd8e2',light:'#ffffff',width:4,hand:SK.base,handShade:SK.shade});}
 face(r,m);hairFront(r,m);
 // Hood down at the back of the neck.
 P(shift([[19,37],[24,35],[32,35],[37,37],[33,39],[23,39]],y),'#dcd8e2');
 return hands;
}
function pajamaLook(r,m){
 const {y,walk}=m,{rect:R,poly:P,line:L}=r,PJ=['#9a84b4','#cdb8e2','#ecdcf8'];hairBack(r,m);
 // Silk pajama trousers with a web print and fluffy spider slippers.
 for(const [x,d]of [[21,-walk],[29,walk]]){R(x+d,52,6,15,PJ[0]);R(x+1+d,52,4,15,PJ[1]);L(x+1+d,55,x+5+d,59,PJ[2]);L(x+5+d,55,x+1+d,59,PJ[2]);
  R(x-1+d,67,8,4,'#3a3044');R(x-1+d,67,8,1,'#5a5068');r.put(x+1+d,68,c.eye);r.put(x+4+d,68,c.eye);}
 layer(r,[[18,38],[38,38],[39,54],[17,54]],PJ,y);
 for(const [x,yy]of [[21,42],[33,46],[24,51],[31,40]]){L(x-2,yy+y,x+2,yy+y,PJ[2]);L(x,yy-2+y,x,yy+2+y,PJ[2]);}
 R(27,39+y,2,14,PJ[0]);for(const yy of [42,46,50])r.put(28,yy+y,'#ffffff');
 const pulse=m.cast?[0,-2,0,1][m.frame]:0,hands=[[15-walk*.3,49+walk*.3],[m.cast?45+pulse:40+walk*.3,m.cast?34+pulse:52-walk*.3]];
 for(const [i,[hx,hy]]of hands.entries()){const sx=i?37:19;limb(r,sx,40+y,hx,hy,{color:PJ[0],light:PJ[2],width:5,hand:SK.base,handShade:SK.shade});}
 // A plush spider hugged in her arm.
 if(!m.cast){r.rect(10,47+y,8,6,'#f4f0f6');r.rect(11,46+y,6,1,'#f4f0f6');for(const [x0,y0,x1,y1]of [[10,49,7,47],[10,51,7,53],[17,49,20,46],[17,51,20,54]])L(x0,y0+y,x1,y1+y,'#e0dae6');r.put(12,49+y,c.eye);r.put(15,49+y,c.eye);r.put(13,48+y,c.eye);r.put(14,48+y,c.eye);}
 face(r,m);hairFront(r,m);
 // Sleep mask pushed up on her head.
 R(18,13+m.y,20,3,'#3a3044');R(22,12+m.y,4,4,'#3a3044');R(30,12+m.y,4,4,'#3a3044');r.put(23,13+m.y,c.eye);r.put(31,13+m.y,c.eye);
 return hands;
}
function swimLook(r,m){
 const {y,walk}=m,{rect:R,poly:P,line:L}=r;hairBack(r,m,{long:true});
 for(const [x,d]of [[22,-walk],[29,walk]]){R(x+d,53,5,15,SK.base);R(x+4+d,53,1,15,SK.shade);R(x-1+d,68,7,3,'#e8dcc8');R(x-1+d,70,7,1,'#b8a88a');L(x+d,67,x+4+d,69,c.eye);}
 // Black one-piece with a white web pattern.
 layer(r,[[20,39],[36,39],[37,50],[34,55],[22,55],[19,50]],['#141018','#2a2432','#4a4258'],y);
 for(const [x0,y0,x1,y1]of [[28,40,22,48],[28,40,34,48],[28,40,28,54],[22,46,34,46],[24,51,32,51]])L(x0,y0+(y0<45?y:0),x1,y1+(y1<45?y:0),'#e8e2f0');
 // Sheer white sarong tied at the hip.
 P([[19,50],[37,50],[41+walk*.5,62],[30,60],[24,64],[15+walk*.5,62]],'#e8e4ee');P([[21,51],[35,51],[37+walk*.5,60],[30,58],[24,62],[18+walk*.5,60]],'#f8f6fa');r.rect(34,50,4,3,c.eye);
 const pulse=m.cast?[0,-2,0,1][m.frame]:0,hands=[[14-walk*.3,52+walk*.3],[m.cast?45+pulse:41+walk*.3,m.cast?34+pulse:52-walk*.3]];
 for(const [i,[hx,hy]]of hands.entries()){const sx=i?36:20;limb(r,sx,40+y,hx,hy,{color:SK.base,light:SK.light,width:3,hand:SK.base,handShade:SK.shade});}
 face(r,m);hairFront(r,m);
 // A white flower pinned in her hair.
 for(const [dx,dy]of [[0,-2],[2,0],[0,2],[-2,0]])R(16+dx,15+dy+m.y,2,2,'#ffffff');r.put(17,16+m.y,c.eye);
 return hands;
}

const cache=new Map();
export function shiraoriPixels({frame=0,moving=false,pose='',attack=false,expression='neutral',blink=false,skin='default'}={}){
 const key=[frame,moving,pose,attack,expression,blink,skin].join(':');if(cache.has(key))return cache.get(key);
 const mo=motion({frame,moving}),m={frame:((frame%4)+4)%4,moving,pose,attack,expression,blink,walk:mo.walk*2,y:mo.y,cast:attack||!!pose};
 const r=canvas();
 const hands=skin==='casual'?casualLook(r,m):skin==='pajamas'?pajamaLook(r,m):skin==='swimsuit'?swimLook(r,m):robeLook(r,m,{hooded:skin!=='unveiled'});
 // Casting spins a web sigil at her raised hand; the ultimate weaves a larger one overhead.
 if(m.cast){const [hx,hy]=hands[1];webSigil(r,hx+2,hy-5);if(pose==='summon'||pose==='ultimate')webSigil(r,28,4,{big:true});}
 const result=selout(r.pixels,c.ink);cache.set(key,result);return result;
}
