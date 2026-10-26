import {buildHero,torso,casual,swim,yukata,skirt,emblem,twinTails,longHairBack,fringe,bow,mix,SKIN} from './hero-builder.js';
import {eye,mouth,limb,lid,brow,tear} from './hero-kit.js';
// Madoka: short pink twin tails tied with red ribbons and big pink eyes. The magical-girl
// dress has a white bodice, a red chest bow, puffed sleeves, white gloves and a layered
// pink bubble skirt. Ultimate Madoka trades it for a white gown, wings and floor-length hair.
export const MADOKA_COLORS={hair:'#efa4c1',hairShade:'#b8688f',hairLight:'#ffe0e9',pink:'#eea4c0',pinkShade:'#bd668f',pinkLight:'#ffdfed',red:'#d9485f',white:'#fbf6f2',gold:'#e8c46a',iris:'#d86a98'};
const C=MADOKA_COLORS,INK='#4a2f44',H={h:C.hair,s:C.hairShade,l:C.hairLight};
const GODDESS_H={h:'#f4b8d1',s:'#c27ea3',l:'#fff0f6'};
function faceFor(r,c,gold){
 const y=c.y,hurt=c.expression==='hurt',focus=c.expression==='focused'||c.expression==='ultimate';
 for(const [x,side]of [[21,-1],[31,1]])eye(r,x,26+y,{iris:gold?'#e8c46a':C.iris,irisDark:gold?'#a77b2c':'#8e3a63',lash:INK,side,closed:c.blink,hurt,focus});
 for(const x of [20,21,34,35])r.put(x,32+y,mix('#f08aa6',SKIN.base,.4));
 if(!c.blink&&!hurt)for(const x of [21,31])r.put(x+(x<30?2:1),29+y,'#ffffff');
 if(hurt)for(const x of [22,34])tear(r,x,31+y);
 // A small open smile; an earnest frown while focusing.
 if(c.expression==='neutral'){r.rect(27,34+y,3,2,'#c46a80');r.rect(27,35+y,3,1,'#f2a3b6');}
 else if(c.expression==='focused'){brow(r,21,24+y,{color:C.hairShade||INK,side:-1,tilt:-1});brow(r,31,24+y,{color:C.hairShade||INK,side:1,tilt:-1});mouth(r,34+y,'focused',{lip:'#c46a80'});}
 else mouth(r,34+y,c.expression,{lip:'#c46a80'});
}
function magicalGirl(r,c){
 const b=torso(r,c,{color:C.white,shade:'#d8cdd6',light:'#ffffff',bottom:50});
 r.rect(b.l+1,b.t+c.y,3,9,C.pink);r.rect(b.r-4,b.t+c.y,3,9,C.pink);
 // Layered bubble skirt: pink over a white frill.
 skirt(r,c,{top:49,bottom:60,flare:8,color:C.white,shade:'#d8cdd6',pleats:false});
 skirt(r,c,{top:49,bottom:58,flare:7,color:C.pink,shade:C.pinkShade,light:C.pinkLight});
 for(let x=14+c.walk;x<43+c.walk;x+=3)r.rect(x,59,2,2,C.white);
 r.rect(b.l+1,48,b.r-b.l-2,2,C.pinkShade);
 return {sleeve:C.white,sleeveLight:'#ffffff',hand:'#ffffff',handShade:'#d8cdd6',legs:'bare',socks:C.white,socksTop:61,sockBand:C.pink,shoe:C.red,shoeLight:'#f08a9a',
  afterArms(r,c){
   // Puffed pink sleeves cap both shoulders.
   for(const x of [17,33]){r.poly([[x,40+c.y],[x+3,38+c.y],[x+6,40+c.y],[x+5,44+c.y],[x+1,44+c.y]],C.pinkShade);r.poly([[x+1,40+c.y],[x+3,39+c.y],[x+5,40+c.y],[x+4,43+c.y],[x+2,43+c.y]],C.pink);}
   bow(r,28,42+c.y,C.red,'#a8344a',3);},
  afterHead(r,c){r.rect(25,38+c.y,6,1,C.pinkShade);r.rect(27,38+c.y,2,2,C.gold);}};
}
function goddess(r,c){
 const w=c.walk,b=torso(r,c,{color:C.white,shade:'#d9d0de',light:'#ffffff',bottom:50});
 // Floor-length white gown with pink and gold trim.
 r.poly([[b.l,48],[b.r,48],[b.r+8+w,70],[b.l-8+w,70]],'#d9d0de');r.poly([[b.l+1,48],[b.r-1,48],[b.r+6+w,69],[b.l-6+w,69]],C.white);
 for(const a of [-5,0,5])r.line(28+a,50,28+a*2.2+w,68,'#ece3ec');r.line(b.l-7+w,69,b.r+7+w,69,C.pink);r.rect(b.l+1,48,b.r-b.l-2,2,C.gold);
 bow(r,28,42+c.y,C.pink,C.pinkShade,3);
 return {sleeve:C.white,sleeveLight:'#ffffff',noLegs:true,cuff:C.pink};
}
function wings(r,c){
 const y=c.y,{poly,line}=r;
 for(const side of [-1,1]){const x=side<0?18:38;
  poly([[x,38+y],[x+side*20,26+y],[x+side*18,40+y],[x+side*16,52+y],[x+side*6,50+y]],'#e4dbe8');
  poly([[x,40+y],[x+side*17,30+y],[x+side*15,41+y],[x+side*13,50+y],[x+side*5,48+y]],'#ffffff');
  for(const t of [34,40,46])line(x+side*3,44+y,x+side*15,t+y,'#e8d7ee');
 }
}
function school(r,c){
 // Mitakihara uniform: cream blazer with brown trim, red ribbon and a plaid skirt.
 const b=torso(r,c,{color:'#efe2c5',shade:'#c0ab84',light:'#fff6e2',bottom:51});
 r.poly([[24,b.t+c.y],[28,b.t+5+c.y],[32,b.t+c.y]],'#ffffff');bow(r,28,b.t+4+c.y,C.red,'#a8344a',2);
 r.line(b.l+2,b.t+1+c.y,b.l+2,50,'#8a5a3c');r.line(b.r-2,b.t+1+c.y,b.r-2,50,'#8a5a3c');
 skirt(r,c,{top:50,bottom:59,flare:5,color:'#b54a5a',shade:'#7d2f3e',light:'#d97a86'});for(let x=17+c.walk;x<40+c.walk;x+=4)r.line(x,52,x+c.walk*.2,57,'#f3ddbd');
 return {sleeve:'#efe2c5',sleeveLight:'#fff6e2',cuff:'#8a5a3c',legs:'bare',socks:'#ffffff',socksTop:62,shoe:'#5a3a2c',shoeLight:'#8a5a44'};
}
function nightdress(r,c){
 const w=c.walk,b=torso(r,c,{color:'#f7c6d8',shade:'#cf8fae',light:'#ffe6ef',bottom:50});
 r.poly([[b.l,48],[b.r,48],[b.r+5+w,66],[b.l-5+w,66]],'#cf8fae');r.poly([[b.l+1,48],[b.r-1,48],[b.r+3+w,65],[b.l-3+w,65]],'#f7c6d8');
 for(let x=b.l-4+w;x<b.r+5+w;x+=3)r.rect(x,64,2,2,'#ffffff');bow(r,28,b.t+3+c.y,C.red,'#a8344a',2);
 for(const [x,yy]of [[22,54],[33,57],[26,60]])emblem.flower(r,x+w,yy,'#ffffff',C.red);
 return {sleeve:'#f7c6d8',sleeveLight:'#ffe6ef',cuff:'#ffffff',legs:'bare',legTop:63,shoe:'#ffffff',shoeLight:'#ffe6ef'};
}
function madokaArms(r,c,g){
 const sleeve=g.bareArms?{color:SKIN.base,light:SKIN.light,width:4}:{color:g.sleeve,light:g.sleeveLight,width:5,hand:g.hand||SKIN.base,handShade:g.handShade||SKIN.shade},sy=41+c.y;
 const arm=(x0,y0,x1,y1)=>{if(g.short){limb(r,x0,y0,x1,y1,{color:SKIN.base,light:SKIN.light,width:4});limb(r,x0,y0,Math.round((x0+x1)/2),Math.round((y0+y1)/2),{...sleeve,hand:null});}else limb(r,x0,y0,x1,y1,sleeve);};
 // Hope: both hands clasped over the heart. Other specials raise both arms.
 if(c.pose==='hope'){arm(20,sy,26,sy+3);arm(36,sy,30,sy+3);return;}
 if(c.special){arm(20,sy,12,sy-8);arm(36,sy,44,sy-8);return;}
 arm(20,sy,16,sy+12);
 // The bow is drawn by the renderer; attacking lifts her arm toward it.
 if(c.attack)arm(36,sy,45,sy-1);else arm(36,sy,40,sy+12);
}
const LOOKS={
 default:{garment:magicalGirl},
 goddess:{goddess:true,garment:goddess},
 school:{garment:school},
 casual:{garment:(r,c)=>casual(r,c,{top:'tee',color:'#ffffff',jacket:'#f3a8c4',bottom:'skirt',skirtColor:'#8f6aa8',motif:(r,c)=>emblem.flower(r,28,45+c.y,C.red),shoe:'#d9485f'})},
 pajamas:{garment:nightdress},
 swimsuit:{garment:(r,c)=>swim(r,c,{style:'swimdress',color:'#f3a8c4',accent:'#ffffff',motif:(r,c)=>bow(r,28,43+c.y,C.red,'#a8344a',2)})},
 cuteswim:{garment:(r,c)=>{const g=swim(r,c,{style:'swimdress',color:'#ffffff',accent:'#f3a8c4'});for(let yy=50;yy<57;yy+=3)r.line(18+c.walk,yy,38+c.walk,yy,'#f3a8c4');bow(r,28,43+c.y,'#f3a8c4',C.pinkShade,2);return g;}},
 bathsuit:{garment:(r,c)=>yukata(r,c,{color:'#f7c6d8',obi:C.red,collar:'#ffffff',pattern:(r,x,y)=>emblem.flower(r,x,y,'#ffffff',C.red)})},
};
export function madokaPixels(opts={}){
 const look=LOOKS[opts.skin]||LOOKS.default,god=!!look.goddess,h=god?GODDESS_H:H;
 const spec={build:'petite',ink:INK};
 return buildHero(spec,{
  back:(r,c)=>{if(god){wings(r,c);longHairBack(r,c,h,{length:70,width:4});}else twinTails(r,c,h,{len:44,flare:7,tie:13});},
  garment:(r,c)=>{const g=look.garment(r,c);g.arms=madokaArms;return g;},
  face:(r,c)=>faceFor(r,c,god),
  front:(r,c)=>{fringe(r,c,h,{style:'choppy',locks:35});if(god){r.rect(16,9+c.y,24,2,'#ffffff');}else{bow(r,16,14+c.y,C.red,'#a8344a',3);bow(r,40,14+c.y,C.red,'#a8344a',3);}},
 },opts);
}
