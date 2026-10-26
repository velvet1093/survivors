import test from 'node:test';import assert from 'node:assert/strict';
import {bestiary} from '../src/bestiary.js';import {bossPhases,bossPhaseSearchText} from '../src/boss-phase-guide.js';
import {BOSSES,updateEnemyAI} from '../src/enemies.js';import {enemyPixels} from '../src/pixel-enemies.js';import {pixelsSvg} from '../src/pixel-characters.js';
import {CHARACTERS} from '../src/game.js';import {createRun,spawnEnemy,damageEnemy} from '../src/engine.js';import {finishBossIntro} from '../src/boss-intro.js';

test('every boss has an expandable guide with its actual phase artwork, HP triggers and mechanics',()=>{
 const html=bestiary({kind:'boss'});assert.equal((html.match(/class="boss-phases"/g)||[]).length,Object.keys(BOSSES).length);assert.equal((html.match(/class="boss-phase-card"/g)||[]).length,Object.keys(BOSSES).length*2+1);
 for(const id of Object.keys(BOSSES)){
  const phases=bossPhases(id);assert.equal(phases.length,id==='cell'?3:2);
  for(const phase of phases){assert.ok(phase.description.length>30,id);assert.ok(phase.threshold.includes('HP'));assert.ok(html.includes(phase.name));assert.ok(html.includes(phase.threshold));assert.ok(html.includes(pixelsSvg(enemyPixels(id,phase.art))),id+' uses its real phase art');}
 }
 assert.ok(html.includes('20% DAMAGE RESISTANCE'));assert.ok(html.includes('GUARANTEED CHEST'));assert.equal(bossPhases('shinobi').length,0);assert.ok(!bestiary({kind:'enemy'}).includes('class="boss-phases"'));
});

test('bestiary searches find transformed forms and phase-only attacks without changing the entry identity',()=>{
 for(const [query,id]of [['Female Titan','annie'],['Armored Titan','reiner'],['Colossal Titan','bertholdt'],['Semi-Perfect Cell','cell'],['Perfect Kamehameha','cell'],['Walking Form','motherbrain'],['Segunda Etapa','ulquiorra']]){
  const html=bestiary({query,kind:'boss'});assert.ok(html.includes('<h3>'+BOSSES[id].name+'</h3>'));assert.ok(html.includes('CHECK PHASES'));assert.ok(bossPhaseSearchText(id).toLowerCase().includes(query.toLowerCase()));
 }
 assert.ok(bestiary({query:'imaginary-phase-not-in-game',kind:'boss'}).includes('No matching threats'));
});

test('Cell, human shifters and Mother Brain previews match the actual transformation states',()=>{
 for(const id of ['cell','annie','reiner','bertholdt','motherbrain']){
  const g=createRun(CHARACTERS[0]),e=spawnEnemy(g,true,false,id);Object.assign(e,{hp:10000,maxHp:10000,x:200,y:0,speed:0,attackCD:999});
  const phases=bossPhases(id);
  for(const phase of phases){
   if(phase.index){if(id==='cell')damageEnemy(g,e,1e9);else e.hp=e.maxHp*.49;updateEnemyAI(g,e,.01);finishBossIntro(g);}
   assert.equal(phase.name,e.name);assert.deepEqual(phase.art,{cellStage:e.cellStage||0,enraged:e.enraged?1:0});assert.deepEqual(enemyPixels(id,phase.art),enemyPixels(id,{cellStage:e.cellStage||0,enraged:e.enraged?1:0}));
  }
 }
});

test('viewing phase guides never mutates boss definitions or leaks selected phases into later previews',()=>{
 const definitions=JSON.stringify(BOSSES),cell=bossPhases('cell');cell[2].art.cellStage=0;cell[2].name='Edited local copy';
 assert.equal(bossPhases('cell')[2].art.cellStage,2);assert.equal(bossPhases('cell')[2].name,'Perfect Cell');
 const before=bestiary({query:'Mother Brain',kind:'boss'});bestiary({query:'Colossal Titan'});bestiary({query:'Perfect Cell'});assert.equal(bestiary({query:'Mother Brain',kind:'boss'}),before);assert.equal(JSON.stringify(BOSSES),definitions);
});
