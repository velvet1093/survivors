// Pointer gestures stay inside the map. The browser handles ordinary wheel and
// trackpad scrolling; touch drags gain a short, bounded inertial release.
export function bindSkillTreeGestures(viewport,{getZoom,onZoom}){
 const pointers=new Map(),listeners=[];
 let gesture=null,suppressClick=false,clearClickTimer=null,momentum=0,velocity={x:0,y:0},lastMotion=0;
 const quiet=()=>window.matchMedia('(prefers-reduced-motion: reduce)').matches;
 const listen=(type,handler,options)=>{viewport.addEventListener(type,handler,options);listeners.push([type,handler,options]);};
 const capture=id=>{try{viewport.setPointerCapture(id);}catch{}};
 const release=id=>{try{if(viewport.hasPointerCapture(id))viewport.releasePointerCapture(id);}catch{}};
 const stopMomentum=()=>{if(momentum)cancelAnimationFrame(momentum);momentum=0;viewport.classList.remove('coasting');};
 const local=(x,y)=>{const r=viewport.getBoundingClientRect();return {x:x-r.left-viewport.clientLeft,y:y-r.top-viewport.clientTop};};
 const pinch=()=>{const [a,b]=[...pointers.values()];return {x:(a.x+b.x)/2,y:(a.y+b.y)/2,distance:Math.hypot(b.x-a.x,b.y-a.y)};};
 const markDragging=()=>{suppressClick=true;viewport.classList.add('dragging');};
 const coast=()=>{
  if(quiet()||Math.hypot(velocity.x,velocity.y)<.06||performance.now()-lastMotion>90)return;
  let previous=performance.now();viewport.classList.add('coasting');
  const frame=now=>{
   if(!viewport.isConnected){stopMomentum();return;}
   const dt=Math.min(32,Math.max(0,now-previous));previous=now;
   const left=viewport.scrollLeft,top=viewport.scrollTop;
   viewport.scrollLeft+=velocity.x*dt;viewport.scrollTop+=velocity.y*dt;
   if(Math.abs(viewport.scrollLeft-left)<.1)velocity.x=0;
   if(Math.abs(viewport.scrollTop-top)<.1)velocity.y=0;
   const decay=Math.exp(-dt/190);velocity.x*=decay;velocity.y*=decay;
   if(Math.hypot(velocity.x,velocity.y)<.035){stopMomentum();return;}
   momentum=requestAnimationFrame(frame);
  };
  momentum=requestAnimationFrame(frame);
 };
 const rebase=continuing=>{
  velocity={x:0,y:0};lastMotion=performance.now();
  if(pointers.size>=2){gesture={type:'pinch',...pinch()};markDragging();for(const id of pointers.keys())capture(id);}
  else if(pointers.size===1){const p=pointers.values().next().value;gesture={type:'pan',startX:p.x,startY:p.y,lastX:p.x,lastY:p.y,time:performance.now(),touch:p.touch,dragging:continuing};if(continuing){markDragging();capture(pointers.keys().next().value);}}
  else{gesture=null;viewport.classList.remove('dragging');if(suppressClick){clearTimeout(clearClickTimer);clearClickTimer=setTimeout(()=>{suppressClick=false;},400);}}
 };
 listen('pointerdown',event=>{
  if(event.button!==0)return;
  const stopping=!!momentum;stopMomentum();
  if(!pointers.size){clearTimeout(clearClickTimer);suppressClick=stopping;}
  pointers.set(event.pointerId,{x:event.clientX,y:event.clientY,touch:event.pointerType==='touch'});rebase(false);
  // A normal node tap is not captured and still selects that skill.
  if(pointers.size>=2)event.preventDefault();
 });
 listen('pointermove',event=>{
  if(!pointers.has(event.pointerId)||!gesture)return;
  const p={...pointers.get(event.pointerId),x:event.clientX,y:event.clientY};pointers.set(event.pointerId,p);
  if(gesture.type==='pinch'){
   const next=pinch(),previous=gesture;
   viewport.scrollLeft-=next.x-previous.x;viewport.scrollTop-=next.y-previous.y;
   if(previous.distance>0&&next.distance>0)onZoom(getZoom()*next.distance/previous.distance,local(next.x,next.y));
   gesture={type:'pinch',...next};event.preventDefault();return;
  }
  if(!gesture.dragging){if(Math.hypot(p.x-gesture.startX,p.y-gesture.startY)<5)return;gesture.dragging=true;markDragging();capture(event.pointerId);}
  const now=performance.now(),dt=Math.max(8,now-gesture.time),left=viewport.scrollLeft,top=viewport.scrollTop;
  viewport.scrollLeft-=p.x-gesture.lastX;viewport.scrollTop-=p.y-gesture.lastY;
  const dx=(viewport.scrollLeft-left)/dt,dy=(viewport.scrollTop-top)/dt;
  velocity={x:Math.max(-2.8,Math.min(2.8,velocity.x*.3+dx*.7)),y:Math.max(-2.8,Math.min(2.8,velocity.y*.3+dy*.7))};lastMotion=now;
  gesture.lastX=p.x;gesture.lastY=p.y;gesture.time=now;event.preventDefault();
 },{passive:false});
 const end=event=>{
  if(!pointers.has(event.pointerId))return;
  const continuing=gesture?.type==='pinch'||gesture?.dragging,fling=event.type==='pointerup'&&gesture?.type==='pan'&&gesture.dragging&&gesture.touch&&pointers.size===1,speed={...velocity},motion=lastMotion;
  pointers.delete(event.pointerId);release(event.pointerId);rebase(!!continuing);
  if(fling){velocity=speed;lastMotion=motion;coast();}
 };
 listen('pointerup',end);listen('pointercancel',end);
 // Taking capture from a tapped node also bubbles that child's capture loss.
 // Only the viewport losing its own capture should finish the active pan.
 listen('lostpointercapture',event=>{if(event.target===viewport)end(event);});
 listen('pointerleave',event=>{if(pointers.has(event.pointerId)&&!viewport.hasPointerCapture(event.pointerId))end(event);});
 listen('wheel',event=>{
  stopMomentum();
  if(event.ctrlKey||event.metaKey){event.preventDefault();onZoom(getZoom()*Math.exp(-event.deltaY*.005),local(event.clientX,event.clientY));}
  else if(event.shiftKey&&!event.deltaX){event.preventDefault();const scale=event.deltaMode===1?18:event.deltaMode===2?viewport.clientWidth:1;viewport.scrollLeft+=event.deltaY*scale;}
 },{passive:false});
 listen('click',event=>{if(suppressClick&&event.detail!==0){event.preventDefault();event.stopImmediatePropagation();}},true);
 return ()=>{stopMomentum();clearTimeout(clearClickTimer);for(const [type,handler,options]of listeners)viewport.removeEventListener(type,handler,options);const ids=[...pointers.keys()];pointers.clear();gesture=null;for(const id of ids)release(id);viewport.classList.remove('dragging');};
}
