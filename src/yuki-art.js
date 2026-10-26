import {raster,outline} from './pixel-characters.js';
export function yukiPixels({frame=0,moving=false,pose='',attack=false,expression='neutral',blink=false,skin:skinId='default'}={}){
 const r=raster(),{rect:R,poly:P,line:L}=r,hair='#ddca8a',hairShade='#a89461',hairLight='#f6e9b3',tone='#ecc9b0',toneLight='#f6ddc3',ink='#303743',walk=moving?[0,2,0,-2][frame]:0,y=moving?-(frame%2):0,charging=pose==='singularity-charge',cast=attack||pose==='mass',midnight=skinId==='midnight',pants=midnight?'#8295a6':'#a85567',pantsShade=midnight?'#546478':'#713d51',pantsLight=midnight?'#b4c1c9':'#cd7d83',top=midnight?'#444456':'#2b3445',topShade='#262d3a';
 // Her long, straight blonde hair falls past the waist, with separate low sidelocks.
 P([[16,18+y],[18,10+y],[24,7+y],[33,7+y],[39,13+y],[41,26+y],[41,48],[37,58],[32,56],[29,41],[23,56],[15,57],[14,43]],hairShade);
 P([[17,19+y],[21,11+y],[28,9+y],[34,10+y],[38,16+y],[38,42],[36,54],[33,53],[32,34],[21,36],[19,55],[16,53]],hair);
 L(17,31,17-walk*.2,53,hairLight,1);L(37,29,37+walk*.2,50,hairLight,1);
 // Roomy red training pants, or the reference's high-waisted blue-gray trousers.
 for(const [x,d]of [[18,-walk],[30,walk]]){
  P([[x,47],[x+9,47],[x+10+d,56],[x+7+d,66],[x+1+d,66],[x-1+d,59]],pantsShade);
  P([[x+2,48],[x+8,49],[x+8+d,57],[x+5+d,64],[x+2+d,63],[x+d,57]],pants);
  L(x+3,51,x+2+d,59,pantsLight,1);L(x+7,51,x+6+d,61,pantsShade,1);
  P([[x+1+d,64],[x+7+d,64],[x+7+d,69],[x+9+d,71],[x-1+d,71],[x+d,68]],midnight?'#4d4846':'#30323e');
  R(x+1+d,65,4,3,midnight?'#796654':'#4d5060');R(x+d,70,8,1,midnight?'#ad9474':'#747684');
 }
 // Broad shoulders, high collar, cropped hem and natural bare midriff.
 P([[20,35+y],[24,34+y],[33,34+y],[38,37+y],[35,45],[35,49],[21,49],[21,44],[18,40+y]],tone);
 P([[22,34+y],[25,33+y],[32,33+y],[35,35+y],[37,40+y],[35,43+y],[21,43+y],[19,39+y]],top);
 R(25,33+y,8,4,topShade);L(27,34+y,31,34+y,midnight?'#c2ac73':'#526173',1);L(22,41+y,34,41+y,midnight?'#686274':'#4d596c',1);
 if(midnight){P([[21,42+y],[35,42+y],[35,47],[21,47]],top);R(21,45,14,5,'#4c5a6c');L(24,45,24,49,'#9ba8b2');R(28,46,3,2,'#b7b1a4');L(22,36+y,27,37+y,'#a99663');L(25,35+y,27,37+y,'#c7b77c');}
 else{R(22,48,13,3,pantsShade);R(27,49,2,1,'#cfb187');R(27,44,1,2,'#c39481');}
 // Casting extends the arm; idle pose has a bent arm resting at her hip.
 if(charging){
  L(19,38+y,17,44,tone,5);L(17,44,24,42,toneLight,3);R(23,40,4,4,toneLight);
  L(36,38+y,38,44,tone,5);L(38,44,31,42,toneLight,3);R(29,40,4,4,toneLight);
  R(26,40,4,4,'#eee5ce');R(27,41,2,2,'#202638');R(25,42,1,1,'#d8b87c');R(30,42,1,1,'#d8b87c');
 }else{
  L(19,38+y,cast?10:16,cast?33:48,tone,5);L(20,38+y,cast?11:17,cast?33:47,toneLight,2);R(cast?8:14,cast?30:47,5,5,toneLight);
  if(cast){L(36,38+y,44,31,tone,5);R(43,28,5,5,toneLight);}else{L(36,38+y,43,44,tone,4);L(43,44,36,48,tone,3);R(34,46,5,4,toneLight);}
 }
 // Narrow, confident eyes and a small mouth leave room for the center-parted fringe.
 P([[19,20+y],[23,16+y],[33,16+y],[38,23+y],[36,31+y],[32,36+y],[24,35+y],[19,29+y]],tone);P([[22,22+y],[34,22+y],[36,26+y],[33,32+y],[25,33+y],[21,28+y]],toneLight);
 const closed=blink||expression==='hurt',focused=charging||['focused','ultimate'].includes(expression);
 for(const x of [22,32]){L(x,26+y,x+3,26+y,ink);if(closed){L(x,28+y,x+3,28+y,ink);continue;}R(x+1,27+y,3,3,'#f6ecdb');R(x+1,27+y,2,3,'#887261');R(x+1,28+y,1,2,ink);R(x+1,27+y,1,1,'#fff5db');if(focused)R(x===22?x:x+3,26+y,1,2,ink);}
 L(26,33+y,30,33+y,expression==='hurt'?'#9d6868':'#9d766b');if(!focused&&!closed)R(30,32+y,1,1,'#b18a76');
 P([[16,24+y],[17,15+y],[22,9+y],[28,8+y],[34,10+y],[39,16+y],[40,29+y],[36,34+y],[35,22+y],[32,17+y],[29,22+y],[27,18+y],[24,21+y],[21,18+y],[20,29+y],[18,34+y]],hair);
 P([[20,18+y],[23,12+y],[27,11+y],[27,17+y],[24,20+y],[22,17+y]],hairLight);P([[29,11+y],[33,12+y],[36,17+y],[36,23+y],[33,18+y],[30,21+y]],hairLight);L(19,26+y,18,40,hairLight);L(37,26+y,38,40,hairShade);
 // Garuda is rendered as a live orbiting companion, independently of the outfit.
 return outline(r.pixels,ink);
}
