import {raster,outline} from './pixel-characters.js';
// Megumi's Ten Shadows shikigami on the summon canvas, facing right.
// The Divine Dogs are lean shadow wolves with tall ears, a long muzzle and a raised
// brush tail: the white dog has dark streaks around its eyes, the black dog pale ones.
// Evolved (Totality), both grow a spiked mane and bared fangs. Nue is a masked owl
// with a pale face plate and broad layered wings; Storm Nue's wings crackle with lightning.
const DOGS={
 whiteDog:{fur:['#9aa8b4','#dfe4de','#fbfaf2'],mark:'#2c3446',eye:'#c0404e',mane:['#4a5468','#7a869a']},
 blackDog:{fur:['#1c2232','#343e54','#56627a'],mark:'#e6ebe6',eye:'#e8b04a',mane:['#c6cec8','#f2f4ee']},
};
export function divineDogPixels(kind,{frame=0,attack=false,fused=false}={}){
 const pal=DOGS[kind]||DOGS.whiteDog,[dark,mid,light]=pal.fur,r=raster(),{rect:R,poly:P,line:L,put}=r,f=((frame%4)+4)%4,step=[0,3,0,-3][f],bob=f%2?-1:0,ink='#141826';
 const y=bob,legs=(near)=>{for(const [hip,dir,back]of near?[[18,-1,true],[39,1,false]]:[[22,1,true],[35,-1,false]]){
  const s=step*dir,c=near?mid:dark;
  // Back legs bend at the hock; forelegs run straight to the paw.
  if(back){L(hip,56+y,hip-3+s*.4,63,c,4);L(hip-3+s*.4,63,hip-1+s,70,c,3);}else L(hip,56+y,hip+s,70,c,3);
  R(hip-2+s,69,5,2,near?light:mid);}};
 legs(false);
 // Raised brush tail curling up from the rump.
 P([[13,49+y],[8,44+y],[5,36+y],[7,30+y],[10,37+y],[14,42+y],[17,47+y]],dark);P([[13,47+y],[9,42+y],[7,35+y],[9,34+y],[12,40+y],[15,45+y]],mid);L(7,31+y,8,35+y,light);
 // Deep chest tapering to a lean waist.
 P([[12,50+y],[20,46+y],[36,45+y],[44,49+y],[42,59+y],[34,61+y],[24,58+y],[14,59+y]],dark);P([[14,50+y],[21,47+y],[35,47+y],[42,50+y],[40,57+y],[33,59+y],[24,56+y],[15,57+y]],mid);L(18,48+y,34,47+y,light);
 // Neck and head with a long muzzle and two tall pointed ears.
 P([[34,48+y],[37,38+y],[43,34+y],[49,36+y],[50,42+y],[45,50+y],[38,54+y]],dark);P([[36,47+y],[38,39+y],[43,36+y],[48,38+y],[48,42+y],[44,48+y],[38,51+y]],mid);
 const jaw=attack?3:0;P([[46,39+y],[55,42+y],[55,45+y],[47,46+y]],mid);P([[46,46+y],[54,45+y+jaw],[53,47+y+jaw],[46,48+y]],dark);R(54,42+y,2,2,ink);
 if(attack){L(48,46+y,53,46+y+jaw,'#6a2a32');for(const x of [49,52]){put(x,45+y,'#fbfaf2');put(x,47+y+jaw-1,'#fbfaf2');}}
 for(const [x,h]of [[40,9],[45,10]]){P([[x,37+y],[x+1,37+y-h],[x+4,37+y]],dark);P([[x+1,37+y],[x+1.5,37+y-h+3],[x+3,37+y]],mid);}
 // Eye with the shikigami's streak markings running back along the face.
 R(46,39+y,2,2,pal.eye);put(46,39+y,'#ffffff');L(42,38+y,45,40+y,pal.mark);L(43,42+y,47,41+y,pal.mark);L(39,44+y,42,42+y,pal.mark);
 // Pale chest ruff.
 P([[38,50+y],[42,49+y],[41,56+y],[37,55+y]],light);
 if(fused){// Totality: a spiked mane rises from the shoulders and the eyes burn.
  for(const [x,h]of [[26,7],[30,9],[34,10],[38,8]]){P([[x-2,48+y],[x+1,48+y-h],[x+3,48+y]],pal.mane[0]);L(x,47+y,x+1,49+y-h+2,pal.mane[1]);}
  P([[36,44+y],[40,32+y],[42,40+y]],pal.mane[0]);R(47,38+y,2,1,'#ffe8a0');
 }
 legs(true);
 return outline(r.pixels,ink);
}
export function nuePixels({frame=0,attack=false,fused=false}={}){
 const r=raster(),{rect:R,poly:P,line:L,put}=r,f=((frame%4)+4)%4,flap=[0,-5,-8,-4][f],ink='#140f1e',cx=28;
 const W=fused?['#2a2244','#4a3e72','#8a7ac0']:['#2a2032','#4a3a56','#7a6488'],tip=fused?'#cfe2ff':'#b8a4c4',bolt='#9ec4ff';
 // Two broad wings, each in three feather tiers that sweep up on the beat.
 for(const side of [-1,1]){const X=d=>cx+side*d;
  P([[X(5),36],[X(14),27+flap*.6],[X(24),22+flap],[X(27),27+flap],[X(26),34+flap*.6],[X(22),42],[X(14),48],[X(7),46]],W[0]);
  P([[X(6),37],[X(14),30+flap*.6],[X(22),26+flap],[X(24),30+flap],[X(20),38],[X(13),43],[X(8),43]],W[1]);
  for(let i=0;i<4;i++){const ox=X(12+i*4),oy=44-i*4+flap*(.3+i*.17);P([[ox,oy],[ox+side*2,oy+8],[ox+side*4,oy+1]],W[0]);L(ox,oy+1,ox+side*2,oy+6,W[2]);}
  L(X(8),36,X(23),25+flap,W[2]);put(X(26),28+flap,tip);put(X(25),27+flap,tip);
  if(fused)L(X(10),40,X(15),33+flap*.5,bolt),L(X(15),33+flap*.5,X(18),36+flap*.6,bolt),L(X(18),36+flap*.6,X(24),27+flap,'#ffffff');
 }
 // Compact body and fanned tail feathers.
 P([[cx-7,38],[cx+7,38],[cx+8,50],[cx+4,58],[cx-4,58],[cx-8,50]],W[0]);P([[cx-5,40],[cx+5,40],[cx+6,50],[cx+3,56],[cx-3,56],[cx-6,50]],W[1]);
 for(const dx of [-4,0,4])P([[cx+dx-2,56],[cx+dx+2,56],[cx+dx*1.4,64]],W[0]);
 for(let i=0;i<3;i++)L(cx-3,44+i*4,cx+3,44+i*4,W[2]);
 // Talons, extended forward when it dives.
 const reach=attack?4:0;for(const dx of [-3,3]){L(cx+dx,56,cx+dx,61+reach,'#c8a060',2);for(const t of [-1,0,1])put(cx+dx+t,62+reach,'#f0d890');}
 // The pale owl mask with tufted feather horns and slanted dark eye holes.
 for(const side of [-1,1])P([[cx+side*3,30],[cx+side*8,21],[cx+side*7,30]],W[1]);
 P([[cx-7,29],[cx-4,26],[cx+4,26],[cx+7,29],[cx+6,36],[cx,40],[cx-6,36]],'#d8cdb8');P([[cx-6,29],[cx-3,27],[cx+3,27],[cx+6,29],[cx+5,35],[cx,38],[cx-5,35]],'#f2ead8');
 const glow=fused?'#9ec4ff':attack?'#e8d8ff':'#3a1e30';
 for(const side of [-1,1]){P([[cx+side*1.5,31],[cx+side*5.5,29],[cx+side*5,33],[cx+side*2,33]],'#2a1622');R(cx+side*3.5-(side<0?1:0),31,1,1,glow);}
 P([[cx-1,34],[cx+1,34],[cx,37]],'#d4a050');L(cx,26,cx,29,'#b8a890');
 return outline(r.pixels,ink);
}
