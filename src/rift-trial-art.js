// Challenge scenery is read-only. Every warning, light and moving landmark
// reads the persisted trial clock; no hitboxes or wall-clock animation live here.
const TAU=Math.PI*2;
const finite=(n,d=0)=>Number.isFinite(n)?n:d,clamp=(n,a=0,b=1)=>Math.max(a,Math.min(b,finite(n)));
const BONE='#dddccb',GOLD='#ead19a',INK='#101722',TEAL='#a0d8d1',PINK='#d7b3d7';
const COLORS={darknessdevil:BONE,foundereren:'#d8d5aa',beerus:'#d9b1ef',walpurgisrift:PINK,aizenrift:'#c7bbec',madararift:'#d4e1b7',sukunaheian:'#e5aa9d',borosrift:'#a9d9e0',deathdevil:BONE};
const point=p=>p&&Number.isFinite(p.x)&&Number.isFinite(p.y);
const alpha=(c,a)=>{c.globalAlpha=clamp(a);};
function line(c,pts,color,width=1){c.strokeStyle=color;c.lineWidth=width;c.lineJoin='round';c.lineCap='round';c.beginPath();pts.forEach(([x,y],i)=>i?c.lineTo(x,y):c.moveTo(x,y));c.stroke();}
function poly(c,pts,color,edge){c.fillStyle=color;c.beginPath();pts.forEach(([x,y],i)=>i?c.lineTo(x,y):c.moveTo(x,y));c.closePath();c.fill();if(edge){c.strokeStyle=edge;c.lineWidth=2;c.stroke();}}
function oval(c,x,y,rx,ry,color){c.fillStyle=color;c.beginPath();c.ellipse(x,y,Math.max(.1,rx),Math.max(.1,ry),0,0,TAU);c.fill();}
function ring(c,x,y,r,color,width=2,progress=1){c.strokeStyle=color;c.lineWidth=width;c.beginPath();c.arc(x,y,Math.max(.1,r),-Math.PI/2,-Math.PI/2+TAU*clamp(progress));c.stroke();}
function label(c,text,x,y,color=BONE,size=10){c.font=`700 ${size}px "DM Sans",sans-serif`;c.textAlign='center';c.lineWidth=3;c.strokeStyle=INK;c.strokeText(String(text),x,y);c.fillStyle=color;c.fillText(String(text),x,y);}
function star(c,x,y,size,color){poly(c,[[x,y-size],[x+size*.25,y-size*.25],[x+size,y],[x+size*.25,y+size*.25],[x,y+size],[x-size*.25,y+size*.25],[x-size,y],[x-size*.25,y-size*.25]],color);}
function tick(c,x,y,color){line(c,[[x-7,y],[x-2,y+5],[x+8,y-7]],color,3);}
function numbered(c,x,y,r,number,color,done=false){oval(c,x,y,r,r,INK+'b8');ring(c,x,y,r,color,1.5);if(done)tick(c,x,y,color);else label(c,number,x,y+4,color,12);}
const palettes={o:'#151d28',b:'#8a9b9c',s:'#b3bfb5',w:'#e4e7d5',h:'#f2f0da',v:'#26363f',g:'#597580',t:'#9db9b7',a:'#c6a57c'};
const REMAINS={
 helmet:[
  '      ooooooo      ',
  '    oobsswwwboo    ',
  '   obswwhhhwwsbo   ',
  '  obwwsvvvvvvwsbo  ',
  ' obwwsvggggvvvwsbo ',
  ' obwsvgtttggvvvwbo ',
  ' obwsvvggggvvvvsbo ',
  ' obwsvvvvvvvvvvsbo ',
  '  obwsvvvvvvvvsbo  ',
  '   obswwwwwwwsbo   ',
  '    oobsssssboo    ',
  '    oswwwwwwwso    ',
  '   oobsssssssboo   ',
  '    oooooooooo    '],
 gauntlet:[
  '        ooooo      ',
  '       oswwwso     ',
  '       oswwhso     ',
  '       obsswso     ',
  '      oswwwwso     ',
  '     oswwwwso      ',
  '    oswwwwso       ',
  '   oswwwwso        ',
  '   obssssbo        ',
  '   oswwwwso        ',
  '  oswwwwwwso       ',
  ' oswwwwwwwwso      ',
  ' oswwswswswso      ',
  '  oswswswswso      ',
  '   obssssbo        ',
  '    oooooo         '],
 boot:[
  '     ooooooo       ',
  '    oswwwwwso      ',
  '    obsssssbo      ',
  '    oswwwwwso      ',
  '    oswwhwwso      ',
  '    obsssssbo      ',
  '    oswwwwwso      ',
  '    oswwwwwso      ',
  '    oswwwwwwso     ',
  '   oswwwwwwwwsoo   ',
  '   oswwwwwwwwwwso  ',
  '  obssssssssssssbo ',
  '  osssssssssssssso ',
  '   oooooooooooooo  '],
};
function remains(c,kind,x,y){
 const rows=REMAINS[kind]||REMAINS.helmet,s=2;
 c.save();c.translate(x-rows[0].length*s/2,y-rows.length*s+5);for(let yy=0;yy<rows.length;yy++)for(let xx=0;xx<rows[yy].length;xx++){const color=palettes[rows[yy][xx]];if(color){c.fillStyle=color;c.fillRect(xx*s,yy*s,s,s);}}c.restore();
}
function warning(c,h,color){
 if(!point(h)||!Number.isFinite(h.delay)||!Number.isFinite(h.age)||h.age>h.delay+finite(h.duration,.5))return;
 const active=h.age>=h.delay,p=clamp(h.age/Math.max(.01,h.delay));c.save();c.setLineDash(active?[]:[7,6]);
 if(h.shape==='line'&&[h.tx,h.ty,h.width].every(Number.isFinite)){
  line(c,[[h.x,h.y],[h.tx,h.ty]],active?'#f1b2a055':color+'25',Math.max(2,h.width*2));line(c,[[h.x,h.y],[h.tx,h.ty]],active?'#fff0d5':color,active?3:1.5);
 }else if(Number.isFinite(h.r)){
  oval(c,h.x,h.y,h.r,h.r,active?'#de9e9a40':color+'10');ring(c,h.x,h.y,h.r,active?'#ffe1be':color,active?3:1.5);c.setLineDash([]);ring(c,h.x,h.y,h.r+4,color,2,p);
  if(active)star(c,h.x,h.y,Math.min(25,h.r*.4),'#eadbb8');
 }
 c.restore();
}
function darkness(c,g,q,quiet){
 const p=g.p,r=finite(q.lightRadius,130+finite(q.progress)*30),goals=q.goals||[],t=quiet?0:finite(q.age);
 for(let i=0;i<goals.length;i++){
  const goal=goals[i];if(!point(goal)||goal.done)continue;const d=Math.hypot(goal.x-p.x,goal.y-p.y);if(d>r+85)continue;
  c.save();alpha(c,clamp((r+85-d)/70,.12,1));oval(c,goal.x,goal.y+5,24,9,'#010406bb');remains(c,['helmet','gauntlet','boot'][i%3],goal.x,goal.y);
  if(d<r+25){star(c,goal.x+21,goal.y-25,quiet?4:4+Math.sin(t*3+i)*1.2,BONE);label(c,['ASTRONAUT HELMET','ASTRONAUT ARM','ASTRONAUT LEG'][i%3],goal.x,goal.y+25,BONE,8);}c.restore();
 }
}
function paths(c,q){
 const goals=(q.goals||[]).filter(point),path=[[0,140],...goals.map(v=>[v.x,v.y])];line(c,path,'#d8d8a82b',8);line(c,path,'#e9e9bf66',1.5);
 for(let i=0;i<goals.length;i++){const v=goals[i],active=!v.done&&(v.active===true||i===finite(q.progress));
  c.save();alpha(c,v.done?.45:active?1:.38);for(const side of [-1,1]){line(c,[[v.x+side*28,v.y+12],[v.x+side*30,v.y-35],[v.x+side*22,v.y-56]],BONE,4);line(c,[[v.x+side*31,v.y-34],[v.x+side*43,v.y-47]],BONE,2);}line(c,[[v.x-30,v.y-35],[v.x+30,v.y-35]],'#b4bb97',2);
  oval(c,v.x,v.y+3,33,15,active?'#d2d6aa25':'#d2d6aa10');numbered(c,v.x,v.y-12,12,i+1,BONE,v.done);c.restore();}
}
function pudding(c,x,y,scale=1){c.save();c.translate(x,y);c.scale(scale,scale);oval(c,0,5,22,8,'#a894bc');oval(c,0,3,21,6,'#eee6c9');poly(c,[[-14,1],[-10,-20],[10,-20],[14,1]],'#e7bd79',INK);oval(c,0,-20,10,4,'#9e5d49');line(c,[[-7,-15],[-9,-1]],'#fff2b8',2);oval(c,2,-23,5,3,'#f4e5bd');c.restore();}
function appetite(c,g,q){
 const shrine=q.shrine||q.altar||{x:0,y:0};if(point(shrine)){
  oval(c,shrine.x,shrine.y+8,60,28,'#443353');poly(c,[[shrine.x-47,shrine.y],[shrine.x-33,shrine.y-14],[shrine.x+33,shrine.y-14],[shrine.x+47,shrine.y]],'#b7a1c4',INK);line(c,[[shrine.x-40,shrine.y+2],[shrine.x+40,shrine.y+2]],GOLD,3);
  for(let i=0;i<finite(q.progress);i++)pudding(c,shrine.x+(i-1)*24,shrine.y-8,.55);ring(c,shrine.x,shrine.y,finite(shrine.r,65),'#e1c6f2',1.5);label(c,'OFFERINGS',shrine.x,shrine.y+55,'#e2c7ee',9);
 }
 for(const goal of q.goals||[])if(point(goal)&&!goal.done&&!goal.carried){pudding(c,goal.x,goal.y);star(c,goal.x+22,goal.y-27,4,GOLD);}
 if(q.carrying!==null&&q.carrying!==undefined&&q.carrying!==false){pudding(c,g.p.x,g.p.y-63,.7);label(c,'CARRYING PUDDING',g.p.x,g.p.y-86,GOLD,8);}
}
function spotlights(c,q){
 for(let i=0;i<(q.goals||[]).length;i++){const v=q.goals[i];if(!point(v))continue;const active=!v.done&&(v.active===true||i===finite(q.progress)),r=finite(v.r,46);
  c.save();alpha(c,v.done?.28:active?1:.25);if(active){poly(c,[[v.x-13,v.y-155],[v.x+13,v.y-155],[v.x+r,v.y+8],[v.x-r,v.y+8]],'#dfbeda20');oval(c,v.x,v.y,r,r*.45,'#dec9e338');}ring(c,v.x,v.y,r,active?'#f4d7ed':'#a88ba8',active?3:1);numbered(c,v.x,v.y-12,14,i+1,PINK,v.done);if(active)ring(c,v.x,v.y,r+6,GOLD,3,finite(v.charge??q.hold));c.restore();
 }
}
function butterfly(c,x,y){oval(c,x-5,y-2,5,7,GOLD);oval(c,x+5,y-2,5,7,'#f7df9f');oval(c,x-4,y+5,4,4,'#c29d62');oval(c,x+4,y+5,4,4,'#ecd49a');line(c,[[x,y-5],[x,y+8]],'#57485f',2);}
function mirrors(c,q){
 for(let i=0;i<(q.goals||[]).length;i++){const v=q.goals[i];if(!point(v))continue;const real=v.real===true||v.correct===true||i===q.realIndex;
  c.save();c.translate(v.x,v.y);const mistaken=q.wrongId===v.id&&q.feedbackTime>0;poly(c,[[-29,7],[-34,-65],[-23,-88],[23,-88],[34,-65],[29,7]],mistaken?'#955f78':'#4f476c',INK);poly(c,[[-22,0],[-26,-61],[-17,-78],[17,-78],[26,-61],[22,0]],'#b9b9d42c',mistaken?'#e6a6ab':'#bcb4cf');line(c,[[-20,-60],[12,-71]],'#e2e0eb',1.5);line(c,[[-17,-39],[18,-52]],'#b6b0c6',1);
  // Every mirror contains a reflection; only the true one carries the golden
  // butterfly. The cue remains fixed and readable in reduced motion.
  oval(c,0,-49,8,10,'#a29ab085');poly(c,[[-10,-36],[10,-36],[15,-9],[-15,-9]],'#aaa0bd55');line(c,[[-13,-73],[9,-45],[-5,-17]],real?'#d8d3e5':'#89778d',1);
  if(real)butterfly(c,23,-86);numbered(c,0,22,10,i+1,'#c7bbec');c.restore();
 }
}
function shelter(c,q){
 const v=q.shelter||q.safeZone||q.goals?.[finite(q.stage)]||q.goals?.[0];if(!point(v))return;const r=finite(v.r,85);
 oval(c,v.x,v.y,r,r,'#b4ce9c22');ring(c,v.x,v.y,r,'#d6e7b4',3);ring(c,v.x,v.y,r-9,'#8aaf8b',1);
 for(let i=0;i<8;i++){const a=i*TAU/8;line(c,[[v.x+Math.cos(a)*(r-14),v.y+Math.sin(a)*(r-14)],[v.x+Math.cos(a)*(r+8),v.y+Math.sin(a)*(r+8)]],'#cbdcb0',2);}
 poly(c,[[v.x,v.y-27],[v.x+21,v.y-11],[v.x+13,v.y+12],[v.x,v.y+23],[v.x-13,v.y+12],[v.x-21,v.y-11]],'#1f3541','#deebbf');line(c,[[v.x,v.y-15],[v.x,v.y+11]],'#deebbf',2);label(c,'METEOR SHELTER',v.x,v.y+r+20,'#deebbf',10);
 const until=finite(q.nextImpact??q.roundDuration,4)-finite(q.roundAge??q.phaseAge);if(until>0)label(c,Math.ceil(until)+'s',v.x,v.y-40,'#deebbf',13);
}
function shrineSeals(c,q){
 for(let i=0;i<(q.goals||[]).length;i++){const v=q.goals[i];if(!point(v))continue;const color=v.done?'#b4d7bc':'#e7b49c',r=finite(v.r,46);
  oval(c,v.x,v.y,r,r,'#e8ad9411');ring(c,v.x,v.y,r,color,2);ring(c,v.x,v.y,r*.78,color,1);
  for(let k=0;k<6;k++){const a=k*TAU/6;poly(c,[[v.x+Math.cos(a)*r*.75,v.y+Math.sin(a)*r*.75],[v.x+Math.cos(a+.12)*r*.55,v.y+Math.sin(a+.12)*r*.55],[v.x+Math.cos(a-.12)*r*.55,v.y+Math.sin(a-.12)*r*.55]],color);}
  if(v.done)tick(c,v.x,v.y,color);else{label(c,i+1,v.x,v.y+4,color,14);ring(c,v.x,v.y,r+6,GOLD,4,finite(v.charge??v.hold));}
  for(const side of [-1,1]){c.fillStyle='#ab887c';c.fillRect(v.x+side*(r+12)-3,v.y-8,6,15);poly(c,[[v.x+side*(r+12),v.y-22],[v.x+side*(r+12)+4,v.y-11],[v.x+side*(r+12)-4,v.y-11]],'#f4d4a3');}
 }
}
function vents(c,q){
 for(let i=0;i<(q.goals||[]).length;i++){const v=q.goals[i];if(!point(v))continue;const armed=!!v.armed||v.state==='armed',done=!!v.done,color=done?'#a9d4be':armed?'#f1bd8e':'#a9d9e0';
  c.save();c.translate(v.x,v.y);poly(c,[[-27,-27],[27,-27],[34,-20],[34,20],[27,27],[-27,27],[-34,20],[-34,-20]],'#263345',color);for(let k=-2;k<=2;k++){c.fillStyle=done?'#101c26':armed?'#cc8e61':'#668f9b';c.fillRect(-22,k*7-2,44,4);}for(const side of [-1,1])for(const yy of [-20,20]){c.fillStyle=color;c.fillRect(side*27-2,yy-2,4,4);}
  if(done){for(const x of [-12,0,12])line(c,[[x,-18],[x-5,-33],[x,-45]],'#8cc2bf88',3);tick(c,0,1,TEAL);}else if(armed){ring(c,0,0,finite(v.r,60),'#f0be91',2);label(c,'LEAVE THE VENT',0,-47,'#f4cf9e',9);}else label(c,'VENT '+(i+1),0,-40,TEAL,10);c.restore();
 }
}
function lantern(c,x,y){line(c,[[x,y-40],[x,y-31]],BONE,2);poly(c,[[x-9,y-31],[x+9,y-31],[x+13,y-23],[x+10,y-5],[x-10,y-5],[x-13,y-23]],'#414b50',BONE);poly(c,[[x-5,y-24],[x+5,y-24],[x+4,y-11],[x-4,y-11]],'#f4edc3');line(c,[[x-13,y-32],[x+13,y-32]],BONE,3);oval(c,x,y-18,3,5,'#fff8cf');}
function procession(c,q){
 const v=q.sanctuary||q.lantern||q.safeZone;if(!point(v))return;const r=finite(v.r,105);
 oval(c,v.x,v.y,r,r,'#d3dec522');ring(c,v.x,v.y,r,'#dfe5c8',3);ring(c,v.x,v.y,r-7,'#8fa599',1);
 for(let i=0;i<12;i++){const a=i*TAU/12,x=v.x+Math.cos(a)*r,y=v.y+Math.sin(a)*r;line(c,[[x,y+4],[x,y-3]],'#c6ccb1',2);star(c,x,y-7,3,'#e5e4c4');}
 lantern(c,v.x,v.y-45);label(c,'FOLLOW THE LANTERN',v.x,v.y+r+20,BONE,9);
 const route=q.route||q.path||[];for(let i=0;i<route.length;i++){const p=route[i];if(point(p))oval(c,p.x,p.y,3,3,'#d7dec444');}
}
const drawByBoss={darknessdevil:darkness,foundereren:(_c,_g,q)=>paths(_c,q),beerus:appetite,walpurgisrift:(_c,_g,q)=>spotlights(_c,q),aizenrift:(_c,_g,q)=>mirrors(_c,q),madararift:(_c,_g,q)=>shelter(_c,q),sukunaheian:(_c,_g,q)=>shrineSeals(_c,q),borosrift:(_c,_g,q)=>vents(_c,q),deathdevil:(_c,_g,q)=>procession(_c,q)};
function objectiveBearing(c,g,q,w,h){
 const goals=(q.goals||[]).filter(v=>point(v)&&!v.done&&!v.carried),nearest=list=>list.slice().sort((a,b)=>Math.hypot(a.x-g.p.x,a.y-g.p.y)-Math.hypot(b.x-g.p.x,b.y-g.p.y))[0];
 let target,name='OBJECTIVE';
 if(q.kind==='offerings'){target=q.carrying?q.shrine:nearest(goals);name=q.carrying?'SHRINE':'PUDDING';}
 else if(q.kind==='procession'){target=q.sanctuary;name='LANTERN';}
 else if(q.kind==='mirrors'){target=nearest(goals);name='MIRRORS';}
 else if(['paths','spotlights','shelters'].includes(q.kind)){target=goals.find(v=>v.active);name=q.kind==='paths'?'BEACON '+(finite(q.stage)+1):q.kind==='spotlights'?'SPOTLIGHT '+(finite(q.stage)+1):'SHELTER';}
 else {target=nearest(goals.filter(v=>!v.armed));name=q.kind==='seals'?'SHRINE SEAL':'REACTOR VENT';}
 if(!point(target))return;
 const zoom=clamp(g.zoom,.2,3),dx=(target.x-g.p.x)*zoom,dy=(target.y-g.p.y)*zoom,sx=w/2+dx,sy=h/2+dy,landscape=w>h&&h<=450,top=landscape?135:130,bottom=landscape?145:250;
 if(sx>48&&sx<w-48&&sy>top&&sy<h-bottom)return;
 const angle=Math.atan2(dy,dx),rx=Math.max(35,w/2-45),ry=Math.max(35,h/2-(landscape?120:150)),factor=Math.min(rx/Math.max(1,Math.abs(dx)),ry/Math.max(1,Math.abs(dy))),x=w/2+dx*factor,y=h/2+dy*factor;
 c.save();c.translate(x,y);oval(c,0,0,18,18,INK+'ed');ring(c,0,0,18,COLORS[q.bossId],1.5);c.rotate(angle);poly(c,[[9,0],[-5,-6],[-1,0],[-5,6]],COLORS[q.bossId]);c.rotate(-angle);label(c,name,0,32,COLORS[q.bossId],8);c.restore();
}
export function drawRiftTrialWorld(c,g,reducedMotion=false){
 const q=g?.riftTrial,draw=q&&drawByBoss[q.bossId];if(!draw||!point(g.p)||!Number.isFinite(q.age))return false;
 c.save();draw(c,g,q,reducedMotion);for(const h of (q.hazards||[]).slice(0,20))warning(c,h,COLORS[q.bossId]);c.restore();return true;
}
export function drawRiftTrialOverlay(c,g,w,h,reducedMotion=false){
 const q=g?.riftTrial;if(!q){
  const glow=g?.riftTrialAfterglow;if(glow?.kind!=='blackout'||!point(g.p)||![w,h,glow.age,glow.duration].every(Number.isFinite)||glow.duration<=0||glow.age>=glow.duration)return false;
  const t=clamp(glow.age/glow.duration),zoom=clamp(g.zoom,.2,3),radius=(220+(reducedMotion?0:600*t))*zoom;
  c.save();const veil=c.createRadialGradient(w/2,h/2,Math.max(1,radius*.5),w/2,h/2,radius);veil.addColorStop(0,'#01040700');veil.addColorStop(1,`rgba(1,4,7,${(1-t)*.96})`);c.fillStyle=veil;c.fillRect(0,0,w,h);c.restore();return true;
 }
 if(!drawByBoss[q.bossId]||!point(g.p)||![w,h].every(Number.isFinite))return false;
 if(q.bossId!=='darknessdevil'){objectiveBearing(c,g,q,w,h);return true;}
 const zoom=clamp(g.zoom,.2,3),cx=w/2,cy=h/2-9*zoom,r=finite(q.lightRadius,130+finite(q.progress)*30)*zoom;
 c.save();const glow=c.createRadialGradient(cx,cy,Math.min(r*.44,r-1),cx,cy,r);glow.addColorStop(0,'#01040705');glow.addColorStop(.65,'#01040740');glow.addColorStop(1,'#010407fc');c.fillStyle=glow;c.fillRect(0,0,w,h);
 // A faint bearing appears only near the edge of the player's light. It gives
 // a direction, not an objective marker through the entire blackened arena.
 const missing=(q.goals||[]).filter(v=>point(v)&&!v.done),nearest=missing.slice().sort((a,b)=>Math.hypot(a.x-g.p.x,a.y-g.p.y)-Math.hypot(b.x-g.p.x,b.y-g.p.y))[0];
 if(nearest&&(reducedMotion||finite(q.age)%4<1.5)){
  const a=Math.atan2(nearest.y-g.p.y,nearest.x-g.p.x),distance=Math.hypot(nearest.x-g.p.x,nearest.y-g.p.y),rr=Math.min(r*.82,Math.min(w,h)*.32);
  if(distance>100){alpha(c,reducedMotion?.55:.35+.2*Math.sin(finite(q.age)%4*Math.PI/1.5));c.translate(cx+Math.cos(a)*rr,cy+Math.sin(a)*rr);c.rotate(a);poly(c,[[7,0],[-4,-4],[-1,0],[-4,4]],BONE);}
 }
 c.restore();
 // Read the exact same warnings again above the darkness veil so an attack
 // cannot become invisible when its edge extends outside the flashlight.
 c.save();c.translate(w/2,h/2);c.scale(zoom,zoom);c.translate(-g.p.x,-g.p.y);for(const mark of (q.hazards||[]).slice(0,20))warning(c,mark,BONE);c.restore();return true;
}
