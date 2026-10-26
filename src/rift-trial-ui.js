import {riftTrialText} from './rift-trials.js';
const escape=value=>String(value??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const COLORS={darknessdevil:'#dddccb',foundereren:'#d8d5aa',beerus:'#d9b1ef',walpurgisrift:'#d7b3d7',aizenrift:'#c7bbec',madararift:'#d4e1b7',sukunaheian:'#e5aa9d',borosrift:'#a9d9e0',deathdevil:'#dddccb'};
export function riftTrialHud(g){
 const q=g?.riftTrial;if(!q||g.status==='over')return '';
 const text=riftTrialText(g);if(!text)return '';
 const total=Number.isFinite(text.total)?Math.max(1,Math.min(9,Math.floor(text.total))):3,progress=Number.isFinite(text.progress)?Math.max(0,Math.min(total,Math.floor(text.progress))):0;
 return `<section class="rift-trial-objective" data-trial="${escape(q.kind)}" style="--trial:${COLORS[q.bossId]||COLORS.darknessdevil}" role="status" aria-live="polite" aria-atomic="true"><div class="trial-heading"><div><span>RIFT CHALLENGE · PHASE II</span><h2>${escape(text.name)}</h2></div><b aria-label="${progress} of ${total} completed">${progress}<small>/ ${total}</small></b></div><p>${escape(text.instruction)}</p><div class="trial-progress" aria-hidden="true">${Array.from({length:total},(_,i)=>`<i class="${i<progress?'done':''}"></i>`).join('')}</div><div class="trial-detail">${escape(text.detail)}<small>MOVE / DRAG · DASH TO EVADE</small></div></section>`;
}
