// Guts' icons on the 32×32 item grid: the Dragonslayer as a true slab of raw iron, the
// Brand of Sacrifice dripping fresh blood on scarred skin, the Astral Edge glowing with
// pale astral light, and the Berserker Armor's wolf helm with burning red eye slits.
export const GUTS_ICON_IDS=['dragonslayer','brand','berserkeredge','berserkerarmor'];
const cache=new Map(),INK='#14181f';
const IRON='#8e9ca0',IRON_DARK='#4a5660',IRON_LIGHT='#d8e0dc',LEATHER='#6c5144',BRASS='#ad956c',BLOOD='#b8202c',BLOOD_LIGHT='#ea5a5a';
function frame(){
 const p=Array(1024).fill(null),R=(x,y,w,h,c)=>{for(let yy=Math.round(y);yy<y+h;yy++)for(let xx=Math.round(x);xx<x+w;xx++)if(xx>=0&&yy>=0&&xx<32&&yy<32)p[yy*32+xx]=c;};
 const L=(x,y,tx,ty,c,w=1)=>{const n=Math.max(1,Math.abs(tx-x),Math.abs(ty-y));for(let i=0;i<=n;i++)R(x+(tx-x)*i/n,y+(ty-y)*i/n,w,w,c);};
 const E=(x,y,rx,ry,c)=>{for(let yy=0;yy<32;yy++)for(let xx=0;xx<32;xx++)if(((xx+.5-x)/rx)**2+((yy+.5-y)/ry)**2<=1)R(xx,yy,1,1,c);};
 const T=(pts,c)=>{for(let yy=0;yy<32;yy++)for(let xx=0;xx<32;xx++){let inside=false;for(let i=0,j=pts.length-1;i<pts.length;j=i++){const [xi,yi]=pts[i],[xj,yj]=pts[j];if((yi>yy+.5)!==(yj>yy+.5)&&xx+.5<(xj-xi)*(yy+.5-yi)/(yj-yi)+xi)inside=!inside;}if(inside)R(xx,yy,1,1,c);}};
 return {p,R,L,E,T};
}
// The slab from lower left to upper right: broad, blunt-ended, chipped along both edges.
function slab(a,{glow=null,rune=null}={}){const {T,L,R}=a;
 if(glow){T([[3,25],[22,4],[30,4],[30,11],[10,30],[3,30]],glow);}
 T([[6,24],[22,6],[28,6],[28,12],[11,28],[6,28]],IRON_DARK);T([[8,24],[22,8],[26,8],[26,12],[11,26],[8,26]],IRON);L(9,24,23,9,IRON_LIGHT);L(11,25,25,12,'#6a7880');
 for(const [x,y]of [[14,18],[19,13],[23,9],[17,20],[22,15]])R(x,y,1,1,IRON_DARK);
 if(rune)for(const [x,y]of [[13,20],[16,17],[19,14],[22,11]]){R(x,y,2,1,rune);R(x+1,y-1,1,1,rune);}
 L(4,26,10,32,BRASS,2);L(3,29,7,24,'#26303d',3);L(3,28,6,25,BRASS);L(1,31,4,28,LEATHER,3);R(0,30,2,2,BRASS);}
export function gutsIconPixels(id){
 if(!GUTS_ICON_IDS.includes(id))return null;if(cache.has(id))return cache.get(id);const a=frame(),{R,L,E,T}=a;
 if(id==='dragonslayer'){slab(a);for(const [x,y]of [[25,21],[27,24],[22,26]])R(x,y,1,1,BLOOD);}
 else if(id==='brand'){// The Brand of Sacrifice on scarred skin, bleeding.
  E(16,16,15,15,'#6a4a40');E(16,16,13.5,13.5,'#c89a80');E(16,14,10,8,'#d8ae94');for(const [x0,y0,x1,y1]of [[6,10,9,8],[24,24,27,21],[5,22,8,25]])L(x0,y0,x1,y1,'#a87a67');
  L(16,4,16,25,BLOOD,2);L(9,5,14,10,BLOOD,2);L(14,10,9,15,BLOOD,2);L(9,15,16,21,BLOOD,2);L(16,21,23,15,BLOOD,2);L(23,15,18,10,BLOOD,2);L(18,10,23,5,BLOOD,2);L(10,21,16,27,BLOOD,2);L(16,27,22,21,BLOOD,2);
  L(16,5,16,20,BLOOD_LIGHT);for(const [x,y,h]of [[16,27,4],[10,22,5],[22,22,3],[9,16,3]])L(x,y,x,y+h,'#8a1018');}
 else if(id==='berserkeredge'){// Astral Edge: the slab tempered in the astral world, glowing with pale light and runes.
  E(16,16,15.5,15.5,'#1a2234');E(16,16,14,14,'#0e1420');for(const [x,y]of [[5,6],[27,27],[25,4],[6,20]])R(x,y,1,1,'#c8e0ff');
  slab(a,{glow:'#5a7ab088',rune:'#a8e0ff'});L(9,22,25,8,'#e8f4ff');}
 else{// Berserker Armor: the wolf helm with slanted burning eye slits, fangs and a red aura.
  E(16,17,15.5,15.5,'#5a0e18');E(16,17,14.5,14.5,'#14181f');for(let i=0;i<9;i++){const x=4+i*3;L(x,31,x+(i%2?1:-1),24-(i%3)*2,i%2?'#a72d46':'#ed5862');}
  T([[6,4],[11,12],[21,12],[26,4],[25,14],[27,22],[22,29],[10,29],[5,22],[7,14]],'#151b26');T([[8,8],[12,13],[20,13],[24,8],[23,15],[25,21],[21,27],[11,27],[7,21],[9,15]],'#303946');
  T([[14,6],[18,6],[19,13],[16,15],[13,13]],'#46515e');L(16,7,16,14,'#7b8792');L(10,15,13,13,'#7b8792');L(22,15,19,13,'#7b8792');
  L(9,16,14,19,'#ed5862',2);L(23,16,18,19,'#ed5862',2);R(12,18,1,1,'#ffd2b9');R(19,18,1,1,'#ffd2b9');
  T([[11,22],[21,22],[19,27],[13,27]],'#151b26');for(const x of [12,15,18])T([[x,22],[x+2,22],[x+1,25]],'#d8dce0');}
 const result=[...a.p];for(let y=0;y<32;y++)for(let x=0;x<32;x++)if(a.p[y*32+x])for(const [dx,dy]of [[1,0],[-1,0],[0,1],[0,-1]]){const xx=x+dx,yy=y+dy;if(xx>=0&&xx<32&&yy>=0&&yy<32&&!a.p[yy*32+xx])result[yy*32+xx]=INK;}
 cache.set(id,result);return result;
}
export function gutsIcon(id){const p=gutsIconPixels(id);return p?p.map((c,i)=>c?`<rect x="${i%32+1}" y="${Math.floor(i/32)+1}" width="1" height="1" fill="${c}"/>`:'').join(''):null;}
