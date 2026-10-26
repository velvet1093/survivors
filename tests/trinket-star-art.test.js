import test from 'node:test';
import assert from 'node:assert/strict';
import {trinketPixels,trinketIcon} from '../src/trinket-art.js';
import {newTrinkets,trinketStarCount} from '../src/trinkets.js';
import {trinketRow,trinketCatalog} from '../src/trinket-ui.js';

test('Dragon Ball artwork gains seven visibly distinct star arrangements and keeps the seven-star final refinement',()=>{
 const frames=[];
 for(let rank=0;rank<7;rank++){
  const pixels=trinketPixels('dragonmarble',rank);assert.equal(pixels.length,1024);assert.ok(pixels.filter(Boolean).length>300);assert.ok(pixels.every(color=>color===null||/^#[\da-f]{6}$/i.test(color)));frames.push(JSON.stringify(pixels));
  assert.match(trinketIcon('dragonmarble',rank),new RegExp(`data-stars="${rank+1}"`));assert.equal(trinketStarCount(rank),rank+1);
 }
 assert.equal(new Set(frames).size,7);assert.deepEqual(trinketPixels('dragonmarble',7),trinketPixels('dragonmarble',6));
 const copy=trinketPixels('dragonmarble',4);copy.fill(null);assert.ok(trinketPixels('dragonmarble',4).some(Boolean));
 assert.deepEqual(trinketPixels('dragonmarble',NaN),trinketPixels('dragonmarble',0));assert.deepEqual(trinketPixels('dragonmarble',999),trinketPixels('dragonmarble',7));
});

test('ordinary trinket art stays constant and HUD distinguishes Dragon Ball stars from normal refinements',()=>{
 assert.deepEqual(trinketPixels('scoutscarf',3),trinketPixels('scoutscarf',0));
 const state=newTrinkets();state.equipped=['dragonmarble','scoutscarf',null];state.refinements={dragonmarble:6,scoutscarf:3};
 const html=trinketRow({trinkets:state});assert.match(html,/data-stars="7"/);assert.match(html,/>7★<\/small>/);assert.match(html,/>\+3<\/small>/);assert.match(html,/7-Star Dragon Ball/);
 const catalog=trinketCatalog();assert.match(catalog,/AT \+7/);assert.equal((catalog.match(/AT \+3/g)||[]).length,19);assert.match(catalog,/Shenron/);
});
