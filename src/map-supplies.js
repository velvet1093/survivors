import {GRAVEYARD_SUPPLY_DEFS,GRAVEYARD_SUPPLIES,GRAVEYARD_SUPPLY_GEOMETRY,drawGraveyardSupply} from './graveyard-map.js';
const supply=(name,base,form,body,light,accent)=>({name,base,form,body,light,accent});
export const SUPPLY_DEFS={
 ...GRAVEYARD_SUPPLY_DEFS,
 mercenarycache:supply('Mercenary Supply Chest','crate','mercenary','#655d59','#c1aaa0','#a37768'),
 behelitidol:supply('Crimson Behelit Reliquary','pot','behelit','#9c5361','#dfb8a4','#877d79'),
 brokenstandard:supply('Broken Hawk Standard','lantern','standard','#6d555d','#d0b9a5','#a47b6c'),
 tokyovending:supply('Tokyo Drink Machine','crate','vending','#4d819b','#c7e2df','#e8b875'),
 deliverybox:supply('Convenience Delivery Box','pot','delivery','#a17c57','#e5c69b','#649e9c'),
 trafficcone:supply('Street Safety Cone','lantern','cone','#d78058','#f5e1ba','#465968'),
 cursedlocker:supply('Sealed Station Locker','crate','locker','#665b7f','#c7bddb','#df8f93'),
 stationbag:supply('Station Emergency Satchel','pot','satchel','#527f7e','#c7d9c7','#dbab8c'),
 barrierlantern:supply('Curtain Seal Lantern','lantern','seal','#78546f','#dfb9d7','#b5cee6'),
 leaframen:supply('Ichiraku Ramen Crate','crate','ramen','#a7754e','#e7c28e','#bb5f55'),
 leafscrolls:supply('Ninja Scroll Cache','pot','scrollcase','#658670','#d6d3ad','#d7b574'),
 trainingdummy:supply('Training Dummy','lantern','dummy','#98724f','#d2b48b','#486f5a'),
 arenacoffer:supply('Arena Energy Coffer','crate','arena','#7e769a','#d6ccdc','#c5a778'),
 kiurn:supply('Ki Urn','pot','kiurn','#8c7aa8','#ddd1e5','#93c8d9'),
 arenafragment:supply('Breakable Arena Fragment','lantern','fragment','#9c91a9','#ded2dc','#5a5574'),
 tempestwood:supply('Tempest Timber Cache','crate','timber','#8b7955','#cebd89','#77a48d'),
 magiccrystal:supply('Jura Magic Crystal','pot','crystal','#5296a8','#c6e6de','#92b5d6'),
 healingcaps:supply('Healing Cap Patch','lantern','mushroom','#5f9d99','#d7e7b9','#9bc7dd'),
 scoutcache:supply('Scout Ration Chest','crate','case','#717e67','#d6c8a2','#a7bcca'),
 odmgas:supply('ODM Gas Cylinder','pot','capsule','#73838a','#d9e1d4','#b4c5c0'),
 districtbarrel:supply('District Supply Barrel','lantern','barrel','#967552','#d7b98c','#687476'),
 missilecache:supply('Missile Cache','crate','case','#657d98','#c5d3df','#e7aa98'),
 chozocapsule:supply('Chozo Energy Capsule','pot','capsule','#727aa1','#d4d9d2','#92dabc'),
 containmentpod:supply('Containment Pod','lantern','containment','#546f83','#bcddd4','#af9fcf'),
 petalbasket:supply('Petal Basket','crate','basket','#a77764','#e6c89a','#e8a8c4'),
 teajar:supply('Tea Jar','pot','urn','#8da99a','#d9dfbe','#d5a4b4'),
 paperlantern:supply('Paper Lantern','lantern','paper','#bd6987','#f3c2d0','#e8d6a5'),
 relicurn:supply('Relic Urn','pot','urn','#9d9d7d','#e1d8aa','#6d9a87'),
 stonecoffer:supply('Stone Coffer','crate','coffer','#7e8780','#c6c7ac','#e3c18a'),
 sunbrazier:supply('Sun Brazier','lantern','brazier','#8b8170','#d7c99c','#ffcb83'),
 bamboobundle:supply('Bamboo Bundle','crate','bamboo','#598e7c','#a7c8a3','#d3ba91'),
 ricebasket:supply('Rice Basket','pot','basket','#7e7b91','#c6bcac','#e0dfc9'),
 spiritcandle:supply('Spirit Candle','lantern','candle','#7e91ae','#d0dbee','#b5deef'),
 candybox:supply('Candy Box','crate','candy','#ac739d','#f0bfdc','#edcf8e'),
 witchteacup:supply('Witch’s Teacup','pot','cup','#ae86b7','#f5d8e7','#b5d7b7'),
 clockdoll:supply('Clockwork Doll','lantern','clock','#87648e','#e1b1d4','#f1d59d'),
 powderbarrel:supply('Powder Barrel','crate','barrel','#8b7862','#cdb893','#687f98'),
 navalchest:supply('Naval Chest','pot','coffer','#557b98','#c6dde3','#ebd398'),
 supplycase:supply('Marine Supply Case','lantern','case','#7c949f','#d4e2de','#4a6b87'),
 iceurn:supply('Ice Urn','pot','urn','#6da2ba','#d5edf0','#f4e4bb'),
 frozencrate:supply('Frozen Crate','crate','case','#7b9cb2','#deedf0','#b8dcf0'),
 frostbrazier:supply('Frost Brazier','lantern','brazier','#6d8caa','#c5e2ed','#acf2f0'),
 armorrack:supply('Armor Stand','crate','armor','#9395a2','#dee0da','#d199ab'),
 royalurn:supply('Royal Urn','pot','urn','#967488','#e0c5bc','#eac783'),
 royalcoffer:supply('Royal Coffer','lantern','coffer','#734d69','#c998aa','#e9c97c'),
 fallenlog:supply('Fallen Log','crate','log','#716250','#c4b58b','#8fb477'),
 mushroompatch:supply('Mooncap Patch','pot','mushroom','#9a7490','#ecd2c3','#b4dc97'),
 honeyhive:supply('Honey Hive','lantern','hive','#bd995b','#f0d490','#91b77a'),
};
export const MAP_SUPPLIES={graveyard:GRAVEYARD_SUPPLIES,eclipse:['mercenarycache','behelitidol','brokenstandard'],tokyo:['tokyovending','deliverybox','trafficcone'],shibuya:['cursedlocker','stationbag','barrierlantern'],leafvillage:['leaframen','leafscrolls','trainingdummy'],tournament:['arenacoffer','kiurn','arenafragment'],tempest:['tempestwood','magiccrystal','healingcaps'],shiganshina:['scoutcache','odmgas','districtbarrel'],zebes:['missilecache','chozocapsule','containmentpod'],garden:['petalbasket','teajar','paperlantern'],ruins:['stonecoffer','relicurn','sunbrazier'],moon:['bamboobundle','ricebasket','spiritcandle'],labyrinth:['candybox','witchteacup','clockdoll'],marineford:['powderbarrel','navalchest','supplycase'],citadel:['frozencrate','iceurn','frostbrazier'],castle:['armorrack','royalurn','royalcoffer'],forest:['fallenlog','mushroompatch','honeyhive']};
// Scale and floor radius share a profile, keeping pixel silhouettes and collision in agreement.
const SUPPLY_GEOMETRY={...GRAVEYARD_SUPPLY_GEOMETRY,mercenary:[.72,19],behelit:[.75,15],standard:[.8,11],vending:[.8,20],delivery:[.65,14],cone:[.75,11],locker:[.78,18],satchel:[.62,13],seal:[.84,12],ramen:[.7,17],scrollcase:[.65,14],dummy:[.75,13],arena:[.72,17],kiurn:[.75,14],fragment:[.75,22],timber:[.68,20],crystal:[.8,17],case:[.66,15],coffer:[.72,17],barrel:[.65,15],urn:[.65,13],capsule:[.8,17],containment:[.9,19],basket:[.6,13],paper:[.75,12],brazier:[.75,14],bamboo:[.65,14],candle:[.6,10],cup:[.52,11],clock:[.65,13],armor:[.72,16],log:[.7,25],mushroom:[.62,21],hive:[.65,14],candy:[.62,14]};
export function supplyGeometry(type){const d=SUPPLY_DEFS[type];if(!d)return null;const [scale,radius]=type==='odmgas'?[.72,13]:type==='scoutcache'?[.68,20]:SUPPLY_GEOMETRY[d.form];return{scale,radius};}
export function drawMapSupply(type,R,P){
 if(drawGraveyardSupply(type,R,P))return true;
 const d=SUPPLY_DEFS[type];if(!d)return false;const {body,light,accent,form}=d,ink='#293342';
 if(form==='mercenary'){
  P([[-18,-21],[-12,-28],[13,-28],[19,-20],[18,2],[-18,2]],ink);R(-16,-20,32,20,body);P([[-15,-21],[-10,-26],[11,-26],[16,-21]],light);R(-16,-18,32,3,accent);for(const x of [-12,9]){R(x,-23,3,25,light);R(x+1,-19,1,16,'#776f68');}R(-4,-18,8,10,ink);R(-3,-17,6,6,accent);R(-1,-16,2,3,light);R(-15,-6,30,2,'#3b3940');P([[-7,-31],[-5,-35],[2,-35],[5,-31],[12,-30],[12,-28],[-8,-28]],'#bcb3a2');R(-12,-27,2,5,ink);R(10,-26,2,5,ink);
 }else if(form==='behelit'){
  R(-15,-3,30,6,ink);R(-12,-5,24,4,accent);R(-8,-14,16,10,'#665c63');R(-6,-13,12,7,light);P([[-9,-18],[-10,-31],[-6,-42],[1,-46],[8,-40],[11,-29],[8,-17],[1,-12]],ink);P([[-7,-19],[-8,-30],[-5,-40],[1,-43],[6,-38],[8,-29],[6,-19],[1,-15]],body);P([[-4,-38],[0,-41],[4,-38],[1,-35]],'#c1847f');R(-6,-30,4,2,'#4c3345');R(3,-35,2,4,'#4c3345');P([[-1,-29],[2,-27],[-1,-24],[-3,-26]],light);R(3,-22,3,2,'#4c3345');R(-2,-20,2,2,'#dfbdab');R(-9,-2,18,2,'#a59187');
 }else if(form==='standard'){
  R(-10,0,21,3,ink);R(-7,-2,15,3,accent);P([[-2,1],[-2,-49],[1,-54],[3,-49],[2,1]],ink);R(0,-47,1,46,light);P([[2,-47],[18,-45],[14,-33],[17,-28],[8,-30],[3,-27]],ink);P([[3,-45],[15,-43],[12,-34],[14,-31],[8,-33],[3,-30]],body);P([[5,-41],[8,-39],[12,-41],[10,-36],[7,-34],[5,-37]],light);R(7,-42,2,4,light);R(-6,-42,12,3,accent);P([[-5,-16],[-10,-12],[-15,-14],[-13,-9],[-6,-7],[-2,-11]],'#806d65');R(-12,-10,6,1,light);
 }else if(form==='vending'){
  R(-15,-43,31,45,ink);R(-13,-41,27,41,body);R(-11,-39,23,5,accent);R(-10,-38,17,2,light);R(-10,-31,16,23,'#263e51');
  for(const y of [-28,-21,-14])for(const x of [-7,-1,5]){R(x,y,3,5,x%2?light:accent);R(x,y,3,1,'#f3e9c9');}R(8,-30,4,13,light);R(9,-27,2,3,'#628c9e');R(8,-12,4,5,ink);R(-9,-5,17,4,ink);R(-8,-4,15,1,light);R(-12,1,25,2,'#60717c');
 }else if(form==='delivery'){
  P([[-17,-19],[5,-24],[18,-17],[17,0],[-5,4],[-17,-3]],ink);P([[-15,-18],[5,-22],[16,-16],[15,-1],[-4,2],[-15,-4]],body);P([[-15,-18],[5,-22],[16,-16],[-4,-12]],light);for(const xx of [-6,7])R(xx,-19,3,20,accent);P([[-6,-11],[8,-13],[8,-6],[-5,-4]],'#eee2c1');R(-3,-10,8,1,'#526665');R(-3,-7,5,1,'#526665');R(-12,-9,4,1,'#d3b38b');
 }else if(form==='cone'){
  P([[-14,0],[-10,-5],[10,-5],[15,1],[10,4],[-10,4]],ink);P([[-10,-3],[-3,-34],[3,-34],[11,-3]],ink);P([[-8,-4],[-2,-31],[2,-31],[8,-4]],body);P([[-5,-19],[5,-19],[6,-14],[-6,-14]],light);P([[-7,-9],[7,-9],[8,-5],[-8,-5]],light);R(-12,0,24,2,accent);R(-1,-30,1,9,'#edaf7d');
 }else if(form==='locker'){
  R(-16,-34,32,36,ink);R(-14,-32,28,32,body);for(const x of [-12,1]){R(x,-29,11,26,'#3e4057');R(x+1,-28,9,24,light);R(x+7,-18,1,6,ink);for(const y of [-25,-7])R(x+2,y,6,1,body);}R(-14,-33,28,3,accent);R(-3,-27,6,23,'#e5d6bd');for(const y of [-24,-19,-14,-9]){R(-2,y,4,1,'#9c5f73');R(0,y,1,3,'#9c5f73');}R(-15,0,30,3,ink);
 }else if(form==='satchel'){
  P([[-13,-18],[-8,-24],[8,-24],[14,-18],[14,1],[-13,1]],ink);R(-11,-17,23,17,body);R(-9,-22,17,5,body);R(-5,-26,10,4,ink);R(-3,-25,6,2,light);R(-11,-16,23,5,light);R(-10,-8,21,2,accent);R(-3,-14,7,12,accent);R(-6,-11,13,5,accent);R(-2,-13,5,10,light);R(-5,-10,11,3,light);R(-11,0,23,2,ink);
 }else if(form==='seal'){
  R(-2,-43,4,10,accent);R(-7,-35,14,3,ink);P([[-8,-32],[8,-32],[12,-25],[11,-8],[6,-3],[-7,-3],[-12,-10],[-12,-25]],ink);P([[-7,-30],[7,-30],[10,-24],[9,-10],[5,-5],[-6,-5],[-10,-11],[-10,-24]],body);for(const x of [-7,0,7])R(x,-28,1,20,light);R(-4,-26,9,16,'#eddec5');for(const y of [-23,-18,-13]){R(-2,y,5,1,'#78566d');R(0,y,1,3,'#78566d');}R(-7,-6,14,3,accent);R(-1,-3,2,6,accent);R(-3,2,6,2,light);
 }else if(form==='ramen'){
  R(-16,-23,32,24,ink);R(-14,-21,28,21,body);R(-14,-21,28,4,light);R(-14,-10,28,2,'#6b5548');R(-11,-21,3,22,accent);R(8,-21,3,22,accent);R(-6,-16,13,12,'#dfd1a1');P([[-5,-12],[6,-12],[4,-7],[-3,-7]],'#b55d51');R(-3,-14,8,2,'#5f6657');R(-8,-24,16,2,'#cbb282');
 }else if(form==='scrollcase'){
  R(-15,-22,30,23,ink);R(-13,-20,26,20,body);R(-13,-18,26,3,accent);R(-13,-7,26,3,accent);for(const [xx,h]of [[-10,29],[-2,34],[6,27]]){R(xx,-h,6,h-21,ink);R(xx+1,-h+1,4,h-22,light);R(xx,-h,6,2,accent);}R(-4,-16,9,8,light);P([[-2,-13],[2,-14],[3,-11],[0,-9],[-2,-10]],'#597761');
 }else if(form==='dummy'){
  R(-3,-38,6,40,body);R(-16,-25,32,5,ink);R(-15,-24,30,3,light);P([[-10,-35],[-7,-42],[7,-42],[11,-35],[9,-8],[-9,-8]],ink);R(-8,-34,16,24,body);R(-6,-32,12,20,light);for(const yy of [-29,-20,-12])R(-8,yy,16,3,accent);R(-5,-39,10,3,light);R(-10,0,20,3,ink);R(-8,0,16,1,light);R(-1,-25,2,9,'#785c43');
 }else if(form==='arena'){
  P([[-16,-18],[-11,-25],[12,-25],[17,-18],[17,0],[-16,0]],ink);R(-14,-18,29,17,body);P([[-13,-19],[-9,-23],[10,-23],[14,-19]],light);R(-14,-13,29,3,accent);R(-11,-19,3,18,light);R(9,-19,3,18,light);P([[-4,-13],[4,-13],[6,-8],[0,-3],[-6,-8]],accent);R(-1,-10,2,5,'#f4e2bb');R(-12,-5,24,1,'#514c6d');
 }else if(form==='kiurn'){
  P([[-6,-30],[6,-30],[7,-24],[13,-18],[12,-5],[6,1],[-6,1],[-13,-5],[-13,-18],[-7,-24]],ink);P([[-5,-28],[5,-28],[5,-23],[10,-17],[10,-6],[5,-1],[-5,-1],[-10,-6],[-10,-17],[-5,-23]],body);R(-6,-29,12,4,light);R(-10,-18,20,3,accent);R(-7,-14,3,10,light);P([[1,-19],[6,-11],[1,-4],[-3,-10]],accent);R(1,-15,2,7,'#edf0d9');R(-6,-1,12,2,light);
 }else if(form==='fragment'){
  P([[-20,1],[-22,-12],[-13,-25],[-3,-30],[13,-24],[21,-9],[17,2]],ink);P([[-18,-1],[-19,-11],[-11,-23],[-3,-27],[12,-22],[18,-9],[15,0]],body);P([[-16,-12],[-10,-22],[-3,-25],[10,-21],[13,-16],[3,-12]],light);P([[-3,-18],[1,-13],[-1,-7],[4,-1],[-3,-4],[-5,-10]],accent);R(-13,-6,7,2,light);R(9,-8,6,2,'#79718f');
 }else if(form==='timber'){
  R(-18,-23,36,24,ink);R(-16,-21,32,21,body);R(-16,-21,32,4,light);R(-16,-12,32,2,'#5b6049');R(-15,-5,30,2,'#5b6049');R(-12,-22,3,23,accent);R(9,-22,3,23,accent);P([[-6,-14],[0,-18],[6,-13],[0,-6]],'#c7d7aa');R(-1,-15,2,6,'#579e9e');R(-12,-25,24,3,'#798665');
 }else if(form==='crystal'){
  P([[-15,1],[-14,-15],[-7,-26],[-3,-16],[4,-39],[11,-25],[16,-9],[13,2]],ink);P([[-12,-1],[-11,-14],[-7,-21],[-5,-11],[4,-35],[8,-24],[12,-9],[10,0]],body);P([[3,-31],[5,-25],[4,-3],[0,-7]],light);P([[-9,-16],[-7,-20],[-6,-5],[-10,-3]],accent);P([[8,-21],[10,-12],[9,-2],[6,-5]],accent);R(-16,-1,32,3,'#536f66');R(-4,-7,2,4,'#def0d2');
 }else if(type==='scoutcache'){
  P([[-16,-16],[12,-20],[18,-15],[18,0],[-12,3],[-17,-2]],ink);P([[-14,-15],[12,-18],[16,-14],[16,-1],[-11,1],[-15,-3]],body);P([[-14,-15],[12,-18],[16,-14],[-10,-11]],light);R(-11,-10,26,2,'#465e56');R(-10,-15,3,17,'#a5aa84');R(10,-16,3,16,'#a5aa84');P([[-5,-8],[0,-10],[5,-8],[4,-2],[0,0],[-5,-3]],'#cbdcc4');R(-3,-7,2,5,'#7d9eaa');R(1,-7,2,4,'#7d9eaa');
 }else if(type==='odmgas'){
  for(const xx of [-9,3]){P([[xx,-27],[xx+7,-27],[xx+9,-23],[xx+9,-3],[xx+6,0],[xx+1,0],[xx-1,-3],[xx-1,-23]],ink);R(xx,-24,8,21,body);R(xx+1,-24,2,19,light);R(xx,-16,8,3,accent);R(xx,-6,8,2,'#465f64');R(xx+2,-30,3,4,light);R(xx,-31,7,2,'#9f9e80');}R(-3,-22,6,3,'#8b7963');R(-2,-22,4,1,'#d6bd8e');
 }else if(type==='missilecache'){
  P([[-16,-17],[12,-20],[17,-15],[17,0],[-15,0]],ink);R(-14,-16,29,15,body);P([[-14,-17],[11,-19],[15,-15],[-10,-13]],light);R(-10,-16,2,16,'#4b6477');R(10,-16,2,16,'#4b6477');R(-12,-11,25,2,'#a9babd');P([[-4,-9],[5,-9],[9,-6],[5,-3],[-4,-3]],accent);R(-8,-8,5,4,'#e4d1a0');R(-3,-8,7,1,'#f1ddba');R(-8,-17,13,2,'#7b8e9d');
 }else if(type==='teajar'){
  P([[-7,-23],[7,-23],[6,-19],[11,-15],[12,-6],[8,0],[-8,0],[-12,-6],[-11,-15],[-6,-19]],ink);P([[-6,-21],[6,-21],[5,-18],[9,-14],[10,-7],[6,-2],[-6,-2],[-10,-7],[-9,-14],[-5,-18]],body);R(-7,-23,14,3,accent);R(-5,-24,10,1,light);R(-7,-14,3,10,light);R(-3,-13,8,9,'#e9dfb8');P([[0,-11],[4,-10],[1,-7],[-1,-6]],'#5b9a77');R(-5,-3,11,1,'#426d62');
 }else if(type==='royalcoffer'){
  R(-14,-13,29,14,ink);P([[-14,-13],[-12,-21],[-6,-25],[7,-25],[14,-20],[15,-13]],ink);P([[-12,-14],[-10,-20],[-5,-23],[6,-23],[12,-19],[13,-14]],body);R(-12,-13,25,12,body);R(-11,-13,23,3,accent);R(-10,-20,2,21,accent);R(9,-20,2,21,accent);P([[-2,-12],[3,-12],[5,-8],[1,-3],[-4,-8]],'#ebc77c');P([[0,-10],[2,-9],[1,-6],[-1,-8]],'#dda6c9');R(-11,-3,23,2,light);
 }else if(type==='districtbarrel'||type==='powderbarrel'){
  P([[-7,-26],[7,-26],[12,-20],[13,-7],[8,1],[-8,1],[-13,-7],[-12,-20]],ink);P([[-7,-24],[6,-24],[10,-20],[11,-8],[7,-1],[-7,-1],[-11,-8],[-10,-20]],body);for(const xx of [-7,-3,2,6])R(xx,-21,2,18,light);R(-11,-20,22,3,accent);R(-12,-8,24,3,accent);P([[-6,-24],[6,-24],[9,-21],[-9,-21]],light);R(-5,-23,10,1,'#72634e');R(7,-16,3,6,'#655846');
 }else if(form==='capsule'||form==='containment'){R(-12,-27,25,28,ink);R(-10,-25,21,24,body);R(-8,-23,17,18,accent);R(-6,-22,3,15,light);R(-12,-29,25,5,light);R(-12,-4,25,5,light);R(-3,-33,7,4,body);if(form==='containment'){P([[-6,-14],[-4,-21],[3,-22],[7,-15],[3,-11],[-3,-11]],'#9dd5ac');R(-3,-17,3,3,'#d58b9c');R(1,-16,3,3,'#d58b9c');R(-4,-10,2,5,light);R(4,-10,2,5,light);}else{R(-3,-18,7,3,'#f6edd1');R(-1,-20,3,7,'#f6edd1');}}
 else if(form==='coffer'||form==='case'||form==='candy'){
  R(-12,-20,25,21,ink);R(-11,-19,23,18,body);R(-11,-19,23,5,light);R(-11,-11,23,2,ink);R(-8,-19,2,20,accent);R(7,-19,2,20,accent);R(-3,-12,7,7,accent);R(-1,-10,2,3,ink);
  if(form==='candy'){P([[-2,-20],[-11,-27],[-12,-21],[-4,-17]],accent);P([[2,-20],[12,-27],[13,-21],[4,-17]],accent);R(-9,-6,3,2,light);R(6,-5,3,2,light);}
  if(form==='case'){R(-9,-24,18,4,ink);R(-6,-23,12,3,body);R(-5,-17,10,2,accent);R(-1,-18,2,5,accent);}
 }else if(form==='urn'){
  P([[-6,-23],[6,-23],[5,-17],[11,-11],[10,-1],[5,3],[-6,3],[-11,-1],[-12,-11],[-5,-17]],ink);P([[-5,-22],[5,-22],[4,-16],[9,-11],[8,-1],[4,1],[-5,1],[-9,-1],[-10,-11],[-4,-16]],body);R(-6,-23,12,3,light);R(-8,-12,16,3,accent);R(-7,-10,2,7,light);R(-5,-2,10,2,light);R(-3,-21,6,1,ink);
  if(type==='royalurn')P([[-3,-8],[0,-12],[3,-8],[0,-4]],accent);if(type==='iceurn'){P([[4,-18],[8,-10],[4,-3]],light);R(-11,-1,3,3,accent);}
 }else if(form==='basket'){
  P([[-13,-15],[13,-15],[10,1],[-9,1]],ink);P([[-11,-14],[11,-14],[8,0],[-8,0]],body);for(const x of [-8,-3,2,7])R(x,-13,1,12,light);R(-10,-8,20,2,accent);R(-12,-16,24,3,light);
  for(let i=0;i<5;i++){const xx=-8+i*4,yy=-18-(i%2)*3;R(xx,yy,4,4,accent);R(xx+1,yy,2,1,light);}
 }else if(form==='paper'){
  R(-2,-37,3,8,accent);R(-3,-30,6,3,ink);P([[-6,-27],[7,-27],[11,-20],[10,-10],[5,-5],[-6,-5],[-10,-11],[-10,-21]],ink);P([[-5,-26],[6,-26],[9,-20],[8,-11],[4,-7],[-5,-7],[-8,-12],[-8,-21]],body);for(const x of [-5,0,5])R(x,-25,1,18,light);R(-6,-24,12,2,accent);R(-5,-9,10,2,accent);R(-2,-6,4,3,ink);R(-1,-3,2,7,accent);
 }else if(form==='brazier'){
  R(-10,-2,21,4,ink);R(-7,-5,15,5,body);R(-3,-22,6,18,light);P([[-14,-25],[14,-25],[10,-16],[-9,-16]],ink);P([[-11,-24],[11,-24],[7,-18],[-7,-18]],body);P([[-7,-25],[-8,-30],[-3,-28],[1,-39],[4,-29],[8,-33],[8,-25]],accent);P([[-2,-25],[1,-33],[4,-25]],light);
 }else if(form==='bamboo'){
  for(let i=0;i<5;i++){const xx=-10+i*5,yy=-22-i%2*6;R(xx,yy,5,-yy+1,ink);R(xx+1,yy+1,3,-yy-1,body);for(let j=1;j<3;j++)R(xx+1,yy+j*8,3,1,light);}R(-12,-13,27,3,accent);R(-11,-5,25,2,accent);
 }else if(form==='candle'){
  R(-10,-2,20,3,ink);R(-8,-5,16,4,body);for(const [x,h]of [[-7,18],[0,29],[6,21]]){R(x-2,-h,5,h-5,ink);R(x-1,-h+1,3,h-6,light);P([[x-2,-h-2],[x,-h-9],[x+3,-h-2]],accent);R(x,-h-5,1,4,'#fff4dd');}
 }else if(form==='cup'){
  R(8,-18,9,11,ink);R(10,-16,5,7,light);R(10,-15,3,5,body);P([[-12,-24],[12,-24],[8,-7],[3,-4],[-5,-4],[-9,-8]],ink);P([[-10,-22],[10,-22],[6,-8],[2,-6],[-4,-6],[-7,-9]],light);R(-8,-22,16,3,body);R(-6,-14,12,2,accent);R(-13,-3,27,3,ink);R(-11,-3,23,1,light);
 }else if(form==='clock'){
  P([[-11,1],[-11,-20],[-8,-26],[0,-30],[8,-26],[11,-20],[11,1]],ink);R(-9,-20,18,21,body);R(-5,-26,10,7,body);R(-6,-23,13,13,accent);R(-4,-21,9,9,light);R(0,-20,1,6,ink);R(0,-15,4,1,ink);R(-3,-6,6,2,light);R(-1,-8,2,7,accent);R(-13,0,26,3,light);
 }else if(form==='barrel'){
  P([[-9,-24],[9,-24],[13,-18],[13,-5],[9,2],[-9,2],[-13,-5],[-13,-18]],ink);R(-11,-19,22,17,body);R(-8,-23,16,3,light);for(const x of [-8,-3,2,7])R(x,-19,1,17,light);R(-12,-17,24,3,accent);R(-12,-6,24,3,accent);R(-7,-21,14,1,ink);R(-4,-11,8,4,ink);
 }else if(form==='armor'){
  R(-10,0,21,3,body);R(-2,-32,4,32,body);R(-16,-24,33,4,ink);P([[-10,-23],[-5,-27],[6,-27],[12,-23],[9,-8],[0,-5],[-9,-9]],ink);P([[-8,-22],[-4,-25],[5,-25],[10,-22],[7,-10],[0,-7],[-7,-11]],body);R(-1,-23,3,14,light);P([[-8,-22],[-4,-18],[-7,-12]],light);P([[5,-24],[8,-20],[4,-14]],accent);R(-7,-38,14,10,ink);R(-5,-37,10,7,light);R(-5,-33,10,2,ink);R(0,-37,1,7,body);
 }else if(form==='log'){
  R(-19,-15,39,14,ink);R(-18,-14,35,11,body);P([[15,-17],[21,-13],[21,-4],[16,0],[10,-3],[10,-13]],ink);P([[15,-15],[19,-12],[19,-5],[16,-2],[12,-4],[12,-12]],light);R(15,-11,2,6,body);R(-14,-11,21,1,light);R(-8,-7,14,1,ink);P([[-11,-14],[-8,-21],[-4,-21],[-6,-13]],body);R(-11,-15,10,3,accent);
 }else if(form==='mushroom'){
  for(const [xx,h]of [[-10,14],[2,23],[13,10]]){R(xx-2,-h+5,5,h-4,ink);R(xx-1,-h+5,3,h-5,light);P([[xx-9,-h+7],[xx-7,-h],[xx-1,-h-4],[xx+6,-h+1],[xx+8,-h+7]],ink);P([[xx-7,-h+5],[xx-5,-h],[xx-1,-h-2],[xx+4,-h+1],[xx+6,-h+5]],body);R(xx-2,-h,3,2,light);R(xx+2,-h+3,2,1,accent);}
 }else if(form==='hive'){
  R(-2,-37,4,17,body);R(-12,-39,25,4,ink);R(-11,-38,23,2,accent);P([[-5,-25],[6,-25],[12,-17],[12,-6],[7,1],[-6,1],[-13,-6],[-13,-17]],ink);for(let i=0;i<5;i++){const width=[14,20,23,20,14][i];R(-width/2,-24+i*5,width,4,i%2?body:light);}R(-2,-12,7,5,ink);R(-13,-1,4,3,accent);
 }
 return true;
}
