// The Primordial Fear is encountered only beyond a calamity rift. Its two
// reinforcement kinds belong to their summoner and never join ordinary maps.
export const DARKNESS_BOSSES={
 darknessdevil:{name:'Darkness Devil',title:'THE PRIMORDIAL FEAR',family:'chainsawman',hp:27000,speed:53,r:48,color:'#c5c8b7',behavior:'darknessdevil',riftOnly:true,waterWalker:true,description:'Rift only. Severance opens four fixed cutting lanes with a broad central corridor before a final collapse. Primordial Night surrounds the last target with a broken halo and a wide escape side. Falling Stars marks a staggered procession of dark impacts. Below half health the cuts widen, another star falls and a third servant may appear. Hell Hands and Darkness Fragments are real, attackable enemies: at most two live servants, or three in phase two, and only six can be summoned in the entire encounter. Defeat the Darkness Devil to dismiss every remaining servant.'},
};
export const DARKNESS_ENEMIES={
 hellhand:{name:'Hell Hand',family:'chainsawman',hp:10,speed:67,r:21,color:'#b7b9a7',behavior:'hellhand',riftOnly:true,attack:4.7,waterWalker:true,description:'Rift only. A servant of the Darkness Devil that marks a fixed palm-shaped impact before it closes. Its health can be depleted normally; defeating its summoner dismisses it.'},
 darknessfragment:{name:'Darkness Fragment',family:'chainsawman',hp:8,speed:74,r:18,color:'#b8b6cc',behavior:'darknessfragment',riftOnly:true,attack:4.8,waterWalker:true,description:'Rift only. A pale fragment that warns two crossing cuts at your last position. Move sideways before the fixed lanes release. It is attackable and cannot survive its Darkness Devil owner.'},
};
export const DARKNESS_SERVANT_LIMIT=6;
const TAU=Math.PI*2;
function summonServants(g,e,p,summon){
 if(typeof summon!=='function'||g.mode==='bossrush'||!Array.isArray(g.enemies))return;
 const cap=e.enraged?3:2,living=g.enemies.filter(s=>s.riftSummon&&s.ownerId===e.id&&s.hp>0),total=Math.max(0,e.darknessSummonedTotal||0),missing=Math.min(cap-living.length,DARKNESS_SERVANT_LIMIT-total);
 for(let i=0;i<missing;i++){
  const count=e.darknessSummonedTotal||0,id=count%2?'darknessfragment':'hellhand',before=new Set(g.enemies.map(s=>s.id));summon(g,e,id,1);
  const added=g.enemies.find(s=>!before.has(s.id)&&s.ownerId===e.id&&s.archetype===id);if(!added)break;
  const inward=g.riftArena&&Math.hypot(p.x,p.y)>(g.riftArena.radius||760)*.5?Math.atan2(-p.y,-p.x):-Math.PI/2,angle=inward+(count%3-1)*.8,edge=g.riftArena?Math.max(40,(g.riftArena.radius||760)-added.r):Infinity;
  Object.assign(added,{riftSummon:true,riftDarknessSlot:count,riftSerial:e.riftSerial??g.rifts?.active?.serial??0,x:Math.max(-edge,Math.min(edge,p.x+Math.cos(angle)*275)),y:Math.max(-edge,Math.min(edge,p.y+Math.sin(angle)*275)),attackCD:2.2+i*.3,windup:1.2});
  e.darknessSummonedTotal=count+1;
 }
}
export function darknessRiftAttack(g,e,p,a,{hazard,summon}={}){
 if(!DARKNESS_BOSSES[e.archetype]&&!DARKNESS_ENEMIES[e.archetype])return false;
 const boss=!!DARKNESS_BOSSES[e.archetype],marks=[],mark=data=>{const h={age:0,duration:.5,color:e.color,source:e.archetype,sourceId:e.id,cancelWithSource:true,sourceClock:true,...data};if(boss)h.bossUltimate=true;marks.push(h);hazard?.(g,h);return h;};
 const circle=(x,y,r,label,delay,damage,status='cursed',duration=.5)=>mark({shape:'circle',x,y,r,label,delay,damage,status,duration});
 const line=(x,y,angle,length,width,label,delay,damage,status='bleeding')=>mark({shape:'line',x:x-Math.cos(angle)*length/2,y:y-Math.sin(angle)*length/2,tx:x+Math.cos(angle)*length/2,ty:y+Math.sin(angle)*length/2,width,label,delay,damage,status});
 if(!boss){
  if(e.archetype==='hellhand'){circle(p.x,p.y,47,'HELL HAND · CLOSING PALM',1.35,18,'slow',.5);e.windup=1.35;}
  else{for(const offset of [-.62,.62])line(p.x,p.y,a+offset,350,10,'DARKNESS FRAGMENT · FIXED CUT',1.4,16,'cursed');e.windup=1.4;}
  return true;
 }
 const fierce=!!e.enraged,move=g.lastMove||{},escape=Math.hypot(move.x||0,move.y||0)>.1?Math.atan2(move.y,move.x):a;
 const tell=(name,style,duration,extra={})=>{e.riftAttack={version:1,name,style,age:0,duration,color:e.color,x:p.x,y:p.y,angle:a,origin:{x:e.x,y:e.y-65},marks,...extra};e.windup=duration;e.attackCD=Math.max(e.attackCD||0,duration+(fierce?.5:.95));g.toast=name+' · RIFT ATTACK';g.toastTime=2.5;};
 if(e.skill%3===1){
  tell('SEVERANCE · THE SILENT COMMAND','severance',4.1,{gapAngle:a});summonServants(g,e,p,summon);
  // Four parallel arms leave the center open until the separately marked end.
  for(const i of [-2,-1,1,2])line(p.x-Math.sin(a)*i*125,p.y+Math.cos(a)*i*125,a,1000,fierce?24:18,'SEVERANCE · DARK ARM',1.65+Math.abs(i)*.22,44,'bleeding');
  circle(p.x,p.y,fierce?100:78,'SEVERANCE · FINAL COLLAPSE',3.3,57,'cursed',.6);
 }else if(e.skill%3===2){
  tell('PRIMORDIAL NIGHT · THE OPENING IN THE DARK','primordial',4.15,{radius:195,gapAngle:escape});
  for(let i=2;i<11;i++){const angle=escape+i*TAU/12;circle(p.x+Math.cos(angle)*195,p.y+Math.sin(angle)*195,fierce?45:36,'PRIMORDIAL NIGHT · BROKEN HALO',1.6+(i%3)*.15,39,'cursed',.55);}
  circle(p.x,p.y,fierce?119:98,'PRIMORDIAL NIGHT · LEAVE THE CENTER',3.15,62,'cursed',.65);
 }else{
  const n=fierce?5:4;const duration=1.65+(n-1)*.48+.75;
  tell('FALLING STARS · A SKY WITHOUT LIGHT','fallingstars',duration,{angle:escape});summonServants(g,e,p,summon);
  for(let i=0;i<n;i++)circle(p.x+Math.cos(escape)*i*100,p.y+Math.sin(escape)*i*100,fierce?78:65,'FALLING STAR · '+(i+1),1.65+i*.48,49,'stun',.55);
 }
 return true;
}
