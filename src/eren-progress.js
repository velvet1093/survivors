// One progression track, presented as a different weapon in each form.
export function syncErenProgress(p){
 if(p.id!=='eren')return;
 const evolved=!!(p.fusions.odmblades||p.fusions.titanfists),rank=Math.min(5,Math.max(1,evolved?5:1,p.sharedFormRank||1,p.formWeapons?.odmblades||1,p.formWeapons?.titanfists||1,p.weapons.odmblades||1,p.weapons.titanfists||1));
 p.sharedFormRank=rank;p.formWeapons={odmblades:rank,titanfists:rank};p.erenForm=p.erenForm==='titan'?'titan':'human';p.form=p.erenForm==='titan'?1:0;p.weapon=p.form?'titanfists':'odmblades';
 delete p.weapons[p.form?'odmblades':'titanfists'];p.weapons[p.weapon]=rank;
 if(evolved){p.fusions.odmblades='scoutassault';p.fusions.titanfists='titanquake';}
}
