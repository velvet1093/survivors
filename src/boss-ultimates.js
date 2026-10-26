import {statusModifiers} from './status.js';
import {motherBrainMuzzle} from './motherbrain-combat.js';
export const BOSS_ULTIMATES={
 frieza:{name:'SUPERNOVA',color:'#f3bb6d',charge:2.6,duration:3.4,cooldown:27,description:'Ultimate: Supernova locks a large impact circle, then drops a blazing sphere after a long charge. Leave the marked area.'},
 sukuna:{name:'MALEVOLENT SHRINE · WORLD CUT',color:'#f39db4',charge:2.1,duration:3.2,cooldown:29,description:'Ultimate: World Cut lays parallel, staggered cutting lanes across a shrine domain. Move into the gaps between lanes.'},
 aura:{name:'SOUL BALANCE · EXECUTION',color:'#c6a5ed',charge:2.2,duration:3.6,cooldown:26,description:'Ultimate: Soul Balance weighs two delayed seals before a narrow execution lane. Escape between the seals, then sidestep the final cut.'},
 motherbrain:{name:'RAINBOW HYPER BEAM',color:'#a8e3d8',charge:2.3,duration:4,cooldown:28,description:'Ultimate: The walking body braces and gathers a prismatic mouth charge for 2.3 seconds before releasing one enormous Rainbow Hyper Beam. The broad firing lane stays fixed throughout the charge; move sideways before it fires. It is available only after the tank breaks.'},
 bertholdt:{name:'COLOSSAL STEAM CATACLYSM',color:'#e7c5a0',charge:2,duration:4,cooldown:30,description:'Ultimate: The Colossal Titan vents a ring of scalding steam with an open escape corridor, then marks a giant footfall. Requires Titan form.'},
 itachi:{name:'TSUKUYOMI · CROW PRISON',color:'#e99aaa',charge:2.2,duration:4.3,cooldown:26,description:'Ultimate: Tsukuyomi surrounds your last position with slowing crow illusions, then curses the central eye. The broken seal marks an open escape corridor; the illusions cannot be attacked.'},
 ulquiorra:{name:'CERO · EMERALD DESPAIR',color:'#9deeb5',charge:2.4,duration:4,cooldown:25,description:'Ultimate: Ulquiorra holds a bright green Cero charge before firing a narrow, fixed-aim burning beam. Sidestep its marked lane. Segunda Etapa adds two delayed fork beams, each warned from the start.'},
 dio:{name:'THE WORLD · KNIFE HOUR',color:'#f3d58b',charge:2.2,duration:4.8,cooldown:28,description:'Ultimate: The World suspends two perpendicular knife volleys. The clock releases the gold lanes first, the violet lanes second, then a Road Roller crushes the original center. Move between the lanes and leave the final impact.'},
 kraid:{name:'BRINSTAR · SPIKE GAUNTLET',color:'#b9db9d',charge:2.2,duration:4.6,cooldown:27,description:'Ultimate: Three rows of belly spikes erupt in sequence, each with a broad, alternating opening. Follow the marked gaps or leave the bounded gauntlet before Kraid stamps the original target.'},
};
export function bossUltimatePaused(g,e){
 if(!e||e.hp<=0)return true;if(!statusModifiers(e).canAct)return true;
 if(g.ultimate?.type==='esdeath'&&Math.hypot(e.x-g.ultimate.x,e.y-g.ultimate.y)<g.ultimate.r)return true;
 return g.freeze>0&&Math.hypot(e.x-(g.ultimate?.x??g.p.x),e.y-(g.ultimate?.y??g.p.y))<(g.voidRadius||650);
}
export function updateBossUltimate(g,e,dt,{hazard}){
 const def=e.boss&&BOSS_ULTIMATES[e.archetype];if(!def)return false;
 if(bossUltimatePaused(g,e))return !!e.bossUltimate;
 if(e.bossUltimate){e.bossUltimate.age+=dt;e.moving=false;e.attackAnim=.2;if(e.bossUltimate.age>=def.duration){e.bossUltimate=null;e.attackAnim=0;e.attackCD=Math.max(e.attackCD,1.2);e.ultimateCD=def.cooldown;}return true;}
 // Older checkpoints gain a full opening cooldown, rather than firing on resume.
 e.ultimateCD??=18;e.ultimateCD=Math.max(0,e.ultimateCD-dt);
 if(e.archetype==='motherbrain'&&e.motherBrainAttack)return false;
 if(g.enemies.some(other=>other!==e&&other.hp>0&&other.bossUltimate))return false;
 if(e.ultimateCD>0||Math.hypot(e.x-g.p.x,e.y-g.p.y)>760||(['motherbrain','bertholdt'].includes(e.archetype)&&!e.enraged))return false;
 const x=g.p.x,y=g.p.y,a=Math.atan2(y-e.y,x-e.x);e.bossUltimate={age:0,x,y,angle:a,name:def.name,color:def.color};e.moving=false;e.dash=0;e.windup=0;e.attackAnim=.3;
 const h=data=>hazard(g,{...data,bossUltimate:true,cancelWithSource:true,source:e.archetype,sourceId:e.id,color:data.color||def.color}),circle=(cx,cy,r,label,delay,damage,status,duration=.5)=>h({shape:'circle',x:cx,y:cy,r,label,delay,damage,status,duration}),line=(cx,cy,angle,length,width,label,delay,damage,color)=>h({shape:'line',x:cx-Math.cos(angle)*length*.5,y:cy-Math.sin(angle)*length*.5,tx:cx+Math.cos(angle)*length*.5,ty:cy+Math.sin(angle)*length*.5,width,label,delay,duration:.4,damage,status:'cursed',color});
 if(e.archetype==='frieza')circle(x,y,145,'SUPERNOVA IMPACT',2.6,38,'burning',.65);
 else if(e.archetype==='sukuna')for(let i=-2;i<=2;i++)line(x-Math.sin(a)*i*67,y+Math.cos(a)*i*67,a,900,12,'WORLD CUT',2.1+Math.abs(i)*.2,28);
 else if(e.archetype==='aura'){circle(x-100,y,78,'SOUL SEAL · LEFT',2.2,26,'cursed');circle(x+100,y,78,'SOUL SEAL · RIGHT',2.7,26,'cursed');line(x,y,a,800,14,'EXECUTION',3,31);}
 else if(e.archetype==='motherbrain'){
  const u=e.bossUltimate,origin=motherBrainMuzzle(e),angle=Math.atan2(y-origin.y,x-origin.x);
  u.motherBrainVersion=1;u.facing=e.facing<0?-1:1;u.origin=origin;u.angle=angle;
  const beam={x:origin.x,y:origin.y,tx:origin.x+Math.cos(angle)*1100,ty:origin.y+Math.sin(angle)*1100,width:31,delay:2.3,duration:1.05};u.brainBeams=[beam];
  h({...beam,shape:'line',label:'RAINBOW HYPER BEAM',damage:42,status:'burning',sourceClock:true});
 }
 else if(e.archetype==='bertholdt'){for(let i=1;i<8;i++){const angle=a+i*Math.PI/4;circle(e.x+Math.cos(angle)*155,e.y+Math.sin(angle)*155,45,'STEAM VENT',2,22,'burning',1.45);}circle(x,y,68,'COLOSSAL FOOTFALL',3.1,32,'stun',.5);}
 else if(e.archetype==='itachi'){
  // These are bounded hazard seals, never enemy entities: attacking a double cannot
  // damage Itachi, award kills, or introduce regular enemies into Boss Rush.
  const u=e.bossUltimate,move=g.lastMove||{};u.gapAngle=Math.hypot(move.x||0,move.y||0)>.1?Math.atan2(move.y,move.x):a;u.radius=132;u.illusionSeals=[];
  for(let i=1;i<10;i++){const angle=u.gapAngle+i*Math.PI/5,cx=x+Math.cos(angle)*u.radius,cy=y+Math.sin(angle)*u.radius;u.illusionSeals.push({x:cx,y:cy,angle});circle(cx,cy,28,'GENJUTSU · CROW SEAL',2.2,12,'slow',1.65);}
  circle(x,y,65,'TSUKUYOMI · CURSED EYE',3.1,24,'cursed',.7);
 }else if(e.archetype==='ulquiorra'){
  const u=e.bossUltimate;u.ceros=[];
  for(const offset of e.enraged?[0,-.29,.29]:[0]){const angle=a+offset,delay=offset?3.2:2.4,beam={x:e.x+Math.cos(angle)*30,y:e.y+Math.sin(angle)*30,tx:e.x+Math.cos(angle)*1100,ty:e.y+Math.sin(angle)*1100,width:offset?9:12,delay,duration:offset?.45:.6};u.ceros.push(beam);h({...beam,shape:'line',label:offset?'SEGUNDA ETAPA · FORK CERO':'CERO · EMERALD DESPAIR',damage:offset?23:31,status:'burning'});}
 }else if(e.archetype==='dio'){
  const u=e.bossUltimate;u.knifeLanes=[];
  for(let wave=0;wave<2;wave++){const angle=a+wave*Math.PI/2;for(let i=-1;i<=1;i++){const cx=x-Math.sin(angle)*i*92,cy=y+Math.cos(angle)*i*92,lane={x:cx-Math.cos(angle)*280,y:cy-Math.sin(angle)*280,tx:cx+Math.cos(angle)*280,ty:cy+Math.sin(angle)*280,width:9,delay:2.2+wave,duration:.3,wave};u.knifeLanes.push(lane);h({...lane,shape:'line',label:wave?'TIME RESUMES · II':'TIME RESUMES · I',damage:24,status:'bleeding',color:wave?'#c6a8ec':def.color});}}
  circle(x,y,60,'ROAD ROLLER · FINAL SECOND',4.1,30,'stun',.45);
 }else if(e.archetype==='kraid'){
  const u=e.bossUltimate;u.spikeRows=[];
  for(let i=0;i<3;i++){const cx=x+Math.cos(a)*(i-1)*105,cy=y+Math.sin(a)*(i-1)*105,gap=(i%2?1:-1)*72,delay=2.2+i*.55,row={x:cx,y:cy,angle:a+Math.PI/2,gap,delay,duration:.4};u.spikeRows.push(row);
   for(const [start,end]of [[-225,gap-58],[gap+58,225]])h({shape:'line',x:cx-Math.sin(a)*start,y:cy+Math.cos(a)*start,tx:cx-Math.sin(a)*end,ty:cy+Math.cos(a)*end,width:14,label:'BELLY SPIKES · '+['I','II','III'][i],delay,duration:.4,damage:24,status:'bleeding'});
  }
  circle(x,y,62,'KRAID · COLOSSAL STAMP',3.9,28,'stun',.45);
 }
 g.toast=def.name+' · BOSS ULTIMATE';g.toastTime=3.2;return true;
}
