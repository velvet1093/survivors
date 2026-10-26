import {NODE_TYPES,ASCENT_ACTS,ASCENT_FLOORS} from './ascent.js';
import {MAPS,CHARACTERS} from './game.js';
import {ENEMIES,BOSSES} from './enemies.js';
import {trinketFor,trinketIcon} from './trinkets.js';
import {icon} from './icons.js';
import {characterPixels,pixelsSvg} from './pixel-characters.js';
import {enemyPixels} from './pixel-enemies.js';
import {mapPreview} from './pixel-world.js';
import {ULTIMATES} from './ultimates.js';
import {cardDef,cardStats,cardText,cardIcon} from './spire-cards.js';
import {ULT_CHARGE,PACTS,relicEffect,spireNode,reachable,enterSpireNode,liveFoes,canPlay,needsTarget,playCard,ultimateReady,useUltimate,endTurn,takeRewardCard,finishRewards,continueSpireAct,buyCard,buyRelic,removeCard,leaveSpireScreen,upgradable,restHeal,upgradeCard,forgeOptions,forgeFuse,forgeTemper,swearSpirePact,altarSpire,spireEventFor,resolveSpireEvent} from './spire.js';

// Screens for the turn-based Ascent. The body re-renders after every action; damage
// numbers float in a separate layer so they survive the re-render.
const esc=s=>String(s??'').replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'})[c]);
const ROW=66,PAD=46;
const NODE_TEXT={
 battle:'A fight against the creatures of a random world. Choose a card afterwards.',
 elite:'A powerful champion, with an escort from act 2. Better cards and a relic.',
 gauntlet:'Two waves back to back. Extra gold and a card.',
 rift:'A rift superboss. A relic, rare cards and a pile of gold.',
 boss:'The guardian of this act. Rare cards, a relic and the way up.',
 shop:'Buy cards or a relic, or pay to remove a card from your deck.',
 rest:'Heal 30% of your max HP, or upgrade one card.',
 treasure:'A relic and some gold.',
 mystery:'An event: a choice, a fight or a stroke of luck.',
 forge:'Fuse cards that complete a fusion recipe, or temper two random cards.',
 shrine:'Swear a pact: a lasting blessing bound to a lasting curse.',
 altar:'Offer max HP or gold for rare power.',
};
const RARITY_COLOR={starter:'#9aa0b4',common:'#c9cbe0',uncommon:'#6ab8ff',rare:'#ffc45a',curse:'#b46ad6'};
const STATUS_INFO={
 strength:['STR','#ff8a6a','Strength: each attack deals this much more damage.'],
 dexterity:['DEX','#7fd6a0','Dexterity: each Block card gives this much more Block.'],
 weak:['WEAK','#c9a6ff','Weak: attacks deal 25% less damage.'],
 vulnerable:['VULN','#ffb15a','Vulnerable: takes 50% more damage from attacks.'],
 poison:['POISON','#8fdc5a','Poison: loses this much HP each turn, then it fades by 1.'],
 bleed:['BLEED','#ff5a6a','Bleed: loses this much HP each turn, then it fades by 1.'],
 burn:['BURN','#ff9a3a','Burn: loses this much HP each turn, then it fades by 1.'],
 stun:['STUN','#ffe36a','Stunned: skips its next move.'],
 turret:['SUMMON','#9fd8ff','At the end of your turn, deals this much damage to a random enemy.'],
 regen:['REGEN','#7fe0a8','At the end of your turn, heals this much HP.'],
 plated:['PLATE','#c9d4e6','At the end of your turn, gain this much Block.'],
};
const ui={selected:null,node:null,pile:null,lastFx:0,combatKey:null,menu:false,pickFor:null,busy:false};
const sprites=new Map();
function sprite(key,make){if(!sprites.has(key))sprites.set(key,`<svg viewBox="0 0 56 76" shape-rendering="crispEdges" aria-hidden="true">${pixelsSvg(make())}</svg>`);return sprites.get(key);}
const heroSprite=(run,attack=false)=>sprite(`h:${run.heroId}:${run.skin}:${attack}`,()=>characterPixels(run.heroId,{skin:run.skin,attack,frame:attack?1:0}));
const foeSprite=e=>sprite(`e:${e.id}:${e.enraged?1:0}`,()=>enemyPixels(e.id,{enraged:e.enraged?1:0}));
const hero=run=>CHARACTERS.find(c=>c.id===run.heroId)||CHARACTERS[0];
const relicName=id=>trinketFor(id)?.name||id;

export function cardHtml(id,{up=false,attrs='',cls='',vars=''}={}){
 const c=cardStats(id,up);if(!c)return '';
 const type=c.type==='curse'?'CURSE':c.type.toUpperCase(),rarity=c.rarity==='starter'?'BASIC':c.rarity.toUpperCase();
 const text=cardText(id,up);
 return `<button type="button" class="scard t-${c.type} ${up?'up':''} ${text.length>58?'long':''} ${cls}" style="--rarity:${RARITY_COLOR[c.rarity]||'#ccc'};${vars}" ${attrs} aria-label="${esc(c.name)}${up?' plus':''}, ${c.cost==null?'unplayable':c.cost+' energy'}, ${type}. ${esc(cardText(id,up))}"><span class="scard-cost">${c.cost??'–'}</span><span class="scard-name">${esc(c.name)}${up?'+':''}</span><span class="scard-art">${icon(cardIcon(id))}</span><span class="scard-type">${type} · ${rarity}${c.fusion?' · FUSION':''}</span><span class="scard-text">${esc(cardText(id,up))}</span></button>`;
}
function chips(statuses={},powers={}){
 return Object.entries({...statuses,...powers}).filter(([k,v])=>v>0&&STATUS_INFO[k]).map(([k,v])=>{const [label,color,text]=STATUS_INFO[k];return `<span class="schip" style="--chip:${color}" title="${esc(text)}">${label} ${v}</span>`;}).join('');
}
function bar(hp,max,block){return `<div class="sbar"><i style="width:${Math.max(0,Math.min(100,hp/max*100))}%"></i><span>${block?`<b class="sblock">◈ ${block}</b>`:''}${Math.ceil(hp)} / ${max}</span></div>`;}
function intentHtml(e,player){
 const it=e.intent;if(!it)return '';if(it.stunned)return '<span class="sintent stunned" title="Stunned: skips its move">✸ STUNNED</span>';
 const vuln=(player.statuses.vulnerable||0)>0,hit=vuln?Math.floor(it.attack*1.5):it.attack,parts=[];
 if(it.attack)parts.push(`<b class="i-atk">⚔ ${hit}${it.times>1?'×'+it.times:''}</b>`);
 if(it.block)parts.push(`<b class="i-def">◈ ${it.block}</b>`);
 if(it.buff)parts.push(`<b class="i-buf">▲ +${it.buff} STR</b>`);
 if(it.debuff)parts.push(`<b class="i-deb">✦ ${STATUS_INFO[it.debuff]?.[0]||it.debuff.toUpperCase()}</b>`);
 const say=[it.attack&&`attack for ${hit}${it.times>1?' '+it.times+' times':''}`,it.block&&`block ${it.block}`,it.buff&&`gain ${it.buff} Strength`,it.debuff&&`apply ${it.debuff}`].filter(Boolean).join(', ');
 return `<span class="sintent" title="Intends to ${say}">${parts.join('')}</span>`;
}
function topBar(run,title){
 const h=hero(run),node=spireNode(run);
 const relics=run.relics.map(id=>`<span class="srelic" title="${esc(relicName(id))}: ${esc(relicEffect(id).text)}">${trinketIcon(id)}</span>`).join('');
 const pacts=run.pacts.map(id=>{const p=PACTS.find(x=>x.id===id);return `<span class="spact" title="${esc(p.name)}: ${esc(p.blessing)} ${esc(p.curse)}">✧</span>`;}).join('');
 return `<div class="spire-top"><span class="spire-hero-mini" style="--accent:${h.color}">${heroSprite(run)}</span><div class="spire-top-main"><span class="eyebrow">ASCENT · ACT ${run.act} / ${ASCENT_ACTS}${node?` · FLOOR ${node.floor+1}`:''}</span><strong id="spire-title">${esc(title)}</strong></div><span class="spire-pill hp" aria-label="Health ${run.hp} of ${run.maxHp}">♥ ${run.hp} / ${run.maxHp}</span><span class="spire-pill gold" aria-label="${run.gold} gold">◉ ${run.gold}</span><button type="button" class="spire-pill deck" id="spire-deck" aria-label="View deck, ${run.deck.length} cards">▤ ${run.deck.length}</button><button type="button" class="icon-button" id="spire-menu" aria-label="Menu">${icon('pause')}</button>${relics||pacts?`<div class="spire-relics" aria-label="Relics and pacts">${relics}${pacts}</div>`:''}</div>`;
}

// ---- Map ----
function mapView(run){
 const reach=new Set(reachable(run).map(n=>n.id)),visited=new Set(run.visited),height=(ASCENT_FLOORS+1)*ROW+PAD*2;
 const pos=n=>({x:(n.col+.5)/7*100,y:height-PAD-n.floor*ROW});
 const lines=run.nodes.flatMap(n=>n.next.map(id=>{const m=spireNode(run,id);if(!m)return '';const p=pos(n),q=pos(m),walked=visited.has(n.id)&&visited.has(m.id),open=n.id===run.nodeId&&reach.has(m.id);return `<line x1="${p.x}%" y1="${p.y}" x2="${q.x}%" y2="${q.y}" class="${walked?'walked':open?'open':''}"/>`;})).join('');
 const nodes=run.nodes.map(n=>{const t=NODE_TYPES[n.type],p=pos(n),state=n.id===run.nodeId?'current':visited.has(n.id)?'visited':reach.has(n.id)?'reachable':'';return `<button type="button" class="ascent-node ${n.type} ${state} ${ui.node===n.id?'selected':''}" data-node="${n.id}" style="left:${p.x}%;top:${p.y}px;--node:${t.color}" ${reach.has(n.id)?'':'tabindex="-1"'} aria-label="${esc(t.name)}, floor ${n.floor+1}${reach.has(n.id)?', reachable':state?', '+state:''}"><span>${t.glyph}</span></button>`;}).join('');
 const sel=ui.node&&reach.has(ui.node)?spireNode(run,ui.node):null,info=sel&&NODE_TYPES[sel.type];
 const legend=Object.entries(NODE_TYPES).map(([id,t])=>`<span style="--node:${t.color}"><i>${t.glyph}</i>${t.name}</span>`).join('');
 return `${topBar(run,run.nodeId?`Floor ${spireNode(run).floor+1} cleared.`:'Choose your path.')}<div class="spire-panel"><div class="ascent-map-wrap" id="spire-map-wrap"><div class="ascent-map" style="height:${height}px"><svg class="ascent-lines" width="100%" height="${height}" aria-hidden="true">${lines}</svg>${nodes}<span class="ascent-floor-label" style="top:${height-PAD-ASCENT_FLOORS*ROW-34}px">GUARDIAN</span></div></div>
 <div class="ascent-node-info" aria-live="polite">${info?`<span class="ascent-info-glyph" style="--node:${info.color}">${info.glyph}</span><div><strong>${esc(info.name)} · floor ${sel.floor+1}</strong><p>${esc(NODE_TEXT[sel.type])}</p></div><button class="primary" id="spire-enter">ENTER ${icon('arrow')}</button>`:'<p>Tap a glowing node to see what waits there. Paths only climb, so choose your route carefully.</p>'}</div>
 <details class="ascent-legend"><summary>MAP LEGEND</summary><div>${legend}</div></details></div>`;
}

// ---- Combat ----
function combatView(run){
 const c=run.combat,h=hero(run),ult=ULTIMATES[run.heroId],map=MAPS.find(m=>m.id===c.mapId)||MAPS[0],foes=c.enemies.filter(e=>e.hp>0);
 const sel=ui.selected!=null&&c.hand[ui.selected]?ui.selected:null,targeting=sel!=null&&needsTarget(c.hand[sel])&&foes.length>1;
 const backdrop=mapPreview(map).replace('<svg ','<svg preserveAspectRatio="xMidYMid slice" ');
 const enemies=foes.map(e=>{const big=e.boss||e.rift;return `<button type="button" class="sfoe ${big?'big':''} ${e.elite?'elite':''} ${e.enraged?'enraged':''} ${targeting?'targetable':''}" data-foe="${e.uid}" data-uid="${e.uid}" aria-label="${esc(e.name)}, ${e.hp} of ${e.maxHp} HP${e.block?', '+e.block+' block':''}">${intentHtml(e,c.player)}<span class="sfoe-art">${foeSprite(e)}</span><span class="sfoe-name">${e.elite?'★ ':''}${esc(e.name)}</span>${bar(e.hp,e.maxHp,e.block)}<span class="schips">${chips(e.statuses)}</span></button>`;}).join('');
 const hand=c.hand.map((card,i)=>{const playable=canPlay(run,i);return cardHtml(card.id,{up:card.up,attrs:`data-hand="${i}"`,vars:`--i:${i};--n:${c.hand.length}`,cls:`${playable?'playable':'dim'} ${sel===i?'selected':''}`});}).join('');
 const ultReady=ultimateReady(run);
 return `${topBar(run,NODE_TYPES[c.type]?.name||'Battle')}<div class="spire-battle"><div class="spire-backdrop" aria-hidden="true">${backdrop}</div>
 <div class="spire-stage"><div class="shero" id="spire-hero" data-uid="player" style="--accent:${h.color}"><span class="shero-art">${heroSprite(run,ui.attacking)}</span>${bar(run.hp,run.maxHp,c.player.block)}<span class="schips">${chips(c.player.statuses,c.powers)}</span></div><div class="sfoes">${enemies}</div></div>
 <p class="spire-hint" aria-live="polite">${targeting?`Choose a target for <b>${esc(cardDef(c.hand[sel].id).name)}</b>.`:c.waves?'Another wave is coming after this one.':`Turn ${c.turn}`}</p>
 <div class="spire-controls"><div class="senergy" aria-label="${c.energy} of ${c.maxEnergy} energy"><b>${c.energy}</b><small>/ ${c.maxEnergy}</small></div><button type="button" class="spile" data-pile="draw" aria-label="Draw pile, ${c.draw.length} cards">DRAW<b>${c.draw.length}</b></button><div class="shand" role="group" aria-label="Your hand">${hand||'<span class="shand-empty">No cards in hand.</span>'}</div><button type="button" class="spile" data-pile="discard" aria-label="Discard pile, ${c.discard.length} cards">DISCARD<b>${c.discard.length}</b></button>${c.exhaust.length?`<button type="button" class="spile ex" data-pile="exhaust" aria-label="Exhausted, ${c.exhaust.length} cards">EXHAUST<b>${c.exhaust.length}</b></button>`:''}
 <button type="button" class="sult ${ultReady?'ready':''}" id="spire-ult" style="--ult:${ult?.color||h.color};--charge:${c.ult/ULT_CHARGE*100}%" ${ultReady?'':'disabled'} title="Deal ${10+run.act*6} damage to ALL enemies and gain ${8+run.act*2} Block. Charges as you play cards.">${icon('power')}<span>${esc(ult?.name||'Ultimate')}<small>${ultReady?'READY':c.ult+' / '+ULT_CHARGE+' CARDS'}</small></span></button><button type="button" class="primary send" id="spire-end">END TURN</button></div></div>`;
}

// ---- Rewards and rooms ----
function relicLine(id){return id?`<div class="srelic-big"><span>${trinketIcon(id)}</span><div><small>RELIC</small><strong>${esc(relicName(id))}</strong><p>${esc(relicEffect(id).text)}</p></div></div>`:'';}
function rewardView(run){
 const rw=run.rewards;
 return `${topBar(run,rw.title||'Victory.')}<div class="spire-panel"><div class="sreward-loot">${rw.gold?`<span class="spire-pill gold">◉ +${rw.gold} GOLD</span>`:''}${relicLine(rw.relic)}</div>
 ${rw.cards?`<h3 class="ascent-sub">ADD A CARD TO YOUR DECK</h3><div class="scard-row">${rw.cards.map(id=>cardHtml(id,{attrs:`data-take="${id}"`,cls:'big'})).join('')}</div>`:''}
 <div class="ascent-actions"><button class="${rw.cards?'secondary':'primary'}" id="spire-continue">${rw.cards?'SKIP THE CARD':'CONTINUE'} ${icon('arrow')}</button></div></div>`;
}
function shopView(run){
 const s=run.shop;
 return `${topBar(run,'The merchant’s wares.')}<div class="spire-panel"><div class="scard-row shop">${s.cards.map((o,i)=>`<div class="soffer ${o.sold?'sold':''}">${cardHtml(o.id,{attrs:`data-buy="${i}" ${o.sold||run.gold<o.price?'disabled':''}`})}<b>${o.sold?'SOLD':'◉ '+o.price}</b></div>`).join('')}</div>
 <div class="ascent-shop">${s.relic?`<article class="ascent-offer ${s.relic.sold?'sold':''}" style="--item:#ffd66a"><span class="item-art">${trinketIcon(s.relic.id)}</span><div><small>RELIC</small><strong>${esc(relicName(s.relic.id))}</strong><p>${esc(relicEffect(s.relic.id).text)}</p></div><button id="spire-buy-relic" ${s.relic.sold||run.gold<s.relic.price?'disabled':''}>${s.relic.sold?'SOLD':'◉ '+s.relic.price}</button></article>`:''}
 <article class="ascent-offer ${s.removed?'sold':''}" style="--item:#ff9aaa"><span class="item-art">${icon('regret')}</span><div><small>SERVICE</small><strong>Card removal</strong><p>Remove one card from your deck for good.</p></div><button id="spire-remove" ${s.removed||run.gold<run.removeCost||run.deck.length<=5?'disabled':''}>${s.removed?'DONE':'◉ '+run.removeCost}</button></article></div>
 <div class="ascent-actions"><button class="primary" id="spire-leave">LEAVE THE SHOP</button></div></div>`;
}
function restView(run){
 return `${topBar(run,'A quiet campfire.')}<div class="spire-panel"><div class="ascent-choice-row"><button class="ascent-big" id="spire-rest"><span>♨</span><strong>REST</strong><small>Heal ${Math.round(run.maxHp*.3)} HP</small></button><button class="ascent-big" id="spire-smith" ${upgradable(run).length?'':'disabled'}><span>⚒</span><strong>SMITH</strong><small>Upgrade one card</small></button></div></div>`;
}
function forgeView(run){
 const opts=forgeOptions(run);
 return `${topBar(run,'The soul forge burns.')}<div class="spire-panel"><p class="ascent-note">A fusion card replaces one copy of each of its ingredient cards. If any ingredient was upgraded, the fusion is too.</p>${opts.length?`<div class="sfuse-list">${opts.map(c=>`<div class="sfuse"><div class="sfuse-parts">${c.ingredients.map(id=>`<span title="${esc(cardDef(id).name)}">${icon(cardIcon(id))}<small>${esc(cardDef(id).name)}</small></span>`).join('<i>+</i>')}<i>→</i></div>${cardHtml(c.id,{attrs:`data-fuse="${c.id}"`})}</div>`).join('')}</div>`:'<p class="ascent-note"><b>No recipe is complete.</b> Add every ingredient card of a fusion recipe to your deck to fuse it here.</p>'}
 <div class="ascent-choice-row"><button class="ascent-big" id="spire-temper" ${upgradable(run).length?'':'disabled'}><span>✦</span><strong>TEMPER</strong><small>Upgrade two random cards</small></button></div><div class="ascent-actions"><button class="secondary" id="spire-leave">LEAVE</button></div></div>`;
}
function shrineView(run){
 return `${topBar(run,'Swear a pact.')}<div class="spire-panel"><p class="ascent-note">A pact lasts for the rest of the climb. Its blessing and its curse are bound together.</p><div class="ascent-pacts-grid">${(run.event?.pacts||[]).map(id=>{const p=PACTS.find(x=>x.id===id);return `<button class="ascent-pact" data-pact="${id}"><strong>${esc(p.name)}</strong><span class="bless">✦ ${esc(p.blessing)}</span><span class="curse">✟ ${esc(p.curse)}</span></button>`;}).join('')}</div><div class="ascent-actions"><button class="secondary" id="spire-leave">REFUSE ALL PACTS</button></div></div>`;
}
function altarView(run){
 return `${topBar(run,'The cursed altar hungers.')}<div class="spire-panel"><div class="ascent-choice-row"><button class="ascent-big" data-altar="blood" ${run.maxHp<=20?'disabled':''}><span>♥</span><strong>OFFER BLOOD</strong><small>Lose 8 max HP · choose a rare card</small></button><button class="ascent-big" data-altar="gold" ${run.gold<120?'disabled':''}><span>◉</span><strong>OFFER 120 GOLD</strong><small>Gain a relic</small></button></div><div class="ascent-actions"><button class="secondary" id="spire-leave">WALK AWAY</button></div></div>`;
}
function eventView(run){
 const ev=spireEventFor(run);
 return `${topBar(run,ev.title)}<div class="spire-panel"><p class="ascent-story">${esc(ev.text)}</p><div class="ascent-event-options">${ev.options.map(o=>`<button data-event="${o.id}" ${o.cost&&run.gold<o.cost?'disabled':''}>${esc(o.label)}${o.cost?` · ◉ ${o.cost}`:''}</button>`).join('')}</div></div>`;
}
function actClearView(run){
 return `${topBar(run,`Act ${run.act-1} conquered.`)}<div class="spire-panel"><p class="ascent-story">The guardian has fallen. You rest and recover 35% of your health. The climb continues, and the enemies above are stronger.</p><div class="ascent-actions"><button class="primary" id="spire-act">BEGIN ACT ${run.act} ${icon('arrow')}</button></div></div>`;
}

// ---- Overlays: piles, deck picker, menu ----
function pileView(run){
 const c=run.combat,kind=ui.pile,list=kind==='deck'?run.deck:kind==='draw'?[...c.draw].sort((a,b)=>a.id.localeCompare(b.id)):c?.[kind]||[];
 const picking=ui.pickFor,title=picking==='remove'?'Remove a card':picking==='upgrade'?'Upgrade a card':kind==='deck'?'Your deck':kind==='draw'?'Draw pile':kind==='discard'?'Discard pile':'Exhausted cards';
 const cards=picking?(picking==='upgrade'?upgradable(run):run.deck):list;
 return `<div class="modal-backdrop spire-overlay"><section class="modal spire-pile" role="dialog" aria-modal="true" aria-label="${esc(title)}"><div class="codex-heading"><div><span class="eyebrow">${cards.length} CARDS${picking==='upgrade'?' · SHOWN UPGRADED':''}</span><h2>${esc(title)}</h2></div><button class="icon-button" id="spire-close-pile" aria-label="Close">×</button></div><div class="scard-grid">${cards.map(card=>cardHtml(card.id,{up:picking==='upgrade'?true:card.up,attrs:picking?`data-pick="${card.uid}"`:'tabindex="-1"',cls:picking?'':'static'})).join('')||'<p class="ascent-note">Empty.</p>'}</div></section></div>`;
}
function menuView(run){
 return `<div class="modal-backdrop spire-overlay"><section class="modal" role="dialog" aria-modal="true" aria-label="Ascent menu"><span class="eyebrow">ASCENT · ACT ${run.act}</span><h2>Catch your breath.</h2><p>Your climb saves after every action. Return to the lobby to continue it later, or abandon it to bank what you have earned.<br><br>Tap a card to play it. Attacks against one enemy ask for a target when there is more than one.<br>Keys: 1–9 play cards · E end turn · Q ultimate · Esc cancel</p><button class="primary" id="spire-resume">RESUME ${icon('arrow')}</button><button class="secondary" id="spire-lobby">SAVE & RETURN TO LOBBY</button><button class="secondary danger" id="spire-abandon">ABANDON RUN</button></section></div>`;
}

// ---- Floating numbers ----
function floats(root,run){
 const c=run.combat,layer=root.querySelector('.spire-floats');if(!c||!layer)return;
 const key=run.runId+':'+run.stats.battles+':'+c.type;if(ui.combatKey!==key){ui.combatKey=key;ui.lastFx=0;}
 const fresh=c.fx.filter(f=>f.id>ui.lastFx);ui.lastFx=c.fxSerial;
 const box=root.getBoundingClientRect();
 fresh.forEach((f,i)=>{
  const target=root.querySelector(`[data-uid="${f.target}"]`);if(!target)return;const r=target.getBoundingClientRect();
  const status=STATUS_INFO[f.kind];
  const text=f.kind==='hit'?(f.amount?'−'+f.amount:f.blocked?'BLOCKED':'0'):f.kind==='block'?'◈ +'+f.amount:f.kind==='heal'?(f.amount?'+'+f.amount:''):f.kind==='phase'?'PHASE II!':f.kind==='wave'?'NEXT WAVE!':f.kind==='ultimate'?'ULTIMATE!':f.kind==='stunned'?'STUNNED':status?(f.amount?`${status[0]} ${f.amount}`:status[0]):'';
  if(!text)return;const el=document.createElement('span');el.className='sfloat k-'+f.kind;el.textContent=text;
  el.style.left=(r.left-box.left+r.width/2+(i%3-1)*14)+'px';el.style.top=(r.top-box.top+r.height*.35-(i%4)*10)+'px';el.style.animationDelay=(i*.06)+'s';
  layer.append(el);setTimeout(()=>el.remove(),1300+i*60);
  if(f.kind==='hit'&&f.amount){target.classList.remove('shake');void target.offsetWidth;target.classList.add('shake');}
 });
}

// ---- Render ----
export function showSpire(host,run,{onChange,onLobby,onAbandon,onOver,sound=()=>{}}){
 if(!host.querySelector('.spire-root'))host.innerHTML='<div class="spire-root"><div class="spire-body"></div><div class="spire-floats" aria-hidden="true"></div><div class="spire-overlay-host"></div></div>';
 const root=host.querySelector('.spire-root'),body=root.querySelector('.spire-body'),over=root.querySelector('.spire-overlay-host');
 if(run.screen==='over'){host.innerHTML='';onOver();return;}
 const s=run.screen;
 if(s!=='combat')ui.selected=null;
 body.className='spire-body spire-'+s;
 body.innerHTML=s==='map'?mapView(run):s==='combat'?combatView(run):s==='reward'?rewardView(run):s==='shop'?shopView(run):s==='rest'?restView(run):s==='forge'?forgeView(run):s==='shrine'?shrineView(run):s==='altar'?altarView(run):s==='event'?eventView(run):s==='actclear'?actClearView(run):'';
 over.innerHTML=ui.menu?menuView(run):ui.pile||ui.pickFor?pileView(run):'';
 const rerender=()=>showSpire(host,run,{onChange,onLobby,onAbandon,onOver,sound});
 // An action that ends the fight lingers on the battlefield for a moment first.
 const act=(fn,tone='ui')=>{if(ui.busy)return;const before=run.screen,ok=fn();if(ok===false)return;sound(tone);onChange();if(before==='combat'&&run.screen!=='combat'){ui.busy=true;floats(root,run);root.querySelector('.spire-stage')?.classList.add('ending');setTimeout(()=>{ui.busy=false;rerender();},run.screen==='over'?1100:750);return;}rerender();};
 const on=(sel,fn,tone)=>root.querySelectorAll(sel).forEach(b=>b.onclick=e=>{e.stopPropagation();act(()=>fn(b),tone);});
 const local=(sel,fn)=>root.querySelectorAll(sel).forEach(b=>b.onclick=e=>{e.stopPropagation();fn(b);rerender();});
 // Map
 local('[data-node]',b=>{if(reachable(run).some(n=>n.id===b.dataset.node))ui.node=b.dataset.node;});
 on('#spire-enter',()=>{const id=ui.node;ui.node=null;return enterSpireNode(run,id);});
 // Combat
 const play=(i,target)=>{ui.selected=null;ui.attacking=cardDef(run.combat.hand[i]?.id)?.type==='attack';const ok=playCard(run,i,target);setTimeout(()=>{if(ui.attacking){ui.attacking=false;if(run.screen==='combat'&&!ui.busy)rerender();}},260);return ok;};
 root.querySelectorAll('[data-hand]').forEach(b=>b.onclick=e=>{e.stopPropagation();const i=+b.dataset.hand,c=run.combat;if(!canPlay(run,i)){sound('deny');b.classList.remove('shake');void b.offsetWidth;b.classList.add('shake');return;}
  if(needsTarget(c.hand[i])&&liveFoes(c).length>1){ui.selected=ui.selected===i?null:i;rerender();return;}act(()=>play(i),'hit');});
 root.querySelectorAll('[data-foe]').forEach(b=>b.onclick=e=>{e.stopPropagation();if(ui.selected==null)return;const i=ui.selected;act(()=>play(i,b.dataset.foe),'hit');});
 root.querySelector('.spire-battle')?.addEventListener('click',()=>{if(ui.selected!=null){ui.selected=null;rerender();}});
 on('#spire-end',()=>{ui.selected=null;root.querySelector('.spire-stage')?.classList.add('enemy-turn');return endTurn(run);},'turn');
 on('#spire-ult',()=>useUltimate(run),'ultimate');
 local('[data-pile]',b=>{ui.pile=b.dataset.pile;});local('#spire-deck',()=>{ui.pile='deck';});
 local('#spire-close-pile',()=>{ui.pile=null;ui.pickFor=null;});
 // Rewards and rooms
 on('[data-take]',b=>takeRewardCard(run,b.dataset.take)&&finishRewards(run));on('#spire-continue',()=>finishRewards(run));
 on('[data-buy]',b=>buyCard(run,+b.dataset.buy),'coin');on('#spire-buy-relic',()=>buyRelic(run),'coin');local('#spire-remove',()=>{ui.pickFor='remove';});
 on('#spire-leave',()=>leaveSpireScreen(run));on('#spire-rest',()=>restHeal(run));local('#spire-smith',()=>{ui.pickFor='upgrade';});
 on('[data-fuse]',b=>forgeFuse(run,b.dataset.fuse));on('#spire-temper',()=>forgeTemper(run));
 on('[data-pact]',b=>swearSpirePact(run,b.dataset.pact));on('[data-altar]',b=>altarSpire(run,b.dataset.altar));on('[data-event]',b=>resolveSpireEvent(run,b.dataset.event));
 on('#spire-act',()=>continueSpireAct(run));
 on('[data-pick]',b=>{const uid=+b.dataset.pick,kind=ui.pickFor;ui.pickFor=null;ui.pile=null;return kind==='remove'?removeCard(run,uid):upgradeCard(run,uid,{screen:run.screen});});
 // Menu
 local('#spire-menu',()=>{ui.menu=true;});local('#spire-resume',()=>{ui.menu=false;});
 root.querySelector('#spire-lobby')?.addEventListener('click',()=>{ui.menu=false;onLobby();});
 root.querySelector('#spire-abandon')?.addEventListener('click',e=>{const b=e.currentTarget;if(b.dataset.armed){ui.menu=false;onAbandon();return;}b.dataset.armed='1';b.textContent='TAP AGAIN TO ABANDON';});
 floats(root,run);
 const wrap=root.querySelector('#spire-map-wrap');if(wrap){const here=root.querySelector('.ascent-node.selected,.ascent-node.reachable,.ascent-node.current');if(here)wrap.scrollTop=Math.max(0,here.offsetTop-wrap.clientHeight*.62);}
 if(!over.innerHTML&&s!=='combat')root.querySelector('#spire-enter,[data-take],#spire-act,.ascent-node.reachable,[data-event],#spire-leave,#spire-rest,#spire-continue')?.focus({preventScroll:true});
 else over.querySelector('#spire-resume,#spire-close-pile')?.focus({preventScroll:true});
 host.spireKeys=e=>{
  if(ui.busy)return;
  if(e.code==='Escape'){if(ui.menu||ui.pile||ui.pickFor){ui.menu=false;ui.pile=null;ui.pickFor=null;}else if(ui.selected!=null)ui.selected=null;else ui.menu=true;rerender();return;}
  if(run.screen!=='combat'||ui.menu||ui.pile||ui.pickFor)return;
  const n=Number(e.key);if(n>=1&&n<=9){root.querySelector(`[data-hand="${n-1}"]`)?.click();return;}
  if(e.code==='KeyE')root.querySelector('#spire-end')?.click();
  if(e.code==='KeyQ')root.querySelector('#spire-ult:not(:disabled)')?.click();
 };
}
export function resetSpireUi(){Object.assign(ui,{selected:null,node:null,pile:null,lastFx:0,combatKey:null,menu:false,pickFor:null,busy:false,attacking:false});}
export function spireResultText(run){
 const s=run.stats;return {title:run.won?'The summit is yours.':'The climb remembers.',eyebrow:run.won?'ASCENT CONQUERED':'THE ASCENT CLAIMS ANOTHER',summary:`Act ${run.act} of ${ASCENT_ACTS} · ${s.floors} floors · ${s.battles} battles · ${s.elites} elites · ${s.bosses} guardians · ${s.cardsPlayed} cards played · ${run.deck.length} cards in your deck.`};
}
