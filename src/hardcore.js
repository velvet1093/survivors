// Signature weapons stay tied to the hero definition, including secondary and
// alternate-form weapons. Only the hero's own starting passive is available.
export function signatureWeaponIds(hero){
 return [...new Set([hero?.weapon,hero?.secondWeapon,hero?.formWeapon].filter(Boolean))];
}
export function signaturePassiveIds(hero){return [hero?.passive].filter(Boolean);}
export function initializeHardcore(g,hero=g.p){
 g.mode='hardcore';g.p.hardcore=true;g.p.signatureWeapons=signatureWeaponIds(hero);g.p.signaturePassives=signaturePassiveIds(hero);return g;
}
