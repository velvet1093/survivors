export const FEATHERINE_ITEM_IDS=['quill','memoryfragment','finalchapter','lastpage'];
const cache=new Map(),INK='#30313f';
export function featherineItemPixels(id){
 if(!FEATHERINE_ITEM_IDS.includes(id))return null;if(cache.has(id))return cache.get(id);
 const p=Array(32*32).fill(null),put=(x,y,c)=>{x=Math.round(x);y=Math.round(y);if(x>=0&&x<32&&y>=0&&y<32)p[y*32+x]=c;},R=(x,y,w,h,c)=>{for(let yy=Math.round(y);yy<Math.round(y+h);yy++)for(let xx=Math.round(x);xx<Math.round(x+w);xx++)put(xx,yy,c);},L=(x,y,tx,ty,c,w=1)=>{const n=Math.max(Math.abs(tx-x),Math.abs(ty-y),1);for(let i=0;i<=n;i++)R(x+(tx-x)*i/n,y+(ty-y)*i/n,w,w,c);},P=(points,c)=>{for(let y=0;y<32;y++)for(let x=0;x<32;x++){let inside=false;for(let i=0,j=points.length-1;i<points.length;j=i++){const a=points[i],b=points[j];if((a[1]>y+.5)!==(b[1]>y+.5)&&x+.5<(b[0]-a[0])*(y+.5-a[1])/(b[1]-a[1])+a[0])inside=!inside;}if(inside)put(x,y,c);}},star=(x,y,c)=>{L(x-2,y,x+2,y,c);L(x,y-2,x,y+2,c);};
 if(id==='quill'){
  P([[7,27],[8,22],[12,17],[12,11],[17,6],[24,2],[29,2],[28,9],[25,16],[20,19],[14,20],[10,27]],'#5e4772');
  P([[10,23],[13,17],[14,12],[18,8],[25,4],[27,4],[25,10],[22,15],[17,18]],'#aa87bd');
  P([[13,17],[15,12],[20,8],[25,5],[24,10],[20,13]],'#dcc7df');L(7,28,25,7,'#f2e2c7',2);L(13,21,18,20,'#c7b198');
  R(3,26,8,4,'#493f63');R(4,25,6,2,'#8d679e');R(5,27,4,1,'#c9a3cb');star(5,8,'#d7c38d');
 }else if(id==='memoryfragment'){
  P([[4,12],[6,7],[13,4],[22,4],[28,8],[30,14],[27,20],[22,22],[20,19],[25,17],[26,13],[24,10],[20,8],[13,8],[8,11],[8,15],[12,18],[10,22],[5,19],[2,15]],'#6a7479');
  P([[5,12],[8,8],[14,5],[21,5],[26,8],[28,13],[25,18],[22,20],[22,18],[26,15],[25,11],[21,7],[13,7],[7,10],[6,14],[9,18],[8,20],[4,16]],'#c7d3c7');L(10,7,17,5,'#f4eed5');L(22,6,26,9,'#f4eed5');
  P([[13,15],[19,13],[23,18],[20,27],[14,29],[10,23]],'#557b63');P([[15,16],[19,15],[21,19],[18,26],[14,26],[12,22]],'#9cbd7e');P([[16,17],[19,19],[17,24],[14,23]],'#d9c38e');star(27,27,'#d4b0db');
 }else if(id==='finalchapter'){
  P([[3,10],[10,6],[16,9],[24,5],[29,9],[29,26],[21,28],[16,25],[10,28],[3,25]],'#715879');
  P([[5,10],[10,8],[15,11],[15,24],[10,25],[5,23]],'#ead8bc');P([[17,11],[24,8],[27,10],[27,23],[21,25],[17,23]],'#c7d3b6');L(16,10,16,25,'#c3a565',2);
  for(const y of [13,17,21]){L(7,y,12,y+1,'#aa86a2');L(19,y,24,y-1,'#78958a');}
  P([[16,6],[21,2],[26,2],[24,7],[20,11],[17,11]],'#a58ab9');L(13,14,24,4,'#eee7d2');star(5,4,'#e9cd89');star(28,28,'#ead6ac');
 }else{
  // A dark fragment is framed by the authorial ring, with luminous turning pages.
  P([[4,8],[11,3],[22,3],[29,9],[28,21],[23,28],[11,29],[3,23]],'#594569');P([[7,9],[12,6],[21,6],[26,11],[25,21],[20,25],[12,25],[7,21]],'#2c3448');
  P([[12,9],[22,8],[23,21],[16,24],[11,20]],'#f2e1c5');P([[10,12],[16,15],[15,26],[7,22],[6,16]],'#a3c68c');L(15,15,15,24,'#d7c18a');L(17,13,20,12,'#a67b9f');L(17,17,20,16,'#a67b9f');L(8,9,12,5,'#dfc398',2);L(24,7,28,11,'#bba2c9',2);star(25,25,'#f5dfab');
 }
 const out=[...p];for(let y=0;y<32;y++)for(let x=0;x<32;x++)if(p[y*32+x])for(const [dx,dy]of [[-1,0],[1,0],[0,-1],[0,1]]){const xx=x+dx,yy=y+dy;if(xx>=0&&xx<32&&yy>=0&&yy<32&&!p[yy*32+xx])out[yy*32+xx]=INK;}
 cache.set(id,out);return out;
}
