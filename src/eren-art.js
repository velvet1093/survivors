import {buildHero,standardHead,torso,casual,pajamas,swim,emblem,longHairBack,mix,SKIN} from './hero-builder.js';
import {canvas,motion,eye,mouth,limb,selout} from './hero-kit.js';
// Eren: shaggy brown hair, teal eyes and the Survey Corps uniform: short brown jacket,
// white shirt, leather harness straps, white trousers, knee boots, ODM gas canisters
// and twin blades (Thunder Spears once evolved). Form 1 is the Attack Titan.
export const EREN_COLORS={hair:'#4a3328',hairShade:'#2c1d18',hairLight:'#73513f',jacket:'#9c7448',jacketShade:'#6a4c30',jacketLight:'#c49a68',strap:'#3a2a24',white:'#efeadf',iris:'#3f9f8f',steel:'#c9d3d8',steelDark:'#7a8a94'};
const C=EREN_COLORS,INK='#2a2226',H={h:C.hair,s:C.hairShade,l:C.hairLight};
function hair(r,c,{long=false,bun=false}={}){
 const y=c.y,{poly,line}=r;
 if(long)longHairBack(r,c,H,{length:46});
 poly([[15,25+y],[15,14+y],[21,8+y],[35,8+y],[41,14+y],[41,25+y]],H.s);poly([[16,24+y],[16,15+y],[22,10+y],[34,10+y],[40,15+y],[40,24+y]],H.h);
 // Jagged tufts break up the outline so the hair reads as messy rather than a helmet.
 for(const [ax,ay,tx,ty,bx,by]of [[15,18,11,22,15,24],[15,24,12,29,17,27],[41,18,45,22,41,24],[41,24,44,29,39,27],[19,10,18,5,23,9],[25,8,27,3,30,8],[31,8,35,4,36,10]]){poly([[ax,ay+y],[tx,ty+y],[bx,by+y]],H.s);poly([[ax+(tx<28?1:-1),ay+1+y],[tx+(tx<28?1:-1),ty+1+y],[bx,by+y]],H.h);}
 if(bun){poly([[30,6+y],[33,2+y],[38,4+y],[37,9+y]],H.s);poly([[31,6+y],[33,3+y],[36,5+y],[35,8+y]],H.h);}
}
function bangs(r,c,{parted=false}={}){
 const y=c.y,{poly,line}=r;
 if(parted){poly([[17,28+y],[17,17+y],[23,12+y],[27,12+y],[22,19+y],[19,30+y]],H.h);poly([[39,28+y],[39,17+y],[33,12+y],[29,12+y],[34,19+y],[37,30+y]],H.h);return;}
 // Messy forelocks fall unevenly across the brow.
 poly([[17,27+y],[17,16+y],[22,12+y],[34,12+y],[39,16+y],[39,27+y],[36,22+y],[34,26+y],[31,20+y],[28,25+y],[26,20+y],[23,26+y],[21,21+y],[19,28+y]],H.s);
 poly([[18,25+y],[18,17+y],[22,13+y],[34,13+y],[38,17+y],[38,24+y],[36,20+y],[34,23+y],[31,18+y],[28,23+y],[26,18+y],[23,24+y],[21,19+y],[19,25+y]],H.h);
 line(22,14+y,27,13+y,H.l);
}
function face(r,c){
 const y=c.y,hurt=c.expression==='hurt',focus=c.expression==='focused'||c.expression==='ultimate'||c.expression==='neutral';
 for(const [x,side]of [[21,-1],[31,1]])eye(r,x,26+y,{iris:C.iris,irisDark:'#1f5a52',lash:INK,side,closed:c.blink,hurt,focus:c.expression!=='neutral'&&focus});
 // Determined brows.
 if(!c.blink){r.line(20,24+y,24,25+y,H.s);r.line(32,25+y,36,24+y,H.s);}
 mouth(r,34+y,c.expression,{lip:'#9c6670'});
}
function scout(r,c,{cloak=false}={}){
 const b=torso(r,c,{color:C.white,shade:'#c9c2b2',light:'#ffffff',bottom:54});
 // Short brown jacket open over the shirt, harness straps crossing the chest.
 r.poly([[b.l,b.t+c.y],[b.l+6,b.t+c.y],[b.l+6,47],[b.l+1,47]],C.jacket);r.poly([[b.r-6,b.t+c.y],[b.r,b.t+c.y],[b.r-1,47],[b.r-6,47]],C.jacket);
 r.line(b.l+5,b.t+1+c.y,b.l+5,46,C.jacketLight);r.line(b.r-5,b.t+1+c.y,b.r-5,46,C.jacketShade);
 r.line(b.l+6,b.t+3+c.y,b.r-7,50,C.strap);r.line(b.r-6,b.t+3+c.y,b.l+7,50,C.strap);r.rect(27,46,3,3,'#b9a06a');
 r.rect(b.l+1,51,b.r-b.l-2,2,C.strap);
 // ODM gas canisters at both hips.
 for(const x of [b.l-3,b.r-1]){r.rect(x,51,4,6,C.steelDark);r.rect(x+1,51,2,5,C.steel);}
 if(cloak){r.poly([[b.l-2,b.t-1+c.y],[b.r+2,b.t-1+c.y],[b.r+4,60+c.walk],[b.l-4,60+c.walk]],'#3d6b52');r.poly([[b.l+3,b.t+c.y],[b.r-3,b.t+c.y],[b.r-3,47],[b.l+3,47]],C.white);r.line(b.l+6,b.t+3+c.y,b.r-7,50,C.strap);r.line(b.r-6,b.t+3+c.y,b.l+7,50,C.strap);r.rect(23,37+c.y,10,2,'#3d6b52');}
 return {sleeve:cloak?'#3d6b52':C.jacket,sleeveLight:cloak?'#5a8a6e':C.jacketLight,cuff:C.jacketShade,legs:C.white,legShade:'#c9c2b2',legLight:'#ffffff',legTop:54,boots:60,shoe:'#5a3a28',shoeLight:'#8a5f44'};
}
function longCoat(r,c,{color,shade,light,inner='#2c2a30',tie}){
 const b=torso(r,c,{color:inner,bottom:54}),w=c.walk;
 r.poly([[b.l-1,b.t+c.y],[b.l+6,b.t+c.y],[b.l+5,66+w],[b.l-4,65+w]],color);r.poly([[b.r-6,b.t+c.y],[b.r+1,b.t+c.y],[b.r+4,65+w],[b.r-5,66+w]],color);
 r.line(b.l+5,b.t+1+c.y,b.l+4,65+w,light);r.line(b.r-5,b.t+1+c.y,b.r-4,65+w,shade);
 if(tie)r.rect(27,b.t+1+c.y,2,8,tie);
 return {sleeve:color,sleeveLight:light,cuff:shade,legs:'#2c2a30',legShade:'#1a181e',legTop:54,shoe:'#1a181e',shoeLight:'#3a3842'};
}
function blades(r,c,evolved){
 const adult=true,sy=40+c.y,{line,rect}=r;
 const L=c.special?[10,sy-8]:[14,sy+12],R=c.special?[46,sy-8]:c.attack?[47,sy+1]:[42,sy+12];
 if(evolved==='thunderspears'){for(const [x,yy]of [L,R]){rect(x-2,yy-1,5,4,C.steelDark);rect(x-1,yy-6,3,6,'#d9d2c0');rect(x-1,yy-8,3,2,'#b04a3a');}return;}
 // Twin blades extend from the grips along each forearm.
 for(const [i,[x,yy]]of [L,R].entries()){const dir=i?1:-1;rect(x-1,yy+1,4,3,C.steelDark);
  if(c.attack&&i){line(x+3,yy+2,x+13,yy-1,C.steel,2);line(x+3,yy+1,x+13,yy-2,'#ffffff');}
  else{line(x+dir,yy+3,x+dir*6,yy+15,C.steel,2);line(x+dir,yy+3,x+dir*6,yy+15,'#ffffff',1);}}
}
const LOOKS={
 default:{garment:(r,c)=>scout(r,c)},
 cloak:{garment:(r,c)=>scout(r,c,{cloak:true})},
 yeagerist:{bun:true,parted:true,garment:(r,c)=>longCoat(r,c,{color:'#2a2930',shade:'#17161b',light:'#46444f',inner:'#ece6d8',tie:'#2a2930'})},
 infiltrator:{long:true,parted:true,noBlades:true,garment:(r,c)=>longCoat(r,c,{color:'#c9b48e',shade:'#8f7a58',light:'#e6d7b6',inner:'#e9e3d4'})},
 casual:{garment:(r,c)=>casual(r,c,{top:'tee',color:'#e9e2d2',jacket:'#556b4a',bottom:'jeans',bottomColor:'#3a4b66',shoe:'#6b4a3a'})},
 pajamas:{garment:(r,c)=>pajamas(r,c,{color:'#6f7f5a',trim:'#e9e2d2',motif:(r,c)=>{r.rect(22,45,3,3,'#e9e2d2');r.put(23,46,'#3d6b52');}})},
 swimsuit:{garment:(r,c)=>swim(r,c,{style:'trunks',color:'#3d6b52',accent:'#e9e2d2',motif:(r,c)=>{r.rect(31,53,3,3,'#e9e2d2');}})},
};
// ---- Attack Titan: taller, muscular, long dark hair, exposed jaw muscle and green eyes. ----
export const TITAN_COLORS={skin:'#c58d6e',skinShade:'#8f5e48',skinLight:'#e0ad8a',muscle:'#a8564a',hair:'#2b1e1a',eye:'#7fe0a6'};
const T=TITAN_COLORS;
function titanPixels({frame=0,moving=false,pose='',attack=false,expression='neutral',blink=false,evolved=''}={}){
 const r=canvas(),{walk,y:bob}=motion({frame,moving}),y=bob-3,{poly,rect,line,put}=r,cast=attack||!!pose;
 // Long shaggy hair behind.
 poly([[13,22+y],[16,8+y],[40,8+y],[43,22+y],[44+walk*.3,44],[38,46],[18,46],[12+walk*.3,44]],T.hair);
 // Legs and torso: broad, sinewy, with darker muscle grooves.
 for(const [i,x]of [20,31].entries()){const d=i?walk:-walk;rect(x+d-1,52,8,16,T.skinShade);rect(x+d,52,6,15,T.skin);line(x+d+2,54,x+d+2,64,T.skinLight);rect(x+d-1,67,8,4,T.skinShade);}
 poly([[15,36+y],[41,36+y],[38,54],[18,54]],T.skinShade);poly([[16,37+y],[40,37+y],[37,53],[19,53]],T.skin);
 line(28,38+y,28,52,T.skinShade);line(20,44,26,44,T.skinShade);line(30,44,36,44,T.skinShade);line(21,48,26,49,T.skinShade);line(30,49,35,48,T.skinShade);
 for(const x of [19,33])line(x,39+y,x+4,40+y,T.skinLight);
 // Huge arms; fists clenched, raised to punch when attacking.
 const fist=(x,yy)=>{rect(x-3,yy-2,7,6,T.skinShade);rect(x-2,yy-1,5,4,T.skin);line(x-2,yy-1,x+2,yy-1,T.skinLight);};
 const arm=(x0,y0,x1,y1)=>{line(x0,y0,x1,y1,T.skinShade,7);line(x0,y0,x1,y1,T.skin,5);line(x0,y0,x1,y1,T.skinLight,1);fist(x1,y1+2);};
 arm(16,39+y,9,cast?36:52);arm(40,39+y,cast?50:47,cast?34:52);
 // Head: angular, with hollow cheeks, bared teeth and exposed jaw muscle.
 poly([[18,16+y],[38,16+y],[39,28+y],[35,37+y],[21,37+y],[17,28+y]],T.skinShade);poly([[19,17+y],[37,17+y],[38,28+y],[34,36+y],[22,36+y],[18,28+y]],T.skin);
 poly([[12,22+y],[18,21+y],[18,27+y]],T.skinShade);poly([[44,22+y],[38,21+y],[38,27+y]],T.skinShade);
 rect(20,31+y,4,5,T.muscle);rect(32,31+y,4,5,T.muscle);for(let x=21;x<35;x+=2){put(x,32+y,'#f1e8d8');put(x,34+y,'#f1e8d8');}line(21,33+y,35,33+y,'#3a1e1e');
 for(const x of [21,31]){if(blink){line(x,26+y,x+4,26+y,T.hair);continue;}rect(x,25+y,5,3,'#1a1414');rect(x+1,26+y,3,1,T.eye);put(x+2,26+y,'#e8fff0');}
 line(20,23+y,25,24+y,T.hair);line(31,24+y,36,23+y,T.hair);
 // Shaggy fringe.
 poly([[16,24+y],[16,12+y],[22,8+y],[34,8+y],[40,12+y],[40,24+y],[37,18+y],[33,22+y],[30,16+y],[27,22+y],[24,16+y],[21,22+y],[19,18+y]],T.hair);
 if(evolved==='titanquake'||cast)for(const x of [7,52])rect(x,cast?33:50,2,2,'#f3e6a0');
 return selout(r.pixels,'#1e1414');
}
export function erenPixels(opts={}){
 if(opts.form===1)return titanPixels(opts);
 const look=LOOKS[opts.skin]||LOOKS.default,spec={build:'adult',ink:INK};
 return buildHero(spec,{
  back:(r,c)=>hair(r,c,look),
  garment:look.garment,
  prop:look.noBlades?(r,c)=>{r.line(46,48,44,70,'#6b4a3a',2);r.rect(43,46,5,2,'#6b4a3a');}:(r,c)=>blades(r,c,opts.evolved),
  face,
  front:(r,c)=>bangs(r,c,look),
 },opts);
}
