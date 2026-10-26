import {CHARACTERS,ITEMS,FUSIONS,fusionType} from './game.js';
import {ULTIMATES} from './ultimates.js';
import {FRIEREN_BARRAGE} from './frieren-barrage.js';
import {HERO_MECHANICS} from './hero-mechanics.js';
import {CHARACTER_RANKINGS,ULTIMATE_RANKINGS,WEAPON_RANKINGS,PASSIVE_RANKINGS} from './tier-rankings.js';

export const TIERS=[
 {id:'S',label:'Exceptional',color:'#efacac',description:'Broad, dependable value with fewer conditions: strong coverage, safety or slot efficiency across many Survival builds.'},
 {id:'A',label:'Strong',color:'#e6c18d',description:'A strong choice with a meaningful gap: it may need positioning, time, a recipe or support to reach its best value.'},
 {id:'B',label:'Solid with support',color:'#b8d6a0',description:'Useful in the right build, but a coverage, recovery or reliability limit gives more flexible choices an advantage.'},
 {id:'C',label:'Specialist',color:'#9bbbdc',description:'A narrower role or lower stand-alone slot value. Its recipe or specific use can still make it the right pickup.'},
];
export const TIER_CATEGORIES=[
 {id:'characters',label:'Characters',description:'The complete signature kit, unique mechanic and survival tools.',criteria:'Characters are compared by how reliably their own kit clears crowds, stays alive and reaches its stronger mechanics while moving through a normal run.'},
 {id:'weapons',label:'Weapons',description:'Base weapons and evolved attacks, assessed at their maximum rank.',criteria:'Weapons are compared by targeting reliability, crowd coverage, control and useful reach. A fusion is assessed after obtaining it; recipe investment is called out separately.'},
 {id:'passives',label:'Passive items',description:'Support items and passive fusions, assessed at their maximum rank.',criteria:'Passives are compared by what one of five support slots buys: broad damage or cooldown value, dependable survival, useful collection, and the strength of their matching recipes.'},
 {id:'ultimates',label:'Ultimates',description:'Primary and additional special abilities, assessed for damage, control and safety.',criteria:'Ultimates are compared by how much useful damage, control or safety an activation provides, including charge delay, duration, positioning, cooldown and projectile handling. Titan Shift is evaluated as a lasting form change. Frieren’s additional barrage has its own cooldown and is listed separately from her golem.'},
];
export const TIER_BASIS='Suggested tiers for Normal Survival with max-rank equipment, before mastery or prestige. Fusions are judged after acquisition. Skins share ranks; synergy and other modes can change priorities.';
const categoryFor=id=>TIER_CATEGORIES.some(category=>category.id===id)?id:'characters';
const heroForOwner=owner=>CHARACTERS.find(hero=>hero.name===owner);
const clean=value=>String(value??'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLocaleLowerCase('en').trim();
const compare=(a,b)=>TIERS.findIndex(t=>t.id===a.tier)-TIERS.findIndex(t=>t.id===b.tier)||a.name.localeCompare(b.name,'en')||a.id.localeCompare(b.id,'en');
function heroEntry(hero,category){
 const ultimate=category==='ultimates',ability=ULTIMATES[hero.id],rating=(ultimate?ULTIMATE_RANKINGS:CHARACTER_RANKINGS)[hero.id];
 return {id:hero.id,category,name:ultimate?ability.name:hero.name,...rating,color:ultimate?ability.color:hero.color,kind:ultimate?'ultimate':'character',heroId:hero.id,evolved:false,owner:hero.name,series:hero.series,subtitle:ultimate?hero.name:hero.series,description:ultimate?ability.description:hero.description+' '+HERO_MECHANICS[hero.id].description};
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
 return {id,category,name:item.name,...rating,color:item.color,kind,heroId:hero?.id,evolved,owner,series:hero?.series||item.series||base?.series||'',subtitle:evolved?(kind==='weapon'?'EVOLVED WEAPON':'PASSIVE FUSION'):(owner||'SHARED ITEM'),description:item.description};
}
export function tierEntries(category='characters'){
 category=categoryFor(category);
 if(category==='characters')return CHARACTERS.map(hero=>heroEntry(hero,category)).sort(compare);
 if(category==='ultimates')return [...CHARACTERS.map(hero=>heroEntry(hero,category)),frierenBarrageEntry()].sort(compare);
 const type=category==='weapons'?'weapon':'passive';
 return [...Object.entries(ITEMS).filter(([,item])=>item.type===type&&!item.fusionOnly).map(([id,item])=>itemEntry(id,item,category)),...FUSIONS.filter(item=>fusionType(item)===type).map(item=>itemEntry(item.id,item,category,true))].sort(compare);
}
export function filterTierEntries(category='characters',{query='',form='all'}={}){
 const needle=clean(query);
 return tierEntries(category).filter(entry=>(form!=='base'||!entry.evolved)&&(form!=='evolved'||entry.evolved)&&(!needle||clean([entry.name,entry.owner,entry.series,entry.reason,entry.comparison,entry.bestWith,entry.caution,entry.description,entry.subtitle].join(' ')).includes(needle)));
}
