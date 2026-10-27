import {canvas,selout,mix} from './hero-kit.js';
// The four Evangelion units, front view. Every unit shares the lanky EVA frame: tall
// shoulder pylons rising past a small helmet, a chevron-plated chest, a pointed waist
// guard, long arms and long legs with knee spikes and dotted toe caps. Each unit has
// its own head and markings:
//  Unit-01: purple and black with green, a single forward horn and an orange collar.
//  Unit-00: the blue refit with white arms, a single red eye, a green dome and side disc.
//  Unit-02: red with yellow arms and purple hands, four eyes and a white jaw guard.
//  Unit-08: pink with white arms and orange plates, a crowned head and six green eyes.
export const EVA_UNITS={
 default:{armor:['#2e1f48','#5c3c8a','#8a64ba','#b89ae0'],dark:['#141218','#24202e'],accent:['#2c6a34','#72c844','#c4ec80'],collar:'#f0a030',sole:'#e89a30',
  arm:'upper',forearm:'dark',pylon:'dark',hand:'armor',knee:'#f0a030',toe:'accent',eye:'#e4f4a0'},
 rei:{armor:['#1c2258','#34429a','#5466c4','#8496e4'],dark:['#141630','#262a52'],accent:['#8a90b4','#e2e6f2','#ffffff'],collar:'#b8342e',sole:'#a8a880',
  arm:'accent',forearm:'accent',pylon:'armor',hand:'armor',knee:'accent',toe:'armor',eye:'#ff4a3a'},
 asuka:{armor:['#5c1712','#b8321f','#e45a3a','#f8946e'],dark:['#1a1010','#2e1a18'],accent:['#9a5c0c','#e49a1c','#f8ce5a'],collar:'#4e3a82',sole:'#e8a83a',
  arm:'accent',forearm:'accent',pylon:'armor',hand:'purple',knee:'accent',toe:'armor',eye:'#8cf2e0'},
 mari:{armor:['#6e3452','#c46a8c','#e29ab4','#f6ccda'],dark:['#1a1218','#2e2028'],accent:['#9a9aac','#e6e6ec','#ffffff'],collar:'#2a1e2a',sole:'#e0b44a',
  arm:'accent',forearm:'accent',pylon:'armor',hand:'slate',knee:'#f0a030',toe:'armor',eye:'#7cf06c'},
};
const HANDS={purple:['#2e2452','#4e3e86','#7a68b4'],slate:['#2c3448','#4a5878','#7484a4']};
const shift=(pts,y)=>pts.map(([x,yy])=>[x,yy+y]);
function shade3(r,pts,[dark,mid,light],y=0){const p=shift(pts,y);r.poly(p,dark);const cx=p.reduce((s,q)=>s+q[0],0)/p.length,cy=p.reduce((s,q)=>s+q[1],0)/p.length;r.poly(p.map(([x,yy])=>{const dx=cx-x,dy=cy-yy,l=Math.hypot(dx,dy)||1;return [x+dx/l,yy+dy/l];}),mid);if(light){const left=[...p].sort((a,b)=>a[0]-b[0]).slice(0,2);r.line(left[0][0]+1,left[0][1],left[1][0]+1,left[1][1],light);}}
const tone=(u,key)=>key==='armor'?u.armor.slice(0,3):key==='dark'?[u.dark[0],u.dark[1],mix(u.dark[1],'#ffffff',.25)]:key==='accent'?u.accent:HANDS[key]||u.armor.slice(0,3);

function pylons(r,u,id,y){
 const {poly:P,rect:R,line:L}=r;
 for(const side of [-1,1]){const X=d=>28+side*d,c=tone(u,u.pylon),thin=id==='mari';
  // Tall restraint pylons, broad at the shoulder and squared off above the head.
  const w=thin?4:6;shade3(r,[[X(15),40],[X(15),10],[X(15+w),9],[X(15+w),40]],c,y);
  if(id==='default'){R(Math.min(X(15),X(15+w))+1,12+y,w-1,4,u.accent[1]);R(Math.min(X(15),X(15+w))+1,30+y,w-1,3,u.accent[1]);L(X(15)+side,17+y,X(15)+side,29+y,u.armor[1]);}
  if(id==='rei')R(Math.min(X(15),X(15+w))+1,12+y,2,24,u.accent[1]);
  if(id==='asuka')R(Math.min(X(15),X(15+w))+1,24+y,w-1,8,u.accent[1]);
  if(id==='mari'){R(Math.min(X(15),X(15+w)),20+y,w,6,u.dark[0]);R(Math.min(X(15),X(15+w))+1,27+y,w-1,4,'#f0a030');}
  // Shoulder pauldron the pylon rests on.
  shade3(r,[[X(10),34],[X(19),33],[X(21),40],[X(18),44],[X(11),43]],u.armor,y);
  if(id==='mari')R(Math.min(X(12),X(18)),37+y,6,2,'#f0a030');
 }
}
function torso(r,u,id,y){
 const {poly:P,rect:R,line:L}=r;
 shade3(r,[[18,34],[38,34],[39,42],[35,50],[21,50],[17,42]],u.armor,y);
 R(24,31+y,9,4,u.collar);R(25,31+y,7,1,mix(u.collar,'#ffffff',.35));
 if(id==='default'){P(shift([[20,35],[25,35],[22,40]],y),u.accent[1]);P(shift([[36,35],[31,35],[34,40]],y),u.accent[1]);}
 if(id==='asuka')P(shift([[20,35],[24,34],[22,38]],y),u.accent[1]),P(shift([[36,35],[32,34],[34,38]],y),u.accent[1]);
 if(id==='mari')for(const s of [-1,1])R(28+s*7-1,38+y,3,2,'#f0a030');
 // Black chevrons down the chest plate.
 for(const yy of [40,45]){L(19,yy+y,28,yy+3+y,u.dark[0],2);L(28,yy+3+y,37,yy+y,u.dark[0],2);}
 // Light catches the upper left of the chest plate.
 L(20,36+y,25,38+y,u.armor[3]);L(19,42+y,22,44+y,u.armor[2]);
 if(id==='mari'){P([[21,48],[35,48],[28,53]],u.accent[1]);P([[23,49],[33,49],[28,52]],u.accent[0]);}
 if(id==='rei')R(26,36+y,5,3,u.accent[1]);
 // Narrow waist and the pointed groin guard.
 shade3(r,[[21,49],[35,49],[34,55],[28,59],[22,55]],u.armor);L(22,51,34,51,u.dark[0]);
 if(id==='default')R(25,52,7,1,u.accent[1]);
}
function legs(r,u,id,step){
 const {poly:P,rect:R,line:L}=r;
 for(const [x,d]of [[21,-step],[30,step]]){
  shade3(r,[[x,54],[x+6,54],[x+6+d*.4,62],[x+d*.4,62]],u.armor);
  // Knee guard with a forward spike.
  const kc=u.knee[0]==='#'?[mix(u.knee,'#000000',.4),u.knee,mix(u.knee,'#ffffff',.4)]:tone(u,u.knee);
  P([[x-1+d*.6,60],[x+7+d*.6,60],[x+6+d*.6,64],[x+d*.6,64]],kc[0]);P([[x+d*.6,60],[x+6+d*.6,60],[x+5+d*.6,63],[x+1+d*.6,63]],kc[1]);P([[x+2+d*.6,61],[x+3+d*.6,57],[x+4+d*.6,61]],kc[2]);
  shade3(r,[[x+d*.8,63],[x+6+d*.8,63],[x+6+d,68],[x+d,68]],u.armor);
  // Boot with a dotted toe cap and a contrasting sole.
  const tc=tone(u,u.toe);P([[x-1+d,67],[x+7+d,67],[x+9+d,71],[x-2+d,71]],tc[0]);P([[x+d,67],[x+6+d,67],[x+8+d,70],[x-1+d,70]],tc[1]);R(x+1+d,68,1,1,u.dark[0]);R(x+3+d,68,1,1,u.dark[0]);R(x-2+d,71,11,1,u.sole);
 }
}
function arms(r,u,id,m){
 const {line:L,rect:R,poly:P}=r,{y,berserk,attack,swing,spear}=m,up=tone(u,u.arm),fore=tone(u,u.forearm),hand=tone(u,u.hand);
 const hands=berserk?[[9-swing,44+swing],[47+swing,44-swing]]:attack?[[24,47],[45,44]]:[[12,55],[44,55]];
 const elbows=berserk?[[11,40],[45,40]]:attack?[[16,48],[42,47]]:[[13,47],[43,47]];
 for(const i of [0,1]){const [sx,sy]=[i?40:16,40+y],[ex,ey]=elbows[i],[hx,hy]=hands[i];
  L(sx,sy,ex,ey,up[0],5);L(sx,sy,ex,ey-1,up[1],3);L(sx+(i?1:-1),sy,ex+(i?1:-1),ey-1,up[2]);
  L(ex,ey,hx,hy,fore[0],5);L(ex,ey,hx,hy-1,fore[1],3);
  if(id==='default'){L(ex+(i?1:-1),ey+1,hx+(i?1:-1),hy,u.accent[1]);}
  if(id==='asuka')L(ex,ey+1,hx,hy,u.dark[0]);
  if(id==='rei'||id==='mari')R(ex-1,ey-1,3,3,u.armor[1]);
  // Hands: a fist at rest, splayed claws when berserk.
  R(hx-2,hy,5,4,hand[0]);R(hx-1,hy,3,3,hand[1]);
  if(berserk)for(let k=0;k<3;k++)L(hx-2+k*2,hy+3,hx-3+k*2+(i?2:0),hy+7,hand[2]);
  if(id==='default'||id==='asuka')r.put(hx,hy+1,u.collar==='#4e3a82'?'#e84a3a':'#f0a030');
 }
 if(berserk)return;
 const [hx,hy]=hands[1];
 if(spear){// The crimson Spear of Longinus, its twin tines twisting at the tip.
  L(hx-3,71,hx+2,22,'#6a1a30',3);L(hx-2,70,hx+3,23,'#e05a74');L(hx+2,22,hx-2,12,'#b4466a',3);L(hx-2,12,hx,3,'#e0708a',2);L(hx+3,22,hx+8,12,'#b4466a',3);L(hx+8,12,hx+9,3,'#e0708a',2);R(hx-2,hy,5,4,hand[0]);return;}
 // Pallet rifle: long barrel, drum magazine and a stock tucked under the arm.
 const ry=attack?hy-1:hy+1;R(hx-6,ry,14,3,'#262c36');R(hx-6,ry,14,1,'#6a7684');R(hx+8,ry+1,5,1,'#9aa8b4');R(hx-3,ry+3,4,4,'#3a4450');R(hx-2,ry+4,2,2,'#5a6674');R(hx+3,ry-2,4,2,'#3a4450');R(hx-2,hy,5,4,hand[0]);R(hx-1,hy,3,3,hand[1]);
}
function head(r,u,id,m){
 const {poly:P,rect:R,line:L,put}=r,{y,berserk,frame,expression,blink}=m,a=u.armor,dim=blink||expression==='focused'||expression==='hurt';
 const eye=dim?(expression==='hurt'?'#f29e86':expression==='focused'?'#d9f5c6':'#5a6474'):berserk?'#ffffff':u.eye;
 if(id==='mari'){// Crown fins sweep up from the brow.
  for(const s of [-1,1]){P(shift([[28+s*2,15],[28+s*7,8],[28+s*11,3],[28+s*9,10],[28+s*6,16]],y),a[1]);L(28+s*5,12+y,28+s*10,4+y,a[3]);}P(shift([[27,13],[28,5],[29,13]],y),a[2]);R(27,12+y,3,2,'#f2ecf0');}
 if(id==='default'){// The single horn, swept forward from the forehead.
  P(shift([[26,15],[30,1],[32,2],[30,15]],y),a[1]);L(29,12+y,31,3+y,a[3]);}
 shade3(r,[[23,17],[26,12],[30,12],[33,17],[34,24],[32,31],[24,31],[22,24]],a,y);
 const jaw=berserk?[1,2,4,2][frame]:0;
 if(id==='default'){
  // Green cheek plates and the dark jaw; two slanted eyes under the brow ridge.
  for(const s of [-1,1])P(shift([[28+s*4,22],[28+s*6,21],[28+s*6,29],[28+s*4,31]],y),u.accent[1]);
  R(26,24+y,5,6+jaw,u.dark[0]);R(25,23+y,7,1,u.dark[1]);L(24,19+y,27,21+y,eye,1);L(32,19+y,29,21+y,eye,1);put(26,20+y,eye);put(30,20+y,eye);
  if(berserk){for(let x=26;x<31;x+=2){put(x,25+y,'#f2ecd6');put(x,28+y+jaw,'#f2ecd6');}}else{L(27,27+y,29,27+y,u.dark[1]);}
 }else if(id==='rei'){
  // A smooth helmet with a single glowing red eye, a green crown dome and a side disc.
  R(26,9+y,5,3,'#2a8a4a');R(27,9+y,3,1,'#7af0a0');E(r,34,19+y,3,4,u.accent[1]);E(r,34,19+y,1.5,2,u.accent[0]);
  R(25,22+y,7,8+jaw,u.dark[1]);R(26,24+y,5,4,u.dark[0]);E(r,28,20+y,2,2,dim?eye:'#7a1410');R(27,19+y,2,2,eye);
  if(berserk)for(let x=25;x<32;x+=2)put(x,28+y+jaw,'#f2ecd6');
 }else if(id==='asuka'){
  // Four eyes in two pairs over a white jaw guard.
  R(25,14+y,6,2,a[3]);for(const [x,yy]of [[24,19],[30,19],[25,22],[29,22]]){R(x,yy+y,3,2,u.dark[0]);R(x,yy+y,2,1,eye);}
  P(shift([[24,25],[32,25],[31,30+jaw],[25,30+jaw]],y),'#eceae0');for(let x=25;x<32;x+=2)put(x,27+y,'#9a9a90');
 }else{
  // A purple face plate with six green eyes clustered like a spider's.
  P(shift([[24,17],[32,17],[33,24],[31,30],[25,30],[23,24]],y),'#4a2e5a');
  for(const [x,yy]of [[25,19],[28,18],[31,19],[25,22],[28,21],[31,22]]){R(x,yy+y,2,2,'#1a1020');put(x,yy+y,eye);}
  R(25,26+y,7,4+jaw,'#2c3448');if(berserk)for(let x=25;x<32;x+=2)put(x,27+y,'#f2ecd6');
 }
}
function E(r,x,y,rx,ry,c){for(let yy=Math.floor(y-ry);yy<=y+ry;yy++)for(let xx=Math.floor(x-rx);xx<=x+rx;xx++)if(((xx+.5-x)/rx)**2+((yy+.5-y)/ry)**2<=1)r.put(xx,yy,c);}
const cache=new Map();
export function evaPixels({unit='default',frame=0,moving=false,pose='',attack=false,expression='neutral',blink=false,evolved=''}={}){
 const id=EVA_UNITS[unit]?unit:'default',f=((frame%4)+4)%4,berserk=pose==='berserk',key=[id,f,moving,pose,attack,expression,blink,evolved].join(':');if(cache.has(key))return cache.get(key);
 const u=EVA_UNITS[id],r=canvas(),step=moving?[0,2,0,-2][f]:0,bob=(moving?f%2:0)+(berserk?2:0);
 const m={y:bob,frame:f,berserk,attack:attack||pose==='ultimate',expression,blink,swing:berserk?[0,3,1,-2][f]:0,spear:evolved==='longinus'};
 pylons(r,u,id,bob);legs(r,u,id,step);torso(r,u,id,bob);arms(r,u,id,m);head(r,u,id,m);
 if(pose==='ultimate'){r.rect(26,32+bob,5,3,'#f6edbb');r.rect(27,33+bob,3,1,'#fffceb');}
 const result=selout(r.pixels,'#101018');cache.set(key,result);return result;
}
