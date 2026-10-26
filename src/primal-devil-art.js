import {raster,outline} from './pixel-characters.js';

// The two primordial silhouettes are drawn natively at 56 × 76. Pale skeletons
// remain legible against both the black procession and the white funeral veil.
export const PRIMAL_DEVIL_PALETTES={
 darknessdevil:['#bdc2b4','#777f88','#e9e5d4','#171c28','#444b5b','#a8b9b8'],
 deathdevil:['#d8dace','#939fa0','#f0ecdd','#252a39','#b4bec0','#cfb69a'],
};
const INK='#29303e';
const offset=(n,m=2)=>Math.max(-m,Math.min(m,Math.round((Number.isFinite(n)?n:0)*.45)));
function skull(r,x,y,size=1,{stare=false,open=false}={}){
 const {poly:P,rect:R,line:L}=r,bone='#d4d7c6',shade='#879294',light='#eee9d8',dark='#303442';
 const p=points=>points.map(([a,b])=>[x+a*size,y+b*size]);
 P(p([[-4,0],[-2,-2],[2,-2],[4,0],[4,3],[2,6],[-2,6],[-4,3]]),shade);
 P(p([[-3,0],[-1,-1],[2,-1],[3,1],[2,4],[1,5],[-1,5],[-3,3]]),bone);
 R(x-2*size,y,2*size,(stare?2:1)*size,dark);R(x+size,y,2*size,(stare?2:1)*size,dark);
 if(stare){R(x-size,y+size,size,size,light);R(x+2*size,y+size,size,size,light);}
 P(p([[0,2],[-1,3],[1,3]]),dark);L(x-2*size,y+4*size,x+2*size,y+4*size,dark);
 if(open)R(x-size,y+4*size,3*size,2*size,dark);
 R(x-2*size,y-size,size,size,light);R(x-size,y+4*size,size,size,light);R(x+size,y+4*size,size,size,light);
}
function bone(r,points,width=3){
 const {line:L,rect:R}=r;
 for(let i=1;i<points.length;i++){L(...points[i-1],...points[i],'#7e8c8e',width+1);L(points[i-1][0],points[i-1][1],points[i][0],points[i][1],'#d0d3c3',width);L(points[i-1][0],points[i-1][1],points[i][0],points[i][1],'#eee9d8',1);}
 for(const[x,y]of points.slice(1,-1)){R(x-1,y-1,3,3,'#9ba5a0');R(x,y-1,1,2,'#e5e3d2');}
}
function darkness(m){
 const r=raster(),{rect:R,line:L,poly:P}=r,[boneColor,shade,light,cape,capeLight]=PRIMAL_DEVIL_PALETTES.darknessdevil;
 const sway=offset(m.tail),arm=offset(m.arm),step=offset(m.leg,1),attack=!!m.attack,fierce=!!m.enraged;
 // A continuous dark mantle frames the pale procession without hiding its legs.
 P([[19,23],[27,20],[36,23],[43,32],[45+sway,54],[52,70],[42,73],[34,67],[28,74],[22,68],[10,74],[4,70],[11-sway,48],[12,33]],cape);
 P([[15,32],[20,28],[18,49],[11-sway,68],[7,69]],'#272e3d');
 P([[37,28],[41,34],[43+sway,57],[48,69],[39,67]],'#303647');
 L(16,35,10-sway,64,capeLight);L(41,38,46+sway,66,'#42495b');
 // Legs are unnaturally long and thin, with bony knees and separated toes.
 for(const[x,s]of [[23,-1],[32,1]]){
  const d=s*step;bone(r,[[x,52],[x+s,61],[x+d,71]],2);
  P([[x-1+d,69],[x+2+d,69],[x+3+d,73],[x-3+d,73]],boneColor);
  for(let i=0;i<3;i++)L(x-2+d+i*2,72,x-3+d+i*2,74,light);
  L(x,55,x+s,60,light);R(x+s-1,61,3,2,shade);
 }
 // Several paired human arms bend around the upright stack of skulls.
 for(const s of [-1,1]){
  const shoulder=28+s*8,elbow=28+s*(15+arm),tip=28+s*(21+arm);
  bone(r,[[shoulder,32],[elbow,20-(attack?2:0)],[tip,39-(attack?4:0)]],2);
  bone(r,[[28+s*7,39],[28+s*(16-arm),49],[28+s*10,57]],2);
  bone(r,[[28+s*5,48],[28+s*13,58],[28+s*8,61]],2);
  if(fierce){bone(r,[[28+s*10,42],[28+s*21,48],[28+s*20,55]],1);for(let i=0;i<3;i++)L(28+s*20+i-1,54,28+s*20+i-2,59,light);}
 }
 P([[22,25],[27,23],[34,25],[35,51],[31,56],[24,56],[20,49]],shade);
 for(let i=0;i<5;i++){const y=30+i*5;L(22,y,26,y+2,boneColor);L(30,y+2,34,y,boneColor);L(23,y,25,y+1,light);}
 // Four distinct faces: sockets, staring eyes, a laughing jaw, and a quiet mask.
 skull(r,28,25,.9,{open:attack});skull(r,28,35,1,{stare:true,open:attack});
 skull(r,28,45,1,{open:true});skull(r,28,54,.85,{open:fierce});
 // Horizontal forearms and joined palms preserve the characteristic prayer pose.
 bone(r,[[21,37],[15-arm,43],[25,44]],2);bone(r,[[35,37],[41+arm,43],[31,44]],2);
 for(const s of [-1,1]){const x=28+s*(attack?2:1);L(x,45,x,39,light,2);L(x,38,x-s,37,boneColor);L(x+s,43,x+s,39,shade);}
 // Ribbed insect-like skull crest and two sweeping crescent horns.
 P([[28,0],[31,6],[34,10],[31,15],[33,19],[29,25],[25,23],[23,18],[25,14],[22,10],[25,6]],shade);
 P([[28,2],[30,7],[31,11],[28,23],[26,20],[27,11],[25,9]],light);
 for(const s of [-1,1]){
  P([[28+s*5,17],[28+s*11,14],[28+s*15,8],[28+s*15,3],[28+s*10,0],[28+s*13,1],[28+s*17,4],[28+s*17,9],[28+s*14,15],[28+s*7,20]],boneColor);
  L(28+s*15,5,28+s*15,10,light);L(28+s*14,12,28+s*9,16,light);
  for(let i=0;i<4;i++)L(28+s*3,11+i*3,28+s*(6+i%2),13+i*3,light);
 }
 L(28,6,28,21,'#829293');R(25,20,2,2,INK);R(30,20,2,2,INK);
 if(fierce){L(25,29,30,29,'#e2d0ad');R(27,48,2,2,'#e3d3b2');L(19,63,15,70,shade);L(37,63,42,70,shade);}
 return outline(r.pixels,INK);
}
function death(m){
 const r=raster(),{rect:R,line:L,poly:P}=r,[veil,shade,light,dark,edge]=PRIMAL_DEVIL_PALETTES.deathdevil;
 const sway=offset(m.tail),arm=offset(m.arm,1),attack=!!m.attack,fierce=!!m.enraged;
 // Long bone needles have joints and taper to a point, rather than solid wings.
 for(const s of [-1,1])for(const [yy,tipY,reach]of [[27,12,25],[34,31,27],[42,51,25],[51,67,24]]){
  const start=28+s*8,mid=28+s*(15+arm),tip=28+s*reach;
  bone(r,[[start,yy],[mid,yy-3],[tip,tipY]],1);
  P([[tip,tipY],[mid+s,yy-4],[mid-s,yy-2]],light);
  R(mid-1,yy-4,2,3,shade);
 }
 // The hanging white panels part around a black spinal column of mouths.
 P([[20,22],[27,25],[25,37],[24,58],[22,73],[7,74],[5-sway,70],[9,48],[11,31]],shade);
 P([[20,24],[24,27],[22,44],[21,69],[9,72],[8,67],[12,45],[13,32]],veil);
 P([[35,22],[29,25],[31,38],[31,58],[33,73],[49,74],[51+sway,70],[47,48],[44,31]],shade);
 P([[35,25],[31,28],[33,45],[34,69],[47,72],[48,66],[44,44],[42,32]],veil);
 P([[25,25],[31,25],[33,68],[29,73],[24,70]],dark);
 for(const s of [-1,1]){L(28+s*12,31,28+s*17,69,light);L(28+s*8,30,28+s*7,68,edge);L(28+s*16,44,28+s*20,70,shade);}
 // Multiple toothed mouths descend through the central cavity; eyes sit between.
 for(let i=0;i<4;i++){
  const y=30+i*10,w=i===0?8:7,h=attack||fierce?5:3;
  P([[28-w/2,y],[28+w/2,y],[28+w/2+1,y+h],[28+w/2-1,y+h+2],[28-w/2+1,y+h+2],[28-w/2-1,y+h]],'#555e65');
  R(28-w/2,y+1,w,h,dark);
  for(let xx=25;xx<=31;xx+=2){R(xx,y+1,1,attack?2:1,light);R(xx,y+h,1,1,veil);}
  const eyeY=y+7;P([[25,eyeY],[28,eyeY-1],[31,eyeY],[28,eyeY+1]],edge);R(27,eyeY,2,1,fierce?'#ede0bc':light);
 }
 // A skeletal axe crest grows out of the long, toothed central head.
 bone(r,[[28,8],[28,19],[28,28]],2);
 for(const s of [-1,1]){
  P([[28+s*2,12],[28+s*5,4],[28+s*1,1],[28+s*5,2],[28+s*11,8],[28+s*9,13],[28+s*6,10],[28+s*4,15]],light);
  for(const[dx,dy]of [[7,-2],[11,3],[13,8]]){L(28+s*3,17,28+s*dx,17+dy,edge,2);L(28+s*3,17,28+s*dx,17+dy,light);R(28+s*dx-1,16+dy,3,2,veil);}
 }
 P([[24,12],[28,10],[32,13],[34,19],[31,25],[28,27],[24,24],[22,18]],shade);
 P([[25,13],[28,12],[31,14],[32,19],[29,24],[26,23],[24,18]],light);
 P([[24,17],[27,18],[26,20],[24,19]],dark);P([[30,17],[32,17],[31,20],[29,19]],dark);R(27,21,2,2,dark);
 for(let xx=24;xx<32;xx+=2)L(xx,23,xx,attack?28:26,light);
 if(fierce){for(const s of [-1,1]){L(28+s*14,45,28+s*18,48,shade);L(28+s*17,55,28+s*14,60,shade);L(28+s*17,60,28+s*20,65,shade);}R(27,15,2,2,'#ded1af');}
 return outline(r.pixels,INK);
}
export function primalDevilPixels(id,m={}){return id==='darknessdevil'?darkness(m):id==='deathdevil'?death(m):null;}
