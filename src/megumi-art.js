import {buildHero,torso,casual,pajamas,swim,emblem,mix,SKIN} from './hero-builder.js';
import {eye,mouth,limb} from './hero-kit.js';
// Megumi: spiky black sea-urchin hair, dark teal eyes and the navy high-collared
// Jujutsu uniform. Summoning forms the Divine Dog shadow hand sign.
export const MEGUMI_COLORS={hair:'#1f2a3a',hairShade:'#121926',hairLight:'#3c4a62',uniform:'#37445f',uniformShade:'#202a44',uniformLight:'#65718c',iris:'#3f7f86'};
const C=MEGUMI_COLORS,INK='#1a2030';
function hair(r,c){
 const y=c.y,{poly,line}=r;
 // Spikes splay in every direction.
 const tips=[[8,16],[10,5],[16,0],[23,-2],[30,-2],[37,0],[43,4],[47,14],[46,24],[10,26]];
 // Rounded mass first, then spikes on top so their bases blend into it.
 poly([[15,26+y],[15,15+y],[19,10+y],[24,8+y],[32,8+y],[37,10+y],[41,15+y],[41,26+y]],C.hairShade);
 poly([[16,25+y],[16,16+y],[20,11+y],[25,9+y],[31,9+y],[36,11+y],[40,16+y],[40,25+y]],C.hair);
 for(const [tx,ty]of tips){const bx=Math.max(18,Math.min(38,tx)),by=Math.max(12,Math.min(24,ty+13));poly([[bx-4,by+2+y],[tx,Math.max(1,ty+3)+y],[bx+4,by+y]],C.hairShade);poly([[bx-2,by+2+y],[tx+(tx<28?1:-1),Math.max(2,ty+5)+y],[bx+2,by+1+y]],C.hair);}
 for(const x of [21,28,34])line(x,11+y,x+1,6+y,C.hairLight);
}
function bangs(r,c){
 const y=c.y,{poly}=r;
 poly([[17,25+y],[18,18+y],[38,18+y],[39,25+y],[36,21+y],[33,26+y],[31,20+y],[28,25+y],[25,20+y],[22,26+y],[20,21+y]],C.hairShade);
 poly([[18,23+y],[19,14+y],[37,14+y],[38,22+y],[36,19+y],[33,23+y],[31,18+y],[28,22+y],[25,18+y],[22,23+y],[20,19+y]],C.hair);
}
function face(r,c){
 const y=c.y,hurt=c.expression==='hurt',focus=c.expression==='focused'||c.expression==='ultimate';
 for(const [x,side]of [[21,-1],[31,1]])eye(r,x,26+y,{iris:C.iris,irisDark:'#1f4a52',lash:INK,side,closed:c.blink,hurt,focus});
 mouth(r,34+y,c.expression==='neutral'?'focused':c.expression,{lip:'#9c6670'});
}
function uniform(r,c,{training=false}={}){
 const col=training?'#68758b':C.uniform,shade=training?'#39455f':C.uniformShade,light=training?'#a2a7b4':C.uniformLight;
 torso(r,c,{color:col,shade,light,bottom:55});r.line(28,40+c.y,28,54,shade);for(const yy of [43,47,51])r.put(29,yy,'#c9b36b');
 return {sleeve:col,sleeveLight:light,cuff:shade,legs:col,legShade:shade,legLight:light,legTop:55,shoe:'#1b1f2a',
  afterHead(r,c){r.rect(23,37+c.y,10,3,shade);r.rect(24,37+c.y,8,2,col);}};
}
function megumiArms(r,c,g){
 const sleeve=g.bareArms?{color:SKIN.base,light:SKIN.light,width:4}:{color:g.sleeve,light:g.sleeveLight,width:5,hand:SKIN.base,handShade:SKIN.shade},sy=40+c.y;
 const arm=(x0,y0,x1,y1)=>{if(g.short){limb(r,x0,y0,x1,y1,{color:SKIN.base,light:SKIN.light,width:4});limb(r,x0,y0,Math.round((x0+x1)/2),Math.round((y0+y1)/2),{...sleeve,hand:null});}else limb(r,x0,y0,x1,y1,sleeve);};
 // Divine Dog hand sign: both hands meet at the chest, thumbs up as ears.
 if(c.special){arm(18,sy,25,sy+4);arm(38,sy,31,sy+4);r.rect(26,sy+2,5,4,SKIN.base);r.line(26,sy+1,26,sy-1,SKIN.base);r.line(30,sy+1,30,sy-1,SKIN.base);r.put(28,sy+3,SKIN.shade);return;}
 arm(18,sy,14,sy+12);
 if(c.attack)arm(38,sy,47,sy+1);else arm(38,sy,42,sy+12);
}
const LOOKS={
 default:{garment:(r,c)=>uniform(r,c)},
 training:{garment:(r,c)=>uniform(r,c,{training:true})},
 casual:{garment:(r,c)=>casual(r,c,{top:'tee',color:'#e9e6dd',jacket:'#3a4a44',bottom:'jeans',bottomColor:'#2b3448',shoe:'#e9e6dd',shoeTrim:'#3a4a44'})},
 pajamas:{garment:(r,c)=>pajamas(r,c,{color:'#4c5a78',trim:'#e9e6dd',motif:(r,c)=>{for(const [x,yy]of [[22,45],[33,48]]){r.rect(x,yy,3,2,'#f2f0ea');r.put(x,yy-1,'#f2f0ea');r.put(x+2,yy-1,'#f2f0ea');r.put(x+1,yy+1,'#1b1f2a');}}})},
 swimsuit:{garment:(r,c)=>swim(r,c,{style:'trunks',color:'#2f4a68',accent:'#e9e6dd',motif:(r,c)=>{r.rect(31,53,3,2,'#e9e6dd');}})},
};
export function megumiPixels(opts={}){
 const look=LOOKS[opts.skin]||LOOKS.default,spec={build:'adult',ink:INK};
 return buildHero(spec,{back:hair,garment:(r,c)=>{const g=look.garment(r,c);g.arms=megumiArms;return g;},face,front:bangs},opts);
}
