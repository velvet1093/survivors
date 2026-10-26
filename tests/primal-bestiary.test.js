import test from 'node:test';
import assert from 'node:assert/strict';
import {BOSSES,REGULAR_BOSS_IDS,MAP_BOSSES} from '../src/enemies.js';
import {RIFT_ENCOUNTERS} from '../src/rift-encounters.js';
import {RIFT_ARENAS} from '../src/rift-arena.js';
import {bossPhases,bossPhaseSearchText} from '../src/boss-phase-guide.js';
import {bestiary} from '../src/bestiary.js';

test('Death extends the optional rift rotation without moving existing encounters into waves or Boss Rush',()=>{
 const original=['foundereren','beerus','walpurgisrift','aizenrift','madararift','sukunaheian','borosrift','darknessdevil'];
 assert.deepEqual(RIFT_ENCOUNTERS.slice(0,8).map(e=>e.id),original);
 assert.equal(RIFT_ENCOUNTERS.length,11);assert.equal(RIFT_ENCOUNTERS[8].id,'deathdevil');
 assert.equal(BOSSES.deathdevil.family,'chainsawman');assert.equal(BOSSES.deathdevil.riftOnly,true);
 assert.equal(RIFT_ARENAS.deathdevil.id,'lastsilence');assert.equal(RIFT_ARENAS.darknessdevil.id,'primordialnight');
 assert.equal(REGULAR_BOSS_IDS.length,36);assert.ok(!REGULAR_BOSS_IDS.includes('deathdevil'));
 for(const order of Object.values(MAP_BOSSES))assert.ok(!order.includes('deathdevil'));
});

test('Death bestiary presents both HP phases and searchable dodging guidance for each new attack',()=>{
 const phases=bossPhases('deathdevil');assert.equal(phases.length,2);
 assert.equal(phases[0].name,'Death Devil');assert.match(phases[0].threshold,/100%–50%/);
 assert.equal(phases[1].name,'Death Devil · The Last Silence');assert.match(phases[1].threshold,/below 50%/);
 for(const name of ['Memento Mori','Pale Crown','Last Horizon'])assert.ok(phases.every(p=>p.description.includes(name)),name+' is explained in both phases');
 assert.match(phases[0].description,/five coffin/);assert.match(phases[0].description,/seven inward/);
 assert.match(phases[1].description,/seven coffin/);assert.match(phases[1].description,/nine bone/);assert.match(phases[1].description,/perpendicular/);
 assert.match(bossPhaseSearchText('deathdevil'),/escape/);assert.match(bossPhaseSearchText('deathdevil'),/fixed/);
 const html=bestiary({query:'The Last Silence',kind:'boss'});
 assert.match(html,/RIFT SUPERBOSS \/ Chainsaw Man/);assert.match(html,/CHECK PHASES · 2/);
 assert.match(html,/OPTIONAL RIFT ONLY/);assert.match(html,/PHASE II BELOW 50% HP/);
 assert.match(html,/Death Devil · The Last Silence/);assert.ok(!html.includes('undefined'));
});

test('the Darkness phase guide keeps its servant limits and fixed-warning encounter identity',()=>{
 const text=bossPhaseSearchText('darknessdevil');
 for(const attack of ['Severance','Primordial Night','Falling Stars'])assert.ok(text.includes(attack));
 assert.match(text,/two living Hell Hands/);assert.match(text,/three servants/);assert.match(text,/no more than six/);
 const html=bestiary({query:'Darkness Devil',kind:'boss'});
 assert.match(html,/Darkness Devil · Primordial Night/);assert.match(html,/CHECK PHASES · 2/);assert.ok(!html.includes('undefined'));
});
