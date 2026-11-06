import test from 'node:test';import assert from 'node:assert/strict';
import {CHARACTERS,createPlayer,applyChoice,fusionReady,FUSIONS} from '../src/game.js';
import {createRun,spawnEnemy,castWeapon,updateRun,useSpecial} from '../src/engine.js';
import {lelouchKill,isCommanded} from '../src/lelouch.js';
import {characterPixels} from '../src/pixel-characters.js';
import {lelouchIconPixels,LELOUCH_ICON_IDS} from '../src/lelouch-icons.js';
import {SKINS} from '../src/skins.js';
const hero=CHARACTERS.find(c=>c.id==='lelouch');
const quiet=(profile)=>{const g=createRun(hero,0,profile);g.events&&(g.events.nextAt=1e9);g.spawn=g.eliteAt=g.nextBossWave=1e6;g.p.nextXp=1e6;return g;};
const foe=(g,x=120,y=-24,hp=5000)=>{const e=spawnEnemy(g,false,false,'zoomer');Object.assign(e,{x,y,hp,maxHp:hp,speed:0,attackCD:999});return e;};

test('Lelouch & C.C. start with Absolute Command and the Witch’s Code, and evolve them into the Power of the King',()=>{
 const p=createPlayer(hero);assert.deepEqual(p.weapons,{geass:1});assert.deepEqual(p.passives,{witchcode:1});
 const plain=createPlayer(CHARACTERS[0]);assert.ok(p.damage>plain.damage-1e-9);
 p.weapons.geass=5;p.passives.witchcode=3;const f=FUSIONS.find(f=>f.id==='kingspower');assert.ok(fusionReady(p,f));assert.ok(applyChoice(p,{kind:'fusion',id:'kingspower'}));assert.equal(p.fusions.geass,'kingspower');
});
test('the Geass commands enemies to turn on their allies; bosses are only stunned',()=>{
 const g=quiet(),a=foe(g,120,-24),b=foe(g,700,-24),boss=spawnEnemy(g,true,false);Object.assign(boss,{x:150,y:0,speed:0,attackCD:999});
 castWeapon(g,'geass',a);assert.ok(isCommanded(a));assert.ok(!isCommanded(boss));assert.ok(!isCommanded(b));b.x=a.x+40;b.y=a.y;
 const before=b.hp;for(let i=0;i<60;i++)updateRun(g,.02,{x:0,y:0});assert.ok(b.hp<before,'a commanded enemy strikes its ally');
 for(let i=0;i<300;i++)updateRun(g,.02,{x:0,y:0});assert.ok(!isCommanded(a),'the order wears off');
});
test('the Power of the King ends each order with “Die”',()=>{
 const g=quiet();g.p.weapons.geass=5;g.p.passives.witchcode=3;applyChoice(g.p,{kind:'fusion',id:'kingspower'});const a=foe(g,120,-24,800);foe(g,300,300);
 castWeapon(g,'geass',a);assert.ok(a.geassDie);for(let i=0;i<300;i++)updateRun(g,.02,{x:0,y:0});assert.ok(a.hp<=0||!g.enemies.includes(a));
});
test('C.C. follows Lelouch and fires her pistol',()=>{
 const g=quiet();foe(g,160,-20);let fired=false;for(let i=0;i<40;i++){updateRun(g,.02,{x:0,y:0});fired||=g.shots.some(s=>s.type==='ccshot');}
 assert.ok(g.partner);assert.ok(Math.hypot(g.partner.x-g.p.x,g.partner.y-g.p.y)<60);assert.ok(fired);
});
test('a full Checkmate turns the next Geass into a mass command',()=>{
 const g=quiet();for(let i=0;i<40;i++)lelouchKill(g,{commandedKill:true});assert.equal(g.mechanic.value,g.mechanic.max);
 const foes=Array.from({length:8},(_,i)=>foe(g,100+i*20,-30+(i%3)*20));castWeapon(g,'geass',foes[0]);assert.ok(foes.every(isCommanded));assert.equal(g.mechanic.value,0);
});
test('the Gawain is untouchable and fires the Hadron Cannons and slash harkens',()=>{
 const g=quiet(),e=foe(g,200,-30),boss=spawnEnemy(g,true,false);Object.assign(boss,{x:-180,y:10,speed:0,attackCD:999});const bossHp=boss.hp;
 g.special=0;assert.ok(useSpecial(g));assert.equal(g.ultimate.type,'lelouch');for(let i=0;i<100;i++)updateRun(g,.02,{x:0,y:0});
 assert.equal(g.p.pose,'gawain');assert.ok(g.invuln>0);assert.ok(e.hp<5000);assert.ok(boss.hp<bossHp);assert.ok(g.effects.some(f=>f.type==='hadron')||g.effects.some(f=>f.type==='harken'));
});
test('Lelouch, C.C. and their paired outfits have distinct animated pixel art and icons',()=>{
 const looks=[...new Set([...SKINS.lelouch.map(s=>s.id),'casual','pajamas','swimsuit'])];assert.ok(looks.length>=7);
 for(const id of ['lelouch','cc'])assert.equal(new Set(looks.map(skin=>JSON.stringify(characterPixels(id,{skin})))).size,looks.length,id);
 for(const id of ['lelouch','cc'])for(const skin of looks)for(const o of [{blink:true},{expression:'hurt'},{attack:true},{moving:true,frame:1}])assert.notDeepEqual(characterPixels(id,{skin,...o}),characterPixels(id,{skin}),id+' '+skin+' '+JSON.stringify(o));
 assert.equal(new Set(LELOUCH_ICON_IDS.map(id=>JSON.stringify(lelouchIconPixels(id)))).size,LELOUCH_ICON_IDS.length);
});
