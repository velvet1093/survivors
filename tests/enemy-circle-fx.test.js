import test from 'node:test';
import assert from 'node:assert/strict';
import {circleAttackTheme,drawEnemyCircleFx} from '../src/enemy-circle-fx.js';
const context=()=>{let depth=0;const ops=[],c=new Proxy({save(){depth++;ops.push(['save']);},restore(){depth--;assert.ok(depth>=0);ops.push(['restore']);}},{get(target,key){return key in target?target[key]:(...args)=>{assert.ok(args.filter(v=>typeof v==='number').every(Number.isFinite),String(key));if(key==='arc')assert.ok(args[2]>0);ops.push([key,...args]);};},set(target,key,value){if(typeof value==='number')assert.ok(Number.isFinite(value));target[key]=value;ops.push(['set',key,value]);return true;}});return {c,ops,depth:()=>depth};};
const hazard=(label,age=.6)=>({shape:'circle',label,sourceId:1,x:80,y:100,r:50,age,delay:1,duration:.5,damage:20});
const render=(h,{reduced=false,layer='ground',enemies=[{id:1,hp:100,x:0,y:0,r:18,facing:1}]}={})=>{const a=context(),g={hazards:Array.isArray(h)?h:[h],enemies};const before=structuredClone(g),count=drawEnemyCircleFx(a.c,g,reduced,layer);assert.equal(a.depth(),0);assert.deepEqual(g,before);return {...a,count};};
const labels={blast:'CANNON FALL',fire:'MAGMA METEOR',steam:'SCALDING STEAM',ice:'ICE MINE',lightning:'ADRAMMELECH',venom:'VENOM',claw:'TITAN GRASP',curse:'SOUL BALANCE',light:'ANGEL CROSS'};

test('circle attacks select material FX from their own warning, rather than assuming every burning attack is fire',()=>{
 for(const [theme,label]of Object.entries(labels))assert.equal(circleAttackTheme({label,status:'burning'}),theme,label);
 assert.equal(circleAttackTheme({status:'frozen'}),'ice');assert.equal(circleAttackTheme({status:'bleeding'}),'claw');assert.equal(circleAttackTheme({source:'tempestlord'}),'lightning');
});

test('each warned material has a distinct active impact clipped inside the original hit circle and never mutates combat',()=>{
 const renders=[];for(const label of Object.values(labels))for(const reduced of [false,true]){
  const h=hazard(label,1.2),a=render(h,{reduced});assert.equal(a.count,1);assert.ok(a.ops.length<250);assert.deepEqual(a.ops.find(o=>o[0]==='arc').slice(1,4),[h.x,h.y,h.r*.93]);assert.ok(a.ops.some(o=>o[0]==='clip'));if(!reduced)renders.push(JSON.stringify(a.ops));
 }
 assert.equal(new Set(renders).size,Object.keys(labels).length);
});

test('charges stay linked to their living caster and a ring cluster emits only one hand cue',()=>{
 const a=render([hazard('ICE MINE',.2),hazard('ICE MINE',.7),hazard('ICE MINE',.4)],{layer:'caster'});assert.equal(a.count,1);assert.deepEqual(a.ops,render(hazard('ICE MINE',.7),{layer:'caster'}).ops);
 assert.equal(render(hazard('ICE MINE'),{layer:'caster',enemies:[]}).count,0);
 assert.equal(render(hazard('ICE MINE'),{layer:'caster',enemies:[{id:1,hp:0,x:0,y:0}]}).count,0);
 assert.equal(render(hazard('ICE MINE',1.1),{layer:'caster'}).count,0);
 assert.equal(render({...hazard('ICE MINE'),sourceId:2},{layer:'caster'}).count,0);
});

test('saved warning clocks exactly reproduce FX while reduced motion removes optional charge and impact movement',()=>{
 for(const label of Object.values(labels)){
  for(const layer of ['ground','caster'])assert.deepEqual(render(hazard(label),{layer}).ops,render(structuredClone(hazard(label)),{layer}).ops);
  assert.deepEqual(render(hazard(label,.2),{reduced:true,layer:'caster'}).ops,render(hazard(label,.8),{reduced:true,layer:'caster'}).ops);
  assert.deepEqual(render(hazard(label,1.1),{reduced:true}).ops,render(hazard(label,1.4),{reduced:true}).ops);
 }
 assert.notDeepEqual(render(hazard('CANNON FALL',1.1)).ops,render(hazard('CANNON FALL',1.4)).ops);
});

test('dedicated boss casts keep their own hand animation and receive only restrained ground accents',()=>{
 for(const flag of ['worldEventAttack','berserkAttack','riftAttack','motherBrainAttack']){
  const enemies=[{id:1,hp:10,x:0,y:0,r:40,[flag]:{age:.3}}];assert.equal(render(hazard('ICE MINE'),{layer:'caster',enemies}).count,0);
  const ground=render(hazard('ICE MINE',1.2),{enemies});assert.ok(ground.ops.some(o=>o[0]==='set'&&o[1]==='globalAlpha'&&o[2]===.3));
 }
 assert.equal(render({...hazard('ICE MINE'),bossUltimate:true},{layer:'caster'}).count,0);
});

test('decoration-only rushes, noncircular attacks, expired or malformed hazards emit no FX and work is bounded',()=>{
 for(const h of [{...hazard('RUSH'),damage:0},{...hazard('CUT'),shape:'line'},hazard('CANNON FALL',2),{...hazard('ICE MINE'),r:NaN},{...hazard('ICE MINE'),x:Infinity},{...hazard('ICE MINE'),r:0}])assert.equal(render(h).count,0);
 const a=render(Array.from({length:100},()=>hazard('CANNON FALL',1.2)));assert.equal(a.count,45);
 const c=context();assert.equal(drawEnemyCircleFx(c.c,{},false,'invalid'),0);assert.equal(c.ops.length,0);
});
