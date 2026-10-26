import {enemyArtFrame,enemyLegs,enemyFace,ENEMY_INK} from './enemy-art-kit.js';

// Native proportions, stepped silhouettes and clustered shading match the
// existing cast. Each Apostle's release is an independently drawn body.
export const BERSERK_PALETTES={
 possessedknight:['#9f8d7b','#535260','#d2c1a0'],
 eclipseheretic:['#895263','#453d53','#c8a885'],
 apostlehound:['#99785e','#594c47','#d0ae87'],
 wingedapostle:['#8e6f86','#493e57','#c7a0ac'],
 zodd:['#a47b5b','#4d4142','#d8b28b'],
 grunbeld:['#ab5d63','#593e50','#e1aa85'],
 femto:['#53516d','#292b42','#b7acc5'],
};
const BONE='#e7d3ad',BONE_SHADE='#a99a84',FIRE='#eab878',EYE='#e3a399';
const eye=(a,x,y,color=EYE)=>{a.R(x,y,3,2,ENEMY_INK);a.R(x+1,y,2,1,color);};
function talons(a,x,y,side=1){
 const {P,L}=a;P([[x-3,y-1],[x+3,y-1],[x+4,y+3],[x+1,y+6],[x-4,y+3]],'#62554e');
 for(let i=0;i<3;i++){const xx=x-3+i*3;P([[xx,y+2],[xx+2,y+2],[xx+side*3+1,y+8],[xx+side*2-1,y+6]],BONE);L(xx,y+2,xx+side*2,y+5,'#f2e1bf');}
}
function sword(a,x,y,lift=0){
 const {P,R,L}=a;P([[x-2,y],[x+3,y],[x+7,y-36-lift],[x+4,y-44-lift],[x,y-37-lift]],'#697780');
 P([[x,y-1],[x+2,y-2],[x+5,y-36-lift],[x+4,y-40-lift],[x+2,y-35-lift]],'#d4d9c8');
 L(x-6,y-3,x+7,y-2,'#bba17b',2);L(x,y,x-1,y+8,'#5b494a',3);R(x-2,y+7,4,2,'#c4ad8a');
}
function knightPixels(m){
 const a=enemyArtFrame(m),{P,R,L,r,leg,arm,attack,finish}=a,[base,shade,light]=BERSERK_PALETTES.possessedknight;
 enemyLegs(r,{leg,top:47,left:19,right:31,width:7,cloth:base,shade,light,boots:shade,bootLight:light});
 P([[16,29],[24,27],[34,29],[40,35],[40,48],[35,54],[19,53],[13,44]],shade);P([[19,31],[26,29],[33,31],[36,36],[34,48],[28,51],[21,48],[17,39]],base);
 P([[21,32],[28,35],[34,32],[33,40],[28,45],[22,40]],'#b5a38a');L(28,35,28,44,light);R(20,48,16,4,'#5a424a');R(26,48,5,3,'#bd9c70');
 for(const [x,s]of [[15,-1],[39,1]]){P([[x-s*2,30],[x+s*6,29],[x+s*8,36],[x+s*5,40],[x-s*2,37]],shade);L(x,31,x+s*4,32,light,2);}
 L(16,36,11-arm,48,shade,6);L(16,36,12-arm,47,base,4);R(8-arm,48,7,7,'#95816f');L(38,36,42+arm,attack?40:48,shade,6);L(38,36,42+arm,attack?40:48,base,4);R(40+arm,attack?40:48,6,5,'#95816f');
 P([[8-arm,43],[17-arm,45],[19-arm,54],[14-arm,61],[5-arm,56],[4-arm,47]],shade);P([[9-arm,45],[15-arm,47],[16-arm,53],[13-arm,58],[7-arm,54],[7-arm,49]],'#936b69');L(11-arm,47,12-arm,55,light);L(8-arm,51,15-arm,52,light);
 sword(a,44+arm,attack?42:51,attack?5:0);
 P([[18,25],[17,14],[21,8],[33,8],[39,15],[38,27],[32,32],[24,32]],shade);P([[20,15],[23,11],[32,11],[36,16],[35,26],[30,29],[24,28],[20,24]],base);P([[23,13],[27,10],[30,13],[30,21],[27,25],[24,21]],light);R(18,20,20,4,'#333341');R(21,21,5,1,EYE);R(30,21,5,1,EYE);L(28,22,28,28,shade);R(22,29,12,2,'#857368');
 for(const [x,y]of [[20,15],[33,14],[32,39],[20,43],[22,58]]){R(x,y,2,2,'#876157');R(x+1,y+2,2,1,'#b9876b');}
 return finish();
}
function hereticPixels(m){
 const a=enemyArtFrame(m),{P,R,L,leg,arm,tail,attack,finish}=a,[base,shade,light]=BERSERK_PALETTES.eclipseheretic;
 for(const [x,d]of [[22,-leg],[31,leg]]){R(x+d,63,5,8,'#4b3d47');R(x+d-2,69,8,3,'#6e5660');}
 P([[18,28],[35,28],[39,42],[43+tail,66],[36+tail,70],[29,67],[20,70],[12+tail,65],[16,46]],shade);
 P([[20,31],[25,30],[24,48],[20,65],[15+tail,64],[19,43]],base);P([[29,30],[33,31],[36,46],[39+tail,65],[34+tail,66],[28,51]],base);
 P([[25,33],[29,33],[30,48],[29,63],[25,65],[23,49]],'#b7a087');L(25,36,26,57,'#ded0af');L(21,64,25,60,light);L(32,60,36,65,light);
 L(19,34,12-arm,47,shade,7);L(19,34,13-arm,45,base,5);R(9-arm,46,5,5,'#a58e7b');L(34,35,40+arm,attack?35:44,shade,7);L(34,35,39+arm,attack?35:44,base,5);R(38+arm,attack?34:44,5,5,'#b39a83');
 const sx=47+arm;L(sx,25,sx,70,'#6e5559',3);L(sx,27,sx,68,'#b99a74');P([[sx-6,18],[sx-3,11],[sx+3,11],[sx+6,18],[sx+3,25],[sx-3,25]],'#9c7379');P([[sx-4,18],[sx-2,14],[sx+2,14],[sx+4,18],[sx+2,22],[sx-2,22]],'#e2c8a1');L(sx,15,sx,21,shade);L(sx-3,18,sx+3,18,shade);
 P([[16,30],[13,23],[16,12],[25,5],[34,9],[40,22],[37,32],[32,28],[22,30]],shade);P([[17,23],[19,14],[26,9],[32,12],[36,22],[33,27],[21,28]],base);P([[20,22],[24,16],[29,15],[33,22],[31,30],[25,33],[20,29]],'#393541');P([[23,22],[29,21],[31,25],[27,29],[23,27]],'#6c5a65');R(22,23,3,1,'#d1a595');R(29,23,2,1,'#d1a595');L(24,29,29,29,'#b99a83');L(18,20,22,13,light);L(30,12,35,22,'#aa7782');
 if(attack){R(38+arm,34,6,2,'#e1c590');P([[41+arm,28],[44+arm,31],[42+arm,35],[39+arm,32]],'#e5a5ad');}
 return finish();
}
function houndPixels(m){
 const a=enemyArtFrame(m),{P,R,L,leg,tail,attack,finish}=a,[base,shade,light]=BERSERK_PALETTES.apostlehound;
 L(42,43,50,38+tail,shade,6);L(50,38+tail,52,27+tail,base,3);P([[51,30+tail],[48,25+tail],[54,25+tail]],BONE_SHADE);
 for(const [x,d]of [[10,-leg],[32,leg]]){P([[x,46],[x+7,45],[x+9+d,58],[x+5+d,64],[x+d,61]],shade);P([[x+2,48],[x+5,48],[x+6+d,57],[x+3+d,60]],base);P([[x+d,59],[x+6+d,60],[x+9+d,68],[x-3+d,68],[x-4+d,65]],base);for(let i=0;i<3;i++)P([[x-2+d+i*3,65],[x+d+i*3,65],[x+2+d+i*3,70],[x-1+d+i*3,68]],BONE);}
 P([[7,35],[16,28],[33,30],[44,39],[46,49],[37,57],[22,57],[10,51],[5,43]],shade);P([[10,36],[18,31],[31,33],[39,40],[41,48],[35,53],[23,53],[13,48],[9,42]],base);
 for(const [x,y]of [[17,34],[24,35],[31,37],[37,40]]){P([[x-3,y],[x,y-11],[x+4,y+3]],shade);L(x,y-7,x+1,y,light);}
 P([[14,34],[21,31],[27,36],[27,44],[20,48],[12,45]],light);L(29,43,36,45,'#c19872');L(28,47,36,49,'#6d5849');
 P([[7,24],[12,18],[23,18],[30,25],[31,36],[24,44],[13,43],[5,36],[3,29]],shade);P([[8,26],[14,21],[22,21],[26,27],[27,35],[22,39],[14,39],[8,34]],base);P([[8,26],[6,13],[14,21]],base);P([[23,21],[30,12],[28,29]],base);L(8,19,10,25,light);L(26,18,25,25,light);
 P([[11,28],[17,25],[23,28],[25,35],[21,40],[12,39],[8,34]],BONE_SHADE);L(9,29,14,29,shade,2);L(20,29,25,28,shade,2);R(11,30,3,1,EYE);R(21,29,3,1,EYE);P([[14,33],[21,32],[25,35],[23,38],[16,39],[12,36]],BONE);R(17,33,5,2,shade);
 const gap=attack?5:1;P([[11,37],[23,37],[24,40+gap],[20,44+gap],[12,42+gap]],ENEMY_INK);L(12,41+gap,20,43+gap,light,2);for(const xx of [13,17,21])P([[xx,37],[xx+2,37],[xx+1,41]],BONE);if(attack)R(16,43,5,2,'#a56b74');
 return finish();
}
function wingedPixels(m){
 const a=enemyArtFrame(m),{P,R,L,leg,arm,attack,finish}=a,[base,shade,light]=BERSERK_PALETTES.wingedapostle;
 for(const side of [-1,1]){const spread=Math.round((side<0?m.wingL??1:m.wingR??1)*4),edge=side<0?2-spread:53+spread;
  P([[28+side*5,34],[edge,10],[edge+side*2,31],[28+side*22,43],[28+side*16,39],[28+side*9,49]],shade);
  P([[28+side*6,33],[edge-side*2,16],[edge-side*3,29],[28+side*20,38],[28+side*15,35],[28+side*9,44]],base);L(28+side*6,33,edge-side*2,16,light);L(28+side*6,33,28+side*20,38,'#b48a9f');
 }
 for(const [x,d]of [[20,-leg],[31,leg]]){L(x,48,x+2+d,60,shade,5);L(x+2+d,60,x-1+d,67,base,3);talons(a,x+d,65,x<25?-1:1);}
 P([[20,27],[30,25],[37,33],[36,47],[31,53],[23,52],[17,44],[17,34]],shade);P([[23,28],[29,28],[33,34],[32,45],[28,49],[23,46],[21,37]],base);P([[25,30],[29,30],[31,38],[28,43],[25,39]],light);for(const yy of [35,39,43])L(23,yy,30,yy+1,'#5e4c61');
 for(const [x,s]of [[18,-1],[35,1]]){const hy=attack?37:48,hx=x+s*(5+arm);L(x,32,x+s*6,39,shade,4);L(x+s*6,39,hx,hy,base,3);talons(a,hx,hy,s);}
 P([[20,15],[24,9],[31,9],[36,15],[35,24],[29,30],[23,28],[18,22]],shade);P([[22,16],[25,12],[30,12],[33,17],[32,24],[28,27],[24,25],[21,21]],base);P([[21,17],[18,3],[25,11]],BONE_SHADE);P([[30,11],[36,3],[35,20]],BONE_SHADE);L(20,8,23,14,BONE);L(34,8,33,15,BONE);eye(a,22,18);eye(a,29,18);P([[24,22],[30,22],[32,26],[28,31],[23,26]],ENEMY_INK);R(25,23,1,3,BONE);R(29,23,1,3,BONE);L(24,28,29,29,light);
 return finish();
}
function zoddHuman(m){
 const a=enemyArtFrame(m),{P,R,L,r,leg,arm,tail,attack,finish}=a,[base,shade,light]=BERSERK_PALETTES.zodd;
 P([[13,26],[21,23],[36,25],[44,36],[47+tail,64],[40+tail,67],[33,55],[20,57],[10+tail,68],[6+tail,62],[9,39]],'#37323b');P([[13,30],[18,28],[16,52],[10+tail,63],[9,57]],'#524545');
 enemyLegs(r,{leg,top:49,left:16,right:31,width:9,cloth:'#67554b',shade:'#413b3d',light:'#ac8d6a',boots:'#453b39',bootLight:'#80654e'});
 P([[14,28],[23,25],[33,26],[42,32],[45,44],[40,53],[30,56],[19,52],[10,42]],shade);P([[16,30],[23,28],[32,28],[39,33],[41,43],[36,49],[29,52],[21,48],[14,40]],base);P([[19,31],[26,31],[28,36],[23,39],[17,36]],light);P([[30,31],[36,32],[39,37],[33,40],[29,36]],light);L(28,33,28,44,shade);L(21,42,26,43,shade);L(31,43,36,42,shade);L(23,46,27,47,light);L(30,47,34,46,light);
 R(16,48,24,5,'#4e3c3f');R(24,48,8,5,'#bc9b70');R(26,49,4,3,'#5c4b48');
 for(const [x,s]of [[13,-1],[41,1]]){const hy=attack?39:50,hx=x+s*(3+arm);L(x,32,x+s*4,41,shade,8);L(x,32,x+s*3,40,base,6);L(x+s*3,40,hx,hy,base,5);R(hx-3,hy,7,6,base);L(hx-2,hy,hx+2,hy,light);}
 const sy=attack?37:51;P([[42+arm,sy],[48+arm,sy],[54,sy-28],[50,sy-39],[45,sy-32]],'#76817e');P([[44+arm,sy-2],[47+arm,sy-2],[51,sy-29],[49,sy-35],[47,sy-29]],'#d1d2b8');L(40+arm,sy-3,52,sy-2,'#c3a175',2);L(44+arm,sy+1,42+arm,sy+8,'#4b393b',3);
 P([[15,24],[13,16],[17,8],[24,4],[34,6],[41,15],[39,27],[35,34],[22,34]],'#352f37');P([[20,15],[24,10],[31,10],[35,15],[35,24],[31,29],[25,29],[20,24]],base);P([[18,17],[20,10],[26,6],[33,8],[37,14],[34,17],[30,13],[26,15],[23,13],[21,19]],'#302d35');L(24,9,29,8,'#67524c');eye(a,21,20,'#dbd2a1');eye(a,30,20,'#dbd2a1');L(25,19,28,20,shade);L(24,25,32,25,'#44323a');R(25,26,6,1,BONE);P([[19,24],[23,27],[28,29],[33,26],[37,24],[35,32],[29,36],[22,32]],'#44353a');L(22,28,26,31,'#6c4e44');L(31,30,34,27,'#6c4e44');
 return finish();
}
function zoddBeast(m){
 const a=enemyArtFrame(m),{P,R,L,leg,arm,tail,attack,finish}=a,[base,shade,light]=BERSERK_PALETTES.zodd;
 for(const side of [-1,1]){const spread=Math.round((side<0?m.wingL??1:m.wingR??1)*3);P([[28+side*8,33],[28+side*(23+spread),12],[28+side*25,34],[28+side*24,48],[28+side*17,42],[28+side*12,49]],'#382f3b');P([[28+side*9,33],[28+side*22,18],[28+side*22,34],[28+side*21,41],[28+side*16,37],[28+side*12,44]],'#695152');L(28+side*8,33,28+side*22,17,'#9b7661');L(28+side*9,34,28+side*21,40,'#9b7661');}
 L(38,51,49,57+tail,'#4e3e3d',6);L(49,57+tail,52,48+tail,base,3);
 for(const [x,d]of [[14,-leg],[34,leg]]){P([[x-3,49],[x+7,49],[x+9+d,62],[x+5+d,69],[x-4+d,67]],shade);P([[x,51],[x+5,51],[x+5+d,61],[x+2+d,66]],base);P([[x-4+d,64],[x+5+d,65],[x+9+d,72],[x-7+d,72],[x-7+d,69]],'#574940');for(let i=0;i<3;i++)P([[x-4+d+i*4,68],[x-1+d+i*4,69],[x+d+i*4,73],[x-4+d+i*4,72]],BONE);}
 P([[12,27],[22,23],[35,23],[45,30],[48,42],[44,55],[35,61],[22,59],[10,51],[7,39]],'#483839');P([[14,29],[23,26],[34,26],[42,32],[43,43],[39,52],[33,56],[23,54],[14,48],[11,39]],base);P([[18,30],[25,29],[28,35],[24,40],[16,37]],light);P([[30,29],[37,31],[41,37],[33,40],[28,35]],light);L(28,32,28,47,shade,2);for(const yy of [43,47,51]){L(21,yy,26,yy+1,'#77513e');L(31,yy+1,36,yy,'#77513e');}
 for(const [x,s]of [[10,-1],[44,1]]){const hy=attack?39:49,hx=x+s*(2+arm);L(x,32,x+s*3,42,shade,9);L(x,32,x+s*2,41,base,6);L(x+s*2,42,hx,hy,base,5);talons(a,hx,hy,s);}
 P([[14,16],[18,8],[28,4],[39,9],[44,19],[42,30],[36,36],[19,34],[11,27]],'#3b3037');P([[18,16],[21,10],[28,8],[36,12],[39,20],[37,29],[31,33],[23,30],[17,24]],'#755744');
 for(const [x,s]of [[18,-1],[36,1]]){P([[x,16],[x+s*6,10],[x+s*7,3],[x+s*4,1],[x+s*3,7],[x-s*1,10],[x-s*3,18]],BONE_SHADE);L(x+s*4,4,x+s*3,9,BONE,2);}
 P([[18,18],[23,15],[27,18],[25,21],[19,21]],'#392c35');P([[29,18],[34,15],[39,18],[38,21],[31,21]],'#392c35');eye(a,20,20,'#e3bd88');eye(a,32,20,'#e3bd88');P([[23,23],[32,23],[36,27],[32,31],[23,31],[20,27]],base);R(25,24,6,2,'#392b32');
 const gap=attack?5:1;P([[20,29],[35,29],[35,34+gap],[29,37+gap],[20,34+gap]],ENEMY_INK);L(21,34+gap,29,36+gap,light,2);for(const xx of [21,26,31])P([[xx,29],[xx+2,29],[xx+1,34]],BONE);P([[18,28],[15,31],[17,37],[21,39],[21,33]],'#3b3037');P([[37,27],[40,31],[39,38],[34,40],[34,33]],'#3b3037');
 return finish();
}
function grunbeldKnight(m){
 const a=enemyArtFrame(m),{P,R,L,r,leg,arm,attack,finish}=a,[base,shade,light]=BERSERK_PALETTES.grunbeld;
 enemyLegs(r,{leg,top:47,left:15,right:32,width:9,cloth:base,shade,light,boots:shade,bootLight:light});
 P([[12,27],[22,24],[35,25],[45,33],[45,47],[39,56],[17,55],[8,43]],shade);P([[15,29],[23,27],[34,28],[40,34],[39,47],[33,52],[21,50],[13,41]],base);P([[21,29],[28,34],[35,29],[36,40],[29,48],[21,40]],light);P([[24,32],[28,36],[33,32],[32,39],[28,43],[24,38]],'#bc7980');L(28,36,28,44,'#f0c29c');
 for(const [x,s]of [[12,-1],[43,1]]){P([[x-s*2,26],[x+s*7,23],[x+s*10,32],[x+s*7,39],[x-s*3,35]],shade);P([[x,27],[x+s*5,26],[x+s*7,32],[x+s*4,35],[x,32]],base);L(x,27,x+s*5,29,light,2);P([[x+s*4,25],[x+s*5,17],[x+s*8,28]],light);}
 L(12,35,8-arm,47,shade,7);L(12,35,9-arm,45,base,5);L(43,35,46+arm,attack?38:47,shade,7);R(43+arm,attack?37:46,7,6,base);
 P([[3,40],[14,38],[20,45],[18,59],[11,66],[2,58]],shade);P([[5,42],[13,41],[17,46],[15,57],[11,62],[5,56]],base);P([[9,43],[13,47],[12,57],[9,58],[7,53]],light);L(5,49,16,49,'#d7a17e');
 const hx=48+arm,hy=attack?31:44;L(hx,hy,hx-3,63,'#6d565a',3);P([[hx-7,hy-9],[hx+5,hy-8],[hx+7,hy-3],[hx+5,hy+5],[hx-7,hy+4],[hx-10,hy-2]],shade);R(hx-6,hy-6,10,8,base);L(hx-6,hy-6,hx+3,hy-5,light);R(hx-8,hy-3,3,7,'#c68f80');
 P([[17,22],[15,13],[20,5],[28,2],[37,7],[41,16],[37,28],[29,33],[20,29]],shade);P([[20,13],[24,7],[29,5],[35,10],[37,17],[34,26],[29,29],[23,26]],base);P([[25,9],[29,6],[33,10],[32,18],[28,23],[25,18]],light);P([[17,18],[25,20],[28,23],[35,19],[39,17],[35,25],[29,29],[23,26]],'#39323e');R(21,21,5,1,'#e6c391');R(31,21,5,1,'#e6c391');L(28,12,28,21,'#8c4a59');L(24,28,33,27,'#cf9e87');
 return finish();
}
function grunbeldDragon(m){
 const a=enemyArtFrame(m),{P,R,L,leg,tail,attack,finish}=a,[base,shade,light]=BERSERK_PALETTES.grunbeld;
 for(const side of [-1,1]){const tip=side<0?2:54,wing=Math.round((side<0?m.wingL??1:m.wingR??1)*4);P([[28+side*6,34],[tip,5+wing],[tip,31],[28+side*22,43],[28+side*15,38],[28+side*9,48]],shade);P([[28+side*7,34],[tip-side*3,13+wing],[tip-side*3,28],[28+side*20,37],[28+side*14,33],[28+side*10,42]],'#a4606c');L(28+side*7,33,tip-side*3,12+wing,'#e5b6a0');L(28+side*8,34,28+side*20,37,'#d2908a');}
 L(39,49,49,57+tail,shade,7);L(49,57+tail,52,49+tail,base,4);P([[50,52+tail],[47,44+tail],[54,45+tail]],light);
 for(const [x,d]of [[14,-leg],[34,leg]]){P([[x-3,47],[x+7,47],[x+8+d,60],[x+4+d,65],[x-4+d,63]],shade);P([[x,49],[x+5,49],[x+4+d,58],[x+d,61]],base);P([[x-4+d,61],[x+5+d,61],[x+10+d,70],[x-7+d,70]],base);L(x-2+d,64,x+3+d,65,light);for(let i=0;i<3;i++)P([[x-3+d+i*4,67],[x+d+i*4,67],[x+1+d+i*4,72],[x-3+d+i*4,70]],'#d3b29d');}
 P([[15,26],[26,22],[36,26],[44,38],[44,49],[37,58],[21,57],[11,47],[9,36]],shade);P([[17,28],[26,25],[34,29],[40,38],[39,48],[34,54],[23,52],[15,44],[13,35]],base);
 for(const [x,y,s]of [[18,30,-1],[31,29,1],[20,39,-1],[33,39,1],[25,47,0]]){P([[x,y],[x+5,y-2],[x+9,y+5],[x+4,y+10],[x-2,y+5]],'#bc7b80');P([[x,y],[x+4,y-1],[x+5,y+5],[x+1,y+4]],light);L(x+5,y+1,x+7,y+5,'#774555');}
 P([[17,17],[21,9],[28,5],[36,11],[39,19],[45,24],[47,30],[41,37],[31,38],[23,33],[15,28]],shade);P([[20,18],[24,12],[29,9],[34,14],[35,22],[42,26],[43,30],[38,33],[31,34],[25,30],[18,26]],base);P([[22,16],[28,10],[33,15],[31,22],[24,24]],light);P([[26,25],[35,23],[43,27],[43,31],[36,34],[28,31]],'#c48686');R(34,26,3,1,'#633c4c');R(40,28,2,1,'#633c4c');L(19,21,25,22,shade,2);L(29,20,35,19,shade,2);eye(a,21,23,'#f1d79b');eye(a,31,21,'#f1d79b');
 for(const [x,s]of [[21,-1],[33,1]]){P([[x,15],[x+s*4,6],[x+s*6,2],[x+s*5,12],[x+s*2,20]],'#c9a3a0');L(x+s*3,8,x+s*2,15,'#edd4bc');}
 const gap=attack?6:1;P([[28,32],[43,30],[42,35+gap],[35,39+gap],[27,36+gap]],ENEMY_INK);L(29,36+gap,36,38+gap,light,2);for(const x of [30,35,40])P([[x,32],[x+2,32],[x+1,36]],BONE);if(attack){R(33,37,8,4,FIRE);R(36,36,5,3,'#f9e4b1');}
 for(const [x,y]of [[16,31],[12,40],[39,39],[37,49]])P([[x-2,y],[x,y-10],[x+4,y+3]],light);
 return finish();
}
function femtoPixels(m){
 const a=enemyArtFrame(m),{P,R,L,leg,arm,tail,attack,enraged,finish}=a,[base,shade,light]=BERSERK_PALETTES.femto;
 if(enraged){
  // Expanded falcon wings and a broken violet halo mark the God Hand release.
  for(const side of [-1,1]){const flap=Math.round((side<0?m.wingL??1:m.wingR??1)*3);P([[28+side*6,30],[28+side*23,9+flap],[28+side*26,12],[28+side*24,31],[28+side*25,50],[28+side*18,46],[28+side*19,61],[28+side*11,51],[28+side*6,56]],shade);P([[28+side*7,31],[28+side*22,14+flap],[28+side*21,31],[28+side*22,44],[28+side*16,39],[28+side*16,51],[28+side*10,43]],'#655775');L(28+side*8,33,28+side*21,17+flap,'#8f799d');L(28+side*9,34,28+side*19,40,'#8f799d');}
  for(const [x,y,w]of [[15,7,5],[22,4,5],[31,4,5],[39,8,4]]){R(x,y,w,1,'#ab91b6');R(x+1,y+1,w-1,1,'#635578');}
 }
 P([[17,27],[36,27],[42,41],[47+tail,65],[39+tail,70],[33,61],[27,67],[19+tail,71],[8+tail,66],[14,45]],shade);P([[17,31],[22,32],[20,48],[15+tail,65],[11+tail,64]],'#4b435f');P([[35,31],[38,36],[40,49],[43+tail,65],[39+tail,66],[34,53]],'#4b435f');L(17+tail,64,20,48,'#706079');L(36,50,40+tail,63,'#706079');
 for(const [x,d]of [[21,-leg],[30,leg]]){P([[x,48],[x+6,48],[x+6+d,62],[x+5+d,69],[x-1+d,70],[x+d,61]],shade);L(x+1,52,x+2+d,65,'#7e748e');R(x+d-2,69,9,3,shade);L(x+d-1,69,x+d+5,69,'#9c90aa');}
 P([[18,29],[25,27],[32,28],[37,33],[36,44],[31,51],[23,50],[18,43],[16,35]],shade);P([[20,31],[26,30],[32,31],[34,35],[32,44],[28,48],[22,44],[19,36]],base);P([[23,31],[28,35],[33,31],[31,40],[28,44],[24,40]],'#7c7088');L(28,35,28,43,light);for(const yy of [43,47])L(22,yy,33,yy,'#8e809a');
 for(const [x,s]of [[18,-1],[36,1]]){const hy=attack?34:49,hx=x+s*(7+arm);L(x,33,x+s*4,42,shade,5);L(x+s*4,42,hx,hy,base,3);P([[hx-2,hy],[hx+3,hy],[hx+3+s*2,hy+4],[hx-2+s*2,hy+5]],shade);for(let i=0;i<3;i++)L(hx-1+i*2,hy+3,hx+s*2-1+i*2,hy+7,'#b7a9bd');}
 // Falcon helmet: swept brow, pointed crest, downward beak and pale chin.
 P([[17,20],[17,12],[22,6],[28,3],[34,7],[39,14],[38,24],[33,30],[24,31],[18,26]],shade);P([[20,14],[23,9],[28,6],[33,10],[36,16],[34,23],[30,27],[24,27],[20,23]],base);P([[24,9],[28,6],[31,9],[30,17],[28,21],[26,16]],'#80768e');P([[18,17],[24,19],[28,23],[32,19],[38,16],[36,23],[31,26],[28,32],[25,26],[20,23]],shade);L(20,20,25,22,'#c6b6c6');L(31,22,36,19,'#c6b6c6');R(22,22,3,1,'#ccb0d0');R(32,21,3,1,'#ccb0d0');P([[25,26],[28,29],[31,26],[31,30],[28,33],[25,30]],'#e1c9bd');L(27,30,29,30,'#8e7b8f');
 if(attack){const x=46+arm,y=33;P([[x-4,y],[x,y-4],[x+4,y],[x,y+4]],'#a58bb7');P([[x-2,y],[x,y-2],[x+2,y],[x,y+2]],'#e3ccdf');R(x-7,y,2,1,'#8d79a3');R(x+5,y,2,1,'#8d79a3');}
 if(enraged){R(27,36,2,6,'#ccb4d5');R(24,39,8,1,'#ccb4d5');}
 return finish();
}
export function berserkEnemyPixels(id,m={}){
 if(id==='possessedknight')return knightPixels(m);
 if(id==='eclipseheretic')return hereticPixels(m);
 if(id==='apostlehound')return houndPixels(m);
 if(id==='wingedapostle')return wingedPixels(m);
 if(id==='zodd')return m.enraged?zoddBeast(m):zoddHuman(m);
 if(id==='grunbeld')return m.enraged?grunbeldDragon(m):grunbeldKnight(m);
 if(id==='femto')return femtoPixels(m);
 return null;
}
