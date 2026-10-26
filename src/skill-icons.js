import {GENERAL_TREE,CHARACTER_TREES} from './progression.js';
// Each node has its own silhouette; colors connect the illustration to its tree.
export const SKILL_ART={
 denji:{
  teeth:'<path d="m3 25 4-9L25 3l6 4-3 7L10 29Z"/><path d="m8 23 19-15M9 12l3 2m3-6 3 2m3-6 3 2M3 25l6 6" class="light"/>',
  heartbeat:'<path d="m17 31-12-9V9q5-8 12-1 7-7 12 1v13Z"/><path d="m7 18 5-1 3 5 4-12 3 7h5" class="light"/>',
  tempo:'<path d="M3 13h20v16H3Zm20 4 8-4v10l-8 4Z"/><path d="M11 13V5h9m-4 0v4M7 19h11m-8 5h7" class="light"/>',
  rev:'<circle cx="17" cy="18" r="12"/><path d="m8 24 9-6 8-10M8 9l2 3m7-6v5m9 6h-4M6 18h4" class="light"/>',
  hunter:'<path d="M9 3h16l5 8-3 20H7L4 11Z"/><path d="m9 4 8 10 8-10M17 14l-3 9 3 7 3-7Zm-9 4h5m9 0h5" class="light"/>',
  hybrid:'<path d="m3 15 5-9 12-3 7 5-2 15-10 9-9-6Z"/><path d="m12 10 17-6 3 4-17 8M8 20l11 2-4 6M9 12l2 3" class="light"/>',
  scrap:'<path d="m17 2 12 7-3 16-9 7-9-7L5 9Z"/><path d="M17 8v17m-7-9h14m-17 10 5-4m10 0 5 4" class="light"/>',
  footwork:'<path d="M10 3h9l-1 14 10 7 3 7H6v-7l6-9Z"/><path d="M7 26h20m-14-15 5 1M2 8h5M1 17h5m-3 7h3" class="light"/>',
  reach:'<path d="m2 26 5-8L25 3l7 5-4 9L10 31Z"/><path d="m8 25 21-17M4 8h8m-4-4v8m14 13h8m-4-4v8" class="light"/>',
  engine:'<path d="M6 7h20v21H6Zm20 6h6v9h-6Z"/><path d="M3 11h3M3 24h3m4-12 5 5-5 5m8-10 5 5-5 5M11 3h10" class="light"/>',
  promise:'<path d="M3 20Q1 8 13 5l10 4 8 10-5 10H10Z"/><path d="m7 16 18-9 5 3-18 11M9 24h13m-7-1v6M8 10 6 5" class="light"/>',
  dream:'<path d="m17 2 4 8 10 3-6 7 2 11-10-5-10 5 2-11-6-7 10-3Z"/><path d="m10 20 12-11 3 3-12 11M12 15l6 6M17 3v5" class="light"/>',
 },
 guts:{
  iron:'<path d="m3 28 6-6L24 2h8l-3 9L12 29Z"/><path d="m11 21 14-16M3 21l10 10M2 32l5-6" class="light"/>',
  resolve:'<path d="m17 2 12 7-2 16-10 7-10-7L5 9Z"/><path d="m17 8-5 6 5 5-5 6m5-17 5 6-5 5 5 6" class="light"/>',
  tempo:'<path d="m6 28 16-25 9 1-5 10L13 31Z"/><path d="M2 7h12M1 13h8m15 7 7-4m-10 13 9-5" class="light"/>',
  struggle:'<path d="M5 30 9 4l5 8 3-10 3 10 6-8 3 26Z"/><path d="m17 9-4 7 4 5-4 7m4-19 4 7-4 5 4 7" class="light"/>',
  swordsman:'<path d="m7 31-4-17 7-8 7-3 8 3 6 8-4 17Z"/><path d="M10 12h14l-4 9h-7Zm-1 12 8 4 8-4M17 3v7" class="light"/>',
  beast:'<path d="m3 2 10 7 4-6 5 6 9-7-3 20-11 10L6 22Z"/><path d="m8 13 6 3m6 0 6-3m-16 9 7 5 7-5M17 8v13" class="light"/>',
  forge:'<path d="M2 15h31l-5 6H22v8H11v-8H7Z"/><path d="m8 3 8 5-3 6-8-5m11-1 8-5m-1 23 5 5" class="light"/>',
  footwork:'<path d="M11 3h8l-1 15 10 5 3 7H6v-6l6-8Z"/><path d="M7 25h21m-15-13 5 2M2 8h5M1 16h6m-4 6h4" class="light"/>',
  edge:'<path d="m1 28 18-22 11-4-3 12L8 32Z"/><path d="m7 24 16-16m-9 17 5 6m6-16 7 1M3 7l3 2m-1 5 4-1" class="light"/>',
  nightmare:'<path d="M24 2Q4 3 3 19 5 34 23 31 10 24 24 2Z"/><path d="m18 16 5-8 2 12 7-6-3 15-10 1Z" class="light"/>',
  ironwill:'<path d="m5 6 12-4 12 4-2 18-10 8-10-8Z"/><path d="m11 26 12-21 4 1-2 7-10 16M8 17l10 7" class="light"/>',
  struggler:'<path d="m17 1 5 7 9-3-4 16-10 12L7 21 3 5l9 3Z"/><path d="m8 14 6 3m6 0 6-3m-9-9-3 7 3 6-3 8m3-21 3 7-3 6 3 8" class="light"/>',
 },
 erza:{
 blade:'<path d="m4 26 1-7L25 2h6l-1 6L10 28Z"/><path d="m8 21 18-16M3 21l10 10M3 31l5-5" class="light"/>',
 vitality:'<path d="m17 31-12-9V8L17 2l12 6v14Z"/><path d="m17 24-7-7q-1-8 7-4 8-4 7 4Z" class="light"/>',
 tempo:'<path d="m3 24 21-21 6 1-1 6L9 30ZM2 11h11M1 17h7"/><path d="m5 22 7 7M17 5l5 5m-7 20 14-13" class="light"/>',
 requip:'<path d="m17 3 12 6v15l-12 7-12-7V9Z"/><path d="m4 5 7 0-2-4m21 29h-7l2 3M3 5Q0 21 10 28M31 29Q35 14 25 6" class="light"/>',
 titania:'<path d="m3 10 8 6 6-13 6 13 8-6-4 19H7Z"/><path d="M8 23h18m-9-13v13m-4-6h8" class="light"/>',
 chariot:'<path d="m2 29 10-15 6 3L32 2 22 22l-6-3L6 32Z"/><path d="m8 25 9-10 5 2 8-11M3 9h6m-3-3v6M24 28h7m-4-4v8" class="light"/>',
 },
 rimuru:{
 flame:'<path d="M18 2q-2 9 5 12l3-7q9 19-7 24Q0 34 5 18l7-12q-1 10 4 12Z"/><path d="M18 15q9 12 0 14-8-2 0-14Z" class="light"/>',
 sage:'<path d="M3 5h12l2 3 2-3h12v25H19l-2 2-2-2H3Z"/><path d="M17 8v23M7 11h5m-5 5h5m10-5h5m-5 5h5" class="light"/>',
 casting:'<path d="M7 3 2 16l5 15 6-15Zm20 0-6 13 6 15 5-15Z"/><path d="M11 7h12m-12 9h12m-12 9h12" class="light"/>',
 gluttony:'<path d="M2 21Q3 5 17 4q14 1 15 17 1 11-15 10Q1 32 2 21Z"/><path d="M7 20q10-8 20 0-2 9-10 9T7 20Z" class="light"/><path d="M9 13h3m10 0h3"/>',
 sovereign:'<path d="m3 12 8 4 6-12 6 12 8-4-4 17H7Z"/><path d="M9 24h16m-8-9v10" class="light"/>',
 devour:'<circle cx="17" cy="17" r="12"/><path d="m3 7 7 3-1-7m22 24-7-3 1 7M7 30l3-7-7 1m24-21-3 7 7-1" class="light"/><circle cx="17" cy="17" r="5"/>',
 },
 diavolo:{
 power:'<path d="M4 16 11 8l7 3 5-3 7 8-4 13H10Z"/><path d="M9 17h17m-14-5 3 7m7-7-2 7" class="light"/>',
 fate:'<path d="M2 17Q17 1 32 17 17 33 2 17Z"/><circle cx="17" cy="17" r="6" class="light"/><path d="M17 3v7m0 14v7"/>',
 tempo:'<circle cx="17" cy="17" r="12"/><path d="m17 6 0 11 8 4M3 4l5 5m18 17 5 5" class="light"/>',
 erasure:'<path d="M5 3h24v28H5Z"/><path d="m25 1-10 13 6 3-13 16M8 8h5m9 18h5" class="light"/>',
 emperor:'<path d="m3 10 8 6 6-12 6 12 8-6-4 19H7Z"/><path d="M8 23h18m-9-10v13" class="light"/>',
 verdict:'<path d="m17 2 12 8v16l-12 6-12-6V10Z"/><path d="m10 16 5 7 10-12M17 2v6" class="light"/>',
 },
 yuki:{
 force:'<path d="M3 24 13 8l15 7-9 16Z"/><path d="m5 8 6-5m9 3 4-4m4 23 4-2" class="light"/>',
 density:'<circle cx="17" cy="17" r="8"/><ellipse cx="17" cy="17" rx="15" ry="5" class="light"/><path d="M17 1v6m0 20v6"/>',
 spin:'<path d="M7 10a12 12 0 1 1-1 14l-4 2 1-9 9 3-4 2a7 7 0 1 0 2-9Z" class="light"/>',
 mass:'<path d="m17 2 6 9 9 6-9 6-6 9-6-9-9-6 9-6Z"/><circle cx="17" cy="17" r="6" class="light"/>',
 grade:'<path d="M5 6h24v23H5Z"/><path d="m17 8 3 7 7 2-7 3-3 7-3-7-7-3 7-2Z" class="light"/>',
 singularity:'<circle cx="17" cy="17" r="12"/><path d="M2 25 32 9M5 28 29 6" class="light"/><circle cx="17" cy="17" r="6"/>',
 },
 eren:{
 blades:'<path d="M4 3 24 23l-3 3L2 6Zm26 0L10 23l3 3L32 6Z"/><path d="m6 31 8-7m14 7-8-7" class="light"/>',
 heart:'<path d="m17 30-12-9V9l12-6 12 6v12Z"/><path d="m8 14 9 11 9-11-6-3-3 4-3-4Z" class="light"/>',
 gas:'<path d="M3 11h8v20H3Zm20 0h8v20h-8Z"/><path d="M11 14h12m-12 7h12m-6-17v25M1 7l9-5m23 5-9-5" class="light"/>',
 armor:'<path d="m17 2 12 7-3 18-9 5-9-5L5 9Z"/><path d="m17 5 6 8-6 13-6-13Z" class="light"/><path d="M17 5v21M6 16h22"/>',
 heir:'<path d="M5 6h24v23H5Z"/><path d="m7 25 5-15 5 12 5-12 5 15M17 2v7m-4-5h8" class="light"/>',
 roar:'<path d="m10 7 7-4 7 4 2 12-9 13-9-13Z"/><path d="M12 17h10v7H12Zm-8-8-3-3m30 3 3-3M4 23l-3 4m30-4 3 4" class="light"/>',
 },
 megumi:{
 dogs:'<path d="m3 23 4-13 7 5 5-5 10 13-5 7H10Z"/><path d="m9 18 4 3m6-3 4 3M4 10l2-7 7 10" class="light"/>',
 pact:'<path d="M9 3h16v28H9Z"/><path d="m14 8 6 5-6 6 6 6m-7-12h9" class="light"/>',
 nue:'<path d="m17 28-5-11L2 9l12 4 3-10 3 10 12-4-10 8Z"/><path d="m17 9-3 10h6l-5 12" class="light"/>',
 wheel:'<circle cx="17" cy="17" r="11"/><path d="M17 1v32M1 17h32M5 5l24 24M5 29 29 5" class="light"/><circle cx="17" cy="17" r="4"/>',
 heir:'<path d="m4 6 10 5 3-7 3 7 10-5-4 15-9 10-9-10Z"/><path d="m9 20 8-7 8 7-8 6Z" class="light"/>',
 general:'<path d="M12 10h10l5 8-4 13H10L6 18Z"/><path d="M4 7h26M17 1v12m-8-9 2 8m14-8-2 8" class="light"/><circle cx="17" cy="20" r="4"/>',
 },
 frieren:{
 ray:'<path d="m3 29 21-21m-18 23L28 9"/><circle cx="25" cy="7" r="5" class="light"/><path d="M5 12h6m-3-3v6"/>',
 reserve:'<path d="M6 3h22v28H6Zm4 0v28"/><path d="m19 8 5 8-5 9-5-9Z" class="light"/>',
 precision:'<circle cx="18" cy="16" r="11"/><path d="M18 5v22M7 16h23m-26 15 11-11" class="light"/>',
 barrage:'<path d="m4 26 5-15 3 6Zm9 4 6-26 3 10Zm10-2 7-18 2 9Z" class="light"/><path d="M3 30h28"/>',
 elf:'<path d="m4 15 7-4 6 7 6-7 7 4-6 11H10Z"/><path d="M17 3v14m-5-9 5-5 5 5" class="light"/>',
 reveal:'<circle cx="17" cy="17" r="12"/><path d="m17 4 11 20H6Zm0 26L6 10h22Z" class="light"/><circle cx="17" cy="17" r="3"/>',
 },
 samus:{
 cannon:'<path d="M3 10h16v16H3Z"/><path d="M17 14h12v8H17Z" class="light"/><path d="M5 13h9m-9 5h9m16-1h3"/>',
 tank:'<path d="M8 4h19v27H8Zm-4 6h4v15H4Z"/><path d="M11 7h13v6H11Z" class="light"/><path d="M12 18h11m-11 4h11m-11 4h11"/>',
 split:'<path d="m3 13 11 4L3 21m10-4h17M18 8l12-5M18 26l12 5"/><path d="m24 2 7 0-3 6m-3 6 6 3-6 3m3 6 3 6h-7" class="light"/>',
 blast:'<circle cx="17" cy="17" r="6"/><path d="M17 1v8m0 16v8M1 17h8m16 0h8M5 5l6 6m12 12 6 6M5 29l6-6M23 11l6-6" class="light"/>',
 hunter:'<path d="m5 10 12-7 12 7-2 15-10 7-10-7Z"/><path d="M8 14h18l-4 7h-4v5h-3v-5h-4Z" class="light"/>',
 nova:'<path d="m17 2 5 8 9 7-9 6-5 9-6-9-9-6 9-7Z"/><circle cx="17" cy="17" r="7" class="light"/><path d="m17 12 3 5-3 5-3-5Z"/>',
 },
 general:{
  vigor:'<path d="M17 30 4 18V8l13-5 13 5v10Z"/><path d="M17 22 9 14q-1-8 8-3 9-5 8 3Z" class="light"/>',
  power:'<path d="m8 25-3-10 4-3 3 4V6h4v9h2V3h4v13h2V8h4v15l-6 8H12Z"/><path d="m12 21 4-4 7 4-2 6h-7Z" class="light"/>',
  fortune:'<ellipse cx="12" cy="24" rx="9" ry="5"/><path d="M3 18v6m18-6v6"/><ellipse cx="12" cy="18" rx="9" ry="5"/><circle cx="23" cy="10" r="8" class="light"/><path d="M23 5v10m-3-8h6m-6 6h6"/>',
  stride:'<path d="M10 4h8v10l9 7 3 5v4H7v-6l4-5Z"/><path d="M8 25h21m-17-8 6 1m-15-7 4-1M2 18h5" class="light"/>',
  reroll:'<path d="m4 10 17-5 9 17-17 8Z"/><circle cx="12" cy="13" r="2" class="light"/><circle cx="22" cy="22" r="2" class="light"/><path d="M3 7Q16-3 28 5m0-4v5h-5"/>',
  study:'<path d="M3 6q8-3 14 2 7-5 14-2v23q-7-3-14 1-6-4-14-1Z"/><path d="M17 8v22M7 12l6 1m-6 5 6 1m8-6 6-1m-6 7 6-1" class="light"/>',
  magnet:'<path d="M5 5h8v13a4 4 0 0 0 8 0V5h8v13a12 12 0 0 1-24 0Z"/><path d="M5 10h8m8 0h8m-12 4 0-6m-3 2 3-4 3 4" class="light"/>',
  vanish:'<path d="m4 7 19-3 6 23-19 4Z"/><path d="M14 10h7m-6 4h5m-8 4h7m-5 4h4" class="light"/><path d="m4 2 28 30M3 17h6M2 23h5"/>',
  focus:'<circle cx="17" cy="20" r="11"/><path d="M13 2h8v4h-8m4 4v10l6-5" class="light"/><path d="m27 8 3-3m-25 7-2-3"/>',
 },
 goku:{
  ki:'<path d="m3 27 13-13m-9 16 12-13"/><circle cx="23" cy="11" r="8" class="light"/><path d="m24 3 5 1-1 5M4 17l5-1"/>',
  vitality:'<path d="m6 28 1-11-4-4 5-6 7 5h4l7-5 5 6-4 4 1 11Z"/><path d="M17 26 10 18q0-6 7-2 7-4 7 2Z" class="light"/>',
  focus:'<circle cx="20" cy="16" r="12"/><circle cx="20" cy="16" r="6" class="light"/><path d="M2 16h27M20 2v28m-17 3 7-6"/>',
  spirit:'<circle cx="17" cy="11" r="9" class="light"/><path d="m7 21-4 11m24-11 4 11M9 29l4-7m12 7-4-7M17 23v9"/>',
  ascend:'<path d="m4 28 3-12 5 5 5-18 5 18 5-5 3 12Z"/><path d="m10 26 7-12 7 12Z" class="light"/>',
  genki:'<path d="m4 30 2-12 5-5 4 4-3 5 5 4 5-4-3-5 4-4 5 5 2 12Z"/><path d="m17 3 2 5 6 2-6 2-2 6-2-6-6-2 6-2Z" class="light"/>',
 },
 gojo:{
  blue:'<path d="m3 11 9-6 9 6v13l-9 6-9-6Zm9-6v25M3 11l9 6 9-6"/><ellipse cx="24" cy="17" rx="8" ry="4" class="light"/>',
  eyes:'<path d="M2 17Q17 0 32 17 17 34 2 17Z"/><circle cx="17" cy="17" r="7" class="light"/><path d="M17 12v10m-5-5h10M5 7l-2-2m26 2 2-2"/>',
  force:'<circle cx="11" cy="16" r="8"/><circle cx="23" cy="16" r="8" class="light"/><path d="m17 3 0 27M4 29l7-6m12 0 7 6"/>',
  domain:'<path d="M4 29V10L17 3l13 7v19ZM4 10l13 6 13-6M17 3v27"/><path d="M6 21h22m-16-9 0 18m10-18v18" class="light"/>',
  honored:'<path d="m8 29-2-8 3-4V6h4v12l3-2V3h4v16l5-4 5 7-5 8Z"/><path d="M9 6h4m3-3h4m-7 19 6 1" class="light"/>',
  collapse:'<circle cx="17" cy="17" r="13"/><ellipse cx="17" cy="17" rx="15" ry="5" class="light"/><circle cx="17" cy="17" r="5"/><path d="m6 4 3 4m16 19 3 3"/>',
 },
 naruto:{
  blades:'<path d="m17 2 4 10 11 5-11 4-4 11-5-11-10-4 10-5Z"/><circle cx="17" cy="17" r="3" class="light"/>',
  speed:'<path d="M11 3h9l-2 14 9 5v6H7v-5l5-7Z"/><path d="M8 23h17m-12-11 6 1m-17-5 5 1M1 16h6m-5 6h3" class="light"/>',
  chakra:'<path d="M27 12C18-6 0 8 6 23s29 7 22-7-20-10-17 0 15 10 12 2-10-5-8 0"/><path d="m27 3 3 4M2 29l5-1" class="light"/>',
  clones:'<circle cx="8" cy="12" r="5"/><circle cx="26" cy="12" r="5"/><path d="M2 29V21q6-6 12 0v8m6 0v-8q6-6 12 0v8"/><circle cx="17" cy="8" r="5" class="light"/><path d="M11 30V18q6-5 12 0v12" class="light"/>',
  sage:'<path d="M5 12 9 5l5 5h6l5-5 4 7-1 14-11 5-11-5Z"/><path d="M9 15h5m6 0h5m-14 8h12" class="light"/><circle cx="10" cy="16" r="2"/><circle cx="24" cy="16" r="2"/>',
  rasengan:'<circle cx="17" cy="15" r="11" class="light"/><path d="M10 15c0-10 19-6 12 4s-17-4-8-5 6 8 1 4M5 31l3-9m21 9-3-9"/>',
 },
 madoka:{
  arrows:'<path d="M23 3Q1 7 23 31M23 3 12 17l11 14"/><path d="M5 17h25m-5-4 6 4-6 4" class="light"/><path d="m9 7 4 3 4-3-4-4Z"/>',
  soul:'<path d="m17 2 10 9v13l-10 8-10-8V11Z"/><path d="m17 6 6 9-6 12-6-12Z" class="light"/><path d="M8 16h18"/>',
  light:'<path d="m17 2 4 11 11 4-11 4-4 11-4-11-11-4 11-4Z" class="light"/><path d="m4 3 4 4m19 20 4 4M2 26l5-2m19-18 5-2"/>',
  wings:'<path d="M16 29Q0 25 3 6l10 9-2-12 7 17 5-17-1 12 10-9q3 19-13 23Z"/><path d="m6 17 7 6m15-6-7 6" class="light"/>',
  wish:'<path d="M17 30V15M8 28l9-6 9 6"/><path d="M17 16Q3 21 5 10q-3-10 8-7 9-7 12 1 11 2 5 12-5 9-13 0Z" class="light"/><circle cx="17" cy="11" r="4"/>',
  mercy:'<path d="m2 28 3-11 5-2 7 7 7-7 5 2 3 11-15 4Z"/><path d="m17 18-7-7q-2-8 7-4 9-4 7 4Z" class="light"/>',
 },
 maomao:{
  toxins:'<path d="M12 3h10v9l6 8v10H6V20l6-8Z"/><path d="M9 21h16v7H9Z" class="light"/><path d="M13 24h2m4 0h2m-5 3h3"/>',
  medicine:'<path d="M3 20h28l-5 11H8Z"/><path d="m7 21 6-14 5 2-5 14" class="light"/><path d="M20 20Q18 4 30 5q0 11-10 15Z"/>',
  dose:'<path d="m21 3 9 6-4 6-9-6ZM17 9 6 23l4 3 12-13"/><path d="M10 25q-8 6-2 7 7 0 2-7Z" class="light"/><path d="m4 5 5 0m-2-2v4"/>',
  garden:'<path d="M17 30V8m0 14-9-6m9 1 8-8"/><path d="M15 22Q2 22 4 11q11 1 11 11Zm4-6Q18 3 30 5q-1 10-11 11Z" class="light"/><path d="M5 30h24"/>',
  apothecary:'<path d="M5 3h24v29H5ZM5 17h24M17 3v29"/><path d="M8 9h5v5H8Zm12-2h6v7h-6ZM8 23h5v5H8Zm13-3h4v9h-4Z" class="light"/>',
  panacea:'<path d="M13 2h8v9l7 10v10H6V21l7-10Z"/><path d="m17 14 3 5 6 2-6 3-3 6-3-6-6-3 6-2Z" class="light"/><path d="M12 3h10v4H12"/>',
 },
 shinji:{
  sync:'<path d="M3 4h28v26H3Z"/><path d="M2 17h5l3-10 5 20 4-22 5 17 3-5h5" fill="none" stroke="#e6efbb"/>',
  field:'<path d="M11 3h12l8 8v12l-8 8H11l-8-8V11Z"/><path d="M14 9h6l5 5v6l-5 5h-6l-5-5v-6Z" class="light"/>',
  burst:'<path d="m5 7 4-5 4 5v22H5Zm11 4 4-5 4 5v18h-8Z"/><path d="m26 15 3-4 3 4v14h-6ZM6 22h6m5 0h6m4 0h4" class="light"/>',
  resolve:'<path d="m5 9 12-6 12 6v14l-12 9-12-9Z"/><path d="m10 17 5 5 10-12" class="light"/>',
  pilot:'<path d="m7 13 4-9h12l5 9-4 9-7 4-7-4Z"/><path d="M4 32v-6l9-4 4 4 4-4 9 4v6" class="light"/><path d="M12 14h3m5 0h3m-8 6h4"/>',
  beast:'<path d="M4 4 9 2l4 22-6 8Zm11 0 5-2 3 22-6 8Zm12-1 5 1-2 22-6 6Z" class="light"/>',
 },
 esdeath:{
  ice:'<path d="m16 3 6 14-5 14-5-14Zm-12 8 8 8-3 11-6-7Zm24-3 4 13-5 8-3-11Z" class="light"/>',
  command:'<path d="m7 2 10 7 10-7-4 16H11Z"/><circle cx="17" cy="22" r="9"/><path d="m17 15 2 5 5 2-5 2-2 5-2-5-5-2 5-2Z" class="light"/>',
  barrage:'<path d="m3 29 8-21 3 8ZM12 31l9-29 3 11Zm9-1L30 8l2 9Z" class="light"/>',
  dominion:'<path d="M4 4h26v26H4Z"/><path d="M17 7v20M8 12l18 10M8 22l18-10m-13-1 4 4 4-4m-8 12 4-4 4 4" class="light"/>',
  general:'<path d="m3 14 5-9 9-3 10 4 4 8-4 7H7Z"/><path d="M6 19h22l-5 9H11Z" class="light"/><path d="M17 6v10m-4-5h8"/>',
  eternal:'<circle cx="17" cy="18" r="12"/><path d="M17 10v8l6 4M13 2h8m-4 0v4" class="light"/><path d="m4 6 5 5m-5 0 5-5m16 20 5 5m-5 0 5-5"/>',
 },
 kurumi:{
  marks:'<path d="M2 17Q17 1 32 17 17 33 2 17Z"/><circle cx="17" cy="17" r="8" class="light"/><path d="M17 10v7l5 2M10 17H6m22 0h-4"/>',
  reserve:'<path d="M8 3h18v5l-7 9 7 9v5H8v-5l7-9-7-9Z"/><path d="M11 7h12l-6 8Zm6 12 7 9H10Z" class="light"/>',
  echo:'<path d="M3 7h19v5H3Zm7 5v7H6v-7m6 7h19v5H12Zm7 5v7h-4v-7"/><path d="m25 4 5 0m-3 11 5 0M3 24h5" class="light"/>',
  night:'<path d="M22 2Q4 4 5 20 8 34 24 31 9 23 22 2Z"/><path d="M19 22v-8h5v8m1 10V18h6v14M15 32V22h5v10" class="light"/>',
  spirit:'<path d="m17 2 5 7-5 9-5-9ZM7 15l5 7-5 10-5-10Zm20 0 5 7-5 10-5-10Z" class="light"/>',
  doubles:'<path d="M3 10h18v5H3Zm5 5v7H4v-7m10 7h17v5H14Zm6 5v5h-4v-5"/><circle cx="25" cy="8" r="6" class="light"/><path d="M25 4v4l3 2"/>',
 },
};
// Additional branches combine a clear equipment/effect drawing with a small
// tree-specific seal. The individual rune and framing keep repeated effects
// visually distinct without turning every extension into the same badge.
const MOTIFS={
 heal:'<path d="m17 29-12-11Q0 8 8 5q5-2 9 5 4-7 9-5 8 3 3 13Z"/><path d="M17 11v12m-6-6h12" class="light"/>',
 herbs:'<path d="M17 31V10M16 22Q1 21 5 8q14 0 12 14Zm2-6Q16 1 30 4q1 12-12 12Z"/><path d="m7 11 8 9M20 13l7-6" class="light"/>',
 atfield:'<path d="m17 3 13 6-3 15-10 8L7 24 4 9Z"/><path d="m17 8 8 4-2 10-6 5-6-5-2-10Z" class="light"/><path d="M17 8v19m-7-13 14 7"/>',
 chest:'<path d="M4 11q0-7 7-7h12q7 0 7 7v19H4Z"/><path d="M4 14h26M9 4v26m16-26v26" class="light"/><path d="M14 12h6v9h-6Z"/>',
 scroll:'<path d="M8 3h18v25q0 5-5 4H6q-5 0-3-5 1-3 5-2Z"/><path d="M12 9h10m-10 5h10m-10 5h7" class="light"/><path d="M8 25h13q-2 3 1 6"/>',
 grimoire:'<path d="M4 4h12l2 3 2-3h11v26H20l-2 2-2-2H4Z"/><path d="M18 8v21M7 11h7m8 0h6m-21 6h7m8 0h6" class="light"/>',
 headband:'<path d="m2 17 4-8h23l3 8-5 5H8Z"/><path d="M9 11h16v8H9Z" class="light"/><path d="m9 22-5 8 9-4m12-4 5 8-9-4M15 15h5"/>',
 magnet:'<path d="M5 3h8v15q0 5 4 5t4-5V3h8v16q0 13-12 13T5 19Z"/><path d="M5 7h8m8 0h8m-16 23 8-8" class="light"/>',
 void:'<path d="M3 6h28v23H3Z"/><path d="m4 28 10-13 5 4L31 3M7 10h7m8 15h5" class="light"/>',
 timepiece:'<circle cx="17" cy="18" r="12"/><path d="M17 9v10l7 4M12 2h10m-5 0v4M6 5 3 8m26-3 3 3" class="light"/>',
 power:'<path d="m6 16 7-8 6 3 6-3 7 8-5 13H10Z"/><path d="M12 17h13m-9-6-1 9m7-9 1 9" class="light"/>',
 fusion:'<path d="m7 4 10 8L27 4l4 9-9 9-5 10-5-10-9-9Z"/><path d="m7 13 10 7 10-7M17 12v8" class="light"/>',
 quill:'<path d="M6 30 25 3q8-4 6 5L11 28Z"/><path d="m11 24 13-9M14 19l10-3m-7-3 10-3M5 31h13" class="light"/>',
 memoryfragment:'<path d="M7 6Q0 16 7 27l4-3Q5 16 12 9Zm20 0q7 10 0 21l-4-3q6-8-1-15Z"/><path d="m17 7 6 10-6 10-6-10Z" class="light"/><path d="M17 10v14"/>',
 finalchapter:'<path d="M5 3h24v28H5Z"/><path d="m10 22 8-14 7 14M10 14h15m-8-6v18" class="light"/>',
 lastpage:'<path d="M6 2h22v30H6Z"/><path d="m9 10 4 3 4-8 4 8 4-3-3 10H12Z" class="light"/><path d="M11 25h12m-12 3h8"/>',
 blackhole:'<circle cx="17" cy="17" r="13"/><ellipse cx="17" cy="17" rx="16" ry="5" class="light"/><circle cx="17" cy="17" r="6"/><path d="M1 17h32" class="light"/>',
 spirit:'<path d="M17 3q-1 7 7 11l4-6q10 20-11 23Q0 30 4 15l7-9q0 9 6 11Z"/><path d="M17 14q10 15 0 15-8 0 0-15Z" class="light"/>',
 clone:'<path d="M5 16V7l7-4 7 4v9l-7 6Zm10 13v-8l7-4 7 4v9Z"/><path d="M4 31v-7l8-3 8 3m2-3 6 4" class="light"/>',
 energy:'<path d="m19 1-13 18h9l-2 14 15-20h-9Z"/><path d="m17 9-5 7h8l-3 8" class="light"/>',
 duration:'<path d="M8 3h18v5l-7 9 7 9v5H8v-5l7-9-7-9Z"/><path d="M11 7h12l-6 8Zm6 12 7 9H10Z" class="light"/>',
 area:'<circle cx="17" cy="17" r="6"/><path d="M17 1v8m0 16v8M1 17h8m16 0h8M5 5l6 6m12 12 6 6M5 29l6-6m12-12 6-6" class="light"/>',
 bolts:'<path d="m4 28 6-23 3 9Zm9 2 8-28 3 10Zm10-1 7-20 2 10Z"/><path d="M3 31h28" class="light"/>',
 path:'<path d="M4 29h8V19h10V9h8V3"/><path d="m24 5 6-2 2 6M7 26l3 3-3 3" class="light"/>',
};
const effectMotif={revGain:'energy',struggleGain:'energy',requipCooldown:'timepiece',erzaSwordCount:'bolts',hp:'heal',regen:'herbs',healing:'herbs',shield:'atfield',coinGain:'chest',masteryGain:'grimoire',rerolls:'scroll',vanishes:'void',magnet:'magnet',move:'headband',damage:'power',signatureDamage:'power',signatureCooldown:'timepiece',ultimateCooldown:'timepiece',ultimateDamage:'energy',ultimateDuration:'duration',ultimateArea:'area',signatureArea:'area',projectiles:'bolts',summonDuration:'duration',cloneCount:'clone',rageGain:'energy',rageDuration:'duration',predationGain:'void',fateGain:'timepiece',authorityGain:'memoryfragment',titanResistance:'atfield',poisonDuration:'herbs',startRank:'path'};
const treeSeals={denji:'<path d="m1 10 8-9 4 3-8 9Zm1-4 2 2m2-6 2 2m2-3 2 2"/>',guts:'<path d="m7 0-3 4 3 3-3 4 3 3m0-14 3 4-3 3 3 4-3 3"/>',erza:'<path d="m1 13 1-4L10 0h3v3L5 12Zm0-5 5 5M0 14l3-3"/>',general:'<path d="m1 7 6-6 6 6-6 6Z"/>',goku:'<path d="m1 11 2-9 3 5 2-7 4 11Z"/>',gojo:'<path d="M1 7Q7-1 13 7 7 15 1 7Z"/>',naruto:'<path d="M2 8a5 5 0 1 1 5 5H1m6-9q5 0 4 4T6 9"/>',madoka:'<path d="m7 0 2 5 5 2-5 2-2 5-2-5-5-2 5-2Z"/>',maomao:'<path d="M3 1h7v3L9 5v3l4 5H1l4-5V5L3 4Z"/>',shinji:'<path d="m1 2 4-2 2 7 2-7 4 2-1 11H2Z"/>',esdeath:'<path d="M7 0v14M1 3l12 8M1 11l12-8"/>',kurumi:'<circle cx="7" cy="7" r="6"/><path d="M7 3v4l4 2" class="light"/>',frieren:'<path d="m1 12 10-11 3 3L4 14ZM7 1h6v6"/>',samus:'<path d="M1 3h7v8H1Zm7 2h6v4H8Z"/>',megumi:'<path d="m0 2 5 4 2-6 2 6 5-4-3 10H3Z"/>',eren:'<path d="m1 0 11 10-2 2L0 2Zm12 0L2 10l2 2L14 2Z"/>',yuki:'<circle cx="7" cy="7" r="5"/><ellipse cx="7" cy="7" rx="7" ry="2" class="light"/>',diavolo:'<path d="m7 0 7 4-2 8-5 2-5-2L0 4Z"/><path d="m3 7 3 3 5-6" class="light"/>',rimuru:'<path d="M0 9Q1-1 7 1q7 0 7 8 0 5-7 5T0 9Z"/>',featherine:'<path d="M3 0Q-2 7 3 14l2-2Q1 7 6 2Zm8 0q5 7 0 14l-2-2q4-5-1-10Z"/>'};
for(const [tree,nodes]of Object.entries({general:GENERAL_TREE,...CHARACTER_TREES})){
 SKILL_ART[tree]??={};
 for(const [index,n]of nodes.entries())if(!SKILL_ART[tree][n.id]){
  const art=MOTIFS[n.icon]||MOTIFS[effectMotif[Object.keys(n.effect)[0]]]||MOTIFS.fusion;
  const rune=(index*7+tree.length)%11,cut=2+rune%4;
  SKILL_ART[tree][n.id]=`<g transform="translate(1 0) scale(.84)">${art}</g><g transform="translate(23 23) scale(.68)">${treeSeals[tree]||treeSeals.general}</g><path d="M${2+rune} 31h${cut}m${cut+2} 0h2" class="light"/>`;
 }
}
const COLORS={denji:['#d8915c','#f0e3b8'],guts:['#8a929d','#efb8a0'],erza:['#a9bac6','#f4d296'],featherine:['#a47bc4','#f2dcb2'],rimuru:['#6faecb','#f0dc9d'],diavolo:['#c1769a','#e7d9a0'],yuki:['#cc927c','#b8e2b9'],eren:['#5caa88','#ffe0a5'],megumi:['#8499d5','#e3efb6'],frieren:['#7bc7ab','#fff0b5'],samus:['#db9c5b','#c9edd0'],general:['#b390ec','#ffe3a0'],goku:['#e29a54','#fff0b2'],gojo:['#9f8ddd','#c4eeff'],naruto:['#62b995','#ffdf9a'],madoka:['#d98db8','#fff0d7'],maomao:['#80c69a','#f3e79b'],shinji:['#9b80c8','#d3ed9a'],esdeath:['#77afcf','#e2f9f8'],kurumi:['#ba6a85','#f5d29a']};
export function skillIcon(scope,node,character){
 const tree=scope==='general'?'general':character,art=SKILL_ART[tree]?.[node.id];if(!art)return '';
 const [a,b]=COLORS[tree];return `<svg class="item-icon skill-icon" data-skill-art="${tree}:${node.id}" viewBox="0 0 34 34" fill="${a}" stroke="#25263b" stroke-width="1.4" stroke-linejoin="round" stroke-linecap="round" aria-hidden="true">${art.replaceAll('class="light"',`fill="${b}"`)}</svg>`;
}
