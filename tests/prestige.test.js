import test from 'node:test';
import assert from 'node:assert/strict';
import {
 newProfile,prestigeRank,prestigeState,prestigeCharacter,PRESTIGE_MAX,PRESTIGE_REWARD,
 CHARACTER_TREES,progressionBonuses,masteryLevel,saveProfile,loadProfile,sanitizeProfile,creditRun,
} from '../src/progression.js';
import {CHARACTERS} from '../src/game.js';
import {createRun,spawnEnemy,updateRun} from '../src/engine.js';
import {saveRun,loadRun} from '../src/run-save.js';

const hero=id=>CHARACTERS.find(c=>c.id===id);
const master=(profile,id)=>{profile.characters[id].skills=Object.fromEntries(CHARACTER_TREES[id].map(n=>[n.id,n.max]));};
const storage=()=>{const values=new Map();return {getItem:key=>values.get(key)||null,setItem:(key,value)=>values.set(key,value),removeItem:key=>values.delete(key)};};

test('every hero must max every mastery rank before prestige can reset training',()=>{
 for(const character of CHARACTERS){
  const p=newProfile(),id=character.id,tree=CHARACTER_TREES[id];
  assert.equal(prestigeState(p,id).canPrestige,false);
  master(p,id);const last=tree.at(-1);p.characters[id].skills[last.id]--;
  const incomplete=structuredClone(p);
  assert.equal(prestigeState(p,id).remaining,1);
  assert.equal(prestigeCharacter(p,id),false);
  assert.deepEqual(p,incomplete,'failed prestige leaves all progress intact');
  p.characters[id].skills[last.id]++;
  assert.equal(prestigeState(p,id).maxed,tree.length);
  assert.equal(prestigeState(p,id).canPrestige,true);
  assert.equal(prestigeCharacter(p,id),true);
  assert.equal(prestigeRank(p,id),1);
  assert.equal(prestigeState(p,id).canPrestige,false,'a new cycle requires training again');
 }
 const p=newProfile(),before=structuredClone(p);
 assert.equal(prestigeCharacter(p,'unknown-hero'),false);
 assert.deepEqual(p,before);
});

test('prestige resets only the chosen hero training and unspent XP, retaining lifetime progress and unlocks',()=>{
 const p=newProfile();p.coins=987;p.bestKills=731;p.general={power:2,vigor:3};
 p.skins={goku:'ssj',featherine:'shrine'};p.pet='cat';
 p.selection={character:'featherine',map:'garden',mode:'bossrush',difficulty:'hard'};
 p.characters.goku={xp:76,totalXp:450,skills:{ki:2},prestige:3};
 const chosen=p.characters.featherine;chosen.xp=456;chosen.totalXp=15000;chosen.prestige=2;master(p,'featherine');
 p.credited={'old-run':{coins:85,xp:120}};
 const before=structuredClone(p),oldMastery=masteryLevel(p,'featherine');
 assert.equal(prestigeCharacter(p,'featherine'),true);
 assert.deepEqual(p.characters.featherine,{xp:0,totalXp:15000,skills:{},prestige:3});
 assert.equal(masteryLevel(p,'featherine'),oldMastery);
 before.characters.featherine=structuredClone(p.characters.featherine);
 assert.deepEqual(p,before,'coins, shared upgrades, cosmetics, other heroes, selection and reward ledger are unchanged');
});

test('prestige cannot repay rewards already credited from an existing run',()=>{
 const p=newProfile(),run=createRun(hero('yuki'));run.money=54;run.characterXp=81;
 assert.deepEqual(creditRun(p,run),{coins:54,xp:81});master(p,'yuki');
 assert.equal(prestigeCharacter(p,'yuki'),true);
 assert.deepEqual(creditRun(p,run),{coins:0,xp:0});
 assert.equal(p.characters.yuki.xp,0);assert.equal(p.characters.yuki.totalXp,81);
 run.money+=9;run.characterXp+=14;
 assert.deepEqual(creditRun(p,run),{coins:9,xp:14});
 assert.equal(p.characters.yuki.xp,14);assert.equal(p.characters.yuki.totalXp,95);assert.equal(p.coins,63);
});

test('each cycle preserves previous prestige and stops at the maximum rank',()=>{
 const p=newProfile();
 for(let rank=1;rank<=PRESTIGE_MAX;rank++){
  master(p,'goku');p.characters.goku.xp=22;
  assert.equal(prestigeCharacter(p,'goku'),true);assert.equal(prestigeRank(p,'goku'),rank);
  assert.deepEqual(p.characters.goku.skills,{});assert.equal(p.characters.goku.xp,0);
 }
 master(p,'goku');p.characters.goku.xp=99;const before=structuredClone(p);
 assert.equal(prestigeState(p,'goku').atCap,true);
 assert.equal(prestigeCharacter(p,'goku'),false);assert.deepEqual(p,before);
});

test('legacy saves remain prestige zero and prestige survives save, load and sanitization',()=>{
 const old=newProfile();old.characters.goku={xp:5,totalXp:123,skills:{ki:2}};
 const legacy=sanitizeProfile(old);assert.equal(prestigeRank(legacy,'goku'),0);
 assert.equal(legacy.characters.goku.xp,5);assert.equal(legacy.characters.goku.skills.ki,2);
 master(old,'goku');assert.ok(prestigeCharacter(old,'goku'));const memory=storage();
 assert.equal(saveProfile(old,memory),true);const restored=loadProfile(memory);
 assert.equal(prestigeRank(restored,'goku'),1);assert.equal(restored.characters.goku.xp,0);
 assert.equal(restored.characters.goku.totalXp,123);assert.ok(Object.values(restored.characters.goku.skills).every(rank=>rank===0));
 for(const [value,expected]of [[-4,0],[2.9,2],[999,PRESTIGE_MAX],[NaN,0],[Infinity,0],['5',0],[null,0]]){
  const raw=newProfile();raw.characters.goku.prestige=value;
  assert.equal(prestigeRank(sanitizeProfile(raw),'goku'),expected);
 }
 assert.equal(prestigeRank(null,'goku'),0);
});

test('prestige bonuses apply to new runs for only that hero and stack with shared training',()=>{
 const p=newProfile();p.general={power:2,vigor:1,study:1};
 const otherBefore=createRun(hero('naruto'),0,p),gokuBefore=createRun(hero('goku'),0,p);
 master(p,'goku');assert.ok(prestigeCharacter(p,'goku'));
 const first=createRun(hero('goku'),0,p),otherAfter=createRun(hero('naruto'),0,p);
 assert.equal(first.p.maxHp,gokuBefore.p.maxHp+PRESTIGE_REWARD.hp);
 assert.ok(Math.abs(first.p.damage-gokuBefore.p.damage*(1+.1+PRESTIGE_REWARD.damage)/(1+.1))<1e-10);
 assert.equal(first.p.meta.masteryGain,.1+PRESTIGE_REWARD.masteryGain);
 assert.equal(otherAfter.p.maxHp,otherBefore.p.maxHp);assert.equal(otherAfter.p.damage,otherBefore.p.damage);
 assert.deepEqual(otherAfter.p.meta,otherBefore.p.meta);
 master(p,'goku');assert.ok(prestigeCharacter(p,'goku'));
 const next=createRun(hero('goku'),0,p);
 assert.equal(next.p.maxHp,gokuBefore.p.maxHp+2*PRESTIGE_REWARD.hp);
 assert.ok(next.p.damage>first.p.damage);assert.equal(next.p.meta.masteryGain,.1+2*PRESTIGE_REWARD.masteryGain);
 assert.equal(progressionBonuses(p,'goku').damage,.1+2*PRESTIGE_REWARD.damage);
});

test('prestige character XP bonus changes actual enemy rewards',()=>{
 const p=newProfile();p.characters.maomao.prestige=2;
 const baseline=createRun(hero('maomao')),prestiged=createRun(hero('maomao'),0,p);
 for(const run of [baseline,prestiged]){
  run.spawn=999;run.eliteAt=999;const enemy=spawnEnemy(run,false,false,'soldier');enemy.hp=0;
  updateRun(run,.01);
 }
 assert.equal(baseline.characterXp,1);
 assert.equal(prestiged.characterXp,1+2*PRESTIGE_REWARD.masteryGain);
});

test('an existing saved run retains its original stats when its hero prestiges',()=>{
 const p=newProfile();master(p,'goku');p.characters.goku.xp=80;
 const run=createRun(hero('goku'),0,p),memory=storage(),meta=structuredClone(run.p.meta),hp=run.p.maxHp;
 assert.equal(saveRun(run,memory),true);const snapshot=memory.getItem('anime-survivors-run-v1');
 assert.ok(prestigeCharacter(p,'goku'));assert.equal(saveProfile(p,memory),true);
 assert.equal(memory.getItem('anime-survivors-run-v1'),snapshot,'prestige never edits the active checkpoint');
 const resumed=loadRun(memory);assert.ok(resumed);assert.equal(resumed.status,'paused');
 assert.deepEqual(resumed.p.meta,meta);assert.equal(resumed.p.maxHp,hp);
 const fresh=createRun(hero('goku'),0,loadProfile(memory));
 assert.equal(fresh.p.meta.hp,PRESTIGE_REWARD.hp);assert.equal(fresh.p.meta.damage,PRESTIGE_REWARD.damage);
});
