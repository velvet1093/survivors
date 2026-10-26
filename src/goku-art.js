import {raster,outline} from './pixel-characters.js';
import {mix} from './hero-kit.js';
const INK='#192039',TONE='#edbd96',LIGHT='#ffdfb8',SHADE='#c8896e',WHITE='#fff4dc';
export const GOKU_HAIR={base:['#182331','#101520','#354459'],gold:['#ecd064','#ab7d32','#fff1a3'],blue:['#67c9e8','#357697','#b5f4f2']};
// ---- Head: hair and face shared by every skin ----
// Hair silhouettes per stage, as [x,y] outlines (y relative to the head bob).
// Base: the reference crown sweeps out to the viewer-left in big blades, fans right
// and stands tall at the centre. Super Saiyan stands every spike up; SS3 grows a
// waist-length mane.
const CROWN={
 base:[[17,28],[10,26],[3,23],[11,20],[1,14],[12,14],[6,6],[17,10],[17,1],[24,8],[28,0],[31,7],[38,1],[39,10],[47,6],[43,14],[53,14],[44,19],[50,25],[40,25],[39,28]],
 super:[[17,28],[10,25],[4,19],[12,18],[5,9],[15,12],[12,2],[21,9],[25,0],[29,7],[35,0],[37,9],[45,3],[42,13],[51,11],[44,18],[50,24],[40,25],[39,28]],
 ss2:[[17,28],[9,25],[2,18],[12,17],[4,7],[15,11],[11,0],[21,8],[25,0],[29,6],[36,0],[38,8],[47,2],[43,12],[53,10],[45,18],[51,24],[40,25],[39,28]],
};
const MANE=[[17,10],[39,10],[45,24],[47,40],[50,52],[44,56],[40,62],[33,58],[28,64],[23,58],[16,62],[12,56],[6,52],[9,40],[11,24]];
function hairColors(stage){return stage===4?GOKU_HAIR.blue:stage>0?GOKU_HAIR.gold:GOKU_HAIR.base;}
function shift(points,y){return points.map(([x,yy])=>[x,yy+y]);}
function inset(points,cx=28,cy=18,t=.12){return points.map(([x,y])=>[x+(cx-x)*t,y+(cy-y)*t]);}
export function gokuHairBack(r,{y=0,stage=0}={}){
 const [hair,shade,light]=hairColors(stage);
 if(stage===3){r.poly(shift(MANE,y*0),shade);r.poly(inset(MANE,28,30,.1),hair);r.line(14,30,11,50,light);r.line(42,30,45,50,light);r.line(28,40,28,58,shade);}
 const crown=CROWN[stage===2?'ss2':stage>0&&stage!==3?'super':'base'];
 const top=stage===3?[[17,28],[13,18],[17,9],[28,6],[39,9],[43,18],[39,28]]:crown;
 r.poly(shift(top,y),shade);r.poly(shift(inset(top),y),hair);
 // Light catches the upper edge of the larger blades.
 if(stage===3){r.line(20,10+y,27,8+y,light);return;}
 const pts=shift(crown,y);
 for(let i=1;i<pts.length-1;i+=2){const [x,yy]=pts[i],t=.35;r.line(x+(28-x)*t,yy+(17+y-yy)*t,x+(28-x)*.75,yy+(17+y-yy)*.75,light);}
}
export function gokuFace(r,{y=0,stage=0,expression='neutral',blink=false,focused=false}={}){
 const {poly,rect,line,put}=r,hurt=expression==='hurt',ult=expression==='ultimate',[,hairShade]=hairColors(stage);
 // Ears, then a squared jaw that narrows to a firm chin.
 poly([[18,24+y],[14,23+y],[14,30+y],[18,32+y]],TONE);poly([[38,24+y],[42,23+y],[42,30+y],[38,32+y]],TONE);rect(15,25+y,2,3,SHADE);rect(40,25+y,2,3,SHADE);
 rect(24,35+y,9,5,SHADE);
 poly([[18,18+y],[38,18+y],[39,29+y],[37,34+y],[32,38+y],[25,38+y],[20,34+y],[18,29+y]],TONE);
 line(26,38+y,31,38+y,SHADE);
 poly([[21,20+y],[35,20+y],[36,28+y],[34,32+y],[23,32+y],[21,28+y]],LIGHT);
 // Heavy angled brows (none at SS3), slanting toward the nose.
 const browCol=stage===3?SHADE:stage>0?hairShade:INK,slant=focused||hurt||ult?2:1;
 line(20,25+y,25,24+slant+y,browCol);line(31,24+slant+y,36,25+y,browCol);
 if(stage!==3&&slant>1){put(24,25+y,browCol);put(32,25+y,browCol);}
 // Sharp anime eyes: thick upper lid with a flicked outer corner, small dark iris.
 const iris=stage>0?'#3f9691':'#1d2433',irisLight=stage>0?'#8fe0d0':'#5a6a86';
 for(const [x,side]of [[20,-1],[31,1]]){
  const outer=side<0?x:x+5,inner=side<0?x+5:x;
  if(blink||hurt){line(x,29+y,x+5,29+y,INK);if(hurt){line(x+1,28+y,x+4,30+y,INK);}else put(outer,28+y,INK);continue;}
  const h=focused?2:3,top=28+y;
  rect(x+1,top,4,h,WHITE);
  rect(x+(side<0?3:1),top,2,h,iris);put(x+(side<0?3:1),top,irisLight);
  line(x,top-1,x+5,top-1,INK);put(outer,top,INK);put(inner,top-1+(focused?1:0),INK);
  if(focused)line(x+1,top,x+4,top,mix(INK,TONE,.35));
  line(x+2,top+h,x+4,top+h,SHADE);
 }
 // Nose shadow, then the mouth: his easy grin, a set jaw, gritted teeth or a ki shout.
 put(28,31+y,SHADE);put(28,32+y,SHADE);
 if(hurt){rect(25,34+y,7,2,WHITE);line(25,34+y,31,34+y,'#925d58');put(28,35+y,'#925d58');line(24,35+y,24,36+y,'#925d58');line(32,35+y,32,36+y,'#925d58');}
 else if(ult){rect(25,33+y,7,4,'#7d3f3a');rect(25,33+y,7,1,WHITE);rect(27,35+y,3,2,'#c96a62');}
 else if(focused){line(25,35+y,31,35+y,'#8a554c');put(24,36+y,'#8a554c');}
 else{rect(25,34+y,7,2,'#98654f');rect(26,34+y,5,1,WHITE);rect(27,35+y,3,1,'#e0927d');put(24,33+y,'#98654f');put(32,33+y,'#98654f');}
}
// Bangs over the forehead: an M-shaped hairline with Goku's long forelock hanging
// between the eyes, two shorter locks either side.
const BANGS={
 base:[[17,26],[17,16],[28,12],[39,16],[39,25],[37,21],[35,23],[33,19],[30,21],[28,28],[26,20],[23,23],[21,20],[19,25]],
 super:[[17,25],[17,15],[28,11],[39,15],[39,24],[36,19],[34,22],[32,18],[29,21],[28,27],[26,19],[23,22],[21,18],[19,24]],
 ss3:[[17,22],[17,15],[28,12],[39,15],[39,21],[35,18],[31,20],[29,27],[27,19],[23,20],[20,17]],
};
export function gokuHairFront(r,{y=0,stage=0}={}){
 const [hair,shade,light]=hairColors(stage),b=BANGS[stage===3?'ss3':stage>0?'super':'base'];
 r.poly(shift(b,y),shade);r.poly(shift(inset(b,28,16,.14),y),hair);
 r.line(22,15+y,27,14+y,light);r.line(30,14+y,35,16+y,light);
 // The forelock gets its own highlight down its length.
 r.line(27,18+y,28,25+y,light);
 if(stage===2){r.line(33,17+y,35,27+y,shade,2);r.line(33,17+y,35,26+y,hair);}
}
// The reference's cheerful face and broad sleeveless gi are kept in compact,
// stepped clusters; one forelock sits between the eyes instead of masking them.
export function gokuPixels({frame=0,moving=false,pose='',attack=false,expression='neutral',blink=false,skin='default',form=0}={}){
 frame=((frame%4)+4)%4;const r=raster(),{rect:R,poly:P,line:L}=r,stage=form||(skin==='supersaiyan'?1:0),[hair,hairShade,hairLight]=stage===4?GOKU_HAIR.blue:stage>0?GOKU_HAIR.gold:GOKU_HAIR.base,walk=moving?[0,2,0,-2][frame]:0,y=moving?-(frame%2):0,gi='#f1a14e',giShade='#ba6135',giLight='#ffd084',blue='#294b79',blueShade='#1e3153',blueLight='#6283a2',red='#bd5b5b',gather=pose==='gather',throwing=pose==='throw',cast=attack||throwing,focused=cast||['focused','ultimate'].includes(expression),hurt=expression==='hurt';
 gokuHairBack(r,{y,stage});
 // Baggy orange trousers with tapered ankles, blue boots and red piping.
 for(const [x,d]of [[18,-walk],[31,walk]]){
  P([[x,50],[x+9,50],[x+10+d,57],[x+7+d,65],[x+d,65],[x-2+d,58]],giShade);P([[x+1,51],[x+7,51],[x+7+d,58],[x+4+d,63],[x+1+d,62],[x-1+d,57]],gi);L(x+2,53,x+3+d,57,giLight);L(x+7,54,x+4+d,61,giShade);L(x+d,61,x+4+d,63,giLight);
  P([[x+d,64],[x+7+d,64],[x+7+d,68],[x+10+d,71],[x-2+d,71],[x-1+d,67]],blueShade);R(x+d,65,6,4,blue);L(x+1+d,65,x+1+d,69,red);L(x+d,69,x+7+d,70,red);R(x+d-1,71,10,1,'#bec9c7');R(x+2+d,64,4,1,'#e0bd7c');
 }
 // Wide shoulders and bare upper arms, with a small blue undershirt at the V.
 P([[18,37+y],[23,35+y],[34,35+y],[40,38+y],[39,47],[35,53],[20,53],[16,45]],giShade);P([[19,38+y],[24,36+y],[28,42],[32,36+y],[38,39+y],[36,48],[32,52],[21,51],[18,44]],gi);P([[20,38+y],[24,37+y],[27,43],[23,49],[20,48],[18,42]],giLight);P([[32,37+y],[37,40+y],[34,48],[29,51],[26,47]],giShade);P([[24,35+y],[33,35+y],[29,43]],blueShade);P([[26,36+y],[32,36+y],[29,40]],blue);P([[25,34+y],[32,34+y],[30,37+y],[27,37+y]],TONE);L(23,38+y,27,43,giShade);L(27,43,24,48,giLight);
 R(20,50,16,4,blueShade);R(21,50,13,2,blue);R(25,51,6,1,blueLight);P([[31,51],[35,52],[38,61],[34,60]],blue);P([[32,53],[34,53],[35,60],[33,59]],blueLight);P([[30,51],[33,53],[31,57],[29,55]],blueShade);
 // The chest badge stays small enough to read as cloth, with a dark glyph.
 R(32,41+y,6,6,'#f2e1bc');R(33,42+y,4,4,INK);R(34,42+y,1,4,'#f2e1bc');R(33,43+y,4,1,'#f2e1bc');
 const lx=gather?7:cast?35:13,ly=gather?16:cast?42:49,rx=gather?48:cast?48:43,ry=gather?16:throwing?33:cast?40:48;
 L(17,40+y,lx,ly-3,SHADE,7);L(38,40+y,rx,ry-3,TONE,7);L(18,40+y,lx+1,ly-4,TONE,4);L(39,40+y,rx+1,ry-4,LIGHT,4);L(16,41+y,lx,ly-5,LIGHT,2);L(38,41+y,rx,ry-5,SHADE,1);R(lx-1,ly-3,6,4,blue);R(rx-1,ry-3,6,4,blue);R(lx-1,ly,6,5,TONE);R(rx-1,ry,6,5,LIGHT);R(lx,ly+1,3,1,LIGHT);R(rx,ry+3,4,1,SHADE);R(16,37+y,4,3,gi);R(38,37+y,3,3,giLight);
 gokuFace(r,{y,stage,expression,blink,focused});
 gokuHairFront(r,{y,stage});
 return outline(r.pixels,INK);
}
