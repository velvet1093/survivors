import {canvas,motion,limb,selout,mix,SKIN} from './hero-kit.js';
// Sung Jinwoo. Messy black hair, narrow dark eyes and a lean build. The Hunter look is the
// reference: a long navy hooded coat with rolled sleeves over a white T-shirt, dark trousers,
// grey sneakers and Kamish's Wrath, the jagged red dagger, in his hand. The Shadow Monarch
// skin is black armour with violet seams and a long cape; off duty he wears the Ahjin Guild
// suit, loungewear or a swim set.
export const JINWOO_ART={ink:'#14121c',hair:'#1e2030',hairShade:'#12131c',hairLight:'#3a3e58',eye:'#3a4058',glow:'#9a8cff',coat:'#2a3260',coatShade:'#1a2040',coatLight:'#3e4a80',shirt:'#eef2f6',blade:'#8a1a2a',edge:'#e04048',guard:'#d8a830'};
const c=JINWOO_ART,INK=c.ink;
const shift=(pts,y)=>pts.map(([x,yy])=>[x,yy+y]);
const LOOKS={
 default:{coat:[c.coatShade,c.coat,c.coatLight],shirt:c.shirt,pants:['#1a1620','#2a2430','#3a3444'],shoe:['#8a8e9c','#d8dce4','#ffffff'],hood:true,rolled:true,tail:true},
 monarch:{armor:true,coat:['#0c0a14','#1a1824','#2e2a40'],seam:c.glow,pants:['#0c0a14','#1a1824','#2e2a40'],shoe:['#0c0a14','#22202e','#3a3650'],cape:['#0a0812','#1a1428','#5a4aa8'],glowEyes:true,tail:true},
 casual:{suit:true,coat:['#0e0e14','#1c1c26','#30303e'],shirt:'#f4f4f8',tie:'#3a3a5a',pants:['#0e0e14','#1c1c26','#30303e'],shoe:['#0a0a0e','#1a1a22','#3a3a48']},
 pajamas:{lounge:true,shirt:'#3a4670',shirtShade:'#2a3458',pants:['#6a6e7a','#8a8e9a','#a8acb8'],shoe:['#3a3a48','#5a5a6a','#7a7a8a'],slides:true},
 swimsuit:{swim:true,shirt:'#2a3a6a',shirtShade:'#1a2a50',pants:['#121420','#1e2030','#9a8cff'],shoe:['#3a3a48','#5a5a6a','#7a7a8a'],slides:true},
};
export const JINWOO_LOOK_IDS=Object.keys(LOOKS);

function hairBack(r,y){
 const {poly}=r;poly(shift([[16,24],[14,16],[19,9],[28,5],[37,8],[42,15],[40,26],[38,33],[18,33]],y),c.hairShade);
}
function face(r,{y,blink,expression,cast},L){
 const {rect,poly,line,put}=r,hurt=expression==='hurt',focus=cast||expression==='focused'||expression==='ultimate';
 rect(25,36+y,6,4,SKIN.shade);
 // A slightly longer, sharper jaw than the other chibi faces.
 poly(shift([[18,20],[38,20],[38,29],[36,35],[31,39],[25,39],[20,35],[18,29]],y),SKIN.shade);
 poly(shift([[19,20],[37,20],[37,29],[35,34],[30,38],[26,38],[21,34],[19,29]],y),SKIN.base);
 rect(36,25+y,1,5,SKIN.shade);
 const iris=L.glowEyes||focus&&expression==='ultimate'?c.glow:c.eye;
 for(const [x,side]of [[21,-1],[31,1]]){
  // Brows angle down toward the nose: a calm, cold stare.
  line(x-(side<0?1:0),25+y,x+3+(side>0?1:0),side<0?26+y:25+y,c.hairShade);
  if(blink){line(x,29+y,x+3,29+y,INK);continue;}
  if(hurt){line(x,28+y,x+3,30+y,INK);line(x,30+y,x+3,28+y,INK);continue;}
  rect(x,28+y,4,2,'#f4f2f0');rect(x+(side<0?1:0),28+y,3,2,iris);put(x+(side<0?2:1),28+y,L.glowEyes?'#ffffff':INK);
  line(x-(side<0?1:0),27+y,x+3+(side>0?1:0),27+y,INK);if(focus)line(x,26+y,x+3,26+y,INK);
 }
 if(L.glowEyes){put(19,28+y,c.glow);put(36,28+y,c.glow);}
 line(28,30+y,28,32+y,SKIN.shade);
 if(hurt){rect(26,34+y,4,2,'#7a3a44');put(27,34+y,'#ffffff');}
 else if(expression==='ultimate'){rect(26,34+y,5,1,'#6a3a44');rect(27,35+y,3,1,'#6a3a44');}
 else if(focus)rect(26,34+y,4,1,'#8a5a5a');
 else{rect(27,34+y,3,1,'#9a6a66');put(26,33+y,'#9a6a66');}
}
function hairFront(r,y){
 const {poly,line}=r;
 // Messy layered black hair: spiky tufts over the forehead and sides, one lock across the brow.
 poly(shift([[15,27],[13,20],[16,17],[15,11],[19,10],[20,4],[24,7],[27,1],[30,6],[34,2],[35,7],[40,5],[39,11],[42,14],[43,20],[41,24],[41,27],[39,22],[38,16],[35,20],[33,15],[30,21],[28,15],[25,21],[23,16],[20,22],[18,19],[17,28]],y),c.hair);
 poly(shift([[18,12],[21,7],[25,6],[23,10],[20,13]],y),c.hairLight);poly(shift([[29,7],[33,5],[37,9],[34,10]],y),c.hairLight);line(27,3+y,26,8+y,c.hairLight);
 line(24,17+y,22,24+y,c.hair);line(25,17+y,23,23+y,c.hairShade);line(33,16+y,35,22+y,c.hair);
 line(16,22+y,16,30+y,c.hair);line(40,22+y,40,29+y,c.hair);
}
// Kamish's Wrath: a jagged red blade with a gold guard and a wrapped hilt.
function dagger(r,x,y,{angle=Math.PI/2,length=17}={}){
 const {line,rect,put,poly}=r,dx=Math.cos(angle),dy=Math.sin(angle),nx=-dy,ny=dx;
 line(x-dx*5,y-dy*5,x,y,'#5a4a3a',2);put(x-dx*6,y-dy*6,c.guard);
 line(x-nx*3,y-ny*3,x+nx*3,y+ny*3,c.guard,1);
 poly([[x+nx*1.8,y+ny*1.8],[x+dx*length*.5+nx*2.6,y+dy*length*.5+ny*2.6],[x+dx*length,y+dy*length],[x+dx*length*.5-nx*1.6,y+dy*length*.5-ny*1.6],[x-nx*1.2,y-ny*1.2]],c.blade);
 for(const t of [.3,.55,.8])put(x+dx*length*t+nx*(3.2-t*1.4),y+dy*length*t+ny*(3.2-t*1.4),c.edge);
 line(x+nx*.8,y+ny*.8,x+dx*length*.85,y+dy*length*.85,c.edge);
}
function legs(r,{walk},L){
 const {rect,put}=r,[pd,pm,pl]=L.pants,[sd,sm,sl]=L.shoe;
 for(const [x,d]of [[22,-walk],[30,walk]]){
  if(L.swim){rect(x+d,58,5,9,SKIN.base);rect(x+d+4,58,1,9,SKIN.shade);}
  else{rect(x+d,52,5,15,pm);rect(x+d+4,52,1,15,pd);rect(x+d+1,53,1,12,pl);}
  if(L.slides){rect(x+d-1,67,7,4,SKIN.base);rect(x+d-1,69,7,2,sm);rect(x+d-1,68,7,1,sd);}
  else{rect(x+d-1,66,7,5,sm);rect(x+d,66,5,1,sl);rect(x+d+1,67,3,1,'#5a6070');rect(x+d-1,70,7,1,sd);put(x+d+5,68,sd);}
 }
}
function torso(r,{y,walk},L){
 const {rect,poly,line,put}=r,[cd,cm,cl]=L.coat||[];
 if(L.swim){
  // Black board shorts with a violet stripe and an open short-sleeved shirt.
  poly([[20,47],[36,47],[37,59],[29,59],[28,55],[27,59],[19,59]],L.pants[1]);line(21,48,20,58,L.pants[2]);line(35,48,36,58,L.pants[2]);
  poly(shift([[21,38],[35,38],[34,48],[22,48]],y),SKIN.shade);poly(shift([[22,39],[34,39],[33,47],[23,47]],y),SKIN.base);line(28,42+y,28,46,SKIN.shade);
  poly(shift([[19,37],[24,37],[25,49],[19,49]],y),L.shirtShade);poly(shift([[20,38],[24,38],[24,48],[20,48]],y),L.shirt);poly(shift([[32,37],[37,37],[37,49],[31,49]],y),L.shirtShade);poly(shift([[32,38],[36,38],[36,48],[32,48]],y),L.shirt);
  return;}
 if(L.lounge){
  poly(shift([[19,37],[37,37],[38,52],[18,52]],y),L.shirtShade);poly(shift([[20,38],[36,38],[37,51],[19,51]],y),L.shirt);rect(25,37+y,6,2,SKIN.base);line(25,39+y,31,39+y,L.shirtShade);
  rect(18,50,20,2,L.pants[0]);put(27,51,L.pants[2]);put(29,51,L.pants[2]);return;}
 if(L.armor){
  // Black plate with violet seams and a cape falling behind.
  poly(shift([[19,37],[37,37],[38,52],[18,52]],y),cd);poly(shift([[20,38],[36,38],[36,51],[20,51]],y),cm);
  line(28,39+y,28,51,L.seam);line(22,43+y,34,43+y,L.seam);line(23,47,33,47,L.seam);put(28,43+y,'#ffffff');
  poly(shift([[16,37],[22,36],[23,42],[16,43]],y),cl);poly(shift([[34,36],[40,37],[40,43],[33,42]],y),cl);line(17,38+y,21,37+y,L.seam);line(35,37+y,39,38+y,L.seam);
  poly([[20,51],[36,51],[37,60],[19,60]],cd);poly([[21,51],[35,51],[35,59],[21,59]],cm);line(28,52,28,59,L.seam);return;}
 // Long coat (Hunter) or suit jacket (Ahjin Guild) open over the shirt.
 poly(shift([[23,37],[33,37],[33,51],[23,51]],y),L.shirt);line(24,40+y,24,50,mix(L.shirt,'#8a90a0',.4));
 if(L.tie){line(28,38+y,28,47,L.tie,2);put(28,38+y,mix(L.tie,'#000000',.4));}
 else poly(shift([[25,37],[31,37],[28,40]],y),SKIN.base);
 const hem=L.suit?54:66;
 poly([[19,37+y],[25,38+y],[26,51],[24,hem],[16+walk,hem],[17,46]],cd);poly([[20,38+y],[24,39+y],[25,51],[23,hem-1],[18+walk,hem-1],[18,46]],cm);line(21,41+y,20,hem-2,cl);
 poly([[31,38+y],[37,37+y],[39,46],[40+walk,hem],[32,hem],[30,51]],cd);poly([[32,39+y],[36,38+y],[38,46],[38+walk,hem-1],[33,hem-1],[31,51]],cm);line(35,41+y,37+walk,hem-2,cl);
 if(L.suit){rect(23,50,10,1,cd);put(26,44,'#3a3a48');}
}
function hood(r,y,L){const [cd,cm]=L.coat;r.poly(shift([[19,36],[24,33],[32,33],[37,36],[34,39],[22,39]],y),cd);r.poly(shift([[21,36],[24,34],[32,34],[35,36],[32,38],[24,38]],y),cm);}
function backPiece(r,{y,walk},L){
 const {poly,line}=r;
 // The coat's long tail (or the Monarch's cape) sweeps out behind him.
 if(L.cape){const [a,b,cc]=L.cape;poly([[18,38+y],[38,38+y],[44+walk,60],[48+walk*2,70],[30,68],[12-walk,70],[14,58]],a);poly([[19,39+y],[37,39+y],[42+walk,60],[45+walk*2,68],[30,66],[14-walk,68],[16,58]],b);line(38,42,44+walk*2,66,cc);line(18,42,14-walk,66,cc);return;}
 if(L.tail){const [cd,cm,cl]=L.coat;poly([[34,44],[40,42],[46+walk,56],[51+walk*2,68],[44+walk,70],[38,62]],cd);poly([[35,45],[40,44],[45+walk,57],[48+walk*2,67],[43+walk,68],[38,60]],cm);line(40,46,47+walk*2,66,cl);}
}
function arms(r,{y,walk,cast,ultimate},L){
 const sleeve=L.swim?SKIN.base:L.lounge?L.shirt:(L.coat||[])[1],light=L.swim?SKIN.light:L.lounge?mix(L.shirt,'#ffffff',.2):(L.coat||[])[2];
 // Viewer-left hand holds the dagger; the right hangs, or rises to command the shadows.
 const lx=cast?11:15-walk*.3,ly=cast?36:51;
 if(L.rolled){limb(r,20,40+y,(20+lx)/2,(40+y+ly)/2,{color:sleeve,light,width:5,hand:null});limb(r,(20+lx)/2,(40+y+ly)/2,lx,ly,{color:SKIN.base,light:SKIN.light,width:3});r.rect((20+lx)/2-2,(40+y+ly)/2-1,5,2,(L.coat||[])[0]);}
 else limb(r,20,40+y,lx,ly,{color:sleeve,light,width:L.swim?3:5});
 const rx=ultimate?44:40+walk*.3,ry=ultimate?26:51;
 if(L.rolled){limb(r,36,40+y,(36+rx)/2,(40+y+ry)/2,{color:sleeve,light,width:5,hand:null});limb(r,(36+rx)/2,(40+y+ry)/2,rx,ry,{color:SKIN.base,light:SKIN.light,width:3});r.rect((36+rx)/2-2,(40+y+ry)/2-1,5,2,(L.coat||[])[0]);}
 else limb(r,36,40+y,rx,ry,{color:sleeve,light,width:L.swim?3:5});
 dagger(r,lx+1,ly+3,cast?{angle:-Math.PI*.8,length:18}:{angle:Math.PI*.55,length:16});
 if(ultimate)for(const [dx,dy]of [[0,-4],[-3,-7],[3,-9],[0,-12]])r.put(rx+1+dx,ry+dy,c.glow);
}
export function jinwooPixels({frame=0,moving=false,pose='',attack=false,expression='neutral',blink=false,skin='default'}={}){
 const L=LOOKS[skin]||LOOKS.default,mo=motion({frame,moving}),ultimate=!!pose,cast=attack||ultimate;
 const m={y:mo.y,walk:mo.walk,blink,expression:ultimate?'ultimate':expression,cast,ultimate};const r=canvas();
 if(ultimate)for(let i=0;i<7;i++){const x=12+i*5,h=6+(i*5+frame*3)%9;r.line(x,70,x+(i%2?1:-1),70-h,i%2?'#5a4aa8':'#3a2a78',2);}
 hairBack(r,m.y);backPiece(r,m,L);legs(r,m,L);torso(r,m,L);if(L.hood)hood(r,m.y,L);arms(r,m,L);
 face(r,m,L);hairFront(r,m.y);
 return selout(r.pixels,INK);
}
