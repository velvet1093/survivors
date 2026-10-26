import {enemyArtFrame,enemyLegs,ENEMY_INK} from './enemy-art-kit.js';

// Original native bodies: cool bone, desaturated grave cloth and warm ink keep
// this cemetery cast in the same stepped pixel language as the other worlds.
export const GRAVEYARD_PALETTES={
 gravezombie:['#97a993','#53676b','#d8d5b5'],coffincrawler:['#8b746b','#484956','#dac9ad'],
 lanternwisp:['#94c8b7','#466e78','#dcead0'],shadowstitch:['#89919b','#48495d','#bcb8b0'],
 hollowghost:['#dbdfd0','#8dabb0','#f0efdc'],paradehollow:['#e1dcd8','#a194b2','#f5e9db'],
 tombsentinel:['#67796e','#354650','#c8c7a5'],ryuma:['#c9d4c8','#475b69','#eee5cb'],
 moriah:['#a984b6','#433b57','#d4b2c6'],peronaparade:['#dd9db6','#54374f','#f4d4d5'],
 ainztomb:['#b5a27b','#37374f','#ead9a9'],
};
const BONE='#e4dcc0',BS='#a6aa98',BL='#f2ebd2',GOLD='#c7a66c',GL='#eed6a0',VIOLET='#9781b6',SOUL='#b8e1c8',RED='#ce7e96';
function skull(a,x=28,y=16,size=1,eyes=SOUL){
 const p=(points,color)=>a.P(points.map(([xx,yy])=>[x+xx*size,y+yy*size]),color);
 p([[-9,-8],[-4,-12],[4,-12],[9,-7],[9,2],[5,7],[4,12],[-4,12],[-6,6],[-9,2]],BS);
 p([[-7,-7],[-3,-10],[3,-10],[7,-6],[6,2],[3,6],[3,10],[-3,10],[-4,5],[-7,1]],BONE);
 a.L(x-4*size,y-7*size,x+1*size,y-8*size,BL,Math.max(1,size));
 for(const side of [-1,1]){p([[side*2,-3],[side*6,-4],[side*6,0],[side*2,1]],ENEMY_INK);a.R(x+side*4*size,y-2*size,size,size,eyes);}
 p([[0,1],[-2,5],[2,5]],ENEMY_INK);a.L(x-3*size,y+7*size,x+3*size,y+7*size,ENEMY_INK);
 for(const i of [-2,0,2])a.L(x+i*size,y+6*size,x+i*size,y+9*size,BS);
}
function stitches(a,x,y,n=4,vertical=false,color='#d2c2ad'){
 const len=(n-1)*3;a.L(x,y,x+(vertical?0:len),y+(vertical?len:0),'#3d3d4f');
 for(let i=0;i<n;i++)a.L(x+(vertical?-1:i*3),y+(vertical?i*3:-1),x+(vertical?1:i*3+1),y+(vertical?i*3+1:1),color);
}
function bandages(a,x,y,w,h){for(let i=0;i<h;i+=4){a.L(x,y+i,x+w,y+i+2,BS);a.L(x+1,y+i+1,x+w-1,y+i+3,BONE);}}
function katana(a,x,y,raised=false,shadow=false){
 const dx=raised?-32:8,dy=raised?-17:-43,color=shadow?'#555169':'#4b5962';
 a.L(x,y,x+dx,y+dy,color,3);a.L(x,y-1,x+dx,y+dy-1,shadow?'#c3b4d7':'#e8e9d6');
 a.L(x-4,y-2,x+4,y+2,GOLD,2);a.L(x,y,x-dx*.13,y-dy*.13,'#6b4f5a',3);a.R(x-1-dx*.13,y-1-dy*.13,3,2,BONE);
}
function zombie(m){
 const a=enemyArtFrame(m),{P,R,L,r,leg,arm,attack,finish}=a,[base,shade,light]=GRAVEYARD_PALETTES.gravezombie;
 enemyLegs(r,{leg,top:48,left:18,right:31,width:7,cloth:'#687179',shade:'#424c5c',light:'#929b95',boots:'#494b55',bootLight:'#82867c'});
 P([[16,29],[24,28],[34,31],[39,37],[37,50],[33,56],[27,52],[20,56],[14,48],[12,37]],'#555e69');
 P([[19,30],[25,31],[31,30],[35,36],[33,47],[28,49],[22,46],[17,38]],'#a6a596');P([[25,34],[29,35],[30,46],[26,48],[22,44]],shade);L(23,34,24,43,light);
 for(const [x,s]of [[15,-1],[38,1]]){const hy=attack?36:49,hx=x+s*(3+arm);L(x,35,hx,hy,shade,6);L(x,35,hx,hy-1,base,4);R(hx-2,hy,5,5,base);for(let i=0;i<3;i++)L(hx-2+i*2,hy+3,hx-2+i*2+s,hy+7,light);}
 P([[16,15],[21,8],[31,8],[38,15],[39,24],[34,31],[26,34],[18,28]],shade);P([[20,15],[24,11],[31,12],[35,17],[34,25],[29,30],[22,27],[19,22]],base);
 P([[17,15],[18,8],[27,5],[34,8],[37,15],[31,13],[25,14],[22,18]],'#5b514f');R(20,20,5,3,ENEMY_INK);R(30,19,5,3,ENEMY_INK);R(22,20,2,1,SOUL);R(31,19,2,1,SOUL);P([[23,25],[33,24],[34,28],[29,31],[22,29]],ENEMY_INK);R(24,26,2,2,BONE);R(29,25,2,2,BONE);stitches(a,17,18,3,true);stitches(a,30,36,4,true);R(33,15,3,3,light);
 return finish();
}
function coffin(m){
 const a=enemyArtFrame(m),{P,R,L,leg,arm,attack,finish}=a,[base,shade,light]=GRAVEYARD_PALETTES.coffincrawler;
 for(const [x,s]of [[17,-1],[38,1]]){L(x,48,x+s*(8+arm),58,shade,5);L(x+s*(8+arm),58,x+s*(7+arm+leg),68,BS,3);for(let i=0;i<3;i++)L(x+s*(7+arm+leg)+i-2,67,x+s*(9+arm+leg)+i-2,72,BONE);}
 P([[14,19],[20,12],[36,12],[43,20],[41,57],[35,66],[20,65],[12,56]],shade);P([[16,20],[21,15],[34,15],[39,21],[37,55],[32,61],[22,60],[16,54]],base);L(19,22,20,50,light);L(36,24,35,52,'#b49c82');
 P([[20,23],[25,19],[33,21],[36,27],[35,45],[31,51],[23,50],[19,43]],'#303847');
 skull(a,28,31,attack?1.05:.9);L(23,43,32,43,BS,2);L(24,47,32,48,BONE);R(17,53,22,4,'#645451');R(21,54,14,1,'#c1a17d');R(25,57,5,3,GOLD);
 for(const [x,y]of [[17,21],[38,21],[18,51],[36,51]])R(x,y,2,2,'#d3ba94');
 return finish();
}
function wisp(m){
 const a=enemyArtFrame(m),{P,R,L,tail,arm,attack,finish}=a,[base,shade,light]=GRAVEYARD_PALETTES.lanternwisp;
 P([[25,44],[34,43],[39,52],[37+tail,63],[31,68],[27+tail,74],[23,66],[17,68],[20-tail,58],[16,55],[22,50]],shade);
 P([[25,48],[31,47],[34,53],[31+tail,63],[26,67],[23,61],[24,55]],base);L(26,51,28,61,light);
 for(const [x,s]of [[18,-1],[37,1]]){L(x,31,x+s*(7+arm),37,shade,3);L(x+s*(7+arm),37,x+s*(5+arm),45,base,2);R(x+s*(5+arm)-1,44,3,3,light);}
 P([[22,10],[23,5],[32,5],[35,11],[35,17],[32,17],[32,10],[29,8],[26,10],[25,15],[22,15]],'#768b87');
 P([[15,19],[22,16],[34,16],[41,20],[39,44],[33,50],[22,49],[16,43]],'#425b65');P([[19,21],[36,21],[35,41],[31,45],[23,44],[20,40]],'#7aa69e');
 const lift=attack?5:0;P([[22,38],[25,28-lift],[28,32-lift],[32,23-lift],[34,35],[32,42],[25,43]],light);P([[25,38],[28,31-lift],[31,35],[29,42],[26,42]],SOUL);R(24,33,2,2,'#567b7b');R(30,32,2,2,'#567b7b');
 for(const x of [18,36])L(x,20,x+1,43,'#c4b98d',2);R(15,18,26,3,'#b3a67f');R(18,43,20,4,'#8c9c8c');R(24,47,8,3,'#c4b98d');
 return finish();
}
function brute(m){
 const a=enemyArtFrame(m),{P,R,L,r,leg,arm,attack,finish}=a,[base,shade,light]=GRAVEYARD_PALETTES.shadowstitch;
 enemyLegs(r,{leg,top:52,left:15,right:33,width:9,cloth:'#5b5b6a',shade:'#383e50',light:'#92909a',boots:'#3e4052',bootLight:'#787885'});
 P([[13,28],[22,25],[35,27],[44,34],[46,48],[39,58],[17,58],[9,48],[7,37]],shade);P([[16,30],[24,29],[34,30],[40,36],[41,46],[35,53],[21,53],[13,46],[12,37]],base);
 P([[18,31],[27,33],[29,42],[21,45],[15,40]],'#a9ada3');P([[30,33],[38,35],[39,44],[33,47],[29,42]],'#b2a5a5');stitches(a,28,32,7,true);stitches(a,17,45,6);R(18,55,20,4,'#605362');R(26,55,6,4,'#a99b7d');
 for(const [x,s]of [[11,-1],[43,1]]){const hy=attack?40:54,hx=x+s*(2+arm);L(x,34,hx,hy,shade,9);L(x,34,hx,hy-2,base,6);P([[hx-4,hy],[hx+4,hy],[hx+6,hy+7],[hx+2,hy+10],[hx-4,hy+7]],base);stitches(a,hx-2,hy+3,3);}
 P([[17,16],[21,9],[32,7],[39,13],[40,23],[34,31],[23,31],[17,26]],shade);P([[21,15],[25,11],[31,11],[36,16],[35,24],[31,28],[24,27],[20,23]],base);R(21,20,5,2,ENEMY_INK);R(30,19,5,2,ENEMY_INK);R(22,20,2,1,RED);R(31,19,2,1,RED);P([[23,25],[33,24],[33,28],[24,29]],'#4f3c51');stitches(a,20,14,5);R(34,14,4,3,light);R(17,21,2,3,GOLD);R(38,20,2,3,GOLD);
 return finish();
}
function ghost(m,parade=false){
 const a=enemyArtFrame(m),{P,R,L,tail,arm,attack,enraged,finish}=a,[base,shade,light]=GRAVEYARD_PALETTES[parade?'paradehollow':'hollowghost'];
 P([[16,18],[21,12],[31,10],[39,16],[42,28],[39,42],[36+tail,55],[30,62],[26+tail,70],[23,61],[17-tail,66],[19,52],[13,43],[10,31]],shade);
 P([[18,19],[23,15],[31,14],[36,19],[38,29],[35,41],[33+tail,52],[29,58],[26+tail,64],[24,56],[19,58],[22,46],[16,39],[14,30]],base);
 for(const [x,s]of [[15,-1],[38,1]]){P([[x,30],[x+s*(8+arm),attack?23:36],[x+s*(10+arm),attack?27:42],[x+s*4,42],[x,40]],shade);P([[x,32],[x+s*(7+arm),attack?27:37],[x+s*(7+arm),attack?29:39],[x+s*3,39]],base);}
 R(20,24,5,6,ENEMY_INK);R(31,23,5,6,ENEMY_INK);R(21,25,2,2,shade);R(32,24,2,2,shade);P([[23,34],[31,33],[34,37],[31,attack?47:42],[26,attack?48:43],[22,39]],ENEMY_INK);R(25,35,5,2,'#c2b8c4');
 L(19,19,24,16,light,2);L(18,38,20,46,light);L(32,42,30,52,'#c4d2c6');
 if(parade){P([[25,15],[17,8],[16,16],[24,20]],'#b4799a');P([[29,15],[37,8],[39,16],[30,20]],'#d5a0b6');R(25,14,5,5,'#74516e');R(27,14,2,2,'#efd2ce');}
 if(enraged){L(20,21,24,21,SOUL);L(31,20,35,20,SOUL);R(25,52,4,3,light);}
 return finish();
}
function sentinel(m){
 const a=enemyArtFrame(m),{P,R,L,r,leg,arm,attack,enraged,finish}=a,[base,shade,light]=GRAVEYARD_PALETTES.tombsentinel;
 enemyLegs(r,{leg,top:48,left:18,right:32,width:8,cloth:base,shade,light,boots:shade,bootLight:'#8a9b87'});
 P([[16,30],[23,27],[35,29],[41,36],[39,49],[34,55],[20,54],[13,44]],shade);P([[19,31],[27,30],[35,33],[36,44],[30,50],[22,48],[17,40]],base);P([[23,32],[28,36],[33,33],[32,43],[28,47],[24,42]],light);L(28,36,28,44,'#e5d4a3');P([[22,49],[34,49],[35,65],[28,68],[21,64]],'#665472');L(25,51,26,63,GOLD);R(18,49,20,4,'#484958');R(26,49,5,3,GOLD);
 L(16,35,10-arm,48,shade,7);L(16,35,11-arm,46,base,4);P([[3-arm,40],[14-arm,38],[19-arm,46],[17-arm,59],[11-arm,66],[3-arm,58]],shade);P([[5-arm,42],[13-arm,41],[16-arm,47],[14-arm,57],[11-arm,62],[6-arm,56]],base);L(10-arm,44,10-arm,58,light,2);L(6-arm,50,14-arm,50,GOLD);
 const hx=43+arm,hy=attack?39:50;L(38,35,hx,hy,shade,6);R(hx-2,hy,5,5,BONE);katana(a,hx,hy,attack,true);
 skull(a,28,20,.95,RED);P([[17,19],[18,10],[25,5],[34,6],[39,12],[39,20],[34,17],[29,14],[24,16]],shade);L(20,12,25,8,light);L(33,8,37,13,light);P([[19,12],[14,4],[22,8]],GOLD);P([[35,9],[42,3],[39,15]],GOLD);R(27,7,3,6,base);
 if(enraged){R(24,36,3,3,RED);R(31,37,3,3,RED);}
 return finish();
}
function ryuma(m){
 const a=enemyArtFrame(m),{P,R,L,r,leg,arm,tail,attack,enraged,finish}=a,[base,shade,light]=GRAVEYARD_PALETTES.ryuma;
 if(enraged){P([[13,27],[24,21],[37,24],[44,37],[48+tail,64],[40,69],[33,59],[26,69],[15-tail,70],[8,64],[12,43]],'#333443');for(const s of[-1,1])L(28+s*15,36,28+s*22,53+tail,'#6b5a7c',2);}
 enemyLegs(r,{leg,top:49,left:20,right:31,width:7,cloth:'#596574',shade:'#303e52',light:'#91a0a2',boots:'#777c79',bootLight:BONE});
 P([[17,31],[23,29],[34,30],[40,36],[39,50],[34,57],[19,55],[14,45]],shade);P([[20,32],[25,31],[32,32],[36,37],[34,49],[27,52],[21,49],[18,41]],'#72808a');P([[22,32],[27,38],[32,32],[35,36],[29,46],[23,41]],base);L(24,35,28,39,light);P([[20,45],[35,45],[37,51],[20,52]],'#806b62');L(21,47,34,47,'#c8b58c');P([[24,50],[29,50],[29,60],[25+tail,64],[23,57]],'#9b7c71');
 for(const[x,s]of[[17,-1],[38,1]]){const hx=attack?30+s*9:x+s*(3+arm),hy=attack?40:50;L(x,35,hx,hy,shade,7);L(x,35,hx,hy-2,'#889696',4);R(hx-2,hy,5,5,BONE);bandages(a,hx-2,hy-7,4,6);if(s===1)katana(a,hx+1,hy,attack,enraged);}
 P([[17,17],[20,10],[30,8],[37,14],[39,24],[34,31],[25,33],[18,27]],BS);P([[20,16],[24,12],[30,12],[35,17],[35,24],[31,29],[24,28],[20,23]],BONE);bandages(a,19,15,17,14);R(20,21,7,3,ENEMY_INK);R(31,20,5,2,ENEMY_INK);R(22,21,3,1,enraged?RED:'#b3bec6');L(24,28,31,27,'#5a5964');P([[19,13],[22,6],[29,3],[35,7],[36,13],[32,12],[29,9],[24,13]],'#3b424d');R(25,3,5,4,'#303b4c');R(26,2,3,1,'#8a8d86');
 if(enraged){P([[13,32],[20,32],[16,52],[12-tail,65],[8,63]],'#665775');R(28,36,2,6,'#a8a0b6');}
 return finish();
}
function moriah(m){
 const a=enemyArtFrame(m),{P,R,L,leg,arm,tail,attack,enraged,finish}=a,[base,shade,light]=GRAVEYARD_PALETTES.moriah;
 const wide=enraged?3:0;
 if(enraged){P([[11,25],[19,16],[27,20],[36,16],[45,26],[51,47],[48+tail,67],[39,72],[28,69],[16,72],[5-tail,65],[4,46]],'#373147');for(const[x,s]of[[13,-1],[42,1]])P([[x,29],[x+s*10,16],[x+s*8,37],[x+s*6,31],[x+s*3,43]],'#52405e');}
 for(const[x,d]of[[19,-leg],[31,leg]]){R(x+d,61,7,9,'#514150');R(x+d-3,69,11,3,'#343244');L(x+d,69,x+d+6,69,'#8e7a89');}
 P([[18-wide,28],[25,26],[34,28],[43+wide,39],[45+wide,52],[40,63],[29,68],[17,63],[10-wide,52],[12-wide,39]],shade);
 P([[20-wide,31],[27,29],[34,31],[40+wide,40],[41+wide,51],[36,59],[28,63],[20,59],[14-wide,50],[16-wide,39]],'#8d647d');P([[24,33],[30,31],[35,35],[38,45],[35,56],[27,59],[20,54],[18,44]],'#bd8fa0');
 for(let yy=39;yy<58;yy+=5)for(let xx=22;xx<36;xx+=5)R(xx+(yy%2),yy,3,3,'#8c546d');P([[20,31],[25,33],[21,46],[16,57],[12-wide,52],[16-wide,39]],'#302e43');P([[32,32],[37,31],[41+wide,40],[42+wide,52],[37,59],[33,46]],'#302e43');L(18,37,16,51,GOLD);L(39,39,40,52,GOLD);R(24,58,10,4,'#3d334b');R(27,58,4,3,GOLD);
 for(const[x,s]of[[14-wide,-1],[42+wide,1]]){const hx=x+s*(2+arm),hy=attack?37:51;L(x,36,hx,hy,shade,7);L(x,36,hx,hy-2,'#84718f',4);R(hx-2,hy,5,5,base);for(let k=0;k<3;k++)L(hx-2+k*2,hy+3,hx-3+k*2+s,hy+7,BONE);}
 P([[18,15],[21,7],[31,5],[37,11],[40,22],[35,31],[27,34],[20,29],[16,22]],shade);P([[21,15],[24,10],[31,10],[35,15],[35,23],[31,29],[25,30],[21,25]],base);P([[19,13],[16,6],[22,8],[25,5],[31,4],[35,7],[42,5],[38,17],[34,15],[29,11],[24,15]],'#353143');for(const[x,s]of[[21,-1],[35,1]])P([[x,12],[x+s*4,5],[x+s*7,2],[x+s*6,9],[x+s*2,17]],'#baad96');R(22,20,5,2,ENEMY_INK);R(31,19,5,2,ENEMY_INK);R(23,20,2,1,'#e6c2d1');R(32,19,2,1,'#e6c2d1');P([[22,25],[34,24],[34,28],[29,31],[24,29]],ENEMY_INK);for(let x=24;x<34;x+=3)R(x,25,2,2,BONE);L(27,16,27,20,light);
 return finish();
}
function perona(m){
 const a=enemyArtFrame(m),{P,R,L,leg,arm,tail,attack,enraged,finish}=a,[hair,shade,light]=GRAVEYARD_PALETTES.peronaparade;
 if(enraged){P([[13,12],[24,7],[39,10],[48,24],[49,44],[53+tail,63],[45,61],[38,71],[30,66],[20,72],[12,62],[3-tail,66],[8,46],[5,29]],'#91aaa8');P([[14,16],[24,11],[37,14],[43,26],[43,43],[46+tail,58],[39,56],[34,65],[27,59],[20,66],[15,56],[9,59],[13,41],[10,29]],'#d8dfcc');R(15,24,7,7,ENEMY_INK);R(34,23,7,7,ENEMY_INK);P([[20,36],[37,34],[37,42],[29,49],[22,45]],'#5d7380');}
 // The umbrella stays behind the right pigtail, leaving the face readable.
 const ux=45,uy=attack?22:29;L(ux,uy,ux,65,'#a48991',2);P([[31,uy],[35,uy-10],[44,uy-15],[52,uy-9],[55,uy],[50,uy-2],[45,uy+1],[40,uy-2],[35,uy+1]],'#543449');P([[34,uy-2],[38,uy-10],[44,uy-13],[42,uy-2]],'#c87b99');P([[46,uy-13],[51,uy-8],[53,uy-2],[48,uy-2]],'#c87b99');L(45,uy+2,45,59,'#d9b5af');L(45,59,42,62,'#d9b5af',2);
 for(const[x,s]of[[17,-1],[36,1]]){P([[x,18],[x+s*5,22],[x+s*5+tail,37],[x+s*2,47],[x-s*3,39],[x-s*2,23]],'#9b5d7d');P([[x+s,20],[x+s*3,24],[x+s*3+tail,35],[x+s,40],[x-s,32]],hair);L(x+s,24,x+s*2+tail,33,'#f0b7cb');}
 for(const[x,d]of[[22,-leg],[31,leg]]){R(x+d,59,5,10,'#f1dfcd');R(x+d,60,5,2,'#ad7b95');R(x+d-2,68,8,4,'#393144');R(x+d-1,68,5,1,'#b8839b');}
 P([[21,40],[32,40],[38,50],[41+tail,59],[35,63],[29,61],[23,64],[15+tail,59],[18,49]],'#3c3048');P([[23,43],[30,43],[35,51],[37+tail,58],[31,59],[26,57],[20+tail,60],[18,57]],'#a75b81');for(const y of[50,56,60]){L(19,y,36,y+1,'#e8c9cc');for(let x=19;x<37;x+=4)R(x,y+1,2,2,'#c38aa9');}
 P([[21,30],[32,30],[35,38],[33,45],[22,45],[19,38]],shade);P([[24,31],[29,31],[32,38],[29,43],[24,42],[22,36]],'#a75b81');R(23,35,8,2,'#ead3cd');R(25,34,3,4,'#c888a6');L(25,40,29,40,'#e7c3c7');
 for(const[x,s]of[[20,-1],[34,1]]){const hx=x+s*(3+arm),hy=attack?34:45;L(x,33,hx,hy,'#dba9ba',4);R(hx-2,hy,4,5,'#efc8b8');R(hx-2,hy-1,4,2,'#f1e4d5');}
 P([[17,15],[21,9],[31,8],[37,14],[38,23],[34,30],[25,32],[19,27]],'#b67b92');P([[20,15],[24,11],[31,12],[35,16],[35,24],[31,29],[25,29],[20,24]],'#f1cfbc');P([[17,17],[18,10],[25,6],[33,9],[37,15],[36,22],[32,17],[29,18],[27,14],[24,18],[22,15],[19,22]],hair);L(21,11,27,8,'#f3b9cc');for(const x of[21,30]){R(x,22,5,1,ENEMY_INK);R(x+1,23,3,3,'#70677e');R(x+1,23,1,1,'#f5eee0');}L(26,28,29,28,'#ac697c');
 P([[22,8],[20,2],[25,5],[28,1],[31,5],[36,2],[34,9]],'#3a2d45');L(23,7,33,7,GOLD);R(27,4,3,3,RED);
 return finish();
}
function ainz(m){
 const a=enemyArtFrame(m),{P,R,L,tail,arm,attack,enraged,finish}=a;
 if(enraged){for(const[x,y,w]of[[11,8,7],[21,3,6],[31,3,6],[41,8,5]]){R(x,y,w,1,VIOLET);R(x+1,y+1,w-1,1,'#6c5b88');}for(const s of[-1,1])P([[28+s*12,25],[28+s*23,14],[28+s*24,33],[28+s*19,29],[28+s*21,46],[28+s*12,39]],'#4b3b66');}
 P([[15,29],[24,25],[35,27],[43,37],[48+tail,66],[41,72],[30,69],[19,72],[8+tail,68],[11,44]],'#292d40');P([[17,32],[22,31],[21,48],[15+tail,66],[11+tail,66],[14,44]],'#49425e');P([[36,31],[40,35],[43,50],[45+tail,66],[40+tail,68],[34,50]],'#49425e');L(15+tail,66,21,48,GOLD,2);L(35,48,42+tail,66,GOLD,2);L(12+tail,68,20,70,GL);L(31,69,40+tail,69,GL);
 P([[23,30],[31,30],[34,44],[32,65],[27,68],[22,64],[21,44]],'#77608b');L(24,33,24,58,'#bca47d');L(30,33,31,59,'#bca47d');R(23,48,10,4,GOLD);P([[25,49],[30,49],[32,54],[29,59],[25,57],[23,53]],'#a75b78');R(26,51,3,4,'#e28a9c');
 for(const[x,s]of[[16,-1],[40,1]]){P([[x-s*3,28],[x+s*6,22],[x+s*10,28],[x+s*8,37],[x,38],[x-s*4,33]],'#4a3a59');P([[x-s,28],[x+s*5,25],[x+s*7,29],[x+s*5,34],[x,34]],GOLD);R(x+s*2-2,27,5,5,'#a34e70');R(x+s*2-1,28,3,3,'#e08b9c');P([[x+s*4,25],[x+s*7,17],[x+s*9,27]],BONE);}
 for(const[x,s]of[[16,-1],[40,1]]){const hx=x+s*(4+arm),hy=attack?38:51;L(x,35,hx,hy,'#343245',7);L(x,35,hx,hy-3,'#6b577d',4);R(hx-3,hy-2,6,2,GOLD);R(hx-2,hy,5,5,BONE);for(let k=0;k<3;k++)L(hx-2+k*2,hy+2,hx-2+k*2+s,hy+7,BL);}
 // Staff of Ainz: gold serpent prongs surround a crimson jewel.
 const sx=8;L(sx,20,sx,70,'#907044',3);L(sx-1,21,sx-1,69,GL);P([[sx-5,18],[sx-7,11],[sx-4,5],[sx-3,12],[sx,15],[sx+3,12],[sx+4,5],[sx+7,11],[sx+5,18],[sx,22]],GOLD);P([[sx-3,12],[sx,7],[sx+3,12],[sx+2,17],[sx-2,17]],'#a94f70');R(sx-1,10,2,4,'#e398a1');R(sx-2,22,5,3,'#6b5c78');
 P([[18,19],[17,11],[22,5],[32,4],[39,12],[38,25],[33,31],[23,31]],'#373448');P([[20,18],[21,11],[26,7],[32,8],[36,14],[35,24],[30,29],[23,27]],'#635275');skull(a,28,19,.95,RED);L(20,12,23,8,GOLD);L(33,8,37,14,GOLD);L(20,25,23,29,GOLD);L(33,29,36,24,GOLD);
 if(enraged){R(25,17,2,2,'#eea0a8');R(32,17,2,2,'#eea0a8');R(26,58,3,4,GL);}
 return finish();
}
export function graveyardEnemyPixels(id,m={}){
 switch(id){case'gravezombie':return zombie(m);case'coffincrawler':return coffin(m);case'lanternwisp':return wisp(m);case'shadowstitch':return brute(m);case'hollowghost':return ghost(m);case'paradehollow':return ghost(m,true);case'tombsentinel':return sentinel(m);case'ryuma':return ryuma(m);case'moriah':return moriah(m);case'peronaparade':return perona(m);case'ainztomb':return ainz(m);default:return null;}
}
