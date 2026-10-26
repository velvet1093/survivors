import {buildHero,torso,casual,swim,bikini,skirt,emblem,longHairBack,fringe,bow,mix,SKIN} from './hero-builder.js';
import {eye,mouth,limb} from './hero-kit.js';
// Esdeath: knee-length ice-blue hair, a peaked white cap and the white high-collared
// uniform with a black cross at the chest, white trousers, boots and a rapier.
export const ESDEATH_COLORS={hair:'#9bcde8',hairShade:'#567ea7',hairLight:'#d1eef8',coat:'#e6edf0',coatShade:'#b5c6d6',coatLight:'#ffffff',black:'#1f2533',iris:'#4f9fd0'};
const C=ESDEATH_COLORS,INK='#283e5a',H={h:C.hair,s:C.hairShade,l:C.hairLight};
function face(r,c){
 const y=c.y,hurt=c.expression==='hurt',focus=c.expression==='focused'||c.expression==='ultimate';
 for(const [x,side]of [[21,-1],[31,1]])eye(r,x,26+y,{iris:C.iris,irisDark:'#1f5a8a',lash:INK,side,closed:c.blink,hurt,focus});
 // A cold, confident smile.
 if(c.expression==='neutral'){r.rect(26,34+y,4,1,'#b07882');r.put(30,33+y,'#b07882');}else mouth(r,34+y,c.expression,{lip:'#b07882'});
}
function uniform(r,c,{night=false}={}){
 const col=night?'#3b4f75':C.coat,shade=night?'#253658':C.coatShade,light=night?'#5c74a0':C.coatLight;
 const b=torso(r,c,{color:col,shade,light,bottom:55});
 // Black cross with a white border on the chest, double row of buttons, belt.
 r.rect(26,b.t+3+c.y,4,10,C.black);r.rect(23,b.t+6+c.y,10,3,C.black);r.rect(27,b.t+4+c.y,2,8,'#ffffff');r.rect(24,b.t+7+c.y,8,1,'#ffffff');
 for(const yy of [b.t+15,b.t+18])for(const x of [24,32])r.put(x,yy,'#c9b36b');
 r.rect(b.l+1,51,b.r-b.l-2,2,C.black);r.rect(27,51,2,2,'#c9b36b');
 // Long coat tails behind the legs.
 r.poly([[b.l,50],[b.l+4,50],[b.l+2,64+c.walk],[b.l-3,63+c.walk]],shade);r.poly([[b.r-4,50],[b.r,50],[b.r+3,63+c.walk],[b.r-2,64+c.walk]],shade);
 return {sleeve:col,sleeveLight:light,cuff:C.black,legs:col,legShade:shade,legLight:light,legTop:55,boots:62,shoe:night?'#1b2742':'#f4f7f9',shoeLight:night?'#3b4f75':'#ffffff',
  afterHead(r,c){r.rect(23,37+c.y,10,3,shade);r.rect(24,37+c.y,8,2,col);}};
}
function sweater(r,c){
 const b=torso(r,c,{color:'#efe5d2',shade:'#c5b597',light:'#ffffff',bottom:52});
 for(let yy=b.t+3;yy<52;yy+=3)r.line(b.l+2,yy+(yy<45?c.y:0),b.r-2,yy+(yy<45?c.y:0),'#d9ccb2');
 skirt(r,c,{top:51,bottom:60,flare:5,color:'#2b2f3d',shade:'#181b26',light:'#454a5c'});
 return {sleeve:'#efe5d2',sleeveLight:'#ffffff',cuff:'#c5b597',sleeveWidth:6,legs:'#2b2f3d',legShade:'#181b26',legTop:58,boots:63,shoe:'#5a4436',shoeLight:'#8a6a54'};
}
function blackDress(r,c){
 const w=c.walk,b=torso(r,c,{color:'#24222e',shade:'#141320',light:'#3c3a4c',bottom:50});
 r.poly([[b.l,48],[b.r,48],[b.r+5+w,66],[b.l-5+w,66]],'#141320');r.poly([[b.l+1,48],[b.r-1,48],[b.r+3+w,65],[b.l-3+w,65]],'#24222e');
 for(let x=b.l-4+w;x<b.r+5+w;x+=3)r.rect(x,64,2,2,'#4a4860');for(const a of [-5,0,5])r.line(28+a,50,28+a*1.8+w,63,'#3c3a4c');
 r.rect(24,b.t+c.y,8,2,'#4a4860');
 return {sleeve:'#24222e',sleeveLight:'#3c3a4c',cuff:'#4a4860',legs:'bare',legTop:63,shoe:'#141320',shoeLight:'#3c3a4c'};
}
function nightgown(r,c){
 const w=c.walk,b=torso(r,c,{color:'#e4f1fa',shade:'#a9c4d8',light:'#ffffff',bottom:50});
 r.poly([[b.l,48],[b.r,48],[b.r+4+w,66],[b.l-4+w,66]],'#a9c4d8');r.poly([[b.l+1,48],[b.r-1,48],[b.r+2+w,65],[b.l-2+w,65]],'#e4f1fa');
 for(const [x,yy]of [[22,44],[33,46],[23,56],[33,59],[27,62]]){const xx=x+(yy>50?w:0);r.put(xx,yy-1,'#6fb3dd');r.rect(xx-1,yy,3,1,'#6fb3dd');r.put(xx,yy+1,'#6fb3dd');}
 return {sleeve:'#e4f1fa',sleeveLight:'#ffffff',cuff:'#a9c4d8',legs:'bare',legTop:63,shoe:'#ffffff'};
}
function rapier(r,c,g){
 // A slim rapier: held low at the left hip, raised overhead when casting ice.
 const {line,rect,put}=r;
 if(c.special){line(45,30+c.y,45,8+c.y,'#dfeef6');line(46,30+c.y,46,9+c.y,'#9fb8c8');rect(43,30+c.y,5,2,'#c9b36b');return;}
 if(c.attack){line(47,41+c.y,55,37+c.y,'#dfeef6');rect(45,40+c.y,3,3,'#c9b36b');return;}
 line(15,54,9,66,'#dfeef6');line(16,54,10,66,'#9fb8c8');rect(13,52,5,2,'#c9b36b');put(15,51,'#c9b36b');
}
function cap(r,c,night){
 // Peaked military cap with a dark visor and a small emblem.
 const y=c.y,col=night?'#2f4066':'#f4f7f9',shade=night?'#1b2742':'#b5c6d6',{poly,rect,put}=r;
 poly([[16,14+y],[18,7+y],[28,4+y],[38,7+y],[41,14+y]],shade);poly([[17,13+y],[19,8+y],[28,5+y],[37,8+y],[40,13+y]],col);
 rect(16,13+y,25,2,C.black);rect(20,15+y,16,1,'#3a4253');rect(26,8+y,4,3,C.black);put(27,9+y,'#ffffff');put(28,9+y,'#ffffff');
}
const LOOKS={
 default:{cap:true,garment:(r,c)=>uniform(r,c)},
 winter:{cap:true,night:true,garment:(r,c)=>uniform(r,c,{night:true})},
 sweater:{garment:sweater},
 blackdress:{garment:blackDress},
 casual:{garment:(r,c)=>casual(r,c,{top:'tee',color:'#ffffff',jacket:'#3d5a86',bottom:'jeans',bottomColor:'#2b3448',motif:(r,c)=>emblem.star(r,28,45+c.y,'#6fb3dd'),shoe:'#f4f7f9'})},
 pajamas:{garment:nightgown},
 swimsuit:{garment:(r,c)=>swim(r,c,{style:'onepiece',color:'#3d7fbf',accent:'#d1eef8',motif:(r,c)=>emblem.star(r,28,46+c.y,'#d1eef8')})},
 bikini:{garment:(r,c)=>bikini(r,c,{color:'#e4f1fa',accent:'#6fb3dd',motif:(r,c)=>emblem.flower(r,28,43+c.y,'#6fb3dd','#ffffff')})},
 bathsuit:{garment:(r,c)=>swim(r,c,{style:'onepiece',color:'#eaf6fb',accent:'#4f9fd0',motif:(r,c)=>{r.line(22,47,34,47,'#4f9fd0');}})},
};
export function esdeathPixels(opts={}){
 const look=LOOKS[opts.skin]||LOOKS.default,spec={build:'adult',ink:INK};
 return buildHero(spec,{
  back:(r,c)=>longHairBack(r,c,H,{length:64,width:2}),
  garment:(r,c)=>look.garment(r,c),
  prop:rapier,
  face:(r,c)=>face(r,c),
  front:(r,c)=>{fringe(r,c,H,{style:'choppy',locks:40});if(look.cap)cap(r,c,look.night);else if(opts.skin==='pajamas'||opts.skin==='bikini')emblem.flower(r,38,15+c.y,'#ffffff','#6fb3dd');},
 },opts);
}
