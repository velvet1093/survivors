import {gokuHairBack,gokuFace,gokuHairFront} from './goku-art.js';
import {raster,outline} from './pixel-characters.js';

// Everyday outfits are individually cut and shaded. Hair, compact faces and
// signature accessories keep each hero recognizable without their battle gear.
import {CASUAL_OUTFITS} from './casual-outfits.js';
export {CASUAL_OUTFITS} from './casual-outfits.js';
const INK='#2b3042',SKIN='#ffe0c6',SKIN_SHADE='#d2a58f',WHITE='#f5ecd9';
const HAIR={
 goku:['#171e29','#0e1420','#364354'],gojo:['#e5e6f0','#9da8c3','#fff9ee'],naruto:['#f2cd68','#b9883d','#fff0a5'],madoka:['#e9a3bd','#a66188','#ffd9e3'],maomao:['#2e574c','#193938','#6c9181'],shinji:['#303847','#1b2535','#5a6879'],esdeath:['#9ecfe6','#567fa3','#d4eff2'],kurumi:['#30303d','#171e2c','#646174'],frieren:['#dededc','#909fac','#fff2df'],samus:['#e9c36c','#a88249','#ffebac'],megumi:['#283343','#182332','#526270'],eren:['#57463f','#302c30','#8c7260'],yuki:['#e1cf83','#9f8d57','#fff0bc'],diavolo:['#d898b5','#915d88','#f0bfd0'],rimuru:['#99cada','#5e8cac','#d9f0ec'],featherine:['#644d79','#392f4b','#a88ab1'],
};
const EYES={goku:'#304452',gojo:'#61c1e6',naruto:'#4889b4',madoka:'#b65e8b',maomao:'#8674a7',shinji:'#5a7e93',esdeath:'#548cb6',kurumi:'#b95671',frieren:'#5a9a85',samus:'#6597a2',megumi:'#54716e',eren:'#77a894',yuki:'#9b7f65',diavolo:'#77a47d',rimuru:'#c7a054',featherine:'#a083b2'};
const LONG=new Set(['esdeath','kurumi','yuki','featherine','eren']);
function hairBack(r,id,m){
 if(id==='goku')return gokuHairBack(r,{y:m.y,stage:m.form||0});
 const {y,walk}=m;
 const [hair,dark,light]=HAIR[id],{poly:P,line:L,rect:R}=r;
 if(LONG.has(id)){
  P([[16,18+y],[21,10+y],[33,10+y],[39,18+y],[40,35],[42+walk,52],[38+walk,58],[32,52],[28,40],[23,53],[16-walk,57],[14-walk,52],[16,35]],dark);
  P([[18,22+y],[22,13+y],[33,13+y],[37,21+y],[37,37],[39+walk,50],[35,48],[30,38],[24,45],[18-walk,53],[17,46]],hair);
  L(18,29,17-walk,47,light);L(37,29,39+walk,49,light);
 }
 if(['madoka','frieren'].includes(id))for(const side of [-1,1]){
  const x=side<0?13:39;
  P([[x,19+y],[x+5,18+y],[x+7,27],[x+8+walk*side,42],[x+5+walk*side,49],[x+1+walk*side,45],[x-1,32]],dark);
  P([[x+1,21+y],[x+4,21+y],[x+5,30],[x+6+walk*side,41],[x+4+walk*side,45],[x+2,37]],hair);
  L(x+2,26,x+3+walk*side,40,light);
  if(id==='madoka'){P([[x+2,21+y],[x-2,17+y],[x-3,23+y],[x+2,24+y],[x+6,19+y],[x+7,25+y]],'#b95f84');R(x+1,22+y,3,2,'#f4c1cb');}
 }
 if(id==='samus'){
  P([[35,13+y],[41,12+y],[46,21],[47+walk,39],[43+walk,52],[40+walk,51],[40,35],[36,25]],dark);
  P([[38,16+y],[41,15+y],[44,23],[44+walk,38],[42+walk,47],[42,30]],hair);L(41,21,43+walk,38,light);R(37,16+y,5,3,'#558da7');
 }
 if(id==='maomao'){
  P([[26,14+y],[28,6+y],[34,4+y],[39,8+y],[38,15+y]],dark);P([[28,12+y],[31,7+y],[35,7+y],[37,10+y],[35,14+y]],hair);L(29,8+y,36,9+y,light);
  P([[15,21+y],[17,15+y],[37,15+y],[40,23+y],[37,37],[19,37]],dark);
 }
 if(id==='featherine'){
  // Side crescents emerge from the concealed rear band; the crown stays open.
  P([[18,14+y],[12,16+y],[8,21+y],[9,25+y],[15,30+y],[20,33+y],[16,28+y],[13,24+y],[13,20+y],[18,17+y]],'#87969e');
  P([[17,16+y],[12,18+y],[10,22+y],[12,26+y],[19,32+y],[15,27+y],[13,23+y],[14,20+y]],'#eeeede');
  P([[36,14+y],[42,17+y],[46,22+y],[45,26+y],[39,31+y],[35,33+y],[39,28+y],[41,24+y],[40,20+y],[36,17+y]],'#87969e');
  P([[37,16+y],[41,19+y],[44,23+y],[42,27+y],[36,32+y],[40,27+y],[42,23+y],[39,19+y]],'#eeeede');
 }
}
function trousers(r,{walk,y},style={}){
 const {poly:P,rect:R,line:L}=r,{color='#43546b',shade='#2c394e',light='#75899b',shoe='#303647',cuff=false}=style;
 for(const [x,d]of [[20,-walk],[30,walk]]){
  P([[x,51+y],[x+7,51+y],[x+6+d,64],[x+7+d,68],[x-1+d,68],[x+d,60]],shade);
  P([[x+1,53+y],[x+5,53+y],[x+4+d,64],[x+5+d,67],[x+d,67]],color);L(x+2,55,x+2+d,63,light);
  R(x-2+d,68,10,4,shoe);R(x-1+d,68,7,1,light);R(x-2+d,71,10,1,'#c6c9c1');
  if(cuff)R(x-1+d,64,7,3,light);
 }
}
function skirt(r,{walk,y},{color,shade,light,length=62,stockings=true,pleats=true}={}){
 const {poly:P,line:L,rect:R}=r;
 for(const [x,d]of [[21,-walk],[31,walk]]){R(x+d,length-1,4,70-length,stockings?'#394154':SKIN);R(x-2+d,68,9,4,'#333342');R(x-1+d,68,6,1,'#7c7585');R(x-2+d,71,9,1,'#b8aba7');}
 P([[20,49+y],[35,49+y],[38+walk*.6,length-4],[41+walk*.5,length],[35+walk*.5,length+2],[27,length+1],[18+walk*.5,length+2],[15+walk*.5,length]],shade);
 P([[22,51+y],[33,51+y],[36+walk*.5,length-3],[37+walk*.5,length],[29,length-1],[21+walk*.5,length],[18+walk*.5,length-1]],color);
 if(pleats)for(const x of [22,27,32])L(x,52+y,x+walk*.4,length,light);
 L(18+walk*.5,length,24+walk*.4,length+1,light);L(29,length+1,37+walk*.5,length,light);
}
function sleeves(r,id,m,{color,shade,light,short=false,open=false}={}){
 const {line:L,rect:R,poly:P}=r,{y,walk,cast}=m;
 const pulse=cast?[0,-2,0,1][m.frame]:0,hands=[[15-walk*.35,cast?44-pulse:53+walk*.35],[cast?45+pulse:40+walk*.35,cast?35+pulse:53-walk*.35]];
 for(let i=0;i<2;i++){
  const shoulder=i?36:18,[x,hy]=hands[i],elbow=i?(cast?42:39):(17-walk*.25),ey=cast&&i?39:46+y;
  L(shoulder,39+y,elbow,ey,shade,6);L(shoulder+1,40+y,elbow+1,ey,color,4);
  L(elbow,ey,x,hy,short?SKIN_SHADE:shade,4);L(elbow+1,ey,x+1,hy,short?SKIN:color,3);
  L(shoulder+1,40+y,elbow+1,ey-1,light);R(x,hy,4,4,SKIN);R(x,hy+3,3,1,SKIN_SHADE);
  if(!short)R(x-1,hy-1,5,2,light);
 }
 return hands;
}
function torso(r,m,{color,shade,light,shirt=WHITE,open=false,hood=false,crop=false}={}){
 const {poly:P,rect:R,line:L}=r,{y}=m,bottom=crop?49:55;
 P([[21,36+y],[26,35+y],[31,35+y],[36,38+y],[38,47],[35,bottom],[20,bottom],[18,46]],shade);
 P([[22,38+y],[26,37+y],[31,37+y],[34,39+y],[35,47],[33,bottom-1],[22,bottom-1],[21,46]],color);
 R(22,41,2,bottom-42,light);R(33,42,2,bottom-43,shade);
 P([[24,36+y],[28,39+y],[32,36+y],[32,40+y],[28,43+y],[23,39+y]],shirt);
 if(open){P([[26,40+y],[30,40+y],[32,bottom],[24,bottom]],shirt);L(23,38+y,25,bottom-1,light);L(33,38+y,31,bottom-1,light);}
 else{L(28,42+y,28,bottom-2,shade);for(let yy=44;yy<bottom;yy+=4)R(29,yy,1,1,light);}
 R(23,bottom-1,11,2,shade);
 if(hood){P([[20,35+y],[24,33+y],[27,37+y],[31,34+y],[35,35+y],[34,39+y],[29,42+y],[24,40+y]],shade);L(22,36+y,26,39+y,light);L(32,36+y,30,39+y,light);L(25,40+y,24,45,shirt);L(31,40+y,32,45,shirt);}
}
function outfit(r,id,m){
 const {rect:R,line:L,poly:P}=r,{y,walk}=m;
 const outfits={
 goku:{color:'#cf7845',shade:'#874b3b',light:'#f3b16b',open:true},gojo:{color:'#b1d6dd',shade:'#7296af',light:'#e3eddf',short:true},naruto:{color:'#48495a',shade:'#2b3348',light:'#8c8f96',hood:true},madoka:{color:'#e3c79e',shade:'#a58e83',light:'#fff0cf',open:true,shirt:'#c97e9e'},maomao:{color:'#eee4ca',shade:'#a9ac9a',light:'#fff3dc',short:true},shinji:{color:'#7495b3',shade:'#445979',light:'#adc9d0',open:true,short:true},esdeath:{color:'#485c7b',shade:'#2d3c58',light:'#91a7bb',open:true},kurumi:{color:'#b36579',shade:'#754556',light:'#dba2a3'},frieren:{color:'#d7ccb1',shade:'#a19a92',light:'#fff0d5'},samus:{color:'#c48655',shade:'#835947',light:'#edb87f',open:true,crop:true,shirt:'#344e68'},megumi:{color:'#7a8790',shade:'#465464',light:'#b3c0be',hood:true,open:true,shirt:'#416b65'},eren:{color:'#65725d',shade:'#3d4c45',light:'#a5ad8e',open:true,shirt:'#adaca1'},yuki:{color:'#e9e1cf',shade:'#b2aca1',light:'#fff4df',short:true,crop:true},diavolo:{color:'#504560',shade:'#302f45',light:'#8f6d8e',open:true,shirt:'#a67d9b'},rimuru:{color:'#d8d0b2',shade:'#92998e',light:'#f5ebd0',hood:true},featherine:{color:'#b49bc3',shade:'#796786',light:'#e2c7d9'},
 },c=outfits[id];
 const skirts={madoka:{color:'#c58aa7',shade:'#885a7d',light:'#edbfd2',length:64,stockings:false},maomao:{color:'#5b8876',shade:'#345d56',light:'#95bca0',length:66,stockings:false},kurumi:{color:'#464051',shade:'#292e3e',light:'#7b6a7c',length:61},frieren:{color:'#827390',shade:'#51485f',light:'#b4a1b7',length:61},featherine:{color:'#8d506a',shade:'#54384f',light:'#b67b91',length:68}};
 if(skirts[id])skirt(r,m,skirts[id]);else trousers(r,m,id==='diavolo'?{color:'#d8d0c1',shade:'#9b94a1',light:'#f9e8cf'}:id==='yuki'?{color:'#89946c',shade:'#515e52',light:'#bec29a',cuff:true}:id==='goku'?{color:'#3c4557',shade:'#242d41',light:'#697887',shoe:'#426783'}:id==='samus'?{color:'#6382a1',shade:'#384f70',light:'#a2b6c6',shoe:'#694d43'}:{});
 sleeves(r,id,m,c);torso(r,m,c);
 // Different collars, seams, pockets and accessories belong to each garment.
 if(id==='goku'){R(19,41+y,3,4,'#edc881');R(20,42+y,1,2,'#a06b47');R(33,47,3,3,'#654435');L(22,52,25,52,'#e0a66f');}
 if(id==='gojo'){L(25,38+y,27,41+y,'#f5ecd9');L(31,38+y,29,41+y,'#f5ecd9');R(31,44,4,3,'#8baebe');L(24,40+y,26,45,'#3a3d4b');R(24,43,5,2,'#344557');R(24,43,1,1,'#a3c5c9');}
 if(id==='naruto'){P([[19,39+y],[23,41+y],[23,52],[19,51]],'#ce894e');P([[33,40+y],[36,40+y],[37,50],[33,51]],'#ce894e');R(24,49,9,3,'#373c4e');L(28,42+y,28,52,'#b8b6a2');}
 if(id==='madoka'){R(20,45,4,4,'#c5ab91');R(33,45,3,4,'#c5ab91');P([[26,40+y],[23,39+y],[23,42+y],[27,42+y],[31,39+y],[32,42+y],[28,43+y]],'#b96687');R(27,41+y,2,2,'#ecc3cd');}
 if(id==='maomao'){P([[23,40+y],[32,40+y],[35,55],[21,55]],'#5b8876');L(23,38+y,24,43+y,'#477664',2);L(32,38+y,31,43+y,'#477664',2);R(25,46,7,5,'#7ba18a');R(26,46,5,1,'#c1cdac');L(24,54,32,54,'#c1cdac');}
 if(id==='shinji'){R(24,38+y,9,2,'#c3c9c0');L(22,39+y,25,43,'#344455',2);L(34,39+y,31,43,'#344455',2);R(24,42,3,3,'#cbd4cb');R(30,42,3,3,'#cbd4cb');R(20,46,4,3,'#506f90');R(32,46,4,3,'#506f90');}
 if(id==='esdeath'){P([[20,40+y],[24,38+y],[25,49],[20,58],[16+walk*.2,61],[16,48]],'#485c7b');P([[32,38+y],[36,40+y],[39,51],[40+walk*.2,61],[34,58],[31,49]],'#485c7b');L(21,42,19,55,'#91a7bb');L(35,42,36,55,'#91a7bb');R(20,52,3,1,'#dec9a5');R(35,52,3,1,'#dec9a5');}
 if(id==='kurumi'){for(const x of [23,26,29,32])L(x,43,x,51,'#d09299');R(24,37+y,9,3,'#dba2a3');R(20,53,16,2,'#754556');R(32,40,2,3,'#d6baa0');R(31,41,4,1,'#d6baa0');}
 if(id==='frieren'){P([[21,37+y],[26,39+y],[32,37+y],[37,41],[39+walk*.2,48],[34,52],[28,48],[22,52],[16-walk*.2,48],[18,41]],'#c9bea7');L(20,42,24,48,'#f4e7c7');L(35,42,32,48,'#f4e7c7');L(25,39+y,31,39+y,'#948a89');R(27,43,3,3,'#bba16a');}
 if(id==='samus'){R(32,40,3,4,'#deb465');R(32,41,3,1,'#edf0c1');R(22,48,12,2,'#835947');R(27,48,3,2,'#d6c798');}
 if(id==='megumi'){R(22,47,4,4,'#475b65');R(31,47,4,4,'#475b65');R(20-walk,59,5,4,'#536779');R(31+walk,59,5,4,'#536779');R(24,43,2,2,'#b4c8bd');}
 if(id==='eren'){R(20,43,5,4,'#46564b');R(32,43,4,4,'#46564b');R(21,43,3,1,'#b5b89a');R(33,43,2,1,'#b5b89a');L(27,40,27,47,'#5c5c5b');R(28,42,1,1,'#e3d4b0');}
 if(id==='yuki'){P([[25,46],[29,47],[33,46],[32,50],[28,52],[25,49]],'#d9cfb9');P([[29,49],[32,49],[35,53],[31,52]],'#f1e8d3');R(19-walk,57,6,5,'#657656');R(30+walk,57,6,5,'#657656');R(20-walk,57,4,1,'#c0c6a0');R(31+walk,57,4,1,'#c0c6a0');}
 if(id==='diavolo'){L(22,40+y,25,48,'#c0b6bd');L(25,48,29,48,'#c0b6bd');R(32,51,2,7,'#b7b6be');R(33,55,2,2,'#e2d9cf');}
 if(id==='rimuru'){P([[20,37+y],[25,34+y],[29,38+y],[33,34+y],[37,37+y],[34,41],[23,41]],'#f0e3c5');R(23,48,11,4,'#aaa98f');L(25,47,25,51,'#efe5ca');L(32,47,32,51,'#efe5ca');P([[20,54],[36,54],[36+walk,60],[29,60],[28,56],[26,60],[19-walk,60]],'#527e8f');}
 if(id==='featherine'){R(24,36+y,9,3,'#d0b8d2');R(21,52,15,3,'#554359');R(27,52,4,3,'#d7bf88');R(34,40,2,3,'#c9ad72');R(33,41,4,1,'#c9ad72');}
}
function face(r,id,m){
 if(id==='goku')return gokuFace(r,{y:m.y,stage:m.form||0,expression:m.expression,blink:m.blink,focused:m.cast||['focused','ultimate'].includes(m.expression)});
 const {poly:P,rect:R,line:L}=r,{y,blink,expression,cast}=m,focused=cast||['focused','ultimate'].includes(expression);
 P([[18,21+y],[22,16+y],[33,16+y],[38,22+y],[37,31+y],[32,37+y],[26,38+y],[20,34+y],[17,28+y]],SKIN_SHADE);
 P([[20,22+y],[23,18+y],[32,18+y],[36,23+y],[35,31+y],[31,35+y],[25,35+y],[20,31+y]],SKIN);
 R(17,27+y,3,4,SKIN);R(36,27+y,3,4,SKIN);
 if(id==='frieren'){P([[18,25+y],[10,22+y],[14,29+y],[19,31+y]],SKIN_SHADE);P([[36,25+y],[45,22+y],[41,29+y],[36,31+y]],SKIN_SHADE);L(12,24+y,17,27+y,SKIN);L(43,24+y,38,27+y,SKIN);}
 for(const [i,x]of [21,31].entries()){
  if(blink||expression==='hurt'){L(x,28+y,x+3,29+y,INK);if(expression==='hurt')L(x,30+y,x+3,29+y,INK);continue;}
  R(x,27+y,4,4,WHITE);R(x+1,27+y,2,4,id==='kurumi'&&i===1?'#d1ae61':EYES[id]);R(x+1,28+y,1,2,INK);R(x+1,27+y,1,1,'#fff9ed');L(x,26+y,x+3,focused?27+y:26+y,INK);if(focused)R(i?x:x+3,27+y,1,1,INK);
 }
 if(id==='naruto')for(const side of [-1,1])for(const yy of [30,32])L(side<0?18:35,yy+y,side<0?21:38,yy+1+y,'#a47a71');
 L(26,34+y,30,34+y,'#a67874');if(id==='goku'&&!focused&&!blink&&expression!=='hurt'){R(25,33+y,7,2,'#a67874');R(26,33+y,5,1,WHITE);}
 if(expression==='hurt')R(27,34+y,2,2,'#9b6371');
}
function hairFront(r,id,m){
 if(id==='goku')return gokuHairFront(r,{y:m.y,stage:m.form||0});
 const {poly:P,line:L,rect:R}=r,{y,walk,form=0}=m;
 let [hair,dark,light]=HAIR[id];if(id==='goku'&&form>0)[hair,dark,light]=form===4?['#68bfdb','#34778d','#b8f1e7']:['#e5ca63','#a97a32','#fff1a1'];
 if(id==='goku'){
  P([[17,31+y],[13,24+y],[7,20+y],[16,18+y],[10,12+y],[21,15+y],[20,6+y],[27,11+y],[31,3+y],[34,11+y],[44,7+y],[40,15+y],[50,15+y],[42,22+y],[40,30+y],[35,24+y],[33,18+y],[29,24+y],[25,20+y],[21,28+y]],dark);
  P([[17,23+y],[14,21+y],[21,19+y],[17,15+y],[24,18+y],[23,10+y],[28,15+y],[31,8+y],[33,16+y],[40,12+y],[37,19+y],[44,18+y],[38,23+y],[35,22+y],[33,17+y],[29,23+y],[25,18+y],[21,25+y]],hair);L(25,13+y,27,17+y,light);return;
 }
 if(['megumi','naruto','gojo','shinji'].includes(id)){
  const spiky=id!=='shinji';P(spiky?[[16,29+y],[13,21+y],[17,18+y],[14,13+y],[21,14+y],[22,8+y],[27,12+y],[31,7+y],[34,13+y],[42,11+y],[40,18+y],[44,21+y],[39,31+y],[36,23+y],[32,20+y],[28,24+y],[24,20+y],[20,25+y],[18,32+y]]:[[16,31+y],[14,23+y],[17,15+y],[24,10+y],[34,12+y],[40,19+y],[39,30+y],[35,24+y],[32,25+y],[28,20+y],[24,26+y],[20,23+y],[18,32+y]],dark);
  P([[17,23+y],[19,16+y],[25,12+y],[33,14+y],[38,19+y],[36,24+y],[32,20+y],[28,23+y],[24,19+y],[20,24+y]],hair);L(21,16+y,29,14+y,light);L(32,16+y,36,20+y,light);return;
 }
 const parted=['eren','yuki','samus','rimuru','esdeath','diavolo'].includes(id);
 P([[16,29+y],[15,20+y],[18,13+y],[24,9+y],[33,10+y],[39,16+y],[40,29+y],[37,35+y],[35,25+y],[33,21+y],[29,24+y],[25,21+y],[21,26+y],[19,34+y],[16,37+y]],dark);
 P([[17,25+y],[17,19+y],[21,13+y],[26,11+y],[33,12+y],[37,17+y],[38,26+y],[35,23+y],[33,18+y],[29,23+y],[25,19+y],[21,24+y],[19,21+y],[18,31+y]],hair);
 if(!parted){R(20,19+y,15,5,hair);for(const x of [21,25,29,33])L(x,15+y,x-1,23+y,light);}
 else{P([[20,17+y],[25,12+y],[29,12+y],[26,17+y],[22,22+y]],light);L(33,14+y,36,22+y,light);}
 if(id==='diavolo')for(const [x,yy]of [[21,15],[26,19],[33,15],[37,24],[18,29],[36,34]])R(x,yy+y,2,2,'#754c77');
 if(id==='maomao')for(const [x,d]of [[18,walk],[37,-walk]]){L(x,33+y,x+d,44,dark,2);R(x+d-1,38,4,2,'#b7869a');R(x+d,44,2,5,hair);R(x+d-1,47,3,2,'#b4cda6');}
 if(id==='kurumi'){P([[14,31+y],[16,21+y],[20,24+y],[20,40],[16-walk,49],[13-walk,47]],hair);P([[37,24+y],[40,26+y],[42+walk,44],[39+walk,49],[36,41]],hair);R(14,27+y,4,3,'#b6657a');R(38,29+y,4,3,'#b6657a');}
 if(id==='featherine'){P([[17,27+y],[18,35+y],[21,40+y],[20,27+y]],hair);P([[37,26+y],[36,40+y],[39,37+y],[39,28+y]],hair);}
}
export function casualPixels(id,{frame=0,moving=false,pose='',attack=false,expression='neutral',blink=false,form=0}={}){
 if(!CASUAL_OUTFITS[id]||(id==='eren'&&form)||(id==='rimuru'&&(form==='slime'||pose==='predator'))||(id==='samus'&&pose==='bomb'))return null;
 frame=((frame%4)+4)%4;const m={frame,moving,pose,attack,expression,blink,form,walk:moving?[0,2,0,-2][frame]:0,y:moving?-(frame%2):0,cast:attack||!!pose};
 const r=raster();hairBack(r,id,m);outfit(r,id,m);face(r,id,m);hairFront(r,id,m);return outline(r.pixels,INK);
}

// Reuse recognizable hair and facial clusters across separately drawn outfits.
export {hairBack as drawCasualHairBack,face as drawCasualFace,hairFront as drawCasualHairFront};
