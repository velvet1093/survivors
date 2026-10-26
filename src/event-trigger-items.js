import {GRAVEYARD_TRIGGER_ITEMS} from './graveyard-events.js';
// Consumables share the three keepsake slots, but grant no passive bonus and
// never refine. Their event starts only when the player explicitly uses one.
export const EVENT_TRIGGER_ITEMS=[
 {id:'beherit',name:'Crimson Beherit',series:'BERSERK',color:'#d38d98',category:'event',consumable:true,eventId:'eclipse',dropWeight:.25,description:'Carry this crimson stone in a trinket slot. Use it when ready to summon the Eclipse, its Apostles and Femto. Consumed only when the event begins; cannot be refined.'},
 {id:'raigodrum',name:'Raigo Thunder Drum',series:'ONE PIECE',color:'#d8c181',category:'event',consumable:true,eventId:'storm',dropWeight:.25,description:'Carry this thunder drum in a trinket slot. Use it when ready to summon a storm, its lightning foes and Enel. Consumed only when the event begins; cannot be refined.'},
 {id:'frostseal',name:'Whiteout Frost Seal',series:'ONE PIECE',color:'#b4d9e6',category:'event',consumable:true,eventId:'blizzard',dropWeight:.25,description:'Carry this frozen seal in a trinket slot. Use it when ready to summon a blizzard, its frost foes and Aokiji. Consumed only when the event begins; cannot be refined.'},
 ...GRAVEYARD_TRIGGER_ITEMS,
];
const triggers=new Map(EVENT_TRIGGER_ITEMS.map(item=>[item.id,item]));
export const eventTriggerFor=id=>triggers.get(id)||null;
export const isEventTrigger=id=>triggers.has(id);
