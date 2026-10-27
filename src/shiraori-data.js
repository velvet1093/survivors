// Shiraori from "So I'm a Spider, So What?": a spider summoner. Her Spider Brood
// hatches spiderlings that hunt the nearest enemies with venomous bites, and
// Parallel Minds splits her focus to hatch more of them at once.
export const SHIRAORI_CHARACTER={
 id:'shiraori',name:'Shiraori',fullName:'Shiraori (Kumoko)',title:'THE SPIDER GOD',series:'SO I’M A SPIDER, SO WHAT?',color:'#e6e0ee',
 weapon:'spiderbrood',passive:'parallelminds',skill:'Queen Taratect',
 description:'Hatch a brood of spiderlings that skitter after the nearest enemies and poison them with every bite. Bites and kills fill the Egg Sac; when it bursts, a second wave of spiderlings joins the hunt. Call the Queen Taratect to crush the horde beside you.',
 power:4,speed:4,range:4,hp:100,move:230,
};
export const SHIRAORI_ITEMS={
 spiderbrood:{name:'Spider Brood',type:'weapon',color:'#e2d8ea',owner:'Shiraori',max:5,description:'Hatch spiderlings that skitter to the nearest enemies and bite them, applying poison. Ranks hatch more spiderlings, keep them alive longer and strengthen their bites. Shiraori’s bites and kills fill her Egg Sac.',scaling:'+1 spiderling at ranks 2 and 4, + bite damage and lifetime'},
 parallelminds:{name:'Parallel Minds',type:'passive',color:'#c9a8d8',owner:'Shiraori',max:3,description:'+4% weapon damage and −3% weapon and ultimate cooldowns per rank. Shiraori hatches one more spiderling per rank. Combine with a maxed Spider Brood for the Arch Taratect Brood evolution.',scaling:'+4% damage, −3% cooldown and Shiraori +1 spiderling per rank'},
};
export const SHIRAORI_FUSIONS=[{
 id:'archtaratect',name:'Arch Taratect Brood',weapon:'spiderbrood',passive:'parallelminds',color:'#f0e6f4',
 description:'Spider Brood + Parallel Minds → hatch larger Arch Taratects whose bites splash poison onto the three enemies nearest their prey and spin webs that slow them. Shiraori keeps her Egg Sac.',
}];
