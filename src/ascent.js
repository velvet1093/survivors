import {ITEMS,FUSIONS,MAPS,getChoices,getUpgradePool,applyChoice,refreshStats,forbiddenItem,inactiveFormWeapon} from './game.js';
import {BOSSES,pickBoss} from './enemies.js';
import {RIFT_ENCOUNTERS} from './rift-encounters.js';
import {TRINKETS,isEventTrigger,newTrinkets} from './trinkets.js';
import {createWorld} from './world.js';

// Ascent: a roguelike climb through three acts. There is no levelling; every power
// comes from clearing zones on a branching map, buying from merchants and striking
// bargains at shrines and events. XP shards become gold.
export const ASCENT_ACTS=3;
export const ASCENT_FLOORS=14;
const COLS=7;
export const NODE_TYPES={
 battle:{name:'Skirmish',glyph:'⚔',color:'#c9cbe0',combat:true,description:'Defeat the enemy wave to clear the zone. Choose an upgrade.'},
 elite:{name:'Elite Den',glyph:'☠',color:'#f08a6a',combat:true,description:'A wave led by elite champions. Two upgrades and more gold.'},
 gauntlet:{name:'Gauntlet',glyph:'⌛',color:'#f2c75a',combat:true,description:'Survive a relentless timed onslaught. Big gold bonus and an upgrade.'},
 rift:{name:'Rift Breach',glyph:'◎',color:'#b48cff',combat:true,description:'A rift calamity spills into the climb. Defeat it for a max-level relic.'},
 boss:{name:'Act Guardian',glyph:'♛',color:'#ff6a7a',combat:true,description:'The guardian of this act. Defeat it to climb higher.'},
 shop:{name:'Merchant',glyph:'$',color:'#7fd6a0',description:'Spend gold on upgrades, trinkets and healing.'},
 rest:{name:'Campfire',glyph:'♨',color:'#f2a45a',description:'Rest to heal, or train to improve one of your items.'},
 treasure:{name:'Treasure Vault',glyph:'◆',color:'#ffd66a',description:'Claim one of three items at max level, plus gold.'},
 mystery:{name:'Unknown',glyph:'?',color:'#9fb4ff',description:'Something waits here. A choice, a fight or a stroke of luck.'},
 forge:{name:'Soul Forge',glyph:'⚒',color:'#ff9a6a',description:'Empower an item by two levels, or reforge gold into a new upgrade.'},
 shrine:{name:'Shrine of Pacts',glyph:'✧',color:'#e6a6ff',description:'Swear one pact: a lasting blessing bound to a lasting curse.'},
 altar:{name:'Cursed Altar',glyph:'✟',color:'#c25a7a',description:'Offer health or gold to the altar for rare power.'},
};
export const COMBAT_TYPES=Object.keys(NODE_TYPES).filter(t=>NODE_TYPES[t].combat);

// ---- Seeded randomness ----
function rng(seed){let a=seed>>>0;return ()=>{a=a+0x6D2B79F5>>>0;let t=a;t=Math.imul(t^t>>>15,t|1);t^=t+Math.imul(t^t>>>7,t|61);return ((t^t>>>14)>>>0)/4294967296;};}
const pick=(rand,list)=>list[Math.floor(rand()*list.length)];
function weighted(rand,entries){const total=entries.reduce((s,[,w])=>s+w,0);let roll=rand()*total;for(const [v,w]of entries){if((roll-=w)<0)return v;}return entries[entries.length-1][0];}

// ---- Map generation ----
// Six paths climb from the bottom row, each step moving one column at most and never
// crossing an existing edge. Floor 0 is always a fight, the middle floor a vault and
// the last floor before the guardian a campfire.
export function generateAct(act,seed){
 const rand=rng(seed*31+act*977),nodes=new Map(),key=(f,c)=>f+'-'+c;
 const node=(f,c)=>{const id=key(f,c);if(!nodes.has(id))nodes.set(id,{id,floor:f,col:c,type:null,next:[]});return nodes.get(id);};
 const edges=[];const crosses=(f,a,b)=>edges.some(([ef,ea,eb])=>ef===f&&(ea-a)*(eb-b)<0);
 const starts=[];while(starts.length<2){const c=Math.floor(rand()*COLS);if(!starts.includes(c))starts.push(c);}
 for(let p=0;p<6;p++){
  let c=p<2?starts[p]:Math.floor(rand()*COLS),cur=node(0,c);
  for(let f=1;f<ASCENT_FLOORS;f++){
   let nc=Math.max(0,Math.min(COLS-1,c+Math.floor(rand()*3)-1));if(crosses(f-1,c,nc))nc=c;
   const nxt=node(f,nc);if(!cur.next.includes(nxt.id)){cur.next.push(nxt.id);edges.push([f-1,c,nc]);}cur=nxt;c=nc;
  }
 }
 const boss={id:'boss',floor:ASCENT_FLOORS,col:3,type:'boss',next:[]};
 for(const n of nodes.values())if(n.floor===ASCENT_FLOORS-1)n.next=['boss'];
 const parents=id=>[...nodes.values()].filter(n=>n.next.includes(id));
 const weights=f=>[['battle',44],['mystery',19],['elite',f>=4?12:0],['shop',f>=2?9:0],['rest',f>=5?8:0],['gauntlet',f>=3?6:0],['forge',f>=4?4:0],['shrine',f>=3?4:0],['altar',f>=5?3:0],['rift',act>=2&&f>=6?3:0]];
 const unique=new Set(['elite','shop','rest','forge','shrine','altar','rift','gauntlet']);
 for(const n of [...nodes.values()].sort((a,b)=>a.floor-b.floor)){
  if(n.floor===0){n.type='battle';continue;}
  if(n.floor===7){n.type='treasure';continue;}
  if(n.floor===ASCENT_FLOORS-1){n.type='rest';continue;}
  let type;for(let i=0;i<6;i++){type=weighted(rand,weights(n.floor));if(!unique.has(type)||!parents(n.id).some(p=>p.type===type))break;type='battle';}
  n.type=type;
 }
 // Every act offers at least one merchant and one elite somewhere on the map.
 for(const need of ['shop','elite']){if(![...nodes.values()].some(n=>n.type===need)){const spot=pick(rand,[...nodes.values()].filter(n=>n.floor>=4&&n.floor<=11&&['battle','mystery'].includes(n.type)));if(spot)spot.type=need;}}
 return [...nodes.values(),boss];
}

// ---- Setup ----
export function newAscent(g,seed=Math.floor(Math.random()*1e9)){
 const rand=rng(seed),others=MAPS.filter(m=>m.id!==g.map.id).map(m=>m.id),maps=[g.map.id];
 while(maps.length<ASCENT_ACTS&&others.length)maps.push(others.splice(Math.floor(rand()*others.length),1)[0]);
 return {version:1,seed,act:1,maps,nodes:generateAct(1,seed),nodeId:null,visited:[],gold:99,screen:'map',zone:null,rewards:null,shop:null,event:null,pacts:[],seenBosses:[],seenRifts:[],stats:{zones:0,elites:0,bosses:0,goldEarned:0,floors:0},pressureTime:0};
}
export function initializeAscent(g,seed){
 g.mode='ascent';g.ascent=newAscent(g,seed);g.spawn=g.eliteAt=Infinity;g.status='ascent';g.p.ascentMods={};refreshStats(g.p);
 return g;
}
export const ascentNode=(g,id=g.ascent?.nodeId)=>g.ascent?.nodes.find(n=>n.id===id)||null;
// Nodes the player may enter next: any floor-0 node at the start, else the current node's children.
export function reachableNodes(g){
 const a=g.ascent;if(!a)return [];
 if(!a.nodeId)return a.nodes.filter(n=>n.floor===0);
 const here=ascentNode(g);return here?here.next.map(id=>ascentNode(g,id)).filter(Boolean):[];
}
const actScale=g=>1+.15*(g.ascent.act-1);
const goldMult=g=>g.p.ascentMods?.gold||1;
export function addGold(g,amount){const value=Math.max(0,Math.round(amount*goldMult(g)));g.ascent.gold+=value;g.ascent.stats.goldEarned+=value;return value;}
// Enemy strength follows the climb rather than the clock: about a third of a survival
// minute per floor, with each act starting further up the curve.
function zonePressure(g,node){
 const a=g.ascent,extra={elite:.6,gauntlet:.4,rift:.5,boss:.8}[node.type]||0;
 const minute=(a.act-1)*3.2+node.floor*.33+extra+(g.p.ascentMods?.pressure||0);
 a.pressureTime=minute*60;g.wave=node.type==='boss'||node.type==='rift'?a.act*5:1+Math.floor(minute*2);
}

// ---- Entering nodes ----
export function enterNode(g,id,random=Math.random){
 const a=g.ascent;if(!a||g.status!=='ascent'||a.screen!=='map')return false;
 const node=reachableNodes(g).find(n=>n.id===id);if(!node)return false;
 a.nodeId=node.id;a.visited.push(node.id);a.stats.floors=Math.max(a.stats.floors,node.floor+1);zonePressure(g,node);
 if(NODE_TYPES[node.type].combat){startZone(g,node.type,random);return true;}
 if(node.type==='shop'){a.shop=shopStock(g,random);a.screen='shop';}
 else if(node.type==='rest')a.screen='rest';
 else if(node.type==='treasure'){a.rewards={gold:addGold(g,(40+Math.floor(random()*30))*actScale(g)),picks:[maxPicks(g,random)],index:0,title:'Treasure Vault'};a.screen='reward';}
 else if(node.type==='mystery'){a.event=rollEvent(g,random);a.screen='event';}
 else if(node.type==='forge')a.screen='forge';
 else if(node.type==='shrine'){a.event={id:'shrine',pacts:pactOffer(g,random)};a.screen='shrine';}
 else if(node.type==='altar')a.screen='altar';
 return true;
}
function clearField(g){g.enemies=[];g.enemyShots=[];g.hazards=[];g.chests=[];g.bossIntro=null;g.bossDeaths=[];}
export function startZone(g,type,random=Math.random){
 const a=g.ascent,act=a.act,node=ascentNode(g);clearField(g);g.p.x=0;g.p.y=0;g.invuln=Math.max(g.invuln||0,1.2);
 // Every room is fought on a randomly chosen map, so its enemies and bosses vary too.
 const maps=MAPS.filter(m=>m.id!==g.map.id);if(maps.length){g.map=pick(random,maps);g.world=createWorld();}a.roomMap=g.map.id;
 const z={type,age:0,startKills:g.kills,spawnTimer:.6,spawned:0,cap:22,interval:1.05,batch:3,target:0,duration:0,eliteAt:[],eliteIds:[],bossId:null,bossEntity:null,bossSpawned:false,done:false};
 if(type==='battle'){z.target=20+act*6+Math.floor((node?.floor||0)*.8);z.interval=.8;z.batch=4;}
 else if(type==='elite'){z.target=18+act*5;z.eliteAt=act>=2?[1.5,12,24]:[1.5,14];z.cap=18;}
 else if(type==='gauntlet'){z.duration=35+act*5;z.cap=38;z.interval=.55;z.batch=4;}
 else if(type==='boss'){z.bossId=pickBoss(g.map.id,{exclude:a.seenBosses});a.seenBosses.push(z.bossId);z.cap=10;z.interval=2.4;z.batch=2;}
 else if(type==='rift'){const left=RIFT_ENCOUNTERS.filter(r=>!a.seenRifts.includes(r.id));z.bossId=(left.length?pick(random,left):pick(random,RIFT_ENCOUNTERS)).id;a.seenRifts.push(z.bossId);z.cap=8;z.interval=3;z.batch=2;}
 a.zone=z;a.screen=null;g.status='playing';
 g.toast=NODE_TYPES[type].name.toUpperCase()+' · '+objectiveText(g);g.toastTime=3.2;
 return z;
}
export const LOOT_SECONDS=10;
export function objectiveText(g){
 const z=g.ascent?.zone;if(!z)return '';
 if(z.looting)return `ROOM CLEARED · LOOT ${Math.max(0,Math.ceil(z.lootLeft))}s`;
 const kills=g.kills-z.startKills;
 if(z.type==='battle')return `DEFEAT ${Math.min(kills,z.target)} / ${z.target}`;
 if(z.type==='elite')return `DEFEAT ${Math.min(kills,z.target)} / ${z.target} · ELITES ${z.eliteIds.length-aliveElites(g).length} / ${z.eliteAt.length}`;
 if(z.type==='gauntlet')return `SURVIVE ${Math.max(0,Math.ceil(z.duration-z.age))}s`;
 return z.bossSpawned?'DEFEAT THE '+(z.type==='rift'?'CALAMITY':'GUARDIAN'):'IT APPROACHES…';
}
const aliveElites=g=>{const z=g.ascent.zone;return g.enemies.filter(e=>z.eliteIds.includes(e.id)&&e.hp>0);};

// ---- Zone loop (called by the engine in place of natural waves) ----
export function updateAscent(g,dt,{spawn,queueIntro}={}){
 const a=g.ascent;if(!a)return false;
 // A trinket prompt resolved from a menu screen returns to that screen, not to combat.
 if(a.screen&&g.status==='playing'){g.status='ascent';return true;}
 const z=a.zone;if(!z||z.done)return false;
 // After a clear the room stays open for a short loot window before the rewards.
 if(z.looting){
  z.lootLeft-=dt;if(z.lootLeft>0&&!z.skipLoot)return false;
  if((g.chests||[]).length){for(const c of g.chests){c.x=g.p.x;c.y=g.p.y;}return false;}
  finishZone(g);return true;
 }
 z.age+=dt;const kills=g.kills-z.startKills,alive=g.enemies.filter(e=>e.hp>0&&!e.boss).length;
 const wantMore=z.type==='battle'||z.type==='elite'?kills+alive<z.target:true;
 z.spawnTimer-=dt;
 if(z.spawnTimer<=0&&alive<z.cap&&wantMore){for(let i=0;i<z.batch;i++){if(spawn(g))z.spawned++;}z.spawnTimer=z.interval;}
 z.eliteAt.forEach((t,i)=>{if(z.age>=t&&z.eliteIds.length===i){const e=spawn(g,false,true);if(e)z.eliteIds.push(e.id);}});
 if(z.bossId&&!z.bossSpawned&&z.age>=1.5){
  const e=spawn(g,true,false,z.bossId);
  if(e){z.bossSpawned=true;z.bossEntity=e.id;if(z.type==='rift'){e.maxHp*=.45;e.hp=e.maxHp;e.ascentRift=true;}queueIntro?.(g,e,g.wave);}
 }
 if(z.type==='rift'){const e=g.enemies.find(e=>e.id===z.bossEntity);if(e&&!e.enraged&&e.hp>0&&e.hp<=e.maxHp*.5){e.enraged=true;e.riftTrialDone=true;e.riftTrialStarted=true;if(e.riftShiftName){e.name=e.riftShiftName;e.r=e.riftShiftRadius||e.r;}g.toast=e.name.toUpperCase()+' · SECOND PHASE';g.toastTime=2.5;}}
 let complete=false;
 if(z.type==='battle')complete=kills>=z.target;
 else if(z.type==='elite')complete=kills>=z.target&&z.eliteIds.length===z.eliteAt.length&&!aliveElites(g).length;
 else if(z.type==='gauntlet')complete=z.age>=z.duration;
 else complete=z.bossSpawned&&!g.enemies.some(e=>e.id===z.bossEntity&&(e.hp>0||!e.deathComplete&&e.deathQueued))&&!(g.bossDeaths||[]).length;
 if(complete){
  // Remaining enemies and attacks vanish; gems and chests stay for the loot window.
  g.enemies=[];g.enemyShots=[];g.hazards=[];g.bossIntro=null;z.looting=true;z.lootLeft=LOOT_SECONDS;
  g.toast='ROOM CLEARED · '+LOOT_SECONDS+' SECONDS TO GRAB THE LOOT';g.toastTime=3;
  return false;
 }
 return false;
}
export function finishZone(g,random=Math.random){
 const a=g.ascent,z=a.zone;z.done=true;
 for(const gem of g.gems||[])gemGold(g,gem.value);g.gems=[];
 clearField(g);a.stats.zones++;
 const act=a.act,s=actScale(g),r=()=>Math.floor(random()*10);
 const plan={battle:[18+act*6+r(),[getChoices(g.p,random)]],elite:[36+act*10+r(),[getChoices(g.p,random),getChoices(g.p,random)]],gauntlet:[48+act*12+r(),[getChoices(g.p,random)]],rift:[110+act*20,[maxPicks(g,random),getChoices(g.p,random)]],boss:[90+act*30,[maxPicks(g,random),getChoices(g.p,random)]]}[z.type];
 if(z.type==='elite')a.stats.elites++;if(z.type==='boss')a.stats.bosses++;
 a.rewards={gold:addGold(g,plan[0]*s*(z.goldBonus||1)),picks:plan[1],index:0,title:NODE_TYPES[z.type].name+' cleared',bossClear:z.type==='boss'};
 a.zone=null;a.screen='reward';g.status='ascent';g.checkpointRequested=true;
}
export function skipLoot(g){const z=g.ascent?.zone;if(!z?.looting)return false;z.skipLoot=true;return true;}
export function gemGold(g,value){return addGold(g,Math.max(1,Math.round((value||1)*.5)));}
function maxPicks(g,random){return getChoices(g.p,random).map(c=>c.kind==='item'?{...c,maxLevel:true}:c);}

// ---- Rewards ----
export function claimReward(g,index){
 const a=g.ascent,rw=a?.rewards;if(a?.screen!=='reward'||!rw)return false;
 const choices=rw.picks[rw.index],choice=choices?.[index];if(!choice||!applyChoice(g.p,choice))return false;
 return nextReward(g);
}
export function skipReward(g){const a=g.ascent;if(a?.screen!=='reward'||!a.rewards)return false;addGold(g,8);return nextReward(g);}
function nextReward(g){
 const a=g.ascent,rw=a.rewards;rw.index++;
 // Choices are re-rolled after each claim so a new fusion or slot change is reflected.
 if(rw.index<rw.picks.length){rw.picks[rw.index]=getChoices(g.p);return true;}
 a.rewards=null;
 if(rw.bossClear)return clearAct(g);
 a.screen='map';return true;
}
export function clearAct(g){
 const a=g.ascent;
 if(a.act>=ASCENT_ACTS){a.screen='victory';g.won=true;g.status='over';return true;}
 a.act++;a.nodes=generateAct(a.act,a.seed);a.nodeId=null;a.visited=[];
 const map=MAPS.find(m=>m.id===a.maps[a.act-1])||g.map;g.map=map;g.world=createWorld();g.p.x=0;g.p.y=0;
 g.p.hp=Math.min(g.p.maxHp,g.p.hp+g.p.maxHp*.35);a.screen='actclear';return true;
}
export function continueAct(g){const a=g.ascent;if(a?.screen!=='actclear')return false;a.screen='map';return true;}

// ---- Merchant ----
const priceOf=(g,c)=>{const s=actScale(g);if(c.kind==='fusion'||c.kind==='bond')return Math.round(150*s);const item=ITEMS[c.id];if(c.level===1)return Math.round((item.type==='weapon'?80:65)*s);return Math.round((40+c.level*12)*s);};
export function shopStock(g,random=Math.random){
 const pool=getUpgradePool(g.p).filter(c=>c.kind!=='heal'),fusions=pool.filter(c=>c.kind==='fusion'||c.kind==='bond'),items=pool.filter(c=>c.kind==='item');
 for(let i=items.length-1;i>0;i--){const j=Math.floor(random()*(i+1));[items[i],items[j]]=[items[j],items[i]];}
 const offers=[...fusions.slice(0,1),...items].slice(0,5).map(c=>({choice:c,price:priceOf(g,c),sold:false}));
 const trinkets=TRINKETS.filter(t=>!isEventTrigger(t.id)&&t.id!=='dragonmarble');
 const trinket=trinkets.length?{id:trinkets[Math.floor(random()*trinkets.length)].id,price:Math.round(85*actScale(g)),sold:false}:null;
 return {offers,trinket,heal:{price:Math.round(45*actScale(g)),sold:false},reroll:Math.round(20*actScale(g)),rerolls:0};
}
export function buyOffer(g,index){
 const a=g.ascent,o=a?.shop?.offers[index];if(a?.screen!=='shop'||!o||o.sold||a.gold<o.price)return false;
 if(!applyChoice(g.p,o.choice))return false;a.gold-=o.price;o.sold=true;
 // Stock that no longer fits the loadout (slots full, item maxed) is withdrawn.
 const legal=new Set(getUpgradePool(g.p).map(c=>c.kind+':'+c.id));for(const other of a.shop.offers)if(!other.sold&&!legal.has(other.choice.kind+':'+other.choice.id))other.sold=true;
 return true;
}
export function buyHeal(g){const a=g.ascent,h=a?.shop?.heal;if(a?.screen!=='shop'||!h||h.sold||a.gold<h.price||g.p.hp>=g.p.maxHp)return false;a.gold-=h.price;h.sold=true;g.p.hp=Math.min(g.p.maxHp,g.p.hp+g.p.maxHp*.4);return true;}
export function buyTrinket(g){
 const a=g.ascent,t=a?.shop?.trinket;if(a?.screen!=='shop'||!t||t.sold||a.gold<t.price)return false;
 const state=g.trinkets??=newTrinkets();if(state.pending)return false;
 a.gold-=t.price;t.sold=true;state.pending={uid:'trinket:'+ ++state.serial,itemId:t.id,x:g.p.x,y:g.p.y,age:1};g.status='trinket';return true;
}
export function rerollShop(g,random=Math.random){const a=g.ascent;if(a?.screen!=='shop'||a.gold<a.shop.reroll)return false;a.gold-=a.shop.reroll;const next=shopStock(g,random);next.reroll=a.shop.reroll+10;next.rerolls=a.shop.rerolls+1;next.heal=a.shop.heal;next.trinket=a.shop.trinket;a.shop=next;return true;}
export function leaveScreen(g){const a=g.ascent;if(!a||!['shop','rest','forge','shrine','altar','event'].includes(a.screen))return false;a.shop=null;a.event=null;a.screen='map';return true;}

// ---- Campfire and forge ----
export const ownedItems=p=>[...Object.entries(p.weapons),...Object.entries(p.passives)].filter(([id])=>ITEMS[id]&&!ITEMS[id].fusionOnly&&!p.fusions[id]&&!forbiddenItem(p,id)&&!inactiveFormWeapon(p,id)).map(([id,level])=>({id,level,max:ITEMS[id].max}));
function raise(g,id,steps){const p=g.p,item=ITEMS[id];if(!item)return false;const inv=item.type==='weapon'?p.weapons:p.passives;if(!inv[id]||inv[id]>=item.max||p.fusions[id])return false;let ok=false;for(let i=0;i<steps&&inv[id]<item.max;i++)ok=applyChoice(p,{kind:'item',id,level:inv[id]+1})||ok;return ok;}
export function restHeal(g){const a=g.ascent;if(a?.screen!=='rest')return false;g.p.hp=Math.min(g.p.maxHp,g.p.hp+g.p.maxHp*.4);a.screen='map';return true;}
export function restTrain(g,id){const a=g.ascent;if(a?.screen!=='rest'||!raise(g,id,1))return false;a.screen='map';return true;}
export function forgeEmpower(g,id){const a=g.ascent;if(a?.screen!=='forge'||!raise(g,id,2))return false;a.screen='map';return true;}
export const FORGE_REFORGE_PRICE=50;
export function forgeReforge(g,random=Math.random){const a=g.ascent;if(a?.screen!=='forge'||a.gold<FORGE_REFORGE_PRICE)return false;a.gold-=FORGE_REFORGE_PRICE;a.rewards={gold:0,picks:[getChoices(g.p,random)],index:0,title:'Reforged'};a.screen='reward';return true;}

// ---- Shrine pacts (blessing bound to a curse) ----
export const PACTS=[
 {id:'blood',name:'Blood Pact',blessing:'+25% damage',curse:'−15% max HP',mods:{damage:1.25,maxHp:.85}},
 {id:'iron',name:'Iron Vow',blessing:'+30% max HP',curse:'−10% move speed',mods:{maxHp:1.3,move:.9}},
 {id:'haste',name:'Oath of Haste',blessing:'−15% cooldowns',curse:'−10% damage',mods:{cooldown:.85,damage:.9}},
 {id:'wind',name:'Gale Covenant',blessing:'+18% move speed',curse:'−12% max HP',mods:{move:1.18,maxHp:.88}},
 {id:'greed',name:'Pact of Greed',blessing:'+50% gold from every source',curse:'Enemies grow stronger (as if a floor higher)',mods:{gold:1.5,pressure:.5}},
 {id:'hunter',name:'Hunter’s Mark',blessing:'+20% damage and +20% pickup range',curse:'Enemies grow stronger (as if a floor higher)',mods:{damage:1.2,magnet:1.2,pressure:.5}},
 {id:'siphon',name:'Siphon Bond',blessing:'+1.5 HP regeneration per second',curse:'−8% damage',mods:{regen:1.5,damage:.92}},
];
function pactOffer(g,random){const left=PACTS.filter(p=>!g.ascent.pacts.includes(p.id));for(let i=left.length-1;i>0;i--){const j=Math.floor(random()*(i+1));[left[i],left[j]]=[left[j],left[i]];}return left.slice(0,3).map(p=>p.id);}
// Pact modifiers multiply (or for regen and pressure, add) and are read by refreshStats.
export function applyPact(p,mods){
 const m=p.ascentMods??={};
 for(const [k,v]of Object.entries(mods)){if(k==='regen'||k==='pressure')m[k]=(m[k]||0)+v;else m[k]=(m[k]||1)*v;}
 const oldMax=p.maxHp;refreshStats(p);if(p.maxHp>oldMax)p.hp+=p.maxHp-oldMax;p.hp=Math.min(p.hp,p.maxHp);
}
export function swearPact(g,id){const a=g.ascent,pact=PACTS.find(p=>p.id===id);if(a?.screen!=='shrine'||!pact||!a.event?.pacts?.includes(id))return false;applyPact(g.p,pact.mods);a.pacts.push(id);a.event=null;a.screen='map';return true;}

// ---- Cursed altar ----
export function altarOffer(g,kind,random=Math.random){
 const a=g.ascent;if(a?.screen!=='altar')return false;
 if(kind==='blood'){if(g.p.hp<=g.p.maxHp*.3)return false;g.p.hp-=g.p.maxHp*.25;a.rewards={gold:0,picks:[maxPicks(g,random)],index:0,title:'The altar accepts your blood'};a.screen='reward';return true;}
 if(kind==='gold'){if(a.gold<120)return false;a.gold-=120;a.rewards={gold:0,picks:[maxPicks(g,random),getChoices(g.p,random)],index:0,title:'The altar accepts your gold'};a.screen='reward';return true;}
 return false;
}

// ---- Mystery events ----
export const EVENTS=[
 {id:'merchant',title:'A wandering merchant',text:'A hooded trader offers one item at a steep discount, no questions asked.',options:[{id:'buy',label:'Buy a random upgrade',cost:45},{id:'leave',label:'Walk on'}]},
 {id:'ambush',title:'Ambush!',text:'The path narrows and shapes close in from every side. There is no way around.',options:[{id:'fight',label:'Fight · +30% gold'}]},
 {id:'spring',title:'A healing spring',text:'Clear water glows faintly in a ring of stones.',options:[{id:'sip',label:'Drink · heal 50% HP'},{id:'deep',label:'Bathe · full heal, −6% max HP for the run'}]},
 {id:'gamble',title:'The gambler’s den',text:'A grinning dealer slides a pair of dice across the table.',options:[{id:'bet',label:'Bet 40 gold · 50% chance to win 100'},{id:'leave',label:'Decline'}]},
 {id:'armory',title:'A forgotten armory',text:'Weapon racks still stand under the dust.',options:[{id:'take',label:'Take an upgrade · lose 12% HP'},{id:'leave',label:'Leave it be'}]},
 {id:'idol',title:'A cursed idol',text:'Gold spills from the idol’s mouth. Its eyes follow you.',options:[{id:'grab',label:'Take 120 gold · −10% max HP for the run'},{id:'leave',label:'Leave it'}]},
 {id:'champion',title:'A lone champion',text:'A warrior bars the way and offers a duel for a worthy prize.',options:[{id:'duel',label:'Accept · fight an elite den'},{id:'leave',label:'Bow and pass'}]},
 {id:'mentor',title:'An old mentor',text:'A retired fighter offers to drill you on your technique.',options:[{id:'train',label:'Train · +1 level to a random item'},{id:'gold',label:'Ask for coin · 35 gold'}]},
];
function rollEvent(g,random){return {id:pick(random,EVENTS).id};}
export const eventFor=g=>EVENTS.find(e=>e.id===g.ascent?.event?.id)||null;
export function resolveEvent(g,optionId,random=Math.random){
 const a=g.ascent,ev=eventFor(g);if(a?.screen!=='event'||!ev||!ev.options.some(o=>o.id===optionId))return false;
 const p=g.p,done=()=>{a.event=null;a.screen='map';return true;};
 switch(ev.id+':'+optionId){
  case'merchant:buy':{if(a.gold<45)return false;const c=getChoices(p,random).find(c=>c.kind!=='heal');if(!c||!applyChoice(p,c))return false;a.gold-=45;return done();}
  case'ambush:fight':{a.event=null;startZone(g,'battle',random);a.zone.goldBonus=1.3;return true;}
  case'spring:sip':p.hp=Math.min(p.maxHp,p.hp+p.maxHp*.5);return done();
  case'spring:deep':applyPact(p,{maxHp:.94});p.hp=p.maxHp;return done();
  case'gamble:bet':if(a.gold<40)return false;a.gold-=40;if(random()<.5)addGold(g,100);return done();
  case'armory:take':{if(p.hp<=p.maxHp*.12)return false;p.hp-=p.maxHp*.12;a.rewards={gold:0,picks:[getChoices(p,random)],index:0,title:'The armory’s gift'};a.event=null;a.screen='reward';return true;}
  case'idol:grab':addGold(g,120/goldMult(g));applyPact(p,{maxHp:.9});return done();
  case'champion:duel':{a.event=null;startZone(g,'elite',random);return true;}
  case'mentor:train':{const own=ownedItems(p).filter(i=>i.level<i.max);if(own.length)raise(g,pick(random,own).id,1);return done();}
  case'mentor:gold':addGold(g,35);return done();
  default:return done();
 }
}

// ---- Save restore ----
export function restoreAscent(g){
 const a=g.ascent;if(!a||!Array.isArray(a.nodes)||!a.nodes.length){g.ascent=newAscent(g);g.status='ascent';return g;}
 a.gold=Math.max(0,Math.floor(Number(a.gold)||0));a.act=Math.max(1,Math.min(ASCENT_ACTS,Math.floor(a.act)||1));
 a.pacts=Array.isArray(a.pacts)?a.pacts.filter(id=>PACTS.some(p=>p.id===id)):[];a.seenBosses=Array.isArray(a.seenBosses)?a.seenBosses.filter(id=>BOSSES[id]):[];a.seenRifts=Array.isArray(a.seenRifts)?a.seenRifts:[];
 a.stats={zones:0,elites:0,bosses:0,goldEarned:0,floors:0,...(a.stats||{})};a.visited=Array.isArray(a.visited)?a.visited:[];
 if(a.zone&&!COMBAT_TYPES.includes(a.zone.type))a.zone=null;
 g.spawn=g.eliteAt=Infinity;g.p.ascentMods=g.p.ascentMods&&typeof g.p.ascentMods==='object'?g.p.ascentMods:{};refreshStats(g.p);
 return g;
}
export const ascentFusionCount=()=>FUSIONS.length;
