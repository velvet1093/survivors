import {raster,outline} from './pixel-characters.js';
import {drawCasualHairBack,drawCasualFace,drawCasualHairFront} from './casual-art.js';
import {erzaPixels} from './erza-art.js';
import {SWIMSUIT_OUTFITS} from './swimsuit-outfits.js';
export {SWIMSUIT_OUTFITS} from './swimsuit-outfits.js';
const INK='#2b3042',SKIN='#ffe0c6',SHADE='#d2a58f',WHITE='#f7f1df';
// Athletic cuts, board shorts, swim dresses and wraps keep every outfit suited to
// a day at the water. Each garment has its own panels and identifying motif.
const STYLES={
 goku:{c:'#de914a',d:'#9b5840',l:'#ffd08a',trim:'#3b7094',shorts:'#365576',sleeve:false},
 gojo:{c:'#83c4d3',d:'#436f92',l:'#caeeee',trim:'#f2eacb',shorts:'#33485f',sleeve:true},
 naruto:{c:'#edaa57',d:'#b36c3f',l:'#ffdb92',trim:'#323d51',shorts:'#3a475b',sleeve:true},
 madoka:{c:'#df9dbb',d:'#a4658f',l:'#ffe1e8',trim:'#f6eddb',shorts:'#a9658c',wrap:true,sleeve:true},
 maomao:{c:'#5e9d86',d:'#31685e',l:'#b9dbc0',trim:'#e2d6a4',shorts:'#426f64',wrap:true,sleeve:false},
 shinji:{c:'#b7dce0',d:'#688da6',l:'#ecf5e8',trim:'#335b80',shorts:'#355875',sleeve:true},
 esdeath:{c:'#466885',d:'#2c4566',l:'#8cb8d0',trim:'#eff5e9',shorts:'#395975',wrap:true,sleeve:false},
 kurumi:{c:'#484653',d:'#292f41',l:'#81728a',trim:'#c36e83',shorts:'#3a3448',wrap:true,sleeve:true},
 frieren:{c:'#d9e2ce',d:'#91a9a0',l:'#fff5df',trim:'#8e7eaa',shorts:'#7f7490',wrap:true,sleeve:true},
 samus:{c:'#4d82a6',d:'#2b526f',l:'#9cd3df',trim:'#e8ae68',shorts:'#365c7c',sleeve:false},
 megumi:{c:'#43546a',d:'#26394d',l:'#8198aa',trim:'#d4e4d7',shorts:'#334656',sleeve:true},
 eren:{c:'#668b75',d:'#3a6057',l:'#aac9a4',trim:'#e3d4ad',shorts:'#365c55',sleeve:false},
 yuki:{c:'#e6c77a',d:'#b38a4d',l:'#ffebad',trim:'#a25c70',shorts:'#a25c70',wrap:true,sleeve:false},
 diavolo:{c:'#a2638c',d:'#653d67',l:'#dfa7c5',trim:'#dcbd8c',shorts:'#5b4a73',sleeve:true},
 rimuru:{c:'#75bfd0',d:'#3e849f',l:'#c6eced',trim:'#f3e9cb',shorts:'#477f9a',sleeve:true},
 featherine:{c:'#9779ad',d:'#5d4b7c',l:'#d5b8df',trim:'#a9c993',shorts:'#74618e',wrap:true,sleeve:true},
 erza:{c:'#c85c6b',d:'#873d54',l:'#efabb0',trim:'#e9d3a8',shorts:'#7e4961',wrap:false,sleeve:false},
};
function star(r,x,y,c){r.line(x-2,y,x+2,y,c);r.line(x,y-2,x,y+2,c);r.rect(x-1,y-1,3,3,c);}
function legs(r,m,s){
 const {poly:P,rect:R,line:L}=r,{walk}=m;
 for(const [x,offset]of [[21,-walk],[31,walk]]){
  R(x+offset,55,4,15,SHADE);R(x+offset+1,56,3,13,SKIN);L(x+offset+1,59,x+offset+1,66,'#f6d9bd');
  P([[x-2,49],[x+6,49],[x+7+offset,58],[x-2+offset,58]],s.d);P([[x,50],[x+4,50],[x+5+offset,56],[x-1+offset,56]],s.shorts);
  L(x-1+offset,56,x+5+offset,56,s.trim);R(x-2+offset,68,8,3,s.d);R(x-1+offset,67,5,2,SKIN);L(x-1+offset,68,x+4+offset,70,s.trim);L(x+1+offset,68,x+1+offset,70,s.trim);L(x-2+offset,71,x+5+offset,71,'#aaa99c');
 }
}
function arms(r,m,s){
 const {line:L,rect:R}=r,{walk,y,cast,frame}=m,pulse=cast?[0,-2,1,-1][frame]:0;
 const hands=[[14-walk*.3,cast?47-pulse:53+walk*.4],[cast?43+pulse:40+walk*.3,cast?35+pulse:53-walk*.4]];
 for(const [i,[hx,hy]]of hands.entries()){
  const sx=i?36:19,ex=i?(cast?40:39):16-walk*.2,ey=i&&cast?41:46+y;
  L(sx,39+y,ex,ey,s.d,6);L(sx+1,40+y,ex+1,ey,s.sleeve?s.c:SKIN,4);
  L(ex,ey,hx,hy,s.sleeve?s.d:SHADE,4);L(ex+1,ey,hx+1,hy,s.sleeve?s.c:SKIN,3);
  if(s.sleeve){L(sx+1,40+y,ex+1,ey,s.l);L(hx-1,hy-1,hx+3,hy-1,s.trim,2);}
  R(hx,hy,4,4,SKIN);R(hx,hy+3,3,1,SHADE);
 }return hands;
}
function torso(r,m,s){
 const {poly:P,line:L,rect:R}=r,{y,walk}=m;
 P([[21,36+y],[26,35+y],[31,35+y],[36,38+y],[38,47],[35,54],[20,54],[18,46]],s.d);
 P([[22,38+y],[26,37+y],[31,37+y],[34,39+y],[35,47],[33,53],[22,53],[21,46]],s.c);
 P([[24,35+y],[27,38+y],[31,38+y],[33,35+y],[33,39+y],[29,42+y],[24,40+y]],s.trim);L(25,36+y,28,39+y,s.l);L(32,36+y,30,40+y,s.l);
 L(22,42,23,51,s.l);L(34,43,33,51,s.d);R(20,51,16,3,s.trim);L(21,51,34,51,s.l);
 if(s.wrap){
  P([[20,51],[35,51],[37+walk*.4,58],[40+walk*.4,63],[35,65],[28,63],[21,65],[16+walk*.4,63],[18,57]],s.d);
  P([[22,53],[33,53],[35+walk*.4,59],[37+walk*.4,62],[30,62],[24,61],[19+walk*.4,63],[18+walk*.4,61]],s.c);
  L(21,54,32,60,s.l);L(32,54,29,62,s.d);L(19+walk*.4,63,25,64,s.trim);L(29,63,37+walk*.4,62,s.trim);
 }
}
function emblem(r,id,m,s){
 const {poly:P,rect:R,line:L}=r,{walk,y}=m;
 if(id==='goku'){R(23,43,5,5,WHITE);R(24,44,3,3,s.trim);L(24,43,26,47,s.trim);R(31+walk,54,3,2,s.l);}
 if(id==='gojo'){P([[22,44],[25,42],[28,44],[31,42],[34,44],[31,47],[28,45],[25,47]],WHITE);R(23,44,2,1,s.d);R(30,44,2,1,s.d);L(23,54,25-walk,56,s.l);}
 if(id==='naruto'){R(26,43,5,5,s.trim);R(27,44,3,3,s.l);R(28,44,1,2,s.trim);R(24,38+y,9,2,s.trim);L(28,41,28,50,s.l);R(31+walk,53,4,2,s.c);}
 if(id==='madoka'){P([[23,44],[26,42],[29,44],[27,47],[24,47]],s.trim);R(25,44,2,2,'#bd6b93');for(const x of [19,24,30,35]){R(x+walk*.4,61,3,2,s.l);R(x+walk*.4+1,63,1,1,s.trim);}R(20,50,16,2,s.trim);}
 if(id==='maomao'){P([[25,44],[29,41],[31,43],[28,47]],s.trim);L(26,45,31,48,s.l);L(22,56,23+walk*.4,62,s.trim);R(23,57,3,2,s.l);}
 if(id==='shinji'){R(22,43,3,5,s.trim);R(32,43,3,5,s.trim);R(27,43,3,2,s.d);R(28,45,2,3,s.trim);L(23,54,24-walk,57,s.l);L(32,54,33+walk,57,s.l);}
 if(id==='esdeath'){star(r,28,45,s.trim);L(21,55,34,57,s.l);L(20,59,35,61,s.l);R(33,52,4,3,s.trim);L(36,55,37+walk*.4,61,s.trim,2);}
 if(id==='kurumi'){R(25,43,6,6,s.trim);R(26,44,4,4,s.d);L(28,44,28,46,s.l);L(28,46,30,47,s.l);for(const x of [19,24,29,34])R(x+walk*.4,62,3,1,s.trim);P([[33,51],[37,50],[38,53],[34,54]],s.trim);}
 if(id==='frieren'){P([[24,43],[29,42],[33,45],[29,49],[25,47]],s.trim);L(26,44,29,47,s.l);L(32,45,29,47,s.l);L(21,57,34,57,s.trim);R(27,53,3,2,s.trim);}
 if(id==='samus'){P([[26,42],[32,42],[33,45],[30,48],[25,46]],s.trim);R(27,43,4,2,'#bde4d8');L(23,39,24,49,s.trim,2);L(33,39,31,51,s.trim,2);R(31+walk,54,3,2,s.trim);}
 if(id==='megumi'){R(25,45,6,3,s.trim);for(const x of [24,27,30])R(x,42,2,2,s.trim);L(22,54,25-walk,56,s.l);L(32,54,34+walk,56,s.l);}
 if(id==='eren'){for(const side of [-1,1])for(let i=0;i<3;i++)L(28,43+i,28+side*(4-i),40+i,s.trim);L(22,53,23-walk,57,s.l);L(33,53,34+walk,57,s.l);}
 if(id==='yuki'){star(r,28,45,s.trim);P([[33,51],[38,52],[36,56],[32,54]],s.trim);L(35,55,37+walk*.4,62,s.trim,2);star(r,23+walk*.4,59,s.l);}
 if(id==='diavolo'){for(const [x,yy]of [[23,43],[31,46],[23-walk,55],[33+walk,55]]){P([[x,yy-1],[x+2,yy+1],[x,yy+3],[x-2,yy+1]],s.trim);R(x,yy,1,1,s.l);}L(27,42,27,50,s.l);}
 if(id==='rimuru'){P([[24,46],[26,42],[30,42],[33,46],[31,49],[26,49]],s.trim);R(26,46,1,1,s.d);R(30,46,1,1,s.d);L(24,54,26-walk,56,s.l);L(31,54,33+walk,56,s.l);}
 if(id==='featherine'){P([[24,43],[28,42],[32,44],[29,48],[26,47]],s.trim);L(25,44,29,47,WHITE);R(20,51,16,3,s.trim);R(32,54,4,8,s.trim);for(const x of [32,34,36])L(x,62,x+walk*.4,65,s.l);}
 if(id==='erza'){P([[25,42],[31,42],[33,45],[29,49],[24,46]],s.l);for(const [x,yy]of [[26,43],[30,44],[28,47]])R(x,yy,1,1,s.d);L(25,41,31,41,'#8ba179');R(20,51,16,3,s.trim);R(33,53,4,6,s.c);L(34,54,35,57,s.l);}
}
function erzaHead(r,m){
 const {poly:P,line:L}=r,{y,walk}=m;
 P([[17,18+y],[22,9+y],[33,10+y],[38,17+y],[40,35],[43+walk,51],[39+walk,58],[32,44],[24,49],[17-walk,57],[13-walk,53],[16,37]],'#672b40');P([[19,20+y],[24,13+y],[32,13+y],[36,20+y],[37,37],[40+walk,51],[35,45],[29,38],[23,45],[17-walk,52],[16,46]],'#b34250');L(18,29,17-walk*.3,47,'#d45a5e');L(37,27,39+walk*.3,48,'#f28a78');
 const source=erzaPixels({...m,skin:'casual'});for(let y=0;y<38;y++)for(let x=12;x<=41;x++){const c=source[y*56+x];if(c)r.put(x,y,c);}
}
function accessories(r,id,m,s,hands){
 const {poly:P,rect:R,line:L}=r,{y,cast,frame,form}=m;
 if(['shinji','naruto'].includes(id)){L(18,21+y,38,21+y,s.trim,2);R(19,20+y,7,4,s.d);R(30,20+y,7,4,s.d);R(20,20+y,5,2,s.l);R(31,20+y,5,2,s.l);L(26,22+y,30,22+y,s.trim);}
 if(id==='gojo'){R(19,26+y,8,3,'#32495d');R(30,26+y,8,3,'#32495d');L(27,27+y,30,27+y,'#32495d');R(20,26+y,3,1,s.l);R(31,26+y,3,1,s.l);}
 if(['madoka','maomao','kurumi','frieren','esdeath'].includes(id)){const x=id==='kurumi'?37:15;P([[x,21+y],[x-3,19+y],[x-4,22+y],[x-1,24+y],[x+2,23+y],[x+3,20+y]],s.trim);R(x-1,21+y,2,2,s.l);}
 if(id==='featherine'){R(13,24+y,3,2,s.trim);R(42,24+y,3,2,s.trim);}
 if(id==='erza'){
  const index=typeof form==='number'?Math.max(0,Math.min(3,form)):0,[x,hy]=hands[1];
  if(index===2){P([[x-4,hy-7],[x+4,hy-9],[x+9,hy-4],[x+8,hy+4],[x+2,hy+9],[x-4,hy+3]],'#557a93');P([[x-2,hy-5],[x+3,hy-7],[x+7,hy-3],[x+6,hy+3],[x+2,hy+6],[x-2,hy+2]],'#b9dce0');L(x+2,hy-5,x+2,hy+5,s.trim);}
  else{const tx=cast?51:49,ty=cast?13+[0,1,-1,2][frame]:52;L(x,hy+2,tx,ty,index===1?'#795d94':'#7897a5',3);L(x,hy+1,tx,ty,index===1?'#c6afde':'#d7e9e0',2);L(x-3,hy+1,x+4,hy+3,s.trim,2);L(x,hy+3,x-2,hy+9,s.d,2);}
 }
}
export function swimsuitPixels(id,{frame=0,moving=false,pose='',attack=false,expression='neutral',blink=false,form=0}={}){
 if(!SWIMSUIT_OUTFITS[id]||(id==='eren'&&form)||(id==='rimuru'&&(form==='slime'||pose==='predator'))||(id==='samus'&&pose==='bomb'))return null;
 frame=((frame%4)+4)%4;const m={frame,moving,pose,attack,expression,blink,form,walk:moving?[0,2,0,-2][frame]:0,y:moving?-(frame%2):0,cast:attack||!!pose},r=raster(),s=STYLES[id];
 if(id==='erza')erzaHead(r,m);else drawCasualHairBack(r,id,m);
 legs(r,m,s);const hands=arms(r,m,s);torso(r,m,s);emblem(r,id,m,s);
 if(id==='erza'){const source=erzaPixels({...m,skin:'casual'});for(let y=0;y<38;y++)for(let x=12;x<=41;x++){const c=source[y*56+x];if(c)r.put(x,y,c);}}
 else{drawCasualFace(r,id,m);drawCasualHairFront(r,id,m);}accessories(r,id,m,s,hands);
 if(id==='erza'&&pose==='nakagami'){r.line(hands[1][0],hands[1][1],51,10,'#f1d899',3);r.line(hands[1][0],hands[1][1],51,10,'#fff1c7');star(r,45,17,'#e8ca8a');}
 return outline(r.pixels,INK);
}
