// Garuda's ivory vertebrae, steel-blue blades and red eye share one silhouette
// between Yuki's held shikigami and its thrown form. Positive X is the snout.
export const GARUDA_COLORS={bone:'#d5d5c6',shade:'#869598',light:'#f4f0dd',blade:'#8293b4',bladeLight:'#c9d3e4',ink:'#34424d',eye:'#c15c61'};
export function garudaGeometry(age=0,reduced=false,empowered=false){
 const c=GARUDA_COLORS,parts=[],poly=(points,color)=>parts.push({points,color}),wave=reduced?0:Math.sin(age*9)*1.4;
 for(let i=5;i>=0;i--){
  const x=-8-i*4,y=Math.sin(i*.72+wave*.3)*2.5,tip=8+(i%2)*3;
  poly([[x-3,y-2],[x-6,y-tip],[x+1,y-4],[x+3,y]],c.blade);
  poly([[x-4,y-5],[x-5,y-tip+1],[x-1,y-4]],c.bladeLight);
  poly([[x-2,y+2],[x-5,y+tip],[x+2,y+4],[x+3,y]],c.blade);
  poly([[x-1,y-3],[x+3,y-2],[x+4,y+1],[x+1,y+4],[x-3,y+2],[x-4,y]],i%2?c.shade:c.bone);
  poly([[x-1,y-2],[x+2,y-1],[x+2,y+1],[x,y+2],[x-2,y+1]],c.light);
 }
 // Open skeletal cheek, long pointed snout, underslung jaw and rear crown blades.
 poly([[-6,-3],[-5,-9],[-1,-16],[0,-7],[5,-4]],c.blade);
 poly([[-5,-8],[-1,-13],[-2,-5]],c.bladeLight);
 poly([[-5,3],[-4,8],[-1,13],[1,5],[6,3]],c.blade);
 poly([[-5,-3],[-1,-7],[6,-7],[11,-3],[20,-2],[14,2],[10,4],[3,6],[-3,4],[-6,1]],c.shade);
 poly([[-3,-3],[0,-5],[6,-5],[10,-1],[17,-1],[10,2],[6,4],[0,3],[-4,1]],c.bone);
 poly([[0,-4],[5,-5],[9,-2],[4,-2],[0,0],[-2,-1]],c.light);
 poly([[2,0],[5,-2],[9,-1],[8,2],[4,3],[1,1]],c.ink);
 poly([[4,0],[6,-1],[8,0],[6,2],[4,1]],c.eye);
 poly([[5,0],[6,0],[6,1],[5,1]],'#f6c6ac');
 poly([[10,1],[17,0],[14,2],[10,3],[7,4],[4,4],[6,3]],c.light);
 if(empowered){poly([[-6,-5],[-10,-11],[-7,-10],[-3,-5]],'#e9c58f');poly([[-3,5],[-7,11],[-4,10],[0,5]],'#f2d7a3');}
 return parts;
}
export function paintGaruda(r,{x=0,y=0,scale=1,angle=0,age=0,reduced=false,empowered=false}={}){
 const co=Math.cos(angle),si=Math.sin(angle);
 for(const part of garudaGeometry(age,reduced,empowered))r.poly(part.points.map(([px,py])=>[x+(px*co-py*si)*scale,y+(px*si+py*co)*scale]),part.color);
}
export function drawGarudaProjectile(c,s,reduced=false){
 const parts=garudaGeometry(s.age,reduced,s.mass||s.fused);c.lineJoin='miter';c.lineWidth=1.5;c.strokeStyle=GARUDA_COLORS.ink;
 for(const part of parts){c.fillStyle=part.color;c.beginPath();for(let i=0;i<part.points.length;i++){const [x,y]=part.points[i];if(i)c.lineTo(x,y);else c.moveTo(x,y);}c.closePath();c.fill();if(part.color!==GARUDA_COLORS.eye&&part.color!==GARUDA_COLORS.light)c.stroke();}
}

export function drawOrbitingGaruda(c,s,{reduced=false,empowered=false,zoom=1}={}){
 if(!s)return;c.save();c.translate(s.x,s.y);c.rotate(s.angle||0);const scale=Math.max(.65,.6/zoom);c.scale(scale,scale);drawGarudaProjectile(c,{age:s.age||0,mass:empowered},reduced);c.restore();
}
