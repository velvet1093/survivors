const TAU=Math.PI*2;
const clamp=(n,min=0,max=1)=>Math.max(min,Math.min(max,n));
const colors={ink:'#090b1d',core:'#12112b',violet:'#7061c8',blue:'#8cabf3',ice:'#cbf5fa',white:'#fffdf0'};
const poly=(c,points,color)=>{c.fillStyle=color;c.beginPath();points.forEach(([x,y],i)=>i?c.lineTo(x,y):c.moveTo(x,y));c.closePath();c.fill();};
const line=(c,points,color,width=1)=>{c.strokeStyle=color;c.lineWidth=width;c.beginPath();points.forEach(([x,y],i)=>i?c.lineTo(x,y):c.moveTo(x,y));c.stroke();};
const ring=(c,x,y,rx,ry,color,width=1,from=0,to=TAU)=>{c.strokeStyle=color;c.lineWidth=width;c.beginPath();c.ellipse(x,y,Math.max(.2,rx),Math.max(.2,ry),0,from,to);c.stroke();};

function charge(c,u,quiet,over){
 const progress=clamp(u.age/(u.chargeDuration||1.2)),time=quiet?0:u.age,single=u.version>=2||u.beams?.length===1;
 c.save();c.translate(u.x,u.y);c.rotate(u.angle);
 if(!over){
  // One gathering assembly surrounds the seed of the single cannon. Old
  // checkpoints retain their original three staggered casting matrices.
  c.globalAlpha=.25+.35*progress;
  for(let i=0;i<(single?1:3);i++){
   const x=single?12:5+i*18,r=single?24+progress*43:22+progress*23+i*5;
   ring(c,x,0,r*.24,r,colors.blue,1.5);
   ring(c,x,0,r*.18,r*.76,colors.ice,1);
   if(single)ring(c,x,0,r*.3,r*1.1,colors.violet,1);
   for(let j=0;j<8;j++){const a=j*TAU/8+(quiet?0:time*.5),px=x+Math.cos(a)*r*.24,py=Math.sin(a)*r;line(c,[[px-2,py-3],[px+2,py-3],[px+2,py+3]],j%2?colors.violet:colors.white,1);}
  }
  for(const side of [-1,1]){
   line(c,[[-30,side*60],[-10,side*42],[12,side*37],[43,side*18]],colors.violet,2);
   line(c,[[-26,side*60],[-7,side*44],[14,side*40],[45,side*18]],colors.ice,1);
  }
 }else{
  // A small absolute-dark seed gathers between silver-blue brackets.
  const r=5+progress*(single?15:9);
  poly(c,[[2,-r],[14,-r],[21,-r*.3],[21,r*.3],[14,r],[2,r],[-3,r*.3],[-3,-r*.3]],colors.core);
  line(c,[[0,-r-2],[14,-r-2],[22,-r*.3]],colors.white,2);
  line(c,[[-2,r*.3],[3,r+2],[15,r+2],[22,r*.3]],colors.blue,2);
  if(!quiet)for(let i=0;i<15;i++){
   const a=i*2.399+time*.4,radius=18+(1-(time*.8+i*.113)%1)*36,x=Math.cos(a)*radius*.65,y=Math.sin(a)*radius;
   c.fillStyle=i%3?colors.ice:colors.violet;c.fillRect(Math.round(x),Math.round(y),i%3?2:3,1);
  }
 }
 c.restore();
}

function impact(c,radius,reach,elapsed,fade,quiet,over){
 const travel=quiet?.45:clamp((elapsed-.08)/.55),front=quiet?reach:Math.max(12,reach),count=quiet?6:15;
 if(over){
  // A single outward surge accompanies the release, not a repeating pulse.
  const opening=quiet?.3:clamp(1-elapsed/.38),rr=radius*(.98+(quiet?.15:elapsed*1.25));
  c.globalAlpha=fade*opening*.75;
  ring(c,12,0,rr*.2,rr,colors.ice,5);
  ring(c,16,0,rr*.26,rr*1.07,colors.violet,2);
  if(elapsed>=.09||quiet){
   c.globalAlpha=fade*(quiet?.4:.75*(1-travel*.6));
   const spread=radius*(1+travel*.75);
   ring(c,front,0,spread*.3,spread,colors.ice,quiet?2:4);
   ring(c,front+5,0,spread*.39,spread*1.1,colors.blue,2,-Math.PI*.48,Math.PI*.48);
  }
 }else if(elapsed>=.08||quiet){
  // Ground fragments lift away from the collision face as in the reference.
  for(let i=0;i<count;i++){
   const side=i%2?1:-1,scatter=quiet?.35:travel,x=front-10+(i%5-2)*(12+scatter*24),y=side*(radius*.8+scatter*(18+i%4*13)),size=3+i%4*2;
   c.globalAlpha=fade*(.45+(i%3)*.12);
   poly(c,[[x,y-size],[x+size,y-size*.5],[x+size*.6,y+size],[x-size*.7,y+size*.4]],i%3?'#b8b9c3':'#e3e6ed');
   if(!quiet){c.globalAlpha=fade*.35;line(c,[[x-(5+scatter*12),y+side*7],[x,y]],colors.blue,1.5);}
  }
 }
}

function beam(c,b,age,quiet,over,index){
 const elapsed=age-b.at,duration=Number.isFinite(b.duration)&&b.duration>0?b.duration:1.25;if(elapsed<0||elapsed>=duration)return;
 const length=Number.isFinite(b.length)?b.length:Math.hypot(b.tx-b.x,b.ty-b.y),radius=Math.max(8,b.width||32),fade=clamp((duration-elapsed)/.34),reach=quiet?length:Math.max(12,length*clamp(elapsed/.12)),time=quiet?0:elapsed,single=Number.isFinite(b.duration);
 c.save();c.translate(b.x,b.y);c.rotate(b.angle);c.globalAlpha=fade;
 if(!over){
  c.globalAlpha=fade*.18;
  poly(c,[[0,13-radius*.8],[reach,13-radius*.8],[reach+18,13+radius*.8],[0,13+radius*.8]],'#070b21');
  c.globalAlpha=fade*.28;
  line(c,[[0,13-radius*.82],[reach,13-radius*.82]],colors.blue,1);
  line(c,[[0,13+radius*.82],[reach,13+radius*.82]],colors.violet,1);
  if(single)impact(c,radius,reach,elapsed,fade,quiet,false);
  c.restore();return;
 }
 // Layered stepped shells have hard edges: the beam reads as a dark cylinder,
 // with the front rim and longitudinal light carrying the mass in the reference.
 const body=(margin,color)=>poly(c,[[0,-radius*.65-margin],[8,-radius*.9-margin],[reach-12,-radius-margin],[reach,-radius*.88-margin],[reach,radius*.88+margin],[reach-12,radius+margin],[8,radius*.9+margin],[0,radius*.65+margin]],color);
 c.globalAlpha=fade*.19;body(11,colors.violet);c.globalAlpha=fade*.35;body(6,colors.blue);
 c.globalAlpha=fade;body(3,colors.ice);body(0,colors.violet);body(-3,colors.ink);
 poly(c,[[6,-radius*.58],[reach-10,-radius*.7],[reach-5,-radius*.38],[6,-radius*.3]],colors.core);
 poly(c,[[5,radius*.42],[reach-8,radius*.63],[reach-5,radius*.81],[7,radius*.64]],'#181531');
 line(c,[[6,-radius*.78],[reach*.23,-radius*.86],[reach*.23+18,-radius*.8],[reach*.61,-radius*.86],[reach*.61+14,-radius*.96],[reach-10,-radius*.91]],colors.white,2.5);
 line(c,[[6,radius*.79],[reach*.36,radius*.88],[reach*.36+16,radius*.81],[reach*.72,radius*.89],[reach-7,radius*.86]],colors.ice,2.5);
 // Thin dark cracks and double highlights break up a flat filled rectangle.
 for(let i=0;i<4;i++){
  const y=(i-1.5)*radius*.35,x0=16+(i%2)*14,x1=reach*(.45+i*.1);
  line(c,[[x0,y],[x1*.45,y-2],[x1*.45+12,y+1],[x1,y]],i%2?'#3e3267':'#242143',1.5);
 }
 const capX=reach,capRx=radius*.28;
 c.fillStyle=colors.ink;c.beginPath();c.ellipse(capX,0,capRx,radius,0,0,TAU);c.fill();
 ring(c,capX,0,capRx+2,radius+2,colors.blue,5);
 ring(c,capX,0,capRx,radius,colors.white,2.7);
 ring(c,capX-2,0,capRx*.62,radius*.88,colors.violet,1.5);
 // Rings are behind the moving face, never change its damage geometry.
 const count=quiet?3:5;
 for(let i=0;i<count;i++){
  const x=Math.min(reach-8,18+i*29),rr=radius*(1.15+i*.1);
  c.globalAlpha=fade*(.72-i*.08);ring(c,x,0,rr*.19,rr,i%2?colors.blue:colors.white,i%2?1.8:2.6,-Math.PI*.58,Math.PI*.61);
  ring(c,x,0,rr*.19,rr,colors.violet,2,Math.PI*.66,Math.PI*1.38);
 }
 c.globalAlpha=fade*.75;
 for(let i=0;i<(quiet?8:22);i++){
  const step=i/(quiet?8:22),x=14+step*Math.max(1,reach-18),side=i%2?1:-1,drift=quiet?0:Math.sin(time*8+i*1.7)*3,y=side*(radius+6+i%3*2+drift),w=5+i%4*3;
  c.fillStyle=i%3?colors.ice:colors.violet;c.fillRect(Math.round(x),Math.round(y),w,i%4?1:2);
 }
 if(!quiet){
  c.globalAlpha=fade*.4;
  for(let i=0;i<7;i++){
   const x=reach-30-i*12,y=Math.sin(i*2.399+index)*radius*.8;
   line(c,[[x-17,y-3],[x-5,y],[x,y-1]],i%2?colors.violet:colors.ice,1);
  }
 }
 if(single)impact(c,radius,reach,elapsed,fade,quiet,true);
 c.restore();
}

export function drawFrierenBarrage(c,g,layer='over'){
 const u=g?.ultimate;
 if(u?.type!=='frieren-barrage'||![u.x,u.y,u.angle,u.age].every(Number.isFinite)||!Array.isArray(u.beams))return false;
 const over=layer==='over',quiet=!!g.p?.reducedMotion;
 c.save();
 if(u.age<(u.chargeDuration||1.2))charge(c,u,quiet,over);
 for(let i=0;i<u.beams.length;i++){
  const b=u.beams[i];if(![b.x,b.y,b.angle,b.at].every(Number.isFinite))continue;
  beam(c,b,u.age,quiet,over,i);
 }
 c.restore();return true;
}
