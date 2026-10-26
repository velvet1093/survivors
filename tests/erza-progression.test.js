import test from 'node:test';
import assert from 'node:assert/strict';
import {CHARACTER_TREES,newProfile,nodeState,buyNode,progressionBonuses,saveProfile,loadProfile,prestigeState} from '../src/progression.js';
import {icon,SPECIAL_ICONS} from '../src/icons.js';
import {skillIcon} from '../src/skill-icons.js';
import {layoutSkillTree} from '../src/skill-tree-layout.js';

test('Erza has two complete mastery paths with linked late specialties and an eligible prestige finish',()=>{
 const tree=CHARACTER_TREES.erza,layout=layoutSkillTree(tree),p=newProfile();
 assert.equal(tree.length,12);assert.equal(layout.nodes.length,12);assert.equal(tree.filter(n=>!n.parent).length,2);
 assert.equal(nodeState(p,'character','titania','erza').locked,true);
 p.characters.erza.xp=10000;
 for(const id of ['blade','tempo','titania'])assert.equal(buyNode(p,'character',id,'erza'),true);
 assert.equal(nodeState(p,'character','heart','erza').locked,true,'joined specialty still requires its added branch');
 for(const n of tree)p.characters.erza.skills[n.id]=n.max;
 assert.equal(prestigeState(p,'erza').canPrestige,true);
});

test('Erza purchases save with the selected hardcore mode and remain scoped to her Requip and Nakagami bonuses',()=>{
 const p=newProfile();p.selection.character='erza';p.selection.mode='hardcore';p.characters.erza.xp=1000;
 assert.ok(buyNode(p,'character','blade','erza'));assert.ok(buyNode(p,'character','vitality','erza'));assert.ok(buyNode(p,'character','requip','erza'));
 let json;assert.ok(saveProfile(p,{setItem(key,value){json=value;}}));
 const restored=loadProfile({getItem(){return json;}}),bonus=progressionBonuses(restored,'erza');
 assert.equal(restored.selection.mode,'hardcore');assert.equal(restored.selection.character,'erza');
 assert.equal(restored.characters.erza.xp,925);assert.equal(bonus.signatureDamage,.15);assert.equal(bonus.hp,10);assert.equal(bonus.requipCooldown,.1);
 const other=progressionBonuses(restored,'goku');assert.equal(other.signatureDamage,0);assert.equal(other.requipCooldown,undefined);
});

test('Erza equipment and ultimate have distinct filled pixel icons and every mastery node has its own colored illustration',()=>{
 const ids=['requip','heartkreuz','heavensarsenal','nakagami'],art=ids.map(id=>icon(id));
 assert.equal(SPECIAL_ICONS.erza,'nakagami');assert.equal(new Set(art).size,ids.length);
 for(const [index,markup]of art.entries()){assert.ok(markup.includes(`data-pixel-icon="${ids[index]}"`));assert.ok(markup.includes('shape-rendering="crispEdges"'));assert.ok((markup.match(/<rect /g)||[]).length>100);assert.ok(markup.includes('fill="#'));}
 const skills=CHARACTER_TREES.erza.map(n=>skillIcon('character',n,'erza'));
 assert.equal(new Set(skills).size,12);for(const markup of skills){assert.ok(markup.includes('data-skill-art="erza:'));assert.ok(markup.includes('fill="#'));}
});
