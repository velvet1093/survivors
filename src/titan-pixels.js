import {variantTitanPixels} from './titan-variants.js';
import {bertholdtPixels} from './boss-reference-pixels.js';
import {enemyArtFrame,enemyFace,enemyLegs} from './enemy-art-kit.js';
export const TITAN_PALETTES={smilingtitan:['#d9bd8c','#96774f','#f2d4aa'],beardedtitan:['#c4a488','#6b5246','#e6c7a5'],crawlingtitan:['#d3ab93','#8e6a60','#ebc8ac'],smalltitan:['#e0bc91','#815d49','#f5d8af'],puretitan:['#d5b397','#947269','#edcdb0'],abnormal:['#caa18c','#8b6863','#e5bf9e'],annie:['#dfb58f','#ad6c68','#f4d5ab'],reiner:['#d6c18f','#826c5c','#efe0b8'],bertholdt:['#bc786b','#704e53','#edb6a0']};
function scoutPixels(id,m){
 const {r,R,P,L,leg,arm,attack,finish}=enemyArtFrame(m),annie=id==='annie',jacket='#aa875f',shade='#755b48',lit='#d2ac7f',shirt='#eee9dc',strap='#4c4944',skin='#e9c7a6',hair=annie?'#cbb077':'#c2ad7d',hairShade='#8a795e',hairLight='#ead6a4',w=annie?0:2;
 enemyLegs(r,{leg,left:20,right:31,top:48,width:6,cloth:shirt,shade:'#aeb5ae',light:'#f5eedb',boots:'#594a40',bootLight:'#8f745b'});
 // Individually articulated leather thigh harness and steel ODM canisters.
 for(const [x,d]of [[20,-leg],[31,leg]]){L(x+d,52,x+5+d,59,strap,2);L(x+5+d,52,x+d,59,strap);R(x+d-1,56,8,2,strap);}
 for(const x of [15,37]){R(x,48,4,9,'#627376');R(x,49,1,6,'#bacbc7');R(x,56,4,2,'#3c4c55');}
 P([[18-w,32],[24,29],[31,29],[37+w,33],[39+w,43],[35,51],[20,51],[16-w,42]],shade);
 P([[21,32],[25,30],[31,31],[35,34],[34,48],[22,48]],shirt);
 if(annie){P([[20,31],[24,29],[29,31],[34,29],[37,33],[34,36],[29,34],[24,35]],'#c9d1c7');L(24,32,28,35,'#9faea7');L(33,32,29,35,'#f4f0df');}
 P([[18-w,33],[23,32],[24,41],[27,45],[24,49],[18,47],[16-w,40]],jacket);P([[32,32],[37+w,34],[39+w,40],[35,48],[30,49],[29,45],[33,41]],jacket);
 L(19-w,34,22,37,lit);L(35+w,34,32,38,lit);R(18,44,5,2,lit);R(32,44,5,2,lit);L(23,35,31,47,strap,2);L(32,35,23,47,strap);R(20,48,16,3,strap);R(27,48,4,2,'#c9c2a9');R(28,48,2,1,shirt);
 const hy=attack?43:52;
 L(18-w,35,12-arm,hy-4,shade,6);L(18-w,35,13-arm,hy-5,jacket,4);L(17-w,36,14-arm,hy-8,lit);L(37+w,35,42+arm,hy-4,shade,6);L(37+w,35,41+arm,hy-5,jacket,4);L(38+w,36,40+arm,hy-8,lit);
 R(11-arm,hy-3,5,3,shade);R(40+arm,hy-3,5,3,shade);R(12-arm,hy,4,4,skin);R(41+arm,hy,4,4,skin);R(16-w,35,4,5,shirt);L(16-w,36,18-w,38,'#5b7581');L(19-w,36,17-w,39,'#789c86');
 L(13-arm,hy+2,attack?4:5,attack?34:66,'#9cb7b9',2);L(14-arm,hy+2,attack?5:6,attack?34:65,'#e4e9da');L(43+arm,hy+2,attack?52:51,attack?30:66,'#a5bdbe',2);L(44+arm,hy+2,attack?53:52,attack?30:65,'#edf1df');
 R(24,27,8,7,'#bc927e');enemyFace(r,{y:annie?-1:0,tone:skin,eye:annie?'#729ca6':'#738a75',narrow:true});
 if(annie){
  // Side-parted bangs and braided bun sit low over Annie's compact face.
  P([[16,23],[15,16],[18,10],[24,7],[31,7],[36,11],[39,17],[38,26],[34,28],[34,17],[29,15],[26,20],[22,25],[19,29],[17,28]],hairShade);P([[17,20],[18,13],[24,9],[31,9],[35,12],[37,19],[35,23],[33,16],[29,13],[25,19],[20,25],[18,26]],hair);
  L(23,11,29,10,hairLight);L(31,11,34,14,hairLight);L(21,16,19,23,hairLight);P([[35,11],[40,12],[43,16],[42,22],[38,25],[35,20]],hairShade);P([[37,13],[40,14],[41,18],[39,21],[37,19]],hair);R(38,16,3,1,hairLight);L(25,28,28,28,'#99756d');
 }else{
  P([[17,22],[16,16],[18,9],[22,7],[33,7],[38,11],[39,19],[36,25],[34,18],[32,15],[29,17],[25,15],[21,17],[20,24]],hairShade);P([[18,16],[20,10],[24,8],[33,9],[36,12],[37,17],[33,14],[29,15],[25,13],[21,15]],hair);for(const x of [21,25,29,33])L(x,10,x+1,13,hairLight);L(20,21,24,21,hairShade);L(30,21,34,21,hairShade);L(23,29,31,29,'#bc927e');
 }
 return finish();
}
function shifterPixels(id,m){
 const {R,P,L,leg,arm,attack,ink,finish}=enemyArtFrame(m),female=id==='annie',muscle=female?'#b56862':'#934e4b',shadow='#713b42',lit='#d88876',bone=female?'#e6cbb1':'#d0bb85',boneShade=female?'#bc9a8c':'#927d5d',boneLight=female?'#f3e0c6':'#eee0b5';
 for(const [x,d]of [[female?19:16,-leg],[female?31:32,leg]]){const w=female?7:9;P([[x,47],[x+w,47],[x+w+1+d,57],[x+w-1+d,64],[x+w-2+d,70],[x+d,70],[x-2+d,61]],shadow);P([[x+1,49],[x+w-1,49],[x+w-1+d,56],[x+w-3+d,63],[x+d,60]],muscle);L(x+2,50,x+3+d,59,lit,2);L(x+w-2,51,x+w-2+d,57,bone);R(x+d,60,w-1,3,bone);L(x+1+d,64,x+1+d,69,lit,2);P([[x+d,68],[x+w-2+d,68],[x+w+2+d,72],[x-4+d,72],[x-4+d,70]],muscle);L(x-3+d,70,x+w-3+d,70,bone);}
 const w=female?0:3;
 P([[21,25],[34,25],[37+w,30],[42+w,33],[40+w,42],[35,49],[35,54],[21,54],[18-w,43],[12-w,34],[19,29]],shadow);P([[22,27],[28,29],[33,26],[36,32],[39+w,34],[35,39],[29,36],[23,39],[16-w,34],[21,31]],muscle);
 P([[21,38],[27,37],[28,45],[26,52],[21,50],[19,44]],muscle);P([[30,37],[35,38],[37,44],[34,51],[29,53],[29,44]],muscle);
 for(let i=0;i<4;i++){L(17-w+i,36+i*3,24,38+i*3,bone);L(39+w-i,36+i*3,32,38+i*3,bone);}R(25,39,6,13,muscle);L(28,39,28,52,shadow);for(const yy of [40,44,48]){R(25,yy,2,2,lit);R(29,yy,2,2,lit);}L(20,49,25,53,bone);L(35,49,31,53,bone);
 for(const [x,side]of [[female?15:10,-1],[female?40:45,1]]){const reach=arm*side,hy=attack?46:54;P([[x-3,31],[x+3,30],[x+5,36],[x+3+reach,44],[x-3+reach,44],[x-5,36]],muscle);L(x-1,33,x+reach-1,41,lit,2);L(x+2,33,x+reach+2,40,bone);P([[x-3+reach,42],[x+3+reach,42],[x+4+reach,hy],[x-4+reach,hy],[x-5+reach,47]],shadow);L(x-2+reach,44,x-1+reach,hy-1,lit,2);L(x+1+reach,43,x+2+reach,hy-2,muscle);R(x-4+reach,hy,8,6,female?'#9cbdc2':boneShade);R(x-3+reach,hy,6,4,female?'#c8e0de':bone);L(x-3+reach,hy,x+2+reach,hy,female?'#f1f6e5':boneLight);for(const d of [-1,1,3])R(x+d+reach,hy+4,1,2,shadow);}
 if(!female){
  // Interlocking shoulder, breast and thigh plates separate Reiner from muscle-only Titans.
  for(const x of [14,36]){P([[x-5,30],[x+3,28],[x+8,33],[x+6,39],[x-3,39],[x-6,35]],boneShade);P([[x-4,31],[x+3,30],[x+6,33],[x+4,36],[x-2,37]],bone);L(x-3,31,x+2,31,boneLight);}
  P([[18,33],[25,31],[27,35],[26,41],[19,40],[15,37]],bone);P([[31,35],[34,31],[41,33],[43,37],[35,41],[30,40]],bone);L(18,34,24,33,boneLight);L(34,33,40,34,boneLight);
  for(const yy of [42,47]){P([[24,yy],[28,yy-1],[33,yy],[34,yy+3],[28,yy+4],[23,yy+3]],boneShade);R(25,yy,7,2,bone);L(26,yy,30,yy,boneLight);}
  for(const [x,d]of [[17,-leg],[33,leg]]){P([[x,51],[x+6,51],[x+7+d,56],[x+4+d,60],[x+d,58]],bone);L(x+1,52,x+5,52,boneLight);R(x+d,63,6,3,boneShade);L(x+d,63,x+4+d,63,boneLight);}
 }
 P([[21,10],[25,6],[32,7],[36,12],[36,22],[32,28],[28,31],[23,27],[20,21]],shadow);P([[23,11],[26,8],[32,10],[34,14],[34,22],[31,26],[27,28],[23,24],[22,18]],female?bone:muscle);
 if(!female){P([[21,13],[24,10],[27,13],[27,19],[22,20]],bone);P([[30,13],[33,10],[36,14],[35,21],[30,19]],bone);L(28,13,28,22,boneLight);P([[23,22],[27,24],[32,22],[32,26],[28,29],[24,26]],bone);}
 for(const x of [23,30]){L(x,18,x+3,18,ink);R(x+1,18,1,1,female?'#769da6':'#d9bb68');}R(24,24,9,2,ink);R(25,24,7,1,boneLight);L(21,20,23,24,boneShade);L(35,20,33,24,boneShade);
 if(female){P([[19,24],[17,17],[19,9],[24,5],[31,5],[37,10],[39,20],[36,31],[33,27],[34,16],[30,13],[26,18],[23,17],[21,28]],'#a28b60');P([[19,18],[21,11],[25,7],[31,7],[35,11],[37,20],[35,25],[33,15],[30,11],[26,15],[23,14],[21,22]],'#d9c58b');L(24,9,29,8,'#f1dfa8');L(20,17,20,23,'#e6d79f');L(22,20,24,23,shadow);L(34,20,32,23,shadow);R(25,24,6,1,ink);R(26,24,4,1,boneLight);}
 else{P([[19,15],[20,8],[24,4],[32,4],[37,9],[37,16],[34,13],[31,9],[28,12],[25,9],[21,16]],'#bcbaa2');for(const x of [23,27,31,35])L(x,7,x-1,12,'#eee6c9');}
 return finish();
}
export function titanPixels(id,m={}){if(id==='bertholdt')return bertholdtPixels(m);const variant=variantTitanPixels(id,m);if(variant)return variant;return m.enraged?shifterPixels(id,m):scoutPixels(id,m);}
