import {BOSSES,SPAWN_WEIGHTS,mapFamilies,weightedPick} from './enemies.js';
export {MIMIC_DEF,mimicAttack} from './rift-mimic.js';
import {syncDenjiForm} from './denji.js';
import {syncGutsArmor} from './guts.js';
import {chestOffers,openChest,getUpgradePool,waveAt} from './game.js';
import {createWorld,ensureWorld} from './world.js';
import {createRiftArena,restoreRiftArena} from './rift-arena.js';

// Rifts are optional encounters, never members of the normal map rotations.
export const RIFT_OPEN_AT=180;
export const RIFT_INTERVAL=300;
export const RIFT_LIFETIME=75;
export const MIMIC_CHANCE=.05;
export const RIFT_ENCOUNTERS=[
 {id:'foundereren',name:'Founding Titan Eren',title:'THE RUMBLING BEYOND THE WALLS',color:'#e1bc99'},
 {id:'beerus',name:'Beerus · God of Destruction',title:'A GOD BEYOND THE RIFT',color:'#c3a0ef'},
 {id:'walpurgisrift',name:'Walpurgisnacht · Night of Calamity',title:'THE LAST NIGHT OF THE WORLD',color:'#e6a4ca'},
 {id:'aizenrift',name:'Aizen · Hōgyoku Ascendant',title:'BEYOND THE LIMITS OF A SOUL',color:'#c7a9ef'},
 {id:'madararift',name:'Madara · Ten-Tails Jinchūriki',title:'THE SAGE OF SIX PATHS RETURNS',color:'#d5dfbd'},
 {id:'sukunaheian',name:'Sukuna · Heian Incarnation',title:'THE FOUR-ARMED KING OF CURSES',color:'#e7a599'},
 {id:'borosrift',name:'Boros · Meteoric Burst',title:'DOMINATOR OF THE UNIVERSE',color:'#e8a9d1'},
 {id:'darknessdevil',name:'Darkness Devil',title:'THE PRIMORDIAL FEAR',color:'#c5c8b7'},
 {id:'deathdevil',name:'Death Devil',title:'THE LAST FEAR',color:'#dedbd0'},
 {id:'acnologia',name:'Acnologia',title:'THE DRAGON OF THE APOCALYPSE',color:'#7d93c4'},
 {id:'milim',name:'Milim Nava',title:'THE DESTROYER',color:'#f0a6b8'},
];
const finite=(n,fallback=0)=>Number.isFinite(n)?n:fallback;
// Rifts open in no set order: a calamity from the map's main series is three times
// as likely, every other rift remains possible and the last one never repeats.
export function pickRiftEncounter(mapId,lastId,random=Math.random){
 const families=mapFamilies(mapId),pool=RIFT_ENCOUNTERS.filter(def=>def.id!==lastId);
 return weightedPick(pool.length?pool:RIFT_ENCOUNTERS,def=>families.has(BOSSES[def.id]?.family)?SPAWN_WEIGHTS.featuredRift:SPAWN_WEIGHTS.other,random)||RIFT_ENCOUNTERS[0];
}
const count=n=>Math.max(0,Math.floor(finite(n)));
const encounter=id=>RIFT_ENCOUNTERS.find(def=>def.id===id);
const aliveBoss=g=>(g.enemies||[]).some(e=>e.boss&&e.hp>0);
export function newRifts(){return {version:1,nextAt:RIFT_OPEN_AT,opened:0,cleared:0,declined:0,portal:null,active:null,history:[]};}
export const riftCombatActive=g=>!!g.rifts?.active;
const available=g=>g.mode!=='bossrush'&&g.status==='playing'&&!g.bossIntro&&!aliveBoss(g)&&!(g.chests||[]).length&&!g.trinkets?.pending&&!g.waveState?.pendingBossWaves?.length&&!(g.wave%5===0&&g.waveState?.bossSpawned===false);
function portalPoint(g,random,blocked){
 const first=random()*Math.PI*2;
 for(let i=0;i<12;i++){
  const a=first+i*Math.PI/6,r=i<6?165:110,x=g.p.x+Math.cos(a)*r,y=g.p.y+Math.sin(a)*r;
  if(!blocked?.(x,y,30))return {x,y};
 }
 // The player's current position is always a reachable fallback.
 return {x:g.p.x,y:g.p.y};
}
export function updateRifts(g,dt,{blocked}={},random=Math.random){
 g.rifts??=newRifts();const r=g.rifts;
 if(g.mode==='bossrush'||g.status!=='playing'||g.bossIntro||r.active||g.events?.active)return false;
 if(r.portal){
  r.portal.age+=Math.max(0,finite(dt));
  if(r.portal.age>=RIFT_LIFETIME){r.portal=null;r.nextAt=g.time+RIFT_INTERVAL;return false;}
  if(available(g)&&Math.hypot(g.p.x-r.portal.x,g.p.y-r.portal.y)<42){g.status='rift';r.portal.prompted=true;return true;}
  return false;
 }
 if(g.time<r.nextAt||!available(g))return false;
 const def=pickRiftEncounter(g.map?.id,r.lastBossId,random);r.lastBossId=def.id;
 r.portal={...portalPoint(g,random,blocked),bossId:def.id,age:0,prompted:false,serial:r.opened+1};r.opened++;
 g.toast='A CALAMITY RIFT HAS OPENED · APPROACH TO CHOOSE';g.toastTime=5;
 return true;
}
// Opens a portal to a chosen calamity beside the player (Training mode).
export function openRiftPortal(g,bossId,{blocked,random=Math.random}={}){
 g.rifts??=newRifts();const r=g.rifts,def=encounter(bossId);
 if(!def||g.mode==='bossrush'||r.active||g.events?.active)return false;
 const first=random()*Math.PI*2;let point={x:g.p.x+70,y:g.p.y};
 for(let i=0;i<12;i++){const a=first+i*Math.PI/6,x=g.p.x+Math.cos(a)*80,y=g.p.y+Math.sin(a)*80;if(!blocked?.(x,y,30)){point={x,y};break;}}
 r.portal={...point,bossId:def.id,age:0,prompted:false,serial:r.opened+1};r.opened++;r.lastBossId=def.id;
 g.toast=def.name.toUpperCase()+' · RIFT OPENED · STEP INTO THE PORTAL';g.toastTime=4;
 return true;
}
export function clearRiftOutgoing(g){
 g.shots=[];g.fields=[];g.crimsonEchoes=[];
 if(g.garuda){g.garuda.inFlight=false;g.garuda.flightId=null;}
}
function moveCompanions(g,x,y){
 if(g.pet){g.pet.x=x-35;g.pet.y=y+5;}
 if(g.garuda){g.garuda.x=x+25;g.garuda.y=y-24;g.garuda.inFlight=false;g.garuda.flightId=null;}
 if(g.golem){g.golem.x=x-55;g.golem.y=y-15;}
 for(let i=0;i<(g.summons||[]).length;i++){const s=g.summons[i],a=i*2.399;s.x=x+Math.cos(a)*55;s.y=y+Math.sin(a)*55;}
 for(let i=0;i<(g.cloneUnits||[]).length;i++){g.cloneUnits[i].x=x-45+i*12;g.cloneUnits[i].y=y+30;}
}
export function chooseRift(g,enter,{spawn,queueIntro,clearOutgoing=clearRiftOutgoing}={}){
 const r=g.rifts,portal=r?.portal;
 if(g.status!=='rift'||!portal||!encounter(portal.bossId)||r.active||g.events?.active)return false;
 if(!enter){r.declined++;r.portal=null;r.nextAt=g.time+RIFT_INTERVAL;g.status='playing';g.invuln=Math.max(g.invuln||0,1);return true;}
 if(typeof spawn!=='function')return false;
 const suspended={enemies:g.enemies.filter(e=>e.hp>0),enemyShots:g.enemyShots,hazards:g.hazards,
  world:g.world,player:{x:g.p.x,y:g.p.y},pickups:g.pickups||[],gems:g.gems||[],trinketDrops:g.trinkets?.drops||[],ultimate:g.ultimate||null};
 const active={bossId:portal.bossId,serial:portal.serial,startedAt:g.time,bossEntityId:null,suspended,rewarded:false};
 r.active=active;g.enemies=[];g.enemyShots=[];g.hazards=[];g.summonDeaths=[];
 g.riftArena=createRiftArena(portal.bossId,g.time);g.world=createWorld();g.p.x=0;g.p.y=140;g.pickups=[];g.gems=[];g.ultimate=null;syncGutsArmor(g);syncDenjiForm(g);
 if(g.trinkets)g.trinkets.drops=[];
 moveCompanions(g,g.p.x,g.p.y);
 const boss=spawn(g,true,false,portal.bossId);
 if(!boss){g.enemies=suspended.enemies;g.enemyShots=suspended.enemyShots;g.hazards=suspended.hazards;g.world=suspended.world;Object.assign(g.p,suspended.player);g.pickups=suspended.pickups;g.gems=suspended.gems;g.ultimate=suspended.ultimate;syncGutsArmor(g);syncDenjiForm(g);if(g.trinkets)g.trinkets.drops=suspended.trinketDrops;g.riftArena=null;r.active=null;return false;}
 active.bossEntityId=boss.id;boss.riftSerial=active.serial;boss.riftBoss=true;
 // Keep the enormous silhouette above the player, clear of the top-left HUD.
 boss.x=g.p.x+155;boss.y=g.p.y-80;boss.attackCD=Math.max(2.2,boss.attackCD||0);
 clearOutgoing(g);r.portal=null;g.status='playing';g.boss=true;g.invuln=Math.max(g.invuln||0,2);
 g.toast='CALAMITY RIFT · '+boss.name.toUpperCase();g.toastTime=5;
 queueIntro?.(g,boss,g.wave);return true;
}
function restoreSuspended(g,active){
 g.summonDeaths=[];
 const suspended=active.suspended||{};
 if(suspended.player&&Number.isFinite(suspended.player.x)&&Number.isFinite(suspended.player.y)){g.p.x=suspended.player.x;g.p.y=suspended.player.y;}
 if(suspended.world?.objects instanceof Map&&suspended.world?.destroyed instanceof Set)g.world=suspended.world;
 g.riftArena=null;
 g.pickups=[...(suspended.pickups||[]),...(g.pickups||[])];g.gems=[...(suspended.gems||[]),...(g.gems||[])];
 if(g.trinkets)g.trinkets.drops=[...(suspended.trinketDrops||[]),...(g.trinkets.drops||[])];
 if(!g.ultimate&&suspended.ultimate){g.ultimate=suspended.ultimate;if(g.ultimate.type==='frieren'&&g.golem)g.ultimate.golem=g.golem;}
 syncGutsArmor(g);syncDenjiForm(g);moveCompanions(g,g.p.x,g.p.y);
 for(const enemy of suspended.enemies||[]){
  if(enemy.hp<=0)continue;
  const d=Math.hypot(enemy.x-g.p.x,enemy.y-g.p.y);
  if(d<150){const a=(enemy.id||1)*2.399963;enemy.x=g.p.x+Math.cos(a)*190;enemy.y=g.p.y+Math.sin(a)*190;}
  g.enemies.push(enemy);
 }
 // Old hostile warnings are resumed exactly where they were suspended. A short
 // grace period prevents returning into an unavoidable pre-existing projectile.
 g.enemyShots.push(...(suspended.enemyShots||[]));g.hazards.push(...(suspended.hazards||[]));
 g.invuln=Math.max(g.invuln||0,2);g.spawn=Math.max(g.spawn||0,1.5);g.eliteAt=Math.max(g.eliteAt||0,g.time+15);
 // A long optional fight must not release several overdue ordinary bosses at once.
 const future=(Math.floor(waveAt(g.time)/5)+1)*5;
 if(!g.waveState?.version&&g.nextBossWave<=waveAt(g.time))g.nextBossWave=future;
 g.boss=g.enemies.some(e=>e.boss&&e.hp>0&&!e.riftBoss);
 if(g.world&&g.view)ensureWorld(g);
}
export function defeatedRiftBoss(g,e,{makeGem,coinMultiplier=()=>1,clearOutgoing=clearRiftOutgoing}={}){
 if(e.riftRewarded&&e.hp<=0)return true;
 const r=g.rifts,active=r?.active;
 if(!active||e.id!==active.bossEntityId||!e.riftBoss||e.hp>0)return false;
 if(active.rewarded)return true;
 active.rewarded=true;e.riftRewarded=true;r.cleared++;r.history.push({serial:active.serial,bossId:active.bossId,defeatedAt:g.time});
 if(r.history.length>30)r.history.shift();
 const coins=900+150*(r.cleared-1),xp=250+75*(r.cleared-1),paid=Math.round(coins*(1+(g.p.meta?.coinGain||0))*coinMultiplier(g));
 g.money+=paid;g.kills++;g.bossKills++;g.characterXp+=150*(1+(g.p.meta?.masteryGain||0));
 g.p.hp=Math.min(g.p.maxHp,g.p.hp+g.p.maxHp*.35);g.p.shield=Math.min(g.p.maxShield||0,(g.p.shield||0)+(g.p.maxShield||0)*.35);
 // Encounter-bound reinforcements cannot follow the hero out of their arena or
 // delay the promised reward. Suspended map enemies have not been restored yet.
 g.enemies=g.enemies.filter(unit=>!unit.riftSummon);
 clearOutgoing(g);g.enemyShots=[];g.hazards=[];restoreSuspended(g,active);e.x=g.p.x;e.y=g.p.y;
 const gem=makeGem?makeGem(g.p.x+45,g.p.y+15,xp):{x:g.p.x+45,y:g.p.y+15,value:xp,phase:0,tier:'ruby'};
 g.gems.push(gem);
 g.chests.push({id:'rift-cache:'+active.serial,x:g.p.x,y:g.p.y,boss:true,source:e.name,rewardCount:5,tier:'rift',kind:'rift',riftReward:true,bonus:{coins:paid,xp,healing:35}});
 r.active=null;r.nextAt=g.time+RIFT_INTERVAL;
 g.toast='CALAMITY CLEARED · +'+paid+' COINS · '+xp+' XP · FIVE REWARDS';g.toastTime=7;
 return true;
}

// Mimics borrow the promised chest instead of replacing its contents. The chest
// remains in the world (locked and hidden), which also holds Boss Rush loot gates.
export function chestRewardOffers(p,chest,random=Math.random){
 if(!Array.isArray(chest.rewardOffers)||!chest.rewardOffers.length){
  chest.rewardOffers=chest.rewardCount?chestOffers(p,chest.rewardCount,random,chest):openChest(p,random,chest);
  chest.rewardCount=chest.rewardOffers.length;
 }
 // A level-up earned during a mimic fight may make its first item obsolete.
 // Keep the exact saved offer whenever legal; preserve all reward slots otherwise.
 const pool=getUpgradePool(p),legal=new Set(pool.map(c=>c.kind+':'+c.id)),newFusion=pool.some(c=>c.kind==='fusion')&&chest.rewardOffers[0]?.kind!=='fusion';
 if(newFusion||(chest.rewardOffers[0]?.kind!=='heal'&&!legal.has(chest.rewardOffers[0]?.kind+':'+chest.rewardOffers[0]?.id)))chest.rewardOffers=chestOffers(p,chest.rewardCount,random,chest);
 return chest.rewardOffers.map(c=>({...c}));
}
export function resolveChestContents(g,chest,random=Math.random){chest.maxLevelItems=g.mode==='bossrush';return chestRewardOffers(g.p,chest,random);}
export function tryChestMimic(g,chest,{spawn}={},random=Math.random){
 if(chest.mimicLocked)return true;
 if(chest.mimicChecked)return false;
 chest.mimicChecked=true;
 // Roll before rolling contents: exactly one independent five-percent check.
 if(random()>=MIMIC_CHANCE||typeof spawn!=='function')return false;
 chest.maxLevelItems=g.mode==='bossrush';chestRewardOffers(g.p,chest,random);
 chest.id??='cache:'+ ++g.id;
 const enemy=spawn(g,false,false,'mimic');
 if(!enemy)return false;
 enemy.x=chest.x;enemy.y=chest.y;enemy.mimicChestId=chest.id;enemy.attackCD=1.8;enemy.windup=1;
 chest.mimicLocked=true;chest.mimicId=enemy.id;g.invuln=Math.max(g.invuln||0,1.2);
 g.toast='THAT CHEST IS A MIMIC! · DEFEAT IT TO RECLAIM YOUR TREASURE';g.toastTime=5;
 return true;
}
export function defeatedMimic(g,e){
 if(e.mimicRewarded&&e.hp<=0)return true;
 if(e.archetype!=='mimic'||!e.mimicChestId||e.hp>0)return false;
 e.mimicRewarded=true;
 const chest=g.chests.find(c=>c.id===e.mimicChestId);
 if(chest){chest.mimicLocked=false;chest.mimicChecked=true;chest.mimicDefeated=true;chest.kind=chest.tier==='rift'||chest.riftReward?'rift':'mimic';chest.x=g.mode==='bossrush'?g.p.x:e.x;chest.y=g.mode==='bossrush'?g.p.y:e.y;delete chest.mimicId;}
 g.kills++;g.characterXp+=5*(1+(g.p.meta?.masteryGain||0));g.invuln=Math.max(g.invuln||0,.8);
 g.toast='MIMIC DEFEATED · ORIGINAL TREASURE RECOVERED';g.toastTime=4;
 return true;
}
export function restoreRifts(g){
 const raw=g.rifts||{},base=newRifts();g.rifts={...base,...raw,version:1,nextAt:Math.max(0,finite(raw.nextAt,RIFT_OPEN_AT)),opened:count(raw.opened),cleared:count(raw.cleared),declined:count(raw.declined),history:Array.isArray(raw.history)?raw.history.slice(-30):[]};
 const r=g.rifts;
 if(r.portal&&(!encounter(r.portal.bossId)||!Number.isFinite(r.portal.x)||!Number.isFinite(r.portal.y)))r.portal=null;
 if(r.portal)r.portal.age=Math.max(0,finite(r.portal.age));
 if(r.active&&(!encounter(r.active.bossId)||!g.enemies.some(e=>e.id===r.active.bossEntityId&&e.riftBoss))){restoreSuspended(g,r.active);r.active=null;r.nextAt=g.time+RIFT_INTERVAL;}
 if(g.mode==='bossrush'){r.portal=null;r.active=null;}
 if(r.active&&!g.riftArena&&!r.active.suspended?.world){
  // Migrate a checkpoint from before separate arenas existed without losing its
  // original world. All fixed warnings retain their offset from the player.
  const origin={x:g.p.x,y:g.p.y},dx=-origin.x,dy=140-origin.y,s=r.active.suspended??={};
  Object.assign(s,{world:g.world,player:origin,pickups:g.pickups||[],gems:g.gems||[],trinketDrops:g.trinkets?.drops||[],ultimate:g.ultimate||null});
  g.world=createWorld();g.pickups=[];g.gems=[];g.ultimate=null;syncGutsArmor(g);syncDenjiForm(g);if(g.trinkets)g.trinkets.drops=[];
  g.p.x=0;g.p.y=140;
  for(const unit of [...g.enemies,...g.enemyShots,...g.hazards]){if(Number.isFinite(unit.x))unit.x+=dx;if(Number.isFinite(unit.y))unit.y+=dy;if(Number.isFinite(unit.tx))unit.tx+=dx;if(Number.isFinite(unit.ty))unit.ty+=dy;}
  moveCompanions(g,0,140);
 }
 restoreRiftArena(g);
 for(const chest of g.chests||[])if(chest.mimicLocked&&!g.enemies.some(e=>e.id===chest.mimicId&&e.archetype==='mimic')){chest.mimicLocked=false;chest.mimicChecked=true;}
 const pending=g.status==='paused'?g.resumeStatus:g.status;
 if(pending==='rift'&&!r.portal){if(g.status==='paused')g.resumeStatus='playing';else g.status='playing';}
 return r;
}
