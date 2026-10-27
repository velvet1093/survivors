// Multi-step equipment sets. Each set is built in stages, like the Soul Gems:
//  1. Train its four pieces to max rank.
//  2. Bond maxed pieces into one passive slot, one at a time; every bonded piece
//     keeps its max-rank bonus and frees the slot it used.
//  3. The fourth piece completes the set: the bond becomes the finished relic,
//     which adds a completion bonus on top of every piece's bonus.
//  4. Awaken the relic with its catalyst passive (also at max rank) for a stronger
//     bonus. The catalyst is absorbed too and keeps its own max-rank bonus.
// Holding all four maxed pieces at once also offers the whole set as one fusion.
const piece=(name,series,color,description,scaling)=>({name,type:'passive',series,color,max:3,description,scaling});
const FMA='FULLMETAL ALCHEMIST',OP='ONE PIECE',DS='DEMON SLAYER';
export const SET_ITEMS={
 transmutation:piece('Transmutation Circle',FMA,'#7fb8e8','A chalked array that bends matter to your will, granting +4% weapon area and +2% weapon damage per rank. One of the four pieces of the Philosopher’s Stone.','+4% weapon area and +2% weapon damage per rank'),
 automail:piece('Automail Arm',FMA,'#b8c2cf','A steel prosthetic tuned by a master mechanic, granting +6 maximum HP and +2% damage resistance per rank. One of the four pieces of the Philosopher’s Stone.','+6 max HP and +2% resistance per rank'),
 alchemistwatch:piece('State Alchemist’s Watch',FMA,'#d9c27a','The silver watch of a dog of the military reduces weapon and ultimate cooldowns by 2% and increases XP pickup range by 3% per rank. One of the four pieces of the Philosopher’s Stone.','−2% cooldown and +3% pickup range per rank'),
 redstone:piece('Red Stone',FMA,'#d8525e','A shard of crimson amplifier grants +3% weapon damage and +0.25 HP/s regeneration per rank. Bond it with the other three alchemy pieces to complete the Philosopher’s Stone.','+3% weapon damage and +0.25 HP/s per rank'),
 strawhat:piece('Straw Hat',OP,'#e8c25a','A treasured hat passed from captain to captain grants +4% movement speed and +3% weapon damage per rank. One of the four pieces of the Pirate King’s Legacy.','+4% movement speed and +3% weapon damage per rank'),
 logpose:piece('Log Pose',OP,'#8fc8e0','A compass that locks onto the next island grants +6% XP pickup range and +1% dodge per rank. One of the four pieces of the Pirate King’s Legacy.','+6% pickup range and +1% dodge per rank'),
 vivrecard:piece('Vivre Card',OP,'#f2ece0','A slip of life paper that always finds its owner grants +0.3 HP/s regeneration and +5% food healing per rank. One of the four pieces of the Pirate King’s Legacy.','+0.3 HP/s and +5% food healing per rank'),
 gumgumfruit:piece('Gum-Gum Fruit',OP,'#a874c8','A swirled Devil Fruit makes your body stretch, granting +8 maximum HP and +2% damage resistance per rank. Bond it with the other three pirate pieces to complete the Pirate King’s Legacy.','+8 max HP and +2% resistance per rank'),
 hanafuda:piece('Hanafuda Earrings',DS,'#e86a4a','Sun-painted earrings handed down a family of charcoal burners grant +4% weapon damage per rank. One of the four pieces of Hinokami Kagura.','+4% weapon damage per rank'),
 checkeredhaori:piece('Checkered Haori',DS,'#3a8a6a','A green-and-black checkered coat grants +5 maximum HP and +2% damage resistance per rank. One of the four pieces of Hinokami Kagura.','+5 max HP and +2% resistance per rank'),
 nichirintsuba:piece('Nichirin Tsuba',DS,'#8a8a9a','The hand guard of a colour-changing blade reduces weapon and ultimate cooldowns by 2% and grants +3% weapon area per rank. One of the four pieces of Hinokami Kagura.','−2% cooldown and +3% weapon area per rank'),
 foxmask:piece('Fox Mask',DS,'#f0ece4','A warding mask carved by a retired master grants +3% movement speed and +1.5% dodge per rank. Bond it with the other three pieces to complete Hinokami Kagura.','+3% movement speed and +1.5% dodge per rank'),
 stonebond:{name:'Incomplete Stone',type:'passive',series:FMA,color:'#c46a74',max:1,fusionOnly:true,description:'Maxed alchemy pieces transmuted into one passive slot, one at a time. Every bonded piece keeps its max-rank bonus. Bond all four (Transmutation Circle, Automail Arm, State Alchemist’s Watch and Red Stone) and the stone is complete.',scaling:'Every bonded piece keeps its max-rank bonus'},
 crewbond:{name:'Straw Hat Crew',type:'passive',series:OP,color:'#e0a05a',max:1,fusionOnly:true,description:'Maxed pirate pieces gathered into one passive slot, one at a time. Every bonded piece keeps its max-rank bonus. Gather all four (Straw Hat, Log Pose, Vivre Card and Gum-Gum Fruit) and the crew becomes the Pirate King’s Legacy.',scaling:'Every bonded piece keeps its max-rank bonus'},
 breathbond:{name:'Total Concentration',type:'passive',series:DS,color:'#e88a5a',max:1,fusionOnly:true,description:'Maxed Demon Slayer pieces focused into one passive slot, one at a time. Every bonded piece keeps its max-rank bonus. Bond all four (Hanafuda Earrings, Checkered Haori, Nichirin Tsuba and Fox Mask) to master Hinokami Kagura.',scaling:'Every bonded piece keeps its max-rank bonus'},
 philosopherstone:{name:'Philosopher’s Stone',type:'passive',series:FMA,color:'#e0485a',max:1,fusionOnly:true,description:'The four maxed alchemy pieces united in one passive slot. Retains every piece’s bonus and adds +8% weapon damage and +6% weapon area. Awaken it with a maxed Red Truth Seal for The Gate of Truth.',scaling:'All four piece bonuses · +8% damage · +6% area'},
 piratelegacy:{name:'Pirate King’s Legacy',type:'passive',series:OP,color:'#e8b84a',max:1,fusionOnly:true,description:'The four maxed pirate pieces united in one passive slot. Retains every piece’s bonus and adds +8% weapon damage, +8% movement speed and +10% XP pickup range. Awaken it with a maxed Key of Freedom for Gear Fifth.',scaling:'All four piece bonuses · +8% damage · +8% speed · +10% pickup'},
 hinokami:{name:'Hinokami Kagura',type:'passive',series:DS,color:'#f07a3a',max:1,fusionOnly:true,description:'The four maxed Demon Slayer pieces united in one passive slot. Retains every piece’s bonus and adds +8% weapon damage and −5% weapon and ultimate cooldowns. Awaken it with a maxed Six Eyes for the Transparent World.',scaling:'All four piece bonuses · +8% damage · −5% cooldown'},
 gateoftruth:{name:'The Gate of Truth',type:'passive',series:FMA,color:'#efe6d2',max:1,fusionOnly:true,description:'The Philosopher’s Stone awakened before the Gate. Retains all four alchemy pieces and the Red Truth Seal, and its bonus grows to +15% weapon damage, +10% weapon area and −5% cooldowns.',scaling:'All five absorbed bonuses · +15% damage · +10% area · −5% cooldown'},
 gearfifth:{name:'Gear Fifth: Sun God Nika',type:'passive',series:OP,color:'#f6f1e4',max:1,fusionOnly:true,description:'The Pirate King’s Legacy awakened into the warrior of liberation. Retains all four pirate pieces and Key of Freedom, and its bonus grows to +15% weapon damage, +15% movement speed, +15% XP pickup range and +1.5 HP/s.',scaling:'All five absorbed bonuses · +15% damage · +15% speed · +15% pickup · +1.5 HP/s'},
 transparentworld:{name:'Transparent World',type:'passive',series:DS,color:'#f4e3c0',max:1,fusionOnly:true,description:'Hinokami Kagura awakened until the body becomes transparent. Retains all four Demon Slayer pieces and Six Eyes, and its bonus grows to +10% weapon damage, −5% cooldowns and +6% dodge.',scaling:'All five absorbed bonuses · +10% damage · −5% cooldown · +6% dodge'},
};
// Stage 3 and 4 bonuses, applied on top of every absorbed piece's own bonus.
export const SET_BONDS=[
 {id:'philosopherstone',bond:'stonebond',members:['transmutation','automail','alchemistwatch','redstone'],awaken:'gateoftruth',catalyst:'truthseal',stage:'TRANSMUTATION',
  bonus:{damage:.08,area:.06},awakenBonus:{damage:.15,area:.10,cooldown:.05}},
 {id:'piratelegacy',bond:'crewbond',members:['strawhat','logpose','vivrecard','gumgumfruit'],awaken:'gearfifth',catalyst:'freedom',stage:'CREW',
  bonus:{damage:.08,move:.08,magnet:.10},awakenBonus:{damage:.15,move:.15,magnet:.15,regen:1.5}},
 {id:'hinokami',bond:'breathbond',members:['hanafuda','checkeredhaori','nichirintsuba','foxmask'],awaken:'transparentworld',catalyst:'eyes',stage:'BREATHING',
  bonus:{damage:.08,cooldown:.05},awakenBonus:{damage:.10,cooldown:.05,dodge:.06}},
];
const name=id=>SET_ITEMS[id]?.name;
const composite=(s,description)=>({id:s.id,name:name(s.id),type:'passive',passive:s.id,resultItem:s.id,series:SET_ITEMS[s.id].series,color:SET_ITEMS[s.id].color,ingredients:[...s.members],consumedIngredients:[...s.members],description});
// The awakening absorbs the finished relic and its catalyst, and lists the four
// pieces as consumed too so they keep counting at max rank inside the new item.
const awakening=(s,catalystName,description)=>({id:s.awaken,name:name(s.awaken),type:'passive',passive:s.awaken,resultItem:s.awaken,series:SET_ITEMS[s.awaken].series,color:SET_ITEMS[s.awaken].color,ingredients:[s.id,s.catalyst],consumedIngredients:[s.id,s.catalyst,...s.members],description:`${name(s.id)} + ${catalystName} → ${description[0].toUpperCase()}${description.slice(1)}`});
const [stone,pirate,breath]=SET_BONDS;
export const SET_FUSIONS=[
 composite(stone,'Transmutation Circle + Automail Arm + State Alchemist’s Watch + Red Stone → complete the Philosopher’s Stone from four LV 3 pieces. Keeps every max-rank bonus in one passive slot, frees three slots and adds +8% damage and +6% area. No need to hold all four at once: bond any two maxed pieces into an Incomplete Stone and add the rest one at a time.'),
 composite(pirate,'Straw Hat + Log Pose + Vivre Card + Gum-Gum Fruit → assemble the Pirate King’s Legacy from four LV 3 pieces. Keeps every max-rank bonus in one passive slot, frees three slots and adds +8% damage, +8% speed and +10% pickup range. No need to hold all four at once: gather any two maxed pieces into the Straw Hat Crew and recruit the rest one at a time.'),
 composite(breath,'Hanafuda Earrings + Checkered Haori + Nichirin Tsuba + Fox Mask → master Hinokami Kagura from four LV 3 pieces. Keeps every max-rank bonus in one passive slot, frees three slots and adds +8% damage and −5% cooldowns. No need to hold all four at once: bond any two maxed pieces into Total Concentration and add the rest one at a time.'),
 awakening(stone,'Red Truth Seal','open The Gate of Truth. Absorbs the maxed Red Truth Seal and keeps its bonus, frees its slot, and raises the set bonus to +15% damage, +10% area and −5% cooldowns.'),
 awakening(pirate,'Key of Freedom','awaken Gear Fifth: Sun God Nika. Absorbs the maxed Key of Freedom and keeps its bonus, frees its slot, and raises the set bonus to +15% damage, +15% speed, +15% pickup range and +1.5 HP/s.'),
 awakening(breath,'Six Eyes','enter the Transparent World. Absorbs the maxed Six Eyes and keeps its bonus, frees its slot, and raises the set bonus to +10% damage, −5% cooldowns and +6% dodge.'),
];
export const SET_PIECE_IDS=SET_BONDS.flatMap(s=>s.members);
