// The walking body's head is drawn on the same 56 × 76 grid as the other
// enemies. Keep its projectiles, beam charge and mouth at the same anchor.
export function motherBrainMuzzle(e,eye=false){
 const scale=.8*(e.r||50)/18,facing=e.facing<0?-1:1;
 return {x:e.x+(eye?18:21)*scale*facing,y:e.y+(eye?-53:-45)*scale};
}

export function castMotherBrainAttack(g,e,p,{fan,hazard}){
 const style=['stomp','rinka','beam'][e.skill%3],facing=e.facing<0?-1:1,origin=motherBrainMuzzle(e,style==='rinka');
 const angle=Math.atan2(p.y-origin.y,p.x-origin.x),u={version:1,style,age:0,duration:style==='rinka'?.85:2.35,angle,facing,origin};
 e.motherBrainAttack=u;e.armorTime=0;e.windup=u.duration;e.moving=false;
 // A longer recovery separates the silhouette changes and prevents a fresh
 // attack from starting before the last impact from this one has resolved.
 e.attackCD=Math.max(e.attackCD,u.duration+.8);
 const mark=data=>hazard(g,{...data,source:e.archetype,sourceId:e.id,cancelWithSource:true,sourceClock:true,color:data.color||'#e9b789'});
 if(style==='rinka'){
  fan(g,{...e,...origin},angle,7,.18,175,'rinka');
 }else if(style==='beam'){
  u.beam={x:origin.x,y:origin.y,tx:origin.x+Math.cos(angle)*1100,ty:origin.y+Math.sin(angle)*1100,width:26,delay:1.6,duration:.55};
  mark({...u.beam,shape:'line',label:'HYPER BEAM',status:'burning',damage:34,color:'#f1c889'});
 }else{
  // The feet strike the floor, not the target's changing position. The final
  // crater stays where the player was when Mother Brain committed to the stomp.
  const dx=p.x-e.x,dy=p.y-e.y,length=Math.min(430,Math.max(150,Math.hypot(dx,dy))),a=Math.atan2(dy,dx);
  u.angle=a;u.stomps=[];
  for(let i=0;i<3;i++){
   const distance=length*(i+1)/3,step={x:e.x+Math.cos(a)*distance,y:e.y+Math.sin(a)*distance,r:48,delay:1.1+i*.35,duration:.35};
   u.stomps.push(step);mark({...step,shape:'circle',label:'TOURIAN · CRUSHING STEP',status:'stun',damage:23});
  }
 }
 return u;
}
