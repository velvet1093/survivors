// Madoka's weapon, evolution and ultimate icons on the 32×32 item grid: the rosewood bow
// with its rosebud and a nocked arrow, the white-gold Ultimate Madoka bow amid streams of
// light arrows, and the Law of Cycles' wings and halo against the cosmos.
export const MADOKA_ICON_IDS=['rosebow','ultimate','lawofcycles'];
const cache=new Map(),INK='#2a1424';
function frame(){
 const p=Array(1024).fill(null),R=(x,y,w,h,c)=>{for(let yy=Math.round(y);yy<y+h;yy++)for(let xx=Math.round(x);xx<x+w;xx++)if(xx>=0&&yy>=0&&xx<32&&yy<32)p[yy*32+xx]=c;};
 const L=(x,y,tx,ty,c,w=1)=>{const n=Math.max(1,Math.abs(tx-x),Math.abs(ty-y));for(let i=0;i<=n;i++)R(x+(tx-x)*i/n,y+(ty-y)*i/n,w,w,c);};
 const E=(x,y,rx,ry,c)=>{for(let yy=0;yy<32;yy++)for(let xx=0;xx<32;xx++)if(((xx+.5-x)/rx)**2+((yy+.5-y)/ry)**2<=1)R(xx,yy,1,1,c);};
 const T=(pts,c)=>{for(let yy=0;yy<32;yy++)for(let xx=0;xx<32;xx++){let inside=false;for(let i=0,j=pts.length-1;i<pts.length;j=i++){const [xi,yi]=pts[i],[xj,yj]=pts[j];if((yi>yy+.5)!==(yj>yy+.5)&&xx+.5<(xj-xi)*(yy+.5-yi)/(yj-yi)+xi)inside=!inside;}if(inside)R(xx,yy,1,1,c);}};
 return {p,R,L,E,T};
}
// A bow drawn diagonally from lower left to upper right, its limb bulging toward the upper left.
function bow(a,pal){const {L,R}=a,limb=[[4,26],[5,19],[8,12],[13,7],[20,4],[26,4]];
 for(let i=1;i<limb.length;i++){L(limb[i-1][0],limb[i-1][1],limb[i][0],limb[i][1],pal.dark,3);L(limb[i-1][0]+1,limb[i-1][1],limb[i][0]+1,limb[i][1],pal.mid,2);L(limb[i-1][0]+1,limb[i-1][1]-1,limb[i][0]+1,limb[i][1]-1,pal.light);}
 L(5,26,26,5,pal.string);}
function rosebud(a,x,y,big=1){const {E,R}=a;E(x,y,2.4*big,2*big,'#9e2a5a');E(x,y-.4,1.8*big,1.4*big,'#e0306a');R(x-.5,y-1,1,1,'#ffb0d0');R(x-2,y+1.5,4,1,'#4a8a3a');}
export function madokaIconPixels(id){
 if(!MADOKA_ICON_IDS.includes(id))return null;if(cache.has(id))return cache.get(id);const a=frame(),{R,L,E,T}=a;
 if(id==='rosebow'){// The rosewood bow with a rosebud at its tip, leaves along the limb and a nocked arrow.
  bow(a,{dark:'#6a4a2a',mid:'#d8a848',light:'#f8e090',string:'#fbe8f0'});rosebud(a,27,4);
  for(const [x,y]of [[6,16],[11,9]]){R(x,y,2,1,'#4a8a3a');R(x+1,y-1,1,1,'#8ad070');}
  L(9,23,27,9,'#f8d878',1);T([[26,8],[30,5],[28,11]],'#f070a8');for(const [x,y]of [[9,22],[8,24]])R(x,y,2,1,'#ffd8ec');}
 else if(id==='ultimate'){// Ultimate Madoka: the bow turned white and gold with feathered limbs, firing a spread of light.
  E(16,16,15,15,'#2a1a5a');E(16,16,13,13,'#140c34');for(const [x,y]of [[7,20],[24,25],[10,27],[22,7]])R(x,y,1,1,'#e0c8ff');
  for(const [dx,dy]of [[0,0],[3,4],[-3,4]])L(10+dx,22+dy,27+dx,5+dy,'#ffe8a8');
  bow(a,{dark:'#8a7a5a',mid:'#f4f0e0',light:'#ffffff',string:'#fff4dc'});
  for(const [x,y,dx,dy]of [[5,18,-3,-2],[7,13,-3,-3],[10,9,-2,-3],[15,6,-1,-3]]){L(x,y,x+dx,y+dy,'#ffffff',2);R(x+dx,y+dy,1,1,'#f8c8e0');}
  rosebud(a,27,4);for(const [x,y]of [[27,13],[13,26]]){R(x,y-1,1,3,'#ffffff');R(x-1,y,3,1,'#ffffff');}}
 else{// Law of Cycles: wings and a golden halo over a cosmic circle, light at its heart.
  E(16,17,15,14,'#4a2a7a');E(16,17,13.5,12.5,'#1e1446');for(let i=0;i<18;i++){const t=i*2.399,d=11*Math.sqrt((i+.5)/18);R(16+Math.cos(t)*d,17+Math.sin(t)*d,1,1,i%3?'#c8b0ff':'#ffffff');}
  for(const s of [-1,1]){for(let i=0;i<5;i++){const ang=-.7+i*.38,len=8+i*1.6,bx=16+s*2,by=16,tx=bx+s*Math.cos(ang)*len,ty=by+Math.sin(ang)*len;
   T([[bx,by],[tx,ty-1.5],[tx+s*1.5,ty+1.5]],i%2?'#ffe4f2':'#ffffff');}L(16+s*2,16,16+s*12,12,'#e8a8cc');}
  E(16,6,6,2,'#f8d878');E(16,6,4.4,1,'#1e1446');E(16,17,2.6,2.6,'#ffe8f4');R(15,16,1,1,'#ffffff');
  for(const [x,y]of [[16,23],[16,26]])R(x,y,1,2,'#f8c8e0');}
 const result=[...a.p];for(let y=0;y<32;y++)for(let x=0;x<32;x++)if(a.p[y*32+x])for(const [dx,dy]of [[1,0],[-1,0],[0,1],[0,-1]]){const xx=x+dx,yy=y+dy;if(xx>=0&&xx<32&&yy>=0&&yy<32&&!a.p[yy*32+xx])result[yy*32+xx]=INK;}
 cache.set(id,result);return result;
}
export function madokaIcon(id){const p=madokaIconPixels(id);return p?p.map((c,i)=>c?`<rect x="${i%32+1}" y="${Math.floor(i/32)+1}" width="1" height="1" fill="${c}"/>`:'').join(''):null;}
