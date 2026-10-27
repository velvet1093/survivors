import {canvas,motion,eye,mouth,blush,head,limb,selout,mix,SKIN} from './hero-kit.js';
// Kurumi Tokisaki. Every outfit shares one petite skeleton, the red/gold
// heterochromia and the flintlock pair; hair styles and garments change per skin.
const INK='#241c2b';
const HAIR={hair:'#2d2a3a',shade:'#1b1925',light:'#4b4662',sheen:'#736c92'};
export const WHITE_QUEEN_COLORS={hair:'#d2d5dc',hairShade:'#7f8492',hairLight:'#f4f5f3',dress:'#e9e9e7',dressShade:'#b7bbc6',trim:'#777a8c',lining:'#343541',silver:'#bfc7d7',lace:'#fbfbf7'};
const QUEEN_HAIR={hair:WHITE_QUEEN_COLORS.hair,shade:WHITE_QUEEN_COLORS.hairShade,light:WHITE_QUEEN_COLORS.hairLight,sheen:'#ffffff'};
const RED='#b85160',RED_DARK='#7a2f45',RED_LIGHT='#e17d7f',GOLD='#d9b45f',GOLD_DARK='#9c7334';
const ASTRAL={mid:'#e0563f',dark:'#a3332e',light:'#f48a66'};
// hair: twintails | loose | low | lowlong | bun | side. eye: clock | patch | hidden.
const OUTFITS={
 default:{hair:'twintails',eye:'clock',band:'headdress'},
 gothic:{hair:'loose',eye:'patch',band:'rose'},
 crimson:{hair:'low',eye:'hidden',band:'roseclips'},
 school:{hair:'lowlong',eye:'hidden',band:'lowties'},
 whitequeen:{hair:'twintails',eye:'clock',band:'crown',palette:QUEEN_HAIR},
 casual:{hair:'twintails',eye:'clock',band:'ribbons'},
 pajamas:{hair:'loose',eye:'clock',band:'nightcap'},
 swimsuit:{hair:'side',eye:'clock',band:'rose'},
 cuteswim:{hair:'twintails',eye:'clock',band:'bows'},
 bathsuit:{hair:'bun',eye:'clock',band:'pin'},
};
export const KURUMI_OUTFIT_IDS=Object.keys(OUTFITS);
export const KURUMI_COLORS={...HAIR,red:RED,astral:ASTRAL.mid,gold:GOLD,iris:'#ba4b64',patch:'#f2efed',barrel:'#c6c7bd'};

function backHair(r,style,h,walk,y){
 const {poly,line}=r;
 // Mass behind the head and shoulders.
 poly([[15,24+y],[17,13+y],[23,8+y],[33,8+y],[39,13+y],[41,24+y],[40,36+y],[16,36+y]],h.shade);
 if(style==='twintails'){
  // Kurumi's uneven twin tails flare out from high ties; the viewer-left tail is longer.
  for(const [x,side,len]of [[18,-1,62],[38,1,54]]){const s=walk*side*.8,o=x+side*10;
   poly([[x,10+y],[x+side*5,13+y],[o+side*2,24+y],[o+side*2+s,36],[o+s,len-8],[o-side*2+s,len],[o-side*5+s,len-6],[o-side*4,34],[x+side*2,20+y]],h.shade);
   poly([[x,12+y],[x+side*4,14+y],[o+side,25+y],[o+side+s,36],[o-side+s,len-8],[o-side*2+s,len-3],[o-side*4+s,len-8],[o-side*3,33],[x+side*2,21+y]],h.hair);
   line(x+side*4,16+y,o+s,36,h.light);line(o-side+s,38,o-side*2+s,len-8,h.sheen);line(o-side*3,30,o-side*3+s,len-10,h.shade);
  }
 }else if(style==='loose'||style==='side'){
  poly([[14,22+y],[17,12+y],[39,12+y],[42,22+y],[43+walk*.4,54],[38,58],[33,50],[23,50],[18,58],[13+walk*.4,54]],h.shade);
  poly([[15,22+y],[18,14+y],[38,14+y],[41,22+y],[41+walk*.4,52],[38,55],[34,47],[22,47],[18,55],[15+walk*.4,52]],h.hair);
  line(16,26,15+walk*.4,50,h.light);line(40,26,41+walk*.4,50,h.light);line(17,36,17+walk*.4,52,h.sheen);
  if(style==='side'){poly([[38,18+y],[44,22+y],[47+walk,40],[44+walk,54],[40,50],[40,30]],h.shade);poly([[39,20+y],[43,24+y],[45+walk,40],[43+walk,51],[41,46],[41,30]],h.hair);line(42,26,44+walk,46,h.sheen);}
 }else if(style==='low'){
  for(const [x,side]of [[18,-1],[38,1]]){const s=walk*side*.6;poly([[x-3,30],[x+3,30],[x+side*4+s,48],[x+side*2+s,62],[x-side*3+s,58],[x-side*2,42]],h.shade);poly([[x-2,31],[x+2,31],[x+side*3+s,48],[x+side*1+s,59],[x-side*2+s,55],[x-side,42]],h.hair);line(x,34,x+side*2+s,54,h.light);}
 }else if(style==='lowlong'){
  // Very long low twin tails gathered behind the ears and falling past the knees.
  for(const [x,side]of [[17,-1],[39,1]]){const s=walk*side*.7;
   poly([[x-side*2,22+y],[x+side*3,22+y],[x+side*6,38],[x+side*7+s,54],[x+side*5+s,65],[x+side*2+s,69],[x+s,63],[x-side+s,50],[x-side*2,36]],h.shade);
   poly([[x-side,24+y],[x+side*2,24+y],[x+side*5,38],[x+side*6+s,54],[x+side*4+s,63],[x+side*2+s,66],[x+side+s,60],[x+s,49],[x-side,36]],h.hair);
   line(x+side*2,28+y,x+side*4+s,58,h.light);line(x+side*3,34,x+side*5+s,52,h.sheen);
  }
 }else if(style==='bun'){
  poly([[22,8+y],[26,3+y],[32,3+y],[35,8+y],[33,12+y],[24,12+y]],h.shade);poly([[23,8+y],[26,4+y],[31,4+y],[34,8+y],[31,11+y],[25,11+y]],h.hair);line(25,6+y,30,5+y,h.light);
 }
}
// Fringe with pointed clumps and long side locks that frame the jaw.
function frontHair(r,eyeMode,h,y){
 const {poly,line,rect}=r;
 poly([[16,30+y],[15,20+y],[19,12+y],[27,9+y],[35,11+y],[40,18+y],[41,30+y],[38,40+y],[36,27+y],[34,22+y],[31,25+y],[29,21+y],[26,25+y],[23,21+y],[21,26+y],[20,40+y],[17,38+y]],h.shade);
 poly([[17,28+y],[17,20+y],[20,14+y],[27,11+y],[34,13+y],[38,18+y],[39,28+y],[37,24+y],[34,20+y],[31,23+y],[29,19+y],[26,23+y],[23,19+y],[21,24+y],[19,30+y]],h.hair);
 line(21,15+y,26,13+y,h.light);line(28,13+y,33,14+y,h.light);rect(23,14+y,3,1,h.sheen);
 line(18,24+y,18,37+y,h.hair);line(38,24+y,38,37+y,h.hair);line(19,27+y,19,34+y,h.light);
 if(eyeMode!=='clock'){
  // A long swept clump falls over her left (viewer-right) eye.
  poly([[29,19+y],[34,18+y],[39,22+y],[39,32+y],[37,33+y],[35,28+y],[31,25+y],[29,22+y]],h.shade);
  poly([[30,20+y],[34,20+y],[38,23+y],[38,30+y],[35,27+y],[31,24+y]],h.hair);line(33,21+y,37,27+y,h.light);
 }
}
function accessory(r,band,y,walk){
 const {poly,rect,line,put}=r;
 if(band==='headdress'){
  // Black lace headdress with red ruffles and a small gold clasp.
  poly([[17,13+y],[22,8+y],[34,8+y],[39,13+y],[36,15+y],[28,12+y],[20,15+y]],'#1b1522');
  for(let i=0;i<6;i++){const x=17+i*4,yy=13-Math.round(Math.sin((i+.5)*Math.PI/6)*5)+y;rect(x,yy,4,3,ASTRAL.dark);rect(x,yy,3,2,ASTRAL.mid);put(x+1,yy,ASTRAL.light);}
  rect(27,9+y,3,2,ASTRAL.dark);
  // Short red ribbons trail from the headdress beside each tail tie.
  for(const x of [17,38]){line(x,14+y,x,20+y,ASTRAL.dark);put(x,21+y,ASTRAL.mid);}
 }else if(band==='rose'||band==='roseclips'){
  const spots=band==='rose'?[[16,14]]:[[17,30],[38,30]];
  for(const [x,yy]of spots){rect(x,yy+y,5,5,'#7d2e44');rect(x+1,yy+y,3,4,'#b94e64');put(x+2,yy+1+y,'#e48a92');put(x+1,yy+2+y,'#7d2e44');rect(x-1,yy+4+y,2,2,'#4d6a4d');}
 }else if(band==='ribbons'){
  for(const x of [13,40]){poly([[x,14+y],[x+3,12+y],[x+3,17+y]],RED);poly([[x+6,14+y],[x+3,12+y],[x+3,17+y]],RED_DARK);rect(x+2,13+y,2,3,RED_LIGHT);}
 }else if(band==='lowties'){
  // Small red ties where the low tails gather below her ears.
  for(const x of [14,40]){rect(x,30+y,3,2,RED_DARK);put(x+1,30+y,RED);}
 }else if(band==='bows'){
  for(const x of [12,40]){poly([[x,11+y],[x+3,14+y],[x,17+y]],'#d27a96');poly([[x+7,11+y],[x+4,14+y],[x+7,17+y]],'#a24b6c');rect(x+3,13+y,2,3,'#f2b3c6');}
 }else if(band==='crown'){
  // A small silver tiara of four points set slightly off-centre, and white ribbon ties on the tails.
  const c=WHITE_QUEEN_COLORS;rect(19,9+y,18,3,c.silver);rect(19,11+y,18,1,c.trim);
  for(let i=0;i<4;i++){const x=19+i*4.5,tall=i===1||i===2?5:3;poly([[x,9+y],[x+2,9-tall+y],[x+4,9+y]],c.silver);put(x+2,10-tall+y,c.lace);rect(x+1,7+y,2,2,c.lace);}
  rect(26,9+y,4,2,'#a8b4cc');put(27,9+y,'#ffffff');
  for(const x of [14,39]){poly([[x,12+y],[x+2,14+y],[x,16+y]],c.lace);poly([[x+5,12+y],[x+3,14+y],[x+5,16+y]],c.dressShade);rect(x+2,13+y,2,2,c.trim);}
 }else if(band==='nightcap'){
  poly([[16,15+y],[22,6+y],[33,5+y],[42,10+y],[46+walk*.5,20+y],[40,15+y],[34,12+y],[22,14+y]],'#6e3248');poly([[18,14+y],[23,8+y],[32,7+y],[40,11+y],[38,13+y],[30,10+y],[22,13+y]],'#9b4a63');
  rect(16,14+y,25,2,'#f1e2d6');rect(44+Math.round(walk*.5),19+y,4,4,'#f1e2d6');
 }else if(band==='pin'){
  line(30,5+y,37,1+y,GOLD);rect(36,0+y,3,2,'#c74d63');rect(20,6+y,3,3,'#c74d63');put(21,6+y,'#f0a0a8');
 }
}
function eyePatch(r,y){
 // Small white patch tucked under the fringe; only its lower edge peeks out.
 const {rect,line}=r;rect(31,28+y,5,3,'#f2efed');line(31,30+y,35,30+y,'#c8c1cb');
}
// Flintlock pistol (right hand) and long musket (left hand).
function flintlock(r,x,y,{raised=false,flash=false}={}){
 const {rect,put,line}=r;
 if(raised){rect(x,y,9,2,'#3d3441');rect(x+2,y,7,1,'#6c6070');rect(x-1,y+1,3,4,'#7a4b34');rect(x+4,y+2,1,1,GOLD);put(x+9,y,GOLD);if(flash){rect(x+10,y-1,3,3,'#ffe9a8');put(x+13,y,'#ffc66d');}}
 else{rect(x,y,2,8,'#3d3441');rect(x,y,1,7,'#8a7f90');rect(x-1,y-1,2,3,'#7a4b34');put(x+1,y+3,GOLD);put(x,y+8,GOLD);}
}
function musket(r,x,y,{aim=false}={}){
 const {line,rect}=r;
 if(aim){line(x,y,x-14,y-14,'#5a4134',2);line(x-6,y-6,x-15,y-15,'#c6c7bd',1);rect(x-1,y-1,3,3,'#7a4b34');}
 else{line(x+2,y-6,x,y+2,'#7a4b34',2);line(x,y+2,x-6,y+20,'#4a4048',2);line(x-1,y+3,x-6,y+19,'#c6c7bd',1);rect(x,y,2,2,GOLD);}
}

// Garment painters. `w` is the walk offset, `y` the body bob.
function legsAndShoes(r,o,w){
 const {rect}=r;
 const leg=o.legs||'#1d1824',legLight=o.legLight||mix(leg,'#ffffff',.18),shoe=o.shoe||'#2a1f2c',shoeLight=o.shoeLight||mix(shoe,'#ffffff',.3);
 for(const [i,x]of [22,30].entries()){const d=i?w:-w;
  rect(x+d,54,5,13,leg);rect(x+d+1,55,1,10,legLight);if(o.lace)for(let yy=57;yy<66;yy+=3){r.put(x+d+1,yy,o.lace);r.put(x+d+3,yy,o.lace);r.put(x+d+2,yy+1,o.lace);}if(o.garter)rect(x+d,o.garter,5,1,o.garterColor||RED);
  if(o.boots){rect(x+d-1,o.boots,7,71-o.boots,shoe);rect(x+d,o.boots,1,71-o.boots-1,shoeLight);if(o.laces)for(let yy=o.boots+1;yy<69;yy+=2)rect(x+d+2,yy,2,1,o.laces);rect(x+d-1,70,7,1,mix(shoe,'#000000',.45));if(o.platform){rect(x+d-1,68,7,2,mix(shoe,'#000000',.25));rect(x+d-1,68,7,1,o.platform);}}
  else{rect(x+d-1,67,7,4,shoe);rect(x+d,67,4,1,shoeLight);rect(x+d-1,70,7,1,mix(shoe,'#000000',.45));if(o.strap)rect(x+d,68,5,1,o.strap);}
 }
}
function frilledSkirt(r,w,{top=48,bottom=62,flare=9,dark,mid,light,frill,frillShade,tiers=2}){
 const {poly,line,rect}=r;
 for(let t=tiers-1;t>=0;t--){const b=bottom-t*4,f=flare-t*2;
  poly([[20,top],[36,top],[36+f+w,b],[20-f+w,b]],t?frillShade:dark);
  if(t){for(let x=20-f+w;x<36+f+w;x+=3)rect(x,b-1,2,2,frill);continue;}
  poly([[21,top],[35,top],[34+f+w,b-2],[22-f+w,b-2]],mid);
  for(const [a,bx]of [[23,-4],[27,0],[31,4]])line(a,top+2,a+bx*1.4+w,b-3,light);
  for(let x=20-f+w;x<36+f+w;x+=3){rect(x,b-1,3,2,frill);rect(x+2,b,1,1,frillShade);}
 }
}
// One ruffled skirt tier centred on the waist; the hem sways with the walk and ends in scallops.
function tier(r,w,{top,bottom,ht,hb,color,shade,light,edge,edgeShade}){
 const {poly,line,rect,put}=r,L=28-hb+w,R=28+hb+w;
 poly([[28-ht,top],[28+ht,top],[R,bottom],[L,bottom]],shade);
 poly([[29-ht,top],[27+ht,top],[R-1,bottom-1],[L+1,bottom-1]],color);
 if(light)for(const k of [-.55,0,.55])line(Math.round(28+k*ht),top+1,Math.round(28+k*hb+w),bottom-2,light);
 if(edge)for(let x=L;x<R;x+=3){rect(x,bottom-1,2,2,edge);put(x+2,bottom-1,edgeShade||shade);}
}
function bodice(r,y,{dark,mid,light,lace}){
 const {poly,line,rect}=r;
 poly([[20,39+y],[36,39+y],[35,50],[21,50]],dark);poly([[21,40+y],[35,40+y],[34,49],[22,49]],mid);
 line(22,41+y,22,48,light);if(lace)for(let yy=41+y;yy<49;yy+=2){rect(27,yy,3,1,lace);}
}
function arms(r,y,o,{attack,raised}){
 // Left arm hangs with the musket; right arm holds the pistol low or aims it.
 const sleeve=o.sleeve,sleeveLight=o.sleeveLight||mix(sleeve,'#ffffff',.25),cuff=o.cuff;
 limb(r,20,41+y,16,raised?34:51,{color:sleeve,light:sleeveLight,width:4});
 if(attack)limb(r,36,41+y,44,42,{color:sleeve,light:sleeveLight,width:4});
 else limb(r,36,41+y,40,51,{color:sleeve,light:sleeveLight,width:4});
 if(o.puff){r.poly([[17,39+y],[22,37+y],[23,43+y],[18,45+y]],o.puff);r.poly([[34,37+y],[39,39+y],[38,45+y],[33,43+y]],o.puff);r.rect(19,39+y,2,1,mix(o.puff,'#ffffff',.3));r.rect(35,39+y,2,1,mix(o.puff,'#ffffff',.3));}
 if(cuff){r.rect(raised?14:14,(raised?33:49)+0,5,2,cuff);if(attack)r.rect(42,41,3,4,cuff);else r.rect(38,49,5,2,cuff);}
}

const GARMENTS={
 default(r,y,w){
  // Astral Dress: a gothic-lolita gown of layered orange-red and black ruffles, a laced
  // corset bodice with a black frill neckline, detached gloves and black platform boots.
  const A=ASTRAL,B='#1b1419',B2='#3a2a33';
  tier(r,w,{top:52,bottom:64,ht:10,hb:18,color:B,shade:'#100b10',edge:B2,edgeShade:'#100b10'});
  tier(r,w,{top:50,bottom:62,ht:9,hb:17,color:A.mid,shade:A.dark,light:A.light,edge:B,edgeShade:A.dark});
  tier(r,w,{top:48,bottom:59,ht:8,hb:15,color:B,shade:'#100b10',light:B2,edge:A.mid,edgeShade:A.dark});
  tier(r,w,{top:47,bottom:56,ht:7,hb:13,color:A.mid,shade:A.dark,light:A.light,edge:B,edgeShade:A.dark});
  // A red waist bow with trailing tails over the front of the skirt.
  r.poly([[23,46],[28,48],[23,51]],A.mid);r.poly([[33,46],[28,48],[33,51]],A.dark);r.rect(27,47,2,2,A.light);r.line(27,49,25+w,55,A.dark);r.line(29,49,31+w,55,A.mid);
  // Bodice: red with a black lace-up panel, black frill along the top edge, bare shoulders above.
  r.poly([[21,40+y],[35,40+y],[34,48],[22,48]],A.dark);r.poly([[22,41+y],[34,41+y],[33,47],[23,47]],A.mid);r.line(23,42+y,23,46,A.light);
  r.rect(26,41+y,4,7,B);for(let yy=42+y;yy<47;yy+=2){r.put(26,yy,A.mid);r.put(29,yy,A.mid);r.put(27,yy+1,A.mid);r.put(28,yy+1,A.mid);}
  for(let x=21;x<35;x+=2){r.rect(x,39+y,2,2,B);r.put(x,41+y,B2);}r.put(24,38+y,B);r.put(32,38+y,B);
  r.line(23,37+y,23,39+y,B);r.line(33,37+y,33,39+y,B);
  return {sleeve:SKIN.base,sleeveLight:SKIN.light,legs:B,legLight:'#3a2a33',lace:'#4a3a44',shoe:B,shoeLight:'#4a3a44',boots:60,laces:A.dark,platform:A.dark,
   after(r,y,{attack,raised}){
    // Detached black arm gloves with red frills at elbow and wrist.
    const glove=(x0,y0,x1,y1)=>{const mx=Math.round((x0+x1)/2),my=Math.round((y0+y1)/2);r.line(mx,my,x1,y1,B,4);r.rect(mx-2,my-1,5,2,A.mid);r.put(mx,my-1,A.light);r.rect(x1-1,y1+2,4,2,A.mid);};
    glove(20,41+y,16,raised?34:51);
    if(attack)glove(36,41+y,44,42);else glove(36,41+y,40,51);
   },
   afterHead(r,y){r.rect(25,38+y,6,1,B);r.put(28,38+y,A.mid);}};
 },
 gothic(r,y,w){
  // Gothic: a white puff-sleeved blouse under a black laced corset vest, a red rose brooch,
  // black-and-white layered ruffle skirt, black tights and Mary Janes.
  const W='#f4e8e2',WS='#c9bcc0',K='#272936',KS='#141b27';
  tier(r,w,{top:52,bottom:64,ht:9,hb:15,color:W,shade:WS,edge:'#ffffff',edgeShade:WS});
  tier(r,w,{top:49,bottom:61,ht:8,hb:13,color:K,shade:KS,light:'#44415a',edge:W,edgeShade:WS});
  tier(r,w,{top:47,bottom:55,ht:7,hb:10,color:W,shade:WS,edge:K,edgeShade:KS});
  // Blouse yoke and high frilled collar.
  r.poly([[20,38+y],[36,38+y],[36,43+y],[20,43+y]],WS);r.poly([[21,38+y],[35,38+y],[35,42+y],[21,42+y]],W);
  // Black corset vest cinched with white cross lacing.
  r.poly([[21,41+y],[25,43+y],[28,44+y],[31,43+y],[35,41+y],[35,49],[21,49]],KS);r.poly([[22,42+y],[25,44+y],[28,45+y],[31,44+y],[34,42+y],[34,48],[22,48]],K);
  for(let yy=44+y;yy<49;yy++)r.put(yy%2?27:29,yy,W);r.line(28,44+y,28,48,'#44415a');r.line(23,43+y,23,47,'#44415a');
  r.rect(23,37+y,10,2,W);r.rect(24,37+y,8,1,'#ffffff');
  // Rose brooch at the throat.
  r.rect(26,39+y,4,3,'#7d2e44');r.rect(27,39+y,2,2,'#b94e64');r.put(27,39+y,'#e48a92');r.put(25,41+y,'#4d6a4d');r.put(30,41+y,'#4d6a4d');
  return {sleeve:W,sleeveLight:'#ffffff',puff:'#ffffff',cuff:K,legs:'#1d1824',legLight:'#3a3346',shoe:'#1a1520',shoeLight:'#4a3f55',strap:'#4a3f55'};
 },
 crimson(r,y,w){
  // Midnight Rose: an ankle-length Victorian gown in plum and charcoal.
  r.poly([[20,46],[36,46],[42+w,66],[37,68],[19,68],[14+w,66]],'#353340');r.poly([[21,46],[35,46],[40+w,64],[17+w,64]],'#45404f');
  for(const a of [-5,0,5])r.line(28+a,48,28+a*1.6+w,64,'#5a5266');
  for(let x=14+w;x<42+w;x+=3){r.rect(x,65,2,2,'#a5658d');}
  r.poly([[21,46],[35,46],[33,52],[23,52]],'#95558e');r.line(23,47,33,47,'#a5658d');
  bodice(r,y,{dark:'#2b2433',mid:'#45404f',light:'#5a5266',lace:'#a5658d'});
  r.rect(22,38+y,12,2,'#a5658d');r.rect(27,40+y,2,2,'#e48a92');
  return {sleeve:'#353340',puff:'#95558e',cuff:'#a5658d',legs:'#353340',shoe:'#1f1a26'};
 },
 school(r,y,w){
  // Black blazer piped in white over a white collar and red ribbon tie, a blue pleated skirt.
  const K='#1e1b26',KS='#121019',KL='#363244',T='#e9e6ee',BL='#3d5a9a',BS='#2b4174',BH='#5a78b8';
  r.poly([[20,48],[36,48],[40+w,60],[16+w,60]],BS);r.poly([[21,48],[35,48],[38+w,59],[18+w,59]],BL);
  for(let x=18+w;x<38+w;x+=3){r.line(x+1,50,x+1,58,BS);r.put(x+2,51,BH);}r.rect(16+w,59,24,1,'#1f2f58');
  r.poly([[20,39+y],[36,39+y],[37,51],[19,51]],KS);r.poly([[21,40+y],[35,40+y],[36,50],[20,50]],K);
  // White collar and shirt front framed by piped lapels.
  r.poly([[24,38+y],[32,38+y],[30,46+y],[26,46+y]],'#f7f4ef');r.poly([[23,38+y],[26,38+y],[26,41+y]],T);r.poly([[30,38+y],[33,38+y],[30,41+y]],T);
  r.line(25,40+y,28,47,T);r.line(31,40+y,28,47,T);r.line(28,47,28,50,T);r.line(20,50,36,50,T);
  // Red ribbon tie: two loops and a knot under the collar.
  r.poly([[24,40+y],[28,42+y],[24,44+y]],RED);r.poly([[32,40+y],[28,42+y],[32,44+y]],RED_DARK);r.rect(27,41+y,2,2,RED_LIGHT);r.line(27,43+y,26,46+y,RED);r.line(28,43+y,29,46+y,RED_DARK);
  r.line(22,42+y,22,49,KL);r.rect(32,47,2,1,T);
  return {sleeve:K,sleeveLight:KL,cuff:T,legs:'#24222e',legLight:'#3a3648',shoe:'#3a2a26',shoeLight:'#6a5048'};
 },
 whitequeen(r,y,w){
  // White Queen: a white military coat-dress with a great bow at the breast and silver
  // buttons, layered white and grey ruffles over a charcoal petticoat, and white laced boots.
  const c=WHITE_QUEEN_COLORS;
  tier(r,w,{top:52,bottom:66,ht:10,hb:18,color:c.lining,shade:'#25262f',edge:'#535363',edgeShade:'#25262f'});
  tier(r,w,{top:49,bottom:62,ht:9,hb:15,color:c.dressShade,shade:c.trim,light:c.dress,edge:c.lace,edgeShade:c.trim});
  tier(r,w,{top:46,bottom:57,ht:8,hb:12,color:c.dress,shade:c.dressShade,light:c.lace,edge:c.lace,edgeShade:c.dressShade});
  r.line(16+w,57,40+w,57,c.trim);
  // Fitted coat bodice with a double row of silver buttons and a belted waist.
  r.poly([[19,38+y],[37,38+y],[36,50],[20,50]],c.dressShade);r.poly([[20,39+y],[36,39+y],[35,49],[21,49]],c.dress);
  for(const yy of [45,47]){r.put(24,yy,c.silver);r.put(32,yy,c.silver);}
  r.rect(20,48,16,2,c.trim);r.rect(26,48,4,2,c.silver);r.put(27,48,'#ffffff');
  r.rect(24,37+y,8,2,c.lace);r.rect(25,37+y,6,1,'#ffffff');
  // The great bow: two broad loops, a jewelled knot and short tails.
  r.poly([[19,38+y],[28,42+y],[19,47+y],[18,42+y]],c.trim);r.poly([[20,40+y],[26,42+y],[20,45+y]],c.dressShade);r.line(20,41+y,24,42+y,c.lace);
  r.poly([[37,38+y],[28,42+y],[37,47+y],[38,42+y]],c.trim);r.poly([[36,40+y],[30,42+y],[36,45+y]],c.dressShade);r.line(36,41+y,32,42+y,c.lace);
  r.rect(26,41+y,4,3,c.trim);r.rect(27,41+y,2,2,'#a8b4cc');r.put(27,41+y,'#ffffff');r.line(26,44+y,25,47,c.dressShade);r.line(29,44+y,30,47,c.dressShade);
  // Silver epaulettes.
  r.poly([[16,38+y],[22,37+y],[22,40+y],[15,41+y]],c.silver);r.poly([[34,37+y],[40,38+y],[41,41+y],[34,40+y]],c.silver);
  return {sleeve:c.dress,sleeveLight:c.lace,cuff:c.silver,legs:c.lining,shoe:c.lace,shoeLight:c.silver,boots:60,laces:c.trim,platform:c.silver,glove:c.lace};
 },
 casual(r,y,w){
  // Crimson Café: striped knit sweater, black pleated skirt and tights.
  r.poly([[21,49],[35,49],[38+w,59],[18+w,59]],'#1f1b27');for(let x=19+w;x<38+w;x+=3)r.line(x,51,x,58,'#2f2a3a');
  r.poly([[19,38+y],[37,38+y],[37,51],[19,51]],'#8a3444');r.poly([[20,39+y],[36,39+y],[36,50],[20,50]],'#b64a5a');
  for(const yy of [42,45,48])r.line(20,yy+(yy<45?y:0),36,yy+(yy<45?y:0),'#d9757c');
  r.poly([[24,38+y],[32,38+y],[30,41+y],[26,41+y]],'#f3e4da');r.rect(27,41+y,2,2,GOLD);
  return {sleeve:'#b64a5a',sleeveLight:'#d9757c',cuff:'#8a3444',legs:'#2a2433',shoe:'#5b2e35',shoeLight:'#8a4b52'};
 },
 pajamas(r,y,w){
  // Maroon flannel set with cream piping and little clock buttons.
  for(const [i,x]of [21,29].entries()){const d=i?w:-w;r.rect(x+d,50,6,16,'#7c2f46');r.rect(x+d+1,51,2,13,'#a24a60');r.rect(x+d,64,6,2,'#f1e2d6');}
  r.poly([[19,38+y],[37,38+y],[38,53],[18,53]],'#7c2f46');r.poly([[20,39+y],[36,39+y],[36,52],[20,52]],'#a24a60');
  r.line(28,39+y,28,52,'#f1e2d6');for(const yy of [42,46,50]){r.rect(29,yy,2,2,GOLD);r.put(29,yy,'#fff0c0');}
  r.poly([[23,38+y],[28,42+y],[33,38+y]],'#f1e2d6');r.rect(21,52,16,1,'#f1e2d6');
  // A tiny clock print on the pocket.
  r.rect(22,46,4,4,'#f1e2d6');r.put(23,47,'#5b3a22');r.put(24,47,'#5b3a22');r.put(23,48,'#5b3a22');
  return {sleeve:'#a24a60',sleeveLight:'#c46a7e',cuff:'#f1e2d6',legs:SKIN.base,legLight:SKIN.light,shoe:'#e9d6c8',shoeLight:'#ffffff'};
 },
 swimsuit(r,y,w){
  // Midnight Beach Clock: black one-piece with a red ruffle skirt and gold clock clasp.
  r.poly([[20,39+y],[36,39+y],[35,53],[21,53]],SKIN.shade);r.poly([[21,40+y],[35,40+y],[34,52],[22,52]],SKIN.base);
  r.poly([[21,42+y],[35,42+y],[34,53],[22,53]],'#1e1724');r.line(22,43+y,22,52,'#3a3046');
  r.poly([[20,50],[36,50],[40+w,57],[16+w,57]],RED_DARK);for(let x=16+w;x<40+w;x+=3)r.rect(x,56,2,2,RED);
  r.rect(26,44+y,4,4,GOLD);r.put(27,45+y,'#5b3a22');r.put(28,45+y,'#5b3a22');r.put(27,46+y,'#5b3a22');
  r.line(23,40+y,22,42+y,'#1e1724');r.line(33,40+y,34,42+y,'#1e1724');
  return {sleeve:SKIN.base,sleeveLight:SKIN.light,legs:SKIN.base,legLight:SKIN.light,shoe:'#1e1724',strap:RED};
 },
 cuteswim(r,y,w){
  // Swim dress: black skirt with pink ribbon trim and a big chest bow.
  r.poly([[21,38+y],[35,38+y],[34,48],[22,48]],'#2a2234');r.poly([[22,39+y],[34,39+y],[33,47],[23,47]],'#3d3248');
  r.poly([[20,47],[36,47],[41+w,59],[15+w,59]],'#2a2234');r.poly([[21,47],[35,47],[39+w,57],[17+w,57]],'#3d3248');
  for(let x=15+w;x<41+w;x+=4){r.rect(x,57,3,2,'#e7a0b8');}r.line(21,49,35,49,'#d27a96');
  r.poly([[23,40+y],[28,43+y],[23,46+y]],'#d27a96');r.poly([[33,40+y],[28,43+y],[33,46+y]],'#a24b6c');r.rect(27,42+y,2,2,'#f2b3c6');
  return {sleeve:SKIN.base,sleeveLight:SKIN.light,puff:'#d27a96',legs:SKIN.base,legLight:SKIN.light,shoe:'#d27a96',shoeLight:'#f2b3c6'};
 },
 bathsuit(r,y,w){
  // Clockwork Spa Robe: wine-red wrap robe with a gold obi and clock-hand print.
  r.poly([[19,38+y],[37,38+y],[39+w,64],[17+w,64]],'#6a2a3c');r.poly([[20,39+y],[36,39+y],[37+w,63],[19+w,63]],'#9c3f55');
  r.poly([[23,38+y],[28,46],[33,38+y],[31,38+y],[28,43],[25,38+y]],'#f1e2d6');r.line(28,46,26+w,63,'#6a2a3c');
  r.rect(20,47,16,3,GOLD);r.rect(20,47,16,1,'#f0d58b');r.rect(26,49,4,3,GOLD_DARK);
  for(const [x,yy]of [[22,54],[32,57],[24,60]]){r.put(x+w,yy,GOLD);r.put(x+1+w,yy,GOLD);r.put(x+w,yy-1,GOLD);}
  return {sleeve:'#9c3f55',sleeveLight:'#c46a7e',cuff:'#f1e2d6',legs:SKIN.base,legLight:SKIN.light,shoe:'#5b2e35',strap:'#f1e2d6',noLegs:true};
 },
};

export function kurumiPixels({frame=0,moving=false,pose='',attack=false,expression='neutral',blink=false,skin='default'}={}){
 // Any special pose (the clock of Zafkiel and others) shows the raised flintlock.
 if(pose){attack=true;expression='ultimate';pose='';}
 const o=OUTFITS[skin]||OUTFITS.default,h=o.palette||HAIR,paint=GARMENTS[skin]||GARMENTS.default;
 const r=canvas(),{walk,y}=motion({frame,moving}),raised=attack&&expression==='ultimate';
 backHair(r,o.hair,h,walk,y);
  // Garments return their leg, sleeve and shoe colours; read them first so legs sit behind skirts.
 const gear=paint(canvas(),y,walk);
 if(!gear.noLegs)legsAndShoes(r,gear,walk);
 else for(const [i,x]of [22,30].entries()){const d=i?walk:-walk;r.rect(x+d,63,5,4,SKIN.base);r.rect(x+d-1,67,7,4,gear.shoe);r.rect(x+d,67,5,1,gear.strap);}
 paint(r,y,walk);
 arms(r,y,gear,{attack,raised});
 gear.after?.(r,y,{attack,raised});
 if(gear.glove){r.rect(15,raised?37:51+0,4,3,gear.glove);if(attack)r.rect(43,44,3,3,gear.glove);else r.rect(39,52,3,3,gear.glove);}
 if(attack)flintlock(r,44,42,{raised:true,flash:expression!=='ultimate'||raised});else{flintlock(r,40,54);limb(r,40,51,40,51,{color:gear.sleeve,width:1});}
 if(!raised)musket(r,16,52);
 if(raised)flintlock(r,13,27,{raised:true});
 head(r,y);gear.afterHead?.(r,y);
 const closed=blink,hurt=expression==='hurt',focus=expression==='focused'||expression==='ultimate';
 eye(r,21,26+y,{iris:'#ba4b64',irisDark:'#7d2440',lash:INK,side:-1,closed,hurt,focus});
 if(o.eye==='clock')eye(r,31,26+y,{iris:GOLD,irisDark:GOLD_DARK,lash:INK,side:1,closed,hurt,focus,clock:true});
 blush(r,32+y);mouth(r,34+y,expression);
 frontHair(r,o.eye,h,y);
 if(o.eye==='patch')eyePatch(r,y);
 accessory(r,o.band,y,walk);
 return selout(r.pixels,INK);
}
