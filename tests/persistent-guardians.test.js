import test from 'node:test';
import assert from 'node:assert/strict';
import {CHARACTERS} from '../src/game.js';
import {createRun,useSpecial,updateRun,spawnEnemy,resolveRift} from '../src/engine.js';
import {summonMahoraga,summonPack,summonNue,updateSummons,restorePersistentSummons} from '../src/summons.js';
import {startFrierenGolem,updateFrierenGolem,restoreFrierenGolem} from '../src/frieren-golem.js';
import {guardianTarget,guardianMaxHp,summonLevelPower,hurtGuardian,drawGuardianHealth} from '../src/guardian-health.js';
import {summonPixels} from '../src/summon-art.js';
import {saveRun,loadRun} from '../src/run-save.js';
import {defeatedRiftBoss} from '../src/rift-encounters.js';
import {ensureWorld} from '../src/world.js';
const hero=id=>CHARACTERS.find(c=>c.id===id);
function run(id){const g=createRun(hero(id),3);ensureWorld(g);g.spawn=g.eliteAt=g.nextBossWave=1e9;g.p.weapons={};g.invuln=1e9;g.p.nextXp=1e9;return g;}
const memory=()=>({data:new Map(),getItem(k){return this.data.get(k)||null;},setItem(k,v){this.data.set(k,v);},removeItem(k){this.data.delete(k);}});
const callbacks={damage(g,e,v){e.hp-=v;},burst(){}};
test('Mahoraga outlives the animation and recasting fully heals the same adapted guardian',()=>{
 const g=run('megumi');assert.ok(useSpecial(g));const s=g.summons[0],id=s.id;assert.equal(s.life,Infinity);assert.equal(s.maxHp,guardianMaxHp(g,'mahoraga'));hurtGuardian(g,s,70);s.adaptation=3;
 const hp=s.hp;for(let i=0;i<150;i++)updateRun(g,.1);assert.equal(g.ultimate,null);assert.equal(g.summons.filter(x=>x.kind==='mahoraga').length,1);assert.equal(s.hp,hp);
 g.special=0;assert.ok(useSpecial(g));assert.equal(g.summons[0].id,id);assert.equal(g.summons[0].hp,s.maxHp);assert.equal(g.summons[0].adaptation,3);assert.equal(g.summons.length,1);
});
test('the golem fights after the ultimate ends and recasting fully heals it without a duplicate',()=>{
 const g=run('frieren');assert.ok(useSpecial(g));const s=g.golem,id=s.id;assert.strictEqual(g.ultimate.golem,s);hurtGuardian(g,s,80);const hp=s.hp;
 for(let i=0;i<130;i++)updateRun(g,.1);assert.equal(g.ultimate,null);assert.strictEqual(g.golem,s);assert.equal(s.hp,hp);const e=spawnEnemy(g,false,false,'zoomer');Object.assign(e,{x:s.x+35,y:s.y,maxHp:10000,hp:10000,speed:0,attackCD:999});
 for(let i=0;i<100;i++)updateRun(g,.02);assert.ok(e.hp<10000);assert.ok(s.hp<s.maxHp);g.special=0;assert.ok(useSpecial(g));assert.equal(g.golem.id,id);assert.equal(g.golem.hp,s.maxHp);assert.equal(g.summons.filter(x=>x.kind==='frierenGolem').length,0);
});
test('guardians intercept damage, suffer warned hazards and melee contact, and can be killed and summoned again',()=>{
 for(const type of ['megumi','frieren']){const g=run(type);assert.ok(useSpecial(g));const s=type==='megumi'?g.summons[0]:g.golem,initial=s.hp;g.enemyShots=[{x:s.x,y:s.y,r:5,damage:20,life:2}];if(type==='megumi')updateSummons(g,.01,callbacks);else updateFrierenGolem(g,.01,callbacks);assert.ok(s.hp<initial);assert.equal(g.enemyShots[0]?.life||0,0);
  const hp=s.hp;g.hazards=[{shape:'circle',x:s.x,y:s.y,r:80,age:1,delay:.5,duration:2,damage:30}];s.contactCD=0;if(type==='megumi')updateSummons(g,.01,callbacks);else updateFrierenGolem(g,.01,callbacks);assert.ok(s.hp<hp);
  hurtGuardian(g,s,1e6);if(type==='megumi')updateSummons(g,.01,callbacks);else updateFrierenGolem(g,.01,callbacks);assert.equal(type==='megumi'?g.summons.length:g.golem, type==='megumi'?0:null);g.ultimate=null;g.special=0;assert.ok(useSpecial(g));const next=type==='megumi'?g.summons[0]:g.golem;assert.notEqual(next.id,s.id);assert.equal(next.hp,next.maxHp);
 }
});
test('normal enemies choose a closer living guardian, while bosses and dead guardians retain their target',()=>{
 const g=run('megumi'),s=summonMahoraga(g),e={x:s.x+5,y:s.y,hp:100};assert.strictEqual(guardianTarget(g,e),s);assert.strictEqual(guardianTarget(g,{...e,boss:true}),g.p);s.hp=0;assert.strictEqual(guardianTarget(g,e),g.p);
});
test('legacy timed guardians migrate once and current HP survives paused checkpoints with no duplicate summon',()=>{
 const g=run('frieren');g.ultimate={type:'frieren',age:5,duration:10,golem:{id:33,kind:'frierenGolem',x:0,y:0,phase:'idle',phaseAge:0,age:5,attackCD:1,walk:0}};restoreFrierenGolem(g);assert.equal(g.golem.hp,g.golem.maxHp);hurtGuardian(g,g.golem,42);const hp=g.golem.hp,storage=memory();saveRun(g,storage);const r=loadRun(storage);assert.equal(r.golem.hp,hp);assert.strictEqual(r.ultimate.golem,r.golem);const snapshot=JSON.stringify(r.golem);updateRun(r,20);assert.equal(JSON.stringify(r.golem),snapshot);
 const m=run('megumi');m.summons=[{id:1,kind:'mahoraga',x:0,y:0,life:.01,adaptation:2},{id:2,kind:'mahoraga',x:0,y:0,life:5}];restorePersistentSummons(m);assert.equal(m.summons.length,1);assert.equal(m.summons[0].life,Infinity);assert.equal(m.summons[0].hp,m.summons[0].maxHp);assert.equal(m.summons[0].adaptation,2);
});
test('redesigned Mahoraga has detailed wheel, muscles and sword motion, and both HP bars report their actual health',()=>{
 const still=summonPixels('mahoraga'),attack=summonPixels('mahoraga',{attack:true,frame:2});assert.ok(still.filter(Boolean).length>1200);assert.ok(new Set(still.filter(Boolean)).size>18);assert.notDeepEqual(still,attack);const calls=[];const c=new Proxy({}, {get:(t,k)=>t[k]||((...args)=>calls.push([k,...args])),set:(t,k,v)=>(t[k]=v,true)});drawGuardianHealth(c,{kind:'mahoraga',x:0,y:0,hp:123,maxHp:480},'MAHORAGA');drawGuardianHealth(c,{kind:'frierenGolem',x:0,y:0,hp:100,maxHp:380},'GOLEM');assert.ok(calls.some(([name,text])=>name==='fillText'&&text==='MAHORAGA 123 / 480'));assert.ok(calls.some(([name,text])=>name==='fillText'&&text==='GOLEM 100 / 380'));
});

test('purchased duration mastery becomes guardian HP instead of a useless expiration bonus',()=>{
 for(const [id,bonus]of [['megumi',1],['frieren',.6]]){const base=run(id),trained=run(id);trained.p.meta.ultimateDuration=bonus;useSpecial(base);useSpecial(trained);const a=id==='megumi'?base.summons[0]:base.golem,b=id==='megumi'?trained.summons[0]:trained.golem;assert.equal(b.maxHp,Math.round(a.maxHp*(1+bonus*.1)));assert.equal(b.hp,b.maxHp);}
});

test('rift teleporting and return preserve the living guardian identity and wounds',()=>{
 for(const type of ['megumi','frieren']){const g=run(type);g.p.x=850;g.p.y=-640;useSpecial(g);const guardian=type==='megumi'?g.summons[0]:g.golem;hurtGuardian(g,guardian,37);const id=guardian.id,hp=guardian.hp;
  g.rifts.portal={bossId:'beerus',x:g.p.x,y:g.p.y,age:0,serial:1};g.rifts.opened=1;g.status='rift';assert.ok(resolveRift(g,true));assert.equal((type==='megumi'?g.summons[0]:g.golem).id,id);assert.equal(guardian.hp,hp);const boss=g.enemies.find(e=>e.riftBoss);boss.hp=0;assert.ok(defeatedRiftBoss(g,boss));assert.equal((type==='megumi'?g.summons[0]:g.golem).id,id);assert.equal(guardian.hp,hp);assert.equal(g.p.x,850);assert.equal(g.p.y,-640);
 }
});

test('living guardians gain uncapped level HP in place without erasing wounds or healing on restore',()=>{
 for(const type of ['megumi','frieren']){
  const g=run(type);assert.ok(useSpecial(g));const guardian=type==='megumi'?g.summons[0]:g.golem,id=guardian.id,base=guardian.maxHp;
  guardian.hp=base*.375;g.p.level=11;updateRun(g,.01);
  assert.equal(guardian.id,id);assert.equal(guardian.maxHp,Math.round(base*1.3));assert.ok(Math.abs(guardian.hp/guardian.maxHp-.375)<1e-12);
  const wounded=guardian.hp;for(let i=0;i<20;i++)updateRun(g,.01);assert.equal(guardian.hp,wounded);
  const store=memory();assert.ok(saveRun(g,store));const restored=loadRun(store),saved=type==='megumi'?restored.summons[0]:restored.golem;
  assert.equal(saved.hp,wounded);assert.equal(saved.maxHp,guardian.maxHp);
  restored.status='playing';updateRun(restored,.01);assert.equal(saved.hp,wounded);
  g.p.level=101;updateRun(g,.01);assert.equal(guardian.maxHp,base*4);assert.ok(Math.abs(guardian.hp/guardian.maxHp-.375)<1e-12);
  g.ultimate=null;g.special=0;assert.ok(useSpecial(g));assert.equal(guardian.id,id);assert.equal(guardian.hp,guardian.maxHp);
 }
});

test('level growth strengthens real Mahoraga strikes and both golem attack types without compounding',()=>{
 for(const type of ['megumi','frieren'])for(const beam of type==='frieren'?[false,true]:[false]){
  const hits=[];
  for(const level of [1,21]){
   const g=run(type);g.p.level=level;assert.ok(useSpecial(g));const s=type==='megumi'?g.summons[0]:g.golem;
   const e=spawnEnemy(g,false,false,'zoomer');Object.assign(e,{x:100,y:0,hp:100000,maxHp:100000,speed:0,attackCD:999});s.x=s.y=0;
   if(type==='megumi')s.attackCD=0;
   else if(beam)Object.assign(s,{phase:'beam',phaseAge:0,beam:{x:4,y:-65,tx:100,ty:0,width:30,age:0,duration:1.15,tick:0}});
   else Object.assign(s,{phase:'slam-windup',phaseAge:.45,aim:{x:100,y:0}});
   let damage=0;const cb={damage(g,target,value){if(target===e)damage+=value;},burst(){}};
   if(type==='megumi')updateSummons(g,.01,cb);else updateFrierenGolem(g,.01,cb);
   assert.ok(damage>0);hits.push(damage);assert.equal(summonLevelPower(g),level===1?1:1.5);
  }
  assert.ok(Math.abs(hits[1]/hits[0]-1.5)<1e-12);
 }
});

test('Divine Dogs and Nue scale with their owner level while refreshes remain single instances',()=>{
 const g=run('megumi');summonPack(g,2,2);summonNue(g,3,2);const ids=g.summons.map(s=>s.id),base=g.summons.map(s=>s.damage);
 g.p.level=21;updateSummons(g,.01,callbacks);for(let i=0;i<3;i++)assert.equal(g.summons[i].damage,base[i]*1.5);
 for(let i=0;i<5;i++)updateSummons(g,.01,callbacks);for(let i=0;i<3;i++)assert.equal(g.summons[i].damage,base[i]*1.5);
 summonPack(g,2,2);summonNue(g,3,2);assert.deepEqual(g.summons.map(s=>s.id),ids);for(let i=0;i<3;i++)assert.equal(g.summons[i].damage,base[i]*1.5);
 const store=memory();assert.ok(saveRun(g,store));const r=loadRun(store);r.status='playing';updateSummons(r,.01,callbacks);for(let i=0;i<3;i++)assert.equal(r.summons[i].damage,base[i]*1.5);
});
