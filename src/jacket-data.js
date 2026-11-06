// Jacket from Hotline Miami: the silent hitman in a letterman jacket and an animal mask.
// His Uzi sprays bursts of bullets, Richard the Rooster sharpens every kill, and quick
// consecutive kills chain into a Combo that ends in a lethal frenzy.
export const JACKET_CHARACTER={
 id:'jacket',name:'Jacket',fullName:'Jacket',title:'THE MASKED KILLER',series:'HOTLINE MIAMI',color:'#e0468a',
 weapon:'uzi',passive:'roostermask',skill:'Hotline Rampage',
 description:'Spray the crowd with your Uzi while Richard the Rooster watches. Chain kills quickly to build a Combo; at ten it becomes a lethal frenzy. Then pick up the hammer and rampage through everything in reach.',
 power:5,speed:5,range:3,hp:95,move:250,
};
export const JACKET_ITEMS={
 uzi:{name:'Uzi Spray',type:'weapon',color:'#5ad8e8',owner:'Jacket',max:5,description:'Fire fast bursts of bullets in a tight spread at the nearest enemy. Ranks add bullets per burst, damage and piercing.',scaling:'+ bullets per burst, damage and piercing'},
 roostermask:{name:'Richard the Rooster',type:'passive',color:'#e8503a',owner:'Jacket',max:3,description:'+6% weapon damage and +4% move speed per rank. Jacket’s kills add 10% more Combo per rank.',scaling:'+ damage, move speed and Combo gain'},
};
export const JACKET_FUSIONS=[{
 id:'hotline',name:'Hotline Massacre',weapon:'uzi',passive:'roostermask',color:'#ff4a9a',
 description:'Uzi Spray + Richard the Rooster → twin Uzis spray piercing bullets, and every fourth burst also hurls a hammer that pierces the crowd and stuns what it hits.',
}];
