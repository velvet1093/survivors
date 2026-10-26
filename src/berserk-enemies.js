// The Eclipse's threats use the same fixed ground warnings and source clocks
// as other bosses. No attack follows the player after its warning is placed.
export const BERSERK_ENEMIES={
 possessedknight:{name:'Possessed Knight',family:'berserk',hp:1.55,speed:69,r:18,behavior:'possessedknight',color:'#b9aba6',attack:4.1,description:'A ruined armored soldier who braces before a short, bleeding sword lane.'},
 eclipseheretic:{name:'Eclipse Heretic',family:'berserk',hp:1.2,speed:48,r:16,behavior:'eclipseheretic',color:'#c0a3bb',attack:4.6,description:'A hooded worshipper who marks your last position with a delayed cursed seal. Leave the fixed mark before it opens.'},
 apostlehound:{name:'Apostle Hound',family:'berserk',hp:1.25,speed:102,r:17,behavior:'apostlehound',color:'#c4a48f',attack:4.3,contactStatus:'bleeding',description:'A low, many-toothed beast. A fixed landing mark warns its forward pounce.'},
 wingedapostle:{name:'Winged Apostle',family:'berserk',hp:1,speed:83,r:16,behavior:'wingedapostle',waterWalker:true,color:'#b5a3cd',attack:4.5,minWave:2,description:'A leathery-winged fiend that crosses dark water and casts three cutting feathers.'},
};
export const BERSERK_BOSSES={
 zodd:{name:'Nosferatu Zodd',title:'THE IMMORTAL',family:'berserk',hp:3400,speed:72,r:36,behavior:'zodd',color:'#c9aa91',shiftName:'Zodd · Apostle Form',shiftTitle:'THE IMMORTAL UNFURLS HIS WINGS',shiftRadius:47,description:'Horn Rush commits to a fixed charging lane, Greatsword Cleave cuts the last target position, and Wingquake leaves a broken ring of impacts. Below half health Zodd becomes a horned, winged Apostle with wider rushes, crossed claw cuts and stronger quakes.'},
 grunbeld:{name:'Grunbeld',title:'THE FLAME DRAGON KNIGHT',family:'berserk',hp:3900,speed:43,r:40,behavior:'grunbeld',color:'#d8a580',shiftName:'Grunbeld · Crystal Dragon',shiftTitle:'THE CORUNDUM DRAGON AWAKENS',shiftRadius:52,description:'Charges a fixed Dragon Breath, raises staggered Crystal Lances, and braces behind a temporarily armored Crystal Bastion. Below half health his corundum dragon body gains forked fire breath, an extra lance lane and more crystal eruptions.'},
 femto:{name:'Femto',title:'THE WINGS OF DARKNESS',family:'berserk',hp:3650,speed:61,r:37,behavior:'femto',waterWalker:true,color:'#b5a0cf',shiftName:'Femto · Wings of Darkness',shiftTitle:'THE FIFTH HAND OF GOD',shiftRadius:43,description:'Gravity Well traps a fixed center behind an open-sided halo; Spatial Rend cuts three staggered lanes. Wings of Darkness fires flanking feather lanes before the original target detonates. Below half health the gravity seals expand, the cuts widen, and the wings spread farther. Every warning stays fixed.'},
};
const TAU=Math.PI*2;
export function updateBerserkCast(e,dt,frozen=false){
 const u=e.berserkAttack;if(!u||frozen)return;
 u.age+=dt;if(u.age>=u.duration)e.berserkAttack=null;
}
export function berserkAttack(g,e,p,a,{fan,hazard}){
 if(e.family!=='berserk')return false;
 const fierce=!!e.enraged,marks=[],color=e.color||'#d0a38e';
 const mark=data=>{const m={color,source:e.archetype,sourceId:e.id,cancelWithSource:true,...data};if(e.boss)m.sourceClock=true;marks.push(m);hazard(g,m);return m;};
 const line=(x,y,angle,length,width,label,delay,damage=23,duration=.35,status='bleeding')=>mark({shape:'line',x,y,tx:x+Math.cos(angle)*length,ty:y+Math.sin(angle)*length,width,label,delay,damage,duration,status});
 const circle=(x,y,r,label,delay,damage=23,duration=.4,status='cursed')=>mark({shape:'circle',x,y,r,label,delay,damage,duration,status});
 if(!e.boss){
  if(e.archetype==='possessedknight'){e.windup=.65;line(e.x,e.y,a,235,11,'POSSESSED BLADE',.65,13,.25);}
  else if(e.archetype==='eclipseheretic'){e.windup=.6;circle(p.x,p.y,34,'SACRIFICIAL SEAL',.95,11,.65);}
  else if(e.archetype==='apostlehound'){e.windup=.55;e.dash=1.1;e.dashX=Math.cos(a);e.dashY=Math.sin(a);circle(p.x,p.y,31,'APOSTLE POUNCE',.75,13,.3,'bleeding');}
  else if(e.archetype==='wingedapostle')fan(g,e,a,3,.26,160,'slash');
  return true;
 }
 const u={version:1,age:0,duration:2.4,angle:a,facing:e.facing<0?-1:1,x:e.x,y:e.y,targetX:p.x,targetY:p.y,marks};
 e.berserkAttack=u;e.moving=false;
 if(e.archetype==='zodd'){
  if(e.skill%3===1){
   u.style='hornrush';u.duration=2.0;e.windup=1.1;e.dash=1.8;e.dashX=Math.cos(a);e.dashY=Math.sin(a);
   line(e.x,e.y,a,fierce?570:460,fierce?31:23,'ZODD · HORN RUSH',1.1,25,.5);
  }else if(e.skill%3===2){
   u.style='cleave';e.windup=fierce?1.8:1.5;
   for(const [i,angle]of (fierce?[a+.75,a-.75]:[a+Math.PI/2]).entries())line(p.x-Math.cos(angle)*160,p.y-Math.sin(angle)*160,angle,320,fierce?22:18,fierce?'ZODD · CROSSING CLAWS':'ZODD · GREATSWORD CLEAVE',1.15+i*.35,24,.3);
  }else{
   u.style='wingquake';e.windup=1.8;u.gapAngle=a+Math.PI/2;
   circle(e.x,e.y,fierce?112:92,'ZODD · WINGQUAKE',1.3,25,.4,'stun');
   for(let i=2;i<7;i++){const angle=u.gapAngle+i*TAU/8;circle(e.x+Math.cos(angle)*180,e.y+Math.sin(angle)*180,fierce?43:34,'WINGQUAKE · BROKEN HALO',1.5+(i%2)*.2,20,.35,'stun');}
  }
 }else if(e.archetype==='grunbeld'){
  if(e.skill%3===1){
   u.style='dragonbreath';e.windup=fierce?2.6:2.1;u.duration=fierce?2.8:2.4;
   line(e.x,e.y,a,900,fierce?28:20,'GRUNBELD · DRAGON BREATH',1.45,27,.6,'burning');
   if(fierce)for(const side of [-1,1])line(e.x,e.y,a+side*.43,760,13,'DRAGON BREATH · FIRE FORK',2.0,22,.4,'burning');
  }else if(e.skill%3===2){
   u.style='lances';e.windup=2.0;
   const n=fierce?4:3;
   for(let i=0;i<n;i++){const offset=(i-(n-1)/2)*94,x=p.x-Math.sin(a)*offset,y=p.y+Math.cos(a)*offset;line(x-Math.cos(a)*350,y-Math.sin(a)*350,a,700,fierce?15:12,'GRUNBELD · CRYSTAL LANCE',1.15+i*.22,23,.3);}
  }else{
   u.style='bastion';e.armorTime=1.35;e.windup=2.2;u.duration=2.8;
   const n=fierce?5:3;
   for(let i=0;i<n;i++){const angle=a+i*TAU/n,d=i===0?0:125;circle(p.x+Math.cos(angle)*d,p.y+Math.sin(angle)*d,fierce?44:39,'GRUNBELD · CRYSTAL BASTION',1.25+i*.23,24,.35,'stun');}
  }
 }else if(e.archetype==='femto'){
  if(e.skill%3===1){
   u.style='gravity';e.windup=2.3;u.duration=2.7;u.gapAngle=a+Math.PI/2;
   const radius=fierce?170:150;
   for(let i=2;i<7;i++){const angle=u.gapAngle+i*TAU/8;circle(p.x+Math.cos(angle)*radius,p.y+Math.sin(angle)*radius,fierce?42:34,'FEMTO · GRAVITY HALO',1.3,20,.4,'slow');}
   circle(p.x,p.y,fierce?103:83,'FEMTO · GRAVITY WELL',2.05,28,.45,'slow');
  }else if(e.skill%3===2){
   u.style='spatialrend';e.windup=2.3;u.duration=2.7;
   for(let i=0;i<3;i++){const angle=a+[-.65,.65,0][i];line(p.x-Math.cos(angle)*380,p.y-Math.sin(angle)*380,angle,760,fierce?18:12,'FEMTO · SPATIAL REND',1.25+i*.3,25,.25,'cursed');}
  }else{
   u.style='darkwings';e.windup=2.25;u.duration=2.65;
   for(const side of [-1,1])line(e.x,e.y,a+side*(fierce?.42:.32),850,fierce?21:16,'FEMTO · WINGS OF DARKNESS',1.25,23,.35,'cursed');
   circle(p.x,p.y,fierce?88:68,'WINGS OF DARKNESS · COLLAPSE',2.0,27,.35,'cursed');
  }
 }
 e.attackCD=Math.max(e.attackCD,u.duration+.75);
 return true;
}
