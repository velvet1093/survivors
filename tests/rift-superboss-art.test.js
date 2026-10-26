import test from 'node:test';
import assert from 'node:assert/strict';
import {enemyPixels,ENEMY_PALETTES} from '../src/pixel-enemies.js';
import {enemyMotion,ENEMY_MOTION_NAMES} from '../src/enemy-animation.js';
import {RIFT_SUPERBOSS_PALETTES,drawRiftBossAura} from '../src/rift-superboss-art.js';
import {BOSS_CINEMATICS,bossIntroMarkup,bossIntroState} from '../src/boss-intro.js';

const region=(p,x,y,w,h)=>Array.from({length:h},(_,dy)=>p.slice((y+dy)*56+x,(y+dy)*56+x+w)).flat();
const count=(p,color)=>p.filter(c=>c===color).length;
const ids=['foundereren','beerus','walpurgisrift','mimic'];

test('rift bosses and mimic keep native sprite protocol, separate silhouettes and animated body parts',()=>{
 const arts=[];
 for(const id of ids){
  const art=enemyPixels(id),attack=enemyPixels(id,{attack:1}),motion=enemyMotion({archetype:id,moving:true},.3);
  assert.equal(art.length,56*76);assert.ok(art.filter(Boolean).length>1000,id+' has a detailed body');
  assert.deepEqual(ENEMY_PALETTES[id],RIFT_SUPERBOSS_PALETTES[id]);
  assert.ok(ENEMY_MOTION_NAMES[id]);assert.notDeepEqual(art,attack,id+' visibly changes when attacking');
  assert.notDeepEqual(art,enemyPixels(id,motion),id+' animates body parts');
  assert.deepEqual(enemyMotion({archetype:id,moving:true},.3,true),enemyMotion({archetype:id,moving:true},4,true),'reduced motion fixes body pose');
  assert.deepEqual(art,enemyPixels(id),'sprite generation is deterministic');
  arts.push(art);
 }
 for(let i=0;i<arts.length;i++)for(let j=i+1;j<arts.length;j++)assert.notDeepEqual(arts[i],arts[j]);
});

test('Founder exposes bone struts and long-haired face, Beerus has ears and Egyptian collar, and Walpurgis is inverted',()=>{
 const f=enemyPixels('foundereren'),b=enemyPixels('beerus'),w=enemyPixels('walpurgisrift');
 assert.ok(count(region(f,1,3,53,36),RIFT_SUPERBOSS_PALETTES.foundereren[0])>150,'bone scaffolding fills the upper silhouette');
 assert.ok(count(region(f,15,35,28,40),RIFT_SUPERBOSS_PALETTES.foundereren[3])>160,'the suspended head has long dark hair');
 assert.ok(count(region(b,14,0,25,17),RIFT_SUPERBOSS_PALETTES.beerus[0])>40,'long purple cat ears extend above the head');
 assert.ok(count(region(b,18,27,19,13),RIFT_SUPERBOSS_PALETTES.beerus[3])>20,'blue collar sits below the face');
 assert.ok(count(region(b,18,27,19,13),RIFT_SUPERBOSS_PALETTES.beerus[4])>20,'gold collar tracing stays separate');
 assert.ok(count(region(w,4,0,48,36),RIFT_SUPERBOSS_PALETTES.walpurgisrift[3])>180,'a toothed city gear crowns the witch');
 assert.ok(count(region(w,19,56,17,14),RIFT_SUPERBOSS_PALETTES.walpurgisrift[2])>40,'upside-down doll face hangs below her dress');
 for(const id of ids.slice(0,3))assert.notDeepEqual(enemyPixels(id),enemyPixels(id,{enraged:1}),id+' has a distinct unleashed phase');
 const mimic=enemyPixels('mimic',{attack:1});
 assert.ok(count(region(mimic,13,29,31,15),RIFT_SUPERBOSS_PALETTES.mimic[3])>40,'teeth border the opening jaws');
 assert.ok(count(region(mimic,26,38,30,18),RIFT_SUPERBOSS_PALETTES.mimic[4])>25,'tongue lashes beyond the chest');
});

test('rift entrances have distinct powers and persisted quiet animation, and decorative auras balance canvas state',()=>{
 const names=new Set();
 for(const id of ids.slice(0,3)){
  const def=BOSS_CINEMATICS[id],intro={archetype:id,name:id,title:'RIFT SUPREMACY',color:'#bda5de',wave:5,age:1,duration:def.duration};
  names.add(def.ability);assert.equal(def.beats.length,3);assert.match(bossIntroMarkup(intro),new RegExp(def.ability.split(' · ')[0]));
  assert.equal(bossIntroState(intro,true).frame,0);
  const log=[],c=new Proxy({}, {get:(o,key)=>o[key]??((...a)=>{log.push([key,...a]);}),set:(o,key,v)=>(o[key]=v,true)});
  assert.equal(drawRiftBossAura(c,{archetype:id,hp:1,x:0,y:0,r:40,riftAttack:{age:.5,duration:2}},1,true),true);
  assert.equal(log.filter(x=>x[0]==='save').length,log.filter(x=>x[0]==='restore').length);
  assert.ok(log.length<100,'aura work stays bounded');
 }
 assert.equal(names.size,3);assert.equal(drawRiftBossAura({}, {archetype:'mimic',hp:1}),false);
});
