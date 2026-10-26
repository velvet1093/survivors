import {kingCrimsonPixels,CRIMSON_SCALE} from './diavolo-art.js';
import {pixelRuns} from './pixel-characters.js';
const TAU=Math.PI*2,frames=new Map();
export function drawKingCrimson(c,{x=0,y=0,facing=1,scale=CRIMSON_SCALE,frame=0,attack=false,opacity=1}={}){
 const key=[((frame%4)+4)%4,attack].join(':');if(!frames.has(key)){const canvas=document.createElement('canvas');canvas.width=56;canvas.height=76;const ctx=canvas.getContext('2d');for(const run of pixelRuns(kingCrimsonPixels({frame,attack}))){ctx.fillStyle=run.color;ctx.fillRect(run.x,run.y,run.width,1);}frames.set(key,canvas);}
 c.save();c.globalAlpha*=opacity;c.imageSmoothingEnabled=false;c.translate(Math.round(x),Math.round(y));c.scale(facing*scale,scale);c.drawImage(frames.get(key),-28,-71);c.restore();
}
function fist(c,x,y,angle,scale=1,echo=false){
 c.save();c.translate(x,y);c.rotate(angle);c.scale(scale,scale);c.fillStyle=echo?'#b58ab4':'#a34566';c.fillRect(-10,-7,18,14);c.fillStyle=echo?'#e1c1dd':'#e8e6d3';c.fillRect(-8,-6,15,5);c.fillRect(4,-4,5,9);c.fillStyle=echo?'#c59cce':'#dc889a';c.fillRect(-7,0,10,5);c.fillStyle='#6d4058';for(let i=-5;i<4;i+=4)c.fillRect(i,-5,1,5);c.restore();
}
function impact(c,x,y,angle,size,echo){
 c.save();c.translate(x,y);c.rotate(angle);c.strokeStyle=echo?'#dfb5e6':'#f3d4bd';c.lineWidth=2;c.beginPath();for(const [a,l]of [[-.8,.8],[-.4,1],[0,.75],[.45,1],[.85,.7]]){c.moveTo(Math.cos(a)*size*.25,Math.sin(a)*size*.25);c.lineTo(Math.cos(a)*size*l,Math.sin(a)*size*l);}c.stroke();c.restore();
}
export function drawCrimsonStrike(c,e,progress,reduced=false){
 const angle=e.angle??Math.atan2((e.ty??e.y)-e.y,(e.tx??e.x+1)-e.x),radius=e.r||110,echo=!!(e.echo||e.fused),facing=Math.cos(angle)<0?-1:1,phase=reduced?.55:progress,lunge=Math.sin(Math.min(1,phase*1.6)*Math.PI/2),reach=radius*(.48+lunge*.31),fade=reduced?.8:Math.min(1,(1-progress)*2);
 c.save();c.globalAlpha*=fade;
 const standX=e.x+Math.cos(angle)*(10+lunge*25),standY=e.y+Math.sin(angle)*15+8;
 drawKingCrimson(c,{x:standX,y:standY,frame:reduced?1:Math.floor(progress*12)%4,attack:true,facing,scale:e.ultimate?1.28:CRIMSON_SCALE,opacity:echo?.48:.9});
 const count=e.ultimate?8:echo?4:3;
 for(let i=0;i<count;i++){
  const a=e.ultimate?angle+i*TAU/count:angle+(i-(count-1)/2)*.19,rr=e.ultimate?radius*(.42+(i%3)*.12):reach-(i%2)*18,xx=e.x+Math.cos(a)*rr,yy=e.y-22+Math.sin(a)*rr;
  c.globalAlpha=fade*(echo?.55:i===count-1?1:.65);fist(c,xx,yy,a,e.ultimate?.95:1,echo);
  // Short straight strike trails replace the previous broad decorative slash arcs.
  c.strokeStyle=echo?'#ceabd8':'#e6a1b5';c.lineWidth=i===count-1?3:1.5;c.beginPath();c.moveTo(xx-Math.cos(a)*32,yy-Math.sin(a)*32);c.lineTo(xx-Math.cos(a)*9,yy-Math.sin(a)*9);c.stroke();impact(c,xx+Math.cos(a)*9,yy+Math.sin(a)*9,a,15+(e.ultimate?8:0),echo);
 }
 c.globalAlpha=fade*.8;if(e.ultimate){c.strokeStyle='#f3c7bd';c.lineWidth=2;c.beginPath();c.ellipse(e.x,e.y-18,radius*(.5+phase*.25),radius*(.26+phase*.15),0,0,TAU);c.stroke();}
 c.restore();
}
