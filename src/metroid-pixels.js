import {enemyArtFrame,ENEMY_INK} from './enemy-art-kit.js';
export const METROID_PALETTES={greenpirate:['#6ba182','#365c59','#c8d8ad'],redpirate:['#c37583','#713e60','#ecc2ab'],flyingpirate:['#849bbd','#414d73','#d5dce0'],goldpirate:['#c5a665','#75634e','#f6dfaa'],kraid:['#809e70','#415c55','#cfcea0'],motherbrain:['#c88baf','#735576','#eac6c5'],zoomer:['#be9567','#6f6654','#e8c9a0'],ripper:['#ad9a77','#5b625e','#ded5b1'],sidehopper:['#b79167','#6e5c51','#e0be87'],zebesian:['#a37ea5','#514862','#d1b29a'],feralmetroid:['#68af95','#345f65','#c5e3bb'],ridley:['#a17cba','#51456f','#dfb2cc']};
const BONE='#e9d8b7',BONE_SHADE='#ad9a85',EYE='#e9be7d',JOINT='#354652';
export const MOTHER_BRAIN_WALKING_ART={hide:'#a57155',hideShade:'#65483f',hideLight:'#cf9873',rib:'#dab193',ribShade:'#9b7158',bone:'#bac3aa',boneShade:'#74877b',boneLight:'#e1dfbc',brain:'#c5804d',brainShade:'#87503e',brainLight:'#efb76d',eye:'#f5dfb0',iris:'#ab639d',cavity:'#453a3b'};
function claws(a,x,y,side,size=1){const {P,L}=a;P([[x-side*3,y-3],[x+side*3,y-2],[x+side*5,y+3],[x+side*2,y+7],[x-side*2,y+4],[x-side*4,y]],BONE_SHADE);for(const [offset,length]of [[-2,7],[1,10],[4,7]]){const xx=x+side*offset;P([[xx,y+1],[xx+side*2,y+2],[xx+side*3,y+length*size],[xx+side,y+length*size-1],[xx-side,y+4]],BONE);L(xx,y+2,xx+side,y+5,'#f7e9cd');}}
function pirateLegs(a,{base,shade,light,heavy=false,flying=false}){const {P,R,L,leg}=a;for(const [x,side]of [[20,-1],[33,1]]){const step=side*leg,hy=flying?46:48,kx=x+side*(flying?4:2)+step,ky=flying?56:58,fx=flying?x-side*2+step:x+side*3+step;P([[x-3,hy],[x+4,hy-1],[kx+4,ky-1],[kx+2,ky+4],[kx-4,ky+1]],shade);P([[x-1,hy+1],[x+3,hy],[kx+2,ky],[kx-1,ky+1]],base);L(x+1,hy+2,kx,ky-2,light,heavy?2:1);R(kx-3,ky,6,4,JOINT);R(kx-2,ky,4,2,light);P([[kx-2,ky+3],[kx+2,ky+3],[fx+2,68],[fx-2,69]],shade);L(kx,ky+4,fx,67,base,heavy?4:3);P([[fx-3,67],[fx+3,66],[fx+side*7,70],[fx+side*5,72],[fx-3,71]],base);for(let i=0;i<3;i++)P([[fx-2+i*2,69],[fx+i*2,69],[fx+side*4+i*2,72],[fx-2+i*2,72]],BONE);}}
function piratePixels(id,m){
 const a=enemyArtFrame(m),{P,R,L,leg,arm,attack,finish}=a,[base,shade,light]=METROID_PALETTES[id],heavy=id==='goldpirate',flying=id==='flyingpirate',gunner=id==='redpirate',zebes=id==='zebesian',plate=heavy?'#e6c57e':zebes?'#b88ba5':light,under=heavy?'#605c54':zebes?'#8e694f':'#728e7c';
 // Distinct equipment sits behind articulated insect anatomy.
 if(flying){P([[15,27],[22,23],[35,23],[43,28],[44,47],[37,51],[17,49],[12,41]],shade);for(const side of [-1,1]){const x=side<0?13:40,flare=2+Math.abs(leg);P([[x,29],[x+5,29],[x+7,43],[x+5,48],[x-1,47],[x-2,36]],'#4f667e');R(x+1,31,3,10,base);R(x-1,44,7,4,JOINT);P([[x,48],[x+5,48],[x+3,53+flare],[x+1,51+flare]],'#d88a73');P([[x+1,48],[x+4,48],[x+2,52+flare]],'#f0d4a0');const span=6+Math.round(((side<0?m.wingL:m.wingR)||1)*4);P([[x+2,29],[x+side*span,23],[x+side*(span-1),35],[x+2,40]],base);L(x+2,31,x+side*(span-2),28,light);}}
 if(zebes){L(18,46,8,55,shade,5);L(8,55,4,48-leg,base,3);P([[3,49-leg],[2,42-leg],[8,47-leg]],plate);}
 pirateLegs(a,{base,shade,light,heavy,flying});
 const shoulder=heavy?5:gunner?3:zebes?1:0;
 P([[18-shoulder,29],[23,27],[34,27],[40+shoulder,32],[39+shoulder,40],[33,52],[25,55],[17,48],[13-shoulder,37]],shade);P([[19-shoulder,31],[24,29],[33,30],[37+shoulder,33],[36,41],[32,48],[25,51],[19,45],[16-shoulder,37]],base);P([[23,32],[32,32],[35,38],[32,44],[24,45],[20,39]],under);
 for(const yy of [33,37,41]){P([[23,yy],[32,yy],[33,yy+2],[28,yy+3],[23,yy+2]],light);L(25,yy+1,31,yy+1,base);}R(25,46,8,3,shade);L(24,47,33,47,plate);P([[23,49],[29,51],[34,48],[33,54],[28,56],[23,54]],base);
 if(heavy){for(const [x,side]of [[16,-1],[39,1]]){P([[x-side*2,28],[x+side*4,24],[x+side*9,29],[x+side*8,39],[x+side*3,43],[x-side*2,36]],shade);P([[x,28],[x+side*4,26],[x+side*7,30],[x+side*6,36],[x+side*2,39],[x,34]],plate);L(x+side*2,29,x+side*5,31,'#f5e0ac');L(x+side*5,32,x+side*4,36,base);}for(const [x,side]of [[19,-1],[34,1]])P([[x-3,48],[x+3,48],[x+side*3+3,55],[x+side*3,59],[x+side*3-4,56]],plate);}
 for(const [x,side]of [[16,-1],[39,1]]){const reach=arm*side,hy=attack?42:50,hx=Math.max(10,Math.min(gunner&&side===1?43:44,x+side*(heavy?7:6)+reach));L(x,34,x+side*4+reach,43,shade,heavy?7:5);L(x,34,x+side*3+reach,41,base,heavy?5:3);R(x+side*3+reach-2,41,5,4,JOINT);P([[x+side*3+reach-2,42],[x+side*3+reach+3,42],[hx+3,hy],[hx+2,hy+4],[hx-3,hy+3]],base);L(x+side*3+reach,43,hx,hy+1,plate,2);
  if(gunner&&side===1){P([[hx-3,hy-3],[hx+8,hy-3],[hx+10,hy],[hx+8,hy+6],[hx-2,hy+6]],shade);R(hx-1,hy-2,8,6,'#536170');R(hx+2,hy-1,5,2,'#b5b5ad');R(Math.min(52,hx+7),hy-2,3,6,JOINT);R(Math.min(52,hx+8),hy,2,2,attack?'#f3d69c':'#c58e96');}
  else if(flying){R(hx-2,hy,6,6,shade);L(hx-1,hy+1,hx+2,hy+1,light);R(hx-1,hy+5,4,3,'#3c485c');R(hx,hy+7,2,1,attack?'#f2d7ac':'#aeb7c6');}
  else claws(a,hx,hy,side,heavy?.7:1);
 }
 const hx=zebes?-2:heavy?0:1,hy=zebes?2:0;
 P([[19+hx,13+hy],[25+hx,7+hy],[33+hx,8+hy],[38+hx,13+hy],[40+hx,21+hy],[35+hx,29+hy],[29+hx,33+hy],[22+hx,30+hy],[17+hx,23+hy]],shade);P([[21+hx,14+hy],[26+hx,10+hy],[32+hx,11+hy],[36+hx,15+hy],[37+hx,21+hy],[33+hx,27+hy],[29+hx,29+hy],[23+hx,26+hy],[20+hx,21+hy]],base);P([[24+hx,12+hy],[29+hx,9+hy],[33+hx,12+hy],[32+hx,17+hy],[28+hx,19+hy],[24+hx,16+hy]],plate);L(28+hx,11+hy,29+hx,16+hy,'#e8d9bd');
 for(const [x,side]of [[21+hx,-1],[34+hx,1]]){const tipY=heavy?3:8;P([[x,16+hy],[x+side*4,tipY],[x+side*6,tipY-2],[x+side*4,15+hy],[x+side*2,20+hy]],shade);L(x+side*3,tipY+3,x+side*2,16+hy,heavy?plate:base);}
 L(21+hx,21+hy,26+hx,22+hy,ENEMY_INK,2);L(31+hx,22+hy,36+hx,21+hy,ENEMY_INK,2);R(23+hx,22+hy,3,1,heavy?'#ed8c85':'#d6e7aa');R(32+hx,22+hy,3,1,heavy?'#ed8c85':'#d6e7aa');P([[24+hx,25+hy],[28+hx,28+hy],[33+hx,25+hy],[32+hx,31+hy],[28+hx,35+hy],[24+hx,31+hy]],BONE_SHADE);P([[25+hx,26+hy],[28+hx,29+hy],[31+hx,26+hy],[30+hx,31+hy],[28+hx,33+hy],[26+hx,30+hy]],BONE);L(28+hx,28+hy,28+hx,32+hy,shade);
 if(gunner){R(34+hx,16+hy,6,2,JOINT);R(37+hx,16+hy,2,2,'#e7a482');R(17,36,4,7,'#a88b7f');R(18,37,2,4,'#e8c4a8');}return finish();
}
function kraidPixels(m){
 const a=enemyArtFrame(m),{P,R,L,leg,arm,attack,enraged,finish}=a,[base,shade,light]=METROID_PALETTES.kraid;
 L(18,54,8,64,shade,7);L(8,64,4,59-leg,base,4);P([[3,59-leg],[1,50-leg],[8,57-leg]],BONE);for(let i=0;i<6;i++)P([[12,26+i*5],[5-(i%2)*2,21+i*5],[8,36+i*5],[15,35+i*5]],light);
 for(const [x,side]of [[17,-1],[36,1]]){const d=side*leg;P([[x-4,54],[x+5,54],[x+6+d,64],[x+4+d,70],[x-5+d,70],[x-6,62]],shade);P([[x-2,56],[x+3,56],[x+3+d,65],[x+d,68],[x-3+d,65]],base);L(x,57,x+1+d,64,light,2);P([[x-5+d,66],[x+4+d,66],[x+9+d,71],[x+7+d,73],[x-7+d,73]],base);for(let i=0;i<3;i++)P([[x-5+d+i*4,69],[x-3+d+i*4,69],[x+d+i*4,73],[x-5+d+i*4,73]],BONE);}
 P([[16,25],[24,21],[35,24],[43,32],[48,45],[45,57],[37,65],[24,65],[13,58],[8,47],[9,35]],shade);P([[18,27],[24,24],[34,27],[40,34],[44,45],[41,56],[35,61],[24,62],[16,56],[12,46],[13,36]],base);P([[27,29],[35,32],[40,41],[40,51],[35,59],[27,61],[21,55],[19,44],[21,35]],light);P([[28,32],[34,35],[37,42],[37,52],[32,57],[26,57],[23,51],[23,41]],'#ddd5ac');
 for(const yy of [38,46,54]){P([[27,yy-2],[33,yy-2],[36,yy],[34,yy+3],[28,yy+3],[25,yy]],'#a9a980');R(28,yy-1,6,3,shade);R(29,yy,5,2,attack?'#cf936f':'#344c4b');L(28,yy-2,32,yy-2,'#ede0b8');}
 for(const [x,side]of [[14,-1],[41,1]]){const hy=(attack?35:43)+side*arm,hx=x+side*4;L(x,33,hx,hy,shade,7);L(x,33,hx,hy-1,base,5);L(x+1,34,hx+1,hy-1,light);P([[hx-3,hy-1],[hx+4,hy-1],[hx+5,hy+5],[hx-2,hy+6]],base);for(let i=0;i<3;i++)P([[hx-2+i*3,hy+3],[hx+i*3,hy+3],[hx+2+i*3,hy+8],[hx+i*3,hy+7]],BONE);}
 for(const [x,y]of [[15,36],[15,45],[19,56],[39,32],[43,48],[38,57]]){P([[x,y],[x+3,y-1],[x+4,y+2],[x+2,y+4],[x,y+3]],'#60866a');L(x+1,y,x+3,y+1,'#a8bb86');}
 P([[18,25],[17,17],[23,8],[31,7],[37,11],[39,17],[47,19],[52,25],[49,31],[40,34],[32,31],[26,34]],shade);P([[21,24],[21,17],[25,11],[31,10],[35,14],[36,20],[44,22],[48,26],[45,29],[38,30],[31,27],[26,30]],base);P([[22,15],[21,4],[26,8],[28,14]],BONE);P([[31,11],[34,3],[37,9],[36,15]],BONE);L(24,12,24,8,'#f1e4c3');L(30,17,37,18,shade,2);R(32,19,4,2,EYE);R(34,19,1,2,enraged?'#ad5a61':'#6f6250');R(33,19,1,1,'#f6e5b8');R(46,24,2,1,shade);
 const jaw=attack?3:0;P([[34,27],[48,27],[48,29+jaw],[43,33+jaw],[35,31+jaw]],ENEMY_INK);L(35,30+jaw,44,32+jaw,light,2);for(const x of [35,39,43,47])P([[x,27],[x+2,27],[x+1,30]],BONE);if(attack){R(41,30,4,2,'#be7e7b');L(37,32,43,33,BONE);}return finish();
}
function brainHead(a,{y=0,x=0,attack=false,pulse=0}){
 const {P,R,L}=a,[base,shade,light]=METROID_PALETTES.motherbrain;
 P([[15+x,15+y],[19+x,9+y],[26+x,6+y],[35+x,8+y],[42+x,14+y],[44+x,23+y],[40+x,31+y],[33+x,35+y],[23+x,34+y],[16+x,28+y],[13+x,21+y]],shade);P([[18+x,15+y],[22+x,11+y],[28+x,9+y],[35+x,11+y],[39+x,16+y],[41+x,23+y],[37+x,29+y],[31+x,32+y],[24+x,30+y],[19+x,25+y],[16+x,20+y]],base);
 for(const [xx,yy,flip]of [[20,15,1],[26,12,-1],[32,13,1],[37,17,-1],[20,22,1],[26,19,1],[34,22,-1],[25,28,-1],[36,27,1]]){L(xx+x,yy+y,xx+2+x,yy+2+y,light,2);L(xx+2+x,yy+2+y,xx+flip+x,yy+5+y,shade);}
 P([[24+x,24+y],[28+x,20+y],[35+x,20+y],[39+x,24+y],[36+x,29+y],[28+x,30+y],[23+x,27+y]],'#ac6f8d');P([[25+x,24+y],[29+x,22+y],[34+x,22+y],[37+x,25+y],[34+x,28+y],[28+x,28+y]],'#efe2ba');R(29+x,22+y,5,6,attack?'#e3a479':'#be6c85');R(31+x+pulse,23+y,2,5,ENEMY_INK);R(29+x,22+y,2,1,'#fff1d4');L(26+x,27+y,29+x,28+y,'#c1b18f');
}
function motherBrainPixels(m){
 const a=enemyArtFrame(m),{P,R,L,leg,arm,attack,enraged,finish}=a;
 if(!enraged){
  P([[11,56],[44,56],[51,61],[51,69],[45,73],[10,73],[5,69],[5,61]],'#435567');R(10,62,37,7,'#64798b');R(12,64,33,2,'#afbab5');R(9,70,39,2,'#273e50');
  for(const x of [9,42]){L(x,57,x-4,50,'#718980',3);L(x-4,50,x-3,33,'#9db7ab',2);R(x-5,37,5,3,'#4c686e');R(x-5,49,5,3,'#4c686e');}
  P([[11,17],[17,12],[39,12],[46,17],[46,55],[41,59],[16,59],[10,54]],'#6e99a5');P([[14,20],[19,16],[36,16],[43,20],[43,52],[38,56],[18,56],[13,51]],'#344d61');P([[16,22],[21,18],[35,18],[40,22],[40,49],[36,53],[19,53],[16,49]],'#3b6572');L(27,42,31,48,'#ab829e',5);L(31,48,27,55,'#c6a5af',4);L(31,50,37,54,'#8a7a92',2);L(28,49,22,53,'#8a7a92',2);brainHead(a,{y:5,attack,pulse:Math.round((m.wingL??.75)*3)-2});
  L(14,24,14,48,'#b7d2cb',2);R(16,24,1,11,'#e1e8d7');L(43,24,43,48,'#88b3bc');R(41,22,1,6,'#c8ded6');P([[10,14],[17,10],[39,10],[47,15],[45,20],[13,20]],'#8caaa9');L(16,13,39,13,'#d6ded0',2);R(12,17,34,3,'#536e7c');P([[10,55],[45,55],[48,59],[44,63],[12,63],[8,59]],'#8ba39f');R(14,57,29,2,'#c5ceba');R(12,61,32,2,'#4c6371');for(const x of [17,25,33,41]){R(x,65,3,2,'#d1b47c');R(x,68,2,1,'#34454e');}
 }else{
  walkingMotherBrain(a);
 }return finish();
}
function walkingMotherBrain(a){
 const {P,R,L,leg,arm,attack}=a,c=MOTHER_BRAIN_WALKING_ART,step=leg*.75;
 // A low tail counterbalances the hunched thorax. Its silhouette stays behind
 // the two bent, weight-bearing legs rather than reading as a humanoid skirt.
 P([[17,46],[19,52],[15,61],[10,66],[3,69],[2,67],[8,63],[11,56],[11,49]],c.boneShade);
 P([[15,49],[16,53],[12,61],[8,65],[4,66],[10,60],[12,52]],c.bone);
 for(const [x,y]of [[13,54],[11,59],[7,64]])L(x-1,y,x+2,y+1,c.boneLight);
 const legs=[{hip:15,knee:10-step,foot:16-step,top:49,ky:59},{hip:24,knee:33+step,foot:28+step,top:47,ky:57}];
 for(const b of legs){
  P([[b.hip-3,b.top],[b.hip+4,b.top-1],[b.knee+4,b.ky-2],[b.knee+3,b.ky+3],[b.knee-3,b.ky+4],[b.knee-4,b.ky-1]],c.boneShade);
  P([[b.hip-1,b.top+1],[b.hip+2,b.top],[b.knee+2,b.ky],[b.knee,b.ky+2],[b.knee-2,b.ky]],c.bone);
  L(b.hip,b.top+2,b.knee,b.ky-1,c.boneLight,2);R(b.knee-2,b.ky,5,4,c.bone);L(b.knee-2,b.ky+1,b.knee+2,b.ky+1,c.boneLight);R(b.knee,b.ky+3,2,2,c.cavity);
  L(b.knee,b.ky+4,b.foot-2,68,c.boneShade,5);L(b.knee,b.ky+4,b.foot-2,67,c.bone,3);L(b.knee,b.ky+4,b.foot-2,65,c.boneLight);
  P([[b.foot-5,66],[b.foot,66],[b.foot+3,69],[b.foot+10,70],[b.foot+11,72],[b.foot-6,72],[b.foot-8,70]],c.boneShade);
  P([[b.foot-4,67],[b.foot-1,67],[b.foot+2,70],[b.foot+8,70],[b.foot+9,71],[b.foot-5,71]],c.bone);
  for(const off of [0,4,8]){L(b.foot-2+off,69,b.foot+off+2,71,c.boneLight);R(b.foot+off+1,72,2,1,c.boneLight);}
 }
 // Rust-colored hide is pulled over an asymmetrical, deeply recessed rib cage.
 // Each dorsal spike grows out of the back; the front remains open and skeletal.
 for(const [x,y,dx]of [[15,25,-6],[11,30,-6],[9,36,-6],[10,42,-7],[13,48,-6]]){
  P([[x+3,y],[x+dx,y-5],[x+dx+1,y],[x,y+4]],c.hideShade);L(x+dx+1,y-3,x,y+1,c.rib,2);
 }
 P([[15,24],[21,23],[29,29],[33,38],[30,46],[25,52],[18,53],[11,47],[8,38],[10,30]],c.hideShade);
 P([[15,27],[20,26],[26,31],[29,38],[26,46],[22,49],[17,49],[13,43],[11,36],[12,31]],c.hide);
 P([[20,30],[25,31],[29,37],[27,44],[23,48],[18,45],[16,38]],c.cavity);
 L(14,29,13,38,c.hideLight,2);L(13,39,17,47,c.hideLight);L(25,31,28,37,c.ribShade,2);
 const ribs=[[[14,30],[18,30],[23,33],[25,35]],[[12,34],[17,34],[22,37],[26,38]],[[12,38],[17,39],[22,41],[26,41]],[[14,43],[18,44],[22,45],[25,44]],[[17,47],[20,48],[24,47],[26,45]]];
 for(const points of ribs){for(let i=0;i<points.length-1;i++){const p=points[i],q=points[i+1];L(p[0],p[1]+1,q[0],q[1]+1,c.ribShade,2);L(p[0],p[1],q[0],q[1],c.rib,1);}R(points[0][0],points[0][1],2,1,c.hideLight);}
 P([[18,49],[23,47],[29,49],[29,53],[25,56],[20,55],[16,52]],c.boneShade);L(20,50,24,51,c.boneLight,2);L(24,51,27,49,c.bone);L(24,52,23,55,c.bone,2);
 // The high neural neck curves out of the shoulder, then forward into the head.
 P([[22,34],[21,26],[22,18],[26,14],[30,15],[32,20],[30,26],[28,29],[29,34]],c.boneShade);
 P([[24,32],[24,26],[24,20],[26,17],[28,18],[29,22],[27,27],[26,32]],c.bone);
 for(const [x,y,w]of [[24,19,4],[23,23,5],[23,27,5],[24,31,4]]){L(x,y,x+w,y+1,c.boneLight);L(x,y+2,x+w-1,y+2,c.boneShade);}
 L(23,19,23,27,c.boneLight);
 // Small forward-reaching forelimbs have three hooked fingers, never giant
 // symmetrical arms. During a cast they brace against the neck and jaw.
 for(const [sx,sy,offset]of [[27,34,-1],[25,39,2]]){
  const ex=34+offset,ey=attack?32+offset:38+offset,hx=41+offset,hy=(attack?28:34)+Math.round(arm*.3);
  L(sx,sy,ex,ey,c.boneShade,4);L(sx,sy,ex,ey,c.bone,2);R(ex-1,ey,4,3,c.boneShade);L(ex,ey,hx,hy,c.boneShade,3);L(ex,ey,hx,hy,c.boneLight);
  P([[hx-1,hy-2],[hx+3,hy-2],[hx+5,hy],[hx+3,hy+3],[hx,hy+2]],c.bone);
  for(const [off,dy]of [[0,-3],[2,-1],[3,1]]){L(hx+1,hy+off-1,hx+6,hy+dy,c.boneShade);L(hx+5,hy+dy,hx+6,hy+dy+2,c.boneLight);}
 }
 // An exposed folded brain crowns a projecting cyclopean face. The jaw hinges
 // independently for beam recoil, leaving a dark mouth and individual teeth.
 const recoil=attack?-1:0,headY=attack?-1:0;
 const p=(points,color)=>P(points.map(([x,y])=>[x+recoil,y+headY]),color),r=(x,y,w,h,color)=>R(x+recoil,y+headY,w,h,color),l=(x,y,xx,yy,color,w=1)=>L(x+recoil,y+headY,xx+recoil,yy+headY,color,w);
 p([[29,17],[29,10],[32,6],[35,7],[37,3],[41,5],[43,3],[46,6],[49,6],[50,10],[53,13],[53,20],[50,25],[43,28],[35,26],[30,22]],c.brainShade);
 p([[31,16],[31,11],[34,9],[35,10],[38,6],[41,8],[43,6],[46,9],[48,9],[48,13],[51,15],[50,20],[46,23],[38,23],[33,20]],c.brain);
 for(const points of [[[34,11],[33,14],[36,15],[35,18]],[[38,8],[37,12],[40,13],[39,16]],[[42,8],[44,11],[42,14]],[[47,12],[45,14],[48,16]],[[32,18],[35,20],[38,18]],[[40,17],[41,20],[44,19]],[[48,19],[46,21],[48,23]]]){
  for(let i=0;i<points.length-1;i++)l(...points[i],...points[i+1],c.brainShade);r(points[0][0],points[0][1],2,1,c.brainLight);
 }
 p([[41,16],[46,15],[51,17],[53,20],[50,23],[44,23],[40,20]],c.hideShade);
 p([[43,17],[47,17],[51,19],[49,21],[44,21],[42,20]],c.eye);r(46,17,3,5,c.iris);r(47,18,1,4,ENEMY_INK);r(46,17,1,1,'#fff2cf');l(43,16,49,16,c.hideShade,2);
 const jaw=attack?3:0;
 p([[38,23],[44,24],[51,23],[54,25],[52,29+jaw],[45,32+jaw],[38,29+jaw],[35,26]],c.hideShade);
 p([[39,25],[45,26],[52,25],[51,28+jaw],[44,30+jaw],[39,28+jaw]],c.cavity);
 p([[36,27],[40,29+jaw],[45,31+jaw],[51,28+jaw],[51,31+jaw],[45,34+jaw],[39,31+jaw]],c.boneShade);l(39,30+jaw,45,32+jaw,c.boneLight);l(45,32+jaw,49,30+jaw,c.bone);
 for(const [x,y]of [[40,25],[44,26],[48,25],[51,25]])p([[x,y],[x+2,y],[x+1,y+3]],c.boneLight);
 for(const [x,y]of [[42,29],[46,29],[49,28]])p([[x,y+jaw],[x+2,y+jaw],[x+1,y-2+jaw]],c.bone);
 if(attack){r(51,25,2,2,'#f7e9b6');r(49,26,2,1,'#dba0ad');}
}
function metroidBellPixels(m){
 const a=enemyArtFrame(m),{P,R,L,leg,arm,finish}=a,jelly='#74b99b',dark='#396b66',rim='#4f927d',shine='#c8e7be',inner='#5d9d98',red='#be6d81',redLight='#edb3a0';
 for(const [x,side,length]of [[17,-1,18],[29,0,21],[40,1,17]]){const sway=side*arm,by=43+(side===0?2:0);P([[x-3,by],[x+3,by],[x+4+sway,by+8],[x+side*2+sway,by+length],[x-3+sway,by+length-2],[x-2,by+7]],'#658f79');P([[x-1,by+3],[x+2,by+3],[x+2+sway,by+10],[x+sway,by+length-2],[x-2+sway,by+length-4]],BONE);L(x,by+5,x+sway,by+length-5,'#f5e6c2');}
 P([[10,31],[13,22],[21,16],[32,14],[41,19],[47,28],[49,39],[44,47],[36,51],[20,51],[11,46],[7,38]],dark);P([[13,31],[16,24],[22,19],[32,17],[39,22],[44,29],[46,38],[42,44],[35,47],[21,47],[14,43],[10,37]],jelly);P([[17,30],[21,24],[29,21],[37,25],[41,32],[40,41],[34,45],[22,44],[16,39]],inner);
 for(const [x,y]of [[22,30],[32,28],[30,38]]){P([[x-3,y-3],[x+2,y-4],[x+5,y],[x+3,y+5],[x-2,y+5],[x-5,y+1]],'#865d72');P([[x-2,y-2],[x+2,y-2],[x+3,y+1],[x+1,y+3],[x-2,y+2]],red);R(x-1,y-2,2,2,redLight);R(x+2,y+1,1,2,'#d58e92');}L(16,27,14,32,shine,2);L(14,32,14,36,shine);R(21,20,5,2,'#b5dcb5');L(33,19,39,23,'#a0d4ad');L(43,33,44,39,'#95cdb0');P([[10,40],[16,45],[25,47],[35,46],[44,41],[43,47],[36,51],[21,51],[12,47]],rim);L(17,47,25,49,'#92c4a0');L(31,49,38,47,shine);if(m.attack){R(27,44,5,4,'#d1c691');L(23,43,35,43,'#c0d8b0');}else R(28+Math.sign(leg),46,2,2,'#9bbfa0');return finish();
}
function zoomerPixels(m){
 const a=enemyArtFrame(m),{P,R,L,leg,finish}=a,[base,shade,light]=METROID_PALETTES.zoomer;
 for(let i=0;i<4;i++)for(const side of [-1,1]){const x=19+i*6,dx=(i%2?leg:-leg)*.6;L(x,48,x+side*5+dx,55,shade,2);L(x+side*5+dx,55,x+side*3+dx,62,base,2);R(x+side*3+dx-2,61,5,2,light);}
 P([[8,45],[12,35],[19,28],[30,26],[40,30],[47,38],[49,47],[44,54],[15,55],[7,50]],shade);P([[12,43],[16,35],[22,31],[31,29],[39,33],[43,40],[45,47],[40,51],[17,51],[10,48]],base);P([[17,40],[23,34],[32,32],[38,37],[40,44],[36,48],[20,48],[14,45]],'#d1ad7b');
 for(const [x,y,h]of [[12,39,12],[21,32,13],[31,30,16],[40,35,13],[47,42,10]]){P([[x-3,y+1],[x-2,y-h+4],[x+1,y-h],[x+3,y+2]],shade);P([[x-1,y-1],[x,y-h+3],[x+2,y]],light);L(x,y-h+4,x,y-2,'#f1d8ab');}for(const [x,y]of [[18,40],[28,38],[37,42]]){P([[x-2,y],[x,y-2],[x+3,y],[x+1,y+3]],shade);L(x-1,y,x+1,y-1,light);}P([[13,47],[19,44],[26,46],[31,44],[40,46],[44,50],[40,56],[17,56],[12,52]],'#8f7961');for(const x of [16,36]){L(x,48,x+5,48,ENEMY_INK,2);R(x+1,49,3,2,'#c66c75');R(x+1,49,1,1,'#f0ba91');}L(23,53,33,53,shade);R(24,53,2,2,light);R(30,53,2,2,light);return finish();
}
function ripperPixels(m){
 const a=enemyArtFrame(m),{P,R,L,leg,finish}=a,[base,shade,light]=METROID_PALETTES.ripper,left=Math.round(((m.wingL||1)-.7)*8),right=Math.round(((m.wingR||1)-.7)*8);
 P([[15,34],[7,25-left],[3,26-left],[6,40],[13,47]],shade);P([[13,35],[7,29-left],[8,39],[13,42]],'#8a9e8b');P([[36,33],[44,22-right],[49,25-right],[46,42],[40,47]],shade);P([[39,34],[45,27-right],[44,38],[40,42]],'#b5c2a3');P([[7,36],[15,29],[30,27],[42,30],[48,36],[51,43],[47,50],[37,54],[17,54],[8,49],[4,43]],shade);P([[10,37],[17,32],[30,30],[40,33],[46,38],[48,43],[44,48],[35,51],[17,51],[10,47],[7,42]],base);P([[14,35],[21,31],[32,30],[39,33],[35,37],[22,38]],light);
 for(const x of [17,25,33]){L(x,32,x-1,48,shade,2);L(x+2,33,x+1,46,'#ddcda5');P([[x,48],[x+7,48],[x+5,53],[x,52]],'#c2b28b');}P([[7,39],[2,37],[2,44],[8,47],[13,45]],light);L(4,40,9,43,base);P([[40,36],[47,37],[51,42],[47,48],[41,47],[39,42]],'#8c9074');L(41,39,47,39,ENEMY_INK,2);R(43,40,3,2,'#bd795f');R(43,40,1,1,'#e7c38c');L(43,45,48,45,shade);R(44,45,1,2,BONE);R(47,45,1,2,BONE);R(15+Math.sign(leg),49,1,2,'#d8c6a2');return finish();
}
function sidehopperPixels(m){
 const a=enemyArtFrame(m),{P,R,L,leg,arm,attack,finish}=a,[base,shade,light]=METROID_PALETTES.sidehopper;
 P([[18,27],[17,17],[21,6],[24,10],[24,23]],shade);P([[20,23],[21,11],[22,8],[23,22]],light);P([[33,24],[35,9],[39,7],[39,14],[37,28]],shade);P([[35,23],[37,12],[38,10],[37,24]],light);
 for(const [x,side]of [[18,-1],[37,1]]){const kx=x+side*(9+leg*.4),ky=49+leg*side,fx=x-side*3;P([[x-4,35],[x+4,35],[kx+4,ky],[kx+2,ky+5],[kx-4,ky+2]],shade);P([[x-2,37],[x+2,36],[kx+2,ky],[kx-1,ky+2]],base);L(x,39,kx,ky,light,2);P([[kx-3,ky],[kx+3,ky],[kx+4,ky+5],[kx,ky+8],[kx-4,ky+4]],'#d2a477');R(kx-1,ky+2,3,3,shade);L(kx,ky+7,fx,66,shade,5);L(kx,ky+7,fx,64,base,3);L(kx-1,ky+8,fx-1,63,light);P([[fx-3,64],[fx+3,64],[fx+side*9,69],[fx+side*9,72],[fx-4,70]],base);L(fx-2,68,fx+side*7,70,BONE,2);}
 P([[18,24],[25,18],[33,19],[40,27],[40,37],[35,45],[28,49],[20,45],[14,36],[14,28]],shade);P([[21,25],[26,22],[32,22],[36,28],[36,35],[32,42],[27,45],[22,41],[18,34],[18,28]],base);P([[24,24],[29,22],[33,26],[33,35],[29,39],[25,35]],light);L(27,26,28,34,'#e6cda0');for(const [x,side]of [[16,-1],[36,1]]){P([[x,27],[x+5,27],[x+6,31],[x+4,36],[x-1,35],[x-2,31]],'#8d6b58');R(x,29,4,5,'#ba6e6f');L(x+1,29,x+3,29,'#efc59d');R(x+2,31,1,3,ENEMY_INK);const y=attack?39:43;L(x+2,39,x+side*4+arm*side,y+5,shade,3);P([[x+side*4+arm*side-2,y+3],[x+side*4+arm*side+2,y+4],[x+side*3+arm*side,y+9]],BONE);}P([[22,38],[28,40],[34,38],[31,44],[26,46]],shade);L(25,41,30,41,BONE);R(26,42,1,3,BONE);R(30,42,1,2,BONE);return finish();
}
function ridleyPixels(m){
 const a=enemyArtFrame(m),{P,R,L,leg,arm,attack,enraged,finish}=a,[base,shade,light]=METROID_PALETTES.ridley,membrane=enraged?'#a16b8b':'#886181',vein=enraged?'#dba39f':'#bb8ca7';
 for(const side of [-1,1]){const open=Math.round(((side<0?m.wingL:m.wingR)||1)*8),tx=28+side*(16+open*.7),ty=10-Math.round(open*.3);P([[28+side*5,32],[tx,ty],[28+side*26,25],[28+side*24,42],[28+side*19,37],[28+side*14,46],[28+side*8,41]],shade);P([[28+side*7,32],[tx-side*2,ty+5],[28+side*23,26],[28+side*21,36],[28+side*18,32],[28+side*13,40],[28+side*8,37]],membrane);L(28+side*5,34,tx,ty,base,2);L(tx,ty,28+side*25,26,light);L(28+side*7,34,28+side*22,27,vein);L(28+side*7,34,28+side*20,37,vein);L(28+side*6,35,28+side*13,43,base);P([[tx-side,ty+1],[tx+side,ty-4],[tx+side*2,ty+2]],BONE);}
 L(24,49,14,59,shade,5);L(14,59,6,59+leg,base,3);L(6,59+leg,6,49+leg,shade,3);L(6,49+leg,11,45+leg,base,2);P([[9,46+leg],[11,39+leg],[15,44+leg]],BONE);for(let i=0;i<4;i++)R(12+i*3,57-i*2,2,2,light);
 for(const [x,side]of [[23,-1],[34,1]]){const d=side*leg;P([[x-3,46],[x+4,46],[x+side*4+d+3,55],[x+side*4+d,59],[x-3,54]],shade);P([[x-1,48],[x+2,48],[x+side*4+d+1,55],[x+side*4+d-1,57]],base);L(x+side*4+d,56,x+d,66,shade,4);L(x+side*4+d,56,x+d,64,light,2);P([[x-2+d,65],[x+2+d,65],[x+side*6+d,70],[x+side*7+d,72],[x-3+d,71]],base);for(let i=0;i<3;i++)P([[x-2+d+i*2,68],[x+d+i*2,68],[x+side*5+d+i*2,72],[x-2+d+i*2,71]],BONE);}
 P([[23,29],[31,29],[36,35],[38,43],[34,51],[27,55],[21,50],[17,41],[19,34]],shade);P([[24,32],[30,32],[33,37],[34,43],[31,50],[27,51],[23,47],[21,40]],base);P([[25,35],[30,35],[32,40],[31,46],[27,50],[24,44]],'#c6a5ad');for(const yy of [36,40,44]){L(24,yy,30,yy+1,BONE_SHADE);L(26,yy,30,yy,'#e4c7c0');}
 for(const [x,side]of [[21,-1],[34,1]]){const hy=attack?35:45,hx=x+side*6+arm*side;L(x,34,x+side*4,39,base,3);L(x+side*4,39,hx,hy,shade,3);R(hx-2,hy,5,4,base);for(let i=0;i<3;i++)P([[hx-2+i*2,hy+2],[hx+i*2,hy+2],[hx+side*3+i*2,hy+8],[hx-1+i*2,hy+6]],BONE);}
 P([[27,33],[26,26],[29,21],[30,16],[35,16],[36,23],[32,28],[33,34]],shade);P([[29,31],[29,27],[32,22],[33,18],[35,19],[34,24],[31,28],[31,33]],base);L(32,25,33,20,light);P([[29,14],[29,9],[34,5],[39,7],[44,13],[47,18],[53,21],[53,25],[48,28],[40,25],[34,24],[30,20]],shade);P([[31,13],[32,9],[35,8],[39,11],[42,16],[46,20],[50,22],[48,24],[41,22],[36,21],[33,18]],base);P([[34,9],[33,2],[38,6],[40,12]],BONE_SHADE);L(35,5,37,8,BONE);L(35,15,41,16,shade,2);R(37,17,4,2,EYE);R(39,17,1,2,enraged?'#b56376':'#73626c');R(37,17,1,1,'#fae8bd');R(48,21,2,1,shade);
 const gap=attack?4:1;P([[40,23],[51,23],[51,25+gap],[46,29+gap],[38,27+gap]],ENEMY_INK);P([[39,26+gap],[46,28+gap],[51,25+gap],[49,29+gap],[43,32+gap],[38,29+gap]],base);for(const x of [41,45,49])P([[x,23],[x+2,23],[x+1,27]],BONE);if(attack){L(44,29,48,28,'#b47791');P([[43,31],[47,30],[47,28]],BONE);}return finish();
}
export function metroidPixels(id,m={}){if(id==='kraid')return kraidPixels(m);if(id==='motherbrain')return motherBrainPixels(m);if(id==='feralmetroid')return metroidBellPixels(m);if(id==='zoomer')return zoomerPixels(m);if(id==='ripper')return ripperPixels(m);if(id==='sidehopper')return sidehopperPixels(m);if(id==='ridley')return ridleyPixels(m);return piratePixels(id,m);}
