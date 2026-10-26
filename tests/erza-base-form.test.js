import test from 'node:test';
import assert from 'node:assert/strict';
import {CHARACTERS} from '../src/game.js';
import {createRun,createHardcoreRun,castWeapon,spawnEnemy,updateRun} from '../src/engine.js';
import {ERZA_FORMS,erzaForm,switchErzaForm} from '../src/erza.js';
import {heroMoveBonus,heroResistance} from '../src/hero-mechanics.js';
import {characterPixels} from '../src/pixel-characters.js';
import {portrait} from '../src/portraits.js';
import {saveRun,loadRun} from '../src/run-save.js';
import {SKINS} from '../src/skins.js';
import {hasStatus} from '../src/status.js';
import {ensureWorld} from '../src/world.js';
const hero=CHARACTERS.find(c=>c.id==='erza');
function run(create=createRun){const g=create(hero,3);g.spawn=g.eliteAt=g.nextBossWave=1e9;g.p.nextXp=1e9;g.invuln=999;g.p.cooldowns.requip=999;ensureWorld(g);g.world.active=[];g.world.circles=[];return g;}
function memory(){const data=new Map();return {getItem:k=>data.get(k)||null,setItem:(k,v)=>data.set(k,v),removeItem:k=>data.delete(k)};}

test('new Erza runs start in neutral Heart Kreuz while saved armor indices remain unchanged',()=>{
 assert.deepEqual(ERZA_FORMS.map(f=>f.id),['wheel','blackwing','adamantine','base']);
 for(const create of [createRun,createHardcoreRun]){const g=run(create);assert.equal(g.mechanic.form,3);assert.equal(g.p.erzaForm,3);assert.equal(erzaForm(g).id,'base');assert.equal(heroMoveBonus(g),1);assert.equal(heroResistance(g),1);assert.equal(switchErzaForm(g),true);assert.equal(erzaForm(g).id,'wheel');}
 for(const form of [0,1,2,3]){const g=run(),store=memory();g.mechanic.form=form;g.p.erzaForm=form;g.mechanic.barrier=9;g.mechanic.switchCD=1.25;saveRun(g,store);const r=loadRun(store);assert.equal(r.mechanic.form,form);assert.equal(r.p.erzaForm,form);assert.equal(r.mechanic.barrier,9);r.status='playing';updateRun(r,.01);assert.equal(erzaForm(r).id,ERZA_FORMS[form].id);}
});

test('Heart Kreuz delivers a physical forward cleave with no special bleed, stun, shield or ranged volley',()=>{
 const g=run(),front=spawnEnemy(g,false,false,'zoomer'),back=spawnEnemy(g,false,false,'zoomer');Object.assign(front,{x:95,y:0,hp:10000,maxHp:10000,speed:0});Object.assign(back,{x:-95,y:0,hp:10000,maxHp:10000,speed:0});
 const shield=g.p.shield;assert.equal(castWeapon(g,'requip',front),true);assert.ok(front.hp<10000);assert.equal(back.hp,10000);assert.equal(g.shots.length,0);assert.equal(hasStatus(front,'bleeding'),false);assert.equal(hasStatus(front,'stun'),false);assert.equal(g.p.shield,shield);assert.ok(g.effects.some(e=>e.type==='erza-slash'&&e.form===3));assert.ok(front.kvx>0);
 assert.equal(castWeapon(g,'requip',{x:1000,y:0,r:10}),false);
});

test('Heart Kreuz has distinct silver armor, blue pleats and one sword, with matching animated and cosmetic frames',()=>{
 const base=characterPixels('erza'),explicit=characterPixels('erza',{form:3});assert.deepEqual(base,explicit);assert.ok(base.filter(Boolean).length>700);
 for(const form of [0,1,2])assert.notDeepEqual(base,characterPixels('erza',{form}));
 const blue=new Set(['#536a9b','#303d65','#879bc6']);let pleats=0;for(let y=48;y<60;y++)for(let x=18;x<39;x++)if(blue.has(base[y*56+x]))pleats++;assert.ok(pleats>75);
 assert.notDeepEqual(base,characterPixels('erza',{form:3,moving:true,frame:1}));assert.notDeepEqual(base,characterPixels('erza',{form:3,attack:true}));assert.deepEqual(portrait(hero),portrait(hero,'default',3));assert.equal(SKINS.erza[0].name,'Heart Kreuz Armor');
 for(const skin of SKINS.erza.filter(s=>s.id!=='default')){const pixels=characterPixels('erza',{skin:skin.id,form:3});assert.equal(pixels.length,56*76);assert.ok(pixels.filter(Boolean).length>500);assert.notDeepEqual(pixels,characterPixels('erza',{skin:skin.id,form:2}));}
});
