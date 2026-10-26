import {MAPS,CHARACTERS} from './game.js';
import {ENEMIES,BOSSES,MAP_ENEMIES,MAP_BOSSES,REGULAR_BOSS_IDS} from './enemies.js';
import {RIFT_ENCOUNTERS} from './rift-encounters.js';
import {TRINKETS,isEventTrigger} from './trinkets.js';
import {generateAct,NODE_TYPES,ASCENT_ACTS} from './ascent.js';
import {CARD_LIBRARY,cardDef,cardStats,cardPool,starterDeck,forgeableFusions} from './spire-cards.js';

// Turn-based Ascent, played like Slay the Spire: a deck built from the game's items,
// three energy a turn, Block, statuses and enemy intents, on the same branching
// three-act map as Ascent: Action. All state is plain JSON and every roll comes from
// the run's own seeded generator, so a saved run resumes exactly.
export const SPIRE_SAVE_KEY='anime-survivors-spire-v1';
export const HAND_SIZE=5,BASE_ENERGY=3,ULT_CHARGE=8;
export const COMBAT_NODES=['battle','elite','gauntlet','rift','boss'];

// ---- Randomness ----
export function rand(run){let a=run.rng=(run.rng+0x6D2B79F5)>>>0;let t=a;t=Math.imul(t^t>>>15,t|1);t^=t+Math.imul(t^t>>>7,t|61);return ((t^t>>>14)>>>0)/4294967296;}
const pick=(run,list)=>list[Math.floor(rand(run)*list.length)];
const shuffle=(run,list)=>{for(let i=list.length-1;i>0;i--){const j=Math.floor(rand(run)*(i+1));[list[i],list[j]]=[list[j],list[i]];}return list;};
const hash=s=>[...String(s)].reduce((h,c)=>Math.imul(h^c.charCodeAt(0),16777619)>>>0,2166136261);

// ---- Relics (trinkets) and pacts ----
export const RELIC_EFFECTS=[
 {id:'spark',text:'Start each combat with 1 extra Energy.',startEnergy:1},
 {id:'aegis',text:'Start each combat with 8 Block.',startBlock:8},
 {id:'might',text:'Start each combat with 1 Strength.',startStrength:1},
 {id:'mend',text:'Heal 5 HP after each combat.',afterHeal:5},
 {id:'vigor',text:'Raise your max HP by 8.',maxHp:8},
 {id:'insight',text:'Draw 2 extra cards on your first turn.',firstDraw:2},
 {id:'fortune',text:'Gain 25% more gold.',gold:.25},
 {id:'thorns',text:'Whenever an enemy hits you, deal 3 damage back.',thorns:3},
 {id:'hex',text:'At the start of each combat, apply 1 Vulnerable to ALL enemies.',startVuln:1},
 {id:'bloom',text:'At the end of each turn, heal 1 HP.',turnHeal:1},
 {id:'focus',text:'Start each combat with 1 Dexterity.',startDex:1},
 {id:'charge',text:'Your ultimate starts each combat half charged.',ultHalf:true},
];
export const RELIC_TRINKETS=TRINKETS.filter(t=>!isEventTrigger(t.id)).map(t=>t.id);
export const relicEffect=id=>RELIC_EFFECTS[RELIC_TRINKETS.indexOf(id)%RELIC_EFFECTS.length]||RELIC_EFFECTS[0];
const relicSum=(run,key)=>run.relics.reduce((s,id)=>s+(Number(relicEffect(id)[key])||0),0);
const relicHas=(run,key)=>run.relics.some(id=>relicEffect(id)[key]);
export const PACTS=[
 {id:'blood',name:'Blood Pact',blessing:'Start every combat with 2 Strength.',curse:'−10 max HP.',maxHp:-10,strength:2},
 {id:'iron',name:'Iron Vow',blessing:'+15 max HP.',curse:'Start every combat Weak for 1 turn.',maxHp:15,weakSelf:1},
 {id:'haste',name:'Oath of Haste',blessing:'Draw 1 more card every turn.',curse:'Lose 3 HP at the start of every combat.',drawEvery:1,loseHp:3},
 {id:'greed',name:'Pact of Greed',blessing:'+50% gold.',curse:'Enemies have 15% more HP.',gold:.5,enemyHp:.15},
 {id:'wind',name:'Gale Covenant',blessing:'Start every combat with 2 Dexterity.',curse:'−8 max HP.',maxHp:-8,dexterity:2},
 {id:'hunter',name:'Hunter’s Mark',blessing:'Start every combat applying 1 Vulnerable to ALL enemies.',curse:'Enemies have 10% more HP.',vulnAll:1,enemyHp:.1},
 {id:'siphon',name:'Siphon Bond',blessing:'Heal 4 HP after every combat.',curse:'Add a Regret curse to your deck.',afterHeal:4,curseCard:true},
];
const pactSum=(run,key)=>run.pacts.reduce((s,id)=>s+(Number(PACTS.find(p=>p.id===id)?.[key])||0),0);

// ---- Run ----
export function createSpireRun(heroId,{skin='default',seed=Math.floor(Math.random()*1e9)}={}){
 const hero=CHARACTERS.find(c=>c.id===heroId)||CHARACTERS[0],maxHp=Math.round(hero.hp*.65);
 const run={version:1,mode:'spire',runId:'spire-'+seed.toString(36)+'-'+Date.now().toString(36),seed,rng:seed>>>0,heroId:hero.id,skin,act:1,nodes:generateAct(1,seed),nodeId:null,visited:[],maxHp,hp:maxHp,gold:99,deck:[],uid:0,relics:[],pacts:[],screen:'map',combat:null,rewards:null,shop:null,event:null,removeCost:75,seenBosses:[],seenRifts:[],stats:{floors:0,battles:0,elites:0,bosses:0,goldEarned:0,cardsPlayed:0,damageDealt:0},over:false,won:false};
 for(const id of starterDeck(hero.id))addCard(run,id);
 return run;
}
export function addCard(run,id,up=false){if(!CARD_LIBRARY[id])return null;const card={uid:++run.uid,id,up:!!up};run.deck.push(card);return card;}
export function addGold(run,amount){const value=Math.max(0,Math.round(amount*(1+relicSum(run,'gold')+pactSum(run,'gold'))));run.gold+=value;run.stats.goldEarned+=value;return value;}
export function gainRelic(run,id){if(!id||run.relics.includes(id))return false;run.relics.push(id);const fx=relicEffect(id);if(fx.maxHp){run.maxHp+=fx.maxHp;run.hp+=fx.maxHp;}return true;}
const unownedRelic=run=>{const left=RELIC_TRINKETS.filter(id=>!run.relics.includes(id));return left.length?pick(run,left):null;};
export const spireNode=(run,id=run.nodeId)=>run.nodes.find(n=>n.id===id)||null;
export function reachable(run){if(!run.nodeId)return run.nodes.filter(n=>n.floor===0);const here=spireNode(run);return here?here.next.map(id=>spireNode(run,id)).filter(Boolean):[];}

// ---- Entering map nodes ----
export function enterSpireNode(run,id){
 if(run.over||run.screen!=='map')return false;const node=reachable(run).find(n=>n.id===id);if(!node)return false;
 run.nodeId=node.id;run.visited.push(node.id);run.stats.floors=Math.max(run.stats.floors,node.floor+1);
 if(COMBAT_NODES.includes(node.type))return startCombat(run,node.type);
 if(node.type==='shop'){run.shop=shopStock(run);run.screen='shop';}
 else if(node.type==='rest')run.screen='rest';
 else if(node.type==='treasure'){const relic=unownedRelic(run);gainRelic(run,relic);run.rewards={gold:addGold(run,25+Math.floor(rand(run)*25)),relic,cards:null,title:'Treasure Vault'};run.screen='reward';}
 else if(node.type==='mystery'){run.event={id:pick(run,SPIRE_EVENTS).id};run.screen='event';}
 else if(node.type==='forge')run.screen='forge';
 else if(node.type==='shrine'){const left=shuffle(run,PACTS.filter(p=>!run.pacts.includes(p.id)).map(p=>p.id));run.event={id:'shrine',pacts:left.slice(0,3)};run.screen='shrine';}
 else if(node.type==='altar')run.screen='altar';
 return true;
}

// ---- Enemies ----
const ARCHETYPES=['brute','guard','hexer','swarm','buffer'];
const PATTERNS={
 brute:[{attack:1.25},{block:1,attack:.5},{attack:1.6}],
 guard:[{block:1.2},{attack:1},{attack:.7,block:.7}],
 hexer:[{debuff:'weak',attack:.6},{attack:1},{debuff:'vulnerable',attack:.6},{attack:1.15}],
 swarm:[{attack:.42,times:3},{attack:.95},{attack:.4,times:2,debuff:'bleed'}],
 buffer:[{buff:2,block:.6},{attack:1},{attack:1.3}],
 boss:[{attack:1.6},{attack:.45,times:4},{buff:3,block:1.6},{attack:.8,debuff:'vulnerable'},{attack:1.1,debuff:'weak'}],
};
function makeFoe(run,id,{elite=false,boss=false,rift=false}={}){
 const def=ENEMIES[id]||BOSSES[id];if(!def)return null;
 const act=run.act,mul=[1,1.55,2.15][act-1]||2.15,hpMod=1+pactSum(run,'enemyHp');
 let hp=boss?[130,195,290][act-1]:rift?[175,250,340][act-1]:(12+9*Math.sqrt(Math.max(.5,def.hp)))*mul*(elite?2.4:1);
 hp=Math.round(hp*hpMod*(.92+rand(run)*.16));
 const arch=boss||rift?'boss':ARCHETYPES[hash(id)%ARCHETYPES.length];
 const atk=[6,9,12][act-1]*(elite?1.3:1)*(boss||rift?1.2:1);
 return {uid:'e'+ ++run.uid,id,name:def.name,boss,elite,rift,hp,maxHp:hp,block:0,statuses:{},arch,atk,step:boss||rift?0:Math.floor(rand(run)*PATTERNS[arch].length),enraged:false,shiftName:def.shiftName||def.riftShiftName||null,intent:null};
}
// The next move, with damage already adjusted for the enemy's Strength and Weak.
export function intentFor(foe){
 const plan=PATTERNS[foe.arch][foe.step%PATTERNS[foe.arch].length],boost=foe.enraged?1.25:1,strength=foe.statuses.strength||0,weak=(foe.statuses.weak||0)>0;
 const hit=plan.attack?Math.max(1,Math.floor((Math.round(foe.atk*plan.attack*boost)+strength)*(weak?.75:1))):0;
 return {attack:hit,times:plan.times||1,block:plan.block?Math.round(foe.atk*plan.block*1.1*boost):0,buff:plan.buff||0,debuff:plan.debuff||null,stunned:(foe.statuses.stun||0)>0};
}
function encounterFoes(run,type,map){
 const pool=(MAP_ENEMIES[map.id]||[]).filter(id=>ENEMIES[id]&&!ENEMIES[id].eventOnly&&!ENEMIES[id].riftOnly&&id!=='mimic'),node=spireNode(run);
 const fallback=Object.keys(ENEMIES).filter(id=>!ENEMIES[id].eventOnly&&!ENEMIES[id].riftOnly&&id!=='mimic');
 const foe=()=>pick(run,pool.length?pool:fallback);
 if(type==='boss'){const bosses=(MAP_BOSSES[map.id]||REGULAR_BOSS_IDS).filter(id=>BOSSES[id]&&!run.seenBosses.includes(id));const id=bosses.length?pick(run,bosses):pick(run,REGULAR_BOSS_IDS);run.seenBosses.push(id);return [makeFoe(run,id,{boss:true})];}
 if(type==='rift'){const left=RIFT_ENCOUNTERS.filter(r=>!run.seenRifts.includes(r.id)&&BOSSES[r.id]);const id=(left.length?pick(run,left):pick(run,RIFT_ENCOUNTERS)).id;run.seenRifts.push(id);return [makeFoe(run,id,{rift:true})];}
 if(type==='elite')return [makeFoe(run,foe(),{elite:true}),...(run.act>=2?[makeFoe(run,foe())]:[])];
 const count=type==='gauntlet'?2:(node?.floor||0)<3?1+Math.floor(rand(run)*2):2+Math.floor(rand(run)*2);
 return Array.from({length:count},()=>makeFoe(run,foe()));
}

// ---- Combat ----
const status=(o,k)=>o.statuses[k]||0;
function addStatus(o,k,v){o.statuses[k]=(o.statuses[k]||0)+v;if(o.statuses[k]<=0)delete o.statuses[k];}
const fx=(c,data)=>{c.fx.push({id:++c.fxSerial,...data});if(c.fx.length>24)c.fx.splice(0,c.fx.length-24);};
export const liveFoes=c=>c.enemies.filter(e=>e.hp>0);
export function startCombat(run,type){
 const map=pick(run,MAPS),hero=run;
 const c={type,mapId:map.id,turn:0,energy:0,maxEnergy:BASE_ENERGY,draw:shuffle(run,run.deck.map(card=>({...card}))),hand:[],discard:[],exhaust:[],used:[],player:{block:0,statuses:{}},powers:{turret:0,regen:0,plated:0},enemies:encounterFoes(run,type,map).filter(Boolean),waves:type==='gauntlet'?1:0,ult:relicHas(run,'ultHalf')?Math.floor(ULT_CHARGE/2):0,fx:[],fxSerial:0,won:false,log:[]};
 run.combat=c;run.screen='combat';
 const s=c.player.statuses,str=relicSum(run,'startStrength')+pactSum(run,'strength'),dex=relicSum(run,'startDex')+pactSum(run,'dexterity');
 if(str)s.strength=str;if(dex)s.dexterity=dex;if(pactSum(run,'weakSelf'))s.weak=pactSum(run,'weakSelf');
 const vuln=relicSum(run,'startVuln')+pactSum(run,'vulnAll');if(vuln)for(const e of c.enemies)addStatus(e,'vulnerable',vuln);
 const lose=pactSum(run,'loseHp');if(lose)hero.hp=Math.max(1,hero.hp-lose);
 for(const e of c.enemies)e.intent=intentFor(e);
 startPlayerTurn(run,true);
 return true;
}
function drawCards(run,n){
 const c=run.combat;
 for(let i=0;i<n&&c.hand.length<10;i++){if(!c.draw.length){if(!c.discard.length)break;c.draw=shuffle(run,c.discard);c.discard=[];}c.hand.push(c.draw.pop());}
}
function dot(run,o,isPlayer){
 // Poison, Bleed and Burn hurt at the start of the afflicted side's turn, then fade by 1.
 for(const k of ['poison','bleed','burn']){const v=status(o,k);if(!v)continue;if(isPlayer)run.hp=Math.max(0,run.hp-v);else o.hp=Math.max(0,o.hp-v);fx(run.combat,{target:isPlayer?'player':o.uid,amount:v,kind:k});addStatus(o,k,-1);}
}
function startPlayerTurn(run,first=false){
 const c=run.combat;c.turn++;c.player.block=first?relicSum(run,'startBlock'):0;
 dot(run,c.player,true);if(run.hp<=0)return loseRun(run);
 c.energy=c.maxEnergy+(first?relicSum(run,'startEnergy'):0);
 drawCards(run,HAND_SIZE+(first?relicSum(run,'firstDraw'):0)+pactSum(run,'drawEvery'));
}
function damageFoe(run,e,amount,{fromCard=true}={}){
 const c=run.combat,p=c.player;if(e.hp<=0)return 0;
 let v=fromCard?amount+status(p,'strength'):amount;if(fromCard&&status(p,'weak'))v*=.75;if(status(e,'vulnerable'))v*=1.5;v=Math.max(0,Math.floor(v));
 const blocked=Math.min(e.block,v);e.block-=blocked;const dealt=v-blocked;e.hp=Math.max(0,e.hp-dealt);run.stats.damageDealt+=dealt;fx(c,{target:e.uid,amount:dealt,blocked,kind:'hit'});
 if(e.hp>0&&(e.boss||e.rift)&&!e.enraged&&e.hp<=e.maxHp/2){e.enraged=true;addStatus(e,'strength',3);if(e.shiftName)e.name=e.shiftName;fx(c,{target:e.uid,kind:'phase'});}
 return dealt;
}
function damagePlayer(run,amount,source){
 const c=run.combat,p=c.player;let v=amount;if(status(p,'vulnerable'))v=Math.floor(v*1.5);
 const blocked=Math.min(p.block,v);p.block-=blocked;const dealt=v-blocked;run.hp=Math.max(0,run.hp-dealt);fx(c,{target:'player',amount:dealt,blocked,kind:'hit'});
 const thorns=relicSum(run,'thorns');if(thorns&&source&&source.hp>0)damageFoe(run,source,thorns,{fromCard:false});
}
export function canPlay(run,index){
 const c=run.combat,card=c?.hand[index],def=card&&cardStats(card.id,card.up);
 return !!def&&!def.unplayable&&!c.won&&!run.over&&def.cost<=c.energy;
}
export const needsTarget=card=>{const def=cardStats(card.id,card.up);return def.target==='enemy'&&def.effects.some(e=>e.op==='damage'||e.op==='apply'&&e.target==='enemy');};
export function playCard(run,index,targetUid){
 if(!canPlay(run,index))return false;
 const c=run.combat,card=c.hand[index],def=cardStats(card.id,card.up),foes=liveFoes(c);
 let target=foes.find(e=>e.uid===targetUid);if(needsTarget(card)&&!target){if(foes.length===1)target=foes[0];else return false;}
 c.energy-=def.cost;c.hand.splice(index,1);
 for(const e of def.effects)applyEffect(run,e,target);
 run.stats.cardsPlayed++;c.ult=Math.min(ULT_CHARGE,c.ult+1);
 if(def.type==='power')c.used.push(card);else if(def.exhaust)c.exhaust.push(card);else c.discard.push(card);
 checkWin(run);return true;
}
function applyEffect(run,e,target){
 const c=run.combat,p=c.player;
 if(e.op==='damage'){for(let i=0;i<(e.times||1);i++){const t=target&&target.hp>0?target:liveFoes(c)[0];if(!t)break;damageFoe(run,t,e.value);}}
 else if(e.op==='damageAll')for(const t of liveFoes(c))damageFoe(run,t,e.value);
 else if(e.op==='block'){const v=Math.max(0,e.value+status(p,'dexterity'));p.block+=v;fx(c,{target:'player',amount:v,kind:'block'});}
 else if(e.op==='apply'){const list=e.target==='all'?liveFoes(c):[target&&target.hp>0?target:liveFoes(c)[0]].filter(Boolean);for(const t of list){addStatus(t,e.status,e.value);fx(c,{target:t.uid,kind:e.status,amount:e.value});}}
 else if(e.op==='draw')drawCards(run,e.value);
 else if(e.op==='energy')c.energy+=e.value;
 else if(e.op==='heal'){const before=run.hp;run.hp=Math.min(run.maxHp,run.hp+e.value);fx(c,{target:'player',amount:run.hp-before,kind:'heal'});}
 else if(e.op==='power'){if(e.power==='strength'||e.power==='dexterity')addStatus(p,e.power,e.value);else c.powers[e.power]=(c.powers[e.power]||0)+e.value;}
 for(const foe of c.enemies)if(foe.hp>0)foe.intent=intentFor(foe);
}
export const ultimateReady=run=>run.combat&&!run.combat.won&&run.combat.ult>=ULT_CHARGE;
// The hero's ultimate: a burst against every enemy plus Block, recharged by playing cards.
export function useUltimate(run){
 if(!ultimateReady(run))return false;const c=run.combat;c.ult=0;
 for(const e of liveFoes(c))damageFoe(run,e,10+run.act*6);c.player.block+=8+run.act*2;fx(c,{target:'player',kind:'ultimate'});
 checkWin(run);return true;
}
export function endTurn(run){
 const c=run.combat;if(!c||c.won||run.over)return false;const p=c.player;
 if(c.powers.turret)for(let i=0;i<1;i++){const foes=liveFoes(c);if(foes.length)damageFoe(run,pick(run,foes),c.powers.turret,{fromCard:false});}
 if(c.powers.regen){run.hp=Math.min(run.maxHp,run.hp+c.powers.regen);fx(c,{target:'player',amount:c.powers.regen,kind:'heal'});}
 const bloom=relicSum(run,'turnHeal');if(bloom)run.hp=Math.min(run.maxHp,run.hp+bloom);
 if(c.powers.plated)p.block+=c.powers.plated;
 c.discard.push(...c.hand);c.hand=[];
 for(const k of ['weak','vulnerable'])if(status(p,k))addStatus(p,k,-1);
 if(checkWin(run))return true;
 for(const e of c.enemies){
  if(e.hp<=0)continue;e.block=0;dot(run,e,false);if(e.hp<=0)continue;
  if(status(e,'stun')){addStatus(e,'stun',-1);fx(c,{target:e.uid,kind:'stunned'});}
  else{
   const it=intentFor(e);
   for(let i=0;i<it.times&&it.attack;i++){damagePlayer(run,it.attack,e);if(run.hp<=0)break;}
   if(it.block){e.block+=it.block;fx(c,{target:e.uid,amount:it.block,kind:'block'});}
   if(it.buff)addStatus(e,'strength',it.buff);
   if(it.debuff){addStatus(p,it.debuff,it.debuff==='bleed'?3:2);fx(c,{target:'player',kind:it.debuff});}
  }
  e.step++;for(const k of ['weak','vulnerable'])if(status(e,k))addStatus(e,k,-1);
  if(run.hp<=0)return loseRun(run);
 }
 if(checkWin(run))return true;
 for(const e of c.enemies)if(e.hp>0)e.intent=intentFor(e);
 startPlayerTurn(run);return true;
}
function checkWin(run){
 const c=run.combat;if(!c||c.won||liveFoes(c).length)return false;
 if(c.waves>0){c.waves--;c.enemies=encounterFoes(run,'battle',MAPS.find(m=>m.id===c.mapId)||MAPS[0]).map(e=>{e.intent=intentFor(e);return e;});fx(c,{target:'player',kind:'wave'});return false;}
 c.won=true;winCombat(run);return true;
}
function loseRun(run){run.over=true;run.won=false;run.screen='over';return false;}

// ---- Rewards ----
function rollRarity(run,type){const r=rand(run);if(type==='boss'||type==='rift')return 'rare';if(type==='elite')return r<.25?'rare':r<.7?'uncommon':'common';return r<.06?'rare':r<.4?'uncommon':'common';}
export function cardChoices(run,type='battle',count=3){
 const out=[];for(let guard=0;out.length<count&&guard<40;guard++){const pool=cardPool(rollRarity(run,type),run.heroId);const id=pool.length?pick(run,pool):null;if(id&&!out.includes(id))out.push(id);}
 return out;
}
function winCombat(run){
 const c=run.combat,act=run.act,type=c.type;
 run.stats.battles++;if(type==='elite')run.stats.elites++;if(type==='boss')run.stats.bosses++;
 const gold={battle:14+act*4,gauntlet:30+act*8,elite:32+act*8,rift:100+act*20,boss:80+act*25}[type]+Math.floor(rand(run)*8);
 const relic=type==='elite'||type==='rift'||type==='boss'?unownedRelic(run):null;if(relic)gainRelic(run,relic);
 const heal=relicSum(run,'afterHeal')+pactSum(run,'afterHeal');if(heal)run.hp=Math.min(run.maxHp,run.hp+heal);
 run.rewards={gold:addGold(run,gold*(c.goldBonus||1)),relic,cards:cardChoices(run,type),title:NODE_TYPES[type]?.name+' defeated',bossClear:type==='boss'};
 run.screen='reward';
}
export function takeRewardCard(run,id){const rw=run.rewards;if(run.screen!=='reward'||!rw?.cards?.includes(id))return false;addCard(run,id);rw.cards=null;return true;}
export function skipRewardCard(run){const rw=run.rewards;if(run.screen!=='reward'||!rw)return false;rw.cards=null;return true;}
export function finishRewards(run){
 const rw=run.rewards;if(run.screen!=='reward'||!rw)return false;
 run.rewards=null;run.combat=null;
 if(rw.bossClear){
  if(run.act>=ASCENT_ACTS){run.over=true;run.won=true;run.screen='over';return true;}
  run.act++;run.nodes=generateAct(run.act,run.seed);run.nodeId=null;run.visited=[];run.hp=Math.min(run.maxHp,run.hp+Math.round(run.maxHp*.35));run.screen='actclear';return true;
 }
 run.screen='map';return true;
}
export function continueSpireAct(run){if(run.screen!=='actclear')return false;run.screen='map';return true;}

// ---- Merchant ----
const scale=run=>1+.1*(run.act-1);
export function shopStock(run){
 const cards=[...cardChoices(run,'shopc',2).map(id=>({id,base:50})),...cardPool('uncommon',run.heroId).length?shuffle(run,[...new Set(cardPool('uncommon',run.heroId))]).slice(0,2).map(id=>({id,base:75})):[],...shuffle(run,[...new Set(cardPool('rare',run.heroId))]).slice(0,1).map(id=>({id,base:150}))];
 return {cards:cards.map(c=>({id:c.id,price:Math.round(c.base*scale(run)*(.9+rand(run)*.2)),sold:false})),relic:(()=>{const id=unownedRelic(run);return id?{id,price:Math.round(160*scale(run)),sold:false}:null;})(),removed:false};
}
export function buyCard(run,index){const o=run.shop?.cards[index];if(run.screen!=='shop'||!o||o.sold||run.gold<o.price)return false;run.gold-=o.price;o.sold=true;addCard(run,o.id);return true;}
export function buyRelic(run){const o=run.shop?.relic;if(run.screen!=='shop'||!o||o.sold||run.gold<o.price)return false;run.gold-=o.price;o.sold=true;gainRelic(run,o.id);return true;}
export function removeCard(run,uid){if(run.screen!=='shop'||run.shop.removed||run.gold<run.removeCost)return false;const i=run.deck.findIndex(c=>c.uid===uid);if(i<0||run.deck.length<=5)return false;run.gold-=run.removeCost;run.removeCost+=25;run.deck.splice(i,1);run.shop.removed=true;return true;}
export function leaveSpireScreen(run){if(!['shop','rest','forge','shrine','altar','event'].includes(run.screen))return false;run.shop=null;run.event=null;run.screen='map';return true;}

// ---- Campfire, forge, shrine, altar ----
export const upgradable=run=>run.deck.filter(c=>!c.up&&cardDef(c.id)&&!cardDef(c.id).unplayable);
export function restHeal(run){if(run.screen!=='rest')return false;run.hp=Math.min(run.maxHp,run.hp+Math.round(run.maxHp*.3));run.screen='map';return true;}
export function upgradeCard(run,uid,{screen='rest'}={}){if(run.screen!==screen)return false;const c=run.deck.find(c=>c.uid===uid&&!c.up);if(!c||cardDef(c.id).unplayable)return false;c.up=true;run.screen='map';return true;}
export const forgeOptions=run=>forgeableFusions(run.deck,run.heroId);
// Fusing removes one copy of each ingredient card and adds the fusion card.
export function forgeFuse(run,fusionId){
 if(run.screen!=='forge')return false;const card=forgeOptions(run).find(c=>c.id===fusionId);if(!card)return false;
 let up=false;for(const id of card.ingredients){const i=run.deck.findIndex(c=>c.id===id);if(i<0)return false;up=up||run.deck[i].up;run.deck.splice(i,1);}
 addCard(run,card.id,up);run.screen='map';return true;
}
export function forgeTemper(run){if(run.screen!=='forge')return false;const list=shuffle(run,upgradable(run)).slice(0,2);if(!list.length)return false;for(const c of list)c.up=true;run.screen='map';return true;}
export function swearSpirePact(run,id){const pact=PACTS.find(p=>p.id===id);if(run.screen!=='shrine'||!pact||!run.event?.pacts?.includes(id))return false;run.pacts.push(id);if(pact.maxHp){run.maxHp=Math.max(10,run.maxHp+pact.maxHp);run.hp=Math.max(1,Math.min(run.maxHp,run.hp+Math.max(0,pact.maxHp)));}if(pact.curseCard)addCard(run,'regret');run.event=null;run.screen='map';return true;}
export function altarSpire(run,kind){
 if(run.screen!=='altar')return false;
 if(kind==='blood'){if(run.maxHp<=20)return false;run.maxHp-=8;run.hp=Math.min(run.hp,run.maxHp);run.rewards={gold:0,relic:null,cards:cardChoices(run,'boss'),title:'The altar accepts your blood'};run.screen='reward';return true;}
 if(kind==='gold'){if(run.gold<120)return false;run.gold-=120;const relic=unownedRelic(run);gainRelic(run,relic);run.rewards={gold:0,relic,cards:null,title:'The altar accepts your gold'};run.screen='reward';return true;}
 return false;
}

// ---- Mystery events ----
export const SPIRE_EVENTS=[
 {id:'merchant',title:'A wandering merchant',text:'A hooded trader offers a card from the bottom of a sack, no questions asked.',options:[{id:'buy',label:'Buy a random uncommon card',cost:40},{id:'leave',label:'Walk on'}]},
 {id:'ambush',title:'Ambush!',text:'The path narrows and shapes close in from every side. There is no way around.',options:[{id:'fight',label:'Fight · +50% gold'}]},
 {id:'spring',title:'A healing spring',text:'Clear water glows faintly in a ring of stones.',options:[{id:'sip',label:'Drink · heal 50% HP'},{id:'deep',label:'Bathe · full heal, −5 max HP'}]},
 {id:'gamble',title:'The gambler’s den',text:'A grinning dealer slides a pair of dice across the table.',options:[{id:'bet',label:'Bet 40 gold · 50% chance to win 100',cost:40},{id:'leave',label:'Decline'}]},
 {id:'armory',title:'A forgotten armory',text:'Weapon racks still stand under the dust.',options:[{id:'take',label:'Choose an attack card · lose 10% HP'},{id:'leave',label:'Leave it be'}]},
 {id:'idol',title:'A cursed idol',text:'Gold spills from the idol’s mouth. Its eyes follow you.',options:[{id:'grab',label:'Take 120 gold · gain a Regret curse'},{id:'leave',label:'Leave it'}]},
 {id:'champion',title:'A lone champion',text:'A warrior bars the way and offers a duel for a worthy prize.',options:[{id:'duel',label:'Accept · fight an elite'},{id:'leave',label:'Bow and pass'}]},
 {id:'mentor',title:'An old mentor',text:'A retired fighter offers to drill you on your technique.',options:[{id:'train',label:'Upgrade a random card'},{id:'gold',label:'Ask for coin · 35 gold'}]},
];
export const spireEventFor=run=>SPIRE_EVENTS.find(e=>e.id===run.event?.id)||null;
export function resolveSpireEvent(run,optionId){
 const ev=spireEventFor(run);if(run.screen!=='event'||!ev?.options.some(o=>o.id===optionId))return false;
 const done=()=>{run.event=null;run.screen='map';return true;};
 switch(ev.id+':'+optionId){
  case'merchant:buy':{if(run.gold<40)return false;run.gold-=40;addCard(run,pick(run,cardPool('uncommon',run.heroId)));return done();}
  case'ambush:fight':run.event=null;startCombat(run,'battle');run.combat.goldBonus=1.5;return true;
  case'spring:sip':run.hp=Math.min(run.maxHp,run.hp+Math.round(run.maxHp*.5));return done();
  case'spring:deep':run.maxHp=Math.max(10,run.maxHp-5);run.hp=run.maxHp;return done();
  case'gamble:bet':if(run.gold<40)return false;run.gold-=40;if(rand(run)<.5)addGold(run,100);return done();
  case'armory:take':{run.hp=Math.max(1,run.hp-Math.round(run.maxHp*.1));const attacks=Object.values(CARD_LIBRARY).filter(c=>c.type==='attack'&&['common','uncommon'].includes(c.rarity)&&(!c.required||c.required===run.heroId)).map(c=>c.id);run.event=null;run.rewards={gold:0,relic:null,cards:shuffle(run,attacks).slice(0,3),title:'The armory’s gift'};run.screen='reward';return true;}
  case'idol:grab':addGold(run,120/(1+relicSum(run,'gold')+pactSum(run,'gold')));addCard(run,'regret');return done();
  case'champion:duel':run.event=null;startCombat(run,'elite');return true;
  case'mentor:train':{const list=upgradable(run);if(list.length)pick(run,list).up=true;return done();}
  case'mentor:gold':addGold(run,35);return done();
  default:return done();
 }
}

// ---- Saves ----
export function serializeSpire(run){return JSON.stringify(run);}
export function restoreSpire(text){
 let run;try{run=JSON.parse(text);}catch{return null;}
 if(!run||run.mode!=='spire'||run.version!==1||!Array.isArray(run.nodes)||!Array.isArray(run.deck)||!CHARACTERS.some(c=>c.id===run.heroId))return null;
 run.deck=run.deck.filter(c=>CARD_LIBRARY[c?.id]);run.relics=(run.relics||[]).filter(id=>RELIC_TRINKETS.includes(id));run.pacts=(run.pacts||[]).filter(id=>PACTS.some(p=>p.id===id));
 run.hp=Math.max(0,Math.min(Number(run.maxHp)||1,Number(run.hp)||0));run.gold=Math.max(0,Math.floor(Number(run.gold)||0));
 if(run.screen==='combat'&&!run.combat)run.screen='map';
 return run;
}
// Coins and hero XP banked to the profile when a card run ends.
export function spireRunCredit(run){const s=run.stats;return {coins:s.floors*6+s.elites*20+s.bosses*60+(run.won?150:0),xp:s.floors*3+s.elites*8+s.bosses*25+(run.won?60:0)};}
