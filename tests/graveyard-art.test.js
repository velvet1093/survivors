import test from 'node:test';
import assert from 'node:assert/strict';
import {GRAVEYARD_PALETTES,graveyardEnemyPixels} from '../src/graveyard-enemy-art.js';
import {drawGraveyardAttack} from '../src/graveyard-attack-art.js';
import {GRAVEYARD_ENEMIES,GRAVEYARD_BOSSES,graveyardAttack} from '../src/graveyard-enemies.js';

const bosses=['ryuma','moriah','peronaparade','ainztomb'],count=body=>body.filter(Boolean).length;
const region=(body,x,y,w,h)=>Array.from({length:h},(_,dy)=>body.slice((y+dy)*56+x,(y+dy)*56+x+w)).flat();
function canvas(){
 const ops=[];let depth=0;
 const c=new Proxy({globalAlpha:1,save(){depth++;ops.push(['save']);},restore(){depth--;assert.ok(depth>=0);ops.push(['restore']);}},{get:(o,k)=>k in o?o[k]:(...args)=>{assert.ok(args.filter(a=>typeof a==='number').every(Number.isFinite),String(k));ops.push([k,...args]);},set:(o,k,v)=>{if(typeof v==='number')assert.ok(Number.isFinite(v),String(k));o[k]=v;ops.push(['set',k,v]);return true;}});
 return{c,ops,depth:()=>depth};
}

test('all eleven graveyard threats have distinct native outlined bodies and separate attack/moving poses',()=>{
 const bodies=new Set();
 for(const id of Object.keys(GRAVEYARD_PALETTES)){
  const idle=graveyardEnemyPixels(id),attack=graveyardEnemyPixels(id,{attack:1}),moving=graveyardEnemyPixels(id,{arm:4,leg:4,tail:4});
  assert.equal(idle.length,56*76);assert.ok(count(idle)>1200,id+' has a complete body');assert.ok(new Set(idle.filter(Boolean)).size>=6);assert.ok(idle.filter(Boolean).every(color=>/^#[0-9a-f]{6}$/i.test(color)));
  assert.deepEqual(idle,graveyardEnemyPixels(id));assert.notDeepEqual(idle,attack,id+' has a visible casting gesture');assert.notDeepEqual(idle,moving,id+' articulates its own limbs or trailing silhouette');bodies.add(JSON.stringify(idle));
 }
 assert.equal(bodies.size,11);assert.equal(graveyardEnemyPixels('other'),null);
});

test('Ryuma, Moriah, Perona and Ainz retain their signature props and gain distinct phase-two silhouettes',()=>{
 for(const id of bosses){const idle=graveyardEnemyPixels(id),released=graveyardEnemyPixels(id,{enraged:1});assert.notDeepEqual(idle,released);assert.notDeepEqual(released,graveyardEnemyPixels(id,{enraged:1,attack:1}));assert.ok(count(released)>=count(idle));}
 assert.ok(region(graveyardEnemyPixels('ryuma'),38,7,17,50).includes('#e8e9d6'),'Ryuma carries a separately shaded katana');
 assert.ok(region(graveyardEnemyPixels('moriah'),10,0,38,20).includes('#baad96'),'Moriah has broad ivory horns');
 assert.ok(region(graveyardEnemyPixels('peronaparade'),28,8,28,32).includes('#c87b99'),'Perona has a ribbed red/black umbrella');
 assert.ok(region(graveyardEnemyPixels('ainztomb'),0,0,18,73).includes('#eed6a0'),'Ainz carries an ornate gold staff');
 assert.ok(count(region(graveyardEnemyPixels('peronaparade',{enraged:1}),0,25,13,43))>100,'a giant Hollow expands behind Perona');
});

test('every real graveyard cast draws fixed bounded scenery from its saved marks in normal and quiet modes',()=>{
 for(const [id,def]of Object.entries({...GRAVEYARD_ENEMIES,...GRAVEYARD_BOSSES}))for(const enraged of[false,true])for(const skill of[0,1,2]){
  const e={...def,archetype:id,id:3,x:-130,y:-100,hp:100,skill,enraged,attackCD:0};graveyardAttack({lastMove:{x:1,y:0}},e,{x:0,y:0},.7,{hazard(){},fan(){}});
  for(const quiet of[false,true])for(const age of[0,Math.min(1.3,e.graveyardAttack.duration-.1),e.graveyardAttack.duration-.1]){
   e.graveyardAttack.age=age;const before=structuredClone(e),a=canvas(),b=canvas();assert.equal(drawGraveyardAttack(a.c,e,quiet),true);assert.equal(a.depth(),0);assert.ok(a.ops.length<2200);assert.deepEqual(e,before);assert.ok(a.ops.some(([method])=>method==='fill'||method==='stroke'));
   drawGraveyardAttack(b.c,structuredClone(e),quiet);assert.deepEqual(a.ops,b.ops,'the saved clock determines every visual');assert.ok(!a.ops.some(([method])=>method==='fillRect'||method==='clearRect'),'scenes do not cover the battlefield');
  }
 }
});

test('event scenery reads actual world-event marks and rejects inactive or malformed attacks safely',()=>{
 for(const id of['peronaparade','ainztomb']){
  const e={archetype:id,hp:100,x:-100,y:-100,r:40,worldEventAttack:{age:1.4,duration:3,x:-100,y:-100,marks:[{shape:'circle',x:10,y:0,r:90,delay:1.3,duration:.5},{shape:'line',x:-220,y:-100,tx:200,ty:50,width:20,delay:1.6,duration:.4}]}},before=structuredClone(e),a=canvas();assert.ok(drawGraveyardAttack(a.c,e,true));assert.deepEqual(e,before);assert.equal(a.ops.filter(([method])=>method==='clip').length,1,'line scenery is clipped to the real warning lane');
 }
 for(const e of[{},{archetype:'other',hp:1},{archetype:'ryuma',hp:0,graveyardAttack:{age:0,duration:3}},{archetype:'moriah',hp:1,graveyardAttack:{age:NaN,duration:3}},{archetype:'ryuma',hp:1,graveyardAttack:{age:3,duration:3}}]){const a=canvas();assert.equal(drawGraveyardAttack(a.c,e),false);assert.equal(a.ops.length,0);}
});
