import {canvas,motion,limb,selout,mix,SKIN,head,eye,mouth} from './hero-kit.js';
// Lelouch vi Britannia and C.C., drawn as a matched pair; each skin dresses them both.
//  default   Zero (spiked helmet, high red-lined collar, black-and-crimson cape, purple suit
//            with gold piping) beside C.C. in her white straitjacket with dark straps and
//            wide belled sleeves.
//  school    Ashford Academy: Lelouch's long black high-collared jacket with gold piping;
//            C.C.'s cream-yellow double-breasted blazer, black skirt, navy knee socks and a
//            white ribbon.
//  emperor   The 99th Emperor in white and gold with a jewelled hat, gold mantle and his
//            sword; C.C. in the crimson gothic dress with a black corset, twin tails, a tiny
//            red hat and her pistol.
//  traveler  The wanderers after the Zero Requiem: Lelouch in a cream shirt, maroon vest,
//            blue shawl and lavender sash; C.C. in an orange tunic with red patterned trim,
//            a cream drape, black shorts, white stockings, laced boots and a yellow headscarf.
// Off duty: casual, pajamas (C.C. in Lelouch's oversized shirt hugging Cheese-kun) and swim.
export const LELOUCH_ART={ink:'#16121c',hair:'#2e2636',hairShade:'#1a1420',hairLight:'#54486a',iris:'#9a6ad8',irisDark:'#5a3a8a',geass:'#ff3a52',geassDark:'#9a1024',
 green:'#8ad850',greenShade:'#56a038',greenMid:'#72c044',greenLight:'#c8f088',amber:'#e8b030',amberDark:'#a06818',
 zero:'#2a2040',zeroShade:'#18122a',zeroLight:'#4a3a6a',gold:'#d8b048',goldDark:'#8a6a24',goldLight:'#f4dc88',crimson:'#a01a32',crimsonShade:'#600a1e',
 white:'#f4f2ee',whiteShade:'#c8c4cc',strap:'#3a3a4a',blazer:'#e8d888',blazerShade:'#b8a858',navy:'#2a3a6a',black:'#1e1a24',blackLight:'#3a3446'};
const c=LELOUCH_ART,INK=c.ink;
const shift=(pts,y)=>pts.map(([x,yy])=>[x,yy+y]);
const W=(r,x,y,w,h,col)=>r.rect(x,y,w,h,col);

// ---------- shared ----------
function trousers(r,walk,{color,shade,light,top=52,bottom=67,flare=0}){
 for(const [x,d]of [[22,-walk],[30,walk]]){W(r,x+d-(flare?1:0),top,5+flare,bottom-top,color);W(r,x+d+4,top,1,bottom-top,shade);if(light)W(r,x+d+1,top+1,1,bottom-top-3,light);}
}
function boots(r,walk,{color,light,sole,top=67,height=4}){
 for(const [x,d]of [[22,-walk],[30,walk]]){W(r,x+d-1,top,7,height,color);W(r,x+d,top,4,1,light||mix(color,'#ffffff',.3));W(r,x+d-1,top+height-1,7,1,sole||mix(color,'#000000',.45));}
}
function face(r,{y,blink,expression,cast},{iris,irisDark,geass=false,lids=false}){
 head(r,y);
 const hurt=expression==='hurt',focus=cast||expression==='focused'||expression==='ultimate';
 for(const [x,side]of [[21,-1],[31,1]]){
  const red=geass&&side<0;
  eye(r,x,26+y,{iris:red?c.geass:iris,irisDark:red?c.geassDark:irisDark,lash:'#1a1420',side,closed:blink,hurt,focus:focus||lids});
  if(red&&!blink&&!hurt){r.put(x+1,27+y,'#ffd0d8');r.put(x-1,25+y,c.geass);r.put(x+4,25+y,c.geass);}
 }
 mouth(r,34+y,expression,{lip:'#a86a72'});
}
// ---------- Lelouch hair ----------
function lelouchHairBack(r,y){r.poly(shift([[16,32],[16,18],[20,12],[28,10],[36,12],[40,18],[40,32],[38,38],[18,38]],y),c.hairShade);}
function lelouchFringe(r,y){
 const {poly,line}=r;
 poly(shift([[16,30],[16,18],[20,12],[28,10],[36,12],[40,18],[40,31],[38,26],[36,29],[34,22],[32,28],[30,21],[28,27],[26,21],[24,28],[22,22],[20,29],[18,25],[17,33]],y),c.hairShade);
 poly(shift([[17,27],[17,18],[21,13],[28,11],[35,13],[39,18],[39,27],[37,23],[35,26],[33,20],[31,25],[29,19],[27,25],[25,19],[23,26],[21,20],[19,26]],y),c.hair);
 line(20,16+y,26,12+y,c.hairLight);line(30,12+y,35,15+y,c.hairLight);line(24,15+y,23,20+y,c.hairLight);line(32,15+y,33,19+y,c.hairLight);
 line(17,24+y,17,35+y,c.hair);line(39,24+y,39,35+y,c.hair);
}
// ---------- C.C. hair ----------
function ccHairBack(r,{y,walk},len=62){
 const {poly,line}=r,s=walk*.5;
 poly([[14,22+y],[17,11+y],[39,11+y],[42,22+y],[43+s,len-6],[39+s,len],[34,len-6],[22,len-6],[17+s,len],[13+s,len-6]],c.greenShade);
 poly([[15,22+y],[18,13+y],[38,13+y],[41,22+y],[41+s,len-8],[39+s,len-3],[35,len-9],[21,len-9],[17+s,len-3],[15+s,len-8]],c.greenMid);
 line(16,26,15+s,len-10,c.greenLight);line(40,26,41+s,len-10,c.green);line(18,30,18+s,len-12,c.green);line(38,30,38+s,len-12,c.greenShade);
}
function ccTwinTails(r,{y,walk}){
 const {poly,line}=r;
 for(const [x0,side]of [[17,-1],[39,1]]){const s=walk*side*.7;
  poly([[x0,12+y],[x0+side*5,13+y],[x0+side*9,22+y],[x0+side*10+s,40],[x0+side*8+s,52],[x0+side*5+s,48],[x0+side*6,32],[x0+side,20+y]],c.greenShade);
  poly([[x0,14+y],[x0+side*4,15+y],[x0+side*8,23+y],[x0+side*9+s,39],[x0+side*7+s,49],[x0+side*5+s,45],[x0+side*5,31],[x0+side,21+y]],c.green);
  line(x0+side*4,17+y,x0+side*8+s,36,c.greenLight);}
}
function ccFringe(r,y,{locks=true}={}){
 const {poly,line}=r;
 poly(shift([[16,30],[15,19],[19,12],[28,10],[37,12],[41,19],[40,30],[38,27],[36,28],[34,22],[32,27],[29,21],[27,27],[24,21],[22,27],[20,23],[18,28],[17,34]],y),c.greenShade);
 poly(shift([[17,27],[17,19],[20,14],[28,12],[36,14],[39,19],[39,26],[37,24],[35,26],[33,20],[31,25],[29,19],[27,25],[25,19],[23,25],[21,21],[19,25]],y),c.green);
 line(20,17+y,26,13+y,c.greenLight);line(30,13+y,35,16+y,c.greenLight);line(28,14+y,28,18+y,c.greenLight);
 if(locks){for(const x of [17,38]){W(r,x,22+y,2,22,c.greenMid);line(x+(x<28?0:1),24+y,x+(x<28?0:1),42+y,c.greenLight);r.put(x+(x<28?1:0),44+y,c.greenShade);}}
}
// ---------- props ----------
function pistol(r,x,y,{aim=false}={}){
 if(aim){W(r,x,y,7,3,'#2a2a34');W(r,x,y,7,1,'#6a6a7a');W(r,x+7,y+1,3,1,'#1a1a22');W(r,x+1,y+3,2,3,'#3a2a22');}
 else{W(r,x,y,3,7,'#2a2a34');W(r,x,y,1,7,'#6a6a7a');W(r,x+1,y+7,1,2,'#1a1a22');W(r,x-2,y+1,2,2,'#3a2a22');}
}
function cheesekun(r,x,y){
 // Cheese-kun: a round yellow plush with a beak, a green cap and little feet.
 r.poly([[x,y+3],[x+2,y],[x+8,y],[x+10,y+3],[x+10,y+9],[x+8,y+11],[x+2,y+11],[x,y+9]],'#e8c040');r.rect(x+1,y+1,8,2,'#f8e070');
 r.rect(x+1,y-2,8,3,'#4a9a48');r.rect(x+1,y-2,8,1,'#7ac870');r.put(x+3,y+4,'#1a1a1a');r.put(x+7,y+4,'#1a1a1a');r.rect(x+4,y+6,3,2,'#e87830');r.rect(x+2,y+11,2,1,'#e87830');r.rect(x+7,y+11,2,1,'#e87830');
}
function chessKing(r,x,y){r.rect(x,y+2,3,6,'#f4f2ee');r.rect(x-1,y+7,5,2,'#c8c4cc');r.rect(x+1,y,1,3,'#f4f2ee');r.put(x,y+1,'#f4f2ee');r.put(x+2,y+1,'#f4f2ee');}
function sword(r,x,y){
 // The emperor's sword: a magenta sheath with gold fittings and a round guard.
 r.line(x,y,x+3,y+18,'#a8306a',2);r.line(x+1,y+1,x+3,y+16,'#d8509a');r.rect(x-2,y-2,5,3,c.gold);r.put(x,y-2,c.goldLight);r.line(x-1,y-6,x,y-3,c.gold);r.put(x+3,y+18,c.goldLight);
}

// ---------- Lelouch outfits ----------
function zeroHelmet(r,{y,blink,expression,cast}){
 const {poly,line,rect,put}=r,hurt=expression==='hurt';
 // Spiked crown, then the smooth dome with its gold cheek plates and dark faceplate.
 poly(shift([[21,15],[22,5],[25,12],[28,2],[31,12],[34,5],[35,15]],y),c.zeroShade);poly(shift([[23,14],[23,8],[25,13],[28,5],[31,13],[33,8],[33,14]],y),c.zero);line(28,6+y,28,12+y,c.zeroLight);
 poly(shift([[17,24],[18,15],[23,11],[33,11],[38,15],[39,24],[38,34],[33,38],[23,38],[18,34]],y),c.zeroShade);
 poly(shift([[18,24],[19,16],[24,12],[32,12],[37,16],[38,24],[37,33],[32,37],[24,37],[19,33]],y),c.zero);
 line(21,15+y,26,13+y,c.zeroLight);line(19,19+y,19,26+y,c.zeroLight);
 // Gold trim sweeping down the sides of the faceplate.
 line(20,22+y,24,35+y,c.gold);line(36,22+y,32,35+y,c.gold);line(21,22+y,25,34+y,c.goldDark);
 // Faceplate: violet glass with a glint; blinking hides the glint, a hit cracks it.
 poly(shift([[22,20],[34,20],[33,30],[30,35],[26,35],[23,30]],y),'#3a2a5a');poly(shift([[23,21],[33,21],[32,29],[29,33],[27,33],[24,29]],y),'#5a4a8a');
 if(!blink)line(25,22+y,27,27+y,'#c8b8f0');if(!blink)put(26,22+y,'#ffffff');
 if(hurt){line(29,22+y,31,27+y,'#e8e0ff');line(31,27+y,29,30+y,'#e8e0ff');}
 // Geass: the left eye panel slides open to reveal the glowing red eye.
 if(cast){rect(23,23+y,5,4,'#120a1c');rect(24,24+y,3,2,c.geass);put(25,24+y,'#ffd0d8');put(22,24+y,c.geass);}
 else if(expression==='focused')line(23,25+y,27,25+y,'#8a7ac0');
}
function zeroCollar(r,y){
 const {poly,line}=r;
 // The tall flared collar: black outside, crimson lining, gold edge.
 poly(shift([[14,42],[15,26],[19,31],[21,38],[35,38],[37,31],[41,26],[42,42],[36,41],[20,41]],y),c.zeroShade);
 poly(shift([[16,40],[16,29],[19,33],[21,38],[35,38],[37,33],[40,29],[40,40],[36,40],[20,40]],y),c.crimson);
 line(15,27+y,16,41+y,c.gold);line(41,27+y,40,41+y,c.gold);
}
function zeroCape(r,{y,walk}){
 const {poly,line}=r,s=walk*.6;
 poly([[16,38+y],[40,38+y],[46+s,66],[10+s,66]],c.zeroShade);poly([[17,39+y],[39,39+y],[44+s,65],[12+s,65]],c.crimsonShade);
 poly([[18,40+y],[23,40+y],[17+s,65],[12+s,65]],c.crimson);poly([[33,40+y],[38,40+y],[44+s,65],[39+s,65]],c.crimson);line(11+s,65,45+s,65,c.goldDark);
}
function zeroBody(r,{y,walk}){
 const {poly,line,rect,put}=r;
 trousers(r,walk,{color:c.zero,shade:c.zeroShade,light:c.zeroLight});for(const [x,d]of [[22,-walk],[30,walk]])line(x+d+2,54,x+d+2,64,c.gold);
 boots(r,walk,{color:'#1a1424',light:'#3a3048'});
 poly(shift([[20,38],[36,38],[37,53],[19,53]],y),c.zeroShade);poly(shift([[21,39],[35,39],[36,52],[20,52]],y),c.zero);
 // Gold piping in the suit's angular pattern, and the green gem at the throat.
 line(28,39+y,28,52,c.gold);line(22,42+y,26,46+y,c.gold);line(34,42+y,30,46+y,c.gold);line(26,46+y,26,52,c.goldDark);line(30,46+y,30,52,c.goldDark);
 rect(27,40+y,2,3,'#3ac870');put(27,40+y,'#a8f0c0');rect(19,50,18,2,c.zeroShade);
}
function schoolBoy(r,{y,walk}){
 const {poly,line,rect,put}=r;
 trousers(r,walk,{color:c.black,shade:'#0e0c12',light:c.blackLight});boots(r,walk,{color:'#14121a',light:'#3a3446'});
 // Long jacket to the thigh with a standing collar, gold piping and a belted waist.
 poly(shift([[19,38],[37,38],[38,57],[18,57]],y),'#0e0c16');poly(shift([[20,39],[36,39],[37,56],[19,56]],y),'#1c1a2a');
 line(28,39+y,28,56,'#0e0c16');line(27,40+y,27,55,c.goldDark);line(20,39+y,20,55,c.gold);line(36,39+y,36,55,c.gold);line(19,56,37,56,c.gold);
 for(const yy of [42,46])put(29,yy+y,c.gold);rect(19,49,18,2,'#0e0c16');rect(26,49,4,2,c.goldDark);
 rect(24,36+y,8,3,'#1c1a2a');line(24,36+y,31,36+y,c.gold);put(31,37+y,c.goldLight);put(24,37+y,c.goldLight);
}
function emperorBody(r,{y,walk}){
 const {poly,line,rect,put}=r;
 // White boots and trousers under a white coat split at the front over a dark lining.
 trousers(r,walk,{color:c.white,shade:c.whiteShade});boots(r,walk,{color:'#f4f2ee',light:'#ffffff',sole:c.goldDark});for(const [x,d]of [[22,-walk],[30,walk]])W(r,x+d-1,67,7,1,c.gold);
 poly([[17,46],[39,46],[42+walk,68],[14+walk,68]],c.whiteShade);poly([[18,46],[38,46],[40+walk,67],[16+walk,67]],c.white);
 poly([[25,50],[31,50],[33+walk,67],[23+walk,67]],'#1c1830');line(16+walk,67,24+walk,52,c.gold);line(40+walk,67,32+walk,52,c.gold);line(15+walk,67,41+walk,67,c.gold);
 for(const [x,yy]of [[18,60],[38,58]]){r.rect(x+walk,yy,2,3,c.crimson);put(x+walk,yy,'#ff7a8a');}
 poly(shift([[20,38],[36,38],[37,50],[19,50]],y),c.whiteShade);poly(shift([[21,39],[35,39],[36,49],[20,49]],y),c.white);line(28,39+y,28,49,c.gold);
 // Dark jewelled sash with a red stone.
 rect(19,47,18,3,'#1c1830');rect(19,47,18,1,c.gold);rect(26,47,4,3,c.crimson);put(27,47,'#ff7a8a');
 // Gold mantle fanning over the shoulders.
 poly(shift([[15,44],[18,38],[24,36],[25,42],[20,46]],y),c.goldDark);poly(shift([[16,43],[19,38],[24,37],[24,41],[20,44]],y),c.gold);
 poly(shift([[41,44],[38,38],[32,36],[31,42],[36,46]],y),c.goldDark);poly(shift([[40,43],[37,38],[32,37],[32,41],[36,44]],y),c.gold);
 for(const x of [18,21,35,38])line(x,39+y,x+(x<28?1:-1),43+y,c.goldLight);
 rect(25,36+y,6,2,c.white);line(25,37+y,30,37+y,c.gold);
}
function emperorHat(r,y){
 const {poly,rect,put,line}=r;
 poly(shift([[19,14],[21,6],[35,6],[37,14]],y),c.whiteShade);poly(shift([[20,13],[22,7],[34,7],[36,13]],y),c.white);
 rect(19,12+y,18,2,c.gold);line(22,9+y,34,9+y,c.gold);rect(26,8+y,4,4,c.crimson);put(27,8+y,'#ff8a9a');rect(29,13+y,1,4,'#3ac870');
}
function travelerBoy(r,{y,walk}){
 const {poly,line,rect,put}=r;
 trousers(r,walk,{color:'#8a9ab0',shade:'#5a6a80',light:'#a8b8cc',flare:1});boots(r,walk,{color:'#4a3428',light:'#6a5040'});
 // Cream shirt under a maroon vest, a lavender sash and a blue shawl over one shoulder.
 poly(shift([[20,38],[36,38],[37,53],[19,53]],y),'#d8ccb0');poly(shift([[21,39],[35,39],[36,52],[20,52]],y),'#f0e8d4');
 poly(shift([[20,39],[26,39],[25,52],[19,52]],y),'#5a1a24');poly(shift([[30,39],[36,39],[37,52],[31,52]],y),'#5a1a24');
 poly(shift([[21,40],[25,40],[24,51],[20,51]],y),'#7a2a34');poly(shift([[31,40],[35,40],[36,51],[32,51]],y),'#7a2a34');
 for(const yy of [43,47])put(25,yy+y,c.gold);
 rect(19,49,18,3,'#b8a0d8');rect(19,49,18,1,'#d8c8f0');poly([[33,50],[37,50],[38,58],[35,56]],'#b8a0d8');
 poly(shift([[18,38],[24,37],[27,41],[22,44],[18,44]],y),'#3a4a8a');poly(shift([[19,38],[23,38],[25,41],[21,43],[19,43]],y),'#5a6aaa');line(19,42+y,23,43+y,'#d8b048');
}
function casualBoy(r,{y,walk}){
 const {poly,line,rect}=r;
 trousers(r,walk,{color:'#e8e4dc',shade:'#b8b4ac'});boots(r,walk,{color:'#2a2430',light:'#4a4250'});
 poly(shift([[20,37],[36,37],[37,53],[19,53]],y),'#3a2458');poly(shift([[21,38],[35,38],[36,52],[20,52]],y),'#5a3a80');
 rect(24,36+y,8,3,'#5a3a80');line(24,36+y,31,36+y,'#7a5aa0');line(28,40+y,28,52,'#3a2458');for(const yy of [42,46,50])r.put(29,yy+(yy<46?y:0),'#e8e4dc');
 rect(19,51,18,2,'#2a2430');rect(26,51,3,2,'#c8c4cc');
}
function pajamaBoy(r,{y,walk}){
 const {poly,line,rect,put}=r,P='#2a3a6a',PS='#1a2448',PL='#4a5a8a';
 trousers(r,walk,{color:P,shade:PS,light:PL});for(const [x,d]of [[22,-walk],[30,walk]]){W(r,x+d,65,5,1,'#e8e4dc');W(r,x+d-1,67,7,4,'#6a4a3a');W(r,x+d,67,4,1,'#8a6a5a');}
 poly(shift([[20,38],[36,38],[37,53],[19,53]],y),PS);poly(shift([[21,39],[35,39],[36,52],[20,52]],y),P);
 poly(shift([[24,38],[28,42],[32,38]],y),SKIN.base);line(24,38+y,28,43+y,'#e8e4dc');line(32,38+y,28,43+y,'#e8e4dc');line(28,43+y,28,52,'#e8e4dc');
 for(let yy=44;yy<52;yy+=3)for(let x=21;x<36;x+=4)put(x+(yy%2),yy+(yy<46?y:0),PL);
}
function swimBoy(r,{y,walk}){
 const {poly,line,rect}=r;
 for(const [x,d]of [[22,-walk],[30,walk]]){W(r,x+d,56,5,11,SKIN.base);W(r,x+d+4,56,1,11,SKIN.shade);W(r,x+d-1,67,7,2,'#3a2a20');W(r,x+d+1,66,3,1,'#5a4030');}
 poly([[19,50],[37,50],[38,58],[29,58],[28,55],[27,58],[18,58]],'#1a1424');poly([[20,51],[36,51],[37,57],[29,57],[28,54],[27,57],[19,57]],'#2a2040');line(19,55,27,55,'#9a6ad8');line(29,55,37,55,'#9a6ad8');
 poly(shift([[21,38],[35,38],[34,50],[22,50]],y),SKIN.shade);poly(shift([[22,39],[34,39],[33,49],[23,49]],y),SKIN.base);line(28,42+y,28,48,SKIN.shade);
 // An open white shirt over his shoulders.
 poly(shift([[18,38],[24,37],[24,52],[18,53]],y),'#d8d4dc');poly(shift([[19,39],[23,38],[23,51],[19,52]],y),'#f4f2f8');
 poly(shift([[38,38],[32,37],[32,52],[38,53]],y),'#d8d4dc');poly(shift([[37,39],[33,38],[33,51],[37,52]],y),'#f4f2f8');
}
const LELOUCH_LOOKS={
 default:{body:zeroBody,cape:true,helmet:true,sleeve:c.zero,light:c.zeroLight,cuff:c.gold,glove:'#2a2236'},
 school:{body:schoolBoy,sleeve:'#1c1a2a',light:'#3a3850',cuff:c.gold},
 emperor:{body:emperorBody,hat:true,sleeve:c.white,light:'#ffffff',cuff:c.gold,sword:true},
 traveler:{body:travelerBoy,sleeve:'#f0e8d4',light:'#ffffff',cuff:'#d8ccb0'},
 casual:{body:casualBoy,sleeve:'#5a3a80',light:'#7a5aa0',cuff:'#3a2458',prop:'king'},
 pajamas:{body:pajamaBoy,sleeve:'#2a3a6a',light:'#4a5a8a',cuff:'#e8e4dc'},
 swimsuit:{body:swimBoy,sleeve:'#f4f2f8',light:'#ffffff',cuff:null},
};
export const LELOUCH_LOOK_IDS=Object.keys(LELOUCH_LOOKS);
function lelouchArms(r,{y,walk,cast},L){
 const glove=L.glove?{hand:L.glove,handShade:'#14101c'}:{};
 // Viewer-left arm at his side (holding the sword or chess piece); the right one points the
 // command when he casts, the classic outstretched Zero gesture.
 const lx=15-walk*.3;limb(r,20,40+y,lx,51,{color:L.sleeve,light:L.light,width:4,...glove});if(L.cuff)W(r,lx-1,51,5,2,L.cuff);
 if(L.sword)sword(r,lx+1,50);else if(L.prop==='king')chessKing(r,lx,52);
 if(cast){limb(r,36,40+y,46,33,{color:L.sleeve,light:L.light,width:4,...glove});if(L.cuff)W(r,44,35,4,2,L.cuff);}
 else{limb(r,36,40+y,41+walk*.3,51,{color:L.sleeve,light:L.light,width:4,...glove});if(L.cuff)W(r,39+walk*.3,51,5,2,L.cuff);}
}
export function lelouchPixels({frame=0,moving=false,pose='',attack=false,expression='neutral',blink=false,skin='default'}={}){
 const L=LELOUCH_LOOKS[skin]||LELOUCH_LOOKS.default,mo=motion({frame,moving}),cast=attack||!!pose;
 const m={y:mo.y,walk:mo.walk,blink,expression,cast};const r=canvas();
 if(L.cape)zeroCape(r,m);
 if(!L.helmet)lelouchHairBack(r,m.y);
 L.body(r,m);lelouchArms(r,m,L);
 if(L.helmet){zeroCollar(r,m.y);zeroHelmet(r,m);}
 else{face(r,m,{iris:c.iris,irisDark:c.irisDark,geass:cast});lelouchFringe(r,m.y);if(L.hat)emperorHat(r,m.y);}
 return selout(r.pixels,INK);
}

// ---------- C.C. outfits ----------
function straitjacket(r,{y,walk}){
 const {poly,line,rect,put}=r,S=c.strap;
 // White bodysuit legs that flare at the ankle, strapped at the thigh.
 for(const [x,d]of [[22,-walk],[30,walk]]){W(r,x+d,52,5,17,c.white);W(r,x+d+4,52,1,17,c.whiteShade);W(r,x+d-1,64,7,5,c.white);W(r,x+d+5,64,1,5,c.whiteShade);W(r,x+d-1,56,7,2,S);put(x+d+2,56,'#8a8a9a');W(r,x+d-1,69,7,2,'#d8d4dc');W(r,x+d-1,70,7,1,'#8a8690');}
 poly(shift([[20,38],[36,38],[37,53],[19,53]],y),c.whiteShade);poly(shift([[21,39],[35,39],[36,52],[20,52]],y),c.white);
 // Dark straps across the chest and waist with silver buckles, and a high collar.
 for(const yy of [42,49]){rect(19,yy+(yy<46?y:0),18,2,S);rect(30,yy+(yy<46?y:0),2,2,'#a8a8b8');}
 line(24,39+y,24,52,c.whiteShade);line(32,39+y,32,52,c.whiteShade);rect(24,35+y,8,4,c.white);line(24,38+y,31,38+y,c.whiteShade);
 rect(19,52,4,7,S);put(20,55,'#a8a8b8');
}
function bellSleeve(r,x0,y0,x1,y1,{y,cast},color,shade,band,raised=false){
 // Wide sleeves that bell out below the elbow: hanging down, or opening forward when raised.
 r.line(x0,y0+y,x1,y1,color,4);
 if(raised){r.poly([[x1,y1-2],[x1,y1+4],[x1+7,y1+7],[x1+7,y1-4]],shade);r.poly([[x1+1,y1-1],[x1+1,y1+3],[x1+6,y1+5],[x1+6,y1-2]],color);if(band)r.rect(x1+5,y1-3,2,9,band);return;}
 r.poly([[x1-1,y1],[x1+4,y1],[x1+6,y1+10],[x1-3,y1+10]],shade);r.poly([[x1,y1+1],[x1+3,y1+1],[x1+5,y1+9],[x1-2,y1+9]],color);r.line(x1+1,y1+2,x1,y1+8,mix(color,'#ffffff',.4));
 if(band)r.rect(x1-3,y1+8,9,2,band);r.rect(x1,y1+10,3,2,SKIN.base);
}
function ccSchool(r,{y,walk}){
 const {poly,line,rect,put}=r;
 // Bare legs, navy knee socks and black loafers.
 for(const [x,d]of [[22,-walk],[30,walk]]){W(r,x+d,56,5,6,SKIN.base);W(r,x+d+4,56,1,6,SKIN.shade);W(r,x+d,61,5,6,c.navy);W(r,x+d+4,61,1,6,'#1a2448');W(r,x+d+1,62,1,4,'#4a5a8a');W(r,x+d-1,67,7,4,'#14121a');W(r,x+d,67,4,1,'#4a4452');}
 poly([[20,50],[36,50],[40+walk,58],[16+walk,58]],'#0e0c14');poly([[21,50],[35,50],[39+walk,57],[17+walk,57]],c.black);for(const k of [-.5,0,.5])line(28+Math.round(k*8),51,28+Math.round(k*16)+walk,57,c.blackLight);
 poly(shift([[19,38],[37,38],[38,53],[18,53]],y),c.blazerShade);poly(shift([[20,39],[36,39],[37,52],[19,52]],y),c.blazer);
 // Lapels over a white shirt and green tie, two rows of buttons and the belt.
 poly(shift([[24,38],[28,44],[32,38]],y),'#f4f2ee');rect(27,40+y,2,4,'#3a8a58');put(27,40+y,'#5ab878');
 line(24,38+y,28,45+y,c.blazerShade);line(32,38+y,28,45+y,c.blazerShade);for(const yy of [44,47])for(const x of [24,32])put(x,yy+(yy<46?y:0),c.goldDark);
 rect(18,49,20,2,c.blazerShade);rect(26,49,4,2,'#f0e8b0');line(21,40+y,22,48,mix(c.blazer,'#ffffff',.35));
}
function ccGothic(r,{y,walk}){
 const {poly,line,rect,put}=r;
 // Black thigh-highs into white slouched leg warmers and black shoes.
 for(const [x,d]of [[22,-walk],[30,walk]]){W(r,x+d,58,5,6,'#1a1620');W(r,x+d+1,58,1,5,'#3a3446');W(r,x+d-1,62,7,6,'#f4f2ee');W(r,x+d+5,62,1,6,c.whiteShade);for(const yy of [63,65])W(r,x+d-1,yy,7,1,c.whiteShade);W(r,x+d-1,68,7,3,'#14121a');W(r,x+d-1,70,7,1,'#000000');}
 // White underskirt peeking below the red skirt.
 poly([[19,50],[37,50],[42+walk,60],[14+walk,60]],c.whiteShade);for(let x=14+walk;x<42+walk;x+=3)rect(x,59,2,2,c.white);
 poly([[20,49],[36,49],[41+walk,58],[15+walk,58]],c.crimsonShade);poly([[21,49],[35,49],[40+walk,57],[16+walk,57]],c.crimson);for(const k of [-.6,0,.6])line(28+Math.round(k*8),50,28+Math.round(k*20)+walk,56,'#c83a52');
 // White blouse with a black lace-up corset, a black bow and a choker.
 poly(shift([[20,38],[36,38],[37,50],[19,50]],y),c.whiteShade);poly(shift([[21,39],[35,39],[36,49],[20,49]],y),c.white);
 poly(shift([[21,42],[35,42],[35,50],[21,50]],y),'#14121a');for(let yy=43;yy<49;yy+=2){put(26,yy+y,c.whiteShade);put(30,yy+y,c.whiteShade);line(27,yy+y,29,yy+1+y,'#5a5468');}
 poly(shift([[23,39],[28,41],[23,43]],y),'#14121a');poly(shift([[33,39],[28,41],[33,43]],y),'#14121a');rect(27,40+y,2,2,'#2a2632');
 rect(25,36+y,6,1,'#14121a');put(28,37+y,c.crimson);
}
function ccGothicHat(r,y){const {rect,put,line}=r;rect(30,9+y,8,4,c.crimson);rect(29,12+y,10,1,c.crimsonShade);line(31,10+y,37,10+y,'#c83a52');rect(32,8+y,3,1,'#14121a');put(36,13+y,'#14121a');}
function ccTraveler(r,{y,walk}){
 const {poly,line,rect,put}=r,O='#e8a070',OS='#b8704a',RT='#8a2a24',RL='#c84a3a';
 // White stockings to the thigh and brown laced boots.
 for(const [x,d]of [[22,-walk],[30,walk]]){W(r,x+d,55,5,2,SKIN.base);W(r,x+d,57,5,7,c.white);W(r,x+d+4,57,1,7,c.whiteShade);W(r,x+d-1,63,7,8,'#7a4a30');W(r,x+d,63,1,7,'#9a6a48');for(let yy=64;yy<69;yy+=2)W(r,x+d+2,yy,2,1,'#e8d8b8');W(r,x+d-1,70,7,1,'#3a2018');}
 poly([[20,51],[36,51],[37,56],[19,56]],'#1a1e2a');poly([[21,51],[35,51],[36,55],[20,55]],'#2a3040');
 // The cream drape falls from the belt down one side.
 poly([[18,49],[26,49],[24+walk,64],[19+walk,66],[14+walk,60]],'#d8d0a8');poly([[19,50],[25,50],[23+walk,63],[19+walk,64],[16+walk,60]],'#f0e8c8');line(21,52,18+walk,62,'#d8d0a8');
 poly(shift([[19,38],[37,38],[38,52],[18,52]],y),OS);poly(shift([[20,39],[36,39],[37,51],[19,51]],y),O);
 // White shirt collar in the V, and the red patterned trim down both front edges.
 poly(shift([[24,38],[28,45],[32,38]],y),'#f8f6f0');line(25,38+y,27,44+y,'#d8d4cc');
 for(const x of [22,33]){rect(x,39+y,2,12,RT);for(let yy=40;yy<50;yy+=3)put(x+(yy%2),yy+(yy<46?y:0),RL);}
 rect(18,48,20,3,'#5a3420');rect(18,48,20,1,'#7a4a30');rect(30,48,3,3,'#8ab8c8');put(31,49,'#d8f0f8');
 put(24,36+y,'#5a2a2a');rect(25,36+y,6,1,'#5a2a2a');
}
function ccHeadscarf(r,y){
 // A yellow kerchief tied over the crown, its edge banded in red, knotted at the back.
 const {poly,line,put}=r;poly(shift([[16,20],[18,13],[22,10],[34,10],[38,13],[40,20],[37,17],[28,15],[19,17]],y),'#c8a040');poly(shift([[17,19],[19,13],[23,11],[33,11],[37,13],[39,19],[36,16],[28,14],[20,16]],y),'#e8c868');
 line(17,19+y,20,16+y,RTC);line(20,16+y,28,15+y,RTC);line(28,15+y,36,16+y,RTC);line(36,16+y,39,19+y,RTC);put(24,12+y,'#f8e8a8');put(31,12+y,'#f8e8a8');poly(shift([[39,15],[43,17],[41,21]],y),'#c8a040');
}
const RTC='#8a2a24';
function ccCasual(r,{y,walk}){
 const {poly,line,rect,put}=r;
 for(const [x,d]of [[22,-walk],[30,walk]]){W(r,x+d,60,5,7,'#2a2632');W(r,x+d+4,60,1,7,'#14121a');W(r,x+d-1,67,7,4,'#6a4030');W(r,x+d,67,4,1,'#8a5a44');}
 poly([[20,48],[36,48],[40+walk,62],[16+walk,62]],'#3a6a3a');poly([[21,48],[35,48],[39+walk,61],[17+walk,61]],'#5a9a50');for(const k of [-.5,0,.5])line(28+Math.round(k*8),50,28+Math.round(k*18)+walk,60,'#7ab868');
 poly(shift([[20,38],[36,38],[36,49],[20,49]],y),'#d8d4dc');poly(shift([[21,39],[35,39],[35,48],[21,48]],y),'#f8f6fa');
 poly(shift([[24,38],[28,42],[32,38]],y),SKIN.base);line(24,38+y,28,42+y,'#d8d4dc');line(32,38+y,28,42+y,'#d8d4dc');rect(20,47,16,2,'#3a6a3a');
}
function ccPajamas(r,{y,walk}){
 const {poly,line,rect,put}=r;
 // Lelouch's oversized dress shirt, sleeves rolled, worn as a nightshirt over bare legs.
 for(const [x,d]of [[22,-walk],[30,walk]]){W(r,x+d,54,5,13,SKIN.base);W(r,x+d+4,54,1,13,SKIN.shade);W(r,x+d-1,67,7,3,'#f0c8d8');W(r,x+d,67,4,1,'#ffe0ea');W(r,x+d-1,69,7,1,'#c898a8');}
 poly(shift([[19,38],[37,38],[39,57],[17,57]],y),c.whiteShade);poly(shift([[20,39],[36,39],[38,56],[18,56]],y),'#ffffff');
 poly(shift([[23,38],[28,42],[33,38]],y),SKIN.base);line(23,38+y,28,43+y,c.whiteShade);line(33,38+y,28,43+y,c.whiteShade);line(28,43+y,28,56,c.whiteShade);for(const yy of [46,50,54])put(29,yy,'#c8c4cc');
 poly([[17,56],[23,54],[28,57],[33,54],[39,56]],c.whiteShade);
}
function ccSwim(r,{y,walk}){
 const {poly,line,rect,put}=r;
 for(const [x,d]of [[22,-walk],[30,walk]]){W(r,x+d,52,5,15,SKIN.base);W(r,x+d+4,52,1,15,SKIN.shade);W(r,x+d-1,67,7,2,'#e8c060');W(r,x+d+1,66,3,1,'#c89a40');}
 poly(shift([[21,38],[35,38],[34,50],[22,50]],y),SKIN.shade);poly(shift([[22,39],[34,39],[33,49],[23,49]],y),SKIN.base);
 // A white one-piece with lime trim and a cutout at the waist.
 poly(shift([[21,41],[35,41],[35,47],[21,47]],y),c.whiteShade);poly(shift([[22,41],[34,41],[34,46],[22,46]],y),c.white);line(22,41+y,34,41+y,c.green);
 poly([[21,48],[35,48],[35,51],[31,56],[25,56],[21,51]],c.whiteShade);poly([[22,48],[34,48],[34,51],[30,55],[26,55],[22,51]],c.white);line(25,55,31,55,c.green);
 rect(26,46+y,4,2,SKIN.base);line(24,38+y,24,41+y,c.white);line(32,38+y,32,41+y,c.white);
}
const CC_LOOKS={
 default:{body:straitjacket,sleeve:c.white,shade:c.whiteShade,band:c.strap,bell:true},
 school:{body:ccSchool,sleeve:c.blazer,shade:c.blazerShade,band:null,top:(r,m)=>{r.rect(37,13+m.y,4,3,'#ffffff');r.rect(40,12+m.y,2,5,'#ffffff');r.put(38,14+m.y,c.whiteShade);}},
 emperor:{body:ccGothic,sleeve:c.white,shade:c.whiteShade,band:'#14121a',bell:true,tails:true,gun:true,top:(r,m)=>ccGothicHat(r,m.y)},
 traveler:{body:ccTraveler,sleeve:'#e8a070',shade:'#b8704a',band:'#8a2a24',bell:true,top:(r,m)=>ccHeadscarf(r,m.y)},
 casual:{body:ccCasual,sleeve:'#f8f6fa',shade:'#d8d4dc',band:'#3a6a3a',plush:true},
 pajamas:{body:ccPajamas,sleeve:'#ffffff',shade:c.whiteShade,band:null,plush:true,loose:true},
 swimsuit:{body:ccSwim,sleeve:SKIN.base,shade:SKIN.shade,band:null,bare:true,top:(r,m)=>{r.rect(37,14+m.y,3,3,'#ffffff');r.put(38,15+m.y,c.green);}},
};
export const CC_LOOK_IDS=Object.keys(CC_LOOKS);
function ccArms(r,m,L){
 const {y,walk,cast}=m,w=L.bare?3:4;
 // Viewer-left arm hangs down (or hugs Cheese-kun); the right holds the pistol, raised to aim
 // when she fires. Outside the gothic dress she only draws it to shoot.
 if(L.plush&&!cast){limb(r,20,40+y,24,46,{color:L.sleeve,light:mix(L.sleeve,'#ffffff',.3),width:w});cheesekun(r,21,44);}
 else if(L.bell)bellSleeve(r,20,40,15-walk*.3,46,m,L.sleeve,L.shade,L.band);
 else{limb(r,20,40+y,15-walk*.3,51,{color:L.sleeve,light:mix(L.sleeve,'#ffffff',.3),width:w});if(L.band)W(r,14-walk*.3,51,5,2,L.band);}
 if(cast){if(L.bell){bellSleeve(r,36,40,41,37,m,L.sleeve,L.shade,L.band,true);}else limb(r,36,40+y,43,37,{color:L.sleeve,light:mix(L.sleeve,'#ffffff',.3),width:w});pistol(r,L.bell?47:44,36,{aim:true});}
 else{if(L.bell)bellSleeve(r,36,40,38+walk*.3,46,m,L.sleeve,L.shade,L.band);else{limb(r,36,40+y,41+walk*.3,51,{color:L.sleeve,light:mix(L.sleeve,'#ffffff',.3),width:w});if(L.band)W(r,39+walk*.3,51,5,2,L.band);}
  if(L.gun)pistol(r,L.bell?39+walk*.3:41+walk*.3,L.bell?57:53);}
}
export function ccPixels({frame=0,moving=false,pose='',attack=false,expression='neutral',blink=false,skin='default'}={}){
 const L=CC_LOOKS[skin]||CC_LOOKS.default,mo=motion({frame,moving}),cast=attack||!!pose;
 const m={y:mo.y,walk:mo.walk,blink,expression,cast};const r=canvas();
 if(L.tails)ccTwinTails(r,m);else ccHairBack(r,m,L.loose?60:64);
 L.body(r,m);ccArms(r,m,L);
 face(r,m,{iris:c.amber,irisDark:c.amberDark,lids:true});
 ccFringe(r,m.y,{locks:!L.tails});
 if(L.top)L.top(r,m);
 return selout(r.pixels,INK);
}

// ---------- The Gawain ----------
// The black-and-gold knightmare on the same 56×76 grid, drawn larger in game: a small horned
// head with orange eye slits, huge layered pauldrons housing the Hadron Cannons, crimson
// float-system spikes fanned behind it, clawed slash-harken hands and pointed knees.
const GW={dark:'#14101e',mid:'#26203a',light:'#40385a',gold:'#d8b048',goldDark:'#8a6a24',goldLight:'#f4dc88',eye:'#ff8a2a',eyeLight:'#ffd08a',spike:'#6a1020',spikeLight:'#a8203a'};
export function gawainPixels({frame=0,firing=false}={}){
 const r=canvas(),{poly,line,rect,put}=r,b=frame%2;
 // Float-system spikes behind the shoulders.
 for(const [x0,y0,x1,y1]of [[20,22,2,2],[22,20,9,0],[36,22,54,2],[34,20,47,0],[18,26,0,14],[38,26,56,14]]){line(x0,y0,x1,y1+b,GW.spike,2);line(x0,y0,x1,y1+b,GW.spikeLight);}
 // Legs: thighs, pointed knee guards, shins and clawed feet.
 for(const [x,s]of [[20,-1],[31,1]]){poly([[x,44],[x+6,44],[x+6,58],[x,58]],GW.mid);line(x+5,45,x+5,57,GW.dark);poly([[x-1,55],[x+3,51],[x+7,55],[x+3,60]],GW.gold);put(x+3,54,GW.eye);
  poly([[x,60],[x+6,60],[x+7,70],[x-1,70]],GW.mid);line(x,61,x,69,GW.light);poly([[x-2,70],[x+8,70],[x+9+s,73],[x-3+s,73]],GW.dark);line(x-2,71,x+8,71,GW.goldDark);}
 // Waist and skirt plates.
 poly([[19,38],[37,38],[38,46],[33,48],[23,48],[18,46]],GW.dark);poly([[20,39],[36,39],[36,45],[32,46],[24,46],[20,45]],GW.mid);line(20,44,36,44,GW.gold);rect(26,40,4,3,GW.eye);put(27,40,GW.eyeLight);
 // Torso.
 poly([[17,20],[39,20],[38,38],[18,38]],GW.dark);poly([[18,21],[38,21],[37,37],[19,37]],GW.mid);poly([[22,23],[34,23],[32,33],[24,33]],GW.light);line(28,22,28,36,GW.gold);line(22,23,24,33,GW.goldDark);line(34,23,32,33,GW.goldDark);
 // Arms ending in long gold slash-harken claws.
 for(const [x,s]of [[8,-1],[44,1]]){poly([[x,26],[x+5,26],[x+5+s,44],[x+s,44]],GW.dark);poly([[x+1,27],[x+4,27],[x+4+s,43],[x+1+s,43]],GW.mid);rect(x+s-1,43,7,3,GW.goldDark);
  for(let i=0;i<4;i++)line(x+s+i*2-1,46,x+s+i*2-1+s,51+(i%2),GW.gold);}
 // Pauldrons: layered and pointed, gold-edged, their Hadron ports glowing when firing.
 for(const s of [-1,1]){const cx=28+s*15;poly([[cx-s*6,16],[cx+s*8,13],[cx+s*12,22],[cx+s*9,30],[cx-s*4,28]],GW.dark);poly([[cx-s*5,17],[cx+s*7,15],[cx+s*10,22],[cx+s*8,28],[cx-s*3,26]],GW.mid);
  line(cx-s*5,17,cx+s*7,15,GW.gold);line(cx+s*7,15,cx+s*10,22,GW.gold);poly([[cx+s*9,10],[cx+s*13,8],[cx+s*12,16]],GW.goldDark);
  rect(cx-1,19,3,3,firing?'#ff4a6a':GW.spikeLight);if(firing){put(cx,20,'#ffd0d8');}}
 // Head: horned gold crest, dark helm, orange slit eyes.
 poly([[22,10],[19,2],[25,8],[28,4],[31,8],[37,2],[34,10]],GW.goldDark);poly([[23,9],[21,4],[25,9],[28,6],[31,9],[35,4],[33,9]],GW.gold);
 poly([[23,10],[33,10],[34,17],[31,21],[25,21],[22,17]],GW.dark);poly([[24,11],[32,11],[33,16],[30,20],[26,20],[23,16]],GW.mid);
 line(24,14,27,14,GW.eye);line(29,14,32,14,GW.eye);put(25,14,GW.eyeLight);put(30,14,GW.eyeLight);line(28,11,28,13,GW.gold);rect(26,18,4,1,GW.light);
 return selout(r.pixels,'#08060c');
}
