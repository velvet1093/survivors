import {syncErenProgress} from './eren-progress.js';
import {refreshStats} from './game.js';
export function toggleErenForm(g){
 const p=g.p;if(p.id!=='eren')return false;syncErenProgress(p);const previous=p.weapon;
 p.erenForm=p.erenForm==='titan'?'human':'titan';syncErenProgress(p);delete p.cooldowns[previous];p.cooldowns[p.weapon]=0;p.attackTimer=0;p.castKind='';
 refreshStats(p);if(p.form)p.shield=Math.min(p.maxShield,p.shield+45);p.erenRulesVersion=2;
 g.mechanic.stage=p.form;g.mechanic.value=p.form;g.toast=p.form?'ARMORED ATTACK TITAN · SHARED POWER':'HUMAN FORM · SHARED POWER';g.toastTime=3;return true;
}
