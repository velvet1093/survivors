export const BOSS_DAMAGE_REDUCTION=.2;
export const DIFFICULTIES=[
 {id:'easy',name:'Easy',description:'More room to learn enemy patterns.',hp:.75,damage:.75,speed:.9,attackRate:.85,projectileSpeed:.9,spawnRate:.85},
 {id:'normal',name:'Normal',description:'The standard survival challenge.',hp:1,damage:1,speed:1,attackRate:1,projectileSpeed:1,spawnRate:1},
 {id:'hard',name:'Hard',description:'Tougher enemies with faster attacks.',hp:1.35,damage:1.2,speed:1.1,attackRate:1.15,projectileSpeed:1.1,spawnRate:1.15},
 {id:'nightmare',name:'Nightmare',description:'Relentless pressure for mastered builds.',hp:1.8,damage:1.5,speed:1.18,attackRate:1.3,projectileSpeed:1.2,spawnRate:1.3},
];
export const difficultyFor=id=>DIFFICULTIES.find(d=>d.id===id)||DIFFICULTIES[1];
// Minute steps strengthen existing survivors as well as newly spawned enemies.
// From minute 5 the rift surges: every later minute stacks a steep extra multiplier.
export const SURGE_MINUTE=5;
export function riftSurge(minute){
 const late=Math.max(0,minute-SURGE_MINUTE+1);
 return {late,hp:1+.4*late+.05*late*late,damage:1+Math.min(1.5,.2*late),speed:1+Math.min(.3,.04*late),attackRate:1+Math.min(.6,.07*late),projectileSpeed:1+Math.min(.25,.03*late)};
}
export function enemyPressure(time,difficulty='normal',rushRound=0){
 const minute=Math.max(0,Math.floor(time/60)),d=difficultyFor(difficulty),round=Math.max(0,rushRound-1),surge=riftSurge(minute);
 return {minute,hp:(1+.18*minute+.018*minute*minute)*surge.hp*d.hp,damage:(1+.09*minute)*surge.damage*d.damage*(rushRound?1.25+Math.min(.75,round*.025):1),speed:(1+Math.min(.75,.035*minute))*surge.speed*d.speed*(rushRound?1.05+Math.min(.2,round*.008):1),attackRate:(1+Math.min(.8,.04*minute))*surge.attackRate*d.attackRate*(rushRound?1.15+Math.min(.45,round*.018):1),projectileSpeed:(1+Math.min(.55,.025*minute))*surge.projectileSpeed*d.projectileSpeed*(rushRound?1.08+Math.min(.2,round*.008):1)};
}
export const encounterPressure=g=>enemyPressure(g.time,g.difficulty,g.mode==='bossrush'?g.rush?.round||1:0);
export function strengthenEnemy(e,time,difficulty='normal',rushRound=0){
 if(e.hp<=0)return;
 const id=difficultyFor(difficulty).id,now=enemyPressure(time,id,rushRound),old=enemyPressure((e.pressureMinute??now.minute)*60,e.pressureDifficulty||'normal',e.pressureRushRound||0);
 if(now.minute>old.minute||id!==(e.pressureDifficulty||'normal')||rushRound!==(e.pressureRushRound||0)){const ratio=now.hp/old.hp;e.maxHp*=ratio;e.hp*=ratio;e.speed*=now.speed/old.speed;e.attackCD*=old.attackRate/now.attackRate;}
 e.pressureMinute=now.minute;e.pressureDifficulty=id;e.pressureRushRound=rushRound;e.damageScale=now.damage;
}
