import {cellPixels} from './cell-art.js';
import {enemyArtFrame,enemyFace,enemyLegs,enemyTorso,enemyArms} from './enemy-art-kit.js';
export const RIFT_PALETTES={puppet:['#ac7e6d','#614e56','#e7c29a'],rootanbu:['#b6c7ce','#3a495f','#f1e9df'],hollow:['#e0daca','#353f50','#fff0dc'],cerobat:['#a5c0af','#334d4c','#deeed0'],celljunior:['#7aaabc','#3b5d7d','#d5dfb7'],timewraith:['#bf91a2','#57475e','#e8c595'],cell:['#98ba6d','#375b55','#e2dca4'],itachi:['#b6697f','#2b303e','#e4b4a8'],ulquiorra:['#b6d0be','#2f4b4b','#f3efda']};
export function riftPixels(id,m={}){
 if(id==='cell')return cellPixels(m);
 const {r,R,P,L,leg,arm,tail,attack,enraged,finish,ink}=enemyArtFrame(m),[base,shade,light]=RIFT_PALETTES[id];
 if(id==='puppet'){
  // Four segmented wooden arms surround a hanging slatted torso and small mask.
  P([[17,31],[36,31],[42+tail,61],[34,64],[29,60],[22,64],[12+tail,60]],'#42404a');P([[20,34],[24,35],[21+tail,59],[16+tail,60]],'#6b5260');
  for(const [x,d]of [[20,-leg],[31,leg]]){L(x,52,x+d,63,shade,4);R(x+d-2,62,7,7,base);R(x+d-4,69,10,3,shade);R(x+d-2,69,6,1,light);R(x+d-1,58,4,3,'#d4b48e');}
  for(const [side,x]of [[-1,18],[1,36]])for(let i=0;i<2;i++){
   const yy=33+i*10,ex=x+side*(9+arm),ey=yy+(i?5:-4),hx=ex+side*3,hy=attack?ey-7:ey+10;
   L(x,yy,ex,ey,shade,4);L(x+side,yy,ex,ey,base,3);R(ex-1,ey-1,4,4,'#d3b28b');L(ex,ey,hx,hy,base,3);L(ex,ey,hx,hy,light);R(hx-2,hy-1,6,4,shade);for(let n=0;n<3;n++)R(hx-1+n*2,hy+2,1,3,base);
  }
  P([[20,31],[33,31],[36,39],[34,53],[22,54],[18,43]],shade);P([[22,34],[32,34],[33,49],[24,51],[21,43]],base);
  for(const yy of [35,39,43,47]){L(22,yy,33,yy+1,shade);L(23,yy+1,31,yy+2,light);}R(26,47,4,6,'#72554e');
  P([[18,14],[23,9],[32,10],[37,16],[36,25],[31,31],[23,29],[18,23]],shade);P([[21,14],[25,11],[31,13],[34,17],[33,24],[29,28],[23,25],[20,20]],base);
  L(20,15,23,20,light);L(33,16,32,22,light);R(22,19,4,2,ink);R(30,19,4,2,ink);R(24,19,1,1,'#edc997');R(31,19,1,1,'#edc997');L(23,25,31,25,ink);for(const x of [24,27,30])L(x,24,x,27,shade);R(26,12,2,4,shade);
  P([[18,15],[17,10],[22,5],[31,6],[37,11],[38,16],[33,13],[28,11],[23,14]],'#5d4c53');L(21,10,29,8,'#aa8270');
 }else if(id==='rootanbu'){
  enemyLegs(r,{leg,cloth:'#46566b',shade:'#29394b',light:'#8593a0',boots:'#343c49'});
  enemyArms(r,{arm,attack,base:'#677785',shade:'#3a495f',light:'#a5b1b8',hands:'#e4c9ac'});enemyTorso(r,{base:'#39495d',shade:'#253345',light:'#66768a'});
  P([[20,32],[27,35],[35,32],[37,43],[33,49],[22,49],[18,42]],'#9bacb8');L(24,35,24,45,'#d0d6d3');L(32,35,31,45,'#546675');R(20,48,17,3,'#303a4a');R(26,48,5,2,'#c5b795');
  P([[16,18],[16,12],[19,8],[22,4],[26,10],[31,5],[33,11],[39,9],[39,20]],'#394a60');L(19,12,24,10,'#7f8d9b');
  P([[18,16],[22,11],[33,12],[38,18],[35,27],[28,33],[21,27]],'#b6c7ce');P([[20,17],[24,13],[31,14],[35,18],[33,25],[28,29],[23,25]],'#f1e9df');
  P([[20,20],[25,20],[24,23],[21,23]],ink);P([[30,20],[35,20],[34,23],[31,23]],ink);L(21,16,24,18,'#ad6877',2);L(34,16,31,18,'#ad6877',2);L(28,24,27,27,'#ad6877');R(27,29,3,1,'#7c7c82');
  const hy=attack?40:51;L(42+arm,hy,49+arm,hy-23,'#798d98',3);L(43+arm,hy,50+arm,hy-23,'#e7e9da');L(40+arm,hy-3,46+arm,hy-1,'#c3a77a',2);R(41+arm,hy+2,3,5,'#5d5661');
 }else if(id==='hollow'){
  // Lean dark limbs and a narrow rib cage keep the ivory horned mask prominent.
  for(const [x,d]of [[19,-leg],[33,leg]]){P([[x,48],[x+6,48],[x+5+d,61],[x+2+d,69],[x-2+d,69]],'#394452');L(x+1,51,x+d,64,'#667483',2);P([[x-2+d,67],[x+3+d,67],[x+7+d,71],[x-5+d,71]],'#6b7d84');}
  L(17,32,10-arm,48,'#465361',6);L(10-arm,48,8-arm,60,'#2f3c4a',4);L(39,32,45+arm,48,'#465361',6);L(45+arm,48,47+arm,60,'#2f3c4a',4);
  for(const [x,side]of [[7-arm,-1],[46+arm,1]]){
   P([[x-1,56],[x+4,56],[x+5,60],[x+3,62],[x-1,61],[x-2,59]],'#87968e');
   L(x,57,x+3,57,'#c5cbb8');R(x+side*2,58,2,3,light);
   for(let i=0;i<3;i++)L(x+i*2,60,x+i*2+(i-1),65,light);
  }
  P([[18,30],[37,30],[41,39],[36,51],[30,55],[22,51],[15,40]],shade);P([[21,32],[27,35],[34,32],[36,39],[32,47],[24,47],[20,40]],'#657580');
  for(let i=0;i<3;i++){L(21,36+i*4,25,38+i*4,'#b0b7ac');L(34,36+i*4,30,38+i*4,'#b0b7ac');}R(25,37,7,8,ink);P([[27,38],[31,39],[30,43],[27,44]],'#718c97');
  P([[17,20],[13,13],[15,6],[20,12],[23,10],[33,10],[37,14],[42,6],[43,15],[39,24],[35,31],[27,35],[19,29]],'#b3b5aa');
  P([[19,17],[24,12],[33,13],[37,18],[35,26],[29,31],[22,28],[18,23]],light);L(21,16,24,14,'#e9e6cd');
  P([[20,20],[25,19],[25,23],[21,24]],ink);P([[31,19],[36,20],[35,24],[31,23]],ink);P([[27,23],[25,27],[30,27]],shade);R(23,28,11,3,'#713f4d');for(const x of [24,27,30,33])R(x,27,1,4,light);
  if(attack){L(8-arm,62,5-arm,68,light,2);L(48+arm,62,51+arm,68,light,2);}
 }else if(id==='cerobat'){
  for(const side of [-1,1]){
   const spread=Math.round((side<0?(m.wingL??1):(m.wingR??1))*10),tip=28+side*(16+spread),hx=28+side*6;
   P([[hx,34],[tip,15],[28+side*25,34],[28+side*20,31],[28+side*19,44],[28+side*13,39],[28+side*9,48],[hx,40]],shade);
   P([[hx,35],[tip-side*3,21],[28+side*20,32],[28+side*16,36],[28+side*13,36],[28+side*9,43]],base);L(hx,35,tip-side*2,20,light,2);L(hx,35,28+side*19,34,light);L(hx,35,28+side*12,40,light);
  }
  P([[21,31],[34,31],[38,39],[35,46],[32,53],[28,58],[23,53],[20,46],[18,39]],shade);P([[23,33],[32,33],[34,39],[32,46],[29,52],[26,51],[23,44],[21,39]],base);L(26,35,25,44,light);L(31,35,32,43,light);
  // Bent wing shoulders and curled claw feet break the pointed lower silhouette.
  for(const [x,side]of [[21,-1],[35,1]]){P([[x-2,32],[x+2,31],[x+side*4,35],[x+side*3,39],[x-1,37]],base);L(x,33,x+side*3,35,light);}
  for(const [x,d,side]of [[24,-leg,-1],[31,leg,1]]){L(x,50,x+side*2,56,base,3);L(x+side*2,56,x+d,61,shade,3);P([[x+d-2,60],[x+d+2,60],[x+d+3,63],[x+d,64],[x+d-3,63]],light);for(const dd of [-2,0,2]){L(x+d+dd,62,x+d+dd+side,65,light);R(x+d+dd+side,65,1,1,shade);}}
  P([[18,24],[16,15],[22,19],[27,13],[32,19],[39,14],[37,26],[32,32],[25,33],[19,29]],light);P([[20,23],[24,20],[28,22],[31,19],[35,23],[33,28],[27,30],[22,28]],'#c7d5ba');R(21,24,5,2,ink);R(30,24,5,2,ink);R(23,24,1,1,'#dc796f');R(32,24,1,1,'#dc796f');R(25,29,7,2,shade);R(26,29,1,3,light);R(30,29,1,3,light);
 }else if(id==='celljunior'){
  const blue='#6b9eb5',blueShade='#3e617d',blueLight='#a9c7cd',dark='#2e4057',ivory='#d8dcbb';
  P([[17,34],[12,43],[18,56],[25,50],[27,39]],dark);P([[37,34],[43,44],[38,56],[31,51],[29,39]],dark);
  for(const [x,d]of [[19,-leg],[32,leg]]){P([[x,49],[x+7,49],[x+9+d,59],[x+6+d,68],[x+d,68],[x-2+d,59]],blueShade);P([[x+1,51],[x+5,51],[x+6+d,59],[x+3+d,65],[x+d,61]],blue);R(x+d-2,68,11,4,ivory);R(x+d+2,56,2,2,dark);}
  P([[18,32],[25,30],[32,30],[39,34],[40,44],[34,53],[22,53],[16,43]],blueShade);P([[21,33],[27,35],[34,33],[36,42],[31,47],[24,47],[20,41]],blue);P([[24,37],[28,39],[32,37],[33,44],[29,49],[24,45]],ivory);for(const yy of [40,43,46])L(25,yy,31,yy,dark);
  for(const [x,side]of [[16,-1],[39,1]]){const dx=side*arm,hy=attack?40:49;L(x,35,x+dx,hy,blue,6);L(x-1,36,x+dx-1,hy-4,blueLight,2);R(x+dx-3,hy,8,6,ivory);R(x+dx-2,hy+1,2,2,'#f0e7c9');}
  P([[17,24],[17,8],[22,10],[27,18],[33,10],[39,7],[40,24],[35,31],[22,31]],dark);P([[19,21],[20,12],[26,22],[32,22],[37,12],[38,23],[34,27],[22,27]],blue);L(21,13,23,19,blueLight);L(36,13,34,20,blueLight);
  P([[22,24],[34,24],[33,31],[28,35],[23,31]],ivory);L(22,25,26,25,dark);L(30,25,34,25,dark);R(24,26,2,2,'#b45e86');R(31,26,2,2,'#b45e86');L(26,32,31,31,dark);
  for(const [x,y]of [[20,18],[36,21],[20,35],[34,40],[22,49],[34,50]])R(x,y,2,2,dark);
 }else if(id==='timewraith'){
  const gold='#cfb46e',goldLight='#f3dda0',cloth='#8d637f',clothShade='#4e425b',clothLight='#bd93ad';
  P([[18,29],[35,29],[41+tail,51],[44+tail,65],[35,61],[31,72],[26,64],[20,69],[12+tail,64],[16-tail,49]],clothShade);
  P([[21,32],[27,35],[32,32],[35+tail,52],[31,63],[28,59],[25,65],[22+tail,56],[19,45]],cloth);L(22,38,24+tail,56,clothLight);L(33,38,35+tail,53,clothLight);L(29,46,28,60,clothShade);
  for(const [x,side]of [[18,-1],[36,1]]){L(x,35,x+side*(7+arm),46,cloth,4);P([[x+side*(5+arm)-2,44],[x+side*(9+arm),45],[x+side*(10+arm),51],[x+side*(6+arm),52]],clothShade);}
  P([[15,27],[14,20],[18,11],[25,5],[32,7],[39,14],[42,25],[38,34],[31,31],[24,34]],clothShade);P([[18,23],[21,13],[27,9],[33,12],[37,22],[34,29],[23,29]],cloth);
  P([[21,19],[24,14],[31,14],[35,19],[35,25],[31,29],[24,28],[20,24]],gold);P([[23,19],[26,16],[31,17],[33,21],[31,26],[25,26],[22,23]],'#eee1bd');
  for(const [x,y]of [[27,16],[32,20],[28,26],[23,21]])R(x,y,1,1,shade);L(28,18,28,22,ink);L(28,22,31,23,ink);R(27,21,2,2,'#af7f85');
  const py=attack?42:49;L(12-arm,46,10-arm,py+8,gold);P([[7-arm,py+3],[11-arm,py+1],[15-arm,py+5],[14-arm,py+10],[10-arm,py+12],[6-arm,py+8]],gold);R(8-arm,py+5,5,4,goldLight);L(10-arm,py+5,10-arm,py+8,shade);L(10-arm,py+8,13-arm,py+8,shade);
  L(42+arm,49,45+arm,54,gold);R(44+arm,53,3,5,goldLight);R(43+arm,54,5,2,gold);
 }else if(id==='itachi'){
  const black='#29303e',cloth='#323644',clothShade='#202735',red='#a95f72',redLight='#dfa4a5',hair='#242d3a',hairLight='#536171';
  if(enraged){
   // Amber Susanoo ribs and a spectral blade stand behind the black cloak.
   P([[8,21],[14,10],[21,9],[17,22],[16,42],[10,57],[5,48]],'#7d4657');P([[36,12],[44,8],[49,21],[49,43],[43,56],[39,43]],'#7d4657');
   for(let i=0;i<4;i++){L(11,25+i*6,20,28+i*6,'#c88767',2);L(44,25+i*6,36,28+i*6,'#c88767',2);}L(46,21,51,7,'#e1b37c',2);P([[50,10],[52,3],[55,10],[52,20]],'#eed09a');
   P([[16,14],[19,6],[25,3],[30,3],[37,8],[39,17],[34,15],[28,10],[22,15]],'#b87964');L(20,10,25,7,'#e0ac7e');L(32,7,36,12,'#e0ac7e');
  }
  enemyLegs(r,{leg,top:49,cloth:'#455264',shade:'#283546',light:'#72828e',boots:'#354251',bootLight:'#9aa4a5'});
  P([[17,32],[22,29],[27,31],[32,29],[38,33],[41+tail,64],[34+tail,65],[28,61],[21+tail,65],[14+tail,62]],clothShade);P([[20,34],[26,35],[28,42],[31,35],[36,33],[37+tail,60],[30,59],[23,61],[17+tail,60]],cloth);
  P([[18,31],[24,29],[28,35],[33,29],[38,32],[34,42],[27,40],[22,42]],red);P([[20,32],[24,31],[28,37],[32,31],[35,33],[32,39],[27,38],[23,40]],black);
  L(28,40,28,60,red,2);L(19+tail,59,25,58,'#52505b');L(32,59,37+tail,60,'#52505b');
  for(const [x,side]of [[17,-1],[37,1]]){const hy=attack&&side===1?41:51;L(x,35,x+side*(4+arm),hy-2,clothShade,7);L(x,36,x+side*(4+arm),hy-3,cloth,5);R(x+side*(4+arm)-2,hy,5,4,'#e9c7a6');}
  for(const [x,y]of [[21,45],[33,53]]){P([[x-4,y],[x-1,y-3],[x+3,y-2],[x+5,y+2],[x+1,y+4],[x-3,y+3]],red);L(x-3,y,x,y-2,redLight);L(x,y-2,x+3,y,redLight);L(x+3,y,x+1,y+2,redLight);}
  enemyFace(r,{eye:'#a34e69',narrow:true});L(23,23,21,27,'#9a7880');L(32,23,34,27,'#9a7880');
  P([[17,24],[15,17],[18,9],[23,6],[32,7],[38,12],[40,22],[38,32],[34,33],[34,20],[30,15],[27,19],[24,15],[20,21],[19,32],[16,32]],hair);L(19,12,22,10,hairLight);L(35,13,37,20,hairLight);
  R(19,15,17,4,'#8c939a');R(23,15,10,3,'#c7c9bb');L(26,16,30,17,'#526271');L(29,15,25,18,'#526271');P([[22,14],[25,13],[26,21],[23,24],[22,20]],hair);P([[31,14],[34,16],[34,24],[32,22]],hair);
  if(attack){L(43+arm,42,46+arm,36,'#e6d9bd',2);R(45+arm,35,2,3,'#b78c79');}
 }else if(id==='ulquiorra'){
  const white='#e6e8d9',whiteShade='#a8b9af',pale='#d6e0cb',paleLight='#edf0da',black='#293b43',hair='#26343d',hairLight='#52646b',green='#6caa8c';
  if(enraged){
   for(const side of [-1,1]){const spread=Math.round((side<0?(m.wingL??1):(m.wingR??1))*8);P([[28+side*7,31],[28+side*(15+spread),10],[28+side*27,22],[28+side*24,44],[28+side*18,38],[28+side*16,51],[28+side*10,43]],'#263941');L(28+side*8,32,28+side*(15+spread),14,'#536d6b');L(28+side*9,34,28+side*23,25,'#536d6b');}
   L(20,50,11,61,black,4);L(11,61,6+tail,54,black,3);P([[5+tail,53],[4+tail,49],[8+tail,50],[10+tail,55]],pale);
  }
  enemyLegs(r,{leg,top:49,cloth:enraged?'#34484b':white,shade:enraged?'#23383e':whiteShade,light:enraged?'#5f7772':'#f6f4df',boots:black,bootLight:'#63817a'});
  enemyArms(r,{arm,attack,base:enraged?pale:white,shade:enraged?'#8fa89b':whiteShade,light:paleLight,hands:pale});enemyTorso(r,{base:enraged?pale:white,shade:enraged?'#89a095':whiteShade,light:paleLight});
  if(enraged){P([[22,32],[27,35],[33,32],[35,39],[32,46],[24,46],[21,39]],pale);R(25,36,7,6,black);R(27,37,3,4,'#1e333b');L(24,45,31,45,'#8aa395');P([[20,47],[25,46],[28,49],[32,46],[37,48],[35,55],[30,52],[26,55],[21,52]],black);R(23,49,3,1,'#59716c');R(31,49,3,1,'#59716c');}
  else{L(28,33,28,49,black,2);R(20,47,17,3,black);R(26,47,5,2,'#768d85');P([[20,32],[25,31],[28,36],[31,31],[35,32],[31,39],[25,39]],white);}
  const hy=attack?40:51;if(attack){L(43+arm,hy,51+arm,hy-14,green,3);L(44+arm,hy-1,52+arm,hy-15,'#cbe9c4');}else{L(43+arm,hy,48+arm,32,green,2);L(44+arm,hy,49+arm,32,'#cbe9c4');}
  enemyFace(r,{tone:pale,shade:'#93aa9c',light:paleLight,eye:green,narrow:true,mouth:'#6a7d79'});L(22,24,23,28,'#528674');L(32,24,32,28,'#528674');
  P([[17,24],[15,17],[19,9],[24,6],[32,7],[38,13],[40,22],[36,29],[35,20],[31,16],[28,21],[25,17],[21,22],[19,29]],hair);P([[20,16],[22,10],[29,8],[34,11],[36,16],[31,13],[28,18],[25,14],[22,20]],'#3a4d54');L(20,13,23,10,hairLight);L(34,13,36,18,hairLight);
  if(enraged){for(const side of [-1,1]){P([[28+side*7,15],[28+side*12,5],[28+side*17,2],[28+side*15,10],[28+side*11,19]],whiteShade);L(28+side*9,15,28+side*15,4,paleLight,2);}R(22,24,2,1,'#9cd1a2');R(31,24,2,1,'#9cd1a2');}
  else{P([[33,15],[34,7],[38,3],[41,6],[40,16],[36,21]],whiteShade);P([[35,14],[36,8],[39,6],[39,14],[37,17]],paleLight);L(35,11,39,11,'#839a90');R(35,15,4,2,'#6b827b');}
 }
 return finish();
}
