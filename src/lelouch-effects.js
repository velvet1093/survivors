import {gawainPixels} from './lelouch-art.js';
import {pixelRuns} from './pixel-characters.js';
// Lelouch & C.C.'s effects:
// - Absolute Command: red beams from Lelouch's eye to each commanded enemy, the Geass sigil
//   stamped on them, and a red ring above every enemy still obeying.
// - Checkmate: a sweeping sigil wave for the mass command.
// - The “Die” burst when an order of the Power of the King ends.
// - C.C.'s green-tinted pistol rounds.
// - Gawain: twin Hadron Cannon beams, slash-harken wires and the knightmare itself.
const TAU=Math.PI*2,ease=t=>1-(1-t)**3;
function sigilPath(c,x,y,s){
 c.beginPath();
 const P=pts=>{pts.forEach(([px,py],i)=>i?c.lineTo(x+px*s,y+py*s):c.moveTo(x+px*s,y+py*s));c.closePath();};
 // The bird of the Geass and the Code: diamond head, notched swept wings and a spike tail.
 P([[0,-12],[2.5,-8.5],[0,-5],[-2.5,-8.5]]);P([[-2,-6],[2,-6],[1.5,2],[-1.5,2]]);
 P([[-1.5,-5],[-13,-11],[-10.5,-6],[-14,-4],[-9.5,-2],[-12.5,1],[-6.5,1.5],[-1.5,0]]);P([[1.5,-5],[13,-11],[10.5,-6],[14,-4],[9.5,-2],[12.5,1],[6.5,1.5],[1.5,0]]);P([[-1.5,1],[1.5,1],[0,12]]);
}
export function drawSigil(c,x,y,s,color){c.fillStyle=color;sigilPath(c,x,y,s);c.fill();}
// Called in the projectile's local frame, already rotated to its flight direction.
export function drawCcShot(c,s){
 if(s.type!=='ccshot')return false;
 c.strokeStyle='#a8f08055';c.lineWidth=3;c.beginPath();c.moveTo(-14,0);c.lineTo(2,0);c.stroke();
 c.fillStyle='#d8ffb8';c.fillRect(-6,-1,8,2);c.fillStyle='#ffffff';c.fillRect(0,-1,3,2);return true;
}
const DRAW={
 'geass-command'(c,e,t){
  c.globalAlpha*=1-t;c.strokeStyle='#ff3a52';c.lineWidth=2*(1-t)+1;
  for(const q of e.targets||[]){c.beginPath();c.moveTo(e.x,e.y);c.lineTo(q.x,q.y-14);c.stroke();drawSigil(c,q.x,q.y-14,.9+ease(t)*.6,'#ff3a52');}
  drawSigil(c,e.x,e.y,.5+t*.5,'#ffb0bc');
 },
 'geass-mass'(c,e,t){
  const r=e.r*ease(t);c.globalAlpha*=1-t;c.strokeStyle='#ff3a52';c.lineWidth=4;c.beginPath();c.ellipse(e.x,e.y,r,r*.6,0,0,TAU);c.stroke();
  c.lineWidth=1.5;c.strokeStyle='#ffb0bc';c.beginPath();c.ellipse(e.x,e.y,r*.8,r*.48,0,0,TAU);c.stroke();
  c.save();c.translate(e.x,e.y-40);c.scale(1,.8);drawSigil(c,0,0,4+t*4,'#ff3a5288');c.restore();
  c.textAlign='center';c.font='bold 13px sans-serif';c.globalAlpha=Math.min(1,(1-t)*2.5);c.fillStyle='#1a0a14';c.fillText('ALL OF YOU — OBEY ME!',e.x+1,e.y-99);c.fillStyle='#ff6a7a';c.fillText('ALL OF YOU — OBEY ME!',e.x,e.y-100);
 },
 'geass-die'(c,e,t){const r=e.r*(.3+ease(t)*.7);c.globalAlpha*=1-t;c.fillStyle='#ff3a5233';c.beginPath();c.arc(e.x,e.y,r,0,TAU);c.fill();c.strokeStyle='#ff3a52';c.lineWidth=3*(1-t)+1;c.beginPath();c.arc(e.x,e.y,r,0,TAU);c.stroke();drawSigil(c,e.x,e.y-6,1.2,'#ffb0bc');},
 'cc-muzzle'(c,e,t){c.translate(e.x,e.y);c.rotate(e.angle);c.globalAlpha*=1-t;c.fillStyle='#e8ffb0';c.beginPath();c.moveTo(0,-3);c.lineTo(9,0);c.lineTo(0,3);c.fill();},
 hadron(c,e,t){
  // Twin crimson beams from the shoulder cannons, thinning out as they fade.
  const w=(1-t)*18+2;c.save();c.translate(e.x,e.y);c.rotate(e.angle);
  for(const side of [-1,1]){const oy=side*9;c.globalAlpha=(1-t)*.5;c.fillStyle='#ff3a52';c.fillRect(0,oy-w,e.length,w*2);c.globalAlpha=1-t;c.fillStyle='#ff8a9a';c.fillRect(0,oy-w*.5,e.length,w);c.fillStyle='#fff0f2';c.fillRect(0,oy-w*.18,e.length,w*.36);
   for(let i=0;i<8;i++){const x=(i*73+t*400)%e.length;c.fillStyle='#ffd0d8';c.fillRect(x,oy-w-3,6,2);}}
  c.restore();
 },
 harken(c,e,t){c.globalAlpha*=1-t*.8;c.strokeStyle='#d8b048';c.lineWidth=1.5;for(const q of e.targets||[]){const k=Math.min(1,t*4);c.beginPath();c.moveTo(e.x,e.y);c.lineTo(e.x+(q.x-e.x)*k,e.y+(q.y-e.y)*k);c.stroke();c.fillStyle='#f4dc88';c.fillRect(e.x+(q.x-e.x)*k-2,e.y+(q.y-e.y)*k-2,4,4);}},
 'gawain-land'(c,e,t){const r=e.r*(.3+ease(t)*.7);c.globalAlpha*=1-t;c.strokeStyle='#d8b048';c.lineWidth=3;c.beginPath();c.ellipse(e.x,e.y,r,r*.5,0,0,TAU);c.stroke();c.strokeStyle='#ff3a52';c.lineWidth=1.5;c.beginPath();c.ellipse(e.x,e.y,r*.7,r*.35,0,0,TAU);c.stroke();},
};
export function drawLelouchEffect(c,e,progress,reduced=false){const draw=DRAW[e.type];if(!draw)return false;c.save();draw(c,e,Math.max(0,Math.min(1,reduced&&e.type!=='geass-mass'?Math.min(progress,.5):progress)));c.restore();return true;}
// A red sigil ring floats over every enemy that is still under a Geass order.
export function drawGeassMarks(c,g,reduced=false){
 if(g.p?.id!=='lelouch')return;const t=reduced?0:g.time||0;
 for(const e of g.enemies){if(!(e.geass>0)||e.hp<=0)continue;const k=Math.max(0,Math.min(1,e.geass/(e.geassMax||1))),y=e.y-(e.r||10)*2-14+Math.sin(t*4+e.id)*1.5;
  c.save();c.globalAlpha=.35+.65*k;c.strokeStyle='#ff3a52';c.lineWidth=1.5;c.beginPath();c.ellipse(e.x,e.y,(e.r||10)+6,((e.r||10)+6)*.5,0,0,TAU*k);c.stroke();drawSigil(c,e.x,y,.85,'#ff3a52');c.restore();}
}
// The knightmare replaces the hero sprite while the ultimate lasts.
const frames=new Map();
function gawainBitmap(frame,firing){
 const key=frame+':'+firing;if(frames.has(key))return frames.get(key);
 const canvas=document.createElement('canvas');canvas.width=56;canvas.height=76;const c=canvas.getContext('2d');
 for(const run of pixelRuns(gawainPixels({frame,firing}))){c.fillStyle=run.color;c.fillRect(run.x,run.y,run.width,1);}frames.set(key,canvas);return canvas;
}
export const GAWAIN_SCALE=1.75;
export function drawGawain(c,p,x,y,time,alpha=1,reduced=false){
 const frame=reduced?0:Math.floor(time*3)%2,firing=(p.gawainFiring||0)>0,hover=reduced?0:Math.sin(time*2.5)*3,s=GAWAIN_SCALE;
 c.save();c.globalAlpha=alpha;c.imageSmoothingEnabled=false;
 c.fillStyle='#05091544';c.beginPath();c.ellipse(x,y+2,30,8,0,0,TAU);c.fill();
 // The float system keeps it hovering above the ground.
 c.save();c.translate(Math.round(x),Math.round(y-10+hover));c.scale(p.facing||1,1);if(p.gawainHit>0)c.filter='brightness(1.8)';c.drawImage(gawainBitmap(frame,firing),-28*s,-72*s,56*s,76*s);c.restore();
 // Armor gauge above the crest.
 if(p.gawainArmor!==undefined){const k=Math.max(0,Math.min(1,p.gawainArmor)),bw=56,by=y-10+hover-72*s-8;c.fillStyle='#120e18';c.fillRect(x-bw/2-1,by-1,bw+2,6);c.fillStyle='#3a3048';c.fillRect(x-bw/2,by,bw,4);c.fillStyle=k>.35?'#d8b048':'#ff4a3a';c.fillRect(x-bw/2,by,bw*k,4);c.fillStyle='#f4dc88';c.fillRect(x-bw/2,by,bw*k,1);}
 c.restore();
}
