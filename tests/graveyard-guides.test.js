import test from 'node:test';
import assert from 'node:assert/strict';
import {BOSSES,REGULAR_BOSS_IDS} from '../src/enemies.js';
import {bossPhases,bossPhaseSearchText} from '../src/boss-phase-guide.js';
import {bestiary} from '../src/bestiary.js';
import {BOSS_CINEMATICS,bossIntroMarkup,bossIntroState,queueBossIntro,finishBossIntro} from '../src/boss-intro.js';
import {RIFT_TRIALS} from '../src/rift-trials.js';

const ids=['ryuma','moriah','peronaparade','ainztomb'];
test('the graveyard threats have searchable two-phase guides without becoming rift challenges',()=>{
 for(const id of ids){
  assert.ok(BOSSES[id],id+' is registered');const phases=bossPhases(id),text=bossPhaseSearchText(id);
  assert.equal(phases.length,2);assert.equal(phases[0].name,BOSSES[id].name);assert.match(phases[0].threshold,/100%–50% HP/);assert.match(phases[1].threshold,/below 50% HP/);
  for(const phase of phases){assert.ok(phase.description.length>100,id+' has usable attack guidance');assert.ok(!phase.description.includes('undefined'));assert.ok(!phase.description.includes('Rift challenge at half HP'));}
  assert.match(text,/fixed|warning/i);assert.ok(text.includes(phases[1].name));
  const html=bestiary({query:phases[1].name,kind:'boss'});assert.ok(html.includes('<h3>'+BOSSES[id].name+'</h3>'));assert.ok(html.includes('CHECK PHASES · 2'));
  assert.equal(REGULAR_BOSS_IDS.includes(id),!BOSSES[id].eventOnly,id+' keeps its regular/event role');
 }
 assert.equal(bossPhases('ryuma')[1].name,'Ryuma · Brook’s Shadow');assert.equal(bossPhases('moriah')[1].name,'Gecko Moria · Shadow Asgard');
});

test('Ryuma and Moriah phase notes explain their three patterns and the actual phase-two additions',()=>{
 for(const [id,names]of [['ryuma',['Flying Dragon Draw','Three-Verse Crescent','Grave of Swords']],['moriah',['Brick Bat Swarm','Doppelman Cross','Shadow Spear Procession']]]){
  const phases=bossPhases(id);for(const name of names)assert.ok(phases.every(phase=>phase.description.includes(name)),id+' '+name);
 }
 const ryuma=bossPhases('ryuma')[1].description,moriah=bossPhases('moriah')[1].description;
 assert.match(ryuma,/perpendicular/);assert.match(ryuma,/five wider lanes/);assert.match(ryuma,/open escape side/);
 assert.match(moriah,/third crossing/);assert.match(moriah,/five larger pillars/);assert.match(moriah,/no warned mark follows/);
});

test('event phase notes explain Perona and Ainz spell sequences and their retained escape openings',()=>{
 const perona=bossPhases('peronaparade'),ainz=bossPhases('ainztomb');
 for(const name of ['Hollow Procession','Ring of Regret','Umbrella Hex'])assert.ok(perona.every(phase=>phase.description.includes(name)),name);
 for(const name of ['Bone Prison','Grasp Heart','Fallen Down'])assert.ok(ainz.every(phase=>phase.description.includes(name)),name);
 assert.match(perona[0].description,/central corridor/);assert.match(perona[1].description,/six ghost impacts to eight/);assert.match(perona[1].description,/five outer hollows to seven/);assert.match(perona[1].description,/perpendicular/);
 assert.match(ainz[0].description,/wide doorway/);assert.match(ainz[1].description,/two outside bone pillars/);assert.match(ainz[1].description,/five fixed impacts/);assert.match(ainz[1].description,/escape openings/);
});

test('each new boss enters with its own named, skippable signature vision on the saved cinematic clock',()=>{
 const abilities=new Set(),captions=new Set();
 for(const id of ids){
  const boss={...BOSSES[id],id:101,archetype:id},g={p:{reducedMotion:false},bossIntro:null,bossIntroQueue:[],invuln:0};
  queueBossIntro(g,boss,5);const intro=g.bossIntro,def=BOSS_CINEMATICS[id];assert.ok(def);assert.equal(intro.duration,def.duration);assert.ok(intro.duration>=4);assert.equal(new Set(def.beats).size,3);abilities.add(def.ability);captions.add(def.caption);
  const states=[.1,.5,.9].map(t=>bossIntroState({...intro,age:intro.duration*t}));assert.deepEqual(states.map(v=>v.stage),[0,1,2]);assert.equal(new Set(states.map(v=>v.label)).size,3);
  const before=structuredClone(intro),html=bossIntroMarkup(intro);assert.deepEqual(intro,before);assert.ok(html.includes(def.ability));assert.ok(html.includes('id="skip-intro"'));assert.ok(html.includes('Combat is paused'));assert.ok(!html.includes('undefined'));
  assert.ok(finishBossIntro(g));assert.equal(g.bossIntro,null);assert.ok(g.invuln>=.8);
  const quietRun={...g,p:{reducedMotion:true}};queueBossIntro(quietRun,boss,5);assert.equal(quietRun.bossIntro.duration,1.2);
  const quiet=bossIntroState({...intro,reducedMotion:true,age:.1}),still=bossIntroState({...intro,reducedMotion:true,age:intro.duration*.9});
  for(const field of ['reveal','title','rotation','rise','drift','power'])assert.equal(quiet[field],still[field],id+' quiet '+field);
 }
 assert.equal(abilities.size,4);assert.equal(captions.size,4);
});

test('graveyard guides preserve every existing calamity objective and the regular/event phase boundaries',()=>{
 assert.equal(Object.keys(RIFT_TRIALS).length,9);
 for(const [id,trial]of Object.entries(RIFT_TRIALS)){
  const phases=bossPhases(id);assert.ok(phases[1].description.includes(trial.name));assert.ok(phases[1].description.includes(trial.instruction));assert.ok(!phases[0].description.includes('Rift challenge at half HP'));
 }
 for(const id of ['aura','motherbrain','eclipsefemto','tempestlord','frostregent'])assert.ok(!bossPhaseSearchText(id).includes('Rift challenge at half HP'));
});
