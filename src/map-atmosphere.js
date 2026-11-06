// Ambient atmosphere for each map: weather or drifting particles in screen space with a
// little parallax, an optional drifting fog, and a gentle color grade. Particles are a pure
// function of time and index, so nothing is stored and quiet motion simply freezes them.
const TAU=Math.PI*2;
const h=(i,k)=>{const n=Math.sin(i*12.9898+k*78.233)*43758.5453;return n-Math.floor(n);};
export const MAP_ATMOSPHERE={
 garden:{kind:'petals',colors:['#f4c0d0','#e890b0','#ffe0ea'],count:38,grade:'#ffd0e00c',shadow:'#2a1a3a22'},
 ruins:{kind:'dust',colors:['#f0e8c0','#d8d0a0'],count:30,grade:'#f0e0a00c',shadow:'#2a2a1a26'},
 moon:{kind:'fireflies',colors:['#d8f0a0','#a8e0ff'],count:26,grade:'#a0c0ff10',shadow:'#0a143040',fog:'#a0b8d0'},
 labyrinth:{kind:'glyphs',colors:['#f4c9d3','#ffe0a0','#d99dba'],count:20,grade:'#ff80c010',shadow:'#2a0a2a34'},
 marineford:{kind:'spray',colors:['#ffffff','#d8ecf4'],count:34,grade:'#c0e0ff0c',shadow:'#0a1a3026'},
 citadel:{kind:'snow',colors:['#ffffff','#e0f0ff'],count:70,grade:'#c0e0ff14',shadow:'#0a1a3034'},
 castle:{kind:'embers',colors:['#ff7a4a','#ffb070','#d83a3a'],count:32,grade:'#ff304010',shadow:'#1a0a1a40',fog:'#6a1a2a'},
 forest:{kind:'leaves',colors:['#8aa060','#c8a050','#a8c070'],count:26,grade:'#c0ffa00a',shadow:'#0a1a1030'},
 zebes:{kind:'spores',colors:['#a8f0a0','#70d8b0','#e0ffb0'],count:30,grade:'#80ffa00c',shadow:'#0a0a2a40',fog:'#3a5a4a'},
 shiganshina:{kind:'dust',colors:['#f0dcb0','#d8c098'],count:26,grade:'#ffd0900c',shadow:'#2a1a0a26'},
 leafvillage:{kind:'leaves',colors:['#7aa050','#b0c060','#e0b050'],count:22,grade:'#ffe0a00a',shadow:'#1a1a0a24'},
 tournament:{kind:'stars',colors:['#ffffff','#c0d0ff','#ffd0a0'],count:44,grade:'#a080ff10',shadow:'#0a0a2a40'},
 tempest:{kind:'rain',colors:['#c0d8f0','#e0f0ff'],count:60,grade:'#90b0d00e',shadow:'#0a1a2a30'},
 tokyo:{kind:'dust',colors:['#ffd0e0','#c0e0ff'],count:18,grade:'#c0c0ff08',shadow:'#0a0a1a2a'},
 shibuya:{kind:'ash',colors:['#9a5ac8','#3a2a4a','#d8a0ff'],count:36,grade:'#8040c014',shadow:'#1a0a2a44',fog:'#3a1a4a'},
 eclipse:{kind:'ash',colors:['#d83a3a','#3a1a1a','#ff8a5a'],count:40,grade:'#ff203014',shadow:'#2a000a50',fog:'#5a0a10'},
 graveyard:{kind:'fireflies',colors:['#a8f0b0','#d0ffd0'],count:20,grade:'#80c0a00c',shadow:'#0a1a1a44',fog:'#8aa8a0'},
};
function particle(c,kind,x,y,size,color,i,t){
 c.fillStyle=color;
 if(kind==='petals'||kind==='leaves'){c.save();c.translate(x,y);c.rotate(t*1.5+i);c.scale(1,.5+Math.sin(t*3+i)*.4);c.beginPath();c.ellipse(0,0,size*(kind==='leaves'?1.4:1),size*.6,0,0,TAU);c.fill();c.restore();}
 else if(kind==='snow'||kind==='spray'||kind==='dust')c.fillRect(Math.round(x),Math.round(y),size,size);
 else if(kind==='embers'||kind==='spores'||kind==='fireflies'){const a=c.globalAlpha;c.globalAlpha=a*(.45+.55*Math.abs(Math.sin(t*2+i)));c.fillRect(Math.round(x),Math.round(y),size,size);c.globalAlpha=a*.25;c.fillRect(Math.round(x)-1,Math.round(y)-1,size+2,size+2);c.globalAlpha=a;}
 else if(kind==='glyphs'){c.save();c.translate(x,y);c.rotate(t+i);c.fillRect(-size,-.5,size*2,1);c.fillRect(-.5,-size,1,size*2);c.restore();}
 else if(kind==='ash'){c.fillRect(Math.round(x),Math.round(y),size+1,size);}
 else if(kind==='rain'){c.fillRect(Math.round(x),Math.round(y),1,size*4);}
 else if(kind==='stars'){const a=c.globalAlpha;c.globalAlpha=a*(.3+.7*Math.abs(Math.sin(t*1.3+i*1.7)));c.fillRect(Math.round(x),Math.round(y),size,size);c.globalAlpha=a;}
}
// Motion per kind: [fall speed, horizontal drift, sway amplitude, size range].
const MOTION={petals:[28,14,18,[2,4]],leaves:[30,18,22,[2,4]],snow:[40,8,12,[1,3]],spray:[4,60,6,[1,2]],dust:[4,10,10,[1,2]],embers:[-34,6,14,[1,3]],spores:[-14,4,16,[1,3]],fireflies:[0,0,30,[2,2]],glyphs:[-12,0,10,[2,4]],ash:[22,10,14,[1,3]],rain:[420,90,0,[2,4]],stars:[0,0,0,[1,2]]};
export function drawMapAtmosphere(c,g,w,h0,reduced=false){
 if(g.riftArena||!g.map)return false;const def=MAP_ATMOSPHERE[g.map.id];if(!def)return false;
 const t=reduced?0:g.time||0,[fall,drift,sway,[s0,s1]]=MOTION[def.kind],px=(g.p?.x||0)*.35,py=(g.p?.y||0)*.35,count=reduced?Math.ceil(def.count/3):def.count;
 c.save();
 // Fog banks drift slowly across the screen.
 if(def.fog&&!reduced)for(let i=0;i<4;i++){const x=((h(i,1)*w+t*12*(i%2?1:-1)-px*.4)%(w+400)+w+400)%(w+400)-200,y=h(i,2)*h0;const grd=c.createRadialGradient(x,y,0,x,y,220);grd.addColorStop(0,def.fog+'22');grd.addColorStop(1,def.fog+'00');c.fillStyle=grd;c.fillRect(x-220,y-220,440,440);}
 c.globalAlpha=.8;
 for(let i=0;i<count;i++){const size=s0+Math.floor(h(i,3)*(s1-s0+1)),speed=.6+h(i,4)*.8;
  let x=h(i,5)*w+t*drift*speed-px+Math.sin(t*.8+i)*sway,y=h(i,6)*h0+t*fall*speed-py;
  if(def.kind==='fireflies'){x=h(i,5)*w-px*.6+Math.sin(t*.5+i*1.3)*sway;y=h(i,6)*h0-py*.6+Math.cos(t*.4+i*.9)*sway;}
  x=((x%(w+40))+w+40)%(w+40)-20;y=((y%(h0+40))+h0+40)%(h0+40)-20;
  particle(c,def.kind,x,y,size,def.colors[i%def.colors.length],i,t);}
 c.globalAlpha=1;
 // A gentle color grade: a tint over the scene, deeper toward the bottom.
 c.fillStyle=def.grade;c.fillRect(0,0,w,h0);const grd=c.createLinearGradient(0,h0*.45,0,h0);grd.addColorStop(0,def.shadow.slice(0,7)+'00');grd.addColorStop(1,def.shadow);c.fillStyle=grd;c.fillRect(0,0,w,h0);
 c.restore();return true;
}
