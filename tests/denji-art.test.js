import test from 'node:test';
import assert from 'node:assert/strict';
import {characterPixels} from '../src/pixel-characters.js';
import {DENJI_ART as c} from '../src/denji-art.js';
import {DENJI_ICON_IDS,denjiIconPixels,denjiIcon} from '../src/denji-icons.js';
import {drawDenjiSlash,drawDenjiUltimate} from '../src/denji-effects.js';
import {icon,SPECIAL_ICONS} from '../src/icons.js';
import {SKINS} from '../src/skins.js';
const region=(p,x,y,w,h)=>Array.from({length:h},(_,yy)=>p.slice((y+yy)*56+x,(y+yy)*56+x+w)).flat();
const count=(p,...colors)=>p.filter(v=>colors.includes(v)).length;

test('Denji has messy blond spikes, a rolled-sleeve shirt and loose tie, brown belt, red-trimmed high-tops and a chainsaw that appears when he attacks',()=>{
 const p=characterPixels('denji');assert.equal(p.length,56*76);assert.ok(p.filter(Boolean).length>900);assert.ok(count(region(p,13,1,29,27),c.hair,c.hairDark,c.hairLight)>200);assert.ok(count(region(p,18,35,20,20),c.shirt,c.shirtLight,c.shirtShade)>150);assert.ok(count(region(p,25,38,7,14),'#1d2128')>15,'black tie');assert.ok(count(region(p,18,49,20,4),'#6e4632')>20,'brown belt');assert.ok(count(region(p,18,64,22,8),'#f2f0ea')>=16&&count(region(p,18,64,22,8),'#b4423e')>10,'white high-tops with red trim');
 assert.ok(count(region(p,32,35,24,24),c.steel,c.steelLight,c.steelDark)<10,'hand in pocket, no saw at idle');assert.ok(count(region(characterPixels('denji',{attack:true}),38,35,18,18),c.steel,c.steelLight,c.steelDark)>20,'saw blade on attack');
 for(const color of p)assert.ok(color===null||/^#[a-f\d]{6}$/i.test(color));
});
test('Chainsaw Man replaces the face with an orange saw motor, toothed jaw and two real arm saws',()=>{
 const p=characterPixels('denji',{form:1});assert.notDeepEqual(p,characterPixels('denji'));assert.equal(p.length,56*76);assert.equal(count(region(p,14,8,28,25),c.skin,c.skinLight,c.skinShade),0);assert.ok(count(region(p,15,11,25,18),c.orange,c.orangeDark,c.orangeLight)>140);assert.ok(count(region(p,34,12,22,13),c.steel,c.steelDark,c.steelLight)>75);assert.ok(count(region(p,5,32,15,30),c.steel,c.steelDark,c.steelLight)>50);assert.ok(count(region(p,37,32,15,30),c.steel,c.steelDark,c.steelLight)>50);assert.deepEqual(p,characterPixels('denji',{pose:'chainsaw'}));
});

test('Denji has five individually cut outfits with moving clothes, hands and expressions, while hybrid armor stays recognizable',()=>{
 const outfits=['default','devilhunter','casual','pajamas','swimsuit'],designs=[];assert.ok(outfits.every(id=>SKINS.denji.some(s=>s.id===id)));
 for(const skin of outfits){const idle=characterPixels('denji',{skin});assert.ok(idle.filter(Boolean).length>800);designs.push(JSON.stringify(idle));const frames=Array.from({length:4},(_,frame)=>characterPixels('denji',{skin,frame,moving:true}));assert.ok(new Set(frames.map(p=>JSON.stringify(p))).size>=3);for(const extra of [{attack:true},{blink:true},{expression:'hurt'},{expression:'focused'},{pose:'ultimate'}])assert.notDeepEqual(characterPixels('denji',{skin,...extra}),idle,skin+' '+JSON.stringify(extra));assert.deepEqual(characterPixels('denji',{skin,form:1}),characterPixels('denji',{form:1}));}
 assert.equal(new Set(designs).size,5);
});

test('Denji weapon, engine, evolution and ultimate have four distinct native icons used by the actual HUD',()=>{
 const designs=[];assert.equal(SPECIAL_ICONS.denji,'chainsawman');for(const id of DENJI_ICON_IDS){const p=denjiIconPixels(id);assert.equal(p.length,1024);assert.ok(p.filter(Boolean).length>150);assert.match(denjiIcon(id),/<rect/);assert.match(icon(id),new RegExp('data-pixel-icon="'+id+'"'));designs.push(JSON.stringify(p));}assert.equal(new Set(designs).size,4);assert.equal(denjiIcon('unknown'),null);
});

test('chainsaw sweeps and engine transformation use bounded finite geometry and calm reduced-motion shapes',()=>{
 let depth=0;const operations=[];const context=new Proxy({globalAlpha:1,save(){depth++;},restore(){depth--;assert.ok(depth>=0);}},{get(t,k){return k in t?t[k]:(...args)=>{assert.ok(args.filter(a=>typeof a==='number').every(Number.isFinite));operations.push([k,...args]);};},set(t,k,v){if(typeof v==='number')assert.ok(Number.isFinite(v));t[k]=v;return true;}});
 for(const reduced of [false,true])for(const progress of [0,.25,.6,1]){const effect={type:'denji-slash',x:4,y:8,r:150,angle:1,side:-1,fused:true,empowered:true,full:true};const before=JSON.stringify(effect);assert.ok(drawDenjiSlash(context,effect,progress,reduced));assert.equal(JSON.stringify(effect),before);assert.ok(drawDenjiUltimate(context,{p:{x:4,y:8,area:1},ultimate:{type:'denji',age:progress*7,duration:8}},reduced));}
 assert.equal(depth,0);assert.ok(operations.length>200);assert.equal(drawDenjiSlash(context,{type:'other'},.5),false);assert.equal(drawDenjiUltimate(context,{p:{},ultimate:null}),false);
 const quiet=operations.filter(op=>op[0]==='arc');assert.ok(quiet.some(([,x,y,r,a,b])=>a===0&&b===Math.PI*2),'full sweeps visibly include targets behind Denji');
});
