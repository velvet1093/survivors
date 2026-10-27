import {canvas,motion,selout,mix,head,limb} from './hero-kit.js';
// Megumi Fushiguro: tall, unruly black spikes with a blue sheen, narrow teal eyes
// under level brows and a flat, serious mouth. His Jujutsu High uniform has a tall
// standing collar fastened with gold spiral buttons, long sleeves and loose straight
// trousers. Summoning shapes the Divine Dog shadow sign with both hands.
export const MEGUMI_ART={ink:'#161b28',hair:'#1e2636',hairDark:'#10141e',hairLight:'#3c4c66',eye:'#3f9a8c',eyeDark:'#1e5a52'};
const c=MEGUMI_ART,SK={base:'#fbe0c8',shade:'#e0b8a0',deep:'#c49480',light:'#fff2e4'};
const PALETTES={
 default:{coat:['#151a28','#262f45','#3c4862'],trim:'#0c1018',button:'#d8b04a',buttonLight:'#fff0a8',pants:['#121622','#1f2638','#323c54'],shoe:'#0e1016',shoeLight:'#3a3e4a'},
 // Training: a grey Jujutsu High jersey over darker track trousers.
 training:{coat:['#4a5262','#6e788a','#9aa4b4'],trim:'#343a46',button:'#c8cdd6',buttonLight:'#ffffff',pants:['#262c38','#3a4252','#565f72'],shoe:'#2a2e3a',shoeLight:'#8a93a4'},
};
const shift=(pts,y)=>pts.map(([x,yy])=>[x,yy+y]);
function layer(r,pts,[dark,mid,light],y=0){const p=shift(pts,y);r.poly(p,dark);const cx=p.reduce((s,q)=>s+q[0],0)/p.length,cy=p.reduce((s,q)=>s+q[1],0)/p.length;r.poly(p.map(([x,yy])=>{const dx=cx-x,dy=cy-yy,l=Math.hypot(dx,dy)||1;return [x+dx/l,yy+dy/l];}),mid);if(light){const left=[...p].sort((a,b)=>a[0]-b[0]).slice(0,2);r.line(left[0][0]+1,left[0][1],left[1][0]+1,left[1][1],light);}}
function spiral(r,x,y,pal){r.rect(x,y,3,3,pal.button);r.put(x+1,y+1,mix(pal.button,'#5a3a10',.5));r.put(x,y,pal.buttonLight);}

function face(r,m){
 const {y,blink,expression,cast}=m,{rect:R,line:L,put}=r,hurt=expression==='hurt',focus=cast||expression==='focused'||expression==='ultimate';
 head(r,y,{skin:SK});
 for(const [x,side]of [[21,-1],[31,1]]){
  if(blink){L(x,29+y,x+3,29+y,c.ink);continue;}
  if(hurt){L(x,27+y,x+3,29+y,c.ink);L(x,29+y,x+3,27+y,c.ink);continue;}
  // Narrow, sharp eyes: a heavy upper lid over a teal iris, his usual unimpressed look.
  R(x,28+y,4,3,'#fbf6ee');R(x+(side<0?1:0),28+y,3,3,c.eye);R(x+(side<0?1:0),28+y,3,1,c.eyeDark);put(x+(side<0?2:1),29+y,'#0e2a26');put(x+(side<0?1:0),29+y,'#bfeee2');
  L(x-(side<0?1:0),27+y,x+3+(side>0?1:0),27+y,c.ink);put(side<0?x-1:x+4,28+y,c.ink);
 }
 // Level brows that tilt inward when he concentrates.
 for(const [x,d]of [[20,1],[36,-1]])for(let i=0;i<5;i++)put(x+d*i,25+y+(focus&&i>2?1:0),c.hairDark);
 put(28,31+y,SK.shade);put(29,32+y,SK.shade);
 if(hurt){R(26,34+y,5,2,'#6a3a3a');put(27,34+y,'#fff4ee');}
 else if(expression==='ultimate'){R(26,34+y,5,2,'#5a2a2a');R(27,34+y,3,1,'#f6efe6');}
 else L(26,35+y,30,35+y,'#a06a5a');
}
function hair(r,m,{back}){
 const {y}=m,H=[c.hairDark,c.hair,c.hairLight];
 if(back){layer(r,[[16,30],[13,22],[14,16],[19,12],[37,12],[42,16],[43,22],[40,30]],H,y);return;}
 // Tall spikes fan upward and out, a few falling over the forehead between the eyes.
 const crown=[[15,28],[9,24],[14,21],[6,14],[16,16],[12,7],[21,11],[20,2],[27,9],[30,0],[33,8],[39,1],[38,10],[47,6],[42,15],[50,15],[42,21],[47,26],[40,28],[38,22],[34,24],[31,19],[28,25],[25,19],[21,24],[19,21],[17,30]];
 r.poly(shift(crown,y),H[0]);
 r.poly(shift([[17,24],[14,21],[18,18],[14,12],[21,14],[21,6],[27,12],[30,4],[33,11],[38,5],[37,13],[44,11],[39,18],[42,22],[38,22],[34,21],[31,17],[28,22],[25,17],[21,21]],y),H[1]);
 for(const [x0,y0,x1,y1]of [[22,8,24,15],[30,4,30,12],[37,7,35,14],[16,14,19,18],[43,13,40,17]])r.line(x0,y0+y,x1,y1+y,H[2]);
 r.line(26,17+y,25,22+y,H[2]);
}
function uniform(r,m,pal){
 const {y,walk}=m,{rect:R,poly:P,line:L}=r;
 // Loose straight trousers and black shoes.
 for(const [x,d]of [[20,-walk],[30,walk]]){
  P([[x,53],[x+7,53],[x+7+d,66],[x-1+d,66]],pal.pants[0]);P([[x+1,54],[x+6,54],[x+6+d,65],[x+d,65]],pal.pants[1]);L(x+2,56,x+2+d,64,pal.pants[2]);
  R(x-2+d,66,10,4,pal.shoe);R(x-1+d,66,6,1,pal.shoeLight);R(x-2+d,69,10,1,'#050608');
 }
 // Jacket with a seam down the front and the tall standing collar.
 layer(r,[[18,38],[38,38],[39,55],[17,55]],pal.coat,y);
 L(28,41+y,28,54,pal.trim);for(const yy of [44,49])spiral(r,29,yy+(yy<50?y:0),pal);
 R(17,53,22,2,pal.trim);
 P(shift([[22,33],[34,33],[35,40],[21,40]],y),pal.coat[0]);P(shift([[23,34],[33,34],[34,39],[22,39]],y),pal.coat[1]);L(23,34+y,33,34+y,pal.coat[2]);
 spiral(r,24,36+y,pal);spiral(r,30,36+y,pal);
}
// Arms: relaxed at his sides, or both hands joined at the chest in the Divine Dog sign.
function arms(r,m,pal){
 const {y,walk,cast,pose}=m,{rect:R,line:L,put}=r;
 if(cast){
  const lift=pose==='summon'?-3:0;
  for(const [sx,hx]of [[19,25],[37,31]]){L(sx,40+y,hx,47+y+lift,pal.coat[0],5);L(sx,40+y,hx,46+y+lift,pal.coat[1],3);}
  // The shadow-dog sign: interlaced fingers forming a head, two raised "ears" and a snout.
  const hy=43+y+lift;R(24,hy,9,5,SK.base);R(24,hy+4,9,1,SK.shade);R(25,hy-3,2,3,SK.base);R(30,hy-3,2,3,SK.base);R(32,hy+1,3,2,SK.base);put(26,hy+1,SK.deep);put(29,hy+1,SK.deep);put(27,hy+2,c.ink);
  return [[28,hy],[28,hy]];
 }
 const hands=[];
 for(const [i,[sx,hx]]of [[19,15],[37,41]].entries()){const hy=51+(i?-walk:walk)*.4;limb(r,sx,40+y,hx,hy,{color:pal.coat[1],light:pal.coat[2],width:5,hand:SK.base,handShade:SK.shade});hands.push([hx,hy]);}
 return hands;
}
function shadowPool(r,m){
 // Summoning spreads a pool of living shadow at his feet with wisps rising from it.
 const {frame}=m,{poly:P,line:L}=r,lift=[0,2,1,3][frame];
 P([[8,70],[16,66],[40,66],[48,70],[40,73],[16,73]],'#0a0c14');P([[12,70],[18,67],[38,67],[44,70],[38,72],[18,72]],'#1a2036');
 for(const [x,h]of [[12,6],[44,7],[18,4],[38,5]])L(x,68,x+(x<28?-1:1),68-h-lift,'#3a4a78');
}
const cache=new Map();
export function megumiPixels({frame=0,moving=false,pose='',attack=false,expression='neutral',blink=false,skin='default'}={}){
 const key=[frame,moving,pose,attack,expression,blink,skin].join(':');if(cache.has(key))return cache.get(key);
 const mo=motion({frame,moving}),m={frame:((frame%4)+4)%4,moving,pose,attack,expression,blink,walk:mo.walk*2,y:mo.y,cast:attack||!!pose};
 const pal=PALETTES[skin]||PALETTES.default,r=canvas();
 if(m.cast)shadowPool(r,m);
 hair(r,m,{back:true});uniform(r,m,pal);arms(r,m,pal);face(r,m);hair(r,m,{back:false});
 const result=selout(r.pixels,c.ink);cache.set(key,result);return result;
}
