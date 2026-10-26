// Modern urban arenas. Road markings are traversable decoration; buildings and
// station pillars use the shared deterministic world-collision layout.
export const TOKYO_MAPS=[
 {id:'tokyo',name:'Modern Tokyo',subtitle:'Keep the neon streets alive beneath the city skyline.',tag:'MODERN JAPAN / TOKYO',color:'#a6d7d8',ground:'#697582',dark:'#293747',stone:'#c9d0c8',water:'#4d7896',foliage:'#70a995'},
 {id:'shibuya',name:'Shibuya Incident',subtitle:'Break through the curtain at the cursed scramble crossing.',tag:'JUJUTSU KAISEN / SHIBUYA',color:'#bca5df',ground:'#393f57',dark:'#19233a',stone:'#9ba7bb',water:'#514b7a',foliage:'#9d86bd'},
];
export const TOKYO_WORLD_PALETTES={
 tokyo:{ground:'#697582',grass:'#9ca7aa',deep:'#3d4b5b',stone:'#d5d9cd',edge:'#b7c3be',leaf:['#3c6980','#64929c','#a2d2cf','#f1e4bb'],trunk:'#526170',water:'#4d7896',ripple:'#b5dddc'},
 shibuya:{ground:'#393f57',grass:'#586078',deep:'#232b43',stone:'#a0aec0',edge:'#747e9b',leaf:['#443d71','#76679b','#b6a4d4','#ead1e5'],trunk:'#3e4a62',water:'#514b7a',ripple:'#b8a2dc'},
};
const noise=(x,y)=>{const n=Math.sin(x*127.1+y*311.7)*43758.5453;return n-Math.floor(n);};
const streetCoordinate=n=>((n+480)%960+960)%960-480;
export function drawTokyoTerrain(map,cx,cy,R,P){
 const p=TOKYO_WORLD_PALETTES[map.id];if(!p)return false;const night=map.id==='shibuya',ox=cx*512,oy=cy*512;
 R(0,0,256,256,p.grass);
 // A repeating city grid has broad north/south and east/west escape routes.
 for(let y=0;y<256;y+=4)for(let x=0;x<256;x+=4){
  const wx=ox+x*2,wy=oy+y*2,dx=streetCoordinate(wx),dy=streetCoordinate(wy),ax=Math.abs(dx),ay=Math.abs(dy),n=noise(Math.floor(wx/8),Math.floor(wy/8));
  const vertical=ax<90,horizontal=ay<86,road=vertical||horizontal,curb=ax<113||ay<109;
  if(road){
   R(x,y,4,4,n>.79?(night?'#414962':'#737f8b'):p.ground);
   if(ax<4&&ay>135&&Math.floor((wy+9600)/34)%2===0)R(x,y,2,4,night?'#cfb182':'#e9cf8d');
   if(ay<4&&ax>135&&Math.floor((wx+9600)/34)%2===0)R(x,y,4,2,night?'#cfb182':'#e9cf8d');
   // Zebra crossings stop at the sidewalk rather than blocking the intersection.
   if(vertical&&ay>61&&ay<101&&Math.floor((dx+92)/15)%2===0)R(x,y,4,4,night?'#bec1cf':'#e2e7dd');
   if(horizontal&&ax>65&&ax<105&&Math.floor((dy+90)/15)%2===0)R(x,y,4,4,night?'#bec1cf':'#e2e7dd');
   if(n>.965&&ax>25&&ay>24)R(x+1,y+2,2,1,night?'#8d779c':'#adbbc1');
   if(night&&ax<59&&ay<59&&Math.abs(dx-dy)<8&&Math.floor((dx+64)/15)%2===0)R(x,y,4,4,'#a6adc2');
  }else if(curb){
   R(x,y,4,4,(Math.floor(wx/16)+Math.floor(wy/16))%2?p.edge:p.stone);
   if((ax>90&&ax<98)||(ay>86&&ay<94))R(x,y,4,4,night?'#9e8cb5':'#e8ddad');
   if(Math.floor(wx/8)%4===0)R(x,y,1,4,night?'#626c87':'#a9b8b4');
  }else{
   R(x,y,4,4,(Math.floor(wx/32)+Math.floor(wy/32))%2?p.grass:(night?'#515a70':'#a6aeae'));
   if(wx%32===0||wy%32===0)R(x,y,4,1,night?'#434c62':'#899899');
   if(n>.95)R(x,y+2,3,1,night?'#786483':'#c3cec6');
  }
 }
 // Drain grates, tactile paving and manhole covers add human-scale street detail.
 for(let wy=Math.floor(oy/160)*160;wy<oy+512;wy+=160)for(let wx=Math.floor(ox/160)*160;wx<ox+512;wx+=160){
  const x=(wx-ox)/2,y=(wy-oy)/2,dx=Math.abs(streetCoordinate(wx)),dy=Math.abs(streetCoordinate(wy));
  if((dx<75||dy<72)&&noise(wx,wy)>.52){R(x-5,y-3,11,7,p.deep);R(x-4,y-2,9,5,night?'#58627b':'#8c9aa0');for(let j=0;j<3;j++)R(x-3+j*3,y-1,1,3,p.deep);}
  if((dx>111&&dx<138)||(dy>107&&dy<134)){R(x-3,y-3,7,7,night?'#827f96':'#c9bd87');R(x-2,y-2,1,1,p.stone);R(x+1,y+1,1,1,p.stone);}
 }
 // Reflections and faint curtain traces distinguish the cursed night district.
 if(night)for(let i=0;i<10;i++){
  const wx=ox+Math.floor(noise(cx+i,cy+8)*500),wy=oy+Math.floor(noise(cy+i,cx+2)*500),x=(wx-ox)/2,y=(wy-oy)/2;
  if(Math.abs(streetCoordinate(wx))<75||Math.abs(streetCoordinate(wy))<72){R(x,y,8+i%3*3,1,i%2?'#6b5987':'#596d94');R(x+2,y+3,5,1,'#4e5e7d');}
 }
 return true;
}
function glyphs(R,x,y,count,color,seed=0){
 for(let i=0;i<count;i++){const xx=x+i*6;R(xx,y,4,1,color);R(xx+1,y+1,1,5,color);R(xx,y+3,4,1,color);if((i+Math.floor(seed*9))%2)R(xx+3,y+1,1,5,color);else R(xx,y+5,4,1,color);}
}
export function drawTokyoProp(map,type,R,P,seed=0){
 const p=TOKYO_WORLD_PALETTES[map.id];if(!p)return false;const night=map.id==='shibuya',ink='#202d40';
 if(type==='gate'){
  // The station entrance has an open center and two collision-aligned pillars.
  for(const x of [-27,21]){R(x,-57,7,60,ink);R(x+1,-55,5,56,night?'#76849f':'#9eafb3');R(x+2,-53,2,50,p.stone);R(x-3,-2,13,5,p.deep);}
  R(-34,-65,69,13,ink);R(-32,-63,65,9,night?'#7a445f':'#477c83');R(-31,-63,63,2,night?'#c881a4':'#b5d9cb');glyphs(R,-24,-60,8,night?'#efdbd8':'#eef0d8',seed);
  R(-20,-30,41,32,night?'#1a253c':'#526573');for(let y=-24;y<2;y+=5){R(-17,y,35,2,night?'#63718e':'#b7c6c4');R(-17,y+2,35,1,night?'#35435e':'#7a929a');}
  for(const side of [-1,1]){const x=side<0?-21:18;R(x,-31,3,32,p.deep);R(x+1,-30,1,29,p.stone);}
  R(-12,-48,24,11,night?'#3a557d':'#3e6d86');R(-10,-46,7,7,'#d9e5df');P([[2,-45],[8,-45],[8,-43],[11,-43],[5,-39],[-1,-43],[2,-43]],'#e2e5dc');
  if(night){for(const x of [-35,33]){R(x,-85,3,31,'#454069');R(x+1,-84,1,29,'#9b82b3');}R(-35,-85,71,2,'#8b71a6');}
 }else if(type==='tree'){
  // City infrastructure replaces forest trees: lamps, traffic signals and signs.
  R(-5,-4,11,7,ink);R(-3,-75,7,74,p.trunk);R(-1,-74,2,71,p.stone);R(-18,-78,36,5,ink);R(-17,-77,34,2,p.edge);R(15,-77,3,12,p.trunk);
  R(-19,-76,18,8,ink);R(-17,-75,14,5,night?'#eee3a8':'#d7e9db');R(-16,-74,11,1,night?'#faf3c6':'#f1f3e8');
  R(12,-66,10,24,ink);R(14,-64,6,20,night?'#4f516d':'#647d82');for(const [yy,color]of [[-62,'#cf7885'],[-55,'#cfb66e'],[-48,'#83bf9e']]){R(15,yy,4,4,color);R(16,yy,2,1,'#e6d5c8');}
  R(-17,-54,17,21,night?'#63425e':'#467d91');R(-16,-53,15,2,night?'#d69cb3':'#aad3d5');glyphs(R,-14,-48,2,'#e8e1cb',seed);R(-14,-38,11,2,p.stone);
  if(night){R(6,-86,3,19,'#62528d');R(7,-85,1,17,'#a891c4');R(-7,-91,26,4,'#2a2a4b');R(-5,-90,22,1,'#80729f');}
 }else{
  // Convenience shops and building fronts are compact walk-around obstacles.
  const store=seed<.66,width=store?31:27,high=store?56:83;
  R(-width,-high,width*2+1,high+2,ink);R(-width+2,-high+2,width*2-3,high-2,night?'#434b66':'#a7b5b7');
  R(-width+2,-high+2,width*2-3,3,night?'#71809d':'#d7dfd5');R(width-3,-high+5,3,high-5,night?'#303b55':'#7a939e');
  if(store){
   R(-29,-49,59,11,night?'#8f4967':'#5b9d94');R(-28,-48,57,3,night?'#db92af':'#b4dbc9');glyphs(R,-23,-44,8,night?'#fae4d3':'#f5eed8',seed);
   for(const x of [-23,-8,7]){R(x,-35,13,21,ink);R(x+1,-34,11,19,night?'#6682a1':'#7bb1b9');R(x+2,-33,3,17,night?'#c2bcd2':'#daeee4');R(x+1,-24,11,1,p.stone);}
   R(21,-35,6,34,night?'#252a43':'#506e7b');R(22,-33,2,21,p.edge);R(-28,-11,47,9,night?'#6e536b':'#d6c9a3');R(-27,-10,45,2,p.stone);
   R(-33,-38,67,4,night?'#c4788e':'#e2d5ac');for(let i=0;i<8;i++)R(-31+i*8,-38,4,4,night?'#74445e':'#759e94');
  }else{
   for(let yy=-75;yy<-10;yy+=15)for(const xx of [-20,-4,12]){R(xx,yy,10,11,night?'#1b2942':'#547e91');R(xx+1,yy+1,7,8,night?(noise(xx+seed,yy)>.4?'#c0a7b6':'#6584a3'):'#a7d4d4');R(xx+2,yy+2,2,6,night?'#e2ceb7':'#e5eadb');R(xx,yy+12,10,2,night?'#71809a':'#d4d9c8');}
   R(-7,-13,14,15,night?'#20283f':'#55737f');R(-5,-12,3,12,p.stone);R(-1,-12,6,1,p.edge);
   R(27,-70,11,38,night?'#8d465f':'#d2a56d');R(28,-69,9,2,night?'#cf879d':'#eed3a3');for(let yy=-64;yy<-38;yy+=8)glyphs(R,30,yy,1,'#f1e4d5',seed);
  }
  R(-width-2,-1,width*2+5,4,p.deep);R(-width,-1,width*2+1,1,p.edge);
 }
 return true;
}
export function tokyoMapPreview(map){
 if(!TOKYO_WORLD_PALETTES[map.id])return null;const night=map.id==='shibuya',sky=night?'#20253f':'#a8cbd0',wall=night?'#505473':'#8ca4ae',glass=night?'#8ba1bd':'#d4e9df';
 let art=`<rect width="200" height="80" fill="${sky}"/>`;
 for(const [x,w,h]of [[0,27,42],[23,26,57],[48,21,47],[69,29,62],[105,25,54],[131,27,43],[158,23,60],[181,19,47]]){art+=`<path d="M${x} 57V${57-h}h${w}v${h}Z" fill="${wall}"/><path d="M${x+2} ${59-h}h${w-4}v3H${x+2}" fill="${night?'#73718f':'#c2d1cb'}"/>`;for(let y=62-h;y<51;y+=9)for(let xx=x+4;xx<x+w-3;xx+=7)art+=`<path d="M${xx} ${y}h4v5h-4Z" fill="${glass}"/>`;}
 art+=`<path d="M0 55h200v25H0Z" fill="${night?'#363c55':'#6d7c89'}"/><path d="M0 57h200v3H0Z" fill="${night?'#9691ac':'#d4d9c9'}"/>`;
 for(let i=0;i<7;i++)art+=`<path d="m${43+i*14} 63 8-2 14 19h-10Z" fill="${night?'#b8bccc':'#e7e9de'}"/>`;
 art+=`<path d="M6 60V34h19v26" fill="${night?'#99536f':'#ba685d'}"/><path d="M8 36h15v12H8Z" fill="${night?'#d1a1b6':'#d7e6dc'}"/><path d="M10 38h3v4h-3m5-4h3v4h-3m5-4h-3v4h3" fill="#6b89a0"/><path d="M8 51h13v2H8m2 4h8v2h-8" fill="#e2cc9f"/>`;
 art+=`<path d="M177 61V25h3v36m-13-34h26v4h-26" fill="${night?'#8b86a9':'#647d89'}"/><path d="M169 31h8v7h-8m13-7h8v7h-8" fill="${night?'#e5d0a0':'#e9eee0'}"/>`;
 if(night){art+=`<path d="M76 8h20v30H76Z" fill="#9c5474"/><path d="M79 11h2v9h-2m4-9h5v9h-5Zm1 2v5h3v-5Zm6-2h5v9h-2v-4h-3Zm1 1v3h3v-3Z" fill="#f0ccd6"/><path d="M79 24h14v2H79m0 4h14v4H79" fill="#e7b9c8"/><path d="M118 48V33h32v15" fill="#2b3f60"/><path d="M120 35h28v4h-28m0 3h28v2h-28" fill="#b8bdc7"/><path d="M0 6h200M0 13h200" stroke="#8270a9" stroke-width="2" opacity=".55"/><path d="m12 0 7 21-5 26m153-47-7 24 5 23" fill="none" stroke="#776597" stroke-width="2"/>`;}else{art+=`<path d="M30 46h43v12H30Z" fill="#5b9690"/><path d="M31 47h41v3H31M33 54h37v2H33" fill="#dbe6cd"/><path d="M98 54V43h28v11" fill="#e3d3ad"/><path d="m95 44 18-9 18 9" fill="#6b9295"/><path d="M0 3h200v2H0Z" fill="#d7e6d8"/>`;}
 return `<svg viewBox="0 0 200 80" shape-rendering="crispEdges" aria-hidden="true">${art}</svg>`;
}
