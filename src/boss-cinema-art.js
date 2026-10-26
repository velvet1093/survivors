import {astronautsScene,lastSilenceScene} from './primal-cinema-art.js';
// Original scenic SVG layers for boss introductions. All movement is controlled
// by the introduction's simulation clock in boss-intro.js, never CSS keyframes.
const rect=(x,y,w,h,fill,extra='')=>`<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="${fill}" ${extra}/>`;
const path=(d,fill,extra='')=>`<path d="${d}" fill="${fill}" ${extra}/>`;
const group=(name,content,extra='')=>`<g class="${name}" ${extra}>${content}</g>`;
const line=(x1,y1,x2,y2,color,width=2)=>`<path d="M${x1} ${y1}L${x2} ${y2}" fill="none" stroke="${color}" stroke-width="${width}"/>`;
const TAU=Math.PI*2;
const n=x=>Math.round(x*100)/100;
function spokes(cx,cy,r,count,color,width=2,inner=.8){return Array.from({length:count},(_,i)=>{const a=i*TAU/count;return line(n(cx+Math.cos(a)*r*inner),n(cy+Math.sin(a)*r*inner),n(cx+Math.cos(a)*r),n(cy+Math.sin(a)*r),color,i%5?width:width*2);}).join('');}
function circle(cx,cy,r,color,width=2,extra=''){return `<circle cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="${color}" stroke-width="${width}" ${extra}/>`;}
function skyline(){return group('cinema-city',Array.from({length:14},(_,i)=>{const x=i*77-25,h=45+(i*31%83);return `${rect(x,560-h,64,h,'#111620')}${rect(x+8,565-h,48,5,'#39404a')}${rect(x+12,582-h,7,13,'#566170')}${rect(x+33,582-h,7,13,'#343e4c')}`;}).join(''));}
function particles(color='#c6b69b'){
 return group('cinema-dust',Array.from({length:26},(_,i)=>{const x=30+i*37,y=310+(i*43%220),w=4+i%4*3;return rect(x,y,w,w,color,`opacity="${.18+i%4*.1}" transform="rotate(${i%3*22} ${x} ${y})"`);}).join(''));
}
function rings(color='#d9c28a',cx=325,cy=270){return [0,1,2].map((i)=>group('cinema-shock-ring',`<ellipse cx="${cx}" cy="${cy}" rx="${95+i*65}" ry="${50+i*40}" fill="none" stroke="${color}" stroke-width="${5-i}"/>`,`data-ring="${i}"`)).join('');}
function titan(intro){
 const armored=intro.archetype==='reiner',colossal=intro.archetype==='bertholdt';
 const bone=armored?'#d6c08a':colossal?'#b6655e':'#e8c7aa',shadow=armored?'#8b7055':'#803e44',light=armored?'#f3e1b4':'#e59e89',muscle='#914a4c';
 // Close-up Titan portrait, native-sized clusters enlarged with crisp edges.
 const head=`<g class="cinema-titan-portrait" transform="translate(101 4) scale(8)">
 ${path('M20 6H32L38 12V29L33 38H20L14 30V15Z','#2b2630')}
 ${path('M20 7H31L36 13V27L32 34H22L17 28V15Z',muscle)}
 ${path('M19 8L24 6 27 10 24 16 17 17 16 13Z',bone)}
 ${path('M29 10L32 7 37 13 36 19 30 17Z',bone)}
 ${path('M17 18L23 17 25 22 21 27 17 25Z',bone)}
 ${path('M30 18L37 20 35 26 30 25 28 22Z',bone)}
 ${path('M26 12L28 12 29 25 26 27 24 25Z',light)}
 ${line(18,17,24,18,'#342f31',2)}${line(30,18,35,16,'#342f31',2)}
 ${rect(20,18,3,1,'#fae594')}${rect(31,18,3,1,'#fae594')}${rect(22,18,1,1,'#fff7c4')}${rect(31,18,1,1,'#fff7c4')}
 ${line(18,21,21,24,shadow,1)}${line(34,21,31,25,shadow,1)}
 ${path('M21 26L26 28 32 26 34 28 32 33 22 34 19 30Z','#261e27','class="cinema-titan-mouth" style="transform-origin:27px 27px"')}
 ${rect(22,27,10,2,light)}${rect(23,29,1,2,light)}${rect(26,29,1,2,light)}${rect(29,29,1,2,light)}
 <g class="cinema-titan-jaw">${path('M19 31L23 34 31 33 35 29 33 36 28 40 22 37Z',shadow)}${path('M21 32L25 35 31 34 33 32 31 37 27 39 23 36Z',bone)}${rect(23,32,8,2,light)}${line(25,35,29,35,light,1)}</g>
 ${path('M18 10L18 6 22 3 31 3 36 7 38 13 33 10 29 7 27 11 24 7 20 13Z',armored?'#c8c7b0':muscle)}
 ${armored?[20,24,28,32,35].map(x=>line(x,6,x-2,11,'#f4edcf',1)).join(''):''}
 ${path('M17 34L22 37 28 42 33 37 37 33 41 43 45 49H8L12 42Z',muscle)}
 ${path('M10 42L17 36 21 41 22 47 10 48Z',bone)}${path('M34 40L38 35 43 41 45 48 33 46Z',bone)}${line(12,42,17,40,light,2)}${line(36,40,41,43,light,2)}
 ${line(26,41,26,49,shadow,2)}${line(29,41,30,49,light,1)}
 </g>`;
 const steam=group('cinema-steam',[-1,1].map(side=>`<g transform="translate(${325+side*105} 310)">${path(`M0 100Q${side*55} 55 0 16T${side*20} -105`,'none',`stroke="#e9e2ce" stroke-width="24" opacity=".17"`)}${path(`M${side*40} 110Q${side*85} 40 ${side*35} -15T${side*70} -130`,'none',`stroke="#f5efd9" stroke-width="13" opacity=".15"`)}</g>`).join(''));
 return `${skyline()}${head}${steam}${rings('#e9d6a4',325,265)}${particles('#e3c79d')}${group('cinema-titan-speed',Array.from({length:18},(_,i)=>{const a=i*TAU/18;return line(n(325+Math.cos(a)*210),n(265+Math.sin(a)*170),n(325+Math.cos(a)*360),n(265+Math.sin(a)*290),'#c7ad7866',2+i%3);}).join(''))}`;
}
function stand(){
 return `<g class="cinema-stand" transform="translate(65 72) scale(6)" opacity=".88">
 ${path('M20 5H31L36 12V23L31 29H20L15 22V12Z','#514c40')}${path('M20 7H30L33 12V21L29 26H22L18 21V12Z','#baa66a')}
 ${path('M18 10H33V16L29 18H22L17 15Z','#e6ce8c')}${rect(18,16,7,3,'#3b3b3c')}${rect(28,16,6,3,'#3b3b3c')}${rect(20,17,3,1,'#eac865')}${rect(29,17,3,1,'#eac865')}${rect(23,22,6,1,'#f5e2ac')}
 ${path('M14 28L20 26 27 29 33 25 39 30 43 43 36 52 17 52 9 43Z','#645c43')}${path('M15 31L22 29 27 34 31 29 38 32 37 43 32 49 22 48 14 41Z','#cbb471')}
 ${path('M21 30L27 34 32 30 31 42 27 45 23 41Z','#e4d39b')}${line(18,36,23,39,'#f2dfaa',2)}${line(31,39,36,36,'#f2dfaa',2)}
 ${path('M9 29L15 29 17 36 13 43 5 40 2 34Z','#a6925e')}${path('M36 29L43 29 48 35 46 43 39 42 35 35Z','#b6a066')}${rect(4,41,8,13,'#8d8057')}${rect(39,42,8,13,'#8d8057')}${rect(5,42,3,10,'#d9c58a')}${rect(40,43,3,10,'#dcc98c')}
 ${path('M19 50L26 51 26 66 22 74 16 74 15 67Z','#a49360')}${path('M28 51L35 50 38 65 36 74 30 74 27 65Z','#bcaa70')}${rect(16,71,10,4,'#d1bf85')}${rect(29,71,11,4,'#d1bf85')}
 ${path('M13 15L17 10 18 25 15 26Z','#dfc979')}${path('M33 10L37 14 36 26 32 24Z','#d6c083')}
 </g>`;
}
function time(){
 const cx=337,cy=275;
 const clock=`${group('cinema-time-ring',`${circle(cx,cy,226,'#bfa35a',3)}${circle(cx,cy,213,'#f5dd9a',1)}${circle(cx,cy,176,'#b7a67466',8)}${spokes(cx,cy,201,60,'#e1c574',2,.95)}${spokes(cx,cy,193,12,'#f9e2a0',4,.88)}`)}${group('cinema-clock-hands',`${line(cx,cy,cx-56,cy-113,'#f4e5b8',7)}${line(cx,cy,cx+132,cy-23,'#d9c075',5)}${circle(cx,cy,9,'#f3e5b8',4)}`,`style="transform-origin:${cx}px ${cy}px"`)}`;
 const knives=group('cinema-knives',Array.from({length:13},(_,i)=>{const angle=i*TAU/13,x=n(cx+Math.cos(angle)*250),y=n(cy+Math.sin(angle)*205);return `<g transform="translate(${x} ${y}) rotate(${n(angle*180/Math.PI+180)})">${path('M-4 -5H16L40 0 16 5H-4Z','#b9cbd0')}${line(0,0,33,0,'#f1f0d9',2)}${rect(-10,-8,4,16,'#e1c385')}${rect(-28,-3,18,6,'#564c4c')}${rect(-27,-2,3,4,'#9b8463')}</g>`;}).join(''));
 return `${skyline()}${clock}${stand()}${knives}${group('cinema-time-cracks',path('M337 50L350 104 329 145 350 190 337 230M110 300L170 277 208 291 245 275M337 305L364 350 345 390 365 427 337 505M380 275L435 258 474 288 523 270 575 289','none','stroke="#e7d59366" stroke-width="2"'))}`;
}
function illusion(){
 const eye=`${path('M70 270Q305 60 540 270Q305 470 70 270Z','#3e1f32','stroke="#b85a62" stroke-width="3"')}${path('M91 270Q305 110 519 270Q305 429 91 270Z','#d7b8ab','opacity=".42"')}${circle(305,270,100,'#cb5b68',30)}${circle(305,270,74,'#2c1a2b',5)}${circle(305,270,24,'#1b1828',25)}${[0,1,2].map(i=>`<g transform="rotate(${i*120} 305 270)">${path('M305 183Q339 194 325 218Q304 231 296 209Q306 207 305 183Z','#201b2b')}</g>`).join('')}`;
 const crows=group('cinema-crows',Array.from({length:11},(_,i)=>{const x=35+i*57,y=55+i*43%360;return `<g transform="translate(${x} ${y}) scale(${.65+i%3*.25})">${path('M0 0L-24 -18 -12 -18 -7 -34 2 -9 23 -29 17 -9 35 -10 13 4 6 15 -3 5Z','#121726')}${rect(4,-3,3,2,'#d98086')}</g>`;}).join(''));
 return `${group('cinema-orbit',eye,'style="transform-origin:305px 270px"')}${crows}${particles('#a57580')}`;
}
function cero(){
 const a=group('cinema-power',`${circle(313,270,70,'#9ed8b5',6)}${circle(313,270,45,'#d5efb5',10)}${circle(313,270,18,'#e8ffd4',25)}${Array.from({length:12},(_,i)=>{const angle=i*TAU/12;return line(n(313+Math.cos(angle)*85),n(270+Math.sin(angle)*85),n(313+Math.cos(angle)*230),n(270+Math.sin(angle)*195),'#91d0ae55',i%2?3:1);}).join('')}`,'style="transform-origin:313px 270px"');
 const wings=group('cinema-wings',`${path('M276 282L168 89 63 50 99 123 29 114 96 180 19 190 138 230 78 276 214 303Z','#182d32','stroke="#618b80" stroke-width="2"')}${path('M349 282L457 89 562 50 526 123 596 114 529 180 606 190 487 230 547 276 411 303Z','#182d32','stroke="#618b80" stroke-width="2"')}`);
 return `${wings}${group('cinema-cero-lines',Array.from({length:7},(_,i)=>line(0,233+i*12,1000,233+i*12,i===3?'#ccebb977':'#59857533',i===3?5:1)).join(''))}${a}${particles('#89b6a6')}`;
}
function bio(){
 const hex=(x,y,r,color)=>`<path d="${Array.from({length:6},(_,i)=>`${i?'L':'M'}${n(x+Math.cos(i*TAU/6)*r)} ${n(y+Math.sin(i*TAU/6)*r)}`).join('')}Z" fill="none" stroke="${color}" stroke-width="2"/>`;
 const cells=Array.from({length:6},(_,row)=>Array.from({length:8},(_,col)=>hex(30+col*78+(row%2?39:0),40+row*68,42,(row+col)%4?'#758c4844':'#c1d78288')).join('')).join('');
 const pod=group('cinema-bio-pod',`${path('M251 465L211 394 199 287 223 162 276 85 330 64 384 104 425 197 433 308 406 415 371 468Z','#253328','stroke="#a0ba68" stroke-width="4"')}${path('M259 436L228 375 223 278 246 177 284 115 330 93 368 123 401 204 402 302 382 391 359 438Z','#43563a','opacity=".5"')}${line(327,94,327,444,'#b1cb6f77',2)}${path('M260 455Q272 300 243 183M380 450Q365 300 401 181','none','stroke="#718d4a" stroke-width="7"')}${path('M258 210L310 244 272 301 337 335 290 384 355 452M368 125L336 192 385 254 348 290 395 355','none','stroke="#cadb8855" stroke-width="3"')}`);
 return `${cells}${pod}${rings('#bfcd7c',328,304)}${particles('#b2be73')}`;
}
function cosmic(){
 const stars=Array.from({length:55},(_,i)=>{const x=i*137%1000,y=i*73%520;return `${rect(x,y,i%9?2:4,i%9?2:4,i%3?'#d0b9e3':'#f1dbad','opacity=".5"')}${i%9?'':line(x-5,y+2,x+9,y+2,'#f2dfbc66',1)}`;}).join('');
 return `${stars}${group('cinema-orbit',`${circle(332,245,188,'#ba91cf44',1)}<ellipse cx="332" cy="245" rx="260" ry="60" fill="none" stroke="#b38dcb66" stroke-width="3" transform="rotate(-23 332 245)"/>`,'style="transform-origin:332px 245px"')}${group('cinema-power',`${circle(332,245,104,'#6b4a8666',38)}${circle(332,245,75,'#a977b9',12)}<circle cx="332" cy="245" r="61" fill="#b581c9"/><circle cx="322" cy="231" r="42" fill="#d1a2d7" opacity=".4"/>${spokes(332,245,210,16,'#d9b8df44',2,.62)}`,'style="transform-origin:332px 245px"')}${path('M0 514L90 460 190 470 265 440 350 487 472 453 565 490 690 475 820 505 1000 469V560H0Z','#1b1c30')}`;
}
function frost(){return `${skyline()}${group('cinema-ice-spires',Array.from({length:13},(_,i)=>{const x=i*69-20,h=85+i*79%260;return `${path(`M${x} 550L${x+17} ${550-h} ${x+35} ${525-h} ${x+61} 550Z`,i%2?'#46768555':'#90bfca55','stroke="#b7d9df55" stroke-width="1"')}${line(x+17,550-h,x+26,550,'#d9eeed66',1)}`;}).join(''))}${group('cinema-orbit',`${spokes(325,250,165,6,'#acd9e5',5,.06)}${Array.from({length:6},(_,i)=>{const a=i*TAU/6;return `<g transform="rotate(${i*60} 325 250)">${line(398,250,425,222,'#acd9e5',3)}${line(398,250,425,278,'#acd9e5',3)}${line(440,250,464,225,'#acd9e5',3)}${line(440,250,464,275,'#acd9e5',3)}</g>`;}).join('')}`,'style="transform-origin:325px 250px"')}${particles('#c8e6e4')}`;}
function inferno(){return `${skyline()}${group('cinema-flames',Array.from({length:12},(_,i)=>{const x=i*90-40,h=120+i*71%210;return path(`M${x} 560Q${x+54} 503 ${x+23} ${560-h}Q${x+101} ${520-h} ${x+72} ${450-h}Q${x+145} 390 ${x+110} 560Z`,i%2?'#a45b424d':'#d18a4b55');}).join(''))}${group('cinema-power',`${circle(331,274,116,'#b2684e66',30)}${circle(331,274,94,'#e0ac6b66',3)}${spokes(331,274,188,12,'#d2a36b66',3,.73)}`,'style="transform-origin:331px 274px"')}${particles('#e7b471')}`;}
function ritual(){return `${group('cinema-orbit',`${circle(329,280,192,'#b5a3cd88',2)}${circle(329,280,172,'#b5a3cd44',10)}${circle(329,280,133,'#dbc2a766',2)}${spokes(329,280,177,12,'#d4bfdd77',3,.86)}${path('M329 85L498 378H160ZM329 477L160 184H498Z','none','stroke="#c7a8cf66" stroke-width="2"')}`,'style="transform-origin:329px 280px"')}${group('cinema-sigils',Array.from({length:12},(_,i)=>{const a=i*TAU/12,x=n(329+Math.cos(a)*152),y=n(280+Math.sin(a)*152);return `<g transform="translate(${x} ${y}) rotate(${i*30})">${path('M-7 -7H5L8 0 1 8H-7V-7M-7 0H5M0 -7V8','none','stroke="#dec4a8" stroke-width="2"')}</g>`;}).join(''))}${particles('#c7b4cf')}`;}
function horror(){return `${group('cinema-horror-gears',Array.from({length:7},(_,i)=>{const x=30+i*108,y=40+i%3*160,r=35+i%3*20;return `<g>${circle(x,y,r,'#9f829b55',12)}${spokes(x,y,r+15,12,'#ae899b66',7,.84)}${circle(x,y,r*.55,'#c9a2b455',2)}</g>`;}).join(''))}${group('cinema-curtain',`${path('M0 0H150L100 130 167 220 105 350 132 560H0Z','#5b3e5855')}${path('M1000 0H848L905 135 838 250 912 350 864 560H1000Z','#5b3e5855')}`)}${path('M130 510Q210 445 275 520T436 515T589 510','none','stroke="#bc8ea366" stroke-width="5"')}${particles('#c594ae')}`;}
function thunder(){return `${skyline()}${group('cinema-lightning',Array.from({length:5},(_,i)=>{const x=75+i*125;return path(`M${x} 0L${x-30} 135 ${x+11} 180 ${x-36} 270 ${x+30} 304 ${x-11} 445 ${x+55} 560`,'none','stroke="#d9cd8b88" stroke-width="'+(i%2?5:2)+'"');}).join(''))}${group('cinema-power',`${circle(325,270,118,'#e0cf8a44',8)}${spokes(325,270,168,12,'#d8cf9455',2,.8)}`,'style="transform-origin:325px 270px"')}${particles('#ddd09c')}`;}
function mechanical(){return `${group('cinema-machine-grid',Array.from({length:12},(_,i)=>`${line(i*90,0,i*90,560,'#91b2a91a',1)}${line(0,i*52,1000,i*52,'#91b2a91a',1)}`).join(''))}${group('cinema-orbit',`${circle(330,276,202,'#a5c4b266',15)}${spokes(330,276,224,32,'#a9c3b966',8,.89)}${circle(330,276,168,'#c9d7bc66',3)}${path('M176 111H242L256 133H399L413 111H483V181L461 195V353L483 367V440H414L400 418H255L242 440H176V369L198 353V197L176 182Z','none','stroke="#9cb9ac55" stroke-width="4"')}`,'style="transform-origin:330px 276px"')}${rect(250,222,162,108,'#192b2e','stroke="#a6c6ad" stroke-width="2"')}${Array.from({length:7},(_,i)=>rect(267+i*20,242,9,66,i%2?'#9dbe8d66':'#d2ddb288')).join('')}${particles('#b2c5ac')}`;}

function hogyoku(){
 // The shattered mirror panels frame the real actor instead of borrowing
 // Itachi's eye and crows: Aizen's illusion is a broken view of the whole world.
 const mirrors=group('cinema-hogyoku-mirrors',Array.from({length:8},(_,i)=>{
  const a=i*TAU/8,x=330+Math.cos(a)*235,y=265+Math.sin(a)*205;
  return `<g transform="translate(${n(x)} ${n(y)}) rotate(${i*45-20})">${path('M-45 -65L26 -53 51 -5 23 65-25 48-54 -7Z',i%2?'#b8afd321':'#e7dbef17','stroke="#ccc0e075" stroke-width="2"')}${path('M-43 -60L-8 -20 13 -29 2 8 23 61M-8 -20L-42 1M2 8L45 -4','none','stroke="#e9deef88" stroke-width="2"')}${rect(-22,-31,3,50,'#d1c0df24')}</g>`;
 }).join(''));
 const wings=group('cinema-hogyoku-wings',[-1,1].map(side=>`<g transform="translate(330 285) scale(${side} 1)">${path('M-25 0L-81 -105-164 -181-240 -199-216 -119-271 -79-224 -44-250 19-176 23-169 99-105 50-57 70Z','#d8cee533','stroke="#e8dfed88" stroke-width="3"')}${path('M-34 -5L-104 -78-216 -161M-40 9L-140 -22-242 -73M-42 21L-123 30-159 87','none','stroke="#a894c789" stroke-width="3"')}${path('M-85 -81L-164 -161-203 -174-187 -118Z','#f0e7f14a')}${path('M-124 -15L-212 -57-230 -69-204 -38Z','#f0e7f135')}</g>`).join(''));
 const coffin=group('cinema-power cinema-hogyoku-coffin',`${path('M262 444V171L280 139H389L408 171V444Z','#17112477','stroke="#b69ccd88" stroke-width="3"')}${[0,1,2,3,4].map(i=>line(270+i*31,158,270+i*31,432,'#ad83c433',2)).join('')}${path('M262 171L234 142M408 171L436 142M262 273L224 273M408 273L446 273M262 403L232 433M408 403L438 433','none','stroke="#c5afe0aa" stroke-width="4"')}${circle(334,263,35,'#a78acc',3)}<circle cx="334" cy="263" r="16" fill="#e3cff1" opacity=".65"/>`,'style="transform-origin:334px 263px"');
 return `${skyline()}${mirrors}${wings}${coffin}${particles('#dfc8f0')}`;
}
function sixpaths(){
 const moon=group('cinema-sixpaths-moon',`<circle cx="330" cy="155" r="125" fill="#713c4b" opacity=".68"/>${circle(330,155,119,'#c4888b',3)}${[37,65,92].map(r=>circle(330,155,r,'#281d2e',3)).join('')}${Array.from({length:9},(_,i)=>{const a=i*TAU/9,x=330+Math.cos(a)*78,y=155+Math.sin(a)*78;return `<g transform="translate(${n(x)} ${n(y)}) rotate(${i*40})">${path('M0 -7Q12 -2 7 7Q-1 14-6 4Q3 5 0 -7Z','#211b2b')}</g>`;}).join('')}`);
 const tree=group('cinema-divine-tree',`${path('M265 560L277 420 253 345 291 291 282 226 312 178 317 78 333 36 351 79 343 191 371 237 355 312 384 375 365 440 396 560Z','#26222e','stroke="#81767c66" stroke-width="3"')}${path('M314 427L323 288 316 215 329 123 332 64M351 473L339 330 350 245','none','stroke="#8d7e7b66" stroke-width="5"')}${path('M304 248L245 181 201 143 140 118M350 203L409 154 452 97 515 69M290 357L230 319 176 319 90 277M367 330L420 288 474 281 555 235M294 477L227 473 175 520M364 485L435 494 477 551','none','stroke="#4b414d" stroke-width="18"')}`);
 const meteors=group('cinema-sixpaths-meteors',[[112,112,1],[536,54,.62]].map(([x,y,s])=>`<g transform="translate(${x} ${y}) scale(${s})">${path('M-71 -15L-42 -63 14 -70 69 -21 74 30 35 76-33 68-79 24Z','#776765','stroke="#b3a09a" stroke-width="3"')}${path('M-42 -63L-24 -19 10 -6-9 35 35 76M10 -6L69 -21M-24 -19L-71 -15M-9 35L-33 68','none','stroke="#41353f" stroke-width="7"')}${path('M-57 -39L-43 -49-34 -24-52 -11Z','#b4a09a55')}${path('M-79 -18L-126 -87M-44 -66L-81 -132M14 -70L-9 -144','none','stroke="#d9c9b34d" stroke-width="4"')}</g>`).join(''));
 const orbs=group('cinema-sixpaths-orbs',Array.from({length:9},(_,i)=>{const a=(i-4)*.44,x=330+Math.sin(a)*195,y=335-Math.cos(a)*130;return `<circle cx="${n(x)}" cy="${n(y)}" r="18" fill="#111521" stroke="#c1c0b780" stroke-width="2"/>${path(`M${n(x-9)} ${n(y-10)}Q${n(x-16)} ${n(y)} ${n(x-9)} ${n(y+9)}`,'none','stroke="#8a8d9d77" stroke-width="2"')}`;}).join(''));
 return `${moon}${tree}${meteors}${orbs}${particles('#c3b0ae')}`;
}

function heianshrine(){
 // A jawed, open shrine surrounds the four-armed actor; its fixed cuts and
 // furnace light are signature scenery, not the original Sukuna ritual wheel.
 const shrine=group('cinema-heian-shrine',`${path('M98 482L111 221 149 170H504L548 221 564 482Z','#291a22','stroke="#95606577" stroke-width="3"')}${path('M160 454V247L197 212H463L501 247V454Z','#120f19','stroke="#54303c" stroke-width="5"')}${path('M61 227L123 192 176 143 214 144 265 165H392L441 143 487 144 539 191 602 227 573 248 515 222 458 197H209L147 222 86 248Z','#3f222c','stroke="#bf7f7966" stroke-width="3"')}${path('M116 201L176 155 220 155 268 177H388L439 155 480 155 537 201M95 227L151 207 213 188H453L514 208 573 227','none','stroke="#9e5f6455" stroke-width="5"')}${rect(125,237,29,217,'#70434b')}${rect(508,237,29,217,'#70434b')}${rect(120,451,41,20,'#a3726b')}${rect(502,451,41,20,'#a3726b')}${rect(91,474,484,20,'#6d4149')}${rect(72,494,524,20,'#3d2834')}`);
 const jaw=group('cinema-heian-jaws',`${path('M173 256L218 227 252 246 286 222 324 247 359 222 396 246 430 227 480 256 460 290 440 267 419 301 399 272 378 307 356 276 333 309 310 275 287 307 265 273 242 299 221 269 199 290Z','#ac8a79','stroke="#4e303a" stroke-width="4"')}${path('M177 431L205 401 227 428 251 399 277 430 302 400 329 435 354 400 381 430 406 400 433 429 458 402 478 431 444 457H213Z','#89695f','stroke="#4a2b38" stroke-width="4"')}`);
 const skulls=group('cinema-heian-skulls',[[99,179],[175,114],[486,114],[561,179]].map(([x,y])=>`<g transform="translate(${x} ${y})">${path('M-19 0L-13 -20H13L21 -5 17 20 9 22 8 35H-7L-9 23-18 18Z','#b7a089','stroke="#4e3036" stroke-width="3"')}${path('M-13 -2L-3 -6-4 6-14 5ZM5 -6L15 -2 14 7 5 6Z','#30212c')}${line(-6,19,9,19,'#513139',3)}${line(-3,23,-3,32,'#513139',2)}${line(3,23,3,32,'#513139',2)}</g>`).join(''));
 const cuts=group('cinema-heian-world-cuts',Array.from({length:8},(_,i)=>{const angle=-.9+i*.27,cx=330,cy=290,length=250,x=n(cx+Math.cos(angle)*length),y=n(cy+Math.sin(angle)*length);return `${line(n(cx-Math.cos(angle)*length),n(cy-Math.sin(angle)*length),x,y,i%2?'#e3a18b66':'#b85c6977',i%2?2:4)}${line(n(cx-Math.cos(angle)*length+6),n(cy-Math.sin(angle)*length),n(x+6),y,'#241925',2)}`;}).join(''));
 const furnace=group('cinema-power cinema-heian-furnace',`${path('M195 488Q234 414 225 374Q275 404 270 352Q309 401 329 321Q351 392 385 362Q376 422 422 384Q415 448 468 488Z','#bf5b3c44')}${path('M256 491L292 434 303 463 329 393 349 455 371 431 406 491Z','#f1b66b44')}${circle(330,396,40,'#d58d6655',8)}`,'style="transform-origin:330px 396px"');
 return `${skyline()}${shrine}${jaw}${skulls}${cuts}${furnace}${particles('#c08c7a')}`;
}
function starconqueror(){
 const ship=group('cinema-boros-starship',`${path('M-30 218L60 114 203 58H465L609 114 703 218 603 195 534 161 465 140H202L126 164 60 195Z','#252432','stroke="#6a637e88" stroke-width="4"')}${path('M47 161L116 106 213 72H458L553 108 628 166 538 138 463 115H211L130 138Z','#444051','stroke="#89768a55" stroke-width="2"')}${path('M80 145L161 114 223 92H452L514 114 593 145','none','stroke="#b08ca166" stroke-width="4"')}${Array.from({length:11},(_,i)=>{const x=95+i*47,y=i<5?155-i*5:130+(i-5)*5;return `${rect(x,y,24,7,i%3?'#8a688b88':'#ceb0b799')}${rect(x+4,y-12,18,3,'#66516e')}`;}).join('')}${path('M198 91L224 68H447L474 91 447 116H226Z','#171722','stroke="#716281" stroke-width="3"')}`);
 const eye=group('cinema-power cinema-boros-cyclopean-core',`${path('M149 284Q330 135 511 284Q330 435 149 284Z','#372339','stroke="#a778a57a" stroke-width="3"')}${path('M176 284Q330 173 484 284Q330 396 176 284Z','#76567955')}${circle(330,284,77,'#d99cc1',12)}${circle(330,284,57,'#ead1db',4)}<circle cx="330" cy="284" r="48" fill="#ead1db" opacity=".28"/>${path('M323 236L340 250V317L330 332 319 317V250Z','#fff0e4')}${circle(330,284,105,'#d191bc55',2)}`,'style="transform-origin:330px 284px"');
 const reactor=group('cinema-orbit cinema-boros-reactor',`${circle(330,284,159,'#b190b66b',3)}${circle(330,284,174,'#66546d66',9)}${spokes(330,284,189,18,'#bb95b777',4,.88)}${spokes(330,284,213,9,'#d9afc555',2,.95)}`,'style="transform-origin:330px 284px"');
 const armor=group('cinema-dust cinema-boros-restraints',Array.from({length:10},(_,i)=>{const a=i*TAU/10,x=330+Math.cos(a)*230,y=290+Math.sin(a)*183;return `<g transform="translate(${n(x)} ${n(y)}) rotate(${i*37})">${path('M-22 -28H14L28 -9 16 26-9 32-26 8Z','#5f5767','stroke="#bca8b355" stroke-width="2"')}${path('M-18 -24H10L21 -7 10 15-6 21-18 6Z','#8d7886')}${line(-12,-17,13,-9,'#d0b1bd88',2)}</g>`;}).join(''));
 const cannon=group('cinema-power cinema-boros-roaring-cannon',`${path('M330 259L996 204V365L330 309Z','#b060a022')}${path('M330 274L996 250V318L330 294Z','#d59cc737')}${path('M330 283L996 276V291L330 286Z','#fbe7e044')}${line(325,284,990,284,'#fff0db55',2)}`,'style="transform-origin:330px 284px"');
 return `${ship}${cannon}${reactor}${armor}${eye}${particles('#e0b2cd')}`;
}

export function cinematicArt(theme,intro={}){
 const content=({astronauts:astronautsScene,lastsilence:lastSilenceScene,titan:()=>titan(intro),time,illusion,cero,bio,cosmic,frost,inferno,ritual,horror,thunder,mechanical,hogyoku,sixpaths,heianshrine,starconqueror}[theme]||ritual)();
 return `<svg class="cinema-scene-art cinema-art-${theme}" viewBox="0 0 1000 560" preserveAspectRatio="xMidYMid slice" aria-hidden="true" focusable="false" shape-rendering="crispEdges">${content}</svg>`;
}
