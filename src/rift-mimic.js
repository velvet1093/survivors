// Kept apart from rift-encounters.js so the enemy table can load it without a cycle.
export const MIMIC_DEF={name:'Rift Mimic',family:'frieren',hp:75,speed:78,r:22,behavior:'mimic',color:'#e6ba77',attack:3.6,description:'A rare treasure chest impostor. It warns a biting lunge, then spits stolen coins. Defeat it to recover the original chest and all its promised rewards. A recovered chest cannot become a mimic again.'};
export function mimicAttack(g,e,p,a,{fan,hazard}){
 if(e.behavior!=='mimic')return false;
 if(e.skill%2){
  const length=280;
  hazard(g,{shape:'line',x:e.x,y:e.y,tx:e.x+Math.cos(a)*length,ty:e.y+Math.sin(a)*length,width:17,label:'MIMIC · HUNGRY LUNGE',delay:.85,duration:.35,damage:19,status:'bleeding',color:e.color,source:'mimic',sourceId:e.id,cancelWithSource:true});
  e.windup=.85;e.dash=1.25;e.dashX=Math.cos(a);e.dashY=Math.sin(a);
 }else{fan(g,e,a,5,.21,185,'gear');e.windup=.45;}
 return true;
}
