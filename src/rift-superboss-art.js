import {primalDevilPixels,PRIMAL_DEVIL_PALETTES} from './primal-devil-art.js';
import {raster,outline} from './pixel-characters.js';

// The native grid, layered clusters and cool ink are shared with Aura and the
// Colossal Titan. These silhouettes belong only to the optional rift encounters.
export const RIFT_SUPERBOSS_PALETTES={
 deathdevil:PRIMAL_DEVIL_PALETTES.deathdevil,
 foundereren:['#d4c8a4','#8d836f','#f0e5bc','#3e393d','#b18478','#a3d8c5'],
 beerus:['#ad83c3','#6f568e','#d5a5db','#b5cfda','#d9ba72','#313345'],
 walpurgisrift:['#b69bb9','#6d526f','#e8dcd2','#b39870','#b86279','#393245'],
 aizenrift:['#e9e6ee','#a39bbd','#fff7f0','#4b355e','#a36ab8','#dfc9bb'],
 madararift:['#e7e7d9','#9ba8a3','#fff7dd','#34333f','#ab849e','#dac0aa'],
 sukunaheian:['#d8ac91','#926f72','#f4d3b0','#37313f','#eee6d1','#b27480'],
 borosrift:['#c67cba','#774f89','#f0b9dc','#ddd7e6','#90d4d4','#383145'],
 mimic:['#9b674b','#5d4344','#d6af70','#e8dbc4','#a585bc','#503950'],
};
const INK='#29303e',TAU=Math.PI*2;
const clampStep=(value,mult=.4)=>Math.max(-3,Math.min(3,Math.round((value||0)*mult)));

function founder(m={}){
 const r=raster(),{rect:R,line:L,poly:P}=r,[bone,shade,ivory,hair,muscle,eye]=RIFT_SUPERBOSS_PALETTES.foundereren;
 const stride=clampStep(m.leg),sway=clampStep(m.tail),rise=m.attack?-2:0;
 // Long distant ribs support the whole body, like an impossible moving forest.
 for(let i=0;i<7;i++){
  const x=4+i*7,top=16+Math.abs(3-i)*3,d=(i%2?-stride:stride);
  L(x,top,x-2+d,59+(i%3)*3,shade,3);L(x,top+1,x-1+d,57+(i%3)*3,bone);
  L(x-1+d,57+(i%3)*3,x-3+d,69+(i%2),shade,2);
  L(x-2+d,61,x-3+d,69+(i%2),ivory);L(x-4+d,70+(i%2),x+1+d,70+(i%2),shade);
 }
 // Raised shoulder girdle and a deep arch of vertebrae under the upper spine.
 L(5,17,19,8,shade,5);L(19,8,33,10,shade,5);L(33,10,49,21,shade,5);
 L(6,16,19,7,bone,3);L(19,7,32,9,ivory,3);L(33,10,49,20,bone,3);
 for(let i=0;i<11;i++){
  const x=6+i*4,y=i<4?16-i*2:8+(i-3)*2;
  R(x,y-3,3,6,shade);R(x,y-3,2,3,ivory);L(x,y+2,x+1,y+6,bone);
 }
 // A hollow rib cage: separate, bent bony struts leave transparent gaps.
 for(let i=0;i<6;i++){
  const y=19+i*5,w=18-i*1.6;
  L(27-w,y-4,13+i,32+i*4,shade,3);L(13+i,32+i*4,25,y+7,shade,3);
  L(29+w,y-4,44-i,32+i*4,shade,3);L(44-i,32+i*4,30,y+7,shade,3);
  L(28-w,y-4,14+i,32+i*4,bone);L(14+i,32+i*4,25,y+6,ivory);
  L(28+w,y-4,43-i,32+i*4,bone);L(43-i,32+i*4,30,y+6,bone);
 }
 L(27,15,26,53,shade,4);L(27,16,27,52,ivory);
 for(let y=18;y<54;y+=5)R(25,y,6,2,bone);
 // An elongated neck reaches forward into the hanging, long-haired Titan face.
 P([[24,35],[31,34],[34,42],[32,53+rise],[28,57+rise],[23,51+rise]],muscle);
 L(27,37,29,51+rise,shade,3);L(27,38,29,51+rise,bone);
 const dy=rise,dx=sway;
 P([[20+dx,40+dy],[26+dx,35+dy],[34+dx,38+dy],[39+dx,47+dy],[38+dx,61+dy],[41+dx,72],[35+dx,69],[34+dx,74],[29+dx,67],[25+dx,73],[22+dx,69],[17+dx,71],[19+dx,57+dy],[16+dx,48+dy]],hair);
 L(20+dx,45+dy,19+dx,65,'#63534f');L(35+dx,45+dy,37+dx,65,'#63534f');
 P([[22+dx,45+dy],[28+dx,42+dy],[34+dx,46+dy],[34+dx,54+dy],[31+dx,61+dy],[26+dx,62+dy],[21+dx,56+dy]],shade);
 P([[24+dx,45+dy],[29+dx,44+dy],[32+dx,47+dy],[31+dx,51+dy],[34+dx,56+dy],[30+dx,59+dy],[25+dx,58+dy],[22+dx,53+dy]],bone);
 L(22+dx,49+dy,26+dx,50+dy,hair,2);L(30+dx,50+dy,34+dx,49+dy,hair,2);
 R(24+dx,50+dy,2,1,m.enraged?'#f3c085':eye);R(31+dx,50+dy,2,1,m.enraged?'#f3c085':eye);
 P([[27+dx,50+dy],[29+dx,50+dy],[30+dx,55+dy],[27+dx,56+dy]],shade);
 L(23+dx,55+dy,32+dx,55+dy,hair,2);L(24+dx,56+dy,31+dx,56+dy,ivory);
 for(let x=24;x<32;x+=2)L(x+dx,55+dy,x+dx,58+dy,shade);
 L(25+dx,59+dy,30+dx,59+dy,muscle);
 P([[21+dx,42+dy],[26+dx,38+dy],[33+dx,41+dy],[35+dx,48+dy],[31+dx,46+dy],[30+dx,42+dy],[27+dx,47+dy],[24+dx,44+dy],[21+dx,49+dy]],hair);
 if(m.enraged){
  for(const [x,y]of [[2,37],[10,52],[44,43],[50,57]]){P([[x,y+3],[x+3,y-5],[x+5,y+2],[x+3,y+6]],'#c3bcaa');R(x+2,y,1,3,'#f4e6c3');}
  for(let x=5;x<50;x+=9)L(x,13+Math.abs(27-x)*.2,x+2,19+Math.abs(27-x)*.2,'#d0a77e');
 }
 return outline(r.pixels,INK);
}

function beerus(m={}){
 const r=raster(),{rect:R,line:L,poly:P}=r,[skin,shade,light,blue,gold,black]=RIFT_SUPERBOSS_PALETTES.beerus;
 const leg=clampStep(m.leg),arm=clampStep(m.arm),tail=clampStep(m.tail),raised=!!m.attack;
 // The long segmented tail curls well outside the narrow, upright silhouette.
 L(33,49,43+tail,56,shade,3);L(43+tail,56,48+tail,49,shade,3);L(48+tail,49,45+tail,43,shade,3);
 L(34,49,43+tail,55,skin);L(43+tail,55,47+tail,49,light);
 for(const [x,d]of [[22,-leg],[30,leg]]){
  L(x,52,x+d,63,shade,5);L(x+1,53,x+d+1,63,skin,3);
  R(x+d-1,62,6,3,gold);L(x+d+1,66,x+d+1,69,skin,3);
  P([[x+d-2,68],[x+d+4,68],[x+d+6,72],[x+d-3,72]],shade);L(x+d-1,70,x+d+3,70,light);
 }
 // Baggy dark-blue Egyptian trousers with a cyan pleated front and gold belt.
 P([[20,44],[35,44],[36,52],[33,59],[28,58],[27,52],[25,59],[19,58],[17,51]],black);
 P([[20,47],[26,47],[24,56],[21,57],[19,52]],'#496f93');P([[29,47],[34,47],[34,54],[30,57]],'#587e9d');
 P([[23,45],[32,45],[31,58],[27,62],[23,57]],blue);L(27,47,27,58,'#e0e5da');L(30,48,29,57,'#709cac');
 R(19,44,17,3,gold);R(21,45,13,1,'#f0d995');
 // Slim shoulders, purple abdomen, a diamond-set ceremonial collar.
 P([[22,29],[31,29],[35,34],[32,45],[22,45],[19,35]],shade);
 P([[24,31],[30,31],[32,35],[29,44],[24,43],[22,35]],skin);L(26,35,26,41,light);
 P([[19,29],[25,27],[31,27],[36,31],[33,36],[29,39],[23,37],[19,33]],black);
 P([[20,29],[25,29],[29,34],[34,30],[35,32],[29,38],[23,35]],blue);
 L(20,29,26,33,gold);L(26,33,29,36,gold);L(29,36,34,31,gold);
 P([[28,30],[31,32],[28,35],[25,32]],gold);P([[28,31],[30,32],[28,34],[26,32]],'#70a9a5');
 // One hand rises into the Hakai casting pose rather than a generic strike.
 L(20,32,16-arm,41,shade,4);L(16-arm,41,17-arm,48,skin,3);R(14-arm,42,5,3,gold);R(15-arm,48,4,5,skin);L(15-arm,49,15-arm,52,light);
 const handX=raised?42:37+arm,handY=raised?25:48;
 L(34,32,40,raised?34:41,shade,4);L(40,raised?34:41,handX,handY,skin,3);R(handX-2,handY+2,5,3,gold);R(handX-1,handY-1,4,4,skin);
 if(raised){L(handX,handY,handX+1,handY-6,skin,2);L(handX+2,handY,handX+3,handY-4,light);}
 // Tall pointed feline ears, angular muzzle and half-lidded yellow eyes.
 P([[19,18],[15,1],[20,3],[25,16]],shade);P([[20,14],[17,4],[19,5],[23,16]],skin);L(18,6,21,13,'#cb9ab7');
 P([[29,15],[34,2],[38,1],[36,20]],shade);P([[31,15],[35,5],[36,4],[34,17]],skin);L(35,7,33,14,'#cb9ab7');
 P([[20,15],[26,12],[33,14],[36,20],[34,26],[30,30],[24,29],[19,24]],shade);
 P([[22,16],[27,14],[32,16],[34,21],[31,27],[26,28],[22,24]],skin);
 L(23,17,26,16,light);L(31,17,33,19,light);
 L(21,20,26,21,INK,2);L(29,21,34,20,INK,2);
 R(23,21,3,1,'#e6d18a');R(30,21,3,1,'#e6d18a');R(24,21,1,2,black);R(31,21,1,2,black);
 P([[25,23],[30,23],[32,25],[29,27],[26,27],[24,25]],light);R(27,23,2,1,shade);L(27,24,28,25,shade);L(25,26,30,26,shade);
 R(24,29,8,2,gold);L(26,29,29,29,'#f0d995');
 if(raised||m.enraged){
  const ox=raised?44:43,oy=raised?14:35;
  P([[ox-5,oy-2],[ox-2,oy-6],[ox+3,oy-5],[ox+6,oy],[ox+3,oy+4],[ox-3,oy+5],[ox-6,oy+1]],'#6c4c91');
  P([[ox-3,oy-2],[ox,oy-4],[ox+3,oy-1],[ox+2,oy+2],[ox-2,oy+3]],'#be98d5');R(ox-1,oy-1,2,2,'#e5c6ed');
 }
 if(m.enraged){L(13,28,12,35,'#bb8bd5');L(41,9,43,5,'#cba2df');R(10,39,2,3,'#d4b7e7');R(39,58,2,2,'#d4b7e7');}
 return outline(r.pixels,INK);
}

function walpurgis(m={}){
 const r=raster(),{rect:R,line:L,poly:P}=r,[purple,shade,ivory,gold,red,dark]=RIFT_SUPERBOSS_PALETTES.walpurgisrift;
 const angle=m.gear||0,arm=clampStep(m.arm),sway=clampStep(m.tail),attack=!!m.attack;
 // A city caught in the clockwork crown: towers have separate roofs/windows.
 for(const [x,h]of [[5,9],[12,14],[20,10],[33,12],[41,15],[48,8]]){
  R(x,17-h,5,h,dark);R(x+1,18-h,3,h-2,shade);P([[x-1,17-h],[x+2,14-h],[x+5,17-h]],gold);
  for(let y=20-h;y<16;y+=3)R(x+2,y,1,1,m.enraged?'#dfa88b':'#d6c9b2');
 }
 // Massive counter-rotating toothed wheel frames the inverted stage dress.
 for(let i=0;i<18;i++){
  const a=i*TAU/18+angle,x=28+Math.cos(a)*23,y=23+Math.sin(a)*13;
  P([[x-3,y-3],[x+2,y-3],[x+4,y],[x+2,y+3],[x-3,y+2]],shade);R(x-1,y-2,2,2,gold);
 }
 P([[9,12],[19,8],[36,8],[47,14],[50,23],[46,31],[36,37],[17,36],[7,29],[5,21]],shade);
 P([[11,15],[20,11],[35,11],[44,16],[46,23],[42,29],[35,33],[19,32],[11,27],[9,21]],gold);
 P([[15,17],[22,14],[34,14],[41,18],[42,24],[36,29],[21,29],[14,24]],dark);
 for(let i=0;i<10;i++){
  const a=i*TAU/10-angle*.5;L(28+Math.cos(a)*6,22+Math.sin(a)*3,28+Math.cos(a)*15,22+Math.sin(a)*7,shade,2);
 }
 R(24,18,9,8,shade);R(26,20,5,4,gold);R(27,21,2,2,ivory);
 // Five scalloped tiers taper downward, making the upside-down gown readable.
 P([[5,28],[13,25],[21,29],[28,26],[36,29],[44,25],[52,28],[46,38],[39,45],[34,52],[30,58],[25,57],[19,47],[11,39]],dark);
 for(const side of [-1,1]){
  P([[28+side*5,30],[28+side*17,28],[28+side*21,30],[28+side*15,39],[28+side*8,48],[28+side*3,54]],shade);
  P([[28+side*8,31],[28+side*16,30],[28+side*17,33],[28+side*10,42],[28+side*5,48]],purple);
  for(let i=0;i<4;i++){const y=32+i*5,x=28+side*(18-i*3.5);L(x,y,28+side*4,y+5,ivory);L(x+side,y+2,28+side*4,y+7,shade);}
  L(28+side*6,47,28+side*(17+arm),50+attack*-4,shade,3);
  L(28+side*(17+arm),50+attack*-4,28+side*(22+arm),47+attack*-5,ivory,2);
  L(28+side*(22+arm),47+attack*-5,28+side*(23+arm),43+attack*-4,ivory);
 }
 P([[25,30],[30,30],[32,44],[29,55],[26,54],[23,44]],ivory);L(27,34,28,48,'#b9abb7');
 R(24,53,9,4,red);R(25,53,7,1,'#e4acba');
 // Upside-down, doll-like face and hanging crown; no upright human silhouette.
 const dy=sway;
 P([[23,56+dy],[31,56+dy],[36,61+dy],[34,67+dy],[28,70+dy],[21,66+dy],[19,61+dy]],shade);
 P([[24,57+dy],[30,57+dy],[33,61+dy],[31,66+dy],[27,68+dy],[23,64+dy],[22,60+dy]],ivory);
 L(23,61+dy,26,61+dy,dark,attack?2:1);L(30,61+dy,33,61+dy,dark,attack?2:1);
 R(24,61+dy,1,2,m.enraged?'#e7988b':'#b87891');R(31,61+dy,1,2,m.enraged?'#e7988b':'#b87891');
 L(26,65+dy,30,65+dy,red);if(attack)R(26,64+dy,4,2,dark);
 P([[20,65+dy],[23,66+dy],[26,71],[29,68+dy],[32,71],[35,66+dy],[37,68],[34,74],[22,74],[18,68]],gold);
 L(23,72,32,72,ivory);R(26,71,3,2,red);
 if(m.enraged){
  P([[1,36],[5,31],[9,38],[7,46],[3,44]],red);P([[47,41],[50,34],[54,39],[53,47],[49,48]],red);
  L(9,17,13,15,'#f0cec0');L(40,16,45,18,'#f0cec0');R(4,54,2,2,'#dfb0bb');R(47,59,2,2,'#dfb0bb');
 }
 return outline(r.pixels,INK);
}

function mimic(m={}){
 const r=raster(),{rect:R,line:L,poly:P}=r,[wood,shade,gold,teeth,tongue,dark]=RIFT_SUPERBOSS_PALETTES.mimic;
 const leg=clampStep(m.leg),arm=clampStep(m.arm),open=m.attack?8:Math.max(1,Math.round(Math.abs(m.head||0)*1.5));
 // Two spindly jointed legs fold away into the chest when its trap is closed.
 for(const [x,side]of [[17,-1],[36,1]]){
  L(x,51,x+side*(6+leg),60,shade,3);L(x+side*(6+leg),60,x+side*(4+leg),68,dark,3);
  P([[x+side*(4+leg)-3,66],[x+side*(4+leg)+4,66],[x+side*(6+leg)+5,70],[x+side*(4+leg)-4,70]],shade);
  L(x+side*(4+leg)-2,69,x+side*(4+leg)+3,69,gold);
 }
 P([[10,37],[44,37],[47,46],[43,57],[13,57],[9,49]],shade);R(13,40,29,14,wood);
 R(14,43,27,2,'#b78357');L(15,48,40,49,shade);L(15,53,40,52,'#bd8d5b');
 R(15,39,4,16,gold);R(36,39,4,16,gold);R(11,52,33,4,gold);
 for(const x of [16,37]){R(x,43,2,2,teeth);R(x,51,2,2,shade);}
 // Hinged domed lid and black mouth separate clearly during the bite windup.
 P([[9,34-open],[12,25-open],[19,21-open],[36,21-open],[44,27-open],[47,35-open],[44,41-open],[12,41-open]],shade);
 P([[12,33-open],[15,27-open],[21,24-open],[34,24-open],[41,29-open],[43,35-open],[12,36-open]],wood);
 L(16,28-open,39,29-open,'#c39060');R(17,24-open,4,13,gold);R(35,25-open,4,12,gold);
 R(10,35-open,36,4,gold);L(12,35-open,43,35-open,teeth);
 P([[13,38-open],[44,38-open],[43,44],[14,44]],dark);
 for(let i=0;i<8;i++){
  const x=14+i*4;P([[x,38-open],[x+3,38-open],[x+1,43-open]],teeth);
  P([[x,43],[x+3,43],[x+2,40]],teeth);
 }
 // The forked tongue lashes out beyond the lock when the mimic attacks.
 if(m.attack){
  L(27,40,29+arm,47,tongue,5);L(29+arm,47,45+arm,48,tongue,4);L(45+arm,48,51+arm,44,tongue,2);L(45+arm,48,52+arm,52,tongue,2);
  L(28,41,31+arm,46,'#d4b6dc');
 }else{P([[24,39],[32,39],[30,43],[26,43]],tongue);}
 R(24,46,9,7,shade);R(25,46,7,6,gold);R(27,47,3,2,dark);R(28,49,1,2,dark);
 // Red, narrow eyes only show on the animated monster, never on field caches.
 R(23,30-open,3,2,dark);R(29,30-open,3,2,dark);R(24,30-open,1,1,'#eea09a');R(29,30-open,1,1,'#eea09a');
 return outline(r.pixels,INK);
}

function aizen(m={}){
 const r=raster(),{rect:R,line:L,poly:P}=r,[white,shade,light,dark,violet,skin]=RIFT_SUPERBOSS_PALETTES.aizenrift;
 const arm=clampStep(m.arm),leg=clampStep(m.leg),sway=clampStep(m.tail),rise=m.attack?4:0;
 // Four broad, separate butterfly membranes frame the slender fused body.
 // Dark gaps and lilac veins keep the wings readable at the battlefield scale.
 for(const side of [-1,1]){
  const x=28+side*5,tip=28+side*25;
  P([[x,30],[28+side*13,20-rise],[tip,10-rise],[tip+side,22],[28+side*22,35],[28+side*10,43]],shade);
  P([[x+side,30],[28+side*15,21-rise],[tip-side,14-rise],[tip-side,23],[28+side*20,33],[28+side*10,39]],white);
  P([[28+side*9,37],[28+side*22,35],[tip,43+sway],[28+side*20,57+sway],[28+side*12,54],[28+side*5,43]],shade);
  P([[28+side*10,39],[28+side*21,38],[28+side*22,44+sway],[28+side*18,53+sway],[28+side*12,50],[28+side*7,43]],white);
  L(x+side*2,31,tip-side*2,17-rise,light,2);L(x+side*2,34,28+side*20,30,violet);
  L(28+side*9,40,28+side*20,47+sway,light,2);L(28+side*10,44,28+side*17,51+sway,violet);
  P([[28+side*15,29],[28+side*19,25],[28+side*21,28],[28+side*18,32]],'#bba1cf');
 }
 // Narrow white legs remain separate below the hanging split coat.
 for(const [x,d]of [[23,-leg],[30,leg]]){
  L(x,50,x+d,64,shade,5);L(x+1,51,x+d+1,65,white,3);
  P([[x-1+d,63],[x+4+d,63],[x+5+d,70],[x-2+d,71]],shade);L(x+d,65,x+1+d,69,light,2);
  R(x-2+d,70,8,2,dark);R(x-1+d,69,6,1,white);
 }
 P([[20,28],[26,25],[32,26],[36,31],[34,44],[38,60],[31,62],[28,53],[25,62],[18,60],[21,43]],shade);
 P([[22,29],[26,27],[30,28],[33,32],[31,43],[35,58],[31,59],[28,48],[24,59],[21,58],[24,42]],white);
 L(23,32,22,42,light);L(33,45,35,57,light);L(20,58,24,58,violet);
 P([[25,32],[30,32],[32,40],[29,47],[25,45],[23,39]],dark);
 // The Hōgyoku is a violet inset gemstone encircled by pale rib segments.
 P([[28,32],[31,36],[28,40],[25,36]],violet);P([[28,33],[30,36],[28,38],[27,36]],'#e2b8ec');R(28,34,1,2,light);
 for(let i=0;i<3;i++){L(22,34+i*4,25,36+i*4,light);L(33,34+i*4,30,36+i*4,light);}
 // The casting hand lifts and a black-violet energy bead grows above it.
 L(21,30,17-arm,39,shade,4);L(17-arm,39,17-arm,49,white,3);R(15-arm,48,5,5,white);L(16-arm,49,16-arm,52,light);
 const hy=m.attack?28:49,hx=m.attack?42:38+arm;
 L(34,31,39,38,shade,4);L(39,38,hx,hy,white,3);R(hx-1,hy-1,4,4,skin);L(hx,hy-1,hx+1,hy-5,white,2);
 if(m.attack){P([[42,15],[46,18],[45,22],[41,24],[38,20]],dark);P([[42,17],[44,19],[42,22],[40,20]],violet);R(41,18,2,2,'#edd5f4');}
 // Slick swept hair, a calm, angular face, and a pale fusion collar.
 P([[20,13],[22,8],[29,6],[35,10],[37,20],[34,26],[24,26],[20,21]],'#49394d');
 P([[22,15],[33,14],[35,20],[32,26],[27,28],[23,24]],skin);
 P([[23,16],[32,15],[33,20],[31,25],[27,26],[24,23]],'#f1ddd0');
 L(23,19,27,19,dark);L(30,19,33,18,dark);R(25,20,2,1,violet);R(31,19,1,2,violet);L(28,21,28,23,'#b99bab');L(27,25,30,24,'#997785');
 P([[20,16],[20,11],[25,6],[31,7],[35,12],[37,18],[32,15],[29,10],[26,15],[22,18]],'#46354b');
 L(23,10,29,8,'#8a6c83');L(30,9,34,13,'#74586f');P([[22,24],[25,27],[28,29],[31,27],[34,24],[35,30],[29,33],[22,30]],white);
 if(m.enraged){
  P([[26,7],[28,3],[30,7],[30,12],[27,14],[25,11]],shade);R(27,8,2,3,violet);R(27,8,1,1,light);
  for(const side of [-1,1]){L(28+side*19,17,28+side*25,11,'#dfb4eb',2);P([[28+side*17,44],[28+side*22,47],[28+side*19,53]],violet);}
  L(25,47,25,55,'#ba93ca');L(31,47,33,55,'#ba93ca');
 }
 return outline(r.pixels,INK);
}

function madara(m={}){
 const r=raster(),{rect:R,line:L,poly:P}=r,[white,shade,light,dark,violet,skin]=RIFT_SUPERBOSS_PALETTES.madararift;
 const arm=clampStep(m.arm),leg=clampStep(m.leg),sway=clampStep(m.tail),raised=!!m.attack;
 // The independent black Truth-Seeking Orbs make a broken halo behind him.
 const phase=m.enraged?1:0;
 for(let i=0;i<7;i++){
  const a=-Math.PI*.8+i*Math.PI*1.6/6,x=28+Math.sin(a)*22,y=30-Math.cos(a)*22;
  P([[x-3,y-2],[x-1,y-4],[x+2,y-3],[x+4,y],[x+2,y+3],[x-2,y+3],[x-4,y]],dark);
  R(x-1,y-2,2,1,phase?'#9a8399':'#626574');
 }
 // Long white hair has a stepped, fanned silhouette behind the coat.
 P([[17,19],[19,10],[26,5],[34,8],[39,16],[38,30],[43+sway,45],[37,43],[40,54],[33,49],[29,54],[22,50],[16,53],[18,42],[13+sway,45],[17,32]],shade);
 P([[19,20],[21,12],[27,8],[33,11],[36,18],[34,30],[39+sway,43],[34,40],[36,48],[29,44],[24,48],[19,47],[21,36],[16+sway,40]],white);
 for(let i=0;i<4;i++)L(20+i*4,17,20+i*4+sway,39,light);
 // Two sandal feet peek from the sweeping, magatama-trimmed robe.
 for(const [x,d]of [[22,-leg],[31,leg]]){R(x+d,61,5,9,skin);R(x+d-2,68,8,4,dark);R(x+d-1,68,6,2,shade);L(x+d+1,67,x+d+1,70,light);}
 P([[20,29],[34,29],[38,41],[36,51],[41+leg,64],[35,67],[28,64],[21,67],[15-leg,64],[19,50],[17,40]],shade);
 P([[22,30],[32,30],[35,42],[33,51],[37+leg,63],[32,64],[27,62],[22,64],[18-leg,62],[22,49],[20,40]],white);
 P([[23,30],[27,33],[31,30],[33,35],[29,39],[25,38]],dark);L(27,40,26,60,shade);
 L(21,48,19,61,light,2);L(32,47,35,61,light);L(20,63,25,61,shade);
 // Six comma jewels across the open chest plus three on the lower hem.
 for(const [x,y]of [[22,34],[25,36],[29,36],[32,34],[23,40],[31,40],[21,59],[28,60],[34,59]]){R(x,y,2,2,dark);R(x+1,y+2,1,2,dark);}
 L(24,45,23,54,'#c4c8b7');L(31,51,33,57,'#c4c8b7');
 L(19,32,14-arm,43,shade,5);L(14-arm,43,14-arm,52,white,4);R(12-arm,51,5,4,skin);L(13-arm,51,13-arm,53,light);
 const hy=raised?33:47;
 L(35,32,39+arm,38,shade,5);L(39+arm,38,43,hy,white,4);R(41,hy-1,5,4,skin);
 // A crescent-topped black shakujō is an actual staff, distinct from the orbs.
 L(47,raised?18:24,47,70,dark,2);L(49,raised?22:28,49,68,'#626471');
 const sy=raised?11:17;
 L(46,sy+13,42,sy+10,dark,3);L(42,sy+10,41,sy+4,dark,3);L(41,sy+4,44,sy,dark,3);
 L(46,sy+13,51,sy+10,dark,3);L(51,sy+10,52,sy+4,dark,3);L(52,sy+4,49,sy,dark,3);
 L(44,sy+11,48,sy+12,'#767786');
 // Mature face, Rinnegan eyes and white swept fringe under two curved horns.
 P([[20,15],[34,14],[36,21],[32,29],[26,30],[21,25]],'#b89d99');P([[22,16],[33,16],[34,22],[30,27],[26,28],[23,24]],skin);
 L(22,20,27,20,dark);L(29,20,34,19,dark);R(24,21,3,2,violet);R(30,20,3,2,violet);R(25,21,1,1,light);R(31,20,1,1,light);
 L(28,22,28,25,'#9c817f');L(26,27,30,27,'#9f7e7e');
 P([[18,17],[19,11],[25,7],[32,8],[37,13],[36,20],[32,18],[30,13],[27,18],[25,14],[22,19]],shade);
 P([[20,15],[21,11],[26,9],[32,10],[35,14],[34,17],[31,14],[29,12],[26,16],[24,12]],white);L(23,10,29,10,light);
 P([[21,12],[16,8],[16,2],[19,4],[21,8],[24,11]],shade);L(18,4,18,8,light,2);
 P([[32,10],[34,5],[38,2],[37,8],[35,13]],shade);L(35,6,37,4,light);
 if(m.enraged){R(27,15,3,3,'#b66b80');R(28,15,1,2,dark);L(23,12,23,17,'#d8b7c7');L(33,12,34,16,'#d8b7c7');
  P([[7,56],[10,51],[13,55],[11,60],[7,60]],dark);R(8,55,2,1,violet);
 }
 return outline(r.pixels,INK);
}

function heian(m={}){
 const r=raster(),{rect:R,line:L,poly:P}=r,[skin,shade,light,ink,ivory,rose]=RIFT_SUPERBOSS_PALETTES.sukunaheian;
 const step=clampStep(m.leg),arm=clampStep(m.arm),cast=!!m.attack;
 // Wide white hakama, bare sandals and a black knotted sash separate the huge
 // four-armed torso from the legs; the silhouette never becomes a pink blob.
 for(const [x,d]of [[20,-step],[32,step]]){
  R(x+d,61,6,9,shade);R(x+d+1,61,4,8,skin);
  P([[x-2+d,68],[x+6+d,68],[x+8+d,72],[x-3+d,72]],ink);R(x-1+d,69,7,2,skin);L(x+d,69,x+5+d,69,light);
 }
 P([[16,45],[38,45],[40,55],[37+step,65],[29+step,66],[27,56],[25-step,66],[15-step,65],[14,55]],'#9b949d');
 P([[18,47],[26,47],[25,56],[23-step,64],[17-step,63],[17,54]],ivory);
 P([[29,47],[36,47],[37,54],[35+step,63],[30+step,64],[29,56]],'#ddd8c9');
 L(19,52,18-step,61,'#fff0d8',2);L(34,52,34+step,61,'#fff0d8');L(26,52,26,61,'#aaa1ac');
 // The upper and lower arm pairs have independent elbows and hand positions.
 for(const side of [-1,1]){
  const sx=28+side*12,ex=28+side*(cast?22:20),ey=cast?25:36+arm*side,hx=28+side*(cast?23:21),hy=cast?18:44+arm*side;
  L(sx,27,ex,ey,shade,7);L(sx+1,28,ex+1,ey,skin,5);L(ex,ey,hx,hy,shade,6);L(ex+1,ey,hx+1,hy,skin,4);
  R(hx-1,hy-1,5,6,skin);L(hx,hy,hx,hy+3,light);L(ex,ey+2,ex+side*2,ey+5,ink,2);
  const lx=28+side*11,lex=28+side*18,ley=45+(cast?-2:arm*side),lhx=28+side*(cast?7:14),lhy=cast?38:54;
  L(lx,36,lex,ley,shade,7);L(lx+1,37,lex+1,ley,skin,4);L(lex,ley,lhx,lhy,shade,6);L(lex+1,ley,lhx+1,lhy,skin,4);
  R(lhx-2,lhy-2,5,5,skin);L(lex,ley,lex+side*2,ley+3,light);L(lhx-1,lhy,lhx+2,lhy,ink);
  // Thick ring tattoos remain visible on each of the four wrists.
  L(ex,ey-1,ex+side*3,ey+1,ink,2);L(lex-1,ley+1,lex+2,ley+3,ink,2);
 }
 // Broad pecs, separated abdominal planes and the second mouth on the belly.
 P([[18,24],[25,21],[31,21],[39,25],[41,35],[37,45],[30,49],[22,47],[16,41],[15,31]],shade);
 P([[20,25],[26,24],[28,29],[31,24],[36,26],[38,34],[34,43],[29,47],[23,44],[19,38],[18,31]],skin);
 P([[21,26],[25,25],[27,30],[24,33],[19,31]],light);P([[30,26],[34,26],[37,31],[32,33],[29,30]],'#e9bea0');
 L(28,28,28,39,shade,2);L(21,34,26,35,shade);L(30,35,35,34,shade);L(23,38,26,39,light);L(30,39,34,38,light);
 P([[23,40],[29,39],[34,40],[32,44],[26,44]],ink);L(25,41,32,41,ivory);R(27,43,4,1,rose);
 L(19,27,22,31,ink,2);L(36,27,33,31,ink,2);L(20,36,23,39,ink);L(34,36,32,39,ink);
 R(17,46,21,3,ink);P([[23,47],[30,47],[33,52],[28,51],[26,58],[23,56],[25,50]],ink);L(17,47,21,47,'#71657c');
 // A mature angular face, three visible eyes and Heian's protruding right
 // half-mask form the defining asymmetry, crowned with short rose spikes.
 P([[20,9],[26,6],[33,8],[37,13],[36,22],[31,28],[25,27],[20,22],[18,15]],shade);
 P([[22,11],[29,9],[33,12],[34,20],[30,25],[25,24],[22,20]],skin);
 P([[31,9],[36,11],[39,15],[38,22],[33,27],[30,24],[32,19],[30,15]],'#af7776');
 P([[33,11],[36,13],[37,17],[35,20],[33,18],[34,15]],'#e3b99d');L(35,20,36,23,shade);
 L(22,15,27,16,ink,2);L(29,16,33,15,ink,2);R(24,17,2,1,'#b8536b');R(30,17,2,1,'#b8536b');R(35,17,2,1,'#db846e');R(34,21,2,1,'#db846e');
 L(28,17,28,21,shade);L(25,23,30,23,ink);L(25,24,29,24,light);
 L(23,12,25,14,ink);L(29,11,28,14,ink);R(25,10,2,2,ink);L(21,19,24,21,ink);L(31,20,30,22,ink);
 P([[18,15],[17,10],[21,10],[20,6],[25,8],[27,3],[29,7],[33,4],[34,9],[38,8],[36,14],[32,11],[29,12],[25,9],[22,13]],'#8f6778');
 L(22,8,24,10,'#cf9a9c');L(28,6,29,10,rose);L(33,8,33,11,'#d9a39f');
 if(m.enraged){
  R(24,17,2,1,'#f5c186');R(30,17,2,1,'#f5c186');L(27,28,27,36,rose);L(29,28,30,35,rose);
  for(const side of [-1,1]){P([[28+side*24,48],[28+side*26,43],[28+side*27,49],[28+side*24,54]],'#c77d85');L(28+side*24,46,28+side*25,50,'#f6c59b');}
 }
 return outline(r.pixels,INK);
}

function boros(m={}){
 const r=raster(),{rect:R,line:L,poly:P}=r,[pink,shade,light,hair,cyan,dark]=RIFT_SUPERBOSS_PALETTES.borosrift;
 const step=clampStep(m.leg),arm=clampStep(m.arm),cast=!!m.attack,burst=!!m.enraged,body=burst?'#e4a6ca':pink;
 // A tall, thorned crest, flaring at the temples, is separate from the face.
 P([[16,22],[12,12],[18,16],[16,7],[23,11],[25,2],[29,9],[35,3],[34,13],[41,7],[37,18],[44,15],[39,27]],shade);
 P([[18,19],[16,13],[22,17],[20,10],[25,14],[26,6],[29,13],[33,8],[32,17],[37,13],[35,23]],hair);
 L(25,9,26,16,'#fff1e8');L(31,13,30,19,'#efc6df');
 // Powerful planted legs have segmented shin plates and clawed feet.
 for(const [x,d]of [[20,-step],[31,step]]){
  P([[x-3,48],[x+5,48],[x+5+d,60],[x+3+d,70],[x-2+d,69],[x-4+d,57]],shade);
  P([[x-1,50],[x+3,50],[x+3+d,59],[x+1+d,68],[x-1+d,67],[x-2+d,58]],body);
  P([[x-2+d,56],[x+4+d,55],[x+4+d,61],[x+2+d,65],[x-2+d,64]],burst?shade:dark);
  L(x-1+d,57,x+2+d,57,light);L(x+d,61,x+d,64,pink);
  P([[x-3+d,68],[x+4+d,68],[x+7+d,72],[x-5+d,72]],shade);R(x-3+d,69,7,2,body);L(x-3+d,71,x+4+d,71,'#e4adcc');
 }
 // Large shoulder and forearm plates are the remaining broken restraint armor.
 for(const side of [-1,1]){
  const ex=28+side*(cast?21:19+arm*.4),ey=cast?30:40,hx=28+side*(cast?24:20),hy=cast?24:52;
  L(28+side*10,28,ex,ey,shade,8);L(29+side*10,29,ex+1,ey,body,5);
  L(ex,ey,hx,hy,shade,7);L(ex+1,ey,hx+1,hy,body,4);R(hx-2,hy-1,6,6,body);
  if(!burst){P([[28+side*10,25],[28+side*16,23],[28+side*22,28],[28+side*20,32],[28+side*14,32]],dark);L(28+side*13,25,28+side*19,28,'#a596b2',2);}
  else L(28+side*12,27,28+side*18,30,'#f5d4e6',2);
  L(ex,ey+1,hx,hy+2,burst?shade:dark,2);
  L(hx-1,hy,hx+2,hy,light);L(ex+side,ey,ex+side*2,ey+4,cyan);
 }
 P([[18,26],[25,24],[32,24],[39,28],[38,39],[34,49],[29,53],[22,50],[17,39]],shade);
 P([[21,27],[27,26],[34,28],[36,34],[33,46],[28,50],[23,46],[20,36]],body);
 P([[20,27],[25,26],[27,31],[24,35],[20,33]],light);P([[29,27],[33,28],[36,32],[32,35],[29,32]],'#df9ac8');
 L(28,29,28,44,dark,2);L(22,36,26,37,shade);L(30,37,34,36,shade);L(24,40,27,41,light);L(30,41,33,40,light);L(24,45,27,46,shade);L(30,46,33,44,shade);
 // The central chest cavity visibly charges separately from his cyclopean eye.
 P([[25,32],[29,30],[32,33],[31,38],[27,40],[24,36]],dark);P([[27,32],[30,33],[30,37],[27,38],[25,35]],cast?'#e6ebd6':cyan);R(27,33,2,3,'#f4f3df');
 P([[21,46],[27,48],[33,46],[35,51],[30,55],[24,54],[20,50]],dark);L(22,48,26,50,'#9a729c');L(30,50,33,48,light);
 // Angular single eye has a mint iris, slit pupil and heavy alien brow ridge.
 P([[19,13],[25,10],[33,11],[38,17],[36,24],[31,29],[24,28],[19,23]],shade);
 P([[22,14],[28,12],[33,14],[35,19],[33,25],[28,27],[23,24],[21,19]],body);
 P([[21,17],[27,14],[33,16],[35,19],[31,23],[25,23],[21,20]],dark);
 P([[23,18],[27,16],[31,17],[33,19],[30,21],[25,21]],'#e9e5d6');
 R(27,17,3,5,cyan);R(28,17,1,5,dark);R(27,18,1,1,'#fff6dc');L(22,15,25,13,light);L(32,14,35,17,light);
 L(25,25,31,25,dark);L(27,26,30,26,light);L(20,21,22,25,dark);L(34,23,32,26,dark);
 // White energy seams expose the Meteoric Burst form without changing identity.
 if(burst){
  for(const side of [-1,1]){L(28+side*5,28,28+side*7,34,'#fff0e4',2);L(28+side*7,36,28+side*5,43,'#f7d5e8');L(28+side*15,34,28+side*18,42,'#f8e2eb');}
  L(27,42,27,48,'#fff0e4');L(20-step,52,18-step,60,'#fff0e4');L(33+step,52,35+step,61,'#fff0e4');
  for(const [x,y]of [[5,35],[49,40],[9,61],[46,59]]){L(x,y,x+2,y-5,'#e5b6dc');L(x+2,y-5,x+4,y-2,'#fff3e1');}
 }
 return outline(r.pixels,INK);
}

export function riftSuperbossPixels(id,m={}){
 return id==='deathdevil'?primalDevilPixels(id,m):id==='foundereren'?founder(m):id==='beerus'?beerus(m):id==='walpurgisrift'?walpurgis(m):id==='aizenrift'?aizen(m):id==='madararift'?madara(m):id==='sukunaheian'?heian(m):id==='borosrift'?boros(m):id==='mimic'?mimic(m):null;
}

// World-space tells enhance the native sprite. Damage remains solely in warned
// engine hazards; these lines never invent additional hitboxes or cover gaps.
export function drawRiftBossAura(c,e,time=0,reducedMotion=false){
 if(!['foundereren','beerus','walpurgisrift','aizenrift','madararift','sukunaheian','borosrift','darknessdevil','deathdevil'].includes(e.archetype)||e.hp<=0)return false;
 const quiet=reducedMotion,t=quiet?0:(e.animTime??time),color=e.color||'#d7b5de',radius=e.r||40;
 c.save();c.globalAlpha=.22;c.strokeStyle=color;c.lineWidth=1;
 if(e.archetype==='foundereren'){
  for(const side of [-1,1])for(let i=0;i<3;i++){
   const x=e.x+side*(radius*.6+i*12),y=e.y-radius*(1.1+i*.3),dy=quiet?0:Math.sin(t*1.5+i)*8;
   c.beginPath();c.moveTo(x,y+30);c.lineTo(x+side*9,y+8+dy);c.lineTo(x+side*3,y-15+dy);c.stroke();
  }
 }else if(e.archetype==='beerus'){
  c.beginPath();c.ellipse(e.x,e.y-radius*1.2,radius*(1.05+(quiet?0:Math.sin(t*2)*.05)),radius*1.8,0,0,TAU);c.stroke();
  for(let i=0;i<5;i++){const a=i*TAU/5+(quiet?0:t*.5),x=e.x+Math.cos(a)*radius*1.15,y=e.y-radius*1.2+Math.sin(a)*radius*1.6;c.fillStyle=color;c.fillRect(Math.round(x),Math.round(y),2,3);}
 }else if(e.archetype==='aizenrift'){
  // Shattered illusion planes drift behind the wings, well below warning opacity.
  for(let i=0;i<5;i++){const a=i*TAU/5+(quiet?0:t*.12),x=e.x+Math.cos(a)*radius*1.3,y=e.y-radius*1.6+Math.sin(a)*radius*1.6;c.beginPath();c.moveTo(x-7,y-14);c.lineTo(x+8,y-6);c.lineTo(x+4,y+13);c.lineTo(x-7,y-14);c.stroke();}
 }else if(e.archetype==='madararift'){
  for(let i=0;i<7;i++){const a=i*TAU/7+(quiet?0:t*.18),x=e.x+Math.cos(a)*radius*1.4,y=e.y-radius*1.4+Math.sin(a)*radius*1.25;c.fillStyle='#383341';c.beginPath();c.arc(x,y,4,0,TAU);c.fill();c.strokeStyle='#99879f';c.stroke();}
 }else if(e.archetype==='sukunaheian'){
  // Broken crimson slash fragments imply pressure while keeping dodge marks
  // unobscured. They never form an additional attack or closed boundary.
  for(let i=0;i<6;i++){const a=i*TAU/6+(quiet?0:t*.14),x=e.x+Math.cos(a)*radius*1.3,y=e.y-radius*1.4+Math.sin(a)*radius*1.6;c.beginPath();c.moveTo(x-6,y-10);c.lineTo(x+5,y+7);c.lineTo(x+8,y+5);c.stroke();}
 }else if(e.archetype==='darknessdevil'){
  // A ritual sword hangs over the praying procession, detached from its body.
  const x=e.x,y=e.y-radius*3.95+(quiet?0:Math.sin(t*.7)*2);
  c.globalAlpha=.48;c.lineWidth=2;c.strokeStyle='#c9cfc0';c.beginPath();c.moveTo(x,y-16);c.lineTo(x,y+17);c.moveTo(x-15,y-8);c.lineTo(x+15,y-8);c.moveTo(x-8,y-12);c.lineTo(x-15,y-8);c.lineTo(x-10,y-4);c.moveTo(x+8,y-12);c.lineTo(x+15,y-8);c.lineTo(x+10,y-4);c.stroke();
  c.lineWidth=1;for(const side of [-1,1]){c.beginPath();c.moveTo(x+side*12,y-6);c.lineTo(x+side*12,y+9);c.stroke();c.fillStyle='#c9cfc0';c.fillRect(x+side*12-2,y+9,4,4);}
 }else if(e.archetype==='deathdevil'){
  // Slender white curtain folds stay close to the body and never imply a hitbox.
  c.globalAlpha=.18;c.strokeStyle='#dddccc';
  for(const side of [-1,1]){const x=e.x+side*radius*.7,y=e.y-radius*1.2,sway=quiet?0:Math.sin(t*.45)*3;c.beginPath();c.moveTo(x,y-radius*1.5);c.lineTo(x+side*8+sway,y);c.lineTo(x+side*16+sway,e.y-6);c.stroke();}
 }else if(e.archetype==='borosrift'){
  for(const side of [-1,1]){const x=e.x+side*radius*(1.1+(quiet?0:Math.sin(t*2)*.06));c.beginPath();c.moveTo(x,e.y-5);c.lineTo(x+side*5,e.y-radius*.8);c.lineTo(x-side*3,e.y-radius*1.45);c.lineTo(x+side*2,e.y-radius*2.1);c.stroke();}
  c.beginPath();c.ellipse(e.x,e.y-radius*.8,radius*1.2,radius*.35,0,0,TAU);c.stroke();
 }else{
  const x=e.x,y=e.y-radius*2.6,angle=quiet?0:t*.22;
  c.beginPath();c.ellipse(x,y,radius*1.05,radius*.38,0,0,TAU);c.stroke();
  for(let i=0;i<12;i++){const a=i*TAU/12+angle;c.beginPath();c.moveTo(x+Math.cos(a)*radius*.85,y+Math.sin(a)*radius*.32);c.lineTo(x+Math.cos(a)*radius*1.12,y+Math.sin(a)*radius*.42);c.stroke();}
 }
 if(e.riftAttack&&e.riftAttack.age<e.riftAttack.duration){
  const attack=e.riftAttack,p=Math.max(0,Math.min(1,attack.age/Math.max(.01,attack.duration))),cx=e.x,cy=e.y-radius*1.75;
  c.globalAlpha=.35;c.strokeStyle=attack.color||color;c.lineWidth=2;c.beginPath();c.arc(cx,cy,radius*(.25+p*.25),0,TAU);c.stroke();
  if(!quiet){c.globalAlpha=.3;for(let i=0;i<5;i++){const a=i*TAU/5-p*2;c.beginPath();c.moveTo(cx+Math.cos(a)*radius*.7,cy+Math.sin(a)*radius*.7);c.lineTo(cx+Math.cos(a+.2)*radius*.45,cy+Math.sin(a+.2)*radius*.45);c.stroke();}}
 }
 c.restore();return true;
}
