// Shinji's inventory, evolution and ultimate icons on the 32×32 item grid: the Pallet
// Rifle, the AT Field's orange octagons, the Spear of Longinus and berserk Unit-01.
export const EVA_ICON_IDS=['pallet','atfield','positron','berserk'];
const cache=new Map(),INK='#12121a';
function frame(){
 const p=Array(1024).fill(null),R=(x,y,w,h,c)=>{for(let yy=Math.round(y);yy<y+h;yy++)for(let xx=Math.round(x);xx<x+w;xx++)if(xx>=0&&yy>=0&&xx<32&&yy<32)p[yy*32+xx]=c;};
 const L=(x,y,tx,ty,c,w=1)=>{const n=Math.max(1,Math.abs(tx-x),Math.abs(ty-y));for(let i=0;i<=n;i++)R(x+(tx-x)*i/n,y+(ty-y)*i/n,w,w,c);};
 const E=(x,y,rx,ry,c)=>{for(let yy=0;yy<32;yy++)for(let xx=0;xx<32;xx++)if(((xx+.5-x)/rx)**2+((yy+.5-y)/ry)**2<=1)R(xx,yy,1,1,c);};
 const T=(pts,c)=>{for(let yy=0;yy<32;yy++)for(let xx=0;xx<32;xx++){let inside=false;for(let i=0,j=pts.length-1;i<pts.length;j=i++){const [xi,yi]=pts[i],[xj,yj]=pts[j];if((yi>yy+.5)!==(yj>yy+.5)&&xx+.5<(xj-xi)*(yy+.5-yi)/(yj-yi)+xi)inside=!inside;}if(inside)R(xx,yy,1,1,c);}};
 return {p,R,L,E,T};
}
const oct=(cx,cy,r)=>Array.from({length:8},(_,i)=>{const a=i*Math.PI/4+Math.PI/8;return [cx+Math.cos(a)*r,cy+Math.sin(a)*r];});
export function evaIconPixels(id){
 if(!EVA_ICON_IDS.includes(id))return null;if(cache.has(id))return cache.get(id);const a=frame(),{R,L,E,T}=a;
 if(id==='pallet'){// The Pallet Rifle: boxy receiver, long barrel, drum magazine, stock and a hot muzzle.
  T([[2,13],[9,12],[9,19],[4,21],[2,19]],'#3a4250');R(3,14,5,1,'#6a7684');
  R(8,11,15,8,'#262c36');R(9,12,13,6,'#4a5462');R(9,12,13,1,'#8a96a4');R(12,15,7,1,'#262c36');
  R(22,13,7,3,'#262c36');R(23,14,6,1,'#8a96a4');R(12,8,7,3,'#3a4250');R(13,8,5,1,'#9aa8b4');R(17,9,2,1,'#6ad0f0');
  E(15,22,4,4,'#262c36');E(15,22,2.8,2.8,'#4a5462');R(14,21,2,2,'#8a96a4');R(10,19,3,4,'#3a4250');
  T([[29,11],[31,14],[29,17],[28,14]],'#ffb04a');R(29,14,2,1,'#fff2c8');L(25,24,28,27,'#f08a2a');L(27,22,30,24,'#f08a2a');}
 else if(id==='atfield'){// Nested orange octagons of an AT Field.
  T(oct(16,16,15),'#7a3a10');T(oct(16,16,13.5),'#f08a2a');T(oct(16,16,11.5),'#2a1608');
  T(oct(16,16,10),'#ffb24a');T(oct(16,16,8.5),'#3a200c');T(oct(16,16,6.5),'#ffd08a');T(oct(16,16,5),'#4a2a10');E(16,16,2.4,2.4,'#fff2c8');
  for(const [x,y]of [[5,6],[26,8],[6,26]])R(x,y,1,1,'#fff2c8');}
 else if(id==='positron'){// The Spear of Longinus: a crimson shaft splitting into twisting twin tines.
  E(16,16,15,15,'#2a0c14');E(16,16,13,13,'#140810');
  L(4,29,16,17,'#5a1020',3);L(4,28,16,16,'#c8304a');L(5,28,15,18,'#f07a8a');
  // Two tines wind around each other once, then fork apart into separate points.
  const tines=[[[16,16],[19,15],[20,11],[18,7],[19,3]],[[16,16],[17,13],[21,12],[25,13],[29,10]]];
  for(const [i,pts]of tines.entries())for(let k=1;k<pts.length;k++){L(pts[k-1][0],pts[k-1][1],pts[k][0],pts[k][1],'#3a0c18',3);L(pts[k-1][0],pts[k-1][1],pts[k][0],pts[k][1],i?'#d8405a':'#b4466a',2);}
  R(18,2,2,2,'#ffd0d8');R(28,9,2,2,'#ffd0d8');R(19,12,2,1,'#ffe0e6');}
 else{// Berserk Unit-01: the horned head roaring with glowing eyes and bared teeth.
  E(16,17,15,14,'#3a0a14');E(16,17,13,12,'#1a0610');
  T([[14,8],[19,1],[21,2],[17,9]],'#8a64ba');L(17,6,20,2,'#c4a8e6');
  T([[9,11],[14,7],[18,7],[23,11],[24,19],[21,27],[11,27],[8,19]],'#2e1f48');T([[10,11],[14,8],[18,8],[22,11],[23,19],[20,26],[12,26],[9,19]],'#5c3c8a');L(11,11,14,9,'#b89ae0');
  for(const s of [-1,1])T([[16+s*4,16],[16+s*7,15],[16+s*7,24],[16+s*4,27]],'#72c844');
  L(11,13,14,15,'#f4ffd0',2);L(21,13,18,15,'#f4ffd0',2);
  R(13,18,7,10,'#140c18');for(let x=13;x<20;x+=2){R(x,18,1,2,'#f2ecd6');R(x,26,1,2,'#f2ecd6');}R(14,21,5,3,'#5a1020');
  for(const [x,y]of [[4,6],[28,9],[5,25],[27,27]])R(x,y,2,1,'#9be070');}
 const result=[...a.p];for(let y=0;y<32;y++)for(let x=0;x<32;x++)if(a.p[y*32+x])for(const [dx,dy]of [[1,0],[-1,0],[0,1],[0,-1]]){const xx=x+dx,yy=y+dy;if(xx>=0&&xx<32&&yy>=0&&yy<32&&!a.p[yy*32+xx])result[yy*32+xx]=INK;}
 cache.set(id,result);return result;
}
export function evaIcon(id){const p=evaIconPixels(id);return p?p.map((c,i)=>c?`<rect x="${i%32+1}" y="${Math.floor(i/32)+1}" width="1" height="1" fill="${c}"/>`:'').join(''):null;}
