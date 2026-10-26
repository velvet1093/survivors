// Shared painting kit for the redrawn Kurumi, Diavolo and Yuki sprites.
// Every outfit uses the same chibi skeleton so faces, hands and walk cycles
// read identically across skins; only clothing, hair and props change.
export const SKIN={base:'#fde1c9',shade:'#eab59f',deep:'#cf8d84',light:'#fff1e2'};
const hex=n=>Math.max(0,Math.min(255,Math.round(n))).toString(16).padStart(2,'0');
const rgb=c=>[1,3,5].map(i=>parseInt(c.slice(i,i+2),16));
export function mix(a,b,t){const x=rgb(a),y=rgb(b);return '#'+x.map((v,i)=>hex(v+(y[i]-v)*t)).join('');}
// Selective outline: each edge pixel takes a darkened version of the colour it borders,
// so hair, skin and cloth keep their own rim instead of a flat black line.
export function selout(pixels,ink,strength=.72){
 const out=[...pixels];
 for(let y=0;y<76;y++)for(let x=0;x<56;x++){
  if(pixels[y*56+x])continue;let near=null;
  for(const [dx,dy]of [[0,1],[0,-1],[-1,0],[1,0]]){const xx=x+dx,yy=y+dy;if(xx>=0&&xx<56&&yy>=0&&yy<76&&pixels[yy*56+xx]){near=pixels[yy*56+xx];break;}}
  if(near)out[y*56+x]=mix(near,ink,strength);
 }
 return out;
}
// Same drawing surface as pixel-characters' raster(), kept local so the art
// modules never form an import cycle with the character dispatcher.
export function canvas(){
 const pixels=Array(56*76).fill(null);
 const put=(x,y,color)=>{x=Math.round(x);y=Math.round(y);if(x>=0&&x<56&&y>=0&&y<76)pixels[y*56+x]=color;};
 const rect=(x,y,w,h,color)=>{for(let yy=Math.round(y);yy<Math.round(y+h);yy++)for(let xx=Math.round(x);xx<Math.round(x+w);xx++)put(xx,yy,color);};
 const poly=(points,color)=>{
  const minX=Math.max(0,Math.floor(Math.min(...points.map(p=>p[0])))),maxX=Math.min(55,Math.ceil(Math.max(...points.map(p=>p[0]))));
  const minY=Math.max(0,Math.floor(Math.min(...points.map(p=>p[1])))),maxY=Math.min(75,Math.ceil(Math.max(...points.map(p=>p[1]))));
  for(let y=minY;y<=maxY;y++)for(let x=minX;x<=maxX;x++){let inside=false;for(let i=0,j=points.length-1;i<points.length;j=i++){const a=points[i],b=points[j];if(((a[1]>y+.5)!==(b[1]>y+.5))&&x+.5<(b[0]-a[0])*(y+.5-a[1])/(b[1]-a[1])+a[0])inside=!inside;}if(inside)put(x,y,color);}
 };
 const line=(x0,y0,x1,y1,color,width=1)=>{const steps=Math.max(Math.abs(x1-x0),Math.abs(y1-y0),1);for(let i=0;i<=steps;i++)rect(Math.round(x0+(x1-x0)*i/steps),Math.round(y0+(y1-y0)*i/steps),width,width,color);};
 return {pixels,put,rect,poly,line};
}
export function motion({frame=0,moving=false}){frame=((frame%4)+4)%4;return {walk:moving?[0,1,0,-1][frame]:0,y:moving?-(frame%2):0};}
// Large anime eyes: lash, two-tone iris, pupil and twin highlights.
// side -1 is the viewer-left eye. `clock` paints Kurumi's golden Zafkiel dial.
export function eye(r,x,y,{iris,irisDark,lash='#2a2233',side=-1,closed=false,hurt=false,focus=false,clock=false}){
 const {rect,put,line}=r,outer=side<0?x-1:x+4;
 if(closed||hurt){
  if(hurt){line(x,y+2,x+3,y+3,lash);line(x,y+4,x+3,y+3,lash);}
  else{line(x,y+3,x+3,y+3,lash);put(outer,y+2,lash);put(x+1,y+4,mix(lash,SKIN.base,.6));put(x+2,y+4,mix(lash,SKIN.base,.6));}
  return;
 }
 rect(x,y+1,4,4,'#fff8f1');
 rect(x+(side<0?1:0),y+1,3,4,iris);rect(x+(side<0?1:0),y+1,3,2,irisDark);
 if(clock){
  // Clock face: gold ring with dark hands at roughly ten past.
  const cx=x+(side<0?2:1);put(cx,y+2,'#5b3a22');put(cx,y+3,'#5b3a22');put(cx+1,y+2,'#5b3a22');put(cx-1,y+4,mix(iris,'#ffffff',.5));put(cx+1,y+4,mix(iris,'#ffffff',.5));
 }else{
  const px=x+(side<0?2:1);rect(px,y+2,1,2,mix(irisDark,'#140f1c',.6));put(x+(side<0?1:0),y+4,mix(iris,'#ffffff',.45));put(x+(side<0?3:2),y+4,mix(iris,'#ffffff',.3));
 }
 put(x+(side<0?1:0),y+1,'#ffffff');put(x+(side<0?3:2),y+3,'#fffdf6');
 line(x,y,x+3,y,lash);put(outer,y+(focus?0:1),lash);if(!focus)put(outer,y,lash);
 if(focus){line(x+(side<0?0:1),y-1,x+(side<0?2:3),y-1,lash);put(side<0?x+3:x,y-2,lash);}
}
export function blush(r,y,color=SKIN.deep){const {put}=r;for(const x of [20,21,34,35])put(x,y,mix(color,SKIN.base,.45));}
export function mouth(r,y,expression,{lip='#b9707a',fang=false}={}){
 const {rect,put}=r;
 if(expression==='hurt'){rect(27,y,3,2,'#8f4f5c');put(28,y,'#ffffff');return;}
 if(expression==='ultimate'){rect(26,y,4,2,'#8f4655');rect(27,y,2,1,'#fff7f2');put(27,y+1,'#d97c86');return;}
 if(expression==='focused'){rect(27,y,3,1,lip);return;}
 put(26,y,lip);rect(27,y+1,2,1,lip);put(29,y,lip);if(fang)put(28,y+1,'#ffffff');
}
// Standard head: tapered face with shaded jaw, neck and ears hidden by hair.
export function head(r,y,{skin=SKIN}={}){
 const {poly,rect}=r;
 rect(25,36+y,6,4,skin.shade);
 poly([[18,20+y],[38,20+y],[38,29+y],[36,34+y],[31,38+y],[25,38+y],[20,34+y],[18,29+y]],skin.shade);
 poly([[19,20+y],[37,20+y],[37,29+y],[35,33+y],[30,37+y],[26,37+y],[21,33+y],[19,29+y]],skin.base);
 // Soft light on the upper cheeks; the fringe covers the forehead.
 rect(21,31+y,2,1,skin.light);rect(34,31+y,2,1,skin.light);rect(37,26+y,1,4,skin.shade);
}
// Arms are thick lines with a lighter top edge and a two-pixel hand.
export function limb(r,x0,y0,x1,y1,{color,light,width=4,hand=SKIN.base,handShade=SKIN.shade,handSize=3}={}){
 const {line,rect}=r;line(x0,y0,x1,y1,color,width);if(light)line(x0,y0,x1,y1,light,1);
 if(hand){rect(x1-1,y1+width-2,handSize,handSize,hand);rect(x1-1,y1+width-2+handSize-1,handSize,1,handShade);}
}
export function legs(r,walk,{x=[22,30],top=54,knee=62,color=SKIN.base,shadeColor=SKIN.shade,width=5}={}){
 const {rect}=r;for(const [i,lx]of x.entries()){const d=i?walk:-walk;rect(lx+d,top,width,67-top,color);rect(lx+d+width-1,top,1,67-top,shadeColor);rect(lx+d,knee,width,1,shadeColor);}
}
export function shoes(r,walk,{x=[22,30],color,light,sole,height=4,width=6,top=67}={}){
 const {rect}=r;for(const [i,lx]of x.entries()){const d=i?walk:-walk;rect(lx+d-(i?0:1),top,width,height,color);rect(lx+d-(i?0:1),top,width-2,1,light||mix(color,'#ffffff',.3));rect(lx+d-(i?0:1),top+height-1,width,1,sole||mix(color,'#000000',.4));}
}
// Flared skirt, drawn as stacked tiers that sway with the walk.
export function skirt(r,walk,{top=48,bottom=62,width=11,flare=7,colors,hem,tiers=1}){
 const {poly,line,rect}=r,[dark,mid,lite]=colors;
 for(let t=tiers-1;t>=0;t--){const b=bottom-t*((bottom-top)/(tiers+1))*0,l=28-width-flare*(1+t*.25),rr=28+width+flare*(1+t*.25);const yb=b+t*0;
  poly([[28-width,top],[28+width,top],[rr+walk,yb],[l+walk,yb]],dark);
  poly([[29-width,top],[27+width,top],[rr-2+walk,yb-1],[l+2+walk,yb-1]],mid);
 }
 for(const fx of [-7,-2,3,8])line(28+fx*.6,top+2,28+fx*1.15+walk,bottom-2,lite||mix(mid,'#ffffff',.25));
 if(hem){const l=Math.round(28-width-flare+walk),w=Math.round((width+flare)*2);for(let i=0;i<w;i+=3){rect(l+i,bottom-1,2,2,hem);}}
}
// Face accents layered over eye()/mouth() so each hero keeps a signature look.
// lid: heavy upper lid covering `rows` of the eye (sleepy, deadpan or narrowed eyes).
export function lid(r,x,y,{lash,rows=1,side=-1}){for(let i=0;i<rows;i++)r.line(x,y+1+i,x+3,y+1+i,i===rows-1?lash:mix(lash,SKIN.shade,.55));r.put(side<0?x-1:x+4,y+rows,lash);}
// brow: a slanted brow line; tilt>0 angles it down toward the nose (stern), tilt<0 up (worried).
export function brow(r,x,y,{color,side=-1,tilt=1}){const inner=side<0?x+3:x,outer=side<0?x:x+3;r.line(outer,y,inner,y+tilt,color);}
export function tear(r,x,y){r.put(x,y,'#bfe6f7');r.put(x,y+1,'#8cc8e6');}
