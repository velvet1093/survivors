const INK='#263343',cache=new Map();
export const MULTI_FUSION_ICON_IDS=['chimeragarden','rasenflash','panaceapouch','adaptivebarrier'];
export function multiFusionIconPixels(id){
 if(!MULTI_FUSION_ICON_IDS.includes(id))return null;if(cache.has(id))return cache.get(id);
 const p=Array(1024).fill(null),put=(x,y,c)=>{x=Math.round(x);y=Math.round(y);if(x>=0&&x<32&&y>=0&&y<32)p[y*32+x]=c;},rect=(x,y,w,h,c)=>{for(let j=0;j<h;j++)for(let i=0;i<w;i++)put(x+i,y+j,c);},line=(x,y,tx,ty,c,w=1)=>{const n=Math.max(Math.abs(tx-x),Math.abs(ty-y),1);for(let i=0;i<=n;i++)rect(Math.round(x+(tx-x)*i/n),Math.round(y+(ty-y)*i/n),w,w,c);},poly=(points,c)=>{for(let y=0;y<32;y++)for(let x=0;x<32;x++){let inside=false;for(let i=0,j=points.length-1;i<points.length;j=i++){const a=points[i],b=points[j];if((a[1]>y+.5)!==(b[1]>y+.5)&&x+.5<(b[0]-a[0])*(y+.5-a[1])/(b[1]-a[1])+a[0])inside=!inside;}if(inside)put(x,y,c);}},disc=(x,y,r,c)=>{for(let j=0;j<32;j++)for(let i=0;i<32;i++)if((i-x)**2+(j-y)**2<r*r)put(i,j,c);};
 if(id==='chimeragarden'){
  poly([[1,8],[8,11],[11,7],[15,12],[20,7],[23,11],[31,6],[29,20],[23,27],[10,28],[3,22]],INK);poly([[2,11],[8,14],[10,11],[14,17],[8,22],[4,20]],'#7383ae');poly([[29,10],[23,14],[22,11],[18,17],[24,23],[28,20]],'#a5bbce');
  poly([[9,24],[10,7],[15,14],[21,7],[23,25],[17,29]],'#3e4c6b');poly([[12,17],[17,15],[21,18],[20,24],[16,27],[12,24]],'#adbfca');rect(12,18,3,2,'#ecd89c');rect(20,18,2,2,'#edbc9c');rect(16,23,3,2,INK);line(5,27,9,21,'#b7b5ed',2);line(9,21,7,21,'#e7d8ff');line(25,5,22,11,'#dbe6fa',2);
 }else if(id==='rasenflash'){
  disc(22,11,10,INK);disc(22,11,8,'#3d8eaf');disc(21,10,6,'#84d9dd');disc(21,10,3,'#e8f8dc');line(17,6,25,8,'#e1f2e0');line(25,8,26,14,'#a9f4df');line(3,28,18,13,INK,5);line(4,27,18,13,'#d2d6b4',3);poly([[8,23],[9,15],[19,8],[21,10],[15,20]],'#7599a2');line(10,20,18,11,'#e9edcb',2);line(3,22,9,28,'#dfb56d',2);rect(2,28,4,3,'#9e784e');line(25,22,29,17,'#e9c988',2);line(20,28,24,23,'#e9c988',2);
 }else if(id==='panaceapouch'){
  poly([[8,3],[23,3],[21,10],[28,18],[28,27],[21,31],[9,31],[3,26],[4,17],[10,10]],INK);poly([[10,5],[21,5],[19,11],[25,18],[25,26],[20,29],[10,29],[6,25],[7,18],[13,11]],'#b4896d');poly([[8,18],[21,14],[25,20],[23,26],[15,29],[7,25]],'#d3ba88');line(9,11,21,11,'#836552',2);line(14,12,12,17,'#a7855c');disc(17,22,6,'#4d845a');poly([[16,16],[21,18],[21,23],[17,27],[12,25],[13,20]],'#9ac77c');line(14,23,18,24,'#e0e7a6');poly([[13,10],[7,7],[6,3],[12,5]],'#75b58b');poly([[20,11],[25,6],[29,7],[25,11]],'#90bf85');
 }else{
  poly([[5,5],[21,3],[28,10],[28,23],[18,31],[5,23]],INK);poly([[7,7],[19,5],[25,11],[25,22],[18,27],[7,22]],'#788e98');poly([[9,8],[19,7],[22,11],[22,20],[16,24],[9,20]],'#a8d4cb');rect(11,10,8,12,'#40677b');rect(12,12,6,2,'#e2f5da');rect(12,16,6,2,'#81c7b4');poly([[20,11],[30,13],[30,23],[25,29],[19,24],[18,17]],'#697ba5');poly([[21,14],[28,15],[28,22],[25,26],[21,22]],'#c4bcdf');line(23,18,27,18,'#f4e5ba',2);line(25,16,25,22,'#f4e5ba');line(4,11,2,15,'#d7e8d9');line(3,24,6,27,'#d7e8d9');
 }
 cache.set(id,p);return p;
}
