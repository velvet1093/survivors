import test from 'node:test';
import assert from 'node:assert/strict';
import {bindSkillTreeGestures} from '../src/skill-tree-gestures.js';

test('dragging from a skill continues after child capture transfers, coasts, and suppresses accidental training',()=>{
 const previous={window:globalThis.window,requestAnimationFrame:globalThis.requestAnimationFrame,cancelAnimationFrame:globalThis.cancelAnimationFrame},frames=new Map(),listeners=new Map(),captured=new Set(),classes=new Set();let serial=0,cleanup;
 const viewport={isConnected:true,scrollLeft:0,scrollTop:0,clientLeft:0,clientTop:0,clientWidth:300,classList:{add:c=>classes.add(c),remove:c=>classes.delete(c)},getBoundingClientRect:()=>({left:0,top:0}),setPointerCapture:id=>captured.add(id),releasePointerCapture:id=>captured.delete(id),hasPointerCapture:id=>captured.has(id),addEventListener:(type,handler)=>listeners.set(type,handler),removeEventListener:type=>listeners.delete(type)};
 const fire=(type,extra={})=>{const event={type,target:viewport,button:0,pointerId:1,pointerType:'touch',clientX:80,clientY:180,detail:1,preventDefault(){this.prevented=true;},stopImmediatePropagation(){this.stopped=true;},...extra};listeners.get(type)?.(event);return event;};
 try{
  globalThis.window={matchMedia:()=>({matches:false})};globalThis.requestAnimationFrame=callback=>{frames.set(++serial,callback);return serial;};globalThis.cancelAnimationFrame=id=>frames.delete(id);
  cleanup=bindSkillTreeGestures(viewport,{getZoom:()=>1,onZoom:()=>{}});
  fire('pointerdown');fire('pointermove',{clientY:160});assert.equal(viewport.scrollTop,20);
  fire('lostpointercapture',{target:{tagName:'BUTTON'}});fire('pointermove',{clientY:140});assert.equal(viewport.scrollTop,40,'capture loss from the child does not abort the viewport pan');
  fire('pointerup',{clientY:140});assert.ok(classes.has('coasting'));
  const frame=frames.values().next().value;frames.clear();frame(performance.now()+16);assert.ok(viewport.scrollTop>40,'finger release retains the scrolling momentum');
  const click=fire('click');assert.ok(click.prevented&&click.stopped,'the drag cannot buy or select a node on release');
  fire('pointerdown',{pointerId:2});fire('pointerup',{pointerId:2});assert.ok(fire('click').prevented,'a tap that stops momentum does not select a passing node');
  fire('pointerdown',{pointerId:3});fire('pointerup',{pointerId:3});assert.ok(!fire('click').prevented,'a later ordinary tap remains usable');
  cleanup();assert.equal(frames.size,0);assert.equal(listeners.size,0);
 }finally{cleanup?.();for(const [key,value]of Object.entries(previous))value===undefined?delete globalThis[key]:globalThis[key]=value;}
});
