import test from 'node:test';
import assert from 'node:assert/strict';
import {CHARACTERS} from '../src/game.js';
import {createRun,hitPlayer,useSpecial,updateRun} from '../src/engine.js';
import {hurtGuardian} from '../src/guardian-health.js';
import {summonMahoraga,summonPack,summonNue,updateSummons} from '../src/summons.js';
import {startFrierenGolem,updateFrierenGolem} from '../src/frieren-golem.js';
import {queueSummonDeath,queuePlayerDeath,updateFriendlyDeaths,restoreFriendlyDeaths,playerDeathPending} from '../src/friendly-death.js';
import {drawFriendlyDeath,friendlyDeathPixels} from '../src/friendly-death-art.js';
import {saveRun,loadRun} from '../src/run-save.js';
import {ensureWorld} from '../src/world.js';
const hero=id=>CHARACTERS.find(c=>c.id===id);
function run(id='goku'){const g=createRun(hero(id));ensureWorld(g);g.spawn=g.eliteAt=1e9;g.p.nextXp=g.invuln=1e9;g.p.weapons={};return g;}
const callbacks={damage(g,e,amount){e.hp-=amount;},burst(){}};
const store=()=>({data:new Map(),setItem(k,v){this.data.set(k,v);},getItem(k){return this.data.get(k)??null;},removeItem(k){this.data.delete(k);}});

test('guardian deaths queue once and keep a separate frozen body after removal and resummoning',()=>{
 for(const id of ['megumi','frieren']){
  const g=run(id);if(id==='frieren')g.ultimate={type:'frieren',age:0,duration:10};
  const s=id==='megumi'?summonMahoraga(g):startFrierenGolem(g),entityId=s.id;hurtGuardian(g,s,1e9);const body=g.summonDeaths[0],before=structuredClone(body);
  assert.equal(g.summonDeaths.length,1);assert.equal(hurtGuardian(g,s,1e9),false);assert.equal(queueSummonDeath(g,s),null);
  if(id==='megumi')updateSummons(g,.01,callbacks);else updateFrierenGolem(g,.01,callbacks);
  assert.equal(g.summonDeaths.length,1);assert.equal(body.entityId,entityId);assert.deepEqual(body,before);
  const replacement=id==='megumi'?summonMahoraga(g):startFrierenGolem(g);assert.notEqual(replacement.id,entityId);assert.equal(replacement.hp,replacement.maxHp);replacement.x+=100;
  assert.deepEqual(body,before,'new guardian cannot move or heal the old death visual');
 }
});

test('Divine Dogs and Nue leave a bounded departure instead of disappearing at expiry',()=>{
 const g=run('megumi');summonPack(g,1,1);summonNue(g,1,1);for(const s of g.summons)s.life=.01;
 updateSummons(g,.02,callbacks);assert.equal(g.summons.length,0);assert.deepEqual(g.summonDeaths.map(d=>d.kind),['whiteDog','blackDog','nue']);assert.ok(g.summonDeaths.every(d=>d.reason==='expired'));
 updateSummons(g,.02,callbacks);assert.equal(g.summonDeaths.length,3);updateFriendlyDeaths(g,.8);assert.equal(g.summonDeaths.length,0);
});

test('Naruto and Kurumi decoys depart once when their actual ultimate arrays clear',()=>{
 for(const [id,kind,count]of [['naruto','clone',6],['kurumi','shadow',3]]){
  const g=run(id);assert.ok(useSpecial(g));g.ultimate.age=g.ultimate.duration-.01;updateRun(g,.02);
  assert.equal(g.ultimate,null);assert.equal(g.summonDeaths.filter(d=>d.kind===kind).length,count);updateRun(g,.02);assert.equal(g.summonDeaths.filter(d=>d.kind===kind).length,count);
 }
});

test('lethal damage immediately ends every hero’s run and queues one immutable player death',()=>{
 for(const character of CHARACTERS){
  const g=run(character.id);g.invuln=0;g.p.hp=1;g.p.shield=0;g.p.dodge=0;assert.ok(hitPlayer(g,1e9,{dot:true}));assert.equal(g.p.hp,0);assert.equal(g.status,'over');assert.ok(playerDeathPending(g));assert.equal(g.checkpointRequested,true,'lethal damage immediately requests save deletion before the visual finishes');assert.equal(g.playerDeath.hero.id,character.id);
  const death=g.playerDeath;assert.strictEqual(queuePlayerDeath(g),death);assert.equal(hitPlayer(g,1e9,{dot:true}),false);const time=g.time;updateRun(g,1);assert.equal(g.time,time);assert.equal(death.age,0,'combat does not advance the separate defeat clock');
  const storage=store();saveRun(g,storage);assert.equal(loadRun(storage),null,'a defeat animation cannot make the dead run resumable');
 }
});

test('defeat clocks pause with menus and intros, then finish without advancing gameplay',()=>{
 const g=run('megumi'),s=summonMahoraga(g);hurtGuardian(g,s,1e9);const body=g.summonDeaths[0];
 g.status='paused';updateFriendlyDeaths(g,2);assert.equal(body.age,0);g.status='playing';g.bossIntro={};updateFriendlyDeaths(g,2);assert.equal(body.age,0);g.bossIntro=null;
 g.p.hp=0;g.status='over';queuePlayerDeath(g);const time=g.time;updateFriendlyDeaths(g,.5);assert.equal(body.age,.5);assert.equal(g.playerDeath.age,.5);assert.equal(g.time,time);updateFriendlyDeaths(g,1);assert.equal(playerDeathPending(g),false);assert.equal(g.playerDeath.complete,true);assert.equal(g.summonDeaths.length,0);
 const quiet=run('frieren');quiet.p.reducedMotion=true;quiet.p.hp=0;quiet.status='over';queuePlayerDeath(quiet);assert.equal(quiet.playerDeath.duration,.25);updateFriendlyDeaths(quiet,.25);assert.equal(playerDeathPending(quiet),false);
});

test('saved summon death snapshots resume their exact age and corrupt records are ignored',()=>{
 const g=run('megumi'),s=summonMahoraga(g),storage=store();hurtGuardian(g,s,1e9);updateFriendlyDeaths(g,.35);updateSummons(g,.01,callbacks);assert.ok(saveRun(g,storage));const restored=loadRun(storage);restoreFriendlyDeaths(restored);assert.equal(restored.summonDeaths[0].age,.35);assert.deepEqual(restored.summonDeaths[0].unit,g.summonDeaths[0].unit);
 restored.summonDeaths.push(null,{kind:'mahoraga',x:0,y:0,age:NaN,duration:1,unit:{}},{kind:'unknown',x:0,y:0,age:0,duration:1,unit:{}});restored.playerDeath={x:NaN};restoreFriendlyDeaths(restored);assert.equal(restored.summonDeaths.length,1);assert.equal(restored.playerDeath,null);
});

function canvas(){const calls=[],state={};return {calls,c:new Proxy(state,{get:(o,k)=>k in o?o[k]:(...args)=>{for(const n of args)if(typeof n==='number')assert.ok(Number.isFinite(n),k+' uses finite coordinates');calls.push([k,...args]);},set:(o,k,v)=>{if(typeof v==='number')assert.ok(Number.isFinite(v),k+' is finite');o[k]=v;return true;}})};}
test('every hero and summon has finite original-pixel death art with a static quiet fade',()=>{
 const deaths=[];
 for(const character of CHARACTERS){const g=run(character.id);g.p.hp=0;deaths.push(queuePlayerDeath(g));}
 const g=run('megumi');for(const kind of ['mahoraga','frierenGolem','whiteDog','blackDog','nue'])deaths.push(queueSummonDeath(g,{id:++g.id,kind,x:30,y:40,facing:1,age:0,hp:0}));
 for(const death of deaths){assert.equal(friendlyDeathPixels(death).length,56*76);assert.ok(friendlyDeathPixels(death).filter(Boolean).length>50);
  for(const age of [0,death.duration*.4,death.duration*.9])for(const quiet of [false,true]){death.age=age;const {c,calls}=canvas(),before=JSON.stringify(death);assert.ok(drawFriendlyDeath(c,death,quiet));assert.equal(JSON.stringify(death),before);assert.equal(calls.filter(c=>c[0]==='save').length,calls.filter(c=>c[0]==='restore').length);assert.ok(calls.some(c=>c[0]==='fillRect'));if(quiet)assert.ok(!calls.some(c=>c[0]==='rotate'&&c[1]!==0));}
 }
});

test('death snapshots retain Titan, EVA pilot, slime and Morph Ball silhouettes',()=>{
 const art=(id,configure)=>{const g=run(id);configure?.(g);g.p.hp=0;return friendlyDeathPixels(queuePlayerDeath(g));};
 assert.notDeepEqual(art('eren'),art('eren',g=>g.p.form=1));assert.notDeepEqual(art('shinji'),art('shinji',g=>g.p.skin='asuka'));assert.notDeepEqual(art('rimuru'),art('rimuru',g=>g.ultimate={type:'rimuru'}));assert.notDeepEqual(art('samus'),art('samus',g=>g.p.pose='bomb'));
});
