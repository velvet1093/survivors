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

// ---- Nami: long orange waves, striped bikini top, jeans, Clima-Tact ----
function nami(r,{bob,blink}){
 const y=-bob,hair='#f08a32',hs='#c2601e',hl='#ffb867';
 r.poly(shift([[16,22],[14,34],[13,50],[16,58],[20,52],[22,40],[34,40],[36,52],[40,58],[43,50],[42,34],[40,22]],y),hs);
 r.poly(shift([[17,23],[15,36],[15,50],[17,55],[20,48],[22,38],[34,38],[36,48],[39,55],[41,50],[41,36],[39,23]],y),hair);
 legs(r,0,{x:[22,30],top:54,color:'#4a6aa8',shadeColor:'#33497a'});shoes(r,0,{color:'#c48a52'});
 torso(r,y,{color:SKIN.base,shade:SKIN.shade,top:39,bottom:54,w:8});
 r.rect(20,42+y,7,4,'#ffffff');r.rect(29,42+y,7,4,'#ffffff');for(const x of [21,23,25,30,32,34])r.rect(x,42+y,1,4,'#4a7fd0');
 r.rect(19,51,18,3,'#4a6aa8');r.rect(19,51,18,1,'#8a5a32');r.rect(27,51,2,2,'#e8c35a');
 // Tangerine-and-pinwheel tattoo on the left shoulder.
 r.put(19,40+y,'#4a7fd0');r.put(18,41+y,'#4a7fd0');r.put(20,41+y,'#4a7fd0');r.put(19,42+y,'#e8853a');
 limb(r,19,40+y,15,51+y,{color:SKIN.base,light:SKIN.light,width:3});
 limb(r,37,40+y,42,48+y,{color:SKIN.base,light:SKIN.light,width:3});
 // Clima-Tact staff held upright.
 r.line(44,26+y,44,66,'#3a6ad0',2);r.line(44,26+y,44,66,'#8ab4ff');r.rect(43,36+y,4,2,'#e8c35a');r.rect(43,50+y,4,2,'#e8c35a');
 face(r,y,{iris:'#a3582a',irisDark:'#6a3418',blink,expr:'smile'});
 r.poly(shift([[17,26],[18,16],[24,12],[33,12],[39,17],[39,27],[36,20],[33,23],[30,19],[27,22],[24,18],[21,22]],y),hair);
 r.line(22,15+y,30,13+y,hl);r.line(33,15+y,37,19+y,hl);r.line(15,36+y,16,48+y,hl);
}
// ---- Goblin Slayer: bucket helm with a single plume, scuffed leather, buckler ----
function goblinSlayer(r,{bob,blink}){
 const y=-bob,steel='#8c94a0',sd='#5c6270',sl='#c3c9d2',leather='#6a4a32',ld='#47301f';
 // Ragged cloak behind.
 r.poly([[17,40+y],[39,40+y],[42,64],[36,61],[31,65],[26,61],[20,65],[14,62]],'#4a3a2c');
 legs(r,0,{x:[21,30],top:54,color:'#4b3d32',shadeColor:'#33281f',width:6});shoes(r,0,{color:'#3a2c22',width:7,x:[21,30]});
 torso(r,y,{color:leather,shade:ld,light:'#8a6446',w:10});
 r.rect(19,44+y,18,6,sd);r.rect(20,44+y,16,5,steel);for(let x=21;x<36;x+=3)r.put(x,46+y,sl);
 r.rect(18,52,20,2,'#2a1e16');r.rect(27,52,2,2,'#a88a4a');
 limb(r,19,41+y,14,50+y,{color:ld,light:leather,width:4,hand:'#3a2c22',handShade:'#2a1e16'});
 // Round buckler on the left arm and a short sword lowered on the right.
 r.poly([[6,44+y],[10,40+y],[16,40+y],[19,44+y],[19,51+y],[15,55+y],[10,55+y],[6,51+y]],sd);r.poly([[7,45+y],[10,41+y],[16,41+y],[18,45+y],[18,50+y],[15,54+y],[10,54+y],[7,50+y]],steel);r.rect(11,46+y,4,4,sl);
 limb(r,37,41+y,41,51+y,{color:ld,light:leather,width:4,hand:'#3a2c22',handShade:'#2a1e16'});
 r.line(42,55+y,46,66,sl,2);r.line(43,55+y,46,65,'#e6eaf0');r.rect(40,53+y,5,2,'#7a5a32');
 // Helm: rounded steel bucket, eye slit and a red plume off one side.
 r.poly(shift([[17,30],[17,18],[21,12],[35,12],[39,18],[39,30],[36,38],[20,38]],y),sd);
 r.poly(shift([[18,29],[18,18],[22,13],[34,13],[38,18],[38,29],[35,36],[21,36]],y),steel);
 r.line(20,16+y,24,13+y,sl);r.line(19,18+y,19,28+y,sl);r.rect(20,25+y,16,3,'#1a1c24');
 for(const x of [22,25,28,31,34])r.rect(x,31+y,1,3,sd);
 if(!blink){r.put(24,26+y,'#ffcf6a');r.put(31,26+y,'#ffcf6a');}
 r.poly(shift([[37,14],[42,6],[46,4],[44,10],[40,16]],y),'#a8323a');r.line(38,14+y,44,6+y,'#d8545a');
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
// ---- Kisuke Urahara: striped bucket hat, green haori, cane and fan ----
function urahara(r,{bob,blink}){
 const y=-bob,green='#3a6a4a',gd='#244530',gl='#5a8a64';
 legs(r,0,{x:[22,30],top:56,color:'#2a2a34',shadeColor:'#1a1a22'});shoes(r,0,{color:'#6a4a2a',light:'#8a6a42',height:3,width:6,top:68});
 r.poly([[16,39+y],[40,39+y],[43,62],[13,62]],gd);r.poly([[17,40+y],[39,40+y],[41,61],[15,61]],green);
 for(let x=16;x<41;x+=6){r.poly([[x,58],[x+3,58],[x+2,61],[x+1,61]],'#e8e8e0');}
 r.poly([[24,39+y],[32,39+y],[30,52],[26,52]],'#2a2a34');r.line(24,39+y,27,52,'#e8e8e0');r.line(32,39+y,29,52,'#e8e8e0');
 limb(r,18,41+y,14,52+y,{color:gd,light:gl,width:5,hand:SKIN.base});limb(r,38,41+y,41,49+y,{color:gd,light:gl,width:5,hand:SKIN.base});
 r.line(12,55+y,12,68,'#6a4a2a',2);r.line(11,55+y,15,55+y,'#8a6a42',2);
 r.poly([[40,44+y],[48,38+y],[49,46+y]],'#f0f0e8');r.line(40,44+y,48,40+y,'#8a8a80');
 face(r,y,{iris:'#7a8a5a',irisDark:'#4a5a3a',blink,expr:'smile',eyesY:28});
 // Messy blond fringe, then the striped hat pulled low over the eyes.
 r.poly(shift([[18,30],[17,22],[39,22],[39,30],[36,26],[33,29],[30,25],[27,30],[24,26],[21,29]],y),'#e8d27a');
 r.poly(shift([[14,24],[18,12],[38,12],[42,24],[44,26],[12,26]],y),'#2a4a34');r.poly(shift([[15,23],[19,13],[37,13],[41,23]],y),'#3f6a4c');
 for(const yy of [16,20])r.rect(17,yy+y,22,2,'#f0f0e8');r.rect(12,25+y,32,2,'#1a3024');
}
// ---- Aqua: blue hair with a looped ribbon, goddess outfit ----
function aqua(r,{bob,blink}){
 const y=-bob,hair='#5ab0f0',hs='#3a7ac8',hl='#9ad8ff';
 r.poly(shift([[16,24],[13,40],[12,62],[18,60],[21,42],[35,42],[38,60],[44,62],[43,40],[40,24]],y),hs);
 r.poly(shift([[17,25],[14,40],[14,59],[18,57],[21,40],[35,40],[38,57],[42,59],[42,40],[39,25]],y),hair);
 legs(r,0,{x:[23,29],top:56,color:'#f4f4fa',shadeColor:'#c8c8da',width:4});shoes(r,0,{color:'#3a7ac8',x:[23,29],width:5});
 r.poly([[18,48],[38,48],[42,58],[14,58]],'#3a7ac8');r.poly([[19,48],[37,48],[40,57],[16,57]],'#5aa0e8');r.line(16,57,40,57,'#ffffff');
 torso(r,y,{color:'#4a8ad8',shade:'#2a5aa8',light:'#7ab4f4',top:39,bottom:49,w:8});
 r.poly([[24,39+y],[32,39+y],[28,45+y]],'#ffffff');r.rect(27,44+y,2,2,'#7ad0ff');
 limb(r,19,41+y,14,51+y,{color:'#ffffff',light:'#ffffff',width:3});limb(r,37,41+y,43,46+y,{color:'#ffffff',light:'#ffffff',width:3});
 // A floating bead of water above her palm.
 r.rect(43,39+y,4,4,'#7ad0ff');r.put(44,39+y,'#ffffff');r.rect(44,43+y,2,1,'#3a8ad0');
 face(r,y,{iris:'#4a9ae8',irisDark:'#2a5aa8',blink,expr:'smile'});
 r.poly(shift([[17,27],[18,16],[24,11],[33,11],[39,16],[39,28],[36,20],[32,23],[29,18],[26,23],[22,19],[20,24]],y),hair);
 r.poly(shift([[33,9],[39,3],[42,8],[37,12]],y),hair);r.rect(35,9+y,3,3,'#4a9ae8');r.put(36,10+y,'#9ad8ff');
 r.line(22,14+y,30,12+y,hl);r.line(15,40+y,15,54+y,hl);
}
// ---- Yumeko Jabami: long black hair, red blazer, a fan of cards ----
function yumeko(r,{bob,blink}){
 const y=-bob,hair='#1e1a26',hs='#0e0c14',hl='#4a4258';
 r.poly(shift([[16,22],[13,40],[13,60],[19,58],[21,40],[35,40],[37,58],[43,60],[43,40],[40,22]],y),hs);
 r.poly(shift([[17,23],[14,40],[15,57],[19,55],[21,38],[35,38],[37,55],[41,57],[42,40],[39,23]],y),hair);
 legs(r,0,{x:[23,29],top:58,color:'#1a1a22',shadeColor:'#0e0e14',width:4});shoes(r,0,{color:'#2a1a1a',x:[23,29],width:5});
 r.poly([[18,50],[38,50],[41,60],[15,60]],'#1a1a26');r.poly([[19,50],[37,50],[39,59],[17,59]],'#2a2a3a');
 torso(r,y,{color:'#b82a3a',shade:'#7a1a26',light:'#e04a5a',top:39,bottom:51,w:9});
 r.poly([[25,39+y],[31,39+y],[28,47+y]],'#f4f0f0');r.rect(27,41+y,2,4,'#1a1a26');
 limb(r,19,41+y,15,51+y,{color:'#7a1a26',light:'#b82a3a',width:4});limb(r,37,41+y,42,46+y,{color:'#7a1a26',light:'#b82a3a',width:4});
 // Fanned cards.
 for(const [dx,c]of [[0,'#f4f0e8'],[2,'#f4f0e8'],[4,'#f4f0e8']]){r.poly([[41+dx,44+y],[45+dx,38+y],[48+dx,40+y],[44+dx,46+y]],'#9a9088');r.poly([[42+dx,44+y],[45+dx,39+y],[47+dx,40+y],[44+dx,45+y]],c);}
 r.put(48,40+y,'#c8203a');r.put(46,42+y,'#1a1a1a');
 face(r,y,{iris:'#d8203a',irisDark:'#7a0a1a',blink,expr:'smile'});
 r.poly(shift([[17,26],[17,17],[23,11],[33,11],[39,17],[39,26],[37,21],[33,21],[28,20],[23,21],[19,21]],y),hair);r.rect(18,20+y,21,1,hair);
 r.line(21,14+y,29,12+y,hl);r.line(15,40+y,16,52+y,hl);
}
// ---- Roronoa Zoro: green crop, three swords, white shirt and green sash ----
function zoro(r,{bob,blink}){
 const y=-bob;
 legs(r,0,{x:[22,30],top:55,color:'#2a2a34',shadeColor:'#1a1a22'});shoes(r,0,{color:'#1a1a1a',width:6});
 torso(r,y,{color:'#f0ede4',shade:'#c8c2b4',light:'#ffffff',top:39,bottom:55,w:9});
 r.poly([[24,39+y],[32,39+y],[28,46+y]],TAN.base);r.rect(18,48+y,21,6,'#2e7a3a');r.rect(18,48+y,21,1,'#4aa058');r.rect(18,53+y,21,1,'#1e5a28');
 // Three katana at the hip.
 for(const [i,c]of [[0,'#f0ede4'],[1,'#1a1a1a'],[2,'#c8203a']]){r.line(12+i*2,62-i,40+i,49+y-i,'#1a1a1a',2);r.line(12+i*2,62-i,40+i,49+y-i,c);r.rect(36+i,49+y-i,2,2,'#c8a24a');}
 limb(r,19,41+y,15,51+y,{color:TAN.base,light:TAN.light,width:4,hand:TAN.base,handShade:TAN.shade});
 limb(r,37,41+y,41,51+y,{color:TAN.shade,light:TAN.base,width:4,hand:TAN.base,handShade:TAN.shade});r.rect(37,43+y,4,3,'#1a1a1a');
 face(r,y,{skin:TAN,iris:'#3a3a3a',irisDark:'#1a1a1a',blink,expr:'focused'});
 // Scar down the left eye, kept closed.
 r.rect(30,26+y,6,6,TAN.base);r.line(31,29+y,34,29+y,'#4a2a2a');r.line(32,24+y,34,33+y,'#a8584a');
 r.poly(shift([[17,25],[17,16],[22,11],[34,11],[39,16],[39,25],[37,21],[34,22],[30,19],[26,22],[22,20],[19,23]],y),'#3a8a3a');
 r.line(21,14+y,28,12+y,'#6ac06a');r.line(31,13+y,36,16+y,'#6ac06a');
 for(const yy of [33,35])r.put(38,yy+y,'#e8c35a');
}
// ---- Gilgamesh: golden armour and swept-up blond hair ----
function gilgamesh(r,{bob,blink}){
 const y=-bob,gold='#e8b84a',gd='#a87a22',gl='#ffe28a';
 legs(r,0,{x:[22,30],top:55,color:gd,shadeColor:'#7a5418',width:5});shoes(r,0,{color:gold,light:gl,width:6});
 r.poly([[18,52],[38,52],[41,60],[15,60]],'#2a2a3a');r.poly([[19,52],[37,52],[40,59],[16,59]],'#3a3a52');
 torso(r,y,{color:gold,shade:gd,light:gl,top:39,bottom:53,w:10});
 r.rect(20,44+y,16,2,gd);r.rect(26,40+y,4,4,'#c8203a');r.put(27,41+y,'#ff8a8a');
 r.poly([[16,39+y],[22,38+y],[22,44+y],[15,44+y]],gl);r.poly([[34,38+y],[40,39+y],[41,44+y],[34,44+y]],gl);
 limb(r,17,43+y,13,52+y,{color:gd,light:gold,width:4,hand:gold,handShade:gd});limb(r,39,43+y,44,48+y,{color:gd,light:gold,width:4,hand:gold,handShade:gd});
 // A golden ripple of the Gate of Babylon behind his raised hand.
 for(let a=0;a<6.28;a+=.4)r.put(46+Math.cos(a)*5,40+y+Math.sin(a)*5,gl);r.line(46,35+y,50,30+y,'#d8dce4');
 face(r,y,{iris:'#d8203a',irisDark:'#7a0a1a',blink,expr:'focused'});
 r.poly(shift([[17,24],[15,14],[20,7],[26,10],[28,3],[32,9],[38,5],[40,13],[39,24],[36,19],[32,21],[29,17],[25,21],[21,18]],y),'#f0d06a');
 r.line(20,10+y,26,13+y,'#fff0a8');r.line(32,10+y,37,9+y,'#fff0a8');
}
// ---- Vegeta: flame-shaped hair, Saiyan armour, white gloves ----
function vegeta(r,{bob,blink}){
 const y=-bob,blue='#2a3a8a',bd='#1a2458',bl='#4a5ab8';
 legs(r,0,{x:[22,30],top:54,color:blue,shadeColor:bd});shoes(r,0,{color:'#f4f0e8',light:'#ffffff',sole:'#c8a24a',height:5,top:66});
 torso(r,y,{color:blue,shade:bd,light:bl,top:39,bottom:55,w:9});
 r.poly([[18,41+y],[38,41+y],[37,52+y],[19,52+y]],'#e8e4d8');r.poly([[19,42+y],[37,42+y],[36,51+y],[20,51+y]],'#fbf8ee');r.rect(19,49+y,18,3,'#d8b04a');
 r.poly([[14,40+y],[21,38+y],[22,44+y],[14,44+y]],'#d8b04a');r.poly([[35,38+y],[42,40+y],[42,44+y],[34,44+y]],'#d8b04a');
 limb(r,17,43+y,14,52+y,{color:bd,light:blue,width:4,hand:'#f4f0e8',handShade:'#c8c2b4'});
 limb(r,39,43+y,43,47+y,{color:bd,light:blue,width:4,hand:'#f4f0e8',handShade:'#c8c2b4'});
 face(r,y,{iris:'#1a1a2a',irisDark:'#0a0a14',blink,expr:'focused'});
 r.line(20,25+y,25,26+y,'#1a1a24');r.line(36,25+y,31,26+y,'#1a1a24');
 // Widow's peak and the tall flame of hair.
 r.poly(shift([[18,26],[16,14],[19,4],[24,8],[28,-2],[32,8],[37,4],[40,14],[38,26],[35,19],[28,24],[21,19]],y),'#14161e');
 r.line(22,9+y,26,14+y,'#3a3e52');r.line(33,9+y,30,14+y,'#3a3e52');
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
