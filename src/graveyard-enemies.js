// Thriller Bark's undead share the existing fixed-warning combat rules.
// Saved cast marks drive their artwork; damage lives only in hazard records.
export const GRAVEYARD_ENEMIES={
 gravezombie:{name:'Gravebound Zombie',family:'onepiece',hp:1.45,speed:61,r:18,behavior:'gravezombie',color:'#aebba4',attack:4.1,contactStatus:'bleeding',description:'A stitched corpse from Thriller Bark. Its short, fixed Grave Grasp lane gives you time to step sideways before the hooked fingers close.'},
 coffincrawler:{name:'Coffin Crawler',family:'onepiece',hp:1.1,speed:103,r:17,behavior:'coffincrawler',color:'#b9aa99',attack:4.5,description:'A skeleton dragging its broken coffin. It braces before rushing toward a fixed landing mark; change course before the coffin crashes.'},
 lanternwisp:{name:'Lantern Wisp',family:'onepiece',hp:.85,speed:72,r:15,behavior:'lanternwisp',waterWalker:true,color:'#a4d9cb',attack:4.6,description:'A wandering grave lantern. Its Soul Flame marks your last position with a delayed cursed circle and never follows you after the warning.'},
 shadowstitch:{name:'Shadow-Stitched Brute',family:'onepiece',hp:2.2,speed:43,r:22,behavior:'shadowstitch',color:'#b8a4bf',attack:5,minWave:2,description:'A heavy corpse held together by stolen shadows. Two staggered Stitch Quake cuts cross the marked ground; step clear of both fixed lanes.'},
 hollowghost:{name:'Negative Hollow',family:'onepiece',hp:.9,speed:79,r:16,behavior:'hollowghost',waterWalker:true,color:'#d8d4df',attack:4.4,minWave:3,description:'A pale, grinning hollow from Perona’s ghost procession. It sends a spread of three slowing spirit shots, leaving room to sidestep the fan.'},
};
export const GRAVEYARD_BOSSES={
 ryuma:{name:'Samurai Ryuma',title:'THE SWORD GOD OF THE GRAVE',family:'onepiece',hp:3350,speed:76,r:35,behavior:'ryuma',color:'#c9d4c8',shiftName:'Ryuma · Brook’s Shadow',shiftTitle:'A DEAD SWORDSMAN REMEMBERS HIS BLADE',shiftRadius:38,description:'Flying Dragon Draw warns a long straight sword lane. Three-Verse Crescent sends three staggered parallel cuts with spaces between them. Grave of Swords forms an open-sided halo before a separately warned central thrust. Below half health the draw gains a perpendicular return, the crescent grows to five wider cuts and the grave seals expand. Every warning remains fixed.'},
 moriah:{name:'Gecko Moria',title:'MASTER OF STOLEN SHADOWS',family:'onepiece',hp:3800,speed:47,r:43,behavior:'moriah',color:'#b7a0d0',shiftName:'Gecko Moria · Shadow Asgard',shiftTitle:'A THOUSAND SHADOWS AWAKEN',shiftRadius:50,description:'Brick Bat Swarm opens a broken halo of shadow bats before a marked central bite. Doppelman Cross places two staggered fixed shadow cuts. Shadow Spear Procession raises three pillars along your last movement direction. Below half health the halo and pillars grow, a third Doppelman cut appears and five pillars join the procession. Follow the open side and leave each fixed warning before release.'},
};
const TAU=Math.PI*2;
const owns=id=>Object.hasOwn(GRAVEYARD_ENEMIES,id)||Object.hasOwn(GRAVEYARD_BOSSES,id);
export function updateGraveyardCast(e,dt,frozen=false){
 const u=e.graveyardAttack;if(!u||frozen||!Number.isFinite(dt)||dt<=0)return;
 u.age+=dt;if(u.age>=u.duration)e.graveyardAttack=null;
}
export function graveyardAttack(g,e,p,a,{fan,hazard}={}){
 if(!owns(e.archetype))return false;
 const boss=Object.hasOwn(GRAVEYARD_BOSSES,e.archetype),fierce=!!e.enraged,marks=[],color=e.color||'#c9d4c8';
 const mark=data=>{const h={age:0,color,source:e.archetype,sourceId:e.id,cancelWithSource:true,sourceClock:true,...data};marks.push(h);hazard?.(g,h);return h;};
 const circle=(x,y,r,label,delay,damage,status='cursed',duration=.4)=>mark({shape:'circle',x,y,r,label,delay,damage,status,duration});
 const line=(x,y,angle,length,width,label,delay,damage,status='bleeding',duration=.4)=>mark({shape:'line',x,y,tx:x+Math.cos(angle)*length,ty:y+Math.sin(angle)*length,width,label,delay,damage,status,duration});
 const centered=(x,y,angle,length,width,label,delay,damage,status='bleeding',duration=.4)=>line(x-Math.cos(angle)*length/2,y-Math.sin(angle)*length/2,angle,length,width,label,delay,damage,status,duration);
 const move=g.lastMove||{},escape=Math.hypot(move.x||0,move.y||0)>.1?Math.atan2(move.y,move.x):a+Math.PI/2;
 const u={version:1,style:'',age:0,duration:2.9,x:e.x,y:e.y,targetX:p.x,targetY:p.y,angle:a,facing:e.facing<0?-1:1,marks};e.graveyardAttack=u;e.moving=false;
 if(!boss){
  u.duration=1.9;
  if(e.archetype==='gravezombie'){u.style='gravegrasp';line(e.x,e.y,a,220,12,'GRAVEBOUND · GRAVE GRASP',.95,12);}
  else if(e.archetype==='coffincrawler'){u.style='coffinrush';circle(p.x,p.y,32,'COFFIN CRAWLER · FIXED LANDING',.95,13,'slow',.35);e.windup=.95;e.dash=1.5;e.dashX=Math.cos(a);e.dashY=Math.sin(a);}
  else if(e.archetype==='lanternwisp'){u.style='soulflame';circle(p.x,p.y,34,'LANTERN WISP · SOUL FLAME',1.1,11,'cursed',.6);}
  else if(e.archetype==='shadowstitch'){u.style='stitchquake';for(let i=0;i<2;i++)centered(p.x,p.y,a+(i?.65:-.65),270,12,'STITCH QUAKE · '+(i+1),1.1+i*.25,14,'slow',.35);}
  else{u.style='hollowfan';u.duration=1.15;fan?.(g,e,a,3,.26,155,'drain');}
  if(e.archetype!=='coffincrawler')e.windup=Math.max(e.windup||0,u.style==='hollowfan'?.5:u.duration-.15);
  e.attackCD=Math.max(e.attackCD||0,u.duration+.7);return true;
 }
 if(e.archetype==='ryuma'){
  if(e.skill%3===1){
   u.style='swordrush';u.duration=2.9;
   line(e.x,e.y,a,900,fierce?20:14,'RYUMA · FLYING DRAGON DRAW',1.25,27);
   if(fierce)centered(p.x,p.y,a+Math.PI/2,560,14,'RYUMA · RETURNING DRAGON',2.05,25);
  }else if(e.skill%3===2){
   u.style='crescent';u.duration=2.85;const count=fierce?5:3;
   for(let i=0;i<count;i++){const offset=(i-(count-1)/2)*100,x=p.x-Math.sin(a)*offset,y=p.y+Math.cos(a)*offset;centered(x,y,a,790,fierce?19:13,'RYUMA · THREE-VERSE CRESCENT',1.2+Math.abs(i-(count-1)/2)*.22,25);}
  }else{
   u.style='graveswords';u.duration=3.15;u.gapAngle=escape;u.radius=180;
   for(let i=2;i<7;i++){const angle=escape+i*TAU/8;circle(p.x+Math.cos(angle)*180,p.y+Math.sin(angle)*180,fierce?45:34,'RYUMA · GRAVE OF SWORDS',1.25+(i%2)*.2,23,'bleeding');}
   circle(p.x,p.y,fierce?94:72,'RYUMA · CENTRAL THRUST',2.35,29,'bleeding',.45);
  }
 }else{
  if(e.skill%3===1){
   u.style='shadowbats';u.duration=3;u.gapAngle=escape;u.radius=170;
   for(let i=2;i<7;i++){const angle=escape+i*TAU/8;circle(p.x+Math.cos(angle)*170,p.y+Math.sin(angle)*170,fierce?42:32,'MORIAH · BRICK BAT SWARM',1.15+(i%3)*.13,22,'slow');}
   circle(p.x,p.y,fierce?98:78,'MORIAH · SHADOW BITE',2.2,29,'cursed',.5);
  }else if(e.skill%3===2){
   u.style='shadowcross';u.duration=fierce?3.15:2.7;
   for(let i=0;i<(fierce?3:2);i++){const angle=a+[-.72,.72,Math.PI/2][i];centered(p.x,p.y,angle,780,fierce?24:18,'MORIAH · DOPPELMAN CROSS '+(i+1),1.25+i*.55,27,'cursed');}
  }else{
   u.style='shadowtower';const count=fierce?5:3;u.duration=1.25+(count-1)*.35+.75;u.angle=escape;u.points=[];
   for(let i=0;i<count;i++){const point={x:p.x+Math.cos(escape)*i*105,y:p.y+Math.sin(escape)*i*105,r:fierce?66:52,delay:1.25+i*.35};u.points.push(point);circle(point.x,point.y,point.r,'MORIAH · SHADOW SPEAR PROCESSION '+(i+1),point.delay,28,'cursed',.45);}
  }
 }
 e.windup=u.duration;e.attackCD=Math.max(e.attackCD||0,u.duration+.75);return true;
}
