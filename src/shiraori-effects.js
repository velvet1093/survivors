// Shiraori's effects: an egg sac bursting into silk threads as her brood hatches, a
// spiderling's fangs snapping shut with drops of venom, the Arch Taratect's venom splash
// spinning a web on the ground, and the Queen Taratect's stomp cracking the earth.
const TAU=Math.PI*2,ease=t=>1-(1-t)**3;
function web(c,x,y,r,spin,color,rings=3){
 c.strokeStyle=color;c.lineWidth=1;
 for(let i=0;i<8;i++){const a=i*TAU/8+spin;c.beginPath();c.moveTo(x,y);c.lineTo(x+Math.cos(a)*r,y+Math.sin(a)*r*.6);c.stroke();}
 for(let k=1;k<=rings;k++){const rr=r*k/rings;c.beginPath();for(let i=0;i<=8;i++){const a=i*TAU/8+spin,px=x+Math.cos(a)*rr,py=y+Math.sin(a)*rr*.6;i?c.lineTo(px,py):c.moveTo(px,py);}c.stroke();}
}
function hatch(c,e,t){
 const r=(e.r||46)*ease(t),gold=!!e.fused;
 c.globalAlpha*=1-t;
 // Silk threads fly out from the opened sac while shell fragments scatter.
 c.strokeStyle=gold?'#f4ecf8':'#e4dcef';c.lineWidth=1;
 for(let i=0;i<12;i++){const a=i*TAU/12+.2;c.beginPath();c.moveTo(e.x,e.y);c.quadraticCurveTo(e.x+Math.cos(a+.3)*r*.6,e.y+Math.sin(a+.3)*r*.4,e.x+Math.cos(a)*r,e.y+Math.sin(a)*r*.65);c.stroke();}
 for(let i=0;i<8;i++){const a=i*TAU/8,d=r*.8;c.fillStyle=i%2?'#f6f2f8':'#c4b6d8';c.beginPath();c.ellipse(e.x+Math.cos(a)*d,e.y+Math.sin(a)*d*.65,3,2,a,0,TAU);c.fill();}
 c.fillStyle='#f6f2f8';c.beginPath();c.ellipse(e.x,e.y,8*(1-t)+2,6*(1-t)+1.5,0,0,TAU);c.fill();c.fillStyle='#e2303e';c.fillRect(e.x-2,e.y-1,1,1);c.fillRect(e.x+1,e.y-1,1,1);
}
function bite(c,e,t){
 const s=(e.r||12)*1.4,close=Math.min(1,t*3),fade=1-t;c.globalAlpha*=fade;
 // Two curved fangs swing in and cross over the target.
 for(const side of [-1,1]){const a=side*(.9-close*.8);c.save();c.translate(e.x+side*s*.5,e.y-s*.6);c.rotate(a);
  c.fillStyle='#2a2433';c.beginPath();c.moveTo(-2,0);c.quadraticCurveTo(side*-6,s*.6,side*-1,s*1.1);c.lineTo(1.5,0);c.closePath();c.fill();
  c.fillStyle='#f4f0f6';c.beginPath();c.moveTo(-1,1);c.quadraticCurveTo(side*-4,s*.6,side*-1,s);c.lineTo(.5,1);c.closePath();c.fill();c.restore();}
 // Purple venom drips outward.
 for(let i=0;i<5;i++){const a=i*TAU/5+.4,d=s*(.4+t*1.1);c.fillStyle=i%2?'#b070d8':'#7a3aa8';c.beginPath();c.arc(e.x+Math.cos(a)*d,e.y+Math.sin(a)*d+t*6,1.8*(1-t)+.6,0,TAU);c.fill();}
}
function venom(c,e,t){
 const r=(e.r||70)*(.35+ease(t)*.65);c.globalAlpha*=1-t*.85;
 c.fillStyle='#7a3aa833';c.beginPath();c.ellipse(e.x,e.y,r,r*.6,0,0,TAU);c.fill();
 web(c,e.x,e.y,r,t*.3,'#efe6f6cc');
 for(let i=0;i<9;i++){const a=i*2.399,d=r*(.5+((i*7)%5)/10);c.fillStyle='#9a50c8';c.beginPath();c.arc(e.x+Math.cos(a)*d,e.y+Math.sin(a)*d*.6,2.4*(1-t)+.8,0,TAU);c.fill();}
}
function stomp(c,e,t){
 const r=(e.r||125)*(.25+ease(t)*.75);c.globalAlpha*=1-t;
 // A shock ring, radial ground cracks and webs spat out in a spiral.
 c.strokeStyle='#e9dff0';c.lineWidth=4*(1-t)+1;c.beginPath();c.ellipse(e.x,e.y,r,r*.55,0,0,TAU);c.stroke();
 c.strokeStyle='#6a5a7a';c.lineWidth=2;
 for(let i=0;i<10;i++){const a=i*TAU/10+.15,r0=r*.25,r1=r*(.55+(i%3)*.12);c.beginPath();c.moveTo(e.x+Math.cos(a)*r0,e.y+Math.sin(a)*r0*.55);c.lineTo(e.x+Math.cos(a+.08)*(r0+r1)/2,e.y+Math.sin(a+.08)*(r0+r1)/2*.55);c.lineTo(e.x+Math.cos(a)*r1,e.y+Math.sin(a)*r1*.55);c.stroke();}
 web(c,e.x,e.y,r*.85,-t*.6,'#f4eefa99',2);
 for(let i=0;i<12;i++){const a=i*TAU/12+t,d=r*(.7+t*.3);c.fillStyle=i%2?'#d8cce4':'#a898b8';c.fillRect(e.x+Math.cos(a)*d-1.5,e.y+Math.sin(a)*d*.55-3-t*8,3,3);}
}
export function drawShiraoriEffect(c,e,progress,reduced=false){
 const t=Math.max(0,Math.min(1,progress)),draw={'spider-hatch':hatch,'spider-bite':bite,'venom-splash':venom,'queen-stomp':stomp}[e.type];
 if(!draw)return false;c.save();draw(c,e,reduced?Math.min(t,.5):t);c.restore();return true;
}
