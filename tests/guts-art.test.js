import test from 'node:test';
import assert from 'node:assert/strict';
import {characterPixels} from '../src/pixel-characters.js';
import {GUTS_ART as c,BERSERKER_SKIN_ART as B} from '../src/guts-art.js';
import {GUTS_ICON_IDS,gutsIconPixels,gutsIcon} from '../src/guts-icons.js';
import {drawGutsSlash,drawGutsUltimate} from '../src/guts-effects.js';

const region=(p,x,y,w,h)=>Array.from({length:h},(_,dy)=>p.slice((y+dy)*56+x,(y+dy)*56+x+w)).flat();
const count=(p,...colors)=>p.filter(v=>colors.includes(v)).length;
test('Guts carries a slab sword, ragged cape, plate armor and a distinct iron forearm',()=>{
 const p=characterPixels('guts');assert.equal(p.length,56*76);assert.ok(p.filter(Boolean).length>1600);
 assert.ok(count(region(p,36,1,19,36),c.steel,c.steelShade,c.steelLight)>120,'a large steel slab rises beside his head');
 assert.ok(count(region(p,7,36,14,28),c.cape,c.capeShade,c.capeLight)>130,'ragged cape hangs separately behind his left arm');
 assert.ok(count(region(p,10,44,9,13),c.steel,c.steelShade,c.steelLight)>30,'the left arm has segmented iron prosthetic plates');
 assert.ok(count(region(p,17,6,23,20),c.hair,c.hairShade,c.hairLight)>170,'short black spikes shape his uncovered head');
 assert.ok(count(region(p,19,36,18,17),c.plate,c.plateShade,c.plateLight)>100);
});
test('the Berserker Armor has a wolf helmet and glowing visor; Golden Age changes armor, cape and scar',()=>{
 const base=characterPixels('guts'),armor=characterPixels('guts',{form:1}),skin=characterPixels('guts',{skin:'goldenage'});
 for(const p of [armor,skin]){assert.equal(p.length,56*76);assert.notDeepEqual(p,base);}
 assert.ok(count(region(armor,18,9,25,27),c.skin,c.skinLight)===0,'a fully enclosed wolf helmet replaces the face');
 assert.ok(count(region(armor,21,20,15,6),B.red,B.eye)>=8,'a single red visor cut remains visible in dark armor');
 assert.ok(count(skin,'#777d85','#bcc1bd')>100,'Band of the Hawk uses brighter silver armor');
 assert.ok(count(skin,'#636c80')>40,'Band of the Hawk cape has its own blue shade');
 assert.deepEqual(armor,characterPixels('guts',{pose:'berserk'}));
});
test('Guts walking, cleaving and expressions animate while the giant sword remains part of his body',()=>{
 const idle=characterPixels('guts');
 assert.notDeepEqual(idle,characterPixels('guts',{moving:true,frame:1}));
 assert.notDeepEqual(characterPixels('guts',{moving:true,frame:1}),characterPixels('guts',{moving:true,frame:3}));
 assert.notDeepEqual(idle,characterPixels('guts',{attack:true}));assert.notDeepEqual(idle,characterPixels('guts',{expression:'hurt'}));
 assert.ok(count(characterPixels('guts',{attack:true}),c.steel,c.steelShade,c.steelLight)>150);
});
test('Guts equipment and ultimate use four distinct native icons',()=>{
 const icons=GUTS_ICON_IDS.map(id=>{const p=gutsIconPixels(id);assert.equal(p.length,1024);assert.ok(p.filter(Boolean).length>150);assert.ok(gutsIcon(id).includes('<rect'));assert.ok(!gutsIcon(id).includes('http'));return JSON.stringify(p);});
 assert.equal(new Set(icons).size,4);assert.equal(gutsIcon('other'),null);
});
test('Guts everyday clothes retain his face and sword while Berserker Armor replaces every outfit',()=>{
 const armor=characterPixels('guts',{form:1});
 for(const skin of ['casual','pajamas','swimsuit']){
  const idle=characterPixels('guts',{skin});assert.notDeepEqual(idle,characterPixels('guts'));
  for(const expression of ['focused','hurt'])assert.notDeepEqual(idle,characterPixels('guts',{skin,expression}));
  assert.notDeepEqual(idle,characterPixels('guts',{skin,pose:'ultimate'}));
  assert.deepEqual(characterPixels('guts',{skin,form:1}),armor,'the wolf helmet and black armor fully replace '+skin);
 }
});
test('heavy sword and Berserker effects use finite geometry and balanced canvas state in quiet motion',()=>{
 let depth=0,ops=0;const context=new Proxy({globalAlpha:1,save(){depth++;},restore(){depth--;assert.ok(depth>=0);}},{get(target,key){return key in target?target[key]:(...v)=>{ops++;assert.ok(v.filter(a=>typeof a==='number').every(Number.isFinite));};},set(target,key,value){target[key]=value;return true;}});
 for(const reduced of [false,true])for(const progress of [0,.25,.6,1]){
  assert.equal(drawGutsSlash(context,{type:'guts-slash',x:12,y:5,r:96,angle:1,side:-1,empowered:true},progress,reduced),true);
  assert.equal(drawGutsUltimate(context,{p:{x:12,y:5},ultimate:{type:'guts',age:progress*6,duration:8,r:100}},reduced),true);
 }
 assert.equal(depth,0);assert.ok(ops>100);assert.equal(drawGutsSlash(context,{type:'nova'},.4),false);assert.equal(drawGutsUltimate(context,{p:{},ultimate:null}),false);
});
test('Guts slash artwork covers the full cone and shows a complete quiet finisher footprint',()=>{
 const arcs=[],rotations=[],context=new Proxy({globalAlpha:1,arc(...v){arcs.push(v);},rotate(angle){rotations.push(angle);}},{get(target,key){return key in target?target[key]:()=>{};},set(target,key,value){target[key]=value;return true;}});
 for(const [fused,halfSpan]of [[false,1.8],[true,2.05]]){
  rotations.length=0;drawGutsSlash(context,{type:'guts-slash',x:0,y:0,r:100,fused},0,false);assert.ok(Math.abs(rotations.at(-1)+halfSpan)<1e-8);
  rotations.length=0;drawGutsSlash(context,{type:'guts-slash',x:0,y:0,r:100,fused},1,false);assert.ok(Math.abs(rotations.at(-1)-halfSpan)<1e-8);
 }
 arcs.length=0;drawGutsSlash(context,{type:'guts-slash',x:0,y:0,r:100,full:true,ultimate:true},.4,true);
 assert.ok(arcs.some(([, ,r,start,end])=>r===96&&start===0&&end===Math.PI*2),'the static finisher rim includes targets behind Guts');
});
