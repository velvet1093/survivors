// Illustration only: every flourish is read from the saved marks that deal damage,
// so none of this art creates hitboxes or moves a warning.
const TAU=Math.PI*2,clamp=n=>Math.max(0,Math.min(1,Number.isFinite(n)?n:0));
const ids=new Set(['eisenwald','vulcan','phantomshade','orctrooper','megalodon','lizardman','jellal','geld','kokushibo']);
const STAR='#efe4ff',VIOLET='#b49ae6',ROT='#a6c26a',MOON='#e8b0c4',INK='#1e2232';
const point=v=>v&&Number.isFinite(v.x)&&Number.isFinite(v.y);
function line(c,pts,color,width=1){c.strokeStyle=color;c.lineWidth=width;c.lineCap='round';c.beginPath();pts.forEach(([x,y],i)=>i?c.lineTo(x,y):c.moveTo(x,y));c.stroke();}
function ring(c,x,y,r,color,width=1){c.strokeStyle=color;c.lineWidth=width;c.beginPath();c.arc(x,y,Math.max(.1,r),0,TAU);c.stroke();}
function star(c,x,y,s,color){c.fillStyle=color;c.beginPath();for(let i=0;i<8;i++){const a=i*TAU/8,rr=i%2?s*.4:s;c.lineTo(x+Math.cos(a)*rr,y+Math.sin(a)*rr);}c.closePath();c.fill();}
function crescent(c,x,y,r,angle,color){c.save();c.translate(x,y);c.rotate(angle);c.strokeStyle=color;c.lineWidth=3;c.beginPath();c.arc(0,0,r,-1.1,1.1);c.stroke();c.lineWidth=1;c.beginPath();c.arc(-r*.25,0,r*.8,-.9,.9);c.stroke();c.restore();}
export function drawExpeditionAttack(c,e,reducedMotion=false){
 const u=e?.expeditionAttack;
 if(!u||!ids.has(e.archetype)||e.hp<=0||!Number.isFinite(u.age)||u.age<0||u.age>=u.duration)return false;
 const t=clamp(u.age/u.duration),pulse=reducedMotion?.5:.5+.5*Math.sin(u.age*8);
 c.save();
 for(const h of u.marks||[]){
  if(!point(h))continue;const lead=clamp(u.age/Math.max(.1,h.delay||1)),cx=h.shape==='line'?(h.x+h.tx)/2:h.x,cy=h.shape==='line'?(h.y+h.ty)/2:h.y;
  c.globalAlpha=.25+.55*lead;
  if(['grandchariot','altairis','meteor'].includes(u.style)){star(c,cx,cy,6+lead*6,u.style==='altairis'?VIOLET:STAR);if(u.style==='altairis')ring(c,cx,cy,(h.r||20)*(1-lead*.3),'#5a4a8a',2);}
  else if(['starved','chaoseater'].includes(u.style)){ring(c,cx,cy,(h.r||20)*(.4+.6*lead),ROT,2);for(let i=0;i<4;i++){const a=i*TAU/4+u.age;c.fillStyle=ROT;c.fillRect(cx+Math.cos(a)*(h.r||20)*.5-1,cy+Math.sin(a)*(h.r||20)*.5-1,3,3);}}
  else if(['darkmoon','perpetualnight','moonbow'].includes(u.style)&&h.shape==='line'){const angle=Math.atan2(h.ty-h.y,h.tx-h.x);for(const k of [.25,.5,.75])crescent(c,h.x+(h.tx-h.x)*k,h.y+(h.ty-h.y)*k,10+lead*6,angle+Math.PI/2,MOON);}
  else if(u.style==='meatcleaver'&&h.shape==='line')line(c,[[h.x,h.y],[h.tx,h.ty]],'#c7a86a88',2);
  else if(u.style==='vulcanleap')ring(c,cx,cy,(h.r||30)*(1.4-lead*.4),'#f2efe6',2);
 }
 c.globalAlpha=.35+.3*pulse;
 // A glow at the caster keeps each windup readable even before marks fill.
 const glow=u.style==='altairis'?VIOLET:['starved','chaoseater','meatcleaver'].includes(u.style)?ROT:['darkmoon','perpetualnight','moonbow'].includes(u.style)?MOON:STAR;
 ring(c,e.x,e.y-Math.min(60,(e.r||20)*1.4),4+t*4,glow,2);
 c.restore();return true;
}
// Rift tells for Acnologia and Milim: a halo of dragon scales or stars over the target.
export function drawExpeditionRiftAttack(c,e,reducedMotion=false){
 const u=e?.riftAttack;if(!u||!['acnologia','milim'].includes(e.archetype)||e.hp<=0||!point(u)||!Number.isFinite(u.age)||u.age>=u.duration)return false;
 const t=clamp(u.age/u.duration),spin=reducedMotion?0:u.age*1.4,color=e.archetype==='acnologia'?'#9fb6ee':'#ffc8d6';
 c.save();c.globalAlpha=.3+.4*(1-t);
 for(let i=0;i<8;i++){const a=spin+i*TAU/8,r=60+40*t;if(e.archetype==='acnologia')line(c,[[u.x+Math.cos(a)*r,u.y+Math.sin(a)*r],[u.x+Math.cos(a+.25)*(r+14),u.y+Math.sin(a+.25)*(r+14)]],color,3);else star(c,u.x+Math.cos(a)*r,u.y+Math.sin(a)*r,6,color);}
 ring(c,u.x,u.y,30+30*t,e.archetype==='acnologia'?INK:'#f4e08a',2);
 c.restore();return true;
}
