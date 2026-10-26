import {raster,outline} from './pixel-characters.js';

export const DENJI_ART={ink:'#25303d',hair:'#dda44e',hairDark:'#9c643d',hairLight:'#f4cf7c',skin:'#edc5a2',skinShade:'#c39079',skinLight:'#ffe1b9',shirt:'#eee9d9',shirtShade:'#abb6b6',shirtLight:'#fff5df',pants:'#35404d',pantsShade:'#212a38',pantsLight:'#596473',orange:'#ce743b',orangeDark:'#7c4837',orangeLight:'#edaa5d',steel:'#a8b9bc',steelDark:'#566c79',steelLight:'#edf0d7',red:'#bd5c58'};
const c=DENJI_ART;
function saw(r,x,y,length,{upright=false,hot=false,frame=0}={}){
 const {rect:R,poly:P,line:L}=r,base=hot?'#e5b184':c.steel,shine=hot?'#fff0be':c.steelLight;
 if(upright){
  P([[x-4,y+3],[x-4,y-length+3],[x-1,y-length-2],[x+3,y-length],[x+4,y+3]],c.ink);
  R(x-2,y-length+3,5,length,base);L(x,y-length+2,x,y,c.steelDark,1);
  for(let i=2;i<length-1;i+=4){const yy=y-i+(frame%2);P([[x-3,yy+2],[x-6,yy],[x-3,yy-1]],shine);P([[x+3,yy],[x+6,yy-2],[x+3,yy-3]],shine);}
  L(x-1,y-length+3,x-1,y-1,shine);
 }else{
  P([[x-3,y-4],[x+length-3,y-4],[x+length+2,y-1],[x+length,y+3],[x-3,y+4]],c.ink);
  R(x-1,y-2,length-1,5,base);L(x,y,x+length-2,y,c.steelDark);
  for(let i=2;i<length-1;i+=4){const xx=x+i+(frame%2);P([[xx-1,y-3],[xx,y-6],[xx+2,y-3]],shine);P([[xx,y+3],[xx+2,y+6],[xx+3,y+3]],shine);}
  L(x,y-1,x+length-3,y-1,shine);
 }
}
function face(r,y,{expression,blink}){
 const {rect:R,line:L,poly:P}=r;
 P([[17,20+y],[38,20+y],[38,30+y],[34,37+y],[27,40+y],[20,36+y],[16,30+y]],c.skinShade);
 P([[18,21+y],[36,21+y],[36,30+y],[32,37+y],[25,37+y],[19,32+y]],c.skin);
 R(18,26+y,2,4,c.skinLight);R(34,27+y,2,3,c.skinShade);
 for(const x of [20,30]){
  if(blink){L(x,28+y,x+5,28+y,c.ink);continue;}
  if(expression==='hurt'){L(x,27+y,x+4,29+y,c.ink);L(x,29+y,x+4,27+y,c.ink);}
  else{R(x,27+y,5,1,c.hairDark);R(x,28+y,5,4,'#f9efda');R(x+2,28+y,2,4,'#9b6d48');R(x+2,28+y,1,3,c.ink);R(x+3,28+y,1,1,c.skinLight);if(expression==='focused')L(x-1,26+y,x+4,27+y,c.ink);}
 }
 if(expression==='hurt'){L(25,35+y,30,34+y,'#996d66');R(20,32+y,3,1,'#d49683');}
 else if(expression==='focused'){L(24,35+y,32,34+y,c.ink);L(26,36+y,30,36+y,c.skinShade);}
 else{P([[23,34+y],[33,33+y],[31,37+y],[26,37+y]],c.ink);L(24,34+y,31,34+y,'#fff2d3');R(26,36+y,3,1,'#c87e74');}
}
function pajamaHood(r,y){
 const {poly:P,line:L,rect:R}=r;
  P([[12,20+y],[14,11+y],[19,6+y],[21,4+y],[25,9+y],[35,7+y],[40,12+y],[43,22+y],[42,34+y],[38,39+y],[35,31+y],[18,31+y],[15,37+y],[11,29+y]],'#8b4d35');
  P([[14,20+y],[16,12+y],[20,9+y],[22,11+y],[34,10+y],[39,15+y],[41,26+y],[38,33+y],[34,23+y],[18,22+y],[15,31+y]],'#d88345');
  R(19,11+y,3,2,'#efb86a');R(35,14+y,3,2,'#efb86a');
}
function humanHair(r,y,skin){
 const {poly:P,line:L,rect:R}=r;
 P([[14,26+y],[13,18+y],[17,15+y],[15,10+y],[22,12+y],[25,5+y],[29,10+y],[35,7+y],[36,12+y],[41,14+y],[39,21+y],[40,27+y],[36,30+y],[33,23+y],[28,25+y],[26,20+y],[21,25+y],[20,21+y],[17,30+y]],c.hairDark);
 P([[16,23+y],[16,18+y],[21,16+y],[19,13+y],[24,14+y],[26,9+y],[29,14+y],[34,11+y],[34,15+y],[38,17+y],[36,23+y],[33,20+y],[29,23+y],[26,17+y],[22,22+y],[21,18+y],[18,25+y]],c.hair);
 L(19,18+y,25,15+y,c.hairLight);L(26,12+y,29,16+y,c.hairLight);L(31,16+y,35,14+y,c.hairLight);R(17,20+y,3,1,c.hairLight);R(34,19+y,3,1,'#efbd66');
}
function legs(r,{step,skin,hybrid}){
 const {poly:P,rect:R,line:L}=r;
 const shorts=skin==='swimsuit'&&!hybrid,pajamas=skin==='pajamas'&&!hybrid;
 for(const [x,d]of [[20,-step],[31,step]]){
  if(shorts){
   P([[x-2,53],[x+7,53],[x+7+d,61],[x+5+d,70],[x+d,70],[x-1+d,61]],c.skinShade);R(x,56,5,12,c.skin);L(x+1,58,x+1+d,66,c.skinLight);
   P([[x-3,68],[x+5,68],[x+8+d,71],[x+7+d,73],[x-3+d,73]],c.ink);R(x-1+d,69,7,2,'#6e8f8f');L(x+d,68,x+4+d,71,'#d9c394');
  }else{
   const cloth=pajamas?'#be7748':c.pants,shade=pajamas?'#7d4d3c':c.pantsShade,light=pajamas?'#e6a05e':c.pantsLight;
   P([[x-3,50],[x+7,50],[x+8+d,61],[x+6+d,70],[x-2+d,70],[x-3+d,61]],shade);
   P([[x-1,52],[x+5,52],[x+5+d,61],[x+3+d,68],[x+d,68],[x-1+d,60]],cloth);L(x+1,55,x+d,65,light);
   if(pajamas){R(x+1,57,2,2,'#f3ce8c');R(x+2+d,63,2,2,'#f3ce8c');}
   const shoe=pajamas?'#6c6755':'#26313d';P([[x-3+d,68],[x+5+d,68],[x+9+d,71],[x+8+d,73],[x-4+d,73],[x-5+d,71]],c.ink);R(x-2+d,69,8,2,shoe);L(x-3+d,72,x+7+d,72,pajamas?'#d1c08d':'#8d9696');
   if(!pajamas){L(x+d,69,x+3+d,69,'#d6d5bf');}
  }
 }
 if(shorts){P([[17,49],[37,49],[40,58],[28,60],[27,55],[26,60],[15,58]],'#9b563c');P([[19,50],[35,50],[37,57],[29,57],[27,53],[24,57],[18,57]],'#df9550');L(20,51,34,51,'#eed4a2');L(28,52,29,56,c.ink);L(33,53,36,55,'#597f82');}
}
function body(r,{y,step,skin,cast,hybrid}){
 const {poly:P,line:L,rect:R}=r,swim=skin==='swimsuit'&&!hybrid,casual=skin==='casual'&&!hybrid,pj=skin==='pajamas'&&!hybrid,jacket=skin==='devilhunter'&&!hybrid;
 const cloth=pj?'#cc8549':casual?'#cdbb92':c.shirt,shade=pj?'#925a3d':casual?'#8f8c7f':c.shirtShade,light=pj?'#efb86b':casual?'#eee1ba':c.shirtLight;
 P([[18,36+y],[23,34+y],[32,34+y],[38,38+y],[38,50],[35,56],[19,55],[16,47]],swim?c.skinShade:shade);
 P([[20,37+y],[24,36+y],[31,36+y],[35,39+y],[35,50],[32,53],[21,52],[19,45]],swim?c.skin:cloth);L(21,39+y,21,49,swim?c.skinLight:light);
 if(swim){L(25,40+y,27,43+y,c.skinShade);L(31,40+y,29,43+y,c.skinLight);L(26,47,31,47,c.skinShade);}
 else if(casual){
  P([[22,35+y],[27,40+y],[33,35+y],[35,40+y],[28,45],[20,39+y]],shade);L(23,36+y,27,40+y,light);L(31,37+y,30,44,light);
  P([[25,43],[31,43],[34,47],[32,50],[24,50],[22,47]],'#bf773f');R(25,44,5,3,'#e7a157');R(25,46,1,1,c.ink);R(30,46,1,1,c.ink);R(31,43,4,1,c.steel);L(22,51,33,51,shade);
 }else if(pj){
  L(28,39+y,28,54,'#754f3c');R(29,43,1,1,c.shirtLight);R(29,48,1,1,c.shirtLight);R(21,46,4,3,'#e7bd78');L(22,46,24,48,c.shirtLight);R(32,49,3,2,'#e7bd78');
 }else{
  P([[22,34+y],[27,39+y],[24,43+y],[20,37+y]],light);P([[32,34+y],[27,39+y],[30,43+y],[35,37+y]],light);P([[27,38+y],[30,40+y],[28,43+y],[30,51],[26,54],[24,50],[26,42+y],[25,40+y]],c.ink);R(27,44,1,6,'#59616a');R(32,42+y,3,1,shade);R(33,43+y,1,5,shade);
  if(hybrid){for(const [x,yy]of [[18,44],[35,46],[21,51]]){P([[x,yy],[x+4,yy+2],[x+1,yy+6]],c.shirt);L(x,yy,x+1,yy+3,c.red);}L(33,49,35,51,c.red);}
 }
 // The visible pull cord remains on every human outfit, including swimwear.
 L(24,42,22,47,c.ink,1);P([[20,46],[24,46],[25,49],[22,51],[19,49]],c.ink);R(21,47,2,2,'#d7b997');
 const leftY=cast?44:50+step*.35,rightY=cast?41:50-step*.35;
 for(const [x,side,hy]of [[17,-1,leftY],[37,1,rightY]]){
  const sleeve=swim?c.skin:cloth,ss=swim?c.skinShade:shade;
  P([[x-3,37+y],[x+4,37+y],[x+side*4+4,44],[x+side*4+2,47],[x+side*4-4,45],[x-4,41+y]],ss);L(x-1,39+y,x+side*3,43,sleeve,4);
  const hx=x+side*(cast?5:2);L(x+side*3,44,hx,hy,c.skinShade,5);L(x+side*2,44,hx,hy,c.skin,3);R(hx-2,hy-1,5,5,c.skin);L(hx-1,hy+2,hx+2,hy+2,c.skinShade);
  if(pj){L(x,38+y,hx,hy-1,ss,6);L(x,39+y,hx,hy-2,sleeve,4);R(hx-2,hy-1,5,2,light);}
 }
 if(jacket){
  for(const side of [-1,1]){const x=side<0?17:35;P([[x-2,36+y],[x+5,36+y],[x+side*5+4,46],[x+side*4+2,53],[x+3,52],[x+3,57],[x-2,55]],'#2e3b49');L(x,38+y,x+side*2,48,'#586574',2);P([[x,36+y],[x+4,38+y],[x+1,44]],'#8e9ba1');}R(15,43,3,2,c.red);R(35,43,3,2,c.red);
 }
 return {leftY,rightY};
}
function hybridHead(r,y,{cast,frame}){
 const {poly:P,line:L,rect:R}=r;
 // Orange motor shell, a single broad snout blade and a lower saw-toothed jaw.
 P([[15,17+y],[19,12+y],[34,11+y],[41,15+y],[42,26+y],[36,32+y],[22,33+y],[15,27+y]],c.ink);
 P([[17,18+y],[21,14+y],[33,13+y],[38,16+y],[39,24+y],[34,28+y],[20,28+y],[17,24+y]],c.orangeDark);
 P([[19,17+y],[23,14+y],[32,15+y],[36,18+y],[35,23+y],[21,25+y],[18,22+y]],c.orange);L(21,16+y,31,15+y,c.orangeLight,2);L(18,21+y,21,23+y,c.orangeLight);
 // Rear motor vents and a black vertical lever match the characteristic head.
 R(14,17+y,4,8,c.orangeDark);for(const yy of [18,21,24])L(14,yy+y,18,yy+y,c.ink);L(22,12+y,20,5+y,c.ink,3);L(21,6+y,22,10+y,c.steelDark,1);
 saw(r,33,18+y,20,{hot:cast,frame});
 P([[17,27+y],[26,25+y],[40,24+y],[37,33+y],[30,38+y],[21,35+y]],c.ink);
 P([[20,29+y],[29,28+y],[37,26+y],[34,32+y],[28,35+y],[22,33+y]],'#6c4238');
 for(const [x,yy]of [[20,28],[24,28],[28,27],[32,27],[35,26]])P([[x,yy+y],[x+3,yy+y],[x+1,yy+4+y]],c.steelLight);
 for(const [x,yy]of [[23,34],[27,35],[31,33],[34,31]])P([[x,yy+y],[x+2,yy-4+y],[x+3,yy-1+y]],c.steel);
 L(20,26+y,28,25+y,'#efb26b');R(31,23+y,5,1,c.red);R(17,22+y,2,3,'#edbf7b');
}
export function denjiPixels({frame=0,moving=false,pose='',attack=false,expression='neutral',blink=false,skin='default',form=0}={}){
 const r=raster(),step=moving?[0,2,0,-2][((frame%4)+4)%4]:0,y=moving?-(frame%2):0,hybrid=form===1||pose==='chainsaw',cast=attack||pose==='ultimate'||pose==='rev'||pose==='cleave';
 const look=hybrid?'default':skin;
 legs(r,{step,skin:look,hybrid});
 const arms=body(r,{y,step,skin:look,cast,hybrid});
 if(hybrid){hybridHead(r,y,{cast,frame});
  saw(r,11,cast?42:57,cast?22:19,{upright:true,hot:cast,frame});saw(r,43,cast?43:58,cast?23:20,{upright:true,hot:cast,frame});
  for(const x of [11,43]){r.rect(x-4,cast?40:49,8,7,c.orangeDark);r.rect(x-2,cast?41:50,5,5,c.orange);r.line(x-2,cast?41:50,x+2,cast?41:50,c.orangeLight);}
 }else{
  if(look==='pajamas')pajamaHood(r,y);
  face(r,y,{expression,blink});humanHair(r,y,look);
  const sx=cast?38:40,sy=cast?43:54;
  saw(r,sx,sy,cast?14:19,{upright:!cast,hot:pose==='ultimate',frame});
  r.poly([[sx-7,sy-4],[sx+2,sy-4],[sx+5,sy],[sx+3,sy+6],[sx-5,sy+6],[sx-8,sy+2]],c.ink);r.rect(sx-5,sy-2,7,6,c.orange);r.line(sx-4,sy-2,sx+1,sy-2,c.orangeLight);r.rect(sx-4,sy,3,2,c.orangeDark);r.line(sx-7,sy-4,sx-3,sy-7,c.ink,2);r.line(sx-3,sy-7,sx+1,sy-4,c.ink,2);r.rect(sx-4,sy+3,4,2,c.skin);
 }
 return outline(r.pixels,c.ink);
}
