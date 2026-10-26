import {graveyardSceneryLayout,graveyardLandmarks,graveyardSceneryFrontage,graveyardSupplyPositionAllowed} from './graveyard-map.js';
// Landmarks have fixed addresses. Buildings follow street fronts; only natural
// growth uses small offsets. These coordinates are also the collision layout.
export const SCENERY_VERSION=2;
export const cityCoordinate=n=>((n+480)%960+960)%960-480;
const noise=(x,y)=>{const n=Math.sin(x*127.1+y*311.7)*43758.5453;return n-Math.floor(n);};
export const cityMap=map=>['tokyo','shibuya'].includes(map.id);
export const riverMap=map=>!['labyrinth','tournament','tokyo','shibuya','eclipse','graveyard'].includes(map.id);
const villageMap=map=>['shiganshina','leafvillage'].includes(map.id);
const naturalMap=map=>['garden','moon','forest','labyrinth','zebes','citadel'].includes(map.id);

// Only the feet of a facade are solid: its tall painted wall is perspective,
// not a collision rectangle. Overlapping circles give the base its real width.
export function sceneryFrontage(map,o){
 const graveyard=graveyardSceneryFrontage(map,o);if(graveyard)return graveyard;
 if(o.type!=='rock')return null;
 if(cityMap(map))return {offset:30,radius:25};
 if(map.id==='leafvillage'&&o.seed<=.78||map.id==='tempest')return {offset:23,radius:22};
 if(map.id==='shiganshina')return {offset:17,radius:20};
 return null;
}

// A station has two entrances beside the main crossing, rather than a metro
// gate appearing in every random scenery cell.
export function mapLandmarks(map){
 if(map.id==='graveyard')return graveyardLandmarks(map);
 if(map.id==='eclipse')return [{id:'landmark:ossuary',x:0,y:-560,type:'gate',seed:.3},...[-1,1].flatMap(side=>[-330,330].map(y=>({id:`landmark:rib:${side}:${y}`,x:side*340,y,type:'tree',seed:.3})))];
 if(cityMap(map))return[
  {id:'fort:entrance',x:-260,y:-145,type:'gate',seed:.2},
  {id:'landmark:station-east',x:260,y:-145,type:'gate',seed:.7},
 ];
 const list=[];
 if(['marineford','citadel','castle','zebes','shiganshina','leafvillage','tournament','tempest'].includes(map.id)){
  list.push({id:'fort:entrance',x:0,y:-210,type:'gate',seed:0});
  if(map.id!=='tournament')for(const side of [-1,1])list.push(
   {id:side<0?'fort:left':'fort:right',x:side*190,y:-220,type:'rock',seed:.3},
   {id:side<0?'fort:banner-left':'fort:banner-right',x:side*320,y:-215,type:'tree',seed:.4});
 }
 if(map.id==='leafvillage')list.push({id:'landmark:hokage',x:-350,y:-520,type:'rock',seed:.95});
 return list;
}

function safeScenery(map,x,y,type,landmarks){
 const width=cityMap(map)&&type==='tree'?5:type==='rock'?72:type==='tree'?58:80;
 if(Math.hypot(x,y)<200||Math.abs(x)<85||Math.abs(y)<80)return false;
 if(villageMap(map)&&Math.abs(x)<150)return false;
 if(riverMap(map)&&Math.abs(x-(650+Math.sin(y/400)*90))<110+width)return false;
 if(cityMap(map)&&(Math.abs(cityCoordinate(x))<115+width||Math.abs(cityCoordinate(y))<110))return false;
 return !landmarks.some(l=>Math.abs(l.x-x)<width+75&&Math.abs(l.y-y)<190);
}

export function sceneryLayout(map,left,top,w,h){
 const graveyard=graveyardSceneryLayout(map,left,top,w,h);if(graveyard)return graveyard;
 const landmarks=mapLandmarks(map),list=[];
 // Drawing needs the full height of scenery just below the viewport.
 const add=(key,x,y,type,seed=.3)=>{
  if(x<left-100||x>left+w+100||y<top-20||y>top+h+200||!safeScenery(map,x,y,type,landmarks))return;
  list.push({id:'scenery:v2:'+key,x,y,type,seed});
 };
 if(cityMap(map)){
  for(let bx=Math.floor((left-250)/960);bx<=Math.floor((left+w+250)/960);bx++)for(let by=Math.floor((top-400)/960);by<=Math.floor((top+h+400)/960);by++){
   // Two coherent frontages leave a wide pedestrian courtyard through each
   // block. Shop fronts share a baseline; apartments form the second row.
   for(let row=0;row<2;row++)for(let col=0;col<4;col++){
    const x=bx*960+200+col*185,y=by*960+(row?745:300);
    add(`block:${bx}:${by}:${row}:${col}`,x,y,'rock',row?.82:.2+noise(bx+col,by)*.25);
   }
   // Street furniture sits at corners/sidewalks instead of among shop fronts.
   for(const [i,x,y]of [[0,135,135],[1,825,135],[2,135,825],[3,825,825]])add(`signal:${bx}:${by}:${i}`,bx*960+x,by*960+y,'tree',.4);
  }
 }else if(villageMap(map)){
  for(let row=Math.floor((top-300)/360);row<=Math.floor((top+h+300)/360);row++)for(let col=Math.floor((left-180)/180);col<=Math.floor((left+w+180)/180);col++){
   const x=col*180+90,y=row*360+230;
   // Houses never randomly turn into the Hokage monument; it has one address.
   add(`houses:${col}:${row}`,x,y,'rock',.22+noise(col,row)*.4);
   if(col%4===0)add(`village-tree:${col}:${row}`,x+80,y+150,'tree',.4);
  }
 }else if(map.id==='eclipse'){
  // Parallel fossil colonnades leave broad avenues and an open ritual center.
  for(let x=Math.floor((left-400)/960);x<=Math.floor((left+w+400)/960);x++)for(let y=Math.floor((top-400)/960);y<=Math.floor((top+h+400)/960);y++){
   for(const side of [-1,1])for(const row of [260,640])add(`eclipse:rib:${x}:${y}:${side}:${row}`,x*960+side*280,y*960+row,'tree',.3);
   add(`eclipse:stone:${x}:${y}`,x*960+480,y*960+470,'rock',.4);
  }
 }else if(map.id==='tempest'){
  for(const x of [-430,-230,230,430])for(const y of [-570,-230,270,610])add(`hut:${x}:${y}`,x,y,'rock',.3);
  groves(true);
 }else if(naturalMap(map))groves(false);
 else{
  // Colonnades, naval emplacements and arena rubble form regular islands;
  // there are no randomly repeated gates or buildings across the arena.
  for(let x=Math.floor((left-200)/360);x<=Math.floor((left+w+200)/360);x++)for(let y=Math.floor((top-200)/360);y<=Math.floor((top+h+200)/360);y++){
   const wx=x*360+190,wy=y*360+230,type=map.id==='tournament'?(x+y)%3===0?'tree':'rock':map.id==='marineford'?(x+y)%3===0?'tree':'rock':map.id==='ruins'?'rock':(x+y)%2===0?'rock':'tree';
   add(`court:${x}:${y}`,wx,wy,type,.4);
  }
 }
 function groves(outsideVillage){
  for(let x=Math.floor((left-300)/620);x<=Math.floor((left+w+300)/620);x++)for(let y=Math.floor((top-300)/620);y<=Math.floor((top+h+300)/620);y++){
   const gx=x*620+210,gy=y*620+235;
   for(const [i,dx,dy]of [[0,0,0],[1,110,35],[2,55,145]]){
    const wx=gx+dx+(noise(x+i,y)-.5)*36,wy=gy+dy+(noise(y-i,x)-.5)*28;
    if(outsideVillage&&Math.abs(wx)<600&&Math.abs(wy)<800)continue;
    add(`grove:${x}:${y}:${i}`,wx,wy,i===2&&map.id!=='tempest'?'rock':'tree',noise(x+i,y+4));
   }
  }
 }
 for(const landmark of landmarks)if(landmark.x>=left-100&&landmark.x<=left+w+100&&landmark.y>=top-20&&landmark.y<=top+h+200)list.push(landmark);
 return list;
}

export function supplyPositionAllowed(map,x,y){
 if(map.id==='graveyard')return graveyardSupplyPositionAllowed(map,x,y);
 if(Math.hypot(x,y)<195||Math.abs(x)<55||Math.abs(y)<55)return false;
 if(riverMap(map)&&Math.abs(x-(650+Math.sin(y/400)*90))<125)return false;
 // Keep crates and lockers off the carriageway, in the gaps between fronts.
 return !cityMap(map)||(Math.abs(cityCoordinate(x))>130&&Math.abs(cityCoordinate(y))>130);
}
