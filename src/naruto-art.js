import {buildHero,torso,casual,pajamas,swim,emblem,mix,SKIN} from './hero-builder.js';
import {eye,mouth,limb} from './hero-kit.js';
// Naruto: spiky blond hair, Leaf headband, whisker marks and the orange-and-black
// jumpsuit. Sage Mode adds orange eye pigment and toad eyes; the Hokage cloak carries
// red flames on its hem.
export const NARUTO_COLORS={hair:'#f7d268',hairShade:'#c8903b',hairLight:'#fff2ad',orange:'#ee9848',orangeShade:'#b76837',orangeLight:'#ffca74',black:'#2c2d3a',plate:'#c9d2dc',cloth:'#2f4f86',iris:'#3f8fd6'};
const C=NARUTO_COLORS,INK='#25283e';
function backHair(r,c,{short}={}){
 const y=c.y,{poly}=r;
 const tips=short?[[13,16],[17,8],[24,5],[31,5],[38,8],[43,16]]:[[10,18],[13,7],[19,3],[26,1],[32,2],[38,5],[44,10],[46,19]];
 poly([[15,26+y],[15,14+y],[21,9+y],[35,9+y],[41,14+y],[41,26+y]],C.hairShade);
 for(const [i,[tx,ty]]of tips.entries()){const bx=15+i*(26/(tips.length-1));poly([[bx-3,15+y],[tx,ty+y],[bx+3,13+y]],C.hairShade);poly([[bx-2,15+y],[tx+(tx<28?1:-1),ty+2+y],[bx+2,14+y]],C.hair);}
 poly([[16,25+y],[16,15+y],[22,11+y],[34,11+y],[40,15+y],[40,25+y]],C.hair);
}
function frontHair(r,c,{band=true,short}={}){
 const y=c.y,{poly,rect,line,put}=r;
 // Spiky bangs fall over the headband.
 poly([[17,26+y],[18,17+y],[22,24+y],[24,17+y],[27,25+y],[29,17+y],[32,24+y],[34,17+y],[37,23+y],[39,17+y],[39,26+y],[38,14+y],[18,14+y]],C.hairShade);
 poly([[18,24+y],[19,16+y],[22,22+y],[24,16+y],[27,23+y],[29,16+y],[32,22+y],[34,16+y],[37,21+y],[38,16+y],[37,14+y],[19,14+y]],C.hair);
 line(20,16+y,22,20+y,C.hairLight);line(29,16+y,30,20+y,C.hairLight);
 if(band){rect(17,17+y,23,4,C.cloth);rect(23,17+y,10,4,C.plate);line(23,17+y,32,17+y,'#eef3f8');
  // Leaf symbol engraved on the plate.
  put(26,18+y,'#5d6470');put(27,19+y,'#5d6470');put(28,18+y,'#5d6470');put(29,19+y,'#5d6470');put(27,18+y,'#5d6470');
  line(40,19+y,44,22+y,C.cloth);line(40,20+y,43,25+y,C.cloth);}
 if(short){rect(17,17+y,23,1,C.hairShade);}
}
function face(r,c,{sage=false}={}){
 const y=c.y,hurt=c.expression==='hurt',focus=c.expression==='focused'||c.expression==='ultimate'||c.special;
 if(sage){for(const x of [20,30])r.rect(x,25+y,6,6,'#d96d3c');}
 for(const [x,side]of [[21,-1],[31,1]])eye(r,x,26+y,{iris:sage?'#e7c04a':C.iris,irisDark:sage?'#8a6a1c':'#1f4f86',lash:INK,side,closed:c.blink,hurt,focus});
 if(sage&&!c.blink&&!hurt)for(const x of [22,32])r.rect(x,28+y,2,1,'#1a1a1a');
 // Three whisker marks on each cheek.
 for(const yy of [31,33]){r.line(20,yy+y,22,yy+y,'#b4806f');r.line(34,yy+y,36,yy+y,'#b4806f');}r.line(20,32+y,22,32+y,'#b4806f');r.line(34,32+y,36,32+y,'#b4806f');
 if(c.expression==='neutral'){r.rect(26,34+y,5,2,'#8f4655');r.rect(26,34+y,5,1,'#fff4dc');}else mouth(r,34+y,c.expression,{lip:'#a97376'});
}
function jumpsuit(r,c,{sage=false}={}){
 const b=torso(r,c,{color:C.orange,shade:C.orangeShade,light:C.orangeLight,bottom:54});
 // Black shoulders and collar, white zip, the Uzumaki swirl on the arm.
 r.rect(b.l,b.t+c.y,b.r-b.l,4,C.black);r.rect(25,b.t+c.y,6,5,C.black);r.line(28,b.t+2+c.y,28,52,'#f3ede0');r.put(29,b.t+5+c.y,'#d94a3a');
 r.rect(b.l+1,51,b.r-b.l-2,2,C.black);
 if(sage){
  // Red sage cloak with black flame hem.
  r.poly([[b.l-1,b.t+c.y],[b.l+5,b.t+c.y],[b.l+4,62+c.walk],[b.l-3,61+c.walk]],'#c35a46');r.poly([[b.r-5,b.t+c.y],[b.r+1,b.t+c.y],[b.r+3,61+c.walk],[b.r-4,62+c.walk]],'#c35a46');
  for(const x of [b.l-3,b.l,b.r-4,b.r-1])r.poly([[x,62+c.walk],[x+1,58+c.walk],[x+3,62+c.walk]],C.black);
 }
 return {sleeve:C.orange,sleeveLight:C.orangeLight,cuff:C.orange,legs:C.orange,legShade:C.orangeShade,legLight:C.orangeLight,legTop:54,cuff2:null,shoe:'#2f4f86',socks:'#e9e2d2',socksTop:64,sockBand:'#d9d0bc'};
}
function hokage(r,c){
 const g=jumpsuit(r,c);const b={l:20,r:36,t:39},w=c.walk;
 // White Hokage cloak, open at the front, with red flames along the hem.
 r.poly([[b.l-2,b.t+c.y],[b.l+5,b.t+c.y],[b.l+3,64+w],[b.l-5,63+w]],'#f2efe6');r.poly([[b.r-5,b.t+c.y],[b.r+2,b.t+c.y],[b.r+5,63+w],[b.r-3,64+w]],'#f2efe6');
 r.line(b.l+4,b.t+1+c.y,b.l+2,63+w,'#c9c3b3');r.line(b.r-4,b.t+1+c.y,b.r-2,63+w,'#c9c3b3');
 for(const x of [b.l-5,b.l-2,b.l+1,b.r-3,b.r,b.r+3])r.poly([[x,64+w],[x+1,59+w],[x+3,64+w]],'#d94a3a');
 return {...g,sleeve:'#f2efe6',sleeveLight:'#ffffff',cuff:'#d94a3a'};
}
function narutoArms(r,c,g){
 const sleeve=g.bareArms?{color:SKIN.base,light:SKIN.light,width:4}:{color:g.sleeve,light:g.sleeveLight,width:5,hand:SKIN.base,handShade:SKIN.shade},sy=41+c.y;
 const arm=(x0,y0,x1,y1)=>{if(g.short){limb(r,x0,y0,x1,y1,{color:SKIN.base,light:SKIN.light,width:4});limb(r,x0,y0,Math.round((x0+x1)/2),Math.round((y0+y1)/2),{...sleeve,hand:null});}else limb(r,x0,y0,x1,y1,sleeve);};
 // Seal: both hands meet in front of the chest in a hand sign.
 if(c.pose==='seal'){arm(20,sy,26,sy+5);arm(36,sy,30,sy+5);r.rect(27,sy+3,3,4,SKIN.base);return;}
 if(c.special){arm(20,sy,12,sy-8);arm(36,sy,44,sy-8);return;}
 arm(20,sy,16,sy+12);
 if(c.attack){arm(36,sy,45,sy+1);
  // A spinning wind shuriken leaves his hand.
  const x=48,yy=sy+1;r.rect(x-1,yy-1,3,3,'#dfe8ef');r.put(x,yy-3,'#b8c4cf');r.put(x,yy+3,'#b8c4cf');r.put(x-3,yy,'#b8c4cf');r.put(x+3,yy,'#b8c4cf');r.put(x,yy,'#6f7c88');}
 else arm(36,sy,40,sy+12);
}
const LOOKS={
 default:{garment:jumpsuit},
 sage:{sage:true,garment:(r,c)=>jumpsuit(r,c,{sage:true})},
 hokage:{short:true,garment:hokage},
 casual:{band:false,garment:(r,c)=>casual(r,c,{top:'hoodie',color:'#2c2d3a',bottom:'jeans',bottomColor:'#3a4b66',motif:(r,c)=>{r.rect(26,45,4,3,C.orange);r.put(27,46,'#d94a3a');},shoe:'#f2efe6',shoeTrim:C.orange})},
 pajamas:{band:false,fox:true,garment:(r,c)=>pajamas(r,c,{color:'#e88a3c',trim:'#fff2df',onesie:true,motif:(r,c)=>{r.rect(25,44,6,5,'#fff2df');}})},
 swimsuit:{garment:(r,c)=>swim(r,c,{style:'trunks',color:C.orange,accent:C.black,motif:(r,c)=>{r.rect(30,53,3,3,'#d94a3a');}})},
};
// Kurama hood for the fox onesie: orange with tall ears and a cream muzzle edge.
function foxHood(r,c){
 const y=c.y,{poly,rect}=r;
 poly([[13,24+y],[14,12+y],[20,7+y],[36,7+y],[42,12+y],[43,24+y],[41,34+y],[38,22+y],[18,22+y],[15,34+y]],'#b8612a');
 poly([[15,22+y],[16,13+y],[21,9+y],[35,9+y],[40,13+y],[41,22+y],[38,19+y],[18,19+y]],'#e88a3c');
 poly([[16,12+y],[13,2+y],[22,8+y]],'#b8612a');poly([[40,12+y],[43,2+y],[34,8+y]],'#b8612a');poly([[17,11+y],[15,5+y],[20,9+y]],'#3a2a26');poly([[39,11+y],[41,5+y],[36,9+y]],'#3a2a26');
 rect(18,19+y,20,2,'#fff2df');
}
export function narutoPixels(opts={}){
 const look=LOOKS[opts.skin]||LOOKS.default;
 const spec={build:'petite',ink:INK,idlePoses:[]};
 return buildHero(spec,{
  back:look.fox?null:(r,c)=>backHair(r,c,look),
  garment:(r,c)=>{const g=look.garment(r,c);g.arms=narutoArms;return g;},
  face:(r,c)=>face(r,c,look),
  front:look.fox?foxHood:(r,c)=>frontHair(r,c,{band:look.band!==false,short:look.short}),
 },opts);
}
