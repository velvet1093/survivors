// Shifters retain their remaining HP when their human form gives way to a Titan.
export const TITAN_ENEMIES={
 smilingtitan:{name:'Smiling Titan',family:'aot',hp:3.6,speed:57,r:25,behavior:'smilingtitan',color:'#d9bd8c',attack:4.5,minWave:2,description:'A blonde, fixed-grin Titan inspired by Dina. Warns a broad grasp, then follows with a delayed biting mark. Keep moving after the first warning.'},
 beardedtitan:{name:'Bearded Titan',family:'aot',hp:4.8,speed:37,r:29,behavior:'beardedtitan',color:'#c4a488',attack:5.2,minWave:3,description:'A heavy, bearded giant with a rounded silhouette. Braces behind temporary armor before a wide warned devouring lane.'},
 crawlingtitan:{name:'Crawling Titan',family:'aot',hp:2.4,speed:100,r:21,behavior:'crawlingtitan',color:'#d3ab93',attack:4,minWave:2,description:'A low, long-limbed crawler. Its crawling gait turns into a warned pounce, followed by a landing slam.'},
 smalltitan:{name:'Small Abnormal Titan',family:'aot',hp:1.35,speed:127,r:15,behavior:'smalltitan',color:'#e0bc91',attack:3.9,description:'A compact, round-headed Titan that runs in short hops and marks two staggered ankle-grab circles.'},
 puretitan:{name:'Wandering Titan',family:'aot',hp:3.1,speed:45,r:25,behavior:'puretitan',color:'#d6b69a',attack:4.8,description:'A lumbering giant with a warned grabbing circle. Its long reach is dangerous, but its feet are slow.'},
 abnormal:{name:'Abnormal Titan',family:'aot',hp:2.3,speed:109,r:22,behavior:'abnormal',color:'#cea78f',attack:4.1,minWave:2,description:'Runs on an uneven gait before diving down a warned lane. Dodge sideways when it leans forward.'},
};
export const TITAN_BOSSES={
 annie:{name:'Annie Leonhart',title:'THE WARRIOR IN DISGUISE',family:'aot',hp:3200,speed:91,r:22,behavior:'annie',color:'#e7b5a7',shiftName:'Female Titan',shiftTitle:'CRYSTALLIZED MARTIAL FURY',shiftRadius:42,description:'Human Annie fights with cutting lanes and quick footwork. Below 50% HP she becomes the Female Titan, hardening her fists before sweeping kicks and a scream that calls Titans.'},
 reiner:{name:'Reiner Braun',title:'THE SHIELD OF MARLEY',family:'aot',hp:3800,speed:68,r:23,behavior:'reiner',color:'#dfc391',shiftName:'Armored Titan',shiftTitle:'BREAK THE ARMORED CHARGE',shiftRadius:46,description:'Reiner warns a shoulder rush and blade cross. Below 50% HP he becomes the Armored Titan: temporary hardened armor, broad charging lanes and staggered shockwaves.'},
 bertholdt:{name:'Bertholdt Hoover',title:'THE QUIET COLOSSUS',family:'aot',hp:4000,speed:58,r:22,behavior:'bertholdt',color:'#e29d8e',shiftName:'Colossal Titan',shiftTitle:'THE WALLS CANNOT HOLD',shiftRadius:53,description:'Bertholdt uses flares and timed strikes in human form. Below 50% HP he becomes the Colossal Titan, moving slowly while steam vents and delayed stomps close escape routes.'},
};
export function titanAttack(g,e,p,a,{fan,hazard,summon}){
 const circle=(x,y,r,label,status,delay=1,damage=22,duration=.4)=>hazard(g,{shape:'circle',x,y,r,label,status,delay,damage,duration,color:e.color});
 const lane=(angle,length,width,label,damage=22)=>hazard(g,{shape:'line',x:e.x,y:e.y,tx:e.x+Math.cos(angle)*length,ty:e.y+Math.sin(angle)*length,width,label,delay:.95,duration:.4,damage,color:e.color,status:'stun'});
 if(e.behavior==='smilingtitan'){circle(p.x,p.y,62,'SMILING GRASP','slow',1.15,20);circle(p.x+Math.cos(a)*45,p.y+Math.sin(a)*45,38,'DINA BITE','bleeding',1.6,23);e.windup=.8;return true;}
 if(e.behavior==='beardedtitan'){e.armorTime=1.6;lane(a,300,42,'DEVOURING MAW',25);e.windup=.95;return true;}
 if(e.behavior==='crawlingtitan'){e.windup=.8;e.dash=1.3;e.dashX=Math.cos(a);e.dashY=Math.sin(a);lane(a,310,21,'CRAWLING POUNCE',18);circle(p.x,p.y,45,'CRAWLER LANDING','stun',1.3,16);return true;}
 if(e.behavior==='smalltitan'){for(let i=0;i<2;i++)circle(p.x+(i?34:-24),p.y+(i?20:-12),25,'ANKLE GRAB','slow',.8+i*.25,11);return true;}
 if(e.behavior==='puretitan'){circle(p.x,p.y,53,'TITAN GRASP','slow',1.1,18);e.windup=.8;return true;}
 if(e.behavior==='abnormal'){e.windup=.8;e.dash=1.4;e.dashX=Math.cos(a);e.dashY=Math.sin(a);lane(a,380,28,'ABNORMAL DIVE',19);return true;}
 if(!TITAN_BOSSES[e.archetype])return false;
 if(!e.enraged){
  if(e.skill%2){lane(a,360,16,'WARRIOR STRIKE',18);e.windup=.65;}
  else if(e.archetype==='bertholdt'){for(let i=0;i<3;i++)circle(p.x+(i-1)*65,p.y,30,'SIGNAL FLARE','burning',1+i*.18,14);}
  else{fan(g,e,a,3,.22,205,'slash');lane(a+.65,260,13,'CROSS CUT',16);}return true;
 }
 if(e.archetype==='annie'){
  if(e.skill%3===1){e.armorTime=1.5;for(let i=-1;i<=1;i++)lane(a+i*.5,420,27,'HARDENED KICK',26);e.windup=.85;}
  else if(e.skill%3===2){for(let i=0;i<4;i++)circle(p.x+Math.cos(i*1.57)*75,p.y+Math.sin(i*1.57)*75,43,'CRYSTAL STRIKE','bleeding',1+i*.14,23);}
  else{circle(e.x,e.y,145,'TITAN SCREAM','slow',1.1,16);summon(g,e,e.skill%6===0?'smilingtitan':'puretitan',2);}
 }else if(e.archetype==='reiner'){
  if(e.skill%2){e.armorTime=2;e.windup=1;e.dash=1.8;e.dashX=Math.cos(a);e.dashY=Math.sin(a);lane(a,590,53,'ARMORED CHARGE',31);}
  else for(let i=0;i<3;i++)circle(p.x+(i-1)*88,p.y,59,'ARMOR SHOCKWAVE','stun',1+i*.25,24);
 }else{
  if(e.skill%2){for(let i=0;i<6;i++){const angle=i*Math.PI/3;circle(e.x+Math.cos(angle)*150,e.y+Math.sin(angle)*150,67,'SCALDING STEAM','burning',1.3+i*.12,21,2);}e.windup=1;}
  else for(let i=0;i<3;i++)circle(p.x+(i-1)*100,p.y,76,'COLOSSAL FOOTFALL','stun',1.3+i*.3,32);
 }return true;
}
