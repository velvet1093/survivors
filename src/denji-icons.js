export const DENJI_ICON_IDS=['chainsaw','bloodengine','chainsawoverdrive','chainsawman'];
const cache=new Map(),INK='#25303d';
export function denjiIconPixels(id){
 if(!DENJI_ICON_IDS.includes(id))return null;if(cache.has(id))return cache.get(id);
 const p=Array(1024).fill(null),R=(x,y,w,h,c)=>{for(let yy=Math.round(y);yy<y+h;yy++)for(let xx=Math.round(x);xx<x+w;xx++)if(xx>=0&&yy>=0&&xx<32&&yy<32)p[yy*32+xx]=c;},L=(x,y,tx,ty,c,w=1)=>{const n=Math.max(Math.abs(tx-x),Math.abs(ty-y),1);for(let i=0;i<=n;i++)R(Math.round(x+(tx-x)*i/n),Math.round(y+(ty-y)*i/n),w,w,c);},P=(ps,c)=>{for(let y=0;y<32;y++)for(let x=0;x<32;x++){let inside=false;for(let i=0,j=ps.length-1;i<ps.length;j=i++){const a=ps[i],b=ps[j];if((a[1]>y+.5)!==(b[1]>y+.5)&&x+.5<(b[0]-a[0])*(y+.5-a[1])/(b[1]-a[1])+a[0])inside=!inside;}if(inside)R(x,y,1,1,c);}};
 if(id==='bloodengine'){
  P([[16,2],[27,9],[29,21],[22,30],[10,30],[3,21],[5,9]],'#6d3f48');P([[16,4],[25,10],[27,20],[21,28],[11,28],[5,20],[7,10]],'#a75858');
  P([[11,12],[16,7],[21,12],[24,19],[21,24],[15,26],[9,23],[7,18]],'#d99470');P([[14,13],[17,10],[20,14],[21,19],[18,22],[13,22],[11,18]],'#edbf8d');
  L(15,3,15,11,INK,3);P([[11,12],[20,12],[22,17],[18,21],[12,20],[9,16]],INK);P([[12,14],[18,14],[19,16],[17,18],[13,18],[11,16]],'#ddae73');R(15,14,2,3,'#815644');L(6,25,10,22,'#f1c895');L(24,24,28,28,'#f1c895');
 }else if(id==='chainsawman'){
  P([[5,9],[10,5],[23,5],[28,10],[27,22],[21,29],[10,28],[4,20]],INK);P([[7,10],[11,7],[22,7],[25,11],[24,18],[9,20],[6,17]],'#a75839');P([[9,10],[14,8],[21,9],[24,12],[21,16],[9,17]],'#df9250');L(11,9,19,9,'#f2c37b');L(10,5,9,1,INK,3);
  P([[15,11],[29,8],[32,11],[30,15],[15,16]],'#a4b7bb');L(17,12,29,11,'#e8edd5');for(const x of [18,22,26,30]){L(x,9,x+1,7,'#e2e3d0');L(x,15,x+1,18,'#e2e3d0');}R(16,13,13,1,'#566a78');
  P([[7,20],[25,18],[23,25],[18,29],[10,26]],'#614139');for(const x of [9,13,17,21])P([[x,20],[x+3,20],[x+1,24]],'#f0e7c9');for(const x of [12,16,20])P([[x,27],[x+1,23],[x+3,26]],'#b7c6c1');R(6,12,2,4,'#edbb70');
 }else{
  if(id==='chainsawoverdrive'){P([[5,3],[21,2],[29,9],[31,23],[22,31],[6,28],[1,18]],'#75424b');L(4,6,9,3,'#f3b779');L(25,28,29,22,'#e7bb7e');}
  P([[10,21],[22,3],[27,1],[31,5],[29,10],[17,27]],INK);P([[13,21],[24,5],[27,4],[29,6],[27,10],[17,24]],'#aabcc0');L(15,21,27,5,'#edf0d3',2);L(17,23,27,9,'#5b7180');
  for(const [x,y]of [[12,18],[15,14],[18,10],[21,6]]){P([[x,y],[x-3,y-1],[x,y-4]],'#e0e5cf');P([[x+6,y+3],[x+9,y+5],[x+8,y]],'#e0e5cf');}
  P([[4,19],[12,17],[19,23],[18,29],[11,32],[2,28],[0,23]],INK);P([[4,21],[11,19],[16,24],[15,28],[10,29],[3,26]],'#c77b43');L(5,21,10,20,'#efbe79',2);R(5,24,5,2,'#85523d');L(3,18,8,13,INK,3);L(8,13,13,17,INK,3);L(2,29,6,31,'#ddb87f');
  if(id==='chainsawoverdrive'){L(21,16,29,23,'#efc17c');L(28,17,22,24,'#f9e1a6');}
 }
 const result=[...p];for(let y=0;y<32;y++)for(let x=0;x<32;x++)if(p[y*32+x])for(const[dx,dy]of[[1,0],[-1,0],[0,1],[0,-1]]){const xx=x+dx,yy=y+dy;if(xx>=0&&xx<32&&yy>=0&&yy<32&&!p[yy*32+xx])result[yy*32+xx]=INK;}
 cache.set(id,result);return result;
}
export function denjiIcon(id){const p=denjiIconPixels(id);return p?p.map((c,i)=>c?`<rect x="${i%32+1}" y="${Math.floor(i/32)+1}" width="1" height="1" fill="${c}"/>`:'').join(''):null;}
