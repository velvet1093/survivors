import test from 'node:test';
import assert from 'node:assert/strict';
import {CHARACTERS} from '../src/game.js';
import {createRun,spawnEnemy,updateRun} from '../src/engine.js';
import {updateEnemyAI} from '../src/enemies.js';
import {hasStatus} from '../src/status.js';
import {PLAYER_RADIUS} from '../src/world.js';
import {drawBossUltimate} from '../src/boss-ultimate-art.js';

function run(){
 const g=createRun(CHARACTERS[0],0);g.spawn=g.eliteAt=g.nextBossWave=1e6;
 Object.assign(g.p,{weapons:{},dodge:0,regen:0,shield:0,nextXp:1e6});return g;
}
function activate(g,id,enraged=false){
 const e=spawnEnemy(g,true,false,id);Object.assign(e,{x:220,y:0,speed:0,attackCD:999,ultimateCD:0,enraged});
 updateEnemyAI(g,e,.01);return e;
}
function trigger(g,h,x=h.x,y=h.y){
 g.hazards=[h];h.age=h.delay-.01;g.p.x=x;g.p.y=y;g.invuln=0;updateRun(g,.02);
}

test('Tsukuyomi illusions inflict slow and curse, leave a real escape corridor, and are never enemy entities',()=>{
 const g=run();g.lastMove={x:1,y:0};const e=activate(g,'itachi'),u=e.bossUltimate,seals=g.hazards.filter(h=>h.status==='slow'),eye=g.hazards.find(h=>h.status==='cursed'),all=[...g.hazards],hp=g.p.hp;
 assert.equal(seals.length,9);assert.equal(g.enemies.length,1);assert.ok(seals.every(h=>Math.hypot(h.x-u.x,h.y-u.y)+h.r<170));
 trigger(g,seals[0]);assert.ok(g.p.hp<hp);assert.ok(hasStatus(g.p,'slow'));
 trigger(g,eye);assert.ok(hasStatus(g.p,'cursed'));
 g.p.statuses={};g.hazards=all;for(const h of all)h.age=h.delay-.01;
 g.p.x=u.x+Math.cos(u.gapAngle)*u.radius;g.p.y=u.y+Math.sin(u.gapAngle)*u.radius;g.invuln=0;const escapedHp=g.p.hp;
 updateRun(g,.02);assert.equal(g.p.hp,escapedHp);assert.deepEqual(g.p.statuses,{});assert.equal(g.enemies.length,1);
});

test('Ulquiorra charges a fixed, narrow green Cero that can be sidestepped and burns on impact',()=>{
 const g=run(),e=activate(g,'ulquiorra'),h=g.hazards[0],locked={x:h.x,y:h.y,tx:h.tx,ty:h.ty};
 assert.equal(g.hazards.length,1);assert.equal(h.width,12);assert.equal(h.color,'#9deeb5');assert.equal(h.delay,2.4);
 const x=(h.x+h.tx)/2,y=(h.y+h.ty)/2;g.p.x=x;g.p.y=y+90;updateRun(g,.05);
 assert.deepEqual({x:h.x,y:h.y,tx:h.tx,ty:h.ty},locked);
 const hp=g.p.hp;trigger(g,h,x,y+h.width+PLAYER_RADIUS+5);assert.equal(g.p.hp,hp);
 trigger(g,h,x,y);assert.ok(g.p.hp<hp);assert.ok(hasStatus(g.p,'burning'));
 const phase=run(),released=activate(phase,'ulquiorra',true);assert.equal(released.bossUltimate.ceros.length,3);
 assert.equal(phase.hazards.filter(mark=>mark.delay>2.4).length,2);assert.ok(phase.hazards.every(mark=>mark.delay>=2.4&&mark.width<=12));
});

test('DIO releases the two knife directions one second apart before the final Road Roller',()=>{
 const g=run(),e=activate(g,'dio'),lanes=g.hazards.filter(h=>h.shape==='line'),first=lanes.filter(h=>h.wave===0),second=lanes.filter(h=>h.wave===1),roller=g.hazards.find(h=>h.status==='stun');
 assert.equal(first.length,3);assert.equal(second.length,3);assert.equal(second[0].delay-first[0].delay,1);assert.ok(roller.delay>second[0].delay+second[0].duration);
 const va={x:first[0].tx-first[0].x,y:first[0].ty-first[0].y},vb={x:second[0].tx-second[0].x,y:second[0].ty-second[0].y};assert.ok(Math.abs(va.x*vb.x+va.y*vb.y)<1e-6);
 const h=second[1],x=(h.x+h.tx)/2,y=(h.y+h.ty)/2,hp=g.p.hp;g.hazards=[h];h.age=first[0].delay+.02;g.p.x=x;g.p.y=y;g.invuln=0;updateRun(g,.02);assert.equal(g.p.hp,hp);
 trigger(g,h,x,y);assert.ok(g.p.hp<hp);assert.ok(hasStatus(g.p,'bleeding'));assert.equal(e.bossUltimate.name,'THE WORLD · KNIFE HOUR');
});

test('Kraid spike rows alternate wide safe openings and warn every row before damage',()=>{
 const g=run(),e=activate(g,'kraid'),rows=e.bossUltimate.spikeRows,all=[...g.hazards];assert.equal(rows.length,3);assert.deepEqual(rows.map(r=>Math.sign(r.gap)),[-1,1,-1]);
 for(const row of rows){
  const sides=all.filter(h=>h.shape==='line'&&h.delay===row.delay);assert.equal(sides.length,2);assert.ok(row.delay>=2.2);
  const x=row.x+Math.cos(row.angle)*row.gap,y=row.y+Math.sin(row.angle)*row.gap,hp=g.p.hp;g.hazards=sides;for(const h of sides)h.age=h.delay-.01;g.p.x=x;g.p.y=y;g.invuln=0;updateRun(g,.02);assert.equal(g.p.hp,hp);
 }
});

for(const id of ['itachi','ulquiorra','dio','kraid'])test(id+' signature works in Boss Rush without spawning regular enemies and renders in both motion modes',()=>{
 const g=run();g.mode='bossrush';g.rush={stage:'combat',round:1,activeBossId:null};const e=activate(g,id);g.rush.activeBossId=e.id;
 // A canvas proxy checks every drawing branch without creating browser globals.
 const commands=[],context=new Proxy({},{get:(_,key)=>(...args)=>{commands.push([key,...args]);},set:()=>true});
 for(const reduced of [false,true])for(const age of [.5,2.5,3.3,4.1]){e.bossUltimate.age=age;drawBossUltimate(context,e,reduced);}
 assert.ok(commands.some(([command])=>command==='fillText'));assert.ok(commands.flat().filter(x=>typeof x==='number').every(Number.isFinite));
 e.bossUltimate.age=0;g.p.x=1500;g.p.y=1500;for(let i=0;i<100;i++)updateRun(g,.05);
 assert.equal(g.enemies.length,1);assert.ok(g.enemies.every(enemy=>enemy.boss));assert.ok(g.hazards.every(h=>h.cancelWithSource&&h.sourceId===e.id));
});
