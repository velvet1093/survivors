import test from 'node:test';import assert from 'node:assert/strict';
import {DIFFICULTIES,difficultyFor,enemyPressure,strengthenEnemy,encounterPressure} from '../src/difficulty.js';
import {CHARACTERS} from '../src/game.js';import {createRun,createBossRushRun,updateRun} from '../src/engine.js';import {makeEnemy,updateEnemyAI,BOSSES} from '../src/enemies.js';
import {getRushDraftChoices,chooseRushDraft,beginBossRush} from '../src/boss-rush.js';import {ensureWorld} from '../src/world.js';import {saveRun,loadRun} from '../src/run-save.js';import {finishBossIntro} from '../src/boss-intro.js';
const memory=()=>({data:null,setItem(k,v){this.data=v},getItem(){return this.data}}),close=(a,b)=>assert.ok(Math.abs(a-b)<1e-7,`${a} != ${b}`);
function run(id='normal',rush=false){const g=(rush?createBossRushRun:createRun)(CHARACTERS[0],0,{selection:{difficulty:id}});g.spawn=g.eliteAt=g.nextBossWave=1e6;g.p.cooldowns.ki=999;g.invuln=999;ensureWorld(g);for(const o of g.world.objects.values())o.hp=0;g.world.active=[];g.world.circles=[];return g;}

test('four difficulty presets use normal as fallback and retain normal survival pressure exactly',()=>{
 assert.deepEqual(DIFFICULTIES.map(d=>d.id),['easy','normal','hard','nightmare']);assert.equal(difficultyFor('missing').id,'normal');assert.deepEqual(enemyPressure(0),{minute:0,hp:1,damage:1,speed:1,attackRate:1,projectileSpeed:1});for(const d of DIFFICULTIES){const p=enemyPressure(0,d.id);for(const key of ['hp','damage','speed','attackRate','projectileSpeed'])close(p[key],d[key]);assert.ok(enemyPressure(300,d.id).hp>p.hp);assert.equal(run(d.id).difficulty,d.id);}assert.equal(run('invalid').difficulty,'normal');
});
test('difficulty changes actual enemy HP, movement, contact strength and opening attack clocks',()=>{
 const values=DIFFICULTIES.map(d=>{const g=run(d.id),e=makeEnemy(g,'frieza',true);return {d,e};}),normal=values[1].e;for(const {d,e}of values){close(e.maxHp/normal.maxHp,d.hp);close(e.speed/normal.speed,d.speed);close(e.damageScale/normal.damageScale,d.damage);close(normal.attackCD/e.attackCD,d.attackRate);}for(let i=1;i<values.length;i++){assert.ok(values[i].e.maxHp>values[i-1].e.maxHp);assert.ok(values[i].e.damageScale>values[i-1].e.damageScale);}
});
test('projectiles and telegraphed hazards apply difficulty damage and speed once',()=>{
 for(const d of DIFFICULTIES){const g=run(d.id),e=makeEnemy(g,'frieza',true);Object.assign(e,{x:220,y:0,speed:0,attackCD:0,ultimateCD:999});g.enemies=[e];updateEnemyAI(g,e,.01);assert.equal(g.hazards[0].label,'DEATH BEAM');close(g.hazards[0].damage,25*d.damage);close(e.attackCD,3.4/d.attackRate);e.attackCD=0;updateEnemyAI(g,e,.01);assert.ok(g.enemyShots.length);close(g.enemyShots[0].damage,10*d.damage);close(Math.hypot(g.enemyShots[0].vx,g.enemyShots[0].vy),155*d.projectileSpeed);}
});
test('minute strengthening and checkpoints preserve damage fractions without multiplying difficulty again',()=>{
 for(const d of DIFFICULTIES){const g=run(d.id),e=makeEnemy(g,'soldier');e.hp=e.maxHp*.5;g.enemies=[e];const max=e.maxHp;g.time=60;strengthenEnemy(e,60,d.id);close(e.maxHp,max*enemyPressure(60).hp);close(e.hp/e.maxHp,.5);const hp=e.hp,speed=e.speed;strengthenEnemy(e,61,d.id);close(e.hp,hp);close(e.speed,speed);const store=memory();saveRun(g,store);const r=loadRun(store);assert.equal(r.difficulty,d.id);strengthenEnemy(r.enemies[0],61,r.difficulty);close(r.enemies[0].hp,hp);close(r.enemies[0].speed,speed);close(r.enemies[0].damageScale,enemyPressure(60,d.id).damage);}
});
test('selected difficulty affects survival spawn cadence',()=>{
 for(const d of DIFFICULTIES){const g=run(d.id);g.spawn=0;g.time=10;updateRun(g,.02);close(g.spawn,Math.max(.3,1.1-g.time*.002)/d.spawnRate);assert.ok(g.enemies.length>=2);}
});
test('Boss Rush adds its tougher round pressure once on top of the chosen preset',()=>{
 for(const d of DIFFICULTIES){const g=run(d.id,true);while(g.status==='rush-draft')chooseRushDraft(g,getRushDraftChoices(g)[0].id);assert.ok(beginBossRush(g));updateRun(g,.02);finishBossIntro(g);const e=g.enemies[0],first=e.maxHp;close(first,BOSSES[e.archetype].hp*5*d.hp);close(e.damageScale,d.damage*1.25);close(encounterPressure(g).attackRate,d.attackRate*1.15);const hp=e.hp,speed=e.speed;strengthenEnemy(e,g.time,d.id,1);close(e.hp,hp);close(e.speed,speed);const store=memory();saveRun(g,store);const loaded=loadRun(store);strengthenEnemy(loaded.enemies[0],loaded.time,loaded.difficulty,1);close(loaded.enemies[0].maxHp,first);g.rush.round=10;assert.ok(encounterPressure(g).damage>d.damage*1.25);assert.ok(encounterPressure(g).attackRate>d.attackRate*1.15);}
});
test('older checkpoints without a difficulty selection retain normal and strengthen stably',()=>{
 const g=run(),e=makeEnemy(g,'soldier');g.enemies=[e];delete g.difficulty;delete e.pressureDifficulty;delete e.pressureRushRound;const store=memory();saveRun(g,store);const restored=loadRun(store);assert.equal(restored.difficulty,'normal');const hp=restored.enemies[0].hp;strengthenEnemy(restored.enemies[0],0,restored.difficulty);close(restored.enemies[0].hp,hp);
});
