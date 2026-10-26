export const EXPRESSIONS=['neutral','focused','hurt','ultimate'];
export function faceState(p,time=0){
 const expression=(p.hurtTimer||0)>0?'hurt':p.pose?'ultimate':(p.attackTimer||0)>.05?'focused':'neutral';
 const offset={goku:0,gojo:1.2,naruto:2.5,madoka:.6,maomao:3.1,shinji:1.8,esdeath:2.2,kurumi:3.6}[p.id]||0;
 return {expression,blink:!p.reducedMotion&&expression==='neutral'&&(time+offset)%4.7>4.56};
}
// Facial clusters are drawn independently of clothing, hair and physical movement.
export function paintFace(r,id,{y=0,expression='neutral',blink=false}={}){
 const {rect,line}=r,skin='#ffe2c6',ink=id==='maomao'?'#2b4140':'#293145';
 const hurt=expression==='hurt',focus=expression==='focused'||expression==='ultimate';
 if(id!=='gojo'){
  const iris={goku:'#283f54',naruto:'#4287b6',madoka:'#ad577e',maomao:'#7772b5',shinji:'#52778a',esdeath:'#619bbf',kurumi:'#b94f69'}[id]||'#52778a';
  for(const [i,x] of [21,31].entries()){
   rect(x,28+y,5,5,skin);
   if(blink||hurt){line(x,30+y,x+3,31+y,ink);if(hurt)line(x,32+y,x+3,31+y,ink);}
   else{rect(x,29+y,4,4,'#fff6e9');rect(x+1,29+y,2,4,iris);rect(x+1,29+y,1,1,'#fffdf2');rect(x+2,32+y,1,1,id==='maomao'?'#b0a6e0':'#91b4bf');line(x,28+y,x+3,focus?29+y:28+y,ink);if(focus)rect(i?x:x+3,29+y,1,1,ink);}
   if(id==='madoka')rect(i?x+4:x-1,29+y,1,1,ink);
   if(focus)line(x,26+y,x+3,i?26+y:27+y,ink);
  }
 }
 rect(26,35+y,7,2,skin);
 if(hurt){rect(28,35+y,2,2,'#a46974');return;}
 if(focus){rect(27,35+y,id==='naruto'?5:4,1,'#9c6670');if(expression==='ultimate'&&id==='goku')rect(28,36+y,3,1,'#c68b88');return;}
 if(id==='naruto'){rect(26,35+y,6,2,'#a97376');rect(27,35+y,4,1,'#fff5dc');}
 else if(id==='gojo'){rect(27,35+y,4,1,'#a16f77');rect(31,34+y,1,1,'#a16f77');}
 else if(id==='maomao'){rect(27,36+y,3,1,'#a97476');rect(30,35+y,1,1,'#a97476');}
 else if(id==='shinji'){rect(27,36+y,3,1,'#a57579');}
 else{rect(27,35+y,1,1,'#aa7378');rect(28,36+y,3,1,'#aa7378');rect(31,35+y,1,1,'#aa7378');}
}
