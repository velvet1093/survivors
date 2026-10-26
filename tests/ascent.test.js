import test from 'node:test';
import assert from 'node:assert/strict';
import {CHARACTERS,ITEMS} from '../src/game.js';
import {createAscentRun,updateRun} from '../src/engine.js';
import {encounterPressure} from '../src/difficulty.js';
import {saveRun,loadRun} from '../src/run-save.js';
import * as A from '../src/ascent.js';

const hero=id=>CHARACTERS.find(c=>c.id===id);
const fresh=(seed=7)=>{const g=createAscentRun(hero('goku'));Object.assign(g,A.initializeAscent(g,seed));return g;};
const storage=()=>({data:null,getItem(){return this.data;},setItem(k,v){this.data=v;},removeItem(){this.data=null;}});
const play=(g,seconds)=>{for(let t=0;t<seconds&&g.status!=='ascent'&&g.status!=='over';t+=.025){g.invuln=9;if(g.status==='chest')g.status='playing';if(g.status==='trinket'){g.trinkets.pending=null;g.status='playing';}if(g.bossIntro)g.bossIntro=null;updateRun(g,.025,{x:Math.sin(t*1.3),y:Math.cos(t)});}};

test('each act is a branching climb: every start reaches the guardian, paths never cross, fixed floors hold',()=>{
 for(const seed of [1,2,3,99,12345])for(let act=1;act<=3;act++){
  const nodes=A.generateAct(act,seed),byId=new Map(nodes.map(n=>[n.id,n])),boss=byId.get('boss');
  assert.equal(boss.floor,A.ASCENT_FLOORS);assert.equal(boss.type,'boss');
  for(const start of nodes.filter(n=>n.floor===0)){assert.equal(start.type,'battle');const seen=new Set(),stack=[start];while(stack.length){const n=stack.pop();if(seen.has(n.id))continue;seen.add(n.id);for(const id of n.next){const m=byId.get(id);assert.equal(m.floor,n.floor+1,'edges climb one floor');stack.push(m);}}assert.ok(seen.has('boss'),'every path reaches the guardian');}
  assert.ok(nodes.filter(n=>n.floor===7).every(n=>n.type==='treasure'));assert.ok(nodes.filter(n=>n.floor===A.ASCENT_FLOORS-1).every(n=>n.type==='rest'));
  assert.ok(nodes.some(n=>n.type==='shop')&&nodes.some(n=>n.type==='elite'),'a merchant and an elite every act');
  const edges=nodes.flatMap(n=>n.next.filter(id=>id!=='boss').map(id=>[n.floor,n.col,byId.get(id).col]));
  for(const [f,a,b]of edges)for(const [f2,c,d]of edges)if(f===f2)assert.ok((a-c)*(b-d)>=0,'no crossing paths');
  assert.ok(nodes.every(n=>A.NODE_TYPES[n.type]));
 }
 assert.deepEqual(A.generateAct(1,5),A.generateAct(1,5),'maps are seeded');
});
test('the climb: only reachable nodes can be entered, zones clear by objective, gems pay gold and nobody levels',()=>{
 const g=fresh();assert.equal(g.mode,'ascent');assert.equal(g.status,'ascent');assert.equal(g.ascent.screen,'map');assert.equal(g.ascent.gold,99);
 const far=g.ascent.nodes.find(n=>n.floor===3);assert.equal(A.enterNode(g,far.id),false,'cannot skip floors');
 const start=A.reachableNodes(g)[0];assert.ok(A.enterNode(g,start.id));assert.equal(g.status,'playing');assert.equal(g.ascent.zone.type,'battle');
 const gold=g.ascent.gold;play(g,400);
 assert.equal(g.ascent.screen,'reward');assert.equal(g.p.level,1,'no levelling in the Ascent');assert.ok(g.ascent.gold>gold+20,'gems and the clear pay gold');
 assert.equal(g.enemies.length,0);const before=JSON.stringify([g.p.weapons,g.p.passives,g.p.fusions]);assert.ok(A.claimReward(g,0));assert.notEqual(JSON.stringify([g.p.weapons,g.p.passives,g.p.fusions]),before);
 assert.equal(g.ascent.screen,'map');assert.ok(A.reachableNodes(g).every(n=>n.floor===1));
});
test('enemy strength follows the floor and act, not the clock',()=>{
 const g=fresh();const node=A.reachableNodes(g)[0];A.enterNode(g,node.id);const early=encounterPressure(g).hp;
 g.time=5000;assert.equal(encounterPressure(g).hp,early,'time spent does not strengthen enemies');
 g.ascent.act=3;g.status='ascent';g.ascent.screen='map';g.ascent.zone=null;g.ascent.nodeId=null;g.ascent.nodes=A.generateAct(3,7);A.enterNode(g,A.reachableNodes(g)[0].id);
 assert.ok(encounterPressure(g).hp>early*2,'act 3 is much tougher');
});
test('merchant, campfire, forge, shrine, altar and mysteries change the run as described',()=>{
 const g=fresh(),a=g.ascent,p=g.p;a.gold=1000;
 a.screen='shop';a.shop=A.shopStock(g,()=>.3);const offer=a.shop.offers.findIndex(o=>!o.sold);const price=a.shop.offers[offer].price;assert.ok(A.buyOffer(g,offer));assert.equal(a.gold,1000-price);assert.equal(A.buyOffer(g,offer),false,'sold out');
 p.hp=50;assert.ok(A.buyHeal(g));assert.ok(p.hp>50);assert.ok(A.rerollShop(g,()=>.6));assert.ok(A.buyTrinket(g));assert.equal(g.status,'trinket');g.trinkets.pending=null;g.status='ascent';
 a.gold=10;a.shop.offers.forEach(o=>o.sold=false);assert.equal(A.buyOffer(g,0),false,'cannot overspend');assert.ok(A.leaveScreen(g));assert.equal(a.screen,'map');
 a.screen='rest';p.hp=10;assert.ok(A.restHeal(g));assert.ok(p.hp>10);
 a.screen='rest';const lv=p.weapons.ki;assert.ok(A.restTrain(g,'ki'));assert.equal(p.weapons.ki,lv+1);
 a.screen='forge';assert.ok(A.forgeEmpower(g,'ki'));assert.equal(p.weapons.ki,Math.min(ITEMS.ki.max,lv+3));
 a.screen='forge';a.gold=60;assert.ok(A.forgeReforge(g));assert.equal(a.screen,'reward');a.rewards=null;
 const dmg=p.damage,hp=p.maxHp;a.screen='shrine';a.event={id:'shrine',pacts:['blood']};assert.ok(A.swearPact(g,'blood'));assert.ok(Math.abs(p.damage-dmg*1.25)<1e-9);assert.ok(p.maxHp<hp);assert.deepEqual(a.pacts,['blood']);
 a.screen='altar';p.hp=p.maxHp;assert.ok(A.altarOffer(g,'blood'));assert.equal(a.screen,'reward');assert.ok(a.rewards.picks[0].every(c=>c.kind!=='item'||c.maxLevel));a.rewards=null;
 for(const ev of A.EVENTS){const h=fresh(3);h.ascent.gold=500;h.ascent.screen='event';h.ascent.event={id:ev.id};h.ascent.nodeId=A.reachableNodes(h)[0].id;assert.ok(A.resolveEvent(h,ev.options[0].id),ev.id);assert.ok(['map','reward'].includes(h.ascent.screen)||h.status==='playing',ev.id);}
});
test('a guardian clear moves to the next act and biome; the third guardian wins the run',()=>{
 const g=fresh(),a=g.ascent,firstMap=g.map.id;
 a.rewards={gold:0,picks:[],index:-1,bossClear:true};a.screen='reward';a.rewards.picks=[[]];a.rewards.index=0;assert.ok(A.skipReward(g));
 assert.equal(a.act,2);assert.equal(a.screen,'actclear');assert.notEqual(g.map.id,firstMap);assert.ok(A.continueAct(g));assert.equal(a.screen,'map');assert.ok(A.reachableNodes(g).every(n=>n.floor===0));
 a.act=3;a.screen='reward';a.rewards={gold:0,picks:[[]],index:0,bossClear:true};A.skipReward(g);assert.equal(g.won,true);assert.equal(g.status,'over');
});
test('ascent runs save and restore on the map and mid-zone, with gold, pacts and the map intact',()=>{
 const g=fresh(11);g.ascent.gold=321;g.ascent.screen='shrine';g.ascent.event={id:'shrine',pacts:['iron']};A.swearPact(g,'iron');
 const s=storage();assert.ok(saveRun(g,s));const r=loadRun(s);assert.equal(r.mode,'ascent');assert.equal(r.ascent.gold,321);assert.deepEqual(r.ascent.pacts,['iron']);assert.equal(r.ascent.nodes.length,g.ascent.nodes.length);assert.equal(r.resumeStatus,'ascent');assert.ok(Math.abs(r.p.maxHp-g.p.maxHp)<1e-9);
 A.enterNode(g,A.reachableNodes(g)[0].id);play(g,3);assert.ok(saveRun(g,s));const mid=loadRun(s);assert.equal(mid.ascent.zone.type,'battle');assert.equal(mid.resumeStatus,'playing');
});
test('a cleared room stays open 10 seconds for loot (skippable), and every room rolls a random map',()=>{
 const g=fresh(21),maps=new Set();
 for(let i=0;i<6;i++){A.startZone(g,'battle');maps.add(g.map.id);}assert.ok(maps.size>=3,'rooms change worlds');
 const z=A.startZone(g,'battle');g.kills+=z.target;g.gems=[{x:500,y:0,value:10}];updateRun(g,.02);
 assert.equal(z.looting,true);assert.equal(g.status,'playing');assert.equal(g.enemies.length,0);assert.ok(g.gems.length,'loot stays on the floor');assert.match(A.objectiveText(g),/LOOT 10s/);
 for(let t=0;t<5;t+=.1)updateRun(g,.1);assert.equal(g.status,'playing','still looting after 5 s');assert.match(A.objectiveText(g),/LOOT [45]s/);
 assert.ok(A.skipLoot(g));updateRun(g,.02);assert.equal(g.ascent.screen,'reward');assert.equal(g.status,'ascent');
 const z2=A.startZone(g,'battle');g.kills+=z2.target;updateRun(g,.02);for(let t=0;t<10.2;t+=.1)updateRun(g,.1);assert.equal(g.ascent.screen,'reward','the window ends on its own');
});
