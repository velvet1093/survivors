import {canvas,motion,eye,mouth,head,limb,selout,mix,SKIN} from './hero-kit.js';
// Yuki Tsukumo: tall adult build, waist-length centre-parted blonde hair and a
// confident smirk. Garuda is rendered as a live orbiting companion, separately.
const INK='#2b2b36';
const HAIR={hair:'#e3cf8c',shade:'#b0985f',light:'#f8ecb8',sheen:'#fff8dc'};
const RED='#a85567',RED_DARK='#713d51',RED_LIGHT='#cd7d83',GOLD='#e0b85c';
const OUTFITS={
 default:{hair:'long'},
 midnight:{hair:'long'},
 casual:{hair:'long',shades:true},
 pajamas:{hair:'long'},
 swimsuit:{hair:'long'},
 bikini:{hair:'long',flower:true},
 bathsuit:{hair:'up'},
};
export const YUKI_OUTFIT_IDS=Object.keys(OUTFITS);
export const YUKI_COLORS={...HAIR,red:RED,blue:'#8295a6',top:'#2b3445',skin:SKIN.base};
function star(r,x,y,c,core){r.put(x,y-1,c);r.rect(x-1,y,3,1,c);r.put(x,y+1,c);if(core)r.put(x,y,core);}
function backHair(r,style,h,walk,y){
 const {poly,line}=r;
 if(style==='up'){
  // A loose bun for the hot spring with a few strands left free.
  poly([[22,7+y],[25,1+y],[32,1+y],[35,7+y],[32,10+y],[25,10+y]],h.shade);poly([[23,7+y],[26,2+y],[31,2+y],[34,7+y],[31,9+y],[26,9+y]],h.hair);line(25,4+y,30,3+y,h.light);
  poly([[16,22+y],[18,11+y],[38,11+y],[40,22+y],[39,34+y],[17,34+y]],h.shade);
  return;
 }
 poly([[13,22+y],[16,10+y],[23,5+y],[33,5+y],[40,10+y],[43,22+y],[44+walk*.3,56],[40,60],[35,52],[21,52],[16,60],[12+walk*.3,56]],h.shade);
 poly([[14,22+y],[17,12+y],[23,7+y],[33,7+y],[39,12+y],[42,22+y],[42+walk*.3,54],[39,57],[35,49],[21,49],[17,57],[14+walk*.3,54]],h.hair);
 line(15,26,15+walk*.3,52,h.light);line(41,26,41+walk*.3,52,h.light);line(17,40,17+walk*.3,54,h.sheen);line(39,40,39+walk*.3,54,h.shade);
}
function frontHair(r,style,h,y){
 const {poly,line,rect}=r;
 // Centre part with long bangs swept to both sides and loose sidelocks.
 poly([[16,32+y],[15,19+y],[20,10+y],[28,7+y],[36,10+y],[41,19+y],[40,32+y],[37,40+y],[36,24+y],[33,18+y],[29,13+y],[27,13+y],[23,18+y],[20,24+y],[19,40+y]],h.shade);
 poly([[17,30+y],[17,19+y],[21,12+y],[27,9+y],[26,13+y],[22,18+y],[20,25+y],[19,36+y]],h.hair);
 poly([[39,30+y],[39,19+y],[35,12+y],[29,9+y],[30,13+y],[34,18+y],[36,25+y],[37,36+y]],h.hair);
 line(20,15+y,25,11+y,h.light);line(31,11+y,36,15+y,h.light);line(18,22+y,18,34+y,h.light);line(38,22+y,38,32+y,h.sheen);
 rect(27,8+y,2,4,h.shade);
 if(style==='up'){rect(16,30+y,2,8,h.hair);rect(38,30+y,2,8,h.hair);}
}
function boots(r,walk,{color,light,top=63}){
 for(const [i,x]of [21,31].entries()){const d=i?walk:-walk;r.rect(x+d-1,top,7,71-top,color);r.rect(x+d,top,1,70-top,light);r.rect(x+d-1,70,7,1,mix(color,'#000000',.45));}
}
function sandals(r,walk,{color}){for(const [i,x]of [21,31].entries()){const d=i?walk:-walk;r.rect(x+d,63,5,7,SKIN.base);r.rect(x+d+4,63,1,7,SKIN.shade);r.rect(x+d-1,70,7,1,color);r.rect(x+d+1,67,3,1,color);}}
function bareLegs(r,walk,top=52){for(const [i,x]of [21,31].entries()){const d=i?walk:-walk;r.rect(x+d,top,5,63-top,SKIN.base);r.rect(x+d+4,top,1,63-top,SKIN.shade);}}
// Roomy trousers taper into the boots and swing with each step.
function trousers(r,walk,{color,shade,light,top=50,hem=64,wide=true}){
 for(const [i,x]of [20,30].entries()){const d=i?walk:-walk;
  r.poly([[x,top],[x+8,top],[x+9+d,hem-6],[x+7+d,hem],[x+d,hem],[x-1+d,hem-6]],shade);
  r.poly([[x+1,top+1],[x+7,top+1],[x+7+d,hem-6],[x+6+d,hem-1],[x+1+d,hem-1],[x+d,hem-6]],color);
  r.line(x+2,top+3,x+1+d,hem-3,light);if(wide)r.line(x+6,top+3,x+6+d,hem-3,shade);
 }
}
function midriff(r,y,top=44,bottom=51){r.poly([[20,top+y],[36,top+y],[35,bottom],[21,bottom]],SKIN.base);r.line(28,top+1+y,28,bottom-1,SKIN.shade);r.put(28,bottom-2,SKIN.deep);r.line(21,top+y,21,bottom,SKIN.shade);}
function crop(r,y,{dark,mid,light,collar}){
 r.poly([[17,38+y],[39,38+y],[38,45+y],[18,45+y]],dark);r.poly([[18,39+y],[38,39+y],[37,44+y],[19,44+y]],mid);r.line(19,40+y,37,40+y,light);
 if(collar){r.rect(24,35+y,8,4,collar);r.rect(25,35+y,6,1,mix(collar,'#ffffff',.25));}
}
const GARMENTS={
 default(r,y,walk){
  // Sleeveless black high-neck crop top with a gold zip pull, bare midriff,
  // baggy red cargo trousers gathered at the ankle, and short black boots.
  midriff(r,y,45,51);r.put(28,48,SKIN.deep);
  // Fitted top: covers the chest down to the lower ribs, with cut-in armholes.
  r.poly([[21,37+y],[35,37+y],[37,40+y],[37,47+y],[19,47+y],[19,40+y]],'#1a1f2b');r.poly([[22,38+y],[34,38+y],[36,41+y],[36,46+y],[20,46+y],[20,41+y]],'#2b3445');
  r.line(21,41+y,21,45+y,'#4d596c');r.line(23,43+y,26,44+y,'#3b4558');r.line(30,44+y,33,43+y,'#3b4558');r.line(20,46+y,36,46+y,'#1a1f2b');
  for(const [i,x]of [19,30].entries()){const d=i?walk:-walk;
   // Balloon legs: wide through the knee, pinched into an elastic cuff above the boot.
   r.poly([[x,51],[x+9,51],[x+11+d,58],[x+10+d,63],[x+7+d,65],[x+2+d,65],[x-1+d,63],[x-2+d,57]],RED_DARK);
   r.poly([[x+1,52],[x+8,52],[x+10+d,58],[x+9+d,62],[x+6+d,64],[x+3+d,64],[x+d,62],[x-1+d,57]],RED);
   r.line(x+2,54,x+1+d,61,RED_LIGHT);r.line(x+7,54,x+8+d,61,RED_DARK);r.line(x+3+d,62,x+7+d,62,RED_DARK);
   // Side cargo pocket with a flap.
   const px=i?x+7+d:x-1+d;r.rect(px,56,3,4,RED_DARK);r.line(px,56,px+2,56,RED_LIGHT);
   r.rect(x+2+d,64,6,2,'#8d4153');
  }
  // Elastic waistband with a drawstring.
  r.rect(19,50,19,3,'#b86677');r.line(19,51,37,51,RED_DARK);r.put(27,52,'#e9d2c2');r.put(29,52,'#e9d2c2');r.line(27,53,26,55,'#e9d2c2');r.line(29,53,30,55,'#e9d2c2');
  boots(r,walk,{color:'#30323e',light:'#4d5060',top:65});
  return {sleeve:SKIN.base,sleeveLight:SKIN.light,bare:true,collar(r,y){
   // Mock-neck collar with a gold zip pull, drawn over the neck.
   r.rect(24,38+y,8,3,'#1a1f2b');r.rect(25,38+y,6,2,'#2b3445');r.line(25,38+y,30,38+y,'#4d596c');r.rect(28,38+y,1,2,'#d9b45f');r.put(28,40+y,'#f0d58b');}};
 },
 midnight(r,y,walk){
  // High zip collar, fitted black top tucked into blue-gray trousers and brown boots.
  r.poly([[17,38+y],[39,38+y],[37,51],[19,51]],'#2a2b3a');r.poly([[18,39+y],[38,39+y],[36,50],[20,50]],'#444456');
  r.line(28,36+y,28,50,'#a99663');r.rect(24,34+y,8,5,'#2a2b3a');r.rect(25,34+y,6,1,'#686274');r.put(28,36+y,'#c7b77c');
  trousers(r,walk,{color:'#8295a6',shade:'#546478',light:'#b4c1c9'});r.rect(20,49,17,3,'#4c5a6c');r.rect(27,49,3,2,'#b7b1a4');
  boots(r,walk,{color:'#796654',light:'#ad9474'});
  return {sleeve:'#444456',sleeveLight:'#686274',cuff:'#2a2b3a'};
 },
 casual(r,y,walk){
  // Road Trip: knotted white shirt, olive cargo trousers and sneakers.
  midriff(r,y,46);
  r.poly([[17,38+y],[39,38+y],[37,47+y],[19,47+y]],'#cfcabb');r.poly([[18,39+y],[38,39+y],[36,46+y],[20,46+y]],'#f2efe6');
  r.poly([[24,38+y],[28,43+y],[32,38+y]],SKIN.base);r.poly([[25,46+y],[31,46+y],[30,49+y],[26,49+y]],'#cfcabb');r.rect(27,46+y,2,2,'#f2efe6');
  trousers(r,walk,{color:'#7f8a5a',shade:'#56603d',light:'#a4ae7c',hem:66});r.rect(20,50,17,2,'#56603d');
  for(const [i,x]of [21,31].entries()){const d=i?walk:-walk;r.rect(x+d-1,58,3,3,'#6b7449');r.rect(x+d-1,66,7,4,'#e8e4da');r.rect(x+d-1,69,7,2,'#3c3a46');}
  return {sleeve:'#f2efe6',sleeveLight:'#ffffff',cuff:'#cfcabb',rolled:true};
 },
 pajamas(r,y,walk){
  // Star Rage Sleepwear: cream button-up set scattered with red stars.
  r.poly([[17,38+y],[39,38+y],[38,53],[18,53]],'#cfc2a6');r.poly([[18,39+y],[38,39+y],[37,52],[19,52]],'#efe5cc');
  r.poly([[23,38+y],[28,43+y],[33,38+y]],RED);r.line(28,43+y,28,52,'#cfc2a6');for(const yy of [45,49])r.put(29,yy,RED);
  for(const [i,x]of [20,30].entries()){const d=i?walk:-walk;r.rect(x+d,53,7,13,'#cfc2a6');r.rect(x+d+1,53,5,12,'#efe5cc');r.rect(x+d,64,7,2,RED);}
  for(const [x,yy]of [[21,44],[34,47],[23,58],[34,61],[31,42]])star(r,x,yy,RED,RED_LIGHT);
  for(const [i,x]of [21,31].entries()){const d=i?walk:-walk;r.rect(x+d-1,66,7,4,RED_DARK);r.rect(x+d,66,4,1,RED_LIGHT);}
  return {sleeve:'#efe5cc',sleeveLight:'#ffffff',cuff:RED};
 },
 swimsuit(r,y,walk){
  // Star Rage Summer: gold halter one-piece with a wrapped red sarong.
  bareLegs(r,walk);r.poly([[20,38+y],[36,38+y],[35,53],[21,53]],SKIN.base);
  r.poly([[21,41+y],[35,41+y],[34,53],[22,53]],'#c7953f');r.poly([[22,42+y],[34,42+y],[33,52],[23,52]],GOLD);r.line(23,43+y,23,51,'#f2d78f');
  r.line(24,41+y,27,36+y,'#c7953f');r.line(32,41+y,29,36+y,'#c7953f');star(r,28,46+y,RED,RED_LIGHT);
  r.poly([[20,51],[37,51],[39+walk,61],[30,64],[22+walk,60]],RED_DARK);r.poly([[21,52],[36,52],[37+walk,60],[30,62],[24+walk,59]],RED);r.line(33,53,36+walk,60,RED_LIGHT);r.rect(19,51,4,3,RED);
  sandals(r,walk,{color:'#8b5a3c'});
  return {sleeve:SKIN.base,sleeveLight:SKIN.light,bare:true};
 },
 bikini(r,y,walk){
  // Star Rage Bikini: red bandeau and bottoms with gold star prints.
  bareLegs(r,walk,50);r.poly([[19,38+y],[37,38+y],[36,53],[20,53]],SKIN.shade);r.poly([[20,39+y],[36,39+y],[35,52],[21,52]],SKIN.base);r.line(28,46+y,28,50,SKIN.shade);
  r.rect(20,41+y,16,5,RED_DARK);r.rect(21,41+y,14,4,RED);r.line(21,41+y,34,41+y,RED_LIGHT);star(r,25,43+y,GOLD);star(r,31,43+y,GOLD);
  r.poly([[20,50],[36,50],[33,56],[23,56]],RED_DARK);r.poly([[21,50],[35,50],[32,55],[24,55]],RED);star(r,28,52,GOLD);r.rect(19,50,2,2,GOLD);r.rect(35,50,2,2,GOLD);
  sandals(r,walk,{color:RED_DARK});
  return {sleeve:SKIN.base,sleeveLight:SKIN.light,bare:true};
 },
 bathsuit(r,y,walk){
  // Starry Hot-Spring Yukata: crimson robe, gold obi and a scatter of stars.
  r.poly([[17,38+y],[39,38+y],[40+walk,65],[16+walk,65]],'#7d2e3f');r.poly([[18,39+y],[38,39+y],[38+walk,64],[18+walk,64]],'#b2414f');
  r.poly([[23,38+y],[28,46],[33,38+y],[31,38+y],[28,43],[25,38+y]],SKIN.base);r.line(23,38+y,28,47,'#f0e2c8');r.line(33,38+y,28,47,'#f0e2c8');r.line(28,48,26+walk,64,'#7d2e3f');
  r.rect(18,47,20,4,GOLD);r.rect(18,47,20,1,'#f5dc94');r.rect(31,50,4,5,'#b78b3a');
  for(const [x,yy]of [[21,42],[35,44],[22,56],[34,59],[29,61]])star(r,x+(yy>50?walk:0),yy,'#f0c86a');
  for(const [i,x]of [21,31].entries()){const d=i?walk:-walk;r.rect(x+d-1,66,7,4,'#5b3a2c');r.rect(x+d,66,5,1,'#f0e2c8');}
  return {sleeve:'#b2414f',sleeveLight:'#d26672',cuff:'#7d2e3f',wide:true};
 },
};
function arms(r,y,g,{attack,charging,special}){
 const sleeve={color:g.sleeve,light:g.sleeveLight,width:g.wide?6:5};
 const draw=(x0,y0,x1,y1)=>{
  if(g.rolled){limb(r,x0,y0,x1,y1,{color:SKIN.base,light:SKIN.light,width:4});limb(r,x0,y0,Math.round((x0+x1)/2),Math.round((y0+y1)/2),{...sleeve,hand:null});return;}
  limb(r,x0,y0,x1,y1,sleeve);if(g.cuff)r.rect(x1-1,y1+1,5,2,g.cuff);
 };
 if(charging){
  // Both palms gather a small dense star of mass in front of her chest.
  draw(18,40+y,23,44);draw(38,40+y,31,44);r.rect(26,42,4,4,'#eee5ce');r.rect(27,43,2,2,'#202638');r.put(25,43,GOLD);r.put(30,44,GOLD);return;
 }
 if(special){draw(18,40+y,10,31);draw(38,40+y,46,31);star(r,9,28,GOLD,'#fff4cc');star(r,47,28,GOLD,'#fff4cc');return;}
 if(attack){draw(18,40+y,11,34);draw(38,40+y,47,40);return;}
 // Idle: one hand on the hip, the other hanging loose.
 draw(18,40+y,14,53);limb(r,38,40+y,43,46,sleeve);limb(r,43,46,37,50,{...sleeve,width:4});
}
export function yukiPixels({frame=0,moving=false,pose='',attack=false,expression='neutral',blink=false,skin:skinId='default'}={}){
 const charging=pose==='singularity-charge',special=!!pose&&!charging,o=OUTFITS[skinId]||OUTFITS.default,paint=GARMENTS[skinId]||GARMENTS.default;
 if(pose)expression=charging?'focused':'ultimate';
 const r=canvas(),{walk,y:bob}=motion({frame,moving}),y=bob-2;
 backHair(r,o.hair,HAIR,walk,y);
 const g=paint(r,y,walk);
 arms(r,y,g,{attack,charging,special});
 head(r,y);
 const hurt=expression==='hurt',focus=charging||expression==='focused'||expression==='ultimate';
 for(const [x,side]of [[21,-1],[31,1]])eye(r,x,26+y,{iris:'#a07c5c',irisDark:'#5e4636',lash:INK,side,closed:blink,hurt,focus});
 // A lopsided, confident smile.
 if(expression==='neutral'){r.rect(26,34+y,4,1,'#5f3d46');r.put(30,33+y,'#5f3d46');r.rect(27,35+y,2,1,'#8a5a62');}else mouth(r,34+y,expression,{lip:'#5f3d46'});
 g.collar?.(r,y);frontHair(r,o.hair,HAIR,y);
 if(o.shades){r.rect(20,10+y,16,2,'#2b2b36');r.rect(21,10+y,5,2,'#6b4a3a');r.rect(30,10+y,5,2,'#6b4a3a');r.put(22,10+y,'#d6a678');r.put(31,10+y,'#d6a678');}
 if(o.flower){r.rect(37,14+y,4,4,'#e06a6e');r.put(38,15+y,'#ffd27a');r.put(36,16+y,'#f4a0a0');r.put(41,15+y,'#f4a0a0');}
 return selout(r.pixels,INK);
}
