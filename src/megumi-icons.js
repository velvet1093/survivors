// Megumi's inventory, evolution and ultimate icons on the 32×32 item grid: the two
// Divine Dogs, Nue, the Ten Shadows talisman, Totality, Storm Nue, the Chimera
// Shadow Garden and Mahoraga's Dharma wheel.
import {divineDogPixels} from './megumi-shikigami-art.js';
import {summonPixels} from './summon-art.js';
export const MEGUMI_ICON_IDS=['shadows','nue','talisman','totality','stormnue','chimeragarden','mahoraga'];
const cache=new Map(),INK='#10131e';
function frame(){
 const p=Array(1024).fill(null),R=(x,y,w,h,c)=>{for(let yy=Math.round(y);yy<y+h;yy++)for(let xx=Math.round(x);xx<x+w;xx++)if(xx>=0&&yy>=0&&xx<32&&yy<32)p[yy*32+xx]=c;};
 const L=(x,y,tx,ty,c,w=1)=>{const n=Math.max(1,Math.abs(tx-x),Math.abs(ty-y));for(let i=0;i<=n;i++)R(x+(tx-x)*i/n,y+(ty-y)*i/n,w,w,c);};
 const E=(x,y,rx,ry,c)=>{for(let yy=0;yy<32;yy++)for(let xx=0;xx<32;xx++)if(((xx+.5-x)/rx)**2+((yy+.5-y)/ry)**2<=1)R(xx,yy,1,1,c);};
 const T=(pts,c)=>{for(let yy=0;yy<32;yy++)for(let xx=0;xx<32;xx++){let inside=false;for(let i=0,j=pts.length-1;i<pts.length;j=i++){const [xi,yi]=pts[i],[xj,yj]=pts[j];if((yi>yy+.5)!==(yj>yy+.5)&&xx+.5<(xj-xi)*(yy+.5-yi)/(yj-yi)+xi)inside=!inside;}if(inside)R(xx,yy,1,1,c);}};
 return {p,R,L,E,T};
}
function nueBird(a,x,y,s,wing,storm){const {T,E,R,L}=a,X=d=>x+d*s,Y=d=>y+d*s;
 for(const side of [-1,1])T([[X(side*2),Y(-2)],[X(side*14),Y(-9)],[X(side*13),Y(-3)],[X(side*10),Y(1)],[X(side*11),Y(5)],[X(side*4),Y(5)]],wing);
 for(const side of [-1,1]){L(X(side*4),Y(1),X(side*12),Y(-6),'#9a86b8');if(storm)L(X(side*5),Y(3),X(side*9),Y(-1),'#cfe2ff'),L(X(side*9),Y(-1),X(side*12),Y(-7),'#ffffff');}
 E(x,Y(5),4*s,6*s,'#3a2e4c');T([[X(-4),Y(-3)],[X(-5),Y(-8)],[X(-2),Y(-4)],[X(2),Y(-4)],[X(5),Y(-8)],[X(4),Y(-3)],[X(3),Y(2)],[x,Y(4)],[X(-3),Y(2)]],'#f2ead8');
 R(X(-3),Y(-2),2,2,storm?'#8fbaff':'#2a1622');R(X(1.5),Y(-2),2,2,storm?'#8fbaff':'#2a1622');R(x-.5,Y(1),2,2,'#d4a050');
 for(const dx of [-2,2])L(X(dx),Y(10),X(dx),Y(12),'#d8b060');}
// Copies a region of a 56×76 summon sprite onto the icon grid so icons match the shikigami.
// step>1 samples every step-th pixel to shrink a large sprite; mask keeps only pixels inside a badge.
function blit(a,pixels,sx,sy,w,h,dx,dy,{step=1,mask}={}){for(let y=0;y<h;y++)for(let x=0;x<w;x++){const c=pixels[(sy+y*step)*56+sx+x*step],X=dx+x,Y=dy+y;if(c&&X>=0&&X<32&&Y>=0&&Y<32&&(!mask||mask(X,Y)))a.p[Y*32+X]=c;}}
function ringBadge(a,c1,c2){const {E}=a;E(16,16,15,15,c1);E(16,16,13,13,c2);}
export function megumiIconPixels(id){
 if(!MEGUMI_ICON_IDS.includes(id))return null;if(cache.has(id))return cache.get(id);const a=frame(),{E,R,L,T}=a;
 if(id==='shadows'){E(16,28,15,3.5,'#07090f');E(16,28,11,2.4,'#1c2440');blit(a,divineDogPixels('blackDog'),34,25,22,28,10,0);blit(a,divineDogPixels('whiteDog'),34,25,22,28,-1,5);}
 else if(id==='nue'){E(16,29,10,2.5,'#07090f');nueBird(a,16,14,1,'#4a3a5c',false);}
 else if(id==='talisman'){// A paper ofuda inked with the Ten Shadows dog sign.
  R(9,3,14,26,'#d8cba8');R(10,4,12,24,'#f4ecd4');R(9,3,14,2,'#b03a3a');R(9,27,14,2,'#b03a3a');
  T([[12,18],[12,11],[14,14],[18,14],[20,11],[20,18],[16,21]],'#1c2232');R(14,15,1,1,'#f4ecd4');R(18,15,1,1,'#f4ecd4');
  for(const y of [7,24])L(12,y,20,y,'#5a5048');}
 else if(id==='totality'){ringBadge(a,'#2c3448','#8e9cbc');E(16,16,10,10,'#a8b4cc');blit(a,divineDogPixels('blackDog',{fused:true,attack:true}),24,24,32,32,-1,3,{mask:(x,y)=>(x+.5-16)**2+(y+.5-16)**2<=13*13});}
 else if(id==='stormnue'){ringBadge(a,'#2a2450','#12102a');nueBird(a,16,15,1,'#4a3e72',true);L(16,24,13,28,'#ffe08a',2);L(13,28,17,30,'#ffe08a',2);}
 else if(id==='chimeragarden'){// The garden: a pool of shadow with both dogs and Nue surfacing.
  nueBird(a,16,8,.6,'#4a3a5c',false);E(16,25,15,7,'#05070d');E(16,25,12,5,'#141b30');E(16,25,7,3,'#1d2744');
  for(let i=0;i<10;i++){const t=i*Math.PI/5;R(16+Math.cos(t)*13,25+Math.sin(t)*6,1,1,'#7d92c8');}
  blit(a,divineDogPixels('blackDog'),36,26,20,20,12,6);blit(a,divineDogPixels('whiteDog'),36,26,20,20,-2,8);E(16,29,13,3,'#05070d');}
 else{// Mahoraga: its Dharma wheel and covered eyes, cropped from the summon sprite.
  blit(a,summonPixels('mahoraga'),0,0,28,32,2,0,{step:2});}
 const result=[...a.p];for(let y=0;y<32;y++)for(let x=0;x<32;x++)if(a.p[y*32+x])for(const [dx,dy]of [[1,0],[-1,0],[0,1],[0,-1]]){const xx=x+dx,yy=y+dy;if(xx>=0&&xx<32&&yy>=0&&yy<32&&!a.p[yy*32+xx])result[yy*32+xx]=INK;}
 cache.set(id,result);return result;
}
export function megumiIcon(id){const p=megumiIconPixels(id);return p?p.map((c,i)=>c?`<rect x="${i%32+1}" y="${Math.floor(i/32)+1}" width="1" height="1" fill="${c}"/>`:'').join(''):null;}
