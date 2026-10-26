import {hasStatus} from './status.js';
import {faceState} from './expressions.js';
import {enemyPixels} from './pixel-enemies.js';
import {characterPixels,pixelRuns,SPRITE_WIDTH,SPRITE_HEIGHT,HERO_SCALE,HERO_FOOT} from './pixel-characters.js';
import {bowPose,bowPixels,BOW_SCALE,BOW_ANCHOR} from './bow.js';
import {enemyMotion} from './enemy-animation.js';
const TAU=Math.PI*2;
function oval(c,x,y,rx,ry,fill,rotation=0){c.fillStyle=fill;c.beginPath();c.ellipse(x,y,Math.max(.1,rx),Math.max(.1,ry),rotation,0,TAU);c.fill();}
const heroFrames=new Map(),bowFrames=new Map();
function bitmap(pixels){const canvas=document.createElement('canvas');canvas.width=SPRITE_WIDTH;canvas.height=SPRITE_HEIGHT;const c=canvas.getContext('2d');for(const run of pixelRuns(pixels)){c.fillStyle=run.color;c.fillRect(run.x,run.y,run.width,1);}return canvas;}
function heroFrame(p,time){
  const frame=p.reducedMotion&&p.pose==='berserk'?0:p.moving?Math.floor((p.walk||0)*2/Math.PI)%4:Math.floor(time*2)%4,pose=p.pose||(p.id==='gojo'&&!p.moving?'domain':''),attack=(p.attackTimer||0)>.08,face=faceState(p,time);
  const evolved=p.fusions?.pallet==='positron'&&p.id==='shinji'?'longinus':p.fusions?.odmblades==='scoutassault'&&p.id==='eren'?'thunderspears':'';
  const key=[p.id,frame,!!p.moving,pose,attack,face.expression,face.blink,p.skin,p.form,evolved].join(':');if(!heroFrames.has(key))heroFrames.set(key,bitmap(characterPixels(p.id,{frame,moving:!!p.moving,pose,attack,...face,skin:p.skin,form:p.form,evolved})));return heroFrames.get(key);
}
function pixelArm(c,x0,y0,x1,y1,color){const n=Math.max(Math.abs(x1-x0),Math.abs(y1-y0),1);c.fillStyle=color;for(let i=0;i<=n;i++)c.fillRect(Math.round(x0+(x1-x0)*i/n),Math.round(y0+(y1-y0)*i/n),2,2);}
function drawBow(c,p,x,y,scale){
  const pose=bowPose({...p,x,y}),variant=p.fusions?.rosebow==='salvation'?'salvation':'base',key=variant+':'+pose.pull;pose.grip={x:x+(pose.grip.x-x)*scale,y:y+(pose.grip.y-y)*scale};if(!bowFrames.has(key))bowFrames.set(key,bitmap(bowPixels(pose.pull,variant)));
  // The bow is drawn in world aim space, outside the body's left/right mirror.
  pixelArm(c,x+(Math.cos(pose.angle)<0?-7:7)*scale,y-22*scale,pose.grip.x,pose.grip.y,'#fff1e5');
  c.save();c.translate(pose.grip.x,pose.grip.y);c.rotate(pose.angle);c.scale(BOW_SCALE*scale,BOW_SCALE*scale);c.imageSmoothingEnabled=false;c.drawImage(bowFrames.get(key),-BOW_ANCHOR.x,-BOW_ANCHOR.y);c.restore();
}
export function drawHero(c,p,x,y,time,alpha=1,scale=1){
  const native=HERO_SCALE*scale*(p.id==='shinji'?1.15:p.id==='eren'&&p.form?1.55:1),pose=p.id==='madoka'?bowPose({...p,x,y}):null,facing=pose?(Math.cos(pose.angle)<0?-1:1):((['goku','maomao','gojo','shinji','frieren','samus','megumi','eren','diavolo','yuki','rimuru','erza','guts','kurumi'].includes(p.id))&&(p.attackTimer||0)>0?(Math.cos(p.aimAngle||0)<0?-1:1):(p.facing||1));
  c.save();c.globalAlpha=alpha;c.imageSmoothingEnabled=false;
  oval(c,x,y+2,10*scale,3*scale,'#05091555');
  if(p.id==='madoka'&&p.pose==='ascend'){
    c.save();c.translate(x,y-25*scale);c.scale(native,native);const flap=Math.floor(Math.sin(time*4)*2);
    for(const side of [-1,1])for(let i=0;i<6;i++){c.fillStyle=i%2?'#ffe5f3':'#fff6e5';c.fillRect(side>0?7+i*4:-12-i*4,-5+i*2+flap,6,16-i);c.fillStyle='#d9bad8';c.fillRect(side>0?7+i*4:-12-i*4,9+i+flap,6,2);}c.restore();
  }
  c.save();c.translate(Math.round(x),Math.round(y));c.scale(facing,1);c.drawImage(heroFrame(p,time),-HERO_FOOT.x*native,-HERO_FOOT.y*native,SPRITE_WIDTH*native,SPRITE_HEIGHT*native);c.restore();
  if(p.id==='gojo'&&['blue','red'].includes(p.castKind)&&(p.attackTimer||0)>0){const x1=x+facing*12*scale,y1=y-30*scale;oval(c,x1,y1,6*scale,6*scale,p.castKind==='red'?'#f5899f66':'#80d1f544');oval(c,x1,y1,3*scale,3*scale,p.castKind==='red'?'#ffd4d4':'#b6e8ff');}
  if(p.id==='madoka')drawBow(c,p,x,y,scale);
  if(p.id==='naruto'&&p.clone&&(p.attackTimer||0)>.1){oval(c,x+facing*13,y-21,8,8,'#83d7f055');oval(c,x+facing*13,y-21,4,4,'#c5f5ff');}
  if(p.shield>0){if(p.passives?.atfield){c.strokeStyle='#ecd49b99';c.lineWidth=1;c.beginPath();for(let i=0;i<=8;i++){const a=i*TAU/8+Math.PI/8,x1=x+Math.cos(a)*25*scale,y1=y-26*scale+Math.sin(a)*30*scale;i?c.lineTo(x1,y1):c.moveTo(x1,y1);}c.stroke();}else{c.strokeStyle='#f9bfe565';c.lineWidth=1;c.beginPath();c.ellipse(x,y-25,21*scale,29*scale,0,0,TAU);c.stroke();}}
  c.restore();
}

const enemyFrames=new Map();
export function drawEnemy(c,e,time,reducedMotion=false,hideUi=false){
 const clock=(e.animTime??time)+(e.phase||0)/TAU,frame=reducedMotion?0:Math.floor(clock*12)%48,attack=Math.min(3,Math.floor((e.attackAnim||0)*5));
 const motion=enemyMotion({...e,phase:0,animTime:frame/12},frame/12,reducedMotion);
 const brainStyle=e.archetype==='motherbrain'&&e.enraged?(e.motherBrainAttack?.style||(e.bossUltimate?'rainbow':'idle')):'',brainStep=brainStyle==='stomp'?Math.round(motion.leg*.5):0;
 const key=[e.archetype,frame,e.moving!==false,attack,e.windup>0,e.dash>0,!!e.enraged,e.cellStage||0,reducedMotion,brainStyle,brainStep].join(':');
 if(!enemyFrames.has(key)){if(enemyFrames.size>=640)enemyFrames.delete(enemyFrames.keys().next().value);enemyFrames.set(key,bitmap(enemyPixels(e.archetype,motion)));}
 const scale=.8*e.r/18;
 c.save();c.imageSmoothingEnabled=false;oval(c,e.x,e.y+2,e.r*.7,e.r*.2,'#080d1b44');if(e.hit>0)c.filter='brightness(1.65)';else if(hasStatus(e,'frozen'))c.filter='saturate(.35) brightness(1.25)';
 c.translate(Math.round(e.x+motion.x),Math.round(e.y+motion.y));c.rotate(motion.rotation);c.scale((e.facing||1)*motion.scaleX,motion.scaleY);c.drawImage(enemyFrames.get(key),-28*scale,-71*scale,56*scale,76*scale);c.restore();
 if(!hideUi&&(e.hp<e.maxHp||e.elite||e.boss)){c.fillStyle='#101426cc';c.fillRect(e.x-e.r,e.y-e.r*3.4,e.r*2,3);c.fillStyle=e.color||'#d5aec9';c.fillRect(e.x-e.r,e.y-e.r*3.4,e.r*2*Math.max(0,e.hp/e.maxHp),3);}
}
