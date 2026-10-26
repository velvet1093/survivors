// Illustration only. Warning positions and timing are read directly from the
// same saved marks that deal damage; none of this scenery creates hitboxes.
const TAU=Math.PI*2,clamp=n=>Math.max(0,Math.min(1,Number.isFinite(n)?n:0));
const BONE='#dce2cf',LIGHT='#f3ecd5',INK='#242b3e',VIOLET='#b7a0d0',GHOST='#d8e6d4',GOLD='#dac38c';
const ids=new Set(['gravezombie','coffincrawler','lanternwisp','shadowstitch','hollowghost','paradehollow','tombsentinel','ryuma','moriah','peronaparade','ainztomb']);
const point=v=>v&&Number.isFinite(v.x)&&Number.isFinite(v.y);
function line(c,pts,color,width=1){c.strokeStyle=color;c.lineWidth=width;c.lineCap='round';c.lineJoin='round';c.beginPath();pts.forEach(([x,y],i)=>i?c.lineTo(x,y):c.moveTo(x,y));c.stroke();}
function poly(c,pts,color,edge){c.fillStyle=color;c.beginPath();pts.forEach(([x,y],i)=>i?c.lineTo(x,y):c.moveTo(x,y));c.closePath();c.fill();if(edge){c.strokeStyle=edge;c.lineWidth=1.5;c.stroke();}}
function oval(c,x,y,rx,ry,color){c.fillStyle=color;c.beginPath();c.ellipse(x,y,Math.max(.1,rx),Math.max(.1,ry),0,0,TAU);c.fill();}
function ring(c,x,y,r,color,width=1){c.strokeStyle=color;c.lineWidth=width;c.beginPath();c.arc(x,y,Math.max(.1,r),0,TAU);c.stroke();}
function bat(c,x,y,size,pose=0){
 c.save();c.translate(x,y);const flap=pose*size*.17;
 poly(c,[[-size,-size*.4-flap],[-size*.68,size*.1],[-size*.34,-size*.04],[0,size*.36],[size*.34,-size*.04],[size*.68,size*.1],[size,-size*.4-flap],[size*.3,-size*.24],[size*.12,-size*.58],[0,-size*.42],[-size*.12,-size*.58],[-size*.3,-size*.24]],INK,VIOLET);
 line(c,[[-size*.13,-size*.12],[size*.13,-size*.12]],LIGHT,1);c.restore();
}
function ghost(c,x,y,size,active,quiet,age){
 c.save();c.translate(x,y);const lift=quiet?0:Math.sin(age*3)*size*.06;
 poly(c,[[-size*.55,lift],[-size*.65,-size*.6+lift],[-size*.4,-size+lift],[0,-size*1.14+lift],[size*.4,-size+lift],[size*.65,-size*.6+lift],[size*.5,lift],[size*.28,size*.43],[0,size*.18],[-size*.23,size*.55]],GHOST,'#75959b');
 for(const side of[-1,1])oval(c,side*size*.24,-size*.62+lift,size*.1,size*.15,INK);
 oval(c,0,-size*.2+lift,size*.17,active?size*.21:size*.12,INK);c.restore();
}
function blade(c,size,active){
 poly(c,[[-3,size*.4],[-3,-size*.65],[0,-size],[3,-size*.65],[3,size*.4]],active?BONE:'#7c9298',INK);
 line(c,[[0,-size*.86],[0,size*.38]],LIGHT,1);line(c,[[-size*.22,size*.45],[size*.22,size*.45]],GOLD,2);line(c,[[0,size*.47],[0,size*.8]],'#7f677c',4);line(c,[[0,size*.48],[0,size*.72]],BONE,1);
}
function skull(c,size){
 poly(c,[[-size,-size*.5],[-size*.6,-size],[size*.6,-size],[size,-size*.5],[size*.82,size*.4],[size*.5,size*.9],[-size*.5,size*.9],[-size*.82,size*.4]],BONE,INK);
 for(const side of[-1,1])oval(c,side*size*.4,-size*.2,size*.23,size*.26,INK);
 poly(c,[[0,size*.05],[-size*.13,size*.35],[size*.13,size*.35]],INK);
 for(let i=-2;i<=2;i++)line(c,[[i*size*.19,size*.5],[i*size*.19,size*.8]],'#68757d',1);
}
function boneHand(c,size,active){
 const lift=active?size*.13:0;
 for(let i=0;i<4;i++){const x=(i-1.5)*size*.22,top=-size*(.8-Math.abs(i-1.5)*.12)-lift;line(c,[[x,size*.1],[x,top]],'#758891',4);line(c,[[x,size*.05],[x,top]],BONE,2);oval(c,x,top+size*.2,2,2,LIGHT);}
 line(c,[[-size*.4,-size*.1],[-size*.65,-size*.42]],BONE,3);poly(c,[[-size*.42,-size*.05],[size*.4,-size*.05],[size*.35,size*.4],[0,size*.6],[-size*.36,size*.38]],BONE,INK);
}
function circleArt(c,e,u,h,progress,active,quiet){
 const r=h.r,style=u.style||'',size=Math.min(r*.45,30);c.save();c.translate(h.x,h.y);c.globalAlpha=active?.8:.2+progress*.2;
 if(e.archetype==='peronaparade'||e.archetype==='hollowghost'||e.archetype==='paradehollow'){
  ghost(c,0,0,size,active,quiet,u.age);if(active)ring(c,0,0,r*.7,'#c4a0c6',1.5);
 }else if(e.archetype==='ainztomb'||e.archetype==='tombsentinel'){
  ring(c,0,0,r*.68,GOLD,1);for(let i=0;i<6;i++){const a=i*TAU/6+(quiet?0:u.age*.08);line(c,[[Math.cos(a)*r*.68,Math.sin(a)*r*.68],[Math.cos(a+TAU/3)*r*.68,Math.sin(a+TAU/3)*r*.68]],'#9786ad',1);}
  skull(c,size*.58);if(active){for(const side of[-1,1])line(c,[[side*size*.7,0],[side*size,size*.5],[side*size*.7,size]],BONE,2);}
 }else if(e.archetype==='ryuma'){
  c.rotate((u.angle||0)*.18);blade(c,size,active);if(style==='graveswords'&&active){line(c,[[-size*.7,size*.7],[-size*.95,size],[size*.5,size*.95]],'#708a8d',2);}
 }else if(e.archetype==='moriah'){
  if(style==='shadowtower'){
   const rise=active?(quiet?1:.7+Math.sin(clamp((u.age-h.delay)/h.duration)*Math.PI)*.3):.4;
   poly(c,[[-size*.65,size*.4],[-size*.9,-size*.9*rise],[-size*.35,-size*1.55*rise],[size*.35,-size*1.6*rise],[size*.9,-size*.85*rise],[size*.65,size*.4]],INK,VIOLET);line(c,[[-size*.3,-size*.9*rise],[size*.3,-size*rise]],VIOLET,2);line(c,[[-size*.35,-size*.3],[size*.35,-size*.25]],'#d4b1cc',2);
  }else{bat(c,0,0,size,quiet?0:Math.sin(u.age*5));if(active)for(let i=0;i<3;i++){const a=i*TAU/3;bat(c,Math.cos(a)*r*.5,Math.sin(a)*r*.5,size*.35,quiet?0:Math.sin(u.age*4+i));}}
 }else if(e.archetype==='lanternwisp'){
  poly(c,[[-size*.5,size*.5],[-size*.6,-size*.2],[-size*.1,-size],[size*.1,-size*.45],[size*.5,-size*.8],[size*.6,size*.15],[size*.2,size*.6]],'#82b7ac',GHOST);poly(c,[[-size*.2,size*.4],[0,-size*.55],[size*.25,-size*.1],[size*.2,size*.4]],LIGHT);
 }else if(e.archetype==='coffincrawler'){
  poly(c,[[-size*.55,-size],[-size*.8,-size*.5],[-size*.55,size],[size*.55,size],[size*.8,-size*.5],[size*.55,-size]],'#665b63',BONE);line(c,[[0,-size*.7],[0,size*.6]],GOLD,2);line(c,[[-size*.3,-size*.2],[size*.3,-size*.2]],GOLD,2);
 }else if(e.archetype==='shadowstitch'){
  const pieces=6;for(let i=0;i<pieces;i++){const a=i*TAU/pieces,rr=r*(active?.65:.35),x=Math.cos(a)*rr,y=Math.sin(a)*rr;poly(c,[[x-5,y+4],[x-4,y-7],[x+3,y-9],[x+6,y+2]],'#8b9992',INK);}
 }else boneHand(c,size,active);
 c.restore();
}
function laneArt(c,e,u,h,progress,active,quiet){
 const dx=h.tx-h.x,dy=h.ty-h.y,length=Math.hypot(dx,dy),width=h.width;if(length<1||width<=0)return;
 c.save();c.translate(h.x,h.y);c.rotate(Math.atan2(dy,dx));c.beginPath();c.rect(0,-width,length,width*2);c.clip();c.globalAlpha=active?.72:.16+progress*.18;
 if(e.archetype==='ryuma'){
  line(c,[[0,0],[length,0]],INK,Math.min(width*1.5,25));line(c,[[0,0],[length,0]],active?LIGHT:BONE,active?Math.min(width*.55,8):2);
  for(let i=1;i<7;i++){const x=length*i/7;line(c,[[x-12,-width*.4],[x,0],[x-12,width*.4]],'#8da8a7',active?2:1);}
 }else if(e.archetype==='peronaparade'||e.archetype==='hollowghost'||e.archetype==='paradehollow'){
  line(c,[[0,0],[length,0]],'#a79caf',Math.min(width,12));for(let i=1;i<6;i++)ghost(c,length*i/6,width*.3,Math.min(width*.55,12),active,quiet,u.age+i);
 }else if(e.archetype==='ainztomb'||e.archetype==='tombsentinel'){
  line(c,[[0,0],[length,0]],'#403349',width*1.45);line(c,[[0,0],[length,0]],'#b19ac7',active?Math.min(width*.75,13):2);for(let i=1;i<6;i++){const x=length*i/6;line(c,[[x-width*.3,-width*.6],[x,0],[x+width*.3,width*.6]],GOLD,1.5);}
 }else if(e.archetype==='moriah'){
  line(c,[[0,0],[length,0]],INK,width*1.5);line(c,[[0,0],[length,0]],VIOLET,active?3:1);for(let i=1;i<7;i++)bat(c,length*i/7,0,Math.min(width*.6,13),quiet?0:Math.sin(u.age*4+i));
 }else{
  line(c,[[0,0],[length,0]],'#566776',width);line(c,[[0,0],[length,0]],BONE,active?3:1.5);for(let i=1;i<6;i++){const x=length*i/6;line(c,[[x-5,-width*.45],[x+5,width*.45]],'#b5c6b7',2);}
 }
 c.restore();
}
export function drawGraveyardAttack(c,e,reducedMotion=false){
 if(!ids.has(e?.archetype)||!(e.hp>0))return false;
 const u=e.graveyardAttack||(['peronaparade','ainztomb','paradehollow','tombsentinel'].includes(e.archetype)?e.worldEventAttack:null);
 if(!u||!Number.isFinite(u.age)||u.age<0||!Number.isFinite(u.duration)||u.duration<=0||u.age>=u.duration)return false;
 c.save();
 // A small casting mote keeps the figure readable through the recovery beat.
 const x=Number.isFinite(u.x)?u.x:e.x,y=Number.isFinite(u.y)?u.y:e.y;
 if(Number.isFinite(x)&&Number.isFinite(y)){c.globalAlpha=.2;ring(c,x,y-Math.min(65,(e.r||24)*1.5),5, e.archetype==='ryuma'?BONE:e.archetype==='ainztomb'?GOLD:VIOLET,1);}
 for(const h of (Array.isArray(u.marks)?u.marks:[]).slice(0,32)){
  if(!point(h)||!Number.isFinite(h.delay)||h.delay<0)continue;
  const duration=Number.isFinite(h.duration)&&h.duration>0?h.duration:.4,after=u.age-h.delay;if(after>duration+.12)continue;
  const progress=clamp(u.age/Math.max(.05,h.delay)),active=after>=0;
  if(h.shape==='circle'&&Number.isFinite(h.r)&&h.r>0)circleArt(c,e,u,{...h,duration},progress,active,reducedMotion);
  else if(h.shape==='line'&&[h.tx,h.ty,h.width].every(Number.isFinite))laneArt(c,e,u,h,progress,active,reducedMotion);
 }
 c.restore();return true;
}
