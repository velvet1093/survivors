import {drawSalvationEffect} from './soul-gem-art.js';
import {drawDenjiSlash} from './denji-effects.js';
import {drawMegumiEffect} from './megumi-effects.js';
import {drawPairedEffect} from './paired-attack-art.js';
import {drawDevilAttack} from './devil-attack-art.js';
import {drawGraveyardAttack} from './graveyard-attack-art.js';
import {drawExpeditionAttack} from './expedition-attack-art.js';
import {drawEnemyCircleFx} from './enemy-circle-fx.js';
import {drawRiftArena} from './rift-arena.js';
import {riftTrialActive} from './rift-trials.js';
import {drawRiftTrialWorld,drawRiftTrialOverlay} from './rift-trial-art.js';
import {drawWorldEventWeather,drawWorldEventAttack} from './world-event-art.js';
import {drawBerserkBossAttack} from './berserk-attack-art.js';
import {drawKurumiClockEffect} from './kurumi-shot-art.js';
import {drawGutsSlash} from './guts-effects.js';
import {drawMotherBrainAttack} from './motherbrain-attack-art.js';
import {drawFriendlyDeaths} from './friendly-death-art.js';
import {drawBossDeaths} from './boss-death.js';
import {drawRiftAttack} from './rift-attack-art.js';
import {drawChest} from './chest-art.js';
import {drawRifts,drawRiftCompass} from './rift-event-art.js';
import {drawRiftBossAura} from './rift-superboss-art.js';
import {drawErzaSword,drawErzaEffect,drawErzaUltimate,drawErzaBarrier} from './erza-effects.js';
import {drawTrinketDrops,drawTrinketCosmetics} from './trinket-renderer.js';
import {drawOdmAttack} from './odm-art.js';
import {drawFeatherineGlyphs} from './featherine-effects.js';
import {drawHollowPurpleConvergence,drawHollowPurpleImpact} from './hollow-purple-art.js';
import {drawFrierenGolem,drawFrierenGolemEffects} from './frieren-golem-art.js';
import {garudaCompanionVisible,garudaShotVisible} from './garuda.js';
import {drawOrbitingGaruda} from './garuda-art.js';
import {drawCrimsonStrike} from './diavolo-effects.js';
import {drawBossUltimate} from './boss-ultimate-art.js';
import {drawSummon} from './summon-art.js';
import {drawPet} from './pets.js';
import {drawHeroMechanic} from './mechanic-art.js';
import {drawPlayerProjectile} from './projectiles.js';
import {enemyAura,hazardEmblem} from './anime-art.js';
import {drawEvaEffect,drawEvaAura} from './eva-effects.js';
import {drawMaomaoEffect} from './maomao-effects.js';
import {drawGojoEffect} from './gojo-effects.js';
import {drawMadokaEffect} from './madoka-effects.js';
import {drawGem,drawUnitStatuses,drawCombatField} from './combat-art.js';
import {terrain,propSprite} from './pixel-world.js';
import {drawHero,drawEnemy} from './sprites.js';
import {ultimateUnder,ultimateOver} from './ultimate-art.js';
const TAU=Math.PI*2;
const hash=(x,y)=>{const n=Math.sin(x*127.1+y*311.7)*43758.5453;return n-Math.floor(n);};
function ellipse(c,x,y,rx,ry,color,rotation=0){c.fillStyle=color;c.beginPath();c.ellipse(x,y,Math.max(.1,rx),Math.max(.1,ry),rotation,0,TAU);c.fill();}
function path(c,points,color,width=1){c.strokeStyle=color;c.lineWidth=width;c.beginPath();points.forEach(([x,y],i)=>i?c.lineTo(x,y):c.moveTo(x,y));c.stroke();}
function drawHazards(c,g){
  for(const h of g.hazards){c.save();const active=h.age>=h.delay,progress=Math.min(1,h.age/h.delay);c.strokeStyle=h.color;c.fillStyle=h.color+(active?'44':'13');c.lineWidth=active?3:1.5;
    if(h.shape==='circle'){c.beginPath();c.arc(h.x,h.y,h.r,0,TAU);c.fill();c.setLineDash(active?[]:[5,5]);c.stroke();c.setLineDash([]);c.lineWidth=3;c.beginPath();c.arc(h.x,h.y,h.r+4,-Math.PI/2,-Math.PI/2+TAU*progress);c.stroke();}
    else{c.lineCap='round';path(c,[[h.x,h.y],[h.tx,h.ty]],h.color+(active?'99':'22'),h.width*2);c.setLineDash(active?[]:[10,10]);path(c,[[h.x,h.y],[h.tx,h.ty]],active?'#fff1f6':h.color,active?4:1.5);}
    hazardEmblem(c,h,progress);
    if(h.label&&h.damage>15&&!active){c.fillStyle=h.color;c.font='9px "DM Sans",sans-serif';c.textAlign='center';c.fillText(h.label,h.shape==='circle'?h.x:(h.x+h.tx)/2,h.shape==='circle'?h.y-h.r-10:(h.y+h.ty)/2-12);}
    c.restore();
  }
}
function drawHostileShots(c,g){
  for(const s of g.enemyShots){c.save();c.translate(s.x,s.y);c.rotate(Math.atan2(s.vy,s.vx));const visible=Math.max(1,.75/g.zoom);c.scale(visible,visible);ellipse(c,0,0,Math.max(5,s.r||5)+1,Math.max(5,s.r||5)+1,'#1b2038');c.strokeStyle='#ffd0de';c.lineWidth=1.2;c.stroke();
    if(s.kind==='rinka'){c.strokeStyle='#ffcc8d';c.lineWidth=3;c.beginPath();c.arc(0,0,7,0,TAU);c.stroke();c.strokeStyle='#cc768f';c.lineWidth=1.5;c.beginPath();c.arc(0,0,10,s.age*3,s.age*3+5);c.stroke();}
    else if(s.kind==='plasma'){path(c,[[-14,0],[7,0]],'#a6dbce',5);path(c,[[-8,0],[9,0]],'#f0f4c9',2);}
    else if(s.kind==='drain'){ellipse(c,0,0,6,6,'#c690b0');ellipse(c,1,-1,3,3,'#f1d0d8');path(c,[[-4,3],[-10,6]],'#a9ccbd',2);}
    else if(s.kind==='raven'){path(c,[[-8,4],[-3,-2],[0,1],[5,-5],[11,-2],[3,2],[-2,6]],'#d8d8e0',3);path(c,[[-8,4],[-3,-2],[0,1],[5,-5],[11,-2],[3,2]],'#303448',2);ellipse(c,1,0,2,2,'#e9a4b4');}
    else if(s.kind==='cero'){path(c,[[-17,0],[7,0]],'#8fcbb4',5);path(c,[[-10,0],[9,0]],'#e4f9d7',2);}
    else if(s.kind==='hook'){path(c,[[-17,0],[0,0]],'#d4d3bf66',1);c.strokeStyle='#cbd6df';c.lineWidth=2;c.beginPath();c.arc(2,0,6,-1.4,1.5);c.stroke();}
    else if(s.kind==='icicle'){c.fillStyle='#b8e0f1';c.beginPath();c.moveTo(13,0);c.lineTo(-5,-4);c.lineTo(-9,0);c.lineTo(-5,4);c.fill();path(c,[[-6,0],[9,0]],'#ecfbf5',1);}
    else if(s.kind==='magma'){ellipse(c,0,0,9,7,'#b66356');ellipse(c,2,-1,5,4,'#f0b477');}
    else if(s.kind==='thunder'){path(c,[[-10,0],[-3,-3],[1,2],[10,-2]],'#ecdca1',3);}
    else if(s.kind==='fish'){c.fillStyle='#9bcfd5';c.beginPath();c.moveTo(11,0);c.lineTo(0,-5);c.lineTo(-8,-2);c.lineTo(-13,-7);c.lineTo(-12,7);c.lineTo(-7,2);c.lineTo(0,5);c.fill();c.fillStyle='#eaf0d3';c.fillRect(4,-2,2,2);}
    else if(s.kind==='ember'){c.fillStyle='#d89569';c.fillRect(-6,-4,10,8);c.fillStyle='#ffe2a0';c.fillRect(-1,-2,7,4);path(c,[[-7,-2],[-14,-4]],'#e4aa6c88',2);}
    else if(s.kind==='soul'){ellipse(c,0,0,6,7,'#b99bd3');ellipse(c,2,-2,2,2,'#f4dfe7');path(c,[[-4,3],[-10,5]],'#cab4db77',2);}
    else if(s.kind==='shockwave'){c.strokeStyle='#b9d6e8';c.lineWidth=3;c.beginPath();c.arc(-5,0,10,-1.2,1.2);c.stroke();}
    else if(s.kind==='lance'){path(c,[[-15,0],[12,0]],'#f4dfae',3);path(c,[[4,-5],[4,5]],'#fff4cf',2);}
    else if(s.kind==='slash'){c.strokeStyle='#ffe3eb';c.lineWidth=3;c.beginPath();c.moveTo(-14,-10);c.quadraticCurveTo(8,-1,-14,10);c.stroke();path(c,[[-17,-12],[-20,12]],'#b3577d66',2);}
    else if(s.kind==='gear'){c.rotate(s.age*3);for(let i=0;i<8;i++){c.rotate(TAU/8);c.fillStyle='#e0b2d3';c.fillRect(-1.5,-9,3,5);}c.strokeStyle='#fbe3ea';c.lineWidth=2;c.beginPath();c.arc(0,0,5,0,TAU);c.stroke();ellipse(c,0,0,2,2,'#8b548d');}
    else if(s.kind==='note'){ellipse(c,-2,3,4,3,'#f7c2dc');path(c,[[1,3],[1,-8],[8,-6]],'#f1d9af',2);}
    else if(s.kind==='kunai'||s.kind==='thorn'){c.fillStyle=s.kind==='thorn'?'#f4b7ce':'#d4dde6';c.beginPath();c.moveTo(10,0);c.lineTo(-7,-4);c.lineTo(-2,0);c.lineTo(-7,4);c.fill();path(c,[[-4,0],[-12,0]],s.kind==='thorn'?'#84b59a':'#ac6c85',2);}
    else if(s.kind==='petal')ellipse(c,0,0,8,3,'#ead0f2',s.age*2);
    else{ellipse(c,-3,0,s.r+4,s.r+2,s.color+'33');ellipse(c,0,0,s.r,s.r,s.color);ellipse(c,2,-1,s.r*.4,s.r*.4,'#fff0ed');}
    c.restore();
  }
}
function drawWorldLoot(c,g){
  for(const q of g.world.debris){c.save();c.translate(q.x,q.y-q.z);c.rotate(q.angle);c.globalAlpha=Math.min(1,q.life);c.fillStyle=q.color;c.fillRect(-2,-1,5,3);c.restore();}
  for(const q of g.pickups){c.save();ellipse(c,q.x,q.y+3,8,3,'#050c1d33');c.translate(q.x,q.y-q.z-5-Math.sin(g.time*3+q.phase)*1.5);
    if(q.kind==='money'){ellipse(c,0,0,6,8,'#ddad55');ellipse(c,-1,-1,4,6,'#ffe4a0');path(c,[[0,-4],[0,4]],'#bd8c48',1);}
    else if(q.kind==='food'){c.save();c.rotate(-.4);path(c,[[1,0],[9,5]],'#fff2dd',4);ellipse(c,-3,-3,7,5,'#b67451',.4);ellipse(c,-5,-5,4,2,'#eab482',.4);ellipse(c,10,3,2,2,'#fff3e0');ellipse(c,9,7,2,2,'#fff3e0');c.restore();}
    else if(q.kind==='magnet'){c.strokeStyle='#ed8baf';c.lineWidth=5;c.beginPath();c.moveTo(-6,-6);c.lineTo(-6,1);c.bezierCurveTo(-6,10,6,10,6,1);c.lineTo(6,-6);c.stroke();path(c,[[-6,-6],[-6,-3]],'#e2e6f9',5);path(c,[[6,-6],[6,-3]],'#e2e6f9',5);}
    else if(q.kind==='energy'){c.fillStyle='#9ce3f0';c.beginPath();c.moveTo(2,-10);c.lineTo(-7,2);c.lineTo(0,2);c.lineTo(-2,10);c.lineTo(8,-3);c.lineTo(1,-3);c.fill();}
    else{c.fillStyle='#89bd9d';c.beginPath();c.roundRect(-6,-8,8,13,2);c.fill();c.fillStyle='#d4d9b8';c.beginPath();c.roundRect(-6,1,15,6,2);c.fill();path(c,[[-4,-5],[0,-5],[-4,-1],[0,-1]],'#e6edcf');}
    c.restore();
  }
}
function drawEffects(c,g){
  for(const e of g.effects){const progress=1-e.life/e.max;c.save();c.globalAlpha=Math.min(1,e.life/e.max*2);
    if(drawSalvationEffect(c,e,progress,!!g.p.reducedMotion)||drawPairedEffect(c,e,progress,!!g.p.reducedMotion)||drawKurumiClockEffect(c,e,progress,!!g.p.reducedMotion)||drawGutsSlash(c,e,progress,!!g.p.reducedMotion)||drawDenjiSlash(c,e,progress,!!g.p.reducedMotion)||drawMegumiEffect(c,e,progress,!!g.p.reducedMotion)||drawEvaEffect(c,e,progress,!!g.p.reducedMotion)||drawMaomaoEffect(c,e,progress,!!g.p.reducedMotion)||drawGojoEffect(c,e,progress,!!g.p.reducedMotion)||drawMadokaEffect(c,e,progress,!!g.p.reducedMotion)){c.restore();continue;}
    if(drawErzaEffect(c,e,progress,!!g.p.reducedMotion)){c.restore();continue;}
    if(e.type==='crimson-strike'){drawCrimsonStrike(c,e,progress,!!g.p.reducedMotion);c.restore();continue;}
    if(e.type==='thunder-blast'){c.strokeStyle='#e9c889';c.lineWidth=3;c.beginPath();c.arc(e.x,e.y,e.r*(.25+progress*.75),0,TAU);c.stroke();for(let i=0;i<7;i++){const a=i*2.399,r=e.r*(.3+progress*.6);path(c,[[e.x+Math.cos(a)*r*.3,e.y+Math.sin(a)*r*.3],[e.x+Math.cos(a+.15)*r*.7,e.y+Math.sin(a+.15)*r*.7],[e.x+Math.cos(a)*r,e.y+Math.sin(a)*r]],'#ffedc3',2);}}
    if(e.type==='odm-slash'){drawOdmAttack(c,e,progress,!!g.p.reducedMotion);c.restore();continue;}
    if(e.type==='titan-impact'){const r=e.r*(.3+progress*.7);c.strokeStyle=e.color;c.lineWidth=4*(1-progress)+1;c.beginPath();c.ellipse(e.x,e.y,r,r*.48,0,0,TAU);c.stroke();for(let i=0;i<6;i++){const a=i*TAU/6;path(c,[[e.x+Math.cos(a)*r*.3,e.y+Math.sin(a)*r*.15],[e.x+Math.cos(a)*r,e.y+Math.sin(a)*r*.5]],'#c7b89b',2);}}
    if(e.type==='ki-charge'){const r=e.r*(1-e.life/e.max);ellipse(c,e.x,e.y,r,r,e.color+'55');c.strokeStyle=e.color;c.lineWidth=2;c.beginPath();c.arc(e.x,e.y,Math.max(1,r),0,TAU);c.stroke();}
    if(e.type==='zoltraak'){path(c,[[e.x,e.y],[e.tx,e.ty]],'#34465a',e.width+4);path(c,[[e.x,e.y],[e.tx,e.ty]],e.color,e.width);path(c,[[e.x,e.y],[e.tx,e.ty]],'#fffbed',Math.max(1,e.width*.3));}
    else if(e.type==='powerbomb'){const r=e.r*Math.min(1,progress*1.3);c.strokeStyle='#f9e5ae';c.lineWidth=7*(1-progress)+1;c.beginPath();c.arc(e.x,e.y,r,0,TAU);c.stroke();c.fillStyle='#eac87c12';c.fill();}
    else if(e.type==='clock-mark'||e.type==='clock-muzzle'){const r=e.r*(.5+progress*.5);c.strokeStyle=e.color;c.lineWidth=1;c.beginPath();c.arc(e.x,e.y,r,0,TAU);c.stroke();for(let i=0;i<12;i++){const a=i*TAU/12;path(c,[[e.x+Math.cos(a)*r*.85,e.y+Math.sin(a)*r*.85],[e.x+Math.cos(a)*r,e.y+Math.sin(a)*r]],e.color,1);}path(c,[[e.x,e.y-r*.6],[e.x,e.y],[e.x+r*.45,e.y]],'#f6dfb9',2);}
    else if(e.type==='frost-burst'){const r=e.r*(.2+progress*.8);c.strokeStyle='#cceafa';c.lineWidth=2;c.beginPath();c.arc(e.x,e.y,r,0,TAU);c.stroke();for(let i=0;i<12;i++){const a=i*TAU/12,x=e.x+Math.cos(a)*r,y=e.y+Math.sin(a)*r;path(c,[[x-3,y+6],[x,y-6],[x+3,y+6]],'#d3edf7',2);}}
    else if(e.type==='positron'){c.lineCap='square';path(c,[[e.x,e.y],[e.tx,e.ty]],'#d9c7a533',e.width*3);path(c,[[e.x,e.y],[e.tx,e.ty]],'#efd79c',e.width);path(c,[[e.x,e.y],[e.tx,e.ty]],'#fff9df',3);}
    else if(e.type==='convergence'){drawHollowPurpleConvergence(c,e,progress,g.p.reducedMotion);}
    else if(e.type==='brew-cast'){for(let i=0;i<5;i++){const a=i*TAU/5+progress;ellipse(c,e.x+Math.cos(a)*e.r*progress,e.y+Math.sin(a)*e.r*progress,2,2,'#d7ecab');}}
    else if(e.type==='purple-impact'){drawHollowPurpleImpact(c,e,progress,g.p.reducedMotion);}
    else if(e.type==='blue-collapse'){const r=e.r*(1-progress);c.strokeStyle=e.color;c.lineWidth=3;c.beginPath();c.arc(e.x,e.y,Math.max(.1,r),0,TAU);c.stroke();for(let i=0;i<12;i++){const a=i*TAU/12;path(c,[[e.x+Math.cos(a)*r*.5,e.y+Math.sin(a)*r*.5],[e.x+Math.cos(a)*r,e.y+Math.sin(a)*r]],e.color,1);}}
    else if(e.type==='beam'){
      c.lineCap='round';c.shadowColor=e.color;c.shadowBlur=20;path(c,[[e.x,e.y],[e.tx,e.ty]],e.color+'44',e.width*3);path(c,[[e.x,e.y],[e.tx,e.ty]],e.color,e.width*1.6);path(c,[[e.x,e.y],[e.tx,e.ty]],'#fff8e9',e.width*.5);
      ellipse(c,e.x,e.y,e.width*1.8,e.width*1.8,'#fff6df');
    }else if(e.type==='lightning'){
      const points=[];for(let i=1;i<e.points.length;i++){const a=e.points[i-1],b=e.points[i];if(i===1)points.push([a.x,a.y]);for(let k=1;k<=5;k++){const f=k/5;points.push([a.x+(b.x-a.x)*f+(k===5?0:Math.sin(i*k*23)*12),a.y+(b.y-a.y)*f+(k===5?0:Math.cos(i*k*19)*12)]);}}
      c.shadowColor=e.color;c.shadowBlur=12;path(c,points,e.color+'55',9);path(c,points,e.color,3);path(c,points,'#fffce5',1);
    }else{
      const r=e.r*(.1+progress*.9);c.strokeStyle=e.color;c.lineWidth=5*(1-progress)+1;c.shadowColor=e.color;c.shadowBlur=14;c.beginPath();c.arc(e.x,e.y,r,0,TAU);c.stroke();c.fillStyle=e.color+'0c';c.fill();c.setLineDash([8,18]);c.lineWidth=2;c.beginPath();c.arc(e.x,e.y,r*.8,0,TAU);c.stroke();if(e.type==='void'){c.fillStyle='#15132b66';c.fill();}
    }c.restore();
  }
}
export function drawScene(canvas,g,reducedMotion=false){
  const c=canvas.getContext('2d'),w=innerWidth,h=innerHeight,p=g.p,dpr=Math.min(devicePixelRatio||1,2);p.reducedMotion=reducedMotion;g.view={w,h};g.zoom+=(g.targetZoom-g.zoom)*.16;
  c.setTransform(dpr,0,0,dpr,0,0);c.fillStyle=g.riftArena?.dark||g.map.dark;c.fillRect(0,0,w,h);c.save();const shake=reducedMotion?0:g.shake;c.translate(w/2+Math.sin(g.time*81)*shake,h/2+Math.cos(g.time*77)*shake*.6);c.scale(g.zoom,g.zoom);c.translate(-p.x,-p.y);c.imageSmoothingEnabled=false;
  const vw=w/g.zoom,vh=h/g.zoom,left=p.x-vw/2,top=p.y-vh/2;
  if(!drawRiftArena(c,g,left,top,vw,vh,reducedMotion))for(let x=Math.floor(left/512);x<=Math.floor((left+vw)/512);x++)for(let y=Math.floor(top/512);y<=Math.floor((top+vh)/512);y++)c.drawImage(terrain(g.map,x,y),x*512,y*512,512,512);
  if(riftTrialActive(g)){
    drawRiftTrialWorld(c,g,reducedMotion);
    if(!g.playerDeath&&p.hp>0)drawHero(c,{...p,pose:'',form:p.id==='erza'?(p.erzaForm||0):p.form||0},p.x,p.y,g.time,g.hurtFlash>0?.65:1);
    drawFriendlyDeaths(c,g,reducedMotion);
    c.restore();drawRiftTrialOverlay(c,g,w,h,reducedMotion);return;
  }
  // Ambient drifting petals, fireflies and a gently breathing shrine.
  if(!g.riftArena){c.globalAlpha=.22+Math.sin(g.time)*.08;c.strokeStyle=g.map.color;c.lineWidth=1;c.beginPath();c.ellipse(0,0,75,75,0,0,TAU);c.stroke();c.globalAlpha=1;
  for(let i=0;i<35;i++){const x=left+((hash(i,2)*vw+g.time*(6+i%4))%vw),y=top+((hash(i,3)*vh+g.time*(i%3+2))%vh);if(g.map.id==='garden')ellipse(c,x,y,2.8,1.3,'#f6b5cf88',g.time+i);else ellipse(c,x,y,1.3,1.3,g.map.id==='graveyard'?'#b6dcca66':g.map.id==='moon'?'#b5d7ef66':'#eedc9c66');}}
  for(const gem of g.gems)drawGem(c,gem,g.time,reducedMotion);
  drawRifts(c,g,reducedMotion);
  for(const chest of g.chests)if(!chest.mimicLocked)drawChest(c,chest,g.time,reducedMotion);
  for(const f of g.fields)drawCombatField(c,f,reducedMotion);
  for(const e of g.enemies)drawRiftAttack(c,e,reducedMotion);
  drawHazards(c,g);drawEnemyCircleFx(c,g,reducedMotion);
  drawFrierenGolemEffects(c,g,'under');
  ultimateUnder(c,g);drawErzaUltimate(c,g);drawErzaBarrier(c,g);drawEvaAura(c,g,'under');for(const e of g.enemies){enemyAura(c,e,g.time,reducedMotion);drawRiftBossAura(c,e,g.time,reducedMotion);}if(g.magnetPulse>0){c.save();c.globalAlpha=g.magnetPulse;c.strokeStyle='#bdf0d7';c.lineWidth=2;c.beginPath();c.arc(p.x,p.y,40+(1-g.magnetPulse)*550,0,TAU);c.stroke();c.restore();}
  drawHeroMechanic(c,g,reducedMotion);
  const heroLook={...p,form:p.id==='erza'?(p.erzaForm||0):g.mechanic.id==='goku'?g.mechanic.stage:(p.form||0),pose:g.mechanic.id==='shinji'&&g.mechanic.active>0?'berserk':p.pose};
  const actors=[...(g.golem?.hp>0?[{...g.golem,kind:'frierenGolem'}]:[]),...(garudaCompanionVisible(g)?[{...g.garuda,kind:'garuda'}]:[]),...(g.summons||[]).map(s=>({...s,summonKind:s.kind,kind:'summon'})),...(g.pet?.id!=='none'&&g.pet?[{...g.pet,kind:'pet'}]:[]),...g.world.active.filter(o=>o.hp>0),...g.enemies.filter(e=>e.hp>0).map(e=>({...e,kind:'enemy'})),...g.cloneUnits.map(e=>({...e,kind:'clone'})),...(g.ultimate?.shadows||[]).map(e=>({...e,kind:'shadow'})),...(!g.playerDeath&&p.hp>0?[{x:p.x,y:p.y,kind:'hero'}]:[])].sort((a,b)=>a.y-b.y);
  for(const actor of actors){if(actor.kind==='frierenGolem')drawFrierenGolem(c,actor,reducedMotion,g.hudHidden);else if(actor.kind==='garuda')drawOrbitingGaruda(c,actor,{reduced:reducedMotion,empowered:g.mechanic.active>0,zoom:g.zoom});else if(actor.kind==='summon')drawSummon(c,actor,reducedMotion,g.hudHidden);else if(actor.kind==='pet')drawPet(c,actor,reducedMotion);else if(actor.kind==='prop'){c.save();if(actor.type==='tree'&&Math.abs(p.x-actor.x)<65&&p.y<actor.y&&p.y>actor.y-145)c.globalAlpha=.45;if(actor.hit>0)c.filter='brightness(1.5)';const shake=actor.hit>0?Math.sin(g.time*65)*2:0;const propScale=actor.visualScale||1;c.drawImage(propSprite(g.map,actor.type,actor.seed),actor.x-96*propScale+shake,actor.y-190*propScale,192*propScale,230*propScale);c.restore();if(!g.hudHidden&&Number.isFinite(actor.hp)&&actor.hp<actor.maxHp){c.fillStyle='#1f2331';c.fillRect(actor.x-13,actor.y+7,26,3);c.fillStyle='#e2c999';c.fillRect(actor.x-13,actor.y+7,26*actor.hp/actor.maxHp,3);}}else if(actor.kind==='enemy')drawEnemy(c,actor,g.time,reducedMotion,g.hudHidden);else if(actor.kind==='shadow')drawHero(c,{...p,...actor,id:'kurumi',moving:false,pose:'clock',shield:0},actor.x,actor.y,g.time,.55);else if(actor.kind==='clone')drawHero(c,{...p,...actor,id:'naruto',clone:true,pose:'',shield:0},actor.x,actor.y,g.time,.7);else{if(g.dash&&!reducedMotion)for(let i=1;i<=3;i++)drawHero(c,heroLook,p.x-g.dash.x*i*18,p.y-g.dash.y*i*18,g.time,.3/i);if(p.moving&&!reducedMotion)drawHero(c,heroLook,p.x-p.facing*12,p.y+2,g.time,.13);drawHero(c,heroLook,p.x,p.y,g.time,g.hurtFlash>0?.55+Math.sin(g.time*50)*.25:1);}}
  drawBossDeaths(c,g,reducedMotion);drawFriendlyDeaths(c,g,reducedMotion);drawFrierenGolemEffects(c,g,'over');
  if(!g.hudHidden){for(const e of g.enemies)drawUnitStatuses(c,e,g.time,reducedMotion);drawUnitStatuses(c,p,g.time,reducedMotion,true);}
  if(p.weapons.orbit){const rank=p.weapons.orbit,fused=!!p.fusions.orbit,n=fused?6:1+Math.floor(rank/2),r=(fused?105:65+rank*5)*p.area;
    c.strokeStyle='#96d9ff16';c.beginPath();c.arc(p.x,p.y,r,0,TAU);c.stroke();for(let i=0;i<n;i++){const a=g.time*2.6+i*TAU/n,x=p.x+Math.cos(a)*r,y=p.y+Math.sin(a)*r;ellipse(c,x,y,13,13,'#89cfff22');ellipse(c,x,y,7,7,'#8dcfff');ellipse(c,x-1,y-1,3,3,'#e2f5ff');}}
  for(const s of g.shots)if(garudaShotVisible(g,s)){if(s.type==='requip-sword')drawErzaSword(c,s,{zoom:g.zoom,reducedMotion});else drawPlayerProjectile(c,s,{zoom:g.zoom,area:p.area,reducedMotion});}
  drawWorldLoot(c,g);drawTrinketDrops(c,g,reducedMotion);drawTrinketCosmetics(c,g,reducedMotion);
  ultimateOver(c,g);drawEvaAura(c,g,'over');
  drawEnemyCircleFx(c,g,reducedMotion,'caster');
  for(const e of g.enemies){if(!drawGraveyardAttack(c,e,reducedMotion)&&!drawExpeditionAttack(c,e,reducedMotion))drawWorldEventAttack(c,e,reducedMotion);drawDevilAttack(c,e,reducedMotion);drawBerserkBossAttack(c,e,reducedMotion);drawMotherBrainAttack(c,e,reducedMotion);drawBossUltimate(c,e,reducedMotion);}
  drawHostileShots(c,g);
  drawEffects(c,g);drawFeatherineGlyphs(c,g);
  for(const q of g.particles){c.globalAlpha=Math.min(1,q.life*2);ellipse(c,q.x,q.y,q.size/2,q.size/2,q.color);}c.globalAlpha=1;
  c.textAlign='center';c.font='600 12px "DM Sans",sans-serif';for(const q of g.hudHidden?[]:g.numbers){c.globalAlpha=Math.min(1,q.life*4);c.fillStyle='#101527';c.fillText(q.amount,q.x+1,q.y+1);c.fillStyle=q.color;c.fillText(q.amount,q.x,q.y);}c.globalAlpha=1;c.restore();
  drawWorldEventWeather(c,g,w,h,reducedMotion);
  drawRiftCompass(c,g,w,h,reducedMotion);
  const vignette=c.createRadialGradient(w/2,h/2,w*.15,w/2,h/2,Math.max(w,h)*.73);vignette.addColorStop(0,'#0e101600');vignette.addColorStop(1,'#080b186b');c.fillStyle=vignette;c.fillRect(0,0,w,h);
  drawRiftTrialOverlay(c,g,w,h,reducedMotion);
}
