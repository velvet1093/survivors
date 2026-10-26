import test from 'node:test';
import assert from 'node:assert/strict';
import {ENEMIES,BOSSES,MAP_ENEMIES,REGULAR_BOSS_IDS,FEATURED_SHARE,featuredBosses,pickEnemy,pickBoss,shuffledBossOrder} from '../src/enemies.js';
import {MAPS} from '../src/game.js';

const sweep=(n,fn)=>Array.from({length:n},(_,i)=>fn(()=>(i+.5)/n));

test('every map favours its own enemies and bosses but can still roll anything',()=>{
 for(const map of MAPS){
  const foes=sweep(2000,r=>pickEnemy(map.id,99,r)),own=foes.filter(id=>MAP_ENEMIES[map.id].includes(id)).length/foes.length;
  assert.ok(Math.abs(own-FEATURED_SHARE.enemy)<.03,map.id+' enemy share '+own);assert.ok(foes.every(id=>ENEMIES[id]&&!BOSSES[id]));
  const bosses=sweep(2000,r=>pickBoss(map.id,{random:r})),featured=featuredBosses(map.id),share=bosses.filter(id=>featured.includes(id)).length/bosses.length;
  assert.ok(Math.abs(share-FEATURED_SHARE.boss)<.03,map.id+' boss share '+share);assert.deepEqual(new Set(bosses),new Set(REGULAR_BOSS_IDS));
 }
});
test('the same boss never comes twice in a row and Boss Rush shuffles a full roster',()=>{
 for(const id of REGULAR_BOSS_IDS.slice(0,8))for(let i=0;i<20;i++)assert.notEqual(pickBoss('garden',{exclude:[id]}),id);
 const a=shuffledBossOrder('garden'),b=shuffledBossOrder('garden');assert.deepEqual([...a].sort(),[...REGULAR_BOSS_IDS].sort());
 assert.ok(a.join()!==b.join()||shuffledBossOrder('garden').join()!==a.join(),'no set order');
});
test('early waves still hold back advanced enemies',()=>{
 const late=Object.keys(ENEMIES).filter(id=>(ENEMIES[id].minWave||1)>1);
 if(late.length)assert.ok(sweep(500,r=>pickEnemy('garden',1,r)).every(id=>!late.includes(id)));
});
