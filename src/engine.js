import {castSalvation,updateSalvationShot} from './salvation.js';
import {castPairedWeapon,updatePairedShot,isPairedWeapon,pairedWeaponReach,pairedWeaponCooldown} from './paired-weapons.js';
import {castChainsaw,denjiAttackReach} from './denji.js';
import {castDragonslayer,gutsAttackReach} from './guts.js';
import {newWorldEvents,startWorldEvent,updateWorldEvents,eventCombatActive,defeatedEventBoss} from './world-events.js';
import {newWaveState,updateWaves} from './waves.js';
import {updateEnemyRecall} from './enemy-recall.js';
import {queuePlayerDeath,queueDepartedDecoys,updateFriendlyDeaths} from './friendly-death.js';
import {clearOrphanRiftSummons} from './rift-superbosses.js';
import {beginRiftTrial,updateRiftTrial,riftTrialActive} from './rift-trials.js';
import {queueBossDeaths,updateBossDeaths,bossDeathPending} from './boss-death.js';
import {updateFrierenGolem} from './frieren-golem.js';
import {newTrinkets,trinketBonus,rollEnemyTrinket,trinketEnemyDefeated,trinketUltimateUsed,updateTrinkets,collectNearbyTrinket,useEventTrinket} from './trinkets.js';
import {BOSS_DAMAGE_REDUCTION,difficultyFor} from './difficulty.js';
import {initializeBossRush,advanceBossRush,defeatedRushBoss,rushPhaseDamage} from './boss-rush.js';
import {newGaruda,updateGaruda,castGaruda,updateGarudaShot} from './garuda.js';
import {castBlackFlame,updateBlackFlame} from './rimuru.js';
import {castQuill,updateQuillShot} from './featherine.js';
import {initializeHardcore} from './hardcore.js';
import {castRequip,updateRequipSword,requipReach,erzaForm,absorbErzaBarrier} from './erza.js';
import {castMultiItemFusion,updateMultiItemShot} from './multi-item-fusions.js';
import {castCrimson,crimsonReach,updateCrimsonEchoes} from './diavolo.js';
import {cellDamage} from './cell-phases.js';
import {castEvolvedWeapon,updateEvolvedShot} from './evolved-weapons.js';
import {bossUltimatePaused} from './boss-ultimates.js';
import {cannonStage,cannonPayload,CANNON_STAGES} from './samus-cannon.js';
import {summonPack,summonNue,updateSummons} from './summons.js';
import {petFor,updatePet} from './pets.js';
import {newHeroMechanic,updateHeroMechanic,heroMovement,heroDamageBonus,heroMoveBonus,heroResistance,blockHeroHit,heroHurt,heroKill,heroXp,heroToxin,heroFreeze,consumeHeroCast,spendStolenTime} from './hero-mechanics.js';
import {queueBossIntro,tickBossIntro} from './boss-intro.js';
import {skinFor} from './skins.js';
import {applyStatus,hasStatus,statusModifiers,updateStatuses} from './status.js';
import {makeGem,enemyXpValue} from './xp.js';
import {progressionBonuses} from './progression.js';
import { createPlayer, forbiddenWeapon, MAPS, grantXp } from './game.js';
import {newRifts,updateRifts,chooseRift,riftCombatActive,defeatedRiftBoss,tryChestMimic,defeatedMimic,resolveChestContents} from './rift-encounters.js';
import {makeEnemy,pickEnemy,pickBoss,updateEnemyAI} from './enemies.js';
import {createWorld,ensureWorld,updateWorld,moveBody,PLAYER_RADIUS,pointCollider,onWater,damageProp,damagePropsInRadius,segmentDistance,separateEnemies} from './world.js';
import {startUltimate,updateUltimate} from './ultimates.js';
import {bowPose} from './bow.js';
import {initializeTraining,trainingNatural,updateTraining} from './training.js';
const TAU=Math.PI*2;
const distance=(a,b)=>Math.hypot(a.x-b.x,a.y-b.y);
export function createRun(character,mapIndex=0,profile=null){
  const g={mode:'survival',difficulty:difficultyFor(profile?.selection?.difficulty).id,runId:Date.now().toString(36)+Math.random().toString(36).slice(2),characterXp:0,pet:{id:petFor(profile?.pet).id,x:-35,y:5,age:0},mechanic:newHeroMechanic(character.id),p:{...createPlayer(character,progressionBonuses(profile,character.id)),skin:skinFor(character.id,profile?.skins?.[character.id]).id,displayName:skinFor(character.id,profile?.skins?.[character.id]).pilot||character.name,unitName:skinFor(character.id,profile?.skins?.[character.id]).unit||''},map:MAPS[mapIndex],status:'playing',bossIntro:null,bossIntroQueue:[],dash:null,dashCD:0,lastMove:{x:1,y:0},world:createWorld(),pickups:[],money:0,broken:0,pickupsCollected:0,haste:0,magnetPulse:0,ultimate:null,ultimateSerial:0,cloneUnits:[],summons:[],time:0,kills:0,enemies:[],shots:[],fields:[],effects:[],particles:[],numbers:[],gems:[],chests:[],spawn:.2,eliteAt:35,special:0,secondarySpecial:0,secondarySpecialMax:75,invuln:0,hurtFlash:0,boss:false,nextBossWave:5,bossKills:0,wave:1,enemyShots:[],hazards:[],crimsonEchoes:[],rewards:[],chestIndex:0,chestVersion:2,zoom:.9,targetZoom:.9,shake:0,freeze:0,clones:0,cloneAttack:0,walkDust:0,toast:'',toastTime:0,won:false,view:{w:1200,h:800},id:0};g.waveState=newWaveState();if(character.id==='erza')g.p.erzaForm=g.mechanic.form;g.garuda=newGaruda(g);g.trinkets=newTrinkets();g.rifts=newRifts();g.events=newWorldEvents();return g;
}
export function createBossRushRun(character,mapIndex=0,profile=null){const g=initializeBossRush(createRun(character,mapIndex,profile));ensureWorld(g);return g;}
export function createTrainingRun(character,mapIndex=0,profile=null){const g=initializeTraining(createRun(character,mapIndex,profile));ensureWorld(g);return g;}
export function createHardcoreRun(character,mapIndex=0,profile=null){return initializeHardcore(createRun(character,mapIndex,profile),character);}
function clearOutgoing(g){
 g.shots=[];g.fields=[];g.crimsonEchoes=[];g.effects=[];
 if(g.garuda){g.garuda.inFlight=false;g.garuda.flightId=null;}
}
export function resolveRift(g,enter){return chooseRift(g,enter,{spawn:spawnEnemy,queueIntro:queueBossIntro,clearOutgoing});}
export function burst(g,x,y,color,n=10,speed=150){
  for(let i=0;i<n&&g.particles.length<450;i++){
    const a=Math.random()*TAU,v=25+Math.random()*speed;
    g.particles.push({x,y,vx:Math.cos(a)*v,vy:Math.sin(a)*v,life:.3+Math.random()*.5,max:.8,color,size:2+Math.random()*3});
  }
}
function effect(g,type,data){g.effects.push({type,life:.4,max:.4,...data});}
export function damageEnemy(g,e,damage,color='#fff'){
  if(e.hp<=0||riftTrialActive(g))return;
  damage*=heroDamageBonus(g)*statusModifiers(e).damageTaken*(e.armorTime>0?.6:1)*(e.boss?1-BOSS_DAMAGE_REDUCTION:1);damage=rushPhaseDamage(g,e,cellDamage(e,damage));if(e.riftBoss&&!e.enraged)damage=Math.max(0,Math.min(damage,e.hp-(e.maxHp*.5-.01)));e.hp-=damage;e.lastDamagedAt=g.time;e.hit=.12;g.shake=Math.max(g.shake,1.5);
  if(g.numbers.length<75)g.numbers.push({x:e.x+(Math.random()-.5)*15,y:e.y-e.r,amount:Math.round(damage),life:.65,color});
}
export function spawnEnemy(g,boss=false,elite=false,archetype){
  if(g.mode==='bossrush'){if(!boss&&archetype!=='mimic')return null;const active=g.enemies.find(e=>e.boss&&e.hp>0);if(boss&&active)return active;}
  const id=archetype||(boss?pickBoss(g.map.id,{exclude:g.lastBossId?[g.lastBossId]:[]}):pickEnemy(g.map.id,g.wave));
  if(boss&&!archetype)g.lastBossId=id;
  const e=makeEnemy(g,id,boss,elite);e.waveIndex=g.wave;g.enemies.push(e);return e;
}
export function hitPlayer(g,damage,{dot=false}={}){
  if(g.training?.god||g.bossIntro||g.ultimate?.type==='diavolo'||g.dash||g.p.hp<=0||(!dot&&g.invuln>0)||damage<=0)return false;
  if(g.ultimate?.type==='maomao'||g.ultimate?.type==='shinji')damage*=.65;
  const p=g.p;damage*=heroResistance(g)*statusModifiers(p).damageTaken*(1-(p.damageReduction||0));const dodged=!dot&&Math.random()<p.dodge;if(!dot)g.invuln=dodged?.3:.65;
  if(dodged){g.numbers.push({x:p.x,y:p.y-40,amount:'DODGE',life:.6,color:'#94efcc'});return false;}
  if(!dot&&blockHeroHit(g))return false;
  const armorAbsorbed=absorbErzaBarrier(g,damage);damage-=armorAbsorbed;heroHurt(g,damage);p.hurtTimer=.45;g.hurtFlash=dot?.18:.55;const absorbed=Math.min(p.shield,damage);p.shield-=absorbed;p.hp-=damage-absorbed;g.shake=Math.max(g.shake,dot?1:6);
  burst(g,p.x,p.y,absorbed?'#fac4ea':'#ff8499',dot?3:12);
  if(p.hp<=0){p.hp=0;g.status='over';queuePlayerDeath(g);}
  return true;
}
export function inflictAttackStatus(g,attack){
  const type=attack.status||({VENOM:'poison','SERPENT STRIKE':'poison','DEATH BEAM':'burning','MALEVOLENT SHRINE':'cursed','CURTAIN FALL':'stun'}[attack.label])||({ki:'burning',deathball:'burning',curse:'cursed',note:'slow',petal:'slow',thorn:'poison',ember:'burning',fish:'slow',soul:'cursed',shockwave:'stun',lance:'burning',magma:'burning',icicle:'frozen',thunder:'stun',hook:'slow',kunai:'bleeding',slash:'bleeding',gear:'stun',raven:'cursed',cero:'burning',plasma:'burning',drain:'slow',rinka:'burning'}[attack.kind]);
  if(!type||(type==='poison'&&g.ultimate?.type==='maomao'))return;
  applyStatus(g.p,type,type==='stun'?.35:type==='frozen'?.8:type==='slow'?2.5:3,{power:type==='poison'?3:type==='burning'?4:type==='bleeding'?3:type==='slow'?.3:0,source:attack.kind||attack.label||'contact'});
}
function updateHostileAttacks(g,dt){
  clearOrphanRiftSummons(g);
  for(const s of g.enemyShots){if(g.ultimate?.type==='esdeath'&&distance(s,g.ultimate)<g.ultimate.r)continue;s.age+=dt;s.life-=dt;if(s.turn){const a=Math.atan2(s.vy,s.vx)+s.turn*dt,v=Math.hypot(s.vx,s.vy);s.vx=Math.cos(a)*v;s.vy=Math.sin(a)*v;}const frozen=g.ultimate?.type==='gojo'&&Math.hypot(s.x-g.ultimate.x,s.y-g.ultimate.y)<g.ultimate.r;const stopped=g.ultimate?.type==='esdeath'&&distance(s,g.ultimate)<g.ultimate.r;const clockScale=g.ultimate?.type==='kurumi'&&distance(s,g.ultimate)<g.ultimate.r?.35:1;s.x+=s.vx*dt*(stopped?0:frozen?.1:clockScale);s.y+=s.vy*dt*(stopped?0:frozen?.1:clockScale);
    if(g.cloneUnits.some(c=>Math.hypot(c.x-s.x,c.y-s.y)<14)){s.life=0;continue;}
    const obstacle=pointCollider(g,s.x,s.y,s.r);if(obstacle){damageProp(g,obstacle,s.damage*.6);s.life=0;continue;}
    if(Math.hypot(s.x-g.p.x,s.y-g.p.y)<s.r+PLAYER_RADIUS){const vitality=g.p.hp+g.p.shield;if(hitPlayer(g,s.damage)){inflictAttackStatus(g,s);if(s.leech){const source=g.enemies.find(e=>e.id===s.sourceId&&e.hp>0);if(source)source.hp=Math.min(source.maxHp,source.hp+Math.max(0,vitality-g.p.hp-g.p.shield)*s.leech);}if(s.kind==='hook'){const dx=s.sourceX-g.p.x,dy=s.sourceY-g.p.y,d=Math.hypot(dx,dy)||1;moveBody(g,g.p,dx/d*55,dy/d*55,PLAYER_RADIUS);}}s.life=0;}
  }
  g.enemyShots=g.enemyShots.filter(s=>s.life>0&&distance(s,g.p)<1800);
  for(const h of g.hazards){if(h.cancelWithSource&&!g.enemies.some(e=>e.id===h.sourceId&&e.hp>0)){h.age=Infinity;continue;}let hazardDt=dt;if(h.bossUltimate||h.sourceClock){const source=g.enemies.find(e=>e.id===h.sourceId&&e.hp>0);if(!source){h.age=Infinity;continue;}if(bossUltimatePaused(g,source))continue;if(g.ultimate?.type==='kurumi'&&distance(source,g.ultimate)<g.ultimate.r)hazardDt*=source.boss?.7:.35;}const hx=h.shape==='line'?(h.x+h.tx)/2:h.x,hy=h.shape==='line'?(h.y+h.ty)/2:h.y;if(!h.sourceClock&&g.ultimate?.type==='esdeath'&&Math.hypot(hx-g.ultimate.x,hy-g.ultimate.y)<g.ultimate.r)continue;h.age+=hazardDt;
    if(h.age<h.delay||h.age>h.delay+h.duration)continue;
    let contact=false;
    if(h.shape==='circle')contact=distance(h,g.p)<h.r+PLAYER_RADIUS;
    else{const dx=h.tx-h.x,dy=h.ty-h.y,length=dx*dx+dy*dy,t=Math.max(0,Math.min(1,((g.p.x-h.x)*dx+(g.p.y-h.y)*dy)/(length||1)));contact=Math.hypot(g.p.x-h.x-t*dx,g.p.y-h.y-t*dy)<h.width+PLAYER_RADIUS;}
    if(contact&&hitPlayer(g,h.damage))inflictAttackStatus(g,h);
  }
  g.hazards=g.hazards.filter(h=>h.age<h.delay+h.duration);
}

function shoot(g,id,x,y,a,damage,rank,fused){
  g.shots.push({type:id,x,y,ox:x,oy:y,vx:Math.cos(a)*(id==='blue'?230:440),vy:Math.sin(a)*(id==='blue'?230:440),life:fused&&id==='shuriken'?2.4:1.8,age:0,damage,rank,fused,r:id==='blue'?24:id==='shuriken'?10+rank:6,pierce:(id==='shuriken'?rank+1:1)+(fused?4:0),hits:new Set(),color:id==='rosebow'?'#f6aad5':id==='blue'?'#cf9bff':id==='shuriken'?'#80e8c5':'#ffcb8c'});
  return g.shots.at(-1);
}
export function castWeapon(g,id,target){
  if(riftTrialActive(g)||forbiddenWeapon(g.p,id)||g.ultimate?.type==='diavolo')return false;
  if(id==='rasengan'&&(target.hp<=0||distance(g.p,target)>pairedWeaponReach(g,id)+(target.r||0)))return false;
  if(id==='chainsaw'&&(target.hp<=0||distance(g.p,target)>denjiAttackReach(g)+(target.r||0)))return false;
  if(id==='dragonslayer'&&(target.hp<=0||distance(g.p,target)>gutsAttackReach(g)+(target.r||0)))return false;
  if(id==='crimson'&&distance(g.p,target)>crimsonReach(g.p)+(target.r||0))return false;
  if(id==='requip'&&distance(g.p,target)>requipReach(g)+(target.r||0))return false;
  g.p.attackTimer=.3;g.p.castKind=id;g.p.aimAngle=Math.atan2(target.y-g.p.y,target.x-g.p.x);
  const boost=consumeHeroCast(g,id,target);
  const p=g.p,rank=p.weapons[id],fused=!!p.fusions[id],power=p.damage*boost.damage*(1+(rank-1)*.35)*(fused?2:1)*(g.ultimate?.type==='shinji'?1.35:1)*((id===p.weapon||(p.id==='megumi'&&id==='nue'))?1+(p.meta.signatureDamage||0):1),a=Math.atan2(target.y-p.y,target.x-p.x);
  if(castSalvation(g,id,target,power,boost,{damage:damageEnemy,burst}))return true;
  if(isPairedWeapon(g,id))return castPairedWeapon(g,id,target,power,boost,{damage:damageEnemy,burst,toxin:heroToxin});
  if(castMultiItemFusion(g,id,target,power,boost))return;
  if(castEvolvedWeapon(g,id,target,power))return;
  if(id==='chainsaw'){return castChainsaw(g,target,power,boost,damageEnemy);
  }else if(id==='dragonslayer'){return castDragonslayer(g,target,power,boost,damageEnemy);
  }else if(id==='requip'){return castRequip(g,target,power,damageEnemy);
  }else if(id==='quill'){castQuill(g,target,power);
  }else if(id==='blackflame'){castBlackFlame(g,target,power);
  }else if(id==='crimson'){castCrimson(g,target,power,damageEnemy);
  }else if(id==='garuda'){if(castGaruda(g,target,power)===false)return false;
  }else if(id==='odmblades'){
    const reach=(fused?190:115+rank*8)*p.area;g.odmSerial=(g.odmSerial||0)+1;p.attackTimer=.42;effect(g,'odm-slash',{x:p.x,y:p.y-22,r:reach,angle:a,rank,slashSide:g.odmSerial%2?1:-1,hookDistance:Math.min(reach*.86,Math.max(42,distance(target,p))),hookSpread:Math.min(24,reach*.18),color:'#d5ebf0',life:.48,max:.48});
    for(const e of g.enemies){const d=distance(e,p),dot=Math.cos(Math.atan2(e.y-p.y,e.x-p.x)-a);if(e.hp>0&&d<reach+e.r&&dot>-.15){damageEnemy(g,e,24*power,'#d8eceb');applyStatus(e,'bleeding',fused?4:2.5,{power:4*power,source:'odm-blades'});}}
    for(const o of g.world.active)if(distance(o,p)<reach+o.r&&Math.cos(Math.atan2(o.y-p.y,o.x-p.x)-a)>-.15)damageProp(g,o,30*power);
  }else if(id==='titanfists'){
    const reach=(175+rank*8)*p.area;if(distance(target,p)>reach+target.r)return;const x=p.x+Math.cos(a)*65,y=p.y+Math.sin(a)*65,r=(fused?155:85+rank*8)*p.area;effect(g,'titan-impact',{x,y,r,color:'#e5c3a0',life:.35,max:.35});
    for(const e of g.enemies)if(e.hp>0&&Math.hypot(e.x-x,e.y-y)<r+e.r){damageEnemy(g,e,58*power,'#ebd3b0');applyStatus(e,'stun',fused?.8:.4);const d=distance(e,p)||1;e.kvx=(e.x-p.x)/d*180;e.kvy=(e.y-p.y)/d*180;}damagePropsInRadius(g,x,y,r,60*power);
  }else if(id==='nue'){
    summonNue(g,rank,power,fused,boost.duration||1);
  }else if(id==='zoltraak'){
    const yy=p.y-26,aim=Math.atan2(target.y-yy,target.x-p.x),length=(560+rank*35)*p.area*boost.area,width=(fused?10:5+rank*.6)*p.area*boost.area;
    for(const offset of fused?[-.13,0,.13]:[0]){const aa=aim+offset,tx=p.x+Math.cos(aa)*length,ty=yy+Math.sin(aa)*length;effect(g,'zoltraak',{x:p.x,y:yy,tx,ty,width,color:fused?'#e5efc8':'#d9e9de',life:.24,max:.24});for(const e of g.enemies)if(segmentDistance(e.x,e.y,p.x,yy,tx,ty)<e.r+width){damageEnemy(g,e,31*power,'#edf5d5');if(fused)applyStatus(e,'cursed',4);}for(const o of g.world.active)if(segmentDistance(o.x,o.y,p.x,yy,tx,ty)<o.r+width)damageProp(g,o,30*power);}
  }else if(id==='powerbeam'){
    const yy=p.y-24,aim=Math.atan2(target.y-yy,target.x-p.x),stage=p.id==='samus'?cannonStage(g):0,n=1+(rank>=4?1:0)+(id===p.weapon?(p.meta.projectiles||0):0);for(let i=0;i<n;i++){const aa=aim+(i-(n-1)/2)*.14,q=shoot(g,id,p.x+Math.cos(aim)*14,yy,aa,22*power,rank,fused);q.vx=Math.cos(aa)*520;q.vy=Math.sin(aa)*520;q.r=boost.charged||fused?8:4;q.pierce=1+Math.floor(rank/2)+(boost.pierce||0)+(fused?3:0);q.charged=boost.charged||fused;q.color=fused?'#acf3d2':CANNON_STAGES[stage].color;q.beamStage=stage;q.wave=stage>=1?.7:0;if(stage>=3)q.pierce+=3;const payload=cannonPayload(g);if(payload){const missile=shoot(g,payload,p.x,yy,aim,(payload==='supermissile'?100:55)*p.damage,rank,false);missile.vx=Math.cos(aim)*420;missile.vy=Math.sin(aim)*420;missile.r=5;missile.pierce=1;missile.blastRadius=payload==='supermissile'?100:65;missile.color=payload==='supermissile'?'#aee8a3':'#f8bc8e';}}
  }else if(id==='clockshot'){
    const n=(fused?5:2+Math.floor(rank/2))+(id===p.weapon?(p.meta.projectiles||0):0),y=p.y-24,aim=Math.atan2(target.y-y,target.x-p.x);
    for(let i=0;i<n;i++){const aa=aim+(i-(n-1)/2)*.11,q=shoot(g,id,p.x,y,aa,18*power,rank,fused);q.vx=Math.cos(aa)*550;q.vy=Math.sin(aa)*550;q.pierce=1+Math.floor(rank/2)+(fused?2:0);q.delay=fused?i*.07:0;q.whiteQueen=p.id==='kurumi'&&p.skin==='whitequeen';q.color=q.whiteQueen?'#dbe8f2':'#edb688';q.markDuration=2.4*(1+(p.passives.timepiece||0)*.15);}
    effect(g,'clock-muzzle',{x:p.x+Math.cos(aim)*18,y:y+Math.sin(aim)*18,r:18,angle:aim,fused,whiteQueen:p.id==='kurumi'&&p.skin==='whitequeen',color:'#f4c68e',life:.28,max:.28});
  }else if(id==='icelance'){const n=(fused?7:2+Math.floor(rank/2))+(id===p.weapon?(p.meta.projectiles||0):0),yy=p.y-22,aim=Math.atan2(target.y-yy,target.x-p.x);for(let i=0;i<n;i++){const aa=aim+(i-(n-1)/2)*.13,q=shoot(g,id,p.x,yy,aa,17*power,rank,fused);q.vx=Math.cos(aa)*430;q.vy=Math.sin(aa)*430;q.r=6;q.pierce=1+Math.floor(rank/2)+(fused?3:0);q.color='#bde7f6';}}else if(id==='pallet'){
    const y=p.y-24,aim=Math.atan2(target.y-y,target.x-p.x);
    const n=3+(id===p.weapon?(p.meta.projectiles||0):0);for(let i=0;i<n;i++){const aa=aim+(i-(n-1)/2)*.025,s=shoot(g,id,p.x+Math.cos(aim)*13,y,aa,12*power,rank,false);s.vx=Math.cos(aa)*650;s.vy=Math.sin(aa)*650;s.delay=i*.075;s.r=4;s.life=1.5;s.pierce=1+Math.floor(rank/2);s.color='#e8d7ad';}
  }else if(id==='ki'){
    const yy=p.y-23,aim=Math.atan2(target.y-yy,target.x-p.x),n=fused?1:1+(rank>=3?1:0);for(let i=0;i<n;i++){const aa=aim+(i-(n-1)/2)*.09,q=shoot(g,'ki',p.x,yy,aa,(fused?48:28)*power,rank,fused);q.charge=fused?.45:.22;q.life=fused?2:1.45;q.vx=Math.cos(aa)*(fused?850:650);q.vy=Math.sin(aa)*(fused?850:650);q.r=fused?14:9+rank;q.pierce=fused?99:3+rank;q.color=fused?'#8ce7ff':'#aadfff';}
    effect(g,'ki-charge',{x:p.x,y:yy,r:fused?24:15,color:'#c0edff',life:.25,max:.25});
  }else if(id==='red'){
    const yy=p.y-20,aim=Math.atan2(target.y-yy,target.x-p.x),q=shoot(g,'red',p.x,yy,aim,30*power,rank,false);q.r=7;q.vx=Math.cos(aim)*390;q.vy=Math.sin(aim)*390;q.pierce=1;q.color='#ff9ba9';q.blastRadius=(55+rank*9)*p.area;
  }else if(id==='shadows'){
    summonPack(g,rank,power,fused,boost.duration||1);
  }else if(id==='blue'){
    const area=p.area*(1+(id===p.weapon?(p.meta.signatureArea||0):0));
    if(fused){const orb=shoot(g,id,p.x,p.y-18,a,52*power,rank,true);orb.charge=.42;orb.life=2.7;orb.vx=Math.cos(a)*340;orb.vy=Math.sin(a)*340;orb.r=26*area/p.area;orb.pierce=99;effect(g,'convergence',{x:p.x,y:p.y-18,r:40,color:'#bca3ff',life:.42,max:.42});}
    else{const d=distance(p,target),reach=Math.min(420,d),x=p.x+Math.cos(a)*reach,y=p.y+Math.sin(a)*reach;g.fields.push({id:++g.id,kind:'blue',x,y,life:1.8+rank*.2,max:1.8+rank*.2,r:(51+rank*8)*area,damage:11*power,collapseDamage:23*power,pull:160,tick:0,color:'#73c7ff',age:0});effect(g,'blue-cast',{x:p.x,y:p.y-20,tx:x,ty:y,r:20,color:'#97d9ff',life:.24,max:.24});}
  }else if(id==='poison'){
    const duration=(4+rank*.3)*(1+(p.meta.poisonDuration||0))*(fused?1.5:1),r=(42+rank*5)*p.area*boost.area*(1+(id===p.weapon?(p.meta.signatureArea||0):0))*(fused?1.35:1);
    const d=Math.hypot(target.x-p.x,target.y-p.y),reach=Math.min(400,d),cx=p.x+Math.cos(a)*reach,cy=p.y+Math.sin(a)*reach;
    for(let i=0;i<(fused?3:1);i++){const offset=fused?(i-1)*r*.85:0,tx=cx-Math.sin(a)*offset,ty=cy+Math.cos(a)*offset,x=p.x+Math.cos(a)*12,y=p.y-22;
      g.shots.push({type:'poison',x,y,ox:x,oy:y,tx,ty,vx:(tx-x)/.55,vy:(ty-y)/.55,life:.56,age:0,damage:5*power,poisonPower:5*power,rank,fused,r:5,color:fused?'#d4b8ed':'#a6db83',duration,cloudRadius:r,hits:new Set()});
    }
    effect(g,'brew-cast',{x:p.x,y:p.y-20,r:25,color:'#b7e79c',life:.32,max:.32});
  }else if(id==='rosebow'){
    p.aimAngle=Math.atan2(target.y-(p.y-20),target.x-p.x);const bow=bowPose(p),aim=Math.atan2(target.y-bow.muzzle.y,target.x-bow.muzzle.x);const n=boost.projectiles+(fused?5:1+Math.floor(rank/2))+(id===p.weapon?(p.meta.projectiles||0):0);for(let i=0;i<n;i++)shoot(g,id,bow.muzzle.x,bow.muzzle.y,aim+(i-(n-1)/2)*.28,24*power,rank,fused);
  }else if(id==='shuriken'||id==='kunai'){
    const n=id==='shuriken'?boost.projectiles+1+Math.floor(rank/2)+(fused?1:0)+(id===p.weapon?(p.meta.projectiles||0):0):2+rank;
    for(let i=0;i<n;i++)shoot(g,id,p.x,p.y,a+(i-(n-1)/2)*(id==='kunai'?.19:.22),id==='shuriken'?22*power:12*power,rank,fused);
  }else if(id==='lightning'){
    if(target.kind==='prop'){damageProp(g,target,30*power);effect(g,'lightning',{points:[{x:p.x,y:p.y},{x:target.x,y:target.y}],life:.28,max:.28,color:'#ffe391'});}
    let current=p,remaining=g.enemies.filter(e=>e.hp>0),points=[{x:p.x,y:p.y}];
    for(let i=0;i<(fused?14:2+rank);i++){
      remaining.sort((a,b)=>distance(current,a)-distance(current,b));const e=remaining.shift();if(!e||distance(current,e)>650)break;
      damageEnemy(g,e,30*power,'#ffe595');applyStatus(e,'stun',fused?.9:.55);burst(g,e.x,e.y,'#ffe595',5);points.push({x:e.x,y:e.y});current=e;
    }
    effect(g,'lightning',{points,life:.28,max:.28,color:'#ffe391'});
  }
}
function explodeOrdnance(g,s){
 if(s.exploded)return;s.exploded=true;const radius=(s.blastRadius||65)*g.p.area;effect(g,s.type==='red'?'red-impact':'nova',{x:s.x,y:s.y,r:radius,color:s.color,life:.4,max:.4});damagePropsInRadius(g,s.x,s.y,radius,s.damage);for(const e of g.enemies)if(e.hp>0&&Math.hypot(e.x-s.x,e.y-s.y)<radius+e.r){damageEnemy(g,e,s.damage,s.color);if(s.type==='red'){applyStatus(e,'cursed',3);const d=Math.hypot(e.x-s.x,e.y-s.y)||1;e.kvx=(e.x-s.x)/d*230;e.kvy=(e.y-s.y)/d*230;}else applyStatus(e,s.type==='supermissile'?'stun':'burning',s.type==='supermissile'?.65:2,{power:s.damage*.1,source:s.type});}s.life=0;
}
export function useDash(g,direction={x:0,y:0}){
 if(g.status!=='playing'||g.bossIntro||g.dashCD>0||g.dash||!statusModifiers(g.p).canAct)return false;
 let {x,y}=direction;if(Math.hypot(x,y)<.05)({x,y}=g.lastMove||{x:g.p.facing||1,y:0});const d=Math.hypot(x,y)||1;g.dash={age:0,duration:.22,x:x/d,y:y/d};g.dashCD=10;burst(g,g.p.x,g.p.y,g.p.color,12,90);return true;
}
export function useSpecial(g){if(riftTrialActive(g))return false;const used=startUltimate(g);if(used){spendStolenTime(g);trinketUltimateUsed(g);}return used;}

const worldEventAPI=g=>({spawn:spawnEnemy,queueIntro:queueBossIntro,makeGem,coinMultiplier:g=>trinketBonus(g).coins,blocked:(x,y,r)=>pointCollider(g,x,y,r)||onWater(g.map,x,y,r)});
export function activateEventTrinket(g,slot){
 if(riftTrialActive(g))return false;
 return useEventTrinket(g,slot,{startEvent:id=>{
  const status=g.status,resumeStatus=g.resumeStatus;
  if(status==='paused'){g.status='playing';delete g.resumeStatus;}
  const started=startWorldEvent(g,id,worldEventAPI(g),{source:'item'});
  if(!started){g.status=status;if(resumeStatus===undefined)delete g.resumeStatus;else g.resumeStatus=resumeStatus;}
  return started;
 }});
}

function loot(g){
  clearOrphanRiftSummons(g);
  queueBossDeaths(g);
  for(const boss of g.enemies)if(boss.hp<=0&&boss.archetype==='aura')for(const minion of g.enemies)if(minion.ownerId===boss.id)minion.hp=0;
  for(const e of g.enemies)if(e.hp<=0){
    if(e.boss&&bossDeathPending(g,e))continue;
    if(defeatedEventBoss(g,e)){heroKill(g,e);trinketEnemyDefeated(g);rollEnemyTrinket(g,e);burst(g,e.x,e.y,e.color,45);g.checkpointRequested=true;continue;}
    if(defeatedMimic(g,e)){heroKill(g,e);trinketEnemyDefeated(g);burst(g,e.x,e.y,'#d4b1ee',28);g.checkpointRequested=true;continue;}
    if(defeatedRiftBoss(g,e,{makeGem,coinMultiplier:g=>trinketBonus(g).coins,clearOutgoing})){heroKill(g,e);trinketEnemyDefeated(g);rollEnemyTrinket(g,e);burst(g,e.x,e.y,e.color,55);g.checkpointRequested=true;continue;}
    heroKill(g,e);trinketEnemyDefeated(g);rollEnemyTrinket(g,e);g.kills++;g.characterXp+=(e.boss?25:e.elite?5:1)*(1+(g.p.meta.masteryGain||0));if(e.boss||g.kills%8===0)g.money+=(e.boss?25:2)*(1+(g.p.meta.coinGain||0))*trinketBonus(g).coins;burst(g,e.x,e.y,e.boss?'#ffcb78':e.elite?'#f4bb83':'#c29eb8',e.elite?25:7);
    g.gems.push(makeGem(e.x,e.y,enemyXpValue(e,g.wave)));
    if(e.boss||e.elite)g.chests.push({x:g.mode==='bossrush'?g.p.x:e.x,y:g.mode==='bossrush'?g.p.y:e.y,boss:e.boss,source:e.name});
    if(e.boss){g.bossKills++;g.toast=e.name.toUpperCase()+' DEFEATED · TREASURE CHEST DROPPED';g.toastTime=4;defeatedRushBoss(g,e);}
  }
  g.enemies=g.enemies.filter(e=>bossDeathPending(g,e)||e.hp>0&&(g.mode!=='bossrush'&&g.waveState?.version===1||e.boss||e.archetype==='mimic'||distance(e,g.p)<2600));
  // Consolidate faraway XP rather than discarding it during long runs.
  if(g.gems.length>450){const merged=g.gems.splice(0,100);g.gems.push(makeGem(merged[0].x,merged[0].y,merged.reduce((s,v)=>s+v.value,0),0));}
}
// A trial keeps movement and dash available while holding the combat state.
// Small movement steps let touch drags and dashes cross pickup circles reliably.
function updateTrialMovement(g,dt,input){
 const p=g.p,len=Math.hypot(input.x,input.y);
 g.time+=dt;g.invuln=Math.max(0,g.invuln-dt);g.dashCD=Math.max(0,g.dashCD-dt);
 g.hurtFlash=Math.max(0,g.hurtFlash-dt);g.shake=Math.max(0,g.shake-dt*22);g.toastTime=Math.max(0,g.toastTime-dt);
 p.hurtTimer=Math.max(0,(p.hurtTimer||0)-dt);p.attackTimer=0;p.moving=len>.05;p.walk+=dt*(p.moving?12:2);
 if(len>.05)g.lastMove={x:input.x/len,y:input.y/len};
 if(g.dash){
  const step=Math.min(dt,Math.max(0,g.dash.duration-g.dash.age));
  moveBody(g,p,g.dash.x*950*step,g.dash.y*950*step,PLAYER_RADIUS,{push:true});
  p.moving=true;p.facing=g.dash.x<0?-1:1;g.dash.age+=dt;if(g.dash.age>=g.dash.duration)g.dash=null;
 }else if(p.moving){
  const speed=Math.max(160,p.move*trinketBonus(g).move);
  moveBody(g,p,input.x/Math.max(1,len)*speed*dt,input.y/Math.max(1,len)*speed*dt,PLAYER_RADIUS,{push:true});
  if(Math.abs(input.x)>.05)p.facing=Math.sign(input.x);
 }
 updatePet(g,dt);
}
function beginPendingRiftTrial(g){
 if(riftTrialActive(g)||!g.rifts?.active)return false;
 const boss=g.enemies.find(e=>e.id===g.rifts.active.bossEntityId&&e.riftBoss&&e.hp>0&&!e.enraged&&e.hp<=e.maxHp*.5);
 return !!boss&&beginRiftTrial(g,boss);
}
export function updateRun(g,dt,input={x:0,y:0}){
  if(g.status!=='playing')return;
  if(tickBossIntro(g,dt))return;
  beginPendingRiftTrial(g);
  if(riftTrialActive(g)){
    ensureWorld(g);
    for(let left=Math.max(0,Number.isFinite(dt)?dt:0);left>1e-8&&g.status==='playing'&&riftTrialActive(g);){
      const step=Math.min(.04,left);updateTrialMovement(g,step,input);updateRiftTrial(g,step,{hitPlayer});left-=step;
    }
    return;
  }
  if(g.riftTrialAfterglow){g.riftTrialAfterglow.age+=dt;if(g.riftTrialAfterglow.age>=g.riftTrialAfterglow.duration)g.riftTrialAfterglow=null;}
  updateFriendlyDeaths(g,dt);
  updateBossDeaths(g,dt);
  ensureWorld(g);updateWorld(g,dt);
  if(advanceBossRush(g,dt,{spawn:spawnEnemy,queueIntro:queueBossIntro}))return;
  const p=g.p;p.hurtTimer=Math.max(0,(p.hurtTimer||0)-dt);p.attackTimer=Math.max(0,(p.attackTimer||0)-dt);g.haste=Math.max(0,g.haste-dt);g.magnetPulse=Math.max(0,g.magnetPulse-dt);g.dashCD=Math.max(0,g.dashCD-dt);g.time+=dt;g.spawn-=dt;g.special=Math.max(0,g.special-dt);g.secondarySpecial=Math.max(0,(g.secondarySpecial||0)-dt);g.invuln=Math.max(0,g.invuln-dt);g.hurtFlash=Math.max(0,g.hurtFlash-dt);g.freeze=Math.max(0,g.freeze-dt);g.clones=Math.max(0,g.clones-dt);g.shake=Math.max(0,g.shake-dt*22);g.toastTime=Math.max(0,g.toastTime-dt);
  updateTrinkets(g,dt);updateHeroMechanic(g,dt);
  updateStatuses(p,dt,(amount)=>hitPlayer(g,amount,{dot:true}));if(g.status==='over')return;
  const playerMods=statusModifiers(p);
  p.hp=Math.min(p.maxHp,p.hp+p.regen*dt);
  if(p.maxShield>0){p.shieldTimer+=dt;if(p.shieldTimer>=(p.shieldRecharge||10)){p.shield=p.maxShield;p.shieldTimer%=(p.shieldRecharge||10);}}
  const oldPosition={x:p.x,y:p.y};
  const len=Math.hypot(input.x,input.y);p.moving=len>.05&&playerMods.canAct;p.walk+=dt*(p.moving?12:2);
  if(len>.05)g.lastMove={x:input.x/len,y:input.y/len};
  if(g.dash){const step=Math.min(dt,g.dash.duration-g.dash.age);moveBody(g,p,g.dash.x*950*step,g.dash.y*950*step,PLAYER_RADIUS,{push:true});p.moving=true;p.facing=g.dash.x<0?-1:1;g.dash.age+=dt;if(g.dash.age>=g.dash.duration)g.dash=null;}else if(p.moving){const speed=p.move*trinketBonus(g).move*heroMoveBonus(g)*playerMods.speed*(g.ultimate?.type==='shinji'?1.15:1)*(g.haste>0?1.25:1)*(g.ultimate?.type==='goku'&&g.ultimate.age<1.2?.55:1);moveBody(g,p,input.x/Math.max(1,len)*speed*dt,input.y/Math.max(1,len)*speed*dt,PLAYER_RADIUS,{push:true});if(Math.abs(input.x)>.05)p.facing=Math.sign(input.x);g.walkDust-=dt;if(g.walkDust<=0){burst(g,p.x,p.y+16,g.map.color,1,15);g.walkDust=.1;}}
  heroMovement(g,dt,Math.hypot(p.x-oldPosition.x,p.y-oldPosition.y));
  updatePet(g,dt);updateGaruda(g,dt);
  const natural=trainingNatural(g);
  if(natural)updateWorldEvents(g,dt,worldEventAPI(g));
  if(g.status!=='playing'||g.bossIntro)return;
  if((natural||g.rifts?.portal)&&!eventCombatActive(g))updateRifts(g,dt,{blocked:(x,y,r)=>pointCollider(g,x,y,r)},g.chestRandom||Math.random);
  if(g.status!=='playing')return;
  const riftActive=riftCombatActive(g);
  g.waveSpawnDelay=Math.max(.3,1.1-g.time*.002)/difficultyFor(g.difficulty).spawnRate;
  updateTraining(g);
  if(natural&&!riftActive&&!eventCombatActive(g)&&updateWaves(g,dt,{spawn:spawnEnemy,queueIntro:queueBossIntro,pendingDeath:bossDeathPending}))return;
  if(g.bossIntro)return;
  updateSummons(g,dt,{damage:damageEnemy,burst});
  if(g.ultimate?.type!=='frieren')updateFrierenGolem(g,dt,{damage:(g,e,v,color)=>damageEnemy(g,e,v*(1+(g.p.meta.ultimateDamage||0)),color),burst});
  updateCrimsonEchoes(g,dt,damageEnemy);
  const departingDecoys=[...g.cloneUnits.map(unit=>({kind:'clone',unit:{...unit},hero:{...p,id:'naruto'}})),...(g.ultimate?.shadows||[]).map(unit=>({kind:'shadow',unit:{...unit},hero:{...p,id:'kurumi'}}))];
  updateUltimate(g,dt,{damage:(g,e,v,color)=>damageEnemy(g,e,v*(1+(p.meta.ultimateDamage||0)),color),burst,shoot});
  queueDepartedDecoys(g,departingDecoys);
  loot(g);if(g.status==='over')return;
  updateEnemyRecall(g,dt);
  for(const e of g.mode==='bossrush'?[...g.enemies]:g.enemies){
    const d=distance(p,e);e.hit=Math.max(0,e.hit-dt);e.slow=Math.max(0,e.slow-dt);e.orbitCD=Math.max(0,e.orbitCD-dt);
    updateStatuses(e,dt,(amount,color)=>damageEnemy(g,e,amount,color));
    if(e.hp<=0)continue;
    if(beginPendingRiftTrial(g))return;
    updateEnemyAI(g,e,dt);
    if(g.bossIntro)return;
    if(e.kvx||e.kvy){moveBody(g,e,(e.kvx||0)*dt,(e.kvy||0)*dt,Math.min(e.r*.6,19));e.kvx*=Math.exp(-8*dt);e.kvy*=Math.exp(-8*dt);}
    if(!hasStatus(e,'stun')&&!hasStatus(e,'frozen')&&!(g.ultimate?.type==='esdeath'&&distance(e,g.ultimate)<g.ultimate.r)&&distance(p,e)<e.r*.65+PLAYER_RADIUS&&hitPlayer(g,(e.boss?23:e.elite?16:9)*(e.damageScale||1)))inflictAttackStatus(g,{status:e.contactStatus||(e.archetype==='snake'||e.archetype==='rosewitch'?'poison':e.family==='jjk'?'cursed':null)});
    if(g.status==='over')return;
  }
  separateEnemies(g);
  updateHostileAttacks(g,dt);if(g.status==='over')return;

  let target=null,best=Infinity;for(const e of g.enemies){if(e.hp<=0)continue;const d=distance(e,p);if(d<best){best=d;target=e;}}
  let attackTarget=target;const supply=g.world.active.filter(o=>o.hp>0&&Number.isFinite(o.hp)&&distance(o,p)<260).sort((a,b)=>distance(a,p)-distance(b,p))[0];if(supply&&(!target||distance(supply,p)<distance(target,p)))attackTarget=supply;
  for(const id of Object.keys(p.weapons)){
    if(!playerMods.canAct||g.ultimate?.type==='diavolo')continue;
    p.cooldowns[id]=Math.max(0,(p.cooldowns[id]||0)-dt);
    if(id==='orbit'){
      const rank=p.weapons[id],fused=!!p.fusions[id],n=fused?6:1+Math.floor(rank/2),radius=(fused?105:65+rank*5)*p.area;
      for(let i=0;i<n;i++){const a=g.time*2.6+i*TAU/n,x=p.x+Math.cos(a)*radius,y=p.y+Math.sin(a)*radius;
        for(const o of g.world.active)if(o.hp>0&&Number.isFinite(o.hp)&&Math.hypot(o.x-x,o.y-y)<o.r+16*p.area){o.orbitCD=(o.orbitCD||0)-dt;if(o.orbitCD<=0){damageProp(g,o,15+rank*9);o.orbitCD=.4;}}
        for(const e of g.enemies)if(e.orbitCD<=0&&Math.hypot(e.x-x,e.y-y)<e.r+16*p.area){damageEnemy(g,e,(15+rank*9)*p.damage*(fused?2:1),'#97d7ff');e.orbitCD=.35;burst(g,x,y,'#97d7ff',4);}}
    }else if(attackTarget&&p.cooldowns[id]<=0){
      if(castWeapon(g,id,attackTarget)===false)continue;p.cooldowns[id]=((id==='rosebow'&&p.fusions.rosebow==='salvation'?1.6:pairedWeaponCooldown(g,id))??((p.fusions[id]&&['pallet','odmblades'].includes(id))?1.8:({chainsaw:.85,dragonslayer:1.55,requip:1.3,quill:1.2,blackflame:1.3,crimson:1.05,garuda:1.15,odmblades:.85,titanfists:1.4,nue:6,ki:1.4,red:1.7,shadows:5.5,blue:1.6,shuriken:.8,kunai:.85,lightning:1.65,rosebow:.95,poison:1.7,pallet:1.05,icelance:1.2,clockshot:1.15,zoltraak:1.35,powerbeam:.85}[id])))*(id==='requip'?erzaForm(g).cadence:1)*(1-(p.weapons[id]-1)*.07)*p.cooldown*(g.ultimate?.type==='shinji'?.75:1)*((id===p.weapon||(p.id==='megumi'&&id==='nue'))?1-(p.meta.signatureCooldown||0):1);
    }
  }

  for(const s of g.shots){
    if(updateSalvationShot(g,s,dt,{damage:damageEnemy,burst}))continue;
    if(updatePairedShot(g,s,dt,{damage:damageEnemy,burst,toxin:heroToxin}))continue;
    if(updateMultiItemShot(g,s,dt,{damage:damageEnemy,burst}))continue;
    if(updateRequipSword(g,s,dt,{damage:damageEnemy,burst}))continue;
    if(updateQuillShot(g,s,dt,{damage:damageEnemy,burst}))continue;
    if(updateEvolvedShot(g,s,dt,{damage:damageEnemy,burst}))continue;
    if(updateBlackFlame(g,s,dt,{damage:damageEnemy,burst}))continue;
    if(updateGarudaShot(g,s,dt,{damage:damageEnemy,burst}))continue;
    s.age+=dt;s.life-=dt;
    if(s.delay&&s.age<s.delay)continue;
    if(s.type==='poison'){s.x+=s.vx*dt;s.y+=s.vy*dt;if(s.age>=.55){s.life=0;g.fields.push({kind:'poison',x:s.tx,y:s.ty,life:s.duration,max:s.duration,r:s.cloudRadius,id:++g.id,damage:s.damage,poisonPower:s.poisonPower,fused:s.fused,tick:0,age:0,color:s.color});burst(g,s.tx,s.ty,s.color,12);}continue;}
    if(s.charge&&s.age<s.charge){if(s.type==='ki'){s.x=p.x+Math.cos(p.aimAngle||0)*16;s.y=p.y-23;}continue;}
    if(s.wave){const angle=Math.atan2(s.vy,s.vx),step=Math.sin(s.age*18)*s.wave*180*dt;s.x-=Math.sin(angle)*step;s.y+=Math.cos(angle)*step;}
    if(s.fused&&s.type==='shuriken'&&s.age>1.05){const a=Math.atan2(p.y-s.y,p.x-s.x);s.vx=Math.cos(a)*460;s.vy=Math.sin(a)*460;}
    if(s.type==='rosebow'){const candidates=g.enemies.filter(e=>e.hp>0&&!s.hits.has(e.id));let target=candidates[0];for(const e of candidates)if(!target||distance(e,s)<distance(target,s))target=e;if(target){const a=Math.atan2(target.y-s.y,target.x-s.x),speed=s.fused?500:370;const blend=Math.min(1,dt*6);s.vx+=(Math.cos(a)*speed-s.vx)*blend;s.vy+=(Math.sin(a)*speed-s.vy)*blend;}}
    s.ox=s.x;s.oy=s.y;s.x+=s.vx*dt;s.y+=s.vy*dt;
    if(!s.holy){const obstacle=pointCollider(g,s.x,s.y,s.r*p.area);if(obstacle){if(['red','missile','supermissile'].includes(s.type)){explodeOrdnance(g,s);continue;}if(!s.hits.has(obstacle.id)){damageProp(g,obstacle,s.damage,s.vx*.2,s.vy*.2);s.hits.add(obstacle.id);}if(!Number.isFinite(obstacle.hp)||--s.pierce<=0)s.life=0;}}
    if(s.life<=0)continue;
    for(const e of g.enemies){if(e.hp<=0||s.hits.has(e.id))continue;
      if(Math.hypot(s.x-e.x,s.y-e.y)<e.r+s.r*p.area){
        if(['red','missile','supermissile'].includes(s.type)){explodeOrdnance(g,s);break;}
        s.hits.add(e.id);if(s.type==='ki'){applyStatus(e,'burning',3,{power:s.damage*.12,source:'ki'});const d=Math.hypot(s.vx,s.vy)||1;e.kvx=s.vx/d*100;e.kvy=s.vy/d*100;}if(s.type==='powerbeam'&&s.beamStage>=2)applyStatus(e,'frozen',.65);if(s.type==='powerbeam'&&s.beamStage>=3)applyStatus(e,'burning',3,{power:s.damage*.12,source:'plasma'});if(s.type==='zoltraak')applyStatus(e,'cursed',3);if(s.type==='powerbeam'&&s.charged){const radius=52*p.area;effect(g,'nova',{x:e.x,y:e.y,r:radius,color:s.color,life:.3,max:.3});damagePropsInRadius(g,e.x,e.y,radius,s.damage*.4);for(const other of g.enemies)if(other!==e&&other.hp>0&&distance(e,other)<radius)damageEnemy(g,other,s.damage*.4,s.color);if(s.fused)applyStatus(e,'burning',3,{power:s.damage*.12,source:'plasma'});}if(s.type==='clockshot'){applyStatus(e,'cursed',3);applyStatus(e,'slow',s.markDuration||2.4,{power:s.fused?.5:.35});if(s.fused)applyStatus(e,'stun',.45);effect(g,'clock-mark',{x:e.x,y:e.y-16,r:19,angle:Math.atan2(s.vy,s.vx),fused:s.fused,whiteQueen:!!s.whiteQueen,color:s.whiteQueen?'#dbe8f2':'#e5bd7e',life:.55,max:.55});}if(s.type==='blue')applyStatus(e,'cursed',4);damageEnemy(g,e,s.damage,s.color);if(s.type==='icelance'){if(applyStatus(e,'frozen',s.fused?1:.65))heroFreeze(g);applyStatus(e,'slow',1.5,{power:.35});if(s.fused){const radius=55*p.area;effect(g,'frost-burst',{x:e.x,y:e.y,r:radius,color:'#c4eafa',life:.35,max:.35});for(const other of g.enemies)if(other.id!==e.id&&distance(e,other)<radius){damageEnemy(g,other,s.damage*.4,s.color);applyStatus(other,'frozen',.65);}}}if(s.type==='shuriken'||s.type==='kunai')applyStatus(e,'bleeding',2.5,{power:s.damage*.14,source:s.type});burst(g,s.x,s.y,s.color,5);
        if((s.type==='rosebow')||(s.fused&&(s.type==='blue'||s.type==='shuriken'||s.type==='kunai'))){
          const radius=s.type==='rosebow'?(s.fused?95:24+s.rank*4):s.type==='blue'?105:48;
          effect(g,s.type==='blue'?'purple-impact':'nova',{x:e.x,y:e.y,r:radius,color:s.color,life:.35,max:.35});damagePropsInRadius(g,e.x,e.y,radius,s.damage*.5);if(s.holy)g.p.hp=Math.min(g.p.maxHp,g.p.hp+.35);
          for(const other of g.enemies)if(other.id!==e.id&&distance(e,other)<radius){if(s.type==='blue')applyStatus(other,'cursed',4);damageEnemy(g,other,s.damage*.5,s.color);if(s.fused&&s.type==='kunai')applyStatus(other,'stun',.5);}
        }
        if(--s.pierce<=0){s.life=0;break;}
      }
    }
  }
  g.shots=g.shots.filter(s=>s.life>0);
  for(const f of g.fields){
    const activeDt=Math.min(dt,Math.max(0,f.life));f.life-=dt;f.age+=dt;f.tick-=activeDt;
    if(f.kind==='blue')for(const e of g.enemies){const d=distance(e,f);if(e.hp>0&&d<f.r+e.r&&d>6)moveBody(g,e,(f.x-e.x)/d*Math.min(d-6,f.pull*activeDt*(e.boss?.2:1)),(f.y-e.y)/d*Math.min(d-6,f.pull*activeDt*(e.boss?.2:1)),Math.min(e.r*.6,19));}
    if(f.tick<=0&&activeDt>0){
      damagePropsInRadius(g,f.x,f.y,f.r,f.damage);
      for(const e of g.enemies)if(e.hp>0&&distance(e,f)<f.r+e.r){
        if(f.kind==='poison'){heroToxin(g);applyStatus(e,'poison',3*(1+(p.meta.poisonDuration||0)),{power:f.poisonPower||f.damage*.7,source:f.id??'panacea'});}
        else{applyStatus(e,'cursed',3);applyStatus(e,'slow',.7,{power:.5});}
        damageEnemy(g,e,f.damage,f.color||'#b8b4ff');
      }
      f.tick=f.kind==='poison'?.5:.4;
    }
    if(f.life<=0&&f.kind==='blue'&&!f.collapsed){f.collapsed=true;for(const e of g.enemies)if(e.hp>0&&distance(e,f)<f.r+e.r)damageEnemy(g,e,f.collapseDamage||f.damage,'#bde9ff');damagePropsInRadius(g,f.x,f.y,f.r,f.collapseDamage||f.damage);effect(g,'blue-collapse',{x:f.x,y:f.y,r:f.r,color:'#8ddcff',life:.35,max:.35});}
  }
  g.fields=g.fields.filter(f=>f.life>0);loot(g);if(g.status==='over')return;
  for(const gem of g.gems){const d=distance(gem,p);if(d<p.magnet*trinketBonus(g).magnet||gem.attracted){gem.attracted=true;const step=Math.min(d,480*dt);gem.x+=(p.x-gem.x)/(d||1)*step;gem.y+=(p.y-gem.y)/(d||1)*step;}
    if(d<23){gem.collected=true;heroXp(g,gem.value);if(g.mode!=='bossrush'&&grantXp(p,gem.value)){g.status='upgrade';burst(g,p.x,p.y,'#d2b6ff',28);break;}}}
  g.gems=g.gems.filter(gem=>!gem.collected);
  if(g.status==='playing')for(const chest of g.chests)if(!chest.mimicLocked&&distance(chest,p)<32){
    if(tryChestMimic(g,chest,{spawn:spawnEnemy},g.chestRandom||Math.random)){burst(g,chest.x,chest.y,'#cba5e8',35);g.checkpointRequested=true;break;}
    chest.collected=true;g.rewards=resolveChestContents(g,chest,g.chestRandom||Math.random);g.chestIndex=0;g.chestVersion=2;g.chestSource=chest.source||'TREASURE CACHE';g.chestKind=chest.mimicDefeated?'mimic':chest.eventReward?'event':chest.tier==='rift'||chest.riftReward?'rift':'normal';g.status='chest';g.chestOpeningComplete=false;g.checkpointRequested=true;burst(g,p.x,p.y,g.chestKind==='rift'?'#c9b5ff':'#ffdfa4',45);break;
  }

  g.chests=g.chests.filter(c=>!c.collected);
  collectNearbyTrinket(g);
  for(const q of g.particles){q.x+=q.vx*dt;q.y+=q.vy*dt;q.vx*=1-dt*2;q.vy*=1-dt*2;q.life-=dt;}
  for(const q of g.numbers){q.y-=dt*30;q.life-=dt;}
  for(const q of g.effects)q.life-=dt;
  g.particles=g.particles.filter(q=>q.life>0);g.numbers=g.numbers.filter(q=>q.life>0);g.effects=g.effects.filter(q=>q.life>0);
}
