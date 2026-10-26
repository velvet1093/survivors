export const CANNON_STAGES=[{name:'Power Beam',kills:0,icon:'powerbeam',color:'#f3ca82'},{name:'Wave Beam',kills:100,icon:'wavebeam',color:'#c1a8ef'},{name:'Ice Wave Beam',kills:200,icon:'icewavebeam',color:'#b6edff'},{name:'Plasma Ice Beam',kills:300,icon:'plasmaicebeam',color:'#a8efd1'}];
export const cannonStage=g=>CANNON_STAGES.findLastIndex(s=>g.kills>=s.kills);
export function cannonPayload(g,random=Math.random){
 if(g.p.id!=='samus')return null;const m=g.mechanic;m.cannonShots=(m.cannonShots||0)+1;m.missileIn??=4+Math.floor(random()*5);if(--m.missileIn>0)return null;m.missileIn=4+Math.floor(random()*5);return random()<.25?'supermissile':'missile';
}

export function cannonAppearance(g){const stage=CANNON_STAGES[cannonStage(g)];return{icon:stage.icon,name:stage.name,color:stage.color};}
// Evolution counts all defeated enemies in this run, independently of shot charge.
export function cannonProgress(g){const total=Math.max(0,Math.floor(g.kills||0)),stage=cannonStage(g),current=CANNON_STAGES[stage],next=CANNON_STAGES[stage+1];return{total,stage,progress:next?total-current.kills:100,needed:100,next:next?.name||null,threshold:next?.kills||null,ratio:next?(total-current.kills)/100:1};}
