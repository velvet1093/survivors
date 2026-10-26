// Original, bounded scenic layers for the two primal fears. Their transforms
// are driven only by bossIntroState's persisted clock in boss-intro.js.
const rect=(x,y,w,h,color,extra='')=>`<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="${color}" ${extra}/>`;
const path=(d,color,extra='')=>`<path d="${d}" fill="${color}" ${extra}/>`;
const line=(x,y,xx,yy,color,width=1)=>path(`M${x} ${y}L${xx} ${yy}`,'none',`stroke="${color}" stroke-width="${width}"`);
const n=v=>Math.round(v*100)/100;

function astronaut(side,index){
 const scale=n(.24+index*.14),x=500+side*(77+index*44),y=278+index*35;
 const bone='#d4d6ca',light='#eeeede',shade='#818c8b',ink='#222a30';
 const suit=`${path('M-29 -95L-39 -90 -40 -52 -30 -47 -22 -55 -23 -88Z',shade,`stroke="${ink}" stroke-width="3"`)}${rect(-38,-84,8,25,bone)}${line(-34,-86,-34,-61,light,2)}
 ${path('M-19 -99L-10 -106 11 -104 25 -93 24 -62 15 -45 -16 -44 -26 -64Z',bone,`stroke="${ink}" stroke-width="3"`)}
 ${path('M-20 -84L-10 -90 14 -89 19 -72 13 -50 -11 -50 -20 -62Z','#aeb8ae')}${line(-15,-64,16,-64,light,2)}${line(-13,-57,12,-57,shade,2)}
 ${path('M-19 -106Q-24 -128 -9 -138Q10 -149 24 -131L27 -113 19 -101-2 -96Z',bone,`stroke="${ink}" stroke-width="3"`)}
 ${path('M-9 -132Q4 -139 16 -127L19 -114 11 -107 -5 -108 -13 -117Z','#27333a',`stroke="${shade}" stroke-width="2"`)}${path('M-7 -129L6 -132 14 -123 11 -120 -3 -124Z','#718284')}${line(-10,-118,-4,-111,light,2)}${line(-16,-104,14,-99,shade,2)}
 ${path('M-17 -92L-29 -86 -25 -69 -7 -66 17 -78 21 -85 16 -91 5 -83 -13 -77Z',bone,`stroke="${ink}" stroke-width="2.5"`)}
 ${path('M20 -94L26 -98 30 -92 26 -81 20 -77 16 -83Z',light,`stroke="${shade}" stroke-width="2"`)}${line(23,-94,21,-82,shade,1)}${line(26,-93,24,-83,shade,1)}
 ${path('M18 -69L29 -79 28 -95 24 -99 20 -94 19 -84 6 -79Z',bone,`stroke="${ink}" stroke-width="2"`)}${rect(-10,-84,12,12,'#65777a')}${rect(-7,-81,6,6,'#d2be9d')}
 ${path('M-18 -37L5 -38 20 -26 24 -12 15 -4 -5 -8 -19 -21Z',bone,`stroke="${ink}" stroke-width="3"`)}
 ${path('M-16 -31L-3 -31 10 -19 9 -9 -2 -10 -17 -21Z','#adb7ae')}${path('M17 -24L33 -17 39 -6 31 0 12 -4 9 -13Z',bone,`stroke="${ink}" stroke-width="3"`)}
 ${path('M-19 -22L-24 -8 -19 -2 -4 -2 2 -10 -6 -15Z',bone,`stroke="${ink}" stroke-width="3"`)}${line(-20,-6,-5,-5,shade,2)}${line(19,-7,33,-4,shade,2)}
 ${index%2===0?path('M-19 -45L14 -45 15 -37 -18 -37Z',ink):path('M-18 -45H14V-37H-18Z','#566363')}
 ${path('M-28 -78Q-44 -84 -32 -108','none',`stroke="${light}" stroke-width="3"`)}${line(-32,-74,-28,-52,shade,2)}`;
 return `<g class="cinema-astronaut" data-astronaut="${side<0?'left':'right'}-${index}" transform="translate(${x} ${y}) scale(${side<0?scale:-scale} ${scale})">${suit}</g>`;
}
function field(){
 const flowers=Array.from({length:42},(_,i)=>{
  const side=i%2?-1:1,x=500+side*(122+(i*73%391)),y=295+(i*47%255),r=1+i%3;
  return `${line(x,y,x-2,y-9,'#7d8580',1)}${path(`M${x-2} ${y-9}l${-r} ${-r-2} ${r+2} 1 ${r} ${-r} 1 ${r+3} ${r+2} 1 ${-r-3} 2Z`,'#c3c7b5')}`;
 }).join('');
 const grass=Array.from({length:46},(_,i)=>{const x=i*23,y=306+(i*37%244);return path(`M${x} ${y}l-4 -7 5 3 3 -8 1 10 4 -2`,'none','stroke="#747e75" stroke-width="1"');}).join('');
 return `${path('M0 269L99 252 201 263 321 251 415 262 500 252 609 260 737 248 840 262 1000 253V560H0Z','#252d2b')}${path('M0 365Q240 300 500 280Q760 303 1000 365V560H0Z','#35403a')}${path('M434 279H566L620 560H380Z','#151d1b')}${grass}${flowers}`;
}
export function astronautsScene(){
 const rows=[-1,1].map(side=>Array.from({length:7},(_,i)=>astronaut(side,i)).join('')).join('');
 const sword=`<g class="cinema-darkness-sword">${path('M492 18L500 10 508 18 505 67 500 85 495 67Z','#c8cbbd','stroke="#4b5555" stroke-width="2"')}${path('M492 20H508V28H492Z','#eeeede')}${path('M460 28L481 22 492 30 508 30 519 22 540 28 531 38 510 36 500 43 490 36 469 38Z','#a2aaa2','stroke="#4b5555" stroke-width="2"')}${line(500,27,500,73,'#eef0dc',2)}${[-1,1].map(side=>`${line(500+side*24,36,500+side*24,57,'#aab2a7',1)}${path(`M${500+side*24} 56l-4 6 4 4 4 -4Z`,'#d5d9c9')}`).join('')}</g>`;
 return `${rect(0,0,1000,560,'#0a0e12')}${rect(0,245,1000,32,'#121b1d')}${field()}<g class="cinema-astronaut-avenue">${rows}</g><g class="cinema-primordial-void">${path('M500 68Q390 135 425 264L376 495Q500 448 624 495L575 264Q610 135 500 68Z','#05080b')}</g>${sword}<g class="cinema-primal-mist">${path('M0 520Q220 461 405 500T1000 498V560H0Z','#151d1c','opacity=".65"')}</g>`;
}

export function lastSilenceScene(){
 const city=Array.from({length:19},(_,i)=>{
  const x=i*57-35,h=54+i*37%134;
  return `${path(`M${x} -8H${x+43}L${x+52} ${h}H${x+10}Z`,i%2?'#20252b':'#1c2229','stroke="#68706e" stroke-width="1" opacity=".7"')}${Array.from({length:3},(_,j)=>`${rect(x+14,18+j*31,6,12,'#515b5b')}${rect(x+29,18+j*31,6,12,'#343e43')}`).join('')}`;
 }).join('');
 const bells=Array.from({length:5},(_,i)=>{const x=396+i*52,y=83+(i%2)*13;return `${line(x,40,x,y,'#8e9891',2)}${path(`M${x-11} ${y+20}l3 -15 8 -6 8 6 3 15Z`,'#bac1b3','stroke="#4b5557" stroke-width="2"')}${line(x-14,y+21,x+14,y+21,'#dce0ce',2)}${rect(x-2,y+21,4,7,'#dce0ce')}`;}).join('');
 const folds=Array.from({length:8},(_,i)=>path(`M${246+i*29} 2Q${270+i*22} 204 ${260+i*28} 554`,'none','stroke="#929f9a" stroke-width="2" opacity=".3"')).join('');
 const left=`${path('M190 -8H501V560H216Q253 442 221 317T190 -8Z','#c7d0c3','opacity=".25"')}${folds}${path('M491 0Q476 232 491 560','none','stroke="#e4e6d4" stroke-width="3" opacity=".5"')}`;
 return `${rect(0,0,1000,560,'#11161c')}<g class="cinema-inverted-city">${city}</g>${path('M0 474L136 455 312 472 500 457 685 468 862 449 1000 471V560H0Z','#303b36')}${path('M454 273H546L602 560H398Z','#0c1116')}<g class="cinema-funeral-bells">${bells}</g><g class="cinema-white-curtain left">${left}</g><g transform="translate(1000 0) scale(-1 1)"><g class="cinema-white-curtain right">${left}</g></g><g class="cinema-last-silence-rays">${[-1,1].map(side=>[0,1,2,3].map(i=>line(500+side*(45+i*6),190+i*49,500+side*(191+i*52),130+i*110,'#9da99d55',2)).join('')).join('')}</g>`;
}
