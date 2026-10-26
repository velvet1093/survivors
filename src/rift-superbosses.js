import {DARKNESS_BOSSES,darknessRiftAttack} from './darkness-rift.js';
import {DEATH_BOSSES,deathRiftAttack} from './death-rift.js';
import {EXPEDITION_RIFT_BOSSES,expeditionRiftAttack} from './expedition-enemies.js';
// Optional rift encounters have their own identities and attack rotations. These
// bosses never enter the ordinary wave or Boss Rush catalogs.
export const RIFT_SUPERBOSSES = {
  foundereren: {
    name:'Founding Titan Eren', title:'THE END OF THE WORLD', family:'aot',
    hp:24000, speed:31, r:56, color:'#e0c39b', behavior:'foundereren', riftOnly:true,
    description:'Rift superboss. The Rumbling calls real Colossal Titans into the arena and sends parallel crushing lanes with a broad central corridor, then a final central footfall. Founding Rib Cage surrounds your last position but leaves an open side. Colossal Footfalls march along your last movement direction. Up to two living Colossals stomp and vent steam; below half health Eren commands three, with wider footprints and an extra march. Defeating Eren dismisses his remaining Colossals.',
  },
  beerus: {
    name:'Beerus / Bills', title:'GOD OF DESTRUCTION', family:'dragonball',
    hp:20000, speed:92, r:36, color:'#cba9f3', behavior:'beerus', riftOnly:true,
    description:'Rift superboss. Hakai locks a violet destruction mark and four distant satellites. Afterimage Judgment warns three fixed-aim crossing strikes in sequence. Sphere of Destruction charges a huge central blast followed by a broken halo of detonations. Below half health the blasts grow and an extra afterimage appears. Leave marks and use the gaps; these attacks never track after their warning.',
  },
  walpurgisrift: {
    name:'Walpurgisnacht · Night of Calamity', title:'THE LAST CURTAIN', family:'madoka',
    hp:22000, speed:35, r:58, color:'#efacce', behavior:'walpurgisrift', riftOnly:true,
    description:'Rift superboss. Stage Collapse sweeps three rows with alternating wide safe openings. Witch’s Clock surrounds the last target position with gear seals and an open escape arc before the central curtain falls. Falling City drops staggered building-sized diagonal impacts. Below half health an extra row and two extra buildings join the performance. All marks stay fixed and disappear with the witch.',
  },
  aizenrift: {
    name:'Aizen · Hōgyoku Ascendant',title:'BEYOND THE LIMITS OF A SOUL',family:'bleach',
    hp:21500,speed:73,r:38,color:'#c7a9ef',behavior:'aizenrift',riftOnly:true,waterWalker:true,
    description:'Rift superboss. Kyōka Suigetsu surrounds the last target position with illusion doubles and staggered fixed sword cuts. Kurohitsugi raises a black coffin of seals with an open escape side before its central rupture. Fragor detonates a broken ring of soul charges, followed by an overwhelming center blast. Below half health another illusion and more soul charges join the sequences. Every strike is warned and stops tracking once marked.',
  },
  madararift: {
    name:'Madara · Ten-Tails Jinchūriki',title:'THE SAGE OF SIX PATHS RETURNS',family:'naruto',
    hp:23500,speed:66,r:42,color:'#d5dfbd',behavior:'madararift',riftOnly:true,waterWalker:true,
    description:'Rift superboss. Tengai Shinsei drops two staggered meteors and a broken debris halo; leave the first impact before the second lands. Truth-Seeking Orbs form a ring with an escape opening, then sweep fixed crossing spokes. Limbo: Border Jail sends marked shadow doubles through the last target position. Below half health the meteors grow, a second debris wave appears and an extra Limbo shadow attacks. All warnings retain fixed positions and pause with combat.',
  },
  sukunaheian: {
    name:'Sukuna · Heian Incarnation',title:'THE FOUR-ARMED KING OF CURSES',family:'jjk',
    hp:25500,speed:74,r:40,color:'#e7a599',behavior:'sukunaheian',riftOnly:true,
    description:'Rift superboss. Malevolent Shrine fans nine fixed radial cleaves around your last position, leaving an open escape side before the central execution. World-Cutting Dismantle follows with three staggered slashes and a perpendicular finisher. Furnace fires a warned flame arrow before a huge explosion and broken halo of burning debris. Below half health the cuts widen, Dismantle adds a fourth slash and Furnace spreads farther. Every mark locks before release; move through the opening and keep changing direction.',
  },
  borosrift: {
    name:'Boros · Meteoric Burst',title:'DOMINATOR OF THE UNIVERSE',family:'onepunchman',
    hp:25000,speed:86,r:42,color:'#e8a9d1',behavior:'borosrift',riftOnly:true,
    description:'Rift superboss. Meteoric Burst sends three warned afterimage rushes through your last position before a crushing final impact. Star Cannon charges a fixed chest beam, side detonations and a distant terminal blast. Collapsing Star Roaring Cannon gathers power for 2.75 seconds, then releases an immense straight beam followed by side craters. Below half health his armor gives way to released energy: a fourth rush joins the sequence, beams widen and blast zones grow. Leave the marked lane before release; none of the warnings track after appearing.',
  },
  ...DARKNESS_BOSSES,
  ...DEATH_BOSSES,
  ...EXPEDITION_RIFT_BOSSES,
};

const TAU=Math.PI*2;

// These are encounter-bound enemies, not extra bosses. They retain ordinary
// damage/HP and serialization, while their owner controls their finite lifetime.
function summonColossals(g,e,p,summon){
  if(typeof summon!=='function'||g.mode==='bossrush')return;
  const cap=e.enraged?3:2,living=g.enemies.filter(s=>s.archetype==='rumblingcolossal'&&s.ownerId===e.id&&s.hp>0),missing=cap-living.length;
  if(missing<=0)return;
  const occupied=new Set(living.map((s,i)=>s.riftColossalSlot??=i)),slots=Array.from({length:cap},(_,i)=>i).filter(i=>!occupied.has(i));
  const before=new Set(g.enemies.map(s=>s.id));summon(g,e,'rumblingcolossal',missing);
  const added=g.enemies.filter(s=>!before.has(s.id)&&s.archetype==='rumblingcolossal'&&s.ownerId===e.id);
  for(let i=0;i<added.length;i++){
    const s=added[i],slot=slots[i],inward=g.riftArena&&Math.hypot(p.x,p.y)>(g.riftArena.radius||760)*.5?Math.atan2(-p.y,-p.x):-Math.PI/2,
      angle=inward+(slot-(cap-1)/2)*1.15,edge=g.riftArena?Math.max(40,(g.riftArena.radius||760)-s.r):Infinity;
    Object.assign(s,{riftSummon:true,riftColossalSlot:slot,riftSerial:e.riftSerial??g.rifts?.active?.serial??0,
      x:Math.max(-edge,Math.min(edge,p.x+Math.cos(angle)*285)),y:Math.max(-edge,Math.min(edge,p.y+Math.sin(angle)*285)),attackCD:2.1+i*.35,windup:1.25});
  }
}

export function clearOrphanRiftSummons(g){
  const owners=new Set((g.enemies||[]).filter(e=>(e.archetype==='foundereren'||e.archetype==='darknessdevil')&&e.hp>0).map(e=>e.id));
  const removed=new Set((g.enemies||[]).filter(e=>e.riftSummon&&!owners.has(e.ownerId)).map(e=>e.id));
  if(!removed.size)return 0;
  g.enemies=g.enemies.filter(e=>!removed.has(e.id));
  g.enemyShots=(g.enemyShots||[]).filter(s=>!removed.has(s.sourceId));
  g.hazards=(g.hazards||[]).filter(h=>!removed.has(h.sourceId));
  return removed.size;
}

export function riftSuperbossAttack(g,e,p,a,{hazard,summon}) {
  if(deathRiftAttack(g,e,p,a,{hazard}))return true;
  if(expeditionRiftAttack(g,e,p,a,{hazard}))return true;
  if(darknessRiftAttack(g,e,p,a,{hazard,summon}))return true;
  if(!RIFT_SUPERBOSSES[e.archetype])return false;
  const count=e.skill%3, fierce=!!e.enraged;
  const mark=data=>hazard(g,{
    age:0, duration:.5, color:e.color, source:e.archetype, sourceId:e.id,
    cancelWithSource:true, bossUltimate:true, ...data,
  });
  const circle=(x,y,r,label,delay,damage,status='cursed',duration=.5)=>
    mark({shape:'circle',x,y,r,label,delay,damage,status,duration});
  const line=(x,y,angle,length,width,label,delay,damage,status='bleeding')=>
    mark({shape:'line',x:x-Math.cos(angle)*length/2,y:y-Math.sin(angle)*length/2,
      tx:x+Math.cos(angle)*length/2,ty:y+Math.sin(angle)*length/2,
      width,label,delay,damage,status});
  const tell=(name,style,duration,extra={})=>{
    e.riftAttack={name,style,age:0,duration,color:e.color,x:p.x,y:p.y,angle:a,...extra};
    e.windup=Math.max(e.windup,1.35);
    // Complete the marked sequence before starting another attack. Enrage adds
    // density and shortens recovery, rather than deleting its dodge warnings.
    e.attackCD=Math.max(e.attackCD,duration+(fierce?.45:.9));
    g.toast=name+' · RIFT ATTACK';g.toastTime=2.5;
  };
  const move=g.lastMove||{},escape=Math.hypot(move.x||0,move.y||0)>.1?Math.atan2(move.y,move.x):a;

  if(e.archetype==='foundereren') {
    if(count===1) {
      tell('THE RUMBLING · COLOSSAL VANGUARD','rumbling',3.9,{gapAngle:a});
      summonColossals(g,e,p,summon);
      // Four parallel Titan marches leave a 200+ unit central corridor. The
      // final footfall is warned from the start and lands after the marches.
      for(const i of [-2,-1,1,2])line(p.x-Math.sin(a)*i*132,p.y+Math.cos(a)*i*132,
        a,1100,fierce?31:25,'RUMBLING · TITAN MARCH',1.6+Math.abs(i)*.22,43,'burning');
      circle(p.x,p.y,fierce?98:76,'RUMBLING · FINAL FOOTFALL',3.25,52,'stun',.6);
    } else if(count===2) {
      tell('FOUNDING RIB CAGE','ribs',3.45,{gapAngle:escape,radius:190});
      // Omit the three points nearest the current movement direction, leaving a
      // broad open arc rather than surrounding the player with a solid ring.
      for(let i=2;i<11;i++) {
        const angle=escape+i*TAU/12;
        circle(p.x+Math.cos(angle)*190,p.y+Math.sin(angle)*190,fierce?43:36,
          'FOUNDING RIB · OPEN SIDE',1.5+(i%3)*.12,36,'bleeding',.65);
      }
      circle(p.x,p.y,80,'FOUNDING CORE · LEAVE THE CAGE',2.75,49,'cursed',.6);
    } else {
      const steps=fierce?5:4;
      tell('COLOSSAL FOOTFALLS','footfall',1.55+(steps-1)*.5+.55,{angle:escape});
      summonColossals(g,e,p,summon);
      for(let i=0;i<steps;i++)circle(p.x+Math.cos(escape)*i*105,p.y+Math.sin(escape)*i*105,
        fierce?76:62,'COLOSSAL FOOTFALL · '+(i+1),1.55+i*.5,47,'stun',.5);
    }
  } else if(e.archetype==='beerus') {
    if(count===1) {
      tell('HAKAI · ERASURE','hakai',3.35,{radius:fierce?117:96});
      circle(p.x,p.y,fierce?117:96,'HAKAI · LEAVE THE VIOLET MARK',1.9,58,'cursed',.55);
      for(let i=0;i<4;i++) {
        const angle=a+Math.PI/4+i*Math.PI/2;
        circle(p.x+Math.cos(angle)*190,p.y+Math.sin(angle)*190,fierce?46:35,
          'HAKAI · SATELLITE',2.65,36,'cursed',.6);
      }
    } else if(count===2) {
      const strikes=fierce?4:3;
      tell('AFTERIMAGE JUDGMENT','afterimages',1.5+(strikes-1)*.6+.5);
      for(let i=0;i<strikes;i++) {
        const angle=a+(i-1)*.4;
        line(e.x+Math.cos(angle)*460,e.y+Math.sin(angle)*460,angle,920,15,
          'AFTERIMAGE · '+(i+1),1.5+i*.6,45,'bleeding');
      }
    } else {
      tell('SPHERE OF DESTRUCTION','destruction',4.2,{radius:fierce?188:160,gapAngle:escape});
      circle(p.x,p.y,fierce?188:160,'DESTRUCTION SPHERE · EVACUATE',2.5,66,'burning',.65);
      for(let i=2;i<11;i++) {
        const angle=escape+i*TAU/12;
        circle(p.x+Math.cos(angle)*245,p.y+Math.sin(angle)*245,fierce?37:29,
          'DESTRUCTION · BROKEN HALO',3.5,36,'cursed',.65);
      }
    }
  } else if(e.archetype==='aizenrift') {
    if(count===1){
      const copies=fierce?4:3;
      tell('KYŌKA SUIGETSU · PERFECT HYPNOSIS','illusions',4.15,{points:[],radius:205});
      for(let i=0;i<copies;i++){
        const angle=escape+(i+.5)*TAU/copies,x=p.x+Math.cos(angle)*205,y=p.y+Math.sin(angle)*205,delay=1.6+i*.38;
        e.riftAttack.points.push({x,y,angle:angle+Math.PI,delay});
        line(p.x,p.y,angle,650,fierce?18:14,'ILLUSION DOUBLE · FIXED CUT '+(i+1),delay,41,'cursed');
      }
      circle(p.x,p.y,fierce?91:72,'HYPNOSIS · SHATTERED REFLECTION',3.4,48,'cursed',.6);
    }else if(count===2){
      tell('HADŌ 90 · KUROHITSUGI','prison',4.05,{radius:190,gapAngle:escape});
      for(let i=2;i<11;i++){
        const angle=escape+i*TAU/12;
        circle(p.x+Math.cos(angle)*190,p.y+Math.sin(angle)*190,fierce?39:31,
          'KUROHITSUGI · COFFIN SEAL',1.65+(i%3)*.15,38,'cursed',.65);
      }
      circle(p.x,p.y,fierce?124:103,'BLACK COFFIN · LEAVE THROUGH THE OPENING',3.15,59,'cursed',.65);
    }else{
      const charges=fierce?7:5;
      tell('FRAGOR · HŌGYOKU TRANSCENDENCE','fragor',4.2,{radius:205,gapAngle:escape,points:[]});
      for(let i=0;i<charges;i++){
        // Leave a full 90-degree escape wedge facing the movement direction.
        const angle=escape+Math.PI/4+(i+.5)*(TAU-Math.PI/2)/charges,x=p.x+Math.cos(angle)*205,y=p.y+Math.sin(angle)*205,delay=1.75+(i%3)*.18;
        e.riftAttack.points.push({x,y,r:fierce?50:39,delay});
        circle(x,y,fierce?50:39,'FRAGOR · SOUL CHARGE',delay,42,'burning',.6);
      }
      circle(p.x,p.y,fierce?134:112,'FRAGOR · TRANSCENDENT BURST',3.35,63,'cursed',.65);
    }
  } else if(e.archetype==='madararift') {
    if(count===1){
      const first={x:p.x,y:p.y,r:fierce?133:111,delay:1.85},second={x:p.x+Math.cos(escape)*190,y:p.y+Math.sin(escape)*190,r:fierce?153:129,delay:3.1};
      tell('TENGAI SHINSEI · TWO FALLING HEAVENS','meteors',4.4,{points:[first,second],gapAngle:escape});
      circle(first.x,first.y,first.r,'FIRST METEOR · KEEP MOVING',first.delay,58,'stun',.6);
      circle(second.x,second.y,second.r,'SECOND METEOR · CHANGE YOUR COURSE',second.delay,66,'stun',.65);
      for(let i=2;i<7;i++){
        const angle=escape+i*TAU/8;
        circle(p.x+Math.cos(angle)*245,p.y+Math.sin(angle)*245,fierce?46:35,'METEOR · BROKEN DEBRIS HALO',2.5,35,'burning',.5);
        if(fierce)circle(second.x+Math.cos(angle)*245,second.y+Math.sin(angle)*245,35,'SECOND METEOR · DEBRIS',3.75,34,'burning',.5);
      }
    }else if(count===2){
      tell('TRUTH-SEEKING ORBS · SIX PATHS','orbs',4.1,{radius:190,gapAngle:escape});
      for(let i=2;i<11;i++){
        const angle=escape+i*TAU/12;
        circle(p.x+Math.cos(angle)*190,p.y+Math.sin(angle)*190,fierce?40:31,'TRUTH ORB · OPEN ORBIT',1.6+(i%3)*.16,42,'cursed',.6);
      }
      for(const offset of [-.7,0,.7])line(p.x,p.y,a+Math.PI/2+offset,600,fierce?18:13,'TRUTH-SEEKING · FIXED SPOKE',3.25,46,'cursed');
    }else{
      const copies=fierce?5:4;
      tell('LIMBO · BORDER JAIL','limbo',4.35,{copies:[],radius:235});
      for(let i=0;i<copies;i++){
        const angle=escape+(i+.5)*TAU/copies,x=p.x+Math.cos(angle)*235,y=p.y+Math.sin(angle)*235,delay=1.6+i*.45;
        e.riftAttack.copies.push({x,y,angle:angle+Math.PI,delay});
        line(p.x,p.y,angle,690,fierce?23:18,'LIMBO SHADOW · '+(i+1),delay,44,'stun');
      }
    }
  } else if(e.archetype==='sukunaheian') {
    if(count===1){
      tell('MALEVOLENT SHRINE · HEIAN EXECUTION','shrine',4.05,{radius:230,gapAngle:escape,spokes:[]});
      for(let i=2;i<11;i++){
        const angle=escape+i*TAU/12,delay=1.55+(i%3)*.18,width=fierce?16:11,
          cut={x:p.x+Math.cos(angle)*65,y:p.y+Math.sin(angle)*65,
            tx:p.x+Math.cos(angle)*360,ty:p.y+Math.sin(angle)*360,width,delay};
        e.riftAttack.spokes.push({...cut});
        mark({shape:'line',...cut,label:'SHRINE · RADIAL CLEAVE',damage:39,status:'bleeding',duration:.45});
      }
      circle(p.x,p.y,fierce?120:90,'SHRINE · CENTRAL EXECUTION',3.1,59,'cursed',.65);
    }else if(count===2){
      const cuts=fierce?4:3;
      tell('WORLD-CUTTING DISMANTLE','worldslash',5,{lines:[]});
      for(let i=0;i<cuts;i++){
        const angle=a+(i-(cuts-1)/2)*.32,delay=1.65+i*.65,width=fierce?19:14,
          cut={x:p.x-Math.cos(angle)*480,y:p.y-Math.sin(angle)*480,
            tx:p.x+Math.cos(angle)*480,ty:p.y+Math.sin(angle)*480,width,delay};
        e.riftAttack.lines.push({...cut});
        mark({shape:'line',...cut,label:'DISMANTLE · FIXED WORLD CUT '+(i+1),damage:46,status:'bleeding',duration:.45});
      }
      const angle=a+Math.PI/2,cut={x:p.x-Math.cos(angle)*480,y:p.y-Math.sin(angle)*480,
        tx:p.x+Math.cos(angle)*480,ty:p.y+Math.sin(angle)*480,width:fierce?23:18,delay:fierce?4.3:3.7};
      e.riftAttack.lines.push({...cut});mark({shape:'line',...cut,label:'WORLD CUT · PERPENDICULAR FINISHER',damage:56,status:'bleeding',duration:.5});
    }else{
      tell('FURNACE · DIVINE FLAME','furnace',4.55,{origin:{x:e.x,y:e.y-45},target:{x:p.x,y:p.y},radius:fierce?190:160,gapAngle:escape,points:[]});
      line(p.x,p.y,a,880,fierce?25:18,'FURNACE · FLAME ARROW',1.65,42,'burning');
      circle(p.x,p.y,fierce?190:160,'FURNACE · LEAVE THE CORE',2.9,66,'burning',.6);
      for(let i=0;i<6;i++){
        const angle=escape+Math.PI/4+(i+.5)*(TAU-Math.PI/2)/6,
          point={x:p.x+Math.cos(angle)*295,y:p.y+Math.sin(angle)*295,r:fierce?54:43,delay:3.7};
        e.riftAttack.points.push({...point});circle(point.x,point.y,point.r,'FURNACE · BROKEN BURNING HALO',point.delay,36,'burning',.6);
      }
    }
  } else if(e.archetype==='borosrift') {
    if(count===1){
      const rushes=fierce?4:3;
      tell('METEORIC BURST · LIMIT RELEASE','meteoric',4.6,{copies:[],radius:220});
      for(let i=0;i<rushes;i++){
        const angle=escape+(i+.5)*TAU/rushes,delay=1.55+i*.55;
        e.riftAttack.copies.push({x:p.x+Math.cos(angle)*220,y:p.y+Math.sin(angle)*220,angle:angle+Math.PI,delay});
        line(p.x,p.y,angle,700,fierce?23:18,'METEORIC AFTERIMAGE · '+(i+1),delay,44,'stun');
      }
      circle(p.x,p.y,fierce?110:85,'METEORIC BURST · FINAL IMPACT',3.75,55,'stun',.55);
    }else if(count===2){
      const origin={x:e.x,y:e.y-45},angle=Math.atan2(p.y-origin.y,p.x-origin.x),
        beam={...origin,tx:origin.x+Math.cos(angle)*1050,ty:origin.y+Math.sin(angle)*1050,width:fierce?45:30,delay:1.9,duration:.65};
      tell('STAR CANNON · CONCENTRATED ENERGY','starcannon',4.4,{beam,points:[],radius:fierce?112:90,angle});
      mark({shape:'line',...beam,label:'STAR CANNON · FIXED CHEST BEAM',damage:58,status:'burning'});
      for(const side of [-1,1])for(let i=0;i<2;i++){
        const offset=(170+i*130)*side,point={x:p.x-Math.sin(angle)*offset,y:p.y+Math.cos(angle)*offset,r:fierce?61:48,delay:2.75+i*.4};
        e.riftAttack.points.push({...point});circle(point.x,point.y,point.r,'STAR CANNON · SIDE DETONATION',point.delay,38,'burning',.5);
      }
      const point={x:p.x+Math.cos(angle)*220,y:p.y+Math.sin(angle)*220,r:fierce?112:90,delay:3.55};
      e.riftAttack.points.push({...point});circle(point.x,point.y,point.r,'STAR CANNON · TERMINAL BLAST',point.delay,52,'burning',.6);
    }else{
      const origin={x:e.x,y:e.y-48},angle=Math.atan2(p.y-origin.y,p.x-origin.x),
        beam={...origin,tx:origin.x+Math.cos(angle)*1250,ty:origin.y+Math.sin(angle)*1250,width:fierce?82:64,delay:2.75,duration:.75};
      tell('COLLAPSING STAR ROARING CANNON','roaring',4.7,{beam,points:[],angle});
      mark({shape:'line',...beam,label:'ROARING CANNON · LEAVE THE LANE',damage:70,status:'burning'});
      for(const side of [-1,1])for(let i=0;i<2;i++){
        const point={x:p.x-Math.sin(angle)*190*side+Math.cos(angle)*i*150,
          y:p.y+Math.cos(angle)*190*side+Math.sin(angle)*i*150,r:fierce?86:70,delay:3.7+i*.3};
        e.riftAttack.points.push({...point});circle(point.x,point.y,point.r,'ROARING CANNON · SIDE CRATER',point.delay,43,'burning',.6);
      }
    }
  } else {
    if(count===1) {
      const rows=fierce?4:3;
      tell('STAGE COLLAPSE','stage',1.65+(rows-1)*.6+.55,{rows:[]});
      for(let i=0;i<rows;i++) {
        const x=p.x+Math.cos(a)*(i-1)*110,y=p.y+Math.sin(a)*(i-1)*110,
          gap=(i%2?1:-1)*104,delay=1.65+i*.6;
        e.riftAttack.rows.push({x,y,angle:a+Math.PI/2,gap,delay});
        for(const [start,end]of [[-330,gap-78],[gap+78,330]])mark({
          shape:'line',x:x-Math.sin(a)*start,y:y+Math.cos(a)*start,
          tx:x-Math.sin(a)*end,ty:y+Math.cos(a)*end,width:24,
          label:'STAGE COLLAPSE · '+(i+1),delay,damage:44,status:'stun',
        });
      }
    } else if(count===2) {
      tell('WITCH’S CLOCK · LAST CURTAIN','clock',3.85,{gapAngle:escape,radius:185});
      for(let i=2;i<11;i++) {
        const angle=escape+i*TAU/12;
        circle(p.x+Math.cos(angle)*185,p.y+Math.sin(angle)*185,fierce?40:33,
          'WITCH’S CLOCK · GEAR SEAL',1.5+(i%4)*.15,36,'slow',.7);
      }
      circle(p.x,p.y,fierce?108:82,'LAST CURTAIN · STAGE CORE',3.1,55,'cursed',.65);
    } else {
      const buildings=fierce?5:3;
      tell('FALLING CITY','buildings',1.7+(buildings-1)*.42+.6,{angle:a+Math.PI/4});
      for(let i=0;i<buildings;i++) {
        const offset=(i-(buildings-1)/2)*152,x=p.x-Math.sin(a)*offset,y=p.y+Math.cos(a)*offset;
        line(x,y,a+Math.PI/4,215,fierce?44:36,'FALLING CITY · BUILDING '+(i+1),
          1.7+i*.42,49,'burning');
      }
    }
  }
  return true;
}
