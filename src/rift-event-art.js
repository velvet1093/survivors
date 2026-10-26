import {RIFT_ENCOUNTERS,RIFT_LIFETIME} from './rift-encounters.js';
const TAU=Math.PI*2;
const definition=id=>RIFT_ENCOUNTERS.find(e=>e.id===id)||RIFT_ENCOUNTERS[0];
function ellipse(c,x,y,rx,ry,color){c.fillStyle=color;c.beginPath();c.ellipse(x,y,rx,ry,0,0,TAU);c.fill();}
function rune(c,x,y,size,color,rotation=0){c.save();c.translate(x,y);c.rotate(rotation);c.strokeStyle=color;c.lineWidth=1.5;c.beginPath();c.moveTo(0,-size);c.lineTo(size*.65,0);c.lineTo(0,size);c.lineTo(-size*.65,0);c.closePath();c.stroke();c.beginPath();c.moveTo(-size*.4,0);c.lineTo(size*.4,0);c.stroke();c.restore();}
export function drawRifts(c,g,reducedMotion=false){
 const portal=g.rifts?.portal;if(!portal||g.mode==='bossrush')return;
 const def=definition(portal.bossId),time=reducedMotion?0:g.time,breath=reducedMotion?1:1+Math.sin(time*2)*.04,x=portal.x,y=portal.y;
 c.save();
 ellipse(c,x,y+8,50,15,'#050a1966');
 const glow=c.createRadialGradient(x,y-34,3,x,y-34,86);glow.addColorStop(0,def.color+'40');glow.addColorStop(1,def.color+'00');c.fillStyle=glow;c.fillRect(x-86,y-120,172,172);
 c.strokeStyle=def.color+'88';c.lineWidth=1;c.setLineDash([7,7]);c.beginPath();c.ellipse(x,y+4,48,16,0,0,TAU);c.stroke();c.setLineDash([]);
 for(let i=0;i<8;i++){const a=i*TAU/8+(reducedMotion?0:time*.12);rune(c,x+Math.cos(a)*48,y+4+Math.sin(a)*16,3,def.color+'aa',a);}
 // A torn vertical seam, rather than an ordinary door: broken crystalline ribs
 // and a midnight interior distinguish it from loot, enemy hazards and scenery.
 c.translate(x,y-35);c.scale(breath,breath);
 ellipse(c,0,0,27,45,'#121025');
 const edge=[[-9,-48],[-24,-34],[-31,-12],[-23,7],[-27,24],[-11,45],[7,48],[24,33],[30,10],[23,-7],[27,-28],[10,-47]];
 c.fillStyle='#302a49';c.beginPath();for(let i=0;i<edge.length;i++){const [a,b]=edge[i];i?c.lineTo(a,b):c.moveTo(a,b);}c.closePath();c.fill();
 c.lineWidth=3;c.strokeStyle=def.color;c.stroke();
 c.fillStyle='#090e20';c.beginPath();c.moveTo(-6,-37);c.lineTo(-17,-20);c.lineTo(-11,-2);c.lineTo(-19,18);c.lineTo(-5,35);c.lineTo(10,35);c.lineTo(17,17);c.lineTo(11,-5);c.lineTo(18,-24);c.lineTo(5,-37);c.closePath();c.fill();
 c.lineWidth=1;c.strokeStyle='#f2e7ff';c.beginPath();c.moveTo(-8,-45);c.lineTo(-23,-33);c.lineTo(-27,-14);c.moveTo(25,13);c.lineTo(21,30);c.lineTo(9,43);c.stroke();
 for(let i=0;i<5;i++){const a=i*TAU/5+(reducedMotion?i*.3:time*.35),ry=16+i*3;rune(c,Math.cos(a)*12,Math.sin(a)*ry,2.5,def.color+(i%2?'cc':'88'),-a);}
 c.restore();
 c.save();c.textAlign='center';c.font='700 9px "DM Sans",sans-serif';c.lineWidth=3;c.strokeStyle='#101421';c.strokeText('CALAMITY RIFT',x,y-96);c.fillStyle='#f7e9d3';c.fillText('CALAMITY RIFT',x,y-96);
 c.font='600 8px "DM Sans",sans-serif';c.strokeText('APPROACH TO CHOOSE · '+Math.max(0,Math.ceil(RIFT_LIFETIME-portal.age))+'s',x,y+31);c.fillStyle=def.color;c.fillText('APPROACH TO CHOOSE · '+Math.max(0,Math.ceil(RIFT_LIFETIME-portal.age))+'s',x,y+31);c.restore();
}
export function drawRiftCompass(c,g,w,h,reducedMotion=false){
 const portal=g.rifts?.portal,active=g.rifts?.active,boss=active&&g.enemies.find(e=>e.id===active.bossEntityId&&e.hp>0),target=portal||boss;
 if(!target||g.mode==='bossrush'||!['playing','paused','rift'].includes(g.status))return;
 const zoom=g.zoom||1,dx=(target.x-g.p.x)*zoom,dy=(target.y-g.p.y)*zoom,sx=w/2+dx,sy=h/2+dy,meters=Math.round(Math.hypot(target.x-g.p.x,target.y-g.p.y)/10);
 // While a rift is on the map an arrow always points to it: hovering over it when
 // it is in view, pinned to the screen edge when it is not.
 if(sx>42&&sx<w-42&&sy>120&&sy<h-125){
  const def=definition(portal?.bossId||active.bossId),bob=reducedMotion?0:Math.sin((g.time||0)*4)*4,y=sy-(portal?62:(target.r||40)*zoom+40)+bob;
  c.save();c.translate(sx,y);c.beginPath();c.moveTo(0,12);c.lineTo(-10,-2);c.lineTo(-4,-2);c.lineTo(-4,-12);c.lineTo(4,-12);c.lineTo(4,-2);c.lineTo(10,-2);c.closePath();
  c.fillStyle=def.color;c.strokeStyle='#101421';c.lineWidth=2;c.stroke();c.fill();
  c.font='700 8px "DM Sans",sans-serif';c.textAlign='center';c.lineWidth=3;c.strokeText((portal?'RIFT':'RIFT BOSS')+' · '+meters+'m',0,-17);c.fillStyle='#f7e9d3';c.fillText((portal?'RIFT':'RIFT BOSS')+' · '+meters+'m',0,-17);c.restore();
  return;
 }
 const scale=Math.min((w/2-38)/Math.max(Math.abs(dx),1),(h/2-135)/Math.max(Math.abs(dy),1)),x=w/2+dx*Math.max(.05,scale),y=Math.min(h-125,Math.max(140,h/2+dy*Math.max(.05,scale))),angle=Math.atan2(dy,dx),def=definition(portal?.bossId||active.bossId);
 c.save();c.translate(x,y);c.fillStyle='#121724ed';c.strokeStyle=def.color;c.lineWidth=1.5;c.beginPath();c.roundRect(-19,-19,38,38,9);c.fill();c.stroke();c.rotate(angle);c.beginPath();c.moveTo(11,0);c.lineTo(-6,-7);c.lineTo(-2,0);c.lineTo(-6,7);c.closePath();c.fillStyle=def.color;c.fill();c.rotate(-angle);
 const label=(portal?'RIFT':'RIFT BOSS')+' · '+meters+'m';c.font='700 8px "DM Sans",sans-serif';c.textAlign='center';c.lineWidth=3;c.strokeStyle='#101421';c.strokeText(label,0,31);c.fillStyle='#f7e9d3';c.fillText(label,0,31);c.restore();
}
