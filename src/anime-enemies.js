import {BERSERK_ENEMIES,BERSERK_BOSSES,berserkAttack} from './berserk-enemies.js';
import {JOJO_ENEMIES,JOJO_BOSSES,jojoAttack} from './jojo-enemies.js';
import {TITAN_ENEMIES,TITAN_BOSSES,titanAttack} from './titan-enemies.js';
import {METROID_ENEMIES,METROID_BOSSES,metroidAttack} from './metroid-enemies.js';
import {RIFT_ENEMIES,RIFT_BOSSES,riftAttack} from './rift-enemies.js';
import {WAR_ENEMIES,WAR_BOSSES,warAttack} from './war-enemies.js';
export const ANIME_ENEMIES={
 ...BERSERK_ENEMIES,...JOJO_ENEMIES,...TITAN_ENEMIES,...WAR_ENEMIES,...RIFT_ENEMIES,...METROID_ENEMIES,
 flyhead:{name:'Fly Head',family:'jjk',hp:.65,speed:85,r:12,behavior:'flyhead',color:'#b3c38a',attack:3.9,description:'A darting airborne curse that circles its target and spits cursed motes.'},
 transfigured:{name:'Transfigured Human',family:'jjk',hp:1.7,speed:70,r:18,behavior:'transfigured',color:'#cda5b2',attack:4.6,contactStatus:'cursed',description:'A distorted rushdown enemy. Watch the mark before its lunging hand attack.'},
 jogo:{name:'Jogo',family:'jjk',hp:2.2,speed:48,r:19,behavior:'jogo',color:'#eead77',attack:4.8,minWave:3,description:'A volcanic curse that fans burning embers and erupts the ground beneath you.'},
 hanami:{name:'Hanami',family:'jjk',hp:2.8,speed:39,r:21,behavior:'hanami',color:'#b5c995',attack:5.2,minWave:3,description:'A durable forest curse. Bark armor protects it while roots mark and slow your escape.'},
 dagon:{name:'Dagon',family:'jjk',hp:2,speed:51,r:19,behavior:'dagon',color:'#e59f91',attack:4.6,minWave:3,waterWalker:true,description:'An aquatic curse that crosses water and sends a spread of spectral fish.'},
 demonsoldier:{name:'Demon Soldier',family:'frieren',hp:1.5,speed:72,r:17,behavior:'demonsoldier',color:'#c8a8df',attack:4.4,description:'Aura’s horned swordsman. A short windup reveals the path of its cutting charge.'},
 angelspawn:{name:'Angel Fragment',family:'evangelion',hp:1.6,speed:52,r:18,behavior:'angelspawn',color:'#e4d6bd',attack:4.9,minWave:2,description:'A masked angel fragment whose red core marks a delayed cross-shaped blast.'},
 spiderdemon:{name:'Spider Demon',family:'demonslayer',hp:1.3,speed:67,r:18,behavior:'spiderdemon',color:'#dad5c5',attack:4.7,contactStatus:'poison',description:'Lays lingering web circles. Their first warning gives you time to escape the slow.'},
 zombie:{name:'Devil Zombie',family:'chainsawman',hp:1.4,speed:61,r:17,behavior:'zombie',color:'#b7b394',attack:3.7,contactStatus:'bleeding',description:'A ragged devil-controlled corpse that shambles faster when wounded and swings a cleaver.'},
};
export const ANIME_BOSSES={
 ...BERSERK_BOSSES,...JOJO_BOSSES,...TITAN_BOSSES,...WAR_BOSSES,...RIFT_BOSSES,...METROID_BOSSES,
 aura:{name:'Aura the Guillotine',title:'SAGE OF DESTRUCTION',family:'frieren',hp:2250,speed:46,r:35,color:'#dbaddf',behavior:'aura',description:'Soul Balance marks the ground, Guillotine cuts across escape routes, and obedient soldiers guard their master.'},
 mahito:{name:'Mahito',title:'CURSE OF HUMANITY',family:'jjk',hp:2400,speed:76,r:36,color:'#a9c8df',behavior:'mahito',description:'Transforms its body, creates transfigured humans and marks a dangerous Self-Embodiment domain.'},
 akaza:{name:'Akaza',title:'UPPER RANK THREE',family:'demonslayer',hp:2550,speed:91,r:34,color:'#e2a2ba',behavior:'akaza',description:'Compasses of delayed strikes, a destructive rush and spreading shockwave fists. Keep moving between the marks.'},
 sachiel:{name:'Sachiel',title:'THE THIRD ANGEL',family:'evangelion',hp:2700,speed:43,r:43,color:'#e3c995',behavior:'sachiel',description:'Cross-shaped light lances, temporary AT armor and a telegraphed core detonation.'},
};
export const ANIME_NAMES={overlord:'Overlord',berserk:'Berserk',onepunchman:'One Punch Man',jojo:'JoJo’s Bizarre Adventure',aot:'Attack on Titan',metroid:'Metroid',bleach:'Bleach',datealive:'Date A Live',onepiece:'One Piece',akame:'Akame ga Kill!',dragonball:'Dragon Ball',naruto:'Naruto',jjk:'Jujutsu Kaisen',madoka:'Madoka Magica',frieren:'Frieren',evangelion:'Evangelion',demonslayer:'Demon Slayer',fairytail:'Fairy Tail',tensura:'That Time I Got Reincarnated as a Slime',chainsawman:'Chainsaw Man'};
export function animeAttack(g,e,p,a,{fan,ring,hazard,summon}){
 if(berserkAttack(g,e,p,a,{fan,ring,hazard,summon}))return true;
 if(jojoAttack(g,e,p,a,{fan,ring,hazard,summon}))return true;
 if(titanAttack(g,e,p,a,{fan,ring,hazard,summon}))return true;
 if(metroidAttack(g,e,p,a,{fan,ring,hazard,summon}))return true;
 if(riftAttack(g,e,p,a,{fan,ring,hazard,summon}))return true;
 if(warAttack(g,e,p,a,{fan,ring,hazard,summon}))return true;
 const warn=(data)=>hazard(g,{...data,source:e.archetype});
 const line=(angle,length,width,label,damage=17,status='cursed',delay=.85)=>warn({shape:'line',x:e.x,y:e.y,tx:e.x+Math.cos(angle)*length,ty:e.y+Math.sin(angle)*length,width,delay,duration:.3,damage,status,color:e.color,label});
 const circle=(x,y,r,label,status='cursed',delay=.9,damage=13,duration=.35)=>warn({shape:'circle',x,y,r,label,status,delay,damage,duration,color:e.color});
 switch(e.behavior){
 case 'flyhead':fan(g,e,a,3,.3,150,'curse');break;
 case 'transfigured':e.windup=.55;e.dash=1.05;e.dashX=Math.cos(a);e.dashY=Math.sin(a);circle(p.x,p.y,37,'DISTORTED GRASP','cursed',.8,12);break;
 case 'jogo':fan(g,e,a,4,.22,185,'ember');circle(p.x,p.y,47,'VOLCANIC VENT','burning',1,13,1.1);e.windup=.5;break;
 case 'hanami':e.armorTime=1.7;for(let i=-1;i<=1;i++)circle(p.x+i*60,p.y+Math.sin(i+e.skill)*45,30,'CURSED ROOTS','slow',.85+Math.abs(i)*.15,8,1.2);break;
 case 'dagon':fan(g,e,a,5,.27,165,'fish');break;
 case 'demonsoldier':e.windup=.6;e.dash=.95;e.dashX=Math.cos(a);e.dashY=Math.sin(a);line(a,270,14,'DEMON BLADE',14,'bleeding',.6);break;
 case 'angelspawn':for(const angle of [0,Math.PI/2])warn({shape:'line',x:p.x-Math.cos(angle)*115,y:p.y-Math.sin(angle)*115,tx:p.x+Math.cos(angle)*115,ty:p.y+Math.sin(angle)*115,width:9,delay:1.1,duration:.2,damage:12,status:'burning',color:e.color,label:'ANGEL CROSS'});e.windup=.5;break;
 case 'spiderdemon':for(let i=-1;i<=1;i++)circle(p.x+i*55,p.y+i*20,33,'SILK SNARE','slow',.75,4,2);break;
 case 'zombie':circle(p.x,p.y,32,'CLEAVER','bleeding',.55,12);e.windup=.25;break;
 case 'aura':
   if(e.skill%3===1){e.balanceTimer=1.7;circle(p.x,p.y,95,'SOUL BALANCE','cursed',1.7,23);if(e.enraged)circle(p.x+140*Math.cos(a+1),p.y+140*Math.sin(a+1),70,'SOUL BALANCE','cursed',1.95,20);e.windup=.8;}
   else if(e.skill%3===2){summon(g,e,'demonsoldier',e.enraged?5:3);warn({shape:'line',x:p.x-340,y:p.y,tx:p.x+340,ty:p.y,width:19,delay:1.25,duration:.25,damage:24,status:'bleeding',color:'#dfb6e7',label:'GUILLOTINE'});}
   else{ring(g,e,e.enraged?14:9,g.time*.25,140,'soul');line(a,550,15,'OBEY',18,'cursed',1);}
   break;
 case 'mahito':
   if(e.skill%3===1){summon(g,e,'transfigured',e.enraged?5:3);e.armorTime=1.1;circle(e.x,e.y,65,'RESHAPE','cursed',.7,13);}
   else if(e.skill%3===2){for(let i=-1;i<=1;i++)line(a+i*.35,400,18,'IDLE TRANSFIGURATION',21,'cursed',.95);e.windup=.6;}
   else{circle(p.x,p.y,155,'SELF-EMBODIMENT','cursed',1.35,18,1.4);if(e.enraged)fan(g,e,a,7,.19,190,'curse');}
   break;
 case 'akaza':
   if(e.skill%3===1){e.compassTimer=3;for(let i=0;i<(e.enraged?10:6);i++){const aa=i*Math.PI*2/(e.enraged?10:6);circle(p.x+Math.cos(aa)*88,p.y+Math.sin(aa)*88,30,'COMPASS NEEDLE','stun',.8+i*.06,15);}}
   else if(e.skill%3===2){e.windup=.5;e.dash=1.15;e.dashX=Math.cos(a);e.dashY=Math.sin(a);line(a,450,22,'DESTRUCTIVE RUSH',23,'stun',.5);}
   else{fan(g,e,a,e.enraged?9:6,.2,240,'shockwave');ring(g,e,8,g.time,150,'shockwave');}
   break;
 case 'sachiel':
   if(e.skill%3===1){for(const angle of [a,a+Math.PI/2])warn({shape:'line',x:p.x-Math.cos(angle)*300,y:p.y-Math.sin(angle)*300,tx:p.x+Math.cos(angle)*300,ty:p.y+Math.sin(angle)*300,width:17,delay:1.15,duration:.3,damage:24,status:'burning',color:'#f1d6a0',label:'LIGHT LANCE'});e.windup=.7;}
   else if(e.skill%3===2){e.armorTime=3;ring(g,e,e.enraged?16:10,g.time,155,'lance');summon(g,e,'angelspawn',e.enraged?3:2);}
   else{circle(e.x,e.y,e.enraged?230:180,'CORE DETONATION','stun',1.25,26);e.windup=.9;}
   break;
 default:return false;
 }
 return true;
}
