import {canvas,motion,limb,selout,mix,SKIN} from './hero-kit.js';
// Denji: lanky adult build, messy straw-blond hair, tired eyes and a shark-tooth grin.
// The base outfit follows his Public Safety look: rolled shirt sleeves, a loose black
// tie, brown belt, rolled charcoal slacks and red-trimmed white high-tops. Chainsaw Man
// (form 1 or the chainsaw pose) shares one design across every skin.
export const DENJI_ART={ink:'#25303d',hair:'#e3b35a',hairDark:'#a46f3c',hairLight:'#f7d98c',skin:'#f1cfb0',skinShade:'#d2a58a',skinLight:'#ffe6cc',shirt:'#eeece4',shirtShade:'#b9bcb8',shirtLight:'#ffffff',pants:'#333b44',pantsShade:'#20262e',pantsLight:'#4f5965',orange:'#ce743b',orangeDark:'#7c4837',orangeLight:'#edaa5d',steel:'#a8b9bc',steelDark:'#566c79',steelLight:'#edf0d7',red:'#bd5c58'};
const c=DENJI_ART,TIE='#1d2128',BELT='#6e4632',BUCKLE='#c9ccc6';
const SK={base:c.skin,shade:c.skinShade,deep:'#b98374',light:c.skinLight};
function saw(r,x,y,length,{upright=false,hot=false,frame=0}={}){
 const {rect:R,poly:P,line:L}=r,base=hot?'#e5b184':c.steel,shine=hot?'#fff0be':c.steelLight;
 if(upright){
  P([[x-4,y+3],[x-4,y-length+3],[x-1,y-length-2],[x+3,y-length],[x+4,y+3]],c.ink);
  R(x-2,y-length+3,5,length,base);L(x,y-length+2,x,y,c.steelDark,1);
  for(let i=2;i<length-1;i+=4){const yy=y-i+(frame%2);P([[x-3,yy+2],[x-6,yy],[x-3,yy-1]],shine);P([[x+3,yy],[x+6,yy-2],[x+3,yy-3]],shine);}
  L(x-1,y-length+3,x-1,y-1,shine);
 }else{
  P([[x-3,y-4],[x+length-3,y-4],[x+length+2,y-1],[x+length,y+3],[x-3,y+4]],c.ink);
  R(x-1,y-2,length-1,5,base);L(x,y,x+length-2,y,c.steelDark);
  for(let i=2;i<length-1;i+=4){const xx=x+i+(frame%2);P([[xx-1,y-3],[xx,y-6],[xx+2,y-3]],shine);P([[xx,y+3],[xx+2,y+6],[xx+3,y+3]],shine);}
  L(x,y-1,x+length-3,y-1,shine);
 }
}
// Longer, slightly angular face with small half-lidded eyes and a jagged grin.
function face(r,y,{expression,blink}){
 const {rect:R,line:L,poly:P,put}=r,ink='#2a2328';
 R(25,36+y,6,4,SK.shade);
 P([[18,19+y],[38,19+y],[38,29+y],[36,34+y],[31,38+y],[25,38+y],[20,34+y],[18,29+y]],SK.shade);
 P([[19,19+y],[37,19+y],[37,29+y],[35,33+y],[30,37+y],[26,37+y],[21,33+y],[19,29+y]],SK.base);
 R(20,30+y,2,1,SK.light);R(35,30+y,2,1,SK.light);R(36,25+y,1,4,SK.shade);
 const hurt=expression==='hurt',focus=expression==='focused'||expression==='ultimate';
 for(const [x,side]of [[21,-1],[31,1]]){
  if(blink){L(x,28+y,x+3,28+y,ink);continue;}
  if(hurt){L(x,26+y,x+3,28+y,ink);L(x,28+y,x+3,26+y,ink);continue;}
  // Heavy upper lid over a small reddish-brown iris: his usual unimpressed look.
  L(x-(side<0?1:0),26+y,x+3+(side>0?1:0),26+y,ink);R(x,27+y,4,2,'#fbf4e8');R(x+(side<0?1:0),27+y,2,2,'#8f4f3e');put(x+(side<0?1:0),27+y,'#5a2c26');put(x+(side<0?2:1),28+y,'#c98a6a');
  if(focus)L(x-(side<0?1:0),25+y,x+3+(side>0?1:0),side<0?26+y:25+y,ink);
 }
 // Brows sit flat and a little apart.
 if(!blink){L(20,24+y,24,24+y,c.hairDark);L(31,24+y,35,24+y,c.hairDark);}
 if(hurt){P([[25,33+y],[31,33+y],[30,35+y],[26,35+y]],'#6e3b3b');for(const x of [26,28,30])put(x,33+y,'#fff8ee');return;}
 if(focus){L(25,34+y,31,34+y,ink);for(const x of [26,28,30])put(x,33+y,'#fff8ee');return;}
 // Toothy grin: a dark mouth with a row of pointed upper teeth, lifted at his left corner.
 R(25,33+y,7,2,ink);put(32,32+y,ink);put(24,33+y,mix(ink,SK.base,.5));
 for(const x of [25,27,29,31])put(x,33+y,'#fff8ee');for(const x of [26,28,30])put(x,33+y,'#d8d2c8');for(const x of [26,29])put(x,34+y,'#efe9df');
}
// Messy short blond hair: uneven spikes, darker roots and a flyaway on top.
function hair(r,y){
 const {poly:P,line:L,rect:R}=r;
 P([[15,27+y],[14,18+y],[17,13+y],[16,8+y],[22,10+y],[25,4+y],[29,9+y],[34,5+y],[36,11+y],[41,12+y],[40,19+y],[41,27+y],[38,30+y],[36,22+y],[33,20+y],[30,24+y],[28,19+y],[25,23+y],[22,19+y],[20,24+y],[18,31+y]],c.hairDark);
 P([[16,24+y],[16,18+y],[19,14+y],[18,11+y],[23,12+y],[26,7+y],[29,12+y],[34,8+y],[35,13+y],[39,15+y],[38,21+y],[35,19+y],[32,18+y],[30,22+y],[28,17+y],[25,21+y],[23,17+y],[20,22+y],[18,26+y]],c.hair);
 L(19,17+y,24,14+y,c.hairLight);L(27,11+y,29,15+y,c.hairLight);L(31,13+y,35,11+y,c.hairLight);R(17,20+y,2,1,c.hairLight);
 // A couple of uneven tufts stick up from the crown.
 r.poly([[23,9+y],[22,4+y],[26,7+y]],c.hairDark);r.poly([[23,8+y],[23,5+y],[25,7+y]],c.hair);
}
function pochitaHood(r,y){
 const {poly:P,rect:R,line:L}=r;
 P([[13,22+y],[14,12+y],[19,7+y],[28,5+y],[37,7+y],[42,12+y],[43,22+y],[41,34+y],[37,30+y],[37,20+y],[19,20+y],[19,30+y],[15,34+y]],'#8b4d35');
 P([[15,21+y],[16,13+y],[20,9+y],[28,7+y],[36,9+y],[40,13+y],[41,21+y],[38,19+y],[18,19+y]],'#d88345');
 // Pochita's ears and the little saw blade on the hood's nose.
 P([[15,12+y],[11,6+y],[18,8+y]],'#8b4d35');P([[41,12+y],[45,6+y],[38,8+y]],'#8b4d35');
 R(25,4+y,6,4,c.steel);L(26,4+y,30,4+y,c.steelLight);for(const x of [25,27,29])r.put(x,3+y,c.steelLight);
 R(20,11+y,3,2,'#efb86a');R(34,11+y,3,2,'#efb86a');
}
// Legs and footwear per outfit.
function legs(r,walk,look){
 const {rect:R,poly:P,line:L}=r;
 for(const [i,x]of [21,31].entries()){const d=i?walk:-walk;
  if(look==='swimsuit'){R(x+d,55,5,13,c.skin);R(x+d+4,55,1,13,c.skinShade);R(x+d-1,68,7,3,'#6e8f8f');L(x+d,68,x+d+4,68,'#d9c394');continue;}
  if(look==='pajamas'){R(x+d-1,52,7,16,'#a8613d');R(x+d,52,5,15,'#d88345');L(x+d+1,54,x+d+1,64,'#efb86a');R(x+d-1,67,7,4,'#6c6755');R(x+d,67,4,1,'#d1c08d');continue;}
  const pants=look==='casual'?'#4f6e93':c.pants,shade=look==='casual'?'#344b68':c.pantsShade,light=look==='casual'?'#7d98b8':c.pantsLight;
  R(x+d-1,52,7,14,shade);R(x+d,52,5,13,pants);L(x+d+1,54,x+d+1,63,light);
  // Rolled cuffs show a lighter fold above the shoes.
  R(x+d-1,64,7,2,look==='casual'?'#8fa6c2':'#59616c');
  if(look==='devilhunter'){R(x+d-1,66,7,5,'#1b1f26');R(x+d,66,4,1,'#4a505c');R(x+d-1,70,7,1,'#0e1116');continue;}
  // White high-tops with red trim, white laces and a dark sole.
  R(x+d-1,66,7,5,'#f2f0ea');R(x+d-1,66,7,1,'#b4423e');R(x+d-1,69,7,1,'#b4423e');R(x+d+1,67,2,2,'#d8d5ce');R(x+d-1,70,7,1,'#3a3236');
 }
}
// Torso garments. Returns sleeve style so arms can follow.
function torso(r,y,look,hybrid){
 const {poly:P,rect:R,line:L,put}=r;
 if(look==='swimsuit'&&!hybrid){
  P([[18,38+y],[38,38+y],[36,53],[20,53]],c.skinShade);P([[19,39+y],[37,39+y],[35,52],[21,52]],c.skin);L(28,43+y,28,51,c.skinShade);L(23,46,33,46,c.skinShade);
  // Orange Pochita-print swim trunks.
  P([[19,51],[37,51],[38,58],[29,58],[28,55],[27,58],[18,58]],'#9b563c');P([[20,52],[36,52],[37,57],[30,57],[28,54],[26,57],[19,57]],'#df9550');L(20,52,36,52,'#eed4a2');for(const x of [22,33])R(x,54,2,2,'#f3ce8c');
  return {sleeve:null,pocket:'#9b563c'};
 }
 if(look==='pajamas'&&!hybrid){
  P([[18,38+y],[38,38+y],[37,53],[19,53]],'#a8613d');P([[19,39+y],[37,39+y],[36,52],[20,52]],'#d88345');L(28,40+y,28,52,'#8b4d35');for(const yy of [43,47,51])put(29,yy,'#f3ce8c');R(22,46,4,3,'#efb86a');
  return {sleeve:'#d88345',sleeveLight:'#efb86a',cuff:'#a8613d',pocket:'#a8613d'};
 }
 if(look==='casual'&&!hybrid){
  // Cream tee with an orange Pochita face.
  P([[18,38+y],[38,38+y],[37,53],[19,53]],'#b9ad8e');P([[19,39+y],[37,39+y],[36,52],[20,52]],'#ece2c4');P([[24,38+y],[32,38+y],[30,40+y],[26,40+y]],c.skin);
  R(24,43,8,6,'#ce743b');R(25,44,6,4,'#e8994e');put(26,45,c.ink);put(29,45,c.ink);R(27,42,2,2,c.steel);L(25,47,30,47,'#7c4837');
  return {sleeve:'#ece2c4',sleeveLight:'#ffffff',cuff:'#b9ad8e',short:true,pocket:'#344b68'};
 }
 // White collared shirt (all suit looks and the hybrid), loose black tie and brown belt.
 P([[18,38+y],[38,38+y],[37,53],[19,53]],c.shirtShade);P([[19,39+y],[37,39+y],[36,52],[20,52]],c.shirt);L(20,40+y,21,51,c.shirtLight);
 P([[23,37+y],[27,40+y],[25,42+y],[22,39+y]],c.shirtLight);P([[33,37+y],[29,40+y],[31,42+y],[34,39+y]],c.shirtLight);
 // Breast pocket and loosened tie.
 R(31,43+y,4,3,c.shirtShade);L(31,43+y,34,43+y,c.shirtLight);
 P([[27,39+y],[30,39+y],[29,41+y]],TIE);P([[27,41+y],[29,41+y],[30,49],[28,51],[26,49]],TIE);L(28,42+y,28,48,'#3c434e');
 R(19,51,18,2,BELT);R(26,51,4,2,BUCKLE);put(27,51,'#ffffff');
 if(hybrid){for(const [x,yy]of [[21,44],[34,46],[23,49]]){put(x,yy,c.red);put(x+1,yy+1,c.red);put(x,yy+2,'#8a3a38');}}
 if(look==='devilhunter'&&!hybrid){
  // Black Public Safety suit jacket worn open over the shirt.
  P([[17,38+y],[24,38+y],[26,53],[18,54]],'#1f252e');P([[32,38+y],[39,38+y],[38,54],[30,53]],'#1f252e');
  L(23,39+y,25,52,'#3b4350');L(33,39+y,31,52,'#3b4350');P([[22,38+y],[25,38+y],[25,44+y]],'#3b4350');P([[34,38+y],[31,38+y],[31,44+y]],'#3b4350');
  return {sleeve:'#1f252e',sleeveLight:'#3b4350',cuff:c.shirt};
 }
 return {sleeve:c.shirt,sleeveLight:c.shirtLight,cuff:c.shirtShade,rolled:true};
}
// Starter cord: a small black T-handle hanging from the chest.
function pullCord(r,y){const {line:L,rect:R}=r;L(24,42+y,23,46,c.ink);R(20,46,6,2,c.ink);R(21,46,4,1,'#5a6270');}
function arms(r,y,g,{cast,hybrid}){
 const skinArm={color:c.skin,light:c.skinLight,width:4,hand:c.skin,handShade:c.skinShade};
 const arm=(x0,y0,x1,y1,opt={})=>{
  if(!g.sleeve){limb(r,x0,y0,x1,y1,{...skinArm,...opt});return;}
  const mx=Math.round(x0+(x1-x0)*.5),my=Math.round(y0+(y1-y0)*.5);
  if(g.rolled||g.short){limb(r,x0,y0,x1,y1,{...skinArm,...opt});limb(r,x0,y0,mx,my,{color:g.sleeve,light:g.sleeveLight,width:5,hand:null});r.rect(mx-2,my,5,2,g.cuff);}
  else{limb(r,x0,y0,x1,y1,{color:g.sleeve,light:g.sleeveLight,width:5,hand:c.skin,handShade:c.skinShade,...opt});r.rect(x1-1,y1+1,5,2,g.cuff);}
 };
 if(hybrid)return;
 // Left arm hangs loose; right hand rests in the trouser pocket unless he attacks.
 arm(18,40+y,15,53);
 if(cast)arm(38,40+y,46,44,{hand:null});
 else{arm(38,40+y,40,49,{hand:null});r.rect(37,50,4,2,g.pocket||c.pantsShade);}
}
function hybridHead(r,y,{cast,frame}){
 const {poly:P,line:L,rect:R}=r;
 // Orange motor shell, a single broad snout blade and a lower saw-toothed jaw.
 P([[15,17+y],[19,12+y],[34,11+y],[41,15+y],[42,26+y],[36,32+y],[22,33+y],[15,27+y]],c.ink);
 P([[17,18+y],[21,14+y],[33,13+y],[38,16+y],[39,24+y],[34,28+y],[20,28+y],[17,24+y]],c.orangeDark);
 P([[19,17+y],[23,14+y],[32,15+y],[36,18+y],[35,23+y],[21,25+y],[18,22+y]],c.orange);L(21,16+y,31,15+y,c.orangeLight,2);L(18,21+y,21,23+y,c.orangeLight);
 // Rear motor vents and a black vertical lever match the characteristic head.
 R(14,17+y,4,8,c.orangeDark);for(const yy of [18,21,24])L(14,yy+y,18,yy+y,c.ink);L(22,12+y,20,5+y,c.ink,3);L(21,6+y,22,10+y,c.steelDark,1);
 saw(r,33,18+y,20,{hot:cast,frame});
 P([[17,27+y],[26,25+y],[40,24+y],[37,33+y],[30,38+y],[21,35+y]],c.ink);
 P([[20,29+y],[29,28+y],[37,26+y],[34,32+y],[28,35+y],[22,33+y]],'#6c4238');
 for(const [x,yy]of [[20,28],[24,28],[28,27],[32,27],[35,26]])P([[x,yy+y],[x+3,yy+y],[x+1,yy+4+y]],c.steelLight);
 for(const [x,yy]of [[23,34],[27,35],[31,33],[34,31]])P([[x,yy+y],[x+2,yy-4+y],[x+3,yy-1+y]],c.steel);
 L(20,26+y,28,25+y,'#efb26b');R(31,23+y,5,1,c.red);R(17,22+y,2,3,'#edbf7b');
}
export function denjiPixels({frame=0,moving=false,pose='',attack=false,expression='neutral',blink=false,skin='default',form=0}={}){
 const hybrid=form===1||pose==='chainsaw',cast=attack||pose==='ultimate'||pose==='rev'||pose==='cleave';
 const r=canvas(),{walk,y:bob}=motion({frame,moving}),y=bob-1,look=hybrid?'default':skin;
 legs(r,walk,look);
 const g=torso(r,y,look,hybrid);
 pullCord(r,y);
 arms(r,y,g,{cast,hybrid});
 if(hybrid){
  hybridHead(r,bob,{cast,frame});
  saw(r,11,cast?42:57,cast?22:19,{upright:true,hot:cast,frame});saw(r,43,cast?43:58,cast?23:20,{upright:true,hot:cast,frame});
  for(const x of [11,43]){r.rect(x-4,cast?40:49,8,7,c.orangeDark);r.rect(x-2,cast?41:50,5,5,c.orange);r.line(x-2,cast?41:50,x+2,cast?41:50,c.orangeLight);}
  for(const [x0,x1]of [[18,13],[38,43]]){r.line(x0,40+y,x1,cast?42:50,c.shirtShade,5);r.line(x0,40+y,x1,cast?42:50,c.shirt,3);}
 }else{
  if(look==='pajamas')pochitaHood(r,y);
  face(r,y,{expression,blink});
  if(look!=='pajamas')hair(r,y);
  // Attacking or charging Rev: a chainsaw blade bursts from his right forearm.
  if(cast)saw(r,46,44,10,{hot:pose==='ultimate',frame});
 }
 return selout(r.pixels,c.ink);
}
