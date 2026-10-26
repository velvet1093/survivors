export const EVENT_TRIGGER_ART_IDS=['beherit','raigodrum','frostseal','hollowlantern','tombkey'];
const cache=new Map(),INK='#293145';
export function eventTriggerPixels(id){
 if(!EVENT_TRIGGER_ART_IDS.includes(id))return null;if(cache.has(id))return [...cache.get(id)];
 const pixels=Array(32*32).fill(null);
 const R=(x,y,w,h,color)=>{for(let yy=Math.round(y);yy<Math.round(y+h);yy++)for(let xx=Math.round(x);xx<Math.round(x+w);xx++)if(xx>=0&&xx<32&&yy>=0&&yy<32)pixels[yy*32+xx]=color;};
 const L=(x,y,tx,ty,color,width=1)=>{const n=Math.max(Math.abs(tx-x),Math.abs(ty-y),1);for(let i=0;i<=n;i++)R(x+(tx-x)*i/n,y+(ty-y)*i/n,width,width,color);};
 const P=(points,color)=>{for(let y=0;y<32;y++)for(let x=0;x<32;x++){let inside=false;for(let i=0,j=points.length-1;i<points.length;j=i++){const a=points[i],b=points[j];if((a[1]>y+.5)!==(b[1]>y+.5)&&x+.5<(b[0]-a[0])*(y+.5-a[1])/(b[1]-a[1])+a[0])inside=!inside;}if(inside)R(x,y,1,1,color);}};
 const E=(x,y,rx,ry,color)=>{for(let yy=0;yy<32;yy++)for(let xx=0;xx<32;xx++)if(((xx+.5-x)/rx)**2+((yy+.5-y)/ry)**2<=1)R(xx,yy,1,1,color);};
 if(id==='hollowlantern'){
  // A small iron lantern holds a pale Hollow, with Perona's pink bow.
  E(16,7,7,6,'#768d88');E(16,7,4,3,'#d9ddbd');R(11,5,10,7,'#1f303b');
  P([[8,11],[24,11],[27,16],[25,27],[21,30],[11,30],[7,27],[5,16]],'#50656d');
  P([[9,14],[23,14],[24,17],[22,26],[10,26],[8,17]],'#4b8c86');E(16,20,7,7,'#9ecdb5');
  P([[11,17],[13,14],[19,14],[22,18],[21,24],[18,23],[16,26],[14,23],[11,25]],'#e8ead4');
  R(13,18,2,3,'#3c5665');R(18,18,2,3,'#3c5665');R(16,22,2,2,'#718c87');
  R(6,12,20,3,'#bd9a73');R(9,27,14,3,'#bd9a73');R(6,16,2,10,'#a0b2a5');R(24,16,2,10,'#a0b2a5');
  P([[15,9],[9,6],[8,11],[14,12]],'#d497b3');P([[17,9],[23,6],[24,11],[18,12]],'#d497b3');R(15,9,3,3,'#f0c7d6');
 }else if(id==='tombkey'){
  // A jeweled skull bow, gold shaft and distinct ward teeth.
  E(12,10,10,9,'#775e65');E(12,9,8,7,'#c4a471');E(12,9,6,5,'#e9d6a7');
  P([[7,7],[10,4],[15,5],[18,8],[17,12],[15,14],[9,14],[6,11]],'#b5a487');
  R(8,8,3,3,'#4c405b');R(14,8,3,3,'#4c405b');P([[12,10],[10,13],[14,13]],'#725b70');
  P([[11,2],[13,0],[16,2],[15,5],[12,6],[10,4]],'#a294c4');R(12,2,2,2,'#d9cbeb');
  P([[16,14],[19,12],[30,25],[29,29],[25,30]],'#775e65');L(17,15,27,27,'#dfbd7d',4);L(17,14,28,26,'#f1d9a2',1);
  P([[22,23],[18,27],[21,30],[24,26]],'#b69668');P([[26,25],[22,29],[25,31],[29,28]],'#d7b57b');R(19,17,2,2,'#fff0c9');
 }else if(id==='beherit'){
  // Uneven facial fragments sit inside a blood-red egg, not a normal jewel.
  E(16,18,11,13,'#713e55');E(15,17,9,12,'#a14f65');E(14,16,7,10,'#c36d78');P([[9,10],[14,5],[20,7],[23,12],[18,10],[15,12]],'#d99294');
  R(14,1,5,3,'#8f8b89');R(15,1,3,1,'#d5c7aa');R(15,3,3,3,'#655968');R(16,4,1,3,'#c8ac9b');
  P([[8,14],[11,11],[14,13],[14,16],[10,17]],'#e1c2ad');R(10,13,2,3,'#725461');R(10,13,1,1,'#fff0d4');L(9,16,13,15,'#734853');
  P([[19,18],[23,17],[25,20],[23,23],[19,22]],'#dfbda8');R(21,19,2,3,'#6e4d59');R(21,19,1,1,'#fff0d4');L(20,22,23,21,'#a66e70');
  P([[16,12],[18,14],[17,20],[14,21],[15,17]],'#7c4357');L(16,14,16,18,'#e4a19a');R(15,20,3,1,'#c38984');
  P([[10,23],[14,22],[17,25],[15,28],[11,27]],'#66384d');L(11,24,14,24,'#e4b6a0');L(12,27,15,27,'#cc8b87');R(8,19,2,3,'#e3a19a');R(23,11,1,3,'#d48b91');
 }else if(id==='raigodrum'){
  // Gold-laced drum skin and a little forked lightning crest.
  P([[6,11],[12,7],[23,8],[28,13],[27,25],[20,29],[9,28],[4,23]],'#795b48');P([[7,13],[13,10],[23,11],[25,15],[24,24],[19,27],[10,25],[7,22]],'#b98c55');
  for(const [x,y]of [[7,14],[10,25],[24,15],[22,25]]){R(x,y,2,5,'#e3bd78');L(x,y,x+3,y+3,'#f3d59a');}
  E(17,13,11,8,'#ddbf7d');E(17,12,9,6,'#f0dca4');E(17,12,7,4,'#d5bc89');L(10,7,14,6,'#fff0c5');
  for(const [x,y]of [[13,11],[19,10],[20,14]]){E(x,y,2,2,'#715a53');R(x-1,y-2,1,2,'#715a53');}
  P([[17,0],[12,8],[17,7],[14,15],[23,5],[18,6],[21,0]],'#678ca8');P([[18,1],[15,6],[19,5],[17,11],[21,6],[18,7],[20,1]],'#b9e4e6');
  L(5,6,2,3,'#e7ce8e',2);L(28,9,31,7,'#e7ce8e',1);R(29,3,2,2,'#b8dcdf');
 }else{
  // A translucent hexagonal ice seal, snowflake and dangling blue cord.
  P([[9,4],[22,4],[29,15],[23,26],[9,26],[3,15]],'#4b718c');P([[10,6],[21,6],[27,15],[21,24],[10,24],[5,15]],'#84b7c9');P([[11,8],[19,7],[24,15],[19,22],[11,21],[8,15]],'#b6dce1');
  P([[10,6],[15,6],[11,13],[6,15]],'#e1f2e8');P([[20,10],[25,15],[21,22],[17,23],[20,17]],'#659cb5');
  L(16,9,16,21,'#f0f6e6');L(10,12,22,18,'#f0f6e6');L(10,18,22,12,'#f0f6e6');
  L(13,10,16,12,'#f0f6e6');L(16,12,19,10,'#f0f6e6');L(12,19,14,17,'#f0f6e6');L(19,19,18,17,'#f0f6e6');R(15,14,3,3,'#fff9e2');
  R(14,25,4,3,'#5d8ea7');L(15,27,11,30,'#7baec2',2);L(17,27,21,30,'#7baec2',2);R(10,29,3,2,'#c1e1de');R(20,29,3,2,'#c1e1de');
 }
 const outlined=[...pixels];for(let y=0;y<32;y++)for(let x=0;x<32;x++)if(pixels[y*32+x])for(const [dx,dy]of [[1,0],[-1,0],[0,1],[0,-1]]){const nx=x+dx,ny=y+dy;if(nx>=0&&nx<32&&ny>=0&&ny<32&&!pixels[ny*32+nx])outlined[ny*32+nx]=INK;}
 cache.set(id,outlined);return [...outlined];
}
