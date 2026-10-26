import {buildHero,torso,casual,pajamas,swim,bikini,emblem,mix,SKIN} from './hero-builder.js';
import {canvas,motion,eye,mouth,limb,selout,lid,brow,tear} from './hero-kit.js';
// Samus. Power suits share one armoured body (helmet, visor, shoulder spheres, chest
// plate, arm cannon) recoloured per suit; Zero Suit and the off-duty looks use the
// human builder with her blonde ponytail. The bomb pose curls into the Morph Ball.
export const SUIT_COLORS={
 default:{main:'#d9954f',shade:'#8c573d',light:'#f1c67a',accent:'#ac5854',accentLight:'#e0806e',visor:'#7ad27a',visorDark:'#2f7a4a',cannon:'#8c8f86'},
 gravity:{main:'#9d74bf',shade:'#5c477b',light:'#d4b1e2',accent:'#ac5854',accentLight:'#e0806e',visor:'#7ad27a',visorDark:'#2f7a4a',cannon:'#8c8f86'},
 fusion:{main:'#3b9cbd',shade:'#235f7c',light:'#8fd2e6',accent:'#d5b94d',accentLight:'#f0dc8a',visor:'#c34b83',visorDark:'#7a2753',cannon:'#4c8064'},
};
const INK='#2a2622',HAIR={h:'#f0cf6a',s:'#b88a3a',l:'#fff0a8'};
function powerSuit(opts,pal){
 const {frame=0,moving=false,pose='',attack=false,expression='neutral',blink=false}=opts;
 const r=canvas(),{walk,y:bob}=motion({frame,moving}),y=bob-2,{poly,rect,line,put}=r,cast=attack||(pose&&pose!=='bomb');
 // Legs: armoured thighs, knee caps and heavy boots.
 for(const [i,x]of [20,31].entries()){const d=i?walk:-walk;
  rect(x+d-1,52,8,12,pal.shade);rect(x+d,52,6,11,pal.main);line(x+d+1,53,x+d+1,61,pal.light);
  rect(x+d,58,6,3,pal.accent);rect(x+d+1,58,3,1,pal.accentLight);rect(x+d-2,63,9,8,pal.shade);rect(x+d-1,63,7,6,pal.main);rect(x+d-2,69,9,2,mix(pal.shade,'#000000',.3));}
 // Torso with a chest plate and belt.
 poly([[17,38+y],[39,38+y],[37,53],[19,53]],pal.shade);poly([[18,39+y],[38,39+y],[36,52],[20,52]],pal.main);
 poly([[21,40+y],[35,40+y],[33,47+y],[23,47+y]],pal.accent);line(22,41+y,34,41+y,pal.accentLight);rect(20,50,16,2,pal.shade);rect(26,50,4,2,pal.light);
 // Big shoulder spheres.
 for(const x of [12,35]){poly([[x,38+y],[x+3,34+y],[x+7,34+y],[x+10,38+y],[x+9,44+y],[x+1,44+y]],pal.shade);poly([[x+1,38+y],[x+3,35+y],[x+7,35+y],[x+9,38+y],[x+8,43+y],[x+2,43+y]],pal.main);line(x+3,36+y,x+6,36+y,pal.light);}
 // Left arm hangs; the right arm is the cannon, raised to fire.
 line(16,44+y,14,54,pal.shade,5);line(16,44+y,14,54,pal.main,3);rect(12,53,5,4,pal.accent);
 const cx=cast?48:42,cy=cast?44+y:53;line(39,44+y,cx-4,cy,pal.shade,6);rect(cx-6,cy-3,9,7,pal.cannon);rect(cx-5,cy-2,7,1,mix(pal.cannon,'#ffffff',.3));rect(cx+3,cy-2,2,5,mix(pal.cannon,'#000000',.3));
 if(attack){rect(cx+5,cy-1,3,3,'#fff3a8');put(cx+8,cy,'#ffd96a');}
 // Helmet with a T-shaped visor.
 poly([[18,16+y],[22,10+y],[34,10+y],[38,16+y],[39,30+y],[35,37+y],[21,37+y],[17,30+y]],pal.shade);poly([[19,17+y],[23,11+y],[33,11+y],[37,17+y],[38,29+y],[34,36+y],[22,36+y],[18,29+y]],pal.main);
 poly([[20,21+y],[36,21+y],[36,27+y],[31,27+y],[30,33+y],[26,33+y],[25,27+y],[20,27+y]],pal.visorDark);poly([[21,22+y],[35,22+y],[35,26+y],[30,26+y],[29,32+y],[27,32+y],[26,26+y],[21,26+y]],pal.visor);
 line(22,23+y,26,23+y,mix(pal.visor,'#ffffff',.6));
 // Eyes glint through the visor; they close when blinking and narrow when hurt.
 if(!blink){for(const x of [23,31]){rect(x,24+y,2,expression==='hurt'?1:2,mix(pal.visorDark,'#000000',.3));}}else for(const x of [23,31])line(x,25+y,x+2,25+y,mix(pal.visorDark,'#000000',.3));
 rect(17,30+y,3,4,pal.accent);rect(36,30+y,3,4,pal.accent);line(24,13+y,32,13+y,pal.light);
 return selout(r.pixels,INK);
}
function morphBall(opts,pal){
 const {frame=0}=opts,r=canvas(),{poly,rect,line,put}=r,spin=((frame%4)+4)%4;
 poly([[20,58],[24,52],[32,52],[36,58],[36,64],[32,70],[24,70],[20,64]],pal.shade);poly([[21,58],[25,53],[31,53],[35,58],[35,64],[31,69],[25,69],[21,64]],pal.main);
 for(let i=0;i<4;i++){const a=(i+spin*.25)*Math.PI/2;put(28+Math.round(Math.cos(a)*6),61+Math.round(Math.sin(a)*6),pal.accent);}
 rect(26,59,4,4,pal.visor);put(27,59,'#ffffff');line(23,55,27,54,pal.light);
 return selout(r.pixels,INK);
}
// Human looks.
function ponytail(r,c){
 const y=c.y,{poly,line}=r;
 poly([[16,24+y],[17,12+y],[23,8+y],[33,8+y],[39,12+y],[40,24+y],[39,34+y],[17,34+y]],HAIR.s);
 // High ponytail swinging behind the right shoulder.
 poly([[34,12+y],[40,10+y],[44+c.walk,26],[42+c.walk,46],[38,40],[37,22+y]],HAIR.s);poly([[35,13+y],[39,12+y],[42+c.walk,26],[40+c.walk,43],[38,36],[37,22+y]],HAIR.h);line(39,16+y,41+c.walk,38,HAIR.l);
}
function bangs(r,c){
 const y=c.y,{poly,line}=r;
 poly([[17,26+y],[17,16+y],[22,11+y],[34,11+y],[39,16+y],[39,30+y],[37,24+y],[34,20+y],[30,23+y],[26,18+y],[22,22+y],[19,28+y]],HAIR.s);
 poly([[18,24+y],[18,17+y],[22,12+y],[34,12+y],[38,17+y],[38,26+y],[36,22+y],[33,19+y],[30,21+y],[26,17+y],[22,21+y],[19,25+y]],HAIR.h);line(21,14+y,27,12+y,HAIR.l);
 // Long side lock framing the face.
 poly([[17,22+y],[20,22+y],[20,38+y],[17,36+y]],HAIR.h);
}
function face(r,c){
 const y=c.y,hurt=c.expression==='hurt',focus=c.expression==='focused'||c.expression==='ultimate';
 for(const [x,side]of [[21,-1],[31,1]])eye(r,x,26+y,{iris:'#4f8fd0',irisDark:'#244f86',lash:INK,side,closed:c.blink,hurt,focus});
 if(!c.blink&&!hurt)for(const [x,side]of [[21,-1],[31,1]])lid(r,x,26+y,{lash:INK,rows:1,side});
 if(!c.blink)for(const [x,side]of [[21,-1],[31,1]])brow(r,x,24+y,{color:'#b48a3e',side,tilt:focus?1:0});
 r.put(34,34+y,'#6a4a3a');
 if(c.expression==='neutral')r.rect(27,34+y,3,1,'#b86e74');
 else if(c.expression==='ultimate'){r.rect(26,34+y,4,3,'#7a3a48');r.rect(26,34+y,4,1,'#fff4ec');}
 else mouth(r,34+y,c.expression,{lip:'#b86e74'});
}
function zeroSuit(r,c,{stealth=false}={}){
 const col=stealth?'#2a2d3a':'#3d74c4',shade=stealth?'#171925':'#244a86',light=stealth?'#4a5066':'#78a8e8';
 const b=torso(r,c,{color:col,shade,light,bottom:54});
 for(const yy of [43,49])r.line(b.l+2,yy+(yy<45?c.y:0),b.r-2,yy+(yy<45?c.y:0),shade);r.rect(26,b.t+2+c.y,4,3,stealth?'#7a4a8a':'#f0a14a');
 return {sleeve:col,sleeveLight:light,cuff:shade,legs:col,legShade:shade,legLight:light,legTop:54,boots:62,shoe:stealth?'#14151d':'#2a4a7c',shoeLight:light,
  afterArms(r,c){
   // Paralyzer pistol in the right hand.
   const x=c.attack?47:42,yy=c.attack?41+c.y:52+c.y;r.rect(x-2,yy,6,3,'#5a6270');r.rect(x+3,yy,2,2,'#9ab0c4');if(c.attack)r.put(x+6,yy,'#9fe0ff');}};
}
const HUMAN={
 zerosuit:(r,c)=>zeroSuit(r,c),
 stealth:(r,c)=>zeroSuit(r,c,{stealth:true}),
 casual:(r,c)=>casual(r,c,{top:'tee',color:'#2f3a4a',jacket:'#d9954f',bottom:'jeans',bottomColor:'#3a4b66',motif:(r,c)=>{r.rect(26,44+c.y,4,3,'#7ad27a');},shoe:'#e8e4da',shoeTrim:'#ac5854'}),
 pajamas:(r,c)=>pajamas(r,c,{color:'#e6b85a',trim:'#2f3a4a',motif:(r,c)=>{for(const [x,yy]of [[22,45],[33,48],[24,51]])emblem.star(r,x,yy,'#ffffff');}}),
 swimsuit:(r,c)=>swim(r,c,{style:'onepiece',color:'#3d74c4',accent:'#f0a14a',motif:(r,c)=>{r.rect(26,46+c.y,4,2,'#f0a14a');}}),
 bikini:(r,c)=>bikini(r,c,{color:'#d9954f',accent:'#7ad27a',motif:(r,c)=>{r.put(28,42+c.y,'#7ad27a');}}),
 bathsuit:(r,c)=>{const g=swim(r,c,{style:'rash',color:'#3d74c4',accent:'#f0a14a'});return {...g,short:false,sleeve:'#3d74c4',legs:'#3d74c4',shorts:null,shoe:'#e8e4da',sandals:false};},
};
export function variaSuitPixels(opts={}){return powerSuit(opts,SUIT_COLORS.default);}
export function samusPixels(opts={}){
 const skin=opts.skin||'default',pal=SUIT_COLORS[skin]||SUIT_COLORS.default;
 if(opts.pose==='bomb')return morphBall(opts,pal);
 if(!HUMAN[skin])return powerSuit(opts,pal);
 return buildHero({build:'adult',ink:INK},{back:ponytail,garment:HUMAN[skin],face,front:bangs},opts);
}
