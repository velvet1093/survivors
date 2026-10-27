import {complexItemIcon} from './complex-item-art.js';
import {setItemIcon} from './set-item-art.js';
import {shiraoriIcon} from './shiraori-spider-art.js';
import {megumiIcon} from './megumi-icons.js';
import {erenIcon} from './eren-icons.js';
import {evaIcon} from './eva-icons.js';
import {maomaoIcon} from './maomao-icons.js';
import {gojoIcon} from './gojo-icons.js';
import {madokaIcon} from './madoka-icons.js';
import {soulGemIcon} from './soul-gem-art.js';
import {pairedItemIcon} from './paired-item-art.js';
import {denjiIcon} from './denji-icons.js';
import {erzaWeaponArt} from './erza-weapon-icons.js';
import {gutsIcon} from './guts-icons.js';
import {frierenBarrageIcon} from './frieren-barrage-icon.js';
import {chestIllustration} from './chest-art.js';
import {pixelItemArt} from './pixel-items.js';
const erzaIconCache=new Map();
// Requip equipment uses the same compact, outlined pixel illustrations as the
// rest of the inventory; the crest and Nakagami spatial blade stay clear at HUD size.
function erzaItemArt(id){
 if(!['requip','heartkreuz','heavensarsenal','nakagami'].includes(id))return null;
 if(erzaIconCache.has(id))return erzaIconCache.get(id);
 const pixels=Array(32*32).fill(null),ink='#293245',steel='#8fabb8',light='#e7eee0',gold='#dbbc7e',red='#bb5267';
 const R=(x,y,w,h,c)=>{for(let yy=Math.round(y);yy<y+h;yy++)for(let xx=Math.round(x);xx<x+w;xx++)if(xx>=0&&yy>=0&&xx<32&&yy<32)pixels[yy*32+xx]=c;};
 const L=(x,y,tx,ty,c,w=1)=>{const n=Math.max(Math.abs(tx-x),Math.abs(ty-y),1);for(let i=0;i<=n;i++)R(Math.round(x+(tx-x)*i/n),Math.round(y+(ty-y)*i/n),w,w,c);};
 const P=(ps,c)=>{for(let y=0;y<32;y++)for(let x=0;x<32;x++){let inside=false;for(let i=0,j=ps.length-1;i<ps.length;j=i++){const a=ps[i],b=ps[j];if((a[1]>y+.5)!==(b[1]>y+.5)&&x+.5<(b[0]-a[0])*(y+.5-a[1])/(b[1]-a[1])+a[0])inside=!inside;}if(inside)R(x,y,1,1,c);}};
 const star=(x,y,c)=>{R(x-2,y,5,1,c);R(x,y-2,1,5,c);R(x-1,y-1,3,3,c);R(x,y,1,1,'#fff3cf');};
 const sword=(dx=0,dy=0)=>{P([[5+dx,25+dy],[4+dx,21+dy],[23+dx,2+dy],[28+dx,2+dy],[28+dx,7+dy],[9+dx,26+dy]],ink);P([[7+dx,21+dy],[24+dx,4+dy],[26+dx,4+dy],[26+dx,6+dy],[9+dx,23+dy]],steel);L(9+dx,20+dy,24+dx,5+dy,light);L(4+dx,21+dy,11+dx,28+dy,ink,3);L(4+dx,21+dy,11+dx,28+dy,gold,2);L(3+dx,28+dy,6+dx,25+dy,red,3);R(1+dx,29+dy,3,2,gold);};
 if(id==='requip'){P([[4,8],[12,5],[17,10],[13,17],[6,17]],'#7e4562');sword();star(6,6,'#e4c88c');}
 else if(id==='heartkreuz'){P([[6,4],[25,4],[29,11],[26,24],[16,31],[6,24],[3,11]],ink);P([[7,6],[24,6],[27,12],[24,23],[16,28],[8,23],[5,12]],'#a6b9c3');P([[10,8],[22,8],[24,12],[22,21],[16,26],[10,21],[8,12]],'#58788c');P([[13,9],[23,10],[18,14],[22,18],[16,23],[13,19],[9,20],[12,15],[10,12]],'#d77280');R(14,11,3,9,'#f2debc');R(11,14,10,2,'#f2debc');R(7,7,3,1,light);R(21,23,2,2,light);}
 else if(id==='heavensarsenal'){P([[2,15],[4,6],[16,1],[28,6],[31,15],[27,26],[16,31],[5,26]],'#704760');P([[4,15],[6,8],[16,3],[26,8],[29,15],[25,24],[16,29],[7,24]],'#3a4d69');P([[17,24],[5,20],[2,12],[8,15],[6,7],[12,12],[13,4],[18,13]],steel);P([[17,24],[29,20],[31,12],[25,15],[27,7],[21,12],[20,4],[15,13]],steel);L(9,18,5,13,light);L(23,18,28,13,light);sword(1,1);star(24,26,gold);}
 else{P([[16,1],[28,7],[31,19],[23,30],[8,30],[1,19],[4,7]],ink);P([[16,3],[26,8],[29,18],[22,28],[9,28],[3,18],[6,8]],'#655879');P([[2,26],[13,14],[19,16],[31,3],[23,20],[18,18],[8,31]],'#e3bf78');P([[6,26],[15,17],[19,18],[28,7],[21,22],[18,21],[10,29]],'#fff3c7');sword();for(const [x,y]of [[7,7],[24,25],[3,17]])star(x,y,gold);}
 const art=pixels.map((c,i)=>c?`<rect x="${i%32+1}" y="${Math.floor(i/32)+1}" width="1" height="1" fill="${c}"/>`:'').join('');erzaIconCache.set(id,art);return art;
}
const paths = {
  arrow:'<path d="M7 27 27 7M9 7h18v18"/>',
  pause:'<path d="M12 7v20M22 7v20" stroke-width="4"/>',
  ki:'<path d="M4 22 16 10m-7 18 13-13M18 5l9 9-5 5-9-9z"/><path d="m23 5 4-3m2 10 3-2M4 15l5-2"/>',
  blue:'<circle cx="17" cy="17" r="6"/><ellipse cx="17" cy="17" rx="14" ry="7" transform="rotate(-35 17 17)"/><path d="M7 5 5 9m21 17 3 3"/>',
  shuriken:'<path d="m17 2 4 10 11 5-11 4-4 11-5-11-10-4 10-5z"/><circle cx="17" cy="17" r="3"/>',
  kunai:'<path d="m24 3 7 7-14 13-6-6zM12 21l-6 6m4-10 7 7"/><circle cx="5" cy="28" r="3"/>',
  lightning:'<path d="M20 2 7 20h10l-3 12L29 13H18z"/>',
  orbit:'<circle cx="17" cy="17" r="10" stroke-dasharray="3 4"/><circle cx="8" cy="9" r="4"/><circle cx="27" cy="16" r="4"/><circle cx="12" cy="27" r="4"/><path d="m17 12 1.5 3.5L22 17l-3.5 1.5L17 22l-1.5-3.5L12 17l3.5-1.5z"/>',
  senzu:'<path d="M26 6c8 10-1 23-13 24S0 17 9 14c5-2 7 0 10-3s2-7 7-5Z"/><path d="M10 24q10-1 14-10M21 6l-1-4m1 4 6-4"/>',
  eyes:'<path d="M2 17Q17 0 32 17 17 34 2 17Z"/><circle cx="17" cy="17" r="7"/><circle cx="17" cy="17" r="2"/><path d="m17 3 0-2m-11 5-2-2m24 2 2-2"/>',
  headband:'<path d="M4 10h26v15H4zM4 13l-3 1v15l6-4m23-12 3 1v15l-6-4"/><path d="M12 20c-5-8 10-11 10-3s-10 7-9 2l-4 3"/>',
  magnet:'<path d="M6 4h8v14a3 3 0 0 0 6 0V4h8v14a11 11 0 0 1-22 0zM6 10h8m6 0h8"/><path d="m2 29 3-2m25 0 3 2"/>',
  scroll:'<path d="M8 5h19v22H8M8 5c-7-4-7 7 0 6m0 16c-7-4-7 7 0 5h21c5 0 5-7 0-7"/><path d="M13 11h9m-9 5h7m-7 5h9"/>',
  power:'<path d="m8 7 18-2 4 22-18 3zM8 7 4 11l4 21 4-2M13 13l9-1 2 9-9 2z"/>',
  kamehameha:'<path d="m2 25 12-12m-9 17 12-12M19 2l13 13-11 7L12 13z"/><path d="m24 3 7-1m0 10 2-6M3 17l5-2"/>',
  purple:'<circle cx="13" cy="17" r="9"/><circle cx="23" cy="17" r="9"/><path d="m18 7 0 20m-9-9h18M9 4 6 1m22 29 3 3"/>',
  rasen:'<path d="M17 2 22 12 32 17 22 22 17 32 12 22 2 17 12 12Z"/><path d="M12 17c0-9 13-7 10 2s-14 4-8-1 6 3 2 2"/>',
  raijin:'<path d="m20 2-5 10h8L12 31l2-13H6zM4 3l4 5m20 18 4 5M2 19h4m22-5h4"/>',
  tempest:'<path d="M9 16C-3 10 10-1 17 6c8-7 19 5 9 10M18 12 9 23h9l-3 10 11-16h-9z"/>',
  galaxy:'<ellipse cx="17" cy="17" rx="15" ry="6" transform="rotate(-35 17 17)"/><path d="m17 5 3 9 9 3-9 3-3 9-3-9-9-3 9-3z"/><circle cx="28" cy="7" r="2"/>',
  spirit:'<circle cx="17" cy="11" r="8"/><path d="M7 18 2 31m25-13 5 13M17 22v10m-7-9-3 9m17-9 3 9"/>',
  void:'<circle cx="17" cy="17" r="14"/><circle cx="17" cy="17" r="9" stroke-dasharray="1 4"/><path d="M9 17c4-10 11 10 16 0-4-10-11 10-16 0Z"/>',
  clone:'<path d="M14 12a5 5 0 1 0 0-10 5 5 0 0 0 0 10ZM5 30v-9c0-10 18-10 18 0v9M23 3a5 5 0 0 1 0 9m4 4c6 2 5 8 5 14M11 22v10m6-10v10"/>',
  fusion:'<path d="m3 5 11 11L3 27m28-22L20 16l11 11M12 16h10"/><circle cx="17" cy="16" r="6"/>',
  heal:'<path d="M12 3h10v9h9v10h-9v9H12v-9H3V12h9z"/>',
};
const artwork={
  chest:'<path d="M3 15q0-11 14-11t14 11v15H3Z" fill="#936044" stroke="#f0c880" stroke-width="2"/><path d="M3 15h28v6H3Z" fill="#d6a264" stroke="#f6d592"/><path d="M10 5v25M24 5v25" stroke="#e9bd74" stroke-width="3"/><rect x="14" y="17" width="6" height="8" rx="1" fill="#ffe4a0" stroke="#fff0c8"/><path d="M7 2 5 0m24 3 3-2M17 1V-1" stroke="#ffe6b2"/>',

  ki:'<path d="m2 28 13-13m-9 16 12-13" stroke="#ffcf67" stroke-width="3"/><circle cx="22" cy="12" r="9" fill="#2e9fd8" stroke="#a3efff"/><circle cx="23" cy="11" r="5" fill="#b9f6ff" stroke="#efffff"/><path d="m9 13-6 2m15-13 0 3" stroke="#ffe4a4"/>',
  blue:'<ellipse cx="17" cy="17" rx="15" ry="7" transform="rotate(-35 17 17)" fill="#204c9c55" stroke="#a2bfff"/><circle cx="17" cy="17" r="8" fill="#244b9b" stroke="#78b7ff"/><circle cx="17" cy="17" r="4" fill="#d9eaff" stroke="#fff"/><path d="m6 4 2 4m21 18 2 3" stroke="#d4a3ff"/>',
  shuriken:'<path d="m17 2 4 10 11 5-11 4-4 11-5-11-10-4 10-5z" fill="#b4d6dc" stroke="#4c7184"/><path d="m17 3 0 14 14 0-11 4-3 10V17H3l10-5z" fill="#edf9ef" stroke="none"/><circle cx="17" cy="17" r="4" fill="#4e9384" stroke="#beffdf"/>',
  kunai:'<path d="m24 3 7 7-14 13-6-6z" fill="#becfdf" stroke="#657d99"/><path d="m24 3-7 20-6-6z" fill="#f3f4e8" stroke="none"/><path d="m13 20-6 6" stroke="#a35c65" stroke-width="5"/><path d="m10 21 2 2m-5 0 2 2" stroke="#f1c496"/><circle cx="5" cy="28" r="3" fill="#30374a" stroke="#c0d0dd"/>',
  lightning:'<path d="M20 2 7 20h10l-3 12L29 13H18z" fill="#f6b748" stroke="#ffe8a8"/><path d="m20 4-8 13h10l-7 13 3-12H9Z" fill="#fff6c8" stroke="none"/><path d="m4 5 4 3m20 18 3 2" stroke="#b3cdff"/>',
  senzu:'<path d="M26 6c8 10-1 23-13 24S0 17 9 14c5-2 7 0 10-3s2-7 7-5Z" fill="#70a94c" stroke="#d2ed94"/><path d="M9 23q12 3 16-11" stroke="#badd74" stroke-width="4"/><path d="m22 7-1-5m1 5 6-4" stroke="#e9ce91"/>',
  eyes:'<path d="M2 17Q17 0 32 17 17 34 2 17Z" fill="#edf1fa" stroke="#697eab"/><circle cx="17" cy="17" r="7" fill="#549dde" stroke="#b2eaff"/><circle cx="17" cy="17" r="3" fill="#182954" stroke="#4169ad"/><circle cx="19" cy="14" r="2" fill="#fff" stroke="none"/><path d="m6 6-2-2m24 2 2-2" stroke="#d3baff"/>',
  headband:'<path d="M4 10h26v15H4zM4 13l-3 1v15l6-4m23-12 3 1v15l-6-4" fill="#3c5a7c" stroke="#8bacbd"/><rect x="6" y="11" width="22" height="13" rx="2" fill="#c9d8df" stroke="#edf3e5"/><path d="M12 20c-5-8 10-11 10-3s-10 7-9 2l-4 3" stroke="#426676"/>',
  magnet:'<path d="M6 4h8v14a3 3 0 0 0 6 0V4h8v14a11 11 0 0 1-22 0z" fill="#ce6a86" stroke="#ffb5be"/><path d="M6 4h8v7H6m14-7h8v7h-8" fill="#becde6" stroke="#e4e7fa"/><path d="m2 29 3-2m25 0 3 2" stroke="#f9d48a"/>',
  scroll:'<path d="M8 5h19v22H8Z" fill="#f0d2a0" stroke="#a67e52"/><path d="M8 5c-7-4-7 7 0 6m0 16c-7-4-7 7 0 5h21c5 0 5-7 0-7" fill="#c58c63" stroke="#ffdfab"/><path d="M13 11h9m-9 5h7m-7 5h9" stroke="#927769"/>',
  power:'<path d="m8 7 18-2 4 22-18 3zM8 7 4 11l4 21 4-2" fill="#ae536c" stroke="#e69c9f"/><path d="m13 13 9-1 2 9-9 2z" fill="#deb06c" stroke="#ffdda0"/><path d="m17 16 3-1 1 4-3 1z" fill="#efc5b1" stroke="#ffffde"/>',
  rosebow:'<path d="M24 3Q1 6 24 31M24 3 12 17l12 14" fill="none" stroke="#d5a26e" stroke-width="3"/><path d="M7 17h23m-5-4 6 4-6 4" stroke="#ffd6ed"/><path d="m17 6-4-3-4 4 4 4z" fill="#e86fa3" stroke="#ffc0dc"/><circle cx="13" cy="7" r="2" fill="#ffd6eb" stroke="none"/>',
  soulgem:'<path d="m17 2 9 9v13l-9 8-9-8V11z" fill="#d86da6" stroke="#f8d99b" stroke-width="2"/><path d="m17 6 5 8-5 13-5-13z" fill="#f5b1d2" stroke="#fff0f6"/><path d="m8 15 9-5 9 5" stroke="#efc67e"/><circle cx="17" cy="15" r="2" fill="#fff1fb" stroke="none"/>',
  ultimate:'<path d="m17 2 3 10 11 5-11 4-3 11-4-11-11-4 11-5z" fill="#f0a7d2" stroke="#fff3d9"/><path d="M25 5Q4 11 25 29M25 5 13 17l12 12" stroke="#f7d19c" fill="none" stroke-width="2"/><path d="M4 17h25m-4-3 5 3-5 3" stroke="#fff"/>',
};
Object.assign(artwork,{
 odmblades:'<path d="m4 4 19 19-3 3L2 7Zm26 0L11 23l3 3L32 7Z" fill="#c8e1e4" stroke="#eef5df"/><path d="m20 25 7 6m-13-6-7 6M5 22l7-7m17 7-7-7" stroke="#9a8265" stroke-width="3"/>',
 titanfists:'<path d="m7 28-4-11 3-8 5-1 4 4 3-8 5 1 2 9 6 6-5 10Z" fill="#bb927c" stroke="#e6c8a5"/><path d="m6 17 7 2 5-4 6 2M11 9l3 7m8-8 1 8" stroke="#74584e"/>',
 freedom:'<path d="m5 17 5-9 12-5 8 4-2 9-11 5-8-1Z" fill="#b8c9aa" stroke="#e2e6c4"/><circle cx="23" cy="10" r="4" fill="#586c66"/><path d="m15 21-9 10m4-5 3 3m-8 0 3 3" stroke="#e5d1a2" stroke-width="3"/>',
 scoutassault:'<path d="m3 13 13 4L8 3l10 7 10-7-9 15 13-5-8 12-7 7-8-7Z" fill="#749b8e" stroke="#d9e9d2"/><path d="m7 28 20-20m-16 20 17-17" stroke="#f1f2db" stroke-width="2"/>',
 titanquake:'<circle cx="17" cy="17" r="13" fill="#99766055" stroke="#dfc99b"/><path d="m6 21 4-11 7-4 8 5 3 13-9 6Z" fill="#c7a98d" stroke="#f0dfb6"/><path d="M3 30l8-7m12 1 8 6M5 4l6 6m12 0 6-6" stroke="#d1c6a5"/>',
 nue:'<path d="m17 26-5-9L2 8l12 4 3-7 3 7 12-4-10 9Z" fill="#9b7e9d" stroke="#dfc8df"/><path d="m17 17-4 7h5l-3 8" stroke="#b6d1f5" stroke-width="2"/><path d="m13 11 4 3 4-3" stroke="#f1e3bc"/>',
 stormnue:'<path d="m17 25-7-8L1 5l13 7 3-9 3 9 13-7-9 12Z" fill="#8876b4" stroke="#dbd1f0"/><path d="m9 21-4 7h5l-2 5m12-14-6 9h6l-2 5m10-12-3 7h5l-1 5" stroke="#b7dcfa"/>',
 wavebeam:'<path d="M2 10h11v16H2Zm10 4h8v8h-8" fill="#8668ae" stroke="#dbc0ee"/><path d="M19 17q4-11 7 0t7 0m-14 0q4 11 7 0t7 0" stroke="#dfb4f4" stroke-width="2"/>',
 icewavebeam:'<path d="M2 10h11v16H2Zm10 4h8v8h-8" fill="#5885a8" stroke="#bfe8f4"/><path d="M19 17h14m-7-8v16m-5-13 10 10m-10 0 10-10" stroke="#e8fcf0" stroke-width="2"/><path d="m4 6 4-4 4 4" stroke="#a1c5ec"/>',
 plasmaicebeam:'<path d="M2 10h11v16H2Zm10 4h8v8h-8" fill="#438e80" stroke="#c8eac6"/><path d="m26 4 4 8 3 5-3 5-4 8-4-8-3-5 3-5Z" fill="#84d4ac" stroke="#d2ffe2"/><path d="M22 17h9m-5-5v10m-3-8 6 6m-6 0 6-6" stroke="#f1ffe6"/>',

 red:'<circle cx="17" cy="17" r="9" fill="#cc6179" stroke="#ffb8c7"/><circle cx="17" cy="17" r="4" fill="#ffe3d9"/><path d="m17 1 0 5m16 11h-5M17 33v-5M1 17h5m-1-12 5 5m19-5-5 5m5 19-5-5M5 29l5-5" stroke="#f79eac"/>',
 shadows:'<path d="m3 25 3-17 8 7 6-6 10 14-6 7H9Z" fill="#62738b" stroke="#c3d6e6"/><path d="m6 8 7 7m8-7 4-4 4 13M10 21h4m7 0h4" stroke="#f5eed5"/>',
 talisman:'<path d="M8 2h19v30H8Z" fill="#688292" stroke="#cfdbc7"/><path d="m13 7 9 5-9 6 9 6-8 4M10 4h15" stroke="#f4e4b5"/>',
 totality:'<path d="m4 25 2-20 11 12L28 5l3 19-14 8Z" fill="#44566d" stroke="#c5d4e1"/><path d="M12 20h3m6 0h3m-7-7v13" stroke="#f4ecce"/><circle cx="17" cy="8" r="4" fill="#bcbdda"/>',
 mahoraga:'<circle cx="17" cy="11" r="8" fill="#a8a585" stroke="#f1e4b3"/><path d="M17 0v22M6 11h22M9 3l16 16M9 19 25 3" stroke="#e2d4a9"/><path d="m9 22 8-5 8 5 2 10H7Z" fill="#9caea6" stroke="#e2ead6"/>',

poison:'<path d="M13 4h8v7l6 9v9H7v-9l6-9Z" fill="#ceecdf" stroke="#355f63"/><path d="M9 21q7-5 16 0v6H9Z" fill="#68b982"/><path d="M12 4h10v4H12Z" fill="#c59365"/><circle cx="17" cy="23" r="2" fill="#f2edb5"/><path d="m26 8 3-3m-2 8 4 1" stroke="#b3dc90"/>',herbs:'<path d="M17 29V10M17 20 9 14m8 3 8-8" stroke="#e1c698" stroke-width="2"/><path d="M16 21Q2 21 5 9q11 0 11 12Z" fill="#6da877" stroke="#c4e1ac"/><path d="M18 16Q16 3 29 5q0 10-11 11Z" fill="#8fc58c" stroke="#dcf2b2"/><path d="m9 27 8-4 9 4-9 5Z" fill="#a47c9c"/>',elixir:'<path d="M12 3h10v9l6 7v11H6V19l6-7Z" fill="#bbdca9" stroke="#fff1c0"/><path d="M9 21h16v7H9Z" fill="#5c9c7d"/><path d="m17 15 2 5 5 2-5 2-2 5-2-5-5-2 5-2Z" fill="#f5df9f"/><path d="M11 3h12v5H11Z" fill="#b68b61"/>'});
Object.assign(artwork,{

 'status-poison':'<path d="M8 7h18v15l-5 4v5h-8v-5l-5-4Z" fill="#93bd75" stroke="#dceeb4"/><path d="M11 13h5v5h-5m8-5h5v5h-5" fill="#324846" stroke="none"/><path d="M15 24h4m-2-4v2" stroke="#314444"/>',
 'status-burning':'<path d="M18 2c4 9-3 11 2 15l5-9c1 8 7 10 4 18C25 36 7 35 5 25 3 17 12 13 11 7l5 9Z" fill="#e58c54" stroke="#ffd6a0"/><path d="M17 17q-8 7-5 12 6 5 11-2-7 1-6-10Z" fill="#ffe2a4" stroke="none"/>',
 'status-cursed':'<path d="m17 3 12 7v14l-12 7-12-7V10Z" fill="#655382" stroke="#d9b8f5"/><path d="m17 7 0 20m-6-15 12 11M23 12 11 23" stroke="#d9b8f5"/><circle cx="17" cy="17" r="3" fill="#f3defe"/>',
 'status-stun':'<path d="m17 2 3 9 10-5-5 10 7 4-11 2-2 10-5-9-11 3 6-9-7-5 11-1Z" fill="#d5ab57" stroke="#ffedb8"/><path d="m19 7-8 12h6l-2 9 9-14h-7Z" fill="#fff2ca" stroke="none"/>',
 'status-slow':'<path d="M7 3h20v5l-7 9 7 9v5H7v-5l7-9-7-9Z" fill="#4d849d" stroke="#b4e3f4"/><path d="M11 7h12l-6 8Zm6 12 7 8H10Z" fill="#b7deed" stroke="none"/>',
 'status-bleeding':'<path d="M17 2C16 12 5 16 6 24c1 12 22 12 22 0 0-8-10-12-11-22Z" fill="#bb647e" stroke="#f5c0c1"/><path d="M11 20q-4 7 4 8" stroke="#ffe0d7" stroke-width="3"/>',
});
Object.assign(artwork,{

 pallet:'<path d="M4 13h19v8H4Zm6-5h11v6H10Z" fill="#737f91" stroke="#d4d8df"/><path d="M23 15h9v4h-9M11 21v8h5v-8" fill="#b1bfc5" stroke="#f1e5bd"/><path d="m3 14-2 9h7v-4m8-9h3" stroke="#c6a2e7"/>',
 atfield:'<path d="m12 3 11 0 9 9v11l-9 9H12l-9-9V12Z" fill="#c89c5c33" stroke="#f6d99a"/><path d="m14 9 7 0 5 5v7l-5 5h-7l-5-5v-7Z" fill="#b5b37a33" stroke="#fff0c2"/><path d="M17 12v11m-5-6h11" stroke="#c1dfa0"/>',
 positron:'<path d="M2 14h19v9H2Zm12-7h7v8h-7Z" fill="#8b789c" stroke="#e2cfec"/><path d="M21 17h11v3H21m-12 3v7h5v-7" stroke="#f3d89f" stroke-width="3"/><path d="m26 7 4-4m-3 7 6-1" stroke="#fff2c4"/>',
 berserk:'<path d="m8 11 8-6 10 6 2 11-7 8H12l-6-8Z" fill="#7d63a5" stroke="#c7b4e3"/><path d="m15 11 5-9-1 12M8 16l7 3m6 0 6-4" stroke="#bade87" stroke-width="3"/><path d="M14 24h8m-7 3h6" stroke="#fff2d3"/>',
 pilot:'<path d="M9 28v-6q8-9 16 0v6Z" fill="#e7eddf" stroke="#a7c1d0"/><path d="M15 21h4v11h-4Z" fill="#5692b5"/><path d="M8 10 12 5h10l5 7-2 8-8 5-8-6Z" fill="#f2d6bd" stroke="#35445c"/><path d="M8 15V8l7-5 10 4 3 9-6-5-4 3-3-4-5 6Z" fill="#29374b" stroke="#4a586b"/><path d="M12 16h3m6 0h3m-8 5h4" stroke="#58718b"/>',
});
Object.assign(artwork,{

 dash:'<path d="m8 5 12 12L8 29m10-24 12 12-12 12" stroke="#cce7f5" stroke-width="3"/><path d="M2 13h6m-7 8h5" stroke="#91b9dd"/>',
 icelance:'<path d="m26 2-7 14-14 15 9-18Z" fill="#c6e9f7" stroke="#ecfbfa"/><path d="m26 2-7 17-5-6Z" fill="#73b4d7" stroke="none"/><path d="m8 24 7 6m10-12 6 2m-3-9 3-3" stroke="#accfe8"/>',
 demonextract:'<path d="M12 4h10v7l5 7v12H7V18l5-7Z" fill="#6b91ba" stroke="#cbe6f2"/><path d="M10 21h14v6H10Z" fill="#b4dce6"/><path d="m17 15 0 11m-4-8 8 5m0-5-8 5" stroke="#f0fbeb"/><path d="M11 3h12v5H11Z" fill="#b8cbd6"/>',
 icecrown:'<path d="m4 8 8 7 5-12 5 12 8-7-4 20H8Z" fill="#729fc3" stroke="#d4eff8"/><path d="m17 10 0 14m-5-10 10 6m0-6-10 6" stroke="#ecfbf6"/>',
 frozen:'<path d="M17 2v30M4 9l26 16M4 25 30 9m-17-3 4 4-4 4-4-4M7 9l1 6-6 1m24 9-1-6 6-1m-18 8 4-4 4 4" stroke="#b3e0f5" stroke-width="2"/>',
 'status-frozen':'<path d="m17 2 13 8v14l-13 8-13-8V10Z" fill="#5e8cba55" stroke="#b5e7f7"/><path d="M17 7v20M8 12l18 10M8 22l18-10m-13-3 4 4 4-4m-8 16 4-4 4 4" stroke="#e1f7fb"/>',
});
Object.assign(artwork,{

 clockshot:'<path d="M3 12h25v5H3Z" fill="#825443" stroke="#d6b687"/><path d="M23 10h8v4h-8m-22 3 6 10h5l-3-10" fill="#a96754" stroke="#f3cb9b"/><path d="M15 17v5q7 4 8-5" stroke="#e5b879"/><path d="M21 8V5h4" stroke="#d4c0a0"/>',
 timepiece:'<circle cx="17" cy="19" r="12" fill="#4c343e" stroke="#e8bd7e" stroke-width="2"/><circle cx="17" cy="19" r="9" stroke="#b87171"/><path d="M17 10v9l5 3M13 3h8v4h-8m4 0v3" stroke="#f4d99b"/><path d="M7 19h2m16 0h2M17 27v2" stroke="#e9c889"/>',
 zafkiel:'<circle cx="17" cy="17" r="13" fill="#703844" stroke="#ebc18b"/><path d="M17 7v10l7 3M5 27 28 5" stroke="#f0d5a4" stroke-width="2"/><path d="M5 10h9m6 14h9" stroke="#e8948c" stroke-width="3"/>',
 clockdomain:'<circle cx="17" cy="17" r="14" fill="#793e5055" stroke="#eac292"/><path d="M17 5v12l8 3M5 17h3m18 0h3M17 26v3" stroke="#f5d49f"/><path d="m5 28 4-9 4 9m8 0 4-9 4 9" stroke="#c67d91" stroke-width="2"/>',
});
Object.assign(artwork,{

 zoltraak:'<path d="M4 27 24 7m-15 22L29 9" stroke="#d1e7cd" stroke-width="3"/><circle cx="24" cy="8" r="5" fill="#f6ebc7" stroke="#789d91"/><path d="m3 19 4 0m19 10 1-5" stroke="#c3ddc5"/>',
 grimoire:'<path d="M7 3h21v28H7Z" fill="#699b91" stroke="#e3d5a3"/><path d="M10 4v26m4-18h10m-5-5v12" stroke="#dfe8c5"/><path d="m19 11 4 5-4 6-4-6Z" fill="#d7c183" stroke="#fff0bd"/>',
 ancientmagic:'<circle cx="17" cy="17" r="13" fill="#729e9055" stroke="#e4dfb9"/><path d="m17 3 12 21H5Zm0 28L5 10h24Z" stroke="#c4e7c8"/><circle cx="17" cy="17" r="4" fill="#f4eabf" stroke="#fff5d6"/>',
 powerbeam:'<path d="M4 11h13v15H4Z" fill="#6c9b85" stroke="#a8e1c0"/><path d="M15 14h10v9H15Z" fill="#41746c" stroke="#a4d4b9"/><path d="M2 14h5v8H2Z" fill="#d4a15d"/><path d="M23 17h9v3h-9" stroke="#f5d998" stroke-width="3"/>',
 energytank:'<path d="M7 5h21v25H7Z" fill="#719fab" stroke="#c7e6e1"/><path d="M10 8h15v6H10Z" fill="#e0d59c"/><path d="M11 18h12m-12 4h9m-9 4h12" stroke="#d4f0dc"/><path d="M3 10h4v15H3Z" fill="#9bbebc"/>',
 plasmabeam:'<path d="M3 12h16v13H3Z" fill="#8c71a5" stroke="#d1bde3"/><path d="M18 15h9v7h-9" fill="#63998e" stroke="#b7ecd0"/><path d="m26 7 3 8 4 3-4 3-3 8-3-8-4-3 4-3Z" fill="#a7ecc9" stroke="#e5ffe3"/>',
 powerbomb:'<circle cx="17" cy="17" r="12" fill="#d89d57" stroke="#f6dca0"/><path d="M7 12h20m-20 9h20M12 6v22m10-22v22" stroke="#625d55"/><circle cx="17" cy="17" r="5" fill="#8ac6a0" stroke="#d4ecc0"/>',
});
const palettes={kamehameha:['#65c2f5','#fff3bd'],purple:['#bc8beb','#f19ac1'],rasen:['#a3e8e0','#e9ffe7'],raijin:['#ffe09e','#b8d2e7'],tempest:['#f3cf71','#c6c9ff'],galaxy:['#a6d8ff','#f0b1df'],spirit:['#8acfea','#fff5ce'],void:['#a4a3e5','#efbcdf'],clone:['#f4a05d','#ffe0a2'],orbit:['#a4d5fa','#f6c8ef'],heal:['#ea8e9b','#edffe0']};

export function icon(id, className='') {
  if(id==='chest')return chestIllustration().replace('class="treasure-illustration ',`class="item-icon illustrated-icon ${className} `).replace('role="img"','aria-hidden="true"');
  const pixel=complexItemIcon(id)||setItemIcon(id)||soulGemIcon(id)||pairedItemIcon(id)||denjiIcon(id)||shiraoriIcon(id)||megumiIcon(id)||erenIcon(id)||evaIcon(id)||maomaoIcon(id)||gojoIcon(id)||madokaIcon(id)||gutsIcon(id)||frierenBarrageIcon(id)||erzaWeaponArt(id)||erzaItemArt(id)||pixelItemArt(id);if(pixel)return `<svg class="item-icon illustrated-icon pixel-item-icon ${className}" data-pixel-icon="${id}" viewBox="0 0 34 34" shape-rendering="crispEdges" stroke="none" aria-hidden="true">${pixel}</svg>`;
  let art=artwork[id];
  if(!art){const colors=palettes[id];let i=0;art=(paths[id]||paths.fusion).replace(/<(path|circle|ellipse) /g,(m,tag)=>{
    if(!colors)return m;
    const color=colors[i++%colors.length];return `<${tag} fill="${tag==='path'?'none':color+'55'}" stroke="${color}" `;
  });}
  const ui=['arrow','pause','fusion'].includes(id);
  return `<svg class="item-icon ${ui?'ui-icon':'illustrated-icon'} ${className}" viewBox="0 0 34 34" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${art}</svg>`;
}
export const SPECIAL_ICONS={shiraori:'queentaratect',denji:'chainsawman',guts:'berserkerarmor',erza:'nakagami',featherine:'lastpage',rimuru:'gluttony',diavolo:'timeerasure',yuki:'blackhole',eren:'titanshift',megumi:'mahoraga',frieren:'golemsummon',samus:'powerbomb',goku:'spirit',gojo:'void',naruto:'clone',madoka:'lawofcycles',maomao:'panaceagarden',shinji:'berserk',esdeath:'frozen',kurumi:'clockdomain'};
