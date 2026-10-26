// Shared map identities and original pixel scenery. The arena stays traversable;
// distant void and skyline details are decoration, never an invisible boundary.
export const NEW_ANIME_MAPS=[
 {id:'leafvillage',name:'Hidden Leaf Village',subtitle:'Protect the streets beneath the Hokage monument.',tag:'NARUTO / KONOHA',color:'#e4bd82',ground:'#8b9473',dark:'#354a40',stone:'#c8b18a',water:'#527e88',foliage:'#7b9a69'},
 {id:'tournament',name:'Tournament of Power',subtitle:'Stand your ground beneath an endless cosmic sky.',tag:'DRAGON BALL / WORLD OF VOID',color:'#c7b6e5',ground:'#77758d',dark:'#24223c',stone:'#c3bacc',water:'#4f416d',foliage:'#adb2dc'},
 {id:'tempest',name:'Tempest Outskirts',subtitle:'A new nation rises among the ancient roots.',tag:'SLIME / JURA TEMPEST',color:'#a4d8c2',ground:'#50796c',dark:'#263f40',stone:'#adb69c',water:'#387e8b',foliage:'#82b89a'},
];
export const ANIME_WORLD_PALETTES={
 leafvillage:{ground:'#9e9a79',grass:'#82986c',deep:'#64775b',stone:'#d2bd94',edge:'#a99a7c',leaf:['#3e694e','#66905b','#8eb36b','#c9d18d'],trunk:'#78604d',water:'#527e88',ripple:'#a6c9be'},
 tournament:{ground:'#79778d',grass:'#8c879e',deep:'#4b4a65',stone:'#c6bfd1',edge:'#a29ab2',leaf:['#51486c','#777199','#a9a3c5','#dbd5e3'],trunk:'#77738b',water:'#3f3459',ripple:'#9c87bd'},
 tempest:{ground:'#527b6a',grass:'#648f70',deep:'#33594e',stone:'#a9b59a',edge:'#7c967c',leaf:['#2b5a50','#458a6a','#76b792','#c2d7a4'],trunk:'#715d4c',water:'#387e8b',ripple:'#9bd5c9'},
};
const noise=(x,y)=>{const n=Math.sin(x*127.1+y*311.7)*43758.5453;return n-Math.floor(n);};
export function drawAnimeTerrain(map,cx,cy,R,P){
 const p=ANIME_WORLD_PALETTES[map.id];if(!p)return false;const ox=cx*512,oy=cy*512;R(0,0,256,256,p.ground);
 for(let y=0;y<256;y+=16)for(let x=0;x<256;x+=16){const wx=ox+x*2,wy=oy+y*2,n=noise(wx,wy),road=Math.abs(wx+16)<48||Math.abs(wy+16)<46;
  if(map.id==='leafvillage'){
   R(x,y,16,16,n>.65?'#a7a27e':p.ground);for(let i=0;i<3;i++)R(x+2+Math.floor(noise(wx+i,wy)*11),y+3+Math.floor(noise(wy+i,wx)*10),2,1,n>.4?'#b9ae86':'#8a8e6b');
   if(road){R(x,y,16,16,p.edge);R(x+1,y+1,14,13,p.stone);R(x+2,y+2,11,1,'#e4d1a6');R(x+1,y+14,14,1,'#a48d70');if(n>.7){R(x+6,y+7,1,5,'#ad9679');R(x+7,y+7,4,1,'#ad9679');}}
   else if(n>.8){R(x+5,y+8,5,2,p.deep);R(x+6,y+5,1,5,p.grass);R(x+9,y+6,1,4,p.leaf[2]);}
   // Red clay edging recalls the village roofs without replacing the walkable road.
   if(Math.abs(((wx+400)%800+800)%800-400)<32&&Math.abs(wy)>110){R(x+1,y+2,14,2,'#b47758');R(x+2,y+4,12,1,'#d3a273');}
  }else if(map.id==='tournament'){
   const checker=(Math.floor(wx/64)+Math.floor(wy/64))%2;R(x,y,16,16,checker?p.ground:p.grass);if(wx%64===0){R(x,y,1,16,p.deep);R(x+1,y,1,16,'#a9a1b5');}if(wy%64===0){R(x,y,16,1,p.deep);R(x+2,y+1,14,1,p.stone);}
   if(n>.78){const k=Math.floor(n*5);P([[x+4,y+3],[x+6,y+6+k],[x+5,y+10],[x+10,y+13],[x+8,y+9],[x+9,y+6]],'#58566e');R(x+4,y+4,1,2,'#d1c6d5');}
   if(n>.86){R(x+2,y+10,5,2,'#514b6a');R(x+3,y+9,3,1,'#c9bbd2');}
   const ring=Math.abs((Math.hypot(wx+16,wy+16)%640)-300);if(ring<16){R(x+1,y+1,14,2,'#c8b99e');R(x+1,y+13,14,1,'#615c77');}
   if(road){R(x+1,y+1,14,14,'#9690a3');R(x+2,y+2,12,1,'#dcd1da');if(Math.abs(wx+16)<18)R(x+7,y+1,2,14,'#cfc1b0');}
  }else{
   if(n>.6)R(x,y,16,16,p.grass);for(let i=0;i<3;i++){const xx=x+2+Math.floor(noise(wx+i,wy)*11),yy=y+3+Math.floor(noise(wy+i,wx)*10);R(xx,yy,1,3,p.deep);R(xx+1,yy+1,1,2,p.leaf[2]);}
   if(road){R(x,y,16,16,'#7f8063');P([[x,y+3],[x+6,y],[x+15,y+2],[x+16,y+12],[x+9,y+16],[x+1,y+13]],'#acaa82');R(x+3,y+3,8,1,'#d7c99d');R(x+2,y+12,11,1,'#7b8566');}
   else if(n>.85){P([[x+5,y+8],[x+7,y+3],[x+9,y+9],[x+11,y+6],[x+12,y+12],[x+4,y+12]],'#729eac');R(x+7,y+5,1,6,'#b4e3d9');R(x+10,y+8,1,3,'#a4cfe1');}
  }
 }
 if(map.id!=='tournament')for(let y=0;y<256;y+=2){const wy=oy+y*2,stream=650+Math.sin(wy/400)*90,bridge=Math.abs(((wy%800)+800)%800-400)<38;for(let x=0;x<256;x+=2){const wx=ox+x*2,d=Math.abs(wx-stream);if(d>=105)continue;if(bridge){R(x,y,2,2,'#927b5d');if(Math.floor(wy/12)%2===0)R(x,y,2,1,'#5d594c');if(d>92)R(x,y,2,2,'#d3bc8d');}else{R(x,y,2,2,d>91?p.deep:p.water);if(d>85&&d<92)R(x,y,2,2,p.ripple);if(d<75&&noise(Math.floor(wx/20),Math.floor(wy/14))>.92)R(x,y,2,1,p.ripple);}}}
 if(cx>=-1&&cx<=0&&cy>=-1&&cy<=0){const x=-ox/2,y=-oy/2;if(map.id==='tournament'){P([[x,y-25],[x+25,y],[x,y+25],[x-25,y]],'#625b78');P([[x,y-21],[x+21,y],[x,y+21],[x-21,y]],'#baa9c2');R(x-2,y-14,4,28,'#ece0d5');R(x-14,y-2,28,4,'#ece0d5');}else{P([[x,y-16],[x+16,y],[x,y+16],[x-16,y]],p.edge);R(x-3,y-3,6,6,p.stone);}}
 return true;
}
export function drawAnimeProp(map,type,R,P,seed=0){
 const p=ANIME_WORLD_PALETTES[map.id];if(!p)return false;
 if(map.id==='leafvillage'){
  if(type==='gate'){R(-28,-62,7,64,'#6b5145');R(21,-62,7,64,'#6b5145');R(-26,-61,3,61,'#bd8a5c');R(23,-61,3,61,'#bd8a5c');P([[-36,-65],[-27,-72],[28,-72],[36,-65],[28,-61],[-29,-61]],'#42644d');R(-28,-68,56,3,'#85a06a');R(-29,-45,58,5,'#a77854');R(-11,-59,23,16,'#d1c79a');P([[-5,-53],[-2,-57],[5,-57],[7,-53],[4,-49],[-2,-49],[-4,-52],[0,-54],[3,-52]],'#566a4f');}
  else if(type==='rock'&&seed>.78){P([[-33,2],[-35,-39],[-29,-62],[-9,-70],[21,-65],[34,-44],[32,2]],'#8b846e');P([[-31,0],[-31,-38],[-25,-57],[-8,-65],[18,-60],[30,-42],[28,0]],'#b7aa85');R(-28,-49,53,2,'#d4c49a');for(const [xx,yy]of [[-22,-40],[-5,-46],[13,-38]]){P([[xx-7,yy-10],[xx-3,yy-15],[xx+5,yy-14],[xx+8,yy-7],[xx+6,yy+7],[xx,yy+12],[xx-6,yy+7]],'#d6c79f');P([[xx-8,yy-8],[xx-7,yy-13],[xx-1,yy-17],[xx+6,yy-14],[xx+9,yy-8],[xx+3,yy-10],[xx-1,yy-6]],'#8c866d');R(xx-4,yy,3,1,'#77765f');R(xx+2,yy,3,1,'#77765f');R(xx,yy+3,2,3,'#b2a680');R(xx-2,yy+8,5,1,'#a59674');}R(-22,-6,40,3,'#c3b88f');}
  else if(type==='rock'){R(-22,-35,44,36,'#d4bd92');R(-21,-34,42,4,'#a88665');P([[-28,-34],[-24,-39],[-18,-49],[0,-57],[18,-49],[25,-39],[29,-34]],'#5c6154');P([[-24,-36],[-19,-46],[0,-53],[18,-46],[24,-36]],'#b87858');for(let yy=-47;yy<-35;yy+=4)R(-16-(yy+47)*.5,yy,32+(yy+47),1,'#d5a17a');R(-25,-35,50,3,'#655648');R(-5,-21,12,22,'#7f735b');R(-3,-20,2,19,'#b9ac88');for(const xx of [-16,10]){R(xx,-24,7,10,'#5a7c78');R(xx,-20,7,1,'#d2cdaa');}R(-15,-32,25,5,'#e7d4a5');R(-13,-31,6,3,'#6f654e');R(-4,-31,10,3,'#b67b60');}
  else{R(-3,-53,6,55,p.trunk);P([[-24,-49],[-19,-67],[-8,-76],[9,-75],[24,-61],[25,-47],[12,-38],[-8,-38]],p.leaf[0]);P([[-21,-50],[-16,-65],[-6,-72],[10,-70],[21,-59],[20,-48],[7,-41],[-7,-43]],p.leaf[1]);P([[-13,-64],[-3,-70],[11,-66],[16,-58],[5,-55],[-11,-57]],p.leaf[2]);R(-12,-61,7,2,p.leaf[3]);R(9,-47,7,2,p.leaf[2]);}
 }else if(map.id==='tournament'){
  if(type==='gate'){for(const xx of [-26,21]){R(xx,-58,7,60,p.deep);R(xx+1,-55,5,53,p.edge);R(xx+2,-53,2,48,p.stone);R(xx-3,-4,13,5,p.edge);}P([[-31,-59],[-26,-69],[-12,-72],[-5,-63],[6,-69],[20,-72],[31,-61],[25,-55],[12,-61],[5,-57],[-8,-60],[-20,-61]],p.stone);R(-23,-67,14,3,'#dad0db');}
  else if(type==='tree'){R(-12,-5,25,7,p.deep);R(-9,-66,18,61,p.edge);R(-6,-63,5,57,p.stone);R(5,-63,3,57,p.deep);P([[-12,-66],[-9,-72],[-4,-68],[2,-75],[7,-68],[12,-70],[12,-63]],p.stone);R(-14,-9,29,4,p.stone);R(-8,-48,17,2,p.deep);R(-8,-47,9,1,'#d8cdda');R(-7,-31,8,2,'#5b5672');}
  else{P([[-22,1],[-23,-14],[-14,-31],[-3,-35],[9,-30],[23,-12],[20,2]],p.deep);P([[-19,-1],[-19,-13],[-11,-28],[-2,-31],[8,-27],[19,-11],[16,0]],p.edge);P([[-17,-14],[-10,-27],[-2,-30],[7,-26],[12,-18],[1,-15]],p.stone);P([[0,-16],[5,-10],[2,-2],[-3,-5],[-1,-10]],p.deep);R(-15,-7,8,2,'#bbaec3');}
 }else{
  if(type==='gate'){for(const xx of [-25,22]){R(xx-3,-60,7,62,'#4a5146');R(xx-2,-59,5,59,p.trunk);R(xx-5,-8,12,3,'#b2aa81');}P([[-33,-62],[-22,-75],[0,-80],[23,-74],[33,-62],[25,-56],[11,-65],[-10,-66],[-24,-56]],'#385f4c');P([[-29,-63],[-19,-72],[0,-76],[20,-70],[28,-62],[10,-63],[-11,-64]],'#83ad83');R(-10,-61,21,16,'#c2c6a0');P([[-6,-53],[-2,-58],[3,-58],[7,-53],[4,-49],[-3,-49]],'#66a3b3');R(-2,-55,1,2,'#e0e5c5');R(2,-55,1,2,'#e0e5c5');}
  else if(type==='rock'){R(-22,-30,44,31,'#9c9573');P([[-27,-29],[-18,-49],[0,-57],[19,-48],[28,-29]],'#456d58');P([[-23,-30],[-16,-46],[0,-53],[16,-45],[24,-30]],'#9d8c61');for(let yy=-44;yy<-29;yy+=4)R(-17,yy,34,2,'#c1ad7b');R(-23,-30,46,3,'#4b5747');R(-6,-20,13,21,'#50645b');R(-19,-21,8,8,'#b1d0ba');R(12,-21,7,8,'#b1d0ba');R(-20,-6,40,3,'#6a7456');R(-21,-29,4,30,'#6d6d51');R(18,-29,4,30,'#6d6d51');}
  else{R(-4,-56,8,58,p.trunk);P([[-25,-49],[-24,-64],[-12,-77],[6,-81],[24,-67],[28,-50],[18,-39],[-12,-39]],p.leaf[0]);P([[-22,-51],[-20,-63],[-10,-73],[7,-76],[21,-65],[23,-51],[13,-43],[-9,-44]],p.leaf[1]);P([[-14,-63],[-7,-72],[7,-73],[18,-64],[12,-56],[-7,-55]],p.leaf[2]);R(-9,-66,8,2,p.leaf[3]);R(7,-48,9,2,p.leaf[2]);R(-2,-43,2,38,'#9b8b62');for(const [xx,yy]of [[-12,-22],[9,-14]]){P([[xx-4,yy],[xx,yy-8],[xx+4,yy]],'#8dc6bb');R(xx,yy-5,1,5,'#d7e8bc');}}
 }
 return true;
}
export function animeMapPreview(map){
 if(!ANIME_WORLD_PALETTES[map.id])return null;
 if(map.id==='leafvillage')return `<svg viewBox="0 0 200 80" shape-rendering="crispEdges" aria-hidden="true"><rect width="200" height="80" fill="#a8bc9d"/><path d="M0 38V10l25-4 24 8 20-9 24 11 23-7 27 8 23-8 34 9v20" fill="#b9af88"/><path d="M0 35h200v45H0" fill="#a39b77"/><path d="M84 80V38h30v42" fill="#d4c197"/>${[9,39,137,169].map(x=>`<path d="M${x} 64V42h23v22" fill="#dfc99d"/><path d="m${x-5} 43 17-17 17 17" fill="#af7655"/><path d="M${x+5} 49h5v8h-5m10-8h5v8h-5" fill="#5f7b70"/>`).join('')}<path d="M73 57V22h5v35m45 0V22h5v35M68 18h65v7H68" fill="#6d654c"/><path d="M84 24h31v13H84" fill="#d2c89c"/><path d="m93 31 4-4h7l3 4-3 3h-6l-2-2 4-2" fill="none" stroke="#546e51" stroke-width="2"/><path d="M0 73h200v7H0" fill="#82986c"/></svg>`;
 if(map.id==='tournament')return `<svg viewBox="0 0 200 80" shape-rendering="crispEdges" aria-hidden="true"><rect width="200" height="80" fill="#29243f"/>${[9,25,41,67,116,144,175,190].map((x,i)=>`<path d="M${x} ${8+i%3*7}h2v2h-2" fill="#c1add6"/>`).join('')}<path d="m9 63 43-24h97l43 24-31 15H38" fill="#5e536e"/><path d="m13 60 40-25h94l40 25-29 13H42" fill="#a9a0b1"/><path d="M44 47h114M31 55h140M47 65h107M69 39l-7 31m68-31 8 31" stroke="#766b86" stroke-width="2"/><path d="m98 40-8 11 10 4-7 14m33-25-8 7 4 7" fill="none" stroke="#675b76" stroke-width="2"/><path d="M24 42V12h9v30m134 0V17h9v25" fill="#aba1b8"/><path d="M25 15h3v25m140-20h3v20" stroke="#e1d6dd" stroke-width="2"/><path d="m22 12 4-7 4 4 6-2-3 7m132 3 4-7 8 7" fill="#c8b9cd"/></svg>`;
 return `<svg viewBox="0 0 200 80" shape-rendering="crispEdges" aria-hidden="true"><rect width="200" height="80" fill="#315c50"/><path d="M0 53h200v27H0" fill="#56816b"/><path d="m78 80 11-34h21l16 34" fill="#b0b291"/>${[7,32,153,182].map((x,i)=>`<path d="M${x} 64V21h6v43" fill="#705f4c"/><path d="m${x-15} 36 5-22 15-8 17 10 4 25-18 5-18-3" fill="${i%2?'#76b792':'#458a6a'}"/><path d="M${x-5} 17h17v3h-17" fill="#c2d7a4"/>`).join('')}<path d="M52 66V44h25v22m48 0V44h25v22" fill="#a59c78"/><path d="m46 45 19-19 18 19m37 0 18-20 18 20" fill="#8f9568"/><path d="M58 52h5v8h-5m73-8h5v8h-5" fill="#bad6be"/><path d="m14 72 6-14 6 14m140 1 5-17 7 17" fill="#8bcac9"/><path d="M20 63v8m151-9v9" stroke="#d9ebcb" stroke-width="2"/></svg>`;
}
