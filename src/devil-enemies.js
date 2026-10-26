// Chainsaw Man contracts have fixed attack marks. The cast record supplies the
// art with the same saved positions and clock used by collision warnings.
export const DEVIL_ENEMIES={
 zombiedevil:{name:'Zombie Devil Thrall',family:'chainsawman',hp:1.5,speed:62,r:18,behavior:'zombiedevil',color:'#b8b59b',attack:4.2,contactStatus:'bleeding',description:'A corpse bound by the Zombie Devil. Its hooked hands mark a delayed, bleeding grasp at your last position.'},
 leechfiend:{name:'Leech Devil Brood',family:'chainsawman',hp:1.8,speed:54,r:19,behavior:'leechfiend',color:'#c9a4a0',attack:4.6,minWave:2,description:'A crawling brood of the Leech Devil. A fixed tongue lane gives you a full second to step aside before it slows and wounds you.'},
 batspawn:{name:'Bat Devil Spawn',family:'chainsawman',hp:.95,speed:91,r:14,behavior:'batspawn',waterWalker:true,color:'#b1abc8',attack:4.1,minWave:2,description:'A winged devil fragment that crosses water and sends a warned pair of sonic impacts across your last position.'},
 eternityflesh:{name:'Eternity Flesh',family:'chainsawman',hp:2.3,speed:36,r:22,behavior:'eternityflesh',color:'#c8a6b6',attack:5,minWave:3,description:'A slow mass torn from the Eternity Devil. Two delayed flesh seals curse the ground; their positions never follow you after the warning.'},
};
export const DEVIL_BOSSES={
 katanaman:{name:'Katana Man',title:'THE SWORD HYBRID',family:'chainsawman',hp:2950,speed:88,r:35,behavior:'katanaman',color:'#b9c5ce',description:'A sword hybrid with three fixed, warned draws: Iai Cut, Crossing Steel and Sheathed Edge. Step sideways from the long cuts or between the parallel lanes. Below half health a second Iai blade and additional edge lanes join his faster rotation.'},
 batdevil:{name:'Bat Devil',title:'A THIRST FOR HUMAN BLOOD',family:'chainsawman',hp:3200,speed:58,r:45,behavior:'batdevil',waterWalker:true,color:'#c4b0c4',description:'Sonic Roar forms a broken ring with a broad escape opening before a central pressure blast. Blood Lance marks parallel sonic lanes, and Wing Crush drops three fixed impacts in sequence. Below half health the roar and impacts widen and the lance gains two lanes.'},
 eternitydevil:{name:'Eternity Devil',title:'THE EIGHTH FLOOR NEVER ENDS',family:'chainsawman',hp:3600,speed:37,r:48,behavior:'eternitydevil',color:'#c8a1b5',description:'Endless Hall warns staggered parallel flesh corridors. Flesh Labyrinth forms five outer mouths with a clear escape side. Clock Collapse closes three fixed flesh seals in sequence. Below half health the corridors gain two lanes and the flesh marks grow, while the labyrinth retains its open side.'},
};
const bosses=new Set(Object.keys(DEVIL_BOSSES)),minions=new Set(Object.keys(DEVIL_ENEMIES)),TAU=Math.PI*2;
export function updateDevilCast(e,dt,frozen=false){const u=e.devilAttack;if(!u||frozen)return;u.age+=dt;if(u.age>=u.duration)e.devilAttack=null;}
export function devilAttack(g,e,p,a,{hazard}){
 if(!bosses.has(e.archetype)&&!minions.has(e.archetype))return false;
 const marks=[],mark=data=>{const m={color:e.color,source:e.archetype,sourceId:e.id,cancelWithSource:true,...data};if(e.boss)m.sourceClock=true;marks.push(m);hazard(g,m);return m;};
 const circle=(x,y,r,label,delay,damage,status='bleeding',duration=.4)=>mark({shape:'circle',x,y,r,label,delay,damage,status,duration});
 const line=(x,y,angle,length,width,label,delay,damage,status='bleeding',duration=.35)=>mark({shape:'line',x,y,tx:x+Math.cos(angle)*length,ty:y+Math.sin(angle)*length,width,label,delay,damage,status,duration});
 if(!e.boss){
  e.windup=.8;
  if(e.archetype==='zombiedevil')circle(p.x,p.y,36,'ZOMBIE DEVIL · HOOKED GRASP',1.05,12);
  else if(e.archetype==='leechfiend')line(e.x,e.y,a,285,13,'LEECH DEVIL · TONGUE LASH',1.1,13,'slow');
  else if(e.archetype==='batspawn')for(const side of [-1,1])circle(p.x-Math.sin(a)*side*44,p.y+Math.cos(a)*side*44,28,'BAT SPAWN · SONIC PULSE',1.05+(side>0?.2:0),10,'slow',.3);
  else for(const side of [-1,1])circle(p.x-Math.sin(a)*side*52,p.y+Math.cos(a)*side*52,38,'ETERNITY · FLESH SEAL',1.15+(side>0?.25:0),12,'cursed',.65);
  return true;
 }
 const fierce=!!e.enraged,u={version:1,style:'',age:0,duration:2.9,x:e.x,y:e.y,facing:e.facing<0?-1:1,angle:a,targetX:p.x,targetY:p.y,marks};e.devilAttack=u;e.moving=false;
 if(e.archetype==='katanaman'){
  if(e.skill%3===1){u.style='iaicut';
   line(e.x,e.y,a,940,fierce?20:15,'KATANA · IAI CUT',1.3,25);
   if(fierce){const angle=a+Math.PI/2;line(p.x-Math.cos(angle)*380,p.y-Math.sin(angle)*380,angle,760,15,'KATANA · RETURN DRAW',1.95,23);}
  }else if(e.skill%3===2){u.style='crossingsteel';
   for(let i=0;i<2;i++){const angle=a+(i?.67:-.67);line(p.x-Math.cos(angle)*390,p.y-Math.sin(angle)*390,angle,780,fierce?19:14,'KATANA · CROSSING STEEL',1.2+i*.45,24);}
   circle(p.x,p.y,fierce?66:52,'KATANA · DRAW’S END',2.05,22,'bleeding',.35);
  }else{u.style='sheathedge';const n=fierce?5:3;
   for(let i=0;i<n;i++){const offset=(i-(n-1)/2)*94,x=p.x-Math.sin(a)*offset,y=p.y+Math.cos(a)*offset;line(x-Math.cos(a)*405,y-Math.sin(a)*405,a,810,fierce?17:13,'KATANA · SHEATHED EDGE',1.2+Math.abs(i-(n-1)/2)*.2,23);}
  }
 }else if(e.archetype==='batdevil'){
  if(e.skill%3===1){u.style='sonicroar';u.gapAngle=a+Math.PI/2;const radius=175;
   for(let i=2;i<7;i++){const angle=u.gapAngle+i*TAU/8;circle(p.x+Math.cos(angle)*radius,p.y+Math.sin(angle)*radius,fierce?45:36,'BAT DEVIL · SONIC ROAR',1.3,21,'slow');}
   circle(p.x,p.y,fierce?100:80,'BAT DEVIL · PRESSURE BURST',2.05,27,'stun',.45);
  }else if(e.skill%3===2){u.style='bloodlance';const n=fierce?5:3;
   for(let i=0;i<n;i++){const offset=(i-(n-1)/2)*92,x=p.x-Math.sin(a)*offset,y=p.y+Math.cos(a)*offset;line(x-Math.cos(a)*390,y-Math.sin(a)*390,a,780,fierce?18:13,'BAT DEVIL · BLOOD LANCE',1.25+Math.abs(i-(n-1)/2)*.22,24,'bleeding');}
  }else{u.style='wingcrush';
   for(let i=0;i<3;i++){const offset=(i-1)*115;circle(p.x-Math.sin(a)*offset,p.y+Math.cos(a)*offset,fierce?78:61,'BAT DEVIL · WING CRUSH',1.2+i*.4,25,'stun',.4);}
  }
 }else{
  if(e.skill%3===1){u.style='endlesshall';const n=fierce?5:3;
   for(let i=0;i<n;i++){const offset=(i-(n-1)/2)*106,x=p.x-Math.sin(a)*offset,y=p.y+Math.cos(a)*offset;line(x-Math.cos(a)*410,y-Math.sin(a)*410,a,820,fierce?19:14,'ETERNITY · ENDLESS HALL',1.2+(i%3)*.3,23,'cursed',.5);}
  }else if(e.skill%3===2){u.style='fleshlabyrinth';u.gapAngle=a+Math.PI/2;
   for(let i=2;i<7;i++){const angle=u.gapAngle+i*TAU/8;circle(p.x+Math.cos(angle)*180,p.y+Math.sin(angle)*180,fierce?48:39,'ETERNITY · FLESH LABYRINTH',1.45,22,'cursed',.65);}
  }else{u.style='clockcollapse';
   for(let i=0;i<3;i++){const offset=(i-1)*112;circle(p.x-Math.sin(a)*offset,p.y+Math.cos(a)*offset,fierce?70:53,'ETERNITY · CLOCK COLLAPSE',1.2+i*.45,26,'cursed',.45);}
  }
 }
 e.windup=u.duration-.1;e.attackCD=Math.max(e.attackCD,u.duration+.8);return true;
}
