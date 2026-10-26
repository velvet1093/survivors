import {enemyArtFrame} from './enemy-art-kit.js';

// Three independently proportioned carapaces retain Cell's evolving anatomy.
export function cellPixels(m={}){
 const {R,P,L,leg,arm,tail,attack,finish,ink}=enemyArtFrame(m),stage=Math.max(0,Math.min(2,m.cellStage||0));
 const green=stage===1?'#819f58':'#92ad62',shade='#486955',light='#c7d18e',black='#283643',blackLight='#52616a',ivory='#e4d8b8',purple='#aa89af',purpleShade='#6d617f';
 const heavy=stage===1,perfect=stage===2,reach=attack?5:0;
 if(stage===0){
  // Long tubular tail with an open needle tip curves clear of the right hand.
  L(34,48,45,59,black,6);L(44,59,45+tail,47,shade,5);L(45+tail,47,44+tail,34,green,4);L(44+tail,35,47+tail,28,ivory,2);
  P([[44+tail,29],[47+tail,24],[50+tail,31],[47+tail,35]],light);R(46+tail,29,2,3,black);
  P([[17,31],[10,49],[11,58],[22,49],[25,34]],black);P([[36,31],[44,48],[43,55],[33,47],[30,34]],black);L(13,47,18,34,blackLight);L(41,46,36,34,blackLight);
 }
 if(perfect){
  P([[18,30],[10,34],[8,58],[18,51],[25,35]],black);P([[36,30],[45,34],[47,58],[36,51],[30,35]],black);
  L(11,36,11,52,blackLight);L(44,36,44,52,blackLight);P([[17,31],[23,33],[20,48],[13,53]],'#38484d');P([[36,31],[32,34],[37,48],[43,53]],'#38484d');
 }
 for(const [x,side]of [[heavy?19:22,-1],[heavy?36:34,1]]){
  const d=side*leg,knee=x+d*.5+side*(heavy?1:0),foot=x+d,bulk=heavy?5:perfect?3:4;
  // Convex thigh shells taper into an exposed knee, a calf and a narrow ankle.
  P([[x-bulk+1,48],[x+bulk-1,48],[x+bulk,52],[x+bulk+1,55],[knee+3,60],[knee-3,60],[x-bulk-1,55],[x-bulk,51]],black);
  P([[x-bulk+2,49],[x+bulk-1,50],[x+bulk,54],[knee+2,57],[knee-2,58],[x-bulk,54]],green);
  L(x-bulk+2,51,x-1,56,light,2);L(x+bulk-1,52,knee+1,57,shade);
  P([[knee-3,58],[knee+3,58],[knee+4,61],[foot+3,65],[foot+2,69],[foot-2,69],[foot-3,64],[knee-4,61]],black);
  P([[knee-2,59],[knee+2,59],[foot+2,63],[foot+1,67],[foot-1,67],[foot-2,63]],shade);
  P([[knee-1,61],[knee+1,61],[foot+1,64],[foot,67],[foot-2,65]],green);L(knee-2,61,foot-2,64,light);
  P([[knee-3,58],[knee+2,57],[knee+3,59],[knee+1,61],[knee-2,61]],perfect?purpleShade:light);
  L(knee-2,58,knee+1,58,perfect?purple:ivory);R(foot-2,67,4,2,black);
  P([[foot-2,68],[foot+2,68],[foot+3,70],[foot+side*5,71],[foot+side*5,73],[foot-side*3,73],[foot-side*3,71]],perfect?ivory:light);
  L(foot-2,71,foot+2,71,'#f0e5c6');L(foot-side*2,72,foot+side*4,72,shade);
  R(x+bulk-2,53,2,2,black);R(x-bulk+1,55,1,2,black);
 }
 // Heavy Semi-Perfect shoulders differ from the narrow insect waist and V chest.
 P(heavy?[[14,31],[22,28],[34,28],[42,33],[44,41],[39,51],[34,55],[20,55],[13,46],[11,39]]:[[18,32],[23,30],[32,30],[38,33],[40,41],[34,52],[21,52],[16,43]],shade);
 P(heavy?[[17,32],[23,30],[33,31],[39,34],[39,43],[34,48],[22,48],[16,42]]:[[20,33],[25,31],[31,32],[36,34],[36,40],[31,45],[24,45],[19,40]],green);
 if(perfect){
  P([[20,34],[25,35],[28,39],[31,35],[36,34],[34,41],[29,44],[23,41]],black);
  P([[23,35],[27,37],[28,40],[30,37],[34,35],[32,40],[28,42],[24,40]],purple);L(24,36,27,38,'#d0b2cd');
  R(24,44,9,7,purpleShade);for(const yy of [44,47]){R(25,yy,7,1,purple);R(27,yy,1,1,'#cdb0cb');}
 }else{
  P([[23,35],[28,38],[34,35],[34,43],[31,48],[24,47],[21,42]],stage===0?'#bcaa75':'#ca9869');
  for(const yy of [38,41,44]){L(24,yy,31,yy+1,black);L(25,yy+1,30,yy+2,light);}
 }
 P([[20,49],[25,48],[28,51],[32,48],[37,49],[34,55],[22,55]],black);R(25,51,7,2,perfect?purple:light);
 for(const [x,side]of [[heavy?13:17,-1],[heavy?42:38,1]]){
  const dx=side*arm,hy=attack&&side===1?44:53,elbow=x+side*2+dx*.4,hand=x+side*(attack?5:2)+dx,width=heavy?5:3;
  // Rounded shoulder caps, a tapered bicep and bent elbow replace pillar arms.
  P([[x-width+1,31],[x-2,29],[x+2,29],[x+width,32],[x+width+1,36],[x+width-1,40],[x-width+1,40],[x-width-1,36]],black);
  P([[x-width+2,32],[x-1,30],[x+2,31],[x+width-1,34],[x+width-2,38],[x-width+1,37]],green);
  L(x-width+2,32,x-1,31,light);L(x-1,31,x+2,32,light);
  P([[x-width+1,37],[x+width-1,37],[elbow+3,43],[elbow+2,46],[elbow-3,45],[x-width,40]],shade);
  P([[x-width+2,37],[x+width-2,38],[elbow+1,42],[elbow-1,43],[x-width+1,40]],green);L(x-width+2,38,elbow-2,42,light);
  P([[elbow-3,42],[elbow+2,41],[elbow+4,44],[elbow+1,47],[elbow-3,46]],black);L(elbow-2,43,elbow+1,43,purpleShade);
  P([[elbow-2,45],[elbow+3,44],[hand+4,hy-5],[hand+2,hy],[hand-2,hy],[hand-4,hy-5]],perfect?ivory:green);
  P([[elbow-1,46],[elbow+1,45],[hand+2,hy-5],[hand,hy-1],[hand-2,hy-4]],perfect?'#f1e7ce':light);L(hand+2,hy-5,hand+1,hy-1,shade);
  P([[hand-2,hy-1],[hand+2,hy-1],[hand+4,hy+1],[hand+3,hy+4],[hand,hy+5],[hand-3,hy+3],[hand-4,hy]],perfect?ivory:light);
  L(hand-2,hy,hand+1,hy,perfect?'#f7eed5':ivory);R(hand+2,hy+1,2,2,shade);for(const xx of [hand-1,hand+1])R(xx,hy+3,1,1,shade);
  R(x,34,2,2,black);R(x-width+2,37,1,2,black);
  if(attack&&side===1){const tip=Math.min(53,hand+6);L(hand+3,hy,tip,hy-reach,ivory);R(tip-1,hy-reach-1,2,2,purple);}
 }
 // Forked crown, layered temple plates and compact eyes preserve the source face.
 if(stage===0){
  P([[18,23],[17,7],[21,8],[28,17],[34,9],[39,6],[39,24],[35,29],[21,29]],black);
  P([[19,20],[19,10],[23,13],[28,21],[34,14],[37,9],[37,21],[33,25],[23,25]],green);L(20,11,22,16,light);L(36,11,35,17,light);
  P([[23,20],[28,18],[34,21],[34,28],[29,33],[23,29]],'#a4b184');P([[25,25],[32,25],[30,30],[27,31],[24,28]],'#c4bc88');R(25,28,7,2,black);
 }else if(heavy){
  P([[16,23],[17,6],[22,8],[28,17],[33,9],[40,6],[40,24],[37,30],[19,30]],black);
  P([[18,21],[19,10],[24,13],[28,22],[33,14],[38,10],[38,23],[34,27],[21,27]],green);L(20,11,22,18,light,2);L(36,12,35,19,light,2);
  P([[22,21],[34,21],[36,27],[33,33],[24,33],[20,27]],'#ad7a59');P([[23,23],[33,23],[34,27],[31,30],[25,30],[22,27]],'#d5a579');R(25,29,8,2,black);R(24,31,9,1,'#e0bb8a');
 }else{
  P([[17,23],[17,3],[22,6],[28,17],[34,6],[39,3],[39,23],[35,29],[21,29]],black);
  P([[19,20],[19,6],[22,9],[28,21],[34,9],[37,6],[37,21],[33,25],[22,25]],green);L(20,8,22,15,light);L(36,8,34,15,light);
  P([[22,22],[28,18],[35,22],[34,28],[29,32],[23,29]],ivory);P([[25,22],[28,20],[32,22],[31,28],[28,30],[25,27]],'#f1e2c5');R(26,28,5,1,'#8d6e73');
 }
 for(const xx of [22,31]){L(xx,22,xx+4,22,black);R(xx+1,23,3,2,'#e7dec1');R(xx+2,23,1,2,'#b05a84');}
 for(const [x,y]of [[20,12],[35,16],[18,33],[35,33],[19,39],[36,41],[22,49],[34,48]]){R(x,y,2,2,black);R(x+1,y+1,1,1,'#354d4b');}
 return finish();
}
