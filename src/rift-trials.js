// Rift interludes are movement challenges, independent of weapon strength.
// Every objective, warning and clock is ordinary saved run state.
export const RIFT_TRIALS={
 darknessdevil:{kind:'blackout',name:'A Prayer in the Dark',instruction:'Darkness has vanished. Find the astronaut helmet, gauntlet and boot to restore the light. Walk over each pale remain; your lantern reveals only nearby ground.',total:3,color:'#d6ddce'},
 foundereren:{kind:'paths',name:'Cross the Paths',instruction:'Reach the three Paths beacons in their numbered order. Cross the warned Titan marches through their wide openings; the final beacon ends the crossing.',total:3,color:'#e0c39b'},
 beerus:{kind:'offerings',name:'A God’s Appetite',instruction:'Carry three pudding offerings to the central shrine, one at a time. Walk over a pudding, then return to the golden dish. Leave violet erasure marks before they release.',total:3,color:'#d0a9ef'},
 walpurgisrift:{kind:'spotlights',name:'The Last Curtain Call',instruction:'Follow four numbered stage spotlights. Stand in the currently lit spotlight until its ring fills, then move to the next; dodge the warned falling scenery.',total:4,color:'#efacce'},
 aizenrift:{kind:'mirrors',name:'The True Reflection',instruction:'Find the real mirror in three rounds. A golden butterfly marks the true reflection. Walk into it; false mirrors sting and briefly lock further choices.',total:3,color:'#c7a9ef'},
 madararift:{kind:'shelters',name:'Three Falling Heavens',instruction:'Survive three meteor tolls. Reach the lit shelter before each countdown ends. The shelter changes after every impact; being outside hurts, but surviving advances the challenge.',total:3,color:'#d5dfbd'},
 sukunaheian:{kind:'seals',name:'Silence the Shrine',instruction:'Close all three shrine seals in any order. Stand inside a seal until its channel ring fills; stepping away breaks that channel. Leave the warned cutting lanes before they release.',total:3,color:'#e7a599'},
 borosrift:{kind:'vents',name:'Vent the Star Reactor',instruction:'Step onto each of the three reactor vents to arm it, then leave its marked blast radius before it opens. Each vent only erupts once; opening all three restores the battle.',total:3,color:'#e8a9d1'},
 acnologia:{kind:'orbit',name:'Catch the Dragon Lacrima',instruction:'Three dragon lacrima crystals circle the island on the storm winds. Touch each one as it passes to claim it. Step out of the warned roar marks that follow your position.',total:3,color:'#7d93c4'},
 milim:{kind:'tag',name:'Keep Up with Milim',instruction:'Milim wants to play tag. Stay close to her darting afterimage until its ring fills, three times. The ring drains while you fall behind; dodge the warned stardust she scatters as she runs.',total:3,color:'#f0a6b8'},
 deathdevil:{kind:'procession',name:'The Funeral Procession',instruction:'Follow the moving lantern sanctuary through three funeral bells. Stay inside its pale circle when each bell tolls. A missed sanctuary hurts, but surviving all three tolls ends the procession.',total:3,color:'#dedbd0'},
};
const TAU=Math.PI*2,PLAYER_RADIUS=12,finite=Number.isFinite;
const clamp=(n,a,b)=>Math.max(a,Math.min(b,n)),distance=(a,b)=>Math.hypot(a.x-b.x,a.y-b.y);
const owner=(g,q)=>g.enemies?.find(e=>e.id===q?.bossEntityId&&e.archetype===q?.bossId);
const defFor=q=>RIFT_TRIALS[q?.bossId];
const goal=(id,x,y,kind,r=42,extra={})=>({id,x,y,kind,r,done:false,active:true,charge:0,...extra});
const point=(x,y,edge)=>({x:clamp(x,-edge,edge),y:clamp(y,-edge,edge)});
const remaining=q=>q.goals.filter(v=>!v.done);
function activateOrdered(q){for(let i=0;i<q.goals.length;i++)q.goals[i].active=i===q.stage&&!q.goals[i].done;}
function mirrorRound(q){q.realIndex=(q.seed+q.stage*3)%4;for(let i=0;i<q.goals.length;i++){q.goals[i].real=i===q.realIndex;q.goals[i].active=true;}}
function makeGoals(g,q){
 const edge=Math.max(200,(g.riftArena?.radius||760)-120),scale=Math.min(1,edge/640),at=(id,x,y,kind,r=42,extra={})=>goal(id,x*scale,y*scale,kind,r,extra);
 if(q.kind==='blackout'){q.goals=[at('helmet',-330,-240,'helmet',30),at('gauntlet',350,-140,'gauntlet',30),at('boot',-80,390,'boot',30)];q.lightRadius=130;}
 else if(q.kind==='paths'){q.goals=[at('path-1',-350,-160,'path',62,{order:1}),at('path-2',310,-330,'path',62,{order:2}),at('path-3',0,-530,'path',62,{order:3})];activateOrdered(q);}
 else if(q.kind==='offerings'){q.goals=[at('pudding-1',-340,-230,'pudding',34),at('pudding-2',340,-200,'pudding',34),at('pudding-3',0,360,'pudding',34)];q.carrying=null;q.shrine={x:0,y:0,r:65};}
 else if(q.kind==='spotlights'){q.goals=[at('spotlight-1',-260,-210,'spotlight',64,{order:1}),at('spotlight-2',270,170,'spotlight',64,{order:2}),at('spotlight-3',250,-240,'spotlight',64,{order:3}),at('spotlight-4',-270,200,'spotlight',64,{order:4})];activateOrdered(q);}
 else if(q.kind==='mirrors'){q.goals=[at('mirror-1',-260,-210,'mirror',45),at('mirror-2',260,-210,'mirror',45),at('mirror-3',260,220,'mirror',45),at('mirror-4',-260,220,'mirror',45)];q.choiceCD=0;q.feedbackTime=0;q.wrongId=null;q.mistakes=0;mirrorRound(q);}
 else if(q.kind==='shelters'){
  // A fixed world target could be unreachable when the phase starts at an arena
  // corner. Lay this short route once from the entry position, then save it.
  const start=point(g.p.x,g.p.y,edge),inward=p=>Math.atan2(-p.y,-p.x),first=point(start.x+Math.cos(inward(start))*200,start.y+Math.sin(inward(start))*200,edge),second=point(first.x+Math.cos(inward(first)+.8)*300,first.y+Math.sin(inward(first)+.8)*300,edge),third=point(second.x+Math.cos(inward(second)-.8)*300,second.y+Math.sin(inward(second)-.8)*300,edge);
  q.goals=[first,second,third].map((p,i)=>goal('shelter-'+(i+1),p.x,p.y,'shelter',110,{order:i+1}));q.roundAge=0;q.roundDuration=4;q.impactFlash=0;activateOrdered(q);
 }
 else if(q.kind==='orbit'){q.goals=[0,1,2].map(i=>goal('lacrima-'+(i+1),0,0,'lacrima',36,{base:i*TAU/3,orbitR:Math.min(300,edge-60)}));orbitGoals(q);}
 else if(q.kind==='tag'){q.goals=[0,1,2].map(i=>goal('tag-'+(i+1),0,0,'afterimage',72,{order:i+1}));tagTarget(q,edge);activateOrdered(q);}
 else if(q.kind==='seals')q.goals=[at('seal-1',-260,-210,'seal',55),at('seal-2',260,-210,'seal',55),at('seal-3',0,300,'seal',55)];
 else if(q.kind==='vents')q.goals=[at('vent-1',-260,-200,'vent',60,{armed:false,armedAge:0}),at('vent-2',270,-180,'vent',60,{armed:false,armedAge:0}),at('vent-3',0,330,'vent',60,{armed:false,armedAge:0})];
 else if(q.kind==='procession'){
  const start=point(g.p.x,g.p.y,edge),toward=Math.atan2(-start.y,-start.x),mid=point(start.x+Math.cos(toward)*210,start.y+Math.sin(toward)*210,edge),next=point(mid.x+240,mid.y-160,edge),last=point(next.x-210,next.y-190,edge);
  q.path=[start,mid,next,last];q.goals=q.path.slice(1).map((p,i)=>goal('bell-'+(i+1),p.x,p.y,'bell',115,{order:i+1}));q.sanctuary={...start,r:115};q.roundAge=0;q.roundDuration=4;q.impactFlash=0;activateOrdered(q);
 }
}
// Lacrima ride the storm around the arena centre; Milim's afterimage traces a looping path.
function orbitGoals(q){for(const v of q.goals){const a=v.base+q.age*.45;v.x=Math.cos(a)*v.orbitR;v.y=Math.sin(a)*v.orbitR;}}
function tagTarget(q,edge=520){const ax=Math.min(300,edge-80),ay=Math.min(220,edge-80);for(const v of q.goals){v.x=Math.cos(q.age*.45+q.stage)*ax;v.y=Math.sin(q.age*.7+q.stage*2)*ay;}}
export function riftTrialActive(g){return !!defFor(g?.riftTrial);}
export function beginRiftTrial(g,e){
 if(!g||g.status!=='playing'||g.bossIntro||g.riftTrial||!e||!RIFT_TRIALS[e.archetype]||!e.riftBoss||!e.boss||e.hp<=0||e.hp>e.maxHp*.5||e.enraged||e.riftTrialDone||e.riftTrialStarted||g.rifts?.active?.bossEntityId!==e.id||g.rifts.active.bossId!==e.archetype||!g.riftArena)return false;
 const def=RIFT_TRIALS[e.archetype],q={version:1,bossId:e.archetype,bossEntityId:e.id,kind:def.kind,name:def.name,color:def.color,age:0,stage:0,progress:0,total:def.total,seed:Math.abs(Math.floor(e.id))%4,goals:[],hazards:[],serial:0,pulse:0,nextPressure:4.5,hideBoss:e.archetype==='darknessdevil',suspendedUltimate:g.ultimate||null,suspendedFreeze:g.freeze||0,suspendedForm:Object.fromEntries(['form','pose'].filter(key=>Object.hasOwn(g.p,key)).map(key=>[key,g.p[key]]))};
 makeGoals(g,q);g.riftTrial=q;g.riftTrialAfterglow=null;e.riftTrialStarted=true;e.riftTrialLocked=true;e.riftAttack=null;e.bossUltimate=null;e.windup=0;e.dash=0;e.kvx=0;e.kvy=0;e.moving=false;e.attackAnim=0;e.statuses={};
 // A phase change clears outgoing damage and the previous form's servants.
 const removed=new Set(g.enemies.filter(v=>v.riftSummon&&v.ownerId===e.id).map(v=>v.id));g.enemies=g.enemies.filter(v=>!removed.has(v.id));
 g.shots=[];g.fields=[];g.enemyShots=[];g.hazards=[];g.crimsonEchoes=[];g.effects=[];g.particles=[];g.ultimate=null;g.freeze=0;g.dash=null;
 if(g.garuda){g.garuda.inFlight=false;g.garuda.flightId=null;}
 g.p.statuses={};g.p.kvx=0;g.p.kvy=0;g.p.hurtTimer=0;g.invuln=Math.max(g.invuln||0,.8);g.toast=def.name.toUpperCase()+' · RIFT CHALLENGE';g.toastTime=4;g.checkpointRequested=true;
 return true;
}
function restorePower(g,q){
 if(finite(q?.suspendedFreeze))g.freeze=Math.max(g.freeze||0,q.suspendedFreeze);
 if(!g.ultimate&&q?.suspendedUltimate){g.ultimate=q.suspendedUltimate;if(g.ultimate.type==='frieren'&&g.golem)g.ultimate.golem=g.golem;if(q.suspendedForm)for(const key of ['form','pose'])if(Object.hasOwn(q.suspendedForm,key))g.p[key]=q.suspendedForm[key];}
}
function recallCompanions(g){
 const edge=Math.max(100,(g.riftArena?.radius||760)-65),p=g.p,place=(unit,x,y)=>{if(unit)Object.assign(unit,point(p.x+x,p.y+y,edge));};
 place(g.pet,-35,5);place(g.garuda,25,-24);place(g.golem,-55,-15);
 for(let i=0;i<(g.summons||[]).length;i++){const a=i*2.399;place(g.summons[i],Math.cos(a)*65,Math.sin(a)*65);}
 for(let i=0;i<(g.cloneUnits||[]).length;i++)place(g.cloneUnits[i],-45+i*12,30);
 for(let i=0;i<(g.ultimate?.shadows||[]).length;i++){const a=i*TAU/3;place(g.ultimate.shadows[i],Math.cos(a)*65,Math.sin(a)*65);}
}
function revealDarkness(g,e){
 const w=finite(g.view?.w)&&g.view.w>0?g.view.w:1200,h=finite(g.view?.h)&&g.view.h>0?g.view.h:800,zoom=finite(g.zoom)&&g.zoom>0?g.zoom:.9,dx=Math.min(150,w/(4*zoom)),dy=w>h&&h<=500?40:-100,edge=Math.max(100,(g.riftArena?.radius||760)-(e.r||48)-24);
 // Prefer a visible side of the player. Reflect the offset at the arena rim so
 // returning light never places the devil on top of the searching hero.
 for(const [x,y]of [[dx,dy],[-dx,dy],[dx,-dy],[-dx,-dy],[0,-140],[0,140],[-150,0],[150,0]]){const p=point(g.p.x+x,g.p.y+y,edge);if(distance(g.p,p)>110){Object.assign(e,p);return;}}
}
export function finishRiftTrial(g){
 const q=g?.riftTrial;if(!q)return false;const e=owner(g,q);
 if(e&&e.hp>0){e.riftTrialDone=true;e.riftTrialStarted=true;e.riftTrialLocked=false;e.enraged=true;if(e.riftShiftName){e.name=e.riftShiftName;e.r=e.riftShiftRadius||e.r;}e.riftAttack=null;e.bossUltimate=null;e.windup=0;e.dash=0;e.kvx=0;e.kvy=0;e.moving=false;e.attackCD=Math.max(2.5,e.attackCD||0);e.ultimateCD=Math.max(3,e.ultimateCD||0);e.skill=0;if(q.kind==='blackout')revealDarkness(g,e);}
 restorePower(g,q);recallCompanions(g);g.riftTrial=null;g.invuln=Math.max(g.invuln||0,1.5);g.dash=null;
 if(q.kind==='blackout')g.riftTrialAfterglow={age:0,duration:1.2,kind:'blackout',bossId:q.bossId};
 g.toast=q.kind==='blackout'?'THREE PRAYERS ANSWERED · THE LIGHT RETURNS':e?.riftShiftName&&e.hp>0?e.name.toUpperCase()+' · SECOND PHASE':'RIFT CHALLENGE COMPLETE · SECOND PHASE';g.toastTime=4;g.checkpointRequested=true;return true;
}
function warn(q,data){q.hazards.push({id:++q.serial,age:0,delay:1.6,duration:.4,damage:8,hit:false,color:q.color,...data});if(q.hazards.length>16)q.hazards.splice(0,q.hazards.length-16);}
const hpDamage=(g,fraction)=>Math.max(1,(g.p.maxHp||100)*fraction);
function damage(g,value,api){api.hitPlayer?.(g,value);}
function pressure(g,q){
 if(!['blackout','paths','offerings','spotlights','seals','orbit','tag'].includes(q.kind)||q.age<q.nextPressure)return;
 q.nextPressure=q.age+(q.kind==='blackout'?5.5:q.kind==='offerings'?4.2:3.6);q.pulse++;
 if(q.kind==='orbit'||q.kind==='tag')warn(q,{shape:'circle',x:g.p.x,y:g.p.y,r:q.kind==='orbit'?62:56,delay:1.8,damage:hpDamage(g,.08),label:q.kind==='orbit'?'DRAGON’S ROAR · LEAVE THE MARK':'STARDUST · LEAVE THE MARK'});
 else if(q.kind==='blackout'||q.kind==='offerings')warn(q,{shape:'circle',x:g.p.x,y:g.p.y,r:q.kind==='blackout'?56:68,delay:1.8,damage:hpDamage(g,.08),label:q.kind==='blackout'?'A HAND IN THE DARK':'HAKAI · LEAVE THE OFFERING MARK'});
 else if(q.kind==='paths'){
  const y=[-90,-270,-440][(q.pulse-1)%3],gap=(q.pulse%2?1:-1)*165;
  for(const [x,tx]of [[-630,gap-105],[gap+105,630]])warn(q,{shape:'line',x,y,tx,ty:y,width:28,delay:1.8,damage:hpDamage(g,.1),label:'COLOSSAL MARCH · OPEN CROSSING'});
 }else if(q.kind==='spotlights'){
  const x=(q.pulse%2?1:-1)*180;warn(q,{shape:'line',x,y:-580,tx:x+100,ty:580,width:35,delay:1.8,damage:hpDamage(g,.09),label:'FALLING SCENERY'});
 }else{
  const a=(q.pulse%6)*Math.PI/3;warn(q,{shape:'line',x:Math.cos(a)*-590,y:Math.sin(a)*-590,tx:Math.cos(a)*590,ty:Math.sin(a)*590,width:24,delay:1.7,damage:hpDamage(g,.1),label:'SHRINE · FIXED CUT'});
 }
}
function segmentDistance(p,h){const dx=h.tx-h.x,dy=h.ty-h.y,len=dx*dx+dy*dy,t=len?clamp(((p.x-h.x)*dx+(p.y-h.y)*dy)/len,0,1):0;return Math.hypot(p.x-h.x-dx*t,p.y-h.y-dy*t);}
function updateWarnings(g,q,dt,api){
 for(const h of q.hazards){h.age+=dt;if(h.hit||h.age<h.delay||h.age>h.delay+h.duration)continue;const inside=h.shape==='line'?segmentDistance(g.p,h)<h.width+PLAYER_RADIUS:distance(g.p,h)<h.r+PLAYER_RADIUS;if(inside){h.hit=true;damage(g,h.damage,api);}}
 q.hazards=q.hazards.filter(h=>h.age<h.delay+h.duration);
}
function tick(g,q,dt,api){
 q.age+=dt;q.impactFlash=Math.max(0,(q.impactFlash||0)-dt);q.feedbackTime=Math.max(0,(q.feedbackTime||0)-dt);q.choiceCD=Math.max(0,(q.choiceCD||0)-dt);q.deliveryFlash=Math.max(0,(q.deliveryFlash||0)-dt);
 if(q.kind==='blackout'){
  for(const v of remaining(q))if(distance(g.p,v)<=v.r+12){v.done=true;v.active=false;q.progress++;q.stage=q.progress;q.lightRadius=130+q.progress*30;g.checkpointRequested=true;}
 }else if(q.kind==='paths'){
  const v=q.goals[q.stage];if(v&&distance(g.p,v)<=v.r){v.done=true;q.progress++;q.stage=q.progress;activateOrdered(q);g.checkpointRequested=true;}
 }else if(q.kind==='offerings'){
  if(q.carrying&&distance(g.p,q.shrine)<=q.shrine.r){const v=q.goals.find(v=>v.id===q.carrying);v.done=true;v.carried=false;q.carrying=null;q.progress++;q.stage=q.progress;q.deliveryFlash=.8;g.checkpointRequested=true;}
  if(!q.carrying){const v=remaining(q).find(v=>distance(g.p,v)<=v.r+12);if(v){q.carrying=v.id;v.carried=true;v.active=false;g.checkpointRequested=true;}}
 }else if(q.kind==='spotlights'||q.kind==='seals'){
  const duration=q.kind==='spotlights'?.8:1.2;
  for(const v of remaining(q)){if(!v.active)continue;v.charge=distance(g.p,v)<=v.r?Math.min(1,v.charge+dt/duration):0;if(v.charge>=1-1e-9){v.charge=1;v.done=true;v.active=false;q.progress++;q.stage=q.progress;g.checkpointRequested=true;if(q.kind==='spotlights'){activateOrdered(q);break;}}}
 }else if(q.kind==='mirrors'){
  if(q.choiceCD<=0){const v=q.goals.find(v=>distance(g.p,v)<=v.r+12);if(v){q.choiceCD=1.1;if(v.real){q.progress++;q.stage=q.progress;q.wrongId=null;q.feedbackTime=.8;if(q.progress<q.total)mirrorRound(q);g.checkpointRequested=true;}else{q.wrongId=v.id;q.feedbackTime=1.1;q.mistakes++;damage(g,hpDamage(g,.08),api);}}}
 }else if(q.kind==='shelters'||q.kind==='procession'){
  q.roundAge+=dt;
  if(q.kind==='procession'){const a=q.path[q.stage],b=q.path[q.stage+1],t=clamp(q.roundAge/q.roundDuration,0,1);q.sanctuary.x=a.x+(b.x-a.x)*t;q.sanctuary.y=a.y+(b.y-a.y)*t;}
  if(q.roundAge>=q.roundDuration-1e-9){const safe=q.kind==='shelters'?q.goals[q.stage]:q.sanctuary;if(distance(g.p,safe)>safe.r-PLAYER_RADIUS)damage(g,hpDamage(g,.12),api);q.goals[q.stage].done=true;q.progress++;q.stage=q.progress;q.roundAge=0;q.impactFlash=.35;activateOrdered(q);g.checkpointRequested=true;}
 }else if(q.kind==='orbit'){
  orbitGoals(q);
  for(const v of remaining(q))if(distance(g.p,v)<=v.r+12){v.done=true;v.active=false;q.progress++;q.stage=q.progress;g.checkpointRequested=true;}
 }else if(q.kind==='tag'){
  tagTarget(q,(g.riftArena?.radius||760)-120);const v=q.goals[q.stage];
  if(v){v.charge=distance(g.p,v)<=v.r?Math.min(1,v.charge+dt/1.5):Math.max(0,v.charge-dt*.4);if(v.charge>=1-1e-9){v.charge=1;v.done=true;q.progress++;q.stage=q.progress;activateOrdered(q);g.checkpointRequested=true;}}
 }else if(q.kind==='vents'){
  for(const v of remaining(q)){
   if(!v.armed&&distance(g.p,v)<=v.r-12){v.armed=true;v.armedAge=0;warn(q,{shape:'circle',x:v.x,y:v.y,r:v.r+24,delay:1.5,damage:hpDamage(g,.12),label:'REACTOR VENT · MOVE AWAY',goalId:v.id});g.checkpointRequested=true;}
   if(v.armed){v.armedAge+=dt;v.charge=Math.min(1,v.armedAge/1.5);if(v.armedAge>=1.5-1e-9){v.done=true;v.active=false;q.progress++;q.stage=q.progress;g.checkpointRequested=true;}}
  }
 }
 pressure(g,q);updateWarnings(g,q,dt,api);
}
export function updateRiftTrial(g,dt,api={}){
 const q=g?.riftTrial;if(!q)return false;
 if(!defFor(q)||!owner(g,q)||owner(g,q).hp<=0||g.rifts?.active?.bossEntityId!==q.bossEntityId){restorePower(g,q);g.riftTrial=null;return false;}
 if(g.status!=='playing'||g.bossIntro||g.p.hp<=0||!finite(dt)||dt<=0)return true;
 let left=Math.min(30,dt);while(left>1e-9&&g.riftTrial&&g.status==='playing'&&g.p.hp>0){const step=Math.min(.05,left);tick(g,q,step,api);left-=step;if(q.progress>=q.total){finishRiftTrial(g);break;}}
 return true;
}
export function riftTrialText(g){
 const q=g?.riftTrial,def=defFor(q);if(!def)return null;
 let detail='';
 if(q.kind==='blackout')detail=`${q.progress} / 3 astronaut remains found · search the darkness`;
 else if(q.kind==='paths')detail=`Reach beacon ${Math.min(q.total,q.stage+1)} / ${q.total} · cross through the openings`;
 else if(q.kind==='offerings')detail=q.carrying?'Pudding carried · return to the golden shrine':`${q.progress} / 3 offerings delivered · find another pudding`;
 else if(q.kind==='spotlights')detail=`Spotlight ${Math.min(q.total,q.stage+1)} / ${q.total} · stand in the lit circle`;
 else if(q.kind==='mirrors')detail=q.feedbackTime>0&&q.wrongId?'False reflection · follow the golden butterfly':`True reflection ${q.progress} / 3 · follow the golden butterfly`;
 else if(q.kind==='shelters')detail=`Meteor ${Math.min(3,q.stage+1)} / 3 · shelter before ${Math.max(0,q.roundDuration-q.roundAge).toFixed(1)}s`;
 else if(q.kind==='seals')detail=`${q.progress} / 3 seals closed · hold a seal to channel`;
 else if(q.kind==='vents')detail=`${q.progress} / 3 vents opened · arm a vent, then leave its circle`;
 else if(q.kind==='orbit')detail=`${q.progress} / 3 lacrima caught · touch a crystal as it passes`;
 else if(q.kind==='tag')detail=`Tag ${Math.min(3,q.stage+1)} / 3 · ${Math.round((q.goals[q.stage]?.charge||0)*100)}% · stay close to Milim`;
 else if(q.kind==='procession')detail=`Bell ${Math.min(3,q.stage+1)} / 3 in ${Math.max(0,q.roundDuration-q.roundAge).toFixed(1)}s · follow the sanctuary`;
 return {name:def.name,instruction:def.instruction,progress:q.progress,total:q.total,detail};
}
export function restoreRiftTrial(g){
 const q=g?.riftTrial;if(!q)return false;const def=defFor(q),e=owner(g,q),edge=(g.riftArena?.radius||800)-30;
 const valid=def&&q.version===1&&q.kind===def.kind&&g.rifts?.active?.bossEntityId===q.bossEntityId&&e?.hp>0&&q.total===def.total&&finite(q.age)&&q.age>=0&&Number.isInteger(q.progress)&&q.progress>=0&&q.progress<q.total&&q.stage===q.progress&&Array.isArray(q.goals)&&q.goals.length===(q.kind==='mirrors'?4:q.total)&&q.goals.every(v=>v&&typeof v.id==='string'&&typeof v.done==='boolean'&&typeof v.active==='boolean'&&[v.x,v.y,v.r,v.charge].every(finite)&&Math.abs(v.x)<=edge&&Math.abs(v.y)<=edge&&v.r>0&&v.r<200&&v.charge>=0&&v.charge<=1)&&(q.kind==='mirrors'||q.goals.filter(v=>v.done).length===q.progress)&&Number.isInteger(q.serial)&&q.serial>=0&&Array.isArray(q.hazards)&&q.hazards.length<=16&&q.hazards.every(h=>h&&['circle','line'].includes(h.shape)&&[h.x,h.y,h.age,h.delay,h.duration,h.damage].every(finite)&&h.age>=0&&h.delay>=0&&h.duration>0&&h.damage>=0&&(h.shape==='circle'?finite(h.r)&&h.r>0:[h.tx,h.ty,h.width].every(finite)&&h.width>0));
 const extras=valid&&(q.kind==='offerings'?q.shrine&&[q.shrine.x,q.shrine.y,q.shrine.r].every(finite)&&(!q.carrying||q.goals.some(v=>v.id===q.carrying&&!v.done)):q.kind==='procession'?Array.isArray(q.path)&&q.path.length===4&&q.path.every(p=>p&&[p.x,p.y].every(finite))&&q.sanctuary&&[q.sanctuary.x,q.sanctuary.y,q.sanctuary.r].every(finite):true);
 const clocks=valid&&(!['shelters','procession'].includes(q.kind)||finite(q.roundAge)&&q.roundAge>=0&&q.roundAge<4&&q.roundDuration===4)&&(!['mirrors'].includes(q.kind)||Number.isInteger(q.seed)&&q.seed>=0&&q.seed<4&&Number.isInteger(q.realIndex)&&q.realIndex>=0&&q.realIndex<4&&q.goals.filter(v=>v.real).length===1&&q.goals[q.realIndex].real&&finite(q.choiceCD)&&q.choiceCD>=0&&q.choiceCD<=1.2)&&(!['blackout','paths','offerings','spotlights','seals','orbit','tag'].includes(q.kind)||finite(q.nextPressure)&&Number.isInteger(q.pulse)&&q.pulse>=0)&&(q.kind!=='vents'||q.goals.every(v=>typeof v.armed==='boolean'&&finite(v.armedAge)&&v.armedAge>=0))&&(q.kind!=='blackout'||finite(q.lightRadius)&&q.lightRadius===130+q.progress*30);
 if(!valid||!extras||!clocks){if(e?.hp>0&&g.rifts?.active?.bossEntityId===q.bossEntityId)finishRiftTrial(g);else{restorePower(g,q);g.riftTrial=null;}return false;}
 e.riftTrialStarted=true;e.riftTrialLocked=true;q.hideBoss=q.kind==='blackout';return true;
}
