import {ITEMS,FUSIONS,MAX_SLOTS,applyChoice,refreshStats,forbiddenItem,inactiveFormWeapon,fusionBase,fusionIngredients,fusionReady,CHARACTERS} from './game.js';
import {syncErenProgress} from './eren-progress.js';
import {ENEMIES,BOSSES} from './enemies.js';
import {newTrinkets,trinketFor} from './trinkets.js';
import {RIFT_ENCOUNTERS,openRiftPortal} from './rift-encounters.js';
import {pointCollider} from './world.js';

// Training: a sandbox run for testing. Nothing spawns unless the player asks for it,
// every enemy, boss, item, fusion and trinket can be granted on demand, and the run
// never pays out coins, mastery XP or best-kill records.
const TAU=Math.PI*2;
export function newTraining(){return {version:1,natural:false,god:false,summoned:0};}
export function initializeTraining(g){
 g.mode='training';g.training=newTraining();
 // Natural waves, events and rifts are held back until switched on.
 g.spawn=g.eliteAt=Infinity;
 return g;
}
export function restoreTraining(g){
 const raw=g.training||{};g.training={...newTraining(),natural:raw.natural===true,god:raw.god===true,summoned:Math.max(0,Math.floor(Number(raw.summoned)||0))};
 if(!g.training.natural)g.spawn=g.eliteAt=Infinity;
 return g;
}
export const trainingNatural=g=>g.mode!=='training'||g.training?.natural===true;
export function setNaturalSpawns(g,on){
 if(g.mode!=='training')return false;g.training.natural=!!on;
 if(on){g.spawn=Math.min(g.spawn,1);g.eliteAt=g.time+30;}else g.spawn=g.eliteAt=Infinity;
 return true;
}
export function setGodMode(g,on){if(g.mode!=='training')return false;g.training.god=!!on;return true;}

// ---- Summons ----
export function trainingRoster(){
 const entries=[...Object.entries(BOSSES).map(([id,def])=>({id,boss:true,def})),...Object.entries(ENEMIES).map(([id,def])=>({id,boss:false,def}))];
 const kind=({boss,def})=>boss?(def.riftOnly?'rift':def.eventOnly?'event':'boss'):'enemy';
 return entries.map(e=>({id:e.id,name:e.def.name,family:e.def.family,color:e.def.color,kind:kind(e),phase2:e.boss&&!!(e.def.shiftName||e.def.riftShiftName||e.def.riftOnly||e.def.eventOnly||['cell','motherbrain'].includes(e.id))}));
}
function enterPhase2(e){
 e.hp=Math.min(e.hp,e.maxHp*.5);e.enraged=true;e.transformed=true;e.riftTrialDone=true;e.riftTrialStarted=true;
 if(e.shiftName){e.name=e.shiftName;e.title=e.shiftTitle||e.title;e.r=e.shiftRadius||e.r;}
 if(e.riftShiftName){e.name=e.riftShiftName;e.r=e.riftShiftRadius||e.r;}
 if(e.archetype==='cell')e.cellStage=2;
}
// `spawn` is the engine's spawnEnemy, passed in so this module stays free of an import cycle.
export function trainingSpawn(g,id,{count=1,elite=false,phase2=false,random=Math.random}={},spawn){
 if(g.mode!=='training'||typeof spawn!=='function')return [];
 const boss=!!BOSSES[id];if(!boss&&!ENEMIES[id])return [];
 const made=[],n=Math.max(1,Math.min(boss?3:25,Math.floor(count)||1)),offset=random()*TAU;
 for(let i=0;i<n;i++){
  const e=spawn(g,boss,elite&&!boss,id);if(!e)continue;
  const a=offset+i/n*TAU,d=boss?240:170+random()*60;e.x=g.p.x+Math.cos(a)*d;e.y=g.p.y+Math.sin(a)*d;
  e.trainingSummon=true;e.attackCD=Math.max(e.attackCD||0,1.2);
  if(boss&&phase2)enterPhase2(e);
  made.push(e);
 }
 g.training.summoned+=made.length;
 if(made.length){g.toast=(made.length>1?made.length+' × ':'')+made[0].name.toUpperCase()+' SUMMONED';g.toastTime=2;}
 return made;
}
// Rift and event bosses have no rift challenge or event script here, so they change
// form directly at half health.
export function updateTraining(g){
 if(g.mode!=='training')return;
 for(const e of g.enemies)if(e.boss&&e.trainingSummon&&!e.enraged&&e.hp>0&&e.hp<=e.maxHp*.5&&(e.riftOnly||e.eventOnly)&&!e.shiftName)enterPhase2(e);
}

// ---- Rifts ----
export function trainingRifts(){return RIFT_ENCOUNTERS.map(r=>({id:r.id,name:r.name,title:r.title,color:r.color,family:BOSSES[r.id]?.family}));}
// Clears the field so the portal can be entered at once, then opens the chosen rift.
export function trainingOpenRift(g,id){
 if(g.mode!=='training')return 'Rifts can only be opened this way in Training';
 if(!RIFT_ENCOUNTERS.some(r=>r.id===id))return 'Unknown rift';
 if(g.rifts?.active)return 'Finish or leave the current rift first';
 if(g.events?.active)return 'Wait for the world event to end';
 if((g.chests||[]).length)return 'Claim or ignore the chest on the field first';
 clearEnemies(g);
 return openRiftPortal(g,id,{blocked:(x,y,r)=>pointCollider(g,x,y,r)})?'':'The rift could not open here';
}

// ---- Items ----
export function trainingItems(p){
 return Object.entries(ITEMS).filter(([,item])=>!item.fusionOnly).map(([id,item])=>{const inv=item.type==='weapon'?p.weapons:p.passives;return {id,name:item.name,type:item.type,max:item.max,level:inv[id]||0,locked:!!(forbiddenItem(p,id)||inactiveFormWeapon(p,id)),fused:!!p.fusions[id]};});
}
// Sets an item to an exact level (0 removes it). Returns a short reason when refused.
export function setItemLevel(g,id,level){
 const p=g.p,item=ITEMS[id];if(!item||item.fusionOnly)return 'Unknown item';
 if(forbiddenItem(p,id)||inactiveFormWeapon(p,id))return item.name+' cannot be equipped by '+p.displayName+' right now';
 const inv=item.type==='weapon'?p.weapons:p.passives,rank=inv[id]||0,target=Math.max(0,Math.min(item.max,Math.floor(level)));
 if(target===rank)return '';
 if(target===0){
  if(id===CHARACTERS.find(c=>c.id===p.id)?.weapon&&Object.keys(p.weapons).length<=1)return 'Keep at least one weapon';
  delete inv[id];delete p.cooldowns?.[id];delete p.fusions[id];
 }else{
  if(!rank&&Object.keys(inv).length>=MAX_SLOTS)return 'All '+MAX_SLOTS+' '+item.type+' slots are full · remove one first';
  if(p.fusions[id]&&target<item.max)delete p.fusions[id];
  inv[id]=target;if(p.id==='eren'&&p.formWeapons&&id===p.weapon)p.formWeapons[id]=target;
 }
 syncErenProgress(p);const oldMax=p.maxHp;refreshStats(p);p.hp=Math.min(p.maxHp,p.hp+Math.max(0,p.maxHp-oldMax));
 return '';
}
export function trainingFusions(p){
 return FUSIONS.map(f=>({id:f.id,name:f.name,color:f.color,base:fusionBase(f),ingredients:fusionIngredients(f),active:p.fusions[fusionBase(f)]===f.id||(f.resultItem&&!!(p.weapons[f.resultItem]||p.passives[f.resultItem])),locked:!!f.requiredCharacter&&f.requiredCharacter!==p.id||fusionIngredients(f).some(id=>ITEMS[id]&&!ITEMS[id].fusionOnly&&forbiddenItem(p,id)),required:f.requiredCharacter||null}));
}
// Grants every ingredient at max rank (preparing earlier evolutions and fusion-only
// parts first), then performs the fusion.
export function grantFusion(g,id,depth=0){
 const p=g.p,f=FUSIONS.find(f=>f.id===id);if(!f)return 'Unknown fusion';
 if(depth>6)return 'Fusion chain too deep';
 if(f.requiredCharacter&&f.requiredCharacter!==p.id)return f.name+' belongs to '+(CHARACTERS.find(c=>c.id===f.requiredCharacter)?.name||f.requiredCharacter);
 const base=fusionBase(f);
 if(p.fusions[base]===f.id)return '';
 if(f.requiresEvolution&&p.fusions[base]!==f.requiresEvolution){const why=grantFusion(g,f.requiresEvolution,depth+1);if(why)return why;}
 for(const part of fusionIngredients(f)){
  const item=ITEMS[part];if(!item)return 'Missing ingredient';
  if(item.fusionOnly){if((p.passives[part]||0)<item.max){const maker=FUSIONS.find(m=>m.resultItem===part);if(!maker)return 'No recipe for '+item.name;const why=grantFusion(g,maker.id,depth+1);if(why)return why;}continue;}
  const inv=item.type==='weapon'?p.weapons:p.passives;
  if(part===base&&f.requiresEvolution){if((inv[part]||0)<item.max){const why=equipForFusion(g,part,f);if(why)return why;}continue;}
  if(p.fusions[part]&&part!==base)continue;
  if((inv[part]||0)<item.max){const why=equipForFusion(g,part,f);if(why)return why;}
 }
 if(!fusionReady(p,f))return 'Requirements for '+f.name+' are not met';
 return applyChoice(p,{kind:'fusion',id})?'':'Fusion failed';
}

// Every item a fusion needs, through earlier evolutions and fusion-only parts.
function fusionNeeds(f,seen=new Set()){
 if(!f||seen.has(f.id))return seen;seen.add(f.id);
 const needs=new Set();const walk=fu=>{for(const id of fusionIngredients(fu)){needs.add(id);const maker=ITEMS[id]?.fusionOnly&&FUSIONS.find(m=>m.resultItem===id);if(maker&&!seen.has(maker.id)){seen.add(maker.id);walk(maker);}}if(fu.requiresEvolution){const prev=FUSIONS.find(x=>x.id===fu.requiresEvolution);if(prev&&!seen.has(prev.id)){seen.add(prev.id);walk(prev);}}};
 walk(f);return needs;
}
// Equips a fusion ingredient at max, making room by removing unrelated items if needed.
function equipForFusion(g,id,f){
 let why=setItemLevel(g,id,ITEMS[id].max);if(!why||!why.includes('slots are full'))return why;
 const needs=fusionNeeds(f),p=g.p,inv=ITEMS[id].type==='weapon'?p.weapons:p.passives,signature=CHARACTERS.find(c=>c.id===p.id)?.weapon;
 const spare=Object.keys(inv).find(other=>!needs.has(other)&&other!==signature&&!p.fusions[other]&&!ITEMS[other]?.fusionOnly)||Object.keys(inv).find(other=>!needs.has(other)&&other!==signature&&!ITEMS[other]?.fusionOnly);
 if(!spare)return why;setItemLevel(g,spare,0);return setItemLevel(g,id,ITEMS[id].max);
}

// ---- Trinkets ----
// Hands the trinket straight to the player through the usual equip / refine prompt.
export function grantTrinket(g,id){
 if(g.mode!=='training'||!trinketFor(id))return false;
 const state=g.trinkets??=newTrinkets();if(state.pending)return false;
 state.pending={uid:'trinket:'+ ++state.serial,itemId:id,x:g.p.x,y:g.p.y,age:1};g.status='trinket';return true;
}

// ---- Tools ----
export function clearEnemies(g){g.enemies=[];g.enemyShots=[];g.hazards=[];g.bossIntro=null;g.bossDeaths=[];return true;}
export function fullHeal(g){const p=g.p;p.hp=p.maxHp;p.shield=p.maxShield||0;p.statuses={};return true;}
export function readyUltimate(g){g.special=0;g.secondarySpecial=0;g.dashCD=0;return true;}
export function levelUp(g){const p=g.p;p.xp=Math.max(p.xp||0,p.nextXp||0);return true;}
