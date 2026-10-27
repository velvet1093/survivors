import {BEACH_OUTFITS} from './beach-outfits.js';
import {CUTE_SWIM_OUTFITS} from './cute-swim-outfits.js';
import {PILOT_SWIM_OUTFITS} from './pilot-swim-outfits.js';
import {SWIMSUIT_OUTFITS} from './swimsuit-outfits.js';
import {PAJAMA_OUTFITS} from './pajama-outfits.js';
import {CASUAL_OUTFITS} from './casual-outfits.js';
const base=(name='Original')=>({id:'default',name});
export const SKINS={
 denji:[base('Public Safety Devil Hunter'),{id:'devilhunter',name:'Devil Hunter · Black Jacket'}],
 shiraori:[base('White Weaver'),{id:'unveiled',name:'Spider God · Unveiled'}],
 guts:[base('Black Swordsman'),{id:'goldenage',name:'Band of the Hawk'},{id:'berserker',name:'Berserker Armor'}],
 featherine:[base('Witch of Theatergoing'),{id:'shrine',name:'Miko of Fragments'}],
 rimuru:[base('Tempest Traveler'),{id:'demonlord',name:'Demon Lord'}],
 diavolo:[base('Hidden Emperor'),{id:'doppio',name:'Vinegar Doppio'}],
 yuki:[base('Star Rage · Red Trousers'),{id:'midnight',name:'High Collar · Blue Trousers'}],
 eren:[base('Scout Uniform'),{id:'cloak',name:'Survey Corps Cloak'},{id:'yeagerist',name:'Yeagerist · Long Coat'},{id:'infiltrator',name:'Marley Infiltrator'}],
 megumi:[base('Jujutsu Uniform'),{id:'training',name:'Training Uniform',replace:{'#37445f':'#68758b','#202a44':'#39455f','#65718c':'#a2a7b4'}}],
 frieren:[base('Elven Mage'),{id:'maid',name:'Maid Frieren'}],
 samus:[base('Varia Suit'),{id:'zerosuit',name:'Zero Suit'},{id:'stealth',name:'Zero Suit · Stealth'},{id:'fusion',name:'Fusion Suit',replace:{'#d9954f':'#579fc4','#8c573d':'#345680','#f1c67a':'#a8dfed','#ac5854':'#4479a8','#e2a450':'#dda95b'}},{id:'gravity',name:'Gravity Suit',replace:{'#d9954f':'#9d74bf','#8c573d':'#5c477b','#f1c67a':'#d4b1e2','#e2a450':'#a681c5'}}],
 goku:[base('Orange Gi'),{id:'supersaiyan',name:'Super Saiyan',replace:{'#182331':'#ecd064','#101520':'#ab7d32','#354459':'#fff1a3'}}],
 gojo:[base('High Collar'),{id:'female',name:'Female Gojo'},{id:'unsealed',name:'Unsealed',replace:{'#272739':'#ede8e0','#18192b':'#9c9aa9','#4d4d6a':'#ffffff'}}],
 naruto:[base('Leaf Ninja'),{id:'sage',name:'Sage Cloak',replace:{'#ee9848':'#c36556','#b76837':'#7c4551','#ffca74':'#edb18a'}},{id:'hokage',name:'Seventh Hokage'}],
 madoka:[base('Magical Girl'),{id:'goddess',name:'Ultimate Madoka',replace:{'#eea4c0':'#f1e8e8','#bd668f':'#b3a3c8','#ffdfed':'#ffffff','#efa4c1':'#f1bfd5'}},{id:'school',name:'Mitakihara School Uniform'}],
 maomao:[base('Apothecary'),{id:'dancer',name:'Crimson Dancer'},{id:'spring',name:'Spring Court'},{id:'palace',name:'Palace Attire',replace:{'#79b999':'#a78ab8','#3f7c6d':'#695378','#b5deae':'#dfc7e4','#863d61':'#394e68'}}],
 shinji:[{id:'default',name:'Shinji / EVA-01',pilot:'Shinji',unit:'EVA-01',armor:'#8564b5',shade:'#453d64',light:'#bdacd9',neon:'#aeda6d',hair:'#29374b',suit:'#e7eddf'},
 {id:'asuka',name:'Asuka / EVA-02',pilot:'Asuka',unit:'EVA-02',armor:'#ca5b53',shade:'#773c45',light:'#efab8e',neon:'#e8b66e',hair:'#bd7547',suit:'#cb6557'},
 {id:'rei',name:'Rei / EVA-00',pilot:'Rei',unit:'EVA-00',armor:'#799fc1',shade:'#405c7d',light:'#c2d9e5',neon:'#e8b777',hair:'#a4c9d8',suit:'#eceddf'},
 {id:'mari',name:'Mari / EVA-08',pilot:'Mari',unit:'EVA-08',armor:'#c985a5',shade:'#754c78',light:'#edc1d7',neon:'#9cc975',hair:'#73504c',suit:'#cb84a7'}],
 kurumi:[base('Astral Dress'),{id:'gothic',name:'Gothic White · Eyepatch'},{id:'crimson',name:'Midnight Rose'},{id:'school',name:'School Uniform'},{id:'whitequeen',name:'White Queen'}],
 esdeath:[base('Imperial General'),{id:'winter',name:'Midnight Winter',replace:{'#e6edf0':'#455c80','#b5c6d6':'#293b61','#ffffff':'#8ca5c0'}},{id:'sweater',name:'Winter Knit'},{id:'blackdress',name:'Midnight Lace'}],
};
SKINS.erza=[base('Heart Kreuz Armor'),{id:'casual',name:'Fairy Tail Day Off'}];
for(const [id,name]of Object.entries(CASUAL_OUTFITS))SKINS[id].push({id:'casual',name,...(id==='shinji'?{pilot:'Shinji',unit:'EVA-01',armor:'#dce4e4',shade:'#46556d',light:'#f8f3df',neon:'#80b9c5',hair:'#29374b',suit:'#e7eddf'}:{})});
for(const [id,name]of Object.entries(PAJAMA_OUTFITS))SKINS[id].push({id:'pajamas',name,...(id==='shinji'?{pilot:'Shinji',unit:'EVA-01',armor:'#4e718b',shade:'#293e5b',light:'#a8ccda',neon:'#e2ae65',hair:'#29374b',suit:'#e7eddf'}:{})});
for(const [id,name]of Object.entries(SWIMSUIT_OUTFITS))SKINS[id].push({id:'swimsuit',name,...(id==='shinji'?{pilot:'Shinji',unit:'EVA-01',armor:'#5598af',shade:'#2b516e',light:'#b9e4df',neon:'#f1c878',hair:'#29374b',suit:'#e7eddf'}:{})});
for(const collection of [BEACH_OUTFITS,CUTE_SWIM_OUTFITS])for(const [id,outfits]of Object.entries(collection))SKINS[id].push(...outfits);
SKINS.shinji.push(...PILOT_SWIM_OUTFITS);
export function skinFor(character,id){return SKINS[character]?.find(s=>s.id===id)||SKINS[character]?.[0]||base();}
export function tintPixels(pixels,skin){return skin.replace?pixels.map(c=>skin.replace[c]||c):pixels;}
