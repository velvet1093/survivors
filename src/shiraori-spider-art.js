import {raster,outline} from './pixel-characters.js';
// Shiraori's spiders on the summon canvas, facing right. Spiderlings are her small
// white brood with red eyes; Arch Taratects are larger lilac-grey hunters with pale
// markings; the Queen Taratect is a colossal charcoal spider with a bone-white crest.
const PALETTES={
 spiderling:{body:['#b9b0c6','#ece8f2','#ffffff'],mark:'#d8cfe4',eye:'#e2303e',leg:['#a69bb6','#e2dcea']},
 archtaratect:{body:['#4e4660','#7c7290','#a89cba'],mark:'#e8e0f0',eye:'#ff3a48',leg:['#3a3448','#6e6482']},
 queentaratect:{body:['#1e1a26','#3a3446','#5c5470'],mark:'#ece4d6',eye:'#ff2a3a',leg:['#16121c','#4a4258']},
};
export function spiderPixels(kind,{frame=0,attack=false}={}){
 const pal=PALETTES[kind]||PALETTES.spiderling,r=raster(),{poly:P,line:L,rect:R,put}=r,queen=kind==='queentaratect',step=[0,2,0,-2][frame%4];
 // Far legs, then the abdomen, thorax and head, then the near legs on top. Each leg
 // arches up from the thorax to a high knee and plants its tip well away from the body.
 const KNEE=[[12,40],[24,36],[44,36],[52,42]],FOOT=[[3,71],[16,71],[40,71],[54,70]];
 const legs=(near)=>{for(let i=0;i<4;i++){const ax=34+i*2,ay=56,lift=(i%2?step:-step)*(near?1:-1),raised=attack&&i===3;
  const [kx0,ky0]=KNEE[i],[fx0,fy0]=FOOT[i],kx=raised?48:kx0+(near?0:3),ky=raised?36:ky0+(near?0:3)+lift*.5,fx=raised?55:fx0+lift+(near?0:4),fy=raised?44:fy0;
  L(ax,ay,kx,ky,pal.leg[0],near?3:2);L(kx,ky,fx,fy,pal.leg[0],2);if(near){L(ax,ay-1,kx,ky-1,pal.leg[1]);L(kx,ky,fx-1,fy-1,pal.leg[1]);}}};
 legs(false);
 // Abdomen with a spiral/crest marking.
 P([[6,52],[10,42],[20,38],[30,42],[33,52],[28,62],[16,64],[8,60]],pal.body[0]);P([[8,52],[12,43],[20,40],[29,44],[31,52],[27,60],[16,62],[10,59]],pal.body[1]);
 L(12,45,20,41,pal.body[2]);
 if(queen){P([[12,44],[20,36],[28,44],[20,52]],pal.mark);P([[15,44],[20,39],[25,44],[20,49]],pal.body[0]);for(const x of [10,16,24,30])P([[x,42],[x+2,34],[x+4,42]],pal.mark);}
 else{P([[16,47],[20,44],[24,47],[20,55]],pal.mark);put(20,48,pal.body[0]);}
 // Thorax and head with the cluster of red eyes and fangs.
 P([[28,52],[34,48],[42,50],[44,57],[38,62],[30,61]],pal.body[0]);P([[30,52],[34,50],[41,51],[42,57],[37,60],[31,59]],pal.body[1]);
 P([[40,50],[46,49],[50,53],[49,58],[43,59]],pal.body[0]);P([[41,51],[46,50],[48,54],[47,57],[43,57]],pal.body[2]);
 for(const [x,y]of [[44,51],[46,51],[47,53],[45,53],[43,53],[48,55]])put(x,y,pal.eye);put(45,51,'#ffd0d4');
 const fang=attack?3:1;L(46,58,47,58+fang,pal.mark);L(49,57,50,57+fang,pal.mark);
 if(queen){// A crown of pale spines behind the head and a web-thread trailing from the spinnerets.
  for(const [x,h]of [[34,8],[38,10],[42,7]])P([[x,49],[x+1,49-h],[x+3,49]],pal.mark);L(6,56,1,66,'#e8e2f0');}
 legs(true);
 return outline(r.pixels,'#1a1622');
}
// ---- Inventory and ultimate icons ----
export const SHIRAORI_ICON_IDS=['spiderbrood','parallelminds','archtaratect','queentaratect'];
const cache=new Map(),INK='#2a2433';
function frame(){
 const p=Array(1024).fill(null),R=(x,y,w,h,c)=>{for(let yy=Math.round(y);yy<y+h;yy++)for(let xx=Math.round(x);xx<x+w;xx++)if(xx>=0&&yy>=0&&xx<32&&yy<32)p[yy*32+xx]=c;};
 const L=(x,y,tx,ty,c,w=1)=>{const n=Math.max(1,Math.abs(tx-x),Math.abs(ty-y));for(let i=0;i<=n;i++)R(x+(tx-x)*i/n,y+(ty-y)*i/n,w,w,c);};
 const E=(x,y,rx,ry,c)=>{for(let yy=0;yy<32;yy++)for(let xx=0;xx<32;xx++)if(((xx+.5-x)/rx)**2+((yy+.5-y)/ry)**2<=1)R(xx,yy,1,1,c);};
 return {p,R,L,E};
}
function spider(a,cx,cy,s,pal){const {E,L,R}=a;
 // Top-down: four legs a side, each bending at a knee and spreading outward.
 for(let i=0;i<4;i++)for(const side of [-1,1]){const kx=cx+side*7*s,ky=cy+(i-1.5)*3.4*s-2*s,fx=cx+side*11*s,fy=cy+(i-1.5)*5.5*s+2*s;L(cx,cy+(i-1.5)*s,kx,ky,pal.leg,2);L(kx,ky,fx,fy,pal.leg);}
 E(cx,cy+5*s,4.5*s,5.5*s,pal.dark);E(cx,cy+5*s,3.6*s,4.6*s,pal.body);E(cx,cy-2*s,3.2*s,2.8*s,pal.dark);E(cx,cy-2*s,2.4*s,2*s,pal.body);
 for(const [dx,dy]of [[-1,-3],[1,-3],[-2,-2],[2,-2]])R(cx+dx*s,cy+dy*s,1,1,pal.eye);R(cx-.5,cy+3*s,1,3*s,pal.mark);}
const W={leg:'#a69bb6',dark:'#b9b0c6',body:'#f2eef6',eye:'#e2303e',mark:'#d8cfe4'},G={leg:'#3a3448',dark:'#4e4660',body:'#8a80a0',eye:'#ff3a48',mark:'#e8e0f0'},Q={leg:'#16121c',dark:'#2a2434',body:'#4a4258',eye:'#ff2a3a',mark:'#ece4d6'};
function web(a,cx,cy,r,col){const {L}=a;for(let i=0;i<8;i++){const t=i*Math.PI/4;L(cx,cy,cx+Math.cos(t)*r,cy+Math.sin(t)*r,col);}for(const k of [.4,.75,1])for(let i=0;i<8;i++){const t=i*Math.PI/4,u=(i+1)*Math.PI/4;L(cx+Math.cos(t)*r*k,cy+Math.sin(t)*r*k,cx+Math.cos(u)*r*k,cy+Math.sin(u)*r*k,col);}}
export function shiraoriIconPixels(id){
 if(!SHIRAORI_ICON_IDS.includes(id))return null;if(cache.has(id))return cache.get(id);const a=frame(),{E,R,L}=a;
 if(id==='spiderbrood'){E(16,16,15,15,'#3a3048');web(a,16,16,14,'#7a6c94');spider(a,16,14,1.05,W);for(const [x,y]of [[5,27],[27,27],[27,5]]){E(x,y,2,1.6,'#f2eef6');R(x,y-1,1,1,'#e2303e');}}
 else if(id==='parallelminds'){E(16,16,13,13,'#4a3a5c');E(16,16,11,11,'#7a5c94');for(const [x,y]of [[11,11],[21,11],[16,19]]){E(x,y,4,4,'#1a1424');E(x,y,3,3,'#e2303e');R(x-1,y-2,1,1,'#ffd0d4');}L(11,11,21,11,'#c9a8d8');L(21,11,16,19,'#c9a8d8');L(16,19,11,11,'#c9a8d8');}
 else if(id==='archtaratect'){web(a,16,16,15,'#b8acd0');spider(a,16,15,1.1,G);for(const [x,y]of [[5,26],[27,26]])E(x,y,2,2,'#a7de80');}
 else{E(16,16,15,15,'#2a1a24');web(a,16,16,14,'#5a4a64');spider(a,16,15,1.25,Q);for(const [x,h]of [[12,5],[16,7],[20,5]])L(x,9,x,9-h,'#ece4d6');}
 const result=[...a.p];for(let y=0;y<32;y++)for(let x=0;x<32;x++)if(a.p[y*32+x])for(const [dx,dy]of [[1,0],[-1,0],[0,1],[0,-1]]){const xx=x+dx,yy=y+dy;if(xx>=0&&xx<32&&yy>=0&&yy<32&&!a.p[yy*32+xx])result[yy*32+xx]=INK;}
 cache.set(id,result);return result;
}
export function shiraoriIcon(id){const p=shiraoriIconPixels(id);return p?p.map((c,i)=>c?`<rect x="${i%32+1}" y="${Math.floor(i/32)+1}" width="1" height="1" fill="${c}"/>`:'').join(''):null;}
