import {SPRITE_WIDTH,SPRITE_HEIGHT,pixelRuns} from './pixel-characters.js';
export const BOW_SCALE=.72;
export const BOW_ANCHOR={x:34,y:38};
// In local space +X is the firing direction. The limbs bulge forward;
// the string and nock sit behind the grip, toward the archer.
export function bowPose(p){
  const angle=Number.isFinite(p.aimAngle)?p.aimAngle:p.facing<0?Math.PI:0;
  const pull=Math.round(Math.max(0,Math.min(1,(p.attackTimer||0)/.3))*4);
  const grip={x:p.x+Math.cos(angle)*12,y:p.y-20+Math.sin(angle)*9};
  const transform=(x,y)=>({x:grip.x+(x*Math.cos(angle)-y*Math.sin(angle))*BOW_SCALE,y:grip.y+(x*Math.sin(angle)+y*Math.cos(angle))*BOW_SCALE});
  return {angle,pull,grip,upperTip:transform(-9,-21),lowerTip:transform(-9,21),limbCenter:transform(2,0),string:transform(-9-pull,0),arrowHead:transform(16,0),muzzle:transform(18,0)};
}
const cache=new Map();
export function bowPixels(pull=0,variant='base'){
  pull=Math.max(0,Math.min(4,Math.round(pull)));variant=variant==='salvation'?'salvation':'base';const key=variant+':'+pull;if(cache.has(key))return cache.get(key);
  const data=Array(SPRITE_WIDTH*SPRITE_HEIGHT).fill(null);
  const dot=(x,y,color)=>{x=Math.round(x);y=Math.round(y);if(x>=0&&x<SPRITE_WIDTH&&y>=0&&y<SPRITE_HEIGHT)data[y*SPRITE_WIDTH+x]=color;};
  const line=(ax,ay,bx,by,color,width=1)=>{const steps=Math.max(Math.abs(bx-ax),Math.abs(by-ay),1);for(let i=0;i<=steps;i++)for(let w=0;w<width;w++)dot(ax+(bx-ax)*i/steps+w,ay+(by-ay)*i/steps,color);};
  const points=[[25,17],[29,20],[33,26],[36,33],[37,38],[36,44],[33,51],[29,57],[25,59]];
  // A slender golden branch, knotted at intervals like a living stem.
  for(let i=1;i<points.length;i++){line(...points[i-1],...points[i],'#6a4a2a',3);line(points[i-1][0]+1,points[i-1][1],points[i][0]+1,points[i][1],'#d8a848',2);line(points[i-1][0]+1,points[i-1][1],points[i][0]+1,points[i][1],'#f8e090',1);}
  for(const [x,y]of points.slice(1,-1))dot(x+1,y,'#8a6a3a');
  line(25,17,25-pull,38,'#fbebd5');line(25-pull,38,25,59,'#fbebd5');
  line(25-pull,38,49,38,'#efd09a');line(48,35,51,38,'#fff6e5');line(51,38,48,41,'#fff6e5');line(48,36,50,38,'#eaaaca');
  line(28-pull,35,30-pull,38,'#eeb1d0');line(28-pull,41,30-pull,38,'#eeb1d0');
  // A pink rosebud crowns the upper tip; leaves sprout along the limbs; the grip is wrapped.
  line(23,13,27,13,'#9e2a5a',3);line(24,11,26,11,'#e0306a',3);line(24,12,26,12,'#ff8ab8');dot(25,10,'#ffd0e4');line(23,16,27,16,'#4a8a3a',2);dot(22,15,'#6ab04a');dot(28,15,'#6ab04a');
  line(31,22,35,21,'#4a8a3a',2);dot(36,21,'#8ad070');line(34,52,38,54,'#4a8a3a',2);dot(39,54,'#8ad070');line(23,60,21,63,'#4a8a3a',2);
  line(35,36,35,40,'#c03a6a',2);dot(36,37,'#ff9ac4');
  if(variant==='salvation'){
    const palette={'#6a4a2a':'#54485f','#d8a848':'#c9ae7b','#f8e090':'#fff0ce','#c03a6a':'#a28a99','#9e2a5a':'#b5799d','#e0306a':'#efc6d5','#4a8a3a':'#dad7cb','#efd09a':'#fff4dc'};
    for(let i=0;i<data.length;i++)if(palette[data[i]])data[i]=palette[data[i]];
    // The anchor, string, limbs and muzzle stay fixed; feathers and the five
    // wishes decorate the same aimed bow used by every skin and firing pose.
    for(const side of [-1,1])for(let i=0;i<3;i++){
      const yy=38+side*(8+i*5);line(32-i*2,yy,21-i*2,yy+side*4,'#82798e',3);line(32-i*2,yy,22-i*2,yy+side*3,'#f0e9db',2);line(29-i*2,yy,23-i*2,yy+side*2,'#fff6e3');
    }
    const colors=['#f6add5','#a5dafa','#f5d48b','#ee9a9f','#c7b1ed'];
    [[27,19],[34,28],[37,38],[34,48],[27,57]].forEach(([x,y],i)=>{for(let yy=-2;yy<=2;yy++)for(let xx=-2;xx<=2;xx++)if(Math.abs(xx)+Math.abs(yy)<=3)dot(x+xx,y+yy,'#bd9f72');dot(x,y-1,colors[i]);dot(x-1,y,colors[i]);dot(x,y,colors[i]);dot(x+1,y,colors[i]);dot(x,y+1,colors[i]);dot(x-1,y-1,'#fff5df');});
    line(27-pull,37,48,37,'#ffffff');
  }
  cache.set(key,data);return data;
}
export function bowSvg(pull=0,variant='base'){return pixelRuns(bowPixels(pull,variant)).map(r=>`<rect x="${r.x}" y="${r.y}" width="${r.width}" height="1" fill="${r.color}"/>`).join('');}
