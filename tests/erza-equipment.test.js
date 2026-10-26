import test from 'node:test';
import assert from 'node:assert/strict';
import {CHARACTERS,applyChoice} from '../src/game.js';
import {createRun,createHardcoreRun} from '../src/engine.js';
import {switchErzaForm} from '../src/erza.js';
import {erzaWeaponAppearance} from '../src/erza-equipment.js';
import {icon} from '../src/icons.js';
import {saveRun,loadRun} from '../src/run-save.js';
const erza=CHARACTERS.find(c=>c.id==='erza');
function memory(){const data=new Map();return{getItem:k=>data.get(k)??null,setItem:(k,v)=>data.set(k,v),removeItem:k=>data.delete(k)};}
const expected=['erza-wheel-blades','erza-blackwing-sword','erza-adamantine-shields','erza-heartkreuz-blade'];

test('Erza changing armor updates current and next weapon art without changing shared ranks or saved equipment',()=>{
 for(const create of [createRun,createHardcoreRun]){
  const g=create(erza),store=memory();g.p.weapons.requip=3;g.p.passives.heartkreuz=2;
  for(const form of [3,0,1,2]){
   g.mechanic.switchCD=0;if(g.mechanic.form!==form)assert.ok(switchErzaForm(g,form));
   const look=erzaWeaponAppearance(g),next=erzaWeaponAppearance(g,{next:true});assert.equal(look.icon,expected[form]);assert.equal(next.icon,expected[(form+1)%4]);assert.ok(icon(look.icon).includes(`data-pixel-icon="${look.icon}"`));
   const before=structuredClone(g.p.weapons);assert.ok(saveRun(g,store));const restored=loadRun(store);assert.equal(erzaWeaponAppearance(restored).icon,look.icon);assert.deepEqual(restored.p.weapons,before);assert.equal(restored.p.passives.heartkreuz,2);
  }
 }
 const goku=createRun(CHARACTERS.find(c=>c.id==='goku'));goku.p.weapons.requip=3;assert.equal(erzaWeaponAppearance(goku),null);
});

test('Heaven’s Arsenal keeps four distinct awakened form icons while remaining one evolved Requip slot',()=>{
 const g=createRun(erza);g.p.weapons.requip=5;g.p.passives.heartkreuz=3;
 assert.equal(erzaWeaponAppearance(g,{fused:true}).icon,'erza-heartkreuz-blade-arsenal');assert.equal(g.p.fusions.requip,undefined);
 assert.ok(applyChoice(g.p,{kind:'fusion',id:'heavensarsenal'}));const seen=new Set();
 for(const form of [3,0,1,2]){g.mechanic.switchCD=0;if(g.mechanic.form!==form)assert.ok(switchErzaForm(g,form));const look=erzaWeaponAppearance(g);seen.add(look.icon);assert.equal(look.icon,expected[form]+'-arsenal');assert.equal(g.p.fusions.requip,'heavensarsenal');assert.deepEqual(g.p.weapons,{requip:5});assert.ok(look.description.includes('All armor forms share'));}
 assert.equal(seen.size,4);
});
