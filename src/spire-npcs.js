// Who greets you in each Ascent room. Lines are picked from the run's state so a
// re-render keeps the same line, and a purchase moves the merchant on to a new one.
export const NPCS={
 nami:{name:'Nami',series:'ONE PIECE',color:'#f08a32',lines:['Everything here has a price, and I set it. Take it or leave it!','Berries first, questions later. That’s the rule of my shop.','A navigator never sells a bad map, and I never sell a bad card.','Pleasure doing business! Come back when your pockets are heavier.']},
 goblinslayer:{name:'Goblin Slayer',series:'GOBLIN SLAYER',color:'#8c94a0',lines:['Sit. Rest. Sharpen what you carry. The climb will not wait long.','I keep watch. Sleep if you need it.','Check your gear. A dull blade gets you killed.','…Goblins? No. Not here. Rest.']},
 haganezuka:{name:'Hotaru Haganezuka',series:'DEMON SLAYER',color:'#d8b45a',lines:['You bring me broken blades? Hand them over. I’ll make something worthy of them.','Two weapons in one, forged in a single strike. Don’t you dare chip it.','The steel listens if you strike it true. Now, what are we fusing?']},
 kyubey:{name:'Kyubey',series:'MADOKA MAGICA',color:'#f29ab8',lines:['Make a contract with me, and I’ll grant you a power you can keep forever.','Every blessing has a price. That’s only fair, isn’t it?','I don’t understand why humans hesitate. The exchange is perfectly equal.']},
 ryuk:{name:'Ryuk',series:'DEATH NOTE',color:'#f4e64a',lines:['Heh. The altar only wants a little blood… or a lot of gold. Your choice.','Humans are so interesting. Got any apples?','I’m just here to watch. Go on, make your offering.']},
 urahara:{name:'Kisuke Urahara',series:'BLEACH',color:'#5a8a64',lines:['Welcome, welcome! Just a humble shopkeeper with a sack full of surprises.','No refunds, no questions. But I promise it’s worth the coin!']},
 aqua:{name:'Aqua',series:'KONOSUBA',color:'#5ab0f0',lines:['Behold, the holy water of a true goddess! Drink up, and worship me later!','This spring is blessed. By me. Obviously.']},
 yumeko:{name:'Yumeko Jabami',series:'KAKEGURUI',color:'#d8203a',lines:['Let’s gamble! The risk is what makes it delicious.','Fifty-fifty. Doesn’t your heart race just thinking about it?']},
 zoro:{name:'Roronoa Zoro',series:'ONE PIECE',color:'#3a8a3a',lines:['Take a blade. It’ll cut you on the way out, though. That’s the deal.','…Is this the exit? Doesn’t matter. Pick a weapon.']},
 gilgamesh:{name:'Gilgamesh',series:'FATE',color:'#e8b84a',lines:['All treasure in this world is mine. I allow you to take some, mongrel. For a price.','Gold, cursed or not, still shines. Will you grasp it?']},
 vegeta:{name:'Vegeta',series:'DRAGON BALL',color:'#2a3a8a',lines:['You call yourself a warrior? Prove it. Fight me, here and now.','The Prince of all Saiyans doesn’t wait. Duel, or step aside!']},
 roshi:{name:'Master Roshi',series:'DRAGON BALL',color:'#f08a3a',lines:['Ho ho! Your form is sloppy. Let an old master fix it up.','Train hard, eat well, nap often. That’s the Turtle way.']},
};
const ROOM_NPC={shop:'nami',rest:'goblinslayer',forge:'haganezuka',shrine:'kyubey',altar:'ryuk'};
const EVENT_NPC={merchant:'urahara',spring:'aqua',gamble:'yumeko',armory:'zoro',idol:'gilgamesh',champion:'vegeta',mentor:'roshi'};
export function npcFor(run){
 const id=run.screen==='event'?EVENT_NPC[run.event?.id]:ROOM_NPC[run.screen];
 return id?{id,...NPCS[id]}:null;
}
export function npcLine(run,npc){
 const sold=run.screen==='shop'?(run.shop?.cards||[]).filter(o=>o.sold).length+(run.shop?.relic?.sold?1:0)+(run.shop?.removed?1:0):0;
 if(npc.id==='nami'&&sold)return npc.lines[npc.lines.length-1];
 const seed=run.stats.floors*7+run.act*13+(run.seed%97);
 return npc.lines[(seed+sold)%(npc.id==='nami'?npc.lines.length-1:npc.lines.length)];
}
