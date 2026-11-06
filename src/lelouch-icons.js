// Lelouch & C.C.'s icons on the 32×32 item grid: the Geass sigil blazing in a violet eye,
// C.C.'s Code glowing on her brow under green hair, Zero's mask with its open red eye for
// the Power of the King, and the Gawain's black-and-gold head between twin Hadron beams.
export const LELOUCH_ICON_IDS=['geass','witchcode','kingspower','gawain'];
const cache=new Map(),INK='#120e18';
const RED='#ff3a52',RED_DARK='#9a1024',RED_LIGHT='#ffb0bc',GOLD='#d8b048',GOLD_DARK='#8a6a24',VIOLET='#5a3a8a',GREEN='#8ad850',GREEN_DARK='#56a038',GREEN_LIGHT='#c8f088';
function frame(){
 const p=Array(1024).fill(null),R=(x,y,w,h,c)=>{for(let yy=Math.round(y);yy<y+h;yy++)for(let xx=Math.round(x);xx<x+w;xx++)if(xx>=0&&yy>=0&&xx<32&&yy<32)p[yy*32+xx]=c;};
 const L=(x,y,tx,ty,c,w=1)=>{const n=Math.max(1,Math.abs(tx-x),Math.abs(ty-y));for(let i=0;i<=n;i++)R(x+(tx-x)*i/n,y+(ty-y)*i/n,w,w,c);};
 const E=(x,y,rx,ry,c)=>{for(let yy=0;yy<32;yy++)for(let xx=0;xx<32;xx++)if(((xx+.5-x)/rx)**2+((yy+.5-y)/ry)**2<=1)R(xx,yy,1,1,c);};
 const T=(pts,c)=>{for(let yy=0;yy<32;yy++)for(let xx=0;xx<32;xx++){let inside=false;for(let i=0,j=pts.length-1;i<pts.length;j=i++){const [xi,yi]=pts[i],[xj,yj]=pts[j];if((yi>yy+.5)!==(yj>yy+.5)&&xx+.5<(xj-xi)*(yy+.5-yi)/(yj-yi)+xi)inside=!inside;}if(inside)R(xx,yy,1,1,c);}};
 return {p,R,L,E,T};
}
// The Geass sigil: a bird with spread wings, its head a small diamond and its tail a spike.
function sigil(a,cx,cy,s,color,light){const {T}=a,P=pts=>pts.map(([x,y])=>[cx+x*s,cy+y*s]);
 T(P([[0,-2],[-10,-8],[-7,-1],[-12,1],[-6,3],[0,2]]),color);T(P([[0,-2],[10,-8],[7,-1],[12,1],[6,3],[0,2]]),color);
 T(P([[-2,2],[2,2],[0,9]]),color);T(P([[0,-7],[2,-4],[0,-2],[-2,-4]]),light||color);}
export function lelouchIconPixels(id){
 if(!LELOUCH_ICON_IDS.includes(id))return null;if(cache.has(id))return cache.get(id);const a=frame(),{R,L,E,T}=a;
 if(id==='geass'){// A violet-lashed eye whose iris has become the blazing red sigil.
  T([[2,16],[9,9],[16,7],[23,9],[30,16],[23,23],[16,25],[9,23]],'#2a1a3a');T([[4,16],[10,10],[16,9],[22,10],[28,16],[22,22],[16,23],[10,22]],'#f8f0f4');
  E(16,16,7,7,RED_DARK);E(16,16,6,6,RED);sigil(a,16,16,.62,'#5a0a18','#5a0a18');E(16,16,1.6,1.6,RED_LIGHT);R(12,12,2,2,'#ffffff');
  L(2,16,9,8,'#1a1020',2);L(9,8,16,6,'#1a1020',2);L(16,6,23,8,'#1a1020',2);L(23,8,30,15,'#1a1020',2);for(const [x,y]of [[4,6],[27,5],[28,26],[3,27]])R(x,y,1,1,RED);}
 else if(id==='witchcode'){// Green hair framing C.C.'s brow and the red Code sigil glowing upon it.
  E(16,16,14,14,GREEN_DARK);E(16,15,13,13,GREEN);T([[7,30],[6,12],[10,7],[22,7],[26,12],[25,30],[21,30],[21,14],[11,14],[11,30]],GREEN_DARK);
  T([[9,12],[16,9],[23,12],[23,26],[16,30],[9,26]],'#fde1c9');R(10,23,12,1,'#eab59f');
  T([[8,13],[11,8],[16,7],[21,8],[24,13],[21,12],[19,15],[17,11],[15,15],[13,11],[11,15]],GREEN);L(11,9,15,8,GREEN_LIGHT);
  sigil(a,16,17,.36,RED,RED_LIGHT);for(const [x,y]of [[11,21],[19,21]]){R(x,y,3,2,'#e8b030');R(x,y,3,1,'#2a1a10');R(x+1,y+1,1,1,'#a06818');}L(14,26,17,26,'#b9707a');}
 else if(id==='kingspower'){// Zero's mask: spiked crown, gold trim and the open eye panel glowing red.
  T([[11,8],[12,1],[14,5],[16,0],[18,5],[20,1],[21,8]],'#18122a');T([[12,7],[13,3],[14,6],[16,2],[18,6],[19,3],[20,7]],'#2a2040');
  E(16,17,11,12,'#18122a');E(16,17,10,11,'#2a2040');L(8,13,11,28,GOLD,1);L(24,13,21,28,GOLD,1);L(9,14,12,27,GOLD_DARK);
  T([[10,12],[22,12],[21,22],[18,27],[14,27],[11,22]],'#3a2a5a');T([[11,13],[21,13],[20,21],[17,25],[15,25],[12,21]],'#5a4a8a');
  R(11,15,6,4,'#120a1c');R(12,16,4,2,RED);R(13,16,1,1,'#ffd0d8');L(18,14,19,19,'#c8b8f0');
  T([[3,31],[5,24],[10,28],[16,29],[22,28],[27,24],[29,31]],'#600a1e');T([[5,31],[6,26],[10,29],[22,29],[26,26],[27,31]],'#a01a32');}
 else if(id==='gawain'){// The Gawain's head: black armor, gold horns and orange eyes, between two Hadron beams.
  for(const x of [1,26]){R(x,0,5,32,'#600a1e');R(x+1,0,3,32,RED);R(x+2,0,1,32,RED_LIGHT);}
  T([[9,9],[5,1],[12,6],[16,3],[20,6],[27,1],[23,9]],GOLD_DARK);T([[10,8],[7,3],[12,7],[16,5],[20,7],[25,3],[22,8]],GOLD);
  T([[8,12],[12,7],[20,7],[24,12],[23,24],[19,29],[13,29],[9,24]],'#100c18');T([[9,12],[13,8],[19,8],[23,12],[22,23],[18,27],[14,27],[10,23]],'#2a2436');
  T([[10,15],[15,14],[14,18],[10,18]],'#ff8a2a');T([[22,15],[17,14],[18,18],[22,18]],'#ff8a2a');R(11,15,2,1,'#ffd08a');R(19,15,2,1,'#ffd08a');
  L(16,9,16,13,GOLD);T([[12,21],[20,21],[19,25],[13,25]],'#3a3448');for(const x of [13,16,19])R(x,22,1,3,'#100c18');R(14,28,4,2,GOLD_DARK);}
 const result=[...a.p];for(let y=0;y<32;y++)for(let x=0;x<32;x++)if(a.p[y*32+x])for(const [dx,dy]of [[1,0],[-1,0],[0,1],[0,-1]]){const xx=x+dx,yy=y+dy;if(xx>=0&&xx<32&&yy>=0&&yy<32&&!a.p[yy*32+xx])result[yy*32+xx]=INK;}
 cache.set(id,result);return result;
}
export function lelouchIcon(id){const p=lelouchIconPixels(id);return p?p.map((c,i)=>c?`<rect x="${i%32+1}" y="${Math.floor(i/32)+1}" width="1" height="1" fill="${c}"/>`:'').join(''):null;}
