# Anime Survivors — Pixel Rift

An unofficial browser survival fan game inspired by Vampire Survivors and HoloCure. Nineteen playable heroes, original HoloCure-inspired pixel-art heroes, enemies and scenery, seventeen procedural maps, recurring anime bosses, item upgrades, fusions, randomized treasure chests and persistent skill trees. Assets and fonts are bundled locally.

## Play

Download `dist/index.html` and open it in a modern browser. The single-file build runs offline. Coins, mastery XP, skill purchases, skins, pets, last hero/map choices and best kills save locally in your browser. An unfinished run also checkpoints every five active seconds and when pausing or leaving; choose **Continue saved run** to resume paused. Starting a new run replaces the previous checkpoint. Open **Save & Backup** in the lobby or pause menu to export/import your entire profile and unfinished run. The Skill Trees export/import controls use the same complete backup; older profile-only files remain supported. Updates opened at the same browser address retain local saves automatically. If an update uses a different address, file location or browser, export first and import the backup there. If browser storage is unavailable, progress remains available for the current session and can still be exported.

For development, use Node.js 20.19+ or 22.12+:

```sh
npm ci
npm run dev
```

`npm run build` creates the standalone HTML file. `npm run preview` serves it. `npm test` runs combat, progression, boss, shield and reward tests. No backend or credentials are required.

## Controls

- WASD / arrows or a one-finger drag: move. Attacks are automatic.
- Two-finger pinch, mouse wheel or +/− keys: zoom from 60% to 165%. The on-screen zoom buttons have been removed. Two canvas fingers pause drag movement while pinching; the remaining finger can resume movement after one finger lifts.
- Space / special button: use a special ability. Base cooldown is 60 seconds.
- Shift / L / Dash button: dash for 0.22 seconds with invincibility frames. Dash cooldown is 10 active seconds. Walls, props and water still block the dash.
- Keep one finger dragging to move while pressing Dash and Special with other fingers. Buttons activate on press. Two canvas fingers pinch to zoom; three canvas fingers can move and zoom simultaneously. After a pinch ends, the remaining movement finger resumes without requiring every finger to lift.
- Escape / P / pause button: pause. Switching tabs also pauses.
- Tap an inventory icon to inspect its item and fusion recipe.

## Heroes and fusions

Every hero starts with a signature weapon and passive at level 1; a character mastery capstone can raise the starting weapon to level 2. Every item is available in the shared upgrade pool. Carry up to **5 weapons and 5 passives**. Max a weapon to **5** and its matching passive to **3**, then take its guaranteed fusion choice at the next level-up or receive it from a chest. **Hollow Purple requires Blue LV 5 + Red LV 5 + Six Eyes LV 3**: Red is consumed, Purple replaces Blue, and one active slot becomes available. Other fusions keep their passive equipped.

| Hero | Weapon | Passive | Fusion | Special |
| --- | --- | --- | --- | --- |
| Featherine Augustus Aurora | Author’s Quill: homing, piercing cursed ink | Memory Fragment: weapon damage, area and Authority gain | Final Chapter: Red Truth | The Last Page: author’s stage, written verses and crimson final sentence |
| Rimuru Tempest | Black Flame: homing, burning impact explosions | Great Sage: damage, pickup range and essence | Beelzebub: Soul Devourer | Gluttony: slime form, pull, devouring weak foes and hostile shots |
| Diavolo | King Crimson: close-range Stand punches | Epitaph: damage, dodge and Fate gain | King Crimson: Fatal Forecast, a delayed echo strike | Time Erasure: safe repositioning followed by a finishing barrage |
| Yuki Tsukumo | Garuda: weighted piercing shikigami, charging Star Rage | Virtual Mass: damage, health and Star Rage gain | Garuda: Star Crusher | Maximum: Black Hole, a two-second charge followed by five seconds of gravitational collapse |
| Eren Yeager | Human: ODM Blades / Titan: Titan Fists, sharing one active slot | Key of Freedom: health and regeneration | Thunder Spears / Titan Quake | Titan Shift: permanent human ↔ Titan toggle |
| Megumi Fushiguro | Divine Dogs + Nue: two independent nearby summon weapons | Shadow Talisman: summon duration and damage | Ten Shadows: Totality | Eight-Handled Sword: Mahoraga and its adapting wheel |
| Frieren | Zoltraak: precise piercing ray | Ancient Grimoire: magic area and damage | Ancient Magic: three cursed rays | Ancient Stone Golem: a leashed stone guardian with heavy punches and a violet mouth beam |
| Samus Aran | Power Beam: charging cannon bolts | Energy Tank: max HP and damage resistance | Plasma Beam: piercing, burning impact explosions | Power Bomb: Morph Ball charge, area blast and projectile clearing |
| Goku | Ki Wave: charged traveling energy waves | Senzu Bean: regeneration and max HP | Super Kamehameha | Spirit Bomb: charged throw and knockback |
| Gojo | Cursed Blue + Reversal Red: attraction and explosive repulsion | Six Eyes: shorter cooldowns | Hollow Purple: two maxed active weapons + Six Eyes | Unlimited Void: fixed domain and collapse |
| Naruto | Wind Shuriken: piercing blades | Leaf Headband: speed and dodge | Rasenshuriken | Shadow Clone Rush: six attacking decoys |
| Shinji / EVA-01 | Pallet Rifle: staggered three-round burst | AT Field: rechargeable shield and damage resistance | Spear of Longinus | Berserk Awakening: claws, deflection and a finishing AT burst |
| Kurumi Tokisaki | Zafkiel Flintlock: piercing clock bullets with curse and slow | Time Reserve: shorter cooldowns and longer clock marks | Zafkiel: Seventh Bullet | City of Devouring Time: slow domain and three shooting shadow doubles |
| Esdeath | Ice Lance: piercing freezing spears | Demon’s Extract: area, damage and freeze resistance | Ice Cavalry | Mahapadma: fixed time-stop domain and shattering ice burst |
| Maomao | Poison Vial: arcing flask and lingering poison circles | Medicinal Herbs: regeneration and stronger food healing | Jade Alchemy | Panacea Garden: healing, poison blooms and damage resistance |
| Madoka Kaname | Rosewood Bow: homing arrows with impact blooms | Pink Soul Gem: 10 shield per rank, recharged every 10 seconds, plus 6% damage per rank | Ultimate Madoka | Law of Cycles: winged arrow rain, purification and support |

Additional fusions: Flying Kunai + Sage Scroll → Flying Thunder God; Storm Seal + Power Band → Heavenly Tempest; Spirit Orbs + Soul Magnet → Soul Galaxy.

The Arsenal lists all 41 items and twenty-five recipes. All sixteen heroes have entirely new, original pixel-art designs inspired by the supplied HoloCure references: compact chibi bodies, larger expressive heads, dark stepped outlines, limited color palettes and detailed outfits. Menu portraits and combat use the same sprite source. Goku has sculpted black spikes and an orange gi; Gojo has shaded white spikes, a blindfold and high-collar uniform; Naruto has a blond fringe, metal headband and ninja gear; Madoka has short pink twin tails, red ribbons, a cream corset and scalloped pink-and-white skirt. Maomao has a high dark teal bun, straight bangs, violet eyes, clear cheeks, bead-tied braids, a crossed green blouse with lined bell sleeves, a long burgundy skirt and teal slippers, based on the supplied reference. Her throwing pose visibly holds a medicine vial. Walking and ultimate poses have separate sprite frames.

Madoka's bow now curves toward the firing direction, with its string and nock toward the archer. It aims independently of her walking direction and her arrows originate at its muzzle. This also works when aiming up, down or behind her.

## Waves, enemies and bosses

Runs are endless. Each wave has a finite enemy budget. Clearing every enemy and boss advances after a two-second break; otherwise the next wave starts after **60 seconds of combat**, carrying surviving enemies forward. The HUD shows the next-wave countdown. Menus, boss entrances, world events and rift fights pause this timer; elapsed wave time saves with the run. Bosses are due on waves **5, 10, 15, …**; if a previous boss is still alive, later boss arrivals queue until that fight ends. Ordinary spawns pause at 210 living enemies while the wave timer keeps advancing. Enemy health, damage, movement and attack pace strengthen every elapsed minute, independently of wave progress. Boss defeat animations finish before rewards appear. Most bosses enter a second phase below 50% health; Cell retains three stages.

| Map | Enemy family | First boss | Boss behavior |
| --- | --- | --- | --- |
| Sakura Sanctuary | Shinobi, serpents, Saibamen, demon soldiers, spider demons and later Hanami | Aura the Guillotine | Timed Soul Balance circles, Guillotine lines and bound soldiers |
| Sunken Citadel | Saibamen, troopers, crawlers, devil zombies, angel fragments and later Jogo | Frieza | Warned death beams and radial death-ball volleys |
| Moonlit Crossing | Crawlers, eyes, shinobi, Fly Heads, transfigured humans and later Jogo, Hanami and Dagon | Mahito | Summons, transformation lines and Self-Embodiment domain marks |
| Witch’s Labyrinth | Anthony Familiars, Witch’s Butterflies, Gertrud’s Rosebuds | Walpurgisnacht | Rotating gear volleys, delayed falling hazards and familiar summons |

Later boss waves rotate among all twenty-two bosses. Ordinary enemies have distinct behavior: rushes, ranged fire, radial shots, venom trails, note volleys, thorn fans and fluttering movement. Colored ground warnings show where dangerous attacks will land; move before they activate.

Each defeated boss **always drops one treasure chest**. Elites also drop chests. Collect it to roll **1 (65%), 3 (25%), or 5 (10%) rewards**. Each reward is offered individually: take it, ignore it, or ignore all remaining rewards. Nothing is equipped until accepted. Every available evolution is guaranteed priority. After each decision, unopened slots check the equipment actually accepted so far; acquiring a final ingredient can unlock an evolution in the next slot. Full inventories respect slot and rank caps; when no upgrades remain, a reward restores 50 HP. Ready fusions use one reward slot. Repeated items in a multi-reward chest can gain multiple ranks.

Trees, rocks and gate pillars now have solid footprints shared with the rendering system. Gate openings stay traversable. Ground units cannot cross rivers outside bridges; flying enemies can fly over water. Crates slide when pushed and slow with friction. Enemies steer around obstacles, separate from each other, and react to ultimate knockback. Friendly and hostile projectiles interact with scenery; piercing ki beams and area attacks can smash nearby supplies. Tree canopies fade when they obscure the player. Witch’s Labyrinth includes checkerboard paper floors, giant roses, clock lamps and curtain archways. All four maps now use native pixel tiles and stepped scenery: cherry groves, weathered stone monuments, bamboo stands and checkerboard witch floors. River banks and bridges follow the collision layout. Reduced-motion preferences disable menu animation, afterimages, camera shake and enemy movement cycles.


## Ultimates

All ultimates use Space or the special button and have a 60-second base cooldown, reduced by Six Eyes, Time Reserve and mastery. A new ultimate cannot overlap the one already active. Pausing freezes their timers and physics.

- **Goku — Spirit Bomb:** gather ki for 1.2 seconds, launch at the nearest enemy's original position, then detonate at 1.8 seconds. The blast hits enemies once, knocks them back and smashes supplies. The gathering pose, airborne sphere and landing blast are separate stages.
- **Gojo — Unlimited Void:** a five-second, fixed 420-unit domain arrests enemies and slows hostile projectiles inside its boundary. It deals periodic damage and ends with a damaging inward collapse. Moving away does not move the domain.
- **Naruto — Shadow Clone Rush:** six independent decoys navigate physical scenery, attract regular enemies, absorb hostile projectiles and strike with Rasengan for six seconds. They disappear in smoke rather than producing a generic screen-clearing explosion.
- **Maomao — Panacea Garden:** cultivate poison blooms around nearby enemies for six seconds, heal 5 HP/second before healing bonuses, clear existing hazards and harmful statuses on activation, prevent new poison, and resist 35% of incoming damage while active. Poison keeps damaging enemies briefly after they leave its cloud.
- **Madoka — Law of Cycles:** unfurl wings, restore 30 HP and the Soul Gem shield, purify nearby hostile projectiles and summon repeated homing light-arrow volleys for six seconds. Nearby XP is drawn in and holy-arrow impacts restore a little HP. Her held bow remains visible during the animation.

## Breakables and loot

Crates, pots and lanterns have health. Auto-attacks can target nearby supplies, and weapons, explosions and ultimates can break them. Each destroyed object rolls once: **60%** chance to drop a pickup, **40%** chance to drop nothing. It stays destroyed throughout the run; revisiting it cannot reroll its loot. Debris and pickups have falling/bouncing arcs. Boss treasure remains separate and still grants 1, 3 or 5 upgrade rewards.

| Pickup | Effect | Drop chance |
| --- | --- | --- |
| Coins | +10 bankable coins before coin-gain bonuses | 25.2% |
| Food | Restore 30 HP before healing bonuses, capped at max health | 16.8% |
| Magnet | Draw in every XP gem currently on the map | 7.8% |
| Ultimate energy | Remove 6 seconds from the current ultimate cooldown | 6% |
| Swift Boots | +25% movement speed for 12 seconds | 4.2% |
| No drop | Debris only | 40% |

Coins are banked automatically during a run and when leaving or dying. Every eight defeated enemies also grant 2 coins; bosses grant 25, before coin-gain bonuses. Enemy animation includes gait, arm recoil, cast windups, charging leans, snake slithering, Frieza's tail, fluttering butterflies, swaying roses and crawler limbs.


## Enemy movement cycles

Every ordinary enemy and boss has its own articulated movement profile, hand-drawn on the heroes’ native pixel grid, with cached frames and nearest-neighbor scaling:

| Enemy | Movement |
| --- | --- |
| Saibaman | Spring-loaded hops with landing squash and tucked arms |
| Frieza Force Trooper | Armored heel march with counter-swinging arms |
| Rogue Shinobi | Forward-leaning ninja sprint with rapid footwork |
| Summoned Serpent | Traveling body wave with a counter-moving head |
| Cursed Crawler | Asymmetric limb scuttle and shoulder rocking |
| Cursed Eye | Orbiting hover, writhing tendrils and tracking pupil |
| Anthony Familiar | Paper-doll waddle with alternating tilt |
| Witch's Butterfly | Offset wing flaps and figure-eight drifting |
| Gertrud's Rosebud | Alternating root steps and a nodding blossom |
| Frieza | Smooth levitation, pointed feet and independent tail whip |
| Orochimaru | Serpentine glide with trailing hair and rope movement |
| Ryomen Sukuna | Weighted martial stalk and shoulder counter-motion |
| Walpurgisnacht | Pendulum-like procession with a rotating stage gear |

Cast windups and attack recoil layer over the movement cycles. Animation time slows within Unlimited Void and freezes when paused; collision footprints stay tied to world positions.


## Persistent skill trees

Open **Skill Trees** in the lobby. Training takes effect on the next run. Costs rise with each rank. Each connected prerequisite needs at least one trained rank; joining branches require every incoming prerequisite. Select a hexagonal node to inspect and train it. Drag or scroll to pan, use +/− to zoom, or FIT to view the whole tree. The graph displays rank badges, prerequisite links, availability and total completion.

The shared tree has **24 nodes**, spends banked **coins** and applies to all sixteen heroes. Its branching paths improve HP, regeneration, healing, shield, speed, pickup range, weapon damage and area, cooldowns, rerolls, bans, coins, character XP and ultimates. Existing purchases keep their original IDs, costs and rank caps.

**Reroll** changes the current level-up choices, preferring different items. Each run starts with one free charge, and each purchased rank adds one; no charge is spent when no alternatives exist. Ready fusions stay prioritized. **Vanish** lets you select an eligible item on a level-up screen and remove it from both level-up and chest pools for the rest of that run. Every run includes one free Ban/Vanish charge. Banning uses one charge but keeps the current level-up available. An already equipped vanished item stays equipped; future runs start with fresh pools and charges.

Each hero has a separate twelve-node **character mastery tree**, paid with that hero’s own XP. Character XP is earned from defeating ordinary enemies (1), elites (5), bosses (25), and reaching a new wave (3), before Field Study bonuses. This XP is separate from gems and temporary in-run character levels. Unspent XP and lifetime XP persist across runs; the displayed mastery level rises once per 50 lifetime XP, independent of purchases.

| Hero | Mastery focus |
| --- | --- |
| Goku | Ki damage and cooldown, Saiyan health, Spirit Bomb area and damage |
| Gojo | Blue area, cooldown and damage, longer domains and stronger collapse |
| Naruto | Extra shuriken, movement, chakra damage, more clones and stronger Rasengan |
| Madoka | Extra arrows, Soul Gem shield, arrow damage, longer ultimate and activation healing |
| Maomao | Poison duration, regeneration, precise dosage, larger clouds and stronger healing |
| Shinji | Rifle damage, burst rounds, AT shield, longer Berserk Awakening and stronger berserk strikes |

Every tree also has a one-rank capstone that starts the signature weapon at level 2. Coin and XP payouts are credited incrementally with a per-run ledger to avoid double-crediting when saving, leaving, retrying or reloading. Saves are local to this browser, with JSON export/import available in the skill-tree menu.


## Combat effects and attack redesign

Open **Arsenal → Field Guide** for status explanations and the XP gem legend. Enemies show colored pixel status symbols above their health bars; player effects also show names, stack counts and remaining seconds in the HUD.

| Effect | Gameplay | Typical sources |
| --- | --- | --- |
| Poison | Damage every 0.5 seconds; overlapping distinct poison circles stack up to 3 doses | Maomao’s vials and garden; hostile venom, serpents and thorns |
| Burning | Fire damage every 0.5 seconds | Ki Wave; hostile ki, death balls and death beams |
| Cursed | +20% incoming damage | Cursed Blue, Hollow Purple and Unlimited Void; cursed enemies and projectiles |
| Stun | Interrupt movement and attacks | Storm Seal, Flying Thunder God explosions and Unlimited Void; hostile stage gears |
| Slow | Reduced movement speed | Cursed Blue; hostile musical notes and witch petals |
| Bleeding | Lingering cut damage | Shuriken and kunai; hostile blades and slashes |

Repeated applications refresh duration rather than indefinitely stacking damage, except the three-dose poison mechanic. A single poison circle cannot build multiple stacks by itself. Boss stuns last 35% as long and grant two seconds of stun resistance after recovery. Ordinary units receive a shorter recovery window. Damage over time respects shields and bypasses contact invulnerability; it does not trigger another attack’s status effect. Pausing freezes all status timers. Maomao’s Panacea and Madoka’s Law of Cycles cleanse harmful statuses on activation.

**Maomao’s Poison Vial** now flies from her throwing hand, breaks after a 0.55-second arc and leaves a circular poison pool with a visible boundary, bubbles and a poison marker. The circle lasts 4.3 seconds at rank 1, increasing with ranks, mastery and fusion. Enemies take damage inside it and carry poison for three seconds after their last exposure, before mastery bonuses. **Jade Alchemy** throws three vials across the target area, creating distinct overlapping circles with up to three poison doses. The pools fade when they expire.

**Gojo’s Cursed Blue** creates a blue event-horizon vortex at the target, up to 420 units away. It physically draws nearby enemies toward its core, applies curse and slow, pulses damage, then collapses with a final hit. Bosses resist its pull. **Hollow Purple** visibly converges red and blue for 0.42 seconds before launching a large, piercing purple projectile with a trailing wake and cursed impact bursts. Unlimited Void adds status-based interruption and curse to its fixed domain and has a new information-stream/grid visual treatment.

## XP gem tiers

Gem value changes both its color and size; high-value gems have extra glints. Every tier contributes to the same temporary in-run level bar and works with pickup range and magnets. Character mastery XP remains separate.

| Gem | XP value | Source |
| --- | --- | --- |
| Jade shard (green) | 1 | 78% of ordinary enemy drops |
| Azure crystal (blue) | 3 | 20% of ordinary enemy drops |
| Amethyst prism (purple) | 10 | 2% of ordinary drops; 80% of elite drops |
| Amber star (gold) | 25 | 20% of elite drops; bosses before wave 10 |
| Crimson core (red) | 50 | Bosses from wave 10 onward |

Faraway gems are consolidated during long runs without losing their combined XP value.


## Expressions and EVA-01

Heroes now have character-specific mouth shapes, brows and eye details. Combat switches between neutral, focused, hurt and ultimate expressions, with occasional blinks while idle. Actual damage triggers the hurt state; dodges do not. Reduced motion disables blinking. Gojo keeps his opaque blindfold in every state; his expression changes through his mouth. Maomao keeps her violet eyes and reference outfit, with clear cheeks across every skin.

**Shinji Ikari** is the sixth character. His menu portrait shows the pilot beside **EVA-01**; in combat he pilots a compact purple-and-green unit with shoulder pylons, a horn, articulated armor and a visible rifle. The unit is slightly larger than the human sprites while retaining the same collision footprint.

- **Pallet Rifle:** three individually timed rounds per burst. Ranks add damage and piercing; Shinji’s Fire Discipline mastery adds rounds.
- **AT Field:** +11 rechargeable shield and 4% incoming damage resistance per rank, available to all heroes through the shared item pool. When equipped, shields recharge every nine seconds and use an octagonal visual.
- **Spear of Longinus:** max Pallet Rifle and AT Field to unlock a crimson, forked spear that pierces and curses enemies, then returns for a weaker second strike.
- **Berserk Awakening:** six seconds of enhanced EVA-01 combat. Refill the shield, clear harmful statuses, resist 35% damage before passive resistance, move 15% faster, deal 35% more weapon damage and fire with 25% shorter cooldowns. EVA-01 periodically claws nearby enemies, destroys nearby supplies, deflects hostile shots within its AT boundary and ends with a damaging, knocking shockwave. It expires normally and respects pause and ultimate cooldowns.

Shinji has his own six-node XP tree: Synchronization, Absolute Territory, Fire Discipline, I Mustn’t Run Away, Perfect Synchrony and The Beast. Existing version-1 saves keep every balance and purchase, and receive an empty Shinji mastery wallet automatically.

## Expanded anime bestiary

Open **Arsenal → Bestiary** for pixel portraits, anime origins and attack descriptions. There are **41 ordinary enemy types and 19 bosses**, representing Dragon Ball, Naruto, Jujutsu Kaisen, Madoka Magica, Frieren, Evangelion, Demon Slayer and Chainsaw Man. The nine added ordinary types each have their own sprite and movement cycle:

| Enemy | Origin | Function |
| --- | --- | --- |
| Fly Head | Jujutsu Kaisen | Airborne circling and cursed-mote fans |
| Transfigured Human | Jujutsu Kaisen | Distorted body lunge and delayed grasp |
| Jogo | Jujutsu Kaisen | Burning ember fans and marked volcanic vents |
| Hanami | Jujutsu Kaisen | Root traps that slow and temporary bark armor |
| Dagon | Jujutsu Kaisen | Slowing spectral-fish volleys; crosses water |
| Demon Soldier | Frieren | Telegraphs a cutting sword charge |
| Angel Fragment | Evangelion | Delayed cross-shaped light blasts |
| Spider Demon | Demon Slayer | Lingering silk snares and a skittering gait |
| Devil Zombie | Chainsaw Man | Cleaver marks; shambles faster below half health |

Jogo, Hanami and Dagon enter from wave 3; angel fragments enter from wave 2. Witch’s Labyrinth retains its witch-familiar ordinary enemy family. The new bosses have multi-step patterns and an enraged second phase below 50% HP:

| Boss | Distinct attacks |
| --- | --- |
| Aura the Guillotine | Soul Balance marks your current position with a long warning. Leave its circle before judgment. Her Guillotine cuts marked lines; summoned soldiers are bound to her and are dispelled on defeat. Judgment deals damage and curse, never an unavoidable instant kill. |
| Mahito | Creates transfigured humans, gains temporary transformation armor, strikes along marked hand paths and opens a fixed Self-Embodiment danger zone. |
| Akaza | Compass Needle marks a ring of delayed strikes, followed by a warned destructive rush and spreading shockwave fists. |
| Sachiel | Cross-shaped Light Lances, temporary AT armor, angel summons and a warned core detonation. |

Temporary bark/AT armor reduces incoming damage by 40% and visibly expires. All bosses guarantee exactly one chest, containing 1, 3 or 5 upgrades. Bosses arrive at waves 5, 10, 15 and so on. The original map boss orders below are interleaved with later guest bosses and Ridley; each map rotates through all twenty-two bosses before repeating:

| Map | Boss sequence |
| --- | --- |
| Sakura Sanctuary | Aura → Orochimaru → Akaza → Mahito → Frieza → Sukuna → Sachiel → Walpurgisnacht |
| Sunken Citadel | Frieza → Sachiel → Akaza → Aura → Mahito → Orochimaru → Sukuna → Walpurgisnacht |
| Moonlit Crossing | Mahito → Sukuna → Aura → Akaza → Sachiel → Orochimaru → Frieza → Walpurgisnacht |
| Witch’s Labyrinth | Walpurgisnacht → Aura → Mahito → Sachiel → Akaza → Sukuna → Orochimaru → Frieza |


## Multi-touch and dash

Action buttons maintain independent pointer ownership, so dragging the joystick does not block a second or third finger from using dash and ultimate. Pressing an action does not reset the movement anchor or begin a pinch. Pointer cancellation and lost capture release only the affected pointer. Mouse clicks and keyboard activation remain supported.

Dash travels up to 209 world units over **0.22 seconds**, using the current movement direction or the last movement direction when stationary. Incoming attacks and damage-over-time ticks cannot damage you while dashing. It begins a **10-second** cooldown. Both the dash and its cooldown freeze in pause, upgrade and chest screens. Dash uses the same collision and water rules as normal movement, and cannot start while stunned or frozen. The button displays its cooldown and shows **INVINCIBLE** while active. Reduced motion removes its afterimages.

## Cosmetic wardrobe

The appearance picker beneath the selected character’s loadout contains **33 free cosmetic skins**. Choices save locally and are included in JSON export/import. Skins retain the character’s stats, items, fusions and mastery wallet.

| Character | Skins |
| --- | --- |
| Goku | Orange Gi; Super Saiyan |
| Gojo | High Collar; Unsealed; Female Gojo |
| Naruto | Leaf Ninja; Sage Cloak |
| Madoka | Magical Girl; Ultimate Madoka |
| Maomao | Apothecary; Spring Court; Palace Attire; Crimson Dancer |
| Shinji’s EVA slot | Shinji / EVA-01; Asuka / EVA-02; Rei / EVA-00; Mari / EVA-08 |
| Esdeath | Imperial General; Midnight Winter |
| Kurumi | Astral Dress; Gothic White · Eyepatch; Midnight Rose; School Uniform |

EVA-01 has revised rib armor, layered shoulder pylons, segmented limbs, a shaped jaw and a longer horn. The other units have their own armor palettes and optics: EVA-02’s four eyes, EVA-00’s single optic, and EVA-08’s multi-eye face. Pilot portraits change hair, suit and identifying details. The combat HUD identifies the selected pilot and unit. All four EVA skins share **Shinji’s mastery**, including XP earned while using Asuka, Rei or Mari. Old saves gain empty skin and Esdeath records while preserving existing currency and purchases.

## Esdeath and Frozen

Esdeath is the seventh hero, with a white officer uniform, blue hair, sword and alternate dark winter coat. **Ice Lance** fires piercing ice spears that briefly freeze targets. **Demon’s Extract** grants +6% area, +4% damage and 25% freeze resistance per rank. Max both to fuse **Ice Cavalry**, a wider volley whose impacts freeze nearby enemies in cold bursts.

**Frozen** stops movement and attacks and displays a blue snowflake status icon. Frozen and Stun share a crowd-control recovery window, so alternating them cannot continuously lock a boss. Boss freeze durations are reduced to 35%; freeze resistance shortens a player’s freeze duration. Default hostile ice attacks freeze players for 0.8 seconds before resistance.

**Mahapadma** creates a fixed 480-unit time-stop domain for 4.5 seconds before mastery. Enemies inside stop moving and attacking. Hostile projectiles pause movement and lifetime, and marked danger-zone clocks pause when their centers lie within the domain. Esdeath can move, dash and attack freely. The domain ends with an ice burst and expires normally. Her six-node mastery tree improves lance damage, HP, spear count, domain radius, starting weapon rank and ultimate duration.

## New battlegrounds and reinforcements

**Marineford** adds a naval stone plaza, fort entrance, justice banners, shore cannons, harbor ships and bridge crossings. Its ordinary pool contains Marine Marksmen, Marine Swordsmen, Bay Raiders, Naval Cannoniers (from wave 2) and Pacifista (from wave 3). **Frozen Citadel** adds icy stonework, frozen arches, snow-covered trees and crystal formations, with Imperial Guards, Frost Danger Beasts and Imperial Cryomancers.

| Enemy | Mechanic |
| --- | --- |
| Marine Marksman | Warned narrow firing lane |
| Marine Swordsman | Staggered three-cut warnings and a charging approach |
| Naval Cannonier | Delayed cannon impact at your previous position |
| Pacifista | Long charged laser, with periodic radial light bolts |
| Bay Raider | A grappling hook that physically pulls you toward its source, respecting scenery |
| Imperial Guard | Temporary armor and a warned stunning thrust |
| Frost Danger Beast | A low pounce into a marked impact circle |
| Imperial Cryomancer | Lingering freezing mines |

| Boss | Mechanic |
| --- | --- |
| Akainu | Delayed magma meteors become lingering burning pools; magma fans and an eruption rush |
| Aokiji | Freezing Ice Age lanes, ice-spear fans and staggered glacial circles |
| Kizaru | Light-speed rush, crossed light marks and fast light volleys |
| General Budo | Lightning pillars, temporary thunder armor and a heavy lightning lane |
| Northern Ice Dragon | Breath lanes, falling ice and a wing rush with ice shards |

Marineford opens with **Akainu → Aokiji → Kizaru**. Frozen Citadel opens with **Budo → Northern Ice Dragon → Aokiji**. All nine maps rotate through all twenty-two bosses; every boss still guarantees one upgrade chest. All five new bosses enrage below half health.

The **Bestiary** now has a direct lobby button, text search across names, anime origins and mechanics, and separate Enemy/Boss filters. It contains all **77 threats** from fifteen anime and game worlds, with pixel portraits, attack explanations and appearance-wave information.


## Boss entrance cinematics

Every five waves, each arriving boss gets a staged pixel-art entrance with its name, title, signature power and wave. Most last 3.6 seconds; Reiner lasts 4.1 seconds and DIO lasts 4.2 seconds. Reduced motion uses a quieter 1.2-second scene. Press Enter, Space or Escape, or tap **Skip entrance**, to skip. Combat, movement, status damage, weapon/ultimate/dash cooldowns, hostile attacks and the survival timer pause during the cut-in. Returning to combat grants 0.8 seconds of protection. P or the pause button still opens the normal pause menu, and switching tabs pauses the cinematic. Input resets on entry and exit so held movement and action presses do not leak through. All 25 bosses have distinct signature-power captions and themed scene art; queued arrivals show in order.

## Kurumi Tokisaki

Kurumi is the eighth playable hero. Her red-and-black Astral Dress has scalloped layers, ribbons, uneven twin tails, a red eye and a gold clock eye, a held musket and a pistol. **Midnight Rose**, **Gothic White · Eyepatch** and **School Uniform** have independent outfit silhouettes.

- **Zafkiel Flintlock:** two clock bullets per volley at rank 1, increasing with rank and mastery. Bullets pierce at higher ranks, curse targets and slow them by 35%.
- **Time Reserve:** −6% weapon/ultimate cooldown and +15% clock-bullet slow duration per rank. Its cooldown reduction stacks with Six Eyes.
- **Zafkiel: Seventh Bullet:** fuse the rank-5 weapon and rank-3 passive. Five staggered, piercing shots per volley inflict curse, 50% slow and brief stun. Existing boss control resistance and recovery windows apply.
- **City of Devouring Time:** a seven-second, fixed crimson clock domain. Inside it, ordinary enemies move and advance their attack clocks at 35% speed; bosses run at 70%; hostile shots move at 35%. Three shadow doubles join Kurumi with paired bullet volleys every 0.65 seconds. The final chime damages, curses and briefly stuns enemies. Movement and dash stay available; unlike Mahapadma, projectiles keep aging while slowed.
- Her six mastery nodes improve signature damage, signature cooldown, bullet count, domain duration, starting weapon rank and shadow damage. Character XP banks in Kurumi’s own wallet. Version-1 saves gain this wallet without losing existing purchases, balances or skins.

## Reference-based character redesigns

**Esdeath** now wears a peaked cap with a dark visor, silver piping and insignia; a white, double-breasted officer coat with open lapels and belt; navy sleeves and gloves; thigh-high white boots with laced knee panels; and long, split blue hair. Her rapier remains visible, including during her ice casting pose. Midnight Winter keeps the new silhouette and outfit details.

**Ultimate Madoka** is the existing saved `goddess` skin, now named explicitly in the appearance picker and completely redrawn. It has long pink hair, white hair ribbons, permanent feathered wings, gold eyes, a layered white dress and a star-speckled dark underskirt. The held bow, aiming and Law of Cycles work in this form. It is a cosmetic choice with the same stats and mastery as standard Madoka; existing Hope’s Light selections carry forward automatically.

**Shinji, Asuka, Rei and Mari** have separate pilot hair silhouettes and detailed, fitted plugsuits: segmented limbs, knee panels, chest controls and unit markings. Asuka has copper twin tails and red interface clips; Rei has a cropped blue bob and red eyes; Mari has braided hair, white interface clips and red glasses. Their eyes blink and react to damage independently of their clothing. The HUD now shows the selected pilot’s actual portrait beside the unit name; their EVA skins and shared Shinji progression are preserved.


## Ascension, rage and character resources

Every hero now has a run-specific mechanic, a dedicated HUD meter and an explanation in the starting loadout. These resources reset on a new run, share the selected hero’s skins, and stop advancing during pause menus, upgrades, chests and boss cut-ins. They do not spend banked coins or character mastery XP.

| Hero | Unique mechanic |
| --- | --- |
| Goku | **Saiyan Ascension:** transform at 1:00, 2:30, 5:00 and 8:00 into Super Saiyan, SS2, SS3 and Blue. Stages give +12%, +24%, +36% and +50% damage; movement gains 3% per stage. Hair, aura and the meter show the current form; SS3 has long hair and Blue has cyan hair. |
| Shinji / all EVA pilots | **Pilot Rage:** gain 4 rage per kill, plus rage from shield or HP damage taken. At 100, automatically enter an eight-second frenzy with +40% damage, +15% movement and 20% damage resistance. The unit animates its opening jaw, alternating claw swings and glowing ribs, with roar rings and green energy motes. Reduced motion holds a single pose and removes the moving aura effects. Rage does not refill during frenzy. |
| Gojo | **Infinity Guard:** after eight active seconds, negate one direct hit and restart the charge. Damage over time bypasses the guard. |
| Naruto | **Chakra Flow:** movement builds 7 chakra per second and kills add 10. At 100, the next signature shuriken volley adds two blades and 25% damage. |
| Madoka | **Threads of Hope:** collect 40 in-run XP to fill the meter. The next bow volley adds three arrows, restores 5 HP and repairs up to 8 shield. |
| Maomao | **Precise Dose:** each enemy hit by a poison-circle pulse adds 4 toxicology. At 100, the next vial heals 6 HP, has 40% more radius and deals 30% more damage. |
| Esdeath | **Frost Dominion:** successful Ice Lance freezes add 5 dominion. At 100, gain six seconds of ice armor: +25% damage and 25% damage resistance. Boss control immunity still limits repeated freezes. |
| Kurumi | **Stolen Seconds:** bank 0.5 seconds per ordinary kill, 2 per elite or 4 per boss, capped at 10. The next ultimate spends them to reduce its cooldown, with a six-second minimum, and extends its domain by 0.15 seconds per second spent. |

Hero damage bonuses combine with existing equipment and mastery without changing their saved ranks. Chakra, Hope and Precise Dose empower only the corresponding signature weapon. Other heroes can still acquire those weapons in the shared pool.

## Readable projectiles and bigger loadouts

Carry up to **five weapons and five passives**. Both HUD rows, upgrade validation, loot eligibility and chest rewards use the same capacity. Fusions still occupy their existing weapon slot. Reroll and Vanish continue to respect the expanded inventory.

Pallet Rifle rounds now have gold tracers, a bright core and a dark outline. Clock bullets have crimson trails and gold clock faces; arrows have a pink shaft and gold tip; ice spears have a pale-blue crystal core; knives and shuriken have outlined steel surfaces. Vials have a larger, outlined bottle silhouette. Shots keep a minimum readable screen size when zoomed out; these display improvements retain the original collision radii. Hostile shots get a dark border and pale danger ring. Reduced-motion mode retains the same visibility without spinning projectile details.

## Spring Court skin

Maomao’s **Spring Court** is an original pixel-art outfit based on the supplied image: high double buns, a broad pink robe, pale blue shoulder wrap and trailing scarf, a green sash and ribbons, a burgundy skirt and a pale blue underskirt. It has separate walking and vial-throwing frames, blinking violet eyes and clear cheeks. Select it in the appearance picker; the choice saves and exports alongside existing skins without changing stats or mastery.

## Castle, Forest and themed breakables

**Crimson Castle** has violet flagstones, a crimson carpet, crenellated stone arches, banners, columns and cypresses beside a moat. Demons, imperial guards, swordsmen, zombies and transfigured humans patrol its halls. Its first boss is Aura the Guillotine.

**Emerald Forest** has dense broadleaf canopies, mossy stones, dirt trails, root arches and mushroom patches along a river. Snakes, Saibamen, woodland familiars, spider demons, frost beasts and Hanami inhabit the map. Orochimaru appears first. Both new maps have bridge crossings, the existing collision and destruction systems, and a full rotation through all twenty-two bosses.

Every map now has three of its own breakable supplies. They collide, take weapon damage, produce matching debris, and stay destroyed when revisited. Objects based on crates can be pushed. The existing **60% chance of a loot drop** remains; food, coins, magnets, energy and boots still share the supply drop pool. Boss chests remain guaranteed.

| Map | Breakable supplies |
| --- | --- |
| Sakura Sanctuary | Petal Basket, Tea Jar, Paper Lantern |
| Sunken Citadel | Stone Coffer, Relic Urn, Sun Brazier |
| Moonlit Crossing | Bamboo Bundle, Rice Basket, Spirit Candle |
| Witch’s Labyrinth | Candy Box, Witch’s Teacup, Clockwork Doll |
| Marineford | Powder Barrel, Naval Chest, Marine Supply Case |
| Frozen Citadel | Frozen Crate, Ice Urn, Frost Brazier |
| Crimson Castle | Armor Stand, Royal Urn, Royal Coffer |
| Emerald Forest | Fallen Log, Mooncap Patch, Honey Hive |


## Illustrated skill trees, compact shots and one-minute ultimates

All **81 shared and character mastery nodes** now have individual multicolor illustrations. Each node uses its own silhouette; effects such as Reroll, Vanish, Spirit Control, Absolute Territory and Stolen Seconds no longer reuse the item icon for several different skills. Skill IDs, prices, ranks and existing purchases are unchanged.

Player projectiles are approximately a third smaller at the default camera scale. Their bright cores, distinct tips, colored tracers and opaque borders remain. Fused shots and area bonuses still enlarge their artwork, with a lower visual cap; hostile-shot halos are smaller too. Combat collision radii and projectile damage are unchanged by the visual reduction.

The ultimate base cooldown is now **60 active seconds**. Six Eyes, Time Reserve, Perfect Timing, energy drops and Kurumi’s Stolen Seconds still provide their documented reductions. The cooldown ring uses the cast’s actual maximum cooldown. Pauses, level-up screens, chests and boss entrances freeze the timer as before. Dash keeps its separate ten-second cooldown.

## Escalating rift pressure

Every full active minute, ordinary enemies and bosses gain pressure in addition to the existing wave scaling. New spawns receive it immediately; enemies already alive receive the difference at the minute boundary. Health upgrades preserve the enemy’s current HP percentage, apply once per minute and never resurrect dead enemies.

| Active time | Extra health factor | Damage factor | Movement factor | Attack-rate factor |
| --- | --- | --- | --- | --- |
| 0:00 | 1.00× | 1.00× | 1.00× | 1.00× |
| 5:00 | 2.35× | 1.45× | 1.175× | 1.20× |
| 10:00 | 4.60× | 1.90× | 1.35× | 1.40× |

Enemy projectile speed also rises gradually. Movement, attack cadence and projectile-speed growth have caps; health and damage continue rising in endless runs. Warnings retain their original delays, giving the player the same reaction time before a marked attack. Damage for an existing warning is fixed when it is created. This pressure clock freezes with the run during menus and boss introductions.

## New threats

The bestiary includes six additional ordinary enemies and three additional bosses, with original pixel sprites and distinct animated movement. Bleach and Date A Live bring the enemy roster to twelve anime families.

| Threat | Mechanics |
| --- | --- |
| Akatsuki Puppet | Poison needle fans and three staggered ground traps. |
| Root ANBU | Leaves a delayed stun decoy before a warned sword rush. |
| Hollow Stalker | Soul bolts heal their source for half the HP/shield damage actually dealt. Dodges, dash and Infinity deny the heal. |
| Cero Bat | Flies over water and predicts movement with a warned Cero line. |
| Cell Junior | Ki fans; every second attack repairs 6% max HP and releases a defensive ring. |
| Clockwork Wraith | Lingering slowing marks and curving clockwork projectiles. |
| Perfect Cell | Solar Flare, three-part Kamehameha and Cell Junior summons. Regenerates 0.6% max HP per second after three seconds without damage; damage over time can keep regeneration suppressed. |
| Itachi Uchiha | Raven volleys, staggered Tsukuyomi marks, lingering Amaterasu flames and temporary Susanoo armor before a heavy blade strike. |
| Ulquiorra Cifer | Cero Oscuras, delayed Lanza blasts and a wing rush; phase II adds beams and blast marks. |

New enemies appear in themed pools: Naruto enemies in Garden/Forest/Castle; Hollows in Ruins/Moon/Castle; Cell Juniors in Ruins/Marineford; and Clockwork Wraiths in Moon/Castle. Witch’s Labyrinth retains its Madoka-only ordinary enemy pool. New bosses are interleaved into every map’s sixteen-boss rotation, rather than being deferred to the end. Each map keeps its opening boss; Marineford and Frozen Citadel also keep their original opening three. Castle and Moon encounter Itachi second, Forest and Ruins encounter Cell second, and Labyrinth encounters Ulquiorra second. Every boss still has an entrance cut-in, a second phase and a guaranteed 1/3/5-reward chest.

## Three reference skins

- **Kurumi — Gothic White · Eyepatch:** loose black hair, roses, a black corset, layered white ruffles, visible flintlocks and a small white left-eye patch almost entirely hidden by her fringe.
- **Maomao — Crimson Dancer:** long dark teal hair, a blue hair flower, red dancing sleeves and skirt, mint scarf and ribbons, a pale waist wrap and gold ornaments.
- **Gojo — Female Gojo:** long silver hair, cyan eyes, sunglasses resting on her head, a fitted navy high-collar outfit, boots and a raised casting hand.

All three are original pixel-art interpretations of the supplied images. They have separate movement, casting and expression frames, and save as cosmetic appearances under their original character IDs. Skills, mastery wallets, equipment and character resources remain shared with that character.

## Cosmetic companions

The lobby now has a **Companion** picker: **No companion**, **Baby Metroid**, **Star Wisp**, **Pochita**, **Kyubey**, **Chopper**, or **Kon**. All are available immediately. Selection is global across heroes, saves locally and travels with JSON export/import. Older saves default to no companion.

Baby Metroid has a translucent green dome, three ruby nuclei and ivory fangs. It floats behind the hero, gently bobs, and catches up after movement or dash. Star Wisp provides a second decorative option. Reduced motion removes bobbing and shimmer. Pets pause during menus, chests, upgrades and boss entrances.

Pets are purely decorative: they have no HP, attacks, collision, threat or stat effects; they do not intercept shots, attract enemies, collect loot, grant XP or modify drop rolls. Their movement uses separate visual state rather than the enemy, clone or pickup systems.


## Frieren, Samus and persistent expeditions

**Frieren** wears her white-and-gold robe, silver twin tails and pointed ears, with her red-orb staff visible. **Maid Frieren** is a distinct black-and-white outfit with an apron, lace hem and frilled headband inspired by the supplied reference. Her Mana Concealment gathers 18 mana per second while still, 6 while moving and 4 per kill. At 100, her next Zoltraak ray gains 50% damage and 20% area. Height of Magic summons orbiting sigils and up to three piercing lances every 0.45 seconds for six seconds. Her six mastery nodes improve signature damage/cooldown, shield, starting weapon rank, barrage duration and damage.

**Samus Aran** has Varia and Gravity suit appearances, with articulated armor, a green visor and visible arm cannon. Charge Cycle builds 10 charge per active second and 8 per kill. At 100, the next Power Beam volley gains 80% damage, extra piercing and splash damage. Samus also launches a missile every 4–8 arm-cannon bolts, with a 25% chance of a Super Missile. Her cannon evolves at 100 / 200 / 300 kills into Wave, Ice Wave and Plasma Ice; these functions accumulate and the current stage is shown in the HUD. Power Bomb curls her into Morph Ball, charges for two seconds and explodes once, dealing damage, stunning enemies and clearing nearby hostile shots. Energy Tank adds 18 max HP and 4% damage resistance per rank. Her mastery improves cannon damage, HP, bolt count, bomb area, starting rank and ultimate damage. Both heroes’ weapons and passives enter the shared pool; both gain independent character-XP wallets without replacing older progress.

The Metroid roster adds **Zoomer** radial thorns, **Ripper** temporary armor and lane charges, **Sidehopper** staggered jumping impacts, **Zebesian Space Pirate** plasma fans and claw rushes, and **Feral Metroid** slowing life-drain bolts. **Ridley** is a two-phase boss with warned breath and tail lanes and staggered aerial bombardment. Sunken Citadel includes all five Metroid enemy types and encounters Ridley as its second boss; other maps mix them into their themed pools. All six have pixel portraits, animated movement and bestiary entries.

New anime pets **Pochita**, **Kyubey**, **Chopper** and **Kon** follow the hero with their own pixel art and subtle animation. Like Baby Metroid and Star Wisp, they provide no combat bonuses.

Run checkpoints preserve inventory, fusions, health, cooldowns, resources, enemies, live shots, world destruction, current offers and already-applied chest rewards. Reloading always pauses combat first. Credited reward totals prevent a resumed older checkpoint from banking the same coins or mastery XP twice. Death clears the checkpoint while retaining earned progress. Browser storage is tied to the browser and origin/file location; exporting a profile is useful before changing browsers or moving the offline file.


## Zebes and the Ten Shadows update

All heroes begin with **1 HP per second of base regeneration**, **one Reroll** and **one Ban**. Equipment and permanent-tree bonuses add to these values. Older live checkpoints receive the new base rules once, preserving their inventory, purchases and earned progress.

Gojo begins with **Cursed Blue and Reversal Red** in two active slots, plus Six Eyes in a passive slot. Blue pulls and curses targets; Red is a projectile that explodes and pushes enemies away. Maxing both actives and Six Eyes unlocks Hollow Purple. Fusion consumes Red, frees its slot and keeps Six Eyes. Red is removed from the remaining upgrade/chest pool after fusion, including imported older Purple builds.

Goku’s Ki Wave now charges briefly in his hand, then travels as a compact, bright crescent with a white core and blue trail. It pierces, burns and knocks enemies back; rank 3 adds a second wave. Super Kamehameha has a longer charge, greater reach and almost unlimited piercing. Damage occurs on impact rather than instantly along a line.

Samus has five cosmetic appearances: **Varia Suit**, **Gravity Suit**, **Zero Suit**, **Zero Suit · Stealth**, and **Fusion Suit**. The suitless appearances have a blonde ponytail, a full-body outfit and a visible pistol. All retain Samus’s weapons, Power Bomb, mastery wallet and cannon progression. Missiles explode on enemies and scenery; Super Missiles have a larger blast and briefly stun. Normal missiles burn. Kill-based cannon upgrades retain earlier functions: Wave oscillates, Ice freezes, and Plasma adds piercing and burning. Cannon stage, random missile countdown and live ordnance persist with the run checkpoint.

**Megumi Fushiguro** commands two Divine Dogs, which move and bite independently. Megumi also starts with **Nue** as an independent second summon weapon. Totality empowers the dogs; Nue’s own Thunderstorm fusion chains lightning between nearby targets. Recasting renews a bounded pack rather than endlessly accumulating units. Summons can destroy supplies. Shadow Resonance gains 5 energy per kill; at 100, the next pack gains 40% damage and 25% duration.

His ultimate summons one **Mahoraga** with a health bar; it persists until defeated, and recasting fully heals the living guardian without duplicating it. Mahoraga pursues enemies, makes broad sword strikes and intercepts nearby hostile shots. Interceptions turn its wheel and grant up to four adaptation stacks, each adding 15% damage. Player levels strengthen its maximum HP and attacks. The Megumi tree uses his own XP for summon damage, duration, cooldowns, starting rank and Mahoraga strength; duration mastery increases persistent guardian HP. Both Jujutsu and Training uniforms are available. Summon state and adaptation pause and save with the run.

**Zebes** has purple cavern floors, luminous mineral veins, Chozo doors, alien growths and blocked acid channels crossed by bridges. Its breakables are Missile Caches, Chozo Energy Capsules and Containment Pods, each using the existing 60% pickup-drop chance. Its first three bosses are **Kraid → Ridley → Mother Brain**; the map later rotates through all twenty-two bosses.

Four Space Pirate variants join the original Zebesian: **Green Space Pirates** rush with double claws; **Red Plasma Pirates** fire fans and lingering plasma mines; **Aerotroopers** fly over waterways, fire curving volleys and mark landing blasts; **Elite Gold Pirates** gain temporary armor and counter with broad lanes and radial plasma.

**Kraid** uses warned belly-spike lanes, spike fans and ground stomps, with denser patterns in phase II. **Mother Brain** begins in a stationary glass tank, using temporary armor, Rinka rings and lasers. Below half health she breaks into a walking form with an aimed Rinka fan, a warned mouth-fired Hyper Beam and three crushing footfalls. Both have original animated pixel art, bestiary entries, entrance cinematics and guaranteed upgrade chests.

**Ulquiorra** now changes from his white Espada uniform into a horned, winged Segunda Etapa below half health. His rotation includes predictive Cero Oscuras, delayed Lanza impacts followed by larger shockwaves, crossed Sonído lanes and Black Despair. Segunda Etapa briefly opens a regeneration window; recent damage interrupts healing. Both forms have separate sprites and animation.


## Titan forms and companion control

**Eren Yeager** starts as a human with **ODM Blades** and **Key of Freedom**. His ultimate permanently toggles Human ↔ Attack Titan, with the normal one-minute base cooldown between transformations. Human form gains 10% movement speed and uses bleeding blade sweeps. Titan form keeps base movement speed, gains 40% damage and 35% incoming damage resistance, and has 45 rechargeable hardening shield; its crushing fists stun and knock enemies back. Becoming a Titan also releases one close-range shockwave. The transformation animation ends after 1.15 seconds; the selected form remains.

Both form weapons start at level 1, share one active slot, and share one rank and evolution unlock when switching. The current form’s weapon appears in upgrade choices; other heroes can obtain ODM Blades from the shared pool; Titan Fists and Titan Quake are exclusive to Eren in Titan form. Max the active form weapon and Key of Freedom to unlock **Thunder Spears** and **Titan Quake** together. Older independent ranks migrate to their highest saved rank; either previous evolution unlocks both. The inactive form never occupies an extra slot. Eren’s own mastery improves signature damage, HP, signature cooldown, Titan resistance, starting ranks for both weapons and transformation shockwave damage. Scout Uniform, Survey Corps Cloak, Yeagerist · Long Coat and Marley Infiltrator appearances are included. Checkpoints retain the active form and both weapon banks.

Combat companions patrol independently within a camera-based boundary capped at 300 world units, reduced for narrow screens or high zoom so their full sprites remain visible. Dogs, Nue and Mahoraga choose nearby enemies within 94% of that range. Idle companions wander around separate moving patrol points, rather than clustering at the player’s feet. At the edge they stay on the boundary; emergency recalls apply only after a large displacement. Adjacent supplies can still be struck in place. Naruto’s clones and Kurumi’s shadow doubles use the same outer visibility constraint. Movement and lifetimes freeze during interruptions and save with the run.

**Megumi starts with Divine Dogs and Nue in two active slots.** Recasting the dogs renews only the dogs; Nue has its own rank, cooldown, duration and **Nue: Thunderstorm** fusion. Both signature summons benefit from Megumi’s damage/cooldown mastery and may consume Shadow Resonance. Existing Megumi checkpoints gain Nue when an active slot is available; full inventories remain intact.

The **Fusion Suit** is a new sprite rather than a palette swap: cyan limbs and slim shoulders, gold segmented torso and leg accents, magenta helmet and collar, a blue visor, green cannon and three forearm fins, based on the supplied reference. It includes walking, firing, hurt and blue/gold Morph Ball frames. Cosmetic stats are unchanged.

Samus’s cannon evolves at **100, 200 and 300 kills** into Wave, Ice Wave and Plasma Ice. Its inventory, HUD avatar, upgrade-card and item-detail icons change with the current stage, including while fused. Evolution keeps the existing weapon slot and rank; checkpoints preserve kill count and missile countdown. Plasma Ice is the final stage.

New **Hollow Purple** fusions require **Cursed Blue LV 5 + Reversal Red LV 5 + Six Eyes LV 3**. Red is consumed, Blue becomes Purple, and Six Eyes remains equipped. Previously unlocked Purple weapons in saved runs remain unlocked. Arsenal recipes, upgrade cards, menu hints and item details show all three requirements.


## Shiganshina and Titan shifters

**Shiganshina** is the tenth map: warm cobblestones, half-timbered houses with red roofs, Wall Maria’s stone gate, Scout banners and canal crossings. Breakable Scout Ration Chests, ODM Gas Cylinders and District Supply Barrels use the normal 60% drop chance. Wandering Titans warn grabbing circles; Abnormal Titans dive down warned lanes. The first three bosses are **Annie → Reiner → Bertholdt**. All maps eventually rotate through the complete boss roster.

**Annie Leonhart**, **Reiner Braun** and **Bertholdt Hoover** begin in human form. Below 50% health, each transforms once, preserving remaining HP: Annie becomes the Female Titan with hardened kicks, crystal strikes and a Titan-summoning scream; Reiner becomes the Armored Titan with temporary armor, shoulder charges and shockwaves; Bertholdt becomes the slower Colossal Titan with persistent burning steam and delayed footfalls. Each has human and Titan pixel art, a unique movement cycle, bestiary information and a guaranteed final chest. **Mother Brain** now explicitly breaks out of her tank below half health with the same transformation cinematic before walking and firing Hyper Beams. Combat pauses during transformations; the boss restarts with a short attack windup. Transformed states survive checkpoints.

Eren’s two additional skins interpret the supplied outfits as original pixel sprites: **Yeagerist · Long Coat** has tied-back hair, gray lace-up shirt and a dark coat; **Marley Infiltrator** has long hair, eye bandages, a tan coat, armband and walking stick. Choices persist with the existing profile and checkpoint saves. Titan appearance and stats remain shared across outfits. Old non-Eren checkpoints lose obsolete borrowed Titan Fists and Titan Quake while retaining other equipment, kills and earnings.

Samus’s trait panel explicitly displays **total run kills / next evolution threshold**, e.g. **137 / 200 KILLS · ICE WAVE BEAM NEXT**. The bar measures progress toward the next 100-kill evolution. Current beam, shot charge and missile countdown appear separately; at 300 kills the panel shows CANNON MAX while continuing to count all kills. This uses the same saved count as the DEFEATED HUD and cannon stage icons.


## Character art, pixel inventory and boss ultimates

Eren’s four human outfits and Attack Titan have been fully redrawn: compact eyes and brows, swept hair and side locks, layered Scout jackets and harnesses, a draped green cloak, a long dark coat with tied-back hair, and a bandaged Marley disguise with walking stick. All outfits retain movement, attack, blink and hurt frames and use the existing saved skin IDs. The Titan has long dark hair, a tapered face, a toothed jaw, shaded muscle planes and animated fists. Frieren and Maid Frieren have new silver twin tails, long elven ears, calm green eyes, red earrings and a visible red-and-gold staff. All Maomao outfits now have clear cheeks without freckles.

All 41 weapons and passives, their 25 fusions, evolving cannon stages, ultimate abilities and several utility icons use original filled **32-pixel artwork**. The icons have explicit multicolor palettes, dark outlines, shaded bodies and bright highlights. Fusions add a decorative frame; the existing item names, ranks, recipes, stats and icons-as-buttons behavior are preserved. Inventory, upgrade cards, the arsenal, starting loadouts and item details share the same sprites. Shared, Eren, Frieren, Megumi and Maomao tree illustrations also have brighter palettes.

Four new cosmetic companions join the pet picker: **Pikachu**, **Mini Totoro**, **Happy** and **Kero**. Each has animated pixel art and saves with the profile and active run. They provide no combat, collection or stat bonuses. There are ten decorative companions plus the No Companion option.

Five bosses gain periodic ultimates after an opening grace period:

- **Frieza — Supernova:** a growing sphere drops onto a locked, warned impact circle.
- **Sukuna — Malevolent Shrine: World Cut:** parallel, staggered slash lanes leave dodge gaps.
- **Aura — Soul Balance: Execution:** paired seals activate before a narrow execution cut.
- **Mother Brain — Rainbow Hyper Beam:** one broad prismatic mouth beam fires along a fixed warned lane, unlocked after the tank breaks.
- **Bertholdt — Colossal Steam Cataclysm:** a ring of steam vents leaves an escape corridor, followed by a marked footfall; available only in Titan form.

Boss ultimates have named charge bars and themed visuals, warnings of at least two seconds, and separate 26–30 second cooldowns. Bosses take turns using them, preserving readable large attack patterns. Charging suppresses normal attacks. Pausing, time stop, control effects and clock-domain slow affect the charge and warning timers together; saved runs retain the attack state. Defeating the source cancels its remaining ultimate hazards and still grants the usual single guaranteed chest. Reduced motion keeps the warning geometry and charge information while removing decorative movement.


## Thunder Spears, Longinus and Titan variety

Evolved **ODM Blades + Key of Freedom** now become **Thunder Spears**. Two compact explosive spears launch with a short stagger, attach briefly to an enemy or scenery, then explode after a 0.32-second fuse. Blasts stun, inflict bleeding, knock enemies back and break nearby supplies. Missed spears still detonate when their lifetime expires.

Evolved **Pallet Rifle + AT Field** now become the **Spear of Longinus**. The slender crimson spear pierces enemies and breakable scenery, inflicts curse and a brief stun, then returns toward the player. An enemy can be struck once outbound and once on return, with the return dealing 55% damage. Both new evolutions use a slower 1.8-second base attack cadence before rank, equipment and mastery modifiers. Their old internal fusion IDs remain intact, preserving existing saved ranks, equipment, form banks and unlocked evolutions. Active projectiles and attached fuses checkpoint normally. EVA units visibly carry Longinus; human Eren carries Thunder Spears after evolving. Berserk and Titan form still use their appropriate poses.

Four evolution icons now have their own silhouettes: paired green **Thunder Spears**, forked crimson **Longinus**, an **Ancient Magic** spell seal and a **Totality** wolf. Eren, Frieren and Zero Suit Samus have lower, layered fringes; Goku has extra temple locks to reduce exposed forehead space while preserving expressions and outfit choices.

Breakables now have individual scale and floor-collision profiles, with most baskets, jars and cases smaller than a hero. Scout Ration Chests, twin ODM Gas Cylinders, District/Powder Barrels, Missile Caches, Tea Jars and Royal Coffers have new pixel art. Other supplies, including teacups, capsules, mushrooms and logs, use proportionate sizes. Old saved objects receive the new dimensions without losing positions, damage or destruction state. The 60% drop chance and one-time destruction rewards are unchanged.

Shiganshina now fields six normal Titan designs: Wandering, Running Abnormal, **Smiling**, **Bearded**, **Crawling** and **Small Abnormal**. The Smiling Titan has blonde curtain hair and a fixed grin, with delayed grasp-and-bite marks. The Bearded Titan braces with temporary armor before a devouring lane. The Crawling Titan has a low, four-limbed silhouette, a pounce lane and a marked landing. The Small Abnormal uses short bounding steps and staggered ankle grabs. Advanced variants unlock across waves two and three; Annie can summon Smiling Titans in later scream rotations. All have bestiary descriptions and individual movement cycles.


## Star Rage, armored Eren and three-stage Cell

**Yuki Tsukumo** is the thirteenth hero. She begins with **Garuda**, an ivory skeletal shikigami projectile that pierces and knocks back, and **Virtual Mass**, which grants 6% damage and 10 HP per rank. Her unique **Star Rage** gains 12 per Garuda hit and 5 per kill, increased by 10% per Virtual Mass rank and by mastery. At 100, Yuki enters **Maximum Mass** for eight seconds: +50% damage, 20% incoming damage resistance, +35% Garuda impact area, stronger knockback and mass shockwaves. Charge stops while active. Max Garuda and Virtual Mass to evolve **Garuda: Star Crusher**, whose strikes produce area explosions. Her **Maximum: Black Hole** ultimate creates a fixed five-second singularity: pulls nearby enemies, consumes shots near the core, repeatedly crushes targets and ends with a powerful collapse. Bosses resist its pull. It fills Star Rage and uses the normal 60-second base cooldown. Original pixel art, ivory-and-blue equipment icons, six unique mastery illustrations and Star Rage / High Collar outfits are included; profile XP, skin and active mass state persist.

**Armored Attack Titan** has visible crystalline plates on fists, chest and shins, stronger punches, improved reach and impact radius. The 45-point shield recharges every eight active seconds. Eren’s ODM Blades and Titan Fists now share upgrades and evolution status; both recipes still require max Key of Freedom. Switching to human removes the Titan shield and resistance, preserving HP and shared progression.

**Cell** now begins as **Imperfect Cell** with life-draining soul volleys and a warned needle-tail strike. Below two-thirds HP, **Semi-Perfect Cell** uses explosive ki fans, armored stomps and defensive rings. Below one-third HP, **Perfect Cell** uses Solar Flare, Kamehameha, Cell Juniors and interrupted regeneration. Each form has original animated pixel art and a transformation cinematic. One health pool and damage gates prevent even an overwhelming strike from skipping a body. Existing wave/time scaling survives both transformations. Only Perfect Cell’s final defeat awards one guaranteed chest. Boss stage, pending cinematics and chest decisions checkpoint normally; old already-awarded chest snapshots migrate as resolved to prevent duplicate grants.


## Yuki references and the JoJo expansion

Yuki’s sprites now follow the supplied clothing references. Her default **Star Rage · Red Trousers** outfit has long straight blonde hair, a sleeveless navy high-neck crop top, loose red trousers and black boots. **High Collar · Blue Trousers** has a full dark sleeveless top, gold collar fasteners, a high waistband, blue-gray trousers and brown boots. The old `default` / `midnight` skin IDs remain compatible with saved choices. Both outfits have distinct silhouettes, walking/casting frames and small expressive eyes.

**Garuda** has been redrawn as a skeletal, segmented shikigami: ivory vertebrae, blue-gray blade spikes, a long pointed snout and red eye. Its orbiting body, animated attack flight and equipment/evolution icons share this silhouette. Reduced motion holds its flight pose steady. Star Rage, poison/status compatibility and damage behavior are preserved.

**Diavolo** is the fourteenth playable hero, with original pixel art and a **Vinegar Doppio** appearance. **King Crimson** strikes a short facing cone, briefly stunning and knocking enemies back. Weapon ranks improve its damage and reach. **Epitaph** grants 6% weapon damage and 4% dodge per passive rank. Max both to evolve **King Crimson: Fatal Forecast**, adding a delayed echo at 55% of the initial strike’s strength; the echo curses targets. Delayed strikes save with the run.

Diavolo’s **Fate** meter gains 18 on a landed signature strike and 8 per kill, increased by 10% per Epitaph rank and by mastery. At 100, Epitaph automatically negates a direct hit and gives a three-second window for a King Crimson counter at +65% damage. Damage over time bypasses prediction. Out-of-reach targets and scenery do not consume the predicted counter. **Time Erasure** grants five seconds of damage immunity and 20% extra movement, while enemies continue their committed actions and automatic weapon casts pause. Time returns with a broad Stand barrage at the player’s new location. It has the usual 60-second base cooldown. Six distinct mastery skills improve strikes, Fate gain, cadence, starting rank, erasure duration and finishing damage. Progress, Doppio appearance, counter windows and active erasure persist.

Five JoJo foes appear in themed existing map pools, joining the bestiary:

- **Stone Mask Vampire:** draining shots heal only when they land.
- **Flesh-Bud Thrall:** staggered poison tentacle marks leave room to escape.
- **Bad Company Soldier:** miniature rifle fans and a delayed artillery impact.
- **Highway Star:** curving drain shots and slowing scent trails.
- **Sheer Heart Attack:** armored charge-up followed by a warned explosion.

Three bosses join every map’s eventual rotation, preserving each map’s original opening boss:

- **DIO — The World:** fixed knife lanes release after long warnings, followed by a Stand rush and Road Roller impacts. Castle wave 10 is an early encounter.
- **Yoshikage Kira — Killer Queen:** staggered bombs, bounded Sheer Heart Attack summons and Bites the Dust blasts that remember an earlier location. Castle and Moon wave 15 are early encounters.
- **Kars — Ultimate Life Form:** bone-blade rushes, curving razor feathers and light spokes. His second phase unfolds wings, adds feather rings and summons vampire servants. Forest wave 10 and Ruins wave 15 are early encounters.

All eight threats have distinct animated pixel sprites, readable attack explanations, scaling difficulty and searchable JoJo entries in the bestiary. Each boss grants one guaranteed final chest. JoJo warning hazards cancel when their source dies; bomb memories and warning timers survive checkpoints. The roster contains 16 heroes, 52 regular enemy types and 25 bosses, with 216 illustrated skill-tree nodes.


## Orbiting Garuda, new faces and anime battlegrounds

**Garuda orbits Yuki until she attacks, then physically leaves her side.** The orbiting body is hidden during flight, so there is always exactly one visible Garuda. It ricochets through **5 / 6 / 7 / 8 / 9 different nearby enemies** at weapon ranks 1–5; **Star Crusher adds three more targets**, for up to twelve. This includes three additional base ricochets at every rank, with extra flight time for those bounces. Ranks also improve damage, speed, bounce reach and flight time. Garuda flies back after exhausting its hits or finding no nearby victim; Yuki cannot launch it again until it returns. Prior victims are remembered for the entire flight, preventing repeated strikes on isolated enemies. It stays within the visible companion boundary, retargets dead victims, damages scenery and retains Star Rage and empowered impacts. Timeouts enter a bounded return flight. Orbit phase, physical flight position, remaining ricochets and previous hits save normally. Legacy overlapping projections reconcile to one physical flight, retaining their victim histories. Reduced motion uses a calm idle offset while essential attack travel remains visible; pauses freeze simulation. Other heroes can still acquire Garuda as a shared weapon.

**Diavolo and Doppio** have another full redraw: prominent spotted pink hair, lowered fringes, small sharp green eyes, a fitted purple mesh outfit and plum trousers for Diavolo; shorter parted hair with round side curls, lilac cropped sweater and tan trousers for Doppio. **King Crimson** is now substantially larger than its user, with red armored muscles, pale cross lattice and an Epitaph brow. Its attack visibly lunges with a physical forward multi-fist barrage and impact spikes. Evolution echoes are translucent; Time Erasure ends in an eight-direction visual barrage matching its broad damage area. Existing Fate, counter and evolution mechanics and saved skin IDs are preserved.

**Goku** has a compact angular face, bold tapered brows, small pupils within readable anime eye whites, layered temple bangs and a recognizable spiked crown. His orange-and-blue gi, movement, hurt/blink/casting and Spirit Bomb poses have been redrawn. All Saiyan stages retain the new face; SS3 has its longer mane and Blue has the matching blue palette. Existing Super Saiyan skin choices continue working.

Three battlegrounds append after the original ten, preserving existing map identities:

| Map | Scenery and breakables | Opening bosses |
| --- | --- | --- |
| **Hidden Leaf Village** | Clay streets, green-roof gateway, red-roof homes and Hokage stones; ramen crate, kunai rack and training dummy | Orochimaru, then Itachi |
| **Tournament of Power** | Cracked arena slabs, ring markings and broken floating-styled columns; arena chest, energy vessel and rubble. No river or hidden arena edge. | Frieza, then Cell |
| **Tempest Outskirts** | Teal woodland, timber huts, blue magic crystals and slime-marked gateway; camp crate, crystal and mushroom cluster | Kars, then Aura |

Each map has its own preview, encounter pool, complete later boss rotation, deterministic scenery, matching physics and three probabilistic breakables. Leaf and Tempest retain traversable bridges across their visible rivers. Map selection, destroyed objects and active worlds save normally.

## Rimuru Tempest

**Rimuru** is the fifteenth playable hero, with **Tempest Traveler** and **Demon Lord** outfits, original blue-haired/gold-eyed pixel art, and a distinct animated blue slime form. He starts with **Black Flame**, homing bolts that cause burning impact explosions; ranks add bolts, damage and area. **Great Sage** grants 5% weapon damage and 6% pickup range per rank, plus 10% extra Predation essence for Rimuru. Max both to evolve **Beelzebub: Soul Devourer**: additional homing flames with cursed blasts that pull nearby enemies inward.

**Predation** grants 10 essence per ordinary kill, 25 per elite and 50 per boss, before passive/mastery bonuses. Every 100 essence adds a permanent adaptation for the current run: **+4% damage and 2% damage resistance**, capped at five adaptations. Excess essence can unlock multiple stages; the cap is explicit in the HUD. **Gluttony** transforms Rimuru into a slime for five seconds, follows his movement, pulls nearby enemies, absorbs hostile shots for essence and repeatedly damages foes. Ordinary enemies already below 20% HP are devoured; bosses cannot be executed. Consumed enemies can restore at most 30 HP per activation. It uses the normal 60-second base ultimate cooldown. Six illustrated mastery nodes improve flame damage/cadence, essence gain, starting rank, slime duration and ultimate damage. Appearance, XP, skills, adaptations, homing projectiles and active Gluttony checkpoint normally.


## Boss resistance and the latest character references

All **bosses resist 20% of incoming player damage**, including weapons, summons, ultimate attacks and damaging status ticks. This applies to active bosses restored from older checkpoints as well as newly spawned bosses. Curse and temporary armor still multiply with the resistance, and displayed damage numbers show the final result. It does not compound after save/reload. Cell’s protected transformation thresholds and the one final guaranteed chest are retained. The bestiary and pause help explain this defense.

Goku has been redrawn again from the supplied references: friendly open anime eyes with small dark pupils, broader cheeks, a visible grin, a long central lock beneath asymmetric black spikes, muscular sleeveless arms, an orange wrap gi over blue cloth, a trailing blue sash and blue boots with red piping. Focused attacks change his expression; all Saiyan stages, the Super Saiyan skin, blinks/hurt frames and Spirit Bomb gather/throw poses retain their own animation.

Kurumi now has four fully drawn outfits using the supplied references:

- **Astral Dress:** red-and-black corset and layered skirt, asymmetric twin tails, red eye and visible gold clock eye.
- **Gothic White · Eyepatch:** completely redrawn from the black-and-white reference, with a fitted black buttoned corset, puffed white blouse, split velvet overskirt, three scalloped white petticoat tiers, black stockings and heeled shoes. Loose flowing hair carries red roses; the idle raised musket levels into a separate firing pose. Her small white left-eye patch (viewer-right) sits beneath the fringe, leaving only a subtle white edge visible through movement, blinks, hurt and attack frames.
- **Midnight Rose:** a long black Victorian gown, purple roses, red ribbons, draped hair covering the left eye and an idle rose handbag.
- **School Uniform:** a white-piped black blazer, red neck ribbon, purple pleated skirt, dark stockings and loafers, with long ribboned hair.

Each outfit has independent clothing/hair motion and visible flintlock attack poses. Existing `default`, `gothic` and `crimson` save IDs are preserved; the new uniform uses `school`. Choices continue to save automatically and cosmetics retain identical combat stats.

## Boss Rush and phase previews

Choose **Boss Rush** in the lobby for a finite gauntlet through all **25 bosses**, in the selected map's boss order. Start directly in the selected arena with your character’s signature equipment maxed. Each level offers **three random max-level upgrades**, using the familiar level-up cards. Pick one reward per level until all **five LV 5 weapons and five LV 3 passives** are filled. Reroll and Ban use the same run charges. Then evolve any ready weapons or keep them unevolved; all recipe requirements apply, including Red + Blue + Six Eyes for Hollow Purple. A fusion that frees a slot grants another random maxed upgrade. Eren’s two form weapons share their max level and evolution. Combat starts when you choose **Begin Boss Rush**.

Only one boss fights at a time. Regular enemies, elites and boss-summoned adds are disabled in this mode; boss projectiles, hazards, transformations and ultimates remain active. Boss HP starts at 5 times its base value and gains another 0.9 times base per defeated boss, before time and difficulty scaling. Boss Rush also increases damage and attack pace with each round. The usual 20% damage resistance applies. Phase thresholds stop overkill so every boss enters its second phase, and Cell retains all three bodies. Boss rewards appear at the player: take or ignore each chest reward before the next fight. Available evolutions are guaranteed first, as in Survival. A two-second break separates encounters, and the next arrival restores 10% of maximum HP. Clearing the last boss and resolving its chest wins the gauntlet. In-run XP does not open level-up screens; earned coins and character XP still bank normally.

Mode choice, preparation selections, completed fusions, active boss phases and gauntlet progress save in the browser. **Continue Saved Run** reopens unfinished preparation directly or resumes combat paused. Survival retains its original starting levels and timed hordes.

Every boss bestiary entry now has an expandable **CHECK PHASES** guide with actual form sprites, HP thresholds and attack descriptions. Cell shows its three stages; Annie, Reiner, Bertholdt and Mother Brain show their opening and transformed bodies. Phase names and attacks are searchable, including Female Titan, Colossal Titan, Walking Form and Segunda Etapa.

**Aura** has curved ivory horns, pink bobbed hair and braids, an ornate navy-and-white bodice, a flowing magenta overskirt and visible golden balance scales. **Bertholdt** has a new cadet uniform, short dark hair and harness gear; his separate **Colossal Titan** body has exposed red muscle bands, ribs, teeth and animated steam. **Samus's Varia Suit** now has round orange shoulder armor, a red crested helmet, cyan visor, articulated gold torso, dark joints, armored boots and a ribbed green arm cannon, with moving, firing, hurt and Morph Ball poses. Gravity uses the new armor geometry; Fusion and suitless skins retain their own designs.

## A consistent enemy roster

All **52 enemies and 25 bosses** now share Aura and Bertholdt's pixel-art style. The other 75 designs have new silhouettes and anatomy, compact faces, shaded clothing, articulated limbs, detailed weapons and clear creature features. Human factions have distinct uniforms and equipment; curses, familiars, insects, Titans and Metroid creatures retain their own body shapes. The original Aura and Bertholdt designs remain the visual references.

The redraw includes all boss phase previews and transformed bodies: Annie's Female Titan, Reiner's Armored Titan, Mother Brain's tank and walking body, all three Cell stages, Ulquiorra's releases, Itachi's Susanoo and Kars's wings. Their native 56 × 76 pixel frames drive combat, boss entrances and the bestiary. Existing movement cycles, attack poses, enrage details and reduced-motion rendering use the new artwork throughout.


## Difficulty, expanded mastery and the Witch of Theatergoing

Choose **Easy**, **Normal**, **Hard** or **Nightmare** in the lobby for either mode. Presets change enemy health, damage, movement, attack rate, projectile speed and Survival spawn rate. The choice saves with the profile and active run; old saves default to Normal. Boss Rush round scaling applies on top of the selected difficulty. Draft rewards, rerolls, bans, levels and completed fusions survive reloading without redrawing cached offers.

**Featherine Augustus Aurora** joins the roster with two original pixel outfits based on the supplied references: **Witch of Theatergoing**, a pink gown with green stole, memory halo and staff; and **Miko of Fragments**, green-and-white robes with flowing pink sleeves and red hakama. Skin choices save normally. **Author’s Quill** fires homing, piercing cursed ink. **Memory Fragment** adds 5% weapon damage and area per rank, plus 10% Authority gain for Featherine. Max both for **Final Chapter: Red Truth**, which adds quills and red-and-gold impact glyphs with cursed, slowing splash damage.

**Narrative Authority** gains 8 per quill hit, 6 per ordinary kill, 12 per elite and 24 per boss, before passive and mastery bonuses. At 100, the next quill volley consumes it for a **Revision**: 60% extra damage, an additional quill, two extra pierces and Red Truth impacts. **The Last Page** opens a fixed five-second author’s stage that curses and slows enemies, erases nearby hostile shots and closes with a crimson final sentence. It uses the usual one-minute base cooldown and preserves boss damage resistance. Featherine has her own twelve-node mastery tree and colored item and skill illustrations.

**Yuki’s Maximum: Black Hole** now compresses mass for **two active seconds** before release. During charge there is no black-hole damage, pull or projectile absorption. A countdown and distinct charge pose show the release timing. The five-second active field has a black core, bright accretion rim, dense manga-inspired radial ink, a golden lensing line, warped rings and orbiting rubble. It stays where cast, pulls bosses less strongly and ends in a final collapse. Pausing and boss entrances freeze the charge; checkpoints restore the exact phase. Reduced motion keeps the effect readable with quieter movement.


## Mobile skill trees and signature expansion

**Skill Trees** uses the original broad hexagonal branching structure on every screen, with diagonal forks and joins. On phones it opens full-screen at a readable 85% zoom. Drag from the background or any skill to pan in both directions with touch momentum, use a wheel or trackpad to scroll, and pinch or use +/− to zoom. **WIDTH** fits the tree horizontally and **ALL** shows the whole tree. Visible scrollbars and direction indicators help locate the remaining branches. The selected-skill strip sits below the graph; tap **Details & training** to expand it without covering any branches. The close button stays at the top, and **⋯** opens save/export/import and help. Purchases preserve selection, zoom, pan and the details panel state. Narrow screens, short browser views and landscape layouts are supported.

Four new thematic recipes join the arsenal:

| Fusion | Required maxed ingredients | Result |
| --- | --- | --- |
| Chimera Shadow Garden | Divine Dogs LV 5 + Nue LV 5 + Shadow Talisman LV 3 | Consumes Nue’s active slot; summons empowered dogs and chain-lightning Nue from one weapon and lays a cursed, slowing shadow garden. |
| Flying Raijin: Rasen Flash | Wind Shuriken LV 5 + Flying Kunai LV 5 + Sage Scroll LV 3 | Consumes Kunai’s slot; a marked knife flashes among distinct nearby targets with wind blasts, bleeding and brief stun. |
| Panacea Pouch | Medicinal Herbs LV 3 + Senzu Bean LV 3 | Combines both passives into Herbs’ slot, retaining both bonuses and adding 1 HP/s regeneration and 25% restorative healing. |
| Adaptive Barrier | Energy Tank LV 3 + AT Field LV 3 | Combines both passives into Energy Tank’s slot, retaining both bonuses and adding 20 shield with a seven-second recharge. |

Absorbed passives still satisfy weapon recipes: Panacea Pouch can unlock Super Kamehameha and Adaptive Barrier can unlock Longinus. Absorbed items leave the current run’s upgrade pool. All new fusions have colored pixel icons and use the normal guaranteed-priority chest choices. Boss Rush prompts another random max-level pick whenever either kind of fusion frees a slot. Fusion state and active attack state survive checkpoints.

**Frieren’s Ancient Stone Golem** replaces Height of Magic. The ten-second guardian assembles from cracked stone blocks, stays within the companion boundary, alternates a warned heavy area punch with a charged violet mouth beam, and disappears when the ultimate ends. Mastery improves its damage and duration; old purchased mastery IDs are preserved. The golem has distinct formation, windup, punch, charge and beam poses, with its own special icon.

New boss ultimates use warned, avoidable patterns and retain boss resistance, difficulty scaling, phases and guaranteed chests:

- **Itachi — Tsukuyomi: Crow Prison:** slowing illusion seals surround the locked position with an open escape corridor, followed by a cursed central eye. The illusions are hazards and grant no kills.
- **Ulquiorra — Cero: Emerald Despair:** a bright green charge leads into a fixed-aim narrow beam. Segunda Etapa adds two delayed fork beams with their own warnings.
- **DIO — The World: Knife Hour:** two perpendicular knife volleys release one second apart, followed by a Road Roller at the original center.
- **Kraid — Brinstar: Spike Gauntlet:** three rows of belly spikes leave alternating escape gaps before a final stamp.

Their warning and attack state pauses and checkpoints normally, disappears when its source dies, and appears in the searchable bestiary. Boss Rush gains no regular adds.

**Hollow Purple** has a new red/blue convergence, layered violet sphere with a pale hot core, dark outline, curved red/blue wake and broken impact rings; its collision radius is unchanged. **Featherine’s memory device** now has a concealed rear band with two tapered white/silver crescents emerging beside her hair and curving forward along both cheeks. The crown stays clear in both outfits. Miko of Fragments now has a floor-length crimson wrap skirt with a diagonal overlapping panel, deep folds and an asymmetrical hem, plus a full-height wooden staff with a forked silver crescent that remains visible while casting and using her ultimate.

Four new cosmetic outfits share their heroes’ existing combat and mastery:

- **Naruto — Seventh Hokage:** cropped blond hair, orange jacket and a white flame-hem cloak.
- **Madoka — Mitakihara School Uniform:** cream school blouse, red ribbons and a red plaid skirt.
- **Esdeath — Winter Knit:** cream ribbed sweater, dark collar and tie, black pleated skirt, dark stockings and brown boots.
- **Esdeath — Midnight Lace:** black long-sleeve dress with laced sleeves, dark tights and a low pale-blue ponytail.

Each has separate walking, casting, hurt and blink frames, uses the same artwork in the lobby and battle, and saves with the profile and active run.


## Character profiles, prestige and ODM attacks

Each selected character profile now shows the current **ultimate ability’s name, colored icon, full description, base 60-second cooldown and activation controls**. This includes Frieren’s Ancient Stone Golem and Yuki’s delayed Black Hole. Mastery can shorten the actual in-run cooldown.

**Character prestige** unlocks once every rank of that hero’s twelve mastery skills is trained. Open **PRESTIGE** from the profile or character tree to review the rewards and reset details, then confirm or return without changes. Each rank adds **+5% weapon damage, +10 max HP and +10% character XP** for that hero, up to **prestige 10**. The bonuses stack with shared and future mastery upgrades. Prestige resets only that hero’s purchased mastery ranks and unspent character XP. Coins, shared skills, other heroes, skins, pets, lifetime XP, mastery level and earlier prestige ranks remain. Bonuses apply to new runs; active checkpoints keep their existing stats and remain playable. The reward ledger is retained so an old run cannot repay already banked rewards. Prestige saves and exports with the profile, and old saves begin at prestige zero.

**ODM Gear** has a staged grapple-and-crosscut animation: paired hooks fire out, steel cables tighten, gas jets burst from the hip housings, two segmented blades cross through the existing damage cone, and the cables retract. Successive attacks alternate their lead side. Damage, bleed, reach, scenery hits and player position retain the existing mechanics; the evolved Thunder Spears keep their distinct attack. Reduced motion calms secondary effects while preserving the essential grapple and blade movement. Pauses freeze the animation.

## Hardcore, casual outfits and Erza Scarlet

**Hardcore** is a third lobby mode alongside Survival and Boss Rush. It uses Survival’s timed waves and bosses, with the selected difficulty, while limiting equipment to the chosen hero’s signature weapons and starting passive. Main weapons and the character’s own starting passive can still level and unlock matching evolutions. Other characters’ passives and two-passive fusions are unavailable in Hardcore. Gojo keeps Blue + Red and can awaken Hollow Purple, Megumi keeps Divine Dogs + Nue and their combined evolution, and Eren keeps both linked form weapons. Foreign weapons and passives are excluded from level-ups, rerolls, chests, direct grants and evolutions. Existing Hardcore checkpoints shed foreign gear and its bonuses when resumed. A completed build receives recovery rewards. Hardcore selection, rewards and active runs save normally; retry preserves the mode.

Every one of the **17 heroes** now has a new **casual outfit**, with original clothing artwork and moving, attacking and expression frames. These include Goku’s Capsule Weekend jacket, Gojo’s Summer Shades, Naruto’s Ichiraku Day Off, Madoka’s Rose Sunday, Maomao’s Market Day, Shinji’s After School, Esdeath’s City Stroll, Kurumi’s Crimson Café, Frieren’s Quiet Journey, Samus’s Off-Duty Hunter, Megumi’s Tokyo Weekend, Eren’s Shiganshina Days, Yuki’s Road Trip, Diavolo’s Passione Leisure, Rimuru’s Tempest Hoodie, Featherine’s Reading Room and Erza’s Fairy Tail Day Off. They retain the same stats and mechanics and save with each character. Titan, slime and Morph Ball transformations retain their distinct bodies.

**Erza Scarlet — Titania** joins from Fairy Tail with three manually switchable Requip armors. Press **R** or tap **REQUIP** to cycle through them. Switching has a three-second active cooldown, reduced by mastery; it pauses with the game and cannot interrupt immobilization, a dash or an ultimate.

| Armor | Signature attack | Tradeoff |
| --- | --- | --- |
| Heaven’s Wheel | Multiple physical piercing swords | Balanced movement and defense; fights at range. |
| Black Wing | Fast nearby cleaves that cause bleeding | +22% movement, but takes 8% more damage. |
| Adamantine | Heavy shield bashes that stun and knock back | 30% damage resistance and a separate 30-point barrier, but 18% slower movement. |

Adamantine’s reserve persists across switches and recharges after eight active seconds spent in that armor. Switching never heals Erza or refills it. All forms share the same **Requip Sword** level, cooldown and evolution. **Heart Kreuz Emblem** adds 4% weapon damage and eight rechargeable shield per rank. Max both for **Requip: Heaven’s Arsenal**, improving the swords, bleeding cleaves and stunning shield impacts. Borrowed Requip Swords use Heaven’s Wheel.

Her ultimate, **Nakagami: Divine Severance**, channels for 0.9 seconds before seven golden spatial cuts resolve at fixed marked locations. The cuts damage and briefly stun foes, break nearby scenery and clear hostile shots within their impact areas. Erza has twelve illustrated mastery skills, prestige support, a casual skin and distinct armor, attack and ultimate frames. Armor, switching cooldown, spent barrier, sword hit history and partially resolved ultimate cuts survive checkpoints. The roster now has **17 heroes and 228 total skill nodes**.

Erza’s separate lower-left armor status panel has been removed. Her Requip button, keyboard switching, armor artwork and gameplay mechanics remain available. Hardcore’s inventory shows only the hero’s signature equipment, without empty extra slots.


## Pajamas, anime keepsakes and signature entrances

All **17 characters** now have a **Pajamas** outfit in the appearance picker, with original sleepwear, patterns and slippers: dragon-cloud pajamas, a sleepy fox onesie, rose-ribbon nightdress, herb robe, penguin sleep set, snowflake nightgown, clock pajamas, elven nightshirt, galactic sleep set, Divine Dog pajamas, Dreams of Freedom, Star Rage sleepwear, Crimson Dream Robe, slime onesie, a witch’s bedtime robe and strawberry knight pajamas. They retain normal combat stats, expressions, walking and attack animation. Goku’s hair stages, Titan/slime/Morph Ball bodies and Erza’s form cues remain available. Shinji’s pilot wears the penguin sleep set alongside a matching EVA-01 design. Skin choices save as usual.

**Trinkets** are separate enemy-drop keepsakes with **three slots per run**. Ordinary enemies have a 1.5% drop chance, elites 12% and bosses 35%; the first boss guarantees one when there is room among the eight possible ground drops. Equipped items can drop again until fully refined; pending and ground items never duplicate one another. Walk over a dropped trinket to compare it, choose an empty slot, replace an existing trinket or leave it. Collect a second copy of an equipped trinket to choose **REFINE TO +1**, then +2 and **+3**. Each refinement improves its effect without using another slot. The Dragon Ball is the exception: it allows seven refinements and summons Shenron at +7. The choice shows the current and next effect; the HUD displays the refinement level. Fully refined trinkets stop dropping. Replacing or removing discards the old item and its refinements. Combat pauses during the choice. Inspect or remove equipped trinkets through the three HUD slots, and browse all twenty keepsakes and three event items in **Arsenal → Trinkets**. Each new run begins empty; equipped items, refinement levels, ground finds, cosmetic counters and pending choices persist in the run checkpoint. Older checkpoints start their equipped trinkets at base strength. Hardcore’s own-weapon/passive rule remains intact because these are separate slots.

| Keepsake | Base effect | Fully refined |
| --- | --- | --- |
| Ichiraku Bowl Charm | Food restores 10% more HP. | 25% more HP. |
| Dragon Ball | Gain 5% more coins. | 22.5% more coins at +7; summon Shenron for one wish. |
| Leaf Village Keychain | 8% more XP pickup range. | 20% more range. |
| Scout’s Red Scarf | Move 3% faster. | Move 7.5% faster. |
| Three-Color Dango Box | Restore 1 HP per ten defeated enemies. | 2.5 HP per ten. |
| Lucky Cat Bell | A harmless “MEW!” every twenty defeated enemies. | Every eight defeated enemies. |
| Hope Ribbon | Food releases three pink hearts. | Nine pink hearts. |
| Straw Hat Pin | Swift Boots last two seconds longer. | Five seconds longer. |
| Pen Pen Plush | Three blue footprints while walking. | Six blue footprints. |
| Capsule Corp Button | Energy pickups remove one extra second of ultimate cooldown. | 2.5 extra seconds. |
| Witch’s Bookmark | A reading thought every thirty active seconds. | Every fifteen seconds. |
| Fairy Tail Guild Stamp | Three red guild sparkles on ultimate activation. | Nine red guild sparkles. |
| Flamel Lapel Pin | 3% more coins. | 7.5% more coins. |
| Pocket Hunter License | 6% more XP pickup range. | 15% more range. |
| Wisteria Wind Bell | Swift Boots last one second longer. | 2.5 seconds longer. |
| Substitute Spirit Badge | Energy pickups remove 0.5 extra seconds of ultimate cooldown. | 1.25 extra seconds. |
| Red Thread Paper Crane | Food releases two folded cranes. | Five folded cranes. |
| Pochita Pull-Cord Charm | A harmless “VROOM!” every twelve defeated enemies. | Every six defeated enemies. |
| Moonlight Compact | Four moonlit sparkles on ultimate activation. | Ten sparkles. |
| Bebop Mixtape | Two musical notes every twenty-four active seconds. | Five notes every twelve seconds. |

Stat bonuses gain half their base effect per refinement, with no changes to character progression. Cosmetic trinkets remain playful visual effects. Refinements last for the current run.


## Weather and world events

Clear skies, rain and snow cycle during active play. **Survival and Hardcore** also feature themed events on the current map: **The Eclipse** brings Apostles and **Femto · Eclipse Incarnation** beneath a black sun; **Raigo Thunderstorm** brings Storm Wraiths, raiders and **Enel · Raigo**; **Whiteout Blizzard** brings Frost Walkers, northern troops and **Aokiji · Whiteout**. Each boss has unique warned attacks and a stronger second phase. Weather itself deals no damage. Natural events become eligible after two active minutes, then four minutes after the previous event clears, waiting for other boss and rift encounters. Boss Rush excludes weather and world events.

Enemies can drop a **Crimson Beherit**, **Raigo Thunder Drum** or **Whiteout Frost Seal** to summon the matching event. Store one in any of the same three trinket slots, then open its slot and choose **USE EVENT ITEM** when ready. Picking it up never starts the event. These items grant no passive bonuses and cannot be refined; they are consumed only when an event successfully begins. A blocked activation preserves the item. Stored items, weather, active encounters and their rewards save with the run.

Ordinary wave spawning waits while an event is active. Each event starts with its boss and four themed enemies, with finite reinforcements up to twelve enemies total; new reinforcements stop when the boss dies. Clear the boss and all remaining event enemies to resume waves. The boss awards **60 character XP**; completing the event grants **300 coins, 120 collectible run XP and a three-reward cache**, with existing coin and mastery bonuses applied. Completion rewards are paid once across checkpoints.

Shinji’s **After School** and **Penguin Sleep Set** outfits now also change his EVA. The school unit has uniform-inspired armor and the sleep unit has penguin-themed panels and slippers. Each keeps its EVA silhouette, articulated movement, rifle, Longinus and berserk animations, while the paired pilot and HUD retain their matching human outfits. The original Shinji, Asuka, Rei and Mari units remain available. All appearances share Shinji’s progression and combat stats.

**Boss entrances** now have three staged beats, layered scene art, a signature-power title, a progress strip and an always-available skip button. Reiner’s Armored Titan opens its articulated jaw and roars through expanding shock rings, steam, debris and trembling walls. DIO reveals The World behind a clock and suspended knives while the battlefield desaturates and the clock hands stop. Itachi’s Sharingan, Ulquiorra’s Cero, Cell’s bio-evolution, Frieza’s star, ice, magma, thunder, ritual, mechanical and horror scenes give the remaining bosses their own identity. These are cinematic visions; they preserve the boss’s actual combat phase.

Every cinematic movement uses the saved intro age, so pausing or reloading resumes the same beat. Combat, survival time, cooldowns, status ticks and drops remain frozen. Queued entrances, transformations, keyboard/touch skipping, final invulnerability and reduced-motion support are preserved; DIO’s canvas filter clears when his scene ends.


## Summer outfits, tier lists and Shenron

Every hero has a selectable **swimsuit** skin with original themed swimwear, goggles, wraps or surf gear. The 17 outfits retain the same stats, progression, expressions, walking, attacks and transformations. Shinji wears **Ocean Unit Swim Team** gear beside a matching aquatic EVA with a snorkel, goggles and fins; its rifle, Longinus and berserk animations remain available. Selection saves per character.

Open **TIER LIST** from the lobby, **Arsenal → Tier Lists**, or **Pause → View Tier Lists**. Four searchable lists cover **17 characters, 47 weapons/evolutions, 22 passive items/fusions and 17 ultimates**. S–C rows show existing character and item artwork; select any entry for its ranking explanation, limitations and full kit or ability description. Item lists filter base items or evolutions/fusions. These are suggested current-balance rankings for Normal Survival at maximum item ranks before mastery/prestige, with fusions judged once acquired. Skin choices share ranks. The guide supports phone scrolling, keyboard category navigation and Escape to close; reading it during a run keeps combat paused, including while typing.

The **Dragon Ball** trinket retains its coin bonus and now accepts **seven duplicate refinements** rather than three. Its icon and name gain stars up to seven; its final duplicate shows **SUMMON SHENRON**. On the seventh refinement, Shenron appears above seven Dragon Balls and offers one wish per run:

- **Awaken My Weapon:** choose an evolution for an owned, unevolved weapon. Shenron bypasses level, passive and missing second-weapon requirements. An owned second weapon is consumed as in normal fusion; an already evolved second weapon is protected. Eren’s forms remain synchronized, and Hardcore keeps only the hero’s signature inventory.
- **Unlock My Potential:** distribute five random rank increases among owned, unmaxed weapons and passives. It grants the remaining available ranks if fewer than five remain; the option is unavailable when all owned gear is maxed. It never adds foreign equipment or exceeds rank caps.
- **Grant Me Strength:** gain **20% weapon damage, 10% movement speed, 20% maximum HP and 1 HP/s regeneration** for the remainder of the match. These bonuses survive equipment changes and checkpoints without compounding or changing the profile.

Combat remains frozen until the wish is granted. A pending summon, the chosen wish, seven-star refinement and lasting blessing survive run checkpoints. The once-per-run wish remains spent even if the Dragon Ball is removed and found again. Other trinkets retain their three-refinement limit.


## Beach and bath wardrobe

The appearance picker includes **24 additional outfits** for the nine female heroes and the female EVA pilots:

- Esdeath, Yuki, Samus and Erza each receive a new bikini plus a one-piece, sports suit or themed bathrobe.
- Frieren has a seashell frill swimsuit and elven hot-spring wrap; Featherine has a moonlit lotus swimsuit and theatergoing bath yukata. Their staffs and distinguishing accessories remain visible.
- Madoka, Maomao and Kurumi each receive a cute covered swim dress or one-piece and a separate themed bathrobe or wrap.
- **Rei, Asuka and Mari** each receive a swim-team outfit and bath wrap in Shinji’s appearance slot. Their paired **EVA-00, EVA-02 and EVA-08** have matching aquatic or robe-inspired armor, individual optics, color palettes and fin-shaped boots. HUD portraits show the selected pilot’s face, hair and glasses where applicable.

These outfits add original clothing shapes and patterns rather than replacing the earlier swimwear. All outfits retain expressions, walking and attack frames. Erza’s three armor cues, Samus’s Morph Ball, the EVA rifle, Longinus and berserk animations remain available. Selections survive profile and run saves and share the original character’s stats, skills, prestige and progression.


## Compact HUD, more keepsakes and ranking explanations

All visible hero charge and mechanic meters—including **Star Rage**, **Narrative Authority**, **Pilot Rage**, **Saiyan Ascension** and **Charge Cycle**—now sit in a single **top-left stack immediately below HP**. Equipment and status badges flow underneath, so longer labels do not overlap the inventory. Time, scores and boss health occupy separate space. Erza’s previously removed mechanic panel stays hidden; Requip remains available.

The on-screen zoom controls are removed. **Two-finger pinch, mouse wheel and +/− keyboard zoom** still work between 60% and 165%, including movement recovery after pinching. Camera state continues saving with the run.

There are now **20 trinkets**. The eight new keepsakes add modest coin, pickup-range, Swift Boots and energy bonuses, folded paper cranes, Pochita’s harmless engine sound caption, moonlight sparkles and a musical thought bubble. All refine through +3, with real effect or visual increases; the Dragon Ball retains its seven-refinement Shenron wish. Matching utility bonuses add together. New counters, pending finds and refinements checkpoint normally and freeze during combat interruptions.

All **103 tier entries** now explain their relative placement in more detail: what the item or hero does well, why that earns its tier compared with alternatives, what limits it and which playstyle or companions suit it. Category-specific criteria and tier meanings clarify the judgments. Longer notes stay readable inside the scrollable guide, with a return-to-entries control. These are suggested Normal Survival placements at max item rank before mastery/prestige, rather than measured DPS benchmarks.

## Modern Tokyo and Shibuya Incident

**Modern Tokyo** and **Shibuya Incident** append to the existing map list without changing earlier map identities. Each has original urban terrain, a distinct lobby preview, themed landmarks, three differently sized breakable supplies and matching enemy pools. City roads and crossings stay traversable, and both maps support Survival, Hardcore, Boss Rush and run checkpoints.


## Calamity rifts and living treasure

In **Survival and Hardcore**, an optional **Calamity Rift** can appear after three active minutes, then five minutes after a portal is declined, expires or a challenge is cleared. A portal remains for 75 active seconds; approach it to inspect its boss and choose **Enter the Rift** or **Leave It Be**. Rifts wait for existing bosses and chests to clear. A direction marker points to an offscreen portal or active rift boss. Boss Rush keeps its regular 25-boss gauntlet.

Three new, much stronger bosses rotate through these rifts:

- **Founding Titan Eren:** The Rumbling creates Titan march lanes, Founding Rib Cage surrounds the old target position with an open escape side, and colossal footsteps follow the last movement direction.
- **Beerus / Bills:** Hakai erasure seals, fixed-aim afterimage strikes and a huge Sphere of Destruction with a broken halo of detonations.
- **Walpurgisnacht · Night of Calamity:** Stage Collapse leaves alternating openings, Witch’s Clock creates an escape arc before its final curtain, and Falling City drops building-sized impacts.

Each has original animated pixel art, a themed entrance, warned attacks and a denser second phase below 50% HP. Overkill cannot skip the phase. Normal enemies and their attacks pause during the isolated challenge and return after victory, with a grace period and no backlog of ordinary bosses. Pausing and reloading preserve the encounter and warnings.

A victory grants **900+ coins, 250+ collectible run XP, 150 character XP, 35% maximum-HP recovery and a five-reward relic chest**. Coins and run XP increase with later clears; existing coin and mastery bonuses apply. Ready evolutions take priority, and each reward remains optional. Rewards and completed rifts checkpoint without paying twice.

Chests now have detailed lacquered panels, metal bands and a soul crystal, with separate cyan/violet rift relic and sealed reclaimed-mimic designs. Opening one plays a **skippable 1.2-second seal, lid and light animation** before revealing the item. The animation plays once per chest, resumes safely after a checkpoint and reveals immediately with reduced motion.

Every fresh chest has a **5% mimic chance** on approach. The mimic warns a hungry lunge and spits stolen coins. Its original chest stays guarded until it is defeated, including in Boss Rush and saved runs. Defeating it returns the same reward count and saved offers, with ready-evolution priority if the build changed during the fight. Reclaimed treasure cannot become a mimic again. Chest ambushes grant one enemy defeat and never count as another boss or consume the original rewards.


## Local saves, arena challenges and cleared waves

**Save & Backup** is available directly in the lobby and pause menu. Progress, appearances, prestige, preferences and the unfinished run keep their existing save keys across builds. Saves use a rolling backup and a second local browser database; valid newer copies can recover missing or damaged primary storage. Profile rewards and run checkpoints commit together, while a completed run is marked deleted in every recovery path so it cannot return as an old checkpoint. Autosave status reports whether progress is durable or only available for the current session. Full JSON backups include the exact run encoding, unresolved rewards, rifts, guardians, trinkets, wishes and the reward ledger. Invalid imports leave the current save untouched. A different browser address or browser needs an exported backup because browser storage is local to its origin.

Entering a rift **teleports the hero into a unique bounded arena**: **The Paths · Rumbling Horizon**, **God of Destruction’s Sanctuary**, or **Walpurgisnacht · Last Stage**. Original scenery, destruction, position, pickups and enemies are suspended. Surviving guardians accompany the hero with their existing HP. After the boss’s defeat animation finishes, the game returns the hero and companions to the original location and grants the rewards there. Arena travel and partially completed death animations resume correctly from checkpoints.

**Waves wait for a full clear.** Ordinary waves contain 12 + 4 per subsequent wave, capped at 80 enemies. Every fifth wave adds its boss and a smaller escort budget. All remaining enemies, summoned adds and pending boss defeat animations must clear before a two-second break starts the next wave. Running away cannot remove the final wave enemy. The survival clock still raises enemy pressure every 60 seconds, even if the current wave has not been cleared. Boss Rush retains its separate finite gauntlet.

Shield item adjustments are modest: **Pink Soul Gem 10 shield/rank**, **AT Field 11 shield and 4% resistance/rank with a 9s recharge**, **Heart Kreuz 7 shield/rank**, **Energy Tank 3.5% resistance/rank**, and **Adaptive Barrier +20 shield with a 7s recharge**. Existing active saves recalculate these item bonuses once; intrinsic Titan and Adamantine defenses retain their own rules.

Erza starts in **Heart Kreuz Armor**, her silver-and-blue base form with a single forward sword cleave. Requip cycles base → Heaven’s Wheel → Black Wing → Adamantine → base. Earlier saved armor indices remain compatible, and all forms share the same weapon level and evolution.

The battle HUD uses smaller equipment icons and charge bars with the survival time centered. **HIDE HUD / SHOW HUD** or **H** hides and restores the interface, controls, health labels and damage numbers while preserving game simulation and camera zoom. The preference saves locally. Restore the HUD to use its touch action buttons.

**Golem and Mahoraga persist until killed**, have visible HP bars, take enemy contact/projectile/hazard damage, and remain single instances when summoned again. Recasting fully heals the existing guardian. Mahoraga has redesigned wheel, face, muscles, sword and hakama artwork. Existing duration mastery strengthens guardian maximum HP instead of providing an expiring summon.

An original locally generated soundtrack switches between exploration, boss and rift intensity. Sound effects cover combat, pickups, levels, ultimates, chests and boss arrivals. Playback unlocks on a player gesture; the lobby speaker button toggles master mute and the pause menu has separate music and sound-effect volume sliders. Music stops on pause, leaving the game or hiding the tab. Preferences travel with the save; no audio downloads are required.

## Guardian artwork and Erza’s form weapons

Mahoraga’s latest redraw adds a round eight-handled wheel, covered eyes, sculpted pale muscle planes, a broad ivory Sword of Extermination, white tied sash and dark hakama. Its raised sword strike has a separate pose. Both Mahoraga and Frieren’s golem retain their HP bars and remain until killed; recasts fully heal the existing guardian, and checkpoints preserve their HP.

Erza’s **Heart Kreuz Sword**, **Heaven’s Wheel Blades**, **Black Wing Sword** and **Adamantine Twin Shields** each have a distinct colored pixel icon, with four additional awakened variants for **Heaven’s Arsenal**. Her profile shows the four weapons beside their armor descriptions. Inventory, item details, upgrade and fusion offers display the current form’s weapon; the Requip button displays the next form’s weapon. Boss Rush and Shenron’s evolution chooser use the same form art. All forms still share one Requip slot, level and evolution, including after saving and resuming. Other characters borrowing Requip retain its original generic appearance.

## Five calamity bosses and growing guardians

The optional rift rotation now includes **Aizen · Hōgyoku Ascendant** and **Madara · Ten-Tails Jinchūriki**, alongside Founding Eren, Beerus and Walpurgisnacht. Aizen’s **Palace of Broken Reflections** hosts Kyōka Suigetsu’s fixed illusion cuts, Kurohitsugi’s open-sided black coffin and Fragor soul detonations. Madara’s **Divine Tree · Moonfall Battlefield** features twin Tengai Shinsei meteors, Truth-Seeking Orb patterns and Limbo shadow strikes. Both have original pixel art, distinct staged entrances, stronger second phases, bestiary phase descriptions and the existing large rift rewards. Their attacks warn fixed positions and pause with combat. They stay outside normal boss waves and Boss Rush.

**Founding Eren summons actual killable Colossal Titans** during the Rumbling and Colossal Footfalls. He maintains at most **two**, rising to **three** below half HP, replenishing defeated Titans on later summon attacks. Their stomps and scalding steam have separate warnings. Colossals retain their HP and owner through checkpoints, and surviving adds and their attacks disappear when Eren dies; dismissing an add gives no extra reward or leftover enemies on the original map.

**Resummoning Mahoraga or the stone golem restores full HP without creating a duplicate.** Mahoraga keeps its accumulated adaptations. Player levels above 1 add **3% of base maximum HP** and **2.5% attack strength** per level, with linear growth and no level cap. Maximum HP updates on the existing guardian while preserving its current health percentage; leveling or loading alone never restores full HP. Divine Dogs and Nue receive the same attack scaling. Gear and mastery still apply, and all scaled state survives save/load without compounding.

## Character selection polish

The lobby uses clearer, compact character cards, a distinct selected state and readable anime and weapon labels. Search by character, anime, weapon or ultimate, or filter by anime series; searches ignore accents and also find EVA pilot appearances such as Rei and Asuka. Filtering keeps the current selection, and an empty result can be reset directly.

The selected profile groups the hero portrait, mechanic, ultimate, prestige and starting equipment. **View Profile** and **Choose Map** shortcuts remain available while browsing the roster and profile. Outfits use a horizontally swipeable rail, with the chosen outfit kept visible. Changing characters, skins or run settings preserves keyboard focus and scroll position. Mobile controls have larger touch targets, reduced-motion preferences are respected, and hero, outfit and map choices retain their existing local saves.

## Heian Sukuna, Boros, death animations and Frieren’s second ultimate

The rift rotation has **seven exclusive superbosses**. **Sukuna · Heian Incarnation** opens the Malevolent Shrine’s **Forsaken Court**, using fixed Shrine slashes, staggered World-Cutting lanes and Furnace detonations. **Boros · Meteoric Burst** fights aboard **Dark Matter · Shattered Starship**, with meteoric afterimage rushes, a star cannon and a charged Collapsing Star Roaring Cannon. Both have original animated pixel art, unique staged entrances, stronger second phases, escape routes, bestiary phase descriptions and the same large once-only rift rewards. They remain outside ordinary waves and Boss Rush.

**Mahoraga’s defeat scatters its wheel and dissolves its body; the stone golem collapses into blocks.** Divine Dogs depart in smoke, Nue leaves feathers, and Naruto/Kurumi decoys leave smoke or shadow motes. The visual remains separate from the removed summon, pauses with combat, survives an unfinished-run checkpoint and cannot duplicate a summon or reward. Crossing a rift clears remains from the previous world.

**Player defeat now plays a 1.35-second fall and fade before results.** EVA, Titan, slime, Morph Ball and outfit appearances retain their silhouettes. Combat and the survival timer stop immediately, rewards bank once, and the dead checkpoint is deleted before the animation finishes. Reduced motion uses a short 0.25-second fade.

Frieren keeps **Ancient Stone Golem** on **Space / Special** and gains **Ancient Magic: Annihilation Barrage** on **E / Barrage**. The additional ability charges for **1.2 seconds**, then releases **one massive, fixed-aim black-core blast** with brilliant blue-white edges, trailing rings and debris. The single impact pierces enemies, curses survivors, clears shots and smashes supplies along its broad path. Its **75-second base cooldown** is independent of the golem’s cooldown; both respect cooldown mastery. A living golem keeps fighting during the barrage. The charge, spent impact and both cooldowns survive checkpoints without repeating damage. Her profile describes both abilities, and the tier guide now includes **18 ultimates / 104 total entries**.


## Frieren’s single release

Annihilation Barrage now charges one gathering seed and releases **one broad black-core cannon blast**, with a blue-white leading rim, outward shockwave and impact debris, matching the supplied clip’s single release. Its full burst lands once; no follow-up beams fire. The 1.2-second charge, 75-second separate cooldown, fixed aim and living golem remain available. The ability icon and tier explanation now describe the single blast. Existing unfinished casts retain their already-spent hit history so an update cannot repeat damage.


## Deliberate map layouts and Mother Brain’s walking body

Scenery now follows each map’s setting instead of scattering structures through random cells. Tokyo and Shibuya have aligned storefront and apartment rows, open roads and courtyards, sidewalk traffic signals and exactly two station entrances beside the central crossing. Leaf and Shiganshina use house rows; the Hokage monument has one fixed address. Tempest’s huts stay in its village, natural growth forms groves, and ruins and pillars form spaced islands. Building fronts have wider ground collision. Old checkpoints replace indestructible scenery while keeping pushed or damaged supplies, destroyed-object history, loot and progression; the player is moved clear if a new structure occupies the saved position.

Mother Brain’s second phase now has a rust-colored rib cage, dorsal spikes, a long segmented neck, exposed folded brain, glaring eye, toothy jaw and bent skeletal legs. She advances with a slow grounded gait and braces during attacks. The walking form fires a seven-ring aimed fan from its eye, charges a fixed mouth Hyper Beam for 1.6 seconds, and marks three sequential crushing steps. Rainbow Hyper Beam charges for 2.3 seconds before one broad prismatic release. Her face stays aligned with the captured attack; warnings, casts, time-stop effects and saved attack state remain synchronized. The phase entrance and bestiary explain the new patterns.

Validation: all **692 automated tests** pass. Browser checks cover all 15 maps, Mother Brain’s normal and Rainbow beams on desktop and phone, mobile bestiary phases, reduced motion, legacy scenery migration and paused attack checkpoints. The final single-file offline build passes the same save and beam checks without external requests.


## Guts, the Eclipse and Kurumi’s White Queen

**Guts** joins as the eighteenth legend with Dragonslayer and the Brand of Sacrifice. His slow, broad physical cleaves bleed and knock back enemies; maxing the sword and Brand evolves it into **Dragonslayer: Astral Edge**. Enemy hits, kills and damage received build **Struggle**. A full meter empowers the next valid enemy-directed cleave with 70% more damage and 20% reach; supplies and missed targets cannot spend it. The Brand grants 12 maximum HP and 3% damage resistance per rank. His 12-node mastery, prestige, tier explanations, equipment icons and signature-only Hardcore loadout are integrated.

**Berserker Armor** transforms his appearance for eight seconds, granting 35% damage, 15% movement speed and 25% damage resistance, repeated nearby cleaves and a final circular strike. It consumes no HP and grants no invulnerability. Golden Age, casual, pajama and beach appearances retain the transformation. Saved armor, spent finishing damage, Struggle and cooldowns resume correctly. Rift travel suspends source armor, removes its form and bonuses inside the separate arena, and restores the same remaining armor on return.

**Eclipse Wasteland** is the sixteenth map. Crimson ritual stone, open avenues, one ossuary arch, fixed fossil colonnades and three new breakable supplies form a dry arena. Four exclusive roaming enemies—Possessed Knight, Eclipse Heretic, Apostle Hound and Winged Apostle—lead into **Nosferatu Zodd, Grunbeld and Femto** as its opening bosses. Their three attacks each use fixed warnings; their second phases introduce winged Apostle, crystal dragon and expanded dark-wing forms. Entrances and bestiary phase guides show both bodies. The three bosses also join the ordinary map rotations and Boss Rush, now **28 bosses**; the seven optional rift bosses remain separate.

Kurumi’s flintlock now fires visible clock rounds with barrel-clock muzzle flashes and fractured clock-seal impacts; evolved rounds have stronger clockwork details. **White Queen** adds silver hair, a crown, a layered white military dress with dark lining, gloves and laced boots, plus silver-blue gunfire. Her shots, slows, curses, shadow doubles and outfit saves keep their existing gameplay rules.

Validation for this update: **730 automated tests pass**. Source browser checks cover desktop, phone and quiet landscape, Guts’s selection, Struggle and armor, White Queen’s silver gunfire, Hardcore signature gear, saved armor and all three transformed Berserk bosses. The single-file offline build includes every asset locally.

The final offline build also passes armor damage/expiry, White Queen evolved rounds and shadow doubles, all three transformation entrances and attack checkpoints, and the 28-boss maxed-item draft, without page errors or external requests.


## Selectable Berserker Guts outfit

Guts’s appearance picker now includes **Berserker Armor**, based on the supplied reference: layered black plate, a pointed helmet with sharply slanted red eye slits, fully armored gauntlets and greaves, a torn cape and Dragonslayer. It stays armored while idle, walking, attacking and after the ultimate ends. The outfit is cosmetic: Struggle, equipment, health and damage keep their existing rules; Berserker Armor’s combat bonuses still last only for the ultimate. Outfit selections and unfinished runs save normally.

Berserker outfit validation: **733 automated tests pass**. Source and final offline browser checks verify selection, normal-play armor, unchanged stats, keyboard/touch ultimate, outfit and run checkpoints, and desktop/mobile/reduced-motion layouts without page errors or external requests.


## Pursuing enemies and circular attack effects

Outrunning an enemy now brings that same enemy back just outside your screen, keeping its remaining health, form, ownership and eventual loot. Nearby enemies stay in place, return positions avoid scenery, water and other enemies, and relocated enemies receive a short attack delay. Their old attacks are cleared so unseen casts do not follow them. Recall is disabled inside bounded rift arenas.

Circular attacks now have themed charge and impact effects: cannon debris, fire, steam, ice crystals, lightning, venom, claws, curses and light. Caster hand cues help connect a warning circle to its attacker. Existing danger radii and damage stay the same, and reduced motion keeps calm, readable effects.


## Chainsaw Man expansion

**Denji** joins as the nineteenth playable character. Pochita’s Chainsaw sweeps a nearby forward arc and inflicts bleeding. Connected sweeps grant 16 Blood Engine Rev once per cast; ordinary, elite and boss kills grant 6, 12 and 24. Blood Engine grants 10 maximum HP and 4% weapon damage per rank, and increases Denji’s Rev gain by 10% per rank. At full Rev, the next enemy-directed sweep gains 60% damage and 20% reach. Supplies, misses and invalid targets neither charge nor spend Rev. Max Chainsaw and Blood Engine to evolve **Chainsaw Overdrive**, improving its reach, arc, damage and bleeding. Other heroes can use the shared weapon and passive; Rev belongs to Denji.

His ultimate **Chainsaw Man** transforms his head and arms into orange, serrated chainsaws for eight base seconds. He gains 30% damage, 12% movement speed and 20% incoming damage resistance, performs rapid bleeding cuts, and ends with a broad crosscut. A transformed pulse that actually damages an enemy heals 2 HP, up to **24 HP per activation**. Misses and scenery never heal him; bosses cannot be executed. The remaining form duration, healing budget and Rev meter save together, including suspension and restoration through rifts. Twelve branching mastery nodes and prestige improve his signature, Rev, movement and transformation. Public Safety, Black Jacket, casual, pajama and swimsuit outfits include original pixel art; all four tier-list categories explain his close-range strengths and limits.

Modern Tokyo and Shibuya gain four roaming threats: **Zombie Devil Thralls, Leech Devil Brood, Bat Devil Spawn and Eternity Flesh**. Three regular bosses join every map’s eventual rotation without replacing existing opening bosses: **Katana Man**, **Bat Devil** and **Eternity Devil**. Each has three signature attacks, fixed warning geometry and a stronger second phase. The bestiary explains both phases, and source-owned attack effects persist across checkpoints.

The eighth calamity rift leads to **Darkness Devil** in **Hell · The Primordial Night**, a separate arena with a moonless horizon, pale arches and silent suit silhouettes. Severance opens fixed cutting lanes, Primordial Night leaves an escape opening in its halo, and Falling Stars marks a delayed procession of impacts. Attackable **Hell Hands** and **Darkness Fragments** accompany it: at most two living servants, three in phase two, and six summoned across the whole encounter. They never join ordinary map pools and disappear with their owner. Standard rift rewards and saved encounter state apply.

Boss Rush now contains **31 regular bosses**. Saved 28-boss runs keep their current opponent, round and earned rewards; the three new bosses append to their existing order. Old profiles retain their progression and gain an untrained Denji mastery tree.

## New items and two-item fusions

Five shared items join ordinary upgrades and Boss Rush drafts: **Rasengan**, **Dragon Flame**, **Wisteria Petals**, **Grief Seed** and **Mana Crystal**. They each combine with existing equipment in an exact two-item recipe:

| New item | Existing partner | Fusion |
| --- | --- | --- |
| Rasengan | Flying Kunai | Flying Raijin: Rasengan |
| Dragon Flame | Storm Seal | Lightning Flame Dragon Roar |
| Wisteria Petals | Poison Vial | Wisteria Garden |
| Grief Seed | Pink Soul Gem | Purified Soul Gem |
| Mana Crystal | Ancient Grimoire | Sage’s Codex |

Max both ingredients, then choose the fusion at a level-up or chest reward. These three weapon pairs require no third passive. Each fusion consumes its secondary ingredient and frees one slot; Boss Rush immediately offers another maxed pick for that slot. Existing three-item recipes keep their requirements. Hardcore retains each hero’s own weapons and passive.

Rasengan delivers a nearby spinning chakra impact. Its Flying Raijin fusion sends a marked kunai through at most three distinct enemies, releasing bursts without moving the player. Dragon Flame burns a short forward cone; its fused roar combines fire and lightning in a longer fixed lane, with a brief first-hit stun. Wisteria Petals throw a piercing poison fan; Wisteria Garden lands a seed, then creates one fixed slowing garden with nine toxic pulses. Recasting replaces the previous garden. The garden evolves **Poison Vial**, retaining Maomao’s signature mastery and Precise Dose on actual damage.

Grief Seed grants −3% weapon/ultimate cooldown and +5% XP pickup range per rank. Mana Crystal grants +4% weapon area and +3% weapon damage per rank. Their passive fusions preserve both ingredients’ max-rank bonuses: **Purified Soul Gem** adds 20% food healing and an eight-second shield recharge, retaining any faster recharge; **Sage’s Codex** adds another 6% weapon/ultimate cooldown reduction. Both keep their original passive’s weapon evolution available.

All ten items and fusions have original icons and detailed tier explanations. Active effects support reduced motion, pause with the game and retain hit sets, flight stages and pulse timers across saved runs. Existing local progression and unfinished runs remain compatible. Preview sheets: [items](dist/paired-item-art-preview.png) and [attacks](dist/paired-attack-art-preview.png).

## Five Soul Gems and Salvation

The five magical girls’ Soul Gems are shared passive items, each with three ranks:

| Gem | Wish | Effect per rank |
| --- | --- | --- |
| Pink · Madoka | Hope | Existing 10 rechargeable shield and +6% weapon damage |
| Blue · Sayaka | Recovery | +0.35 HP/s |
| Yellow · Mami | Binding ribbons | +5% weapon area |
| Red · Kyoko | Resolve | +4% weapon damage |
| Purple · Homura | Time | −3% weapon/ultimate cooldown and +1.5% dodge |

**Soul Gems of the Quintet** is a new passive fusion created from all five Soul Gems at LV 3. The five gems become one complete passive item, retaining their combined effects and freeing four support slots. Any character can form the Quintet; it is made through fusion and never offered as a standalone item drop or draft pick. A previously Purified Pink Soul Gem carries its Grief Seed and purification benefits into the Quintet.

The new route is:

1. **Pink + Blue + Yellow + Red + Purple Soul Gems → Soul Gems of the Quintet.** Max all five original gems first.
2. **Ultimate Madoka + Soul Gems of the Quintet → Salvation: Five Wishes.** Madoka needs the LV 5 evolved bow and the completed Quintet item. The Quintet remains equipped after Salvation.

You can form the Quintet before or after the bow’s first evolution; its retained Pink bonus still enables Ultimate Madoka. Both fusion steps use normal level-up, chest and Boss Rush choices, with no special chance roll. Boss Rush refills the four slots freed by the Quintet with maxed picks. Consumed original gems stay blocked from subsequent pickups, and neither ordinary upgrades nor Boss Rush can grant the completed Quintet directly.

The evolved bow becomes white and gold with feathered limbs and five gems. It fires five colored homing arrows with radiant constellation bursts: Pink heals on connected enemy hits, Blue slows, Yellow stuns, Red burns and Purple curses. Threads of Hope and projectile mastery still add arrows. Each arrow hits at most four distinct enemies, and all Pink arrows together can heal at most **2 HP per volley**. Casts, healing budgets, homing targets and hit records save and pause with the run. All outfits retain the aimed bow’s original grip and muzzle.

Fusion choices and accepted rewards persist through mimic recovery and saved runs. Previously completed Salvation runs receive the Quintet in place of their original Pink slot, preserving all earned bonuses and the final bow. Pending older direct-Salvation offers become the Quintet step so saved rewards remain usable. Local progression remains compatible. Madoka’s profile, the recipe guide and tier lists explain both steps. [Art preview](dist/quintet-soul-gems-art.png).

## Complete anime item sets

Nine new shared passive items lead to three more composite items like the Quintet. Train every ingredient to LV 3, then choose its normal fusion at a level-up, in a chest or during Boss Rush preparation. Each completed set occupies one passive slot, retains all ingredient bonuses and cannot be picked up directly.

| Composite | Maxed ingredients | Slots freed |
| --- | --- | --- |
| **Sage’s Regalia** | Leaf Headband + Sage Scroll + **Toad Oil Gourd + Sage Beads + Sage Cloak** | 4 |
| **Chozo Power Suit** | Energy Tank + **Morph Ball Module + Varia Suit Module + Gravity Suit Module** | 3 |
| **Witch’s Archive** | Memory Fragment + **Golden Butterfly + Red Truth Seal + Witch’s Ring** | 3 |

New ingredients are shown in bold. Their effects per rank are:

| Item | Effect per rank |
| --- | --- |
| Toad Oil Gourd | +0.2 HP/s and +5% food healing |
| Sage Beads | −2% weapon/ultimate cooldown and +3% XP pickup range |
| Sage Cloak | +3% weapon damage and +2% damage resistance |
| Morph Ball Module | +3% movement and +1% dodge |
| Varia Suit Module | +5 max HP and +2% damage resistance |
| Gravity Suit Module | +5% XP pickup range and +10% freeze resistance, capped at 90% with other sources |
| Golden Butterfly | +5% XP pickup range |
| Red Truth Seal | +4% weapon damage |
| Witch’s Ring | −2% weapon/ultimate cooldown and +3% weapon area |

Sage’s Regalia keeps Headband and Scroll available for their weapon evolutions. Chozo Power Suit retains Energy Tank for Plasma Beam; if Energy Tank was already Adaptive Barrier, the suit also retains its AT Field, extra shield and seven-second recharge. Witch’s Archive keeps Memory Fragment available for Final Chapter and preserves Featherine’s Authority gain from both quill hits and kills. Absorbed ingredients stay blocked from later pickups, so they cannot duplicate their bonuses.

Boss Rush refills freed slots with random maxed picks. Hardcore keeps each hero’s signature equipment rule, and all three sets, their inherited benefits and unfinished choices save normally. The fusion guide now has shortcuts to all four complete passive sets, with compact four- and five-item formulas; the arsenal and tier lists cover all twelve new entries. [Item and recipe preview](dist/complex-item-art.png).

## Darkness and Death

Darkness Devil has a new native pixel body based on the reference: a black mantle, elongated pale legs, stacked skulls, praying hands, a jointed arm frame and a ribbed crescent crest. Its entrance follows two rows of fourteen kneeling astronauts through a flower field, then reveals a hanging ritual sword and the devil at the end of the procession. The 6.2-second scene can be skipped; combat remains paused throughout it. Existing Severance, Primordial Night and Falling Stars attacks and servant limits remain intact.

**Death Devil** is the ninth optional calamity rift. Its white split shroud surrounds a column of mouths and eyes, beneath a skull and bone crown with long bladed spokes. It arrives beneath an inverted city as funeral bells fall silent and white curtains part. Its unique arena, **Hell · The Last Silence**, has an open ash-and-flower field with fixed scenery on the rim.

| Death Devil attack | Pattern and escape |
| --- | --- |
| Memento Mori | Five staggered coffin seals spiral around the marked position, leaving an open side before a separately warned central impact. |
| Pale Crown | Seven bone blades strike inward, stopping before the central pocket and leaving a broad outward corridor. A later warning marks the center. |
| The Last Horizon | Two side lanes release before the wider central lane. Move between the fixed warnings; a diagonal opening remains. |

Below half health, Death adds two coffins, two crown blades, wider marks and a delayed perpendicular Horizon cut. Warning geometry locks when cast and never follows later movement. Its coffin and bone effects follow the same saved clock as their damage, including pause, slowing and time stop. Both phases and dodging advice appear in the bestiary.

The first eight rifts keep their order; Death is appended to the rotation and remains outside ordinary waves and the 31-boss Boss Rush. Defeating it gives the existing large rift reward and five-choice cache once, then restores the suspended map. Existing progression and unfinished encounters remain compatible. Both entrances have static reduced-motion versions, phone/landscape layouts and saved scene timing. [Body preview](dist/primal-devils-art.png) · [Arena preview](dist/death-devil-arena.png).

Validation: **930 tests pass**. The finished standalone was checked offline on phone, desktop and reduced-motion landscape for both bestiary phase guides and entrances, all three phase-two attack effects, paused entrance and midcast checkpoints, and a once-only 900-coin/five-choice return. Existing Quintet/Salvation and mastery progress loaded correctly. No page errors, external requests or horizontal overflow were found.

## Rift challenge phases

Each of the nine rift bosses now interrupts its first half-health transition with a unique challenge. Use the normal movement and dash controls to complete the objective. The boss cannot be damaged during the challenge, and ordinary attacks pause while its special hazards remain active. Completing the challenge restores the second-phase fight; the large reward still comes only from defeating the boss.

| Rift boss | Challenge |
| --- | --- |
| Darkness Devil | The arena goes dark and the devil disappears. Search your pool of light for three astronaut body parts; recovering all three restores the light and reveals the boss again. |
| Founding Titan Eren | Cross the Paths through three ordered waypoints while avoiding warned Titan stomp lanes. |
| Beerus / Bills | Bring three pudding offerings to the central shrine, carrying one at a time and avoiding erasure marks. |
| Walpurgisnacht | Follow four lit stage spotlights in order and remain in each long enough to complete the cue. |
| Aizen | Find the real mirror in three rounds. A golden butterfly reveals which reflection to approach; false mirrors punish a wrong choice. |
| Madara | Survive three falling heavens by reaching the changing shelter before each meteor lands. |
| Heian Sukuna | Stand within three shrine seals to channel them while sidestepping warned slashes. |
| Boros | Step onto three reactor vents to arm them, then leave each blast area before it releases. |
| Death Devil | Follow the moving lantern sanctuary through three funeral bells; stay inside its light when each bell tolls. |

Objectives and progress remain visible on phones, including when the combat HUD is hidden. Darkness leaves a local pool of light around the player rather than an entirely unreadable screen. Challenge objectives, timers and collected items save with unfinished runs and stop when paused. Older saves keep their existing boss phase and progress. The bestiary's phase descriptions explain every challenge alongside each boss's normal attacks.

Validation: **962 tests pass**. All nine challenge scenes were checked on phone, desktop and reduced-motion landscape. The finished standalone was checked offline for every half-HP transition and partial checkpoint, then a complete three-part Darkness search using pointer movement, save/reload, Hide HUD and light restoration with the live boss returning nearby. Existing mastery and Quintet/Salvation progress remained intact. Defeat inside a challenge reaches results and removes the dead checkpoint correctly. No page errors, external requests or horizontal overflow were found. [Darkness search](dist/trial-darkness-hidden-hud.png) · [Light restored](dist/trial-darkness-light-restored.png).

## Thriller Bark Graveyard

The seventeenth map is a moonlit graveyard with broad stone avenues, ordered burial plots, an open iron gate, one mausoleum and bare trees. Candles, drifting mist and pale soulfire give the grounds their atmosphere. The paths and decorated soil are dry, and the grave rows leave clear routes through the map. Break Weathered Coffin Caches, Soulfire Lantern Urns and Grave Offering Candles for the normal supply drops.

Five new ordinary enemies inhabit the graveyard: **Gravebound Zombies** sweep short grasp lanes, **Coffin Crawlers** brace before a rushing landing, **Lantern Wisps** mark delayed soul flames, **Shadow-Stitched Brutes** cut two crossing quake lanes, and **Negative Hollows** fire slowing spirit fans. The stronger brute and hollow join later waves.

The graveyard opens its regular boss rotation with **Samurai Ryuma**, then **Gecko Moria**. Ryuma uses a long sword draw, parallel crescent cuts and an open-sided ring of grave swords; below half health, Brook’s shadow adds a returning cut and more crescents. Moria sends shadow-bat seals, crossing Doppelman cuts and a procession of shadow pillars; Shadow Asgard expands the attacks and adds more cuts and pillars. Their warnings stay fixed after appearing, and the bestiary explains both phases. Boss Rush adds these two regular bosses for **33 total**; saved 31-boss runs retain their current fight and earned progress before the new challengers are appended.

Two supernatural events can arise naturally in the graveyard:

| Event | Special encounter | Stored event item |
| --- | --- | --- |
| **Night of the Hollow Lanterns** | Perona’s ghost parade brings Negative Hollows and wandering spirits beneath pale lantern light. | **Hollow Lantern** |
| **The Great Tomb Awakens** | Ainz Ooal Gown leads armored Tomb Sentinels and restless corpses beneath gathering necromantic magic. | **Sealed Ossuary Key** |

Each event has its own enemies, boss attacks, second phase and weather. Defeat its boss and remaining invaders for the event cache and return to ordinary waves. Perona and Ainz are event bosses, so they stay outside the regular Boss Rush roster. Enemy drops can yield their event items: keep one in any of the three trinket slots, then open its details and use it later. Picking one up does not start the event. A stored item can call its event on another map when the current encounter permits it, and it is consumed only when that event begins. Map choice, event items, active encounters and pending rewards save with the run.

Validation: **1001 tests pass**. The finished standalone was checked offline on phone, desktop and reduced-motion landscape for map selection and Hardcore, all four bestiary phase guides, native scenery and enemies, destroyed-supply checkpoints, both inventory event activations and entrances, fixed second-phase casts and exact reloads, and both once-only event caches. Existing Quintet/Salvation progress and a saved 31-boss gauntlet retained their builds, active fight and earned progress. No page errors, external requests or horizontal overflow were found. [Map preview](dist/graveyard-map-art.png) · [Enemy preview](dist/graveyard-enemies-art.png) · [Live graveyard](dist/graveyard-live-1440.png).
