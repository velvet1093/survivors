// Lelouch vi Britannia and C.C. from Code Geass: two heroes played as one. Lelouch commands
// enemies with the Geass she gave him; C.C. walks beside him and fires her pistol. Their
// ultimate puts them in the Gawain together: C.C. pilots while Lelouch fires the Hadron Cannons.
export const LELOUCH_CHARACTER={
 id:'lelouch',name:'Lelouch & C.C.',fullName:'Lelouch vi Britannia & C.C.',title:'THE DEMON KING & THE WITCH',series:'CODE GEASS',color:'#d8304a',
 weapon:'geass',passive:'witchcode',skill:'Gawain',duo:'cc',
 description:'Two heroes, one contract. Lelouch’s Geass commands enemies to turn on their own while C.C. covers him with her pistol. Commanded kills build Checkmate for a mass command, and together they board the Gawain for thirty seconds, extended by every kill.',
 power:4,speed:3,range:4,hp:90,move:235,
};
export const LELOUCH_ITEMS={
 geass:{name:'Absolute Command',type:'weapon',color:'#e8304a',owner:'Lelouch & C.C.',max:5,description:'Lelouch’s Geass commands the enemies nearest his target. Commanded enemies stop attacking you, hunt their own allies and hit them hard until the order wears off. Bosses are only stunned briefly. Ranks command more enemies, for longer and with more force.',scaling:'+ enemies commanded, duration and damage'},
 witchcode:{name:'The Witch’s Code',type:'passive',color:'#8ae06a',owner:'Lelouch & C.C.',max:3,description:'C.C. fights beside Lelouch with her pistol. Each rank gives +5% weapon damage and +8 max HP, makes her shots stronger and faster, and adds 10% more Checkmate gain.',scaling:'+ damage, max HP, C.C.’s fire rate and Checkmate'},
};
export const LELOUCH_FUSIONS=[{
 id:'kingspower',name:'The Power of the King',weapon:'geass',passive:'witchcode',color:'#ff4a6a',
 description:'Absolute Command + The Witch’s Code → the Geass commands twice as many enemies, and when an order ends it is obeyed to the last: “Die.” Each commanded enemy falls and bursts, hurting the enemies around it. C.C. fires twin shots.',
}];
