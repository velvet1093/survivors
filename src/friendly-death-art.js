import {characterPixels,pixelRuns,HERO_SCALE,HERO_FOOT} from './pixel-characters.js';
import {summonPixels} from './summon-art.js';
import {frierenGolemPixels} from './frieren-golem-art.js';

const TAU=Math.PI*2,clamp=n=>Math.max(0,Math.min(1,n)),smooth=n=>{const p=clamp(n);return p*p*(3-2*p);},frames=new Map();
const colorFor=kind=>kind==='queentaratect'||kind==='spiderling'||kind==='archtaratect'?'#e9dff0':kind==='mahoraga'?'#e3d5a4':kind==='frierenGolem'?'#c9b38b':kind==='nue'?'#c4c8eb':kind==='clone'?'#d9e9dd':kind==='shadow'?'#ceb7db':'#b9c9da';

export function friendlyDeathPixels(death){
 const hero=death.hero,unit=death.unit||{},key=hero?[hero.id,hero.skin,hero.form,hero.pose,death.kind].join(':'):[death.kind,!!unit.fused].join(':');
 if(frames.has(key))return frames.get(key);
 let pixels;
 if(hero)pixels=characterPixels(hero.id,{skin:hero.skin,form:hero.form||0,pose:hero.pose||'',frame:0,moving:false,attack:false,expression:death.kind==='player'?'hurt':'neutral',blink:false});
 else if(death.kind==='frierenGolem')pixels=frierenGolemPixels({frame:0,phase:'idle'});
 else pixels=summonPixels(death.kind,{frame:0,attack:false,fused:unit.fused});
 if(frames.size>=96)frames.delete(frames.keys().next().value);frames.set(key,pixels);return pixels;
}

function smoke(c,death,p,quiet){
 const color=colorFor(death.kind),count=quiet?5:12;
 c.fillStyle=color;c.globalAlpha=(1-p)*.55;
 for(let i=0;i<count;i++){
  const a=i*2.399,spread=quiet?13:12+p*35,size=(quiet?4:5+i%4)*(1-p*.45),x=Math.cos(a)*spread,y=-19+Math.sin(a)*spread*.42-(quiet?0:p*12);
  c.fillRect(Math.round(x-size/2),Math.round(y-size/2),Math.max(1,size),Math.max(1,size));
 }
}

function player(c,death,p,quiet){
 const hero=death.hero,fall=quiet?0:smooth((p-.08)/.55),native=HERO_SCALE*(hero.id==='shinji'?1.15:hero.id==='eren'&&hero.form?1.55:1),slime=hero.id==='rimuru'&&hero.pose==='predator',ball=hero.id==='samus'&&hero.pose==='bomb';
 c.globalAlpha=clamp(1-smooth((p-.62)/.38));c.translate(0,quiet?0:fall*(slime||ball?3:5));
 c.rotate(quiet||slime||ball?0:(hero.facing||1)*fall*1.22);c.scale((hero.facing||1)*native,native*(slime?1-fall*.35:1));
 for(const run of pixelRuns(friendlyDeathPixels(death))){c.fillStyle=run.color;c.fillRect(run.x-HERO_FOOT.x,run.y-HERO_FOOT.y,run.width,1);}
}

function golem(c,death,p,quiet){
 c.scale((death.unit.facing||1)*1.3,1.3);
 for(const run of pixelRuns(friendlyDeathPixels(death))){
  const side=run.x<16?-1:run.x>40?1:0,top=run.y<25,lower=run.y>54;
  const scatter=quiet?0:smooth((p-.1)/.8),dx=side*scatter*(side?13:0)+(top?scatter*4:0),drop=quiet?0:Math.min(66-run.y,scatter*scatter*(top?42:lower?8:24));
  c.globalAlpha=(1-p)*(top?.95:1);c.fillStyle=run.color;c.fillRect(run.x-28+dx,run.y-71+drop,run.width,1);
 }
}

function mahoraga(c,death,p,quiet){
 c.scale((death.unit.facing||1)*1.05,1.05);
 for(const run of pixelRuns(friendlyDeathPixels(death))){
  const band=Math.floor(run.y/5),fade=clamp(1-p*(1.1+(band%4)*.25));if(fade<=0)continue;
  const scatter=quiet?0:smooth((p-.12)/.8),dx=Math.sin(band*2.399)*scatter*12,dy=quiet?0:-scatter*(3+(band%5)*3);
  c.globalAlpha=fade;c.fillStyle=run.color;c.fillRect(run.x-28+dx,run.y-71+dy,run.width,1);
 }
 // Eight grip fragments separate from the wheel, carrying its final adaptation.
 if(!quiet){c.globalAlpha=clamp(1-p)*.9;for(let i=0;i<8;i++){const a=i*TAU/8,dist=13+p*24,x=Math.cos(a)*dist,y=-63+Math.sin(a)*dist*.75-p*8;c.save();c.translate(x,y);c.rotate(a+p);c.fillStyle=i%2?'#bbaa72':'#eadcaf';c.fillRect(-2,-3,4,6);c.restore();}}
}

export function drawFriendlyDeath(c,death,reduced=false){
 if(!death||!(death.duration>0)||!(death.age>=0)||death.age>=death.duration||!Number.isFinite(death.x)||!Number.isFinite(death.y))return false;
 const p=clamp(death.age/death.duration),quiet=reduced||death.quiet;
 c.save();c.translate(death.x,death.y);c.imageSmoothingEnabled=false;
 if(death.kind==='player'&&death.hero)player(c,death,p,quiet);
 else if(death.kind==='frierenGolem')golem(c,death,p,quiet);
 else if(death.kind==='mahoraga')mahoraga(c,death,p,quiet);
 else{
  c.globalAlpha=clamp(1-p*1.7);const scale=death.hero?HERO_SCALE:.85;c.save();c.translate(0,quiet?0:-p*10);c.scale((death.unit?.facing||death.hero?.facing||1)*scale,scale);
  for(const run of pixelRuns(friendlyDeathPixels(death))){c.fillStyle=run.color;c.fillRect(run.x-28,run.y-71,run.width,1);}c.restore();smoke(c,death,p,quiet);
 }
 c.restore();return true;
}

export function drawFriendlyDeaths(c,g,reduced=false){
 for(const death of g.summonDeaths||[])drawFriendlyDeath(c,death,reduced);
 if(g.playerDeath)drawFriendlyDeath(c,g.playerDeath,reduced);
}
