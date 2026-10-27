// Maomao's inventory, evolution and ultimate icons on the 32×32 item grid: a corked
// poison vial, a tied bundle of medicinal herbs, the jade gourd of Jade Alchemy, the
// Panacea Pouch and her Panacea Garden (a mortar and pestle sprouting herbs).
export const MAOMAO_ICON_IDS=['poison','herbs','elixir','panaceapouch','panaceagarden'];
const cache=new Map(),INK='#141c1a';
function frame(){
 const p=Array(1024).fill(null),R=(x,y,w,h,c)=>{for(let yy=Math.round(y);yy<y+h;yy++)for(let xx=Math.round(x);xx<x+w;xx++)if(xx>=0&&yy>=0&&xx<32&&yy<32)p[yy*32+xx]=c;};
 const L=(x,y,tx,ty,c,w=1)=>{const n=Math.max(1,Math.abs(tx-x),Math.abs(ty-y));for(let i=0;i<=n;i++)R(x+(tx-x)*i/n,y+(ty-y)*i/n,w,w,c);};
 const E=(x,y,rx,ry,c)=>{for(let yy=0;yy<32;yy++)for(let xx=0;xx<32;xx++)if(((xx+.5-x)/rx)**2+((yy+.5-y)/ry)**2<=1)R(xx,yy,1,1,c);};
 const T=(pts,c)=>{for(let yy=0;yy<32;yy++)for(let xx=0;xx<32;xx++){let inside=false;for(let i=0,j=pts.length-1;i<pts.length;j=i++){const [xi,yi]=pts[i],[xj,yj]=pts[j];if((yi>yy+.5)!==(yj>yy+.5)&&xx+.5<(xj-xi)*(yy+.5-yi)/(yj-yi)+xi)inside=!inside;}if(inside)R(xx,yy,1,1,c);}};
 return {p,R,L,E,T};
}
function leaf(a,x,y,dx,dy,c,v){const {T,L}=a,l=Math.hypot(dx,dy)||1,nx=-dy/l*2.2,ny=dx/l*2.2;T([[x,y],[x+dx*.5+nx,y+dy*.5+ny],[x+dx,y+dy],[x+dx*.5-nx,y+dy*.5-ny]],c);L(x,y,x+dx*.9,y+dy*.9,v);}
export function maomaoIconPixels(id){
 if(!MAOMAO_ICON_IDS.includes(id))return null;if(cache.has(id))return cache.get(id);const a=frame(),{R,L,E,T}=a;
 if(id==='poison'){// A round-bottomed flask of bubbling green poison with a cork and a paper tag.
  E(16,21,10,9,'#2a3a34');E(16,21,8.6,7.6,'#d8f4e6');T([[7,20],[25,20],[24,26],[16,29],[8,26]],'#58c07a');E(16,23,6,4,'#3a9a5a');
  R(12,6,8,9,'#2a3a34');R(13,7,6,9,'#d8f4e6');R(11,3,10,4,'#a87a4a');R(11,6,10,1,'#6a4a2a');R(12,3,4,1,'#d4a870');
  R(10,15,2,6,'#ffffff');R(14,10,1,4,'#ffffff');for(const [x,y]of [[14,18],[19,21],[16,24]])E(x,y,1.2,1.2,'#b8f0c4');
  L(20,8,26,10,'#8a5a3a');R(24,9,5,6,'#efe4c8');R(25,11,3,1,'#8a5a3a');R(25,13,2,1,'#8a5a3a');}
 else if(id==='herbs'){// A bundle of medicinal herbs tied with red cord, one stem in white bloom.
  for(const [x,y,dx,dy]of [[16,24,-9,-12],[16,24,-3,-17],[16,24,4,-16],[16,24,10,-10]])L(x,y,x+dx,y+dy,'#3a7a3a',2);
  leaf(a,10,16,-5,-4,'#6aba5a','#3a7a3a');leaf(a,13,11,-3,-6,'#8ad070','#4a8a3a');leaf(a,19,10,4,-5,'#6aba5a','#3a7a3a');leaf(a,23,16,5,-3,'#8ad070','#4a8a3a');leaf(a,15,18,-6,1,'#4a9a4a','#2a6a2a');leaf(a,18,18,6,1,'#4a9a4a','#2a6a2a');
  for(const [dx,dy]of [[-2,0],[2,0],[0,-2],[0,2]])R(13+dx,6+dy,2,2,'#ffffff');R(13,6,2,2,'#ffe07a');
  R(13,23,6,3,'#c83a3a');R(13,23,6,1,'#f06a5a');L(15,26,12,30,'#c83a3a');L(17,26,20,30,'#c83a3a');
  for(const x of [14,16,18])L(x,26,x+(x-16)*.6,30,'#3a7a3a',2);}
 else if(id==='elixir'){// Jade Alchemy: a jade gourd bottle with a gold stopper and red tassel.
  E(16,16,15,15,'#1a3a32');E(16,16,13,13,'#0e2420');
  E(16,22,8,7,'#1e5a48');E(16,22,6.8,6,'#5ac8a0');E(16,11,5,4.5,'#1e5a48');E(16,11,3.8,3.4,'#5ac8a0');R(14,14,4,3,'#5ac8a0');
  R(13,15,6,1,'#e0b040');R(14,4,4,3,'#e0b040');R(15,3,2,1,'#fff0a8');R(11,19,2,4,'#c8f8e8');R(13,9,1,2,'#c8f8e8');
  L(19,15,23,18,'#c83a3a');R(22,18,3,5,'#c83a3a');R(22,22,3,1,'#f06a5a');for(const [x,y]of [[6,8],[25,6],[7,25]])R(x,y,1,1,'#f0e0a0');}
 else if(id==='panaceapouch'){// A cloth medicine pouch tied shut, herbs sprouting from its mouth.
  for(const [dx,dy]of [[-5,-7],[0,-9],[5,-7]])L(16,10,16+dx,10+dy,'#3a7a3a',2);leaf(a,12,5,-4,-2,'#8ad070','#4a8a3a');leaf(a,20,5,4,-2,'#8ad070','#4a8a3a');leaf(a,16,3,0,-3,'#6aba5a','#3a7a3a');
  T([[10,13],[22,13],[27,22],[25,29],[7,29],[5,22]],'#6a4a2a');T([[11,14],[21,14],[25,22],[23,28],[9,28],[7,22]],'#c8a070');T([[9,22],[14,16],[12,26]],'#e0c090');
  R(10,11,12,3,'#8a6a3a');R(11,11,10,1,'#c8a070');L(21,12,26,16,'#c83a3a');L(21,12,25,9,'#c83a3a');
  E(16,22,3.4,3,'#2a6a2a');E(16,22,2.4,2,'#7ad070');R(15,21,1,1,'#d8ffd0');}
 else{// Panacea Garden: a stone mortar and pestle with healing herbs blooming out of it.
  E(16,16,15,15,'#2a4a30');E(16,16,13,13,'#162a1c');
  for(const [dx,dy]of [[-6,-9],[-1,-12],[5,-10]])L(16,15,16+dx,15+dy,'#3a7a3a',2);leaf(a,11,9,-4,-3,'#8ad070','#4a8a3a');leaf(a,20,8,4,-3,'#6aba5a','#3a7a3a');
  for(const [x,y]of [[10,6],[15,3],[21,5]]){for(const [dx,dy]of [[-1,0],[1,0],[0,-1],[0,1]])R(x+dx,y+dy,1,1,'#ffffff');R(x,y,1,1,'#ffe07a');}
  L(22,6,18,18,'#6a5a4a',3);L(22,6,19,16,'#a8988a');
  T([[6,15],[26,15],[24,25],[20,28],[12,28],[8,25]],'#5a5a5a');T([[7,16],[25,16],[23,24],[19,27],[13,27],[9,24]],'#9a9a94');R(7,15,18,2,'#c4c4bc');L(9,18,11,24,'#c4c4bc');
  R(11,28,10,2,'#5a5a5a');}
 const result=[...a.p];for(let y=0;y<32;y++)for(let x=0;x<32;x++)if(a.p[y*32+x])for(const [dx,dy]of [[1,0],[-1,0],[0,1],[0,-1]]){const xx=x+dx,yy=y+dy;if(xx>=0&&xx<32&&yy>=0&&yy<32&&!a.p[yy*32+xx])result[yy*32+xx]=INK;}
 cache.set(id,result);return result;
}
export function maomaoIcon(id){const p=maomaoIconPixels(id);return p?p.map((c,i)=>c?`<rect x="${i%32+1}" y="${Math.floor(i/32)+1}" width="1" height="1" fill="${c}"/>`:'').join(''):null;}
