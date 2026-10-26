import {BOSSES} from './enemies.js';
import {enemyPixels} from './pixel-enemies.js';
import {pixelsSvg} from './pixel-characters.js';

// A rift is an explicit opt-in. Opening this panel never starts the encounter.
export function showRiftOffer(host,g,{onEnter,onLeave}={}){
 const portal=g.rifts?.portal;
 const id=portal?.bossId||portal?.archetype,boss=BOSSES[id];
 if(!boss){onLeave?.();return;}
 host.innerHTML=`<div class="modal-backdrop"><section class="modal rift-offer" role="dialog" aria-modal="true" aria-labelledby="rift-title" style="--rift-color:${boss.color}"><span class="eyebrow">ANOMALOUS RIFT / OPTIONAL CHALLENGE</span><div class="rift-offer-art"><span class="rift-offer-orbit"></span><svg viewBox="0 0 56 76" shape-rendering="crispEdges" aria-hidden="true">${pixelsSvg(enemyPixels(id))}</svg></div><small class="rift-danger">SUPERBOSS · EXTREME THREAT</small><h2 id="rift-title">${boss.name}</h2><p class="rift-offer-title">${boss.title}</p><p>${boss.description}</p><div class="rift-loot-preview"><span><b>5</b>CHEST REWARDS</span><span><b>900+</b>COINS</span><span><b>250+</b>RUN XP</span><span><b>35%</b>HP RECOVERY</span></div><p class="rift-offer-hint">Ready evolutions come first. Your normal encounter pauses while you face this boss; your build and health carry into the fight.</p><div class="rift-offer-actions"><button class="primary" id="enter-rift">ENTER THE RIFT</button><button class="secondary" id="leave-rift">LEAVE IT BE</button></div></section></div>`;
 host.querySelector('#enter-rift').onclick=()=>onEnter?.();
 const leave=host.querySelector('#leave-rift');leave.onclick=()=>onLeave?.();leave.focus({preventScroll:true});
 host.querySelector('.rift-offer').onkeydown=e=>{if(e.code==='Escape'){e.preventDefault();e.stopPropagation();onLeave?.();}};
}
