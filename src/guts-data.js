export const GUTS_CHARACTER={
 id:'guts',name:'Guts',title:'THE BLACK SWORDSMAN',series:'BERSERK',color:'#c48c84',
 weapon:'dragonslayer',passive:'brand',skill:'Berserker Armor',
 description:'Wield the enormous Dragonslayer in heavy, bleeding cleaves. Hits and kills build Struggle; at full resolve, the next swing breaks the horde. Unleash the Berserker Armor to fight through the Eclipse with relentless black-steel strikes.',
 power:5,speed:2,range:2,hp:145,move:205,
};
export const GUTS_ITEMS={
 dragonslayer:{name:'Dragonslayer',type:'weapon',color:'#acb6bc',owner:'Guts',max:5,description:'Swing a massive slab of iron through a nearby cone, bleeding and knocking back every enemy in its path. Higher ranks strengthen the cleave and extend its reach. Guts alone builds Struggle for empowered swings.',scaling:'+ damage, cleave reach and bleeding'},
 brand:{name:'Brand of Sacrifice',type:'passive',color:'#c47e7b',owner:'Guts',max:3,description:'+12 maximum HP and +3% damage resistance per rank. Its endurance supports Dragonslayer’s Astral Edge evolution.',scaling:'+ maximum HP and damage resistance'},
};
export const GUTS_FUSIONS=[{
 id:'berserkeredge',name:'Dragonslayer: Astral Edge',weapon:'dragonslayer',passive:'brand',color:'#c7b9b1',
 description:'Dragonslayer + Brand of Sacrifice → awaken iron tempered by the astral world: a broader, stronger bleeding cleave cuts through nearby enemies with greater reach and knockback. Guts keeps his Struggle empowerment.',
}];
