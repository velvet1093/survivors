import test from 'node:test';import assert from 'node:assert/strict';
import {CHARACTERS,ITEMS,createPlayer,getChoices,getUpgradePool,applyChoice,openChest,rerollChoices,refreshStats} from '../src/game.js';
import {createRun,spawnEnemy,updateRun,useSpecial} from '../src/engine.js';
import {saveRun,loadRun} from '../src/run-save.js';
import {SHADOW_IDS,MAX_SHADOWS,STAT_IDS,STAT_POINTS,JINWOO_STATS} from '../src/jinwoo-data.js';
import {squadSize,jinwooKill,RISEN_KIND,RISEN_LIMIT,DAILY_QUEST_REWARD} from '../src/jinwoo.js';
import {characterPixels} from '../src/pixel-characters.js';
import {summonPixels} from '../src/summon-art.js';
import {jinwooIconPixels,JINWOO_ICON_IDS} from '../src/jinwoo-icons.js';
import {SKINS} from '../src/skins.js';
const hero=CHARACTERS.find(c=>c.id==='jinwoo');
const quiet=()=>{const g=createRun(hero);g.events&&(g.events.nextAt=1e9);g.spawn=g.eliteAt=g.nextBossWave=1e6;g.p.nextXp=1e6;return g;};
const foe=(g,x=60,y=-10,hp=5000)=>{const e=spawnEnemy(g,false,false,'zoomer');Object.assign(e,{x,y,hp,maxHp:hp,speed:0,attackCD:999});return e;};
const memory=()=>({data:'',getItem(){return this.data},setItem(k,v){this.data=v},removeItem(){}});

test('Jinwoo never receives weapons from level-ups, rerolls or chests, but can take passives',()=>{
 const p=createPlayer(hero);assert.deepEqual(p.weapons,{});assert.deepEqual(p.shadows,{shadowsoldier:1});
 for(let i=0;i<40;i++){const r=()=>((i*37+11)%97)/97;for(const c of [...getChoices(p,r),...(rerollChoices({...p,rerollsLeft:1},getChoices(p,r),r)||[]),...openChest({...p,weapons:{...p.weapons},passives:{...p.passives}},()=>.95)])if(c.kind==='item')assert.notEqual(ITEMS[c.id].type,'weapon',c.id);}
 assert.equal(applyChoice(p,{kind:'item',id:'ki'}),false);assert.deepEqual(p.weapons,{});
 assert.ok(getUpgradePool(p).some(c=>c.kind==='item'&&ITEMS[c.id].type==='passive'));assert.ok(applyChoice(p,{kind:'item',id:'power'}));assert.equal(p.passives.power,1);
});
test('the System offers a stat allocation on every level-up and each stat changes its own numbers',()=>{
 const p=createPlayer(hero);for(let i=0;i<25;i++){const ch=getChoices(p,()=>i/25);assert.equal(ch.filter(c=>c.kind==='stat').length,1);assert.ok(ch.some(c=>ITEMS[c.id]?.type==='shadow'),'a shadow card in every System window');}
 const base={hp:p.maxHp,damage:p.damage,move:p.move,magnet:p.magnet,area:p.area,shadow:p.shadowPower,dagger:p.daggerPower};
 for(const id of STAT_IDS){assert.ok(JINWOO_STATS[id].text.length>10);assert.ok(applyChoice(p,{kind:'stat',id}));assert.equal(p.stats[id],10+STAT_POINTS);}
 assert.ok(p.maxHp>base.hp&&p.damage>base.damage&&p.move>base.move&&p.magnet>base.magnet&&p.area>base.area&&p.shadowPower>base.shadow&&p.daggerPower>base.dagger);
 const other=createPlayer(CHARACTERS[0]);assert.equal(applyChoice(other,{kind:'stat',id:'str'}),false);assert.ok(!getUpgradePool(other).some(c=>c.kind==='stat'));
});
test('shadows belong to Jinwoo alone, fill six slots and unlock the strongest later in the run',()=>{
 for(const c of CHARACTERS.filter(c=>c.id!=='jinwoo')){const p=createPlayer(c);assert.ok(!getUpgradePool(p).some(x=>ITEMS[x.id]?.type==='shadow'));assert.equal(applyChoice(p,{kind:'item',id:'igris'}),false);}
 const p=createPlayer(hero),offered=()=>getUpgradePool(p).filter(c=>ITEMS[c.id]?.type==='shadow').map(c=>c.id);
 assert.ok(!offered().includes('bellion')&&!offered().includes('beru'));p.level=18;assert.ok(offered().includes('bellion')&&offered().includes('beru'));
 for(const id of SHADOW_IDS)applyChoice(p,{kind:'item',id});assert.equal(Object.keys(p.shadows).length,MAX_SHADOWS);assert.ok(!offered().some(id=>!p.shadows[id]));
});
test('shadows fight as lasting summons; the soldier squad grows with its grade',()=>{
 const g=quiet(),e=foe(g);g.p.shadows.shadowsoldier=3;g.p.shadows.igris=1;
 for(let i=0;i<120;i++)updateRun(g,.02,{x:0,y:0});
 assert.equal(g.summons.filter(s=>s.kind==='shadow-shadowsoldier').length,squadSize('shadowsoldier',3));assert.equal(squadSize('shadowsoldier',3),4);
 assert.ok(g.summons.some(s=>s.kind==='shadow-igris'&&s.life===Infinity));assert.ok(e.hp<5000);
});
test('the Daily Quest raises every stat and Arise raises fallen enemies up to its limit',()=>{
 const g=quiet();g.mechanic.value=g.mechanic.max-1;jinwooKill(g,{x:0,y:0});
 for(const id of STAT_IDS)assert.equal(g.p.stats[id],10+DAILY_QUEST_REWARD);assert.equal(g.mechanic.value,0);assert.equal(g.mechanic.stage,1);
 g.special=0;assert.ok(useSpecial(g));assert.equal(g.ultimate.type,'jinwoo');
 for(let i=0;i<RISEN_LIMIT+5;i++)jinwooKill(g,{x:10,y:10});assert.equal(g.summons.filter(s=>s.kind===RISEN_KIND).length,RISEN_LIMIT);
});
test('runs save and restore Jinwoo’s shadows, stats and Daily Quest',()=>{
 const g=quiet();g.p.shadows.tusk=2;g.p.stats.int=16;refreshStats(g.p);g.mechanic.value=37;const s=memory();assert.ok(saveRun(g,s));const r=loadRun(s);
 assert.deepEqual(r.p.shadows,{shadowsoldier:1,tusk:2});assert.equal(r.p.stats.int,16);assert.equal(r.mechanic.value,37);assert.deepEqual(r.p.weapons,{});
});
test('Jinwoo, his skins, his shadows and his icons have distinct animated pixel art',()=>{
 const looks=[...new Set([...SKINS.jinwoo.map(s=>s.id),'monarch','casual','pajamas','swimsuit'])];const frames=looks.map(skin=>JSON.stringify(characterPixels('jinwoo',{skin})));assert.equal(new Set(frames).size,looks.length);
 for(const o of [{blink:true},{expression:'hurt'},{attack:true},{pose:'arise'},{moving:true,frame:1}])assert.notDeepEqual(characterPixels('jinwoo',o),characterPixels('jinwoo'));
 const army=SHADOW_IDS.map(id=>summonPixels('shadow-'+id));assert.equal(new Set(army.map(p=>JSON.stringify(p))).size,SHADOW_IDS.length);for(const p of army)assert.ok(p.filter(Boolean).length>150);
 assert.equal(new Set(JINWOO_ICON_IDS.map(id=>JSON.stringify(jinwooIconPixels(id)))).size,JINWOO_ICON_IDS.length);
});
