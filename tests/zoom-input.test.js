import test from 'node:test';
import assert from 'node:assert/strict';
import {BattleInput} from '../src/input.js';
function controls(fn){
 const previous={window:globalThis.window,document:globalThis.document},canvas=new EventTarget(),win=new EventTarget(),doc=new EventTarget();canvas.setPointerCapture=()=>{};doc.getElementById=()=>null;doc.querySelector=()=>null;
 globalThis.window=win;globalThis.document=doc;const run={status:'playing',targetZoom:.9};
 // Zoom must work with no zoom buttons or HUD-update callback in the document.
 const input=new BattleInput(canvas,run,()=>{},()=>{},undefined);
 const fire=(target,name,data)=>{const e=new Event(name,{cancelable:true});Object.assign(e,data);target.dispatchEvent(e);};
 try{fn({canvas,win,run,input,fire});}finally{input.dispose();globalThis.window=previous.window;globalThis.document=previous.document;}
}
test('wheel and keyboard still change and clamp camera zoom without on-screen controls',()=>controls(({canvas,win,run,fire})=>{
 fire(canvas,'wheel',{deltaY:-160});assert.ok(run.targetZoom>.9);const before=run.targetZoom;
 fire(win,'keydown',{code:'Equal',repeat:false});assert.ok(run.targetZoom>before);fire(win,'keyup',{code:'Equal'});
 fire(win,'keydown',{code:'Minus',repeat:false});assert.ok(Math.abs(run.targetZoom-before)<1e-8);
 fire(canvas,'wheel',{deltaY:-1e6});assert.equal(run.targetZoom,1.65);fire(canvas,'wheel',{deltaY:1e6});assert.equal(run.targetZoom,.6);
}));
test('two-finger pinch still zooms and releases movement cleanly with no zoom callback',()=>controls(({canvas,run,input,fire})=>{
 fire(canvas,'pointerdown',{pointerId:1,clientX:100,clientY:300});fire(canvas,'pointerdown',{pointerId:2,clientX:200,clientY:300});
 fire(canvas,'pointermove',{pointerId:2,clientX:250,clientY:300});assert.ok(Math.abs(run.targetZoom-1.35)<1e-8);assert.deepEqual(input.direction(),{x:0,y:0});
 fire(canvas,'pointerup',{pointerId:2});fire(canvas,'pointermove',{pointerId:1,clientX:145,clientY:300});assert.equal(input.direction().x,1);fire(canvas,'pointercancel',{pointerId:1});assert.deepEqual(input.direction(),{x:0,y:0});
}));
