import {enemyArtFrame,enemyFace,enemyLegs,enemyTorso,enemyArms,ENEMY_SKIN} from './enemy-art-kit.js';

// New silhouettes use the same restrained ink, anatomy and cloth clusters as
// Aura and Bertholdt. Monsters retain their own anatomy rather than a doll base.
export function redesignedAnimePixels(id,m={}){
 const {r,R,P,L,leg,arm,tail,head,attack,enraged,ink,finish}=enemyArtFrame(m);
 if(id==='flyhead'){
  const flesh='#8da77d',dark='#4d665a',light='#c6d2a5',membrane='#b4c5b9';
  for(const side of [-1,1]){
   const span=Math.min(11,Math.max(3,Math.round(12*(side<0?m.wingL??1:m.wingR??1))));
   P([[28+side*10,33],[28+side*(15+span),18],[28+side*(18+span*.6),26],[28+side*14,41]],'#637e79');
   P([[28+side*11,34],[28+side*(14+span),21],[28+side*(16+span*.6),27],[28+side*14,37]],membrane);
   L(28+side*12,34,28+side*(14+span),24,'#e0dec3');
   for(let j=0;j<3;j++){const y=45+j*4;L(28+side*11,y,28+side*(18+leg),y+7,dark,2);L(28+side*(18+leg),y+7,28+side*(20+leg),y+11,light);}
  }
  P([[15,29],[22,24],[33,24],[40,29],[43,39],[39,50],[32,55],[21,53],[13,45],[12,36]],dark);
  P([[17,30],[23,26],[33,27],[38,31],[40,39],[36,49],[29,52],[21,49],[16,42],[15,35]],flesh);
  P([[17,32],[22,28],[28,28],[24,34],[18,38]],light);L(30,28,37,33,'#a9bc91');
  for(const [x,y,s]of [[18,35,5],[30,33,6],[24,44,5]]){P([[x-1,y],[x+2,y-2],[x+s,y],[x+s,y+4],[x+1,y+5]],dark);R(x,y,s-1,3,'#dfc899');R(x+head*.4+2,y,1,3,'#774f60');R(x+1,y,1,1,'#f5e4c4');}
  L(24,51,28,attack?61:57,dark,2);L(28,attack?61:57,32,54,light);R(17,44,3,1,dark);R(35,43,3,2,light);if(attack){R(25,45,3,3,'#e1ac9a');R(26,46,1,2,'#83556c');}return finish();
 }
 if(id==='dagon'){
  const red='#c37e78',dark='#7d515d',light='#e4af94',belly='#d6a88f';
  for(let i=0;i<5;i++){const x=13+i*7,s=Math.round(Math.sin(i+(m.tail||0))*3);L(x,50,x+s,61,dark,5);L(x+s,61,x+s+(i<2?-5:5),68,red,4);R(x+s+(i<2?-5:4),67,4,2,light);}
  P([[18,31],[37,31],[43,41],[41,51],[35,58],[20,57],[13,49],[13,40]],dark);
  P([[19,33],[35,33],[39,40],[38,49],[33,54],[21,53],[17,47],[16,39]],red);
  P([[23,39],[34,39],[37,48],[32,53],[23,51],[20,45]],belly);L(24,45,33,46,light);
  for(const side of [-1,1]){const yy=attack?38:46;L(28+side*11,36,28+side*(18+arm),yy,red,5);L(28+side*(18+arm),yy,28+side*22,yy+5,dark,3);R(28+side*22-1,yy+3,3,4,light);}
  P([[16,17],[21,10],[31,8],[38,13],[42,23],[38,34],[32,40],[22,37],[15,29],[13,22]],dark);
  P([[18,18],[23,12],[31,11],[36,15],[39,22],[35,31],[29,36],[23,33],[18,27],[16,22]],red);
  P([[20,18],[24,14],[30,13],[33,16],[28,17],[24,22]],light);
  L(19,23,24,22,ink);L(31,22,36,23,ink);R(21,23,2,2,'#e9d7aa');R(32,23,2,2,'#e9d7aa');
  for(let i=0;i<4;i++){const x=21+i*4,sw=Math.round(Math.sin(i+(m.tail||0))*2)+(attack?(i<2?-2:2):0);L(x,29,x+sw,39,light,2);L(x+sw,39,x+sw+(i<2?-3:3),attack?44:42,red,2);}
  P([[14,35],[9,32],[11,27],[15,31]],'#a26c83');P([[39,32],[45,28],[47,35],[42,40]],'#a26c83');return finish();
 }
 if(id==='jogo'){
  const face='#c5c2a6',stone='#918c7b',shade='#62695e',robe='#9ca58a';
  enemyLegs(r,{leg,top:53,left:20,right:31,width:6,cloth:'#515d5d',shade:'#34444c',light:'#788682',boots:'#383d46'});
  L(18,36,12-arm,49,stone,5);L(12-arm,49,14-arm,55,face,3);L(37,36,43+arm,attack?41:50,stone,5);R(41+arm,attack?40:50,5,5,face);
  P([[18,31],[35,31],[41,42],[42,55],[35,59],[29,56],[21,60],[14,55],[15,42]],shade);
  P([[20,32],[34,32],[37,41],[38,53],[33,56],[28,53],[21,57],[18,53],[18,41]],robe);
  for(const [x,y]of [[21,39],[30,36],[32,47],[21,51]])P([[x,y],[x+4,y-1],[x+5,y+3],[x+1,y+4]],'#505c52');L(20,36,19,47,'#c5c7a5');L(33,40,35,50,'#788673');
  P([[17,17],[22,11],[33,11],[39,18],[39,26],[35,33],[28,36],[20,32],[16,25]],shade);
  P([[19,18],[23,13],[32,14],[36,19],[36,26],[32,31],[27,33],[22,29],[19,24]],face);
  R(14,21,5,6,stone);R(37,21,5,6,stone);R(13,22,3,4,shade);R(40,22,3,4,shade);
  P([[16,18],[17,12],[22,9],[22,4],[30,2],[35,7],[36,12],[40,16],[39,20],[17,20]],stone);
  P([[20,15],[23,11],[24,6],[30,5],[32,9],[32,13],[36,16],[35,18],[20,18]],'#b4aa8d');R(23,4,10,3,'#4b494c');R(25,5,6,1,attack?'#f3c17f':'#d99262');
  P([[23,23],[26,20],[31,21],[34,24],[32,28],[26,29],[23,27]],ink);R(25,23,7,4,'#e3bc85');R(28,23,2,4,'#895b51');R(26,23,1,1,'#fff0c4');L(24,31,30,31,'#5e5b56');
  if(attack){P([[25,3],[24,0],[28,2],[29,0],[32,3]],'#e3a26d');}return finish();
 }
 if(id==='hanami'){
  const bone='#ded8bf',shade='#8a9783',light='#f1e7cf',wood='#556d60';
  enemyLegs(r,{leg,top:48,left:19,right:32,width:7,cloth:'#697e67',shade:'#40594e',light:'#9ea98a',boots:'#4c6055',bootLight:'#7c8c70'});
  for(const side of [-1,1]){const x=28+side*11,hand=attack&&side>0?40:47;L(x,32,x+side*(5+arm),hand,shade,7);L(x-1,33,x+side*(4+arm),hand-2,bone,5);R(x+side*(4+arm)-2,hand,7,7,bone);L(x+side*(3+arm),hand-4,x+side*(4+arm),hand+2,wood);}
  P([[18,31],[24,28],[34,29],[40,34],[38,44],[34,53],[20,53],[15,43]],shade);P([[20,32],[25,30],[33,31],[36,35],[34,44],[32,50],[22,49],[19,42]],bone);
  for(const yy of [36,42,47]){L(21,yy,26,yy+2,wood,2);L(32,yy,28,yy+2,wood,2);}L(27,33,28,48,'#a6ac94');L(19,47,22,54,wood,2);
  P([[18,12],[24,8],[32,9],[38,15],[37,24],[32,30],[24,31],[18,26],[16,19]],shade);P([[21,13],[25,10],[31,11],[35,16],[34,24],[30,28],[24,28],[20,24],[19,18]],bone);
  L(23,17,23,24,wood,3);L(31,16,31,23,wood,3);L(25,26,30,26,wood);L(26,13,27,24,light);
  for(const side of [-1,1]){const x=28+side*5;L(x,19,x+side*3,10,wood,3);L(x+side*3,10,x+side*8,5,wood,2);L(x+side*4,11,x+side*4,3,shade,2);L(x+side*7,6,x+side*10,7,shade);}
  // A layered rose grows from one shoulder rather than a flat colored patch.
  for(const [x,y,c]of [[39,31,'#865a70'],[44,33,'#bd8291'],[40,37,'#d5a3a5'],[36,35,'#a16d82']])P([[x-3,y],[x,y-3],[x+4,y-1],[x+3,y+3],[x-1,y+4]],c);
  R(39,33,4,3,'#e6c6b8');R(40,33,2,2,'#d6c287');L(15,53,12-tail,63,wood,2);L(12-tail,63,8-tail,66,shade);return finish();
 }
 if(id==='angelspawn'||id==='sachiel'){
  const boss=id==='sachiel',body='#344b4b',dark='#263c42',edge='#60766d',ivory='#e5dcc0',boneShade='#a4a98e';
  // The Angel's shoulder blades, long forearms and reverse-tapered calves are not human clothing.
  for(const [x,d]of [[boss?18:21,-leg],[boss?32:31,leg]]){P([[x,48],[x+7,48],[x+8+d,58],[x+6+d,68],[x-1+d,70],[x-3+d,67],[x+d,59]],dark);L(x+2,51,x+3+d,62,body,4);P([[x-2+d,66],[x+5+d,66],[x+8+d,71],[x-4+d,71]],body);L(x+d,68,x+4+d,68,edge);}
  for(const side of [-1,1]){const x=28+side*(boss?12:9),reach=side*(arm+4),hand=attack?47:59;P([[x-3,29],[x+3,29],[x+5+reach*.5,41],[x+3+reach,hand],[x-2+reach,hand+4],[x-5+reach,hand+1],[x-2+reach*.5,42]],dark);L(x,32,x+reach*.5,42,body,4);L(x+reach*.5,43,x+reach,hand-1,edge,2);R(x+reach-2,hand,5,5,ivory);}
  P([[19,28],[25,25],[32,25],[38,29],[42,38],[36,48],[34,54],[21,54],[19,47],[14,38]],dark);P([[22,29],[27,28],[32,28],[36,32],[36,41],[31,48],[24,47],[20,39]],body);L(20,34,23,41,edge);L(35,34,33,41,edge);
  P([[24,37],[28,34],[33,38],[33,44],[28,48],[23,44]],'#773f56');P([[25,38],[28,36],[31,39],[30,44],[27,46],[25,43]],'#bd6370');R(27,38,2,3,'#edaa8e');R(28,38,1,1,'#fbe0b1');L(22,49,26,52,ivory);L(33,49,30,52,ivory);
  if(boss){for(const side of [-1,1]){P([[28+side*9,30],[28+side*21,24],[28+side*20,36],[28+side*12,40]],boneShade);P([[28+side*11,31],[28+side*18,27],[28+side*17,34],[28+side*12,37]],ivory);}R(20,55,5,2,ivory);R(32,55,5,2,ivory);}
  P([[20,10],[25,7],[32,8],[37,13],[36,22],[32,26],[30,33],[26,33],[24,26],[20,23],[17,17]],boneShade);
  P([[22,11],[26,9],[31,10],[34,14],[34,20],[30,24],[29,31],[27,31],[26,24],[22,21],[20,16]],ivory);L(24,11,30,11,'#f4edd2');
  P([[21,16],[25,15],[26,20],[22,21]],dark);P([[30,15],[34,16],[33,21],[29,20]],dark);L(27,21,28,27,boneShade);
  if(enraged){P([[19,14],[15,10],[17,20],[23,24],[23,19]],ivory);P([[35,14],[41,10],[39,20],[33,24],[33,19]],ivory);R(26,20,4,4,'#774b5d');R(27,20,2,2,'#dc9b8b');L(22,32,25,37,ivory);L(34,32,31,37,ivory);}
  return finish();
 }
 // The remaining humanoids share only skeletal proportions; their clothes,
 // hands, hair, face markings and silhouette are drawn for each character.
 if(id==='transfigured'){
  const skin='#c6a5ad',shade='#866f83',light='#e4c5bd';
  enemyLegs(r,{leg,top:50,left:21,right:32,width:6,cloth:'#62576b',shade:'#3e3c51',light:'#8d7b8a',boots:'#504452'});
  P([[19,32],[24,29],[33,31],[37,38],[33,48],[37,55],[27,57],[19,51],[15,40]],shade);P([[21,33],[25,31],[31,33],[33,40],[29,47],[32,53],[25,53],[20,47],[18,39]],skin);L(22,36,24,44,light,2);L(28,36,29,48,shade);
  const hand=attack?44:56;L(18,34,9-arm,49,skin,6);L(9-arm,49,7-arm,62,shade,4);R(5-arm,61,6,6,skin);L(35,36,43+arm,attack?36:43,skin,7);L(43+arm,attack?36:43,45+arm,hand,skin,6);P([[41+arm,hand-2],[49+arm,hand-2],[51+arm,hand+6],[47+arm,hand+10],[41+arm,hand+6]],shade);R(43+arm,hand-1,5,6,light);
  enemyFace(r,{x:27+head,y:1,tone:skin,shade,light,eye:'#b69a74'});P([[17,22],[14,16],[18,10],[24,8],[28,11],[34,10],[39,17],[36,23],[32,20],[28,22],[22,17],[19,24]],'#625965');L(20,12,24,10,'#96818b');
  R(19+head,22,7,5,ink);R(21+head,23,3,2,'#e7cc9e');R(32+head,23,2,1,ink);P([[22,28],[30,29],[33,33],[25,35],[21,32]],'#70505b');R(24,30,5,2,'#edcfb5');L(19,37,23,40,shade);L(24,42,27,44,shade);return finish();
 }
 if(id==='demonsoldier'){
  const metal='#7e7893',shade='#46475e',light='#b5a3b4',flesh='#cfacb8';
  enemyLegs(r,{leg,cloth:'#65596d',shade:'#383c4e',light:'#9a869a',boots:shade,bootLight:'#8c8093'});enemyArms(r,{arm,attack,base:metal,shade,light,hands:flesh,width:5});
  enemyTorso(r,{base:metal,shade,light,wide:1});P([[20,34],[26,32],[33,33],[37,38],[34,43],[22,43],[18,39]],'#aaa0af');L(22,36,32,36,'#d0c1c5');R(21,44,14,3,shade);R(20,49,16,3,'#9b7c8b');R(26,49,4,2,'#d2b485');
  enemyFace(r,{tone:flesh,shade:'#947487',light:'#e9c7cc',eye:'#a95c7c',narrow:true});P([[17,22],[15,15],[20,9],[32,9],[39,16],[37,23],[34,19],[31,15],[26,19],[22,16],[20,24]],'#413d4e');
  for(const side of [-1,1]){P([[28+side*7,12],[28+side*14,3],[28+side*15,9],[28+side*10,17]],shade);L(28+side*10,12,28+side*13,6,light);}
  const yy=attack?37:51;L(42+arm,yy+3,48+arm,yy-17,'#788992',3);L(43+arm,yy+1,49+arm,yy-19,'#dce3d9');L(39+arm,yy-1,47+arm,yy+1,'#c9ad79',2);R(41+arm,yy+2,3,6,'#5a4353');return finish();
 }
 if(id==='spiderdemon'){
  const white='#ede4dc',shade='#b7a9b7',light='#fff0df',red='#ad6378';
  for(const side of [-1,1])for(let i=0;i<3;i++){const yy=39+i*8,a=leg*(i%2?-1:1);L(28+side*9,yy,28+side*(19+a),yy-6,'#857786',2);L(28+side*(19+a),yy-6,28+side*23,yy+7,white);}
  enemyLegs(r,{leg,cloth:'#d6c7ca',shade:'#9c8b9e',light:white,boots:'#b8a7b5',bootLight:white});enemyArms(r,{arm,attack,base:white,shade,light,hands:'#efe0cf'});
  P([[20,31],[34,31],[38,39],[37,51],[32,56],[26,53],[19,55],[17,43]],shade);P([[21,32],[32,32],[35,39],[34,50],[29,53],[21,51],[20,42]],white);
  L(24,33,29,40,red);L(32,34,26,42,red);R(20,46,16,3,'#b47b89');L(29,49,28,54,red,2);L(22,38,21,45,light);
  enemyFace(r,{tone:'#f0dfd1',shade:'#c8a8ac',light:'#fff0df',eye:'#a85a79'});
  P([[16,25],[13,18],[17,10],[23,7],[33,8],[40,14],[42,24],[38,32],[35,25],[34,18],[31,22],[28,16],[24,20],[22,17],[19,27],[18,31]],shade);
  P([[16,22],[16,15],[22,10],[28,9],[35,11],[38,16],[39,24],[35,21],[33,14],[30,18],[27,12],[23,16],[20,13],[18,23]],white);L(23,10,21,14,light);L(33,11,36,16,light);
  for(const [x,y]of [[19,23],[20,26],[23,27],[34,25],[36,22],[33,28]])R(x,y,1,2,red);R(22,22,1,1,red);R(31,22,1,1,red);return finish();
 }
 if(id==='zombie'){
  const flesh='#a3ad8d',shade='#687565',light='#d1ceb0',cloth='#78877f';
  enemyLegs(r,{leg,top:48,left:20,right:31,cloth:'#65645c',shade:'#414c4b',light:'#999184',boots:'#49494b',bootLight:'#776d67'});
  enemyArms(r,{arm,attack,base:cloth,shade:'#4e665e',light:'#a3b09a',hands:flesh});P([[18,32],[24,29],[33,31],[38,37],[36,50],[32,53],[27,50],[23,54],[18,49],[16,39]],'#4e665e');P([[20,33],[25,31],[32,33],[35,39],[33,49],[28,47],[22,51],[20,45]],cloth);P([[20,38],[24,39],[23,44],[19,42]],flesh);P([[29,44],[34,42],[33,48],[29,48]],'#9d6f73');L(24,34,28,40,'#b7bda6');R(22,47,3,2,shade);
  enemyFace(r,{x:28+head,y:1,tone:flesh,shade,light,eye:'#c6a77b'});P([[17,22],[15,17],[20,11],[25,10],[30,12],[35,11],[39,18],[36,23],[33,20],[29,22],[25,17],[21,19],[19,25]],'#4c5a50');L(20,14,23,12,'#778374');
  P([[20+head,23],[25+head,23],[24+head,27],[20+head,27]],'#6f6962');R(22+head,24,2,1,'#ddc398');R(31+head,23,2,2,'#d3bd8b');L(32+head,25,34+head,28,'#92666d');R(25+head,29,7,3,'#54504e');R(26+head,29,2,1,light);L(21,35,25,38,'#9a7476');return finish();
 }
 if(id==='mahito'){
  const skin='#d8d0c1',skinShade='#a99a9c',hair='#8da6b8',hairShade='#53677f',hairLight='#bcc3c5',vest='#404759';
  // Loose tied hair and the enlarged shoulder/forearm of Instant Spirit Body.
  P([[16,21],[14,29],[14+tail,46],[18+tail,51],[21,39],[21,24]],hairShade);P([[35,19],[40,27],[41-tail,45],[36-tail,50],[33,35]],hairShade);
  enemyLegs(r,{leg,cloth:'#3d455c',shade:'#29323f',light:'#727989',boots:'#292f3b',bootLight:'#555c6e'});
  enemyArms(r,{arm,attack,base:skin,shade:skinShade,light:'#eee0cd',hands:skin,width:enraged?6:4});
  enemyTorso(r,{base:vest,shade:'#2c3446',light:'#777c89',wide:enraged?2:0});P([[19,35],[25,33],[29,38],[25,44],[20,43]],'#b6b6ab');P([[30,33],[36,36],[35,45],[30,45]],'#7d8791');R(24,45,8,5,'#a5a599');
  for(const yy of [36,41,46,50]){L(27,yy,30,yy+1,'#252f40');R(28,yy-1,1,3,'#d4c6b5');}
  if(enraged){for(const side of [-1,1]){P([[28+side*8,32],[28+side*17,29],[28+side*20,39],[28+side*15,47],[28+side*10,42]],'#495260');L(28+side*13,33,28+side*17,39,'#9d9e9b');}P([[38+arm,44],[46+arm,42],[49+arm,50],[43+arm,56],[38+arm,52]],'#59616a');L(41+arm,46,45+arm,51,'#c1b7a4',2);}
  enemyFace(r,{tone:skin,shade:skinShade,light:'#eee0cd',eye:'#6a909f',narrow:enraged});R(31,22,1,2,'#b3a173');
  P([[16,25],[14,18],[18,10],[24,7],[32,8],[39,13],[41,25],[37,31],[35,23],[32,17],[29,21],[25,16],[22,22],[20,19],[19,32],[16,34]],hairShade);
  P([[17,21],[18,14],[24,10],[31,10],[36,14],[38,22],[35,20],[32,13],[28,18],[24,13],[21,19],[18,24]],hair);L(22,12,21,16,hairLight);L(31,11,35,15,hairLight);L(16,28,17+tail,43,hair);
  L(20,26,25,28,'#796b78');L(31,25,35,28,'#796b78');for(const x of [21,24,32,34])R(x,26,1,3,'#564f61');L(25,30,30,30,'#796b78');R(27,29,1,3,'#564f61');return finish();
 }
 if(id==='akaza'){
  const flesh='#e4c0a7',shade='#b5878c',light='#f4ddbf',blue='#4e638b',pink='#bd7c9b',pinkShade='#7b567a';
  // Wide tied trousers and bare ankles give the martial artist a grounded stance.
  for(const [x,d]of [[17,-leg],[32,leg]]){P([[x,48],[x+8,48],[x+10+d,58],[x+7+d,66],[x+d,66],[x-2+d,58]],pinkShade);P([[x+1,49],[x+7,49],[x+7+d,57],[x+5+d,63],[x+d,62]],pink);L(x+3,51,x+2+d,59,'#dba8b5');R(x+d,63,6,5,flesh);R(x+d-3,68,11,3,flesh);R(x+d-2,69,8,1,light);L(x+d,65,x+d+5,65,blue);}
  P([[20,30],[26,28],[32,29],[37,32],[36,46],[33,53],[22,53],[18,44]],shade);P([[22,31],[27,29],[32,31],[34,35],[33,47],[29,51],[23,48],[21,40]],flesh);
  P([[19,30],[23,29],[25,34],[22,45],[18,43],[16,34]],'#eee8d6');P([[33,29],[37,31],[40,37],[36,44],[32,41],[32,34]],'#eee8d6');L(19,33,20,40,'#b9b3ae');L(36,33,36,40,'#b9b3ae');
  const leftX=10-arm,rightX=42+arm,leftY=attack?35:45,rightY=attack?33:42;
  L(19,33,leftX+2,leftY,flesh,6);L(leftX+2,leftY,leftX,leftY+8,flesh,5);R(leftX-2,leftY+7,7,6,flesh);L(36,33,rightX,rightY,flesh,6);R(rightX-1,rightY-1,7,7,flesh);
  for(const yy of [34,39,44]){L(23,yy,27,yy+2,blue,2);L(32,yy,28,yy+2,blue,2);}L(27,31,27,48,blue);R(21,49,14,3,'#ded6bf');R(26,50,4,4,'#c39996');
  for(const [x,y]of [[leftX,leftY+3],[rightX,rightY+1]]){L(x-1,y,x+4,y,blue,2);L(x-1,y+4,x+4,y+4,blue,2);}
  enemyFace(r,{tone:flesh,shade,light,eye:enraged?'#e6bb6f':'#d0a96d',narrow:true});
  P([[17,20],[15,14],[18,12],[18,7],[23,9],[26,4],[30,9],[35,6],[36,11],[41,12],[38,21],[34,18],[31,14],[27,17],[23,14],[20,21]],pinkShade);
  P([[18,17],[18,13],[21,11],[21,9],[25,12],[27,7],[30,12],[34,9],[35,13],[38,14],[36,18],[31,12],[27,15],[23,12],[21,18]],pink);L(23,10,25,12,'#e0a9bb');L(30,9,33,12,'#e0a9bb');
  for(const x of [21,24,31,34])L(x,18,x,26,blue);L(23,26,26,28,blue);L(33,26,30,28,blue);L(26,20,29,20,blue);L(27,23,27,26,blue);R(24,31,8,2,blue);
  if(enraged){L(19,31,21,35,'#e6c390');L(37,31,35,35,'#e6c390');for(const [x,y]of [[leftX-2,leftY+6],[rightX+2,rightY-2]]){P([[x,y-3],[x+5,y-2],[x+6,y+3],[x+2,y+5],[x-2,y+2]],'#61749d');R(x+1,y,3,2,'#adc5d2');}}
  return finish();
 }
 return finish();
}
