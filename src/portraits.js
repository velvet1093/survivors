import {characterPixels,pilotPixels,pixelsSvg} from './pixel-characters.js';
import {bowSvg} from './bow.js';
const cache=new Map();
export function portrait(c,skin='default',form=c.id==='erza'?3:0){
  const key=[c.id,skin,form].join(':');if(cache.has(key))return cache.get(key);
  const character=c.id==='shinji'?`<g transform="translate(13 -1) scale(.95)">${pixelsSvg(characterPixels('shinji',{skin}))}</g><g transform="translate(-8 25) scale(.62)">${pixelsSvg(pilotPixels({skin}))}</g>`:pixelsSvg(characterPixels(c.id,{pose:c.id==='gojo'?'domain':'',skin,form}));
  const weapon=c.id==='madoka'?`<g transform="translate(44 45) scale(.72) translate(-34 -38)">${bowSvg()}</g>`:'';
  const art=`<svg class="anime-portrait pixel-portrait" viewBox="0 0 76 88" shape-rendering="crispEdges" aria-hidden="true"><g fill="${c.color}" opacity=".08"><path d="M8 9h8v8H8zM62 21h6v6h-6zM6 58h5v5H6zM60 66h9v9h-9z"/></g><g fill="${c.color}" opacity=".16"><path d="M16 76h44v2H16zM21 78h34v2H21z"/></g><g transform="translate(10 5)">${character}${weapon}</g></svg>`;
  cache.set(key,art);return art;
}

export function pilotPortrait(skin='default'){return `<svg class="pilot-avatar" viewBox="10 8 38 40" shape-rendering="crispEdges" aria-hidden="true">${pixelsSvg(pilotPixels({skin}))}</svg>`;}
