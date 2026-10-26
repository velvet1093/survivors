import {raster,outline} from './pixel-characters.js';
import {drawCasualHairBack,drawCasualFace,drawCasualHairFront} from './casual-art.js';
import {erzaPixels} from './erza-art.js';
import {PAJAMA_OUTFITS} from './pajama-outfits.js';
export {PAJAMA_OUTFITS} from './pajama-outfits.js';

const INK='#2b3042',SKIN='#ffe0c6',SKIN_SHADE='#d2a58f',WHITE='#fff2df';
const PALETTES={
 goku:['#e8a16b','#ae6550','#ffd2a2','#466a8d'],gojo:['#a7d3df','#6f99b5','#e4f1e8','#f4e8ca'],naruto:['#de995c','#996147','#f8c88a','#eee2b9'],madoka:['#dea0bc','#a36691','#ffe1e5','#fff4df'],maomao:['#6c9e8a','#3c6c63','#a8c9a9','#e5d3b8'],shinji:['#708bb3','#425575','#acc9df','#d6e3dc'],esdeath:['#a4c4dc','#657f9f','#e4f3ed','#fbf3dc'],kurumi:['#9f5d75','#643b58','#d796a7','#eee0cb'],frieren:['#e1d7bf','#aaa48f','#fff3d6','#a497ad'],samus:['#e1c26e','#a18448','#fff0ae','#5f7899'],megumi:['#505d74','#303c51','#929eaf','#cdd5cc'],eren:['#697f69','#3e554b','#a7b99b','#d7cbb0'],yuki:['#e5d9bf','#a99c89','#fff0d7','#a45e6f'],diavolo:['#8f729f','#51435f','#c2a1c9','#d7bf8f'],rimuru:['#99cbd1','#548c9f','#d8f0e3','#f0e1bd'],featherine:['#b099c6','#725d8c','#e6c8df','#9fbd8b'],erza:['#e0b7b8','#a97987','#ffede2','#b95768'],
};
function star(r,x,y,c){r.line(x-2,y,x+2,y,c);r.line(x,y-2,x,y+2,c);r.rect(x-1,y-1,3,3,c);}
function paw(r,x,y,c){r.rect(x,y+2,4,3,c);r.rect(x-1,y,1,2,c);r.rect(x+1,y-1,1,2,c);r.rect(x+3,y,1,2,c);}
function rose(r,x,y,c,leaf='#87a98b'){r.rect(x,y,3,3,c);r.rect(x+1,y+1,1,1,WHITE);r.line(x+1,y+3,x+1,y+6,leaf);r.rect(x+2,y+4,2,1,leaf);}
function clock(r,x,y,c){r.rect(x,y,5,5,c);r.rect(x+1,y+1,3,3,'#6d4b62');r.line(x+2,y+1,x+2,y+3,WHITE);r.line(x+2,y+3,x+3,y+3,WHITE);}
function slipper(r,id,x,yy,side,c){
 const {rect:R,poly:P,line:L}=r,animal=['naruto','megumi','shinji','samus','rimuru'].includes(id);
 P([[x-3,yy],[x+5,yy],[x+7,yy+2],[x+7,yy+4],[x-3,yy+4]],c);
 L(x-2,yy+4,x+6,yy+4,'#d6d5c6');L(x-1,yy+1,x+4,yy+1,WHITE);
 if(id==='naruto'||id==='megumi'){P([[x-2,yy+1],[x-2,yy-3],[x+1,yy],[x+4,yy-3],[x+5,yy+1]],id==='naruto'?'#c7834e':'#84939e');R(x-1,yy+1,1,1,INK);R(x+3,yy+1,1,1,INK);R(x+1,yy+2,1,1,INK);}
 if(id==='shinji'){R(x-1,yy-1,5,4,'#263c54');R(x,yy,3,3,WHITE);R(x,yy,1,1,INK);R(x+2,yy,1,1,INK);R(x+1,yy+1,2,1,'#dca563');}
 if(id==='samus'){P([[x-2,yy+2],[x-1,yy-2],[x+2,yy-3],[x+5,yy-1],[x+6,yy+2]],'#759c8c');R(x-1,yy,2,2,'#cfe9b9');R(x+3,yy,2,2,'#cfe9b9');R(x,yy,1,1,'#425c55');R(x+3,yy,1,1,'#425c55');}
 if(id==='rimuru'){P([[x-2,yy+2],[x-1,yy-1],[x+3,yy-2],[x+6,yy+1],[x+6,yy+3]],'#94c8d3');R(x,yy+1,1,1,INK);R(x+3,yy+1,1,1,INK);L(x+1,yy+2,x+2,yy+2,'#538492');}
 if(!animal){R(x+1,yy-1,3,3,WHITE);if(['madoka','frieren','featherine'].includes(id)){R(x-1,yy,2,2,c);R(x+4,yy,2,2,c);}}
}
function legs(r,id,m,{shorts=false,gown=false}={}){
 const {poly:P,rect:R,line:L}=r,[c,d,l,trim]=PALETTES[id],{walk,y}=m;
 for(const [x,s,side]of [[21,-walk,-1],[31,walk,1]]){
  if(gown||shorts){R(x+s,shorts?58:64,4,shorts?11:5,SKIN_SHADE);R(x+1+s,shorts?59:65,3,shorts?9:4,SKIN);}
  else{P([[x-2,51+y],[x+6,51+y],[x+6+s,60],[x+5+s,68],[x-2+s,68],[x-1+s,60]],d);P([[x,53+y],[x+4,53+y],[x+4+s,60],[x+3+s,67],[x-1+s,67]],c);L(x+1,55,x+1+s,64,l);R(x-1+s,65,6,3,trim);L(x+s,65,x+4+s,65,l);}
  if(shorts){P([[x-2,50],[x+6,50],[x+7+s,58],[x-3+s,58]],d);P([[x,51],[x+4,51],[x+5+s,56],[x-1+s,56]],trim);L(x-1+s,57,x+5+s,57,l);}
  slipper(r,id,x+s,68,side,trim);
 }
}
function arms(r,id,m,{wide=false,short=false}={}){
 const {line:L,rect:R,poly:P}=r,[c,d,l,trim]=PALETTES[id],{walk,y,cast,frame}=m,pulse=cast?[0,-2,1,-1][frame]:0;
 const hands=[[15-walk*.3,cast?48-pulse:54+walk*.3],[cast?43+pulse:40+walk*.3,cast?36+pulse:54-walk*.3]];
 hands.forEach(([x,hy],i)=>{
  const sx=i?36:19,ex=i?(cast?40:39):16-walk*.2,ey=i&&cast?41:46+y;
  L(sx,39+y,ex,ey,d,wide?8:6);L(sx+1,40+y,ex+1,ey,c,wide?6:4);
  L(ex,ey,x,hy,short?SKIN_SHADE:d,wide?6:4);L(ex+1,ey,x+1,hy,short?SKIN:c,wide?4:3);
  if(!short){L(x-1,hy-1,x+4,hy-1,trim,3);L(x,hy-2,x+3,hy-2,l);}
  R(x,hy,4,4,SKIN);R(x,hy+3,3,1,SKIN_SHADE);L(sx+1,40+y,ex+1,ey-1,l);
 });return hands;
}
function torso(r,id,m,{robe=false,onesie=false,shorts=false,gown=false}={}){
 const {poly:P,line:L,rect:R}=r,[c,d,l,trim]=PALETTES[id],{y,walk}=m;
 P([[21,36+y],[26,35+y],[31,35+y],[36,38+y],[38,48],[35,56],[20,56],[18,46]],d);
 P([[22,38+y],[26,37+y],[31,37+y],[34,39+y],[35,49],[33,54],[22,54],[21,47]],c);
 if(gown||robe){P([[20,48],[36,48],[38+walk*.3,59],[41+walk*.4,67],[36,69],[27,68],[18,69],[14+walk*.4,67],[17+walk*.3,58]],d);P([[22,49],[34,49],[35+walk*.3,59],[38+walk*.4,66],[31,67],[25,65],[19+walk*.4,67],[17+walk*.3,65]],c);for(const x of [22,28,34])L(x,54,x+walk*.3,65,l);L(17+walk*.4,66,24,68,trim,2);L(29,67,38+walk*.4,66,trim,2);}
 if(robe){P([[24,35+y],[28,40+y],[32,35+y],[35,38+y],[28,48],[20,41+y]],trim);L(25,38+y,30,44,l);L(32,39,24,50,l);R(19,49,18,4,trim);L(20,49,36,49,l);P([[28,51],[33,49],[35,53],[30,54],[26,51],[23,55],[20,52],[24,49]],l);L(29,53,30+walk,63,trim,2);}
 else if(gown){P([[22,36+y],[28,40+y],[34,36+y],[35,39+y],[28,44+y],[21,39+y]],WHITE);R(24,41,8,3,trim);P([[27,42],[23,40],[23,44],[27,44],[32,40],[33,44],[29,44]],trim);R(27,42,2,2,l);L(22,46,34,46,l);}
 else{P([[23,36+y],[27,39+y],[32,36+y],[34,38+y],[30,44],[28,41],[25,44],[21,39]],trim);L(24,38,27,41,WHITE);L(32,38,29,41,WHITE);L(28,42,28,54,d);L(29,43,29,54,l);for(const yy of [43,47,51])R(29,yy,1,1,WHITE);R(20,52,16,3,trim);L(21,52,35,52,l);R(32,44,4,4,trim);R(33,44,2,1,l);}
 if(onesie){P([[19,36+y],[22,33+y],[27,37+y],[31,33+y],[36,36+y],[35,41],[29,44],[23,41]],trim);L(21,36,26,40,l);L(33,36,30,40,l);R(23,47,11,5,trim);L(24,47,33,47,l);L(27,47,27,51,l);}
}
function patterns(r,id,m){
 const {rect:R,line:L,poly:P}=r,[c,d,l,trim]=PALETTES[id],{y,walk}=m;
 if(id==='goku'){for(const [x,yy]of [[22,45],[32,57],[22,61]]){R(x,yy,5,2,trim);R(x+1,yy-1,3,1,l);}star(r,24,47,'#eac56f');}
 if(id==='gojo'){for(const [x,yy]of [[23,46],[31,59],[22,62]]){P([[x-2,yy],[x,yy-2],[x+3,yy],[x,yy+2]],l);R(x,yy-1,1,2,'#5d88ab');}L(21,55,24,64,trim);}
 if(id==='naruto'){R(21,44,4,4,WHITE);R(22,45,1,1,d);P([[31,47],[35,46],[35,49],[33,51],[31,49]],WHITE);L(22,57,25,58,l);L(31,60,34,61,l);}
 if(id==='madoka'){rose(r,22,49,'#b76b94');rose(r,32,57,'#b76b94');R(17+walk*.3,64,21,3,WHITE);for(const x of [18,23,28,33])R(x+walk*.3,66,3,2,l);}
 if(id==='maomao'){rose(r,32,41,'#e6d5b5');rose(r,20,58,'#c4d3aa');P([[34,56],[37,58],[33,62]],'#86ad8c');L(31,54,31+walk,65,l);}
 if(id==='shinji'){for(const x of [22,25,32,34]){L(x,43,x,51,l);L(x<28?x-1:x,56,x<28?x-1-walk:x+walk,64,l);}R(22,44,4,4,WHITE);R(23,44,2,2,d);R(23,46,3,1,'#d3a369');}
 if(id==='esdeath'){star(r,24,49,WHITE);star(r,33,59,WHITE);L(19,65,37,65,WHITE,2);R(22,46,12,2,'#c1d8e4');}
 if(id==='kurumi'){clock(r,21,44,'#d8bc88');clock(r,31+walk,60,'#d8bc88');R(20,51,16,3,WHITE);for(const x of [21,25,29,33])R(x,54,2,1,l);}
 if(id==='frieren'){for(const [x,yy]of [[22,49],[31,60]]){star(r,x,yy,'#bdb0be');R(x+1,yy+1,2,2,l);}L(20,65,37,65,WHITE,2);R(23,44,10,2,'#cfc2c9');}
 if(id==='samus'){R(22,44,4,5,'#799e8a');R(23,45,2,2,'#c7dfb2');for(const x of [22,32]){R(x,58,3,2,l);R(x+1,59,2,2,'#a08a66');}L(20,52,35,52,'#506985',2);}
 if(id==='megumi'){paw(r,23,45,WHITE);paw(r,31+walk,58,'#b4c1c6');R(21,53,14,2,l);}
 if(id==='eren'){for(const [x,yy,s]of [[23,45,-1],[25,46,1]]){L(x,yy,x+s*2,yy-3,l);L(x,yy+1,x+s*2,yy-1,l);L(x,yy+2,x+s*2,yy+1,l);}L(24,57,23-walk,63,trim);R(31+walk,60,4,2,l);}
 if(id==='yuki'){star(r,24,45,'#ba8b7b');for(const [x,yy]of [[22-walk,59],[33+walk,63]])star(r,x,yy,'#e8c99d');R(21,51,15,3,'#9f5d6a');L(28,52,25,57,l);L(29,52,33,57,l);}
 if(id==='diavolo'){for(const [x,yy]of [[23,43],[33,57],[21,62]]){R(x,yy,2,2,'#d0abc5');R(x+2,yy+1,1,2,l);}L(20,64,38,64,trim,2);R(22,52,12,2,'#baa082');}
 if(id==='rimuru'){P([[22,46],[24,42],[29,43],[31,47],[29,49],[24,49]],'#b6e5de');R(24,46,1,1,'#5d8c9a');R(28,46,1,1,'#5d8c9a');L(21,56,24,56,l);L(31,61,34,61,l);}
 if(id==='featherine'){for(const [x,yy]of [[23,45],[32,60]]){P([[x+2,yy-2],[x-1,yy],[x,yy+3],[x+3,yy+4],[x+1,yy+1]],'#f0dfb8');}R(20,50,16,3,trim);L(31,53,32+walk*.2,66,trim,3);R(29,54,6,9,trim);L(30,54,30,62,l);}
 if(id==='erza'){for(const [x,yy]of [[22,45],[32+walk,60],[22-walk,62]]){P([[x,yy],[x+3,yy],[x+4,yy+2],[x+2,yy+5],[x-1,yy+2]],'#bd5d70');R(x,yy+1,1,1,'#ffd8b0');R(x+2,yy+2,1,1,'#ffd8b0');L(x,yy-1,x+3,yy-1,'#7e9d74');}L(22,56,22-walk,63,'#c37a89');L(33,56,33+walk,63,'#c37a89');}
}
function erzaHairBack(r,m){
 const {poly:P,line:L}=r,{y,walk}=m;P([[17,18+y],[22,9+y],[33,10+y],[38,17+y],[40,35],[43+walk,51],[39+walk,58],[32,44],[24,49],[17-walk,57],[13-walk,53],[16,37]],'#672b40');P([[19,20+y],[24,13+y],[32,13+y],[36,20+y],[37,37],[40+walk,51],[35,45],[29,38],[23,45],[17-walk,52],[16,46]],'#b34250');L(18,29,17-walk*.3,47,'#d45a5e');L(37,27,39+walk*.3,48,'#f28a78');
}
function erzaHead(r,m){
 const source=erzaPixels({...m,skin:'casual'});for(let y=0;y<38;y++)for(let x=12;x<=41;x++){const color=source[y*56+x];if(color)r.put(x,y,color);}
}
function costumeDetails(r,id,m,hands){
 const {poly:P,line:L,rect:R}=r,{y,cast,frame,form}=m;
 if(id==='shinji'){P([[30,11+y],[36,7+y],[41,13+y],[44,18+y],[40,20+y],[37,14+y],[31,14+y]],'#657fa5');L(31,13+y,38,12+y,'#cfdfde',2);R(41,18+y,4,4,WHITE);}
 if(id==='samus'){P([[31,11+y],[36,9+y],[42,13+y],[43,21+y],[39,19+y],[37,14+y],[32,14+y]],'#e3c773');L(31,13+y,37,13+y,'#fff0c9',2);R(40,20+y,4,4,WHITE);}
 if(id==='naruto'){for(const [x,side]of [[17,-1],[38,1]]){P([[x,22+y],[x+side*3,12+y],[x+side*7,20+y],[x+side*5,25+y]],'#bf7c48');P([[x+side,21+y],[x+side*3,16+y],[x+side*5,21+y]],'#f1dfba');}R(24,35+y,9,3,'#eedcb4');}
 if(id==='madoka'){for(const x of [12,40]){P([[x,21+y],[x-3,18+y],[x-4,23+y],[x,24+y],[x+4,19+y],[x+5,24+y]],WHITE);R(x,22+y,2,2,'#d58da9');}}
 if(id==='frieren'){P([[30,13+y],[36,8+y],[43,14+y],[42,22+y],[38,24+y],[37,17+y],[31,16+y]],'#e4dcc7');L(31,15+y,38,15+y,WHITE,2);R(39,22+y,4,4,'#b9a6be');}
 if(id==='yuki'){R(21,36+y,14,3,'#f6e8cf');R(24,38+y,9,2,'#d2bfb0');}
 if(id==='erza'){
  const index=typeof form==='number'?Math.max(0,Math.min(3,form)):0,[x,hy]=hands[1],color=index===1?'#8e80aa':'#c4dce4';
  if(index===2){P([[x-4,hy-8],[x+4,hy-10],[x+9,hy-5],[x+8,hy+4],[x+2,hy+9],[x-4,hy+3]],'#527696');P([[x-2,hy-6],[x+3,hy-8],[x+7,hy-4],[x+6,hy+3],[x+2,hy+6],[x-2,hy+2]],'#afd2db');L(x+2,hy-6,x+2,hy+5,'#e2c68d');}
  else{const tx=cast?Math.min(52,x+6):49,ty=cast?13+[0,1,-1,2][frame]:52;L(x,hy+2,tx,ty,'#5a526a',3);L(x,hy+1,tx,ty,color,2);L(x-3,hy+1,x+4,hy+3,'#d5b67e',2);L(x,hy+3,x-2,hy+9,'#795a67',2);}
 }
}
export function pajamaPixels(id,{frame=0,moving=false,pose='',attack=false,expression='neutral',blink=false,form=0}={}){
 if(!PAJAMA_OUTFITS[id]||(id==='eren'&&form)||(id==='rimuru'&&(form==='slime'||pose==='predator'))||(id==='samus'&&pose==='bomb'))return null;
 frame=((frame%4)+4)%4;const m={frame,moving,pose,attack,expression,blink,form,walk:moving?[0,2,0,-2][frame]:0,y:moving?-(frame%2):0,cast:attack||!!pose};
 const r=raster(),gown=['madoka','esdeath','frieren','featherine'].includes(id),robe=['maomao','diavolo'].includes(id),onesie=['naruto','rimuru'].includes(id),shorts=['kurumi','samus'].includes(id),style={gown,robe,onesie,shorts};
 if(id==='erza')erzaHairBack(r,m);else drawCasualHairBack(r,id,m);
 legs(r,id,m,style);const hands=arms(r,id,m,{wide:robe||gown,short:id==='yuki'});torso(r,id,m,style);patterns(r,id,m);
 if(id==='erza')erzaHead(r,m);else{drawCasualFace(r,id,m);drawCasualHairFront(r,id,m);}costumeDetails(r,id,m,hands);
 if(id==='erza'&&pose==='nakagami'){const x=hands[1][0],hy=hands[1][1];r.line(x,hy,51,10,'#f1d899',3);r.line(x,hy,51,10,'#fff1c7');star(r,45,17,'#e8ca8a');}
 return outline(r.pixels,INK);
}
