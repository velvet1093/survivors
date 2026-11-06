// Frieren's weapon, passive and evolution icons on the 32×32 item grid: her crescent staff
// firing Zoltraak's piercing ray, an ancient leather grimoire with a glowing seal, and Ancient
// Magic's three parallel rays slicing through a pale green spell circle.
export const FRIEREN_ICON_IDS=['zoltraak','grimoire','ancientmagic'];
const cache=new Map(),INK='#1a1e26';
const GOLD='#c9a24e',GOLD_DARK='#8c6c30',GOLD_LIGHT='#efd28a',RED='#c8283a',SHAFT='#8a2a2e',BEAM='#fffbe8',BEAM_EDGE='#f0dca0',MANA='#8ad0b0';
function frame(){
 const p=Array(1024).fill(null),R=(x,y,w,h,c)=>{for(let yy=Math.round(y);yy<y+h;yy++)for(let xx=Math.round(x);xx<x+w;xx++)if(xx>=0&&yy>=0&&xx<32&&yy<32)p[yy*32+xx]=c;};
 const L=(x,y,tx,ty,c,w=1)=>{const n=Math.max(1,Math.abs(tx-x),Math.abs(ty-y));for(let i=0;i<=n;i++)R(x+(tx-x)*i/n,y+(ty-y)*i/n,w,w,c);};
 const E=(x,y,rx,ry,c)=>{for(let yy=0;yy<32;yy++)for(let xx=0;xx<32;xx++)if(((xx+.5-x)/rx)**2+((yy+.5-y)/ry)**2<=1)R(xx,yy,1,1,c);};
 const T=(pts,c)=>{for(let yy=0;yy<32;yy++)for(let xx=0;xx<32;xx++){let inside=false;for(let i=0,j=pts.length-1;i<pts.length;j=i++){const [xi,yi]=pts[i],[xj,yj]=pts[j];if((yi>yy+.5)!==(yj>yy+.5)&&xx+.5<(xj-xi)*(yy+.5-yi)/(yj-yi)+xi)inside=!inside;}if(inside)R(xx,yy,1,1,c);}};
 return {p,R,L,E,T};
}
// The staff's crescent ring cradling a red orb.
function crescent(a,x,y,r=4.6){const {R}=a;for(let i=0;i<=30;i++){const t=Math.PI*(.32+1.36*i/30)+Math.PI/2;R(x+Math.cos(t)*r-.5,y+Math.sin(t)*r-.5,2,2,i<15?GOLD_LIGHT:GOLD);}
 a.E(x,y,2.4,2.4,GOLD_DARK);a.E(x,y,1.7,1.7,RED);R(x-1,y-1,1,1,'#ff9aa4');}
export function frierenIconPixels(id){
 if(!FRIEREN_ICON_IDS.includes(id))return null;if(cache.has(id))return cache.get(id);const a=frame(),{R,L,E,T}=a;
 if(id==='zoltraak'){// Zoltraak: a white ray with a gold rim bursts from the orb toward the lower left.
  T([[19,7],[22,12],[3,27],[1,22]],BEAM_EDGE);T([[19,8],[21,11],[3,25],[2,23]],BEAM);L(19,9,3,24,'#ffffff');
  for(const [x,y]of [[7,17],[12,22],[4,14],[15,25]])R(x,y,1,1,GOLD_LIGHT);
  L(27,31,22,13,'#4e1a1e',3);L(27,31,22,13,SHAFT,2);L(28,30,23,14,'#c0545a');R(21,13,3,2,GOLD);R(25,26,3,2,GOLD);L(23,15,26,19,RED);
  crescent(a,22,8);E(22,8,6.5,6.5,null);crescent(a,22,8);
  for(let i=0;i<10;i++){const t=i*Math.PI/5;R(22+Math.cos(t)*7.2-.5,8+Math.sin(t)*7.2-.5,1,1,MANA);}}
 else if(id==='grimoire'){// Ancient Grimoire: a worn leather tome with gold corners, a clasp and a glowing seal.
  T([[6,4],[25,3],[27,6],[27,28],[8,29],[5,26]],'#3a2018');T([[8,5],[25,4],[25,27],[9,28]],'#6a3a2a');L(9,6,9,27,'#8a5038');
  T([[25,5],[28,7],[28,28],[25,27]],'#f0e6cc');for(const y of [9,14,19,24])L(26,y,27,y+1,'#c8b890');
  for(const [x,y]of [[8,5],[22,4],[8,25],[22,25]]){R(x,y,3,3,GOLD);R(x,y,2,1,GOLD_LIGHT);}
  E(17,16,6,6,GOLD_DARK);E(17,16,5,5,'#2a3a2e');
  for(let i=0;i<6;i++){const t=i*Math.PI/3-Math.PI/2;L(17,16,17+Math.cos(t)*4,16+Math.sin(t)*4,MANA);}E(17,16,1.4,1.4,'#e0fff0');
  R(26,14,4,5,GOLD_DARK);R(27,15,2,3,GOLD);R(27,15,1,1,GOLD_LIGHT);for(const [x,y]of [[3,9],[30,3],[2,22]])R(x,y,1,1,GOLD_LIGHT);}
 else{// Ancient Magic: three parallel rays cutting through a pale green spell circle.
  E(16,16,15,15,'#2a5a52');E(16,16,13.6,13.6,'#14262c');E(16,16,12.2,12.2,'#3a7a6a');E(16,16,11.2,11.2,'#14262c');
  for(let i=0;i<12;i++){const t=i*Math.PI/6;R(16+Math.cos(t)*12.7-.5,16+Math.sin(t)*12.7-.5,1,1,MANA);}
  for(const k of [0,1])for(let i=0;i<3;i++){const t=i*2*Math.PI/3+k*Math.PI/3-Math.PI/2;L(16+Math.cos(t)*8,16+Math.sin(t)*8,16+Math.cos(t+2*Math.PI/3)*8,16+Math.sin(t+2*Math.PI/3)*8,'#5aa08a');}
  for(const o of [-7,0,7]){const d=o*.7;L(4+d,28+d,28+d,4+d,BEAM_EDGE,2);L(4+d,28+d,28+d,4+d,'#ffffff');}
  E(16,16,2,2,'#ffffff');}
 const result=[...a.p];for(let y=0;y<32;y++)for(let x=0;x<32;x++)if(a.p[y*32+x])for(const [dx,dy]of [[1,0],[-1,0],[0,1],[0,-1]]){const xx=x+dx,yy=y+dy;if(xx>=0&&xx<32&&yy>=0&&yy<32&&!a.p[yy*32+xx])result[yy*32+xx]=INK;}
 cache.set(id,result);return result;
}
export function frierenIcon(id){const p=frierenIconPixels(id);return p?p.map((c,i)=>c?`<rect x="${i%32+1}" y="${Math.floor(i/32)+1}" width="1" height="1" fill="${c}"/>`:'').join(''):null;}
