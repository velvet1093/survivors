import {enemyArtFrame,enemyLegs,ENEMY_INK,ENEMY_SKIN} from './enemy-art-kit.js';

// Expedition cast on the shared 56 × 76 grid: Fairy Tail mages and beasts, the
// Orc Disaster's army and Charybdis spawn, Kokushibo, Acnologia and Milim.
export const EXPEDITION_PALETTES={
 eisenwald:['#4a5a52','#2a3532','#a9c7a0'],vulcan:['#e6e1d4','#a59f94','#fbf8ee'],phantomshade:['#5d5685','#2f2a4a','#a9a3d6'],
 orctrooper:['#8a9a5a','#55603a','#bcc78a'],megalodon:['#6f93ab','#3f5c74','#e4ecee'],lizardman:['#6fa06a','#3f6a44','#b4d8a0'],
 jellal:['#2f3f6e','#1b2444','#c7b1e8'],geld:['#7d8a52','#4a5232','#c7a86a'],kokushibo:['#6a3a62','#3a1f38','#c98fa8'],
 acnologia:['#2c3246','#161a28','#7d93c4'],milim:['#f0a6b8','#b8607a','#ffd6de'],
};
const GOLD='#d6b064',GOLD_LIGHT='#f2dc9a',STEEL='#9aa4b0',STEEL_LIGHT='#dde3ea',BONE='#e8dfc6',RED='#c8404e',GLOW='#bff2ff';
const SKIN=ENEMY_SKIN;
function eyes(a,x,y,{gap=9,color='#f4e08a',w=2,h=1}={}){a.R(x,y,w,h,color);a.R(x+gap,y,w,h,color);}

// ---- Ordinary enemies ----
function eisenwald(m){
 // Hooded wind mage of the dark guild, green wind gathering in an open palm.
 const a=enemyArtFrame(m),{P,R,L,r,leg,arm,attack,finish}=a,[base,shade,light]=EXPEDITION_PALETTES.eisenwald;
 enemyLegs(r,{leg,top:52,left:21,right:30,width:6,cloth:'#2f3a38',shade:'#1d2624',light:'#4f5e58',boots:'#2a2a30',bootLight:'#55555e'});
 P([[16,30],[24,27],[33,27],[40,31],[42,58],[33,62],[23,62],[14,58]],shade);P([[18,31],[24,29],[32,29],[38,32],[39,57],[32,60],[24,60],[17,57]],base);
 L(28,32,28,59,shade);for(const y of [40,48])L(20,y,36,y,light);R(25,35,6,5,'#20262a');L(26,36,30,38,'#e6e1d4');L(30,36,26,38,'#e6e1d4');
 for(const [x,s]of [[17,-1],[39,1]]){const hx=attack&&s>0?47:x+s*(2+arm),hy=attack&&s>0?36:50;L(x,33,hx,hy,shade,6);L(x,33,hx,hy-1,base,4);R(hx-2,hy,5,4,SKIN.base);}
 if(attack){for(let i=0;i<3;i++)L(46+i*2,30-i*3,52,33-i*2,light);R(46,34,4,2,GLOW);}
 P([[18,24],[20,12],[28,7],[36,12],[38,24],[34,30],[22,30]],shade);P([[20,23],[22,13],[28,9],[34,13],[36,23],[33,28],[23,28]],base);
 P([[23,16],[33,16],[33,26],[28,29],[23,26]],SKIN.shade);P([[24,17],[32,17],[32,25],[28,28],[24,25]],SKIN.base);P([[22,13],[28,10],[34,13],[34,18],[22,18]],shade);
 R(24,20,3,1,ENEMY_INK);R(30,20,3,1,ENEMY_INK);R(25,20,1,1,light);R(31,20,1,1,light);L(26,25,30,25,'#7d5a5a');
 return finish();
}
function vulcan(m){
 // White forest ape: shaggy fur, dark face, long arms and a crest of fur.
 const a=enemyArtFrame(m),{P,R,L,leg,arm,attack,enraged,finish}=a,[base,shade,light]=EXPEDITION_PALETTES.vulcan;
 for(const [x,d]of [[19,-leg],[31,leg]]){P([[x,52],[x+7,52],[x+8+d,66],[x+9+d,71],[x-2+d,71],[x-1+d,64]],shade);R(x+d,56,6,10,base);R(x-2+d,68,10,3,'#8a7a78');}
 P([[13,30],[22,24],[34,24],[43,30],[44,48],[38,57],[18,57],[12,48]],shade);P([[15,31],[23,26],[33,26],[41,31],[42,47],[37,55],[19,55],[14,47]],base);
 P([[21,36],[35,36],[36,50],[28,54],[20,50]],'#d8cdbb');for(const [x,y]of [[17,34],[39,34],[16,44],[40,44]])L(x,y,x+(x<28?-2:2),y+4,light);
 for(const [x,s]of [[14,-1],[42,1]]){const hx=attack?28+s*14:x+s*(4+arm),hy=attack?30:58;L(x,32,hx,hy,shade,9);L(x,32,hx,hy-1,base,6);R(hx-3,hy,7,5,'#8a7a78');for(let i=0;i<3;i++)R(hx-3+i*2,hy+4,1,2,'#5a4a48');}
 P([[18,18],[21,8],[28,4],[35,8],[38,18],[35,27],[21,27]],shade);P([[20,18],[23,10],[28,7],[33,10],[36,18],[33,25],[23,25]],base);
 P([[22,14],[34,14],[35,22],[28,26],[21,22]],'#7a6a6a');P([[23,15],[33,15],[33,21],[28,24],[23,21]],'#9a8886');
 eyes(a,24,17,{gap:6,color:enraged?'#ff8a6a':'#f4e08a'});R(26,21,4,2,'#3a2a2a');R(26,21,1,1,BONE);R(29,21,1,1,BONE);
 for(const x of [24,28,32])P([[x-2,8],[x,1],[x+2,8]],light);
 return finish();
}
function phantomshade(m){
 // Hooded phantom of Phantom Lord, drifting on a frayed shadow tail.
 const a=enemyArtFrame(m),{P,R,L,arm,tail,attack,finish}=a,[base,shade,light]=EXPEDITION_PALETTES.phantomshade;
 P([[15,26],[22,20],[34,20],[41,26],[42,50],[36+tail,62],[30,70],[26+tail,62],[19,66],[16,52]],shade);
 P([[17,27],[23,22],[33,22],[39,27],[40,49],[35+tail,59],[30,66],[27+tail,58],[21,62],[18,51]],base);
 for(const x of [22,28,34])L(x,30,x+tail,56,shade);L(20,28,21,48,light);
 for(const [x,s]of [[17,-1],[39,1]]){const hx=attack?28+s*16:x+s*(4+arm),hy=attack?28:44;L(x,30,hx,hy,shade,5);L(x,30,hx,hy-1,base,3);for(let i=0;i<3;i++)L(hx-2+i*2,hy,hx-2+i*2+s,hy+5,light);}
 P([[18,24],[20,10],[28,4],[36,10],[38,24],[33,29],[23,29]],shade);P([[20,23],[22,11],[28,6],[34,11],[36,23],[32,27],[24,27]],base);
 P([[23,14],[33,14],[33,25],[28,28],[23,25]],'#120f20');eyes(a,24,19,{gap:6,color:GLOW,w:2,h:2});L(25,24,31,24,'#4a4470');
 if(attack)for(const [x,y]of [[8,24],[47,24],[28,0]]){R(x,y,3,3,light);R(x+1,y+1,1,1,'#ffffff');}
 return finish();
}
function orctrooper(m){
 // Starving orc soldier: tusked pig face, crude plates and a heavy cleaver.
 const a=enemyArtFrame(m),{P,R,L,r,leg,arm,attack,finish}=a,[base,shade,light]=EXPEDITION_PALETTES.orctrooper;
 enemyLegs(r,{leg,top:51,left:19,right:31,width:7,cloth:'#5a4a36',shade:'#3a2e22',light:'#7a6650',boots:'#3a3430',bootLight:'#6a5e54'});
 P([[14,31],[22,27],[34,27],[42,31],[42,50],[36,55],[20,55],[14,50]],shade);P([[16,32],[23,29],[33,29],[40,32],[40,49],[35,53],[21,53],[16,49]],base);
 P([[19,33],[37,33],[36,46],[20,46]],'#6a5a48');for(const x of [22,28,34])R(x,35,3,9,STEEL);R(19,46,18,3,'#4a3a2a');R(27,46,3,3,GOLD);
 for(const [x,s]of [[15,-1],[41,1]]){const hx=attack&&s>0?44:x+s*(3+arm),hy=attack&&s>0?28:51;L(x,33,hx,hy,shade,7);L(x,33,hx,hy-1,base,5);R(hx-2,hy,6,5,base);}
 // Cleaver: raised high on the attack, resting low otherwise.
 if(attack){P([[43,28],[46,8],[54,6],[53,26]],STEEL);L(46,10,52,8,STEEL_LIGHT);R(42,26,4,6,'#5a4030');}
 else{P([[42,52],[50,46],[55,58],[48,63]],STEEL);L(44,52,51,48,STEEL_LIGHT);R(40,50,4,5,'#5a4030');}
 P([[17,17],[21,9],[35,9],[39,17],[38,27],[33,31],[23,31],[18,27]],shade);P([[19,17],[23,11],[33,11],[37,17],[36,26],[32,29],[24,29],[20,26]],base);
 P([[24,20],[32,20],[33,26],[23,26]],light);R(25,22,2,2,'#4a3a2a');R(29,22,2,2,'#4a3a2a');eyes(a,22,16,{gap:10,color:'#e8603a'});
 for(const x of [22,33])P([[x,25],[x+1,30],[x+2,25]],BONE);for(const x of [18,37])P([[x-2,10],[x,5],[x+2,11]],shade);
 return finish();
}
function megalodon(m){
 // Flying storm shark: grey-blue back, white belly, fins and a toothy grin.
 const a=enemyArtFrame(m),{P,R,L,tail,attack,finish}=a,[base,shade,light]=EXPEDITION_PALETTES.megalodon;
 P([[4,40],[12,32],[30,28],[44,30],[52,36],[54,42],[44,48],[28,50],[12,48]],shade);
 P([[6,40],[13,34],[30,30],[43,32],[50,37],[51,41],[43,45],[28,46],[13,45]],base);
 P([[12,42],[30,42],[46,41],[43,45],[28,47],[13,46]],light);
 P([[24,30],[30,18],[34,30]],shade);P([[26,30],[30,21],[32,30]],base);
 P([[4+tail,40],[0+tail,28],[8,38]],shade);P([[4+tail,41],[0+tail,54],[8,43]],shade);
 for(const x of [18,34])P([[x,46],[x+4,54],[x+7,46]],shade);
 const open=attack?3:1;P([[40,40],[54,38],[54,40+open],[42,43+open]],'#3a1a22');for(let x=42;x<54;x+=2){R(x,39,1,2,'#ffffff');R(x,41+open,1,1,'#ffffff');}
 R(43,34,3,2,'#141a22');R(44,34,1,1,GLOW);for(const x of [36,38])L(x,33,x,37,shade);
 return finish();
}
function lizardman(m){
 // Lizardman spear warrior: scaled snout, leather harness, tail and spear.
 const a=enemyArtFrame(m),{P,R,L,r,leg,arm,tail,attack,finish}=a,[base,shade,light]=EXPEDITION_PALETTES.lizardman;
 P([[30,50],[38,52],[46+tail,62],[50+tail,68],[44+tail,66],[34,58]],shade);P([[31,51],[37,53],[44+tail,62],[47+tail,66],[34,57]],base);
 enemyLegs(r,{leg,top:50,left:20,right:30,width:6,cloth:base,shade,light,boots:'#3a5a3a',bootLight:'#6a8a5a'});
 P([[17,30],[23,27],[33,27],[39,31],[38,50],[33,54],[22,54],[17,50]],shade);P([[19,31],[24,29],[32,29],[37,32],[36,49],[32,52],[23,52],[19,49]],base);
 P([[22,33],[34,33],[33,47],[23,47]],'#c8d8a8');for(let y=35;y<46;y+=3)L(23,y,33,y,'#a8b888');L(20,31,34,48,'#6a4a32',2);R(19,47,18,3,'#6a4a32');
 for(const [x,s]of [[18,-1],[38,1]]){const hx=attack&&s>0?46:x+s*(3+arm),hy=attack&&s>0?38:50;L(x,33,hx,hy,shade,6);L(x,33,hx,hy-1,base,4);R(hx-2,hy,5,4,base);}
 // Spear: thrust forward on the attack, held upright otherwise.
 if(attack){L(30,40,55,36,'#7a5a3a',2);P([[50,33],[56,36],[50,39]],STEEL_LIGHT);}
 else{L(42,64,44,10,'#7a5a3a',2);P([[42,12],[44,2],[46,12]],STEEL_LIGHT);}
 P([[18,20],[22,11],[32,10],[38,16],[44,20],[42,25],[34,28],[22,28],[18,25]],shade);P([[20,20],[23,13],[32,12],[37,17],[42,21],[40,24],[33,26],[23,26],[20,24]],base);
 L(24,14,36,14,light);R(26,17,3,2,'#f4e08a');R(27,17,1,2,ENEMY_INK);L(34,23,42,22,'#3a5a3a');for(const x of [36,39])R(x,23,1,1,'#ffffff');
 for(const x of [24,28,32])P([[x,11],[x+1,6],[x+2,11]],'#c86a4a');
 return finish();
}

// ---- Bosses ----
function jellal(m){
 // Blue-haired mage, red tattoo over his right eye, dark coat with a white collar.
 const a=enemyArtFrame(m),{P,R,L,r,leg,arm,tail,attack,enraged,finish}=a,[base,shade,light]=EXPEDITION_PALETTES.jellal;
 if(enraged)for(const [x,y,s]of [[6,14,4],[49,18,3],[10,42,3],[46,46,4],[28,2,3]]){P([[x,y-s],[x+1,y-1],[x+s,y],[x+1,y+1],[x,y+s],[x-1,y+1],[x-s,y],[x-1,y-1]],light);R(x,y,1,1,'#ffffff');}
 enemyLegs(r,{leg,top:51,left:20,right:30,width:6,cloth:'#22284a',shade:'#141832',light:'#3a4470',boots:'#1a1a26',bootLight:'#4a4a5a'});
 // Long dark coat flaring behind the legs.
 P([[17,32],[39,32],[44+tail,66],[34,62],[28,67],[22,62],[12+tail,66]],shade);P([[19,33],[37,33],[41+tail,63],[34,59],[28,63],[22,59],[15+tail,63]],base);
 P([[19,30],[24,28],[32,28],[37,30],[37,40],[19,40]],'#e8e4ee');P([[24,30],[28,38],[32,30]],'#22284a');L(28,38,28,58,shade);for(const y of [43,49])R(26,y,5,1,GOLD);
 for(const [x,s]of [[18,-1],[38,1]]){const hx=attack&&s>0?47:x+s*(3+arm),hy=attack&&s>0?24:50;L(x,33,hx,hy,shade,6);L(x,33,hx,hy-1,base,4);R(hx-2,hy,5,4,SKIN.base);}
 if(attack){P([[46,20],[48,14],[50,20],[56,22],[50,24],[48,30],[46,24],[40,22]],light);R(47,21,2,2,'#ffffff');}
 P([[19,18],[23,13],[33,13],[37,18],[36,27],[32,31],[24,31],[20,27]],SKIN.shade);P([[21,18],[24,15],[32,15],[35,19],[34,26],[31,29],[25,29],[22,26]],SKIN.base);
 R(23,21,4,2,'#f4f2ee');R(24,21,2,2,'#5a3a2a');R(30,21,4,2,'#f4f2ee');R(31,21,2,2,'#5a3a2a');L(23,20,26,20,ENEMY_INK);L(30,20,33,20,ENEMY_INK);L(26,26,30,26,'#9a6a6a');
 // Signature red tattoo curling around his right eye.
 L(22,18,22,25,RED);L(22,18,25,17,RED);put(a,21,22,RED);put(a,23,25,RED);
 P([[17,22],[18,11],[24,6],[32,6],[38,11],[39,22],[36,16],[33,13],[28,15],[24,13],[20,16]],'#2c4ea8');P([[19,18],[20,11],[25,8],[31,8],[36,12],[37,17],[33,13],[28,14],[24,12],[21,14]],'#4a74d0');L(23,9,30,8,'#8ab0f0');
 return finish();
}
function put(a,x,y,c){a.R(x,y,1,1,c);}
function geld(m){
 // Towering Orc Lord: massive tusked boar head, bone-plated armour and a meat cleaver.
 const a=enemyArtFrame(m),{P,R,L,leg,arm,attack,enraged,finish}=a,[base,shade,light]=EXPEDITION_PALETTES.geld;
 const skin=enraged?'#5a6a3a':base,skinShade=enraged?'#3a4426':shade;
 if(enraged)P([[6,24],[16,12],[28,18],[40,12],[50,24],[52,52],[44,70],[12,70],[4,52]],'#2e3a1c');
 for(const [x,d]of [[16,-leg],[32,leg]]){P([[x,54],[x+9,54],[x+10+d,66],[x+10+d,71],[x-2+d,71],[x-1+d,64]],skinShade);R(x+d,57,8,9,skin);R(x-3+d,68,13,3,'#3a3028');R(x-2+d,68,11,1,'#6a5a48');}
 P([[9,30],[19,22],[37,22],[47,30],[48,52],[40,60],[16,60],[8,52]],skinShade);P([[11,31],[20,24],[36,24],[45,31],[46,51],[39,58],[17,58],[10,51]],skin);
 P([[15,30],[41,30],[40,48],[28,52],[16,48]],'#4a3e30');for(const [x,y]of [[18,33],[27,32],[36,33]])P([[x,y],[x+5,y],[x+4,y+6],[x+1,y+6]],BONE);
 R(14,48,28,4,'#3a2e22');R(25,48,6,4,GOLD);P([[18,52],[38,52],[40,58],[16,58]],'#5a4a38');
 for(const [x,s]of [[10,-1],[46,1]]){const hx=attack&&s>0?44:x+s*(3+arm),hy=attack&&s>0?20:54;L(x,32,hx,hy,skinShade,10);L(x,32,hx,hy-1,skin,7);R(hx-3,hy,8,6,skin);}
 if(attack){P([[42,22],[44,0],[55,0],[55,20]],STEEL);L(45,2,53,2,STEEL_LIGHT);R(41,18,5,7,'#5a4030');for(const y of [6,12])L(46,y,53,y,'#7a8490');}
 else{P([[44,56],[54,44],[56,62],[48,68]],STEEL);L(46,56,53,47,STEEL_LIGHT);R(42,52,5,6,'#5a4030');}
 P([[14,14],[19,5],[37,5],[42,14],[42,25],[36,31],[20,31],[14,25]],skinShade);P([[16,14],[20,7],[36,7],[40,14],[40,24],[35,29],[21,29],[16,24]],skin);
 P([[22,18],[34,18],[35,26],[21,26]],light);R(24,21,3,2,'#3a2e22');R(29,21,3,2,'#3a2e22');eyes(a,20,13,{gap:13,color:enraged?'#f4e04a':'#e8603a',w:3,h:2});
 for(const x of [19,35])P([[x,24],[x+1,32],[x+3,24]],BONE);
 // Crown of bones and horns.
 for(const [x,h]of [[18,6],[23,8],[28,10],[33,8],[38,6]])P([[x-2,7],[x,7-h],[x+2,7]],BONE);
 return finish();
}
function kokushibo(m){
 // Upper Moon One: tied-back black hair, six eyes, purple kimono and the flesh blade.
 const a=enemyArtFrame(m),{P,R,L,r,leg,arm,tail,attack,enraged,finish}=a,[base,shade,light]=EXPEDITION_PALETTES.kokushibo;
 P([[22,6],[30,3],[38,8],[42+tail,34],[44+tail,52],[38,46],[36,24]],'#14121a');P([[24,7],[30,5],[36,9],[40+tail,32],[41+tail,46],[37,40],[35,22]],'#26222e');
 enemyLegs(r,{leg,top:52,left:20,right:30,width:7,cloth:'#1c1a24',shade:'#0e0d14',light:'#3a3646',boots:'#1a1a22',bootLight:'#4a4656'});
 P([[16,31],[24,28],[32,28],[40,31],[41,52],[36,60],[20,60],[15,52]],shade);P([[18,32],[24,30],[32,30],[38,32],[39,51],[34,58],[22,58],[17,51]],base);
 P([[24,30],[28,40],[32,30]],'#e8dcc8');L(24,30,28,40,'#1c1a24');L(32,30,28,40,'#1c1a24');R(18,46,21,3,'#1c1a24');for(const [x,y]of [[21,36],[33,38],[24,52],[32,54]])R(x,y,2,2,light);
 for(const [x,s]of [[17,-1],[39,1]]){const hx=attack&&s>0?44:x+s*(3+arm),hy=attack&&s>0?36:50;L(x,33,hx,hy,shade,7);L(x,33,hx,hy-1,base,5);R(hx-2,hy,5,4,'#e8c8b8');}
 // Kokushibo's flesh blade, eyes along its length; it sprouts branches when enraged.
 const [sx,sy,tx,ty]=attack?[46,36,56,8]:[41,52,47,74];
 L(sx,sy,tx,ty,'#5a2a3a',3);L(sx,sy,tx,ty,'#b05a6a');for(const t of [.3,.55,.8]){const x=Math.round(sx+(tx-sx)*t),y=Math.round(sy+(ty-sy)*t);R(x-1,y,3,2,'#f4e04a');R(x,y,1,1,RED);}
 if(enraged)for(const t of [.4,.7]){const x=Math.round(sx+(tx-sx)*t),y=Math.round(sy+(ty-sy)*t);L(x,y,x-6,y-5,'#5a2a3a',2);L(x,y,x+6,y-4,'#5a2a3a',2);}
 R(sx-2,sy-1,5,3,'#2a1a22');
 P([[19,16],[23,11],[33,11],[37,16],[36,26],[32,30],[24,30],[20,26]],'#c8a89a');P([[21,16],[24,13],[32,13],[35,17],[34,25],[31,28],[25,28],[22,25]],'#e8c8b8');
 // Six eyes: three stacked pairs, the middle pair largest.
 for(const [y,w]of [[16,2],[19,3],[23,2]]){R(23,y,w,1,'#f4e04a');R(31,y,w,1,'#f4e04a');R(23,y,1,1,RED);R(31,y,1,1,RED);}
 L(26,27,30,27,'#7a4a4a');for(const [x,y]of [[22,18],[34,18],[22,22],[34,22]])R(x,y,1,1,'#b04a5a');
 P([[18,18],[20,10],[26,6],[32,6],[38,10],[38,18],[35,13],[28,10],[22,13]],'#14121a');R(27,4,4,3,'#26222e');
 return finish();
}

// ---- Rift superbosses ----
function acnologia(m){
 // Black Dragon of the Apocalypse: vast wings, blue line markings, horned head.
 const a=enemyArtFrame(m),{P,R,L,leg,arm,tail,attack,enraged,finish}=a,[base,shade,light]=EXPEDITION_PALETTES.acnologia;
 const flap=Math.round(arm*.6),glow=enraged?'#a8c8ff':light;
 for(const s of [-1,1]){const p=(x,y)=>[28+s*x,y];
  P([p(8,30),p(18,12-flap),p(27,4-flap),p(28,18),p(27,34),p(22,44),p(14,40)],shade);
  P([p(9,30),p(18,14-flap),p(25,8-flap),p(25,20),p(24,33),p(20,41),p(14,38)],base);
  for(const [x0,y0,x1,y1]of [[10,30,24,10],[10,32,26,24],[11,34,22,40]])L(...p(x0,y0),...p(x1,y1-(y1<20?flap:0)),glow);
 }
 P([[22,52],[30,56],[44+tail,64],[52+tail,70],[42+tail,70],[28,62]],shade);P([[24,53],[30,57],[42+tail,64],[48+tail,68],[30,61]],base);
 for(const [x,d]of [[19,-leg],[31,leg]]){P([[x,52],[x+7,52],[x+8+d,66],[x+10+d,71],[x-2+d,71]],shade);R(x+d,55,6,10,base);for(let i=0;i<3;i++)R(x-2+d+i*4,70,2,2,BONE);}
 P([[16,30],[24,24],[32,24],[40,30],[40,50],[34,57],[22,57],[16,50]],shade);P([[18,31],[24,26],[32,26],[38,31],[38,49],[33,55],[23,55],[18,49]],base);
 for(let y=32;y<52;y+=4)L(24,y,32,y,'#3a4258');L(20,32,22,50,glow);L(36,32,34,50,glow);
 P([[20,20],[23,10],[33,10],[36,20],[34,28],[22,28]],shade);P([[22,20],[24,12],[32,12],[34,20],[32,26],[24,26]],base);
 P([[24,22],[32,22],[33,30],[28,34],[23,30]],shade);const jaw=attack?3:0;P([[24,28],[32,28],[31,31+jaw],[25,31+jaw]],'#141820');if(attack){R(25,29,6,2,glow);R(26,29,4,1,'#ffffff');}
 eyes(a,23,17,{gap:8,color:enraged?'#ff6a6a':GLOW,w:2,h:1});
 for(const s of [-1,1]){const p=(x,y)=>[28+s*x,y];P([p(4,12),p(10,1),p(8,13)],BONE);P([p(7,14),p(14,6),p(10,16)],BONE);}
 return finish();
}
function milim(m){
 // Milim Nava: long pink twin tails, blue eyes, black studded top and shorts.
 const a=enemyArtFrame(m),{P,R,L,leg,arm,tail,attack,enraged,finish}=a,[base,shade,light]=EXPEDITION_PALETTES.milim;
 if(enraged){for(const s of [-1,1]){const p=(x,y)=>[28+s*x,y];P([p(8,30),p(24,16),p(26,34),p(18,44)],'#ffb0c8');P([p(10,30),p(22,20),p(23,32),p(17,40)],'#ffd6e2');}for(const s of [-1,1])P([[28+s*6,6],[28+s*12,-2],[28+s*9,8]],'#f4e08a');}
 for(const [x,s]of [[15,-1],[41,1]]){P([[x,14],[x+s*4,12],[x+s*8+tail*s,30],[x+s*6+tail*s,52],[x+s*2,56],[x-s*2,40],[x-s*2,22]],shade);P([[x,16],[x+s*3,14],[x+s*6+tail*s,30],[x+s*4+tail*s,50],[x+s,52],[x-s,38],[x-s,22]],base);L(x+s*2,18,x+s*4+tail*s,46,light);}
 for(const [x,d]of [[21,-leg],[30,leg]]){R(x+d,50,5,14,SKIN.base);R(x+1+d,51,2,12,SKIN.light);R(x-1+d,64,7,7,'#2a2630');R(x-1+d,64,7,1,STEEL_LIGHT);}
 P([[20,46],[36,46],[37,52],[19,52]],'#2a2630');for(const x of [22,26,30,34])R(x,48,1,1,STEEL_LIGHT);
 R(21,38,15,8,SKIN.base);R(22,39,13,6,SKIN.light);R(28,43,1,1,SKIN.shade);
 P([[20,30],[36,30],[36,38],[20,38]],'#2a2630');for(const x of [22,25,28,31,34])R(x,31,1,1,STEEL_LIGHT);R(27,34,3,2,'#c84a6a');
 for(const [x,s]of [[19,-1],[37,1]]){const hx=attack?28+s*16:x+s*(4+arm),hy=attack?26:44;L(x,32,hx,hy,SKIN.shade,5);L(x,32,hx,hy-1,SKIN.base,3);R(hx-2,hy-1,5,5,attack?'#f4e08a':SKIN.light);if(attack)R(hx-1,hy,3,3,'#ffffff');R(x+s*2-2,37,5,2,'#2a2630');}
 P([[19,18],[23,12],[33,12],[37,18],[36,26],[32,30],[24,30],[20,26]],SKIN.shade);P([[21,18],[24,14],[32,14],[35,19],[34,25],[31,28],[25,28],[22,25]],SKIN.base);
 for(const x of [22,31]){R(x,20,4,4,'#ffffff');R(x+1,20,3,4,'#3a7ad8');R(x+1,20,3,1,'#1f3f8a');R(x+1,21,1,1,'#ffffff');L(x,19,x+3,19,ENEMY_INK);}
 P([[25,26],[31,26],[30,28],[26,28]],'#8a2a4a');R(26,26,4,1,'#ffffff');
 P([[18,20],[19,10],[25,5],[31,5],[37,10],[38,20],[35,15],[31,12],[28,15],[25,12],[21,15]],shade);P([[20,17],[21,10],[26,7],[30,7],[35,10],[36,16],[33,13],[28,13],[23,13]],base);L(23,9,30,8,light);
 for(const x of [15,41]){R(x-2,12,5,4,'#2a2630');R(x-1,13,3,1,STEEL_LIGHT);}
 return finish();
}
export function expeditionEnemyPixels(id,m={}){
 switch(id){
  case'eisenwald':return eisenwald(m);case'vulcan':return vulcan(m);case'phantomshade':return phantomshade(m);
  case'orctrooper':return orctrooper(m);case'megalodon':return megalodon(m);case'lizardman':return lizardman(m);
  case'jellal':return jellal(m);case'geld':return geld(m);case'kokushibo':return kokushibo(m);
  case'acnologia':return acnologia(m);default:return milim(m);
 }
}
