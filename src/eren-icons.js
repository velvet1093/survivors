// Eren's inventory, evolution and ultimate icons on the 32×32 item grid: crossed ODM
// blades, a Titan fist, the basement Key of Freedom, Thunder Spears, a hardened Titan
// Quake fist and the Attack Titan's face for his shift.
export const EREN_ICON_IDS=['odmblades','titanfists','freedom','scoutassault','titanquake','titanshift'];
const cache=new Map(),INK='#14161c';
function frame(){
 const p=Array(1024).fill(null),R=(x,y,w,h,c)=>{for(let yy=Math.round(y);yy<y+h;yy++)for(let xx=Math.round(x);xx<x+w;xx++)if(xx>=0&&yy>=0&&xx<32&&yy<32)p[yy*32+xx]=c;};
 const L=(x,y,tx,ty,c,w=1)=>{const n=Math.max(1,Math.abs(tx-x),Math.abs(ty-y));for(let i=0;i<=n;i++)R(x+(tx-x)*i/n,y+(ty-y)*i/n,w,w,c);};
 const E=(x,y,rx,ry,c)=>{for(let yy=0;yy<32;yy++)for(let xx=0;xx<32;xx++)if(((xx+.5-x)/rx)**2+((yy+.5-y)/ry)**2<=1)R(xx,yy,1,1,c);};
 const T=(pts,c)=>{for(let yy=0;yy<32;yy++)for(let xx=0;xx<32;xx++){let inside=false;for(let i=0,j=pts.length-1;i<pts.length;j=i++){const [xi,yi]=pts[i],[xj,yj]=pts[j];if((yi>yy+.5)!==(yj>yy+.5)&&xx+.5<(xj-xi)*(yy+.5-yi)/(yj-yi)+xi)inside=!inside;}if(inside)R(xx,yy,1,1,c);}};
 return {p,R,L,E,T};
}
// A straight bar of width w from (x0,y0) to (x1,y1), as a polygon.
function bar(a,x0,y0,x1,y1,w,c,tip=0){const l=Math.hypot(x1-x0,y1-y0)||1,nx=-(y1-y0)/l*w/2,ny=(x1-x0)/l*w/2,dx=(x1-x0)/l,dy=(y1-y0)/l;
 a.T([[x0+nx,y0+ny],[x1+nx-dx*tip,y1+ny-dy*tip],[x1-nx,y1-ny],[x0-nx,y0-ny]],c);}
// An ODM blade: segmented steel with an angled tip, brass guard and dark grip.
function odmBlade(a,hx,hy,tx,ty){const {L}=a,l=Math.hypot(tx-hx,ty-hy),dx=(tx-hx)/l,dy=(ty-hy)/l,nx=-dy,ny=dx;
 bar(a,hx+dx*3,hy+dy*3,tx,ty,4,'#6a8290',3);bar(a,hx+dx*3,hy+dy*3,tx,ty,2.4,'#c4d6dc',3);L(hx+dx*4+nx,hy+dy*4+ny,tx-dx*3+nx,ty-dy*3+ny,'#f4f8f4');
 for(let d=8;d<l-3;d+=4)L(hx+dx*d-nx*1.6,hy+dy*d-ny*1.6,hx+dx*d+nx*.4,hy+dy*d+ny*.4,'#4e6470');
 bar(a,hx+dx*2.5-nx*3,hy+dy*2.5-ny*3,hx+dx*2.5+nx*3,hy+dy*2.5+ny*3,2,'#b08a4a');bar(a,hx-dx*3,hy-dy*3,hx+dx*2,hy+dy*2,3.2,'#2e3238');L(hx-dx*2,hy-dy*2,hx+dx,hy+dy,'#5a6068');}
// Clenched Titan fist seen from the front: four knuckles, thumb across, thick wrist.
function fist(a,ox,oy,pal,hard=false){const {R,E,L,T}=a,X=x=>ox+x,Y=y=>oy+y;
 R(X(11),Y(22),10,8,pal.shade);R(X(12),Y(22),8,8,pal.base);L(X(13),Y(24),X(13),Y(29),pal.light);
 T([[X(6),Y(10)],[X(26),Y(10)],[X(27),Y(20)],[X(23),Y(25)],[X(9),Y(25)],[X(5),Y(19)]],pal.shade);T([[X(7),Y(11)],[X(25),Y(11)],[X(26),Y(19)],[X(22),Y(24)],[X(10),Y(24)],[X(6),Y(18)]],pal.base);
 for(let i=0;i<4;i++){const cx=X(9+i*4.7);E(cx,Y(10),2.6,3,pal.shade);E(cx,Y(10),2,2.4,pal.base);R(cx-1,Y(8),2,1,pal.light);if(hard){T([[cx-2,Y(9)],[cx,Y(6)],[cx+2,Y(9)],[cx,Y(12)]],'#8fb4c8');R(cx-.5,Y(8),1,2,'#eaf6fa');}
  if(i)L(X(6.7+i*4.7),Y(9),X(6.7+i*4.7),Y(15),pal.crease);}
 // Thumb wrapped across the fingers.
 T([[X(6),Y(16)],[X(18),Y(15)],[X(20),Y(18)],[X(17),Y(21)],[X(7),Y(21)]],pal.shade);T([[X(7),Y(17)],[X(17),Y(16)],[X(19),Y(18)],[X(16),Y(20)],[X(8),Y(20)]],pal.light);R(X(16),Y(17),2,2,pal.nail);
 // Exposed muscle striations along the back of the hand.
 for(const x of [21,23])L(X(x),Y(15),X(x+1),Y(22),pal.crease);}
const TITAN={base:'#cf957a',shade:'#9a5e4c',light:'#ecbc9c',crease:'#7a4636',nail:'#f2d2bc'};
// Titan steam rising in soft puffs.
function steam(a,pts){for(const [x,y,h]of pts){a.E(x,y-1,2.2,1.8,'#c8c8c0');a.E(x+1,y-h*.6,1.8,1.6,'#e4e4dc');a.E(x,y-h,1.4,1.2,'#f6f6f0');}}
function badge(a,ring,fill){a.E(16,16,15,15,ring);a.E(16,16,13,13,fill);}
export function erenIconPixels(id){
 if(!EREN_ICON_IDS.includes(id))return null;if(cache.has(id))return cache.get(id);const a=frame(),{R,L,E,T}=a;
 if(id==='odmblades'){odmBlade(a,6,27,28,4);odmBlade(a,26,27,4,4);}
 else if(id==='titanfists'){fist(a,0,2,TITAN);steam(a,[[5,9,6],[27,8,7],[16,5,4]]);}
 else if(id==='freedom'){// The basement key hanging on the cord Eren wears around his neck.
  L(3,0,12,6,'#7a5434',2);L(29,0,20,6,'#7a5434',2);L(4,0,12,5,'#a87a4c');L(28,0,20,5,'#a87a4c');
  E(16,9,6.5,6,'#4a5458');E(16,9,5.2,4.8,'#a4aeb2');E(16,9,3.4,3,'#4a5458');E(16,9,2,1.7,null);R(12,6,3,1,'#e8eeec');R(11,7,1,2,'#e8eeec');
  R(14,14,5,3,'#4a5458');R(15,14,3,3,'#a4aeb2');
  R(14,16,4,13,'#4a5458');R(15,16,2,12,'#a4aeb2');L(15,17,15,27,'#e8eeec');R(13,18,6,1,'#4a5458');
  // The bit: a notched flag off the end of the shaft.
  R(17,22,8,8,'#4a5458');R(18,23,6,6,'#a4aeb2');R(21,25,4,2,null);R(18,23,6,1,'#e8eeec');R(21,24,4,1,'#4a5458');R(21,27,4,1,'#4a5458');}
 else if(id==='scoutassault'){// Thunder Spears: two warheads crossed over a detonation flash.
  badge(a,'#2c3a34','#18201d');
  for(const [x0,y0,x1,y1]of [[6,27,25,6],[26,27,7,6]]){bar(a,x0,y0,x1,y1,4.2,'#2e4a40');bar(a,x0,y0,x1,y1,2.6,'#5e8a74');const l=Math.hypot(x1-x0,y1-y0),dx=(x1-x0)/l,dy=(y1-y0)/l;
   L(x0+dx*2,y0+dy*2,x1-dx*5,y1-dy*5,'#9cc4a8');bar(a,x1-dx*5,y1-dy*5,x1+dx*2,y1+dy*2,3.4,'#d6dfcc',3);bar(a,x0+dx*6,y0+dy*6,x0+dx*8,y0+dy*8,4.4,'#c8ab6f');
   for(const s of [-1,1])L(x0,y0,x0-dy*s*3-dx*2,y0+dx*s*3-dy*2,'#2e4a40');}
  for(const [dx,dy]of [[0,-1],[1,0],[0,1],[-1,0]])L(16,11,16+dx*4,11+dy*4,'#ffe08a');for(const [dx,dy]of [[1,1],[-1,1],[1,-1],[-1,-1]])R(16+dx*3,11+dy*3,1,1,'#ffe08a');E(16,11,1.6,1.6,'#fffbe8');}
 else if(id==='titanquake'){// A hardened fist strikes the ground and splits it.
  badge(a,'#3a2e28','#1e1814');
  T([[2,25],[30,25],[30,31],[2,31]],'#4a3c30');L(3,25,29,25,'#7a6a54');
  for(const [x0,x1,y1]of [[16,10,30],[16,23,29],[16,6,27],[16,27,27]])L(x0,25,x1,y1,'#ffcf7a');
  for(const r of [10,13])for(let i=0;i<=12;i++){const t=Math.PI+i*Math.PI/12;R(16+Math.cos(t)*r,24+Math.sin(t)*r*.32,1,1,'#e4c99e');}
  fist(a,0,-4,TITAN,true);}
 else{// Attack Titan: long dark hair, pointed ears, glowing green eyes and a lipless,
  // cheek-wide grin of bare teeth, with the shift's lightning striking behind.
  badge(a,'#2a2a34','#141420');
  for(const [x0,y0,x1,y1]of [[5,3,10,8],[10,8,7,11],[7,11,11,15],[27,3,23,8],[23,8,26,11]])L(x0,y0,x1,y1,'#ffe48a',2);
  T([[7,14],[9,6],[16,3],[23,6],[25,14],[27,28],[22,24],[10,24],[5,28]],'#2a201c');
  for(const s of [-1,1])T([[16+s*7,14],[16+s*11,12],[16+s*8,19]],'#b87c64');
  T([[9,10],[23,10],[24,18],[22,26],[16,29],[10,26],[8,18]],'#9a5e4c');T([[10,11],[22,11],[23,18],[21,25],[16,28],[11,25],[9,18]],'#cf957a');
  T([[8,9],[16,5],[24,9],[24,12],[20,10],[16,12],[12,10],[8,12]],'#43342c');L(11,7,21,7,'#6a5444');
  R(10,13,12,2,'#7a4636');for(const x of [11,18]){R(x,15,3,2,'#1a1210');R(x,15,2,1,'#8cf0a8');R(x+1,16,1,1,'#d8ffe0');}
  R(15,17,2,3,'#b87c64');
  R(9,21,14,4,'#3a1614');for(let x=9;x<23;x+=2){R(x,21,1,2,'#efe2c4');R(x,23,1,2,'#efe2c4');}
  for(const s of [-1,1]){L(16+s*7,21,16+s*9,17,'#a8483c');L(16+s*7,24,16+s*9,20,'#a8483c');}}
 const result=[...a.p];for(let y=0;y<32;y++)for(let x=0;x<32;x++)if(a.p[y*32+x])for(const [dx,dy]of [[1,0],[-1,0],[0,1],[0,-1]]){const xx=x+dx,yy=y+dy;if(xx>=0&&xx<32&&yy>=0&&yy<32&&!a.p[yy*32+xx])result[yy*32+xx]=INK;}
 cache.set(id,result);return result;
}
export function erenIcon(id){const p=erenIconPixels(id);return p?p.map((c,i)=>c?`<rect x="${i%32+1}" y="${Math.floor(i/32)+1}" width="1" height="1" fill="${c}"/>`:'').join(''):null;}
