import {CHARACTERS,ITEMS,FUSIONS,MAX_SLOTS,forbiddenWeapon,inactiveFormWeapon,refreshStats,fusionReady,applyChoice,consumedFusionIngredient} from './game.js';
import {BOSSES,shuffledBossOrder} from './enemies.js';
import {syncErenProgress} from './eren-progress.js';
import {enemyPressure} from './difficulty.js';

export function rushRequiredItems(g){
 const hero=CHARACTERS.find(c=>c.id===g.p.id);
 return {weapons:[g.p.id==='eren'?g.p.weapon:hero.weapon,...(hero.secondWeapon?[hero.secondWeapon]:[])],passives:[hero.passive]};
}
export function rushLoadoutFull(g){return ['weapons','passives'].every(type=>Object.keys(g.p[type]).length===MAX_SLOTS&&Object.entries(g.p[type]).every(([id,n])=>n===ITEMS[id]?.max));}
function refreshPreparation(g){
 if(g.p.id==='eren'){g.p.sharedFormRank=5;g.p.formWeapons={odmblades:5,titanfists:5};syncErenProgress(g.p);}
 refreshStats(g.p);g.p.hp=g.p.maxHp;g.p.shield=g.p.maxShield;
 g.rush.stage=rushLoadoutFull(g)?'fusion':'draft';g.status=g.rush.stage==='fusion'?'rush-fusion':'rush-draft';g.rush.choices=null;if(g.rush.stage==='draft')getRushDraftChoices(g);
}
export function getRushDraftPool(g){
 return Object.entries(ITEMS).filter(([id,item])=>{
  const inventory=item.type==='weapon'?g.p.weapons:g.p.passives;
  return !item.fusionOnly&&!inventory[id]&&Object.keys(inventory).length<MAX_SLOTS&&!g.p.vanished?.includes(id)&&!forbiddenWeapon(g.p,id)&&!inactiveFormWeapon(g.p,id)&&!consumedFusionIngredient(g.p,id);
 }).map(([id,item])=>({kind:'item',id,level:item.max}));
}
function drawChoices(pool,random,exclude=[]){
 const shuffled=[...pool];for(let i=shuffled.length-1;i>0;i--){const j=Math.floor(random()*(i+1));[shuffled[i],shuffled[j]]=[shuffled[j],shuffled[i]];}
 return [...shuffled.filter(c=>!exclude.includes(c.id)),...shuffled.filter(c=>exclude.includes(c.id))].slice(0,3);
}
export function getRushDraftChoices(g,random=Math.random){
 if(g.mode!=='bossrush'||g.rush?.stage!=='draft')return [];
 const pool=getRushDraftPool(g),valid=new Set(pool.map(c=>c.id));
 if(!Array.isArray(g.rush.choices)||!g.rush.choices.length||g.rush.choices.some(c=>!valid.has(c.id)))g.rush.choices=drawChoices(pool,random);
 return g.rush.choices;
}
export function chooseRushDraft(g,id){
 if(g.status!=='rush-draft'||!getRushDraftChoices(g).some(c=>c.id===id))return false;
 const item=ITEMS[id],inventory=item.type==='weapon'?g.p.weapons:g.p.passives;
 inventory[id]=item.max;g.p.level++;g.p.xp=0;refreshPreparation(g);return true;
}
export function rerollRushDraft(g,random=Math.random){
 if(g.status!=='rush-draft'||g.p.rerollsLeft<=0)return false;
 const current=getRushDraftChoices(g),ids=current.map(c=>c.id),pool=getRushDraftPool(g);if(!pool.some(c=>!ids.includes(c.id)))return false;
 g.rush.choices=drawChoices(pool,random,ids);g.p.rerollsLeft--;return true;
}
export function banRushDraft(g,id,random=Math.random){
 if(g.status!=='rush-draft'||g.p.vanishesLeft<=0||!getRushDraftChoices(g).some(c=>c.id===id))return false;
 const type=ITEMS[id].type,inventory=type==='weapon'?g.p.weapons:g.p.passives;
 // A ban may narrow the draft, but must never prevent filling a category.
 if(getRushDraftPool(g).filter(c=>c.id!==id&&ITEMS[c.id].type===type).length<MAX_SLOTS-Object.keys(inventory).length)return false;
 g.p.vanished??=[];g.p.vanished.push(id);g.p.vanishesLeft--;g.rush.choices=drawChoices(getRushDraftPool(g),random);return true;
}
export function initializeBossRush(g){
 const order=shuffledBossOrder(g.map.id);g.mode='bossrush';g.rush={rulesVersion:2,stage:'draft',round:1,cleared:0,total:order.length,order,activeBossId:null,awaitingLoot:false,intermission:0,choices:null};
 const required=rushRequiredItems(g);g.p.weapons=Object.fromEntries(required.weapons.map(id=>[id,ITEMS[id].max]));g.p.passives=Object.fromEntries(required.passives.map(id=>[id,ITEMS[id].max]));g.p.fusions={};g.p.cooldowns={};g.p.vanished=[];refreshPreparation(g);getRushDraftChoices(g);g.spawn=g.eliteAt=Infinity;return g;
}
// Used for migrating catalog-style preparation and deterministic run fixtures.
// The live mode always reaches this state through random max-level choices.
export function configureRushLoadout(g,loadout){
 if(g.mode!=='bossrush'||!['draft','loadout','fusion'].includes(g.rush?.stage)||!['rush-draft','rush-loadout','rush-fusion'].includes(g.status))return false;
 const required=rushRequiredItems(g),weapons=loadout?.weapons,passives=loadout?.passives;
 for(const [type,ids]of [['weapon',weapons],['passive',passives]])if(!Array.isArray(ids)||ids.length>MAX_SLOTS||new Set(ids).size!==ids.length||ids.some(id=>ITEMS[id]?.type!==type||ITEMS[id]?.fusionOnly))return false;
 if(required.weapons.some(id=>!weapons.includes(id))||required.passives.some(id=>!passives.includes(id))||weapons.some(id=>forbiddenWeapon(g.p,id)||inactiveFormWeapon(g.p,id)))return false;
 g.p.weapons=Object.fromEntries(weapons.map(id=>[id,ITEMS[id].max]));g.p.passives=Object.fromEntries(passives.map(id=>[id,ITEMS[id].max]));g.p.fusions={};g.p.cooldowns={};g.p.vanished=[];refreshPreparation(g);return true;
}
export function rushFusionChoices(g){return g.mode==='bossrush'&&g.rush?.stage==='fusion'?FUSIONS.filter(f=>fusionReady(g.p,f)):[];}
export function evolveRushWeapon(g,id){
 if(g.status!=='rush-fusion'||!rushFusionChoices(g).some(f=>f.id===id)||!applyChoice(g.p,{kind:'fusion',id}))return false;
 refreshPreparation(g);return true;
}
export function beginBossRush(g){
 if(g.mode!=='bossrush'||g.rush?.stage!=='fusion'||g.status!=='rush-fusion'||!rushLoadoutFull(g))return false;
 g.rush.stage='combat';g.rush.choices=null;g.status='playing';g.invuln=Math.max(g.invuln,1);return true;
}
export function rushPhaseDamage(g,e,damage){
 if(g.mode!=='bossrush'||!e.boss||e.archetype==='cell'||e.enraged)return damage;
 return Math.max(0,Math.min(damage,e.hp-(e.maxHp*.5-.01)));
}
export function advanceBossRush(g,dt,{spawn,queueIntro}){
 if(g.mode!=='bossrush'||g.rush?.stage!=='combat')return false;
 const rush=g.rush;g.enemies=g.enemies.filter(e=>e.boss||e.archetype==='mimic');
 if(rush.activeBossId!=null)return false;
 if(rush.awaitingLoot){if(g.chests.length||g.rewards.some(c=>!c.decision))return false;rush.awaitingLoot=false;}
 if(rush.cleared>=rush.total){rush.stage='complete';g.won=true;g.status='over';return true;}
 rush.intermission=Math.max(0,rush.intermission-dt);if(rush.intermission>0)return false;
 const id=rush.order[rush.cleared];rush.round=rush.cleared+1;g.wave=rush.round*5;
 const e=spawn(g,true,false,id),hp=BOSSES[id].hp*(5+.9*rush.cleared)*enemyPressure(g.time,g.difficulty).hp;
 e.hp=e.maxHp=hp;e.rushRound=rush.round;rush.activeBossId=e.id;g.boss=true;
 if(rush.cleared)g.p.hp=Math.min(g.p.maxHp,g.p.hp+g.p.maxHp*.1);
 g.invuln=Math.max(g.invuln,1);g.toast='BOSS RUSH · '+rush.round+' / '+rush.total+' · '+e.name.toUpperCase();g.toastTime=4;queueIntro(g,e,g.wave);return true;
}
export function defeatedRushBoss(g,e){
 if(g.mode!=='bossrush'||!e.boss||e.id!==g.rush?.activeBossId)return;
 const rush=g.rush;rush.cleared++;rush.activeBossId=null;rush.awaitingLoot=true;rush.intermission=2;
 g.enemyShots=[];g.hazards=[];g.shots=[];g.fields=[];g.crimsonEchoes=[];
 if(g.garuda){g.garuda.inFlight=false;g.garuda.flightId=null;}
}
export function restoreBossRush(g){
 if(g.mode!=='bossrush')return !['rush-draft','rush-loadout','rush-fusion'].includes(g.status)&&!['rush-draft','rush-loadout','rush-fusion'].includes(g.resumeStatus);
 const r=g.rush,known=Object.keys(BOSSES).filter(id=>!BOSSES[id].riftOnly&&!BOSSES[id].eventOnly);
 // Keep unfinished pre-expansion gauntlets intact. Append the new opponents
 // after the saved order so the active fight and cleared rounds keep identity.
 const releases=[['katanaman','batdevil','eternitydevil','ryuma','moriah'],['ryuma','moriah'],['jellal','geld','kokushibo']];
 for(let i=0;i<releases.length;i++){
  const added=releases[i],later=releases.slice(i+1).flat(),legacy=known.filter(id=>!added.includes(id)&&!later.includes(id));
  if(r&&Array.isArray(r.order)&&r.total===legacy.length&&r.order.length===legacy.length&&new Set(r.order).size===legacy.length&&r.order.every(id=>legacy.includes(id))){r.order=[...r.order,...added.filter(id=>known.includes(id))];r.total=r.order.length;}
 }
 if(!r||!['draft','loadout','fusion','combat'].includes(r.stage)||!Array.isArray(r.order)||r.order.length!==known.length||new Set(r.order).size!==known.length||r.order.some(id=>!BOSSES[id]||BOSSES[id].riftOnly||BOSSES[id].eventOnly)||!Number.isInteger(r.cleared)||r.cleared<0||r.cleared>known.length||!Number.isInteger(r.round)||r.round<1||r.round>known.length||r.total!==known.length)return false;
 const paused=g.status==='paused';
 if(r.stage!=='combat'){
  if(r.rulesVersion!==2){
   for(const [type,ids]of Object.entries(r.draft||{}))if(['weapons','passives'].includes(type)&&Array.isArray(ids))for(const id of ids){const item=ITEMS[id];if(!item||item.fusionOnly||(type==='weapons')!==(item.type==='weapon')||forbiddenWeapon(g.p,id)||inactiveFormWeapon(g.p,id)||consumedFusionIngredient(g.p,id)||Object.keys(g.p[type]).length>=MAX_SLOTS&&!g.p[type][id])continue;g.p[type][id]=item.max;}
   for(const type of ['weapons','passives'])for(const id of Object.keys(g.p[type]))g.p[type][id]=ITEMS[id].max;
  }
  if(g.p.id==='eren')syncErenProgress(g.p);refreshStats(g.p);g.p.hp=g.p.maxHp;g.p.shield=g.p.maxShield;
  r.stage=rushLoadoutFull(g)?'fusion':'draft';const status=r.stage==='fusion'?'rush-fusion':'rush-draft';if(paused)g.resumeStatus=status;else g.status=status;
  if(r.stage==='draft')getRushDraftChoices(g);else r.choices=null;
 }
 r.rulesVersion=2;r.intermission=Math.max(0,Number(r.intermission)||0);g.enemies=g.enemies.filter(e=>e.boss||e.archetype==='mimic');g.spawn=g.eliteAt=Infinity;return true;
}
