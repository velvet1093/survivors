import test from 'node:test';
import assert from 'node:assert/strict';
import {EVENT_PALETTES,eventEnemyPixels,drawWorldEventWeather,drawWorldEventAttack} from '../src/world-event-art.js';
import {enemyMotion,ENEMY_MOTION_NAMES} from '../src/enemy-animation.js';
import {berserkEnemyPixels} from '../src/berserk-enemy-art.js';
import {warPixels} from '../src/war-pixels.js';
const context=()=>{const ops=[];let depth=0;const c=new Proxy({globalAlpha:1,save(){depth++;ops.push(['save']);},restore(){depth--;assert.ok(depth>=0);ops.push(['restore']);}},{get(target,key){return key in target?target[key]:(...args)=>{assert.ok(args.filter(v=>typeof v==='number').every(Number.isFinite),String(key));ops.push([key,...args]);};},set(target,key,value){if(typeof value==='number')assert.ok(Number.isFinite(value));target[key]=value;return true;}});return{c,ops,depth:()=>depth};};

test('weather event bosses and minions have ten distinct native bodies with animated attacks and recognizable source motifs',()=>{
 const art=[];for(const id of Object.keys(EVENT_PALETTES)){
  const p=eventEnemyPixels(id);assert.equal(p.length,56*76);assert.ok(p.filter(Boolean).length>1000,id+' complete body');for(const color of p)assert.ok(color===null||/^#[a-f0-9]{6}$/i.test(color));
  assert.ok(ENEMY_MOTION_NAMES[id]);assert.notDeepEqual(p,eventEnemyPixels(id,{attack:1}),id+' attack gesture');assert.notDeepEqual(p,eventEnemyPixels(id,enemyMotion({archetype:id,moving:true},.35)),id+' body motion');
  assert.deepEqual(enemyMotion({archetype:id,moving:true},0,true),enemyMotion({archetype:id,moving:true},20,true));art.push(JSON.stringify(p));
 }
 assert.equal(new Set(art).size,10);assert.notDeepEqual(eventEnemyPixels('eclipsefemto'),berserkEnemyPixels('femto',{enraged:1}));assert.notDeepEqual(eventEnemyPixels('frostregent'),warPixels('aokiji'));
 for(const id of ['eclipsefemto','tempestlord','frostregent'])assert.notDeepEqual(eventEnemyPixels(id),eventEnemyPixels(id,{enraged:1}),id+' phase2');
 assert.equal(eventEnemyPixels('unknown'),null);
});

test('screen-space weather is deterministic from saved clocks, bounded and quiet while other arenas stay clear',()=>{
 const render=(id,age,quiet=false,active=false)=>{const a=context(),g={mode:'survival',events:{weather:{id,age},active:active?{id,age}:null}};assert.equal(drawWorldEventWeather(a.c,g,390,844,quiet),id!=='clear');assert.equal(a.depth(),0);assert.ok(a.ops.length<700);return a.ops;};
 assert.deepEqual(render('clear',3),[]);
 for(const id of ['rain','snow','eclipse','storm','blizzard']){const a=render(id,2,false,['eclipse','storm','blizzard'].includes(id));assert.deepEqual(a,render(id,2,false,['eclipse','storm','blizzard'].includes(id)));assert.notDeepEqual(a,render(id,3,false,['eclipse','storm','blizzard'].includes(id)));assert.deepEqual(render(id,2,true),render(id,300,true),'quiet geometry is static');}
 for(const extra of [{mode:'bossrush'},{riftArena:{id:'arena'}}]){const a=context();assert.equal(drawWorldEventWeather(a.c,{mode:'survival',events:{active:{id:'eclipse',age:3}},...extra},390,844),false);assert.equal(a.ops.length,0);}
});

test('event attack visuals use persisted line and circle geometry with balanced state through every phase',()=>{
 const marks=[{shape:'circle',x:100,y:60,r:60,delay:1.2,duration:.8},{shape:'line',x:0,y:10,tx:200,ty:80,width:14,delay:1.2,duration:.8}];
 for(const [id,styles]of [['eclipsefemto',['godhand','spatialgrasp','causality']],['tempestlord',['elthor','raigo','drumthunder']],['frostregent',['iceage','partisan','whiteout']]])for(const style of styles)for(const reduced of [false,true])for(const age of [.5,1.5,2.4]){
  const a=context(),before=JSON.stringify(marks),e={archetype:id,eventOnly:true,hp:1,x:0,y:0,r:40,worldEventAttack:{style,age,x:0,y:0,marks}};
  assert.equal(drawWorldEventAttack(a.c,e,reduced),true);assert.equal(a.depth(),0);assert.equal(JSON.stringify(marks),before);assert.ok(a.ops.length<400);
 }
 assert.equal(drawWorldEventAttack({}, {hp:0,eventOnly:true,worldEventAttack:{}}),false);
});
