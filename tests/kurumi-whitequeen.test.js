import test from 'node:test';
import assert from 'node:assert/strict';
import {kurumiPixels,WHITE_QUEEN_COLORS as colors} from '../src/kurumi-art.js';
import {characterPixels} from '../src/pixel-characters.js';
import {SKINS} from '../src/skins.js';
import {CHARACTERS} from '../src/game.js';
import {createRun} from '../src/engine.js';
import {newProfile,sanitizeProfile} from '../src/progression.js';
import {saveRun,loadRun} from '../src/run-save.js';
import {drawKurumiClockShot,drawKurumiClockEffect} from '../src/kurumi-shot-art.js';

const region=(p,x,y,w,h)=>Array.from({length:h},(_,dy)=>p.slice((y+dy)*56+x,(y+dy)*56+x+w)).flat();
const count=(p,...cs)=>p.filter(c=>cs.includes(c)).length;
const memory=()=>({data:new Map(),getItem(k){return this.data.get(k)},setItem(k,v){this.data.set(k,v)},removeItem(k){this.data.delete(k)}});

test('White Queen has silver hair, a crown, layered military coat and laced boots with distinct animated poses',()=>{
 const c=colors,art=kurumiPixels({skin:'whitequeen'});
 assert.equal(art.length,56*76);assert.ok(art.filter(Boolean).length>1400);assert.notDeepEqual(art,kurumiPixels({skin:'gothic'}));
 assert.ok(count(region(art,14,1,26,12),c.silver,c.lace)>30,'a separate silver crown sits above the fringe');
 assert.ok(count(region(art,8,10,40,32),c.hair,c.hairShade,c.hairLight)>230,'long silver hair frames the face');
 assert.ok(count(region(art,10,44,37,20),c.dress,c.dressShade,c.lace)>290,'white layered coat panels form a broad skirt');
 assert.ok(count(region(art,6,60,44,7),c.lining,'#535363')>30,'a charcoal petticoat shows below the bright hem');
 assert.ok(count(region(art,17,63,23,10),c.silver,c.lace,c.trim)>30,'tall boots have contrasting laces and silver toes');
 for(const m of [{blink:true},{expression:'hurt'},{moving:true,frame:1},{moving:true,frame:3},{attack:true}])assert.notDeepEqual(art,kurumiPixels({skin:'whitequeen',...m}));
 assert.deepEqual(characterPixels('kurumi',{skin:'whitequeen'}),art);
 assert.deepEqual(kurumiPixels({skin:'whitequeen',pose:'clock'}),kurumiPixels({skin:'whitequeen',attack:true,expression:'ultimate'}));
});

test('White Queen is an appearance choice that preserves stats, equipment and saved profile/run identity',()=>{
 assert.ok(SKINS.kurumi.some(s=>s.id==='whitequeen'&&s.name==='White Queen'));
 const profile=newProfile();profile.skins.kurumi='whitequeen';const clean=sanitizeProfile(profile);assert.equal(clean.skins.kurumi,'whitequeen');
 const hero=CHARACTERS.find(c=>c.id==='kurumi'),base=createRun(hero,0),queen=createRun(hero,0,clean),s=memory();
 for(const k of ['hp','maxHp','damage','move','area','cooldown','dodge','resistance'])assert.equal(queen.p[k],base.p[k],k);
 assert.deepEqual(queen.p.weapons,base.p.weapons);assert.deepEqual(queen.p.passives,base.p.passives);assert.ok(saveRun(queen,s));assert.equal(loadRun(s).p.skin,'whitequeen');
});

function context(){
 const calls=[],state={globalAlpha:1},c=new Proxy(state,{get:(o,k)=>k in o?o[k]:(...args)=>{for(const v of args)if(typeof v==='number')assert.ok(Number.isFinite(v),String(k));calls.push([k,...args]);},set:(o,k,v)=>{if(typeof v==='number')assert.ok(Number.isFinite(v),String(k));o[k]=v;calls.push(['set',k,v]);return true;}});
 return {c,calls};
}
test('new clock rounds, barrel dials and broken impact seals are pure, bounded and quiet-motion compatible',()=>{
 const signatures=new Set();
 for(const whiteQueen of [false,true])for(const fused of [false,true])for(const quiet of [false,true]){
  const {c,calls}=context(),shot={x:1,y:2,vx:400,vy:-80,age:.2,fused,whiteQueen},before=JSON.stringify(shot);
  drawKurumiClockShot(c,shot,quiet);assert.equal(JSON.stringify(shot),before);
  for(const type of ['clock-muzzle','clock-mark']){
   const e={type,x:12,y:20,r:19,angle:.3,fused,whiteQueen},previous=JSON.stringify(e);assert.equal(drawKurumiClockEffect(c,e,.3,quiet),true);assert.equal(JSON.stringify(e),previous);
  }
  assert.equal(calls.filter(a=>a[0]==='save').length,calls.filter(a=>a[0]==='restore').length);assert.ok(calls.length<800);signatures.add(JSON.stringify(calls));
 }
 assert.equal(signatures.size,8,'base, evolved, silver and quiet presentations remain distinct');
 assert.equal(drawKurumiClockEffect({}, {type:'nova'},0),false);
 for(const fused of [false,true]){
  const a=context(),b=context();drawKurumiClockShot(a.c,{vx:1,vy:0,age:.1,fused},true);drawKurumiClockShot(b.c,{vx:1,vy:0,age:2,fused},true);assert.deepEqual(a.calls,b.calls,'quiet rounds do not spin or shake as age advances');
 }
});
