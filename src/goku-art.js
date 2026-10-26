import {buildHero,torso,casual,pajamas,swim,emblem,mix,SKIN} from './hero-builder.js';
import {eye,mouth,limb} from './hero-kit.js';
// Goku: orange gi over a navy undershirt, blue wristbands, belt and boots, and big
// black spikes. Saiyan stages (form 1-4, or the Super Saiyan skin) change the hair and
// eyes only: gold spikes, sharper SS2 spikes, a waist-length SS3 mane, then blue.
export const GOKU_HAIR={base:['#182331','#101520','#354459'],gold:['#ecd064','#ab7d32','#fff1a3'],blue:['#67c9e8','#357697','#b5f4f2']};
export const GOKU_COLORS={gi:'#f1a14e',giShade:'#c4672f',giLight:'#ffc57d',navy:'#294b79',navyDark:'#1b3156',red:'#bd5b5b',kanji:'#f6efe0'};
const C=GOKU_COLORS,INK='#232433';
const EYES={0:['#2b2f3f','#141824'],gold:['#3fae9a','#1f6b5e'],4:['#3d8fd6','#1f4f86']};
function stageOf(form,skin){return form||(skin==='supersaiyan'?1:0);}
function hairFor(stage){const [h,s,l]=stage===4?GOKU_HAIR.blue:stage?GOKU_HAIR.gold:GOKU_HAIR.base;return {h,s,l};}
// Spiky hair. Base Goku's spikes fan out to the left and right; Super Saiyan spikes
// stand up; SS2 adds a single forelock; SS3 adds a mane down the back.
function backHair(r,c,stage){
 const {h,s}=hairFor(stage),y=c.y,{poly}=r;
 if(stage===3){poly([[14,20+y],[18,8+y],[38,8+y],[42,20+y],[44+c.walk*.3,50],[40,58],[34,50],[22,50],[16,58],[12+c.walk*.3,50]],s);poly([[15,20+y],[19,10+y],[37,10+y],[41,20+y],[42+c.walk*.3,48],[39,54],[35,46],[21,46],[17,54],[14+c.walk*.3,48]],h);}
 // Hand-placed spikes: [tip, base A, base B]. Base Goku's fan outwards; Saiyan
 // stages stand upright and taller.
 const SPIKES=stage===0?[[[4,9],[17,12],[17,21]],[[6,21],[16,17],[16,26]],[[13,1],[19,12],[25,9]],[[23,-2],[21,10],[29,8]],[[33,-1],[27,8],[35,10]],[[45,2],[32,9],[39,13]],[[52,10],[38,12],[40,20]],[[49,21],[40,16],[41,25]]]
  :[[[9,2],[18,12],[17,19]],[[9,13],[16,16],[16,24]],[[16,-3],[20,11],[26,9]],[[25,-6],[22,10],[30,8]],[[33,-5],[27,8],[35,10]],[[41,-2],[31,9],[38,12]],[[47,3],[38,11],[40,18]],[[47,14],[40,15],[41,23]]];
 poly([[15,26+y],[15,15+y],[21,9+y],[35,9+y],[41,15+y],[41,26+y]],s);
 // Keep every tip inside the 76-pixel frame.
 const lowest=Math.min(...SPIKES.map(([[,ty]])=>ty)),drop=Math.max(0,1-(lowest+y));
 for(const [[tx,ty0],[ax,ay],[bx,by]]of SPIKES){const ty=ty0+drop;poly([[ax,ay+y],[tx,ty+y],[bx,by+y]],s);poly([[ax+(tx<28?1:-1),ay+1+y],[tx+(tx<28?1:-1)*.5,ty+2+y],[bx,by-1+y]],h);}
 poly([[16,25+y],[16,16+y],[22,11+y],[34,11+y],[40,16+y],[40,25+y]],h);
}
function frontHair(r,c,stage){
 const {h,s,l}=hairFor(stage),y=c.y,{poly,line}=r;
 // Fringe of sharp bangs; base Goku has three falling over the forehead.
 poly([[17,24+y],[18,14+y],[24,11+y],[33,11+y],[39,15+y],[39,24+y],[36,20+y],[34,24+y],[31,19+y],[28,24+y],[25,19+y],[22,24+y],[19,20+y]],s);
 poly([[18,22+y],[19,15+y],[24,13+y],[32,13+y],[37,16+y],[38,21+y],[35,18+y],[33,21+y],[31,17+y],[28,22+y],[25,17+y],[22,21+y],[20,18+y]],h);
 if(stage===2){poly([[27,13+y],[29,13+y],[27,26+y],[26,24+y]],h);}
 if(stage===0){poly([[22,14+y],[25,14+y],[21,25+y]],h);poly([[29,14+y],[32,14+y],[33,24+y]],h);}
 line(21,14+y,26,12+y,l);line(30,12+y,35,14+y,l);
 // Sideburn spikes.
 poly([[17,22+y],[19,22+y],[18,30+y]],s);poly([[39,22+y],[37,22+y],[38,30+y]],s);
}
function face(r,c,stage){
 const y=c.y,hurt=c.expression==='hurt',focus=c.expression==='focused'||c.expression==='ultimate'||c.special,[iris,dark]=stage===4?EYES[4]:stage?EYES.gold:EYES[0];
 for(const [x,side]of [[21,-1],[31,1]])eye(r,x,26+y,{iris,irisDark:dark,lash:INK,side,closed:c.blink,hurt,focus});
 // Brows: thick and dark on base Goku; SS3 has none.
 if(stage!==3&&!c.blink)for(const [x0,x1]of [[20,24],[32,36]])r.line(x0,24+y,x1,24+y,stage?mix(hairFor(stage).s,'#000000',.2):'#151a26');
 // His trademark open grin.
 if(c.expression==='neutral'){r.rect(26,33+y,5,2,'#8f4655');r.rect(26,33+y,5,1,'#fff4dc');}else mouth(r,34+y,c.expression,{lip:'#a6616a'});
}
function gi(r,c){
 const b=torso(r,c,{color:C.gi,shade:C.giShade,light:C.giLight,bottom:53});
 // Navy undershirt shows in the V and on the shoulders; the gi itself is sleeveless.
 r.poly([[23,b.t+c.y],[28,b.t+7+c.y],[33,b.t+c.y]],C.navy);r.rect(b.l,b.t+c.y,4,4,C.navy);r.rect(b.r-4,b.t+c.y,4,4,C.navy);
 r.rect(30,42+c.y,4,4,C.kanji);r.rect(31,43+c.y,2,2,C.giShade);
 r.rect(b.l+1,49,b.r-b.l-2,3,C.navy);r.line(b.l+1,49,b.r-2,49,'#3f679c');
 return {bareArms:true,legs:C.gi,legShade:C.giShade,legLight:C.giLight,wide:true,shoe:C.navy,boots:63,shoeLight:'#3f679c',laces:C.red,afterArms(r,c){wristbands(r,c);}};
}
function wristbands(r,c){
 const sy=40+c.y;let L=[14,sy+12],R=[42,sy+12];
 if(c.attack)R=[47,sy+1];if(c.pose==='gather'){L=[13,sy-26];R=[43,sy-26];}else if(c.pose==='throw'){L=[38,sy-2];R=[46,sy-4];}else if(c.special){L=[10,sy-8];R=[46,sy-8];}
 for(const [x,yy]of [L,R]){r.rect(x-1,yy-1,4,3,C.navy);r.put(x,yy-1,'#3f679c');}
}
function gokuArms(r,c,g){
 // Bare arms in the gi and swimwear; sleeved outfits use their sleeve colour.
 const arm=g.bareArms||!g.sleeve?{color:SKIN.base,light:SKIN.light,width:4}:{color:g.sleeve,light:g.sleeveLight,width:5,hand:SKIN.base,handShade:SKIN.shade},sy=40+c.y;
 if(c.pose==='gather'){limb(r,18,sy,13,sy-26,arm);limb(r,38,sy,43,sy-26,arm);return;}
 if(c.pose==='throw'){limb(r,18,sy,38,sy-2,arm);limb(r,38,sy,46,sy-4,arm);return;}
 if(c.special){limb(r,18,sy,10,sy-8,arm);limb(r,38,sy,46,sy-8,arm);return;}
 limb(r,18,sy,14,sy+12,arm);
 if(c.attack){limb(r,38,sy,47,sy+1,arm);r.rect(48,sy-1,3,4,'#bfe6ff');r.put(49,sy,'#ffffff');}else limb(r,38,sy,42,sy+12,arm);
}
const OUTFITS={
 default:gi,supersaiyan:gi,
 casual:(r,c)=>casual(r,c,{top:'tee',color:'#2f5b93',jacket:'#e48a3c',bottom:'jeans',bottomColor:'#3a4b66',motif:(r,c,b)=>emblem.dot(r,27,44+c.y,'#f6d36a'),shoe:'#f2efe6',shoeTrim:'#e48a3c'}),
 pajamas:(r,c)=>pajamas(r,c,{color:'#f0a65a',trim:'#2f5b93',motif:(r,c,b)=>{for(const [x,yy]of [[22,46],[33,44],[24,50]])emblem.star(r,x,yy,'#ffe08a');}}),
 swimsuit:(r,c)=>swim(r,c,{style:'trunks',color:'#f1a14e',accent:'#294b79',motif:(r,c)=>{r.rect(31,53,3,3,C.kanji);}}),
};
export function gokuPixels(opts={}){
 const {skin='default',form=0}=opts,stage=stageOf(form,skin),garment=OUTFITS[skin]||gi;
 const spec={build:'adult',ink:INK,idlePoses:['gather','throw'],eyes:{iris:'#2b2f3f'}};
 return buildHero(spec,{
  back:(r,c)=>backHair(r,c,stage),
  garment:(r,c)=>{const g=garment(r,c);g.arms=gokuArms;return g;},
  face:(r,c)=>face(r,c,stage),
  front:(r,c)=>frontHair(r,c,stage),
 },opts);
}
