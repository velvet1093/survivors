// Gojo's inventory, evolution and ultimate icons on the 32×32 item grid: the Cursed Blue
// vortex, the Reversal Red orb, a glowing Six Eyes iris, Hollow Purple born from red and
// blue colliding, and the Unlimited Void domain with his hand sign.
export const GOJO_ICON_IDS=['blue','red','eyes','purple','void'];
const cache=new Map(),INK='#0e0c1a';
function frame(){
 const p=Array(1024).fill(null),R=(x,y,w,h,c)=>{for(let yy=Math.round(y);yy<y+h;yy++)for(let xx=Math.round(x);xx<x+w;xx++)if(xx>=0&&yy>=0&&xx<32&&yy<32)p[yy*32+xx]=c;};
 const L=(x,y,tx,ty,c,w=1)=>{const n=Math.max(1,Math.abs(tx-x),Math.abs(ty-y));for(let i=0;i<=n;i++)R(x+(tx-x)*i/n,y+(ty-y)*i/n,w,w,c);};
 const E=(x,y,rx,ry,c)=>{for(let yy=0;yy<32;yy++)for(let xx=0;xx<32;xx++)if(((xx+.5-x)/rx)**2+((yy+.5-y)/ry)**2<=1)R(xx,yy,1,1,c);};
 const T=(pts,c)=>{for(let yy=0;yy<32;yy++)for(let xx=0;xx<32;xx++){let inside=false;for(let i=0,j=pts.length-1;i<pts.length;j=i++){const [xi,yi]=pts[i],[xj,yj]=pts[j];if((yi>yy+.5)!==(yj>yy+.5)&&xx+.5<(xj-xi)*(yy+.5-yi)/(yj-yi)+xi)inside=!inside;}if(inside)R(xx,yy,1,1,c);}};
 return {p,R,L,E,T};
}
// Spiral arms winding into a centre.
function spiral(a,cx,cy,r,arms,turn,colors){for(let k=0;k<arms;k++)for(let i=0;i<=40;i++){const t=i/40,ang=k*Math.PI*2/arms+t*turn,d=r*(1-t);a.R(cx+Math.cos(ang)*d,cy+Math.sin(ang)*d,t<.5?2:1,t<.5?2:1,colors[i%colors.length]);}}
export function gojoIconPixels(id){
 if(!GOJO_ICON_IDS.includes(id))return null;if(cache.has(id))return cache.get(id);const a=frame(),{R,L,E,T}=a;
 if(id==='blue'){// Cursed Blue: a dark core swallowing spiral arms of cyan light.
  E(16,16,15,15,'#0a1838');E(16,16,13,13,'#122a5a');spiral(a,16,16,13,4,4.2,['#3a8ae0','#7ad4ff']);
  E(16,16,4.5,4.5,'#bff0ff');E(16,16,3,3,'#050a1c');R(14,13,2,1,'#ffffff');for(const [x,y]of [[6,7],[25,9],[8,25],[26,24]])R(x,y,1,1,'#ffffff');}
 else if(id==='red'){// Reversal Red: a blazing orb pushing out rings of repulsive force.
  E(16,16,15,15,'#3a0814');for(const [r,c]of [[13,'#7a1424'],[11,'#3a0814'],[9.5,'#c0283e']])E(16,16,r,r,c);
  E(16,16,7,7,'#f0405a');E(15,15,4,4,'#ffb8c0');E(14.5,14.5,2,2,'#ffffff');
  for(let i=0;i<8;i++){const t=i*Math.PI/4;L(16+Math.cos(t)*9,16+Math.sin(t)*9,16+Math.cos(t)*14,16+Math.sin(t)*14,i%2?'#ff8090':'#ffe0e4');}}
 else if(id==='eyes'){// Six Eyes: a luminous sky-blue iris under white lashes.
  T([[2,16],[9,9],[16,7],[23,9],[30,16],[23,23],[16,25],[9,23]],'#1a1a34');T([[4,16],[10,10],[16,9],[22,10],[28,16],[22,22],[16,23],[10,22]],'#f4f8ff');
  E(16,16,7,7,'#1a78c8');E(16,16,5.6,5.6,'#3ab8f0');E(16,16,4,4,'#8ae8ff');E(16,16,2,2,'#0a2a58');R(13,12,3,2,'#ffffff');R(18,18,1,1,'#e8fcff');
  L(4,15,10,9,'#e8e8f4',2);L(10,9,16,7,'#e8e8f4',2);L(16,7,22,9,'#e8e8f4',2);L(22,9,28,15,'#e8e8f4',2);for(const [x,y]of [[6,5],[26,5],[3,24],[28,26]])R(x,y,1,1,'#bff0ff');}
 else if(id==='purple'){// Hollow Purple: red and blue streams meeting in an unstable violet mass.
  E(16,16,15,15,'#1a0a2a');L(1,9,12,14,'#3a8ae0',3);L(1,9,12,14,'#9ae4ff');L(31,23,20,18,'#c0283e',3);L(31,23,20,18,'#ffb8c0');
  E(16,16,9,9,'#4a2a7a');E(16,16,7.5,7.5,'#8a5ac8');E(15,15,5,5,'#c08ae8');E(14,14,2.5,2.5,'#f4e0ff');
  for(let i=0;i<6;i++){const t=i*Math.PI/3+.3;L(16+Math.cos(t)*8,16+Math.sin(t)*8,16+Math.cos(t+.2)*12,16+Math.sin(t+.2)*12,i%2?'#d8b0f0':'#ffffff');}}
 else{// Unlimited Void: a starfield domain behind the crossed-finger hand sign.
  E(16,16,15,15,'#2a1a5a');E(16,16,13.5,13.5,'#0c0a24');
  for(let i=0;i<26;i++){const t=i*2.399,d=12*Math.sqrt((i+.5)/26);R(16+Math.cos(t)*d,16+Math.sin(t)*d,1,1,i%4===0?'#ffffff':i%2?'#b8c0f0':'#8a7ad0');}
  for(let i=0;i<=24;i++){const t=i/24*Math.PI*2;R(16+Math.cos(t)*10,16+Math.sin(t)*3.5,1,1,'#c8b4ff');}
  // The hand: a closed fist with the index finger crossed over the raised middle.
  T([[11,31],[11,22],[13,19],[20,19],[21,23],[20,31]],'#ffe2c6');R(12,24,8,1,'#ebb9a0');R(12,27,8,1,'#ebb9a0');
  R(15,9,3,11,'#ffe2c6');R(17,9,1,11,'#ebb9a0');L(13,12,18,17,'#ebb9a0',3);L(13,11,18,16,'#ffe2c6',2);R(15,9,2,1,'#fff2e4');}
 const result=[...a.p];for(let y=0;y<32;y++)for(let x=0;x<32;x++)if(a.p[y*32+x])for(const [dx,dy]of [[1,0],[-1,0],[0,1],[0,-1]]){const xx=x+dx,yy=y+dy;if(xx>=0&&xx<32&&yy>=0&&yy<32&&!a.p[yy*32+xx])result[yy*32+xx]=INK;}
 cache.set(id,result);return result;
}
export function gojoIcon(id){const p=gojoIconPixels(id);return p?p.map((c,i)=>c?`<rect x="${i%32+1}" y="${Math.floor(i/32)+1}" width="1" height="1" fill="${c}"/>`:'').join(''):null;}
