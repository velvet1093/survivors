import test from 'node:test';
import assert from 'node:assert/strict';
import {CHARACTERS} from '../src/game.js';
import {createRun,createBossRushRun} from '../src/engine.js';
import {configureRushLoadout} from '../src/boss-rush.js';
import {showBossRushSetup} from '../src/rush-draft-ui.js';
import {showShenronWish} from '../src/shenron-ui.js';

const hero=id=>CHARACTERS.find(c=>c.id===id);
const weaponIcons=['erza-wheel-blades','erza-blackwing-sword','erza-adamantine-shields','erza-heartkreuz-blade'];
// Capture rendered button attributes and invoke the UI's actual event handlers.
function host(){
 return {
  html:'',buttons:[],modal:{scrollTop:0},
  set innerHTML(html){
   this.html=html;
   this.buttons=[...html.matchAll(/<button\b([^>]*)>/g)].map(([,source])=>{
    const attrs=Object.fromEntries([...source.matchAll(/([\w-]+)="([^"]*)"/g)].map(([,key,value])=>[key,value]));
    return {attrs,dataset:Object.fromEntries(Object.entries(attrs).filter(([key])=>key.startsWith('data-')).map(([key,value])=>[key.slice(5).replace(/-([a-z])/g,(_,letter)=>letter.toUpperCase()),value])),disabled:/\sdisabled(?:\s|$)/.test(source),focus(){},addEventListener(event,fn){if(event==='click')this.onclick=fn;}};
   });
  },
  querySelectorAll(selector){
   return this.buttons.filter(button=>selector.split(',').some(part=>{
    if(part.startsWith('#'))return button.attrs.id===part.slice(1);
    const attribute=part.match(/^\[([\w-]+)\]/)?.[1];
    return attribute&&attribute in button.attrs&&(!part.includes(':not(:disabled)')||!button.disabled);
   }));
  },
  querySelector(selector){return selector==='.shenron-modal'?this.modal:this.querySelectorAll(selector)[0]||null;},
 };
}
const rushCallbacks={onUpdate(){},onExit(){},onBegin(){}};
function fullRush(id='erza'){
 const g=createBossRushRun(hero(id));
 assert.ok(configureRushLoadout(g,{weapons:['requip','shuriken','ki','blue','orbit'],passives:['heartkreuz','headband','senzu','eyes','magnet']}));
 return g;
}
function wishRun(id){
 const g=createRun(hero(id));
 g.p.weapons.requip=2;g.p.passives.heartkreuz=1;
 g.trinkets.wish={summoned:true,pending:true,granted:null,evolutionId:null,upgrades:[]};g.status='wish';
 return g;
}

test('Boss Rush shows each equipped and awakened Erza weapon while fusion actions retain shared canonical equipment',()=>{
 for(let form=0;form<4;form++){
  const g=fullRush(),view=host();g.mechanic.form=g.p.erzaForm=form;
  const before=structuredClone(g.p.weapons);
  showBossRushSetup(view,g,rushCallbacks);
  assert.ok(view.html.includes(`data-pixel-icon="${weaponIcons[form]}"`));
  assert.ok(view.html.includes(`data-pixel-icon="${weaponIcons[form]}-arsenal"`));
  assert.deepEqual(g.p.weapons,before);assert.equal(g.p.fusions.requip,undefined);
  const choice=view.buttons.find(button=>button.dataset.rushChoice==='heavensarsenal');assert.ok(choice);
  choice.onclick();
  assert.deepEqual(g.p.weapons,before);assert.equal(g.p.fusions.requip,'heavensarsenal');
  assert.ok(view.html.includes(`data-pixel-icon="${weaponIcons[form]}-arsenal"`));
  assert.ok(!view.html.includes(`data-pixel-icon="${weaponIcons[form]}"`));
 }
 const borrowed=fullRush('goku'),view=host();showBossRushSetup(view,borrowed,rushCallbacks);
 assert.ok(!view.html.includes('data-pixel-icon="erza-'));
 assert.ok(view.html.includes('data-rush-choice="heavensarsenal"'));
});

test('max-level Requip draft uses current armor art and still claims the one shared weapon slot',()=>{
 const g=createBossRushRun(hero('erza')),view=host();g.mechanic.form=g.p.erzaForm=2;
 delete g.p.weapons.requip;g.rush.choices=[{kind:'item',id:'requip',level:5}];
 showBossRushSetup(view,g,rushCallbacks);
 assert.ok(view.html.includes('data-pixel-icon="erza-adamantine-shields"'));
 view.buttons.find(button=>button.dataset.rushChoice==='requip').onclick();
 assert.deepEqual(g.p.weapons,{requip:5});assert.deepEqual(g.p.fusions,{});
});

test('Shenron previews awakened current armor without changing ranks and grants the canonical Requip evolution',()=>{
 for(let form=0;form<4;form++){
  const g=wishRun('erza'),view=host();g.mechanic.form=g.p.erzaForm=form;
  assert.ok(showShenronWish(view,g));
  view.buttons.find(button=>button.dataset.wish==='evolution').onclick();
  assert.ok(view.html.includes(`data-pixel-icon="${weaponIcons[form]}-arsenal"`));
  assert.equal(g.p.weapons.requip,2);assert.equal(g.p.fusions.requip,undefined);
  const choice=view.buttons.find(button=>button.dataset.wishEvolution==='heavensarsenal');assert.ok(choice);
  choice.onclick();assert.deepEqual(g.p.weapons,{requip:5});assert.equal(g.p.fusions.requip,'heavensarsenal');
  assert.equal(g.trinkets.wish.evolutionId,'heavensarsenal');assert.equal(g.status,'playing');
 }
 const borrowed=wishRun('goku'),view=host();showShenronWish(view,borrowed);
 view.buttons.find(button=>button.dataset.wish==='evolution').onclick();
 assert.ok(!view.html.includes('data-pixel-icon="erza-'));
 assert.ok(view.html.includes('data-wish-evolution="heavensarsenal"'));
});
