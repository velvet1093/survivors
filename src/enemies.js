import {DEVIL_ENEMIES,DEVIL_BOSSES,devilAttack,updateDevilCast} from './devil-enemies.js';
import {GRAVEYARD_ENEMIES,GRAVEYARD_BOSSES,graveyardAttack,updateGraveyardCast} from './graveyard-enemies.js';
import {EXPEDITION_ENEMIES,EXPEDITION_BOSSES,expeditionAttack,updateExpeditionCast} from './expedition-enemies.js';
import {DARKNESS_ENEMIES,DARKNESS_BOSSES} from './darkness-rift.js';
import {EVENT_ENEMIES,EVENT_BOSSES,worldEventAttack,updateWorldEventCast} from './world-event-data.js';
import {updateBerserkCast} from './berserk-enemies.js';
import {guardianTarget} from './guardian-health.js';
import {RIFT_MINIONS} from './rift-enemies.js';
import {MIMIC_DEF,mimicAttack} from './rift-encounters.js';
import {RIFT_SUPERBOSSES,riftSuperbossAttack} from './rift-superbosses.js';
import {updateBossUltimate} from './boss-ultimates.js';
import {transformBoss} from './boss-transform.js';
import {encounterPressure,strengthenEnemy} from './difficulty.js';
import {ANIME_ENEMIES,ANIME_BOSSES,animeAttack} from './anime-enemies.js';
import {statusModifiers} from './status.js';
import {navigateEnemy} from './world.js';
import {waveAt} from './game.js';
export const ENEMIES={
  ...GRAVEYARD_ENEMIES,
  ...EXPEDITION_ENEMIES,
  ...DEVIL_ENEMIES,...DARKNESS_ENEMIES,
  ...EVENT_ENEMIES,
  ...RIFT_MINIONS,
  mimic:MIMIC_DEF,
  ...ANIME_ENEMIES,
  saibaman:{name:'Saibaman',family:'dragonball',hp:1,speed:92,r:15,behavior:'leap',color:'#a7d66d',attack:3.8},
  soldier:{name:'Frieza Force Trooper',family:'dragonball',hp:1.3,speed:56,r:16,behavior:'shooter',color:'#aa94ea',attack:3.2},
  shinobi:{name:'Rogue Shinobi',family:'naruto',hp:1,speed:78,r:15,behavior:'dash',color:'#a8b7cb',attack:4},
  snake:{name:'Summoned Serpent',family:'naruto',hp:.65,speed:94,r:12,behavior:'serpent',color:'#aac79b',attack:5},
  curse:{name:'Cursed Crawler',family:'jjk',hp:1.25,speed:63,r:17,behavior:'crawler',color:'#bc91b8',attack:4.5},
  cursedeye:{name:'Cursed Eye',family:'jjk',hp:.8,speed:53,r:14,behavior:'radial',color:'#de919d',attack:4.3},
  familiar:{name:'Anthony Familiar',family:'madoka',hp:.8,speed:67,r:14,behavior:'familiar',color:'#e9c3ce',attack:3.6},
  butterfly:{name:'Witch’s Butterfly',family:'madoka',hp:.65,speed:82,r:13,behavior:'butterfly',color:'#a8bcf5',attack:4.6},
  rosewitch:{name:'Gertrud’s Rosebud',family:'madoka',hp:1.5,speed:42,r:19,behavior:'rose',color:'#e693b9',attack:4.8},
};
export const BOSSES={
  ...DEVIL_BOSSES,...DARKNESS_BOSSES,
  ...EVENT_BOSSES,
  ...RIFT_SUPERBOSSES,
  ...ANIME_BOSSES,
  frieza:{name:'Frieza',title:'EMPEROR OF THE UNIVERSE',family:'dragonball',hp:1900,speed:75,r:35,color:'#d5a7fb',behavior:'frieza'},
  orochimaru:{name:'Orochimaru',title:'THE IMMORTAL SERPENT',family:'naruto',hp:2100,speed:68,r:34,color:'#bad98b',behavior:'orochimaru'},
  sukuna:{name:'Ryomen Sukuna',title:'KING OF CURSES',family:'jjk',hp:2300,speed:84,r:34,color:'#f3a0ab',behavior:'sukuna'},
  walpurgis:{name:'Walpurgisnacht',title:'THE STAGE-CONSTRUCTING WITCH',family:'madoka',hp:2500,speed:40,r:48,color:'#eab3d8',behavior:'walpurgis'},
  ...GRAVEYARD_BOSSES,
  ...EXPEDITION_BOSSES,
};
export const REGULAR_BOSS_IDS=Object.keys(BOSSES).filter(id=>!BOSSES[id].riftOnly&&!BOSSES[id].eventOnly);
export const MAP_ENEMIES={garden:['shinobi','snake','saibaman','demonsoldier','spiderdemon','hanami'],ruins:['saibaman','soldier','curse','angelspawn','zombie','jogo'],moon:['curse','cursedeye','shinobi','flyhead','transfigured','jogo','hanami','dagon'],labyrinth:['familiar','butterfly','rosewitch'],marineford:['marine','marinesword','cannonier','pacifista','pirate'],citadel:['imperial','frostbeast','icemage']};
MAP_ENEMIES.castle=['demonsoldier','zombie','imperial','marinesword','transfigured','spiderdemon'];MAP_ENEMIES.forest=['snake','saibaman','hanami','spiderdemon','frostbeast','familiar'];
export const MAP_BOSSES={garden:['aura','orochimaru','akaza','mahito','frieza','sukuna','sachiel','walpurgis'],ruins:['frieza','sachiel','akaza','aura','mahito','orochimaru','sukuna','walpurgis'],moon:['mahito','sukuna','aura','akaza','sachiel','orochimaru','frieza','walpurgis'],labyrinth:['walpurgis','aura','mahito','sachiel','akaza','sukuna','orochimaru','frieza']};
const reinforcements=['akainu','aokiji','kizaru','budo','icedragon'];for(const map of Object.keys(MAP_BOSSES))MAP_BOSSES[map].push(...reinforcements);
MAP_BOSSES.marineford=['akainu','aokiji','kizaru','frieza','sachiel','sukuna','aura','mahito','akaza','orochimaru','walpurgis','budo','icedragon'];MAP_BOSSES.citadel=['budo','icedragon','aokiji','aura','akaza','mahito','sukuna','sachiel','frieza','orochimaru','walpurgis','akainu','kizaru'];
MAP_BOSSES.castle=['aura','budo','akaza','orochimaru','mahito','sukuna','sachiel','frieza','walpurgis','akainu','aokiji','kizaru','icedragon'];MAP_BOSSES.forest=['orochimaru','icedragon','aura','akaza','mahito','sukuna','sachiel','frieza','walpurgis','akainu','aokiji','kizaru','budo'];
for(const [map,ids]of Object.entries({garden:['puppet','rootanbu'],ruins:['hollow','celljunior'],moon:['hollow','cerobat','timewraith'],marineford:['celljunior'],citadel:['cerobat'],castle:['hollow','timewraith','puppet'],forest:['rootanbu','puppet','cerobat']}))MAP_ENEMIES[map].push(...ids);
const guestBosses={garden:['itachi','cell','ulquiorra'],ruins:['cell','ulquiorra','itachi'],moon:['itachi','ulquiorra','cell'],labyrinth:['ulquiorra','itachi','cell'],marineford:['cell','itachi','ulquiorra'],citadel:['ulquiorra','itachi','cell'],castle:['itachi','ulquiorra','cell'],forest:['cell','itachi','ulquiorra']};
for(const [map,guests]of Object.entries(guestBosses)){const remaining=MAP_BOSSES[map].slice(),order=remaining.splice(0,['marineford','citadel'].includes(map)?3:1);for(const id of guests){order.push(id,...remaining.splice(0,2));}MAP_BOSSES[map]=[...order,...remaining];}
for(const [map,ids]of Object.entries({ruins:['zoomer','ripper','zebesian','feralmetroid'],marineford:['zebesian','ripper'],citadel:['zoomer','sidehopper'],forest:['sidehopper'],castle:['feralmetroid']}))MAP_ENEMIES[map].push(...ids);
for(const [map,ids]of Object.entries(MAP_BOSSES))ids.splice(map==='ruins'?1:map==='marineford'||map==='citadel'?4:3,0,'ridley');
MAP_ENEMIES.zebes=['zoomer','ripper','sidehopper','feralmetroid','zebesian','greenpirate','redpirate','flyingpirate','goldpirate'];
MAP_BOSSES.zebes=['kraid','ridley','motherbrain',...REGULAR_BOSS_IDS.filter(id=>!['kraid','ridley','motherbrain'].includes(id))];
for(const [id,pool]of Object.entries(MAP_BOSSES))if(id!=='zebes')pool.push('kraid','motherbrain');
MAP_ENEMIES.ruins.push('greenpirate','redpirate');MAP_ENEMIES.marineford.push('flyingpirate');MAP_ENEMIES.castle.push('goldpirate');
MAP_ENEMIES.shiganshina=['puretitan','abnormal','smilingtitan','beardedtitan','crawlingtitan','smalltitan'];
MAP_BOSSES.shiganshina=['annie','reiner','bertholdt'];
for(const [map,ids]of Object.entries({garden:['fleshbud'],ruins:['stonevampire','badcompany','highwaystar'],moon:['fleshbud','highwaystar'],marineford:['badcompany','sheerheart'],citadel:['stonevampire'],castle:['stonevampire','fleshbud','sheerheart'],forest:['highwaystar','fleshbud']}))MAP_ENEMIES[map].push(...ids);
MAP_BOSSES.castle.splice(1,0,'dio','kira');MAP_BOSSES.ruins.splice(2,0,'kars');MAP_BOSSES.moon.splice(2,0,'kira');MAP_BOSSES.forest.splice(1,0,'kars');MAP_BOSSES.marineford.splice(4,0,'dio');
MAP_ENEMIES.leafvillage=['shinobi','snake','puppet','rootanbu','spiderdemon'];
MAP_ENEMIES.tournament=['saibaman','soldier','celljunior','cerobat'];
MAP_ENEMIES.tempest=['demonsoldier','snake','spiderdemon','frostbeast','highwaystar'];
MAP_BOSSES.leafvillage=['orochimaru','itachi','akaza','aura'];
MAP_BOSSES.tournament=['frieza','cell','sachiel','dio'];
MAP_BOSSES.tempest=['kars','aura','icedragon','orochimaru'];
MAP_ENEMIES.tokyo=['curse','cursedeye','fleshbud','badcompany','highwaystar','sheerheart','transfigured'];
MAP_ENEMIES.shibuya=['curse','cursedeye','flyhead','transfigured','jogo','hanami','dagon'];
for(const id of ['zombiedevil','leechfiend','batspawn','eternityflesh']){MAP_ENEMIES.tokyo.push(id);MAP_ENEMIES.shibuya.push(id);}
MAP_ENEMIES.ruins.push('zombiedevil','batspawn');MAP_ENEMIES.castle.push('leechfiend','eternityflesh');
MAP_BOSSES.tokyo=['dio','kira','mahito','sukuna'];
MAP_BOSSES.shibuya=['sukuna','mahito','aura','itachi'];
MAP_ENEMIES.eclipse=['possessedknight','eclipseheretic','apostlehound','wingedapostle'];
MAP_BOSSES.eclipse=['zodd','grunbeld','femto'];
MAP_ENEMIES.graveyard=['gravezombie','coffincrawler','lanternwisp','shadowstitch','hollowghost'];
MAP_BOSSES.graveyard=['ryuma','moriah'];
// Expedition foes join the existing worlds; their bosses arrive from wave 15 so earlier openings stay.
for(const [map,ids]of Object.entries({garden:['eisenwald','lizardman'],ruins:['orctrooper','phantomshade'],moon:['phantomshade','megalodon'],marineford:['megalodon','orctrooper'],citadel:['eisenwald','phantomshade'],castle:['phantomshade','eisenwald','vulcan'],forest:['vulcan','lizardman','eisenwald'],tempest:['orctrooper','megalodon','lizardman']}))MAP_ENEMIES[map].push(...ids);
for(const [map,ids]of Object.entries({castle:['jellal'],garden:['jellal'],forest:['kokushibo','jellal'],moon:['kokushibo'],tempest:['geld'],ruins:['geld'],leafvillage:['kokushibo']}))MAP_BOSSES[map].splice(2,0,...ids);
for(const pool of Object.values(MAP_BOSSES))for(const id of REGULAR_BOSS_IDS)if(!pool.includes(id))pool.push(id);
export function bossForWave(mapId,wave){const list=MAP_BOSSES[mapId];return list[(Math.floor(wave/5)-1)%list.length];}
export function makeEnemy(g,archetype,boss=false,elite=false){
  const def=(boss?BOSSES:ENEMIES)[archetype],wave=g.waveState?.version===1?Math.max(1,g.wave||1):waveAt(g.time),scale=1+(wave-1)*.13;
  const a=Math.random()*Math.PI*2,r=boss?Math.max(230,Math.min(420,Math.min(g.view.w,g.view.h)/(2*g.zoom)-30)):Math.hypot(g.view.w,g.view.h)/(2*g.zoom)+45;
  const pressure=encounterPressure(g);
  const hp=pressure.hp*def.hp*(boss?1+(wave/5-1)*.65:24*scale)*(elite?5:1);
  return {...def,pressureMinute:pressure.minute,pressureDifficulty:g.difficulty||'normal',pressureRushRound:g.mode==='bossrush'?g.rush?.round||1:0,damageScale:pressure.damage,lastDamagedAt:g.time,archetype,id:++g.id,x:g.p.x+Math.cos(a)*r,y:g.p.y+Math.sin(a)*r,hp,maxHp:hp,speed:def.speed*pressure.speed*(1+Math.min(.65,(wave-1)*.018)),r:def.r*(elite?1.3:1),boss,elite,hit:0,slow:0,orbitCD:0,phase:Math.random()*Math.PI*2,animTime:0,attackCD:(boss?1.2:1+Math.random()*2)/pressure.attackRate,skill:0,dash:0,dashX:0,dashY:0,windup:0,enraged:false,slowAttack:0};
}
function shot(g,e,angle,speed=160,kind='orb',color=e.color,r=6,damage=10){
  if(g.enemyShots.length>=200)return;
  speed*=encounterPressure(g).projectileSpeed;damage*=encounterPressure(g).damage;
  g.enemyShots.push({sourceId:e.id,x:e.x,y:e.y,vx:Math.cos(angle)*speed,vy:Math.sin(angle)*speed,life:7,r,color,damage,kind,sourceX:e.x,sourceY:e.y,age:0});
}
function fan(g,e,a,n=3,spread=.28,speed=180,kind='orb'){for(let i=0;i<n;i++)shot(g,e,a+(i-(n-1)/2)*spread,speed,kind);}
function ring(g,e,n,angle=0,speed=135,kind='orb'){for(let i=0;i<n;i++)shot(g,e,angle+i*Math.PI*2/n,speed,kind);}
function createHazard(g,data){if(g.hazards.length<45)g.hazards.push({age:0,delay:.9,duration:.45,damage:16,hit:false,color:'#f4a0ba',...data,damage:(data.damage??16)*encounterPressure(g).damage});}
function summon(g,e,id,n){if(g.mode==='bossrush')return;for(let i=0;i<n&&g.enemies.length<210;i++){const a=Math.PI*2*i/n,s=makeEnemy(g,id);s.x=e.x+Math.cos(a)*60;s.y=e.y+Math.sin(a)*60;s.ownerId=e.id;g.enemies.push(s);}}
export function updateEnemyAI(g,e,dt){
 const hazard=(g,data)=>createHazard(g,{source:e.archetype,sourceId:e.id,sourceX:e.x,sourceY:e.y,...data});
 strengthenEnemy(e,g.time,g.difficulty,g.mode==='bossrush'?g.rush?.round||1:0);
 if(g.ultimate?.type==='esdeath'&&Math.hypot(e.x-g.ultimate.x,e.y-g.ultimate.y)<g.ultimate.r){e.moving=false;return;}
  if(g.ultimate?.type==='kurumi'&&Math.hypot(e.x-g.ultimate.x,e.y-g.ultimate.y)<g.ultimate.r)dt*=e.boss?.7:.35;
  const frozenClock=g.freeze>0&&Math.hypot(e.x-(g.ultimate?.x??g.p.x),e.y-(g.ultimate?.y??g.p.y))<(g.voidRadius||650);const clockDt=frozenClock?dt*.05:dt;for(const key of ['armorTime','balanceTimer','compassTimer','regenWindow'])e[key]=Math.max(0,(e[key]||0)-clockDt);
  if(e.archetype==='ulquiorra'&&e.regenWindow>0&&g.time-(e.lastDamagedAt||0)>.8)e.hp=Math.min(e.maxHp,e.hp+e.maxHp*.008*dt);
  if(e.archetype==='cell'&&e.cellStage===2&&g.time-(e.lastDamagedAt||0)>3)e.hp=Math.min(e.maxHp,e.hp+e.maxHp*.006*dt);
  if(transformBoss(g,e))return;
  const modifiers=statusModifiers(e);if(!modifiers.canAct){e.moving=false;e.attackAnim=0;return;}
  let p=g.p;
  if(!e.boss)for(const clone of g.cloneUnits||[])if(Math.hypot(clone.x-e.x,clone.y-e.y)<Math.hypot(p.x-e.x,p.y-e.y))p=clone;
  p=guardianTarget(g,e,p);
  const dx=p.x-e.x,dy=p.y-e.y,d=Math.hypot(dx,dy),a=Math.atan2(dy,dx),frozen=g.freeze>0&&Math.hypot(e.x-(g.ultimate?.type==='gojo'?g.ultimate.x:g.p.x),e.y-(g.ultimate?.type==='gojo'?g.ultimate.y:g.p.y))<(g.voidRadius||650);
  updateBerserkCast(e,dt,frozen);
  updateWorldEventCast(e,dt,frozen);
  updateDevilCast(e,dt,frozen);
  updateGraveyardCast(e,dt,frozen);
  updateExpeditionCast(e,dt,frozen);
  const walkingBrain=e.archetype==='motherbrain'&&e.enraged;
  if(walkingBrain&&e.motherBrainAttack&&!frozen){e.motherBrainAttack.age+=dt;if(e.motherBrainAttack.age>=e.motherBrainAttack.duration)e.motherBrainAttack=null;}
  if(walkingBrain&&!e.motherBrainAttack&&!e.bossUltimate)e.facing=dx<0?-1:1;
  if(updateBossUltimate(g,e,dt,{hazard})){e.facing=walkingBrain?(e.bossUltimate?.facing||e.facing||1):(dx<0?-1:1);return;}
  let speed=e.speed*Math.min(e.slow>0?.35:1,modifiers.speed)*(frozen?.04:1),mx=Math.cos(a),my=Math.sin(a);
  e.animTime=(e.animTime||0)+dt*(frozen?.05:1)*(e.enraged?1.25:1);
  if(e.riftAttack&&!frozen){e.riftAttack.age+=dt;if(e.riftAttack.age>=e.riftAttack.duration)e.riftAttack=null;}
  e.attackAnim=Math.max(0,(e.attackAnim||0)-dt);e.facing=e.graveyardAttack?.facing||e.expeditionAttack?.facing||e.devilAttack?.facing||e.worldEventAttack?.facing||e.berserkAttack?.facing||(walkingBrain&&e.motherBrainAttack?e.motherBrainAttack.facing:(dx<0?-1:1));e.walk=(e.walk||0)+dt*(frozen?1:Math.max(1,e.speed/13));
  e.attackCD-=frozen?0:dt;e.dash=Math.max(0,e.dash-((['berserk','chainsawman'].includes(e.family)||e.eventOnly||!!e.graveyardAttack||!!e.expeditionAttack)&&frozen?0:dt));e.windup=Math.max(0,e.windup-((walkingBrain||['berserk','chainsawman'].includes(e.family)||e.eventOnly||!!e.graveyardAttack||!!e.expeditionAttack)&&frozen?0:dt));
  if(walkingBrain&&e.motherBrainAttack)e.attackAnim=.3;
  if(e.graveyardAttack||e.expeditionAttack||e.devilAttack||e.berserkAttack||e.worldEventAttack)e.attackAnim=.35;
  if(e.boss&&e.archetype!=='cell'&&!e.enraged&&e.hp<e.maxHp*.5){e.enraged=true;g.toast=e.name.toUpperCase()+' · SECOND PHASE';g.toastTime=3;}
  if(e.behavior==='zombie'&&e.hp<e.maxHp*.5)speed*=1.35;
  if(e.windup>0)speed=0;
  else if(e.dash>0){mx=e.dashX;my=e.dashY;speed*=4;}
  else if(walkingBrain){const stride=d>245?1:d<135?-.35:0;mx=Math.cos(a)*stride;my=Math.sin(a)*stride;}
  else if(['eisenwald','phantomshade','jellal','acnologia','milim','lanternwisp','hollowghost','moriah','paradehollow','peronaparade','ainztomb','batdevil','eternitydevil','leechfiend','eternityflesh','darknessdevil','deathdevil','darknessfragment','beerus','walpurgisrift','aizenrift','madararift','sukunaheian','borosrift','badcompany','fleshbud','dio','kira','shooter','radial','rose','familiar','frieza','walpurgis','jogo','hanami','dagon','aura','sachiel','marine','cannonier','pacifista','icemage','akainu','aokiji','kizaru','budo','icedragon','puppet','cerobat','timewraith','cell','itachi','ulquiorra','zebesian','ridley','redpirate','flyingpirate','goldpirate','eclipseheretic','wingedapostle','femto','eclipsefemto','tempestlord','frostregent','stormwraith'].includes(e.behavior)&&d<280){mx=-Math.cos(a)*.3+Math.sin(g.time+e.phase)*Math.sin(a)*.5;my=-Math.sin(a)*.3-Math.sin(g.time+e.phase)*Math.cos(a)*.5;}
  if(e.behavior==='flyhead'){mx+=Math.sin(g.time*4+e.phase)*.7;my+=Math.cos(g.time*3+e.phase)*.7;}
  if(e.behavior==='serpent'||e.behavior==='butterfly'){mx+=Math.sin(g.time*5+e.phase)*Math.sin(a)*.6;my-=Math.sin(g.time*5+e.phase)*Math.cos(a)*.6;}
  e.moving=speed>1&&(!walkingBrain||Math.hypot(mx,my)>.01);e.lean=e.dash>0?.2:Math.sin(e.walk)*.03;
  if(e.archetype==='bertholdt'&&e.enraged)speed*=.8;
  if(e.stationary&&!e.enraged){mx=0;my=0;}
  if(g.world)navigateEnemy(g,e,mx*speed,my*speed,dt);else{e.x+=mx*speed*dt;e.y+=my*speed*dt;}
  if(e.attackCD>0||frozen||d>900)return;
  e.attackAnim=.6;e.skill++;const fast=e.enraged?.72:1;e.attackCD=(e.boss?3.4:e.attack||4)*fast/encounterPressure(g).attackRate;
  if(devilAttack(g,e,p,a,{fan,ring,hazard,summon}))return;
  if(graveyardAttack(g,e,p,a,{fan,ring,hazard,summon}))return;
  if(expeditionAttack(g,e,p,a,{fan,ring,hazard,summon}))return;
  if(worldEventAttack(g,e,p,a,{fan,ring,hazard,summon}))return;
  if(mimicAttack(g,e,p,a,{fan,ring,hazard,summon}))return;
  if(riftSuperbossAttack(g,e,p,a,{fan,ring,hazard,summon}))return;
  if(animeAttack(g,e,p,a,{fan,ring,hazard:(g,data)=>hazard(g,{...data,sourceId:e.id}),summon}))return;
  if(e.behavior==='frieza'){
    if(e.skill%2){const length=950;hazard(g,{shape:'line',x:e.x,y:e.y,tx:e.x+Math.cos(a)*length,ty:e.y+Math.sin(a)*length,width:17,delay:.9,duration:.24,damage:25,color:'#e0a2ff',label:'DEATH BEAM'});e.windup=.9;}
    else ring(g,e,e.enraged?18:12,g.time*.3,155,'deathball');
  }else if(e.behavior==='orochimaru'){
    if(e.skill%3===1)summon(g,e,'snake',e.enraged?7:4);
    else if(e.skill%3===2){e.windup=.65;e.dash=1.1;e.dashX=Math.cos(a);e.dashY=Math.sin(a);hazard(g,{shape:'line',x:e.x,y:e.y,tx:e.x+Math.cos(a)*370,ty:e.y+Math.sin(a)*370,width:28,delay:.65,duration:.5,damage:18,color:'#b4df9a',label:'SERPENT STRIKE'});}
    else for(let i=0;i<4;i++)hazard(g,{shape:'circle',x:p.x+Math.cos(i*1.57)*65,y:p.y+Math.sin(i*1.57)*65,r:48,delay:1.05,duration:3.2,damage:12,color:'#adce85',label:'VENOM'});
  }else if(e.behavior==='sukuna'){
    if(e.skill%2){fan(g,e,a,e.enraged?7:5,.2,250,'slash');e.windup=.4;}
    else for(let i=0;i<(e.enraged?5:3);i++){const angle=a+(i-1)*.8;hazard(g,{shape:'line',x:p.x-Math.cos(angle)*350,y:p.y-Math.sin(angle)*350,tx:p.x+Math.cos(angle)*350,ty:p.y+Math.sin(angle)*350,width:13,delay:1.1+i*.12,duration:.3,damage:21,color:'#ff9aab',label:'MALEVOLENT SHRINE'});}
  }else if(e.behavior==='walpurgis'){
    if(e.skill%3===1)ring(g,e,e.enraged?22:16,g.time,125,'gear');
    else if(e.skill%3===2){for(let i=0;i<6;i++)hazard(g,{shape:'circle',x:p.x+Math.cos(i*1.05)*125,y:p.y+Math.sin(i*1.05)*125,r:49,delay:.9+i*.13,duration:.7,damage:20,color:'#f0a7d8',label:'CURTAIN FALL'});}
    else summon(g,e,'familiar',e.enraged?8:5);
  }else if(e.behavior==='shooter')fan(g,e,a,2,.17,175,'ki');
  else if(e.behavior==='radial')ring(g,e,7,g.time,110,'curse');
  else if(e.behavior==='familiar')fan(g,e,a,3,.25,145,'note');
  else if(e.behavior==='rose')fan(g,e,a,5,.32,140,'thorn');
  else if(e.behavior==='butterfly')ring(g,e,4,e.phase,120,'petal');
  else if(e.behavior==='serpent')hazard(g,{shape:'circle',x:e.x,y:e.y,r:24,delay:.5,duration:2,damage:7,color:'#a6c481',label:'VENOM'});
  else if(['dash','leap','crawler'].includes(e.behavior)){
    e.windup=.45;e.dash=.95;e.dashX=Math.cos(a);e.dashY=Math.sin(a);
    if(e.behavior==='dash')fan(g,e,a,3,.22,220,'kunai');
    hazard(g,{shape:'circle',x:e.x,y:e.y,r:24,delay:.45,duration:.12,damage:0,color:e.color,label:'RUSH'});
  }
}
