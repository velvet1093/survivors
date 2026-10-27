// Maomao's apothecary effects: a corked poison vial in flight, its glass shattering on
// impact, a bubbling toxic pool sprouting poisonous blooms (jade and gold once evolved
// into Jade Alchemy), the herb beds of her Panacea Garden and the garden's aura.
const TAU=Math.PI*2;
const ease=t=>1-(1-t)**3;
function blob(c,x,y,r,t,wob=.08,lobes=7){c.beginPath();for(let i=0;i<=40;i++){const a=i*TAU/40,w=1+Math.sin(a*lobes+t)*wob+Math.sin(a*3-t*.7)*wob*.6;i?c.lineTo(x+Math.cos(a)*r*w,y+Math.sin(a)*r*w):c.moveTo(x+Math.cos(a)*r*w,y+Math.sin(a)*r*w);}c.closePath();}
const PAL={plain:{glass:'#d8f4e6',liquid:'#58c07a',deep:'#2e7a4a',cork:'#a87a4a',pool:['#1e4a2c','#3a8a4a','#7ac86a'],bloom:'#c86ad8',bloomCore:'#ffe07a',rim:'#dcf890'},
 jade:{glass:'#e6f8ee',liquid:'#7ad8b0',deep:'#2a8a6a',cork:'#e0b040',pool:['#1a4a40','#2e9a7a','#9ae8c4'],bloom:'#f0c040',bloomCore:'#ffffff',rim:'#c8fff0'}};
// ---- Projectile (local coordinates) ----
export function drawPoisonVial(c,s,reduced=false){
 const P=s.fused?PAL.jade:PAL.plain;
 // A round-bottomed flask with a narrow neck, cork and paper label.
 c.fillStyle='#1a2a24';c.beginPath();c.ellipse(0,3,7.5,7.5,0,0,TAU);c.fill();c.fillRect(-3.5,-9,7,8);
 c.fillStyle=P.glass;c.beginPath();c.ellipse(0,3,6,6,0,0,TAU);c.fill();c.fillRect(-2.5,-8,5,7);
 const slosh=reduced?0:Math.sin(s.age*14)*1.2;c.fillStyle=P.liquid;c.beginPath();c.moveTo(-6,2+slosh);c.lineTo(6,2-slosh);c.lineTo(6,4);c.arc(0,3,6,0,Math.PI);c.closePath();c.fill();
 c.fillStyle=P.deep;c.fillRect(-4,6,8,2);c.fillStyle='#ffffffcc';c.fillRect(-4,-1,2,4);
 c.fillStyle='#efe4c8';c.fillRect(-3,0,6,3);c.fillStyle='#8a5a3a';c.fillRect(-2,1,4,1);
 c.fillStyle=P.cork;c.fillRect(-3,-12,6,4);c.fillStyle='#6a4a2a';c.fillRect(-3,-9,6,1);
 if(s.fused){c.strokeStyle='#e0b040';c.lineWidth=1;c.beginPath();c.arc(0,3,6.5,-.6,.6);c.stroke();}
 if(!reduced)for(let i=0;i<3;i++){const ph=(s.age*3+i/3)%1;c.fillStyle=P.liquid+'aa';c.fillRect(-6-ph*8,6+i*2-ph*4,2,2);}
}
// ---- Field (world coordinates) ----
export function drawPoisonPool(c,f,reduced=false){
 const age=reduced?.5:f.age,fade=Math.min(1,f.life/.6),enter=ease(Math.min(1,f.age/.25)),r=f.r*(.4+enter*.6),panacea=!!f.panacea,P=f.fused?PAL.jade:PAL.plain;
 c.save();c.globalAlpha*=fade;
 if(panacea){drawHerbBed(c,f.x,f.y,r,age);c.restore();return;}
 // A spreading toxic puddle with a wobbling edge.
 c.fillStyle=P.pool[0]+'88';blob(c,f.x,f.y,r,age*1.4,.07);c.fill();
 c.fillStyle=P.pool[1]+'77';blob(c,f.x,f.y,r*.78,-age*1.1,.09,5);c.fill();
 c.strokeStyle=P.rim+'dd';c.lineWidth=2.5;blob(c,f.x,f.y,r,age*1.4,.07);c.stroke();c.strokeStyle=P.rim+'44';c.lineWidth=1;blob(c,f.x,f.y,r*.9,age*1.4,.07);c.stroke();
 // Bubbles rise, swell and pop across the surface.
 for(let i=0;i<12;i++){const a=i*2.399+age*.15,d=r*(.12+((i*7)%11)/14),x=f.x+Math.cos(a)*d,y=f.y+Math.sin(a)*d*.8,ph=(age*.7+i*.19)%1;
  c.strokeStyle=P.pool[2]+(ph<.75?'cc':'55');c.lineWidth=1;c.beginPath();c.arc(x,y-ph*4,1+ph*3,0,TAU);c.stroke();if(ph>.85){c.fillStyle=P.pool[2];c.fillRect(x-3,y-6,1,1);c.fillRect(x+2,y-6,1,1);}}
 // Poisonous blooms sprout around the rim: a stem, two leaves and a bell flower.
 for(let i=0;i<5;i++){const a=i*TAU/5+.4,x=f.x+Math.cos(a)*r*.72,y=f.y+Math.sin(a)*r*.6,grow=Math.min(1,f.age*1.5-i*.1);if(grow<=0)continue;const h=8*grow;
  c.strokeStyle=P.pool[1];c.lineWidth=1.5;c.beginPath();c.moveTo(x,y);c.lineTo(x,y-h);c.stroke();c.fillStyle=P.pool[2];c.fillRect(x-3,y-h*.5,2,1);c.fillRect(x+1,y-h*.6,2,1);
  c.fillStyle=P.bloom;c.beginPath();c.moveTo(x-3,y-h);c.lineTo(x+3,y-h);c.lineTo(x+2,y-h-4);c.lineTo(x-2,y-h-4);c.closePath();c.fill();c.fillStyle=P.bloomCore;c.fillRect(x-.5,y-h-1,1,1);}
 // Faint fumes drift up from the pool.
 if(!reduced)for(let i=0;i<4;i++){const ph=(age*.4+i/4)%1,x=f.x+Math.sin(i*2.1+age)*r*.4;c.fillStyle=P.pool[2]+Math.round((1-ph)*90).toString(16).padStart(2,'0');c.beginPath();c.ellipse(x,f.y-ph*24,3+ph*4,2+ph*2,0,0,TAU);c.fill();}
 c.restore();
}
// The Panacea Garden's fields: a ring of medicinal herbs with white blossoms over a pale pool.
function drawHerbBed(c,x,y,r,age){
 c.fillStyle='#4a8a4a55';blob(c,x,y,r,age,.05);c.fill();c.strokeStyle='#e8f0b4aa';c.lineWidth=1.5;blob(c,x,y,r,age,.05);c.stroke();
 for(let i=0;i<9;i++){const a=i*TAU/9+age*.05,d=r*(.35+(i%3)*.2),hx=x+Math.cos(a)*d,hy=y+Math.sin(a)*d*.8,sway=Math.sin(age*2+i)*1.5;
  c.strokeStyle='#3a7a3a';c.lineWidth=1.5;c.beginPath();c.moveTo(hx,hy);c.quadraticCurveTo(hx+sway,hy-5,hx+sway,hy-9);c.stroke();
  c.fillStyle='#8ad070';c.beginPath();c.ellipse(hx-3+sway,hy-5,3,1.5,-.5,0,TAU);c.fill();c.beginPath();c.ellipse(hx+3+sway,hy-6,3,1.5,.5,0,TAU);c.fill();
  if(i%2===0){c.fillStyle='#ffffff';for(const [dx,dy]of [[-1,0],[1,0],[0,-1],[0,1]])c.fillRect(hx+sway+dx*1.5-1,hy-10+dy*1.5-1,2,2);c.fillStyle='#ffe07a';c.fillRect(hx+sway-.5,hy-10.5,1,1);}}
}
// ---- Effects ----
function shatter(c,e,t){
 const P=e.fused?PAL.jade:PAL.plain,k=ease(t),fade=1-t;
 // Splash ring and flying glass shards.
 c.strokeStyle=P.liquid;c.globalAlpha*=fade;c.lineWidth=3*(1-t)+1;c.beginPath();c.ellipse(e.x,e.y,8+k*(e.r||40)*.6,(8+k*(e.r||40)*.6)*.5,0,0,TAU);c.stroke();
 for(let i=0;i<9;i++){const a=i*TAU/9+.3,d=4+k*26,x=e.x+Math.cos(a)*d,y=e.y+Math.sin(a)*d*.6-Math.sin(t*Math.PI)*10;c.fillStyle=i%3?P.glass:'#ffffff';c.save();c.translate(x,y);c.rotate(a+t*6);c.fillRect(-2,-1,4,2);c.restore();}
 for(let i=0;i<6;i++){const a=i*1.1,d=3+k*14;c.fillStyle=P.liquid;c.fillRect(e.x+Math.cos(a)*d-1,e.y+Math.sin(a)*d*.5-1-Math.sin(t*Math.PI)*6,3,3);}
}
export function drawMaomaoEffect(c,e,progress,reduced=false){
 if(e.type!=='vial-shatter')return false;
 shatter(c,e,Math.max(0,Math.min(1,progress)));return true;
}
// Panacea Garden aura: a slowly turning wreath of herbs and blossoms around Maomao.
export function drawPanaceaAura(c,g){
 const u=g.ultimate,p=g.p,age=p.reducedMotion?0:u.age,R=135;
 c.strokeStyle='#c5e9ab55';c.lineWidth=1;c.setLineDash([3,9]);c.beginPath();c.ellipse(p.x,p.y,R,R*.55,0,0,TAU);c.stroke();c.setLineDash([]);
 for(let i=0;i<18;i++){const a=i*TAU/18+age*.18,x=p.x+Math.cos(a)*R,y=p.y+Math.sin(a)*R*.55;
  c.fillStyle=i%3===0?'#f4f0d8':'#7ac86a';c.save();c.translate(x,y);c.rotate(a+Math.PI/2);c.beginPath();c.ellipse(0,0,i%3===0?2.5:4,i%3===0?2.5:1.8,0,0,TAU);c.fill();c.restore();
  if(i%3===0){c.fillStyle='#ffe07a';c.fillRect(x-.5,y-.5,1,1);}}
 // Healing motes rise from her as she brews.
 for(let i=0;i<8;i++){const ph=(age*.6+i/8)%1,a=i*2.399;c.fillStyle=i%2?'#b8f0a8cc':'#fff2b8aa';c.fillRect(Math.round(p.x+Math.cos(a)*(10+ph*10)),Math.round(p.y-10-ph*50),2,2);}
}
