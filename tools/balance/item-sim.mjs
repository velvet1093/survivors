// Item balance harness. Each weapon (or passive) is equipped alone at max rank on a
// neutral hero, levels are frozen, the bot kites with HP topped up, and we record
// damage dealt, kills, raw damage taken and XP collected.
// usage: node item-sim.mjs weapons|passives <runs> <seconds> [ids,..|all] [shard/of]
const src=new URL('../../src',import.meta.url).href;
const [kind='weapons',runsArg='3',secArg='180',only='',shard='0/1']=process.argv.slice(2);
const E=await import(src+'/engine.js');const G=await import(src+'/game.js');
const {steerBot,settleBot}=await import('./bot.mjs');
function seed(n){let s=n>>>0||1;return ()=>{s^=s<<13;s>>>=0;s^=s>>17;s^=s<<5;s>>>=0;return s/4294967296;};}
const NEUTRAL='maomao',BASE_WEAPON='rasengan';
const heroById=id=>G.CHARACTERS.find(c=>c.id===id);
const ownerHero=item=>G.CHARACTERS.find(c=>c.name===item?.owner);
function equip(p,id){const item=G.ITEMS[id];(item.type==='weapon'?p.weapons:p.passives)[id]=item.max;}
// Equip a fusion's ingredients (recursively satisfying evolution prerequisites) and fuse.
function fuse(p,f,depth=0){
 if(depth>3)return false;
 if(f.requiresEvolution){const pre=G.FUSIONS.find(x=>x.id===f.requiresEvolution);if(pre&&p.fusions[G.fusionBase(pre)]!==pre.id&&!fuse(p,pre,depth+1))return false;}
 for(const id of G.fusionIngredients(f)){const item=G.ITEMS[id];if(!item)continue;if(item.fusionOnly){const maker=G.FUSIONS.find(x=>x.resultItem===id);if(maker&&!(p.passives[id]>=item.max))fuse(p,maker,depth+1);continue;}if(!(item.type==='weapon'?p.weapons:p.passives)[id])equip(p,id);}
 G.refreshStats(p);return G.applyChoice(p,{kind:'fusion',id:f.id});
}
function entries(){
 const type=kind==='weapons'?'weapon':'passive';
 const base=Object.entries(G.ITEMS).filter(([,i])=>i.type===type&&!i.fusionOnly).map(([id,i])=>({id,item:i,fusion:null}));
 const fus=G.FUSIONS.filter(f=>G.fusionType(f)===type).map(f=>({id:f.id,item:G.ITEMS[G.fusionBase(f)],fusion:f}));
 let list=[...(type==='passive'?[{id:'__baseline',item:null,fusion:null}]:[]),...base,...fus];
 if(only&&only!=='all')list=list.filter(e=>only.split(',').includes(e.id));
 const [k,n]=shard.split('/').map(Number);return list.filter((_,i)=>i%n===k);
}
const TITAN=new Set(['titanfists','titanquake']);
function setup(entry,asOwner=false){
 const ownerOf=ownerHero(entry.item)||ownerHero(G.ITEMS[entry.fusion?.ingredients?.[0]]);
 const owner=entry.fusion?.requiredCharacter?heroById(entry.fusion.requiredCharacter):TITAN.has(entry.id)?heroById('eren'):asOwner?ownerOf:null;
 let hero=owner||heroById(NEUTRAL);
 const tryBuild=h=>{const g=E.createRun(h,0);const p=g.p;p.weapons={};p.passives={};p.fusions={};p.cooldowns={};if(TITAN.has(entry.id)){p.erenForm='titan';p.form=1;p.formWeapon='titanfists';p.weapon='titanfists';}
  if(kind==='passives')equip(p,BASE_WEAPON);
  let ok=true;if(entry.id!=='__baseline'){if(entry.fusion)ok=fuse(p,entry.fusion);else{if(G.forbiddenItem(p,entry.id))ok=false;else equip(p,entry.id);}}
  G.refreshStats(p);p.hp=p.maxHp;return ok?g:null;};
 let g=tryBuild(hero);
 if(!g){const o=ownerHero(entry.item)||ownerHero(G.ITEMS[entry.fusion?.ingredients?.[0]]);if(o){hero=o;g=tryBuild(o);}}
 if(!g)for(const h of G.CHARACTERS){g=tryBuild(h);if(g){hero=h;break;}}
 return {g,hero};
}
const out=[];
const jobs=[];for(const entry of entries()){jobs.push([entry,false]);const o=ownerHero(entry.item);if(o&&o.id!==NEUTRAL&&!TITAN.has(entry.id)&&!entry.fusion?.requiredCharacter&&entry.id!=='__baseline')jobs.push([entry,true]);}
for(const [entry,asOwner] of jobs){
 const rows=[];let hero=null;
 for(let k=0;k<+runsArg;k++){
  const rand=seed(500+k*104729),orig=Math.random;Math.random=rand;
  const built=setup(entry,asOwner);hero=built.hero;const g=built.g;if(!g){Math.random=orig;break;}
  g.chestRandom=rand;g.noLevels=true;
  const hp=new Map();let dealt=0,taken=0,xp=0,t=0,dt=1/30;const lv=g.p.level;
  while(t<+secArg&&g.status!=='over'){
   settleBot(g,rand,{freeze:true});
   const s=steerBot(g,t);if((s.closest<30||s.hazard)&&g.dashCD<=0)E.useDash(g,s);
   for(const e of g.enemies)hp.set(e,e.hp);
   const before=g.p.hp+(g.p.shield||0),xp0=g.p.xp+g.p.level*1e6;
   E.updateRun(g,dt,s);t+=dt;
   for(const [e,h]of hp){const now=g.enemies.includes(e)?Math.max(0,e.hp):0;if(now<h)dealt+=h-now;}hp.clear();
   const after=g.p.hp+(g.p.shield||0);if(after<before)taken+=before-after;
   const xp1=g.p.xp+g.p.level*1e6;if(xp1>xp0)xp+=xp1-xp0;
   // Keep the bot alive and the build frozen so only the item varies.
   g.p.hp=g.p.maxHp;g.p.level=lv;g.p.xp=0;
  }
  Math.random=orig;rows.push({dealt,taken,xp,kills:g.kills});
 }
 if(!rows.length){console.log(JSON.stringify({id:entry.id,error:'could not equip'}));continue;}
 const avg=f=>rows.reduce((a,r)=>a+r[f],0)/rows.length;
 const res={id:entry.id,style:process.env.BOT_STYLE||'kite',owner:asOwner,hero:hero.id,dps:+(avg('dealt')/+secArg).toFixed(1),kills:+avg('kills').toFixed(0),takenPerMin:+(avg('taken')/+secArg*60).toFixed(1),xp:+avg('xp').toFixed(0)};
 out.push(res);console.log(JSON.stringify(res));
}
const fs=await import('fs');fs.writeFileSync(new URL(`./results/item-${kind}${process.env.BOT_STYLE==='close'?'-close':''}-${shard.replace('/','of')}.json`,import.meta.url),JSON.stringify(out,null,1));
