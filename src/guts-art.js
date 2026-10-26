import {raster,outline} from './pixel-characters.js';

export const GUTS_ART={ink:'#26303d',hair:'#222935',hairShade:'#161e29',hairLight:'#49505d',skin:'#dcb394',skinShade:'#a87a67',skinLight:'#efd1b1',plate:'#394350',plateShade:'#222c3a',plateLight:'#75808a',cape:'#34313d',capeShade:'#202735',capeLight:'#59505a',steel:'#b5c0be',steelShade:'#73838b',steelLight:'#e6e8d6',leather:'#6c5144',buckle:'#ad956c',red:'#d66d69'};
export const BERSERKER_SKIN_ART={black:'#151b26',plate:'#303946',facet:'#46515e',edge:'#7b8792',light:'#a2a9ad',cape:'#252632',capeShade:'#171d28',capeLight:'#494550',red:'#ed5862',redShade:'#a72d46',eye:'#ffd2b9'};

function berserkerSkinPixels({frame=0,moving=false,pose='',attack=false}={}){
 const r=raster(),{poly:P,line:L,rect:R}=r,c=BERSERKER_SKIN_ART,step=moving?[0,2,0,-2][((frame%4)+4)%4]:0,bob=moving?-(frame%2):0,cast=attack||pose==='cleave'||pose==='ultimate';
 // Heavy torn cloth spreads behind the armor. The separate tips move with
 // each weight transfer; the armor itself never exposes the human face.
 P([[21,28+bob],[31,29+bob],[40,35],[43+step,48],[48,60],[43,59],[46+step,69],[35,65],[30,71],[25,65],[18,70],[15,65],[5-step,69],[9,59],[2-step,62],[5,48],[8,36]],c.capeShade);
 P([[17,31+bob],[24,32+bob],[28,46],[24-step,61],[18,65],[15,61],[8-step,65],[11,54],[8,48],[12,37]],c.cape);
 P([[33,32+bob],[38,37],[38+step,49],[42,61],[38,59],[37,65],[31,60]],c.cape);
 L(13,39,10-step,55,c.capeLight);L(18,39,20-step,57,'#3c3d49');L(38,45,40+step,57,c.capeLight);L(7,52,6-step,59,'#343541');
 if(!cast)slab(r,{attack:false,step:bob});
 // Overlapping thigh, knee and shin shells give the legs a complete black
 // silhouette instead of recoloring the exposed Black Swordsman trousers.
 for(const [x,d]of [[20,-step],[31,step]]){
  P([[x-2,49],[x+7,49],[x+7+d,58],[x+5+d,65],[x+6+d,70],[x-2+d,70],[x-3+d,60]],c.black);
  P([[x,50],[x+5,51],[x+4+d,57],[x+1+d,59],[x-1+d,55]],c.plate);
  P([[x-2+d,57],[x+3+d,55],[x+7+d,59],[x+3+d,64],[x-2+d,61]],c.facet);L(x-1+d,58,x+3+d,57,c.edge);L(x+3+d,57,x+5+d,59,c.light);
  P([[x-1+d,63],[x+4+d,62],[x+3+d,68],[x+d,70],[x-2+d,67]],c.plate);L(x+d,63,x+d,68,c.edge);
  for(const yy of [52,55,65])L(x,yy,x+4+d,yy+1,c.facet);
  P([[x-3+d,68],[x+5+d,68],[x+8+d,71],[x+7+d,73],[x-4+d,73],[x-5+d,71]],c.black);P([[x-2+d,69],[x+4+d,69],[x+6+d,71],[x-3+d,71]],c.plate);L(x-3+d,71,x+6+d,71,c.edge);
 }
 // Faceted breastplate and layered abdominal lames taper into a pointed
 // armored skirt. Their silver edge pixels pick out black-on-black shapes.
 P([[18,32+bob],[24,29+bob],[33,29+bob],[39,33+bob],[39,42],[36,51],[29,57],[20,53],[16,42]],c.black);
 P([[20,34+bob],[25,32+bob],[29,36+bob],[33,32+bob],[37,35+bob],[35,42],[29,45],[22,42]],c.plate);
 P([[20,34+bob],[25,32+bob],[28,37+bob],[25,40],[20,38]],c.facet);P([[30,37+bob],[33,32+bob],[37,35+bob],[34,40]],c.facet);
 L(21,34+bob,26,36+bob,c.edge);L(31,36+bob,35,34+bob,c.edge);L(29,37+bob,29,44,c.facet);
 for(const yy of [43,47,51]){P([[20,yy],[28,yy+2],[36,yy-1],[34,yy+3],[28,yy+5],[21,yy+2]],c.plate);L(21,yy,28,yy+2,c.edge);L(29,yy+2,34,yy,c.facet);}
 for(const [x,side]of [[20,-1],[33,1]]){P([[x-2,50],[x+4,49],[x+side*4+5,58],[x+side*4,61],[x-2,57]],c.black);L(x,52,x+side*3+2,58,c.facet);}
 // Both forearms and hands are enclosed: serrated gauntlets, knuckle plates
 // and a compact fist gripping the sword replace skin and leather wraps.
 for(const [x,side]of [[15,-1],[38,1]]){
  const hx=side>0&&cast?32:x+side*2,hy=side>0&&cast?46:51;
  L(x,36+bob,x+side*3,43,c.black,7);L(x,37+bob,x+side*2,42,c.plate,5);L(x+side,37+bob,x+side*2,41,c.edge);
  P([[x-3,41],[x+4,41],[hx+4,hy-2],[hx+2,hy+4],[hx-4,hy+3],[hx-5,hy-2]],c.black);
  P([[x-2,43],[x+2,43],[hx+2,hy-2],[hx,hy+1],[hx-3,hy]],c.plate);L(x-1,43,hx-2,hy-1,c.edge);
  for(let i=0;i<3;i++){const yy=44+i*3;L(x-2,yy,x+3,yy+1,c.facet);}
  P([[hx-4,hy],[hx+3,hy],[hx+4,hy+4],[hx+2,hy+6],[hx-4,hy+5]],c.plate);for(const xx of [-2,0,2])L(hx+xx,hy+2,hx+xx,hy+4,c.edge);
  P([[x+side*3,43],[x+side*7,40],[x+side*5,47]],c.facet);
 }
 // Large pointed pauldrons sit over the upper arms as independent shells.
 for(const [x,side]of [[15,-1],[37,1]]){
  P([[x-5,34+bob],[x-2,29+bob],[x+5,30+bob],[x+10,35+bob],[x+7,41+bob],[x,43+bob],[x-5,39+bob]],c.black);
  P([[x-3,34+bob],[x,31+bob],[x+5,32+bob],[x+8,35+bob],[x+4,38+bob],[x-2,37+bob]],c.facet);L(x-2,34+bob,x+2,32+bob,c.edge);L(x+2,32+bob,x+6,34+bob,c.light);
  L(x-2,38+bob,x+4,40+bob,c.edge);P([[x+side*4,35+bob],[x+side*8,32+bob],[x+side*6,39+bob]],c.plate);
 }
 // The closed helmet has a long central ridge and a pointed jaw. Two red
 // slits plunge toward the nose rather than making a single flat visor.
 P([[18,16+bob],[19,10+bob],[25,5+bob],[31,5+bob],[37,10+bob],[40,19+bob],[38,29+bob],[30,38+bob],[21,31+bob],[17,24+bob]],c.black);
 P([[20,16+bob],[21,11+bob],[26,7+bob],[30,7+bob],[35,11+bob],[37,19+bob],[35,27+bob],[30,34+bob],[23,29+bob],[20,23+bob]],c.plate);
 P([[22,13+bob],[26,8+bob],[28,8+bob],[27,18+bob],[24,22+bob],[21,18+bob]],c.facet);P([[30,8+bob],[35,12+bob],[36,18+bob],[32,21+bob],[29,17+bob]],c.facet);
 L(22,13+bob,26,9+bob,c.edge);L(30,9+bob,34,12+bob,c.edge);L(28,9+bob,27,19+bob,c.light);
 P([[18,16+bob],[15,9+bob],[20,12+bob],[23,20+bob]],c.plate);P([[35,14+bob],[40,8+bob],[39,19+bob],[36,24+bob]],c.plate);L(17,12+bob,19,17+bob,c.edge);
 P([[20,20+bob],[25,23+bob],[28,30+bob],[22,26+bob]],c.redShade);P([[20,20+bob],[24,23+bob],[26,27+bob],[22,24+bob]],c.red);L(21,21+bob,23,23+bob,c.eye);
 P([[36,19+bob],[34,25+bob],[29,30+bob],[31,23+bob]],c.redShade);P([[36,19+bob],[34,23+bob],[31,27+bob],[32,23+bob]],c.red);L(35,20+bob,33,23+bob,c.eye);
 P([[28,19+bob],[30,20+bob],[29,29+bob],[30,35+bob],[27,31+bob],[26,27+bob]],c.black);L(29,21+bob,28,29+bob,c.facet);
 L(22,27+bob,27,32+bob,c.edge);L(35,27+bob,30,34+bob,c.facet);L(26,32+bob,30,36+bob,c.edge);
 if(cast){slab(r,{attack:true,step:bob});P([[28,45],[33,44],[36,47],[34,51],[29,51],[27,48]],c.black);R(29,46,5,3,c.plate);for(const x of [29,31,33])L(x,46,x,48,c.edge);}
 return outline(r.pixels,GUTS_ART.ink);
}

function slab(r,{attack,step=0,berserk=false}){
 const {poly:P,line:L,rect:R}=r,c=GUTS_ART;
 if(attack){
  // A broad, blunt slab rather than a slender fantasy sword. The in-game
  // swing continues this blade beyond the character's small native frame.
  P([[27,45],[31,38],[51,20],[55,24],[55,33],[34,51]],c.steelShade);
  P([[31,43],[34,39],[52,23],[54,26],[53,31],[34,48]],c.steel);
  L(34,40,52,24,c.steelLight);L(32,47,51,31,'#8e9ca0');
  L(26,47,34,38,c.plateShade,3);L(26,46,34,38,c.buckle,1);
  L(24,49,29,44,c.leather,4);R(23,49,4,3,c.buckle);
 }else{
  P([[34,42],[41,12+step],[47,3+step],[54,7+step],[51,20+step],[43,44]],c.steelShade);
  P([[37,40],[43,13+step],[48,6+step],[51,8+step],[49,20+step],[41,41]],c.steel);
  L(41,23+step,47,8+step,c.steelLight,2);L(38,38,41,25+step,c.steelLight);
  L(42,40,48,21+step,'#85949a');
  L(33,42,44,45,c.plateShade,3);L(34,42,43,44,c.buckle);
  L(38,45,35,56,c.leather,4);L(38,46,36,53,'#a18163');R(34,55,5,3,c.buckle);
 }
 if(berserk){const x=attack?47:46,y=attack?29:25;L(x,y,x-4,y+8,'#a66c68');R(x-2,y+4,2,2,'#e7a388');}
}

function civilianPixels({frame,moving,pose,attack,expression,blink,skin}){
 const r=raster(),{rect:R,poly:P,line:L}=r,c=GUTS_ART,walk=moving?[0,2,0,-2][((frame%4)+4)%4]:0,y=moving?-(frame%2):0,cast=attack||pose==='ultimate'||pose==='cleave',casual=skin==='casual',swim=skin==='swimsuit',cloth=casual?'#65564e':swim?'#343e4c':'#3c3d4c',shade=casual?'#3d3740':swim?'#222c3c':'#242c3b',light=casual?'#9d8570':swim?'#75838d':'#6e6979';
 if(!cast)slab(r,{attack:false,step:y});
 for(const [x,d]of [[20,-walk],[30,walk]]){
  if(swim){
   P([[x,50],[x+7,50],[x+7+d,61],[x+5+d,69],[x-1+d,68],[x-1+d,59]],c.skinShade);P([[x+1,54],[x+5,54],[x+5+d,63],[x+3+d,67],[x+d,66]],c.skin);L(x+2,59,x+2+d,64,c.skinLight);
   P([[x-2+d,68],[x+6+d,68],[x+8+d,71],[x+6+d,72],[x-3+d,72]],shade);L(x-1+d,69,x+5+d,69,'#ccab86');L(x+1+d,68,x+5+d,71,'#876956');
  }else{
   P([[x,50],[x+7,50],[x+7+d,62],[x+5+d,69],[x-1+d,69],[x-1+d,58]],shade);P([[x+1,52],[x+5,53],[x+5+d,61],[x+3+d,67],[x+d,64]],casual?'#434b59':'#474555');L(x+2,55,x+2+d,63,light);
   if(!casual){R(x+d,63,5,2,'#a59e9e');R(x+d,66,5,3,'#b9b7ad');L(x+d,68,x+4+d,68,'#e3ddc9');}
   P([[x-1+d,67],[x+6+d,67],[x+8+d,70],[x+7+d,72],[x-3+d,72],[x-3+d,70]],casual?'#3d3b42':'#252e3e');R(x-1+d,69,6,1,casual?'#a18c73':'#7c8791');
  }
 }
 if(casual){
  // Open leather coat with stitched lapels and separate long coat tails.
  P([[19,32+y],[24,31+y],[33,31+y],[38,35+y],[39,47],[43+walk,62],[36,64],[30,57],[27,58],[23,64],[14+walk,62],[18,47]],shade);
  P([[22,34+y],[32,34+y],[33,49],[28,55],[22,52]],'#bcb6a2');R(25,36+y,6,10,'#d8ceba');L(26,36+y,27,42,'#8e897d');
  P([[19,34+y],[24,33+y],[26,39],[23,48],[24,56],[20,61],[17+walk,60],[20,47]],cloth);P([[33,33+y],[38,36+y],[37,48],[40+walk,60],[35,61],[31,53],[33,44],[30,39]],cloth);
  P([[20,33+y],[24,32+y],[28,39],[24,43],[21,39]],light);P([[33,32+y],[37,35+y],[33,41],[30,40]],light);L(20,44,19+walk,58,light);L(36,45,38+walk,58,light);
  R(23,48,11,3,c.leather);R(27,48,4,2,c.buckle);for(const xx of [18,34]){R(xx,50,4,6,shade);L(xx,50,xx+3,50,light);}
 }else if(swim){
  // Short-sleeved technical rashguard and loose board shorts, never armor.
  P([[19,33+y],[24,31+y],[33,31+y],[38,35+y],[39,46],[35,51],[21,51],[17,44]],shade);P([[22,34+y],[32,34+y],[35,38],[34,48],[22,48],[20,40]],cloth);
  P([[19,36+y],[22,35+y],[23,46],[21,48],[18,44]],'#87929a');P([[34,35+y],[38,38+y],[37,46],[34,48],[33,42]],'#87929a');L(23,34+y,32,34+y,'#bcc0b5');R(22,47,12,2,'#9b5c63');
  P([[20,49],[35,49],[37+walk,58],[29+walk,59],[28,54],[26-walk,59],[18-walk,58]],'#283342');P([[21,51],[27,51],[25-walk,57],[20-walk,57]],'#56616d');P([[29,51],[34,51],[35+walk,57],[30+walk,57]],'#56616d');L(19-walk,57,25-walk,58,'#aa656b');L(30+walk,58,36+walk,57,'#aa656b');R(26,49,4,2,'#d1c1a2');L(28,51,26,54,'#d1c1a2');
  L(27,38,27,43,'#d9968a');L(25,39,29,41,'#d9968a');L(25,42,27,44,'#d9968a');L(27,44,29,42,'#d9968a');
 }else{
  // A loose buttoned sleeping shirt has red piping and a tiny brand pocket.
  P([[19,33+y],[24,31+y],[33,31+y],[38,35+y],[39,44],[36,53],[31,55],[26,53],[20,55],[17,44]],shade);P([[22,34+y],[33,34+y],[36,39],[34,51],[29,53],[22,52],[20,41]],cloth);
  P([[23,32+y],[28,36+y],[32,32+y],[34,34+y],[29,39],[25,38],[21,34+y]],'#8b7681');L(28,39,28,52,'#a1787e');for(const yy of [40,44,48])R(29,yy,1,1,'#d3c3b3');
  R(21,40,5,7,shade);L(21,40,25,40,'#9f7b80');L(23,41,23,45,'#d69887');L(22,42,24,43,'#d69887');R(21,52,13,1,'#9f7b80');
 }
 // Sleeves move at the shoulders; the iron forearm remains recognizable.
 const leftY=cast?47:52,rightY=cast?44:51,sleeve=casual?cloth:swim?'#75838d':cloth;
 L(18,36+y,14,swim?42:leftY-5,shade,6);L(18,36+y,14,swim?41:leftY-6,sleeve,4);L(15,37+y,14,swim?40:leftY-7,light);
 if(swim){L(14,42,13,leftY-4,c.skinShade,5);L(14,42,13,leftY-5,c.skin,3);}
 P([[11,leftY-6],[16,leftY-6],[18,leftY-2],[17,leftY+4],[11,leftY+5],[10,leftY],[11,leftY-4]],c.steelShade);R(11,leftY-4,5,3,c.steel);R(11,leftY,5,2,c.steel);L(12,leftY-4,12,leftY+2,c.steelLight);L(11,leftY-1,16,leftY-1,c.plateShade);
 L(37,36+y,40,swim?43:rightY-3,shade,6);L(37,36+y,40,swim?42:rightY-4,sleeve,4);if(swim)L(40,43,cast?33:40,rightY,c.skin,4);R(cast?29:38,rightY,6,4,c.skin);L(cast?29:38,rightY+3,cast?34:42,rightY+3,c.skinShade);
 if(!casual&&!swim){R(12,leftY-7,6,2,'#aa898d');R(37,rightY-3,6,2,'#aa898d');}
 // Reuse only the head clusters, never the old armor, so every outfit keeps
 // the same scar, haircut, expression and native pixel proportions.
 const head=gutsPixels({frame,moving,pose,attack,expression,blink,skin:'default'});
 for(let yy=0;yy<34+y;yy++)for(let xx=16;xx<40;xx++){const color=head[yy*56+xx];if(color&&color!==c.ink)r.put(xx,yy,color);}
 if(cast)slab(r,{attack:true,step:y});
 return outline(r.pixels,c.ink);
}

export function gutsPixels({frame=0,moving=false,pose='',attack=false,expression='neutral',blink=false,skin='default',form=0}={}){
 if(skin==='berserker')return berserkerSkinPixels({frame,moving,pose,attack});
 const r=raster(),{rect:R,poly:P,line:L}=r,c=GUTS_ART,berserk=form===1||form==='berserk'||pose==='berserk',golden=skin==='goldenage'&&!berserk,stride=moving?[0,2,0,-2][((frame%4)+4)%4]:0,bob=moving?-(frame%2):0,cast=attack||pose==='cleave'||pose==='ultimate',plate=golden?'#777d85':c.plate,plateLight=golden?'#bcc1bd':c.plateLight,cape=golden?'#636c80':c.cape;
 if(!berserk&&['casual','pajamas','swimsuit'].includes(skin))return civilianPixels({frame,moving,pose,attack,expression,blink,skin});
 // A ragged cape sits behind the body, leaving the iron forearm and the great
 // sword separate. Its uneven tails swing independently of the armored legs.
 P([[18,31+bob],[29,32+bob],[36,44],[35-stride,61],[28,65],[23-stride,69],[19,64],[14-stride,69],[12,61],[7-stride,65],[9,52],[9,40]],c.capeShade);
 P([[17,33+bob],[23,34+bob],[26,44],[26-stride,60],[22,65],[17,60],[13-stride,64],[12,55],[11,43]],cape);
 L(16,40,14-stride,57,c.capeLight);L(21,44,22-stride,60,'#49424d');L(10,49,10-stride,59,'#464450');
 // Sword is carried high behind his right shoulder, not drawn as a UI panel.
 if(!cast)slab(r,{attack:false,step:bob,berserk});
 for(const [x,s]of [[20,-stride],[30,stride]]){
  P([[x,49],[x+7,49],[x+7+s,60],[x+6+s,69],[x-1+s,69],[x-1,59]],c.plateShade);
  P([[x+1,51],[x+5,52],[x+5+s,59],[x+3+s,66],[x+s,64]],plate);
  L(x+2,54,x+2+s,61,plateLight);P([[x-1+s,59],[x+6+s,59],[x+7+s,63],[x+4+s,66],[x+s,64]],c.plateShade);
  L(x+s,60,x+5+s,60,plateLight);R(x+s,65,5,4,plate);R(x+s+1,66,1,3,plateLight);
  P([[x-1+s,67],[x+6+s,67],[x+8+s,70],[x+7+s,72],[x-3+s,72],[x-3+s,70]],c.plateShade);R(x-1+s,69,6,1,plateLight);R(x-2+s,71,9,1,'#7b7c76');
 }
 // Broad angular breastplate, articulated abdomen and leather cross-straps.
 P([[19,31+bob],[25,30+bob],[33,30+bob],[38,34+bob],[39,43],[36,51],[29,55],[20,52],[17,43]],c.plateShade);
 P([[21,33+bob],[26,32+bob],[32,33+bob],[36,36+bob],[35,43],[31,48],[22,46],[19,40]],plate);
 P([[22,34+bob],[28,36+bob],[33,34+bob],[35,38],[31,41],[24,40],[20,37]],golden?'#9da3a4':'#53606b');
 L(22,34+bob,28,37+bob,plateLight);L(29,37+bob,34,35+bob,plateLight);
 for(const yy of [43,47,50]){P([[21,yy],[28,yy+1],[35,yy-1],[34,yy+3],[28,yy+4],[21,yy+2]],plate);L(22,yy+1,28,yy+2,plateLight);}
 L(20,34+bob,33,48,c.leather,3);L(21,34+bob,34,47,'#a58b68');R(25,40,4,4,c.buckle);R(26,41,2,2,c.leather);
 R(20,51,16,4,c.leather);R(26,51,5,3,c.buckle);R(27,52,3,1,'#e0c49a');R(19,53,5,7,c.plateShade);R(20,54,3,5,'#695c51');
 // Human right arm and a visibly segmented iron prosthetic on his left.
 const hy=cast?44:49;
 P([[18,34+bob],[15,35+bob],[12,41],[12,48],[17,51],[20,44],[21,38]],c.plateShade);
 P([[16,36+bob],[14,40],[14,45],[18,46],[19,40]],plate);L(15,37+bob,15,42,plateLight);
 P([[12,44],[17,44],[19,48],[18,54],[12,56],[10,52],[11,48]],c.steelShade);R(12,46,5,3,c.steel);R(12,50,5,2,c.steel);R(12,54,5,2,c.plateLight);R(13,47,1,7,c.steelLight);L(11,48,16,48,c.plateShade);L(11,52,17,52,c.plateShade);
 P([[35,34+bob],[39,35+bob],[42,41],[41,hy+3],[36,hy+4],[34,43]],c.plateShade);P([[36,36+bob],[39,37+bob],[40,42],[38,hy+1],[36,hy]],plate);L(38,38,39,42,plateLight);
 R(cast?29:35,hy,6,4,c.skin);L(cast?29:35,hy+3,cast?34:39,hy+3,c.skinShade);R(36,hy-2,5,3,c.leather);
 // Raised, layered shoulder armor and the rough cloth collar are independent
 // silhouettes, not color changes on the face or on the blade.
 for(const [x,side]of [[16,-1],[36,1]]){P([[x-3,34+bob],[x,30+bob],[x+6,32+bob],[x+8,38],[x+5,41],[x-3,39]],c.plateShade);P([[x-2,34+bob],[x+1,32+bob],[x+5,34+bob],[x+6,37],[x+3,39],[x-2,37]],plate);L(x,34+bob,x+4,35+bob,plateLight);if(berserk)P([[x-3,34+bob],[x+side*4,28+bob],[x+4,33+bob]],plateLight);}
 P([[20,31+bob],[23,28+bob],[33,28+bob],[36,32+bob],[33,36+bob],[29,34+bob],[24,36+bob]],c.capeShade);L(21,32+bob,25,34+bob,c.capeLight);R(31,32+bob,3,2,c.buckle);
 if(berserk){
  // The Beast of Darkness: long snout, swept ears and one red visor cut.
  P([[18,20+bob],[17,9+bob],[22,13+bob],[27,8+bob],[32,12+bob],[37,9+bob],[39,20+bob],[43,25+bob],[38,32+bob],[32,36+bob],[24,33+bob],[19,28+bob]],c.plateShade);
  P([[20,20+bob],[20,12+bob],[24,16+bob],[28,11+bob],[32,16+bob],[36,13+bob],[36,22+bob],[40,26+bob],[36,29+bob],[29,31+bob],[23,28+bob]],plate);
  P([[22,17+bob],[27,13+bob],[31,18+bob],[29,23+bob],[24,22+bob]],'#56626e');L(21,18+bob,21,24+bob,plateLight);L(30,15+bob,34,19+bob,plateLight);
  P([[21,24+bob],[28,25+bob],[36,21+bob],[40,25+bob],[35,28+bob],[29,27+bob],[23,29+bob]],c.hairShade);
  L(25,25+bob,34,24+bob,c.red,2);R(30,24+bob,4,1,'#ffd4ad');
  P([[24,29+bob],[30,30+bob],[37,27+bob],[35,33+bob],[31,36+bob],[25,33+bob]],plate);L(27,31+bob,33,32+bob,plateLight);for(const x of [28,31,34])R(x,29+bob,1,2,c.steelLight);
 }else{
  P([[19,19+bob],[23,14+bob],[32,14+bob],[37,19+bob],[38,27+bob],[34,33+bob],[29,36+bob],[23,33+bob],[19,28+bob]],c.skinShade);
  P([[21,20+bob],[24,16+bob],[31,16+bob],[35,20+bob],[36,27+bob],[32,32+bob],[28,33+bob],[23,30+bob],[21,26+bob]],c.skin);P([[23,22+bob],[32,21+bob],[35,25+bob],[31,29+bob],[24,28+bob]],c.skinLight);
  // His lost right eye is a closed scar. Only the other eye can blink.
  L(22,25+bob,26,26+bob,c.hairShade);if(golden){if(blink||expression==='hurt')L(23,27+bob,26,27+bob,c.hairShade);else{R(23,26+bob,4,2,'#f1e7ce');R(24,26+bob,2,2,'#54605d');R(25,26+bob,1,2,c.hairShade);}}else{L(23,22+bob,24,29+bob,'#93675d');L(24,22+bob,25,28+bob,'#b88977');}
  L(31,25+bob,35,24+bob,c.hairShade);if(blink||expression==='hurt')L(31,27+bob,34,27+bob,c.hairShade);else{R(31,26+bob,4,2,'#f1e7ce');R(32,26+bob,2,2,'#54605d');R(33,26+bob,1,2,c.hairShade);if(['focused','ultimate'].includes(expression)){L(30,24+bob,34,25+bob,c.hairShade);R(31,26+bob,1,1,c.hairShade);}}
  L(28,27+bob,28,29+bob,c.skinShade);L(26,32+bob,31,32+bob,expression==='hurt'?'#8c5255':'#865d56');L(20,29+bob,23,31+bob,c.skinShade);
  P([[17,23+bob],[16,16+bob],[19,13+bob],[18,8+bob],[24,11+bob],[26,6+bob],[30,10+bob],[34,8+bob],[35,13+bob],[39,12+bob],[39,21+bob],[36,25+bob],[34,18+bob],[31,21+bob],[29,16+bob],[25,20+bob],[23,17+bob],[21,22+bob],[19,20+bob],[19,27+bob]],c.hairShade);
  P([[19,17+bob],[20,13+bob],[24,14+bob],[27,10+bob],[30,14+bob],[33,12+bob],[36,16+bob],[36,20+bob],[33,17+bob],[30,19+bob],[28,14+bob],[24,18+bob],[22,15+bob],[20,21+bob]],c.hair);
  L(22,13+bob,25,14+bob,c.hairLight);L(28,11+bob,31,14+bob,c.hairLight);L(34,14+bob,36,17+bob,c.hairLight);
  // Small red Brand of Sacrifice above the collar on the exposed neck.
  L(33,31+bob,33,34+bob,c.red);L(32,32+bob,34,33+bob,c.red);R(33,34+bob,1,1,c.red);
 }
 if(cast)slab(r,{attack:true,step:bob,berserk});
 return outline(r.pixels,c.ink);
}
