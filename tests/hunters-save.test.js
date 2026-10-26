import test from 'node:test';
import assert from 'node:assert/strict';
import {CHARACTERS,MAPS,ITEMS,FUSIONS,applyChoice} from '../src/game.js';
import {createRun,spawnEnemy,castWeapon,updateRun,useSpecial,damageEnemy} from '../src/engine.js';
import {newProfile,sanitizeProfile,saveProfile,loadProfile,creditRun,buyNode} from '../src/progression.js';
import {RUN_SAVE_KEY,saveRun,loadRun} from '../src/run-save.js';
import {ensureWorld,damageProp} from '../src/world.js';
import {hasStatus} from '../src/status.js';
import {heroKill} from '../src/hero-mechanics.js';
import {characterPixels} from '../src/pixel-characters.js';
import {SKINS} from '../src/skins.js';
import {PETS,petPixels} from '../src/pets.js';
import {METROID_ENEMIES,METROID_BOSSES} from '../src/metroid-enemies.js';
import {MAP_ENEMIES,MAP_BOSSES,updateEnemyAI} from '../src/enemies.js';
import {enemyPixels} from '../src/pixel-enemies.js';
import {enemyMotion} from '../src/enemy-animation.js';
import {bestiary} from '../src/bestiary.js';
const hero=id=>CHARACTERS.find(c=>c.id===id);
const memory=()=>({data:new Map(),setItem(k,v){this.data.set(k,v)},getItem(k){return this.data.get(k)||null},removeItem(k){this.data.delete(k)}});
function quiet(id='frieren',profile){const g=createRun(hero(id),1,profile);g.spawn=g.eliteAt=g.nextBossWave=1e6;g.p.nextXp=1e6;g.p.regen=g.p.dodge=0;g.p.cooldowns[g.p.weapon]=9999;ensureWorld(g);return g;}
function target(g,id='soldier',boss=false,x=170,y=0){const e=spawnEnemy(g,boss,false,id);Object.assign(e,{x,y,hp:10000,maxHp:10000,speed:0,attackCD:9999});return e;}
function sim(g,seconds){for(let i=0;i<Math.round(seconds/.02);i++)updateRun(g,.02);}


function finishDeath(g){for(let i=0;i<90&&g.status==='playing'&&g.enemies.some(e=>e.boss&&e.hp<=0&&!e.deathComplete);i++)updateRun(g,.02);}
test('run checkpoint restores live shots, persistent props, inventories, resources and paused combat without time passing',()=>{
 const storage=memory(),p=newProfile();p.skins.samus='gravity';p.pet='pochita';const g=quiet('samus',p),e=target(g);castWeapon(g,'powerbeam',e);g.shots[0].hits.add(42);g.p.hp-=10;g.time=124;g.money=38;g.characterXp=21;g.mechanic.value=65;g.special=12;
 const prop=g.world.active.find(o=>Number.isFinite(o.hp));damageProp(g,prop,999,0,0,()=>.99);const immortal=g.world.active.find(o=>o.hp===Infinity);assert.ok(immortal);assert.ok(saveRun(g,storage));const restored=loadRun(storage);assert.ok(restored);assert.equal(restored.status,'paused');assert.equal(restored.resumeStatus,'playing');assert.equal(restored.p.skin,'gravity');assert.equal(restored.pet.id,'pochita');assert.equal(restored.time,124);assert.equal(restored.money,38);assert.equal(restored.p.hp,g.p.hp);assert.equal(restored.mechanic.value,65);assert.equal(restored.special,12);assert.equal(restored.runId,g.runId);assert.ok(restored.shots[0].hits.has(42));assert.equal(restored.world.objects.get(immortal.id).hp,Infinity);assert.ok(restored.world.destroyed.has(prop.id));assert.ok(!restored.world.active.some(o=>o.id===prop.id));assert.ok(restored.world.active.every(o=>restored.world.objects.get(o.id)===o));updateRun(restored,5);assert.equal(restored.time,124);restored.status='playing';updateRun(restored,.02);assert.ok(restored.time>124);assert.ok(restored.shots[0].hits instanceof Set);
});
test('level choices and already-applied chest rewards survive reload without awarding items again',()=>{
 for(const status of ['upgrade','fusion','chest']){const storage=memory(),g=quiet();g.status=status;g.levelChoices=[{kind:'item',id:'zoltraak',level:2}];g.chestSource='Ridley';g.rewards=[{kind:'item',id:'grimoire',level:2}];g.p.passives.grimoire=2;saveRun(g,storage);const r=loadRun(storage);assert.equal(r.resumeStatus,status);assert.deepEqual(r.levelChoices,g.levelChoices);assert.deepEqual(r.rewards,g.rewards);assert.equal(r.p.passives.grimoire,2);saveRun(r,storage);assert.equal(loadRun(storage).resumeStatus,status);}
});
test('corrupt, incompatible and finished checkpoints are ignored and storage failures are safe',()=>{
 const storage=memory();for(const text of ['broken','{}','{"version":999}']){storage.setItem(RUN_SAVE_KEY,text);assert.equal(loadRun(storage),null);}const g=quiet();saveRun(g,storage);const data=JSON.parse(storage.getItem(RUN_SAVE_KEY));data.run.p.weapons.unknown=1;storage.setItem(RUN_SAVE_KEY,JSON.stringify(data));assert.equal(loadRun(storage),null);assert.equal(saveRun(g,undefined),false);assert.equal(loadRun(undefined),null);g.status='over';assert.equal(saveRun(g,storage),false);assert.equal(storage.getItem(RUN_SAVE_KEY),null);
});
test('old checkpoint rewards cannot be banked twice even after the profile was saved later',()=>{
 const p=newProfile(),g=quiet(),storage=memory();g.money=10;g.characterXp=5;saveRun(g,storage);g.money=30;g.characterXp=20;g.kills=22;creditRun(p,g);const r=loadRun(storage);assert.deepEqual(creditRun(p,r),{coins:0,xp:0});r.money=31;r.characterXp=21;assert.deepEqual(creditRun(p,r),{coins:1,xp:1});assert.equal(p.coins,31);assert.equal(p.characters.frieren.xp,21);assert.equal(p.bestKills,22);
});
test('progress stores character/map choices, skins, pets, best kills and independent mastery; old saves keep purchases',()=>{
 const storage=memory(),p=newProfile();p.selection={character:'frieren',map:'ruins',mode:'bossrush',difficulty:'normal'};p.skins={frieren:'maid',samus:'gravity'};p.pet='kyubey';p.coins=180;p.bestKills=99;p.characters.frieren.xp=80;assert.ok(buyNode(p,'character','ray','frieren'));saveProfile(p,storage);const r=loadProfile(storage);assert.deepEqual(r.selection,p.selection);assert.deepEqual(r.skins,p.skins);assert.equal(r.pet,'kyubey');assert.equal(r.bestKills,99);assert.equal(r.characters.frieren.skills.ray,1);assert.equal(r.characters.samus.xp,0);const old=sanitizeProfile({coins:63,general:{power:2},characters:{goku:{xp:40,skills:{ki:2}}}});assert.equal(old.selection.mode,'survival');assert.equal(old.coins,63);assert.equal(old.general.power,2);assert.equal(old.characters.goku.skills.ki,2);assert.equal(old.characters.frieren.xp,0);assert.equal(old.characters.samus.xp,0);
});
test('automatic EVA rage animates all units and its timer freezes during interruptions',()=>{
 const g=quiet('shinji');g.mechanic.value=100;updateRun(g,.02);assert.equal(g.mechanic.active,8);assert.equal(g.mechanic.activeAge,0);sim(g,.2);assert.ok(g.mechanic.activeAge>=.19);for(const skin of SKINS.shinji){const frames=Array.from({length:4},(_,frame)=>JSON.stringify(characterPixels('shinji',{skin:skin.id,pose:'berserk',frame})));assert.ok(new Set(frames).size>=3,skin.id);}const before=JSON.stringify(g.mechanic);g.status='paused';updateRun(g,3);assert.equal(JSON.stringify(g.mechanic),before);g.status='playing';sim(g,8);assert.equal(g.mechanic.active,0);
});
test('Frieren pierces a line, consumes mana for stronger magic and evolves to three cursed rays',()=>{
 const a=quiet(),b=quiet();const ea=target(a),eb=target(b);const rear=target(a,'soldier',false,300,20),off=target(a,'soldier',false,180,180);b.mechanic.value=100;castWeapon(a,'zoltraak',ea);castWeapon(b,'zoltraak',eb);assert.ok(rear.hp<10000);assert.equal(off.hp,10000);assert.ok(10000-eb.hp>(10000-ea.hp)*1.49);assert.equal(b.mechanic.value,0);assert.equal(a.effects.filter(f=>f.type==='zoltraak').length,1);
 a.p.weapons.zoltraak=5;a.p.passives.grimoire=3;assert.ok(applyChoice(a.p,{kind:'fusion',id:'ancientmagic'}));a.effects=[];castWeapon(a,'zoltraak',ea);assert.equal(a.effects.filter(f=>f.type==='zoltraak').length,3);assert.ok(hasStatus(ea,'cursed'));assert.ok(FUSIONS.some(f=>f.weapon==='zoltraak'));assert.ok(ITEMS.grimoire);
 const still=quiet(),moving=quiet();still.p.moving=false;moving.p.moving=true;updateRun(still,1);updateRun(moving,1);assert.equal(still.mechanic.value,18);assert.equal(moving.mechanic.value,6);heroKill(still,{});assert.equal(still.mechanic.value,22);
});
test('Frieren mastery improves her signature and extends a real stone guardian that punches and channels cursed beams',()=>{
 const p=newProfile();p.characters.frieren.skills={ray:1,barrage:1,reveal:1,elf:1};const g=quiet('frieren',p),e=target(g);for(const o of g.world.objects.values())o.hp=0;g.world.active=[];g.world.circles=[];assert.equal(g.p.weapons.zoltraak,2);assert.ok(useSpecial(g));assert.equal(g.ultimate.duration,10.6);updateRun(g,.02);assert.equal(g.ultimate.golem.phase,'forming');assert.equal(g.shots.length,0);sim(g,1.4);assert.ok(e.hp<10000);assert.ok(g.ultimate.golem);sim(g,2);assert.ok(hasStatus(e,'cursed'));
});
test('Samus charge changes real projectile damage and piercing, plasma adds burning and splash',()=>{
 const g=quiet('samus'),e=target(g);castWeapon(g,'powerbeam',e);const normal=g.shots[0];g.mechanic.value=100;castWeapon(g,'powerbeam',e);const charge=g.shots[1];assert.equal(charge.charged,true);assert.equal(charge.damage,normal.damage*1.8);assert.equal(charge.pierce,normal.pierce+2);assert.equal(g.mechanic.value,0);
 g.p.weapons.powerbeam=5;g.p.passives.energytank=3;assert.ok(applyChoice(g.p,{kind:'fusion',id:'plasmabeam'}));g.shots=[];const other=target(g,'soldier',false,185,30);castWeapon(g,'powerbeam',e);assert.ok(g.shots.filter(s=>s.type==='powerbeam').every(s=>s.charged));sim(g,.4);assert.ok(hasStatus(e,'burning'));assert.ok(other.hp<10000);heroKill(g,{});assert.ok(g.mechanic.value>=8);
});
test('Power Bomb charges for two seconds, strikes only once, stuns, and clears nearby hostile shots',()=>{
 const g=quiet('samus'),e=target(g,'soldier',false,200,0),far=target(g,'soldier',false,700,0);g.p.weapons={};g.enemyShots=[{x:100,y:0,vx:0,vy:0,r:4,life:10,age:0,damage:1},{x:650,y:0,vx:0,vy:0,r:4,life:10,age:0,damage:1}];assert.ok(useSpecial(g));sim(g,1.9);assert.equal(e.hp,10000);assert.equal(g.p.pose,'bomb');sim(g,.2);assert.ok(e.hp<10000);assert.equal(far.hp,10000);assert.ok(hasStatus(e,'stun'));assert.equal(g.enemyShots.length,1);const hp=e.hp;sim(g,.3);assert.equal(e.hp,hp);sim(g,.5);assert.equal(g.ultimate,null);assert.equal(g.p.pose,'');
});
test('new hero skins and pets have distinct art, animation and no cosmetic stat bonuses',()=>{
 for(const [id,skin]of [['frieren','maid'],['samus','gravity']]){assert.notDeepEqual(characterPixels(id),characterPixels(id,{skin}));assert.notDeepEqual(characterPixels(id,{skin}),characterPixels(id,{skin,moving:true,frame:1}));const p=newProfile();p.skins[id]=skin;p.pet='kon';const a=quiet(id),b=quiet(id,p);for(const key of ['damage','move','maxHp','magnet','cooldown'])assert.equal(a.p[key],b.p[key]);}
 assert.equal(PETS.length,11);for(const id of ['pochita','kyubey','chopper','kon']){assert.ok(petPixels(id).filter(Boolean).length>150);assert.notDeepEqual(petPixels(id,0),petPixels(id,1));}assert.equal(new Set(['pochita','kyubey','chopper','kon'].map(id=>JSON.stringify(petPixels(id)))).size,4);
});
test('all Metroid enemies are reachable, animate and perform their advertised attacks',()=>{
 const ids=Object.keys({...METROID_ENEMIES,...METROID_BOSSES});assert.equal(ids.length,12);assert.equal(new Set(ids.map(id=>JSON.stringify(enemyPixels(id)))).size,12);for(const id of ids){const boss=!!METROID_BOSSES[id],g=quiet(),e=target(g,id,boss);assert.ok(Object.values(boss?MAP_BOSSES:MAP_ENEMIES).some(pool=>pool.includes(id)));assert.notDeepEqual(enemyMotion({...e,animTime:.1},.1),enemyMotion({...e,animTime:.4},.4));assert.ok(bestiary({query:'Metroid'}).includes(e.name));for(let i=0;i<3;i++){e.attackCD=0;updateEnemyAI(g,e,.02);}assert.ok(g.hazards.length||g.enemyShots.length,id);assert.ok(g.hazards.every(h=>h.delay>=.65));if(boss){e.hp=e.maxHp*.4;updateEnemyAI(g,e,.02);assert.ok(e.enraged);}}
});
test('Metroid defenses expire, drain bolts require hits, and Ridley always leaves a boss chest',()=>{
 const g=quiet('samus'),r=target(g,'ripper');r.attackCD=0;updateEnemyAI(g,r,.02);assert.ok(r.armorTime>0);const hp=r.hp;damageEnemy(g,r,100);assert.equal(r.hp,hp-60);r.attackCD=999;updateEnemyAI(g,r,2);assert.equal(r.armorTime,0);
 const m=target(g,'feralmetroid',false,200,100);m.hp=5000;m.attackCD=0;updateEnemyAI(g,m,.02);const bolt=g.enemyShots.find(s=>s.kind==='drain');assert.equal(bolt.leech,.6);Object.assign(bolt,{x:0,y:0,vx:0,vy:0});g.enemyShots=[bolt];g.hazards=[];const before=m.hp;updateRun(g,.02);assert.ok(m.hp>before);assert.ok(hasStatus(g.p,'slow'));
 const boss=target(g,'ridley',true,400,400);boss.hp=0;updateRun(g,.02);finishDeath(g);assert.equal(g.chests.filter(c=>c.source==='Ridley').length,1);
});
