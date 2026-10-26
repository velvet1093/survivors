import test from 'node:test';
import assert from 'node:assert/strict';
import {enemyPixels} from '../src/pixel-enemies.js';
import {enemyMotion} from '../src/enemy-animation.js';
import {MOTHER_BRAIN_WALKING_ART as colors} from '../src/metroid-pixels.js';

const region=(pixels,x,y,w,h)=>Array.from({length:h},(_,dy)=>pixels.slice((y+dy)*56+x,(y+dy)*56+x+w)).flat();
const colored=(pixels,...colors)=>pixels.filter(color=>colors.includes(color)).length;

test('Mother Brain walking form has a separate exposed brain, forward eye and jaw, ribbed thorax, neural neck and skeletal legs',()=>{
 const tank=enemyPixels('motherbrain'),walking=enemyPixels('motherbrain',{enraged:1}),c=colors;
 assert.equal(walking.length,56*76);assert.ok(walking.filter(Boolean).length>1800);assert.notDeepEqual(walking,tank);
 assert.ok(colored(region(walking,29,2,26,23),c.brain,c.brainShade,c.brainLight)>250,'the exposed folded brain projects well forward of the hunched body');
 assert.ok(colored(region(walking,8,25,22,26),c.rib,c.ribShade)>120,'rust colored ribs cross the recessed thorax');
 assert.ok(colored(region(walking,20,14,12,20),c.bone,c.boneShade,c.boneLight)>100,'a pale segmented neck supports the separate head');
 assert.ok(colored(region(walking,6,54,42,20),c.bone,c.boneShade,c.boneLight)>300,'bent skeletal legs end in long taloned feet');
 assert.ok(colored(region(walking,40,15,14,9),c.eye,c.iris)>15,'the cyclopean eye is in the forward face');
 assert.ok(colored(region(walking,36,24,18,10),c.cavity)>15,'a separate toothy jaw sits below the eye');
 assert.equal(colored(tank,c.hide,c.rib,c.brain),0,'the opening glass tank retains its original brain artwork');
});

test('Mother Brain braces and holds her jaw open throughout a warned cast, including reduced motion',()=>{
 const idle={archetype:'motherbrain',enraged:true,moving:true,phase:0};
 assert.notDeepEqual(enemyPixels('motherbrain',enemyMotion(idle,.15)),enemyPixels('motherbrain',enemyMotion(idle,.75)),'bent legs transfer weight slowly while walking');
 const casting={...idle,moving:false,attackAnim:0,windup:1.1,motherBrainAttack:{style:'beam',age:.6}};
 for(const quiet of [false,true]){
  const pose=enemyMotion(casting,.75,quiet);assert.ok(pose.attack>0,'the full warning keeps the mouth open after attackAnim expires');assert.equal(pose.leg,0);assert.equal(pose.rotation,0);
  assert.notDeepEqual(enemyPixels('motherbrain',pose),enemyPixels('motherbrain',{enraged:1}));
 }
 const stomp=enemyMotion({...casting,motherBrainAttack:{style:'stomp',age:.2}},.75);assert.ok(Math.abs(stomp.leg)>1,'crushing steps lift a bent leg');
 const tank=enemyMotion({...casting,enraged:false},.75);assert.equal(tank.leg,0);assert.equal(tank.arm,0);
});
