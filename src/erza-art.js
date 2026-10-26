import {buildHero,torso,casual,pajamas,swim,bikini,yukata,skirt,emblem,longHairBack,bow,mix,SKIN} from './hero-builder.js';
import {eye,mouth,limb,lid,brow,tear} from './hero-kit.js';
// Erza: waist-length scarlet hair with a long fringe, brown eyes. Each Requip armour has
// its own body in the default skin and its own gear over every other outfit:
// 0 Heaven's Wheel (silver blade wings), 1 Black Wing (dark bat wings), 2 Adamantine
// (twin great shields), 3 Heart Kreuz (silver breastplate, blue skirt, one sword).
export const ERZA_COLORS={hair:'#d14b52',hairShade:'#8a2b3a',hairLight:'#f2887c',silver:'#b9c9d6',silverShade:'#6a8098',silverLight:'#eef4f2',blue:'#536a9b',blueDark:'#303d65',gold:'#d8b56a',dark:'#3a3448',darkShade:'#221e2c',darkLight:'#5c5470',iris:'#8a5a3e'};
const C=ERZA_COLORS,INK='#30323f',H={h:C.hair,s:C.hairShade,l:C.hairLight};
const formIndex=form=>typeof form==='number'?((Math.floor(form)%4)+4)%4:({wheel:0,heavenswheel:0,blackwing:1,adamantine:2,base:3,heartkreuz:3}[form]??3);
function face(r,c){
 const y=c.y,hurt=c.expression==='hurt',focus=c.expression==='focused'||c.expression==='ultimate';
 for(const [x,side]of [[21,-1],[31,1]])eye(r,x,26+y,{iris:C.iris,irisDark:'#4a2e22',lash:INK,side,closed:c.blink,hurt,focus});
 if(!c.blink)for(const [x,side]of [[21,-1],[31,1]])brow(r,x,24+y,{color:C.hairShade,side,tilt:hurt?-1:1});
 if(c.expression==='neutral')r.rect(27,34+y,3,1,'#b86e74');
 else if(c.expression==='ultimate'){r.rect(26,34+y,5,3,'#7a3040');r.rect(26,34+y,5,1,'#fff4ec');}
 else mouth(r,34+y,c.expression,{lip:'#b86e74'});
}
function bangs(r,c){
 const y=c.y,{poly,line}=r;
 poly([[16,30+y],[15,20+y],[19,12+y],[27,9+y],[35,11+y],[40,18+y],[41,30+y],[38,40+y],[36,26+y],[33,20+y],[29,25+y],[26,19+y],[22,24+y],[20,22+y],[20,26+y],[18,40+y]],H.s);
 poly([[17,28+y],[17,19+y],[21,13+y],[27,11+y],[34,13+y],[38,18+y],[39,28+y],[36,22+y],[33,18+y],[29,23+y],[26,17+y],[22,22+y],[20,20+y],[19,30+y]],H.h);
 // A long lock sweeps across her right eye.
 poly([[22,14+y],[26,14+y],[23,28+y],[21,27+y]],H.h);line(23,16+y,23,26+y,H.l);line(21,15+y,27,12+y,H.l);
}
// ----- Armour bodies for the default skin -----
function heartKreuz(r,c){
 const b=torso(r,c,{color:C.silver,shade:C.silverShade,light:C.silverLight,bottom:50});
 r.rect(26,b.t+3+c.y,4,8,C.gold);r.rect(24,b.t+5+c.y,8,3,C.gold);r.rect(27,b.t+4+c.y,2,6,'#f3dc94');
 skirt(r,c,{top:49,bottom:60,flare:5,color:C.blue,shade:C.blueDark,light:'#7a8fc0'});
 return {sleeve:'#ffffff',sleeveLight:'#ffffff',cuff:C.silver,legs:'bare',legTop:58,boots:60,shoe:'#2a2a36',shoeLight:'#4a4a5a'};
}
function wheelArmor(r,c){
 const b=torso(r,c,{color:C.silver,shade:C.silverShade,light:C.silverLight,bottom:52});
 r.line(b.l+2,b.t+5+c.y,b.r-2,b.t+5+c.y,C.gold);r.rect(26,b.t+2+c.y,4,4,C.gold);
 skirt(r,c,{top:51,bottom:58,flare:6,color:C.silverLight,shade:C.silverShade,pleats:false});
 return {sleeve:C.silver,sleeveLight:C.silverLight,cuff:C.gold,legs:C.silver,legShade:C.silverShade,legTop:57,boots:60,shoe:C.silverLight,shoeLight:'#ffffff'};
}
function blackWingArmor(r,c){
 const b=torso(r,c,{color:C.dark,shade:C.darkShade,light:C.darkLight,bottom:50});
 r.rect(b.l+2,b.t+c.y,b.r-b.l-4,3,C.darkShade);r.rect(27,b.t+4+c.y,2,6,'#8a6ab0');
 return {sleeve:C.dark,sleeveLight:C.darkLight,cuff:'#8a6ab0',legs:C.dark,legShade:C.darkShade,legLight:C.darkLight,legTop:50,boots:60,shoe:C.darkShade,shoeLight:C.darkLight};
}
function adamantineArmor(r,c){
 const b=torso(r,c,{color:'#a9d7e5',shade:'#5a8aa0',light:'#e2f4f8',bottom:54});
 r.rect(b.l+2,b.t+4+c.y,b.r-b.l-4,2,C.gold);r.rect(26,b.t+7+c.y,4,4,C.gold);
 return {sleeve:'#a9d7e5',sleeveLight:'#e2f4f8',cuff:C.gold,sleeveWidth:6,legs:'#a9d7e5',legShade:'#5a8aa0',legTop:54,boots:60,shoe:'#5a8aa0',shoeLight:'#e2f4f8'};
}
// ----- Armour gear drawn over any outfit -----
function sword(r,x,y,tx,ty,dark=false){const {line,rect}=r;line(x,y,tx,ty,dark?'#a8a1bc':C.silverLight,2);line(x,y,tx,ty,'#ffffff');rect(x-2,y-1,5,2,C.gold);}
function wheelWings(r,c){
 const y=c.y,{poly,line}=r;
 for(const side of [-1,1]){const p=(dx,yy)=>[28+side*dx,yy+y],sway=c.walk*.3;
  poly([p(10,36),p(22,24),p(27,26),p(23,36),p(26,48+sway),p(18,44),p(20,54+sway),p(12,46)],C.silverShade);
  poly([p(11,37),p(21,27),p(25,28),p(21,37),p(23,46+sway),p(18,42),p(18,50+sway),p(13,44)],C.silver);
  line(...p(13,36),...p(23,28),C.silverLight);line(...p(13,40),...p(22,44+sway),C.silverLight);line(...p(11,37),...p(13,46),C.gold);}
}
function blackWings(r,c){
 const y=c.y,{poly,line}=r;
 for(const side of [-1,1]){const p=(dx,yy)=>[28+side*dx,yy+y];
  poly([p(10,36),p(26,22),p(25,32),p(27,40),p(22,38),p(24,48),p(17,42),p(14,50),p(10,42)],C.darkShade);
  poly([p(11,37),p(24,25),p(23,32),p(25,38),p(21,37),p(22,45),p(17,40),p(14,46),p(11,41)],C.dark);
  line(...p(11,37),...p(24,25),C.darkLight);}
}
function shields(r,c){
 const y=c.y,{poly,rect}=r;
 for(const x of [4,40]){poly([[x,36+y],[x+12,36+y],[x+12,52+y],[x+6,58+y],[x,52+y]],'#5a8aa0');poly([[x+1,37+y],[x+11,37+y],[x+11,51+y],[x+6,56+y],[x+1,51+y]],'#a9d7e5');rect(x+5,39+y,2,14,C.gold);rect(x+2,44+y,8,2,C.gold);}
}
function gear(r,c,form,inArmor){
 if(form===0)wheelWings(r,c);else if(form===1)blackWings(r,c);else if(form===2&&!inArmor)shields(r,c);
}
function erzaArms(r,c,g,form){
 const sleeve=g.bareArms?{color:SKIN.base,light:SKIN.light,width:4}:{color:g.sleeve,light:g.sleeveLight,width:g.sleeveWidth||5,hand:SKIN.base,handShade:SKIN.shade},sy=40+c.y;
 const arm=(x0,y0,x1,y1)=>{if(g.short){limb(r,x0,y0,x1,y1,{color:SKIN.base,light:SKIN.light,width:4});limb(r,x0,y0,Math.round((x0+x1)/2),Math.round((y0+y1)/2),{...sleeve,hand:null});}else{limb(r,x0,y0,x1,y1,sleeve);if(g.cuff)r.rect(x1-1,y1+2,5,2,g.cuff);}};
 if(c.special){arm(18,sy,10,sy-8);arm(38,sy,46,sy-8);
  // Nakagami / Requip: golden light gathers above both hands.
  for(const x of [9,46]){r.rect(x,sy-12,3,3,'#f3dc94');r.put(x+1,sy-13,'#ffffff');}return;}
 arm(18,sy,14,sy+12);
 if(c.attack)arm(38,sy,47,sy+1);else arm(38,sy,42,sy+12);
 if(form===2&&g.armor){shields(r,c);return;}
 // Swords: one Heart Kreuz blade, a dark Black Wing blade, a pair for Heaven's Wheel.
 const [hx,hy]=c.attack?[49,sy+2]:[44,sy+14];
 if(c.attack)sword(r,hx,hy,hx+7,hy-8,form===1);else sword(r,hx,hy,hx+4,hy+14,form===1);
 if(form===0)sword(r,14,sy+14,9,sy+28);
}
const ARMOR=[wheelArmor,blackWingArmor,adamantineArmor,heartKreuz];
const OUTFITS={
 casual:(r,c)=>casual(r,c,{top:'tee',color:'#f4f1ea',jacket:'#536a9b',bottom:'skirt',skirtColor:'#303d65',motif:(r,c)=>{r.rect(26,44+c.y,4,3,'#d14b52');},shoe:'#5a3a2c'}),
 pajamas:(r,c)=>pajamas(r,c,{color:'#f3b8c4',trim:'#ffffff',motif:(r,c)=>{for(const [x,yy]of [[22,45],[33,48],[24,51]]){r.rect(x,yy,2,2,'#d94a5a');r.put(x,yy-1,'#5a9a4a');}}}),
 swimsuit:(r,c)=>swim(r,c,{style:'onepiece',color:'#d94a5a',accent:'#ffffff',motif:(r,c)=>{r.rect(27,45+c.y,2,2,'#ffffff');r.put(27,44+c.y,'#5a9a4a');}}),
 bikini:(r,c)=>bikini(r,c,{color:'#d94a5a',accent:'#ffffff',motif:(r,c)=>{r.put(28,42+c.y,'#ffffff');}}),
 bathsuit:(r,c)=>yukata(r,c,{color:'#f3b8c4',obi:'#d94a5a',collar:'#ffffff',pattern:(r,x,y)=>{r.rect(x,y,2,2,'#d94a5a');r.put(x,y-1,'#5a9a4a');}}),
};
export function erzaPixels({erzaForm,...opts}={}){
 const form=formIndex(erzaForm??opts.form??3),skin=opts.skin||'default',inArmor=!OUTFITS[skin];
 const garment=inArmor?ARMOR[form]:OUTFITS[skin];
 return buildHero({build:'adult',ink:INK},{
  back:(r,c)=>{gear(r,c,form,inArmor);longHairBack(r,c,H,{length:58});},
  garment:(r,c)=>{const g=garment(r,c);g.armor=inArmor;g.arms=(r,c,g2)=>erzaArms(r,c,g2,form);return g;},
  face,front:bangs,
 },{...opts,form});
}
