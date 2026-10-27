import {NODE_TYPES,ASCENT_ACTS,ASCENT_FLOORS,reachableNodes,ascentNode,enterNode,claimReward,skipReward,continueAct,buyOffer,buyHeal,buyTrinket,rerollShop,leaveScreen,restHeal,restTrain,forgeEmpower,forgeReforge,FORGE_REFORGE_PRICE,ownedItems,PACTS,swearPact,altarOffer,eventFor,resolveEvent,objectiveText} from './ascent.js';
import {ITEMS,MAPS,bondPreview} from './game.js';
import {trinketFor,trinketIcon} from './trinkets.js';
import {icon} from './icons.js';
import {rarityFor,rarityBadge} from './rarity.js';

// Ascent screens. The map is drawn bottom-to-top like a climbing tower: lines join
// the floors, reachable nodes pulse, and a tapped node shows its details before entry.
const esc=s=>String(s??'').replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'})[c]);
const ROW=66,PAD=46;
let selectedNode=null;

function header(g,{title,eyebrow}){
 const a=g.ascent,p=g.p,map=MAPS.find(m=>m.id===a.maps[a.act-1])||g.map;
 const items=[...Object.entries(p.weapons),...Object.entries(p.passives)].map(([id,lv])=>`<span class="ascent-item" title="${esc(ITEMS[id]?.name||id)} · LV ${lv}" style="--rarity:${rarityFor(p.fusions[id]||id)?.color||'#999'}">${icon(p.fusions[id]||id)}<small>${p.fusions[id]?'✦':lv}</small></span>`).join('');
 return `<div class="ascent-head"><div><span class="eyebrow">${esc(eyebrow||`ASCENT · ACT ${a.act} / ${ASCENT_ACTS} · ${map.name.toUpperCase()}`)}</span><h2 id="ascent-title">${esc(title)}</h2></div><div class="ascent-stats"><span class="ascent-gold" aria-label="${a.gold} gold">◉ ${a.gold}</span><span class="ascent-hp" aria-label="Health">♥ ${Math.ceil(p.hp)} / ${Math.round(p.maxHp)}</span></div></div><div class="ascent-loadout" aria-label="Your loadout">${items}${a.pacts.length?`<span class="ascent-pacts">${a.pacts.map(id=>`<b title="${esc(PACTS.find(x=>x.id===id).name)}">✧</b>`).join('')}</span>`:''}</div>`;
}
function mapView(g){
 const a=g.ascent,reach=new Set(reachableNodes(g).map(n=>n.id)),visited=new Set(a.visited),height=(ASCENT_FLOORS+1)*ROW+PAD*2;
 const pos=n=>({x:(n.col+.5)/7*100,y:height-PAD-n.floor*ROW});
 const lines=a.nodes.flatMap(n=>n.next.map(id=>{const m=ascentNode(g,id);if(!m)return '';const p=pos(n),q=pos(m),walked=visited.has(n.id)&&visited.has(m.id),open=n.id===a.nodeId&&reach.has(m.id)||!a.nodeId&&false;return `<line x1="${p.x}%" y1="${p.y}" x2="${q.x}%" y2="${q.y}" class="${walked?'walked':open?'open':''}"/>`;})).join('');
 const nodes=a.nodes.map(n=>{const t=NODE_TYPES[n.type],p=pos(n),state=n.id===a.nodeId?'current':visited.has(n.id)?'visited':reach.has(n.id)?'reachable':'';return `<button type="button" class="ascent-node ${n.type} ${state} ${selectedNode===n.id?'selected':''}" data-node="${n.id}" style="left:${p.x}%;top:${p.y}px;--node:${t.color}" ${reach.has(n.id)?'':'tabindex="-1"'} aria-label="${esc(t.name)}, floor ${n.floor+1}${reach.has(n.id)?', reachable':state?', '+state:''}"><span>${t.glyph}</span></button>`;}).join('');
 const legend=Object.entries(NODE_TYPES).map(([id,t])=>`<span style="--node:${t.color}"><i>${t.glyph}</i>${t.name}</span>`).join('');
 const sel=selectedNode&&reach.has(selectedNode)?ascentNode(g,selectedNode):null,info=sel?NODE_TYPES[sel.type]:null;
 return `${header(g,{title:a.nodeId?`Floor ${ascentNode(g).floor+1} cleared.`:'Choose your path.'})}
 <div class="ascent-map-wrap" id="ascent-map-wrap"><div class="ascent-map" style="height:${height}px"><svg class="ascent-lines" width="100%" height="${height}" aria-hidden="true">${lines}</svg>${nodes}<span class="ascent-floor-label" style="top:${height-PAD-ASCENT_FLOORS*ROW-34}px">GUARDIAN</span></div></div>
 <div class="ascent-node-info" aria-live="polite">${info?`<span class="ascent-info-glyph" style="--node:${info.color}">${info.glyph}</span><div><strong>${esc(info.name)} · floor ${sel.floor+1}</strong><p>${esc(info.description)}</p></div><button class="primary" id="ascent-enter">ENTER ${icon('arrow')}</button>`:'<p>Tap a glowing node to see what waits there. Paths only climb; choose your route carefully.</p>'}</div>
 <details class="ascent-legend"><summary>MAP LEGEND</summary><div>${legend}</div></details>
 <div class="ascent-actions"><button class="secondary" id="ascent-menu">PAUSE MENU</button></div>`;
}
function choiceCards(g,choices,renderChoice,{action='CLAIM'}={}){
 return `<div class="upgrades ascent-cards">${choices.map((choice,i)=>{const c=renderChoice(choice),rare=rarityFor(choice.kind==='bond'?bondPreview(g.p,choice).id:choice.id);return `<button class="upgrade ${choice.kind==='fusion'||choice.kind==='bond'?'fusion-choice':''}" data-claim="${i}" ${rare?`data-rarity="${rare.id}"`:''} style="--item:${c.color};${rare?'--rarity:'+rare.color:''}"><span class="upgrade-label">${esc(c.label)}</span>${rare?rarityBadge(choice.kind==='bond'?bondPreview(g.p,choice).id:choice.id):''}<span class="upgrade-art">${icon(c.id)}</span><small class="upgrade-origin">${esc(c.sub)}</small><strong>${esc(c.name)}</strong><p>${esc(c.text)}</p><b>${esc(action==='CLAIM'?c.action:action)} <span>${icon('arrow')}</span></b></button>`;}).join('')}</div>`;
}
function rewardView(g,renderChoice){
 const rw=g.ascent.rewards,choices=rw.picks[rw.index]||[];
 return `${header(g,{title:rw.title||'Zone cleared.'})}<p class="ascent-note">${rw.gold?`<b>+${rw.gold} gold</b> · `:''}Upgrade ${rw.index+1} of ${rw.picks.length}. No levels in the Ascent: these are how you grow.</p>${choiceCards(g,choices,renderChoice)}<div class="ascent-actions"><button class="secondary" id="ascent-skip">SKIP · +8 GOLD</button><button class="secondary" id="ascent-recipes">RECIPES</button></div>`;
}
function shopView(g,renderChoice){
 const a=g.ascent,s=a.shop,t=s.trinket&&trinketFor(s.trinket.id);
 const offers=s.offers.map((o,i)=>{const c=renderChoice(o.choice),rare=rarityFor(o.choice.kind==='bond'?bondPreview(g.p,o.choice).id:o.choice.id);return `<article class="ascent-offer ${o.sold?'sold':''}" style="--item:${c.color};--rarity:${rare?.color||'#999'}"><span class="item-art">${icon(c.id)}</span><div>${rare?rarityBadge(o.choice.kind==='bond'?bondPreview(g.p,o.choice).id:o.choice.id):''}<small>${esc(c.label)}</small><strong>${esc(c.name)}</strong><p>${esc(c.text)}</p></div><button data-buy="${i}" ${o.sold||a.gold<o.price?'disabled':''}>${o.sold?'SOLD':'◉ '+o.price}</button></article>`;}).join('')||'<p class="ascent-note">The merchant has nothing that fits your loadout.</p>';
 return `${header(g,{title:'The merchant’s wares.'})}<div class="ascent-shop">${offers}
 ${t?`<article class="ascent-offer ${s.trinket.sold?'sold':''}" style="--item:${t.color}"><span class="item-art">${trinketIcon(t.id)}</span><div><small>TRINKET · ${esc(t.series)}</small><strong>${esc(t.name)}</strong><p>Equip it or melt it into a trinket you carry.</p></div><button id="buy-trinket" ${s.trinket.sold||a.gold<s.trinket.price?'disabled':''}>${s.trinket.sold?'SOLD':'◉ '+s.trinket.price}</button></article>`:''}
 <article class="ascent-offer ${s.heal.sold?'sold':''}" style="--item:#eaa0ae"><span class="item-art">${icon('heal')}</span><div><small>SERVICE</small><strong>Field medic</strong><p>Restore 40% of your max HP.</p></div><button id="buy-heal" ${s.heal.sold||a.gold<s.heal.price||g.p.hp>=g.p.maxHp?'disabled':''}>${s.heal.sold?'SOLD':'◉ '+s.heal.price}</button></article></div>
 <div class="ascent-actions"><button class="secondary" id="shop-reroll" ${a.gold<s.reroll?'disabled':''}>RESTOCK · ◉ ${s.reroll}</button><button class="primary" id="ascent-leave">LEAVE THE SHOP</button></div>`;
}
function itemList(g,attr,steps){
 const own=ownedItems(g.p).filter(i=>i.level<i.max);
 return own.length?`<div class="ascent-train">${own.map(i=>`<button data-${attr}="${i.id}" style="--item:${ITEMS[i.id].color}">${icon(i.id)}<span><strong>${esc(ITEMS[i.id].name)}</strong><small>LV ${i.level} → ${Math.min(i.max,i.level+steps)} / ${i.max}</small></span></button>`).join('')}</div>`:'<p class="ascent-note">Every item you carry is already at max level.</p>';
}
function restView(g){
 return `${header(g,{title:'A quiet campfire.'})}<div class="ascent-choice-row"><button class="ascent-big" id="rest-heal"><span>♨</span><strong>REST</strong><small>Heal 40% of your max HP</small></button></div><h3 class="ascent-sub">OR TRAIN · +1 LEVEL TO ONE ITEM</h3>${itemList(g,'train',1)}`;
}
function forgeView(g){
 const a=g.ascent;
 return `${header(g,{title:'The soul forge burns.'})}<h3 class="ascent-sub">EMPOWER · +2 LEVELS TO ONE ITEM</h3>${itemList(g,'empower',2)}<div class="ascent-choice-row"><button class="ascent-big" id="forge-reforge" ${a.gold<FORGE_REFORGE_PRICE?'disabled':''}><span>⚒</span><strong>REFORGE · ◉ ${FORGE_REFORGE_PRICE}</strong><small>Melt gold into a choice of three upgrades</small></button></div><div class="ascent-actions"><button class="secondary" id="ascent-leave">LEAVE</button></div>`;
}
function shrineView(g){
 const ids=g.ascent.event?.pacts||[];
 return `${header(g,{title:'Swear a pact.'})}<p class="ascent-note">Each pact lasts for the rest of the climb. Its blessing and its curse are bound together.</p><div class="ascent-pacts-grid">${ids.map(id=>{const p=PACTS.find(x=>x.id===id);return `<button class="ascent-pact" data-pact="${id}"><strong>${esc(p.name)}</strong><span class="bless">✦ ${esc(p.blessing)}</span><span class="curse">✟ ${esc(p.curse)}</span></button>`;}).join('')}</div><div class="ascent-actions"><button class="secondary" id="ascent-leave">REFUSE ALL PACTS</button></div>`;
}
function altarView(g){
 const a=g.ascent,p=g.p;
 return `${header(g,{title:'The cursed altar hungers.'})}<div class="ascent-choice-row"><button class="ascent-big" data-altar="blood" ${p.hp<=p.maxHp*.3?'disabled':''}><span>♥</span><strong>OFFER BLOOD</strong><small>Lose 25% max HP · claim a max-level item</small></button><button class="ascent-big" data-altar="gold" ${a.gold<120?'disabled':''}><span>◉</span><strong>OFFER 120 GOLD</strong><small>A max-level item and one more upgrade</small></button></div><div class="ascent-actions"><button class="secondary" id="ascent-leave">WALK AWAY</button></div>`;
}
function eventView(g){
 const ev=eventFor(g);
 return `${header(g,{title:ev.title})}<p class="ascent-story">${esc(ev.text)}</p><div class="ascent-event-options">${ev.options.map(o=>`<button data-event="${o.id}" ${o.cost&&g.ascent.gold<o.cost?'disabled':''}>${esc(o.label)}${o.cost?` · ◉ ${o.cost}`:''}</button>`).join('')}</div>`;
}
function actClearView(g){
 const a=g.ascent,map=MAPS.find(m=>m.id===a.maps[a.act-1])||g.map;
 return `${header(g,{title:`Act ${a.act-1} conquered.`,eyebrow:'THE GUARDIAN HAS FALLEN'})}<p class="ascent-story">You rest and recover 35% of your health. The climb continues into <b>${esc(map.name)}</b>, where the enemies are stronger and the rewards richer.</p><div class="ascent-actions"><button class="primary" id="act-continue">BEGIN ACT ${a.act} ${icon('arrow')}</button></div>`;
}
export function showAscent(host,g,{renderChoice,onChange,onPause,onRecipes}){
 const a=g.ascent;if(!a)return;
 const screen=a.screen;
 const body=screen==='map'?mapView(g):screen==='reward'?rewardView(g,renderChoice):screen==='shop'?shopView(g,renderChoice):screen==='rest'?restView(g):screen==='forge'?forgeView(g):screen==='shrine'?shrineView(g):screen==='altar'?altarView(g):screen==='event'?eventView(g):screen==='actclear'?actClearView(g):'';
 host.innerHTML=`<div class="modal-backdrop ascent-backdrop"><section class="modal ascent-screen ascent-${screen}" role="dialog" aria-modal="true" aria-labelledby="ascent-title">${body}</section></div>`;
 const on=(sel,fn)=>host.querySelectorAll(sel).forEach(b=>b.onclick=()=>{if(fn(b)!==false)onChange();});
 on('[data-node]',b=>{const id=b.dataset.node;if(!reachableNodes(g).some(n=>n.id===id))return false;selectedNode=id;});
 on('#ascent-enter',()=>{const id=selectedNode;selectedNode=null;return enterNode(g,id);});
 on('[data-claim]',b=>claimReward(g,+b.dataset.claim));on('#ascent-skip',()=>skipReward(g));
 on('[data-buy]',b=>buyOffer(g,+b.dataset.buy));on('#buy-heal',()=>buyHeal(g));on('#buy-trinket',()=>buyTrinket(g));on('#shop-reroll',()=>rerollShop(g));
 on('#ascent-leave',()=>leaveScreen(g));on('#rest-heal',()=>restHeal(g));on('[data-train]',b=>restTrain(g,b.dataset.train));
 on('[data-empower]',b=>forgeEmpower(g,b.dataset.empower));on('#forge-reforge',()=>forgeReforge(g));
 on('[data-pact]',b=>swearPact(g,b.dataset.pact));on('[data-altar]',b=>altarOffer(g,b.dataset.altar));on('[data-event]',b=>resolveEvent(g,b.dataset.event));
 on('#act-continue',()=>continueAct(g));
 host.querySelector('#ascent-menu')?.addEventListener('click',onPause);host.querySelector('#ascent-recipes')?.addEventListener('click',onRecipes);
 // Keep the climb in view: scroll so the current floor sits low in the map window.
 const wrap=host.querySelector('#ascent-map-wrap');if(wrap){const here=host.querySelector('.ascent-node.selected,.ascent-node.reachable,.ascent-node.current');if(here)wrap.scrollTop=Math.max(0,here.offsetTop-wrap.clientHeight*.62);}
 (host.querySelector('#ascent-enter,[data-claim],#act-continue,.ascent-node.reachable,[data-event],#ascent-leave'))?.focus({preventScroll:true});
}
export function ascentHudText(g){const a=g.ascent;if(!a)return '';const node=ascentNode(g);return `ASCENT · ACT ${a.act} · FLOOR ${node?node.floor+1:0} · ${objectiveText(g)||NODE_TYPES[node?.type]?.name?.toUpperCase()||''} · ◉ ${a.gold}`;}
