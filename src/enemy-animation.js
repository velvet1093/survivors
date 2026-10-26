import {JOJO_ENEMIES,JOJO_BOSSES} from './jojo-enemies.js';
import {METROID_ENEMIES,METROID_BOSSES} from './metroid-enemies.js';
import {RIFT_ENEMIES,RIFT_BOSSES} from './rift-enemies.js';
import {WAR_ENEMIES,WAR_BOSSES} from './war-enemies.js';
const jojoIds=Object.keys({...JOJO_ENEMIES,...JOJO_BOSSES});
const warIds=Object.keys({...WAR_ENEMIES,...WAR_BOSSES});
const riftIds=Object.keys({...RIFT_ENEMIES,...RIFT_BOSSES});
const metroidIds=Object.keys({...METROID_ENEMIES,...METROID_BOSSES});
const TAU=Math.PI*2;
export const ENEMY_MOTION_NAMES={eclipsefemto:'crimson eclipse halo and falcon wing levitation',tempestlord:'thunder drum halo and lightning staff flourish',frostregent:'frost-coated admiral stride and frozen-arm cast',eclipseapostle:'winged apostle stalk and claw reach',stormwraith:'wind-dragged storm cloak and lightning hands',frostwalker:'heavy faceted ice stride',possessedknight:'weighted plate stride and shield brace',eclipseheretic:'hooded procession and ritual staff lift',apostlehound:'four-legged bounding apostle gait',wingedapostle:'ragged membrane wingbeat and talon reach',zodd:'swordfighter weight transfer and horned beast wingbeat',grunbeld:'heavy crystal armor stride and dragon jaw recoil',femto:'falcon-wing levitation and gravity casting gesture',sukunaheian:'four-armed Heian martial stance and prayer seal',borosrift:'alien conqueror levitation and meteoric energy recoil',aizenrift:'transcendent winged levitation and mirrored casting gesture',madararift:'sage robe hover and Truth-Seeking Orb orbit',rumblingcolossal:'colossal steam march and weighted stomps',foundereren:'ribcage procession with suspended titan head',beerus:'feline levitation and Hakai casting hand',walpurgisrift:'inverted stage witch and rotating city gears',mimic:'jointed chest scuttle and hinged toothy bite',stonevampire:'vampiric cloak lunge',fleshbud:'parasite tendril dragging host',badcompany:'miniature rifle march',highwaystar:'segmented scent pursuit',sheerheart:'armored tread roll',dio:'confident time-stop pose',kira:'careful suit stride and detonator hand',kars:'light-blade stride and feathered wings',smilingtitan:'fixed-grin swaying reach',beardedtitan:'heavy belly and beard sway',crawlingtitan:'four-limb titan crawl',smalltitan:'short abnormal bounding gait',puretitan:'heavy reaching titan stagger',abnormal:'unbalanced titan sprint',annie:'warrior footwork and hardened kick',reiner:'shielded shoulder march',bertholdt:'quiet step and colossal steam stride',...Object.fromEntries(metroidIds.map((id,i)=>[id,({zoomer:'spiked shell scuttle',ripper:'armored wing drift',sidehopper:'double-jointed hop',zebesian:'pirate claw stalk',feralmetroid:'siphon tendril hover',ridley:'ridley membrane wingbeat',greenpirate:'double-claw sprint',redpirate:'plasma gunner sidestep',flyingpirate:'jetpack hover',goldpirate:'heavy armored counterstep',kraid:'colossus weighted stomp',motherbrain:'brain tank pulse, slow skeletal weight transfer and braced beam jaw'})[id]])),...Object.fromEntries(riftIds.map((id,i)=>[id,['four-arm wooden clatter','masked blade sprint','hungry mask lurch','cero wing flutter','juvenile ki hop','pendulum spirit drift','perfect armor stalk','raven cloak drift','espada winged glide'][i]])),...Object.fromEntries(warIds.map((id,i)=>[id,['rifle ready march','cutting sword sprint','braced artillery gait','heavy cyborg stride','hook raider sidestep','armored imperial march','low frost prowl','hood and staff sway','magma fist stomp','gliding ice step','light-speed sway','thunder gauntlet march','winged frost stride'][i]])),flyhead:'erratic wing hover',transfigured:'asymmetric dragging lunge',jogo:'volcanic bob and ember cast',hanami:'rooted branch stride',dagon:'tentacle paddle',demonsoldier:'armored sword gait',angelspawn:'stiff cross march',spiderdemon:'silk leg skitter',zombie:'wounded shoulder shamble',aura:'levitation and balance sway',mahito:'loose stitched-body swing',akaza:'bouncing martial footwork',sachiel:'heavy angel procession',saibaman:'spring-loaded hop',soldier:'armored heel march',shinobi:'low ninja sprint',snake:'traveling serpentine wave',curse:'asymmetric scuttle',cursedeye:'orbiting eye hover',familiar:'paper-doll waddle',butterfly:'figure-eight wing flight',rosewitch:'root-step and blossom nod',frieza:'levitation and tail whip',orochimaru:'serpentine robe glide',sukuna:'weighted martial stalk',walpurgis:'hanging stage procession'};
Object.assign(ENEMY_MOTION_NAMES,{zombiedevil:'lopsided infected shamble and claw reach',leechfiend:'ringed leech coil and eyestalk sway',batspawn:'quick membrane wingbeat and hanging claws',eternityflesh:'wall of faces dragging impossible limbs',katanaman:'sheathed blade stalk and steel draw stance',batdevil:'heavy bat wingbeat and sonic jaw brace',eternitydevil:'tooth-lined doorway and endless limb crawl',darknessdevil:'stacked skull procession, praying hands and skeletal crescent crest',deathdevil:'white funeral curtain sway, toothed spine and rigid bone spokes',hellhand:'detached shadow hand finger flex',darknessfragment:'fractured pale mask drift and trailing shadow'});
Object.assign(ENEMY_MOTION_NAMES,{gravezombie:'patchwork shamble and stiff reaching hands',coffincrawler:'coffin drag and skeletal arm scramble',lanternwisp:'soul lantern sway and floating flame',shadowstitch:'weighted stitched brute gait and arm windup',hollowghost:'hollow ghost bob and trailing pale tail',ryuma:'bandaged samurai footwork and fixed katana draw',moriah:'gothic shadowmaster gait and winged coat sway',peronaparade:'ghost princess hover and umbrella flourish',ainztomb:'skeletal sorcerer levitation and ritual staff lift',paradehollow:'bowed hollow bob and wailing mouth',tombsentinel:'armored skeletal sentinel march and blade brace'});
Object.assign(ENEMY_MOTION_NAMES,{eisenwald:'hooded cloak sway and gathering wind',vulcan:'heavy knuckle gait and hunched bob',phantomshade:'drifting hood and fraying shadow tail',orctrooper:'stomping march and cleaver swing',megalodon:'tail-beating glide and snapping jaws',lizardman:'tail sway and spear bracing',jellal:'coat flare and star-magic hand',geld:'lumbering stomp and cleaver heave',kokushibo:'ponytail sway and drawn flesh blade',acnologia:'vast wingbeats and coiling tail',milim:'bouncing twin tails and eager fists'});
export function enemyMotion(e,time=0,reduced=false){
  const motherCasting=e.archetype==='motherbrain'&&e.enraged&&(e.motherBrainAttack||e.bossUltimate||e.windup>0);
  const graveCasting=!!e.graveyardAttack||!!e.expeditionAttack||['acnologia','milim'].includes(e.archetype)&&!!e.riftAttack||['peronaparade','ainztomb'].includes(e.archetype)&&!!e.worldEventAttack;
  const primalCasting=['darknessdevil','deathdevil'].includes(e.archetype)&&(e.riftAttack||e.windup>0);
  const motion={cellStage:e.cellStage||0,enraged:e.enraged?1:0,x:0,y:0,rotation:0,scaleX:1,scaleY:1,leg:0,arm:0,head:0,tail:0,wingL:1,wingR:1,root:0,gear:0,attack:Math.max(0,e.attackAnim||0,motherCasting||primalCasting||graveCasting ? .9 : 0),facing:e.facing||1};
  if(reduced)return motion;
  const t=(e.animTime??time)+(e.phase||0)/TAU,move=e.moving===false?.16:1;
  switch(e.archetype){
    case 'eisenwald':motion.leg=Math.sin(t*TAU*.8)*3*move;motion.arm=Math.cos(t*TAU*.6)*3;motion.tail=Math.sin(t*TAU*.5)*2;break;
    case 'vulcan':motion.leg=Math.sin(t*TAU*.9)*4*move;motion.arm=Math.cos(t*TAU*.9)*5;motion.y=-Math.abs(Math.sin(t*TAU*.9))*1.6*move;motion.rotation=Math.sin(t*TAU*.45)*.03;break;
    case 'phantomshade':motion.y=-5+Math.sin(t*TAU*.7)*2.2;motion.tail=Math.sin(t*TAU*.6)*5;motion.arm=Math.cos(t*TAU*.5)*3;break;
    case 'orctrooper':motion.leg=Math.sin(t*TAU*.7)*4*move;motion.arm=Math.cos(t*TAU*.6)*3;motion.y=-Math.abs(Math.sin(t*TAU*.7))*move;break;
    case 'megalodon':motion.y=-6+Math.sin(t*TAU*.8)*2;motion.tail=Math.sin(t*TAU*1.4)*6;motion.rotation=Math.sin(t*TAU*.4)*.04;break;
    case 'lizardman':motion.leg=Math.sin(t*TAU*1)*4*move;motion.tail=Math.sin(t*TAU*.6)*5;motion.arm=-Math.cos(t*TAU*.7)*2;break;
    case 'jellal':motion.leg=Math.sin(t*TAU*.8)*3*move;motion.arm=Math.cos(t*TAU*.5)*3;motion.tail=Math.sin(t*TAU*.45)*4;break;
    case 'geld':motion.leg=Math.sin(t*TAU*.55)*4*move;motion.arm=Math.cos(t*TAU*.5)*4;motion.y=-Math.abs(Math.sin(t*TAU*.55))*1.2*move;motion.rotation=Math.sin(t*TAU*.3)*.02;break;
    case 'kokushibo':motion.leg=Math.sin(t*TAU*.85)*3*move;motion.arm=-Math.cos(t*TAU*.6)*2;motion.tail=Math.sin(t*TAU*.4)*4;break;
    case 'acnologia':motion.y=-4+Math.sin(t*TAU*.5)*2;motion.arm=Math.sin(t*TAU*.9)*6;motion.tail=Math.sin(t*TAU*.4)*5;motion.leg=Math.sin(t*TAU*.6)*2*move;break;
    case 'milim':motion.leg=Math.sin(t*TAU*1.3)*4*move;motion.arm=Math.cos(t*TAU*1.1)*4;motion.tail=Math.sin(t*TAU*.9)*4;motion.y=-Math.abs(Math.sin(t*TAU*1.3))*1.5;break;
    case 'gravezombie':motion.leg=Math.sin(t*TAU*.7)*4*move;motion.arm=Math.cos(t*TAU*.5)*4;motion.rotation=Math.sin(t*TAU*.5)*.04*move;break;
    case 'coffincrawler':motion.leg=Math.sin(t*TAU*1.8)*5*move;motion.arm=Math.cos(t*TAU*1.8)*4;motion.rotation=Math.sin(t*TAU*.9)*.035*move;break;
    case 'lanternwisp':motion.y=-5+Math.sin(t*TAU*.65)*2;motion.tail=Math.sin(t*TAU*.5)*4;motion.arm=Math.cos(t*TAU*.6)*3;break;
    case 'hollowghost':motion.y=-7+Math.sin(t*TAU*.8)*2.4;motion.tail=Math.cos(t*TAU*.7)*5;motion.rotation=Math.sin(t*TAU*.4)*.025;break;
    case 'paradehollow':motion.y=-6+Math.cos(t*TAU*.72)*2.7;motion.head=Math.sin(t*TAU*.3)*.8;motion.tail=Math.sin(t*TAU*.9)*3;motion.arm=Math.cos(t*TAU*.45)*2;break;
    case 'shadowstitch':motion.leg=Math.sin(t*TAU*.65)*3.5*move;motion.arm=Math.cos(t*TAU*.5)*4;motion.y=-Math.abs(Math.sin(t*TAU*.65))*1.4*move;motion.rotation=Math.cos(t*TAU*.4)*.014;break;
    case 'tombsentinel':motion.leg=Math.sin(t*TAU*.9)*3*move;motion.arm=-motion.leg*.55;motion.tail=Math.cos(t*TAU*.35);motion.y=-Math.abs(Math.sin(t*TAU*.9))*.7*move;break;
    case 'ryuma':motion.leg=Math.sin(t*TAU*.9)*4*move;motion.arm=-Math.cos(t*TAU*.7)*3;motion.tail=Math.sin(t*TAU*.45)*3;motion.y=-Math.abs(Math.sin(t*TAU*.9))*.7*move;break;
    case 'moriah':motion.leg=Math.sin(t*TAU*.6)*3*move;motion.arm=Math.cos(t*TAU*.5)*4;motion.tail=Math.sin(t*TAU*.4)*4;motion.y=Math.sin(t*TAU*.4)*.7;break;
    case 'peronaparade':motion.y=-4+Math.sin(t*TAU*.55)*2;motion.arm=Math.cos(t*TAU*.5)*3;motion.tail=Math.sin(t*TAU*.5)*4;motion.head=Math.sin(t*TAU*.3)*.5;break;
    case 'ainztomb':motion.y=-3+Math.sin(t*TAU*.4)*1.2;motion.arm=Math.cos(t*TAU*.45)*3;motion.tail=Math.sin(t*TAU*.3)*3;break;
    case 'zombiedevil':motion.leg=Math.sin(t*TAU*.75)*4*move;motion.arm=Math.cos(t*TAU*.5)*5;motion.rotation=Math.sin(t*TAU*.55)*.06*move;motion.y=-Math.abs(Math.sin(t*TAU*.75))*.7;break;
    case 'leechfiend':motion.tail=Math.sin(t*TAU*.65)*5;motion.arm=Math.cos(t*TAU*.8)*4;motion.y=-Math.abs(Math.sin(t*TAU*.65))*2*move;motion.rotation=Math.sin(t*TAU*.4)*.03;break;
    case 'batspawn':motion.y=-4+Math.sin(t*TAU*1.3)*2;motion.leg=Math.sin(t*TAU*.8)*3;motion.arm=Math.cos(t*TAU*.7)*4;motion.wingL=.6+(1+Math.sin(t*TAU*2.2))*.25;motion.wingR=.6+(1+Math.sin(t*TAU*2.2+.4))*.25;break;
    case 'eternityflesh':motion.leg=Math.sin(t*TAU*.6)*4*move;motion.arm=Math.cos(t*TAU*.8)*5;motion.rotation=Math.sin(t*TAU*.4)*.04;motion.y=Math.sin(t*TAU*.7)*1.3;break;
    case 'katanaman':motion.leg=Math.sin(t*TAU*1.1)*4*move;motion.arm=-Math.cos(t*TAU*.7)*2;motion.tail=Math.sin(t*TAU*.45)*4;motion.y=-Math.abs(Math.sin(t*TAU*1.1))*move;break;
    case 'batdevil':motion.y=-3+Math.sin(t*TAU*.6)*2;motion.leg=Math.sin(t*TAU*.6)*4;motion.arm=Math.cos(t*TAU*.55)*4;motion.wingL=.7+(1+Math.sin(t*TAU*.85))*.2;motion.wingR=.7+(1+Math.sin(t*TAU*.85+.3))*.2;break;
    case 'eternitydevil':motion.leg=Math.sin(t*TAU*.45)*4*move;motion.arm=Math.cos(t*TAU*.55)*5;motion.tail=Math.sin(t*TAU*.4)*4;motion.y=Math.sin(t*TAU*.45)*1.5;motion.rotation=Math.sin(t*TAU*.25)*.025;break;
    case 'darknessdevil':motion.y=-1+Math.sin(t*TAU*.3)*.8;motion.leg=Math.sin(t*TAU*.38)*2*move;motion.arm=Math.cos(t*TAU*.4)*4;motion.tail=Math.sin(t*TAU*.25)*4;motion.rotation=Math.sin(t*TAU*.2)*.008;break;
    case 'deathdevil':motion.y=-2+Math.sin(t*TAU*.24)*.8;motion.arm=Math.cos(t*TAU*.33)*3;motion.tail=Math.sin(t*TAU*.27)*4;motion.rotation=Math.sin(t*TAU*.15)*.006;break;
    case 'hellhand':motion.y=-4+Math.sin(t*TAU*.8)*3;motion.leg=Math.sin(t*TAU*.6)*3;motion.arm=Math.cos(t*TAU*.7)*3;motion.rotation=Math.sin(t*TAU*.5)*.06;break;
    case 'darknessfragment':motion.y=-5+Math.sin(t*TAU*.6)*2;motion.arm=Math.cos(t*TAU*.5)*3;motion.tail=Math.sin(t*TAU*.45)*4;motion.rotation=Math.sin(t*TAU*.35)*.04;break;
    case 'eclipsefemto':motion.y=-3+Math.sin(t*TAU*.45)*1.8;motion.tail=Math.sin(t*TAU*.4)*3;motion.arm=Math.cos(t*TAU*.6)*2;motion.wingL=.7+(1+Math.sin(t*TAU*.55))*.22;motion.wingR=.7+(1+Math.sin(t*TAU*.55+.3))*.22;break;
    case 'tempestlord':motion.y=-2+Math.sin(t*TAU*.65)*1.4;motion.leg=Math.sin(t*TAU*.7)*2*move;motion.arm=Math.cos(t*TAU*.6)*3;motion.rotation=Math.sin(t*TAU*.35)*.015;break;
    case 'frostregent':motion.leg=Math.sin(t*TAU*.9)*3*move;motion.arm=-Math.cos(t*TAU*.7)*2;motion.tail=Math.sin(t*TAU*.4)*3;motion.y=-Math.abs(Math.sin(t*TAU*.9))*.6*move;break;
    case 'eclipseapostle':motion.leg=Math.sin(t*TAU*1.3)*4*move;motion.arm=Math.cos(t*TAU*.8)*3;motion.wingL=.6+(1+Math.sin(t*TAU*1.2))*.3;motion.wingR=.6+(1+Math.sin(t*TAU*1.2+.2))*.3;motion.y=-Math.abs(Math.sin(t*TAU*1.3))*1.4*move;break;
    case 'stormwraith':motion.y=-4+Math.sin(t*TAU*.8)*3;motion.tail=Math.sin(t*TAU*.65)*4;motion.arm=Math.cos(t*TAU*.75)*3;motion.rotation=Math.sin(t*TAU*.4)*.025;break;
    case 'frostwalker':motion.leg=Math.sin(t*TAU*.85)*4*move;motion.arm=-motion.leg*.45;motion.y=-Math.abs(Math.sin(t*TAU*.85))*.8*move;break;
    case 'possessedknight':motion.leg=Math.sin(t*TAU*1.3)*4*move;motion.arm=-motion.leg*.45;motion.y=-Math.abs(Math.sin(t*TAU*1.3))*.7*move;motion.rotation=Math.sin(t*TAU*.65)*.025*move;break;
    case 'eclipseheretic':motion.leg=Math.sin(t*TAU*.8)*3*move;motion.arm=Math.cos(t*TAU*.55)*2;motion.tail=Math.sin(t*TAU*.55)*3;motion.y=-Math.abs(Math.sin(t*TAU*.8))*.5*move;break;
    case 'apostlehound':motion.leg=Math.sin(t*TAU*2.2)*5*move;motion.tail=Math.sin(t*TAU*1.1)*5;motion.y=-Math.abs(Math.sin(t*TAU*2.2))*2.5*move;motion.rotation=Math.sin(t*TAU*1.1)*.04*move;break;
    case 'wingedapostle':motion.y=-4+Math.sin(t*TAU*.8)*2;motion.leg=Math.sin(t*TAU*.7)*3;motion.arm=Math.cos(t*TAU*.55)*3;motion.wingL=.55+(1+Math.sin(t*TAU*1.4))*.22;motion.wingR=.55+(1+Math.sin(t*TAU*1.4+.4))*.22;motion.rotation=Math.sin(t*TAU*.6)*.025;break;
    case 'zodd':{const v=t*TAU*(e.enraged?.68:.85);motion.leg=Math.sin(v)*5*move;motion.arm=-Math.cos(v)*3*move;motion.y=-Math.abs(Math.sin(v))*(e.enraged?1.7:1)*move;motion.rotation=Math.sin(v*.5)*.025*move;motion.tail=Math.sin(v*.6)*4;motion.wingL=.55+(1+Math.sin(v*1.4))*.2;motion.wingR=.55+(1+Math.sin(v*1.4+.35))*.2;break;}
    case 'grunbeld':{const v=t*TAU*(e.enraged?.65:.72);motion.leg=Math.sin(v)*4*move;motion.arm=-Math.cos(v)*3*move;motion.y=-Math.abs(Math.sin(v))*1.3*move;motion.rotation=Math.sin(v*.5)*.02*move;motion.tail=Math.cos(v*.6)*4;motion.wingL=.55+(1+Math.sin(v*1.1))*.22;motion.wingR=.55+(1+Math.sin(v*1.1+.35))*.22;break;}
    case 'femto':motion.y=-4+Math.sin(t*TAU*.45)*2;motion.leg=Math.sin(t*TAU*.55)*1.5;motion.arm=Math.cos(t*TAU*.4)*3;motion.tail=Math.sin(t*TAU*.4)*4;motion.wingL=.55+(1+Math.sin(t*TAU*.5))*.2;motion.wingR=.55+(1+Math.sin(t*TAU*.5+.25))*.2;motion.rotation=Math.sin(t*TAU*.3)*.015;break;
    case 'sukunaheian':motion.leg=Math.sin(t*TAU*.85)*3.7*move;motion.arm=-Math.cos(t*TAU*.65)*3.5;motion.tail=Math.sin(t*TAU*.4)*2;motion.head=Math.sin(t*TAU*.3)*.6;motion.y=-Math.abs(Math.sin(t*TAU*.85))*1.2*move;motion.rotation=Math.sin(t*TAU*.55)*.018*move;break;
    case 'borosrift':motion.y=-3+Math.sin(t*TAU*.7)*2.2;motion.leg=Math.sin(t*TAU*1.1)*3*move;motion.arm=-Math.cos(t*TAU*.9)*3;motion.tail=Math.sin(t*TAU*.55)*4;motion.gear=t*TAU*.26;motion.head=Math.cos(t*TAU*.45)*1.1;motion.rotation=Math.sin(t*TAU*.35)*.02;break;
    case 'aizenrift':motion.y=-4+Math.sin(t*TAU*.45)*2;motion.tail=Math.sin(t*TAU*.35)*4;motion.arm=Math.cos(t*TAU*.4)*3;motion.wingL=.65+(1+Math.sin(t*TAU*.6))*.18;motion.wingR=.65+(1+Math.sin(t*TAU*.6+.35))*.18;motion.rotation=Math.sin(t*TAU*.2)*.018;break;
    case 'madararift':motion.y=-3+Math.sin(t*TAU*.55)*1.5;motion.tail=Math.sin(t*TAU*.4)*3;motion.arm=Math.cos(t*TAU*.5)*2;motion.leg=Math.sin(t*TAU*.6)*1.5*move;motion.gear=t*TAU*.18;motion.head=Math.cos(t*TAU*.3);break;
    case 'rumblingcolossal':motion.enraged=1;motion.leg=Math.sin(t*TAU*.48)*4*move;motion.arm=-Math.cos(t*TAU*.48)*5*move;motion.y=-Math.abs(Math.sin(t*TAU*.48))*2;motion.rotation=Math.sin(t*TAU*.28)*.035;break;
    case 'foundereren':motion.leg=Math.sin(t*TAU*.4)*4*move;motion.tail=Math.cos(t*TAU*.3)*3;motion.arm=Math.sin(t*TAU*.35)*2;motion.y=-Math.abs(Math.sin(t*TAU*.4))*.8;motion.rotation=Math.sin(t*TAU*.2)*.012;break;
    case 'beerus':motion.y=-4+Math.sin(t*TAU*.65)*2;motion.tail=Math.sin(t*TAU*.75)*6;motion.arm=Math.cos(t*TAU*.45)*2;motion.leg=Math.sin(t*TAU*.6)*1.5;motion.head=Math.sin(t*TAU*.25);break;
    case 'walpurgisrift':motion.gear=t*TAU*.22;motion.tail=Math.sin(t*TAU*.35)*3;motion.arm=Math.cos(t*TAU*.4)*4;motion.rotation=Math.sin(t*TAU*.2)*.035;motion.y=-3+Math.cos(t*TAU*.45)*2;break;
    case 'mimic':motion.leg=Math.sin(t*TAU*2.5)*5*move;motion.arm=Math.sin(t*TAU*1.5)*3;motion.head=Math.cos(t*TAU)*2;motion.y=-Math.abs(Math.sin(t*TAU*2.5))*2*move;motion.rotation=Math.sin(t*TAU*2.5)*.045*move;break;
    case 'flyhead':motion.x=Math.sin(t*TAU*.75)*4;motion.y=Math.cos(t*TAU*1.5)*3;motion.wingL=.4+(1+Math.sin(t*TAU*4))*.3;motion.wingR=.4+(1+Math.cos(t*TAU*4))*.3;motion.leg=Math.sin(t*TAU*2)*3;break;
    case 'transfigured':motion.rotation=Math.sin(t*TAU*1.25)*.09;motion.leg=Math.sin(t*TAU*1.25)*5*move;motion.arm=Math.cos(t*TAU*.75)*6;motion.y=-Math.abs(Math.sin(t*TAU*1.25));break;
    case 'jogo':motion.y=Math.sin(t*TAU*1.5)*1.3;motion.leg=Math.sin(t*TAU*1.5)*3*move;motion.arm=Math.cos(t*TAU)*2;break;
    case 'hanami':motion.leg=Math.sin(t*TAU*.75)*4*move;motion.arm=-motion.leg*.5;motion.rotation=Math.sin(t*TAU*.75)*.025;break;
    case 'dagon':motion.y=-Math.abs(Math.sin(t*TAU*1.25))*2;motion.tail=t*TAU*1.25;motion.arm=Math.sin(t*TAU*1.25)*3;break;
    case 'demonsoldier':motion.leg=Math.sin(t*TAU*1.75)*4*move;motion.arm=-motion.leg*.45;motion.y=-Math.abs(Math.sin(t*TAU*1.75));break;
    case 'angelspawn':motion.leg=Math.sin(t*TAU)*2.8*move;motion.arm=Math.cos(t*TAU)*2;motion.rotation=Math.sin(t*TAU*.5)*.02;break;
    case 'spiderdemon':motion.leg=Math.sin(t*TAU*2.5)*4;motion.arm=Math.cos(t*TAU*2.5)*2;motion.x=Math.sin(t*TAU*1.25)*1.2;break;
    case 'zombie':motion.rotation=Math.sin(t*TAU*.75)*.1;motion.leg=Math.sin(t*TAU*.75)*3*move;motion.arm=Math.cos(t*TAU*.75)*5;break;
    case 'aura':motion.y=-3+Math.sin(t*TAU*.75)*2;motion.tail=Math.sin(t*TAU*.5)*4;motion.arm=Math.sin(t*TAU*.75)*2;motion.rotation=Math.cos(t*TAU*.75)*.02;break;
    case 'mahito':motion.leg=Math.sin(t*TAU*1.25)*4*move;motion.arm=Math.sin(t*TAU*.75)*6;motion.rotation=Math.cos(t*TAU*1.25)*.04;break;
    case 'akaza':motion.y=-Math.abs(Math.sin(t*TAU*2))*3;motion.leg=Math.sin(t*TAU*2)*5*move;motion.arm=-motion.leg*.8;break;
    case 'sachiel':motion.leg=Math.sin(t*TAU*.5)*3*move;motion.arm=-motion.leg*.6;motion.y=-Math.abs(Math.sin(t*TAU*.5))*2;motion.rotation=Math.cos(t*TAU*.5)*.03;break;
    case 'saibaman':{const hop=Math.max(0,Math.sin(t*TAU*2));motion.y=-hop*7*move;motion.scaleX=1+(1-hop)*.06*move;motion.scaleY=1-(1-hop)*.06*move;motion.leg=Math.cos(t*TAU*2)*4*move;motion.arm=-hop*4;break;}
    case 'soldier':motion.y=-Math.abs(Math.sin(t*TAU*1.5))*1.1*move;motion.leg=Math.sin(t*TAU*1.5)*4*move;motion.arm=-motion.leg*.4;motion.rotation=Math.sin(t*TAU*1.5)*.025*move;break;
    case 'shinobi':motion.rotation=.12*motion.facing*move;motion.y=-Math.abs(Math.sin(t*TAU*3))*1.5*move;motion.leg=Math.sin(t*TAU*3)*5.5*move;motion.arm=6*move;break;
    case 'snake':motion.x=Math.sin(t*TAU*1.5)*2;motion.rotation=Math.sin(t*TAU*1.5)*.08;motion.tail=t*TAU*1.5;motion.head=Math.cos(t*TAU*1.5)*2;break;
    case 'curse':motion.x=Math.sin(t*TAU*2)*1.4*move;motion.rotation=Math.sin(t*TAU*2)*.065*move;motion.leg=Math.sin(t*TAU*2)*5*move;motion.arm=Math.cos(t*TAU*2)*4*move;break;
    case 'cursedeye':motion.x=Math.sin(t*TAU*.5)*3;motion.y=Math.cos(t*TAU)*3;motion.scaleX=1+Math.sin(t*TAU)*.035;motion.tail=t*TAU*.5;motion.head=Math.sin(t*TAU*.5)*2;break;
    case 'familiar':motion.rotation=Math.sin(t*TAU*2)*.16;motion.y=-Math.abs(Math.sin(t*TAU*2))*2;motion.leg=Math.sin(t*TAU*2)*3;motion.arm=-Math.sin(t*TAU*2)*3;break;
    case 'butterfly':motion.x=Math.sin(t*TAU*.5)*3.5;motion.y=Math.sin(t*TAU)*3;motion.wingL=.35+(Math.sin(t*TAU*4)+1)*.35;motion.wingR=.35+(Math.sin(t*TAU*4+.45)+1)*.35;motion.rotation=Math.cos(t*TAU*.5)*.08;break;
    case 'rosewitch':motion.root=Math.sin(t*TAU)*5*move;motion.head=Math.sin(t*TAU*.5)*.14;motion.y=-Math.abs(Math.sin(t*TAU))*1.5*move;motion.arm=Math.cos(t*TAU)*2;break;
    case 'frieza':motion.y=-3+Math.sin(t*TAU*.5)*2.8;motion.rotation=Math.cos(t*TAU*.5)*.025;motion.tail=Math.sin(t*TAU)*7;motion.leg=Math.sin(t*TAU*.5)*.8;motion.arm=Math.cos(t*TAU*.5)*1.5;break;
    case 'orochimaru':motion.x=Math.sin(t*TAU*.5)*2*move;motion.rotation=Math.sin(t*TAU*.5)*.045;motion.leg=Math.sin(t*TAU)*1.8*move;motion.tail=Math.sin(t*TAU*.5)*3;motion.arm=-Math.sin(t*TAU*.5)*2;break;
    case 'sukuna':motion.y=-Math.abs(Math.sin(t*TAU))*2*move;motion.leg=Math.sin(t*TAU)*4.5*move;motion.arm=-motion.leg*.7;motion.rotation=Math.cos(t*TAU)*.045*move;break;
    case 'walpurgis':motion.x=Math.sin(t*TAU*.25)*4;motion.y=Math.cos(t*TAU*.5)*2.5;motion.rotation=Math.sin(t*TAU*.25)*.08;motion.gear=t*TAU*.5;motion.arm=Math.sin(t*TAU*.5)*4;break;
  }
  if(jojoIds.includes(e.archetype)){
   const v=t*TAU;switch(e.archetype){
    case 'stonevampire':motion.leg=Math.sin(v*1.7)*4*move;motion.arm=-motion.leg*.7;motion.tail=Math.sin(v*.8)*3;motion.rotation=Math.sin(v)*.04;break;
    case 'fleshbud':motion.leg=Math.sin(v*1.2)*3*move;motion.arm=Math.cos(v*.9)*5;motion.tail=Math.sin(v*2)*4;motion.head=Math.sin(v*.7)*1.5;motion.rotation=Math.sin(v)*.06;break;
    case 'badcompany':motion.leg=Math.sin(v*2.5)*3*move;motion.arm=-motion.leg*.3;motion.y=-Math.abs(Math.sin(v*2.5));motion.rotation=Math.sin(v*1.25)*.025;break;
    case 'highwaystar':motion.leg=Math.sin(v*2.75)*5*move;motion.arm=-motion.leg*.9;motion.y=-Math.abs(Math.sin(v*2.75))*2;motion.rotation=.08*motion.facing*move;motion.tail=Math.cos(v*1.5)*3;break;
    case 'sheerheart':motion.y=Math.sin(v*4)*.5;motion.gear=v*3;motion.leg=Math.sin(v*4)*2;motion.arm=Math.cos(v*2);motion.rotation=Math.sin(v*2)*.025;break;
    case 'dio':motion.leg=Math.sin(v*1.1)*3*move;motion.arm=Math.sin(v*.7)*2;motion.tail=Math.cos(v*.6)*2;motion.head=Math.sin(v*.5);motion.rotation=Math.sin(v*.8)*.025;break;
    case 'kira':motion.leg=Math.sin(v*1.4)*3*move;motion.arm=Math.cos(v*1.4)*2;motion.head=Math.sin(v*.6);motion.y=-Math.abs(Math.sin(v*1.4))*.7;break;
    case 'kars':motion.leg=Math.sin(v*1.2)*4*move;motion.arm=-motion.leg*.5;motion.tail=Math.sin(v)*3;motion.wingL=.5+(1+Math.sin(v*1.7))*.3;motion.wingR=.5+(1+Math.sin(v*1.7+.5))*.3;motion.y=e.enraged?-2+Math.sin(v)*1.5:0;break;
   }
  }
  const wi=warIds.indexOf(e.archetype);if(wi>=0){const f=.5+(wi%7)*.25,v=t*TAU*f;motion.leg=Math.sin(v)*(3+wi*.12)*move;motion.arm=-Math.cos(v)*(2+wi*.1);motion.y=-Math.abs(Math.sin(v))*(.6+wi*.12);motion.rotation=Math.sin(v*.5)*(.02+wi*.002);motion.tail=v;motion.wingL=.6+(1+Math.sin(v))*.25;motion.wingR=.6+(1+Math.sin(v+.4))*.25;}
  const ri=riftIds.indexOf(e.archetype);if(ri>=0){const v=t*TAU*(.65+ri*.17);motion.leg=Math.sin(v)*(2.5+ri*.3)*move;motion.arm=Math.cos(v*.8)*(2+ri*.4);motion.y=-Math.abs(Math.sin(v))*(1+ri*.2);motion.rotation=Math.sin(v*.7)*(.025+ri*.003);motion.wingL=.5+(1+Math.sin(v*1.7))*.3;motion.wingR=.5+(1+Math.sin(v*1.7+.35))*.3;if(e.archetype==='timewraith'){motion.y=-4+Math.sin(v)*3;motion.leg=Math.sin(v)*2;}}
  const mi=metroidIds.indexOf(e.archetype);if(mi>=0){const v=t*TAU*(.85+mi*.19);motion.leg=Math.sin(v)*(3+mi*.4)*move;motion.arm=Math.cos(v*.75)*(2+mi*.35);motion.y=e.archetype==='sidehopper'?-Math.abs(Math.sin(v))*7:['feralmetroid','flyingpirate'].includes(e.archetype)?-3+Math.sin(v)*3:-Math.abs(Math.sin(v))*(.8+mi*.2);motion.rotation=Math.sin(v*.55)*(.02+mi*.007);motion.wingL=.5+(1+Math.sin(v*1.5))*.3;motion.wingR=.5+(1+Math.sin(v*1.5+.4))*.3;}
  const ti=['puretitan','abnormal','annie','reiner','bertholdt'].indexOf(e.archetype);if(ti>=0){const v=t*TAU*(.63+ti*.23)*(e.enraged?.65:1);motion.leg=Math.sin(v)*(3+ti*.3)*move;motion.arm=-Math.cos(v)*(2+ti*.65);motion.y=-Math.abs(Math.sin(v))*(1.1+ti*.3);motion.rotation=Math.sin(v*.6)*(.025+ti*.009);}
  const vi=['smilingtitan','beardedtitan','crawlingtitan','smalltitan'].indexOf(e.archetype);if(vi>=0){const v=t*TAU*(.58+vi*.41);motion.leg=Math.sin(v)*(3+vi*.7)*move;motion.arm=Math.cos(v*.9)*(3+vi*.5);motion.rotation=Math.sin(v*.65)*(.03+vi*.016);motion.y=vi===3?-Math.abs(Math.sin(v))*5:vi===2?Math.sin(v)*1.2:-Math.abs(Math.sin(v))*1.5;motion.head=Math.sin(v*.6)*2;}
  if(e.archetype==='motherbrain'&&!e.enraged){motion.leg=0;motion.arm=0;motion.y=Math.sin(t*TAU)*.6;motion.scaleX=1+Math.sin(t*TAU)*.012;motion.rotation=0;}
  if(e.archetype==='motherbrain'&&e.enraged){
   // The immense walking body advances with a slow, bent-knee weight transfer.
   // A cast braces both feet and hinges the jaw throughout the full warning.
   const stride=t*TAU*.43,stomp=e.motherBrainAttack?.style==='stomp';
   motion.leg=motherCasting?(stomp?Math.sin((e.motherBrainAttack.age||0)*8)*3:0):Math.sin(stride)*4*move;
   motion.arm=motherCasting?-2:Math.cos(stride*.5);motion.y=motherCasting?0:-Math.abs(Math.sin(stride))*1.2*move;motion.rotation=0;
  }
  if(e.archetype==='kraid'){motion.rotation=0;motion.y=-Math.abs(Math.sin(t*TAU*.5))*1.2;motion.leg=Math.sin(t*TAU*.5)*2*move;}
  if(e.windup>0){motion.scaleX*=1.05;motion.scaleY*=.96;motion.y+=1;}
  if(e.dash>0&&e.windup<=0){motion.rotation+=.14*motion.facing;motion.y-=2;}
  return motion;
}
