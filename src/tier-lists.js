import {CHARACTERS,ITEMS,FUSIONS,fusionType} from './game.js';
import {ULTIMATES} from './ultimates.js';
import {FRIEREN_BARRAGE} from './frieren-barrage.js';
import {HERO_MECHANICS} from './hero-mechanics.js';
import {CHARACTER_RANKINGS,ULTIMATE_RANKINGS,WEAPON_RANKINGS,PASSIVE_RANKINGS} from './tier-rankings.js';
import {TIER_MEASUREMENTS} from './tier-measurements.js';

export const TIERS=[
 {id:'S',label:'Top pick',color:'#efacac',description:'Leads its category in the measured runs or offers unmatched control or safety. Strong in almost any build.'},
 {id:'A',label:'Strong',color:'#e6c18d',description:'Clearly above average, with one real limitation: setup time, positioning, a recipe or a narrower role.'},
 {id:'B',label:'Solid',color:'#b8d6a0',description:'Does its job, but a coverage, damage or safety gap means stronger options usually win the slot.'},
 {id:'C',label:'Niche',color:'#9bbbdc',description:'Weak on its own. Take it for a specific recipe, owner bonus or build plan.'},
];
export const TIER_CATEGORIES=[
 {id:'characters',label:'Characters',description:'The complete signature kit, unique mechanic and survival tools.',criteria:'Heroes are ranked from bot runs: six ten-minute Normal Survival runs per hero with natural levelling, HP refilled every tick so a run never ends early. Damage per second and kills measure clear speed; the share of the HP pool lost per minute in the second half measures how well the kit avoids or absorbs damage. Every hero is measured with both a kiting and a close-range bot and keeps the better result. Heroes are ranked on a composite of 60% damage and 40% survivability, each relative to the roster median.'},
 {id:'weapons',label:'Weapons',description:'Base weapons and evolved attacks, assessed at their maximum rank.',criteria:'Weapons are ranked by damage per second when equipped alone at maximum rank on the same neutral hero for three minutes, with levels frozen. Every weapon is measured with both a kiting and a close-range bot and keeps its better result. Signature weapons are also measured on their owner. Fusions are measured after obtaining them; recipe cost is called out separately.'},
 {id:'passives',label:'Passive items',description:'Support items and passive fusions, assessed at their maximum rank.',criteria:'Passives are ranked from the game’s own stat formulas: the gain in weapon offense, effective HP, ultimate uptime and movement from one slot. Composite fusions count once for the slot they occupy. Owner-only bonuses are described in the notes.'},
 {id:'ultimates',label:'Ultimates',description:'Primary and additional special abilities, assessed for damage, control and safety.',criteria:'Ultimates are ranked by design review: how much control, damage or safety one activation provides, counting charge delay, duration, positioning and projectile handling. Titan Shift is judged as a lasting form change. Frieren’s additional barrage has its own cooldown and is listed separately from her golem.'},
];
export const TIER_BASIS='Ranks are for Normal Survival with max-rank equipment, before mastery or prestige. Fusions are judged after acquisition. Skins share ranks. Measured numbers come from the balance tools in tools/balance and can be re-run after any balance change; synergy and other modes can change priorities.';
const categoryFor=id=>TIER_CATEGORIES.some(category=>category.id===id)?id:'characters';
const heroForOwner=owner=>CHARACTERS.find(hero=>hero.name===owner);
const clean=value=>String(value??'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLocaleLowerCase('en').trim();
const compare=(a,b)=>TIERS.findIndex(t=>t.id===a.tier)-TIERS.findIndex(t=>t.id===b.tier)||a.name.localeCompare(b.name,'en')||a.id.localeCompare(b.id,'en');
function heroEntry(hero,category){
 const ultimate=category==='ultimates',ability=ULTIMATES[hero.id],rating=(ultimate?ULTIMATE_RANKINGS:CHARACTER_RANKINGS)[hero.id];
 return {id:hero.id,category,name:ultimate?ability.name:hero.name,...rating,color:ultimate?ability.color:hero.color,kind:ultimate?'ultimate':'character',heroId:hero.id,evolved:false,owner:hero.name,series:hero.series,subtitle:ultimate?hero.name:hero.series,description:ultimate?ability.description:hero.description+' '+HERO_MECHANICS[hero.id].description,measured:ultimate?null:TIER_MEASUREMENTS.characters[hero.id]||null};
}
export function tierUltimateAbility(entry){return entry.id==='frieren-barrage'?FRIEREN_BARRAGE:ULTIMATES[entry.heroId||entry.id];}
function frierenBarrageEntry(){
 const hero=CHARACTERS.find(hero=>hero.id==='frieren');
 return {id:'frieren-barrage',category:'ultimates',name:FRIEREN_BARRAGE.name,tier:'A',
  reason:'One massive piercing blast concentrates powerful burst damage and clears hostile shots along a broad firing lane while the stone golem keeps fighting.',
  comparison:'It earns A because its concentrated barrage can punish a lined-up crowd or exposed boss without replacing the persistent golem. Its separate 75-second base cooldown adds another offensive window, but the 1.2-second charge and fixed aim make it less dependable as immediate rescue than the S control domains.',
  caution:'The 1.2-second charge and single fixed-aim blast reward anticipation; moving targets can leave the lane before release. Its own 75-second base cooldown limits repeated burst, and bosses still resist 20% of incoming damage.',
  bestWith:'Keep the golem fighting nearby, then start the barrage before a pack closes in. Slows, knockback or a controlled boss opening help enemies remain inside the broad blast path while the guardian and normal weapons continue attacking.',
  color:FRIEREN_BARRAGE.color,icon:FRIEREN_BARRAGE.icon,secondary:true,cooldown:FRIEREN_BARRAGE.cooldown,
  kind:'ultimate',heroId:hero.id,evolved:false,owner:hero.name,series:hero.series,subtitle:hero.name+' · SECOND ULTIMATE',description:FRIEREN_BARRAGE.description};
}
function itemEntry(id,item,category,evolved=false){
 const kind=category==='weapons'?'weapon':'passive',rating=(kind==='weapon'?WEAPON_RANKINGS:PASSIVE_RANKINGS)[id],base=evolved?ITEMS[item.weapon||item.passive]:item,owner=base?.owner||'',hero=heroForOwner(owner);
 return {id,category,name:item.name,...rating,color:item.color,kind,heroId:hero?.id,evolved,owner,series:hero?.series||item.series||base?.series||'',subtitle:evolved?(kind==='weapon'?'EVOLVED WEAPON':'PASSIVE FUSION'):(owner||'SHARED ITEM'),description:item.description,measured:TIER_MEASUREMENTS[category][id]||null};
}
export function tierEntries(category='characters'){
 category=categoryFor(category);
 if(category==='characters')return CHARACTERS.map(hero=>heroEntry(hero,category)).sort(compare);
 if(category==='ultimates')return [...CHARACTERS.map(hero=>heroEntry(hero,category)),frierenBarrageEntry()].sort(compare);
 const type=category==='weapons'?'weapon':'passive';
 return [...Object.entries(ITEMS).filter(([id,item])=>item.type===type&&(!item.fusionOnly||!FUSIONS.some(f=>f.id===id))).map(([id,item])=>itemEntry(id,item,category)),...FUSIONS.filter(item=>fusionType(item)===type).map(item=>itemEntry(item.id,item,category,true))].sort(compare);
}
export function filterTierEntries(category='characters',{query='',form='all'}={}){
 const needle=clean(query);
 return tierEntries(category).filter(entry=>(form!=='base'||!entry.evolved)&&(form!=='evolved'||entry.evolved)&&(!needle||clean([entry.name,entry.owner,entry.series,entry.reason,entry.comparison,entry.bestWith,entry.caution,entry.description,entry.subtitle].join(' ')).includes(needle)));
}
