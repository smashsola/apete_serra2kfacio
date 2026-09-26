// APETÊ / Cloudflare Pages Advanced Mode. Public catalogue = demonstration data.
// Keep GROQ_API_KEY and GEMINI_API_KEY only in Cloudflare Worker Secrets.
const CATALOG={"stores":[{"id":1,"name":"Casa do Baião","category":"Comida regional","city":"Guaraciaba do Norte","fee":600,"open":true,"producer":false,"cover":"assets/images/cover-casa.webp","desc":"Pratos regionais, baião de dois, almoço executivo e combinações para compartilhar.","hero":"Baião, galinha caipira e comida de casa com aquele tempero da Serra.","demo":true,"serviceAreas":["Guaraciaba do Norte"],"delivery":true,"pickup":true},{"id":2,"name":"Forno & Afeto","category":"Padaria artesanal","city":"Guaraciaba do Norte","fee":450,"open":true,"producer":false,"cover":"assets/images/cover-forno.webp","desc":"Pães, bolos, tapiocas, cafés e opções frescas para o café da manhã e da tarde.","hero":"Pães quentinhos, bolos e café passado na hora.","demo":true,"serviceAreas":["Guaraciaba do Norte"],"delivery":true,"pickup":true},{"id":3,"name":"Quintal da Serra","category":"Cozinha caseira","city":"São Benedito","fee":700,"open":true,"producer":false,"cover":"assets/images/cover-quintal.webp","desc":"Comida caseira, marmitas, caldinhos e pratos bem servidos para o almoço ou jantar.","hero":"Receitas caseiras e porções que lembram comida de família.","demo":true,"serviceAreas":["São Benedito"],"delivery":true,"pickup":true},{"id":4,"name":"Sítio Boa Vista","category":"Produtor local","city":"Guaraciaba do Norte","fee":500,"open":true,"producer":true,"cover":"assets/images/cover-sitio.webp","desc":"Hortaliças, frutas e produtos artesanais colhidos na Serra e enviados com frescor.","hero":"Frutas, verduras e produtos da roça direto para a sua mesa.","demo":true,"serviceAreas":["Guaraciaba do Norte"],"delivery":true,"pickup":true},{"id":5,"name":"Serra Verde Orgânicos","category":"Produtor local","city":"Ibiapina","fee":550,"open":true,"producer":true,"cover":"assets/images/cover-serraverde.webp","desc":"Cestas, legumes, mel e itens naturais de pequenos produtores da região.","hero":"Orgânicos selecionados e cestas prontas para a semana.","demo":true,"serviceAreas":["Ibiapina"],"delivery":true,"pickup":true}],"products":[{"id":1,"storeId":1,"name":"Baião da casa para dois","desc":"Baião de dois, frango grelhado, macaxeira e salada.","cat":"Regional","price":6200,"stock":20,"image":"assets/images/prod-baiao.webp","oldPrice":0,"lastBatch":false,"demo":true,"available":true,"serves":2,"preferences":[],"offer":null},{"id":2,"storeId":1,"name":"Galinha caipira com pirão","desc":"Prato completo com arroz, pirão e salada da casa.","cat":"Regional","price":3600,"stock":14,"image":"assets/images/prod-galinha.webp","oldPrice":0,"lastBatch":false,"demo":true,"available":true,"serves":null,"preferences":[],"offer":null},{"id":3,"storeId":1,"name":"Escondidinho de carne","desc":"Purê de macaxeira, carne desfiada e queijo dourado.","cat":"Regional","price":3100,"stock":16,"image":"assets/images/prod-escondidinho.webp","oldPrice":3900,"lastBatch":true,"demo":true,"available":true,"serves":null,"preferences":[],"offer":{"startsAt":null,"endsAt":null,"note":"O catálogo original não informa validade. Não anunciar como oferta válida até cadastrar as datas."}},{"id":4,"storeId":1,"name":"Macaxeira dourada","desc":"Porção crocante para compartilhar.","cat":"Acompanhamentos","price":1600,"stock":22,"image":"assets/images/prod-macaxeira.webp","oldPrice":0,"lastBatch":false,"demo":true,"available":true,"serves":null,"preferences":[],"offer":null},{"id":5,"storeId":1,"name":"Suco de acerola","desc":"Copo de 400 ml preparado na hora.","cat":"Bebidas","price":900,"stock":30,"image":"assets/images/prod-acerola.webp","oldPrice":1200,"lastBatch":true,"demo":true,"available":true,"serves":null,"preferences":[],"offer":{"startsAt":null,"endsAt":null,"note":"O catálogo original não informa validade. Não anunciar como oferta válida até cadastrar as datas."}},{"id":6,"storeId":2,"name":"Pão de fermentação lenta","desc":"Pão artesanal de 400 g, casca crocante e miolo macio.","cat":"Padaria","price":1800,"stock":18,"image":"assets/images/prod-pao.webp","oldPrice":2400,"lastBatch":true,"demo":true,"available":true,"serves":null,"preferences":[],"offer":{"startsAt":null,"endsAt":null,"note":"O catálogo original não informa validade. Não anunciar como oferta válida até cadastrar as datas."}},{"id":7,"storeId":2,"name":"Bolo de milho caseiro","desc":"Fatia generosa, fofinha e com gostinho de interior.","cat":"Doces","price":1500,"stock":20,"image":"assets/images/prod-bolo-milho.webp","oldPrice":0,"lastBatch":false,"demo":true,"available":true,"serves":null,"preferences":[],"offer":null},{"id":8,"storeId":2,"name":"Tapioca com queijo coalho","desc":"Tapioca recheada, feita na chapa e servida quentinha.","cat":"Padaria","price":1300,"stock":24,"image":"assets/images/prod-tapioca.webp","oldPrice":0,"lastBatch":false,"demo":true,"available":true,"serves":null,"preferences":[],"offer":null},{"id":9,"storeId":2,"name":"Café coado","desc":"Café passado na hora, copo de 200 ml.","cat":"Bebidas","price":600,"stock":35,"image":"assets/images/prod-cafe-coado.webp","oldPrice":0,"lastBatch":false,"demo":true,"available":true,"serves":null,"preferences":[],"offer":null},{"id":10,"storeId":2,"name":"Combo café da manhã","desc":"Pão, bolo de milho e café para começar bem o dia.","cat":"Padaria","price":2400,"stock":10,"image":"assets/images/prod-combo-cafe.webp","oldPrice":3200,"lastBatch":true,"demo":true,"available":true,"serves":null,"preferences":[],"offer":{"startsAt":null,"endsAt":null,"note":"O catálogo original não informa validade. Não anunciar como oferta válida até cadastrar as datas."}},{"id":11,"storeId":3,"name":"Prato da Serra","desc":"Arroz, feijão, frango, legumes e salada.","cat":"Caseiro","price":2800,"stock":18,"image":"assets/images/prod-prato-serra.webp","oldPrice":0,"lastBatch":false,"demo":true,"available":true,"serves":null,"preferences":[],"offer":null},{"id":12,"storeId":3,"name":"Caldinho de feijão","desc":"Porção de 350 ml, ideal para o fim da tarde.","cat":"Caseiro","price":1500,"stock":20,"image":"assets/images/prod-caldinho.webp","oldPrice":0,"lastBatch":false,"demo":true,"available":true,"serves":null,"preferences":[],"offer":null},{"id":13,"storeId":3,"name":"Almoço vegetariano","desc":"Arroz, feijão verde, legumes e salada fresca.","cat":"Vegetariano","price":2600,"stock":16,"image":"assets/images/prod-almoco-veg.webp","oldPrice":0,"lastBatch":false,"demo":true,"available":true,"serves":null,"preferences":["vegetariano"],"offer":null},{"id":14,"storeId":3,"name":"Panelada da Serra","desc":"Prato forte e bem temperado, servido com arroz.","cat":"Regional","price":3400,"stock":8,"image":"assets/images/prod-panelada.webp","oldPrice":4300,"lastBatch":true,"demo":true,"available":true,"serves":null,"preferences":[],"offer":{"startsAt":null,"endsAt":null,"note":"O catálogo original não informa validade. Não anunciar como oferta válida até cadastrar as datas."}},{"id":15,"storeId":3,"name":"Suco de cajá","desc":"Copo de 400 ml, preparado com fruta natural.","cat":"Bebidas","price":900,"stock":25,"image":"assets/images/prod-caja.webp","oldPrice":0,"lastBatch":false,"demo":true,"available":true,"serves":null,"preferences":[],"offer":null},{"id":16,"storeId":4,"name":"Banana da estação","desc":"Um quilo de bananas frescas da região.","cat":"Do produtor","price":700,"stock":30,"image":"assets/images/prod-banana.webp","oldPrice":0,"lastBatch":false,"demo":true,"available":true,"serves":null,"preferences":[],"offer":null},{"id":17,"storeId":4,"name":"Café da Serra","desc":"Café torrado e moído, pacote de 250 g.","cat":"Do produtor","price":2200,"stock":15,"image":"assets/images/prod-cafe-serra.webp","oldPrice":0,"lastBatch":false,"demo":true,"available":true,"serves":null,"preferences":[],"offer":null},{"id":18,"storeId":4,"name":"Geleia de goiaba","desc":"Pote artesanal de 250 g, produção local.","cat":"Do produtor","price":1700,"stock":14,"image":"assets/images/prod-geleia-goiaba.webp","oldPrice":0,"lastBatch":false,"demo":true,"available":true,"serves":null,"preferences":[],"offer":null},{"id":19,"storeId":4,"name":"Cesta de hortaliças","desc":"Mix com alface, tomate, coentro e cheiro-verde.","cat":"Do produtor","price":2900,"stock":10,"image":"assets/images/prod-cesta-hortalicas.webp","oldPrice":0,"lastBatch":false,"demo":true,"available":true,"serves":null,"preferences":[],"offer":null},{"id":20,"storeId":4,"name":"Tomate da horta","desc":"Tomates selecionados, vendidos por quilo.","cat":"Do produtor","price":1000,"stock":24,"image":"assets/images/prod-tomate.webp","oldPrice":0,"lastBatch":false,"demo":true,"available":true,"serves":null,"preferences":[],"offer":null},{"id":21,"storeId":5,"name":"Cesta orgânica semanal","desc":"Legumes e verduras da semana, pronta para a família.","cat":"Do produtor","price":3900,"stock":8,"image":"assets/images/prod-cesta-organica.webp","oldPrice":0,"lastBatch":false,"demo":true,"available":true,"serves":null,"preferences":[],"offer":null},{"id":22,"storeId":5,"name":"Mel da região","desc":"Pote de mel puro com 300 g.","cat":"Do produtor","price":2000,"stock":16,"image":"assets/images/prod-mel.webp","oldPrice":0,"lastBatch":false,"demo":true,"available":true,"serves":null,"preferences":[],"offer":null},{"id":23,"storeId":5,"name":"Alface crespa","desc":"Maço fresco, colhido no dia.","cat":"Do produtor","price":500,"stock":30,"image":"assets/images/prod-alface.webp","oldPrice":0,"lastBatch":false,"demo":true,"available":true,"serves":null,"preferences":[],"offer":null},{"id":24,"storeId":5,"name":"Cenoura orgânica","desc":"Pacote com 500 g de cenouras selecionadas.","cat":"Do produtor","price":800,"stock":25,"image":"assets/images/prod-cenoura.webp","oldPrice":0,"lastBatch":false,"demo":true,"available":true,"serves":null,"preferences":[],"offer":null},{"id":25,"storeId":5,"name":"Queijo coalho artesanal","desc":"Peça de 250 g produzida na região.","cat":"Do produtor","price":1800,"stock":12,"image":"assets/images/prod-queijo-coalho.webp","oldPrice":0,"lastBatch":false,"demo":true,"available":true,"serves":null,"preferences":[],"offer":null}],"cities":["Guaraciaba do Norte","Tianguá","São Benedito","Ubajara","Ibiapina","Viçosa do Ceará","Carnaubal","Croatá","Ipu"],"schemaVersion":1};
const byStore=new Map(CATALOG.stores.map(s=>[s.id,s]));
const productById=new Map(CATALOG.products.map(p=>[p.id,p]));
const enc=new TextEncoder();
const response=(data,status=200,extra={})=>new Response(JSON.stringify(data),{status,headers:{'Content-Type':'application/json; charset=utf-8','Cache-Control':'no-store','X-Content-Type-Options':'nosniff',...extra}});
const failure=(code,message,status=503,retryAfter=0)=>response({error:{code,message,retryAfter},mode:'unavailable'},status,retryAfter?{'Retry-After':String(retryAfter)}:{});
function bytesHex(buf){return Array.from(new Uint8Array(buf)).map(b=>b.toString(16).padStart(2,'0')).join('');}
async function sign(value,secret){const key=await crypto.subtle.importKey('raw',enc.encode(secret),{name:'HMAC',hash:'SHA-256'},false,['sign']);return bytesHex(await crypto.subtle.sign('HMAC',key,enc.encode(value)));}
function cookie(req,key){return req.headers.get('Cookie')?.split(';').map(x=>x.trim()).find(x=>x.startsWith(key+'='))?.slice(key.length+1)||'';}
function randomHex(size=16){return bytesHex(crypto.getRandomValues(new Uint8Array(size)));}
function safeId(v){return typeof v==='string'&&/^[0-9a-f]{32}$/.test(v);}
function validCity(city){return typeof city==='string'&&CATALOG.cities.includes(city);}
function canServe(store,city,mode){return mode==='pickup'?store.city===city&&store.pickup===true:store.delivery===true&&store.serviceAreas.includes(city);}
function centsPrice(p){if(p.lastBatch&&p.oldPrice>p.price){let a=Date.parse(p.offer?.startsAt),b=Date.parse(p.offer?.endsAt),now=Date.now();if(!Number.isFinite(a)||!Number.isFinite(b)||now<a||now>=b)return p.oldPrice;}return p.price;}
function productInfo(p,city,mode){let s=byStore.get(p.storeId);if(!s||!canServe(s,city,mode))return null;let fee=mode==='pickup'?0:s.fee, price=centsPrice(p);return {id:p.id,storeId:s.id,name:p.name,description:p.desc,category:p.cat,price,stock:p.stock,available:p.available!==false&&s.open===true&&p.stock>0,image:p.image,storeName:s.name,city:s.city,serviceAreas:s.serviceAreas,fee,total:price+fee,serves:p.serves,preferences:p.preferences||[],demo:true};}
async function postBody(req){let raw=await req.text();if(raw.length>5000)throw {code:'size',message:'Mensagem muito grande.',status:413};let data;try{data=JSON.parse(raw);}catch{throw {code:'json',message:'Formato inválido.',status:400};}if(!data||Array.isArray(data)||typeof data!=='object')throw {code:'json',message:'Dados inválidos.',status:400};return data;}
function messagesFor(body){const previous=Array.isArray(body.history)?body.history:[];return previous.slice(-6).filter(m=>m&&['user','assistant'].includes(m.role)&&typeof m.content==='string').map(m=>({role:m.role,content:m.content.slice(0,750)}));}
function normalizedWords(text){return String(text||'').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').split(/\W+/).filter(word=>word.length>=3);}
function normalizedText(text){return String(text||'').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'');}
function requestConstraints(text){
 const clean=normalizedText(text);let budget=null,budgetChanged=false,budgetScope=null;
 // Process budget events in sentence order; a relaxation must not become a new cap.
 const events=[];
 const removal=/\b(?:pode(?:m)?\s+(?:passar|ultrapassar|exceder)(?:\s+(?:de|dos?))?(?:\s+r\$)?(?:\s*\d+(?:[.,]\d{1,2})?)?(?:\s*reais)?|nao\s+precisa\s+(?:ser|ficar|custar)?\s*(?:ate|abaixo de|no maximo)(?:\s+r\$)?(?:\s*\d+(?:[.,]\d{1,2})?)?(?:\s*reais)?|sem\s+(?:limite|teto|restricao de (?:preco|orcamento))|(?:remov\w*|tir\w*|ignor\w*)\s+(?:o\s+)?(?:limite|teto|orcamento)|qualquer\s+preco|nao\s+(?:tenho|ha)\s+limite)\b/g;
 const relaxations=[...clean.matchAll(removal)];
 for(const match of relaxations)events.push({index:match.index,budget:null});
 for(const pattern of [/r\$\s*(\d+(?:[.,]\d{1,2})?)/g,/(?:orcamento(?: de)?|ate|no maximo|limite de|teto de)\s*(?:r\$\s*)?(\d+(?:[.,]\d{1,2})?)/g,/(\d+(?:[.,]\d{1,2})?)\s*reais/g]){
  for(const match of clean.matchAll(pattern)){
   if(relaxations.some(removal=>match.index<removal.index+removal[0].length&&match.index+match[0].length>removal.index))continue;
   events.push({index:match.index,budget:Math.round(Number(match[1].replace(',','.'))*100)});
  }
 }
 for(const event of events.sort((a,b)=>a.index-b.index)){budget=event.budget;budgetChanged=true;}
 const scopeEvents=[];
 for(const match of clean.matchAll(/\b(?:(?:sem(?:\s+(?:contar|incluir|considerar))?|nao\s+(?:contar|incluir|considerar))\s+(?:(?:a|o)\s+)?(?:taxa(?: de entrega)?|entrega|frete)|(?:so|somente|apenas)\s+(?:(?:a|o|os)\s+)?(?:comida|produto[s]?|itens)|(?:fora|excluindo)\s+(?:(?:a|o)\s+)?(?:entrega|frete|taxa))\b/g))scopeEvents.push({index:match.index,scope:'products'});
 for(const match of clean.matchAll(/\b(?:(?:incluindo|com|contando)\s+(?:(?:a|o)\s+)?(?:entrega|frete|taxa)|total|tudo junto)\b/g))scopeEvents.push({index:match.index,scope:'total'});
 for(const event of scopeEvents.sort((a,b)=>a.index-b.index))budgetScope=event.scope;
 const excluded=[];
 for(const match of clean.matchAll(/\bsem\s+(?:ser\s+)?(?:nada\s+)?(?:(?:da|de|do)\s+)?([a-z]+)/g))if(!['contar','incluir','considerar','limite','teto','restricao','entrega','frete','taxa'].includes(match[1]))excluded.push(match[1]);
 return {budget,budgetChanged,budgetScope,excluded:[...new Set(excluded)],meal:/\b(almoco|refeicao|pratos?|jantar|comida)\b/.test(clean)};
}
function conversationConstraints(question,prior){
 let budget=null,budgetScope='total';
 for(const text of [...prior.filter(message=>message.role==='user').map(message=>message.content),question]){
  const next=requestConstraints(text);
  if(!isSearchModifier(text,next)){budget=null;budgetScope='total';}
  if(next.budgetChanged)budget=next.budget;
  if(next.budgetScope!==null)budgetScope=next.budgetScope;
 }
 return {...requestConstraints(question),budget,budgetScope};
}
function currentIntent(query){
 const text=normalizedText(query);
 let kind='any';
 if(/\b(sobremesas?|doces?)\b/.test(text))kind='dessert';
 else if(/\bcafe da manha\b|\bcafe e (?:algo|alguma coisa) (?:para|pra) comer\b/.test(text))kind='breakfast';
 else if(/\b(bebidas?|sucos?)\b/.test(text))kind='drink';
 else if(/\b(almoco|refeicao|jantar|pratos?|comida)\b/.test(text))kind='meal';
 else if(/\b(?:lanches?|lanchinhos?)\b/.test(text))kind='snack';
 const vegetarian=/\bvegetarian[oa]s?\b/.test(text),healthy=/\bsaudave(?:l|is)\b/.test(text),producer=/\b(produtor(?:es)?|horta|organicos?|organicas?)\b/.test(text);
 return {kind,vegetarian,healthy,producer,completeBreakfast:kind==='breakfast'&&/\b(complet[oa]|combo|refeicao completa)\b|\bcafe e (?:algo|alguma coisa) (?:para|pra) comer\b/.test(text),completeSnack:kind==='snack'&&/\b(complet[oa]s?|combos?|refeicao completa)\b/.test(text),organic:/\borganic[oa]s?\b/.test(text),garden:/\bhorta\b/.test(text),juice:/\bsucos?\b/.test(text),another:/\b(outr[oa]s?|diferentes?|alternativas?)\b/.test(text)};
}
function isSearchModifier(text,constraints=requestConstraints(text)){
  // Only a budget/delivery modifier can inherit. A new subject clears prior intent.
  const remainder=normalizedText(text)
   .replace(/\b(?:sem(?:\s+(?:contar|incluir|considerar))?|nao\s+(?:contar|incluir|considerar))\s+(?:(?:a|o)\s+)?(?:taxa(?: de entrega)?|entrega|frete)\b/g,'')
   .replace(/\b(?:so|somente|apenas)\s+(?:(?:a|o|os)\s+)?(?:comida|produtos?|itens)\b/g,'')
   .replace(/\b(?:com|incluindo)\s+(?:(?:a|o)\s+)?(?:entrega|frete|taxa)\b/g,'')
   .replace(/\b(?:fora|excluindo)\s+(?:(?:a|o)\s+)?(?:entrega|frete|taxa)\b/g,'')
   .replace(/\b(?:pode ser|pode ficar|pode custar|ate|no maximo|orcamento(?: de)?|limite de|pode passar(?: de)?|nao precisa ser ate|sem limite|sem teto)\b/g,'')
   .replace(/r\$|\d+(?:[.,]\d{1,2})?|\b(?:reais|e|mas|entao|agora)\b|[\s,.;!?]/g,'');
 return !remainder&&(constraints.budgetChanged||constraints.budgetScope!==null);
}
function conversationIntent(question,prior){
 let intent=currentIntent('');
 for(const text of [...prior.filter(message=>message.role==='user').map(message=>message.content),question]){
  if(!isSearchModifier(text))intent=currentIntent(text);
 }
 return intent;
}
function intentScore(item,intent,query){
 const name=normalizedText(item.name),category=item.category;
 let score=0;
 const scores={
  meal:['Regional','Caseiro','Vegetariano'].includes(category)?100:0,
  dessert:category==='Doces'?120:/\b(bolo|geleia|doce|pudim|chocolate|sorvete|mel)\b/.test(name)?100:0,
  drink:category==='Bebidas'&&(!intent.juice||/\bsuco\b/.test(name))?100:0,
  snack:category==='Padaria'?110:category==='Doces'?80:0,
  breakfast:category==='Padaria'?110:category==='Doces'||category==='Bebidas'&&/\bcafe\b/.test(name)?80:0
 };
 if(intent.kind!=='any'){score=scores[intent.kind];if(!score)return 0;}
 if((intent.completeBreakfast||intent.completeSnack)&&isCatalogCombo(item))score+=1000;
 if(intent.vegetarian){if(category!=='Vegetariano'&&!item.preferences.includes('vegetariano'))return 0;score+=100;}
 if(intent.producer){if(!item.producer)return 0;if(intent.organic&&!/organic/.test(normalizedText(item.name+' '+item.store)))return 0;if(intent.garden&&!/horta|hortalica|alface|tomate|cenoura|legume|verdura/.test(normalizedText(item.name+' '+item.description)))return 0;score+=100;}
 if(intent.healthy){if(category!=='Vegetariano'&&!/\b(banana|hortalicas|tomate|alface|cenoura|legumes|verduras)\b/.test(name))return 0;score+=100;}
 const words=new Set(normalizedWords(query));
 score+=normalizedWords(item.name+' '+item.category).filter(word=>words.has(word)).length*5;
 score+=normalizedWords(item.description+' '+item.store+' '+item.preferences.join(' ')).filter(word=>words.has(word)).length;
 return score||1;
}
function summary(city,mode,query,constraints){
 const intent=constraints.intent||currentIntent(query),items=[];
 for(const p of CATALOG.products){
  const x=productInfo(p,city,mode);
  if(!x||!x.available||constraints.budget!==null&&(constraints.budgetScope==='products'?x.price:x.total)>constraints.budget)continue;
  const store=byStore.get(x.storeId);
  const searchable=normalizedWords(x.name+' '+x.description+' '+x.category+' '+x.storeName+' '+x.preferences.join(' '));
  if(constraints.excluded.some(word=>searchable.includes(word)))continue;
  const data={id:x.id,name:x.name,description:x.description.slice(0,110),category:x.category,producer:store.producer,priceReais:(x.price/100).toFixed(2),store:x.storeName,storeId:x.storeId,city:x.city,feeReais:(x.fee/100).toFixed(2),totalReais:(x.total/100).toFixed(2),serves:x.serves,stock:x.stock,preferences:x.preferences};
  const score=intentScore(data,intent,query);
  if(score)items.push({score,data});
 }
 return items.sort((a,b)=>b.score-a.score||a.data.id-b.data.id).map(item=>item.data);
}
function isCatalogCombo(item){return /\bcombos?\b|\b(?:cafe da manha|refeicao|lanche|lanchinho) complet[oa]s?\b/.test(normalizedText(item.name));}
function validationFailure(){return {stage:'validation',retryable:false,status:0,timeout:false};}
function parseProviderObject(text){
 if(typeof text!=='string'||text.length>6000)throw validationFailure();
 let input=text.trim().replace(/^```(?:json)?\s*/i,'').replace(/\s*```$/,'').trim();
 try{const data=JSON.parse(input);if(data&&typeof data==='object'&&!Array.isArray(data))return data;throw validationFailure();}catch(error){if(error.stage)throw error;}
 // Bounded, quote-aware scanning: never eval or repair malformed JSON.
 if(input.startsWith('['))throw validationFailure();
 for(let start=0;start<input.length&&start<=160;start++){
  if(input[start]!=='{')continue;
  let depth=0,quoted=false,escaped=false;
  for(let end=start;end<input.length;end++){
   const char=input[end];
   if(quoted){if(escaped)escaped=false;else if(char==='\\')escaped=true;else if(char==='"')quoted=false;continue;}
   if(char==='"'){quoted=true;continue;}
   if(char==='{')depth++;
   if(char==='}'&&--depth===0){
    let data;try{data=JSON.parse(input.slice(start,end+1));}catch{break;}
    if(input.slice(end+1).trim().length>160)throw validationFailure();
    return data;
   }
  }
 }
 throw validationFailure();
}
// Only non-commercial conversational language is free-form. Exact selected product
// names/descriptions may be quoted; unknown claims are omitted, not sent to clients.
const explanationWords=new Set(normalizedText(`
 a o as os um uma uns umas de da do das dos em na no nas nos
 para pra por pelo pela pelos pelas com sem e ou mas que se seu sua seus suas
 voce voces te lhe eu minha meu ao aos esta este estas estes essa esse essas esses isso
 isto aqui agora tambem ja ainda mais bem muito pouco pode podem poderia quer queria quiser procura busca
 pediu pedido preferencia preferencias vontade fome momento hoje manha tarde noite almoco jantar refeicao cafe lanche lanchinho sobremesa
 bebida saudavel vegetariano vegetariana completo completa combina combinam combinar atende atendem atender encaixa encaixam encaixar escolhi escolher selecionei
 pensei sugiro sugerir recomendo recomendar preferi priorizei priorizar considero considerar alternativa alternativas opcao opcoes sugestao sugestoes escolha escolhas
 proposta propostas pratica pratico praticas praticos simples variedade variar experimentar aproveitar acompanhar compartilhar individual individuais principal principais diferente
 diferentes sabor sabores textura texturas contraste leve leveza doce salgado aconchegante acolhedora pausa rotina praticidade equilibrio equilibrar desejo
 estilo gosto gostos gostoso gostosa agradavel interessante prefere preferir deseja desejar buscando fazer ter ser estar sao vez
 como quando porque assim entao caso conforme pensando vale pena funciona funcionar junto juntas juntos abaixo seguinte seguintes
 disponiveis entre delas deles bem-vindo ola bom boa dia obrigado obrigada entendi claro certo sim vamos posso ajudar
 ajuda olhar conferir explorar encontrar encontrei selecionadas selecionados indicada indicado indicadas indicados nesta neste nesse nessa dentro respeitando
 respeita restricoes intencao contexto foco perfil priorizando pois reune inclui tem traz oferece oferecer junta permite saboroso saborosa
 rapida rapido satisfazer apetite saciar pequena pequeno tamanho seja tanto quanto ate so nao especialmente destaca destaque combinacao
 forma maneira servir servido fresca fresco feitas feita feito feitos
`).trim().split(/\s+/));
function safeExplanation(value,items,groundDescription=false){
 if(typeof value!=='string')return '';
 const vocabulary=new Set(explanationWords);
 if(groundDescription)for(const item of items)for(const word of normalizedWords(item.description))vocabulary.add(word);
 return value.split(/(?<=[.!?])\s+/).filter(sentence=>{
  let remaining=sentence;
  for(const item of items)for(const literal of [item.name,item.description])if(literal)remaining=remaining.split(literal).join(' ');
  if(/[^a-z\s.,!?;:()—–-]/i.test(normalizedText(remaining)))return false;
  const words=normalizedText(remaining).match(/[a-z]+/g)||[];
  if(/\b(preco|precos|reais|custa|custam|gratis|gratuito|gratuita|taxa|estoque|desconto|promocao|calorias|proteina|garantido|garantida)\b/.test(normalizedText(remaining)))return false;
  return words.length>0&&words.every(word=>vocabulary.has(word));
 }).join(' ').trim();
}
function validatedRecommendations(text,catalog,intent={}){
 // Ground provider output instead of rejecting a healthy provider only because
 // it formatted the response differently. Commercial truth remains server-side.
 let data=null;
 try{data=parseProviderObject(text);}catch{}
 const picked=[],used=new Set();
 const add=item=>{if(item&&!used.has(item.id)){used.add(item.id);picked.push({...item});}};
 if(data&&Array.isArray(data.recommendations)){
  for(const entry of data.recommendations){
   if(!entry||typeof entry!=='object')continue;
   const id=Number(entry.productId);
   if(!Number.isInteger(id))continue;
   const item=catalog.find(product=>product.id===id);
   if(!item)continue;
   add(item);
   const selected=picked[picked.length-1];
   if(selected&&entry.reason!==undefined)selected.reason=safeExplanation(entry.reason,[selected],true);
   if(picked.length>=3)break;
  }
 }
 // Natural-language fallback: only exact names from the allowed catalog count.
 if(!picked.length&&typeof text==='string'){
  const content=normalizedText(text);
  for(const item of catalog){
   if(content.includes(normalizedText(item.name))){add(item);if(picked.length>=3)break;}
  }
 }
 // Formatting drift must not disable a working provider. If it returned text but
 // no parseable picks, use the already-ranked server catalog for product IDs.
 if(!picked.length)for(const item of catalog.slice(0,3))add(item);
 if((intent.completeBreakfast||intent.completeSnack)&&catalog.some(isCatalogCombo)){
  const combo=catalog.find(isCatalogCombo);
  const without=picked.filter(item=>item.id!==combo.id);
  picked.splice(0,picked.length,{...combo},...without.slice(0,2));
 }
 picked.message=data&&typeof data.message==='string'
  ?safeExplanation(data.message,picked)
  :safeExplanation(text,picked);
 return picked.slice(0,3);
}
function catalogAnswer(options,mode,constraints,basic=false,another=false){
 const prefix=basic?'Estou em modo básico. ':'';
 if(!options.length)return {text:prefix+'Não encontrei '+(another?'outra opção':'produto')+' compatível com sua intenção, cidade, modalidade e restrições atuais.',productIds:[]};
 const money=v=>Number(v).toFixed(2).replace('.',',');
 const lines=options.map((item,index)=>{
  const delivery=mode==='pickup'?'retirada sem taxa':'taxa de entrega de R$ '+money(item.feeReais);
  return (index+1)+'. '+item.name+' — 1 unidade por R$ '+money(item.priceReais)+', '+delivery+'; total de R$ '+money(item.totalReais)+'.'+(!basic&&item.reason?' '+item.reason:'');
 });
 const budgetNote=constraints.budget!==null&&constraints.budgetScope==='products'?' O limite considera só o produto; a entrega está discriminada à parte.':'';
 return {text:prefix+(!basic&&options.message?options.message+' ':'')+'Estas são opções individuais, para escolher uma.'+budgetNote+'\n'+lines.join('\n'),productIds:options.map(item=>item.id)};
}
async function callProvider(name,env,messages){
 if(name==='cloudflare'){
  const model=env.CLOUDFLARE_AI_MODEL||'@cf/qwen/qwen3-30b-a3b-fp8';let timer;
  try{
   const timeout=new Promise((_,reject)=>{timer=setTimeout(()=>reject({stage:'network',retryable:true,timeout:true,status:0,retryAfter:30}),18000);});
   const data=await Promise.race([env.AI.run(model,{messages,temperature:0.2,max_tokens:900}),timeout]);
   const text=typeof data==='string'?data:(data?.response??data?.choices?.[0]?.message?.content);
   if(typeof text!=='string'||!text.trim())throw validationFailure();
   return {text,provider:name,model};
  }catch(error){
   if(error?.stage)throw error;
   const status=Number(error?.status||error?.cause?.status)||0;
   throw {stage:status?'provider':'network',status,retryable:status===429||status>=500||!status,timeout:false,retryAfter:30};
  }finally{clearTimeout(timer);}
 }
 const isGroq=name==='groq',key=isGroq?env.GROQ_API_KEY:env.GEMINI_API_KEY;
 const model=isGroq?(env.GROQ_MODEL||'openai/gpt-oss-20b'):(env.GEMINI_MODEL||'gemini-3.5-flash-lite');
 const endpoint=isGroq?'https://api.groq.com/openai/v1/chat/completions':'https://generativelanguage.googleapis.com/v1beta/openai/chat/completions';
 const controller=new AbortController(),timer=setTimeout(()=>controller.abort(),18000);
 try{
  const r=await fetch(endpoint,{method:'POST',headers:{'Authorization':`Bearer ${key}`,'Content-Type':'application/json'},body:JSON.stringify({model,messages,temperature:0.2,max_completion_tokens:900,stream:false,...(isGroq?{reasoning_effort:'low'}:{})}),signal:controller.signal});
  if(!r.ok)throw {stage:'provider',status:r.status,retryable:r.status===429||r.status>=500,timeout:false,retryAfter:Math.min(180,Math.max(15,parseInt(r.headers.get('retry-after')||'30',10)||30))};
  let data;try{data=await r.json();}catch(error){if(error?.name==='AbortError')throw error;throw validationFailure();}
  const text=data?.choices?.[0]?.message?.content;
  if(typeof text!=='string'||!text.trim())throw validationFailure();
  return {text,provider:name,model};
 }catch(error){
  if(error?.stage)throw error;
  throw {stage:'network',status:0,retryable:true,timeout:error?.name==='AbortError',retryAfter:30};
 }finally{clearTimeout(timer);}
}
const blocked=new Map(); // Best-effort per-isolate cooldown; no global quota promise.
async function generate(env,messages,catalog,mode,constraints){
 const choices=[['groq',env.GROQ_API_KEY],['cloudflare',env.AI],['gemini',env.GEMINI_API_KEY]].filter(([,binding])=>Boolean(binding));
 if(!choices.length)throw {code:'not_configured',status:503};
 let last=null;
 for(const [name] of choices){
  if((blocked.get(name)||0)>Date.now())continue;
  let stage='network';
  try{
   const answer=await callProvider(name,env,messages);stage='validation';
   const options=validatedRecommendations(answer.text,catalog,constraints.intent);
   return {...answer,...catalogAnswer(options,mode,constraints)};
  }catch(error){
   last=error;stage=error?.stage||stage;
   const status=Number(error?.status)||0,timeout=Boolean(error?.timeout),retryable=stage!=='validation'&&Boolean(error?.retryable);
   console.warn('sabia_provider_failure',{provider:name,stage,status,timeout,retryable});
   if(stage!=='validation'&&retryable&&(timeout||status===429||status>=500))blocked.set(name,Date.now()+(error.retryAfter||30)*1000);
  }
 }
 throw {code:'providers_unavailable',status:429,retryAfter:last?.retryAfter||60};
}
function alternativeCatalog(catalog,intent,prior){
 if(!intent.another)return catalog;
 const last=[...prior].reverse().find(message=>message.role==='assistant')?.content||'';
 const mentioned=normalizedWords(last).join(' ');
 return catalog.filter(item=>!mentioned.includes(normalizedWords(item.name).join(' ')));
}
function reserveAnswer(catalog,mode,query,prior,constraints){
 const intent=constraints.intent||currentIntent(query);
 const options=alternativeCatalog(catalog,intent,prior).map(item=>({item,score:intentScore(item,intent,query)}))
  .filter(({score})=>score>0).sort((a,b)=>b.score-a.score||a.item.id-b.item.id).slice(0,3).map(({item})=>item);
 return {...catalogAnswer(options,mode,constraints,true,intent.another),provider:'reserve',model:'deterministic-v1'};
}
async function route(req,env){const url=new URL(req.url);const path=url.pathname;
 if(path==='/api/sabia/status'&&req.method==='GET'){const providers=[env.GROQ_API_KEY?'Groq':null,env.AI?'Cloudflare Workers AI':null,env.GEMINI_API_KEY?'Gemini':null].filter(Boolean);return response({mode:providers.length?'generative':'unavailable',configured:providers.length>0,providers,message:providers.length?'Sabiá online: '+providers.join(' → '):'Sabiá ainda não configurada. Catálogo disponível.'});}
 if(path==='/api/catalog'&&req.method==='GET')return response({...CATALOG,demo:true});
 if(!['/api/sabia/session','/api/sabia','/api/sabia/product'].includes(path)||req.method!=='POST')return failure('not_found','Operação não encontrada.',404);
 if(req.headers.get('Origin')!==url.origin)return failure('origin','Origem não autorizada.',403);
 if(!req.headers.get('content-type')?.startsWith('application/json'))return failure('content_type','Envie JSON.',415);
 const body=await postBody(req);
 const secret=env.SABIA_SESSION_SECRET;
 if(!secret||secret.length<32)return failure('not_configured','Configure SABIA_SESSION_SECRET nas configurações privadas do projeto.',503);
 const raw=cookie(req,'apete_sabia_cloud');let sid='',sig='';if(raw.includes('.'))[sid,sig]=raw.split('.');const verified=safeId(sid)&&/^[0-9a-f]{64}$/.test(sig)&&await sign(sid,secret)===sig;
 if(path==='/api/sabia/session'){const id=verified?sid:randomHex(),signature=verified?sig:await sign(id,secret),cid=safeId(body.conversationId)?body.conversationId:randomHex(),csrf=(await sign('csrf:'+id,secret)).slice(0,32);return response({conversationId:cid,csrfToken:csrf,history:[],status:{mode:env.GROQ_API_KEY||env.AI||env.GEMINI_API_KEY?'generative':'unavailable'}},200,{'Set-Cookie':`apete_sabia_cloud=${id}.${signature}; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=7200`});}
 if(!verified)return failure('session','Sua sessão expirou. Reabra a Sabiá.',401);
 const csrf=(await sign('csrf:'+sid,secret)).slice(0,32);if(req.headers.get('X-CSRF-Token')!==csrf)return failure('csrf','Sessão inválida. Reabra a Sabiá.',403);
 if(path==='/api/sabia/product'){const p=productById.get(body.productId);const info=validCity(body.city)&&['delivery','pickup'].includes(body.mode)?productInfo(p||{},body.city,body.mode):null;if(!info||!info.available)return failure('unavailable','Produto indisponível para esta cidade.',409);return response(info);}
 if(!safeId(body.conversationId)||typeof body.question!=='string'||!body.question.trim()||body.question.length>1200||!validCity(body.city)||!['delivery','pickup'].includes(body.mode))return failure('invalid_request','Pergunta ou cidade inválida.',400);
 const prior=messagesFor(body),constraints={...conversationConstraints(body.question,prior),intent:conversationIntent(body.question,prior)};
 const catalog=alternativeCatalog(summary(body.city,body.mode,body.question,constraints),constraints.intent,prior);
 const context='Você é Sabiá, assistente do APETÊ. Ajude a escolher até 3 opções individuais do catálogo permitido, considerando a intenção atual e o histórico. Responda JSON: {"message":"texto curto e natural", "recommendations":[{"productId":2,"reason":"motivo curto e personalizado"}]}. Explique sua escolha de forma breve em português brasileiro, relacionando-a ao pedido, à praticidade, ao gosto ou à variedade. A mensagem e os motivos não devem incluir preços, taxas, quantidades, estoque, estabelecimentos, promoções nem alegações nutricionais. O servidor acrescentará todos os nomes e dados comerciais verdadeiros. Se mencionar um produto, use o nome exato de um ID selecionado; nunca transforme categorias em nomes. Não invente produtos, ingredientes ou combos. Pode citar literalmente a descrição cadastrada para explicar a escolha. Não retorne campos extras de preço ou nome. Quando completeBreakfast ou completeSnack for true, priorize como primeira opção um combo/refeição completa já cadastrado e compatível, se houver. Se o catálogo estiver vazio, retorne {"message":"", "recommendations":[]}. As constraints atuais substituem regras antigas. Dados demonstrativos. Cidade: '+body.city+'; modalidade: '+body.mode+'; constraints: '+JSON.stringify(constraints)+'; catálogo permitido: '+JSON.stringify(catalog);

 let answer;try{answer=await generate(env,[{role:'system',content:context},...prior,{role:'user',content:body.question.trim()}],catalog,body.mode,constraints);}catch(e){if(!['not_configured','providers_unavailable'].includes(e?.code))throw e;answer=reserveAnswer(catalog,body.mode,body.question,prior,constraints);}
 const {productIds,...publicAnswer}=answer;
 const products=productIds.filter(id=>catalog.some(item=>item.id===id)).map(id=>productInfo(productById.get(id),body.city,body.mode));
 return response({...publicAnswer,products,stores:[],demo:true});
}
export default {async fetch(request,env){try{if(new URL(request.url).pathname.startsWith('/api/'))return await route(request,env);return env.ASSETS.fetch(request);}catch(e){return failure(e.code||'internal',e.message&&e.code?e.message:'A Sabiá está temporariamente indisponível. O catálogo continua acessível.',e.status||503,e.retryAfter||0);}}};
