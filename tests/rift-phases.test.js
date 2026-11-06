import test from 'node:test';
import assert from 'node:assert/strict';
import {updateRiftPhases,riftShielded,flawlessBonus,markRiftHurt,riftPhase,FINAL_SHRINK,FLAWLESS_BONUS} from '../src/rift-phases.js';

const setup=(hp,enraged=true)=>{const boss={id:7,hp,maxHp:100,enraged,riftBoss:true,attackCD:3,x:0,y:0,color:'#f00'};
 return {boss,g:{rifts:{active:{bossEntityId:7}},riftArena:{radius:760,bossId:'beerus'},enemies:[boss],effects:[]}};};

test('final stand needs the trial first and triggers at a quarter health',()=>{
 let {g,boss}=setup(20,false);updateRiftPhases(g,.1);assert.equal(boss.riftFinal,undefined);assert.equal(riftPhase(boss),1);
 ({g,boss}=setup(30));updateRiftPhases(g,.1);assert.equal(boss.riftFinal,undefined);assert.equal(g.riftArena.phase,2);
 ({g,boss}=setup(25));updateRiftPhases(g,.1);assert.equal(boss.riftFinal,true);assert.equal(g.riftArena.phase,3);
 assert.ok(boss.attackCD<=1.2);assert.match(g.toast,/FINAL STAND/);assert.ok(g.effects.some(e=>e.type==='rift-final'));
});

test('the shield fades and the arena closes in but stops at its floor',()=>{
 const {g,boss}=setup(10);updateRiftPhases(g,.01);assert.ok(riftShielded(boss));
 for(let i=0;i<200;i++)updateRiftPhases(g,.1);
 assert.equal(riftShielded(boss),false);assert.equal(g.riftArena.radius,760*FINAL_SHRINK);
});

test('flawless pays only for a whole fight without being hit',()=>{
 const active={};assert.equal(flawlessBonus(active,{riftFinal:false}),0);
 assert.equal(flawlessBonus(active,{riftFinal:true}),FLAWLESS_BONUS);
 const g={rifts:{active}};markRiftHurt(g);assert.equal(flawlessBonus(active,{riftFinal:true}),0);
});
