import {buildHero,torso,casual,swim,yukata,skirt,emblem,fringe,bun,bow,mix,SKIN} from './hero-builder.js';
import {eye,mouth,limb} from './hero-kit.js';
// Maomao: dark teal hair in a high bun with long side locks, violet eyes and freckles.
// The apothecary robe is a green wrap top with bell sleeves over a burgundy skirt.
export const MAOMAO_COLORS={hair:'#24473f',hairShade:'#142c2f',hairLight:'#4f7462',jade:'#79b999',jadeShade:'#3f7c6d',jadeLight:'#b5deae',burgundy:'#863d61',iris:'#7772b5'};
const C=MAOMAO_COLORS,INK='#25383c',H={h:C.hair,s:C.hairShade,l:C.hairLight};
function face(r,c){
 const y=c.y,hurt=c.expression==='hurt',focus=c.expression==='focused'||c.expression==='ultimate';
 for(const [x,side]of [[21,-1],[31,1]])eye(r,x,26+y,{iris:C.iris,irisDark:'#3e3a78',lash:INK,side,closed:c.blink,hurt,focus});
 // Her freckles across the nose.
 for(const [x,yy]of [[22,31],[24,32],[32,32],[34,31]])r.put(x,yy+y,'#c98d7a');
 mouth(r,34+y,c.expression,{lip:'#a97476'});
}
function back(r,c,{loose=false}={}){
 const y=c.y,{poly}=r;
 if(loose){poly([[14,22+y],[17,10+y],[39,10+y],[42,22+y],[43+c.walk*.3,56],[38,60],[34,52],[22,52],[18,60],[13+c.walk*.3,56]],H.s);poly([[15,22+y],[18,12+y],[38,12+y],[41,22+y],[41+c.walk*.3,54],[38,57],[35,49],[21,49],[18,57],[15+c.walk*.3,54]],H.h);return;}
 bun(r,c,H,{x:28,yTop:3,size:9});
 poly([[16,24+y],[17,13+y],[23,9+y],[33,9+y],[39,13+y],[40,24+y],[39,34+y],[17,34+y]],H.s);
}
function locks(r,c){
 // Two long side locks with bead ties sway with each step.
 for(const [x,sway]of [[18,c.walk],[37,-c.walk]]){r.line(x,30+c.y,x+sway,44,H.s,2);r.rect(x+sway,40,2,2,'#cb8b96');r.rect(x+sway,44,2,4,H.h);}
}
function apothecary(r,c,{top=C.jade,shade=C.jadeShade,light=C.jadeLight,skirtCol=C.burgundy,lapel='#3c8d78'}={}){
 const b=torso(r,c,{color:top,shade,light,bottom:52});
 r.poly([[23,b.t+c.y],[28,b.t+4+c.y],[33,b.t+c.y],[35,b.t+2+c.y],[28,b.t+10+c.y],[22,b.t+2+c.y]],'#eef1d7');
 r.poly([[23,b.t+2+c.y],[28,b.t+6+c.y],[33,b.t+2+c.y],[35,b.t+4+c.y],[28,b.t+12+c.y],[23,b.t+9+c.y]],lapel);
 r.rect(b.l+1,50,b.r-b.l-2,2,mix(top,'#000000',.35));
 skirt(r,c,{top:52,bottom:66,flare:4,color:skirtCol,shade:mix(skirtCol,'#000000',.3),light:mix(skirtCol,'#ffffff',.2),pleats:false});
 return {sleeve:top,sleeveLight:light,cuff:'#bdc087',sleeveWidth:6,legs:'bare',legTop:64,shoe:H.h,shoeLight:'#4f7462'};
}
function dancer(r,c){
 // Crimson dancer: red wrap with gold trim and a long pink skirt, hair worn loose.
 const g=apothecary(r,c,{top:'#c0485a',shade:'#7d2b3d',light:'#e9808a',skirtCol:'#e79bb0',lapel:'#e0b85c'});
 return {...g,cuff:'#e0b85c'};
}
function spring(r,c){return apothecary(r,c,{top:'#9fd3c7',shade:'#5f9a91',light:'#d3f0e6',skirtCol:'#f2b6c6',lapel:'#f6e3a6'});}
function palace(r,c){return apothecary(r,c,{top:'#a78ab8',shade:'#695378',light:'#dfc7e4',skirtCol:'#394e68',lapel:'#e0b85c'});}
function herbRobe(r,c){
 const w=c.walk,b=torso(r,c,{color:'#a9c9b2',shade:'#6f9a80',light:'#d8eedc',bottom:50});
 r.poly([[b.l,48],[b.r,48],[b.r+4+w,66],[b.l-4+w,66]],'#6f9a80');r.poly([[b.l+1,48],[b.r-1,48],[b.r+2+w,65],[b.l-2+w,65]],'#a9c9b2');
 r.poly([[24,b.t+c.y],[28,b.t+7+c.y],[32,b.t+c.y]],'#eef1d7');r.rect(b.l+1,47,b.r-b.l-2,2,'#3f7c6d');
 for(const [x,yy]of [[22,55],[33,58],[27,62]]){r.put(x+w,yy,'#3f7c6d');r.put(x+1+w,yy-1,'#79b999');}
 return {sleeve:'#a9c9b2',sleeveLight:'#d8eedc',cuff:'#6f9a80',sleeveWidth:6,legs:'bare',legTop:64,shoe:'#e9dccb'};
}
function maomaoArms(r,c,g){
 const sleeve=g.bareArms?{color:SKIN.base,light:SKIN.light,width:4}:{color:g.sleeve,light:g.sleeveLight,width:g.sleeveWidth||5,hand:SKIN.base,handShade:SKIN.shade},sy=41+c.y;
 const arm=(x0,y0,x1,y1)=>{if(g.short){limb(r,x0,y0,x1,y1,{color:SKIN.base,light:SKIN.light,width:4});limb(r,x0,y0,Math.round((x0+x1)/2),Math.round((y0+y1)/2),{...sleeve,hand:null});}else{limb(r,x0,y0,x1,y1,sleeve);if(g.cuff)r.rect(x1-1,y1+2,5,2,g.cuff);}};
 // Brewing: she holds a vial up to the light. Attacks lob a vial forward.
 const vial=(x,yy)=>{r.rect(x,yy-6,4,6,'#cde6d9');r.rect(x+1,yy-7,2,1,'#b68d60');r.rect(x,yy-3,4,3,'#8dba69');r.put(x+1,yy-5,'#f1ffde');};
 if(c.special){arm(20,sy,17,sy+2);arm(36,sy,41,sy-2);vial(40,sy-2);return;}
 arm(20,sy,16,sy+12);
 if(c.attack){arm(36,sy,45,sy);vial(45,sy+1);}else arm(36,sy,40,sy+12);
}
const LOOKS={
 default:{garment:apothecary},
 dancer:{loose:true,flower:'#e05a6e',garment:dancer},
 spring:{flower:'#f2b6c6',garment:spring},
 palace:{pin:true,garment:palace},
 casual:{garment:(r,c)=>casual(r,c,{top:'tee',color:'#f3ead2',jacket:'#79b999',bottom:'skirt',skirtColor:'#5f7d6c',motif:(r,c)=>{r.put(27,45+c.y,'#3f7c6d');r.put(28,44+c.y,'#79b999');},shoe:'#6b4a3a'})},
 pajamas:{garment:herbRobe},
 swimsuit:{garment:(r,c)=>swim(r,c,{style:'onepiece',color:'#3f8d78',accent:'#b5deae',motif:(r,c)=>emblem.flower(r,28,45+c.y,'#b5deae','#f6e3a6')})},
 cuteswim:{garment:(r,c)=>swim(r,c,{style:'swimdress',color:'#79b999',accent:'#eef1d7',motif:(r,c)=>bow(r,28,43+c.y,'#f2b6c6','#c07a90',2)})},
 bathsuit:{garment:(r,c)=>yukata(r,c,{color:'#b5deae',obi:'#863d61',collar:'#eef1d7',pattern:(r,x,y)=>emblem.flower(r,x,y,'#f2b6c6','#f6e3a6')})},
};
export function maomaoPixels(opts={}){
 const look=LOOKS[opts.skin]||LOOKS.default,spec={build:'petite',ink:INK};
 return buildHero(spec,{
  back:(r,c)=>back(r,c,look),
  garment:(r,c)=>{const g=look.garment(r,c);g.arms=maomaoArms;return g;},
  face:(r,c)=>face(r,c),
  front:(r,c)=>{fringe(r,c,H,{style:'straight',locks:34});if(!look.loose)locks(r,c);
   if(look.flower){emblem.flower(r,38,15+c.y,look.flower,'#ffe08a');emblem.flower(r,36,17+c.y,look.flower,'#ffe08a');}
   if(!look.loose){r.line(31,8+c.y,40,4+c.y,look.pin?'#e0b85c':'#d9c37b');r.rect(39,3+c.y,2,2,'#95c8b0');}},
 },opts);
}
