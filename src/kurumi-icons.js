// Kurumi's weapon, passive, evolution and ultimate icons on the 32×32 item grid: Zafkiel's
// gilded flintlock with a clock set in its lock plate, an antique gold pocket watch, the
// Seventh Bullet's crossed guns over Zafkiel's great dial, and the City of Devouring Time:
// a crimson clock above a shadow pool where pale hands and red eyes rise.
export const KURUMI_ICON_IDS=['clockshot','timepiece','zafkiel','clockdomain'];
const cache=new Map(),INK='#1a1018';
const GOLD='#d9b45f',GOLD_DARK='#9c7334',GOLD_LIGHT='#f6dc94',RED='#d14a5c',RED_DARK='#7a2f45',IRON='#2c2833',IRON_LIGHT='#5a5466',WOOD='#5a1f2a',WOOD_LIGHT='#8a3a40';
function frame(){
 const p=Array(1024).fill(null),R=(x,y,w,h,c)=>{for(let yy=Math.round(y);yy<y+h;yy++)for(let xx=Math.round(x);xx<x+w;xx++)if(xx>=0&&yy>=0&&xx<32&&yy<32)p[yy*32+xx]=c;};
 const L=(x,y,tx,ty,c,w=1)=>{const n=Math.max(1,Math.abs(tx-x),Math.abs(ty-y));for(let i=0;i<=n;i++)R(x+(tx-x)*i/n,y+(ty-y)*i/n,w,w,c);};
 const E=(x,y,rx,ry,c)=>{for(let yy=0;yy<32;yy++)for(let xx=0;xx<32;xx++)if(((xx+.5-x)/rx)**2+((yy+.5-y)/ry)**2<=1)R(xx,yy,1,1,c);};
 const T=(pts,c)=>{for(let yy=0;yy<32;yy++)for(let xx=0;xx<32;xx++){let inside=false;for(let i=0,j=pts.length-1;i<pts.length;j=i++){const [xi,yi]=pts[i],[xj,yj]=pts[j];if((yi>yy+.5)!==(yj>yy+.5)&&xx+.5<(xj-xi)*(yy+.5-yi)/(yj-yi)+xi)inside=!inside;}if(inside)R(xx,yy,1,1,c);}};
 return {p,R,L,E,T};
}
// A clock face: rim, face, twelve ticks (quarters brighter) and two hands.
function dial(a,cx,cy,r,{rim=GOLD,rimDark=GOLD_DARK,face='#f4ead2',tick=IRON,major=RED_DARK,hour=[-1,-.5],minute=[0,-1],hand=IRON,hot=-1}={}){
 const {E,R,L}=a;E(cx,cy,r,r,rimDark);E(cx,cy,r-.8,r-.8,rim);E(cx,cy,r-1.8,r-1.8,face);
 for(let i=0;i<12;i++){const t=i*Math.PI/6-Math.PI/2,d=r-2.6;R(cx+Math.cos(t)*d-.5,cy+Math.sin(t)*d-.5,1,1,i===hot?RED:i%3?tick:major);}
 L(cx,cy,cx+hour[0]*(r-4.5),cy+hour[1]*(r-4.5),hand);L(cx,cy,cx+minute[0]*(r-3),cy+minute[1]*(r-3),hand);R(cx-.5,cy-.5,1,1,RED);
}
// Zafkiel's short gun pointing right: iron barrel with gold bands, a round gilded lock plate
// holding a tiny clock, the cocked hammer, trigger guard and a rosewood grip with a gold cap.
function pistol(a,dx=0,dy=0){const {R,L,T,E}=a,X=x=>x+dx,Y=y=>y+dy;
 T([[X(7),Y(14)],[X(14),Y(14)],[X(12),Y(20)],[X(10),Y(27)],[X(4),Y(28)],[X(4),Y(25)],[X(6),Y(19)]],WOOD);L(X(7),Y(17),X(5),Y(25),WOOD_LIGHT);
 R(X(3),Y(27),8,2,GOLD);R(X(3),Y(27),8,1,GOLD_LIGHT);
 R(X(12),Y(12),13,2,WOOD);R(X(12),Y(12),12,1,WOOD_LIGHT);
 R(X(12),Y(8),17,4,IRON);R(X(12),Y(8),17,1,IRON_LIGHT);for(const x of [17,23])R(X(x),Y(8),1,4,GOLD);
 R(X(28),Y(7),3,6,GOLD);R(X(28),Y(7),3,1,GOLD_LIGHT);R(X(30),Y(9),1,2,'#120d14');
 L(X(8),Y(9),X(6),Y(5),IRON,2);R(X(4),Y(3),4,2,GOLD);R(X(5),Y(3),2,1,GOLD_LIGHT);
 E(X(10.5),Y(12),4.6,4.6,GOLD_DARK);dial(a,X(10.5),Y(12),4,{face:'#fbefd6',hour:[-.7,-.7],minute:[0,-1]});
 L(X(14),Y(16),X(14),Y(20),GOLD);L(X(14),Y(20),X(19),Y(20),GOLD);L(X(19),Y(20),X(20),Y(14),GOLD);R(X(16),Y(14),1,4,IRON);
}
export function kurumiIconPixels(id){
 if(!KURUMI_ICON_IDS.includes(id))return null;if(cache.has(id))return cache.get(id);const a=frame(),{R,L,E,T}=a;
 if(id==='clockshot'){// Zafkiel Flintlock, with a red ribbon tied at the grip and a spark at the muzzle.
  pistol(a,0,2);L(9,29,6,31,RED,1);L(10,29,12,31,RED_DARK,1);R(9,28,2,2,RED);
  for(const [x,y]of [[30,6],[30,15],[27,5]])R(x,y,1,1,GOLD_LIGHT);}
 else if(id==='timepiece'){// Time Reserve: an open gold pocket watch on its chain, a red second hand sweeping.
  for(let i=0;i<10;i++){const t=i/9,x=Math.round(9-t*6+Math.sin(t*Math.PI)*-2),y=Math.round(8+t*22);if(i%2)R(x,y,2,1,GOLD);else R(x,y,1,2,GOLD_DARK);}
  // The bow ring and crown above the case.
  E(16.5,3,3.5,2.6,GOLD_DARK);E(16.5,3,2,1.2,null);R(15,5,3,2,GOLD);R(15,5,3,1,GOLD_LIGHT);
  dial(a,16.5,18,12,{face:'#f4ead2',hour:[.55,-.75],minute:[-.2,-1]});
  L(16.5,18,22,25,RED);for(const [x,y]of [[10,13],[11,12]])R(x,y,1,1,'#ffffff');for(const [x,y]of [[27,8],[29,26]])R(x,y,1,1,GOLD_LIGHT);}
 else if(id==='zafkiel'){// Seventh Bullet: a red clock round pierces Zafkiel's great dial, its hand frozen at VII.
  E(16,16,15.5,15.5,GOLD_DARK);E(16,16,14.6,14.6,GOLD);E(16,16,13.4,13.4,'#1b1419');E(16,16,9.5,9.5,'#2a1c26');
  for(let i=0;i<12;i++){const t=i*Math.PI/6-Math.PI/2,c=i===7?RED:i%3?GOLD_DARK:GOLD_LIGHT;L(16+Math.cos(t)*10.5,16+Math.sin(t)*10.5,16+Math.cos(t)*12.5,16+Math.sin(t)*12.5,c,i===7?2:1);}
  const seven=7*Math.PI/6-Math.PI/2,sx=16+Math.cos(seven)*11.5,sy=16+Math.sin(seven)*11.5;E(sx,sy,2.6,2.6,RED);E(sx,sy,1.3,1.3,'#ffc0b0');
  L(16,16,16+Math.cos(seven)*8,16+Math.sin(seven)*8,GOLD_LIGHT,2);L(16,16,16,7,GOLD,1);E(16,16,1.6,1.6,GOLD_LIGHT);
  // The round itself: a dark wake, a scarlet body and a gold clock core, flying to the upper left.
  L(27,27,18,18,'#3a1420',4);L(27,27,18,18,RED_DARK,2);
  T([[21,17],[11,9],[5,5],[9,11],[17,21]],RED_DARK);T([[19,17],[11,10],[7,7],[10,12],[17,19]],RED);T([[11,10],[5,5],[9,11]],'#ffc0b0');
  E(16,16,2.6,2.6,GOLD);E(16,16,1.4,1.4,'#fff0ce');R(15.5,15.5,1,1,RED_DARK);
  for(const [x,y]of [[6,20],[20,27],[27,22]])R(x,y,1,1,'#ffd0c0');}
 else{// City of Devouring Time: a gold clock in a crimson sky over a shadow pool where three
  // twin-tailed shadow doubles rise, each with one red and one golden eye.
  E(16,16,15.5,15.5,'#8a2438');E(16,16,14.5,14.5,'#5a1828');E(16,12,12,9,'#7a2034');for(const [x,y]of [[5,9],[26,8],[6,15],[26,15]])R(x,y,1,1,'#f0a0a8');
  dial(a,16,9,6.5,{rim:GOLD,face:'#2e0c18',tick:GOLD_DARK,major:GOLD_LIGHT,hand:GOLD_LIGHT,hour:[-.6,-.8],minute:[.1,-1]});
  const S='#140810',shadow=(x,top,big,c,o=0)=>{const hr=big?2.6:2,by=top+hr;
   T([[x-hr+o,by],[x+hr+o,by],[x+hr+2+o,29],[x-hr-2+o,29]],c);E(x+o,top+hr*.7,hr,hr,c);
   for(const s0 of [-1,1])T([[x+s0*hr*.5+o,top+.5],[x+s0*(hr+1.2)+o,top+1.5],[x+s0*(hr+1.6)+o,by+5],[x+s0*(hr+.5)+o,by+3]],c);};
  E(16,28.5,14,3.5,RED_DARK);E(16,29,13,2.8,'#120a10');
  for(const [x,top,big]of [[7,19,0],[25,19,0],[16,16,1]]){shadow(x,top,big,'#c0485c',1);shadow(x,top,big,S);R(x-1-big,top+1+big,1,1,RED);R(x+1,top+1+big,1,1,GOLD);}
  for(const [x,y]of [[11,28],[21,28]])R(x,y,1,1,RED);}
 const result=[...a.p];for(let y=0;y<32;y++)for(let x=0;x<32;x++)if(a.p[y*32+x])for(const [dx,dy]of [[1,0],[-1,0],[0,1],[0,-1]]){const xx=x+dx,yy=y+dy;if(xx>=0&&xx<32&&yy>=0&&yy<32&&!a.p[yy*32+xx])result[yy*32+xx]=INK;}
 cache.set(id,result);return result;
}
export function kurumiIcon(id){const p=kurumiIconPixels(id);return p?p.map((c,i)=>c?`<rect x="${i%32+1}" y="${Math.floor(i/32)+1}" width="1" height="1" fill="${c}"/>`:'').join(''):null;}
