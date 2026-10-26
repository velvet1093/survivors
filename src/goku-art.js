import {raster,outline} from './pixel-characters.js';
import {mix} from './hero-kit.js';
const INK='#192039',TONE='#edbd96',LIGHT='#ffdfb8',SHADE='#c8896e',WHITE='#fff4dc';
export const GOKU_HAIR={base:['#182331','#101520','#354459'],gold:['#ecd064','#ab7d32','#fff1a3'],blue:['#67c9e8','#357697','#b5f4f2']};
// ---- Head: hair and face shared by every skin ----
// Hair silhouettes per stage, as [x,y] outlines (y relative to the head bob).
// Base: the reference crown sweeps out to the viewer-left in big blades, fans right
// and stands tall at the centre. Super Saiyan stands every spike up; SS3 grows a
// waist-length mane.
const CROWN={
 base:[[17,28],[10,26],[3,23],[11,20],[1,14],[12,14],[6,6],[17,10],[17,1],[24,8],[28,0],[31,7],[38,1],[39,10],[47,6],[43,14],[53,14],[44,19],[50,25],[40,25],[39,28]],
 super:[[17,28],[10,25],[4,19],[12,18],[5,9],[15,12],[12,2],[21,9],[25,0],[29,7],[35,0],[37,9],[45,3],[42,13],[51,11],[44,18],[50,24],[40,25],[39,28]],
 ss2:[[17,28],[9,25],[2,18],[12,17],[4,7],[15,11],[11,0],[21,8],[25,0],[29,6],[36,0],[38,8],[47,2],[43,12],[53,10],[45,18],[51,24],[40,25],[39,28]],
};
const MANE=[[17,10],[39,10],[45,24],[47,40],[50,52],[44,56],[40,62],[33,58],[28,64],[23,58],[16,62],[12,56],[6,52],[9,40],[11,24]];
function hairColors(stage){return stage===4?GOKU_HAIR.blue:stage>0?GOKU_HAIR.gold:GOKU_HAIR.base;}
function shift(points,y){return points.map(([x,yy])=>[x,yy+y]);}
function inset(points,cx=28,cy=18,t=.12){return points.map(([x,y])=>[x+(cx-x)*t,y+(cy-y)*t]);}
export function gokuHairBack(r,{y=0,stage=0}={}){
 const [hair,shade,light]=hairColors(stage);
 if(stage===3){r.poly(shift(MANE,y*0),shade);r.poly(inset(MANE,28,30,.1),hair);r.line(14,30,11,50,light);r.line(42,30,45,50,light);r.line(28,40,28,58,shade);}
 const crown=CROWN[stage===2?'ss2':stage>0&&stage!==3?'super':'base'];
 const top=stage===3?[[17,28],[13,18],[17,9],[28,6],[39,9],[43,18],[39,28]]:crown;
 r.poly(shift(top,y),shade);r.poly(shift(inset(top),y),hair);
 // Light catches the upper edge of the larger blades.
 if(stage===3){r.line(20,10+y,27,8+y,light);return;}
 const pts=shift(crown,y);
 for(let i=1;i<pts.length-1;i+=2){const [x,yy]=pts[i],t=.35;r.line(x+(28-x)*t,yy+(17+y-yy)*t,x+(28-x)*.75,yy+(17+y-yy)*.75,light);}
}
export function gokuFace(r,{y=0,stage=0,expression='neutral',blink=false,focused=false}={}){
 const {poly,rect,line,put}=r,hurt=expression==='hurt',ult=expression==='ultimate',[,hairShade]=hairColors(stage);
 // Ears, then a squared jaw that narrows to a firm chin.
 poly([[18,24+y],[14,23+y],[14,30+y],[18,32+y]],TONE);poly([[38,24+y],[42,23+y],[42,30+y],[38,32+y]],TONE);rect(15,25+y,2,3,SHADE);rect(40,25+y,2,3,SHADE);
 rect(24,35+y,9,5,SHADE);
 poly([[18,18+y],[38,18+y],[39,29+y],[37,34+y],[32,38+y],[25,38+y],[20,34+y],[18,29+y]],TONE);
 poly([[21,20+y],[35,20+y],[36,28+y],[34,32+y],[23,32+y],[21,28+y]],LIGHT);line(26,38+y,31,38+y,SHADE);
 const stern=focused||hurt||ult,browCol=stage===3?SHADE:stage>0?hairShade:INK;
 const iris=stage>0?'#3f9691':'#1d2433',irisMid=stage>0?'#2a6f6c':'#2f3a52',shine=stage>0?'#d8fff4':'#ffffff',lip='#98654f',mouthDark='#7d3f3a';
 const look=faceLook;
 // Brows. A: steady and level. B: lifted, friendly arches. C: straight, one cocked up.
 // All three drive down toward the nose when he fights.
 const browPx=(pts)=>{if(stage===3)return;for(const [x,yy]of pts){put(x,yy+y,browCol);put(56-x-1,yy+y,browCol);}};
 if(stern)browPx([[19,24],[20,24],[21,24],[22,25],[23,25],[24,26],[20,23],[21,23],[22,24]]);
 else if(look==='A')browPx([[19,25],[20,24],[21,24],[22,24],[23,24],[24,24],[20,25],[21,25]]);
 else if(look==='B')browPx([[19,25],[20,24],[21,23],[22,23],[23,23],[24,24],[20,25]]);
 else{for(const [x,yy]of [[19,24],[20,24],[21,24],[22,24],[23,25],[24,25]])put(x,yy+y,browCol);for(const [x,yy]of [[31,24],[32,23],[33,23],[34,23],[35,23],[36,24]])put(x,yy+y,browCol);}
 for(const [x,side]of [[20,-1],[31,1]]){
  const ex=side<0?x:x+1,outer=side<0?ex-1:ex+5;
  if(hurt){line(ex,27+y,ex+4,29+y,INK);line(ex,31+y,ex+4,29+y,INK);continue;}
  if(blink){line(ex,29+y,ex+4,29+y,INK);put(outer,28+y,INK);line(ex+1,30+y,ex+3,30+y,mix(INK,TONE,.5));continue;}
  if(stern||look==='C'){
   // Narrowed eye: flat heavy lid over a big dark iris.
   rect(ex,28+y,5,3,WHITE);rect(ex+1,28+y,3,3,iris);rect(ex+2,29+y,1,2,irisMid);put(ex+(side<0?1:3),28+y,shine);
   line(ex-1,27+y,ex+5,27+y,INK);put(outer,28+y,INK);if(stern)line(ex,28+y,ex+1,28+y,INK);
  }else if(look==='A'){
   // Almond eye: thick upper lid with an outer flick, iris fills most of the eye.
   rect(ex,28+y,5,3,WHITE);rect(ex+1,27+y,3,4,iris);rect(ex+2,29+y,1,2,irisMid);put(ex+(side<0?1:3),28+y,shine);
   line(ex-1,27+y,ex+5,27+y,INK);line(ex,26+y,ex+4,26+y,INK);put(outer,28+y,INK);line(ex+1,31+y,ex+3,31+y,SHADE);
  }else{
   // Round eye: tall glossy iris with two highlights.
   rect(ex,27+y,5,4,WHITE);rect(ex+1,27+y,3,4,iris);rect(ex+2,29+y,2,2,irisMid);put(ex+(side<0?1:3),27+y,shine);put(ex+(side<0?1:3),28+y,shine);put(ex+(side<0?3:1),30+y,mix(shine,iris,.4));
   line(ex,26+y,ex+4,26+y,INK);put(ex-1,27+y,INK);put(ex+5,27+y,INK);put(outer,28+y,INK);line(ex+1,31+y,ex+3,31+y,SHADE);
  }
 }
 // Nose.
 put(28,31+y,SHADE);put(29,32+y,SHADE);
 if(hurt){rect(25,34+y,7,2,WHITE);line(25,34+y,31,34+y,'#925d58');put(28,35+y,'#925d58');put(24,35+y,'#925d58');put(32,35+y,'#925d58');}
 else if(ult){poly([[25,33+y],[32,33+y],[31,37+y],[26,37+y]],mouthDark);rect(26,33+y,6,1,WHITE);rect(27,35+y,4,2,'#c96a62');}
 else if(focused){line(26,35+y,30,35+y,'#8a554c');}
 else if(look==='A'){
  // Gentle closed smile.
  put(25,34+y,lip);line(26,35+y,30,35+y,lip);put(31,34+y,lip);put(28,36+y,mix(lip,TONE,.6));
 }else if(look==='B'){
  // Small open happy mouth: top teeth, dark inside, a hint of tongue.
  rect(25,34+y,7,1,mouthDark);rect(26,34+y,5,1,WHITE);rect(26,35+y,5,1,mouthDark);rect(27,35+y,3,1,'#c96a62');rect(27,36+y,3,1,mouthDark);
 }else{
  // Lopsided smirk rising to his left.
  line(25,35+y,29,35+y,lip);put(30,34+y,lip);put(31,33+y,lip);put(24,35+y,mix(lip,TONE,.5));put(30,35+y,mix(lip,TONE,.5));
 }
}
let faceLook='B';
export function setGokuFaceLook(l){faceLook=l;}
// Bangs over the forehead: an M-shaped hairline with Goku's long forelock hanging
// between the eyes, two shorter locks either side.
const BANGS={
 base:[[17,26],[17,16],[28,12],[39,16],[39,25],[37,21],[35,23],[33,19],[30,21],[28,28],[26,20],[23,23],[21,20],[19,25]],
 super:[[17,25],[17,15],[28,11],[39,15],[39,24],[36,19],[34,22],[32,18],[29,21],[28,27],[26,19],[23,22],[21,18],[19,24]],
 ss3:[[17,22],[17,15],[28,12],[39,15],[39,21],[35,18],[31,20],[29,27],[27,19],[23,20],[20,17]],
};
export function gokuHairFront(r,{y=0,stage=0}={}){
 const [hair,shade,light]=hairColors(stage),b=BANGS[stage===3?'ss3':stage>0?'super':'base'];
 r.poly(shift(b,y),shade);r.poly(shift(inset(b,28,16,.14),y),hair);
 r.line(22,15+y,27,14+y,light);r.line(30,14+y,35,16+y,light);
 // The forelock gets its own highlight down its length.
 r.line(27,18+y,28,25+y,light);
 if(stage===2){r.line(33,17+y,35,27+y,shade,2);r.line(33,17+y,35,26+y,hair);}
}
// The reference's cheerful face and broad sleeveless gi are kept in compact,
// stepped clusters; one forelock sits between the eyes instead of masking them.
export function gokuPixels({frame=0,moving=false,pose='',attack=false,expression='neutral',blink=false,skin='default',form=0}={}){
 frame=((frame%4)+4)%4;const r=raster(),{rect:R,poly:P,line:L,put}=r,stage=form||(skin==='supersaiyan'?1:0),[hair,hairShade,hairLight]=stage===4?GOKU_HAIR.blue:stage>0?GOKU_HAIR.gold:GOKU_HAIR.base,walk=moving?[0,2,0,-2][frame]:0,y=moving?-(frame%2):0,gi='#f1a14e',giShade='#ba6135',giLight='#ffd084',blue='#294b79',blueShade='#1e3153',blueLight='#6283a2',red='#bd5b5b',gather=pose==='gather',throwing=pose==='throw',cast=attack||throwing,focused=cast||['focused','ultimate'].includes(expression),hurt=expression==='hurt';
 gokuHairBack(r,{y,stage});
 const rope='#d9b27a',boot='#2f4f8a',bootShade='#1e3153',bootLight='#5679b4';
 // Boots: deep blue with red piping and a rope tie at the ankle.
 for(const [x,d]of [[19,-walk],[30,walk]]){
  P([[x-1+d,61],[x+7+d,61],[x+7+d,68],[x+9+d,71],[x-2+d,71],[x-1+d,68]],bootShade);R(x+d,62,6,7,boot);R(x+1+d,62,1,6,bootLight);
  L(x+5+d,62,x+5+d,69,red);R(x-1+d,61,8,1,red);R(x-1+d,66,8,1,rope);put(x+7+d,67,rope);
  R(x-2+d,70,11,1,red);R(x-2+d,71,11,1,'#141c2e');
 }
 // Baggy trousers that balloon over the knees and gather into the boot tops.
 for(const [x,d,side]of [[18,-walk,-1],[31,walk,1]]){
  P([[x,49],[x+8,49],[x+9+d+(side>0?2:0),55],[x+8+d,61],[x+d,62],[x-2+d-(side<0?2:0),56]],giShade);
  P([[x+1,50],[x+7,50],[x+8+d+(side>0?1:0),55],[x+7+d,60],[x+1+d,61],[x-1+d-(side<0?1:0),56]],gi);
  L(x+2,52,x+1+d,57,giLight);L(x+6,52,x+7+d,58,giShade);L(x+d,60,x+7+d,60,giShade);L(x+2+d,58,x+5+d,59,giLight);
 }
 // Blue undershirt: short sleeves at the shoulders and a deep V at the chest.
 P([[16,37+y],[22,35+y],[34,35+y],[40,37+y],[41,42+y],[37,43+y],[19,43+y],[15,42+y]],blueShade);
 P([[17,37+y],[22,36+y],[34,36+y],[39,37+y],[40,41+y],[37,42+y],[19,42+y],[16,41+y]],blue);L(18,38+y,21,37+y,blueLight);L(35,37+y,38,38+y,blueLight);
 // Orange gi top crossing left over right, with a tunic hem over the trousers.
 P([[19,37+y],[24,36+y],[29,47],[33,36+y],[37,37+y],[38,46],[37,54],[19,54],[18,46]],giShade);
 P([[20,38+y],[24,37+y],[29,46],[32,37+y],[36,38+y],[37,46],[36,53],[20,53],[19,46]],gi);
 P([[20,38+y],[23,37+y],[27,44],[24,51],[21,50],[19,44]],giLight);L(24,37+y,29,47,giShade);L(32,37+y,29,46,'#d07a3b');
 P([[25,36+y],[32,36+y],[29,44]],blue);L(26,36+y,29,42,blueLight);P([[26,35+y],[31,35+y],[30,37+y],[27,37+y]],TONE);
 L(22,52,35,52,giShade);L(23,46,24,52,giShade);
 // Kanji badge: white circle with a dark glyph on the viewer-right chest.
 R(32,41+y,5,5,'#f6eee0');R(33,40+y,3,1,'#f6eee0');R(33,46+y,3,1,'#f6eee0');R(31,42+y,1,3,'#f6eee0');R(37,42+y,1,3,'#f6eee0');
 R(33,42+y,3,1,INK);L(34,42+y,34,45+y,INK);R(33,44+y,3,1,INK);put(35,45+y,INK);
 // Blue sash knotted at the front with two tails hanging past the hem.
 R(19,47,19,3,blueShade);R(19,47,19,2,blue);L(20,47,37,47,blueLight);
 R(25,46,5,5,blueShade);R(26,46,3,4,blue);put(27,47,blueLight);
 P([[25,50],[28,50],[27,59],[24,58]],blueShade);P([[25,50],[27,50],[26,58],[25,57]],blue);
 P([[28,50],[31,50],[32,61],[29,60]],blueShade);P([[28,50],[30,50],[31,60],[29,59]],blue);L(29,51,30,59,blueLight);
 // Muscular bare arms with blue wristbands. Idle: fists planted on the hips.
 const arm=(x0,y0,x1,y1,lit)=>{L(x0,y0,x1,y1,SHADE,5);L(x0,y0,x1,y1,lit?LIGHT:TONE,3);L(x0,y0-1,x1,y1-1,lit?'#fff0d8':LIGHT);};
 const fist=(x,yy,lit)=>{R(x-2,yy-3,5,3,blue);R(x-2,yy-3,5,1,blueLight);R(x-2,yy,5,4,lit?LIGHT:TONE);R(x-1,yy+3,3,1,SHADE);L(x-2,yy+1,x+2,yy+1,SHADE);};
 if(gather){arm(16,40+y,9,24,false);arm(9,24,7,17,false);arm(40,40+y,47,24,true);arm(47,24,48,17,true);fist(7,16,false);fist(48,16,true);}
 else{
  // Viewer-left arm: hand on hip, or guarding in front of the chest while casting.
  if(cast){arm(16,40+y,22,47,false);fist(29,45,false);}else{arm(16,40+y,11,45,false);arm(11,45,17,48,false);fist(18,49,false);}
  if(throwing){arm(40,40+y,47,36,true);arm(47,36,48,30,true);fist(48,31,true);}
  else if(cast){arm(40,40+y,48,41,true);fist(49,41,true);}
  else{arm(40,40+y,45,45,true);arm(45,45,39,48,true);fist(38,49,true);}
 }
 gokuFace(r,{y,stage,expression,blink,focused});
 gokuHairFront(r,{y,stage});
 return outline(r.pixels,INK);
}
