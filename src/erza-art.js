import {raster,outline} from './pixel-characters.js';

const INK='#30323f',RED='#b34250',RED_DARK='#672b40',RED_MID='#d45a5e',RED_LIGHT='#f28a78',SKIN='#edc3a5',SKIN_LIGHT='#ffe0bf',SKIN_SHADE='#b8877d';
const SILVER='#a9bdcd',SILVER_SHADE='#5e748e',SILVER_LIGHT='#e7f0e6',BLUE='#536a9b',BLUE_DARK='#303d65',GOLD='#d8b56a';
const formIndex=form=>typeof form==='number'?((Math.floor(form)%4)+4)%4:({wheel:0,heavenswheel:0,blackwing:1,adamantine:2,base:3,heartkreuz:3}[form]||0);

function sword(r,x,y,tx,ty,{dark=false,wide=false}={}){
 const {poly:P,line:L}=r,dx=tx-x,dy=ty-y,len=Math.max(1,Math.hypot(dx,dy)),nx=-dy/len,ny=dx/len,w=wide?2.5:1.6,shade=dark?'#4b405c':SILVER_SHADE,steel=dark?'#a8a1bc':SILVER_LIGHT;
 P([[x+nx*w,y+ny*w],[tx+nx,ty+ny],[tx,ty-2],[tx-nx,ty-ny],[x-nx*w,y-ny*w]],shade);
 L(x,y,tx,ty,steel);L(x-dx/len*2,y-dy/len*2,x-dx/len*5,y-dy/len*5,'#66516a',2);L(x+nx*3,y+ny*3,x-nx*3,y-ny*3,GOLD);L(x+nx,y+ny,tx,ty,dark?'#d7c9df':'#ffffff');
}
function wings(r,form,walk,y){
 const {poly:P,line:L}=r;
 if(form===0){
  for(const side of [-1,1]){
   const p=(x,yy)=>[28+side*x,yy+y],sway=walk*.3;
   P([p(12,32),p(19,27),p(26,27),p(24,37),p(27,49+sway),p(20,45),p(24,56+sway),p(15,49),p(10,38)],SILVER_SHADE);
   P([p(13,33),p(20,29),p(24,29),p(21,38),p(24,46+sway),p(19,43),p(21,51+sway),p(16,47),p(12,38)],SILVER);
   for(const [xx,yy,tx,ty]of [[15,34,23,29],[15,38,23,44],[15,42,21,50]]){L(...p(xx,yy),...p(tx,ty+sway),SILVER_LIGHT,2);L(...p(xx+1,yy+2),...p(tx,ty+2+sway),'#7f94ab');}
   L(...p(12,33),...p(15,45),GOLD);P([p(12,33),p(14,31),p(16,34),p(14,37)],'#d7e6dc');
  }
 }else if(form===1){
  for(const side of [-1,1]){
   const p=(x,yy)=>[28+side*x,yy+y],sway=walk*.4;
   P([p(11,34),p(18,27),p(24,23),p(25,30),p(27,36),p(25,42),p(27,51+sway),p(19,46),p(18,55+sway),p(13,47),p(11,40)],'#232535');
   P([p(13,35),p(19,30),p(23,27),p(23,35),p(25,39),p(22,41),p(24,47+sway),p(18,43),p(17,50+sway),p(14,44)],'#4e4564');
   L(...p(13,35),...p(23,27),'#83718c');L(...p(14,36),...p(23,46+sway),'#786180');L(...p(14,38),...p(17,49+sway),'#655a7a');
   P([p(19,28),p(23,24),p(24,28),p(22,29)],'#a196b1');
  }
 }
}
function face(r,{y,blink,expression,cast}){
 const {poly:P,rect:R,line:L}=r,closed=blink||expression==='hurt';
 P([[19,19+y],[24,14+y],[33,15+y],[37,21+y],[36,29+y],[31,34+y],[25,34+y],[20,30+y],[18,25+y]],SKIN_SHADE);
 P([[21,20+y],[25,17+y],[32,17+y],[35,22+y],[34,29+y],[30,32+y],[25,31+y],[21,27+y]],SKIN_LIGHT);
 R(18,24+y,3,4,SKIN);R(35,24+y,3,4,SKIN);
 for(const x of [21,31]){
  L(x,25+y,x+3,24+y,INK);if(closed){L(x,27+y,x+3,27+y,INK);continue;}
  R(x,26+y,4,3,'#fff1d9');R(x+1,26+y,2,3,'#8b6562');R(x+1,27+y,1,2,'#383546');R(x+1,26+y,1,1,'#fff6dc');if(cast||expression==='focused')R(x,26+y,4,1,INK);
 }
 L(26,31+y,29,31+y,'#9e6a70');if(expression==='hurt')R(27,32+y,2,1,'#b9787a');
}
function hairFront(r,y,walk){
 const {poly:P,line:L}=r;
 // Long, side-parted scarlet locks frame her face; the forehead stays compact.
 P([[17,26+y],[14,20+y],[16,13+y],[21,8+y],[28,6+y],[35,9+y],[39,15+y],[40,25+y],[36,33+y],[34,23+y],[31,16+y],[27,20+y],[22,22+y],[20,28+y],[20,39],[16,43],[15,34]],RED_DARK);
 P([[17,21+y],[18,14+y],[23,10+y],[29,8+y],[35,12+y],[37,18+y],[35,23+y],[32,18+y],[29,14+y],[25,20+y],[21,23+y],[19,31+y],[18,39],[16,40],[17,30]],RED);
 P([[19,17+y],[23,12+y],[29,10+y],[33,12+y],[28,12+y],[23,16+y],[21,21+y],[18,24+y]],RED_MID);
 P([[21,18+y],[26,14+y],[30,13+y],[27,17+y],[23,22+y],[20,24+y]],RED_MID);
 L(22,12+y,27,9+y,RED_LIGHT);L(29,10+y,33,12+y,'#e9796b');L(17,29+y,17-walk*.2,38,RED_MID);L(36,25+y,38+walk*.2,43,RED_MID);
}
function shield(r,x,y,side,cast){
 const {poly:P,line:L,rect:R}=r,w=cast?10:8;
 P([[x-w,y-11],[x+2,y-14],[x+w,y-10],[x+w,y+3],[x+2,y+11],[x-w,y+5]],'#3f5675');
 P([[x-w+1,y-10],[x+2,y-12],[x+w-1,y-9],[x+w-1,y+2],[x+2,y+8],[x-w+1,y+4]],'#a6c4d3');
 P([[x-w+3,y-8],[x+1,y-10],[x+w-3,y-7],[x+w-3,y+1],[x+1,y+6],[x-w+3,y+2]],'#547b9b');
 L(x+1,y-10,x+1,y+6,GOLD,2);L(x-w+3,y-4,x+w-3,y-4,GOLD);P([[x+1,y-8],[x+4,y-4],[x+1,y],[x-2,y-4]],'#dfd49c');R(x,y-5,2,2,'#f8f1cf');L(x-w+1,y-9,x+1,y-12,SILVER_LIGHT);L(x+w-1,y-8,x+w-1,y+1,SILVER_LIGHT);
 if(side<0)L(x-w+1,y-7,x-w+1,y+3,'#c8dce1');
}

const NAVY='#2c3a63',NAVY_SHADE='#1a2342',NAVY_LIGHT='#4f62a0',PLATE='#e9eef3',PLATE_SHADE='#a7b6c7',PLATE_DARK='#5d6d84';
const BLACK='#26252f',BLACK_SHADE='#131218',BLACK_LIGHT='#4b4a5a',GRAY='#9a99a8',LINING='#d4d4dc';
const TASSET='#5b6f8e',TASSET_SHADE='#34435d',TASSET_LIGHT='#8fa4c0',GEM='#6fa8e8';
// Heaven's Wheel: a fan of long blade feathers from each shoulder blade.
function bladeWings(r,y,walk){
 const {poly:P,line:L}=r;
 for(const s of [-1,1]){
  const px=28+s*7,py=37+y;
  for(const [deg,len]of [[-40,17],[-24,20],[-9,21],[5,20],[19,18],[33,15]]){
   const a=deg*Math.PI/180,dx=Math.cos(a)*s,dy=Math.sin(a)+walk*.01,ex=px+dx*len,ey=py+dy*len,nx=-dy*2.6,ny=dx*2.6;
   const mx=px+dx*len*.55,my=py+dy*len*.55;
   P([[px+nx*.6,py+ny*.6],[mx+nx,my+ny],[ex,ey],[mx-nx*.8,my-ny*.8],[px-nx*.6,py-ny*.6]],'#9fb0c4');
   P([[px+nx*.4,py+ny*.4],[mx+nx*.7,my+ny*.7],[ex-dx,ey-dy],[mx,my]],'#f2f6f9');
   L(px+dx*len*.45,py+dy*len*.45,px+dx*len*.85,py+dy*len*.85,'#56688a');
  }
 }
}
// Adamantine: two tall shield slabs carried on the back like folded wings.
function backShields(r,y){
 const {poly:P,line:L}=r;
 for(const s of [-1,1]){const p=(x,yy)=>[28+s*x,yy+y];
  P([p(10,24),p(19,13),p(25,15),p(26,55),p(17,62)],PLATE_DARK);
  P([p(11,25),p(19,15),p(24,17),p(25,54),p(17,60)],PLATE);
  P([p(13,27),p(18,21),p(20,22),p(21,53),p(16,57)],'#1b2030');
  L(...p(24,17),...p(25,53),'#ffffff');
 }
}
// Black Wing: a long jagged coat flaring behind the legs, pale lining inside.
function blackCoat(r,walk){
 const {poly:P,line:L}=r,w=walk*.5;
 P([[18,44],[38,44],[45+w,62],[43+w,70],[38,66],[34,71],[28,66],[22,71],[18,66],[13+w,70],[11+w,62]],BLACK_SHADE);
 P([[20,46],[36,46],[42+w,62],[39+w,67],[34,64],[28,63],[22,64],[17+w,67],[14+w,62]],LINING);
 L(17+w,66,22,60,'#a9a9b6');L(39+w,66,34,60,'#a9a9b6');
}
function ponytail(r,y,walk){
 const {poly:P,line:L}=r;
 // High ponytail tied at the crown, falling behind her viewer-right shoulder.
 P([[27,8+y],[31,2+y],[36,1+y],[38,5+y],[40,14+y],[42+walk,30],[43+walk,46],[39+walk,52],[37,40],[35,22+y],[32,10+y]],RED_DARK);
 P([[29,7+y],[32,3+y],[35,2+y],[37,6+y],[38,14+y],[40+walk,30],[40+walk,44],[38+walk,48],[36,38],[34,22+y],[31,10+y]],RED);
 L(33,4+y,36,12+y,RED_LIGHT);L(38,18+y,40+walk,40,RED_MID);P([[29,6+y],[33,5+y],[33,8+y],[29,9+y]],BLACK);
}
function helmet(r,y){
 const {poly:P,line:L,rect:R}=r;
 // Navy helmet with white stripes, a tall central crest and swept side horns.
 P([[17,19+y],[18,10+y],[23,6+y],[33,6+y],[38,10+y],[39,19+y],[36,16+y],[20,16+y]],NAVY_SHADE);
 P([[18,17+y],[19,10+y],[24,7+y],[32,7+y],[37,10+y],[38,17+y],[35,15+y],[21,15+y]],NAVY);
 for(const x of [23,28,33])R(x,8+y,2,8,PLATE);
 P([[26,7+y],[28,2+y],[30,7+y]],NAVY);L(28,3+y,28,6+y,PLATE);
 for(const s of [-1,1]){const p=(x,yy)=>[28+s*x,yy+y];P([p(9,12),p(17,3),p(14,10),p(12,15)],NAVY);P([p(10,18),p(16,10),p(14,15),p(11,20)],NAVY_LIGHT);
  P([p(10,16),p(11,15),p(11,28),p(9,26)],NAVY);}
}
function wingCrown(r,y){
 const {poly:P,rect:R}=r;
 for(const s of [-1,1]){const p=(x,yy)=>[28+s*x,yy+y];P([p(10,20),p(14,15),p(16,16),p(12,21)],'#9fb0c4');P([p(11,19),p(14,16),p(15,17),p(12,20)],'#f2f6f9');P([p(10,17),p(13,13),p(14,14),p(11,18)],'#9fb0c4');P([p(11,16),p(13,14),p(13,15),p(11,17)],'#f2f6f9');R(...p(10,19),1,1,GEM);}
}
export function erzaPixels({frame=0,moving=false,pose='',attack=false,expression='neutral',blink=false,skin='default',form=3,erzaForm}={}){
 frame=((frame%4)+4)%4;form=formIndex(erzaForm??form);
 const r=raster(),{poly:P,rect:R,line:L}=r,walk=moving?[0,1.5,0,-1.5][frame]:0,y=moving?-(frame%2):0,casual=skin==='casual',ultimate=pose==='nakagami'||pose==='chariot',requip=pose==='requip',cast=attack||ultimate||requip;
 const armored=!casual;
 // Rear hair (Black Wing ties it up into a ponytail instead).
 if(armored&&form===1){P([[18,20+y],[22,11+y],[32,10+y],[37,17+y],[38,32],[19,32]],RED_DARK);ponytail(r,y,walk);}
 else{
  P([[17,18+y],[21,10+y],[32,9+y],[38,16+y],[40,34],[43+walk,49],[40+walk,58],[34,53],[31,42],[24,48],[17-walk,57],[12-walk,54],[15,40]],RED_DARK);
  P([[18,21+y],[23,13+y],[32,12+y],[36,19+y],[37,35],[40+walk,48],[38+walk,53],[34,47],[30,36],[23,44],[17-walk,52],[15-walk,51],[18,35]],RED);
  L(18,31,16-walk*.5,48,RED_MID);L(37,28,39+walk*.5,48,RED_LIGHT);L(20,37,19-walk*.3,49,'#d96b65');
 }
 if(armored){if(form===0)bladeWings(r,y,walk);else if(form===1)blackCoat(r,walk);else if(form===2)backShields(r,y);}
 // Legs and footwear.
 for(const [x,d]of [[21,-walk],[30,walk]]){
  if(casual){R(x,53,5,9,SKIN);R(x+1,55,3,5,SKIN_LIGHT);P([[x,60],[x+5,60],[x+5+d,68],[x+3+d,70],[x-2+d,69]],'#413b49');L(x+1,62,x+1+d,67,'#746173');R(x-3+d,69,10,2,'#292d3c');R(x-2+d,68,7,1,'#a3949d');}
  else if(form===3){
   // Bare knees above black knee-high boots with folded cuffs.
   R(x,53,5,7,SKIN);R(x+1,54,2,5,SKIN_LIGHT);
   P([[x-1,59],[x+6,59],[x+6+d,68],[x+3+d,70],[x-2+d,69]],'#252c3b');R(x-1,59,7,2,'#3d4659');L(x+1,61,x+1+d,67,'#566279');R(x-3+d,69,10,2,INK);
  }else if(form===0){
   // Silver greaves with pointed knee plates.
   P([[x,58],[x+5,58],[x+6+d,69],[x-1+d,69]],PLATE_SHADE);P([[x+1,58],[x+4,58],[x+5+d,68],[x+d,68]],PLATE);
   P([[x-1,58],[x+6,58],[x+4,62],[x+1,62]],'#9fb0c4');L(x+2,63,x+2+d,67,'#ffffff');R(x-3+d,69,10,2,PLATE_DARK);R(x-2+d,69,8,1,'#c9d4df');
  }else if(form===1){
   // Black thigh-high boots with grey knee bands.
   P([[x,48],[x+6,48],[x+6+d,68],[x-1+d,68]],BLACK_SHADE);R(x+1,49,4,19,BLACK);L(x+1,50,x+1+d,66,BLACK_LIGHT);
   R(x,58,6,2,GRAY);R(x-2+d,68,9,3,BLACK);R(x-2+d,68,9,1,GRAY);
  }else{
   // White leg armour with navy horn-shaped knee guards.
   P([[x,50],[x+6,50],[x+6+d,68],[x-1+d,68]],PLATE_SHADE);R(x+1,51,4,17,PLATE);L(x+2,52,x+2+d,66,'#ffffff');
   P([[x-2,57],[x+6,56],[x+7,61],[x+3,63],[x-1,61]],NAVY);P([[x-3,55],[x-1,57],[x-1,60]],NAVY_LIGHT);R(x-2+d,68,10,3,PLATE);R(x-2+d,70,10,1,PLATE_DARK);
  }
 }
 if(casual){
  // Everyday Fairy Tail outfit: fitted white collared shirt, blue pleats and boots.
  P([[20,35+y],[25,33+y],[32,33+y],[37,36+y],[36,46],[33,49],[22,49],[19,43]],'#a4adb7');
  P([[22,35+y],[26,34+y],[31,34+y],[35,37+y],[34,46],[23,47],[21,41]],'#ececdf');
  P([[25,34+y],[28,38+y],[31,34+y],[32,36+y],[28,41],[23,36+y]],'#fff9e9');L(28,41,28,46,'#bcc8ca');R(29,42,1,1,'#7f8da1');R(29,45,1,1,'#7f8da1');
  P([[22,47],[34,47],[38+walk*.3,55],[35,58],[29,56],[23,58],[18+walk*.3,55]],BLUE_DARK);P([[23,49],[33,49],[35+walk*.3,55],[31,56],[27,54],[22,56],[20+walk*.3,54]],BLUE);L(23,50,22+walk*.3,55,'#a4afd0');L(28,50,28,54,'#a4afd0');L(32,50,33+walk*.3,55,'#8497bf');L(22,47,34,47,'#816357',2);R(27,47,4,2,GOLD);
 }else if(form===3){
  // Heart Kreuz: navy pleated skirt, brown belt, silver cuirass with the dark cross.
  P([[21,48],[35,48],[40+walk*.3,58],[35,61],[30,59],[25,61],[16+walk*.3,58]],BLUE_DARK);
  P([[22,49],[34,49],[38+walk*.3,57],[34,59],[29,57],[25,59],[18+walk*.3,57]],BLUE);
  for(const [x,dx]of [[22,-2],[26,-1],[30,1],[34,2]]){L(x,50,x+dx+walk*.3,58,'#3d517f');L(x+1,50,x+1+dx+walk*.3,57,'#7e92c2');}
  P([[20,34+y],[25,32+y],[32,32+y],[37,34+y],[36,44],[33,48],[23,48],[20,44]],SILVER_SHADE);
  P([[21,34+y],[25,33+y],[32,33+y],[36,35+y],[35,43],[32,46],[24,46],[21,43]],SILVER);
  P([[22,35+y],[26,34+y],[27,40+y],[24,43]],SILVER_LIGHT);
  R(27,35+y,3,10,'#4f5d72');R(22,37+y,13,2,'#4f5d72');R(28,35+y,1,9,'#6f7f96');
  R(20,46,17,2,'#6e4b3e');R(27,46,3,2,GOLD);
 }else if(form===0){
  // Heaven's Wheel: long white skirt with a jagged hem under dark steel tassets,
  // bare midriff and a silver bustier set with a blue gem.
  P([[20,46],[36,46],[42+walk*.4,62],[14+walk*.4,62]],'#c9d4df');P([[21,46],[35,46],[40+walk*.4,61],[16+walk*.4,61]],'#f6f8fa');
  for(let x=15+walk*.4;x<41+walk*.4;x+=3)P([[x,61],[x+3,61],[x+1.5,64]],'#f6f8fa');
  for(const a of [-6,0,6])L(28+a*.5,48,28+a*1.6+walk*.4,60,'#d5dde6');
  for(const [x,tip]of [[20,57],[25,59],[31,59],[36,57]]){P([[x-3,46],[x+3,46],[x+1,tip],[x-1,tip]],TASSET_SHADE);P([[x-2,47],[x+2,47],[x,tip-2]],TASSET);L(x,48,x,tip-4,TASSET_LIGHT);}
  R(20,45,17,2,TASSET_SHADE);
  R(22,40+y,13,6,SKIN);R(23,41+y,11,4,SKIN_LIGHT);put28(r,44+y);
  P([[20,34+y],[24,33+y],[28,36+y],[32,33+y],[36,34+y],[35,40+y],[30,41+y],[28,40+y],[26,41+y],[21,40+y]],'#9fb0c4');
  P([[21,35+y],[24,34+y],[28,37+y],[32,34+y],[35,35+y],[34,39+y],[30,40+y],[28,39+y],[26,40+y],[22,39+y]],'#eef3f7');
  R(27,37+y,3,3,TASSET_SHADE);R(28,37+y,1,2,GEM);
 }else if(form===1){
  // Black Wing: collared black cuirass with grey trim and a zigzag midriff cut-out,
  // jagged black tassets hanging to the knees.
  for(const [x,d]of [[19,-1],[33,1]]){P([[x,46],[x+5,46],[x+5+d,62],[x+3,58],[x+1+d,63],[x-1,57]],BLACK);L(x+1,47,x+2+d,58,GRAY);}
  P([[25,46],[31,46],[30,53],[28,56],[26,53]],BLACK);L(26,47,28,55,BLACK_LIGHT);
  P([[20,34+y],[25,32+y],[32,32+y],[37,34+y],[36,46],[20,46]],BLACK);
  P([[24,39+y],[26,38+y],[28,40+y],[30,38+y],[32,39+y],[31,42],[33,44],[28,46],[23,44],[25,42]],SKIN);L(26,41+y,26,44,SKIN_LIGHT);
  L(21,35+y,25,33+y,GRAY);L(35,35+y,31,33+y,GRAY);L(20,36+y,20,45,BLACK_LIGHT);L(36,36+y,36,45,BLACK_LIGHT);
  R(23,31+y,10,3,BLACK);L(23,31+y,32,31+y,GRAY);
  R(20,45,17,2,BLACK_SHADE);
 }else{
  // Adamantine: spiked white faulds, navy cuirass with white plating.
  P([[19,45],[37,45],[39,53],[17,53]],PLATE_SHADE);P([[20,46],[36,46],[38,52],[18,52]],PLATE);
  for(let x=18;x<39;x+=4)P([[x,52],[x+3,52],[x+1.5,57]],PLATE);L(19,48,37,48,PLATE_SHADE);
  P([[20,34+y],[25,32+y],[32,32+y],[37,34+y],[37,45],[20,45]],NAVY_SHADE);P([[21,34+y],[25,33+y],[32,33+y],[36,35+y],[36,44],[21,44]],NAVY);
  P([[23,34+y],[28,40+y],[33,34+y],[32,38+y],[28,43],[24,38+y]],PLATE);R(26,41,5,3,PLATE);L(22,36+y,22,43,NAVY_LIGHT);
  R(20,44,17,2,NAVY_SHADE);R(27,44,3,2,PLATE);
 }
 // Arms. Heart Kreuz rests both hands on the planted sword's pommel.
 const rest=armored&&form===3&&!cast,fists=armored&&form===2;
 const lx=ultimate?35:cast?10:rest?26:15,ly=ultimate?30:cast?40:rest?45:49,rx=ultimate?43:cast?45:rest?30:41,ry=ultimate?24:cast?36:rest?45:49;
 const sleeve=form===1?BLACK:form===2?PLATE:SILVER,sleeveLight=form===1?BLACK_LIGHT:form===2?'#ffffff':SILVER_LIGHT;
 for(const [sx,sy,hx,hy]of [[19,36+y,lx,ly],[37,36+y,rx,ry]]){
  L(sx,sy,hx,hy,SKIN_SHADE,5);L(sx,sy,hx,hy-1,SKIN,3);
  if(armored){
   // Gauntlet from the elbow down (Black Wing covers the whole arm).
   const ex=form===1?sx:Math.round((sx+hx)/2),ey=form===1?sy:Math.round((sy+hy)/2);
   L(ex,ey,hx,hy,form===1?BLACK_SHADE:PLATE_SHADE,5);L(ex,ey,hx,hy-1,sleeve,3);L(ex,ey-1,hx,hy-2,sleeveLight);
   if(form===1)for(const t of [.35,.7])R(Math.round(sx+(hx-sx)*t)-2,Math.round(sy+(hy-sy)*t),5,1,GRAY);
   if(form===3){L(sx-2,sy+2,ex,ey,'#2c2f3d',2);}
  }
  R(hx-1,hy-1,4,4,fists?NAVY:form===1&&armored?BLACK:SKIN_LIGHT);
 }
 // Weapons.
 if(ultimate){sword(r,43,22,51,2,{wide:true});P([[45,17],[44,10],[49,3],[52,1],[51,10],[48,19]],GOLD);L(46,16,51,3,'#fff1c7',2);P([[39,23],[44,20],[49,22],[46,25],[42,26]],'#ba8d60');L(40,23,48,22,'#f6d48e');L(38,31,43,25,'#e2c386',2);}
 else if(armored&&form===2){
  // Adamantine fights bare-fisted; the shields stay on her back.
  if(cast){R(43,32,5,5,NAVY);R(44,33,3,2,NAVY_LIGHT);}
 }else if(armored&&form===1){
  // Black Wing's broad single-edged blade with a black hilt.
  if(cast)sword(r,rx,ry-3,51,10,{dark:true,wide:true});
  else{P([[14,51],[17,53],[6,70],[3,69]],'#f2f2f5');L(15,52,4,69,'#b9b9c6');R(13,48,4,4,BLACK);L(12,50,18,49,BLACK_LIGHT);}
 }else if(rest){
  // Sword planted point-down before her, both hands on the pommel.
  R(27,42,3,3,'#66516a');R(24,46,9,2,GOLD);R(25,46,7,1,'#f6e2a4');
  P([[26,48],[31,48],[30,66],[28,70],[27,66]],SILVER_SHADE);P([[27,48],[30,48],[29,66],[28,68]],SILVER_LIGHT);L(28,49,28,66,'#ffffff');
 }else{
  if(cast)sword(r,rx,ry-3,51,13,{});
  else sword(r,rx+1,ry+2,51,67,{});
  if(armored&&form===0)sword(r,lx-1,ly+2,5,66);
  if(casual&&form===2){P([[10,38],[17,36],[20,40],[19,48],[15,52],[9,47]],'#6685a0');L(14,39,14,48,GOLD,2);L(10,43,18,42,GOLD);}
  if(casual&&form===1){P([[34,35],[37,33],[42,36],[40,40],[36,39]],'#353448');L(37,35,40,36,'#a49ab6');}
 }
 R(25,30+y,7,5,SKIN);R(26,31+y,4,3,SKIN_LIGHT);face(r,{y,blink,expression,cast});hairFront(r,y,walk);
 if(casual){P([[19,38+y],[21,36+y],[23,37+y],[21,40+y],[20,40+y]],'#6796b3');}
 else if(form===0)wingCrown(r,y);
 else if(form===2)helmet(r,y);
 // Shoulder armour.
 if(armored){
  for(const s of [-1,1]){const p=(x,yy)=>[28+s*x,yy+y];
   if(form===3){P([p(6,33),p(9,30),p(14,31),p(14,37),p(10,39),p(6,37)],SILVER_SHADE);P([p(7,33),p(9,31),p(13,32),p(13,36),p(9,37)],SILVER);P([p(8,32),p(11,31),p(10,34)],SILVER_LIGHT);}
   else if(form===0){P([p(6,34),p(9,32),p(13,33),p(12,37),p(7,37)],'#9fb0c4');P([p(7,34),p(9,33),p(12,34),p(11,36)],'#eef3f7');}
   else if(form===1){P([p(6,33),p(9,31),p(14,32),p(14,37),p(8,38)],BLACK);L(...p(7,33),...p(13,33),GRAY);P([p(9,31),p(11,27),p(12,31)],BLACK);}
   else{P([p(5,35),p(8,30),p(15,30),p(16,37),p(11,40),p(6,39)],NAVY_SHADE);P([p(6,34),p(9,31),p(14,31),p(15,36),p(10,38)],PLATE);P([p(7,35),p(10,33),p(14,34),p(11,37)],NAVY);
    P([p(9,31),p(12,25),p(13,31)],PLATE);P([p(5,35),p(1,33),p(5,38)],PLATE);}
  }
 }
 if(requip){for(const [x,yy]of [[8,30],[45,29],[7,55],[47,57]]){P([[x,yy-3],[x+2,yy],[x,yy+3],[x-2,yy]],'#b9dfdf');R(x,yy,1,1,'#ffefd0');}}
 if(ultimate){for(const [x,yy]of [[4,30],[7,19],[43,7],[50,31],[47,45]]){P([[x,yy-2],[x+2,yy],[x,yy+2],[x-2,yy]],'#f4dc99');R(x,yy,1,1,'#fff6d9');}L(20,37,24,41,GOLD);L(31,42,35,37,GOLD);}
 return outline(r.pixels,INK);
}
// Navel shading on the bare midriff.
function put28(r,y){r.rect(28,y,1,1,SKIN_SHADE);}
