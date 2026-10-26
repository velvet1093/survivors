import {raster,outline} from './pixel-characters.js';
import {canvas,motion,eye,mouth,head,limb,selout,mix,SKIN} from './hero-kit.js';
export const CRIMSON_SCALE=1.18;
const INK='#302d40';
// Larger, muscular armor planes keep the Stand distinct from the smaller human sprites.
export function kingCrimsonPixels({frame=0,attack=false}={}){
 const r=raster(),{rect:R,poly:P,line:L}=r,phase=((frame%4)+4)%4,step=[0,1,0,-1][phase],red='#b54f6b',shade='#743c58',lit='#e5909e',white='#e8e6d3',grey='#aebbc0',green='#afcd79',fist=attack?[1,3,1,0][phase]:0;
 for(const [x,d]of [[18,-step],[32,step]]){P([[x,47],[x+8,47],[x+7+d,58],[x+8+d,68],[x-1+d,68],[x+d,56]],shade);P([[x+2,49],[x+6,49],[x+5+d,59],[x+6+d,66],[x+1+d,66]],red);L(x+2,51,x+6+d,58,white);L(x+6,52,x+1+d,62,white);L(x+2+d,61,x+6+d,67,white);R(x+d-3,68,12,3,white);R(x+d-2,68,9,1,grey);}
 P([[18,29],[26,27],[34,28],[40,31],[42,40],[37,49],[31,54],[23,52],[16,46],[13,37]],shade);
 P([[18,30],[26,29],[29,33],[33,29],[39,32],[39,40],[34,45],[30,43],[25,46],[18,41]],red);
 P([[19,32],[25,31],[28,34],[27,39],[21,39],[17,36]],lit);P([[31,34],[35,31],[39,33],[40,37],[35,40],[30,39]],lit);R(25,42,4,4,red);R(31,42,4,4,red);R(26,47,8,4,red);
 for(const [x,y,tx,ty]of [[18,32,34,48],[23,29,40,45],[16,39,29,52],[19,44,34,29],[22,51,40,33],[30,50,40,40]])L(x,y,tx,ty,white);
 R(23,51,13,3,white);R(28,51,4,3,green);R(25,54,9,3,shade);
 const lx=attack?8:11,ly=attack?39-fist:47,rx=attack?45+fist:43,ry=attack?33-fist:47;
 L(16,32,lx,ly-4,shade,8);L(40,32,rx-2,ry-3,red,8);L(16,32,lx+1,ly-3,lit,4);L(41,32,rx-1,ry-3,lit,4);
 L(14,34,lx+2,ly-3,white);L(42,34,rx-2,ry-2,white);L(13,39,lx+5,ly-1,white);L(41,39,rx,ry,white);
 for(const [x,y]of [[lx,ly],[rx,ry]]){P([[x-4,y-3],[x+3,y-4],[x+7,y-1],[x+7,y+6],[x+2,y+8],[x-4,y+5]],grey);P([[x-3,y-3],[x+3,y-3],[x+6,y],[x+5,y+5],[x,y+6],[x-3,y+3]],white);R(x-1,y,6,3,red);R(x,y,4,1,lit);L(x-1,y+4,x+4,y+4,shade);}
 // Thick white collar plates frame the broad red torso.
 P([[16,24],[23,26],[29,30],[35,26],[40,24],[44,29],[40,36],[34,33],[29,36],[23,33],[17,36],[12,29]],grey);P([[16,25],[23,28],[29,32],[35,28],[40,25],[42,29],[38,33],[33,31],[29,34],[24,31],[18,33],[14,29]],white);
 P([[18,13],[23,8],[33,8],[39,14],[38,24],[34,29],[24,29],[18,24]],shade);P([[20,13],[24,10],[32,10],[36,14],[36,23],[32,27],[25,27],[21,23]],red);
 P([[21,17],[27,15],[29,19],[32,15],[36,17],[34,24],[29,28],[24,25]],white);R(22,18,5,3,INK);R(31,18,5,3,INK);R(23,19,3,1,green);R(31,19,3,1,green);P([[27,20],[30,20],[32,24],[29,26],[26,24]],grey);R(26,24,7,1,shade);L(24,12,33,26,lit);L(33,12,24,25,lit);R(18,15,3,8,white);R(36,15,3,8,white);
 // Epitaph is a complete tiny face embedded high in the brow, with its own eyes.
 P([[23,8],[24,3],[29,1],[34,4],[35,10],[31,15],[25,12]],shade);P([[25,6],[29,3],[32,5],[33,10],[29,13],[25,10]],lit);R(26,7,2,1,INK);R(30,7,2,1,INK);R(27,8,1,1,green);R(30,8,1,1,green);R(28,11,3,1,white);
 return outline(r.pixels,INK);
}
// Diavolo and his other personality share a taller adult build: broader
// shoulders, longer legs and a head set two pixels higher than the petite heroes.
const HAIR={hair:'#d690b0',shade:'#a65e88',light:'#f5c3d6',spot:'#4e3c5a'};
const GREEN='#6fae86',GREEN_DARK='#3f7660';
const OUTFITS={
 default:{hair:'long'},
 doppio:{hair:'curly'},
 casual:{hair:'tied'},
 pajamas:{hair:'long'},
 swimsuit:{hair:'long',shades:true},
};
export const DIAVOLO_OUTFIT_IDS=Object.keys(OUTFITS);
export const DIAVOLO_COLORS={...HAIR,green:GREEN,mesh:'#a87c84',lilac:'#a487c0',khaki:'#c2a874'};
// Leopard spots only land on pixels that are already hair, so they never stain skin or cloth.
function spots(r,h,list){
 const hairColors=new Set([h.hair,h.shade,h.light]);
 for(const [x,y]of list){if(!hairColors.has(r.pixels[y*56+x]))continue;r.rect(x,y,2,2,h.spot);r.put(x+1,y,h.shade);}
}
function backHair(r,style,h,walk,y){
 const {poly,line}=r;
 if(style==='long'){
  // Long straight curtains reach his waist and widen his silhouette.
  poly([[14,20+y],[17,9+y],[24,5+y],[33,5+y],[40,9+y],[43,20+y],[44+walk*.3,52],[39,56],[35,48],[22,48],[18,56],[13+walk*.3,52]],h.shade);
  poly([[15,20+y],[18,11+y],[24,7+y],[33,7+y],[39,11+y],[42,20+y],[42+walk*.3,50],[39,53],[36,45],[21,45],[18,53],[15+walk*.3,50]],h.hair);
  line(16,24,16+walk*.3,48,h.light);line(41,24,41+walk*.3,48,h.light);
 }else if(style==='tied'){
  poly([[16,18+y],[19,9+y],[25,6+y],[32,6+y],[38,9+y],[40,18+y],[39,34],[17,34]],h.shade);
  poly([[26,30],[31,30],[33+walk*.5,48],[28+walk*.5,52],[24+walk*.5,47]],h.shade);poly([[27,31],[30,31],[31+walk*.5,47],[28+walk*.5,50],[26+walk*.5,46]],h.hair);
 }else{
  // Doppio's short curly crop with springy side curls.
  poly([[16,22+y],[17,11+y],[24,6+y],[33,6+y],[40,11+y],[41,22+y],[40,32+y],[16,32+y]],h.shade);
 }
}
function frontHair(r,style,h,y){
 const {poly,line,rect}=r;
 if(style==='curly'){
  poly([[16,26+y],[15,17+y],[20,9+y],[28,7+y],[36,9+y],[41,17+y],[40,26+y],[37,21+y],[33,18+y],[30,21+y],[28,17+y],[25,21+y],[22,18+y],[19,22+y]],h.hair);
  for(const [x,yy]of [[16,24],[39,24],[15,18],[40,18]]){rect(x-1,yy+y,4,4,h.hair);rect(x,yy+1+y,2,2,h.shade);r.put(x,yy+y,h.light);}
  poly([[26,9+y],[29,4+y],[33,6+y],[31,10+y]],h.hair);line(27,8+y,30,5+y,h.light);line(20,12+y,26,10+y,h.light);line(31,10+y,36,12+y,h.light);
  return;
 }
 // Center-parted fringe falls in two long curtains past the cheekbones.
 poly([[17,30+y],[16,18+y],[21,10+y],[28,8+y],[28,12+y],[23,17+y],[21,24+y],[20,38+y],[17,38+y]],h.shade);
 poly([[39,30+y],[40,18+y],[35,10+y],[28,8+y],[28,12+y],[33,17+y],[35,24+y],[36,38+y],[39,38+y]],h.shade);
 poly([[18,30+y],[17,19+y],[21,12+y],[27,10+y],[24,15+y],[21,21+y],[20,36+y]],h.hair);
 poly([[38,30+y],[39,19+y],[35,12+y],[29,10+y],[32,15+y],[35,21+y],[36,36+y]],h.hair);
 line(20,14+y,25,11+y,h.light);line(31,11+y,36,14+y,h.light);line(19,22+y,19,33+y,h.light);
 rect(27,8+y,2,3,h.shade);
}
function legs(r,walk,{pants,pantsShade,pantsLight,shoe,shoeLight,top=52,cuff,bare=false,short=false}){
 const {rect}=r;
 for(const [i,x]of [21,31].entries()){const d=i?walk:-walk;
  if(bare||short){rect(x+d,top,5,15,SKIN.base);rect(x+d+4,top,1,15,SKIN.shade);}
  if(!bare){const h=short?8:15;rect(x+d-1,top,7,h,pantsShade);rect(x+d,top,5,h-1,pants);rect(x+d+1,top+1,1,h-3,pantsLight);if(cuff)rect(x+d-1,top+h-2,7,2,cuff);}
  rect(x+d-1,67,7,4,shoe);rect(x+d,67,4,1,shoeLight);rect(x+d-1,70,7,1,mix(shoe,'#000000',.45));
 }
}
function torso(r,y,{dark,mid,light}){
 const {poly,line}=r;poly([[17,38+y],[39,38+y],[37,53],[19,53]],dark);poly([[18,39+y],[38,39+y],[36,52],[20,52]],mid);if(light)line(19,40+y,21,51,light);
}
const GARMENTS={
 default(r,y){
  // Sheer net shirt over a bare midriff, with dark leopard-spotted trousers.
  torso(r,y,{dark:SKIN.shade,mid:SKIN.base});
  r.poly([[22,44+y],[34,44+y],[33,50],[23,50]],SKIN.light);r.line(28,45+y,28,50,SKIN.shade);r.line(24,47,32,47,SKIN.shade);
  for(let yy=38+y;yy<52;yy++)for(let x=18;x<38;x++)if(r.pixels[yy*56+x]&&((x+yy)%4===0||(x-yy+80)%4===0))r.put(x,yy,(x+yy)%8===0?'#7d5670':'#b88a90');
  r.poly([[22,38+y],[34,38+y],[31,42+y],[25,42+y]],SKIN.base);r.rect(24,38+y,8,1,'#5d3f5e');
  r.rect(19,51,18,2,'#2c2433');r.rect(26,51,4,2,'#c9a85c');
  return {sleeve:'#d2a698',sleeveLight:'#e6bdac',net:true,pants:'#5a3c66',pantsShade:'#3a2745',pantsLight:'#7b5a8a',shoe:'#2c2433',shoeLight:'#4c4058',patterned:true};
 },
 doppio(r,y){
  // Lilac cropped knit with a scoop neck over a dark net layer; khaki trousers.
  torso(r,y,{dark:'#7b5f9a',mid:'#a487c0',light:'#c3abd8'});
  for(let yy=41+y;yy<52;yy+=3)r.line(19,yy,37,yy,'#8f73ab');
  r.poly([[23,38+y],[33,38+y],[30,43+y],[26,43+y]],SKIN.base);r.line(24,39+y,32,39+y,'#5d3f5e');
  r.rect(20,50,16,3,'#5d3f5e');
  return {sleeve:'#a487c0',sleeveLight:'#c3abd8',cuff:'#7b5f9a',pants:'#c2a874',pantsShade:'#8f7650',pantsLight:'#dcc596',shoe:'#5b4a3a',shoeLight:'#8a7460'};
 },
 casual(r,y){
  // Passione Leisure: open black jacket over a lilac tee and cream trousers.
  torso(r,y,{dark:'#7b5f9a',mid:'#a487c0'});r.rect(25,41+y,6,2,'#c3abd8');
  r.poly([[17,38+y],[24,38+y],[25,53],[18,53]],'#221d2b');r.poly([[32,38+y],[39,38+y],[38,53],[31,53]],'#221d2b');
  r.line(23,39+y,24,52,'#3e3650');r.line(33,39+y,32,52,'#3e3650');r.poly([[22,38+y],[25,38+y],[24,44+y]],'#3e3650');r.poly([[34,38+y],[31,38+y],[32,44+y]],'#3e3650');
  return {sleeve:'#221d2b',sleeveLight:'#3e3650',cuff:'#3e3650',pants:'#e4dccb',pantsShade:'#aea38f',pantsLight:'#f6f0e2',shoe:'#3e3650',shoeLight:'#6a6080'};
 },
 pajamas(r,y,walk){
  // Crimson Dream Robe: long plum robe with gold piping and a tied sash.
  r.poly([[17,38+y],[39,38+y],[41+walk,64],[15+walk,64]],'#5a2f55');r.poly([[18,39+y],[38,39+y],[39+walk,63],[17+walk,63]],'#86497c');
  r.poly([[24,38+y],[28,47],[32,38+y],[30,38+y],[28,43],[26,38+y]],SKIN.base);r.line(24,38+y,28,48,'#d9bd70');r.line(32,38+y,28,48,'#d9bd70');r.line(28,48,26+walk,63,'#d9bd70');
  r.rect(18,48,20,3,'#d9bd70');r.rect(30,50,3,6,'#b0924d');
  for(const [x,yy]of [[21,54],[34,57],[23,60]]){r.put(x+walk,yy,'#b45c8c');r.put(x+1+walk,yy+1,'#b45c8c');}
  return {sleeve:'#86497c',sleeveLight:'#a8649b',cuff:'#d9bd70',bare:true,shoe:'#d9bd70',shoeLight:'#f0dca0'};
 },
 swimsuit(r,y){
  // Crimson Current: open short-sleeved beach shirt, bare chest, swim shorts.
  torso(r,y,{dark:SKIN.shade,mid:SKIN.base});r.line(28,43+y,28,51,SKIN.shade);r.line(23,47,33,47,SKIN.shade);
  r.poly([[17,38+y],[25,38+y],[24,53],[18,53]],'#9b3550');r.poly([[31,38+y],[39,38+y],[38,53],[32,53]],'#9b3550');
  for(const [x,yy]of [[19,42],[21,48],[34,41],[36,47],[19,51]]){r.rect(x,yy,2,2,'#e2b35d');r.put(x,yy,'#f6dba0');}
  r.rect(19,51,18,2,'#6a2338');
  return {sleeve:'#9b3550',sleeveLight:'#c25570',bareArm:true,short:true,pants:'#2f5d74',pantsShade:'#1f3f52',pantsLight:'#4c86a0',cuff:'#e2b35d',shoe:'#8b5a3c',shoeLight:'#b98864'};
 },
};
function arms(r,y,g,{attack,special}){
 const sleeve={color:g.sleeve,light:g.sleeveLight,width:5};
 const bare={color:SKIN.base,light:SKIN.light,width:4};
 // Short sleeves stop at the elbow so the forearm shows skin.
 const draw=(x0,y0,x1,y1)=>{if(g.bareArm){const mx=Math.round((x0+x1)/2),my=Math.round((y0+y1)/2);limb(r,x0,y0,x1,y1,{...bare});limb(r,x0,y0,mx,my,{...sleeve,hand:null});}else limb(r,x0,y0,x1,y1,sleeve);if(g.cuff&&!g.bareArm)r.rect(x1-1,y1+1,5,2,g.cuff);};
 if(special){draw(18,40+y,9,33);draw(38,40+y,47,33);return;}
 draw(18,40+y,14,53);
 if(attack)draw(38,40+y,48,40);else draw(38,40+y,42,53);
}
// Diavolo's own face: longer and narrower with an angular jaw, high cheekbones,
// narrow heavy-lidded eyes with dark liner, thin angled brows and dark lipstick.
const LIP='#4f3a4e',LIP_LIGHT='#76596f',LINER='#2a1f2d';
function emperorHead(r,y){
 const {poly,rect,line,put}=r;
 rect(25,36+y,6,4,SKIN.shade);
 poly([[19,19+y],[37,19+y],[37,29+y],[35,34+y],[31,39+y],[25,39+y],[21,34+y],[19,29+y]],SKIN.shade);
 poly([[20,19+y],[36,19+y],[36,29+y],[34,33+y],[30,38+y],[26,38+y],[22,33+y],[20,29+y]],SKIN.base);
 // Cheekbone hollows and a narrow nose shadow.
 line(21,30+y,23,33+y,SKIN.shade);line(35,30+y,33,33+y,SKIN.shade);line(28,29+y,28,31+y,SKIN.shade);put(27,32+y,SKIN.shade);
 rect(22,30+y,2,1,SKIN.light);rect(33,30+y,2,1,SKIN.light);
}
function emperorFace(r,y,{expression,blink}){
 const {rect,line,put}=r,hurt=expression==='hurt',focus=expression==='focused'||expression==='ultimate';
 for(const [x,side]of [[21,-1],[31,1]]){
  // Thin brow angled down toward the nose; it drops further when focused.
  const inner=side<0?x+4:x,outer=side<0?x:x+4;line(outer,23+y,inner,focus?25+y:24+y,LINER);
  if(blink){line(x,28+y,x+4,28+y,LINER);continue;}
  if(hurt){line(x,27+y,x+4,28+y,LINER);line(x,29+y,x+4,28+y,LINER);continue;}
  // Heavy upper lid with liner flicked at the outer corner, a narrow white and a small green iris.
  line(x,27+y,x+4,27+y,LINER);put(outer+(side<0?-1:1),26+y,LINER);
  rect(x,28+y,5,2,'#f1ece0');rect(x+(side<0?2:1),28+y,2,2,GREEN);put(x+(side<0?2:2),28+y,GREEN_DARK);put(x+(side<0?3:1),28+y,'#eaf5e4');
  line(x+1,30+y,x+3,30+y,SKIN.shade);
 }
 // Dark lipstick: a full lower lip under a thin upper line.
 if(hurt){rect(26,34+y,4,2,LIP);put(27,34+y,'#efe6dc');return;}
 if(expression==='ultimate'){rect(26,34+y,4,2,LIP);rect(27,35+y,2,1,'#2a1f2d');return;}
 line(26,34+y,30,34+y,LIP);rect(27,35+y,3,1,LIP);put(28,35+y,LIP_LIGHT);
}
function face(r,y,{expression,blink,doppio}){
 if(!doppio){emperorFace(r,y,{expression,blink});return;}
 const hurt=expression==='hurt',focus=expression==='focused'||expression==='ultimate';
 for(const [x,side]of [[21,-1],[31,1]])eye(r,x,26+y,{iris:'#93ad7f',irisDark:'#5f7a55',lash:INK,side,closed:blink,hurt,focus});
 // Doppio keeps a softer, nervous mouth.
 mouth(r,34+y,expression,{lip:'#b9707a'});
}
export function diavoloPixels({frame=0,moving=false,pose='',attack=false,expression='neutral',blink=false,skin='default'}={}){
 const special=!!pose;if(special){expression='ultimate';}
 const o=OUTFITS[skin]||OUTFITS.default,paint=GARMENTS[skin]||GARMENTS.default,h=HAIR,doppio=skin==='doppio';
 const r=canvas(),{walk,y:bob}=motion({frame,moving}),y=bob-2;
 backHair(r,o.hair,h,walk,y);
 const g=paint(canvas(),y,walk);
 if(g.bare)legs(r,walk,{...g,bare:true});else legs(r,walk,g);
 if(g.patterned)for(const [i,x]of [21,31].entries()){const d=i?walk:-walk;for(const yy of [55,60,64])r.rect(x+d+1+(yy%2),yy,2,1,'#3a2745');}
 paint(r,y,walk);
 arms(r,y,g,{attack,special});
 // The sheer net sleeves let skin show through a diagonal mesh.
 if(g.net)for(let yy=36;yy<56;yy++)for(let x=6;x<52;x++){const c=r.pixels[yy*56+x];if((c==='#d2a698'||c==='#e6bdac')&&((x+yy)%3===0||(x-yy+90)%3===0))r.put(x,yy,'#a87c84');}
 if(doppio)head(r,y);else emperorHead(r,y);face(r,y,{expression,blink,doppio});
 frontHair(r,o.hair,h,y);
 spots(r,h,doppio?[[19,12],[33,10],[38,19],[16,22],[24,8]]:[[19,13],[24,9],[33,9],[37,14],[17,22],[39,24],[16,32],[40,34],[15,42],[41,44],[18,50],[38,50],[20,28],[36,29]]);
 if(o.shades){r.rect(20,9+y,16,2,'#2c2433');r.rect(21,9+y,5,2,'#3e5f7a');r.rect(30,9+y,5,2,'#3e5f7a');r.put(22,9+y,'#9cc7e0');r.put(31,9+y,'#9cc7e0');}
 if(special){
  // Time Erasure: a crimson glare frames his raised hands.
  for(const [x,yy]of [[8,30],[46,30]]){r.rect(x,yy,3,3,'#e8566e');r.put(x+1,yy+1,'#ffd6dc');}
 }
 return selout(r.pixels,INK);
}
