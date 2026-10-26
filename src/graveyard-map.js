// The grave plots have addresses. Broad avenues stay open through every block;
// painted soil, mist and paving are dry decoration, never hidden water walls.
export const GRAVEYARD_MAP={id:'graveyard',name:'Thriller Bark Graveyard',subtitle:'Follow the lanterns through haunted graves and stolen shadows.',tag:'ONE PIECE / THRILLER BARK',color:'#b4d8cf',ground:'#323b49',dark:'#141e2c',stone:'#9aa5ab',water:'#445663',foliage:'#69717f'};
export const GRAVEYARD_WORLD_PALETTES={graveyard:{ground:'#323b49',grass:'#3b4851',deep:'#1d2935',stone:'#9aa5ab',edge:'#60717b',leaf:['#353d4d','#5b596b','#8f8b91','#c1beb0'],trunk:'#5e5965',water:'#445663',ripple:'#a6c7c6'}};
const noise=(x,y)=>{const n=Math.sin(x*127.1+y*311.7)*43758.5453;return n-Math.floor(n);};
export const graveyardCoordinate=n=>((n+480)%960+960)%960-480;
const isGraveyard=map=>map?.id==='graveyard';

export function drawGraveyardTerrain(map,cx,cy,R,P){
 if(!isGraveyard(map))return false;
 const p=GRAVEYARD_WORLD_PALETTES.graveyard,ox=cx*512,oy=cy*512;
 R(0,0,256,256,p.ground);
 for(let y=0;y<256;y+=8)for(let x=0;x<256;x+=8){
  const wx=ox+x*2+8,wy=oy+y*2+8,dx=Math.abs(graveyardCoordinate(wx)),dy=Math.abs(graveyardCoordinate(wy)),n=noise(Math.floor(wx/16),Math.floor(wy/16));
  const road=dx<82||dy<78,border=dx<98||dy<94;
  if(road){
   R(x,y,8,8,'#596574');R(x+1,y+1,6,6,n>.5?'#687684':'#606e7c');R(x+1,y+1,6,1,'#7d8a95');R(x+1,y+7,7,1,'#3b4656');
   if(n>.75){R(x+4,y+2,1,4,'#414e5d');R(x+4,y+4,3,1,'#414e5d');}
   if(n<.14){R(x+1,y+5,2,2,'#4e6669');R(x+2,y+5,2,1,'#829c8e');}
  }else if(border){
   R(x,y,8,8,'#273440');R(x+1,y+1,6,6,p.edge);R(x+2,y+1,4,1,'#8a9b9f');R(x+6,y+2,1,5,'#42535e');
  }else{
   R(x,y,8,8,n>.53?p.grass:p.ground);
   if(n>.34){R(x+2,y+3,1,3,'#263c40');R(x+1,y+4,1,1,'#596c66');R(x+3,y+3,1,1,'#526569');}
   if(n>.82){R(x+5,y+3,2,1,'#697b79');R(x+6,y+2,1,3,'#697b79');R(x+6,y+3,1,1,'#bbc6b0');}
   if(n<.1){P([[x+2,y+4],[x+5,y+2],[x+7,y+4],[x+5,y+5]],'#4d5869');R(x+3,y+3,2,1,'#7e8690');}
   // Low broken plot edging is painted paving rather than a solid fence.
   if(Math.abs(dx-145)<9&&dy>135&&dy<410){R(x+3,y,2,7,'#4d5d68');R(x+3,y,1,6,'#879591');}
   if(Math.abs(dy-435)<8&&dx>135&&dx<430){R(x,y+3,7,2,'#4d5d68');R(x,y+3,6,1,'#879591');}
  }
 }
 // A worn compass rosette marks the starting crossing, not a repeating building.
 if(cx>=-1&&cx<=0&&cy>=-1&&cy<=0){const x=-ox/2,y=-oy/2;P([[x,y-20],[x+20,y],[x,y+20],[x-20,y]],'#344556');P([[x,y-16],[x+16,y],[x,y+16],[x-16,y]],'#809294');P([[x,y-11],[x+11,y],[x,y+11],[x-11,y]],'#485b69');R(x-1,y-10,2,20,'#b7c6b9');R(x-7,y-2,14,2,'#b7c6b9');}
 return true;
}

function candle(R,P,x,y,flame='#b9e3cc'){
 R(x-3,y-2,7,3,'#293543');R(x-1,y-11,3,10,'#c2c7b1');R(x,y-10,1,8,'#e1dfbc');P([[x,y-18],[x+3,y-13],[x+2,y-10],[x-1,y-10],[x-2,y-13]],'#638f8a');R(x,y-15,1,4,flame);
}
export function drawGraveyardProp(map,type,R,P,seed=0){
 if(!isGraveyard(map))return false;
 const p=GRAVEYARD_WORLD_PALETTES.graveyard,ink='#1c2635',shade='#52616f',stone='#8b99a2',light='#bbc6c4';
 if(type==='gate'){
  // Narrow gateposts agree with the shared +/-46 world-unit colliders.
  for(const side of [-1,1]){const x=side*23;R(x-4,-68,8,71,ink);R(x-3,-65,6,65,shade);R(x-2,-63,2,61,stone);R(x-6,-4,12,7,ink);R(x-5,-4,10,2,light);R(x-6,-69,12,5,shade);P([[x-5,-70],[x,-81],[x+5,-70]],ink);R(x,-77,1,5,light);}
  P([[-30,-69],[-25,-79],[-10,-86],[0,-89],[10,-86],[25,-79],[30,-69],[26,-67],[21,-76],[9,-82],[0,-85],[-9,-82],[-21,-76],[-26,-67]],ink);
  P([[-27,-70],[-22,-77],[-9,-84],[0,-86],[9,-84],[22,-77],[27,-70],[25,-70],[20,-76],[9,-81],[0,-83],[-9,-81],[-20,-76],[-25,-70]],stone);
  for(const side of [-1,1]){const x=side*16;R(x-1,-74,2,19,ink);R(x,-73,1,15,'#829395');P([[x-4,-63],[x,-68],[x+4,-63],[x,-59]],shade);}
  P([[-6,-84],[0,-90],[6,-84],[5,-77],[0,-73],[-5,-77]],shade);R(-4,-83,3,3,ink);R(2,-83,3,3,ink);R(-2,-77,5,2,light);
  // The open leaves curl along each post; there is no bar across the passage.
  for(const side of [-1,1]){const x=side*29;for(let i=0;i<3;i++){R(x+side*i*5-1,-58+i*4,2,50-i*4,ink);R(x+side*i*5,-57+i*4,1,47-i*4,shade);}P([[x,-45],[x+side*12,-42],[x+side*10,-38],[x+side*4,-41]],stone);}
 }else if(type==='tree'){
  P([[-13,3],[-5,-15],[-6,-44],[-18,-56],[-28,-65],[-30,-75],[-25,-74],[-22,-66],[-13,-63],[-7,-56],[-8,-76],[-3,-93],[1,-94],[-2,-77],[2,-62],[9,-73],[10,-88],[14,-91],[15,-72],[24,-81],[31,-80],[25,-74],[16,-66],[5,-46],[7,-18],[17,3],[8,1],[1,-9],[-4,1]],ink);
  P([[-8,1],[-2,-16],[-3,-46],[-15,-59],[-25,-67],[-26,-72],[-22,-64],[-12,-61],[-3,-50],[-5,-76],[-1,-88],[-2,-74],[4,-55],[12,-71],[12,-84],[12,-69],[22,-78],[26,-77],[20,-72],[13,-64],[2,-44],[4,-17],[12,1],[6,-1],[0,-13],[-3,-1]],p.trunk);
  R(-1,-44,2,29,'#91858b');R(-3,-28,1,17,'#b3a8a1');R(4,-49,2,12,'#625b70');R(-15,-60,8,1,'#9c8f97');
  // A small hanging spirit lantern is part of the tree silhouette, not loot.
  R(17,-73,1,16,'#8f9d97');R(13,-58,9,3,ink);P([[13,-55],[22,-55],[22,-45],[18,-41],[13,-46]],ink);R(15,-53,5,7,'#72a9a1');R(16,-52,2,5,'#c4e8ce');R(-13,0,26,3,p.deep);R(-9,0,10,1,'#71777a');
 }else if(type==='rock'&&seed>=.9){
  // One fixed mausoleum uses a broad base; graveyardSceneryFrontage supplies
  // matching base circles. Ordinary rocks never acquire this variant.
  R(-40,-10,80,15,ink);R(-38,-9,76,11,shade);R(-38,-8,76,2,light);R(-34,-59,68,50,ink);R(-31,-57,62,47,stone);R(-30,-55,59,3,light);R(-31,-17,62,5,shade);
  P([[-39,-58],[-39,-65],[0,-88],[39,-65],[39,-58]],ink);P([[-34,-63],[0,-82],[34,-63]],stone);P([[-27,-64],[0,-77],[27,-64]],shade);R(-34,-61,68,3,light);
  for(const side of [-1,1]){const x=side*25;R(x-4,-52,8,37,shade);R(x-3,-51,3,35,light);R(x-6,-55,12,4,stone);R(x-6,-17,12,4,light);}
  P([[-14,-12],[-14,-45],[-9,-54],[0,-59],[9,-54],[14,-45],[14,-12]],ink);P([[-10,-12],[-10,-44],[-6,-50],[0,-53],[6,-50],[10,-44],[10,-12]],'#354354');R(-1,-49,2,37,shade);R(-9,-35,18,2,shade);R(-9,-21,18,2,shade);R(4,-32,2,5,'#b7ad93');
  P([[-5,-74],[0,-78],[5,-74],[4,-68],[0,-65],[-4,-68]],light);R(-3,-73,2,2,ink);R(2,-73,2,2,ink);R(-1,-69,2,2,ink);R(-40,2,80,3,'#3c4d58');
  for(const x of [-33,33])candle(R,P,x,-7);
 }else if(type==='rock'){
  R(-20,-1,41,6,ink);R(-17,0,35,3,shade);R(-16,1,18,1,light);
  if(seed<.3){
   P([[-12,-2],[-12,-36],[-9,-44],[-3,-48],[5,-46],[11,-40],[12,-2]],ink);P([[-9,-3],[-9,-35],[-6,-42],[-2,-44],[4,-42],[8,-37],[9,-3]],stone);R(-7,-36,13,2,light);R(-2,-32,2,17,shade);R(-7,-27,12,2,shade);R(-6,-11,12,1,'#687d82');
  }else if(seed<.6){
   R(-7,-44,15,41,ink);R(-16,-34,33,12,ink);R(-5,-42,11,38,stone);R(-14,-32,29,8,stone);R(-4,-40,2,36,light);R(-12,-31,25,1,light);R(3,-27,2,13,shade);R(-10,-8,20,4,shade);
  }else{
   P([[-14,-2],[-14,-34],[-9,-43],[9,-43],[15,-34],[15,-2]],ink);P([[-11,-3],[-11,-33],[-6,-40],[7,-40],[12,-32],[12,-3]],stone);R(-9,-36,18,2,light);P([[-6,-25],[-5,-31],[0,-34],[6,-30],[7,-25],[3,-21],[-3,-21]],shade);R(-4,-28,3,3,ink);R(3,-28,2,3,ink);R(-2,-23,5,2,light);R(-8,-14,15,1,shade);R(-5,-11,9,1,shade);
  }
  // The earth rectangle is a low, traversable burial plot beneath the marker.
  P([[-18,7],[-12,3],[13,3],[21,9],[22,19],[-20,19]],'#252f3d');P([[-14,8],[-9,5],[10,5],[17,10],[18,15],[-16,15]],'#48505c');R(-12,8,23,1,'#6b7179');R(-9,12,21,1,'#3a4350');
  if(seed>.5)candle(R,P,-22,1);else{R(-16,-3,7,3,'#667d70');R(9,-8,5,4,'#667d70');}
 }else return false;
 return true;
}

export function graveyardLandmarks(map){
 if(!isGraveyard(map))return [];
 return [{id:'landmark:graveyard-gate',x:0,y:-560,type:'gate',seed:.3},{id:'landmark:graveyard-mausoleum',x:330,y:-560,type:'rock',seed:.95}];
}
export function graveyardSceneryFrontage(map,o){return isGraveyard(map)&&o?.type==='rock'&&o.seed>=.9?{offset:43,radius:30}:null;}
export function graveyardSceneryLayout(map,left,top,w,h){
 if(!isGraveyard(map))return null;
 const list=[],landmarks=graveyardLandmarks(map),add=(id,x,y,type,seed)=>{
  if(x<left-100||x>left+w+100||y<top-20||y>top+h+200)return;
  if(landmarks.some(l=>l.type==='rock'&&Math.abs(x-l.x)<125&&Math.abs(y-l.y)<185))return;
  list.push({id:'scenery:graveyard:'+id,x,y,type,seed});
 };
 for(let bx=Math.floor((left-550)/960);bx<=Math.floor((left+w+550)/960);bx++)for(let by=Math.floor((top-550)/960);by<=Math.floor((top+h+550)/960);by++){
  for(const side of [-1,1])for(let col=0;col<2;col++)for(const row of [-360,-190,190,360]){
   const x=bx*960+side*(210+col*115),y=by*960+row;
   // Every plot remains outside both broad avenues and the starting clearing.
   if(Math.hypot(x,y)<220||Math.abs(x)<100||Math.abs(y)<100)continue;
   add(`grave:${bx}:${by}:${side}:${col}:${row}`,x,y,'rock',[.2,.4,.7][Math.abs(bx+by+col+row/10)%3]);
  }
  for(const side of [-1,1])for(const row of [-420,420])add(`willow:${bx}:${by}:${side}:${row}`,bx*960+side*420,by*960+row,'tree',.35);
 }
 for(const l of landmarks)if(l.x>=left-100&&l.x<=left+w+100&&l.y>=top-20&&l.y<=top+h+200)list.push(l);
 return list;
}
export function graveyardSupplyPositionAllowed(map,x,y){
 if(!isGraveyard(map))return null;
 return Math.hypot(x,y)>=195&&Math.abs(graveyardCoordinate(x))>120&&Math.abs(graveyardCoordinate(y))>115;
}

const supply=(name,base,form,body,light,accent)=>({name,base,form,body,light,accent});
export const GRAVEYARD_SUPPLIES=['gravecoffin','lanternurn','graveoffering'];
export const GRAVEYARD_SUPPLY_DEFS={
 gravecoffin:supply('Weathered Coffin Cache','crate','gravecoffin','#68566c','#b6a2ad','#8fa9a8'),
 lanternurn:supply('Soulfire Lantern Urn','pot','lanternurn','#4b7278','#b2d9c9','#d3c29d'),
 graveoffering:supply('Grave Offering Candles','lantern','graveoffering','#7e8691','#d9dbc3','#95cbb9'),
};
export const GRAVEYARD_SUPPLY_GEOMETRY={gravecoffin:[.75,21],lanternurn:[.78,15],graveoffering:[.8,16]};
export function drawGraveyardSupply(type,R,P){
 const d=GRAVEYARD_SUPPLY_DEFS[type];if(!d)return false;const ink='#1c2938',{body,light,accent}=d;
 if(type==='gravecoffin'){
  P([[-10,2],[-18,-34],[-11,-49],[10,-49],[18,-34],[11,2]],ink);P([[-8,0],[-15,-34],[-9,-46],[8,-46],[15,-34],[9,0]],body);P([[-8,-43],[7,-43],[12,-33],[7,-4],[-6,-4],[-12,-33]],'#8a7288');R(-1,-40,3,27,light);R(-7,-33,15,3,light);R(-17,-25,5,4,accent);R(13,-25,5,4,accent);P([[-8,-44],[-6,-47],[5,-47],[7,-44]],'#b1a1ae');R(-8,-1,17,2,'#4b4a5b');R(-10,-17,21,1,'#514758');
 }else if(type==='lanternurn'){
  R(-12,-2,25,5,ink);R(-10,-3,21,3,accent);P([[-8,-8],[-11,-17],[-10,-30],[-5,-36],[5,-36],[11,-30],[12,-17],[8,-8]],ink);P([[-6,-9],[-8,-17],[-7,-28],[-4,-32],[4,-32],[8,-28],[9,-17],[6,-9]],body);R(-5,-29,12,17,'#79b4a7');R(-3,-27,3,13,light);R(2,-27,2,13,'#d7e9c9');R(-9,-34,19,3,accent);R(-2,-43,4,10,ink);R(-6,-43,12,3,accent);R(-1,-40,2,6,light);R(-8,-10,17,3,accent);P([[-2,-23],[1,-27],[4,-21],[1,-15],[-3,-18]],'#eff0cb');
 }else{
  R(-19,-1,39,6,ink);R(-17,-2,35,5,body);R(-15,-2,31,1,light);P([[-13,-5],[-9,-12],[7,-12],[13,-5]],accent);R(-10,-6,21,3,'#4f6b68');
  for(const [x,y]of [[-11,-4],[0,-11],[12,-4]])candle(R,P,x,y,light);
  P([[-6,-7],[-3,-11],[1,-10],[4,-13],[8,-9],[6,-5],[0,-4]],'#c19aaf');R(-2,-9,3,2,'#e9c8ce');R(-16,3,13,1,'#5d6976');R(8,2,8,2,'#526274');
 }
 return true;
}

export function graveyardMapPreview(map){
 if(!isGraveyard(map))return null;
 let art='<rect width="200" height="80" fill="#182437"/><circle cx="151" cy="20" r="15" fill="#c4d8d0"/><circle cx="145" cy="16" r="13" fill="#405365"/><path d="M0 48l21-10 18 7 22-10 19 8 20-6 20 9 23-9 21 9 18-8 18 9v33H0Z" fill="#2d3f49"/><path d="M0 59h200v21H0Z" fill="#3e4b58"/><path d="m78 80 16-26h14l16 26" fill="#829095"/><path d="m86 80 12-26h6l12 26" fill="#647582"/>';
 for(const [x,y,variant]of [[15,70,0],[40,57,1],[59,72,0],[139,69,1],[180,74,0]])art+=variant?`<path d="M${x-2} ${y}v-18h4v18m-8-11h16v4h-16m-5 9h26v3h-26" fill="#9da9ad"/>`:`<path d="M${x-5} ${y}v-16l3-4h4l4 4v16m-13 0h17v3h-17" fill="#a6b2b3"/><path d="M${x-1} ${y-14}v9m-3-5h7" stroke="#627581" stroke-width="1"/>`;
 art+='<path d="M154 65V39l15-10 15 10v26m-34 0h39v4h-39" fill="#687986"/><path d="m151 39 18-14 18 14Z" fill="#93a7ac"/><path d="M163 64V47l6-5 6 5v17" fill="#243746"/><path d="M86 57V30h5v27m19 0V30h5v27m-29-27 9-8h11l9 8" fill="none" stroke="#b3c1bd" stroke-width="2"/><path d="M23 57V29l-7-10m7 14 9-15m-9 24-10-5m8-7-1-13" fill="none" stroke="#756c80" stroke-width="3"/><path d="M49 69h3v-8h-3m80 10h3v-9h-3" fill="#bde5cd"/><path d="M0 53h72v3H0m129 4h71v3h-71m-35 8h57v2H94" fill="#78999b" opacity=".25"/>';
 return `<svg viewBox="0 0 200 80" shape-rendering="crispEdges" aria-hidden="true">${art}</svg>`;
}
