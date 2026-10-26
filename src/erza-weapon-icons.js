// Each Requip weapon keeps its own silhouette, including when Heaven's Arsenal
// is awakened. Native 32px art stays crisp in the compact 18px mobile inventory.
const BASE_IDS=['erza-heartkreuz-blade','erza-wheel-blades','erza-blackwing-sword','erza-adamantine-shields'];
export const ERZA_WEAPON_ICON_IDS=BASE_IDS.flatMap(id=>[id,id+'-arsenal']);
const INK='#293245',cache=new Map(),svgCache=new Map();
function raster(){
 const pixels=Array(32*32).fill(null);
 const put=(x,y,c)=>{x=Math.round(x);y=Math.round(y);if(x>=0&&y>=0&&x<32&&y<32)pixels[y*32+x]=c;};
 const R=(x,y,w,h,c)=>{for(let yy=Math.round(y);yy<y+h;yy++)for(let xx=Math.round(x);xx<x+w;xx++)put(xx,yy,c);};
 const L=(x,y,tx,ty,c,w=1)=>{const n=Math.max(Math.abs(tx-x),Math.abs(ty-y),1);for(let i=0;i<=n;i++)R(Math.round(x+(tx-x)*i/n),Math.round(y+(ty-y)*i/n),w,w,c);};
 const P=(points,c)=>{for(let y=0;y<32;y++)for(let x=0;x<32;x++){let inside=false;for(let i=0,j=points.length-1;i<points.length;j=i++){const a=points[i],b=points[j];if((a[1]>y+.5)!==(b[1]>y+.5)&&x+.5<(b[0]-a[0])*(y+.5-a[1])/(b[1]-a[1])+a[0])inside=!inside;}if(inside)put(x,y,c);}};
 const O=(x,y,rx,ry,c)=>{for(let yy=0;yy<32;yy++)for(let xx=0;xx<32;xx++)if(((xx+.5-x)/rx)**2+((yy+.5-y)/ry)**2<1)put(xx,yy,c);};
 const star=(x,y,c)=>{R(x-2,y,5,1,c);R(x,y-2,1,5,c);R(x,y,1,1,'#fff4d7');};
 return {pixels,R,L,P,O,star};
}
function outline(pixels){
 const out=[...pixels];for(let y=0;y<32;y++)for(let x=0;x<32;x++)if(pixels[y*32+x])for(const [dx,dy]of [[-1,0],[1,0],[0,-1],[0,1]]){const xx=x+dx,yy=y+dy;if(xx>=0&&yy>=0&&xx<32&&yy<32&&!pixels[yy*32+xx])out[yy*32+xx]=INK;}
 return out;
}
function blade(r,x,y,tx,ty,{shade='#7895ad',face='#b9d5df',light='#eff4df',gold='#d7b470',hilt='#587196',width=2}={}){
 const {P,L}=r,dx=tx-x,dy=ty-y,d=Math.hypot(dx,dy)||1,nx=-dy/d,ny=dx/d;
 P([[x+nx*width,y+ny*width],[tx-dx/d*3+nx,ty-dy/d*3+ny],[tx,ty],[tx-dx/d*3-nx,ty-dy/d*3-ny],[x-nx*width,y-ny*width]],shade);
 P([[x,y],[tx,ty],[x+nx*width,y+ny*width]],face);L(x,y,tx-dx/d,ty-dy/d,light);
 L(x-dx/d*2,y-dy/d*2,x-dx/d*6,y-dy/d*6,hilt,2);
 L(x+nx*4,y+ny*4,x-nx*4,y-ny*4,gold,2);
 L(x-dx/d*7,y-dy/d*7,x-dx/d*8,y-dy/d*8,gold,2);
}
function heartKreuz(r,strong){
 const {P,R,L,star}=r,gold=strong?'#f1cf85':'#c4a66f';
 // The blue diamond behind the grip echoes the base armor's pleated skirt.
 P([[2,19],[8,17],[15,24],[10,30],[3,29]],'#3e537e');
 P([[4,21],[8,19],[12,24],[9,28],[4,27]],'#8196bc');
 L(5,23,9,26,'#c3ccdf');
 blade(r,10,22,27,3,{gold,width:3});
 P([[7,23],[10,20],[13,23],[10,26]],gold);R(9,22,2,2,strong?'#a8eeeb':'#d98da0');
 L(7,29,9,27,'#e7d4a2');
 // Small etched line and facets retain a sword's shape at low resolution.
 L(17,14,23,8,strong?'#f3dca4':'#8faec4');
 if(strong){P([[19,4],[22,5],[20,8]],'#d9b86c');star(4,7,'#f2d38b');star(27,25,'#f3d89a');}
}
function wheel(r,strong){
 const {P,L,O,R,star}=r,gold=strong?'#edce83':'#b4a67d';
 // Three long blades spread from the same hub; wing feathers anchor the fan.
 for(const side of [-1,1]){
  const p=(x,y)=>[16+side*x,y];
  P([p(3,24),p(9,18),p(14,18),p(10,22),p(14,23),p(9,26),p(11,28),p(5,28)],'#688497');
  P([p(5,24),p(11,20),p(8,24),p(10,25),p(6,27)],'#b4d4db');
  L(...p(5,25),...p(10,21),'#eef3de');
 }
 blade(r,15,23,3,6,{shade:'#758eaa',face:'#adc9d6',gold,width:1.5});
 blade(r,17,23,29,6,{shade:'#6f8ca3',face:'#c8dfdc',gold,width:1.5});
 blade(r,16,23,16,2,{shade:'#8fa9bd',face:'#e3ece0',gold,width:2});
 O(16,25,4,4,gold);O(16,25,2,2,strong?'#bfedf0':'#769cae');R(15,23,2,1,'#fff0be');
 if(strong){L(6,5,8,3,'#edce83');L(25,3,27,5,'#edce83');star(3,15,'#f4d892');star(29,24,'#f4d892');}
}
function blackWing(r,strong){
 const {P,L,R,star}=r;
 // A single bat wing curls around the broad, angular purple-black blade.
 P([[3,28],[2,20],[4,10],[10,2],[11,10],[15,5],[13,15],[18,12],[13,22],[12,28]],'#44384e');
 P([[4,24],[5,14],[9,7],[9,14],[13,11],[11,20],[14,18],[10,26]],'#796582');
 L(5,23,9,11,'#aa8ca9');L(6,24,11,20,'#b49ac0');
 P([[13,26],[10,22],[18,14],[23,4],[30,1],[29,9],[25,13],[24,18],[21,19],[18,24]],'#302b43');
 P([[14,23],[19,15],[24,7],[28,4],[27,10],[24,13],[23,17],[20,17],[18,22]],'#665478');
 P([[15,22],[21,13],[25,8],[25,12],[22,16],[20,16],[17,23]],'#aa8fb2');
 L(13,22,26,6,strong?'#ebc894':'#d2b7d2');
 L(11,20,18,27,strong?'#dfbd72':'#8b749d',2);L(10,26,7,29,'#4f3856',3);R(7,28,3,2,strong?'#efcc7b':'#bba1c6');
 P([[12,22],[15,22],[16,24],[14,26],[12,25]],strong?'#edc97b':'#b97f9d');
 if(strong){L(23,13,27,11,'#e5bd70');L(20,19,23,18,'#e5bd70');star(19,3,'#ebcc90');star(27,26,'#efcf8a');}
}
function adamantine(r,strong){
 const {P,L,R,O,star}=r,gold=strong?'#e8c983':'#b4c9cc';
 // Matching left/right towers are shields, not swords: wide winged plates,
 // raised central bosses and deep cyan facets make the defensive bash clear.
 for(const side of [-1,1]){
  const p=(x,y)=>[16+side*x,y];
  P([p(1,8),p(7,3),p(14,5),p(15,20),p(11,27),p(5,30),p(2,23)],'#426779');
  P([p(3,9),p(7,5),p(12,7),p(13,19),p(10,24),p(6,27),p(4,22)],'#7bafbf');
  P([p(4,10),p(7,7),p(9,8),p(9,22),p(6,25),p(5,20)],'#b8d9db');
  L(...p(3,9),...p(7,5),gold,2);L(...p(7,5),...p(12,7),gold,2);
  L(...p(7,8),...p(8,23),'#e4f2df');L(...p(12,11),...p(12,20),'#547e93');
  P([p(7,12),p(10,16),p(8,20),p(5,17)],'#466d83');
  P([p(7,13),p(9,16),p(7,18),p(6,16)],strong?'#f1d49a':'#d6eee0');
 }
 // A narrow lock line leaves the two shield silhouettes visibly separate.
 R(15,8,2,20,'#26384b');L(16,8,16,23,strong?'#b2e2de':'#668d9b');
 if(strong){O(16,4,2,2,'#e8c983');R(15,3,2,1,'#fff1bc');star(3,2,'#efda9b');star(28,28,'#efda9b');}
}
export function erzaWeaponPixels(id){
 if(!ERZA_WEAPON_ICON_IDS.includes(id))return null;
 if(cache.has(id))return cache.get(id);
 const strong=id.endsWith('-arsenal'),base=strong?id.slice(0,-8):id,r=raster();
 if(base==='erza-heartkreuz-blade')heartKreuz(r,strong);
 else if(base==='erza-wheel-blades')wheel(r,strong);
 else if(base==='erza-blackwing-sword')blackWing(r,strong);
 else adamantine(r,strong);
 const pixels=outline(r.pixels);cache.set(id,pixels);return pixels;
}
export function erzaWeaponArt(id){
 if(svgCache.has(id))return svgCache.get(id);
 const pixels=erzaWeaponPixels(id);if(!pixels)return null;
 const paths=new Map();
 for(let y=0;y<32;y++)for(let x=0;x<32;){const c=pixels[y*32+x];if(!c){x++;continue;}let end=x+1;while(end<32&&pixels[y*32+end]===c)end++;paths.set(c,(paths.get(c)||'')+`M${x+1} ${y+1}h${end-x}v1h-${end-x}Z`);x=end;}
 const svg=[...paths].map(([fill,d])=>`<path fill="${fill}" d="${d}"/>`).join('');svgCache.set(id,svg);return svg;
}
