import {queueBossIntro} from './boss-intro.js';
import {transformCell} from "./cell-phases.js";
export function transformBoss(g,e){
 if(e.boss&&e.archetype==='cell')return transformCell(g,e);
 if(!e.boss||e.enraged||e.hp<=0||e.hp>=e.maxHp*.5||(!e.shiftName&&e.archetype!=='motherbrain'))return false;
 const previousName=e.name;
 e.bossUltimate=null;e.motherBrainAttack=null;e.berserkAttack=null;e.graveyardAttack=null;e.ultimateCD=Math.max(e.ultimateCD||0,8);
 e.enraged=true;e.transformed=true;e.moving=false;e.attackAnim=0;e.dash=0;e.windup=0;e.armorTime=0;e.skill=0;e.attackCD=1.6;e.kvx=0;e.kvy=0;
 e.name=e.shiftName||'Mother Brain · Walking Form';e.title=e.shiftTitle||'THE GLASS HAS SHATTERED';e.r=e.shiftRadius||50;
 if(e.archetype==='motherbrain')e.title='THE BIOLOGICAL MOTHER OF TOURIAN';
 if(e.archetype==='bertholdt')e.speed*=.5;
 // Existing warnings from this boss fade with the old form, giving a fair restart.
 g.enemyShots=g.enemyShots.filter(s=>s.sourceId!==e.id);
 g.hazards=g.hazards.filter(h=>h.sourceId!==e.id);
 queueBossIntro(g,e,g.wave,{transformation:true,previousName:['ryuma','moriah'].includes(e.archetype)?previousName:e.archetype==='motherbrain'?'Tank destroyed':'Human form shattered'});
 g.toast=e.name.toUpperCase()+' · TRANSFORMED';g.toastTime=3;
 return true;
}
