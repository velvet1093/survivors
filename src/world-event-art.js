import {enemyArtFrame,enemyFace,enemyLegs,ENEMY_INK} from './enemy-art-kit.js';
import {raster,outline} from './pixel-characters.js';
import {berserkEnemyPixels} from './berserk-enemy-art.js';
import {warPixels} from './war-pixels.js';
import {GRAVEYARD_PALETTES,graveyardEnemyPixels} from './graveyard-enemy-art.js';
import {drawGraveyardWeather} from './graveyard-weather.js';
import {drawGraveyardAttack} from './graveyard-attack-art.js';

export const EVENT_PALETTES={
 ...Object.fromEntries(['peronaparade','ainztomb','paradehollow','tombsentinel'].map(id=>[id,GRAVEYARD_PALETTES[id]])),
 eclipsefemto:['#49334f','#211f34','#e3a3b5'],
 tempestlord:['#d7ba7b','#66526a','#fbefd0'],
 frostregent:['#a7cbd8','#415876','#e9f3e8'],
 eclipseapostle:['#806274','#382f45','#d8a2aa'],
 stormwraith:['#7593b3','#35455f','#e8d9a0'],
 frostwalker:['#95bbc9','#47687e','#dff2ed'],
};
const TAU=Math.PI*2,BONE='#e9d8b9',GOLD='#d9b970';
const hash=n=>{const v=Math.sin(n*127.1+311.7)*43758.5453;return v-Math.floor(v);};
function copyArt(pixels){const r=raster();for(let i=0;i<pixels.length;i++)if(pixels[i])r.pixels[i]=pixels[i];return r;}
function eclipseFemto(m){
 const source=berserkEnemyPixels('femto',{...m,enraged:1}),r=copyArt(source),{poly:P,rect:R,line:L}=r,hot=!!m.enraged,attack=!!m.attack;
 // A crimson sun coronet and long eye-shaped chest seal identify the Eclipse
 // incarnation separately from Femto's ordinary violet-winged release.
 for(const side of [-1,1]){
  P([[28+side*7,29],[28+side*24,7],[28+side*26,11],[28+side*24,29],[28+side*25,47],[28+side*18,42],[28+side*18,57],[28+side*10,47]],'#30263d');
  P([[28+side*9,31],[28+side*23,12],[28+side*21,28],[28+side*22,39],[28+side*16,35],[28+side*15,47]],hot?'#6f3c58':'#51405f');
  L(28+side*9,32,28+side*22,13,'#ab6b85');
  for(const [x,y]of [[28+side*8,5],[28+side*15,8],[28+side*18,14]]){R(x,y,3,2,'#d18a9c');R(x+1,y+2,2,1,'#733d59');}
 }
 P([[22,3],[28,0],[34,3],[35,8],[31,11],[25,10],[21,7]],'#8d445d');P([[24,4],[28,2],[32,4],[32,7],[29,9],[25,7]],'#241d33');L(23,3,27,1,'#efb6ae');
 P([[24,35],[28,32],[32,35],[33,40],[28,45],[23,40]],'#8b4c6a');P([[25,37],[28,35],[31,37],[28,42]],'#efb7c1');R(27,37,2,4,'#35243e');
 L(21,21,25,22,'#eab6bd');L(31,22,36,19,'#eab6bd');
 if(hot)for(const [x,y]of [[6,47],[11,58],[44,50],[39,62]]){P([[x,y],[x+2,y-8],[x+4,y]],'#b56f8b');L(x+1,y-5,x+2,y-2,'#e0a4ba');}
 if(attack){P([[42,31],[47,27],[52,31],[47,36]],'#9b5e80');P([[45,31],[47,29],[49,31],[47,33]],'#f0c6ca');}
 return outline(r.pixels,ENEMY_INK);
}
function tempestLord(m){
 const a=enemyArtFrame(m),{r,R,P,L,leg,arm,attack,enraged,finish}=a,[base,shade,light]=EVENT_PALETTES.tempestlord;
 // Enel's four tomoe drums sit on a gold arch behind his bare shoulders.
 P([[10,26],[8,13],[13,4],[28,0],[43,4],[49,13],[47,26],[44,23],[45,14],[41,7],[28,4],[15,7],[12,14],[13,23]],shade);
 L(11,21,10,13,GOLD,2);L(10,13,14,6,GOLD,2);L(14,6,28,2,GOLD,2);L(29,2,41,6,GOLD,2);L(42,7,47,14,GOLD,2);L(47,15,46,22,GOLD,2);
 for(const [x,y]of [[13,9],[42,9],[8,23],[47,23]]){
  P([[x-6,y-3],[x-3,y-7],[x+3,y-7],[x+6,y-3],[x+6,y+4],[x+2,y+7],[x-4,y+6],[x-7,y+1]],'#6c6170');
  P([[x-4,y-3],[x-2,y-5],[x+3,y-5],[x+4,y-1],[x+3,y+4],[x-2,y+5],[x-4,y+1]],'#eee0b9');R(x-1,y-3,3,3,'#6c5370');R(x-3,y+1,3,3,'#6c5370');R(x+1,y+2,3,2,'#6c5370');
 }
 enemyLegs(r,{leg,top:49,left:18,right:31,width:8,cloth:'#d7d3c3',shade:'#7c8190',light:'#f5efd5',boots:'#696571',bootLight:'#b9b7af'});
 P([[17,32],[23,29],[34,29],[40,35],[38,46],[34,53],[22,53],[16,45]],'#ad8873');P([[20,33],[25,31],[32,31],[36,35],[35,44],[31,49],[23,47],[19,41]],'#e2bd94');
 P([[21,34],[26,34],[28,38],[24,41],[19,37]],'#f3d6ac');P([[30,34],[34,34],[37,37],[32,41],[28,38]],'#f3d6ac');L(28,35,28,46,'#b28f79');L(23,43,26,44,'#ad8873');L(30,44,33,43,'#ad8873');
 R(18,47,20,5,'#6f607d');R(21,48,15,2,GOLD);P([[21,51],[29,53],[35,51],[33,58],[28,60],[22,57]],'#e2d7b7');
 for(const [x,s]of [[17,-1],[39,1]]){const hy=attack?31:45,hx=x+s*(4+arm);L(x,34,x+s*4,40,'#ad8873',6);L(x,34,x+s*3,39,'#e2bd94',4);L(x+s*3,39,hx,hy,'#e2bd94',3);R(hx-2,hy-2,5,5,'#e8c79e');R(hx-3,hy-3,7,2,GOLD);}
 enemyFace(r,{tone:'#e2bd94',shade:'#ad8873',light:'#f3d6ac',eye:'#7e7190',narrow:true});
 P([[18,19],[18,12],[23,7],[32,7],[37,13],[38,19],[32,17],[25,18]],'#deded1');P([[20,13],[24,9],[31,9],[35,13],[35,17],[20,17]],'#f8f4df');R(21,17,15,2,'#a6a6a5');
 for(const side of [-1,1]){const x=side<0?17:38;L(x,20,x+side,34,'#d9b38f',2);R(x+side-1,31,4,4,GOLD);R(x+side,32,2,2,'#fbefd0');}
 const sx=attack?49:46;L(sx,19,sx,70,'#7b6655',3);L(sx,20,sx,68,GOLD);R(sx-2,17,5,4,'#f4df9f');
 if(attack||enraged){const yy=attack?30:41;P([[39,yy],[43,yy-10],[46,yy-2],[51,yy-8],[47,yy+4],[43,yy+2],[40,yy+9]],'#eee3a8');L(42,yy-5,44,yy,'#fff6d6');}
 if(enraged)for(const [x,y]of [[5,46],[11,59],[43,57],[49,44]])P([[x,y],[x+3,y-9],[x+1,y-2],[x+5,y-5],[x+2,y+5]],'#d5d7b9');
 return finish();
}
function frostRegent(m){
 const raw=warPixels('aokiji',m),ice={'#eee9dc':'#b6d3df','#aeb5b6':'#506d8c','#527d94':'#4b79a0','#93b9d6':'#a4d5df'},r=copyArt(raw.map(c=>ice[c]||c)),{rect:R,poly:P,line:L}=r;
 for(const [x,y,w]of [[10,35,5],[15,28,5],[38,29,5],[44,37,5],[17,56,4],[35,61,4]]){
  P([[x,y+3],[x+2,y-8-(m.enraged?3:0)],[x+w,y+5]],'#719eb8');P([[x+1,y+2],[x+2,y-5-(m.enraged?3:0)],[x+w-1,y+3]],'#d4edf0');L(x+2,y-4,x+2,y+1,'#f2f5e4');
 }
 const handY=m.attack?35:48;P([[38,handY],[42,handY-6],[48,handY-1],[48,handY+6],[43,handY+10],[38,handY+5]],'#507b9b');P([[40,handY],[42,handY-3],[46,handY],[46,handY+4],[42,handY+7]],'#c4e7eb');L(41,handY,45,handY+4,'#f0f8ed');
 R(20,21,6,1,'#d6f0ed');R(31,21,5,1,'#d6f0ed');
 if(m.enraged){for(const [x,y]of [[7,65],[14,69],[39,68],[47,64]]){P([[x-3,y+3],[x,y-7],[x+4,y+3]],'#90bbce');L(x,y-5,x,y+1,'#e6f2ed');}R(24,7,9,2,'#c3dce1');}
 return outline(r.pixels,ENEMY_INK);
}
function elemental(id,m){
 const a=enemyArtFrame(m),{r,R,P,L,leg,arm,attack,tail,finish}=a,[base,shade,light]=EVENT_PALETTES[id];
 if(id==='eclipseapostle'){
  for(const side of [-1,1]){P([[28+side*5,30],[28+side*24,14],[28+side*22,35],[28+side*25,47],[28+side*13,42]],shade);P([[28+side*7,31],[28+side*20,20],[28+side*18,34],[28+side*20,40],[28+side*12,36]],base);L(28+side*8,31,28+side*20,21,light);}
  enemyLegs(r,{leg,top:47,left:18,right:32,width:7,cloth:base,shade,light,boots:shade,bootLight:light});
  P([[16,29],[23,25],[34,26],[40,34],[39,46],[32,55],[22,53],[14,43]],shade);P([[20,30],[25,28],[32,29],[35,35],[33,44],[28,49],[22,45],[18,37]],base);for(const y of [34,39,44])L(22,y,32,y+1,'#a77a85');
  P([[18,17],[23,10],[33,11],[39,20],[36,29],[28,33],[20,28],[15,22]],shade);P([[21,18],[25,14],[32,15],[35,21],[32,27],[27,29],[21,24]],base);
  P([[19,18],[15,4],[24,12]],'#b8a594');P([[32,12],[40,4],[37,22]],'#b8a594');L(18,9,21,16,BONE);L(37,9,36,17,BONE);
  P([[20,21],[27,17],[34,21],[31,25],[24,25]],'#412b40');R(24,21,7,2,'#dc8f9a');R(27,20,2,4,'#f1c4bd');
  for(const [x,s]of [[15,-1],[39,1]]){const hy=attack?35:48,hx=x+s*(4+arm);L(x,34,hx,hy,shade,5);R(hx-2,hy-1,5,5,base);for(let i=0;i<3;i++)L(hx-1+i*2,hy+2,hx+s*3+i*2,hy+7,BONE);}
  if(attack){R(23,28,10,4,'#302438');for(const x of [24,28,31])R(x,28,1,2,BONE);}
 }else if(id==='stormwraith'){
  P([[16,26],[23,22],[35,25],[40,40],[46+tail,61],[37,58],[33,70],[26,62],[18+tail,70],[14,59],[8+tail,63],[13,43]],shade);
  P([[19,29],[25,27],[33,30],[34,43],[41+tail,59],[34,55],[29,65],[24,57],[18,63],[16,52]],base);L(21,33,19,53,'#a4b6c8');L(33,36,36+tail,52,'#a4b6c8');
  P([[15,22],[17,12],[25,6],[34,9],[40,20],[36,30],[23,31]],shade);P([[19,20],[21,14],[27,10],[33,13],[36,21],[33,27],[23,27]],base);P([[22,19],[26,16],[33,18],[34,24],[27,27],[21,24]],'#33425d');
  R(22,21,4,2,light);R(30,20,4,2,light);L(27,24,26,28,'#c8b889');
  for(const [x,s]of [[17,-1],[37,1]]){const hy=attack?31:45,hx=x+s*(5+arm);L(x,33,hx,hy,shade,5);P([[hx-4,hy],[hx,hy-9],[hx+2,hy-2],[hx+6,hy-5],[hx+2,hy+7]],light);}
  L(26,35,23,42,'#ead699',2);L(23,42,30,40,'#ead699',2);L(30,40,26,50,'#ead699',2);
 }else{
  enemyLegs(r,{leg,top:47,left:17,right:32,width:8,cloth:base,shade,light,boots:shade,bootLight:light});
  P([[14,30],[24,25],[34,28],[43,36],[39,50],[32,56],[20,53],[11,42]],shade);P([[18,32],[25,28],[33,31],[38,37],[35,48],[29,52],[22,48],[16,39]],base);P([[21,32],[28,30],[34,35],[31,43],[24,43]],light);L(28,32,27,42,'#f4faf0');L(21,44,32,47,'#60899e');
  for(const [x,s]of [[14,-1],[40,1]]){const hy=attack?35:48,hx=x+s*(4+arm);P([[x-3,31],[x+5,31],[hx+5,hy-3],[hx+3,hy+6],[hx-4,hy+4]],shade);P([[x,33],[x+3,33],[hx+3,hy],[hx,hy+3]],base);L(hx,hy-2,hx+2,hy+2,light);}
  P([[18,17],[22,9],[31,8],[38,17],[37,26],[30,33],[21,29],[16,23]],shade);P([[21,17],[24,12],[30,11],[34,18],[33,25],[28,29],[22,25]],base);P([[24,13],[28,11],[31,16],[28,20],[24,18]],light);R(20,21,5,2,'#e1ede8');R(30,20,5,2,'#e1ede8');R(22,21,2,1,'#50759b');R(32,20,2,1,'#50759b');L(26,25,31,25,shade);
  for(const [x,y]of [[13,32],[37,31],[18,47],[33,51]])P([[x-3,y+2],[x,y-9],[x+4,y+3]],light);
 }
 return finish();
}
export function eventEnemyPixels(id,m={}){if(GRAVEYARD_PALETTES[id]&&EVENT_PALETTES[id])return graveyardEnemyPixels(id,m);if(id==='eclipsefemto')return eclipseFemto(m);if(id==='tempestlord')return tempestLord(m);if(id==='frostregent')return frostRegent(m);return EVENT_PALETTES[id]?elemental(id,m):null;}

const stroke=(c,points,color,width=1)=>{c.strokeStyle=color;c.lineWidth=width;c.lineCap='round';c.beginPath();points.forEach(([x,y],i)=>i?c.lineTo(x,y):c.moveTo(x,y));c.stroke();};
function ring(c,x,y,r,color,width=2){c.strokeStyle=color;c.lineWidth=width;c.beginPath();c.arc(x,y,Math.max(1,r),0,TAU);c.stroke();}
const mod=(n,range)=>((n%range)+range)%range;
// Screen-space only: call after restoring the world camera. These are visual
// weather cues; damage and crowd-control remain in fixed combat warnings.
export function drawWorldEventWeather(c,g,w,h,reduced=false){
 if(g.mode==='bossrush'||g.riftArena||!g.events||!(w>0&&h>0))return false;
 const graveyard=drawGraveyardWeather(c,g,w,h,reduced);
 const active=g.events.active,weather=active?.id||(typeof g.events.weather==='string'?g.events.weather:g.events.weather?.id)||'clear';
 if(weather==='clear')return graveyard;
 const raw=active?.age??g.events.weather?.age??0,t=reduced?0:Math.max(0,Number.isFinite(raw)?raw:0),eclipse=weather==='eclipse',snow=weather==='snow'||weather==='blizzard',storm=weather==='storm',rain=weather==='rain'||storm;
 if(!eclipse&&!snow&&!rain)return graveyard;c.save();
 if(eclipse){
  c.fillStyle='#6e19321c';c.fillRect(0,0,w,h);const r=Math.max(20,Math.min(48,w*.075)),x=w*.81,y=Math.max(88,h*.17);
  c.fillStyle='#7b314046';c.beginPath();c.arc(x,y,r*1.45,0,TAU);c.fill();ring(c,x,y,r+5,'#d5807277',3);ring(c,x,y,r+1,'#efb39a',3);
  c.fillStyle='#151523';c.beginPath();c.arc(x,y,r,0,TAU);c.fill();
  if(!reduced)for(let i=0;i<18;i++){const a=i*TAU/18+t*.035,len=r*(1.15+.13*Math.sin(i*2.3+t*.18));stroke(c,[[x+Math.cos(a)*(r+5),y+Math.sin(a)*(r+5)],[x+Math.cos(a)*len,y+Math.sin(a)*len]],'#ad5a6570',1);}
  for(let i=0;i<(reduced?4:18);i++){const xx=mod(hash(i+1)*w+t*(3+i%3),w),yy=mod(hash(i+40)*h+t*(1+i%2),h),wing=reduced?3:3+Math.sin(t*.8+i)*2;c.fillStyle=i%3?'#241c3155':'#b5747255';c.fillRect(Math.round(xx),Math.round(yy),2,3);stroke(c,[[xx-wing,yy-1],[xx,yy+1],[xx+wing,yy-1]],'#2f213b66',1);}
 }else if(rain){
  c.fillStyle=storm?'#1e35552a':'#294c6412';c.fillRect(0,0,w,h);c.fillStyle=storm?'#26304432':'#46566b15';c.fillRect(0,0,w,Math.min(110,h*.2));
  const count=reduced?7:storm?64:40;
  for(let i=0;i<count;i++){const yy=mod(hash(i+60)*h+t*(storm?290:210),h+45)-20,xx=mod(hash(i+5)*w-t*(storm?70:36),w+25)-10;stroke(c,[[xx,yy],[xx-(storm?5:3),yy+(storm?16:12)]],i%3?'#abcbd13b':'#d1e1d74b',1);}
  if(storm){const x=w*.72,y=Math.max(45,h*.08),pulse=reduced?.1:.08+Math.pow((1+Math.sin(t*.26))*.5,8)*.13;c.globalAlpha=pulse;stroke(c,[[x-15,y-17],[x-3,y-3],[x-11,y+6],[x+6,y+3],[x+1,y+24]],'#e5ddb4',2);c.globalAlpha=1;}
 }else{
  c.fillStyle=weather==='blizzard'?'#9bb6c118':'#9ab8c10a';c.fillRect(0,0,w,h);const count=reduced?8:weather==='blizzard'?66:36;
  for(let i=0;i<count;i++){const drift=weather==='blizzard'?80:15,xx=mod(hash(i+8)*w+t*drift+Math.sin(t*.3+i)*8,w+10)-5,yy=mod(hash(i+70)*h+t*(24+i%4*8),h+10)-5,size=i%5===0?3:2;c.fillStyle=i%3?'#e0f0ed71':'#ecf4eb98';c.fillRect(Math.round(xx),Math.round(yy),size,size);}
  if(weather==='blizzard')for(let i=0;i<3;i++){const yy=h*(.25+i*.28),xx=mod(t*16+i*w*.36,w);stroke(c,[[xx-80,yy+3],[xx,yy],[xx+65,yy-2]],'#d2e9e22a',2);}
 }
 c.restore();return true;
}
export function drawWorldEventAttack(c,e,reduced=false){
 if(['peronaparade','ainztomb'].includes(e.archetype))return drawGraveyardAttack(c,e,reduced);
 const u=e.worldEventAttack;if(!u||e.hp<=0||!e.eventOnly)return false;c.save();const t=u.age||0,marks=Array.isArray(u.marks)?u.marks:[],storm=e.archetype==='tempestlord',ice=e.archetype==='frostregent',color=storm?'#e8d69b':ice?'#caedf0':'#d7a0b7';
 const headX=u.x??e.x,headY=(u.y??e.y)-Math.max(52,(e.r||35)*1.7),gather=Math.min(1,t/1.4);
 if(t<1.5){c.globalAlpha=.55;ring(c,headX,headY,7+gather*12,color,1.5);if(!reduced)for(let i=0;i<5;i++){const a=i*TAU/5+t*.4,r=24+(1-(t*.6+i/5)%1)*14;c.fillStyle=color;c.fillRect(headX+Math.cos(a)*r,headY+Math.sin(a)*r*.7,2,2);}}
 for(const mark of marks){
  const age=t-(mark.delay||0),duration=mark.duration||.4;if(age<0||age>duration)continue;const p=Math.max(0,Math.min(1,age/duration));c.globalAlpha=reduced?.65:1-p*.55;
  if(mark.shape==='circle'){
   if(storm){
    const r=mark.r||30;ring(c,mark.x,mark.y,r*.8,'#d8c989',2);c.fillStyle='#7b7b922c';c.beginPath();c.arc(mark.x,mark.y,r*.7,0,TAU);c.fill();
    if(u.style==='raigo'){c.fillStyle='#273247b3';c.beginPath();c.arc(mark.x,mark.y-r*.18,r*.63,0,TAU);c.fill();ring(c,mark.x,mark.y-r*.18,r*.66,'#c9d4df',2);for(let i=0;i<6;i++){const a=i*TAU/6;stroke(c,[[mark.x+Math.cos(a)*r*.35,mark.y-r*.18+Math.sin(a)*r*.35],[mark.x+Math.cos(a+.18)*r*.6,mark.y-r*.18+Math.sin(a+.18)*r*.6]],'#e3d99d',2);}}
    else stroke(c,[[mark.x-13,mark.y-145],[mark.x+5,mark.y-91],[mark.x-7,mark.y-63],[mark.x+10,mark.y-35],[mark.x,mark.y]],'#e7e2ad',reduced?3:5);
   }else if(ice){
    ring(c,mark.x,mark.y,(mark.r||30)*(.6+p*.35),'#c4e4e9',2);for(let i=0;i<7;i++){const a=i*TAU/7,r=(mark.r||30)*.7,x=mark.x+Math.cos(a)*r,y=mark.y+Math.sin(a)*r*.6,h=reduced?17:12+Math.sin(p*Math.PI)*19;c.fillStyle='#507b98';c.beginPath();c.moveTo(x-6,y);c.lineTo(x,y-h);c.lineTo(x+6,y);c.fill();stroke(c,[[x,y-h+2],[x+2,y-2]],'#e6f6ec',2);}
   }else{
    const r=mark.r||30;c.fillStyle='#1e1a3199';c.beginPath();c.arc(mark.x,mark.y,r*.75,0,TAU);c.fill();ring(c,mark.x,mark.y,r*(reduced?.8:.7+p*.25),'#b16f96',3);ring(c,mark.x,mark.y,r*.35,'#dfb3c3',1.5);for(let i=0;i<6;i++){const a=i*TAU/6+(reduced?0:t*.25);stroke(c,[[mark.x+Math.cos(a)*r*.7,mark.y+Math.sin(a)*r*.7],[mark.x+Math.cos(a+.2)*r*.4,mark.y+Math.sin(a+.2)*r*.4]],'#d19ab3',1);}
   }
  }else if(mark.shape==='line'){
   if(storm){
    const pts=[];for(let i=0;i<=9;i++){const q=i/9,j=i===0||i===9?0:(i%2?8:-8);pts.push([mark.x+(mark.tx-mark.x)*q+j,mark.y+(mark.ty-mark.y)*q-j]);}stroke(c,pts,'#53647c',mark.width*2);stroke(c,pts,'#ddd89e',reduced?3:5);stroke(c,pts,'#f6f2cf',1.5);
   }else if(ice){
    const a=Math.atan2(mark.ty-mark.y,mark.tx-mark.x);for(let i=1;i<9;i++){const q=i/9,x=mark.x+(mark.tx-mark.x)*q,y=mark.y+(mark.ty-mark.y)*q;c.save();c.translate(x,y);c.rotate(a);c.fillStyle='#4e7898';c.beginPath();c.moveTo(-18,-6);c.lineTo(20,0);c.lineTo(-18,7);c.closePath();c.fill();stroke(c,[[-12,-3],[16,0],[-12,3]],'#d5eff0',2);c.restore();}
   }else{stroke(c,[[mark.x,mark.y],[mark.tx,mark.ty]],'#60314b',mark.width*2);stroke(c,[[mark.x,mark.y],[mark.tx,mark.ty]],'#c88da8',4);stroke(c,[[mark.x,mark.y],[mark.tx,mark.ty]],'#f3d2cf',1);}
  }
 }
 c.restore();return true;
}
