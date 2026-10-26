export const DENJI_CHARACTER={
 id:'denji',name:'Denji',title:'THE CHAINSAW HEART',series:'CHAINSAW MAN',color:'#e6a078',
 weapon:'chainsaw',passive:'bloodengine',skill:'Chainsaw Man',
 description:'Rush into close range with a roaring chainsaw. Successful sweeps and kills build Blood Engine Rev; at full charge, your next sweep tears through a wider arc. Pull the cord to become Chainsaw Man: rapid bleeding cuts and limited healing reward staying in the fight.',
 power:5,speed:4,range:2,hp:120,move:235,
};
export const DENJI_ITEMS={
 chainsaw:{name:'Pochita’s Chainsaw',type:'weapon',color:'#df9870',owner:'Denji',max:5,description:'Carve a nearby forward arc with a tangible chainsaw, inflicting bleeding. Ranks increase damage and reach. Denji builds Rev from connected sweeps and empowers the next enemy-directed cut at full charge.',scaling:'+ damage, reach and bleeding'},
 bloodengine:{name:'Blood Engine',type:'passive',color:'#d99286',owner:'Denji',max:3,description:'+10 maximum HP and +4% weapon damage per rank. Denji gains 10% more Rev per rank; supports the Chainsaw Overdrive evolution.',scaling:'+ maximum HP, damage and Denji Rev gain'},
};
export const DENJI_FUSIONS=[{
 id:'chainsawoverdrive',name:'Chainsaw Overdrive',weapon:'chainsaw',passive:'bloodengine',color:'#eab08a',
 description:'Pochita’s Chainsaw + Blood Engine → roaring dual-blade sweeps carve a broader, longer arc, deal heavier damage and sustain a stronger bleed. Denji retains his Rev empowerment.',
}];
