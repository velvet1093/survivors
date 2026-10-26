import test from 'node:test';
import assert from 'node:assert/strict';
import {DEVIL_PALETTES,devilEnemyPixels} from '../src/devil-enemy-art.js';
import {enemyPixels,ENEMY_PALETTES} from '../src/pixel-enemies.js';
import {ENEMY_MOTION_NAMES,enemyMotion} from '../src/enemy-animation.js';
import {drawDevilAttack} from '../src/devil-attack-art.js';
function context(){let depth=0;const ops=[];const c=new Proxy({save(){depth++;ops.push(['save']);},restore(){depth--;assert.ok(depth>=0);ops.push(['restore']);}},{get(target,key){return key in target?target[key]:(...args)=>{assert.ok(args.filter(n=>typeof n==='number').every(Number.isFinite),String(key));ops.push([key,...args]);};},set(target,key,value){if(typeof value==='number')assert.ok(Number.isFinite(value));target[key]=value;return true;}});return{c,ops,depth:()=>depth};}
test('ten new devil and rift threats have original complete native bodies with explicit palette and motion integration',()=>{
 const seen=new Set();for(const id of Object.keys(DEVIL_PALETTES)){
  const p=devilEnemyPixels(id);assert.equal(p.length,56*76);assert.ok(p.filter(Boolean).length>500,id+' completebody');assert.ok(p.every(c=>c===null||/^#[a-f0-9]{6}$/i.test(c)));assert.deepEqual(enemyPixels(id),p);assert.ok(ENEMY_PALETTES[id]);assert.ok(ENEMY_MOTION_NAMES[id]);seen.add(JSON.stringify(p));
  assert.notDeepEqual(p,devilEnemyPixels(id,{attack:1}),id+' distinctattack');assert.notDeepEqual(p,devilEnemyPixels(id,enemyMotion({archetype:id,moving:true},.31)),id+' articulatedmotion');assert.deepEqual(enemyMotion({archetype:id,moving:true},0,true),enemyMotion({archetype:id,moving:true},99,true));
 }
 assert.equal(seen.size,10);assert.equal(devilEnemyPixels('unknown'),null);
});
test('all four new boss bodies expose visible second-phase changes while preserving native dimensions',()=>{
 for(const id of ['katanaman','batdevil','eternitydevil','darknessdevil']){assert.notDeepEqual(devilEnemyPixels(id),devilEnemyPixels(id,{enraged:1}),id);assert.equal(devilEnemyPixels(id,{enraged:1,attack:1,leg:4,arm:3}).length,56*76);}
});
test('devil attack effects follow saved fixed geometry, stay finite and restore canvas through quiet and moving releases',()=>{
 const marks=[{shape:'line',x:-100,y:10,tx:230,ty:60,width:15,delay:1.2,duration:.6},{shape:'circle',x:25,y:10,r:65,delay:1.4,duration:.5}];
 for(const [id,styles]of [['katanaman',['iaicut','crossingsteel','sheathedge']],['batdevil',['sonicroar','bloodlance','wingcrush']],['eternitydevil',['endlesshall','fleshlabyrinth','clockcollapse']]])for(const style of styles)for(const reduced of [false,true])for(const age of [.5,1.55,2.5]){
  const e={archetype:id,boss:true,hp:1,r:40,x:100,y:10,devilAttack:{style,age,x:100,y:10,marks}},before=JSON.stringify(e),a=context();assert.equal(drawDevilAttack(a.c,e,reduced),true);assert.equal(a.depth(),0);assert.equal(JSON.stringify(e),before);assert.ok(a.ops.length<500);const b=context();drawDevilAttack(b.c,e,reduced);assert.deepEqual(a.ops,b.ops);
 }
 assert.equal(drawDevilAttack({}, {hp:0,boss:true,devilAttack:{age:0}}),false);assert.equal(drawDevilAttack({}, {hp:1,boss:false,devilAttack:{age:0}}),false);
});
