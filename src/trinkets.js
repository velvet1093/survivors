import {newWish,normalizeWish,summonShenron} from './shenron.js';
import {EVENT_TRIGGER_ITEMS,eventTriggerFor,isEventTrigger} from './event-trigger-items.js';
export {EVENT_TRIGGER_ITEMS,eventTriggerFor,isEventTrigger} from './event-trigger-items.js';
export {trinketIcon,trinketPixels,TRINKET_ART_IDS} from './trinket-art.js';

export const TRINKET_SLOTS=3;
export const TRINKET_MAX_REFINEMENT=3;
export const trinketMaxRefinement=id=>isEventTrigger(id)?0:id==='dragonmarble'?7:TRINKET_MAX_REFINEMENT;
export const trinketStarCount=rank=>Math.min(7,1+Math.max(0,Math.floor(Number.isFinite(rank)?rank:0)));
export function trinketName(id,rank=0){return id==='dragonmarble'?trinketStarCount(rank)+'-Star Dragon Ball':trinketFor(id)?.name||'';}
export const TRINKET_DROP_LIMIT=8;
export const TRINKET_DROP_CHANCE={normal:.015,elite:.12,boss:.35};
export const TRINKETS=[
 {id:'ramencharm',name:'Ichiraku Bowl Charm',series:'NARUTO',color:'#edb98d',description:'Food restores 10% more HP. A tiny bowl with a very large appetite.'},
 {id:'dragonmarble',name:'One-Star Dragon Ball',series:'DRAGON BALL',color:'#f2ba68',description:'Gain 5% more coins from enemies and coin pickups. Refine seven times to summon Shenron and choose one wish.'},
 {id:'leafkeychain',name:'Leaf Village Keychain',series:'NARUTO',color:'#9ed6b4',description:'Increase XP pickup range by 8%. Still does not help you find your keys.'},
 {id:'scoutscarf',name:'Scout’s Red Scarf',series:'ATTACK ON TITAN',color:'#d89d9d',description:'Move 3% faster. It is warm, familiar and suspiciously dramatic in the wind.'},
 {id:'dangobox',name:'Three-Color Dango Box',series:'CLANNAD',color:'#d8cfa1',description:'Restore 1 HP after every ten defeated enemies while equipped. Sharing is optional.'},
 {id:'beckoningbell',name:'Lucky Cat Bell',series:'SAILOR MOON',color:'#e2c989',description:'A harmless “MEW!” appears every twenty defeated enemies. It attracts attention, not enemies.'},
 {id:'soulribbon',name:'Hope Ribbon',series:'MADOKA MAGICA',color:'#edb2cd',description:'Food pickups release tiny pink hearts. Pure encouragement; no extra power.'},
 {id:'strawhatpin',name:'Straw Hat Pin',series:'ONE PIECE',color:'#e4c787',description:'Swift Boots last two seconds longer. Dreams deserve comfortable walking shoes.'},
 {id:'penguinplush',name:'Pen Pen Plush',series:'EVANGELION',color:'#a5cadd',description:'Leave a few little blue footprints while walking. Entirely unsuitable for stealth.'},
 {id:'capsulebadge',name:'Capsule Corp Button',series:'DRAGON BALL',color:'#b9d8dd',description:'Energy pickups remove one extra second of ultimate cooldown. Compact engineering.'},
 {id:'memorybookmark',name:'Witch’s Bookmark',series:'UMINEKO',color:'#c6abd9',description:'A reading thought appears every thirty active seconds. It refuses to reveal spoilers.'},
 {id:'fairytailstamp',name:'Fairy Tail Guild Stamp',series:'FAIRY TAIL',color:'#df9ea4',description:'Using an ultimate adds a little red guild sparkle. Friendship remains immeasurable.'},
 {id:'transmutationpin',name:'Flamel Lapel Pin',series:'FULLMETAL ALCHEMIST',color:'#e3c58a',description:'Gain 3% more coins from enemies and coin pickups. Equivalent exchange apparently includes pocket change.'},
 {id:'hunterlicense',name:'Pocket Hunter License',series:'HUNTER × HUNTER',color:'#a6c79b',description:'Increase XP pickup range by 6%. Licensed to pick things up from slightly farther away.'},
 {id:'nichirinbell',name:'Wisteria Wind Bell',series:'DEMON SLAYER',color:'#d1b3da',description:'Swift Boots last 1 second longer. Its tiny chime keeps the long road pleasant.'},
 {id:'spiritbadge',name:'Substitute Spirit Badge',series:'BLEACH',color:'#e3ac7c',description:'Energy pickups remove 0.5 extra seconds of ultimate cooldown. No substitute for a good nap.'},
 {id:'papercrane',name:'Red Thread Paper Crane',series:'YOUR NAME',color:'#e9b2ad',description:'Food pickups release 2 little folded cranes. A harmless wish for a pleasant afternoon.'},
 {id:'pochitacharm',name:'Pochita Pull-Cord Charm',series:'CHAINSAW MAN',color:'#e7ae73',description:'A harmless “VROOM!” appears every 12 defeated enemies. The little engine runs entirely on enthusiasm.'},
 {id:'moonbrooch',name:'Moonlight Compact',series:'SAILOR MOON',color:'#e5c687',description:'Using an ultimate releases 4 moonlit sparkles. A transformation sequence with no transformation required.'},
 {id:'bebopcassette',name:'Bebop Mixtape',series:'COWBOY BEBOP',color:'#b8b6df',description:'A musical thought with 2 notes appears every 24 active seconds. The bounty is small, but the soundtrack is excellent.'},
 ...EVENT_TRIGGER_ITEMS,
];
const byId=new Map(TRINKETS.map(item=>[item.id,item]));
export const trinketFor=id=>byId.get(id)||null;
const finite=n=>Number.isFinite(n);
const nonnegative=n=>finite(n)?Math.max(0,Math.floor(n)):0;
const has=(g,id)=>g.trinkets?.equipped?.includes(id);
const refinement=(rank,id)=>Math.min(trinketMaxRefinement(id),nonnegative(rank));
export const trinketRefinement=(g,id)=>has(g,id)?refinement(g.trinkets?.refinements?.[id],id):0;
export function trinketEffect(id,rank=0){
 rank=refinement(rank,id);const power=1+rank*.5;
 switch(id){
  case 'ramencharm':return {healing:.1*power};
  case 'dragonmarble':return {coins:.05*power};
  case 'leafkeychain':return {magnet:.08*power};
  case 'scoutscarf':return {move:.03*power};
  case 'dangobox':return {heal:power,kills:10};
  case 'beckoningbell':return {kills:20-rank*4,duration:1.5+rank*.15};
  case 'soulribbon':return {hearts:3+rank*2,duration:1.3+rank*.2};
  case 'strawhatpin':return {boots:2*power};
  case 'penguinplush':return {footprints:3+rank};
  case 'capsulebadge':return {energy:power};
  case 'memorybookmark':return {interval:30-rank*5,duration:1.5+rank*.15};
  case 'fairytailstamp':return {sparks:3+rank*2,duration:1.2+rank*.2};
  case 'transmutationpin':return {coins:.03*power};
  case 'hunterlicense':return {magnet:.06*power};
  case 'nichirinbell':return {boots:power};
  case 'spiritbadge':return {energy:.5*power};
  case 'papercrane':return {cranes:2+rank,duration:1.4+rank*.15};
  case 'pochitacharm':return {kills:12-rank*2,duration:1.5+rank*.15};
  case 'moonbrooch':return {sparks:4+rank*2,duration:1.5+rank*.15};
  case 'bebopcassette':return {interval:24-rank*4,notes:2+rank,duration:1.5+rank*.15};
  default:return {};
 }
}
export function trinketDescription(id,rank=0){
 const item=trinketFor(id);if(!item)return '';
 if(isEventTrigger(id))return item.description;
 const effect=trinketEffect(id,rank),number=n=>String(Math.round(n*100)/100);
 const descriptions={
  ramencharm:`Food restores ${number(effect.healing*100)}% more HP.`,
  dragonmarble:`Gain ${number(effect.coins*100)}% more coins from enemies and coin pickups.`,
  leafkeychain:`Increase XP pickup range by ${number(effect.magnet*100)}%.`,
  scoutscarf:`Move ${number(effect.move*100)}% faster.`,
  dangobox:`Restore ${number(effect.heal)} HP after every ${effect.kills} defeated enemies while equipped.`,
  beckoningbell:`A harmless “MEW!” appears every ${effect.kills} defeated enemies.`,
  soulribbon:`Food pickups release ${effect.hearts} tiny pink hearts.`,
  strawhatpin:`Swift Boots last ${number(effect.boots)} seconds longer.`,
  penguinplush:`Leave ${effect.footprints} little blue footprints while walking.`,
  capsulebadge:`Energy pickups remove ${number(effect.energy)} extra seconds of ultimate cooldown.`,
  memorybookmark:`A reading thought appears every ${effect.interval} active seconds.`,
  fairytailstamp:`Using an ultimate adds ${effect.sparks} little red guild sparkles.`,
  transmutationpin:`Gain ${number(effect.coins*100)}% more coins from enemies and coin pickups.`,
  hunterlicense:`Increase XP pickup range by ${number(effect.magnet*100)}%.`,
  nichirinbell:`Swift Boots last ${number(effect.boots)} seconds longer.`,
  spiritbadge:`Energy pickups remove ${number(effect.energy)} extra seconds of ultimate cooldown.`,
  papercrane:`Food pickups release ${effect.cranes} little folded cranes.`,
  pochitacharm:`A harmless “VROOM!” appears every ${effect.kills} defeated enemies.`,
  moonbrooch:`Using an ultimate releases ${effect.sparks} moonlit sparkles.`,
  bebopcassette:`A musical thought with ${effect.notes} notes appears every ${effect.interval} active seconds.`,
 };
 return descriptions[id]+' '+item.description.slice(item.description.indexOf('. ')+2);
}
export function newTrinkets(){return {wish:newWish(),equipped:Array(TRINKET_SLOTS).fill(null),refinements:{},drops:[],pending:null,serial:0,kills:0,firstBossDropped:false,reading:0,dangoKills:0,bellKills:0,pochitaKills:0,jazz:0,cosmetic:{bell:0,sparkle:0,bookmark:0,stamp:0,cranes:0,chainsaw:0,moon:0,music:0}};}
export function trinketBonus(g){
 const bonus=(id,key)=>has(g,id)?trinketEffect(id,trinketRefinement(g,id))[key]:0;
 return {move:1+bonus('scoutscarf','move'),magnet:1+bonus('leafkeychain','magnet')+bonus('hunterlicense','magnet'),healing:1+bonus('ramencharm','healing'),coins:1+bonus('dragonmarble','coins')+bonus('transmutationpin','coins'),energy:bonus('capsulebadge','energy')+bonus('spiritbadge','energy'),boots:bonus('strawhatpin','boots')+bonus('nichirinbell','boots')};
}
function ping(g,text,color){if(g.numbers?.length<75)g.numbers.push({x:g.p.x,y:g.p.y-44,amount:text,life:1.2,color});}
function available(g){const state=g.trinkets||newTrinkets(),seen=new Set([...state.drops.map(drop=>drop.itemId),state.pending?.itemId]);return TRINKETS.filter(item=>!(g.mode==='bossrush'&&isEventTrigger(item.id))&&!seen.has(item.id)&&(!has(g,item.id)||trinketRefinement(g,item.id)<trinketMaxRefinement(item.id)));}
export function dropTrinket(g,itemId,x,y){
 const state=g.trinkets??=newTrinkets();
 if(!trinketFor(itemId)||!finite(x)||!finite(y)||state.drops.length>=TRINKET_DROP_LIMIT||!available(g).some(item=>item.id===itemId))return null;
 const drop={uid:'trinket:'+ ++state.serial,itemId,x,y,age:0};state.drops.push(drop);return drop;
}
export function rollEnemyTrinket(g,enemy,random=Math.random){
 if(enemy.trinketLooted)return null;enemy.trinketLooted=true;
 const state=g.trinkets??=newTrinkets(),firstBoss=enemy.boss&&!state.firstBossDropped,chance=enemy.boss?TRINKET_DROP_CHANCE.boss:enemy.elite?TRINKET_DROP_CHANCE.elite:TRINKET_DROP_CHANCE.normal;
 if(!firstBoss&&random()>=chance)return null;
 const candidates=available(g);if(!candidates.length)return null;
 const total=candidates.reduce((sum,item)=>sum+(item.dropWeight??1),0);let roll=Math.max(0,Math.min(1,random()))*total,item=candidates.at(-1);
 for(const candidate of candidates){roll-=candidate.dropWeight??1;if(roll<0){item=candidate;break;}}
 const drop=dropTrinket(g,item.id,g.mode==='bossrush'?g.p.x:enemy.x,g.mode==='bossrush'?g.p.y:enemy.y);
 if(drop&&enemy.boss)state.firstBossDropped=true;
 return drop;
}
export function trinketEnemyDefeated(g){
 const state=g.trinkets??=newTrinkets();state.kills++;
 if(has(g,'dangobox')){const effect=trinketEffect('dangobox',trinketRefinement(g,'dangobox'));state.dangoKills=(state.dangoKills||0)+1;if(state.dangoKills>=effect.kills){state.dangoKills=0;g.p.hp=Math.min(g.p.maxHp,g.p.hp+effect.heal);ping(g,'DANGO +'+effect.heal,'#e8ccad');}}
 if(has(g,'pochitacharm')){const effect=trinketEffect('pochitacharm',trinketRefinement(g,'pochitacharm'));state.pochitaKills=(state.pochitaKills||0)+1;if(state.pochitaKills>=effect.kills){state.pochitaKills=0;state.cosmetic.chainsaw=effect.duration;ping(g,'VROOM!','#edb079');}}
 if(has(g,'beckoningbell')){const effect=trinketEffect('beckoningbell',trinketRefinement(g,'beckoningbell'));state.bellKills=(state.bellKills||0)+1;if(state.bellKills>=effect.kills){state.bellKills=0;state.cosmetic.bell=effect.duration;ping(g,'MEW!','#efd9a0');}}
}
export function trinketFoodCollected(g){if(has(g,'soulribbon'))g.trinkets.cosmetic.sparkle=trinketEffect('soulribbon',trinketRefinement(g,'soulribbon')).duration;if(has(g,'papercrane'))g.trinkets.cosmetic.cranes=trinketEffect('papercrane',trinketRefinement(g,'papercrane')).duration;}
export function trinketUltimateUsed(g){if(has(g,'fairytailstamp'))g.trinkets.cosmetic.stamp=trinketEffect('fairytailstamp',trinketRefinement(g,'fairytailstamp')).duration;if(has(g,'moonbrooch'))g.trinkets.cosmetic.moon=trinketEffect('moonbrooch',trinketRefinement(g,'moonbrooch')).duration;}
// Only active simulation advances drop age, thoughts or cosmetic timing.
export function updateTrinkets(g,dt){
 if(g.status!=='playing'||g.bossIntro)return;
 const state=g.trinkets??=newTrinkets();for(const key of Object.keys(state.cosmetic))state.cosmetic[key]=Math.max(0,state.cosmetic[key]-dt);
 for(const drop of state.drops)drop.age+=dt;
 if(has(g,'bebopcassette')){const effect=trinketEffect('bebopcassette',trinketRefinement(g,'bebopcassette'));state.jazz=(state.jazz||0)+dt;if(state.jazz>=effect.interval){state.jazz%=effect.interval;state.cosmetic.music=effect.duration;}}
 if(has(g,'memorybookmark')){const effect=trinketEffect('memorybookmark',trinketRefinement(g,'memorybookmark'));state.reading+=dt;if(state.reading>=effect.interval){state.reading%=effect.interval;state.cosmetic.bookmark=effect.duration;ping(g,'ONE MORE CHAPTER…','#d5bee7');}}
}
export function collectNearbyTrinket(g){
 if(g.status!=='playing'||g.bossIntro||!g.p.moving)return false;
 const state=g.trinkets??=newTrinkets();if(state.pending)return false;
 const index=state.drops.findIndex(drop=>drop.age>=.4&&Math.hypot(drop.x-g.p.x,drop.y-g.p.y)<26);
 if(index<0)return false;state.pending=state.drops.splice(index,1)[0];g.status='trinket';g.p.moving=false;return true;
}
function resetCounter(state,id){if(id==='dangobox')state.dangoKills=0;if(id==='beckoningbell')state.bellKills=0;if(id==='memorybookmark')state.reading=0;if(id==='pochitacharm')state.pochitaKills=0;if(id==='bebopcassette')state.jazz=0;}
function canChoose(g){return g.status==='trinket'&&!g.bossIntro&&!!trinketFor(g.trinkets?.pending?.itemId);}
export function chooseTrinket(g,slot){
 if(!canChoose(g)||!Number.isInteger(slot)||slot<0||slot>=TRINKET_SLOTS)return false;
 const state=g.trinkets,id=state.pending.itemId;if(state.equipped.includes(id))return false;
 const previous=state.equipped[slot];state.equipped[slot]=id;state.refinements??={};delete state.refinements[previous];state.refinements[id]=0;state.pending=null;resetCounter(state,previous);resetCounter(state,id);g.status='playing';g.invuln=Math.max(g.invuln||0,.5);g.toast='TRINKET EQUIPPED · '+trinketFor(id).name.toUpperCase();g.toastTime=2.5;return true;
}
export function refineTrinket(g){
 if(!canChoose(g))return false;
 const state=g.trinkets,id=state.pending.itemId,rank=trinketRefinement(g,id);
 if(!has(g,id)||rank>=trinketMaxRefinement(id))return false;
 state.refinements??={};state.refinements[id]=rank+1;state.pending=null;
 if(id==='beckoningbell')state.bellKills=Math.min(state.bellKills,trinketEffect(id,rank+1).kills-1);
 if(id==='memorybookmark')state.reading=Math.min(state.reading,trinketEffect(id,rank+1).interval);
 if(id==='pochitacharm')state.pochitaKills=Math.min(state.pochitaKills||0,trinketEffect(id,rank+1).kills-1);
 if(id==='bebopcassette')state.jazz=Math.min(state.jazz||0,trinketEffect(id,rank+1).interval);
 g.status='playing';g.invuln=Math.max(g.invuln||0,.5);g.toast='TRINKET REFINED +'+(rank+1)+' · '+trinketName(id,rank+1).toUpperCase();g.toastTime=2.5;if(id==='dragonmarble'&&rank+1===7)summonShenron(g);return true;
}
export function ignoreTrinket(g){if(!canChoose(g))return false;g.trinkets.pending=null;g.status='playing';g.invuln=Math.max(g.invuln||0,.5);return true;}
export function unequipTrinket(g,slot){
 if(!['playing','paused'].includes(g.status)||g.bossIntro||!Number.isInteger(slot)||slot<0||slot>=TRINKET_SLOTS||!g.trinkets?.equipped?.[slot])return false;
 const id=g.trinkets.equipped[slot];g.trinkets.equipped[slot]=null;if(g.trinkets.refinements)delete g.trinkets.refinements[id];resetCounter(g.trinkets,id);return true;
}
export function canUseEventTrinket(g,slot){
 return !!g&&Number.isInteger(slot)&&slot>=0&&slot<TRINKET_SLOTS&&!!eventTriggerFor(g.trinkets?.equipped?.[slot])&&g.p?.hp>0&&!g.bossIntro&&g.mode!=='bossrush'&&!g.riftArena&&!g.rifts?.active&&!g.events?.active&&(g.status==='playing'||g.status==='paused'&&(g.resumeStatus||'playing')==='playing');
}
export function useEventTrinket(g,slot,{startEvent}={}){
 if(!canUseEventTrinket(g,slot)||typeof startEvent!=='function')return false;
 const state=g.trinkets,id=state.equipped[slot],trigger=eventTriggerFor(id);
 // Start and consume form one synchronous transaction. A failed or blocked
 // event keeps this exact item, its slot and every unrelated keepsake intact.
 if(startEvent(trigger.eventId)!==true)return false;
 state.equipped[slot]=null;delete state.refinements?.[id];return true;
}
export function restoreTrinkets(g,raw){
 const state=newTrinkets(),seen=new Set();state.wish=normalizeWish(raw?.wish);state.serial=Math.min(1e9,nonnegative(raw?.serial));state.kills=nonnegative(raw?.kills);state.firstBossDropped=!!raw?.firstBossDropped;state.reading=Math.min(30,Math.max(0,finite(raw?.reading)?raw.reading:0));state.dangoKills=nonnegative(raw?.dangoKills)%10;state.bellKills=nonnegative(raw?.bellKills)%20;state.pochitaKills=nonnegative(raw?.pochitaKills)%12;state.jazz=Math.min(24,Math.max(0,finite(raw?.jazz)?raw.jazz:0));
 for(let i=0;i<TRINKET_SLOTS;i++){const id=raw?.equipped?.[i];if(trinketFor(id)&&!state.equipped.includes(id)){state.equipped[i]=id;state.refinements[id]=refinement(raw?.refinements?.[id],id);}}
 if(state.equipped.includes('beckoningbell'))state.bellKills%=trinketEffect('beckoningbell',state.refinements.beckoningbell).kills;
 if(state.equipped.includes('memorybookmark'))state.reading=Math.min(state.reading,trinketEffect('memorybookmark',state.refinements.memorybookmark).interval);
 if(state.equipped.includes('pochitacharm'))state.pochitaKills%=trinketEffect('pochitacharm',state.refinements.pochitacharm).kills;
 if(state.equipped.includes('bebopcassette'))state.jazz=Math.min(state.jazz,trinketEffect('bebopcassette',state.refinements.bebopcassette).interval);
 const normalize=drop=>{
  if(!drop||!trinketFor(drop.itemId)||seen.has(drop.itemId)||(state.equipped.includes(drop.itemId)&&state.refinements[drop.itemId]>=trinketMaxRefinement(drop.itemId))||!finite(drop.x)||!finite(drop.y))return null;
  const number=typeof drop.uid==='string'&&/^trinket:\d+$/.test(drop.uid)?Number(drop.uid.split(':')[1]):NaN,uid=Number.isSafeInteger(number)&&number>0&&number<=1e9?drop.uid:'trinket:'+ ++state.serial;state.serial=Math.max(state.serial,nonnegative(Number(uid.split(':')[1])));
  seen.add(drop.itemId);return {uid,itemId:drop.itemId,x:Math.max(-1e7,Math.min(1e7,drop.x)),y:Math.max(-1e7,Math.min(1e7,drop.y)),age:Math.max(0,Math.min(36000,finite(drop.age)?drop.age:0))};
 };
 state.pending=normalize(raw?.pending);
 for(const drop of Array.isArray(raw?.drops)?raw.drops:[]){if(state.drops.length>=TRINKET_DROP_LIMIT)break;const valid=normalize(drop);if(valid)state.drops.push(valid);}
 const uids=new Set();for(const drop of [...(state.pending?[state.pending]:[]),...state.drops]){if(uids.has(drop.uid))drop.uid='trinket:'+ ++state.serial;uids.add(drop.uid);}
 for(const key of Object.keys(state.cosmetic))state.cosmetic[key]=Math.max(0,Math.min(2,finite(raw?.cosmetic?.[key])?raw.cosmetic[key]:0));
 g.trinkets=state;
 if(state.pending){if(g.status==='paused')g.resumeStatus='trinket';else g.status='trinket';}
 else if(g.status==='trinket')g.status='playing';else if(g.status==='paused'&&g.resumeStatus==='trinket')g.resumeStatus='playing';
 return state;
}
