// Optional graveyard visitations. Automatic appearances belong to the graveyard;
// a stored event keepsake can be used elsewhere when the player chooses.
const parade=['paradehollow','hollowghost','lanternwisp','gravezombie'];
const tomb=['tombsentinel','shadowstitch','coffincrawler','gravezombie'];
export const GRAVEYARD_EVENTS=[
 {id:'ghostparade',name:'Night of the Hollow Lanterns',color:'#d8b6df',weather:'ghostparade',mapIds:['graveyard'],bossId:'peronaparade',enemies:parade,enemyIds:parade,triggerId:'hollowlantern',description:'Pale lanterns and negative hollows drift through the graveyard. Perona leads a ghost procession of fixed, delayed impacts. Defeat the Ghost Princess and her remaining procession to lift the visitation.'},
 {id:'tombwake',name:'The Great Tomb Awakens',color:'#d8cf9f',weather:'tombwake',mapIds:['graveyard'],bossId:'ainztomb',enemies:tomb,enemyIds:tomb,triggerId:'tombkey',description:'An ancient tomb answers a sealed key. Ainz Ooal Gown awakens its skeletal sentinels and casts Bone Prison, Grasp Heart and Fallen Down. Defeat the sorcerer and every remaining tomb invader to end the awakening.'},
];
export const GRAVEYARD_EVENT_ENEMIES={
 paradehollow:{name:'Parade Hollow',family:'onepiece',eventOnly:true,eventId:'ghostparade',hp:1.1,speed:82,r:16,behavior:'paradehollow',waterWalker:true,color:'#d9c8e7',attack:4.4,description:'Event only: Night of the Hollow Lanterns. A bowed ghost warns a fixed negative-hollow seal before a slowing wail opens at the marked position.'},
 tombsentinel:{name:'Tomb Sentinel',family:'overlord',eventOnly:true,eventId:'tombwake',hp:2.1,speed:52,r:20,behavior:'tombsentinel',color:'#c7c9b2',attack:4.6,description:'Event only: The Great Tomb Awakens. A skeletal death knight braces behind its armor before a fixed bone-blade lane. Sidestep its pale warning.'},
};
export const GRAVEYARD_EVENT_BOSSES={
 peronaparade:{name:'Perona · Ghost Princess',title:'THE PRINCESS OF THE HOLLOW LANTERNS',family:'onepiece',eventOnly:true,eventId:'ghostparade',hp:5200,speed:63,r:36,behavior:'peronaparade',waterWalker:true,color:'#dcb7df',description:'Event only: Night of the Hollow Lanterns. Hollow Procession sends two staggered ghost rows past a broad central corridor before a final center blast. Ring of Regret leaves a wide opening in its hollow halo before marking the center. Umbrella Hex crosses two fixed curse lanes. Below half health more hollows join the rows and halo, impacts grow and Umbrella Hex gains another lane. Every mark locks before release.'},
 ainztomb:{name:'Ainz Ooal Gown · Eclipse of Life',title:'THE SORCERER KING OF THE GREAT TOMB',family:'overlord',eventOnly:true,eventId:'tombwake',hp:5900,speed:46,r:43,behavior:'ainztomb',color:'#ded3a5',description:'Event only: The Great Tomb Awakens. Bone Prison raises five fixed cage walls with a wide doorway before a delayed central rupture. Grasp Heart marks three impacts in a procession along the last movement direction. Fallen Down calls one huge central light pillar followed by an open-sided halo. Below half health cage walls widen, two outer pillars appear, Grasp Heart gains two marks and Fallen Down gains two halo lights. Escape the fixed warnings before their release.'},
};
export const GRAVEYARD_TRIGGER_ITEMS=[
 {id:'hollowlantern',name:'Hollow Lantern',series:'ONE PIECE',color:'#d9b9e0',category:'event',consumable:true,eventId:'ghostparade',dropWeight:.25,description:'Store this pale lantern in one of your three trinket slots. Use it when ready to call Perona and the Night of the Hollow Lanterns. It is consumed only if the event begins and cannot be refined.'},
 {id:'tombkey',name:'Sealed Ossuary Key',series:'OVERLORD',color:'#d8cf9f',category:'event',consumable:true,eventId:'tombwake',dropWeight:.25,description:'Store this ancient key in a trinket slot. Use it when ready to awaken Ainz and the sentinels of the Great Tomb. It is consumed only if the event begins and cannot be refined.'},
];
const TAU=Math.PI*2;
export function graveyardEventAttack(g,e,p,a,{hazard}={}){
 if(!GRAVEYARD_EVENT_BOSSES[e.archetype]&&!GRAVEYARD_EVENT_ENEMIES[e.archetype])return false;
 const marks=[],color=e.color||'#d8cfb6';
 const mark=data=>{const h={age:0,color,source:e.archetype,sourceId:e.id,cancelWithSource:true,sourceClock:true,...data};marks.push(h);hazard?.(g,h);return h;};
 const circle=(x,y,r,label,delay,damage=24,status='cursed',duration=.45)=>mark({shape:'circle',x,y,r,label,delay,damage,status,duration});
 const segment=(x,y,tx,ty,width,label,delay,damage=25,status='cursed',duration=.45)=>mark({shape:'line',x,y,tx,ty,width,label,delay,damage,status,duration});
 const line=(x,y,angle,length,width,label,delay,damage=25,status='cursed',duration=.45)=>segment(x-Math.cos(angle)*length/2,y-Math.sin(angle)*length/2,x+Math.cos(angle)*length/2,y+Math.sin(angle)*length/2,width,label,delay,damage,status,duration);
 if(!e.boss){
  if(e.archetype==='paradehollow'){e.windup=1.25;circle(p.x,p.y,34,'PARADE HOLLOW · NEGATIVE WAIL',1.25,12,'slow',.4);}
  else{e.windup=1.25;segment(e.x,e.y,e.x+Math.cos(a)*250,e.y+Math.sin(a)*250,12,'TOMB SENTINEL · BONE BLADE',1.25,15,'bleeding',.35);}
  return true;
 }
 const fierce=!!e.enraged,move=g.lastMove||{},escape=Math.hypot(move.x||0,move.y||0)>.1?Math.atan2(move.y,move.x):a;
 const u={version:1,age:0,duration:3.6,style:'',angle:a,facing:e.facing<0?-1:1,x:e.x,y:e.y,origin:{x:e.x,y:e.y-45},target:{x:p.x,y:p.y},targetX:p.x,targetY:p.y,gapAngle:escape,marks};
 e.worldEventAttack=u;e.moving=false;
 if(e.archetype==='peronaparade'){
  if(e.skill%3===1){
   u.style='hollowprocession';u.name='HOLLOW PROCESSION';const rows=fierce?4:3;u.duration=fierce?4:3.7;
   for(const side of [-1,1])for(let i=0;i<rows;i++){const along=(i-(rows-1)/2)*140,x=p.x+Math.cos(a)*along-Math.sin(a)*side*125,y=p.y+Math.sin(a)*along+Math.cos(a)*side*125;circle(x,y,fierce?45:36,'HOLLOW PROCESSION · GHOST ROW',1.4+i*.23,24,'slow',.4);}
   circle(p.x,p.y,fierce?98:78,'HOLLOW PROCESSION · FINAL WAIL',fierce?3:2.7,31,'cursed',.55);
  }else if(e.skill%3===2){
   u.style='hollowregret';u.name='NEGATIVE HOLLOW · RING OF REGRET';const count=fierce?7:5;u.radius=200;
   for(let i=0;i<count;i++){const angle=escape+Math.PI/3+(i+.5)*(TAU-2*Math.PI/3)/count;circle(p.x+Math.cos(angle)*200,p.y+Math.sin(angle)*200,fierce?48:39,'RING OF REGRET · NEGATIVE HOLLOW',1.45+(i%2)*.16,23,'slow',.45);}
   circle(p.x,p.y,fierce?101:81,'RING OF REGRET · LEAVE THE CENTER',2.75,31,'cursed',.55);
  }else{
   u.style='umbrellacurse';u.name='GHOST PRINCESS · UMBRELLA HEX';
   line(p.x,p.y,a-.6,820,fierce?22:16,'UMBRELLA HEX · FIRST RIBBON',1.35,25,'slow',.4);
   line(p.x,p.y,a+.6,820,fierce?22:16,'UMBRELLA HEX · SECOND RIBBON',1.95,25,'slow',.4);
   if(fierce)line(p.x,p.y,a+Math.PI/2,760,17,'UMBRELLA HEX · RETURNING RIBBON',2.5,26,'cursed',.4);
   circle(p.x,p.y,fierce?94:76,'UMBRELLA HEX · PRINCESS’S CURSE',fierce?3.1:2.65,32,'cursed',.5);u.duration=fierce?3.95:3.5;
  }
 }else if(e.skill%3===1){
  u.style='boneprison';u.name='MAGIC · BONE PRISON';u.radius=185;u.duration=3.6;
  const local=(x,y)=>({x:p.x+Math.cos(escape)*x-Math.sin(escape)*y,y:p.y+Math.sin(escape)*x+Math.cos(escape)*y});
  // The +x wall has a 180-unit doorway. The later core is separate from it.
  for(const [x,y,tx,ty]of [[-185,-185,-185,185],[-185,-185,185,-185],[-185,185,185,185],[185,-185,185,-90],[185,90,185,185]]){const b=local(x,y),t=local(tx,ty);segment(b.x,b.y,t.x,t.y,fierce?19:13,'BONE PRISON · OPEN DOORWAY',1.5,24,'cursed',.65);}
  if(fierce)for(const side of [-1,1]){const v=local(-245,side*230);circle(v.x,v.y,40,'BONE PRISON · OUTER PILLAR',2.15,24,'bleeding',.4);}
  circle(p.x,p.y,fierce?138:118,'BONE PRISON · LEAVE THE CORE',2.8,34,'cursed',.55);
 }else if(e.skill%3===2){
  u.style='graspheart';u.name='GRASP HEART · THE SILENT SENTENCE';const count=fierce?5:3;u.angle=escape;u.duration=1.4+(count-1)*.43+.8;
  for(let i=0;i<count;i++)circle(p.x+Math.cos(escape)*i*115,p.y+Math.sin(escape)*i*115,fierce?65:51,'GRASP HEART · '+(i+1),1.4+i*.43,28,'cursed',.45);
 }else{
  u.style='fallendown';u.name='SUPER-TIER MAGIC · FALLEN DOWN';u.radius=fierce?156:130;u.duration=4.25;
  circle(p.x,p.y,u.radius,'FALLEN DOWN · LEAVE THE LIGHT PILLAR',2,34,'burning',.65);
  const count=fierce?8:6;for(let i=0;i<count;i++){const angle=escape+Math.PI/3+(i+.5)*(TAU-2*Math.PI/3)/count;circle(p.x+Math.cos(angle)*250,p.y+Math.sin(angle)*250,fierce?51:41,'FALLEN DOWN · BROKEN HALO',3.35,25,'cursed',.5);}
 }
 e.windup=u.duration;e.attackCD=Math.max(e.attackCD||0,u.duration+.8);return true;
}
