import {DEVIL_PALETTES,devilEnemyPixels} from './devil-enemy-art.js';
import {GRAVEYARD_PALETTES,graveyardEnemyPixels} from './graveyard-enemy-art.js';
import {EVENT_PALETTES,eventEnemyPixels} from './world-event-art.js';
import {ANIME_PALETTES,animeEnemyPixels} from './anime-pixels.js';
import {baseEnemyPixels} from './base-enemy-pixels.js';
import {RIFT_SUPERBOSS_PALETTES,riftSuperbossPixels} from './rift-superboss-art.js';
// Hand-drawn clusters on the same 56 × 76 grid as the playable cast.
export const ENEMY_PALETTES={
 ...GRAVEYARD_PALETTES,
 ...DEVIL_PALETTES,
 ...EVENT_PALETTES,
 rumblingcolossal:ANIME_PALETTES.bertholdt,
 ...ANIME_PALETTES,
 ...RIFT_SUPERBOSS_PALETTES,
 saibaman:['#91b65b','#547947','#d1d784'],soldier:['#9488b6','#4b506c','#d5d3e0'],shinobi:['#675b7d','#30384c','#afa7bc'],snake:['#a9c392','#587e73','#e2e3b6'],curse:['#a78bb4','#584867','#d7b4d0'],cursedeye:['#e8becd','#885c89','#f4dbd9'],familiar:['#f0d2c5','#8d5f79','#fcecd5'],butterfly:['#b28bd1','#5d4e82','#efd1f2'],rosewitch:['#e3a0c0','#9f608f','#ffe1e2'],frieza:['#ece0eb','#9268b9','#fff3ea'],orochimaru:['#d7cfac','#746284','#f4e4c2'],sukuna:['#e7b9a7','#986172','#f9e9d9'],walpurgis:['#cc9ab9','#645073','#efd2c5'],
};
export function enemyPixels(id,m={}){
 if(GRAVEYARD_PALETTES[id])return graveyardEnemyPixels(id,m);
 if(DEVIL_PALETTES[id])return devilEnemyPixels(id,m);
 if(EVENT_PALETTES[id])return eventEnemyPixels(id,m);
 if(id==='rumblingcolossal')return animeEnemyPixels('bertholdt',{...m,enraged:1});
 return RIFT_SUPERBOSS_PALETTES[id]?riftSuperbossPixels(id,m):ANIME_PALETTES[id]?animeEnemyPixels(id,m):baseEnemyPixels(id,m);
}
