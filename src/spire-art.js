// Art for the turn-based Ascent: hand-drawn basic cards and the battle backdrops.
const hash=s=>[...String(s)].reduce((h,c)=>Math.imul(h^c.charCodeAt(0),16777619)>>>0,2166136261);
const mixHex=(a,b,t)=>{const p=h=>[1,3,5].map(i=>parseInt(h.slice(i,i+2),16));const x=p(a),y=p(b);return '#'+x.map((v,i)=>Math.round(v+(y[i]-v)*t).toString(16).padStart(2,'0')).join('');};

// ---- Pixel card art (32 × 32) ----
function grid(){return Array.from({length:32},()=>Array(32).fill(null));}
const put=(g,x,y,c)=>{x=Math.round(x);y=Math.round(y);if(y>=0&&y<32&&x>=0&&x<32)g[y][x]=c;};
function line(g,x0,y0,x1,y1,c){const n=Math.max(Math.abs(x1-x0),Math.abs(y1-y0),1);for(let i=0;i<=n;i++)put(g,x0+(x1-x0)*i/n,y0+(y1-y0)*i/n,c);}
function svg(g,id){
 let out='';for(let y=0;y<32;y++){let x=0;while(x<32){const c=g[y][x];if(!c){x++;continue;}let w=1;while(x+w<32&&g[y][x+w]===c)w++;out+=`<rect x="${x}" y="${y}" width="${w}" height="1" fill="${c}"/>`;x+=w;}}
 return `<svg class="item-icon illustrated-icon pixel-item-icon" data-card-art="${id}" viewBox="0 0 32 32" shape-rendering="crispEdges" aria-hidden="true">${out}</svg>`;
}
function outline(g,color){
 const copy=g.map(r=>[...r]);
 for(let y=0;y<32;y++)for(let x=0;x<32;x++)if(!copy[y][x]&&[[1,0],[-1,0],[0,1],[0,-1]].some(([dx,dy])=>copy[y+dy]?.[x+dx]&&copy[y+dy][x+dx]!=='#ffffff'&&copy[y+dy][x+dx]!=='#cfeaff'))g[y][x]=color;
}
function strikeArt(){
 const g=grid();
 // A slash trail sweeping past the blade, thick in the middle and tapering out.
 for(let a=.05;a<=1.55;a+=.02){const t=Math.sin((a-.05)/1.5*Math.PI),r=15.5,x=13+Math.cos(a)*r,y=11+Math.sin(a)*r;put(g,x,y,'#ffffff');if(t>.35)put(g,13+Math.cos(a)*(r-1),11+Math.sin(a)*(r-1),'#ffffff');if(t>.7)put(g,13+Math.cos(a)*(r-2),11+Math.sin(a)*(r-2),'#cfeaff');}
 // Blade: bright edge, steel body, shadowed back.
 line(g,9,21,26,4,'#f4f8ff');line(g,10,21,27,4,'#dfe7f4');line(g,10,22,27,5,'#b9c6dc');line(g,11,22,27,6,'#7d8aa6');line(g,11,23,27,7,'#5c6884');
 put(g,28,3,'#ffffff');put(g,27,3,'#ffffff');put(g,28,4,'#dfe9ff');
 // Crossguard, grip and pommel.
 line(g,6,18,13,25,'#f2c14e');line(g,7,18,14,25,'#b07a24');put(g,6,17,'#ffe08a');put(g,14,26,'#8a5a18');
 for(let i=0;i<5;i++){put(g,9-i,23+i,i%2?'#5a2e24':'#9a4e3a');put(g,10-i,23+i,i%2?'#8a4a3a':'#5a2e24');}
 put(g,3,28,'#f2c14e');put(g,4,28,'#b07a24');put(g,3,29,'#b07a24');put(g,4,29,'#8a5a18');
 outline(g,'#1a1624');
 // Sparks at the tip.
 for(const [x,y]of [[30,1],[29,2],[31,3],[25,1],[30,6]])put(g,x,y,'#ffe9a0');
 return svg(g,'strike');
}
function guardArt(){
 const g=grid();
 const half=y=>y<=15?11:Math.max(0,Math.round(11*(1-((y-15)/14)**1.6)));
 for(let y=4;y<=29;y++){const w=half(y);for(let x=16-w;x<=16+w-1;x++){const left=x<16;put(g,x,y,left?'#6f9ad8':'#4a6fb0');}}
 // Gold rim and inner border.
 for(let y=4;y<=29;y++){const w=half(y);if(!w)continue;put(g,16-w,y,'#f2c14e');put(g,16+w-1,y,y>18?'#9a7424':'#d9a23a');if(w>2){put(g,17-w,y,'#2c3f6c');put(g,14+w,y,'#2c3f6c');}}
 for(let x=5;x<=26;x++){put(g,x,4,'#ffe08a');put(g,x,5,x<16?'#f2c14e':'#d9a23a');if(x>6&&x<25)put(g,x,6,'#2c3f6c');}
 put(g,16,29,'#9a7424');put(g,15,29,'#d9a23a');
 // Emblem: a four-point star with a gem.
 for(let i=-5;i<=5;i++){put(g,16+i,14,Math.abs(i)<3?'#ffe08a':'#e8b64a');put(g,16,14+i,Math.abs(i)<3?'#ffe08a':'#e8b64a');}
 for(const [x,y]of [[15,13],[17,13],[15,15],[17,15]])put(g,x,y,'#f2c14e');
 put(g,16,14,'#ff6a7a');put(g,16,13,'#ffb0b8');
 // Sheen on the upper left.
 for(let y=8;y<=18;y++)put(g,9+Math.floor((y-8)/4),y,'#a9c8f5');put(g,8,8,'#d6e6ff');put(g,8,9,'#d6e6ff');
 outline(g,'#151a2c');
 return svg(g,'guard');
}
function regretArt(){
 const g=grid();
 const inHeart=(x,y)=>{const u=(x-15.5)/11.5,v=(12-y)/10.5;return (u*u+v*v-1)**3-u*u*v*v*v<=0;};
 for(let y=0;y<32;y++)for(let x=1;x<31;x++)if(inHeart(x,y))put(g,x,y,x<16?'#8a4ab4':'#5e2e86');
 // The crack through the middle and the split halves.
 const crack=[[15,5],[17,8],[14,11],[17,14],[14,17],[16,20],[15,23]];
 for(let i=0;i<crack.length-1;i++){const [a,b]=crack[i],[c,d]=crack[i+1];line(g,a,b,c,d,'#140c1e');line(g,a+1,b,c+1,d,'#140c1e');}
 for(const [x,y]of [[7,6],[8,6],[6,7],[6,8],[7,9]])put(g,x,y,'#c99ae6');
 for(const [x,y]of [[20,27],[22,29],[10,28],[18,30],[13,30]])put(g,x,y,'#5e2e86');
 outline(g,'#120a1a');
 return svg(g,'regret');
}
const CARD_ART={strike:strikeArt,guard:guardArt,regret:regretArt},artCache=new Map();
export function cardArt(id){if(!CARD_ART[id])return null;if(!artCache.has(id))artCache.set(id,CARD_ART[id]());return artCache.get(id);}

// ---- Battle backdrops ----
// Each world's own preview art becomes the far layer of a deeper scene: sky,
// glow, haze, a perspective floor and drifting particles themed to the world.
const PARTICLES={garden:'petal',labyrinth:'petal',leafvillage:'leaf',forest:'firefly',moon:'firefly',tempest:'firefly',graveyard:'firefly',citadel:'snow',marineford:'spray',castle:'ember',eclipse:'ember',shibuya:'ember',ruins:'dust',shiganshina:'dust',zebes:'spore',tournament:'star',tokyo:'spark'};
export const sceneParticleKind=id=>PARTICLES[id]||'dust';
function particles(seed,kind,color,count=22){
 let h=hash(seed);const r=()=>((h=Math.imul(h^h>>>15,2246822507)>>>0)%10000)/10000;
 const rise=['ember','firefly','spore','spark','star'].includes(kind);
 return Array.from({length:count},()=>`<i class="sp-${kind} ${rise?'rise':'fall'}" style="--x:${(r()*100).toFixed(1)}%;--y:${(r()*100).toFixed(1)}%;--d:${(rise?6:8)+r()*8|0}s;--delay:-${(r()*14).toFixed(2)}s;--s:${(kind==='star'?1.5:kind==='petal'||kind==='leaf'?5:3)+r()*3|0}px;--sway:${(r()*60-30)|0}px;--c:${color}"></i>`).join('');
}
export function battleScene(map,preview){
 const sky=mixHex(map.dark,'#000000',.45),horizon=mixHex(map.color,map.dark,.62),floor=mixHex(map.ground,map.color,.08),stone=map.stone||map.color;
 const far=preview.replace(/preserveAspectRatio="[^"]*"/,'').replace('<svg ','<svg x="0" y="22" width="320" height="104" preserveAspectRatio="xMidYMax slice" ');
 let lanes='';for(let i=-6;i<=6;i++)lanes+=`<line x1="${160+i*26}" y1="126" x2="${160+i*120}" y2="180"/>`;
 const rows=[130,136,144,155,170].map(y=>`<line x1="0" y1="${y}" x2="320" y2="${y}"/>`).join('');
 const art=`<svg class="sp-art" viewBox="0 0 320 180" preserveAspectRatio="xMidYMid slice" aria-hidden="true"><defs><linearGradient id="sp-sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${sky}"/><stop offset=".7" stop-color="${horizon}"/></linearGradient><linearGradient id="sp-haze" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${horizon}" stop-opacity="0"/><stop offset="1" stop-color="${horizon}" stop-opacity=".85"/></linearGradient><linearGradient id="sp-floor" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${floor}"/><stop offset="1" stop-color="${mixHex(map.dark,'#000000',.5)}"/></linearGradient><radialGradient id="sp-glow"><stop offset="0" stop-color="${map.color}" stop-opacity=".55"/><stop offset="1" stop-color="${map.color}" stop-opacity="0"/></radialGradient><radialGradient id="sp-vig" cx=".5" cy=".55" r=".75"><stop offset=".55" stop-color="#000" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity=".75"/></radialGradient></defs>
 <rect width="320" height="180" fill="url(#sp-sky)"/><circle cx="236" cy="38" r="70" fill="url(#sp-glow)"/><circle cx="236" cy="38" r="13" fill="${mixHex(map.color,'#ffffff',.55)}" opacity=".7"/>
 <g opacity=".9">${far}</g><rect y="70" width="320" height="58" fill="url(#sp-haze)"/>
 <path d="M0 126H320V180H0Z" fill="url(#sp-floor)"/><g stroke="${stone}" stroke-opacity=".22" stroke-width=".7">${lanes}${rows}</g><path d="M0 126H320" stroke="${map.color}" stroke-opacity=".45"/>
 <ellipse cx="160" cy="150" rx="150" ry="20" fill="${map.color}" opacity=".07"/><rect width="320" height="180" fill="url(#sp-vig)"/></svg>`;
 return `${art}<div class="sp-particles">${particles(map.id,sceneParticleKind(map.id),mixHex(map.color,'#ffffff',.35))}</div>`;
}
// Between fights: a night sky over the tower, tinted by the act.
const ACT_TINT=['#8a76e0','#e07a96','#e8b85a'];
export function towerScene(act){
 const tint=ACT_TINT[act-1]||ACT_TINT[0];let h=hash('tower'+act);const r=()=>((h=Math.imul(h^h>>>15,2246822507)>>>0)%1000)/1000;
 const stars=Array.from({length:60},()=>`<rect x="${(r()*320).toFixed(1)}" y="${(r()*110).toFixed(1)}" width="${r()<.15?1.4:.8}" height="${r()<.15?1.4:.8}" fill="#fff" opacity="${(.3+r()*.6).toFixed(2)}"/>`).join('');
 const art=`<svg class="sp-art" viewBox="0 0 320 180" preserveAspectRatio="xMidYMid slice" aria-hidden="true"><defs><linearGradient id="tw-sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#07060d"/><stop offset=".75" stop-color="${mixHex(tint,'#0d0c14',.72)}"/><stop offset="1" stop-color="#0d0c14"/></linearGradient><radialGradient id="tw-glow"><stop offset="0" stop-color="${tint}" stop-opacity=".45"/><stop offset="1" stop-color="${tint}" stop-opacity="0"/></radialGradient></defs>
 <rect width="320" height="180" fill="url(#tw-sky)"/>${stars}<circle cx="160" cy="34" r="80" fill="url(#tw-glow)"/>
 <path d="M150 180V70l4-8V40l6-16 6 16v22l4 8v110Z" fill="#0b0a12"/><path d="M157 92h6v8h-6zM157 120h6v8h-6zM157 148h6v8h-6z" fill="${tint}" opacity=".7"/>
 <path d="M0 150q40-14 80-4t80-8 80 6 80-6V180H0Z" fill="#0f0d18"/><path d="M0 162q50-10 100-2t110-6 110 4V180H0Z" fill="#09080f"/></svg>`;
 return `${art}<div class="sp-particles">${particles('tower'+act,'dust',mixHex(tint,'#ffffff',.4),16)}</div>`;
}
