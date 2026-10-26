import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {CHARACTERS} from '../src/game.js';
import {createRun,updateRun} from '../src/engine.js';
import {BOSS_CINEMATICS,queueBossIntro,bossIntroMarkup,bossIntroState,updateBossIntroVisual,finishBossIntro} from '../src/boss-intro.js';
import {cinematicArt} from '../src/boss-cinema-art.js';
import {astronautsScene,lastSilenceScene} from '../src/primal-cinema-art.js';
import {saveRun,loadRun} from '../src/run-save.js';

const intro=(archetype,extra={})=>({id:101,archetype,name:archetype==='darknessdevil'?'Darkness Devil':'Death Devil',title:'THE PRIMORDIAL FEAR',color:'#c5c8b7',wave:5,age:0,duration:BOSS_CINEMATICS[archetype].duration,...extra});
const memory=()=>({data:new Map(),getItem(k){return this.data.get(k);},setItem(k,v){this.data.set(k,v);},removeItem(k){this.data.delete(k);}});

test('Darkness has fourteen detailed opposed astronauts, an open prayer avenue and a distinct scenic reveal',()=>{
 const art=astronautsScene();assert.equal((art.match(/data-astronaut=/g)||[]).length,14);
 for(const side of ['left','right'])for(let i=0;i<7;i++)assert.ok(art.includes(`data-astronaut="${side}-${i}"`));
 for(const motif of ['cinema-astronaut-avenue','cinema-primordial-void','cinema-darkness-sword','cinema-primal-mist'])assert.ok(art.includes(motif),motif);
 assert.ok(art.includes('scale(-'),'the second row faces inward');assert.ok(art.includes('#27333a'),'dark visors stay visible inside pale helmets');assert.ok(art.includes('M-29 -95'),'backpacks have their own silhouette');assert.ok(art.includes('M20 -94'),'hands meet in prayer');
 const themed=cinematicArt('astronauts',intro('darknessdevil'));assert.match(themed,/cinema-art-astronauts/);assert.notEqual(themed,cinematicArt('horror',intro('darknessdevil')));assert.ok(art.length<65000);assert.ok(!/NaN|Infinity|https?:|<script|animateTransform|<animate\b/.test(art));
});

test('Death has an inverted city, five hanging bells and genuinely opposed parting white curtains',()=>{
 const art=lastSilenceScene();assert.equal((art.match(/class="cinema-white-curtain /g)||[]).length,2);assert.match(art,/translate\(1000 0\) scale\(-1 1\)/);
 for(const motif of ['cinema-inverted-city','cinema-funeral-bells','cinema-last-silence-rays'])assert.ok(art.includes(motif));
 assert.ok(art.length<25000);assert.ok(!/NaN|Infinity|https?:|<script|animateTransform|<animate\b/.test(art));assert.notEqual(art,astronautsScene());
 assert.match(cinematicArt('lastsilence',intro('deathdevil')),/cinema-art-lastsilence/);
});

test('primal entrances first establish the scene, then reveal the boss and finally its title from the saved clock',()=>{
 for(const id of ['darknessdevil','deathdevil']){
  const base=intro(id),first=bossIntroState({...base,age:base.duration*.1}),middle=bossIntroState({...base,age:base.duration*.5}),last=bossIntroState({...base,age:base.duration*.9});
  assert.equal(first.apparition,0);assert.equal(first.title,0);assert.ok(middle.apparition>0&&middle.apparition<1);assert.equal(middle.title,0);assert.equal(last.apparition,1);assert.equal(last.title,1);assert.ok(first.approach<middle.approach);assert.equal(last.curtain,1);assert.equal(last.void,1);
  assert.deepEqual([first.stage,middle.stage,last.stage],[0,1,2]);assert.equal(new Set([first.label,middle.label,last.label]).size,3);
  const html=bossIntroMarkup({...base,age:base.duration*.9});assert.ok(html.includes(id==='darknessdevil'?'cinema-theme-astronauts':'cinema-theme-lastsilence'));assert.ok(html.includes('id="skip-intro"'));assert.ok(html.includes('role="progressbar"'));assert.ok(html.includes('cinema-actor-sprite'));assert.ok(!html.includes('undefined'));
 }
 assert.equal(BOSS_CINEMATICS.darknessdevil.duration,6.2);assert.equal(BOSS_CINEMATICS.deathdevil.duration,5.2);
});

test('quiet primal scenes keep all their decorative geometry fixed while readable beats advance',()=>{
 for(const id of ['darknessdevil','deathdevil']){
  const a=bossIntroState(intro(id,{duration:1.2,reducedMotion:true,age:.1})),b=bossIntroState(intro(id,{duration:1.2,reducedMotion:true,age:1}));
  for(const key of ['approach','void','apparition','curtain','title','rotation','rise','drift','shock','roar','power','release'])assert.equal(a[key],b[key],id+' '+key);
  assert.equal(a.apparition,1);assert.equal(a.title,1);assert.notEqual(a.label,b.label);
 }
});

test('primal DOM geometry reads only the intro clock and synchronization never mutates a saved entrance',()=>{
 const values=new Map(),actor={dataset:{frame:'0'},innerHTML:''},label={textContent:''},progress={setAttribute(k,v){this[k]=v;}},scene={dataset:{},style:{setProperty:(k,v)=>values.set(k,v)},querySelector:s=>s==='.cinema-beat-label'?label:s==='.cinema-progress'?progress:actor},host={querySelector:()=>scene};
 const e=intro('darknessdevil',{age:3.1}),before=structuredClone(e);updateBossIntroVisual(host,e);assert.equal(values.get('--intro-apparition'),bossIntroState(e).apparition.toFixed(4));for(const v of values.values())assert.ok(Number.isFinite(Number(v)));const still=[...values];updateBossIntroVisual(host,e);assert.deepEqual([...values],still);assert.deepEqual(e,before);
});

test('a saved astronaut procession resumes at the same scene and a queued Death arrival remains skippable',()=>{
 const g=createRun(CHARACTERS[0]);g.spawn=g.eliteAt=999999;g.time=17;g.p.hp=70;queueBossIntro(g,intro('darknessdevil'),5);queueBossIntro(g,{...intro('deathdevil'),id:102},5);g.bossIntro.age=2.9;const expected=bossIntroState(g.bossIntro),store=memory();assert.ok(saveRun(g,store));const loaded=loadRun(store);assert.ok(loaded);assert.equal(loaded.status,'paused');assert.deepEqual(bossIntroState(loaded.bossIntro),expected);assert.equal(loaded.bossIntroQueue[0].archetype,'deathdevil');
 const hp=loaded.p.hp,x=loaded.p.x,y=loaded.p.y;updateRun(loaded,1);assert.deepEqual(bossIntroState(loaded.bossIntro),expected);loaded.status='playing';updateRun(loaded,.1,{x:1,y:0});assert.ok(loaded.bossIntro.age>2.9);assert.equal(loaded.time,17);assert.equal(loaded.p.hp,hp);assert.deepEqual([loaded.p.x,loaded.p.y],[x,y]);assert.ok(finishBossIntro(loaded));assert.equal(loaded.bossIntro.archetype,'deathdevil');assert.ok(finishBossIntro(loaded));assert.equal(loaded.bossIntro,null);assert.ok(loaded.invuln>=.8);
});

test('astronaut and curtain CSS contains no independent animation and includes phone and landscape layouts',async()=>{
 const css=(await readFile(new URL('../src/boss-intro-cinema.css',import.meta.url),'utf8')).replace(/\/\*[\s\S]*?\*\//g,'');assert.ok(!/@keyframes|animation\s*:/.test(css));for(const name of ['approach','void','apparition','curtain'])assert.ok(css.includes('var(--intro-'+name+')'));assert.ok(css.includes('.cinema-astronaut-avenue'));assert.ok(css.includes('.cinema-white-curtain'));assert.ok(css.includes('(orientation:landscape)'));
});
