import test from 'node:test';
import assert from 'node:assert/strict';
import {BOSSES} from '../src/enemies.js';
import {RIFT_TRIALS} from '../src/rift-trials.js';
import {bossPhases,bossPhaseSearchText} from '../src/boss-phase-guide.js';
import {bestiary} from '../src/bestiary.js';

test('every rift challenge is explained in its second-phase guide and searchable by its objective name',()=>{
 const names=new Set();
 for(const [id,trial]of Object.entries(RIFT_TRIALS)){
  assert.equal(BOSSES[id].riftOnly,true,id+' stays optional');
  const phases=bossPhases(id),phase=phases[1];
  assert.equal(phases.length,2);
  assert.ok(phase.threshold.includes('50%'));
  assert.ok(phase.description.includes(trial.name),id+' challenge name');
  assert.ok(phase.description.includes(trial.instruction),id+' complete objective');
  assert.match(phase.description,/normal controls/);
  assert.match(phase.description,/cannot be damaged during this one-time challenge/);
  assert.match(phase.description,/hazards remain active/);
  assert.match(phase.description,/saves and pauses/);
  assert.match(phase.description,/defeat the boss for its rift reward/);
  assert.ok(!phases[0].description.includes('Rift challenge at half HP'),'opening attacks stay readable on their own');
  assert.ok(bossPhaseSearchText(id).includes(trial.name));
  const html=bestiary({query:trial.name,kind:'boss'});
  assert.ok(html.includes('<h3>'+BOSSES[id].name+'</h3>'),id+' can be found by challenge name');
  assert.ok(html.includes('CHECK PHASES · 2'));
  assert.ok(!html.includes('undefined'));
  names.add(trial.name);
 }
 assert.equal(names.size,9,'all nine rifts have distinct challenge names');
});

test('challenge guidance retains the existing attacks, escape advice and servant limits',()=>{
 const retained={
  foundereren:['The Rumbling','three living Colossal Titans','Defeating the Founder removes'],
  beerus:['Hakai','Afterimage Judgment','open halo arc'],
  walpurgisrift:['Stage Collapse','Falling City','fixed warning positions'],
  aizenrift:['Kyōka Suigetsu','Kurohitsugi','Fragor'],
  madararift:['Tengai Shinsei','Truth-Seeking','Limbo'],
  sukunaheian:['Malevolent Shrine','World-Cutting','Furnace'],
  borosrift:['Meteoric Burst','Star Cannon','Collapsing Star Roaring Cannon'],
  darknessdevil:['Severance','Primordial Night','Falling Stars','no more than six'],
  deathdevil:['Memento Mori','Pale Crown','Last Horizon','perpendicular'],
 };
 for(const [id,phrases]of Object.entries(retained))for(const phrase of phrases)assert.ok(bossPhaseSearchText(id).includes(phrase),id+' keeps '+phrase);
});

test('regular bosses and world-event bosses keep their existing phase structure without rift objectives',()=>{
 for(const [id,boss]of Object.entries(BOSSES))if(!boss.riftOnly){
  const phases=bossPhases(id);
  assert.equal(phases.length,id==='cell'?3:2);
  assert.ok(phases.every(phase=>!phase.description.includes('Rift challenge at half HP')),id);
 }
});
