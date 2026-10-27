import {drawLawOfCycles} from './madoka-effects.js';
import {drawUnlimitedVoid} from './gojo-effects.js';
import {drawPanaceaAura} from './maomao-effects.js';
import {drawDenjiUltimate} from './denji-effects.js';
import {drawGluttony} from './rimuru-art-effects.js';
import {drawGutsUltimate} from './guts-effects.js';
import {drawFrierenBarrage} from './frieren-barrage-art.js';
import {drawYukiSingularity} from './yuki-singularity-art.js';
import {drawFeatherineUltimate} from './featherine-effects.js';
import {drawKingCrimson} from './diavolo-effects.js';
const TAU=Math.PI*2;
function oval(c,x,y,rx,ry,color,rotation=0){c.fillStyle=color;c.beginPath();c.ellipse(x,y,Math.max(.1,rx),Math.max(.1,ry),rotation,0,TAU);c.fill();}
export function ultimateUnder(c,g){
  const u=g.ultimate;if(!u)return;c.save();
  if(u.type==='denji'){drawDenjiUltimate(c,g,!!g.p.reducedMotion);
  }else if(u.type==='guts'){drawGutsUltimate(c,g,!!g.p.reducedMotion);
  }else if(u.type==='frieren-barrage'){drawFrierenBarrage(c,g,'under');
  }else if(u.type==='featherine'){drawFeatherineUltimate(c,g,'under');
  }else if(u.type==='rimuru'){drawGluttony(c,g,'under');
  }else if(u.type==='diavolo'){
    const phase=g.p.reducedMotion?0:u.age,r=150;c.strokeStyle='#dfa1b477';c.lineWidth=1.5;c.setLineDash([13,9,3,9]);c.beginPath();c.ellipse(g.p.x,g.p.y-20,r,r*.52,phase*.13,0,TAU);c.stroke();c.setLineDash([]);for(let i=0;i<8;i++){const a=i*TAU/8+phase*.2;c.fillStyle=i%2?'#d2c5d877':'#edb9ae88';c.fillRect(g.p.x+Math.cos(a)*r,g.p.y-20+Math.sin(a)*r*.52,8,2);}drawKingCrimson(c,{x:g.p.x-g.p.facing*33,y:g.p.y-8,facing:g.p.facing,scale:1.25,frame:g.p.reducedMotion?0:Math.floor(u.age*5)%4,opacity:.38});
  }else if(u.type==='yuki'){
    drawYukiSingularity(c,g,'under');
  }else if(u.type==='eren'){for(let i=0;i<8;i++){const a=i*2.399,rr=20+u.age*45;c.globalAlpha=Math.max(0,1-u.age/u.duration)*.5;oval(c,g.p.x+Math.cos(a)*rr,g.p.y-25-u.age*30+Math.sin(a)*rr*.5,9,14,'#e6e9d2');}c.globalAlpha=1;}
  else if(u.type==='megumi'){c.strokeStyle='#c5ccad88';c.lineWidth=1.5;const r=90;c.beginPath();c.ellipse(g.p.x,g.p.y,r,r*.4,0,0,TAU);c.stroke();for(let i=0;i<8;i++){const a=i*TAU/8+u.age*.2;c.fillStyle='#ddd7ab';c.fillRect(g.p.x+Math.cos(a)*r,g.p.y+Math.sin(a)*r*.4,3,3);}}
  else if(u.type==='samus'&&!u.impacted){const r=u.r*.22;c.strokeStyle='#efd18e88';c.lineWidth=1.5;c.beginPath();c.arc(u.x,u.y,r,0,TAU);c.stroke();c.setLineDash([5,9]);c.beginPath();c.arc(u.x,u.y,r+9,-Math.PI/2,-Math.PI/2+TAU*Math.min(1,u.age/2));c.stroke();}
  else if(u.type==='kurumi'){
    const r=u.r*Math.min(1,u.age/.3);c.fillStyle='#7837473b';c.beginPath();c.arc(u.x,u.y,r,0,TAU);c.fill();c.strokeStyle='#deb47a99';c.lineWidth=2;c.stroke();
    c.beginPath();c.arc(u.x,u.y,r*.91,0,TAU);c.stroke();c.textAlign='center';c.textBaseline='middle';c.font='15px serif';
    const numerals=['XII','I','II','III','IV','V','VI','VII','VIII','IX','X','XI'];for(let i=0;i<12;i++){const a=i*TAU/12-Math.PI/2;c.fillStyle='#f4cba4bb';c.fillText(numerals[i],u.x+Math.cos(a)*r*.81,u.y+Math.sin(a)*r*.81);}
    for(const [length,angle] of [[.68,u.age*.7-Math.PI/2],[.44,u.age*.07]]){c.strokeStyle='#ebc08d99';c.beginPath();c.moveTo(u.x,u.y);c.lineTo(u.x+Math.cos(angle)*r*length,u.y+Math.sin(angle)*r*length);c.stroke();}oval(c,u.x,u.y,5,5,'#e5b784');
  }else if(u.type==='esdeath'){const r=u.r*Math.min(1,u.age/.25);c.fillStyle='#6399bc33';c.beginPath();c.arc(u.x,u.y,r,0,TAU);c.fill();c.strokeStyle='#c4e8f2aa';c.lineWidth=2;c.stroke();for(let i=0;i<12;i++){const a=i*TAU/12,x=u.x+Math.cos(a)*r,y=u.y+Math.sin(a)*r;c.strokeStyle='#ddf2f4aa';c.beginPath();c.moveTo(x,y);c.lineTo(u.x+Math.cos(a+.04)*r*.9,u.y+Math.sin(a+.04)*r*.9);c.lineTo(u.x+Math.cos(a-.04)*r*.9,u.y+Math.sin(a-.04)*r*.9);c.stroke();}for(let i=0;i<24;i++){const a=i*2.399,rr=r*Math.sqrt((i+.5)/24);c.fillStyle='#d3edf3aa';c.fillRect(Math.round(u.x+Math.cos(a)*rr),Math.round(u.y+Math.sin(a)*rr),2,2);}}
  else if(u.type==='gojo'){drawUnlimitedVoid(c,u,!!g.p.reducedMotion);
  }else if(u.type==='maomao'){drawPanaceaAura(c,g);
  }else if(u.type==='goku'&&u.age<1.8){c.globalAlpha=.2;c.strokeStyle='#c4f4ff';c.lineWidth=1;c.setLineDash([4,14]);c.beginPath();c.ellipse(u.tx,u.ty,u.r*Math.min(1,u.age),u.r*Math.min(1,u.age),0,0,TAU);c.stroke();}
  else if(u.type==='madoka'){drawLawOfCycles(c,g,'under');
  }

  c.restore();
}
function star(c,x,y,r,color){c.fillStyle=color;c.beginPath();for(let i=0;i<8;i++){const a=i*Math.PI/4,rr=i%2?r*.25:r;if(i)c.lineTo(x+Math.cos(a)*rr,y+Math.sin(a)*rr);else c.moveTo(x+Math.cos(a)*rr,y+Math.sin(a)*rr);}c.closePath();c.fill();}
export function ultimateOver(c,g){
  const u=g.ultimate;if(!u)return;c.save();
  if(u.type==='frieren-barrage'){drawFrierenBarrage(c,g,'over');}
  else if(u.type==='featherine'){drawFeatherineUltimate(c,g,'over');}
  else if(u.type==='rimuru'){drawGluttony(c,g,'over');}
  else if(u.type==='yuki'){drawYukiSingularity(c,g,'over');}
  else if(u.type==='goku'&&u.age<1.8){
    const charge=Math.min(1,u.age/1.2),fly=Math.max(0,Math.min(1,(u.age-1.2)/.6)),x=u.x+(u.tx-u.x)*fly,y=u.y+(u.ty-u.y)*fly-100*(1-fly),r=10+charge*45;
    const aura=c.createRadialGradient(x,y,1,x,y,r*1.9);aura.addColorStop(0,'#b9f1ff99');aura.addColorStop(.6,'#8bd6ff22');aura.addColorStop(1,'#86d8ff00');c.fillStyle=aura;c.fillRect(x-r*2,y-r*2,r*4,r*4);
    const grad=c.createRadialGradient(x-r*.3,y-r*.3,1,x,y,r);grad.addColorStop(0,'#fffdf1');grad.addColorStop(.45,'#d7faff');grad.addColorStop(.8,'#8ddef8');grad.addColorStop(1,'#47a8dc');c.fillStyle=grad;c.beginPath();c.arc(x,y,r,0,TAU);c.fill();
    for(let i=0;i<3;i++){c.strokeStyle='#e5fdff99';c.lineWidth=1.3;c.beginPath();c.ellipse(x,y,r*(.9-i*.13),r*.28,u.age*2+i*1.1,0,TAU);c.stroke();}
    if(u.age<1.2)for(let i=0;i<12;i++){const a=i*TAU/12+u.age*2,rr=65+((1-u.age*.7+i*.12)%1)*80;star(c,x+Math.cos(a)*rr,y+Math.sin(a)*rr*.5,2.3,'#d8f7ff');}
  }else if(u.type==='madoka'){drawLawOfCycles(c,g,'over');
  }
  c.restore();
}
