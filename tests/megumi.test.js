import test from 'node:test';import assert from 'node:assert/strict';
import {CHARACTERS} from '../src/game.js';
import {createRun,spawnEnemy,castWeapon,updateRun} from '../src/engine.js';
import {ensureWorld} from '../src/world.js';
import {SKINS} from '../src/skins.js';
import {summonPixels} from '../src/summon-art.js';
import {characterPixels} from '../src/pixel-characters.js';
import {icon} from '../src/icons.js';
import {MEGUMI_ICON_IDS} from '../src/megumi-icons.js';
import {drawMegumiEffect} from '../src/megumi-effects.js';
const hero=CHARACTERS.find(c=>c.id==='megumi');
function quiet(){const g=createRun(hero,3);g.spawn=g.eliteAt=g.nextBossWave=1e6;g.p.nextXp=1e6;g.p.regen=g.p.dodge=0;g.p.cooldowns.shadows=g.p.cooldowns.nue=999;ensureWorld(g);g.world.active=[];return g;}
function target(g,x=40,y=0){const e=spawnEnemy(g,false,false,'zoomer');Object.assign(e,{x,y,hp:10000,maxHp:10000,speed:0,attackCD:9999});return e;}
function sim(g,t){for(let i=0;i<Math.round(t/.02);i++)updateRun(g,.02,{x:0,y:0});}

test('Megumi has distinct art for every skin and casting pose, and distinct shikigami',()=>{
 assert.equal(new Set(SKINS.megumi.map(s=>JSON.stringify(characterPixels('megumi',{skin:s.id})))).size,SKINS.megumi.length);
 assert.notDeepEqual(characterPixels('megumi',{pose:'summon'}),characterPixels('megumi',{}));
 const kinds=['whiteDog','blackDog','nue','mahoraga'].map(k=>JSON.stringify(summonPixels(k)));assert.equal(new Set(kinds).size,4);
 for(const k of ['whiteDog','blackDog','nue'])assert.notDeepEqual(summonPixels(k,{fused:true}),summonPixels(k),k+' evolves visibly');
});

test('Megumi’s items use his own pixel icons',()=>{
 for(const id of MEGUMI_ICON_IDS)assert.match(icon(id),new RegExp('data-pixel-icon="'+id+'"'));
 assert.equal(new Set(MEGUMI_ICON_IDS.map(id=>icon(id))).size,MEGUMI_ICON_IDS.length);
});

test('summons rise from a shadow pool, dogs leave bite marks and Nue strikes with lightning',()=>{
 const g=quiet(),e=target(g);castWeapon(g,'shadows',e);assert.ok(g.effects.some(f=>f.type==='shadow-summon'));
 sim(g,1);assert.ok(g.effects.some(f=>f.type==='dog-bite'));
 g.p.weapons.nue=1;castWeapon(g,'nue',e);assert.ok(g.effects.some(f=>f.type==='shadow-summon'&&f.bird));
 let struck=false;for(let i=0;i<120&&!struck;i++){sim(g,.02);struck=g.effects.some(f=>f.type==='nue-strike');}assert.ok(struck);
 const calls=[],c=new Proxy({},{get:(t,k)=>k in t?t[k]:(...a)=>{calls.push(k);return {};},set:(t,k,v)=>{t[k]=v;return true;}});
 for(const type of ['shadow-summon','dog-bite','nue-strike','shadow-grasp'])assert.ok(drawMegumiEffect(c,{type,x:0,y:0,r:40,points:[{x:0,y:-30},{x:30,y:0}]},.5),type);
 assert.equal(drawMegumiEffect(c,{type:'nova'},.5),false);assert.ok(calls.length>0);
});
