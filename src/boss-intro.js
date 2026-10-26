import {enemyPixels} from './pixel-enemies.js';
import {pixelsSvg} from './pixel-characters.js';
import {cinematicArt} from './boss-cinema-art.js';

// Entrance names describe a short vision of the boss's signature power. The
// vision can reveal a Titan body without changing the live boss's phase.
export const BOSS_CINEMATICS={
 jellal:{theme:'cosmic',ability:'HEAVENLY BODY MAGIC · GRAND CHARIOT',caption:'Seven stars align over a blue-haired mage. The red mark beneath his eye glows as the sky answers.',beats:['THE STARS BEGIN TO MOVE','THE GRAND CHARIOT TAKES SHAPE','HEAVEN FALLS ON HIS COMMAND'],duration:4.3},
 geld:{theme:'horror',ability:'STARVED · THE ORC DISASTER',caption:'An endless army marches out of the swamp. At its heart a crowned Orc Lord devours everything in his path.',beats:['THE HUNGRY ARMY MARCHES','THE ORC LORD RAISES HIS CLEAVER','NOTHING IS LEFT UNEATEN'],duration:4.4},
 kokushibo:{theme:'ritual',ability:'MOON BREATHING · UPPER MOON ONE',caption:'Crescent blades hang in the night air. Six eyes open above a blade grown from living flesh.',beats:['THE MOON RISES RED','SIX EYES OPEN IN THE DARK','THE FIRST FORM IS DRAWN'],duration:4.4},
 acnologia:{theme:'cosmic',ability:'DRAGON’S ROAR · THE APOCALYPSE',caption:'Storm clouds split around a black dragon traced in blue light. Its roar has ended an age before.',beats:['THE SKY TURNS BLACK','THE DRAGON KING DESCENDS','THE ROAR OF THE APOCALYPSE'],duration:4.6},
 milim:{theme:'inferno',ability:'DRAGO NOVA · THE DESTROYER',caption:'A small pink-haired girl grins at the horizon. The ground cracks as a Demon Lord decides to play.',beats:['A DEMON LORD IS BORED','THE DESTROYER WANTS TO PLAY','DRAGO NOVA'],duration:4.4},
 ryuma:{theme:'ritual',ability:'FLYING DRAGON DRAW · THE SWORD GOD',caption:'A bandaged swordsman waits between the grave rows. One black blade catches the moon before its shadow moves.',beats:['A SWORDSMAN BENEATH THE MOON','THE BLACK BLADE LEAVES ITS SHEATH','EVEN THE DEAD REMEMBER HIS NAME'],duration:4.2},
 moriah:{theme:'horror',ability:'SHADOW ASGARD · RULER OF THRILLER BARK',caption:'The lanterns dim as a laughing shadow crosses the graves. Bats gather around the master of stolen silhouettes.',beats:['THE GRAVES CAST LONG SHADOWS','THE MASTER OF THRILLER BARK LAUGHS','YOUR SHADOW IS NOT YOUR OWN'],duration:4.4},
 peronaparade:{theme:'horror',ability:'NEGATIVE HOLLOW · THE GHOST PARADE',caption:'Pale lanterns drift between the tombstones. The Ghost Princess opens her parasol, and every hollow turns toward you.',beats:['THE HOLLOW LANTERNS ARE LIT','THE GHOST PRINCESS OPENS HER PARASOL','THE PARADE HAS FOUND ITS AUDIENCE'],duration:4.3},
 ainztomb:{theme:'cosmic',ability:'FALLEN DOWN · THE GREAT TOMB AWAKENS',caption:'An ancient seal breaks beneath the mausoleum. A skeletal king raises his staff, and cold magic silences the dead.',beats:['THE TOMB BREAKS ITS SEAL','THE SORCERER KING RAISES HIS STAFF','BOW BEFORE THE RULER OF DEATH'],duration:4.5},
 katanaman:{theme:'ritual',ability:'SWORD HYBRID · IAI DRAW',caption:'A hand settles against a sheathed blade. The street falls silent before the first impossible cut.',beats:['THE SHEATH FALLS SILENT','STEEL TAKES THE SHAPE OF A DEVIL','DO NOT STAND IN HIS PATH'],duration:4.3},
 batdevil:{theme:'horror',ability:'BAT DEVIL · SONIC ROAR',caption:'A wing blocks the skyline. The mouth beneath it gathers a roar that shakes the street.',beats:['A SHADOW ABOVE THE ROOFTOPS','THE BAT DEVIL OPENS ITS WINGS','THE AIR IS ABOUT TO BREAK'],duration:4.3},
 eternitydevil:{theme:'horror',ability:'ETERNITY DEVIL · THE EIGHTH FLOOR',caption:'The same corridor waits behind every door. Teeth open where the exit should have been.',beats:['THE CLOCK HAS STOPPED','EVERY EXIT RETURNS YOU HERE','THE EIGHTH FLOOR NEVER ENDS'],duration:4.5},
 darknessdevil:{theme:'astronauts',ability:'PRIMORDIAL FEAR · PROCESSION OF ASTRONAUTS',caption:'Two rows of silent astronauts kneel beneath a moonless sky. A black shape waits at the end of their prayer.',beats:['THE ASTRONAUTS KNEEL','A PRAYER WITHOUT AN ANSWER','THE DARKNESS STANDS BEFORE YOU'],duration:6.2},
 deathdevil:{theme:'lastsilence',ability:'DEATH DEVIL · THE LAST SILENCE',caption:'White curtains part beneath an inverted city. Every mouth behind them shares the same final breath.',beats:['THE BELLS STOP RINGING','THE WHITE CURTAINS PART','ALL ROADS END HERE'],duration:5.2},
 eclipsefemto:{theme:'horror',ability:'THE ECLIPSE · GOD HAND',caption:'The Beherit opens its eye. A black sun watches the gathering of Apostles.',beats:['THE SUN CLOSES ITS EYE','THE APOSTLES GATHER','THE GOD HAND DESCENDS'],duration:4.4},
 tempestlord:{theme:'thunder',ability:'RAIGO · THUNDER SUN',caption:'Thunder drums call across the rain. A dark sphere gathers the storm above a laughing god.',beats:['THE RAIN HIDES A DRUMBEAT','EL THOR SPLITS THE SKY','RAIGO SWALLOWS THE SUN'],duration:4.3},
 frostregent:{theme:'frost',ability:'WHITEOUT · ICE AGE',caption:'Snow erases the horizon. The admiral walks through a world of frozen silence.',beats:['THE WIND FALLS SILENT','THE HORIZON FREEZES','ICE AGE'],duration:4.2},
 zodd:{theme:'horror',ability:'THE IMMORTAL · APOSTLE’S ROAR',caption:'A great blade falls silent. Horns rise behind the shadow of an immortal warrior.',beats:['A WARRIOR WHO CANNOT DIE','THE APOSTLE UNFURLS HIS WINGS','THE IMMORTAL DEMANDS A FIGHT'],duration:4.2},
 grunbeld:{theme:'inferno',ability:'CORUNDUM DRAGON · CRYSTAL INFERNO',caption:'Crystal armor catches the eclipse. Fire moves beneath the scales of a living fortress.',beats:['THE FLAME DRAGON KNIGHT','CORUNDUM ARMOR AWAKENS','THE DRAGON BREATHES FIRE'],duration:4.2},
 femto:{theme:'cosmic',ability:'THE FIFTH HAND · GRAVITY OF FATE',caption:'A black wing covers the sun. Space bends around the shape of a silent hand.',beats:['THE ECLIPSE CLOSES ITS EYE','THE FIFTH HAND DESCENDS','EVEN SPACE BOWS BEFORE HIM'],duration:4.4},
 sukunaheian:{theme:'heianshrine',ability:'HEIAN INCARNATION · MALEVOLENT SHRINE',caption:'Four hands form the seal. The shrine opens its jaws, and the air itself is cut apart.',beats:['THE ANCIENT BODY RETURNS','THE SHRINE HAS NO BARRIER','FOUR HANDS OPEN THE FURNACE'],duration:4.7},
 borosrift:{theme:'starconqueror',ability:'METEORIC BURST · COLLAPSING STAR',caption:'Armor falls from the conqueror. One burning eye gathers the light of a dying star.',beats:['THE CONQUEROR DESCENDS','THE RESTRAINTS FALL AWAY','A STAR IS ABOUT TO ROAR'],duration:4.6},
 foundereren:{theme:'horror',ability:'THE RUMBLING · SPINE OF THE WORLD',caption:'The horizon becomes a forest of bone. A million footsteps answer.',beats:['THE RIFT REVEALS THE PATHS','THE FOUNDING TITAN AWAKENS','THE RUMBLING HAS BEGUN'],duration:4.6},
 beerus:{theme:'cosmic',ability:'HAKAI · GOD OF DESTRUCTION',caption:'A violet sun rests above a single finger. Even the stars fall silent.',beats:['A GOD CROSSES THE RIFT','THE ENERGY OF DESTRUCTION','TRY TO SURVIVE HIS CURIOSITY'],duration:4.4},
 walpurgisrift:{theme:'horror',ability:'NIGHT OF CALAMITY · LAST CURTAIN',caption:'An inverted city turns inside the clockwork. Tonight, the stage consumes the world.',beats:['THE CLOCKWORK CITY TURNS','THE FINAL CURTAIN RISES','NO AUDIENCE LEAVES UNCHANGED'],duration:4.6},
 aizenrift:{theme:'hogyoku',ability:'KYŌKA SUIGETSU · SHATTERED REALITY',caption:'The mirrors fracture. White wings unfold around a heart that refuses to obey death.',beats:['WHEN DID THE ILLUSION BEGIN?','THE HŌGYOKU ANSWERS','REALITY BELONGS TO AIZEN'],duration:4.6},
 madararift:{theme:'sixpaths',ability:'SIX PATHS · A HEAVEN OF FALLING STARS',caption:'A crimson moon watches the Divine Tree. Beneath it, even the heavens become a weapon.',beats:['THE DIVINE TREE TAKES ROOT','THE TEN-TAILS AWAKENS','WHAT WILL YOU DO ABOUT THE SECOND ONE?'],duration:4.8},
 dio:{theme:'time',ability:'THE WORLD',caption:'Time stops. Only the tyrant can move.',beats:['THE CLOCK TURNS','TIME HAS STOPPED','TIME WILL RESUME'],duration:4.2},
 kira:{theme:'ritual',ability:'KILLER QUEEN · FIRST BOMB',caption:'A quiet touch. A fatal consequence.',beats:['A PERFECTLY QUIET LIFE','THE SWITCH IS PRESSED','DO NOT LOOK AWAY']},
 kars:{theme:'cosmic',ability:'ULTIMATE LIFE FORM',caption:'Razor feathers unfold beneath an impossible dawn.',beats:['THE LAST PILLAR MAN','LIFE WITHOUT LIMITS','THE HUNT BEGINS']},
 reiner:{theme:'titan',ability:'ARMORED TITAN · WARRIOR’S ROAR',caption:'Armor cracks the silence. The walls answer his roar.',beats:['THE GROUND TREMBLES','THE ARMORED TITAN ROARS','A WARRIOR STANDS BEFORE YOU'],duration:4.1},
 annie:{theme:'titan',ability:'FEMALE TITAN · HARDENING',caption:'Crystal armor catches the light of a shattered wall.',beats:['A SOLDIER’S SILENCE','THE FEMALE TITAN AWAKENS','NO STEP IS WASTED']},
 bertholdt:{theme:'titan',ability:'COLOSSAL TITAN · SCALDING STEAM',caption:'A silhouette rises beyond the wall. Steam swallows the sky.',beats:['A SHADOW ABOVE THE WALL','THE COLOSSAL TITAN RISES','THE AIR ITSELF BURNS']},
 itachi:{theme:'illusion',ability:'TSUKUYOMI · CROW PRISON',caption:'One red eye opens. The battlefield becomes an illusion.',beats:['DO NOT MEET HIS GAZE','CAUGHT IN THE SHARINGAN','THE CROWS ARE WATCHING']},
 ulquiorra:{theme:'cero',ability:'CERO · EMERALD DESPAIR',caption:'A silent finger gathers a light that devours the horizon.',beats:['AN EMPTY SKY','CERO IS CHARGING','DESPAIR HAS A COLOR']},
 cell:{theme:'bio',ability:'BIO-ANDROID · PERFECT EVOLUTION',caption:'A living shell parts. A stronger body waits inside.',beats:['A PERFECT ORGANISM','THE NEXT EVOLUTION','PERFECTION TAKES THE STAGE']},
 frieza:{theme:'cosmic',ability:'DEATH BALL · IMPERIAL DECREE',caption:'A small star forms above an emperor’s hand.',beats:['THE EMPEROR DESCENDS','A STAR IN HIS PALM','KNEEL BEFORE FRIEZA']},
 aokiji:{theme:'frost',ability:'ICE AGE',caption:'Frost crawls over the horizon before the admiral takes a step.',beats:['THE SEA FALLS SILENT','ICE AGE','A FROZEN HORIZON']},
 icedragon:{theme:'frost',ability:'NORTHERN WINTER · DRAGON BREATH',caption:'Crystal wings open above a storm of broken ice.',beats:['A NORTHERN SHADOW','THE WINTER TAKES FLIGHT','THE SKY TURNS TO ICE']},
 akainu:{theme:'inferno',ability:'MAGMA FIST · ERUPTION',caption:'The earth splits. A rain of molten judgment follows.',beats:['THE GROUND GLOWS RED','ABSOLUTE JUSTICE','THE VOLCANO WALKS']},
 ridley:{theme:'inferno',ability:'SPACE PIRATE · INFERNO',caption:'Razor wings cut through a sky of embers.',beats:['WINGS IN THE ASH','THE SPACE PIRATE DESCENDS','THE HUNTER IS HUNTED']},
 budo:{theme:'thunder',ability:'ADRAMELECH · THUNDER ARMOR',caption:'Lightning writes the general’s name across the sky.',beats:['THE AIR CRACKLES','ADRAMELECH AWAKENS','THE THUNDER EMPEROR']},
 kizaru:{theme:'thunder',ability:'YATA MIRROR · LIGHT-SPEED ARRIVAL',caption:'A golden path bends across the rift. The admiral is already here.',beats:['A STRAY GOLDEN RAY','LIGHT HAS NO PATIENCE','DID YOU SEE HIM ARRIVE?']},
 kraid:{theme:'mechanical',ability:'BRINSTAR · TITANIC STAMP',caption:'Seismic warnings echo through an ancient alien stronghold.',beats:['SEISMIC WARNING','BRINSTAR’S GUARDIAN','THE FLOOR WILL NOT SAVE YOU']},
 motherbrain:{theme:'mechanical',ability:'TOURIAN · HYPER BEAM',caption:'An organic eye wakes behind glass and steel.',beats:['SECURITY BREACH','CENTRAL INTELLIGENCE ONLINE','HYPER BEAM ARMED']},
 aura:{theme:'ritual',ability:'AUSERLESE · SCALES OF OBEDIENCE',caption:'The golden balance turns. A soul is placed upon the scales.',beats:['A GOLDEN BALANCE','YOUR SOUL IS WEIGHED','OBEY THE GUILLOTINE']},
 sukuna:{theme:'ritual',ability:'MALEVOLENT SHRINE',caption:'A blood-red shrine unfolds where no sanctuary should stand.',beats:['A CURSE IN THE FLESH','THE SHRINE OPENS','THE KING OF CURSES']},
 akaza:{theme:'ritual',ability:'COMPASS NEEDLE · DESTRUCTIVE DEATH',caption:'A compass blooms beneath the feet of an unyielding fighter.',beats:['A FIGHTER’S CHALLENGE','THE COMPASS READS YOUR SPIRIT','COME CLOSER']},
 sachiel:{theme:'mechanical',ability:'THIRD ANGEL · CROSS OF LIGHT',caption:'An alien core pulses. A cross breaks through the cloud line.',beats:['UNIDENTIFIED LIFE FORM','THE ANGEL’S CORE OPENS','A CROSS AGAINST THE SKY']},
 orochimaru:{theme:'horror',ability:'IMMORTAL SERPENT · SHEDDING',caption:'A discarded skin falls away. Something older emerges.',beats:['A WHISPER IN THE GRASS','THE SERPENT SHEDS ITS SKIN','DEATH IS ONLY A DETOUR']},
 mahito:{theme:'horror',ability:'IDLE TRANSFIGURATION',caption:'Pale hands close around the shape of a soul.',beats:['A SOUL BETWEEN HIS HANDS','THE SHAPE OF HUMANITY TWISTS','TOUCH IS ENOUGH']},
 walpurgis:{theme:'horror',ability:'WALPURGISNACHT · THE CURTAIN RISES',caption:'Gears turn above an empty stage. The city becomes a theater.',beats:['A DISTANT LAUGHTER','THE CURTAIN RISES','APPLAUD THE LAST NIGHT']},
};
const fallback={theme:'ritual',ability:'THE RIFT AWAKENS',caption:'An impossible presence steps through the rift.',beats:['A PRESENCE IN THE RIFT','POWER TAKES SHAPE','THE BATTLE AWAITS']};
const motherBrainWalking={theme:'mechanical',ability:'BIOLOGICAL BODY · RAINBOW HYPER BEAM',caption:'The containment tank collapses. A vast skeletal body unfolds beneath the living brain.',beats:['THE GLASS SHATTERS','THE BIOLOGICAL BODY RISES','THE MOUTH GATHERS PRISMATIC LIGHT']};
const definition=intro=>intro.archetype==='motherbrain'&&intro.enraged?motherBrainWalking:BOSS_CINEMATICS[intro.archetype]||fallback;
const clamp=(n,min=0,max=1)=>Math.min(max,Math.max(min,Number.isFinite(n)?n:0));
const smooth=(n)=>{const x=clamp(n);return x*x*(3-2*x);};
const escape=value=>String(value??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));

export function queueBossIntro(g,boss,wave,options={}){
 const def=BOSS_CINEMATICS[boss.archetype]||fallback,quiet=!!g.p.reducedMotion;
 const intro={id:options.transformation?`shift:${boss.id}:${boss.cellStage||0}`:boss.id,enraged:boss.enraged,cellStage:boss.cellStage||0,...options,name:boss.name,title:boss.title,color:boss.color,archetype:boss.archetype,wave,age:0,duration:quiet?1.2:(def.duration||3.6),reducedMotion:quiet};
 if(g.bossIntro)g.bossIntroQueue.push(intro);else g.bossIntro=intro;
}
export function finishBossIntro(g){
 if(!g.bossIntro)return false;
 g.bossIntro=g.bossIntroQueue.shift()||null;
 if(!g.bossIntro)g.invuln=Math.max(g.invuln,.8);
 return true;
}
export function tickBossIntro(g,dt){
 if(!g.bossIntro)return false;
 g.bossIntro.age+=Math.max(0,dt);
 if(g.bossIntro.age>=g.bossIntro.duration)finishBossIntro(g);
 return true;
}
// All visual timing derives from the persisted simulation clock. No CSS
// animations or wall-clock timers can keep moving behind the pause screen.
export function bossIntroState(intro,reducedMotion=false){
 const def=definition(intro),p=clamp(intro.age/Math.max(.01,intro.duration||3.6)),quiet=!!(reducedMotion||intro.reducedMotion),stage=p<.28?0:p<.72?1:2,primal=['astronauts','lastsilence'].includes(def.theme);
 const power=quiet?.7:smooth((p-.12)/.28),roar=quiet?.55:smooth((p-.24)/.12)*(1-smooth((p-.75)/.2)),freeze=def.theme==='time'?(quiet?1:smooth((p-.22)/.1)*(1-smooth((p-.84)/.13))):0;
 return {theme:def.theme,stage,progress:p,quiet,label:def.beats[stage],ability:def.ability,caption:def.caption,
  reveal:quiet?1:smooth(p/.14),title:quiet?1:primal?smooth((p-.58)/.15):smooth((p-.14)/.15),power,roar,freeze,
  approach:quiet?1:smooth(p/.6),void:quiet?1:smooth((p-.18)/.24),apparition:quiet?1:smooth((p-.42)/.26),curtain:quiet?1:smooth((p-.18)/.42),
  shock:quiet?.35:clamp((p-.31)/.46),rotation:quiet?0:def.theme==='time'?(p<.32?p*280:89.6+Math.max(0,p-.9)*280):p*35,
  rise:quiet?0:(1-smooth(p/.3))*22,drift:quiet?0:Math.sin(p*Math.PI)*8,
  frame:quiet?0:stage,release:quiet?.55:smooth((p-.65)/.15),veil:quiet?.1:Math.sin(p*Math.PI)*.16};
}
const portraits=new Map();
function portrait(intro,frame=0){
 const titan=['annie','reiner','bertholdt'].includes(intro.archetype),key=[intro.archetype,titan||!!intro.enraged,intro.cellStage||0,frame].join(':');
 if(!portraits.has(key))portraits.set(key,pixelsSvg(enemyPixels(intro.archetype,{enraged:titan?1:intro.enraged?1:0,cellStage:intro.cellStage||0,attack:frame===1?.9:0,arm:frame===1?-7:frame===2?-2:0,head:frame===1?-1:0,leg:0})));
 return portraits.get(key);
}
export function bossIntroMarkup(intro){
 const def=definition(intro),state=bossIntroState(intro),phase=intro.archetype==='cell'?['I','II','III'][intro.cellStage||0]:'II';
 return `<div class="boss-cinema cinematic-v2 cinema-theme-${def.theme} ${intro.transformation?'transform-cinema':''}" data-stage="${state.stage}" data-quiet="${state.quiet}" style="--boss:${escape(intro.color)}" role="dialog" aria-modal="true" aria-label="${intro.transformation?'Boss transformation':'Boss approaching'}: ${escape(intro.name)}"><div class="cinema-vignette"></div><div class="cinema-grain" aria-hidden="true"></div><div class="cinema-stage" aria-hidden="true">${cinematicArt(def.theme,intro)}<div class="cinema-subject"><svg class="cinema-actor-sprite" viewBox="0 0 56 76" shape-rendering="crispEdges" data-frame="${state.frame}">${portrait(intro,state.frame)}</svg><div class="cinema-subject-ground"></div></div><div class="cinema-power-line"></div></div><div class="cinema-letterbox top"></div><div class="cinema-letterbox bottom"></div><div class="cinema-title"><div class="cinema-eyebrow"><span>${intro.transformation?'BOSS TRANSFORMATION':'BOSS APPROACHING'}</span><b>WAVE ${intro.wave}</b></div><h2>${escape(intro.name)}</h2><p class="cinema-boss-title">${escape(intro.title)}</p><div class="cinema-title-rule"><i></i><span>✦</span><i></i></div><h3>${escape(def.ability)}</h3><p class="cinema-caption">${escape(def.caption)}</p><small class="cinema-phase">${intro.transformation?escape(intro.previousName)+' · PHASE '+phase:'A SIGNATURE POWER ENTERS THE RIFT'}</small></div><div class="cinema-timeline"><span class="cinema-beat-label">${escape(state.label)}</span><div class="cinema-beats" aria-hidden="true"><i data-beat="0"></i><i data-beat="1"></i><i data-beat="2"></i></div><div class="cinema-progress" role="progressbar" aria-label="Boss entrance" aria-valuemin="0" aria-valuemax="100" aria-valuenow="${Math.round(state.progress*100)}"><i></i></div></div><button id="skip-intro">SKIP ENTRANCE <span>↵</span><small>Combat is paused · tap to skip</small></button></div>`;
}
export function updateBossIntroVisual(host,intro,reducedMotion=false){
 const arena=host?.closest?.('.arena'),scene=host?.querySelector?.('.cinematic-v2');
 if(!intro){arena?.classList.remove('cinema-time-stop');arena?.style.removeProperty('--cinema-freeze');return;}
 const state=bossIntroState(intro,reducedMotion);arena?.classList.toggle('cinema-time-stop',state.theme==='time');arena?.style.setProperty('--cinema-freeze',state.freeze.toFixed(4));
 if(!scene)return;scene.dataset.stage=String(state.stage);scene.dataset.quiet=String(state.quiet);
 const vars={progress:state.progress,reveal:state.reveal,title:state.title,power:state.power,roar:state.roar,freeze:state.freeze,shock:state.shock,rotation:state.rotation,rise:state.rise,drift:state.drift,release:state.release,veil:state.veil,approach:state.approach,void:state.void,apparition:state.apparition,curtain:state.curtain};
 for(const [key,value]of Object.entries(vars))scene.style.setProperty('--intro-'+key,value.toFixed(4));
 const label=scene.querySelector('.cinema-beat-label');if(label&&label.textContent!==state.label)label.textContent=state.label;
 scene.querySelector('.cinema-progress')?.setAttribute('aria-valuenow',String(Math.round(state.progress*100)));
 const actor=scene.querySelector('.cinema-actor-sprite');if(actor&&actor.dataset.frame!==String(state.frame)){actor.innerHTML=portrait(intro,state.frame);actor.dataset.frame=String(state.frame);}
}
