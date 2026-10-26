// Thin, non-damaging atmospheric layers. All drift follows saved game/event
// clocks, with a still arrangement for reduced motion.
const TAU=Math.PI*2,mod=(n,r)=>((n%r)+r)%r;
const hash=n=>{const x=Math.sin(n*127.1+311.7)*43758.5453;return x-Math.floor(x);};
function oval(c,x,y,rx,ry,color){c.fillStyle=color;c.beginPath();c.ellipse(x,y,rx,ry,0,0,TAU);c.fill();}
export function drawGraveyardWeather(c,g,w,h,reduced=false){
 const event=g.events?.active,haunted=event?.id==='ghostparade',tomb=event?.id==='tombwake';
 if(g.mode==='bossrush'||g.riftArena||!(w>0&&h>0)||g.map?.id!=='graveyard'&&!haunted&&!tomb)return false;
 const age=event?.age??g.time??0,t=reduced?0:Math.max(0,Number.isFinite(age)?age:0);c.save();
 for(let i=0;i<(reduced?3:5);i++){
  const x=mod(hash(i+31)*w+t*(3+i),w+280)-140,y=h*(.33+i*.14);
  oval(c,x,y,140+i*25,11+i*2,tomb?'#a290c00c':'#9fc7bb0c');
 }
 if(haunted){
  c.fillStyle='#548c8710';c.fillRect(0,0,w,h);
  for(let i=0;i<(reduced?5:13);i++){
   const x=mod(hash(i+1)*w+t*(5+i%3),w+20)-10,y=mod(hash(i+40)*h-t*(4+i%4),h+30)-15;
   oval(c,x,y,3,5,'#bce1c255');c.fillStyle='#f0ead777';c.fillRect(Math.round(x-1),Math.round(y-2),2,2);
  }
 }else if(tomb){
  c.fillStyle='#5c447514';c.fillRect(0,0,w,h);
  for(let i=0;i<(reduced?5:16);i++){
   const x=mod(hash(i+12)*w+t*(2+i%3),w),y=mod(hash(i+61)*h-t*(7+i%4),h);
   c.fillStyle=i%3?'#c5afda44':'#dfcc9b55';c.fillRect(Math.round(x),Math.round(y),2,3);
  }
 }
 c.restore();return true;
}
