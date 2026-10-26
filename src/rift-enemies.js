export const RIFT_ENEMIES={
 puppet:{name:'Akatsuki Puppet',family:'naruto',hp:1.6,speed:58,r:16,behavior:'puppet',color:'#c79b88',attack:4.5,description:'Fires poison needles and brackets your position with three delayed poison traps.'},
 rootanbu:{name:'Root ANBU',family:'naruto',hp:1.15,speed:96,r:15,behavior:'rootanbu',color:'#b7c7cf',attack:4.1,contactStatus:'bleeding',description:'A masked shinobi that plants a stun decoy before a warned sword rush.'},
 hollow:{name:'Hollow Stalker',family:'bleach',hp:1.8,speed:77,r:18,behavior:'hollow',color:'#d7d5c5',attack:4.2,description:'Its soul bolts restore half their damage to the stalker when they hit. Negate or dodge the shots to deny healing.'},
 cerobat:{name:'Cero Bat',family:'bleach',hp:.95,speed:83,r:14,behavior:'cerobat',waterWalker:true,color:'#9cbea5',attack:4.8,minWave:2,description:'Flies over water and predicts your direction with a warned Cero lane. Change direction after the mark.'},
 celljunior:{name:'Cell Junior',family:'dragonball',hp:2.1,speed:88,r:17,behavior:'celljunior',color:'#87bbc9',attack:4.4,minWave:3,description:'Fires fan-shaped ki volleys. Every second attack repairs a small part of its health and releases a defensive ring.'},
 timewraith:{name:'Clockwork Wraith',family:'datealive',hp:1.4,speed:49,r:17,behavior:'timewraith',color:'#cda7a5',attack:4.7,description:'A hovering clock spirit that leaves long-lived slowing marks and sends out turning clockwork shots.'},
};
// Encounter-only reinforcements are deliberately absent from map spawn pools.
export const RIFT_MINIONS={
 rumblingcolossal:{name:'Rumbling Colossal Titan',family:'aot',hp:32,speed:34,r:38,behavior:'rumblingcolossal',spriteId:'bertholdt',color:'#d89b87',attack:5.2,riftOnly:true,description:'A living Colossal Titan summoned by Founding Titan Eren. Its huge stomp locks your last position before impact; alternating steam vents punish staying near its body. Eren commands at most two, or three in his second phase. Defeating their founder dismisses the remaining Colossals.'},
};
export const RIFT_BOSSES={
 cell:{name:'Imperfect Cell',cellStage:0,title:'THE HUNGRY BIO-ANDROID',family:'dragonball',hp:3600,speed:73,r:34,color:'#a8ca83',behavior:'cell',description:'Three bodies, one health pool: Imperfect Cell drains life; below 66% Semi-Perfect Cell uses explosive ki and armored stomps; below 33% Perfect Cell uses Solar Flare, Kamehameha, regeneration and Cell Juniors. Each transformation pauses combat. Only his final defeat drops a chest.'},
 itachi:{name:'Itachi Uchiha',title:'THE CRIMSON ILLUSION',family:'naruto',hp:2650,speed:82,r:35,color:'#cf8d9f',behavior:'itachi',description:'Raven volleys, a three-part Tsukuyomi trap and lingering black flames. His Susanoo phase grants temporary armor and warns before a blade strike.'},
 ulquiorra:{name:'Ulquiorra Cifer',title:'CUATRO ESPADA',family:'bleach',hp:2850,speed:88,r:38,color:'#a4d2b9',behavior:'ulquiorra',waterWalker:true,description:'Resurrección shifts into Segunda Etapa below half health, changing his silhouette. Predictive Cero Oscuras, delayed Lanza shock rings and a two-step Sonído assault demand movement; his second release adds a dark regeneration window interrupted by damage.'},
};
export function riftAttack(g,e,p,a,{fan,ring,hazard,summon}){
 const circle=(x,y,r,label,status='cursed',delay=.9,damage=15,duration=.4)=>hazard(g,{shape:'circle',x,y,r,label,status,delay,damage,duration,color:e.color,source:e.archetype,sourceId:e.id,...(e.behavior==='rumblingcolossal'?{cancelWithSource:true}:{})});
 const line=(angle,length,width,label,status='burning',delay=.9,damage=21)=>hazard(g,{shape:'line',x:e.x,y:e.y,tx:e.x+Math.cos(angle)*length,ty:e.y+Math.sin(angle)*length,width,label,status,delay,damage,duration:.35,color:e.color,source:e.archetype,sourceId:e.id});
 const rush=()=>{e.windup=.65;e.dash=1.1;e.dashX=Math.cos(a);e.dashY=Math.sin(a);};
 switch(e.behavior){
 case 'rumblingcolossal':
  if(Math.hypot(p.x-e.x,p.y-e.y)>275)break;
  if(e.skill%2){circle(p.x,p.y,78,'COLOSSAL STOMP · MOVE OUT','stun',1.5,32,.45);e.windup=1.45;}
  else{circle(e.x,e.y,145,'COLOSSAL · SCALDING STEAM','burning',1.7,23,1.3);e.windup=1.6;}
  break;
 case 'puppet':fan(g,e,a,4,.16,200,'thorn');for(let i=-1;i<=1;i++)circle(p.x+i*60,p.y-i*25,26,'POISON MECHANISM','poison',1.1+Math.abs(i)*.15,8,1.4);break;
 case 'rootanbu':circle(e.x,e.y,45,'DECOY BURST','stun',1,9);rush();line(a,330,12,'ROOT ASSASSINATION','bleeding',.65,15);break;
 case 'hollow':{const before=g.enemyShots.length;fan(g,e,a,3,.23,175,'soul');for(const s of g.enemyShots.slice(before))s.leech=.5;break;}
 case 'cerobat':{const tx=p.x+(g.lastMove?.x||0)*85,ty=p.y+(g.lastMove?.y||0)*85;line(Math.atan2(ty-e.y,tx-e.x),620,13,'CERO SIGHTLINE','burning',1.1,17);e.windup=.7;break;}
 case 'celljunior':fan(g,e,a,4,.21,210,'ki');if(e.skill%2===0){e.hp=Math.min(e.maxHp,e.hp+e.maxHp*.06);ring(g,e,6,g.time,140,'ki');}break;
 case 'timewraith':{circle(p.x,p.y,44,'TIME SNARE','slow',1,8,2.5);const before=g.enemyShots.length;ring(g,e,6,g.time*.3,130,'gear');for(const s of g.enemyShots.slice(before))s.turn=.55;break;}
 case 'cell':
  if((e.cellStage||0)===0){if(e.skill%2){const before=g.enemyShots.length;fan(g,e,a,3,.22,210,'soul');for(const s of g.enemyShots.slice(before))s.leech=.6;}else line(a,480,16,'NEEDLE TAIL','poison',1.1,22);break;}
  if(e.cellStage===1){if(e.skill%2){fan(g,e,a,9,.18,190,'ki');circle(p.x,p.y,90,'EXPLOSIVE KI','burning',1.3,24);}else{e.armorTime=2;circle(e.x,e.y,180,'POWER STOMP','stun',1.2,26);ring(g,e,12,g.time,160,'ki');}break;}
  if(e.skill%3===1){circle(e.x,e.y,165,'SOLAR FLARE','stun',1.2,17);e.windup=.7;}
  else if(e.skill%3===2){for(let i=-1;i<=1;i++)line(a+i*.22,820,18,'PERFECT KAMEHAMEHA','burning',1.05+Math.abs(i)*.18,25);e.windup=.9;}
  else{summon(g,e,'celljunior',e.enraged?4:2);ring(g,e,e.enraged?18:12,g.time,190,'ki');}break;
 case 'itachi':
  if(e.skill%3===1){fan(g,e,a,e.enraged?9:6,.21,225,'raven');for(let i=0;i<3;i++)circle(p.x+Math.cos(i*2.094)*65,p.y+Math.sin(i*2.094)*65,38,'TSUKUYOMI','cursed',1+i*.22,15);}
  else if(e.skill%3===2){for(let i=0;i<(e.enraged?5:3);i++)circle(p.x+(i-1)*55,p.y+Math.sin(i*2)*45,31,'AMATERASU','burning',1.15+i*.12,16,3.2);}
  else{e.armorTime=2.4;line(a,580,27,'SUSANOO BLADE','bleeding',1.25,27);e.windup=1;}break;
 case 'ulquiorra':
  if(e.skill%4===1){const tx=p.x+(g.lastMove?.x||0)*100,ty=p.y+(g.lastMove?.y||0)*100,aim=Math.atan2(ty-e.y,tx-e.x);line(aim,900,e.enraged?25:16,'CERO OSCURAS','cursed',1.25,26);if(e.enraged)for(const offset of [-.28,.28])line(aim+offset,800,12,'BLACK CERO','burning',1.5,18);e.windup=1;}
  else if(e.skill%4===2){for(let i=0;i<(e.enraged?4:2);i++){const x=p.x+Math.cos(i*2.399)*i*65,y=p.y+Math.sin(i*2.399)*i*65;circle(x,y,40,'LANZA IMPACT','burning',1.15+i*.22,23,.4);circle(x,y,85,'LANZA SHOCKWAVE','slow',1.65+i*.22,13,.35);}}
  else if(e.skill%4===3){rush();e.dash=1.5;line(a,540,18,'SONIDO ASSAULT','bleeding',.85,22);line(a+Math.PI/2,360,14,'SONIDO CROSS','bleeding',1.35,17);fan(g,e,a,e.enraged?7:3,.25,180,'cero');}
  else{e.regenWindow=e.enraged?2.4:0;e.armorTime=e.enraged?0:1.5;circle(e.x,e.y,e.enraged?210:135,'BLACK DESPAIR','cursed',1.3,22,.6);ring(g,e,e.enraged?16:8,g.time,140,'cero');}break;
 default:return false;
 }return true;
}
