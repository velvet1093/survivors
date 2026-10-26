import {ITEMS,FUSIONS,MAX_SLOTS,fusionRequirement} from './game.js';
import {getRushDraftChoices,chooseRushDraft,rerollRushDraft,banRushDraft,rushFusionChoices,evolveRushWeapon,beginBossRush} from './boss-rush.js';
import {difficultyFor} from './difficulty.js';
import {icon} from './icons.js';
import {erzaWeaponAppearance} from './erza-equipment.js';

export function showBossRushSetup(host,g,{onUpdate,onExit,onBegin}){
 const render=()=>{
  const fusion=g.status==='rush-fusion',choices=fusion?rushFusionChoices(g):getRushDraftChoices(g),p=g.p;
  const equipped=type=>`<div class="rush-equipped-row"><span>${type==='weapons'?'ATK':'SUP'}</span>${Object.keys(p[type]).map(id=>{const evolved=p.fusions[id],f=FUSIONS.find(f=>f.id===evolved),look=id==='requip'?erzaWeaponAppearance(g):null;return `<span class="rush-equipped-item ${evolved?'evolved':''}" style="--item:${look?.color||f?.color||ITEMS[id].color}" title="${look?.name||f?.name||ITEMS[id].name}">${icon(look?.icon||evolved||id)}<small>${evolved?'✦':'MAX'}</small></span>`;}).join('')}${Array.from({length:Math.max(0,MAX_SLOTS-Object.keys(p[type]).length)},()=>'<span class="rush-equipped-item empty">+</span>').join('')}<b>${Object.keys(p[type]).length} / ${MAX_SLOTS}</b></div>`;
  const content=choices.map(choice=>{
   const id=typeof choice==='string'?choice:choice.id,f=fusion?FUSIONS.find(f=>f.id===id):null,item=f||ITEMS[id],look=(f?.weapon||id)==='requip'?erzaWeaponAppearance(g,{fused:!!f}):null;
   return `<button class="upgrade ${fusion?'fusion-choice':''}" data-rush-choice="${id}" style="--item:${fusion?item.color:look?.color||item.color}"><span class="upgrade-label">${fusion?'FUSION AWAKENING':item.type.toUpperCase()+' · MAX LEVEL '+item.max}</span><span class="upgrade-art">${icon(look?.icon||id)}</span><small class="upgrade-origin">${fusion?fusionRequirement(f):item.owner?item.owner.toUpperCase()+'’S SIGNATURE':item.type.toUpperCase()}</small><strong>${fusion?item.name:look?.name||item.name}</strong><p>${fusion?(f.description.split('→')[1]||f.description):(look?look.description+' ':'')+item.description}</p><b>${g.rush.vanishArmed?'BAN FROM DRAFT':fusion?'FUSE & EVOLVE':'CLAIM AT MAX LEVEL'} <span>${icon('arrow')}</span></b></button>`;
  }).join('');
  host.innerHTML=`<div class="modal-backdrop"><section class="modal upgrade-modal rush-draft-dialog" role="dialog" aria-modal="true" aria-label="${fusion?'Boss Rush fusion choice':'Boss Rush maxed upgrade'}"><span class="eyebrow">BOSS RUSH · ${difficultyFor(g.difficulty).name.toUpperCase()} · ${fusion?'BUILD COMPLETE':'LEVEL '+(p.level+1)}</span><h2>${fusion?'Awaken your build.':'Choose your next power.'}</h2><p>${fusion?'Fuse any ready weapon, or keep your maxed build. A fusion that frees a weapon or passive slot grants another max-level pick.':'Choose one random reward at maximum level. Keep leveling until all five weapon and five passive slots are filled.'}</p><div class="rush-equipped">${equipped('weapons')}${equipped('passives')}</div><div class="upgrades">${content||'<p class="rush-no-fusions">Your arsenal is ready. Enter the gauntlet.</p>'}</div>${fusion?'':`<div class="upgrade-controls"><button class="secondary" id="rush-reroll" ${p.rerollsLeft>0?'':'disabled'}>REROLL · ${p.rerollsLeft}</button><button class="secondary ${g.rush.vanishArmed?'armed':''}" id="rush-vanish" ${p.vanishesLeft>0?'':'disabled'}>${g.rush.vanishArmed?'CANCEL BAN':'BAN · '+p.vanishesLeft}</button></div>`}<small class="upgrade-hint">${g.rush.vanishArmed?'SELECT A REWARD TO BAN. YOUR LEVEL IS KEPT.':'WEAPONS LV 5 · PASSIVES LV 3 · '+g.rush.total+' BOSSES AWAIT'}</small><div class="rush-draft-actions"><button class="secondary" id="rush-exit">RETURN TO LOBBY</button>${fusion?`<button class="primary" id="rush-begin">BEGIN BOSS RUSH ${icon('arrow')}</button>`:''}</div></section></div>`;
  host.querySelectorAll('[data-rush-choice]').forEach(button=>button.onclick=()=>{
   const id=button.dataset.rushChoice;
   const changed=g.rush.vanishArmed?banRushDraft(g,id):fusion?evolveRushWeapon(g,id):chooseRushDraft(g,id);
   if(!changed)return;g.rush.vanishArmed=false;onUpdate();render();
  });
  host.querySelector('#rush-reroll')?.addEventListener('click',()=>{if(rerollRushDraft(g)){g.rush.vanishArmed=false;onUpdate();render();}});
  host.querySelector('#rush-vanish')?.addEventListener('click',()=>{g.rush.vanishArmed=!g.rush.vanishArmed;render();});
  host.querySelector('#rush-exit').onclick=onExit;
  host.querySelector('#rush-begin')?.addEventListener('click',()=>{if(beginBossRush(g))onBegin();});
 };
 render();host.querySelector('[data-rush-choice],#rush-begin')?.focus({preventScroll:true});
}
