export const TOPICS=['meal','drink','snack','breakfast','dessert','produce','catalog'];
export const ACTIONS=['recommend','list','alternative','refine','switch','fact','clarify','chat'];
export const FACTS=['none','cheapest','most_expensive','most_ordered','price','availability'];
export const MODIFIERS=['producer','garden','organic','juice','healthy','complete'];

export function plain(text){
 return String(text||'').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[^a-z0-9$.,\s-]/g,' ').replace(/\s+/g,' ').trim();
}
function tokens(text){return plain(text).split(/\s+/).filter(Boolean);}
function hasStem(text,stems){const list=tokens(text);return stems.some(stem=>list.some(word=>word.startsWith(stem)));}
function unique(list,max=8){return [...new Set(list)].slice(0,max);}

export function localIntent(current,previous=null){
 const clean=plain(current);
 const conversational=/^(?:(?:oi|ola|opa|e ai|ei|salve|bom dia|boa tarde|boa noite|tudo bem|blz|beleza|valeu|obrigad[oa])\b[\s,.!?]*)+$/.test(clean);
 const switching=hasStem(clean,['agora','prefir','troca','esquec','verdade'])||/pensando melhor|deixa (?:isso|esse|essa)|outra coisa/.test(clean);
 const alternative=hasStem(clean,['outr','diferent','alternativ'])||/\btem mais\b|\bmais op(?:cao|coes)\b|nao gostei/.test(clean);
 const listing=hasStem(clean,['list'])||/\b(?:mostra|mostre|quais|ver)\b.*\b(?:opcoes|itens|produtos|doces|bebidas|lanches)\b|\btodos?\b|\btodas?\b/.test(clean);
 let preferences=[];
 if(hasStem(clean,['vegan']))preferences.push('vegano');
 if(hasStem(clean,['vegetarian']))preferences.push('vegetariano');
 const modifiers=[];
 if(hasStem(clean,['produtor','roca']))modifiers.push('producer');
 if(hasStem(clean,['horta','hortal','verdura','legume']))modifiers.push('garden','producer');
 if(hasStem(clean,['organic']))modifiers.push('organic','producer');
 if(hasStem(clean,['suco']))modifiers.push('juice');
 if(hasStem(clean,['saudav']))modifiers.push('healthy');
 if(hasStem(clean,['complet','combo']))modifiers.push('complete');
 let components=[];
 if(/\bcafe da manha\b|\bdesjejum\b|comec\w* (?:bem )?o dia/.test(clean))components.push('breakfast');
 if(hasStem(clean,['almoc','jantar','refeic','prato','comida','rango']))components.push('meal');
 if(hasStem(clean,['sobrem','doce','bolo']))components.push('dessert');
 if(hasStem(clean,['lanch','tapioca','sandu','pao']))components.push('snack');
 if(hasStem(clean,['beb','sede','suco','refriger'])||(/\bcafe\b/.test(clean)&&!components.includes('breakfast')))components.push('drink');
 if(hasStem(clean,['horta','hortal','verdura','legume','organic','produtor','roca']))components.push('produce');
 components=unique(components,3);
 let topic=components[0]||'catalog';
 let fact='none';
 if(/mais barato|menor preco|mais em conta/.test(clean))fact='cheapest';
 else if(/mais caro|maior preco/.test(clean))fact='most_expensive';
 else if(/mais pedido|mais vendido|mais popular/.test(clean))fact='most_ordered';
 else if(/\bpreco\b|\bquanto custa\b/.test(clean))fact='price';
 else if(/disponiv|tem no catalogo/.test(clean))fact='availability';
 let action=conversational?'chat':fact!=='none'?'fact':switching?'switch':alternative?'alternative':listing?'list':'recommend';
 if(!conversational&&/\bdieta\b|\bregime\b/.test(clean)&&!preferences.length)action='clarify';
 if(topic==='catalog'&&previous&&!switching&&(alternative||action==='recommend')){
  topic=previous.topic||topic;
  components=previous.components||components;
  if(!preferences.length)preferences=[...(previous.preferences||[])];
  if(!modifiers.length)modifiers.push(...(previous.modifiers||[]));
 }
 return {topic,action,fact,categories:[],preferences:unique(preferences),modifiers:unique(modifiers),exclusions:[],searchTerms:[],components,serves:null,keepPreviousContext:Boolean(previous&&!switching&&!conversational&&(alternative||topic==='catalog')),confidence:conversational||topic!=='catalog'||fact!=='none'?0.78:0.35};
}

export function normalizeIntent(value,fallback=localIntent('')){
 const raw=value&&typeof value==='object'&&!Array.isArray(value)?value:{};
 const topic=TOPICS.includes(raw.topic)?raw.topic:fallback.topic;
 const action=ACTIONS.includes(raw.action)?raw.action:fallback.action;
 const fact=FACTS.includes(raw.fact)?raw.fact:(fallback.fact||'none');
 const keepPreviousContext=Boolean(raw.keepPreviousContext)||['alternative','refine'].includes(action);
 const list=(key,allowed=null,max=8)=>{
  let source=Array.isArray(raw[key])?raw[key]:fallback[key]||[];
  if(keepPreviousContext&&Array.isArray(raw[key])&&!raw[key].length&&Array.isArray(fallback[key])&&fallback[key].length)source=fallback[key];
  const cleaned=source.filter(x=>typeof x==='string').map(x=>plain(x)).filter(Boolean).filter(x=>!allowed||allowed.includes(x));
  return unique(cleaned,max);
 };
 const preferences=list('preferences',['vegano','vegetariano'],4);
 const modifiers=list('modifiers',MODIFIERS,6);
 const exclusions=list('exclusions',null,6).map(x=>x.slice(0,48));
 const searchTerms=list('searchTerms',null,6).map(x=>x.slice(0,48));
 let components=list('components',TOPICS.filter(x=>x!=='catalog'),3);
 if(!components.length&&topic!=='catalog')components=[topic];
 const serves=Number.isInteger(raw.serves)&&raw.serves>0&&raw.serves<=20?raw.serves:(Number.isInteger(fallback.serves)?fallback.serves:null);
 const resolvedAction=action==='clarify'&&preferences.length?'recommend':action;
 return {topic,action:resolvedAction,fact,categories:list('categories',null,6),preferences,modifiers,exclusions,searchTerms,components,serves,keepPreviousContext,confidence:Math.max(0,Math.min(1,Number(raw.confidence)||0))};
}

export function bundleTotal(items,mode,budgetScope='total'){
 const cents=(item,key,reaisKey)=>{
  if(Number.isFinite(item?.[key]))return Math.round(Number(item[key]));
  const value=Number(item?.[reaisKey]);
  return Number.isFinite(value)?Math.round(value*100):0;
 };
 const products=items.reduce((sum,item)=>sum+cents(item,'price','priceReais'),0);
 if(mode==='pickup'||budgetScope==='products')return products;
 const fees=new Map();
 for(const item of items)fees.set(item.storeId,cents(item,'fee','feeReais'));
 return products+[...fees.values()].reduce((sum,fee)=>sum+fee,0);
}
