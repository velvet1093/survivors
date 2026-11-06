import {canvas,selout} from './hero-kit.js';
// Jinwoo's shadow army on the summon canvas, facing right. Every shadow is a smoky violet-
// black silhouette with glowing eyes and wisps at its feet; each keeps its own identity.
const B=['#0e0c18','#1c1830','#34305a'],EYE='#b0a4ff',WISP='#5a4aa8',INK='#08060e';
export const SHADOW_ART_KINDS=['shadow-shadowsoldier','shadow-iron','shadow-igris','shadow-tank','shadow-tusk','shadow-beru','shadow-kaisel','shadow-bellion','shadow-risen'];
function wisps(r,frame,w=12,y=70){for(let i=0;i<5;i++){const x=28-w+i*w/2,h=3+((i*3+frame*2)%5);r.line(x,y,x+(i%2?1:-1),y-h,i%2?WISP:'#3a2a78');}}
function eyes(r,x,y,gap=4,color=EYE){r.rect(x,y,2,1,color);r.rect(x+gap,y,2,1,color);}
// An armoured humanoid: legs, torso and helmet, with a bob and an attack lean.
function knight(r,{frame,attack},{tall=0,wide=0,helm=true}={}){
 const {rect,poly,line}=r,bob=[0,1,0,-1][frame%4],step=[0,1,0,-1][frame%4],lean=attack?2:0,top=24-tall;
 for(const [x,d]of [[23-wide,-step],[30+wide,step]]){rect(x+d,54,5,15,B[1]);rect(x+d,54,1,14,B[2]);rect(x+d-1,68,7,3,B[0]);}
 poly([[20-wide+lean,38-tall+bob],[36+wide+lean,38-tall+bob],[35+wide,55],[21-wide,55]],B[0]);poly([[21-wide+lean,39-tall+bob],[35+wide+lean,39-tall+bob],[34+wide,54],[22-wide,54]],B[1]);
 line(23-wide+lean,41-tall+bob,23-wide,53,B[2]);rect(21-wide,50,15+wide*2,2,B[0]);
 if(helm){poly([[21+lean,top+bob],[25+lean,top-6+bob],[31+lean,top-6+bob],[35+lean,top+bob],[35+lean,top+13+bob],[21+lean,top+13+bob]],B[0]);poly([[22+lean,top+bob],[25+lean,top-5+bob],[31+lean,top-5+bob],[34+lean,top+bob],[34+lean,top+12+bob],[22+lean,top+12+bob]],B[1]);
  rect(23+lean,top+5+bob,11,2,INK);eyes(r,25+lean,top+5+bob,4);line(28+lean,top-5+bob,28+lean,top+4+bob,B[2]);}
 return {bob,lean,top};
}
function arm(r,x0,y0,x1,y1){r.line(x0,y0,x1,y1,B[0],4);r.line(x0,y0,x1,y1,B[2],1);}
function blade(r,x,y,tx,ty,edge='#8a7cd8',width=2){r.line(x,y,tx,ty,'#2a2440',width+1);r.line(x,y,tx,ty,edge,1);}
const DRAW={
 'shadow-shadowsoldier'(r,o){const {bob,lean}=knight(r,o);arm(r,20,40+bob,16,50);const a=o.attack;arm(r,36+lean,40+bob,a?44:40,a?34:48);blade(r,a?44:40,a?34:48,a?52:44,a?22:62);},
 'shadow-risen'(r,o){const {bob,lean}=knight(r,o,{tall:-2});arm(r,36+lean,42+bob,41,48);blade(r,41,48,46,58,'#6a5ab8',1);},
 'shadow-iron'(r,o){const {bob,lean}=knight(r,o,{wide:3,tall:2});
  // A towering shield on the front arm and a broad axe behind.
  arm(r,36+lean,40+bob,42,o.attack?40:46);r.line(42,o.attack?40:46,46,o.attack?26:30,'#2a2440',2);r.poly([[44,o.attack?24:28],[51,o.attack?22:26],[51,o.attack?32:36],[45,o.attack?30:34]],B[2]);
  r.poly([[12+lean,36+bob],[22+lean,34+bob],[23+lean,58],[13+lean,60]],B[0]);r.poly([[13+lean,37+bob],[21+lean,35+bob],[22+lean,57],[14+lean,59]],B[2]);r.line(17+lean,38+bob,18+lean,57,'#5a5490');r.rect(16+lean,45,3,3,EYE);},
 'shadow-igris'(r,o){
  // The Blood-Red Commander: crimson plume and cape, a long sword.
  r.poly([[22,38],[34,38],[40,64],[16,64]],'#5a1420');r.poly([[23,39],[33,39],[38,62],[18,62]],'#8a2030');
  const {bob,lean,top}=knight(r,o,{tall:3});r.poly([[27+lean,top-4+bob],[33+lean,top-9+bob],[40+lean,top-7+bob],[34+lean,top-3+bob]],'#c8404e');r.line(30+lean,top-5+bob,38+lean,top-7+bob,'#f07080');
  arm(r,20,40+bob,16,50);const a=o.attack;arm(r,36+lean,40+bob,a?46:41,a?36:47);blade(r,a?46:41,a?36:47,a?54:45,a?24:66,'#e06070',2);},
 'shadow-tusk'(r,o){const {bob,lean,top}=knight(r,o,{wide:2,helm:false});
  // A high orc: tusked head, bead necklace and a staff holding a flame orb.
  r.poly([[21+lean,top+1+bob],[35+lean,top+1+bob],[36+lean,top+14+bob],[20+lean,top+14+bob]],B[0]);r.poly([[22+lean,top+2+bob],[34+lean,top+2+bob],[35+lean,top+13+bob],[21+lean,top+13+bob]],B[1]);eyes(r,24+lean,top+6+bob,5,'#ffb070');
  r.rect(23+lean,top+11+bob,1,3,'#e8e0d0');r.rect(32+lean,top+11+bob,1,3,'#e8e0d0');for(let x=22;x<35;x+=2)r.put(x+lean,39+bob,'#d8783a');
  arm(r,36+lean,40+bob,42,46);r.line(43,18,41,68,'#3a2a20',2);const glow=o.attack?5:4;r.rect(41,14-glow+4,5,5,'#d8783a');r.rect(42,15-glow+4,3,3,'#ffd070');},
 'shadow-bellion'(r,o){
  // The Grand Marshal: tall, horned, caped, with a great sweeping blade.
  r.poly([[20,34],[36,34],[44,68],[12,68]],'#0a0812');r.poly([[21,35],[35,35],[42,66],[14,66]],'#1a1428');r.line(36,38,42,64,'#8a7cd8');
  const {bob,lean,top}=knight(r,o,{tall:6});r.line(22+lean,top-2+bob,18+lean,top-9+bob,B[2],2);r.line(34+lean,top-2+bob,38+lean,top-9+bob,B[2],2);r.rect(24+lean,top+5+bob,9,1,'#d8ccff');
  const a=o.attack;arm(r,36+lean,36+bob,a?46:42,a?30:44);blade(r,a?46:42,a?30:44,a?55:52,a?10:70,'#d8ccff',2);},
 'shadow-beru'(r,{frame,attack}){
  // The Ant King: a carapaced body, mandibles, small wings and long claws.
  const {rect,poly,line}=r,bob=[0,1,0,-1][frame%4],step=[0,1,0,-1][frame%4];
  poly([[16,30+bob],[8,22+bob],[12,36+bob]],'#2a4a3a');poly([[40,30+bob],[48,22+bob],[44,36+bob]],'#2a4a3a');
  for(const [x,d]of [[23,-step],[30,step]]){line(x+d,54,x+d-2,70,B[1],3);line(x+d,54,x+d-2,70,'#3a5a4a');}
  poly([[20,38+bob],[36,38+bob],[38,52],[18,52]],B[0]);poly([[21,39+bob],[35,39+bob],[36,51],[20,51]],'#1c2a24');for(const yy of [42,46])line(21,yy+bob,35,yy+bob,'#3a6a52');
  poly([[21,24+bob],[35,24+bob],[37,34+bob],[28,38+bob],[19,34+bob]],B[0]);poly([[22,25+bob],[34,25+bob],[35,33+bob],[28,36+bob],[21,33+bob]],'#1c2a24');eyes(r,23,29+bob,7,'#a8ffc0');
  line(25,35+bob,23,40+bob,'#4a7a5a');line(31,35+bob,33,40+bob,'#4a7a5a');line(24,25+bob,20,16+bob,'#4a7a5a');line(32,25+bob,36,16+bob,'#4a7a5a');
  const reach=attack?8:0;line(36,42+bob,44+reach,36-reach/2,B[0],3);line(44+reach,36-reach/2,50+reach,40,'#7ab08a');line(20,42+bob,13,48,B[0],3);line(13,48,9,44,'#7ab08a');},
 'shadow-tank'(r,{frame,attack}){
  // An ice bear on all fours, frost on its claws.
  const {rect,poly,line}=r,bob=[0,1,0,-1][frame%4],step=[0,2,0,-2][frame%4],rear=attack?-4:0;
  for(const [x,d]of [[14,step],[22,-step],[32,step],[40,-step]]){rect(x+d,56,6,13,B[1]);rect(x+d,67,7,3,'#6a9ac8');}
  poly([[10,46+bob],[16,34+bob],[34,32+bob],[46,38+bob+rear],[46,58],[10,58]],B[0]);poly([[11,46+bob],[17,35+bob],[34,33+bob],[45,39+bob+rear],[45,57],[11,57]],B[1]);line(16,38+bob,40,36+bob,B[2]);
  poly([[38,30+bob+rear],[50,32+bob+rear],[53,42+bob+rear],[46,46+bob+rear],[38,42+bob+rear]],B[0]);poly([[39,31+bob+rear],[49,33+bob+rear],[51,41+bob+rear],[46,44+bob+rear],[39,41+bob+rear]],B[1]);
  rect(40,29+bob+rear,3,3,B[0]);rect(46,29+bob+rear,3,3,B[0]);eyes(r,43,36+bob+rear,4,'#a8e0ff');rect(48,41+bob+rear,4,2,'#e8f4ff');},
 'shadow-kaisel'(r,{frame,attack}){
  // A shadow wyvern in flight: broad wings, long neck and tail.
  const {poly,line,rect}=r,flap=[0,-4,0,4][frame%4],dive=attack?6:0;
  poly([[24,34+dive],[4,18+flap],[10,30+flap],[2,32+flap],[22,42+dive]],B[0]);poly([[24,35+dive],[6,20+flap],[11,30+flap],[5,32+flap],[22,41+dive]],'#1a2a44');
  poly([[32,34+dive],[52,18+flap],[46,30+flap],[54,32+flap],[34,42+dive]],B[0]);poly([[32,35+dive],[50,20+flap],[45,30+flap],[51,32+flap],[34,41+dive]],'#1a2a44');
  poly([[20,36+dive],[36,36+dive],[38,46+dive],[18,46+dive]],B[0]);poly([[21,37+dive],[35,37+dive],[36,45+dive],[19,45+dive]],B[1]);
  line(18,42+dive,6,52+dive,B[0],3);line(6,52+dive,2,50+dive,'#5a8ab8');line(36,38+dive,44,30+dive,B[0],4);
  poly([[42,26+dive],[52,28+dive],[50,34+dive],[42,32+dive]],B[0]);eyes(r,46,29+dive,3,'#a8d0ff');line(43,26+dive,40,22+dive,'#5a8ab8');},
};
export function shadowPixels(kind,{frame=0,attack=false}={}){
 const r=canvas(),draw=DRAW[kind]||DRAW['shadow-shadowsoldier'];
 if(kind!=='shadow-kaisel')wisps(r,frame,kind==='shadow-tank'?18:12);
 draw(r,{frame,attack});
 return selout(r.pixels,INK,.6);
}
export const SHADOW_SCALES={'shadow-shadowsoldier':.8,'shadow-risen':.68,'shadow-iron':.95,'shadow-igris':.88,'shadow-tank':1.05,'shadow-tusk':.9,'shadow-beru':.86,'shadow-kaisel':1,'shadow-bellion':.98};
