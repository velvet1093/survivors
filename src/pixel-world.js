import {BERSERK_WORLD_PALETTES,drawBerserkTerrain,drawBerserkProp,berserkMapPreview} from './berserk-map.js';
import {GRAVEYARD_WORLD_PALETTES,drawGraveyardTerrain,drawGraveyardProp,graveyardMapPreview} from './graveyard-map.js';
import {TOKYO_WORLD_PALETTES,drawTokyoTerrain,drawTokyoProp,tokyoMapPreview} from './tokyo-maps.js';
import {ANIME_WORLD_PALETTES,drawAnimeTerrain,drawAnimeProp,animeMapPreview} from './anime-maps.js';
import {drawMapSupply} from './map-supplies.js';
import {hash} from './world.js';
const terrainCache=new Map(),propCache=new Map();
export const WORLD_PALETTES={
 ...GRAVEYARD_WORLD_PALETTES,
 ...ANIME_WORLD_PALETTES,
 ...BERSERK_WORLD_PALETTES,
 ...TOKYO_WORLD_PALETTES,
 shiganshina:{ground:'#a4967d',grass:'#aca087',deep:'#655f53',stone:'#d7c9a8',edge:'#807968',leaf:['#476350','#688367','#9da577','#d4c492'],trunk:'#78594c',water:'#638788',ripple:'#b0c6b5'},
 zebes:{ground:'#4e496b',grass:'#62577a',deep:'#30324e',stone:'#a7a0b8',edge:'#726787',leaf:['#316563','#559381','#92c9a2','#e0e2a0'],trunk:'#59627d',water:'#69844b',ripple:'#c7d18a'},
 castle:{ground:'#665967',grass:'#7a6874',deep:'#494252',stone:'#a9a0a8',edge:'#807888',leaf:['#46545c','#62766d','#88a18d','#c5c4a5'],trunk:'#635969',water:'#4f557c',ripple:'#9699ba'},
 forest:{ground:'#4d7053',grass:'#63885d',deep:'#34523f',stone:'#96a17b',edge:'#788d69',leaf:['#294e43','#417353','#70a06a','#acc48a'],trunk:'#6a6050',water:'#3e7782',ripple:'#8cbbb6'},
 marineford:{ground:'#7e909b',grass:'#91a2aa',deep:'#5d7386',stone:'#c2ccd0',edge:'#95a8b4',leaf:['#7193a8','#b1cbd7','#dce8e7','#f4f2de'],trunk:'#647184',water:'#3f789a',ripple:'#8ab5c8'},
 citadel:{ground:'#658099',grass:'#809bb0',deep:'#455f7e',stone:'#b4ccda',edge:'#91afc5',leaf:['#597d9b','#86acc6','#bdd8e4','#f1f6ed'],trunk:'#6c849b',water:'#3c7c9e',ripple:'#b1d8e8'},
 garden:{ground:'#587363',grass:'#64836a',deep:'#466153',stone:'#8e9583',edge:'#66796e',leaf:['#9e6081','#c985a0','#e7abc0','#f1c6cc'],trunk:'#674b54',water:'#426e83',ripple:'#759ba4'},
 ruins:{ground:'#777b61',grass:'#888c67',deep:'#646c58',stone:'#a5a08b',edge:'#777b70',leaf:['#596b50','#7d9061','#a8b97b','#c8cb92'],trunk:'#615b50',water:'#427376',ripple:'#7baaa2'},
 moon:{ground:'#394f63',grass:'#456275',deep:'#314659',stone:'#667e8d',edge:'#485f74',leaf:['#355b5b','#4f7971','#739b88','#a3b99b'],trunk:'#4c6b64',water:'#314f77',ripple:'#6b8fab'},
 labyrinth:{ground:'#58435d',grass:'#73516b',deep:'#49374f',stone:'#b08b9e',edge:'#725768',leaf:['#80547d','#ad719d','#d99dba','#f4c9d3'],trunk:'#547d73',water:'#54415f',ripple:'#aa819e'},
};
function canvas(w,h){const tile=document.createElement('canvas');tile.width=w;tile.height=h;const c=tile.getContext('2d');const rect=(x,y,w,h,col)=>{c.fillStyle=col;c.fillRect(Math.round(x),Math.round(y),Math.round(w),Math.round(h));};const poly=(points,col)=>{for(let y=Math.floor(Math.min(...points.map(p=>p[1])));y<=Math.max(...points.map(p=>p[1]));y++){const xs=[];for(let i=0,j=points.length-1;i<points.length;j=i++){const a=points[i],b=points[j];if((a[1]>y+.5)!==(b[1]>y+.5))xs.push(a[0]+(y+.5-a[1])*(b[0]-a[0])/(b[1]-a[1]));}xs.sort((a,b)=>a-b);for(let i=0;i<xs.length;i+=2)rect(Math.ceil(xs[i]-.5),y,Math.floor(xs[i+1]-.5)-Math.ceil(xs[i]-.5)+1,1,col);}};return{tile,rect,poly};}
export function terrain(map,cx,cy){
 const key=map.id+':'+cx+':'+cy;if(terrainCache.has(key))return terrainCache.get(key);const {tile,rect,poly}=canvas(256,256),p=WORLD_PALETTES[map.id],ox=cx*512,oy=cy*512;rect(0,0,256,256,p.ground);
 if(drawGraveyardTerrain(map,cx,cy,rect,poly)||drawBerserkTerrain(map,cx,cy,rect,poly)||drawTokyoTerrain(map,cx,cy,rect,poly)||drawAnimeTerrain(map,cx,cy,rect,poly)){if(terrainCache.size>=80)terrainCache.delete(terrainCache.keys().next().value);terrainCache.set(key,tile);return tile;}
 for(let y=0;y<256;y+=16)for(let x=0;x<256;x+=16){const wx=ox+x*2,wy=oy+y*2,n=hash(wx,wy);
   if(map.id==='shiganshina'){
     rect(x,y,16,16,p.edge);for(let row=0;row<2;row++){const shift=(Math.floor(wy/16)+row)%2*4;for(let k=-1;k<2;k++){const xx=x+k*9+shift,yy=y+row*8;if(xx<x||xx+8>x+16)continue;rect(xx+1,yy+1,7,6,n>.55?'#b2a58c':'#a99c84');rect(xx+2,yy+1,5,1,'#c7b89b');rect(xx+1,yy+6,7,1,'#8a826f');}}if(n>.9){rect(x+5,y+12,2,2,'#6d7c60');rect(x+7,y+11,1,2,'#8c9671');}if(Math.abs(wx+16)<38){rect(x+1,y+1,14,14,'#c1b394');rect(x+2,y+2,12,1,'#ded0ad');rect(x+1,y+14,14,1,'#8d836d');}
   }else if(map.id==='zebes'){rect(x,y,16,16,p.deep);poly([[x+3,y],[x+12,y],[x+15,y+5],[x+14,y+13],[x+8,y+15],[x+1,y+12],[x,y+4]],n>.6?p.grass:p.ground);{rect(x+3,y+2,8,1,p.edge);rect(x+2,y+3,1,5,p.edge);}if(n>.82){rect(x+7,y+5,2,5,p.leaf[1]);rect(x+5,y+7,6,1,p.leaf[2]);}if(Math.abs(wx+16)<42||Math.abs(wy+16)<42){rect(x+1,y+1,14,14,'#596076');rect(x+2,y+2,12,2,'#8694a4');rect(x+3,y+11,10,1,'#30374d');rect(x+7,y+7,3,1,'#a9d9c5');}}else if(['marineford','citadel','castle','shiganshina'].includes(map.id)){
     rect(x,y,16,16,p.edge);rect(x+1,y+1,14,14,p.ground);rect(x+2,y+2,12,1,p.stone);rect(x+14,y+3,1,11,p.deep);if(n>.65){rect(x+6,y+7,1,6,p.deep);rect(x+7,y+6,4,1,p.deep);}if(map.id==='citadel'){if(n>.3){rect(x+3,y+3,5,2,p.leaf[2]);rect(x+2,y+5,3,1,p.leaf[3]);}if(n>.8){rect(x+10,y+9,2,4,'#b7e3ee');rect(x+9,y+10,4,1,'#d9f1f0');}}
     if(map.id==='castle'){if(Math.abs(wx+16)<45){rect(x+1,y+1,14,14,'#8d4c69');rect(x+2,y+2,2,12,'#bb8b7f');rect(x+12,y+2,1,12,'#d9bc8c');}else if(n>.84){rect(x+4,y+6,6,1,'#8e9290');rect(x+6,y+5,2,4,'#6e8076');}}
   }else if(map.id==='labyrinth'){
     rect(x,y,16,16,(Math.floor(wx/32)+Math.floor(wy/32))%2?p.grass:p.ground);rect(x,y,16,1,p.deep);rect(x,y,1,16,p.deep);rect(x+2,y+2,12,1,'#a679932a');
     if(n>.7){poly([[x+8,y+4],[x+12,y+8],[x+8,y+12],[x+4,y+8]],'#956580');rect(x+7,y+7,2,2,'#d8a7bb');}
   }else{
     if(n>.6)rect(x,y,16,16,n>.8?p.grass:p.ground);
     for(let k=0;k<3;k++){const xx=x+2+Math.floor(hash(wx+k,wy)*11),yy=y+3+Math.floor(hash(wy+k,wx)*10);rect(xx,yy,1,3,p.deep);rect(xx-1,yy-1,1,2,p.grass);rect(xx+1,yy+1,1,2,p.grass);}
     if(n>.9){const col=map.id==='garden'?'#e5b1c6':map.id==='ruins'?'#cbd092':'#a4bbd0';rect(x+7,y+5,3,1,col);rect(x+8,y+4,1,3,col);rect(x+8,y+5,1,1,'#e9d8a5');}
     const d=Math.hypot(wx+16,wy+16),road=Math.abs(wx+16)<46||Math.abs(wy+16)<43||(d>95&&d<155);
     if(map.id==='forest'&&!road&&n>.55){rect(x+3,y+9,7,2,p.deep);rect(x+5,y+7,7,1,p.grass);if(n>.9){rect(x+9,y+8,3,2,'#cba1b2');rect(x+10,y+10,1,2,'#d2d3af');}}
     if(road&&map.id==='forest'){rect(x,y,16,16,'#675f4c');rect(x+1,y+1,14,14,'#918567');rect(x+2,y+2,12,1,'#b7a77c');if(n>.4){rect(x+5,y+8,6,1,'#766a52');rect(x+7,y+7,3,1,'#b3a179');}if(n>.75)rect(x,y+11,3,4,p.grass);}
     else if(road){rect(x+1,y+1,14,14,p.deep);rect(x+1,y+1,13,12,p.edge);rect(x+2,y+2,11,9,p.stone);rect(x+3,y+3,9,1,'#d6d7ba44');if(n>.7){rect(x+8,y+8,1,4,p.edge);rect(x+9,y+7,3,1,p.edge);}if(n<.15)rect(x+2,y+11,4,2,p.grass);}
   }
 }
 // Fine bank steps agree with the physics river and leave visible bridge crossings.
 if(map.id!=='labyrinth')for(let y=0;y<256;y+=2){const wy=oy+y*2,stream=650+Math.sin(wy/400)*90,bridge=Math.abs(((wy%800)+800)%800-400)<38;
   for(let x=0;x<256;x+=2){const wx=ox+x*2,d=Math.abs(wx-stream);if(d<105){if(bridge){rect(x,y,2,2,'#8b7661');if(Math.floor(wy/12)%2===0)rect(x,y,2,1,'#574b48');if(d>92)rect(x,y,2,2,'#d1b38a');}else{rect(x,y,2,2,d>91?p.deep:p.water);if(d>85&&d<92)rect(x,y,2,2,p.ripple);if(d<75&&hash(Math.floor(wx/20),Math.floor(wy/14))>.92)rect(x,y,2,1,p.ripple);}}}
 }
 if(map.id==='marineford'){for(let sy=Math.floor(oy/800);sy<=Math.ceil((oy+512)/800);sy++){const wy=sy*800+180,wx=650+Math.sin(wy/400)*90,x=(wx-ox)/2,y=(wy-oy)/2;poly([[x-16,y-23],[x+16,y-23],[x+19,y+18],[x,y+31],[x-19,y+18]],'#d7ddd4');rect(x-12,y-19,25,36,'#667b89');rect(x-3,y-17,7,26,'#cfcdc1');rect(x-10,y-1,22,2,'#e4dfc3');rect(x-1,y-35,2,30,'#495d70');rect(x+1,y-35,14,9,'#eef0de');}}
 if(cx>=-1&&cx<=0&&cy>=-1&&cy<=0){const x=-ox/2,y=-oy/2;poly([[x,y-18],[x+18,y],[x,y+18],[x-18,y]],p.edge);poly([[x,y-15],[x+15,y],[x,y+15],[x-15,y]],p.ground);rect(x-2,y-2,5,5,p.stone);}
 if(terrainCache.size>=80)terrainCache.delete(terrainCache.keys().next().value);terrainCache.set(key,tile);return tile;
}
export function propSprite(map,type,seed=0){
 const variant=type==='rock'?(map.id==='graveyard'?(seed>=.9?'mausoleum':'grave'):map.id==='leafvillage'?(seed>.78?'monument':'house'):['tokyo','shibuya'].includes(map.id)?(seed<.66?'shop':'tower'):''):'';
 const key=map.id+':'+type+':'+Math.floor(seed*4)+':'+variant;if(propCache.has(key))return propCache.get(key);const {tile,rect,poly}=canvas(96,115),p=WORLD_PALETTES[map.id],ink='#27323d',x=48,y=95;
 const R=(xx,yy,w,h,c)=>rect(x+xx,y+yy,w,h,c),P=(points,c)=>poly(points.map(([xx,yy])=>[x+xx,y+yy]),c);
 // Ground contact uses two stepped bands, never a soft vector shadow.
 R(-13,0,27,3,'#19283866');R(-18,1,36,1,'#19283844');
 if(drawMapSupply(type,R,P)){propCache.set(key,tile);return tile;}
 if(drawGraveyardProp(map,type,R,P,seed)||drawBerserkProp(map,type,R,P,seed)||drawTokyoProp(map,type,R,P,seed)||drawAnimeProp(map,type,R,P,seed)){propCache.set(key,tile);return tile;}
 if(map.id==='shiganshina'){
  if(type==='gate'){R(-33,-85,16,88,p.edge);R(17,-85,16,88,p.edge);R(-36,-92,72,14,p.stone);R(-32,-78,64,4,p.deep);for(const x of [-30,20]){R(x,-76,10,73,p.stone);for(let yy=-71;yy<0;yy+=10)R(x,yy,10,1,p.edge);}R(-30,-89,60,2,'#efe1c2');R(-7,-88,14,7,'#8e8e77');R(-4,-87,3,5,'#c9d6c3');R(1,-87,3,5,'#a9b8c3');}
  else if(type==='rock'){R(-18,-36,36,38,'#d3c4a6');R(-18,-35,36,3,'#b5a489');P([[-23,-34],[0,-56],[23,-34]],'#78574b');P([[-20,-35],[0,-52],[19,-35]],'#b3785d');for(let yy=-45;yy<-34;yy+=4)R(-9-(yy+45),yy,18+2*(yy+45),1,'#8d604e');R(-19,-34,38,3,'#544d45');R(-3,-19,8,21,'#655f54');for(const xx of [-13,9]){R(xx,-26,6,9,'#596f72');R(xx+2,-26,1,9,'#e5d8ba');R(xx,-23,6,1,'#e5d8ba');}R(-18,-3,36,4,p.deep);R(-18,-31,2,29,'#84725e');R(16,-31,2,29,'#84725e');R(-18,-14,36,2,'#84725e');R(-7,-31,2,16,'#84725e');R(6,-31,2,16,'#84725e');}
  else{R(-4,-70,8,72,'#736c58');R(-3,-68,2,68,'#c7b592');R(4,-68,23,28,'#5d7667');P([[4,-40],[27,-40],[16,-31]],'#5d7667');P([[8,-62],[14,-65],[20,-61],[21,-48],[15,-43],[9,-48]],'#c5d3c0');R(13,-61,2,15,'#8094a0');R(17,-59,2,12,'#8094a0');R(-10,0,20,3,p.edge);}
  propCache.set(key,tile);return tile;
 }
 if(map.id==='zebes'){
  if(type==='gate'){R(-30,-65,12,68,p.edge);R(18,-65,12,68,p.edge);P([[-30,-65],[-17,-78],[17,-78],[30,-65],[18,-60],[12,-68],[-12,-68],[-18,-60]],p.stone);R(-26,-58,5,48,p.deep);R(21,-58,5,48,p.deep);for(const side of [-1,1]){R(side<0?-24:21,-54,3,33,p.leaf[1]);R(side<0?-28:19,-5,9,6,p.stone);}R(-9,-73,18,3,p.leaf[2]);}
  else if(type==='tree'){R(-4,-63,9,64,p.deep);R(-2,-61,5,60,p.trunk);for(let i=0;i<4;i++){const yy=-25-i*12;P([[-20+i*2,yy],[-13,yy-13],[0,yy-19],[15,yy-12],[22-i*2,yy]],p.leaf[0]);P([[-16+i*2,yy-2],[-10,yy-12],[1,yy-16],[13,yy-10],[17-i*2,yy-2]],p.leaf[1]);R(-6,yy-12,6,2,p.leaf[2]);R(7,yy-5,4,2,p.leaf[3]);}}
  else{P([[-20,1],[-17,-22],[-9,-33],[1,-24],[9,-46],[16,-31],[22,-5],[15,2]],p.deep);P([[-16,0],[-13,-20],[-8,-28],[1,-17],[9,-40],[12,-25],[17,-4],[12,0]],p.edge);P([[7,-35],[10,-26],[9,-6],[4,-10]],p.leaf[2]);P([[-11,-22],[-7,-27],[-6,-8]],p.stone);}
  propCache.set(key,tile);return tile;
 }
 if(map.id==='castle'){
  if(type==='gate'){R(-28,-64,10,66,p.edge);R(18,-64,10,66,p.edge);R(-32,-72,64,15,p.stone);for(let i=-2;i<=2;i++)R(i*13-4,-80,8,10,p.stone);R(-30,-70,60,2,'#d6c5bf');P([[-18,-57],[0,-67],[18,-57],[12,-52],[0,-60],[-12,-52]],p.deep);R(-25,-54,4,42,p.stone);R(21,-54,4,42,p.stone);for(const side of [-1,1]){R(side<0?-27:19,-44,8,19,'#9a526d');P([[side<0?-27:19,-25],[side<0?-19:27,-25],[side<0?-23:23,-18]],'#9a526d');}}
  else if(type==='tree'){R(-2,-60,5,62,p.trunk);for(let i=0;i<5;i++){const w=20-i*3,yy=-18-i*11;P([[-w,yy],[0,yy-27],[w,yy]],p.leaf[i%2]);P([[0,yy-25],[w-3,yy-2],[2,yy-7]],p.leaf[2]);}}
  else{R(-17,-7,35,9,p.deep);R(-12,-48,25,42,p.edge);R(-14,-54,29,8,p.stone);R(-10,-48,5,38,p.stone);R(6,-48,3,38,p.deep);R(-4,-40,8,14,'#b48294');R(-1,-38,2,8,'#ddc59f');R(-16,-4,32,3,p.stone);}
  propCache.set(key,tile);return tile;
 }
 if(map.id==='forest'){
  if(type==='gate'){for(const side of [-1,1]){const xx=side*24;P([[xx-5,2],[xx-5,-38],[xx-side*7,-55],[xx+side*3,-60],[xx+5,-41],[xx+6,2]],'#334536');R(xx-3,-37,5,36,p.trunk);R(xx-5,-5,9,7,p.leaf[1]);}P([[-32,-58],[-20,-69],[0,-74],[20,-68],[32,-58],[25,-52],[11,-62],[-9,-64],[-23,-52]],p.leaf[0]);P([[-28,-59],[-17,-66],[0,-70],[17,-65],[28,-58],[12,-60],[-12,-62]],p.leaf[2]);for(let i=0;i<7;i++){const xx=-21+i*7;R(xx,-62+i%2*4,3,7,p.leaf[1]);R(xx,-55+i%2*5,2,2,p.leaf[3]);}}
  else if(type==='tree'){P([[-12,2],[-5,-22],[-6,-50],[-19,-63],[-13,-65],[1,-51],[14,-69],[20,-65],[5,-45],[7,-19],[16,2],[6,0],[0,-10],[-5,1]],'#293b35');P([[-8,0],[-3,-22],[-4,-48],[1,-50],[4,-20],[11,0],[4,-2],[0,-14],[-3,-2]],p.trunk);R(-2,-40,2,26,'#9b8b65');for(let i=0;i<15;i++){const a=i*2.399,xx=Math.cos(a)*(9+hash(i,seed)*19),yy=-67+Math.sin(a)*16;P([[xx-12,yy-6],[xx-5,yy-12],[xx+9,yy-10],[xx+17,yy-3],[xx+13,yy+5],[xx-4,yy+8],[xx-15,yy+1]],p.leaf[0]);P([[xx-10,yy-6],[xx-4,yy-10],[xx+8,yy-8],[xx+13,yy-2],[xx+4,yy+2],[xx-8,yy+1]],p.leaf[1+i%2]);if(i%3===0)R(xx-4,yy-7,7,2,p.leaf[3]);}R(-11,-2,8,3,p.leaf[1]);R(6,-4,9,4,p.leaf[2]);}
  else{P([[-19,2],[-16,-15],[-5,-24],[11,-20],[19,-8],[17,1]],'#2b443b');P([[-16,0],[-13,-14],[-4,-21],[9,-18],[16,-8],[14,-1]],p.edge);P([[-12,-14],[-3,-20],[8,-17],[11,-12],[0,-9]],p.stone);R(-11,-5,10,3,p.leaf[1]);R(5,-15,8,3,p.leaf[2]);R(9,-12,5,3,p.leaf[1]);}
  propCache.set(key,tile);return tile;
 }
 if((map.id==='marineford'||map.id==='citadel')&&type!=='crate'&&type!=='pot'){
  const ice=map.id==='citadel';
  if(type==='tree'){if(ice){R(-2,-48,4,49,p.trunk);for(let i=0;i<4;i++){const w=25-i*5,yy=-18-i*13;P([[-w,yy],[0,yy-28],[w,yy]],p.leaf[i%3]);P([[-w+3,yy-3],[0,yy-26],[w-5,yy-5]],p.leaf[2]);R(-3,yy-16,6,2,p.leaf[3]);}}else{R(-2,-68,4,69,'#c1c9cd');R(2,-66,29,28,'#ecefdf');R(2,-40,26,3,'#a9bfcb');P([[10,-53],[17,-49],[24,-54],[20,-48],[17,-45],[14,-49]],'#547f98');R(15,-59,4,7,'#547f98');R(-9,-2,18,5,p.deep);}}
  else if(type==='gate'){R(-28,-63,11,65,p.stone);R(17,-63,11,65,p.stone);R(-31,-66,62,12,p.edge);R(-30,-66,60,3,p.leaf[3]);for(let i=-2;i<=2;i++)R(i*12-4,-72,7,8,p.stone);R(-28,-50,10,2,p.deep);R(18,-50,10,2,p.deep);if(ice){P([[-16,-54],[-9,-48],[-14,-37]],p.leaf[3]);P([[11,-54],[17,-54],[14,-38]],p.leaf[3]);}else{R(-7,-64,15,10,'#ecf0e4');P([[-5,-59],[0,-56],[5,-60],[2,-55],[-2,-55]],'#557d94');}}
  else if(type==='lantern'){R(-2,-33,4,34,p.deep);R(-7,-36,15,13,p.stone);R(-4,-33,9,6,ice?'#b2e6ee':'#edd7a6');R(-9,-39,19,3,p.edge);R(-8,-2,17,4,p.edge);}
  else if(ice){P([[-15,1],[-18,-15],[-8,-28],[-3,-12],[5,-37],[14,-18],[18,-3],[10,2]],p.deep);P([[-14,0],[-14,-15],[-8,-24],[-6,-8],[5,-33],[11,-17],[13,0]],p.leaf[2]);P([[4,-30],[6,-18],[4,-2],[0,-5]],p.leaf[3]);}
  else{R(-18,-6,36,8,p.deep);R(-10,-17,21,13,'#536c80');R(-14,-15,32,8,'#344e63');R(14,-17,8,12,'#718b9e');R(-12,-14,24,2,'#92a8b1');R(-12,1,6,5,'#3b5168');R(10,1,6,5,'#3b5168');}
  propCache.set(key,tile);return tile;
 }
 if(type==='crate'){
   R(-10,-18,21,19,ink);R(-9,-17,19,17,'#8b634d');R(-9,-17,19,4,'#c6a477');R(-8,-12,17,1,'#5f4b42');R(-8,-5,17,1,'#5f4b42');P([[-8,-13],[-6,-14],[8,-1],[6,0]],'#c6a477');P([[6,-14],[8,-13],[-6,0],[-8,-1]],'#c6a477');for(const xx of [-7,7])for(const yy of [-15,-2])R(xx,yy,1,1,ink);
 }else if(type==='pot'){
   P([[-5,-15],[5,-15],[5,-11],[9,-7],[8,-1],[4,2],[-4,2],[-8,-1],[-9,-7],[-5,-11]],ink);P([[-4,-14],[4,-14],[4,-10],[8,-6],[6,0],[-5,0],[-7,-6],[-4,-10]],'#bd8f91');R(-5,-7,12,2,'#efd1b2');R(-4,-15,9,2,'#dfb5a8');R(-3,-14,6,1,'#67495f');R(-5,-9,2,3,'#e4b5b0');
 }else if(type==='tree'){
   if(map.id==='moon'){
     for(let i=0;i<5;i++){const xx=-19+i*9,h=55+Math.floor(hash(i,seed)*24);R(xx,-h,4,h,p.leaf[0]);R(xx+1,-h,1,h,p.leaf[2]);for(let j=1;j<5;j++){const yy=-j*h/5;R(xx,yy,5,1,p.leaf[3]);P([[xx,yy-2],[xx-13,yy-9],[xx-6,yy-1]],p.leaf[1]);P([[xx+4,yy-2],[xx+17,yy-9],[xx+9,yy-1]],p.leaf[2]);}}
   }else if(map.id==='labyrinth'){
     R(-2,-49,5,49,p.trunk);P([[-1,-26],[-17,-37],[-15,-32],[0,-20]],p.leaf[0]);for(let i=0;i<8;i++){const a=i*Math.PI/4;const xx=Math.round(Math.cos(a)*13),yy=-58+Math.round(Math.sin(a)*13);P([[xx-7,yy-5],[xx+2,yy-8],[xx+8,yy-2],[xx+6,yy+5],[xx-4,yy+7]],p.leaf[i%3]);R(xx-2,yy-5,4,1,p.leaf[3]);}R(-7,-64,15,13,'#784c76');R(-4,-61,3,3,'#f4d8b4');R(3,-61,3,3,'#f4d8b4');
   }else{
     P([[-6,0],[-4,-35],[-13,-49],[-8,-50],[2,-34],[12,-51],[17,-50],[5,-28],[6,0]],ink);P([[-3,0],[-2,-35],[-10,-48],[-6,-47],[3,-32],[13,-48],[15,-48],[3,-27],[4,0]],p.trunk);R(-2,-25,2,24,'#99736a');
     for(let i=0;i<17;i++){const a=i*2.399,rr=8+hash(i,seed)*18,xx=Math.round(Math.cos(a)*rr),yy=-58+Math.round(Math.sin(a)*rr*.6);P([[xx-12,yy-4],[xx-8,yy-9],[xx+6,yy-9],[xx+13,yy-2],[xx+10,yy+6],[xx-7,yy+7],[xx-13,yy+2]],p.leaf[0]);P([[xx-11,yy-5],[xx-6,yy-9],[xx+5,yy-8],[xx+11,yy-2],[xx+4,yy+2],[xx-8,yy+1]],p.leaf[1+i%2]);if(i%3===0){R(xx-4,yy-7,5,2,p.leaf[3]);R(xx+4,yy-4,3,1,p.leaf[3]);}}
   }
 }else if(type==='gate'){
   const col=map.id==='ruins'?p.stone:map.id==='labyrinth'?'#b6779a':'#ac7279';
   R(-26,-54,5,56,ink);R(21,-54,5,56,ink);R(-25,-51,3,51,col);R(22,-51,3,51,col);R(-30,-3,13,5,p.edge);R(17,-3,13,5,p.edge);P([[-37,-60],[-23,-56],[23,-56],[37,-60],[35,-53],[-35,-53]],ink);P([[-35,-60],[-22,-57],[22,-57],[35,-60],[33,-55],[-33,-55]],col);R(-27,-44,54,5,ink);R(-26,-44,52,3,col);
   if(map.id==='marineford'||map.id==='citadel'){
     rect(x,y,16,16,p.edge);rect(x+1,y+1,14,14,p.ground);rect(x+2,y+2,12,1,p.stone);rect(x+14,y+3,1,11,p.deep);if(n>.65){rect(x+6,y+7,1,6,p.deep);rect(x+7,y+6,4,1,p.deep);}if(map.id==='citadel'){if(n>.3){rect(x+3,y+3,5,2,p.leaf[2]);rect(x+2,y+5,3,1,p.leaf[3]);}if(n>.8){rect(x+10,y+9,2,4,'#b7e3ee');rect(x+9,y+10,4,1,'#d9f1f0');}}
   }else if(map.id==='labyrinth'){P([[-24,-53],[-12,-53],[-18,-34],[-14,-5],[-24,1]],'#995d85');P([[24,-53],[12,-53],[18,-34],[14,-5],[24,1]],'#995d85');R(-24,-18,9,2,'#e5c394');R(15,-18,9,2,'#e5c394');R(-10,-49,21,18,p.deep);R(-8,-47,17,14,p.stone);R(-6,-45,13,10,p.ground);R(0,-45,1,7,'#efd2c5');R(1,-39,4,1,'#efd2c5');}
   else{for(let i=-2;i<=2;i++)R(i*6-1,-34,2,5,'#e1d3aa');P([[-18,-38],[0,-33],[18,-38],[0,-31]],'#d0b88d');}
 }else if(type==='lantern'){
   R(-8,-3,17,5,ink);R(-7,-4,15,3,p.stone);R(-2,-17,5,14,p.edge);R(-8,-27,17,12,ink);R(-5,-25,11,8,'#edc88c');R(-4,-24,4,6,'#ffebbb');R(0,-25,1,8,'#a77e5e');P([[-12,-27],[0,-35],[12,-27]],ink);P([[-10,-28],[0,-34],[10,-28]],p.stone);R(-1,-37,3,3,p.stone);
   if(map.id==='marineford'||map.id==='citadel'){
     rect(x,y,16,16,p.edge);rect(x+1,y+1,14,14,p.ground);rect(x+2,y+2,12,1,p.stone);rect(x+14,y+3,1,11,p.deep);if(n>.65){rect(x+6,y+7,1,6,p.deep);rect(x+7,y+6,4,1,p.deep);}if(map.id==='citadel'){if(n>.3){rect(x+3,y+3,5,2,p.leaf[2]);rect(x+2,y+5,3,1,p.leaf[3]);}if(n>.8){rect(x+10,y+9,2,4,'#b7e3ee');rect(x+9,y+10,4,1,'#d9f1f0');}}
   }else if(map.id==='labyrinth'){R(-5,-24,11,7,'#c9add6');R(0,-25,1,6,'#f5d4bd');R(0,-20,4,1,'#f5d4bd');}
 }else if(map.id==='ruins'){
   P([[-16,2],[-16,-5],[-11,-7],[-11,-34],[-6,-38],[10,-35],[12,-7],[17,-5],[17,2]],ink);R(-10,-34,20,28,p.edge);R(-8,-33,15,25,p.stone);R(-6,-31,3,20,'#c4bfa4');R(4,-31,2,21,'#777b70');R(-14,-7,28,4,p.stone);R(-16,-2,33,3,p.edge);P([[-10,-35],[-5,-40],[0,-36],[5,-39],[11,-35]],p.stone);R(-8,-10,5,3,p.grass);R(3,-28,3,2,p.deep);R(2,-26,1,4,p.deep);R(-15,-1,5,2,p.grass);
 }else{
   P([[-16,0],[-15,-10],[-8,-18],[5,-20],[14,-14],[17,-3],[12,2],[-8,3]],ink);P([[-15,-1],[-13,-11],[-7,-17],[5,-18],[13,-13],[15,-3],[10,1]],p.edge);P([[-13,-11],[-7,-17],[5,-18],[12,-13],[3,-8],[-5,-9]],p.stone);R(-6,-14,7,2,'#c2c3ab66');P([[-2,-9],[-4,-4],[1,-1],[3,-1],[-2,-4]],p.deep);R(7,-12,6,3,p.grass);R(10,-9,4,2,p.deep);
 }
 propCache.set(key,tile);return tile;
}
export function mapPreview(map){
 const graveyard=graveyardMapPreview(map);if(graveyard)return graveyard;
 const berserk=berserkMapPreview(map);if(berserk)return berserk;
 const city=tokyoMapPreview(map);if(city)return city;
 const anime=animeMapPreview(map);if(anime)return anime;
 if(map.id==='shiganshina')return `<svg viewBox="0 0 200 80" shape-rendering="crispEdges" aria-hidden="true"><rect width="200" height="80" fill="#b4c4bc"/><path d="M0 9h200v49H0Z" fill="#c7bea4"/><path d="M0 10h200M0 23h200M0 36h200M0 49h200" stroke="#a69d88" stroke-width="2"/><path d="M0 7h200v6H0" fill="#e7d9b9"/><path d="M84 57V29l16-12 16 12v28" fill="#736f60"/><path d="M91 57V31l9-8 9 8v26" fill="#464d49"/><path d="M0 58h200v22H0" fill="#a4967d"/>${[5,42,134,171].map(x=>`<path d="M${x} 73V48h25v25" fill="#dfceb0"/><path d="m${x-4} 49 16-17 17 17" fill="#a26b53"/><path d="M${x+5} 55h5v8h-5m10-8h5v8h-5" fill="#647d7c"/>`).join('')}<path d="m87 80 9-23h8l11 23" fill="#d0c1a1"/></svg>`;

 if(map.id==='zebes')return `<svg viewBox="0 0 200 80" shape-rendering="crispEdges" aria-hidden="true"><rect width="200" height="80" fill="#292c49"/><path d="M0 0h200v13l-20 12-25-11-23 15-30-13-27 9-26-13-25 11L0 15Z" fill="#6f6087"/><path d="M0 65h200v15H0Z" fill="#575571"/><path d="M0 72h58v8H0m138-7h62v7h-62" fill="#93aa6d"/><path d="M68 66V28h13v38m38 0V28h13v38M70 28l13-12h34l13 12" fill="none" stroke="#a9a1b8" stroke-width="6"/><path d="M77 37v24m46-24v24M87 23h26" stroke="#9cd5bc" stroke-width="3"/><path d="m7 57 15-28 16 27m119 1 17-26 17 28" fill="#559381"/><path d="M12 53h22m128 0h23" stroke="#c4dfad" stroke-width="3"/><path d="M87 67h27v13H87" fill="#788297"/></svg>`;

 if(map.id==='castle')return `<svg viewBox="0 0 200 80" shape-rendering="crispEdges" aria-hidden="true"><rect width="200" height="80" fill="#3d344d"/><circle cx="153" cy="18" r="12" fill="#bc8198"/><path d="M0 64h200v16H0Z" fill="#696174"/><path d="M25 64V21h30v43m90 0V21h30v43M55 64V34h90v30" fill="#a29ba7"/><path d="M23 17h9v8h8v-8h8v8h9v-8m86 0h9v8h8v-8h8v8h9v-8" fill="none" stroke="#c0b7bb" stroke-width="5"/><path d="M85 64V47l15-8 15 8v17" fill="#493b53"/><path d="M88 80V64h24v16M32 32h15v19l-7 6-8-6m106-19h15v19l-7 6-8-6" fill="#9f5876"/><path d="M0 69h80v2H0m120 0h80v2h-80" fill="#b8aca8"/></svg>`;
 if(map.id==='forest')return `<svg viewBox="0 0 200 80" shape-rendering="crispEdges" aria-hidden="true"><rect width="200" height="80" fill="#294e43"/><path d="M0 53h200v27H0Z" fill="#547657"/><path d="m77 80 14-43h17l18 43" fill="#96a17b"/>${[10,40,147,179].map((x,i)=>`<path d="M${x} 66V21h8v45" fill="#6a6050"/><path d="m${x-17} 34 8-23 15-8 17 11 4 27-16 6-20-4Z" fill="${i%2?'#70a06a':'#417353'}"/><path d="M${x-8} 15h21v4h-21" fill="#acc48a"/>`).join('')}<path d="m52 70 5-7 7 1 4 6m68 1 3-7 6-1 6 8" fill="#cba1b2"/><path d="M54 70h10v4H54m85-3h8v4h-8" fill="#e6d6b9"/></svg>`;

 if(map.id==='marineford'||map.id==='citadel'){const ice=map.id==='citadel';return `<svg viewBox="0 0 200 80" shape-rendering="crispEdges" preserveAspectRatio="xMidYMid slice" aria-hidden="true"><rect width="200" height="80" fill="${ice?'#527793':'#6f9cae'}"/><path d="M0 55h200v25H0Z" fill="${ice?'#b8d6e2':'#3e7595'}"/><path d="M15 60V24h30v36m110 0V24h30v36M45 60V32h110v28" fill="${ice?'#a4c7dc':'#d5dfdc'}"/><path d="M13 20h34v8H13m140-8h34v8h-34M51 28h98v7H51" fill="${ice?'#daedf0':'#eff0df'}"/><path d="M83 60V43h34v17M25 31h10v13H25m140-13h10v13h-10" fill="#54738a"/><path d="M20 66h60v3H20m55 7h100v2H75" fill="#b6d3da"/>${ice?'<path d="m5 59 10-20 6 21m153 0 9-25 12 26M70 31l5 14 5-14m43 0 5 17 5-17" fill="#e7f3f1"/>':'<path d="M97 28V5h2v23m0-22h19v12H99" fill="#edf0df"/><path d="m102 12 6 2 5-3-3 5h-5Z" fill="#4f819a"/>'}</svg>`;}

 const p=WORLD_PALETTES[map.id];let shapes=`<rect width="200" height="80" fill="${p.deep}"/><rect y="26" width="200" height="54" fill="${p.ground}"/>`;
 for(let y=30;y<80;y+=10)for(let x=0;x<200;x+=10){if(map.id==='labyrinth')shapes+=`<rect x="${x}" y="${y}" width="9" height="9" fill="${(x+y)%20?p.grass:p.ground}"/>`;else if(x>130&&x<156)shapes+=`<rect x="${x}" y="${y}" width="10" height="10" fill="${p.water}"/>`;else if(hash(x,y)>.65)shapes+=`<path d="M${x} ${y+6}h2v-4h1v5h3v1h-6Z" fill="${p.grass}"/>`;}
 shapes+=`<path d="M0 64h200v8H0Z" fill="${p.edge}"/><path d="M0 65h200v3H0Z" fill="${p.stone}"/>`;
 for(const x of [18,164]){if(map.id==='moon'){for(let i=0;i<3;i++)shapes+=`<path d="M${x+i*6} 62V8h3v54m-3-30-9-6 4 7m8-15 9-6-4 8" fill="${p.leaf[i]}"/>`;}else shapes+=`<path d="M${x+10} 63V32h4v31Z" fill="${p.trunk}"/><path d="M${x-5} 25h10v-7h20v6h10v15h-7v7H${x}v-7h-5Z" fill="${p.leaf[0]}"/><path d="M${x-3} 26h10v-7h16v6h10v8h-10v6H${x}v-5h-3Z" fill="${p.leaf[1]}"/><path d="M${x+7} 21h12v3H${x+7}m-6 7h7v3H${x+1}" fill="${p.leaf[3]}"/>`;}
 shapes+=`<path d="M76 61V25h5v36m38 0V25h5v36M69 18l12 4h37l14-4v7H69m7 8h48v4H76" fill="${map.id==='ruins'?p.stone:'#b9808b'}"/>`;
 return `<svg viewBox="0 0 200 80" shape-rendering="crispEdges" preserveAspectRatio="xMidYMid slice" aria-hidden="true">${shapes}</svg>`;
}
