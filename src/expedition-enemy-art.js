import {expeditionBossPixels} from './expedition-boss-art.js';
import {canvas,selout} from './hero-kit.js';

// Expedition cast on the shared 56 × 76 grid: Fairy Tail mages and beasts, the
// Orc Disaster's army and Charybdis spawn, Kokushibo, Acnologia and Milim.
// Everything is painted with the playable heroes' kit: layered tones and a
// selective outline that darkens each edge in its own colour.
export const EXPEDITION_PALETTES={
 eisenwald:['#4a5a52','#2a3532','#a9c7a0'],vulcan:['#e6e1d4','#a59f94','#fbf8ee'],phantomshade:['#5d5685','#2f2a4a','#a9a3d6'],
 orctrooper:['#8a9a5a','#55603a','#bcc78a'],megalodon:['#6f93ab','#3f5c74','#e4ecee'],lizardman:['#6fa06a','#3f6a44','#b4d8a0'],
 jellal:['#2f3f6e','#1b2444','#c7b1e8'],geld:['#7d8a52','#4a5232','#c7a86a'],kokushibo:['#6a3a62','#3a1f38','#c98fa8'],
 acnologia:['#2c3246','#161a28','#7d93c4'],milim:['#f0a6b8','#b8607a','#ffd6de'],
};
const INK='#232a3a',STEEL='#a9b2bc',STEEL_LIGHT='#e6ebf0',STEEL_DARK='#6a727c',BONE='#efe6cc',WOOD='#7a5636',WOOD_DARK='#4e3622',GLOW='#bff2ff';
const SKIN={base:'#f0d2bb',shade:'#cfa38e',light:'#fde8d8'};
const clamp=(n,max)=>Math.max(-max,Math.min(max,Math.round(n||0)));
function frame(m={}){const r=canvas();return {r,walk:clamp((m.leg||0)*.4,2),arm:clamp((m.arm||0)*.5,3),tail:clamp((m.tail||0)*.4,3),attack:!!m.attack};}
function boots(r,x,d,{color,light,sole}){r.rect(x-1+d,64,7,5,color);r.rect(x+d,64,2,3,light);r.rect(x-2+d,68,8,3,color);r.rect(x-1+d,70,7,1,sole);}

// Eisenwald dark mage: deep green hooded cloak with the guild's skull crest, pale
// gaunt face with a sneer, bone clasp, wind gathering in an open palm.
function eisenwald(m){
 const {r,walk,arm,tail,attack}=frame(m),{poly:P,rect:R,line:L,put}=r,w=tail*.5;
 const cloak='#3e5a4e',shade='#253a32',deep='#172520',light='#5f8272',wind='#b8e6c8';
 P([[15,34],[41,34],[46+w,66],[40,70],[34,67],[28,70],[22,67],[16,70],[10+w,66]],deep);
 P([[16,35],[40,35],[44+w,65],[39,67],[34,64],[28,67],[22,64],[17,67],[12+w,65]],shade);
 for(const [i,x]of [21,30].entries()){const d=i?walk:-walk;R(x+d,54,5,10,'#2a2e34');L(x+1+d,55,x+1+d,62,'#454a54');boots(r,x,d,{color:'#22242a',light:'#4a4c56',sole:'#121318'});}
 P([[18,36],[38,36],[40,58],[34,62],[22,62],[16,58]],cloak);L(28,38,28,60,shade);L(19,38,18,57,light);L(37,38,38,57,shade);
 R(18,50,20,2,'#2a2018');R(26,49,4,4,BONE);
 // Skull crest on the chest.
 R(24,41,8,6,BONE);R(25,43,2,2,deep);R(29,43,2,2,deep);put(28,45,deep);L(25,47,30,47,'#c8bea4');put(26,47,deep);put(29,47,deep);
 // Arms in wide sleeves; on the attack one palm opens with a swirl of wind.
 P([[16,37],[20,37],[16-arm*.3,52],[11-arm*.3,52]],shade);P([[17,38],[19,38],[15-arm*.3,51],[12-arm*.3,51]],cloak);R(12-arm*.3,52,4,3,SKIN.base);
 if(attack){P([[36,37],[40,37],[48,40],[46,44]],shade);L(38,39,46,41,cloak,2);R(47,38,4,4,SKIN.base);
  for(let i=0;i<10;i++){const a=i*.7,rr=2+i*.5;put(52+Math.round(Math.cos(a)*rr),36+Math.round(Math.sin(a)*rr),i%2?wind:'#ffffff');}}
 else{P([[36,37],[40,37],[45+arm*.3,52],[40+arm*.3,52]],shade);P([[37,38],[39,38],[44+arm*.3,51],[41+arm*.3,51]],cloak);R(40+arm*.3,52,4,3,SKIN.base);}
 // Hood framing a pale, sneering face.
 P([[15,34],[14,22],[17,12],[24,7],[32,7],[39,12],[42,22],[41,34],[37,30],[19,30]],deep);
 P([[16,32],[16,22],[19,13],[25,9],[31,9],[37,13],[40,22],[40,32],[36,28],[20,28]],shade);
 L(19,14,25,10,light);L(17,22,17,30,cloak);
 P([[20,19],[36,19],[36,28],[32,33],[24,33],[20,28]],'#d2b9a8');P([[21,20],[35,20],[35,27],[31,31],[25,31],[21,27]],'#e8d2c2');
 P([[19,18],[25,14],[31,14],[37,18],[37,21],[19,21]],deep);
 for(const x of [22,31]){L(x,23,x+3,23,'#14181a');R(x,24,3,1,'#f2f0e6');put(x+1,24,'#8a2a2a');}
 L(21,22,25,23,'#14181a');L(31,23,35,22,'#14181a');put(28,26,'#c0a090');L(26,29,30,28,'#7a4040');
 return selout(r.pixels,INK);
}

// Vulcan: hulking white forest ape with shaggy layered fur, a dark leathery face,
// a leering grin and a tuft on its crown; it beats its chest on the attack.
function vulcan(m){
 const {r,walk,arm,attack}=frame(m),{poly:P,rect:R,line:L,put}=r;
 const fur='#ece6d8',furShade='#b8b0a2',furDeep='#857d72',furLight='#fffdf6',face='#8c7470',faceLight='#a88c86';
 for(const [i,x]of [18,31].entries()){const d=i?walk:-walk;P([[x-1,50],[x+8,50],[x+9+d,64],[x-2+d,64]],furShade);R(x+d,51,7,12,fur);L(x+1+d,52,x+1+d,61,furLight);R(x-2+d,64,11,5,furShade);R(x-3+d,68,13,3,face);for(const t of [0,3,6,9])put(x-3+t+d,70,'#5a4a48');}
 // Barrel body with layered fur tufts and a bare chest.
 P([[11,32],[19,24],[37,24],[45,32],[46,48],[39,56],[17,56],[10,48]],furShade);P([[13,33],[20,26],[36,26],[43,33],[44,47],[38,54],[18,54],[12,47]],fur);
 P([[20,34],[36,34],[37,47],[28,52],[19,47]],'#d8ccbc');L(28,36,28,48,'#b8ac9c');L(21,40,26,41,'#b8ac9c');L(30,41,35,40,'#b8ac9c');
 for(const [x,y]of [[14,36],[42,36],[13,43],[43,43],[17,50],[39,50],[20,29],[36,29]])P([[x-2,y],[x,y+4],[x+2,y]],furDeep);
 for(const [x,y]of [[15,34],[41,34],[22,27],[34,27]])L(x,y,x+1,y+3,furLight);
 // Long arms; on the attack both fists rise to pound the chest.
 for(const s of [-1,1]){const p=x=>28+s*x,hx=attack?p(7):p(18+arm*.3*s),hy=attack?34:58;
  L(p(15),32,hx,hy-4,furShade,10);L(p(15),32,hx,hy-5,fur,7);L(p(16),33,hx,hy-8,furLight);
  R(hx-4,hy-4,9,6,face);R(hx-3,hy-4,7,2,faceLight);for(const t of [-3,0,3])put(hx+t,hy+1,'#5a4a48');}
 // Head: heavy brow, small fierce eyes, flat nose and a wide toothy leer.
 P([[17,18],[20,8],[28,4],[36,8],[39,18],[37,27],[19,27]],furShade);P([[19,18],[22,10],[28,6],[34,10],[37,18],[35,25],[21,25]],fur);
 for(const x of [23,28,33])P([[x-2,8],[x,0],[x+2,8]],x===28?furLight:fur);
 P([[21,13],[35,13],[36,22],[32,26],[24,26],[20,22]],face);P([[22,14],[34,14],[34,21],[31,24],[25,24],[22,21]],faceLight);
 L(21,15,26,16,'#5a4846',2);L(30,16,35,15,'#5a4846',2);
 R(23,17,3,2,'#fff2a8');put(24,17,'#3a2a20');R(30,17,3,2,'#fff2a8');put(31,17,'#3a2a20');
 R(26,20,4,1,'#5a4846');put(26,19,'#5a4846');put(29,19,'#5a4846');
 P([[22,22],[34,22],[32,26],[24,26]],'#3a2424');for(const x of [23,25,27,29,31,33])put(x,22,'#fffaf0');L(25,25,31,25,'#a85a5a');
 return selout(r.pixels,INK);
}

// Phantom Lord shade: a hooded wraith of violet smoke, glowing eyes in a void,
// skeletal claws and a frayed tail that never touches the ground.
function phantomshade(m){
 const {r,arm,tail,attack}=frame(m),{poly:P,rect:R,line:L,put}=r;
 const robe='#5a5288',shade='#38325c',deep='#221e3c',light='#8c84c0',hollow='#0e0c1a';
 // Frayed smoke tail.
 P([[16,40],[40,40],[42,54],[37+tail,64],[33,60],[30+tail,72],[26,62],[21+tail,68],[18,56]],deep);
 P([[18,41],[38,41],[40,53],[36+tail,61],[32,57],[30+tail,67],[26,58],[22+tail,63],[19,54]],shade);
 for(const [x0,x1]of [[22,22],[28,30],[34,36]])L(x0,44,x1+tail,62,deep);L(20,43,21,55,robe);
 // Robe body with a torn mantle.
 P([[15,30],[22,25],[34,25],[41,30],[42,46],[14,46]],shade);P([[17,31],[23,27],[33,27],[39,31],[40,45],[16,45]],robe);
 for(const x of [18,24,30,36])P([[x,44],[x+2,49],[x+4,44]],robe);L(18,32,17,44,light);L(28,30,28,44,shade);
 // Chain clasp.
 for(const x of [23,26,29,32])R(x,31,2,2,'#c8c4d8');
 // Skeletal claws reaching out.
 for(const s of [-1,1]){const p=x=>28+s*x,hx=attack?p(18):p(14+arm*.3*s),hy=attack?30:46;
  P([[p(10),31],[p(13),30],[hx+s*2,hy],[hx-s*2,hy+2]],shade);L(p(11),32,hx,hy,robe,3);
  for(let i=0;i<3;i++)L(hx-2+i*2,hy+1,hx-2+i*2+s,hy+6,'#e8e4f4');}
 if(attack)for(const [x,y]of [[6,22],[50,22],[28,1]]){R(x,y,3,3,light);put(x+1,y+1,'#ffffff');}
 // Deep hood and the void within; only the eyes and a thin grin show.
 P([[16,28],[17,15],[21,8],[28,4],[35,8],[39,15],[40,28],[34,31],[22,31]],deep);
 P([[18,27],[19,15],[23,9],[28,6],[33,9],[37,15],[38,27],[33,29],[23,29]],shade);P([[24,8],[28,6],[32,8],[30,10],[26,10]],light);
 P([[21,15],[35,15],[35,27],[28,30],[21,27]],hollow);
 for(const x of [23,30]){R(x,19,3,2,GLOW);put(x+1,19,'#ffffff');put(x+(x<28?2:0),21,'#6ab8d8');}
 L(25,25,31,25,'#3a3460');for(const x of [26,28,30])put(x,26,'#6a64a0');
 return selout(r.pixels,INK);
}

// Orc trooper of the Orc Disaster's army: boar face with tusks, mail under a riveted
// leather cuirass, round shield on the back and a heavy cleaver.
function orctrooper(m){
 const {r,walk,arm,attack}=frame(m),{poly:P,rect:R,line:L,put}=r;
 const hide='#8a9a5a',hideShade='#5a6838',hideLight='#b2c27c',leather='#6e5236',leatherShade='#4a3622',leatherLight='#8e6e4a',snout='#c9a27c';
 // Round wooden shield slung on the back.
 P([[10,32],[14,26],[42,26],[46,32],[44,40],[12,40]],WOOD_DARK);P([[12,32],[15,28],[41,28],[44,32],[42,38],[14,38]],WOOD);L(14,32,42,32,WOOD_DARK);
 for(const [i,x]of [20,31].entries()){const d=i?walk:-walk;R(x-1+d,52,7,11,leatherShade);R(x+d,52,5,10,'#5a4a3a');L(x+1+d,53,x+1+d,61,'#7a6650');boots(r,x,d,{color:'#3a322c',light:'#6a5e54',sole:'#1e1a16'});R(x-1+d,60,7,2,leather);}
 // Mail skirt, cuirass and belt.
 P([[17,48],[39,48],[41,57],[15,57]],'#6a727c');for(let y=50;y<57;y+=2)for(let x=17+(y%4?1:0);x<40;x+=2)put(x,y,'#9aa4ae');
 P([[16,34],[40,34],[41,49],[15,49]],leatherShade);P([[17,35],[39,35],[40,48],[16,48]],leather);L(18,36,17,47,leatherLight);L(28,36,28,47,leatherShade);
 for(const [x,y]of [[19,37],[37,37],[19,45],[37,45],[24,41],[32,41]])put(x,y,'#d8c08a');
 R(15,47,26,3,'#3a2a1a');R(26,46,5,5,'#c9a452');R(27,47,3,3,'#8a6a2a');
 // Shoulder plates.
 for(const s of [-1,1]){const p=x=>28+s*x;P([[p(8),33],[p(14),31],[p(16),36],[p(13),40],[p(9),38]],STEEL_DARK);P([[p(9),34],[p(13),32],[p(15),36],[p(12),38]],STEEL);put(p(12),34,STEEL_LIGHT);}
 // Arms and the cleaver: raised overhead on the attack, resting low otherwise.
 L(15,38,12-arm*.3,51,hideShade,6);L(15,38,13-arm*.3,50,hide,4);R(10-arm*.3,50,6,5,hide);R(10-arm*.3,48,6,2,leather);
 if(attack){L(41,38,44,28,hideShade,6);L(41,38,44,29,hide,4);R(41,25,6,5,hide);R(43,24,3,3,WOOD_DARK);P([[42,24],[45,4],[54,2],[54,22]],STEEL_DARK);P([[43,22],[46,5],[53,4],[53,20]],STEEL);L(46,6,52,5,STEEL_LIGHT);}
 else{L(41,38,44+arm*.3,50,hideShade,6);L(41,38,43+arm*.3,49,hide,4);R(41+arm*.3,49,6,5,hide);P([[44,54],[52,46],[56,52],[56,62],[48,64]],STEEL_DARK);P([[45,54],[52,48],[55,52],[55,60],[49,62]],STEEL);L(46,54,52,49,STEEL_LIGHT);R(42+arm*.3,51,3,4,WOOD_DARK);}
 // Boar head with ears, small red eyes, a broad snout and tusks.
 P([[16,20],[18,11],[24,7],[32,7],[38,11],[40,20],[39,29],[33,34],[23,34],[17,29]],hideShade);
 P([[17,20],[19,12],[24,9],[32,9],[37,12],[39,20],[38,28],[32,32],[24,32],[18,28]],hide);L(21,12,26,10,hideLight);L(30,10,35,12,hideLight);
 P([[18,14],[12,8],[16,18]],hideShade);P([[38,14],[44,8],[40,18]],hideShade);
 L(20,18,25,20,hideShade,2);L(31,20,36,18,hideShade,2);R(21,21,3,2,'#1e1a14');put(22,21,'#e0503a');R(32,21,3,2,'#1e1a14');put(33,21,'#e0503a');
 P([[22,24],[34,24],[35,29],[28,31],[21,29]],'#a07e5c');P([[23,24],[33,24],[34,28],[28,30],[22,28]],snout);R(25,26,2,2,'#3a2418');R(30,26,2,2,'#3a2418');
 L(23,31,33,31,'#3a2418');for(const [x,s]of [[22,-1],[34,1]])P([[x,31],[x+s*2,25],[x+s*2,31]],BONE);
 // Dented iron cap.
 P([[18,13],[21,7],[28,5],[35,7],[38,13]],STEEL_DARK);P([[19,12],[22,8],[28,6],[34,8],[37,12]],STEEL);L(22,8,27,6,STEEL_LIGHT);
 return selout(r.pixels,INK);
}

// Megalodon from Charybdis' brood: a storm shark gliding upright through the air,
// slate back, white belly, gill slits and a jaw full of teeth.
function megalodon(m){
 const {r,tail,attack}=frame(m),{poly:P,line:L,put,rect:R}=r;
 const back='#5f86a2',shade='#3a5a74',deep='#26405a',light='#86aac2',belly='#eef2f2',bellyShade='#c4ccd2';
 // Tail fin and pectoral fins.
 P([[8,40],[0+tail,26],[4+tail,24],[12,37]],deep);P([[8,42],[0+tail,58],[5+tail,58],[12,45]],deep);L(2+tail,27,10,39,shade);
 P([[20,47],[26,59],[30,58],[30,47]],shade);P([[34,46],[40,56],[43,55],[40,46]],shade);
 // Body.
 P([[6,41],[12,33],[24,28],[38,29],[48,33],[54,40],[48,47],[34,51],[18,50],[10,47]],deep);
 P([[8,41],[13,35],[24,30],[38,31],[47,35],[52,40],[47,45],[34,49],[18,48],[11,46]],back);
 P([[12,42],[30,42],[44,41],[50,41],[46,45],[34,48],[18,47],[12,45]],belly);L(14,46,44,45,bellyShade);
 L(14,37,40,32,light);for(const x of [36,38,40])L(x,35,x-1,40,deep);
 for(const [x,y]of [[20,44],[26,43],[24,46]])put(x,y,bellyShade);
 // Dorsal fin.
 P([[22,31],[28,14],[31,15],[34,31]],deep);P([[24,31],[28,17],[30,18],[32,31]],back);L(28,19,26,29,light);
 // Jaw and eye.
 const open=attack?4:1;P([[40,40],[55,37],[55,40+open],[42,43+open]],'#3a1a22');P([[42,41],[54,39],[54,40+open],[43,42+open]],'#8a2a3a');
 for(let x=42;x<55;x+=2){P([[x,39],[x+1,42],[x+2,39]],'#ffffff');P([[x,41+open],[x+1,39+open],[x+2,41+open]],'#ffffff');}
 R(43,35,3,3,'#0e141c');put(44,35,GLOW);L(42,34,46,33,deep);
 return selout(r.pixels,INK);
}

// Lizardman warrior: green scales with a pale banded belly, red crest, yellow slit
// eyes, leather harness and bracers, a long tail and a stone-tipped spear.
function lizardman(m){
 const {r,walk,arm,tail,attack}=frame(m),{poly:P,rect:R,line:L,put}=r;
 const scale='#6fa06a',shade='#45724a',deep='#2e5032',light='#a2cc8e',belly='#d2dcaa',bellyShade='#a8b884',crest='#d0583c',leather='#7a5438',leatherShade='#52381f';
 P([[30,50],[38,52],[46+tail,62],[52+tail,70],[46+tail,68],[34,58]],deep);P([[31,51],[37,53],[45+tail,62],[49+tail,67],[34,57]],scale);L(33,54,47+tail,65,light);
 for(const [i,x]of [20,30].entries()){const d=i?walk:-walk;
  P([[x-1,50],[x+7,50],[x+7+d,60],[x+5+d,64],[x+d,64],[x-2+d,58]],shade);R(x+d,51,5,11,scale);L(x+1+d,52,x+1+d,60,light);
  R(x-1+d,64,7,4,shade);R(x-2+d,67,9,4,scale);for(const t of [0,3,6])P([[x-2+t+d,70],[x-1+t+d,72],[x+t+d,70]],BONE);
 }
 // Torso with belly bands and a crossed harness.
 P([[17,32],[23,29],[33,29],[39,33],[38,50],[33,54],[22,54],[17,50]],shade);P([[19,33],[24,31],[32,31],[37,34],[36,49],[32,52],[23,52],[19,49]],scale);
 P([[22,34],[34,34],[33,49],[23,49]],belly);for(let y=36;y<49;y+=3)L(23,y,33,y,bellyShade);
 L(20,32,35,49,leatherShade,3);L(20,32,35,49,leather);R(19,48,18,3,leatherShade);R(26,47,4,5,'#c9a452');
 for(const [x,y]of [[21,36],[35,38],[20,44]])put(x,y,light);
 // Arms with leather bracers; the spear thrusts forward on the attack.
 L(18,34,14-arm*.3,49,shade,6);L(18,34,15-arm*.3,48,scale,4);R(12-arm*.3,44,6,3,leather);R(12-arm*.3,49,5,4,scale);
 if(attack){L(38,35,44,40,shade,6);L(38,35,44,39,scale,4);R(41,37,5,3,leather);L(24,42,55,36,WOOD_DARK,2);L(24,41,52,36,WOOD);P([[50,32],[56,36],[50,40]],'#8a9298');put(52,35,'#d8dee2');R(48,35,2,3,crest);}
 else{L(38,35,42+arm*.3,48,shade,6);L(38,35,41+arm*.3,47,scale,4);R(39+arm*.3,43,6,3,leather);R(40+arm*.3,48,5,4,scale);L(44,66,46,8,WOOD_DARK,2);L(44,64,46,10,WOOD);P([[43,10],[46,0],[49,10]],'#8a9298');put(46,4,'#d8dee2');R(44,10,4,2,crest);}
 // Head: long snout with a toothy line, yellow slit eye, red crest spikes.
 P([[17,20],[21,11],[31,9],[38,14],[46,18],[46,24],[37,28],[22,29],[17,25]],deep);
 P([[19,20],[22,13],[31,11],[37,16],[44,19],[44,23],[36,26],[23,27],[19,24]],scale);P([[22,14],[31,12],[36,16],[29,17],[22,18]],light);
 L(30,22,45,21,deep);for(const x of [33,36,39,42])put(x,22,'#ffffff');put(44,19,deep);
 R(25,16,4,3,'#f4d84a');L(27,16,27,18,'#1a1a12');L(23,15,29,14,deep);
 for(const [x,h]of [[20,6],[24,8],[28,8],[32,6]]){P([[x,13],[x+1,13-h],[x+3,12]],crest);put(x+1,14-h,'#f0906a');}
 return selout(r.pixels,INK);
}

const ENEMY_ART={eisenwald,vulcan,phantomshade,orctrooper,megalodon,lizardman};
export function expeditionEnemyPixels(id,m={}){return ENEMY_ART[id]?ENEMY_ART[id](m):expeditionBossPixels(id,m);}
