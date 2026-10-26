import {buildHero,torso,casual,pajamas,swim,skirt,emblem,mix,SKIN} from './hero-builder.js';
import {eye,mouth,limb} from './hero-kit.js';
// Gojo: upswept white hair, black blindfold and the high-collared Jujutsu High uniform.
// Standing still he holds the Unlimited Void hand sign (the 'domain' pose).
export const GOJO_COLORS={hair:'#eef0fa',hairShade:'#a9b0cf',hairLight:'#ffffff',uniform:'#272739',uniformShade:'#18192b',uniformLight:'#4d4d6a',blindfold:'#15161f',six:'#7fd3ff',sixDark:'#2f86c9'};
const C=GOJO_COLORS,INK='#1d1e2c';
function backHair(r,c,long){
 const y=c.y,{poly,line}=r;
 if(long){poly([[14,22+y],[17,10+y],[39,10+y],[42,22+y],[43+c.walk*.3,54],[38,58],[34,50],[22,50],[18,58],[13+c.walk*.3,54]],C.hairShade);poly([[15,22+y],[18,12+y],[38,12+y],[41,22+y],[41+c.walk*.3,52],[38,55],[35,47],[21,47],[18,55],[15+c.walk*.3,52]],C.hair);line(16,26,16+c.walk*.3,50,C.hairLight);return;}
 // Upswept spikes like white flame.
 const tips=[[10,13],[13,4],[19,1],[25,-1],[31,-1],[37,1],[43,4],[46,13]];
 poly([[15,24+y],[15,13+y],[21,8+y],[35,8+y],[41,13+y],[41,24+y]],C.hairShade);
 for(const [i,[tx,ty]]of tips.entries()){const bx=15+i*3.7;poly([[bx-2,14+y],[tx,ty+y+3],[bx+4,12+y]],C.hairShade);poly([[bx-1,14+y],[tx+(tx<28?1:-1),ty+y+5],[bx+3,13+y]],C.hair);}
 poly([[16,23+y],[16,14+y],[22,10+y],[34,10+y],[40,14+y],[40,23+y]],C.hair);
 for(const x of [20,26,32])line(x,10+y,x+2,4+y,C.hairLight);
}
function frontHair(r,c,long){
 const y=c.y,{poly,line}=r;
 poly([[17,24+y],[18,15+y],[24,12+y],[33,12+y],[39,15+y],[39,24+y],[36,21+y],[33,25+y],[30,20+y],[27,25+y],[24,20+y],[21,25+y],[19,21+y]],C.hairShade);
 poly([[18,22+y],[19,16+y],[24,14+y],[32,14+y],[37,16+y],[38,21+y],[35,19+y],[33,22+y],[30,18+y],[27,23+y],[24,18+y],[21,22+y],[20,19+y]],C.hair);
 line(21,15+y,27,13+y,C.hairLight);
 if(long){poly([[17,22+y],[19,22+y],[19,40+y],[16,38+y]],C.hair);poly([[39,22+y],[37,22+y],[37,40+y],[40,38+y]],C.hair);}
}
function blindfold(r,c){
 const y=c.y;r.rect(17,23+y,23,6,C.blindfold);r.line(18,24+y,38,24+y,'#2c2e40');r.rect(40,24+y,3,3,C.blindfold);r.line(42,27+y,44,31+y,C.blindfold);
}
function face(r,c,{covered,shades}){
 const y=c.y,hurt=c.expression==='hurt',focus=c.expression==='focused'||c.expression==='ultimate';
 if(!covered)for(const [x,side]of [[21,-1],[31,1]])eye(r,x,26+y,{iris:C.six,irisDark:C.sixDark,lash:'#8b93b8',side,closed:c.blink,hurt,focus});
 for(const x of [20,21,34,35])r.put(x,30+y,mix('#e59a9a',SKIN.base,.5));
 // A confident smirk.
 if(c.expression==='neutral'){r.rect(26,34+y,4,1,'#a16f77');r.put(30,34+y,'#8d5d66');}else mouth(r,34+y,c.expression,{lip:'#a16f77'});
 if(covered)blindfold(r,c);
 // Small dark shades worn low on the nose, so the Six Eyes show above them.
 if(shades){r.rect(20,28+y,7,4,'#1b1d27');r.rect(29,28+y,7,4,'#1b1d27');r.line(27,29+y,29,29+y,'#1b1d27');r.put(21,29+y,'#6f7a96');r.put(30,29+y,'#6f7a96');}
}
// High-collared uniform jacket with a centre zip; white when unsealed.
function uniform(r,c,{white=false,female=false}={}){
 const col=white?'#ede8e0':C.uniform,shade=white?'#9c9aa9':C.uniformShade,light=white?'#ffffff':C.uniformLight;
 const b=torso(r,c,{color:col,shade,light,bottom:female?51:55});
 r.line(28,40+c.y,28,female?50:54,shade);
 // The high collar is drawn after the head so it rises over the neck.
 const collar=(r,c)=>{r.rect(23,37+c.y,10,3,shade);r.rect(24,37+c.y,8,2,col);r.put(28,39+c.y,'#c9b36b');};
 if(female){skirt(r,c,{top:50,bottom:59,color:col,shade,light});return {sleeve:col,sleeveLight:light,cuff:shade,legs:'#26262f',legShade:'#16161d',shoe:'#191922',legTop:57,afterHead:collar};}
 return {sleeve:col,sleeveLight:light,cuff:shade,legs:col,legShade:shade,legLight:light,legTop:55,shoe:'#191922',afterHead:collar};
}
function gojoArms(r,c,g){
 const sleeve=g.bareArms?{color:SKIN.base,light:SKIN.light,width:4}:{color:g.sleeve,light:g.sleeveLight,width:5,hand:SKIN.base,handShade:SKIN.shade},sy=40+c.y;
 const arm=(x0,y0,x1,y1)=>{if(g.short){limb(r,x0,y0,x1,y1,{color:SKIN.base,light:SKIN.light,width:4});limb(r,x0,y0,Math.round((x0+x1)/2),Math.round((y0+y1)/2),{...sleeve,hand:null});}else limb(r,x0,y0,x1,y1,sleeve);};
 if(c.special){arm(18,sy,10,sy-8);arm(38,sy,46,sy-8);return;}
 arm(18,sy,14,sy+12);
 if(c.attack)arm(38,sy,47,sy+1);
 // Domain hand sign: index and middle fingers crossed in front of the chest.
 else if(c.pose==='domain'){arm(38,sy,33,sy+4);r.rect(31,sy+2,3,3,SKIN.base);r.line(31,sy+1,32,sy-2,SKIN.base);r.line(33,sy+1,32,sy-2,SKIN.shade);}
 else arm(38,sy,42,sy+12);
}
const LOOKS={
 default:{covered:true,garment:(r,c)=>uniform(r,c)},
 female:{covered:false,long:true,garment:(r,c)=>uniform(r,c,{female:true})},
 unsealed:{covered:false,garment:(r,c)=>uniform(r,c,{white:true})},
 casual:{covered:false,shades:true,garment:(r,c)=>casual(r,c,{top:'tee',color:'#f3f4f8',jacket:'#8fc6e8',bottom:'jeans',bottomColor:'#d9cdb2',shoe:'#f2efe6',shoeTrim:'#8fc6e8'})},
 pajamas:{covered:false,garment:(r,c)=>{const g=pajamas(r,c,{color:'#3f5f9a',trim:'#cfe7ff',motif:(r,c)=>{for(const [x,yy]of [[22,45],[33,47]]){r.rect(x,yy,3,2,'#ffffff');r.put(x+1,yy,C.sixDark);}}});return g;},extra(r,c){
  // Sleep mask pushed up onto the hair.
  r.rect(19,14+c.y,18,3,'#26324e');r.rect(21,15+c.y,3,1,'#cfe7ff');r.rect(32,15+c.y,3,1,'#cfe7ff');}},
 swimsuit:{covered:false,shades:true,garment:(r,c)=>swim(r,c,{style:'rash',color:'#3b84c4',accent:'#cfe7ff',motif:(r,c)=>{r.rect(26,44+c.y,4,2,'#ffffff');}})},
};
export function gojoPixels(opts={}){
 const look=LOOKS[opts.skin]||LOOKS.default;
 const spec={build:'adult',ink:INK,idlePoses:['domain']};
 return buildHero(spec,{
  back:(r,c)=>backHair(r,c,look.long),
  garment:(r,c)=>{const g=look.garment(r,c);g.arms=gojoArms;return g;},
  face:(r,c)=>face(r,c,look),
  front:(r,c)=>frontHair(r,c,look.long),
  extra:look.extra,
 },opts);
}
