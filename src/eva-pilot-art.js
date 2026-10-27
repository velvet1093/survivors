import {canvas,selout,mix,head,eye,mouth} from './hero-kit.js';
// The same skin tone as the pilots' swimwear bodies.
const FACE={base:'#ffe2c6',shade:'#ebb9a0',deep:'#cf8d84',light:'#fff2e4'};
// The four EVA pilots in their plugsuits. The head fits inside the pilot avatar crop
// (x 10–48, y 8–48) and the swim outfits copy it, so faces stay identical everywhere.
//  Shinji: short dark-brown hair with white A10 clips, a white-and-navy upper suit with
//   the red collar and "01", blue legs and gloves.
//  Asuka: long orange hair with the red interface headset, red suit with navy stripes,
//   a green chest band and "02".
//  Rei: pale blue bob, red eyes, white suit with navy sleeves, a green waist band and "00".
//  Mari: long brown hair in low twin tails, a blue headband, red glasses and a pink suit
//   with dark panels, a red chest gem and "08".
const PILOTS={
 default:{hair:['#20180f','#3a2a1e','#5e4634'],iris:'#4a6a9a',irisDark:'#223a5e',suit:['#9aaab0','#e4efec','#ffffff'],trim:'#1e2434',limb:['#1a4a8a','#2a70c0','#5aa0e0'],arm:['#141820','#262c3c','#3a4256'],collar:'#c03a34',hand:['#1a4a8a','#2a70c0'],clip:'#dfe8ee',num:'01'},
 asuka:{hair:['#8a3a14','#d0602a','#f09a52'],iris:'#3a78c8',irisDark:'#1a3c7a',suit:['#7a1a16','#d0302a','#f06a52'],trim:'#1a2034',limb:['#7a1a16','#d0302a','#f06a52'],arm:['#7a1a16','#d0302a','#f06a52'],collar:'#3ab0e0',hand:['#7a1a16','#d0302a'],clip:'#c42a2a',num:'02'},
 rei:{hair:['#4a64a0','#7c98d0','#b4caf0'],iris:'#c83a3a',irisDark:'#701818',suit:['#a8acbc','#eeeef0','#ffffff'],trim:'#1c2034',limb:['#a8acbc','#eeeef0','#ffffff'],arm:['#121628','#1e2440','#323a5c'],collar:'#e8e8ec',hand:['#a8acbc','#eeeef0'],clip:'#f0f0f2',num:'00'},
 mari:{hair:['#4a2a20','#7a4a36','#a8705a'],iris:'#4a8ab0',irisDark:'#22506e',suit:['#a85878','#e090b0','#f6bcd2'],trim:'#3a1a2c',limb:['#a85878','#e090b0','#f6bcd2'],arm:['#3a1a2c','#5a2a42','#7a4a60'],collar:'#2a3a7a',hand:['#a85878','#e090b0'],clip:'#4a5ab0',num:'08'},
};
// Native-resolution digits, 3×4 each.
const DIGITS={'0':['111','101','101','111'],'1':['010','110','010','111'],'2':['111','001','110','111'],'8':['111','111','101','111']};
function digits(r,x,y,text,c){[...text].forEach((d,i)=>DIGITS[d].forEach((row,yy)=>[...row].forEach((b,xx)=>{if(b==='1')r.put(x+i*4+xx,y+yy,c);})));}
function hairBack(r,id,P){
 const {poly:p,line:L,rect:R}=r,H=P.hair;
 if(id==='asuka'){p([[15,18],[41,18],[44,40],[46,56],[40,54],[38,40],[18,40],[16,54],[10,56],[12,40]],H[0]);p([[16,22],[40,22],[42,40],[43,52],[40,50],[37,36],[19,36],[16,50],[13,52],[14,40]],H[1]);L(14,30,12,50,H[2]);L(42,30,44,50,H[2]);}
 else if(id==='mari'){for(const s of [-1,1]){const x=28+s*12;p([[x-3,26],[x+3,26],[x+3+s*2,52],[x+s*2,56],[x-3+s*2,52]],H[0]);p([[x-2,27],[x+2,27],[x+2+s*2,51],[x-2+s*2,51]],H[1]);L(x,30,x+s*2,50,H[2]);}}
 else if(id==='rei')p([[15,18],[41,18],[42,34],[38,36],[18,36],[14,34]],H[0]);
 else p([[15,18],[41,18],[41,32],[15,32]],H[0]);
}
function hairFront(r,id,P){
 const {poly:p,line:L,rect:R,put}=r,H=P.hair;
 if(id==='default'){// Short and messy with a pointed fringe.
  p([[15,30],[14,20],[18,13],[26,10],[34,11],[40,17],[41,28],[38,24],[36,27],[34,22],[31,26],[28,21],[25,26],[22,22],[19,27],[18,32]],H[1]);
  for(const [x0,y0,x1,y1]of [[19,15,25,12],[28,12,34,14],[22,18,21,23],[33,18,35,23]])L(x0,y0,x1,y1,H[2]);
  for(const x of [15,38]){R(x,19,3,4,P.clip);R(x+1,20,1,2,'#9ab4c4');}
 }else if(id==='asuka'){// Thick fringe and the red headset pods above each temple.
  p([[15,30],[14,21],[18,13],[26,10],[34,11],[40,16],[41,28],[38,23],[35,26],[33,20],[29,25],[27,19],[24,25],[21,21],[19,28],[18,33]],H[1]);
  for(const [x0,y0,x1,y1]of [[19,15,25,12],[28,12,35,14],[17,22,16,30],[39,22,40,30]])L(x0,y0,x1,y1,H[2]);
  for(const x of [15,37]){p([[x,17],[x+2,12],[x+4,12],[x+5,17],[x+4,20],[x+1,20]],'#8a1a1a');R(x+1,14,3,4,P.clip);R(x+2,13,1,2,'#f06a5a');}
 }else if(id==='rei'){// Short bob that curls in at the jaw.
  p([[15,32],[14,21],[18,14],[26,11],[34,12],[40,18],[41,32],[38,34],[37,24],[34,22],[31,26],[28,21],[25,25],[22,22],[19,26],[18,34]],H[1]);
  for(const [x0,y0,x1,y1]of [[19,16,25,13],[28,13,34,15],[16,22,16,30],[39,22,39,30]])L(x0,y0,x1,y1,H[2]);
  for(const x of [16,37]){R(x,18,3,3,P.clip);R(x+1,19,1,1,'#b8bcc8');}
 }else{// Side-swept fringe under a blue headband.
  p([[15,30],[14,21],[18,14],[26,11],[34,12],[40,18],[41,29],[38,24],[35,22],[31,24],[27,20],[24,24],[21,21],[19,27],[18,32]],H[1]);
  L(16,17,22,12,P.clip,2);L(22,12,34,12,P.clip,2);L(34,12,40,17,P.clip,2);L(20,13,33,12,'#8a9ae0');
  for(const [x0,y0,x1,y1]of [[17,21,16,29],[39,21,40,29],[25,15,29,14]])L(x0,y0,x1,y1,H[2]);
 }
}
function suit(r,id,P){
 const {poly:p,rect:R,line:L,put}=r,S=P.suit,T=P.trim,G=P.limb;
 // Legs and boots.
 for(const x of [21,30]){p([[x,53],[x+6,53],[x+6,68],[x,68]],G[0]);R(x+1,54,4,13,G[1]);L(x+1,55,x+1,66,G[2]);R(x-1,67,8,4,G[0]);R(x,67,6,1,G[1]);R(x-1,70,8,1,T);
  if(id!=='default'){L(x+(x<28?0:5),55,x+(x<28?0:5),64,T);}if(id==='rei'||id==='mari')R(x+1,60,4,1,T);}
 // Torso: fitted chest, waist and hips.
 p([[20,38],[36,38],[37,46],[35,53],[21,53],[19,46]],S[0]);p([[21,39],[35,39],[36,46],[34,52],[22,52],[20,46]],S[1]);L(22,40,22,50,S[2]);
 if(id==='default'){// Blue lower half of Shinji's suit with navy side panels.
  p([[21,47],[35,47],[34,53],[22,53]],G[1]);L(21,47,35,47,T);R(20,42,2,10,T);R(35,42,2,10,T);put(28,44,P.collar);put(28,45,P.collar);}
 if(id==='asuka'){p([[22,39],[28,43],[34,39],[34,41],[28,45],[22,41]],'#8ac040');L(22,41,28,45,'#f0c040');L(28,45,34,41,'#f0c040');R(20,42,2,10,T);R(35,42,2,10,T);}
 if(id==='rei'){R(21,48,15,2,'#2a8a5a');R(27,44,3,3,'#1a1a20');put(28,45,'#5a5a6a');R(20,40,2,8,T);R(35,40,2,8,T);}
 if(id==='mari'){p([[22,40],[26,41],[25,45]],'#ffffff');p([[34,40],[30,41],[31,45]],'#ffffff');p([[27,43],[29,43],[28,47]],'#d0302a');for(const x of [21,34])L(x,42,x+(x<28?2:-2),52,T);}
 digits(r,25,40,P.num,T);
 // Collar ring.
 R(24,36,9,3,P.collar);R(25,36,7,1,mix(P.collar,'#ffffff',.4));
 // Arms and gloves.
 for(const [sx,hx]of [[19,15],[37,41]]){const A=P.arm;L(sx,40,hx,51,A[0],5);L(sx,40,hx,50,A[1],3);L(sx+(sx<28?-1:1),40,hx+(sx<28?-1:1),49,A[2]);
  R(hx-2,38,5,4,S[1]);R(hx-1+(sx<28?1:-1),38,3,1,S[2]);if(id!=='rei')put(hx,39,T);else R(hx-1,39,3,1,'#e86a3a');
  R(hx-2,51,5,4,P.hand[0]);R(hx-1,51,3,3,P.hand[1]);if(id==='default')R(hx-2,50,5,1,'#f0a030');}
}
const cache=new Map();
export function pilotSuitPixels(id,{expression='neutral',blink=false}={}){
 id=PILOTS[id]?id:'default';const key=[id,expression,blink].join(':');if(cache.has(key))return cache.get(key);
 const P=PILOTS[id],r=canvas();
 hairBack(r,id,P);suit(r,id,P);head(r,0,{skin:FACE});
 const hurt=expression==='hurt',focus=expression==='focused'||expression==='ultimate';
 for(const [x,side]of [[21,-1],[31,1]])eye(r,x,26,{iris:P.iris,irisDark:P.irisDark,side,closed:blink,hurt,focus,lash:mix(P.hair[0],'#000000',.3)});
 mouth(r,34,expression,{lip:'#c07a70'});
 if(id==='mari'){// Red half-rim glasses.
  const {line:L,put}=r;for(const x of [20,30]){L(x,26,x+5,26,'#c42a2a');L(x,26,x,31,'#c42a2a');L(x+5,26,x+5,31,'#c42a2a');L(x,31,x+5,31,'#c42a2a');}L(25,28,30,28,'#c42a2a');put(21,27,'#ffffff');put(31,27,'#ffffff');}
 hairFront(r,id,P);
 const result=selout(r.pixels,'#1a1a24');cache.set(key,result);return result;
}
