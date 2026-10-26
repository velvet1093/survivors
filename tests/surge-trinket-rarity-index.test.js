import test from 'node:test';
import assert from 'node:assert/strict';
import {CHARACTERS,ITEMS,FUSIONS,fusionIngredients} from '../src/game.js';
import {createRun,updateRun} from '../src/engine.js';
import {enemyPressure,riftSurge,SURGE_MINUTE} from '../src/difficulty.js';
import {TRINKETS,isEventTrigger,chooseTrinket,canRefineWith,refineTrinketWith,trinketRefinement,trinketMaxRefinement} from '../src/trinkets.js';
import {RARITIES,rarityFor,rarityBadge} from '../src/rarity.js';
import {recipeStatus} from '../src/recipe-index.js';
import {setItemLevel} from '../src/training.js';
import {createTrainingRun} from '../src/engine.js';

const hero=id=>CHARACTERS.find(c=>c.id===id);
test('enemies surge from minute 5: no change before, then a steep stacking climb',()=>{
 assert.equal(SURGE_MINUTE,5);assert.equal(riftSurge(4).hp,1);assert.equal(riftSurge(4).damage,1);
 const step=m=>enemyPressure(m*60).hp/enemyPressure((m-1)*60).hp;
 assert.ok(step(5)>1.6,'minute 5 is a sharp jump');assert.ok(step(4)<1.25,'before the surge growth is gentle');
 assert.ok(enemyPressure(600).hp>20&&enemyPressure(600).damage>4,'minute 10 enemies are far stronger');
 for(let m=6;m<30;m++)assert.ok(enemyPressure(m*60).hp>enemyPressure((m-1)*60).hp);
 const g=createRun(hero('goku'));g.events.nextAt=g.rifts.nextAt=1e9;g.time=299.99;g.toastTime=0;for(let i=0;i<400&&!g.surgeAnnounced;i++)updateRun(g,.02);assert.equal(g.surgeAnnounced,true);assert.match(g.toast,/RIFT SURGES/);
});
const ordinary=TRINKETS.filter(t=>t.id!=='dragonmarble'&&!isEventTrigger(t.id));
function withEquipped(id){const g=createRun(hero('goku'));g.trinkets.pending={uid:'t:1',itemId:id,x:0,y:0,age:1};g.status='trinket';assert.ok(chooseTrinket(g,0));return g;}
const offer=(g,id)=>{g.trinkets.pending={uid:'t:'+Math.random(),itemId:id,x:0,y:0,age:1};g.status='trinket';};
test('any other ordinary trinket can be melted into an equipped one; Dragon Balls and event items cannot',()=>{
 const [a,b,c]=ordinary,g=withEquipped(a.id);offer(g,b.id);
 assert.ok(canRefineWith(g,a.id,b.id));assert.ok(refineTrinketWith(g,0));assert.equal(trinketRefinement(g,a.id),1);assert.equal(g.status,'playing');assert.ok(!g.trinkets.equipped.includes(b.id),'the fodder is consumed');
 for(let i=1;i<trinketMaxRefinement(a.id);i++){offer(g,c.id);assert.ok(refineTrinketWith(g,0));}
 offer(g,c.id);assert.equal(refineTrinketWith(g,0),false,'a fully refined trinket takes no more');
 const ball=withEquipped('dragonmarble');offer(ball,b.id);assert.equal(canRefineWith(ball,'dragonmarble',b.id),false);assert.equal(refineTrinketWith(ball,0),false);
 const g2=withEquipped(a.id);offer(g2,'dragonmarble');assert.equal(canRefineWith(g2,a.id,'dragonmarble'),false,'Dragon Balls are not fodder');
 const trigger=TRINKETS.find(t=>isEventTrigger(t.id));if(trigger){offer(g2,trigger.id);assert.equal(canRefineWith(g2,a.id,trigger.id),false);}
});
test('every item and fusion has a decorative rarity that changes no stats',()=>{
 assert.deepEqual(RARITIES.map(r=>r.id),['common','rare','epic','legendary','mythic']);
 for(const id of [...Object.keys(ITEMS),...FUSIONS.map(f=>f.id)]){const r=rarityFor(id);assert.ok(r,id);assert.match(rarityBadge(id),new RegExp(r.name.toUpperCase()));}
 assert.equal(rarityFor('magnet').id,'common');assert.equal(rarityFor('quintet').id,'mythic');assert.equal(rarityFor('ki').id,'epic');assert.equal(rarityFor('kamehameha').id,'legendary');
 assert.equal(rarityFor('heal'),null);
 for(const r of RARITIES)assert.ok(Object.keys(ITEMS).some(id=>rarityFor(id).id===r.id)||FUSIONS.some(f=>rarityFor(f.id).id===r.id),r.id+' is used');
});
test('the recipe index tracks each ingredient and flags a fusion as ready once all are maxed',()=>{
 const g=createTrainingRun(hero('goku')),f=FUSIONS.find(f=>f.id==='kamehameha');
 let s=recipeStatus(g.p,f);assert.equal(s.ready,false);assert.ok(s.owned);assert.equal(s.parts.length,fusionIngredients(f).length);
 for(const id of fusionIngredients(f))setItemLevel(g,id,ITEMS[id].max);
 s=recipeStatus(g.p,f);assert.equal(s.ready,true);assert.equal(s.done,s.parts.length);
 const locked=FUSIONS.find(f=>f.requiredCharacter&&f.requiredCharacter!=='goku');if(locked)assert.equal(recipeStatus(g.p,locked).locked,true);
});
