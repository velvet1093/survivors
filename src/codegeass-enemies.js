// Code Geass foes: the Holy Britannian Empire's infantry and knightmares, a Geass Order
// assassin, and three bosses: Suzaku in the Lancelot, Cornelia the Witch of Britannia
// and Emperor Charles. Every attack warns fixed, finite positions that never track after
// the warning. The cast state reuses the expedition attack slot, so facing, windup and
// animation timing work the same way.
export const CODEGEASS_ENEMIES={
 britsoldier:{name:'Britannian Infantry',family:'codegeass',hp:1,speed:62,r:15,behavior:'britsoldier',color:'#8a9ab8',attack:4.1,description:'An Imperial rifleman in a grey-blue helmet. It fires a tight volley of three rifle rounds with gaps between them.'},
 sutherland:{name:'Sutherland',family:'codegeass',hp:1.9,speed:80,r:20,behavior:'sutherland',color:'#8a7aa8',attack:4.6,description:'Britannia’s purple mass-production knightmare. It fires a slash harken down a fixed lane, then skates after it on its landspinners.'},
 gloucester:{name:'Gloucester Lancer',family:'codegeass',hp:2.1,speed:70,r:20,behavior:'gloucester',color:'#9a6ab8',attack:4.9,minWave:2,description:'A royal guard knightmare with a long lance. It braces, then charges down a marked lane; step off the line.'},
 vincent:{name:'Vincent Float Unit',family:'codegeass',hp:1.2,speed:92,r:17,behavior:'vincent',waterWalker:true,color:'#c8a85a',attack:4.4,minWave:2,description:'A gold knightmare carried by a float system. It crosses water and fires a fan of four MVS slashes.'},
 geassorder:{name:'Geass Order Assassin',family:'codegeass',hp:.9,speed:76,r:15,behavior:'geassorder',color:'#d84a6a',attack:4.5,minWave:3,contactStatus:'cursed',description:'A cloaked child of the Geass Order. Its red eye marks your last position with a delayed time-stopping seal; leave it before it closes.'},
};
export const CODEGEASS_BOSSES={
 suzaku:{name:'Suzaku Kururugi',title:'THE WHITE KNIGHT',family:'codegeass',hp:3600,speed:82,r:36,behavior:'suzaku',color:'#dfe6f4',shiftName:'Suzaku · Lancelot Albion',shiftTitle:'THE KNIGHT OF ZERO',shiftRadius:42,description:'Twin MVS cuts two crossing lanes through your last position. VARIS fires a long beam through it. “Live!” raises a Blaze Luminous shield and a broken ring of slashes with one open side. Below half health the Lancelot Albion adds a third MVS cut, flanking VARIS shots and a wider ring.'},
 cornelia:{name:'Cornelia li Britannia',title:'THE WITCH OF BRITANNIA',family:'codegeass',hp:3800,speed:70,r:38,behavior:'cornelia',color:'#b878c8',shiftName:'Cornelia · Royal Gloucester',shiftTitle:'THE GODDESS OF VICTORY RIDES',shiftRadius:44,description:'Lance Charge commits to a fixed charging lane. Royal Guard calls Gloucester lancers and shells your position. Artillery Barrage drops staggered shells around you. Below half health her charge widens, more lancers answer and the barrage grows.'},
 charles:{name:'Charles zi Britannia',title:'THE 98TH EMPEROR',family:'codegeass',hp:3900,speed:46,r:40,behavior:'charles',color:'#e0c890',shiftName:'Charles · Code Bearer',shiftTitle:'THE SWORD OF AKASHA',shiftRadius:46,description:'All Hail Britannia rings you with royal seals that leave one side open, then strikes the center. Memory Rewrite cuts two parallel lanes beside you before a third through the middle. Sword of Akasha erupts around the Emperor. Below half health he takes his brother’s Code: the ring tightens, Memory Rewrite adds lanes and the Sword of Akasha casts thought lances.'},
};
const TAU=Math.PI*2;
const owns=id=>Object.hasOwn(CODEGEASS_ENEMIES,id)||Object.hasOwn(CODEGEASS_BOSSES,id);
export function codeGeassAttack(g,e,p,a,{fan,ring,hazard,summon}={}){
 if(!owns(e.archetype))return false;
 const boss=Object.hasOwn(CODEGEASS_BOSSES,e.archetype),fierce=!!e.enraged,marks=[],color=e.color;
 const mark=data=>{const h={age:0,color,source:e.archetype,sourceId:e.id,cancelWithSource:true,sourceClock:true,...data};marks.push(h);hazard?.(g,h);return h;};
 const circle=(x,y,r,label,delay,damage,status='cursed',duration=.4)=>mark({shape:'circle',x,y,r,label,delay,damage,status,duration});
 const line=(x,y,angle,length,width,label,delay,damage,status='bleeding',duration=.4)=>mark({shape:'line',x,y,tx:x+Math.cos(angle)*length,ty:y+Math.sin(angle)*length,width,label,delay,damage,status,duration});
 const centered=(x,y,angle,length,width,label,delay,damage,status='bleeding',duration=.4)=>line(x-Math.cos(angle)*length/2,y-Math.sin(angle)*length/2,angle,length,width,label,delay,damage,status,duration);
 const move=g.lastMove||{},escape=Math.hypot(move.x||0,move.y||0)>.1?Math.atan2(move.y,move.x):a+Math.PI/2;
 const u={version:1,style:'',age:0,duration:2.9,x:e.x,y:e.y,targetX:p.x,targetY:p.y,angle:a,facing:e.facing<0?-1:1,marks};e.expeditionAttack=u;e.moving=false;
 if(!boss){
  u.duration=1.9;
  if(e.archetype==='britsoldier'){u.style='riflevolley';u.duration=1.1;fan?.(g,e,a,3,.22,190,'lance');e.windup=.45;}
  else if(e.archetype==='sutherland'){u.style='slashharken';line(e.x,e.y,a,260,10,'SUTHERLAND · SLASH HARKEN',.85,14);e.windup=.85;e.dash=.9;e.dashX=Math.cos(a);e.dashY=Math.sin(a);}
  else if(e.archetype==='gloucester'){u.style='lancecharge';line(e.x,e.y,a,340,16,'GLOUCESTER · LANCE CHARGE',.95,16);e.windup=.95;e.dash=1.2;e.dashX=Math.cos(a);e.dashY=Math.sin(a);}
  else if(e.archetype==='vincent'){u.style='mvsfan';u.duration=1.2;fan?.(g,e,a,4,.24,175,'slash');e.windup=.5;}
  else{u.style='timestop';circle(p.x,p.y,36,'GEASS ORDER · TIME STOP',1,11,'slow',.6);e.windup=1.2;}
  e.attackCD=Math.max(e.attackCD||0,u.duration+.7);return true;
 }
 const skill=e.skill%3;
 if(e.archetype==='suzaku'){
  if(skill===1){
   // Twin MVS: crossing cuts through the last position, one after the other.
   u.style='mvs';u.duration=2.7;const cuts=fierce?[.6,-.6,0]:[.6,-.6];
   cuts.forEach((d,i)=>centered(p.x,p.y,a+Math.PI/2+d,560,fierce?18:14,'LANCELOT · MVS',1.15+i*.3,24));
  }else if(skill===2){
   // VARIS: a long beam through the last position, flanked in the Albion.
   u.style='varis';u.duration=2.6;line(e.x,e.y,a,900,fierce?22:17,'LANCELOT · VARIS',1.3,27,'stun',.4);
   if(fierce)for(const side of [-1,1])line(e.x,e.y,a+side*.3,780,12,'VARIS · FULL POWER',1.75,22,'stun',.35);
  }else{
   // "Live!": Blaze Luminous around him, then a broken ring of slashes around you.
   u.style='live';u.duration=3;u.gapAngle=escape;e.armorTime=1.2;const n=fierce?8:6,radius=fierce?150:135;
   circle(e.x,e.y,80,'BLAZE LUMINOUS',1.1,20,'stun',.35);
   for(let i=1;i<n;i++){const angle=u.gapAngle+i*TAU/n;circle(p.x+Math.cos(angle)*radius,p.y+Math.sin(angle)*radius,fierce?40:34,'LIVE! · SLASH RING',1.4+(i%2)*.2,23,'bleeding',.35);}
   circle(p.x,p.y,fierce?70:56,'LIVE! · FINISHING CUT',2.2,26,'bleeding',.4);
  }
 }else if(e.archetype==='cornelia'){
  if(skill===1){
   u.style='corneliacharge';u.duration=2.4;e.windup=1.2;e.dash=1.7;e.dashX=Math.cos(a);e.dashY=Math.sin(a);
   line(e.x,e.y,a,fierce?620:520,fierce?30:22,'CORNELIA · LANCE CHARGE',1.2,26,'bleeding',.5);
  }else if(skill===2){
   u.style='royalguard';u.duration=2.6;summon?.(g,e,'gloucester',fierce?3:2);
   circle(p.x,p.y,fierce?82:68,'ROYAL GUARD · SHELLING',1.3,24,'burning',.4);
  }else{
   u.style='barrage';u.duration=2.9;const n=fierce?7:5;
   for(let i=0;i<n;i++){const angle=a+i*TAU/n,d=i===0?0:115;circle(p.x+Math.cos(angle)*d,p.y+Math.sin(angle)*d,fierce?42:36,'CORNELIA · ARTILLERY BARRAGE',1.2+i*.2,23,'burning',.35);}
  }
 }else{
  if(skill===1){
   // All Hail Britannia: a ring of royal seals with an open side, then the center.
   u.style='allhail';u.duration=3;u.gapAngle=escape;const n=fierce?9:7,radius=fierce?150:170;
   for(let i=1;i<n;i++){const angle=u.gapAngle+i*TAU/n;circle(p.x+Math.cos(angle)*radius,p.y+Math.sin(angle)*radius,36,'ALL HAIL BRITANNIA',1.3,22,'stun',.4);}
   circle(p.x,p.y,fierce?85:70,'ALL HAIL BRITANNIA · DECREE',2.1,28,'stun',.45);
  }else if(skill===2){
   // Memory Rewrite: two parallel lanes beside you, then one through the middle.
   u.style='memory';u.duration=2.9;const offsets=fierce?[-170,-85,85,170]:[-95,95],perp=a+Math.PI/2;
   offsets.forEach((o,i)=>centered(p.x+Math.cos(perp)*o,p.y+Math.sin(perp)*o,a,640,16,'GEASS · MEMORY REWRITE',1.2+i*.12,22,'cursed',.35));
   centered(p.x,p.y,a,640,18,'GEASS · REWRITTEN',2.1,26,'cursed',.4);
  }else{
   u.style='akasha';u.duration=2.8;e.armorTime=1.4;circle(e.x,e.y,fierce?175:150,'SWORD OF AKASHA',1.4,27,'cursed',.45);
   if(fierce)for(let i=0;i<3;i++)line(e.x,e.y,a+(i-1)*.55,700,14,'AKASHA · THOUGHT LANCE',1.85,22,'cursed',.35);
  }
 }
 e.windup=Math.max(e.windup||0,1);e.attackCD=Math.max(e.attackCD||0,u.duration+.75);
 return true;
}
