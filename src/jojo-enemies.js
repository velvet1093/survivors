export const JOJO_ENEMIES={
 stonevampire:{name:'Stone Mask Vampire',family:'jojo',hp:1.6,speed:83,r:17,behavior:'stonevampire',color:'#d6bea0',attack:4.1,description:'A vampiric thrall casts a narrow blood-drain volley. Only a direct hit repairs its health; dash through or sidestep the shots to deny healing.'},
 fleshbud:{name:'Flesh-Bud Thrall',family:'jojo',hp:1.25,speed:61,r:16,behavior:'fleshbud',color:'#cda3b6',attack:4.8,minWave:2,description:'DIO’s parasite twists a host into a puppet. Three tentacle marks form a staggered poison snare, leaving time to move between them.'},
 badcompany:{name:'Bad Company Soldier',family:'jojo',hp:.85,speed:64,r:13,behavior:'badcompany',color:'#a7be8c',attack:4.3,minWave:2,description:'A miniature military Stand that braces to fire a three-shot rifle fan, followed by a marked artillery impact. Its small body has lower health.'},
 highwaystar:{name:'Highway Star',family:'jojo',hp:1.7,speed:107,r:17,behavior:'highwaystar',color:'#d4a2c9',attack:4.5,minWave:3,description:'Pursues at high speed and sends two curving scent-drain shots. Their direct hits restore health; a warned footstep trail briefly slows its target.'},
 sheerheart:{name:'Sheer Heart Attack',family:'jojo',hp:2.5,speed:74,r:19,behavior:'sheerheart',color:'#8eb5cd',attack:4.9,minWave:4,description:'Killer Queen’s armored heat-seeking tank. It stops to charge a large explosion around its current position. Keep moving out of the warning circle; the blue shell briefly resists damage.'},
};
export const JOJO_BOSSES={
 dio:{name:'DIO',title:'THE WORLD',family:'jojo',hp:3050,speed:87,r:37,color:'#e7ca86',behavior:'dio',description:'The World suspends a lattice of knife lanes, then releases them after a 1.7-second warning. Escape the locked lanes before time resumes. MUDA rushes and Road Roller impacts follow; the second phase adds a crossed knife fan.'},
 kira:{name:'Yoshikage Kira',title:'KILLER QUEEN',family:'jojo',hp:2900,speed:70,r:36,color:'#d5a6cf',behavior:'kira',description:'Killer Queen turns marked locations into staggered bombs and sends out Sheer Heart Attack tanks. Bites the Dust remembers your previous bomb position and detonates there again: move away from both the old mark and the new warning.'},
 kars:{name:'Kars',title:'THE ULTIMATE LIFE FORM',family:'jojo',hp:3300,speed:91,r:39,color:'#ba9bda',behavior:'kars',description:'Brilliant Bone Blades warn a cutting rush. Razor feathers bend through the air; light-blade spokes leave gaps between them. Below half health he unfolds wings and summons vampire servants, adding a second ring of feather attacks.'},
};
export function jojoAttack(g,e,p,a,{fan,ring,hazard,summon}){
 const warn=data=>hazard(g,{...data,color:e.color,source:e.archetype,sourceId:e.id,cancelWithSource:true}),circle=(x,y,r,label,status='burning',delay=1.1,damage=15,duration=.35)=>warn({shape:'circle',x,y,r,label,status,delay,damage,duration}),line=(angle,length,width,label,delay=1,damage=20,status='bleeding')=>warn({shape:'line',x:e.x,y:e.y,tx:e.x+Math.cos(angle)*length,ty:e.y+Math.sin(angle)*length,width,label,delay,damage,status,duration:.32}),rush=(windup=.8)=>{e.windup=windup;e.dash=windup+.55;e.dashX=Math.cos(a);e.dashY=Math.sin(a);};
 switch(e.behavior){
 case 'stonevampire':{const start=g.enemyShots.length;fan(g,e,a,3,.16,185,'soul');for(const s of g.enemyShots.slice(start))s.leech=.65;break;}
 case 'fleshbud':for(let i=-1;i<=1;i++)circle(p.x+i*52,p.y+i*18,29,'FLESH BUD · TENDRIL','poison',1.1+Math.abs(i)*.16,9,.9);e.windup=.5;break;
 case 'badcompany':fan(g,e,a,3,.12,245,'ki');circle(p.x,p.y,42,'BAD COMPANY · ARTILLERY','burning',1.35,15);e.windup=.55;break;
 case 'highwaystar':{const start=g.enemyShots.length;fan(g,e,a,2,.4,150,'soul');for(const [i,s]of g.enemyShots.slice(start).entries()){s.leech=.45;s.turn=i?-.35:.35;}for(let i=0;i<3;i++)circle(e.x+(p.x-e.x)*(i+1)/3,e.y+(p.y-e.y)*(i+1)/3,22,'SCENT TRAIL','slow',.85+i*.15,6,.8);break;}
 case 'sheerheart':e.armorTime=1.4;e.windup=1.15;circle(e.x,e.y,112,'SHEER HEART ATTACK','burning',1.2,22,.45);break;
 case 'dio':
  if(e.skill%3===1){for(let i=-2;i<=2;i++){const offset=i*72,x=p.x+Math.cos(a+Math.PI/2)*offset,y=p.y+Math.sin(a+Math.PI/2)*offset;warn({shape:'line',x:x-Math.cos(a)*280,y:y-Math.sin(a)*280,tx:x+Math.cos(a)*280,ty:y+Math.sin(a)*280,width:10,delay:1.7+Math.abs(i)*.08,duration:.3,damage:25,status:'bleeding',label:'THE WORLD · STOPPED KNIVES'});}if(e.enraged)line(a+Math.PI/2,700,12,'TIME RESUMES · CROSS KNIVES',2.2,22);e.windup=1.45;}
  else if(e.skill%3===2){rush(.85);line(a,420,22,'MUDA · STAND RUSH',.85,24,'stun');fan(g,e,a,e.enraged?7:4,.18,220,'kunai');}
  else{circle(p.x,p.y,105,'ROAD ROLLER','stun',1.7,30);circle(p.x,p.y,155,'ROAD ROLLER · SHOCKWAVE','slow',2.25,16,.3);e.windup=1.3;}
  break;
 case 'kira':
  if(e.skill%3===1){e.bombMemory={x:p.x,y:p.y};for(let i=-1;i<=1;i++)circle(p.x+i*80,p.y+(i%2)*35,42,'KILLER QUEEN · FIRST BOMB','burning',1.3+Math.abs(i)*.25,23);e.windup=.7;}
  else if(e.skill%3===2){const alive=g.enemies.filter(s=>s.archetype==='sheerheart'&&s.hp>0&&s.ownerId===e.id).length;if(alive<3)summon(g,e,'sheerheart',Math.min(3-alive,e.enraged?2:1));fan(g,e,a,e.enraged?7:4,.28,165,'petal');circle(e.x,e.y,65,'KILLER QUEEN · TOUCH','burning',1.1,18);}
  else{const old=e.bombMemory||{x:p.x,y:p.y};circle(old.x,old.y,100,'BITES THE DUST · REMEMBERED BOMB','burning',1.65,28);circle(p.x,p.y,65,'BITES THE DUST · NEW FATE','cursed',2.15,23);if(e.enraged)for(const side of [-1,1])circle(old.x+side*130,old.y,45,'CHAIN DETONATION','burning',2.4,18);e.windup=1.2;}
  break;
 case 'kars':
  if(e.skill%3===1){rush(.9);line(a,510,19,'BRILLIANT BONE BLADES',.9,25);for(const side of [-1,1])line(a+side*.42,350,10,'LIGHT BLADE',1.3,17);}
  else if(e.skill%3===2){const start=g.enemyShots.length;fan(g,e,a,e.enraged?9:5,.21,205,'slash');for(const [i,s]of g.enemyShots.slice(start).entries())s.turn=i%2?.18:-.18;if(e.enraged)ring(g,e,12,g.time,155,'slash');}
  else{for(let i=0;i<8;i++)line(i*Math.PI/4+g.time*.1,430,12,'ULTIMATE LIFE · LIGHT SPOKE',1.4,21);if(e.enraged&&g.enemies.filter(s=>s.ownerId===e.id&&s.hp>0).length<6)summon(g,e,'stonevampire',2);e.armorTime=e.enraged?1.8:0;e.windup=1;}
  break;
 default:return false;
 }return true;
}
