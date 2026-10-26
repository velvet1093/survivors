import {pointCollider,onWater} from './world.js';

// Keep existing enemies in the fight when the player outruns them. Recycling
// an enemy preserves its health, identity, ownership and eventual loot.
export const ENEMY_RECALL_PADDING=320;
export const ENEMY_RECALL_COOLDOWN=2;
export const ENEMY_RECALL_LIMIT=12;
const GOLDEN_ANGLE=2.399963229728653;
const finite=(n,fallback)=>Number.isFinite(n)?n:fallback;
const bodyRadius=e=>Math.min(19,Math.max(8,finite(e.r,18)*.6));
function viewport(g){
 const zoom=Math.max(.35,finite(g.zoom,.9));
 return {x:Math.max(100,finite(g.view?.w,1200)/zoom/2),y:Math.max(100,finite(g.view?.h,800)/zoom/2)};
}
export function enemyRecallDistance(g){const v=viewport(g);return Math.hypot(v.x,v.y)+ENEMY_RECALL_PADDING;}
function location(g,e,v){
 const body=bodyRadius(e),padding=65+Math.min(55,finite(e.r,18)),seed=finite(e.id,1)*GOLDEN_ANGLE+(e.recallCount||0)*.77;
 for(let ring=0;ring<3;ring++)for(let i=0;i<16;i++){
  const angle=seed+i*GOLDEN_ANGLE,dx=Math.cos(angle),dy=Math.sin(angle);
  const reach=Math.max(220,Math.min((v.x+padding+ring*35)/Math.max(.001,Math.abs(dx)),(v.y+padding+ring*35)/Math.max(.001,Math.abs(dy))));
  const x=g.p.x+dx*reach,y=g.p.y+dy*reach;
  if(g.world&&pointCollider(g,x,y,body))continue;
  if(g.map&&!e.waterWalker&&!['flyhead','aura','frieza','walpurgis','butterfly','familiar','cursedeye'].includes(e.archetype)&&onWater(g.map,x,y,body))continue;
  if(g.enemies.some(other=>other!==e&&other.hp>0&&Math.hypot(other.x-x,other.y-y)<body+bodyRadius(other)+12))continue;
  return {x,y};
 }
 return null;
}
export function updateEnemyRecall(g,dt){
 if(g.status!=='playing'||g.bossIntro||g.p?.hp<=0||g.riftArena||g.rifts?.active)return 0;
 const v=viewport(g),leash=Math.hypot(v.x,v.y)+ENEMY_RECALL_PADDING,moved=new Set(),step=Math.max(0,finite(dt,0));
 for(const e of g.enemies){
  if(e.hp<=0)continue;
  e.recallCooldown=Math.max(0,(e.recallCooldown||0)-step);
  if(moved.size>=ENEMY_RECALL_LIMIT||e.recallCooldown>0||Math.hypot(e.x-g.p.x,e.y-g.p.y)<=leash)continue;
  const next=location(g,e,v);if(!next)continue;
  Object.assign(e,next,{recallCount:(e.recallCount||0)+1,recallCooldown:ENEMY_RECALL_COOLDOWN,attackCD:Math.max(1.5,e.attackCD||0),dash:0,windup:0,attackAnim:0,kvx:0,kvy:0,moving:false});
  // An attack aimed from the old position must not follow a relocated caster.
  for(const key of ['bossUltimate','devilAttack','berserkAttack','worldEventAttack','motherBrainAttack','riftAttack'])if(e[key])e[key]=null;
  if(e.boss)e.ultimateCD=Math.max(3,e.ultimateCD||0);
  moved.add(e.id);
 }
 if(moved.size){
  g.enemyShots=g.enemyShots.filter(s=>!moved.has(s.sourceId));
  g.hazards=g.hazards.filter(h=>!moved.has(h.sourceId));
  g.checkpointRequested=true;
 }
 return moved.size;
}
