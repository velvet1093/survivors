import test from 'node:test';
import assert from 'node:assert/strict';
import {CHARACTERS,ITEMS,FUSIONS,fusionType} from '../src/game.js';
import {ULTIMATES} from '../src/ultimates.js';
import {FRIEREN_BARRAGE} from '../src/frieren-barrage.js';
import {createRun} from '../src/engine.js';
import {TIER_CATEGORIES,TIERS,TIER_BASIS,tierEntries,filterTierEntries,tierUltimateAbility} from '../src/tier-lists.js';
import {CHARACTER_RANKINGS,ULTIMATE_RANKINGS,WEAPON_RANKINGS,PASSIVE_RANKINGS} from '../src/tier-rankings.js';

const ids=entries=>new Set(entries.map(entry=>entry.id));
const expectedItems=type=>new Set([...Object.entries(ITEMS).filter(([,item])=>item.type===type).map(([id])=>id),...FUSIONS.filter(item=>fusionType(item)===type).map(item=>item.id)]);

test('tier lists cover every current hero, primary and secondary ultimate, weapon and passive, including all fusions',()=>{
 assert.deepEqual(TIER_CATEGORIES.map(category=>category.id),['characters','weapons','passives','ultimates']);
 assert.deepEqual(ids(tierEntries('characters')),new Set(CHARACTERS.map(hero=>hero.id)));
 assert.deepEqual(ids(tierEntries('ultimates')),new Set([...Object.keys(ULTIMATES),'frieren-barrage']));
 assert.equal(tierEntries('ultimates').length,CHARACTERS.length+1);
 assert.deepEqual(ids(tierEntries('weapons')),expectedItems('weapon'));
 assert.deepEqual(ids(tierEntries('passives')),expectedItems('passive'));
 for(const category of TIER_CATEGORIES){const entries=tierEntries(category.id);assert.equal(ids(entries).size,entries.length,category.id+' unique IDs');}
 assert.deepEqual(Object.keys(CHARACTER_RANKINGS).sort(),CHARACTERS.map(hero=>hero.id).sort());
 assert.deepEqual(Object.keys(ULTIMATE_RANKINGS).sort(),Object.keys(ULTIMATES).sort());
 assert.deepEqual(new Set(Object.keys(WEAPON_RANKINGS)),expectedItems('weapon'));
 assert.deepEqual(new Set(Object.keys(PASSIVE_RANKINGS)),expectedItems('passive'));
});

test('each placement has readable, grounded context, a valid tier and current names and artwork metadata',()=>{
 const allowed=new Set(TIERS.map(tier=>tier.id));assert.deepEqual([...allowed],['S','A','B','C']);
 assert.match(TIER_BASIS,/Normal Survival/);assert.match(TIER_BASIS,/before mastery or prestige/);assert.match(TIER_BASIS,/Skins share ranks/);
 for(const category of TIER_CATEGORIES)for(const entry of tierEntries(category.id)){
  assert.ok(allowed.has(entry.tier),entry.id+' tier');
  for(const key of ['name','reason','comparison','caution','bestWith','description'])assert.ok(typeof entry[key]==='string'&&entry[key].length>(key==='name'?0:5),entry.id+' '+key);
  assert.ok(entry.reason.length>35,entry.id+' meaningful explanation');assert.ok(entry.caution.length>25,entry.id+' useful tradeoff');
  assert.match(entry.color,/^#[a-f\d]{6}$/i);assert.equal(entry.category,category.id);
  assert.equal(typeof entry.evolved,'boolean');
  if(entry.kind==='character'||entry.kind==='ultimate')assert.ok(CHARACTERS.some(hero=>hero.id===entry.heroId));
  else assert.equal(entry.name,(ITEMS[entry.id]||FUSIONS.find(fusion=>fusion.id===entry.id)).name);
 }
 const all=TIER_CATEGORIES.flatMap(category=>tierEntries(category.id));assert.ok(allowed.size===new Set(all.map(entry=>entry.tier)).size,'rankings use all four bands');
});

test('primary and secondary ultimate entries use actual ability titles while preserving their hero and series for discovery',()=>{
 for(const entry of tierEntries('ultimates')){
  const hero=CHARACTERS.find(hero=>hero.id===entry.heroId);
  const ability=tierUltimateAbility(entry);assert.equal(entry.name,ability.name);assert.equal(entry.description,ability.description);assert.equal(entry.owner,hero.name);assert.equal(entry.series,hero.series);
 }
 assert.match(tierEntries('ultimates').find(entry=>entry.id==='frieren').name,/Golem/);
 assert.match(tierEntries('ultimates').find(entry=>entry.id==='eren').caution,/form switch/);
 assert.match(tierEntries('ultimates').find(entry=>entry.id==='yuki').caution,/two seconds/);
 assert.match(tierEntries('ultimates').find(entry=>entry.id==='diavolo').caution,/weapon casts pause/);
});

test('Frieren’s additional barrage has its own A-tier explanation, identity, artwork and discovery without replacing the golem',()=>{
 const entries=filterTierEntries('ultimates',{query:'Frieren'}),barrage=entries.find(entry=>entry.id==='frieren-barrage'),golem=entries.find(entry=>entry.id==='frieren');
 assert.equal(entries.length,2);assert.ok(golem);assert.equal(barrage.heroId,'frieren');assert.equal(barrage.secondary,true);assert.equal(barrage.icon,'annihilationbarrage');assert.equal(barrage.tier,'A');assert.equal(barrage.cooldown,75);assert.strictEqual(tierUltimateAbility(barrage),FRIEREN_BARRAGE);assert.strictEqual(tierUltimateAbility(golem),ULTIMATES.frieren);
 assert.match(barrage.comparison,/1\.2-second charge/);assert.match(barrage.comparison,/separate 75-second/);assert.match(barrage.caution,/single fixed-aim blast/);assert.match(barrage.caution,/20%/);assert.match(barrage.bestWith,/golem fighting/);
 assert.ok(filterTierEntries('ultimates',{query:'Annihilation'}).some(entry=>entry.id==='frieren-barrage'));assert.ok(filterTierEntries('ultimates',{query:'SECOND ULTIMATE'}).some(entry=>entry.id==='frieren-barrage'));
 assert.equal(Object.keys(ULTIMATES).length,CHARACTERS.length);assert.equal(Object.keys(ULTIMATE_RANKINGS).length,CHARACTERS.length);assert.equal(ULTIMATES['frieren-barrage'],undefined);assert.equal(ULTIMATE_RANKINGS['frieren-barrage'],undefined);
});

test('search matches names, owners, series, mechanics and recipe ingredients without evaluating query patterns',()=>{
 assert.deepEqual(filterTierEntries('ultimates',{query:' NARUTO '}).map(entry=>entry.id),['naruto']);
 assert.ok(filterTierEntries('weapons',{query:'JUJUTSU KAISEN'}).some(entry=>entry.id==='garuda'));
 assert.ok(filterTierEntries('weapons',{query:'six eyes'}).some(entry=>entry.id==='purple'));
 assert.ok(filterTierEntries('characters',{query:'Authority'}).some(entry=>entry.id==='featherine'));
 assert.deepEqual(filterTierEntries('passives',{query:'Medicinal Herbs'}).map(entry=>entry.id).sort(),['herbs','panaceapouch','toadoil']);
 assert.equal(filterTierEntries('weapons',{query:'['}).length,0,'search treats special characters as literal text');
 assert.equal(filterTierEntries('characters',{query:'no matching hero'}).length,0);
});

test('base and evolved filters partition weapons and passives without hiding eligible item types',()=>{
 for(const category of ['weapons','passives']){
  const all=tierEntries(category),base=filterTierEntries(category,{form:'base'}),evolved=filterTierEntries(category,{form:'evolved'});
  assert.ok(base.every(entry=>!entry.evolved));assert.ok(evolved.every(entry=>entry.evolved));
  assert.equal(base.length+evolved.length,all.length);assert.equal(base.filter(entry=>ids(evolved).has(entry.id)).length,0);
  assert.deepEqual(ids([...base,...evolved]),ids(all));
 }
 assert.deepEqual(ids(filterTierEntries('passives',{form:'evolved'})),new Set(['panaceapouch','adaptivebarrier','purifiedsoul','sagecodex','quintet','sageregalia','chozosuit','witcharchive','philosopherstone','piratelegacy','hinokami','gateoftruth','gearfifth','transparentworld']));
 assert.deepEqual(filterTierEntries('weapons',{form:'evolved',query:'Hollow Purple'}).map(entry=>entry.id),['purple']);
});

test('Soul Gems of the Quintet appears once as a completed passive fusion and explains Salvation’s two-step route',()=>{
 const entries=tierEntries('passives'),quintet=entries.filter(entry=>entry.id==='quintet');
 assert.equal(ITEMS.quintet.fusionOnly,true);assert.equal(quintet.length,1,'fusion-only result must not duplicate a base-item entry');
 assert.equal(quintet[0].name,'Soul Gems of the Quintet');assert.equal(quintet[0].evolved,true);assert.equal(quintet[0].tier,'S');
 assert.ok(!filterTierEntries('passives',{form:'base'}).some(entry=>entry.id==='quintet'));
 assert.equal(filterTierEntries('passives',{form:'evolved',query:'Soul Gems of the Quintet'}).filter(entry=>entry.id==='quintet').length,1);
 assert.match(quintet[0].comparison,/freeing four support slots/);assert.match(quintet[0].bestWith,/before or after/);
 const salvation=tierEntries('weapons').find(entry=>entry.id==='salvation');assert.match(salvation.comparison,/two separate steps/);assert.match(salvation.bestWith,/Quintet remains equipped/);
 assert.ok(!/rare chest|2%/.test([quintet[0].bestWith,salvation.bestWith].join(' ')));
});

test('new composite supports appear once as S-tier fusions with recipe investment and retained signature guidance',()=>{
 const parts={sageregalia:5,chozosuit:4,witcharchive:4},entries=tierEntries('passives');
 for(const [id,count]of Object.entries(parts)){
  const found=entries.filter(entry=>entry.id===id),recipe=FUSIONS.find(f=>f.id===id);assert.equal(found.length,1,id+' has one tier entry');assert.equal(ITEMS[id].fusionOnly,true);assert.equal(recipe.ingredients.length,count);assert.equal(found[0].evolved,true);assert.equal(found[0].tier,'S');assert.ok(!filterTierEntries('passives',{form:'base'}).some(entry=>entry.id===id));assert.match(found[0].comparison,/free(?:ing|s) (?:three|four) support slots/i);assert.match(found[0].bestWith,new RegExp('all '+(count===5?'five':'four')+' maxed ingredients'));
 }
 assert.match(entries.find(entry=>entry.id==='sageregalia').bestWith,/Rasenshuriken/);assert.match(entries.find(entry=>entry.id==='chozosuit').bestWith,/Plasma Beam/);assert.match(entries.find(entry=>entry.id==='chozosuit').bestWith,/Adaptive Barrier/);assert.match(entries.find(entry=>entry.id==='witcharchive').bestWith,/Authority gain/);assert.match(entries.find(entry=>entry.id==='witcharchive').bestWith,/Final Chapter/);
 for(const [query,id]of [['NARUTO','sageregalia'],['METROID','chozosuit'],['UMINEKO','witcharchive']])assert.ok(filterTierEntries('passives',{query}).some(entry=>entry.id===id),id+' anime discovery');
});

test('rank order is deterministic and alphabetical within each tier without changing the source catalog',()=>{
 const before=JSON.stringify({CHARACTERS,ITEMS,FUSIONS,ULTIMATES}),state=createRun(CHARACTERS[0]),player=structuredClone(state.p);
 for(const category of TIER_CATEGORIES){
  const list=tierEntries(category.id),again=tierEntries(category.id);assert.deepEqual(list,again);
  for(let i=1;i<list.length;i++){
   const previous=TIERS.findIndex(tier=>tier.id===list[i-1].tier),current=TIERS.findIndex(tier=>tier.id===list[i].tier);
   assert.ok(previous<=current);if(previous===current)assert.ok(list[i-1].name.localeCompare(list[i].name,'en')<=0);
  }
  filterTierEntries(category.id,{query:'damage',form:'evolved'});
  list[0].tier='INVALID';list[0].name='Changed';assert.notEqual(tierEntries(category.id)[0].name,'Changed','results do not mutate shared records');
 }
 assert.equal(JSON.stringify({CHARACTERS,ITEMS,FUSIONS,ULTIMATES}),before);assert.deepEqual(state.p,player);
 assert.deepEqual(tierEntries('invalid-category'),tierEntries('characters'));
});

test('Titan-only attacks and generic item versus owner mechanics are explicitly distinguished',()=>{
 const weapons=tierEntries('weapons');
 for(const id of ['titanfists','titanquake'])assert.match(weapons.find(entry=>entry.id===id).caution,/Only Eren in Titan form/);
 assert.match(weapons.find(entry=>entry.id==='powerbeam').caution,/hero-specific/);
 assert.match(weapons.find(entry=>entry.id==='requip').caution,/exclusive to Erza/);
 assert.match(tierEntries('passives').find(entry=>entry.id==='greatsage').caution,/exclusive to Rimuru/);
 for(const entry of filterTierEntries('passives',{form:'evolved'}))assert.match([entry.caution,entry.bestWith].join(' '),/both max-rank ingredients|two maxed passives|both maxed passives|all five max-rank Soul Gems|all (?:four|five) maxed ingredients/);
});

test('every hero, weapon and passive placement carries measured balance numbers; ultimates are design-reviewed',()=>{
 for(const category of ['characters','weapons','passives'])for(const entry of tierEntries(category)){
  assert.ok(entry.measured,entry.id+' has measurements');assert.ok(entry.measured.label.length>3);
  assert.ok(entry.measured.stats.length>=2&&entry.measured.stats.length<=4,entry.id+' shows two to four stats');
  for(const [label,value]of entry.measured.stats){assert.ok(typeof label==='string'&&label.length>2);assert.ok(typeof value==='string'&&value.length>0);}
 }
 assert.ok(tierEntries('ultimates').every(entry=>!entry.measured));
 assert.match(TIER_CATEGORIES.find(c=>c.id==='ultimates').criteria,/design review/);
});
