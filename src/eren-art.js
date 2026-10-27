import {canvas,motion,selout,mix,head} from './hero-kit.js';
// Eren Yeager in his three eras. Scout: short messy brown hair, sea-green eyes under a
// hard scowl, cropped brown Survey Corps jacket with the Wings of Freedom, cream lace-up
// shirt, ODM harness, waist cloth, white trousers and tall boots. Cloak adds the green
// Survey Corps cape. Yeagerist: hair tied back in a bun, an open charcoal hooded long
// cardigan over a grey lace-up shirt and black trousers. Marley infiltrator: long
// straight hair, a bandage over one eye, stubble, a beige jacket with a star armband,
// one trouser leg knotted below the knee and a wooden crutch.
export const EREN_ART={ink:'#1c1a1c',hair:['#2a201c','#43342c','#6a5444'],eye:'#4f9a86',eyeDark:'#2a5c50'};
const c=EREN_ART,SK={base:'#f6d8bc',shade:'#dcb296',deep:'#bf9078',light:'#fff0de'};
const shift=(pts,y)=>pts.map(([x,yy])=>[x,yy+y]);
function layer(r,pts,[dark,mid,light],y=0){const p=shift(pts,y);r.poly(p,dark);const cx=p.reduce((s,q)=>s+q[0],0)/p.length,cy=p.reduce((s,q)=>s+q[1],0)/p.length;r.poly(p.map(([x,yy])=>{const dx=cx-x,dy=cy-yy,l=Math.hypot(dx,dy)||1;return [x+dx/l,yy+dy/l];}),mid);if(light){const left=[...p].sort((a,b)=>a[0]-b[0]).slice(0,2);r.line(left[0][0]+1,left[0][1],left[1][0]+1,left[1][1],light);}}

function face(r,m,{covered=false,stubble=false,tired=false}={}){
 const {y,blink,expression,cast}=m,{rect:R,line:L,put}=r,hurt=expression==='hurt',fierce=cast||expression==='focused'||expression==='ultimate';
 head(r,y,{skin:SK});
 for(const [x,side]of [[21,-1],[31,1]]){
  if(covered&&side>0)continue;
  if(blink){L(x,29+y,x+3,29+y,c.ink);continue;}
  if(hurt){L(x,27+y,x+3,29+y,c.ink);L(x,29+y,x+3,27+y,c.ink);continue;}
  // Sea-green eyes with a heavy upper lid; the scout's are wide and intense.
  const top=tired?29:28,h=tired?2:3;R(x,top+y,4,h,'#fbf6ee');R(x+(side<0?1:0),top+y,3,h,c.eye);R(x+(side<0?1:0),top+y,3,1,c.eyeDark);put(x+(side<0?2:1),top+1+y,'#122a24');put(x+(side<0?1:0),top+1+y,'#c8f0e0');
  L(x-(side<0?1:0),top-1+y,x+3+(side>0?1:0),top-1+y,c.ink);
 }
 // Brows angle sharply down toward the nose: Eren's permanent glare.
 for(const [x,d]of [[20,1],[36,-1]]){if(covered&&d<0)continue;for(let i=0;i<5;i++)put(x+d*i,24+y+(i>1?1:0)+(fierce&&i>3?1:0),c.hair[0]);}
 put(28,31+y,SK.shade);put(28,32+y,SK.shade);
 if(stubble){for(const [x,yy]of [[25,36],[27,37],[29,37],[31,36],[26,35],[30,35],[28,36]])put(x,yy+y,'#a08068');}
 if(hurt){R(26,34+y,5,2,'#6a3a3a');put(27,34+y,'#fff4ee');}
 else if(expression==='ultimate'){R(26,34+y,5,2,'#5a2a2a');R(27,34+y,3,1,'#f6efe6');}
 else{L(26,35+y,30,35+y,'#a06a5a');put(26,34+y,'#a06a5a');put(30,34+y,'#a06a5a');}
}
function hair(r,m,look,{back}){
 const {y}=m,H=c.hair,{poly:P,line:L}=r;
 if(look==='infiltrator'){
  // Long straight hair parted at the crown, falling past the shoulders.
  if(back){P(shift([[15,24],[16,14],[21,9],[35,9],[40,14],[41,24],[42,44],[37,46],[19,46],[14,44]],y),H[0]);return;}
  P(shift([[16,30],[16,17],[21,11],[28,9],[35,11],[40,17],[40,30],[41,44],[37,45],[36,26],[33,19],[29,16],[24,20],[20,26],[20,45],[15,44]],y),H[1]);
  for(const [x0,x1]of [[18,17],[38,39]])L(x0,20+y,x1,42+y,H[2]);L(24,12+y,28,10+y,H[2]);L(29,16+y,28,11+y,H[0]);
  // Strands fall across the bandaged side of the face.
  P(shift([[33,19],[37,22],[38,34],[35,36],[34,27]],y),H[1]);L(35,23+y,36,33+y,H[2]);
  return;
 }
 if(look==='yeagerist'){
  // Swept back into a bun, with two loose strands framing the brow.
  if(back){P(shift([[17,26],[16,17],[20,11],[34,10],[39,14],[40,24],[38,27],[19,28]],y),H[0]);P(shift([[36,9],[42,8],[45,12],[43,17],[38,16]],y),H[1]);r.rect(37,13+y,3,3,H[0]);L(39,10+y,43,10+y,H[2]);return;}
  P(shift([[17,24],[17,17],[21,12],[28,10],[35,11],[39,16],[39,23],[36,19],[30,16],[24,17],[20,20],[19,26]],y),H[1]);
  for(const [x0,x1]of [[21,30],[24,34],[27,37]])L(x0,15+y,x1,13+y,H[2]);
  for(const [x0,x1]of [[20,19],[36,37]]){L(x0,19+y,x1,28+y,H[1],2);L(x0,20+y,x1,27+y,H[2]);}
  return;
 }
 // Scout: short, thick and messy, with a few strands falling between the eyes.
 if(back){P(shift([[15,30],[14,18],[19,10],[37,10],[42,18],[41,30]],y),H[0]);return;}
 P(shift([[15,29],[13,22],[16,19],[15,13],[21,9],[29,7],[36,9],[41,14],[40,20],[43,24],[39,29],[38,22],[35,19],[33,24],[30,18],[27,25],[24,18],[21,24],[19,21],[18,30]],y),H[1]);
 for(const [x0,y0,x1,y1]of [[19,15,24,11],[26,10,31,9],[33,11,37,15],[21,17,23,14]])L(x0,y0+y,x1,y1+y,H[2]);
 for(const [x0,y0,x1,y1]of [[17,20,16,28],[39,21,40,28],[27,19,27,25],[31,18,32,23],[23,17,22,22],[35,17,36,21]])L(x0,y0+y,x1,y1+y,H[0]);
}
const PAL={
 default:{coat:['#5a3822','#8a5a36','#b07a4c'],shirt:['#c8b898','#e8dcc0'],pants:['#bdb8a8','#e6e2d4'],boot:['#3a2820','#5e4232'],strap:'#2e2018'},
 yeagerist:{coat:['#24262c','#3a3c44','#5a5d66'],shirt:['#8e8e8a','#b8b8b2'],pants:['#141618','#22262a'],boot:['#121416','#2e3236'],strap:'#1a1c20'},
 infiltrator:{coat:['#9a8a70','#c6b496','#e0d2b6'],shirt:['#d6ccb8','#efe6d4'],pants:['#34342e','#4a4a42'],boot:['#26241f','#46443c'],strap:'#7a7468'},
};
function legsAndFeet(r,m,look,pal){
 const {walk}=m,{rect:R,poly:P,line:L}=r;
 for(const [i,x]of [[0,21],[1,30]]){const d=i?walk:-walk;
  if(look==='infiltrator'&&i){// His left leg ends below the knee; the trouser leg is knotted.
   P([[x,53],[x+6,53],[x+6,61],[x,61]],pal.pants[0]);R(x+1,54,4,6,pal.pants[1]);R(x+1,61,4,2,pal.pants[0]);P([[x+2,62],[x+4,62],[x+5,67],[x+1,67]],pal.pants[0]);L(x+3,63,x+3,66,pal.pants[1]);continue;}
  if(look==='default'||look==='cloak'){
   P([[x,52],[x+6,52],[x+6+d*.5,62],[x+d*.5,62]],pal.pants[0]);R(x+1+d*.3,53,4,9,pal.pants[1]);
   // Brown thigh straps of the ODM harness.
   L(x+d*.3,55,x+6+d*.3,57,pal.strap);L(x+(i?6:0)+d*.3,53,x+(i?6:0)+d*.4,60,pal.strap);
   // Tall riding boots up to the knee.
   P([[x-1+d,61],[x+7+d,61],[x+7+d,67],[x+8+d,70],[x-2+d,70],[x-1+d,66]],pal.boot[0]);R(x+d,61,6,1,pal.boot[1]);L(x+1+d,62,x+1+d,68,pal.boot[1]);R(x-2+d,70,10,1,'#140e0a');
  }else{
   P([[x,52],[x+6,52],[x+6+d,66],[x+d,66]],pal.pants[0]);L(x+2,54,x+2+d,65,pal.pants[1]);
   R(x-1+d,66,8,4,pal.boot[0]);R(x+d,66,5,1,pal.boot[1]);R(x-1+d,69,8,1,'#08090a');
  }
 }
}
function torso(r,m,look,pal){
 const {y}=m,{rect:R,poly:P,line:L,put}=r;
 // Shirt with a lace-up neck.
 layer(r,[[22,37],[34,37],[35,53],[21,53]],[pal.shirt[0],pal.shirt[1]],y);
 if(look!=='infiltrator'){// Open V-neck closed by a short criss-cross lace.
  P(shift([[26,37],[30,37],[28,42]],y),SK.shade);P(shift([[27,37],[29,37],[28,40]],y),SK.base);
  for(const yy of [39,41]){put(27,yy+y,pal.strap);put(29,yy+y,pal.strap);}put(28,43+y,pal.strap);}
 if(look==='infiltrator'){L(28,38+y,28,52,pal.shirt[0]);for(const yy of [42,47])put(29,yy+y,'#a8a090');}
 if(look==='default'||look==='cloak'){
  // Waist cloth wrapped over the hips, harness belt and chest straps.
  P([[20,49],[36,49],[38,53],[31,53],[28,55],[18,53]],'#3a2620');L(20,50,36,50,'#523a2e');L(28,51,26,54,'#2a1a14');
  R(21,48,14,2,pal.strap);R(27,48,3,2,'#c8b07a');
  for(const x of [24,32])L(x,37+y,x,48,pal.strap);L(24,44+y,32,44+y,pal.strap);
  // Cropped jacket that stops at the chest, open over the shirt, with a turned-down collar.
  for(const side of [-1,1]){const X=d=>28+side*d;
   layer(r,[[X(4),36],[X(10),37],[X(10),47],[X(5),47],[X(4),42]],pal.coat,y);
   P(shift([[X(3),35],[X(7),35],[X(5),40]],y),pal.coat[2]);}
  // Wings of Freedom patch on the chest pocket.
  R(31,42+y,4,3,'#ece8dc');put(31,43+y,'#3a5a90');put(32,42+y,'#3a5a90');put(33,43+y,'#f8f8f8');put(34,42+y,'#f8f8f8');
 }else{
  // Long open coat: Yeagerist cardigan to the knee, infiltrator jacket to the hip.
  const hem=look==='yeagerist'?63:56;
  for(const side of [-1,1]){const X=d=>28+side*d;layer(r,[[X(4),36],[X(10),37],[X(11),hem-2],[X(10),hem],[X(4),hem],[X(5),46]],pal.coat);}
  if(look==='yeagerist'){// The hood bunches behind his neck.
   P(shift([[20,36],[24,33],[32,33],[36,36],[33,38],[23,38]],y),pal.coat[0]);L(23,35+y,33,35+y,pal.coat[2]);
   R(21,53,14,2,'#1a1c20');}
  else{for(const side of [-1,1]){R(28+side*7-1,44,3,2,pal.coat[0]);}P(shift([[23,35],[26,35],[25,41]],y),pal.coat[2]);P(shift([[30,35],[33,35],[31,41]],y),pal.coat[2]);}
 }
}
function cloakBack(r,m){
 const {walk}=m,{poly:P,line:L}=r;
 P([[17,36],[39,36],[44+walk,64],[12-walk,64]],'#26402e');P([[19,37],[37,37],[41+walk,62],[15-walk,62]],'#3c5a40');
 for(const x of [18,24,32,38])L(x,40,x+(x<28?-3:3)+walk*.5,61,'#2e4a34');
}
function cloakFront(r,m){
 const {y}=m,{poly:P,rect:R}=r;
 // Hood folded around the shoulders, fastened at the throat.
 P(shift([[18,36],[24,34],[32,34],[38,36],[39,41],[34,39],[28,40],[22,39],[17,41]],y),'#3c5a40');P(shift([[20,36],[24,35],[32,35],[36,36],[33,38],[23,38]],y),'#56785a');R(27,38+y,2,2,'#c8b07a');
}
// Blades: ODM swords point down at rest and swing out to the sides when he attacks.
function blades(r,hands,cast,thunder){
 const {line:L,poly:P,rect:R}=r;
 for(const [i,[hx,hy]]of hands.entries()){const s=i?1:-1;
  if(thunder){L(hx,hy+1,hx+s*2,hy-20,'#4d7066',4);L(hx+1,hy-1,hx+s*2+1,hy-17,'#9cbba0',2);P([[hx+s*2-2,hy-19],[hx+s*3,hy-27],[hx+s*2+3,hy-19]],'#d2dfcc');R(hx-2,hy-4,7,2,'#c8ab6f');continue;}
  const tx=cast?hx+s*7:hx+s*3,ty=cast?hy-20:hy+18;L(hx,hy+1,tx,ty,'#7a98a4',3);L(hx,hy+1,tx,ty,'#e8f0ec');R(hx-2,hy,5,3,'#5f7676');}
}
function arms(r,m,look,pal){
 const {y,walk,cast,pose}=m,{rect:R,line:L}=r,sleeve=pal.coat;
 const hands=cast?[[10,43],[46,41]]:[[15,51+walk*.4],[41,51-walk*.4]];
 if(look==='infiltrator'&&!cast)hands[0]=[16,50];
 for(const [i,[hx,hy]]of hands.entries()){const sx=i?37:19;L(sx,39+y,hx,hy,sleeve[0],5);L(sx,39+y,hx,hy-1,sleeve[1],3);L(sx+(i?1:-1),39+y,hx+(i?1:-1),hy-2,sleeve[2]);
  R(hx-1,hy+1,4,3,SK.base);R(hx-1,hy+3,4,1,SK.shade);}
 // The star armband sits on the infiltrator's left sleeve.
 if(look==='infiltrator'){const [hx,hy]=hands[1],ax=Math.round(37+(hx-37)*.35),ay=Math.round(39+y+(hy-39-y)*.35);R(ax-2,ay,5,4,'#8a8e8a');R(ax-1,ay+1,3,2,'#b8bcb8');r.put(ax,ay+1,'#5a5e5a');r.put(ax,ay+2,'#5a5e5a');}
 if(pose==='shift'){// Lightning crackles from the bitten hand as the Titan forms.
  for(const [x0,y0,x1,y1]of [[8,40,4,34],[4,34,7,30],[48,38,52,33],[52,33,50,28],[12,46,8,49]])L(x0,y0,x1,y1,'#ffe48a');}
 return hands;
}
function crutch(r,m){
 const {rect:R,line:L}=r;
 // A plain wooden crutch planted beside his good leg.
 L(14,44,12,71,'#4a3220',3);L(15,44,13,70,'#8a6440');R(11,71,3,2,'#a8a8a0');R(12,44,5,2,'#6a4a30');
}
const cache=new Map();
export function erenPixels({frame=0,moving=false,pose='',attack=false,expression='neutral',blink=false,skin='default',evolved=''}={}){
 const look=['cloak','yeagerist','infiltrator'].includes(skin)?skin:'default';
 const key=[frame,moving,pose,attack,expression,blink,look,evolved].join(':');if(cache.has(key))return cache.get(key);
 const mo=motion({frame,moving}),m={frame:((frame%4)+4)%4,moving,pose,attack,expression,blink,walk:mo.walk*2,y:mo.y,cast:attack||pose==='shift'};
 const pal=PAL[look==='cloak'?'default':look],r=canvas(),scout=look==='default'||look==='cloak';
 if(look==='cloak')cloakBack(r,m);
 hair(r,m,look,{back:true});
 legsAndFeet(r,m,look,pal);torso(r,m,look,pal);
 if(look==='infiltrator'&&!m.cast)crutch(r,m);
 if(look==='cloak')cloakFront(r,m);
 const hands=arms(r,m,look,pal);
 if(scout||m.cast||evolved==='thunderspears')blades(r,hands,m.cast,evolved==='thunderspears');
 face(r,m,{covered:look==='infiltrator',stubble:look==='infiltrator',tired:look==='infiltrator'||look==='yeagerist'});
 if(look==='infiltrator'){// Bandage wrapped diagonally across the brow and over his left eye.
  const {poly:P,line:L}=r,y=m.y;P(shift([[20,19],[25,18],[37,25],[37,31],[30,31],[29,26]],y),'#c8c4ba');P(shift([[21,19],[25,19],[36,25],[36,30],[31,30],[30,26]],y),'#f2eee6');L(25,20+y,35,26+y,'#dcd8ce');}
 hair(r,m,look,{back:false});
 const result=selout(r.pixels,c.ink);cache.set(key,result);return result;
}
