export const XP_GEMS=[
 {id:'jade',name:'Jade shard',value:1,color:'#88e1b5',shade:'#397f72',light:'#d9ffe2',size:4},
 {id:'azure',name:'Azure crystal',value:3,color:'#83c9fa',shade:'#405c9f',light:'#e0f4ff',size:5},
 {id:'amethyst',name:'Amethyst prism',value:10,color:'#c59bed',shade:'#705399',light:'#f2e0ff',size:6},
 {id:'amber',name:'Amber star',value:25,color:'#f2d180',shade:'#a7744c',light:'#fff2cd',size:7},
 {id:'ruby',name:'Crimson core',value:50,color:'#ee8f9b',shade:'#9c496d',light:'#ffe2da',size:8},
];
export function gemTier(value){return [...XP_GEMS].reverse().find(t=>value>=t.value)||XP_GEMS[0];}
export function enemyXpValue(enemy,wave=1,random=Math.random){
 if(enemy.boss)return wave>=10?50:25;
 if(enemy.elite)return random()<.2?25:10;
 const roll=random();return roll<.78?1:roll<.98?3:10;
}
export function makeGem(x,y,value,phase=Math.random()*Math.PI*2){return {x,y,value,phase,tier:gemTier(value).id};}
