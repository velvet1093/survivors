import {raster,outline} from './pixel-characters.js';

const INK='#29303e';
export const AURA_ART={hair:'#bf83b6',hairShade:'#865c91',hairLight:'#e2acce',ivory:'#eee8cc',hornShade:'#aaa78d',navy:'#303449',navyLight:'#555a70',cape:'#a44d78',capeShade:'#6f375e',capeLight:'#c56c91',gold:'#cfb46e',goldLight:'#f3dda0',white:'#eee7e4',skin:'#f2d9c5'};
export function auraPixels(m={}){
 const r=raster(),{rect:R,poly:P,line:L}=r,c=AURA_ART,sway=Math.round((m.tail||0)*.35),arm=Math.round((m.arm||0)*.5),lift=m.attack?2:0;
 // The horns curve outward, then back to their fine ivory tips behind the bob.
 P([[17,17],[11,12],[10,7],[13,3],[19,1],[16,5],[15,8],[19,13]],c.hornShade);
 P([[16,15],[12,11],[12,7],[15,4],[18,3],[15,8],[17,11],[20,14]],c.ivory);
 L(12,7,16,8,'#767b79');L(13,11,17,11,'#767b79');
 P([[34,16],[39,12],[42,5],[41,1],[39,5],[35,7],[33,12]],c.hornShade);
 P([[35,14],[39,10],[40,5],[39,6],[36,9],[34,13]],c.ivory);L(36,8,39,9,'#767b79');
 // A long open magenta overskirt sways independently behind the boots.
 P([[17,42],[35,42],[41+sway,53],[46+sway,65],[39+sway,70],[32,64],[22,65],[12+sway,70],[4+sway,62],[10+sway,51]],c.capeShade);
 P([[17,44],[22,45],[20,55],[14+sway,67],[7+sway,61],[12+sway,52]],c.cape);
 P([[32,44],[36,45],[40+sway,53],[43+sway,64],[39+sway,67],[33,59]],c.cape);
 L(11+sway,59,18,47,c.capeLight);L(35,49,40+sway,61,c.capeLight);L(9+sway,64,14+sway,67,c.capeShade);
 // Long navy boots carry pale bands and small pointed ornaments.
 for(const [x,step]of [[21,-Math.round((m.leg||0)*.4)],[30,Math.round((m.leg||0)*.4)]]){
  P([[x,50],[x+6,50],[x+6+step,64],[x+5+step,70],[x+6+step,73],[x-2+step,73],[x-2+step,70],[x+step,64]],c.navy);
  R(x,51,6,3,c.skin);R(x,54,6,2,c.white);L(x+1,57,x+3+step,66,c.navyLight);
  L(x+step,63,x+4+step,62,c.white);L(x+step,64,x+4+step,63,c.white);
  P([[x+1+step,69],[x+3+step,67],[x+4+step,70],[x+2+step,71]],c.ivory);
 }
 // White front panels sit below a fitted dark bodice with ivory tracing.
 P([[18,40],[34,40],[35,51],[31,54],[25,53],[19,54],[17,50]],c.white);
 L(25,43,25,51,'#bcb3bd');L(32,44,32,51,'#bcb3bd');
 P([[17,31],[22,30],[29,30],[34,32],[35,39],[31,46],[27,49],[22,46],[17,39]],c.navy);
 P([[20,32],[24,36],[29,32],[32,35],[29,39],[25,41],[21,38]],c.navyLight);
 L(18,34,20,39,c.white);L(20,39,24,41,c.white);L(24,41,27,38,c.white);L(27,38,31,41,c.white);L(31,41,34,36,c.white);
 P([[25,40],[30,44],[27,48],[22,44]],c.ivory);P([[25,42],[28,44],[26,46],[24,44]],c.navy);
 L(18,39,20,44,c.gold);L(33,40,31,44,c.gold);R(16,44,3,2,c.gold);R(34,44,3,2,c.gold);
 // Bare shoulders lead into long navy gloves; the raised hand holds a scale.
 L(17,32,13-arm,40,c.skin,4);L(13-arm,40,9-arm,51,c.navy,4);P([[8-arm,49],[12-arm,50],[10-arm,54],[5-arm,56],[4-arm,54]],c.navy);L(11-arm,43,9-arm,49,c.navyLight);
 L(34,33,40,35-lift,c.skin,4);L(40,35-lift,43,32-lift,c.navy,4);R(42,29-lift,5,5,c.navy);R(44,29-lift,2,1,c.navyLight);
 // Compact gold balance: heart-shaped handle, long post, paired suspended pans.
 const sy=lift+arm;
 L(46,33-sy,46,52-sy,c.gold);L(37,40-sy,54,40-sy,c.gold);
 P([[43,35-sy],[42,32-sy],[44,31-sy],[46,33-sy],[48,31-sy],[50,33-sy],[48,36-sy],[46,38-sy]],c.gold);
 P([[44,33-sy],[46,35-sy],[48,33-sy],[48,35-sy],[46,37-sy]],c.navy);
 for(const [x,drop]of [[39,0],[52,2]]){
  L(x,40-sy,x-3,46+drop-sy,c.gold);L(x,40-sy,x+3,46+drop-sy,c.gold);
  P([[x-4,46+drop-sy],[x+4,46+drop-sy],[x+2,49+drop-sy],[x-2,49+drop-sy]],c.gold);
  L(x-3,46+drop-sy,x+3,46+drop-sy,c.goldLight);
 }
 L(44,52-sy,48,52-sy,c.goldLight);
 // Rounded pink bob, low bangs and braided ends rather than long twin tails.
 P([[16,15],[19,10],[25,8],[31,9],[36,14],[40,23],[38,30],[32,33],[18,32],[11,29],[10,24]],c.hairShade);
 P([[16,17],[18,12],[25,10],[31,11],[35,15],[38,24],[35,29],[29,31],[17,30],[12,27],[13,22]],c.hair);
 P([[18,19],[23,15],[30,16],[34,21],[32,28],[28,32],[22,31],[18,27]],c.skin);
 R(20,24,4,1,INK);R(29,24,4,1,INK);R(21,25,2,3,'#7c9a9a');R(30,25,2,3,'#7c9a9a');R(21,25,1,1,'#fff4df');R(30,25,1,1,'#fff4df');L(25,29,28,29,'#aa7a84');
 P([[16,22],[16,15],[21,11],[29,10],[34,15],[36,23],[33,25],[31,20],[28,23],[25,19],[22,23],[20,20],[18,25]],c.hair);
 L(21,13,20,19,c.hairLight);L(26,12,26,18,c.hairLight);L(31,14,33,20,c.hairLight);L(14,21,13,26,c.hairLight);
 for(const [x,sign]of [[17,-1],[32,1]]){
  for(let i=0;i<4;i++){const xx=x+Math.round(Math.sin(i*2)*.8)+sway*.15,yy=30+i*3;P([[xx,yy],[xx+4,yy-1],[xx+5,yy+2],[xx+2,yy+4],[xx-1,yy+2]],i%2?c.hair:c.hairShade);L(xx+1,yy,xx+3,yy+1,c.hairLight);}
  R(x+1,41,3,2,c.navy);P([[x+1,43],[x+4,43],[x+3+sign,46],[x+sign,46]],c.hair);
 }
 // Gold neck ornament rests above the garment's central white motif.
 R(22,31,9,2,c.gold);P([[23,33],[26,36],[29,33],[28,37],[25,39],[22,35]],c.gold);L(24,34,26,36,c.goldLight);
 if(m.enraged){R(21,26,2,1,'#e8cf9a');R(30,26,2,1,'#e8cf9a');R(46,39-sy,1,2,c.goldLight);}
 return outline(r.pixels,INK);
}

export const BERTHOLDT_ART={skin:'#e9c7a6',skinShade:'#bc927e',hair:'#272d36',hairLight:'#51555c',jacket:'#aa875f',jacketLight:'#d2ac7f',jacketShade:'#755b48',shirt:'#eee9dc',harness:'#4c4944',boots:'#594a40',muscle:'#ab5a55',muscleLight:'#d88876',muscleShade:'#713b42',bone:'#e5c9a5',steam:'#bac6c4'};
export function bertholdtPixels(m={}){
 const r=raster(),{rect:R,poly:P,line:L}=r,c=BERTHOLDT_ART,step=Math.round((m.leg||0)*.55),arm=Math.round((m.arm||0)*.4),attack=!!m.attack;
 if(!m.enraged){
  // Slim white trousers, complete thigh harness and tall brown boots.
  for(const [x,d]of [[20,-step],[30,step]]){
   P([[x,47],[x+6,47],[x+6+d,62],[x+5+d,68],[x-1+d,68]],'#c6c5b9');R(x+d,51,5,11,c.shirt);L(x+d,53,x+4+d,58,c.harness,2);L(x+4+d,53,x+d,58,c.harness);
   R(x+d-1,62,7,8,c.boots);R(x+d,63,2,5,'#89705b');R(x+d-3,69,9,3,c.boots);R(x+d-2,70,7,1,c.jacketShade);
  }
  P([[18,32],[24,30],[30,30],[36,33],[39,43],[35,50],[20,50],[16,42]],c.jacketShade);
  P([[20,32],[24,31],[32,32],[35,35],[34,47],[21,47]],c.shirt);
  P([[18,33],[23,32],[23,42],[27,44],[25,48],[18,46],[16,39]],c.jacket);
  P([[31,32],[36,34],[39,41],[35,47],[29,48],[29,44],[32,42]],c.jacket);
  L(20,33,22,36,c.jacketLight);L(33,33,31,37,c.jacketLight);L(19,44,23,44,c.jacketLight);L(32,44,35,44,c.jacketLight);
  L(23,34,31,46,c.harness,2);L(32,34,23,46,c.harness,2);R(20,48,15,3,c.harness);R(26,48,4,2,'#c9c2a9');R(27,48,2,1,c.shirt);
  const hand=attack?43:51;
  L(18,35,13-arm,hand-3,c.jacket,5);L(36,35,41+arm,hand-3,c.jacket,5);R(11-arm,hand-3,5,3,c.jacketShade);R(39+arm,hand-3,5,3,c.jacketShade);R(12-arm,hand,4,4,c.skin);R(40+arm,hand,4,4,c.skin);
  // Small white/green wings and side canisters distinguish the Scout uniform.
  R(16,35,4,5,'#e8e4d6');L(16,36,18,38,'#5b7581');L(19,36,17,39,'#789c86');
  for(const x of [15,36]){R(x,49,4,8,'#677477');R(x,49,1,7,'#b5c4bf');R(x,56,4,1,'#404c55');}
  L(13-arm,hand+3,5-arm,hand+13,'#8b9b9a',2);L(14-arm,hand+3,6-arm,hand+12,'#dde4d9');L(42+arm,hand+3,49+arm,hand+13,'#b8cbc6',2);
  // Bertholdt's short dark hair and long quiet face stay distinct from Eren.
  R(24,28,7,6,c.skinShade);P([[18,14],[22,10],[31,10],[36,14],[36,24],[33,29],[28,33],[23,30],[19,25]],c.skinShade);
  P([[20,16],[23,12],[31,13],[34,16],[34,24],[31,29],[27,31],[23,28],[20,23]],c.skin);
  R(17,20,3,5,c.skin);R(35,20,3,5,c.skin);L(21,21,25,21,c.hair);L(29,21,33,21,c.hair);R(22,22,3,2,'#e8e6d5');R(29,22,3,2,'#e8e6d5');R(23,22,1,2,'#557977');R(30,22,1,2,'#557977');L(27,23,27,26,c.skinShade);L(25,28,29,28,'#9c736a');
  P([[18,23],[16,17],[18,9],[22,7],[31,7],[36,10],[38,17],[36,24],[33,19],[33,14],[29,15],[27,13],[23,15],[20,14],[20,22]],c.hair);
  L(20,11,24,9,c.hairLight);L(26,9,32,10,c.hairLight);L(35,13,35,17,c.hairLight);
 }else{
  // Vents behind the skinless body: broken vapor plumes do not hide its outline.
  const steam=Math.round((m.tail||0)*.25)+arm;
  for(const [x,flip]of [[6,-1],[49,1]]){
   P([[x,32],[x-2,28],[x+flip*2,24+steam],[x-1,20],[x+flip,15+steam],[x+3,20],[x+2,25],[x+4,29]],'#7c9397');
   L(x+1,28,x+flip,24+steam,c.steam,2);L(x+flip,23+steam,x+1,20,c.steam);R(x+flip,15+steam,2,2,'#dde0d4');
  }
  // Thick thighs and tapered lower legs display separated red muscle bundles.
  for(const [x,d]of [[17,-step],[31,step]]){
   P([[x,48],[x+9,48],[x+10+d,58],[x+7+d,68],[x+1+d,69],[x-2+d,62]],c.muscleShade);
   P([[x+1,50],[x+7,50],[x+7+d,57],[x+5+d,63],[x+d,60]],c.muscle);
   L(x+3,51,x+4+d,59,c.muscleLight,2);L(x+7,52,x+7+d,58,c.bone);R(x+d,61,6,3,c.bone);L(x+d+1,64,x+d+1,69,c.muscleLight,2);
   P([[x+d,68],[x+6+d,68],[x+8+d,72],[x-4+d,72],[x-4+d,70]],c.muscle);
   L(x-3+d,70,x+3+d,70,c.bone);for(let i=0;i<3;i++)R(x-2+d+i*2,71,1,1,c.muscleShade);
  }
  P([[21,22],[35,22],[38,28],[45,31],[43,40],[37,49],[37,54],[20,54],[19,49],[12,40],[10,31],[18,27]],c.muscleShade);
  // A powerful neck joins the trapezius, broad pectorals and exposed rib fan.
  P([[23,22],[28,25],[32,22],[35,28],[41,31],[37,34],[29,30],[21,34],[15,31],[21,27]],c.muscle);
  L(24,23,26,29,c.bone);L(32,23,30,29,c.bone);
  P([[15,33],[22,30],[27,33],[27,39],[22,41],[15,38]],c.muscle);
  P([[30,33],[36,30],[41,33],[40,38],[34,41],[29,39]],c.muscle);
  for(let yy=33;yy<39;yy+=2){L(16,yy,25,yy+1,c.muscleLight);L(32,yy+1,39,yy,c.muscleLight);}
  for(let i=0;i<4;i++){L(16+i,40+i*2,23,42+i*2,c.bone);L(39-i,40+i*2,32,42+i*2,c.bone);}
  R(24,40,8,13,c.muscle);L(28,40,28,52,c.muscleShade);for(const yy of [41,45,49]){R(24,yy,3,2,c.muscleLight);R(29,yy,3,2,c.muscleLight);}L(20,50,25,53,c.bone);L(36,50,31,53,c.bone);
  for(const [x,side]of [[12,-1],[43,1]]){
   const reach=arm*side,hand=attack?49:56;
   P([[x-4,30],[x+3,30],[x+5,36],[x+3+reach,44],[x-3+reach,44],[x-5,36]],c.muscle);
   L(x-2,32,x+reach-1,41,c.muscleLight,2);L(x+2,33,x+reach+2,41,c.bone);
   P([[x-3+reach,42],[x+3+reach,42],[x+3+reach+side,hand],[x-3+reach+side,hand],[x-5+reach,49]],c.muscleShade);
   L(x-2+reach,44,x-2+reach+side,hand-2,c.muscleLight,2);L(x+1+reach,44,x+1+reach+side,hand-1,c.muscle);
   R(x-4+reach+side,hand,8,6,c.muscle);L(x-3+reach+side,hand,x+2+reach+side,hand,c.bone);for(let i=0;i<3;i++)R(x-2+reach+side+i*2,hand+3,1,2,c.muscleShade);
  }
  // A small bald head has tendon bands, hollow narrow eyes and exposed teeth.
  P([[22,7],[26,4],[32,5],[36,9],[36,17],[33,22],[28,25],[23,22],[20,17],[20,11]],c.muscleShade);
  P([[23,8],[27,5],[32,7],[34,10],[34,17],[31,21],[27,22],[23,19],[22,14]],c.muscle);
  L(24,8,31,8,c.muscleLight);L(23,10,32,10,c.muscleLight);L(24,12,27,13,c.bone);L(30,13,33,12,c.bone);
  L(22,15,26,15,INK);L(30,15,34,15,INK);R(24,15,1,1,'#efccaf');R(31,15,1,1,'#efccaf');L(28,14,28,18,c.bone);
  L(21,16,23,20,c.bone);L(35,16,33,20,c.bone);R(23,19,10,3,INK);R(24,19,8,2,c.bone);for(const x of [25,27,29,31])R(x,19,1,2,c.muscleShade);L(25,23,31,23,c.muscleLight);
 }
 return outline(r.pixels,INK);
}
