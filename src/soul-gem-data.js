export const SOUL_GEM_IDS=['soulgem','bluegem','yellowgem','redgem','purplegem'];
export const SOUL_GEM_ITEMS={
 quintet:{name:'Soul Gems of the Quintet',type:'passive',series:'PUELLA MAGI MADOKA MAGICA',color:'#f0d5bd',max:1,fusionOnly:true,description:'The five maxed Soul Gems united in one passive slot. Retains Pink’s shield and damage, Blue’s regeneration, Yellow’s area, Red’s damage and Purple’s cooldown and dodge. Combine with Madoka’s Ultimate Madoka bow for Salvation.',scaling:'All five max-rank Soul Gem bonuses'},
 bluegem:{name:'Blue Soul Gem',type:'passive',series:'PUELLA MAGI MADOKA MAGICA',color:'#89c9ed',max:3,description:'Sayaka’s wish of recovery grants +0.35 HP regeneration per second per rank. One of the five Soul Gems needed to create Soul Gems of the Quintet.',scaling:'+0.35 HP/s per rank'},
 yellowgem:{name:'Yellow Soul Gem',type:'passive',series:'PUELLA MAGI MADOKA MAGICA',color:'#eacb7d',max:3,description:'Mami’s binding ribbons grant +5% weapon area per rank. One of the five Soul Gems needed to create Soul Gems of the Quintet.',scaling:'+5% weapon area per rank'},
 redgem:{name:'Red Soul Gem',type:'passive',series:'PUELLA MAGI MADOKA MAGICA',color:'#e9949d',max:3,description:'Kyoko’s fierce resolve grants +4% weapon damage per rank. One of the five Soul Gems needed to create Soul Gems of the Quintet.',scaling:'+4% weapon damage per rank'},
 purplegem:{name:'Purple Soul Gem',type:'passive',series:'PUELLA MAGI MADOKA MAGICA',color:'#b7a0df',max:3,description:'Homura’s time magic reduces weapon and ultimate cooldowns by 3% and grants 1.5% dodge chance per rank. One of the five Soul Gems needed to create Soul Gems of the Quintet.',scaling:'−3% cooldown and +1.5% dodge per rank'},
};
export const QUINTET_FUSION={
 id:'quintet',name:'Soul Gems of the Quintet',type:'passive',passive:'quintet',resultItem:'quintet',series:'PUELLA MAGI MADOKA MAGICA',color:'#f0d5bd',
 ingredients:[...SOUL_GEM_IDS],consumedIngredients:[...SOUL_GEM_IDS],acceptsFusions:{soulgem:['purifiedsoul']},
 description:'Pink + Blue + Yellow + Red + Purple Soul Gems → unite all five LV 3 gems into Soul Gems of the Quintet. Retains every max-rank bonus in one passive slot and frees four slots. A Purified Pink Soul Gem keeps its extra benefits. Any character can unite the gems; Madoka then combines this item with Ultimate Madoka for Salvation.',
};
export const SALVATION_FUSION={
 id:'salvation',name:'Salvation: Five Wishes',weapon:'rosebow',series:'PUELLA MAGI MADOKA MAGICA',color:'#f4ddc0',
 passive:'quintet',requiresEvolution:'ultimate',requiredCharacter:'madoka',
 description:'Ultimate Madoka + Soul Gems of the Quintet → further evolve Madoka’s LV 5 bow into Salvation: Five Wishes. The bow releases five radiant, seeking arrows with distinct blessings and constellation bursts. First fuse the five maxed Soul Gems into Soul Gems of the Quintet, then choose this normal fusion on a level-up, in chest rewards or during Boss Rush preparation. The Quintet stays equipped and retains all its bonuses.',
};
