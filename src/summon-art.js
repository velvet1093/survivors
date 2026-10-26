import {drawGuardianHealth} from './guardian-health.js';
import {raster,outline,pixelRuns} from './pixel-characters.js';
export function summonPixels(kind,{frame=0,attack=false,fused=false}={}){
 const r=raster(),{rect,poly,line}=r,ink='#2b3447',step=[0,2,0,-2][frame%4];
 if(kind==='whiteDog'||kind==='blackDog'){
 const white=kind==='whiteDog',base=white?'#e3e5db':'#47556b',shade=white?'#a0b3ba':'#28364c',light=white?'#fff7e2':'#84949f';
 for(const [x,s]of [[13,-step],[22,step],[34,-step],[41,step]]){line(x,59,x+s,68,shade,3);rect(x+s-1,68,5,2,light);}poly([[10,53],[18,48],[37,50],[43,56],[39,63],[17,63],[10,59]],shade);poly([[13,53],[21,50],[35,52],[39,57],[35,60],[18,60]],base);line(12,53,5,46+step,base,3);poly([[34,53],[36,43],[39,38],[42,46],[48,44],[49,52],[54,56],[51,60],[43,61],[38,57]],base);rect(44,51,3,2,white?'#b47783':'#edba79');rect(51,55,3,2,ink);if(attack)rect(46,58,6,2,'#d8baa9');if(fused){line(38,47,43,51,'#d7cedd',1);line(41,44,42,49,'#d7cedd',1);}return outline(r.pixels,ink);
 }
 if(kind==='nue'){
 for(const side of [-1,1]){poly([[28+side*7,43],[28+side*25,30+step],[28+side*21,44],[28+side*13,52],[28+side*8,49]],'#514661');line(28+side*9,43,28+side*21,35+step,'#a9899c',2);}
 poly([[20,38],[36,38],[39,49],[33,57],[28,61],[21,55],[17,47]],'#a57974');poly([[21,34],[26,29],[32,30],[37,36],[35,45],[29,49],[23,45]],'#e3d4bb');rect(23,38,4,3,'#65415a');rect(32,38,4,3,'#65415a');poly([[27,43],[32,43],[29,48]],'#d8a562');rect(25,55,2,6,'#d4ad77');rect(32,55,2,6,'#d4ad77');return outline(r.pixels,ink);
 }
 // Eight-Handled Sword Divergent Sila Divine General. The large Dharma
 // wheel sits behind the covered eyes, with eight separate blunt grips.
 const pale='#dbe4d2',bone='#f5f0dd',skinLight='#edf0dd',shadow='#92a79a',deep='#536e68',gold='#c3ac71',darkGold='#796748',pants='#202d3b',fold='#40515d',raised=attack?-7:0;
 const cx=28,cy=12,angle=frame*Math.PI/16;
 for(let i=0;i<32;i++){const a=i*Math.PI/16,b=a+Math.PI/16;line(cx+Math.cos(a)*15,cy+Math.sin(a)*9,cx+Math.cos(b)*15,cy+Math.sin(b)*9,darkGold,3);line(cx+Math.cos(a)*13,cy+Math.sin(a)*8,cx+Math.cos(b)*13,cy+Math.sin(b)*8,gold,1);}
 for(let i=0;i<8;i++){
  const a=i*Math.PI/4+angle,x=cx+Math.cos(a)*17,y=cy+Math.sin(a)*10;
  line(cx,cy,x,y,darkGold,2);line(cx,cy,x,y,'#d7c38b',1);
  rect(Math.round(x)-2,Math.round(y)-2,5,4,darkGold);rect(Math.round(x)-1,Math.round(y)-2,3,3,'#dfd09c');rect(Math.round(x)-1,Math.round(y)-2,2,1,bone);
 }
 rect(24,8,9,9,darkGold);rect(25,9,7,7,gold);rect(26,9,4,3,'#efe2b0');rect(27,10,2,2,bone);line(28,17,28,22,darkGold,3);line(28,17,28,22,gold,1);
 // The loose charcoal hakama splits at the knees and falls over broad feet.
 poly([[16,49],[39,49],[43,60],[39,68],[32,69],[28,59],[25,69],[16,69],[12,61]],pants);
 poly([[17,53],[25,54],[24-step,65],[21-step,68],[16,67],[14,61]],fold);poly([[31,54],[38,53],[41,60],[36+step,68],[32,67]],'#344853');
 line(21,54,19-step,65,'#64766f',1);line(34,54,36+step,65,'#586d6b',1);line(28,54,28,65,'#152532',1);line(15,62,17,67,'#55696a');line(39,62,37,67,'#53676a');
 for(const [x,walk]of [[18,-step],[35,step]]){poly([[x-3+walk,67],[x+4+walk,67],[x+6+walk,71],[x+3+walk,73],[x-6+walk,73],[x-6+walk,70]],shadow);rect(x-5+walk,69,8,3,pale);line(x-5+walk,71,x+4+walk,71,bone,1);for(let i=0;i<3;i++)rect(x-4+walk+i*2,72,1,1,deep);}
 // Broad deltoids and slanted pectorals give the pale torso weight without
 // turning its silhouette into armor. The recessed abdomen stays readable.
 poly([[17,31],[23,29],[34,29],[41,32],[44,40],[38,51],[18,51],[11,40]],shadow);
 poly([[15,33],[22,31],[27,33],[26,40],[20,42],[14,39]],pale);poly([[30,33],[35,31],[41,34],[42,39],[35,42],[29,40]],pale);
 poly([[16,33],[21,32],[25,33],[24,35],[17,35]],skinLight);poly([[32,33],[36,32],[40,34],[39,36],[32,35]],skinLight);
 line(28,32,28,49,deep,1);line(16,39,25,42,deep,1);line(31,42,40,39,deep,1);
 for(const y of [41,45]){poly([[22,y],[26,y+1],[26,y+3],[22,y+3],[20,y+1]],pale);poly([[30,y+1],[34,y],[36,y+1],[34,y+3],[30,y+3]],'#becdbb');rect(23,y,2,1,bone);rect(30,y+1,2,1,'#e3e8d4');}
 line(17,41,19,49,deep,1);line(39,41,36,49,deep,1);line(15,38,17,39,skinLight,1);line(39,37,41,38,skinLight,1);
 // A compact clenched fist balances the sword-bearing forearm.
 poly([[12,33],[18,35],[16,41],[13,47+step],[8,46+step],[7,39]],shadow);poly([[11,35],[16,36],[14,41],[11,45+step],[8,44+step]],pale);line(10,36,11,40,bone,2);
 poly([[8,45+step],[13,46+step],[14,52+step],[10,55+step],[5,52+step],[5,48+step]],shadow);rect(7,47+step,5,5,pale);line(7,48+step,11,48+step,bone,1);line(8,52+step,11,52+step,deep,1);rect(6,49+step,1,2,'#b9c8b5');
 poly([[38,33+raised],[43,34+raised],[47,41+raised],[44,46+raised],[39,42+raised],[36,37+raised]],shadow);poly([[39,34+raised],[42,35+raised],[45,40+raised],[43,43+raised],[40,40+raised]],pale);line(40,35+raised,43,39+raised,bone,2);
 poly([[42,43+raised],[48,42+raised],[50,47+raised],[47,50+raised],[41,48+raised]],shadow);rect(43,44+raised,4,4,pale);
 // The Sword of Extermination grows past the wrist: a broad ivory edge with
 // a dark back and luminous bevel, lifted into a distinct attacking pose.
 poly(attack?[[45,43+raised],[49,40+raised],[54,17+raised],[55,38+raised],[52,47+raised],[47,51+raised]]:[[44,45],[49,44],[55,65],[53,70],[48,61],[46,53]],'#829b92');
 poly(attack?[[47,43+raised],[50,39+raised],[53,21+raised],[53,40+raised],[50,47+raised]]:[[47,46],[49,47],[53,64],[52,66],[49,58]],bone);line(47,45+raised,49,44+raised,'#d9d5b3',2);line(46,46+raised,48,47+raised,deep,1);
 // Layered white eye covers and a long central face distinguish the General
 // from a helmeted soldier. The small teeth sit below a hard nose ridge.
 poly([[22,22],[25,20],[32,20],[36,24],[35,31],[31,35],[25,34],[21,29]],shadow);
 poly([[24,22],[31,21],[34,25],[33,31],[29,33],[24,31]],pale);line(25,23,31,23,skinLight,1);rect(27,25,3,5,'#b8c8b4');line(28,26,28,29,bone,1);
 rect(24,30,10,2,deep);rect(25,30,2,1,bone);rect(29,30,2,1,bone);rect(26,32,6,1,'#e4e8cf');line(27,34,31,34,'#6c8073',1);
 for(const side of [-1,1]){
  poly([[28+side*5,24],[28+side*10,20],[28+side*18,19],[28+side*14,24],[28+side*8,27]],pale);line(28+side*7,25,28+side*15,21,bone,1);
  poly([[28+side*5,27],[28+side*11,25],[28+side*18,27],[28+side*12,30],[28+side*6,29]],'#b5c9b5');line(28+side*7,27,28+side*15,27,bone,1);
 }
 rect(23,25,11,2,'#e7ecda');line(24,27,26,27,'#899f92');line(31,27,33,27,'#899f92');
 // An ivory cloth sash ties at the hip instead of a gold armor belt.
 poly([[17,50],[38,50],[40,53],[18,55],[15,53]],'#a8b3a0');poly([[18,50],[37,50],[38,52],[18,53]],bone);line(20,51,33,51,skinLight,1);
 poly([[31,51],[36,49],[40,52],[36,55],[32,54]],pale);rect(32,51,4,3,bone);poly([[35,54],[39,55],[40,64],[37,61]],'#c7d2bd');poly([[32,54],[35,54],[33,63],[30,64]],'#e2e7d1');

 return outline(r.pixels,ink);
}
const cache=new Map();
export function drawSummon(c,s,reduced=false,hideUi=false){const frame=reduced?0:Math.floor(s.age*(s.summonKind==='nue'?6:8))%4,key=[s.summonKind,frame,s.attackAnim>0,s.fused].join(':');if(!cache.has(key)){const cv=document.createElement('canvas');cv.width=56;cv.height=76;const cc=cv.getContext('2d');for(const run of pixelRuns(summonPixels(s.summonKind,{frame,attack:s.attackAnim>0,fused:s.fused}))){cc.fillStyle=run.color;cc.fillRect(run.x,run.y,run.width,1);}cache.set(key,cv);}c.save();c.translate(Math.round(s.x),Math.round(s.y));c.imageSmoothingEnabled=false;const scale=s.summonKind==='mahoraga'?1.05:.85;c.scale((s.facing||1)*scale,scale);c.drawImage(cache.get(key),-28,-71);c.restore();if(s.summonKind==='mahoraga'&&!hideUi){c.fillStyle='#f1dfaa';c.font='9px sans-serif';c.textAlign='center';c.fillText('ADAPT '+(s.adaptation||0)+'/4',s.x,s.y+10);drawGuardianHealth(c,{...s,kind:'mahoraga'},'MAHORAGA','#d6d9af');}}
