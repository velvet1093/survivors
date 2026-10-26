import {buildHero,torso,casual,pajamas,swim,emblem,longHairBack,fringe,mix,SKIN} from './hero-builder.js';
import {canvas,motion,eye,mouth,limb,selout,lid,brow,tear} from './hero-kit.js';
// Rimuru: shoulder-length light-blue hair with straight bangs, gold eyes, a dark
// traveller's coat and cream scarf. Gluttony (the predator pose or slime form) turns
// him back into the round blue slime.
export const RIMURU_COLORS={hair:'#9ccbdc',hairShade:'#5f8eaf',hairLight:'#d6eef0',gold:'#e5bd68',goldDark:'#a37a2e',coat:'#2f3f5e',coatShade:'#1c263c',coatLight:'#4e6386',scarf:'#ece0c4',scarfShade:'#bfae88',ink:'#1f2b3d',slime:'#73bedb',slimeShade:'#3f86a8',slimeLight:'#bde6f3',magic:'#7dc6e5'};
const C=RIMURU_COLORS,H={h:C.hair,s:C.hairShade,l:C.hairLight};
function face(r,c){
 const y=c.y,hurt=c.expression==='hurt',focus=c.expression==='focused'||c.expression==='ultimate';
 for(const [x,side]of [[21,-1],[31,1]])eye(r,x,26+y,{iris:C.gold,irisDark:C.goldDark,lash:C.ink,side,closed:c.blink,hurt,focus});
 if(c.expression==='neutral'){for(const [x,yy]of [[26,34],[27,35],[28,34],[29,35],[30,34]])r.put(x,yy+y,'#b77b80');}
 else if(c.expression==='focused'){for(const [x,side]of [[21,-1],[31,1]])if(!c.blink)lid(r,x,26+y,{lash:C.ink,rows:1,side});r.rect(27,34+y,3,1,'#b77b80');}
 else mouth(r,34+y,c.expression,{lip:'#b77b80'});
}
function traveler(r,c,{lord=false}={}){
 const col=lord?'#1c1a24':C.coat,shade=lord?'#0e0d14':C.coatShade,light=lord?'#3a3646':C.coatLight,w=c.walk;
 const b=torso(r,c,{color:'#e9edf0',shade:'#aab6c0',light:'#ffffff',bottom:54});
 // Open coat, long at the back for the Demon Lord.
 r.poly([[b.l-1,b.t+c.y],[b.l+6,b.t+c.y],[b.l+5,(lord?66:58)+w],[b.l-3,(lord?65:57)+w]],col);r.poly([[b.r-6,b.t+c.y],[b.r+1,b.t+c.y],[b.r+3,(lord?65:57)+w],[b.r-5,(lord?66:58)+w]],col);
 r.line(b.l+5,b.t+1+c.y,b.l+4,(lord?64:56)+w,lord?C.gold:light);r.line(b.r-5,b.t+1+c.y,b.r-4,(lord?64:56)+w,lord?C.gold:shade);
 r.rect(b.l+1,51,b.r-b.l-2,2,lord?C.gold:'#5a4a3a');
 const scarf=(r,c)=>{if(lord){r.rect(22,37+c.y,12,3,C.gold);r.rect(27,38+c.y,2,4,'#b04a5a');return;}
  // Cream scarf wrapped at the neck with a tail hanging down.
  r.rect(21,37+c.y,14,4,C.scarfShade);r.rect(22,37+c.y,12,3,C.scarf);r.rect(31,40+c.y,4,8,C.scarfShade);r.rect(31,40+c.y,3,7,C.scarf);};
 return {sleeve:col,sleeveLight:light,cuff:lord?C.gold:shade,legs:lord?'#1c1a24':'#2a3550',legShade:'#161c2c',legTop:54,boots:62,shoe:'#3a2c24',shoeLight:'#6a5444',afterHead:scarf};
}
function rimuruArms(r,c,g){
 const sleeve=g.bareArms?{color:SKIN.base,light:SKIN.light,width:4}:{color:g.sleeve,light:g.sleeveLight,width:5,hand:SKIN.base,handShade:SKIN.shade},sy=40+c.y;
 const arm=(x0,y0,x1,y1)=>{if(g.short){limb(r,x0,y0,x1,y1,{color:SKIN.base,light:SKIN.light,width:4});limb(r,x0,y0,Math.round((x0+x1)/2),Math.round((y0+y1)/2),{...sleeve,hand:null});}else limb(r,x0,y0,x1,y1,sleeve);};
 if(c.special){arm(18,sy,10,sy-8);arm(38,sy,46,sy-8);return;}
 arm(18,sy,14,sy+12);
 // Black Flame gathers in his open palm.
 if(c.attack){arm(38,sy,47,sy+1);r.rect(49,sy-1,3,4,'#1c1a24');r.rect(50,sy,2,2,C.magic);r.put(50,sy-2,C.magic);}else arm(38,sy,42,sy+12);
}
const LOOKS={
 default:{garment:(r,c)=>traveler(r,c)},
 demonlord:{garment:(r,c)=>traveler(r,c,{lord:true})},
 casual:{garment:(r,c)=>casual(r,c,{top:'hoodie',color:'#5f9ac7',bottom:'jeans',bottomColor:'#2a3550',motif:(r,c)=>{r.rect(25,44,6,4,C.slime);r.put(26,45,C.ink);r.put(29,45,C.ink);},shoe:'#ece0c4'})},
 pajamas:{hood:true,garment:(r,c)=>pajamas(r,c,{color:C.slime,trim:'#ffffff',onesie:true,motif:(r,c)=>{r.rect(25,44,6,4,C.slimeLight);}})},
 swimsuit:{garment:(r,c)=>swim(r,c,{style:'rash',color:'#5f9ac7',accent:C.slimeLight,motif:(r,c)=>{r.rect(26,44+c.y,4,3,C.slime);r.put(27,45+c.y,C.ink);r.put(28,45+c.y,C.ink);}})},
};
function slimeHood(r,c){
 const y=c.y,{poly,rect,put}=r;
 poly([[14,24+y],[16,12+y],[24,6+y],[32,6+y],[40,12+y],[42,24+y],[40,32+y],[37,21+y],[19,21+y],[16,32+y]],C.slimeShade);
 poly([[16,22+y],[18,13+y],[24,8+y],[32,8+y],[38,13+y],[40,22+y],[37,19+y],[19,19+y]],C.slime);rect(23,10+y,4,2,C.slimeLight);
 for(const x of [23,31])rect(x,13+y,2,3,C.ink);
}
// Slime form: a squishy blue dome with simple eyes, bouncing as it moves.
function slimePixels({frame=0,moving=false,blink=false,expression='neutral'}={}){
 const r=canvas(),f=((frame%4)+4)%4,sq=moving?[0,2,0,-1][f]:0,{poly,rect,line,put}=r;
 const top=50+sq,wide=sq;
 poly([[12-wide,70],[13-wide,62],[18,top+3],[28,top],[38,top+3],[43+wide,62],[44+wide,70]],C.slimeShade);
 poly([[14-wide,69],[15-wide,62],[19,top+4],[28,top+1],[37,top+4],[41+wide,62],[42+wide,69]],C.slime);
 poly([[19,top+6],[25,top+3],[23,top+8]],C.slimeLight);line(14-wide,69,42+wide,69,C.slimeShade);
 for(const x of [21,32]){if(blink)line(x,60,x+3,60,C.ink);else rect(x,57,3,expression==='hurt'?2:5,C.ink);}
 if(!blink)for(const x of [22,33])put(x,58,'#ffffff');
 if(expression==='hurt')line(25,64,31,64,C.ink);
 return selout(r.pixels,C.ink);
}
export function rimuruPixels(opts={}){
 if(opts.pose==='predator'||opts.form==='slime')return slimePixels(opts);
 const look=LOOKS[opts.skin]||LOOKS.default,spec={build:'adult',ink:C.ink};
 return buildHero(spec,{
  back:look.hood?null:(r,c)=>longHairBack(r,c,H,{length:46}),
  garment:(r,c)=>{const g=look.garment(r,c);g.arms=rimuruArms;return g;},
  face,
  front:look.hood?slimeHood:(r,c)=>fringe(r,c,H,{style:'straight',locks:40}),
 },opts);
}
