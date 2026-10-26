import {buildHero,standardHead,torso,casual,pajamas,swim,emblem,mix,SKIN} from './hero-builder.js';
import {canvas,motion,eye,mouth,limb,selout} from './hero-kit.js';
// Guts: broad build, short black spikes, a scar across the nose, dark plate armour, a
// ragged cape over the left shoulder, an iron prosthetic left forearm and the
// Dragonslayer rising behind his right shoulder. Form 1 (or the berserk pose) seals him
// in the Berserker Armor's wolf helmet; the Berserker skin shows the armor helmet-off.
export const GUTS_ART={ink:'#26303d',hair:'#222935',hairShade:'#161e29',hairLight:'#49505d',skin:'#dcb394',skinShade:'#a87a67',skinLight:'#efd1b1',plate:'#394350',plateShade:'#222c3a',plateLight:'#75808a',cape:'#34313d',capeShade:'#202735',capeLight:'#59505a',steel:'#b5c0be',steelShade:'#73838b',steelLight:'#e6e8d6',leather:'#6c5144',buckle:'#ad956c',red:'#d66d69'};
export const BERSERKER_SKIN_ART={black:'#151b26',plate:'#303946',facet:'#46515e',edge:'#7b8792',light:'#a2a9ad',cape:'#252632',capeShade:'#171d28',capeLight:'#494550',red:'#ed5862',redShade:'#a72d46',eye:'#ffd2b9'};
const c=GUTS_ART,B=BERSERKER_SKIN_ART;
const TONE={base:c.skin,shade:c.skinShade,light:c.skinLight,deep:'#8f6152'};
const HAWK={plate:'#777d85',plateShade:'#4e545e',plateLight:'#bcc1bd',cape:'#636c80',capeShade:'#434a5c',capeLight:'#8a93a8'};
function hair(r,k){
 const y=k.y,{poly,line}=r,tips=[[11,18],[13,8],[19,4],[25,2],[31,3],[37,5],[42,9],[45,18]];
 poly([[15,26+y],[15,14+y],[21,9+y],[35,9+y],[41,14+y],[41,26+y]],c.hairShade);
 for(const [i,[tx,ty]]of tips.entries()){const bx=16+i*3.4;poly([[bx-3,15+y],[tx,ty+y],[bx+3,13+y]],c.hairShade);poly([[bx-2,15+y],[tx+(tx<28?1:-1),ty+2+y],[bx+2,14+y]],c.hair);}
 poly([[16,25+y],[16,15+y],[22,11+y],[34,11+y],[40,15+y],[40,25+y]],c.hair);
 for(const x of [20,27,33])line(x,12+y,x+1,8+y,c.hairLight);
}
function bangs(r,k){
 const y=k.y,{poly}=r;
 poly([[17,24+y],[18,15+y],[38,15+y],[39,24+y],[36,20+y],[33,24+y],[30,19+y],[27,24+y],[24,19+y],[21,24+y],[19,20+y]],c.hairShade);
 poly([[18,22+y],[19,16+y],[37,16+y],[38,21+y],[36,18+y],[33,22+y],[30,17+y],[27,22+y],[24,17+y],[21,22+y],[19,18+y]],c.hair);
}
function face(r,k,{young=false}={}){
 const y=k.y,hurt=k.expression==='hurt';
 for(const [x,side]of [[21,-1],[31,1]])eye(r,x,26+y,{iris:'#3a3430',irisDark:'#1a1614',lash:c.ink,side,closed:k.blink,hurt,focus:k.expression==='focused'||k.expression==='ultimate'});
 // Heavy brows and the scar across his nose.
 if(!k.blink){r.line(19,24+y,24,25+y,c.hair);r.line(32,25+y,37,24+y,c.hair);}
 if(!young){r.line(24,29+y,32,32+y,'#b26a62');r.line(24,30+y,32,33+y,mix('#b26a62',c.skin,.5));}
 mouth(r,34+y,k.expression==='neutral'?'focused':k.expression,{lip:'#8f5d58'});
}
function gutsHead(r,k){
 const y=k.y,{poly,rect}=r;
 rect(25,36+y,6,4,TONE.shade);
 poly([[18,19+y],[38,19+y],[38,29+y],[36,34+y],[31,38+y],[25,38+y],[20,34+y],[18,29+y]],TONE.shade);
 poly([[19,19+y],[37,19+y],[37,29+y],[35,33+y],[30,37+y],[26,37+y],[21,33+y],[19,29+y]],TONE.base);
 rect(20,30+y,2,1,TONE.light);rect(36,25+y,1,4,TONE.shade);
}
function cape(r,k,pal){
 // Ragged cape hanging from the left shoulder behind the arm.
 const y=k.y,w=k.walk,{poly,line}=r;
 poly([[9,38+y],[21,36+y],[22,60],[18+w,64],[15+w,60],[12+w,65],[9+w,58],[7+w,62],[6,48]],pal.capeShade);
 poly([[10,39+y],[20,37+y],[20,58],[17+w,61],[15+w,57],[12+w,61],[9+w,55],[8,47]],pal.cape);line(12,42+y,11+w,56,pal.capeLight);
}
function dragonslayer(r,k){
 // The giant slab rises behind his right shoulder; swinging brings it forward.
 const {poly,line,rect}=r;
 if(k.attack){poly([[34,30],[54,18],[55,28],[36,40]],c.steelShade);poly([[35,31],[53,20],[54,26],[36,38]],c.steel);line(36,33,53,22,c.steelLight);rect(31,36,5,6,c.leather);return;}
 poly([[40,3],[48,1],[50,4],[50,36],[40,38]],c.steelShade);poly([[41,4],[48,2],[49,5],[49,35],[41,37]],c.steel);line(42,5,42,35,c.steelLight);
 rect(41,38,8,3,c.leather);rect(43,41,4,8,c.leather);rect(40,37,10,1,c.buckle);
}
function plateArmor(r,k,pal){
 const b=torso(r,k,{color:pal.plate,shade:pal.plateShade,light:pal.plateLight,bottom:54});
 r.line(b.l+2,b.t+5+k.y,b.r-2,b.t+5+k.y,pal.plateShade);r.line(b.l+2,b.t+10+k.y,b.r-2,b.t+10+k.y,pal.plateShade);
 // Leather strap across the chest with a buckle, and a belt.
 r.line(b.l+3,b.t+1+k.y,b.r-3,52,c.leather,2);r.rect(30,46,3,3,c.buckle);r.rect(b.l+1,52,b.r-b.l-2,2,c.leather);
 return {sleeve:pal.plate,sleeveLight:pal.plateLight,cuff:pal.plateShade,sleeveWidth:6,legs:pal.plateShade,legShade:'#151b26',legLight:pal.plate,legTop:54,boots:61,shoe:'#1d222c',shoeLight:pal.plateLight};
}
function gutsArms(r,k,g){
 const sy=40+k.y,sleeve={color:g.sleeve||SKIN.base,light:g.sleeveLight,width:6,hand:TONE.base,handShade:TONE.shade};
 const iron=(x0,y0,x1,y1)=>{limb(r,x0,y0,Math.round((x0+x1)/2),Math.round((y0+y1)/2),{...sleeve,hand:null});const mx=Math.round((x0+x1)/2),my=Math.round((y0+y1)/2);r.line(mx,my,x1,y1,c.steelShade,5);r.line(mx,my,x1,y1,c.steel,3);for(let t=0;t<3;t++)r.put(mx+Math.round((x1-mx)*t/3),my+Math.round((y1-my)*t/3),c.steelLight);r.rect(x1-2,y1+1,5,4,c.steelShade);r.rect(x1-1,y1+1,3,3,c.steel);};
 const arm=(x0,y0,x1,y1)=>{if(g.bareArms)limb(r,x0,y0,x1,y1,{color:TONE.base,light:TONE.light,width:5,hand:TONE.base,handShade:TONE.shade});else limb(r,x0,y0,x1,y1,sleeve);};
 if(k.special){iron(17,sy,10,sy-8);arm(39,sy,46,sy-8);return;}
 iron(17,sy,13,sy+13);
 if(k.attack)arm(39,sy,35,sy-2);else arm(39,sy,42,sy+4);
}
const LOOKS={
 default:{garment:(r,k)=>plateArmor(r,k,c),cape:c},
 goldenage:{young:true,garment:(r,k)=>plateArmor(r,k,HAWK),cape:HAWK},
 casual:{garment:(r,k)=>casual(r,k,{top:'tee',color:'#5a4a3c',jacket:'#3a3430',bottom:'jeans',bottomColor:'#2b2f3d',shoe:'#3a2c24'}),cape:null},
 pajamas:{garment:(r,k)=>pajamas(r,k,{color:'#3a4252',trim:'#b5c0be',motif:(r,k)=>{r.rect(22,45,3,4,'#b5c0be');}}),cape:null},
 swimsuit:{garment:(r,k)=>swim(r,k,{style:'trunks',color:'#2b2f3d',accent:c.red,motif:(r,k)=>{r.rect(31,53,3,2,c.red);}}),cape:null},
};
// ---- Berserker Armor: dark spiked plates, wolf helmet with a red visor slit. ----
function berserker(opts,{reference=false}={}){
 const helmet=true;
 const {frame=0,moving=false,attack=false,expression='neutral',blink=false}=opts;
 return buildHero({build:'adult',ink:c.ink},{
  back:(r,k)=>{cape(r,k,{cape:B.cape,capeShade:reference?B.redShade:B.capeShade,capeLight:B.capeLight});dragonslayer(r,k);},
  garment:(r,k)=>{const b=torso(r,k,{color:B.plate,shade:B.black,light:B.facet,bottom:54});
   for(const yy of [43,47,51])r.line(b.l+2,yy+(yy<45?k.y:0),b.r-2,yy+(yy<45?k.y:0),B.black);for(const x of [b.l+1,b.r-2])r.poly([[x,b.t+k.y],[x+1,b.t-4+k.y],[x+2,b.t+k.y]],B.edge);
   return {sleeve:B.plate,sleeveLight:B.facet,cuff:B.black,sleeveWidth:6,legs:B.plate,legShade:B.black,legLight:B.facet,legTop:54,boots:60,shoe:B.black,shoeLight:B.edge,
    arms:(r,k,g)=>{const sy=40+k.y,a={color:B.plate,light:B.facet,width:6,hand:B.black,handShade:B.black};if(k.special){limb(r,17,sy,10,sy-8,a);limb(r,39,sy,46,sy-8,a);return;}limb(r,17,sy,13,sy+13,a);if(k.attack)limb(r,39,sy,35,sy-2,a);else limb(r,39,sy,42,sy+4,a);}};},
  head:helmet?(r,k)=>{
   // Wolf helmet: snout, swept-back ears and a single glowing visor cut.
   const y=k.y,{poly,rect,line,put}=r;
   poly([[16,20+y],[19,10+y],[24,6+y],[32,6+y],[37,10+y],[40,20+y],[39,32+y],[34,39+y],[22,39+y],[17,32+y]],B.black);
   poly([[17,20+y],[20,11+y],[25,8+y],[31,8+y],[36,11+y],[39,20+y],[38,31+y],[33,38+y],[23,38+y],[18,31+y]],B.plate);
   poly([[18,12+y],[13,3+y],[22,8+y]],B.black);poly([[38,12+y],[43,3+y],[34,8+y]],B.black);line(20,14+y,36,14+y,B.facet);
   if(reference){
    // Reference armor: a longer snout and twin glowing eye slits instead of one visor cut.
    for(const x of [21,31]){rect(x,24+y,5,3,B.black);rect(x+1,25+y,3,1,expression==='hurt'?B.redShade:B.red);if(!blink)put(x+2,25+y,B.eye);}
    poly([[25,28+y],[31,28+y],[30,41+y],[26,41+y]],B.black);
   }else{rect(21,24+y,15,3,B.black);rect(22,25+y,13,1,expression==='hurt'?B.redShade:B.red);if(!blink){put(24,25+y,B.eye);put(32,25+y,B.eye);}}
   poly([[24,30+y],[32,30+y],[30,38+y],[26,38+y]],B.black);for(const x of [25,27,29,31])put(x,33+y,B.light);
  }:(r,k)=>gutsHead(r,k),
  face:helmet?()=>{}:(r,k)=>{face(r,k);for(const x of [22,32])if(!k.blink)r.rect(x,28+k.y,2,2,B.red);},
  front:helmet?null:bangs,
 },{frame,moving,attack,expression,blink,pose:opts.pose==='berserk'?'':opts.pose});
}
export function gutsPixels(opts={}){
 if(opts.form===1||opts.pose==='berserk')return berserker(opts);
 if(opts.skin==='berserker')return berserker(opts,{reference:true});
 const look=LOOKS[opts.skin]||LOOKS.default;
 return buildHero({build:'adult',ink:c.ink},{
  back:(r,k)=>{if(look.cape)cape(r,k,look.cape);dragonslayer(r,k);hair(r,k);},
  garment:(r,k)=>{const g=look.garment(r,k);g.arms=gutsArms;return g;},
  head:gutsHead,
  face:(r,k)=>face(r,k,look),
  front:bangs,
 },opts);
}
