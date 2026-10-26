// Original procedural score and small game cues. No network requests or samples
// are needed; the AudioContext is created only after a player gesture.
const clamp=(value,fallback)=>Number.isFinite(value)?Math.max(0,Math.min(1,value)):fallback;
const frequency=midi=>440*2**((midi-69)/12);
const SCORE=[
 [0,3,7,10,7,3,5,7],[0,5,8,12,8,5,7,3],
 [3,7,10,14,10,7,5,3],[2,5,9,12,9,5,4,2],
 [0,7,12,10,7,5,3,7],[5,8,12,15,12,8,7,5],
 [3,10,14,17,14,10,7,3],[2,9,12,14,9,7,4,2],
];
const ROOTS=[0,-4,3,-2,-5,0,-4,-2,3,-5,0,-2];
const THIRDS=[3,4,4,4,3,3,4,4,4,3,3,4];
const TRANSPOSE={graveyard:-5,moon:3,labyrinth:0,shibuya:-2,tokyo:2,citadel:3,marineford:5,tournament:2,zebes:-3};

export function newGameAudio({AudioContext=globalThis.AudioContext||globalThis.webkitAudioContext}={}){
 let context=null,musicBus=null,sfxBus=null,master=null,noise=null,unlocked=false,disposed=false;
 let settings={muted:false,music:.35,sfx:.6},scene={playing:false,paused:true,boss:false,rift:false,mapId:'garden'},sceneKey='',step=0,nextAt=0,lastRun=null,last=null;
 let scheduledSteps=0,effectsPlayed=0;const voices=new Set(),lastCue=new Map();
 const clock=()=>context?.currentTime||0;
 function disconnect(voice){voices.delete(voice);try{voice.source.disconnect();voice.gain.disconnect();}catch{}}
 function silence(kind){for(const voice of [...voices])if(!kind||voice.kind===kind){try{voice.gain.gain.cancelScheduledValues(clock());voice.gain.gain.setValueAtTime(0,clock());voice.source.stop(clock()+.01);}catch{}disconnect(voice);}}
 function gainTo(bus,value){if(!context||!bus)return;try{bus.gain.cancelScheduledValues(clock());bus.gain.setTargetAtTime(value,clock(),.045);}catch{bus.gain.value=value;}}
 function applySettings(){gainTo(master,settings.muted?0:.8);gainTo(musicBus,settings.music*.55);gainTo(sfxBus,settings.sfx*.65);if(settings.muted){silence();nextAt=0;}else if(settings.music===0){silence('music');nextAt=0;}}
 function tone({midi,from,to,type='triangle',at=clock(),duration=.12,volume=.07,kind='sfx',noisy=false}){
  if(!context||!unlocked||disposed||settings.muted||(kind==='music'?settings.music===0:settings.sfx===0))return false;
  if(kind==='sfx'&&[...voices].filter(v=>v.kind==='sfx').length>=12)return false;
  if(kind==='music'&&[...voices].filter(v=>v.kind==='music').length>=36)return false;
  try{
   const start=Math.max(clock(),at),source=noisy?context.createBufferSource():context.createOscillator(),gain=context.createGain();
   if(noisy){source.buffer=noise;}else{source.type=type;source.frequency.setValueAtTime(from||frequency(midi??69),start);if(to)source.frequency.exponentialRampToValueAtTime(Math.max(20,to),start+duration);}
   gain.gain.setValueAtTime(.0001,start);gain.gain.linearRampToValueAtTime(volume,start+Math.min(.018,duration*.12));gain.gain.exponentialRampToValueAtTime(.0001,start+duration);
   source.connect(gain);gain.connect(kind==='music'?musicBus:sfxBus);const voice={source,gain,kind};voices.add(voice);source.onended=()=>disconnect(voice);source.start(start);source.stop(start+duration+.025);return true;
  }catch{return false;}
 }
 function effect(name='ui'){
  if(!context||!unlocked||settings.muted||settings.sfx===0||disposed||context.state==='suspended')return false;
  const now=clock(),cooldown={kill:.09,pickup:.1,hit:.17,ui:.045}[name]??.2;if(now-(lastCue.get(name)??-10)<cooldown)return false;lastCue.set(name,now);let played=false;
  const note=(data,delay=0)=>{played=tone({at:now+delay,...data})||played;};
  if(name==='hit'){note({from:145,to:65,type:'triangle',duration:.19,volume:.18});note({noisy:true,duration:.07,volume:.045});}
  else if(name==='kill')note({from:660,to:385,type:'square',duration:.055,volume:.035});
  else if(name==='pickup')note({from:880,to:1320,type:'sine',duration:.09,volume:.085});
  else if(name==='dash')note({noisy:true,duration:.11,volume:.075});
  else if(name==='level'){for(const [i,midi]of [72,76,79,84].entries())note({midi,type:'triangle',duration:.22,volume:.095},i*.075);}
  else if(name==='chest'){for(const [i,midi]of [67,72,76,79,84].entries())note({midi,type:'sine',duration:.3,volume:.085},i*.07);}
  else if(name==='ultimate'){note({from:150,to:720,type:'triangle',duration:.45,volume:.14});note({midi:45,type:'sine',duration:.45,volume:.12});note({midi:81,type:'sine',duration:.25,volume:.07},.2);}
  else if(name==='boss'||name==='rift'){for(const [i,midi]of (name==='rift'?[48,55,60,63]:[43,50,55]).entries())note({midi,type:'triangle',duration:.5,volume:.1},i*.1);}
  else note({from:580,to:760,type:'sine',duration:.075,volume:.06});
  if(played)effectsPlayed++;return played;
 }
 function scheduleMusic(){
  if(!context||!unlocked||!scene.playing||scene.paused||settings.muted||settings.music===0||context.state==='suspended')return;
  const bpm=scene.rift?124:scene.boss?112:86,interval=60/bpm/2,bars=scene.boss||scene.rift?12:8,steps=bars*8,now=clock();
  if(!nextAt||nextAt<now-.25)nextAt=now+.035;
  // Schedule at most a quarter-second ahead. Pausing never leaves a whole song
  // queued, and a delayed browser frame cannot generate a large burst of notes.
  for(let n=0;nextAt<now+.22&&n<4;n++){
   const current=step%steps,bar=Math.floor(current/8),eighth=current%8,root=ROOTS[bar],transpose=TRANSPOSE[scene.mapId]||0,motif=SCORE[bar%SCORE.length],base=57+transpose;
   if(eighth%2===0)tone({midi:base+root-24,type:'triangle',at:nextAt,duration:interval*1.55,volume:scene.boss?.11:.085,kind:'music'});
   if(eighth===0){for(const offset of [0,THIRDS[bar],7])tone({midi:base+root+offset,type:'sine',at:nextAt,duration:interval*7.5,volume:.023,kind:'music'});}
   if(scene.boss||eighth%2===0||bar%2)tone({midi:base+12+motif[eighth],type:scene.rift?'square':'triangle',at:nextAt,duration:interval*1.35,volume:scene.rift?.033:.055,kind:'music'});
   if(eighth===0||eighth===4||(scene.rift&&eighth===6))tone({from:95,to:38,type:'sine',at:nextAt,duration:.14,volume:.12,kind:'music'});
   if(eighth===2||eighth===6)tone({noisy:true,at:nextAt,duration:.095,volume:scene.boss?.045:.025,kind:'music'});
   if(scene.boss||eighth%2===1)tone({noisy:true,at:nextAt,duration:.025,volume:.012,kind:'music'});
   scheduledSteps++;step=(current+1)%steps;nextAt+=interval;
  }
 }
 async function unlock(){
  if(disposed||!AudioContext)return false;
  try{
   if(!context){context=new AudioContext();master=context.createGain();musicBus=context.createGain();sfxBus=context.createGain();musicBus.connect(master);sfxBus.connect(master);master.connect(context.destination);
    noise=context.createBuffer(1,Math.max(1,Math.floor(context.sampleRate*.15)),context.sampleRate);const data=noise.getChannelData(0);let seed=5743;for(let i=0;i<data.length;i++){seed=(seed*16807)%2147483647;data[i]=(seed/2147483647*2-1)*(.9-i/data.length*.65);}
   }
   if(context.state==='suspended')await context.resume();unlocked=true;applySettings();scheduleMusic();return context.state!=='closed';
  }catch{return false;}
 }
 function setSettings(next={}){const updated={muted:next.muted===undefined?settings.muted:!!next.muted,music:clamp(next.music,settings.music),sfx:clamp(next.sfx,settings.sfx)};if(updated.muted!==settings.muted||updated.music!==settings.music||updated.sfx!==settings.sfx){settings=updated;applySettings();}return {...settings};}
 function setScene(next={}){
  const updated={...scene,...next},key=[!!updated.playing,!!updated.paused,!!updated.boss,!!updated.rift,updated.mapId].join(':');
  if(key!==sceneKey){const phraseChanged=scene.boss!==updated.boss||scene.rift!==updated.rift||scene.mapId!==updated.mapId;silence('music');nextAt=0;if(phraseChanged)step=0;scene=updated;sceneKey=key;}
 }
 function update(g,dt=0){
  if(!g){last=null;lastRun=null;return;}
  const now={hp:(g.p?.hp||0)+(g.p?.shield||0),kills:g.kills||0,pickups:g.pickupsCollected||0,level:g.p?.level||1,ultimate:g.ultimateSerial||0,status:g.status,intro:g.bossIntro?.id,rift:g.rifts?.active?.serial};
  if(last&&lastRun===g.runId){
   if(now.hp<last.hp-.1)effect('hit');else if(now.ultimate!==last.ultimate)effect('ultimate');else if(now.level>last.level)effect('level');else if(now.status==='chest'&&last.status!=='chest')effect('chest');else if(now.rift&&now.rift!==last.rift)effect('rift');else if(now.intro&&now.intro!==last.intro)effect('boss');else if(now.pickups>last.pickups)effect('pickup');else if(now.kills>last.kills)effect('kill');
  }
  last=now;lastRun=g.runId;scheduleMusic();
 }
 function stop(){silence();nextAt=0;scene={...scene,playing:false,paused:true};sceneKey='';last=null;lastRun=null;}
 function dispose(){if(disposed)return;stop();disposed=true;unlocked=false;try{context?.close()?.catch?.(()=>{});}catch{}}
 const debug=()=>({unlocked,muted:settings.muted,settings:{...settings},scene:{...scene},scheduledSteps,effectsPlayed,activeSfxVoices:[...voices].filter(v=>v.kind==='sfx').length,activeMusicVoices:[...voices].filter(v=>v.kind==='music').length,contextState:context?.state||'unavailable'});
 return {unlock,setSettings,setScene,update,effect,stop,dispose,debug};
}
