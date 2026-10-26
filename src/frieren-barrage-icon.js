let cache;
export function frierenBarrageIcon(id){
 if(id!=='annihilationbarrage')return null;if(cache)return cache;
 const pixels=Array(32*32).fill(null),R=(x,y,w,h,c)=>{for(let yy=Math.max(0,y);yy<Math.min(32,y+h);yy++)for(let xx=Math.max(0,x);xx<Math.min(32,x+w);xx++)pixels[yy*32+xx]=c;},O=(cx,cy,rx,ry,c)=>{for(let y=0;y<32;y++)for(let x=0;x<32;x++)if(((x+.5-cx)/rx)**2+((y+.5-cy)/ry)**2<=1)pixels[y*32+x]=c;};
 // One broad dark cannon with a white-blue end ring, matching the single cast.
 R(2,6,25,20,'#6555a0');R(1,8,26,16,'#b7c5f5');R(3,10,24,12,'#171c35');R(5,11,19,3,'#29223f');
 O(26,16,5,12,'#405fa0');O(26,16,4,11,'#a9d8f2');O(26,16,3,10,'#f3f6ff');O(26,16,2,8,'#12192e');R(3,7,18,2,'#f4f8ff');R(4,23,18,2,'#d5f3ff');
 for(const x of [5,10]){R(x,4,1,4,'#cbe9ff');R(x,24,1,4,'#cbe9ff');}R(0,15,4,2,'#fffdf0');
 cache=pixels.map((c,i)=>c?`<rect x="${i%32+1}" y="${Math.floor(i/32)+1}" width="1" height="1" fill="${c}"/>`:'').join('');return cache;
}
