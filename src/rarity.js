import {ITEMS,FUSIONS} from './game.js';
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
// Every ordinary item is Common. Fusions are graded by hand on how hard they are to
// assemble (maxed ingredients, multi-stage chains, form locks) and how strong they are.
export const FUSION_RARITY={
 // Four or five maxed items in one slot, or a second evolution built on them.
 sageregalia:'mythic',chozosuit:'mythic',witcharchive:'mythic',quintet:'mythic',
 philosopherstone:'mythic',piratelegacy:'mythic',hinokami:'mythic',gateoftruth:'mythic',gearfifth:'mythic',transparentworld:'mythic',
 // Half-built set bonds.
 stonebond:'legendary',crewbond:'legendary',breathbond:'legendary',
salvation:'mythic',purple:'mythic',chimeragarden:'mythic',
 // Signature finishers and three-item weapon fusions.
 rasenflash:'legendary',kamehameha:'legendary',heavensarsenal:'legendary',berserkeredge:'legendary',chainsawoverdrive:'legendary',ultimate:'legendary',beelzebub:'legendary',positron:'legendary',fatalforecast:'legendary',zafkiel:'legendary',titanquake:'legendary',
 // Solid weapon evolutions.
 raijinrasengan:'epic',dragonroar:'epic',wisteriagarden:'epic',scoutassault:'epic',starcrusher:'epic',stormnue:'epic',totality:'epic',ancientmagic:'epic',plasmabeam:'epic',icecrown:'epic',finalchapter:'epic',rasen:'epic',tempest:'epic',
 // Stat-only passive fusions and evolutions from shared basic items.
 purifiedsoul:'rare',sagecodex:'rare',panaceapouch:'rare',adaptivebarrier:'rare',elixir:'rare',raijin:'rare',galaxy:'rare',
};
export function rarityFor(id){
 const f=FUSIONS.find(f=>f.id===id);
 if(f)return byId[FUSION_RARITY[f.id]||'epic'];
 const item=ITEMS[id];if(!item)return null;
 // A fusion-only result item shares the rarity of the fusion that creates it.
 if(item.fusionOnly){const maker=FUSIONS.find(f=>f.resultItem===id);return byId[FUSION_RARITY[maker?.id]||FUSION_RARITY[id]||'mythic'];}
 return byId.common;
}
export function rarityBadge(id){const r=rarityFor(id);return r?`<span class="rarity-badge rarity-${r.id}" style="--rarity:${r.color}">${r.name.toUpperCase()}</span>`:'';}
export function rarityAttrs(id){const r=rarityFor(id);return r?`data-rarity="${r.id}" style="--rarity:${r.color};`:'style="';}
