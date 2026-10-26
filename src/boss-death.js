import {drawEnemy} from './sprites.js';

// Deaths use simulation time and stay on the checkpointed enemy until its one
// final loot payment. Normal combat can continue around the defeated body.
export function queueBossDeaths(g){
 g.bossDeaths??=[];let queued=0;
 for(const e of g.enemies||[]){
  if(!e.boss||e.hp>0||e.deathQueued||e.deathComplete)continue;
  e.deathQueued=true;e.moving=false;e.dash=0;e.attackAnim=0;e.windup=0;
  const duration=g.p?.reducedMotion?.2:1.45;
  g.bossDeaths.push({id:e.id,age:0,duration,enemy:{...e,statuses:{},hit:0,moving:false,attackAnim:0,windup:0,dash:0},theme:e.family==='aot'?'steam':e.archetype.includes('walpurgis')?'curtain':e.family==='dragonball'?'ki':'soul'});
  g.enemyShots=(g.enemyShots||[]).filter(s=>s.sourceId!==e.id);
  g.hazards=(g.hazards||[]).filter(h=>h.sourceId!==e.id);
  g.invuln=Math.max(g.invuln||0,duration+.2);queued++;
 }
 return queued;
}
export const bossDeathPending=(g,e)=>!!e?.boss&&e.hp<=0&&!e.deathComplete;
export function updateBossDeaths(g,dt){
 if(g.status!=='playing'||g.bossIntro)return;
 const step=Number.isFinite(dt)?Math.max(0,dt):0;
 for(const death of g.bossDeaths||[]){
  death.age+=step;
  if(death.age>=death.duration){const enemy=g.enemies?.find(e=>e.id===death.id);if(enemy)enemy.deathComplete=true;}
 }
 g.bossDeaths=(g.bossDeaths||[]).filter(death=>death.age<death.duration+.12);
}
export function restoreBossDeaths(g){
 g.bossDeaths=Array.isArray(g.bossDeaths)?g.bossDeaths.filter(d=>d&&Number.isFinite(d.id)&&Number.isFinite(d.age)&&d.enemy):[];
 for(const e of g.enemies||[])if(e.boss&&e.hp<=0&&e.deathQueued&&!e.deathComplete&&!g.bossDeaths.some(d=>d.id===e.id)){
  // A partial legacy checkpoint must finish its death, never become unlootable.
  e.deathQueued=false;
 }
 return g.bossDeaths;
}
const TAU=Math.PI*2;
export function drawBossDeaths(c,g,reducedMotion=false){
 for(const death of g.bossDeaths||[]){
  if(death.age>=death.duration)continue;
  const e=death.enemy,p=Math.max(0,Math.min(1,death.age/death.duration)),scale=.8*(e.r||35)/18,width=56*scale,height=76*scale,color=e.color||'#cfb4e9';
  const body={...e,x:0,y:0,boss:false,elite:false,hp:1,maxHp:1,animTime:0,phase:0};
  c.save();c.translate(e.x,e.y);c.globalAlpha=1-p*.9;
  if(reducedMotion){drawEnemy(c,body,0,true);c.restore();continue;}
  // Pixel bands peel into motes. Their drift follows the same saved age after
  // pause/reload and never changes collision or the already-empty health pool.
  const bands=10,bandHeight=height/bands;
  for(let i=0;i<bands;i++){
   c.save();const spread=Math.max(0,p-.18)*18,dx=Math.sin(i*2.399)*spread;
   c.translate(dx,-p*p*(death.theme==='steam'?18:9));
   c.beginPath();c.rect(-width*.65,-height+bandHeight*i,width*1.3,bandHeight+1);c.clip();
   c.globalAlpha=(1-p)*(i%2?.85:1);drawEnemy(c,body,0,true);c.restore();
  }
  c.globalAlpha=(1-p)*.55;c.fillStyle=color;
  for(let i=0;i<22;i++){
   const a=i*2.399,travel=(12+p*55)*(i%4+1)/4,x=Math.cos(a)*width*.3+Math.cos(a)*travel,y=-height*.4+Math.sin(a)*height*.3-p*(death.theme==='steam'?95:45);
   const size=death.theme==='steam'?4+i%4:2+i%3;c.fillRect(Math.round(x),Math.round(y),size,size);
  }
  c.globalAlpha=(1-p)*.45;c.strokeStyle=color;c.lineWidth=2;
  c.beginPath();c.ellipse(0,-4,Math.max(1,(e.r||35)*(.8+p*.7)),Math.max(1,(e.r||35)*(.2+p*.15)),0,0,TAU);c.stroke();
  if(death.theme==='curtain')for(const side of [-1,1]){c.beginPath();c.moveTo(side*width*.1,-height*.8);c.lineTo(side*width*(.35+p*.3),-height*.5);c.lineTo(side*width*(.45+p*.35),-height*.15);c.stroke();}
  if(death.theme==='ki'){c.beginPath();c.arc(0,-height*.4,Math.max(1,12+p*35),0,TAU);c.stroke();}
  c.restore();
 }
}
