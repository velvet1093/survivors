import {canvas,motion,limb,selout,mix,SKIN} from './hero-kit.js';
// Jacket from Hotline Miami. The rooster mask (Richard): white feathers, a red comb and
// wattles, a yellow beak and round black eyes ringed in cyan. A maroon letterman jacket with
// cream sleeves and a cream "B", a cyan tee and blood-spattered jeans; an Uzi in one hand and
// a hammer in the other. The Biker skin is the cyan helmet with its black visor, a magenta
// puffer vest with a skull patch, torn jeans, tan boots and a bloody cleaver.
export const JACKET_ART={ink:'#16121c',feather:'#c8bca6',featherShade:'#7e7262',featherDark:'#4e4438',comb:'#8a1a22',combShade:'#4e0a12',flesh:'#a8323a',beak:'#b08a4a',beakShade:'#6a4a20',eye:'#060408',ring:'#3a4a58',
 maroon:'#8a2a3a',maroonShade:'#5a1a28',maroonLight:'#aa4a5a',cream:'#e8d4a8',creamShade:'#b8a07a',tee:'#4ac8d8',denim:'#4a6ab8',denimShade:'#2a4a88',denimLight:'#6a8ad8',blood:'#d82838',
 helmet:'#4ac8d8',helmetShade:'#2a8a9a',visor:'#0e0c14',vest:'#e02a7a',vestShade:'#a01a5a',vestLight:'#ff6aa8',boot:'#d8a040',bootShade:'#9a7028',glove:'#3a7ab8'};
const c=JACKET_ART,INK=c.ink,ARM='#e8b08a',ARM_SHADE='#c08868';
const shift=(pts,y)=>pts.map(([x,yy])=>[x,yy+y]);
const LOOKS={
 default:{head:'rooster',body:'letterman',legs:'jeans',shoe:['#1a1a22','#2a2a34'],prop:'hammer'},
 biker:{head:'helmet',body:'vest',legs:'torn',shoe:[c.bootShade,c.boot],prop:'cleaver'},
 casual:{head:'rooster',body:'hawaiian',legs:'shorts',shoe:['#d8d8e0','#f4f4f8'],prop:'hammer'},
 pajamas:{head:'rooster',body:'tee',legs:'sweats',shoe:['#5a5a6a','#7a7a8a'],prop:'phone'},
 swimsuit:{head:'rooster',body:'bare',legs:'trunks',shoe:['#c84a8a','#e86aa8'],prop:'hammer'},
};
export const JACKET_LOOK_IDS=Object.keys(LOOKS);

function rooster(r,{y,blink,expression,cast}){
 const {poly,rect,line,put}=r,hurt=expression==='hurt',focus=cast||expression==='focused'||expression==='ultimate';
 // A worn latex rooster mask: grimy grey-brown feathers, a dark crimson comb, raw red flesh
 // around hollow black eye sockets, and a hooked tan beak set in a cruel slant.
 poly(shift([[23,13],[23,4],[26,7],[27,1],[30,6],[32,2],[34,7],[36,5],[35,14]],y),c.combShade);poly(shift([[24,12],[24,6],[26,9],[27,3],[30,8],[32,4],[33,9],[35,7],[34,13]],y),c.comb);line(26,8+y,27,5+y,'#b03a40');
 poly(shift([[16,22],[18,13],[24,9],[33,9],[39,13],[41,22],[41,33],[38,38],[35,35],[32,39],[29,36],[26,39],[23,35],[20,38],[15,33]],y),c.featherDark);
 poly(shift([[17,22],[19,14],[24,10],[33,10],[38,14],[40,22],[40,32],[37,36],[34,33],[31,37],[29,34],[26,37],[23,33],[20,36],[16,32]],y),c.featherShade);
 poly(shift([[19,21],[21,15],[25,12],[32,12],[36,15],[38,21],[37,28],[33,31],[24,31],[20,28]],y),c.feather);
 for(const [x0,y0,x1,y1]of [[18,24,17,32],[39,24,40,31],[22,13,25,11],[33,11,36,14],[21,29,19,34],[36,29,38,34]])line(x0,y0+y,x1,y1+y,c.featherDark);
 for(const [x,yy]of [[22,18],[35,19],[20,25],[37,26]])put(x,yy+y,c.featherShade);
 // Raw red flesh around each sunken socket; the sockets stay hollow and black.
 for(const x of [22,32]){r.rect(x-2,18+y,8,7,c.flesh);r.rect(x-1,17+y,6,1,c.flesh);r.rect(x,19+y,4,4,c.eye);put(x-1,20+y,c.combShade);put(x+4,21+y,c.combShade);
  if(blink){r.rect(x,20+y,4,2,c.flesh);line(x,21+y,x+3,21+y,c.eye);}
  else if(hurt){line(x,19+y,x+3,22+y,c.flesh);}
  else{put(x+(x<28?2:1),20+y,c.ring);if(focus){line(x-1,18+y,x+4,x<28?19+y:18+y,c.featherDark);}}}
 // Brows pressed down into a scowl.
 line(19,17+y,25,19+y,c.featherDark);line(37,17+y,31,19+y,c.featherDark);
 // Hooked beak, its lower edge stained, then the hanging dark wattles.
 poly(shift([[25,23],[31,23],[32,26],[29,31],[27,30],[25,27]],y),c.beakShade);poly(shift([[26,23],[30,23],[31,26],[29,29],[27,28],[26,26]],y),c.beak);line(26,27+y,30,26+y,expression==='ultimate'?'#d82838':c.beakShade);put(29,30+y,'#d82838');
 poly(shift([[24,30],[27,32],[30,31],[31,37],[28,40],[24,37]],y),c.combShade);poly(shift([[25,31],[27,33],[29,32],[30,36],[28,38],[25,36]],y),c.comb);put(26,34+y,'#b03a40');
 if(expression==='ultimate'||hurt){rect(26,27+y,4,1,'#2a0a0a');}
}
function helmet(r,{y,blink,expression,cast}){
 const {poly,rect,line,put}=r,focus=cast||expression==='focused'||expression==='ultimate';
 poly(shift([[17,24],[18,14],[23,8],[33,8],[38,14],[39,24],[39,34],[35,38],[21,38],[17,34]],y),c.helmetShade);
 poly(shift([[18,24],[19,15],[24,9],[32,9],[37,15],[38,24],[38,33],[35,37],[21,37],[18,33]],y),c.helmet);
 line(22,12+y,28,10+y,'#a8f0f8');line(20,16+y,21,22+y,'#a8f0f8');for(const [x0,y0,x1,y1]of [[30,12,33,15],[35,26,37,30]])line(x0,y0+y,x1,y1+y,c.helmetShade);
 // The black visor with a glare; a blink or hurt flicker changes its shine.
 poly(shift([[19,20],[37,20],[37,29],[34,31],[22,31],[19,29]],y),c.visor);
 if(!blink){line(23,22+y,26,28+y,expression==='hurt'?c.blood:'#e8f4f8');line(25,22+y,27,26+y,'#8a9aa8');}
 if(focus)line(29,23+y,35,23+y,'#ff6aa8');
 rect(24,33+y,8,2,c.helmetShade);
}
function letterman(r,{y,walk}){
 const {poly,rect,line,put}=r;
 poly(shift([[19,38],[37,38],[38,52],[18,52]],y),c.maroonShade);poly(shift([[20,39],[36,39],[37,51],[19,51]],y),c.maroon);
 poly(shift([[25,38],[31,38],[28,45]],y),c.tee);line(28,45+y,28,51,c.maroonShade);for(const yy of [43,46,49])put(27,yy+(yy<46?y:0),c.cream);
 // Cream "B" on the chest and slanted pocket welts.
 rect(31,41+y,1,5,c.cream);rect(32,41+y,2,1,c.cream);rect(32,43+y,2,1,c.cream);rect(32,45+y,2,1,c.cream);put(34,42+y,c.cream);put(34,44+y,c.cream);
 line(21,46,23,49,c.cream);line(33,47,35,49,c.cream);
 rect(18,50,20,3,c.maroonShade);for(let x=18;x<38;x+=2)put(x,51,c.maroonLight);
 for(const [x,yy]of [[22,44],[34,48],[29,50]])put(x,yy,c.blood);
}
function vest(r,{y}){
 const {poly,rect,line,put}=r;
 poly(shift([[20,38],[36,38],[36,52],[20,52]],y),'#d8d8e0');poly(shift([[21,39],[35,39],[35,51],[21,51]],y),'#f0f0f4');
 line(25,39+y,28,43+y,'#e0b840');line(31,39+y,28,43+y,'#e0b840');
 for(const side of [-1,1]){const x0=side<0?19:30;poly(shift([[x0,37],[x0+7,37],[x0+7,52],[x0,52]],y),c.vestShade);poly(shift([[x0+1,38],[x0+6,38],[x0+6,51],[x0+1,51]],y),c.vest);for(const yy of [41,44,47,50])line(x0+1,yy+(yy<45?y:0),x0+6,yy+(yy<45?y:0),c.vestShade);line(x0+2,39+y,x0+2,50,c.vestLight);}
 poly(shift([[19,36],[24,34],[24,38],[19,38]],y),c.vestShade);poly(shift([[32,34],[37,36],[37,38],[32,38]],y),c.vestShade);
 // Skull patch on the chest.
 rect(31,42+y,4,3,'#f4f0f6');put(31,45+y,'#f4f0f6');put(34,45+y,'#f4f0f6');put(32,43+y,c.vest);put(34,43+y,c.vest);
 rect(20,51,16,2,'#1a1a22');rect(27,51,2,2,'#a8a8b0');
}
function hawaiian(r,{y}){
 const {poly,put,line}=r,S='#2ac8b8',SS='#1a8a80';poly(shift([[19,38],[37,38],[38,52],[18,52]],y),SS);poly(shift([[20,39],[36,39],[37,51],[19,51]],y),S);
 for(const [x,yy]of [[22,42],[33,41],[25,47],[31,49],[35,45]]){put(x,yy+(yy<46?y:0),'#ff6aa8');put(x+1,yy+(yy<46?y:0),'#ffd070');put(x,yy+1+(yy<45?y:0),'#ff6aa8');}
 line(28,39+y,28,51,SS);poly(shift([[24,38],[28,42],[32,38]],y),ARM);
}
function tee(r,{y}){const {poly,line}=r;poly(shift([[19,38],[37,38],[38,52],[18,52]],y),'#3a3a4a');poly(shift([[20,39],[36,39],[37,51],[19,51]],y),'#5a5a6a');poly(shift([[25,38],[31,38],[28,41]],y),ARM);line(22,44+y,34,44+y,'#7a7a8a');}
function bare(r,{y}){const {poly,line}=r;poly(shift([[20,38],[36,38],[35,50],[21,50]],y),ARM_SHADE);poly(shift([[21,39],[35,39],[34,49],[22,49]],y),ARM);line(28,42+y,28,48,ARM_SHADE);line(23,43+y,26,44+y,ARM_SHADE);line(30,44+y,33,43+y,ARM_SHADE);}
function legs(r,{walk},L){
 const {rect,put,line}=r,[sd,sm]=L.shoe;
 for(const [x,d]of [[22,-walk],[30,walk]]){
  if(L.legs==='jeans'||L.legs==='torn'){const D=L.legs==='torn'?['#1a2a5a','#2a3a6a','#4a5a8a']:[c.denimShade,c.denim,c.denimLight];rect(x+d,52,5,L.legs==='torn'?13:15,D[1]);rect(x+d+4,52,1,15,D[0]);rect(x+d+1,53,1,11,D[2]);
   if(L.legs==='torn'){rect(x+d+1,57,3,1,'#c8d0e0');rect(x+d+2,61,2,1,'#c8d0e0');}else for(const yy of [55,59,63])put(x+d+1+(yy%3),yy,c.blood);}
  else if(L.legs==='sweats'){rect(x+d,52,5,15,'#8a8e9a');rect(x+d+4,52,1,15,'#6a6e7a');rect(x+d,64,5,2,'#6a6e7a');}
  else{rect(x+d,58,5,9,ARM);rect(x+d+4,58,1,9,ARM_SHADE);}
  if(L.legs==='torn'){rect(x+d-1,63,7,8,sm);rect(x+d,63,1,7,'#f0c870');for(let yy=64;yy<69;yy+=2)rect(x+d+2,yy,2,1,sd);rect(x+d-1,70,7,1,sd);}
  else{rect(x+d-1,67,7,4,sm);rect(x+d,67,4,1,mix(sm,'#ffffff',.3));rect(x+d-1,70,7,1,sd);}
 }
 if(L.legs==='shorts'||L.legs==='trunks'){const C=L.legs==='trunks'?['#a01a5a','#e02a7a']:['#2a3a6a','#4a5a8a'];r.poly([[19,50],[37,50],[38,59],[29,59],[28,55],[27,59],[18,59]],C[0]);r.poly([[20,51],[36,51],[37,58],[29,58],[28,54],[27,58],[19,58]],C[1]);if(L.legs==='trunks')for(let x=20;x<37;x+=3)r.put(x,56,'#4ac8d8');}
}
function uzi(r,x,y,{aim=false}={}){
 const {rect,put}=r;
 if(aim){rect(x,y,9,3,'#2a8a9a');rect(x,y,9,1,'#5ad8e8');rect(x+9,y+1,5,1,'#1a1a22');rect(x+2,y+3,2,4,'#1a1a22');rect(x+5,y+3,1,3,'#2a8a9a');put(x+14,y+1,'#ffe08a');}
 else{rect(x,y,3,9,'#2a8a9a');rect(x,y,1,9,'#5ad8e8');rect(x+1,y+9,1,5,'#1a1a22');rect(x-3,y+2,3,2,'#1a1a22');rect(x+3,y+4,2,1,'#2a8a9a');}
}
function prop(r,kind,x,y,raised){
 const {rect,line,put,poly}=r;
 if(kind==='hammer'){if(raised){line(x,y,x+4,y-12,'#8a5a30',2);rect(x+1,y-17,9,5,'#8a8e9c');rect(x+1,y-17,9,1,'#d8dce8');put(x+8,y-14,c.blood);}else{line(x,y,x+1,y+12,'#8a5a30',2);rect(x-3,y+11,9,5,'#8a8e9c');rect(x-3,y+11,9,1,'#d8dce8');put(x+4,y+14,c.blood);}}
 else if(kind==='cleaver'){line(x,y,x,y+4,'#3a2a20',2);poly([[x-3,y+4],[x+3,y+4],[x+3,y+15],[x-4,y+13]],'#a8acb8');line(x-3,y+5,x-3,y+12,'#e8ecf0');rect(x-1,y+11,4,3,c.blood);put(x+1,y+15,c.blood);put(x+2,y+6,'#3a3a44');}
 else if(kind==='phone'){rect(x-2,y,5,7,'#e8e0c8');rect(x-1,y+1,3,2,'#3a3a44');for(let i=0;i<4;i++)put(x-1+(i%3),y+4+(i>2?1:0),'#8a8a90');}
}
function arms(r,{y,walk,cast,ultimate},L){
 const sleeve=L.body==='letterman'?c.cream:L.body==='hawaiian'?'#2ac8b8':L.body==='tee'?'#5a5a6a':ARM,bareArm=L.body==='vest'||L.body==='bare',w=bareArm?4:5,light=mix(sleeve,'#ffffff',.25);
 const cuff=(x,yy)=>{if(L.body==='letterman')r.rect(x-2,yy+1,6,2,c.maroon);else if(L.body==='vest')r.rect(x-2,yy+1,5,3,c.glove);};
 const biker=L.prop==='cleaver',gun=cast||ultimate;
 // Viewer-left hand: the Uzi at rest, or the hammer / cleaver while the other hand fights.
 const lx=15-walk*.3,ly=51;limb(r,20,40+y,lx,ly,{color:sleeve,light,width:w});cuff(lx,ly);
 if(biker)prop(r,'cleaver',lx,ly+2,false);else if(gun)prop(r,ultimate?'phone-none':L.prop==='phone'?'phone':'hammer',lx+1,ly+2,false);else uzi(r,lx,ly+2);
 // Viewer-right hand: the hammer at rest, the Uzi (or a throwing knife) aimed forward, or the hammer raised.
 const rx=ultimate?42:cast?45:41+walk*.3,ry=ultimate?30:cast?39:51;limb(r,36,40+y,rx,ry,{color:sleeve,light,width:w});cuff(rx,ry);
 if(ultimate)prop(r,'hammer',rx+1,ry+2,true);
 else if(cast){if(biker){r.line(rx+2,ry+1,rx+9,ry-2,'#d8dce8',2);r.put(rx+10,ry-3,'#ffffff');}else uzi(r,rx+1,ry,{aim:true});}
 else if(!biker)prop(r,L.prop,rx+1,ry+2,false);
}
export function jacketPixels({frame=0,moving=false,pose='',attack=false,expression='neutral',blink=false,skin='default'}={}){
 const L=LOOKS[skin]||LOOKS.default,mo=motion({frame,moving}),ultimate=!!pose,cast=attack&&!ultimate;
 const m={y:mo.y,walk:mo.walk,blink,expression:ultimate?'ultimate':expression,cast,ultimate};const r=canvas();
 legs(r,m,L);
 ({letterman,vest,hawaiian,tee,bare})[L.body](r,m);
 arms(r,m,L);
 r.rect(25,35+m.y,6,4,L.head==='helmet'?ARM:c.featherShade);
 (L.head==='helmet'?helmet:rooster)(r,m);
 return selout(r.pixels,INK);
}
