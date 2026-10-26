// Native equipment icons and original effects for the five Soul Gems.
// These drawings only read saved simulation state; they never create hitboxes.
export const SOUL_GEM_ART_IDS=['soulgem','bluegem','yellowgem','redgem','purplegem','salvation','quintet','soulbond'];
export const SOUL_GEM_COLORS=['#f6add5','#a5dafa','#f5d48b','#ee9a9f','#c7b1ed'];
const INK='#293346',GOLD='#c5a56d',LIGHT='#f4e4b6',TAU=Math.PI*2,cache=new Map();
const finite=(n,fallback=0)=>Number.isFinite(n)?n:fallback;
const clamp=n=>Math.max(0,Math.min(1,finite(n)));
function pixelFrame(){
 const p=Array(1024).fill(null),R=(x,y,w,h,c)=>{for(let yy=Math.round(y);yy<y+h;yy++)for(let xx=Math.round(x);xx<x+w;xx++)if(xx>=0&&xx<32&&yy>=0&&yy<32)p[yy*32+xx]=c;};
 const L=(x,y,tx,ty,c,w=1)=>{const n=Math.max(Math.abs(tx-x),Math.abs(ty-y),1);for(let i=0;i<=n;i++)R(x+(tx-x)*i/n,y+(ty-y)*i/n,w,w,c);};
 const P=(points,c)=>{for(let y=0;y<32;y++)for(let x=0;x<32;x++){let inside=false;for(let i=0,j=points.length-1;i<points.length;j=i++){const a=points[i],b=points[j];if((a[1]>y+.5)!==(b[1]>y+.5)&&x+.5<(b[0]-a[0])*(y+.5-a[1])/(b[1]-a[1])+a[0])inside=!inside;}if(inside)R(x,y,1,1,c);}};
 const E=(x,y,rx,ry,c)=>{for(let yy=0;yy<32;yy++)for(let xx=0;xx<32;xx++)if(((xx+.5-x)/rx)**2+((yy+.5-y)/ry)**2<=1)R(xx,yy,1,1,c);};
 return{p,R,L,P,E};
}
function gemBase(a,index){
 const {P,E,L,R}=a,pal=[['#9e587e','#d97ba8','#f7c3dc'],['#4b7fa6','#77b5d7','#c2e6ed'],['#aa843c','#dfbc64','#ffedaa'],['#8e3c50','#cf5c6c','#f4a49f'],['#715b9a','#a88dca','#dfcaf0']][index];
 // A narrow gold mount leaves most of the egg-shaped crystalline body visible.
 P([[16,2],[23,7],[26,17],[24,24],[20,28],[12,28],[8,24],[6,17],[9,7]],GOLD);
 E(16,16,8,11,pal[0]);P([[16,4],[22,9],[23,17],[20,24],[15,26],[10,21],[9,15],[12,7]],pal[1]);
 P([[15,6],[18,9],[18,17],[14,22],[11,17],[12,10]],pal[2]);L(14,6,12,12,'#fff1de');R(12,9,2,3,'#fff7e4');
 P([[10,25],[16,27],[22,25],[25,28],[22,30],[10,30],[7,28]],GOLD);L(9,28,23,28,LIGHT);R(13,30,6,1,'#8b7c74');
 L(8,13,8,20,LIGHT);L(24,13,24,20,LIGHT);return pal;
}
function gem(a,index){
 const {P,E,L,R}=a;gemBase(a,index);
 if(index===0){
  // Madoka: a rose crown and small petal claws.
  P([[16,1],[18,3],[21,3],[20,6],[16,8],[12,6],[11,3],[14,3]],GOLD);P([[16,2],[19,4],[17,6],[14,6],[13,4]],'#e09aab');R(15,3,2,2,'#f8d6d6');
  for(const side of [-1,1]){P([[16+side*8,20],[16+side*12,22],[16+side*8,25],[16+side*5,23]],GOLD);L(16+side*8,21,16+side*8,23,LIGHT);}
  L(13,16,16,13,LIGHT);L(16,13,19,16,LIGHT);L(19,16,16,20,LIGHT);L(16,20,13,16,LIGHT);
 }else if(index===1){
  // Sayaka: crescent flourish and a music-note inlay.
  E(6,16,4,9,GOLD);E(7,15,3,7,INK);L(4,13,5,8,LIGHT);L(7,24,10,25,GOLD,2);
  L(18,12,18,20,LIGHT,2);L(18,12,21,13,LIGHT);E(16,20,3,2,LIGHT);L(13,24,17,25,'#d9e5c6');
  P([[23,22],[29,19],[28,24],[24,27],[21,26]],GOLD);L(24,24,27,22,LIGHT);
 }else if(index===2){
  // Mami: a six-petal flower and ribbon-shaped base.
  for(let i=0;i<6;i++){const t=i*TAU/6;E(16+Math.cos(t)*4,5+Math.sin(t)*3,2,2,GOLD);}E(16,5,2,2,LIGHT);
  P([[8,23],[3,26],[8,27],[7,30],[14,27]],GOLD);P([[24,23],[29,26],[24,27],[25,30],[18,27]],GOLD);
  for(let i=0;i<5;i++){const t=i*TAU/5;E(16+Math.cos(t)*3,17+Math.sin(t)*3,1.5,1.5,LIGHT);}E(16,17,1.5,1.5,'#9e743f');
  L(11,28,14,27,LIGHT);L(21,28,18,27,LIGHT);
 }else if(index===3){
  // Kyoko: pointed spear crest, diamond inlay and linked lower mount.
  P([[16,0],[20,5],[16,8],[12,5]],GOLD);P([[16,1],[18,5],[16,6],[14,5]],LIGHT);
  P([[16,11],[20,17],[16,23],[12,17]],'#f3d8ad');P([[16,14],[18,17],[16,20],[14,17]],'#b45a72');
  P([[7,19],[3,23],[6,27],[10,25]],GOLD);P([[25,19],[29,23],[26,27],[22,25]],GOLD);L(5,23,7,25,LIGHT);L(27,23,25,25,LIGHT);
 }else{
  // Homura: a protective circular frame with a tiny hourglass.
  E(16,16,13,9,GOLD);E(16,16,11,7,INK);E(16,16,8,10,'#a88dca');P([[15,7],[18,10],[18,17],[14,22],[11,17],[12,10]],'#dfcaf0');R(12,9,2,3,'#fff7e4');
  L(13,12,20,12,LIGHT);L(13,22,20,22,LIGHT);L(14,13,19,21,LIGHT);L(19,13,14,21,LIGHT);R(15,15,3,4,'#876f9f');R(16,16,1,2,LIGHT);
  L(5,14,5,18,LIGHT);L(27,14,27,18,LIGHT);
 }
}
// Soul Bond: three gems tied together by a pink ribbon, the circle not yet closed.
function soulBondIcon(a){
 const {L,R,E}=a,gems=[[10,11,'#77b5d7','#c2e6ed'],[22,11,'#a88dca','#dfcaf0'],[16,23,'#d97ba8','#f7c3dc']];
 for(const [[x,y],[nx,ny]]of [[gems[0],gems[1]],[gems[1],gems[2]],[gems[2],gems[0]]])L(x,y,nx,ny,'#b85a86',2);
 for(const [x,y,base,light]of gems){E(x,y+1,5,6,GOLD);E(x,y,4,5,base);E(x-1,y-2,1.6,2,light);R(x-3,y+5,7,1,GOLD);}
 // The ribbon knot and its loose tails.
 E(16,15,2.2,2.2,'#f2a6c6');L(16,15,12,19,'#f2a6c6');L(16,15,20,19,'#f2a6c6');R(15,14,2,1,'#ffe0ee');
}
function quintetIcon(a){
 const {P,L,R,E}=a,positions=[[16,6],[26,13],[22,25],[10,25],[6,13]];
 // Five egg-shaped crystals sit in individual gold claws around a silver
 // rosette. The linked frame, rather than a sixth crystal, unites the wishes.
 E(16,17,11,11,'#8795a3');E(16,17,9,9,INK);
 for(let i=0;i<5;i++){
  const [x,y]=positions[i],[nx,ny]=positions[(i+1)%5];
  L(x,y,nx,ny,GOLD,2);L(x,y-1,nx,ny-1,LIGHT);
  L(16,17,x,y,'#a8b5b9',2);L(16,17,x,y,LIGHT);
 }
 const star=[];for(let i=0;i<10;i++){const t=-Math.PI/2+i*Math.PI/5,r=i%2?3.5:7.5;star.push([16+Math.cos(t)*r,17+Math.sin(t)*r]);}
 P(star,GOLD);E(16,17,4,4,'#d8d7be');E(16,17,2,2,'#fff1d7');R(15,15,1,1,'#ffffff');
 positions.forEach(([x,y],i)=>{
  const dx=x-16,dy=y-17,n=Math.hypot(dx,dy)||1;
  P([[x+dx/n*6,y+dy/n*6],[x+3,y-3],[x+4,y+3],[x-4,y+3],[x-3,y-3]],GOLD);
  E(x,y,4,5,GOLD);E(x,y,3,4,['#ae638b','#6495b8','#c29a4c','#b65c70','#9276b3'][i]);
  P([[x,y-4],[x+2,y-1],[x+2,y+2],[x,y+4],[x-2,y+1],[x-2,y-2]],SOUL_GEM_COLORS[i]);
  L(x-1,y-2,x-1,y,'#fff3de');R(x-1,y-2,1,1,'#ffffff');
  R(x-4,y+1,1,2,LIGHT);R(x+3,y+1,1,2,LIGHT);
 });
}
function bowIcon(a){
 const {P,L,R,E}=a;
 // White-gold bow with three feather vanes and a five-colour constellation.
 L(21,3,12,16,GOLD,3);L(12,16,21,29,GOLD,3);L(21,3,8,8,GOLD,3);L(8,8,5,14,GOLD,3);L(5,14,12,16,GOLD,3);L(12,16,5,19,GOLD,3);L(5,19,8,25,GOLD,3);L(8,25,21,29,GOLD,3);
 L(20,4,9,9,LIGHT,2);L(9,9,7,13,LIGHT,2);L(7,13,13,16,LIGHT,2);L(13,16,7,20,LIGHT,2);L(7,20,9,24,LIGHT,2);L(9,24,20,28,LIGHT,2);L(21,3,12,16,'#fff0dc');L(12,16,21,29,'#fff0dc');
 for(let i=0;i<3;i++){P([[8-i*2,10+i*3],[2,6+i*3],[3,12+i*3],[9-i*2,16+i*2]],'#e4ded5');L(3,8+i*3,7,13+i*2,'#fff7e3');}
 L(2,17,29,17,'#f7e6c4',2);P([[31,17],[23,12],[25,17],[23,22]],'#f7ecd3');L(14,17,28,17,'#ffffff');
 const positions=[[16,3],[25,7],[29,15],[24,25],[15,29]];
 positions.forEach(([x,y],i)=>{E(x,y,3,3,GOLD);E(x,y,2,2,SOUL_GEM_COLORS[i]);R(x-1,y-1,1,1,'#fff4df');});
 E(11,16,4,4,'#cf93af');P([[11,12],[14,15],[12,19],[9,19],[8,15]],'#f2bfd0');R(10,14,2,2,'#fff1d8');
}
export function soulGemPixels(id){
 if(!SOUL_GEM_ART_IDS.includes(id))return null;if(cache.has(id))return cache.get(id);
 const a=pixelFrame(),index=SOUL_GEM_ART_IDS.indexOf(id);if(index<5)gem(a,index);else if(id==='quintet')quintetIcon(a);else if(id==='soulbond')soulBondIcon(a);else bowIcon(a);
 const result=[...a.p];for(let y=0;y<32;y++)for(let x=0;x<32;x++)if(a.p[y*32+x])for(const[dx,dy]of[[-1,0],[1,0],[0,-1],[0,1]]){const xx=x+dx,yy=y+dy;if(xx>=0&&xx<32&&yy>=0&&yy<32&&!a.p[yy*32+xx])result[yy*32+xx]=INK;}
 cache.set(id,result);return result;
}
export function soulGemIcon(id){const p=soulGemPixels(id);return p?p.map((c,i)=>c?`<rect x="${i%32+1}" y="${Math.floor(i/32)+1}" width="1" height="1" fill="${c}"/>`:'').join(''):null;}
const line=(c,points,color,width=1)=>{c.strokeStyle=color;c.lineWidth=width;c.lineCap='round';c.lineJoin='round';c.beginPath();points.forEach(([x,y],i)=>i?c.lineTo(x,y):c.moveTo(x,y));c.stroke();};
const poly=(c,points,color,edge=INK,width=1.5)=>{c.fillStyle=color;c.beginPath();points.forEach(([x,y],i)=>i?c.lineTo(x,y):c.moveTo(x,y));c.closePath();c.fill();if(edge){c.strokeStyle=edge;c.lineWidth=width;c.stroke();}};
function disc(c,x,y,r,color,edge=null){c.fillStyle=color;c.beginPath();c.arc(x,y,Math.max(.1,r),0,TAU);c.fill();if(edge){c.strokeStyle=edge;c.lineWidth=1.2;c.stroke();}}
function ring(c,r,color,width=1){c.strokeStyle=color;c.lineWidth=width;c.beginPath();c.arc(0,0,Math.max(.1,r),0,TAU);c.stroke();}
const wishIndex=s=>Math.max(0,Math.min(4,Math.floor(finite(s.wish,finite(s.colorIndex)))));
function petal(c,x,y,r,angle,color){c.save();c.translate(x,y);c.rotate(angle);poly(c,[[-r,0],[-r*.35,-r*.55],[r*.6,-r*.35],[r,0],[r*.3,r*.5],[-r*.5,r*.3]],color,'#65546d',1);c.restore();}
function star(c,x,y,r,color){line(c,[[x-r,y],[x+r,y]],color,1);line(c,[[x,y-r],[x,y+r]],color,1);disc(c,x,y,Math.max(.7,r*.22),'#fff4de');}
// Full world coordinates, before the generic projectile translation.
export function drawSalvationProjectile(c,s,{zoom=1,reducedMotion=false}={}){
 if(s.type!=='salvation-arrow'||s.life<=0||![s.x,s.y].every(Number.isFinite))return false;
 const index=wishIndex(s),color=SOUL_GEM_COLORS[index],t=reducedMotion?0:finite(s.age),scale=Math.max(1,.75/Math.max(.35,finite(zoom,1)));
 c.save();c.translate(s.x,s.y);c.rotate(Math.atan2(finite(s.vy),finite(s.vx,1)));c.scale(scale,scale);
 // A narrow shaft stays readable while feather wings expose the scenery.
 line(c,[[-36,0],[15,0]],'#263245',6);line(c,[[-34,0],[15,0]],color,3.5);line(c,[[-24,0],[19,0]],'#fff7df',1.2);
 for(const side of [-1,1]){
  poly(c,[[-16,0],[-29,side*13],[-17,side*10],[-6,side*3]],'#e8e3d3','#7c7888',1);
  poly(c,[[-16,0],[-34,side*7],[-23,side*10],[-9,side*3]],color,'#7c7888',1);
  line(c,[[-26,side*9],[-11,side*2]],'#fff3de',1);
 }
 poly(c,[[24,0],[10,-8],[13,0],[10,8]],'#fff3d7','#baa07f',1.3);poly(c,[[19,0],[10,-4],[12,0],[10,4]],color,null);
 disc(c,5,0,4.3,color,'#eedeb0');disc(c,4,-1,1.5,'#fff7e5');
 if(!reducedMotion){for(let i=0;i<3;i++){const f=(t*1.9+i*.33)%1,x=-20-f*28,y=Math.sin(t*6+i*2.1)*5;petal(c,x,y,2.5,t+i,color);}star(c,-18,Math.sin(t*4)*7,2,'#eadca5');}
 c.restore();return true;
}
function wishSeal(c,r,t,quiet){
 const points=[];for(let i=0;i<5;i++){const a=-Math.PI/2+i*TAU/5;points.push([Math.cos(a)*r,Math.sin(a)*r]);}
 c.save();c.globalAlpha*=.75;line(c,[...points,points[0]],'#ead9b9',1);c.globalAlpha*=.7;line(c,[points[0],points[2],points[4],points[1],points[3],points[0]],'#ebddd1',1);c.restore();
 points.forEach(([x,y],i)=>{disc(c,x,y,Math.max(2,r*.065),SOUL_GEM_COLORS[i],'#ead7a6');star(c,x,y,Math.max(3,r*.1),'#f5e6bd');if(!quiet)petal(c,x*.72,y*.72,Math.max(2,r*.055),t+i,SOUL_GEM_COLORS[i]);});
}
export function drawSalvationEffect(c,e,progress,reducedMotion=false){
 if(!['salvation-cast','salvation-bloom'].includes(e.type))return false;
 if(![e.x,e.y].every(Number.isFinite))return true;
 const p=clamp(progress),r=Math.max(8,finite(e.r,80)),index=wishIndex(e),color=SOUL_GEM_COLORS[index],t=reducedMotion?0:p,rr=r*(reducedMotion?.72:.35+p*.6);
 c.save();c.translate(e.x,e.y);c.globalAlpha*=Math.max(0,1-p)*.9;
 if(e.type==='salvation-cast'){
  ring(c,rr,'#eadcc2',1.5);wishSeal(c,rr*.84,t,reducedMotion);
  // A small white-gold crescent echoes the upgraded bow as the five wishes unite.
  c.strokeStyle='#fff0d3';c.lineWidth=2;c.beginPath();c.arc(0,0,rr*.45,-1.3,1.3);c.stroke();line(c,[[Math.cos(-1.3)*rr*.45,Math.sin(-1.3)*rr*.45],[0,0],[Math.cos(1.3)*rr*.45,Math.sin(1.3)*rr*.45]],color,1.5);
 }else{
  ring(c,rr*.95,color,1.4);ring(c,rr*.77,'#ead8c155',1);wishSeal(c,rr*.7,t,reducedMotion);
  for(let i=0;i<5;i++){const a=-Math.PI/2+i*TAU/5;petal(c,Math.cos(a)*rr*.26,Math.sin(a)*rr*.26,rr*.27,a,SOUL_GEM_COLORS[(index+i)%5]);}
  disc(c,0,0,Math.max(2,rr*.09),'#fff5d8');
  if(!reducedMotion)for(let i=0;i<5;i++){const a=i*2.399+t*.5,d=rr*.92;star(c,Math.cos(a)*d,Math.sin(a)*d,3,'#f6e6b9');}
 }
 c.restore();return true;
}
