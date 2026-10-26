import test from 'node:test';
import assert from 'node:assert/strict';
import {drawEnemy} from '../src/sprites.js';

test('a cached crushing-step pose cannot replace the planted mouth-beam pose',()=>{
 const previous=globalThis.document,frames=[];
 globalThis.document={createElement(){const canvas={pixels:[],getContext(){return {set fillStyle(value){this.color=value;},fillRect(x,y,w,h){canvas.pixels.push([x,y,w,h,this.color]);}};}};return canvas;}};
 const context={save(){},restore(){},beginPath(){},ellipse(){},fill(){},translate(){},rotate(){},scale(){},drawImage(frame){frames.push(frame);}};
 const e={archetype:'motherbrain',enraged:true,hp:100,maxHp:100,r:50,x:0,y:0,phase:0,animTime:.4,moving:false,attackAnim:.3,windup:1,facing:1};
 try{
  drawEnemy(context,{...e,motherBrainAttack:{style:'stomp',age:.2}},0,false,true);
  drawEnemy(context,{...e,motherBrainAttack:{style:'beam',age:.2}},0,false,true);
  drawEnemy(context,{...e,motherBrainAttack:{style:'beam',age:1.2}},0,false,true);
  drawEnemy(context,{...e,motherBrainAttack:{style:'stomp',age:.65}},0,false,true);
  assert.notEqual(frames[0],frames[1]);assert.notDeepEqual(frames[0].pixels,frames[1].pixels);
  assert.equal(frames[1],frames[2],'a sustained beam keeps both feet braced');
  assert.notDeepEqual(frames[0].pixels,frames[3].pixels,'crushing steps still transfer weight');
 }finally{if(previous===undefined)delete globalThis.document;else globalThis.document=previous;}
});
