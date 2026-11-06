import {raster,outline} from './pixel-characters.js';
import {canvas,motion,limb,selout,mix,eye,mouth,head as face,SKIN} from './hero-kit.js';
export const RIMURU_COLORS={hair:'#9ccbdc',hairShade:'#5f8eaf',hairLight:'#d6eef0',gold:'#e5bd68',coat:'#486b97',coatShade:'#2d415e',coatLight:'#7b9fbb',scarf:'#d7cdb2',ink:'#293743'};
export function rimuruPixels({frame=0,moving=false,pose='',attack=false,expression='neutral',blink=false,skin='default',form=0}={}){
 const r=raster(),{rect:R,poly:P,line:L}=r,c=RIMURU_COLORS,ink=c.ink;frame=((frame%4)+4)%4;
 if(pose==='predator'||form==='slime'){
  const squish=moving?[0,3,0,-2][frame]:0,top=37+squish,side=squish*.6;
  P([[8-side,63],[9-side,53],[14-side,44+squish],[22,top],[32,top-1],[41+side,44+squish],[47+side,55],[48+side,65],[42,70],[15,70]],c.hairShade);
  P([[10-side,62],[12-side,53],[17-side,45+squish],[24,top+2],[32,top+1],[40+side,46+squish],[45+side,57],[45,65],[39,68],[17,68]],'#73bedb');
  P([[14,52+squish],[19,44+squish],[25,41+squish],[32,41+squish],[38,46+squish],[38,50+squish],[31,48+squish],[22,49+squish]],'#a6dfea');
  P([[13,58+squish],[15,52+squish],[19,49+squish],[21,50+squish],[18,56+squish],[16,59+squish]],'#d9f5ee');
  R(35,47+squish,4,2,'#e4f7ef');L(19,67,38,67,'#a8e0e5',1);
  const ey=57+Math.round(squish*.6),closed=blink||expression==='hurt';
  if(closed){L(17,ey,22,ey+1,ink);L(33,ey+1,38,ey,ink);}else{L(17,ey-1,19,ey+1,ink);L(19,ey+1,22,ey+1,ink);L(33,ey+1,36,ey+1,ink);L(36,ey+1,38,ey-1,ink);}
  if(expression==='focused'||expression==='ultimate'){L(17,ey-3,22,ey-2,'#43677b');L(33,ey-2,38,ey-3,'#43677b');}
  L(26,ey+5,29,ey+5,'#547e92');return outline(r.pixels,ink);
 }
 return humanPixels({frame,moving,pose,attack,expression,blink,skin});
}
// Human form. Long pale-blue hair, gold eyes and either the Tempest Traveler look (long blue
// coat with fur cuffs, a cream fur scarf streaming behind him, black trousers and fur-topped
// boots) or the Demon Lord's black coat: fur collar, white shoulder panels, a gold-lined
// jacket and belt, grey trousers, chevron-stitched boots, a trailing coat tail and his katana.
function humanPixels({frame,moving,pose,attack,expression,blink,skin}){
 const c=RIMURU_COLORS,r=canvas(),{rect:R,poly:P,line:L,put}=r,demon=skin==='demonlord',{walk,y}=motion({frame,moving}),cast=attack||pose==='spell',sway=moving?[0,1,0,-1][frame]:0;
 const coat=demon?'#1e2230':c.coat,coatShade=demon?'#12141c':c.coatShade,coatLight=demon?'#3a3f52':c.coatLight,fur=demon?'#14161e':'#8aa4c4',furLight=demon?'#2e3240':'#b8cce0';
 // Long hair falling down the back, lifted a little by the wind.
 P([[15,20+y],[17,11+y],[24,6+y],[33,7+y],[40,13+y],[42,24+y],[44,40],[47+sway,50],[41,52],[37,44],[20,44],[15,52],[10-sway,49],[13,38]],c.hairShade);
 P([[16,21+y],[19,12+y],[25,8+y],[33,9+y],[39,15+y],[41,25+y],[42,40],[44+sway,48],[41,49],[36,42],[21,42],[16,49],[13-sway,47],[15,37]],c.hair);
 L(16,26,14-sway,46,c.hairLight);L(41,27,43+sway,46,'#c5e7ea');L(18,30,17,44,c.hairShade);
 // Demon Lord's coat tail sweeps out behind him.
 if(demon){P([[22,44],[16,42],[8-sway,52],[3-sway*2,66],[10-sway,64],[16,58]],coatShade);P([[21,45],[16,44],[10-sway,53],[6-sway*2,63],[11-sway,61],[17,56]],coat);L(16,46,8-sway*2,61,coatLight);}
 // Trousers and boots.
 for(const [x,d]of [[21,-walk],[30,walk]]){
  if(demon){P([[x-1,49],[x+6,49],[x+7+d,60],[x-1+d,60]],'#6a6e7a');R(x+d,50,2,9,'#8a8e9a');R(x+d-1,59,7,12,'#16181e');R(x+d,59,1,11,'#30343e');for(const yy of [61,64,67]){put(x+d+1,yy,'#4a4e5a');put(x+d+2,yy+1,'#4a4e5a');put(x+d+3,yy,'#4a4e5a');}R(x+d-1,70,8,1,'#0a0b0e');}
  else{R(x+d,52,5,11,'#22252e');R(x+d+1,53,1,9,'#3a3e4a');R(x+d-1,63,7,8,'#3a5a8a');R(x+d,64,1,6,'#5a7aaa');R(x+d-1,62,7,2,fur);for(let i=0;i<7;i+=2)put(x+d-1+i,61,furLight);R(x+d-1,70,7,1,'#1a2a44');}
 }
 // The coat: long panels split at the front over the legs.
 if(demon){
  P([[19,37+y],[37,37+y],[39,48],[38,58],[31,59],[29,50],[27,50],[25,59],[18,58],[17,48]],coatShade);
  P([[20,38+y],[27,40+y],[27,50],[24,57],[19,56],[18,48]],coat);P([[29,40+y],[36,38+y],[38,48],[37,56],[32,57],[29,50]],coat);
  // Dark grey jacket with its gold Y seam, and a belt with a silver buckle.
  P([[24,38+y],[32,38+y],[31,48],[25,48]],'#4a4e5c');L(25,39+y,28,42+y,c.gold);L(31,39+y,28,42+y,c.gold);L(28,42+y,28,48,c.gold);
  R(19,47,18,2,'#0e1014');R(26,47,4,2,'#c8ccd4');put(27,47,'#0e1014');L(21,49,20,56,coatLight);L(35,49,36,56,coatLight);
 }else{
  P([[19,37+y],[37,37+y],[40,47],[41,61],[33,62],[29,52],[27,52],[23,62],[15,61],[16,47]],coatShade);
  P([[20,38+y],[27,40+y],[27,52],[23,60],[17,59],[18,47]],coat);P([[29,40+y],[36,38+y],[39,47],[39,59],[33,60],[29,52]],coat);
  L(21,42+y,20,58,coatLight);L(35,42+y,37,57,coatLight);L(28,40+y,28,52,coatShade);for(const yy of [44,48])put(27,yy,'#22324a');
  L(17,59,23,60,coatShade);L(33,60,39,59,coatShade);
 }
 // Arms: the viewer-left hangs; the right rests at the hip, holds the katana or casts.
 const sleeve=coat,sleeveLight=coatLight,lx=15-walk*.3,ly=51;
 limb(r,20,40+y,lx,ly,{color:sleeve,light:sleeveLight,width:5});R(lx-2,ly+1,6,2,fur);R(lx-1,ly+1,4,1,furLight);
 const rx=cast?45:demon?40:36,ry=cast?31:demon?50:49;
 if(cast)limb(r,36,40+y,rx,ry,{color:sleeve,light:sleeveLight,width:5});
 else if(demon)limb(r,36,40+y,rx,ry,{color:sleeve,light:sleeveLight,width:5});
 else{L(36,40+y,41,45,sleeve,5);L(41,45,37,48,sleeve,4);L(37,41+y,40,45,sleeveLight);R(35,48,3,3,SKIN.base);}
 if(cast||demon){R(rx-2,ry+1,6,2,fur);R(rx-1,ry+1,4,1,furLight);}
 if(demon){
  // White shoulder panels on both sleeves.
  P([[17,38+y],[22,37+y],[21,42+y],[16,43+y]],'#d8dce4');P([[34,37+y],[39,38+y],[40,43+y],[35,42+y]],'#d8dce4');L(17,39+y,21,38+y,'#ffffff');
  // The katana: black lacquered sheath with gold bands, a gold guard and a wrapped hilt.
  const [hx,hy,ex,ey]=cast?[33,52,50,62]:[36,54,53,42];
  L(hx,hy,ex,ey,'#0c0d10',3);L(hx,hy,ex,ey,'#2e3038',1);for(const t of [.35,.7]){const bx=hx+(ex-hx)*t,by=hy+(ey-hy)*t;R(bx-1,by-1,2,3,c.gold);}
  const gx=hx-(ex-hx)*.08,gy=hy-(ey-hy)*.08;R(gx-1,gy-2,3,4,c.gold);R(gx,gy-1,1,2,'#f1deac');
  L(gx-1,gy,gx-6,gy+(cast?-3:4),'#5a2a22',2);L(gx-1,gy,gx-6,gy+(cast?-3:4),'#8a4a3a');R(gx-7,gy+(cast?-4:4),2,2,c.gold);
  L(gx-3,gy+(cast?0:2),gx-4,gy+(cast?6:10),'#5a2a22');put(gx-4,gy+(cast?7:11),'#7dc6e5');
 }
 if(cast){P([[43,26],[40,23],[43,18],[45,22],[49,17],[51,24],[48,28]],'#36546e');P([[43,25],[43,21],[46,24],[49,21],[49,25],[46,27]],'#7dc6e5');R(45,23,2,3,'#d2eff0');}
 // Head.
 face(r,y);
 const closed=blink,hurt=expression==='hurt',focus=expression==='focused'||expression==='ultimate'||cast;
 eye(r,21,26+y,{iris:c.gold,irisDark:'#a07a30',lash:c.ink,side:-1,closed,hurt,focus});eye(r,31,26+y,{iris:c.gold,irisDark:'#a07a30',lash:c.ink,side:1,closed,hurt,focus});
 mouth(r,34+y,expression,{lip:'#a27b70'});
 if(demon){
  // Thick black fur collar standing up around the neck.
  for(let i=0;i<9;i++){const x=19+i*2,yy=37+y-(i%2);R(x,yy,3,4,fur);put(x+1,yy,furLight);}
  P([[18,39+y],[38,39+y],[36,42+y],[20,42+y]],fur);
 }else{
  // The cream fur scarf: a thick wrap at the throat and two long ends streaming behind.
  const S=c.scarf,SS='#a9ae9e',SL='#eee4ca';
  P([[20,37+y],[36,37+y],[38,41+y],[34,44+y],[22,44+y],[18,41+y]],SS);P([[21,38+y],[35,38+y],[37,41+y],[34,43+y],[22,43+y],[19,41+y]],S);
  L(22,38+y,34,38+y,SL);L(21,41+y,35,41+y,SS);
  P([[21,39+y],[13,37+y],[6,41+sway],[8,44+sway],[14,42+y],[20,43+y]],SS);P([[20,40+y],[13,38+y],[8,41+sway],[9,43+sway],[14,41+y],[20,42+y]],S);L(18,40+y,11,40+sway,SL);
  P([[20,42+y],[13,45],[6,50+sway],[10,52+sway],[17,48],[22,44+y]],SS);P([[20,43+y],[13,46],[8,50+sway],[11,51+sway],[17,47],[21,44+y]],S);
  for(const [x,yy]of [[6,42],[7,50]])put(x,yy+sway,SL);
 }
 // Side-swept fringe with a long lock between the eyes and locks framing the jaw.
 P([[16,23+y],[16,15+y],[21,10+y],[28,8+y],[35,11+y],[40,17+y],[41,27+y],[39,36+y],[37,24+y],[34,19+y],[31,24+y],[28,20+y],[27,27+y],[25,20+y],[22,24+y],[20,20+y],[19,32+y],[16,37+y]],c.hair);
 P([[19,17+y],[23,12+y],[28,11+y],[26,17+y],[23,21+y],[21,18+y]],c.hairLight);P([[30,12+y],[34,13+y],[37,18+y],[38,23+y],[35,20+y],[33,17+y]],'#c5e7ea');
 L(17,25+y,17,34+y,'#bfdee4');L(38,26+y,38,35+y,c.hairShade);L(27,20+y,27,26+y,c.hairShade);
 return selout(r.pixels,c.ink);
}
