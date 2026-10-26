import test from 'node:test';
import assert from 'node:assert/strict';
import {ITEMS,FUSIONS,CHARACTERS} from '../src/game.js';
import {CARD_LIBRARY,cardStats,cardText,cardPool,starterDeck,forgeableFusions} from '../src/spire-cards.js';
import * as S from '../src/spire.js';
import {SAVE_STORAGE_KEYS} from '../src/save-storage.js';

const run=(hero='goku',seed=11)=>S.createSpireRun(hero,{seed});
// Clears the current fight by zeroing every foe through real card plays' damage path.
const killAll=r=>{for(const e of r.combat.enemies)e.hp=1;const i=r.combat.hand.findIndex(c=>cardStats(c.id,c.up).effects.some(e=>e.op==='damageAll'));if(i>=0){r.combat.energy=9;S.playCard(r,i);}else{r.combat.hand.unshift({uid:999,id:'strike',up:false});r.combat.energy=9;while(r.screen==='combat'){const t=S.liveFoes(r.combat)[0];if(!t)break;if(!r.combat.hand.some(c=>c.id==='strike'))r.combat.hand.unshift({uid:999,id:'strike',up:false});S.playCard(r,r.combat.hand.findIndex(c=>c.id==='strike'),t.uid);r.combat.energy=9;}}};

test('every item and fusion becomes a playable card with readable text',()=>{
 for(const [id,item]of Object.entries(ITEMS)){if(item.fusionOnly)continue;assert.ok(CARD_LIBRARY[id],id);}
 for(const f of FUSIONS){const c=CARD_LIBRARY['fusion:'+f.id];assert.ok(c,f.id);assert.equal(c.rarity,'rare');assert.ok(c.ingredients.length>=2,f.id);}
 for(const c of Object.values(CARD_LIBRARY)){if(c.unplayable)continue;assert.ok(c.effects.length,c.id);assert.ok(cardText(c.id).length>5,c.id);assert.ok([0,1,2].includes(c.cost),c.id);}
});
test('upgrades raise numbers and starter decks hold the hero signature',()=>{
 const base=cardStats('strike'),up=cardStats('strike',true);assert.ok(up.effects[0].value>base.effects[0].value);
 for(const h of CHARACTERS){const deck=starterDeck(h.id);assert.equal(deck.filter(id=>id==='strike').length,5);assert.ok(deck.includes(h.weapon),h.id);}
 assert.ok(cardPool('rare','goku').length>0);assert.ok(!cardPool('common','goku').includes('titanfists'));
});
test('playing cards spends energy, deals damage and the enemy acts on end turn',()=>{
 const r=run();S.enterSpireNode(r,S.reachable(r)[0].id);assert.equal(r.screen,'combat');
 const c=r.combat;assert.equal(c.hand.length,S.HAND_SIZE);assert.equal(c.energy,S.BASE_ENERGY);
 c.hand[0]={uid:500,id:'strike',up:false};const foe=S.liveFoes(c)[0],hp=foe.hp,block=foe.block;
 assert.ok(S.playCard(r,0,foe.uid));assert.equal(c.energy,S.BASE_ENERGY-1);
 if(foe.hp>0)assert.equal(hp+block-foe.hp-foe.block,6);
 c.hand.push({uid:501,id:'guard',up:false});assert.ok(S.playCard(r,c.hand.length-1));assert.ok(c.player.block>=5);
 const before=r.hp,turn=c.turn;S.endTurn(r);
 if(r.screen==='combat'){assert.equal(c.turn,turn+1);assert.equal(c.energy,S.BASE_ENERGY);assert.ok(r.hp<=before);}
});
test('statuses: vulnerable amplifies, poison ticks, weak softens attacks',()=>{
 const r=run();S.startCombat(r,'battle');const c=r.combat,e=c.enemies[0];e.hp=e.maxHp=200;e.block=0;
 e.statuses.vulnerable=2;c.hand=[{uid:600,id:'strike',up:false}];c.energy=3;S.playCard(r,0,e.uid);assert.equal(200-e.hp,9);
 e.statuses.poison=4;const hp=e.hp;for(const o of c.enemies.slice(1))o.hp=0;S.endTurn(r);assert.equal(hp-e.hp,4);assert.equal(e.statuses.poison,3);
 e.statuses.weak=1;const plain={...e,statuses:{}};assert.ok(S.intentFor(e).attack<=S.intentFor(plain).attack);
});
test('winning a fight offers cards and gold; a boss win advances the act',()=>{
 const r=run();S.startCombat(r,'battle');const gold=r.gold;killAll(r);assert.equal(r.screen,'reward');assert.equal(r.rewards.cards.length,3);assert.ok(r.gold>gold);
 const pick=r.rewards.cards[0],size=r.deck.length;assert.ok(S.takeRewardCard(r,pick));assert.equal(r.deck.length,size+1);assert.ok(S.finishRewards(r));assert.equal(r.screen,'map');
 S.startCombat(r,'boss');assert.ok(r.combat.enemies[0].boss);killAll(r);assert.ok(r.rewards.relic);S.finishRewards(r);assert.equal(r.act,2);assert.equal(r.screen,'actclear');assert.ok(S.continueSpireAct(r));
});
test('bosses enter phase two at half health',()=>{
 const r=run();S.startCombat(r,'boss');const b=r.combat.enemies[0];b.block=0;b.hp=Math.floor(b.maxHp/2)+3;
 r.combat.hand=[{uid:700,id:'strike',up:false}];r.combat.energy=3;S.playCard(r,0,b.uid);assert.ok(b.enraged);assert.equal(b.statuses.strength,3);
});
test('losing all health ends the run',()=>{
 const r=run();S.startCombat(r,'battle');r.hp=1;r.combat.player.block=0;for(const e of r.combat.enemies){e.statuses={};e.arch='brute';e.step=0;e.intent=S.intentFor(e);}
 S.endTurn(r);assert.equal(r.over,true);assert.equal(r.won,false);assert.equal(r.screen,'over');
});
test('merchant sells cards and relics and removes a card once',()=>{
 const r=run();r.gold=999;r.shop=S.shopStock(r);r.screen='shop';
 assert.ok(r.shop.cards.length>=3);const size=r.deck.length;assert.ok(S.buyCard(r,0));assert.equal(r.deck.length,size+1);assert.equal(S.buyCard(r,0),false);
 if(r.shop.relic){assert.ok(S.buyRelic(r));assert.equal(r.relics.length,1);}
 assert.ok(S.removeCard(r,r.deck[0].uid));assert.equal(S.removeCard(r,r.deck[0].uid),false);assert.ok(S.leaveSpireScreen(r));
});
test('the forge fuses a completed recipe into its fusion card',()=>{
 const r=run('goku');const recipe=Object.values(CARD_LIBRARY).find(c=>c.fusion&&!c.required&&c.ingredients.every(id=>!CARD_LIBRARY[id].fusion));
 for(const id of recipe.ingredients)if(!r.deck.some(c=>c.id===id))S.addCard(r,id);
 assert.ok(forgeableFusions(r.deck,'goku').some(c=>c.id===recipe.id));r.screen='forge';
 assert.ok(S.forgeFuse(r,recipe.id));assert.ok(r.deck.some(c=>c.id===recipe.id));assert.equal(r.screen,'map');
});
test('rest, shrine, altar and every event resolve back to the map',()=>{
 const r=run();r.screen='rest';const hurt=r.hp=10;assert.ok(S.restHeal(r));assert.ok(r.hp>hurt);
 r.screen='rest';const card=S.upgradable(r)[0];assert.ok(S.upgradeCard(r,card.uid));assert.ok(card.up);
 r.screen='shrine';r.event={id:'shrine',pacts:['blood']};const max=r.maxHp;assert.ok(S.swearSpirePact(r,'blood'));assert.equal(r.maxHp,max-10);
 r.screen='altar';r.gold=200;assert.ok(S.altarSpire(r,'gold'));assert.equal(r.screen,'reward');S.finishRewards(r);
 for(const ev of S.SPIRE_EVENTS)for(const o of ev.options){const t=run('frieren',ev.id.length*31+o.id.length);t.gold=500;t.event={id:ev.id};t.screen='event';assert.ok(S.resolveSpireEvent(t,o.id),ev.id+':'+o.id);assert.ok(['map','combat','reward'].includes(t.screen),ev.id+':'+o.id);}
});
test('a run saves and resumes exactly, and the save key syncs to the cloud',()=>{
 const r=run('madoka',99);S.enterSpireNode(r,S.reachable(r)[0].id);const text=S.serializeSpire(r),back=S.restoreSpire(text);
 assert.deepEqual(back,JSON.parse(text));assert.equal(S.rand(back),S.rand(r));
 assert.equal(S.restoreSpire('{"mode":"other"}'),null);assert.equal(S.restoreSpire('nope'),null);
 assert.ok(SAVE_STORAGE_KEYS.includes(S.SPIRE_SAVE_KEY));
 const credit=S.spireRunCredit({...r,won:true});assert.ok(credit.coins>=150&&credit.xp>=60);
});
test('a greedy bot climbs without ever getting stuck',()=>{
 let floors=0;
 for(let seed=1;seed<=6;seed++){const r=S.createSpireRun(CHARACTERS[seed%CHARACTERS.length].id,{seed});let steps=0;
  while(!r.over&&steps++<3000){
   if(r.screen==='map'){const n=S.reachable(r)[0];assert.ok(n,'a node is always reachable');S.enterSpireNode(r,n.id);}
   else if(r.screen==='combat'){let g=0;while(g++<12&&r.screen==='combat'){const i=r.combat.hand.findIndex((c,k)=>S.canPlay(r,k));if(i<0)break;S.playCard(r,i,S.liveFoes(r.combat)[0]?.uid);}if(r.screen==='combat')S.endTurn(r);}
   else if(r.screen==='reward'){if(r.rewards.cards)S.takeRewardCard(r,r.rewards.cards[0]);S.finishRewards(r);}
   else if(r.screen==='actclear')S.continueSpireAct(r);
   else if(r.screen==='rest')S.restHeal(r);
   else if(r.screen==='event'){const ev=S.spireEventFor(r);S.resolveSpireEvent(r,ev.options.at(-1).id);}
   else if(r.screen==='shrine')S.swearSpirePact(r,r.event.pacts[0]);
   else assert.ok(S.leaveSpireScreen(r),r.screen);
  }
  assert.ok(r.over,'run finished');floors+=r.stats.floors;}
 assert.ok(floors/6>=6,'the bot climbs several floors on average');
});
test('every Ascent room and event host has pixel art and lines',async()=>{
 const {npcFor,npcLine,NPCS}=await import('../src/spire-npcs.js'),{npcPixels,NPC_ART_IDS}=await import('../src/npc-art.js');
 for(const id of Object.keys(NPCS)){assert.ok(NPC_ART_IDS.includes(id),id);const px=npcPixels(id);assert.equal(px.length,56*76);assert.ok(px.filter(Boolean).length>500,id);assert.notDeepEqual(npcPixels(id,{bob:1}),px);}
 const r=run();for(const screen of ['shop','rest','forge','shrine','altar']){r.screen=screen;if(screen==='shop')r.shop=S.shopStock(r);const npc=npcFor(r);assert.ok(npc,screen);assert.ok(npc.lines.includes(npcLine(r,npc)));}
 assert.equal(npcFor(r).id,'ryuk');r.screen='rest';assert.equal(npcFor(r).id,'goblinslayer');r.screen='shop';assert.equal(npcFor(r).id,'nami');
 for(const ev of S.SPIRE_EVENTS){r.screen='event';r.event={id:ev.id};assert.equal(!!npcFor(r),ev.id!=='ambush',ev.id);}
});
