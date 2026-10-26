import {ITEMS,FUSIONS,CHARACTERS,fusionIngredients,fusionBase,fusionType} from './game.js';

// Cards for the turn-based Ascent, built from the existing items. Weapons become
// Attacks (single, all-enemy, multi-hit, heavy or summon Powers) and passives become
// Skills and Powers, both read from each item's own description. Every fusion recipe
// becomes a rare card that merges its ingredients' effects.
const hash=s=>[...s].reduce((h,c)=>Math.imul(h^c.charCodeAt(0),16777619)>>>0,2166136261);
const has=(d,re)=>re.test(d);
// Status riders an item's description implies, in priority order.
function riders(d,{aoe,owner}){
 const out=[],all=aoe?'all':'enemy';
 if(has(d,/poison|toxic/))out.push({op:'apply',status:'poison',value:3,target:all});
 else if(has(d,/bleed/))out.push({op:'apply',status:'bleed',value:3,target:all});
 else if(has(d,/burn|flame|fire/))out.push({op:'apply',status:'burn',value:3,target:all});
 if(has(d,/curse/))out.push({op:'apply',status:'vulnerable',value:1,target:all});
 else if(has(d,/slow|freez|frozen/))out.push({op:'apply',status:'weak',value:1,target:all});
 if(has(d,/stun/)&&owner)out.push({op:'apply',status:'stun',value:1,target:'enemy'});
 else if(has(d,/stun/))out.push({op:'apply',status:'weak',value:1,target:all});
 return out.slice(0,2);
}
function weaponCard(id,item){
 const d=item.description.toLowerCase(),h=hash(id),owner=!!item.owner;
 const heavy=has(d,/massive|crushing|heavy|slab|giant/);
 const summon=has(d,/summon|divine dogs|shikigami|orbiting|circles/);
 const multi=!summon&&has(d,/homing|bolts|burst|three-round|ricochet|quills|arrows|knives|shots|volley|fast/);
 const aoe=!summon&&!multi&&has(d,/cone|arc|multiple|pierc|jumps|fan|circle|vortex|explod|sweep|cleave|through/);
 const push=has(d,/knock|push|pull/),shield=has(d,/shield|guard/);
 let effects,cost=heavy?2:1,type='attack',target='enemy';
 if(summon){type='power';target='self';effects=[{op:'power',power:'turret',value:owner?5:4}];}
 else if(multi)effects=[{op:'damage',value:3+(h%2)+(owner?1:0),times:3}];
 else if(aoe){target='all';effects=[{op:'damageAll',value:(heavy?11:6)+(owner?1:0)+(push?1:0)}];}
 else effects=[{op:'damage',value:(heavy?17:8)+(owner?2:0)+(push?2:0)}];
 if(!summon)effects.push(...riders(d,{aoe:target==='all',owner}));
 if(shield)effects.push({op:'block',value:4});
 return {id,item:id,name:item.name,type,cost,target,effects,rarity:owner?'uncommon':'common',owner:item.owner||null};
}
function passiveCard(id,item){
 const d=item.description.toLowerCase(),owner=!!item.owner;
 const dmg=has(d,/damage/)&&!has(d,/damage resistance/)||has(d,/weapon damage/),hp=has(d,/max(imum)? hp/),regen=has(d,/regen|hp\/s|restore|food healing/),cd=has(d,/cooldown/),shield=has(d,/shield/),dodge=has(d,/dodge|move/),area=has(d,/area/),resist=has(d,/resistance/);
 let type='skill',cost=1,target='self',effects;
 if(id==='senzu'){effects=[{op:'heal',value:9}];return {id,item:id,name:item.name,type,cost:1,target,effects,exhaust:true,rarity:'uncommon',owner:item.owner||null};}
 if(id==='eyes'){effects=[{op:'energy',value:2},{op:'draw',value:1}];return {id,item:id,name:item.name,type,cost:0,target,effects,exhaust:true,rarity:'uncommon',owner:item.owner||null};}
 if(dmg&&!hp&&!regen&&!shield){type='power';effects=[{op:'power',power:'strength',value:has(d,/12%|all weapon damage/)?2:1}];}
 else if(shield)effects=[{op:'block',value:owner?10:9}];
 else if(regen){type='power';effects=[{op:'power',power:'regen',value:2}];}
 else if(hp||resist){type='power';effects=[{op:'power',power:'plated',value:3}];}
 else if(cd)effects=[{op:'draw',value:2}];
 else if(dodge){type='power';effects=[{op:'power',power:'dexterity',value:1}];}
 else if(area){target='all';effects=[{op:'apply',status:'vulnerable',value:1,target:'all'},{op:'draw',value:1}];}
 else effects=[{op:'energy',value:1},{op:'draw',value:1}];
 // A second listed bonus becomes a small extra effect.
 if(type==='power'&&dmg&&effects[0].power!=='strength')effects.push({op:'power',power:'strength',value:1});
 else if(type==='skill'&&cd&&effects[0].op!=='draw')effects.push({op:'draw',value:1});
 else if(type==='skill'&&(hp||resist)&&effects[0].op!=='block')effects.push({op:'block',value:4});
 return {id,item:id,name:item.name,type,cost,target,effects,rarity:owner?'uncommon':'common',owner:item.owner||null};
}
const scaleEffects=(effects,k)=>effects.map(e=>e.value!=null?{...e,value:Math.max(e.value+1,Math.round(e.value*k))}:{...e});
function mergeEffects(list){
 // Same-kind effects add together so a merged card stays readable.
 const out=[];for(const e of list){const same=out.find(o=>o.op===e.op&&o.power===e.power&&o.status===e.status&&o.target===e.target&&(o.times||1)===(e.times||1));if(same)same.value+=e.value;else out.push({...e});}
 for(const e of out){if(e.op==='draw')e.value=Math.min(e.value,3);if(e.op==='energy')e.value=Math.min(e.value,2);}
 return out;
}
// An ingredient that is itself a fusion's result (the evolved weapon, the Quintet)
// is that fusion's card.
const resultOf=id=>FUSIONS.find(o=>o.resultItem===id);
const fusionCardIngredients=f=>fusionIngredients(f).map(id=>id===fusionBase(f)&&f.requiresEvolution?'fusion:'+f.requiresEvolution:ITEMS[id]?.fusionOnly&&resultOf(id)?'fusion:'+resultOf(id).id:id);
function fusionCard(f,lib){
 const parts=fusionCardIngredients(f).map(id=>lib[id]).filter(Boolean);
 const weapon=parts.find(c=>c.type==='attack')||parts.find(c=>c.effects.some(e=>e.power==='turret'));
 let card;
 if(weapon&&fusionType(f)==='weapon'){
  const extra=parts.filter(c=>c!==weapon).flatMap(c=>c.effects.filter(e=>e.op==='apply'||e.op==='block'||e.op==='power'&&e.power==='strength'));
  card={type:weapon.type,cost:weapon.cost,target:weapon.target,effects:mergeEffects([...scaleEffects(weapon.effects,1.6),...extra])};
 }else{
  const effects=mergeEffects(scaleEffects(parts.flatMap(c=>c.effects),1.25));
  const power=effects.some(e=>e.op==='power');
  card={type:power?'power':'skill',cost:Math.min(2,Math.max(1,Math.ceil(effects.length/2))),target:effects.some(e=>e.target==='all'&&e.op!=='power')?'all':'self',effects};
 }
 const text=(f.description||'').includes('→')?f.description.split('→').slice(1).join('→').trim():'';
 return {id:'fusion:'+f.id,item:f.resultItem||f.id,icon:f.id,name:f.name,...card,rarity:'rare',fusion:f.id,ingredients:parts.map(c=>c.id),required:f.requiredCharacter||null,flavor:text};
}
function buildLibrary(){
 const lib={
  strike:{id:'strike',item:null,icon:'arrow',name:'Strike',type:'attack',cost:1,target:'enemy',effects:[{op:'damage',value:6}],rarity:'starter'},
  guard:{id:'guard',item:null,icon:'requip',name:'Guard',type:'skill',cost:1,target:'self',effects:[{op:'block',value:5}],rarity:'starter'},
  regret:{id:'regret',item:null,icon:'regret',name:'Regret',type:'curse',cost:null,target:'self',effects:[],rarity:'curse',unplayable:true,text:'Unplayable. A curse from a pact or an idol.'},
 };
 for(const [id,item]of Object.entries(ITEMS)){if(item.fusionOnly)continue;lib[id]=item.type==='weapon'?weaponCard(id,item):passiveCard(id,item);}
 // Fusions in dependency order, so an evolution can build on its earlier fusion card.
 const pending=[...FUSIONS];for(let guard=0;pending.length&&guard<10;guard++)for(let i=pending.length-1;i>=0;i--){const f=pending[i];if(fusionCardIngredients(f).some(id=>id.startsWith('fusion:')&&!lib[id]))continue;lib['fusion:'+f.id]=fusionCard(f,lib);pending.splice(i,1);}
 return lib;
}
export const CARD_LIBRARY=buildLibrary();
export const cardDef=id=>CARD_LIBRARY[id]||null;

// Upgrades (+) raise every number by about a third (at least 1); 2-cost Powers drop to 1.
export function cardStats(id,up=false){
 const c=cardDef(id);if(!c)return null;if(!up)return c;
 return {...c,cost:c.type==='power'&&c.cost>1?c.cost-1:c.cost,effects:c.effects.map(e=>e.value!=null?{...e,value:e.value+Math.max(1,Math.round(e.value*.34))}:{...e}),upgraded:true};
}
const statusName={poison:'Poison',bleed:'Bleed',burn:'Burn',vulnerable:'Vulnerable',weak:'Weak',stun:'Stun'};
const powerText={turret:v=>`At the end of your turn, deal ${v} damage to a random enemy.`,strength:v=>`Gain ${v} Strength.`,regen:v=>`At the end of your turn, heal ${v} HP.`,plated:v=>`At the end of your turn, gain ${v} Block.`,dexterity:v=>`Gain ${v} Dexterity.`};
export function effectText(e){
 if(e.op==='damage')return e.times>1?`Deal ${e.value} damage ${e.times} times.`:`Deal ${e.value} damage.`;
 if(e.op==='damageAll')return `Deal ${e.value} damage to ALL enemies.`;
 if(e.op==='block')return `Gain ${e.value} Block.`;
 if(e.op==='apply')return `Apply ${e.value} ${statusName[e.status]}${e.target==='all'?' to ALL enemies':''}.`;
 if(e.op==='draw')return `Draw ${e.value} card${e.value===1?'':'s'}.`;
 if(e.op==='energy')return `Gain ${e.value} Energy.`;
 if(e.op==='heal')return `Heal ${e.value} HP.`;
 if(e.op==='power')return powerText[e.power]?.(e.value)||'';
 return '';
}
export function cardText(id,up=false){const c=cardStats(id,up);if(!c)return '';if(c.text)return c.text;return [...c.effects.map(effectText),c.exhaust?'Exhaust.':''].filter(Boolean).join(' ');}
export const cardIcon=id=>{const c=cardDef(id);return c?.icon||c?.item||'arrow';};

// Reward pools: a hero's own items are three times as likely to appear.
export function cardPool(rarity,heroId){
 const hero=CHARACTERS.find(c=>c.id===heroId),own=new Set([hero?.weapon,hero?.passive,hero?.secondWeapon,hero?.formWeapon].filter(Boolean));
 const allowed=c=>c.rarity===rarity&&(!c.required||c.required===heroId)&&(!['titanfists','odmblades'].includes(c.id)||heroId==='eren');
 return Object.values(CARD_LIBRARY).filter(allowed).flatMap(c=>own.has(c.id)?[c.id,c.id,c.id]:[c.id]);
}
export function starterDeck(heroId){
 const hero=CHARACTERS.find(c=>c.id===heroId)||CHARACTERS[0];
 const signature=[hero.weapon,hero.secondWeapon||hero.passive].filter(id=>CARD_LIBRARY[id]);
 return [...Array(5).fill('strike'),...Array(4).fill('guard'),...signature];
}
// Recipes the forge can complete: every ingredient card is in the deck.
export function forgeableFusions(deck,heroId){
 const ids=deck.map(c=>c.id);
 return Object.values(CARD_LIBRARY).filter(c=>c.fusion&&(!c.required||c.required===heroId)&&c.ingredients.length&&c.ingredients.every(id=>ids.includes(id))&&!ids.includes(c.id));
}
