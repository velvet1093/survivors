import {denjiPixels} from './denji-art.js';
import {shiraoriPixels} from './shiraori-art.js';
import {megumiPixels} from './megumi-art.js';
import {erenPixels} from './eren-art.js';
import {maomaoPixels} from './maomao-art.js';
import {gojoPixels} from './gojo-art.js';
import {madokaPixels} from './madoka-art.js';
import {evaPixels,EVA_UNITS} from './eva-art.js';
import {pilotSuitPixels} from './eva-pilot-art.js';
import {beachOutfitPixels} from './beach-outfit-art.js';
import {cuteSwimPixels} from './cute-swim-art.js';
import {pilotSwimPixels,paintPilotEvaSwim} from './pilot-swim-art.js';
import {swimsuitPixels} from './swimsuit-art.js';
import {pajamaPixels} from './pajama-art.js';
import {erzaPixels} from './erza-art.js';
import {casualPixels} from './casual-art.js';
import {featherinePixels} from './featherine-art.js';
import {esdeathPixels} from './esdeath-art.js';
import {referenceOutfitPixels} from './character-reference-skins.js';
import {kurumiPixels} from './kurumi-art.js';
import {variaSuitPixels} from './samus-art.js';
import {gokuPixels} from './goku-art.js';
import {rimuruPixels} from './rimuru-art.js';
import {diavoloPixels} from './diavolo-art.js';
import {yukiPixels} from './yuki-art.js';
import {gutsPixels} from './guts-art.js';
import {redrawEren,redrawFrieren} from './hero-redesign.js';
import {skinFor,tintPixels} from './skins.js';
import {paintFace} from './expressions.js';
// Original pixel art. The same native-resolution frames drive the roster and combat.
export const SPRITE_WIDTH=56;
export const SPRITE_HEIGHT=76;
export const HERO_SCALE=.78;
export const HERO_FOOT={x:28,y:71};
export const CHARACTER_PALETTES={
 esdeath:{hair:'#9bcde8',hairDark:'#567ea7',hairLight:'#d1eef8',coat:'#e6edf0',shade:'#b5c6d6',light:'#ffffff',ink:'#283e5a'},
  shinji:{hair:'#292f42',hairDark:'#191e30',hairLight:'#4e586d',coat:'#8c6bba',shade:'#51466d',light:'#beabd9',ink:'#202a3d'},
  goku:{hair:'#182331',hairDark:'#101520',hairLight:'#354459',coat:'#f1a14e',shade:'#ba6135',light:'#ffd084',ink:'#192039'},
  gojo:{hair:'#f4f4ff',hairDark:'#a4a9cb',hairLight:'#ffffff',coat:'#272739',shade:'#18192b',light:'#4d4d6a',ink:'#16172b'},
  naruto:{hair:'#f7d268',hairDark:'#c8903b',hairLight:'#fff2ad',coat:'#ee9848',shade:'#b76837',light:'#ffca74',ink:'#25283e'},
  maomao:{hair:'#24473f',hairDark:'#142c2f',hairLight:'#4f7462',coat:'#79b999',shade:'#3f7c6d',light:'#b5deae',ink:'#25383c'},
  madoka:{hair:'#efa4c1',hairDark:'#ae648f',hairLight:'#ffe0e9',coat:'#eea4c0',shade:'#bd668f',light:'#ffdfed',ink:'#503548'},
};
export function raster(){
  const pixels=Array(SPRITE_WIDTH*SPRITE_HEIGHT).fill(null);
  const put=(x,y,color)=>{x=Math.round(x);y=Math.round(y);if(x>=0&&x<SPRITE_WIDTH&&y>=0&&y<SPRITE_HEIGHT)pixels[y*SPRITE_WIDTH+x]=color;};
  const rect=(x,y,w,h,color)=>{for(let yy=Math.round(y);yy<Math.round(y+h);yy++)for(let xx=Math.round(x);xx<Math.round(x+w);xx++)put(xx,yy,color);};
  const poly=(points,color)=>{
    const minX=Math.max(0,Math.floor(Math.min(...points.map(p=>p[0])))),maxX=Math.min(SPRITE_WIDTH-1,Math.ceil(Math.max(...points.map(p=>p[0]))));
    const minY=Math.max(0,Math.floor(Math.min(...points.map(p=>p[1])))),maxY=Math.min(SPRITE_HEIGHT-1,Math.ceil(Math.max(...points.map(p=>p[1]))));
    for(let y=minY;y<=maxY;y++)for(let x=minX;x<=maxX;x++){let inside=false;for(let i=0,j=points.length-1;i<points.length;j=i++){const a=points[i],b=points[j];if(((a[1]>y+.5)!==(b[1]>y+.5))&&x+.5<(b[0]-a[0])*(y+.5-a[1])/(b[1]-a[1])+a[0])inside=!inside;}if(inside)put(x,y,color);}
  };
  const line=(x0,y0,x1,y1,color,width=1)=>{const steps=Math.max(Math.abs(x1-x0),Math.abs(y1-y0),1);for(let i=0;i<=steps;i++)rect(Math.round(x0+(x1-x0)*i/steps),Math.round(y0+(y1-y0)*i/steps),width,width,color);};
  return {pixels,put,rect,poly,line};
}
export function outline(pixels,ink){const result=[...pixels];for(let y=0;y<SPRITE_HEIGHT;y++)for(let x=0;x<SPRITE_WIDTH;x++)if(pixels[y*SPRITE_WIDTH+x])for(const [dx,dy] of [[-1,0],[1,0],[0,-1],[0,1]]){const xx=x+dx,yy=y+dy;if(xx>=0&&xx<SPRITE_WIDTH&&yy>=0&&yy<SPRITE_HEIGHT&&!pixels[yy*SPRITE_WIDTH+xx])result[yy*SPRITE_WIDTH+xx]=ink;}return result;}
export function pilotPixels({expression='neutral',blink=false,skin='default',frame=0,moving=false,attack=false,pose=''}={}){
 const swimming=pilotSwimPixels({skin,expression,blink,frame,moving,attack,pose});if(swimming)return swimming;
 if(skin==='swimsuit')return swimsuitPixels('shinji',{expression,blink});
 if(skin==='casual')return casualPixels('shinji',{expression,blink});
 if(skin==='pajamas')return pajamaPixels('shinji',{expression,blink});
 if(EVA_UNITS[skinFor('shinji',skin).id])return pilotSuitPixels(skinFor('shinji',skin).id,{expression,blink});
 const r=raster(),{rect,poly,line}=r,look=skinFor('shinji',skin),id=look.id,ink='#253042',suit=look.suit,shade={default:'#9eafb7',asuka:'#8f3c49',rei:'#a4bbc4',mari:'#914f7e'}[id],light={default:'#f8f5e6',asuka:'#f08c6e',rei:'#fff7e9',mari:'#eeb2c7'}[id],hair=look.hair,hairDark={default:'#18232f',asuka:'#78463d',rei:'#648fa9',mari:'#443445'}[id],hairLight={default:'#526171',asuka:'#e3a25e',rei:'#d1e3e5',mari:'#aa7b6b'}[id],skinTone='#ffe2c6';
 // Each pilot has a different hair silhouette, not just a palette swap.
 if(id==='asuka'){for(const side of [-1,1]){const x=side<0?15:39;poly([[x-3,18],[x+2,19],[x+5,41],[x+2,49],[x-2,46],[x-3,34]],hairDark);poly([[x-2,21],[x+1,23],[x+3,40],[x+1,45],[x-1,37]],hair);line(x,25,x+1,41,hairLight);}}
 if(id==='mari'){for(const x of [16,39]){line(x,24,x-1,49,hairDark,4);for(const yy of [31,36,41,46]){rect(x-2,yy,3,3,hair);rect(x,yy+1,2,2,hairLight);}rect(x-2,49,4,2,'#ba6c82');poly([[x-1,50],[x+2,50],[x+2,55],[x-2,54]],hair);}}
 if(id==='rei')poly([[15,17],[39,17],[41,30],[37,37],[36,28],[19,29],[18,37],[14,30]],hairDark);
 // Fitted plugsuits: dark articulated side panels, hip breaks, knee pads and boots.
 for(const [x,d] of [[21,-1],[30,1]]){poly([[x,53],[x+5,53],[x+6,66],[x+5,69],[x-1,69]],shade);rect(x,54,4,11,suit);rect(x,58,4,3,ink);rect(x+1,59,2,1,light);rect(x+1,62,2,4,light);rect(x-1,68,7,3,ink);rect(x,68,5,1,suit);}
 poly([[20,39],[25,37],[31,37],[36,39],[38,46],[35,52],[36,56],[31,58],[27,55],[24,58],[19,55],[21,50],[18,44]],ink);
 poly([[21,39],[25,38],[31,38],[35,39],[36,44],[32,48],[34,53],[30,55],[27,53],[24,55],[21,53],[23,47],[20,44]],suit);
 poly([[22,40],[27,43],[34,40],[32,45],[28,47],[24,45]],shade);line(22,40,27,43,light);line(27,43,34,40,light);
 rect(26,45,5,8,id==='asuka'?'#cf9a54':id==='mari'?'#8ea75f':'#537e9b');rect(27,46,3,2,'#dde3ca');rect(27,50,3,1,ink);rect(24,54,9,2,shade);rect(27,53,3,2,'#d1b574');
 const chest={default:'01',asuka:'02',rei:'00',mari:'08'}[id];
 // Native-resolution unit markings are clusters rather than small browser text.
 rect(24,42,2,2,ink);if(chest==='01')rect(31,42,1,2,ink);else{rect(30,42,3,1,ink);rect(chest==='02'?32:30,43,1,1,ink);}
 for(const side of [-1,1]){const x=side<0?17:36;line(x+2,41,x+(side<0?-1:5),52,shade,4);line(x+2,41,x+(side<0?-1:5),49,suit,3);rect(x,40,4,3,light);rect(x+(side<0?-1:4),50,4,3,ink);rect(x+(side<0?-1:4),53,4,3,shade);rect(x+(side<0?0:4),53,2,2,light);}
 rect(25,36,7,3,skinTone);rect(24,38,9,2,ink);rect(27,39,3,1,light);
 poly([[18,21],[37,21],[38,31],[34,37],[28,39],[21,36],[17,29]],skinTone);
 paintFace(r,'shinji',{expression,blink});if(!blink&&expression!=='hurt'){const iris={default:'#50768c',asuka:'#4782ac',rei:'#bd667a',mari:'#639d8b'}[id];for(const x of [22,32]){rect(x,29,2,4,iris);rect(x,29,1,1,'#fff9ed');}}
 if(id==='default'){
  poly([[16,30],[14,23],[17,15],[25,11],[34,13],[41,20],[39,31],[35,23],[31,27],[28,22],[24,27],[21,24],[18,32]],hairDark);poly([[17,24],[19,17],[26,14],[34,16],[38,21],[35,25],[31,21],[28,24],[24,21],[21,25]],hair);line(22,16,30,15,hairLight);
 }else if(id==='asuka'){
  poly([[16,31],[14,23],[17,15],[24,10],[34,11],[40,17],[41,29],[37,33],[35,22],[31,26],[28,20],[23,25],[20,23],[19,33]],hairDark);poly([[17,23],[19,17],[25,12],[33,13],[38,19],[38,26],[34,20],[31,23],[28,17],[24,22],[21,20]],hair);line(22,15,31,14,hairLight);rect(15,17,5,4,'#a74049');rect(37,17,5,4,'#a74049');rect(16,17,3,1,'#ee856e');rect(38,17,3,1,'#ee856e');
 }else if(id==='rei'){
  poly([[15,30],[14,21],[18,14],[26,10],[34,12],[40,18],[41,29],[37,35],[37,23],[33,24],[31,20],[27,26],[24,22],[20,28],[18,36]],hairDark);poly([[16,24],[17,18],[22,14],[29,12],[36,16],[39,22],[37,27],[34,21],[31,17],[27,23],[24,18],[21,24],[18,28]],hair);line(22,14,30,13,hairLight);line(18,20,17,29,hairLight);
 }else{
  poly([[16,31],[14,22],[18,14],[25,10],[34,12],[40,18],[41,30],[37,34],[35,23],[31,25],[28,20],[24,25],[20,23],[19,33]],hairDark);poly([[17,23],[19,17],[25,13],[33,15],[38,20],[38,27],[34,20],[31,23],[28,17],[24,22],[21,20]],hair);line(22,15,30,14,hairLight);rect(16,17,4,2,'#e8dbcf');rect(37,17,4,2,'#e8dbcf');
  for(const x of [20,30]){line(x,28,x+5,28,'#a65070');line(x,33,x+5,33,'#a65070');line(x,28,x,33,'#a65070');line(x+5,28,x+5,33,'#a65070');}line(25,30,30,30,'#a65070');rect(21,29,1,1,'#fff4de');rect(31,29,1,1,'#fff4de');
 }
 return outline(r.pixels,ink);
}
function evaFrame({frame=0,moving=false,pose='',attack=false,expression='neutral',blink=false,skin:look=skinFor('shinji'),evolved=''}){
 // The four canonical units have their own art; themed outfit units keep these overlays.
 if(EVA_UNITS[look.id])return evaPixels({unit:look.id,frame,moving,pose,attack,expression,blink,evolved});
 const r=raster(),{rect,poly,line}=r,p={...CHARACTER_PALETTES.shinji,coat:look.armor,shade:look.shade,light:look.light},step=moving?[0,2,0,-2][frame]:0,bob=moving?frame%2:0,berserk=pose==='berserk',unitId=look.evaBase||look.id;
 // Long articulated legs, neon knee plates and pointed armor boots.
 for(const [x,s] of [[20,-step],[31,step]]){rect(x+s,51,6,15,p.shade);rect(x+s,52,5,7,p.coat);rect(x+s,56,5,2,'#b4d976');rect(x+s,60,4,6,'#253442');poly([[x+s,65],[x+s+5,65],[x+s+7,69],[x+s-2,70]],p.coat);rect(x+s,68,6,2,'#42666b');}
 // Shoulder pylons and limbs form the Unit-01 silhouette.
 for(const side of [-1,1]){const x=side<0?12:38;poly([[x,39],[x-1,28-bob],[x+4,25-bob],[x+7,39]],p.shade);rect(x+1,28-bob,3,10,p.coat);rect(x+1,27-bob,3,3,'#addc70');line(x+3,41,x+(side<0?0:7),52-step*side,p.shade,4);line(x+3,41,x+(side<0?0:7),49-step*side,p.coat,3);rect(x+(side<0?-1:6),50-step*side,4,4,'#273b43');}
 poly([[20,34-bob],[34,34-bob],[38,42],[34,52],[29,56],[21,51],[18,42]],p.shade);poly([[21,35-bob],[33,35-bob],[35,41],[31,49],[25,49],[20,41]],p.coat);poly([[21,36-bob],[27,41],[23,45],[19,41]],'#a8d96c');poly([[34,36-bob],[29,41],[33,45],[37,41]],'#a8d96c');rect(26,37-bob,5,3,'#eab37d');rect(26,44,5,7,'#20333d');rect(27,45,3,1,'#b8d979');rect(27,48,3,1,'#b8d979');rect(24,51,9,2,'#80b574');
 // Helmet, cheek blades and a single forward horn.
 poly([[19,18-bob],[25,12-bob],[34,15-bob],[39,23-bob],[36,33-bob],[29,37-bob],[21,33-bob],[17,26-bob]],p.shade);poly([[21,18-bob],[27,14-bob],[33,18-bob],[36,25-bob],[32,31-bob],[24,30-bob],[20,24-bob]],p.coat);if(unitId==='default'){poly([[24,17-bob],[29,3-bob],[31,6-bob],[29,20-bob]],look.neon);rect(28,10-bob,2,5,'#d6ec9c');}
 poly([[19,27-bob],[23,31-bob],[25,35-bob],[20,32-bob]],'#a4ce77');poly([[36,27-bob],[32,31-bob],[31,35-bob],[36,32-bob]],'#a4ce77');
 line(22,25-bob,26,26-bob,expression==='hurt'?'#f4ad8e':'#eff2cf',2);line(30,26-bob,34,24-bob,expression==='hurt'?'#f4ad8e':'#eff2cf',2);rect(27,27-bob,3,3,'#1e2b3c');
 rect(25,32-bob,7,berserk?4:2,'#172635');if(berserk){rect(26,32-bob,5,1,'#e8e4c6');rect(27,35-bob,4,1,'#e8e4c6');}
 // Slim rib armor, segmented forearms, stronger shoulder pylons and a shaped jaw.
 rect(25,43,7,8,'#1d2c3c');for(const yy of [44,47,50]){rect(26,yy,5,1,look.neon);}rect(18,39,3,4,look.neon);rect(36,39,3,4,look.neon);rect(13,29-bob,2,11,p.light);rect(40,29-bob,2,11,p.light);
 poly([[20,22-bob],[24,18-bob],[32,18-bob],[37,23-bob],[34,29-bob],[31,32-bob],[29,36-bob],[25,33-bob],[22,28-bob]],p.coat);
 poly([[22,28-bob],[25,31-bob],[31,31-bob],[34,28-bob],[31,35-bob],[27,37-bob],[23,33-bob]],p.shade);rect(26,29-bob,5,2,'#e1d6c3');rect(25,32-bob,7,berserk?4:2,'#162638');
 if(berserk){rect(26,32-bob,5,1,'#f3e8cf');rect(27,35-bob,4,1,'#f3e8cf');}
 if(unitId==='rei'){rect(24,19-bob,8,6,'#d1b288');rect(26,21-bob,4,3,'#efcc83');rect(27,21-bob,2,2,'#c66471');poly([[26,10-bob],[31,12-bob],[32,20-bob],[25,20-bob]],p.coat);}
 else if(unitId==='asuka'||unitId==='mari'){for(const x of [22,30])for(const yy of [22,26])rect(x,yy-bob,5,2,unitId==='asuka'?'#d9f0b1':'#bdebad');}
 else{line(21,24-bob,26,26-bob,'#ecedca',2);line(30,26-bob,35,23-bob,'#ecedca',2);poly([[24,19-bob],[28,2-bob],[31,5-bob],[29,21-bob]],look.neon);rect(27,10-bob,1,7,'#e1edb6');}
 // Shinji's everyday outfits extend to the EVA: articulated armor retains the
 // tall pylons, horn, rib cage and boots, with clothing-inspired plate shapes.
 if(look.id==='casual'){
  const navy='#334860',navyLight='#657e92',white='#f4f0df',silver='#a8bec7',teal='#7cb9bd';
  // A short school-shirt breastplate over navy waist plates and a loose tie.
  poly([[20,35-bob],[25,35-bob],[28,39],[32,35-bob],[35,36-bob],[36,42],[32,48],[24,48],[20,43]],white);
  poly([[20,35-bob],[26,37],[25,42],[21,40]],silver);poly([[34,35-bob],[29,37],[30,42],[35,40]],silver);
  line(21,35-bob,25,40,white);line(34,35-bob,30,40,white);
  poly([[27,38],[30,38],[29,41],[31,46],[28,49],[26,46],[28,41]],navy);line(28,41,28,46,navyLight);
  rect(22,42,3,1,teal);rect(22,44,3,2,silver);rect(24,49,10,3,navy);rect(28,49,3,2,silver);
  for(const [x,s]of [[20,-step],[31,step]]){rect(x+s,53,6,8,navy);rect(x+s,55,1,5,navyLight);rect(x+s,60,5,2,silver);rect(x+s,63,4,3,navy);poly([[x+s,65],[x+s+5,65],[x+s+8,69],[x+s-2,70]],'#293b50');rect(x+s-1,69,8,1,silver);rect(x+s+1,67,3,1,white);}
  // Headphones and a silver fin keep the mechanical head readable at HUD size.
  line(20,17-bob,26,13-bob,navy,2);line(26,13-bob,34,17-bob,navy,2);
  for(const x of [17,36]){rect(x,21-bob,4,8,navy);rect(x+1,22-bob,2,5,teal);rect(x+1,22-bob,1,2,white);}
  poly([[25,18-bob],[28,2-bob],[30,5-bob],[29,20-bob]],silver);line(28,5-bob,27,15-bob,white);
  for(const x of [13,40]){rect(x,28-bob,3,10,navy);rect(x,29-bob,1,7,navyLight);rect(x,31-bob,3,2,teal);}
  // An audio-player clip on the hip echoes Shinji's after-school outfit.
  rect(34,48,4,7,navy);rect(35,49,2,2,silver);rect(35,53,2,1,teal);line(37,48,38,42,navyLight);
 }
 if(look.id==='pajamas'){
  const white='#edf1dc',cream='#c9d8cf',blue='#799eb9',orange='#e2ae65';
  // Rounded hood plates and split, white penguin cheek panels frame the visor.
  poly([[19,20-bob],[20,14-bob],[25,10-bob],[32,11-bob],[37,16-bob],[39,24-bob],[37,30-bob],[34,25-bob],[33,19-bob],[24,18-bob],[22,26-bob],[19,30-bob]],p.shade);
  line(21,16-bob,25,13-bob,blue,2);line(25,13-bob,32,14-bob,p.light);
  poly([[20,21-bob],[24,20-bob],[25,24-bob],[24,28-bob],[22,30-bob],[20,27-bob]],white);
  poly([[33,20-bob],[37,22-bob],[36,28-bob],[33,30-bob],[31,27-bob],[32,24-bob]],white);
  poly([[26,27-bob],[31,27-bob],[29,30-bob],[27,30-bob]],orange);rect(27,27-bob,3,1,'#f6d795');
  // The original horn emerges through the hood; a moon charm hangs from it.
  poly([[25,17-bob],[28,3-bob],[30,6-bob],[29,19-bob]],blue);line(28,7-bob,27,14-bob,p.light);
  poly([[22,36-bob],[26,38],[30,38],[34,36-bob],[35,41],[33,48],[28,52],[23,48],[21,41]],cream);
  poly([[24,37-bob],[28,39],[32,37-bob],[33,42],[31,47],[28,49],[25,47],[23,42]],white);
  rect(27,41,3,2,orange);rect(28,44,2,2,orange);rect(26,49,5,2,blue);
  for(const x of [13,40]){rect(x,28-bob,3,10,blue);rect(x,29-bob,1,6,p.light);rect(x,32-bob,3,1,white);}
  // Tiny star panels, striped cuffs, and broad penguin slippers add real geometry.
  for(const [x,s]of [[20,-step],[31,step]]){rect(x+s,53,6,8,p.coat);rect(x+s+2,54,1,5,white);rect(x+s+1,56,3,1,white);rect(x+s,61,5,2,blue);rect(x+s,64,5,2,white);poly([[x+s-2,66],[x+s+6,66],[x+s+9,69],[x+s+8,71],[x+s-3,71],[x+s-3,69]],p.shade);rect(x+s-1,67,6,2,white);rect(x+s+1,68,2,2,orange);rect(x+s-1,67,1,1,'#293e5b');rect(x+s+4,67,1,1,'#293e5b');}
  for(const x of [17,37]){rect(x,37,3,3,blue);rect(x+1,36,1,5,white);rect(x-1,38,5,1,white);}
 }
 if(look.id==='swimsuit'){
  const cream='#edf4e3',aqua='#76c0c8',deep='#264b69',gold='#f1c878';
  // A mechanical swim-team suit: sealed mask, snorkel and fin-shaped boots.
  poly([[21,20-bob],[35,20-bob],[38,24-bob],[35,29-bob],[22,29-bob],[19,25-bob]],deep);
  rect(22,22-bob,6,4,aqua);rect(30,22-bob,5,4,aqua);line(23,22-bob,26,22-bob,cream);line(31,22-bob,34,22-bob,cream);
  line(38,26-bob,40,27-bob,cream,2);line(40,27-bob,40,15-bob,gold,2);line(40,15-bob,44,15-bob,gold,2);rect(43,14-bob,3,3,deep);
  poly([[22,35-bob],[27,39],[32,35-bob],[35,39],[33,46],[28,49],[23,46],[20,39]],cream);
  poly([[24,37-bob],[28,40],[32,37-bob],[32,42],[28,46],[24,42]],p.coat);rect(26,40,5,2,gold);rect(28,42,2,3,gold);
  for(const x of [13,40]){rect(x,29-bob,3,9,aqua);rect(x,30-bob,1,6,cream);rect(x,35-bob,3,2,gold);}
  rect(21,50,15,4,deep);line(22,50,34,50,gold);line(24,54,24,59,cream);line(33,54,33,59,cream);
  for(const [x,v]of [[20,-step],[31,step]]){rect(x+v,54,5,7,deep);line(x+v,58,x+v+4,58,aqua);poly([[x+v-2,65],[x+v+5,65],[x+v+10,70],[x+v+9,72],[x+v-3,72]],aqua);line(x+v,67,x+v+6,70,cream);line(x+v+2,67,x+v+8,70,cream);}
  poly([[25,17-bob],[28,2-bob],[30,5-bob],[29,19-bob]],gold);line(28,5-bob,27,13-bob,cream);
 }
 paintPilotEvaSwim(r,look,{frame,moving,pose,attack,bob,step});
 // Mechanical expressions dim the optic slits instead of painting a human face.
 if(blink||expression==='focused'||expression==='hurt'){
  const color=expression==='hurt'?'#f29e86':expression==='focused'?'#d9f5c6':'#617984';
  for(const [x,y]of [[22,25-bob],[31,24-bob]]){rect(x,y,4,3,p.shade);line(x,y+1,x+3,y+(blink?1:0),color);}
 }
 if(pose==='ultimate'){rect(26,37-bob,5,3,'#f6edbb');rect(27,38-bob,3,1,'#fffceb');line(18,40,21,42,look.neon,2);line(35,41,38,39,look.neon,2);}
 if(berserk){const swing=[0,3,1,-2][frame],jaw=[1,2,4,2][frame];rect(25,32-bob,7,jaw+2,'#182635');rect(26,32-bob,5,1,'#f6eed9');rect(26,33-bob+jaw,5,1,'#f6eed9');for(const side of [-1,1]){const hx=side<0?11-swing:43+swing,hy=side<0?42+swing:46-swing;line(side<0?17:39,39,hx,hy,p.shade,5);line(side<0?17:39,39,hx,hy-1,p.coat,3);rect(hx-2,hy,6,5,'#253b42');for(let i=0;i<3;i++)line(hx-2+i*2,hy+3,hx-3+i*2,hy+8,'#e3edc4',1);}rect(27,45,3,1,frame%2?'#e8f7bb':look.neon);}
 if(evolved==='longinus'&&!berserk){line(43,68,46,28,'#8c3454',3);line(44,67,47,29,'#e67e95');line(46,28,42,16,'#b4466a',3);line(42,16,44,7,'#db6e8a',2);line(47,28,52,17,'#b4466a',3);line(52,17,53,6,'#e78299',2);rect(42,47,4,4,'#293c46');}
 else if(!berserk){const raised=attack?3:0;rect(38,46-raised,12,4,'#273642');rect(44,43-raised,4,4,'#72858b');rect(48,46-raised,5,2,'#a7b3af');rect(40,47-raised,7,1,'#9cacac');rect(41,50-raised,3,5,'#46535f');}
 return outline(r.pixels.map(c=>['#a8d96c','#a6d16d','#b4d976','#addc70','#a4ce77','#b8d979','#80b574'].includes(c)?look.neon:c),p.ink);
}
function esdeathFrame({frame=0,moving=false,pose='',attack=false,expression='neutral',blink=false}){
 const r=raster(),{rect,poly,line}=r,p=CHARACTER_PALETTES.esdeath,step=moving?[0,1,0,-1][frame]:0,y=moving?-frame%2:0,skin='#ffe2c6',navy='#34475e',deep='#233247';
 // Long blue hair splits at the hips and trails behind the boots.
 poly([[15,18+y],[39,18+y],[40,36],[47-step,65],[42-step,70],[36,62],[32,43],[23,43],[19+step,65],[12+step,70],[8+step,65],[14,36]],p.hairDark);
 poly([[16,24+y],[21,25+y],[20,45],[17+step,62],[12+step,66],[15,42]],p.hair);poly([[35,25+y],[39,23+y],[38,43],[44-step,65],[39-step,62],[35,45]],p.hair);line(15,34,13+step,60,p.hairLight);line(38,34,42-step,60,p.hairLight);
 // Thigh-high white boots and navy laced knee panels.
 for(const [x,v] of [[21,-step],[30,step]]){rect(x+v,52,5,15,p.coat);rect(x+v,53,5,4,navy);line(x+v+1,54,x+v+3,56,'#8da5b4');line(x+v+3,54,x+v+1,56,'#8da5b4');rect(x+v,58,1,8,p.light);rect(x+v+4,58,1,8,p.shade);poly([[x+v,66],[x+v+5,66],[x+v+6,70],[x+v-1,70]],p.coat);rect(x+v-1,70,7,1,navy);}
 // White officer coat with open lapels, double-breasted buttons and an angled hem.
 poly([[20,37+y],[25,37+y],[28,40+y],[32,37+y],[36,38+y],[38,43],[35,50],[38,56],[33,59],[27,57],[22,59],[18,56],[21,49],[18,42]],p.shade);
 poly([[21,38+y],[25,38+y],[28,41+y],[32,38+y],[35,39+y],[36,43],[33,49],[36,55],[32,57],[28,55],[23,57],[21,54],[23,48],[20,42]],p.coat);
 poly([[24,37+y],[28,40+y],[32,37+y],[33,40+y],[29,46],[27,46],[23,40+y]],navy);poly([[24,38+y],[27,41+y],[25,44],[22,39+y]],p.light);poly([[32,38+y],[29,41+y],[31,44],[34,39+y]],p.light);line(28,40+y,28,47,deep);
 for(const x of [24,31])for(const yy of [45,48])rect(x,yy,1,1,navy);
 rect(20,50,15,3,navy);rect(26,50,4,3,'#b7b3a1');rect(27,51,2,1,deep);rect(22,54,2,2,deep);rect(31,54,2,2,deep);line(27,54,28,57,p.shade);
 // Dark sleeves and gloves, white shoulder epaulettes, and a held rapier.
 const handY=attack||pose==='ice'?43:53;
 line(18,40+y,14,50,navy,5);line(36,40+y,42,handY-1,navy,5);poly([[17,38+y],[21,39+y],[20,43],[15,41]],p.coat);poly([[35,38+y],[39,39+y],[41,43],[36,42]],p.coat);rect(16,39+y,4,1,p.light);rect(36,39+y,4,1,p.light);
 rect(12,49,4,5,deep);rect(41,handY-1,4,4,deep);rect(13,53,3,2,skin);rect(42,handY+2,3,2,skin);line(45,handY+1,49,handY-17,'#d4e8ee',2);line(42,handY,49,handY+2,'#c8b57e',2);rect(44,handY+3,2,3,'#79604d');
 rect(25,36+y,7,3,skin);line(25,37+y,28,38+y,deep);line(28,38+y,31,37+y,deep);
 poly([[18,21+y],[37,21+y],[38,31+y],[34,37+y],[28,39+y],[21,36+y],[17,29+y]],skin);
 paintFace(r,'esdeath',{y,expression,blink});if(!blink&&expression!=='hurt')for(const x of [22,32]){rect(x,29+y,2,3,'#6299be');rect(x,29+y,1,1,'#effaff');}
 poly([[16,30+y],[15,21+y],[19,14+y],[27,11+y],[36,14+y],[41,21+y],[40,32+y],[37,36+y],[35,23+y],[32,21+y],[28,27+y],[24,21+y],[20,28+y],[18,35+y]],p.hairDark);
 poly([[17,25+y],[18,19+y],[23,15+y],[32,15+y],[38,21+y],[38,28+y],[33,21+y],[29,24+y],[24,18+y],[21,25+y],[19,30+y]],p.hair);line(22,16+y,34,18+y,p.hairLight);line(38,24+y,38,31+y,p.hairLight);
 // Peaked cap: dark band, angular visor, silver piping and central insignia.
 poly([[14,17+y],[17,11+y],[25,7+y],[32,8+y],[40,13+y],[41,18+y],[36,20+y],[18,20+y]],p.shade);poly([[16,16+y],[19,12+y],[26,9+y],[32,10+y],[38,14+y],[39,17+y]],p.coat);line(17,15+y,26,10+y,p.light);line(26,10+y,38,15+y,p.light);rect(15,17+y,25,3,deep);line(17,18+y,38,18+y,'#b5c6d6');poly([[19,20+y],[38,19+y],[35,22+y],[29,24+y],[21,23+y]],navy);line(22,22+y,34,22+y,'#93a9b9');rect(26,13+y,5,5,navy);rect(28,12+y,1,7,'#b8cbd2');rect(25,15+y,7,1,'#b8cbd2');rect(27,14+y,3,3,'#3c526b');
 return outline(r.pixels,p.ink);
}
function frierenFrame(options){const r=raster();redrawFrieren(r,options);return outline(r.pixels,'#29333f');}

function zeroSuitFrame({frame=0,moving=false,pose='',attack=false,expression='neutral',blink=false,skin='zerosuit'}){
 const r=raster(),{rect,poly,line}=r,ink='#293347',blue=skin==='stealth'?'#3c465c':'#4e85c3',shade=skin==='stealth'?'#252e46':'#33517f',light=skin==='stealth'?'#727c94':'#a0c9ed',hair='#e4c275',hairDark='#a98855',tone='#ffe2c6',walk=moving?[0,2,0,-2][frame]:0,y=moving?-frame%2:0;
 poly([[35,16+y],[41,12+y],[47,18+y],[46,31+y],[49+walk,42],[44+walk,49],[40,40],[42,30],[38,25+y]],hairDark);poly([[39,17+y],[43,15+y],[45,20+y],[43,32],[46+walk,41],[44+walk,45],[42,36],[43,26]],hair);rect(38,18+y,5,3,'#b76072');
 for(const [x,s]of [[21,-walk],[31,walk]]){poly([[x,51],[x+5,51],[x+5+s,65],[x+4+s,69],[x+s,69]],shade);rect(x+s+1,54,3,11,blue);rect(x+s,63,5,4,light);rect(x+s-1,67,8,3,blue);rect(x+s,70,7,1,ink);}
 poly([[21,37],[34,37],[38,44],[34,51],[35,57],[22,57],[21,51],[18,44]],shade);poly([[23,38],[32,38],[35,44],[31,49],[32,54],[24,54],[24,49],[21,44]],blue);line(28,40,28,48,light,1);poly([[23,46],[28,49],[33,46],[32,50],[28,52],[24,50]],light);rect(22,54,13,3,blue);rect(26,54,5,2,'#dda757');
 line(20,41,16,51,blue,4);rect(14,51,5,5,tone);line(36,41,attack?43:40,attack?44:51,blue,4);rect(attack?42:38,attack?43:51,5,4,tone);rect(attack?44:40,attack?42:49,8,4,'#667784');rect(attack?50:46,attack?42:49,3,3,'#a9e0d2');
 poly([[18,21+y],[23,16+y],[33,17+y],[39,23+y],[37,32+y],[32,37+y],[23,36+y],[18,29+y]],tone);paintFace(r,'samus',{y,expression,blink});poly([[16,27+y],[15,19+y],[20,12+y],[31,10+y],[38,16+y],[40,23+y],[36,28+y],[33,20+y],[29,23+y],[25,19+y],[21,26+y],[19,32+y]],hairDark);poly([[17,23+y],[19,17+y],[25,13+y],[31,13+y],[36,18+y],[37,22+y],[33,18+y],[29,21+y],[25,17+y],[21,23+y],[18,28+y]],hair);line(23,14+y,31,14+y,'#fff0af');poly([[20,19+y],[25,17+y],[29,20+y],[33,18+y],[36,23+y],[33,26+y],[30,23+y],[27,27+y],[25,23+y],[22,26+y]],hair);return outline(r.pixels,ink);
}

// Titan forms keep the shared redesign; the human outfits come from eren-art.
function erenFrame(options){if(!options.form)return erenPixels(options);const r=raster();redrawEren(r,options);return outline(r.pixels,'#29333f');}
function fusionSuitFrame({frame=0,moving=false,pose='',attack=false,expression='neutral'}){
 const r=raster(),{rect,poly,line}=r,ink='#273e55',cyan='#3b9cbd',cyanDark='#23607d',cyanLight='#83d7e2',gold='#d5b94d',goldLight='#f4dc7b',goldDark='#8a8144',pink='#c34b83',pinkDark='#783a67',pinkLight='#ee89b2',green='#4c8064',walk=moving?[0,2,0,-2][frame]:0,y=moving?-frame%2:0;
 if(pose==='bomb'){poly([[15,63],[13,53],[19,45],[29,42],[39,48],[43,57],[39,66],[30,70],[20,68]],cyanDark);poly([[18,61],[16,54],[21,48],[29,46],[36,50],[39,57],[35,64],[29,67],[22,65]],cyan);line(24,47,26,67,gold,3);line(33,48,32,65,goldLight,2);rect(25,54,8,5,pink);rect(27,55,4,3,cyanLight);return outline(r.pixels,ink);}
 for(const [x,s]of [[20,-walk],[31,walk]]){poly([[x,50],[x+6,50],[x+7+s,62],[x+5+s,69],[x-1+s,68]],cyanDark);poly([[x+1,52],[x+5,52],[x+5+s,60],[x+2+s,64],[x+s,62]],cyan);poly([[x+1+s,55],[x+4+s,57],[x+3+s,63],[x+s,62]],gold);rect(x+s+1,64,4,4,cyanLight);poly([[x+s,67],[x+s+6,67],[x+s+8,71],[x+s-2,71]],cyan);}
 poly([[18,33],[37,33],[39,44],[34,51],[28,56],[21,51],[16,43]],cyanDark);poly([[22,35],[34,35],[36,44],[32,49],[28,54],[23,49],[20,43]],goldDark);poly([[24,35],[32,35],[34,43],[30,48],[28,52],[25,48],[22,42]],gold);for(const yy of [38,42,46]){line(24,yy,28,yy+2,goldLight,1);line(28,yy+2,32,yy,goldLight,1);}line(28,37,28,51,'#8e824c',1);poly([[18,33],[25,35],[28,38],[32,35],[38,33],[36,38],[28,43],[20,38]],pinkDark);poly([[20,34],[28,38],[36,34],[34,38],[28,41],[22,38]],pink);line(21,35,28,39,pinkLight,1);
 for(const x of [9,38]){poly([[x,32],[x+4,27],[x+11,29],[x+13,36],[x+9,42],[x+2,41],[x-1,37]],cyanDark);poly([[x+1,32],[x+5,29],[x+10,31],[x+11,36],[x+8,39],[x+3,38]],cyan);line(x+3,31,x+8,31,cyanLight,1);}
 line(14,41,12,52,cyan,5);rect(10,50,6,7,cyanDark);rect(11,51,4,3,cyanLight);for(let i=0;i<3;i++)poly([[11,43+i*4],[4-i,40+i*4],[9,47+i*4]],cyanLight);
 const yy=attack?43:47;line(42,40,43,yy,cyan,4);poly([[38,yy-1],[44,yy-3],[49,yy],[49,yy+7],[43,yy+9],[38,yy+6]],'#315c4f');rect(40,yy,7,6,green);line(41,yy,45,yy-1,'#9abc80',1);rect(47,yy,7,6,'#284b48');rect(51,yy+1,3,4,attack?'#e8f5b8':'#9dc4a5');
 poly([[18,24+y],[17,17+y],[22,10+y],[29,7+y],[36,11+y],[40,18+y],[39,28+y],[34,34+y],[24,34+y]],pinkDark);poly([[19,23+y],[20,17+y],[24,12+y],[29,10+y],[35,14+y],[38,20+y],[37,27+y],[33,31+y],[25,31+y]],pink);line(24,13+y,29,11+y,pinkLight,2);line(30,11+y,35,15+y,pinkLight,1);poly([[21,20+y],[27,22+y],[29,27+y],[31,22+y],[37,20+y],[35,28+y],[29,31+y],[24,28+y]],'#315c83');poly([[22,21+y],[27,23+y],[29,28+y],[31,23+y],[36,21+y],[34,27+y],[29,30+y],[25,27+y]],expression==='hurt'?'#e5d992':cyanLight);line(29,23+y,29,29+y,'#d4f2ee',1);rect(23,30+y,3,2,pinkLight);rect(33,29+y,3,2,pinkLight);return outline(r.pixels,ink);
}

const dataCache=new Map();
export function characterPixels(id,{frame=0,moving=false,pose='',attack=false,expression='neutral',blink=false,skin:skinId='default',form=id==='erza'?3:0,evolved=''}={}){
  frame=((frame%4)+4)%4;const key=[id,frame,moving,pose,attack,expression,blink,skinId,form,evolved].join(':');if(dataCache.has(key))return dataCache.get(key);
  if(id==='denji'){const result=denjiPixels({frame,moving,pose,attack,expression,blink,skin:skinId,form});dataCache.set(key,result);return result;}
  if(id==='shiraori'){const result=shiraoriPixels({frame,moving,pose,attack,expression,blink,skin:skinId});dataCache.set(key,result);return result;}
  if(id==='guts'){const result=gutsPixels({frame,moving,pose,attack,expression,blink,skin:skinId,form});dataCache.set(key,result);return result;}
  if(id==='kurumi'){const result=kurumiPixels({frame,moving,pose,attack,expression,blink,skin:skinId});dataCache.set(key,result);return result;}
  if(id==='diavolo'){const result=diavoloPixels({frame,moving,pose,attack,expression,blink,skin:skinId});dataCache.set(key,result);return result;}
  if(id==='yuki'){const result=yukiPixels({frame,moving,pose,attack,expression,blink,skin:skinId});dataCache.set(key,result);return result;}
  if(id==='erza'){const result=erzaPixels({frame,moving,pose,attack,expression,blink,skin:skinId,form});dataCache.set(key,result);return result;}
  if(id==='esdeath'){const result=esdeathPixels({frame,moving,pose,attack,expression,blink,skin:skinId});dataCache.set(key,result);return result;}
  if(id==='featherine'){const result=featherinePixels({frame,moving,pose,attack,expression,blink,skin:skinId});dataCache.set(key,result);return result;}
  if(id==='maomao'){const result=maomaoPixels({frame,moving,pose,attack,expression,blink,skin:skinId});dataCache.set(key,result);return result;}
  if(id==='gojo'){const result=gojoPixels({frame,moving,pose,attack,expression,blink,skin:skinId});dataCache.set(key,result);return result;}
  if(id==='madoka'){const result=madokaPixels({frame,moving,pose,attack,expression,blink,skin:skinId});dataCache.set(key,result);return result;}
  if(id!=='shinji'){const beach=beachOutfitPixels(id,skinId,{frame,moving,pose,attack,expression,blink,form})||cuteSwimPixels(id,skinId,{frame,moving,pose,attack,expression,blink,form});if(beach){dataCache.set(key,beach);return beach;}}
  if(skinId==='swimsuit'&&id!=='shinji'){const swimming=swimsuitPixels(id,{frame,moving,pose,attack,expression,blink,form});if(swimming){dataCache.set(key,swimming);return swimming;}}
  if(skinId==='pajamas'&&id!=='shinji'){const pajamas=pajamaPixels(id,{frame,moving,pose,attack,expression,blink,form});if(pajamas){dataCache.set(key,pajamas);return pajamas;}}
  if(skinId==='casual'&&id!=='shinji'){const casual=casualPixels(id,{frame,moving,pose,attack,expression,blink,form});if(casual){dataCache.set(key,casual);return casual;}}
  const reference=referenceOutfitPixels(id,{frame,moving,pose,attack,expression,blink,skin:skinId});if(reference){dataCache.set(key,reference);return reference;}
  if(id==='goku'){const result=gokuPixels({frame,moving,pose,attack,expression,blink,skin:skinId,form});dataCache.set(key,result);return result;}
  if(id==='rimuru'){const result=rimuruPixels({frame,moving,pose,attack,expression,blink,skin:skinId,form});dataCache.set(key,result);return result;}
  if(id==='eren'){const result=erenFrame({frame,moving,pose,attack,expression,blink,skin:skinId,form,evolved});dataCache.set(key,result);return result;}
  if(id==='samus'&&skinId==='fusion'){const result=fusionSuitFrame({frame,moving,pose,attack,expression});dataCache.set(key,result);return result;}
  if(id==='megumi'){const result=megumiPixels({frame,moving,pose,attack,expression,blink,skin:skinId==='training'?'training':'default'});dataCache.set(key,result);return result;}
  if(id==='samus'&&['zerosuit','stealth'].includes(skinId)&&pose!=='bomb'){const result=zeroSuitFrame({frame,moving,pose,attack,expression,blink,skin:skinId});dataCache.set(key,result);return result;}
  if(id==='frieren'){const result=frierenFrame({frame,moving,pose,attack,expression,blink,skin:skinId});dataCache.set(key,result);return result;}
  if(id==='samus'){const result=tintPixels(variaSuitPixels({frame,moving,pose,attack,expression,blink}),skinFor(id,skinId));dataCache.set(key,result);return result;}
  if(id==='esdeath'){const result=tintPixels(esdeathFrame({frame,moving,pose,attack,expression,blink}),skinFor(id,skinId));dataCache.set(key,result);return result;}
  if(id==='shinji'){const result=evaFrame({frame,moving,pose,attack,expression,blink,skin:skinFor(id,skinId),evolved});dataCache.set(key,result);return result;}
  const p=CHARACTER_PALETTES[id],r=raster(),{rect,poly,line}=r;
  const madoka=id==='madoka',walk=moving?[0,1,0,-1][frame]:0,bob=moving?(frame%2):0;
  const skin='#ffe2c6',skinShadow='#e8af96',white='#fff5ed',blue='#334e7b';
  // Back hair / ribbons and scarf move independently from the torso.
  if(id==='goku'&&form===3){poly([[17,17],[39,17],[45,36],[49,47],[39,44],[37,48],[29,41],[22,48],[18,43],[10,46],[14,31]],'#ab7d32');poly([[18,20],[37,20],[40,35],[44,43],[36,39],[35,44],[28,37],[22,44],[18,39],[14,42]],'#ecd064');}
  if(madoka){
    const sway=moving?[0,1,0,-1][frame]:frame%2;
    poly([[14,17],[8+sway,20],[9+sway,33],[12+sway,38],[14,33],[18,35],[18,22]],p.hairDark);
    poly([[42,17],[48-sway,20],[47-sway,33],[44-sway,38],[42,33],[38,35],[38,22]],p.hairDark);
    poly([[13,19],[10+sway,23],[12+sway,32],[14,29],[16,32],[16,21]],p.hair);
    poly([[43,19],[46-sway,23],[44-sway,32],[42,29],[40,32],[40,21]],p.hair);
    rect(11+sway,22,2,7,p.hairLight);rect(43-sway,22,2,7,p.hairLight);
  }
  if(id==='naruto'){poly([[35,36],[46,38+walk],[52,34+walk],[48,41+walk],[36,40]],'#27394f');rect(45,38+walk,5,1,'#52647b');}
  // Shoes, separated legs and fabric folds. Feet stay anchored to the same ground point.
  const ly=walk>0?-2:0,ry=walk<0?-2:0;
  if(madoka){rect(21-walk,57,5,10+ly,white);rect(30+walk,57,5,10+ry,white);rect(21-walk,63+ly,5,2,'#cebdcc');rect(30+walk,63+ry,5,2,'#cebdcc');rect(20-walk,67+ly,6,3,'#a84569');rect(30+walk,67+ry,6,3,'#a84569');rect(21-walk,66+ly,4,1,'#df8ca7');rect(31+walk,66+ry,4,1,'#df8ca7');}
  else{
    const trousers=id==='maomao'?'#c5b9cd':id==='gojo'?p.coat:id==='goku'?'#e59144':'#e58b40';
    poly([[20,54],[27,54],[26-walk,67+ly],[20-walk,67+ly]],trousers);poly([[29,54],[36,54],[36+walk,67+ry],[30+walk,67+ry]],trousers);
    rect(21-walk,60,2,4+ly,p.shade);rect(31+walk,59,2,5+ry,p.light);rect(20-walk,66+ly,7,4,id==='maomao'?'#493b49':id==='gojo'?'#161a28':blue);rect(29+walk,66+ry,8,4,id==='maomao'?'#493b49':id==='gojo'?'#161a28':blue);
    rect(20-walk,69+ly,7,1,'#101b30');rect(29+walk,69+ry,8,1,'#101b30');rect(21-walk,65+ly,5,1,id==='goku'?'#e1b876':'#9aaec3');rect(30+walk,65+ry,5,1,id==='goku'?'#e1b876':'#9aaec3');
  }
  // Hand and sleeve silhouettes: distinguish a guarded stance, ninja run, and bow grip.
  let left=[[18,42-bob],[15,47+walk],[17,53+walk]],right=[[38,42-bob],[41,47-walk],[39,53-walk]];
  if(id==='naruto'&&moving){left=[[19,43],[14,43],[11,39]];right=[[37,43],[43,44],[47,40]];}
  if(madoka){left=[[19,42],[20,47],[24,46]];right=[[37,42],[40,46],[44,45]];}
  if(attack&&!madoka){right=[[37,42],[43,42],[46,39]];}
  if(pose==='gather'){left=[[18,42],[10,27],[13,10]];right=[[38,42],[46,27],[43,10]];}
  if(pose==='throw'){left=[[19,42],[28,43],[38,40]];right=[[37,42],[43,40],[46,36]];}
  if(pose==='domain'){right=[[37,43],[42,38],[40,33]];}
  if(pose==='seal'){left=[[19,43],[22,46],[27,43]];right=[[37,43],[34,46],[29,43]];}
  for(const arm of [left,right]){const sleeve=madoka?white:id==='naruto'?'#303448':p.coat;line(...arm[0],...arm[1],p.ink,5);line(...arm[1],...arm[2],p.ink,4);line(arm[0][0]+1,arm[0][1],arm[1][0]+1,arm[1][1],sleeve,3);line(arm[1][0]+1,arm[1][1],arm[2][0]+1,arm[2][1],id==='gojo'||id==='naruto'?sleeve:skin,2);rect(arm[2][0],arm[2][1],3,3,madoka?white:skin);}
  // Character-specific bodies. Dark outlines and two-tone clusters replace gradients.
  poly([[19,40-bob],[24,38-bob],[32,38-bob],[37,40-bob],[36,54],[33,58],[22,58],[20,54]],p.coat);
  rect(22,41-bob,2,11,p.light);rect(34,44-bob,2,11,p.shade);rect(26,38-bob,4,3,skinShadow);
  if(id==='goku'){
    poly([[23,40-bob],[28,46-bob],[33,40-bob],[31,51],[25,51]],blue);line(22,41-bob,28,48-bob,'#ffd18a',1);line(34,41-bob,28,48-bob,p.shade,1);
    rect(21,53,15,3,blue);rect(27,55,2,5,'#436492');rect(29,55,2,3,'#203653');rect(33,43-bob,3,4,'#f8e3b4');rect(34,44-bob,1,2,'#35466a');
    rect(left[2][0],left[2][1]-1,3,2,blue);rect(right[2][0],right[2][1]-1,3,2,blue);line(23,49,25,51,p.shade);line(32,50,34,49,p.light);
  }else if(id==='gojo'){
    rect(22,38-bob,13,5,'#303047');rect(23,38-bob,11,1,'#63617e');rect(27,42-bob,2,13,'#46465f');rect(21,54,15,2,'#1a1c2c');rect(32,49,3,1,'#5c5979');rect(22,48,3,1,'#45465f');rect(20,43,2,7,'#35354d');
    if(pose==='domain'||!moving){rect(right[2][0],right[2][1]-4,1,5,skin);rect(right[2][0]+2,right[2][1]-4,1,5,skin);}
  }else if(id==='naruto'){
    poly([[20,40-bob],[36,40-bob],[36,46],[31,48],[25,48],[20,46]],'#2b3144');rect(27,41-bob,2,14,'#b4b7bf');rect(28,45,1,2,'#f9dcc0');rect(23,53,3,1,p.shade);rect(31,53,3,1,p.shade);rect(35,54,5,6,'#716553');rect(36,55,3,1,'#ad9d7a');rect(31,61,5,2,'#343b50');
  }else{
    // Cream corset, pink side panels, scalloped petticoat and red chest ribbon.
    rect(22,41-bob,12,12,'#f5d7a2');rect(23,42-bob,2,10,'#fff0c7');rect(31,42-bob,2,10,'#dcb880');rect(21,43-bob,2,10,'#db8caf');rect(34,43-bob,2,10,'#bc6c95');
    rect(27,43-bob,1,1,'#997567');rect(27,46-bob,1,1,'#997567');rect(27,49-bob,1,1,'#997567');
    poly([[21,52],[35,52],[40,59],[38,62],[34,61],[31,63],[27,62],[23,63],[19,61],[16,61]],white);rect(18,60,3,2,'#d8becf');rect(24,62,3,1,'#dbc0d0');rect(33,61,4,1,'#dbc0d0');
    poly([[22,51],[34,51],[38,58],[33,59],[28,55],[23,59],[18,58]],p.coat);line(21,53,19,57,p.light);line(34,53,36,57,p.light);line(28,53,28,56,p.shade);
    poly([[22,40-bob],[27,42-bob],[23,45-bob]],'#c04f7b');poly([[33,40-bob],[28,42-bob],[32,45-bob]],'#c04f7b');rect(27,41-bob,2,3,'#e6bd72');rect(16,41-bob,5,4,white);rect(36,41-bob,5,4,white);
  }
  // Head: compact jaw, rectangular eyes, and a strong outer hair silhouette.
  const hy=-bob;
  poly([[18,20+hy],[37,20+hy],[39,30+hy],[36,36+hy],[31,39+hy],[24,39+hy],[18,35+hy],[16,29+hy]],skinShadow);
  poly([[19,20+hy],[36,20+hy],[37,31+hy],[34,36+hy],[30,38+hy],[24,37+hy],[19,34+hy],[18,28+hy]],skin);
  rect(16,29+hy,2,4,skinShadow);rect(38,29+hy,2,4,skinShadow);rect(27,35+hy,3,1,'#b47779');
  if(id!=='gojo'){
    const iris=id==='maomao'?'#528861':madoka?'#b75481':id==='naruto'?'#408abd':'#253a50';
    for(const x of [21,31]){rect(x,28+hy,5,1,p.ink);rect(x,29+hy,4,4,'#fff5e6');rect(x+1,29+hy,2,4,iris);rect(x+1,29+hy,1,1,'#fffdf2');rect(x+1,32+hy,2,1,madoka?'#e68bac':id==='naruto'?'#79c7dc':'#58798b');}
    if(madoka){rect(19,34+hy,3,1,'#edb0b5');rect(35,34+hy,3,1,'#edb0b5');}
  }
  if(id==='goku'){
    poly([[16,29+hy],[13,24+hy],[7,21+hy],[13,18+hy],[7,12+hy],[19,14+hy],[18,5+hy],[27,12+hy],[31,3+hy],[34,13+hy],[45,8+hy],[41,19+hy],[49,19+hy],[42,25+hy],[38,31+hy],[35,23+hy],[31,20+hy],[28,27+hy],[24,20+hy],[20,25+hy]],p.hairDark);
    poly([[13,14+hy],[21,17+hy],[20,9+hy],[27,15+hy],[31,7+hy],[33,18+hy],[42,12+hy],[38,21+hy],[44,21+hy],[38,26+hy],[34,21+hy],[30,18+hy],[27,24+hy],[24,18+hy],[18,24+hy]],p.hair);
    line(14,15+hy,23,19+hy,p.hairLight);line(31,9+hy,30,18+hy,p.hairLight);line(40,15+hy,35,22+hy,p.hairLight);rect(21,27+hy,4,1,p.hairDark);rect(32,27+hy,4,1,p.hairDark);
  }else if(id==='gojo'){
    poly([[16,28+hy],[11,23+hy],[15,21+hy],[10,17+hy],[17,17+hy],[13,11+hy],[21,14+hy],[21,5+hy],[27,12+hy],[31,3+hy],[34,12+hy],[40,6+hy],[39,16+hy],[46,13+hy],[42,21+hy],[47,22+hy],[39,28+hy]],p.hairDark);
    poly([[17,25+hy],[14,22+hy],[19,21+hy],[14,18+hy],[21,18+hy],[17,13+hy],[24,16+hy],[23,8+hy],[28,15+hy],[31,7+hy],[33,16+hy],[38,10+hy],[37,20+hy],[43,17+hy],[39,24+hy]],p.hair);
    line(25,15+hy,26,22+hy,'#d7d9ef');line(33,14+hy,32,23+hy,'#c6c9e0');rect(16,25+hy,23,7,p.ink);rect(18,25+hy,19,1,'#62617a');poly([[18,27+hy],[26,28+hy],[28,30+hy],[30,28+hy],[37,27+hy],[35,30+hy],[29,32+hy],[24,31+hy],[18,29+hy]],'#2f3146');rect(22,26+hy,4,1,'#777b91');
  }else if(id==='naruto'){
    poly([[16,30+hy],[12,25+hy],[15,22+hy],[10,18+hy],[17,18+hy],[14,12+hy],[21,15+hy],[22,8+hy],[27,14+hy],[32,8+hy],[34,15+hy],[41,12+hy],[39,19+hy],[46,19+hy],[41,24+hy],[39,31+hy]],p.hairDark);
    poly([[17,26+hy],[15,22+hy],[15,20+hy],[20,20+hy],[18,15+hy],[24,18+hy],[24,12+hy],[28,17+hy],[31,12+hy],[32,19+hy],[38,16+hy],[36,22+hy],[41,21+hy],[38,27+hy]],p.hair);
    rect(17,23+hy,23,5,'#344259');rect(21,23+hy,15,4,'#b7c6d1');rect(22,23+hy,12,1,'#e3e7e5');line(27,24+hy,30,25+hy,'#5c6d80');rect(27,26+hy,3,1,'#5c6d80');
    for(const y of [32,34]){rect(19,y+hy,3,1,'#b88275');rect(36,y+hy,3,1,'#b88275');}rect(17,21+hy,4,1,p.hairLight);rect(24,18+hy,4,1,p.hairLight);rect(33,19+hy,4,1,p.hairLight);
  }else{
    poly([[15,28+hy],[14,18+hy],[18,13+hy],[24,10+hy],[33,10+hy],[39,13+hy],[42,19+hy],[41,29+hy],[38,31+hy],[35,25+hy],[32,22+hy],[29,27+hy],[25,23+hy],[22,28+hy],[19,24+hy],[18,32+hy]],p.hairDark);
    poly([[16,24+hy],[16,18+hy],[20,14+hy],[25,12+hy],[32,12+hy],[38,15+hy],[40,20+hy],[39,27+hy],[35,22+hy],[32,19+hy],[29,24+hy],[25,20+hy],[22,25+hy],[19,21+hy]],p.hair);
    rect(20,14+hy,16,2,p.hairLight);rect(17,18+hy,3,3,'#f9bfd5');rect(38,18+hy,2,5,'#f9bfd5');
    for(const x of [12,40]){poly([[x,13+hy],[x+5,17+hy],[x+2,21+hy],[x-3,18+hy]],'#ac3b63');poly([[x,14+hy],[x+3,17+hy],[x+1,19+hy],[x-1,17+hy]],'#dd6b92');rect(x+1,18+hy,3,3,'#bd456e');}
  }
  if(id==='goku'&&form===2){poly([[29,12+hy],[33,0+hy],[36,15+hy]],p.hair);line(33,3+hy,33,10+hy,p.hairLight);poly([[23,18+hy],[27,22+hy],[26,28+hy],[23,23+hy]],p.hair);}
  if(id==='goku'){poly([[20,21+hy],[23,19+hy],[25,24+hy],[23,27+hy],[21,24+hy],[19,27+hy]],p.hair);poly([[32,20+hy],[35,22+hy],[38,27+hy],[34,25+hy],[32,27+hy]],p.hair);}
  paintFace(r,id,{y:hy,expression,blink});if(id==='gojo'&&skinId==='unsealed'){rect(18,25+hy,19,7,'#ffe2c6');paintFace(r,'shinji',{y:hy,expression,blink});if(!blink&&expression!=='hurt'){rect(22,29+hy,2,3,'#5ab5df');rect(32,29+hy,2,3,'#5ab5df');}}let result=tintPixels(outline(r.pixels,p.ink),skinFor(id,skinId));if(id==='goku'&&form>0){const hair=form===4?['#67c9e8','#357697','#b5f4f2']:['#ecd064','#ab7d32','#fff1a3'];const shades={'#182331':hair[0],'#101520':hair[1],'#354459':hair[2],'#ecd064':hair[0],'#ab7d32':hair[1],'#fff1a3':hair[2]};result=result.map(c=>shades[c]||c);}dataCache.set(key,result);return result;
}
export function pixelRuns(pixels,width=SPRITE_WIDTH){const runs=[];for(let y=0;y<pixels.length/width;y++){for(let x=0;x<width;){const color=pixels[y*width+x];if(!color){x++;continue;}let end=x+1;while(end<width&&pixels[y*width+end]===color)end++;runs.push({x,y,width:end-x,color});x=end;}}return runs;}
export function pixelsSvg(pixels){return pixelRuns(pixels).map(r=>`<rect x="${r.x}" y="${r.y}" width="${r.width}" height="1" fill="${r.color}"/>`).join('');}
