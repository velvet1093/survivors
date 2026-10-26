import test from 'node:test';
import assert from 'node:assert/strict';
import {newProfile,loadProfile,saveProfile,sanitizeProfile,nodeState,buyNode,progressionBonuses,creditRun,GENERAL_TREE,CHARACTER_TREES} from '../src/progression.js';
import {CHARACTERS,createPlayer,getChoices,getUpgradePool,rerollChoices,vanishItem,openChest,applyChoice,ITEMS,FUSIONS} from '../src/game.js';
import {createRun,castWeapon,updateRun,spawnEnemy,useSpecial,hitPlayer} from '../src/engine.js';
import {collectPickup} from '../src/world.js';
import {characterPixels} from '../src/pixel-characters.js';
import {enemyPixels,ENEMY_PALETTES} from '../src/pixel-enemies.js';
import {enemyMotion} from '../src/enemy-animation.js';
const char=id=>CHARACTERS.find(c=>c.id===id);
const rich=()=>{const p=newProfile();p.coins=10000;for(const c of Object.values(p.characters))c.xp=10000;return p;};
const quiet=g=>{g.spawn=999;g.eliteAt=999;g.p.regen=0;return g;};
test('shared skills enforce parents, currency, rising rank costs and caps',()=>{
 const p=rich();assert.equal(buyNode(p,'general','vanish'),false);assert.equal(buyNode(p,'general','reroll'),false);assert.equal(buyNode(p,'general','power'),true);assert.equal(p.coins,9970);assert.equal(buyNode(p,'general','power'),true);assert.equal(p.coins,9910);assert.equal(buyNode(p,'general','power'),true);assert.equal(buyNode(p,'general','power'),false);assert.equal(buyNode(p,'general','reroll'),true);assert.equal(buyNode(p,'general','vanish'),true);assert.equal(progressionBonuses(p,'goku').vanishes,1);
 p.coins=0;assert.equal(nodeState(p,'general','vigor').canBuy,false);assert.equal(buyNode(p,'general','vigor'),false);
});
test('each unique mastery tree spends only that character XP and affects only that hero',()=>{
 const p=rich(),coins=p.coins;for(const id of Object.keys(CHARACTER_TREES)){const root=CHARACTER_TREES[id][0];assert.ok(buyNode(p,'character',root.id,id));assert.equal(p.characters[id].xp,10000-root.cost);}assert.equal(p.coins,coins);assert.equal(p.characters.goku.skills.ki,1);assert.equal(p.characters.gojo.skills.ki,undefined);assert.equal(progressionBonuses(p,'goku').signatureDamage,.15);assert.equal(progressionBonuses(p,'gojo').signatureDamage,0);
});
test('run credit is incremental, survives save/load and never pays the same rewards twice',()=>{
 const p=newProfile(),g=createRun(char('maomao'));g.money=25.9;g.characterXp=12.7;assert.deepEqual(creditRun(p,g),{coins:25,xp:12});assert.deepEqual(creditRun(p,g),{coins:0,xp:0});g.money+=10;g.characterXp+=8;assert.deepEqual(creditRun(p,g),{coins:10,xp:8});assert.equal(p.coins,35);assert.equal(p.characters.maomao.totalXp,20);assert.equal(p.characters.goku.xp,0);
 const storage={value:'',setItem(k,v){this.value=v;},getItem(){return this.value;}};assert.ok(saveProfile(p,storage));const loaded=loadProfile(storage);assert.deepEqual(creditRun(loaded,g),{coins:0,xp:0});assert.equal(loaded.coins,35);
});
test('invalid or unavailable storage falls back safely and imported ranks are clamped',()=>{
 assert.deepEqual(loadProfile({getItem(){throw Error();}}),newProfile());assert.deepEqual(loadProfile({getItem(){return 'broken';}}),newProfile());assert.equal(saveProfile(newProfile(),undefined),false);const p=sanitizeProfile({coins:-10,general:{vigor:999,power:-3},characters:{goku:{xp:7,totalXp:2,skills:{ki:999}}}});assert.equal(p.coins,0);assert.equal(p.general.vigor,3);assert.equal(p.general.power,0);assert.equal(p.characters.goku.skills.ki,3);assert.equal(p.characters.goku.totalXp,7);
});
test('reroll replaces eligible choices and consumes exactly one charge',()=>{
 const p=createPlayer(char('goku')),first=getChoices(p,()=>.3),next=rerollChoices(p,first,()=>.7);assert.equal(p.rerollsLeft,0);assert.equal(next.length,3);assert.ok(next.every(c=>!first.some(old=>old.id===c.id)));assert.equal(rerollChoices(p,next),null);
});
test('reroll does not consume a charge if no alternative rewards exist',()=>{
 const p=createPlayer(char('goku'),{rerolls:1});p.weapons={ki:5,blue:5,shuriken:5,kunai:5,orbit:5};p.passives={senzu:3,eyes:3,headband:3,scroll:3,magnet:3};p.fusions={orbit:'galaxy',ki:'kamehameha',blue:'purple',shuriken:'rasen',kunai:'raijin'};assert.equal(rerollChoices(p,getChoices(p)),null);assert.equal(p.rerollsLeft,2);
});
test('vanish removes an item from level-up and chest pools without spending in-run XP',()=>{
 const p=createPlayer(char('goku'));p.xp=4;assert.ok(vanishItem(p,'blue'));assert.equal(p.xp,4);assert.equal(p.vanishesLeft,0);assert.ok(!getUpgradePool(p).some(c=>c.id==='blue'));assert.equal(vanishItem(p,'ki'),false);for(let i=0;i<10;i++)assert.ok(openChest(p,()=>.5).every(c=>c.id!=='blue'));assert.equal(createPlayer(char('goku')).vanished.length,0);
});
test('run bonuses include health, movement, damage, healing, shields and charge counts',()=>{
 const p=rich();p.general={vigor:2,power:2,fortune:1,stride:1,reroll:2,study:1,magnet:1,vanish:1,focus:1};p.characters.maomao.skills={medicine:2,panacea:1};const g=createRun(char('maomao'),0,p);assert.equal(g.p.maxHp,125);assert.equal(g.p.rerollsLeft,3);assert.equal(g.p.vanishesLeft,2);assert.equal(g.p.regen,2.6);assert.equal(g.p.damage,1.1);assert.ok(g.p.move>225);assert.ok(g.p.magnet>115);g.p.hp=10;collectPickup(g,{kind:'food'});assert.ok(Math.abs(g.p.hp-50.5)<.001);collectPickup(g,{kind:'money'});assert.equal(g.money,11);
});
test('mastery capstones start only their own signature weapon at level two',()=>{
 const p=rich();for(const [id,tree] of Object.entries(CHARACTER_TREES)){const cap=tree.find(n=>n.effect.startRank);p.characters[id].skills[cap.id]=1;const g=createRun(char(id),0,p);assert.equal(g.p.weapons[g.p.weapon],2);assert.equal(Object.keys(g.p.weapons).length,char(id).secondWeapon?2:1);}
});
test('signature damage and cooldown bonuses change attacks without boosting borrowed weapons',()=>{
 const p=newProfile();p.characters.goku.skills={ki:1,focus:1};const g=quiet(createRun(char('goku'),0,p)),base=quiet(createRun(char('goku')));for(const run of [g,base]){const e=spawnEnemy(run,false,false,'soldier');e.x=150;e.y=0;e.hp=e.maxHp=1000;castWeapon(run,'ki',e);run.p.cooldowns.ki=999;for(let i=0;i<30;i++)updateRun(run,.02);}assert.ok(g.enemies[0].hp<base.enemies[0].hp);g.p.cooldowns={};base.p.cooldowns={};updateRun(g,.01);updateRun(base,.01);assert.ok(g.p.cooldowns.ki<base.p.cooldowns.ki);for(const run of [g,base]){run.p.weapons.shuriken=1;castWeapon(run,'shuriken',{x:100,y:0});}assert.equal(g.shots.at(-1).damage,base.shots.at(-1).damage);
});
test('projectile mastery increases Naruto and Madoka volleys',()=>{
 for(const [id,node] of [['naruto','blades'],['madoka','arrows']]){const p=newProfile();p.characters[id].skills[node]=2;const g=createRun(char(id),0,p),base=createRun(char(id));castWeapon(g,g.p.weapon,{x:200,y:0});castWeapon(base,base.p.weapon,{x:200,y:0});assert.equal(g.shots.length,base.shots.length+2);}
});
test('ultimate mastery changes Goku radius, Gojo duration, Naruto clone count and Madoka healing',()=>{
 const p=newProfile();p.characters.goku.skills.spirit=1;p.characters.gojo.skills.domain=1;p.characters.naruto.skills.clones=2;p.characters.madoka.skills.mercy=1;p.general.focus=1;
 const runs=CHARACTERS.slice(0,4).map(c=>createRun(c,0,p));runs.forEach(g=>{g.p.hp=1;useSpecial(g);});assert.equal(runs[0].ultimate.r,380*1.12);assert.equal(runs[1].ultimate.duration,5.6);assert.equal(runs[1].freeze,5.6);assert.equal(runs[2].cloneUnits.length,8);assert.equal(runs[3].p.hp,41);assert.ok(runs[0].special<60);
});
test('kills, elites and bosses earn separate persistent XP and boss coins',()=>{
 const p=newProfile();p.general.study=1;p.general.fortune=1;const g=quiet(createRun(char('maomao'),0,p));for(const [elite,boss] of [[false,false],[true,false],[false,true]]){const e=spawnEnemy(g,boss,elite,boss?'frieza':'soldier');e.hp=0;}updateRun(g,.01);for(let i=0;i<75;i++)updateRun(g,.02);assert.ok(Math.abs(g.characterXp-31*1.1)<.001);assert.ok(Math.abs(g.money-27.5)<.001);assert.equal(g.kills,3);assert.equal(g.chests.length,2);
});
test('Maomao throws a vial that lands into a lingering damaging poison field',()=>{
 const g=quiet(createRun(char('maomao'))),e=spawnEnemy(g,false,false,'soldier');e.x=120;e.y=0;e.hp=e.maxHp=1000;e.speed=0;g.p.cooldowns.poison=99;castWeapon(g,'poison',e);assert.equal(g.fields.length,0);assert.equal(g.shots[0].type,'poison');for(let i=0;i<30;i++)updateRun(g,.02);assert.equal(g.shots.filter(s=>s.type==='poison').length,0);assert.equal(g.fields[0].kind,'poison');assert.ok(e.hp<1000);assert.ok(e.statuses.poison.remaining>0);const hp=e.hp;e.x=500;e.y=500;for(let i=0;i<26;i++)updateRun(g,.02);assert.ok(e.hp<hp,'poison continues outside cloud');
});
test('Maomao poison mastery and fusion expand duration and radius',()=>{
 const p=newProfile();p.characters.maomao.skills={toxins:1,garden:1};const g=createRun(char('maomao'),0,p),base=createRun(char('maomao'));castWeapon(g,'poison',{x:100,y:0});castWeapon(base,'poison',{x:100,y:0});assert.ok(g.shots[0].duration>base.shots[0].duration);assert.ok(g.shots[0].cloudRadius>base.shots[0].cloudRadius);g.p.weapons.poison=5;g.p.passives.herbs=3;assert.ok(applyChoice(g.p,{kind:'fusion',id:'elixir'}));castWeapon(g,'poison',{x:100,y:0});assert.ok(g.shots.at(-1).fused);assert.ok(g.shots.at(-1).duration>g.shots[0].duration);
});
test('Panacea heals over time, purges hazards and resists damage while paused runs stay frozen',()=>{
 const g=quiet(createRun(char('maomao')));g.p.hp=40;g.hazards=[{damage:20}];useSpecial(g);assert.equal(g.hazards.length,0);g.invuln=0;hitPlayer(g,20);assert.equal(g.p.hp,27);updateRun(g,.1);assert.ok(g.p.hp>27);assert.equal(g.fields[0].kind,'poison');g.status='paused';const hp=g.p.hp,age=g.ultimate.age;updateRun(g,1);assert.equal(g.p.hp,hp);assert.equal(g.ultimate.age,age);
});
test('all hero and enemy sprites have distinct native pixel art',()=>{
 const heroArt=CHARACTERS.map(c=>characterPixels(c.id));assert.equal(new Set(heroArt.map(p=>JSON.stringify(p))).size,CHARACTERS.length);for(const pixels of heroArt)assert.ok(pixels.filter(Boolean).length>700);
 const art=Object.keys(ENEMY_PALETTES).map(id=>enemyPixels(id,enemyMotion({archetype:id},.2)));assert.equal(art.length,Object.keys(ENEMY_PALETTES).length);assert.equal(new Set(art.map(p=>JSON.stringify(p))).size,art.length);for(const pixels of art){assert.equal(pixels.length,56*76);assert.ok(new Set(pixels.filter(Boolean)).size>=5);}
});
