import test from 'node:test';
import assert from 'node:assert/strict';
import {BattleInput} from '../src/input.js';
import {CHARACTERS} from '../src/game.js';
import {createRun,createHardcoreRun,resolveRift} from '../src/engine.js';
import {useSecondaryUltimate} from '../src/frieren-barrage.js';
import {saveRun,loadRun} from '../src/run-save.js';
import {finishBossIntro} from '../src/boss-intro.js';
import {defeatedRiftBoss} from '../src/rift-encounters.js';
import {summonMahoraga} from '../src/summons.js';
import {hurtGuardian} from '../src/guardian-health.js';
const frieren=CHARACTERS.find(c=>c.id==='frieren');
const memory=()=>({data:new Map(),getItem(k){return this.data.get(k)??null;},setItem(k,v){this.data.set(k,v);},removeItem(k){this.data.delete(k);}});

test('second ultimate touch and E controls fire once while an independent movement finger stays active',()=>{
 const oldWindow=globalThis.window,oldDocument=globalThis.document,canvas=new EventTarget(),button=new EventTarget(),win=new EventTarget(),doc=new EventTarget(),g=createRun(frieren);canvas.setPointerCapture=button.setPointerCapture=()=>{};doc.getElementById=id=>id==='secondary-special'?button:null;doc.querySelector=()=>null;globalThis.window=win;globalThis.document=doc;
 let casts=0;const input=new BattleInput(canvas,g,()=>{},()=>{},null,()=>{},()=>{},()=>{if(useSecondaryUltimate(g))casts++;});
 const fire=(target,type,data)=>{const e=new Event(type,{cancelable:true});Object.assign(e,data);target.dispatchEvent(e);};
 try{
  fire(canvas,'pointerdown',{pointerId:1,clientX:20,clientY:200});fire(canvas,'pointermove',{pointerId:1,clientX:65,clientY:200});fire(button,'pointerdown',{pointerId:2});assert.equal(casts,1);assert.equal(g.ultimate.type,'frieren-barrage');assert.equal(g.special,0);assert.equal(input.direction().x,1);assert.equal(input.points.size,1);
  fire(button,'click',{detail:1});assert.equal(casts,1);g.ultimate=null;g.secondarySpecial=0;fire(win,'keydown',{code:'KeyE'});assert.equal(casts,2);fire(win,'keydown',{code:'KeyE',repeat:true});assert.equal(casts,2);
  g.ultimate=null;g.secondarySpecial=0;g.status='paused';fire(win,'keydown',{code:'KeyE'});assert.equal(casts,2);g.status='playing';fire(win,'keydown',{code:'KeyE'});assert.equal(casts,3);
 }finally{input.dispose();globalThis.window=oldWindow;globalThis.document=oldDocument;}
});

test('Hardcore saves retain the second ability charge and both independent cooldowns, and older saves migrate ready',()=>{
 const g=createHardcoreRun(frieren),store=memory();g.special=31;assert.ok(useSecondaryUltimate(g));g.ultimate.age=.65;const cooldown=g.secondarySpecial;assert.ok(saveRun(g,store));let restored=loadRun(store);assert.equal(restored.ultimate.type,'frieren-barrage');assert.equal(restored.ultimate.age,.65);assert.equal(restored.special,31);assert.equal(restored.secondarySpecial,cooldown);assert.equal(restored.status,'paused');
 delete g.secondarySpecial;delete g.secondarySpecialMax;g.ultimate=null;assert.ok(saveRun(g,store));restored=loadRun(store);assert.equal(restored.secondarySpecial,0);assert.equal(restored.secondarySpecialMax,75);
});

test('rift entry and return discard corpse visuals from the previous world without disturbing living companions',()=>{
 const g=createRun(CHARACTERS.find(c=>c.id==='megumi'));g.p.x=1200;g.p.y=800;const first=summonMahoraga(g);hurtGuardian(g,first,1e9);assert.equal(g.summonDeaths.length,1);const living=summonMahoraga(g);g.status='rift';g.rifts.portal={bossId:'sukunaheian',x:g.p.x,y:g.p.y,serial:1,age:0};assert.ok(resolveRift(g,true));finishBossIntro(g);assert.equal(g.summonDeaths.length,0);assert.ok(g.summons.some(s=>s.id===living.id));const boss=g.enemies.find(e=>e.riftBoss);g.summonDeaths=[{x:0,y:0}];boss.hp=0;boss.enraged=true;assert.ok(defeatedRiftBoss(g,boss));assert.equal(g.summonDeaths.length,0);assert.deepEqual([g.p.x,g.p.y],[1200,800]);assert.ok(g.summons.some(s=>s.id===living.id));
});
