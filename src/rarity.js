import {ITEMS,FUSIONS,fusionIngredients} from './game.js';
// Decorative quality tiers for items and fusions. They only change how an item is
// framed and labelled; no stat, drop chance or offer weighting reads them.
export const RARITIES=[
 {id:'common',name:'Common',color:'#b9c2cf'},
 {id:'rare',name:'Rare',color:'#5ea9f2'},
 {id:'epic',name:'Epic',color:'#b37cf2'},
 {id:'legendary',name:'Legendary',color:'#f2b64a'},
 {id:'mythic',name:'Mythic',color:'#f26c8e'},
];
const byId=Object.fromEntries(RARITIES.map(r=>[r.id,r]));
// The basic shared pool every hero can roll.
const BASIC=new Set(['magnet','scroll','power','kunai','lightning','orbit']);
export function rarityFor(id){
 const f=FUSIONS.find(f=>f.id===id);
 if(f)return byId[f.resultItem||f.requiresEvolution||fusionIngredients(f).length>=3?'mythic':'legendary'];
 const item=ITEMS[id];if(!item)return null;
 if(item.fusionOnly)return byId.mythic;
 if(item.owner)return byId[item.type==='weapon'?'epic':'rare'];
 return byId[BASIC.has(id)?'common':'rare'];
}
export function rarityBadge(id){const r=rarityFor(id);return r?`<span class="rarity-badge rarity-${r.id}" style="--rarity:${r.color}">${r.name.toUpperCase()}</span>`:'';}
export function rarityAttrs(id){const r=rarityFor(id);return r?`data-rarity="${r.id}" style="--rarity:${r.color};`:'style="';}
