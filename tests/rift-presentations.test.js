import test from 'node:test';
import assert from 'node:assert/strict';
import {CHARACTERS} from '../src/game.js';
import {createRun,spawnEnemy,updateRun} from '../src/engine.js';
import {bossPhases,bossPhaseSearchText} from '../src/boss-phase-guide.js';
import {BOSS_CINEMATICS,queueBossIntro,bossIntroMarkup,bossIntroState} from '../src/boss-intro.js';
import {cinematicArt} from '../src/boss-cinema-art.js';
import {saveRun,loadRun} from '../src/run-save.js';

test('new rift bosses have distinct appropriate scenic entrance motifs and three saved stages',()=>{
 const signatures=new Set();
 for(const [id,theme,motifs]of [
  ['aizenrift','hogyoku',['cinema-hogyoku-mirrors','cinema-hogyoku-wings','cinema-hogyoku-coffin']],
  ['madararift','sixpaths',['cinema-sixpaths-moon','cinema-divine-tree','cinema-sixpaths-meteors','cinema-sixpaths-orbs']],
  ['sukunaheian','heianshrine',['cinema-heian-shrine','cinema-heian-jaws','cinema-heian-skulls','cinema-heian-world-cuts','cinema-heian-furnace']],
  ['borosrift','starconqueror',['cinema-boros-starship','cinema-boros-cyclopean-core','cinema-boros-reactor','cinema-boros-restraints','cinema-boros-roaring-cannon']],
 ]){
  const g=createRun(CHARACTERS[0]),e=spawnEnemy(g,true,false,id);queueBossIntro(g,e,5);
  const def=BOSS_CINEMATICS[id],scene=cinematicArt(theme,{archetype:id}),html=bossIntroMarkup(g.bossIntro);
  assert.equal(def.theme,theme);assert.equal(new Set(def.beats).size,3);assert.ok(html.includes(e.name));assert.ok(html.includes(e.title));assert.ok(html.includes('id="skip-intro"'));
  for(const motif of motifs)assert.ok(scene.includes(motif));
  assert.ok(!scene.includes('cinema-crows'));assert.ok(!scene.includes('cinema-clock-hands'));assert.ok(!scene.includes('NaN'));
  signatures.add(scene);
  for(const [progress,stage]of [[0,0],[.5,1],[.9,2]])assert.equal(bossIntroState({...g.bossIntro,age:g.bossIntro.duration*progress}).stage,stage);
  g.bossIntro.age=1.78;let raw;assert.ok(saveRun(g,{setItem(k,v){raw=v;}}));const resumed=loadRun({getItem(){return raw;}});assert.ok(resumed);assert.deepEqual(bossIntroState(resumed.bossIntro),bossIntroState(g.bossIntro));
  const before=JSON.stringify(resumed.bossIntro);updateRun(resumed,3);assert.equal(JSON.stringify(resumed.bossIntro),before);
 }
 assert.equal(signatures.size,4);
});

test('bestiary phases explain new rift warning rules, enrage changes and the Founder’s finite actual summons',()=>{
 for(const id of ['aizenrift','madararift','sukunaheian','borosrift']){
  const phases=bossPhases(id);assert.equal(phases.length,2);assert.ok(phases[0].description.includes('Rift only'));
  assert.ok(phases[1].threshold.includes('50%'));assert.ok(bossPhaseSearchText(id).includes('fixed'));
 }
 assert.match(bossPhaseSearchText('aizenrift'),/Kyōka Suigetsu.*Kurohitsugi.*Fragor/);
 assert.match(bossPhaseSearchText('madararift'),/Tengai Shinsei.*Truth-Seeking.*Limbo/);
 assert.match(bossPhaseSearchText('sukunaheian'),/Malevolent Shrine.*World-Cutting.*Furnace/);
 assert.match(bossPhaseSearchText('sukunaheian'),/fourth staged cleave/);
 assert.match(bossPhaseSearchText('borosrift'),/Meteoric Burst.*Star Cannon.*Collapsing Star Roaring Cannon/);
 assert.match(bossPhaseSearchText('borosrift'),/2\.75 seconds/);
 const founder=bossPhases('foundereren');assert.match(founder[0].description,/two killable Colossal Titans/);assert.match(founder[1].description,/three living Colossal Titans/);assert.match(founder[1].description,/Defeating the Founder removes/);
});
