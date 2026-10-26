import {raster,outline} from './pixel-characters.js';
const INK='#262631',HAIR='#252732',HAIR_DARK='#161c28',HAIR_LIGHT='#505065',SKIN='#f1cbb2',PALE='#ffdec3',SKIN_SHADE='#c8968c',RED_EYE='#ba4b64',GOLD_EYE='#d9b45f';
function rose(r,x,y,color='#a5658d'){
 const {rect:R}=r;R(x+1,y-2,3,6,'#523a60');R(x-1,y,7,3,color);R(x,y-1,5,5,color);R(x+1,y,3,3,'#70476f');R(x+2,y,2,1,'#cb8eb3');R(x+2,y+2,1,1,'#dfa5bd');
}
function face(r,{y=0,skin='default',blink=false,expression='neutral'}={}){
 const {rect:R,poly:P,line:L}=r,closed=blink||expression==='hurt',focus=['focused','ultimate'].includes(expression),covered=skin==='crimson'||skin==='school';
 P([[18,20+y],[23,15+y],[33,16+y],[38,23+y],[36,31+y],[31,36+y],[24,35+y],[19,30+y]],SKIN);
 P([[21,21+y],[26,18+y],[33,19+y],[36,24+y],[34,30+y],[30,33+y],[24,32+y],[21,28+y]],PALE);
 R(17,25+y,3,5,SKIN);R(36,25+y,3,4,SKIN);R(18,26+y,1,2,SKIN_SHADE);
 const eye=(x,color)=>{L(x,26+y,x+3,26+y,INK);if(closed){L(x,28+y,x+3,28+y,INK);return;}R(x,27+y,4,4,'#f7eade');R(x+1,27+y,2,4,color);R(x+1,28+y,1,3,'#563c51');R(x+1,27+y,1,1,'#fff1dd');if(focus)R(x,27+y,4,1,INK);};
 eye(21,RED_EYE);if(!covered&&skin!=='gothic')eye(31,skin==='whitequeen'?'#8da4c9':GOLD_EYE);
 if(skin==='default'&&!closed){R(32,28+y,1,2,'#735443');R(32,29+y,2,1,'#735443');}
 L(26,33+y,29,33+y,expression==='hurt'?'#a46d77':'#9e7175');if(!closed&&!focus)R(30,32+y,1,1,'#bb8a88');
}
function eyepatch(r,y){
 const {rect:R,poly:P,line:L}=r;
 // A small white dressing sits beneath the left-eye fringe (viewer-right).
 // Paint it before the hair so only its lower corner can peek through.
 L(34,25+y,37,26+y,'#c8c1cb');
 P([[31,26+y],[34,26+y],[35,28+y],[34,30+y],[30,30+y],[30,27+y]],'#c8c1cb');
 R(30,27+y,4,3,'#f2efed');R(31,26+y,3,1,'#f2efed');
}
function flintlocks(r,{y=0,cast=false,skin='default'}={}){
 const {rect:R,poly:P,line:L}=r,black=skin==='crimson',metal=black?'#b5bac5':'#c6c7bd',wood=black?'#765567':'#94644e',handY=cast?39:51;
 // A slender musket leans upright in the relaxed hand and levels into a true long barrel when firing.
 if(cast){L(40,handY,52,handY,wood,3);L(46,handY-1,54,handY-1,metal,2);R(43,handY+2,3,4,wood);R(42,handY-2,3,1,'#e4c58b');R(48,handY+2,1,2,INK);}
 else{L(12,51,8,39,wood,3);L(8,39,7,26,metal,2);R(7,37,5,2,'#d3b488');R(9,46,4,2,'#d5b999');}
 if(skin==='default'||skin==='gothic'){R(43,handY-2,8,3,wood);R(48,handY-3,5,2,metal);R(44,handY+1,3,3,wood);}
}
function gothicKurumiPixels({frame=0,moving=false,pose='',attack=false,expression='neutral',blink=false}={}){
 const r=raster(),{rect:R,poly:P,line:L}=r,walk=moving?[0,2,0,-2][frame]:0,y=moving?-(frame%2):0,cast=attack||pose==='clock';
 const velvet='#272936',fold='#141b27',lit='#494656',lace='#f4e8e2',laceLight='#fff7ec',laceShade='#b7abba',roseRed='#b94e64';
 // This gown has loose flowing hair, rather than the Astral outfit's separated tails.
 P([[16,18+y],[16,12+y],[23,8+y],[33,9+y],[40,15+y],[41,31],[45+walk,43],[51+walk,49],[46+walk,51],[39,45],[43+walk,58],[37,54],[32,44],[21,46],[12-walk,58],[11,49],[6-walk,51],[12-walk,36]],HAIR_DARK);
 P([[17,21+y],[20,14+y],[28,11+y],[36,14+y],[38,22+y],[37,34],[41+walk,43],[47+walk,48],[41,45],[38,41],[40+walk,52],[34,45],[29,37],[20,43],[14-walk,53],[16-walk,40],[12,43],[15,31]],HAIR);
 L(15,33,12-walk,47,HAIR_LIGHT);L(38,30,41+walk,40,HAIR_LIGHT);L(42+walk,44,47+walk,48,'#3f3e52');
 // Two stockings and small heeled shoes remain visible below the bell-shaped hem.
 for(const [x,step]of [[21,-walk],[32,walk]]){
  P([[x,57],[x+5,57],[x+5+step,67],[x+3+step,70],[x-1+step,69]],'#30313e');
  L(x+1,60,x+step+1,66,'#5b5365');R(x,58,5,2,fold);R(x+1,59,3,1,'#776275');
  P([[x+step,67],[x+step+5,67],[x+step+5,70],[x+step+3,72],[x+step-3,72],[x+step-3,70]],'#222632');
  R(x+step-1,69,5,1,'#6b5d71');R(x+step+4,71,1,2,fold);
 }
 // White petticoats form a separate scalloped silhouette beneath the split black overskirt.
 P([[22,48],[34,48],[39+walk,54],[46+walk,61],[43+walk,64],[39,63],[35,66],[31,64],[27,66],[23,64],[19,65],[15+walk,63],[10+walk,63],[12+walk,58],[18+walk,52]],laceShade);
 P([[23,49],[33,49],[37+walk,55],[42+walk,60],[40+walk,62],[35,61],[32,64],[27,62],[23,64],[19+walk,62],[14+walk,62],[16+walk,57],[21,52]],lace);
 for(const [x,yy]of [[16,58],[21,60],[27,61],[33,60],[39,59]]){
  P([[x+walk*.5,yy-2],[x+3+walk*.5,yy-1],[x+4+walk*.5,yy+2],[x+2+walk*.5,yy+3],[x-1+walk*.5,yy+1]],laceLight);
  L(x+walk*.5,yy,x+2+walk*.5,yy+2,laceShade);
 }
 // Three shaded scalloped seams keep the white waterfall legible as separate frilled tiers.
 for(const [x0,x1,yy]of [[23,33,53],[20,36,56],[17,39,60]]){
  const sway=walk*.5,points=[];
  for(let x=x0;x<=x1;x+=2)points.push([x+sway,yy+((x-x0)/2%2)]);
  for(let i=1;i<points.length;i++){
   const a=points[i-1],b=points[i];L(a[0],a[1]-1,b[0],b[1]-1,laceLight);L(a[0],a[1],b[0],b[1],'#8c7c91');
  }
 }
 // Sweeping velvet side panels expose a stepped white waterfall through the center.
 P([[21,47],[28,50],[24+walk*.5,54],[21+walk,58],[16+walk,61],[10+walk,60],[12+walk,56],[16+walk,52]],fold);
 P([[22,48],[25,50],[21+walk,54],[15+walk,58],[11+walk,58],[15+walk,54]],velvet);
 P([[32,48],[36,48],[41+walk,53],[46+walk,58],[44+walk,62],[39+walk,61],[34+walk*.5,57],[30,52]],fold);
 P([[34,49],[38+walk*.5,52],[43+walk,56],[44+walk,59],[40+walk,58],[35+walk*.5,54],[32,51]],velvet);
 L(14+walk,56,21+walk*.5,52,lit);L(36+walk*.5,53,42+walk,57,lit);
 for(const [x,yy]of [[12,59],[17,57],[21,54],[35,54],[39,57],[43,60]]){
  R(x+walk,yy,3,1,laceShade);R(x+walk+1,yy+1,2,1,lace);
 }
 // Fitted buttoned corset, white blouse and a deep lace collar replace the old white bodice.
 R(25,33+y,7,5,SKIN);P([[20,36+y],[25,34+y],[29,37+y],[33,34+y],[38,37+y],[35,43],[32,45],[24,45],[20,41]],laceShade);
 P([[23,35+y],[27,36+y],[29,39+y],[31,36+y],[34,35+y],[35,39+y],[31,43],[25,43],[21,39+y]],lace);
 for(const [x,yy]of [[23,36],[25,38],[28,39],[31,38],[33,36]])R(x,yy+y,2,2,laceLight);
 P([[22,40+y],[26,42+y],[29,41+y],[32,42+y],[35,40+y],[33,47],[35,50],[30,52],[23,50],[22,47]],fold);
 P([[24,42+y],[28,43+y],[31,42+y],[33,43+y],[31,49],[28,50],[24,48]],velvet);
 L(24,43,24,47,lit);L(32,43,31,47,lit);L(25,49,30,50,'#655568');
 for(const yy of [43,46,49]){R(28,yy,2,1,'#c9b59c');R(28,yy+1,1,1,'#7f6b77');}
 // Puffed white sleeves and long black gloves follow the raised musket arm.
 const leftY=cast?46:29,rightY=cast?38:47;
 P([[20,36+y],[17,36+y],[14,39+y],[17,43+y],[21,41+y],[23,38+y]],laceShade);
 P([[18,36+y],[15,39+y],[18,41+y],[21,39+y]],lace);R(17,37+y,2,2,laceLight);
 L(17,40+y,cast?14:12,leftY,SKIN,3);L(cast?14:12,cast?43:34,cast?14:10,leftY,fold,3);R(cast?13:9,leftY-1,4,3,SKIN);
 P([[35,36+y],[39,36+y],[42,39+y],[39,43+y],[35,41+y],[33,38+y]],laceShade);
 P([[36,36+y],[40,38+y],[39,41+y],[35,39+y]],lace);R(37,37+y,2,2,laceLight);
 L(39,40+y,cast?44:42,rightY,SKIN,3);L(cast?42:41,cast?39:43,cast?46:43,rightY,fold,3);R(cast?44:42,rightY,4,3,PALE);
 const wood='#8b5b4e',metal='#c6c7bd';
 if(cast){
  L(41,39,52,39,wood,3);L(46,37,54,37,metal,2);R(43,41,3,4,wood);R(43,36,3,1,'#dcc092');R(49,40,1,2,'#d3ba8e');
  L(12,47,7,37,wood,3);L(7,37,5,30,metal,2);R(9,43,3,2,'#c7aa80');
 }else{
  L(1,24,14,26,wood,3);L(1,22,10,23,metal,2);R(11,26,3,4,wood);R(10,23,3,2,'#d8bd8e');R(4,24,2,1,'#675265');
  L(42,47,50,45,wood,3);L(47,43,54,42,metal,2);R(43,49,3,3,wood);R(45,44,2,1,'#d8bd8e');
 }
 face(r,{y,skin:'gothic',blink,expression:pose==='clock'?'ultimate':expression});
 eyepatch(r,y);
 // A low side fringe and loose cheek locks keep her face compact and readable.
 P([[16,28+y],[15,20+y],[18,14+y],[23,10+y],[30,9+y],[37,12+y],[40,19+y],[40,29+y],[37,35+y],[36,25+y],[34,21+y],[30,17+y],[27,23+y],[24,20+y],[21,25+y],[19,34+y],[16,35+y]],HAIR);
 P([[18,20+y],[20,15+y],[25,12+y],[31,11+y],[36,14+y],[38,19+y],[36,23+y],[31,16+y],[28,20+y],[25,17+y],[22,22+y],[19,25+y]],'#38394b');
 L(22,14+y,27,12+y,'#676173');L(35,15+y,37,19+y,HAIR_LIGHT);L(18,27+y,17,32+y,'#474354');
 // The long side-swept fringe covers nearly all of the patch and its strap.
 P([[29,15+y],[35,15+y],[39,23+y],[38,31+y],[35,35+y],[33,32+y],[32,29+y],[30,28+y],[29,24+y],[27,20+y]],HAIR);
 L(33,19+y,36,28+y,'#414052');L(36,28+y,35,32+y,HAIR_LIGHT);
 // Red rose sprigs and a tiny neck rose are the only strong accents on the monochrome gown.
 L(15,13+y,20,9+y,'#62354c');P([[13,14+y],[10,15+y],[12,20+y],[15,17+y],[18,21+y],[18,15+y]],'#703849');
 rose(r,16,12+y,roseRed);R(16,11+y,2,1,'#e99799');R(15,14+y,2,1,'#753548');
 R(26,35+y,6,2,fold);R(27,35+y,4,3,roseRed);R(28,35+y,2,1,'#e99799');R(28,38+y,1,2,'#703849');
 return outline(r.pixels,INK);
}
export const WHITE_QUEEN_COLORS={hair:'#d2d5dc',hairShade:'#7f8492',hairLight:'#f4f5f3',dress:'#e9e9e7',dressShade:'#b7bbc6',trim:'#777a8c',lining:'#343541',silver:'#bfc7d7',lace:'#fbfbf7'};
function whiteQueenKurumiPixels({frame=0,moving=false,pose='',attack=false,expression='neutral',blink=false}={}){
 const r=raster(),{rect:R,poly:P,line:L}=r,c=WHITE_QUEEN_COLORS,step=moving?[0,2,0,-2][frame]:0,y=moving?-(frame%2):0,cast=attack||pose==='clock';
 // Long silver hair falls past the waist in two shaded curtains. It stays
 // separate from the coat, with dark edges to retain the silhouette on snow.
 P([[16,21+y],[14,14+y],[19,8+y],[28,6+y],[36,8+y],[41,15+y],[41,32],[46+step,49],[51+step,63],[43,62],[38,52],[34,41],[22,41],[16,55],[8-step,65],[6-step,59],[10,42]],c.hairShade);
 P([[17,20+y],[19,12+y],[27,9+y],[35,11+y],[38,17+y],[38,34],[43+step,49],[47+step,59],[43,57],[37,43],[32,36],[23,37],[18,49],[11-step,59],[13,43],[15,31]],c.hair);
 for(const [x0,y0,x1,y1]of [[16,28,11-step,53],[20,34,16-step,54],[39,29,44+step,52],[36,39,41+step,56]])L(x0,y0,x1,y1,c.hairLight);
 // Tall charcoal boots have separate white laced front panels and silver toes.
 for(const [x,d]of [[20,-step],[31,step]]){
  P([[x,55],[x+6,55],[x+6+d,67],[x+4+d,71],[x-1+d,70]],c.lining);
  P([[x+1,56],[x+5,56],[x+4+d,66],[x+2+d,68],[x+d,66]],c.dressShade);
  L(x+2,56,x+2+d,65,c.lace);L(x+4,56,x+4+d,65,c.trim);
  for(let yy=57;yy<65;yy+=3){const off=d*(yy-55)/12;L(x+1+off,yy,x+4+off,yy+2,c.trim);L(x+4+off,yy,x+1+off,yy+2,c.lace);}
  P([[x-1+d,67],[x+5+d,67],[x+6+d,70],[x+3+d,73],[x-4+d,72],[x-4+d,70]],c.lining);
  R(x-3+d,70,6,2,c.silver);R(x-2+d,70,4,1,c.lace);R(x+5+d,70,1,3,c.trim);
 }
 // A dark petticoat peeks below the bright, asymmetrical military coat-dress.
 P([[20,46],[35,46],[40+step,53],[49+step,61],[46+step,65],[41,64],[37,67],[31,65],[27,67],[22,65],[17-step,67],[10-step,64],[5-step,63],[12-step,54]],c.lining);
 P([[21,48],[34,48],[39+step,54],[45+step,61],[40,62],[36,65],[29,63],[23,65],[18-step,63],[9-step,62],[15-step,55]],'#535363');
 for(const [x,yy]of [[10,62],[16,63],[22,63],[29,64],[35,63],[42,62]]){R(x+step*.5,yy,3,1,c.silver);R(x+1+step*.5,yy+1,2,1,c.trim);}
 // Broad outer panels sit over a narrow buttoned front. Their curving seams
 // and stepped ruffle edge recreate the reference's layered white hem.
 P([[21,44],[35,44],[40+step,50],[48+step,58],[47+step,62],[40,61],[35,64],[28,62],[22,64],[15-step,61],[7-step,62],[8-step,57],[16-step,49]],c.dressShade);
 P([[22,45],[33,45],[38+step,50],[44+step,57],[43+step,60],[37,59],[34,62],[28,60],[22,62],[16-step,59],[10-step,60],[12-step,55],[18-step,49]],c.dress);
 P([[24,45],[28,47],[25-step*.4,59],[21,61],[18-step,58],[21,51]],c.hairLight);
 P([[33,46],[37+step,51],[41+step,58],[37,59],[33,55]],c.dressShade);
 L(20,49,14-step,57,c.trim);L(35,49,41+step,57,c.trim);L(22,51,20-step*.5,58,c.hairLight);L(32,50,34+step*.5,58,c.hairLight);
 for(const yy of [48,52,56]){R(27,yy,2,2,c.trim);R(28,yy,1,1,c.lace);}
 // A double stepped frill is visible on both wings of the skirt.
 for(const [x,yy]of [[10,59],[15,59],[20,61],[25,61],[30,61],[35,61],[40,59],[44,60]]){
  R(x+step*.4,yy,3,2,c.lace);R(x+1+step*.4,yy+2,3,1,c.trim);
 }
 // Fitted double-breasted white bodice, split lapels, diamond brooch and bow.
 R(25,33+y,7,5,SKIN);P([[20,36+y],[25,34+y],[32,34+y],[37,37+y],[35,45],[37,48],[31,50],[25,48],[20,49],[21,43]],c.trim);
 P([[22,36+y],[27,37+y],[29,40+y],[32,36+y],[35,38+y],[33,44],[35,47],[30,48],[25,46],[22,47]],c.dress);
 P([[22,36+y],[26,36+y],[28,40+y],[24,39+y]],c.lace);P([[32,36+y],[35,37+y],[31,41+y],[29,40+y]],c.lace);
 L(23,40,23,45,c.dressShade);L(33,40,32,45,c.dressShade);
 for(const xx of [25,31])for(const yy of [41,44]){R(xx,yy,2,1,c.trim);R(xx,yy,1,1,c.silver);}
 P([[28,37+y],[30,39+y],[28,41+y],[26,39+y]],c.silver);R(28,38+y,1,2,c.lace);
 L(21,46,35,46,c.trim);P([[25,45],[28,47],[24,50],[21,48]],c.lace);P([[31,45],[28,47],[32,50],[35,48]],c.dressShade);R(27,46,3,3,c.silver);
 // White gloves and stiff sleeve cuffs support silver, rather than wood,
 // flintlocks; casting keeps a true long barrel above the skirt.
 const rightY=cast?39:49;
 L(19,38+y,14,47,c.trim,6);L(19,38+y,14,46,c.dress,4);R(11,46,6,3,c.silver);R(12,49,5,5,c.lace);R(13,49,2,4,c.dressShade);
 L(37,38+y,cast?43:41,rightY,c.trim,6);L(37,38+y,cast?43:41,rightY,c.dress,4);R(cast?41:39,rightY-1,6,3,c.silver);R(cast?43:40,rightY+2,5,4,c.lace);
 if(cast){L(44,40,52,40,c.trim,3);L(46,38,54,38,c.silver,2);R(46,37,7,1,c.lace);R(44,42,3,4,c.trim);R(49,40,2,2,c.dress);L(13,52,8,42,c.trim,3);L(8,42,7,30,c.silver,2);}
 else{L(13,52,8,39,c.trim,3);L(8,39,7,25,c.silver,2);R(6,26,2,11,c.lace);R(8,38,4,2,c.dress);L(42,51,50,49,c.trim,3);L(46,47,54,46,c.silver,2);R(48,46,5,1,c.lace);}
 face(r,{y,skin:'whitequeen',blink,expression:pose==='clock'?'ultimate':expression});
 // Straight silver fringe, cheek locks and a small open crown are independent
 // from the black-haired Astral, Gothic White and school silhouettes.
 P([[16,25+y],[15,18+y],[18,12+y],[24,8+y],[32,8+y],[38,13+y],[40,20+y],[39,32+y],[36,36+y],[35,24+y],[33,20+y],[30,24+y],[27,20+y],[24,25+y],[21,21+y],[20,31+y],[17,35+y]],c.hairShade);
 P([[17,22+y],[18,16+y],[22,11+y],[29,10+y],[35,12+y],[38,18+y],[37,26+y],[35,23+y],[33,17+y],[30,22+y],[27,17+y],[24,22+y],[21,18+y],[19,25+y]],c.hair);
 L(21,14+y,25,11+y,c.hairLight);L(30,11+y,34,13+y,c.hairLight);L(18,25+y,18,32+y,c.hairLight);L(37,24+y,36,32+y,c.hairLight);
 R(19,9+y,18,2,c.trim);R(20,8+y,16,2,c.silver);L(21,8+y,20,4+y,c.silver);L(25,8+y,25,3+y,c.silver);L(30,8+y,30,2+y,c.silver);L(35,8+y,36,4+y,c.silver);
 for(const [xx,yy]of [[20,4],[25,3],[30,2],[36,4]]){P([[xx,yy-2+y],[xx+1,yy+y],[xx,yy+2+y],[xx-1,yy+y]],c.lace);}
 R(23,9+y,2,1,c.lace);R(30,9+y,3,1,c.lace);
 return outline(r.pixels,INK);
}
export function kurumiPixels({frame=0,moving=false,pose='',attack=false,expression='neutral',blink=false,skin='default'}={}){
 if(skin==='whitequeen')return whiteQueenKurumiPixels({frame:((frame%4)+4)%4,moving,pose,attack,expression,blink});
 if(skin==='gothic')return gothicKurumiPixels({frame:((frame%4)+4)%4,moving,pose,attack,expression,blink});
 frame=((frame%4)+4)%4;const r=raster(),{rect:R,poly:P,line:L}=r,walk=moving?[0,2,0,-2][frame]:0,y=moving?-(frame%2):0,cast=attack||pose==='clock',school=skin==='school',victorian=skin==='crimson',white=skin==='gothic',covered=school||victorian;
 const red='#b85160',redShade='#77394e',redLight='#e27b7c',black='#353340',blackLight='#565061',whiteBase='#f4e8e2',whiteShade='#b2a5b6';
 // Long hair is drawn behind both shoulders; separated swinging tails frame the outfit.
 if(school){P([[17,17+y],[11,24+y],[10-walk,39],[7-walk,54],[14,50],[20,32]],HAIR_DARK);P([[37,17+y],[43,24+y],[45+walk,41],[50+walk,55],[42,51],[35,31]],HAIR_DARK);L(13,29,11-walk,48,HAIR_LIGHT);L(42,29,45+walk,48,HAIR_LIGHT);}
 else if(victorian){P([[15,18+y],[16,11+y],[24,7+y],[33,8+y],[40,15+y],[42,37],[46+walk,57],[38,53],[34,44],[23,49],[13-walk,58],[12,43]],HAIR_DARK);P([[16,23+y],[19,13+y],[27,10+y],[35,12+y],[38,20+y],[39,37],[42+walk,51],[36,47],[29,41],[18,52],[15,49]],HAIR);L(15,33,14-walk,49,HAIR_LIGHT);L(39,28,41+walk,45,HAIR_LIGHT);}
 else{P([[15,18+y],[10,23+y],[9-walk,42],[5-walk,54],[13,49],[20,26]],HAIR_DARK);P([[37,18+y],[43,23+y],[45+walk,41],[51+walk,55],[42,49],[35,27]],HAIR_DARK);L(12,27,10-walk,43,HAIR_LIGHT);L(42,26,45+walk,45,HAIR_LIGHT);}
 // Each outfit has its own legwear and hem: short pleated school skirt versus layered gowns.
 if(victorian){for(const [x,d]of [[21,-walk],[32,walk]]){R(x+d,63,5,7,'#292b37');R(x+d-2,69,9,3,'#262532');R(x+d-1,69,5,1,'#64616c');}}
 else for(const [x,d]of [[21,-walk],[32,walk]]){R(x+d,54,5,15,school?'#393a49':white?'#33333f':'#d5adb0');R(x+d,58,5,1,white?'#a7a1b2':'#7c5367');R(x+d-2,68,9,3,'#292632');R(x+d-1,68,6,1,school?'#707080':white?'#f0dfdb':'#bb657b');}
 if(school){
  P([[19,47],[36,47],[41+walk,58],[37,61],[29,60],[22,61],[15+walk,58]],'#464a78');P([[21,48],[34,48],[38+walk,57],[33,59],[28,57],[23,59],[18+walk,57]],'#6866a1');for(const x of [21,27,33])L(x,50,x+walk*.45-1,58,'#9690bb');L(18+walk,58,36+walk,59,'#30354f');
 }else if(victorian){
  P([[21,47],[35,47],[39+walk,54],[44+walk,65],[41,69],[35,68],[28,70],[21,69],[13+walk,68],[16+walk,57]],'#242633');
  P([[23,48],[33,48],[38+walk,56],[41+walk,64],[35,66],[29,65],[23,67],[16+walk,65],[19+walk,56]],black);P([[24,50],[27,51],[24+walk,64],[21,65]],blackLight);P([[33,50],[35,52],[38+walk,64],[34,62]],'#45404e');
  for(let row=0;row<3;row++){const yy=54+row*5,x0=19-row*2,x1=37+row*2;P([[x0,yy],[28,yy+2],[x1,yy],[x1+1,yy+3],[30,yy+5],[x0-1,yy+3]],row%2?'#343440':'#45404f');L(x0,yy+2,28,yy+4,'#6a5d70');L(28,yy+4,x1,yy+2,'#56505f');}
  for(let x=16;x<41;x+=4)R(x,66+(x%3),2,2,'#686071');
 }else{
  const cloth=white?whiteBase:red,shade=white?whiteShade:redShade,lit=white?'#fff4eb':redLight;
  P([[21,47],[35,47],[41+walk,56],[46+walk,64],[40,67],[33,65],[28,68],[20,65],[11+walk,65],[16+walk,54]],INK);
  P([[22,49],[34,49],[39+walk,55],[43+walk,62],[37,64],[28,65],[20,63],[14+walk,63],[19+walk,55]],cloth);
  P([[24,50],[27,52],[24+walk,62],[20,62]],lit);P([[33,50],[35,53],[40+walk,62],[35,61]],shade);
  if(white){P([[22,49],[26,50],[21+walk,57],[14+walk,62],[16+walk,55]],black);P([[33,49],[36,50],[40+walk,55],[44+walk,61],[36,58]],black);L(20,54,18+walk,60,blackLight);L(36,54,39+walk,59,blackLight);}
  for(let row=0;row<2;row++){const yy=57+row*5;L(17+walk-row,yy,28,yy+3,shade);L(28,yy+3,40+walk+row,yy,shade);for(let i=0;i<6;i++){const x=14+i*5;R(x,61+row*3+(i%2),3,2,white?whiteBase:INK);R(x,60+row*3+(i%2),2,1,lit);}}
 }
 // The school blazer, Victorian sleeves and corset silhouettes are independent constructions.
 if(school){
  P([[20,36+y],[25,34+y],[32,34+y],[37,37+y],[37,48],[34,51],[28,49],[21,51],[18,47]],'#303748');P([[24,35+y],[28,39+y],[32,35+y],[30,43],[26,43]],'#e8e4de');L(21,36+y,28,46,'#c8c9d0');L(35,36+y,28,46,'#c8c9d0');L(28,46,28,50,'#767b8d');R(27,46,2,2,'#c1b58d');
  P([[27,37+y],[23,40+y],[24,43+y],[28,40+y],[32,43+y],[34,40+y],[30,37+y]],'#b95774');R(27,38+y,3,3,'#dd9b9b');L(29,40+y,30,45,'#a84d68');
 }else if(victorian){
  P([[19,36+y],[25,34+y],[32,34+y],[38,38+y],[35,48],[36,51],[21,51],[21,45]],black);P([[23,37+y],[27,38+y],[31,37+y],[33,45],[30,50],[24,48]],'#48404e');L(24,39,31,46,'#70616e');L(31,39,24,46,'#70616e');R(22,48,13,3,'#252633');for(const yy of [39,43,47])R(28,yy,1,1,'#bfa8b8');
  P([[25,34+y],[28,38+y],[31,34+y],[33,39+y],[28,40+y],[23,39+y]],'#292c39');
 }else{
  P([[20,37+y],[25,35+y],[32,35+y],[37,38+y],[34,46],[36,50],[28,53],[20,50],[22,44]],white?black:red);
  P([[24,38+y],[28,41+y],[32,38+y],[33,47],[29,51],[24,48]],white?whiteBase:'#ebbbb1');P([[21,39+y],[24,40+y],[25,48],[21,48]],white?'#55505d':INK);P([[33,39+y],[36,40+y],[34,48],[31,49]],white?'#55505d':INK);
  for(const yy of [41,44,47]){L(25,yy,31,yy+3,white?'#7b6680':'#974e62');L(31,yy,25,yy+3,white?'#7b6680':'#974e62');}R(25,49,9,3,white?black:'#6f354b');
  for(const x of [20,24,28,32,35])R(x,38+y,3,2,white?whiteBase:INK);R(25,35+y,7,2,INK);R(28,36+y,1,1,'#cbb47f');
 }
 const handY=cast?39:51;
 if(school||victorian){const sleeve=school?'#303748':black;L(19,38+y,14,48,sleeve,victorian?6:5);L(37,38+y,cast?43:41,cast?37:49,sleeve,victorian?6:5);R(12,48,5,3,school?'#d1cbd1':'#645866');R(cast?42:39,cast?36:48,5,3,school?'#d1cbd1':'#645866');R(12,51,5,4,PALE);R(cast?43:40,handY,5,4,PALE);if(victorian){for(const x of [12,15,39,42])R(x,47,2,3,'#282a37');}}
 else{L(19,39+y,14,49,SKIN,4);L(37,39+y,cast?43:42,handY,SKIN,4);L(13,48,13,52,INK,4);L(cast?43:41,handY-1,cast?44:42,handY+2,INK,4);R(12,52,4,3,PALE);R(cast?44:42,handY+2,4,3,PALE);}
 if(victorian&&!cast){L(23,52,23,56,'#8b7187');L(33,52,33,56,'#8b7187');P([[21,55],[35,55],[36,61],[21,62],[19,58]],'#68516d');R(22,56,12,4,'#8e6b86');rose(r,27,57,'#9b659d');}
 else flintlocks(r,{y,cast,skin});
 face(r,{y,skin,blink,expression:pose==='clock'?'ultimate':expression});
 // Swept side bangs frame the face; Victorian and uniform fringes cover the left eye.
 P([[16,25+y],[15,18+y],[19,11+y],[27,8+y],[35,10+y],[40,17+y],[40,29+y],[36,34+y],[35,23+y],[31,18+y],[28,24+y],[24,19+y],[21,27+y],[19,34+y],[16,33+y]],HAIR);
 P([[18,19+y],[21,13+y],[27,11+y],[34,13+y],[37,18+y],[35,22+y],[31,17+y],[28,21+y],[24,16+y],[20,23+y]],'#38394b');L(21,14+y,26,12+y,'#747081');L(35,15+y,37,20+y,HAIR_LIGHT);
 if(covered){P([[29,14+y],[34,15+y],[38,22+y],[37,32+y],[33,34+y],[31,28+y],[29,24+y],[26,20+y]],HAIR);L(32,18+y,35,30+y,HAIR_LIGHT);}
 if(white)eyepatch(r,y);
 if(school){for(const [x,side]of [[16,-1],[39,1]]){P([[x,20+y],[x+side*5,18+y],[x+side*5,24+y],[x,23+y]],'#b95c75');L(x,23+y,x+side*3,29+y,'#dd8b99');}}
 else if(victorian){for(const x of [18,38]){P([[x,34+y],[x-4,36+y],[x-2,41+y],[x+1,38+y],[x+4,41+y],[x+4,36+y]],'#b54f72');rose(r,x,33+y,'#95558e');}}
 else{const trim=white?'#eadbdf':red,lit=white?'#fff3eb':redLight;for(let i=0;i<7;i++){const x=14+i*4,yy=14-Math.round(Math.sin(i*Math.PI/6)*6)+y;R(x,yy,4,4,trim);R(x+1,yy,2,1,lit);}for(const [x,side]of [[15,-1],[40,1]]){P([[x,18+y],[x+side*6,15+y],[x+side*6,22+y],[x,21+y]],white?'#ece0e5':red);R(x-1,18+y,3,3,lit);}if(white)rose(r,15,19+y,'#a24d71');}
 return outline(r.pixels,INK);
}
