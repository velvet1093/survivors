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

export function erzaPixels({frame=0,moving=false,pose='',attack=false,expression='neutral',blink=false,skin='default',form=3,erzaForm}={}){
 frame=((frame%4)+4)%4;form=formIndex(erzaForm??form);
 const r=raster(),{poly:P,rect:R,line:L}=r,walk=moving?[0,1.5,0,-1.5][frame]:0,y=moving?-(frame%2):0,casual=skin==='casual',ultimate=pose==='nakagami'||pose==='chariot',requip=pose==='requip',cast=attack||ultimate||requip;
 // Rear hair flows separately from the armor, leaving the waist and shield readable.
 P([[17,18+y],[21,10+y],[32,9+y],[38,16+y],[40,34],[43+walk,49],[40+walk,58],[34,53],[31,42],[24,48],[17-walk,57],[12-walk,54],[15,40]],RED_DARK);
 P([[18,21+y],[23,13+y],[32,12+y],[36,19+y],[37,35],[40+walk,48],[38+walk,53],[34,47],[30,36],[23,44],[17-walk,52],[15-walk,51],[18,35]],RED);
 L(18,31,16-walk*.5,48,RED_MID);L(37,28,39+walk*.5,48,RED_LIGHT);L(20,37,19-walk*.3,49,'#d96b65');
 if(!casual)wings(r,form,walk,y);
 const dark=form===1?'#292a3c':BLUE_DARK,steel=form===1?'#56506a':SILVER,shine=form===1?'#a99db8':SILVER_LIGHT;
 // Articulated boots and separate greaves support a visible four-frame stride.
 for(const [x,d]of [[21,-walk],[30,walk]]){
  if(casual){R(x,53,5,9,SKIN);R(x+1,55,3,5,SKIN_LIGHT);P([[x,60],[x+5,60],[x+5+d,68],[x+3+d,70],[x-2+d,69]],'#413b49');L(x+1,62,x+1+d,67,'#746173');R(x-3+d,69,10,2,'#292d3c');R(x-2+d,68,7,1,'#a3949d');}
  else if(form===3){
   // Heart Kreuz keeps the classic dark knee-high boots beneath the cloth skirt.
   R(x+1,51,4,9,SKIN);P([[x,57],[x+6,57],[x+6+d,68],[x+3+d,70],[x-2+d,69]],'#293143');L(x+1,58,x+4,58,SILVER);L(x+2,60,x+2+d,67,'#596c85');R(x-3+d,69,10,2,INK);R(x-2+d,68,7,1,'#7e94a9');
  }else{
   P([[x,49],[x+6,49],[x+6+d,60],[x+6+d,68],[x-1+d,69],[x+d,58]],dark);
   P([[x+1,52],[x+5,52],[x+5+d,59],[x+4+d,66],[x+d,66]],steel);P([[x,57],[x+4,56],[x+6,59],[x+4,62],[x,61]],shine);L(x+2,62,x+2+d,67,shine);R(x-2+d,68,10,3,steel);R(x-1+d,68,8,1,shine);R(x-2+d,71,10,1,INK);
  }
 }
 if(casual){
  // Everyday Fairy Tail outfit: fitted white collared shirt, blue pleats and boots.
  P([[20,35+y],[25,33+y],[32,33+y],[37,36+y],[36,46],[33,49],[22,49],[19,43]],'#a4adb7');
  P([[22,35+y],[26,34+y],[31,34+y],[35,37+y],[34,46],[23,47],[21,41]],'#ececdf');
  P([[25,34+y],[28,38+y],[31,34+y],[32,36+y],[28,41],[23,36+y]],'#fff9e9');L(28,41,28,46,'#bcc8ca');R(29,42,1,1,'#7f8da1');R(29,45,1,1,'#7f8da1');
  P([[22,47],[34,47],[38+walk*.3,55],[35,58],[29,56],[23,58],[18+walk*.3,55]],BLUE_DARK);P([[23,49],[33,49],[35+walk*.3,55],[31,56],[27,54],[22,56],[20+walk*.3,54]],BLUE);L(23,50,22+walk*.3,55,'#a4afd0');L(28,50,28,54,'#a4afd0');L(32,50,33+walk*.3,55,'#8497bf');L(22,47,34,47,'#816357',2);R(27,47,4,2,GOLD);
 }else if(form===3){
  // Heart Kreuz: a fitted silver breastplate over the iconic blue pleated skirt.
  P([[20,34+y],[25,32+y],[32,32+y],[37,35+y],[36,43],[33,47],[22,47],[19,42]],SILVER_SHADE);
  P([[22,34+y],[26,34+y],[29,36+y],[32,34+y],[35,36+y],[34,42],[30,45],[23,43],[21,39]],SILVER);
  P([[23,35+y],[26,35+y],[28,38+y],[27,41],[23,40]],SILVER_LIGHT);P([[30,38+y],[33,35+y],[35,37+y],[34,40],[30,42]],'#d5e3e1');
  L(28,38+y,29,44,SILVER_SHADE);L(22,43,28,45,'#7e92aa');L(30,45,34,42,'#edf4e8');
  // Small dark cross marks the cuirass, with a leather belt and central buckle.
  R(25,39+y,1,4,'#4a5b75');R(24,40+y,3,1,'#4a5b75');R(21,45,15,3,'#694d4e');R(27,45,4,3,GOLD);R(28,46,2,1,'#fff0be');
  P([[22,48],[34,48],[38+walk*.3,56],[34,59],[29,57],[24,59],[18+walk*.3,56]],BLUE_DARK);
  P([[23,49],[33,49],[36+walk*.3,55],[33,57],[29,55],[25,57],[20+walk*.3,55]],BLUE);
  for(const [x,dx]of [[23,-1],[27,0],[31,1],[34,2]]){L(x,50,x+dx+walk*.3,56,'#879bc6');L(x+1,50,x+1+dx+walk*.3,55,'#3d517f');}
 }else if(form===2){
  // Broad Adamantine cuirass and layered faulds, visually heavier than the wings.
  P([[18,34+y],[25,31+y],[33,31+y],[40,35+y],[41,44],[37,51],[19,51],[15,43]],'#3d5576');
  P([[20,34+y],[27,34+y],[33,33+y],[38,36+y],[38,43],[33,47],[23,46],[18,41]],SILVER);P([[22,35+y],[27,37+y],[33,35+y],[36,38+y],[32,43],[26,42],[21,39]],'#d3e2e1');L(27,37+y,27,44,GOLD);L(20,42,27,45,GOLD);L(28,45,36,41,GOLD);
  for(const [x,dx]of [[19,-1],[30,1]]){P([[x,46],[x+8,46],[x+10+dx,54],[x+5,57],[x-1+dx,54]],'#577794');P([[x+1,48],[x+6,48],[x+8+dx,53],[x+5,54],[x+dx,52]],'#aec9d5');L(x+2,49,x+7,52,SILVER_LIGHT);}
  R(21,45,15,3,'#3b4b69');R(27,45,5,3,GOLD);R(28,46,3,1,'#f3e2aa');
 }else{
  P([[21,34+y],[26,32+y],[31,32+y],[36,35+y],[37,43],[33,47],[22,47],[19,41]],dark);
  P([[22,34+y],[26,34+y],[29,37+y],[32,34+y],[35,36+y],[34,42],[30,44],[23,43],[21,39]],steel);
  P([[22,35+y],[26,35+y],[28,38+y],[27,41],[23,40]],shine);P([[30,38+y],[33,35+y],[35,37+y],[34,40],[30,42]],shine);
  L(27,39+y,29,44,form===1?'#bfa1c3':SILVER_SHADE);R(21,45,15,3,dark);R(27,44,4,4,GOLD);R(28,45,2,2,'#f6ebc1');
  // Steel skirt panels overlap the blue fabric instead of reading as bare legs.
  P([[22,48],[34,48],[38+walk*.3,55],[32,58],[27,55],[22,58],[17+walk*.3,55]],dark);
  for(const [x,d]of [[20,-1],[26,0],[32,1]]){P([[x,48],[x+4,48],[x+5+d,55],[x+1+d,56],[x-1+d,53]],steel);L(x+1,49,x+1+d,54,shine);}
 }
 // Both hands support the raised severing sword during the Nakagami release.
 const lx=ultimate?35:cast?10:15,ly=ultimate?30:cast?40:49,rx=ultimate?43:cast?45:41,ry=ultimate?24:cast?36:49;
 for(const [sx,sy,hx,hy]of [[19,36+y,lx,ly],[37,36+y,rx,ry]]){
  L(sx,sy,hx,hy,SKIN_SHADE,5);L(sx,sy,hx,hy-1,SKIN,3);
  if(!casual){P([[sx-3,sy-3],[sx+3,sy-5],[sx+6,sy],[sx+3,sy+4],[sx-3,sy+2]],steel);L(sx-1,sy-3,sx+3,sy-3,shine);L(hx-1,hy-5,hx,hy,steel,5);L(hx,hy-4,hx+1,hy-1,shine);}
  R(hx-1,hy-1,4,4,SKIN_LIGHT);
 }
 if(!casual&&form===2&&!ultimate){shield(r,cast?11:13,cast?45:48,-1,cast);shield(r,cast?44:43,cast?42:48,1,cast);}
 else{
  if(ultimate){sword(r,43,22,51,2,{wide:true});P([[45,17],[44,10],[49,3],[52,1],[51,10],[48,19]],GOLD);L(46,16,51,3,'#fff1c7',2);P([[39,23],[44,20],[49,22],[46,25],[42,26]],'#ba8d60');L(40,23,48,22,'#f6d48e');L(38,31,43,25,'#e2c386',2);}
  else if(cast)sword(r,rx,ry-3,51,13,{dark:form===1,wide:form===1});
  else sword(r,rx+1,ry+2,51,67,{dark:form===1,wide:form===1});
  if(!casual&&form===0&&!ultimate)sword(r,lx-1,ly+2,5,66);
  if(casual&&form===2){P([[10,38],[17,36],[20,40],[19,48],[15,52],[9,47]],'#6685a0');L(14,39,14,48,GOLD,2);L(10,43,18,42,GOLD);}
  if(casual&&form===1){P([[34,35],[37,33],[42,36],[40,40],[36,39]],'#353448');L(37,35,40,36,'#a49ab6');}
 }
 R(25,30+y,7,5,SKIN);R(26,31+y,4,3,SKIN_LIGHT);face(r,{y,blink,expression,cast});hairFront(r,y,walk);
 // Tiny blue Fairy Tail mark and a silver side ornament tie the outfits together.
 if(casual){P([[19,38+y],[21,36+y],[23,37+y],[21,40+y],[20,40+y]],'#6796b3');}
 else if(form===0){P([[36,13+y],[40,11+y],[41,14+y],[38,17+y],[36,16+y]],SILVER_SHADE);L(38,13+y,39,14+y,SILVER_LIGHT);}
 if(requip){for(const [x,yy]of [[8,30],[45,29],[7,55],[47,57]]){P([[x,yy-3],[x+2,yy],[x,yy+3],[x-2,yy]],'#b9dfdf');R(x,yy,1,1,'#ffefd0');}}
 if(ultimate){for(const [x,yy]of [[4,30],[7,19],[43,7],[50,31],[47,45]]){P([[x,yy-2],[x+2,yy],[x,yy+2],[x-2,yy]],'#f4dc99');R(x,yy,1,1,'#fff6d9');}L(20,37,24,41,GOLD);L(31,42,35,37,GOLD);}
 return outline(r.pixels,INK);
}
