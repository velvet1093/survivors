const TAU=Math.PI*2;
export const RIFT_ARENAS={
 foundereren:{id:'paths',name:'The Paths · Rumbling Horizon',radius:760,dark:'#191d28',floor:'#414047',line:'#c5b99b',accent:'#e2c8a6'},
 beerus:{id:'destroyer',name:'God of Destruction’s Sanctuary',radius:760,dark:'#11132a',floor:'#33334d',line:'#8d81b4',accent:'#c7a6ed'},
 walpurgisrift:{id:'witchstage',name:'Walpurgisnacht · Last Stage',radius:760,dark:'#191424',floor:'#433348',line:'#8c657f',accent:'#e5a5c6'},
 aizenrift:{id:'illusionpalace',name:'Hōgyoku · Palace of Broken Reflections',radius:760,dark:'#191629',floor:'#3e3b50',line:'#c2add2',accent:'#dec1eb'},
 madararift:{id:'godtree',name:'Divine Tree · Moonfall Battlefield',radius:760,dark:'#181d2a',floor:'#3c4246',line:'#8c9c9d',accent:'#d5b0c6'},
 sukunaheian:{id:'malevolentcourt',name:'Malevolent Shrine · Forsaken Court',radius:760,dark:'#211922',floor:'#413c43',line:'#b19589',accent:'#deac9e'},
 borosrift:{id:'starship',name:'Dark Matter · Shattered Starship',radius:760,dark:'#121b2b',floor:'#353e4d',line:'#869da9',accent:'#d7b0e2'},
 darknessdevil:{id:'primordialnight',name:'Hell · The Primordial Night',radius:760,dark:'#10131e',floor:'#35383c',line:'#a9ab9e',accent:'#d7d2ba'},
 deathdevil:{id:'lastsilence',name:'Hell · The Last Silence',radius:800,dark:'#15151e',floor:'#32323a',line:'#d7d4ca',accent:'#ece6d5'},
};
export function createRiftArena(bossId,time=0){const def=RIFT_ARENAS[bossId];return def?{...def,bossId,enteredAt:time,version:1}:null;}
export function restoreRiftArena(g){
 const active=g.rifts?.active,raw=g.riftArena;
 if(!active){g.riftArena=null;return null;}
 const def=createRiftArena(active.bossId,g.time);if(!def)return null;
 g.riftArena={...def,...(raw?.bossId===active.bossId?raw:{})};
 return g.riftArena;
}
const hash=(x,y)=>{const n=Math.sin(x*127.1+y*311.7)*43758.5453;return n-Math.floor(n);};
function path(c,points,color,width=1){c.strokeStyle=color;c.lineWidth=width;c.beginPath();points.forEach(([x,y],i)=>i?c.lineTo(x,y):c.moveTo(x,y));c.stroke();}
function ellipse(c,x,y,rx,ry,color,stroke=false){c.beginPath();c.ellipse(x,y,rx,ry,0,0,TAU);if(stroke){c.strokeStyle=color;c.stroke();}else{c.fillStyle=color;c.fill();}}
function gear(c,x,y,r,color,turn=0){c.strokeStyle=color;c.lineWidth=2;c.beginPath();for(let i=0;i<48;i++){const a=i*TAU/48+turn,rr=r*(i%4<2?1:.9),px=x+Math.cos(a)*rr,py=y+Math.sin(a)*rr;i?c.lineTo(px,py):c.moveTo(px,py);}c.closePath();c.stroke();ellipse(c,x,y,r*.72,r*.72,color,true);for(let i=0;i<8;i++){const a=i*TAU/8+turn;path(c,[[x+Math.cos(a)*r*.2,y+Math.sin(a)*r*.2],[x+Math.cos(a)*r*.7,y+Math.sin(a)*r*.7]],color,2);}}
function deathField(c,r,time,reducedMotion){
 // The Last Silence is an empty ash plain beneath a hanging city. All large
 // scenery stays at the rim; none is a building collider or a damage warning.
 for(let x=-r+20;x<r-20;x+=64)for(let y=-r+20;y<r-20;y+=64){
  const n=hash(x,y),xx=x+n*24,yy=y+hash(y,x)*22;
  c.fillStyle=n>.5?'#d4d3c10b':'#12141e28';c.fillRect(xx,yy,20+n*18,2);
  if(n>.54){
   path(c,[[xx-5,yy+7],[xx-2,yy-3],[xx,yy+4],[xx+4,yy-6]],'#a2a69426');
   if(n>.78){
    path(c,[[xx+10,yy+8],[xx+12,yy-3]],'#a9ad9536');
    ellipse(c,xx+12,yy-5,4,2,'#dad8c33c');ellipse(c,xx+12,yy-5,1.3,1.3,'#ece8ce46');
   }
  }
 }
 // A worn, incomplete bone spiral is an inlay in the ground. The wide breaks
 // and low contrast cannot be confused with the boss's bright attack marks.
 for(let turn=0;turn<3;turn++)for(let i=0;i<8;i++){
  const a=i*TAU/8+turn*.17,rr=170+turn*170,points=[];
  for(let k=0;k<=7;k++){const t=k/7,angle=a+t*.39,rad=rr+t*34;points.push([Math.cos(angle)*rad,Math.sin(angle)*rad*.86]);}
  path(c,points,'#bebdaf1c',2);
  const xx=points[3][0],yy=points[3][1];path(c,[[xx-3,yy-4],[xx+3,yy+4]],'#d6d2ba12');
 }
 // The inverted skyline hangs from a single northern cornice beyond the edge.
 // Its repeated row is architectural, rather than randomly scattered blocks.
 const ceiling=-r-118;
 c.fillStyle='#22232b';c.fillRect(-r-90,ceiling-22,r*2+180,29);
 path(c,[[-r-90,ceiling+7],[r+90,ceiling+7]],'#8c8b823b',3);
 for(let i=0;i<13;i++){
  const x=-r+30+i*(r*2-60)/12,height=65+(i*37%90),width=54+(i%3)*8;
  c.fillStyle=i%2?'#25262f':'#292a32';c.fillRect(x-width/2,ceiling,width,height);
  path(c,[[x-width/2,ceiling+5],[x-width/2,ceiling+height],[x+width/2,ceiling+height]],'#a5a39624',2);
  for(let row=0;row<4;row++)for(const side of [-1,1]){c.fillStyle='#b4b1a519';c.fillRect(x+side*13-3,ceiling+14+row*22,6,10);}
  if(i%3===1)path(c,[[x-14,ceiling+height],[x,ceiling+height+22],[x+14,ceiling+height]],'#bdb7a329',2);
 }
 // Four broken white curtain pillars frame the plain, leaving its middle open.
 for(const side of [-1,1])for(const row of [-1,1]){
  const x=side*(r-73),y=row*(r-175),bend=reducedMotion?0:Math.sin(time*.4+side+row)*3;
  c.fillStyle='#20232c';c.fillRect(x-31,y-80,62,175);
  path(c,[[x-32,y-76],[x-18,y-94],[x+23,y-91],[x+34,y-73]],'#bfbdaa',7);
  path(c,[[x-24,y-77],[x-25+bend,y-15],[x-31,y+68],[x-14,y+56],[x-5,y+79],[x+7,y+51],[x+18,y+74],[x+28,y+58],[x+23+bend,y-20],[x+24,y-78]],'#b9b9ad99',10);
  for(const offset of [-16,-5,8,18])path(c,[[x+offset,y-71],[x+offset+bend,y-11],[x+offset-3,y+48]],'#e3dfc065',2);
  path(c,[[x-27,y+89],[x-37,y+104],[x+34,y+104],[x+26,y+88]],'#8f93844f',5);
  path(c,[[x+side*36,y-55],[x+side*53,y-21],[x+side*48,y+28]],'#c7c5af2e',3);
 }
 // Pale fragments sit along the southern boundary, rather than across a lane.
 for(let i=0;i<9;i++){
  const x=-r+100+i*(r*2-200)/8,y=r-27;
  path(c,[[x-19,y],[x-8,y-10],[x+5,y-5],[x+19,y-12]],'#c3beab39',3);
  path(c,[[x-7,y-7],[x-4,y+3],[x+2,y-1]],'#dfd8bd28',2);
 }
 if(!reducedMotion)for(let i=0;i<18;i++){
  const x=-r+hash(i,17)*r*2,y=-r+(hash(i,23)*r*2+time*(1+i%3))%(r*2);
  c.fillStyle='#dbd6c51e';c.fillRect(x,y,1+i%2,2);
 }
}
export function drawRiftArena(c,g,left,top,w,h,reducedMotion=false){
 const arena=g.riftArena;if(!arena)return false;const def=RIFT_ARENAS[arena.bossId]||arena,r=arena.radius||760,time=reducedMotion?0:g.time;
 c.save();c.fillStyle=def.dark;c.fillRect(left,top,w,h);
 // Outside the bounded encounter platform, only the world beyond remains.
 if(arena.bossId!=='deathdevil')for(let x=Math.floor(left/70);x<Math.ceil((left+w)/70);x++)for(let y=Math.floor(top/70);y<Math.ceil((top+h)/70);y++){
  const n=hash(x,y);if(n>.75){c.fillStyle=n>.9?'#d9cee955':'#a6a0d62c';c.fillRect(x*70+Math.floor(n*45),y*70+Math.floor(hash(y,x)*40),n>.9?2:1,n>.9?2:1);}
 }
 c.fillStyle=def.floor;c.fillRect(-r,-r,r*2,r*2);
 if(arena.bossId==='deathdevil'){
  deathField(c,r,time,reducedMotion);
 }else if(arena.bossId==='foundereren'){
  // Dry sand, luminous Paths and colossal rib columns replace every trace of
  // the originating map. Their cool shadows keep attack warnings readable.
  for(let x=Math.max(-r,Math.floor(left/48)*48);x<Math.min(r,left+w);x+=48)for(let y=Math.max(-r,Math.floor(top/48)*48);y<Math.min(r,top+h);y+=48){const n=hash(x,y);c.fillStyle=n>.5?'#77716a26':'#252c3429';c.fillRect(x+n*20,y+hash(y,x)*20,16+n*13,2);}
  for(let i=0;i<11;i++){const a=i*2.399;path(c,[[0,-r*.7],[Math.cos(a)*r*.3,-r*.25],[Math.cos(a)*r*.7,Math.sin(a)*r*.6],[Math.cos(a)*r,Math.sin(a)*r]],'#c6c0aa2c',3);}
  for(const side of [-1,1])for(let i=0;i<6;i++){
   const x=side*(r-55),y=-r+80+i*245;
   path(c,[[x,y+150],[x-side*24,y+65],[x-side*20,y-10],[x-side*65,y-55]],'#232b36',14);
   path(c,[[x-3,y+150],[x-side*24-3,y+65],[x-side*20-3,y-10],[x-side*65-3,y-55]],'#bbb093',7);
  }
  for(let i=0;i<7;i++){const y=-r+24+i*5;c.fillStyle=i%2?'#aaa18a':'#6c6b65';c.fillRect(-r+25,y,r*2-50,3);}
  // The tree of light is environmental art, far beyond the fighting center.
  path(c,[[0,-r+180],[0,-r+60],[-30,-r+5]],'#d9d9b74a',6);
  for(let i=-3;i<=3;i++)path(c,[[0,-r+120],[i*35,-r+60],[i*80,-r+10]],'#d2d7bb52',3);
 }else if(arena.bossId==='beerus'){
  // A floating temple in a starfield, inlaid with the destroyer’s diamonds.
  for(let x=-r;x<r;x+=96)for(let y=-r;y<r;y+=64){const offset=(Math.floor(y/64)%2)*48;path(c,[[x+offset,y],[x+offset+46,y-28],[x+offset+92,y],[x+offset+46,y+28],[x+offset,y]],'#9d95ba1d');}
  for(const rr of [180,340,560]){c.lineWidth=2;ellipse(c,0,0,rr,rr*.72,'#b3a1cc29',true);}
  for(let i=0;i<8;i++){const a=i*TAU/8,x=Math.cos(a)*560,y=Math.sin(a)*560;path(c,[[x,y-24],[x+15,y],[x,y+24],[x-15,y],[x,y-24]],'#d4c29365',3);}
  for(const side of [-1,1])for(let i=0;i<5;i++){const x=side*(r-38),y=-r+80+i*320;c.fillStyle='#24223c';c.fillRect(x-24,y-50,48,115);c.fillStyle='#776a97';c.fillRect(x-18,y-45,36,105);c.fillStyle='#bcaa82';c.fillRect(x-25,y-50,50,9);c.fillRect(x-25,y+55,50,10);c.fillStyle='#cbbd9a';c.fillRect(x-8,y-30,4,65);}
  c.lineWidth=3;ellipse(c,0,-r*.8,70,24,'#c3a3e66a',true);
 }else if(arena.bossId==='aizenrift'){
  // A ruined Soul Society courtyard floats inside a fractured illusion. The
  // monochrome stone keeps all violet attack seals distinct from the floor.
  for(let x=-r;x<r;x+=96)for(let y=-r;y<r;y+=72){
   const n=hash(x,y),offset=(Math.floor(y/72)%2)*48;
   c.fillStyle=n>.5?'#9690a915':'#171a2d24';c.fillRect(x+offset+2,y+2,92,68);
   if(n>.72)path(c,[[x+offset+19,y+8],[x+offset+39,y+32],[x+offset+33,y+61]],'#b1a4c125');
  }
  for(const side of [-1,1])for(let i=0;i<5;i++){
   const x=side*(r-65),y=-r+105+i*310;
   c.fillStyle='#24263a';c.fillRect(x-25,y-70,50,135);c.fillStyle='#777188';c.fillRect(x-19,y-65,35,122);
   c.fillStyle='#b6a6c0';c.fillRect(x-27,y-72,52,9);c.fillRect(x-29,y+56,56,13);
   path(c,[[x-14,y-60],[x+1,y-30],[x-5,y+7],[x+11,y+39]],'#373347',3);
   // Broken mirror shards live near the rim, rather than forming false hazards.
   path(c,[[x-side*55,y-25],[x-side*84,y-66],[x-side*108,y+8],[x-side*72,y+36],[x-side*55,y-25]],'#a990c04c',2);
   path(c,[[x-side*61,y-22],[x-side*82,y-50]],'#e8d4ec42',2);
  }
  for(let i=-2;i<=2;i++){
   const x=i*150,y=-r+12;c.fillStyle='#28273d';c.fillRect(x-6,y,12,145);c.fillStyle='#ae9bb86b';c.fillRect(x-3,y+5,3,125);
  }
  path(c,[[-350,-r+35],[-350,-r+8],[350,-r+8],[350,-r+35]],'#a68fb064',8);
  path(c,[[-300,-r+60],[300,-r+60]],'#70617c',5);
  // Concentric diamond inlays break apart instead of joining into a magic seal.
  for(const d of [170,320,480])for(const side of [-1,1])path(c,[[side*24,-d+24],[side*(d-24),0],[side*24,d-24]],'#baabc324',2);
 }else if(arena.bossId==='madararift'){
  // Pale crater stone and living roots surround the moonlit Divine Tree field.
  for(let x=-r;x<r;x+=64)for(let y=-r;y<r;y+=64){const n=hash(x,y);c.fillStyle=n>.6?'#a4b3ad17':'#202b3424';c.fillRect(x+n*20,y+hash(y,x)*20,14+n*19,3);}
  for(const rr of [210,410,590]){
   for(let i=0;i<9;i++){const a=i*TAU/9+.15;path(c,[[Math.cos(a)*rr,Math.sin(a)*rr],[Math.cos(a+.15)*(rr+22),Math.sin(a+.15)*(rr+22)],[Math.cos(a+.3)*(rr+13),Math.sin(a+.3)*(rr+13)]],'#abb5ac20',2);}
  }
  const root='#26373d',highlight='#7a8a7d';
  for(const side of [-1,1])for(let i=0;i<5;i++){
   const y=-r+30+i*340,x=side*(r+15);
   path(c,[[x,y],[x-side*65,y+40],[x-side*80,y+120],[x-side*145,y+155]],root,20);
   path(c,[[x,y],[x-side*65,y+40],[x-side*80,y+120],[x-side*145,y+155]],highlight,5);
   path(c,[[x-side*70,y+70],[x-side*130,y+72],[x-side*178,y+110]],'#5b706849',4);
  }
  // The immense tree is beyond the north boundary; only its roots enter the
  // rim. No decorative trunk blocks movement or hides combat in the center.
  path(c,[[0,-r+12],[-24,-r-145],[-5,-r-290]],'#26323d',65);
  path(c,[[-9,-r+10],[-30,-r-150],[-13,-r-285]],'#798b7b',9);
  for(let i=-3;i<=3;i++)if(i)path(c,[[0,-r-160],[i*44,-r-230],[i*85,-r-240-Math.abs(i)*23]],'#52645d',10);
  for(let i=-3;i<=3;i++)path(c,[[0,-r+5],[i*30,-r+58],[i*74,-r+80]],'#8c9b7b32',5);
  ellipse(c,r*.65,-r-95,67,67,'#b38d9c36');ellipse(c,r*.65+15,-r-107,57,57,def.dark);
 }else if(arena.bossId==='sukunaheian'){
  // The domain opens over a deserted stone court. The haunted temple and its
  // broken torii stay at the rim, leaving damage warnings clear in the center.
  for(let y=-r;y<r;y+=70)for(let x=-r;x<r;x+=110){const shift=(Math.floor(y/70)%2)*55,n=hash(x,y);c.fillStyle=n>.55?'#b49a8612':'#1e1f3027';c.fillRect(x+shift+2,y+2,106,66);if(n>.76)path(c,[[x+shift+12,y+8],[x+shift+43,y+22],[x+shift+39,y+48],[x+shift+67,y+63]],'#221e2e50',2);}
  for(const side of [-1,1])for(let i=0;i<5;i++){
   const x=side*(r-45),y=-r+130+i*300;
   path(c,[[x,y+55],[x-side*12,y-35],[x-side*9,y-75]],'#211e2d',14);
   path(c,[[x-3,y+55],[x-side*12-3,y-35],[x-side*9-3,y-75]],'#8c7774',5);
   path(c,[[x-side*52,y-57],[x+side*23,y-69]],'#746768',12);path(c,[[x-side*48,y-62],[x+side*26,y-75]],'#b09580',3);
   // Small bleached jaws along the perimeter belong to the shrine scenery.
   const xx=x-side*42;c.fillStyle='#8d827d';c.fillRect(xx-11,y+22,22,18);c.fillStyle='#27232d';c.fillRect(xx-7,y+27,5,5);c.fillRect(xx+3,y+27,5,5);path(c,[[xx-8,y+38],[xx-5,y+44],[xx+5,y+44],[xx+9,y+37]],'#b2a08d',3);
  }
  const y=-r+24;
  c.fillStyle='#24222d';c.fillRect(-260,y,520,125);c.fillStyle='#6d5c60';c.fillRect(-238,y+22,476,91);
  c.fillStyle='#35303a';c.fillRect(-208,y+36,416,74);c.fillStyle='#1d1b28';c.fillRect(-99,y+35,198,93);
  path(c,[[-295,y+10],[-215,y-43],[215,y-43],[295,y+10]],'#51464e',19);path(c,[[-300,y+2],[-218,y-48],[218,y-48],[300,y+2]],'#a28b7b',5);
  for(const x of [-240,-120,120,240]){c.fillStyle='#8d7975';c.fillRect(x-8,y+20,16,105);c.fillStyle='#b6a08b';c.fillRect(x-8,y+20,4,105);}
  // A wide tooth-lined arch hints at Malevolent Shrine without closing a path.
  path(c,[[-92,y+99],[-95,y+55],[-62,y+25],[0,y+14],[62,y+25],[95,y+55],[92,y+99]],'#9b817a',8);
  for(let x=-68;x<80;x+=23){c.fillStyle='#beaa95';c.fillRect(x,y+34,9,15);c.fillRect(x,y+91,9,13);}
  for(let i=0;i<6;i++)path(c,[[-r+120+i*220,r-35],[-r+150+i*220,r-56],[-r+175+i*220,r-40]],'#b6a08a28',3);
 }else if(arena.bossId==='darknessdevil'){
  // A silent, moonless clearing. Pale suits stand along the perimeter; the
  // central dark stone remains open and keeps every real danger mark legible.
  for(let x=-r;x<r;x+=80)for(let y=-r;y<r;y+=80){const n=hash(x,y);c.fillStyle=n>.5?'#9fa3a010':'#11172329';c.fillRect(x+n*17,y+hash(y,x)*17,18+n*25,3);if(n>.8)path(c,[[x+7,y+12],[x+28,y+19],[x+25,y+43]],'#bab8a51a',1);}
  for(const side of [-1,1])for(let i=0;i<6;i++){
   const x=side*(r-67),y=-r+115+i*245;
   // Bowed helmets and articulated suit joints suggest the impossible procession.
   ellipse(c,x,y-63,18,20,'#262c33');ellipse(c,x,y-64,13,15,'#b3b4a2');ellipse(c,x+side*3,y-65,8,9,'#313b42');
   path(c,[[x,y-43],[x+side*9,y-13],[x,y+13]],'#b7b9aa',14);path(c,[[x-2,y-42],[x+side*7,y-13],[x-2,y+11]],'#e1d9bf',3);
   for(const s of [-1,1]){path(c,[[x+s*5,y+7],[x+s*18,y+28],[x+s*22,y+43]],'#7e8883',7);path(c,[[x+s*5,y-35],[x+s*23,y-16],[x+s*13,y+3]],'#9ca79d',6);ellipse(c,x+s*22,y+47,10,4,'#b0b4a4');}
   path(c,[[x-10,y-24],[x+11,y-22]],'#2f3c42',3);
  }
  for(let i=-3;i<=3;i++){
   const x=i*130,y=-r+15;c.fillStyle='#242b32';c.fillRect(x-8,y-40,16,95);c.fillStyle='#adb1a24a';c.fillRect(x-4,y-34,3,77);path(c,[[x-24,y+14],[x,y-4],[x+24,y+14]],'#9fa99d42',2);
  }
  for(const rr of [230,430,620])for(let i=0;i<7;i++){const a=i*TAU/7+.2;path(c,[[Math.cos(a)*rr,Math.sin(a)*rr],[Math.cos(a+.13)*(rr+14),Math.sin(a+.13)*(rr+14)]],'#b4b5a31a',2);}
  // The sky never flashes: only low-contrast, saved-clock drifting ash moves.
  if(!reducedMotion)for(let i=0;i<22;i++){const x=-r+hash(i,5)*r*2,y=-r+(hash(i,9)*r*2+time*(2+i%3))%(r*2);c.fillStyle='#c0c0aa20';c.fillRect(x,y,2,3);}
 }else if(arena.bossId==='borosrift'){
  // Broken alien deck plating opens onto a cold starfield. Cables, vents and
  // reactor strips mark the edges; pale energy shots remain clearly separate.
  for(let y=-r;y<r;y+=80)for(let x=-r;x<r;x+=128){const n=hash(x,y);c.fillStyle=n>.5?'#9dabc615':'#1722342d';c.fillRect(x+3,y+3,122,74);path(c,[[x+8,y+10],[x+111,y+10],[x+120,y+18],[x+120,y+62]],'#8292a622');if(n>.65){c.fillStyle='#151e2f';c.fillRect(x+16,y+54,63,8);for(let k=0;k<5;k++){c.fillStyle='#536d7d';c.fillRect(x+20+k*11,y+56,4,3);}}}
  for(const rr of [200,400,590]){
   for(let i=0;i<8;i++){const a=i*TAU/8+Math.PI/8,b=a+.24;path(c,[[Math.cos(a)*rr,Math.sin(a)*rr],[Math.cos(b)*rr,Math.sin(b)*rr]],'#91a4bc27',3);}
  }
  for(const side of [-1,1])for(let i=0;i<5;i++){
   const x=side*(r-40),y=-r+115+i*300;
   c.fillStyle='#172131';c.fillRect(x-24,y-63,48,125);c.fillStyle='#596575';c.fillRect(x-19,y-57,38,113);c.fillStyle='#94a7b2';c.fillRect(x-19,y-57,5,113);
   c.fillStyle='#283745';c.fillRect(x-10,y-45,18,88);c.fillStyle='#84aaa26e';c.fillRect(x-5,y-39,6,30);c.fillStyle='#b6c9bd70';c.fillRect(x-5,y-39,2,15);
   path(c,[[x-side*20,y+56],[x-side*55,y+67],[x-side*73,y+112]],'#243442',9);path(c,[[x-side*20,y+55],[x-side*56,y+67],[x-side*73,y+110]],'#779297',2);
  }
  // The fractured observation window exposes the planet outside the arena.
  path(c,[[-400,-r+15],[-290,-r-70],[290,-r-70],[400,-r+15]],'#6c7e8c',12);
  path(c,[[-350,-r+9],[-270,-r-50],[270,-r-50],[350,-r+9]],'#a1b5bb55',3);
  ellipse(c,0,-r-190,220,220,'#4e727b38');ellipse(c,26,-r-220,198,198,def.dark);
  for(const x of [-480,-250,250,480]){path(c,[[x,-r+20],[x*.88,-r+75],[x*.83,-r+130]],'#90aaa848',4);}
 }else{
  // A theatrical wooden stage suspended before an impossible night city.
  for(let y=-r;y<r;y+=30){c.fillStyle=(Math.floor(y/30)%2)?'#7d587b1b':'#161c2823';c.fillRect(-r,y,r*2,28);path(c,[[-r,y+29],[r,y+29]],'#b0819222');for(let x=-r;x<r;x+=180){const xx=x+(Math.floor(y/30)%2)*80;c.fillStyle='#241e3099';c.fillRect(xx,y+12,3,3);}}
  gear(c,0,0,250,'#a583a12b',time*.025);gear(c,-430,-460,135,'#be9aad28',-time*.018);gear(c,445,435,115,'#be9aad28',time*.02);
  for(let i=0;i<18;i++){const x=-r+i*90,hb=70+hash(i,4)*125;c.fillStyle=i%2?'#151a2a':'#222136';c.fillRect(x,-r-hb+20,80,hb);c.fillStyle='#b19b733e';for(let yy=-r-hb+34;yy<-r;yy+=18)for(let xx=x+12;xx<x+70;xx+=18)c.fillRect(xx,yy,4,7);}
  for(const side of [-1,1]){const x=side*(r-17);c.fillStyle='#50283e';c.fillRect(x-20,-r,40,r*2);for(let i=0;i<5;i++){c.fillStyle=i%2?'#824658':'#361f36';c.fillRect(x-20+i*8,-r,6,r*2);}path(c,[[x,-r+80],[x-side*55,-r+140],[x-side*100,-r+135]],'#bd936153',4);}
 }
 c.strokeStyle=def.line;c.lineWidth=8;c.strokeRect(-r,-r,r*2,r*2);c.strokeStyle='#101725';c.lineWidth=3;c.strokeRect(-r+9,-r+9,r*2-18,r*2-18);
 c.restore();return true;
}
