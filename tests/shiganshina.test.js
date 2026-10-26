import test from 'node:test';import assert from 'node:assert/strict';
import {CHARACTERS,MAPS,FUSIONS,createPlayer,getUpgradePool,applyChoice,openChest,fusionReady} from '../src/game.js';
import {createRun,spawnEnemy,castWeapon,updateRun,hitPlayer,useSpecial} from '../src/engine.js';
import {updateEnemyAI,BOSSES,MAP_BOSSES,MAP_ENEMIES,featuredBosses} from '../src/enemies.js';
import {finishBossIntro,bossIntroMarkup} from '../src/boss-intro.js';
import {SKINS} from '../src/skins.js';import {newProfile,sanitizeProfile} from '../src/progression.js';
import {saveRun,loadRun} from '../src/run-save.js';import {characterPixels} from '../src/pixel-characters.js';
import {enemyPixels} from '../src/pixel-enemies.js';import {ensureWorld} from '../src/world.js';
import {MAP_SUPPLIES} from '../src/map-supplies.js';import {cannonProgress} from '../src/samus-cannon.js';
import {mechanicLabel} from '../src/hero-mechanics.js';import {summonPack,updateSummons} from '../src/summons.js';
import {companionLeash,companionHome,recallCompanion} from '../src/companion-ai.js';
const normalBossIds=Object.keys(BOSSES).filter(id=>!BOSSES[id].riftOnly&&!BOSSES[id].eventOnly);
const hero=id=>CHARACTERS.find(c=>c.id===id),memory=()=>({data:new Map(),getItem(k){return this.data.get(k)},setItem(k,v){this.data.set(k,v)},removeItem(k){this.data.delete(k)}});
function run(id='eren'){const g=createRun(hero(id),9);g.spawn=g.eliteAt=g.nextBossWave=1e6;g.p.nextXp=1e6;g.p.dodge=0;for(const id of Object.keys(g.p.weapons))g.p.cooldowns[id]=999;ensureWorld(g);return g;}
function boss(g,id){const e=spawnEnemy(g,true,false,id);Object.assign(e,{x:250,y:0,attackCD:999});return e;}
for(const [id,name]of [['annie','Female Titan'],['reiner','Armored Titan'],['bertholdt','Colossal Titan'],['motherbrain','Mother Brain · Walking Form']]){
 
function finishDeath(g){for(let i=0;i<90&&g.status==='playing'&&g.enemies.some(e=>e.boss&&e.hp<=0&&!e.deathComplete);i++)updateRun(g,.02);}
test(id+' transforms once below half health, keeps HP and changes art, name and size',()=>{
  const g=run(),e=boss(g,id),first=enemyPixels(id),r=e.r;e.hp=e.maxHp*.5;updateEnemyAI(g,e,.02);assert.equal(e.enraged,false);assert.equal(g.bossIntro,null);
  e.hp=e.maxHp*.49;const hp=e.hp;updateEnemyAI(g,e,.02);assert.equal(e.name,name);assert.equal(e.hp,hp);assert.ok(e.r>r);assert.ok(e.enraged&&e.transformed);assert.notDeepEqual(first,enemyPixels(id,{enraged:1}));assert.equal(g.bossIntro.transformation,true);assert.ok(bossIntroMarkup(g.bossIntro).includes('BOSS TRANSFORMATION'));finishBossIntro(g);updateEnemyAI(g,e,.02);assert.equal(g.bossIntro,null);
 });
 test(id+' transformation pauses combat, survives a checkpoint and grants exactly one final chest',()=>{
  const g=run(),e=boss(g,id),storage=memory();e.hp=e.maxHp*.4;updateEnemyAI(g,e,.02);const t=g.time,hp=g.p.hp;updateRun(g,.1,{x:1,y:0});assert.equal(g.time,t);assert.equal(g.p.hp,hp);assert.equal(hitPlayer(g,50),false);saveRun(g,storage);const loaded=loadRun(storage);assert.equal(loaded.status,'paused');assert.equal(loaded.bossIntro.transformation,true);assert.equal(loaded.enemies[0].name,e.name);loaded.status='playing';finishBossIntro(loaded);loaded.enemies[0].hp=0;updateRun(loaded,.02);assert.equal(loaded.chests.length,0);finishDeath(loaded);assert.equal(loaded.chests.length,1);updateRun(loaded,.02);assert.equal(loaded.chests.length,1);
 });
}
test('each Titan has a distinct telegraphed attack rotation in human and Titan forms',()=>{
 const patterns=[];for(const id of ['annie','reiner','bertholdt']){const g=run(),e=boss(g,id);for(let i=0;i<3;i++){e.attackCD=0;updateEnemyAI(g,e,.02);}assert.ok(g.hazards.length);e.hp=e.maxHp*.4;updateEnemyAI(g,e,.02);finishBossIntro(g);g.hazards=[];g.enemyShots=[];for(let i=0;i<3;i++){e.attackCD=0;updateEnemyAI(g,e,.02);}assert.ok(g.hazards.every(h=>h.delay>=.9));patterns.push(g.hazards.map(h=>h.label).join('|'));if(id==='annie')assert.ok(g.enemies.some(e=>e.archetype==='puretitan'));if(id==='reiner')assert.ok(e.armorTime>0);if(id==='bertholdt')assert.ok(g.hazards.some(h=>h.status==='burning'&&h.duration===2));}assert.equal(new Set(patterns).size,3);
});
test('transformation clears only the boss’s old projectiles and warnings and grants a restart windup',()=>{
 const g=run(),e=boss(g,'motherbrain');g.enemyShots=[{sourceId:e.id},{sourceId:999}];g.hazards=[{sourceId:e.id},{sourceId:999}];e.armorTime=5;e.dash=1;e.hp=e.maxHp*.4;updateEnemyAI(g,e,.02);assert.deepEqual(g.enemyShots,[{sourceId:999}]);assert.deepEqual(g.hazards,[{sourceId:999}]);assert.equal(e.armorTime,0);assert.equal(e.dash,0);assert.ok(e.attackCD>=1.5);finishBossIntro(g);e.skill=1;e.attackCD=0;updateEnemyAI(g,e,.02);assert.ok(g.hazards.some(h=>h.label==='HYPER BEAM'&&h.delay===1.6));
});
test('dead bosses and bosses held by Esdeath cannot begin transformations',()=>{
 const g=run(),e=boss(g,'annie');e.hp=0;updateEnemyAI(g,e,.02);assert.equal(g.bossIntro,null);e.hp=e.maxHp*.4;g.ultimate={type:'esdeath',x:e.x,y:e.y,r:500};updateEnemyAI(g,e,.02);assert.equal(g.bossIntro,null);
});
test('Shiganshina starts with Annie, Reiner, Bertholdt and supplies unique to the district',()=>{
 assert.equal(MAPS[9].id,'shiganshina');assert.ok(['annie','reiner','bertholdt'].every(id=>featuredBosses('shiganshina').includes(id)));assert.ok(MAP_ENEMIES.shiganshina.includes('puretitan'));assert.ok(MAP_ENEMIES.shiganshina.includes('abnormal'));const g=run(),supplies=g.world.active.filter(o=>o.id.startsWith('starter:'));assert.deepEqual(supplies.map(o=>o.type),MAP_SUPPLIES.shiganshina);for(const o of supplies){assert.ok(Number.isFinite(o.hp));assert.ok(o.name);}for(const pool of Object.values(MAP_BOSSES)){assert.equal(new Set(pool).size,normalBossIds.length);for(const id of ['annie','reiner','bertholdt'])assert.ok(pool.includes(id));}
});
test('both reference Eren skins have different silhouettes, animate and retain their saved choice',()=>{
 const profile=newProfile(),arts=[];for(const skin of ['yeagerist','infiltrator']){assert.ok(SKINS.eren.some(s=>s.id===skin));profile.skins.eren=skin;const clean=sanitizeProfile(profile),g=createRun(hero('eren'),9,clean),storage=memory();assert.equal(g.p.skin,skin);saveRun(g,storage);assert.equal(loadRun(storage).p.skin,skin);const art=characterPixels('eren',{skin});arts.push(JSON.stringify(art));assert.notDeepEqual(art,characterPixels('eren',{skin,moving:true,frame:1}));assert.notDeepEqual(art,characterPixels('eren'));useSpecial(g);assert.equal(g.p.skin,skin);assert.equal(g.p.erenForm,'titan');}assert.equal(new Set(arts).size,2);
});
test('Titan Fists and Titan Quake are exclusive to Titan Eren even with stale direct grants',()=>{
 const f=FUSIONS.find(f=>f.id==='titanquake');for(const c of CHARACTERS){const g=run(c.id);assert.equal(applyChoice(g.p,{kind:'item',id:'titanfists'}),false);assert.ok(!getUpgradePool(g.p).some(c=>['titanfists','titanquake'].includes(c.id)));g.p.weapons.titanfists=5;g.p.passives.freedom=3;assert.equal(fusionReady(g.p,f),false);assert.equal(applyChoice(g.p,{kind:'fusion',id:'titanquake'}),false);const e=boss(g,'annie'),hp=e.hp;assert.equal(castWeapon(g,'titanfists',e),false);assert.equal(e.hp,hp);}const g=run();useSpecial(g);assert.ok(applyChoice(g.p,{kind:'item',id:'titanfists'}));g.p.weapons.titanfists=5;g.p.passives.freedom=3;assert.ok(fusionReady(g.p,f));
});
test('chests cannot grant Titan Fists to another hero or human Eren',()=>{
 for(const id of ['goku','eren']){const p=createPlayer(hero(id));for(let i=0;i<60;i++)assert.ok(openChest(p,()=>.96).every(c=>c.id!=='titanfists'&&c.id!=='titanquake'));assert.equal(p.weapons.titanfists,undefined);}
});
test('older non-Eren checkpoints drop obsolete Titan equipment without losing run rewards or other gear',()=>{
 const g=run('goku'),storage=memory();g.p.weapons.titanfists=5;g.p.cooldowns.titanfists=2;g.p.fusions.titanfists='titanquake';g.kills=137;g.money=50;saveRun(g,storage);const restored=loadRun(storage);assert.equal(restored.kills,137);assert.equal(restored.money,50);assert.equal(restored.p.weapons.ki,1);assert.equal(restored.p.weapons.titanfists,undefined);assert.equal(restored.p.fusions.titanfists,undefined);
});
test('Samus kill progress shows exact 100-kill thresholds separately from charge and survives saves',()=>{
 const g=run('samus'),s=memory();for(const [kills,stage,progress,threshold]of [[0,0,0,100],[99,0,99,100],[100,1,0,200],[137,1,37,200],[199,1,99,200],[200,2,0,300],[299,2,99,300],[300,3,100,null],[999,3,100,null]]){g.kills=kills;g.mechanic.value=73;const c=cannonProgress(g);assert.equal(c.total,kills);assert.equal(c.stage,stage);assert.equal(c.progress,progress);assert.equal(c.threshold,threshold);assert.ok(mechanicLabel(g).includes(kills+' KILLS')||mechanicLabel(g).includes(kills+' / '+threshold+' KILLS'));saveRun(g,s);assert.deepEqual(cannonProgress(loadRun(s)),c);}
});
test('companions patrol freely inside the safe range without snapping to the player at the boundary',()=>{
 const g=run('megumi');g.world.active=[];summonPack(g,1,1);const s=g.summons[0],leash=companionLeash(g);s.x=g.p.x+leash+1;s.y=g.p.y;recallCompanion(g,s);assert.ok(Math.abs(s.x-g.p.x-leash)<.001);assert.ok(s.x-g.p.x>leash*.9);const a=companionHome(g,s);g.time=4;const b=companionHome(g,s);assert.notDeepEqual(a,b);assert.ok(Math.hypot(b.x-g.p.x,b.y-g.p.y)<leash*.7);s.x=g.p.x;s.y=g.p.y;const start={x:s.x,y:s.y};updateSummons(g,.1,{damage(){},burst(){}});assert.ok(Math.hypot(s.x-start.x,s.y-start.y)>10);assert.ok(Math.hypot(s.x-g.p.x,s.y-g.p.y)<=leash);
});
