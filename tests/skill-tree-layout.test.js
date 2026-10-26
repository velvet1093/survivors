import test from 'node:test';import assert from 'node:assert/strict';
import {layoutSkillTree,treeParents} from '../src/skill-tree-layout.js';
import {GENERAL_TREE,CHARACTER_TREES} from '../src/progression.js';
test('skill layout places forked and joined prerequisites on lower nonoverlapping layers',()=>{
 const tree=[{id:'root'},{id:'left',parent:'root'},{id:'right',parent:'root'},{id:'join',parent:'left',parents:['left','right']},{id:'end',parent:'join'}],a=layoutSkillTree(tree),b=layoutSkillTree(tree);assert.deepEqual(a,b);assert.equal(a.nodes.length,5);assert.equal(a.edges.length,5);assert.deepEqual(treeParents(tree[3]),['left','right']);
 const nodes=new Map(a.nodes.map(n=>[n.id,n]));for(const edge of a.edges){assert.ok(nodes.get(edge.to).y>nodes.get(edge.from).y);assert.ok(edge.path.startsWith('M'));}for(const n of a.nodes){assert.ok(n.x>50&&n.x<a.width-50);assert.ok(n.y>=50&&n.y<a.height-50);}for(const x of a.nodes)for(const y of a.nodes)if(x!==y&&x.depth===y.depth)assert.ok(Math.abs(x.x-y.x)>112);
});
test('invalid prerequisite graphs fail explicitly instead of hanging or hiding nodes',()=>{assert.throws(()=>layoutSkillTree([{id:'a',parent:'b'}]),/Unknown prerequisite/);assert.throws(()=>layoutSkillTree([{id:'a',parent:'b'},{id:'b',parent:'a'}]),/cycle/);assert.throws(()=>layoutSkillTree([{id:'a'},{id:'a'}]),/Duplicate/);});
test('canonical branching coordinates preserve every skill and prerequisite for all screen sizes',()=>{
 for(const tree of [GENERAL_TREE,...Object.values(CHARACTER_TREES)]){
  const layout=layoutSkillTree(tree),nodes=new Map(layout.nodes.map(n=>[n.id,n]));
  assert.deepEqual(layout,layoutSkillTree(tree));assert.equal(nodes.size,tree.length);assert.ok(layout.width>=680);
  for(const n of nodes.values()){assert.ok(n.x>=57&&n.x<=layout.width-57,'node labels stay within the canvas');assert.ok(n.y>=37&&n.y+90<=layout.height,'root icons and final labels stay unclipped');}
  for(const edge of layout.edges){assert.ok(nodes.get(edge.to).y>nodes.get(edge.from).y,'all prerequisites stay above their children');assert.ok(edge.path.includes('L'),'forks and joins use the reference diagonal connectors');}
  const roots=layout.nodes.filter(n=>!treeParents(n).length);assert.equal(new Set(roots.map(n=>n.y)).size,1,'root branches share the same upper layer');
 }
});
