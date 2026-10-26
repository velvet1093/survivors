# Balance tools

Headless simulations behind the in-game tier list. They drive the real game engine
(`src/engine.js`) with a scripted bot, so results change whenever balance changes.

| Script | What it measures |
| --- | --- |
| `hero-sim.mjs` | Each hero over ten-minute Normal Survival runs with natural levelling. HP is refilled every tick, so a run never ends early. Records damage per second, kills, level, and the share of the HP pool lost per minute in the second half. |
| `item-sim.mjs` | Each weapon (or weapon fusion) alone at max rank on a neutral hero (Maomao, starting kit removed) for three minutes, with levels frozen. Owned weapons are also measured on their owner. |
| `passive-stats.mjs` | Each passive from the game's own `refreshStats`: gain in weapon offense, effective HP, ultimate uptime, movement and pickup range for one slot. |
| `report.mjs` | Turns `results/*.json` into `src/tier-measurements.js`, the stat strips in the tier list. |
| `bot.mjs` | The shared bot. It orbits to dodge telegraphed hazards, sidesteps shots, collects safe XP and holds bosses at mid range. `BOT_STYLE=close` fights inside melee reach. |

## Re-running

```sh
cd tools/balance
node hero-sim.mjs all 6 600 all              # ~25 min on 4 cores if split by hero
BOT_STYLE=close node hero-sim.mjs all 6 600 close     # every hero in both styles
ERZA_FORM=2 node hero-sim.mjs erza 6 600 erza-f2   # Erza holds one armor (0 Wheel, 1 Black Wing, 2 Adamantine, 3 Heart Kreuz)
node item-sim.mjs weapons 3 180 all 0/2      # shard k/n to split across cores
BOT_STYLE=close node item-sim.mjs weapons 3 180 all 0/2
node passive-stats.mjs
node report.mjs
```

The report keeps each hero's best composite (60% damage, 40% survivability, each relative
to the roster median) and each weapon's better bot style. Tier placements and notes live in
`src/tier-rankings.js`; update them by hand after reading the new report.

## Known limits

- The bot is simple. Absolute survival times would mostly measure bot skill, which is
  why heroes are compared on damage and damage intake rather than on how long they live.
- Weapon fusions keep their passive ingredient equipped (for example Ultimate Madoka
  keeps Pink Soul Gem), so their numbers include that passive's bonus, as in a real build.
- Ultimates are not simulated; they are ranked by design review.
