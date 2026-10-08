export const TOPICS=['meal','drink','snack','breakfast','dessert','produce','catalog'];
export const ACTIONS=['recommend','list','alternative','refine','switch','fact','clarify','confirm','chat'];
export const FACTS=['none','cheapest','most_expensive','most_ordered','price','availability','delivery_fee'];
export const CONFIDENCE={low:0.42,medium:0.62,high:0.78};
export const MODIFIERS=['producer','garden','organic','juice','healthy','complete'];

export function plain(text){
 return String(text||'').normalize('NFKD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/([aeiou])\1+/g,'$1').replace(/([b-df-hj-np-tv-z])\1{2,}/g,'$1').replace(/[^a-z0-9$.,\s-]/g,' ').replace(/\s+/g,' ').trim();
}
function tokens(text){return plain(text).split(/\s+/).filter(Boolean);}
function hasStem(text,stems){const list=tokens(text);return stems.some(stem=>list.some(word=>word.startsWith(stem)));}
function editDistance(a,b){
 if(a===b)return 0;
 if(!a.length)return b.length;if(!b.length)return a.length;
 const prev=Array.from({length:b.length+1},(_,i)=>i),next=new Array(b.length+1);
 for(let i=1;i<=a.length;i++){
  next[0]=i;
  for(let j=1;j<=b.length;j++)next[j]=Math.min(next[j-1]+1,prev[j]+1,prev[j-1]+(a[i-1]===b[j-1]?0:1));
  for(let j=0;j<=b.length;j++)prev[j]=next[j];
 }
 return prev[b.length];
}
function hasNearWord(text,words,maxDistance=null){
 const list=tokens(text);
 return words.some(target=>list.some(word=>{
  if(word===target)return true;
  const allowed=maxDistance??(target.length>=7?2:target.length>=4?1:0);
  if(!allowed||word.length<3||Math.abs(word.length-target.length)>allowed)return false;
  if(word[0]!==target[0])return false;
  return editDistance(word,target)<=allowed;
 }));
}
function isAffirmative(text){
 const list=tokens(text);
 if(!list.length||list.length>5)return false;
 const noise=new Set(['pode','podee','por','favor','pfv','sugere','sugerir','manda','mandar','quero','claro','isso','ai','aí','blz','beleza']);
 const meaningful=list.filter(word=>!noise.has(word));
 if(!meaningful.length&&list.some(word=>['pode','claro','manda','sugere','sugerir'].includes(word)))return true;
 const shortYes=new Set(['s','ss','si','sim','sin','cim','ci','yes','yep']);
 return meaningful.every(word=>shortYes.has(word)||hasNearWord(word,['sim'],1));
}
function unique(list,max=8){return [...new Set(list)].slice(0,max);}

export function localIntent(current,previous=null){
 const clean=plain(current);
 const conversational=/^(?:(?:oi|ola|opa|e ai|ei|salve|bom dia|boa tarde|boa noite|tudo bem|blz|beleza|valeu|obrigad[oa])\b[\s,.!?]*)+$/.test(clean)
  ||tokens(clean).length<=4&&(hasNearWord(clean,['oi','ola','opa','salve'],1)||hasNearWord(clean,['bom','boa'],1)&&hasNearWord(clean,['dia','tarde','noite'],1));
 const constraintOnlyReset=/(?:esquec\w*|tir\w*|remov\w*|ignor\w*)\s+(?:o\s+)?(?:limite|teto|orcamento)\b/.test(clean);
 const switching=!constraintOnlyReset&&(hasStem(clean,['agora','prefir','troca','esquec','verdade','mudei','melhor'])||hasNearWord(clean,['agora','prefiro','troca','esquece','verdade','mudei','melhor'])||/pensando melhor|deixa (?:isso|esse|essa)|outra coisa/.test(clean));
 const alternative=hasStem(clean,['outr','diferent','alternativ'])||/\btem mais\b|\bmais op(?:cao|coes)\b|nao gostei/.test(clean)||(previous&&tokens(clean).length<=3&&tokens(clean).includes('mais'));
 const listing=hasStem(clean,['list'])||/\b(?:mostra|mostre|quais|ver)\b.*\b(?:opcoes|itens|produtos|doces|bebidas|lanches)\b|\btodos?\b|\btodas?\b|\b(?:so|somente|apenas)\s+(?:tem|existe)\b|\b(?:e|eh)\s+(?:so|somente|apenas)\s+(?:esse|essa|isso|esses|essas)\b/.test(clean);
 let preferences=[];
 if(hasStem(clean,['vegan']))preferences.push('vegano');
 if(hasStem(clean,['vegetarian']))preferences.push('vegetariano');
 const exclusions=[];
 for(const pattern of [
  /\bsem\s+(?!(?:entrega|frete|taxa|limite|teto|orcamento|contar|incluir|considerar)\b)(?:nada\s+de\s+)?(?:o\s+|a\s+|os\s+|as\s+)?([a-z][a-z0-9-]{2,})/g,
  /\bnao\s+(?:quero|gosto|curto)(?:\s+de)?\s+(?:o\s+|a\s+|os\s+|as\s+)?([a-z][a-z0-9-]{2,})/g,
  /\b(?:evita|evite|evitar|tira|tire|tirar|retira|retire|retirar|exclui|excluir)\s+(?:o\s+|a\s+|os\s+|as\s+)?([a-z][a-z0-9-]{2,})/g
 ]){
  for(const match of clean.matchAll(pattern))if(!['limite','teto','orcamento','entrega','frete','taxa','contar','incluir','considerar'].includes(match[1]))exclusions.push(match[1]);
 }
 const peopleWords={um:1,uma:1,dois:2,duas:2,tres:3,quatro:4,cinco:5,seis:6,sete:7,oito:8,nove:9,dez:10};
 const servesMatch=clean.match(/\b(?:para|pra)\s+(\d{1,2}|um|uma|dois|duas|tres|quatro|cinco|seis|sete|oito|nove|dez)\s+(?:pessoas?|gente)\b/)||clean.match(/\bsomos\s+(\d{1,2}|dois|duas|tres|quatro|cinco|seis|sete|oito|nove|dez)\b/);
 const serves=servesMatch?Math.min(20,Number(servesMatch[1])||peopleWords[servesMatch[1]]||0)||null:null;
 const modifiers=[];
 if(hasStem(clean,['produtor','roca'])||hasNearWord(clean,['produtor','roca']))modifiers.push('producer');
 if(hasStem(clean,['horta','hortal','verdura','legume']))modifiers.push('garden','producer');
 if(hasStem(clean,['organic']))modifiers.push('organic','producer');
 if(hasStem(clean,['suco']))modifiers.push('juice');
 if(hasStem(clean,['saudav']))modifiers.push('healthy');
 if(hasStem(clean,['complet','combo']))modifiers.push('complete');
 let components=[];
 if(/\bcafe da manha\b|\bdesjejum\b|comec\w* (?:bem )?o dia/.test(clean)||hasNearWord(clean,['desjejum','matinal','comecar']))components.push('breakfast');
 if(hasStem(clean,['almoc','jantar','refeic','prato','comida','rango','marmita','pizza'])||hasNearWord(clean,['almoco','jantar','refeicao','prato','comida','rango','marmita','pizza']))components.push('meal');
 if(hasStem(clean,['sobrem','doce','bolo','docinh'])||hasNearWord(clean,['sobremesa','doce','bolo','docinho']))components.push('dessert');
 if(hasStem(clean,['lanch','tapioca','sandu','pao','salgad','petisc'])||hasNearWord(clean,['lanche','tapioca','sanduiche','pao','salgado','petisco']))components.push('snack');
 if(hasStem(clean,['beb','sede','suco','refriger','refri','agua','tomar'])||hasNearWord(clean,['bebida','beber','suco','refrigerante','refri','agua','tomar'])||(/\bcafe\b/.test(clean)&&!components.includes('breakfast')))components.push('drink');
 if(hasStem(clean,['horta','hortal','verdura','legume','organic','produtor','roca'])||hasNearWord(clean,['horta','hortalica','verdura','legume','organico','produtor','roca']))components.push('produce');
 components=unique(components,3);
 let topic=components[0]||'catalog';
 let fact='none';
 if(/\b(?:quanto|qual|valor|custa|custam)\b.{0,18}\b(?:entrega|taxa|frete)\b|\b(?:entrega|taxa|frete)\b.{0,18}\b(?:quanto|qual|valor|custa|custam)\b|^(?:e\s+(?:a|o)\s+)?(?:entrega|taxa|frete)\??$/.test(clean))fact='delivery_fee';
 else if(/mais barato|menor preco|mais em conta/.test(clean))fact='cheapest';
 else if(/mais caro|maior preco/.test(clean))fact='most_expensive';
 else if(/mais pedido|mais vendido|mais popular/.test(clean))fact='most_ordered';
 else if(/\bpreco\b|\bquanto (?:custa|fica|sai)\b|\bqual (?:e )?(?:o )?valor\b/.test(clean))fact='price';
 else if(!alternative&&!listing&&/\b(?:tem|ha|existe|disponiv|vende|vendem|oferece|oferecem)\b/.test(clean))fact='availability';
 const affirmative=isAffirmative(clean);
 let action=conversational?'chat':fact!=='none'?'fact':switching?'switch':alternative?'alternative':constraintOnlyReset?'refine':listing?'list':affirmative&&components.length===0?'confirm':'recommend';
 if(!conversational&&action!=='confirm'&&(/\bdieta\b|\bregime\b/.test(clean)||modifiers.includes('healthy'))&&!preferences.length)action='clarify';
 let searchTerms=[];
 if(['availability','price'].includes(fact)&&!preferences.length){
  const stop=new Set(['tem','nao','sim','aqui','isso','esse','essa','esses','essas','algo','alguma','coisa','pra','para','com','sem','uma','uns','umas','voces','vcs','catalogo','disponivel','disponiveis','vende','vendem','oferece','oferecem','existe','qual','quais','quanto','quantos','custa','custam','preco','valor','reais']);
  searchTerms=tokens(clean).filter(word=>word.length>=3&&!stop.has(word)&&!/^(?:r\$)?\d/.test(word)).slice(0,4);
 }
 const inherited=Boolean(topic==='catalog'&&previous&&!switching&&!conversational&&(alternative||action==='recommend'||action==='refine'||action==='list'||action==='confirm'||action==='fact'));
 if(inherited){
  topic=previous.topic||topic;
  components=previous.components||components;
  if(!preferences.length)preferences=[...(previous.preferences||[])];
  if(!modifiers.length)modifiers.push(...(previous.modifiers||[]));
  exclusions.push(...(previous.exclusions||[]));
 }
 const resolvedServes=serves||(inherited&&Number.isInteger(previous?.serves)?previous.serves:null);
 const confidence=conversational||fact!=='none'?0.9:components.length||preferences.length||modifiers.length||exclusions.length||resolvedServes?0.82:inherited?0.62:0.18;
 return {topic,action,fact,categories:[],preferences:unique(preferences),modifiers:unique(modifiers),exclusions:unique(exclusions,6),searchTerms:unique(searchTerms,4),components,serves:resolvedServes,keepPreviousContext:inherited,confidence};
}

export function normalizeIntent(value,fallback=localIntent('')){
 const raw=value&&typeof value==='object'&&!Array.isArray(value)?value:{};
 const topic=TOPICS.includes(raw.topic)?raw.topic:fallback.topic;
 const action=ACTIONS.includes(raw.action)?raw.action:fallback.action;
 const fact=FACTS.includes(raw.fact)?raw.fact:(fallback.fact||'none');
 const keepPreviousContext=Boolean(raw.keepPreviousContext)||['alternative','refine','confirm'].includes(action);
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
 const quantity=item=>Number.isInteger(item?.quantity)&&item.quantity>0?item.quantity:1;
 const products=items.reduce((sum,item)=>sum+cents(item,'price','priceReais')*quantity(item),0);
 if(mode==='pickup'||budgetScope==='products')return products;
 const fees=new Map();
 for(const item of items)fees.set(item.storeId,cents(item,'fee','feeReais'));
 return products+[...fees.values()].reduce((sum,fee)=>sum+fee,0);
}
