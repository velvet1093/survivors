import {BERSERK_PALETTES,berserkEnemyPixels} from './berserk-enemy-art.js';
import {JOJO_PALETTES,jojoPixels} from './jojo-pixels.js';
import {TITAN_PALETTES,titanPixels} from './titan-pixels.js';
import {METROID_PALETTES,metroidPixels} from './metroid-pixels.js';
import {RIFT_PALETTES,riftPixels} from './rift-pixels.js';
import {WAR_PALETTES,warPixels} from './war-pixels.js';
import {redesignedAnimePixels} from './anime-reference-pixels.js';
import {auraPixels} from './boss-reference-pixels.js';
export const ANIME_PALETTES={...BERSERK_PALETTES,...JOJO_PALETTES,...TITAN_PALETTES,...METROID_PALETTES,...WAR_PALETTES,...RIFT_PALETTES,flyhead:['#9bad79','#4d6858','#dce2ae'],transfigured:['#cfb0ba','#796579','#eed3cb'],jogo:['#b9b699','#686f60','#e9d8a9'],hanami:['#d7d5bb','#687d69','#f4e9cf'],dagon:['#db968b','#965b6b','#f2c1a5'],demonsoldier:['#ae9bbd','#51475f','#e0c6d5'],angelspawn:['#dcd8bd','#263c42','#f5edcc'],spiderdemon:['#e2d7d1','#8d6c85','#fff0df'],zombie:['#a9af92','#596858','#d2d5ad'],aura:['#c895d1','#704f94','#f1c4e3'],mahito:['#9bb7c9','#465b76','#dde0d8'],akaza:['#edc8b5','#6879a5','#ffe6d2'],sachiel:['#e1d8b4','#2b4547','#fff1c8']};
export function animeEnemyPixels(id,m={}){
 if(BERSERK_PALETTES[id])return berserkEnemyPixels(id,m);
 if(id==='aura')return auraPixels(m);
 if(JOJO_PALETTES[id])return jojoPixels(id,m);
 if(TITAN_PALETTES[id])return titanPixels(id,m);
 if(METROID_PALETTES[id])return metroidPixels(id,m);
 if(RIFT_PALETTES[id])return riftPixels(id,m);
 if(WAR_PALETTES[id])return warPixels(id,m);
 return redesignedAnimePixels(id,m);
}
