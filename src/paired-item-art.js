// Native 32-pixel equipment illustrations share the inventory's cool outlines
// and warm highlights. Each fusion combines the silhouettes of its two items.
export const PAIRED_ITEM_ART_IDS=['rasengan','dragonflame','wisteriapetals','griefseed','manacrystal','raijinrasengan','dragonroar','wisteriagarden','purifiedsoul','sagecodex'];
const INK='#263344',cache=new Map(),TAU=Math.PI*2;
function frame(){
 const p=Array(1024).fill(null),R=(x,y,w,h,c)=>{for(let yy=Math.round(y);yy<y+h;yy++)for(let xx=Math.round(x);xx<x+w;xx++)if(xx>=0&&xx<32&&yy>=0&&yy<32)p[yy*32+xx]=c;},L=(x,y,tx,ty,c,w=1)=>{const n=Math.max(1,Math.abs(tx-x),Math.abs(ty-y));for(let i=0;i<=n;i++)R(x+(tx-x)*i/n,y+(ty-y)*i/n,w,w,c);},P=(points,c)=>{for(let y=0;y<32;y++)for(let x=0;x<32;x++){let inside=false;for(let i=0,j=points.length-1;i<points.length;j=i++){const a=points[i],b=points[j];if((a[1]>y+.5)!==(b[1]>y+.5)&&x+.5<(b[0]-a[0])*(y+.5-a[1])/(b[1]-a[1])+a[0])inside=!inside;}if(inside)R(x,y,1,1,c);}},E=(x,y,rx,ry,c)=>{for(let yy=0;yy<32;yy++)for(let xx=0;xx<32;xx++)if(((xx+.5-x)/rx)**2+((yy+.5-y)/ry)**2<=1)R(xx,yy,1,1,c);};
 return {p,R,L,P,E};
}
function orb(a,x,y,r){
 const {E,L,R}=a;E(x,y,r,r,'#48799e');E(x-.5,y-.5,r-2,r-2,'#75bed0');E(x-1,y-1,r-4,r-4,'#a7e4df');
 for(let ring=0;ring<3;ring++){
  let last=null;for(let i=0;i<=30;i++){const t=i/30,angle=t*TAU*.85+ring*TAU/3,rr=(r-1)*(1-t*.8),point=[x+Math.cos(angle)*rr,y+Math.sin(angle)*rr*.78];if(last)L(...last,...point,'#e8f3d9');last=point;}
 }
 R(x-3,y-4,2,2,'#f7f3d9');
}
function flame(a,{storm=false}={}){
 const {P,L,R}=a;
 P([[5,29],[2,21],[7,11],[10,16],[14,3],[18,12],[24,7],[23,16],[29,14],[31,23],[26,29],[17,31]],'#9b5860');
 P([[7,28],[5,21],[10,15],[11,20],[16,8],[18,17],[23,12],[22,20],[28,18],[29,24],[23,28],[16,29]],'#dc8f61');
 P([[11,26],[9,22],[13,18],[14,21],[17,14],[19,21],[23,18],[25,23],[21,27],[16,28]],'#efd296');
 // Horned muzzle and a curled lower jaw distinguish dragon fire from a torch.
 P([[9,18],[9,11],[14,13],[19,12],[24,14],[29,20],[23,22],[20,20],[17,20],[20,25],[14,26],[10,22]],'#b26a4f');
 P([[12,15],[16,15],[20,14],[23,16],[27,20],[23,20],[20,18],[15,18],[13,21],[16,24],[13,23],[11,20]],'#edb976');
 L(12,14,14,17,'#f5deb0');R(19,16,3,1,INK);R(20,16,1,1,'#fff0bd');L(22,21,25,20,'#f4e3bb');L(24,20,25,22,'#f4e3bb');L(15,25,20,26,'#8e5360');
 if(storm){P([[4,7],[13,3],[11,11],[17,10],[10,22],[12,14],[6,15],[8,9]],'#f4d88d');L(7,8,10,6,'#fff4c8');P([[26,2],[22,10],[28,9],[22,19],[24,13],[20,14],[23,3]],'#d8d9a4');L(24,5,23,8,'#fff5d1');}
}
function wisteria(a,{garden=false}={}){
 const {P,R,L,E}=a;L(5,5,27,5,'#597866',2);L(8,4,15,1,'#aec398');L(19,5,25,2,'#a7c58f');
 const clusters=garden?[[6,7,14],[13,6,20],[20,7,16],[27,8,18]]:[[7,7,15],[16,6,22],[25,7,17]];
 for(const [x,y,length]of clusters){L(x,y,x-1,y+length,'#6d8179');for(let k=0;k<length-3;k+=4){const yy=y+k;E(x-2,yy+2,3,3,'#816d9e');E(x+2,yy+3,3,3,'#b9a0c8');R(x-2,yy+1,2,1,'#d9c7dd');R(x+2,yy+2,1,1,'#eadfdf');}P([[x-2,y+length-3],[x+2,y+length-3],[x,y+length+1]],'#d6b6d7');}
 if(garden){P([[2,28],[6,24],[12,27],[17,25],[23,26],[29,23],[31,29],[27,31],[7,31]],'#5c786e');L(4,29,28,29,'#b4c8a5');for(const x of [8,15,23]){L(x,28,x+1,23,'#91b29c');E(x,25,2,3,'#cbb5d5');R(x,24,1,1,'#f3e4d9');}}
}
function grief(a){
 const {P,R,L,E}=a;E(16,5,4,3,'#9ba6ad');E(16,5,2,1,'#354352');L(16,7,16,11,'#cbd2c5',2);
 P([[16,9],[25,15],[26,23],[21,29],[11,29],[6,23],[7,15]],'#687586');P([[16,11],[23,16],[24,22],[20,27],[12,27],[8,22],[9,16]],'#b4bdba');
 P([[16,12],[22,17],[22,23],[18,27],[12,25],[10,20],[12,15]],'#2d3045');P([[15,15],[18,14],[20,17],[20,21],[17,24],[13,22],[12,18]],'#55455e');R(13,16,3,2,'#8a6a85');R(14,17,1,1,'#c1a1b3');
 L(10,15,9,23,'#e0dec9');L(22,15,23,22,'#e0dec9');L(12,27,21,27,'#8699a4');P([[13,30],[19,30],[21,32],[11,32]],'#98a5ad');L(16,26,16,31,'#c8cdbc');
}
function crystal(a,{small=false}={}){
 const {P,L,R}=a;
 if(small){P([[17,9],[23,12],[22,22],[17,26],[12,21],[13,13]],'#558b9f');P([[17,11],[20,13],[20,20],[17,23],[15,20],[15,14]],'#a2e2da');L(17,11,17,22,'#e9f1d9');return;}
 P([[16,2],[26,8],[29,20],[19,30],[9,26],[3,14],[8,5]],'#47758f');P([[16,4],[24,9],[26,19],[18,27],[10,24],[6,14],[10,7]],'#88c3cc');P([[16,4],[16,16],[7,14],[10,7]],'#c0ece0');P([[16,16],[24,9],[26,19],[18,27]],'#5d9bad');P([[16,6],[21,10],[16,16],[17,25],[11,22],[8,15]],'#a7e0d9');L(16,5,16,15,'#eff5d9');L(8,14,15,16,'#eff5d9');L(18,26,24,19,'#c1e3d7');R(7,6,2,2,'#f0e7c1');R(27,4,2,2,'#f0e7c1');R(3,24,2,2,'#d0e2cf');
}
function purified(a){
 const {P,L,R,E}=a;E(16,16,14,10,'#8f9d9e');E(16,16,12,8,'#d6dfcb');E(16,16,10,7,INK);
 P([[16,2],[23,8],[24,19],[20,26],[12,26],[8,19],[9,8]],'#ab708b');P([[16,4],[21,9],[22,18],[19,23],[13,23],[10,18],[11,9]],'#e0a2b7');P([[16,6],[19,10],[20,17],[17,21],[13,18],[13,11]],'#f5d4d2');R(14,8,2,3,'#fff1db');
 L(10,8,10,19,'#c8bd9b');L(22,8,22,19,'#c8bd9b');P([[11,24],[21,24],[24,29],[8,29]],'#d3bd8d');R(10,27,12,2,'#f6e6bb');L(16,24,16,28,'#87778c');for(const [x,y]of [[3,8],[27,7],[27,25]]){L(x-2,y,x+2,y,'#f1edd3');L(x,y-2,x,y+2,'#f1edd3');}
}
function codex(a){
 const {P,R,L}=a;P([[4,5],[22,2],[29,7],[29,29],[10,31],[3,27]],'#44675f');P([[6,6],[21,4],[26,8],[26,27],[10,29],[6,26]],'#749882');P([[9,9],[23,7],[23,25],[10,27]],'#355a5b');P([[23,4],[28,7],[28,28],[25,27]],'#bec6a4');L(5,7,5,26,'#adb899');L(7,7,22,5,'#d6d0a4');L(10,29,24,27,'#d4d8b7');for(const yy of [11,16,21])L(5,yy,8,yy-1,'#d8c48a',2);
 crystal(a,{small:true});L(12,11,22,10,'#e4cf95');L(12,24,22,23,'#e4cf95');R(24,13,5,5,'#b39a6a');R(25,14,3,2,'#f1ddb0');
}
export function pairedItemPixels(id){
 if(!PAIRED_ITEM_ART_IDS.includes(id))return null;if(cache.has(id))return cache.get(id);
 const a=frame(),{P,R,L,E}=a;
 if(id==='rasengan'){orb(a,16,16,12);L(3,10,1,7,'#a8d2d1');L(27,24,30,27,'#b1e6dc');L(3,24,6,25,'#e9e9c7');}
 else if(id==='raijinrasengan'){
  P([[4,17],[13,8],[17,9],[17,13],[8,22]],'#a2b6b6');L(6,19,14,11,'#e5e9ce');P([[4,18],[2,11],[4,6],[7,12],[8,15]],'#c2c8b6');P([[8,21],[10,26],[9,31],[5,25]],'#aeb6ac');L(2,23,8,17,'#b18f63',3);E(3,26,3,3,'#b8a576');E(3,26,1,1,INK);orb(a,21,12,10);R(13,22,2,1,'#ede1b2');L(15,21,16,27,'#ece6b9');
 }
 else if(id==='dragonflame'||id==='dragonroar')flame(a,{storm:id==='dragonroar'});
 else if(id==='wisteriapetals'||id==='wisteriagarden')wisteria(a,{garden:id==='wisteriagarden'});
 else if(id==='griefseed')grief(a);
 else if(id==='manacrystal')crystal(a);
 else if(id==='purifiedsoul')purified(a);
 else codex(a);
 const result=[...a.p];for(let y=0;y<32;y++)for(let x=0;x<32;x++)if(a.p[y*32+x])for(const[dx,dy]of[[-1,0],[1,0],[0,-1],[0,1]]){const xx=x+dx,yy=y+dy;if(xx>=0&&xx<32&&yy>=0&&yy<32&&!a.p[yy*32+xx])result[yy*32+xx]=INK;}
 cache.set(id,result);return result;
}
export function pairedItemIcon(id){const p=pairedItemPixels(id);return p?p.map((c,i)=>c?`<rect x="${i%32+1}" y="${Math.floor(i/32)+1}" width="1" height="1" fill="${c}"/>`:'').join(''):null;}
