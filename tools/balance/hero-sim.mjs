// Hero balance harness that is robust to bot skill: the bot plays Normal Survival with
// natural levelling and engages bosses, but its HP is refilled every tick. We record
// offense (damage dealt, kills, level) and how much damage gets through the hero's own
// defences (shields, dodge, Infinity, regen), from which we derive survivability.
// usage: node hero-sim.mjs <heroIds|all> <runs> <seconds> <tag>
const [which='all',runsArg='4',secArg='600',tag='h']=process.argv.slice(2);
const src=new URL('../../src',import.meta.url).href;
const E=await import(src+'/engine.js');const G=await import(src+'/game.js');
const {steerBot,settleBot}=await import('./bot.mjs');
const {switchErzaForm}=await import(src+'/erza.js');
// Hero-specific play: Erza holds one armor (ERZA_FORM index), Eren shifts to Titan once and stays.
const ERZA_FORM=process.env.ERZA_FORM===undefined?null:+process.env.ERZA_FORM;
function seed(n){let s=n>>>0||1;return ()=>{s^=s<<13;s>>>=0;s^=s>>17;s^=s<<5;s>>>=0;return s/4294967296;};}
const heroes=which==='all'?G.CHARACTERS:G.CHARACTERS.filter(c=>which.split(',').includes(c.id));
const out=[];
for(const hero of heroes){
 const rows=[];
 for(let k=0;k<+runsArg;k++){
  const rand=seed(2000+k*7919),orig=Math.random;Math.random=rand;
  const g=E.createRun(hero,k%G.MAPS.length);g.chestRandom=rand;
  const hp=new Map();let dealt=0,taken=0,lateTaken=0,t=0,bossTime=0,ults=0;const dt=1/30,T=+secArg,late=T*.5;let hpSum=0,regenSum=0,n=0;
  while(t<T&&g.status!=='over'){
   settleBot(g,rand);if(g.status==='over')break;
   const s=steerBot(g,t);if((s.closest<30||s.hazard)&&g.dashCD<=0)E.useDash(g,s);
   if(ERZA_FORM!==null&&g.p.id==='erza'&&g.mechanic?.form!==ERZA_FORM)switchErzaForm(g,ERZA_FORM);
   if(g.special<=0&&!(g.p.id==='eren'&&g.p.erenForm==='titan')&&(s.near>=12||g.enemies.some(e=>e.boss&&Math.hypot(e.x-g.p.x,e.y-g.p.y)<320))){if(E.useSpecial(g))ults++;}
   for(const e of g.enemies)hp.set(e,e.hp);
   const before=g.p.hp+(g.p.shield||0);
   E.updateRun(g,dt,s);t+=dt;
   for(const [e,h]of hp){const now=g.enemies.includes(e)?Math.max(0,e.hp):0;if(now<h)dealt+=h-now;}hp.clear();
   const after=g.p.hp+(g.p.shield||0),loss=Math.max(0,before-after);taken+=loss;if(t>=late)lateTaken+=loss;
   if(g.enemies.some(e=>e.boss))bossTime+=dt;
   if(t>=late){hpSum+=g.p.maxHp+(g.p.maxShield||0);regenSum+=g.p.regen||0;n++;}
   // Refill so the run continues; a death here means the hero was one-shot or the run ended.
   if(g.status==='over'){g.status='playing';}
   g.p.hp=g.p.maxHp;
  }
  Math.random=orig;
  const lateMin=(T-late)/60,netPerMin=Math.max(1,lateTaken/lateMin-(regenSum/Math.max(1,n))*60),ehp=hpSum/Math.max(1,n);
  rows.push({dealt:Math.round(dealt),kills:g.kills,level:g.p.level,takenPerMin:+(taken/(T/60)).toFixed(1),lateTakenPerMin:+(lateTaken/lateMin).toFixed(1),ehp:Math.round(ehp),regenPerMin:+((regenSum/Math.max(1,n))*60).toFixed(1),pressure:+((lateTaken/lateMin)/(ehp+(regenSum/Math.max(1,n))*60)).toFixed(3),bossShare:+(bossTime/T).toFixed(2),ults,fusions:Object.keys(g.p.fusions||{}).length});
 }
 const med=f=>{const v=rows.map(r=>r[f]).sort((a,b)=>a-b);return v.length%2?v[(v.length-1)/2]:(v[v.length/2-1]+v[v.length/2])/2;};
 const res={id:hero.id,style:process.env.BOT_STYLE||'kite',dps:+(med('dealt')/+secArg).toFixed(1),kills:med('kills'),level:med('level'),lateTakenPerMin:med('lateTakenPerMin'),ehp:med('ehp'),regenPerMin:med('regenPerMin'),pressure:med('pressure'),fusions:med('fusions'),rows};
 out.push(res);console.log(JSON.stringify({...res,rows:undefined}));
}
const fs=await import('fs');fs.writeFileSync(new URL(`./results/hero-${tag}.json`,import.meta.url),JSON.stringify(out,null,1));
