// Circular danger zones keep their original collision and outer warning. These
// material effects only explain the attack that is charging or landing inside.
const TAU=Math.PI*2;
const clamp=n=>Math.max(0,Math.min(1,n));
const themes={
 blast:{dark:'#776457',body:'#e7b67f',light:'#fff0ca'},
 fire:{dark:'#ae5c66',body:'#e6a16e',light:'#ffedb3'},
 steam:{dark:'#8997a3',body:'#c7d4d0',light:'#f0e9dc'},
 ice:{dark:'#577d9b',body:'#a8d8e7',light:'#ecf7eb'},
 lightning:{dark:'#827eae',body:'#e5cc8e',light:'#fff3c3'},
 venom:{dark:'#577768',body:'#a8c58d',light:'#e1e5a8'},
 claw:{dark:'#87576b',body:'#d3a29c',light:'#ffe0c6'},
 curse:{dark:'#78577f',body:'#c49ac2',light:'#eed3e6'},
 light:{dark:'#8e8aa3',body:'#e4c996',light:'#fff2d1'},
};
export function circleAttackTheme(h,source){
 const text=[h.label,h.source,source?.archetype,source?.family].join(' ').toLowerCase();
 if(/steam|scream|mist/.test(text))return 'steam';
 if(/thunder|lightning|adr[ae]m|el thor|raigo|budo|tempestlord/.test(text))return 'lightning';
 if(/ice|frost|glaci|whiteout|aokiji|frostregent/.test(text)||h.status==='frozen')return 'ice';
 if(/venom|poison|snake|serpent|orochimaru/.test(text)||h.status==='poison')return 'venom';
 if(/magma|meteor|inferno|flame|fire|eruption|akainu|jogo/.test(text))return 'fire';
 if(/cannon|bomb|explos|detonat|blast|footfall|stomp|shockwave|landing|crushing step/.test(text))return 'blast';
 if(/grasp|grab|bite|claw|cut|pounce|titan|apostle|berserk/.test(text)||h.status==='bleeding')return 'claw';
 if(/angel|cross|light|solar|flare|kizaru|sachiel/.test(text))return 'light';
 if(/soul|balance|curse|shrine|curtain|gravity|seal|ritual|eclipse/.test(text))return 'curse';
 return h.status==='burning'?'fire':'curse';
}
const line=(c,points,color,width=1)=>{c.strokeStyle=color;c.lineWidth=width;c.lineCap='round';c.beginPath();for(let i=0;i<points.length;i++){const [x,y]=points[i];i?c.lineTo(x,y):c.moveTo(x,y);}c.stroke();};
function ring(c,x,y,r,color,width=1){c.strokeStyle=color;c.lineWidth=width;c.beginPath();c.arc(x,y,Math.max(.1,r),0,TAU);c.stroke();}
function poly(c,points,color){c.fillStyle=color;c.beginPath();for(let i=0;i<points.length;i++){const [x,y]=points[i];i?c.lineTo(x,y):c.moveTo(x,y);}c.closePath();c.fill();}
function bead(c,x,y,r,color){c.fillStyle=color;c.beginPath();c.arc(x,y,Math.max(.1,r),0,TAU);c.fill();}
function valid(h){return h.shape==='circle'&&h.damage>0&&[h.x,h.y,h.r,h.age,h.delay].every(Number.isFinite)&&h.r>0&&h.age>=0&&h.age<=h.delay+(Number.isFinite(h.duration)?h.duration:.45);}
function dedicated(e,h){return !!(h.bossUltimate||e?.devilAttack||e?.worldEventAttack||e?.berserkAttack||e?.riftAttack||e?.motherBrainAttack);}
function ground(c,h,theme,reduced,subtle){
 const active=h.age>=h.delay,p=themes[theme],r=h.r,x=h.x,y=h.y;
 const charge=clamp(h.age/Math.max(.001,h.delay)),release=clamp((h.age-h.delay)/Math.max(.001,h.duration||.45)),t=reduced?.45:release;
 c.save();c.beginPath();c.arc(x,y,r*.93,0,TAU);c.clip();
 // Keep the target readable before release; the hand cue shows who owns it.
 if(!active){
  c.globalAlpha=subtle?.22:.48;const inner=Math.min(13,r*.22)*(reduced?1:.65+.35*charge);
  ring(c,x,y,inner,p.body,1);for(let i=0;i<4;i++){const a=i*Math.PI/2;line(c,[[x+Math.cos(a)*inner*.5,y+Math.sin(a)*inner*.5],[x+Math.cos(a)*inner*.8,y+Math.sin(a)*inner*.8]],p.light,1.5);}
  c.restore();return;
 }
 c.globalAlpha=subtle?.3:.72;const reach=r*(.35+t*.54),spin=reduced?0:h.age*.3;
 if(theme==='blast'){
  ring(c,x,y,reach,p.body,2.5);ring(c,x,y,reach*.68,p.light,1.5);
  for(let i=0;i<8;i++){const a=i*TAU/8+.25,d=r*(.22+t*.6),xx=x+Math.cos(a)*d,yy=y+Math.sin(a)*d*.7;poly(c,[[xx-3,yy],[xx,yy-5],[xx+4,yy+1],[xx+1,yy+4]],i%2?p.dark:p.body);line(c,[[x+Math.cos(a)*r*.13,y+Math.sin(a)*r*.13],[x+Math.cos(a)*reach*.8,y+Math.sin(a)*reach*.8]],p.light,1);}
 }else if(theme==='fire'){
  for(let i=0;i<7;i++){const a=i*2.399,d=r*(i? .25+(i%3)*.18:0),xx=x+Math.cos(a)*d,yy=y+Math.sin(a)*d*.55,high=r*(.22+.16*Math.sin((i+1)*1.7+t*Math.PI));poly(c,[[xx-7,yy+5],[xx-10,yy-high*.3],[xx-3,yy-high*.5],[xx,yy-high],[xx+4,yy-high*.46],[xx+10,yy-3],[xx+7,yy+6]],p.dark);poly(c,[[xx-4,yy+3],[xx-5,yy-high*.3],[xx,yy-high*.76],[xx+5,yy-2],[xx+3,yy+3]],p.body);line(c,[[xx,yy],[xx+1,yy-high*.38]],p.light,2);}
 }else if(theme==='ice'){
  for(let i=0;i<7;i++){const a=i*TAU/7,d=r*(i?.52:0),xx=x+Math.cos(a)*d,yy=y+Math.sin(a)*d*.7,high=Math.min(37,r*.6)*(reduced?1:.65+Math.sin(t*Math.PI)*.45);poly(c,[[xx-7,yy+5],[xx-6,yy-high*.4],[xx+1,yy-high],[xx+7,yy-high*.35],[xx+7,yy+3],[xx,yy+8]],p.dark);poly(c,[[xx,yy+5],[xx+1,yy-high+3],[xx+5,yy-high*.3],[xx+4,yy+2]],p.body);line(c,[[xx-3,yy-high*.37],[xx+1,yy-high+3],[xx+2,yy-1]],p.light,1.5);}
 }else if(theme==='lightning'){
  const high=Math.min(110,r*1.7),j=reduced?0:Math.sin(h.age*17)*3;
  line(c,[[x-8,y-high],[x+8+j,y-high*.6],[x-5,y-high*.35],[x+7,y-high*.15],[x,y]],p.dark,7);line(c,[[x-8,y-high],[x+8+j,y-high*.6],[x-5,y-high*.35],[x+7,y-high*.15],[x,y]],p.light,3);
  for(let i=0;i<5;i++){const a=i*TAU/5;line(c,[[x,y],[x+Math.cos(a)*reach*.5,y+Math.sin(a)*reach*.5-5],[x+Math.cos(a+.2)*reach,y+Math.sin(a+.2)*reach]],p.body,2);}
 }else if(theme==='steam'){
  for(let i=0;i<5;i++){const xx=x+(i-2)*r*.27,yy=y+Math.sin(i*2)*r*.2,high=r*(.45+(i%2)*.2);c.strokeStyle=i%2?p.light:p.body;c.lineWidth=3;c.lineCap='round';c.beginPath();c.moveTo(xx,yy);c.bezierCurveTo(xx-12,yy-high*.3,xx+13,yy-high*.65,xx+(reduced?0:Math.sin(t*4+i)*5),yy-high);c.stroke();}
  c.strokeStyle=p.dark;c.lineWidth=1.5;c.beginPath();c.ellipse(x,y,reach,reach*.45,0,0,TAU);c.stroke();
 }else if(theme==='venom'){
  c.fillStyle=p.dark+'77';c.beginPath();c.ellipse(x,y,r*.78,r*.54,0,0,TAU);c.fill();
  for(let i=0;i<7;i++){const a=i*2.399,d=r*(.2+i%3*.19),xx=x+Math.cos(a)*d,yy=y+Math.sin(a)*d*.6-(reduced?0:t*10);ring(c,xx,yy,3+i%3,p.body,1.5);bead(c,xx-1,yy-1,1,p.light);}
 }else if(theme==='claw'){
  const length=r*.62,stretch=.7+t*.3;
  for(let i=-1;i<=1;i++){const xx=x+i*r*.23;c.strokeStyle=p.dark;c.lineWidth=6;c.beginPath();c.moveTo(xx-length*.35,y-length*.55);c.quadraticCurveTo(xx+length*.3,y,xx+length*.05,y+length*stretch);c.stroke();c.strokeStyle=p.light;c.lineWidth=2;c.stroke();}
 }else if(theme==='light'){
  const half=r*(.25+t*.45);line(c,[[x,y-half],[x,y+half]],p.dark,8);line(c,[[x-half*.65,y-half*.2],[x+half*.65,y-half*.2]],p.dark,8);line(c,[[x,y-half],[x,y+half]],p.light,3);line(c,[[x-half*.65,y-half*.2],[x+half*.65,y-half*.2]],p.light,3);ring(c,x,y,reach*.8,p.body,2);
 }else{
  ring(c,x,y,reach,p.dark,4);ring(c,x,y,reach*.74,p.body,2);
  for(let i=0;i<6;i++){const a=i*TAU/6+spin;line(c,[[x+Math.cos(a)*reach,y+Math.sin(a)*reach],[x+Math.cos(a+.26)*reach*.66,y+Math.sin(a+.26)*reach*.66],[x+Math.cos(a)*reach*.36,y+Math.sin(a)*reach*.36]],i%2?p.body:p.light,1.5);}
 }
 c.restore();
}
function caster(c,e,h,theme,reduced){
 const p=themes[theme],progress=clamp(h.age/Math.max(.001,h.delay)),side=e.facing<0?-1:1,x=e.x+side*Math.max(8,(e.r||18)*.62),y=e.y-Math.max(20,(e.r||18)*1.35),radius=4+(reduced?1:progress*4);
 c.save();c.globalAlpha=.8;bead(c,x,y,radius+2,p.dark);ring(c,x,y,radius,p.body,1.5);bead(c,x,y,2,p.light);
 if(!reduced)for(let i=0;i<4;i++){const a=i*TAU/4+h.age*.7,d=8+(1-progress)*14;line(c,[[x+Math.cos(a)*d,y+Math.sin(a)*d],[x+Math.cos(a)*(d-3),y+Math.sin(a)*(d-3)]],p.body,1.5);}
 // The small material sigil distinguishes the caster's spell from a buff glow.
 if(theme==='lightning')line(c,[[x+1,y-6],[x-3,y+1],[x+2,y],[x-1,y+6]],p.light,1.5);
 else if(theme==='ice')for(let i=0;i<3;i++){const a=i*Math.PI/3;line(c,[[x-Math.cos(a)*6,y-Math.sin(a)*6],[x+Math.cos(a)*6,y+Math.sin(a)*6]],p.light,1);}
 else if(theme==='fire')poly(c,[[x-3,y+3],[x-4,y-1],[x,y-7],[x+1,y-2],[x+4,y+2],[x,y+5]],p.light);
 else if(theme==='claw')for(let i=-1;i<=1;i++)line(c,[[x+i*3-1,y-4],[x+i*3+1,y+4]],p.light,1);
 c.restore();
}
// Rendering reads only checkpointed hazard clocks. Pausing, time stops and a
// reload therefore hold the same charge and impact without extra timers.
export function drawEnemyCircleFx(c,g,reduced=false,layer='ground'){
 if(!['ground','caster'].includes(layer))return 0;
 const sources=new Map((g.enemies||[]).filter(e=>e.hp>0).map(e=>[e.id,e])),charges=new Map();let count=0;
 for(const h of (g.hazards||[]).slice(0,45)){
  if(!valid(h))continue;
  const e=sources.get(h.sourceId),theme=circleAttackTheme(h,e),special=dedicated(e,h);
  if(layer==='ground'){ground(c,h,theme,reduced,special);count++;}
  else if(e&&!special&&h.age<h.delay&&[e.x,e.y].every(Number.isFinite)){
   const old=charges.get(e.id);if(!old||h.age/Math.max(.001,h.delay)>old.h.age/Math.max(.001,old.h.delay))charges.set(e.id,{e,h,theme});
  }
 }
 if(layer==='caster')for(const {e,h,theme}of charges.values()){caster(c,e,h,theme,reduced);count++;}
 return count;
}
