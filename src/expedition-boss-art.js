import {canvas,selout,mix} from './hero-kit.js';
// Hero-quality sprites for the Fairy Tail, Slime and Demon Slayer bosses, drawn on the
// playable characters' chibi skeleton: face rows 19–38, body 38–66, feet to 71.
// Phase II art follows the reference forms: Kokushibo bares his torso and branching
// flesh blade, Milim dons her dragon armour and wings, Acnologia becomes the Black Dragon.
const INK='#232a3a';
const clamp=(n,max)=>Math.max(-max,Math.min(max,Math.round(n||0)));
function frame(m={}){const r=canvas();return {r,walk:clamp((m.leg||0)*.4,2),arm:clamp((m.arm||0)*.5,3),tail:clamp((m.tail||0)*.4,3),attack:!!m.attack,enraged:!!m.enraged};}
function heart(r,x,y,color){r.put(x,y,color);r.put(x+2,y,color);r.rect(x,y+1,3,1,color);r.put(x+1,y+2,color);}
function sparkle(r,x,y,s,color,core='#ffffff'){r.line(x-s,y,x+s,y,color);r.line(x,y-s,x,y+s,color);r.put(x,y,core);}
// Shared face plate: rounded cheeks narrowing to the chin, shaded on the far side.
function facePlate(r,y,sk,{jaw=0}={}){
 const {poly:P,rect:R}=r;
 R(25,36+y,6,4,sk.shade);
 P([[18,19+y],[38,19+y],[38,29+y],[36,34+y+jaw],[31,38+y+jaw],[25,38+y+jaw],[20,34+y+jaw],[18,29+y]],sk.shade);
 P([[19,19+y],[37,19+y],[37,29+y],[35,33+y+jaw],[30,37+y+jaw],[26,37+y+jaw],[21,33+y+jaw],[19,29+y]],sk.base);
 R(21,31+y,2,1,sk.light);R(34,31+y,2,1,sk.light);R(36,25+y,1,5,sk.shade);
}

// ---------------------------------------------------------------- Jellal
// Spiky blue hair with a lock falling between the eyes, the red tattoo around his
// right eye, calm half-lidded dark eyes and a flat mouth. Teal high-collared coat
// with gold piping and heart rows, white segmented breastplate over a stone tunic,
// a royal-blue cape with white lining, baggy grey trousers and black boots.
const JL={hair:'#3f63cc',hairDark:'#24388a',hairDeep:'#18245e',hairLight:'#7da2ee',skin:{base:'#f3d6c0',shade:'#d4a994',light:'#fff0e2'},tattoo:'#b8262c',
 coat:'#2b4d4a',coatShade:'#1b3332',coatLight:'#41706a',gold:'#cfae52',goldDark:'#8a6e2c',cape:'#2f45a6',capeShade:'#1d2a6c',capeDeep:'#141c4a',lining:'#e9eef8',
 armor:'#eceef2',armorShade:'#a6abb6',tunic:'#b9b39d',tunicShade:'#8b8571',pants:'#5d5f68',pantsShade:'#3d3f47',pantsLight:'#7e818b',boot:'#1f2029',bootLight:'#4a4c58',heart:'#b5c4c0'};
function jellal(m){
 const {r,walk,arm,tail,attack,enraged}=frame(m),{poly:P,rect:R,line:L,put}=r,c=JL,w=tail*.6;
 if(enraged){
  // Heavenly Body magic: a ring of starlight and drifting stars behind him.
  for(let i=0;i<20;i++){const a=i/20*Math.PI*2;put(28+Math.round(Math.cos(a)*23),34+Math.round(Math.sin(a)*27),i%2?'#f6e7a8':'#c7b1e8');}
  for(const [x,y,s]of [[5,12,3],[50,16,3],[7,44,2],[49,48,2],[28,2,2],[12,66,2],[45,66,2]])sparkle(r,x,y,s,'#e8dcff');
 }
 // Cape: flows from the shoulders, lining showing down the trailing side.
 P([[16,38],[40,38],[47+w,58],[50+w,71],[41,68],[34,71],[26,68],[18,71],[9+w,70],[9+w,58]],c.capeShade);
 P([[17,39],[39,39],[45+w,58],[47+w,68],[40,66],[34,69],[26,66],[18,69],[11+w,68],[11+w,58]],c.cape);
 L(12+w,60,16,44,c.capeDeep);L(44+w,60,40,44,c.capeDeep);L(40,40,48+w,70,c.lining,2);L(40,40,47+w,69,'#ffffff');
 // Baggy trousers tucked into tall boots.
 for(const [i,x]of [21,30].entries()){const d=i?walk:-walk;
  P([[x-1,51],[x+6,51],[x+7+d,60],[x+6+d,64],[x-1+d,64],[x-2+d,58]],c.pantsShade);R(x+d,52,5,11,c.pants);L(x+1+d,53,x+1+d,61,c.pantsLight);
  R(x-1+d,63,7,6,c.boot);R(x+d,63,2,4,c.bootLight);R(x-2+d,68,8,3,c.boot);R(x-1+d,68,3,1,c.bootLight);
 }
 // Coat skirt split at the front over the stone tunic.
 P([[18,38],[38,38],[39,50],[41,62],[34,63],[28,58],[22,63],[15,62],[17,50]],c.coatShade);
 P([[19,39],[37,39],[38,50],[39,61],[34,61],[28,57],[22,61],[17,61],[18,50]],c.coat);
 L(19,42,17,60,c.coatLight);
 P([[24,44],[32,44],[33,57],[28,64],[23,57]],c.tunicShade);P([[25,44],[31,44],[32,56],[28,62],[24,56]],c.tunic);
 // The dark crest on the tunic.
 L(26,50,30,50,'#2a2c33');L(28,50,28,55,'#2a2c33');L(26,53,30,53,'#2a2c33');put(30,55,'#2a2c33');put(27,56,'#2a2c33');
 // Segmented breastplate.
 R(23,40,10,6,c.armorShade);R(24,40,8,5,c.armor);L(24,42,31,42,c.armorShade);L(24,44,31,44,c.armorShade);L(25,40,30,40,'#ffffff');
 // Gold piping and the heart rows down both coat fronts.
 L(23,40,23,57,c.gold);L(33,40,33,57,c.gold);L(22,57,22,61,c.gold);L(34,57,34,61,c.gold);
 for(const y of [43,47,51,55])heart(r,19,y,c.heart);for(const y of [43,47,51,55])heart(r,35,y,c.heart);
 // High collar with gold rim and black inner collar.
 P([[19,32],[24,37],[32,37],[37,32],[38,41],[18,41]],c.coatShade);P([[20,33],[24,38],[32,38],[36,33],[37,40],[19,40]],c.coat);
 L(19,33,18,40,c.gold);L(37,33,38,40,c.gold);R(25,37,6,3,'#1c1f27');
 // Cape draped over the shoulders, buckled across the chest.
 for(const s of [-1,1]){const p=(x,y)=>[28+s*x,y];P([p(7,39),p(12,37),p(15,40),p(15,46),p(11,48)],c.capeShade);P([p(8,39),p(12,38),p(14,41),p(14,45),p(11,46)],c.cape);L(...p(14,41),...p(14,46),c.lining);}
 R(21,40,14,2,c.capeShade);put(22,40,c.lining);put(34,40,c.lining);
 // Arms: one fist at his side, the other reaching out with an open palm.
 const sk=c.skin;
 L(17,42,14-arm*.3,53,c.coatShade,5);L(17,42,15-arm*.3,52,c.coatLight,3);L(17,43,15-arm*.3,51,c.coat);R(12-arm*.3,52,5,2,c.gold);R(13-arm*.3,54,4,3,sk.base);R(13-arm*.3,56,4,1,sk.shade);
 if(attack){
  L(39,42,48,39,c.coatShade,5);L(39,42,48,38,c.coatLight,3);L(40,42,47,39,c.coat);R(47,37,2,5,c.gold);
  R(49,36,4,5,sk.base);for(const [x,y]of [[53,36],[53,38],[53,40],[52,34]])R(x,y,2,1,sk.base);R(49,40,4,1,sk.shade);
  for(const [x,y]of [[54,30],[50,28],[55,44]])sparkle(r,x,y,1,'#e8dcff');
 }else{L(39,42,42+arm*.3,53,c.coatShade,5);L(39,42,41+arm*.3,52,c.coatLight,3);L(40,43,41+arm*.3,51,c.coat);R(39+arm*.3,52,5,2,c.gold);R(40+arm*.3,54,4,3,sk.base);R(40+arm*.3,56,4,1,sk.shade);}
 // Face: calm, heavy-lidded and unreadable.
 facePlate(r,0,sk);
 for(const [x,side]of [[21,-1],[31,1]]){
  L(x-(side<0?1:0),26,x+3+(side>0?1:0),26,'#1e1a24');R(x,27,4,2,'#f6f2ec');R(x+(side<0?1:0),27,2,2,enraged?'#8a6ad8':'#4a3428');put(x+(side<0?1:0),27,'#241a18');put(x+(side<0?2:1),28,enraged?'#e2d6ff':'#8a6a52');
 }
 L(20,24,24,23,c.hairDark);L(31,23,35,24,c.hairDark);put(28,31,sk.shade);L(27,34,29,34,'#9c5e5a');
 // His tattoo: a red line from the brow that curls round the eye and down the cheek.
 L(23,21,23,24,c.tattoo);put(22,24,c.tattoo);put(20,25,c.tattoo);L(20,26,20,29,c.tattoo);put(21,30,c.tattoo);L(22,30,23,31,c.tattoo);put(24,30,c.tattoo);
 // Hair: wild crown spikes, a jagged fringe and the lock between his eyes.
 P([[15,31],[14,22],[14,15],[10,12],[16,11],[17,6],[22,7],[24,2],[29,6],[34,3],[36,8],[42,6],[40,12],[44,15],[41,20],[42,31],[39,26],[38,21],[18,21],[17,26]],c.hairDeep);
 P([[16,28],[15,21],[16,15],[13,13],[17,12],[19,8],[23,9],[25,4],[29,8],[34,5],[35,10],[40,8],[38,13],[41,16],[39,20],[40,27],[38,22],[18,22],[17,25]],c.hairDark);
 P([[17,25],[17,17],[21,12],[28,10],[35,12],[39,17],[39,25],[37,22],[35,25],[33,21],[31,24],[29,21],[28,28],[27,21],[25,24],[22,20],[20,24]],c.hair);
 L(20,15,26,12,c.hairLight);L(30,12,35,14,c.hairLight);L(28,22,28,26,c.hairDark);L(25,6,26,8,c.hairLight);L(33,7,35,6,c.hairLight);put(18,19,c.hairLight);
 return selout(r.pixels,INK);
}

// ---------------------------------------------------------------- Geld
// Orc Lord: boar head with upturned tusks and small yellow eyes, olive hide, dark
// iron cuirass with gold rivets under a brown fur mantle, and a huge meat cleaver.
// As the Orc Disaster his hide darkens, a starving violet aura rises and his jaw opens.
const GD={hide:'#7f8c4e',hideShade:'#56613a',hideLight:'#a8b46e',snout:'#c7a27a',snoutShade:'#9a7656',tusk:'#f1e6c8',iron:'#4a4e5a',ironShade:'#2e313a',ironLight:'#737a8a',gold:'#cfa452',fur:'#7a5634',furShade:'#523822',furLight:'#9e7a52',steel:'#a9b2bc',steelLight:'#e6ebf0',steelDark:'#6a727c',grip:'#5a3e2a',cloth:'#5a4630',clothShade:'#3c2e1e'};
function geld(m){
 const {r,walk,arm,attack,enraged}=frame(m),{poly:P,rect:R,line:L,put}=r,c=GD;
 const hide=enraged?'#5e6a3e':c.hide,hideShade=enraged?'#3c4528':c.hideShade,hideLight=enraged?'#7f8c54':c.hideLight;
 if(enraged){
  // Starved aura: violet flames licking upward around his bulk.
  P([[6,66],[4,46],[8,30],[6,16],[13,22],[16,8],[22,16],[28,4],[34,16],[40,8],[43,22],[50,16],[48,30],[52,46],[50,66]],'#2e1c3e');
  P([[9,64],[8,46],[11,32],[10,22],[15,26],[18,14],[23,20],[28,10],[33,20],[38,14],[41,26],[46,22],[45,32],[48,46],[47,64]],'#4a2c62');
 }
 // Cleaver resting low behind him, or raised overhead when he attacks.
 if(attack){P([[42,24],[44,0],[55,0],[55,22]],c.steelDark);P([[43,22],[45,1],[54,1],[54,20]],c.steel);L(46,2,53,2,c.steelLight);L(45,6,45,20,c.steelLight);R(44,22,4,6,c.grip);R(42,21,8,2,c.gold);for(const y of [8,14,20])put(52,y,c.steelDark);}
 else{P([[44,58],[53,40],[56,42],[56,70],[47,72]],c.steelDark);P([[45,58],[53,42],[55,43],[55,68],[48,70]],c.steel);L(46,58,53,44,c.steelLight);R(47,52,3,8,c.grip);put(53,58,c.steelDark);put(51,64,c.steelDark);}
 // Thick legs in hide wraps and iron-shod feet.
 for(const [i,x]of [18,31].entries()){const d=i?walk:-walk;
  P([[x-2,52],[x+8,52],[x+9+d,63],[x-3+d,63]],hideShade);R(x-1+d,53,8,9,hide);L(x+d,54,x+d,61,hideLight);
  R(x-1+d,58,9,2,c.cloth);R(x-3+d,63,12,5,c.iron);R(x-2+d,63,10,1,c.ironLight);R(x-4+d,68,14,3,c.ironShade);R(x-3+d,68,12,1,c.iron);
 }
 // Belly, cuirass and loincloth.
 P([[14,38],[42,38],[44,52],[40,60],[16,60],[12,52]],hideShade);P([[15,39],[41,39],[43,51],[39,58],[17,58],[13,51]],hide);
 P([[15,40],[41,40],[42,50],[28,54],[14,50]],c.ironShade);P([[16,41],[40,41],[41,49],[28,52],[15,49]],c.iron);
 L(17,42,17,48,c.ironLight);L(28,42,28,51,c.ironShade);L(16,45,40,45,c.ironShade);L(18,46,38,46,c.ironLight);for(const [x,y]of [[18,43],[38,43],[18,48],[38,48],[28,44]])put(x,y,c.gold);
 R(14,51,28,3,c.clothShade);R(25,50,6,5,c.tusk);R(26,51,1,1,'#2a2018');R(29,51,1,1,'#2a2018');L(26,53,29,53,'#8a7a5a');
 P([[20,54],[36,54],[34,63],[22,63]],c.clothShade);P([[21,54],[35,54],[33,62],[23,62]],c.cloth);L(24,56,25,61,'#7a6044');
 // Fur mantle across the shoulders.
 P([[7,40],[12,33],[22,31],[34,31],[44,33],[49,40],[45,44],[40,40],[16,40],[11,44]],c.furShade);
 P([[8,39],[13,34],[22,32],[34,32],[43,34],[48,39],[44,42],[40,39],[16,39],[12,42]],c.fur);
 for(const x of [12,17,22,27,32,37,42])L(x,35,x-1,40,c.furLight);
 // Massive arms.
  // Massive arms hang outside the gut: iron bracers and knuckled fists.
 const ax=-arm*.3;
 L(10,38,6+ax,50,hideShade,9);L(10,39,7+ax,49,hide,6);L(9,39,6+ax,46,hideLight);R(3+ax,48,9,4,c.iron);R(3+ax,48,9,1,c.ironLight);
 R(3+ax,52,9,7,hideShade);R(4+ax,52,7,6,hide);for(const x of [5,7,9])put(x+ax,55,hideShade);
 if(attack){L(46,38,46,30,hideShade,9);L(46,39,46,31,hide,6);R(41,29,9,3,c.iron);R(41,24,8,6,hide);for(const x of [43,45,47])put(x,27,hideShade);}
 else{L(46,38,49-ax,50,hideShade,9);L(46,39,48-ax,49,hide,6);R(44-ax,48,9,4,c.iron);R(44-ax,48,9,1,c.ironLight);R(44-ax,52,9,7,hideShade);R(45-ax,52,7,6,hide);for(const x of [46,48,50])put(x-ax,55,hideShade);}
 // Boar head: heavy brow, small eyes, broad snout and tusks.
 P([[14,22],[16,13],[22,8],[34,8],[40,13],[42,22],[41,32],[35,38],[21,38],[15,32]],hideShade);
 P([[15,22],[17,14],[22,10],[34,10],[39,14],[41,22],[40,31],[34,36],[22,36],[16,31]],hide);
 L(19,13,27,11,hideLight);L(30,11,36,13,hideLight);
 // Ears.
 P([[15,16],[9,9],[13,19]],hideShade);P([[41,16],[47,9],[43,19]],hideShade);P([[14,15],[11,11],[14,18]],c.snout);P([[42,15],[45,11],[42,18]],c.snout);
 // Brow ridge and eyes.
 L(18,21,25,23,hideShade,2);L(31,23,38,21,hideShade,2);
 const eyeC=enraged?'#f6e45a':'#e8a43a';R(20,24,4,2,'#1e1a14');R(21,24,2,2,eyeC);put(21,24,'#fff6c0');R(32,24,4,2,'#1e1a14');R(33,24,2,2,eyeC);put(33,24,'#fff6c0');
 // Snout and jaw.
 P([[21,27],[35,27],[36,33],[28,35],[20,33]],c.snoutShade);P([[22,27],[34,27],[35,32],[28,34],[21,32]],c.snout);
 R(24,29,3,2,'#3a2418');R(30,29,3,2,'#3a2418');L(23,27,33,27,'#e2c49a');
 if(enraged||attack){P([[22,34],[34,34],[32,39],[24,39]],'#3a1a1a');L(24,35,32,35,'#a83a3a');put(26,39,'#c8e0a0');put(30,40,'#c8e0a0');}
 else L(23,34,33,34,'#3a2418');
 for(const [x,s]of [[20,-1],[36,1]]){P([[x,33],[x+s*3,26],[x+s*2,34]],c.tusk);put(x+s*2,27,'#ffffff');}
 // Crown of bones over the brow.
 for(const [x,h]of [[19,4],[23,6],[28,8],[33,6],[37,4]]){P([[x-2,11],[x,11-h],[x+2,11]],c.tusk);put(x,12-h,'#ffffff');}
 R(17,10,22,2,'#8a7a5a');
 return selout(r.pixels,INK);
}

// ---------------------------------------------------------------- Kokushibo
// Upper Moon One. Six eyes in three pairs (gold irises in red sclera with the dark
// rank character), crimson flame markings on a pale face, wild dark-maroon hair tied
// back. Phase I: purple kimono with the black diamond check, white collar and obi,
// black hakama, white tabi and violet zori, his eye-studded flesh katana at the hip.
// Phase II: torso bared and corded with markings, hair loose, hakama lined in violet,
// the blade grown long and branching, eyes all along it.
const KK={skin:{base:'#eee1d8',shade:'#c8b2a8',light:'#fbf2ec'},mark:'#a8202e',markDark:'#701420',hair:'#3a1c26',hairDark:'#1e0e14',hairLight:'#6e2a3a',hairRed:'#8a2a3a',
 kimono:'#6a3f8c',kimonoShade:'#45285e',kimonoLight:'#8a62b0',check:'#1c1424',white:'#efebe4',whiteShade:'#bdb6ac',hakama:'#1d1b24',hakamaShade:'#100f16',hakamaLight:'#36323f',lining:'#7c4fb0',
 blade:'#9a3444',bladeDark:'#5e1a28',bladeLight:'#d86a70',bladeEye:'#f4c048',tsuba:'#6c5ad0',zori:'#7a5aa8'};
function sixEyes(r,y,{blink=false}={}){
 const {rect:R,put,line:L}=r;
 // Middle pair is the largest; the upper pair sits on the brow, the lower on the cheeks.
 // Each eye: dark upper lash, rosy sclera, a gold iris and a dark rank mark at its centre.
 const eye=(x,yy,w,h,side)=>{R(x,yy,w,h,'#e8707c');R(x+(side<0?1:w-3),yy,2,h,KK.bladeEye);put(x+(side<0?1:w-3)+(h>2?1:0),yy+h-1,'#8a1e1e');L(x,yy-1,x+w-1,yy-1,'#3a1018');put(side<0?x-1:x+w,yy,'#3a1018');};
 if(blink){for(const x of [21,31])L(x,27+y,x+3,27+y,'#2a1016');return;}
 eye(21,26+y,4,3,-1);eye(31,26+y,4,3,1);
 eye(22,22+y,3,2,-1);eye(31,22+y,3,2,1);
 eye(22,31+y,3,2,-1);eye(31,31+y,3,2,1);
}
function kokushiboFace(r,y,enraged){
 const {line:L,put,rect:R}=r,c=KK;
 facePlate(r,y,c.skin);
 sixEyes(r,y);
 // Flame markings: up the centre of the brow, along the jaw and under the eyes.
 // Flame markings: a flicker up the centre of the brow and curls along the jaw.
 put(28,20+y,c.mark);put(27,21+y,c.mark);L(28,22+y,28,24+y,c.mark);put(29,21+y,c.markDark);
 for(const s of [-1,1]){put(28+s*9,30+y,c.mark);put(28+s*9,32+y,c.mark);put(28+s*8,33+y,c.mark);put(28+s*7,35+y,c.markDark);}
 if(enraged)for(const s of [-1,1]){put(28+s*9,22+y,c.mark);put(28+s*8,21+y,c.mark);}
 L(26,35+y,30,35+y,'#8a4a52');put(28,29+y,c.skin.shade);
}
function kokushiboHair(r,y,loose){
 const {poly:P,line:L}=r,c=KK;
 // Long mane behind the back; loose and wilder in Phase II.
 if(loose){P([[12,22],[8,30],[10,40],[6,50],[12,48],[14,58],[18,50],[38,50],[42,58],[44,48],[50,50],[46,40],[48,30],[44,22]],c.hairDark);P([[14,24],[11,32],[13,42],[11,48],[15,46],[17,52],[39,52],[41,46],[45,48],[43,42],[45,32],[42,24]],c.hair);for(const x of [14,42])L(x,30,x+(x<28?-2:2),46,c.hairRed);}
 else{P([[16,22],[14,32],[17,46],[22,50],[34,50],[39,46],[42,32],[40,22]],c.hairDark);P([[17,24],[16,32],[19,44],[37,44],[40,32],[39,24]],c.hair);}
 // Crown: centre-parted, swept back into spikes.
 P([[14,30],[13,20],[11,14],[16,14],[17,8],[22,9],[25,3],[29,7],[33,3],[36,9],[41,8],[40,14],[45,14],[43,20],[42,30],[39,22],[37,19],[29,18],[28,20],[27,18],[19,19],[17,22]],c.hairDark);
 P([[16,26],[15,19],[18,15],[19,10],[23,11],[26,6],[29,10],[33,6],[35,11],[39,10],[38,15],[41,19],[40,26],[38,20],[29,17],[28,19],[27,17],[18,20]],c.hair);
 L(19,14,24,11,c.hairLight);L(32,11,37,14,c.hairLight);L(16,18,16,24,c.hairRed);L(40,18,40,24,c.hairRed);
}
function fleshBlade(r,x0,y0,x1,y1,{branches=false}={}){
 const {line:L,rect:R,put}=r,c=KK,len=Math.hypot(x1-x0,y1-y0),n=Math.max(2,Math.floor(len/6));
 L(x0,y0,x1,y1,c.bladeDark,3);L(x0,y0,x1,y1,c.blade,2);L(x0,y0,x1,y1,c.bladeLight);
 for(let i=1;i<=n;i++){const t=i/(n+1),x=Math.round(x0+(x1-x0)*t),y=Math.round(y0+(y1-y0)*t);R(x-1,y-1,3,3,c.bladeDark);put(x,y,c.bladeEye);put(x,y-1,'#ffe8a0');}
 if(branches)for(const t of [.35,.6,.82]){const x=Math.round(x0+(x1-x0)*t),y=Math.round(y0+(y1-y0)*t);L(x,y,x-7,y-4,c.bladeDark,2);L(x,y,x-7,y-4,c.blade);put(x-5,y-3,c.bladeEye);L(x,y,x+5,y-7,c.bladeDark,2);L(x,y,x+5,y-7,c.blade);put(x+4,y-6,c.bladeEye);}
 R(x0-2,y0-2,5,4,c.tsuba);put(x0,y0-1,'#b8a8ff');
}
function kokushibo(m){
 const {r,walk,arm,tail,attack,enraged}=frame(m),{poly:P,rect:R,line:L,put}=r,c=KK,sk=c.skin;
 kokushiboHair(r,0,enraged);
 if(enraged){
  // Branching flesh blade held across the body, dripping eyes.
  if(!attack)fleshBlade(r,42,46,50,12,{branches:true});
 }
 // Hakama legs, tabi and zori.
 for(const [i,x]of [20,30].entries()){const d=i?walk:-walk;
  R(x+d,62,6,5,c.white);R(x+d,62,1,5,c.whiteShade);R(x-1+d,67,8,3,c.zori);R(x-1+d,69,8,2,'#3c2a52');L(x+2+d,66,x+3+d,67,'#3c2a52');
 }
 // Wide hakama with pleats; Phase II shows the violet lining at the side slits.
 P([[17,50],[39,50],[42,63],[34,64],[28,61],[22,64],[14,63]],c.hakamaShade);P([[18,51],[38,51],[40,62],[34,62],[28,59],[22,62],[16,62]],c.hakama);
 for(const x of [21,25,31,35])L(x,52,x+(x<28?-1:1),61,c.hakamaLight);
 if(enraged){P([[14,63],[17,54],[18,63]],c.lining);P([[42,63],[39,54],[38,63]],c.lining);}
 if(enraged){
  // Bare, corded torso with crimson markings over the chest and arms.
  P([[17,37],[39,37],[40,46],[37,52],[19,52],[16,46]],sk.shade);P([[18,38],[38,38],[39,46],[36,51],[20,51],[17,46]],sk.base);
  L(28,39,28,50,sk.shade);L(20,43,26,44,sk.shade);L(30,44,36,43,sk.shade);for(const y of [46,49])L(23,y,33,y,sk.shade);L(25,46,25,50,sk.shade);L(31,46,31,50,sk.shade);
  L(19,39,22,40,sk.light);L(34,40,37,39,sk.light);
  put(21,39,c.mark);put(20,41,c.mark);put(35,39,c.mark);put(36,41,c.mark);
 }else{
  // Kimono with the black diamond check, white collar crossing at the chest.
  P([[16,37],[40,37],[41,52],[15,52]],c.kimonoShade);P([[17,38],[39,38],[40,51],[16,51]],c.kimono);
  for(const [row,y]of [[0,41],[1,46]])for(let x=15+row*5;x<42;x+=10)P([[x,y],[x+4,y-4],[x+8,y],[x+4,y+4]],c.check);
  L(18,39,18,50,c.kimonoLight);
  P([[24,37],[28,46],[32,37]],sk.base);L(23,37,28,47,c.white,2);L(33,37,28,47,c.white,2);
 }
 // White obi tied with a knot at the front.
 R(17,48,22,4,c.white);R(17,51,22,1,c.whiteShade);R(25,47,6,6,c.white);R(26,48,4,4,c.whiteShade);L(26,52,24,57,c.white,2);L(30,52,32,57,c.white,2);
 // Sleeves and hands; arms bare in Phase II.
 const sleeve=(x0,y0,x1,y1)=>{if(enraged){L(x0,y0,x1,y1,sk.shade,5);L(x0,y0,x1,y1,sk.base,3);put(Math.round((x0+x1)/2),Math.round((y0+y1)/2),c.mark);}else{P([[x0-3,y0],[x0+3,y0],[x1+4,y1+2],[x1-4,y1+2]],c.kimonoShade);P([[x0-2,y0+1],[x0+2,y0+1],[x1+3,y1+1],[x1-3,y1+1]],c.kimono);L(x1-3,y1+1,x1+3,y1+1,c.check);}};
 sleeve(17,39,14-arm*.3,52);R(12-arm*.3,53,4,4,sk.base);R(12-arm*.3,56,4,1,sk.shade);
 if(attack){sleeve(39,39,45,36);R(44,33,4,4,sk.base);fleshBlade(r,46,34,55,enraged?2:8,{branches:enraged});}
 else{sleeve(39,39,42+arm*.3,52);R(41+arm*.3,53,4,4,sk.base);R(41+arm*.3,56,4,1,sk.shade);if(!enraged){fleshBlade(r,40,50,49,72);}}
 kokushiboFace(r,0,enraged);
 // Side locks fall over the cheeks.
 P([[16,20],[19,20],[19,33],[17,36],[15,30]],c.hair);P([[40,20],[37,20],[37,33],[39,36],[41,30]],c.hair);
 return selout(r.pixels,INK);
}

// ---------------------------------------------------------------- Acnologia
// Human: a vast mane of dark blue hair, dark skin with pale blue markings, narrow
// pale eyes and a thin smirk. Tattered charcoal cloak over a fang necklace, bare
// chest, grey sash, torn navy trousers with pale flame shapes, bare feet.
// Black Dragon: grey-muscled body with black limbs, cyan tribal markings, feathered
// black-and-cyan wings, a horned dragon head and a long barbed tail.
const AC={hair:'#33426e',hairDark:'#1e2848',hairDeep:'#131a30',hairLight:'#566aa2',skin:{base:'#9a6c4e',shade:'#704a34',light:'#b98a6a'},mark:'#9fb8e6',
 cloak:'#3b3d46',cloakShade:'#25262d',cloakLight:'#565964',fang:'#f2ecd8',sash:'#8a8c94',sashShade:'#5e6068',pants:'#363f6e',pantsShade:'#232a4c',flame:'#a9b9de',
 black:'#14161e',blackLight:'#2a2e3c',cyan:'#38c8ea',cyanLight:'#a8f0ff',grey:'#8a909e',greyShade:'#555b68',greyLight:'#b4bac6'};
function acnologiaHuman(m,{r,walk,arm,tail,attack}){
 const {poly:P,rect:R,line:L,put}=r,c=AC,sk=c.skin,w=tail*.5;
 // Mane: billowing out past the shoulders and down the back.
 P([[14,10],[8,14],[10,20],[4,24],[8,30],[3,38],[8,42],[5,52],[12,50],[14,58],[20,48],[36,48],[42,58],[44,50],[51,52],[48,42],[53,38],[48,30],[52,24],[46,20],[48,14],[42,10]],c.hairDeep);
 P([[15,12],[11,16],[12,21],[7,25],[11,30],[7,38],[11,41],[9,49],[14,47],[16,53],[21,46],[35,46],[40,53],[42,47],[47,49],[45,41],[49,38],[45,30],[49,25],[44,21],[45,16],[41,12]],c.hairDark);
 for(const [x0,y0,x1,y1]of [[11,24,7,36],[13,34,10,46],[45,24,49,36],[43,34,46,46],[12,16,9,24],[44,16,47,24],[15,44,13,52],[41,44,43,52]])L(x0,y0,x1,y1,c.hair);for(const [x,y]of [[9,25],[47,25],[8,37],[48,37]])r.put(x,y,c.hairLight);
 // Cloak: hood-like collar round the neck, falling to tattered points.
 P([[13,36],[19,33],[37,33],[43,36],[48+w,58],[50+w,70],[44,67],[40,71],[36,66],[30,70],[26,66],[20,71],[16,66],[11,70],[6+w,68],[8+w,58]],c.cloakShade);
 P([[14,37],[20,34],[36,34],[42,37],[46+w,58],[47+w,67],[43,65],[40,68],[36,63],[30,67],[26,63],[20,68],[16,63],[11,67],[9+w,65],[10+w,58]],c.cloak);
 L(14,40,10+w,62,c.cloakLight);L(42,40,46+w,62,c.cloakShade);
 // Bare feet.
 for(const [i,x]of [21,30].entries()){const d=i?walk:-walk;R(x+d,60,5,8,sk.base);R(x+4+d,60,1,8,sk.shade);R(x-1+d,67,7,3,sk.base);R(x-1+d,69,7,1,sk.shade);for(const t of [0,2,4])put(x-1+t+d,69,sk.light);}
 // Torn navy trousers with pale flame shapes.
 P([[19,50],[37,50],[38,60],[36,63],[34,60],[32,63],[30,60],[28,62],[26,60],[24,63],[22,60],[20,63],[18,60]],c.pantsShade);
 P([[20,50],[36,50],[37,59],[35,61],[33,59],[31,61],[29,59],[27,60],[25,59],[23,61],[21,59],[19,59]],c.pants);
 L(28,52,28,59,c.pantsShade);P([[21,53],[24,52],[23,55],[25,57],[21,58]],c.flame);P([[35,52],[32,54],[34,55],[32,58],[35,58]],c.flame);
 // Bare, muscled chest and abdomen.
 P([[19,36],[37,36],[38,44],[36,51],[20,51],[18,44]],sk.shade);P([[20,37],[36,37],[37,44],[35,50],[21,50],[19,44]],sk.base);
 L(28,39,28,49,sk.shade);L(21,42,26,43,sk.shade);L(30,43,35,42,sk.shade);for(const y of [45,48])L(24,y,32,y,sk.shade);L(21,39,24,38,sk.light);L(32,38,35,39,sk.light);
 R(19,48,18,3,c.sash);R(19,50,18,1,c.sashShade);P([[20,50],[23,50],[22,55],[19,54]],c.sash);
 // Grey scarf and fang necklace.
 R(23,35,10,3,c.sash);R(23,37,10,1,c.sashShade);
 for(const [x,h]of [[23,2],[25,3],[27,4],[29,4],[31,3],[33,2]]){R(x,38,2,h,c.fang);put(x,38,'#ffffff');}
 // Arms: dark, corded, one marked with a pale swirl; fists ready.
 L(18,38,15-arm*.3,50,sk.shade,5);L(18,38,16-arm*.3,49,sk.base,3);L(16,42,15,46,c.mark);put(17,44,c.mark);R(13-arm*.3,50,5,5,sk.base);R(13-arm*.3,54,5,1,sk.shade);
 if(attack){L(38,38,47,33,sk.shade,5);L(38,38,47,32,sk.base,3);R(46,29,6,6,sk.base);R(46,34,6,1,sk.shade);for(const [x,y]of [[53,26],[50,24],[54,33]])sparkle(r,x,y,1,c.cyan,c.cyanLight);}
 else{L(38,38,41+arm*.3,50,sk.shade,5);L(38,38,40+arm*.3,49,sk.base,3);R(39+arm*.3,50,5,5,sk.base);R(39+arm*.3,54,5,1,sk.shade);}
 // Face: narrow pale eyes under a heavy brow, markings on the cheeks, a thin smirk.
 facePlate(r,0,sk);
 for(const [x,side]of [[21,-1],[31,1]]){L(x-(side<0?1:0),26,x+3+(side>0?1:0),26,'#141018');R(x,27,4,2,'#e8eef4');R(x+(side<0?1:0),27,2,2,'#8aa2c2');put(x+(side<0?1:0),27,'#2a3450');}
 L(20,24,24,25,c.hairDeep);L(32,25,36,24,c.hairDeep);
 for(const s of [-1,1]){L(28+s*9,30,28+s*7,31,'#34406e');L(28+s*9,32,28+s*7,33,'#34406e');}
 L(26,34,30,34,'#3a2418');put(31,33,'#3a2418');put(28,31,sk.shade);
 // Front of the mane: spiky fringe and long locks either side of the face.
 P([[14,33],[13,22],[15,14],[19,9],[24,8],[28,5],[32,8],[37,9],[41,14],[43,22],[42,33],[39,26],[38,21],[35,24],[33,20],[30,23],[28,19],[26,23],[23,20],[21,24],[18,21],[17,27]],c.hairDark);
 P([[16,26],[16,17],[20,12],[28,8],[36,12],[40,17],[40,26],[38,21],[35,22],[33,19],[30,21],[28,18],[26,21],[23,19],[21,22],[18,19]],c.hair);
 L(20,14,26,10,c.hairLight);L(30,10,36,14,c.hairLight);L(16,20,15,30,c.hairLight);
 return selout(r.pixels,INK);
}
function acnologiaDragon(m,{r,walk,arm,tail,attack}){
 const {poly:P,rect:R,line:L,put}=r,c=AC,flap=arm;
 // Feathered wings: a fan of seven broad plumes per side, slate with cyan streaks,
 // spreading up and out from behind the shoulders.
 for(const s of [-1,1]){
  const bx=28+s*10,by=34,plume=i=>{const a=-1.62+i*.25,len=[27,28,27,25,22,19,15][i]-(i<4?flap*.6:0);return {a,len,dir:[Math.cos(a)*s,Math.sin(a)]};};
  const at=(i,t)=>{const {len,dir}=plume(i);return [bx+dir[0]*len*t,by+dir[1]*len*t];};
  const fan=[[bx,by]];for(let i=0;i<7;i++){fan.push(at(i,1));if(i<6){const q=at(i,.72),q2=at(i+1,.72);fan.push([(q[0]+q2[0])/2,(q[1]+q2[1])/2]);}}fan.push([bx,by+4]);
  P(fan,'#1c2030');
  for(let i=0;i<7;i++){const [x0,y0]=at(i,.35),[x1,y1]=at(i,.92);L(Math.round(x0),Math.round(y0),Math.round(x1),Math.round(y1),c.cyan,i%2?1:2);
   if(i<6){const q=at(i,.72),q2=at(i+1,.72);L(bx,by,Math.round((q[0]+q2[0])/2),Math.round((q[1]+q2[1])/2),c.black);}}
  L(bx,by,...at(0,1).map(Math.round),c.blackLight);
 }
 // Long tail sweeping down and back, ending in a barbed blade.
 const tw=tail;
 P([[30,54],[36,56],[44+tw,62],[50+tw,66],[52+tw,72],[46+tw,68],[38,62],[30,59]],c.black);L(32,56,47+tw,65,c.cyan);
 P([[50+tw,66],[55,70],[53+tw,75],[49+tw,71]],c.blackLight);put(52+tw,71,c.cyan);
 // Digitigrade black legs with claws.
 for(const [i,x]of [20,31].entries()){const d=i?walk:-walk;
  P([[x-1,50],[x+6,50],[x+7+d,58],[x+4+d,64],[x+6+d,70],[x-2+d,70],[x+d,63],[x-2+d,57]],c.black);
  L(x+1,52,x+3+d,58,c.cyan);L(x+3+d,60,x+2+d,66,c.cyan);for(const t of [-2,1,4])P([[x+t+d,70],[x+t+1+d,73],[x+t+2+d,70]],c.greyLight);
 }
 // Muscular grey torso, black flanks and cyan markings.
 P([[17,31],[39,31],[40,42],[37,54],[19,54],[16,42]],c.black);P([[19,32],[37,32],[38,41],[34,51],[22,51],[18,41]],c.grey);L(19,33,19,40,c.greyLight);
 L(28,35,28,51,c.greyShade);L(20,38,26,40,c.greyShade);L(30,40,36,38,c.greyShade);for(const y of [43,46,49])L(23,y,33,y,c.greyShade);L(21,36,25,35,c.greyLight);L(31,35,35,36,c.greyLight);
 for(const s of [-1,1]){const p=(x,y)=>[28+s*x,y];L(...p(11,34),...p(12,44),c.cyan);L(...p(12,44),...p(9,50),c.cyan);}
 // Arms ending in grey claws; one reaches forward on the attack.
 L(16,32,11-arm*.3,41,c.black,8);L(16,33,12-arm*.3,40,c.grey,5);L(15,33,12-arm*.3,38,c.greyLight);L(12-arm*.3,41,11-arm*.3,48,c.black,6);L(12-arm*.3,42,11-arm*.3,47,c.cyan);for(const t of [0,2,4])P([[9+t-arm*.3,48],[10+t-arm*.3,53],[11+t-arm*.3,48]],c.greyLight);
 if(attack){L(38,32,49,30,c.black,7);L(38,33,46,31,c.grey,4);L(41,35,48,31,c.cyan);for(const t of [0,2,4])P([[49,28+t],[54,29+t],[49,30+t]],c.greyLight);}
 else{L(38,32,43+arm*.3,41,c.black,8);L(38,33,43+arm*.3,40,c.grey,5);L(43+arm*.3,41,45+arm*.3,48,c.black,6);L(44+arm*.3,42,45+arm*.3,47,c.cyan);for(const t of [0,2,4])P([[43+t+arm*.3,48],[44+t+arm*.3,53],[45+t+arm*.3,48]],c.greyLight);}
 // Neck and horned dragon head: a tapering snout, swept-back horns, slit cyan eyes;
 // the jaws part to roar.
 P([[23,28],[33,28],[35,35],[21,35]],c.black);L(28,29,28,34,c.cyan);
 for(const s of [-1,1]){const p=(x,y)=>[28+s*x,y];P([p(5,13),p(15,2),p(12,6),p(8,16)],c.black);L(...p(7,13),...p(13,5),c.blackLight);P([p(7,19),p(16,14),p(9,22)],c.black);L(...p(9,19),...p(14,15),c.cyan);}
 P([[20,15],[24,9],[32,9],[36,15],[35,22],[33,30],[23,30],[21,22]],c.black);
 P([[22,15],[25,11],[31,11],[34,15],[33,20],[23,20]],c.blackLight);
 L(26,11,28,15,c.cyan);L(30,11,28,15,c.cyan);L(22,21,21,25,c.cyan);L(34,21,35,25,c.cyan);
 L(22,17,25,18,c.cyanLight);L(31,18,34,17,c.cyanLight);put(24,18,'#ffffff');put(32,18,'#ffffff');
 const jaw=attack?4:1;P([[23,23],[33,23],[32,27+jaw],[24,27+jaw]],'#0a0c12');
 for(const x of [23,26,29,31]){P([[x,23],[x+1,25],[x+2,23]],c.fang);P([[x,27+jaw],[x+1,25+jaw],[x+2,27+jaw]],c.fang);}
 if(attack){R(25,25,6,jaw,c.cyan);R(26,25,4,jaw-1,c.cyanLight);for(const [x,y]of [[28,38],[21,40],[35,39]])sparkle(r,x,y,1,c.cyan,c.cyanLight);}
 return selout(r.pixels,'#0a0c14');
}
function acnologia(m){const f=frame(m);return f.enraged?acnologiaDragon(m,f):acnologiaHuman(m,f);}

// ---------------------------------------------------------------- Milim
// Base: long pink twin tails and an ahoge loop, big bright-blue eyes and a cocky
// grin; black jacket with long sleeves and gold bands, a white bandeau, bare middle,
// black bikini bottom and side tassel, one pink-striped stocking, one fluffy garter
// and red segmented armour boots, green jewel on her shoulder.
// Phase II (her dragon armour): purple plate over a black dress, red-lined cape,
// red thigh-highs and armoured boots, a red horn and spread violet bat wings.
const ML={hair:'#f59ab4',hairShade:'#d4688c',hairDeep:'#a84a6e',hairLight:'#ffc8d8',skin:{base:'#fbe1cf',shade:'#e6b39c',light:'#fff2e6'},iris:'#4aa8e8',irisDark:'#1f5fa8',
 black:'#24222c',blackShade:'#141219',blackLight:'#46424f',white:'#f4f2f6',whiteShade:'#c8c4d0',band:'#c8b84a',boot:'#d2443a',bootShade:'#8c2422',bootLight:'#f27a66',jewel:'#4ab86a',
 garter:'#dfe6a0',garterShade:'#a8b066',stripe:'#f4a0b8',
 armor:'#5c3a9c',armorShade:'#3a2268',armorLight:'#8f6ad6',armorGold:'#d6b452',wing:'#9a7ccc',wingShade:'#6a4aa0',wingBone:'#3a2468',cape:'#3a3a44',capeIn:'#a8202e',stock:'#d8483e',horn:'#d0283a'};
function milimFace(r,y,{smug=false}={}){
 const {rect:R,line:L,put}=r,c=ML,sk=c.skin;
 facePlate(r,y,sk);
 for(const [x,side]of [[21,-1],[31,1]]){
  // Big round eyes with a star-like double highlight; a lowered lid when she is smug.
  const top=smug?26:25;R(x,top+y,4,30-top,'#fbfaff');R(x+(side<0?0:0),top+y,4,30-top,c.iris);R(x,top+y,4,1,c.irisDark);R(x+1,top+1+y,2,2,c.irisDark);put(x+1,top+1+y,'#ffffff');put(x+2,top+3+y-(smug?1:0),'#cfeaff');
  L(x-(side<0?1:0),top-1+y,x+3+(side>0?1:0),top-1+y,'#2a1a2a');put(side<0?x-1:x+4,top+y,'#2a1a2a');
 }
 L(21,23+y,24,22+y,c.hairDeep);L(31,22+y,34,23+y,c.hairDeep);
 // Grin: wide, one corner higher, a tiny fang.
 L(25,33+y,31,33+y,'#7a2a3a');put(24,32+y,'#7a2a3a');put(32,32+y,'#7a2a3a');R(26,34+y,4,1,'#c8506a');put(30,34+y,'#ffffff');
 for(const x of [20,21,35,36])put(x,31+y,mix('#f07890',sk.base,.45));
}
function milimHair(r,y,{tails=true,horn=false,wild=false}={}){
 const {poly:P,line:L,put}=r,c=ML;
 // Fringe and crown with separated strands.
 P([[16,30],[15,20],[18,13],[24,9],[32,9],[38,13],[41,20],[40,30],[38,24],[36,21],[34,25],[32,21],[29,24],[27,20],[25,25],[22,21],[20,26],[18,24]],c.hairShade);
 P([[17,27],[17,20],[20,14],[25,11],[31,11],[36,14],[39,20],[39,27],[37,22],[35,19],[33,23],[31,19],[28,22],[26,19],[24,23],[22,19],[20,24],[18,22]],c.hair);
 L(20,15,25,12,c.hairLight);L(31,12,36,15,c.hairLight);L(28,14,28,19,c.hairShade);
 // Side locks to the jaw.
 for(const [x,s]of [[17,-1],[39,1]]){P([[x,20],[x+s*2,20],[x+s*2,34],[x,37],[x-s,30]],c.hairShade);L(x,22,x,33,c.hair);}
 if(horn){P([[27,12],[28,1],[30,12]],c.horn);L(28,3,28,11,'#ff7a86');}
 else{
  // Ahoge: a springy loop above the crown.
  L(28,10,26,4,c.hairShade);L(26,4,29,1,c.hairShade);L(29,1,32,3,c.hairShade);L(32,3,30,6,c.hairShade);put(28,3,c.hairLight);
 }
 if(tails){for(const [x,s]of [[16,-1],[40,1]]){r.rect(x-(s<0?2:0),12,3,3,c.black);put(x-(s<0?1:-1),13,c.band);}}
}
function milimTails(r,tail,{wild=false}={}){
 const {poly:P,line:L}=r,c=ML;
 for(const [x,s]of [[15,-1],[41,1]]){const t=tail*s,sp=wild?3:0;
  P([[x,12],[x+s*6,11],[x+s*10+t,24],[x+s*(11+sp)+t,40],[x+s*(9+sp)+t,56],[x+s*4+t,64],[x+s*2+t,52],[x+s*1,36],[x-s*2,20]],c.hairDeep);
  P([[x,14],[x+s*5,13],[x+s*9+t,25],[x+s*(10+sp)+t,40],[x+s*(8+sp)+t,54],[x+s*4+t,60],[x+s*3+t,50],[x+s*2,36],[x-s,20]],c.hairShade);
  P([[x+s,15],[x+s*4,15],[x+s*7+t,26],[x+s*(8+sp)+t,40],[x+s*(6+sp)+t,52],[x+s*4+t,54],[x+s*3,36],[x,22]],c.hair);
  L(x+s*4,18,x+s*(7+sp)+t,46,c.hairLight);
 }
}
function milimBase(m,{r,walk,arm,tail,attack}){
 const {poly:P,rect:R,line:L,put}=r,c=ML,sk=c.skin;
 milimTails(r,tail);
 // Legs: striped stocking on one, fluffy garter on the other, red armour boots.
 for(const [i,x]of [21,30].entries()){const d=i?walk:-walk;
  R(x+d,51,5,12,sk.base);R(x+4+d,51,1,12,sk.shade);
  if(i===0)for(let y=53;y<62;y+=3){R(x+d,y,5,2,c.white);R(x+d,y+2,5,1,c.stripe);}
  else{R(x-1+d,54,7,3,c.garter);R(x-1+d,56,7,1,c.garterShade);put(x+1+d,55,c.stripe);put(x+4+d,54,c.stripe);R(x+d,58,5,4,c.white);put(x+2+d,59,c.stripe);put(x+1+d,61,c.stripe);}
  P([[x-1+d,61],[x+6+d,61],[x+6+d,70],[x-2+d,71],[x-2+d,66]],c.bootShade);R(x+d,62,5,8,c.boot);for(const yy of [64,67])L(x+d,yy,x+4+d,yy+1,c.bootShade);L(x+1+d,62,x+1+d,68,c.bootLight);
 }
 // Black bikini bottom and the side tassel cloth.
 P([[20,47],[36,47],[34,51],[30,53],[26,53],[22,51]],c.black);put(28,48,c.blackLight);
 P([[18,47],[21,47],[20,60],[16,58]],c.blackShade);L(19,49,18,58,c.blackLight);
 // Bare midriff, white bandeau with a fang necklace above it.
 R(21,41,14,7,sk.base);R(33,41,2,7,sk.shade);put(28,45,sk.shade);L(22,42,22,46,sk.light);
 P([[20,37],[36,37],[35,42],[21,42]],c.whiteShade);P([[21,37],[35,37],[34,41],[22,41]],c.white);L(28,38,28,41,c.whiteShade);
 for(const x of [24,27,30,32])P([[x,36],[x+1,39],[x+2,36]],'#f8f4ea');
 // Open black jacket with a high spiked collar and the green shoulder jewel.
 P([[15,35],[21,33],[21,44],[17,46]],c.black);P([[41,35],[35,33],[35,44],[39,46]],c.black);
 P([[19,30],[23,34],[20,36]],c.black);P([[37,30],[33,34],[36,36]],c.black);
 R(14,35,5,5,c.armorGold);R(15,36,3,3,c.jewel);put(15,36,'#b8f0c0');
 // Long black sleeves with gold bands; a raised glowing fist on the attack.
 L(17,37,14-arm*.3,49,c.blackShade,5);L(17,37,15-arm*.3,48,c.black,3);L(14-arm*.3,42,18-arm*.3,42,c.band);R(13-arm*.3,49,4,4,sk.base);
 if(attack){L(39,37,46,28,c.blackShade,5);L(39,37,46,29,c.black,3);L(42,32,45,35,c.band);R(45,24,5,5,'#ffe48a');R(46,25,3,3,'#ffffff');for(const [x,y]of [[51,20],[44,19],[52,28]])sparkle(r,x,y,1,'#ffd0e0');}
 else{L(39,37,41+arm*.3,47,c.blackShade,5);L(39,37,40+arm*.3,46,c.black,3);L(38,42,42,42,c.band);R(38+arm*.3,46,4,4,sk.base);}
 milimFace(r,0,{smug:false});
 milimHair(r,0);
 return selout(r.pixels,INK);
}
// Dragon armour form, from the reference: loose, messy hair with spikes all over the
// crown and long wavy streams blowing out to both sides; the red horn rising from her
// forehead; narrowed, self-satisfied eyes under angled brows, pink cheek marks and a
// small closed smirk.
function dragonHairBack(r,tail){
 const {poly:P,line:L,put}=r,c=ML;
 for(const s of [-1,1]){const p=(x,y)=>[28+s*x,y],t=tail*s;
  P([p(11,13),p(18,18),p(24,25),p(26+t*.5,33),p(26+t,42),p(23+t,50),p(20+t,51),p(22+t,46),p(22+t,40),p(21,33),p(17,27),p(12,22)],c.hairDeep);
  P([p(12,15),p(18,20),p(23,26),p(25+t*.5,33),p(25+t,41),p(23+t,47),p(23+t,40),p(22,33),p(18,27),p(13,21)],c.hairShade);
  P([p(13,16),p(18,21),p(22,27),p(24+t*.5,33),p(24+t,39),p(23,33),p(19,27),p(14,20)],c.hair);
  L(...p(15,18),...p(23,28),c.hairLight);
  // The curl at each tip.
  put(...p(21+t,50),c.hairShade);put(...p(20+t,49),c.hairDeep);
 }
}
function dragonHairFront(r){
 const {poly:P,line:L,put}=r,c=ML;
 P([[15,31],[14,24],[11,21],[15,17],[11,12],[17,11],[16,6],[22,7],[23,2],[27,6],[33,2],[34,7],[40,6],[39,11],[45,12],[41,17],[45,21],[42,24],[41,31],[39,25],[37,21],[35,25],[33,21],[31,24],[29,20],[27,24],[25,20],[23,24],[21,21],[19,26],[17,23]],c.hairShade);
 P([[16,27],[16,22],[14,20],[17,17],[14,13],[18,13],[18,9],[22,10],[24,5],[27,9],[32,5],[33,10],[38,9],[38,13],[42,14],[39,17],[42,20],[40,23],[40,27],[38,22],[36,19],[34,23],[32,19],[30,22],[29,18],[27,22],[25,18],[23,22],[21,19],[19,23],[17,21]],c.hair);
 L(19,13,24,10,c.hairLight);L(31,10,36,12,c.hairLight);L(17,18,20,16,c.hairLight);L(25,7,26,9,c.hairLight);L(33,6,33,9,c.hairLight);
 for(const x of [22,34])L(x,13,x,18,c.hairShade);
 // Thin locks either side of the face.
 for(const [x,s]of [[17,-1],[39,1]]){P([[x,20],[x+s*2,20],[x+s*3,32],[x+s,37],[x-s,30]],c.hairShade);L(x,22,x+s,33,c.hair);}
 // The horn: red, sharp, rising out of the fringe with a slight lean.
 P([[27,19],[29,8],[31,4],[31,11],[30,19]],c.horn);L(28,17,29,10,'#8a1424');L(30,7,30,16,'#ff7a86');put(31,5,'#ffb0b8');
}
function dragonFace(r){
 const {rect:R,line:L,put}=r,c=ML,sk=c.skin,lash='#2a1a2a';
 facePlate(r,0,sk);
 for(const [x,side]of [[21,-1],[31,1]]){
  // Upper lid slants down toward the nose: a narrowed, cocky look.
  const outer=side<0?x-1:x+4,inner=side<0?x+3:x;
  R(x,27,4,2,'#fbfaff');R(x+(side<0?1:0),27,3,2,c.iris);R(x+(side<0?1:0),27,3,1,c.irisDark);put(x+(side<0?2:1),28,'#163e78');put(x+(side<0?1:2),27,'#ffffff');
  L(Math.min(outer,inner),26,Math.max(outer,inner),26,lash);put(outer,25,lash);put(inner,27,lash);
  L(x,29,x+3,29,mix(lash,sk.base,.6));
 }
 // Brows angled down toward the centre.
 L(20,22,24,24,c.hairDeep);L(32,24,36,22,c.hairDeep);
 // Pink cheek marks under the eyes.
 for(const x of [20,34]){put(x,31,'#e8828a');put(x+1,30,'#e8828a');put(x+2,31,'#f0a0a6');}
 // Closed smirk, one corner lifted.
 L(26,34,29,34,'#8a3a4a');put(30,33,'#8a3a4a');put(25,33,mix('#8a3a4a',sk.base,.5));put(28,35,mix('#c8506a',sk.base,.6));
 put(28,31,sk.shade);
}
function milimArmor(m,{r,walk,arm,tail,attack}){
 const {poly:P,rect:R,line:L,put}=r,c=ML,sk=c.skin,flap=arm;
 // Bat wings spread wide behind her.
 for(const s of [-1,1]){const p=(x,y)=>[28+s*x,y];
  P([p(8,32),p(15,8-flap),p(22,1-flap),p(27,4-flap),p(28,18),p(28,32),p(24,29),p(21,37),p(17,32),p(13,40)],c.wingShade);
  P([p(9,32),p(15,10-flap),p(21,4-flap),p(26,6-flap),p(27,18),p(27,30),p(24,27),p(21,34),p(17,30),p(13,36)],c.wing);
  L(...p(9,31),...p(22,2-flap),c.wingBone,2);for(const [x,y]of [[27,6],[27,18],[27,30],[21,34]])L(...p(10,31),...p(x,y-(y<20?flap:0)),c.wingBone);
 }
 dragonHairBack(r,tail);
 // Red-lined cape flaring from the hips.
 P([[17,45],[39,45],[50+tail,60],[48+tail,66],[40,62],[28,64],[16,62],[8+tail,66],[6+tail,60]],c.cape);P([[19,48],[37,48],[47+tail,60],[44+tail,63],[38,60],[28,62],[18,60],[12+tail,63],[9+tail,60]],c.capeIn);L(20,50,11+tail,61,'#d8404c');
 // Red thigh-highs and armoured purple boots with gold plates.
 for(const [i,x]of [21,30].entries()){const d=i?walk:-walk;
  R(x+d,51,5,4,sk.base);R(x+d,54,5,6,c.stock);R(x+4+d,54,1,6,'#9c2a24');
  P([[x-1+d,58],[x+6+d,58],[x+6+d,68],[x+4+d,71],[x-1+d,71],[x-2+d,64]],c.armorShade);R(x+d,59,5,9,c.armor);L(x+1+d,59,x+1+d,67,c.armorLight);R(x-1+d,66,7,2,c.armorGold);
 }
 // Black pleated skirt and the armoured belt.
 P([[19,45],[37,45],[40,53],[16,53]],c.blackShade);P([[20,45],[36,45],[38,52],[18,52]],c.black);for(const x of [22,26,30,34])L(x,46,x+(x<28?-1:1),52,c.blackLight);
 R(19,44,18,3,c.armor);R(25,43,6,5,c.armorShade);R(26,44,4,3,c.armorLight);
 // Breastplate over the dress, gold-trimmed, with layered pauldrons.
 P([[20,34],[36,34],[36,44],[20,44]],c.black);P([[21,35],[35,35],[34,43],[22,43]],c.armorShade);P([[22,35],[34,35],[33,41],[28,43],[23,41]],c.armor);
 L(24,36,28,40,c.armorGold);L(32,36,28,40,c.armorGold);L(23,37,24,41,c.armorLight);R(25,33,6,2,c.armorShade);put(28,34,c.armorGold);
 for(const s of [-1,1]){const p=(x,y)=>[28+s*x,y];P([p(6,33),p(12,31),p(15,35),p(13,40),p(8,40)],c.armorShade);P([p(7,34),p(12,32),p(14,35),p(12,38),p(8,38)],c.armor);L(...p(8,36),...p(13,36),c.armorGold);}
 // Black sleeves under purple gauntlets.
 L(17,38,14-arm*.3,49,c.blackShade,5);L(17,38,15-arm*.3,48,c.black,3);R(12-arm*.3,44,5,5,c.armor);L(12-arm*.3,44,16-arm*.3,44,c.armorLight);R(13-arm*.3,49,4,4,sk.base);
 if(attack){L(39,38,46,28,c.blackShade,5);L(39,38,46,29,c.black,3);R(43,29,5,5,c.armor);R(45,23,5,5,'#ff9ab8');R(46,24,3,3,'#ffffff');for(const [x,y]of [[51,18],[43,18],[53,27]])sparkle(r,x,y,1,'#ffb0c8');}
 else{L(39,38,41+arm*.3,47,c.blackShade,5);L(39,38,40+arm*.3,46,c.black,3);R(38+arm*.3,42,5,5,c.armor);L(38+arm*.3,42,42+arm*.3,42,c.armorLight);R(38+arm*.3,47,4,4,sk.base);}
 dragonFace(r);
 dragonHairFront(r);
 return selout(r.pixels,INK);
}
function milim(m){const f=frame(m);return f.enraged?milimArmor(m,f):milimBase(m,f);}

export const EXPEDITION_BOSS_ART={jellal,geld,kokushibo,acnologia,milim};
export function expeditionBossPixels(id,m={}){return EXPEDITION_BOSS_ART[id]?.(m)||null;}
