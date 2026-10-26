import {buildHero,torso,casual,pajamas,swim,yukata,emblem,longHairBack,fringe,mix,SKIN} from './hero-builder.js';
import {canvas,motion,eye,mouth,limb,selout,lid,brow,tear} from './hero-kit.js';
import {skinFor} from './skins.js';
// Shinji fights as an Evangelion; the pilot appears in portraits. Every skin carries
// the unit palette (armor, shade, light, neon) and the pilot's hair and plugsuit colour.
// Unit heads: EVA-01 single horn, EVA-02 four eyes and fins, EVA-00 a single cyclops
// eye, EVA-08 a visor with side horns.
const INK='#1c2030',LONGINUS='#b4466a';
const unitOf=look=>look.unit||({asuka:'EVA-02',rei:'EVA-00',mari:'EVA-08'}[look.evaBase]||'EVA-01');
function evaPixels({frame=0,moving=false,pose='',attack=false,expression='neutral',blink=false,skin='default',evolved=''}={}){
 const look=skinFor('shinji',skin),unit=unitOf(look),{armor:A,shade:S,light:L,neon:N}=look,f=((frame%4)+4)%4;
 const r=canvas(),{walk,y:bob}=motion({frame,moving}),y=bob-3,{poly,rect,line,put}=r,rage=pose==='berserk',cast=!!pose&&!rage,focus=expression==='focused'||expression==='ultimate'||cast,dark=mix(S,'#000000',.35);
 // Long armoured legs with knee plates and pointed feet.
 for(const [i,x]of [21,31].entries()){const d=i?walk:-walk;rect(x+d-1,51,7,17,S);rect(x+d,51,5,16,A);line(x+d+1,52,x+d+1,64,L);rect(x+d,58,5,2,N);poly([[x+d-2,67],[x+d+6,67],[x+d+7,71],[x+d-2,71]],dark);}
 // Slim torso with a neon-trimmed chest plate and the unit number cluster.
 poly([[18,36+y],[38,36+y],[35,44+y],[32,48],[33,53],[23,53],[24,48],[21,44+y]],S);poly([[19,37+y],[37,37+y],[34,44+y],[31,48],[32,52],[24,52],[25,48],[22,44+y]],A);
 poly([[22,38+y],[34,38+y],[32,43+y],[24,43+y]],N);poly([[23,38+y],[33,38+y],[31,42+y],[25,42+y]],L);line(28,43+y,28,48,S);
 rect(25,45+y,2,2,N);rect(29,45+y,2,2,N);rect(23,50,10,3,dark);rect(26,50,4,2,N);
 // Shoulder pylons.
 for(const x of [12,36]){poly([[x,37+y],[x+8,35+y],[x+8,42+y],[x+2,44+y]],S);poly([[x+1,38+y],[x+7,36+y],[x+7,41+y],[x+2,43+y]],A);line(x+2,38+y,x+6,37+y,N);}
 // Arms: rifle held across the body; berserk claws alternate each frame.
 const arm=(x0,y0,x1,y1)=>{line(x0,y0,x1,y1,S,5);line(x0,y0,x1,y1,A,3);rect(x1-2,y1,5,4,dark);};
 if(cast){arm(17,42+y,10,26+y);arm(39,42+y,46,26+y);for(const x of [6,50])for(let i=0;i<3;i++)r.line(x,20+y+i*4,x,22+y+i*4,mix(N,'#ffffff',.4));}
 else if(rage){const lift=[0,-6,-2,-8][f];arm(17,42+y,9,30+lift);arm(39,42+y,47,34-lift);for(const [x,yy]of [[9,30+lift],[47,34-lift]])for(const dx of [-2,0,2])line(x+dx,yy,x+dx,yy-3,L);}
 else{arm(17,42+y,15,54);arm(39,42+y,attack?44:41,attack?46+y:54);
  if(evolved==='longinus'){line(44,62,46,14+y,LONGINUS,2);poly([[44,16+y],[42,8+y],[45,12+y],[46,6+y],[47,12+y],[50,8+y],[48,16+y]],LONGINUS);line(45,60,46,16+y,mix(LONGINUS,'#ffffff',.35));}
  else{const gx=attack?44:38,gy=attack?44+y:52;rect(gx,gy,14,4,'#5c6470');rect(gx+1,gy,12,1,'#8a94a0');rect(gx+3,gy+4,3,4,'#3a404a');rect(gx+13,gy+1,2,2,'#2a2e36');if(attack){rect(gx+15,gy,3,3,'#fff3a8');put(gx+18,gy+1,'#ffd96a');}}}
 // Head by unit.
 rect(26,31+y,4,6,dark);
 poly([[23,12+y],[33,12+y],[36,19+y],[35,26+y],[32,30+y],[24,30+y],[21,26+y],[20,19+y]],S);poly([[24,13+y],[32,13+y],[35,19+y],[34,25+y],[31,29+y],[25,29+y],[22,25+y],[21,19+y]],A);
 line(25,14+y,31,14+y,L);line(22,19+y,23,25+y,L);
 if(unit==='EVA-01'){poly([[27,15+y],[28,3+y],[30,15+y]],N);line(28,5+y,28,14+y,L);for(const [x,d]of [[22,1],[31,-1]]){rect(x,20+y,4,2,blink?S:'#f3f6a0');put(d>0?x:x+3,19+y,blink?S:'#f3f6a0');}}
 else if(unit==='EVA-02'){for(const x of [16,36])poly([[x+2,18+y],[x,10+y],[x+4,17+y]],S);for(const [x,yy]of [[22,18],[31,18],[23,22],[30,22]])rect(x,yy+y,3,2,blink?S:'#a8f0a0');}
 else if(unit==='EVA-00'){rect(24,17+y,8,7,dark);rect(25,18+y,6,5,blink?S:'#f6c26a');rect(27,19+y,2,2,'#ffffff');}
 else{poly([[16,16+y],[19,8+y],[22,15+y]],N);poly([[40,16+y],[37,8+y],[34,15+y]],N);rect(21,18+y,14,4,dark);rect(22,19+y,12,2,blink?S:'#9ff0e0');}
 if(focus&&!blink)for(let x=20;x<37;x++)if(r.pixels[(18+y)*56+x])r.put(x,18+y,S);
 if(focus&&!blink)r.put(28,21+y,'#ffffff');
 // Jaw: armoured muzzle below the helmet; opens with teeth in a berserk frenzy.
 if(rage||cast||expression==='hurt'){poly([[23,27+y],[33,27+y],[32,34+y+(f%2)],[24,34+y+(f%2)]],'#3a1e26');for(let x=24;x<33;x+=2){put(x,27+y,'#f1e8d8');put(x,33+y+(f%2),'#f1e8d8');}}
 else{poly([[24,27+y],[32,27+y],[31,33+y],[25,33+y]],S);poly([[25,27+y],[31,27+y],[30,32+y],[26,32+y]],N);line(26,30+y,30,30+y,dark);}
 const id=look.id||'default';
 if(id==='casual'){rect(20,35+y,16,3,'#2b3448');rect(31,36+y,4,9,'#2b3448');line(19,37+y,36,52,'#5a4a3a',2);rect(36,50,6,7,'#5a4a3a');rect(37,51,4,2,'#8a7454');}
 else if(id==='pajamas'){poly([[21,15+y],[35,15+y],[33,8+y],[26,4+y],[16,8+y],[12,14+y]],'#e9e3d6');rect(21,13+y,15,3,'#bfc8d6');rect(10,13+y,4,4,'#ffffff');
  // Pen Pen tucked under the arm.
  poly([[8,50],[14,50],[15,58],[13,62],[9,62],[7,58]],'#2a3550');poly([[9,53],[13,53],[13,60],[9,60]],'#f4f1ea');for(const x of [9,12])r.put(x,52,'#ffffff');rect(10,54,2,1,'#f0a14a');rect(8,62,2,1,'#f0a14a');rect(12,62,2,1,'#f0a14a');}
 else if(id==='swimsuit'){poly([[15,46+y],[41,46+y],[43,50+y],[41,54],[15,54],[13,50+y]],'#f06a5a');for(const x of [18,28,37])rect(x,46+y,3,8,'#ffffff');}
 else if(/-swimsuit$/.test(id)){rect(20,14+y,16,3,'#2a2e36');rect(22,14+y,4,3,'#bfeaf5');rect(30,14+y,4,3,'#bfeaf5');}
 else if(/-bathsuit$/.test(id)){poly([[21,14+y],[35,14+y],[37,9+y],[28,6+y],[19,9+y]],'#ffffff');for(const x of [22,27,32])rect(x,10+y,2,2,N);}
 return selout(r.pixels,INK);
}
// ---- Pilots ----
const PILOT={
 Shinji:{suit:'#e7eddf',shade:'#9eafb7',light:'#f8f5e6',iris:'#50768c',hair:'short'},
 Asuka:{suit:'#cb6557',shade:'#8f3c49',light:'#f08c6e',iris:'#4782ac',hair:'long'},
 Rei:{suit:'#eceddf',shade:'#a4bbc4',light:'#fff7e9',iris:'#bd667a',hair:'bob'},
 Mari:{suit:'#cb84a7',shade:'#914f7e',light:'#eeb2c7',iris:'#639d8b',hair:'braids',glasses:true},
};
function pilotHair(r,c,kind,h){
 const y=c.y,{poly,line,rect}=r;
 if(kind==='long')longHairBack(r,c,h,{length:54});
 if(kind==='braids')for(const x of [16,39]){line(x,24+y,x-1,50,h.s,4);for(const yy of [31,36,41,46]){rect(x-2,yy,3,3,h.h);rect(x,yy+1,2,2,h.l);}}
 poly([[15,24+y],[17,13+y],[23,8+y],[33,8+y],[39,13+y],[41,24+y],[40,32+y],[16,32+y]],h.s);
}
function pilotFront(r,c,kind,h,p){
 const y=c.y;
 fringe(r,c,h,{style:kind==='short'?'choppy':kind==='bob'?'straight':'choppy',locks:kind==='bob'?36:33});
 // Asuka's red interface clips; Mari's glasses.
 if(kind==='long')for(const x of [15,38]){r.rect(x,15+y,4,4,'#a74049');r.put(x+1,16+y,'#f08c6e');}
 if(p.glasses&&!c.blink)for(const x of [20,30]){r.line(x,25+y,x+5,25+y,'#a65070');r.line(x,31+y,x+5,31+y,'#a65070');r.line(x,25+y,x,31+y,'#a65070');r.line(x+5,25+y,x+5,31+y,'#a65070');}
}
function plugsuit(r,c,p,unitNum){
 const b=torso(r,c,{color:p.suit,shade:p.shade,light:p.light,bottom:54});
 r.poly([[22,b.t+1+c.y],[28,b.t+4+c.y],[34,b.t+1+c.y],[32,b.t+6+c.y],[24,b.t+6+c.y]],p.shade);r.rect(26,45,5,7,'#537e9b');r.rect(27,46,3,2,'#dde3ca');
 r.rect(24,42+c.y,2,2,INK);r.rect(30,42+c.y,2,2,INK);
 return {sleeve:p.suit,sleeveLight:p.light,cuff:INK,legs:p.suit,legShade:p.shade,legLight:p.light,legTop:54,boots:64,shoe:INK,shoeLight:p.shade,
  afterHead(r,c){r.rect(23,37+c.y,10,2,INK);r.rect(26,38+c.y,4,1,p.light);}};
}
function pilotGarment(look){
 const id=look.id;
 if(id==='casual')return (r,c)=>casual(r,c,{top:'tee',color:'#f3f1ea',bottom:'jeans',bottomColor:'#2b3448',motif:(r,c)=>{r.rect(26,44+c.y,4,2,'#50768c');}});
 if(id==='pajamas')return (r,c)=>pajamas(r,c,{color:'#6f8fb8',trim:'#f3f1ea',motif:(r,c)=>{r.rect(22,45,3,4,'#1c2030');r.rect(23,46,1,2,'#ffffff');r.put(23,49,'#f0a14a');}});
 if(id==='swimsuit')return (r,c)=>swim(r,c,{style:'trunks',color:'#3b84c4',accent:'#f3f1ea'});
 if(/-swimsuit$/.test(id))return (r,c)=>swim(r,c,{style:id.startsWith('mari')?'swimdress':'onepiece',color:look.suit,accent:look.neon});
 if(/-bathsuit$/.test(id))return (r,c)=>yukata(r,c,{color:look.suit,obi:look.neon,collar:'#ffffff',pattern:(r,x,y)=>emblem.flower(r,x,y,'#ffffff',look.neon)});
 return null;
}
// Each pilot keeps their own face: Shinji's worried brows and small frown, Asuka's
// fierce brows and smirk, Rei's blank half-lidded calm, Mari's wide cat grin.
function pilotFace(r,c,name,p){
 const y=c.y,e=c.expression,hurt=e==='hurt',focus=e==='focused'||e==='ultimate',lip='#a57579';
 for(const [x,side]of [[21,-1],[31,1]])eye(r,x,26+y,{iris:p.iris,irisDark:mix(p.iris,'#141824',.5),lash:INK,side,closed:c.blink,hurt,focus});
 const brows=tilt=>{if(!c.blink)for(const [x,side]of [[21,-1],[31,1]])brow(r,x,24+y,{color:INK,side,tilt});};
 if(name==='Shinji'){brows(focus?1:-1);if(hurt)for(const x of [22,34])tear(r,x,31+y);
  if(e==='neutral'){r.rect(27,35+y,3,1,lip);r.put(26,36+y,lip);r.put(30,36+y,lip);}else mouth(r,34+y,e,{lip});return;}
 if(name==='Asuka'){brows(1);
  if(e==='neutral'){r.rect(26,34+y,4,1,lip);r.put(30,33+y,lip);r.put(29,34+y,'#ffffff');}
  else if(e==='ultimate'){r.rect(25,34+y,6,3,'#7a3040');r.rect(25,34+y,6,1,'#fff4ec');}else mouth(r,34+y,e,{lip});return;}
 if(name==='Rei'){if(!c.blink&&!hurt)for(const [x,side]of [[21,-1],[31,1]])lid(r,x,26+y,{lash:INK,rows:1,side});
  if(e==='neutral'||e==='focused')r.rect(27,34+y,2,1,mix(lip,'#fde1c9',.35));else mouth(r,34+y,e,{lip});return;}
 if(e==='neutral'){for(const [x,yy]of [[25,33],[26,34],[27,34],[28,34],[29,34],[30,34],[31,33]])r.put(x,yy+y,lip);r.rect(27,35+y,3,1,'#c9848c');}
 else mouth(r,34+y,e,{lip});
}
export function pilotPixels(opts={}){
 const look=skinFor('shinji',opts.skin||'default'),name=look.pilot||'Shinji',p=PILOT[name]||PILOT.Shinji;
 const hairCol=look.hair,h={h:hairCol,s:mix(hairCol,'#000000',.35),l:mix(hairCol,'#ffffff',.3)};
 const garment=pilotGarment(look)||((r,c)=>plugsuit(r,c,{...p,suit:look.suit||p.suit}));
 return buildHero({build:'petite',ink:INK,eyes:{iris:p.iris}},{back:(r,c)=>pilotHair(r,c,p.hair,h),garment,face:(r,c)=>pilotFace(r,c,name,p),front:(r,c)=>pilotFront(r,c,p.hair,h,p)},opts);
}
export function shinjiPixels(opts={}){return evaPixels(opts);}
