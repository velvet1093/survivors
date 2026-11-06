// Floor dressing laid over every map's terrain tiles. Large, soft patches break up the
// repeating tile pattern, and each map scatters its own decals: petals, moss, cracks, snow
// drifts, ash, puddles, glyphs. Decor is purely visual: no collision, no gameplay change.
import {riverMap} from './scenery-layout.js';
const lattice=(x,y)=>{const n=Math.sin(x*157.31+y*91.77)*43758.5453;return n-Math.floor(n);};
const smooth=t=>t*t*(3-2*t);
// Value noise: smooth blobs a few hundred world units across.
export function valueNoise(x,y){const x0=Math.floor(x),y0=Math.floor(y),fx=smooth(x-x0),fy=smooth(y-y0),a=lattice(x0,y0),b=lattice(x0+1,y0),c=lattice(x0,y0+1),d=lattice(x0+1,y0+1);return a+(b-a)*fx+(c-a)*fy+(a-b-c+d)*fx*fy;}
// Decal recipes: [colors, shape, density]. Shapes are small pixel clusters.
export const MAP_DECOR={
 garden:{colors:['#f4c0d0','#e890b0','#ffe0ea'],shape:'petals',density:.16},
 ruins:{colors:['#5a6a48','#8a9a60','#4a4a3a'],shape:'moss',density:.12},
 moon:{colors:['#a8d0f0','#d8f0ff','#6a8ab0'],shape:'glints',density:.1},
 labyrinth:{colors:['#f4c9d3','#ffe0a0','#a8e0d0'],shape:'candy',density:.12},
 marineford:{colors:['#5d7386','#a8c0d0','#c2ccd0'],shape:'puddle',density:.08},
 citadel:{colors:['#f4faff','#d8ecff','#a8c8e0'],shape:'drift',density:.07},
 castle:{colors:['#7a1a2a','#a83040','#3a2030'],shape:'stain',density:.08},
 forest:{colors:['#8aa060','#c8a050','#e8d8b0'],shape:'leaves',density:.16},
 zebes:{colors:['#9adf70','#5a9a4a','#d8f0a0'],shape:'acid',density:.08},
 shiganshina:{colors:['#8a7d68','#bfae8c','#6a604f'],shape:'rubble',density:.12},
 leafvillage:{colors:['#6a9a4a','#a8c060','#e0c060'],shape:'leaves',density:.12},
 tournament:{colors:['#e8e4f8','#8a80b0','#c0b0e8'],shape:'cracks',density:.1},
 tempest:{colors:['#f0e080','#ffffff','#e8a0c0'],shape:'flowers',density:.12},
 tokyo:{colors:['#5a6070','#8a90a0','#3a4050'],shape:'puddle',density:.06},
 shibuya:{colors:['#6a3a8a','#9a5ac8','#2a1a3a'],shape:'stain',density:.08},
 eclipse:{colors:['#8a1a20','#d8d0c0','#4a1018'],shape:'bones',density:.1},
 graveyard:{colors:['#5a7a5a','#d8d4c4','#3a4a40'],shape:'moss',density:.12},
};
function decal(rect,shape,x,y,[a,b,c],n){
 if(shape==='petals'){for(let i=0;i<5;i++){const px=x+((n*97+i*13)%11)-5,py=y+((n*53+i*7)%9)-4;rect(px,py,2,1,i%2?a:b);}rect(x,y,1,1,c);}
 else if(shape==='moss'){rect(x-3,y,7,2,a);rect(x-2,y-1,4,1,b);rect(x+2,y+1,3,1,c);}
 else if(shape==='glints'){rect(x,y-1,1,3,a);rect(x-1,y,3,1,a);rect(x,y,1,1,b);}
 else if(shape==='candy'){rect(x-1,y-1,3,3,n>.5?a:c);rect(x,y,1,1,b);}
 else if(shape==='puddle'){rect(x-5,y,11,3,a);rect(x-4,y-1,9,1,a);rect(x-3,y,5,1,b);rect(x+2,y+1,2,1,c);}
 else if(shape==='drift'){rect(x-6,y,13,3,a);rect(x-4,y-1,9,1,a);rect(x-5,y+3,11,1,c);rect(x-2,y,3,1,b);}
 else if(shape==='stain'){rect(x-3,y-1,6,3,a);rect(x-1,y-2,3,1,a);rect(x+3,y+1,2,1,b);rect(x-4,y+2,2,1,c);}
 else if(shape==='leaves'){for(let i=0;i<3;i++){const px=x+((n*71+i*17)%9)-4,py=y+((n*41+i*11)%7)-3;rect(px,py,2,2,[a,b,c][i]);}}
 else if(shape==='acid'){rect(x-4,y,9,3,b);rect(x-3,y,7,2,a);rect(x-1,y,2,1,c);}
 else if(shape==='rubble'){rect(x-2,y,3,2,a);rect(x+2,y+1,2,2,b);rect(x-4,y+2,2,1,c);}
 else if(shape==='cracks'){rect(x-4,y,3,1,b);rect(x-1,y+1,3,1,b);rect(x+2,y,3,1,b);rect(x,y+2,1,2,b);rect(x-1,y,1,1,a);}
 else if(shape==='flowers'){rect(x-1,y,3,1,n>.5?a:c);rect(x,y-1,1,3,n>.5?a:c);rect(x,y,1,1,b);}
 else if(shape==='bones'){rect(x-3,y,7,1,b);rect(x-4,y-1,2,1,b);rect(x+3,y+1,2,1,b);if(n>.6){rect(x-1,y+2,4,2,a);}}
}
// Called with the tile's 2× world scale (256 tile pixels per 512 world units).
export function decorateTerrain(map,cx,cy,rect,palette){
 const ox=cx*512,oy=cy*512,river=riverMap(map),deco=MAP_DECOR[map.id];
 const onRiver=(wx,wy)=>river&&Math.abs(wx-(650+Math.sin(wy/400)*90))<120;
 // Soft patches: darker hollows and lighter glades in 8-pixel steps.
 for(let y=0;y<256;y+=8)for(let x=0;x<256;x+=8){const wx=ox+x*2,wy=oy+y*2;if(onRiver(wx,wy))continue;const v=valueNoise(wx/340,wy/340);
  if(v>.68)rect(x,y,8,8,palette.deep+(v>.8?'3a':'22'));else if(v<.26)rect(x,y,8,8,(palette.grass||palette.ground)+(v<.14?'40':'26'));}
 if(!deco)return;
 for(let y=0;y<256;y+=12)for(let x=0;x<256;x+=12){const wx=ox+x*2,wy=oy+y*2;if(onRiver(wx,wy))continue;const n=lattice(Math.floor(wx/24),Math.floor(wy/24));
  // Decals cluster where the patch noise is high, so they read as places, not static.
  if(n<deco.density*(.5+valueNoise(wx/500+7,wy/500)*1.2))decal(rect,deco.shape,x+((n*977)%10)+1,y+((n*631)%10)+1,deco.colors,n*10%1);}
}

// Each map's centerpiece: a plaza at the spawn point with its own emblem set into the floor.
export const EMBLEM_COLORS={forest:'#e8d8b0',tempest:'#4ac8e8',leafvillage:'#e0603a',moon:'#d8f0ff'};
export const MAP_EMBLEMS={garden:'sakura',ruins:'compass',moon:'crescent',labyrinth:'sigil',marineford:'compass',citadel:'star',castle:'crest',forest:'fairyring',zebes:'sun',shiganshina:'cobbles',leafvillage:'leaf',tournament:'arena',tempest:'slime',eclipse:'brand'};
const TAU=Math.PI*2;
function emblemAt(kind,x,y,R){
 // Returns 0 (plain floor), 1 (inlay) or 2 (bright inlay) for a point inside the plaza.
 const d=Math.hypot(x,y),a=Math.atan2(y,x);
 if(kind==='sakura'){const petal=R*.62*Math.abs(Math.cos(a*2.5));return d<petal?(d<R*.14?2:1):0;}
 if(kind==='compass'){const p8=Math.abs(Math.cos(a*4)),star=R*(.2+.55*Math.pow(p8,6));const broken=Math.sin(a*7+d*.05)>.85;return broken?0:d<star?(Math.abs(Math.cos(a*2))>.97?2:1):Math.abs(d-R*.78)<3?1:0;}
 if(kind==='crescent'){const inMoon=d<R*.55,cut=Math.hypot(x-R*.22,y+R*.08)<R*.48;return inMoon&&!cut?2:Math.abs(d-R*.78)<2?1:0;}
 if(kind==='sigil'){for(const k of [.3,.55,.8])if(Math.abs(d-R*k)<2)return 1;return d<R*.8&&Math.abs(Math.sin(a*3))<.03*R/Math.max(d,1)?2:0;}
 if(kind==='star'){const p6=Math.abs(Math.cos(a*3)),star=R*(.15+.6*Math.pow(p6,5));return d<star?(d<R*.12?2:1):Math.abs(d-R*.82)<2?2:0;}
 if(kind==='crest'){const u=Math.abs(x)+Math.abs(y);return u<R*.5&&(Math.floor((x+y)/16)+Math.floor((x-y)/16))%2===0?1:Math.abs(u-R*.62)<3?2:0;}
 if(kind==='fairyring'){const cap=Math.abs(d-R*.7)<9&&Math.sin(a*14)>.2;return cap?2:Math.abs(d-R*.7)<12&&Math.sin(a*14)>0?1:0;}
 if(kind==='sun'){const rays=Math.abs(Math.sin(a*6))<.14&&d>R*.28&&d<R*.8;return d<R*.24?2:rays?1:Math.abs(d-R*.24)<3?1:0;}
 if(kind==='cobbles'){for(const k of [.3,.55,.8])if(Math.abs(d-R*k)<2)return 2;return Math.abs(Math.sin(a*8))<.04*R/Math.max(d,1)&&d<R*.8?1:0;}
 if(kind==='leaf'){const spiral=Math.abs(((a/TAU*R*.35+d)%(R*.18))-R*.09)<3&&d<R*.62;return spiral?1:Math.abs(d-R*.72)<3?2:0;}
 if(kind==='arena'){for(const k of [.45,.82])if(Math.abs(d-R*k)<3)return 2;return d<R*.82&&Math.floor(d/14)%2&&Math.floor((a+TAU)/(TAU/24))%2?1:0;}
 if(kind==='slime'){const body=y>-R*.32&&Math.hypot(x/1.2,y/.85)<R*.42;const eye=Math.abs(y+R*.06)<4&&Math.abs(Math.abs(x)-R*.14)<6;return eye?0:body?(y<-R*.15?2:1):Math.abs(d-R*.75)<3?2:0;}
 if(kind==='brand'){const ax=Math.abs(x);const stem=ax<5&&Math.abs(y)<R*.55,arms=Math.abs(ax-(-y+R*.15)*.6)<4&&y<R*.15&&y>-R*.5,low=Math.abs(ax-(y-R*.25)*.8)<4&&y>R*.25&&y<R*.55;return stem||arms||low?2:Math.abs(d-R*.78)<3?1:0;}
 return 0;
}
export function drawCenterpiece(map,cx,cy,rect,palette){
 const kind=MAP_EMBLEMS[map.id];if(!kind)return;const R=150,ox=cx*512,oy=cy*512;
 // Only the four tiles that meet at the origin can contain the plaza.
 if(ox>R||ox+512<-R||oy>R||oy+512<-R)return;
 const accent=EMBLEM_COLORS[map.id]||(MAP_DECOR[map.id]?.colors||[palette.stone])[0],floor=palette.stone,rim=palette.deep;
 for(let ty=0;ty<256;ty+=2)for(let tx=0;tx<256;tx+=2){const x=ox+tx*2,y=oy+ty*2,d=Math.hypot(x,y);if(d>R)continue;
  if(d>R-8){rect(tx,ty,2,2,d>R-3?rim:palette.edge||rim);continue;}
  const v=emblemAt(kind,x,y,R-10);rect(tx,ty,2,2,v===2?accent:v===1?mixHex(floor,accent,.65):floor+(d<R*.5?'':'d8'));
  if(v===0&&lattice(Math.floor(x/18),Math.floor(y/18))>.93)rect(tx,ty,2,2,rim+'66');}
}
function mixHex(a,b,t){const p=c=>[1,3,5].map(i=>parseInt(c.slice(i,i+2),16));const x=p(a),y=p(b);return '#'+x.map((v,i)=>Math.round(v+(y[i]-v)*t).toString(16).padStart(2,'0')).join('');}
