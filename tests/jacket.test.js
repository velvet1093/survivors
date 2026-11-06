import test from 'node:test';import assert from 'node:assert/strict';
import {CHARACTERS,createPlayer,applyChoice,fusionReady,FUSIONS} from '../src/game.js';
import {createRun,spawnEnemy,castWeapon,updateRun,useSpecial} from '../src/engine.js';
import {jacketKill,FRENZY_SECONDS} from '../src/jacket.js';
import {heroDamageBonus,heroMoveBonus} from '../src/hero-mechanics.js';
import {characterPixels} from '../src/pixel-characters.js';
import {jacketIconPixels,JACKET_ICON_IDS} from '../src/jacket-icons.js';
import {SKINS} from '../src/skins.js';
const hero=CHARACTERS.find(c=>c.id==='jacket');
const quiet=(profile)=>{const g=createRun(hero,0,profile);g.events&&(g.events.nextAt=1e9);g.spawn=g.eliteAt=g.nextBossWave=1e6;g.p.nextXp=1e6;return g;};
const foe=(g,x=120,y=-24,hp=5000)=>{const e=spawnEnemy(g,false,false,'zoomer');Object.assign(e,{x,y,hp,maxHp:hp,speed:0,attackCD:999});return e;};

test('Jacket starts with Uzi Spray and Richard the Rooster, and evolves them into Hotline Massacre',()=>{
 const p=createPlayer(hero);assert.deepEqual(p.weapons,{uzi:1});assert.deepEqual(p.passives,{roostermask:1});
 const plain=createPlayer(CHARACTERS[0]);assert.ok(p.damage>plain.damage-1e-9);
 p.weapons.uzi=5;p.passives.roostermask=3;const f=FUSIONS.find(f=>f.id==='hotline');assert.ok(fusionReady(p,f));assert.ok(applyChoice(p,{kind:'fusion',id:'hotline'}));assert.equal(p.fusions.uzi,'hotline');
});
test('Uzi bursts fire several bullets; the Biker throws knives and Hotline Massacre adds a stunning hammer',()=>{
 const g=quiet(),e=foe(g);castWeapon(g,'uzi',e);assert.ok(g.shots.filter(s=>s.type==='uzi').length>=2);assert.ok(g.shots.every(s=>!s.knife));
 const b=quiet();b.p.skin='biker';castWeapon(b,'uzi',foe(b));assert.ok(b.shots.every(s=>s.knife));
 const h=quiet();h.p.weapons.uzi=5;h.p.passives.roostermask=3;applyChoice(h.p,{kind:'fusion',id:'hotline'});const t=foe(h);for(let i=0;i<4;i++)castWeapon(h,'uzi',t);
 assert.equal(h.shots.filter(s=>s.type==='hammer').length,1);for(let i=0;i<40;i++)updateRun(h,.02,{x:0,y:0});assert.ok(t.hp<5000);
});
test('quick kills chain a Combo into a lethal frenzy, and an idle chain drains away',()=>{
 const g=quiet();for(let i=0;i<9;i++)jacketKill(g,{});assert.equal(g.mechanic.active,0);assert.equal(g.mechanic.chain,9);
 jacketKill(g,{});assert.equal(g.mechanic.active,FRENZY_SECONDS);assert.equal(heroDamageBonus(g),1.3);assert.equal(heroMoveBonus(g),1.15);
 const d=quiet();for(let i=0;i<5;i++)jacketKill(d,{});const before=d.mechanic.value;for(let i=0;i<200;i++)updateRun(d,.02,{x:0,y:0});assert.ok(d.mechanic.value<before);assert.equal(d.mechanic.chain,0);
});
test('Hotline Rampage keeps Jacket in place, untouchable, smashing around him and executing weakened enemies',()=>{
 const g=quiet(),weak=foe(g,40,0,100),boss=spawnEnemy(g,true,false);Object.assign(boss,{x:50,y:10,speed:0,attackCD:999});const start={x:g.p.x,y:g.p.y};weak.hp=30;const bossHp=boss.hp;
 g.special=0;assert.ok(useSpecial(g));assert.equal(g.ultimate.type,'jacket');for(let i=0;i<40;i++)updateRun(g,.02,{x:0,y:0});
 assert.equal(g.p.pose,'rampage');assert.deepEqual({x:g.p.x,y:g.p.y},start,'no dash or teleport');assert.ok(g.invuln>0);assert.ok(!g.enemies.includes(weak)||weak.hp<=0);assert.ok(boss.hp>0&&boss.hp<bossHp);
});
test('Jacket, the Biker and his off-duty outfits have distinct animated pixel art and icons',()=>{
 const looks=[...new Set([...SKINS.jacket.map(s=>s.id),'biker','casual','pajamas','swimsuit'])];assert.equal(new Set(looks.map(skin=>JSON.stringify(characterPixels('jacket',{skin})))).size,looks.length);
 for(const skin of ['default','biker'])for(const o of [{blink:true},{expression:'hurt'},{attack:true},{pose:'rampage'},{moving:true,frame:1}])assert.notDeepEqual(characterPixels('jacket',{skin,...o}),characterPixels('jacket',{skin}));
 assert.equal(new Set(JACKET_ICON_IDS.map(id=>JSON.stringify(jacketIconPixels(id)))).size,JACKET_ICON_IDS.length);
});
