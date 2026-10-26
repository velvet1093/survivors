export const WAR_ENEMIES={
 marine:{name:'Marine Marksman',family:'onepiece',hp:1.2,speed:52,r:16,behavior:'marine',color:'#c8dce4',attack:4,description:'A naval rifleman marks a narrow firing line before shooting.'},
 marinesword:{name:'Marine Swordsman',family:'onepiece',hp:1.6,speed:77,r:17,behavior:'marinesword',color:'#9dbcd1',attack:4.5,description:'A cutting charge follows three staggered slash warnings.'},
 cannonier:{name:'Naval Cannonier',family:'onepiece',hp:1.8,speed:40,r:19,behavior:'cannonier',color:'#d2c6a9',attack:5,minWave:2,description:'Bombards your last position with delayed cannon blasts. Leave the marked circle.'},
 pacifista:{name:'Pacifista',family:'onepiece',hp:3.2,speed:34,r:23,behavior:'pacifista',color:'#b8ac8f',attack:5.4,minWave:3,description:'An armored cyborg charges a long light beam and disperses laser bolts.'},
 pirate:{name:'Bay Raider',family:'onepiece',hp:1.2,speed:79,r:16,behavior:'pirate',color:'#c79991',attack:4,contactStatus:'bleeding',description:'Throws a grappling hook that drags you toward its source if it connects.'},
 imperial:{name:'Imperial Guard',family:'akame',hp:1.7,speed:64,r:18,behavior:'imperial',color:'#c8d6e2',attack:4.6,description:'Raises armor before a warned stunning spear strike.'},
 frostbeast:{name:'Frost Danger Beast',family:'akame',hp:2,speed:89,r:21,behavior:'frostbeast',color:'#adcddd',attack:4.8,contactStatus:'slow',description:'A low prowling beast with a telegraphed ice pounce.'},
 icemage:{name:'Imperial Cryomancer',family:'akame',hp:1.1,speed:45,r:16,behavior:'icemage',color:'#b6d9ef',attack:5,description:'Plants freezing ice mines that linger after their first warning.'},
};
export const WAR_BOSSES={
 akainu:{name:'Akainu',title:'MAGMA ADMIRAL',family:'onepiece',hp:2700,speed:59,r:37,color:'#e4a17c',behavior:'akainu',description:'Meteor marks become burning magma pools. Magma fists and a volcanic rush punish standing still.'},
 aokiji:{name:'Aokiji',title:'ICE ADMIRAL',family:'onepiece',hp:2600,speed:60,r:36,color:'#b1d9ed',behavior:'aokiji',description:'Ice Age spreads freezing lanes, followed by ice-spear fans and a glacial ring.'},
 kizaru:{name:'Kizaru',title:'LIGHT ADMIRAL',family:'onepiece',hp:2450,speed:82,r:35,color:'#ead99a',behavior:'kizaru',description:'A light-speed dash repositions him before crossed laser marks and a wide light volley.'},
 budo:{name:'General Budo',title:'THUNDER EMPEROR',family:'akame',hp:2800,speed:54,r:39,color:'#d4bbdf',behavior:'budo',description:'Charges Adramelech lightning pillars, gains thunder armor, then sends a radial shock wave.'},
 icedragon:{name:'Northern Ice Dragon',title:'IMPERIAL DANGER BEAST',family:'akame',hp:3000,speed:48,r:45,color:'#badced',behavior:'icedragon',description:'Breath sweeps marked lanes, falling ice seals escape routes, and a wing rush scatters frozen shards.'},
};
export function warAttack(g,e,p,a,{fan,ring,hazard}){
 const circle=(x,y,r,label,status='burning',delay=1,damage=15,duration=.3)=>hazard(g,{shape:'circle',x,y,r,label,status,delay,damage,duration,color:e.color});
 const line=(aa,length,width,label,status='burning',delay=.9,damage=18)=>hazard(g,{shape:'line',x:e.x,y:e.y,tx:e.x+Math.cos(aa)*length,ty:e.y+Math.sin(aa)*length,width,label,status,delay,duration:.3,damage,color:e.color});
 const rush=()=>{e.windup=.55;e.dash=1.1;e.dashX=Math.cos(a);e.dashY=Math.sin(a);};
 switch(e.behavior){
 case 'marine':line(a,620,7,'AIMED SHOT','bleeding',.9,12);e.windup=.6;break;
 case 'marinesword':rush();for(let i=-1;i<=1;i++)line(a+i*.18,260,12,'SWORD COMBO','bleeding',.55+(i+1)*.16,11);break;
 case 'cannonier':circle(p.x,p.y,56,'CANNON FALL','burning',1.3,20);e.windup=.6;break;
 case 'pacifista':e.windup=1;line(a,750,17,'PACIFISTA LASER','burning',1,21);if(e.skill%2===0)ring(g,e,8,g.time,160,'lance');break;
 case 'pirate':fan(g,e,a,1,0,210,'hook');circle(p.x,p.y,26,'RAIDER CUT','bleeding',.75,9);break;
 case 'imperial':e.armorTime=1.4;line(a,240,14,'IMPERIAL THRUST','stun',.8,13);break;
 case 'frostbeast':rush();circle(p.x,p.y,42,'FROST POUNCE','slow',.65,15);break;
 case 'icemage':for(let i=-1;i<=1;i++)circle(p.x+i*65,p.y+Math.sin(i+e.phase)*45,32,'ICE MINE','frozen',1,8,1.2);break;
 case 'akainu':
  if(e.skill%3===1){for(let i=0;i<(e.enraged?7:4);i++)circle(p.x+Math.cos(i*2.399)*i*24,p.y+Math.sin(i*2.399)*i*24,45,'MAGMA METEOR','burning',1.1+i*.12,19,2.3);}
  else if(e.skill%3===2)fan(g,e,a,e.enraged?9:6,.22,210,'magma');else{rush();line(a,500,32,'GREAT ERUPTION','burning',.6,25);}break;
 case 'aokiji':
  if(e.skill%3===1){for(let i=-1;i<=1;i++)line(a+i*.38,650,19,'ICE AGE','frozen',1.1+Math.abs(i)*.15,20);e.windup=.8;}
  else if(e.skill%3===2)fan(g,e,a,e.enraged?11:7,.16,220,'icicle');else{for(let i=0;i<8;i++)circle(p.x+Math.cos(i*Math.PI/4)*100,p.y+Math.sin(i*Math.PI/4)*100,35,'GLACIAL RING','frozen',.85+i*.06,16);}break;
 case 'kizaru':
  if(e.skill%3===1){rush();line(a,580,12,'LIGHT SPEED','burning',.55,20);}
  else if(e.skill%3===2){for(const aa of [a,a+Math.PI/2])hazard(g,{shape:'line',x:p.x-Math.cos(aa)*330,y:p.y-Math.sin(aa)*330,tx:p.x+Math.cos(aa)*330,ty:p.y+Math.sin(aa)*330,width:12,delay:1,duration:.25,damage:22,status:'burning',label:'SACRED LIGHT',color:e.color});}
  else{fan(g,e,a,e.enraged?15:10,.13,270,'lance');ring(g,e,10,g.time,170,'lance');}break;
 case 'budo':
  if(e.skill%3===1){for(let i=0;i<6;i++)circle(p.x+Math.cos(i*1.05)*95,p.y+Math.sin(i*1.05)*95,32,'ADRAMMELECH','stun',.85+i*.1,19);}
  else if(e.skill%3===2){e.armorTime=2.5;ring(g,e,e.enraged?20:12,g.time,190,'thunder');circle(e.x,e.y,120,'THUNDER ARMOR','stun',1,20);}
  else{line(a,650,28,'THUNDER EMPEROR','stun',1.15,26);e.windup=.9;}break;
 case 'icedragon':
  if(e.skill%3===1){for(let i=-1;i<=1;i++)line(a+i*.25,600,27,'FROST BREATH','frozen',1.1+Math.abs(i)*.12,21);}
  else if(e.skill%3===2){for(let i=0;i<7;i++)circle(p.x+Math.cos(i*2.399)*i*22,p.y+Math.sin(i*2.399)*i*22,34,'FALLING ICE','frozen',.9+i*.12,17);}
  else{rush();ring(g,e,e.enraged?20:12,g.time,170,'icicle');line(a,440,32,'WING RUSH','slow',.6,24);}break;
 default:return false;
 }return true;
}
