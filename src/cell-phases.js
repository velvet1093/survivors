import {queueBossIntro} from './boss-intro.js';
export const CELL_STAGES=[
 {name:'Imperfect Cell',title:'THE HUNGRY BIO-ANDROID',r:34,speed:1},
 {name:'Semi-Perfect Cell',title:'POWER WITHOUT PERFECTION',r:43,speed:.85},
 {name:'Perfect Cell',title:'THE PERFECT LIFE FORM',r:37,speed:1.2},
];
// Overkill stops at the next transformation. Only the final body can die.
export function cellDamage(e,amount){if(e.archetype!=='cell'||(e.cellStage||0)>=2)return amount;const floor=e.maxHp*((e.cellStage||0)===0?2/3:1/3)-.01;return Math.max(0,Math.min(amount,e.hp-floor));}
export function transformCell(g,e){
 const stage=e.cellStage||0;if(e.hp<=0||stage>=2||e.hp>=e.maxHp*(stage===0?2/3:1/3))return false;
 const next=CELL_STAGES[stage+1],previousName=CELL_STAGES[stage].name;
 const speed=e.speed*next.speed/CELL_STAGES[stage].speed;Object.assign(e,next,{speed},{cellStage:stage+1,enraged:stage+1===2,transformed:true,bossUltimate:null,ultimateCD:8,moving:false,attackAnim:0,dash:0,windup:0,armorTime:0,skill:0,attackCD:1.6,kvx:0,kvy:0});
 g.enemyShots=g.enemyShots.filter(s=>s.sourceId!==e.id);g.hazards=g.hazards.filter(h=>h.sourceId!==e.id);
 queueBossIntro(g,e,g.wave,{transformation:true,previousName});g.toast=next.name.toUpperCase();g.toastTime=3;return true;
}
