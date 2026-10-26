import {DENJI_ULTIMATE,startDenjiUltimate,updateDenjiUltimate} from './denji.js';
import {GUTS_ULTIMATE,startGutsUltimate,updateGutsUltimate} from './guts.js';
import {updateGluttony} from './rimuru.js';
import {updateFrierenBarrage} from './frieren-barrage.js';
import {ERZA_ULTIMATE,startErzaUltimate,updateErzaUltimate} from './erza.js';
import {prepareYukiUltimate,updateYukiUltimate,YUKI_CHARGE_SECONDS,YUKI_ACTIVE_SECONDS} from './yuki-ultimate.js';
import {FEATHERINE_ULTIMATE,startFeatherineUltimate,updateFeatherineUltimate} from './featherine.js';
import {FRIEREN_GOLEM_DURATION,startFrierenGolem,updateFrierenGolem} from './frieren-golem.js';
import {crimsonStrike} from './diavolo.js';
import {toggleErenForm} from './eren.js';
import {nearbyCompanionTargets,recallCompanion,companionLeash} from './companion-ai.js';
import {summonMahoraga} from './summons.js';
import {applyStatus,clearStatuses,hasStatus} from './status.js';
import {damagePropsInRadius,moveBody} from './world.js';
const TAU=Math.PI*2;
export const ULTIMATE_COOLDOWN=60;
export const ultimateCooldown=p=>ULTIMATE_COOLDOWN*p.cooldown*(1-(p.meta.ultimateCooldown||0));
export const ULTIMATES={
 denji:DENJI_ULTIMATE,
 guts:GUTS_ULTIMATE,
 erza:ERZA_ULTIMATE,
 featherine:FEATHERINE_ULTIMATE,
 rimuru:{name:'Gluttony',duration:5,color:'#acddeb',description:'Become a slime and pull nearby enemies into a devouring field. Repeated damage executes weakened ordinary enemies below 20% HP. Absorb nearby hostile shots for essence and restore up to 30 HP by consuming enemies. Bosses resist the pull and cannot be executed.'},
 diavolo:{name:'King Crimson: Time Erasure',duration:5,color:'#e5a1b5',description:'Erase five seconds: become immune to damage and move 20% faster while enemies continue their actions. Automatic weapon casts pause. Time returns with a broad King Crimson finishing barrage at your new position.'},
 yuki:{name:'Maximum: Black Hole',duration:YUKI_CHARGE_SECONDS+YUKI_ACTIVE_SECONDS,color:'#efc49c',description:'Compress virtual mass for two seconds, then release a five-second black hole with a brilliant accretion rim. The fixed singularity pulls nearby enemies, crushes them repeatedly and consumes hostile shots before a final mass collapse. Bosses resist its pull. Immediately fills Star Rage.'},
 eren:{name:'Titan Shift',duration:1.15,color:'#c9d1a5',description:'Switch permanently between human and Attack Titan forms. Transforming into a Titan releases a close-range shockwave; switch back with the next ultimate.'},
 megumi:{name:'Eight-Handled Sword: Mahoraga',duration:10,color:'#d7dab9',description:'Summon one Mahoraga with its own HP. It remains until defeated, slashes nearby enemies and intercepts shots at the cost of HP. Each wheel adaptation strengthens its strikes and damage resistance, up to four stacks. Recasting fully heals the same living summon and keeps its adaptations. Each player level above 1 adds 3% maximum HP and 2.5% attack strength; leveling preserves its health percentage.'},
 frieren:{name:'Ancient Stone Golem',duration:FRIEREN_GOLEM_DURATION,color:'#e6c8a5',description:'Summon one ancient stone guardian with its own HP. It remains until defeated, hovers close to Frieren, crushes nearby enemies with heavy fists and channels a piercing violet mouth beam. Recasting fully heals the same living guardian. Each player level above 1 adds 3% maximum HP and 2.5% attack strength; leveling preserves its health percentage.'},
 samus:{name:'Power Bomb',duration:2.8,color:'#f0d290',description:'Curl into Morph Ball, charge for two seconds, then unleash a wide blast that damages enemies, stuns and destroys hostile shots.'},
 kurumi:{name:'City of Devouring Time',duration:7,color:'#e8b480',description:'Unfurl a fixed crimson clock domain that slows enemy movement, attacks and hostile shots. Three shadow doubles fire clock volleys; the final chime curses and stuns nearby enemies.'},
 esdeath:{name:'Mahapadma',duration:4.5,color:'#b8e4fa',description:'Stop enemies, hostile shots and danger-zone clocks in a fixed frozen domain, then shatter it with a final ice burst.'},
  shinji:{name:'Berserk Awakening',duration:6,color:'#b9e08b',description:'EVA-01 goes berserk: claw nearby enemies, deflect shots with an AT Field, fire stronger bursts and finish with a shockwave.'},
  maomao:{name:'Panacea Garden',duration:6,color:'#9bdfac',description:'Cultivate toxic blooms, recover health and resist 35% of incoming damage for six seconds.'},
  goku:{name:'Spirit Bomb',duration:2.4,color:'#97e7ff',description:'Gather ki overhead, throw a giant Spirit Bomb, and knock back everything in its blast.'},
  gojo:{name:'Unlimited Void',duration:5,color:'#c2acff',description:'Create a fixed domain that arrests nearby enemies. Its final collapse crushes everything inside.'},
  naruto:{name:'Shadow Clone Rush',duration:6,color:'#8ee8c6',description:'Summon six physical decoys that hunt enemies and strike them with Rasengan.'},
  madoka:{name:'Law of Cycles',duration:6,color:'#ffcee9',description:'Unfurl wings, purify hostile projectiles and rain homing light arrows while gathering XP.'},
};
export function startUltimate(g){
  if(g.status!=='playing'||g.bossIntro||g.riftTrial||g.special>0||g.ultimate||hasStatus(g.p,'stun')||hasStatus(g.p,'frozen'))return false;
  const p=g.p,def=ULTIMATES[p.id];g.special=ultimateCooldown(p);g.specialMax=g.special;g.ultimate={type:p.id,age:0,duration:def.duration+(p.meta.ultimateDuration||0),x:p.x,y:p.y,r:p.id==='gojo'?420:p.id==='esdeath'?480*(1+(p.meta.ultimateArea||0)):380*(1+(p.meta.ultimateArea||0)),tick:0,impacted:false};g.invuln=Math.max(g.invuln,.8);g.ultimateSerial++;g.toast='';g.toastTime=0;
  if(p.id==='denji'){startDenjiUltimate(g);}
  else if(p.id==='guts'){startGutsUltimate(g);}
  else if(p.id==='erza'){startErzaUltimate(g);}
  else if(p.id==='featherine'){startFeatherineUltimate(g);}
  else if(p.id==='rimuru'){p.pose='predator';clearStatuses(p);g.ultimate.r=235*p.area;g.ultimate.healed=0;}
  else if(p.id==='diavolo'){p.pose='erasure';clearStatuses(p);g.crimsonEchoes=[];g.ultimate.r=245*p.area;}
  else if(p.id==='yuki'){prepareYukiUltimate(g);}
  else if(p.id==='eren'){toggleErenForm(g);clearStatuses(p);p.pose='shift';g.ultimate.name=p.form?'ATTACK TITAN · TRANSFORM':'HUMAN · RETURN';g.effects.push({type:'nova',x:p.x,y:p.y,r:145,color:'#d9dfc2',life:.6,max:.6});}
  else if(p.id==='goku'){
    let target=null;for(const e of g.enemies)if(e.hp>0&&(!target||Math.hypot(e.x-p.x,e.y-p.y)<Math.hypot(target.x-p.x,target.y-p.y)))target=e;
    const dx=target?target.x-p.x:p.facing*250,dy=target?target.y-p.y:0,d=Math.hypot(dx,dy)||1,length=Math.min(380,Math.max(140,d));g.ultimate.tx=p.x+dx/d*length;g.ultimate.ty=p.y+dy/d*length;
  }else if(p.id==='megumi'){p.pose='summon';summonMahoraga(g);}
  else if(p.id==='frieren'){startFrierenGolem(g);}
  else if(p.id==='samus'){p.pose='bomb';clearStatuses(p);}
  else if(p.id==='kurumi'){p.pose='clock';g.ultimate.shadows=Array.from({length:3},(_,i)=>({id:-100-i,x:p.x+Math.cos(i*TAU/3-Math.PI/2)*95,y:p.y+Math.sin(i*TAU/3-Math.PI/2)*95,aimAngle:0,attackTimer:0}));}
  else if(p.id==='gojo'){g.freeze=g.ultimate.duration;g.voidRadius=420;}
  else if(p.id==='naruto'){
    g.clones=6+(p.meta.cloneCount||0);g.cloneUnits=Array.from({length:6+(p.meta.cloneCount||0)},(_,i)=>({id:-i-1,x:p.x+Math.cos(i*TAU/(6+(p.meta.cloneCount||0)))*35,y:p.y+Math.sin(i*TAU/(6+(p.meta.cloneCount||0)))*35,facing:1,moving:true,walk:i,attackCD:i*.09,attackTimer:0,life:6}));
  }else if(p.id==='esdeath'){p.pose='ice';clearStatuses(p);}
  else if(p.id==='shinji'){p.shield=p.maxShield;clearStatuses(p);p.pose='berserk';}
  else if(p.id==='maomao'){g.hazards=[];clearStatuses(p);p.pose='brew';}
  else{
    g.enemyShots=[];clearStatuses(p);p.hp=Math.min(p.maxHp,p.hp+30+(p.meta.ultimateHeal||0));p.shield=p.maxShield;
  }
  return true;
}
function knock(g,e,x,y,strength){let dx=e.x-x,dy=e.y-y;if(Math.hypot(dx,dy)<.001){dx=e.x-g.p.x;dy=e.y-g.p.y;if(Math.hypot(dx,dy)<.001){dx=Math.cos(e.id*2.399);dy=Math.sin(e.id*2.399);}}const d=Math.hypot(dx,dy)||1;e.kvx=(e.kvx||0)+dx/d*strength*(e.boss?.2:1);e.kvy=(e.kvy||0)+dy/d*strength*(e.boss?.2:1);}
export function updateUltimate(g,dt,{damage,burst,shoot}){
  const u=g.ultimate;if(!u||['yuki','frieren','frieren-barrage'].includes(u.type)&&(g.status!=='playing'||g.bossIntro))return;u.age+=dt;u.tick-=dt;const p=g.p;
  if(u.type==='denji'){updateDenjiUltimate(g,u,dt,{damage,burst});
  }else if(u.type==='guts'){updateGutsUltimate(g,u,dt,{damage,burst});
  }else if(u.type==='frieren-barrage'){updateFrierenBarrage(g,dt,{damage,burst});
  }else if(u.type==='erza'){updateErzaUltimate(g,u,dt,{damage,burst});
  }else if(u.type==='featherine'){updateFeatherineUltimate(g,u,dt,{damage,burst});
  }else if(u.type==='rimuru'){updateGluttony(g,dt,{damage,burst});
  }else if(u.type==='diavolo'){
    p.pose='erasure';if(u.age>=u.duration&&!u.impacted){u.impacted=true;crimsonStrike(g,{x:p.x,y:p.y,angle:p.aimAngle||0,reach:u.r,power:5*p.damage,arc:-1,ultimate:true},damage);burst(g,p.x,p.y,'#edb5c7',25,150);}
  }else if(u.type==='yuki'){
    updateYukiUltimate(g,dt,{damage,burst});
  }else if(u.type==='eren'){p.pose='shift';if(p.form&&!u.impacted){u.impacted=true;for(const e of g.enemies)if(e.hp>0&&Math.hypot(e.x-p.x,e.y-p.y)<170+e.r){damage(g,e,70*p.damage,'#ebd4ad');applyStatus(e,'stun',.5);knock(g,e,p.x,p.y,160);}damagePropsInRadius(g,p.x,p.y,170,70);burst(g,p.x,p.y,'#d8ddc6',24,85);}}
  else if(u.type==='goku'){
    p.pose=u.age<1.2?'gather':'throw';
    if(u.age<1.2&&u.tick<=0){const a=Math.random()*TAU;burst(g,u.x+Math.cos(a)*80,u.y-65+Math.sin(a)*40,'#a0e9ff',2,20);u.tick=.08;}
    if(u.age>=1.8&&!u.impacted){u.impacted=true;g.shake=11;g.effects.push({type:'spirit-impact',x:u.tx,y:u.ty,r:u.r,color:'#9deaff',life:1.1,max:1.1});
      for(const e of g.enemies)if(Math.hypot(e.x-u.tx,e.y-u.ty)<u.r+e.r){damage(g,e,340*p.damage,'#b8f1ff');knock(g,e,u.tx,u.ty,420);}
      damagePropsInRadius(g,u.tx,u.ty,u.r,300,240);burst(g,u.tx,u.ty,'#b5edff',90,380);
    }
  }else if(u.type==='megumi'){p.pose='summon';}
  else if(u.type==='frieren'){
    updateFrierenGolem(g,dt,{damage,burst});
  }else if(u.type==='samus'){
    p.pose=u.age<2?'bomb':'cannon';if(u.age>=2&&!u.impacted){u.impacted=true;g.effects.push({type:'powerbomb',x:u.x,y:u.y,r:u.r,color:'#f5db9a',life:.8,max:.8});for(const e of g.enemies)if(e.hp>0&&Math.hypot(e.x-u.x,e.y-u.y)<u.r+e.r){damage(g,e,480*p.damage,'#ffe8b0');applyStatus(e,'stun',1.2);knock(g,e,u.x,u.y,220);}g.enemyShots=g.enemyShots.filter(s=>Math.hypot(s.x-u.x,s.y-u.y)>u.r);damagePropsInRadius(g,u.x,u.y,u.r,400);burst(g,u.x,u.y,'#f6dda4',45,250);g.shake=5;}
  }else if(u.type==='gojo'){
    p.pose='domain';
    if(u.tick<=0){for(const e of g.enemies)if(e.hp>0&&Math.hypot(e.x-u.x,e.y-u.y)<u.r){applyStatus(e,'cursed',3);applyStatus(e,'stun',.55);damage(g,e,19*p.damage,'#ccb9ff');}u.tick=.5;}
    if(u.age>=u.duration-.35&&!u.impacted){u.impacted=true;g.shake=7;for(const e of g.enemies)if(Math.hypot(e.x-u.x,e.y-u.y)<u.r){damage(g,e,180*p.damage,'#efd9ff');knock(g,e,u.x,u.y,180);}damagePropsInRadius(g,u.x,u.y,u.r,180);g.effects.push({type:'void-collapse',x:u.x,y:u.y,r:u.r,color:'#d5bdff',life:.6,max:.6});}
  }else if(u.type==='naruto'){
    p.pose='seal';
    for(const clone of g.cloneUnits){clone.life-=dt;clone.attackCD-=dt;clone.attackTimer=Math.max(0,clone.attackTimer-dt);clone.walk+=dt*14;
      recallCompanion(g,clone,45);let target=null;for(const e of nearbyCompanionTargets(g))if(!target||Math.hypot(e.x-clone.x,e.y-clone.y)<Math.hypot(target.x-clone.x,target.y-clone.y))target=e;
      const i=Math.abs(clone.id)-1,a=i*TAU/g.cloneUnits.length+u.age*.4,tx=target?target.x:p.x+Math.cos(a)*Math.min(85,companionLeash(g)*.45),ty=target?target.y:p.y+Math.sin(a)*Math.min(85,companionLeash(g)*.45),dx=tx-clone.x,dy=ty-clone.y,d=Math.hypot(dx,dy)||1;
      clone.facing=dx<0?-1:1;clone.moving=d>20;
      if(d>20)moveBody(g,clone,dx/d*300*dt,dy/d*300*dt,7,{push:true});recallCompanion(g,clone,45);
      if(target&&d<target.r+38&&clone.attackCD<=0){damage(g,target,80*p.damage,'#8fe7ff');knock(g,target,clone.x,clone.y,180);clone.attackCD=.85;clone.attackTimer=.4;burst(g,target.x,target.y,'#9ae6ff',9,90);g.effects.push({type:'rasengan',x:target.x,y:target.y,r:35,color:'#95e4ff',life:.35,max:.35});damagePropsInRadius(g,target.x,target.y,38,40);}
    }
  }else if(u.type==='kurumi'){
    p.pose='clock';u.shadows.forEach((s,i)=>{s.id??=-100-i;});for(const shadow of u.shadows){recallCompanion(g,shadow,65);shadow.attackTimer=Math.max(0,shadow.attackTimer-dt);}
    if(u.tick<=0){const targets=nearbyCompanionTargets(g);for(const source of [p,...u.shadows]){const target=targets.reduce((best,e)=>!best||Math.hypot(e.x-source.x,e.y-source.y)<Math.hypot(best.x-source.x,best.y-source.y)?e:best,null);if(!target)continue;const a=Math.atan2(target.y-source.y+24,target.x-source.x);source.aimAngle=a;source.attackTimer=.3;for(const offset of [-.07,.07]){const q=shoot(g,'clockshot',source.x,source.y-24,a+offset,24*p.damage*(1+(p.meta.ultimateDamage||0)),5,true);q.whiteQueen=p.skin==='whitequeen';q.color=q.whiteQueen?'#dbe8f2':'#e8b480';q.markDuration=3*(1+(p.passives.timepiece||0)*.15);q.pierce=3;}}u.tick=.65;}
    if(u.age>=u.duration-.12&&!u.impacted){u.impacted=true;for(const e of g.enemies)if(e.hp>0&&Math.hypot(e.x-u.x,e.y-u.y)<u.r){damage(g,e,85*p.damage,'#edbf8b');applyStatus(e,'cursed',4);applyStatus(e,'stun',1);}g.effects.push({type:'clock-mark',x:u.x,y:u.y,r:u.r,whiteQueen:p.skin==='whitequeen',fused:true,color:p.skin==='whitequeen'?'#dbe8f2':'#e8b480',life:.7,max:.7});}
  }else if(u.type==='esdeath'){
    p.pose='ice';if(u.tick<=0){burst(g,u.x,u.y,'#bfe6f7',5,130);u.tick=.5;}
    if(u.age>=u.duration-.12&&!u.impacted){u.impacted=true;for(const e of g.enemies)if(e.hp>0&&Math.hypot(e.x-u.x,e.y-u.y)<u.r){damage(g,e,115*p.damage,'#d5effb');applyStatus(e,'frozen',.8);}damagePropsInRadius(g,u.x,u.y,u.r,110);g.effects.push({type:'frost-burst',x:u.x,y:u.y,r:u.r,color:'#cdeafa',life:.7,max:.7});}
  }else if(u.type==='shinji'){
    p.pose='berserk';g.enemyShots=g.enemyShots.filter(s=>Math.hypot(s.x-p.x,s.y-p.y)>90);
    if(u.tick<=0){let target=null;for(const e of g.enemies)if(e.hp>0&&Math.hypot(e.x-p.x,e.y-p.y)<190&&(!target||Math.hypot(e.x-p.x,e.y-p.y)<Math.hypot(target.x-p.x,target.y-p.y)))target=e;
      const a=target?Math.atan2(target.y-p.y,target.x-p.x):p.aimAngle||0;p.aimAngle=a;p.attackTimer=.35;
      for(const e of g.enemies)if(e.hp>0&&Math.hypot(e.x-p.x,e.y-p.y)<160){damage(g,e,52*p.damage,'#cbe8a0');knock(g,e,p.x,p.y,180);applyStatus(e,'bleeding',2,{power:5*p.damage,source:'eva-claw'});}
      damagePropsInRadius(g,p.x,p.y,160,45);g.effects.push({type:'eva-claw',x:p.x,y:p.y-15,angle:a,r:150,color:'#c9e6a1',life:.35,max:.35});u.tick=.7;
    }
    if(u.age>=u.duration-.15&&!u.impacted){u.impacted=true;for(const e of g.enemies)if(e.hp>0&&Math.hypot(e.x-p.x,e.y-p.y)<270){damage(g,e,130*p.damage,'#e8daa7');knock(g,e,p.x,p.y,300);}damagePropsInRadius(g,p.x,p.y,270,120);g.effects.push({type:'at-burst',x:p.x,y:p.y,r:270,color:'#efdda7',life:.6,max:.6});g.shake=6;}
  }else if(u.type==='maomao'){
    p.pose='brew';p.hp=Math.min(p.maxHp,p.hp+5*(p.healing||1)*dt);
    if(u.tick<=0){const targets=g.enemies.filter(e=>e.hp>0).sort((a,b)=>Math.hypot(a.x-p.x,a.y-p.y)-Math.hypot(b.x-p.x,b.y-p.y)).slice(0,3);if(!targets.length)targets.push(p);for(const e of targets){g.fields.push({id:++g.id,kind:'poison',x:e.x,y:e.y,life:3,max:3,r:65*p.area,damage:9*p.damage*(1+(p.meta.ultimateDamage||0)),poisonPower:8*p.damage*(1+(p.meta.ultimateDamage||0)),panacea:true,tick:0,age:0,color:'#b6e699'});burst(g,e.x,e.y,'#b8e8aa',8,45);}u.tick=.8;}
  }else{
    p.pose='ascend';g.enemyShots=g.enemyShots.filter(s=>Math.hypot(s.x-p.x,s.y-p.y)>500);
    for(const gem of g.gems)if(Math.hypot(gem.x-p.x,gem.y-p.y)<650)gem.attracted=true;
    if(u.tick<=0){const targets=g.enemies.filter(e=>e.hp>0).sort((a,b)=>Math.hypot(a.x-p.x,a.y-p.y)-Math.hypot(b.x-p.x,b.y-p.y));
      for(let i=0;i<Math.min(3,targets.length);i++){const target=targets[(Math.floor(u.age*8)+i)%targets.length],x=p.x+(Math.random()-.5)*360,y=p.y-210-Math.random()*90;const s=shoot(g,'rosebow',x,y,Math.atan2(target.y-y,target.x-x),48*p.damage*(1+(p.meta.ultimateDamage||0)),5,true);s.holy=true;s.pierce=1;s.life=2.8;}
      if(!targets.length)damagePropsInRadius(g,p.x,p.y,230,16);
      u.tick=.23;
    }
  }
  if(u.age>=u.duration){if(u.type==='guts'||u.type==='denji')p.form=0;for(const clone of g.cloneUnits)burst(g,clone.x,clone.y,'#d9e5df',9,65);g.cloneUnits=[];g.clones=0;p.pose='';g.ultimate=null;}
}
