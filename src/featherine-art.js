import {canvas,motion,eye,mouth,head,limb,selout,mix,SKIN} from './hero-kit.js';
// Featherine Augustus Aurora. Both reference outfits share the long violet hime cut,
// the silver crescent horns, half-lidded violet eyes and the green stole with its medal.
// default: strapless pink gown, opera gloves, magenta obi, yellow chevron sash,
// rainbow ribbon and wooden cane. shrine: white kimono top, detached pink sleeves,
// crimson hakama, tabi and zori, feathered stole and a floating blue fragment.
const INK='#2a2236';
export const FEATHERINE_COLORS={
 hair:'#5a3f86',hairShade:'#36265a',hairLight:'#8162b4',hairSheen:'#a98bd6',
 horn:'#e9ebf0',hornShade:'#9ba0ae',hornDark:'#62667a',
 iris:'#9a72cf',irisDark:'#55387e',
 gown:'#f4bcc6',gownShade:'#d08c9e',gownDeep:'#a9647c',gownLight:'#ffdde2',
 obi:'#d26fbd',obiShade:'#9a4790',cord:'#c8323e',
 sash:'#ead64e',sashShade:'#b9a12f',
 stole:'#7fbd4a',stoleShade:'#4f8636',stoleLight:'#b2dc78',
 white:'#f6f3ee',whiteShade:'#c9c3c8',
 hakama:'#a3303f',hakamaShade:'#6e1f30',hakamaLight:'#c94f5b',
 sleeve:'#ee9ea6',sleeveShade:'#c06a7c',sleeveLight:'#ffc6c9',
 fragment:'#7fd0f4',fragmentLight:'#e4f8ff',fragmentDark:'#3f8fc8',
 cane:'#8e5e38',caneLight:'#c08a55',
};
const C=FEATHERINE_COLORS;
const RAINBOW=['#c8323e','#2f6fd0','#4fae4a'];

function backHair(r,y,walk){
 const {poly,line}=r;
 // Straight, heavy hime-cut curtain falling well past the waist.
 poly([[15,22+y],[17,12+y],[23,8+y],[33,8+y],[39,12+y],[41,22+y],[42,40],[43+walk*.5,58],[39+walk*.5,62],[17+walk*.5,62],[13+walk*.5,58],[14,40]],C.hairShade);
 poly([[16,22+y],[18,13+y],[23,10+y],[33,10+y],[38,13+y],[40,22+y],[41,40],[41+walk*.5,57],[38+walk*.5,60],[18+walk*.5,60],[15+walk*.5,57],[15,40]],C.hair);
 line(17,28,16+walk*.4,56,C.hairLight);line(39,28,40+walk*.4,56,C.hairLight);
 for(const x of [19,37])line(x,40,x+walk*.4,58,C.hairShade);
}
function horns(r,y){
 // Slim silver crescents lying almost flat: they leave the crown, sweep outward past
 // the hair and hook down at the tips, like a broken halo.
 const {poly,line,put}=r;
 for(const s of [-1,1]){const p=(dx,yy)=>[28+s*dx,yy+y];
  poly([p(6,13),p(10,10),p(15,10),p(19,11),p(22,14),p(23,18),p(21,20),p(20,16),p(17,13),p(12,12),p(8,14)],C.hornDark);
  poly([p(7,12),p(10,11),p(15,11),p(19,12),p(21,15),p(22,18),p(21,19),p(19,15),p(16,13),p(11,13),p(8,13)],C.hornShade);
  line(...p(9,11),...p(16,11),C.horn);line(...p(17,11),...p(20,13),C.horn);line(...p(21,14),...p(22,17),C.horn);put(...p(13,11),'#ffffff');
 }
}
function frontHair(r,y){
 const {poly,line,rect}=r;
 // Blunt fringe cut straight across the brows, plus hime side locks cut at the jaw.
 poly([[16,30+y],[16,18+y],[19,12+y],[27,10+y],[35,11+y],[39,16+y],[40,30+y],[40,25+y],[16,25+y]],C.hairShade);
 poly([[17,25+y],[17,18+y],[20,13+y],[27,11+y],[34,12+y],[38,17+y],[39,25+y]],C.hair);
 rect(17,24+y,22,1,C.hairShade);
 for(const x of [21,25,29,33,36])line(x,15+y,x,23+y,C.hairShade);
 line(21,14+y,27,12+y,C.hairLight);line(29,12+y,34,13+y,C.hairLight);rect(23,13+y,3,1,C.hairSheen);
 for(const [x,w]of [[16,3],[37,3]]){poly([[x,22+y],[x+w,22+y],[x+w,37+y],[x,37+y]],C.hairShade);rect(x+(x<28?1:0),23+y,w-1,13,C.hair);line(x+1,24+y,x+1,35+y,C.hairLight);}
}
function face(r,y,expression,blink){
 const hurt=expression==='hurt',focus=expression==='focused'||expression==='ultimate';
 for(const [x,side]of [[21,-1],[31,1]]){
  eye(r,x,26+y,{iris:C.iris,irisDark:C.irisDark,lash:INK,side,closed:blink,hurt,focus});
  // Heavy, languid lids: the upper row of each eye stays shaded unless she is roused.
  if(!blink&&!hurt&&expression!=='ultimate')r.line(x+(side<0?1:0),27+y,x+(side<0?3:2),27+y,mix(C.irisDark,INK,.4));
 }
 if(expression==='neutral'){
  // A faint, knowing smile tilted to one side.
  r.put(26,34+y,'#b06a7e');r.rect(27,35+y,2,1,'#b06a7e');r.put(29,34+y,'#b06a7e');r.put(30,33+y,'#b06a7e');
 }else if(expression==='ultimate'){
  r.rect(26,34+y,5,2,'#7a3550');r.rect(26,34+y,5,1,'#fff4f6');
 }else mouth(r,34+y,expression,{lip:'#b06a7e'});
}
function medal(r,x,y){
 const {rect,put,poly}=r;
 rect(x,y,5,2,RAINBOW[0]);rect(x+1,y,1,2,RAINBOW[1]);rect(x+3,y,1,2,RAINBOW[2]);
 poly([[x+2,y+2],[x+5,y+5],[x+2,y+8],[x-1,y+5]],'#c99a3a');rect(x+1,y+4,3,3,'#e8c45c');put(x+2,y+5,C.cord);
 rect(x+2,y+8,1,4,C.white);put(x+1,y+11,C.whiteShade);put(x+3,y+11,C.whiteShade);
}
function stoleFront(r,y,walk,{bottom=62}={}){
 // Over the viewer-right shoulder, hanging straight to the knees with a fringed end.
 const {poly,line}=r,w=walk*.3;
 poly([[31,37+y],[37,37+y],[37,46],[37+w,bottom],[31+w,bottom],[31,46]],C.stoleShade);
 poly([[32,38+y],[36,38+y],[36,46],[36+w,bottom-1],[32+w,bottom-1],[32,46]],C.stole);
 line(33,39+y,33+w,bottom-2,C.stoleLight);
 for(let x=31;x<38;x+=2)line(x+w,bottom,x+w,bottom+3,C.stoleShade);for(let x=32;x<37;x+=2)line(x+w,bottom,x+w,bottom+2,C.stole);
 medal(r,32,40+y);
}
function fragment(r,x,y,glow=false){
 const {poly,put,line}=r;
 // Floating blue memory fragment: a slim faceted diamond.
 poly([[x,y],[x+2,y+3],[x,y+8],[x-2,y+3]],C.fragmentDark);poly([[x,y+1],[x+1,y+3],[x,y+6],[x-1,y+3]],C.fragment);
 line(x,y+1,x,y+4,C.fragmentLight);
 if(glow)for(const [dx,dy]of [[-4,3],[4,3],[0,-3],[0,11]])put(x+dx,y+dy,C.fragmentLight);
}
function book(r,x,y){
 const {poly,line,rect}=r;
 // The Author's open tome, hovering above her raised hand.
 poly([[x-8,y+1],[x,y+3],[x+8,y+1],[x+8,y+8],[x,y+10],[x-8,y+8]],'#7a4a2e');
 poly([[x-7,y+1],[x,y+3],[x,y+8],[x-7,y+7]],C.white);poly([[x+1,y+3],[x+7,y+1],[x+7,y+7],[x+1,y+8]],'#ece3d6');
 for(const yy of [3,5])line(x-6,y+yy,x-2,y+yy+1,'#9b8fa8');for(const yy of [3,5])line(x+2,y+yy+1,x+6,y+yy,'#9b8fa8');
 rect(x-1,y-3,2,2,C.sash);
}
function quill(r,x,y){
 const {line,poly,rect}=r;
 poly([[x,y],[x+6,y-10],[x+8,y-11],[x+4,y-3]],C.white);line(x+1,y-1,x+7,y-10,C.whiteShade);rect(x-1,y,2,3,'#c99a3a');
}
// ---- Default: Witch of Theatergoing ----
function gown(r,y,walk){
 const {poly,line,rect,put}=r,w=walk;
 // Floor-length bell gown with a wide trailing hem.
 poly([[21,46],[35,46],[40,54],[46+w,70],[42+w,72],[14+w,72],[10+w,70],[16,54]],C.gownShade);
 poly([[22,46],[34,46],[39,54],[44+w,69],[41+w,71],[15+w,71],[12+w,69],[17,54]],C.gown);
 for(const [a,b]of [[24,-6],[28,-1],[32,5]])line(a,48,a+b+w,69,C.gownLight);
 for(const [a,b]of [[22,-10],[30,2],[35,10]])line(a,50,a+b+w,70,C.gownShade);
 line(12+w,70,44+w,70,C.gownDeep);
 // Rainbow ribbon running from the obi to the hem.
 for(const [i,col]of RAINBOW.entries())line(23+i,48,33+i+w,71,col);
 // Broad yellow chevron sash wrapped around the skirt.
 poly([[12+w,55],[16+w,54],[30+w,61],[42+w,55],[45+w,57],[30+w,66],[12+w,59]],C.sashShade);
 poly([[13+w,56],[16+w,55],[30+w,62],[42+w,56],[44+w,57],[30+w,65],[13+w,58]],C.sash);
 line(14+w,56,30+w,62,mix(C.sash,'#ffffff',.45));
 // Strapless bodice with a red-trimmed neckline above the bare shoulders.
 poly([[21,40+y],[35,40+y],[35,46],[21,46]],C.gownShade);poly([[22,41+y],[34,41+y],[34,46],[22,46]],C.gown);
 line(22,40+y,34,40+y,C.cord);put(28,41+y,C.cord);line(23,42+y,23,45,C.gownLight);
 // Magenta obi with a red cord knot and a hanging tassel.
 rect(20,44,16,5,C.obiShade);rect(21,44,14,4,C.obi);line(21,44,34,44,mix(C.obi,'#ffffff',.3));
 line(21,46,34,46,C.white);rect(26,45,4,3,C.cord);put(27,46,'#ff8a8a');line(27,48,26,53,C.cord);line(29,48,30,52,C.cord);rect(25,53,2,2,C.cord);
 return {legs:false};
}
function gloveArm(r,x0,y0,x1,y1){
 // Bare shoulder, then a long pink opera glove with a red ribbon tied at the bicep.
 const mx=Math.round(x0+(x1-x0)*.3),my=Math.round(y0+(y1-y0)*.3);
 limb(r,x0,y0,x1,y1,{color:C.gown,light:C.gownLight,width:4,hand:C.gown,handShade:C.gownShade});
 r.line(x0,y0,mx,my,SKIN.base,4);r.line(x0,y0,mx,my,SKIN.light,1);
 r.rect(mx-2,my,5,2,C.cord);r.put(mx+2,my+2,C.cord);r.put(mx-2,my+2,C.cord);
}
function witchPose(r,y,{attack,ultimate}){
 if(ultimate){gloveArm(r,20,41+y,14,30+y);gloveArm(r,36,41+y,42,30+y);return 'book';}
 gloveArm(r,20,41+y,16,52);
 if(attack){gloveArm(r,36,41+y,45,40+y);quill(r,47,42+y);}
 else{
  // Resting her gloved hand on the head of a long wooden cane.
  gloveArm(r,36,41+y,41,50);
  r.line(42,52,44,72,C.cane,2);r.line(42,53,43,71,C.caneLight);r.rect(41,51,3,2,C.caneLight);
 }
}
// ---- Shrine: Miko of Fragments ----
function hakama(r,y,walk){
 const {poly,line,rect}=r,w=walk;
 // White tabi with red-thonged zori under the hakama hem.
 for(const [i,x]of [22,30].entries()){const d=i?w:-w;rect(x+d,63,5,6,C.white);rect(x+d+4,63,1,6,C.whiteShade);rect(x+d-1,69,7,2,'#c9a77a');rect(x+d+1,68,3,1,C.cord);rect(x+d-1,70,7,1,'#8d6e4c');}
 // Long crimson pleated hakama, slightly flared.
 poly([[20,47],[36,47],[40,56],[42+w,65],[14+w,65],[16,56]],C.hakamaShade);
 poly([[21,47],[35,47],[39,56],[41+w,64],[15+w,64],[17,56]],C.hakama);
 for(const a of [-9,-4,1,6])line(28+a*.5,49,28+a*1.35+w,63,C.hakamaShade);
 for(const a of [-7,-2,3,8])line(28+a*.5,49,28+a*1.35+w,63,C.hakamaLight);
 line(15+w,64,41+w,64,C.hakamaShade);
 // White kimono top with crossed collar; off the shoulders.
 poly([[20,39+y],[36,39+y],[36,47],[20,47]],C.whiteShade);poly([[21,40+y],[35,40+y],[35,47],[21,47]],C.white);
 line(22,40+y,28,46,C.whiteShade);line(34,40+y,28,46,C.whiteShade);line(23,40+y,28,45,'#e6e0dc');
 // Purple obi with a red cord bow.
 rect(20,45,16,4,'#6e4a8e');rect(21,45,14,3,'#9070b4');rect(26,45,4,3,C.cord);line(25,48,24,52,C.cord);line(30,48,31,52,C.cord);
 return {legs:true};
}
function mikoSleeve(r,x,y,len,side){
 // Detached wide pink sleeve hanging from the upper arm, edged with red cord.
 const {poly,line,put}=r,o=side<0?-1:1,inner=x,outer=x+o*9;
 poly([[inner,y],[outer,y+2],[outer,y+len],[inner+o*2,y+len-2]],C.sleeveShade);
 poly([[inner+o,y+1],[outer-o,y+3],[outer-o,y+len-1],[inner+o*2,y+len-3]],C.sleeve);
 line(inner+o*2,y+2,inner+o*3,y+len-4,C.sleeveLight);
 line(outer,y+2,outer,y+len,C.cord);line(inner+o*2,y+len-2,outer,y+len,C.cord);put(outer,y+len+1,C.cord);put(outer,y+len+2,C.cord);
}
function featheredEnd(r,x,y,dir){
 // Feather-like fringe fanning from the stole's tip.
 for(let i=0;i<5;i++){const fx=x+dir*(i*2),fy=y-i;r.line(fx,fy,fx+dir*3,fy-5,C.stoleShade,2);r.line(fx,fy,fx+dir*2,fy-4,C.stoleLight);}
}
function mikoPose(r,y,walk,{attack,ultimate}){
 // Second stole end flying up behind the viewer-right shoulder.
 r.poly([[34,39+y],[38,34+y],[42+walk,31+y],[45+walk,27+y],[49+walk,26+y],[48+walk,31+y],[44+walk,34+y],[40,38+y],[37,42+y]],C.stoleShade);
 r.poly([[35,39+y],[39,35+y],[42+walk,32+y],[45+walk,28+y],[48+walk,27+y],[47+walk,30+y],[43+walk,33+y],[39,37+y],[37,41+y]],C.stole);
 r.line(38,36+y,46+walk,28+y,C.stoleLight);
 featheredEnd(r,44+walk,27+y,1);
 const raise=ultimate||!attack;
 // Viewer-left hand raised, index finger up, with the fragment floating above it.
 if(ultimate){limb(r,20,41+y,13,28+y,{width:3});limb(r,36,41+y,43,28+y,{width:3});mikoSleeve(r,19,38+y,14,-1);mikoSleeve(r,37,38+y,14,1);fragment(r,13,16+y,true);fragment(r,43,16+y,true);return 'book';}
 if(raise){limb(r,20,41+y,11,31+y,{width:3});r.line(11,29+y,11,27+y,SKIN.base);fragment(r,11,16+y+(walk?1:0));}
 else{limb(r,20,41+y,10,38+y,{width:3});fragment(r,6,31+y,true);r.line(8,35+y,4,35+y,C.fragmentLight);}
 limb(r,36,41+y,41,52,{width:3});
 mikoSleeve(r,19,38+y,18,-1);mikoSleeve(r,37,38+y,20,1);
}
export function featherinePixels({frame=0,moving=false,pose='',attack=false,expression='neutral',blink=false,skin='default'}={}){
 const ultimate=!!pose;if(ultimate&&expression!=='hurt')expression='ultimate';
 const r=canvas(),{walk,y}=motion({frame,moving}),shrine=skin==='shrine';
 backHair(r,y,walk);
 horns(r,y);
 let extra;
 if(shrine){hakama(r,y,walk);stoleFront(r,y,walk,{bottom:60});extra=mikoPose(r,y,walk,{attack,ultimate});}
 else{gown(r,y,walk);stoleFront(r,y,walk);extra=witchPose(r,y,{attack,ultimate});}
 head(r,y);
 face(r,y,expression,blink);
 frontHair(r,y);
 if(extra==='book')book(r,28,1+y);
 return selout(r.pixels,INK);
}
