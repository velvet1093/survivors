import test from 'node:test';
import assert from 'node:assert/strict';
import {newGameAudio} from '../src/game-audio.js';

class Param{
 constructor(){this.value=0;this.calls=[];}
 record(name,...values){assert.ok(values.every(Number.isFinite));this.calls.push([name,...values]);this.value=values[0];}
 setValueAtTime(...v){this.record('set',...v);}linearRampToValueAtTime(...v){this.record('linear',...v);}exponentialRampToValueAtTime(...v){this.record('exp',...v);}setTargetAtTime(...v){this.record('target',...v);}cancelScheduledValues(...v){this.calls.push(['cancel',...v]);}
}
function fakeAudio(){
 const instances=[];
 class Context{
  constructor(){instances.push(this);this.currentTime=0;this.sampleRate=8000;this.state='suspended';this.destination={};this.sources=[];this.gains=[];this.buffers=[];this.closed=0;}
  createGain(){const node={gain:new Param(),connect(){},disconnect(){}};this.gains.push(node);return node;}
  source(){const context=this,node={frequency:new Param(),connect(){},disconnect(){},start(at){assert.ok(at>=context.currentTime);this.started=at;},stop(at){assert.ok(Number.isFinite(at));this.stopped=at;}};this.sources.push(node);return node;}
  createOscillator(){return this.source();}createBufferSource(){return this.source();}
  createBuffer(channels,count,rate){assert.equal(channels,1);const data=new Float32Array(count),buffer={getChannelData:()=>data};this.buffers.push(buffer);return buffer;}
  async resume(){this.state='running';}async close(){this.closed++;this.state='closed';}
  advance(seconds){this.currentTime+=seconds;for(const source of this.sources)if(!source.ended&&source.stopped<=this.currentTime){source.ended=true;source.onended?.();}}
 }
 return {Context,instances};
}
const run=()=>({runId:'audio-run',status:'playing',p:{hp:100,shield:0,level:1},kills:0,pickupsCollected:0,ultimateSerial:0});

test('audio never opens a context before a gesture and remains optional without browser audio',async()=>{
 const fake=fakeAudio(),audio=newGameAudio({AudioContext:fake.Context});audio.setScene({playing:true,paused:false});audio.update(run(),.04);audio.effect('ui');assert.equal(fake.instances.length,0);assert.equal(audio.debug().unlocked,false);assert.equal(await audio.unlock(),true);assert.equal(fake.instances.length,1);assert.ok(audio.debug().activeMusicVoices>0);
 const silent=newGameAudio({AudioContext:null});assert.equal(await silent.unlock(),false);assert.equal(silent.effect('hit'),false);assert.doesNotThrow(()=>{silent.setScene({playing:true,paused:false});silent.update(run(),1);silent.stop();silent.dispose();});audio.dispose();
});

test('original score pauses without queued music and resumes with bounded scheduling at each intensity',async()=>{
 const fake=fakeAudio(),audio=newGameAudio({AudioContext:fake.Context});await audio.unlock();const context=fake.instances[0],g=run();audio.setScene({playing:true,paused:false,mapId:'shibuya'});audio.update(g,.04);assert.ok(audio.debug().scheduledSteps>0);assert.ok(audio.debug().activeMusicVoices>0);audio.setScene({paused:true});assert.equal(audio.debug().activeMusicVoices,0);const count=audio.debug().scheduledSteps;context.advance(20);audio.update(g,.04);assert.equal(audio.debug().scheduledSteps,count);
 for(const scene of [{boss:false,rift:false},{boss:true,rift:false},{boss:true,rift:true}]){audio.setScene({playing:true,paused:false,...scene});for(let i=0;i<80;i++){context.advance(.1);audio.update(g,.1);assert.ok(audio.debug().activeMusicVoices<=36);}assert.ok(audio.debug().scheduledSteps>count);}
 // A long inactive browser frame schedules only a small look-ahead, not all missed beats.
 context.advance(100);const before=audio.debug().scheduledSteps;audio.update(g,.04);assert.ok(audio.debug().scheduledSteps-before<=4);audio.stop();assert.equal(audio.debug().activeMusicVoices,0);audio.dispose();
});

test('master mute and independent volume settings clamp safely and suppress new notes',async()=>{
 const fake=fakeAudio(),audio=newGameAudio({AudioContext:fake.Context});await audio.unlock();audio.setScene({playing:true,paused:false});audio.update(run(),.1);assert.ok(audio.effect('level'));audio.setSettings({muted:true});assert.equal(audio.debug().activeMusicVoices,0);assert.equal(audio.debug().activeSfxVoices,0);const before=fake.instances[0].sources.length;audio.update(run(),.1);assert.equal(audio.effect('ui'),false);assert.equal(fake.instances[0].sources.length,before);
 assert.deepEqual(audio.setSettings({muted:false,music:-4,sfx:9}),{muted:false,music:0,sfx:1});audio.update(run(),.1);assert.equal(audio.debug().activeMusicVoices,0);assert.equal(audio.effect('ui'),true);audio.setSettings({sfx:0,music:NaN});assert.equal(audio.effect('hit'),false);assert.equal(audio.debug().settings.music,0);audio.dispose();audio.dispose();assert.equal(fake.instances[0].closed,1);
});

test('combat cues detect real state changes once, throttle frequent kills and cap SFX voices',async()=>{
 const fake=fakeAudio(),audio=newGameAudio({AudioContext:fake.Context});await audio.unlock();audio.setSettings({music:0});const context=fake.instances[0],g=run();audio.update(g,.04);assert.equal(audio.debug().effectsPlayed,0);g.kills=2;audio.update(g,.04);assert.equal(audio.debug().effectsPlayed,1);g.kills=3;audio.update(g,.04);assert.equal(audio.debug().effectsPlayed,1);context.advance(.11);g.kills=4;audio.update(g,.04);assert.equal(audio.debug().effectsPlayed,2);context.advance(.2);g.p.hp=70;audio.update(g,.04);assert.equal(audio.debug().effectsPlayed,3);context.advance(.3);g.ultimateSerial++;audio.update(g,.04);assert.equal(audio.debug().effectsPlayed,4);context.advance(.5);g.status='chest';audio.update(g,.04);assert.equal(audio.debug().effectsPlayed,5);audio.update(g,.04);assert.equal(audio.debug().effectsPlayed,5);
 context.advance(1);for(const cue of ['level','chest','ultimate','boss','rift','dash','hit','pickup','ui'])audio.effect(cue);assert.ok(audio.debug().activeSfxVoices<=12);context.advance(3);assert.equal(audio.debug().activeSfxVoices,0);g.runId='new-run';g.kills=900;audio.update(g,.04);assert.equal(audio.debug().activeSfxVoices,0);audio.dispose();
});

test('procedural percussion is deterministic and locally generated',async()=>{
 const a=fakeAudio(),b=fakeAudio(),left=newGameAudio({AudioContext:a.Context}),right=newGameAudio({AudioContext:b.Context});await left.unlock();await right.unlock();const x=a.instances[0].buffers[0].getChannelData(0),y=b.instances[0].buffers[0].getChannelData(0);assert.ok(x.length>1000);assert.deepEqual(x,y);assert.ok(x.every(value=>Math.abs(value)<=1));left.dispose();right.dispose();
});
