import {DENJI_CHARACTER,DENJI_ITEMS,DENJI_FUSIONS} from './denji-data.js';
import {PAIRED_ITEMS,PAIRED_FUSIONS} from './paired-item-data.js';
import {SOUL_GEM_IDS,SOUL_GEM_ITEMS,QUINTET_FUSION,SALVATION_FUSION} from './soul-gem-data.js';
import {COMPLEX_ITEMS,COMPLEX_FUSIONS} from './complex-item-data.js';
import {TOKYO_MAPS} from './tokyo-maps.js';
import {BERSERK_MAP} from './berserk-map.js';
import {GRAVEYARD_MAP} from './graveyard-map.js';
import {GUTS_CHARACTER,GUTS_ITEMS,GUTS_FUSIONS} from './guts-data.js';
import {NEW_ANIME_MAPS} from './anime-maps.js';
import {syncErenProgress} from './eren-progress.js';
import {signatureWeaponIds,signaturePassiveIds} from './hardcore.js';
import {ERZA_CHARACTER,ERZA_ITEMS,ERZA_FUSIONS} from './erza-data.js';
export const CHARACTERS = [
  
  { id:'goku', name:'Goku', title:'THE SAIYAN', series:'DRAGON BALL', color:'#ffb35c', weapon:'ki', passive:'senzu', skill:'Spirit bomb', description:'Turn your fighting spirit into a piercing wave of ki. Recover with Senzu Beans and ascend beyond your limits.', power:5, speed:3, range:5, hp:120, move:215 },
  { id:'gojo', name:'Gojo', title:'THE HONORED ONE', series:'JUJUTSU KAISEN', color:'#b39bff', weapon:'blue', passive:'eyes', skill:'Unlimited void', secondWeapon:'red',description:'Start with both attraction and repulsion. Max Cursed Blue, Reversal Red and Six Eyes to fuse Hollow Purple.', power:5, speed:3, range:4, hp:100, move:220 },
  { id:'naruto', name:'Naruto', title:'THE LEAF’S HERO', series:'NARUTO SHIPPUDEN', color:'#74e1b7', weapon:'shuriken', passive:'headband', skill:'Shadow clone rush', description:'Send spinning shuriken through the horde. The Leaf Headband keeps you fast. Awaken the Rasenshuriken.', power:4, speed:5, range:4, hp:110, move:250 },
  { id:'madoka', name:'Madoka', fullName:'Madoka Kaname', title:'THE LIGHT OF HOPE', series:'PUELLA MAGI MADOKA MAGICA', color:'#f5a4ce', weapon:'rosebow', passive:'soulgem', skill:'Law of Cycles', description:'Loose homing arrows from a rosewood bow. Your Soul Gem shields you from despair. Become the light that saves every world.', power:4, speed:4, range:5, hp:100, move:230 },
  { id:'maomao', name:'Maomao', title:'THE APOTHECARY', series:'THE APOTHECARY DIARIES', color:'#97d4ac', weapon:'poison', passive:'herbs', skill:'Panacea Garden', description:'An exact dose makes all the difference. Brew lingering poisons, tend healing herbs and turn the battlefield into an apothecary’s garden.', power:4, speed:4, range:4, hp:105, move:225 },
  {id:'shinji',name:'Shinji',fullName:'Shinji Ikari / EVA-01',title:'THE THIRD CHILD',series:'NEON GENESIS EVANGELION',color:'#bd9ae6',weapon:'pallet',passive:'atfield',skill:'Berserk Awakening',description:'Pilot EVA-01 through the rift. Lay down precise Pallet Rifle bursts, hold an AT Field and awaken the unit’s ferocious close-range power.',power:5,speed:2,range:5,hp:125,move:205},
  {id:'esdeath',name:'Esdeath',title:'THE ICE GENERAL',series:'AKAME GA KILL!',color:'#a4d7ef',weapon:'icelance',passive:'demonextract',skill:'Mahapadma',description:'Command piercing ice lances and immobilize the horde. Demon’s Extract shields you from the cold; Mahapadma stops enemies and hostile projectiles in a frozen domain.',power:5,speed:3,range:5,hp:110,move:225},
  {id:'kurumi',name:'Kurumi',fullName:'Kurumi Tokisaki',title:'THE NIGHTMARE',series:'DATE A LIVE',color:'#e39c9c',weapon:'clockshot',passive:'timepiece',skill:'City of Devouring Time',description:'Wield Zafkiel’s flintlocks and mark your prey with stolen time. Unfurl a crimson clock domain and let shadow doubles fire beside you.',power:5,speed:4,range:5,hp:100,move:235},
 {id:'frieren',name:'Frieren',title:'THE LAST GREAT MAGE',series:'FRIEREN: BEYOND JOURNEY’S END',color:'#d5d7bf',weapon:'zoltraak',passive:'grimoire',skill:'Ancient Stone Golem',description:'Pierce the horde with precise Zoltraak rays. Conceal mana while you move, gather it faster while still, and summon a stone golem with crushing fists and a violet mouth beam.',power:5,speed:3,range:5,hp:95,move:220},
 {id:'samus',name:'Samus',fullName:'Samus Aran',title:'THE GALACTIC HUNTER',series:'METROID',color:'#efbd75',weapon:'powerbeam',passive:'energytank',skill:'Power Bomb',description:'Hunt the rift in a powered suit. Charge your arm cannon, pierce enemies with plasma and clear the area with a timed Power Bomb.',power:5,speed:4,range:5,hp:125,move:230},
 {id:'megumi',secondWeapon:'nue',name:'Megumi',fullName:'Megumi Fushiguro',title:'THE TEN SHADOWS',series:'JUJUTSU KAISEN',color:'#afbedc',weapon:'shadows',passive:'talisman',skill:'Eight-Handled Sword',description:'Begin with Divine Dogs and Nue as separate summon weapons. Both stay close and attack nearby threats. Your ultimate summons Mahoraga, whose wheel adapts as it intercepts attacks.',power:4,speed:3,range:4,hp:100,move:225},
 {id:'eren',name:'Eren',fullName:'Eren Yeager',title:'THE ATTACK TITAN',series:'ATTACK ON TITAN',color:'#b7c5a0',weapon:'odmblades',formWeapon:'titanfists',passive:'freedom',skill:'Titan Shift',description:'Fight with dual ODM blades as a human, then use your ultimate to become the Attack Titan and wield crushing fists. Shift back with your next ultimate; both forms share weapon levels and evolutions. Titan hardening grants armor, resistance and crushing power.',power:5,speed:4,range:2,hp:110,move:235},
 {id:'yuki',name:'Yuki',fullName:'Yuki Tsukumo',title:'THE STAR RAGE',series:'JUJUTSU KAISEN',color:'#efbd9c',weapon:'garuda',passive:'masscore',skill:'Maximum: Black Hole',description:'Turn virtual mass into devastating Garuda strikes. Hits and kills build Star Rage; at full charge, enter Maximum Mass for eight seconds. Your ultimate forms a controlled black hole that pulls and crushes nearby enemies.',power:5,speed:4,range:3,hp:120,move:230},
 {id:'diavolo',name:'Diavolo',title:'THE HIDDEN EMPEROR',series:'JOJO’S BIZARRE ADVENTURE',color:'#e69caf',weapon:'crimson',passive:'epitaph',skill:'Time Erasure',description:'Crush nearby enemies with King Crimson. Stand hits and kills reveal fate through Epitaph: predict a direct attack, erase its outcome and counter. Erase time to reposition safely, then end it with a finishing barrage.',power:5,speed:4,range:2,hp:110,move:235},
 {id:'rimuru',name:'Rimuru',fullName:'Rimuru Tempest',title:'THE SLIME SOVEREIGN',series:'THAT TIME I GOT REINCARNATED AS A SLIME',color:'#a5dce9',weapon:'blackflame',passive:'greatsage',skill:'Gluttony',description:'Hunt with homing Black Flame and consume essence through Predation. Assimilate up to five permanent adaptations for damage and resistance. Become a slime to draw in threats, devour weakened enemies and absorb hostile shots.',power:5,speed:4,range:4,hp:110,move:230},
 {id:'featherine',name:'Featherine',fullName:'Featherine Augustus Aurora',title:'THE WITCH OF THEATERGOING',series:'UMINEKO WHEN THEY CRY',color:'#bda3dc',weapon:'quill',passive:'memoryfragment',skill:'The Last Page',description:'Write cursed ink through the rift with the Author’s Quill. Quill hits and kills build Narrative Authority; at full charge, rewrite your next volley into a piercing Red Truth. The Last Page opens an author’s stage that slows enemies, erases hostile shots and closes with a final crimson sentence.',power:5,speed:3,range:5,hp:100,move:220},
 ERZA_CHARACTER,
 GUTS_CHARACTER,
 DENJI_CHARACTER,
];
export const ITEMS = {
 ...COMPLEX_ITEMS,
 ...SOUL_GEM_ITEMS,
 ...PAIRED_ITEMS,
 ...GUTS_ITEMS,
 ...DENJI_ITEMS,
 ...ERZA_ITEMS,
 quill:{name:'Author’s Quill',type:'weapon',color:'#baa2da',owner:'Featherine',max:5,description:'Write homing ink quills that pierce and curse enemies. Ranks add quills and piercing. Featherine’s full Narrative Authority turns the next volley into an empowered Red Truth.',scaling:'+ quills, damage and piercing'},
 memoryfragment:{name:'Memory Fragment',type:'passive',color:'#b9cba0',owner:'Featherine',max:3,description:'+5% weapon damage and +5% weapon area per rank. Featherine gains 10% more Narrative Authority per rank.',scaling:'+ damage, area and Authority gain'},
 blackflame:{name:'Black Flame',type:'weapon',color:'#96cfed',owner:'Rimuru',max:5,description:'Homing dark flames burn enemies and explode on impact. Higher ranks add bolts, damage and impact area.',scaling:'+ bolts, damage and blast radius'},
 greatsage:{name:'Great Sage',type:'passive',color:'#c4dce4',owner:'Rimuru',max:3,description:'+5% weapon damage and +6% XP pickup range per rank. Rimuru gains 10% more Predation essence per rank.',scaling:'+ damage, pickup range and essence'},
 crimson:{name:'King Crimson',type:'weapon',color:'#dd91a8',owner:'Diavolo',max:5,description:'Your Stand punches a nearby cone, stunning and knocking enemies back. Land a strike to reveal fate through Epitaph.',scaling:'+ damage and reach'},
 epitaph:{name:'Epitaph',type:'passive',color:'#ddba91',owner:'Diavolo',max:3,description:'+6% all weapon damage and +4% dodge chance per rank. Diavolo gains 10% more Fate per rank.',scaling:'+ damage, dodge and Fate gain'},
 garuda:{name:'Garuda',type:'weapon',color:'#91c9aa',owner:'Yuki',max:5,description:'Garuda circles Yuki, then leaves her side to ricochet through 5–9 different nearby enemies as it levels up. It must return before attacking again. Hits build Star Rage.',scaling:'+ damage, bounce targets, flight speed and bounce range'},
 masscore:{name:'Virtual Mass',type:'passive',color:'#f1c58c',owner:'Yuki',max:3,description:'+6% weapon damage and +10 max HP per rank. Yuki gains 10% more Star Rage per rank.',scaling:'+ damage, health and Star Rage gain'},
 odmblades:{name:'ODM Blades',type:'weapon',color:'#c5d9df',owner:'Eren',max:5,description:'Sweep twin blades through nearby enemies, inflicting bleeding. Eren equips this weapon in human form.',scaling:'+ damage, reach and blade arcs'},
 titanfists:{name:'Titan Fists',type:'weapon',color:'#d6ad91',owner:'Eren',max:5,description:'Crushing close-range punches stun and knock enemies back. Eren equips this weapon in Titan form.',scaling:'+ damage and impact radius'},
 freedom:{name:'Key of Freedom',type:'passive',color:'#b5c799',owner:'Eren',max:3,description:'+10 max HP and +0.3 HP/s regeneration per rank. Supports both of Eren’s weapon fusions.',scaling:'+ max HP and regeneration'},
 nue:{name:'Nue',type:'weapon',color:'#c2b5da',owner:'Megumi',max:5,description:'Summon a winged shikigami that stays near you and strikes nearby enemies with stunning lightning.',scaling:'+ lightning damage and summon duration'},
 red:{name:'Reversal Red',type:'weapon',color:'#f18d9f',owner:'Gojo',max:5,description:'A repulsive red blast that explodes, knocks enemies away and curses them. Max Red, Blue and Six Eyes to fuse Hollow Purple.',scaling:'+ damage, blast radius and knockback'},
 shadows:{name:'Divine Dogs',type:'weapon',color:'#aabbd7',owner:'Megumi',max:5,description:'Summon two Divine Dogs to pursue and bite enemies. Higher ranks strengthen the pack. Nue is a separate summon weapon.',scaling:'+ pack damage and duration'},
 talisman:{name:'Shadow Talisman',type:'passive',color:'#a5b6cb',owner:'Megumi',max:3,description:'+12% summon duration and +5% weapon damage per rank.',scaling:'+ summon duration and damage'},
 zoltraak:{name:'Zoltraak',type:'weapon',color:'#e1dcb8',owner:'Frieren',max:5,description:'A precise, long-range ray that pierces enemies. Mana Reveal empowers the next cast.',scaling:'+ damage, reach and beam width'},
 grimoire:{name:'Ancient Grimoire',type:'passive',color:'#b2cdb9',owner:'Frieren',max:3,description:'+8% weapon area and +5% damage per rank.',scaling:'+ area and damage'},
 powerbeam:{name:'Power Beam',type:'weapon',color:'#f2bd73',owner:'Samus',max:5,description:'Fast arm-cannon bolts. Fill Charge Cycle for an explosive charged volley.',scaling:'+ damage, bolts and piercing'},
 energytank:{name:'Energy Tank',type:'passive',color:'#9fdad7',owner:'Samus',max:3,description:'+18 max HP and +3.5% damage resistance per rank.',scaling:'+ max HP and damage resistance'},
 clockshot:{name:'Zafkiel Flintlock',type:'weapon',color:'#e9a778',owner:'Kurumi',max:5,description:'Fire red clock bullets that curse and slow enemies. Higher ranks add shots and piercing.',scaling:'+ bullets, damage and piercing'},
 timepiece:{name:'Time Reserve',type:'passive',color:'#dfb866',owner:'Kurumi',max:3,description:'Reduce weapon and ultimate cooldowns by 6% and extend clock-bullet slows by 15% per rank.',scaling:'−6% cooldown, +15% clock-mark duration per rank'},
 icelance:{name:'Ice Lance',type:'weapon',color:'#a7d9f0',owner:'Esdeath',max:5,description:'Piercing ice spears freeze enemies briefly. Bosses resist repeated immobilization.',scaling:'+ spears, damage and piercing'},
 demonextract:{name:'Demon’s Extract',type:'passive',color:'#a2c9ec',owner:'Esdeath',max:3,description:'+6% area, +4% damage and 25% freeze resistance per rank.',scaling:'+ area, damage and freeze resistance'},
  pallet:{name:'Pallet Rifle',type:'weapon',color:'#b6a3dd',owner:'Shinji',max:5,description:'EVA-01 fires a precise three-round burst. Higher ranks increase damage and piercing.',scaling:'+ damage and armor piercing'},
  atfield:{name:'AT Field',type:'passive',color:'#edc58c',owner:'Shinji',max:3,description:'+11 shield and 4% damage resistance per rank. Recharges every 9 seconds.',scaling:'+ shield and damage resistance'},
  poison:{name:'Poison Vial',type:'weapon',color:'#9cdbad',owner:'Maomao',max:5,description:'Lob a toxic vial that breaks into a poison circle for 4+ seconds. Enemies carry poison after leaving it.',scaling:'+ damage, cloud size and duration'},
  herbs:{name:'Medicinal Herbs',type:'passive',color:'#b9d58a',owner:'Maomao',max:3,description:'+0.6 HP regeneration and +15% food healing per rank.',scaling:'+ regeneration and food healing'},
  rosebow: { name:'Rosewood Bow', type:'weapon', color:'#f1a0c8', owner:'Madoka', max:5, description:'Homing rose arrows seek out enemies and bloom on impact.', scaling:'+ arrows, damage and bloom radius' },
  soulgem: { name:'Pink Soul Gem', type:'passive', color:'#f1a0c8', owner:'Madoka', max:3, description:'Recharge a 10 HP shield every 10 seconds per rank. +6% damage per rank.', scaling:'+ shield strength and damage' },
  ki: { name:'Ki Wave', type:'weapon', color:'#ffb35c', owner:'Goku', max:5, description:'Charge a compact ki sphere, then launch a bright, piercing energy wave. Hits burn and push enemies back.', scaling:'+ damage, energy waves and piercing' },
  blue: { name:'Cursed Blue', type:'weapon', color:'#83cfff', owner:'Gojo', max:5, description:'Conjure a Blue vortex that pulls enemies in, curses and slows them, then collapses.', scaling:'+ damage, area and duration' },
  shuriken: { name:'Wind Shuriken', type:'weapon', color:'#76e3bc', owner:'Naruto', max:5, description:'Spinning blades cut through multiple enemies and inflict Bleeding.', scaling:'+ blades, damage and piercing' },
  kunai: { name:'Flying Kunai', type:'weapon', color:'#ebba8c', max:5, description:'A fast fan of knives that inflict Bleeding.', scaling:'+ knives and damage' },
  lightning: { name:'Storm Seal', type:'weapon', color:'#f3d475', max:5, description:'Lightning jumps between nearby enemies and briefly stuns them.', scaling:'+ chains and damage' },
  orbit: { name:'Spirit Orbs', type:'weapon', color:'#80c8ff', max:5, description:'Orbiting spirits guard the space around you.', scaling:'+ orbs, orbit size and damage' },
  senzu: { name:'Senzu Bean', type:'passive', color:'#99d779', owner:'Goku', max:3, description:'Restore 1.5 HP per second per rank. +15 max HP per rank.', scaling:'+ regeneration and max health' },
  eyes: { name:'Six Eyes', type:'passive', color:'#aba4ff', owner:'Gojo', max:3, description:'Reduce weapon and special cooldowns by 8% per rank.', scaling:'−8% cooldown per rank' },
  headband: { name:'Leaf Headband', type:'passive', color:'#74dfb6', owner:'Naruto', max:3, description:'Move 10% faster and gain 5% dodge chance per rank.', scaling:'+ movement speed and dodge chance' },
  magnet: { name:'Soul Magnet', type:'passive', color:'#d99be7', max:3, description:'Increase XP pickup range by 45% per rank.', scaling:'+ pickup radius' },
  scroll: { name:'Sage Scroll', type:'passive', color:'#ecba87', max:3, description:'Increase weapon area by 15% per rank.', scaling:'+ weapon area' },
  power: { name:'Power Band', type:'passive', color:'#f18d9f', max:3, description:'Increase all weapon damage by 12% per rank.', scaling:'+ all damage' },
};
export const FUSIONS = [
 ...COMPLEX_FUSIONS,
 QUINTET_FUSION,
 SALVATION_FUSION,
 ...PAIRED_FUSIONS,
 ...GUTS_FUSIONS,
 ...DENJI_FUSIONS,
 ...ERZA_FUSIONS,
 {id:'chimeragarden',name:'Chimera Shadow Garden',weapon:'shadows',weapon2:'nue',passive:'talisman',color:'#a3b9df',description:'Divine Dogs + Nue + Shadow Talisman → unite Totality dogs and chain-lightning Nue inside a lingering shadow garden. Its pulses curse, slow and pull enemies. Consumes Nue and frees one weapon slot.'},
 {id:'rasenflash',name:'Flying Raijin: Rasen Flash',weapon:'shuriken',weapon2:'kunai',passive:'scroll',color:'#c7efd0',description:'Wind Shuriken + Flying Kunai + Sage Scroll → marked kunai flash between nearby enemies, releasing stunning, bleeding wind explosions at every jump. Consumes Flying Kunai and frees one weapon slot.'},
 {id:'panaceapouch',name:'Panacea Pouch',type:'passive',passive:'herbs',passive2:'senzu',color:'#b8dc9b',description:'Medicinal Herbs + Senzu Bean → retain both max-rank effects, gain another 1 HP/s and 25% food healing. Absorbs Senzu Bean and frees one passive slot; its weapon evolutions remain available.'},
 {id:'adaptivebarrier',name:'Adaptive Barrier',type:'passive',passive:'energytank',passive2:'atfield',color:'#b3dcd5',description:'Energy Tank + AT Field → retain both max-rank effects, gain another 20 shield and recharge shields every 7 seconds. Absorbs AT Field and frees one passive slot; its weapon evolution remains available.'},
 {id:'finalchapter',name:'Final Chapter: Red Truth',weapon:'quill',passive:'memoryfragment',color:'#e4a8b5',description:'Author’s Quill + Memory Fragment → additional piercing quills write red-and-gold glyphs that detonate on contact, cursing and slowing nearby enemies.'},
 {id:'beelzebub',name:'Beelzebub: Soul Devourer',weapon:'blackflame',passive:'greatsage',color:'#a7d5e9',description:'Black Flame + Great Sage → stronger homing devouring flames. Explosions pull nearby enemies inward and curse them.'},
 {id:'fatalforecast',name:'King Crimson: Fatal Forecast',weapon:'crimson',passive:'epitaph',color:'#e2b49f',description:'King Crimson + Epitaph → a broader Stand strike followed by a delayed echo, with cursed impact and stronger knockback.'},
 {id:'starcrusher',name:'Garuda: Star Crusher',weapon:'garuda',passive:'masscore',color:'#e6cb92',description:'Garuda + Virtual Mass → three extra ricochet targets and mass shockwaves that knock enemies back.'},
 {id:'scoutassault',name:'Thunder Spears',weapon:'odmblades',formWeapon:'titanfists',passive:'freedom',color:'#e4ce94',description:'ODM Blades + Key of Freedom → fire paired Thunder Spears that stick briefly, then explode with stunning, armor-shattering force.'},
 {id:'titanquake',name:'Titan Quake',weapon:'titanfists',passive:'freedom',color:'#e4c99e',description:'Titan Fists + Key of Freedom → hardened punches release stunning shockwaves.'},
 {id:'stormnue',name:'Nue: Thunderstorm',weapon:'nue',passive:'talisman',color:'#d9ccf0',description:'Nue + Shadow Talisman → lightning chains between four nearby enemies and stuns them.'},
 {id:'totality',name:'Ten Shadows: Totality',weapon:'shadows',passive:'talisman',color:'#c1cde4',description:'Divine Dogs + Shadow Talisman → empowered Totality dogs with stronger bleeding bites.'},
 {id:'ancientmagic',name:'Ancient Magic',weapon:'zoltraak',passive:'grimoire',color:'#f5efd0',description:'Zoltraak + Ancient Grimoire → three long, piercing rays that reveal cursed targets.'},
 {id:'plasmabeam',name:'Plasma Beam',weapon:'powerbeam',passive:'energytank',color:'#a8efd5',description:'Power Beam + Energy Tank → charged plasma bolts pierce, burn and explode on impact.'},
 {id:'zafkiel',name:'Zafkiel: Seventh Bullet',weapon:'clockshot',passive:'timepiece',color:'#eecb8c',description:'Zafkiel Flintlock + Time Reserve → echoing volleys of piercing clock bullets. Each hit briefly stuns, curses and slows its target.'},
 {id:'icecrown',name:'Ice Cavalry',weapon:'icelance',passive:'demonextract',color:'#c7edfa',description:'Ice Lance + Demon’s Extract → a broad volley of freezing lances that burst into cold shockwaves.'},
  {id:'positron',name:'Spear of Longinus',weapon:'pallet',passive:'atfield',color:'#e99ba8',description:'Pallet Rifle + AT Field → throw the crimson Spear of Longinus. It pierces and curses enemies, then returns for a second, weaker strike.'},
  {id:'elixir',name:'Jade Alchemy',weapon:'poison',passive:'herbs',color:'#c5efb0',description:'Poison Vial + Medicinal Herbs → three toxic vials form broad poison circles. Overlapping doses stack up to 3 times.'},
  { id:'ultimate', name:'Ultimate Madoka', weapon:'rosebow', passive:'soulgem', color:'#ffc6e7', description:'Rosewood Bow + Pink Soul Gem → a constellation of homing light arrows with radiant explosions.' },
  { id:'kamehameha', name:'Super Kamehameha', weapon:'ki', passive:'senzu', color:'#75d9ff', description:'Ki Wave + Senzu Bean → a massive, double-damage beam that pierces the entire horde.' },
  { id:'purple', name:'Hollow Purple', weapon:'blue', weapon2:'red', passive:'eyes', color:'#d3a0ff', description:'Cursed Blue + Reversal Red + Six Eyes → red and blue converge into a piercing Hollow Purple with cursed impact bursts.' },
  { id:'rasen', name:'Rasenshuriken', weapon:'shuriken', passive:'headband', color:'#85ffe0', description:'Wind Shuriken + Leaf Headband → giant, returning blades with explosive impacts.' },
  { id:'raijin', name:'Flying Thunder God', weapon:'kunai', passive:'scroll', color:'#ffe193', description:'Flying Kunai + Sage Scroll → radiant knives that burst with thunder.' },
  { id:'tempest', name:'Heavenly Tempest', weapon:'lightning', passive:'power', color:'#fff3a6', description:'Storm Seal + Power Band → a storm that chains through the whole battlefield.' },
  { id:'galaxy', name:'Soul Galaxy', weapon:'orbit', passive:'magnet', color:'#a9d7ff', description:'Spirit Orbs + Soul Magnet → a constellation of six powerful orbiting stars.' },
];
export const MAPS = [

  { id:'garden', name:'Sakura Sanctuary', subtitle:'Petals fall. Legends rise.', tag:'TWILIGHT GARDEN', color:'#e9a6c8', ground:'#293530', dark:'#1d2926', stone:'#727775', water:'#284e5b', foliage:'#df91b6' },
  { id:'ruins', name:'Sunken Citadel', subtitle:'An empire lost between worlds.', tag:'ANCIENT RUINS', color:'#edc58c', ground:'#42413a', dark:'#302f2b', stone:'#979381', water:'#346263', foliage:'#b4bd83' },
  { id:'moon', name:'Moonlit Crossing', subtitle:'Follow the lanterns into the mist.', tag:'BAMBOO FOREST', color:'#a3baf9', ground:'#252e3c', dark:'#1c2430', stone:'#788397', water:'#253f62', foliage:'#7d99ba' },
  { id:'labyrinth', name:'Witch’s Labyrinth', subtitle:'A wish shines brightest in the dark.', tag:'MADOKA / WITCH REALM', color:'#f0a8d5', ground:'#33253e', dark:'#201b2d', stone:'#ab7e9b', water:'#753752', foliage:'#e5a7cb' },
 {id:'marineford',name:'Marineford',subtitle:'Hold the line at the bay of justice.',tag:'ONE PIECE / NAVAL FORT',color:'#accfdc',ground:'#667a89',dark:'#2e455b',stone:'#b0bac0',water:'#346b8c',foliage:'#d5e4e7'},
 {id:'citadel',name:'Frozen Citadel',subtitle:'The Empire’s winter never ends.',tag:'AKAME GA KILL / ICE FORT',color:'#b9dff5',ground:'#556e86',dark:'#293d59',stone:'#a6bfd3',water:'#3d7d9c',foliage:'#c5dfec'},
 {id:'castle',name:'Crimson Castle',subtitle:'Break the siege beneath a blood-red moon.',tag:'GOTHIC CASTLE',color:'#d9a4b9',ground:'#514652',dark:'#262535',stone:'#a29ca5',water:'#45466d',foliage:'#ac7a93'},
 {id:'forest',name:'Emerald Forest',subtitle:'Ancient roots guard a forgotten trail.',tag:'ENCHANTED WOODLAND',color:'#b2d893',ground:'#425e4e',dark:'#233c35',stone:'#81957b',water:'#356c75',foliage:'#92bb78'},
 {id:'zebes',name:'Zebes',subtitle:'Descend beneath the alien surface.',tag:'METROID / CHOZO DEPTHS',color:'#b4b4e0',ground:'#454166',dark:'#262841',stone:'#8d87aa',water:'#bf734b',foliage:'#8dd2bd'},
 {id:'shiganshina',name:'Shiganshina',subtitle:'Stand beneath Wall Maria.',tag:'ATTACK ON TITAN / WALLED DISTRICT',color:'#e0bb8f',ground:'#887c69',dark:'#49463f',stone:'#c4b99c',water:'#617f80',foliage:'#a98165'},
 ...NEW_ANIME_MAPS,
 ...TOKYO_MAPS,
 BERSERK_MAP,
 GRAVEYARD_MAP,
];
export const MAX_SLOTS = 5;
export const fusionType=f=>f.type==='passive'?'passive':'weapon';
export const fusionBase=f=>fusionType(f)==='passive'?f.passive:f.weapon;
export const fusionIngredient=f=>f.weapon2||f.passive2||f.passive;
export const fusionIngredients=f=>f.ingredients?[...f.ingredients]:fusionType(f)==='passive'?[f.passive,f.passive2]:[f.weapon,...(f.weapon2?[f.weapon2]:[]),...(f.passive?[f.passive]:[])];
export const fusionConsumedIngredients=f=>f.consumedIngredients?[...f.consumedIngredients]:[...(f.weapon2?[f.weapon2]:[]),...(f.passive2?[f.passive2]:[])];
export const hasComposite=(p,id)=>!p.hardcore&&ITEMS[id]?.fusionOnly&&(p.passives?.[id]||0)>=ITEMS[id].max&&FUSIONS.some(f=>f.resultItem===id&&p.fusions?.[id]===f.id);
export const hasQuintet=p=>hasComposite(p,'quintet');
// Soul Bond: maxed Soul Gems merge into one slot a gem at a time, keeping every bonus.
export const soulBondGems=p=>!p.hardcore&&(p.passives?.soulbond||0)>=1&&Array.isArray(p.soulBond)?p.soulBond.filter(id=>SOUL_GEM_IDS.includes(id)):[];
const bondPurified=p=>p.soulBondPurified===true&&soulBondGems(p).includes('soulgem');
export const consumedFusionIngredient=(p,id)=>soulBondGems(p).includes(id)||bondPurified(p)&&id==='griefseed'||FUSIONS.some(f=>p.fusions?.[fusionBase(f)]===f.id&&fusionConsumedIngredients(f).includes(id))||hasQuintet(p)&&p.quintetPurified===true&&id==='griefseed'||hasComposite(p,'chozosuit')&&p.chozoBarrier===true&&id==='atfield';
// Absorbed passives keep all their statistics and still unlock weapon evolutions.
export function effectivePassiveRank(p,id){
 if(forbiddenPassive(p,id))return 0;
 const owned=p.passives[id]||0;
 if(id==='griefseed'&&hasQuintet(p)&&p.quintetPurified===true)return Math.max(owned,ITEMS.griefseed.max);
 if(soulBondGems(p).includes(id)||id==='griefseed'&&bondPurified(p))return Math.max(owned,ITEMS[id].max);
 if(id==='atfield'&&hasComposite(p,'chozosuit')&&p.chozoBarrier===true)return Math.max(owned,ITEMS.atfield.max);
 return FUSIONS.some(f=>hardcoreFusionAllowed(p,f)&&fusionConsumedIngredients(f).includes(id)&&ITEMS[id]?.type==='passive'&&p.fusions?.[fusionBase(f)]===f.id&&((fusionType(f)==='passive'?p.passives:p.weapons)[fusionBase(f)]||0)>=ITEMS[fusionBase(f)].max)?Math.max(owned,ITEMS[id].max):owned;
}
export const fusionRequirement=f=>fusionIngredients(f).map(id=>`${id===fusionBase(f)&&f.requiresEvolution?FUSIONS.find(other=>other.id===f.requiresEvolution)?.name||ITEMS[id].name:ITEMS[id].name} LV ${ITEMS[id].max}`).join(' + ')+(f.requiresEvolution&&!fusionIngredients(f).includes(fusionBase(f))?` · Requires ${FUSIONS.find(other=>other.id===f.requiresEvolution)?.name||f.requiresEvolution} LV ${ITEMS[fusionBase(f)].max}`:'')+(f.requiredCharacter?` · ${CHARACTERS.find(c=>c.id===f.requiredCharacter)?.name||f.requiredCharacter} only`:'');
export const forbiddenWeapon=(p,id)=>id==='titanfists'&&(p.id!=='eren'||p.erenForm!=='titan')||!!(p.hardcore&&ITEMS[id]?.type==='weapon'&&!signatureWeaponIds(CHARACTERS.find(c=>c.id===p.id)).includes(id));
export const forbiddenPassive=(p,id)=>!!(p.hardcore&&ITEMS[id]?.type==='passive'&&!signaturePassiveIds(CHARACTERS.find(c=>c.id===p.id)).includes(id));
export const forbiddenItem=(p,id)=>forbiddenWeapon(p,id)||forbiddenPassive(p,id);
export const hardcoreFusionAllowed=(p,f)=>!p.hardcore||p.shenronEvolution===f.id&&fusionType(f)==='weapon'&&signatureWeaponIds(CHARACTERS.find(c=>c.id===p.id)).includes(f.weapon)||fusionIngredients(f).every(id=>ITEMS[id]?.type==='weapon'?signatureWeaponIds(CHARACTERS.find(c=>c.id===p.id)).includes(id):ITEMS[id]?.type==='passive'&&signaturePassiveIds(CHARACTERS.find(c=>c.id===p.id)).includes(id));
export const inactiveFormWeapon=(p,id)=>p.id==='eren'&&['odmblades','titanfists'].includes(id)&&id!==p.weapon;
export function createPlayer(character,meta={}) {
  const p = {...character,meta,vanished:[],baseRulesVersion:2,rerollsLeft:1+(meta.rerolls||0),vanishesLeft:1+(meta.vanishes||0), x:0, y:0, hp:character.hp, baseHp:character.hp, maxHp:character.hp, xp:0, level:1, nextXp:6,
    weapons:{[character.weapon]:1}, passives:{[character.passive]:1}, fusions:{}, cooldowns:{}, facing:1, moving:false, walk:0, damage:1, shield:0, maxShield:0, shieldTimer:0, cooldown:1, magnet:115, area:1, regen:0, dodge:0};
  if(character.secondWeapon)p.weapons[character.secondWeapon]=1;p.weapons[character.weapon]+=meta.startRank||0;if(character.id==='eren'){p.erenForm='human';p.form=0;p.formWeapons={odmblades:p.weapons.odmblades,titanfists:1+(meta.startRank||0)};p.erenRulesVersion=2;syncErenProgress(p);}refreshStats(p); p.hp=p.maxHp;p.shield=p.maxShield; return p;
}
export function refreshStats(p) {
  p.shieldRulesVersion=2;
  const rank=id=>effectivePassiveRank(p,id);const m=p.meta||{},panacea=!p.hardcore&&p.fusions.herbs==='panaceapouch',barrier=!p.hardcore&&(p.fusions.energytank==='adaptivebarrier'||hasComposite(p,'chozosuit')&&p.chozoBarrier===true),purified=!p.hardcore&&(p.fusions.soulgem==='purifiedsoul'&&(p.passives.soulgem||0)>=ITEMS.soulgem.max||hasQuintet(p)&&p.quintetPurified===true||bondPurified(p)),codex=!p.hardcore&&p.fusions.grimoire==='sagecodex';
  p.maxHp=p.baseHp+rank('senzu')*15+rank('energytank')*18+rank('freedom')*10+rank('masscore')*10+rank('brand')*12+rank('bloodengine')*10+rank('variasuit')*5+(m.hp||0);
  p.regen=1+rank('senzu')*1.5+rank('herbs')*.6+rank('freedom')*.3+rank('bluegem')*.35+rank('toadoil')*.2+(m.regen||0)+(panacea?1:0);p.healing=1+rank('herbs')*.15+rank('toadoil')*.05+(m.healing||0)+(panacea?.25:0)+(purified?.2:0);
  p.cooldown=1-rank('eyes')*.08-rank('timepiece')*.06-rank('griefseed')*.03-rank('purplegem')*.03-rank('sagebeads')*.02-rank('witchring')*.02-(codex?.06:0);
  p.move=CHARACTERS.find(c=>c.id===p.id).move*(1+rank('headband')*.1+rank('morphball')*.03+(m.move||0));
  p.dodge=rank('headband')*.05+rank('epitaph')*.04+rank('purplegem')*.015+rank('morphball')*.01;
  p.magnet=115*(1+rank('magnet')*.45+rank('greatsage')*.06+rank('griefseed')*.05+rank('sagebeads')*.03+rank('gravitysuit')*.05+rank('goldenbutterfly')*.05+(m.magnet||0));
  p.area=1+rank('scroll')*.15+rank('demonextract')*.06+rank('grimoire')*.08+rank('memoryfragment')*.05+rank('manacrystal')*.04+rank('yellowgem')*.05+rank('witchring')*.03;p.freezeResistance=Math.min(.9,rank('demonextract')*.25+rank('gravitysuit')*.1);
  p.damage=(1+rank('power')*.12+rank('soulgem')*.06+rank('demonextract')*.04+rank('grimoire')*.05+rank('talisman')*.05+rank('masscore')*.06+rank('epitaph')*.06+rank('greatsage')*.05+rank('memoryfragment')*.05+rank('heartkreuz')*.04+rank('bloodengine')*.04+rank('manacrystal')*.03+rank('redgem')*.04+rank('sagecloak')*.03+rank('truthseal')*.04)*(1+(m.damage||0));
  p.maxShield=(p.id==='eren'&&p.erenForm==='titan'?45:0)+rank('soulgem')*10+rank('atfield')*11+rank('heartkreuz')*7+(m.shield||0)+(barrier?20:0);p.damageReduction=rank('atfield')*.04+rank('energytank')*.035+rank('brand')*.03+rank('sagecloak')*.02+rank('variasuit')*.02;p.shieldRecharge=barrier?7:rank('atfield')?9:p.id==='eren'&&p.erenForm==='titan'?8:10;
  if(purified)p.shieldRecharge=Math.min(p.shieldRecharge,8);
  // Ascent pacts and events: lasting multipliers (regeneration adds) for the run.
  if(p.ascentMods){const a=p.ascentMods;p.damage*=a.damage||1;p.maxHp*=a.maxHp||1;p.move*=a.move||1;p.cooldown*=a.cooldown||1;p.magnet*=a.magnet||1;p.regen+=a.regen||0;}
  if(p.shenronBlessing===true){p.maxHp*=1.2;p.damage*=1.2;p.move*=1.1;p.regen+=1;}
  p.shield=Math.min(p.shield,p.maxShield);
  p.hp=Math.min(p.hp,p.maxHp);
}
export function grantXp(p, amount) { p.xp+=amount; return takeLevel(p); }
export function takeLevel(p) {
  if(p.xp<p.nextXp)return false;
  p.xp-=p.nextXp;p.level++;p.nextXp=Math.round(p.nextXp*1.12+2);return true;
}
export function fusionReady(p, fusion) {
  const base=fusionBase(fusion);
  if(!hardcoreFusionAllowed(p,fusion)||consumedFusionIngredient(p,base)||fusion.requiredCharacter&&p.id!==fusion.requiredCharacter)return false;
  if(fusion.resultItem&&((p.passives[base]||0)||(p.weapons[base]||0)))return false;
  if(fusion.requiresEvolution){if(p.fusions[base]!==fusion.requiresEvolution||forbiddenWeapon(p,base)||inactiveFormWeapon(p,base)||(p.weapons[base]||0)<ITEMS[base].max)return false;}
  else if(p.fusions[base])return false;
  return fusionIngredients(fusion).every(id=>{
    const item=ITEMS[id];if(!item)return false;
    if(item.type==='weapon')return !forbiddenWeapon(p,id)&&!inactiveFormWeapon(p,id)&&(!p.fusions[id]||id===base&&p.fusions[id]===fusion.requiresEvolution)&&(p.weapons[id]||0)>=item.max;
    if(item.fusionOnly)return !forbiddenPassive(p,id)&&(p.passives[id]||0)>=item.max&&FUSIONS.some(result=>result.resultItem===id&&p.fusions[id]===result.id);
    // A passive fusion must consume a physically equipped, unfused ingredient.
    return fusionType(fusion)==='passive'? (!p.fusions[id]||fusion.acceptsFusions?.[id]?.includes(p.fusions[id]))&&!consumedFusionIngredient(p,id)&&(p.passives[id]||0)>=item.max : effectivePassiveRank(p,id)>=item.max;
  });
}
export function getUpgradePool(p) {
  const pool=[];
  for(const [id,item] of Object.entries(ITEMS)) {
    const inventory=item.type==='weapon'?p.weapons:p.passives, level=inventory[id]||0;
    if(item.fusionOnly||forbiddenItem(p,id)||inactiveFormWeapon(p,id)||p.vanished?.includes(id)||consumedFusionIngredient(p,id))continue;
    if(level>=item.max || p.fusions[id])continue;
    if(!level && Object.keys(inventory).length>=MAX_SLOTS)continue;
    pool.push({kind:'item',id,level:level+1});
  }
  for(const f of FUSIONS) if(fusionReady(p,f))pool.push({kind:'fusion',id:f.id});
  pool.push(...soulBondChoices(p));
  if(pool.length<3)pool.push({kind:'heal',id:'heal'});
  return pool;
}
export function getChoices(p, random=Math.random,exclude=[]) {
  const pool=getUpgradePool(p), fusions=pool.filter(c=>c.kind==='fusion'||c.kind==='bond');
  const regular=pool.filter(c=>c.kind!=='fusion'&&c.kind!=='bond');
  for(let i=regular.length-1;i>0;i--){const j=Math.floor(random()*(i+1));[regular[i],regular[j]]=[regular[j],regular[i]];}
  // An available fusion is always offered; other slots remain random.
  return [...fusions,...regular.filter(c=>!exclude.includes(c.id)),...regular.filter(c=>exclude.includes(c.id))].slice(0,3);
}
// Offered like a fusion: start a bond from two maxed gems, or add one more maxed gem.
// Skipped while all five gems sit equipped, since the Quintet fusion is then ready.
export function soulBondChoices(p){
  if(p.hardcore||hasQuintet(p)||fusionReady(p,QUINTET_FUSION))return [];
  const bond=soulBondGems(p),ready=SOUL_GEM_IDS.filter(id=>!bond.includes(id)&&(p.passives[id]||0)>=ITEMS[id].max);
  if(bond.length)return ready.slice(0,1).map(id=>({kind:'bond',id}));
  return ready.length>=2?[{kind:'bond',id:ready[1],with:ready[0]}]:[];
}
function applySoulBond(p,choice){
  const offer=soulBondChoices(p).find(c=>c.id===choice.id&&(c.with||null)===(choice.with||null));if(!offer)return false;
  const added=[...(offer.with?[offer.with]:[]),offer.id],gems=[...soulBondGems(p),...added],oldMax=p.maxHp,oldShield=p.maxShield;
  for(const id of added){if(id==='soulgem'&&p.fusions.soulgem==='purifiedsoul')p.soulBondPurified=true;delete p.passives[id];delete p.fusions[id];}
  p.passives.soulbond=1;p.soulBond=gems;
  if(SOUL_GEM_IDS.every(id=>gems.includes(id))){
    // The fifth gem completes the circle: the bond becomes the Quintet.
    delete p.passives.soulbond;delete p.soulBond;p.passives.quintet=ITEMS.quintet.max;p.fusions.quintet=QUINTET_FUSION.id;p.quintetPurified=p.soulBondPurified===true;delete p.soulBondPurified;
  }
  refreshStats(p);p.hp=Math.min(p.maxHp,p.hp+Math.max(0,p.maxHp-oldMax));p.shield=Math.min(p.maxShield,p.shield+Math.max(0,p.maxShield-oldShield));return true;
}
export function applyChoice(p, choice) {
  if(choice.kind==='bond')return applySoulBond(p,choice);
  if(choice.kind==='fusion') {
    const f=FUSIONS.find(f=>f.id===choice.id);
    if(!f||!fusionReady(p,f))return false;
    const oldMax=p.maxHp,oldShield=p.maxShield;
    if(f.resultItem==='quintet')p.quintetPurified=p.fusions.soulgem==='purifiedsoul'&&(p.passives.soulgem||0)>=ITEMS.soulgem.max;
    if(f.resultItem==='chozosuit')p.chozoBarrier=p.fusions.energytank==='adaptivebarrier'&&(p.passives.energytank||0)>=ITEMS.energytank.max;
    p.fusions[fusionBase(f)]=f.id;
    for(const id of fusionConsumedIngredients(f)){delete (ITEMS[id].type==='weapon'?p.weapons:p.passives)[id];delete p.cooldowns[id];if(f.resultItem)delete p.fusions[id];}
    if(f.resultItem)(ITEMS[f.resultItem].type==='weapon'?p.weapons:p.passives)[f.resultItem]=ITEMS[f.resultItem].max;
    syncErenProgress(p);refreshStats(p);p.hp=Math.min(p.maxHp,p.hp+Math.max(0,p.maxHp-oldMax));p.shield=Math.min(p.maxShield,p.shield+Math.max(0,p.maxShield-oldShield));return true;
  }
  if(choice.kind==='heal'){p.hp=Math.min(p.maxHp,p.hp+50);return true;}
  const item=ITEMS[choice.id];if(!item||item.fusionOnly||forbiddenItem(p,choice.id)||inactiveFormWeapon(p,choice.id))return false;
  const inventory=item.type==='weapon'?p.weapons:p.passives, rank=inventory[choice.id]||0;
  if(consumedFusionIngredient(p,choice.id))return false;
  if(rank>=item.max||(!rank&&Object.keys(inventory).length>=MAX_SLOTS)||p.fusions[choice.id])return false;
  inventory[choice.id]=choice.maxLevel===true?item.max:rank+1;if(p.id==='eren'&&choice.id===p.weapon)p.formWeapons[choice.id]=inventory[choice.id];syncErenProgress(p);const oldMax=p.maxHp;refreshStats(p);p.hp=Math.min(p.maxHp,p.hp+Math.max(0,p.maxHp-oldMax));return true;
}
export function formatTime(seconds){return `${Math.floor(seconds/60).toString().padStart(2,'0')}:${Math.floor(seconds%60).toString().padStart(2,'0')}`;}
export const clampZoom=value=>Math.min(1.65,Math.max(.6,value));

export const WAVE_SECONDS=30;
export const waveAt=time=>Math.floor(time/WAVE_SECONDS)+1;
export function chestItemCount(random=Math.random){const roll=random();return roll<.65?1:roll<.9?3:5;}
export function chestOffers(p,count,random=Math.random,context={}){
  if(count<=0)return [];
  const virtual={...p,weapons:{...p.weapons},passives:{...p.passives},fusions:{...p.fusions},cooldowns:{...p.cooldowns},formWeapons:{...p.formWeapons}},rewards=[];
  for(let i=0;i<count;i++){
    const pool=getUpgradePool(virtual),fusions=pool.filter(c=>c.kind==='fusion'),items=pool.filter(c=>c.kind==='item'),refill=context.maxLevelItems&&(Object.keys(virtual.weapons).length<MAX_SLOTS||Object.keys(virtual.passives).length<MAX_SLOTS),choices=refill&&items.length?items:fusions.length?fusions:items.length?items:[{kind:'heal',id:'heal'}];
    let choice=choices[Math.min(choices.length-1,Math.floor(random()*choices.length))];
    if(context.maxLevelItems&&choice.kind==='item')choice={...choice,level:ITEMS[choice.id].max,maxLevel:true};
    if(applyChoice(virtual,choice))rewards.push({...choice});
  }return rewards;
}
export function openChest(p,random=Math.random,context={}){return chestOffers(p,chestItemCount(random),random,context);}
export function resolveChestReward(g,take,random=Math.random){
  if(g.status!=='chest'||g.chestIndex>=g.rewards.length)return false;
  const index=g.chestIndex||0,choice=g.rewards[index];if(choice.decision)return false;
  const beforeSlots=Object.keys(g.p.weapons).length+Object.keys(g.p.passives).length;
  if(take&&!applyChoice(g.p,choice))return false;
  choice.decision=take?'taken':'ignored';g.chestIndex=index+1;
  // Forecast the still-unopened slots using the equipment actually accepted so far.
  const oldRemaining=g.rewards.length-g.chestIndex,freed=take?Math.max(0,beforeSlots-Object.keys(g.p.weapons).length-Object.keys(g.p.passives).length):0,remaining=g.mode==='bossrush'?Math.max(oldRemaining,freed):oldRemaining;
  g.rewards.splice(g.chestIndex,oldRemaining,...chestOffers(g.p,remaining,random,{maxLevelItems:g.mode==='bossrush'}));return true;
}
export function ignoreChest(g){if(g.status!=='chest')return false;for(let i=g.chestIndex||0;i<g.rewards.length;i++)g.rewards[i].decision='ignored';g.chestIndex=g.rewards.length;return true;}

export function rerollChoices(p,current,random=Math.random){if(p.rerollsLeft<=0)return null;const ids=current.map(c=>c.id);if(!getUpgradePool(p).some(c=>!ids.includes(c.id)))return null;p.rerollsLeft--;return getChoices(p,random,ids);}
export function vanishItem(p,id){if(p.vanishesLeft<=0||!getUpgradePool(p).some(c=>c.kind==='item'&&c.id===id))return false;p.vanished.push(id);p.vanishesLeft--;return true;}
