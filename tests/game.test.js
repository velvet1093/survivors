import {newWaveState} from '../src/waves.js';
import {resolveChestReward} from '../src/game.js';
import {finishBossIntro} from '../src/boss-intro.js';
import test from 'node:test';
import assert from 'node:assert/strict';
import {CHARACTERS,ITEMS,FUSIONS,createPlayer,fusionBase,fusionType,fusionIngredients,fusionIngredient,fusionConsumedIngredients,grantXp,takeLevel,getUpgradePool,getChoices,applyChoice,fusionReady,clampZoom,formatTime,openChest,chestItemCount,waveAt} from '../src/game.js';
import {createRun,spawnEnemy,castWeapon,updateRun,useSpecial,hitPlayer} from '../src/engine.js';
import {BOSSES,ENEMIES,MAP_ENEMIES,makeEnemy,updateEnemyAI,featuredBosses,pickBoss} from '../src/enemies.js';
const upgrade=(p,id,n=1)=>{for(let i=0;i<n;i++)assert.equal(applyChoice(p,{kind:'item',id}),true);};
const enemy=(id,x=100,y=0,hp=1000)=>({id,x,y,hp,maxHp:hp,speed:0,r:15,hit:0,slow:0,orbitCD:0,phase:0});
function quietRun(index=0){const g=createRun(CHARACTERS[index]);g.events.nextAt=1e9;g.chestRandom=()=>.99;g.spawn=1e6;g.eliteAt=1e6;return g;}
test('each hero starts with a unique signature weapon and passive',()=>{
  assert.equal(new Set(CHARACTERS.map(c=>c.weapon)).size,CHARACTERS.length);assert.equal(new Set(CHARACTERS.map(c=>c.passive)).size,CHARACTERS.length);
  for(const c of CHARACTERS){const p=createPlayer(c);assert.deepEqual(p.weapons,{[c.weapon]:1,...(c.secondWeapon?{[c.secondWeapon]:1}:{})});assert.deepEqual(p.passives,{[c.passive]:1});assert.equal(p.hp,p.maxHp);}
});
test('the shared pool includes all heroes’ signature weapons and passives',()=>{
  for(const c of CHARACTERS){const p=createPlayer(c),pool=getUpgradePool(p);for(const other of CHARACTERS){assert.ok(pool.some(u=>u.id===other.weapon));assert.ok(pool.some(u=>u.id===other.passive));}}
});
test('new item unlocks and upgrades obey independent five-slot limits',()=>{
  const p=createPlayer(CHARACTERS[0]);for(const id of ['blue','shuriken','kunai','orbit','eyes','headband','magnet','power'])upgrade(p,id);
  assert.equal(Object.keys(p.weapons).length,5);assert.equal(Object.keys(p.passives).length,5);
  assert.equal(applyChoice(p,{kind:'item',id:'icelance'}),false);assert.equal(applyChoice(p,{kind:'item',id:'demonextract'}),false);
  assert.ok(!getUpgradePool(p).some(c=>c.id==='icelance'||c.id==='demonextract'));upgrade(p,'ki');assert.equal(p.weapons.ki,2);
});
test('first-stage recipes require all maxed ingredients and consume only their declared secondary slot',()=>{
  // Further evolutions and created-result fusions have their own prerequisites, covered by
  // soul-gems-core.test.js instead of this first-stage fixture.
  for(const f of FUSIONS.filter(f=>!f.chestOnly&&!f.requiresEvolution&&!f.resultItem)){const base=fusionBase(f),p=createPlayer(CHARACTERS[f.weapon==='titanfists'?11:0]);if(f.weapon==='titanfists'){p.erenForm='titan';p.form=1;p.weapon='titanfists';}p.weapons={};p.passives={};for(const id of fusionIngredients(f))(ITEMS[id].type==='weapon'?p.weapons:p.passives)[id]=ITEMS[id].max-1;
    assert.equal(fusionReady(p,f),false);assert.equal(applyChoice(p,{kind:'fusion',id:f.id}),false);
    upgrade(p,base);assert.equal(fusionReady(p,f),false);for(const ingredient of fusionIngredients(f).slice(1))upgrade(p,ingredient);assert.equal(fusionReady(p,f),true);
    assert.equal(getChoices(p)[0].id,f.id);assert.equal(applyChoice(p,{kind:'fusion',id:f.id}),true);
    assert.equal(p.fusions[base],f.id);if(f.passive)assert.equal(p.passives[f.passive],3);for(const id of fusionConsumedIngredients(f))assert.equal((ITEMS[id].type==='weapon'?p.weapons:p.passives)[id],undefined);assert.equal(Object.keys(fusionType(f)==='weapon'?p.weapons:p.passives).length,1);
    assert.equal(applyChoice(p,{kind:'fusion',id:f.id}),false);assert.ok(!getUpgradePool(p).some(c=>c.id===f.id||c.id===base));
  }
});
test('random upgrade cards contain no duplicate items or stale ranks',()=>{const p=createPlayer(CHARACTERS[1]);for(let i=0;i<40;i++){const choices=getChoices(p);assert.equal(choices.length,3);assert.equal(new Set(choices.map(c=>c.id)).size,3);for(const c of choices)if(c.kind==='item')assert.ok(c.level<=ITEMS[c.id].max);}});
test('maxed inventory offers recovery rather than an empty choice screen',()=>{const p=createPlayer(CHARACTERS[0]);p.weapons={ki:5,blue:5,kunai:5,orbit:5,icelance:5};p.passives={senzu:3,eyes:3,scroll:3,magnet:3,demonextract:3};p.fusions={ki:'kamehameha',blue:'purple',kunai:'raijin',orbit:'galaxy',icelance:'icecrown'};assert.deepEqual(getChoices(p),[{kind:'heal',id:'heal'}]);p.hp=1;applyChoice(p,{kind:'heal',id:'heal'});assert.equal(p.hp,51);});
test('surplus XP supports multiple sequential levels without losing rewards',()=>{const p=createPlayer(CHARACTERS[0]);assert.equal(grantXp(p,45),true);let levels=1;while(takeLevel(p))levels++;assert.ok(levels>=3);assert.ok(p.xp>=0&&p.xp<p.nextXp);});
test('Senzu regenerates health while Six Eyes and Leaf Headband affect their own stats',()=>{
  const p=createPlayer(CHARACTERS[0]);p.hp=30;upgrade(p,'senzu');assert.equal(p.maxHp,150);assert.equal(p.regen,4);assert.equal(p.hp,45);
  upgrade(p,'eyes');assert.equal(p.cooldown,.92);upgrade(p,'headband');assert.ok(p.move>CHARACTERS[0].move);assert.equal(p.dodge,.05);
});
test('traveling Ki Wave pierces aligned enemies but leaves off-axis enemies untouched',()=>{const g=quietRun();g.enemies=[enemy(1),enemy(2,200),enemy(3,100,100)];castWeapon(g,'ki',g.enemies[0]);assert.equal(g.enemies[0].hp,1000);g.p.cooldowns.ki=999;for(let i=0;i<40;i++)updateRun(g,.02);assert.ok(g.enemies[0].hp<1000);assert.ok(g.enemies[1].hp<1000);assert.equal(g.enemies[2].hp,1000);assert.ok(g.shots.every(s=>s.type==='ki'));});
test('Cursed Blue becomes a traveling Hollow Purple after fusion',()=>{const g=quietRun(1);const e=enemy(1);castWeapon(g,'blue',e);assert.equal(g.fields.length,1);g.p.fusions.blue='purple';castWeapon(g,'blue',e);assert.equal(g.shots[0].type,'blue');assert.equal(g.shots[0].fused,true);});
test('Wind Shuriken and kunai create distinct projectiles',()=>{const g=quietRun(2);castWeapon(g,'shuriken',enemy(1));assert.equal(g.shots[0].type,'shuriken');g.p.weapons.kunai=2;castWeapon(g,'kunai',enemy(1));assert.equal(g.shots.filter(s=>s.type==='kunai').length,4);});
test('Storm Seal chains damage across separate targets',()=>{const g=quietRun();g.p.weapons.lightning=1;g.enemies=[enemy(1),enemy(2,190),enemy(3,270)];castWeapon(g,'lightning',g.enemies[0]);assert.ok(g.enemies.every(e=>e.hp<1000));assert.equal(g.effects[0].points.length,4);});
test('ultimates create distinct staged effects and respect pause, cooldown and overlap',()=>{
  for(let i=0;i<4;i++){const g=quietRun(i);g.enemies=[enemy(1)];assert.equal(useSpecial(g),true);assert.equal(g.ultimate.type,CHARACTERS[i].id);assert.ok(g.special>0);assert.equal(useSpecial(g),false);if(i===0)assert.equal(g.enemies[0].hp,1000);if(i===1)assert.equal(g.freeze,5);if(i===2)assert.equal(g.cloneUnits.length,6);g.special=0;assert.equal(useSpecial(g),false);g.ultimate=null;g.status='paused';assert.equal(useSpecial(g),false);}
});
test('pinch zoom clamps to supported range',()=>{assert.equal(clampZoom(.1),.6);assert.equal(clampZoom(4),1.65);assert.equal(clampZoom(1),1);});
test('paused runs freeze simulation; diagonal movement is normalized',()=>{const g=quietRun();g.status='paused';updateRun(g,1,{x:1,y:0});assert.equal(g.time,0);g.status='playing';updateRun(g,1,{x:1,y:-1});assert.ok(Math.abs(Math.hypot(g.p.x,g.p.y)-g.p.move)<.01);});
test('every boss death guarantees exactly one chest and the run continues',()=>{
  for(const id of Object.keys(BOSSES)){const g=quietRun();const e=spawnEnemy(g,true,false,id);e.hp=0;e.x=400;e.y=0;updateRun(g,.01);for(let i=0;i<80;i++)updateRun(g,.02);assert.equal(g.chests.length,1);assert.equal(g.chests[0].source,BOSSES[id].name);assert.equal(g.bossKills,1);assert.equal(g.status,'playing');updateRun(g,.01);assert.equal(g.chests.length,1);assert.equal(g.bossKills,1);}
});
test('picking up a boss chest offers guaranteed evolution without applying it',()=>{const g=quietRun();g.p.weapons.ki=5;g.p.passives.senzu=3;g.chests=[{x:0,y:0,boss:true,source:'Frieza'}];updateRun(g,.01);assert.equal(g.status,'chest');assert.equal(g.chests.length,0);assert.ok([1,3,5].includes(g.rewards.length));assert.equal(g.p.fusions.ki,undefined);assert.equal(g.rewards[0].id,'kamehameha');assert.ok(resolveChestReward(g,true));assert.equal(g.p.fusions.ki,'kamehameha');});
test('a dead enemy cannot deal contact damage before removal',()=>{const g=quietRun();g.p.hp=50;g.p.regen=0;g.enemies=[enemy(1,0,0,0)];updateRun(g,.01);assert.equal(g.p.hp,50);assert.equal(g.kills,1);});
test('timer formats survival duration',()=>assert.equal(formatTime(245.5),'04:05'));

test('bosses arrive once on cleared-wave milestones rather than elapsed survival time',()=>{
  const waiting=quietRun();waiting.wave=4;waiting.waveState=newWaveState(4);waiting.time=420;waiting.rifts.nextAt=1e9;updateRun(waiting,.01);assert.equal(waiting.wave,4);assert.equal(waiting.enemies.filter(e=>e.boss).length,0);
  for(const wave of [5,10,15]){const g=quietRun();g.wave=wave;g.waveState=newWaveState(wave);g.nextBossWave=wave;updateRun(g,.01);assert.equal(g.wave,wave);assert.equal(g.enemies.filter(e=>e.boss).length,1);assert.equal(g.nextBossWave,wave+5);finishBossIntro(g);updateRun(g,.01);assert.equal(g.enemies.filter(e=>e.boss).length,1);}
});
test('boss selection rotates per map and labyrinth starts with Walpurgisnacht',()=>{assert.ok(featuredBosses('labyrinth').includes('walpurgis'));assert.ok(featuredBosses('ruins').includes('frieza'));assert.ok(featuredBosses('garden').includes('aura'));assert.ok(featuredBosses('moon').includes('mahito'));{const first=pickBoss('garden');for(let i=0;i<20;i++)assert.notEqual(pickBoss('garden',{exclude:[first]}),first);}assert.equal(waveAt(30),2);});
test('chest rarity boundaries produce exactly 1, 3 or 5 rewards',()=>{for(const [roll,count] of [[0,1],[.649,1],[.65,3],[.899,3],[.9,5],[.999,5]]){assert.equal(chestItemCount(()=>roll),count);const p=createPlayer(CHARACTERS[0]),rewards=openChest(p,()=>roll);assert.equal(rewards.length,count);for(const id of Object.keys(p.weapons))assert.ok(p.weapons[id]<=5);for(const id of Object.keys(p.passives))assert.ok(p.passives[id]<=3);assert.ok(Object.keys(p.weapons).length<=5);assert.ok(Object.keys(p.passives).length<=5);}});
test('chest recomputes reward eligibility after every grant',()=>{const p=createPlayer(CHARACTERS[0]);p.weapons={ki:5,blue:5,kunai:5,orbit:4,icelance:5};p.passives={senzu:3,eyes:3,scroll:3,magnet:3,demonextract:3};p.fusions={ki:'kamehameha',blue:'purple',kunai:'raijin',icelance:'icecrown'};const values=[.95,0,0,0,0,0];const rewards=openChest(p,()=>values.shift()??0);const g={p,rewards,status:'chest',chestIndex:0};while(g.chestIndex<g.rewards.length)assert.ok(resolveChestReward(g,true,()=>0));assert.equal(rewards.length,5);assert.equal(p.weapons.orbit,5);assert.equal(p.fusions.orbit,'galaxy');assert.ok(rewards.some(r=>r.kind==='heal'));});
test('all enemy archetypes execute their distinct attacks',()=>{for(const id of Object.keys(ENEMIES)){const g=quietRun();const e=makeEnemy(g,id);e.x=140;e.y=0;e.attackCD=0;g.enemies=[e];updateEnemyAI(g,e,.01);assert.ok(Number.isFinite(e.x)&&Number.isFinite(e.y));assert.ok(g.enemyShots.length||g.hazards.length);assert.equal(e.skill,1);}});
test('boss attacks generate telegraphs, summons or projectiles and have second phases',()=>{for(const id of Object.keys(BOSSES)){const g=quietRun();const e=makeEnemy(g,id,true);e.x=220;e.y=0;g.enemies=[e];for(let i=0;i<3;i++){e.attackCD=0;updateEnemyAI(g,e,.01);}assert.ok(g.enemyShots.length||g.hazards.length||g.enemies.length>1);e.hp=e.maxHp*.4;updateEnemyAI(g,e,.01);assert.equal(id==='cell'?e.cellStage===1:e.enraged,true);}});
test('danger zones cannot damage the player before their warning completes',()=>{const g=quietRun();g.p.regen=0;g.p.dodge=0;g.hazards=[{shape:'circle',x:0,y:0,r:50,age:0,delay:1,duration:2,damage:20}];const hp=g.p.hp;updateRun(g,.5);assert.equal(g.p.hp,hp);updateRun(g,.51);assert.equal(g.p.hp,hp-20);});
test('Madoka shield absorbs damage and recharges every 10 seconds',()=>{const g=quietRun(3);g.p.dodge=0;assert.equal(g.p.maxShield,10);const hp=g.p.hp;hitPlayer(g,18);assert.equal(g.p.shield,0);assert.equal(g.p.hp,hp-8);g.invuln=0;updateRun(g,10);assert.equal(g.p.shield,10);});
test('Madoka homing arrows steer toward a target and her special clears enemy shots',()=>{const g=quietRun(3);g.enemies=[enemy(1,200,150)];castWeapon(g,'rosebow',g.enemies[0]);const s=g.shots[0];s.vx=400;s.vy=0;updateRun(g,.03);assert.ok(s.vy>0);g.enemyShots=[{x:50,y:0,vx:0,vy:0,life:4,r:4,damage:10}];g.p.hp=40;assert.equal(useSpecial(g),true);assert.equal(g.enemyShots.length,0);assert.equal(g.p.hp,70);});
test('labyrinth favours its themed witch familiars without guaranteeing them',()=>{const g=createRun(CHARACTERS[3],3),fams=Array.from({length:300},()=>spawnEnemy(g).family),own=fams.filter(f=>f==='madoka').length;assert.ok(own>150&&own<300);});
