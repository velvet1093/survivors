import test from 'node:test';
import assert from 'node:assert/strict';
import {GENERAL_TREE,CHARACTER_TREES,nodeParents,newProfile,sanitizeProfile,nodeState,buyNode,progressionBonuses,saveProfile,loadProfile} from '../src/progression.js';
import {CHARACTERS} from '../src/game.js';
import {createRun} from '../src/engine.js';
import {SKILL_ART,skillIcon} from '../src/skill-icons.js';

const trees={general:GENERAL_TREE,...CHARACTER_TREES};
test('expanded trees form complete branching DAGs with reachable joins and retained original paths',()=>{
 assert.equal(GENERAL_TREE.length,24);assert.equal(Object.keys(CHARACTER_TREES).length,CHARACTERS.length);
 for(const [id,tree]of Object.entries(trees)){
  assert.equal(new Set(tree.map(n=>n.id)).size,tree.length,id);if(id!=='general')assert.equal(tree.length,12,id);
  const visited=new Set(),visiting=new Set(),visit=node=>{assert.ok(!visiting.has(node.id),id+' has no cycles');if(visited.has(node.id))return;visiting.add(node.id);for(const parent of nodeParents(node)){const p=tree.find(n=>n.id===parent);assert.ok(p,id+' parent '+parent+' exists');visit(p);}visiting.delete(node.id);visited.add(node.id);};
  tree.forEach(visit);assert.equal(visited.size,tree.length);assert.ok(tree.some(n=>nodeParents(n).length>1),id+' has a joining branch');assert.ok(tree.every(n=>n.max>=1&&n.cost>0&&Object.keys(n.effect).length));
 }
 for(const id of ['vigor','power','fortune','stride','reroll','study','magnet','vanish','focus'])assert.ok(GENERAL_TREE.some(n=>n.id===id));
 assert.equal(CHARACTER_TREES.goku.find(n=>n.id==='ascend').parent,'focus');assert.equal(CHARACTER_TREES.yuki.find(n=>n.id==='singularity').parent,'mass');
});
test('joining skills require every prerequisite and spend the correct persistent currency once',()=>{
 const p=newProfile();p.coins=5000;p.characters.featherine.xp=5000;
 for(const [scope,id,hero]of [['general','convergence',undefined],['character','theater','featherine']]){
  const ranks=scope==='general'?p.general:p.characters[hero].skills,n=nodeState(p,scope,id,hero),parents=n.parentIds;
  for(const parent of parents.slice(0,-1))ranks[parent]=1;
  assert.equal(nodeState(p,scope,id,hero).canBuy,false);assert.deepEqual(nodeState(p,scope,id,hero).missingParents,[parents.at(-1)]);assert.equal(buyNode(p,scope,id,hero),false);
  ranks[parents.at(-1)]=1;const coins=p.coins,xp=p.characters.featherine.xp,cost=n.cost;assert.ok(buyNode(p,scope,id,hero));assert.equal(ranks[id],1);assert.equal(p.coins,coins-(scope==='general'?cost:0));assert.equal(p.characters.featherine.xp,xp-(scope==='character'?cost:0));
 }
 assert.equal(buyNode(p,'character','theater','featherine'),false,'one-rank capstone cannot be bought again');
});
test('legacy profiles keep purchases and wallets while new branches and Featherine start untrained',()=>{
 const p=sanitizeProfile({version:1,coins:411,selection:{character:'goku',map:'garden',mode:'survival'},general:{vigor:2,reroll:1},characters:{goku:{xp:73,totalXp:127,skills:{ki:2,ascend:1}},yuki:{xp:9,totalXp:23,skills:{density:1}}},skins:{samus:'fusion'}});
 assert.equal(p.coins,411);assert.equal(p.general.vigor,2);assert.equal(p.general.recovery,0);assert.equal(p.characters.goku.xp,73);assert.equal(p.characters.goku.totalXp,127);assert.equal(p.characters.goku.skills.ascend,1);assert.equal(p.characters.goku.skills.guard,0);assert.equal(p.characters.yuki.skills.density,1);assert.deepEqual(p.characters.featherine,{xp:0,totalXp:0,skills:{}});assert.equal(p.skins.samus,'fusion');assert.equal(p.selection.difficulty,'normal');
 p.characters.featherine.skills.quill=1;p.characters.featherine.xp=22;const storage={data:'',setItem(k,v){this.data=v;},getItem(){return this.data;}};assert.ok(saveProfile(p,storage));const loaded=loadProfile(storage);assert.equal(loaded.characters.featherine.skills.quill,1);assert.equal(loaded.characters.featherine.xp,22);assert.equal(loaded.characters.goku.skills.ki,2);
});
test('new general and mastery branches produce live run stats without boosting another hero’s mastery',()=>{
 const p=newProfile();p.general.recovery=2;p.general.reserves=2;p.characters.goku.skills.guard=2;p.characters.goku.skills.footwork=1;
 const goku=CHARACTERS.find(c=>c.id==='goku'),gojo=CHARACTERS.find(c=>c.id==='gojo'),g=createRun(goku,0,p),other=createRun(gojo,0,p),base=createRun(goku);
 assert.equal(g.p.maxHp,base.p.maxHp+20);assert.ok(Math.abs(g.p.regen-base.p.regen-.3)<1e-9);assert.equal(g.p.maxShield,8);assert.ok(Math.abs(g.p.move/base.p.move-1.03)<1e-9);assert.equal(other.p.maxHp,gojo.hp);assert.equal(other.p.maxShield,8);assert.equal(progressionBonuses(p,'gojo').move,0);
 p.characters.featherine.skills.memory=2;assert.equal(progressionBonuses(p,'featherine').authorityGain,.2);assert.equal(progressionBonuses(p,'goku').authorityGain,undefined);
});
test('difficulty selection is saved and sanitized independently of tree purchases',()=>{
 for(const difficulty of ['easy','normal','hard','nightmare'])assert.equal(sanitizeProfile({selection:{difficulty}}).selection.difficulty,difficulty);
 assert.equal(sanitizeProfile({selection:{difficulty:'impossible'}}).selection.difficulty,'normal');
});
test('every expanded node has a colored illustration identified by its own tree and node',()=>{
 const arts=[];for(const [id,tree]of Object.entries(trees))for(const node of tree){assert.ok(SKILL_ART[id][node.id]);const art=skillIcon(id==='general'?'general':'character',node,id);assert.ok(art.includes('data-skill-art="'+id+':'+node.id+'"'));assert.ok(art.includes('<path'));assert.ok(art.includes('fill="#'));arts.push(art);}
 assert.equal(arts.length,GENERAL_TREE.length+CHARACTERS.length*12);assert.equal(new Set(arts).size,arts.length);
});
