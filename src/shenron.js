import {ITEMS,FUSIONS,fusionType,fusionBase,fusionConsumedIngredients,consumedFusionIngredient,forbiddenItem,inactiveFormWeapon,applyChoice,refreshStats} from './game.js';
import {syncErenProgress} from './eren-progress.js';

export const SHENRON_BOOST={damage:.2,move:.1,hp:.2,regen:1};
export const newWish=()=>({summoned:false,pending:false,granted:null,evolutionId:null,upgrades:[]});
const canChoose=g=>g.status==='wish'&&!g.bossIntro&&g.trinkets?.wish?.pending===true&&!g.trinkets.wish.granted;
export function summonShenron(g){
 const wish=g.trinkets.wish??=newWish();if(wish.summoned)return false;
 wish.summoned=true;wish.pending=true;g.status='wish';g.p.moving=false;return true;
}
export function wishEvolutions(g){
 const p=g.p;
 return FUSIONS.filter(f=>!f.requiresEvolution&&fusionType(f)==='weapon'&&p.weapons[f.weapon]&&!p.fusions[f.weapon]&&!consumedFusionIngredient(p,f.weapon)&&!forbiddenItem(p,f.weapon)&&!inactiveFormWeapon(p,f.weapon)&&(!f.weapon2||!p.fusions[f.weapon2]))
  .map(f=>({id:f.id,weaponId:f.weapon,name:f.name,weaponName:ITEMS[f.weapon].name,color:f.color,description:f.description}));
}
export function wishUpgradeCandidates(g){
 const p=g.p;return ['weapons','passives'].flatMap(type=>Object.keys(p[type]).filter(id=>ITEMS[id]&&p[type][id]<ITEMS[id].max&&!p.fusions[id]&&!consumedFusionIngredient(p,id)&&!forbiddenItem(p,id)&&!inactiveFormWeapon(p,id)).map(id=>({kind:'item',id,level:p[type][id]+1})));
}
export function wishOptions(g){
 return [
  {id:'evolution',name:'Awaken My Weapon',description:'Choose one of your unevolved weapons to evolve instantly. Item levels and recipe ingredients are not required.',available:wishEvolutions(g).length>0},
  {id:'levels',name:'Unlock My Potential',description:'Gain up to five random levels across weapons and passives you already own. Each item keeps its normal level cap.',available:wishUpgradeCandidates(g).length>0},
  {id:'stats',name:'Grant Me Strength',description:'+20% weapon damage, +10% movement speed, +20% max HP and +1 HP/s regeneration for the rest of this run.',available:true},
 ];
}
function forceEvolution(g,id){
 const option=wishEvolutions(g).find(f=>f.id===id);if(!option)return false;
 const f=FUSIONS.find(f=>f.id===id),p=g.p,oldMax=p.maxHp,oldShield=p.maxShield;
 p.weapons[f.weapon]=ITEMS[f.weapon].max;p.fusions[f.weapon]=id;p.shenronEvolution=id;
 for(const consumed of fusionConsumedIngredients(f)){delete (ITEMS[consumed].type==='weapon'?p.weapons:p.passives)[consumed];delete p.cooldowns[consumed];}
 if(p.id==='eren'&&['odmblades','titanfists'].includes(f.weapon)){p.sharedFormRank=5;p.formWeapons={odmblades:5,titanfists:5};}
 syncErenProgress(p);refreshStats(p);p.hp=Math.min(p.maxHp,p.hp+Math.max(0,p.maxHp-oldMax));p.shield=Math.min(p.maxShield,p.shield+Math.max(0,p.maxShield-oldShield));
 return {kind:'evolution',evolutionId:id,weaponId:f.weapon};
}
export function resolveWish(g,kind,choiceId=null,random=Math.random){
 if(!canChoose(g)||!wishOptions(g).some(option=>option.id===kind&&option.available))return false;
 let result;
 if(kind==='evolution'){result=forceEvolution(g,choiceId);if(!result)return false;}
 else if(kind==='levels'){
  const upgrades=[];for(let i=0;i<5;i++){const candidates=wishUpgradeCandidates(g);if(!candidates.length)break;const roll=Number(random()),index=Math.max(0,Math.min(candidates.length-1,Math.floor((Number.isFinite(roll)?roll:0)*candidates.length))),choice=candidates[index];if(applyChoice(g.p,choice))upgrades.push({id:choice.id,level:choice.level});}
  if(!upgrades.length)return false;result={kind:'levels',upgrades};
 }else if(kind==='stats'){
  const oldMax=g.p.maxHp;g.p.shenronBlessing=true;refreshStats(g.p);g.p.hp=Math.min(g.p.maxHp,g.p.hp+Math.max(0,g.p.maxHp-oldMax));result={kind:'stats'};
 }else return false;
 const wish=g.trinkets.wish;wish.pending=false;wish.summoned=true;wish.granted=kind;wish.evolutionId=result.evolutionId||null;wish.upgrades=result.upgrades||[];
 g.status='playing';g.invuln=Math.max(g.invuln||0,1.5);g.levelChoices=null;g.toast='SHENRON · '+(kind==='stats'?'STRENGTH GRANTED':kind==='levels'?result.upgrades.length+' EQUIPMENT LEVELS GRANTED':'WEAPON AWAKENED');g.toastTime=4;return result;
}
export function normalizeWish(raw){
 const wish=newWish(),granted=['evolution','levels','stats'].includes(raw?.granted)?raw.granted:null;
 wish.summoned=raw?.summoned===true||!!granted||raw?.pending===true;wish.pending=wish.summoned&&!granted&&raw?.pending===true;wish.granted=granted;
 wish.evolutionId=granted==='evolution'&&FUSIONS.some(f=>f.id===raw.evolutionId&&fusionType(f)==='weapon')?raw.evolutionId:null;
 wish.upgrades=granted==='levels'&&Array.isArray(raw.upgrades)?raw.upgrades.slice(0,5).filter(u=>ITEMS[u?.id]&&Number.isInteger(u.level)&&u.level>=1&&u.level<=ITEMS[u.id].max).map(u=>({id:u.id,level:u.level})):[];
 return wish;
}
export function restoreShenron(g){
 const wish=g.trinkets.wish;
 g.p.shenronBlessing=wish.granted==='stats';
 const evolution=FUSIONS.find(f=>f.id===wish.evolutionId);
 g.p.shenronEvolution=evolution&&g.p.fusions[fusionBase(evolution)]===evolution.id?evolution.id:null;
 refreshStats(g.p);
 if(wish.pending){if(g.status==='paused')g.resumeStatus='wish';else g.status='wish';}
 else if(g.status==='wish')g.status='playing';else if(g.status==='paused'&&g.resumeStatus==='wish')g.resumeStatus='playing';
}
