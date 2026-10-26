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
 // Bracket-shaped silver crescents framing her head: each emerges from behind the hair
 // above the temple, bulges outward beside the eyes and curls back in to a point by
 // the cheek, in front of the side locks.
 const {poly,line,put}=r;
 for(const s of [-1,1]){const p=(dx,yy)=>[28+s*dx,yy+y];
  poly([p(11,13),p(15,14),p(18,18),p(19,23),p(18,28),p(15,32),p(11,35),p(14,31),p(16,27),p(16,23),p(15,19),p(12,15)],C.hornDark);
  poly([p(12,14),p(15,15),p(17,19),p(18,23),p(17,28),p(14,32),p(12,34),p(14,30),p(15,27),p(15,23),p(14,19),p(12,16)],C.hornShade);
  line(...p(13,14),...p(16,17),C.horn);line(...p(17,19),...p(17,26),C.horn);line(...p(16,28),...p(14,31),C.horn);put(...p(17,21),'#ffffff');
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
 if(ultimate){limb(r,20,41+y,13,28+y,{color:SKIN.base,light:SKIN.light,width:3});limb(r,36,41+y,43,28+y,{color:SKIN.base,light:SKIN.light,width:3});mikoSleeve(r,19,38+y,14,-1);mikoSleeve(r,37,38+y,14,1);fragment(r,7,14+y,true);fragment(r,49,14+y,true);return 'book';}
 if(raise){limb(r,20,41+y,7,33+y,{color:SKIN.base,light:SKIN.light,width:3});r.line(7,31+y,7,29+y,SKIN.base);fragment(r,7,18+y+(walk?1:0));}
 else{limb(r,20,41+y,10,38+y,{color:SKIN.base,light:SKIN.light,width:3});fragment(r,6,31+y,true);r.line(8,35+y,4,35+y,C.fragmentLight);}
 limb(r,36,41+y,41,52,{color:SKIN.base,light:SKIN.light,width:3});
 mikoSleeve(r,19,38+y,18,-1);mikoSleeve(r,37,38+y,20,1);
}
// ---- Other skins ----
function legs(r,walk,{color=SKIN.base,light=SKIN.light,top=56,shoe,shoeLight,strap}){
 for(const [i,x]of [22,30].entries()){const d=i?walk:-walk;
  r.rect(x+d,top,5,67-top,color);r.rect(x+d+1,top+1,1,64-top,light);
  r.rect(x+d-1,67,7,4,shoe);r.rect(x+d,67,4,1,shoeLight||mix(shoe,'#ffffff',.3));r.rect(x+d-1,70,7,1,mix(shoe,'#000000',.45));if(strap)r.rect(x+d,68,5,1,strap);}
}
function sleeveArms(r,y,{color,light,cuff,bare},{attack,ultimate}){
 // Long sleeves (or bare arms) with a quill on attack and both arms raised for the Author.
 const o=bare?{color:SKIN.base,light:SKIN.light,width:3}:{color,light,width:4};
 const arm=(x0,y0,x1,y1)=>{limb(r,x0,y0,x1,y1,o);if(cuff&&!bare)r.rect(x1-1,y1+1,5,2,cuff);};
 if(ultimate){arm(20,41+y,14,30+y);arm(36,41+y,42,30+y);return 'book';}
 arm(20,41+y,16,52);
 if(attack){arm(36,41+y,45,40+y);quill(r,47,42+y);}else arm(36,41+y,40,52);
}
function tome(r,x,y){
 // A closed violet storybook with gold corners, carried at her side.
 r.rect(x,y,7,9,'#4a2e6e');r.rect(x+1,y,6,8,'#7a52a8');r.rect(x+1,y+1,1,7,'#a07fcf');r.rect(x+3,y+3,3,3,C.sash);r.put(x+4,y+4,C.cord);r.rect(x+6,y,1,9,'#f1e8d6');
}
function stoleAccent(r,y){
 // Her green stole worn as a narrow scarf, medal pinned at the knot.
 r.rect(22,38+y,12,2,C.stoleShade);r.rect(23,38+y,10,1,C.stole);r.line(31,39+y,32,48,C.stoleShade,2);r.line(31,39+y,31,47,C.stole);medal(r,24,39+y);
}
function bunHair(r,y){
 // Hair pinned up for the bath: blunt fringe and side locks, a bun with a gold kanzashi.
 const {poly,line,rect}=r;
 poly([[22,9+y],[25,3+y],[31,3+y],[34,9+y],[31,12+y],[25,12+y]],C.hairShade);poly([[23,9+y],[25,4+y],[31,4+y],[33,9+y],[30,11+y],[26,11+y]],C.hair);line(25,6+y,30,5+y,C.hairLight);
 line(33,4+y,40,1+y,C.sash);rect(39,0+y,3,2,'#e07ab0');rect(18,9+y,3,3,'#f0b3c4');
 frontHair(r,y);
}
const LOOKS={
 casual:{
  // Reading Room: cream cardigan over a lavender blouse, long plum pleated skirt,
  // dark tights and loafers, a storybook under her arm.
  garment(r,y,w){
   legs(r,w,{color:'#3b3048',light:'#5a4c6a',top:60,shoe:'#5a3a2c',strap:'#8a6a4c'});
   r.poly([[20,48],[36,48],[41+w,64],[15+w,64]],'#4f2f55');r.poly([[21,48],[35,48],[39+w,63],[17+w,63]],'#71467a');
   for(const a of [-6,-2,2,6])r.line(28+a,49,28+a*1.6+w,62,'#4f2f55');r.line(17+w,63,39+w,63,'#9a6aa2');
   r.poly([[20,39+y],[36,39+y],[37,50],[19,50]],'#cdbfa4');r.poly([[21,40+y],[35,40+y],[36,49],[20,49]],'#ece0c6');
   r.poly([[25,40+y],[31,40+y],[30,49],[26,49]],'#c9b5e6');r.poly([[25,40+y],[28,43+y],[31,40+y]],'#ffffff');
   for(const yy of [43,46])r.put(28,yy,'#8a6a4c');for(let yy=41;yy<49;yy+=2){r.put(21,yy,'#d9ccb0');r.put(34,yy,'#d9ccb0');}
   return {sleeve:{color:'#ece0c6',light:'#fff7e2',cuff:'#cdbfa4'},after(r,y,state){if(!state.attack&&!state.ultimate)tome(r,12,49);},accent:true};
  }},
 pajamas:{
  // The Final Bedtime Story: long lilac nightgown with frilled hem and gold stars,
  // a green shawl over the shoulders and a storybook hugged to her chest.
  garment(r,y,w){
   legs(r,w,{top:66,shoe:'#f4e4ee',shoeLight:'#ffffff',strap:'#e7a3c0'});
   r.poly([[20,40+y],[36,40+y],[40,52],[44+w,66],[12+w,66],[16,52]],'#9a86c6');r.poly([[21,41+y],[35,41+y],[39,52],[42+w,65],[14+w,65],[17,52]],'#c4b4e6');
   for(let x=13+w;x<44+w;x+=3){r.rect(x,65,2,2,'#fbeefa');r.put(x+2,66,'#d9c8ee');}
   for(const a of [-6,0,6])r.line(28+a*.6,48,28+a*1.6+w,63,'#e0d6f4');
   for(const [x,yy]of [[19,56],[33,52],[26,61],[37,60]]){r.rect(x+w,yy,2,2,C.sash);r.put(x+w-1,yy,C.sash);r.put(x+w,yy-1,C.sash);}
   r.rect(22,40+y,12,2,'#fbeefa');
   // Shawl draped over both shoulders.
   r.poly([[18,39+y],[38,39+y],[37,45],[30,48],[26,48],[19,45]],C.stoleShade);r.poly([[19,40+y],[37,40+y],[36,44],[30,47],[26,47],[20,44]],C.stole);r.line(21,41+y,35,41+y,C.stoleLight);
   return {sleeve:{color:'#c4b4e6',light:'#e0d6f4',cuff:'#fbeefa'},after(r,y,state){if(!state.attack&&!state.ultimate)tome(r,24,44+y);}};
  }},
 swimsuit:{
  // Witch of the Summer Sea: violet one-piece with a white sailor collar, sheer pink
  // pareo knotted at the hip, sandals, and a pink paper parasol over the shoulder.
  garment(r,y,w){
   legs(r,w,{top:52,shoe:'#c9a77a',shoeLight:'#e9d2a8',strap:C.cord});
   r.poly([[21,40+y],[35,40+y],[35,53],[31,55],[25,55],[21,53]],'#5d3f86');r.poly([[22,41+y],[34,41+y],[34,52],[30,54],[26,54],[22,52]],'#8462b4');r.line(23,42+y,23,51,'#a98bd6');
   r.poly([[21,40+y],[35,40+y],[32,44+y],[28,46+y],[24,44+y]],'#ffffff');r.line(22,41+y,28,45+y,'#7fa8d8');r.line(34,41+y,28,45+y,'#7fa8d8');r.rect(27,45+y,2,2,C.cord);
   // Pareo: translucent pink wrap falling from the viewer-right hip.
   r.poly([[22,51],[36,50],[40+w,64],[30+w,62],[24,57]],mix('#f0b3c4','#ffffff',.25));r.poly([[30,52],[36,50],[38+w,60],[33+w,59]],'#f0b3c4');r.rect(34,50,3,3,C.stole);
   return {sleeve:{bare:true},after(r,y,state){if(state.attack||state.ultimate)return;
    // Wagasa parasol resting on the viewer-left shoulder.
    r.line(18,50,10,22,'#7a4a2e');r.poly([[1,24],[8,15],[16,13],[22,18],[19,22],[10,24]],'#c06a8c');r.poly([[3,23],[9,16],[16,15],[20,18],[17,21],[10,22]],'#f0b3c4');
    for(const x of [8,12,16])r.line(10,22,x,15,'#c06a8c');r.put(12,14,'#ffffff');}};
  }},
 lotusswim:{
  // Moonlit Lotus: indigo halter top, high-waisted pink lotus-petal skirt, gold moon
  // armlets and a lotus blossom in her hair.
  garment(r,y,w){
   legs(r,w,{top:56,shoe:'#e9d2a8',shoeLight:'#fff0c8',strap:C.sash});
   r.rect(22,48,12,4,SKIN.base);
   r.poly([[22,40+y],[34,40+y],[33,47],[23,47]],'#2e2a62');r.poly([[23,41+y],[33,41+y],[32,46],[24,46]],'#4a438e');r.line(25,40+y,28,37+y,'#2e2a62');r.line(31,40+y,28,37+y,'#2e2a62');r.put(28,44+y,C.sash);
   for(const [x,tip]of [[18,60],[22,62],[26,63],[30,63],[34,62],[38,60]])r.poly([[x,51],[x+4,51],[x+2+w*.5,tip]],x%8===2?'#d87ea4':'#f4b4cc');
   r.rect(20,51,16,2,'#2e2a62');r.put(28,51,C.sash);
   return {sleeve:{bare:true},after(r,y,state){for(const x of [15,40])r.rect(x,45+y,3,2,C.sash);},flower:true};
  }},
 bathsuit:{
  hair:'bun',
  // Theatergoing Bath Yukata: pink yukata with white blossoms, magenta obi, geta,
  // and a folding fan in hand.
  garment(r,y,w){
   for(const [i,x]of [22,30].entries()){const d=i?w:-w;r.rect(x+d,64,5,3,SKIN.base);r.rect(x+d-1,67,7,2,'#8a5a3a');r.rect(x+d,69,1,2,'#5a3a2a');r.rect(x+d+4,69,1,2,'#5a3a2a');r.rect(x+d+1,66,3,1,C.cord);}
   r.poly([[20,39+y],[36,39+y],[38,52],[38+w,66],[18+w,66],[18,52]],C.gownShade);r.poly([[21,40+y],[35,40+y],[37,52],[37+w,65],[19+w,65],[19,52]],C.gown);
   r.line(24,49,22+w,65,C.gownShade);r.poly([[22,40+y],[28,47+y],[34,40+y],[32,40+y],[28,44+y],[24,40+y]],'#ffffff');
   for(const [x,yy]of [[22,55],[33,52],[27,61],[35,62]]){r.rect(x+w,yy,3,3,'#ffffff');r.put(x+w+1,yy+1,C.sash);}
   r.rect(19,46,18,5,C.obiShade);r.rect(20,46,16,4,C.obi);r.line(20,48,35,48,C.cord);r.rect(26,47,4,3,mix(C.obi,'#ffffff',.3));
   return {sleeve:{color:C.gown,light:C.gownLight,cuff:'#ffffff'},after(r,y,state){if(state.attack||state.ultimate)return;
    // Folding fan held open at her side.
    r.poly([[40,52],[36,44],[40,42],[44,42],[47,45]],'#f6f3ee');for(const x of [38,41,44])r.line(41,52,x,43,C.obi);r.rect(40,52,2,2,'#7a4a2e');}};
  }},
};
function outfit(r,y,walk,look,state){
 const g=look.garment(r,y,walk);
 const extra=sleeveArms(r,y,g.sleeve,state);
 g.after?.(r,y,state);
 if(g.accent)stoleAccent(r,y);
 return {extra,flower:g.flower};
}
function lotusFlower(r,y){for(const [dx,dy]of [[0,-2],[-2,0],[2,0],[-1,-1],[1,-1]])r.rect(13+dx,14+y+dy,2,2,'#f4b4cc');r.put(14,15+y,C.sash);}
const look_hair=skin=>LOOKS[skin]?.hair;
export function featherinePixels({frame=0,moving=false,pose='',attack=false,expression='neutral',blink=false,skin='default'}={}){
 const ultimate=!!pose;if(ultimate&&expression!=='hurt')expression='ultimate';
 const r=canvas(),{walk,y}=motion({frame,moving}),shrine=skin==='shrine';
 if(look_hair(skin)!=='bun')backHair(r,y,walk);
 let extra,flower=false;const look=LOOKS[skin]||{};
 if(LOOKS[skin]){const o=outfit(r,y,walk,look,{attack,ultimate});extra=o.extra;flower=o.flower;}
 else if(shrine){hakama(r,y,walk);stoleFront(r,y,walk,{bottom:60});extra=mikoPose(r,y,walk,{attack,ultimate});}
 else{gown(r,y,walk);stoleFront(r,y,walk);extra=witchPose(r,y,{attack,ultimate});}
 head(r,y);
 face(r,y,expression,blink);
 if(look.hair==='bun')bunHair(r,y);else frontHair(r,y);
 horns(r,y);
 if(flower)lotusFlower(r,y);
 if(extra==='book')book(r,28,1+y);
 return selout(r.pixels,INK);
}
