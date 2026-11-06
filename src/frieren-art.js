import {canvas,motion,limb,selout,mix,SKIN} from './hero-kit.js';
// Frieren: silver twin tails tied high behind the head, long elf ears with red drop
// earrings and a calm half-lidded green gaze. The Elven Mage outfit is the white
// capelet trimmed in gold over a black-and-white striped shirt, a black belt, a white
// gold-banded skirt, black tights and brown boots; the maid outfit swaps it for a black
// dress, a frilled white apron, white tights and Mary Janes. Both carry her staff: a
// long red shaft under a golden crescent that cradles a red orb.
export const FRIEREN_ART={ink:'#2a2f3c',hair:'#e4e6ee',hairShade:'#a9adc0',hairMid:'#c8ccda',hairLight:'#ffffff',iris:'#5f9a7e',irisDark:'#2f5a4a',gold:'#c9a24e',goldDark:'#8c6c30',goldLight:'#efd28a',white:'#f4f1e8',whiteShade:'#cfc8b8',tights:'#262a38',boot:'#8a5a38',maid:'#2a2f3d',staff:'#8a2a2e',orb:'#c8283a'};
const c=FRIEREN_ART,INK=c.ink;
const shift=(pts,y)=>pts.map(([x,yy])=>[x,yy+y]);

function tails(r,{y,walk},frill){
 const {poly,line,rect,put}=r;
 for(const [x0,side]of [[17,-1],[39,1]]){const s=walk*side*.8;
  const outer=[[x0,11+y],[x0+side*4,12+y],[x0+side*9,21+y],[x0+side*12+s,35],[x0+side*11+s,49],[x0+side*8+s,60],[x0+side*6+s,57],[x0+side*7+s,45],[x0+side*6,31],[x0+side,19+y]];
  poly(outer,c.hairShade);
  poly([[x0,13+y],[x0+side*3,14+y],[x0+side*8,22+y],[x0+side*10+s,35],[x0+side*10+s,48],[x0+side*8+s,56],[x0+side*7+s,46],[x0+side*6,32],[x0+side,20+y]],c.hair);
  line(x0+side*4,16+y,x0+side*9+s,34,c.hairLight);line(x0+side*9+s,38,x0+side*9+s,50,c.hairMid);line(x0+side*6,26,x0+side*7+s,44,c.hairMid);
  if(frill){for(const [dx,dy]of [[0,0],[side*2,-1],[side*3,1],[side,2]])rect(x0+dx-1,11+dy+y,3,3,'#ffffff');put(x0+side,12+y,'#d8dce6');}
 }
}
function ears(r,y){
 const {poly,line,rect}=r;
 // Long elf ears reaching well past the hair, each with a red drop earring.
 poly([[19,25+y],[8,22+y],[11,26+y],[19,30+y]],SKIN.shade);poly([[19,26+y],[10,23+y],[12,26+y],[19,29+y]],SKIN.base);line(12,25+y,17,27+y,SKIN.deep);
 poly([[37,25+y],[48,22+y],[45,26+y],[37,30+y]],SKIN.shade);poly([[37,26+y],[46,23+y],[44,26+y],[37,29+y]],SKIN.base);line(39,27+y,44,25+y,SKIN.deep);
 for(const x of [17,38]){rect(x,30+y,1,1,c.goldLight);rect(x,31+y,1,3,c.orb);rect(x,32+y,1,1,'#f07a84');}
}
function face(r,{y,blink,expression,cast}){
 const {rect,poly,line,put}=r,hurt=expression==='hurt',focus=cast||expression==='focused'||expression==='ultimate';
 rect(25,36+y,6,4,SKIN.shade);
 poly(shift([[18,20],[38,20],[38,29],[36,34],[31,38],[25,38],[20,34],[18,29]],y),SKIN.shade);
 poly(shift([[19,20],[37,20],[37,29],[35,33],[30,37],[26,37],[21,33],[19,29]],y),SKIN.base);
 rect(21,31+y,2,1,SKIN.light);rect(34,31+y,2,1,SKIN.light);
 // Calm, half-lidded eyes: a heavy upper lid over a short green iris.
 for(const [x,side]of [[21,-1],[31,1]]){
  if(blink){line(x,29+y,x+3,29+y,INK);put(side<0?x-1:x+4,28+y,INK);continue;}
  if(hurt){line(x,28+y,x+3,30+y,INK);line(x,30+y,x+3,28+y,INK);continue;}
  rect(x,28+y,4,3,'#f8f4ec');rect(x+(side<0?1:0),28+y,3,3,c.iris);rect(x+(side<0?1:0),28+y,3,1,c.irisDark);put(x+(side<0?2:1),29+y,c.irisDark);put(x+(side<0?1:0),29+y,'#cfe8d6');
  line(x-(side<0?1:0),27+y,x+3+(side>0?1:0),27+y,INK);line(x,26+y,x+3,26+y,mix(INK,SKIN.base,.55));
  if(focus)line(x+(side<0?0:1),25+y,x+(side<0?3:3),side<0?26+y:25+y,INK);
 }
 put(20,33+y,mix(SKIN.deep,SKIN.base,.55));put(35,33+y,mix(SKIN.deep,SKIN.base,.55));
 if(hurt){rect(27,34+y,3,2,'#8f4f5c');put(28,34+y,'#ffffff');}
 else if(expression==='ultimate'){rect(26,34+y,4,2,'#8f4655');rect(27,34+y,2,1,'#fff7f2');}
 else if(focus)rect(27,34+y,3,1,'#a26a6a');
 else{put(26,34+y,'#b07a78');rect(27,35+y,2,1,'#b07a78');put(29,34+y,'#b07a78');}
}
function fringe(r,y){
 const {poly,line}=r;
 // Centre-parted fringe in soft points, with long locks framing the cheeks.
 poly(shift([[16,30],[15,19],[19,12],[27,9],[35,11],[40,18],[41,30],[38,38],[37,25],[34,21],[31,25],[29,20],[28,22],[27,20],[25,25],[22,21],[19,26],[19,38]],y),c.hairShade);
 poly(shift([[17,28],[17,19],[20,14],[27,11],[34,13],[38,18],[39,27],[37,23],[34,19],[31,23],[28,18],[25,23],[22,19],[19,24],[18,31]],y),c.hair);
 line(20,16+y,26,12+y,c.hairLight);line(30,12+y,35,15+y,c.hairLight);line(28,13+y,28,18+y,c.hairMid);
 line(18,24+y,18,36+y,c.hair);line(38,24+y,38,36+y,c.hair);line(19,27+y,19,34+y,c.hairLight);line(37,26+y,37,33+y,c.hairMid);
}
// The staff: a long red shaft with gold fittings under a crescent cradling a red orb.
function staff(r,cast){
 const {line,rect,poly,put}=r,top=cast?[45,9]:[47,15],bottom=cast?[37,62]:[41,69];
 line(top[0],top[1]+6,bottom[0],bottom[1],'#4e1a1e',3);line(top[0]+1,top[1]+6,bottom[0]+1,bottom[1],c.staff,2);line(top[0]+1,top[1]+7,bottom[0]+1,bottom[1]-1,'#c0545a');
 rect(bottom[0]-1,bottom[1]-2,4,3,c.gold);rect(bottom[0]-1,bottom[1]-2,4,1,c.goldLight);
 const [x,y]=top;rect(x-1,y+5,4,3,c.gold);line(x-1,y+8,x+2,y+8,c.goldDark);
 // Red ribbon tied below the head.
 line(x+2,y+7,x+5,y+12,c.orb);line(x+3,y+7,x+6,y+11,'#e04a58');
 // Crescent: a gold ring open on its outer side, its horns curling around the red orb.
 for(let i=0;i<=28;i++){const t=Math.PI*(.32+1.36*i/28)+Math.PI/2,px=x+Math.cos(t)*5,py=y-1+Math.sin(t)*5;rect(px-.5,py-.5,2,2,c.goldDark);}
 for(let i=0;i<=28;i++){const t=Math.PI*(.32+1.36*i/28)+Math.PI/2,px=x+Math.cos(t)*4.6,py=y-1+Math.sin(t)*4.6;put(px,py,i<14?c.goldLight:c.gold);}
 rect(x-2,y-3,4,4,c.goldDark);rect(x-1,y-3,3,3,c.orb);put(x-1,y-3,'#ff9aa4');put(x+1,y-1,'#7a1018');line(x,y+1,x,y+4,c.gold);
}
function mageBody(r,{y,walk}){
 const {rect,poly,line,put}=r,W=c.white,WS=c.whiteShade,G=c.gold,GD=c.goldDark;
 // Black tights and folded brown boots.
 for(const [x,d]of [[22,-walk],[30,walk]]){rect(x+d,55,5,10,c.tights);rect(x+d+1,56,1,7,'#3c4152');
  rect(x+d-1,62,7,9,c.boot);rect(x+d,62,1,8,'#b07a50');rect(x+d-1,62,7,2,'#a06a44');rect(x+d-1,64,7,1,'#6a4228');rect(x+d-1,70,7,1,'#4a2c1a');}
 // White skirt flaring to the knee, banded twice in gold at the hem.
 poly([[21,47],[35,47],[40+walk,59],[16+walk,59]],WS);poly([[22,47],[34,47],[38+walk,58],[18+walk,58]],W);
 for(const k of [-.5,0,.5])line(28+Math.round(k*8),49,28+Math.round(k*18)+walk,57,WS);
 line(16+walk,58,40+walk,58,GD);line(17+walk,57,39+walk,57,G);line(18+walk,55,38+walk,55,G);
 // White coat bodice over the striped shirt, cinched by a black belt with a silver buckle.
 poly(shift([[20,38],[36,38],[35,49],[21,49]],y),WS);poly(shift([[21,39],[35,39],[34,48],[22,48]],y),W);
 for(let yy=40;yy<47;yy++)rect(26,yy+y,5,1,yy%2?'#2a2e3a':'#eceef2');line(25,40+y,25,47+y,G);line(31,40+y,31,47+y,G);
 rect(20,46,16,3,'#1e2028');rect(20,46,16,1,'#3a3e4a');rect(26,46,4,3,'#c8ccd4');put(27,47,'#1e2028');
}
function capelet(r,{y}){
 const {poly,line,rect,put}=r,W=c.white,WS=c.whiteShade,G=c.gold,GD=c.goldDark;
 // A short white capelet over both shoulders, open at the front and edged in two gold bands.
 poly(shift([[15,44],[16,39],[22,36],[34,36],[40,39],[41,44],[36,46],[31,42],[25,42],[20,46]],y),GD);
 poly(shift([[16,43],[17,39],[22,37],[34,37],[39,39],[40,43],[36,44],[31,41],[25,41],[20,44]],y),W);
 line(16,43+y,20,45+y,G);line(36,44+y,40,42+y,G);line(17,41+y,22,43+y,G);line(34,43+y,39,41+y,G);line(20,38+y,23,37+y,'#ffffff');
 // High collar with a red gem clasp.
 rect(24,36+y,8,2,W);rect(24,37+y,8,1,G);rect(27,36+y,2,2,c.orb);put(27,36+y,'#ff9aa4');
}
function maidBody(r,{y,walk}){
 const {rect,poly,line,put}=r,K=c.maid,KS='#1a1e28',KL='#454c5e',A='#fbfaf6',AS='#d6d8e0';
 // White tights and black Mary Janes.
 for(const [x,d]of [[22,-walk],[30,walk]]){rect(x+d,58,5,10,'#eef0f4');rect(x+d+3,58,1,9,'#c8ccd6');
  rect(x+d-1,67,7,4,'#1c1e26');rect(x+d,67,4,1,'#3a3e4c');rect(x+d,68,5,1,'#3a3e4c');rect(x+d-1,70,7,1,'#0e1016');}
 // Long black skirt over white petticoat ruffles.
 poly([[20,47],[36,47],[42+walk,63],[14+walk,63]],AS);for(let x=14+walk;x<42+walk;x+=3){rect(x,62,3,2,A);put(x+2,63,AS);}
 poly([[20,47],[36,47],[41+walk,61],[15+walk,61]],KS);poly([[21,47],[35,47],[40+walk,60],[16+walk,60]],K);
 for(const k of [-.6,0,.6])line(28+Math.round(k*8),49,28+Math.round(k*20)+walk,59,KL);
 // Black bodice with buttons and a white turned-down collar.
 poly(shift([[20,38],[36,38],[35,49],[21,49]],y),KS);poly(shift([[21,39],[35,39],[34,48],[22,48]],y),K);
 for(const yy of [41,44])put(28,yy+y,'#8a90a0');
 poly(shift([[23,37],[28,40],[33,37],[31,37],[28,39],[25,37]],y),A);rect(24,37+y,8,1,A);rect(27,38+y,2,1,KS);
 // Frilled white apron: a bib on ruffled straps and a skirt panel with a scalloped edge.
 poly(shift([[24,41],[32,41],[32,47],[24,47]],y),A);line(24,41+y,24,47,AS);
 for(const [x0,x1]of [[22,19],[34,37]]){line(x0,40+y,x1,38+y,A,2);for(let i=0;i<3;i++)put(x1+(x1<28?-1:1),38+i+y,AS);}
 rect(21,47,14,1,A);poly([[22,48],[34,48],[37+walk,58],[19+walk,58]],A);
 for(let x=19+walk;x<37+walk;x+=2)put(x,58,x%4?AS:A);line(22,49,20+walk,57,AS);line(34,49,36+walk,57,AS);
 // Apron ties behind the waist.
 poly([[34,47],[39,45],[39,50]],A);
}
// ---- Off-duty outfits ----
const BARE={sleeve:SKIN.base,light:SKIN.light,cuff:null};
function bareLegs(r,walk,{top=56,shoe,shoeLight,strap,geta}={}){
 const {rect}=r;
 for(const [x,d]of [[22,-walk],[30,walk]]){rect(x+d,top,5,67-top,SKIN.base);rect(x+d+4,top,1,67-top,SKIN.shade);
  if(geta){rect(x+d-1,68,7,1,'#c89a6a');rect(x+d-1,69,7,2,'#8a6040');rect(x+d+1,67,3,1,strap);}
  else{rect(x+d-1,67,7,4,shoe);rect(x+d,67,4,1,shoeLight);if(strap)rect(x+d,68,5,1,strap);rect(x+d-1,70,7,1,mix(shoe,'#000000',.4));}}
}
function casualBody(r,{y,walk}){
 // Quiet Journey: a cream cable-knit sweater, a long sage skirt, a satchel and ankle boots.
 const {rect,poly,line,put}=r,K='#e8dcc4',KS='#bfae8e',KL='#f8f0de',G='#7a9a7e',GS='#5a7a60';
 for(const [x,d]of [[22,-walk],[30,walk]]){rect(x+d,62,5,4,c.tights);rect(x+d-1,65,7,6,c.boot);rect(x+d,65,1,5,'#b07a50');rect(x+d-1,65,7,1,'#a06a44');rect(x+d-1,70,7,1,'#4a2c1a');}
 poly([[21,48],[35,48],[39+walk,64],[17+walk,64]],GS);poly([[22,48],[34,48],[37+walk,63],[19+walk,63]],G);for(const k of [-.6,0,.6])line(28+Math.round(k*7),50,28+Math.round(k*17)+walk,62,GS);line(19+walk,62,37+walk,62,'#9ab89e');
 poly(shift([[19,38],[37,38],[38,50],[18,50]],y),KS);poly(shift([[20,39],[36,39],[37,49],[19,49]],y),K);
 for(const x of [23,28,33])for(let yy=40;yy<49;yy+=2){put(x,yy+y,KL);put(x+1,yy+1+y,KS);}rect(19,48,18,2,KS);
 rect(24,37+y,8,2,KS);rect(25,37+y,6,1,KL);
 // Satchel strap from shoulder to the bag at her hip.
 line(34,38+y,22,48,'#7a4a2a',2);poly([[16,47],[23,47],[23,53],[16,53]],'#8a5a38');rect(16,47,7,2,'#a06a44');put(19,49,c.gold);
 return {sleeve:K,light:KL,cuff:KS};
}
function pajamaBody(r,{y,walk}){
 // A Thousand Years of Sleep: a long starry lavender nightgown and fluffy slippers.
 const {rect,poly,line,put}=r,N='#c8c0e8',NS='#9a90c8',NL='#e8e4f8',STAR='#f0d890';
 for(const [x,d]of [[22,-walk],[30,walk]]){rect(x+d,64,5,3,SKIN.base);rect(x+d-2,66,9,5,'#f4f2f8');rect(x+d-1,66,7,1,'#ffffff');rect(x+d-2,70,9,1,'#c8c4d4');put(x+d+5,67,'#e8a8c8');}
 poly([[20,38+y],[36,38+y],[42+walk,65],[14+walk,65]],NS);poly([[21,39+y],[35,39+y],[40+walk,64],[16+walk,64]],N);
 for(const k of [-.5,0,.5])line(28+Math.round(k*8),44,28+Math.round(k*22)+walk,63,NS);
 for(let x=15+walk;x<41+walk;x+=3)rect(x,63,2,2,NL);
 for(const [x,yy]of [[23,45],[32,50],[20,56],[29,59],[36,57],[26,52]]){put(x,yy,STAR);put(x-1,yy,mix(STAR,N,.5));put(x+1,yy,mix(STAR,N,.5));put(x,yy-1,mix(STAR,N,.5));}
 poly(shift([[24,38],[28,42],[32,38]],y),NL);put(28,40+y,'#e8a8c8');
 return {sleeve:N,light:NL,cuff:NL};
}
function seasideBody(r,{y,walk}){
 // Elven Seaside Retreat: a white one-piece with sage side panels and a gold ring, a sheer sarong.
 const {rect,poly,line,put}=r,W='#f6f4ee',WS='#cfcabc',S='#8aae96';
 bareLegs(r,walk,{top:52,shoe:'#a87a50',shoeLight:'#c89a6a',strap:'#7a4a2a'});
 poly(shift([[21,39],[35,39],[34,52],[22,52]],y),SKIN.shade);poly(shift([[22,40],[34,40],[33,51],[23,51]],y),SKIN.base);
 poly(shift([[22,41],[34,41],[33,53],[23,53]],y),WS);poly(shift([[23,42],[33,42],[32,52],[24,52]],y),W);
 poly(shift([[22,43],[25,43],[24,52],[23,52]],y),S);poly(shift([[31,43],[34,43],[33,52],[32,52]],y),S);
 rect(26,44+y,4,3,c.goldDark);rect(27,45+y,2,1,W);line(25,40+y,24,42+y,W);line(31,40+y,32,42+y,W);
 poly([[21,51],[35,51],[39+walk,60],[30,58],[24,62],[18+walk,60]],'#e4ecec');poly([[22,52],[34,52],[37+walk,59],[30,57],[24,60],[20+walk,59]],'#f4fafa');rect(33,51,4,3,S);
 return {...BARE};
}
function frillBody(r,{y,walk}){
 // Seashell Frill Swimsuit: a mint swim dress with tiers of white frills.
 const {rect,poly,line,put}=r,M='#a8dcc8',MS='#78b0a0',F='#ffffff';
 bareLegs(r,walk,{top:54,shoe:'#f4f0ea',shoeLight:'#ffffff',strap:'#78b0a0'});
 poly(shift([[21,39],[35,39],[34,49],[22,49]],y),MS);poly(shift([[22,40],[34,40],[33,48],[23,48]],y),M);
 for(let x=22;x<35;x+=2)put(x,40+y,F);poly(shift([[24,43],[28,45],[24,47]],y),F);poly(shift([[32,43],[28,45],[32,47]],y),F);rect(27,44+y,2,2,'#f0a8b8');
 for(const [top,bot,hb,col]of [[47,57,13,MS],[47,54,10,M]]){poly([[22,top],[34,top],[28+hb+walk,bot],[28-hb+walk,bot]],col);for(let x=28-hb+walk;x<28+hb+walk;x+=2){rect(x,bot-1,2,1,F);put(x,bot,x%4?F:'#d8f0e8');}}
 line(22,50,18+walk,56,M);line(34,50,38+walk,56,M);
 return {...BARE};
}
function bathBody(r,{y,walk}){
 // Elven Hot-Spring Wrap: a striped white towel wrapped from the chest, wooden sandals.
 const {rect,poly,line,put}=r,T='#f4f0ea',TS='#cfc8b8',ST='#a8c0b8';
 bareLegs(r,walk,{top:56,geta:true,strap:'#c85a5a'});
 poly(shift([[21,39],[35,39],[34,44],[22,44]],y),SKIN.shade);poly(shift([[22,39],[34,39],[33,44],[23,44]],y),SKIN.base);
 poly([[20,42+y],[36,42+y],[38+walk,58],[18+walk,58]],TS);poly([[21,43+y],[35,43+y],[37+walk,57],[19+walk,57]],T);
 for(const yy of [46,53])line(20,yy,36+walk*.5,yy,ST);line(30,43+y,32+walk,57,TS);poly(shift([[30,42],[35,42],[33,46]],y),T);
 for(let x=19+walk;x<38+walk;x+=2)put(x,57,x%4?T:TS);
 return {...BARE};
}
function sunHat(r,y){
 // A wide straw sun hat with a sage ribbon.
 const {rect,poly,line}=r;poly([[9,13+y],[16,9+y],[40,9+y],[47,13+y],[40,15+y],[16,15+y]],'#c8a868');poly([[11,13+y],[17,10+y],[39,10+y],[45,13+y],[39,14+y],[17,14+y]],'#e8cc88');
 poly([[19,10+y],[21,4+y],[35,4+y],[37,10+y]],'#d8b878');rect(20,8+y,17,2,'#8aae96');line(22,5+y,34,5+y,'#f0dca0');
}
function nightcap(r,y,walk){
 const {poly,rect,put}=r;
 poly([[16,15+y],[21,7+y],[30,5+y],[38,8+y],[44+walk*.5,16+y],[46+walk*.5,24+y],[40,15+y],[34,12+y],[22,14+y]],'#9a90c8');
 poly([[18,14+y],[22,8+y],[30,7+y],[37,10+y],[42,16+y],[38,14+y],[30,11+y],[22,13+y]],'#c8c0e8');rect(16,14+y,25,2,'#f4f2f8');
 rect(44+Math.round(walk*.5),23+y,4,4,'#f0d890');put(45+Math.round(walk*.5),23+y,'#fff4c0');put(24,9+y,'#f0d890');put(33,10+y,'#f0d890');
}
function bunHair(r,y){
 // Hair gathered into a bun on top, a folded towel set on it.
 const {poly,rect,line}=r;poly([[21,9+y],[24,3+y],[32,3+y],[35,9+y],[32,12+y],[24,12+y]],c.hairShade);poly([[22,9+y],[25,4+y],[31,4+y],[34,9+y],[31,11+y],[25,11+y]],c.hair);line(25,5+y,30,5+y,c.hairLight);
 rect(21,1+y,14,3,'#f4f0ea');rect(21,3+y,14,1,'#a8c0b8');rect(22,1+y,12,1,'#ffffff');
}
function looseHair(r,{y,walk}){
 // Untied, sleep-mussed hair falling long behind her.
 const {poly,line}=r;poly([[14,22+y],[17,11+y],[39,11+y],[42,22+y],[43+walk*.4,56],[38,60],[33,52],[23,52],[18,60],[13+walk*.4,56]],c.hairShade);
 poly([[15,22+y],[18,13+y],[38,13+y],[41,22+y],[41+walk*.4,54],[38,57],[34,49],[22,49],[18,57],[15+walk*.4,54]],c.hair);
 line(16,26,15+walk*.4,52,c.hairLight);line(40,26,41+walk*.4,52,c.hairMid);line(9,18+y,13,20+y,c.hairMid);line(44,16+y,41,20+y,c.hair);
}
function shellClips(r,y){for(const x of [16,38]){r.rect(x,11+y,3,3,'#f0a8b8');r.put(x+1,11+y,'#ffd8e0');r.put(x,13+y,'#c87890');}}
function arms(r,{y,walk,cast},{sleeve,light,cuff,gold}){
 // Viewer-left arm hangs by her side; viewer-right hand grips the staff.
 const w=sleeve===SKIN.base?3:4;
 limb(r,19,41+y,16-walk*.3,52,{color:sleeve,light,width:w});if(cuff)r.rect(14-walk*.3,52,5,2,cuff);
 if(cast){limb(r,37,41+y,43,33,{color:sleeve,light,width:w});if(cuff)r.rect(41,35,5,2,cuff);}
 else{limb(r,37,41+y,41,50,{color:sleeve,light,width:w});if(cuff)r.rect(39,50,5,2,cuff);}
 if(gold)r.line(15-walk*.3,54,19-walk*.3,54,c.goldDark);
}
function headpiece(r,y){
 const {rect,put}=r;
 // A small frilled maid headband across the crown.
 for(let i=0;i<5;i++){const x=19+i*4,yy=10-Math.round(Math.sin((i+.5)*Math.PI/5)*2)+y;rect(x,yy,4,3,'#d6d8e0');rect(x,yy,3,2,'#ffffff');}
 rect(19,12+y,19,1,c.maid);put(28,9+y,'#ffffff');
}

const LOOKS={
 default:{body:mageBody,arm:{sleeve:c.white,light:'#ffffff',cuff:c.gold,gold:true},cape:true},
 maid:{body:maidBody,arm:{sleeve:c.maid,light:'#454c5e',cuff:'#fbfaf6'},frill:true,top:headpiece},
 casual:{body:casualBody},
 pajamas:{body:pajamaBody,hair:'loose',top:(r,m)=>nightcap(r,m.y,m.walk)},
 swimsuit:{body:seasideBody,top:(r,m)=>sunHat(r,m.y)},
 frillswim:{body:frillBody,top:(r,m)=>shellClips(r,m.y)},
 bathsuit:{body:bathBody,hair:'bun',top:(r,m)=>bunHair(r,m.y)},
};
export const FRIEREN_LOOK_IDS=Object.keys(LOOKS);
export function frierenPixels({frame=0,moving=false,pose='',attack=false,expression='neutral',blink=false,skin='default'}={}){
 const L=LOOKS[skin]||LOOKS.default,mo=motion({frame,moving}),cast=attack||!!pose;
 const m={y:mo.y,walk:mo.walk,blink,expression,cast};const r=canvas();
 if(L.hair==='loose')looseHair(r,m);else if(L.hair!=='bun')tails(r,m,!!L.frill);
 if(!cast)staff(r,false);
 const gear=L.body(r,m)||{};
 arms(r,m,L.arm||gear);if(L.cape)capelet(r,m);
 if(cast)staff(r,true);
 ears(r,m.y);face(r,m);fringe(r,m.y);
 if(L.top)L.top(r,m);
 return selout(r.pixels,INK);
}
