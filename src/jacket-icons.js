// Jacket's icons on the 32×32 item grid: the teal Uzi firing tracers, Richard the Rooster's
// mask, twin Uzis crossed over a hammer for Hotline Massacre, and the Rampage's bloody
// hammer against a magenta-cyan neon grid.
export const JACKET_ICON_IDS=['uzi','roostermask','hotline','rampage'];
const cache=new Map(),INK='#120e18';
const TEAL='#3ab8c8',TEAL_DARK='#1a6a7a',TEAL_LIGHT='#8af0f8',PINK='#ff4a9a',CYAN='#4ac8d8',BLOOD='#d82838',STEEL='#8a8e9c';
function frame(){
 const p=Array(1024).fill(null),R=(x,y,w,h,c)=>{for(let yy=Math.round(y);yy<y+h;yy++)for(let xx=Math.round(x);xx<x+w;xx++)if(xx>=0&&yy>=0&&xx<32&&yy<32)p[yy*32+xx]=c;};
 const L=(x,y,tx,ty,c,w=1)=>{const n=Math.max(1,Math.abs(tx-x),Math.abs(ty-y));for(let i=0;i<=n;i++)R(x+(tx-x)*i/n,y+(ty-y)*i/n,w,w,c);};
 const E=(x,y,rx,ry,c)=>{for(let yy=0;yy<32;yy++)for(let xx=0;xx<32;xx++)if(((xx+.5-x)/rx)**2+((yy+.5-y)/ry)**2<=1)R(xx,yy,1,1,c);};
 const T=(pts,c)=>{for(let yy=0;yy<32;yy++)for(let xx=0;xx<32;xx++){let inside=false;for(let i=0,j=pts.length-1;i<pts.length;j=i++){const [xi,yi]=pts[i],[xj,yj]=pts[j];if((yi>yy+.5)!==(yj>yy+.5)&&xx+.5<(xj-xi)*(yy+.5-yi)/(yj-yi)+xi)inside=!inside;}if(inside)R(xx,yy,1,1,c);}};
 return {p,R,L,E,T};
}
// An Uzi pointing right: receiver, short barrel with suppressor, grip and magazine.
function uzi(a,dx,dy,s=1){const {R}=a,X=x=>dx+x*s,Y=y=>dy+y*s;
 R(X(0),Y(0),13*s,5*s,TEAL_DARK);R(X(1),Y(1),11*s,3*s,TEAL);R(X(1),Y(1),11*s,1*s,TEAL_LIGHT);R(X(13),Y(1),6*s,3*s,'#1a1a22');R(X(13),Y(1.5),6*s,1*s,'#3a3a48');
 R(X(4),Y(5),3*s,7*s,'#1a1a22');R(X(4),Y(5),1*s,7*s,'#3a3a48');R(X(8),Y(5),3*s,3*s,TEAL_DARK);R(X(-2),Y(1),2*s,2*s,TEAL_DARK);}
function hammer(a,x0,y0,x1,y1){const {L,R}=a;L(x0,y0,x1,y1,'#5a3a20',3);L(x0,y0,x1,y1,'#8a5a30',1);R(x1-4,y1-3,9,6,'#5a5e6a');R(x1-4,y1-3,9,2,'#d8dce8');R(x1+2,y1+1,2,2,BLOOD);}
export function jacketIconPixels(id){
 if(!JACKET_ICON_IDS.includes(id))return null;if(cache.has(id))return cache.get(id);const a=frame(),{R,L,E,T}=a;
 if(id==='uzi'){uzi(a,5,12,1);for(const [x,y,w]of [[26,13,5],[27,11,3],[27,15,3]])R(x,y,w,1,'#ffe08a');R(30,13,2,1,'#ffffff');for(const [x,y]of [[3,26],[9,28],[14,26]])R(x,y,1,1,BLOOD);}
 else if(id==='roostermask'){// Richard: a grimy, worn rooster mask with hollow red-rimmed sockets and a hooked beak.
  T([[11,9],[11,1],[14,4],[16,0],[19,4],[21,1],[23,5],[22,10]],'#4e0a12');T([[12,9],[12,3],[14,6],[16,2],[19,6],[21,3],[22,7],[21,10]],'#8a1a22');
  E(16,17,12.5,11.5,'#4e4438');E(16,17,11.5,10.5,'#7e7262');E(16,15,9,7,'#c8bca6');for(const [x0,y0,x1,y1]of [[6,20,7,27],[26,20,25,27],[9,9,12,7],[8,24,6,29],[24,24,26,29]])L(x0,y0,x1,y1,'#4e4438');
  for(const x of [11,21]){E(x,14,3.8,3.4,'#a8323a');E(x,14.5,2.2,2.2,'#060408');R(x,14,1,1,'#3a4a58');}L(7,10,13,12,'#4e4438');L(25,10,19,12,'#4e4438');
  T([[12,18],[20,18],[21,21],[17,26],[14,25],[12,21]],'#6a4a20');T([[13,18],[19,18],[20,21],[17,24],[14,22]],'#b08a4a');L(13,21,19,20,'#6a4a20');R(17,25,1,1,'#d82838');
  T([[12,24],[16,27],[19,25],[19,30],[16,32],[12,30]],'#4e0a12');T([[13,25],[16,27],[18,26],[18,29],[16,31],[13,29]],'#8a1a22');}
 else if(id==='hotline'){// Hotline Massacre: twin Uzis crossed over a thrown hammer, a neon backdrop.
  E(16,16,15.5,15.5,'#5a1a4a');E(16,16,14.5,14.5,'#1a0a1e');for(let i=0;i<5;i++){L(3,8+i*5,29,8+i*5,i%2?'#3a1a3a':'#2a1a3a');}
  hammer(a,8,27,22,10);uzi(a,3,6,.9);uzi(a,9,19,.9);
  for(const [x,y]of [[26,8],[28,24],[5,27]])R(x,y,1,1,PINK);}
 else{// Hotline Rampage: the bloody hammer raised over a neon floor grid.
  E(16,16,15.5,15.5,PINK);E(16,16,14.5,14.5,'#1a0a1e');for(let i=0;i<7;i++){L(4+i*4,18,i<3?2:i>3?30:16,31,i%2?'#ff4a9a88':CYAN);}L(2,18,30,18,PINK);L(3,23,29,23,'#ff4a9a');
  hammer(a,10,28,20,7);for(const [x,y]of [[8,12],[25,10],[22,26],[12,24],[27,20]])R(x,y,2,2,BLOOD);R(13,5,1,1,'#ffffff');}
 const result=[...a.p];for(let y=0;y<32;y++)for(let x=0;x<32;x++)if(a.p[y*32+x])for(const [dx,dy]of [[1,0],[-1,0],[0,1],[0,-1]]){const xx=x+dx,yy=y+dy;if(xx>=0&&xx<32&&yy>=0&&yy<32&&!a.p[yy*32+xx])result[yy*32+xx]=INK;}
 cache.set(id,result);return result;
}
export function jacketIcon(id){const p=jacketIconPixels(id);return p?p.map((c,i)=>c?`<rect x="${i%32+1}" y="${Math.floor(i/32)+1}" width="1" height="1" fill="${c}"/>`:'').join(''):null;}
