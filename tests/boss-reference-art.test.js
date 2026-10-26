import test from 'node:test';
import assert from 'node:assert/strict';
import {enemyPixels} from '../src/pixel-enemies.js';
import {enemyMotion} from '../src/enemy-animation.js';
import {AURA_ART,BERTHOLDT_ART} from '../src/boss-reference-pixels.js';
const region=(p,x,y,w,h)=>Array.from({length:h},(_,dy)=>p.slice((y+dy)*56+x,(y+dy)*56+x+w)).flat();
const count=(p,color)=>p.filter(c=>c===color).length;

test('Aura reference art keeps ivory curved horns, a braided pink bob, navy and magenta outfit and a held gold balance',()=>{
 const art=enemyPixels('aura'),c=AURA_ART;
 assert.equal(art.length,56*76);assert.ok(art.filter(Boolean).length>1500);
 assert.ok(count(region(art,9,0,34,18),c.ivory)>25,'light horns stay visible above the hair');
 assert.ok(count(region(art,10,10,29,23),c.hair)>180,'rounded pink bob frames the face');
 assert.ok(count(region(art,14,32,24,13),c.hair)+count(region(art,14,32,24,13),c.hairShade)>35,'braids extend to the collar');
 assert.ok(count(region(art,5,44,41,26),c.cape)>130,'open magenta overskirt reaches beside the boots');
 assert.ok(count(region(art,37,30,19,24),c.gold)>40,'the scale has a separate gold post and pans');
 const motion=enemyMotion({archetype:'aura',moving:true},.3);
 assert.notDeepEqual(art,enemyPixels('aura',motion));assert.notDeepEqual(art,enemyPixels('aura',{attack:1,enraged:1}));
});

test('Bertholdt has a cadet uniform in human form and an independently drawn skinless Colossal form with moving limbs',()=>{
 const c=BERTHOLDT_ART,human=enemyPixels('bertholdt'),titan=enemyPixels('bertholdt',{enraged:1});
 for(const art of [human,titan]){assert.equal(art.length,56*76);assert.ok(art.filter(Boolean).length>1200);}
 assert.notDeepEqual(human,titan);assert.ok(count(region(human,15,6,24,19),c.hair)>100,'human form has short black hair');
 assert.ok(count(region(human,15,32,25,18),c.jacket)>80,'cadet jacket is tan');
 assert.ok(count(region(human,18,49,20,15),c.shirt)>30,'white trousers show below the harness');
 assert.ok(count(region(titan,12,29,32,25),c.muscle)>150,'Colossal chest and abdomen are exposed red muscle');
 assert.ok(count(region(titan,14,39,28,15),c.bone)>35,'pale ribs cross the red torso');
 assert.ok(count(region(titan,20,18,17,6),c.bone)>8,'Colossal teeth are exposed');
 assert.ok(count(region(titan,0,13,56,20),c.steam)>8,'steam vents at both shoulders');
 assert.equal(count(titan,c.hair),0,'Colossal form is bald');
 for(const enraged of [false,true]){const rest=enemyPixels('bertholdt',{enraged});assert.notDeepEqual(rest,enemyPixels('bertholdt',{enraged,leg:4,arm:3}));assert.notDeepEqual(rest,enemyPixels('bertholdt',{enraged,attack:1}));}
});
