import {buildHero,standardHead,torso,casual,swim,yukata,skirt,emblem,twinTails,fringe,bow,mix,SKIN} from './hero-builder.js';
import {eye,mouth,limb} from './hero-kit.js';
// Frieren: long elf ears, low silver twin tails, calm green eyes, a white-and-gold
// capelet over a white dress with a dark centre panel, and her red staff.
export const FRIEREN_COLORS={hair:'#dce1e8',hairShade:'#8f9bb1',hairLight:'#fff6e7',cream:'#eee9d6',creamLight:'#fff7e4',gold:'#bc9753',goldLight:'#e8ce8e',dark:'#333c50',iris:'#72a28b',staff:'#693f4b',gem:'#a14c65'};
const C=FRIEREN_COLORS,INK='#343b4b',H={h:C.hair,s:C.hairShade,l:C.hairLight};
function ears(r,c){const y=c.y;r.poly([[19,24+y],[8,21+y],[13,28+y],[19,29+y]],'#d9b29a');r.poly([[37,24+y],[48,21+y],[43,28+y],[37,29+y]],'#d9b29a');r.line(12,23+y,18,26+y,SKIN.base,2);r.line(38,26+y,44,23+y,SKIN.base,2);r.rect(16,30+y,1,3,C.goldLight);r.rect(39,30+y,1,3,C.goldLight);}
function face(r,c){
 const y=c.y,hurt=c.expression==='hurt',focus=c.expression==='focused'||c.expression==='ultimate';
 // Half-lidded and calm: the upper lid sits low over the iris.
 for(const [x,side]of [[21,-1],[31,1]]){eye(r,x,26+y,{iris:C.iris,irisDark:'#3e685b',lash:INK,side,closed:c.blink,hurt,focus});if(!c.blink&&!hurt)r.line(x,27+y,x+3,27+y,mix(SKIN.shade,INK,.3));}
 mouth(r,34+y,c.expression==='neutral'?'focused':c.expression,{lip:'#aa7e7b'});
}
function mage(r,c){
 const b=torso(r,c,{color:C.cream,shade:'#b3b6b0',light:C.creamLight,bottom:52});
 r.rect(26,b.t+c.y,5,14,C.dark);for(const yy of [43,46,49])r.rect(26,yy,5,1,'#b2b9b7');
 skirt(r,c,{top:51,bottom:61,flare:6,color:C.cream,shade:'#b3b6b0',light:C.creamLight,pleats:false});r.line(18+c.walk,60,38+c.walk,60,C.gold);
 return {sleeve:'#b5b9b3',sleeveLight:C.cream,cuff:C.gold,legs:C.dark,legShade:'#20242f',legTop:59,boots:63,shoe:'#786952',shoeLight:'#b79d73',
  afterArms(r,c){
   // Gold-trimmed capelet over the shoulders with a red clasp.
   const y=c.y;r.poly([[17,38+y],[24,35+y],[28,38+y],[33,35+y],[39,38+y],[41,44+y],[36,47+y],[28,42+y],[20,47+y],[15,44+y]],C.gold);
   r.poly([[18,38+y],[24,37+y],[28,40+y],[33,37+y],[38,38+y],[39,43+y],[36,45+y],[28,41+y],[20,45+y],[17,43+y]],C.creamLight);r.rect(27,39+y,3,3,C.gold);r.put(28,40+y,'#bf6570');}};
}
function maid(r,c){
 const b=torso(r,c,{color:'#262f42',shade:'#1a2030',light:'#3a4560',bottom:51});
 r.poly([[23,b.t+3+c.y],[33,b.t+3+c.y],[33,51],[23,51]],C.cream);r.rect(25,b.t+c.y,6,3,C.creamLight);
 skirt(r,c,{top:50,bottom:60,flare:7,color:'#262f42',shade:'#1a2030',light:'#3a4560',pleats:false});
 r.poly([[22,50],[34,50],[35,58],[21,58]],C.creamLight);for(let x=14+c.walk;x<42+c.walk;x+=3)r.rect(x,59,2,2,'#aeb9c6');
 return {sleeve:'#262f42',sleeveLight:'#3a4560',cuff:C.cream,legs:'bare',socks:'#f4f2ea',socksTop:61,shoe:'#2e3647',shoeLight:'#555e70'};
}
function nightwear(r,c){
 const w=c.walk,b=torso(r,c,{color:'#e8e4f2',shade:'#b0aac8',light:'#ffffff',bottom:50});
 r.poly([[b.l,48],[b.r,48],[b.r+4+w,66],[b.l-4+w,66]],'#b0aac8');r.poly([[b.l+1,48],[b.r-1,48],[b.r+2+w,65],[b.l-2+w,65]],'#e8e4f2');
 for(const [x,yy]of [[22,45],[33,48],[24,57],[32,60]])emblem.star(r,x+(yy>50?w:0),yy,'#c9b36b');
 return {sleeve:'#e8e4f2',sleeveLight:'#ffffff',cuff:'#b0aac8',legs:'bare',legTop:63,shoe:'#d9d2e8'};
}
function staff(r,c){
 // Slanted red staff with a gold crescent and a jewel; raised while casting.
 const cast=c.attack||c.special,sx=cast?44:47,sy=cast?(c.special?6:15):19,{poly,rect,line}=r;
 line(sx,sy+8,sx-7,69,C.staff,3);line(sx+1,sy+9,sx-6,69,'#b16c69');rect(sx-9,66,5,3,C.gold);
 poly([[sx-5,sy],[sx-4,sy-7],[sx+2,sy-11],[sx+7,sy-7],[sx+8,sy],[sx+4,sy+7],[sx-1,sy+8],[sx-5,sy+4]],C.gold);
 poly([[sx-3,sy],[sx-2,sy-5],[sx+2,sy-7],[sx+5,sy-4],[sx+5,sy+1],[sx+2,sy+5],[sx-1,sy+5]],'#6c4852');rect(sx-1,sy-4,5,6,C.gem);rect(sx,sy-4,3,2,'#e78b96');
 if(cast){rect(sx-2,sy-6,8,1,'#c8f0ff');r.put(sx+1,sy-8,'#ffffff');}
}
function frierenArms(r,c,g){
 const sleeve=g.bareArms?{color:SKIN.base,light:SKIN.light,width:4}:{color:g.sleeve,light:g.sleeveLight,width:5,hand:SKIN.base,handShade:SKIN.shade},sy=41+c.y;
 const arm=(x0,y0,x1,y1)=>{if(g.short){limb(r,x0,y0,x1,y1,{color:SKIN.base,light:SKIN.light,width:4});limb(r,x0,y0,Math.round((x0+x1)/2),Math.round((y0+y1)/2),{...sleeve,hand:null});}else{limb(r,x0,y0,x1,y1,sleeve);if(g.cuff)r.rect(x1-1,y1+2,5,2,g.cuff);}};
 arm(20,sy,16,sy+12);
 // The right hand always holds the staff.
 if(c.special)arm(36,sy,42,sy-12);else if(c.attack)arm(36,sy,42,sy-2);else arm(36,sy,43,sy+8);
}
const LOOKS={
 default:{garment:mage},
 maid:{maid:true,garment:maid},
 casual:{garment:(r,c)=>casual(r,c,{top:'hoodie',color:'#c9c3b0',bottom:'skirt',skirtColor:'#7a7f96',motif:(r,c)=>emblem.flower(r,28,45+c.y,'#bf6570',C.goldLight),shoe:'#786952'})},
 pajamas:{garment:nightwear},
 swimsuit:{garment:(r,c)=>swim(r,c,{style:'onepiece',color:'#8fb9a8',accent:C.goldLight,motif:(r,c)=>{r.rect(27,45+c.y,3,2,C.gold);}})},
 frillswim:{garment:(r,c)=>swim(r,c,{style:'swimdress',color:'#eef3f0',accent:'#8fb9a8',motif:(r,c)=>bow(r,28,43+c.y,'#8fb9a8','#5f8a79',2)})},
 bathsuit:{garment:(r,c)=>yukata(r,c,{color:'#e8e4f2',obi:'#8a6fb0',collar:'#ffffff',pattern:(r,x,y)=>emblem.star(r,x,y,'#c9b36b')})},
};
export function frierenPixels(opts={}){
 const look=LOOKS[opts.skin]||LOOKS.default,spec={build:'petite',ink:INK};
 return buildHero(spec,{
  back:(r,c)=>twinTails(r,c,H,{len:54,flare:4,tie:18}),
  garment:(r,c)=>{const g=look.garment(r,c);g.arms=frierenArms;return g;},
  prop:staff,
  head:(r,c)=>{ears(r,c);standardHead(r,c);},
  face:(r,c)=>face(r,c),
  front:(r,c)=>{fringe(r,c,H,{style:'choppy',locks:33});r.rect(15,18+c.y,4,2,look.maid?'#323b4d':'#b49b64');r.rect(38,18+c.y,4,2,look.maid?'#323b4d':'#b49b64');
   if(look.maid){for(let i=0;i<6;i++)r.rect(17+i*4,11-Math.round(Math.sin(i*Math.PI/5)*2)+c.y,4,3,C.creamLight);}},
 },opts);
}
