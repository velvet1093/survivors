// A camera-aware outer boundary; inside it companions can patrol and pick their own targets.
export function companionLeash(g){const zoom=Math.max(g.zoom||.9,g.targetZoom||.9),w=g.view?.w||1200,h=g.view?.h||800;return Math.min(300,Math.max(12,Math.min(w/2/zoom-48,h/2/zoom-84)));}
export const nearbyCompanionTargets=g=>g.enemies.filter(e=>e.hp>0&&Math.hypot(e.x-g.p.x,e.y-g.p.y)<=companionLeash(g)*.94);
export function companionHome(g,s,radius=36){const seed=(Math.abs(s.id||0)%11)*2.399,t=g.time||0,a=seed+t*(.24+(Math.abs(s.id||0)%3)*.07),range=companionLeash(g),r=Math.min(Math.max(radius,range*(.35+.18*Math.sin(t*.43+seed))),range*.66);return{x:g.p.x+Math.cos(a)*r,y:g.p.y+Math.sin(a)*r};}
export function recallCompanion(g,s,radius=36){
 const dx=s.x-g.p.x,dy=s.y-g.p.y,d=Math.hypot(dx,dy),leash=companionLeash(g);
 if(d>Math.max(leash*2,leash+180)){Object.assign(s,companionHome(g,s,radius));s.moving=false;return true;}
 // Slide along the outer boundary rather than snapping back to the owner's feet.
 if(d>leash){s.x=g.p.x+dx/d*leash;s.y=g.p.y+dy/d*leash;return true;}return false;
}
