// A dry sacrificial plain: crimson channels and ritual seams are painted stone,
// never water or invisible walls. The open central roads agree with scenery.
export const BERSERK_MAP={id:'eclipse',name:'Eclipse Wasteland',subtitle:'Defy the eclipse beneath a ring of ancient bones.',tag:'BERSERK / THE ECLIPSE',color:'#d7a2a4',ground:'#503941',dark:'#211e2a',stone:'#b9aba1',water:'#783e4c',foliage:'#9a777a'};
export const BERSERK_WORLD_PALETTES={eclipse:{ground:'#503941',grass:'#61434b',deep:'#2b2633',stone:'#b9aba1',edge:'#87696e',leaf:['#68565e','#93817e','#c6b7a5','#e1d3b6'],trunk:'#736165',water:'#783e4c',ripple:'#b9757c'}};
const noise=(x,y)=>{const n=Math.sin(x*127.1+y*311.7)*43758.5453;return n-Math.floor(n);};
const mod=(n,m)=>((n%m)+m)%m;

export function drawBerserkTerrain(map,cx,cy,R,P){
 if(map.id!=='eclipse')return false;const p=BERSERK_WORLD_PALETTES.eclipse,ox=cx*512,oy=cy*512;R(0,0,256,256,p.ground);
 for(let y=0;y<256;y+=8)for(let x=0;x<256;x+=8){
  const wx=ox+x*2+8,wy=oy+y*2+8,n=noise(Math.floor(wx/16),Math.floor(wy/16));
  const road=Math.abs(wx)<66||Math.abs(wy)<62,stagger=mod(Math.floor(wy/16),2)*4;
  R(x,y,8,8,n>.6?p.grass:p.ground);R(x,y,8,1,'#392c38');R(x+stagger,y+1,1,7,'#392c38');
  R(x+1,y+1,6,1,n>.5?'#73505b':'#67464e');
  if(road){R(x,y,8,8,'#63515a');R(x+1,y+1,6,6,'#76616a');R(x+2,y+1,4,1,'#988184');if(n>.65){R(x+4,y+3,1,4,'#463843');R(x+4,y+3,3,1,'#463843');}}
  else{
   if(n>.74){P([[x+2,y+1],[x+4,y+3],[x+3,y+6],[x+6,y+7],[x+4,y+5],[x+5,y+3]],'#2e2733');R(x+2,y+2,1,1,'#a47778');}
   const channel=Math.abs(mod(wx+Math.sin(wy/170)*20,384)-192)<7;
   if(channel){R(x+3,y,2,8,'#312532');R(x+3,y+1,1,6,'#a55c68');R(x+4,y+2,1,5,'#743f50');}
   if(n>.94){R(x+2,y+4,3,1,'#b59b95');R(x+3,y+3,1,3,'#b59b95');R(x+4,y+5,2,1,'#77646b');}
  }
  const distance=Math.hypot(wx,wy),ring=Math.abs(distance-180)<10||Math.abs(distance-236)<5;
  if(ring&&!road){R(x+1,y+1,6,6,'#923f53');R(x+2,y+2,4,1,'#c48283');R(x+1,y+6,5,1,'#402c3a');}
 }
 // Small broken ritual wedges give the central circle a deliberate address.
 if(cx>=-1&&cx<=0&&cy>=-1&&cy<=0){const x=-ox/2,y=-oy/2;P([[x,y-28],[x+25,y-9],[x+18,y+25],[x-18,y+25],[x-25,y-9]],'#332b39');P([[x,y-23],[x+20,y-7],[x+15,y+20],[x-15,y+20],[x-20,y-7]],'#7d4557');P([[x,y-13],[x+8,y-2],[x,y+13],[x-8,y-2]],'#b27b7d');R(x-2,y-11,4,21,'#d0a4a0');R(x-9,y+1,18,3,'#d0a4a0');}
 return true;
}

export function drawBerserkProp(map,type,R,P,seed=0){
 if(map.id!=='eclipse')return false;const p=BERSERK_WORLD_PALETTES.eclipse,ink='#282432',bone='#c6b7a5',shade='#8d7976',light='#e2d1b7';
 if(type==='gate'){
  // One broken ossuary arch has two ground-level collision-aligned pillars.
  for(const side of [-1,1]){const x=side*23;P([[x-5,2],[x-5,-50],[x-8,-65],[x-2,-77],[x+5,-66],[x+6,2]],ink);R(x-3,-54,6,55,shade);R(x-2,-53,2,52,bone);for(let i=0;i<5;i++){R(x-4,-49+i*10,8,3,bone);R(x-3,-49+i*10,5,1,light);}R(x-7,-3,14,5,p.deep);}
  P([[-32,-65],[-28,-76],[-17,-84],[-4,-80],[1,-84],[16,-84],[29,-73],[33,-64],[25,-62],[16,-74],[6,-75],[1,-70],[-8,-75],[-18,-75],[-25,-62]],ink);
  P([[-29,-66],[-25,-74],[-16,-80],[-5,-77],[1,-80],[15,-80],[26,-72],[29,-66],[25,-65],[15,-76],[5,-77],[1,-74],[-8,-77],[-17,-77],[-25,-65]],bone);
  for(const [x,y]of [[-18,-77],[-6,-76],[7,-77],[18,-73]]){R(x,y,2,5,shade);R(x-1,y,4,1,light);}P([[-7,-75],[0,-81],[7,-75],[6,-66],[0,-62],[-6,-66]],shade);R(-4,-73,3,3,ink);R(2,-73,3,3,ink);R(-1,-68,2,4,ink);
 }else if(type==='tree'){
  // A ribbed fossil column, never a forest tree or building.
  P([[-12,2],[-8,-10],[-7,-58],[-2,-75],[5,-73],[9,-54],[8,-9],[14,1]],ink);P([[-8,0],[-4,-11],[-4,-57],[0,-71],[3,-69],[5,-54],[4,-10],[10,0]],shade);R(-2,-54,3,45,bone);R(-1,-52,1,39,light);
  for(let i=0;i<6;i++){const y=-14-i*8;P([[-7,y+2],[-12,y-2],[-18,y-9],[-14,y-11],[-9,y-5],[-3,y-3],[3,y-3],[9,y-6],[14,y-12],[18,y-9],[12,y-1],[6,y+2]],ink);P([[-7,y],[-11,y-3],[-15,y-9],[-13,y-9],[-8,y-4],[-2,y-1],[3,y-1],[9,y-4],[14,y-10],[15,y-8],[10,y-2],[5,y]],bone);R(-4,y-1,8,2,light);}
  P([[-9,-62],[-8,-71],[-2,-79],[5,-77],[11,-67],[7,-59],[-5,-58]],shade);P([[-6,-63],[-6,-70],[-1,-75],[4,-73],[7,-66],[4,-61],[-3,-61]],bone);R(-5,-68,4,3,ink);R(2,-68,4,3,ink);P([[-1,-65],[2,-62],[-2,-62]],ink);R(-3,-59,7,3,bone);R(-2,-58,1,3,shade);R(1,-58,1,3,shade);
  R(-11,0,24,3,p.deep);R(-8,-1,17,2,shade);
 }else{
  // Cracked black stone with a fossil face and red mineral seam.
  P([[-23,2],[-24,-11],[-16,-31],[-4,-39],[13,-34],[23,-15],[21,1]],ink);P([[-20,0],[-20,-10],[-13,-29],[-3,-35],[11,-31],[19,-14],[18,0]],'#68505d');P([[-17,-13],[-11,-28],[-2,-32],[9,-29],[13,-21],[0,-16]],'#9b7c7e');P([[-2,-27],[2,-18],[-1,-12],[5,-3],[0,-6],[-5,-15]],'#382c3b');R(-1,-21,1,5,'#bf7d80');R(1,-11,1,5,'#b26775');P([[-14,-19],[-10,-24],[-5,-22],[-5,-13],[-10,-9],[-15,-13]],shade);R(-13,-18,3,3,ink);R(-8,-18,2,3,ink);R(-11,-12,3,2,bone);R(9,-9,8,2,p.edge);R(-19,-2,10,2,p.edge);
 }
 return true;
}

export function berserkMapPreview(map){
 if(map.id!=='eclipse')return null;
 let art='<rect width="200" height="80" fill="#4e283b"/><path d="M0 0h200v10H0m0 16h200v3H0m0 15h200v4H0" fill="#7f3e50"/><circle cx="103" cy="24" r="21" fill="#e1a48b"/><circle cx="107" cy="21" r="19" fill="#292230"/><path d="m0 58 20-12 20 9 27-9 25 11 29-7 20 6 26-10 33 12v22H0Z" fill="#312b38"/><path d="M0 64h200v16H0Z" fill="#65505b"/><path d="m78 80 16-26h15l20 26" fill="#8f7276"/><path d="m0 73 53-4 25 11H0m200-11-57 4-14 7h71" fill="#8c3f54"/>';
 for(const [x,h]of [[14,38],[42,26],[151,31],[179,44]]){art+=`<path d="M${x-3} 67V${67-h}h6v${h}Z" fill="#877477"/><path d="M${x-1} ${68-h}v${h-2}" stroke="#d0bda9" stroke-width="2"/>`;for(let i=0;i<4;i++){const y=61-i*6;art+=`<path d="m${x-8} ${y-3} 5 4h6l6-6" fill="none" stroke="#bcab9e" stroke-width="2"/>`;}}
 art+='<path d="M92 62V45m20 17V45m-23 0 6-9h14l7 9" fill="none" stroke="#c0aa9a" stroke-width="4"/><path d="M98 42h8v7h-8Z" fill="#705560"/><path d="M100 43h2v2h-2m3-2h2v2h-2" fill="#292432"/>';
 return `<svg viewBox="0 0 200 80" shape-rendering="crispEdges" aria-hidden="true">${art}</svg>`;
}
