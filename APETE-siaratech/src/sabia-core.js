export const TOPICS=['meal','drink','snack','breakfast','dessert','produce','catalog'];
export const ACTIONS=['recommend','alternative','refine','switch','fact','clarify'];

export function plain(text){return String(text||'').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[^a-z0-9$.,\s]/g,' ').replace(/\s+/g,' ').trim();}

function money(text){
  const clean=plain(text),values=[];
  for(const pattern of [/r\$\s*(\d+(?:[.,]\d{1,2})?)/g,/(\d+(?:[.,]\d{1,2})?)\s*reais?\b/g,/(?:ate|limite|orcamento|maximo)\D{0,12}(\d+(?:[.,]\d{1,2})?)/g]){
    for(const match of clean.matchAll(pattern))values.push(Math.round(Number(match[1].replace(',','.'))*100));
  }
  return values.length?Math.max(...values.filter(Number.isFinite)):null;
}

export function hardConstraints(current,previousUser=[]){
  const clean=plain(current),forgetBudget=/(?:sem|tira|remove|esquece|ignora)\s+(?:o\s+)?(?:limite|orcamento)/.test(clean)||/pode\s+(?:passar|ultrapassar)/.test(clean);
  let budget=forgetBudget?null:money(current),budgetExplicit=forgetBudget||budget!==null;
  if(!budgetExplicit){for(const text of [...previousUser].reverse()){budget=money(text);if(budget!==null)break;}}
  const exclusions=[];
  for(const match of clean.matchAll(/\b(?:sem|nao quero|evite)\s+(?:ser\s+)?(?:(?:da|de|do)\s+)?([a-z][a-z0-9-]*)/g))exclusions.push(match[1]);
  return {budget,budgetScope:/(?:sem contar|fora|nao inclua).{0,15}(?:entrega|taxa)|so\s+(?:os\s+)?produtos/.test(clean)?'products':'total',exclusions:[...new Set(exclusions)],budgetExplicit};
}

function has(clean,stems){return stems.some(stem=>clean.split(' ').some(word=>word.startsWith(stem)));}
export function localIntent(current,previous=null){
  const clean=plain(current),switching=has(clean,['agora','prefir','troca','esquec','verdade','melhor'])||/outra coisa/.test(clean),alternative=has(clean,['outr','diferent','mais'])||/nao gostei/.test(clean);
  let topic=null,components=[];
  const concepts=[['drink',['beb','sede','tomar','suco']],['meal',['almoc','jantar','refeic','prato','comida']],['breakfast',['cafe','manha','comec']],['dessert',['sobrem','doce','bolo']],['produce',['horta','hortal','verdura','legume','organic','produtor']],['snack',['lanch','tapioca','pao']]];
  for(const [name,stems] of concepts)if(has(clean,stems))components.push(name);
  components=[...new Set(components)];topic=components[0]||null;
  const fact=/(?:mais barato|mais caro|preco|taxa|disponiv|tem no catalogo|mais pedido|mais popular|mais vendido)/.test(clean);
  if(!topic&&alternative&&previous&&!switching){topic=previous.topic;components=previous.components||[];}
  const preferences=[];if(has(clean,['vegan']))preferences.push('vegano');if(has(clean,['vegetarian']))preferences.push('vegetariano');
  return {topic:topic||'catalog',action:fact?'fact':switching?'switch':alternative?'alternative':'recommend',categories:[],preferences,exclusions:[],components,serves:null,keepPreviousContext:!switching&&(alternative||!topic),confidence:topic||fact?0.78:0.35};
}

export function normalizeIntent(value,fallback){
  const raw=value&&typeof value==='object'?value:{};
  const topic=TOPICS.includes(raw.topic)?raw.topic:fallback.topic;
  const action=ACTIONS.includes(raw.action)?raw.action:fallback.action;
  const list=(key,allowed=null)=>Array.isArray(raw[key])?[...new Set(raw[key].filter(x=>typeof x==='string'&&(!allowed||allowed.includes(x))).slice(0,6))]:fallback[key]||[];
  return {topic,action,categories:list('categories'),preferences:list('preferences',['vegano','vegetariano']),exclusions:list('exclusions'),components:list('components',TOPICS.filter(x=>x!=='catalog')),serves:Number.isInteger(raw.serves)&&raw.serves>0&&raw.serves<=20?raw.serves:null,keepPreviousContext:Boolean(raw.keepPreviousContext),confidence:Math.max(0,Math.min(1,Number(raw.confidence)||0))};
}

export function parseJsonObject(text){
  const source=String(text||'').replace(/^```(?:json)?\s*/i,'').replace(/\s*```$/,'');
  const start=source.indexOf('{'),end=source.lastIndexOf('}');if(start<0||end<=start)return null;
  try{return JSON.parse(source.slice(start,end+1));}catch{return null;}
}

export function bundleTotal(items,mode,budgetScope='total'){
  const products=items.reduce((sum,item)=>sum+item.price,0);if(mode==='pickup'||budgetScope==='products')return products;
  const fees=new Map();for(const item of items)fees.set(item.storeId,item.fee);
  return products+[...fees.values()].reduce((sum,fee)=>sum+fee,0);
}
