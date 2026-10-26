import {primalDevilPixels} from './primal-devil-art.js';
import {enemyArtFrame,enemyLegs,enemyFace,ENEMY_INK} from './enemy-art-kit.js';

// These bodies use the same native grid, stepped silhouettes and warm ink as
// the rest of the cast. No attack geometry is baked into the sprite frames.
export const DEVIL_PALETTES={
 zombiedevil:['#a2b29c','#5e706b','#dfd8b4'],leechfiend:['#bc939a','#705b78','#ead0ba'],batspawn:['#a38179','#5a495e','#d6b59b'],eternityflesh:['#c6a0a0','#76596d','#efd2bc'],
 katanaman:['#414d5b','#242f42','#c5d2ce'],batdevil:['#9d7a72','#504552','#ddbea3'],eternitydevil:['#b28591','#62485f','#efd0b7'],
 darknessdevil:['#b7b9aa','#272c40','#ece8ce'],hellhand:['#898fa0','#303347','#d2d4c5'],darknessfragment:['#d2d1ba','#41445a','#f0ead0'],
};
const BONE='#ead9bd',BONE_DARK='#9e9a93',BLOOD='#b16f7d',EYE='#e6a693';
const eye=(a,x,y)=>{a.R(x,y,4,2,ENEMY_INK);a.R(x+1,y,2,1,EYE);};
function teeth(a,x,y,width=12,down=true){for(let i=0;i<width;i+=4)a.P([[x+i,y],[x+i+3,y],[x+i+1,y+(down?4:-4)]],BONE);}
function claw(a,x,y,side=1){for(let i=0;i<3;i++)a.L(x+i*3,y,x+i*3+side*3,y+7,BONE,1);}
function blade(a,x,y,angle=0,length=24){
 const dx=Math.cos(angle),dy=Math.sin(angle),nx=-dy,ny=dx;
 a.P([[x-nx*3,y-ny*3],[x+dx*(length-5)-nx*2,y+dy*(length-5)-ny*2],[x+dx*length,y+dy*length],[x+dx*(length-5)+nx*2,y+dy*(length-5)+ny*2],[x+nx*3,y+ny*3]],'#879a9e');
 a.L(x,y,x+dx*(length-2),y+dy*(length-2),'#e7e9d6',1);a.L(x-nx*6,y-ny*6,x+nx*6,y+ny*6,'#bfa888',2);
}
function zombie(m){
 const a=enemyArtFrame(m),{P,R,L,r,leg,arm,attack,finish}=a,[base,shade,light]=DEVIL_PALETTES.zombiedevil;
 enemyLegs(r,{leg,top:48,left:19,right:31,width:7,cloth:'#666b70',shade:'#3a4554',light:'#93938d',boots:'#42454e',bootLight:'#77756e'});
 P([[16,29],[24,27],[34,29],[40,36],[38,51],[32,55],[23,52],[17,56],[13,45]],'#576269');P([[19,30],[25,29],[33,31],[36,38],[33,48],[28,52],[21,48],[17,38]],'#b7b5a5');P([[22,34],[28,36],[31,45],[27,49],[22,44]],shade);L(21,32,22,42,light);R(27,45,3,6,base);
 for(const [x,s]of [[15,-1],[39,1]]){const yy=attack?36:49,hx=x+s*(3+arm);L(x,34,hx,yy,shade,7);L(x,34,hx,yy-1,base,5);R(hx-3,yy-1,6,6,base);claw(a,hx-3,yy+2,s);}
 P([[16,18],[19,10],[29,7],[37,13],[39,22],[35,29],[27,34],[19,29]],shade);P([[20,16],[24,12],[30,11],[35,16],[35,24],[30,29],[23,27],[19,22]],base);P([[18,15],[20,8],[29,6],[35,10],[37,16],[31,14],[27,12],[23,16]],'#42454f');L(23,13,27,11,'#6c6a64');eye(a,20,20);eye(a,30,19);P([[21,25],[32,24],[35,28],[29,32],[23,31]],'#3c3544');teeth(a,23,25,9);L(18,21,20,25,light);R(33,23,2,2,BLOOD);R(23,36,3,2,BLOOD);
 return finish();
}
function leech(m){
 const a=enemyArtFrame(m),{P,R,L,leg,arm,tail,attack,finish}=a,[base,shade,light]=DEVIL_PALETTES.leechfiend;
 P([[23,37],[35,34],[43,44],[46+tail,55],[42+tail,67],[35,72],[23,71],[13,66],[8-tail,58],[13,49]],shade);P([[24,40],[33,39],[38,46],[40+tail,56],[36,66],[27,68],[17,64],[14,58],[18,50]],base);
 for(let i=0;i<5;i++)L(16+i%2,49+i*4,37+i%2,51+i*4,i%2?light:shade,2);
 for(const [x,s]of [[17,-1],[37,1]]){L(x,32,x+s*(7+arm),47,shade,5);L(x+s*(7+arm),47,x+s*(5+arm),55,base,3);claw(a,x+s*(5+arm)-2,55,s);}
 P([[15,16],[21,10],[32,9],[41,16],[43,28],[38,39],[28,44],[16,36],[11,25]],shade);P([[19,17],[25,13],[32,13],[38,18],[38,28],[33,36],[26,38],[19,31],[16,24]],base);
 for(const [x,s]of [[20,-1],[34,1]]){L(x,15,x+s*5,6,shade,4);R(x+s*5-3,3,7,6,base);R(x+s*5-1,4,3,3,EYE);R(x+s*5,4,1,3,ENEMY_INK);}
 P([[20,24],[32,22],[38,27],[36,34],[29,39],[21,35],[17,30]],'#453447');teeth(a,21,25,14);teeth(a,22,35,12,false);R(23,31,9,2,attack?'#dca8a6':'#8e5f72');L(17,20,21,17,light);L(34,17,37,20,light);
 return finish();
}
function bat(m,boss=false){
 const a=enemyArtFrame(m),{P,R,L,leg,arm,attack,enraged,finish}=a,[base,shade,light]=DEVIL_PALETTES[boss?'batdevil':'batspawn'];
 const wing= Math.round(((m.wingL??1)+(m.wingR??1)-2)*4),top=boss?30:35;
 for(const s of [-1,1]){const edge=28+s*(24+wing);P([[28+s*5,top],[edge,13],[edge-s*1,36],[28+s*24,46],[28+s*18,40],[28+s*10,53]],shade);P([[28+s*8,top+2],[edge-s*3,20],[edge-s*4,34],[28+s*21,40],[28+s*16,36],[28+s*10,47]],base);L(28+s*6,top+1,edge-s*3,20,light);L(28+s*8,top+2,28+s*21,40,'#7e5f6c');}
 for(const [x,d]of [[18,-leg],[32,leg]]){L(x,50,x+d,63,shade,boss?7:5);L(x,51,x+d,62,base,3);R(x+d-3,63,7,5,base);claw(a,x+d-3,66,x<25?-1:1);}
 P([[18,27],[24,24],[33,26],[41,34],[40,48],[34,57],[23,58],[15,49],[13,36]],shade);P([[22,29],[27,27],[33,29],[37,36],[35,48],[30,53],[23,50],[18,41]],base);P([[25,32],[31,31],[34,38],[32,46],[27,49],[23,43]],light);L(23,36,33,36,shade);L(24,41,33,41,shade);L(25,46,31,46,shade);
 for(const [x,s]of [[16,-1],[39,1]]){const hy=attack?37:49;L(x,32,x+s*(4+arm),hy,shade,6);L(x,33,x+s*(4+arm),hy-2,base,4);claw(a,x+s*(4+arm)-3,hy,s);}
 P([[18,18],[13,3],[23,10],[33,10],[43,3],[38,22],[39,29],[33,38],[22,37],[15,28]],shade);P([[19,15],[17,8],[24,13],[32,13],[38,9],[35,22],[36,28],[31,33],[24,32],[19,26]],base);P([[17,7],[21,11],[20,17]],light);P([[39,7],[35,11],[36,17]],light);eye(a,19,21);eye(a,30,21);P([[22,24],[32,24],[36,29],[32,35],[24,35],[19,30]],'#342e3f');teeth(a,22,25,11);teeth(a,23,33,9,false);R(26,30,5,2,'#b57983');L(25,21,27,23,light);
 if(boss){R(23,26,2,5,BONE);R(31,26,2,5,BONE);L(20,19,24,20,'#dbc1a7',2);L(30,20,34,19,'#dbc1a7',2);}
 if(boss&&enraged){for(const s of [-1,1]){P([[28+s*10,18],[28+s*15,7],[28+s*15,21]],BONE_DARK);L(28+s*13,12,28+s*13,18,BONE);}R(24,39,7,2,BLOOD);R(21,45,3,2,BLOOD);R(34,46,3,2,BLOOD);}
 return finish();
}
function flesh(m,boss=false){
 const a=enemyArtFrame(m),{P,R,L,leg,arm,tail,attack,enraged,finish}=a,[base,shade,light]=DEVIL_PALETTES[boss?'eternitydevil':'eternityflesh'];
 // Impossible limbs join a single central wall of faces. The miniature body
 // has its own compact silhouette; the boss opens into a tooth-lined doorway.
 for(const [x,s]of [[14,-1],[42,1]]){L(x,35,x+s*(8+arm),43,shade,6);L(x+s*(8+arm),43,x+s*(6+arm),58,base,4);R(x+s*(6+arm)-3,57,6,5,light);claw(a,x+s*(6+arm)-3,61,s);}
 P([[14,20],[20,12],[34,10],[43,20],[46,37],[42,59],[35,68],[20,69],[10,58],[9,38]],shade);P([[17,23],[22,16],[33,15],[39,23],[41,38],[37,57],[31,63],[22,63],[15,55],[14,37]],base);
 for(const [x,y]of [[16,20],[31,18],[11,37],[36,40],[20,55],[31,58]]){P([[x,y],[x+8,y-2],[x+11,y+4],[x+8,y+10],[x+2,y+9],[x-1,y+4]],light);R(x+1,y+3,2,1,shade);R(x+6,y+2,2,1,shade);L(x+3,y+6,x+7,y+6,BLOOD);}
 const mx=attack?8:4;P([[23,26],[32,24],[38,31],[37,47],[30,55],[20,49],[17,38]],'#3b2f46');P([[24,29],[31,28],[34,34],[33,44],[28,48],[23,44],[21,36]],'#6c415b');teeth(a,23,29,10);teeth(a,21,46,13,false);R(26,35,5,8,'#282c41');R(28,36,2,5,attack?'#e9b8ad':'#ad7c8e');
 for(const [x,d]of [[16,-leg],[34,leg]]){L(x,62,x+d,69,shade,5);R(x+d-3,69,9,3,light);}
 if(boss){P([[12,22],[13,10],[23,5],[36,6],[44,14],[44,25],[40,25],[39,16],[33,12],[23,12],[17,17],[17,24]],'#a39a8b');L(16,14,23,8,BONE);L(26,8,35,9,BONE);for(const [x,y]of [[10,28],[41,29]]){R(x,y,7,9,shade);R(x+2,y+2,3,5,light);}if(enraged){L(11,56,17+tail,64,light,3);L(43,54,37-tail,64,light,3);R(24,22,8,2,'#d499a1');teeth(a,18,37,4);teeth(a,33,41,4,false);}}
 return finish();
}
function katana(m){
 const a=enemyArtFrame(m),{P,R,L,r,leg,arm,tail,attack,enraged,finish}=a,[base,shade,light]=DEVIL_PALETTES.katanaman;
 P([[17,30],[24,28],[34,29],[40,35],[42+tail,61],[37,67],[31,57],[21,58],[16-tail,67],[11-tail,62],[13,42]],shade);P([[18,33],[23,32],[23,52],[17-tail,62],[15,57]],base);P([[33,32],[37,34],[38+tail,58],[35+tail,63],[30,51]],base);
 enemyLegs(r,{leg,top:49,left:20,right:31,width:7,cloth:'#58606a',shade,light:'#8e9795',boots:'#242e3c',bootLight:'#63717a'});
 P([[21,31],[28,34],[34,31],[33,48],[23,48]],'#d1cebb');P([[26,34],[29,34],[31,44],[27,48],[25,42]],'#5b4a50');R(21,47,15,4,'#44454f');R(27,47,4,3,'#bdab8c');L(17,38,18,54,'#7b8486');L(37,39,36,55,'#7b8486');
 for(const [x,s]of [[15,-1],[40,1]]){const hx=attack?27+s*9:x+s*(3+arm),hy=attack?39:49;L(x,34,hx,hy,shade,7);L(x,35,hx,hy-1,base,5);R(hx-3,hy-1,6,6,'#738188');blade(a,hx+s*2,hy-1,attack?(s<0?-2.8:-.4):s<0?-2.4:-.75,enraged?33:25);}
 P([[18,15],[21,9],[33,8],[39,14],[40,25],[34,33],[24,34],[18,27]],'#6c7a80');P([[21,15],[24,12],[32,12],[36,16],[36,25],[31,29],[24,29],[21,24]],'#c7d2ca');P([[18,14],[19,8],[25,5],[35,7],[39,13],[40,18],[34,19],[30,16],[21,18]],shade);L(22,9,32,8,'#727e85');R(19,19,20,4,'#3b4556');R(21,20,5,1,'#cb9e89');R(32,20,5,1,'#cb9e89');P([[25,22],[32,21],[37,26],[32,33],[25,32],[21,27]],shade);teeth(a,24,25,12);teeth(a,25,30,10,false);blade(a,28,15,-.06,enraged?30:25);L(23,23,23,27,'#b3c3bd');
 if(enraged){R(21,38,3,7,BLOOD);R(32,40,3,8,BLOOD);L(18,32,22,35,'#b8b9ad');L(35,32,38,35,'#b8b9ad');}
 return finish();
}

function hand(m){
 const a=enemyArtFrame(m),{P,R,L,arm,leg,attack,finish}=a,[base,shade,light]=DEVIL_PALETTES.hellhand;
 const lift=attack?4:0;
 P([[22,47],[34,45],[39,55],[38+leg,66],[32,73],[24,72],[18-leg,65]],shade);P([[25,49],[32,49],[34,58],[31,68],[25,67],[22,59]],base);L(25,54,26,63,light);
 P([[15,37],[17,27],[22,28],[23,16-lift],[28,16-lift],[30,28],[31,12-lift],[36,13-lift],[37,30],[39,20-lift],[44,21-lift],[43,39],[38,48],[29,55],[20,50],[13,44],[9,34],[13,31]],shade);
 P([[18,37],[20,31],[24,34],[25,19-lift],[27,19-lift],[28,35],[33,32],[33,15-lift],[35,16-lift],[35,36],[39,34],[40,24-lift],[42,24-lift],[40,39],[35,46],[28,50],[21,46],[16,41],[13,35],[15,35]],base);
 for(const [x,y]of [[25,24],[33,20],[40,28]])L(x,y-lift,x,y+8-lift,light);L(20,39,28,42,light,2);L(28,42,36,38,light,2);L(25,45,32,45,'#4c5268');R(27,37,4,3,'#d4b0b4');
 return finish();
}
function fragment(m){
 const a=enemyArtFrame(m),{P,R,L,tail,arm,attack,finish}=a,[base,shade,light]=DEVIL_PALETTES.darknessfragment;
 P([[21,37],[33,38],[38,49],[37+tail,63],[33,60],[29,72],[24,64],[16-tail,68],[19,55],[13,58],[17,45]],shade);P([[22,42],[27,42],[26,55],[21-tail,62],[22,51]],'#5c5d70');P([[30,44],[33,44],[34,57],[30,64]],'#5c5d70');
 P([[14,20],[21,10],[34,9],[43,18],[42,32],[35,43],[23,45],[13,36],[10,27]],'#8b9496');P([[17,20],[23,14],[33,13],[38,20],[37,31],[32,38],[24,40],[17,33],[15,26]],base);P([[19,20],[24,16],[32,16],[35,21],[34,29],[30,34],[24,35],[19,29]],light);P([[19,22],[25,20],[33,22],[35,28],[31,32],[23,32],[18,28]],'#353a50');R(21,25,4,2,EYE);R(29,24,4,2,EYE);L(26,29,29,29,'#a1a5a1');L(32,12,29,19,shade,2);L(29,19,34,22,shade,2);L(16,31,22,35,shade,2);
 for(const [x,s]of [[17,-1],[37,1]]){const yy=attack?32:44;L(x,36,x+s*(5+arm),yy,shade,3);R(x+s*(5+arm)-2,yy-2,4,4,light);}
 return finish();
}
export function devilEnemyPixels(id,m={}){
 switch(id){case'zombiedevil':return zombie(m);case'leechfiend':return leech(m);case'batspawn':return bat(m);case'eternityflesh':return flesh(m);case'katanaman':return katana(m);case'batdevil':return bat(m,true);case'eternitydevil':return flesh(m,true);case'darknessdevil':return primalDevilPixels(id,m);case'hellhand':return hand(m);case'darknessfragment':return fragment(m);default:return null;}
}
