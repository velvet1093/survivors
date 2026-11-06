import {shadowPixels} from './jinwoo-shadow-art.js';
import {SHADOW_IDS} from './jinwoo-data.js';
// Jinwoo's icons on the 32×32 item grid: each shadow's own sprite inside a violet frame, the
// Black Heart with glowing veins, Arise's shadows rising from a violet pool, and a symbol
// for each System stat card.
export const JINWOO_ICON_IDS=[...SHADOW_IDS,'blackheart','arise','stat-str','stat-agi','stat-vit','stat-sen','stat-int'];
const cache=new Map(),INK='#08060e',VIOLET='#9a8cff',DEEP='#1a1430',RIM='#5a4aa8';
function frame(){
 const p=Array(1024).fill(null),R=(x,y,w,h,c)=>{for(let yy=Math.round(y);yy<y+h;yy++)for(let xx=Math.round(x);xx<x+w;xx++)if(xx>=0&&yy>=0&&xx<32&&yy<32)p[yy*32+xx]=c;};
 const L=(x,y,tx,ty,c,w=1)=>{const n=Math.max(1,Math.abs(tx-x),Math.abs(ty-y));for(let i=0;i<=n;i++)R(x+(tx-x)*i/n,y+(ty-y)*i/n,w,w,c);};
 const E=(x,y,rx,ry,c)=>{for(let yy=0;yy<32;yy++)for(let xx=0;xx<32;xx++)if(((xx+.5-x)/rx)**2+((yy+.5-y)/ry)**2<=1)R(xx,yy,1,1,c);};
 const T=(pts,c)=>{for(let yy=0;yy<32;yy++)for(let xx=0;xx<32;xx++){let inside=false;for(let i=0,j=pts.length-1;i<pts.length;j=i++){const [xi,yi]=pts[i],[xj,yj]=pts[j];if((yi>yy+.5)!==(yj>yy+.5)&&xx+.5<(xj-xi)*(yy+.5-yi)/(yj-yi)+xi)inside=!inside;}if(inside)R(xx,yy,1,1,c);}};
 return {p,R,L,E,T};
}
// Fit a shadow's sprite into the frame by sampling its bounding box.
function blitShadow(a,kind){
 const px=shadowPixels(kind,{frame:0});let x0=56,y0=76,x1=0,y1=0;
 for(let y=0;y<76;y++)for(let x=0;x<56;x++)if(px[y*56+x]){x0=Math.min(x0,x);y0=Math.min(y0,y);x1=Math.max(x1,x);y1=Math.max(y1,y);}
 const w=x1-x0+1,h=y1-y0+1,s=Math.max(w,h)/26;
 for(let y=0;y<32;y++)for(let x=0;x<32;x++){const sx=Math.floor(x0+(x-16)*s+w/2),sy=Math.floor(y0+(y-16)*s+h/2);if(sx>=x0&&sx<=x1&&sy>=y0&&sy<=y1){const c=px[sy*56+sx];if(c)a.R(x,y,1,1,c);}}
}
function frameRing(a,glow=VIOLET){a.E(16,16,15.5,15.5,RIM);a.E(16,16,14.6,14.6,'#4a3c8a');a.E(16,13,12,9,'#6a5ab0');a.E(16,27,12,4,'#2a2050');for(const [x,y]of [[4,8],[27,6],[6,25],[26,24]])a.R(x,y,1,1,glow);}
export function jinwooIconPixels(id){
 if(!JINWOO_ICON_IDS.includes(id))return null;if(cache.has(id))return cache.get(id);const a=frame(),{R,L,E,T}=a;
 if(SHADOW_IDS.includes(id)){frameRing(a);blitShadow(a,'shadow-'+id);}
 else if(id==='blackheart'){// Black Heart: a black heart pulsing with violet veins.
  E(11,12,7,7,RIM);E(21,12,7,7,RIM);T([[4,14],[28,14],[16,28]],RIM);E(11,12,6,6,'#120e1c');E(21,12,6,6,'#120e1c');T([[5.5,14],[26.5,14],[16,26.5]],'#120e1c');
  L(16,10,16,22,VIOLET);L(16,15,10,11,VIOLET);L(16,17,22,12,VIOLET);L(12,18,9,16,'#6a5ab8');L(20,19,23,16,'#6a5ab8');R(9,8,3,2,'#3a3460');E(16,16,1.6,1.6,'#e0d8ff');}
 else if(id==='arise'){// Arise: shadows with glowing eyes rise from a violet pool.
  E(16,16,15.5,15.5,RIM);E(16,16,14.5,14.5,'#3a2c70');E(16,12,12,9,'#5a4aa0');E(16,27,14,4.5,'#7a6ad8');E(16,27.5,12.5,3.6,'#1a1430');
  for(let i=0;i<7;i++){const x=5+i*3.6;L(x,26,x+(i%2?1:-1),20-(i%3)*3,i%2?'#5a4aa8':'#7a6ad8');}
  for(const [x,top,big]of [[8,14,0],[24,14,0],[16,8,1]]){const hr=big?3.4:2.6;T([[x-hr-1,top+hr*2],[x+hr+1,top+hr*2],[x+hr+2.5,28],[x-hr-2.5,28]],'#000000');E(x,top+hr,hr+.6,hr+.6,'#000000');T([[x-hr,top+hr*2],[x+hr,top+hr*2],[x+hr+1.5,27],[x-hr-1.5,27]],'#2a2448');E(x,top+hr,hr,hr,'#2a2448');R(x-hr*.6,top+hr*.8,1,1,'#e0d8ff');R(x+hr*.4,top+hr*.8,1,1,'#e0d8ff');}}
 else{// System stat cards: a framed symbol in each stat's colour.
  const col={'stat-str':'#e07a6a','stat-agi':'#7ad8a8','stat-vit':'#e0b05a','stat-sen':'#7ab8e8','stat-int':'#b08ae8'}[id];
  T([[16,1],[29,8.5],[29,23.5],[16,31],[3,23.5],[3,8.5]],col);T([[16,3],[27,9.5],[27,22.5],[16,29],[5,22.5],[5,9.5]],'#121624');
  if(id==='stat-str'){L(9,23,22,10,'#e0e4f0',2);L(20,8,24,12,col,2);L(10,20,13,23,col,2);}
  else if(id==='stat-agi'){T([[8,22],[24,8],[20,16],[26,18],[10,24]],col);L(10,21,22,10,'#ffffff');}
  else if(id==='stat-vit'){E(12,13,4.5,4.5,col);E(20,13,4.5,4.5,col);T([[7.5,14],[24.5,14],[16,24]],col);R(10,10,2,2,'#ffffff');}
  else if(id==='stat-sen'){E(16,16,10,5.5,col);E(16,16,8,4,'#121624');E(16,16,3.4,3.4,col);E(16,16,1.6,1.6,'#121624');R(17,14,1,1,'#ffffff');}
  else{for(let i=0;i<5;i++){const t=i*Math.PI*2/5-Math.PI/2,u=t+Math.PI/5;T([[16,16],[16+Math.cos(t)*10,16+Math.sin(t)*10],[16+Math.cos(u)*4,16+Math.sin(u)*4]],col);T([[16,16],[16+Math.cos(u)*4,16+Math.sin(u)*4],[16+Math.cos(t+Math.PI*2/5)*10,16+Math.sin(t+Math.PI*2/5)*10]],col);}E(16,16,2,2,'#ffffff');}
  R(8,26,16,1,col);}
 const result=[...a.p];for(let y=0;y<32;y++)for(let x=0;x<32;x++)if(a.p[y*32+x])for(const [dx,dy]of [[1,0],[-1,0],[0,1],[0,-1]]){const xx=x+dx,yy=y+dy;if(xx>=0&&xx<32&&yy>=0&&yy<32&&!a.p[yy*32+xx])result[yy*32+xx]=INK;}
 cache.set(id,result);return result;
}
export function jinwooIcon(id){const p=jinwooIconPixels(id);return p?p.map((c,i)=>c?`<rect x="${i%32+1}" y="${Math.floor(i/32)+1}" width="1" height="1" fill="${c}"/>`:'').join(''):null;}
