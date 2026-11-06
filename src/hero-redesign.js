// Native 56 × 76 sprite clusters. Faces use small, quiet eyes rather than large white blocks.
// Eren's Titan forms; his human outfits are drawn in eren-art.js. Frieren lives in frieren-art.js.
export function redrawEren(r,{frame=0,moving=false,pose='',attack=false,expression='neutral',blink=false,skin='default',form=0,evolved=''}={}){
 const {rect,poly,line}=r,ink='#283239',walk=moving?[0,2,0,-2][frame]:0,y=moving?-(frame%2):0,cast=attack||pose==='shift',tone='#e7c5a6',lit='#f4d9b8',shade='#b98e77',hair='#443c36',hairShade='#292c2c',hairLight='#73604b';
 if(form){
  // Long hair frames the shoulders; stepped muscle planes avoid striped torsos.
  poly([[17,20+y],[18,10+y],[25,5+y],[34,7+y],[40,17+y],[42,37],[37,45],[31,37],[23,41],[14,38]],hairShade);
  for(const [x,d]of [[18,-walk],[32,walk]]){poly([[x,48],[x+7,48],[x+7+d,60],[x+5+d,68],[x+d,68],[x-1+d,60]],'#987565');poly([[x+1,50],[x+5,51],[x+5+d,59],[x+2+d,62],[x+1+d,57]],'#d5ac8a');poly([[x+1+d,61],[x+4+d,61],[x+3+d,68],[x+d,68]],'#b28c71');rect(x+d-3,68,11,3,'#c8a184');rect(x+d-2,68,7,1,'#e2bc96');}
  poly([[17,32],[23,29],[34,29],[40,33],[40,41],[35,51],[21,51],[16,42]],'#aa7d6b');poly([[18,32],[23,31],[27,34],[26,39],[20,39],[17,36]],'#d8ae8d');poly([[30,34],[35,31],[39,33],[39,37],[33,40],[29,38]],'#d8ae8d');line(21,32,25,34,'#e9c29d');line(32,34,36,32,'#ebc59c');poly([[24,40],[28,39],[33,40],[33,47],[29,51],[24,47]],'#c79b7e');rect(25,41,3,3,'#dfb491');rect(30,41,3,3,'#dbaf8b');rect(26,46,2,3,'#e2b994');rect(30,46,2,3,'#d8aa85');poly([[20,49],[25,50],[29,53],[34,50],[37,49],[36,54],[20,54]],'#766351');
  const lx=cast?7:12,ly=cast?39:48,rx=cast?46:43,ry=cast?33:47;
  line(17,34,lx,ly-4,'#b68a72',7);line(38,34,rx,ry-3,'#cda080',7);line(17,34,lx+1,ly-4,'#d9b08c',3);line(39,35,rx+1,ry-3,'#edc59c',2);rect(lx-3,ly-2,9,7,'#c4997c');rect(rx-3,ry-2,9,7,'#dfb38c');for(const xx of [0,3,6]){rect(lx-2+xx,ly-2,1,2,'#e3ba95');rect(rx-2+xx,ry-2,1,2,'#f0cca2');}
  poly([[17,25+y],[10,20+y],[14,29+y],[20,30+y]],'#bd8f76');poly([[37,25+y],[44,20+y],[40,30+y],[35,31+y]],'#d2a17f');
  poly([[19,19+y],[24,13+y],[33,14+y],[37,21+y],[36,30+y],[31,36+y],[26,36+y],[21,31+y]],'#bf9378');poly([[23,20+y],[33,20+y],[35,26+y],[32,30+y],[24,29+y],[21,26+y]],'#d8ae8b');
  poly([[17,25+y],[16,17+y],[20,10+y],[28,7+y],[37,12+y],[40,23+y],[36,29+y],[34,20+y],[30,16+y],[26,22+y],[23,18+y],[20,27+y]],hair);poly([[20,19+y],[22,13+y],[28,10+y],[35,14+y],[36,19+y],[30,13+y],[25,17+y],[22,16+y]],hairLight);line(18,28+y,17,35+y,'#65513e',2);line(37,27+y,38,35+y,'#65513e',2);
  for(const xx of [22,32]){line(xx,24+y,xx+3,25+y,ink);rect(xx+1,26+y,3,2,'#97dba4');rect(xx+2,26+y,1,1,'#f0f4bf');}poly([[23,30+y],[28,31+y],[34,30+y],[33,34+y],[27,35+y],[23,33+y]],'#684b43');for(const xx of [24,27,30,32])rect(xx,31+y,2,2,'#ecdbb4');rect(27,35+y,4,1,'#e0b18c');for(const [xx,yy,w,h]of [[lx-3,ly-2,9,9],[rx-3,ry-2,9,9],[19-walk,57,6,9],[33+walk,57,6,9],[23,34,5,4],[31,34,5,4]]){poly([[xx,yy+2],[xx+3,yy],[xx+w,yy+1],[xx+w-1,yy+h],[xx+1,yy+h]],'#658e9a');poly([[xx+2,yy+2],[xx+4,yy+1],[xx+w-2,yy+2],[xx+w-2,yy+h-1],[xx+2,yy+h-2]],'#a9d1d0');line(xx+3,yy+2,xx+3,yy+h-2,'#edf1d4');}return r.pixels;
 }
 return r.pixels;
}
