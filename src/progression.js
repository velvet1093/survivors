import {readSavedValue,writeSavedValue} from './save-storage.js';
import {CHARACTERS,MAPS} from './game.js';
import {petFor} from './pets.js';
import {SKINS,skinFor} from './skins.js';
const node=(id,name,description,max,cost,effect,parent=null,icon='power')=>({id,name,description,max,cost,effect,parent,icon});
const joined=(id,name,description,max,cost,effect,parents,icon)=>({...node(id,name,description,max,cost,effect,parents[0],icon),parents});
export const nodeParents=n=>Array.isArray(n.parents)?[...new Set(n.parents)]:n.parent?[n.parent]:[];
export const GENERAL_TREE=[
  node('vigor','Vitality','+10 starting max HP per rank.',3,25,{hp:10},null,'heal'),
  node('power','Fighting Spirit','+5% all weapon damage per rank.',3,30,{damage:.05},null,'power'),
  node('fortune','Golden Touch','+10% coins earned per rank.',3,25,{coinGain:.1},null,'chest'),
  node('stride','Quick Footwork','+4% movement speed per rank.',3,40,{move:.04},'vigor','headband'),
  node('reroll','Second Thoughts','+1 reroll charge per run per rank.',3,40,{rerolls:1},'power','scroll'),
  node('study','Field Study','+10% character XP earned per rank.',3,35,{masteryGain:.1},'fortune','eyes'),
  node('magnet','Soul Reach','+15% XP pickup range per rank.',3,55,{magnet:.15},'stride','magnet'),
  node('vanish','Vanish','Remove an item from this run’s upgrade and chest pools. +1 charge per rank.',3,60,{vanishes:1},'reroll','void'),
  node('focus','Perfect Timing','−3% ultimate cooldown per rank.',3,60,{ultimateCooldown:.03},'study','lightning'),
  node('recovery','Steady Recovery','+0.15 HP regeneration per second per rank.',3,55,{regen:.15},'vigor','herbs'),
  node('reserves','Spirit Reserves','+4 rechargeable shield per rank.',3,55,{shield:4},'power','atfield'),
  node('bounty','Bounty Ledger','+5% coins earned per rank.',3,50,{coinGain:.05},'fortune','chest'),
  joined('endurance','Lasting Resolve','+8 starting max HP per rank.',3,80,{hp:8},['stride','recovery'],'heal'),
  joined('precision','Measured Power','+3% all weapon damage per rank.',3,80,{damage:.03},['reroll','reserves'],'power'),
  node('archive','Rift Archive','+5% character XP earned per rank.',3,75,{masteryGain:.05},'study','grimoire'),
  node('reach','Farther Horizons','+12% XP pickup range per rank.',3,95,{magnet:.12},'magnet','magnet'),
  node('healer','Restorative Instinct','+5% healing from food and restorative effects per rank.',3,85,{healing:.05},'recovery','herbs'),
  node('flow','Ultimate Rhythm','−2% ultimate cooldown per rank.',3,100,{ultimateCooldown:.02},'focus','timepiece'),
  node('escape','Open Footing','+2% movement speed per rank.',3,85,{move:.02},'stride','headband'),
  joined('foresight','Read Another Path','+1 reroll charge per run per rank.',2,120,{rerolls:1},['reroll','vanish'],'scroll'),
  node('erase','Leave No Trace','+1 ban charge per run per rank.',2,125,{vanishes:1},'vanish','void'),
  joined('bulwark','The Unbroken Survivor','+20 max HP and +5 rechargeable shield per rank.',2,175,{hp:20,shield:5},['endurance','healer'],'atfield'),
  joined('overdrive','A Fighting Chance','+5% all weapon damage per rank.',2,180,{damage:.05},['precision','foresight'],'power'),
  joined('convergence','Legends Converge','+8% ultimate damage and +5% character XP earned per rank.',2,185,{ultimateDamage:.08,masteryGain:.05},['flow','archive','bounty'],'fusion'),
];
export const CHARACTER_TREES={
 denji:[node('teeth','A Saw That Keeps Turning','+15% Chainsaw damage per rank.',3,20,{signatureDamage:.15},null,'chainsaw'),node('heartbeat','A Devil’s Heart','+10 max HP per rank.',3,20,{hp:10},null,'bloodengine'),node('tempo','Pull the Starter','−6% Chainsaw cooldown per rank.',3,35,{signatureCooldown:.06},'teeth','chainsaw'),node('rev','Redline Rhythm','+12% Blood Engine Rev gain per rank.',3,35,{revGain:.12},'heartbeat','bloodengine'),node('hunter','Public Safety Rookie','Start with Chainsaw at level 2.',1,80,{startRank:1},'tempo','chainsawoverdrive'),node('hybrid','The Chainsaw’s Roar','+20% Chainsaw Man strike damage per rank.',2,65,{ultimateDamage:.2},'rev','chainsawman')],
 guts:[node('iron','A Heap of Raw Iron','+15% Dragonslayer damage per rank.',3,20,{signatureDamage:.15},null,'dragonslayer'),node('resolve','Still Struggling','+12 max HP per rank.',3,20,{hp:12},null,'brand'),node('tempo','The Weight of a Swing','−6% Dragonslayer cooldown per rank.',3,35,{signatureCooldown:.06},'iron','dragonslayer'),node('struggle','Against Causality','+12% Struggle gain per rank.',3,35,{struggleGain:.12},'resolve','brand'),node('swordsman','The Black Swordsman','Start with Dragonslayer at level 2.',1,80,{startRank:1},'tempo','berserkeredge'),node('beast','The Beast Within','+20% Berserker Armor strike damage per rank.',2,65,{ultimateDamage:.2},'struggle','berserkerarmor')],
 erza:[node('blade','Sword Magic','+15% Requip Sword damage in every armor per rank.',3,20,{signatureDamage:.15},null,'requip'),node('vitality','Heart of a Fairy','+10 max HP per rank.',3,20,{hp:10},null,'heartkreuz'),node('tempo','Flawless Swordplay','−6% Requip Sword cooldown per rank.',3,35,{signatureCooldown:.06},'blade','heavensarsenal'),node('requip','Instant Requip','−10% armor-switch cooldown per rank.',2,35,{requipCooldown:.1},'vitality','heartkreuz'),node('titania','Titania','Start with Requip Sword at level 2.',1,80,{startRank:1},'tempo','requip'),node('chariot','Nakagami Armor','+20% Nakagami: Divine Severance damage per rank.',2,65,{ultimateDamage:.2},'requip','nakagami')],
 featherine:[node('quill','Author’s Hand','+15% Author’s Quill damage per rank.',3,20,{signatureDamage:.15},null,'quill'),node('authority','Memory of the Theater','+15% Narrative Authority gain per rank.',3,20,{authorityGain:.15},null,'memoryfragment'),node('cadence','Unbroken Sentence','−6% Author’s Quill cooldown per rank.',3,35,{signatureCooldown:.06},'quill','finalchapter'),node('finale','A Longer Epilogue','+0.5s The Last Page duration per rank.',2,35,{ultimateDuration:.5},'authority','lastpage'),node('author','Witch of Theatergoing','Start with Author’s Quill at level 2.',1,80,{startRank:1},'cadence','quill'),node('ending','An Ending of Her Choosing','+20% The Last Page damage per rank.',2,65,{ultimateDamage:.2},'finale','lastpage')],
 rimuru:[node('flame','Dark Flame Control','+15% Black Flame damage per rank.',3,20,{signatureDamage:.15},null,'blackflame'),node('sage','Essence Analysis','+15% Predation essence per rank.',3,20,{predationGain:.15},null,'greatsage'),node('casting','Parallel Casting','−6% Black Flame cooldown per rank.',3,35,{signatureCooldown:.06},'flame','beelzebub'),node('gluttony','Bottomless Stomach','+0.5s Gluttony duration per rank.',2,35,{ultimateDuration:.5},'sage','gluttony'),node('sovereign','Slime Sovereign','Start with Black Flame at level 2.',1,80,{startRank:1},'casting','blackflame'),node('devour','Soul Eater','+20% Gluttony damage per rank.',2,65,{ultimateDamage:.2},'gluttony','beelzebub')],
 diavolo:[node('power','Crimson Impact','+15% King Crimson damage per rank.',3,20,{signatureDamage:.15},null,'crimson'),node('fate','Read the Future','+15% Fate gain per rank.',3,20,{fateGain:.15},null,'epitaph'),node('tempo','Unseen Tempo','−6% King Crimson cooldown per rank.',3,35,{signatureCooldown:.06},'power','fatalforecast'),node('erasure','Missing Seconds','+0.5s Time Erasure duration per rank.',2,35,{ultimateDuration:.5},'fate','timeerasure'),node('emperor','Hidden Emperor','Start with King Crimson at level 2.',1,80,{startRank:1},'tempo','crimson'),node('verdict','Inevitable Verdict','+20% Time Erasure finishing damage per rank.',2,65,{ultimateDamage:.2},'erasure','fatalforecast')],
 yuki:[node('force','Imaginary Weight','+15% Garuda damage per rank.',3,20,{signatureDamage:.15},null,'garuda'),node('density','Mass Accumulation','+15% Star Rage gain per rank.',3,20,{rageGain:.15},null,'masscore'),node('spin','Orbital Momentum','−6% Garuda cooldown per rank.',3,35,{signatureCooldown:.06},'force','garuda'),node('mass','Beyond Measure','+1s Maximum Mass duration per rank.',2,35,{rageDuration:1},'density','masscore'),node('grade','Special Grade','Start with Garuda at level 2.',1,80,{startRank:1},'spin','starcrusher'),node('singularity','Event Horizon','+20% Black Hole damage per rank.',2,65,{ultimateDamage:.2},'mass','blackhole')],
 eren:[node('blades','Unbroken Resolve','+15% damage for either form’s weapon per rank.',3,20,{signatureDamage:.15},null,'odmblades'),node('heart','Dedicate Your Heart','+10 max HP per rank.',3,20,{hp:10},null,'freedom'),node('gas','ODM Discipline','−6% signature cooldown in both forms per rank.',3,35,{signatureCooldown:.06},'blades','scoutassault'),node('armor','Titan Hardening','+5% damage resistance in Titan form per rank.',2,35,{titanResistance:.05},'heart','titanfists'),node('heir','Attack Titan’s Heir','Both form weapons start at level 2.',1,80,{startRank:1},'gas','titanquake'),node('roar','Shifter’s Roar','+20% transformation shockwave damage per rank.',2,65,{ultimateDamage:.2},'armor','titanquake')],
 megumi:[node('dogs','Divine Partnership','+15% summon damage per rank.',3,20,{signatureDamage:.15},null,'shadows'),node('pact','Shadow Pact','+12% summon duration per rank.',3,20,{summonDuration:.12},null,'talisman'),node('nue','Winged Shadow','−6% summoning cooldown per rank.',3,35,{signatureCooldown:.06},'dogs','totality'),node('wheel','Turning Wheel','+10% Mahoraga maximum HP per rank.',2,35,{ultimateDuration:1},'pact','mahoraga'),node('heir','Zenin Heir','Start with Divine Dogs at level 2; Nue remains independent.',1,80,{startRank:1},'nue','shadows'),node('general','Divine General','+20% Mahoraga damage per rank.',2,65,{ultimateDamage:.2},'wheel','mahoraga')],
 frieren:[node('ray','Demon-Slaying Magic','+15% Zoltraak damage per rank.',3,20,{signatureDamage:.15},null,'zoltraak'),node('reserve','Ancient Reserves','+8 rechargeable shield per rank.',3,20,{shield:8},null,'grimoire'),node('precision','Quiet Precision','−6% Zoltraak cooldown per rank.',3,35,{signatureCooldown:.06},'ray','ancientmagic'),node('barrage','Stonecraft','+6% Stone Golem maximum HP per rank.',2,35,{ultimateDuration:.6},'reserve','ancientmagic'),node('elf','Millennial Practice','Start with Zoltraak at level 2.',1,80,{startRank:1},'precision','zoltraak'),node('reveal','Golem’s Might','+20% Stone Golem attack damage per rank.',2,65,{ultimateDamage:.2},'barrage','grimoire')],
 samus:[node('cannon','Arm Cannon','+15% Power Beam damage per rank.',3,20,{signatureDamage:.15},null,'powerbeam'),node('tank','Suit Expansion','+12 max HP per rank.',3,20,{hp:12},null,'energytank'),node('split','Wide Beam','+1 bolt per volley per rank.',2,35,{projectiles:1},'cannon','plasmabeam'),node('blast','Bomb Radius','+12% Power Bomb radius per rank.',2,35,{ultimateArea:.12},'tank','powerbomb'),node('hunter','Chozo Training','Start with Power Beam at level 2.',1,80,{startRank:1},'split','powerbeam'),node('nova','Nova Reactor','+20% Power Bomb damage per rank.',2,65,{ultimateDamage:.2},'blast','powerbomb')],
 kurumi:[node('marks','Clockwork Aim','+15% Zafkiel Flintlock damage per rank.',3,20,{signatureDamage:.15},null,'clockshot'),node('reserve','Stolen Seconds','−5% flintlock cooldown per rank.',3,20,{signatureCooldown:.05},null,'timepiece'),node('echo','Echoes of Time','+1 clock bullet per volley per rank.',2,35,{projectiles:1},'marks','zafkiel'),node('night','Endless Night','+0.6s City of Devouring Time per rank.',2,35,{ultimateDuration:.6},'reserve','clockdomain'),node('spirit','Third Spirit','Start with Zafkiel Flintlock at level 2.',1,80,{startRank:1},'echo','clockshot'),node('doubles','Shadow Arsenal','+20% shadow-double damage per rank.',2,65,{ultimateDamage:.2},'night','clockdomain')],
 esdeath:[node('ice','Glacial Precision','+15% Ice Lance damage per rank.',3,20,{signatureDamage:.15},null,'icelance'),node('command','Imperial Command','+10 max HP per rank.',3,20,{hp:10},null,'demonextract'),node('barrage','Frozen Arsenal','+1 ice spear per volley per rank.',2,35,{projectiles:1},'ice','icelance'),node('dominion','Winter’s Dominion','+12% Mahapadma radius per rank.',2,35,{ultimateArea:.12},'command','icecrown'),node('general','Empire’s Strongest','Start with Ice Lance at level 2.',1,80,{startRank:1},'barrage','icecrown'),node('eternal','Eternal Winter','+0.5s Mahapadma duration per rank.',2,65,{ultimateDuration:.5},'dominion','frozen')],
  shinji:[node('sync','Synchronization','+15% Pallet Rifle damage per rank.',3,20,{signatureDamage:.15},null,'pallet'),node('field','Absolute Territory','+8 rechargeable shield per rank.',3,20,{shield:8},null,'atfield'),node('burst','Fire Discipline','+1 round per burst per rank.',2,35,{projectiles:1},'sync','pallet'),node('resolve','I Mustn’t Run Away','+0.6s Berserk Awakening duration per rank.',2,35,{ultimateDuration:.6},'field','berserk'),node('pilot','Perfect Synchrony','Start with Pallet Rifle at level 2.',1,80,{startRank:1},'burst','positron'),node('beast','The Beast','+20% berserk strike and burst damage per rank.',2,65,{ultimateDamage:.2},'resolve','berserk')],
  goku:[node('ki','Ki Discipline','+15% Ki Wave damage per rank.',3,20,{signatureDamage:.15},null,'ki'),node('vitality','Saiyan Constitution','+15 max HP per rank.',2,20,{hp:15},null,'senzu'),node('focus','Focused Ki','−6% Ki Wave cooldown per rank.',3,35,{signatureCooldown:.06},'ki','kamehameha'),node('spirit','Spirit Control','+12% Spirit Bomb radius per rank.',2,35,{ultimateArea:.12},'vitality','spirit'),node('ascend','Saiyan Ascension','Start with Ki Wave at level 2.',1,80,{startRank:1},'focus','power'),node('genki','Shared Energy','+20% ultimate damage per rank.',2,65,{ultimateDamage:.2},'spirit','spirit')],
  gojo:[node('blue','Spatial Control','+12% Cursed Blue area per rank.',3,20,{signatureArea:.12},null,'blue'),node('eyes','Six Eyes Practice','−5% Cursed Blue cooldown per rank.',3,20,{signatureCooldown:.05},null,'eyes'),node('force','Cursed Output','+15% Cursed Blue damage per rank.',3,35,{signatureDamage:.15},'blue','purple'),node('domain','Expanded Domain','+0.6s Unlimited Void duration per rank.',2,35,{ultimateDuration:.6},'eyes','void'),node('honored','The Honored One','Start with Cursed Blue at level 2.',1,80,{startRank:1},'force','purple'),node('collapse','Infinite Collapse','+20% ultimate damage per rank.',2,65,{ultimateDamage:.2},'domain','void')],
  naruto:[node('blades','Wind Nature','+1 shuriken per volley per rank.',2,20,{projectiles:1},null,'shuriken'),node('speed','Ninja Way','+5% movement speed per rank.',3,20,{move:.05},null,'headband'),node('chakra','Chakra Control','+15% Wind Shuriken damage per rank.',3,35,{signatureDamage:.15},'blades','rasen'),node('clones','Many Paths','+1 shadow clone per rank.',2,35,{cloneCount:1},'speed','clone'),node('sage','Sage Training','Start with Wind Shuriken at level 2.',1,80,{startRank:1},'chakra','rasen'),node('rasengan','Perfect Rasengan','+20% clone strike damage per rank.',2,65,{ultimateDamage:.2},'clones','clone')],
  madoka:[node('arrows','Threads of Hope','+1 rose arrow per volley per rank.',2,20,{projectiles:1},null,'rosebow'),node('soul','Soul Resonance','+8 rechargeable shield per rank.',3,20,{shield:8},null,'soulgem'),node('light','Radiant Arrows','+15% Rosewood Bow damage per rank.',3,35,{signatureDamage:.15},'arrows','ultimate'),node('wings','Enduring Hope','+0.6s Law of Cycles duration per rank.',2,35,{ultimateDuration:.6},'soul','ultimate'),node('wish','A New Wish','Start with Rosewood Bow at level 2.',1,80,{startRank:1},'light','rosebow'),node('mercy','Merciful Light','+10 healing on ultimate activation per rank.',2,65,{ultimateHeal:10},'wings','heal')],
  maomao:[node('toxins','Toxicology','+20% poison duration per rank.',3,20,{poisonDuration:.2},null,'poison'),node('medicine','Herbal Practice','+0.5 HP regeneration per second per rank.',3,20,{regen:.5},null,'herbs'),node('dose','Precise Dosage','+15% Poison Vial damage per rank.',3,35,{signatureDamage:.15},'toxins','poison'),node('garden','Cultivated Remedies','+15% Poison Vial area per rank.',2,35,{signatureArea:.15},'medicine','herbs'),node('apothecary','Master Apothecary','Start with Poison Vial at level 2.',1,80,{startRank:1},'dose','elixir'),node('panacea','Perfect Panacea','+20% healing from food and Panacea per rank.',2,65,{healing:.2},'garden','heal')],
};
// Every hero retains the original two mastery paths. New forks open at their
// roots, then rejoin those paths in late specialties and a final mastery.
const masteryExtensions={
 denji:[
  node('scrap','Back on My Feet','+8 max HP per rank.',3,55,{hp:8},'teeth','bloodengine'),
  node('footwork','A Hunter’s Footwork','+3% movement speed per rank.',3,60,{move:.03},'heartbeat','headband'),
  node('reach','Longer Cutting Edge','+8% Chainsaw reach per rank.',2,85,{signatureArea:.08},'scrap','chainsawoverdrive'),
  node('engine','Keep the Engine Running','+0.5s Chainsaw Man duration per rank.',2,90,{ultimateDuration:.5},'footwork','chainsawman'),
  joined('promise','A Promise to Pochita','+12% Chainsaw damage and +12 max HP.',1,135,{signatureDamage:.12,hp:12},['hunter','reach'],'chainsaw'),
  joined('dream','A Life Worth Living','+15% Chainsaw Man damage and +10% Rev gain.',1,180,{ultimateDamage:.15,revGain:.1},['hybrid','engine','promise'],'chainsawman')],
 guts:[
  node('forge','Godot’s Forge','+8 max HP per rank.',3,55,{hp:8},'iron','brand'),
  node('footwork','Mercenary Footwork','+3% movement speed per rank.',3,60,{move:.03},'resolve','headband'),
  node('edge','Cutting the Astral World','+8% Dragonslayer cleave reach per rank.',2,85,{signatureArea:.08},'forge','berserkeredge'),
  node('nightmare','A Long Black Night','+0.5s Berserker Armor duration per rank.',2,90,{ultimateDuration:.5},'footwork','berserkerarmor'),
  joined('ironwill','An Unbroken Will','+12% Dragonslayer damage and +12 max HP.',1,135,{signatureDamage:.12,hp:12},['swordsman','edge'],'dragonslayer'),
  joined('struggler','The One Who Struggles','+15% Berserker Armor damage and +10% Struggle gain.',1,180,{ultimateDamage:.15,struggleGain:.1},['beast','nightmare','ironwill'],'berserkerarmor')],
 erza:[
  node('guard','Unbreakable Bond','+5 rechargeable shield per rank.',3,55,{shield:5},'blade','heartkreuz'),
  node('footwork','Black Wing Footwork','+3% movement speed in every armor per rank.',3,60,{move:.03},'vitality','headband'),
  node('arsenal','A Thousand Blades','+1 Heaven’s Wheel sword per volley.',1,85,{erzaSwordCount:1},'guard','heavensarsenal'),
  node('stars','Severing Reach','+10% Nakagami impact radius per rank.',2,90,{ultimateArea:.1},'footwork','nakagami'),
  joined('heart','The Strongest Armor','+12% Requip Sword damage and +6 rechargeable shield.',1,135,{signatureDamage:.12,shield:6},['titania','arsenal'],'heartkreuz'),
  joined('sevenstars','The Sword That Cuts Magic','+15% Nakagami damage and −3% ultimate cooldown.',1,180,{ultimateDamage:.15,ultimateCooldown:.03},['chariot','stars','heart'],'nakagami')],
 goku:[
  node('guard','Turtle School Guard','+10 max HP per rank.',3,55,{hp:10},'ki','senzu'),
  node('breath','Saiyan Breathing','+0.2 HP regeneration per second per rank.',3,60,{regen:.2},'vitality','herbs'),
  node('footwork','Weightless Footwork','+3% movement speed per rank.',2,85,{move:.03},'guard','headband'),
  node('gather','Gather Every Spark','−3% Spirit Bomb cooldown per rank.',2,90,{ultimateCooldown:.03},'breath','spirit'),
  joined('warrior','A Warrior’s Promise','+12% Ki Wave damage and +10 max HP.',1,135,{signatureDamage:.12,hp:10},['ascend','footwork'],'kamehameha'),
  joined('limitless','Beyond the Last Limit','+15% Spirit Bomb damage and +10% blast radius.',1,180,{ultimateDamage:.15,ultimateArea:.1},['genki','gather','warrior'],'spirit')],
 gojo:[
  node('barrier','Barrier Fundamentals','+6 rechargeable shield per rank.',3,55,{shield:6},'blue','atfield'),
  node('flow','Effortless Technique','+3% movement speed per rank.',3,60,{move:.03},'eyes','headband'),
  node('aperture','Wider Aperture','+8% Cursed Blue area per rank.',2,85,{signatureArea:.08},'barrier','blue'),
  node('stillness','A Moment of Stillness','−3% Unlimited Void cooldown per rank.',2,90,{ultimateCooldown:.03},'flow','void'),
  joined('limitless','Limitless Refinement','+12% signature weapon damage and +6 rechargeable shield.',1,135,{signatureDamage:.12,shield:6},['honored','aperture'],'purple'),
  joined('horizon','Beyond the Horizon','+15% Unlimited Void damage and +0.5s duration.',1,180,{ultimateDamage:.15,ultimateDuration:.5},['collapse','stillness','limitless'],'void')],
 naruto:[
  node('resolve','Never Go Back','+10 max HP per rank.',3,55,{hp:10},'blades','heal'),
  node('vigil','Village Watch','+10% XP pickup range per rank.',3,60,{magnet:.1},'speed','headband'),
  node('edge','Sharper Wind','+8% Wind Shuriken damage per rank.',2,85,{signatureDamage:.08},'resolve','rasen'),
  node('bond','Bonds of the Leaf','−3% Shadow Clone Rush cooldown per rank.',2,90,{ultimateCooldown:.03},'vigil','clone'),
  joined('spiral','The Endless Spiral','+1 shuriken per volley and +3% movement speed.',1,135,{projectiles:1,move:.03},['sage','edge'],'shuriken'),
  joined('hokage','The Will of Fire','+1 shadow clone and +15% clone strike damage.',1,180,{cloneCount:1,ultimateDamage:.15},['rasengan','bond','spiral'],'clone')],
 madoka:[
  node('ribbon','Ribbon of Protection','+5 rechargeable shield per rank.',3,55,{shield:5},'arrows','soulgem'),
  node('kindness','Quiet Kindness','+5% healing from food and restorative effects per rank.',3,60,{healing:.05},'soul','heal'),
  node('radiance','A Brighter Arrow','+8% Rosewood Bow damage per rank.',2,85,{signatureDamage:.08},'ribbon','rosebow'),
  node('promise','A Promise Remembered','−3% Law of Cycles cooldown per rank.',2,90,{ultimateCooldown:.03},'kindness','timepiece'),
  joined('constellation','Constellation of Wishes','+1 rose arrow per volley and +5 rechargeable shield.',1,135,{projectiles:1,shield:5},['wish','radiance'],'ultimate'),
  joined('salvation','Every Wish Has a Place','+15% Law of Cycles damage and +0.5s duration.',1,180,{ultimateDamage:.15,ultimateDuration:.5},['mercy','promise','constellation'],'ultimate')],
 maomao:[
  node('antidote','Antidote Reserve','+5% healing from food and restorative effects per rank.',3,55,{healing:.05},'toxins','herbs'),
  node('basket','Gathering Basket','+10% XP pickup range per rank.',3,60,{magnet:.1},'medicine','magnet'),
  node('steep','A Patient Infusion','+10% poison duration per rank.',2,85,{poisonDuration:.1},'antidote','poison'),
  node('prescription','Perfect Prescription','−3% Panacea Garden cooldown per rank.',2,90,{ultimateCooldown:.03},'basket','herbs'),
  joined('remedy','A Remedy for Every Ailment','+10 max HP and +0.3 HP regeneration per second.',1,135,{hp:10,regen:.3},['apothecary','steep'],'elixir'),
  joined('jade','The Jade Apothecary','+12% Poison Vial damage and +10% cloud area.',1,180,{signatureDamage:.12,signatureArea:.1},['panacea','prescription','remedy'],'elixir')],
 shinji:[
  node('umbilical','Umbilical Reserves','+10 max HP per rank.',3,55,{hp:10},'sync','energytank'),
  node('anchor','Mental Anchor','+0.15 HP regeneration per second per rank.',3,60,{regen:.15},'field','heal'),
  node('calibration','Rifle Calibration','+8% Pallet Rifle damage per rank.',2,85,{signatureDamage:.08},'umbilical','pallet'),
  node('awakening','Awakening Signal','−3% Berserk Awakening cooldown per rank.',2,90,{ultimateCooldown:.03},'anchor','berserk'),
  joined('interlock','Perfect Interlock','+1 Pallet Rifle round per burst and +6 rechargeable shield.',1,135,{projectiles:1,shield:6},['pilot','calibration'],'positron'),
  joined('instinct','The Will to Live','+15% Berserk Awakening damage and +0.5s duration.',1,180,{ultimateDamage:.15,ultimateDuration:.5},['beast','awakening','interlock'],'berserk')],
 esdeath:[
  node('bulwark','Glacial Bulwark','+5 rechargeable shield per rank.',3,55,{shield:5},'ice','atfield'),
  node('march','The Winter March','+3% movement speed per rank.',3,60,{move:.03},'command','headband'),
  node('shards','Razor-Sharp Ice','+8% Ice Lance damage per rank.',2,85,{signatureDamage:.08},'bulwark','icelance'),
  node('silence','Winter Silence','−3% Mahapadma cooldown per rank.',2,90,{ultimateCooldown:.03},'march','timepiece'),
  joined('cavalry','The Ice Cavalry Advances','+1 ice spear per volley and +10 max HP.',1,135,{projectiles:1,hp:10},['general','shards'],'icecrown'),
  joined('absolute','Absolute Winter','+15% Mahapadma damage and +0.5s duration.',1,180,{ultimateDamage:.15,ultimateDuration:.5},['eternal','silence','cavalry'],'frozen')],
 kurumi:[
  node('ward','A Rose Against Fate','+8 max HP per rank.',3,55,{hp:8},'marks','heal'),
  node('search','Every Lost Second','+10% XP pickup range per rank.',3,60,{magnet:.1},'reserve','magnet'),
  node('caliber','Crimson Caliber','+8% Zafkiel Flintlock damage per rank.',2,85,{signatureDamage:.08},'ward','clockshot'),
  node('chime','The Next Chime','−3% City of Devouring Time cooldown per rank.',2,90,{ultimateCooldown:.03},'search','timepiece'),
  joined('refrain','A Repeated Refrain','+1 clock bullet per volley and +5 rechargeable shield.',1,135,{projectiles:1,shield:5},['spirit','caliber'],'zafkiel'),
  joined('midnight','The Last Stroke of Midnight','+15% shadow-double damage and +0.5s domain duration.',1,180,{ultimateDamage:.15,ultimateDuration:.5},['doubles','chime','refrain'],'clockdomain')],
 frieren:[
  node('journey','A Long Journey','+10 max HP per rank.',3,55,{hp:10},'ray','heal'),
  node('curiosity','A Mage’s Curiosity','+10% XP pickup range per rank.',3,60,{magnet:.1},'reserve','magnet'),
  node('refinement','Refined Casting','+8% Zoltraak damage per rank.',2,85,{signatureDamage:.08},'journey','zoltraak'),
  node('patience','Centuries of Patience','−3% Stone Golem cooldown per rank.',2,90,{ultimateCooldown:.03},'curiosity','grimoire'),
  joined('reservoir','Hidden Mana Reservoir','+8 rechargeable shield and +0.3 HP regeneration per second.',1,135,{shield:8,regen:.3},['elf','refinement'],'grimoire'),
  joined('legacy','Magic Worth Remembering','+15% Stone Golem damage and +5% maximum HP.',1,180,{ultimateDamage:.15,ultimateDuration:.5},['reveal','patience','reservoir'],'ancientmagic')],
 samus:[
  node('plating','Chozo Plating','+5 rechargeable shield per rank.',3,55,{shield:5},'cannon','atfield'),
  node('scan','Wide-Area Scanner','+10% XP pickup range per rank.',3,60,{magnet:.1},'tank','magnet'),
  node('focus','Focused Beam','+8% Power Beam damage per rank.',2,85,{signatureDamage:.08},'plating','powerbeam'),
  node('reactor','Power Bomb Reactor','−3% Power Bomb cooldown per rank.',2,90,{ultimateCooldown:.03},'scan','powerbomb'),
  joined('reserve','Reserve Tank','+18 max HP and +0.2 HP regeneration per second.',1,135,{hp:18,regen:.2},['hunter','focus'],'energytank'),
  joined('supernova','Chozo Supernova','+15% Power Bomb damage and +10% blast radius.',1,180,{ultimateDamage:.15,ultimateArea:.1},['nova','reactor','reserve'],'powerbomb')],
 megumi:[
  node('refuge','A Place in the Shadows','+8 max HP per rank.',3,55,{hp:8},'dogs','heal'),
  node('vigil','Shikigami Vigil','+4 rechargeable shield per rank.',3,60,{shield:4},'pact','atfield'),
  node('training','Binding Practice','+8% Divine Dogs and Nue damage per rank.',2,85,{signatureDamage:.08},'refuge','totality'),
  node('ritual','The Summoning Ritual','−3% Mahoraga cooldown per rank.',2,90,{ultimateCooldown:.03},'vigil','mahoraga'),
  joined('tenfold','Tenfold Partnership','+12% shikigami duration and +3% movement speed.',1,135,{summonDuration:.12,move:.03},['heir','training'],'talisman'),
  joined('adaptation','An Answer to Every Threat','+15% Mahoraga damage and +10% maximum HP.',1,180,{ultimateDamage:.15,ultimateDuration:1},['general','ritual','tenfold'],'mahoraga')],
 eren:[
  node('stance','A Soldier’s Stance','+5 rechargeable shield per rank.',3,55,{shield:5},'blades','atfield'),
  node('march','Beyond the Walls','+3% movement speed per rank.',3,60,{move:.03},'heart','headband'),
  node('edge','Forged in Battle','+8% damage for either form’s weapon per rank.',2,85,{signatureDamage:.08},'stance','odmblades'),
  node('will','The Will to Transform','−3% Titan Shift cooldown per rank.',2,90,{ultimateCooldown:.03},'march','freedom'),
  joined('recovery','A Shifter’s Recovery','+15 max HP and +0.3 HP regeneration per second.',1,135,{hp:15,regen:.3},['heir','edge'],'freedom'),
  joined('freedom','Until the Walls Fall','+15% transformation damage and +5% Titan-form damage resistance.',1,180,{ultimateDamage:.15,titanResistance:.05},['roar','will','recovery'],'titanquake')],
 yuki:[
  node('balance','A Balanced Orbit','+10 max HP per rank.',3,55,{hp:10},'force','heal'),
  node('orbit','Steady Center','+0.2 HP regeneration per second per rank.',3,60,{regen:.2},'density','herbs'),
  node('pressure','Impossible Pressure','+10% Star Rage gain per rank.',2,85,{rageGain:.1},'balance','masscore'),
  node('horizon','Approach the Horizon','−3% Black Hole cooldown per rank.',2,90,{ultimateCooldown:.03},'orbit','blackhole'),
  joined('momentum','Unstoppable Momentum','+12% Garuda damage and +1s Maximum Mass duration.',1,135,{signatureDamage:.12,rageDuration:1},['grade','pressure'],'starcrusher'),
  joined('collapse','A World of Mass','+15% Black Hole damage and +10% field radius.',1,180,{ultimateDamage:.15,ultimateArea:.1},['singularity','horizon','momentum'],'blackhole')],
 diavolo:[
  node('composure','Unshaken Composure','+8 max HP per rank.',3,55,{hp:8},'power','heal'),
  node('trail','An Unseen Trail','+3% movement speed per rank.',3,60,{move:.03},'fate','headband'),
  node('omen','A Certain Omen','+10% Fate gain per rank.',2,85,{fateGain:.1},'composure','epitaph'),
  node('interval','The Missing Interval','−3% Time Erasure cooldown per rank.',2,90,{ultimateCooldown:.03},'trail','timeerasure'),
  joined('certainty','Absolute Certainty','+12% King Crimson damage and +5 rechargeable shield.',1,135,{signatureDamage:.12,shield:5},['emperor','omen'],'fatalforecast'),
  joined('inevitable','An Inevitable Conclusion','+15% Time Erasure finishing damage and +0.5s erased duration.',1,180,{ultimateDamage:.15,ultimateDuration:.5},['verdict','interval','certainty'],'timeerasure')],
 rimuru:[
  node('gel','Resilient Slime Body','+10 max HP per rank.',3,55,{hp:10},'flame','heal'),
  node('analysis','Wide-Area Analysis','+10% XP pickup range per rank.',3,60,{magnet:.1},'sage','greatsage'),
  node('assimilation','Efficient Assimilation','+10% Predation essence per rank.',2,85,{predationGain:.1},'gel','greatsage'),
  node('appetite','An Endless Appetite','−3% Gluttony cooldown per rank.',2,90,{ultimateCooldown:.03},'analysis','gluttony'),
  joined('tempest','The Heart of Tempest','+12% Black Flame damage and +0.3 HP regeneration per second.',1,135,{signatureDamage:.12,regen:.3},['sovereign','assimilation'],'beelzebub'),
  joined('absorption','All Becomes One','+15% Gluttony damage and +0.5s duration.',1,180,{ultimateDamage:.15,ultimateDuration:.5},['devour','appetite','tempest'],'gluttony')],
 featherine:[
  node('margin','A Margin of Safety','+5 rechargeable shield per rank.',3,55,{shield:5},'quill','memoryfragment'),
  node('footnote','An Unforgotten Footnote','+10% XP pickup range per rank.',3,60,{magnet:.1},'authority','magnet'),
  node('glyph','The Shape of Red Truth','+8% Author’s Quill glyph explosion area per rank.',2,85,{signatureArea:.08},'margin','finalchapter'),
  node('memory','A Perfect Recollection','+10% Narrative Authority gain per rank.',2,90,{authorityGain:.1},'footnote','memoryfragment'),
  joined('revision','A Decisive Revision','+1 quill per signature volley and +12% Author’s Quill damage.',1,135,{projectiles:1,signatureDamage:.12},['author','glyph'],'quill'),
  joined('theater','The Theater Beyond Worlds','+15% The Last Page damage and +10% field radius.',1,180,{ultimateDamage:.15,ultimateArea:.1},['ending','memory','revision'],'lastpage')],
};
for(const [id,nodes]of Object.entries(masteryExtensions))CHARACTER_TREES[id].push(...nodes);
export const SAVE_KEY='anime-survivors-progress-v1';
const nonnegative=n=>Number.isFinite(n)?Math.max(0,Math.floor(n)):0;
export const PRESTIGE_MAX=10;
export const PRESTIGE_REWARD={damage:.05,hp:10,masteryGain:.1};
export function prestigeRank(profile,id){return Math.min(PRESTIGE_MAX,nonnegative(profile?.characters?.[id]?.prestige));}
export function prestigeState(profile,id){
 const tree=CHARACTER_TREES[id]||[],character=profile?.characters?.[id],rank=prestigeRank(profile,id),skills=character?.skills||{},maxed=tree.filter(n=>(skills[n.id]||0)>=n.max).length,remaining=tree.reduce((sum,n)=>sum+Math.max(0,n.max-(skills[n.id]||0)),0);
 return {rank,max:PRESTIGE_MAX,maxed,skills:tree.length,remaining,atCap:rank>=PRESTIGE_MAX,canPrestige:!!character&&tree.length>0&&remaining===0&&rank<PRESTIGE_MAX};
}
export function prestigeCharacter(profile,id){
 const state=prestigeState(profile,id);if(!state.canPrestige)return false;
 const character=profile.characters[id];character.prestige=state.rank+1;character.xp=0;character.skills={};return true;
}
export function newProfile(){return {version:1,coins:0,bestKills:0,selection:{character:'goku',map:'garden',mode:'survival',difficulty:'normal'},pet:'none',audio:{muted:false,music:.35,sfx:.6},ui:{hidden:false},skins:{},general:{},characters:Object.fromEntries(Object.keys(CHARACTER_TREES).map(id=>[id,{xp:0,totalXp:0,skills:{}}])),credited:{}};}
export function sanitizeProfile(value){
  const p=newProfile();if(!value||typeof value!=='object')return p;p.coins=nonnegative(value.coins);p.bestKills=nonnegative(value.bestKills);if(CHARACTERS.some(c=>c.id===value.selection?.character))p.selection.character=value.selection.character;if(MAPS.some(m=>m.id===value.selection?.map))p.selection.map=value.selection.map;if(['survival','hardcore','bossrush','training'].includes(value.selection?.mode))p.selection.mode=value.selection.mode;p.pet=petFor(value.pet).id;for(const id of Object.keys(SKINS))if(value.skins?.[id])p.skins[id]=skinFor(id,value.skins[id]).id;
  if(['easy','normal','hard','nightmare'].includes(value.selection?.difficulty))p.selection.difficulty=value.selection.difficulty;
  p.audio={muted:value.audio?.muted===true,music:Number.isFinite(value.audio?.music)?Math.max(0,Math.min(1,value.audio.music)):.35,sfx:Number.isFinite(value.audio?.sfx)?Math.max(0,Math.min(1,value.audio.sfx)):.6};p.ui={hidden:value.ui?.hidden===true};
  for(const n of GENERAL_TREE)p.general[n.id]=Math.min(n.max,nonnegative(value.general?.[n.id]));
  for(const [id,tree] of Object.entries(CHARACTER_TREES)){const c=value.characters?.[id];if(!c)continue;p.characters[id].xp=nonnegative(c.xp);p.characters[id].totalXp=Math.max(nonnegative(c.totalXp),p.characters[id].xp);const prestige=prestigeRank(value,id);if(prestige)p.characters[id].prestige=prestige;for(const n of tree)p.characters[id].skills[n.id]=Math.min(n.max,nonnegative(c.skills?.[n.id]));}
  for(const [id,c] of Object.entries(value.credited||{}).slice(-32))if(c&&typeof c==='object')p.credited[id]={coins:nonnegative(c.coins),xp:nonnegative(c.xp)};
  return p;
}
export function loadProfile(storage){const raw=readSavedValue(storage,SAVE_KEY,text=>{try{const p=JSON.parse(text);return !!p&&typeof p==='object'&&!Array.isArray(p)&&(p.version===undefined||p.version===1)&&!!p.characters&&typeof p.characters==='object'&&!Array.isArray(p.characters)&&!!p.general&&typeof p.general==='object'&&!Array.isArray(p.general);}catch{return false;}});try{return raw?sanitizeProfile(JSON.parse(raw)):newProfile();}catch{return newProfile();}}
export function saveProfile(p,storage){try{return writeSavedValue(storage,SAVE_KEY,JSON.stringify(p));}catch{return false;}}
export function nodeState(p,scope,id,character){
  const tree=scope==='general'?GENERAL_TREE:CHARACTER_TREES[character],n=tree?.find(n=>n.id===id);if(!n)return null;
  const ranks=scope==='general'?p.general:(p.characters[character]?.skills||{}),rank=ranks[id]||0,currency=scope==='general'?p.coins:(p.characters[character]?.xp||0),cost=n.cost*(rank+1),parentIds=nodeParents(n),missingParents=parentIds.filter(parent=>!(ranks[parent]>0)),locked=missingParents.length>0;
  return {...n,parentIds,missingParents,rank,cost,locked,maxed:rank>=n.max,affordable:currency>=cost,canBuy:!locked&&rank<n.max&&currency>=cost};
}
export function buyNode(p,scope,id,character){const n=nodeState(p,scope,id,character);if(!n?.canBuy)return false;if(scope==='general'){p.coins-=n.cost;p.general[id]=n.rank+1;}else{p.characters[character].xp-=n.cost;p.characters[character].skills[id]=n.rank+1;}return true;}
export function progressionBonuses(p,character){
  const result={};if(!p)return result;
  for(const [tree,ranks] of [[GENERAL_TREE,p.general||{}],[CHARACTER_TREES[character]||[],p.characters?.[character]?.skills||{}]])for(const n of tree)for(const [key,value] of Object.entries(n.effect))result[key]=(result[key]||0)+value*(ranks[n.id]||0);
  const prestige=prestigeRank(p,character);if(prestige)for(const [key,value]of Object.entries(PRESTIGE_REWARD))result[key]=(result[key]||0)+value*prestige;
  return result;
}
export function creditRun(profile,g){
  // Training runs are a sandbox: they never pay out coins, mastery or records.
  if(g.mode==='training')return {coins:0,xp:0};
  const old=profile.credited[g.runId]||{coins:0,xp:0},coins=Math.max(0,Math.floor(g.money)-old.coins),xp=Math.max(0,Math.floor(g.characterXp)-old.xp),c=profile.characters[g.p.id];
  if(!c)return {coins:0,xp:0};profile.coins+=coins;c.xp+=xp;c.totalXp+=xp;profile.bestKills=Math.max(profile.bestKills||0,g.kills);profile.credited[g.runId]={coins:Math.max(old.coins,Math.floor(g.money)),xp:Math.max(old.xp,Math.floor(g.characterXp))};
  const ids=Object.keys(profile.credited);if(ids.length>32)delete profile.credited[ids[0]];return {coins,xp};
}
export function masteryLevel(p,id){return 1+Math.floor((p.characters[id]?.totalXp||0)/50);}
