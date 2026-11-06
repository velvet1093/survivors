// Rimuru's weapon, passive and evolution icons on the 32×32 item grid: a true-black flame
// rimmed in azure, the Great Sage as a glowing sphere inside an orbit of glyphs, and
// Beelzebub's devouring vortex ringed in black fire.
export const RIMURU_ICON_IDS=['blackflame','greatsage','beelzebub'];
const cache=new Map(),INK='#0c1018';
const AZURE='#3a8ae0',CYAN='#7ad4ff',PALE='#d2f0f8',BLACK='#141a28',BLACK2='#222a3c';
function frame(){
 const p=Array(1024).fill(null),R=(x,y,w,h,c)=>{for(let yy=Math.round(y);yy<y+h;yy++)for(let xx=Math.round(x);xx<x+w;xx++)if(xx>=0&&yy>=0&&xx<32&&yy<32)p[yy*32+xx]=c;};
 const L=(x,y,tx,ty,c,w=1)=>{const n=Math.max(1,Math.abs(tx-x),Math.abs(ty-y));for(let i=0;i<=n;i++)R(x+(tx-x)*i/n,y+(ty-y)*i/n,w,w,c);};
 const E=(x,y,rx,ry,c)=>{for(let yy=0;yy<32;yy++)for(let xx=0;xx<32;xx++)if(((xx+.5-x)/rx)**2+((yy+.5-y)/ry)**2<=1)R(xx,yy,1,1,c);};
 const T=(pts,c)=>{for(let yy=0;yy<32;yy++)for(let xx=0;xx<32;xx++){let inside=false;for(let i=0,j=pts.length-1;i<pts.length;j=i++){const [xi,yi]=pts[i],[xj,yj]=pts[j];if((yi>yy+.5)!==(yj>yy+.5)&&xx+.5<(xj-xi)*(yy+.5-yi)/(yj-yi)+xi)inside=!inside;}if(inside)R(xx,yy,1,1,c);}};
 return {p,R,L,E,T};
}
// One wavering flame tongue, filled row by row: widest low down, curling to a leaning tip.
function flame(a,cx,base,w,h,{lean=0,phase=0,color=BLACK,rim=AZURE}={}){const {R}=a;
 for(const [pad,c]of [[1.2,rim],[0,color]])for(let yy=Math.round(base-h);yy<=base;yy++){const t=(base-yy)/h,half=w*Math.pow(1-t,.75)*Math.min(1,(t+.1)/.32)+pad*(1-t*.4),x=cx+lean*t*t+Math.sin(t*7+phase)*1.3*t;if(half>.3)R(x-half,yy,half*2,1,c);}
}
export function rimuruIconPixels(id){
 if(!RIMURU_ICON_IDS.includes(id))return null;if(cache.has(id))return cache.get(id);const a=frame(),{R,L,E,T}=a;
 if(id==='blackflame'){// Black Flame: tall black fire edged in azure, blue light flickering at its base.
  flame(a,9,29,5,15,{lean:-4,phase:1});flame(a,23,29,5,17,{lean:4,phase:2.5});flame(a,16,30,8,27,{lean:1,phase:0});
  flame(a,16,29,4,12,{lean:-1,phase:3,color:'#1e5a9a',rim:AZURE});flame(a,16,29,2,7,{phase:4,color:CYAN,rim:CYAN});R(15,27,2,2,PALE);
  for(const [x,y]of [[5,9],[26,7],[29,16],[3,18],[20,3]])R(x,y,1,1,CYAN);}
 else if(id==='greatsage'){// Great Sage: a luminous azure sphere inside a tilted orbit of glyphs.
  E(16,16,15,15,'#0e2a44');E(16,16,13.5,13.5,'#08182c');
  E(16,16,7,7,'#1e5a9a');E(16,16,6,6,AZURE);E(15,15,4,4,CYAN);E(14,14,2,2,PALE);R(13,12,2,1,'#ffffff');
  for(let i=0;i<40;i++){const t=i/40*Math.PI*2,x=16+Math.cos(t)*12,y=16+Math.sin(t)*4.5,front=Math.sin(t)>0;if(!front&&Math.abs(x-16)<6&&Math.abs(y-16)<6)continue;R(x-.5,y-.5,1,1,front?CYAN:'#3a6a9a');}
  for(let i=0;i<6;i++){const t=i/6*Math.PI*2+.3,x=16+Math.cos(t)*12,y=16+Math.sin(t)*4.5;R(x-1,y-1,2,2,PALE);}
  for(const [x,y]of [[6,6],[26,6],[6,26],[26,26]]){R(x,y,1,1,CYAN);R(x-1,y,3,1,'#3a6a9a');}}
 else{// Beelzebub: a spiral maw that swallows everything, ringed in black flame.
  for(let i=0;i<10;i++){const t=i/10*Math.PI*2,x=16+Math.cos(t)*11,y=17+Math.sin(t)*11;flame(a,x,y+3,3,8,{lean:Math.cos(t)*2,phase:i});}
  E(16,17,11,11,'#2a1a44');E(16,17,9.5,9.5,'#120a22');
  for(let k=0;k<3;k++)for(let i=0;i<=30;i++){const t=i/30,ang=k*Math.PI*2/3+t*4.5,d=9*(1-t);R(16+Math.cos(ang)*d-.5,17+Math.sin(ang)*d-.5,1,1,t<.5?'#7a5ac8':'#b89aff');}
  E(16,17,3,3,BLACK);for(let i=0;i<6;i++){const t=i*Math.PI/3;R(16+Math.cos(t)*3-.5,17+Math.sin(t)*3-.5,1,1,'#f4f0ff');}R(15.5,16.5,1,1,CYAN);}
 const result=[...a.p];for(let y=0;y<32;y++)for(let x=0;x<32;x++)if(a.p[y*32+x])for(const [dx,dy]of [[1,0],[-1,0],[0,1],[0,-1]]){const xx=x+dx,yy=y+dy;if(xx>=0&&xx<32&&yy>=0&&yy<32&&!a.p[yy*32+xx])result[yy*32+xx]=INK;}
 cache.set(id,result);return result;
}
export function rimuruIcon(id){const p=rimuruIconPixels(id);return p?p.map((c,i)=>c?`<rect x="${i%32+1}" y="${Math.floor(i/32)+1}" width="1" height="1" fill="${c}"/>`:'').join(''):null;}
