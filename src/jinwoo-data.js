// Sung Jinwoo from Solo Leveling. He never wields weapon items: the System levels him up
// with stat points, and his attacks come from Kamish's Wrath and the shadows in his own
// Shadow Inventory. He can still take passive items.
export const JINWOO_CHARACTER={
 id:'jinwoo',name:'Jinwoo',fullName:'Sung Jinwoo',title:'THE SHADOW MONARCH',series:'SOLO LEVELING',color:'#8a7ce8',
 weapon:'shadowsoldier',passive:'blackheart',skill:'Arise',noWeapons:true,
 description:'The System levels you up: spend stat points, extract shadows into your Shadow Inventory and take passives, but never weapons. Slash with Kamish’s Wrath while your shadow army fights. Complete the Daily Quest to raise every stat, then command your army to Arise.',
 power:4,speed:5,range:3,hp:105,move:240,
};
// Shadow grades, from a freshly extracted soldier to a commander of the army.
export const SHADOW_GRADES=['Normal','Elite','Knight','Elite Knight','Commander'];
export const MAX_SHADOWS=6;
// Each shadow fights in its own way. `minLevel` keeps the strongest for later in the run.
export const SHADOWS={
 shadowsoldier:{name:'Shadow Soldier',color:'#7a70c8',style:'slash',damage:12,cooldown:.8,reach:40,speed:300,chase:18,r:9,description:'A squad of infantry shadows with black blades: two soldiers rise at Normal grade.',scaling:'+1 soldier, damage and attack speed per grade (up to six)'},
 iron:{name:'Iron',color:'#8a8ca8',style:'bash',damage:17,cooldown:1.3,reach:46,speed:250,chase:20,r:12,description:'A hulking shield knight. Its shield bash stuns and knocks enemies back.',scaling:'+ damage, stun and attack speed per grade'},
 igris:{name:'Igris',color:'#c8404e',style:'lunge',damage:24,cooldown:.75,reach:58,speed:330,chase:22,r:10,description:'The Blood-Red Commander. Lightning sword lunges that leave enemies bleeding.',scaling:'+ damage, bleeding and attack speed per grade'},
 tank:{name:'Tank',color:'#7ab0d8',style:'slam',damage:20,cooldown:1.6,reach:52,speed:260,chase:24,r:14,radius:70,description:'A shadow ice bear. Its ground slam hits every enemy around it and chills them.',scaling:'+ damage, slam area and attack speed per grade'},
 tusk:{name:'Tusk',color:'#d8783a',style:'fire',damage:22,cooldown:1.5,reach:230,speed:240,chase:170,r:11,radius:46,description:'A high orc shaman. It hurls burning fireballs from behind the front line.',scaling:'+ damage, blast area and attack speed per grade'},
 beru:{name:'Beru',color:'#6a9a7a',style:'claw',damage:14,cooldown:.42,reach:44,speed:390,chase:16,r:10,minLevel:10,description:'The Ant King. Blindingly fast claw strikes that poison their target.',scaling:'+ damage, poison and attack speed per grade'},
 kaisel:{name:'Kaisel',color:'#5a8ab8',style:'dive',damage:26,cooldown:1.8,reach:270,speed:340,chase:60,r:12,radius:56,flying:true,minLevel:10,description:'A shadow wyvern. It dives from the sky onto distant enemies and scatters them.',scaling:'+ damage, dive area and attack speed per grade'},
 bellion:{name:'Bellion',color:'#b8a0f0',style:'sweep',damage:34,cooldown:1.4,reach:120,speed:300,chase:40,r:12,radius:120,minLevel:18,description:'The Grand Marshal. A sweeping blade wave cuts through every enemy in front of it.',scaling:'+ damage, sweep reach and attack speed per grade'},
};
export const SHADOW_IDS=Object.keys(SHADOWS);
// Grade scaling: each grade adds 25% damage and attacks 6% faster.
export const shadowGradePower=grade=>1+.25*(Math.max(1,grade)-1);
export const shadowGradeSpeed=grade=>1-.06*(Math.max(1,grade)-1);
export const JINWOO_ITEMS={
 ...Object.fromEntries(SHADOW_IDS.map(id=>[id,{name:SHADOWS[id].name,type:'shadow',color:SHADOWS[id].color,owner:'Jinwoo',max:SHADOW_GRADES.length,minLevel:SHADOWS[id].minLevel||0,description:SHADOWS[id].description,scaling:SHADOWS[id].scaling}])),
 blackheart:{name:'Black Heart',type:'passive',color:'#6a5ab8',owner:'Jinwoo',max:3,description:'+12 max HP per rank. On Jinwoo it also adds 6% shadow damage and speeds the Daily Quest by 15% per rank.',scaling:'+ max HP, shadow damage and Daily Quest progress'},
};
// The System's stat sheet. Every allocation card adds three points to one stat.
export const STAT_POINTS=3;
export const JINWOO_STATS={
 str:{name:'Strength',short:'STR',color:'#e07a6a',text:'+3% Kamish’s Wrath damage and +1% all damage per point.'},
 agi:{name:'Agility',short:'AGI',color:'#7ad8a8',text:'+1% move speed and 1% faster attacks per point.'},
 vit:{name:'Vitality',short:'VIT',color:'#e0b05a',text:'+4 max HP and +0.06 HP regeneration per point.'},
 sen:{name:'Sense',short:'SEN',color:'#7ab8e8',text:'+3% pickup range and +0.3% dodge per point.'},
 int:{name:'Intelligence',short:'INT',color:'#b08ae8',text:'+3% shadow damage and +1.5% area per point.'},
};
export const STAT_IDS=Object.keys(JINWOO_STATS);
export const BASE_STAT=10;
export const newStats=()=>Object.fromEntries(STAT_IDS.map(id=>[id,BASE_STAT]));
