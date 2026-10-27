import test from 'node:test';import assert from 'node:assert/strict';
import {CHARACTERS,FUSIONS,ITEMS,createPlayer,applyChoice,fusionReady,refreshStats} from '../src/game.js';
import {createRun,spawnEnemy,castWeapon,updateRun,useSpecial} from '../src/engine.js';
import {saveRun,loadRun} from '../src/run-save.js';
import {broodCount,SHIRAORI_ULTIMATE} from '../src/shiraori.js';
import {HERO_MECHANICS} from '../src/hero-mechanics.js';
import {ULTIMATES} from '../src/ultimates.js';
import {CHARACTER_TREES} from '../src/progression.js';
import {SKINS} from '../src/skins.js';
import {summonPixels} from '../src/summon-art.js';
import {characterPixels} from '../src/pixel-characters.js';
import {icon,SPECIAL_ICONS} from '../src/icons.js';
import {ensureWorld} from '../src/world.js';
import {hasStatus} from '../src/status.js';
import {signatureWeaponIds,signaturePassiveIds} from '../src/hardcore.js';
const hero=CHARACTERS.find(c=>c.id==='shiraori'),memory=()=>({data:new Map(),getItem(k){return this.data.get(k)},setItem(k,v){this.data.set(k,v)},removeItem(k){this.data.delete(k)}});
function quiet(){const g=createRun(hero,3);g.spawn=g.eliteAt=g.nextBossWave=1e6;g.p.nextXp=1e6;g.p.regen=g.p.dodge=0;g.p.cooldowns.spiderbrood=999;ensureWorld(g);return g;}
function target(g,x=60,y=0){const e=spawnEnemy(g,false,false,'zoomer');Object.assign(e,{x,y,hp:10000,maxHp:10000,speed:0,attackCD:9999});return e;}
function sim(g,t){for(let i=0;i<Math.round(t/.02);i++)updateRun(g,.02,{x:0,y:0});}
const brood=g=>g.summons.filter(s=>s.kind==='spiderling'||s.kind==='archtaratect');

test('Shiraori joins the roster as a spider summoner with her own weapon, passive, evolution and ultimate',()=>{
 assert.equal(hero.name,'Shiraori');assert.match(hero.series,/SPIDER/);assert.equal(hero.weapon,'spiderbrood');assert.equal(hero.passive,'parallelminds');
 assert.equal(ITEMS.spiderbrood.owner,'Shiraori');assert.equal(ITEMS.spiderbrood.max,5);assert.equal(ITEMS.parallelminds.max,3);
 const f=FUSIONS.find(f=>f.id==='archtaratect');assert.equal(f.weapon,'spiderbrood');assert.equal(f.passive,'parallelminds');
 assert.equal(ULTIMATES.shiraori,SHIRAORI_ULTIMATE);assert.ok(HERO_MECHANICS.shiraori);assert.equal(SPECIAL_ICONS.shiraori,'queentaratect');
 assert.deepEqual(signatureWeaponIds(hero),['spiderbrood']);assert.deepEqual(signaturePassiveIds(hero),['parallelminds']);
 const p=createPlayer(hero);assert.deepEqual(p.weapons,{spiderbrood:1});assert.deepEqual(p.passives,{parallelminds:1});
});

test('Spider Brood hatches more spiderlings with rank and Parallel Minds, and recasting refreshes rather than stacks',()=>{
 const p=createPlayer(hero);p.passives={};
 assert.deepEqual([1,2,3,4,5].map(rank=>broodCount(p,rank)),[2,3,3,4,4]);
 p.passives.parallelminds=3;assert.equal(broodCount(p,5),7,'Shiraori gains one spiderling per Parallel Minds rank');
 const other=createPlayer(CHARACTERS.find(c=>c.id==='goku'));other.passives.parallelminds=3;assert.equal(broodCount(other,5),4,'other heroes do not');
 const g=quiet();target(g);castWeapon(g,'spiderbrood',g.enemies[0]);assert.equal(brood(g).length,3);
 g.p.weapons.spiderbrood=4;castWeapon(g,'spiderbrood',g.enemies[0]);assert.equal(brood(g).length,5);castWeapon(g,'spiderbrood',g.enemies[0]);assert.equal(brood(g).length,5,'no duplicates');
 assert.ok(brood(g).every(s=>s.life>9));
});

test('spiderlings bite with poison, fill the Egg Sac, and a full sac hatches three extra spiders',()=>{
 const g=quiet(),e=target(g,40);castWeapon(g,'spiderbrood',e);sim(g,2);
 assert.ok(e.hp<10000,'bites deal damage');assert.ok(hasStatus(e,'poison'),'bites poison');assert.ok(g.mechanic.value>0,'bites fill the Egg Sac');
 g.mechanic.value=100;const before=brood(g).length;castWeapon(g,'spiderbrood',e);assert.equal(brood(g).length,before+3);assert.equal(g.mechanic.value,0);
});

test('Arch Taratect Brood evolves the spiders into poison-spreading, web-slowing hunters',()=>{
 const g=quiet();g.p.weapons.spiderbrood=5;g.p.passives.parallelminds=3;refreshStats(g.p);
 assert.ok(fusionReady(g.p,FUSIONS.find(f=>f.id==='archtaratect')));assert.ok(applyChoice(g.p,{kind:'fusion',id:'archtaratect'}));
 const a=target(g,40),b=target(g,70,10);castWeapon(g,'spiderbrood',a);assert.ok(brood(g).every(s=>s.kind==='archtaratect'));
 sim(g,1.5);assert.ok(hasStatus(b,'poison')||hasStatus(b,'slow'),'poison spreads to enemies near the prey');
});

test('the Queen Taratect is a lasting guardian with level-scaled HP and damage that only leaves when defeated',()=>{
 const g=quiet(),e=target(g,70);assert.ok(useSpecial(g));
 const queen=g.summons.find(s=>s.kind==='queentaratect');assert.ok(queen);assert.equal(queen.life,Infinity);assert.ok(queen.hp>0&&queen.hp===queen.maxHp);assert.ok(brood(g).length>=3);
 sim(g,2);assert.ok(e.hp<10000);assert.ok(hasStatus(e,'slow')||hasStatus(e,'poison'));
 sim(g,20);assert.equal(g.ultimate,null);assert.ok(g.summons.some(s=>s.kind==='queentaratect'),'the Queen outlasts the ultimate');
 // Using the ultimate never runs Madoka's Law of Cycles.
 assert.notEqual(g.p.pose,'ascend');assert.ok(!g.shots.some(s=>s.type==='rosebow'));
 // Level growth scales the living Queen's health and stomp damage.
 const hp=queen.maxHp,dmg=queen.damage;g.p.level=21;sim(g,.1);assert.ok(queen.maxHp>hp);assert.ok(queen.damage>dmg);
 // Recasting heals the same Queen; it only leaves once its HP is gone.
 queen.hp=10;g.special=0;assert.ok(useSpecial(g));assert.equal(g.summons.filter(s=>s.kind==='queentaratect').length,1);assert.equal(queen.hp,queen.maxHp);
 queen.hp=0;sim(g,.1);assert.equal(g.summons.some(s=>s.kind==='queentaratect'),false);
});

test('a run with spiders on the field saves and resumes',()=>{
 const g=quiet();target(g);castWeapon(g,'spiderbrood',g.enemies[0]);g.mechanic.value=42;const storage=memory();assert.ok(saveRun(g,storage));
 const loaded=loadRun(storage);assert.equal(loaded.p.id,'shiraori');assert.equal(loaded.mechanic.value,42);assert.equal(brood(loaded).length,3);
});

test('Shiraori has distinct art for every skin, her spiders and her items, and a full mastery tree',()=>{
 assert.ok(SKINS.shiraori.length>=5);assert.equal(new Set(SKINS.shiraori.map(s=>JSON.stringify(characterPixels('shiraori',{skin:s.id})))).size,SKINS.shiraori.length);
 const spiders=['spiderling','archtaratect','queentaratect'].map(k=>JSON.stringify(summonPixels(k)));assert.equal(new Set([...spiders,JSON.stringify(summonPixels('mahoraga'))]).size,4,'spiders do not reuse Mahoraga');
 for(const id of ['spiderbrood','parallelminds','archtaratect','queentaratect'])assert.match(icon(id),new RegExp('data-pixel-icon="'+id+'"'));
 assert.equal(CHARACTER_TREES.shiraori.length,12);
});
