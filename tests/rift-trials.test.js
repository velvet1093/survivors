import test from 'node:test';
import assert from 'node:assert/strict';
import {RIFT_TRIALS,beginRiftTrial,updateRiftTrial,finishRiftTrial,restoreRiftTrial,riftTrialActive,riftTrialText} from '../src/rift-trials.js';

function fixture(id='darknessdevil'){
 const e={id:41,archetype:id,boss:true,riftBoss:true,hp:50,maxHp:100,enraged:false,attackCD:0,statuses:{},x:155,y:60};
 const g={status:'playing',p:{x:0,y:140,hp:100,maxHp:100,statuses:{},form:0,pose:''},enemies:[e],rifts:{active:{bossEntityId:e.id,bossId:id},cleared:0},riftArena:{radius:760,bossId:id},shots:[],fields:[],enemyShots:[],hazards:[],crimsonEchoes:[],effects:[],particles:[],ultimate:null,freeze:0,dash:null,invuln:0,money:0,bossKills:0,chests:[],summons:[],cloneUnits:[]};
 return {g,e};
}
function start(id){const v=fixture(id);assert.ok(beginRiftTrial(v.g,v.e));return {...v,q:v.g.riftTrial};}
const move=(g,p)=>Object.assign(g.p,{x:p.x,y:p.y});
const step=(g,dt=.05,damage=[])=>updateRiftTrial(g,dt,{hitPlayer:(_,amount)=>{damage.push(amount);return true;}});
function finishByRules(g){
 const q=g.riftTrial;
 if(q.kind==='blackout'||q.kind==='paths'){for(const v of q.goals){move(g,v);step(g);}}
 else if(q.kind==='offerings'){for(const v of q.goals){move(g,v);step(g);move(g,q.shrine);step(g);}}
 else if(q.kind==='spotlights'){for(const v of q.goals){move(g,v);step(g,.81);}}
 else if(q.kind==='mirrors'){for(let i=0;i<3;i++){move(g,{x:0,y:0});step(g,1.2);move(g,q.goals.find(v=>v.real));step(g);}}
 else if(q.kind==='shelters'){for(const v of q.goals){move(g,v);step(g,4);}}
 else if(q.kind==='seals'){for(const v of q.goals){move(g,v);step(g,1.21);}}
 else if(q.kind==='vents'){for(const v of q.goals){move(g,v);step(g);move(g,{x:0,y:0});step(g,1.51);}}
 else if(q.kind==='procession'){for(let i=0;i<3;i++){move(g,q.path[i+1]);step(g,4);}}
 else if(q.kind==='orbit'){for(let i=0;i<3;i++){move(g,q.goals.find(v=>!v.done));step(g);}}
 else if(q.kind==='tag'){for(let k=0;k<200&&g.riftTrial;k++){move(g,q.goals[q.stage]);step(g,.05);}}
}

test('all nine rifts define distinct playable interludes and complete only their objective without paying boss rewards',()=>{
 assert.equal(Object.keys(RIFT_TRIALS).length,11);assert.equal(new Set(Object.values(RIFT_TRIALS).map(v=>v.kind)).size,11);
 for(const [id,def]of Object.entries(RIFT_TRIALS)){
  const {g,e,q}=start(id);assert.equal(q.kind,def.kind);assert.equal(q.total,def.total);assert.ok(def.name&&def.instruction.length>70);assert.equal(e.enraged,false);assert.ok(riftTrialActive(g));assert.equal(riftTrialText(g).instruction,def.instruction);
  for(const v of q.goals){assert.ok(Math.abs(v.x)<g.riftArena.radius-90);assert.ok(Math.abs(v.y)<g.riftArena.radius-90);assert.ok(v.r>0);}
  finishByRules(g);assert.equal(g.riftTrial,null,id);assert.equal(e.enraged,true,id);assert.equal(e.riftTrialDone,true);assert.equal(e.riftTrialLocked,false);assert.ok(e.attackCD>=2.5);assert.ok(g.invuln>=1.5);assert.equal(e.hp,50);assert.equal(g.money,0);assert.equal(g.bossKills,0);assert.equal(g.rifts.cleared,0);assert.equal(g.chests.length,0);assert.equal(finishRiftTrial(g),false);assert.equal(beginRiftTrial(g,e),false);
 }
});

test('a trial starts once at half health only for its live actual optional-rift owner',()=>{
 for(const change of [(g,e)=>e.hp=51,(g,e)=>e.hp=0,(g,e)=>e.riftBoss=false,(g,e)=>e.boss=false,(g,e)=>e.enraged=true,(g,e)=>e.riftTrialDone=true,(g,e)=>e.riftTrialStarted=true,(g,e)=>g.status='paused',(g,e)=>g.bossIntro={},(g,e)=>g.rifts.active.bossEntityId=42,(g,e)=>g.rifts.active.bossId='beerus',(g,e)=>g.riftArena=null]){
  const {g,e}=fixture();change(g,e);assert.equal(beginRiftTrial(g,e),false);assert.equal(g.riftTrial,undefined);
 }
 const {g,e}=fixture();assert.equal(beginRiftTrial(g,e),true,'exactly half HP starts');assert.equal(beginRiftTrial(g,e),false);
});

test('Darkness requires three distinct astronaut remains, expands the lamp and restores light after the last find',()=>{
 const {g,e,q}=start();assert.equal(q.hideBoss,true);assert.deepEqual(q.goals.map(v=>v.kind),['helmet','gauntlet','boot']);assert.equal(q.lightRadius,130);
 move(g,q.goals[0]);step(g);assert.equal(q.progress,1);assert.equal(q.lightRadius,160);step(g,1);assert.equal(q.progress,1,'standing on a found part never counts twice');assert.equal(e.enraged,false);
 move(g,q.goals[1]);step(g);assert.equal(q.progress,2);assert.equal(q.lightRadius,190);assert.match(riftTrialText(g).detail,/2 \/ 3/);
 move(g,q.goals[2]);step(g);assert.equal(g.riftTrial,null);assert.equal(e.enraged,true);assert.equal(g.riftTrialAfterglow.kind,'blackout');assert.ok(g.riftTrialAfterglow.duration>0);
});

test('Darkness reappears nearby and safely inside the arena when light returns, without healing or moving other bosses',()=>{
 for(const [w,h]of [[390,844],[844,390],[1440,1000]])for(const [x,y]of [[0,140],[-748,-748],[-748,748],[748,-748],[748,748]]){
  const {g,e}=fixture();g.view={w,h};g.zoom=.9;e.r=48;assert.ok(beginRiftTrial(g,e));move(g,{x,y});const hp=e.hp;finishRiftTrial(g);
  const d=Math.hypot(e.x-g.p.x,e.y-g.p.y);assert.ok(d>110&&d<230,'the returning boss is visible nearby with safe separation');assert.ok(Math.abs(e.x)<=g.riftArena.radius-e.r-24&&Math.abs(e.y)<=g.riftArena.radius-e.r-24);assert.equal(e.hp,hp);assert.ok(e.attackCD>=2.5);const position=[e.x,e.y];assert.equal(finishRiftTrial(g),false);assert.deepEqual([e.x,e.y],position,'completion cannot recall it again');
 }
 const {g,e}=start('beerus'),before=[e.x,e.y];finishRiftTrial(g);assert.deepEqual([e.x,e.y],before,'other bosses keep their existing phase position');
});

test('Eren beacons and Walpurgis spotlights enforce order while the spotlight actually needs an uninterrupted hold',()=>{
 const paths=start('foundereren');move(paths.g,paths.q.goals[2]);step(paths.g);assert.equal(paths.q.progress,0);move(paths.g,paths.q.goals[0]);step(paths.g);assert.equal(paths.q.progress,1);assert.equal(paths.q.goals[1].active,true);assert.equal(paths.q.goals[0].active,false);
 const {g,q}=start('walpurgisrift');move(g,q.goals[1]);step(g,1);assert.equal(q.progress,0);move(g,q.goals[0]);step(g,.4);assert.ok(q.goals[0].charge>.45&&q.goals[0].charge<.55);move(g,{x:0,y:0});step(g);assert.equal(q.goals[0].charge,0);move(g,q.goals[0]);step(g,.79);assert.equal(q.progress,0);step(g,.02);assert.equal(q.progress,1);assert.equal(q.goals[1].active,true);
});

test('Beerus requires three deliveries and carrying a pudding prevents picking another up',()=>{
 const {g,q}=start('beerus'),[a,b]=q.goals;move(g,a);step(g);assert.equal(q.carrying,a.id);assert.equal(a.carried,true);assert.equal(q.progress,0);move(g,b);step(g);assert.equal(q.carrying,a.id);assert.ok(!b.carried);move(g,q.shrine);step(g);assert.equal(q.carrying,null);assert.equal(a.done,true);assert.equal(q.progress,1);assert.ok(q.deliveryFlash>0);move(g,b);step(g);assert.equal(q.carrying,b.id);assert.match(riftTrialText(g).detail,/return to the golden shrine/);
});

test('Aizen marks one real mirror per round and a false mirror stings once during the choice grace period',()=>{
 const {g,q}=start('aizenrift'),damage=[];assert.equal(q.goals.filter(v=>v.real).length,1);move(g,q.goals.find(v=>!v.real));step(g,.05,damage);assert.deepEqual(damage,[8]);assert.equal(q.progress,0);assert.equal(q.mistakes,1);step(g,.3,damage);assert.equal(damage.length,1);assert.ok(q.choiceCD>0);move(g,{x:0,y:0});step(g,1.2,damage);const before=q.realIndex;move(g,q.goals.find(v=>v.real));step(g,.05,damage);assert.equal(q.progress,1);assert.notEqual(q.realIndex,before);assert.equal(q.goals.filter(v=>v.real).length,1);assert.equal(damage.length,1);
});

test('Madara and Death tolls use the saved sanctuary clock, hurting outside while still allowing surviving rounds to advance',()=>{
 const {g,q}=start('madararift'),damage=[];move(g,q.goals[0]);step(g,3.9,damage);assert.equal(q.progress,0);assert.equal(damage.length,0);step(g,.1,damage);assert.equal(q.progress,1);assert.equal(q.goals[1].active,true);assert.equal(damage.length,0);move(g,{x:-650,y:650});step(g,4,damage);assert.equal(q.progress,2);assert.deepEqual(damage,[12]);
 const procession=start('deathdevil'),hits=[];const old={...procession.q.sanctuary};step(procession.g,1,hits);assert.notDeepEqual(procession.q.sanctuary,old);assert.equal(procession.q.progress,0);move(procession.g,procession.q.path[1]);step(procession.g,3,hits);assert.equal(procession.q.progress,1);assert.equal(hits.length,0);move(procession.g,{x:-650,y:650});step(procession.g,4,hits);assert.equal(procession.q.progress,2);assert.deepEqual(hits,[12]);
});

test('Madara shelters are reachable from every arena corner by the slowest trial movement without a dash',()=>{
 for(const radius of [760,800])for(const [sx,sy]of [[-1,-1],[-1,1],[1,-1],[1,1],[0,-1],[1,0],[0,1],[-1,0]]){
  const {g,e}=fixture('madararift');g.riftArena.radius=radius;g.p.x=sx*(radius-12);g.p.y=sy*(radius-12);const start={x:g.p.x,y:g.p.y};assert.ok(beginRiftTrial(g,e));const q=g.riftTrial,hits=[];
  assert.ok(Math.hypot(q.goals[0].x-start.x,q.goals[0].y-start.y)<=450,'first shelter has a short path from the actual entry position');
  for(let i=1;i<q.goals.length;i++)assert.ok(Math.hypot(q.goals[i].x-q.goals[i-1].x,q.goals[i].y-q.goals[i-1].y)<=300+1e-9,'later shelter steps stay short');
  const fixed=structuredClone(q.goals.map(v=>({x:v.x,y:v.y})));
  for(let round=0;round<3;round++)for(let tick=0;tick<80;tick++){
   const target=q.goals[round],dx=target.x-g.p.x,dy=target.y-g.p.y,d=Math.hypot(dx,dy),travel=Math.min(d,160*.05);if(d){g.p.x+=dx/d*travel;g.p.y+=dy/d*travel;}step(g,.05,hits);
  }
  assert.equal(g.riftTrial,null);assert.deepEqual(hits,[],'walking at 160 units/second reaches every shelter before its four-second toll');assert.deepEqual(q.goals.map(v=>({x:v.x,y:v.y})),fixed,'warnings never follow the moving player');
 }
});

test('Sukuna seals channel in any order and lose partial channel progress when the player leaves',()=>{
 const {g,q}=start('sukunaheian'),last=q.goals[2];move(g,last);step(g,.6);assert.ok(last.charge>.49&&last.charge<.51);assert.equal(q.progress,0);move(g,{x:0,y:0});step(g);assert.equal(last.charge,0);move(g,last);step(g,1.21);assert.equal(last.done,true);assert.equal(q.progress,1);assert.equal(q.goals[0].active,true);assert.equal(q.goals[1].active,true);
});

test('Boros vents arm on touch, warn a fixed blast and count once after opening whether escaped or hit',()=>{
 const {g,q}=start('borosrift'),damage=[];const v=q.goals[0];move(g,v);step(g,.05,damage);assert.equal(v.armed,true);assert.equal(v.done,false);assert.equal(q.hazards.length,1);const mark=structuredClone(q.hazards[0]);move(g,{x:0,y:0});step(g,1.5,damage);assert.equal(v.done,true);assert.equal(q.progress,1);assert.equal(damage.length,0);assert.deepEqual([mark.x,mark.y],[v.x,v.y]);step(g,.5,damage);move(g,v);step(g,.3,damage);assert.equal(q.progress,1);const second=q.goals[1];move(g,second);step(g,1.6,damage);assert.equal(second.done,true);assert.equal(q.progress,2);assert.deepEqual(damage,[12]);
});

test('trial warnings stay fixed, bounded and harmless before release; menus and entrances hold every challenge clock',()=>{
 const {g,q}=start(),hits=[];step(g,4.51,hits);assert.equal(q.hazards.length,1);const h=q.hazards[0],xy=[h.x,h.y];assert.equal(hits.length,0);move(g,{x:600,y:600});step(g,1.9,hits);assert.deepEqual([h.x,h.y],xy);assert.equal(hits.length,0);assert.equal(q.progress,0);
 for(const id of Object.keys(RIFT_TRIALS))for(const kind of ['paused','intro']){const v=start(id);if(kind==='paused')v.g.status='paused';else v.g.bossIntro={age:0};const before=structuredClone(v.q);step(v.g,10);assert.deepEqual(v.q,before,id+' '+kind);}
 for(const id of ['darknessdevil','foundereren','beerus','walpurgisrift','sukunaheian']){const v=start(id);move(v.g,{x:620,y:620});for(let i=0;i<5;i++)step(v.g,30);assert.equal(v.q.progress,0);assert.ok(v.q.hazards.length<=16);assert.ok(v.q.hazards.every(h=>[h.x,h.y,h.age,h.delay,h.duration,h.damage].every(Number.isFinite)));}
});

test('serialized partial trials restore exact clocks and objectives and reject orphan or corrupted records without trapping a boss',()=>{
 for(const id of Object.keys(RIFT_TRIALS)){const {g,q}=start(id);step(g,.37);const clone=JSON.parse(JSON.stringify(g)),expected=structuredClone(clone.riftTrial);assert.equal(restoreRiftTrial(clone),true,id);assert.deepEqual(clone.riftTrial,expected,id);assert.equal(clone.enemies[0].riftTrialLocked,true);}
 for(const change of [q=>q.age=NaN,q=>q.goals[0]=null,q=>q.goals[0].x=Infinity,q=>q.goals[0].done=true,q=>q.hazards=[{shape:'circle',x:0,y:0,r:0,age:0,delay:0,duration:1,damage:1}],q=>q.kind='other']){const {g,e,q}=start();change(q);assert.doesNotThrow(()=>restoreRiftTrial(g));assert.equal(g.riftTrial,null);assert.equal(e.enraged,true);assert.equal(e.riftTrialDone,true);}
 for(const id of ['aizenrift','beerus','borosrift']){const {g}=start(id);g.riftTrial.goals=[null];assert.doesNotThrow(()=>restoreRiftTrial(g));assert.equal(g.riftTrial,null);}
 const {g}=start();g.enemies=[];assert.equal(restoreRiftTrial(g),false);assert.equal(g.riftTrial,null);
});

test('completion restores the suspended ultimate and guardian identity without healing or losing adaptation',()=>{
 const {g,e}=fixture();g.golem={x:-500,y:-500,hp:43,maxHp:100,beam:{x:1,y:2,tx:3,ty:4,age:.2}};g.summons=[{x:-600,y:-600,hp:12,adaptation:3}];g.p.form=1;g.p.pose='berserk';g.ultimate={type:'frieren',age:3,golem:g.golem};const power=g.ultimate;assert.ok(beginRiftTrial(g,e));assert.equal(g.ultimate,null);assert.strictEqual(g.riftTrial.suspendedUltimate,power);g.p.x=400;g.p.y=350;g.p.form=0;g.p.pose='';finishRiftTrial(g);assert.strictEqual(g.ultimate,power);assert.strictEqual(g.ultimate.golem,g.golem);assert.equal(g.golem.hp,43);assert.deepEqual(g.golem.beam,{x:1,y:2,tx:3,ty:4,age:.2});assert.equal(g.summons[0].hp,12);assert.equal(g.summons[0].adaptation,3);assert.ok(Math.hypot(g.golem.x-g.p.x,g.golem.y-g.p.y)<90);assert.equal(g.p.form,1);assert.equal(g.p.pose,'berserk');
});
