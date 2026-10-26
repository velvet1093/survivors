import {syncDenjiForm} from './denji.js';
import {syncGutsArmor} from './guts.js';
import {restoreWorldEvents} from './world-events.js';
import {restorePersistentSummons} from './summons.js';
import {restoreFriendlyDeaths} from './friendly-death.js';
import {clearOrphanRiftSummons} from './rift-superbosses.js';
import {restoreFrierenGolem} from './frieren-golem.js';
import {restoreBossDeaths} from './boss-death.js';
import {readSavedValue,writeSavedValue,removeSavedValue} from './save-storage.js';
import {restoreRifts} from './rift-encounters.js';
import {restoreRiftTrial} from './rift-trials.js';
import {restoreShenron} from './shenron.js';
import {restoreTrinkets} from './trinkets.js';
import {difficultyFor} from './difficulty.js';
import {newGaruda,reconcileGaruda} from './garuda.js';
import {restoreBossRush} from './boss-rush.js';
import {CELL_STAGES} from './cell-phases.js';
import {syncErenProgress} from './eren-progress.js';
import {initializeHardcore,signatureWeaponIds,signaturePassiveIds} from './hardcore.js';
import {refreshStats,consumedFusionIngredient,fusionConsumedIngredients,hasQuintet} from './game.js';
import {SOUL_GEM_IDS} from './soul-gem-data.js';
import {CHARACTERS,MAPS,ITEMS,FUSIONS,MAX_SLOTS,forbiddenItem,inactiveFormWeapon,hardcoreFusionAllowed,fusionBase,fusionType,fusionReady} from './game.js';
import {createRun} from './engine.js';
import {skinFor} from './skins.js';
import {restoreTraining} from './training.js';
import {ensureWorld} from './world.js';
export const RUN_SAVE_KEY='anime-survivors-run-v1';
const encode=(key,value)=>value instanceof Set?{$set:[...value]}:value instanceof Map?{$map:[...value]}:value===Infinity?{$infinity:true}:value;
const decode=(key,value)=>value?.$set?new Set(value.$set):value?.$map?new Map(value.$map):value?.$infinity===true?Infinity:value;
export function clearRunSave(storage){return removeSavedValue(storage,RUN_SAVE_KEY);}
// Earlier Salvation versions absorbed the colored gems into the bow itself.
// Move that already earned set into the original Pink slot; no reward, healing
// or second weapon evolution is charged when an existing run is opened.
function restoreQuintetProgress(g){
 const p=g.p;
 if(g.mode!=='hardcore'&&p.id==='madoka'&&p.fusions.rosebow==='salvation'&&!hasQuintet(p)&&(p.weapons.rosebow||0)>=ITEMS.rosebow.max){
  const gems=SOUL_GEM_IDS.filter(id=>(p.passives[id]||0)>0);
  if(gems.length||Object.keys(p.passives).length<MAX_SLOTS){
   p.quintetPurified=p.quintetPurified===true||p.fusions.soulgem==='purifiedsoul'&&(p.passives.soulgem||0)>=ITEMS.soulgem.max;
   for(const id of SOUL_GEM_IDS){delete p.passives[id];delete p.fusions[id];delete p.cooldowns[id];}
   p.passives.quintet=ITEMS.quintet.max;p.fusions.quintet='quintet';refreshStats(p);
  }
 }
 const quintet=FUSIONS.find(f=>f.id==='quintet');
 const adapt=choice=>choice&&!choice.decision&&choice.kind==='fusion'&&choice.id==='salvation'&&!fusionReady(p,FUSIONS.find(f=>f.id==='salvation'))&&fusionReady(p,quintet)?{...choice,id:'quintet'}:choice;
 const adaptOffers=(choices,start=0)=>{
  let promised=hasQuintet(p);
  return choices.map((choice,index)=>{
   if(index<start||choice.decision)return choice;
   const next=promised?choice:adapt(choice);
   if(next?.kind==='fusion'&&next.id==='quintet')promised=true;
   return next;
  });
 };
 if(Array.isArray(g.levelChoices))g.levelChoices=g.levelChoices.map(adapt);
 if(Array.isArray(g.rewards))g.rewards=adaptOffers(g.rewards,g.chestIndex||0);
 for(const chest of g.chests||[])if(Array.isArray(chest.rewardOffers))chest.rewardOffers=adaptOffers(chest.rewardOffers);
}
function restoreRunMode(g,character){
 g.mode=['hardcore','bossrush','training'].includes(g.mode)?g.mode:'survival';
 if(g.mode==='training')restoreTraining(g);else delete g.training;
 if(g.mode!=='hardcore'){delete g.p.hardcore;delete g.p.signatureWeapons;delete g.p.signaturePassives;return;}
 initializeHardcore(g,character);const allowed=new Set(signatureWeaponIds(character)),passives=new Set(signaturePassiveIds(character));let removed=false;
 // Older Hardcore runs allowed other supports. Recover the hero's own maxed
 // passive if a now-disallowed support fusion had absorbed it into another slot.
 const ownPassive=character.passive;let ownRank=g.p.passives[ownPassive]||0;
 for(const fusion of FUSIONS)if(fusionType(fusion)==='passive'&&fusionConsumedIngredients(fusion).includes(ownPassive)&&g.p.fusions[fusionBase(fusion)]===fusion.id&&(g.p.passives[fusionBase(fusion)]||0)>=ITEMS[fusionBase(fusion)].max)ownRank=Math.max(ownRank,ITEMS[ownPassive].max);
 for(const id of Object.keys(g.p.passives))if(!passives.has(id)){delete g.p.passives[id];delete g.p.cooldowns[id];removed=true;}
 ownRank=Math.max(1,ownRank);if(g.p.passives[ownPassive]!==ownRank){g.p.passives[ownPassive]=ownRank;removed=true;}g.p.passive=ownPassive;
 for(const id of Object.keys(g.p.weapons))if(!allowed.has(id)){delete g.p.weapons[id];delete g.p.cooldowns[id];delete g.p.fusions[id];removed=true;}
 for(const [id,evolution]of Object.entries(g.p.fusions)){
  const fusion=FUSIONS.find(f=>f.id===evolution);
  if(!fusion||fusionBase(fusion)!==id||!hardcoreFusionAllowed(g.p,fusion)){delete g.p.fusions[id];removed=true;}
 }
 const shotWeapon={'requip-sword':'requip',longinus:'pallet',thunderspear:'odmblades',chimeragarden:'shadows',rasenflash:'shuriken',missile:'powerbeam',supermissile:'powerbeam'};
 g.shots=g.shots.filter(shot=>allowed.has(shot.sourceWeapon||shotWeapon[shot.type]||shot.type));
 g.fields=g.fields.filter(field=>allowed.has(field.sourceWeapon||field.kind));
 g.summons=(g.summons||[]).filter(s=>s.kind==='mahoraga'?character.id==='megumi':allowed.has(s.kind==='nue'?'nue':'shadows'));
 if(!allowed.has('crimson'))g.crimsonEchoes=[];
 // A forged or migrated mixed loadout must not retain foreign attacks in flight.
 if(removed){g.shots=[];g.fields=[];g.summons=[];g.crimsonEchoes=[];g.effects=[];if(g.garuda){g.garuda.inFlight=false;g.garuda.flightId=null;}refreshStats(g.p);}
 const legal=choice=>choice?.kind==='heal'||choice?.kind==='item'&&!!ITEMS[choice.id]&&!forbiddenItem(g.p,choice.id)&&!inactiveFormWeapon(g.p,choice.id)||choice?.kind==='fusion'&&FUSIONS.some(f=>f.id===choice.id&&hardcoreFusionAllowed(g.p,f))||choice?.kind==='bond'&&SOUL_GEM_IDS.includes(choice.id)&&(!choice.with||SOUL_GEM_IDS.includes(choice.with));
 if(g.levelChoices?.some(choice=>!legal(choice)))g.levelChoices=null;
 // A legacy fusion-only cache may have offered only a foreign passive fusion.
 // Preserve its reward opportunity without reopening an empty selection screen.
 if((g.status==='fusion'||g.status==='paused'&&g.resumeStatus==='fusion')&&!FUSIONS.some(f=>fusionReady(g.p,f))){if(g.status==='paused')g.resumeStatus='upgrade';else g.status='upgrade';g.levelChoices=null;}
 // Leave previously resolved chest entries as history; replace forbidden pending
 // rewards with recovery so an old chest can always be completed.
 g.rewards=(g.rewards||[]).map(choice=>choice.decision||legal(choice)?choice:{kind:'heal',id:'heal'});
}
export function saveRun(g,storage){
 if(!g||g.p.hp<=0||g.status==='over'){clearRunSave(storage);return false;}
 try{const snapshot={...g,world:{...g.world,active:[],circles:[]},particles:[],numbers:[],effects:[]};return writeSavedValue(storage,RUN_SAVE_KEY,JSON.stringify({version:1,run:snapshot},encode));}catch{return false;}
}
function parseRun(raw){
 try{
  const data=JSON.parse(raw||'null',decode),r=data?.run,character=CHARACTERS.find(c=>c.id===r?.p?.id),mapIndex=MAPS.findIndex(m=>m.id===r?.map?.id);
  if(data?.version!==1||!character||mapIndex<0||!Number.isFinite(r.time)||r.time<0||!Number.isFinite(r.p.hp)||r.p.hp<=0||!Number.isFinite(r.p.maxHp)||!Number.isFinite(r.p.x)||!Number.isFinite(r.p.y))return null;
  for(const [type,inventory]of [['weapon',r.p.weapons],['passive',r.p.passives]])if(!inventory||Object.keys(inventory).length>MAX_SLOTS||Object.entries(inventory).some(([id,n])=>ITEMS[id]?.type!==type||!Number.isInteger(n)||n<1||n>ITEMS[id].max))return null;
  if(!(r.world?.objects instanceof Map)||!(r.world.destroyed instanceof Set)||!Array.isArray(r.enemies)||!Array.isArray(r.shots)||r.shots.some(s=>s.hits&&!(s.hits instanceof Set)))return null;
  const base=createRun(character,mapIndex),g={...base,...r,map:MAPS[mapIndex],p:{...base.p,...r.p},events:r.events,world:{...base.world,...r.world,sceneryVersion:r.world.sceneryVersion||0,active:[],circles:[]}};
  restoreQuintetProgress(g);
  restoreRunMode(g,character);restoreTrinkets(g,r.trinkets);
  if(g.p.id==='denji'){g.mechanic={...base.mechanic,...r.mechanic,id:'denji',max:100,value:Math.max(0,Math.min(100,Number.isFinite(r.mechanic?.value)?r.mechanic.value:0))};}
  if(g.p.id==='guts'){g.p.form=g.ultimate?.type==='guts'?1:0;g.p.pose=g.p.form?'berserk':'';g.mechanic={...base.mechanic,...r.mechanic,id:'guts',max:100,value:Math.max(0,Math.min(100,Number.isFinite(r.mechanic?.value)?r.mechanic.value:0))};}
  if(!r.p.baseRulesVersion){g.p.baseRulesVersion=2;g.p.regen=(g.p.regen||0)+1;g.p.rerollsLeft=(g.p.rerollsLeft||0)+1;g.p.vanishesLeft=(g.p.vanishesLeft||0)+1;}
  if(g.p.id==='megumi'&&!g.p.weapons.nue&&!consumedFusionIngredient(g.p,'nue')&&Object.keys(g.p.weapons).length<MAX_SLOTS)g.p.weapons.nue=1;
  if(g.p.id!=='eren'||g.p.erenForm!=='titan'){delete g.p.weapons.titanfists;delete g.p.cooldowns.titanfists;if(g.p.id!=='eren')delete g.p.fusions.titanfists;g.fields=g.fields.filter(f=>f.source!=='titanfists');}
  if(g.p.id==='eren'){syncErenProgress(g.p);refreshStats(g.p);if(!r.p.erenRulesVersion&&g.p.form)g.p.shield=Math.min(g.p.maxShield,g.p.shield+45);g.p.erenRulesVersion=2;}
  if(r.p.shieldRulesVersion!==2)refreshStats(g.p);
  if(!r.chestVersion&&(r.status==='chest'||r.resumeStatus==='chest')){g.rewards=g.rewards.map(c=>({...c,decision:'taken'}));g.chestIndex=g.rewards.length;}g.chestVersion=2;
  for(const e of g.enemies)if(e.archetype==='cell'&&e.cellStage===undefined){e.cellStage=e.hp/e.maxHp<=1/3?2:e.hp/e.maxHp<=2/3?1:0;const phase=CELL_STAGES[e.cellStage];Object.assign(e,{name:phase.name,title:phase.title,r:phase.r,speed:e.speed*phase.speed});e.enraged=e.cellStage===2;}
  if(g.p.id==='yuki'&&!r.garuda)g.garuda=newGaruda(g);reconcileGaruda(g);
  const look=skinFor(character.id,r.p.skin);g.p.skin=look.id;g.p.name=character.name;g.p.color=character.color;g.p.displayName=look.pilot||character.name;g.p.unitName=look.unit||'';
  g.difficulty=difficultyFor(r.difficulty).id;if(!restoreBossRush(g))return null;
  g.secondarySpecialMax=Number.isFinite(r.secondarySpecialMax)&&r.secondarySpecialMax>0?r.secondarySpecialMax:75;
  g.secondarySpecial=Number.isFinite(r.secondarySpecial)?Math.max(0,Math.min(g.secondarySpecialMax,r.secondarySpecial)):0;
  restoreShenron(g);restoreRifts(g);restoreRiftTrial(g);restoreWorldEvents(g);syncGutsArmor(g);syncDenjiForm(g);clearOrphanRiftSummons(g);restoreBossDeaths(g);restorePersistentSummons(g);restoreFrierenGolem(g);restoreFriendlyDeaths(g);
  const pending=g.status==='paused'?(g.resumeStatus||'playing'):g.status;if(!['playing','upgrade','fusion','chest','rush-draft','rush-loadout','rush-fusion','trinket','wish','rift'].includes(pending))return null;
  g.resumeStatus=pending;g.status='paused';g.p.moving=false;g.invuln=Math.max(.8,g.invuln||0);ensureWorld(g);return g;
 }catch{return null;}
}

export function loadRun(storage){let run=null;readSavedValue(storage,RUN_SAVE_KEY,raw=>!!(run=parseRun(raw)));return run;}
