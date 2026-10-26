import {ERZA_FORMS} from './erza.js';

// These are appearances of one shared Requip weapon, not extra inventory slots.
const equipment={
 base:{name:'Heart Kreuz Sword',icon:'erza-heartkreuz-blade',description:'A balanced forward cleave with Erza’s single silver sword.'},
 wheel:{name:'Heaven’s Wheel Blades',icon:'erza-wheel-blades',description:'A fan of piercing silver swords attacks enemies at range.'},
 blackwing:{name:'Black Wing Sword',icon:'erza-blackwing-sword',description:'A dark greatsword cleaves nearby enemies and leaves them bleeding.'},
 adamantine:{name:'Adamantine Twin Shields',icon:'erza-adamantine-shields',description:'Paired heavy shields bash and briefly stun enemies in front of Erza.'},
};
export function erzaWeaponAppearance(g,{next=false,fused}={}){
 if(g?.p?.id!=='erza')return null;
 const raw=g.mechanic?.form??g.p.erzaForm??3;
 let index=Number.isInteger(raw)&&ERZA_FORMS[raw]?raw:3;
 if(next)index=(index+1)%ERZA_FORMS.length;
 const form=ERZA_FORMS[index],look=equipment[form.id],awakened=fused??!!g.p.fusions?.requip;
 return {...look,form:form.id,index,color:form.color,icon:look.icon+(awakened?'-arsenal':''),fused:awakened,description:look.description+(awakened?' Heaven’s Arsenal strengthens this form.':'')+' All armor forms share Requip’s level and evolution.'};
}
