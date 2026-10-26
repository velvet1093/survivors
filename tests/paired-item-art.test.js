import test from 'node:test';
import assert from 'node:assert/strict';
import {PAIRED_ITEM_ART_IDS,pairedItemPixels,pairedItemIcon} from '../src/paired-item-art.js';
import {icon} from '../src/icons.js';
const region=(p,x,y,w,h)=>Array.from({length:h},(_,yy)=>p.slice((y+yy)*32+x,(y+yy)*32+x+w)).flat();
test('five new items and their paired fusions have ten distinct outlined native equipment icons used in the live HUD',()=>{
 assert.equal(PAIRED_ITEM_ART_IDS.length,10);const seen=new Set();
 for(const id of PAIRED_ITEM_ART_IDS){const p=pairedItemPixels(id);assert.equal(p.length,1024);assert.ok(p.filter(Boolean).length>180,id+' complete silhouette');assert.ok(p.every(c=>c===null||/^#[0-9a-f]{6}$/i.test(c)));assert.ok(p.includes('#263344'));seen.add(JSON.stringify(p));assert.match(icon(id),new RegExp('data-pixel-icon="'+id+'"'));assert.match(pairedItemIcon(id),/<rect /);assert.ok(!icon(id).includes('http'));}
 assert.equal(seen.size,10);assert.equal(pairedItemPixels('unknown'),null);assert.equal(pairedItemIcon('unknown'),null);
});
test('fusion illustrations preserve recognizable ingredient motifs while adding their own silhouettes',()=>{
 const pairs=[['rasengan','raijinrasengan'],['dragonflame','dragonroar'],['wisteriapetals','wisteriagarden'],['griefseed','purifiedsoul'],['manacrystal','sagecodex']];
 for(const [base,fusion]of pairs)assert.notDeepEqual(pairedItemPixels(base),pairedItemPixels(fusion));
 const rasengan=pairedItemPixels('rasengan'),flash=pairedItemPixels('raijinrasengan');assert.ok(rasengan.filter(c=>c==='#a7e4df'||c==='#75bed0').length>100);assert.ok(region(flash,0,8,12,24).filter(c=>c==='#a2b6b6'||c==='#c2c8b6'||c==='#aeb6ac').length>20,'three-pronged kunai remains visible beside the orb');
 const flame=pairedItemPixels('dragonroar');assert.ok(flame.filter(c=>c==='#f4d88d'||c==='#d8d9a4').length>40,'lightning strands surround the dragon fire');
 const grief=pairedItemPixels('griefseed'),soul=pairedItemPixels('purifiedsoul');assert.ok(grief.includes('#2d3045')&&grief.includes('#e0dec9'));assert.ok(soul.includes('#e0a2b7')&&soul.includes('#d6dfcb'));
 const crystal=pairedItemPixels('manacrystal'),codex=pairedItemPixels('sagecodex');assert.ok(crystal.includes('#a7e0d9'));assert.ok(codex.includes('#a2e2da')&&codex.includes('#749882'));
});
