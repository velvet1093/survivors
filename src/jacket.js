import {applyStatus,clearStatuses} from './status.js';
import {damagePropsInRadius,moveBody} from './world.js';
import {effectivePassiveRank} from './game.js';

// Jacket's kit. Uzi Spray fires tight bursts; Hotline Massacre fires two streams and hurls
// a hammer every fourth burst. Kills chain a Combo: each adds 10, the chain breaks after
// 2.5 seconds without a kill, and a full Combo unleashes six seconds of lethal frenzy.
// The Hotline Rampage ultimate dashes him from enemy to enemy with a hammer.
export const COMBO_WINDOW=2.5,FRENZY_SECONDS=6;
export const JACKET_ULTIMATE={name:'Hotline Rampage',duration:6,color:'#ff4a9a',description:'Pick up the hammer: for six seconds Jacket is untouchable and dashes to the nearest enemy every third of a second, smashing everything around it. Ordinary enemies below 35% HP die outright; bosses are stunned instead.'};
export function castUzi(g,target,{shoot,power,rank,fused,boost={},effect}){
 const p=g.p,y=p.y-24,aim=Math.atan2(target.y-y,target.x-p.x),n=2+Math.floor(rank/2)+(boost.projectiles||0)+(p.weapon==='uzi'?(p.meta.projectiles||0):0),streams=fused?[-.12,.12]:[0],knife=p.id==='jacket'&&p.skin==='biker';
 for(const offset of streams)for(let i=0;i<n;i++){const aa=aim+offset+(i-(n-1)/2)*.07,q=shoot(g,'uzi',p.x+Math.cos(aim)*14,y,aa,11*power,rank,fused);q.vx=Math.cos(aa)*640;q.vy=Math.sin(aa)*640;q.r=4;q.pierce=1+Math.floor(rank/3)+(fused?2:0);q.delay=i*.045;q.knife=knife;q.color=fused?'#ff6aaa':'#ffe08a';}
 p.burstCount=(p.burstCount||0)+1;
 if(fused&&p.burstCount%4===0){const q=shoot(g,'hammer',p.x,y,aim,48*power,rank,true);q.vx=Math.cos(aim)*420;q.vy=Math.sin(aim)*420;q.r=12;q.pierce=6;q.life=1.4;q.color='#d8dce8';}
 effect(g,'uzi-muzzle',{x:p.x+Math.cos(aim)*18,y:y+Math.sin(aim)*18,angle:aim,fused,knife,life:.12,max:.12});
}
// Combo: kills extend the chain; ten in a row starts the frenzy.
export function jacketKill(g,e){
 const m=g.mechanic;if(m?.id!=='jacket')return;
 m.timer=COMBO_WINDOW;m.chain=(m.chain||0)+1;if(m.active>0)return;
 m.value=Math.min(m.max,m.value+(e?.boss?40:e?.elite?20:10)*(1+effectivePassiveRank(g.p,'roostermask')*.1+(g.p.meta?.comboGain||0)));
 if(m.value>=m.max){m.value=0;m.active=FRENZY_SECONDS+(g.p.meta?.frenzyDuration||0);m.activeAge=0;m.serial=(m.serial||0)+1;g.toast='COMBO ×'+m.chain+' · LETHAL FRENZY';g.toastTime=3;g.effects.push({type:'combo-pop',x:g.p.x,y:g.p.y-70,chain:m.chain,life:1,max:1});}
}
export function updateCombo(g,dt){
 const m=g.mechanic;if(m?.id!=='jacket')return;m.timer=Math.max(0,(m.timer||0)-dt);
 if(m.timer<=0){m.chain=0;if(m.active<=0)m.value=Math.max(0,m.value-40*dt);}
}
export const comboDamage=g=>g.mechanic?.id==='jacket'&&g.mechanic.active>0?1.3:1;
export const comboMove=g=>g.mechanic?.id==='jacket'&&g.mechanic.active>0?1.15:1;
export function startRampage(g){const p=g.p;p.pose='rampage';clearStatuses(p);g.ultimate.tick=0;g.ultimate.r=280*p.area*(1+(p.meta.ultimateArea||0));}
export function updateRampage(g,u,dt,{damage,burst}){
 const p=g.p;p.pose='rampage';g.invuln=Math.max(g.invuln,.35);if(u.tick>0)return;u.tick=1/3;
 let target=null,best=u.r;for(const e of g.enemies){if(e.hp<=0)continue;const d=Math.hypot(e.x-p.x,e.y-p.y);if(d<best){best=d;target=e;}}
 if(target){const d=Math.hypot(target.x-p.x,target.y-p.y)||1,step=Math.max(0,d-18);moveBody(g,p,(target.x-p.x)/d*step,(target.y-p.y)/d*step);p.facing=target.x<p.x?-1:1;}
 const r=70*p.area;
 for(const e of g.enemies)if(e.hp>0&&Math.hypot(e.x-p.x,e.y-p.y)<r+e.r){if(!e.boss&&e.hp<=e.maxHp*.35)damage(g,e,e.hp*2,'#ff4a9a');else{damage(g,e,85*p.damage,'#ff8ab8');applyStatus(e,'stun',.45);}}
 damagePropsInRadius(g,p.x,p.y,r,85*p.damage);g.effects.push({type:'hammer-smash',x:p.x,y:p.y,r,life:.35,max:.35});burst(g,p.x,p.y,'#ff4a9a',10,90);g.shake=Math.max(g.shake||0,4);
}
