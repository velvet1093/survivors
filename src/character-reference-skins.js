import {raster,outline} from './pixel-characters.js';
import {paintFace} from './expressions.js';

const INK='#293145',SKIN='#ffe2c6',SKIN_SHADE='#dba68f';
function face(r,id,{y=0,expression='neutral',blink=false}={}){
 const {rect:R,poly:P}=r;
 P([[18,22+y],[22,17+y],[33,17+y],[38,23+y],[37,32+y],[33,37+y],[28,39+y],[22,36+y],[18,30+y]],SKIN_SHADE);
 P([[20,23+y],[23,19+y],[32,19+y],[36,24+y],[35,32+y],[31,36+y],[27,37+y],[22,34+y],[20,29+y]],SKIN);
 R(17,27+y,3,5,SKIN);R(36,27+y,3,5,SKIN);paintFace(r,id,{y,expression,blink});
}

function hokagePixels({frame=0,moving=false,pose='',attack=false,expression='neutral',blink=false}={}){
 const r=raster(),{rect:R,poly:P,line:L}=r,walk=moving?[0,2,0,-2][frame]:0,y=moving?-(frame%2):0,seal=pose==='seal',cast=attack||seal;
 const cream='#f2eee0',coatShade='#bfb9b1',red='#b85056',redLight='#db7c6b',orange='#db8b48',orangeLight='#f7b15e',orangeShade='#a9613b',black='#303a4b',blackShade='#1d2a3b',gold='#efc55e';
 // The Hokage mantle has a high red collar, open front and separate flame hems.
 P([[18,35],[23,33],[33,33],[39,36],[41,49],[46+walk,64],[39+walk,67],[33,63],[28,58],[22,64],[15+walk,67],[9+walk,63],[15,48]],coatShade);
 P([[18,36],[23,35],[23,49],[20+walk,61],[15+walk,64],[11+walk,62],[17,47]],cream);
 P([[33,35],[38,37],[40,49],[44+walk,62],[39+walk,64],[35+walk,60],[32,47]],cream);
 // Angular red flames follow the lower edge instead of a solid red hem.
 for(const [x,yy]of [[12,61],[16,63],[20,60],[35,60],[39,63],[43,61]]){
  P([[x+walk-2,yy+3],[x+walk-2,yy],[x+walk,yy-3],[x+walk+1,yy+1],[x+walk+3,yy-1],[x+walk+3,yy+4]],red);
  R(x+walk,yy+1,1,2,redLight);
 }
 // Dark adult-era trousers and open-toe ninja sandals.
 for(const [x,d]of [[21,-walk],[31,walk]]){
  P([[x,51],[x+5,51],[x+6+d,65],[x+5+d,69],[x-1+d,69]],blackShade);R(x+d+1,56,3,10,black);R(x+d,63,5,3,'#e0d6c2');
  R(x+d-1,67,7,4,blackShade);R(x+d,69,5,1,SKIN);R(x+d-1,71,7,1,'#121e2f');
 }
 // Orange zip-front jacket beneath the white mantle.
 P([[21,37+y],[34,37+y],[36,45],[33,54],[23,54],[20,45]],orangeShade);
 P([[23,38+y],[32,38+y],[33,45],[31,52],[24,52],[22,44]],orange);
 R(23,38+y,10,5,black);L(28,39+y,28,53,'#b6bdc2');R(29,44,1,2,cream);L(24,46,24,50,orangeLight);R(23,53,11,2,blackShade);
 const hands=seal?[[25,44],[29,44]]:cast?[[15,51],[44,40]]:moving?[[12,42-walk],[44,44+walk]]:[[15,52],[40,52]];
 for(const [i,start]of [[0,[19,39+y]],[1,[35,39+y]]]){
  const [hx,hy]=hands[i];L(start[0],start[1],hx,hy-2,black,5);L(start[0],start[1]+2,hx,hy-4,orange,3);R(hx-1,hy-2,5,2,blackShade);R(hx,hy,4,4,SKIN);
 }
 if(seal){L(27,44,28,40,SKIN,2);L(31,44,30,40,SKIN,2);}
 P([[20,35+y],[25,34+y],[28,38+y],[32,34+y],[37,36+y],[35,40],[31,38],[28,41],[24,38],[21,40]],red);L(23,35+y,27,38+y,redLight);L(32,35+y,29,38+y,redLight);
 face(r,'naruto',{y,expression,blink});
 // Adult Naruto's cropped, low spiked cut leaves no forehead protector.
 P([[17,29+y],[15,22+y],[16,17+y],[18,17+y],[17,12+y],[22,14+y],[24,10+y],[27,13+y],[30,10+y],[32,14+y],[37,12+y],[36,17+y],[40,19+y],[38,27+y],[35,30+y],[34,22+y],[30,23+y],[27,20+y],[24,23+y],[21,21+y],[20,29+y]],'#b8863e');
 P([[18,23+y],[18,18+y],[21,17+y],[21,14+y],[25,16+y],[27,13+y],[30,16+y],[34,14+y],[34,19+y],[37,20+y],[36,25+y],[33,21+y],[30,21+y],[27,18+y],[24,21+y],[21,19+y],[20,25+y]],gold);
 L(21,17+y,24,16+y,'#ffe9a2');L(28,15+y,31,17+y,'#ffe9a2');L(35,20+y,35,23+y,'#ffe9a2');
 for(const yy of [32,34,36]){L(19,yy+y,22,yy+1+y,'#aa786d');L(34,yy+1+y,37,yy+y,'#aa786d');}
 return outline(r.pixels,INK);
}

function schoolMadokaPixels({frame=0,moving=false,pose='',attack=false,expression='neutral',blink=false}={}){
 const r=raster(),{rect:R,poly:P,line:L}=r,walk=moving?[0,2,0,-2][frame]:0,y=moving?-(frame%2):0,cast=attack||pose==='hope';
 const hair='#e9a0bc',hairShade='#ac6a92',hairLight='#ffdae5',cream='#e9d9b4',creamShade='#b8a78f',creamLight='#fff0cd',red='#ad5368',redLight='#d6868f',dark='#3b394a';
 // School ribbons and short pink bunches have their own walking sway.
 for(const [x,side]of [[14,-1],[40,1]]){
  P([[x,18+y],[x+side*6,21+y],[x+side*(7+walk*.3),31],[x+side*4,37],[x,33],[x-side*3,25]],hairShade);
  P([[x,21+y],[x+side*3,22+y],[x+side*(4+walk*.3),30],[x+side*2,33],[x-side,29]],hair);L(x+side*2,23+y,x+side*2,29,hairLight);
 }
 // White socks and loafers distinguish the school outfit from the magical boots.
 for(const [x,d]of [[21,-walk],[31,walk]]){
  R(x+d,54,5,12,'#e6bdac');R(x+d,59,5,9,'#f6eee5');R(x+d,59,5,1,'#bbb2bd');R(x+d+1,61,2,5,'#ffffff');
  P([[x+d,67],[x+d+5,67],[x+d+6,71],[x+d-2,71],[x+d-2,69]],'#68444d');R(x+d-1,68,5,1,'#b17b79');
 }
 // A burgundy plaid skirt uses broad colored checks and a pleated hem.
 P([[21,47],[35,47],[40+walk,57],[36+walk,60],[29,59],[22,61],[16+walk,58]],'#5f3b52');
 P([[22,48],[34,48],[38+walk,56],[34+walk,58],[28,57],[22,59],[18+walk,57]],red);
 for(const xx of [22,28,34])L(xx,50,xx+walk-1,58,'#733d55');
 for(const yy of [51,55]){L(21,yy,35+walk,yy,'#d38b90');L(20,yy+1,36+walk,yy+1,'#76455b');}
 for(const xx of [23,29,35])L(xx,50,xx+walk-1,57,redLight);
 // Cream blouse, dark sailor collar and a red ribbon at the throat.
 P([[19,37+y],[24,35+y],[32,35+y],[37,38+y],[36,47],[33,51],[23,51],[19,47]],creamShade);
 P([[21,38+y],[25,37+y],[31,37+y],[35,39+y],[34,47],[31,49],[23,49],[21,45]],cream);
 L(23,40,23,47,creamLight);L(33,41,33,47,creamShade);R(22,48,12,2,'#dccba8');
 P([[23,36+y],[28,39+y],[33,36+y],[34,39+y],[30,43],[28,41],[25,43],[22,39+y]],dark);L(24,37+y,27,40+y,'#cfc4bd');L(32,37+y,29,40+y,'#cfc4bd');
 P([[27,39+y],[23,40+y],[24,44+y],[28,42+y],[32,44+y],[34,40+y],[30,39+y]],red);R(27,40+y,3,3,redLight);L(28,43+y,27,47,red);L(29,43+y,31,46,red);
 const left=cast?[22,46]:[15,52+walk],right=cast?[43,43]:[40,52-walk];
 for(const [start,end]of [[[19,40+y],left],[[36,40+y],right]]){L(...start,end[0],end[1]-2,creamShade,5);L(start[0]+1,start[1],end[0]+1,end[1]-3,cream,3);R(end[0]-1,end[1]-2,5,2,creamLight);R(end[0],end[1],4,4,SKIN);}
 face(r,'madoka',{y,expression,blink});
 P([[16,30+y],[14,21+y],[17,15+y],[23,11+y],[32,11+y],[38,15+y],[41,22+y],[40,31+y],[37,34+y],[35,25+y],[32,22+y],[29,27+y],[25,23+y],[22,27+y],[19,24+y],[18,33+y]],hairShade);
 P([[17,24+y],[17,19+y],[21,15+y],[26,13+y],[32,13+y],[37,17+y],[39,23+y],[38,27+y],[34,22+y],[31,19+y],[29,24+y],[25,20+y],[22,24+y],[19,20+y]],hair);
 L(21,15+y,31,14+y,hairLight);L(17,20+y,18,24+y,hairLight);L(37,20+y,38,26+y,hairLight);
 for(const [x,sign]of [[15,-1],[40,1]]){P([[x,18+y],[x+sign*5,14+y],[x+sign*5,21+y],[x,22+y],[x-sign*2,19+y]],'#8c3e61');P([[x,18+y],[x+sign*3,16+y],[x+sign*3,20+y],[x,20+y]],redLight);R(x-1,19+y,3,3,red);}
 return outline(r.pixels,INK);
}

function casualEsdeathPixels({frame=0,moving=false,pose='',attack=false,expression='neutral',blink=false,skin='sweater'}={}){
 const r=raster(),{rect:R,poly:P,line:L}=r,walk=moving?[0,2,0,-2][frame]:0,y=moving?-(frame%2):0,cast=attack||pose==='ice',dress=skin==='blackdress';
 const hair=dress?'#b7d3e7':'#a7d4e8',hairShade=dress?'#7894b3':'#628ba8',hairLight='#e1f0f4',black='#30313f',blackShade='#1b2332',blackLight='#545362',cream='#e9e2cd',creamShade='#bcb6ab',creamLight='#fff5dc';
 // Casual styles omit the cap. One has a loose full fall; the other a low ponytail.
 if(dress){
  P([[31,26+y],[39,27+y],[43,38],[48+walk,53],[44+walk,64],[37,61],[37,47],[33,36]],hairShade);
  P([[35,29+y],[39,31+y],[40,40],[45+walk,53],[43+walk,60],[40,55],[40,45]],hair);L(39,35,42+walk,54,hairLight);R(36,31,6,3,blackShade);
  P([[16,21+y],[37,21+y],[39,33],[35,42],[19,41],[14,33]],hairShade);
 }else{
  P([[15,20+y],[39,20+y],[42,37],[47-walk,65],[42-walk,69],[36,60],[33,42],[22,42],[20+walk,62],[13+walk,68],[8+walk,64],[14,38]],hairShade);
  P([[16,25+y],[21,26+y],[20,44],[17+walk,62],[12+walk,65],[15,43]],hair);P([[35,26+y],[39,24+y],[39,42],[44-walk,64],[39-walk,61],[35,45]],hair);
  L(15,34,13+walk,59,hairLight);L(39,33,41-walk,59,hairLight);
 }
 // Opaque dark legwear and practical boots keep the silhouettes compact.
 for(const [x,d]of [[21,-walk],[31,walk]]){
  P([[x,52],[x+5,52],[x+5+d,67],[x+d,69]],blackShade);R(x+d+1,56,3,10,dress?'#434756':'#494551');
  if(!dress){R(x+d,54,5,3,SKIN);R(x+d,57,5,2,'#242d3e');}
  const boot=dress?'#303440':'#79594c';P([[x+d,65],[x+5+d,65],[x+6+d,70],[x+5+d,72],[x-2+d,72],[x-2+d,69]],boot);R(x+d,66,4,1,dress?'#787380':'#b18a69');R(x+d+5,71,1,2,blackShade);
 }
 if(dress){
  P([[20,37+y],[25,35+y],[32,35+y],[37,38+y],[36,45],[34,49],[39+walk,58],[34+walk,60],[28,59],[21,60],[17+walk,58],[22,48],[19,43]],blackShade);
  P([[23,38+y],[31,37+y],[34,40+y],[32,47],[31,50],[35+walk,57],[29,57],[23,58],[21+walk,56],[25,48],[21,42]],black);
  L(25,39,25,44,blackLight);L(32,40,31,46,blackLight);L(24,51,22+walk,57,'#474653');L(33,52,35+walk,57,'#474653');L(23,48,32,48,'#64616d');R(26,48,4,1,'#9f8d8d');
 }else{
  P([[20,47],[35,47],[40+walk,56],[35,59],[28,57],[21,59],[16+walk,56]],blackShade);
  P([[22,48],[33,48],[37+walk,55],[33,57],[28,55],[22,57],[19+walk,55]],black);
  for(const xx of [22,27,32,36])L(xx,50,xx+walk-1,56,blackLight);
  P([[20,37+y],[25,35+y],[32,35+y],[37,38+y],[37,47],[34,51],[22,51],[19,47]],creamShade);
  P([[22,38+y],[25,36+y],[31,36+y],[35,39+y],[35,46],[32,49],[23,49],[21,45]],cream);
  for(const xx of [23,26,29,32])L(xx,41,xx,48,'#d2cbbb');L(22,40,23,47,creamLight);R(22,49,12,2,black);R(23,48,10,1,creamLight);
 }
 // High collar and small dark necktie are carried by the cream reference outfit.
 R(24,35+y,9,4,dress?blackShade:cream);L(25,36+y,31,36+y,dress?blackLight:creamLight);R(25,38+y,7,2,blackShade);
 if(!dress){P([[25,39+y],[28,42+y],[31,39+y]],black);P([[28,41+y],[30,44],[28,47],[26,44]],black);}
 const ends=[[14,52+walk],[cast?44:41,cast?42:52-walk]];
 for(const [i,start]of [[0,[19,40+y]],[1,[36,40+y]]]){
  const [hx,hy]=ends[i],cloth=dress?black:cream;L(...start,hx,hy-2,dress?blackShade:creamShade,5);L(start[0]+1,start[1],hx+1,hy-3,cloth,3);
  if(dress){
   // Narrow sleeve openings are crossed with pale stitches, not bare arms.
   const mx=Math.round((start[0]+hx)/2),my=Math.round((start[1]+hy)/2);L(mx,my-1,hx,hy-5,'#b99792',2);
   for(let j=0;j<3;j++){const xx=Math.round(mx+(hx-mx)*j/3),yy=Math.round(my+(hy-5-my)*j/3);L(xx-1,yy,xx+2,yy+2,'#a4a0ad');L(xx+2,yy,xx-1,yy+2,blackShade);}
  }
  R(hx-1,hy-2,5,2,blackShade);R(hx,hy,4,4,SKIN);
 }
 if(cast){P([[46,40],[49,35],[52,39],[50,44],[47,44]],'#87b9d4');L(49,36,49,42,'#e4faff');R(47,40,2,2,'#bbe4f1');}
 face(r,'esdeath',{y,expression,blink});
 // Long straight bangs are parted close to the brows with no officer cap.
 P([[16,30+y],[14,22+y],[17,15+y],[23,10+y],[32,10+y],[39,15+y],[42,23+y],[40,32+y],[37,36+y],[35,24+y],[32,21+y],[28,27+y],[24,22+y],[20,28+y],[19,35+y]],hairShade);
 P([[17,25+y],[17,20+y],[21,15+y],[26,12+y],[32,12+y],[37,16+y],[39,22+y],[38,28+y],[34,22+y],[31,18+y],[28,24+y],[24,19+y],[21,25+y],[19,30+y]],hair);
 L(21,15+y,25,13+y,hairLight);L(27,13+y,31,14+y,hairLight);L(35,17+y,37,23+y,hairLight);L(18,25+y,18,31+y,hairLight);
 return outline(r.pixels,INK);
}

export function referenceOutfitPixels(id,options={}){
 const frame=((options.frame||0)%4+4)%4,pose={...options,frame};
 if(id==='naruto'&&options.skin==='hokage')return hokagePixels(pose);
 if(id==='madoka'&&options.skin==='school')return schoolMadokaPixels(pose);
 if(id==='esdeath'&&['sweater','blackdress'].includes(options.skin))return casualEsdeathPixels(pose);
 return null;
}
