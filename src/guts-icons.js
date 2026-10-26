export const GUTS_ICON_IDS=['dragonslayer','brand','berserkeredge','berserkerarmor'];
const cache=new Map(),INK='#26303d';
export function gutsIconPixels(id){
 if(!GUTS_ICON_IDS.includes(id))return null;if(cache.has(id))return cache.get(id);
 const pixels=Array(32*32).fill(null),put=(x,y,c)=>{x=Math.round(x);y=Math.round(y);if(x>=0&&x<32&&y>=0&&y<32)pixels[y*32+x]=c;},R=(x,y,w,h,c)=>{for(let yy=y;yy<y+h;yy++)for(let xx=x;xx<x+w;xx++)put(xx,yy,c);},L=(x,y,tx,ty,c,w=1)=>{const n=Math.max(Math.abs(tx-x),Math.abs(ty-y),1);for(let i=0;i<=n;i++)R(Math.round(x+(tx-x)*i/n),Math.round(y+(ty-y)*i/n),w,w,c);},P=(points,c)=>{for(let y=0;y<32;y++)for(let x=0;x<32;x++){let inside=false;for(let i=0,j=points.length-1;i<points.length;j=i++){const a=points[i],b=points[j];if((a[1]>y+.5)!==(b[1]>y+.5)&&x+.5<(b[0]-a[0])*(y+.5-a[1])/(b[1]-a[1])+a[0])inside=!inside;}if(inside)put(x,y,c);}};
 if(id==='brand'){
  P([[9,3],[23,3],[28,9],[28,23],[23,29],[9,29],[4,23],[4,9]],'#49313f');
  L(16,5,16,27,'#df9a8a',2);L(8,5,13,10,'#b95f66',2);L(13,10,8,15,'#db827c',2);L(8,15,16,21,'#df9a8a',2);L(16,21,24,15,'#df9a8a',2);L(24,15,19,10,'#db827c',2);L(19,10,24,5,'#b95f66',2);L(8,21,16,28,'#df9a8a',2);L(16,28,24,21,'#df9a8a',2);R(16,9,1,10,'#f4c5ac');
 }else if(id==='berserkerarmor'){
  P([[5,13],[3,2],[11,8],[16,5],[22,8],[28,3],[27,16],[30,21],[25,28],[17,31],[8,28],[4,23]],INK);
  P([[7,13],[6,7],[12,11],[17,8],[21,11],[25,8],[24,17],[27,21],[23,26],[17,28],[10,26],[7,21]],'#4d5663');
  P([[8,12],[13,11],[15,17],[10,18]],'#7d8790');P([[18,10],[22,13],[22,17],[17,16]],'#67717f');
  P([[6,19],[14,20],[23,16],[27,20],[23,24],[16,23],[10,25]],'#1c2635');L(11,20,21,19,'#ce726d',2);R(17,19,5,1,'#ffe0ad');P([[11,26],[17,27],[24,23],[22,28],[17,30]],'#8b969a');L(12,26,18,27,'#c4c9ba');
 }else{
  if(id==='berserkeredge'){P([[6,28],[3,19],[9,7],[23,2],[30,10],[28,22],[19,30]],'#70414d');L(6,20,8,26,'#d8867d');L(23,4,29,10,'#e9ac89');}
  P([[9,22],[20,4],[26,1],[31,5],[27,14],[16,27]],'#71858e');P([[12,21],[22,5],[26,3],[28,6],[25,14],[16,24]],'#bdc8c5');L(15,18,25,4,'#f1ecd6',2);L(16,24,25,13,'#8b9fa6');
  L(7,21,18,27,INK,4);L(8,21,18,26,'#c6ae7d',2);L(11,25,6,31,'#75513e',4);L(10,27,8,29,'#c99e6b');R(3,29,5,3,'#b69b6e');
  if(id==='berserkeredge'){L(21,11,19,17,'#ae6468');L(19,17,21,17,'#e2a092');}
 }
 const outlined=[...pixels];for(let y=0;y<32;y++)for(let x=0;x<32;x++)if(pixels[y*32+x])for(const[dx,dy]of[[-1,0],[1,0],[0,-1],[0,1]]){const xx=x+dx,yy=y+dy;if(xx>=0&&xx<32&&yy>=0&&yy<32&&!pixels[yy*32+xx])outlined[yy*32+xx]=INK;}
 cache.set(id,outlined);return outlined;
}
export function gutsIcon(id){const pixels=gutsIconPixels(id);return pixels?pixels.map((color,i)=>color?`<rect x="${i%32+1}" y="${Math.floor(i/32)+1}" width="1" height="1" fill="${color}"/>`:'').join(''):null;}
