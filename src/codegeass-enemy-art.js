import {canvas,selout} from './hero-kit.js';
// The Code Geass cast on the shared 56 × 76 grid.
// Enemies: Britannian infantry, purple Sutherlands, lance-bearing Gloucesters, gold Vincents
// on float units and a Geass Order assassin.
// Bosses: Suzaku's white-and-gold Lancelot (the Albion grows emerald energy wings), Cornelia
// in her violet uniform and cape (her royal guard armor and lance below half health), and
// Emperor Charles with his white rolled curls and imperial robes (the Code glowing in his
// palm and a violet aura once he takes it).
export const CODEGEASS_PALETTES={
 britsoldier:['#6a7a98','#3a4660','#b8c4d8'],sutherland:['#7a6a98','#4a3e66','#b8a8d8'],gloucester:['#6a4a88','#3e2858','#c8a8e0'],
 vincent:['#c8a85a','#8a6a2a','#f4dc98'],geassorder:['#d8d0c8','#8a8490','#d84a6a'],
 suzaku:['#e8ecf4','#a8b0c4','#d8b048'],cornelia:['#b878c8','#6a3a7a','#f0e0f4'],charles:['#f0e8d8','#b8a888','#a01a32'],
};
const TAU=Math.PI*2;
const SKIN={base:'#f0d2bb',shade:'#cfa38e',light:'#fde8d8'};
const clamp=(n,max)=>Math.max(-max,Math.min(max,Math.round(n||0)));
function frame(m={}){const r=canvas();return {r,walk:clamp((m.leg||0)*.4,2),arm:clamp((m.arm||0)*.5,3),tail:clamp((m.tail||0)*.4,3),attack:!!m.attack,fierce:!!m.enraged};}
const done=(r,ink='#1a1626')=>selout(r.pixels,ink);
// A knightmare frame: armored legs on landspinners, a narrow waist, broad chest, round
// shoulders and a small head; colours and details vary per model.
function knightmare(r,{walk,arm,attack},C,{head='round',fins=false,legs=true}={}){
 const {poly:P,rect:R,line:L,put}=r;
 if(legs)for(const [i,x]of [21,31].entries()){const d=i?walk:-walk;P([[x+d,48],[x+5+d,48],[x+6+d,60],[x-1+d,60]],C.mid);R(x+d,50,1,9,C.light);P([[x-1+d,57],[x+3+d,54],[x+7+d,57],[x+3+d,61]],C.trim);
  R(x-1+d,61,8,7,C.mid);R(x+6+d,61,1,7,C.dark);R(x-2+d,67,10,3,C.dark);R(x-1+d,69,3,2,'#2a2a34');R(x+5+d,69,3,2,'#2a2a34');put(x+d,68,C.glow);}
 P([[21,42],[35,42],[37,50],[19,50]],C.dark);P([[22,43],[34,43],[35,49],[21,49]],C.mid);R(26,44,4,4,C.glow);put(27,44,'#ffffff');
 P([[17,26],[39,26],[37,42],[19,42]],C.dark);P([[18,27],[38,27],[36,41],[20,41]],C.mid);P([[22,29],[34,29],[32,38],[24,38]],C.light);L(28,28,28,40,C.trim);
 for(const s of [-1,1]){const cx=28+s*13;P([[cx-5,24],[cx+5,24],[cx+6,32],[cx,35],[cx-6,32]],C.dark);P([[cx-4,25],[cx+4,25],[cx+5,31],[cx,33],[cx-5,31]],C.mid);L(cx-4,25,cx+4,25,C.trim);
  if(fins){P([[cx+s*4,24],[cx+s*9,16],[cx+s*7,26]],C.trim);}}
 // Arms; the right one aims forward when it attacks.
 P([[12,32],[16,32],[16-arm*.3,46],[11-arm*.3,46]],C.dark);R(12-arm*.3,46,5,4,C.trim);
 if(attack){P([[40,30],[44,30],[50,36],[47,39]],C.dark);R(48,35,4,4,C.trim);}else{P([[40,32],[44,32],[45+arm*.3,46],[40+arm*.3,46]],C.dark);R(40+arm*.3,46,5,4,C.trim);}
 // Head.
 if(head==='round'){P([[23,13],[33,13],[35,20],[33,26],[23,26],[21,20]],C.dark);P([[24,14],[32,14],[34,20],[32,25],[24,25],[22,20]],C.mid);R(25,18,6,3,'#141018');R(26,19,4,1,C.eye);put(28,15,C.light);}
 else if(head==='horn'){P([[23,14],[33,14],[34,22],[31,26],[25,26],[22,22]],C.dark);P([[24,15],[32,15],[33,22],[30,25],[26,25],[23,22]],C.mid);P([[27,15],[28,4],[29,15]],C.trim);R(24,19,8,2,C.eye);}
 else{P([[23,12],[33,12],[35,21],[32,26],[24,26],[21,21]],C.dark);P([[24,13],[32,13],[34,21],[31,25],[25,25],[22,21]],C.mid);P([[25,13],[22,5],[27,11]],C.trim);P([[31,13],[34,5],[29,11]],C.trim);R(24,18,3,2,C.eye);R(29,18,3,2,C.eye);L(28,13,28,17,C.trim);}
}
function britsoldier(m){
 const {r,walk,arm,attack}=frame(m),{poly:P,rect:R,line:L,put}=r,A='#6a7a98',D='#3a4660',Li='#9aa8c4';
 for(const [i,x]of [22,30].entries()){const d=i?walk:-walk;R(x+d,52,5,13,'#4a5468');R(x+d+4,52,1,13,'#2a3244');R(x+d-1,64,7,6,'#22262e');R(x+d,64,4,1,'#4a4e5a');}
 P([[19,36],[37,36],[38,53],[18,53]],D);P([[20,37],[36,37],[37,52],[19,52]],A);R(22,40,12,7,Li);R(23,41,10,5,A);L(28,37,28,52,D);R(18,49,20,3,'#2a2e38');R(26,49,4,3,'#a8a080');
 // Rifle held across the body, raised to fire.
 if(attack){L(24,40,50,36,'#2a2a30',2);R(42,35,6,4,'#4a3a2a');put(51,36,'#ffe08a');}else{L(16,52,42,36,'#2a2a30',2);R(30,42,6,4,'#4a3a2a');}
 P([[15,37],[19,37],[17-arm*.3,51],[13-arm*.3,51]],D);R(13-arm*.3,50,4,3,'#2a2e38');P([[37,37],[41,37],[43+arm*.3,49],[39+arm*.3,49]],D);R(39+arm*.3,48,4,3,'#2a2e38');
 // Helmet with a dark visor over a lower face.
 R(23,30,10,7,SKIN.base);R(23,34,10,1,SKIN.shade);
 P([[18,24],[20,14],[26,10],[32,10],[37,14],[39,24],[38,30],[18,30]],D);P([[19,23],[21,15],[26,11],[31,11],[36,15],[38,23],[37,29],[19,29]],A);L(22,14,27,12,Li);
 P([[20,22],[36,22],[35,28],[21,28]],'#141824');L(22,24,26,24,attack?'#ff6a6a':'#5a8ac8');R(26,33,4,1,'#a86a6a');
 return done(r);
}
function sutherland(m){
 const {r,attack}=frame(m),C={dark:'#3e3258',mid:'#7a6a98',light:'#a898c8',trim:'#4a4058',glow:'#e8c060',eye:'#ff4a4a'};
 knightmare(r,frame(m),C,{head:'round'});
 // Assault rifle, and the slash harken wire when it attacks.
 if(attack){r.line(44,37,54,33,'#5a6070',1);r.rect(50,31,4,4,'#c8c8d0');}else r.rect(43,46,3,10,'#3a3a44');
 return done(r);
}
function gloucester(m){
 const {r,walk,arm,attack}=frame(m),C={dark:'#2e1e48',mid:'#6a4a88',light:'#9a7ab8',trim:'#d8b048',glow:'#e8c060',eye:'#ff6a8a'};
 // A short cape behind the frame.
 r.poly([[16,26],[40,26],[44+walk,62],[12+walk,62]],'#3a1a3a');r.poly([[18,27],[38,27],[41+walk,60],[15+walk,60]],'#5a2a5a');
 knightmare(r,{walk,arm,attack},C,{head:'horn',fins:true});
 // The lance: held upright, or couched forward to charge.
 if(attack){r.line(30,38,55,30,'#c8c8d4',2);r.poly([[50,28],[55,30],[50,33]],'#f4f4f8');}else{r.line(45,14,45,62,'#a8a8b8',2);r.poly([[43,14],[45,6],[47,14]],'#f4f4f8');}
 return done(r);
}
function vincent(m){
 const {r,walk,arm,attack}=frame(m),C={dark:'#6a4a1a',mid:'#c8a85a',light:'#f4dc98',trim:'#3a3a48',glow:'#4ae8c8',eye:'#4ae8c8'};
 // Float unit: slim wings behind the shoulders.
 for(const s of [-1,1]){r.poly([[28+s*8,24],[28+s*26,14+walk],[28+s*24,20+walk],[28+s*10,30]],'#3a3a48');r.line(28+s*10,25,28+s*24,16+walk,'#6ae8f0');}
 knightmare(r,{walk,arm,attack},C,{head:'crest',legs:true});
 if(attack){for(const s of [-1,1])r.line(46,36,54,36+s*6,'#7af8f0',1);}else{r.line(13,50,13,60,'#7af8f0',1);}
 return done(r,'#2a1e10');
}
function geassorder(m){
 const {r,walk,arm,attack,tail}=frame(m),{poly:P,rect:R,line:L,put}=r,W='#d8d0c8',S='#8a8490',D='#4a4652';
 P([[16,34],[40,34],[45+tail*.5,68],[11+tail*.5,68]],D);P([[17,35],[39,35],[43+tail*.5,66],[13+tail*.5,66]],S);P([[19,36],[37,36],[40,64],[16,64]],W);L(28,38,28,63,S);
 for(const yy of [44,52])L(19,yy,37,yy,'#a83a52');R(25,47,6,4,'#a83a52');
 // The Geass Order emblem on the robe.
 P([[28,48],[24,46],[26,49]],'#f4e0e8');P([[28,48],[32,46],[30,49]],'#f4e0e8');
 for(const [i,x]of [22,30].entries()){const d=i?walk:-walk;R(x+d,64,6,5,'#2a2632');}
 P([[15,36],[19,36],[16-arm*.3,52],[12-arm*.3,52]],S);R(12-arm*.3,52,4,3,SKIN.base);
 if(attack){P([[37,36],[41,36],[49,32],[47,36]],S);R(48,30,4,4,SKIN.base);for(let i=0;i<8;i++){const a=i*.8;put(52+Math.round(Math.cos(a)*4),30+Math.round(Math.sin(a)*4),i%2?'#ff3a52':'#ffd0d8');}}
 else{P([[37,36],[41,36],[44+arm*.3,52],[40+arm*.3,52]],S);R(40+arm*.3,52,4,3,SKIN.base);}
 // Hood shading a pale face; one eye burns red with the Geass.
 P([[16,36],[15,22],[19,12],[28,8],[37,12],[41,22],[40,36],[35,30],[21,30]],D);P([[17,34],[17,22],[20,13],[28,10],[36,13],[39,22],[39,34],[35,28],[21,28]],S);
 R(21,22,14,12,SKIN.base);R(21,22,14,3,'#4a3a3a');R(23,26,3,2,'#ff3a52');put(24,26,'#ffd0d8');R(30,26,3,2,'#3a2a3a');R(26,31,4,1,'#a86a6a');
 return done(r);
}
// ---------- bosses ----------
function suzaku(m){
 const {r,walk,arm,attack,fierce}=frame(m),{poly:P,rect:R,line:L,put}=r;
 const C={dark:'#7a8298',mid:'#e8ecf4',light:'#ffffff',trim:'#d8b048',glow:fierce?'#4af0a8':'#4ac8f0',eye:fierce?'#4af0a8':'#4ad8f8'};
 // The Albion's emerald energy wings.
 if(fierce)for(const s of [-1,1])for(let i=0;i<3;i++){P([[28+s*8,26],[28+s*(22+i*3),6+i*10+walk],[28+s*(18+i*3),12+i*10+walk]],i%2?'#2ac888':'#4af0a8');L(28+s*9,27,28+s*(21+i*3),8+i*10+walk,'#c8ffe8');}
 knightmare(r,{walk,arm,attack},C,{head:'crest',fins:true});
 // Blaze Luminous shield on the left arm and the MVS sword on the right.
 R(8-arm*.3,40,5,10,'#2a8ab8');L(9-arm*.3,41,9-arm*.3,48,'#8ae0ff');
 if(attack){L(48,36,55,22,'#c8f0ff',2);L(49,36,55,24,'#ffffff');}else{L(44,48,46,64,'#c8f0ff',2);put(44,48,C.trim);}
 R(25,6,6,2,C.trim);put(28,5,'#ffffff');
 return done(r,'#262a3a');
}
function cornelia(m){
 const {r,walk,arm,attack,fierce,tail}=frame(m),{poly:P,rect:R,line:L,put}=r,V='#b878c8',VD='#6a3a7a',VL='#d8a8e4',W='#f0e0f4',WS='#c8b0d0',G='#d8b048';
 // Long magenta hair and a cape behind her.
 P([[14,22],[17,10],[39,10],[42,22],[44+tail*.5,58],[12+tail*.5,58]],'#7a2a6a');P([[15,22],[18,12],[38,12],[41,22],[42+tail*.5,55],[14+tail*.5,55]],'#a83a8a');
 P([[16,34],[40,34],[45+walk,66],[11+walk,66]],fierce?'#3a1a4a':'#4a2a5a');P([[17,35],[39,35],[43+walk,64],[13+walk,64]],fierce?'#6a2a6a':'#7a3a7a');
 for(const [i,x]of [22,30].entries()){const d=i?walk:-walk;R(x+d,52,5,12,W);R(x+d+4,52,1,12,WS);R(x+d-1,63,7,7,VD);R(x+d,63,1,6,V);R(x+d-1,69,7,1,'#2a1a2a');}
 // Violet uniform with white panels and gold cords; royal guard armor below half health.
 P([[19,36],[37,36],[38,53],[18,53]],VD);P([[20,37],[36,37],[37,52],[19,52]],V);P([[24,37],[32,37],[31,52],[25,52]],W);L(28,37,28,52,WS);for(const yy of [41,45,49])put(27,yy,G);
 L(20,40,24,46,G);L(36,40,32,46,G);R(18,50,20,2,G);
 if(fierce){for(const s of [-1,1]){const cx=28+s*12;P([[cx-5,34],[cx+5,34],[cx+6,41],[cx-6,41]],'#4a2a5a');P([[cx-4,35],[cx+4,35],[cx+5,40],[cx-5,40]],G);}}
 P([[15,37],[19,37],[17-arm*.3,51],[13-arm*.3,51]],VD);R(13-arm*.3,50,4,3,SKIN.base);
 if(attack){P([[37,37],[41,37],[48,34],[46,38]],VD);R(46,32,4,4,SKIN.base);L(48,34,55,22,fierce?'#e8e8f0':'#d8d8e4',2);if(fierce)P([[53,20],[56,16],[55,23]],'#ffffff');}
 else{P([[37,37],[41,37],[43+arm*.3,51],[39+arm*.3,51]],VD);R(39+arm*.3,50,4,3,SKIN.base);L(42+arm*.3,50,44+arm*.3,64,fierce?'#e8e8f0':'#c8c8d4',2);}
 // Face, stern violet eyes and her high collar.
 R(24,32,8,5,W);
 P([[19,20],[37,20],[37,29],[35,33],[31,36],[25,36],[21,33],[19,29]],SKIN.shade);P([[20,20],[36,20],[36,29],[34,32],[30,35],[26,35],[22,32],[20,29]],SKIN.base);
 for(const x of [22,31]){R(x,26,4,3,'#ffffff');R(x+1,26,3,3,'#8a3aa8');put(x+2,27,'#2a1a3a');L(x-1,25,x+4,24+(x<28?1:0),'#4a1a3a');}
 R(26,32,4,1,'#a85a6a');
 P([[18,24],[19,12],[28,8],[37,12],[38,24],[35,20],[31,22],[28,17],[25,22],[21,20]],'#a83a8a');L(21,13,27,10,'#e87ac8');
 return done(r,'#22142a');
}
function charles(m){
 const {r,walk,arm,attack,fierce,tail}=frame(m),{poly:P,rect:R,line:L,put}=r,W='#f0e8d8',WS='#b8a888',G='#d8b048',RD='#a01a32',RDD='#600a1e',HAIR='#f4f0f4',HS='#c8c0cc';
 // Violet aura of the Code below half health.
 if(fierce)for(let i=0;i<10;i++){const a=i*TAU/10;put(28+Math.round(Math.cos(a)*25),40+Math.round(Math.sin(a)*30),i%2?'#c87af0':'#8a3ab8');}
 // Long red imperial cape and a white robe to the floor.
 P([[13,32],[43,32],[48+walk,70],[8+walk,70]],RDD);P([[14,33],[42,33],[46+walk,69],[10+walk,69]],RD);
 P([[18,34],[38,34],[41,70],[15,70]],WS);P([[19,35],[37,35],[40,69],[16,69]],W);L(28,36,28,69,G);L(22,38,19,68,G);L(34,38,37,68,G);
 R(17,48,22,3,G);R(26,47,4,5,RD);put(27,48,'#ff8a9a');for(const x of [21,35])R(x,56,2,2,RD);
 // Gold epaulettes.
 for(const s of [-1,1]){const cx=28+s*12;P([[cx-5,31],[cx+5,31],[cx+6,37],[cx-6,37]],G);for(let i=-4;i<=4;i+=2)L(cx+i,37,cx+i,40,G);}
 P([[13,36],[18,36],[16-arm*.3,52],[11-arm*.3,52]],WS);R(11-arm*.3,51,5,4,SKIN.base);
 if(attack||fierce){P([[38,36],[43,36],[50,30],[47,35]],WS);R(48,28,5,5,SKIN.base);if(fierce){P([[51,30],[49,28],[50,31]],'#ff3a52');P([[51,30],[53,28],[52,31]],'#ff3a52');R(50,31,1,2,'#ff3a52');}}
 else{P([[38,36],[43,36],[45+arm*.3,52],[40+arm*.3,52]],WS);R(40+arm*.3,51,5,4,SKIN.base);}
 // A heavy jaw, stern violet eyes, and the famous rolled white curls and sideburns.
 P([[20,16],[36,16],[37,27],[34,33],[22,33],[19,27]],SKIN.shade);P([[21,16],[35,16],[36,27],[33,32],[23,32],[20,27]],SKIN.base);
 for(const x of [22,31]){R(x,22,4,2,'#ffffff');R(x+1,22,2,2,'#6a3a9a');L(x-1,21,x+4,20+(x<28?1:0),'#6a6070');}
 L(25,28,31,28,'#8a5a5a');
 for(const s of [-1,1])for(let i=0;i<4;i++){const x=28+s*(10+(i%2)*2),y=12+i*6;R(x-3,y,6,5,HS);R(x-2,y,4,4,HAIR);put(x-1,y+1,'#ffffff');}
 P([[19,16],[20,8],[28,5],[36,8],[37,16],[33,12],[28,14],[23,12]],HS);P([[20,15],[21,9],[28,6],[35,9],[36,15],[32,11],[28,13],[24,11]],HAIR);
 R(24,24,2,9,HAIR);R(30,24,2,9,HAIR);
 return done(r,'#241c18');
}
const ART={britsoldier,sutherland,gloucester,vincent,geassorder,suzaku,cornelia,charles};
export function codeGeassEnemyPixels(id,m={}){return ART[id]?ART[id](m):null;}
