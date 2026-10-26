import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {CHARACTERS} from '../src/game.js';
import {BOSSES} from '../src/enemies.js';
import {createRun,spawnEnemy,updateRun,hitPlayer,useSpecial,useDash} from '../src/engine.js';
import {BOSS_CINEMATICS,queueBossIntro,finishBossIntro,bossIntroMarkup,bossIntroState,updateBossIntroVisual} from '../src/boss-intro.js';
import {saveRun,loadRun} from '../src/run-save.js';
const run=()=>{const g=createRun(CHARACTERS[0]);g.spawn=g.eliteAt=99999;return g;};
const memory=()=>{const data=new Map();return{getItem:k=>data.get(k)||null,setItem:(k,v)=>data.set(k,v),removeItem:k=>data.delete(k)};};
const arrival=(id,quiet=false)=>{const g=run();g.p.reducedMotion=quiet;const e=spawnEnemy(g,true,false,id);queueBossIntro(g,e,5);return{g,e,intro:g.bossIntro};};

test('every boss has a themed signature entrance with staged captions and its real title',()=>{
 assert.deepEqual(Object.keys(BOSS_CINEMATICS).sort(),Object.keys(BOSSES).sort());
 const abilities=new Set(),themes=new Set();
 for(const [id,def]of Object.entries(BOSSES)){
  const {intro}=arrival(id),html=bossIntroMarkup(intro),spec=BOSS_CINEMATICS[id];abilities.add(spec.ability);themes.add(spec.theme);
  assert.ok(html.includes(def.name));assert.ok(html.includes(def.title));assert.ok(html.includes('cinema-theme-'+spec.theme));assert.ok(html.includes('<rect'));assert.ok(html.includes('id="skip-intro"'));assert.ok(html.includes('role="progressbar"'));assert.ok(html.includes('aria-modal="true"'));
  assert.equal(spec.beats.length,3);assert.equal(new Set(spec.beats).size,3);assert.ok(intro.duration>=3.6);for(const progress of [0,.5,.9])assert.equal(bossIntroState({...intro,age:intro.duration*progress}).stage,progress===0?0:progress===.5?1:2);
 }
 assert.equal(abilities.size,Object.keys(BOSSES).length);assert.ok(themes.size>=10);
});

test('Reiner reveals an articulated roaring Titan without transforming the live boss',()=>{
 const {g,e,intro}=arrival('reiner'),before=structuredClone(e),html=bossIntroMarkup(intro),calm=bossIntroState(intro),roar=bossIntroState({...intro,age:intro.duration*.5});
 assert.ok(html.includes('cinema-titan-jaw'));assert.ok(html.includes('cinema-titan-mouth'));assert.ok(html.includes('cinema-shock-ring'));assert.ok(html.includes('cinema-steam'));assert.ok(html.includes('WARRIOR’S ROAR'));assert.equal(calm.roar,0);assert.equal(roar.roar,1);assert.equal(roar.frame,1);assert.deepEqual(e,before);assert.equal(e.enraged,false);
 g.p.hp=50;const simulation=JSON.stringify([g.p,g.time,g.enemies,g.special,g.dashCD]);assert.equal(hitPlayer(g,100),false);assert.equal(useSpecial(g),false);assert.equal(useDash(g),false);updateRun(g,.3,{x:1,y:0});assert.equal(JSON.stringify([g.p,g.time,g.enemies,g.special,g.dashCD]),simulation);
});

test('DIO stops clock hands through the signature beat and releases them only at the finale',()=>{
 const {intro}=arrival('dio'),a=bossIntroState({...intro,age:intro.duration*.4}),b=bossIntroState({...intro,age:intro.duration*.7}),c=bossIntroState({...intro,age:intro.duration*.96}),html=bossIntroMarkup(intro);
 assert.equal(a.rotation,b.rotation);assert.equal(a.freeze,1);assert.equal(b.freeze,1);assert.ok(c.rotation>b.rotation);assert.ok(c.freeze<1);assert.ok(html.includes('cinema-clock-hands'));assert.ok(html.includes('cinema-knives'));assert.ok(html.includes('cinema-stand'));
});

test('intro scenes resume the exact saved beat and keep queued arrivals and protection',()=>{
 const {g,intro}=arrival('reiner'),dio=spawnEnemy(g,true,false,'dio');queueBossIntro(g,dio,10);intro.age=1.67;g.bossIntroQueue[0].age=.15;const store=memory();assert.ok(saveRun(g,store));const resumed=loadRun(store);assert.ok(resumed);assert.equal(resumed.status,'paused');assert.deepEqual(bossIntroState(resumed.bossIntro),bossIntroState(intro));assert.deepEqual(resumed.bossIntroQueue,g.bossIntroQueue);
 const age=resumed.bossIntro.age;updateRun(resumed,4);assert.equal(resumed.bossIntro.age,age);resumed.status='playing';updateRun(resumed,.02);assert.ok(resumed.bossIntro.age>age);finishBossIntro(resumed);assert.equal(resumed.bossIntro.archetype,'dio');finishBossIntro(resumed);assert.equal(resumed.bossIntro,null);assert.ok(resumed.invuln>=.8);
});

test('reduced motion keeps the scene static while readable stages and skip timing remain',()=>{
 const {intro}=arrival('dio',true);assert.equal(intro.duration,1.2);assert.equal(intro.reducedMotion,true);const first=bossIntroState({...intro,age:.1}),later=bossIntroState({...intro,age:.9});for(const key of ['rotation','rise','drift','shock','roar','power','freeze','release'])assert.equal(first[key],later[key],key+' stays calm');assert.equal(first.reveal,1);assert.equal(first.title,1);assert.notEqual(first.stage,later.stage);
});

test('DOM synchronization reads only intro age and cleans up the time-stop canvas filter',()=>{
 const {intro}=arrival('dio'),styles=new Map(),arenaStyles=new Map(),classes=new Set(),actor={dataset:{frame:'0'},innerHTML:''},label={textContent:''},progress={setAttribute(k,v){this[k]=v;}},scene={dataset:{},style:{setProperty:(k,v)=>styles.set(k,v)},querySelector:s=>s==='.cinema-beat-label'?label:s==='.cinema-progress'?progress:actor},arena={classList:{toggle:(n,on)=>on?classes.add(n):classes.delete(n),remove:n=>classes.delete(n)},style:{setProperty:(k,v)=>arenaStyles.set(k,v),removeProperty:k=>arenaStyles.delete(k)}},host={closest:()=>arena,querySelector:()=>scene};
 intro.age=intro.duration*.5;const before=structuredClone(intro);updateBossIntroVisual(host,intro);assert.equal(classes.has('cinema-time-stop'),true);assert.equal(arenaStyles.get('--cinema-freeze'),'1.0000');assert.equal(scene.dataset.stage,'1');assert.equal(label.textContent,'TIME HAS STOPPED');assert.equal(progress['aria-valuenow'],'50');assert.ok(actor.innerHTML.includes('<rect'));const paused=[...styles];updateBossIntroVisual(host,intro);assert.deepEqual([...styles],paused);assert.deepEqual(intro,before);updateBossIntroVisual(host,null);assert.equal(classes.has('cinema-time-stop'),false);assert.equal(arenaStyles.has('--cinema-freeze'),false);
});

test('cinematic CSS has no independent keyframe animation that could run while paused',async()=>{
 const css=(await readFile(new URL('../src/boss-intro-cinema.css',import.meta.url),'utf8')).replace(/\/\*[\s\S]*?\*\//g,'');assert.ok(!/@keyframes|animation\s*:/.test(css));assert.ok(css.includes('.cinema-titan-jaw'));assert.ok(css.includes('.arena.cinema-time-stop>canvas'));
});
