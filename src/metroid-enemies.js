import {castMotherBrainAttack} from './motherbrain-combat.js';
export const METROID_ENEMIES={
 greenpirate:{name:'Green Space Pirate',family:'metroid',hp:1.5,speed:108,r:17,behavior:'greenpirate',color:'#9bc6a4',attack:3.5,contactStatus:'bleeding',description:'A fast skirmisher with a double claw rush. A short warned lane shows where its claws will land.'},
 redpirate:{name:'Red Plasma Pirate',family:'metroid',hp:2,speed:58,r:18,behavior:'redpirate',color:'#e0a0a0',attack:4.2,minWave:2,description:'A ranged pirate that fans plasma bolts and plants a lingering burning mark beneath your position.'},
 flyingpirate:{name:'Aerotrooper',family:'metroid',hp:1.6,speed:90,r:17,behavior:'flyingpirate',waterWalker:true,color:'#b8bee2',attack:4.3,minWave:2,description:'Jetpack-equipped pirates cross waterways and release curving missile fans, followed by a warned landing blast.'},
 goldpirate:{name:'Elite Gold Pirate',family:'metroid',hp:3.2,speed:72,r:21,behavior:'goldpirate',color:'#e6c890',attack:5,minWave:4,description:'Periodically gains temporary armor, then counters with a broad warned claw lane and radial plasma.'},
 zoomer:{name:'Zoomer',family:'metroid',hp:1.1,speed:66,r:14,behavior:'zoomer',color:'#d9a979',attack:3.8,description:'A low, spiked crawler that sheds a ring of sharp motes around its shell.'},
 ripper:{name:'Ripper',family:'metroid',hp:1.8,speed:70,r:16,behavior:'ripper',waterWalker:true,color:'#b8a78e',attack:4.8,description:'An armored flyer. Its shell hardens while it charges a warned lane, then becomes vulnerable again.'},
 sidehopper:{name:'Sidehopper',family:'metroid',hp:1.4,speed:96,r:17,behavior:'sidehopper',color:'#cda175',attack:4,description:'Spring-loaded legs carry it into a pounce. Two delayed landing circles bracket your escape.'},
 zebesian:{name:'Zebesian Space Pirate',family:'metroid',hp:2,speed:72,r:18,behavior:'zebesian',color:'#b68bba',attack:4.4,minWave:2,contactStatus:'bleeding',description:'Alternates plasma fans with a warned claw rush. Stay between its plasma bolts.'},
 feralmetroid:{name:'Feral Metroid',family:'metroid',hp:1.2,speed:87,r:15,behavior:'feralmetroid',waterWalker:true,color:'#d9a38f',attack:4.2,minWave:2,description:'A hostile life-draining creature. Its marked siphon and soul bolts slow you; bolts that hit restore its health.'},
};
export const METROID_BOSSES={
 kraid:{name:'Kraid',title:'THE COLOSSUS OF BRINSTAR',family:'metroid',hp:4200,speed:39,r:50,behavior:'kraid',color:'#a9c99a',attack:4,description:'A towering reptile that alternates belly-spike lanes, bouncing spike fans and delayed ground stomps. Phase II doubles the stomp pattern and adds spikes.'},
 motherbrain:{name:'Mother Brain',title:'THE AURORA OF TOURIAN',family:'metroid',hp:4400,speed:38,r:46,behavior:'motherbrain',stationary:true,color:'#e0a7c0',attack:4,description:'Phase I is a stationary glass tank with temporary armor, Rinka rings and warned brain lasers. Below half health the tank shatters and a towering skeletal body rises. Her walking form plants its feet for eye-fired Rinka volleys, a fixed-aim mouth Hyper Beam and three crushing steps. A fully charged Rainbow Hyper Beam becomes available.'},ridley:{name:'Ridley',title:'CUNNING GOD OF DEATH',family:'metroid',hp:3100,speed:85,r:42,behavior:'ridley',waterWalker:true,color:'#c7a2dc',description:'A winged pirate commander: fiery breath, warned tail lanes and staggered aerial bombardment. Phase II adds more bombs and flame bolts.'}};
export function metroidAttack(g,e,p,a,{fan,ring,hazard}){
 const circle=(x,y,r,label,status,delay=.85,damage=15,duration=.4)=>hazard(g,{shape:'circle',x,y,r,label,status,delay,damage,duration,color:e.color,source:e.archetype});
 const line=(length,width,label,status,delay=.8,damage=18)=>hazard(g,{shape:'line',x:e.x,y:e.y,tx:e.x+Math.cos(a)*length,ty:e.y+Math.sin(a)*length,width,label,status,delay,damage,duration:.35,color:e.color,source:e.archetype});
 switch(e.behavior){
 case 'greenpirate':e.windup=.7;e.dash=1.35;e.dashX=Math.cos(a);e.dashY=Math.sin(a);line(340,15,'DUAL CLAW','bleeding',.7,17);line(340,10,'RETURN CLAW','bleeding',1.15,12);break;
 case 'redpirate':fan(g,e,a,5,.17,200,'plasma');circle(p.x,p.y,35,'PLASMA MINE','burning',1,13,2.2);break;
 case 'flyingpirate':{const before=g.enemyShots.length;fan(g,e,a,3,.35,170,'plasma');for(const q of g.enemyShots.slice(before))q.turn=.32;circle(p.x,p.y,44,'JET LANDING','stun',1.2,14);break;}
 case 'goldpirate':e.armorTime=2.2;line(430,29,'ELITE COUNTER','bleeding',1.1,24);ring(g,e,8,g.time,150,'plasma');e.windup=.85;break;
 case 'kraid':if(e.skill%3===1){for(let i=-1;i<=1;i++){const angle=a+i*.2;hazard(g,{shape:'line',x:e.x,y:e.y,tx:e.x+Math.cos(angle)*750,ty:e.y+Math.sin(angle)*750,width:17,delay:1.05+Math.abs(i)*.14,duration:.4,damage:25,label:'BELLY SPIKES',status:'bleeding',color:e.color});}e.windup=.9;}else if(e.skill%3===2){fan(g,e,a,e.enraged?11:7,.23,180,'thorn');}else{for(let i=0;i<(e.enraged?6:3);i++)circle(p.x+(i%3-1)*75,p.y+Math.floor(i/3)*85,49,'BRINSTAR STOMP','stun',1.1+i*.16,23,.5);}break;
 case 'motherbrain':if(e.enraged){castMotherBrainAttack(g,e,p,{fan,hazard});}else if(e.skill%3===1){e.armorTime=2;ring(g,e,10,g.time*.4,130,'rinka');}else if(e.skill%3===2){line(780,17,'BRAIN LASER','burning',1.2,25);e.windup=.9;}else{for(let i=0;i<3;i++)circle(p.x+(i-1)*58,p.y+Math.sin(i*2)*55,44,'PSYCHIC BURST','cursed',1+i*.2,18,.55);}break;
 case 'zoomer':ring(g,e,6,g.time,140,'thorn');break;
 case 'ripper':e.armorTime=1.8;e.windup=.8;e.dash=1.25;e.dashX=Math.cos(a);e.dashY=Math.sin(a);line(360,16,'RIPPER CHARGE','stun',.8,15);break;
 case 'sidehopper':e.windup=.65;e.dash=1.05;e.dashX=Math.cos(a);e.dashY=Math.sin(a);for(let i=0;i<2;i++)circle(p.x+(i?55:-25),p.y+(i?-30:0),32,'HOP LANDING','stun',.75+i*.22,12);break;
 case 'zebesian':if(e.skill%2){fan(g,e,a,5,.18,210,'plasma');}else{e.windup=.65;e.dash=1.1;e.dashX=Math.cos(a);e.dashY=Math.sin(a);line(300,16,'PIRATE CLAW','bleeding',.65,16);}break;
 case 'feralmetroid':{const before=g.enemyShots.length;fan(g,e,a,2,.25,155,'drain');for(const s of g.enemyShots.slice(before))s.leech=.6;circle(p.x,p.y,37,'ENERGY SIPHON','slow',1,9);break;}
 case 'ridley':if(e.skill%3===1){fan(g,e,a,e.enraged?9:6,.18,215,'ember');line(620,22,'PLASMA BREATH','burning',1.05,25);e.windup=.7;}else if(e.skill%3===2){line(500,24,'TAIL SKEWER','bleeding',1,26);e.windup=.8;e.dash=1.4;e.dashX=Math.cos(a);e.dashY=Math.sin(a);}else{for(let i=0;i<(e.enraged?7:4);i++)circle(p.x+Math.cos(i*2.399)*i*27,p.y+Math.sin(i*2.399)*i*27,42,'AERIAL BOMBARDMENT','burning',1+i*.14,20,.7);}break;
 default:return false;
 }return true;
}
