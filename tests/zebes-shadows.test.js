import {resolveChestReward} from '../src/game.js';
import {finishBossIntro} from '../src/boss-intro.js';
import test from 'node:test';import assert from 'node:assert/strict';
import {CHARACTERS,MAPS,ITEMS,FUSIONS,createPlayer,refreshStats,fusionReady,applyChoice,getUpgradePool,getChoices,rerollChoices,vanishItem,openChest} from '../src/game.js';
import {createRun,castWeapon,updateRun,useSpecial,spawnEnemy,damageEnemy} from '../src/engine.js';
import {newProfile,sanitizeProfile,saveProfile,loadProfile,creditRun} from '../src/progression.js';
import {saveRun,loadRun} from '../src/run-save.js';
import {cannonPayload,cannonStage,CANNON_STAGES} from '../src/samus-cannon.js';
import {ensureWorld,colliders,damageProp} from '../src/world.js';
import {MAP_ENEMIES,MAP_BOSSES,featuredBosses,updateEnemyAI} from '../src/enemies.js';
import {hasStatus} from '../src/status.js';
import {SKINS} from '../src/skins.js';
import {characterPixels} from '../src/pixel-characters.js';
import {enemyPixels} from '../src/pixel-enemies.js';
import {summonPixels} from '../src/summon-art.js';
import {MAP_SUPPLIES} from '../src/map-supplies.js';
const hero=id=>CHARACTERS.find(c=>c.id===id),storage=()=>({data:new Map(),getItem(k){return this.data.get(k)},setItem(k,v){this.data.set(k,v)},removeItem(k){this.data.delete(k)}});
function quiet(id='samus',profile=null){const g=createRun(hero(id),8,profile);g.spawn=g.eliteAt=g.nextBossWave=1e6;g.p.nextXp=1e6;g.p.regen=g.p.dodge=0;for(const id of Object.keys(g.p.weapons))g.p.cooldowns[id]=9999;ensureWorld(g);return g;}
function target(g,id='zoomer',boss=false,x=180,y=0){const e=spawnEnemy(g,boss,false,id);Object.assign(e,{x,y,hp:10000,maxHp:10000,speed:0,attackCD:9999});return e;}
function sim(g,t,input={x:0,y:0}){for(let i=0;i<Math.round(t/.02);i++)updateRun(g,.02,input);}


function finishDeath(g){for(let i=0;i<90&&g.status==='playing'&&g.enemies.some(e=>e.boss&&e.hp<=0&&!e.deathComplete);i++)updateRun(g,.02);}
test('every hero receives base healing, one reroll and one ban; permanent upgrades add to them',()=>{
 for(const c of CHARACTERS){const p=createPlayer(c);assert.ok(p.regen>=1);assert.equal(p.rerollsLeft,1);assert.equal(p.vanishesLeft,1);const cards=getChoices(p);assert.ok(rerollChoices(p,cards));assert.equal(p.rerollsLeft,0);assert.ok(vanishItem(p,'orbit'));assert.equal(p.vanishesLeft,0);assert.ok(!getUpgradePool(p).some(c=>c.id==='orbit'));}
 const p=createPlayer(hero('samus'),{rerolls:2,vanishes:2,regen:.5});p.passives={};refreshStats(p);assert.equal(p.regen,1.5);assert.equal(p.rerollsLeft,3);assert.equal(p.vanishesLeft,3);
 const g=quiet();g.p.passives={};refreshStats(g.p);g.p.hp=50;g.p.weapons={};sim(g,1);assert.ok(Math.abs(g.p.hp-51)<1e-7);
});
test('legacy checkpoints gain base healing and charges exactly once and preserve old Hollow Purple',()=>{
 const s=storage(),g=quiet('gojo');delete g.p.baseRulesVersion;g.p.regen=0;g.p.rerollsLeft=0;g.p.vanishesLeft=0;delete g.p.weapons.red;g.p.fusions.blue='purple';saveRun(g,s);const r=loadRun(s);assert.equal(r.p.regen,1);assert.equal(r.p.rerollsLeft,1);assert.equal(r.p.vanishesLeft,1);assert.equal(r.p.fusions.blue,'purple');saveRun(r,s);const again=loadRun(s);assert.equal(again.p.regen,1);assert.equal(again.p.rerollsLeft,1);
});
test('Gojo starts Red and Blue; Hollow Purple requires two maxed actives and retains maxed Six Eyes',()=>{
 const g=quiet('gojo'),p=g.p,f=FUSIONS.find(f=>f.id==='purple');assert.deepEqual(p.weapons,{blue:1,red:1});assert.deepEqual(p.passives,{eyes:1});p.weapons.blue=5;p.passives.eyes=3;assert.equal(fusionReady(p,f),false);p.weapons.red=4;assert.equal(applyChoice(p,{kind:'fusion',id:'purple'}),false);p.weapons.red=5;p.passives.eyes=1;assert.equal(fusionReady(p,f),false);p.passives.eyes=3;assert.ok(fusionReady(p,f));assert.equal(getChoices(p)[0].id,'purple');assert.ok(applyChoice(p,{kind:'fusion',id:'purple'}));assert.equal(p.weapons.red,undefined);assert.equal(Object.keys(p.weapons).length,1);assert.equal(p.passives.eyes,3);assert.equal(p.fusions.blue,'purple');assert.ok(!getUpgradePool(p).some(c=>c.id==='red'));assert.equal(applyChoice(p,{kind:'item',id:'red'}),false);assert.ok(getUpgradePool(createPlayer(hero('naruto'))).some(c=>c.id==='red'));
});
test('dual-weapon fusion in a jackpot chest grants Hollow Purple only once and frees a full active slot',()=>{
 const p=createPlayer(hero('gojo'));p.weapons={blue:5,red:5,orbit:1,kunai:1,ki:1};p.passives.eyes=3;const rewards=openChest(p,()=>.95);const chest={p,rewards,status:'chest',chestIndex:0};while(chest.chestIndex<chest.rewards.length)assert.ok(resolveChestReward(chest,true,()=>.95));assert.equal(rewards.filter(c=>c.id==='purple').length,1);assert.equal(p.fusions.blue,'purple');assert.ok(!p.weapons.red);assert.ok(Object.keys(p.weapons).length<=5);
});
test('Red explodes and repels nearby enemies; Blue retains attraction; fusion travels after convergence',()=>{
 const g=quiet('gojo'),a=target(g),b=target(g,'zoomer',false,195,30);castWeapon(g,'red',a);assert.equal(a.hp,10000);sim(g,.6);assert.ok(a.hp<10000&&b.hp<10000);assert.ok(hasStatus(a,'cursed'));assert.ok(Math.abs(a.kvx)+Math.abs(a.kvy)>0);assert.equal(g.shots.filter(q=>q.type==='red').length,0);g.p.fusions.blue='purple';castWeapon(g,'blue',a);const q=g.shots.at(-1),x=q.x;sim(g,.2);assert.equal(q.x,x);sim(g,.4);assert.notEqual(q.x,x);
});
test('Goku charges then fires a finite traveling wave, piercing and burning without instant hits',()=>{
 const g=quiet('goku'),a=target(g),off=target(g,'zoomer',false,180,180);castWeapon(g,'ki',a);assert.equal(a.hp,10000);const q=g.shots[0];assert.equal(q.type,'ki');sim(g,.15);assert.equal(a.hp,10000);sim(g,.55);assert.ok(a.hp<10000);assert.ok(hasStatus(a,'burning'));assert.equal(off.hp,10000);assert.ok(Math.abs(a.kvx)+Math.abs(a.kvy)>0);sim(g,1);assert.ok(!g.shots.includes(q));
});
test('Samus missiles trigger after bounded random bolt counts, including super missiles, and skip borrowed cannons',()=>{
 for(const roll of [.1,.9]){const g=quiet();g.mechanic.missileIn=2;assert.equal(cannonPayload(g,()=>roll),null);assert.equal(cannonPayload(g,()=>roll),roll<.25?'supermissile':'missile');assert.ok(g.mechanic.missileIn>=4&&g.mechanic.missileIn<=8);assert.equal(g.mechanic.cannonShots,2);}
 const g=quiet('frieren');assert.equal(cannonPayload(g,()=>.1),null);
 const a=quiet(),e=target(a);a.mechanic.missileIn=1;castWeapon(a,'powerbeam',e);assert.equal(a.shots.filter(s=>s.type==='missile'||s.type==='supermissile').length,1);assert.equal(a.shots.filter(s=>s.type==='powerbeam').length,1);const b=quiet('frieren');b.p.weapons.powerbeam=1;castWeapon(b,'powerbeam',target(b));assert.equal(b.shots.length,1);
});
test('missiles deal area damage once and break supplies rather than passing through scenery',()=>{
 const g=quiet(),a=target(g),b=target(g,'zoomer',false,190,35);g.mechanic.missileIn=1;castWeapon(g,'powerbeam',a);g.shots=g.shots.filter(q=>q.type!=='powerbeam');sim(g,.5);assert.ok(a.hp<10000&&b.hp<10000);const hp=a.hp;assert.equal(g.shots.length,0);sim(g,.1);assert.ok(hp-a.hp<5);
 const h=quiet(),prop=h.world.active.find(o=>o.id==='starter:pot');h.mechanic.missileIn=1;castWeapon(h,'powerbeam',prop);h.shots=h.shots.filter(q=>q.type!=='powerbeam');sim(h,.7);assert.ok(h.world.destroyed.has(prop.id));assert.ok(h.world.debris.length>0);
});
test('kill thresholds unlock cumulative Wave, Ice and Plasma functions with no time requirement',()=>{
 assert.deepEqual(CANNON_STAGES.map(s=>s.kills),[0,100,200,300]);for(const [kills,stage]of [[0,0],[99,0],[100,1],[200,2],[300,3]]){const g=quiet();g.kills=kills;assert.equal(cannonStage(g),stage);g.mechanic.missileIn=999;const e=target(g);castWeapon(g,'powerbeam',e);const q=g.shots[0];assert.equal(q.beamStage,stage);assert.equal(q.wave>0,stage>=1);if(stage>=3)assert.ok(q.pierce>=4);sim(g,.5);assert.ok(e.hp<10000);assert.equal(hasStatus(e,'frozen'),stage>=2);assert.equal(hasStatus(e,'burning'),stage>=3);}
});
test('missile countdown and evolved beam stage survive checkpoints and pause freezes all progress',()=>{
 const g=quiet(),s=storage();g.kills=200;g.mechanic.missileIn=3;g.mechanic.cannonShots=17;g.mechanic.value=45;saveRun(g,s);const r=loadRun(s);assert.equal(cannonStage(r),2);assert.equal(r.mechanic.missileIn,3);assert.equal(r.mechanic.cannonShots,17);const before=JSON.stringify(r.mechanic);updateRun(r,5);assert.equal(JSON.stringify(r.mechanic),before);
});
test('all three new Samus skins save without changing combat stats and share arm-cannon progression',()=>{
 const s=storage(),p=newProfile();for(const skin of ['zerosuit','stealth','fusion']){p.skins.samus=skin;saveProfile(p,s);const g=quiet('samus',loadProfile(s)),base=quiet();assert.equal(g.p.skin,skin);for(const k of ['damage','maxHp','move','cooldown'])assert.equal(g.p[k],base.p[k]);g.kills=300;assert.equal(cannonStage(g),3);assert.notDeepEqual(characterPixels('samus',{skin}),characterPixels('samus'));assert.notDeepEqual(characterPixels('samus',{skin}),characterPixels('samus',{skin,blink:true,expression:'hurt'}));}assert.equal(SKINS.samus.filter(s=>['default','zerosuit','stealth','fusion','gravity'].includes(s.id)).length,5);
});
test('Megumi has a unique starting summon, passive, fusion and independent mastery wallet',()=>{
 const p=sanitizeProfile({coins:50,characters:{goku:{xp:23,skills:{ki:1}}}}),g=quiet('megumi',p);assert.deepEqual(g.p.weapons,{shadows:1,nue:1});assert.deepEqual(g.p.passives,{talisman:1});assert.equal(p.coins,50);assert.equal(p.characters.goku.xp,23);g.characterXp=20;creditRun(p,g);assert.equal(p.characters.megumi.xp,20);assert.equal(p.characters.goku.xp,23);assert.ok(ITEMS.shadows&&ITEMS.talisman);assert.ok(FUSIONS.some(f=>f.id==='totality'));
});
test('Divine Dogs pursue and bite, Nue is a separate summon weapon, and repeated casts renew a bounded pack',()=>{
 const g=quiet('megumi'),e=target(g);castWeapon(g,'shadows',e);assert.equal(g.summons.length,2);assert.equal(g.shots.length,0);sim(g,.9);assert.ok(e.hp<10000);assert.ok(hasStatus(e,'bleeding'));assert.ok(g.summons.some(s=>s.x>0));g.p.weapons.nue=3;castWeapon(g,'nue',e);assert.ok(g.summons.some(s=>s.kind==='nue'));const n=g.summons.length;for(let i=0;i<5;i++)castWeapon(g,'shadows',e);assert.equal(g.summons.length,n);sim(g,1.7);assert.ok(g.effects.some(f=>f.type==='lightning')||e.hp<9800);
});
test('summons break props and Thunderstorm Nue chains damage into multiple nearby targets',()=>{
 const props=quiet('megumi'),prop=props.world.active.find(o=>o.id==='starter:pot');props.p.x=prop.x+35;props.p.y=prop.y+10;castWeapon(props,'shadows',prop);sim(props,5);assert.ok(props.world.destroyed.has(prop.id));
 const g=quiet('megumi'),a=target(g),b=target(g,'zoomer',false,200,25);g.p.weapons.nue=5;g.p.passives.talisman=3;assert.ok(applyChoice(g.p,{kind:'fusion',id:'stormnue'}));castWeapon(g,'nue',a);assert.ok(g.summons.every(s=>s.fused));sim(g,.5);assert.ok(a.hp<10000&&b.hp<10000);
});
test('shadow resonance empowers the next pack and mastery changes duration and real summon damage',()=>{
 const p=newProfile();p.characters.megumi.skills={dogs:1,pact:1,heir:1,wheel:1,general:1};const a=quiet('megumi'),b=quiet('megumi',p);b.mechanic.value=100;castWeapon(a,'shadows',target(a));castWeapon(b,'shadows',target(b));assert.equal(b.p.weapons.shadows,2);assert.ok(b.summons[0].damage>a.summons[0].damage);assert.ok(b.summons[0].life>a.summons[0].life);assert.equal(b.mechanic.value,0);useSpecial(b);assert.equal(b.ultimate.duration,11);assert.ok(b.summons.find(s=>s.kind==='mahoraga').damage>85);
});
test('Mahoraga intercepts shots, adapts and slashes; its HP and persistent life survive pause and saves',()=>{
 const g=quiet('megumi'),e=target(g),s=storage();assert.ok(useSpecial(g));const maho=g.summons.find(s=>s.kind==='mahoraga');assert.ok(maho);g.enemyShots=[{x:maho.x,y:maho.y,vx:0,vy:0,life:3,age:0,r:4,damage:10}];sim(g,.02);assert.equal(g.enemyShots.length,0);assert.equal(maho.adaptation,1);sim(g,.8);assert.ok(e.hp<10000);const before=JSON.stringify(g.summons);g.status='paused';updateRun(g,4);assert.equal(JSON.stringify(g.summons),before);saveRun(g,s);const r=loadRun(s);assert.equal(r.summons[0].adaptation,1);r.status='playing';sim(r,10);assert.ok(r.summons.some(s=>s.kind==='mahoraga'&&s.hp>0));assert.equal(r.ultimate,null);assert.equal(r.p.pose,'');
});
test('summon art is distinct from pets and each shikigami has animated body parts',()=>{
 const ids=['whiteDog','blackDog','nue','mahoraga'];assert.equal(new Set(ids.map(id=>JSON.stringify(summonPixels(id)))).size,4);for(const id of ids){assert.ok(summonPixels(id).filter(Boolean).length>150);assert.notDeepEqual(summonPixels(id,{frame:0}),summonPixels(id,{frame:1}));}
});
test('Zebes favours Metroid spawns, three unique breakables, and Kraid → Ridley → Mother Brain',()=>{
 assert.equal(MAPS[8].id,'zebes');assert.ok(['kraid','ridley','motherbrain'].every(id=>featuredBosses('zebes').includes(id)));assert.deepEqual(MAP_SUPPLIES.zebes,['missilecache','chozocapsule','containmentpod']);const g=quiet();g.wave=4;{const own=Array.from({length:300},()=>spawnEnemy(g).family).filter(f=>f==='metroid').length;assert.ok(own>150&&own<300,'Zebes favours Metroid foes');}assert.ok(g.world.active.some(o=>o.type==='containmentpod'));for(const pool of Object.values(MAP_BOSSES))for(const id of ['kraid','motherbrain'])assert.ok(pool.includes(id));
});
test('pirate variants have unique attacks: claw lanes, plasma mines, turning missiles and temporary armor',()=>{
 const g=quiet();for(const id of ['greenpirate','redpirate','flyingpirate','goldpirate']){const e=target(g,id);e.attackCD=0;updateEnemyAI(g,e,.02);assert.ok(MAP_ENEMIES.zebes.includes(id));}assert.ok(g.hazards.some(h=>h.label==='DUAL CLAW'));assert.ok(g.hazards.some(h=>h.label==='PLASMA MINE'&&h.duration>2));assert.ok(g.enemyShots.some(q=>q.turn));assert.ok(g.enemies.find(e=>e.archetype==='goldpirate').armorTime>0);
});
test('Kraid and Mother Brain warn attacks, enrage, and always grant one chest',()=>{
 for(const id of ['kraid','motherbrain']){const g=quiet(),e=target(g,id,true,250);for(let i=0;i<3;i++){e.attackCD=0;updateEnemyAI(g,e,.02);}assert.ok(g.hazards.length);assert.ok(g.hazards.every(h=>h.delay>=1));assert.ok(g.enemyShots.length);e.hp=e.maxHp*.4;e.attackCD=0;updateEnemyAI(g,e,.02);assert.ok(e.enraged);if(g.bossIntro)finishBossIntro(g);e.hp=0;sim(g,.02);assert.equal(g.chests.filter(c=>c.source===e.name).length,0);finishDeath(g);assert.equal(g.chests.filter(c=>c.source===e.name).length,1);sim(g,.02);assert.equal(g.chests.filter(c=>c.source===e.name).length,1);}
});
test('Mother Brain tank remains stationary, then changes art and walks during the Hyper Beam phase',()=>{
 const g=quiet(),e=target(g,'motherbrain',true,300);e.speed=38;const x=e.x;updateEnemyAI(g,e,.1);assert.equal(e.x,x);e.hp=e.maxHp*.4;updateEnemyAI(g,e,.1);assert.ok(e.enraged);assert.ok(g.bossIntro.transformation);finishBossIntro(g);updateEnemyAI(g,e,.1);assert.notEqual(e.x,x);assert.notDeepEqual(enemyPixels('motherbrain'),enemyPixels('motherbrain',{enraged:1}));e.skill=1;e.attackCD=0;updateEnemyAI(g,e,.02);assert.ok(g.hazards.some(h=>h.label==='HYPER BEAM'&&h.delay>=1.6));
});
test('Ulquiorra transforms, predicts Cero, staggers Lanza impacts and limits regeneration to an interruptible window',()=>{
 const g=quiet(),e=target(g,'ulquiorra',true,300);for(let i=0;i<4;i++){e.attackCD=0;updateEnemyAI(g,e,.02);}for(const label of ['CERO OSCURAS','LANZA IMPACT','LANZA SHOCKWAVE','SONIDO ASSAULT','BLACK DESPAIR'])assert.ok(g.hazards.some(h=>h.label===label));e.hp=e.maxHp*.4;e.attackCD=0;updateEnemyAI(g,e,.02);assert.ok(e.enraged);assert.notDeepEqual(enemyPixels('ulquiorra'),enemyPixels('ulquiorra',{enraged:1}));g.time=4;e.regenWindow=2;e.attackCD=999;e.lastDamagedAt=0;const hp=e.hp;updateEnemyAI(g,e,.1);assert.ok(e.hp>hp);damageEnemy(g,e,5);const hurt=e.hp;updateEnemyAI(g,e,.1);assert.equal(e.hp,hurt);
});


test('Mahoraga interceptions prevent actual player damage even when the intercepted shot overlaps the player',()=>{
 const g=quiet('megumi');g.p.weapons={};useSpecial(g);g.invuln=0;const maho=g.summons[0];maho.x=15;maho.y=0;g.enemyShots=[{x:0,y:0,vx:0,vy:0,life:3,age:0,r:4,damage:20}];const hp=g.p.hp;updateRun(g,.02);assert.equal(g.enemyShots.length,0);assert.equal(g.p.hp,hp);assert.equal(maho.adaptation,1);
});
