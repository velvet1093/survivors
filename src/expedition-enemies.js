// Expedition cast: Fairy Tail and That Time I Got Reincarnated as a Slime foes, plus
// Kokushibo. They follow the shared fixed-warning rules: every attack marks finite
// positions that never track after the warning, and a saved cast mark drives the art.
export const EXPEDITION_ENEMIES={
 eisenwald:{name:'Eisenwald Dark Mage',family:'fairytail',hp:1.05,speed:58,r:16,behavior:'eisenwald',color:'#a9c7a0',attack:4.2,description:'A dark guild wind mage from Eisenwald. Wind Edge throws a fan of three wind blades with clear gaps; step between them or sidestep the spread.'},
 vulcan:{name:'Forest Vulcan',family:'fairytail',hp:1.7,speed:84,r:20,behavior:'vulcan',color:'#e6e1d4',attack:4.6,minWave:2,description:'A hulking white ape from the Fairy Tail woods. It crouches, then leaps onto a fixed landing mark; leave the circle before it crashes down.'},
 phantomshade:{name:'Phantom Lord Shade',family:'fairytail',hp:.9,speed:70,r:16,behavior:'phantomshade',waterWalker:true,color:'#9f9ac4',attack:4.4,minWave:3,description:'A hooded shade summoned by Phantom Lord. It drifts closer and releases a ring of six slow cursed orbs with wide spaces between them.'},
 orctrooper:{name:'Orc Disaster Trooper',family:'tensura',hp:1.9,speed:52,r:20,behavior:'orctrooper',color:'#b9a27c',attack:4.8,contactStatus:'bleeding',description:'A starving soldier of the Orc Lord’s army. Its cleaver slam warns a short fixed lane straight ahead; step to either side before it lands.'},
 megalodon:{name:'Charybdis Megalodon',family:'tensura',hp:1,speed:96,r:17,behavior:'megalodon',waterWalker:true,color:'#8fb4c9',attack:4.3,description:'A flying shark spawned by the storm beast Charybdis. It locks a straight dive lane, then rushes along it; move off the marked line.'},
 lizardman:{name:'Lizardman Spearman',family:'tensura',hp:1.25,speed:74,r:17,behavior:'lizardman',color:'#8fbf8a',attack:4.1,minWave:2,description:'A warrior of Gabiru’s lizardmen. It braces, then thrusts its spear down a narrow fixed lane while lunging forward.'},
};
export const EXPEDITION_BOSSES={
 jellal:{name:'Jellal Fernandes',title:'THE HEAVENLY BODY MAGE',family:'fairytail',hp:3450,speed:72,r:34,behavior:'jellal',color:'#c7b1e8',shiftName:'Jellal · Sema Unleashed',shiftTitle:'THE STARS ANSWER HIS CALL',shiftRadius:38,description:'Meteor sends three staggered streaking lanes through your last position from different angles. Grand Chariot drops seven star seals in the Big Dipper’s shape around you. Altairis rings you with dark orbs that leave an open side before a black sphere collapses on the center. Below half health he unleashes Sema: more stars, wider seals and a returning lane.'},
 geld:{name:'Geld, the Orc Lord',title:'THE STARVING CATASTROPHE',family:'tensura',hp:3900,speed:48,r:42,behavior:'geld',color:'#c7a86a',shiftName:'Geld · Orc Disaster',shiftTitle:'HUNGER WITHOUT END',shiftRadius:48,description:'Meat Cleaver chops two crossing lanes through your last position, one after the other. Starved spreads a poisonous rot field around Geld and flanks you with two more. Chaos Eater devours three marked circles along your escape direction. Below half health he evolves into the Orc Disaster: a third cleave, wider rot and a fourth bite.'},
 kokushibo:{name:'Kokushibo',title:'UPPER MOON ONE',family:'demonslayer',hp:3700,speed:78,r:36,behavior:'kokushibo',color:'#c98fa8',shiftName:'Kokushibo · Six-Eyed Demon',shiftTitle:'THE MOON BREATHING DEEPENS',shiftRadius:40,description:'First Form: Dark Moon draws one long crescent lane, then two parallel follow-ups with space between. Sixth Form: Perpetual Night fans five fixed cuts from his position. Sixteenth Form: Moonbow drops four staggered vertical lanes across your area with gaps between them. Below half health his blade grows: lanes widen and an extra cut joins each form.'},
};
export const EXPEDITION_RIFT_BOSSES={
 acnologia:{name:'Acnologia',title:'THE DRAGON OF THE APOCALYPSE',family:'fairytail',hp:24500,speed:68,r:54,color:'#7d93c4',behavior:'acnologia',riftOnly:true,waterWalker:true,description:'Rift superboss. Dragon’s Roar fires a vast fixed beam through your last position, then two parallel beams either side; stand in a gap. Apocalypse Wingbeat rings you with storm craters that leave one open side before a central dive. Black Descent crashes three times along your escape direction. Below half health the beams widen, another crater joins the ring and a fourth descent follows.'},
 milim:{name:'Milim Nava',title:'THE DESTROYER',family:'tensura',hp:23500,speed:92,r:40,color:'#f0a6b8',behavior:'milim',riftOnly:true,description:'Rift superboss. Drago Nova orbits six charged stars around your last position before a central blast. Milim Rush sends three fixed afterimage dash lanes crossing your position. Stardust Rain drops staggered meteors in a wide pattern around you. Below half health she lets loose: more stars, a fourth rush and denser stardust.'},
};
const TAU=Math.PI*2;
const owns=id=>Object.hasOwn(EXPEDITION_ENEMIES,id)||Object.hasOwn(EXPEDITION_BOSSES,id);
export function updateExpeditionCast(e,dt,frozen=false){
 const u=e.expeditionAttack;if(!u||frozen||!Number.isFinite(dt)||dt<=0)return;
 u.age+=dt;if(u.age>=u.duration)e.expeditionAttack=null;
}
export function expeditionAttack(g,e,p,a,{fan,ring,hazard}={}){
 if(!owns(e.archetype))return false;
 const boss=Object.hasOwn(EXPEDITION_BOSSES,e.archetype),fierce=!!e.enraged,marks=[],color=e.color;
 const mark=data=>{const h={age:0,color,source:e.archetype,sourceId:e.id,cancelWithSource:true,sourceClock:true,...data};marks.push(h);hazard?.(g,h);return h;};
 const circle=(x,y,r,label,delay,damage,status='cursed',duration=.4)=>mark({shape:'circle',x,y,r,label,delay,damage,status,duration});
 const line=(x,y,angle,length,width,label,delay,damage,status='bleeding',duration=.4)=>mark({shape:'line',x,y,tx:x+Math.cos(angle)*length,ty:y+Math.sin(angle)*length,width,label,delay,damage,status,duration});
 const centered=(x,y,angle,length,width,label,delay,damage,status='bleeding',duration=.4)=>line(x-Math.cos(angle)*length/2,y-Math.sin(angle)*length/2,angle,length,width,label,delay,damage,status,duration);
 const move=g.lastMove||{},escape=Math.hypot(move.x||0,move.y||0)>.1?Math.atan2(move.y,move.x):a+Math.PI/2;
 const u={version:1,style:'',age:0,duration:2.9,x:e.x,y:e.y,targetX:p.x,targetY:p.y,angle:a,facing:e.facing<0?-1:1,marks};e.expeditionAttack=u;e.moving=false;
 if(!boss){
  u.duration=1.9;
  if(e.archetype==='eisenwald'){u.style='windedge';u.duration=1.15;fan?.(g,e,a,3,.3,165,'slash');}
  else if(e.archetype==='vulcan'){u.style='vulcanleap';circle(p.x,p.y,36,'VULCAN · LEAP',.95,14,'stun',.3);e.windup=.95;e.dash=1.4;e.dashX=Math.cos(a);e.dashY=Math.sin(a);}
  else if(e.archetype==='phantomshade'){u.style='phantomring';u.duration=1.2;ring?.(g,e,6,a,115,'curse');}
  else if(e.archetype==='orctrooper'){u.style='cleaverslam';line(e.x,e.y,a,170,16,'ORC TROOPER · CLEAVER SLAM',1,15);}
  else if(e.archetype==='megalodon'){u.style='megalodondive';line(e.x,e.y,a,330,14,'MEGALODON · DIVE',.9,12);e.windup=.9;e.dash=1.1;e.dashX=Math.cos(a);e.dashY=Math.sin(a);}
  else{u.style='spearthrust';line(e.x,e.y,a,210,9,'LIZARDMAN · SPEAR THRUST',.85,13);e.windup=.85;e.dash=.6;e.dashX=Math.cos(a);e.dashY=Math.sin(a);}
  if(!['vulcan','megalodon','lizardman'].includes(e.archetype))e.windup=Math.max(e.windup||0,u.style==='windedge'||u.style==='phantomring'?.5:u.duration-.15);
  e.attackCD=Math.max(e.attackCD||0,u.duration+.7);return true;
 }
 const skill=e.skill%3;
 if(e.archetype==='jellal'){
  if(skill===1){
   // Meteor: three streaks through the last position from different angles.
   u.style='meteor';u.duration=2.8;const n=fierce?4:3;
   for(let i=0;i<n;i++){const angle=a+(i-(n-1)/2)*.95;centered(p.x,p.y,angle,760,fierce?18:14,'JELLAL · METEOR '+(i+1),1.2+i*.3,24,'stun',.35);}
  }else if(skill===2){
   // Grand Chariot: seven star seals in the Big Dipper's shape.
   u.style='grandchariot';u.duration=2.9;const dipper=[[-150,-40],[-95,-60],[-40,-45],[10,-10],[80,-20],[110,45],[45,60]],rot=a;
   dipper.forEach(([dx,dy],i)=>{const x=p.x+dx*Math.cos(rot)-dy*Math.sin(rot),y=p.y+dx*Math.sin(rot)+dy*Math.cos(rot);circle(x,y,fierce?44:34,'JELLAL · GRAND CHARIOT',1.25+i*.12,25,'burning');});
   if(fierce)circle(p.x,p.y,60,'JELLAL · SEMA',2.4,28,'burning',.4);
  }else{
   // Altairis: a broken ring of dark orbs, then the central black sphere.
   u.style='altairis';u.duration=3.1;u.gapAngle=escape;u.radius=175;
   for(let i=2;i<(fierce?8:7);i++){const angle=escape+i*TAU/8;circle(p.x+Math.cos(angle)*175,p.y+Math.sin(angle)*175,fierce?42:32,'JELLAL · ALTAIRIS ORB',1.2+(i%2)*.2,22,'cursed');}
   circle(p.x,p.y,fierce?96:76,'JELLAL · ALTAIRIS',2.3,30,'cursed',.5);
  }
 }else if(e.archetype==='geld'){
  if(skill===1){
   u.style='meatcleaver';u.duration=fierce?3.1:2.6;
   for(let i=0;i<(fierce?3:2);i++)centered(p.x,p.y,a+[-.7,.7,0][i],720,fierce?24:19,'GELD · MEAT CLEAVER '+(i+1),1.2+i*.5,27,'bleeding');
  }else if(skill===2){
   u.style='starved';u.duration=2.7;
   circle(e.x,e.y,fierce?140:110,'GELD · STARVED ROT',1.3,22,'poison',.6);
   for(const s of [-1,1])circle(p.x+Math.cos(a+s*Math.PI/2)*120,p.y+Math.sin(a+s*Math.PI/2)*120,fierce?62:50,'GELD · STARVED',1.5,22,'poison',.6);
  }else{
   u.style='chaoseater';const n=fierce?4:3;u.duration=1.2+(n-1)*.35+.8;u.angle=escape;u.points=[];
   for(let i=0;i<n;i++){const point={x:p.x+Math.cos(escape)*i*100,y:p.y+Math.sin(escape)*i*100,r:fierce?64:52,delay:1.2+i*.35};u.points.push(point);circle(point.x,point.y,point.r,'GELD · CHAOS EATER '+(i+1),point.delay,28,'poison',.45);}
  }
 }else{
  if(skill===1){
   // First Form: Dark Moon, Evening Palace, then two parallel follow-ups.
   u.style='darkmoon';u.duration=2.9;
   line(e.x,e.y,a,900,fierce?20:15,'KOKUSHIBO · FIRST FORM',1.2,27);
   for(const s of [-1,1]){const x=p.x-Math.sin(a)*s*110,y=p.y+Math.cos(a)*s*110;centered(x,y,a,700,fierce?18:13,'KOKUSHIBO · CRESCENT MOON',1.8,24);}
  }else if(skill===2){
   // Sixth Form: Perpetual Night, Lonely Moon fans fixed cuts from his position.
   u.style='perpetualnight';u.duration=2.6;const n=fierce?6:5;
   for(let i=0;i<n;i++)line(e.x,e.y,a+(i-(n-1)/2)*.32,620,fierce?14:11,'KOKUSHIBO · SIXTH FORM',1.2+Math.abs(i-(n-1)/2)*.12,25);
  }else{
   // Sixteenth Form: Moonbow, Half Moon drops parallel lanes with gaps.
   u.style='moonbow';u.duration=3;const n=fierce?5:4;
   for(let i=0;i<n;i++){const offset=(i-(n-1)/2)*95,x=p.x+Math.cos(a)*offset,y=p.y+Math.sin(a)*offset;centered(x,y,a+Math.PI/2,640,fierce?20:15,'KOKUSHIBO · MOONBOW',1.25+i*.22,26);}
  }
 }
 e.windup=u.duration;e.attackCD=Math.max(e.attackCD||0,u.duration+.75);return true;
}
// Rift superboss rotations, shared through the riftAttack tell like the other rifts.
export function expeditionRiftAttack(g,e,p,a,{hazard}={}){
 if(!Object.hasOwn(EXPEDITION_RIFT_BOSSES,e.archetype))return false;
 const count=e.skill%3,fierce=!!e.enraged;
 const mark=data=>hazard(g,{age:0,duration:.5,color:e.color,source:e.archetype,sourceId:e.id,cancelWithSource:true,bossUltimate:true,...data});
 const circle=(x,y,r,label,delay,damage,status='cursed',duration=.5)=>mark({shape:'circle',x,y,r,label,delay,damage,status,duration});
 const line=(x,y,angle,length,width,label,delay,damage,status='bleeding')=>mark({shape:'line',x:x-Math.cos(angle)*length/2,y:y-Math.sin(angle)*length/2,tx:x+Math.cos(angle)*length/2,ty:y+Math.sin(angle)*length/2,width,label,delay,damage,status});
 const tell=(name,style,duration,extra={})=>{
  e.riftAttack={name,style,age:0,duration,color:e.color,x:p.x,y:p.y,angle:a,...extra};
  e.windup=Math.max(e.windup,1.35);e.attackCD=Math.max(e.attackCD,duration+(fierce?.45:.9));
  g.toast=name+' · RIFT ATTACK';g.toastTime=2.5;
 };
 const move=g.lastMove||{},escape=Math.hypot(move.x||0,move.y||0)>.1?Math.atan2(move.y,move.x):a;
 if(e.archetype==='acnologia'){
  if(count===1){
   tell('DRAGON’S ROAR','dragonroar',3.4);
   line(p.x,p.y,a,1100,fierce?46:36,'ACNOLOGIA · DRAGON’S ROAR',1.6,52,'burning');
   for(const s of [-1,1]){const x=p.x-Math.sin(a)*s*170,y=p.y+Math.cos(a)*s*170;line(x,y,a,1100,fierce?40:32,'ACNOLOGIA · ROAR ECHO',2.3,46,'burning');}
  }else if(count===2){
   tell('APOCALYPSE WINGBEAT','apocalypsewing',3.5,{gapAngle:escape,radius:200});
   for(let i=2;i<(fierce?9:8);i++){const angle=escape+i*TAU/9;circle(p.x+Math.cos(angle)*200,p.y+Math.sin(angle)*200,fierce?52:42,'ACNOLOGIA · STORM CRATER',1.6+(i%3)*.15,40,'stun',.45);}
   circle(p.x,p.y,fierce?110:90,'ACNOLOGIA · DRAGON DIVE',2.6,58,'stun',.5);
  }else{
   const n=fierce?4:3;tell('BLACK DESCENT','blackdescent',1.6+(n-1)*.45+1);
   for(let i=0;i<n;i++)circle(p.x+Math.cos(escape)*i*120,p.y+Math.sin(escape)*i*120,fierce?82:70,'ACNOLOGIA · BLACK DESCENT '+(i+1),1.6+i*.45,55,'cursed',.5);
  }
 }else{
  if(count===1){
   tell('DRAGO NOVA','drago',3.2,{gapAngle:escape,radius:170});
   const n=fierce?8:6;for(let i=0;i<n;i++){const angle=escape+Math.PI/n+i*TAU/n;circle(p.x+Math.cos(angle)*170,p.y+Math.sin(angle)*170,fierce?40:32,'MILIM · NOVA STAR',1.6,36,'burning',.45);}
   circle(p.x,p.y,fierce?115:95,'MILIM · DRAGO NOVA',2.4,60,'burning',.55);
  }else if(count===2){
   const n=fierce?4:3;tell('MILIM RUSH','milimrush',1.6+(n-1)*.35+1.1);
   for(let i=0;i<n;i++)line(p.x,p.y,a+(i-(n-1)/2)*.8,900,fierce?30:24,'MILIM · RUSH '+(i+1),1.6+i*.35,44,'stun');
  }else{
   const n=fierce?10:7;tell('STARDUST RAIN','stardust',1.6+n*.15+1);
   for(let i=0;i<n;i++){const angle=i*2.39996+a,dist=70+((i*53)%170);circle(p.x+Math.cos(angle)*dist,p.y+Math.sin(angle)*dist,fierce?46:38,'MILIM · STARDUST',1.6+i*.15,40,'burning',.45);}
  }
 }
 return true;
}
