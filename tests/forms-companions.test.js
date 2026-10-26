import test from 'node:test';import assert from 'node:assert/strict';
import {CHARACTERS,FUSIONS,ITEMS,createPlayer,applyChoice,getUpgradePool,getChoices,fusionReady,fusionIngredients,fusionRequirement,refreshStats} from '../src/game.js';
import {createRun,spawnEnemy,castWeapon,updateRun,useSpecial,hitPlayer} from '../src/engine.js';
import {newProfile,sanitizeProfile,creditRun} from '../src/progression.js';
import {saveRun,loadRun} from '../src/run-save.js';
import {companionLeash,nearbyCompanionTargets} from '../src/companion-ai.js';
import {CANNON_STAGES,cannonStage,cannonAppearance} from '../src/samus-cannon.js';
import {icon} from '../src/icons.js';
import {summonPixels} from '../src/summon-art.js';
import {characterPixels} from '../src/pixel-characters.js';
import {ensureWorld} from '../src/world.js';
import {hasStatus} from '../src/status.js';
import {heroResistance,heroMoveBonus} from '../src/hero-mechanics.js';
const hero=id=>CHARACTERS.find(c=>c.id===id),memory=()=>({data:new Map(),getItem(k){return this.data.get(k)},setItem(k,v){this.data.set(k,v)},removeItem(k){this.data.delete(k)}});
function quiet(id='eren',profile){const g=createRun(hero(id),3,profile);g.spawn=g.eliteAt=g.nextBossWave=1e6;g.p.nextXp=1e6;g.p.regen=g.p.dodge=0;for(const id of Object.keys(g.p.weapons))g.p.cooldowns[id]=999;ensureWorld(g);return g;}
function target(g,x=110,y=0){const e=spawnEnemy(g,false,false,'zoomer');Object.assign(e,{x,y,hp:10000,maxHp:10000,speed:0,attackCD:9999});return e;}
function sim(g,t,input={x:0,y:0}){for(let i=0;i<Math.round(t/.02);i++)updateRun(g,.02,input);}

test('Eren starts human with ODM Blades, Key of Freedom and shared form weapon ranks',()=>{
 const p=createPlayer(hero('eren'));assert.equal(p.erenForm,'human');assert.equal(p.form,0);assert.equal(p.weapon,'odmblades');assert.deepEqual(p.weapons,{odmblades:1});assert.deepEqual(p.formWeapons,{odmblades:1,titanfists:1});assert.deepEqual(p.passives,{freedom:1});assert.ok(getUpgradePool(p).some(c=>c.id==='odmblades'));assert.ok(!getUpgradePool(p).some(c=>c.id==='titanfists'));assert.ok(!getUpgradePool(createPlayer(hero('goku'))).some(c=>c.id==='titanfists'));
});
test('ultimate permanently changes form and the active signature, then the next ultimate switches back',()=>{
 const g=quiet();assert.ok(useSpecial(g));assert.equal(g.p.erenForm,'titan');assert.equal(g.p.form,1);assert.equal(g.p.weapon,'titanfists');assert.deepEqual(g.p.weapons,{titanfists:1});g.p.cooldowns.titanfists=999;sim(g,2);assert.equal(g.ultimate,null);assert.equal(g.p.erenForm,'titan');assert.equal(g.p.pose,'');assert.equal(useSpecial(g),false);g.special=0;assert.ok(useSpecial(g));assert.equal(g.p.erenForm,'human');assert.equal(g.p.weapon,'odmblades');sim(g,2);assert.equal(g.p.erenForm,'human');
});
test('switching forms preserves rank, fusion, other equipment, cooldown rules and a full five-slot inventory',()=>{
 const g=quiet();g.p.weapons={odmblades:5,ki:2,blue:2,orbit:1,kunai:1};g.p.passives.freedom=3;assert.ok(applyChoice(g.p,{kind:'fusion',id:'scoutassault'}));useSpecial(g);assert.equal(Object.keys(g.p.weapons).length,5);assert.equal(g.p.weapons.titanfists,5);assert.equal(g.p.fusions.titanfists,'titanquake');assert.equal(g.p.weapons.ki,2);assert.equal(g.p.weapons.odmblades,undefined);assert.equal(applyChoice(g.p,{kind:'item',id:'odmblades'}),false);assert.equal(applyChoice(g.p,{kind:'item',id:'titanfists'}),false);assert.equal(g.p.formWeapons.titanfists,5);sim(g,1.2);g.special=0;useSpecial(g);assert.equal(g.p.weapons.odmblades,5);assert.equal(g.p.fusions.odmblades,'scoutassault');sim(g,1.2);g.special=0;useSpecial(g);assert.equal(g.p.weapons.titanfists,5);
});
test('Eren evolution requires the active weapon and passive, then unlocks both forms',()=>{
 const g=quiet();g.p.weapons.odmblades=5;g.p.passives.freedom=3;assert.equal(applyChoice(g.p,{kind:'fusion',id:'titanquake'}),false);assert.ok(applyChoice(g.p,{kind:'fusion',id:'scoutassault'}));useSpecial(g);g.p.weapons.titanfists=5;assert.equal(applyChoice(g.p,{kind:'fusion',id:'titanquake'}),false);assert.equal(g.p.fusions.odmblades,'scoutassault');assert.equal(g.p.fusions.titanfists,'titanquake');
});
test('human blades bleed nearby targets without hitting distant or rear targets; Titan punches stun and knock back',()=>{
 const g=quiet(),front=target(g),rear=target(g,-110),far=target(g,350);castWeapon(g,'odmblades',front);assert.ok(front.hp<10000);assert.equal(rear.hp,10000);assert.equal(far.hp,10000);assert.ok(hasStatus(front,'bleeding'));assert.ok(g.effects.some(f=>f.type==='odm-slash'));useSpecial(g);front.hp=10000;castWeapon(g,'titanfists',front);assert.ok(front.hp<10000);assert.ok(hasStatus(front,'stun'));assert.ok(Math.abs(front.kvx)+Math.abs(front.kvy)>0);assert.equal(far.hp,10000);assert.ok(g.effects.some(f=>f.type==='titan-impact'));
});
test('Titan transformation pulses exactly once, with no automatic reversion or repeated transformation damage',()=>{
 const g=quiet(),e=target(g);useSpecial(g);g.p.cooldowns.titanfists=999;sim(g,.02);const hp=e.hp;assert.ok(hp<10000);sim(g,.6);assert.equal(e.hp,hp);sim(g,2);assert.equal(g.p.form,1);assert.equal(e.hp,hp);
});
test('Titan resistance and human speed work in combat without healing from form switching',()=>{
 const g=quiet();assert.equal(heroMoveBonus(g),1.1);g.p.hp=60;useSpecial(g);assert.equal(g.p.hp,60);assert.equal(heroMoveBonus(g),1);assert.equal(heroResistance(g),.65);g.invuln=0;hitPlayer(g,20);assert.equal(g.p.hp,60);assert.equal(g.p.shield,32);g.p.regen=0;sim(g,1.2);g.special=0;useSpecial(g);assert.equal(g.p.hp,60);assert.equal(heroResistance(g),1);
});
test('Eren mastery starts both signatures at level two and improves transformation, resistance and real weapon damage',()=>{
 const p=newProfile();p.characters.eren.skills={blades:1,heir:1,armor:1,roar:1};const g=quiet('eren',p),base=quiet();assert.deepEqual(g.p.formWeapons,{odmblades:2,titanfists:2});const e=target(g),b=target(base);castWeapon(g,'odmblades',e);castWeapon(base,'odmblades',b);assert.ok(e.hp<b.hp);useSpecial(g);assert.equal(g.p.weapons.titanfists,2);assert.ok(Math.abs(heroResistance(g)-.6)<1e-8);
});
test('Eren Titan checkpoint restores form, weapon banks, inactive fusions and frozen cooldowns',()=>{
 const g=quiet(),s=memory();g.p.weapons.odmblades=4;useSpecial(g);g.p.weapons.titanfists=3;g.p.formWeapons.titanfists=3;g.p.cooldowns.titanfists=999;sim(g,1.2);saveRun(g,s);const r=loadRun(s);assert.equal(r.status,'paused');assert.equal(r.p.erenForm,'titan');assert.equal(r.p.form,1);assert.equal(r.p.weapon,'titanfists');assert.equal(r.p.weapons.titanfists,4);assert.equal(r.p.formWeapons.odmblades,4);const special=r.special;updateRun(r,5);assert.equal(r.special,special);r.status='playing';r.special=0;useSpecial(r);assert.equal(r.p.weapons.odmblades,4);
});
test('old profiles gain Eren mastery without losing currency or other characters',()=>{
 const p=sanitizeProfile({coins:40,characters:{megumi:{xp:30,skills:{dogs:2}}}});assert.equal(p.coins,40);assert.equal(p.characters.megumi.xp,30);assert.equal(p.characters.megumi.skills.dogs,2);assert.equal(p.characters.eren.xp,0);const g=quiet();g.characterXp=18;creditRun(p,g);assert.equal(p.characters.eren.xp,18);assert.equal(p.characters.megumi.xp,30);
});
test('Eren human/Titan art and cloak are distinct, animate, and include held blades or Titan fists',()=>{
 const human=characterPixels('eren'),titan=characterPixels('eren',{form:1});assert.notDeepEqual(human,titan);assert.notDeepEqual(human,characterPixels('eren',{skin:'cloak'}));for(const form of [0,1]){const a=characterPixels('eren',{form}),b=characterPixels('eren',{form,moving:true,frame:1}),c=characterPixels('eren',{form,attack:true});assert.notDeepEqual(a,b);assert.notDeepEqual(a,c);assert.ok(a.filter(Boolean).length>700);}
});
test('Megumi starts with two summon weapons and Nue upgrades independently from the dogs',()=>{
 const g=quiet('megumi'),e=target(g);assert.deepEqual(g.p.weapons,{shadows:1,nue:1});castWeapon(g,'shadows',e);assert.deepEqual(g.summons.map(s=>s.kind),['whiteDog','blackDog']);assert.ok(applyChoice(g.p,{kind:'item',id:'nue'}));assert.equal(g.p.weapons.nue,2);assert.equal(g.p.weapons.shadows,1);castWeapon(g,'nue',e);assert.equal(g.summons.length,3);const life=g.summons.find(s=>s.kind==='nue').life;castWeapon(g,'shadows',e);assert.equal(g.summons.find(s=>s.kind==='nue').life,life);assert.ok(g.summons.find(s=>s.kind==='nue').rank===2);
});
test('Nue has its own shared-pool fusion and can stun multiple nearby enemies independently',()=>{
 const g=quiet('megumi'),a=target(g,90),b=target(g,100,25);g.p.weapons.nue=5;g.p.passives.talisman=3;assert.ok(applyChoice(g.p,{kind:'fusion',id:'stormnue'}));castWeapon(g,'nue',a);sim(g,.4);assert.ok(a.hp<10000&&b.hp<10000);assert.ok(hasStatus(a,'stun'));assert.equal(g.p.fusions.shadows,undefined);assert.ok(getUpgradePool(createPlayer(hero('goku'))).some(c=>c.id==='nue'));
});
test('legacy Megumi checkpoints gain Nue only when a slot is available, preserving existing equipment',()=>{
 const g=quiet('megumi'),s=memory();delete g.p.weapons.nue;saveRun(g,s);assert.equal(loadRun(s).p.weapons.nue,1);g.p.weapons={shadows:4,ki:1,orbit:1,blue:2,kunai:1};saveRun(g,s);const r=loadRun(s);assert.deepEqual(r.p.weapons,g.p.weapons);
});
test('all shikigami ignore distant targets and recall immediately from old offscreen positions',()=>{
 const g=quiet('megumi'),far=target(g,1000);castWeapon(g,'shadows',far);castWeapon(g,'nue',far);useSpecial(g);g.p.cooldowns.shadows=g.p.cooldowns.nue=999;for(const s of g.summons){s.x=1500;s.y=900;}sim(g,.2);assert.equal(far.hp,10000);for(const s of g.summons)assert.ok(Math.hypot(s.x-g.p.x,s.y-g.p.y)<=companionLeash(g));assert.equal(nearbyCompanionTargets(g).length,0);
});
test('summons attack only nearby enemies and return toward their owner when a target leaves range',()=>{
 const g=quiet('megumi'),e=target(g,110);for(const o of g.world.active)if(Number.isFinite(o.hp))g.world.destroyed.add(o.id);castWeapon(g,'shadows',e);sim(g,.6);assert.ok(e.hp<10000);e.x=1000;e.y=0;e.statuses={};const hp=e.hp;sim(g,1.1);assert.equal(e.hp,hp);assert.ok(g.summons.every(s=>Math.hypot(s.x-g.p.x,s.y-g.p.y)<companionLeash(g)*.7));
});
test('camera-aware companion leashes keep dogs, Nue and Mahoraga within the viewport while moving and zooming',()=>{
 for(const [w,h,zoom]of [[1440,900,.9],[390,844,.9],[320,568,1.65],[844,390,1.65]]){const g=quiet('megumi');g.view={w,h};g.zoom=g.targetZoom=zoom;const far=target(g,900);castWeapon(g,'shadows',far);castWeapon(g,'nue',far);useSpecial(g);for(let i=0;i<20;i++){g.p.x+=30;g.p.y-=5;updateRun(g,.02);for(const s of g.summons){const d=Math.hypot(s.x-g.p.x,s.y-g.p.y);assert.ok(d<=companionLeash(g)+.001);assert.ok(Math.abs(s.x-g.p.x)*zoom+45*zoom<w/2);}}assert.equal(far.hp,10000);}
});
test('Naruto clones and Kurumi shadow summons also remain close and ignore offscreen enemies',()=>{
 for(const id of ['naruto','kurumi']){const g=quiet(id),e=target(g,900);g.view={w:390,h:844};g.zoom=g.targetZoom=1.65;g.p.weapons={};useSpecial(g);sim(g,.3);g.p.x+=400;sim(g,.04);const units=id==='naruto'?g.cloneUnits:g.ultimate.shadows;assert.ok(units.length>=3);assert.ok(new Set(units.map(s=>s.x.toFixed(2)+':'+s.y.toFixed(2))).size>=3);for(const s of units)assert.ok(Math.hypot(s.x-g.p.x,s.y-g.p.y)<=companionLeash(g)+.001);assert.equal(e.hp,10000);assert.equal(g.shots.length,0);}
});
test('summon positioning and lifetimes freeze on pause and persist in a checkpoint',()=>{
 const g=quiet('megumi'),e=target(g,80),s=memory();castWeapon(g,'nue',e);castWeapon(g,'shadows',e);sim(g,.1);g.status='paused';const before=JSON.stringify(g.summons);updateRun(g,10);assert.equal(JSON.stringify(g.summons),before);saveRun(g,s);const r=loadRun(s);assert.equal(JSON.stringify(r.summons),before);
});
test('Samus evolves exactly at 100-kill intervals and every stage has a unique illustrated icon',()=>{
 assert.deepEqual(CANNON_STAGES.map(s=>s.kills),[0,100,200,300]);const arts=[];for(const [kills,stage]of [[0,0],[99,0],[100,1],[199,1],[200,2],[299,2],[300,3],[900,3]]){const g=quiet('samus');g.kills=kills;assert.equal(cannonStage(g),stage);assert.equal(cannonAppearance(g).name,CANNON_STAGES[stage].name);}for(const stage of CANNON_STAGES)arts.push(icon(stage.icon));assert.equal(new Set(arts).size,4);assert.ok(arts.every(a=>a.includes('fill="#')));
});
test('Fusion Suit uses its own cyan/gold/magenta shapes, fins and Morph Ball pose while keeping gameplay stats',()=>{
 const art=characterPixels('samus',{skin:'fusion'}),colors=new Set(art.filter(Boolean));for(const color of ['#3b9cbd','#d5b94d','#c34b83','#4c8064'])assert.ok(colors.has(color),color);assert.notDeepEqual(art,characterPixels('samus'));assert.notDeepEqual(art,characterPixels('samus',{skin:'fusion',attack:true}));assert.notDeepEqual(art,characterPixels('samus',{skin:'fusion',pose:'bomb'}));const p=newProfile();p.skins.samus='fusion';const a=quiet('samus'),b=quiet('samus',p);for(const k of ['damage','maxHp','move','cooldown'])assert.equal(a.p[k],b.p[k]);
});
test('Hollow Purple requires Blue 5 + Red 5 + Six Eyes 3 and preserves the passive after consuming Red',()=>{
 const p=createPlayer(hero('gojo')),f=FUSIONS.find(f=>f.id==='purple');assert.deepEqual(fusionIngredients(f),['blue','red','eyes']);assert.equal(fusionRequirement(f),'Cursed Blue LV 5 + Reversal Red LV 5 + Six Eyes LV 3');p.weapons.blue=p.weapons.red=5;p.passives.eyes=2;assert.equal(fusionReady(p,f),false);assert.equal(applyChoice(p,{kind:'fusion',id:'purple'}),false);p.passives.eyes=3;assert.ok(fusionReady(p,f));assert.equal(getChoices(p)[0].id,'purple');assert.ok(applyChoice(p,{kind:'fusion',id:'purple'}));assert.equal(p.weapons.red,undefined);assert.equal(p.passives.eyes,3);assert.equal(p.fusions.blue,'purple');
});


test('full companion sprites fit inside short landscape screens at high zoom, including Mahoraga’s wheel',()=>{
 for(const [w,h]of [[844,390],[568,320],[390,844]]){const g=quiet('megumi');g.view={w,h};g.zoom=g.targetZoom=1.65;const far=target(g,1200);castWeapon(g,'shadows',far);castWeapon(g,'nue',far);useSpecial(g);const radius=companionLeash(g);for(const s of g.summons){s.x=g.p.x;s.y=g.p.y-radius;}updateRun(g,.02);for(const s of g.summons){const pixels=summonPixels(s.kind),occupied=pixels.map((c,i)=>c?i:-1).filter(i=>i>=0),scale=s.kind==='mahoraga'?1.05:.85,minX=Math.min(...occupied.map(i=>i%56)),maxX=Math.max(...occupied.map(i=>i%56)),minY=Math.min(...occupied.map(i=>Math.floor(i/56))),left=(s.x-g.p.x+(minX-28)*scale)*g.zoom,right=(s.x-g.p.x+(maxX-28)*scale)*g.zoom,top=(s.y-g.p.y+(minY-71)*scale)*g.zoom;assert.ok(left>-w/2&&right<w/2,s.kind);assert.ok(top>-h/2,s.kind+' wheel must be visible');}}
});
