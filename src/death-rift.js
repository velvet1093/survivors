// A rift-exclusive primordial devil. Every blade and coffin locks its warning
// geometry at cast time; only the normal hazard simulation can deal damage.
export const DEATH_BOSSES={
 deathdevil:{name:'Death Devil',title:'THE LAST FEAR',family:'chainsawman',hp:30000,speed:45,r:55,color:'#dedbd0',behavior:'deathdevil',riftOnly:true,waterWalker:true,description:'Rift only. Memento Mori opens five coffin seals in a fixed spiral, leaving an escape side before a final central blast. Pale Crown sends seven bone blades inward but leaves a broad open cone and a safe center until its separately warned final toll. The Last Horizon releases two side beams before a broad central beam. Below half health Memento Mori adds two seals, Pale Crown adds two blades, the marks widen and The Last Horizon finishes with a fourth perpendicular cut. Every warning locks before release. There are no summoned servants; defeat the devil for the standard five-reward rift cache.'},
};
const TAU=Math.PI*2;
export function deathRiftAttack(g,e,p,a,{hazard}={}){
 if(!DEATH_BOSSES[e.archetype])return false;
 const fierce=!!e.enraged,move=g.lastMove||{},escape=Math.hypot(move.x||0,move.y||0)>.1?Math.atan2(move.y,move.x):a,marks=[];
 const mark=data=>{
  const h={age:0,duration:.5,color:e.color,source:e.archetype,sourceId:e.id,cancelWithSource:true,sourceClock:true,bossUltimate:true,...data};
  marks.push(h);hazard?.(g,h);return h;
 };
 const circle=(x,y,r,label,delay,damage,duration=.5)=>mark({shape:'circle',x,y,r,label,delay,damage,status:'cursed',duration});
 const line=(x,y,tx,ty,width,label,delay,damage,duration=.5)=>mark({shape:'line',x,y,tx,ty,width,label,delay,damage,status:'bleeding',duration});
 const centeredLine=(x,y,angle,length,width,label,delay,damage,duration=.5)=>line(x-Math.cos(angle)*length/2,y-Math.sin(angle)*length/2,x+Math.cos(angle)*length/2,y+Math.sin(angle)*length/2,width,label,delay,damage,duration);
 const tell=(name,style,duration,extra={})=>{
  e.riftAttack={version:1,name,style,age:0,duration,color:e.color,x:p.x,y:p.y,angle:a,gapAngle:escape,origin:{x:e.x,y:e.y-65},marks,...extra};
  e.windup=duration;e.attackCD=Math.max(e.attackCD||0,duration+(fierce?.55:.95));g.toast=name+' · RIFT ATTACK';g.toastTime=2.5;
 };
 if(e.skill%3===1){
  const count=fierce?7:5,finalDelay=1.6+(count-1)*.38+.85;
  tell('MEMENTO MORI · THE COFFIN PROCESSION','memento',finalDelay+.9,{count,gapHalfAngle:Math.PI/3});
  for(let i=0;i<count;i++){
   const angle=escape+Math.PI/3+(i+.5)*(TAU-Math.PI*2/3)/count,radius=95+i*35;
   circle(p.x+Math.cos(angle)*radius,p.y+Math.sin(angle)*radius,fierce?60:50,'MEMENTO MORI · COFFIN '+(i+1),1.6+i*.38,46,.45);
  }
  circle(p.x,p.y,fierce?112:90,'MEMENTO MORI · FINAL TOLL',finalDelay,64,.65);
 }else if(e.skill%3===2){
  const count=fierce?9:7,innerRadius=120,outerRadius=500;
  tell('PALE CROWN · THE INWARD BLADES','palecrown',4.25,{count,innerRadius,outerRadius,gapHalfAngle:Math.PI/3});
  for(let i=0;i<count;i++){
   const angle=escape+Math.PI/3+(i+.5)*(TAU-Math.PI*2/3)/count;
   line(p.x+Math.cos(angle)*outerRadius,p.y+Math.sin(angle)*outerRadius,p.x+Math.cos(angle)*innerRadius,p.y+Math.sin(angle)*innerRadius,fierce?24:18,'PALE CROWN · BONE BLADE',2.15+(i%2)*.12,49,.42);
  }
  circle(p.x,p.y,fierce?112:90,'PALE CROWN · LEAVE THE CENTER',3.35,65,.65);
 }else{
  tell('THE LAST HORIZON · THREE MOUTHS','lasthorizon',fierce?4.7:3.85,{count:fierce?4:3});
  for(const [i,offset]of [-150,150,0].entries()){
   const central=offset===0,x=p.x-Math.sin(a)*offset,y=p.y+Math.cos(a)*offset;
   centeredLine(x,y,a,1000,central?(fierce?52:42):(fierce?27:20),central?'LAST HORIZON · CENTRAL MOUTH':'LAST HORIZON · SIDE MOUTH '+(i+1),[1.65,2.2,3][i],central?68:50,central?.6:.45);
  }
  if(fierce)centeredLine(p.x,p.y,a+Math.PI/2,1000,28,'LAST HORIZON · FINAL CROSSING',3.85,58,.5);
 }
 return true;
}
