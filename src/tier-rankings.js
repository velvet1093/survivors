// Tier placements for the in-game tier list. Each entry carries four short notes:
// reason (the one-line verdict), comparison (why this tier and not the next),
// caution (what holds it back) and bestWith (how to get the most from it).
// Measured numbers behind the placements come from tools/balance and are shown
// beside each entry through src/tier-measurements.js.
const entry=(tier,{reason,comparison,caution,bestWith})=>({tier,reason,comparison,caution,bestWith});

// Heroes are ranked from bot runs (tools/balance/hero-sim.mjs) in both a kiting and a
// close-range style, keeping each hero's better composite of damage (60%) and
// survivability (40%), each relative to the roster median.
export const CHARACTER_RANKINGS={
 gojo:entry('S',{
  reason:'Gojo is the safest hero in the game: Infinity negates a direct hit every eight seconds, so he loses HP slower than anyone else.',
  comparison:'His damage is only around the roster median, but he loses his HP pool less than half as fast as a typical hero, which no other kit matches. Hollow Purple later turns two weapons into one stronger slot.',
  caution:'Damage over time bypasses Infinity, and Hollow Purple needs Blue, Red and Six Eyes all maxed.',
  bestWith:'Max Blue and Six Eyes early, take Red when offered, and keep moving so Infinity is charged before the next big hit.'}),
 goku:entry('S',{
  reason:'Goku is the second-safest hero: Senzu Bean regeneration out-heals most late-run chip damage, and each Saiyan stage adds damage and speed.',
  comparison:'Like Gojo, his damage is around median, but his regeneration lets him take hits that would wear down any A-tier hero. The timed ascensions scale him with no setup.',
  caution:'His early minutes are slower, because each Saiyan stage needs survival time before it adds damage and speed.',
  bestWith:'Play safe through the first stages, then lean on Super Kamehameha or a strong area fusion once Ki Wave and Senzu Bean are maxed.'}),
 diavolo:entry('A',{
  reason:'Diavolo is the best close-range fighter: Epitaph negates hits often enough that he can punch inside the crowd with the fourth-lowest damage intake.',
  comparison:'Up close King Crimson deals above-median damage, and his safety is close to the S heroes. At range his damage collapses, so the A tier assumes you fight close.',
  caution:'King Crimson needs enemies within punching range, and Time Erasure pauses his weapons while active.',
  bestWith:'Fight inside packs while Fate refills, take Epitaph ranks for faster negation, and evolve Fatal Forecast.'}),
 erza:entry('A',{
  reason:'Erza in Adamantine armor is the third-safest hero, and up close she still deals near-median damage with her shield bash.',
  comparison:'Fighting close in Adamantine gives her safety near the S heroes; Black Wing raises her damage but more than doubles the HP she loses. Switching between them well is what keeps her in A.',
  caution:'Armor choice needs constant attention: Black Wing takes 8% more damage and Adamantine moves 18% slower, with a three-second switch cooldown.',
  bestWith:'Hold Adamantine in dense fights and boss phases, switch to Black Wing to clear safe packs quickly, and fuse Heaven’s Arsenal so every form improves.'}),
 eren:entry('A',{
  reason:'Titan Eren is one of the toughest heroes: resistance, a hardening shield and Key of Freedom regeneration let him brawl with above-median damage.',
  comparison:'Up close in Titan form he combines top-ten damage with top-five safety. Kiting at range cuts his damage by almost two thirds, so the A tier assumes you brawl.',
  caution:'Each Titan Shift cast switches form, so the ultimate is not an emergency button; both forms fight up close.',
  bestWith:'Shift to the Titan early and stay there, then fuse Titan Quake.'}),
 featherine:entry('A',{
  reason:'Featherine deals the highest damage in the roster, with homing, piercing Quill volleys and frequent Red Truth revisions.',
  comparison:'Her offense is unmatched, and her damage intake is still slightly better than median; only the S heroes and the three brawlers above her are safer.',
  caution:'Her kit has no shield, regeneration or dodge, and she has the smallest HP pool of the A heroes.',
  bestWith:'Memory Fragment early for Authority and Final Chapter, then defensive passives to cover the gap.'}),
 rimuru:entry('A',{
  reason:'Rimuru pairs top-five damage with median survivability: Predation adaptations stack permanent resistance while Black Flame clears.',
  comparison:'He is the most balanced hero, without a weak side, but neither his damage nor his safety reaches the peaks of the heroes above him.',
  caution:'His adaptations take kills to unlock, and Gluttony’s pull and execute do not affect bosses.',
  bestWith:'Great Sage for faster essence, then Beelzebub: Soul Devourer.'}),
 guts:entry('B',{
  reason:'Guts has the largest HP pool and top-ten damage up close, but his slow cleaves leave him taking more damage than average.',
  comparison:'He is the strongest B hero: his damage beats the A brawlers, but he lacks Diavolo’s negation or Titan Eren’s resistance.',
  caution:'He moves slowly and must stand in the crowd to hit, so ranged enemies punish him.',
  bestWith:'Brand of Sacrifice for Astral Edge, defensive passives, and Berserker Armor saved for dense packs.'}),
 megumi:entry('B',{
  reason:'Megumi deals the second-highest damage in the roster: Divine Dogs and Nue fight independently and evolve into stronger summons.',
  comparison:'His clear speed is S-level, but he loses HP faster than most heroes, which pulls his composite into B.',
  caution:'He is fragile; his summons do not protect him from shots or contact damage.',
  bestWith:'Shadow Talisman for longer summons, a defensive passive or two, and Mahoraga summoned early to absorb shots.'}),
 yuki:entry('B',{
  reason:'Yuki deals top-six damage up close as Garuda and Maximum Mass smash through the crowd, but she takes heavy damage doing it.',
  comparison:'Her offense is A-level; her survivability is below median, and Black Hole’s charge-up does not help in an emergency.',
  caution:'Garuda must return before it strikes again, and her kit has no shield or regeneration.',
  bestWith:'Virtual Mass for faster Star Rage, Star Crusher for extra targets, and a defensive passive.'}),
 kurumi:entry('B',{
  reason:'Kurumi deals top-three damage with cursing, slowing clock bullets and has the best crowd-control ultimate cycle in the roster.',
  comparison:'Her clear speed is A-level, but only four heroes lose HP faster, so she relies on positioning and her domain.',
  caution:'Her small HP pool and lack of passive defence make her one of the most punishing heroes when caught.',
  bestWith:'Time Reserve for more domains, and a defensive passive early; bank Stolen Seconds before boss phases.'}),
 samus:entry('B',{
  reason:'Samus has the second-largest HP pool and median survivability, with Charge Cycle evolutions keeping her damage climbing.',
  comparison:'She is solid on both sides but strong on neither; the A heroes beat her on damage or on safety.',
  caution:'Her beam evolutions arrive at kill thresholds, and Power Bomb’s two-second charge makes it a slow escape.',
  bestWith:'Energy Tank toward Plasma Beam, and Adaptive Barrier or the Chozo Power Suit for even more defence.'}),
 madoka:entry('B',{
  reason:'Madoka’s homing arrows never miss, and Hope adds arrows, healing and shield repair as she collects XP.',
  comparison:'Kiting suits her best: above-median damage with slightly below-median safety. Up close she takes far more damage, so she lacks the brawlers’ option.',
  caution:'Leaving gems behind weakens Hope, and she has no strong passive defence before Soul Gem fusions.',
  bestWith:'Collect XP aggressively, fuse Ultimate Madoka, and build toward the Quintet for Salvation.'}),
 frieren:entry('B',{
  reason:'Frieren deals top-four damage with long piercing Zoltraak rays, and her golem plus Annihilation Barrage add two separate ultimates.',
  comparison:'Her offense is A-level, but she loses HP faster than any other hero in the runs.',
  caution:'Mana builds fastest while standing still, which conflicts with dodging, and she has little built-in defence.',
  bestWith:'Ancient Grimoire into Ancient Magic or Sage’s Codex, defensive passives, and keep the golem alive between waves.'}),
 naruto:entry('B',{
  reason:'Naruto is the fastest hero and deals top-eight damage, but he has no shield or resistance and takes heavy damage up close.',
  comparison:'Speed makes him easy to play and his damage is above median, but his survivability is among the lowest.',
  caution:'He relies on movement and dodge rather than real protection, so a mistake in a crowd costs a lot of HP.',
  bestWith:'Leaf Headband into Rasenshuriken, then Sage’s Regalia or a defensive passive.'}),
 maomao:entry('B',{
  reason:'Maomao starts with strong regeneration from Medicinal Herbs, but lingering poison clears at only about median speed.',
  comparison:'Her damage and survivability are both near median, which places her mid-B.',
  caution:'Fast enemies leave her poison circles before it finishes them, and her kit has no shield or resistance.',
  bestWith:'Senzu Bean for Panacea Pouch, area passives for bigger circles, and Jade Alchemy as soon as possible.'}),
 shinji:entry('B',{
  reason:'Shinji is durable, with AT Field shielding and Pilot Rage resistance, but his rifle damage is among the lowest in the roster.',
  comparison:'His safety is about median, and slow clear speed lets waves build up around him.',
  caution:'The EVA moves slowly and the Pallet Rifle is a narrow burst, so crowds take longer to clear.',
  bestWith:'Power Band and area passives to fix his clear speed; fuse the Spear of Longinus as early as possible.'}),
 esdeath:entry('C',{
  reason:'Esdeath has the best ultimate in the game, but between casts her damage is among the lowest and she takes heavy damage.',
  comparison:'Mahapadma is an S-tier rescue, yet her measured damage and safety are both near the bottom of the roster in either play style.',
  caution:'Bosses resist repeated immobilization, and her small HP pool leaves little room for mistakes.',
  bestWith:'Six Eyes or Time Reserve for more Mahapadma casts, Demon’s Extract for Ice Cavalry, and defensive passives.'}),
 denji:entry('C',{
  reason:'Denji’s chainsaw bleeds and Chainsaw Man heals a little, but his measured damage is the lowest in the roster.',
  comparison:'Even fighting close, where his chainsaw works, he combines the lowest damage with one of the highest damage intakes.',
  caution:'Both his attacks and his healing need enemies within chainsaw reach, and healing caps at 24 HP per activation.',
  bestWith:'Blood Engine for Chainsaw Overdrive, ranged weapons from the pool, and Chainsaw Man saved for a packed crowd.'}),
};

// Ultimates are ranked by what one activation buys: control, damage, safety and how
// soon it is useful after the button is pressed. Titan Shift is judged as a form change.
export const ULTIMATE_RANKINGS={
 esdeath:entry('S',{
  reason:'Mahapadma freezes enemies, hostile shots and danger-zone clocks inside its domain, then shatters everything it held.',
  comparison:'Nothing else stops all three threats at once: bodies, bullets and telegraphed hazards. It is the most complete panic button in the roster and also sets up a burst window.',
  caution:'The domain is fixed where you cast it, and bosses resist repeated immobilization, so walking out of it gives the protection up.',
  bestWith:'Cast it on top of yourself when a ring of enemies and projectiles closes in, then spend the frozen seconds repositioning or hitting a boss.'}),
 gojo:entry('S',{
  reason:'Unlimited Void arrests every enemy in a wide fixed domain and ends with a collapse that crushes everything inside.',
  comparison:'It matches Mahapadma for crowd control and adds a heavy finishing hit, making it both an escape and a clear.',
  caution:'Its area is fixed at the cast point, and it does not stop projectiles fired from outside the domain.',
  bestWith:'Pull a crowd together with Blue first, then open the domain so the collapse hits as many arrested enemies as possible.'}),
 kurumi:entry('S',{
  reason:'City of Devouring Time slows enemy movement, attacks and shots, adds three shadow doubles and ends with a cursing stun.',
  comparison:'The slow covers projectiles as well as bodies, and Stolen Seconds let her cast it again sooner and keep it up longer than any other domain.',
  caution:'The clock domain is fixed, so a moving fight can drift out of it; banked seconds are only spent on the next cast.',
  bestWith:'Bank seconds through a dense wave, then cast early in a boss phase so the slow, doubles and final chime all land.'}),
 madoka:entry('S',{
  reason:'Law of Cycles purifies hostile projectiles and rains homing arrows while gathering XP, protecting and scaling in one cast.',
  comparison:'It is the only ultimate that defends, damages and feeds levelling at once, and its homing arrows need no aim or positioning.',
  caution:'It deletes shots rather than stopping bodies, so contact damage from a surrounding crowd still has to be avoided.',
  bestWith:'Use it when a ranged wave fills the screen with shots; the gathered XP turns straight into Hope and new levels.'}),
 yuki:entry('A',{
  reason:'Black Hole pulls nearby enemies into a five-second singularity, crushes them repeatedly and consumes hostile shots.',
  comparison:'Its damage on a packed crowd rivals the S domains and it fills Star Rage instantly. The charge-up and boss resistance keep it just below them.',
  caution:'It compresses for two seconds before the hole opens, leaving you exposed, and bosses resist its pull.',
  bestWith:'Start the charge before the crowd reaches you, then fight inside Maximum Mass while the hole keeps feeding Garuda targets.'}),
 megumi:entry('A',{
  reason:'Mahoraga stays until defeated, slashes nearby enemies, intercepts shots and adapts to grow stronger and tougher.',
  comparison:'A persistent bodyguard keeps working long after the button press, which is excellent value per cooldown. It is less of an instant rescue than a domain.',
  caution:'Mahoraga has its own HP and pays for intercepted shots with it; recasting heals it but does not reset its position.',
  bestWith:'Summon it early so its adaptations stack before a boss arrives, and recast to heal it rather than waiting for it to fall.'}),
 frieren:entry('A',{
  reason:'The Ancient Stone Golem stays until defeated, crushes nearby enemies with heavy fists and fires a piercing mouth beam.',
  comparison:'Like Mahoraga it is persistent value that scales with player level, and its beam adds reach that melee guardians lack.',
  caution:'The golem has its own HP and hovers near Frieren, so it cannot hold a lane on its own while she kites far away.',
  bestWith:'Keep the golem alive by recasting to heal it, and pair it with the separate Annihilation Barrage for burst windows.'}),
 featherine:entry('A',{
  reason:'The Last Page opens a stage that curses and slows nearby enemies, erases hostile projectiles and ends with a crimson sentence.',
  comparison:'It combines projectile deletion with a slow, like a lighter Mahapadma, but it does not fully stop enemies.',
  caution:'The stage is fixed for five seconds and bosses keep their damage resistance against its final sentence.',
  bestWith:'Open it under a ranged wave, then use the slowed crowd to feed Quill hits and build Narrative Authority.'}),
 rimuru:entry('A',{
  reason:'Gluttony pulls enemies into a devouring field, executes weakened ones, absorbs nearby shots and restores up to 30 HP.',
  comparison:'Execution, projectile absorption and healing make it a strong reset, and every devoured enemy feeds Predation adaptations.',
  caution:'Bosses resist the pull and cannot be executed, and the field works best against crowds already worn down.',
  bestWith:'Cast it after Black Flame has softened a wave so the execute threshold clears most of the field.'}),
 erza:entry('A',{
  reason:'Nakagami channels briefly, then lands seven golden spatial cuts that stun, destroy scenery and erase shots in their areas.',
  comparison:'Seven separate stunning cuts cover far more of the screen than a single blast, and each also clears projectiles.',
  caution:'The 0.9-second channel happens before any cut lands, and the cuts strike fixed marked targets rather than following movement.',
  bestWith:'Channel it while enemies are spread around you so the seven cuts each find their own group.'}),
 samus:entry('A',{
  reason:'Power Bomb charges for two seconds in Morph Ball, then clears a wide area, stuns enemies and destroys hostile shots.',
  comparison:'The blast is one of the largest clears available and doubles as projectile cleanup, but it arrives late.',
  caution:'The two-second charge leaves you to dodge before the bomb goes off, which can be too slow as an emergency button.',
  bestWith:'Start it as a wave approaches rather than once surrounded, and follow with Plasma Beam into the stunned crowd.'}),
 shinji:entry('A',{
  reason:'Berserk Awakening claws nearby enemies, deflects shots with the AT Field, fires stronger bursts and ends in a shockwave.',
  comparison:'It is offense and defense at once and pairs well with Pilot Rage, but it rewards staying close rather than escaping.',
  caution:'Its claws and shockwave are close-range, so it does little against distant shooters beyond deflecting their shots.',
  bestWith:'Trigger it when a pack reaches you, ideally while Pilot Rage frenzy is also active.'}),
 guts:entry('B',{
  reason:'Berserker Armor grants damage, speed and resistance for eight seconds while repeated cleaves cut nearby enemies.',
  comparison:'It is a strong damage window with real resistance, but it neither stops enemies nor removes shots, so it is less safe than the A-tier controls.',
  caution:'You still take damage while armored, and its strikes only reach enemies close to Guts.',
  bestWith:'Pop it once a boss or dense pack is in Dragonslayer range, then cleave through while the resistance holds.'}),
 denji:entry('B',{
  reason:'Chainsaw Man adds damage, speed and resistance for eight seconds with rapid bleeding sweeps and capped healing.',
  comparison:'Close to Berserker Armor in shape; its healing helps, but the 24 HP cap per activation limits how much it rescues.',
  caution:'Healing only comes from connected sweeps and caps at 24 HP, and you still take damage while transformed.',
  bestWith:'Transform in the middle of a pack so every sweep connects and the bleeding stacks on as many enemies as possible.'}),
 diavolo:entry('B',{
  reason:'Time Erasure makes Diavolo immune for five seconds while he moves faster, then lands a broad finishing barrage.',
  comparison:'Five seconds of immunity is a guaranteed escape, but enemies keep acting and his weapons stop, so it trades offense for safety.',
  caution:'Automatic weapon casts pause during erased time, so the crowd is untouched until the barrage at your new position.',
  bestWith:'Use it to escape a closing ring or a boss attack, and end the erasure next to the largest group for the barrage.'}),
 maomao:entry('B',{
  reason:'Panacea Garden grows toxic blooms, heals and gives 35% damage resistance for six seconds.',
  comparison:'A reliable sustain window that suits her poison kit, but it neither stops enemies nor clears projectiles.',
  caution:'Its blooms need time to finish enemies, and the resistance ends after six seconds whether or not you are safe.',
  bestWith:'Cast it inside your poison clouds when a pack is already there, letting the blooms and poison finish it while you recover.'}),
 goku:entry('B',{
  reason:'Spirit Bomb gathers overhead and lands as a giant blast that knocks back everything it hits.',
  comparison:'It is a big single clear with knockback, but after it lands it gives no lasting control, protection or projectile cleanup.',
  caution:'The bomb takes time to gather and Goku moves slower while it charges, so it is a poor emergency escape.',
  bestWith:'Throw it into a dense approaching wave or onto a boss surrounded by adds.'}),
 eren:entry('B',{
  reason:'Titan Shift switches permanently between human and Attack Titan, with a shockwave when transforming.',
  comparison:'Its value is the form itself: Titan Eren gains resistance, damage and a hardening shield. As a single activation it does little beyond the shockwave.',
  caution:'Every cast is a form switch, so using it as an emergency button flips you back to the weaker human form.',
  bestWith:'Shift into the Titan once your Titan Fists are worth using and stay there; switch back only to change weapons on purpose.'}),
 naruto:entry('C',{
  reason:'Shadow Clone Rush summons six physical decoys that hunt enemies and strike them with Rasengan.',
  comparison:'Decoys draw attention and add damage, but they offer less direct protection or control than every other ultimate.',
  caution:'Clones fight independently and can scatter, so they do not reliably shield you from a crowd or projectiles.',
  bestWith:'Release them into a large crowd and use the distraction to reposition and keep building chakra.'}),
};

// Weapons are ranked by damage per second alone at max rank on a neutral hero
// (tools/balance/item-sim.mjs), keeping the better of a kiting and a close-range bot.
// Fusions keep their passive ingredient equipped, as they do in a real build.
export const WEAPON_RANKINGS={
 salvation:entry('S',{
  reason:'Salvation: Five Wishes measured the highest damage of any weapon by a wide margin, almost four times the median.',
  comparison:'Nothing else is close, but it takes two separate steps: Ultimate Madoka first, then the five-gem Quintet, so it arrives late.',
  caution:'It requires Madoka, a maxed Ultimate Madoka and the completed Soul Gems of the Quintet.',
  bestWith:'Build Ultimate Madoka early, collect all five Soul Gems, fuse the Quintet, then take Salvation; the Quintet remains equipped and keeps every bonus.'}),
 ultimate:entry('S',{
  reason:'Ultimate Madoka is the second-strongest weapon measured: a constellation of homing light arrows with radiant explosions.',
  comparison:'It needs only Rosewood Bow and Pink Soul Gem, which makes it the strongest weapon for its recipe cost.',
  caution:'It needs both ingredients maxed; its own explosions are what make it strong, so narrow lanes waste some of it.',
  bestWith:'Any hero who finds the bow; on Madoka it is also the first step toward Salvation.'}),
 finalchapter:entry('S',{
  reason:'Final Chapter: Red Truth adds piercing quills whose glyphs detonate, curse and slow, for top-three measured damage.',
  comparison:'It is the strongest two-ingredient fusion after Ultimate Madoka, and Featherine gets even more from it.',
  caution:'Needs both Author’s Quill and Memory Fragment maxed.',
  bestWith:'Featherine, where Narrative Authority revisions stack on top of the glyphs.'}),
 beelzebub:entry('S',{
  reason:'Beelzebub: Soul Devourer fires devouring homing flames that pull enemies into their explosions.',
  comparison:'Pull plus explosion keeps crowds clumped for every other weapon, on top of top-five damage.',
  caution:'Needs both Black Flame and Great Sage maxed.',
  bestWith:'Rimuru, where its kills also feed Predation adaptations.'}),
 zafkiel:entry('S',{
  reason:'Zafkiel: Seventh Bullet fires echoing piercing volleys that stun, curse and slow every target they hit.',
  comparison:'Its damage is top-five, and the stun and slow add control no other S weapon has in such quantity.',
  caution:'Needs both Zafkiel Flintlock and Time Reserve maxed.',
  bestWith:'Kurumi, where clock-bullet slows last longer and her domain keeps targets in the volleys.'}),
 elixir:entry('S',{
  reason:'Jade Alchemy throws three toxic vials whose broad poison circles stack up to three times.',
  comparison:'Stacked poison fields deal S-tier damage over an area, outperforming every other zone weapon.',
  caution:'Poison needs time to finish fast enemies, and it needs both ingredients maxed.',
  bestWith:'Kite enemies through the overlapping circles; area passives make the stacks easier to land.'}),
 icecrown:entry('S',{
  reason:'Ice Cavalry fires a broad volley of freezing lances that burst into cold shockwaves.',
  comparison:'Top-tier damage plus freezes in one slot, and it measured about the same on Esdeath as on the neutral hero.',
  caution:'Bosses resist repeated immobilization, and it needs both ingredients maxed.',
  bestWith:'Esdeath, where freezes also build Frost Dominion.'}),
 ancientmagic:entry('S',{
  reason:'Ancient Magic fires three long piercing rays that reveal cursed targets.',
  comparison:'It triples Zoltraak’s lanes and measured well into S range, a huge upgrade from its base weapon.',
  caution:'Rays still travel in straight lines, so scattered enemies take fewer hits; needs both ingredients maxed.',
  bestWith:'Frieren, whose Mana Reveal empowers the next cast.'}),
 tempest:entry('S',{
  reason:'Heavenly Tempest chains lightning through the whole battlefield.',
  comparison:'It is the strongest fusion of two shared items, and it needs no aiming or positioning.',
  caution:'Needs Storm Seal and Power Band maxed, which spends a passive slot on raw damage.',
  bestWith:'Any hero; Power Band’s damage also boosts every other weapon.'}),
 raijin:entry('S',{
  reason:'Flying Thunder God throws radiant knives that burst with thunder.',
  comparison:'It turns Flying Kunai, a B weapon, into one of the strongest fusions from shared items.',
  caution:'Needs Flying Kunai and Sage Scroll maxed.',
  bestWith:'Area builds; Sage Scroll’s area also boosts the bursts.'}),
 rasen:entry('S',{
  reason:'Rasenshuriken throws giant returning blades with explosive impacts.',
  comparison:'Strong damage on any hero, and Naruto gets even more from it.',
  caution:'Needs Wind Shuriken and Leaf Headband maxed.',
  bestWith:'Naruto, whose Chakra Flow adds blades and damage while he moves.'}),
 chimeragarden:entry('S',{
  reason:'Chimera Shadow Garden unites Totality dogs and lightning Nue inside a shadow field that curses, slows and pulls.',
  comparison:'It turns two weak summons into S-tier damage and frees a weapon slot.',
  caution:'It needs three maxed ingredients: Divine Dogs, Nue and Shadow Talisman.',
  bestWith:'Megumi, where Shadow Resonance empowers the summons.'}),
 plasmabeam:entry('S',{
  reason:'Plasma Beam fires charged bolts that pierce, burn and explode on impact.',
  comparison:'A big upgrade over Power Beam, and on Samus it measured even higher.',
  caution:'Needs Power Beam and Energy Tank maxed.',
  bestWith:'Samus, where Charge Cycle volleys add burst on top.'}),
 rasenflash:entry('A',{
  reason:'Flying Raijin: Rasen Flash flashes kunai between nearby enemies, releasing stunning, bleeding wind explosions.',
  comparison:'Strong damage with stuns and bleed, but it costs three maxed ingredients for a little less than the S fusions.',
  caution:'It needs Wind Shuriken, Flying Kunai and Sage Scroll all maxed.',
  bestWith:'Naruto, who measured higher with it than the neutral hero.'}),
 quill:entry('A',{
  reason:'Author’s Quill writes homing, piercing quills that curse enemies: the strongest base weapon in the game.',
  comparison:'No other unfused weapon measured higher, and its homing never wastes a volley.',
  caution:'Its biggest bonus, Narrative Authority, works only for Featherine.',
  bestWith:'Featherine, then Final Chapter with Memory Fragment.'}),
 heavensarsenal:entry('A',{
  reason:'Requip: Heaven’s Arsenal improves every armor form: wider cleave, extra swords, broader cuts and a bigger shield bash.',
  comparison:'It is a solid upgrade for any wielder, but on Erza its value depends on which armor she is wearing.',
  caution:'Its armor-specific patterns are exclusive to Erza; other wielders get the Heaven’s Wheel swords.',
  bestWith:'Erza, switching armor to match the fight.'}),
 fatalforecast:entry('A',{
  reason:'King Crimson: Fatal Forecast follows each Stand strike with a delayed echo and cursed impacts.',
  comparison:'Close up it more than doubles King Crimson’s damage, but it only works at punching range.',
  caution:'It needs enemies close; kiting at range loses most of its damage.',
  bestWith:'Diavolo, fighting inside the crowd while Epitaph negates hits.'}),
 rosebow:entry('A',{
  reason:'Rosewood Bow fires homing rose arrows that bloom on impact.',
  comparison:'The second-strongest base weapon, and the root of Ultimate Madoka and Salvation.',
  caution:'Its single arrows do less to dense crowds than area weapons.',
  bestWith:'Pink Soul Gem for Ultimate Madoka.'}),
 shuriken:entry('A',{
  reason:'Wind Shuriken sends spinning blades through several enemies and inflicts bleeding.',
  comparison:'A strong base weapon that leads to two fusions, Rasenshuriken and Rasen Flash.',
  caution:'Blades travel in lines, so enemies on the flanks can slip past.',
  bestWith:'Leaf Headband for Rasenshuriken, or Kunai and Scroll for Rasen Flash.'}),
 clockshot:entry('A',{
  reason:'Zafkiel Flintlock fires clock bullets that curse and slow, adding piercing as it ranks up.',
  comparison:'Above-median damage with built-in slows, and it fuses into the S-tier Seventh Bullet.',
  caution:'Its slow is strongest on Kurumi with Time Reserve.',
  bestWith:'Time Reserve for Zafkiel: Seventh Bullet.'}),
 purple:entry('A',{
  reason:'Hollow Purple fuses Blue, Red and Six Eyes into piercing purple blasts with cursed impact bursts.',
  comparison:'It beats Blue or Red alone and frees a slot, but three maxed ingredients is a long road for A-tier damage.',
  caution:'Needs Cursed Blue, Reversal Red and Six Eyes all maxed; Red is consumed.',
  bestWith:'Gojo, who starts with Blue and Six Eyes in his kit.'}),
 titanquake:entry('A',{
  reason:'Titan Quake adds stunning shockwaves to hardened Titan punches.',
  comparison:'It is a large upgrade over Titan Fists and the best measured weapon for Titan Eren.',
  caution:'Only Eren in Titan form can use it, and it needs Titan Fists and Key of Freedom maxed.',
  bestWith:'Shift into the Titan, stay there and fight inside the crowd.'}),
 blackflame:entry('A',{
  reason:'Black Flame fires homing dark flames that burn and explode on impact.',
  comparison:'Strong, reliable homing damage, and the root of the S-tier Beelzebub.',
  caution:'On its own it lacks the pull that makes Beelzebub so strong.',
  bestWith:'Great Sage for Beelzebub: Soul Devourer.'}),
 scoutassault:entry('A',{
  reason:'Thunder Spears fire paired spears that stick, then explode with stunning, armor-shattering force.',
  comparison:'It is the stronger of Eren’s two own fusions in human form and gives him real ranged damage.',
  caution:'Its spears hit a small area, and it needs ODM Blades and Key of Freedom maxed.',
  bestWith:'Human-form Eren who wants range instead of the Titan.'}),
 blue:entry('A',{
  reason:'Cursed Blue opens a vortex that pulls enemies in, curses and slows them, then collapses.',
  comparison:'Above-median damage plus crowd grouping, which helps every other weapon you carry.',
  caution:'It must be paired with Red and Six Eyes to reach Hollow Purple.',
  bestWith:'Area weapons that benefit from clumped enemies.'}),
 starcrusher:entry('B',{
  reason:'Garuda: Star Crusher adds three ricochet targets and knockback shockwaves to Garuda.',
  comparison:'A big step up from Garuda and above median on Yuki, but still behind the A fusions.',
  caution:'Garuda must return between strikes, which caps its damage on big crowds.',
  bestWith:'Yuki, where Maximum Mass widens the impacts.'}),
 berserkeredge:entry('B',{
  reason:'Dragonslayer: Astral Edge swings a broader, stronger bleeding cleave with more reach and knockback.',
  comparison:'Around median damage at close range, a clear upgrade over Dragonslayer.',
  caution:'It only hits what is next to you; kiting loses most of its damage.',
  bestWith:'Guts, whose Struggle meter empowers the cleave.'}),
 powerbeam:entry('B',{
  reason:'Power Beam fires fast arm-cannon bolts, with charged volleys on Samus.',
  comparison:'Around median on a neutral hero, but above median on Samus, whose Charge Cycle volleys are hero-specific.',
  caution:'Charge Cycle and its beam evolutions are hero-specific to Samus; others get plain bolts.',
  bestWith:'Samus, then Energy Tank for Plasma Beam.'}),
 positron:entry('B',{
  reason:'Spear of Longinus throws a crimson spear that pierces and curses, then returns for a second strike.',
  comparison:'Around median damage; on Shinji it rises above median.',
  caution:'One spear at a time covers little of a big crowd.',
  bestWith:'Shinji, alongside an area weapon.'}),
 requip:entry('B',{
  reason:'Requip Sword changes its attack with Erza’s armor; other wielders throw Heaven’s Wheel swords.',
  comparison:'Around median damage as ranged swords; Erza’s armor forms trade that for cleaves, bleeds or stuns.',
  caution:'The armor-switching patterns are exclusive to Erza; other wielders receive the ranged pattern.',
  bestWith:'Erza, then Heart Kreuz Emblem for Heaven’s Arsenal.'}),
 raijinrasengan:entry('B',{
  reason:'Flying Raijin: Rasengan carries chakra bursts between nearby enemies on marked kunai.',
  comparison:'About median damage, and it frees a weapon slot.',
  caution:'It needs Rasengan and Flying Kunai maxed; only these two weapons are required.',
  bestWith:'A build that already has both weapons maxed.'}),
 kunai:entry('B',{
  reason:'Flying Kunai throws a fast fan of knives that inflict bleeding.',
  comparison:'About median damage, but it feeds three fusions, including the S-tier Flying Thunder God.',
  caution:'Its fan is short-ranged and spreads thin over large crowds.',
  bestWith:'Sage Scroll for Flying Thunder God.'}),
 icelance:entry('B',{
  reason:'Ice Lance fires piercing spears that briefly freeze enemies.',
  comparison:'About median damage with freezes, and the root of the S-tier Ice Cavalry.',
  caution:'Bosses resist repeated immobilization.',
  bestWith:'Demon’s Extract for Ice Cavalry.'}),
 totality:entry('B',{
  reason:'Ten Shadows: Totality empowers the Divine Dogs with stronger bleeding bites.',
  comparison:'Better than the base dogs, but the three-ingredient Chimera Shadow Garden is far stronger.',
  caution:'The dogs chase targets on their own, so their damage is spread out.',
  bestWith:'Megumi, as a step toward the Chimera Shadow Garden.'}),
 chainsaw:entry('B',{
  reason:'Pochita’s Chainsaw carves a nearby arc and inflicts bleeding.',
  comparison:'Close up it reaches near-median damage; at range it does almost nothing.',
  caution:'It only hits what is next to you, and the Rev empowerment applies only to Denji.',
  bestWith:'Denji, whose Rev empowers sweeps, then Blood Engine for Chainsaw Overdrive.'}),
 kamehameha:entry('B',{
  reason:'Super Kamehameha fires a massive piercing beam.',
  comparison:'It measured only slightly above Ki Wave, so its recipe adds less than most fusions.',
  caution:'The beam fires in one direction, so crowds on other sides are untouched.',
  bestWith:'Goku, with an area weapon to cover the flanks.'}),
 wisteriagarden:entry('B',{
  reason:'Wisteria Garden blossoms poison petals into a lingering field that slows enemies.',
  comparison:'About median damage with a slow, a modest upgrade over its ingredients.',
  caution:'It needs Wisteria Petals and Poison Vial maxed; only these two weapons are required.',
  bestWith:'Kite enemies through the field.'}),
 chainsawoverdrive:entry('B',{
  reason:'Chainsaw Overdrive sweeps dual blades through a broader, longer arc with a stronger bleed.',
  comparison:'Close up it matches the base chainsaw’s near-median damage with more reach.',
  caution:'It only hits what is next to you.',
  bestWith:'Denji, fighting inside packs.'}),
 wisteriapetals:entry('B',{
  reason:'Wisteria Petals casts a fan of piercing petals that poison on contact.',
  comparison:'Slightly below median, but useful as the base of Wisteria Garden.',
  caution:'Its fan is narrow at range.',
  bestWith:'Poison Vial for Wisteria Garden.'}),
 dragonroar:entry('B',{
  reason:'Lightning Flame Dragon Roar combines burning fire and lightning in a broad roar that stuns.',
  comparison:'A big upgrade over Dragon Flame, but still below median damage.',
  caution:'It needs Dragon Flame and Storm Seal maxed; Storm Seal alone is close in damage.',
  bestWith:'Builds that already carry both weapons.'}),
 titanfists:entry('B',{
  reason:'Titan Fists throw crushing punches that stun and knock enemies back.',
  comparison:'Below median alone, but the base of Titan Quake.',
  caution:'Only Eren in Titan form can use it.',
  bestWith:'Key of Freedom for Titan Quake.'}),
 lightning:entry('B',{
  reason:'Storm Seal jumps lightning between nearby enemies and briefly stuns them.',
  comparison:'Below median alone, but it fuses into the S-tier Heavenly Tempest.',
  caution:'Its chain is short until fused.',
  bestWith:'Power Band for Heavenly Tempest.'}),
 ki:entry('B',{
  reason:'Ki Wave launches a piercing energy wave that burns and pushes enemies back.',
  comparison:'Below median damage, and its fusion adds little.',
  caution:'It fires in one direction at a time.',
  bestWith:'Goku, with area weapons for coverage.'}),
 pallet:entry('B',{
  reason:'Pallet Rifle fires a precise three-round burst that gains piercing with ranks.',
  comparison:'Below median, but the base of the Spear of Longinus.',
  caution:'A narrow burst clears crowds slowly.',
  bestWith:'AT Field for the Spear of Longinus.'}),
 galaxy:entry('B',{
  reason:'Soul Galaxy circles six powerful stars around you.',
  comparison:'Close up it is a solid upgrade over Spirit Orbs, but below median.',
  caution:'It only hits what comes within orbit.',
  bestWith:'Close-range builds that keep enemies near.'}),
 garuda:entry('B',{
  reason:'Garuda ricochets through five to nine nearby enemies, then returns before striking again.',
  comparison:'Below median alone, but Star Crusher raises it by almost half.',
  caution:'Garuda must return before attacking again.',
  bestWith:'Virtual Mass for Star Crusher.'}),
 dragonslayer:entry('B',{
  reason:'Dragonslayer swings a massive slab through a nearby cone, bleeding and knocking back.',
  comparison:'Below median, but Guts’s Struggle and Astral Edge raise it.',
  caution:'It only hits what is next to you, and the Struggle empowerment is exclusive to Guts.',
  bestWith:'Guts, then Brand of Sacrifice for Astral Edge.'}),
 stormnue:entry('B',{
  reason:'Nue: Thunderstorm chains lightning between four nearby enemies and stuns them.',
  comparison:'Better than Nue but still below median; the Chimera Shadow Garden is the real goal.',
  caution:'Nue stays near you, so its reach is limited.',
  bestWith:'Megumi, toward the Chimera Shadow Garden.'}),
 poison:entry('B',{
  reason:'Poison Vial breaks into a poison circle that lingers and keeps poisoning enemies after they leave.',
  comparison:'Below median alone, but it fuses into the S-tier Jade Alchemy.',
  caution:'Poison takes time; fast enemies leave the circle early.',
  bestWith:'Medicinal Herbs for Jade Alchemy.'}),
 zoltraak:entry('C',{
  reason:'Zoltraak fires a precise long-range ray that pierces enemies.',
  comparison:'Weak alone, but Ancient Magic more than doubles it into an S-tier weapon.',
  caution:'A single straight ray misses most of a crowd.',
  bestWith:'Ancient Grimoire for Ancient Magic.'}),
 shadows:entry('C',{
  reason:'Divine Dogs send two dogs to pursue and bite enemies.',
  comparison:'Weak alone, but they lead to Totality and the S-tier Chimera Shadow Garden.',
  caution:'The dogs spread their damage across separate targets.',
  bestWith:'Megumi, toward the Chimera Shadow Garden.'}),
 crimson:entry('C',{
  reason:'King Crimson punches a nearby cone, stunning and knocking enemies back.',
  comparison:'Weak alone even up close, but Fatal Forecast more than doubles it.',
  caution:'It only hits what is next to you.',
  bestWith:'Diavolo, then Epitaph for Fatal Forecast.'}),
 red:entry('C',{
  reason:'Reversal Red fires a repulsive blast that explodes, knocks enemies away and curses them.',
  comparison:'Weak alone; it exists to complete Hollow Purple.',
  caution:'Its knockback scatters crowds away from other weapons.',
  bestWith:'Gojo, toward Hollow Purple.'}),
 rasengan:entry('C',{
  reason:'Rasengan releases a compact chakra sphere into a nearby forward arc that pushes enemies back.',
  comparison:'Weak alone; it exists to fuse into Flying Raijin: Rasengan.',
  caution:'Its short arc covers little of a crowd.',
  bestWith:'Flying Kunai for Flying Raijin: Rasengan.'}),
 orbit:entry('C',{
  reason:'Spirit Orbs circle you and hit enemies that come close.',
  comparison:'Among the weakest weapons; its main value is fusing into Soul Galaxy.',
  caution:'It only hits what comes within orbit.',
  bestWith:'Soul Magnet for Soul Galaxy.'}),
 odmblades:entry('C',{
  reason:'ODM Blades sweep twin blades through nearby enemies, inflicting bleeding.',
  comparison:'Weak alone; Thunder Spears or a Titan Shift are both large upgrades.',
  caution:'Eren equips it only in human form, and it only hits what is next to him.',
  bestWith:'Key of Freedom for Thunder Spears.'}),
 dragonflame:entry('C',{
  reason:'Dragon Flame breathes a short cone of fire that burns approaching enemies.',
  comparison:'Among the weakest weapons; Lightning Flame Dragon Roar nearly doubles it.',
  caution:'Its cone is short, so enemies must walk into it.',
  bestWith:'Storm Seal for Lightning Flame Dragon Roar.'}),
 nue:entry('C',{
  reason:'Nue summons a winged shikigami that strikes nearby enemies with stunning lightning.',
  comparison:'The weakest weapon measured alone; it exists for Megumi’s fusions.',
  caution:'Nue stays near you and strikes one target at a time.',
  bestWith:'Megumi, toward the Chimera Shadow Garden.'}),
};

// Passives are ranked by what one of five support slots buys, measured with the game's
// own stat formulas (tools/balance/passive-stats.mjs): weapon offense, effective HP,
// ultimate uptime and movement. Composite fusions are judged per slot they occupy.
export const PASSIVE_RANKINGS={
 adaptivebarrier:entry('S',{
  reason:'Energy Tank and AT Field fuse into one slot with more shield and a seven-second recharge: the largest defensive gain of any passive.',
  comparison:'It roughly triples effective HP from a single slot while freeing the other, so no other defensive passive comes close per slot.',
  caution:'Requires both max-rank ingredients, and shields only recover while you survive the seven-second recharge.',
  bestWith:'Pair it with damage passives in the freed slot; its shield absorbs chip damage so regen and healing go further.'}),
 soulbond:entry('A',{
  reason:'Bonds maxed Soul Gems into one slot as you collect them, keeping each gem’s full bonus and freeing a slot with every gem added.',
  comparison:'Weaker than the finished Quintet, but it pays off long before all five gems are maxed, so the slots work for you the whole way.',
  caution:'Only gems at max rank can join, and the bond does nothing on its own until two gems are bonded.',
  bestWith:'Bond the first two maxed gems, keep adding the rest; the fifth gem turns it into Soul Gems of the Quintet.'}),
 quintet:entry('S',{
  reason:'All five Soul Gems become one slot that keeps every bonus: shield, damage, regeneration, area, cooldown and dodge.',
  comparison:'It is the strongest all-round passive in the game per slot and wins outright by freeing four support slots for other items.',
  caution:'Needs all five max-rank Soul Gems first, which is a long investment during which those five slots do less individually.',
  bestWith:'Collect the five gems in any order and fuse them before or after Ultimate Madoka; with Madoka it then unlocks Salvation.'}),
 panaceapouch:entry('S',{
  reason:'Senzu Bean and Medicinal Herbs fuse into one slot with even more regeneration and food healing.',
  comparison:'Its regeneration out-heals most chip damage on its own, and it frees a slot, so sustain builds rarely beat it.',
  caution:'Requires both max-rank ingredients; regeneration cannot save you from a burst that kills in one or two hits.',
  bestWith:'Use the freed slot for Power Band or Six Eyes and let the pouch keep you topped up between waves.'}),
 sageregalia:entry('S',{
  reason:'The five sage items become one slot that keeps speed, dodge, area, recovery, cooldown, damage and resistance.',
  comparison:'Every stat category improves at once, and it frees four support slots, which no single passive can match.',
  caution:'Five maxed items is the longest recipe chain among composites; the individual pieces are weak until the set is done.',
  bestWith:'Finish all five maxed ingredients, then evolve Rasenshuriken or Flying Thunder God; the absorbed Headband and Scroll still count.'}),
 senzu:entry('S',{
  reason:'Senzu Bean adds 4.5 HP per second and 45 maximum HP, the largest sustain from any single base passive.',
  comparison:'It doubles effective HP over a short fight with no setup, and it is half of the S-tier Panacea Pouch.',
  caution:'It adds no offense, and regeneration is weakest against sudden bursts or boss combos.',
  bestWith:'Take it early on any hero without a shield, and fuse it into Panacea Pouch if Herbs shows up.'}),
 purifiedsoul:entry('S',{
  reason:'Pink Soul Gem and Grief Seed fuse into one slot with damage, shield, cooldown, pickup range and an eight-second recharge.',
  comparison:'It adds both offense and defence while freeing a slot, a rare combination among two-item fusions.',
  caution:'Requires both max-rank ingredients; its shield recharge is slower than Adaptive Barrier’s.',
  bestWith:'Fuse it on Madoka before building toward the Quintet; the Pink Soul Gem evolution stays available.'}),
 chozosuit:entry('S',{
  reason:'Four Chozo components become one slot with HP, resistance, movement, dodge and pickup range.',
  comparison:'It nearly doubles effective HP and frees three support slots, making it the best defensive composite per slot.',
  caution:'It adds no offense, and its pieces are individually weak while you are still assembling the set.',
  bestWith:'Collect all four maxed ingredients; an already Adaptive Barrier Energy Tank keeps its shield, and Plasma Beam stays available.'}),
 sagecodex:entry('S',{
  reason:'Ancient Grimoire and Mana Crystal fuse into one slot with damage, area and 6% more cooldown reduction.',
  comparison:'It is the strongest offense-per-slot passive, ahead of Power Band, while freeing a slot.',
  caution:'Requires both max-rank ingredients and adds no defence.',
  bestWith:'Pair it with a sustain passive in the freed slot; Ancient Magic remains available for Frieren.'}),
 witcharchive:entry('S',{
  reason:'Four witch items become one slot with damage, area, cooldown, pickup range and Featherine’s Authority gain.',
  comparison:'It is the best offense composite and frees three support slots for defensive items.',
  caution:'It adds no defence, and its pieces are weak individually until all four are maxed.',
  bestWith:'Collect all four maxed ingredients; Featherine keeps the Authority gain and the retained Memory Fragment still unlocks Final Chapter.'}),
 eyes:entry('A',{
  reason:'Six Eyes cuts weapon and ultimate cooldowns by 24%, about a third more attacks and a much more frequent ultimate.',
  comparison:'Its weapon offense nearly matches Power Band and it is the strongest ultimate-uptime passive in the game.',
  caution:'It adds no defence, and weapons with long fixed animations gain less from cooldown reduction.',
  bestWith:'Take it on heroes with strong control ultimates, and fuse it into Hollow Purple on Gojo.'}),
 soulgem:entry('A',{
  reason:'Pink Soul Gem adds 18% damage and a recharging 30-point shield, so it improves both offense and defence.',
  comparison:'It is the best hybrid base passive and an ingredient for two S-tier fusions.',
  caution:'The shield only refills every ten seconds, so constant pressure strips it quickly.',
  bestWith:'Fuse it with Grief Seed or the other Soul Gems, and evolve Ultimate Madoka with it.'}),
 atfield:entry('A',{
  reason:'AT Field adds a 33-point shield that recharges every nine seconds and 12% damage resistance.',
  comparison:'Its effective HP gain is among the highest of base passives, and it fuses into the best passive in the game.',
  caution:'It adds no offense, and its shield needs nine quiet seconds to come back.',
  bestWith:'Fuse it with Energy Tank for Adaptive Barrier, and evolve the Spear of Longinus on Shinji.'}),
 energytank:entry('A',{
  reason:'Energy Tank adds 54 maximum HP and about 10% damage resistance.',
  comparison:'A straightforward defensive slot close to AT Field, and the root of both Adaptive Barrier and the Chozo Power Suit.',
  caution:'It adds no offense or recovery by itself.',
  bestWith:'Combine with AT Field or the Chozo components, and evolve Plasma Beam on Samus.'}),
 power:entry('A',{
  reason:'Power Band adds 36% damage to every weapon with no conditions.',
  comparison:'It is the strongest pure-damage base passive and works on every weapon, but it offers nothing else.',
  caution:'No defence or utility, so survival has to come from your other slots.',
  bestWith:'Any build; fuse it with Storm Seal for Heavenly Tempest.'}),
 masscore:entry('A',{
  reason:'Virtual Mass adds 18% damage and 30 maximum HP, and Yuki gains 30% more Star Rage.',
  comparison:'A balanced hybrid that rises further on Yuki, where faster Maximum Mass adds both damage and resistance.',
  caution:'Outside Yuki it is a modest stat stick, weaker than Power Band for pure damage.',
  bestWith:'Yuki first; evolve Garuda: Star Crusher with it.'}),
 timepiece:entry('A',{
  reason:'Time Reserve cuts weapon and ultimate cooldowns by 18% and lengthens clock-bullet slows.',
  comparison:'It is second only to Six Eyes for ultimate uptime, and on Kurumi the longer slows add real control.',
  caution:'It adds no defence, and the slow bonus only matters with clock bullets.',
  bestWith:'Kurumi, where it also evolves Zafkiel: Seventh Bullet.'}),
 grimoire:entry('A',{
  reason:'Ancient Grimoire adds 24% area and 15% damage.',
  comparison:'A strong offense slot that also fuses into Sage’s Codex, the best offense-per-slot passive.',
  caution:'It adds no defence, and narrow single-target weapons gain little from the area.',
  bestWith:'Fuse it with Mana Crystal, and evolve Ancient Magic on Frieren.'}),
 heartkreuz:entry('A',{
  reason:'Heart Kreuz Emblem adds 12% damage and a 21-point rechargeable shield.',
  comparison:'A smaller Pink Soul Gem: modest on both sides, but it is the key to Heaven’s Arsenal.',
  caution:'Both its bonuses are small next to dedicated damage or defence passives.',
  bestWith:'Erza, where it evolves Requip: Heaven’s Arsenal across every armor form.'}),
 bloodengine:entry('A',{
  reason:'Blood Engine adds 30 maximum HP and 12% damage, and Denji gains 30% more Rev.',
  comparison:'A balanced hybrid like Virtual Mass that rises on Denji, where Rev drives his empowered sweeps.',
  caution:'Outside Denji it is a modest stat stick.',
  bestWith:'Denji, where it also evolves Chainsaw Overdrive.'}),
 epitaph:entry('A',{
  reason:'Epitaph adds 18% damage and 12% dodge, and Diavolo gains 30% more Fate.',
  comparison:'Damage plus dodge is a useful mix for any hero, and on Diavolo faster Fate means more negated hits and counters.',
  caution:'Dodge is random, so it cannot be relied on against a specific dangerous hit.',
  bestWith:'Diavolo, where it also evolves King Crimson: Fatal Forecast.'}),
 brand:entry('B',{
  reason:'Brand of Sacrifice adds 36 maximum HP and 9% damage resistance.',
  comparison:'Solid defence, but behind Energy Tank and AT Field, and it adds no offense.',
  caution:'No offense or recovery; its main extra value is enabling Guts’s evolution.',
  bestWith:'Guts, where it evolves Dragonslayer: Astral Edge.'}),
 memoryfragment:entry('B',{
  reason:'Memory Fragment adds 15% damage and 15% area, and Featherine gains 30% more Authority.',
  comparison:'A decent offense slot that rises on Featherine and anchors the S-tier Witch’s Archive.',
  caution:'On other heroes it is a smaller Ancient Grimoire.',
  bestWith:'Featherine; evolve Final Chapter with it or fold it into the Witch’s Archive.'}),
 freedom:entry('B',{
  reason:'Key of Freedom adds 30 maximum HP and 0.9 HP per second.',
  comparison:'Reasonable sustain, but well behind Senzu Bean, and it adds no offense.',
  caution:'No offense; its main extra value is enabling both of Eren’s evolutions.',
  bestWith:'Eren, where it evolves Thunder Spears or Titan Quake.'}),
 demonextract:entry('B',{
  reason:'Demon’s Extract adds 18% area, 12% damage and 75% freeze resistance.',
  comparison:'A respectable offense slot whose freeze resistance matters on cold maps and against ice enemies.',
  caution:'Outside freezing threats it is a weaker Ancient Grimoire.',
  bestWith:'Esdeath, where it evolves Ice Cavalry.'}),
 scroll:entry('B',{
  reason:'Sage Scroll adds 45% weapon area, the largest area bonus in the game.',
  comparison:'Area is worth a lot on blasts, fields and cleaves but little on single-target bolts, so its value swings by weapon.',
  caution:'It adds no damage or defence; narrow projectiles gain almost nothing.',
  bestWith:'Area weapons such as poison, Blue or cleaves; it also evolves Flying Thunder God and Rasen Flash.'}),
 headband:entry('B',{
  reason:'Leaf Headband adds 30% movement speed and 15% dodge.',
  comparison:'Speed makes kiting and pickups much easier, but it adds no damage and less protection than a real defensive passive.',
  caution:'Dodge is random and speed only helps if you use it to avoid hits.',
  bestWith:'Naruto, whose chakra builds from movement, and Rasenshuriken.'}),
 herbs:entry('B',{
  reason:'Medicinal Herbs adds 1.8 HP per second and 45% more food healing.',
  comparison:'Decent sustain alone, and half of the S-tier Panacea Pouch.',
  caution:'It adds no offense, and regeneration does little against burst damage.',
  bestWith:'Fuse it with Senzu Bean, and evolve Jade Alchemy on Maomao.'}),
 purplegem:entry('B',{
  reason:'Purple Soul Gem cuts cooldowns by 9% and adds 4.5% dodge.',
  comparison:'Small but useful on both offense and ultimate uptime; its main value is as a Quintet piece.',
  caution:'Its individual bonuses are small.',
  bestWith:'Collect it toward Soul Gems of the Quintet.'}),
 greatsage:entry('B',{
  reason:'Great Sage adds 15% damage and 18% pickup range, and Rimuru gains 30% more Predation essence.',
  comparison:'On Rimuru faster essence means earlier permanent adaptations; on others it is a small damage passive.',
  caution:'Its essence bonus is exclusive to Rimuru; other heroes receive only the general bonuses.',
  bestWith:'Rimuru, where it evolves Beelzebub: Soul Devourer.'}),
 manacrystal:entry('B',{
  reason:'Mana Crystal adds 12% area and 9% damage.',
  comparison:'Modest alone; its value is fusing into Sage’s Codex.',
  caution:'Weak as a stand-alone slot.',
  bestWith:'Fuse it with Ancient Grimoire.'}),
 talisman:entry('B',{
  reason:'Shadow Talisman adds 15% damage and 36% summon duration.',
  comparison:'Summon duration matters a lot for Megumi and little for others.',
  caution:'Outside summon builds it is a small damage passive.',
  bestWith:'Megumi, where it evolves Totality, Nue: Thunderstorm and the Chimera Shadow Garden.'}),
 sagecloak:entry('B',{
  reason:'Sage Cloak adds 9% damage and 6% damage resistance.',
  comparison:'A small hybrid whose real value is as a Sage’s Regalia piece.',
  caution:'Weak alone; plan to complete the regalia.',
  bestWith:'Collect it toward Sage’s Regalia.'}),
 truthseal:entry('B',{
  reason:'Red Truth Seal adds 12% weapon damage and nothing else.',
  comparison:'A third of Power Band’s damage, worth it mainly as a Witch’s Archive piece.',
  caution:'Weak alone; plan to complete the archive.',
  bestWith:'Collect it toward the Witch’s Archive.'}),
 redgem:entry('B',{
  reason:'Red Soul Gem adds 12% weapon damage and nothing else.',
  comparison:'A third of Power Band’s damage, worth it mainly as a Quintet piece.',
  caution:'Weak alone; plan to complete the Quintet.',
  bestWith:'Collect it toward Soul Gems of the Quintet.'}),
 variasuit:entry('C',{
  reason:'Varia Suit Module adds 15 maximum HP and 6% damage resistance.',
  comparison:'Small defence on its own; it exists to complete the Chozo Power Suit.',
  caution:'Weak alone; only take it if you plan to finish the suit.',
  bestWith:'Collect it toward the Chozo Power Suit.'}),
 witchring:entry('C',{
  reason:'Witch’s Ring cuts cooldowns by 6% and adds 9% area.',
  comparison:'Small bonuses; it exists to complete the Witch’s Archive.',
  caution:'Weak alone; only take it if you plan to finish the archive.',
  bestWith:'Collect it toward the Witch’s Archive.'}),
 griefseed:entry('C',{
  reason:'Grief Seed cuts cooldowns by 9% and adds 15% pickup range.',
  comparison:'Small alone, but it fuses with Pink Soul Gem into the S-tier Purified Soul Gem.',
  caution:'Weak as a stand-alone slot.',
  bestWith:'Fuse it with Pink Soul Gem.'}),
 bluegem:entry('C',{
  reason:'Blue Soul Gem adds about 1 HP per second.',
  comparison:'Minor sustain; it exists to complete the Quintet.',
  caution:'Weak alone; plan to complete the Quintet.',
  bestWith:'Collect it toward Soul Gems of the Quintet.'}),
 yellowgem:entry('C',{
  reason:'Yellow Soul Gem adds 15% weapon area.',
  comparison:'A third of Sage Scroll’s area; it exists to complete the Quintet.',
  caution:'Weak alone; plan to complete the Quintet.',
  bestWith:'Collect it toward Soul Gems of the Quintet.'}),
 sagebeads:entry('C',{
  reason:'Sage Beads cut cooldowns by 6% and add 9% pickup range.',
  comparison:'Small bonuses; it exists to complete Sage’s Regalia.',
  caution:'Weak alone; only take it if you plan to finish the regalia.',
  bestWith:'Collect it toward Sage’s Regalia.'}),
 toadoil:entry('C',{
  reason:'Toad Oil Gourd adds 0.6 HP per second and 15% more food healing.',
  comparison:'A third of Medicinal Herbs’ regeneration; it exists to complete Sage’s Regalia.',
  caution:'Weak alone; only take it if you plan to finish the regalia.',
  bestWith:'Collect it toward Sage’s Regalia.'}),
 magnet:entry('C',{
  reason:'Soul Magnet more than doubles XP pickup range.',
  comparison:'Faster pickups speed up levelling slightly, but the slot adds no damage or protection.',
  caution:'Most gems are easy to collect anyway, so the slot is usually better spent elsewhere.',
  bestWith:'Fuse it with Spirit Orbs for Soul Galaxy.'}),
 morphball:entry('C',{
  reason:'Morph Ball Module adds 9% movement and 3% dodge.',
  comparison:'Small bonuses; it exists to complete the Chozo Power Suit.',
  caution:'Weak alone; only take it if you plan to finish the suit.',
  bestWith:'Collect it toward the Chozo Power Suit.'}),
 gravitysuit:entry('C',{
  reason:'Gravity Suit Module adds 15% pickup range and 30% freeze resistance.',
  comparison:'Almost no combat value alone; it exists to complete the Chozo Power Suit.',
  caution:'Only take it if you plan to finish the suit.',
  bestWith:'Collect it toward the Chozo Power Suit.'}),
 goldenbutterfly:entry('C',{
  reason:'Golden Butterfly adds 15% XP pickup range.',
  comparison:'Almost no combat value alone; it exists to complete the Witch’s Archive.',
  caution:'Only take it if you plan to finish the archive.',
  bestWith:'Collect it toward the Witch’s Archive.'}),
};
