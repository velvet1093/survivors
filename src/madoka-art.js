import {canvas,motion,selout,mix} from './hero-kit.js';
import {paintFace} from './expressions.js';
// Madoka Kaname. Shared features: short pink twin tails tied with red ribbons, round
// pink eyes, a soft blush and a small smile.
//  Magical Girl: big red bows, white puffed sleeves and gloves, a cream bodice laced in
//   pink, a red choker with her Soul Gem, a white bubble skirt with pink petal points,
//   white socks and red strapped shoes.
//  Ultimate Madoka: floor-length pink hair with white wing ornaments, golden eyes, a white
//   capelet and layered gown edged in black, opening onto a starry cosmos, and white
//   stockings with tiny wings at the ankles.
//  Mitakihara School Uniform: a cream blazer with red trim, red bow tie, dark plaid
//   pleated skirt, white thigh-high socks and brown loafers.
//  Rose Sunday: a white blouse under a rose pinafore with a yellow satchel.
//  Rose Ribbon Nightdress: a long pale pink nightdress with frills and bunny slippers.
//  Rosewater Swim Dress: a polka-dot pink swim dress with a flared skirt.
//  Rosewater Ruffles: a white top and pink bottoms layered in ruffles.
//  Little Rose Bathrobe: a fluffy pink robe with a bunny-eared hood.
export const MADOKA_ART={ink:'#503548',iris:'#ad577e'};
const c=MADOKA_ART,SK={base:'#ffe2c6',shade:'#ebb9a0',deep:'#cf8d84',light:'#fff2e4'};
const PINK=['#ae648f','#efa4c1','#ffe0e9'],GODDESS=['#c87aa4','#f8b8d4','#ffe8f2'];
const LOOKS={
 default:{hair:'tails',ribbon:'big',body:'magical',sleeve:{upper:null,fore:null,puff:true,cuff:'#ffffff'}},
 goddess:{hair:'goddess',body:'goddess',sleeve:{upper:null,fore:null,puff:true,frill:'#f8b8d4'}},
 school:{hair:'tails',ribbon:'small',body:'school',sleeve:{upper:['#c8b890','#f2e8cc','#fffaee'],fore:['#c8b890','#f2e8cc','#fffaee'],cuff:'#c0303a'}},
 casual:{hair:'tails',ribbon:'small',body:'pinafore',sleeve:{upper:['#d8d0dc','#ffffff','#ffffff'],fore:null,puff:true}},
 pajamas:{hair:'low',ribbon:'small',body:'nightdress',sleeve:{upper:['#d8a0b8','#f8d0e0','#fff0f6'],fore:['#d8a0b8','#f8d0e0','#fff0f6'],cuff:'#ffffff'}},
 swimsuit:{hair:'tails',ribbon:'small',body:'swimdress',sleeve:null},
 cuteswim:{hair:'tails',ribbon:'flower',body:'ruffles',sleeve:null},
 bathsuit:{hair:'hood',body:'bathrobe',sleeve:{upper:['#d890ac','#f8b8d0','#ffe0ec'],fore:['#d890ac','#f8b8d0','#ffe0ec'],cuff:'#ffffff'}},
};
const shift=(pts,y)=>pts.map(([x,yy])=>[x,yy+y]);
// Her face keeps the original sprite's proportions: a broad face with a compact jaw and
// cheek shading, small bright eyes with pink irises, a soft smile and blush.
function face(r,m,L){
 const {y,blink,expression}=m,{poly:P,rect:R}=r,shadow='#e8af96';
 R(25,36+y,7,4,shadow);
 P(shift([[18,20],[37,20],[39,30],[36,36],[31,39],[24,39],[18,35],[16,29]],y),shadow);
 P(shift([[19,20],[36,20],[37,31],[34,36],[30,38],[24,37],[19,34],[18,28]],y),SK.base);
 R(16,29+y,2,4,shadow);R(38,29+y,2,4,shadow);
 paintFace(r,'madoka',{y,expression,blink});
 R(19,34+y,3,1,'#edb0b5');R(35,34+y,3,1,'#edb0b5');
 // Ultimate Madoka's eyes turn gold.
 if(L.hair==='goddess')for(let yy=27+y;yy<34+y;yy++)for(let x=20;x<37;x++){const i=yy*56+x;if(r.pixels[i]==='#ad577e')r.pixels[i]='#e0a830';}
}
function hairBack(r,m,L){
 const {y,walk,frame,moving}=m,{poly:P,line:Ln,rect:R}=r,H=L.hair==='goddess'?GODDESS:PINK;
 if(L.hair==='goddess'){// Floor-length hair streaming out behind her on both sides.
  for(const s of [-1,1]){const X=d=>28+s*d;P([[X(8),18],[X(13),22],[X(16),40],[X(19)+walk*.5,58],[X(17)+walk*.5,71],[X(12),71],[X(10),56],[X(8),40]],H[0]);P([[X(9),22],[X(12),24],[X(14),40],[X(16)+walk*.5,58],[X(15)+walk*.5,69],[X(12),69],[X(11),56],[X(9),40]],H[1]);Ln(X(12),30,X(15)+walk*.5,66,H[2]);}
  return;}
 if(L.hair==='hood'){// The bathrobe hood with two floppy bunny ears.
  P(shift([[14,28],[14,16],[20,9],[36,9],[42,16],[42,28],[38,34],[18,34]],y),'#d890ac');P(shift([[15,27],[16,16],[21,11],[35,11],[40,16],[41,27]],y),'#f8b8d0');
  for(const s of [-1,1]){P(shift([[28+s*6,11],[28+s*12,1],[28+s*14,4],[28+s*9,13]],y),'#f8b8d0');P(shift([[28+s*7,10],[28+s*12,3],[28+s*12,6],[28+s*9,11]],y),'#ffd8e4');}return;}
 if(L.hair==='low'){// Tails tied low and hanging down for bed.
  for(const s of [-1,1]){const x=28+s*12;P(shift([[x-2,28],[x+2,28],[x+2+s,46],[x-1+s,48],[x-3+s,44]],y),H[0]);P(shift([[x-1,29],[x+1,29],[x+1+s,44],[x-1+s,44]],y),H[1]);}return;}
 // Short twin tails swept out from either side of the head.
 const sway=moving?[0,1,0,-1][frame]:frame%2;
 P(shift([[14,17],[8+sway,20],[9+sway,33],[12+sway,38],[14,33],[18,35],[18,22]],y),H[0]);P(shift([[42,17],[48-sway,20],[47-sway,33],[44-sway,38],[42,33],[38,35],[38,22]],y),H[0]);
 P(shift([[13,19],[10+sway,23],[12+sway,32],[14,29],[16,32],[16,21]],y),H[1]);P(shift([[43,19],[46-sway,23],[44-sway,32],[42,29],[40,32],[40,21]],y),H[1]);
 R(11+sway,22+y,2,7,H[2]);R(43-sway,22+y,2,7,H[2]);
}
function bow(r,x,y,big,colors){
 const {poly:P,rect:R}=r,[dark,mid,knot]=colors;
 if(big){P([[x-3,13+y],[x+7,17+y],[x+3,24+y],[x-6,19+y]],dark);P([[x-2,14+y],[x+5,17+y],[x+2,22+y],[x-4,19+y]],mid);R(x,17+y,4,4,knot);return;}
 P([[x,13+y],[x+5,17+y],[x+2,21+y],[x-3,18+y]],dark);P([[x,14+y],[x+3,17+y],[x+1,19+y],[x-1,17+y]],mid);R(x+1,18+y,3,3,knot);
}
function hairFront(r,m,L){
 const {y}=m,{poly:P,line:Ln,rect:R,put}=r,H=L.hair==='goddess'?GODDESS:PINK;
 if(L.hair==='hood'){// Only a fringe shows under the hood.
  P(shift([[18,25],[19,18],[24,14],[32,14],[37,18],[38,25],[35,22],[32,24],[29,21],[26,24],[23,21],[20,24]],y),H[1]);Ln(21,17+y,27,15+y,H[2]);return;}
 // The original rounded crown and fringe, with its bright band of shine.
 P(shift([[15,28],[14,18],[18,13],[24,10],[33,10],[39,13],[42,19],[41,29],[38,31],[35,25],[32,22],[29,27],[25,23],[22,28],[19,24],[18,32]],y),H[0]);
 P(shift([[16,24],[16,18],[20,14],[25,12],[32,12],[38,15],[40,20],[39,27],[35,22],[32,19],[29,24],[25,20],[22,25],[19,21]],y),H[1]);
 R(20,14+y,16,2,H[2]);R(17,18+y,3,3,'#f9bfd5');R(38,18+y,2,5,'#f9bfd5');
 if(L.hair==='goddess'){// Little pigtails on top, tied with big white bows.
  for(const s0 of [-1,1]){const X=d=>28+s0*d;P(shift([[X(9),14],[X(14),11],[X(17),15],[X(15),22],[X(12),18]],y),H[0]);P(shift([[X(10),15],[X(14),12],[X(16),15],[X(14),20],[X(12),17]],y),H[1]);
   // Bow: two rounded loops either side of a knot, with short trailing tails.
   const bx=X(10),by=12+y;
   for(const d of [-1,1]){P([[bx,by],[bx+d*6,by-4],[bx+d*7,by+1],[bx+d*4,by+3]],'#d8d0e0');P([[bx+d,by],[bx+d*5,by-3],[bx+d*6,by+1],[bx+d*4,by+2]],'#ffffff');}
   r.rect(bx-1,by-1,3,3,'#f0e8f4');Ln(bx-1,by+2,bx-2,by+6,'#e8e0ec');Ln(bx+1,by+2,bx+2,by+6,'#e8e0ec');}
  return;}
 if(L.hair==='low'){R(14,28+y,4,2,'#e04a5a');R(39,28+y,4,2,'#e04a5a');return;}
 if(L.ribbon==='flower'){for(const x of [13,43]){const yy=16+y;for(const [dx,dy]of [[-2,0],[2,0],[0,-2],[0,2]])R(x+dx,yy+dy,2,2,'#ffffff');R(x,yy,2,2,'#f8c040');}return;}
 const big=L.ribbon==='big',colors=big?['#b02a4a','#e85a7a','#c03a5a']:['#ac3b63','#dd6b92','#bd456e'];
 for(const x of [12,40])bow(r,big&&x>28?x+1:x,y,big,colors);
}
function legs(r,m,{top,sock,sockTop,shoe,strap,frill}){
 const {walk}=m,{rect:R,line:Ln}=r;
 for(const [i,x]of [[0,22],[1,30]]){const d=i?walk:-walk;R(x+d*.5,top,4,67-top,SK.base);R(x+3+d*.5,top,1,67-top,SK.shade);
  if(sock){R(x+d*.5,sockTop,4,67-sockTop,sock);R(x+3+d*.5,sockTop,1,67-sockTop,mix(sock,'#000000',.15));if(frill)R(x-1+d*.5,sockTop,6,1,'#ffffff');}
  R(x-1+d*.5,67,6,3,shoe);R(x+d*.5,67,3,1,mix(shoe,'#ffffff',.3));R(x-1+d*.5,69,6,1,mix(shoe,'#000000',.4));if(strap)Ln(x+d*.5,66,x+4+d*.5,66,shoe);}
}
function body(r,m,L){
 const {y,walk}=m,{poly:P,rect:R,line:Ln,put}=r,b=L.body;
 if(b==='magical'){
  legs(r,m,{top:56,sock:'#ffffff',sockTop:58,shoe:'#c0303a',strap:true,frill:true});
  for(const x of [22,30])Ln(x+(x<28?-walk:walk)*.5,66,x+4+(x<28?-walk:walk)*.5,64,'#e04a5a');
  // A full white bubble skirt: petticoat frills under a pink overskirt cut into petal points.
  P([[17,48],[39,48],[45+walk*.4,56],[11+walk*.4,56]],'#d8d0dc');P([[18,49],[38,49],[43+walk*.4,55],[13+walk*.4,55]],'#ffffff');
  for(let x=12;x<45;x+=3){r.rect(x+walk*.4,55,2,2,'#ffffff');put(x+1+walk*.4,56,'#e8d8e4');}
  for(const [x0,w]of [[16,6],[22,6],[28,6],[34,6]]){P([[x0,47],[x0+w,47],[x0+w/2+walk*.3,55]],'#a02a50');P([[x0+.8,47],[x0+w-.8,47],[x0+w/2+walk*.3,53.5]],'#f07aa8');Ln(x0+1,48,x0+w/2+walk*.3,53,'#ffb8d4');}
  // Big pink bows tied at each hip.
  for(const s0 of [-1,1]){const X=d=>28+s0*d;P([[X(9),46],[X(13),43],[X(14),49]],'#b02a4a');P([[X(9),46],[X(13),44],[X(13),48]],'#f07aa8');Ln(X(11),48,X(13)+walk*.3,54,'#e85a7a',2);}
  // Cream bodice edged in white lace and laced up the front in pink.
  P(shift([[21,38],[35,38],[34,48],[22,48]],y),'#d8b868');P(shift([[22,39],[34,39],[33,47],[23,47]],y),'#fae8a0');
  for(const x of [22,34])for(let yy=39;yy<47;yy+=2)put(x,yy+y,'#ffffff');
  for(const yy of [40,43])Ln(26,yy+y,30,yy+2+y,'#f07aa8'),Ln(30,yy+y,26,yy+2+y,'#f07aa8');Ln(28,46+y,28,47+y,'#f07aa8');
  // Red choker with the pink Soul Gem pendant.
  R(25,36+y,7,2,'#c0303a');put(28,38+y,'#d8b048');P(shift([[28,39],[30,41],[28,43],[26,41]],y),'#e04a8a');put(28,40+y,'#ffc0e0');return;}
 if(b==='school'){
  // Thigh-high socks rise to meet the hem, so only a sliver of skin shows.
  legs(r,m,{top:57,sock:'#ffffff',sockTop:58,shoe:'#6a4a2a'});
  // Dark plaid pleated skirt, falling to mid-thigh.
  P([[19,47],[37,47],[41+walk*.4,58],[15+walk*.4,58]],'#1e1e28');P([[20,48],[36,48],[40+walk*.4,57],[16+walk*.4,57]],'#34343e');
  for(const x of [20,25,30,35])Ln(x,48,x+(x-28)*.15+walk*.4,57,'#9a9aa8');for(const yy of [51,55])Ln(17+walk*.4,yy,39+walk*.4,yy,'#c8c8d0');for(const x of [22,28,33])Ln(x,48,x+(x-28)*.15+walk*.4,57,'#141418');
  // Cream blazer with red-trimmed hem, white collar and a big red bow tie.
  P(shift([[19,37],[37,37],[38,48],[18,48]],y),'#c8b890');P(shift([[20,38],[36,38],[37,47],[19,47]],y),'#f2e8cc');Ln(18,48,38,48,'#c0303a');for(let x=19;x<38;x+=2)put(x,49,'#c0303a');
  for(const x of [22,32])Ln(x,44+y,x+2,44+y,'#a89870');
  P(shift([[24,36],[32,36],[28,40]],y),'#ffffff');P(shift([[23,37],[28,40],[25,41]],y),'#f4f4f4');
  P(shift([[28,39],[23,37],[23,42]],y),'#c0303a');P(shift([[28,39],[33,37],[33,42]],y),'#c0303a');R(27,38+y,3,3,'#a02030');Ln(27,41+y,26,45+y,'#a02030');Ln(29,41+y,30,45+y,'#a02030');return;}
 if(b==='goddess'){
  // Small feathered wings fan out behind her shoulders.
  for(const s0 of [-1,1])for(let i=0;i<5;i++){const X=d=>28+s0*d,tx=X(12+i*3),ty=30+i*3;P([[X(8),38],[tx,ty],[tx+s0*2,ty+4],[X(9),42]],i%2?'#ffe4f2':'#ffffff');Ln(X(8),39,tx,ty+1,'#f4c8e0');}
  // A long train behind her, white above and lined with a starry cosmos.
  P([[14,52],[42,52],[49+walk*.3,71],[7+walk*.3,71]],'#2a1a5a');P([[17,56],[39,56],[45+walk*.3,71],[11+walk*.3,71]],'#3a2a78');
  for(const [x,yy]of [[12,68],[18,62],[38,61],[44,67],[16,70],[40,70],[21,66],[35,66]])put(x+walk*.3,yy,yy%2?'#ffffff':'#e0c8ff');
  for(const s0 of [-1,1]){const X=d=>28+s0*d;P([[X(12),52],[X(16),52],[X(22)+walk*.3,70],[X(18)+walk*.3,71]],'#ffffff');for(let yy=56;yy<70;yy+=3)put(X(17+(yy-56)*.3)+walk*.3,yy,'#f8b8d4');}
  // Pale pink thigh-high stockings and white heels with tiny wings at the ankles.
  for(const [i,x]of [[0,23],[1,30]]){const d=i?walk:-walk;R(x+d*.5,55,4,13,'#f8dcea');R(x+3+d*.5,55,1,13,'#e8b8d0');R(x+d*.5,55,4,1,'#ffffff');
   R(x-1+d*.5,68,5,3,'#ffffff');R(x-1+d*.5,70,5,1,'#d8d0e0');P([[x+(i?4:0)+d*.5,67],[x+(i?8:-4)+d*.5,64],[x+(i?6:-2)+d*.5,68]],'#ffffff');}
  // A full skirt of white ruffles, each tier edged with a dark scalloped underside.
  for(const [top,out,h]of [[45,12,5],[49,15,5],[53,18,5],[57,20,3]]){P([[28-out+4,top],[28+out-4,top],[28+out+walk*.4,top+h],[28-out+walk*.4,top+h]],'#ffffff');
   for(let x=28-out;x<28+out;x+=3){put(x+walk*.4,top+h,'#3a2a6a');put(x+1+walk*.4,top+h,'#3a2a6a');put(x+2+walk*.4,top+h,'#c8a8e0');}
   for(const fx of [-5,0,5])Ln(28+fx*.6,top+1,28+fx*1.1+walk*.4,top+h-1,'#ece6f2');}
  // White bodice with a keyhole neckline, scalloped trim and the pink gem; a white choker.
  P(shift([[21,38],[35,38],[34,48],[22,48]],y),'#d8d0dc');P(shift([[22,39],[34,39],[33,47],[23,47]],y),'#ffffff');
  P(shift([[26,38],[30,38],[28,43]],y),SK.base);for(let x=22;x<35;x+=2)put(x,39+y,'#e8dcec');
  P(shift([[28,42],[30,44],[28,46],[26,44]],y),'#e0306a');put(28,43+y,'#ffc0e0');R(25,36+y,7,1,'#ffffff');
  return;}
 if(b==='pinafore'){
  legs(r,m,{top:56,sock:'#ffffff',sockTop:61,shoe:'#c0303a',strap:true});
  // A white blouse with a rounded collar under a rose pinafore dress to the knee.
  R(21,37+y,15,6,'#ffffff');P(shift([[23,36],[28,39],[25,40]],y),'#f4f0f4');P(shift([[33,36],[28,39],[31,40]],y),'#f4f0f4');put(28,38+y,'#c0303a');
  P(shift([[21,40],[35,40],[36,47],[20,47]],y),'#c8608a');P(shift([[22,41],[34,41],[35,46],[21,46]],y),'#e888b0');for(const x of [23,33])Ln(x,37+y,x,41+y,'#c8608a');
  P([[20,47],[36,47],[40+walk*.4,58],[16+walk*.4,58]],'#c8608a');P([[21,48],[35,48],[38+walk*.4,57],[18+walk*.4,57]],'#e888b0');R(25,50,6,4,'#c8608a');R(26,51,4,2,'#f4a8c8');
  for(const x of [24,32])put(x,43+y,'#ffffff');
  // A yellow satchel on a strap across the body.
  Ln(35,38+y,22,49,'#c89830');R(18,48,6,5,'#e8c040');R(19,48,4,1,'#f8e080');put(21,50,'#a07820');return;}
 if(b==='nightdress'){
  for(const x of [22,30]){R(x-1-walk*.3,66,7,4,'#ffffff');R(x-walk*.3,64,2,3,'#ffffff');R(x+3-walk*.3,64,2,3,'#ffffff');put(x-walk*.3,65,'#f8b8d0');put(x+3-walk*.3,65,'#f8b8d0');put(x+2-walk*.3,67,'#3a2a3a');}
  // A long nightdress with frilled collar and hem and a red ribbon.
  P([[19,40],[37,40],[41+walk*.4,65],[15+walk*.4,65]],'#d8a0b8');P([[20,41],[36,41],[39+walk*.4,64],[17+walk*.4,64]],'#f8d0e0');for(let x=16;x<41;x+=3)r.rect(x+walk*.4,64,2,2,'#ffffff');for(const fx of [-5,1,7])Ln(28+fx*.5,44,28+fx*1.2+walk*.4,62,'#fff0f6');
  P(shift([[21,37],[35,37],[36,42],[20,42]],y),'#f8d0e0');for(let x=21;x<36;x+=2){put(x,37+y,'#ffffff');put(x+1,38+y,'#ffffff');}
  R(25,40+y,7,3,'#e04a5a');R(27,40+y,3,3,'#b02a3a');Ln(27,43+y,26,47+y,'#e04a5a');Ln(29,43+y,30,47+y,'#e04a5a');return;}
 if(b==='bathrobe'){
  legs(r,m,{top:57,shoe:'#f8b8d0'});
  P([[19,40],[37,40],[39+walk*.4,59],[17+walk*.4,59]],'#d890ac');P([[20,41],[36,41],[38+walk*.4,58],[18+walk*.4,58]],'#f8b8d0');for(let x=18;x<39;x+=2)r.put(x+walk*.4,58,'#ffffff');
  P(shift([[20,37],[36,37],[37,42],[19,42]],y),'#f8b8d0');P(shift([[24,37],[32,37],[28,43]],y),SK.base);Ln(24,37+y,29,45+y,'#ffffff',2);Ln(32,37+y,28,42+y,'#ffffff',2);
  R(19,47+y,18,2,'#ffffff');Ln(31,49+y,33,55,'#ffffff');for(const [x,yy]of [[22,51],[34,53],[25,55]])put(x,yy,'#ffe0ec');return;}
 // Swimwear: bare shoulders and legs.
 legs(r,m,{top:53,shoe:b==='ruffles'?'#f8a0c4':'#f070a8',strap:true});R(20,37+y,17,3,SK.base);R(20,39+y,17,1,SK.shade);
 if(b==='swimdress'){
  P(shift([[21,40],[35,40],[36,48],[20,48]],y),'#c8508a');P(shift([[22,41],[34,41],[35,47],[21,47]],y),'#f080b0');for(const x of [23,33])Ln(x,37+y,x,40+y,'#c8508a');
  P([[19,48],[37,48],[41+walk*.4,55],[15+walk*.4,55]],'#c8508a');P([[20,49],[36,49],[39+walk*.4,54],[17+walk*.4,54]],'#f080b0');
  for(const [x,yy]of [[24,43],[31,45],[27,46],[22,51],[30,52],[35,50],[26,53]])put(x,yy+(yy<48?y:0),'#ffffff');R(26,40+y,5,2,'#e04a5a');put(28,40+y,'#b02a3a');return;}
 // Ruffles: a white top with pink ruffled straps and layered pink ruffle bottoms.
 P(shift([[21,40],[35,40],[36,47],[20,47]],y),'#d8d0dc');P(shift([[22,41],[34,41],[35,46],[21,46]],y),'#ffffff');
 for(let x=19;x<38;x+=2){put(x,39+y,'#f8a0c4');put(x+1,40+y,'#f070a8');}R(23,47+y,11,3,SK.base);
 for(const [yy,k]of [[49,0],[52,1]]){P([[19-k,yy],[37+k,yy],[39+k+walk*.4,yy+4],[17-k+walk*.4,yy+4]],k?'#f070a8':'#f8a0c4');for(let x=17-k;x<40+k;x+=3)put(x+walk*.4,yy+4,'#ffffff');}
}
function arms(r,m,L){
 const {y,cast,pose,walk}=m,{rect:R,line:Ln,poly:P}=r,S=L.sleeve,pray=['hope','ascend','ultimate'].includes(pose);
 // At rest her arms hang at her sides; the aimed bow arm is drawn with the bow itself.
 const plan=pray?[[19,39,23,45,27,42],[37,39,33,45,30,42]]:cast?[[19,39,17,46,16,52],[37,39,39,45,34,42]]:[[19,39,17,46,16,52+walk*.3],[37,39,39,46,40,52-walk*.3]];
 for(const [sx,sy,ex,ey,hx,hy]of plan){
  const up=S?.upper,fo=S?.fore;
  if(up){Ln(sx,sy+y,ex,ey+y,up[0],5);Ln(sx,sy+y,ex,ey-1+y,up[1],3);}else{Ln(sx,sy+y,ex,ey+y,SK.shade,4);Ln(sx,sy+y,ex,ey-1+y,SK.base,3);}
  if(fo){Ln(ex,ey+y,hx,hy+y,fo[0],4);Ln(ex,ey+y,hx,hy-1+y,fo[1],3);}else{Ln(ex,ey+y,hx,hy+y,SK.shade,4);Ln(ex,ey+y,hx,hy-1+y,SK.base,3);}
  if(S?.cuff)R(hx-2,hy-1+y,4,2,S.cuff);
  const glove=L.body==='magical'||L.body==='goddess';R(hx-1,hy+y,3,3,glove?'#ffffff':SK.base);R(hx-1,hy+2+y,3,1,glove?'#d8d0dc':SK.shade);
  // Round puffed shoulders or the goddess's capelet sit over the arm.
  if(S?.puff){r.poly(shift([[sx-3,37],[sx+3,37],[sx+4,42],[sx-4,42]],y),'#d8d0dc');r.poly(shift([[sx-2,38],[sx+2,38],[sx+3,41],[sx-3,41]],y),'#ffffff');if(S.frill)Ln(sx-4,42+y,sx+4,42+y,S.frill);}
 }
}
const cache=new Map();
export function madokaPixels({frame=0,moving=false,pose='',attack=false,expression='neutral',blink=false,skin='default'}={}){
 const look=LOOKS[skin]?skin:'default',key=[frame,moving,pose,attack,expression,blink,look].join(':');if(cache.has(key))return cache.get(key);
 const mo=motion({frame,moving}),m={frame:((frame%4)+4)%4,moving,pose,attack,expression,blink,walk:mo.walk*2,y:mo.y,cast:attack},L=LOOKS[look],r=canvas();
 // The head sits a little higher than the torso so a short neck shows beneath the chin.
 const hm={...m,y:m.y-3};
 hairBack(r,hm,L);r.rect(25,33+m.y,7,6,SK.shade);r.rect(26,33+m.y,5,6,SK.base);body(r,m,L);arms(r,m,L);face(r,hm,L);hairFront(r,hm,L);
 const result=selout(r.pixels,c.ink);cache.set(key,result);return result;
}
