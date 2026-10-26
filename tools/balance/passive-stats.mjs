// Passive slot value from the game's own stat formulas: equip one passive (or passive
// fusion) at max rank on an empty loadout, run refreshStats and compare with no passives.
// Output: offense (damage × cooldown × √area), defence (effective HP incl. shield,
// resistance, dodge and twenty seconds of regen), mobility and pickup gains.
// usage: node passive-stats.mjs
const src=new URL('../../src',import.meta.url).href;
const G=await import(src+'/game.js');
const HERO='maomao';
function player(){const p=G.createPlayer(G.CHARACTERS.find(c=>c.id===HERO));p.weapons={};p.passives={};p.fusions={};G.refreshStats(p);return p;}
function profile(p){
 const offense=p.damage/p.cooldown*Math.sqrt(p.area);
 const pool=p.maxHp+p.maxShield*(10/p.shieldRecharge)*1.5+p.regen*20;
 const defence=pool/(1-p.damageReduction)/(1-p.dodge);
 return {offense,defence,ultimate:1/p.cooldown,move:p.move,magnet:p.magnet};
}
const base=profile(player());
const rows=[];
const passives=[...Object.entries(G.ITEMS).filter(([,i])=>i.type==='passive'&&!i.fusionOnly).map(([id])=>({id,fusion:null})),...G.FUSIONS.filter(f=>G.fusionType(f)==='passive').map(f=>({id:f.id,fusion:f}))];
for(const {id,fusion}of passives){
 const p=player();
 if(fusion){for(const ing of G.fusionIngredients(fusion)){const it=G.ITEMS[ing];if(it?.type==='passive'&&!it.fusionOnly)p.passives[ing]=it.max;}
  G.refreshStats(p);if(!G.applyChoice(p,{kind:'fusion',id})){rows.push({id,error:'not fusable'});continue;}}
 else p.passives[id]=G.ITEMS[id].max;
 G.refreshStats(p);const v=profile(p);
 // Slots used after fusing: a fusion frees ingredient slots, so its value is per slot actually occupied.
 const slots=Object.keys(p.passives).length||1;
 const gain=k=>v[k]/base[k]-1;
 // Cooldown passives also shorten the ultimate; that counts at 30% of weapon offense.
 const score=(gain("offense")*100+gain("defence")*60+gain("ultimate")*30+gain("move")*30+gain("magnet")*4)/slots;
 rows.push({id,slots,offense:+(gain('offense')*100).toFixed(1),defence:+(gain('defence')*100).toFixed(1),ultimate:+(gain('ultimate')*100).toFixed(1),move:+(gain('move')*100).toFixed(1),magnet:+(gain('magnet')*100).toFixed(1),score:+score.toFixed(1)});
}
rows.sort((a,b)=>(b.score??-1)-(a.score??-1));
for(const r of rows)console.log(JSON.stringify(r));
const fs=await import('fs');fs.mkdirSync(new URL('./results/',import.meta.url),{recursive:true});fs.writeFileSync(new URL('./results/passive-stats.json',import.meta.url),JSON.stringify(rows,null,1));
