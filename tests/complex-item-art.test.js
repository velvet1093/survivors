import test from 'node:test';
import assert from 'node:assert/strict';
import {COMPLEX_ITEM_ART_IDS,complexItemPixels,complexItemIcon} from '../src/complex-item-art.js';
import {icon} from '../src/icons.js';
const occupancy=p=>p.map(c=>c?'1':'0').join('');
test('nine new ingredients and three composite relics have complete native illustrated inventory icons',()=>{
 assert.equal(COMPLEX_ITEM_ART_IDS.length,12);const drawings=new Set(),silhouettes=new Set();
 for(const id of COMPLEX_ITEM_ART_IDS){const p=complexItemPixels(id);assert.equal(p.length,1024);assert.ok(p.filter(Boolean).length>190,id+' complete native silhouette');assert.ok(p.every(c=>c===null||/^#[0-9a-f]{6}$/i.test(c)));assert.ok(p.includes('#283546'));drawings.add(JSON.stringify(p));silhouettes.add(occupancy(p));assert.match(icon(id),new RegExp('data-pixel-icon="'+id+'"'));assert.match(icon(id),/shape-rendering="crispEdges"/);assert.match(complexItemIcon(id),/<rect /);assert.ok(!icon(id).includes('http'));assert.strictEqual(complexItemPixels(id),p,id+' cache is stable');}
 assert.equal(drawings.size,12);assert.ok(silhouettes.size>=10,'most ingredients differ in outline as well as palette');assert.equal(complexItemPixels('unknown'),null);assert.equal(complexItemIcon('unknown'),null);
});
test('composite icons preserve multiple recipe motifs while using distinct finished silhouettes',()=>{
 const sage=complexItemPixels('sageregalia'),chozo=complexItemPixels('chozosuit'),archive=complexItemPixels('witcharchive');
 for(const [id,result]of [['sagecloak',sage],['toadoil',sage],['sagebeads',sage],['variasuit',chozo],['gravitysuit',chozo],['morphball',chozo],['goldenbutterfly',archive],['truthseal',archive],['witchring',archive]])assert.notDeepEqual(complexItemPixels(id),result,id+' remains distinct from its finished composite');
 for(const c of ['#bf7868','#7e97a5','#c2a16e','#c7d3bd'])assert.ok(sage.includes(c),'Sage equipment motifs: '+c);
 for(const c of ['#d5a16d','#987b9d','#93c3b3','#b4d9af'])assert.ok(chozo.includes(c),'Chozo module motifs: '+c);
 for(const c of ['#81698d','#d3b780','#d392a0','#ad9570'])assert.ok(archive.includes(c),'Witch archive motifs: '+c);
});
test('SVG pixels stay within the native 34-unit frame and drawings are deterministic',()=>{
 for(const id of COMPLEX_ITEM_ART_IDS){const source=complexItemIcon(id),again=complexItemIcon(id);assert.equal(source,again);const rects=[...source.matchAll(/<rect x="(\d+)" y="(\d+)" width="1" height="1" fill="(#[a-f0-9]{6})"\/>/g)];assert.equal(rects.length,complexItemPixels(id).filter(Boolean).length);for(const[,x,y]of rects){assert.ok(+x>=1&&+x<=32);assert.ok(+y>=1&&+y<=32);}}
});
