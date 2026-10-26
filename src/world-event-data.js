import {GRAVEYARD_EVENTS,GRAVEYARD_EVENT_ENEMIES,GRAVEYARD_EVENT_BOSSES,graveyardEventAttack} from './graveyard-events.js';
// World events change the current battlefield. Their foes never enter the
// ordinary map pools or the finite Boss Rush roster.
const eclipseEnemies=['eclipseapostle','apostlehound','wingedapostle','eclipseheretic'];
const stormEnemies=['stormwraith','marine','pirate','cannonier'];
const frostEnemies=['frostwalker','frostbeast','icemage','imperial'];
export const WORLD_EVENTS=[
 {id:'eclipse',name:'The Eclipse',color:'#dc8d98',weather:'eclipse',bossId:'eclipsefemto',enemies:eclipseEnemies,enemyIds:eclipseEnemies,triggerId:'beherit',description:'A black sun stains the battlefield crimson. Apostles gather beneath the God Hand while Femto turns space into a trap. Defeat the event boss and its remaining apostles to end the Eclipse.'},
 {id:'storm',name:'Raigo Thunderstorm',color:'#e7cf8e',weather:'storm',bossId:'tempestlord',enemies:stormEnemies,enemyIds:stormEnemies,triggerId:'raigodrum',description:'Dark rainclouds roll over the battlefield. Storm Wraiths and raiders answer Enel’s thunder drums. Every lightning strike and Raigo impact has a fixed warning before it lands.'},
 {id:'blizzard',name:'Whiteout Blizzard',color:'#b2deef',weather:'blizzard',bossId:'frostregent',enemies:frostEnemies,enemyIds:frostEnemies,triggerId:'frostseal',description:'Snow and blue frost cover the battlefield. Frost Walkers and northern troops advance with Aokiji. Leave marked ice lanes and eruptions; defeating the admiral and his remaining troops clears the storm.'},
 ...GRAVEYARD_EVENTS,
];
export const EVENT_ENEMIES={
 ...GRAVEYARD_EVENT_ENEMIES,
 eclipseapostle:{name:'Eclipse Apostle',family:'berserk',eventOnly:true,eventId:'eclipse',hp:1.8,speed:77,r:19,behavior:'eclipseapostle',color:'#c89ea5',attack:4.2,contactStatus:'bleeding',description:'Event only: The Eclipse. A many-eyed Apostle marks a fixed claw impact, then fans cutting tendrils on its next attack.'},
 stormwraith:{name:'Storm Wraith',family:'onepiece',eventOnly:true,eventId:'storm',hp:1.1,speed:81,r:16,behavior:'stormwraith',waterWalker:true,color:'#e2d398',attack:4.4,description:'Event only: Raigo Thunderstorm. A charged raincloud marks your last position with a delayed lightning discharge.'},
 frostwalker:{name:'Frost Walker',family:'onepiece',eventOnly:true,eventId:'blizzard',hp:1.6,speed:58,r:18,behavior:'frostwalker',waterWalker:true,color:'#b6dbe8',attack:4.5,description:'Event only: Whiteout Blizzard. An ice-armored sentinel braces before a short frost lane that slows targets.'},
};
export const EVENT_BOSSES={
 ...GRAVEYARD_EVENT_BOSSES,
 eclipsefemto:{name:'Femto · Eclipse Incarnation',title:'THE GOD HAND BENEATH THE BLACK SUN',family:'berserk',eventOnly:true,eventId:'eclipse',hp:5400,speed:58,r:43,behavior:'eclipsefemto',waterWalker:true,color:'#d4a1bb',description:'Event only: The Eclipse. God Hand marks an open-sided halo before a central gravity well. Spatial Grasp places three fixed crossing cuts. Causality opens dark wing lanes before the original target collapses. Below half health the seals widen and the wings gain extra lanes. Defeat the incarnation and every remaining event Apostle to clear the Eclipse.'},
 tempestlord:{name:'Enel · Raigo',title:'THE THUNDER GOD OF THE STORM',family:'onepiece',eventOnly:true,eventId:'storm',hp:4900,speed:64,r:39,behavior:'tempestlord',waterWalker:true,color:'#e7d19b',description:'Event only: Raigo Thunderstorm. El Thor marks sequential lightning strikes, Raigo charges a huge fixed impact with four smaller satellites, and Drum Thunder fires staggered parallel lightning lanes. Below half health additional strikes and lanes join the storm. Rain itself causes no damage; escape the warned lightning.'},
 frostregent:{name:'Aokiji · Whiteout',title:'AN ADMIRAL AT ABSOLUTE ZERO',family:'onepiece',eventOnly:true,eventId:'blizzard',hp:5100,speed:49,r:41,behavior:'frostregent',color:'#b9deee',description:'Event only: Whiteout Blizzard. Ice Age freezes the admiral’s center and five outer seals with a wide escape opening. Ice Partisan sends parallel frost lanes, while Whiteout marks three staggered eruptions around the last target position. Below half health the seals and lanes expand and two more lances join Ice Partisan. Snow itself causes no damage.'},
};
const TAU=Math.PI*2;
export function updateWorldEventCast(e,dt,frozen=false){const u=e.worldEventAttack;if(!u||frozen)return;u.age+=dt;if(u.age>=u.duration)e.worldEventAttack=null;}
export function worldEventAttack(g,e,p,a,{fan,hazard}){
 if(graveyardEventAttack(g,e,p,a,{fan,hazard}))return true;
 if(!e.eventOnly)return false;
 const marks=[],color=e.color||'#d4b4cf',mark=data=>{const m={color,source:e.archetype,sourceId:e.id,cancelWithSource:true,...data};if(e.boss)m.sourceClock=true;marks.push(m);hazard(g,m);return m;};
 const circle=(x,y,r,label,delay,damage=22,status='cursed',duration=.4)=>mark({shape:'circle',x,y,r,label,delay,damage,status,duration});
 const line=(x,y,angle,length,width,label,delay,damage=23,status='cursed',duration=.35)=>mark({shape:'line',x,y,tx:x+Math.cos(angle)*length,ty:y+Math.sin(angle)*length,width,label,delay,damage,status,duration});
 if(!e.boss){
  if(e.archetype==='eclipseapostle'){e.windup=.65;if(e.skill%2)circle(p.x,p.y,36,'ECLIPSE · APOSTLE CLAW',1.1,13,'bleeding');else fan(g,e,a,3,.23,175,'slash');}
  else if(e.archetype==='stormwraith'){e.windup=.75;circle(p.x,p.y,31,'STORM · STATIC DISCHARGE',1.05,11,'stun');}
  else if(e.archetype==='frostwalker'){e.windup=.8;line(e.x,e.y,a,225,11,'WHITEOUT · FROST CUT',1.05,12,'slow');}
  return true;
 }
 const fierce=!!e.enraged,u={version:1,age:0,duration:2.9,angle:a,facing:e.facing<0?-1:1,x:e.x,y:e.y,targetX:p.x,targetY:p.y,marks};e.worldEventAttack=u;e.moving=false;
 if(e.archetype==='eclipsefemto'){
  if(e.skill%3===1){u.style='godhand';u.gapAngle=a+Math.PI/2;e.windup=2.6;
   const radius=fierce?185:165;
   for(let i=2;i<7;i++){const angle=u.gapAngle+i*TAU/8;circle(p.x+Math.cos(angle)*radius,p.y+Math.sin(angle)*radius,fierce?46:37,'ECLIPSE · GOD HAND SEAL',1.35,22,'slow');}
   circle(p.x,p.y,fierce?108:88,'ECLIPSE · GRAVITY WELL',2.15,30,'cursed',.5);
  }else if(e.skill%3===2){u.style='spatialgrasp';e.windup=2.6;
   for(let i=0;i<3;i++){const angle=a+[-.62,.62,0][i];line(p.x-Math.cos(angle)*430,p.y-Math.sin(angle)*430,angle,860,fierce?20:14,'ECLIPSE · SPATIAL GRASP',1.3+i*.35,26,'cursed');}
  }else{u.style='causality';e.windup=2.7;
   for(const offset of fierce?[-.55,-.24,.24,.55]:[-.38,.38])line(e.x,e.y,a+offset,870,fierce?20:16,'ECLIPSE · WINGS OF CAUSALITY',1.3,24,'cursed');
   circle(p.x,p.y,fierce?94:75,'ECLIPSE · FATED COLLAPSE',2.2,29,'cursed',.45);
  }
 }else if(e.archetype==='tempestlord'){
  if(e.skill%3===1){u.style='elthor';e.windup=2.75;u.duration=3.1;
   const n=fierce?5:3;
   for(let i=0;i<n;i++){const offset=(i-(n-1)/2)*91;circle(p.x-Math.sin(a)*offset,p.y+Math.cos(a)*offset,fierce?42:35,'EL THOR · LIGHTNING STRIKE',1.1+i*.25,23,'stun',.3);}
  }else if(e.skill%3===2){u.style='raigo';e.windup=3;u.duration=3.25;
   circle(p.x,p.y,fierce?151:124,'RAIGO · THUNDER SUN',2.1,34,'burning',.55);
   for(let i=0;i<4;i++){const angle=a+Math.PI/4+i*Math.PI/2;circle(p.x+Math.cos(angle)*210,p.y+Math.sin(angle)*210,fierce?44:35,'RAIGO · STORM SATELLITE',2.35,22,'stun',.35);}
  }else{u.style='drumthunder';e.windup=2.6;
   const n=fierce?5:3;
   for(let i=0;i<n;i++){const offset=(i-(n-1)/2)*84,x=p.x-Math.sin(a)*offset,y=p.y+Math.cos(a)*offset;line(x-Math.cos(a)*410,y-Math.sin(a)*410,a,820,fierce?15:12,'THUNDER DRUM · JUDGMENT LANE',1.2+Math.abs(i-(n-1)/2)*.2,24,'stun',.35);}
  }
 }else if(e.archetype==='frostregent'){
  if(e.skill%3===1){u.style='iceage';u.gapAngle=a+Math.PI/2;e.windup=2.5;
   circle(e.x,e.y,fierce?116:94,'ICE AGE · FROZEN CENTER',1.3,24,'frozen',.65);
   for(let i=2;i<7;i++){const angle=u.gapAngle+i*TAU/8;circle(e.x+Math.cos(angle)*190,e.y+Math.sin(angle)*190,fierce?46:37,'ICE AGE · BROKEN HALO',1.55,21,'slow',.5);}
  }else if(e.skill%3===2){u.style='partisan';e.windup=2.7;u.duration=3.05;
   const n=fierce?5:3;
   for(let i=0;i<n;i++){const offset=(i-(n-1)/2)*98,x=p.x-Math.sin(a)*offset,y=p.y+Math.cos(a)*offset;line(x-Math.cos(a)*390,y-Math.sin(a)*390,a,780,fierce?18:14,'ICE PARTISAN · FROST LANCE',1.2+i*.2,23,'frozen',.35);}
  }else{u.style='whiteout';e.windup=2.7;
   for(let i=0;i<3;i++){const offset=(i-1)*115;circle(p.x-Math.sin(a)*offset,p.y+Math.cos(a)*offset,fierce?78:61,'WHITEOUT · FROZEN ERUPTION',1.35+i*.35,25,'slow',.45);}
  }
 }
 e.attackCD=Math.max(e.attackCD,u.duration+.8);return true;
}
