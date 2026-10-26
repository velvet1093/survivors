import {buildHero,torso,casual,swim,yukata,skirt,emblem,longHairBack,fringe,bow,mix,SKIN} from './hero-builder.js';
import {eye,mouth,limb} from './hero-kit.js';
// Featherine: long purple hime-cut hair with curled horn ornaments, violet eyes, a pink
// kimono-style dress with a long green stole and gold obi, and her Author's Quill.
export const FEATHERINE_COLORS={hair:'#5b4a8c',hairShade:'#3a2d63',hairLight:'#8b78bd',horn:'#e9e6f0',hornShade:'#a7a3b8',robe:'#f0b3c4',robeShade:'#c27b92',robeLight:'#ffd8e2',stole:'#7fae5a',stoleShade:'#4e7a3a',gold:'#e0bc6a',iris:'#9b7ad0'};
const C=FEATHERINE_COLORS,INK='#2c2440',H={h:C.hair,s:C.hairShade,l:C.hairLight};
function horns(r,c){
 // Curled ram-like ornaments arc out from both sides of the head.
 const y=c.y,{poly,line}=r;
 for(const side of [-1,1]){const x=side<0?16:40;
  poly([[x,16+y],[x+side*6,8+y],[x+side*10,12+y],[x+side*11,20+y],[x+side*7,26+y],[x+side*5,22+y],[x+side*8,18+y],[x+side*6,13+y],[x+side*2,18+y]],C.hornShade);
  poly([[x,16+y],[x+side*5,10+y],[x+side*9,13+y],[x+side*10,19+y],[x+side*7,24+y],[x+side*6,21+y],[x+side*8,18+y],[x+side*6,14+y],[x+side*2,17+y]],C.horn);
  line(x+side*4,11+y,x+side*8,13+y,'#ffffff');
 }
}
function face(r,c){
 const y=c.y,hurt=c.expression==='hurt',focus=c.expression==='focused'||c.expression==='ultimate';
 for(const [x,side]of [[21,-1],[31,1]])eye(r,x,26+y,{iris:C.iris,irisDark:'#5a3e8c',lash:INK,side,closed:c.blink,hurt,focus});
 mouth(r,34+y,c.expression,{lip:'#b46e84'});
}
function kimono(r,c){
 const w=c.walk,b=torso(r,c,{color:C.robe,shade:C.robeShade,light:C.robeLight,bottom:50});
 r.poly([[b.l,48],[b.r,48],[b.r+5+w,67],[b.l-5+w,67]],C.robeShade);r.poly([[b.l+1,48],[b.r-1,48],[b.r+3+w,66],[b.l-3+w,66]],C.robe);
 r.poly([[24,b.t+c.y],[28,b.t+7+c.y],[32,b.t+c.y],[30,b.t+c.y],[28,b.t+4+c.y],[26,b.t+c.y]],'#ffffff');r.line(28,49,26+w,66,C.robeShade);
 r.rect(b.l+1,46,b.r-b.l-2,3,C.gold);r.rect(27,46,3,3,'#b04a5a');
 for(const [x,yy]of [[22,56],[33,59],[26,63]])emblem.flower(r,x+w,yy,'#ffffff',C.gold);
 return {sleeve:C.robe,sleeveLight:C.robeLight,cuff:C.robeShade,sleeveWidth:6,noLegs:true,
  afterArms(r,c){
   // Long green stole over both shoulders, hanging past the knees.
   r.line(20,40+c.y,19+c.walk,60,C.stoleShade,3);r.line(20,40+c.y,19+c.walk,60,C.stole,2);r.line(36,40+c.y,37+c.walk,60,C.stoleShade,3);r.line(36,40+c.y,37+c.walk,60,C.stole,2);
   r.rect(18+c.walk,59,3,3,C.gold);r.rect(36+c.walk,59,3,3,C.gold);}};
}
function shrine(r,c){
 // Miko: white top, red hakama, green stole and a long ceremonial staff.
 const b=torso(r,c,{color:'#f4f1ea',shade:'#c9c2b2',light:'#ffffff',bottom:50});
 r.poly([[24,b.t+c.y],[28,b.t+6+c.y],[32,b.t+c.y]],'#e9dcc8');
 r.poly([[b.l,48],[b.r,48],[b.r+4+c.walk,66],[b.l-4+c.walk,66]],'#8a2e3a');r.poly([[b.l+1,48],[b.r-1,48],[b.r+2+c.walk,65],[b.l-2+c.walk,65]],'#c0485a');
 for(const a of [-4,0,4])r.line(28+a,50,28+a*1.6+c.walk,64,'#9a3846');r.rect(b.l+1,47,b.r-b.l-2,2,'#8a2e3a');
 return {sleeve:'#f4f1ea',sleeveLight:'#ffffff',cuff:'#c9c2b2',sleeveWidth:6,legs:'bare',legTop:64,shoe:'#f4f1ea',
  afterArms(r,c){r.line(20,40+c.y,19,58,C.stole,2);r.line(36,40+c.y,37,58,C.stole,2);r.line(10,20,14,70,'#6b4a3a',2);r.rect(7,16,8,3,C.gold);r.line(8,19,6,26,C.gold);r.line(14,19,16,26,C.gold);}};
}
function nightRobe(r,c){
 const w=c.walk,b=torso(r,c,{color:'#b8a8dc',shade:'#7d6aa8',light:'#ddd2f2',bottom:50});
 r.poly([[b.l,48],[b.r,48],[b.r+4+w,66],[b.l-4+w,66]],'#7d6aa8');r.poly([[b.l+1,48],[b.r-1,48],[b.r+2+w,65],[b.l-2+w,65]],'#b8a8dc');
 r.rect(b.l+1,47,b.r-b.l-2,2,C.stole);for(const [x,yy]of [[22,55],[33,58]])emblem.star(r,x+w,yy,C.gold);
 return {sleeve:'#b8a8dc',sleeveLight:'#ddd2f2',cuff:'#7d6aa8',sleeveWidth:6,legs:'bare',legTop:64,shoe:'#ddd2f2'};
}
function quill(r,c){
 // A long white quill with a gold nib, held up while writing.
 const cast=c.attack||c.special,x=cast?46:42,yy=cast?(c.special?30:40)+c.y:50+c.y,{line,rect,put}=r;
 line(x,yy,x+5,yy-12,'#f4f2fa',2);line(x+2,yy-3,x+6,yy-10,C.hornShade);rect(x-1,yy,2,3,C.gold);put(x-1,yy+3,'#2c2440');
 if(cast){put(x-2,yy+4,'#b04a5a');put(x-3,yy+5,'#b04a5a');}
}
function featherineArms(r,c,g){
 const sleeve=g.bareArms?{color:SKIN.base,light:SKIN.light,width:4}:{color:g.sleeve,light:g.sleeveLight,width:g.sleeveWidth||5,hand:SKIN.base,handShade:SKIN.shade},sy=40+c.y;
 const arm=(x0,y0,x1,y1)=>{if(g.short){limb(r,x0,y0,x1,y1,{color:SKIN.base,light:SKIN.light,width:4});limb(r,x0,y0,Math.round((x0+x1)/2),Math.round((y0+y1)/2),{...sleeve,hand:null});}else{limb(r,x0,y0,x1,y1,sleeve);if(g.cuff)r.rect(x1-1,y1+2,5,2,g.cuff);}};
 arm(18,sy,14,sy+12);
 if(c.special)arm(38,sy,45,sy-10);else if(c.attack)arm(38,sy,45,sy);else arm(38,sy,41,sy+10);
}
const LOOKS={
 default:{garment:kimono},
 shrine:{garment:shrine},
 casual:{garment:(r,c)=>casual(r,c,{top:'tee',color:'#f4f1ea',jacket:'#8b78bd',bottom:'skirt',skirtColor:'#3a2d63',motif:(r,c)=>{r.rect(26,44+c.y,4,3,C.gold);r.line(27,45+c.y,29,45+c.y,'#b04a5a');},shoe:'#3a2d63'})},
 pajamas:{garment:nightRobe},
 swimsuit:{garment:(r,c)=>swim(r,c,{style:'swimdress',color:'#8b78bd',accent:C.gold,motif:(r,c)=>bow(r,28,43+c.y,C.stole,C.stoleShade,2)})},
 lotusswim:{garment:(r,c)=>swim(r,c,{style:'onepiece',color:'#5b4a8c',accent:'#f0b3c4',motif:(r,c)=>emblem.flower(r,28,46+c.y,'#f0b3c4',C.gold)})},
 bathsuit:{garment:(r,c)=>yukata(r,c,{color:'#8b78bd',obi:C.gold,collar:'#ffffff',pattern:(r,x,y)=>emblem.flower(r,x,y,'#f0b3c4',C.gold)})},
};
export function featherinePixels(opts={}){
 const look=LOOKS[opts.skin]||LOOKS.default,spec={build:'adult',ink:INK,idlePoses:[]};
 return buildHero(spec,{
  back:(r,c)=>longHairBack(r,c,H,{length:62,width:2}),
  garment:(r,c)=>{const g=look.garment(r,c);g.arms=featherineArms;return g;},
  prop:quill,
  face,
  front:(r,c)=>{fringe(r,c,H,{style:'straight',locks:40});horns(r,c);},
 },opts);
}
