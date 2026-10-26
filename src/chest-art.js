// Lacquered treasure caches share the game's dark outlines, colored metal and
// crisp highlight pixels. The same component shapes are used in-world and in UI.
const palettes={
 event:{ink:'#252334',wood:'#70435f',deep:'#412b48',light:'#ad6d86',edge:'#d8bf89',shine:'#fff0cc',metal:'#8e6c80',gem:'#d9b2e9',darkGem:'#8357a3',glow:'#d99fbd'},
 normal:{ink:'#20283b',wood:'#783d4c',deep:'#4a293b',light:'#b66b64',edge:'#e4b66e',shine:'#fff0bc',metal:'#a57650',gem:'#77d6db',darkGem:'#357c9b',glow:'#f0c67e'},
 rift:{ink:'#20263d',wood:'#594b81',deep:'#332e55',light:'#8d72ab',edge:'#9bdfdf',shine:'#effee2',metal:'#548eac',gem:'#e7acf1',darkGem:'#9b61c1',glow:'#acb8ff'},
 mimic:{ink:'#25283c',wood:'#614353',deep:'#342a3d',light:'#a26578',edge:'#e3be80',shine:'#fff1cf',metal:'#9b784e',gem:'#adcf8c',darkGem:'#557d72',glow:'#d5bd88'},
};
const variantId=v=>v==='event'?'event':v==='rift'?'rift':['mimic','mimic-recovered'].includes(v)?'mimic':'normal';
const partCache=new Map();
function parts(variant='normal'){
 const key=variantId(variant);if(partCache.has(key))return partCache.get(key);
 const p=palettes[key],rect=(x,y,w,h,c)=>({x,y,w,h,c}),poly=(points,c)=>({points,c}),r=[];
 const R=(...args)=>r.push(rect(...args)),P=(points,c)=>r.push(poly(points,c));
 // Raised feet, angled side, layered wood panels and iron binding.
 P([[13,36],[60,36],[69,43],[69,62],[59,67],[13,63]],p.ink);
 R(15,40,44,21,p.wood);P([[59,40],[66,44],[66,60],[59,64]],p.deep);
 R(17,43,40,3,p.light);R(17,49,40,1,p.deep);R(17,57,40,3,p.deep);
 R(17,61,8,5,p.ink);R(48,62,10,5,p.ink);R(18,61,6,2,p.metal);R(49,62,7,2,p.metal);
 for(const x of [21,49]){R(x,39,5,23,p.metal);R(x,40,2,20,p.edge);R(x+1,43,2,2,p.shine);R(x+1,56,2,2,p.shine);}
 R(14,39,46,4,p.edge);R(15,39,44,1,p.shine);R(14,60,46,3,p.metal);R(15,60,43,1,p.edge);
 P([[60,40],[67,44],[67,47],[60,44]],p.edge);P([[60,60],[67,57],[67,60],[60,64]],p.metal);
 // Lock escutcheon and the central soul crystal.
 P([[31,40],[43,40],[46,46],[44,54],[38,58],[31,54],[28,46]],p.ink);
 P([[33,42],[42,42],[44,46],[42,52],[38,55],[33,52],[30,46]],p.edge);
 P([[37,42],[42,46],[38,52],[33,47]],p.darkGem);P([[37,43],[40,46],[37,49],[35,46]],p.gem);R(36,44,2,2,p.shine);
 for(const x of [16,55]){R(x,46,2,2,p.edge);R(x,54,2,2,p.metal);}
 const body=r.splice(0);
 // Arched lacquered lid with beveled right cap and gold ribs.
 P([[12,38],[12,31],[17,23],[23,20],[53,20],[61,24],[68,33],[68,42],[59,44],[12,41]],p.ink);
 P([[15,36],[15,31],[20,25],[26,23],[52,23],[59,27],[63,34],[59,39],[15,39]],p.wood);
 P([[26,23],[51,23],[58,27],[60,31],[18,31],[21,27]],p.light);
 P([[59,27],[65,33],[65,39],[60,41],[60,33]],p.deep);
 R(16,35,43,3,p.deep);R(15,38,44,3,p.edge);R(16,38,42,1,p.shine);
 for(const x of [22,49]){P([[x,37],[x,30],[x+2,24],[x+6,23],[x+4,31],[x+4,37]],p.metal);R(x+1,31,2,6,p.edge);R(x+3,24,2,4,p.edge);R(x+1,32,1,3,p.shine);}
 R(28,25,18,1,p.edge);R(30,27,13,1,p.light);P([[35,29],[38,27],[41,29],[38,31]],p.edge);R(37,28,2,2,p.shine);
 const lid=r.splice(0);
 // Paper seals make a defeated mimic cache visibly safe to reclaim.
 if(variantId(variant)==='mimic'){R(52,34,5,24,'#e5dac1');R(53,38,2,3,'#ad5a6d');R(53,44,2,1,'#ad5a6d');R(53,49,2,4,'#ad5a6d');R(52,56,2,3,'#c7b591');}
 if(variantId(variant)==='rift'){P([[9,47],[13,43],[17,47],[13,51]],p.gem);P([[64,50],[68,46],[72,50],[68,54]],p.gem);R(12,46,2,2,p.shine);R(67,49,2,2,p.shine);}
 const result={p,body,lid,decoration:r};partCache.set(key,result);return result;
}
const primitiveSvg=q=>q.points?`<polygon points="${q.points.map(v=>v.join(',')).join(' ')}" fill="${q.c}"/>`:`<rect x="${q.x}" y="${q.y}" width="${q.w}" height="${q.h}" fill="${q.c}"/>`;
const layerSvg=shapes=>shapes.map(primitiveSvg).join('');
export function chestIllustration({variant='normal',stage='sealed'}={}){
 const {p,body,lid,decoration}=parts(variant),open=stage==='open';
 return `<svg class="treasure-illustration ${open?'treasure-open':''}" viewBox="0 0 80 72" shape-rendering="crispEdges" role="img" aria-label="${variantId(variant)==='event'?'World event cache':variantId(variant)==='rift'?'Rift relic':variantId(variant)==='mimic'?'Reclaimed mimic':'Treasure'} chest"><ellipse cx="40" cy="65" rx="29" ry="4" fill="#101526" opacity=".65"/><g class="treasure-rays" fill="${p.shine}" opacity="${open?'.7':'0'}"><path d="M27 40 19 5 29 9 35 40ZM37 40 35 1 42 1 43 40ZM46 40 50 8 60 3 53 40Z"/></g><g class="treasure-interior" opacity="${open?'1':'0'}"><path d="M15 38 23 29 59 29 67 39 58 44 15 42Z" fill="${p.ink}"/><path d="M20 38 27 34 53 34 60 39 54 42 20 40Z" fill="${p.gem}"/></g><g class="treasure-body">${layerSvg(body)}</g><g class="treasure-lid"${open?' transform="translate(0 -13)"':''}>${layerSvg(lid)}</g><g class="treasure-details">${layerSvg(decoration)}</g><g class="treasure-sparks" fill="${p.shine}"><path d="M8 24h2v-4h2v4h2v2h-2v4h-2v-4H8ZM66 17h2v-3h2v3h3v2h-3v3h-2v-3h-2Z"/><rect x="6" y="44" width="2" height="2"/><rect x="73" y="33" width="2" height="2"/></g></svg>`;
}
function paint(c,shapes){for(const q of shapes){c.fillStyle=q.c;if(q.points){c.beginPath();q.points.forEach(([x,y],i)=>i?c.lineTo(x,y):c.moveTo(x,y));c.closePath();c.fill();}else c.fillRect(q.x,q.y,q.w,q.h);}}
export function drawChest(c,chest,time=0,reducedMotion=false){
 const variant=variantId(chest.kind||chest.variant),{p,body,lid,decoration}=parts(variant),pulse=reducedMotion?1:.85+Math.sin(time*2.4+(chest.x||0))*.15;
 c.save();c.translate(Math.round(chest.x),Math.round(chest.y));
 const glow=c.createRadialGradient(0,-10,2,0,-10,45);glow.addColorStop(0,p.glow+'50');glow.addColorStop(1,p.glow+'00');c.fillStyle=glow;c.fillRect(-45,-55,90,90);
 c.globalAlpha=.3*pulse;c.fillStyle=p.gem;c.beginPath();c.ellipse(0,6,26,9,0,0,Math.PI*2);c.fill();c.globalAlpha=1;
 c.scale(.64,.64);c.translate(-40,-62);paint(c,body);paint(c,lid);paint(c,decoration);
 c.globalAlpha=reducedMotion?.7:.5+.4*Math.sin(time*3);c.fillStyle=p.shine;
 for(let i=0;i<4;i++){const age=reducedMotion?i/4:(time*.23+i/4)%1,x=10+(i*19)%63,y=46-age*35;c.fillRect(Math.round(x),Math.round(y),2,2);}
 c.restore();
}
