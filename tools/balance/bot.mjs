// Shared kiting bot used by the hero and item balance simulations.
const src=new URL('../../src',import.meta.url).href;
// BOT_STYLE=close keeps enemies inside melee reach instead of kiting at range.
const CLOSE=process.env.BOT_STYLE==='close',KEEP=CLOSE?28:70;
const E=await import(src+'/engine.js');const G=await import(src+'/game.js');const T=await import(src+'/trinkets.js');const S=await import(src+'/shenron.js');
function pick(p,choices,rand){
 // Prefer fusions, then upgrading owned weapons, owned passives, new weapons, new passives.
 const score=c=>c.kind==='fusion'?100:c.kind==='heal'?1:(p.weapons?.[c.id]?60:p.passives?.[c.id]?50:G.ITEMS[c.id]?.type==='weapon'?40:30)+rand();
 return [...choices].sort((a,b)=>score(b)-score(a))[0];
}
function settle(g,rand,{freeze=false}={}){
 if(freeze){for(let guard=0;guard<20&&g.status!=='playing'&&g.status!=='over';guard++){const st=g.status;if(st==='chest')G.ignoreChest(g);else if(st==='rift')E.resolveRift(g,false);else if(st==='trinket')T.ignoreTrinket(g);delete g.resumeStatus;g.levelChoices=null;g.status='playing';}return;}
 for(let guard=0;guard<50&&g.status!=='playing'&&g.status!=='over';guard++){
  const st=g.status;
  if(st==='upgrade'||st==='fusion'){const ch=st==='fusion'?G.FUSIONS.filter(f=>G.fusionReady?G.fusionReady(g.p,f):false).map(f=>({kind:'fusion',id:f.id})).slice(0,3):G.getChoices(g.p,rand);const c=ch.length?pick(g.p,ch,rand):null;if(c)G.applyChoice(g.p,c);g.levelChoices=null;}
  else if(st==='chest'){if(!G.resolveChestReward(g,true,rand))G.ignoreChest(g);if(g.status==='chest'&&g.chestIndex<g.rewards.length)continue;}
  else if(st==='rift'){E.resolveRift(g,false);}
  else if(st==='trinket'){if(!T.chooseTrinket?.(g,0))T.ignoreTrinket(g);}
  else if(st==='wish'){const o=S.wishOptions(g);S.resolveWish(g,o?.[0]?.kind||'power',o?.[0]?.id,rand);}
  else if(st==='paused'){}
  if(g.status===st&&!['chest'].includes(st)){/* fall through to resume */}
  const pending=g.resumeStatus;delete g.resumeStatus;
  if(pending&&pending!=='playing'&&pending!==st){g.status=pending;continue;}
  if(G.takeLevel(g.p)){g.status='upgrade';continue;}
  if(g.status===st||['upgrade','fusion','chest','trinket','wish','rift'].includes(g.status))g.status='playing';
 }
}
function inHazard(g,x,y,pad=12){for(const h of g.hazards||[])if(h.shape!=='line'&&Math.hypot(x-h.x,y-h.y)<(h.r||40)+pad)return h;return null;}
function steer(g,t){
 // Keep moving along a wide orbit (hazards target the player's current spot),
 // deflecting only for enemies in contact range and for safe nearby XP.
 const p=g.p;let fx=Math.cos(t*.35),fy=Math.sin(t*.35),near=0,closest=1e9,rx=0,ry=0;
 for(const e of g.enemies){const dx=p.x-e.x,dy=p.y-e.y,d=Math.hypot(dx,dy)||1,gap=d-(e.r||10);closest=Math.min(closest,gap);if(d<320)near++;if(gap<KEEP){const w=(KEEP-gap)/KEEP*(e.boss?3:1.5);rx+=dx/d*w;ry+=dy/d*w;}}
 fx+=rx;fy+=ry;
 // Engage: hold bosses at mid range and drift toward the pack when nothing is in reach,
 // so weapons stay in range and boss-gated waves keep advancing.
 const boss=g.enemies.filter(e=>e.boss).sort((a,b)=>Math.hypot(a.x-p.x,a.y-p.y)-Math.hypot(b.x-p.x,b.y-p.y))[0];
 const target=boss||(closest>(CLOSE?60:260)?g.enemies.reduce((m,e)=>!m||Math.hypot(e.x-p.x,e.y-p.y)<Math.hypot(m.x-p.x,m.y-p.y)?e:m,null):null);
 if(target){const dx=target.x-p.x,dy=target.y-p.y,d=Math.hypot(dx,dy)||1,want=CLOSE?(boss?60+(boss.r||30):45):boss?170+(boss.r||30):200;if(d>want+40){fx+=dx/d*1.4;fy+=dy/d*1.4;}else if(boss&&d<want-50){fx-=dx/d*1.2;fy-=dy/d*1.2;}}
 let gx=0,gy=0,best=1e9;for(const gem of g.gems||[]){const d=Math.hypot(gem.x-p.x,gem.y-p.y);if(d<best&&!inHazard(g,gem.x,gem.y,20)&&!g.enemies.some(e=>Math.hypot(e.x-gem.x,e.y-gem.y)<70)){best=d;gx=(gem.x-p.x)/(d||1);gy=(gem.y-p.y)/(d||1);}}
 if(best<260&&closest>90){fx+=gx*.9;fy+=gy*.9;}
 let l=Math.hypot(fx,fy)||1;fx/=l;fy/=l;
 // Hazards and shots override: step out of telegraphs, sidestep incoming projectiles.
 let ax=0,ay=0;
 for(const h of g.hazards||[]){
  if(h.shape==='line'||h.x1!==undefined){continue;}
  const dx=p.x-h.x,dy=p.y-h.y,d=Math.hypot(dx,dy)||1,r=(h.r||40)+28;if(d<r){const w=(r-d)/r*4;ax+=dx/d*w;ay+=dy/d*w;}
 }
 for(const q of g.enemyShots||[]){
  const dx=p.x-q.x,dy=p.y-q.y,d=Math.hypot(dx,dy)||1,v=Math.hypot(q.vx||0,q.vy||0)||1;
  if(d>220)continue;const along=(dx*(q.vx||0)+dy*(q.vy||0))/v;if(along<0)continue;
  const px=-(q.vy||0)/v,py=(q.vx||0)/v,side=dx*px+dy*py,miss=Math.abs(side);if(miss>30)continue;
  const w=(1-miss/30)*(1-d/220)*3,sg=side>=0?1:-1;ax+=px*sg*w;ay+=py*sg*w;
 }
 fx+=ax;fy+=ay;
 // Escape stalls: if barely moved recently, sidestep.
 g._hist=g._hist||[];g._hist.push([p.x,p.y]);if(g._hist.length>60)g._hist.shift();
 if(g._hist.length===60&&Math.hypot(p.x-g._hist[0][0],p.y-g._hist[0][1])<20){const a=t*2.3;fx+=Math.cos(a)*2;fy+=Math.sin(a)*2;}
 l=Math.hypot(fx,fy)||1;return {x:fx/l,y:fy/l,near,closest,hazard:Math.hypot(ax,ay)>1};
}
export {settle as settleBot,steer as steerBot,pick as pickChoice};
