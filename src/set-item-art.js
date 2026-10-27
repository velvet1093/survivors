// 32-pixel inventory icons for the multi-step equipment sets. Each finished relic
// carries motifs from its pieces; half-built bonds show the relic still forming,
// and awakened relics glow brighter than the relic they grew from.
export const SET_ITEM_ART_IDS=['transmutation','automail','alchemistwatch','redstone','stonebond','philosopherstone','gateoftruth','strawhat','logpose','vivrecard','gumgumfruit','crewbond','piratelegacy','gearfifth','hanafuda','checkeredhaori','nichirintsuba','foxmask','breathbond','hinokami','transparentworld'];
const INK='#283546',GOLD='#d3b780',PALE='#f2e4bc',TAU=Math.PI*2,cache=new Map();
function frame(){
 const p=Array(1024).fill(null),R=(x,y,w,h,c)=>{for(let yy=Math.round(y);yy<y+h;yy++)for(let xx=Math.round(x);xx<x+w;xx++)if(xx>=0&&yy>=0&&xx<32&&yy<32)p[yy*32+xx]=c;};
 const L=(x,y,tx,ty,c,w=1)=>{const n=Math.max(1,Math.abs(tx-x),Math.abs(ty-y));for(let i=0;i<=n;i++)R(x+(tx-x)*i/n,y+(ty-y)*i/n,w,w,c);};
 const P=(points,c)=>{for(let y=0;y<32;y++)for(let x=0;x<32;x++){let inside=false;for(let i=0,j=points.length-1;i<points.length;j=i++){const a=points[i],b=points[j];if((a[1]>y+.5)!==(b[1]>y+.5)&&x+.5<(b[0]-a[0])*(y+.5-a[1])/(b[1]-a[1])+a[0])inside=!inside;}if(inside)R(x,y,1,1,c);}};
 const E=(x,y,rx,ry,c)=>{for(let yy=0;yy<32;yy++)for(let xx=0;xx<32;xx++)if(((xx+.5-x)/rx)**2+((yy+.5-y)/ry)**2<=1)R(xx,yy,1,1,c);};
 const ring=(x,y,r,c,from=0,to=TAU)=>{for(let a=from;a<=to;a+=.04)R(x+Math.cos(a)*r-.5,y+Math.sin(a)*r-.5,1,1,c);};
 return {p,R,L,P,E,ring};
}

// ---- Fullmetal Alchemist ----
function array(a,{cx=16,cy=16,r=13,color='#9ccbf0',light='#e2f2ff',partial=1}={}){
 const {L,ring}=a;ring(cx,cy,r,color,0,TAU*partial);ring(cx,cy,r-1,light,0,TAU*partial);ring(cx,cy,r-5,color,0,TAU*partial);
 const tri=[0,1,2].map(i=>[cx+Math.cos(-TAU/4+i*TAU/3)*(r-1),cy+Math.sin(-TAU/4+i*TAU/3)*(r-1)]);
 for(let i=0;i<3;i++){if(i/3>=partial)break;const [x0,y0]=tri[i],[x1,y1]=tri[(i+1)%3];L(x0,y0,x1,y1,light);}
}
function transmutation(a){const {R,E}=a;E(16,16,15,15,'#2c3f5c');array(a);R(15,15,2,2,'#e2f2ff');for(const [x,y]of [[16,3],[27,22],[5,22]])R(x-1,y-1,2,2,'#f6e7a8');}
function automail(a){const {P,L,R,E}=a;
 P([[4,27],[9,30],[19,18],[14,14]],'#6f7b8c');P([[5,27],[9,29],[18,18],[14,15]],'#b8c2cf');L(6,26,15,16,'#e6ecf2');
 E(16,15,4,4,'#4f5a6a');E(16,15,2.5,2.5,'#9aa6b6');R(15,14,2,2,'#e6ecf2');
 P([[17,12],[22,4],[28,6],[29,12],[24,17],[19,17]],'#6f7b8c');P([[18,12],[22,5],[27,7],[28,12],[24,16],[19,16]],'#c8d0da');
 for(const [x0,y0,x1,y1]of [[21,6,25,3],[24,8,28,4],[26,11,30,8]])L(x0,y0,x1,y1,'#9aa6b6',2);L(19,13,25,7,'#eef2f6');
 for(const [x,y]of [[9,26],[12,22],[20,8]])R(x,y,1,1,'#3a4452');}
function watch(a){const {E,L,R,P,ring}=a;
 L(16,1,16,5,'#b7bcc6',2);E(16,3,2.5,2.5,'#d8dce4');E(16,3,1,1,INK);
 E(16,18,12,12,'#8a909c');E(16,18,10.5,10.5,'#d8dce4');E(16,18,9,9,'#eef1f6');ring(16,18,9,'#b7bcc6');
 // The lid's hexagram, half shaded.
 L(16,10,23,22,'#7a8090');L(23,22,9,22,'#7a8090');L(9,22,16,10,'#7a8090');L(16,26,9,14,'#7a8090');L(9,14,23,14,'#7a8090');L(23,14,16,26,'#7a8090');
 E(16,18,2,2,'#c49a3a');L(10,25,14,28,PALE);R(12,11,3,1,'#ffffff');P([[26,9],[29,6],[30,8],[27,11]],'#b7bcc6');}
function redstone(a,{x=16,y=17,s=1}={}){const {P,L,R}=a;
 const g=pts=>pts.map(([px,py])=>[x+(px-16)*s,y+(py-17)*s]);
 P(g([[16,3],[25,10],[27,19],[21,29],[11,29],[5,19],[7,10]]),'#7a1824');P(g([[16,5],[24,11],[25,19],[20,27],[12,27],[7,19],[8,11]]),'#c8303e');
 P(g([[16,5],[20,12],[16,20],[12,12]]),'#ec5a66');P(g([[8,11],[12,12],[16,20],[7,19]]),'#a82230');P(g([[24,11],[25,19],[16,20],[20,12]]),'#e2444f');
 L(x-5*s,y-6*s,x-2*s,y-10*s,'#ffc4c8');R(x-1,y-9*s,2,2,'#fff1f2');}
function stonebond(a){const {L,R}=a;array(a,{partial:.62,color:'#c46a74',light:'#f0b8bc'});redstone(a,{x:16,y:17,s:.62});L(13,10,19,24,'#3a0a12');L(14,10,20,24,'#3a0a12');for(const [x,y]of [[25,24],[27,20],[24,27]])R(x,y,1,1,'#f0b8bc');}
function philosopherstone(a){const {E,ring,R}=a;E(16,16,15,15,'#3b1420');array(a,{color:'#e8b04a',light:'#ffe6a0'});ring(16,16,7,'#ff8a92');redstone(a,{x:16,y:16,s:.6});for(const [x,y]of [[3,16],[29,16],[16,3]])R(x-1,y-1,3,3,'#ffd36a');}
function gateoftruth(a){const {P,R,L,E}=a;
 P([[3,30],[3,7],[8,2],[24,2],[29,7],[29,30]],'#8a8478');P([[5,29],[5,8],[9,4],[23,4],[27,8],[27,29]],'#d6cfbe');
 R(15,4,2,26,'#5a5448');for(const yy of [10,16,22]){L(7,yy,13,yy,'#a49c8a');L(19,yy,25,yy,'#a49c8a');}
 // The great eye of Truth across both doors.
 E(16,15,8,4,'#2a2420');E(16,15,6,3,'#f4ead4');E(16,15,2.5,2.5,'#1a1410');R(15,14,1,1,'#ffffff');
 for(const [x0,y0,x1,y1]of [[9,26,6,30],[23,26,26,30],[12,27,11,31],[20,27,21,31]])L(x0,y0,x1,y1,'#1a1410',2);
 redstone(a,{x:16,y:4,s:.3});R(4,30,24,2,'#6a6458');}

// ---- One Piece ----
function strawhat(a,{dx=0,dy=0,s=1}={}){const {E,R}=a,X=x=>16+(x-16)*s+dx,Y=y=>16+(y-16)*s+dy;
 E(X(16),Y(21),14*s,5*s,'#b08a3a');E(X(16),Y(20),13*s,4*s,'#e8c25a');E(X(16),Y(14),8*s,7*s,'#b08a3a');E(X(16),Y(14),7*s,6*s,'#f0d270');
 R(X(8),Y(16),16*s,3*s,'#c8303a');R(X(8),Y(16),16*s,1,'#e85a5a');
 for(let i=0;i<5;i++)R(X(10+i*3),Y(10+i%2),1,2*s,'#d0aa48');R(X(11),Y(9),4*s,1,'#fff0b8');}
function logpose(a){const {E,R,L,ring}=a;
 R(3,22,26,6,'#6a4a2e');R(3,22,26,2,'#9a6e44');for(const x of [6,12,20,26])R(x,24,2,2,'#c8a24a');
 E(16,13,9,10,'#7aa8c0');E(16,13,7.5,8.5,'#cfeaf6');ring(16,13,8,'#8ac0d8');L(16,7,16,19,'#c83a3a');L(16,7,16,12,'#e8e8f0');R(15,12,2,2,'#c8a24a');
 R(12,6,3,2,'#ffffff');R(13,22,6,2,'#c8a24a');}
function vivrecard(a){const {P,R,L}=a;
 P([[6,5],[26,3],[28,26],[8,29]],'#c8bea8');P([[7,6],[25,4],[27,25],[9,28]],'#f6f1e6');
 P([[20,22],[27,20],[28,26],[22,27]],'#8a6a4a');P([[22,23],[26,22],[26,25],[23,25]],'#4a3a2a');
 for(const yy of [10,14,18])L(10,yy,22,yy-1,'#c8bea8');R(11,7,6,1,'#ffffff');L(16,22,22,21,'#d84a3a');}
function gumgumfruit(a){const {E,R,L,ring,P}=a;
 E(16,19,12,11,'#5a2e86');E(15,18,10.5,9.5,'#a874c8');
 for(let k=0;k<3;k++){const cx=[11,20,16][k],cy=[16,15,23][k];ring(cx,cy,3,'#5a2e86',0,TAU*.8);ring(cx,cy,1.4,'#5a2e86',0,TAU*.8);}
 L(16,8,18,3,'#4a6a2a',2);P([[18,4],[25,2],[23,7]],'#6aa84a');L(19,4,23,4,'#9ad87a');R(9,12,3,2,'#e0c4f0');}
function jolly(a,{hat=true,bones=true,skull=true,flag=false}={}){const {P,E,R,L}=a;
 if(flag){P([[3,4],[29,3],[28,26],[4,28]],'#1c1c22');P([[4,5],[28,4],[27,25],[5,27]],'#2c2c34');L(4,6,27,5,'#4a4a56');}
 if(bones){L(7,24,25,10,'#e8e2d4',3);L(7,10,25,24,'#e8e2d4',3);for(const [x,y]of [[6,23],[24,9],[6,9],[24,23]])E(x+1,y+1,2.2,2.2,'#e8e2d4');}
 if(skull){E(16,16,7,7,'#c8c2b4');E(16,15,6.5,6,'#f4f0e6');E(13,15,1.6,1.8,INK);E(19,15,1.6,1.8,INK);R(15,18,2,1,INK);for(const x of [13,15,17,19])R(x,20,1,2,'#c8c2b4');}
 if(hat)strawhat(a,{dx:0,dy:-8,s:.58});}
function crewbond(a){const {R}=a;jolly(a,{hat:false,skull:false,flag:true});for(const [x,y]of [[10,7],[22,7],[16,26]])R(x,y,2,2,'#e0a05a');}
function piratelegacy(a){const {E,ring}=a;E(16,16,15,15,'#3a2a14');ring(16,16,14,'#e8b84a');ring(16,16,13,'#f8dc8a');jolly(a);}
function gearfifth(a){const {E,L,R,ring}=a;
 for(let i=0;i<12;i++){const t=i/12*TAU;L(16+Math.cos(t)*9,16+Math.sin(t)*9,16+Math.cos(t)*15,16+Math.sin(t)*15,i%2?'#ffe9a0':'#ffffff',2);}
 E(16,16,10,10,'#e8dcc8');E(16,16,9,9,'#ffffff');ring(16,16,6,'#f0e4d0',0,TAU*.75);ring(16,16,3.5,'#f0e4d0',0,TAU*.75);
 // His wide grin under a small straw hat.
 E(13,16,1.4,1.8,INK);E(19,16,1.4,1.8,INK);R(11,20,10,2,INK);R(12,20,8,1,'#ffffff');strawhat(a,{dx:0,dy:-8,s:.5});}

// ---- Demon Slayer ----
function card(a,x,y){const {R,E,L}=a;R(x,y,7,13,'#c8bea8');R(x+1,y+1,5,11,'#f6f1e6');E(x+3.5,y+5,2.6,2.6,'#d8402a');for(const yy of [y+9,y+11])L(x+1,yy,x+5,yy,'#3a3040');}
function hanafuda(a){const {R,L,E}=a;for(const [x,ox]of [[7,9],[19,21]]){E(ox+1,4,2,2,'#c8a24a');L(ox+1,6,ox+1,9,'#c8a24a');card(a,x,10);}R(8,26,6,1,'#a89878');R(20,26,6,1,'#a89878');}
function checkeredhaori(a){const {P,R}=a;
 P([[3,8],[11,3],[16,6],[21,3],[29,8],[27,29],[5,29]],'#1c2420');
 for(let y=4;y<29;y+=4)for(let x=3;x<29;x+=4)if(((x+y)/4)%2<1)R(x,y,4,4,'#3a8a6a');
 P([[11,3],[16,6],[21,3],[18,12],[14,12]],'#e8e4d8');R(5,28,22,2,'#14201a');R(4,9,1,18,'#6aba9a');}
function nichirintsuba(a){const {P,E,R,L}=a;
 P([[6,4],[26,4],[29,8],[29,24],[26,28],[6,28],[3,24],[3,8]],'#1c1c22');P([[7,6],[25,6],[27,9],[27,23],[25,26],[7,26],[5,23],[5,9]],'#3a3a46');
 P([[14,8],[18,8],[18,24],[14,24]],'#0c0c10');
 for(const [x,y]of [[8,9],[22,9],[8,21],[22,21]])R(x,y,3,3,'#6a6a7a');L(6,8,11,6,'#7a7a8a');
 L(16,1,16,7,'#b8c2d0',2);L(16,25,16,31,'#4a7ac8',2);E(16,16,1,1,'#4a7ac8');}
function foxmask(a){const {P,E,R,L}=a;
 P([[5,3],[11,10],[21,10],[27,3],[27,18],[22,27],[16,30],[10,27],[5,18]],'#c8c2b4');P([[6,5],[11,11],[21,11],[26,5],[26,18],[21,26],[16,28],[11,26],[6,18]],'#f4f0e6');
 P([[7,6],[10,10],[8,11]],'#d8402a');P([[25,6],[22,10],[24,11]],'#d8402a');
 P([[9,15],[14,14],[13,17]],INK);P([[23,15],[18,14],[19,17]],INK);
 L(16,12,16,16,'#d8402a');for(const [x,y]of [[11,19],[21,19],[16,22]])R(x,y,2,1,'#d8402a');E(16,25,1.6,1.2,'#3a3040');
 L(8,20,6,24,'#88a0c8');L(24,20,26,24,'#88a0c8');R(9,6,1,1,'#ffffff');}
function flame(a,cx,cy,s,c=['#c8401a','#f07a3a','#ffd070']){const {P}=a,F=pts=>pts.map(([x,y])=>[cx+x*s,cy+y*s]);
 P(F([[0,-12],[5,-5],[8,1],[6,8],[0,11],[-6,8],[-8,1],[-4,-4],[-2,2]]),c[0]);P(F([[0,-7],[4,-1],[5,4],[2,8],[-2,8],[-5,4],[-3,0]]),c[1]);P(F([[0,-2],[2,2],[2,6],[-2,6],[-2,2]]),c[2]);}
function breathbond(a){const {ring,R}=a;ring(16,17,12,'#e88a5a',0,TAU*.55);ring(16,17,11,'#ffc08a',0,TAU*.55);flame(a,16,18,.9);for(const [x,y]of [[6,8],[25,7],[27,14]])R(x,y,2,2,'#ffd070');}
function hinokami(a){const {E,ring,L}=a;
 E(16,16,15,15,'#3a1a10');for(let i=0;i<10;i++){const t=i/10*TAU;flame(a,16+Math.cos(t)*11,16+Math.sin(t)*11,.32);}
 ring(16,16,8,'#f07a3a');E(16,16,7,7,'#ffd070');E(16,16,5,5,'#f07a3a');E(16,16,3,3,'#fff0b8');L(4,28,28,4,'#1c1c22',2);L(5,28,28,5,'#4a7ac8');}
function transparentworld(a){const {E,ring,L,R,P}=a;
 for(let i=0;i<16;i++){const t=i/16*TAU;L(16+Math.cos(t)*10,16+Math.sin(t)*10,16+Math.cos(t)*15,16+Math.sin(t)*15,i%2?'#ffe9b0':'#f4f0e6');}
 P([[2,16],[9,9],[16,7],[23,9],[30,16],[23,23],[16,25],[9,23]],'#c8a86a');P([[4,16],[10,10],[16,9],[22,10],[28,16],[22,22],[16,23],[10,22]],'#f8f2e2');
 E(16,16,6,6,'#d8603a');E(16,16,4,4,'#ffb070');E(16,16,2,2,INK);R(14,13,2,2,'#ffffff');ring(16,16,6,'#f07a3a');}

const DRAW={transmutation,automail,alchemistwatch:watch,redstone:a=>redstone(a),stonebond,philosopherstone,gateoftruth,strawhat:a=>strawhat(a),logpose,vivrecard,gumgumfruit,crewbond,piratelegacy,gearfifth,hanafuda,checkeredhaori,nichirintsuba,foxmask,breathbond,hinokami,transparentworld};
export function setItemPixels(id){
 if(!DRAW[id])return null;if(cache.has(id))return cache.get(id);const a=frame();DRAW[id](a);
 const result=[...a.p];for(let y=0;y<32;y++)for(let x=0;x<32;x++)if(a.p[y*32+x])for(const [dx,dy]of [[-1,0],[1,0],[0,-1],[0,1]]){const xx=x+dx,yy=y+dy;if(xx>=0&&xx<32&&yy>=0&&yy<32&&!a.p[yy*32+xx])result[yy*32+xx]=INK;}
 cache.set(id,result);return result;
}
export function setItemIcon(id){const p=setItemPixels(id);return p?p.map((c,i)=>c?`<rect x="${i%32+1}" y="${Math.floor(i/32)+1}" width="1" height="1" fill="${c}"/>`:'').join(''):null;}
