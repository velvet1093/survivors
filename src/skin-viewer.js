import {characterPixels,pilotPixels,pixelsSvg} from './pixel-characters.js';
import {SKINS,skinFor} from './skins.js';

// Full-screen outfit browser: swipe or step through a hero's skins, play their idle,
// walk, attack and ultimate frames, change the backdrop and zoom, and equip one.
// Nothing is saved until EQUIP is pressed.
const POSES=[['idle','IDLE'],['walk','WALK'],['attack','ATTACK'],['ultimate','ULTIMATE']];
const BACKDROPS=[['night','NIGHT'],['field','FIELD'],['studio','STUDIO']];
const ZOOMS=[['s','S'],['m','M'],['l','L']];
const prefs={pose:'idle',backdrop:'night',zoom:'m'};
const esc=s=>String(s??'').replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'})[c]);

function poseOptions(hero,pose,tick){
 const o={form:hero.id==='erza'?3:0};
 if(pose==='walk')return {...o,moving:true,frame:tick%4};
 if(pose==='attack')return {...o,attack:true,frame:tick%4,expression:'focused'};
 if(pose==='ultimate')return {...o,attack:true,pose:'ultimate',expression:'ultimate',frame:tick%4};
 return {...o,pose:hero.id==='gojo'?'domain':'',blink:tick%14===13};
}
export function skinFrame(hero,skinId,pose='idle',tick=0){
 const o={...poseOptions(hero,pose,tick),skin:skinId};
 // Shinji's portrait shows the pilot beside the Evangelion unit, as on the select screen.
 const body=hero.id==='shinji'?`<g transform="translate(10 -2) scale(.95)">${pixelsSvg(characterPixels('shinji',o))}</g><g transform="translate(-6 30) scale(.62)">${pixelsSvg(pilotPixels({skin:skinId,blink:o.blink}))}</g>`:pixelsSvg(characterPixels(hero.id,o));
 return `<svg viewBox="0 0 56 76" shape-rendering="crispEdges" aria-hidden="true">${body}</svg>`;
}
export function showSkinViewer(host,{hero,profile,startId,reducedMotion=false,onEquip,onClose}){
 const skins=SKINS[hero.id];let index=Math.max(0,skins.findIndex(s=>s.id===(startId||skinFor(hero.id,profile.skins[hero.id]).id))),tick=0,timer=null,changed=false;
 const equipped=()=>skinFor(hero.id,profile.skins[hero.id]).id;
 const stage=()=>host.querySelector('.skin-viewer-sprite');
 const drawSprite=()=>{const el=stage();if(el)el.innerHTML=skinFrame(hero,skins[index].id,prefs.pose,tick);};
 const seg=(name,list,value)=>`<div class="skin-viewer-seg" role="group" aria-label="${name}">${list.map(([id,label])=>`<button type="button" data-${name}="${id}" aria-pressed="${value===id}">${label}</button>`).join('')}</div>`;
 const render=()=>{
  const skin=skins[index],isOn=equipped()===skin.id;
  host.innerHTML=`<div class="modal-backdrop skin-viewer-backdrop"><section class="modal skin-viewer" role="dialog" aria-modal="true" aria-labelledby="skin-viewer-title" style="--accent:${hero.color}">
  <div class="skin-viewer-heading"><div><span class="eyebrow">${esc(hero.name.toUpperCase())} · OUTFIT ${index+1} / ${skins.length}</span><h2 id="skin-viewer-title">${esc(skin.name)}</h2>${skin.pilot||skin.unit?`<p>${esc([skin.pilot,skin.unit].filter(Boolean).join(' · '))}</p>`:''}</div><button class="icon-button" id="close-skin-viewer" aria-label="Close outfit viewer">×</button></div>
  <div class="skin-viewer-stage" data-backdrop="${prefs.backdrop}" data-zoom="${prefs.zoom}"><button class="skin-viewer-step" id="skin-prev" aria-label="Previous outfit">‹</button><div class="skin-viewer-sprite" role="img" aria-label="${esc(skin.name)}, ${prefs.pose} animation"></div><button class="skin-viewer-step" id="skin-next" aria-label="Next outfit">›</button>${isOn?'<span class="skin-viewer-equipped">EQUIPPED</span>':''}<span class="skin-viewer-swipe" aria-hidden="true">SWIPE TO BROWSE</span></div>
  <div class="skin-viewer-controls">${seg('pose',POSES,prefs.pose)}${seg('backdrop',BACKDROPS,prefs.backdrop)}${seg('zoom',ZOOMS,prefs.zoom)}</div>
  <div class="skin-viewer-thumbs" role="listbox" aria-label="Outfits">${skins.map((s,i)=>`<button type="button" role="option" data-skin-view="${i}" aria-selected="${i===index}" class="${i===index?'active':''} ${equipped()===s.id?'equipped':''}" title="${esc(s.name)}">${skinFrame(hero,s.id,'idle',0)}<span>${esc(s.name)}</span></button>`).join('')}</div>
  <div class="skin-viewer-actions"><button class="primary" id="equip-skin" ${isOn?'disabled':''}>${isOn?'EQUIPPED ✓':'EQUIP THIS OUTFIT'}</button><small>Cosmetic only · same skills, stats and mastery</small></div>
  </section></div>`;
  drawSprite();bind();
  host.querySelector('.skin-viewer-thumbs .active')?.scrollIntoView({block:'nearest',inline:'center'});
 };
 const go=step=>{index=(index+step+skins.length)%skins.length;tick=0;render();host.querySelector(step<0?'#skin-prev':'#skin-next')?.focus({preventScroll:true});};
 const close=()=>{clearInterval(timer);document.removeEventListener('keydown',keys,true);host.innerHTML='';onClose?.(changed);};
 const keys=e=>{if(!host.querySelector('.skin-viewer'))return;if(e.key==='Escape'){e.preventDefault();e.stopImmediatePropagation();close();}else if(e.key==='ArrowLeft'){e.preventDefault();go(-1);}else if(e.key==='ArrowRight'){e.preventDefault();go(1);}};
 function bind(){
  host.querySelector('#close-skin-viewer').onclick=close;host.querySelector('.skin-viewer-backdrop').onclick=e=>{if(e.target===e.currentTarget)close();};
  host.querySelector('#skin-prev').onclick=()=>go(-1);host.querySelector('#skin-next').onclick=()=>go(1);
  host.querySelectorAll('[data-skin-view]').forEach(b=>b.onclick=()=>{index=+b.dataset.skinView;tick=0;render();});
  for(const [name]of [['pose'],['backdrop'],['zoom']])host.querySelectorAll(`[data-${name}]`).forEach(b=>b.onclick=()=>{prefs[name]=b.dataset[name];tick=0;render();});
  host.querySelector('#equip-skin').onclick=()=>{onEquip?.(skins[index].id);changed=true;render();host.querySelector('#equip-skin').focus({preventScroll:true});};
  // Horizontal swipes on the stage step through outfits.
  const el=host.querySelector('.skin-viewer-stage');let start=null;
  el.onpointerdown=e=>{start={x:e.clientX,y:e.clientY};};
  el.onpointerup=e=>{if(!start)return;const dx=e.clientX-start.x,dy=e.clientY-start.y;start=null;if(Math.abs(dx)>40&&Math.abs(dx)>Math.abs(dy)*1.3)go(dx<0?1:-1);};
  el.onpointercancel=()=>{start=null;};
 }
 document.addEventListener('keydown',keys,true);
 render();host.querySelector('#equip-skin:not([disabled]),#skin-next')?.focus({preventScroll:true});
 // Animation: a gentle 6 fps loop; reduced motion holds still unless a pose is chosen.
 if(!reducedMotion)timer=setInterval(()=>{if(!host.querySelector('.skin-viewer')){clearInterval(timer);return;}tick++;drawSprite();},165);
 return {close};
}
