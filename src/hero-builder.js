import {canvas,motion,eye,mouth,blush,head,limb,selout,mix,SKIN} from './hero-kit.js';
// Shared pipeline for the redrawn roster. A hero supplies a spec; each skin supplies a
// look. Drawing order: back hair/cape → legs → garment → arms → prop → head → face →
// front hair → accessories, then a selective outline.
//
// look = {
//   garment(r,c) → gear   torso and lower garment; gear describes legs, shoes and sleeves
//   back(r,c), front(r,c) hair behind the body and over the face
//   face(r,c)             optional replacement for the default eyes and mouth
//   prop(r,c,gear)        weapon or held item, drawn over the arms
//   extra(r,c)            accessories drawn last (hats, ornaments)
//   head(r,c)             optional replacement for the standard head
// }
// c = {walk,bob,y,frame,moving,attack,special,raised,expression,blink,skin,form,pose}
export {mix,SKIN};
export function buildHero(spec,look,{frame=0,moving=false,pose='',attack=false,expression='neutral',blink=false,skin='default',form=0}={}){
 const special=!!pose&&!(spec.idlePoses||[]).includes(pose);
 if(special&&expression!=='hurt')expression=spec.specialExpression||'ultimate';
 const r=canvas(),m=motion({frame,moving}),lift=spec.lift??(spec.build==='adult'?-2:0);
 const c={walk:m.walk,bob:m.y,y:m.y+lift,frame:((frame%4)+4)%4,moving,attack,special,raised:special,expression,blink,skin,form,pose,spec};
 look.back?.(r,c);
 const gear=look.garment(canvas(),c)||{};
 if(!gear.noLegs)legs(r,c,gear);
 look.garment(r,c);
 if(!gear.noArms)(gear.arms||arms)(r,c,gear);
 look.prop?.(r,c,gear);
 gear.afterArms?.(r,c);
 (look.head||standardHead)(r,c);
 gear.afterHead?.(r,c);
 (look.face||standardFace)(r,c,spec);
 look.front?.(r,c);
 look.extra?.(r,c);
 return selout(r.pixels,spec.ink||'#262633');
}
export function standardHead(r,c){head(r,c.y);}
export function standardFace(r,c,spec){
 const e=spec.eyes||{},hurt=c.expression==='hurt',focus=c.expression==='focused'||c.expression==='ultimate';
 for(const [x,side]of [[21,-1],[31,1]])eye(r,x,26+c.y,{iris:e.iris||'#5a7ea8',irisDark:e.irisDark||mix(e.iris||'#5a7ea8','#141824',.5),lash:spec.lash||spec.ink||'#262633',side,closed:c.blink,hurt,focus});
 if(spec.blush!==false)blush(r,32+c.y);
 mouth(r,34+c.y,c.expression,{lip:spec.lip||'#b9707a',fang:spec.fang});
}
// Legs: trousers, bare legs, socks or boots, then shoes. Petite heroes stand at x 22/30.
export function legs(r,c,g){
 const {rect,line}=r,xs=g.legX||(c.spec.build==='adult'?[21,31]:[22,30]),top=g.legTop??53;
 for(const [i,x]of xs.entries()){const d=i?c.walk:-c.walk;
  const bare=g.legs==='bare'||!g.legs,skinBase=g.skinTone?.base||SKIN.base,skinShade=g.skinTone?.shade||SKIN.shade;
  if(bare||g.shorts){rect(x+d,top,5,67-top,skinBase);rect(x+d+4,top,1,67-top,skinShade);}
  if(g.legs&&g.legs!=='bare'){
   const len=g.shorts?g.shorts:67-top,col=g.legs,shade=g.legShade||mix(col,'#000000',.3),lite=g.legLight||mix(col,'#ffffff',.2),wide=g.wide?1:0;
   rect(x+d-1-wide,top,7+wide*2,len,shade);rect(x+d-wide,top,5+wide*2,len-1,col);line(x+d+1,top+1,x+d+1,top+len-3,lite);
   if(g.cuff)rect(x+d-1-wide,top+len-2,7+wide*2,2,g.cuff);
  }
  if(g.socks){rect(x+d,g.socksTop||62,5,67-(g.socksTop||62),g.socks);if(g.sockBand)rect(x+d,g.socksTop||62,5,1,g.sockBand);}
  if(g.boots){const bt=g.boots;rect(x+d-1,bt,7,71-bt,g.shoe);rect(x+d,bt,1,70-bt,g.shoeLight||mix(g.shoe,'#ffffff',.3));if(g.laces)for(let yy=bt+1;yy<69;yy+=2)rect(x+d+2,yy,2,1,g.laces);rect(x+d-1,70,7,1,mix(g.shoe,'#000000',.45));}
  else if(g.shoe!==null){
   if(g.sandals){rect(x+d-1,70,7,1,g.shoe||'#8b5a3c');rect(x+d+1,68,3,1,g.shoe||'#8b5a3c');}
   else{const shoe=g.shoe||'#2c2a33';rect(x+d-1,67,7,4,shoe);rect(x+d,67,4,1,g.shoeLight||mix(shoe,'#ffffff',.3));rect(x+d-1,70,7,1,g.sole||mix(shoe,'#000000',.45));if(g.shoeTrim)rect(x+d-1,69,7,1,g.shoeTrim);}
  }
 }
}
// Default arms: left hangs, right hangs or reaches forward to attack; specials raise both.
export function arms(r,c,g){
 const sleeve={color:g.sleeve||SKIN.base,light:g.sleeveLight||mix(g.sleeve||SKIN.base,'#ffffff',.25),width:g.sleeveWidth||5,hand:g.hand||SKIN.base,handShade:g.handShade||SKIN.shade};
 const bare={color:SKIN.base,light:SKIN.light,width:4};
 const ax=c.spec.build==='adult'?[18,38]:[20,36],sy=(c.spec.build==='adult'?40:41)+c.y;
 const arm=(x0,y0,x1,y1)=>{
  if(g.short){limb(r,x0,y0,x1,y1,{...bare,hand:sleeve.hand,handShade:sleeve.handShade});limb(r,x0,y0,Math.round((x0+x1)/2),Math.round((y0+y1)/2),{...sleeve,hand:null});}
  else if(g.bareArms)limb(r,x0,y0,x1,y1,{...bare});
  else{limb(r,x0,y0,x1,y1,sleeve);if(g.cuff)r.rect(x1-1,y1+1,5,2,g.cuff);}
 };
 if(c.special){arm(ax[0],sy,ax[0]-8,sy-8);arm(ax[1],sy,ax[1]+8,sy-8);return;}
 arm(ax[0],sy,ax[0]-4,sy+12);
 if(c.attack)arm(ax[1],sy,ax[1]+9,sy+1);else arm(ax[1],sy,ax[1]+4,sy+12);
}
// Hand position helpers for props.
export function hands(c){
 const adult=c.spec.build==='adult',ax=adult?[18,38]:[20,36],sy=(adult?40:41)+c.y;
 if(c.special)return {left:[ax[0]-8,sy-6],right:[ax[1]+8,sy-6]};
 return {left:[ax[0]-4,sy+14],right:c.attack?[ax[1]+9,sy+3]:[ax[1]+4,sy+14]};
}
// ---------- Garment templates. Each draws on r and returns gear. ----------
const torsoBox=c=>c.spec.build==='adult'?{l:18,r:38,t:38}:{l:20,r:36,t:39};
// A plain torso block with shading; top/bottom are absolute rows.
export function torso(r,c,{color,shade=mix(color,'#000000',.28),light=mix(color,'#ffffff',.25),bottom=53,neck}){
 const b=torsoBox(c),y=c.y;
 r.poly([[b.l,b.t+y],[b.r,b.t+y],[b.r-1,bottom],[b.l+1,bottom]],shade);
 r.poly([[b.l+1,b.t+1+y],[b.r-1,b.t+1+y],[b.r-2,bottom-1],[b.l+2,bottom-1]],color);
 r.line(b.l+2,b.t+2+y,b.l+3,bottom-2,light);
 if(neck==='v')r.poly([[24,b.t+y],[28,b.t+5+y],[32,b.t+y]],SKIN.base);
 if(neck==='round')r.rect(25,b.t+y,6,2,SKIN.base);
 return b;
}
export function pants(c,{color,shade,light,shorts,cuff,wide}){return {legs:color,legShade:shade,legLight:light,shorts,cuff,wide};}
export function skirt(r,c,{top=50,bottom=60,flare=6,color,shade=mix(color,'#000000',.3),light=mix(color,'#ffffff',.22),pleats=true,hem}){
 const w=c.walk;r.poly([[20,top],[36,top],[36+flare+w,bottom],[20-flare+w,bottom]],shade);r.poly([[21,top],[35,top],[34+flare+w,bottom-1],[22-flare+w,bottom-1]],color);
 if(pleats)for(let x=21-flare+3;x<35+flare;x+=3)r.line(Math.round(x*.6+28*.4),top+1,x+w,bottom-2,light);
 if(hem)r.line(20-flare+w,bottom-1,36+flare+w,bottom-1,hem);
}
// Casual tee / hoodie / open jacket. motif(r,c) prints an emblem on the chest.
export function casual(r,c,{top='tee',color,inner,jacket,bottom='jeans',bottomColor='#4f6e93',skirtColor,motif,shoe='#e8e4da',shoeTrim}){
 const b=torso(r,c,{color:inner||color,neck:top==='hoodie'?null:'round'});
 if(top==='hoodie'){r.rect(23,b.t+c.y,10,3,mix(color,'#000000',.2));r.line(26,b.t+3+c.y,26,b.t+8+c.y,'#f2efe6');r.line(30,b.t+3+c.y,30,b.t+8+c.y,'#f2efe6');r.rect(23,48,10,3,mix(color,'#000000',.15));}
 if(jacket){r.poly([[b.l,b.t+c.y],[b.l+7,b.t+c.y],[b.l+8,53],[b.l+1,53]],jacket);r.poly([[b.r-7,b.t+c.y],[b.r,b.t+c.y],[b.r-1,53],[b.r-8,53]],jacket);r.line(b.l+6,b.t+1+c.y,b.l+7,52,mix(jacket,'#ffffff',.2));r.line(b.r-6,b.t+1+c.y,b.r-7,52,mix(jacket,'#ffffff',.2));}
 motif?.(r,c,b);
 const sleeve=jacket||color;
 let gear={sleeve,sleeveLight:mix(sleeve,'#ffffff',.22),cuff:mix(sleeve,'#000000',.2),shoe,shoeTrim,short:top==='tee'&&!jacket};
 if(bottom==='skirt'){skirt(r,c,{top:51,bottom:60,color:skirtColor||bottomColor});gear={...gear,legs:'bare',socks:'#f3efe6',socksTop:62};}
 else if(bottom==='shorts')gear={...gear,...pants(c,{color:bottomColor,shorts:7})};
 else gear={...gear,...pants(c,{color:bottomColor,cuff:mix(bottomColor,'#ffffff',.2)})};
 r.rect(b.l+1,52,b.r-b.l-2,1,mix(bottomColor,'#000000',.3));
 return gear;
}
// Pajama set: button-up top with piping, matching trousers and slippers; or a hooded onesie.
export function pajamas(r,c,{color,trim='#f3ead9',motif,onesie=false,slipper='#e9dccb'}){
 const b=torso(r,c,{color,bottom:54,neck:onesie?null:'v'});
 r.line(28,b.t+2+c.y,28,53,trim);for(const yy of [44,48,52])r.put(29,yy,trim);
 if(!onesie)r.rect(b.l+1,53,b.r-b.l-2,1,trim);
 motif?.(r,c,b);
 return {sleeve:color,sleeveLight:mix(color,'#ffffff',.25),cuff:trim,legs:color,legShade:mix(color,'#000000',.28),cuff2:trim,shoe:slipper,shoeLight:'#ffffff',legTop:53};
}
// Swimwear. style: trunks (bare torso), rash (rash-guard top + shorts), onepiece, swimdress.
export function swim(r,c,{style='trunks',color,accent='#f3e9c8',motif}){
 const b=torsoBox(c),y=c.y;
 torso(r,c,{color:SKIN.base,shade:SKIN.shade,light:SKIN.light,bottom:53});
 if(style==='trunks'){r.line(28,b.t+5+y,28,50,SKIN.shade);r.line(24,46,32,46,SKIN.shade);r.poly([[b.l+1,51],[b.r-1,51],[b.r,58],[29,58],[28,55],[27,58],[b.l,58]],mix(color,'#000000',.3));r.poly([[b.l+2,52],[b.r-2,52],[b.r-1,57],[29,57],[28,54],[27,57],[b.l+1,57]],color);r.line(b.l+2,52,b.r-2,52,accent);motif?.(r,c,b);return {bareArms:true,legs:'bare',shoe:'#8b5a3c',sandals:true};}
 if(style==='rash'){torso(r,c,{color,bottom:53,neck:'round'});r.line(b.l+3,b.t+2+y,b.r-3,b.t+2+y,accent);motif?.(r,c,b);return {sleeve:color,short:true,legs:mix(color,'#000000',.15),shorts:6,shoe:'#8b5a3c',sandals:true};}
 if(style==='onepiece'){r.poly([[b.l+3,b.t+3+y],[b.r-3,b.t+3+y],[b.r-2,55],[b.l+2,55]],mix(color,'#000000',.25));r.poly([[b.l+4,b.t+4+y],[b.r-4,b.t+4+y],[b.r-3,54],[b.l+3,54]],color);r.line(b.l+5,b.t+y,b.l+5,b.t+3+y,color);r.line(b.r-5,b.t+y,b.r-5,b.t+3+y,color);motif?.(r,c,b);return {bareArms:true,legs:'bare',shoe:accent,sandals:true};}
 // Swim dress: fitted bodice and a short frilled skirt.
 r.poly([[b.l+2,b.t+2+y],[b.r-2,b.t+2+y],[b.r-2,50],[b.l+2,50]],color);r.line(b.l+3,b.t+3+y,b.l+3,49,mix(color,'#ffffff',.25));
 skirt(r,c,{top:49,bottom:57,flare:5,color,pleats:false});for(let x=15+c.walk;x<41+c.walk;x+=3)r.rect(x,56,2,2,accent);
 motif?.(r,c,b);return {bareArms:true,legs:'bare',shoe:accent,sandals:true};
}
export function bikini(r,c,{color,accent='#f3e9c8',motif}){
 const b=torsoBox(c),y=c.y;torso(r,c,{color:SKIN.base,shade:SKIN.shade,light:SKIN.light,bottom:53});
 r.rect(b.l+3,b.t+3+y,b.r-b.l-6,4,mix(color,'#000000',.25));r.rect(b.l+4,b.t+3+y,b.r-b.l-8,3,color);r.line(28,b.t+3+y,28,b.t+6+y,mix(color,'#000000',.3));
 r.poly([[b.l+2,50],[b.r-2,50],[b.r-5,55],[b.l+5,55]],mix(color,'#000000',.25));r.poly([[b.l+3,50],[b.r-3,50],[b.r-6,54],[b.l+6,54]],color);r.line(28,b.t+8+y,28,48,SKIN.shade);
 motif?.(r,c,b);return {bareArms:true,legs:'bare',shoe:accent,sandals:true};
}
// Bath robe / yukata with an obi and a scattered pattern.
export function yukata(r,c,{color,obi='#e0b85c',collar='#f0e2c8',pattern}){
 const b=torsoBox(c),y=c.y,w=c.walk,dark=mix(color,'#000000',.3);
 r.poly([[b.l,b.t+y],[b.r,b.t+y],[b.r+2+w,65],[b.l-2+w,65]],dark);r.poly([[b.l+1,b.t+1+y],[b.r-1,b.t+1+y],[b.r+w,64],[b.l+w,64]],color);
 r.poly([[24,b.t+y],[28,b.t+8+y],[32,b.t+y],[30,b.t+y],[28,b.t+5+y],[26,b.t+y]],collar);r.line(28,49,26+w,64,dark);
 r.rect(b.l+1,47,b.r-b.l-2,3,obi);r.rect(b.l+1,47,b.r-b.l-2,1,mix(obi,'#ffffff',.3));
 if(pattern)for(const [x,yy]of [[22,43],[34,45],[22,56],[33,59],[27,61]])pattern(r,x+(yy>50?w:0),yy);
 return {sleeve:color,sleeveLight:mix(color,'#ffffff',.25),cuff:dark,sleeveWidth:6,legTop:63,shoe:'#5b3a2c',shoeLight:collar};
}
// Small pixel emblems for motifs.
export const emblem={
 star:(r,x,y,col)=>{r.put(x,y-1,col);r.rect(x-1,y,3,1,col);r.put(x,y+1,col);},
 dot:(r,x,y,col)=>r.rect(x,y,2,2,col),
 flower:(r,x,y,col,core='#ffe08a')=>{r.put(x,y-1,col);r.put(x-1,y,col);r.put(x+1,y,col);r.put(x,y+1,col);r.put(x,y,core);},
};
