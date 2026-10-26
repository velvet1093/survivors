import {canvas,selout,mix,SKIN,eye,mouth,head,limb,legs,shoes} from './hero-kit.js';

// Room hosts for the turn-based Ascent, on the same 56 × 76 chibi skeleton as the
// playable cast. `bob` lifts the upper body one pixel for the breathing loop.
const TAN={base:'#f1c9a0',shade:'#d79f78',deep:'#b9785c',light:'#ffe2c2'};
const PALE={base:'#e7e3ea',shade:'#bdb6c6',deep:'#9a91a6',light:'#fbf9ff'};
function face(r,y,{skin=SKIN,iris,irisDark,lash='#2a2233',blink=false,expr='neutral',lip,eyesY=26}={}){
 head(r,y,{skin});
 eye(r,21,eyesY+y,{iris,irisDark,lash,side:-1,closed:blink});eye(r,31,eyesY+y,{iris,irisDark,lash,side:1,closed:blink});
 mouth(r,34+y,expr,{lip:lip||mix(skin.deep,'#8a3a44',.4)});
}
const shift=(pts,y)=>pts.map(([x,yy])=>[x,yy+y]);
function torso(r,y,{color,shade,light,top=39,bottom=54,w=9,flare=1}){
 r.poly([[28-w,top+y],[28+w,top+y],[28+w+flare,bottom],[28-w-flare,bottom]],shade);
 r.poly([[29-w,top+y],[27+w,top+y],[27+w+flare,bottom-1],[29-w-flare,bottom-1]],color);
 if(light)r.line(29-w,top+1+y,29-w,bottom-3,light);
}

// Shading helpers for the redrawn hosts: a dark silhouette with a one-pixel inset
// mid tone, and a light rim along the lit (viewer-left) edge.
const inset=(pts,d=1)=>{const cx=pts.reduce((s,p)=>s+p[0],0)/pts.length,cy=pts.reduce((s,p)=>s+p[1],0)/pts.length;return pts.map(([x,y])=>{const dx=cx-x,dy=cy-y,l=Math.hypot(dx,dy)||1;return [x+dx/l*d,y+dy/l*d];});};
function layer(r,pts,[dark,mid,light],{y=0,d=1}={}){const p=shift(pts,y);r.poly(p,dark);r.poly(inset(p,d),mid);if(light){const left=[...p].sort((a,b)=>a[0]-b[0]).slice(0,2);r.line(left[0][0]+1,left[0][1],left[1][0]+1,left[1][1],light);}}
function eyes2(r,y,{iris,irisDark,lash='#2a1a22',blink,top=26,left=21,right=31,wink=null}){
 for(const [x,side]of [[left,-1],[right,1]]){
  if(blink||wink===side){r.line(x,top+3+y,x+3,top+3+y,lash);r.put(side<0?x-1:x+4,top+2+y,lash);continue;}
  r.rect(x,top+1+y,4,4,'#fffaf4');r.rect(x+(side<0?1:0),top+1+y,3,4,iris);r.rect(x+(side<0?1:0),top+1+y,3,2,irisDark);
  r.put(x+(side<0?2:1),top+2+y,mix(irisDark,'#100a10',.5));r.put(x+(side<0?1:0),top+1+y,'#ffffff');r.put(x+(side<0?3:2),top+4+y,mix(iris,'#ffffff',.45));
  r.line(x-(side<0?1:0),top+y,x+3+(side<0?0:1),top+y,lash);r.put(side<0?x-1:x+4,top+1+y,lash);
 }
}

// ---- Nami (Wano): blue blossom kimono, zigzag obi, flowing orange sash, ponytail ----
function nami(r,{bob,blink}){
 const y=-bob,H=['#c25c1a','#ee8530','#ffb766'],K=['#3f8cc8','#79c3ee','#b4e6ff'],O=['#c07418','#f0a030','#ffd070'];
 // Ponytail sweeping out behind, tied with a blue bow.
 layer(r,[[34,16],[42,14],[50,18],[54,28],[50,30],[52,38],[46,36],[44,44],[40,36],[38,26]],H,{y});
 r.line(42,18+y,50,24+y,H[2]);r.line(44,26+y,47,34+y,H[2]);r.line(46,20+y,52,28+y,H[0]);
 r.rect(35,17+y,4,4,'#2a5ab8');r.rect(34,15+y,3,3,'#3a6ad0');r.rect(38,15+y,3,3,'#3a6ad0');r.put(35,16+y,'#7aa8ff');
 // The orange sash streams out on both sides.
 layer(r,[[19,50],[10,52],[3,60],[6,66],[10,62],[16,58],[20,54]],O,{y});layer(r,[[37,49],[46,50],[53,56],[51,63],[46,58],[40,55]],O,{y});
 r.line(6,61+y,12,55+y,O[2]);r.line(44,52+y,50,57+y,O[2]);
 // Bare legs and blue-strapped straw sandals.
 legs(r,0,{x:[23,29],top:57,color:SKIN.base,shadeColor:SKIN.shade,width:5});
 for(const x of [22,29]){r.rect(x,69,7,2,'#d8c08a');r.rect(x,70,7,1,'#a88a5a');r.rect(x+1,66,5,1,'#2a5ab8');r.rect(x+2,68,3,1,'#2a5ab8');}
 // Short sleeveless kimono with crossed collar and white blossoms.
 layer(r,[[20,39],[36,39],[38,50],[40,58],[16,58],[18,50]],K,{y});
 r.line(19,57,39,57,K[0]);r.line(20,40+y,18,56,K[2]);
 r.line(24,39+y,29,46+y,'#e6f6ff');r.line(33,39+y,28,46+y,'#e6f6ff');r.line(25,39+y,29,45+y,K[0]);
 for(const [x,yy]of [[20,53],[26,54],[32,53],[37,55],[21,42],[35,43]]){const o=yy<50?y:0;r.put(x,yy+o,'#ffffff');r.put(x-1,yy+1+o,'#ffffff');r.put(x+1,yy+1+o,'#ffffff');r.put(x,yy+2+o,'#ffffff');r.put(x,yy+1+o,'#f0a0c0');}
 // Obi: yellow cord, orange band with a white zigzag, blue knot.
 r.rect(18,46+y,20,1,'#f2d84a');layer(r,[[18,47],[38,47],[38,52],[18,52]],O,{y,d:.6});
 for(let x=19;x<37;x+=4){r.line(x,50+y,x+2,48+y,'#fff4e0');r.line(x+2,48+y,x+4,50+y,'#fff4e0');}r.rect(18,51+y,20,1,O[0]);
 r.rect(26,47+y,4,2,'#2a5ab8');r.put(25,48+y,'#3a6ad0');r.put(30,48+y,'#3a6ad0');
 // Bare arms meeting in front of her chest, palms pressed together; a bracelet and her tattoo.
 for(const [x0,x1]of [[18,25],[38,31]]){r.line(x0,40+y,x0+(x1-x0)*.4,46+y,SKIN.shade,3);r.line(x0+(x1-x0)*.4,46+y,x1,43+y,SKIN.shade,3);r.line(x0,40+y,x0+(x1-x0)*.4,45+y,SKIN.base,2);r.line(x0+(x1-x0)*.4,45+y,x1,42+y,SKIN.base,2);}
 r.rect(22,44+y,2,2,'#f2d84a');r.rect(33,44+y,2,2,'#7ae0a0');
 r.put(37,40+y,'#3a6ad0');r.put(38,41+y,'#3a6ad0');r.put(36,41+y,'#3a6ad0');r.put(37,42+y,'#e8853a');
 face(r,y,{iris:'#a0522d',irisDark:'#5a2a14',blink,expr:'smile'});
 r.rect(27,34+y,3,2,'#9a3a44');r.put(28,35+y,'#f08a9a');
 // Palms pressed together just under her chin.
 r.poly(shift([[25,45],[26,38],[28,36],[30,38],[31,45]],y),SKIN.deep);r.poly(shift([[26,44],[27,38],[28,37],[29,38],[30,44]],y),SKIN.base);r.line(28,38+y,28,44+y,SKIN.shade);r.put(27,39+y,SKIN.light);
 // Fringe parted to one side, long locks framing the face.
 layer(r,[[16,30],[17,17],[23,11],[33,11],[39,16],[40,30],[38,36],[37,24],[34,21],[31,24],[28,19],[25,23],[21,21],[19,27],[19,38]],H,{y});
 r.line(21,14+y,29,12+y,H[2]);r.line(32,13+y,37,17+y,H[2]);r.line(17,22+y,17,32+y,H[2]);r.line(28,19+y,25,23+y,H[0]);
}
// ---- Goblin Slayer: slit-visor helm, fur collar, steel plate over dark mail, sword and shield ----
function goblinSlayer(r,{bob,blink}){
 const y=-bob,S=['#5a606c','#9098a6','#cfd5de'],D=['#18181e','#2c2c34','#44444e'],B=['#4a2e1a','#76492a','#9a6a42'];
 // Legs: dark mail, steel knee cops and greaves, heavy boots.
 for(const x of [21,30]){r.rect(x,53,6,15,D[1]);r.rect(x+5,53,1,15,D[0]);layer(r,[[x,57],[x+6,57],[x+6,61],[x+3,63],[x,61]],['#7a7a84','#b8b8c2','#e0e0e8']);layer(r,[[x,63],[x+6,63],[x+6,68],[x,68]],S);r.line(x+1,64,x+1,67,S[2]);r.rect(x-1,68,8,4,'#24242a');r.rect(x-1,71,8,1,'#101014');r.rect(x,68,5,1,'#3a3a42');}
 // Torso: dark suit, steel cuirass with plated tassets, crossing leather straps and belt.
 layer(r,[[18,38],[38,38],[39,54],[17,54]],D,{y});
 layer(r,[[20,40],[36,40],[37,46],[33,50],[23,50],[19,46]],S,{y});r.line(28,41+y,28,49+y,S[0]);r.line(21,45+y,35,45+y,S[0]);r.line(22,41+y,26,41+y,S[2]);
 r.line(19,42+y,37,50+y,B[1],2);r.line(37,42+y,19,50+y,B[0],2);
 r.rect(18,51,20,2,B[1]);r.rect(18,51,20,1,B[2]);r.rect(25,50,6,4,S[1]);r.rect(26,51,4,2,S[0]);r.rect(19,49,4,4,'#a8865a');r.rect(19,49,4,1,'#c8a67a');
 // Pauldrons.
 for(const [x0,d]of [[11,1],[45,-1]])layer(r,[[x0,44],[x0+d*2,38],[x0+d*9,36],[x0+d*12,40],[x0+d*11,45]],S,{y});
 // Sword arm (viewer left): dark sleeve, banded steel bracer, blade pointing down.
 r.line(16,44+y,13,55+y,D[1],4);for(const yy of [48,51,54])r.rect(11,yy+y,6,2,S[1]);r.rect(11,57+y,5,3,'#222228');
 r.line(13,60+y,9,73,S[0],3);r.line(13,60+y,9,72,S[2]);r.line(14,60+y,10,72,S[1]);r.rect(10,58+y,7,2,'#c8c0a0');r.put(8,73,S[2]);
 // Shield arm (viewer right): round buckler with brass studs.
 r.line(40,44+y,43,54+y,D[1],4);
 layer(r,[[40,48],[45,45],[50,48],[52,55],[50,63],[45,66],[40,63],[38,55]],S,{y});r.line(41,50+y,40,61+y,S[2]);r.line(45,46+y,51,58+y,S[0]);
 for(const [x,yy]of [[45,48],[48,56],[45,63],[41,56]])r.rect(x,yy+y,2,2,'#c8b88a');
 // Fur collar around the neck.
 for(let x=15;x<=41;x+=2){const h=2+((x*7)%3);r.rect(x,34+y,2,h+3,x%4?'#e8e6e0':'#c8c4ba');r.put(x,37+h+y,'#a8a49a');}
 // Helm: rounded crown, ridge, slit visor and jutting chin guard.
 layer(r,[[16,30],[16,16],[20,9],[28,6],[36,9],[40,16],[40,30],[36,35],[20,35]],S,{y});
 r.line(18,16+y,22,10+y,S[2]);r.line(17,17+y,17,28+y,S[2]);r.line(28,7+y,28,15+y,S[0]);r.line(20,16+y,36,16+y,S[0]);
 r.rect(21,18+y,15,10,'#14141a');for(const x of [23,26,29,32,35])r.rect(x,18+y,1,10,S[1]);for(const x of [23,29])r.rect(x,18+y,1,10,S[2]);
 if(!blink){r.put(25,22+y,'#ff6a4a');r.put(31,22+y,'#ff6a4a');}
 layer(r,[[20,28],[36,28],[34,35],[28,38],[22,35]],S,{y});r.line(28,29+y,28,37+y,S[0]);
 // Side boss and the branching red plume.
 r.rect(38,20+y,5,5,'#8a8470');r.rect(39,21+y,3,3,'#d8d0b0');r.put(40,22+y,'#8a8470');
 const P='#b0202e',PL='#e04452';r.line(42,21+y,47,15+y,P,2);r.line(46,16+y,52,13+y,P);r.line(47,15+y,49,8+y,P);r.line(49,9+y,53,6+y,P);r.line(50,13+y,54,15+y,P);r.line(48,11+y,45,6+y,P);r.line(43,20+y,47,15+y,PL);
}
// ---- Yumeko Jabami: hime-cut black hair to her knees, red blazer, houndstooth skirt ----
function yumeko(r,{bob,blink}){
 const y=-bob,H=['#120e1a','#221c2e','#3c3650'],R=['#7a1622','#b8283a','#dc4a58'];
 // Long straight hair behind, ending in ragged points.
 layer(r,[[17,16],[39,16],[44,30],[46,52],[46,64],[43,62],[41,66],[39,60],[37,44],[19,44],[17,60],[15,66],[13,62],[10,64],[10,52],[12,30]],H,{y});
 r.line(13,32+y,12,58+y,H[2]);r.line(43,32+y,44,58+y,'#3a3456');r.line(15,40+y,14,60+y,'#2e2844');
 // Black tights and brown loafers.
 legs(r,0,{x:[23,29],top:58,color:'#1e1a22',shadeColor:'#121014',width:5});
 for(const x of [22,29]){r.rect(x,67,7,4,'#8a4a2a');r.rect(x,67,5,1,'#b46a42');r.rect(x,70,7,1,'#4a2614');}
 // Houndstooth skirt.
 layer(r,[[19,52],[37,52],[39,60],[17,60]],['#24242e','#3a3a4a','#55556a']);
 for(let yy=54;yy<59;yy+=2)for(let x=19+(yy%4?1:0);x<38;x+=3)r.put(x,yy,'#5e5e74');r.line(22,53,21,59,'#24242e');r.line(28,53,28,59,'#24242e');r.line(34,53,35,59,'#24242e');
 // Red blazer with black lapels, white shirt and black ribbon.
 layer(r,[[18,39],[38,39],[39,53],[17,53]],R,{y});
 r.poly(shift([[24,39],[32,39],[30,48],[26,48]],y),'#f4f0ee');r.line(24,39+y,27,49+y,'#1a1620',2);r.line(32,39+y,29,49+y,'#1a1620',2);
 r.rect(27,41+y,2,2,'#1a1620');r.put(26,43+y,'#1a1620');r.put(29,43+y,'#1a1620');
 for(const yy of [46,50])r.put(28,yy+y,'#e8c35a');r.line(19,48+y,23,48+y,R[0]);r.line(33,48+y,37,48+y,R[0]);
 // Raised hand at the ribbon; the other hangs at her side.
 r.line(19,41+y,23,46+y,R[1],4);r.line(23,44+y,26,41+y,R[1],3);r.rect(25,39+y,3,3,SKIN.base);r.rect(23,44+y,3,2,'#1a1620');
 r.line(37,41+y,39,53+y,R[0],4);r.line(37,41+y,38,52+y,R[1]);r.rect(37,52+y,4,2,'#1a1620');r.rect(38,54+y,3,3,SKIN.base);r.put(40,56+y,'#e8c35a');
 face(r,y,{iris:'#b85a3a',irisDark:'#6a2a1a',blink,expr:'smile'});r.rect(26,34+y,4,1,'#c06a74');
 // Blunt fringe and straight side locks.
 layer(r,[[16,34],[16,18],[21,11],[28,9],[35,11],[40,18],[40,34],[37,40],[37,24],[19,24],[19,40]],H,{y});
 r.rect(19,23+y,18,1,H[0]);r.line(21,13+y,28,11+y,H[2]);r.line(17,22+y,17,36+y,H[2]);for(const x of [22,26,30,34])r.put(x,23+y,H[1]);
}
// ---- Roronoa Zoro: green robe over a striped kimono, maroon sash, three swords ----
function zoro(r,{bob,blink}){
 const y=-bob,G=['#1c4a30','#2e6a44','#4c8c5e'],M=['#5a1630','#8a2a4a','#b24c6c'];
 // Sword carried over the shoulder, behind the head.
 r.line(6,6+y,22,30+y,'#1a1a1a',3);r.line(7,6+y,22,29+y,'#3a3a46');for(let i=0;i<4;i++)r.put(8+i*2,8+i*3+y,'#e8e8f0');r.rect(4,3+y,4,4,'#c8a24a');r.rect(19,26+y,5,3,'#c8a24a');
 // Black trousers into boots.
 legs(r,0,{x:[22,30],top:60,color:'#1e1e24',shadeColor:'#121216',width:5});
 for(const x of [21,30]){r.rect(x,66,7,5,'#141418');r.rect(x,66,5,1,'#2a2a32');r.rect(x+1,64,5,2,G[1]);}
 // Long robe, open at the chest.
 layer(r,[[17,39],[39,39],[41,64],[15,64]],G,{y});
 for(const yy of [52,56,60])r.rect(19,yy,2,1,'#a8784a');r.line(16,63,40,63,G[0]);
 r.poly(shift([[23,39],[33,39],[31,47],[25,47]],y),TAN.base);r.line(25,41+y,31,46+y,'#a8584a');for(const x of [26,28,30])r.put(x,42+(x-25)/1.2+y,'#7a3a2a');
 r.poly(shift([[25,44],[31,44],[30,49],[26,49]],y),'#7ac05a');for(const x of [26,28,30])r.line(x,44+y,x,48+y,'#5a9a3a');
 r.line(23,39+y,27,50+y,G[0]);r.line(33,39+y,29,50+y,G[0]);
 // Maroon sash with a long hanging end, and two sheathed swords at the hip.
 layer(r,[[17,49],[39,49],[39,54],[17,54]],M,{y,d:.6});r.line(18,50+y,38,50+y,M[2]);
 layer(r,[[33,52],[38,52],[38,62],[34,62]],M);
 r.line(9,46,17,50,'#1a1a1a',2);r.line(9,46,17,50,'#eef0f4');r.put(11,47,'#1a1a1a');r.put(14,48,'#1a1a1a');r.rect(16,49,3,3,'#c8a24a');
 r.line(10,49,17,53,'#1a1a1a',2);r.line(10,49,17,53,'#9a2a2a');r.rect(16,52,3,3,'#c8a24a');
 r.line(38,61,44,67,'#1a1a1a',2);r.line(38,61,44,67,'#eef0f4');r.line(36,62,41,68,'#9a2a2a',2);
 // Raised arm holding the shoulder sword; the other holds a drawn blade down and out.
 r.line(19,41+y,16,32+y,G[1],5);r.line(18,41+y,15,32+y,G[2]);r.rect(15,28+y,4,4,TAN.base);
 r.line(37,41+y,41,52+y,G[1],5);r.rect(37,43+y,5,3,'#1a1a1a');r.put(42,42+y,'#1a1a1a');r.put(43,41+y,'#1a1a1a');r.rect(40,54+y,4,3,TAN.base);
 r.line(43,57+y,52,74,'#7a8494',2);r.line(43,57+y,52,73,'#eef2f8');r.rect(40,54+y,6,2,'#c8a24a');
 head(r,y,{skin:TAN});
 eyes2(r,y,{iris:'#2a2a2a',irisDark:'#141414',blink,wink:1});
 r.line(20,25+y,25,26+y,'#1a2a1a');r.line(31,26+y,36,25+y,'#1a2a1a');r.line(33,24+y,33,33+y,'#b8705e');
 // Wide grin.
 r.rect(24,33+y,8,3,'#3a1a1a');r.rect(25,33+y,6,2,'#f8f4ec');r.line(25,34+y,30,34+y,'#c8c0b4');
 // Short spiky green hair and three gold earrings.
 layer(r,[[17,24],[16,15],[19,10],[23,11],[26,7],[30,10],[34,7],[37,12],[40,15],[39,24],[37,19],[33,21],[29,17],[25,20],[21,18]],['#2a7a3a','#4aa858','#86d88a'],{y});
 for(const yy of [29,31,33])r.put(39,yy+y,'#e8c35a');
}
// ---- Aqua: sky-blue hair with a top loop, blue vest, detached sleeves, thigh boots ----
function aqua(r,{bob,blink}){
 const y=-bob,H=['#3a8ac8','#72c6ee','#b8ecff'],V=['#1c2a78','#2e46a8','#4a6ad0'];
 layer(r,[[16,18],[40,18],[44,34],[45,58],[41,62],[39,44],[17,44],[15,62],[11,58],[12,34]],H,{y});
 r.line(13,34+y,13,56+y,H[2]);r.line(43,34+y,43,56+y,H[0]);
 // Thigh-high boots with white bands and gold tops.
 for(const x of [22,29]){r.rect(x,59,6,10,V[1]);r.rect(x+5,59,1,10,V[0]);r.rect(x,58,6,1,'#e8c35a');r.rect(x,62,6,2,'#f4f6ff');r.rect(x-1,68,7,3,V[0]);r.rect(x,68,4,1,V[2]);r.rect(x+1,60,1,7,V[2]);}
 r.rect(22,55,6,3,SKIN.base);r.rect(29,55,6,3,SKIN.base);
 // Pleated blue skirt with gold trim over a violet underlayer.
 layer(r,[[19,49],[37,49],[41,56],[15,56]],['#3a4ab0','#4a6ad8','#7a9af0']);r.rect(16,56,25,1,'#8a6ab8');r.rect(15,55,26,1,'#e8c35a');
 for(const x of [21,26,31,36])r.line(x,50,x-1,54,'#3a4ab0');
 // Vest with white trim and the green bow.
 layer(r,[[20,39],[36,39],[37,50],[19,50]],V,{y});r.line(20,39+y,20,49+y,'#f4f6ff');r.line(36,39+y,36,49+y,'#f4f6ff');r.line(24,39+y,28,44+y,'#f4f6ff');r.line(32,39+y,28,44+y,'#f4f6ff');
 r.rect(24,42+y,9,3,'#4ac89a');r.rect(23,41+y,3,2,'#6ae0b4');r.rect(31,41+y,3,2,'#6ae0b4');r.rect(27,42+y,3,3,'#2a70d8');r.put(28,43+y,'#9ad8ff');
 // Bare shoulders, white detached sleeves with blue cuffs, hands relaxed outwards.
 r.rect(17,39+y,3,3,SKIN.base);r.rect(36,39+y,3,3,SKIN.base);
 for(const [x0,x1]of [[17,13],[39,43]]){r.line(x0,42+y,x1,51+y,'#dfe4f4',5);r.line(x0,42+y,x1,51+y,'#f8faff',3);r.rect(Math.min(x0,x1)+(x1<x0?-1:0),50+y,6,2,V[1]);r.rect(x1-1,52+y,3,3,SKIN.base);}
 face(r,y,{iris:'#3a8ae0',irisDark:'#1a4aa8',blink,expr:'smile'});
 layer(r,[[16,32],[17,17],[23,11],[33,11],[39,17],[40,32],[38,38],[37,22],[33,24],[30,19],[27,24],[23,20],[19,26],[18,38]],H,{y});
 r.line(22,14+y,30,12+y,H[2]);r.line(17,22+y,17,34+y,H[2]);
 // Hair loop on top, pinned with a blue orb.
 layer(r,[[25,11],[25,4],[28,1],[32,3],[32,10]],H,{y});r.rect(27,4+y,3,4,H[0]);r.rect(26,9+y,5,3,'#2a5ad0');r.put(27,9+y,'#8ab8ff');
}
// ---- Kisuke Urahara: striped bucket hat, pale hair, dark haori, green kimono, cane, geta ----
function urahara(r,{bob,blink}){
 const y=-bob,C=['#262a34','#3e4452','#5c6272'],G=['#2a4a32','#466e4c','#6a9670'];
 // Green trousers and wooden geta.
 for(const x of [22,30]){r.rect(x,56,5,11,G[1]);r.rect(x+4,56,1,11,G[0]);r.rect(x,66,5,1,SKIN.shade);r.rect(x-1,68,7,1,'#b8a47a');r.rect(x,69,1,2,'#8a7450');r.rect(x+4,69,1,2,'#8a7450');r.rect(x+1,67,3,1,'#1a1a1a');}
 // Haori: long open coat, wide sleeves, white diamonds along the hem.
 layer(r,[[15,39],[41,39],[44,64],[12,64]],C,{y});
 for(const [x,yy]of [[33,58],[37,57],[41,58]]){r.poly([[x,yy-3],[x+2,yy],[x,yy+4],[x-2,yy]],'#e8e8e0');}
 r.poly(shift([[23,39],[33,39],[32,57],[24,57]],y),G[1]);r.line(23,39+y,24,57,G[0]);r.line(33,39+y,32,57,G[0]);
 r.poly(shift([[26,39],[30,39],[28,44]],y),SKIN.base);r.line(26,39+y,28,47+y,G[2]);r.line(30,39+y,28,47+y,G[0]);
 r.rect(24,48+y,8,1,'#2a3a2a');r.line(27,49+y,26,53+y,'#2a3a2a');r.line(29,49+y,30,53+y,'#2a3a2a');
 // Hand resting on the cane; the other tucked into the coat.
 r.line(17,41+y,12,50+y,C[1],6);r.line(16,41+y,11,50+y,C[2]);r.rect(10,50+y,4,3,SKIN.base);
 r.line(11,52+y,11,71,'#4a2e3a',2);r.line(11,52+y,11,70,'#6a4a56');r.line(11,52+y,14,49+y,'#4a2e3a',2);
 r.line(39,41+y,42,52+y,C[1],6);r.line(42,52+y,38,54+y,C[0],2);
 face(r,y,{iris:'#6a7a5a',irisDark:'#3a4a30',blink,expr:'smile',eyesY:28});
 r.rect(20,27+y,17,3,mix(SKIN.shade,'#3a3040',.35));
 // Pale shaggy hair under the brim.
 layer(r,[[16,34],[16,22],[40,22],[40,34],[37,30],[35,35],[32,28],[29,32],[26,27],[23,33],[20,28],[18,36]],['#b8a878','#e6dcac','#fff6d2'],{y});
 // Bucket hat with vertical green and white stripes.
 layer(r,[[18,22],[19,10],[23,7],[33,7],[37,10],[38,22]],['#3a5a3a','#dfe8d8','#ffffff'],{y});
 for(const x of [21,25,29,33])r.rect(x,8+y,2,14,'#5a8a5a');
 layer(r,[[12,22],[44,22],[46,26],[10,26]],['#2e4a30','#5a8a5a','#8aba8a'],{y,d:.6});for(const x of [13,19,25,31,37,43])r.rect(x,23+y,3,2,'#dfe8d8');
}
// ---- Gilgamesh: gold armour with blue tracery, red tassets, swept-up hair, a raised fist ----
function gilgamesh(r,{bob,blink}){
 const y=-bob,A=['#9a6c1a','#deae40','#f8dc78'],L='#2a3a7a',RC=['#7a0e18','#c41e2a','#e8484e'];
 // Red cloth falling from the waist on both sides.
 layer(r,[[17,50],[22,50],[20,60],[12,70],[10,64]],RC);layer(r,[[34,50],[39,50],[46,64],[44,70],[36,60]],RC);
 // Armoured legs with pointed sabatons.
 for(const x of [22,30]){layer(r,[[x,53],[x+5,53],[x+5,67],[x,67]],A);r.line(x+2,55,x+2,65,L);r.poly([[x-1,67],[x+6,67],[x+8,71],[x-1,71]],A[0]);r.poly([[x,67],[x+5,67],[x+6,70],[x,70]],A[1]);}
 layer(r,[[25,52],[31,52],[29,66],[27,66]],A);r.line(28,53,28,64,L);
 // Breastplate, faulds and tracery.
 layer(r,[[18,39],[38,39],[37,53],[19,53]],A,{y});
 r.line(28,40+y,28,52+y,L);r.line(21,44+y,28,47+y,L);r.line(35,44+y,28,47+y,L);r.line(20,49+y,36,49+y,A[0]);r.line(22,51+y,34,51+y,L);
 r.rect(26,38+y,5,2,'#1e2448');
 // Huge pauldrons.
 layer(r,[[9,44],[10,38],[15,35],[22,37],[23,43],[18,47]],A,{y});layer(r,[[47,44],[46,38],[41,35],[34,37],[33,43],[38,47]],A,{y});
 r.line(11,39+y,16,36+y,'#fff2b0');r.line(36,37+y,41,36+y,'#fff2b0');r.line(12,43+y,20,43+y,L);r.line(36,43+y,44,43+y,L);
 // Fist raised beside his head; the other hand on his hip.
 r.line(14,44+y,11,32+y,A[1],5);r.line(13,44+y,10,32+y,A[2]);r.line(12,36+y,15,36+y,L);r.rect(8,26+y,6,6,A[1]);r.rect(8,26+y,6,1,A[2]);r.line(9,28+y,13,28+y,A[0]);
 r.line(42,45+y,40,52+y,A[1],5);r.rect(37,50+y,4,4,A[0]);
 face(r,y,{iris:'#d0202e',irisDark:'#6a0a14',blink,expr:'focused'});
 r.line(20,25+y,25,26+y,'#a8802a');r.line(31,26+y,36,25+y,'#a8802a');r.line(26,34+y,30,33+y,'#a8584a');
 // Hair swept back and up in short spikes.
 layer(r,[[17,26],[16,15],[18,9],[22,8],[24,3],[28,6],[31,1],[34,6],[39,5],[38,11],[41,15],[40,26],[38,20],[35,21],[33,17],[29,19],[25,17],[22,20],[19,19]],['#b88a26','#f0d060','#fff2a8'],{y});
 r.line(23,9+y,27,13+y,'#fff2a8');r.line(31,4+y,32,12+y,'#fff2a8');
}
// ---- Vegeta: towering flame hair, widow's peak, white Saiyan armour, gloves and boots ----
function vegeta(r,{bob,blink}){
 const y=-bob,B=['#1a2a88','#2a44c4','#5070ec'],W=['#b8b8c6','#eeeef4','#ffffff'],Y=['#a8801a','#e8c030','#fff08a'];
 // Blue suit legs and white boots with flared cuffs.
 for(const x of [21,30]){layer(r,[[x,53],[x+6,53],[x+6,62],[x,62]],B);layer(r,[[x-1,61],[x+7,61],[x+6,71],[x,71]],W);r.rect(x-1,61,8,1,W[0]);r.rect(x,70,7,1,W[0]);}
 // Muscular blue suit under the chest armour.
 layer(r,[[17,38],[39,38],[38,54],[18,54]],B,{y});
 layer(r,[[19,41],[37,41],[36,52],[20,52]],W,{y});r.line(28,42+y,28,46+y,W[0]);r.line(21,46+y,35,46+y,W[0]);r.line(22,43+y,26,43+y,W[2]);
 r.rect(21,48+y,15,4,Y[1]);for(const yy of [49,51])r.line(21,yy+y,35,yy+y,Y[0]);r.line(21,48+y,35,48+y,Y[2]);
 for(const x of [19,33])layer(r,[[x,37],[x+4,37],[x+4,42],[x,42]],Y,{y,d:.6});
 // Arms at his sides, white gloves clenched.
 for(const [x0,x1]of [[18,14],[38,42]]){r.line(x0,41+y,x1,51+y,B[1],5);r.line(x0-1,41+y,x1-1,50+y,B[2]);layer(r,[[x1-3,50],[x1+3,50],[x1+3,57],[x1-3,57]],W,{y});r.line(x1-2,53+y,x1+2,53+y,W[0]);}
 const skin={base:'#f6cba4',shade:'#d89a78',deep:'#b8785c',light:'#ffe4c8'};head(r,y,{skin});
 // Fierce brows, narrowed eyes, smirk.
 for(const [x,d]of [[19,1],[37,-1]])for(let i=0;i<7;i++){r.put(x+d*i,23+Math.floor(i/2)+y,'#14141c');r.put(x+d*i,24+Math.floor(i/2)+y,'#14141c');}
 for(const ex of [21,31]){if(blink){r.line(ex,28+y,ex+3,28+y,'#14141c');continue;}r.rect(ex,27+y,4,2,'#fffaf4');r.rect(ex+(ex<28?2:0),27+y,2,2,'#14141c');r.line(ex,26+y,ex+3,26+y,'#14141c');}
 r.put(28,30+y,skin.shade);r.put(29,31+y,skin.shade);r.line(26,34+y,30,33+y,'#8a4a3a');r.put(31,33+y,'#8a4a3a');
 // Flame hair: widow's peak and tall swept spikes.
 layer(r,[[17,27],[15,16],[13,8],[18,10],[18,2],[23,6],[26,-1],[29,4],[33,0],[34,6],[39,3],[38,11],[42,9],[40,17],[39,27],[37,21],[33,20],[28,26],[23,20],[19,21]],['#0c0c14','#1c1a26','#3a3650'],{y});
 r.line(19,6+y,22,14+y,'#3a3650');r.line(29,4+y,29,13+y,'#3a3650');r.line(36,6+y,34,14+y,'#3a3650');
}
// ---- Hotaru Haganezuka: hyottoko mask, straw hat with chimes, dark kimono, katana ----
function haganezuka(r,{bob,blink}){
 const y=-bob,kim='#2e3a52',kd='#1e2638',kl='#4a5a7a';
 legs(r,0,{x:[22,30],top:56,color:'#6a6a72',shadeColor:'#4a4a52'});shoes(r,0,{color:'#8a6a42',width:6});
 r.poly([[18,39+y],[38,39+y],[41,60],[15,60]],kd);r.poly([[19,40+y],[37,40+y],[39,59],[17,59]],kim);
 r.poly([[25,39+y],[31,39+y],[28,48+y]],'#d8cfc0');r.rect(17,49+y,22,3,'#8a2a2a');
 limb(r,19,41+y,15,52+y,{color:kd,light:kl,width:5,hand:SKIN.base});limb(r,37,41+y,40,50+y,{color:kd,light:kl,width:5,hand:SKIN.base});
 // Sheathed katana held across the body.
 r.line(12,58,46,40+y,'#1a1a1a',2);r.line(12,58,46,40+y,'#3a3a44');r.rect(36,44+y,3,3,'#c8a24a');r.line(38,44+y,46,40+y,'#6a3a2a',2);
 head(r,y,{skin:SKIN});
 // Mask: pursed, puckered mouth, uneven eyes and red cheeks.
 r.poly(shift([[19,19],[37,19],[38,30],[35,37],[28,40],[21,37],[18,30]],y),'#e9e2d2');r.poly(shift([[20,20],[36,20],[37,30],[34,36],[28,38],[22,36],[19,30]],y),'#fbf5e8');
 r.rect(21,25+y,4,blink?1:3,'#1a1a1a');r.rect(32,24+y,3,blink?1:4,'#1a1a1a');r.line(20,23+y,25,22+y,'#1a1a1a');r.line(31,21+y,36,23+y,'#1a1a1a');
 r.rect(20,30+y,3,2,'#e87a7a');r.rect(34,30+y,3,2,'#e87a7a');
 r.poly(shift([[29,31],[35,32],[36,35],[31,35]],y),'#e8b8a0');r.rect(33,32+y,3,3,'#c85a5a');r.put(34,33+y,'#5a1a1a');
 r.line(26,28+y,28,30+y,'#c8b8a8');
 // Straw hat with dangling chimes.
 r.poly(shift([[8,18],[28,6],[48,18],[44,20],[12,20]],y),'#a8843a');r.poly(shift([[11,17],[28,8],[45,17],[42,18],[14,18]],y),'#d8b45a');
 for(let x=14;x<44;x+=5)r.line(x,17+y,x+3,12+y,'#b8943a');
 for(const x of [11,20,36,45]){r.line(x,20+y,x,24+y,'#6a5a3a');r.rect(x-1,24+y,3,2,'#7ad0d8');}
}
// ---- Kyubey: white cat-like messenger with ear tufts and golden rings ----
function kyubey(r,{bob,blink}){
 const y=-bob,w='#f7f6fb',ws='#cfcadb',pink='#f29ab8';
 // Tail curling up behind.
 r.poly([[36,62],[44,58],[50,46],[48,36],[44,40],[46,50],[40,56]],ws);r.poly([[37,61],[44,57],[48,46],[47,39],[45,42],[45,50],[40,55]],w);r.rect(46,36,3,4,pink);
 // Body and paws.
 r.poly([[18,52],[24,46+y],[34,46+y],[40,52],[40,64],[18,64]],ws);r.poly([[19,52],[25,47+y],[33,47+y],[39,52],[39,63],[19,63]],w);
 r.rect(20,63,5,3,w);r.rect(33,63,5,3,w);r.rect(20,65,5,1,ws);r.rect(33,65,5,1,ws);
 r.poly([[25,49+y],[33,49+y],[31,53+y],[27,53+y]],'#e9425a');r.put(29,51+y,'#ffb0bc');
 // Round head, ear flaps from inside the ears with gold rings.
 r.poly(shift([[17,34],[20,26],[28,23],[36,26],[39,34],[37,42],[28,46],[19,42]],y),ws);r.poly(shift([[18,34],[21,27],[28,24],[35,27],[38,34],[36,41],[28,45],[20,41]],y),w);
 r.poly(shift([[19,27],[17,18],[22,25]],y),w);r.poly(shift([[37,27],[39,18],[34,25]],y),w);r.put(18,21+y,pink);r.put(38,21+y,pink);
 for(const [x0,d]of [[20,-1],[36,1]]){r.poly(shift([[x0,38],[x0+d*3,40],[x0+d*5,54],[x0+d*3,58],[x0+d,52]],y),w);r.line(x0+d*2,42+y,x0+d*4,54+y,pink);r.rect(x0+d*3-1,44+y,3,2,'#e8c35a');}
 if(blink){r.line(23,35+y,25,35+y,'#6a1a2a');r.line(31,35+y,33,35+y,'#6a1a2a');}
 else{r.rect(22,33+y,4,4,'#c8203a');r.rect(30,33+y,4,4,'#c8203a');r.put(23,33+y,'#ff8a9a');r.put(31,33+y,'#ff8a9a');}
 r.line(27,39+y,29,40+y,'#c8b8c8');r.line(29,40+y,31,39+y,'#c8b8c8');
 r.put(24,30+y,pink);r.put(32,30+y,pink);
}
// ---- Ryuk: towering shinigami with a wide grin, wings and an apple ----
function ryuk(r,{bob,blink}){
 const y=-bob,skin={base:'#a7aec0',shade:'#7c8398',deep:'#5c6278',light:'#c8cedc'},black='#1a1820',bd='#0e0c12',bl='#3a3646';
 r.poly([[18,40+y],[2,30+y],[6,40+y],[1,46+y],[8,50+y],[4,58+y],[18,52]],bd);r.poly([[38,40+y],[54,30+y],[50,40+y],[55,46+y],[48,50+y],[52,58+y],[38,52]],bd);
 r.line(18,40+y,3,31+y,bl);r.line(38,40+y,53,31+y,bl);
 legs(r,0,{x:[22,30],top:56,color:black,shadeColor:bd});shoes(r,0,{color:bd,width:6});
 torso(r,y,{color:black,shade:bd,light:bl,top:38,bottom:58,w:10,flare:2});
 for(let i=0;i<5;i++)r.rect(20+i*4,44+y+(i%2),2,2,'#c8ccd8');r.line(18,50+y,38,50+y,'#5a5a6a');
 limb(r,19,41+y,13,54+y,{color:skin.shade,light:skin.base,width:3,hand:skin.base,handShade:skin.shade});
 limb(r,37,41+y,42,48+y,{color:skin.shade,light:skin.base,width:3,hand:skin.base,handShade:skin.shade});
 r.rect(41,44+y,5,5,'#d8283a');r.put(42,45+y,'#ff8a8a');r.put(43,43+y,'#5a3a1a');r.put(44,42+y,'#4a9a3a');
 head(r,y,{skin});
 r.poly(shift([[22,22],[34,22],[35,27],[30,28],[26,28],[21,27]],y),skin.deep);
 if(blink){r.line(22,25+y,26,25+y,'#e8d84a');r.line(30,25+y,34,25+y,'#e8d84a');}
 else{r.rect(21,23+y,5,5,'#f4e64a');r.rect(30,23+y,5,5,'#f4e64a');r.rect(23,24+y,2,3,'#c8203a');r.rect(31,24+y,2,3,'#c8203a');r.put(23,25+y,'#1a0a0a');r.put(32,25+y,'#1a0a0a');}
 // Ear-to-ear grin with teeth; dark lips.
 r.poly(shift([[19,31],[37,31],[33,36],[23,36]],y),'#2a1a2a');for(let x=21;x<36;x+=2){r.rect(x,31+y,1,2,'#f4f0e8');r.rect(x+1,34+y,1,2,'#f4f0e8');}
 r.line(18,30+y,21,32+y,skin.deep);r.line(38,30+y,35,32+y,skin.deep);
 // Wild spiked black hair.
 r.poly(shift([[16,24],[8,18],[14,16],[8,8],[17,11],[16,2],[23,9],[28,0],[32,8],[40,2],[39,11],[48,8],[42,16],[48,18],[40,24],[36,20],[20,20]],y),black);
 r.line(17,11+y,24,14+y,bl);r.line(39,11+y,32,14+y,bl);
}
// ---- Master Roshi: bald, white beard, shades, turtle shell and staff ----
function roshi(r,{bob,blink}){
 const y=-bob;
 r.poly([[16,40+y],[40,40+y],[42,56],[14,56]],'#3a6a2a');r.poly([[17,41+y],[39,41+y],[41,55],[15,55]],'#5a9a3a');
 for(const [x,yy]of [[22,46],[30,46],[26,51]])r.rect(x,yy+y,5,4,'#7aba4a');
 legs(r,0,{x:[22,30],top:56,color:'#d8a878',shadeColor:'#b8885a'});shoes(r,0,{color:'#6a4a2a',width:6,height:3,top:68});
 torso(r,y,{color:'#f08a3a',shade:'#c8601e',light:'#ffb06a',top:39,bottom:56,w:8});
 for(const [x,yy]of [[21,44],[31,48],[25,52],[33,42]]){r.rect(x,yy+y,3,2,'#ffe06a');r.put(x+1,yy+1+y,'#3a9a3a');}
 limb(r,19,41+y,14,51+y,{color:'#f08a3a',light:'#ffb06a',width:4,hand:'#e8c09a',handShade:'#c89a72'});
 limb(r,37,41+y,42,50+y,{color:'#f08a3a',light:'#ffb06a',width:4,hand:'#e8c09a',handShade:'#c89a72'});
 r.line(44,30+y,42,68,'#8a5a2a',2);r.line(43,30+y,41,68,'#b8844a');r.rect(41,28+y,5,3,'#6a3a1a');
 const skin={base:'#ecc8a0',shade:'#c89a72',deep:'#a8785a',light:'#fde2c0'};head(r,y,{skin});
 r.poly(shift([[18,22],[19,14],[28,10],[37,14],[38,22]],y),skin.base);r.line(22,13+y,28,11+y,skin.light);
 // Sunglasses and the long white beard.
 r.rect(20,26+y,7,4,'#1a1a24');r.rect(30,26+y,7,4,'#1a1a24');r.line(27,27+y,30,27+y,'#1a1a24');r.put(21,27+y,'#6a7ab8');r.put(31,27+y,'#6a7ab8');
 r.poly(shift([[20,32],[36,32],[35,44],[31,52],[28,56],[25,52],[21,44]],y),'#d8d8e0');r.poly(shift([[21,32],[35,32],[34,43],[30,50],[28,53],[26,50],[22,43]],y),'#f8f8fc');
 r.rect(24,33+y,9,2,'#e8e8f0');r.line(18,24+y,22,23+y,'#f8f8fc');r.line(38,24+y,34,23+y,'#f8f8fc');
}

const NPC_ART={nami,goblinslayer:goblinSlayer,haganezuka,kyubey,ryuk,urahara,aqua,yumeko,zoro,gilgamesh,vegeta,roshi};
export const NPC_ART_IDS=Object.keys(NPC_ART);
const cache=new Map();
export function npcPixels(id,{bob=0,blink=false}={}){
 const key=id+':'+bob+':'+blink;if(cache.has(key))return cache.get(key);
 const draw=NPC_ART[id];if(!draw)return null;
 const r=canvas();draw(r,{bob,blink});const result=selout(r.pixels,'#120e1a');cache.set(key,result);return result;
}
