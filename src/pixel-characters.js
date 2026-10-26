import {denjiPixels} from './denji-art.js';
import {erzaPixels} from './erza-art.js';
import {featherinePixels} from './featherine-art.js';
import {kurumiPixels} from './kurumi-art.js';
import {gokuPixels} from './goku-art.js';
import {gojoPixels} from './gojo-art.js';
import {narutoPixels} from './naruto-art.js';
import {madokaPixels} from './madoka-art.js';
import {maomaoPixels} from './maomao-art.js';
import {esdeathPixels} from './esdeath-art.js';
import {frierenPixels} from './frieren-art.js';
import {megumiPixels} from './megumi-art.js';
import {erenPixels} from './eren-art.js';
import {samusPixels} from './samus-art.js';
import {shinjiPixels} from './shinji-art.js';
import {rimuruPixels} from './rimuru-art.js';
import {diavoloPixels} from './diavolo-art.js';
import {yukiPixels} from './yuki-art.js';
import {gutsPixels} from './guts-art.js';
const REDRAWN={shinji:shinjiPixels,goku:gokuPixels,gojo:gojoPixels,naruto:narutoPixels,madoka:madokaPixels,maomao:maomaoPixels,esdeath:esdeathPixels,frieren:frierenPixels,megumi:megumiPixels,eren:erenPixels,samus:samusPixels,rimuru:rimuruPixels,featherine:featherinePixels,erza:erzaPixels};

export const SPRITE_WIDTH=56;
export const SPRITE_HEIGHT=76;
export const HERO_SCALE=.78;
export const HERO_FOOT={x:28,y:71};
export function raster(){
  const pixels=Array(SPRITE_WIDTH*SPRITE_HEIGHT).fill(null);
  const put=(x,y,color)=>{x=Math.round(x);y=Math.round(y);if(x>=0&&x<SPRITE_WIDTH&&y>=0&&y<SPRITE_HEIGHT)pixels[y*SPRITE_WIDTH+x]=color;};
  const rect=(x,y,w,h,color)=>{for(let yy=Math.round(y);yy<Math.round(y+h);yy++)for(let xx=Math.round(x);xx<Math.round(x+w);xx++)put(xx,yy,color);};
  const poly=(points,color)=>{
    const minX=Math.max(0,Math.floor(Math.min(...points.map(p=>p[0])))),maxX=Math.min(SPRITE_WIDTH-1,Math.ceil(Math.max(...points.map(p=>p[0]))));
    const minY=Math.max(0,Math.floor(Math.min(...points.map(p=>p[1])))),maxY=Math.min(SPRITE_HEIGHT-1,Math.ceil(Math.max(...points.map(p=>p[1]))));
    for(let y=minY;y<=maxY;y++)for(let x=minX;x<=maxX;x++){let inside=false;for(let i=0,j=points.length-1;i<points.length;j=i++){const a=points[i],b=points[j];if(((a[1]>y+.5)!==(b[1]>y+.5))&&x+.5<(b[0]-a[0])*(y+.5-a[1])/(b[1]-a[1])+a[0])inside=!inside;}if(inside)put(x,y,color);}
  };
  const line=(x0,y0,x1,y1,color,width=1)=>{const steps=Math.max(Math.abs(x1-x0),Math.abs(y1-y0),1);for(let i=0;i<=steps;i++)rect(Math.round(x0+(x1-x0)*i/steps),Math.round(y0+(y1-y0)*i/steps),width,width,color);};
  return {pixels,put,rect,poly,line};
}
export function outline(pixels,ink){const result=[...pixels];for(let y=0;y<SPRITE_HEIGHT;y++)for(let x=0;x<SPRITE_WIDTH;x++)if(pixels[y*SPRITE_WIDTH+x])for(const [dx,dy] of [[-1,0],[1,0],[0,-1],[0,1]]){const xx=x+dx,yy=y+dy;if(xx>=0&&xx<SPRITE_WIDTH&&yy>=0&&yy<SPRITE_HEIGHT&&!pixels[yy*SPRITE_WIDTH+xx])result[yy*SPRITE_WIDTH+xx]=ink;}return result;}
export {pilotPixels} from './shinji-art.js';

const dataCache=new Map();
export function characterPixels(id,{frame=0,moving=false,pose='',attack=false,expression='neutral',blink=false,skin:skinId='default',form=id==='erza'?3:0,evolved=''}={}){
  frame=((frame%4)+4)%4;const key=[id,frame,moving,pose,attack,expression,blink,skinId,form,evolved].join(':');if(dataCache.has(key))return dataCache.get(key);
  if(id==='denji'){const result=denjiPixels({frame,moving,pose,attack,expression,blink,skin:skinId,form});dataCache.set(key,result);return result;}
  if(id==='guts'){const result=gutsPixels({frame,moving,pose,attack,expression,blink,skin:skinId,form});dataCache.set(key,result);return result;}
  if(REDRAWN[id]){const result=REDRAWN[id]({frame,moving,pose,attack,expression,blink,skin:skinId,form,evolved});dataCache.set(key,result);return result;}
  if(id==='kurumi'){const result=kurumiPixels({frame,moving,pose,attack,expression,blink,skin:skinId});dataCache.set(key,result);return result;}
  if(id==='diavolo'){const result=diavoloPixels({frame,moving,pose,attack,expression,blink,skin:skinId});dataCache.set(key,result);return result;}
  if(id==='yuki'){const result=yukiPixels({frame,moving,pose,attack,expression,blink,skin:skinId});dataCache.set(key,result);return result;}
 return Array(SPRITE_WIDTH*SPRITE_HEIGHT).fill(null);
}
export function pixelRuns(pixels,width=SPRITE_WIDTH){const runs=[];for(let y=0;y<pixels.length/width;y++){for(let x=0;x<width;){const color=pixels[y*width+x];if(!color){x++;continue;}let end=x+1;while(end<width&&pixels[y*width+end]===color)end++;runs.push({x,y,width:end-x,color});x=end;}}return runs;}
export function pixelsSvg(pixels){return pixelRuns(pixels).map(r=>`<rect x="${r.x}" y="${r.y}" width="${r.width}" height="1" fill="${r.color}"/>`).join('');}
