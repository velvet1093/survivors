import test from 'node:test';
import assert from 'node:assert/strict';
import {CHARACTERS,ITEMS,FUSIONS,createPlayer,refreshStats,fusionType,fusionIngredients,fusionConsumedIngredients,fusionBase,fusionReady,fusionRequirement,effectivePassiveRank,consumedFusionIngredient,getUpgradePool,getChoices,chestOffers,applyChoice,resolveChestReward,hasQuintet} from '../src/game.js';
import {createRun,createHardcoreRun,createBossRushRun,spawnEnemy,updateRun} from '../src/engine.js';
import {configureRushLoadout,rushFusionChoices,evolveRushWeapon,getRushDraftPool,getRushDraftChoices,chooseRushDraft,beginBossRush} from '../src/boss-rush.js';
import {wishEvolutions} from '../src/shenron.js';
import {tryChestMimic,defeatedMimic,resolveChestContents} from '../src/rift-encounters.js';
import {saveRun,loadRun} from '../src/run-save.js';
const gems=['soulgem','bluegem','yellowgem','redgem','purplegem'];
const hero=id=>CHARACTERS.find(c=>c.id===id),recipe=id=>FUSIONS.find(f=>f.id===id),close=(a,b)=>assert.ok(Math.abs(a-b)<1e-9,`${a} equals ${b}`);
const memory=()=>({data:new Map(),getItem(k){return this.data.get(k)},setItem(k,v){this.data.set(k,v)},removeItem(k){this.data.delete(k)}});
function equipped(id='madoka',evolved=true){const p=createPlayer(hero(id));p.weapons={rosebow:5};p.passives=Object.fromEntries(gems.map(key=>[key,3]));p.fusions=evolved?{rosebow:'ultimate'}:{};refreshStats(p);return p;}
const train=(p,id)=>applyChoice(p,{kind:'fusion',id});
const keys=['maxHp','regen','area','damage','cooldown','dodge','maxShield','shieldRecharge','healing','magnet'];
const stats=p=>Object.fromEntries(keys.map(key=>[key,p[key]]));
function purified(){const p=equipped();delete p.passives.purplegem;p.passives.griefseed=3;refreshStats(p);assert.ok(train(p,'purifiedsoul'));for(let i=0;i<3;i++)assert.ok(applyChoice(p,{kind:'item',id:'purplegem'}));return p;}
function rush(evolvedFirst=false){const g=createBossRushRun(hero('madoka'));assert.ok(configureRushLoadout(g,{weapons:['rosebow','ki','blue','orbit','clockshot'],passives:gems}));if(evolvedFirst)assert.ok(evolveRushWeapon(g,'ultimate'));return g;}
function refill(g){while(g.status==='rush-draft'){const choice=getRushDraftChoices(g)[0];assert.ok(choice);assert.ok(!gems.includes(choice.id));assert.ok(chooseRushDraft(g,choice.id));assert.equal(g.p.passives[choice.id],ITEMS[choice.id].max);}}

test('the five Soul Gems fuse into one actual fusion-only passive before Salvation',()=>{
 const f=recipe('quintet');assert.equal(fusionType(f),'passive');assert.equal(fusionBase(f),'quintet');assert.equal(f.resultItem,'quintet');assert.deepEqual(fusionIngredients(f),gems);assert.deepEqual(fusionConsumedIngredients(f),gems);
 assert.equal(ITEMS.quintet.name,'Soul Gems of the Quintet');assert.equal(ITEMS.quintet.type,'passive');assert.equal(ITEMS.quintet.max,1);assert.equal(ITEMS.quintet.fusionOnly,true);
 assert.deepEqual(fusionIngredients(recipe('salvation')),['rosebow','quintet']);assert.deepEqual(fusionConsumedIngredients(recipe('salvation')),[]);assert.equal(fusionRequirement(recipe('salvation')),'Ultimate Madoka LV 5 + Soul Gems of the Quintet LV 1 · Madoka only');
 for(const id of gems){assert.equal(ITEMS[id].type,'passive');assert.equal(ITEMS[id].max,3);assert.ok(fusionRequirement(f).includes(ITEMS[id].name));}
});

test('five maxed gems provide their stated stats and their shared fusion needs every physical maxed gem',()=>{
 const p=equipped();close(p.regen,2.05);close(p.area,1.15);close(p.damage,1.3);close(p.cooldown,.91);close(p.dodge,.045);assert.equal(p.maxShield,30);
 assert.ok(fusionReady(p,recipe('quintet')));assert.equal(fusionReady(p,recipe('salvation')),false,'raw gems are no longer Salvation ingredients');
 for(const id of gems){p.passives[id]=2;assert.equal(fusionReady(p,recipe('quintet')),false,id+' must be maxed');p.passives[id]=3;}
 const borrowed=equipped('goku',false);borrowed.weapons={ki:1};assert.ok(fusionReady(borrowed,recipe('quintet')));assert.ok(train(borrowed,'quintet'));assert.equal(fusionReady(borrowed,recipe('salvation')),false);
});

test('the Quintet consumes all five gems, frees four slots and preserves every bonus exactly once',()=>{
 const p=equipped(),before=stats(p);p.hp=63;p.shield=12;p.shieldTimer=6.25;for(const id of gems)p.cooldowns[id]=8;
 assert.ok(train(p,'quintet'));assert.deepEqual(p.passives,{quintet:1});assert.equal(p.fusions.quintet,'quintet');assert.ok(hasQuintet(p));assert.equal(p.fusions.rosebow,'ultimate');assert.equal(p.hp,63);assert.equal(p.shield,12);assert.equal(p.shieldTimer,6.25);
 for(const id of gems){assert.equal(effectivePassiveRank(p,id),3);assert.equal(p.cooldowns[id],undefined);assert.ok(consumedFusionIngredient(p,id));assert.equal(applyChoice(p,{kind:'item',id}),false);assert.ok(!getUpgradePool(p).some(c=>c.kind==='item'&&c.id===id));}
 for(let i=0;i<4;i++)refreshStats(p);assert.deepEqual(stats(p),before);assert.equal(train(p,'quintet'),false);
});

test('Salvation is a separate normal weapon fusion that keeps the real Quintet item equipped',()=>{
 const p=equipped();assert.equal(train(p,'salvation'),false);assert.ok(train(p,'quintet'));const before=stats(p);assert.ok(fusionReady(p,recipe('salvation')));assert.ok(train(p,'salvation'));assert.equal(p.fusions.rosebow,'salvation');assert.deepEqual(p.passives,{quintet:1});assert.equal(p.fusions.quintet,'quintet');assert.deepEqual(stats(p),before);assert.equal(train(p,'salvation'),false);
});

test('the Quintet works before or after the original bow evolution and only Madoka can take Salvation',()=>{
 for(const evolved of [false,true]){const p=equipped('madoka',evolved);assert.ok(train(p,'quintet'));if(!evolved){assert.equal(fusionReady(p,recipe('salvation')),false);assert.ok(fusionReady(p,recipe('ultimate')),'absorbed Pink still unlocks the first bow evolution');assert.ok(train(p,'ultimate'));}assert.ok(fusionReady(p,recipe('salvation')));p.weapons.rosebow=4;assert.equal(fusionReady(p,recipe('salvation')),false);p.weapons.rosebow=5;p.id='goku';assert.equal(fusionReady(p,recipe('salvation')),false);p.id='madoka';assert.ok(train(p,'salvation'));}
});

test('Purified Pink ancestry keeps Grief Seed, healing and eight-second shields only with an actual Quintet',()=>{
 const p=purified(),before=stats(p);assert.ok(train(p,'quintet'));assert.equal(p.quintetPurified,true);assert.equal(p.fusions.soulgem,undefined);assert.equal(effectivePassiveRank(p,'griefseed'),3);assert.ok(consumedFusionIngredient(p,'griefseed'));assert.equal(applyChoice(p,{kind:'item',id:'griefseed'}),false);assert.deepEqual(stats(p),before);assert.ok(train(p,'salvation'));refreshStats(p);assert.deepEqual(stats(p),before);close(p.cooldown,.82);close(p.healing,1.2);assert.equal(p.shieldRecharge,8);
 delete p.passives.quintet;refreshStats(p);assert.equal(hasQuintet(p),false);assert.equal(effectivePassiveRank(p,'griefseed'),0);for(const id of gems)assert.equal(effectivePassiveRank(p,id),0);close(p.cooldown,1);close(p.damage,1);close(p.area,1);close(p.healing,1);assert.equal(p.shieldRecharge,10);
 const forged=createPlayer(hero('madoka'));forged.quintetPurified=true;refreshStats(forged);assert.equal(effectivePassiveRank(forged,'griefseed'),0);close(forged.cooldown,1);close(forged.healing,1);forged.passives={quintet:1};refreshStats(forged);assert.equal(hasQuintet(forged),false);assert.equal(effectivePassiveRank(forged,'soulgem'),0);assert.equal(fusionReady(forged,recipe('salvation')),false);
});

test('Quintet cannot be acquired directly, drafted, configured or smuggled into Hardcore',()=>{
 for(const c of CHARACTERS){const p=createPlayer(c);assert.ok(!getUpgradePool(p).some(choice=>choice.kind==='item'&&choice.id==='quintet'));assert.equal(applyChoice(p,{kind:'item',id:'quintet',maxLevel:true}),false);const h=createHardcoreRun(c);assert.equal(applyChoice(h.p,{kind:'item',id:'quintet'}),false);const forged=equipped(c.id);forged.hardcore=true;assert.equal(fusionReady(forged,recipe('quintet')),false);}
 const g=createBossRushRun(hero('goku'));assert.ok(!getRushDraftPool(g).some(c=>c.id==='quintet'));assert.equal(configureRushLoadout(g,{weapons:['ki'],passives:['senzu','quintet']}),false);
});

test('normal level-up and chest choices offer each step without RNG gates or direct raw Quintet rewards',()=>{
 for(const roll of [0,.02,.5,.99]){const p=equipped(),before=structuredClone(p);assert.equal(getChoices(p,()=>roll)[0].id,'quintet');const offers=chestOffers(p,3,()=>roll,{ultraRareFusion:{checked:true,ids:[],spent:['salvation']}});assert.equal(offers[0].id,'quintet');assert.equal(offers[1].id,'salvation');assert.ok(offers.every(c=>!(c.kind==='item'&&c.id==='quintet')));assert.deepEqual(p,before);assert.ok(train(p,'quintet'));assert.equal(getChoices(p,()=>roll)[0].id,'salvation');}
 const p=equipped('madoka',false),offers=chestOffers(p,3,()=>0);assert.deepEqual(offers.map(c=>c.id),['quintet','ultimate','salvation']);
});

test('Boss Rush preparation refills four maxed slots after Quintet and Salvation then keeps all five',()=>{
 for(const bowFirst of [false,true]){const g=rush(bowFirst);assert.ok(rushFusionChoices(g).some(f=>f.id==='quintet'));assert.ok(evolveRushWeapon(g,'quintet'));assert.equal(g.status,'rush-draft');assert.deepEqual(g.p.passives,{quintet:1});assert.equal(beginBossRush(g),false);refill(g);if(!bowFirst)assert.ok(evolveRushWeapon(g,'ultimate'));assert.ok(rushFusionChoices(g).some(f=>f.id==='salvation'));assert.ok(evolveRushWeapon(g,'salvation'));assert.equal(g.status,'rush-fusion');assert.equal(Object.keys(g.p.passives).length,5);assert.equal(g.p.passives.quintet,1);assert.ok(beginBossRush(g));assert.ok(!wishEvolutions(g).some(f=>f.id==='salvation'));}
});

test('pending and accepted Quintet and Salvation chest steps save independently',()=>{
 const g=createRun(hero('madoka'));g.p=purified();g.status='chest';g.chestVersion=2;g.chestIndex=0;g.rewards=chestOffers(g.p,3,()=>.99);assert.equal(g.rewards[0].id,'quintet');const storage=memory();assert.ok(saveRun(g,storage));let loaded=loadRun(storage);assert.equal(loaded.resumeStatus,'chest');loaded.status='chest';assert.ok(resolveChestReward(loaded,true,()=>.99));assert.equal(loaded.p.passives.quintet,1);assert.equal(loaded.p.fusions.rosebow,'ultimate');assert.equal(loaded.rewards[1].id,'salvation');assert.ok(saveRun(loaded,storage));loaded=loadRun(storage);assert.equal(loaded.chestIndex,1);assert.equal(loaded.p.quintetPurified,true);loaded.status='chest';assert.ok(resolveChestReward(loaded,true,()=>.99));assert.equal(loaded.p.fusions.rosebow,'salvation');assert.equal(loaded.p.passives.quintet,1);assert.ok(saveRun(loaded,storage));loaded=loadRun(storage);assert.equal(loaded.chestIndex,2);assert.equal(loaded.p.fusions.rosebow,'salvation');assert.equal(loaded.p.passives.quintet,1);close(loaded.p.cooldown,.82);
});

test('a one-reward Boss Rush Quintet cache still grants four maxed replacements',()=>{
 const g=rush(true);assert.ok(beginBossRush(g));g.status='chest';g.chestIndex=0;g.rewards=chestOffers(g.p,1,()=>0,{maxLevelItems:true});assert.equal(g.rewards[0].id,'quintet');assert.ok(resolveChestReward(g,true,()=>0));assert.equal(g.rewards.length,5);assert.equal(g.p.passives.quintet,1);while(g.chestIndex<g.rewards.length){const next=g.rewards[g.chestIndex];assert.equal(next.kind,'item');assert.ok(next.maxLevel);assert.ok(!gems.includes(next.id));assert.ok(resolveChestReward(g,true,()=>0));}assert.equal(Object.keys(g.p.passives).length,5);assert.equal(g.p.fusions.rosebow,'ultimate');assert.ok(fusionReady(g.p,recipe('salvation')));
});

test('mimic loot keeps the new two-step fusion promise through recovery and a checkpoint',()=>{
 const g=createRun(hero('madoka'));g.p=equipped();const chest={x:0,y:0,rewardCount:3,source:'Walpurgisnacht'};g.chests.push(chest);assert.ok(tryChestMimic(g,chest,{spawn:spawnEnemy},()=>0));assert.equal(chest.rewardOffers[0].id,'quintet');assert.equal(chest.rewardOffers[1].id,'salvation');const promised=structuredClone(chest.rewardOffers),storage=memory();assert.ok(saveRun(g,storage));const loaded=loadRun(storage),guard=loaded.enemies.find(e=>e.archetype==='mimic');guard.hp=0;assert.ok(defeatedMimic(loaded,guard));assert.deepEqual(resolveChestContents(loaded,loaded.chests[0],()=>.99),promised);
});

test('legacy completed Salvation becomes a real Quintet without losing items, stats, health or the earned bow',()=>{
 for(const purifiedPink of [false,true]){const g=createRun(hero('madoka'));g.p.weapons={rosebow:5};g.p.passives={soulgem:3,eyes:3,herbs:3,grimoire:3,energytank:3};g.p.fusions={rosebow:'salvation',...(purifiedPink?{soulgem:'purifiedsoul'}:{})};g.p.hp=57;g.p.shield=9;g.p.shieldTimer=7.25;g.money=61;g.characterXp=23;const expected=structuredClone(g.p);delete expected.passives.soulgem;delete expected.fusions.soulgem;expected.passives.quintet=1;expected.fusions.quintet='quintet';expected.quintetPurified=purifiedPink;refreshStats(expected);Object.assign(g.p,stats(expected));const storage=memory();assert.ok(saveRun(g,storage));let loaded=loadRun(storage);assert.ok(loaded);assert.equal(loaded.p.fusions.rosebow,'salvation');assert.equal(loaded.p.passives.soulgem,undefined);assert.equal(loaded.p.passives.quintet,1);assert.equal(Object.keys(loaded.p.passives).length,5);assert.deepEqual(stats(loaded.p),stats(expected));assert.equal(loaded.p.hp,57);assert.equal(loaded.p.shield,9);assert.equal(loaded.p.shieldTimer,7.25);assert.equal(loaded.money,61);assert.equal(loaded.characterXp,23);assert.equal(loaded.p.quintetPurified,purifiedPink);assert.equal(loaded.p.fusions.soulgem,undefined);assert.ok(saveRun(loaded,storage));loaded=loadRun(storage);assert.deepEqual(stats(loaded.p),stats(expected));assert.equal(Object.keys(loaded.p.passives).length,5);}
});

test('legacy pending Salvation offers become Quintet first and then allow the new Salvation recipe',()=>{
 for(const status of ['upgrade','chest']){const g=createRun(hero('madoka'));g.p=purified();g.status=status;g.chestVersion=2;g.chestIndex=0;if(status==='upgrade')g.levelChoices=[{kind:'fusion',id:'salvation'}];else g.rewards=[{kind:'fusion',id:'salvation'},{kind:'item',id:'ki',level:1}];g.chests=[{x:100,y:100,rewardOffers:[{kind:'fusion',id:'salvation'}]}];const storage=memory();assert.ok(saveRun(g,storage));const loaded=loadRun(storage);assert.equal(loaded.resumeStatus,status);assert.equal(loaded.chests[0].rewardOffers[0].id,'quintet');assert.equal((status==='upgrade'?loaded.levelChoices:loaded.rewards)[0].id,'quintet');loaded.status=status;if(status==='upgrade')assert.ok(train(loaded.p,'quintet'));else assert.ok(resolveChestReward(loaded,true,()=>.99));assert.equal(loaded.p.fusions.rosebow,'ultimate');assert.equal(loaded.p.passives.quintet,1);assert.ok(fusionReady(loaded.p,recipe('salvation')));}
});

test('new Quintet checkpoints keep bonuses without needing Salvation or retaining stale source fusions',()=>{
 const g=createRun(hero('goku'));g.p=equipped('goku',false);assert.ok(train(g.p,'quintet'));const before=stats(g.p),storage=memory();assert.ok(saveRun(g,storage));const loaded=loadRun(storage);assert.ok(loaded);assert.equal(loaded.p.id,'goku');assert.equal(loaded.p.passives.quintet,1);assert.equal(loaded.p.fusions.rosebow,undefined);assert.deepEqual(stats(loaded.p),before);assert.ok(!getUpgradePool(loaded.p).some(c=>c.kind==='item'&&gems.includes(c.id)));assert.equal(train(loaded.p,'salvation'),false);
});

test('Hardcore recovery restores an absorbed signature passive without admitting the foreign Quintet',()=>{
 const g=createHardcoreRun(hero('madoka'));g.p.weapons={rosebow:5};g.p.passives={quintet:1};g.p.fusions={quintet:'quintet'};g.p.quintetPurified=true;const storage=memory();assert.ok(saveRun(g,storage));const loaded=loadRun(storage);assert.ok(loaded);assert.deepEqual(loaded.p.passives,{soulgem:3});assert.equal(loaded.p.fusions.quintet,undefined);close(loaded.p.cooldown,1);close(loaded.p.healing,1);assert.equal(effectivePassiveRank(loaded.p,'griefseed'),0);
});
