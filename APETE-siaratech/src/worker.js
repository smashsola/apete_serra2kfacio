// APETÊ / Cloudflare Pages Advanced Mode. Public catalogue = demonstration data.
// Keep GROQ_API_KEY and GEMINI_API_KEY only in Cloudflare Worker Secrets.
import {bundleTotal,CONFIDENCE,localIntent as localSemanticIntent,normalizeIntent} from './sabia-core.js';
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
function authorizedOrigin(req,url){
 const origin=req.headers.get('Origin');
 if(origin===url.origin)return true;
 if(!origin)return false;
 try{
  const parsed=new URL(origin);
  return (parsed.hostname==='localhost'||parsed.hostname==='127.0.0.1'||parsed.hostname==='[::1]')&&['http:','https:'].includes(parsed.protocol);
 }catch{return false;}
}
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
 for(const match of clean.matchAll(/\b(?:(?:sem(?:\s+(?:contar|incluir|considerar))?|nao\s+(?:contar|incluir|considerar))\s+(?:(?:a|o)\s+)?(?:taxa(?: de entrega)?|entrega|frete)|(?:so|somente|apenas)\s+(?:(?:a|o|os)\s+)?(?:comida|produto[s]?|itens)|(?:fora|excluindo|tirando|descontando)\s+(?:(?:a|o)\s+)?(?:entrega|frete|taxa))\b/g))scopeEvents.push({index:match.index,scope:'products'});
 for(const match of clean.matchAll(/\b(?:(?:incluindo|com|contando)\s+(?:(?:a|o)\s+)?(?:entrega|frete|taxa)|total|tudo junto)\b/g))scopeEvents.push({index:match.index,scope:'total'});
 for(const event of scopeEvents.sort((a,b)=>a.index-b.index))budgetScope=event.scope;
 const excluded=[];
 for(const match of clean.matchAll(/\bsem\s+(?:ser\s+)?(?:nada\s+)?(?:(?:da|de|do)\s+)?([a-z]+)/g))if(!['contar','incluir','considerar','limite','teto','restricao','entrega','frete','taxa'].includes(match[1]))excluded.push(match[1]);
 return {budget,budgetChanged,budgetScope,excluded:[...new Set(excluded)],meal:/\b(almoco|refeicao|pratos?|jantar|comida)\b/.test(clean)};
}
function conversationConstraints(question,prior){
 let budget=null,budgetScope='total';
 for(const rawText of [...prior.filter(message=>message.role==='user').map(message=>message.content),question]){
  const text=latestIntentText(rawText);
  const next=requestConstraints(text);
  const followup=isSearchModifier(text,next)||isAlternativeFollowup(text);
  if(!followup){budget=null;budgetScope='total';}
  if(next.budgetChanged)budget=next.budget;
  if(next.budgetScope!==null)budgetScope=next.budgetScope;
 }
 const current=requestConstraints(latestIntentText(question));
 return {...current,budget,budgetScope};
}
function isAlternativeFollowup(text){
 const clean=normalizedText(text);
 return /\b(?:quero|manda|mostra|mostre|tem|ha|existem?)\s+mais(?:\s+(?:opcoes?|alternativas?|sugestoes?))?(?:\s+ou\s+nao)?\b/.test(clean)
  ||/\bmais\s+(?:opcoes?|alternativas?|sugestoes?)\b/.test(clean)
  ||/\b(?:outr[oa]s?|diferentes?|alternativas?)\s+(?:opcoes?|sugestoes?)?\b/.test(clean);
}
function latestIntentText(value){
 const text=normalizedText(value);
 const explicit=/\b(?:almoco|refeicao|jantar|pratos?|comida|sobremesas?|doces?|cafe da manha|bebidas?|sucos?|lanches?|lanchinhos?|vegetarian[oa]s?|vegan[oa]s?|saudave(?:l|is)|produtor(?:es)?|horta|organicos?|organicas?)\b/;
 const markers=[...text.matchAll(/\bagora\b/g)];
 for(let i=markers.length-1;i>=0;i--){
  const tail=text.slice(markers[i].index+markers[i][0].length).trim();
  if(explicit.test(tail))return tail;
 }
 return text;
}
function currentIntent(query){
 const text=latestIntentText(query);
 const hasMeal=/\b(almoco|refeicao|jantar|pratos?|comida)\b/.test(text);
 const hasDrink=/\b(bebidas?|sucos?|cafe)\b/.test(text);
 let kind='any';
 if(/\b(sobremesas?|doces?)\b/.test(text))kind='dessert';
 else if(/\bcafe da manha\b|\bcafe e (?:algo|alguma coisa) (?:para|pra) comer\b|\bcomecar (?:bem )?o dia\b/.test(text))kind='breakfast';
 else if(hasMeal)kind='meal';
 else if(/\b(bebidas?|sucos?)\b/.test(text))kind='drink';
 else if(/\b(?:lanches?|lanchinhos?)\b/.test(text))kind='snack';
 const vegetarian=/\bvegetarian[oa]s?\b/.test(text);
 const vegan=/\bvegan[oa]s?\b/.test(text);
 const healthy=/\bsaudave(?:l|is)\b/.test(text);
 const producer=/\b(produtor(?:es)?|horta|organicos?|organicas?)\b/.test(text);
 const dietAmbiguous=/\bdieta\b/.test(text)&&!vegetarian&&!vegan;
 return {kind,vegetarian,vegan,healthy,dietAmbiguous,producer,withDrink:hasMeal&&hasDrink,completeBreakfast:kind==='breakfast'&&/\b(complet[oa]|combo|refeicao completa)\b|\bcafe e (?:algo|alguma coisa) (?:para|pra) comer\b/.test(text),completeSnack:kind==='snack'&&/\b(complet[oa]s?|combos?|refeicao completa)\b/.test(text),organic:/\borganic[oa]s?\b/.test(text),garden:/\bhorta\b/.test(text),juice:/\bsucos?\b/.test(text),another:isAlternativeFollowup(text)||/\b(outr[oa]s?|diferentes?|alternativas?)\b/.test(text)};
}
function isSearchModifier(text,constraints=requestConstraints(text)){
  // Budget/delivery followups may contain harmless conversational filler.
  const remainder=normalizedText(text)
   .replace(/\b(?:sem(?:\s+(?:contar|incluir|considerar))?|nao\s+(?:contar|incluir|considerar))\s+(?:(?:a|o)\s+)?(?:taxa(?: de entrega)?|entrega|frete)\b/g,'')
   .replace(/\b(?:so|somente|apenas)\s+(?:(?:a|o|os)\s+)?(?:comida|produtos?|itens)\b/g,'')
   .replace(/\b(?:com|incluindo)\s+(?:(?:a|o)\s+)?(?:entrega|frete|taxa)\b/g,'')
   .replace(/\b(?:fora|excluindo|tirando|descontando)\s+(?:(?:a|o)\s+)?(?:entrega|frete|taxa)\b/g,'')
   .replace(/\b(?:pode ser|pode ficar|pode custar|ate|no maximo|orcamento(?: de)?|limite de|pode passar(?: de)?|nao precisa ser ate|sem limite|sem teto)\b/g,'')
   .replace(/r\$|\d+(?:[.,]\d{1,2})?/g,'')
   .replace(/\b(?:quero|queria|um|uma|algo|alguma|coisa|opcao|item|reais|e|mas|entao|agora|cara|mano|ai|so|somente|apenas)\b|[\s,.;!?]/g,'');
 return !remainder&&(constraints.budgetChanged||constraints.budgetScope!==null);
}
function conversationIntent(question,prior){
 let intent=currentIntent('');
 for(const rawText of [...prior.filter(message=>message.role==='user').map(message=>message.content),question]){
  const text=latestIntentText(rawText);
  if(isSearchModifier(text))continue;
  const next=currentIntent(text);
  const hasPriorIntent=intent.kind!=='any'||intent.vegetarian||intent.vegan||intent.healthy||intent.producer||intent.organic||intent.garden;
  const hasExplicitIntent=next.kind!=='any'||next.vegetarian||next.vegan||next.healthy||next.producer||next.organic||next.garden;
  if(next.another&&hasPriorIntent&&!hasExplicitIntent){
   intent={...intent,another:true};
   continue;
  }
  intent=next;
 }
 return intent;
}
function intentScore(item,intent,query){
 const name=normalizedText(item.name),category=item.category;
 let score=0;
 const mealCategory=['Regional','Caseiro','Vegetariano'].includes(category);
 const scores={
  meal:mealCategory?100:0,
  dessert:category==='Doces'?120:/\b(bolo|geleia|doce|pudim|chocolate|sorvete|mel)\b/.test(name)?100:0,
  drink:category==='Bebidas'&&(!intent.juice||/\bsuco\b/.test(name))?100:0,
  snack:category==='Padaria'?110:category==='Doces'?80:0,
  breakfast:category==='Padaria'?110:category==='Doces'||category==='Bebidas'&&/\bcafe\b/.test(name)?80:0
 };
 if(intent.withDrink){
  if(mealCategory)score=130;
  else if(category==='Bebidas')score=110;
  else return 0;
 }else if(intent.kind!=='any'){score=scores[intent.kind];if(!score)return 0;}
 if((intent.completeBreakfast||intent.completeSnack)&&isCatalogCombo(item))score+=1000;
 if(intent.vegetarian){if(category!=='Vegetariano'&&!item.preferences.includes('vegetariano'))return 0;score+=100;}
 if(intent.vegan){if(!item.preferences.includes('vegano')&&!item.preferences.includes('vegan'))return 0;score+=120;}
 if(intent.producer){if(!item.producer)return 0;if(intent.organic&&!/organic/.test(normalizedText(item.name+' '+item.store)))return 0;if(intent.garden&&!/horta|hortalica|alface|tomate|cenoura|legume|verdura/.test(normalizedText(item.name+' '+item.description)))return 0;score+=100;}
 if(intent.healthy){if(category!=='Vegetariano'&&!/\b(banana|hortalicas|tomate|alface|cenoura|legumes|verduras)\b/.test(name))return 0;score+=100;}
 const words=new Set(normalizedWords(query));
 score+=normalizedWords(item.name+' '+item.category).filter(word=>words.has(word)).length*5;
 score+=normalizedWords(item.description+' '+item.store+' '+item.preferences.join(' ')).filter(word=>words.has(word)).length;
 if(intent.kind==='any'&&!intent.vegetarian&&!intent.vegan&&!intent.healthy&&!intent.producer){
  if(score>0)return score;
  if(/\b(quero|procuro|mostra|mostre|opcoes?|sugestoes?|recomenda|recomende|algo|comer|pedido)\b/.test(normalizedText(query)))return 1;
  return 0;
 }
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
 const text=value.trim().slice(0,420);
 if(!text)return '';
 return text.split(/(?<=[.!?])\s+/).slice(0,2).filter(sentence=>{
  let remaining=sentence;
  for(const item of items)for(const literal of [item.name,item.description])if(literal)remaining=remaining.split(literal).join(' ');
  const normalized=normalizedText(remaining);
  if(/https?:\/\/|www\.|@/.test(remaining))return false;
  if(/\d|r\$|\b(preco|precos|reais|custa|custam|gratis|gratuito|gratuita|taxa|frete|estoque|desconto|promocao|promocoes|cupom|calorias|proteina|proteinas|carboidrato|carboidratos|vitamina|vitaminas|garantido|garantida|cura|trata|tratamento)\b/.test(normalized))return false;
  if(groundDescription){
   const grounded=new Set();
   for(const item of items)for(const word of normalizedWords(item.description+' '+item.name+' '+item.category))grounded.add(word);
   const factual=/\b(tem|leva|feito|feita|feitos|feitas|com|contendo|acompanha|recheado|recheada|ingrediente|ingredientes)\b/.test(normalized);
   if(factual){
    const content=normalizedWords(remaining).filter(word=>!explanationWords.has(word));
    if(content.some(word=>!grounded.has(word)))return false;
   }
  }
  return normalizedWords(remaining).length>0;
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
 if(intent.withDrink){
  const meal=catalog.find(item=>['Regional','Caseiro','Vegetariano'].includes(item.category));
  const drink=meal
   ?(catalog.find(item=>item.category==='Bebidas'&&item.storeId===meal.storeId)||catalog.find(item=>item.category==='Bebidas'))
   :null;
  if(meal&&drink)picked.splice(0,picked.length,{...meal},{...drink});
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
 let intro=basic?'Estas são opções individuais, para escolher uma.':(options.message||'Encontrei algumas opções que combinam com o pedido.');
 if(constraints.intent?.withDrink){
  const sameStore=options.length>=2&&options[0].storeId===options[1].storeId;
  if(options.length>=2){
   const productsTotal=options.slice(0,2).reduce((sum,item)=>sum+Number(item.priceReais),0);
   const fee=mode==='pickup'?0:(sameStore?Number(options[0].feeReais):options.slice(0,2).reduce((sum,item)=>sum+Number(item.feeReais),0));
   intro=(basic?'':sameStore?'Separei um prato e uma bebida do mesmo estabelecimento. ':'Separei um prato e uma bebida de estabelecimentos diferentes. ')+'Juntos, os produtos somam R$ '+money(productsTotal)+' e '+(mode==='pickup'?'a retirada não tem taxa':'a entrega cadastrada soma R$ '+money(fee))+'; total do conjunto: R$ '+money(productsTotal+fee)+'.';
  }else intro='Separei um prato e uma bebida compatíveis com o pedido.';
 }
 return {text:prefix+intro+budgetNote+'\n'+lines.join('\n'),productIds:options.map(item=>item.id)};
}
function providerText(data){
 const candidates=[
  data,
  data?.response,
  data?.result?.response,
  data?.choices?.[0]?.message?.content,
  data?.result?.choices?.[0]?.message?.content,
  data?.text,
  data?.result?.text
 ];
 for(const value of candidates){
  if(typeof value==='string'&&value.trim())return value.trim();
  if(Array.isArray(value)){
   const joined=value.map(part=>{
    if(typeof part==='string')return part;
    if(part&&typeof part==='object')return typeof part.text==='string'?part.text:typeof part.content==='string'?part.content:'';
    return '';
   }).filter(Boolean).join('\n').trim();
   if(joined)return joined;
  }
 }
 return '';
}
function safeProviderDetail(value){
 return String(value||'')
  .replace(/AIza[0-9A-Za-z_-]{20,}/g,'[redacted]')
  .replace(/gsk_[0-9A-Za-z_-]{12,}/g,'[redacted]')
  .replace(/Bearer\s+[0-9A-Za-z._-]+/gi,'Bearer [redacted]')
  .slice(0,1200);
}
function providerConfigured(name,env){
 if(name==='cloudflare')return Boolean(env.AI);
 if(name==='gemini')return Boolean(env.GEMINI_API_KEY);
 if(name==='groq')return Boolean(env.GROQ_API_KEY);
 return false;
}
function providerModel(name,env){
 if(name==='cloudflare')return env.CLOUDFLARE_AI_MODEL||'@cf/qwen/qwen3.8-27b';
 if(name==='gemini')return env.GEMINI_MODEL||'gemini-3.5-flash-lite';
 if(name==='groq')return env.GROQ_MODEL||'openai/gpt-oss-20b';
 return '';
}
async function callProvider(name,env,messages){
 if(name==='cloudflare'){
  const model=env.CLOUDFLARE_AI_MODEL||'@cf/qwen/qwen3.8-27b';let timer;
  try{
   const timeout=new Promise((_,reject)=>{timer=setTimeout(()=>reject({stage:'network',retryable:true,timeout:true,status:0,retryAfter:30}),18000);});
   const data=await Promise.race([env.AI.run(model,{messages,reasoning_effort:'low',max_completion_tokens:1200,stream:false}),timeout]);
   const text=providerText(data);
   if(!text)throw {...validationFailure(),detail:safeProviderDetail(JSON.stringify(data))};
   return {text,provider:name,model};
  }catch(error){
   if(error?.stage)throw error;
   const status=Number(error?.status||error?.cause?.status)||0;
   throw {stage:status?'provider':'network',status,retryable:status===429||status>=500||!status,timeout:false,retryAfter:30};
  }finally{clearTimeout(timer);}
 }

 const controller=new AbortController(),timer=setTimeout(()=>controller.abort(),18000);
 try{
  if(name==='groq'){
   const model=env.GROQ_MODEL||'openai/gpt-oss-20b';
   const r=await fetch('https://api.groq.com/openai/v1/chat/completions',{
    method:'POST',
    headers:{'Authorization':`Bearer ${env.GROQ_API_KEY}`,'Content-Type':'application/json'},
    body:JSON.stringify({model,messages,temperature:0.15,max_completion_tokens:900,stream:false,reasoning_effort:'low'}),
    signal:controller.signal
   });
   if(!r.ok){
    let detail='';try{detail=safeProviderDetail(await r.text());}catch{}
    throw {stage:'provider',status:r.status,retryable:r.status===429||r.status>=500,timeout:false,retryAfter:Math.min(180,Math.max(15,parseInt(r.headers.get('retry-after')||'30',10)||30)),detail};
   }
   let data;try{data=await r.json();}catch{throw validationFailure();}
   const text=providerText(data);
   if(!text)throw validationFailure();
   return {text,provider:name,model};
  }

  const model=env.GEMINI_MODEL||'gemini-3.5-flash-lite';
  const systemText=messages.filter(message=>message.role==='system').map(message=>message.content).join('\n\n');
  const dialogue=messages.filter(message=>message.role!=='system').map(message=>(message.role==='assistant'?'Assistente':'Usuário')+': '+message.content).join('\n');
  const prompt=(systemText?systemText+'\n\n':'')+'Histórico recente:\n'+dialogue+'\n\nResponda somente ao último pedido do usuário no JSON solicitado.';
  const payload={contents:[{role:'user',parts:[{text:prompt}]}],generationConfig:{maxOutputTokens:1200}};
  const r=await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(model)}:generateContent`,{
   method:'POST',
   headers:{'x-goog-api-key':env.GEMINI_API_KEY,'Content-Type':'application/json'},
   body:JSON.stringify(payload),
   signal:controller.signal
  });
  if(!r.ok){
   let detail='';try{detail=safeProviderDetail(await r.text());}catch{}
   throw {stage:'provider',status:r.status,retryable:r.status===429||r.status>=500,timeout:false,retryAfter:Math.min(180,Math.max(15,parseInt(r.headers.get('retry-after')||'30',10)||30)),detail};
  }
  let data;try{data=await r.json();}catch{throw validationFailure();}
  const text=(data?.candidates?.[0]?.content?.parts||[]).map(part=>part?.text||'').join('\n').trim();
  if(!text)throw validationFailure();
  return {text,provider:name,model};
 }catch(error){
  if(error?.stage)throw error;
  throw {stage:'network',status:0,retryable:true,timeout:error?.name==='AbortError',retryAfter:30};
 }finally{clearTimeout(timer);}
}

const blocked=new Map(); // Best-effort per-isolate cooldown; no global quota promise.
async function generate(env,messages,catalog,mode,constraints){
 // Cloudflare is the proven healthy primary in Preview. Reserve remains the last fallback.
 const choices=[['groq',env.GROQ_API_KEY],['gemini',env.GEMINI_API_KEY],['cloudflare',env.AI]].filter(([,binding])=>Boolean(binding));
 if(!choices.length)throw {code:'not_configured',status:503};
 let last=null;
 for(const [name] of choices){
  if((blocked.get(name)||0)>Date.now())continue;
  let stage='network';
  try{
   let answer;
   try{
    answer=await callProvider(name,env,messages);
   }catch(firstError){
    const transientCloudflare=name==='cloudflare'&&(firstError?.stage==='validation'||firstError?.stage==='network'||Number(firstError?.status)>=500);
    if(!transientCloudflare)throw firstError;
    answer=await callProvider(name,env,messages);
   }
   stage='validation';
   const options=validatedRecommendations(answer.text,catalog,constraints.intent);
   console.info('sabia_provider_success',{provider:answer.provider,model:answer.model});
   return {...answer,...catalogAnswer(options,mode,constraints,false,Boolean(constraints.intent?.another))};
  }catch(error){
   last=error;stage=error?.stage||stage;
   const status=Number(error?.status)||0,timeout=Boolean(error?.timeout),retryable=stage!=='validation'&&Boolean(error?.retryable);
   console.warn('sabia_provider_failure',{provider:name,stage,status,timeout,retryable});
   if(stage==='provider'&&[400,401,403,404].includes(status))blocked.set(name,Date.now()+5*60*1000);
   else if(stage!=='validation'&&retryable&&(timeout||status===429||status>=500))blocked.set(name,Date.now()+(error.retryAfter||30)*1000);
  }
 }
 throw {code:'providers_unavailable',status:429,retryAfter:last?.retryAfter||60};
}
function mealDrinkPair(catalog,constraints,mode,closest=false){
 const meals=catalog.filter(item=>['Regional','Caseiro','Vegetariano'].includes(item.category));
 const drinks=catalog.filter(item=>item.category==='Bebidas');
 const pairs=[];
 for(let mi=0;mi<meals.length;mi++)for(let di=0;di<drinks.length;di++){
  const meal=meals[mi],drink=drinks[di];
  const products=Math.round((Number(meal.priceReais)+Number(drink.priceReais))*100);
  const delivery=mode==='pickup'?0:Math.round((meal.storeId===drink.storeId?Number(meal.feeReais):Number(meal.feeReais)+Number(drink.feeReais))*100);
  const total=products+delivery;
  const scoped=constraints.budgetScope==='products'?products:total;
  pairs.push({meal,drink,products,delivery,total,scoped,sameStore:meal.storeId===drink.storeId,rank:mi+di});
 }
 if(!pairs.length)return null;
 if(closest&&constraints.budget!==null){
  pairs.sort((a,b)=>Math.abs(a.scoped-constraints.budget)-Math.abs(b.scoped-constraints.budget)||Number(b.sameStore)-Number(a.sameStore)||a.rank-b.rank);
  return pairs[0];
 }
 const eligible=constraints.budget===null?pairs:pairs.filter(pair=>pair.scoped<=constraints.budget);
 if(!eligible.length)return null;
 eligible.sort((a,b)=>Number(b.sameStore)-Number(a.sameStore)||a.rank-b.rank||a.scoped-b.scoped);
 return eligible[0];
}
function mealDrinkBudgetAnswer(catalog,constraints,mode){
 if(!constraints.intent?.withDrink||constraints.budget===null)return null;
 const nearest=mealDrinkPair(catalog,constraints,mode,true);
 if(!nearest)return null;
 const money=cents=>'R$ '+(cents/100).toFixed(2).replace('.',',');
 const over=nearest.scoped-constraints.budget;
 if(over<=0)return null;
 const basis=constraints.budgetScope==='products'?'considerando só os produtos':'contando a entrega';
 let text='Não encontrei almoço com bebida até '+money(constraints.budget)+' '+basis+'. A combinação mais próxima é '+nearest.meal.name+' + '+nearest.drink.name+', por '+money(nearest.scoped)+', ficando '+money(over)+' acima do limite.';
 if(constraints.budgetScope==='total')text+=' Se quiser, posso usar o limite só para os produtos e deixar a entrega à parte.';
 return {text,provider:'rules',model:'meal-drink-budget-v1',productIds:[]};
}

function availableCatalog(city,mode){
 const items=[];
 for(const p of CATALOG.products){
  const x=productInfo(p,city,mode);if(!x||!x.available)continue;
  const store=byStore.get(x.storeId);
  items.push({id:x.id,name:x.name,description:x.description.slice(0,160),category:x.category,producer:Boolean(store?.producer),priceReais:(x.price/100).toFixed(2),store:x.storeName,storeId:x.storeId,city:x.city,feeReais:(x.fee/100).toFixed(2),totalReais:(x.total/100).toFixed(2),serves:x.serves,stock:x.stock,preferences:x.preferences});
 }
 return items;
}
function semanticCatalog(items){
 return items.map(item=>({id:item.id,name:item.name,description:item.description,category:item.category,store:item.store,producer:item.producer,preferences:item.preferences,serves:item.serves}));
}
function semanticIntentFromAssistant(text){
 const clean=normalizedText(text),mentioned=[];
 for(const product of CATALOG.products)if(clean.includes(normalizedText(product.name)))mentioned.push(product);
 if(!mentioned.length){
  const conversational=localSemanticIntent(text);
  if(conversational.action!=='chat'&&(conversational.topic!=='catalog'||conversational.preferences.length||conversational.modifiers.length)){
   return {...conversational,action:'recommend',keepPreviousContext:true,confidence:Math.max(.62,conversational.confidence||0)};
  }
  return null;
 }
 const topics=new Set();
 for(const product of mentioned){
  const name=normalizedText(product.name),category=product.cat,store=byStore.get(product.storeId);
  if(/cafe da manha|desjejum/.test(name))topics.add('breakfast');
  else if(['Regional','Caseiro','Vegetariano'].includes(category))topics.add('meal');
  else if(category==='Bebidas')topics.add('drink');
  else if(category==='Doces'||/bolo|geleia|doce|pudim|mel|sorvete|chocolate/.test(name))topics.add('dessert');
  else if(category==='Padaria')topics.add('snack');
  else if(store?.producer)topics.add('produce');
 }
 let topic='catalog',components=[...topics].slice(0,3),modifiers=[];
 if(topics.has('breakfast')||topics.has('snack')&&topics.has('drink')&&mentioned.some(product=>/cafe/.test(normalizedText(product.name)))){topic='breakfast';components=['breakfast'];}
 else if(topics.size===1)topic=components[0];
 else if(topics.has('meal'))topic='meal';
 else if(topics.has('snack'))topic='snack';
 else if(topics.has('dessert'))topic='dessert';
 else if(topics.has('drink'))topic='drink';
 else if(topics.has('produce'))topic='produce';
 if(topic==='produce')modifiers=['producer'];
 return {topic,action:'recommend',fact:'none',categories:[],preferences:[],modifiers,exclusions:[],searchTerms:[],components:topic==='catalog'?components:[topic],serves:null,keepPreviousContext:true,confidence:.68};
}
function semanticFallbackIntent(question,prior){
 let intent=null;
 for(const message of prior){
  if(message.role==='user')intent=localSemanticIntent(message.content,intent);
  else if(message.role==='assistant'){
   const inferred=semanticIntentFromAssistant(message.content);
   if(inferred&&(!intent||intent.topic==='catalog'||intent.confidence<0.5))intent={...inferred,preferences:intent?.preferences?.length?intent.preferences:inferred.preferences,modifiers:intent?.modifiers?.length?intent.modifiers:inferred.modifiers};
  }
 }
 return localSemanticIntent(question,intent)||localSemanticIntent(question);
}
function semanticToLegacy(semantic,fallback){
 const modifiers=new Set(semantic.modifiers||[]),components=(semantic.components||[]).filter(component=>component!=='catalog').slice(0,3);
 const kindMap={meal:'meal',drink:'drink',snack:'snack',breakfast:'breakfast',dessert:'dessert',produce:'any',catalog:'any'};
 const kind=kindMap[semantic.topic]||fallback.kind||'any';
 return {...fallback,kind,
  vegetarian:semantic.preferences.includes('vegetariano'),
  vegan:semantic.preferences.includes('vegano'),
  healthy:modifiers.has('healthy'),
  dietAmbiguous:semantic.action==='clarify',
  producer:semantic.topic==='produce'||modifiers.has('producer')||modifiers.has('garden')||modifiers.has('organic'),
  withDrink:components.includes('meal')&&components.includes('drink'),
  completeBreakfast:(semantic.topic==='breakfast'||components.includes('breakfast'))&&modifiers.has('complete'),
  completeSnack:(semantic.topic==='snack'||components.includes('snack'))&&modifiers.has('complete'),
  organic:modifiers.has('organic'),garden:modifiers.has('garden'),juice:modifiers.has('juice'),
  another:semantic.action==='alternative'||(semantic.keepPreviousContext&&Boolean(fallback.another)),components,semanticAction:semantic.action,semanticFact:semantic.fact};
}
function semanticContext(city,mode,constraints,catalog,fallback){
 return 'Você é a camada de interpretação da Sabiá, assistente do APETÊ. Entenda português brasileiro natural: sinônimos, gírias, diminutivos, abreviações, pequenos erros de digitação, frases curtas, follow-ups, elipses e mudanças de assunto. Interprete a intenção FINAL do usuário considerando o histórico, sem depender de frases literais. Se a mensagem atual não trouxer um novo tipo de produto, preserve o assunto anterior em vez de inventar uma troca. Saudações, agradecimentos e conversa casual sem pedido de produto usam action "chat" e zero recomendações. Pedidos para listar, mostrar opções ou saber quais itens existem usam action "list". Perguntas sobre existência, disponibilidade, preço, taxa/frete de entrega, item mais barato/caro ou popularidade usam action "fact". Para "quanto é a entrega", "qual a taxa" e equivalentes, use fact "delivery_fee"; o servidor calcula e responde a taxa usando o contexto recente. Em fact availability, preencha searchTerms apenas com o conceito consultado; para perguntas do tipo "é só esse?" sobre um item já mostrado, preserve o tópico anterior e deixe searchTerms vazio para o servidor conferir o grupo inteiro. Preferências explícitas como vegetariano ou vegano NÃO precisam de esclarecimento: use recommend/list/fact conforme o pedido. Respostas afirmativas curtas, inclusive com pequenos erros de digitação, a uma pergunta anterior da Sabiá usam action "confirm" e preservam o assunto pendente; não peça a mesma confirmação de novo. "Dieta", "regime" ou saúde vaga sem restrição clara deve usar action "clarify". Pedidos compostos viram components, podendo ter até 3 conceitos. Retorne SOMENTE JSON válido no formato {"intent":{"topic":"meal|drink|snack|breakfast|dessert|produce|catalog","action":"recommend|list|alternative|refine|switch|fact|clarify|confirm|chat","fact":"none|cheapest|most_expensive|most_ordered|price|availability|delivery_fee","categories":[],"preferences":["vegano|vegetariano"],"modifiers":["producer|garden|organic|juice|healthy|complete"],"exclusions":[],"searchTerms":[],"components":[],"serves":null,"keepPreviousContext":false,"confidence":0.0},"message":"frase curta, natural e sem fatos comerciais inventados","recommendations":[{"productId":1,"reason":"motivo curto"}]}. Use no máximo 6 recomendações ranqueadas. Nunca invente IDs. Não calcule nem decida preço, taxa, estoque, disponibilidade, orçamento, promoção ou quantidade de opções: o servidor é a autoridade absoluta desses dados. Não faça alegações nutricionais, de emagrecimento ou ingredientes não cadastrados. Os motivos podem falar de gosto, praticidade, variedade e encaixe no pedido. Restrições duras já detectadas pelo servidor: '+JSON.stringify({budget:constraints.budget,budgetScope:constraints.budgetScope,excluded:constraints.excluded})+'. Fallback semântico local: '+JSON.stringify(fallback)+'. Catálogo real disponível para interpretação (sem autoridade comercial): '+JSON.stringify(semanticCatalog(catalog))+'. Cidade: '+city+'; modalidade: '+mode+'.';
}
function semanticTermMatch(item,terms){
 if(!terms?.length)return true;
 const words=normalizedWords(item.name+' '+item.description+' '+item.category+' '+item.store);
 return terms.every(term=>{
  const wanted=normalizedWords(term);
  return wanted.length&&wanted.every(target=>words.some(word=>word.startsWith(target)||target.startsWith(word)));
 });
}
function priorRecommendedStoreIds(city,mode,prior=[]){
 const ids=[];
 for(const message of prior){
  if(message.role!=='assistant')continue;
  const text=normalizedText(message.content);
  for(const product of CATALOG.products){
   if(!text.includes(normalizedText(product.name)))continue;
   const info=productInfo(product,city,mode);
   if(info?.available)ids.push(info.storeId);
  }
 }
 return [...new Set(ids)];
}
function semanticFactAnswer(city,mode,query,semantic,constraints,prior=[]){
 if(semantic.action!=='fact')return null;
 const money=cents=>'R$ '+(cents/100).toFixed(2).replace('.',',');
 const all=availableCatalog(city,mode);
 if(semantic.fact==='most_ordered')return {text:'O catálogo demonstrativo ainda não registra quantidade de pedidos ou vendas, então não dá para afirmar qual item é o mais pedido, vendido ou popular.',provider:'rules',model:'catalog-facts-v2',productIds:[]};
 if(semantic.fact==='delivery_fee'){
  if(mode==='pickup')return {text:'Na modalidade de retirada não há taxa de entrega.',provider:'rules',model:'catalog-facts-v2',productIds:[]};
  const storeIds=priorRecommendedStoreIds(city,mode,prior);
  if(!storeIds.length)return {text:'De qual estabelecimento ou produto você quer saber a taxa de entrega?',provider:'rules',model:'catalog-facts-v2',productIds:[]};
  const stores=storeIds.map(id=>byStore.get(id)).filter(Boolean);
  return {text:stores.map(store=>'A taxa de entrega da '+store.name+' é '+money(store.fee)+'.').join(' '),provider:'rules',model:'catalog-facts-v2',productIds:[]};
 }
 if(!all.length)return {text:'Não encontrei produto disponível para comparar nesta cidade e modalidade.',provider:'rules',model:'catalog-facts-v2',productIds:[]};
 const ranked=summary(city,mode,query,constraints);
 let terms=semantic.searchTerms||[];
 const lastAssistant=[...prior].reverse().find(message=>message.role==='assistant')?.content||'';
 if(terms.length&&semantic.keepPreviousContext&&semantic.topic!=='catalog'&&terms.some(term=>normalizedText(lastAssistant).includes(normalizedText(term))))terms=[];
 const hasSemanticScope=semantic.topic!=='catalog'||semantic.preferences.length>0||semantic.modifiers.length>0||semantic.components.some(component=>component!=='catalog');
 const scoped=(hasSemanticScope?ranked:all).filter(item=>semanticTermMatch(item,terms));
 if(semantic.fact==='availability'){
  if(!scoped.length){
   if(semantic.preferences.includes('vegetariano'))return {text:'Não encontrei item cadastrado como vegetariano para esta cidade e modalidade.',provider:'rules',model:'catalog-facts-v2',productIds:[]};
   if(semantic.preferences.includes('vegano'))return {text:'Não encontrei item cadastrado como vegano para esta cidade e modalidade. Prefiro não presumir que um produto seja vegano sem essa informação no catálogo.',provider:'rules',model:'catalog-facts-v2',productIds:[]};
   return {text:'Não encontrei esse item cadastrado como disponível para esta cidade e modalidade.',provider:'rules',model:'catalog-facts-v2',productIds:[]};
  }
  const picks=scoped.slice(0,3);
  return {text:'Encontrei '+scoped.length+' '+(scoped.length===1?'opção compatível':'opções compatíveis')+' no catálogo para esta cidade e modalidade.',provider:'rules',model:'catalog-facts-v2',productIds:picks.map(item=>item.id)};
 }
 if(semantic.fact==='price'){
  if(!scoped.length)return {text:'Não encontrei esse item cadastrado para consultar o preço.',provider:'rules',model:'catalog-facts-v2',productIds:[]};
  const picks=scoped.slice(0,3);
  const parts=picks.map(item=>item.name+': '+money(Math.round(Number(item.priceReais)*100))+(mode==='pickup'?' na retirada':'; total com entrega '+money(Math.round(Number(item.totalReais)*100))));
  return {text:parts.join('. ')+'.',provider:'rules',model:'catalog-facts-v2',productIds:picks.map(item=>item.id)};
 }
 if(semantic.fact==='cheapest'||semantic.fact==='most_expensive'){
  if(!scoped.length&&hasSemanticScope)return {text:'Não encontrei opção compatível com esse filtro para comparar.',provider:'rules',model:'catalog-facts-v2',productIds:[]};
  const pool=scoped.length?scoped:all;
  const sorted=[...pool].sort((a,b)=>Number(a.priceReais)-Number(b.priceReais)||a.id-b.id);
  const item=semantic.fact==='most_expensive'?sorted.at(-1):sorted[0];
  const price=Math.round(Number(item.priceReais)*100),total=Math.round(Number(item.totalReais)*100);
  return {text:'Pelo preço do produto, a opção '+(semantic.fact==='most_expensive'?'mais cara':'mais barata')+' disponível é '+item.name+': '+money(price)+'. '+(mode==='pickup'?'Na retirada não há taxa de entrega.':'Com a entrega cadastrada, o total fica '+money(total)+'.'),provider:'rules',model:'catalog-facts-v2',productIds:[item.id]};
 }
 return null;
}
function semanticChatAnswer(data){
 const message=safeExplanation(data?.message||'',[]);
 return {text:message||'Oi! Posso te ajudar a encontrar algo do catálogo, comparar opções ou montar um pedido.',productIds:[]};
}
function semanticListAnswer(city,mode,query,constraints,prior){
 let catalog=alternativeCatalog(summary(city,mode,query,constraints),constraints.intent,prior);
 if(!catalog.length)return null;
 const options=catalog.slice(0,3);
 options.message='Encontrei '+catalog.length+' '+(catalog.length===1?'opção compatível':'opções compatíveis')+' com o que você pediu.';
 return catalogAnswer(options,mode,constraints,false,Boolean(constraints.intent?.another));
}
function componentIntent(base,component){
 const kindMap={meal:'meal',drink:'drink',snack:'snack',breakfast:'breakfast',dessert:'dessert',produce:'any'};
 return {...base,kind:kindMap[component]||'any',withDrink:false,another:base.another,
  producer:component==='produce',organic:component==='produce'&&base.organic,garden:component==='produce'&&base.garden,
  juice:component==='drink'&&base.juice,completeBreakfast:component==='breakfast'&&base.completeBreakfast,
  completeSnack:component==='snack'&&base.completeSnack};
}
function genericBundle(city,mode,query,prior,constraints,components,suggestedIds=[]){
 const uniqueComponents=[...new Set(components.filter(component=>['meal','drink','snack','breakfast','dessert','produce'].includes(component)))].slice(0,3);
 if(uniqueComponents.length<2)return null;
 const lists=uniqueComponents.map(component=>{
  const intent=componentIntent(constraints.intent,component),part={...constraints,budget:null,intent};
  const full=summary(city,mode,query,part),alt=alternativeCatalog(full,intent,prior);
  return alt.slice(0,8);
 });
 if(lists.some(list=>!list.length))return null;
 const bundles=[];
 const walk=(index,picked,rank)=>{
  if(index===lists.length){
   const scoped=bundleTotal(picked,mode,constraints.budgetScope),payable=bundleTotal(picked,mode,'total');
   const stores=new Set(picked.map(item=>item.storeId)).size;
   const suggestedScore=picked.reduce((sum,item)=>{const pos=suggestedIds.indexOf(item.id);return sum+(pos<0?0:1000-pos*25);},0);
   bundles.push({items:[...picked],scoped,payable,stores,rank,suggestedScore});return;
  }
  lists[index].forEach((item,pos)=>{if(picked.some(current=>current.id===item.id))return;walk(index+1,[...picked,item],rank+pos);});
 };
 walk(0,[],0);
 if(!bundles.length)return null;
 const within=constraints.budget===null?bundles:bundles.filter(bundle=>bundle.scoped<=constraints.budget);
 const pool=within.length?within:bundles;
 pool.sort((a,b)=>{
  if(!within.length&&constraints.budget!==null){
   const overA=Math.max(0,a.scoped-constraints.budget),overB=Math.max(0,b.scoped-constraints.budget);
   if(overA!==overB)return overA-overB;
  }
  return b.suggestedScore-a.suggestedScore||a.stores-b.stores||a.rank-b.rank||a.scoped-b.scoped;
 });
 return {...pool[0],overBudget:Boolean(constraints.budget!==null&&!within.length)};
}
function recommendationReasons(data,items){
 const map=new Map();
 if(data&&Array.isArray(data.recommendations))for(const entry of data.recommendations){
  const id=Number(entry?.productId);if(!Number.isInteger(id)||typeof entry?.reason!=='string')continue;
  const item=items.find(candidate=>candidate.id===id);if(item)map.set(id,safeExplanation(entry.reason,[item],true));
 }
 return map;
}
function bundleAnswer(bundle,mode,constraints,data,basic=false){
 const money=cents=>'R$ '+(cents/100).toFixed(2).replace('.',','),reasons=recommendationReasons(data,bundle.items);
 const productsTotal=bundleTotal(bundle.items,mode,'products'),payable=bundleTotal(bundle.items,mode,'total'),scoped=bundleTotal(bundle.items,mode,constraints.budgetScope);
 const fees=new Map();for(const item of bundle.items)fees.set(item.storeId,{name:item.store,fee:mode==='pickup'?0:Math.round(Number(item.feeReais)*100)});
 let intro=safeExplanation(data?.message||'',bundle.items)||'Montei uma combinação compatível com o pedido.';
 if(bundle.overBudget&&constraints.budget!==null)intro='Não encontrei uma combinação dentro de '+money(constraints.budget)+(constraints.budgetScope==='products'?' considerando só os produtos':' contando a entrega')+'. A opção mais próxima ultrapassa o limite em '+money(scoped-constraints.budget)+'.';
 const lines=bundle.items.map((item,index)=>(index+1)+'. '+item.name+' — 1 unidade por '+money(Math.round(Number(item.priceReais)*100))+' — '+item.store+'.'+(reasons.get(item.id)?' '+reasons.get(item.id):''));
 const delivery=mode==='pickup'?'Retirada sem taxa.':'Entregas: '+[...fees.values()].map(entry=>entry.name+' '+money(entry.fee)).join('; ')+'.';
 const totals=constraints.budgetScope==='products'?'Produtos: '+money(productsTotal)+'; total com entrega: '+money(payable)+'.':'Produtos: '+money(productsTotal)+'; '+(mode==='pickup'?'total na retirada: ':'total com entrega: ')+money(payable)+'.';
 return {text:(basic?'Estou em modo básico. ':'')+intro+'\n'+lines.join('\n')+'\n'+delivery+' '+totals,productIds:bundle.items.map(item=>item.id)};
}

function alternativeCatalog(catalog,intent,prior){
 if(!intent.another)return catalog;
 const assistantText=prior.filter(message=>message.role==='assistant').map(message=>normalizedText(message.content)).join(' ');
 return catalog.filter(item=>!assistantText.includes(normalizedText(item.name)));
}
function reserveAnswer(catalog,mode,query,prior,constraints){
 const intent=constraints.intent||currentIntent(query);
 const ranked=alternativeCatalog(catalog,intent,prior).map(item=>({item,score:intentScore(item,intent,query)}))
  .filter(({score})=>score>0).sort((a,b)=>b.score-a.score||a.item.id-b.item.id).map(({item})=>item);
 let options=ranked.slice(0,3);
 if(intent.withDrink){
  const meal=ranked.find(item=>['Regional','Caseiro','Vegetariano'].includes(item.category));
  const drink=meal
   ?(ranked.find(item=>item.category==='Bebidas'&&item.storeId===meal.storeId)||ranked.find(item=>item.category==='Bebidas'))
   :null;
  if(meal&&drink)options=[meal,drink];
 }
 return {...catalogAnswer(options,mode,constraints,true,intent.another),provider:'reserve',model:'deterministic-v1'};
}
function catalogFactRequest(text){
 const clean=normalizedText(text);
 return {
  mostExpensive:/\b(?:mais car[oa]|maior preco)\b/.test(clean),
  cheapest:/\b(?:mais barat[oa]|menor preco)\b/.test(clean),
  mostOrdered:/\b(?:mais pedid[oa]|mais vendid[oa]|mais popular)\b/.test(clean)
 };
}
function catalogFactAnswer(city,mode,text){
 const fact=catalogFactRequest(text);
 if(!fact.mostExpensive&&!fact.cheapest&&!fact.mostOrdered)return null;
 const items=CATALOG.products.map(product=>productInfo(product,city,mode)).filter(item=>item&&item.available);
 const money=value=>'R$ '+(value/100).toFixed(2).replace('.',',');
 const parts=[];const productIds=[];
 if(items.length&&(fact.mostExpensive||fact.cheapest)){
  const sorted=[...items].sort((a,b)=>a.price-b.price||a.id-b.id);
  const item=fact.mostExpensive?sorted[sorted.length-1]:sorted[0];
  parts.push('Pelo preço do produto, a opção '+(fact.mostExpensive?'mais cara':'mais barata')+' disponível é '+item.name+': '+money(item.price)+'. '+(mode==='pickup'?'Na retirada não há taxa de entrega.':'Com a entrega cadastrada, o total fica '+money(item.total)+'.'));
  productIds.push(item.id);
 }
 if(fact.mostOrdered)parts.push('O catálogo demonstrativo ainda não registra quantidade de pedidos ou vendas, então não dá para afirmar qual item é o mais pedido.');
 return {text:parts.join(' '),provider:'rules',model:'catalog-facts-v1',productIds};
}
function budgetNoMatchAnswer(city,mode,query,constraints){
 if(constraints.budget===null)return null;
 const unconstrained={...constraints,budget:null};
 const candidates=summary(city,mode,query,unconstrained);
 if(!candidates.length)return null;
 const scope=constraints.budgetScope==='products'?'priceReais':'totalReais';
 const closest=[...candidates].sort((a,b)=>Number(a[scope])-Number(b[scope])||a.id-b.id)[0];
 const value=Math.round(Number(closest[scope])*100);
 const over=value-constraints.budget;
 if(over<=0)return null;
 const money=cents=>'R$ '+(cents/100).toFixed(2).replace('.',',');
 const basis=constraints.budgetScope==='products'?'considerando só o produto':'contando a entrega';
 let text='Não encontrei opção compatível até '+money(constraints.budget)+' '+basis+'. A mais próxima é '+closest.name+', por '+money(value)+', ficando '+money(over)+' acima do limite.';
 if(constraints.budgetScope==='total'&&mode==='delivery'&&closest.priceReais&&Math.round(Number(closest.priceReais)*100)<=constraints.budget){
  text+=' Se quiser, posso usar esse mesmo limite só para o produto e deixar a entrega à parte.';
 }
 return {text,provider:'rules',model:'budget-explain-v1',productIds:[]};
}
function sabiaContext(city,mode,constraints,catalog){
 return 'Você é Sabiá, assistente do APETÊ. Ajude a escolher até 3 opções do catálogo permitido, considerando a intenção atual e o histórico. Regras de conversa: "mais opções", "tem mais?" e "quero mais" continuam o assunto anterior e não devem repetir itens já mostrados; mensagens que só alteram orçamento ou entrega mantêm a intenção anterior; "almoço com bebida" significa escolher um prato e uma bebida, preferindo a mesma loja; quando a intenção estiver ambígua, peça esclarecimento em vez de chutar. Responda JSON: {"message":"uma frase curta, natural e específica para o pedido, sem repetir estas são opções", "recommendations":[{"productId":2,"reason":"motivo curto e personalizado"}]}. Explique sua escolha de forma breve em português brasileiro, relacionando-a ao pedido, à praticidade, ao gosto ou à variedade. A mensagem e os motivos não devem incluir preços, taxas, quantidades, estoque, estabelecimentos, promoções nem alegações nutricionais. O servidor acrescentará todos os nomes e dados comerciais verdadeiros. Se mencionar um produto, use o nome exato de um ID selecionado; nunca transforme categorias em nomes. Não invente produtos, ingredientes ou combos. Pode citar literalmente a descrição cadastrada para explicar a escolha. Não retorne campos extras de preço ou nome. Quando completeBreakfast ou completeSnack for true, priorize como primeira opção um combo/refeição completa já cadastrado e compatível, se houver. Se o catálogo estiver vazio, retorne {"message":"", "recommendations":[]}. As constraints atuais substituem regras antigas. Dados demonstrativos. Cidade: '+city+'; modalidade: '+mode+'; constraints: '+JSON.stringify(constraints)+'; catálogo permitido: '+JSON.stringify(catalog);
}


function reserveSemanticAnswer(city,mode,query,prior,baseConstraints,fallbackIntent){
 const semantic=semanticFallbackIntent(query,prior),intent=semanticToLegacy(semantic,fallbackIntent);
 if(semantic.confidence<CONFIDENCE.low&&!['chat','fact'].includes(semantic.action))return {text:'Não entendi bem o que você quis dizer. Pode repetir de outro jeito?',provider:'reserve',model:'deterministic-v3',productIds:[]};
 const currentHard=requestConstraints(query),carryContext=semantic.keepPreviousContext||['alternative','refine','confirm'].includes(semantic.action);
 const historyHard=carryContext?conversationConstraints('tem mais opções',prior):null;
 const carriedExcluded=carryContext?prior.filter(message=>message.role==='user').flatMap(message=>requestConstraints(message.content).excluded):[];
 const hard={...baseConstraints};
 if(carryContext&&historyHard){
  if(!currentHard.budgetChanged&&hard.budget===null)hard.budget=historyHard.budget;
  if(currentHard.budgetScope===null)hard.budgetScope=historyHard.budgetScope;
 }
 const constraints={...hard,excluded:[...new Set([...(hard.excluded||[]),...carriedExcluded,...(semantic.exclusions||[]).flatMap(value=>normalizedWords(value))])],intent};
 if(semantic.action==='chat')return {text:'Oi! Posso te ajudar a encontrar algo do catálogo, comparar opções ou montar um pedido.',provider:'reserve',model:'deterministic-v2',productIds:[]};
 if(semantic.action==='clarify')return {text:'Pode me dizer qual tipo de produto, preferência ou restrição você quer considerar?',provider:'reserve',model:'deterministic-v2',productIds:[]};
 const fact=semanticFactAnswer(city,mode,query,semantic,constraints,prior);
 if(fact)return {...fact,provider:'reserve',model:'deterministic-v2'};
 if(semantic.action==='list'){
  const listed=semanticListAnswer(city,mode,query,constraints,prior);
  if(listed)return {...listed,provider:'reserve',model:'deterministic-v2'};
 }
 const components=(semantic.components||[]).filter(component=>component!=='catalog').slice(0,3);
 if(components.length>1){
  const bundle=genericBundle(city,mode,query,prior,constraints,components,[]);
  if(bundle)return {...bundleAnswer(bundle,mode,constraints,{},true),provider:'reserve',model:'deterministic-v2'};
 }
 let catalog=alternativeCatalog(summary(city,mode,query,constraints),intent,prior);
 if(!catalog.length&&constraints.budget!==null){
  const budgetAnswer=budgetNoMatchAnswer(city,mode,query,constraints);
  if(budgetAnswer)return {...budgetAnswer,provider:'reserve',model:'deterministic-v2'};
 }
 if(!catalog.length&&intent.vegan)return {text:'Não encontrei itens cadastrados como veganos para esta cidade e modalidade. Prefiro não presumir que um produto seja vegano sem essa informação no catálogo.',provider:'reserve',model:'deterministic-v2',productIds:[]};
 if(!catalog.length&&intent.vegetarian)return {text:'Não encontrei item cadastrado como vegetariano para esta cidade e modalidade.',provider:'reserve',model:'deterministic-v2',productIds:[]};
 if(!catalog.length&&intent.another)return {text:'Não encontrei outra opção compatível no catálogo para esse mesmo pedido.',provider:'reserve',model:'deterministic-v2',productIds:[]};
 if(!catalog.length)return {text:'Não encontrei produto compatível com sua intenção, cidade, modalidade e restrições atuais.',provider:'reserve',model:'deterministic-v2',productIds:[]};
 return {...reserveAnswer(catalog,mode,query,prior,constraints),provider:'reserve',model:'deterministic-v2'};
}

async function generateSemantic(env,messages,city,mode,query,prior,baseConstraints,fallbackIntent){
 const choices=[['groq',env.GROQ_API_KEY],['gemini',env.GEMINI_API_KEY],['cloudflare',env.AI]].filter(([,binding])=>Boolean(binding));
 if(!choices.length)throw {code:'not_configured',status:503};
 const fallbackSemantic=semanticFallbackIntent(query,prior);let last=null;
 for(const [name] of choices){
  if((blocked.get(name)||0)>Date.now())continue;
  let stage='network';
  try{
   const answer=await callProvider(name,env,messages);stage='validation';
   const data=parseProviderObject(answer.text);
   if(!data?.intent||typeof data.intent!=='object'||Array.isArray(data.intent))throw validationFailure();
   let semantic=normalizeIntent(data.intent,fallbackSemantic);
   const currentSemantic=localSemanticIntent(query);
   if(currentSemantic.action==='chat')semantic={...semantic,topic:'catalog',action:'chat',fact:'none',components:[],preferences:[],modifiers:[],exclusions:[],searchTerms:[],keepPreviousContext:false};
   else if(currentSemantic.action==='confirm'&&fallbackSemantic.topic!=='catalog'){
    semantic={...semantic,topic:fallbackSemantic.topic,action:'recommend',fact:'none',components:[...(fallbackSemantic.components||[])],preferences:[...(fallbackSemantic.preferences||[])],modifiers:[...(fallbackSemantic.modifiers||[])],exclusions:[...(fallbackSemantic.exclusions||[])],searchTerms:[],keepPreviousContext:true,confidence:Math.max(.8,semantic.confidence||0)};
   }else if(['clarify','chat'].includes(semantic.action)&&['recommend','switch'].includes(currentSemantic.action)&&currentSemantic.topic!=='catalog'&&currentSemantic.confidence>=CONFIDENCE.high){
    semantic={...semantic,topic:currentSemantic.topic,action:currentSemantic.action,fact:'none',components:[...(currentSemantic.components||[])],preferences:currentSemantic.preferences.length?[...currentSemantic.preferences]:semantic.preferences,modifiers:currentSemantic.modifiers.length?[...currentSemantic.modifiers]:semantic.modifiers,keepPreviousContext:currentSemantic.keepPreviousContext,confidence:Math.max(currentSemantic.confidence,semantic.confidence||0)};
   }else if(currentSemantic.action==='fact'&&currentSemantic.fact!=='none'){
    semantic={...semantic,topic:currentSemantic.topic!=='catalog'?currentSemantic.topic:semantic.topic,action:'fact',fact:currentSemantic.fact,preferences:currentSemantic.preferences.length?currentSemantic.preferences:semantic.preferences,searchTerms:semantic.searchTerms.length?semantic.searchTerms:[...(currentSemantic.searchTerms||[])]};
   }else if(currentSemantic.action==='list'){
    semantic={...semantic,topic:currentSemantic.topic!=='catalog'?currentSemantic.topic:semantic.topic,action:'list',components:currentSemantic.components.length?[...currentSemantic.components]:semantic.components};
   }else if(fallbackSemantic.keepPreviousContext&&currentSemantic.topic==='catalog'&&currentSemantic.fact==='none'&&['recommend','list','alternative','refine'].includes(semantic.action)){
    semantic={...semantic,topic:fallbackSemantic.topic,components:[...(fallbackSemantic.components||[])],preferences:semantic.preferences.length?semantic.preferences:[...(fallbackSemantic.preferences||[])],modifiers:semantic.modifiers.length?semantic.modifiers:[...(fallbackSemantic.modifiers||[])],keepPreviousContext:true};
   }
   if(fallbackSemantic.confidence<CONFIDENCE.low&&!['chat','fact'].includes(semantic.action)&&semantic.confidence<0.9){
    console.info('sabia_provider_success',{provider:answer.provider,model:answer.model});
    return {...answer,text:'Não entendi bem o que você quis dizer. Pode repetir de outro jeito?',productIds:[]};
   }
   const intent=semanticToLegacy(semantic,fallbackIntent);
   const semanticExcluded=(semantic.exclusions||[]).flatMap(value=>normalizedWords(value));
   const currentHard=requestConstraints(query),carryContext=semantic.keepPreviousContext||['alternative','refine','confirm'].includes(semantic.action);
   const historyHard=carryContext?conversationConstraints('tem mais opções',prior):null;
   const carriedExcluded=carryContext?prior.filter(message=>message.role==='user').flatMap(message=>requestConstraints(message.content).excluded):[];
   const hard={...baseConstraints};
   if(carryContext&&historyHard){
    if(!currentHard.budgetChanged&&hard.budget===null)hard.budget=historyHard.budget;
    if(currentHard.budgetScope===null)hard.budgetScope=historyHard.budgetScope;
   }
   const constraints={...hard,excluded:[...new Set([...(hard.excluded||[]),...carriedExcluded,...semanticExcluded])],intent};
   if(semantic.action==='chat'){
    console.info('sabia_provider_success',{provider:answer.provider,model:answer.model});
    return {...answer,...semanticChatAnswer(data)};
   }
   if(semantic.action==='clarify'){
    const message=safeExplanation(data.message||'',[])||'Pode me dizer qual tipo de produto, preferência ou restrição você quer considerar?';
    console.info('sabia_provider_success',{provider:answer.provider,model:answer.model});
    return {...answer,text:message,productIds:[]};
   }
   const fact=semanticFactAnswer(city,mode,query,semantic,constraints,prior);
   if(fact){
    console.info('sabia_provider_success',{provider:answer.provider,model:answer.model});
    return {...answer,text:fact.text,productIds:fact.productIds};
   }
   if(semantic.action==='list'){
    const listed=semanticListAnswer(city,mode,query,constraints,prior);
    if(listed){
     console.info('sabia_provider_success',{provider:answer.provider,model:answer.model});
     return {...answer,...listed};
    }
   }
   const components=(semantic.components||[]).filter(component=>component!=='catalog').slice(0,3);
   if(components.length>1){
    const suggested=Array.isArray(data.recommendations)?data.recommendations.map(entry=>Number(entry?.productId)).filter(Number.isInteger):[];
    const bundle=genericBundle(city,mode,query,prior,constraints,components,suggested);
    if(bundle){
     console.info('sabia_provider_success',{provider:answer.provider,model:answer.model});
     return {...answer,...bundleAnswer(bundle,mode,constraints,data,false)};
    }
   }
   let catalog=alternativeCatalog(summary(city,mode,query,constraints),intent,prior);
   if(!catalog.length&&constraints.budget!==null){
    const budgetAnswer=budgetNoMatchAnswer(city,mode,query,constraints);
    if(budgetAnswer){
     console.info('sabia_provider_success',{provider:answer.provider,model:answer.model});
     return {...answer,text:budgetAnswer.text,productIds:[]};
    }
   }
   if(!catalog.length&&intent.vegan){
    console.info('sabia_provider_success',{provider:answer.provider,model:answer.model});
    return {...answer,text:'Não encontrei itens cadastrados como veganos para esta cidade e modalidade. Prefiro não presumir que um produto seja vegano sem essa informação no catálogo.',productIds:[]};
   }
   if(!catalog.length&&intent.vegetarian){
    console.info('sabia_provider_success',{provider:answer.provider,model:answer.model});
    return {...answer,text:'Não encontrei item cadastrado como vegetariano para esta cidade e modalidade.',productIds:[]};
   }
   if(!catalog.length&&intent.another){
    console.info('sabia_provider_success',{provider:answer.provider,model:answer.model});
    return {...answer,text:'Não encontrei outra opção compatível no catálogo para esse mesmo pedido.',productIds:[]};
   }
   if(!catalog.length){
    console.info('sabia_provider_success',{provider:answer.provider,model:answer.model});
    return {...answer,text:'Não encontrei produto compatível com sua intenção, cidade, modalidade e restrições atuais.',productIds:[]};
   }
   const options=validatedRecommendations(answer.text,catalog,intent);
   console.info('sabia_provider_success',{provider:answer.provider,model:answer.model});
   return {...answer,...catalogAnswer(options,mode,constraints,false,Boolean(intent.another))};
  }catch(error){
   last=error;stage=error?.stage||stage;
   const status=Number(error?.status)||0,timeout=Boolean(error?.timeout),retryable=stage!=='validation'&&Boolean(error?.retryable);
   console.warn('sabia_provider_failure',{provider:name,stage,status,timeout,retryable});
   if(stage==='provider'&&[400,401,403,404].includes(status))blocked.set(name,Date.now()+5*60*1000);
   else if(stage!=='validation'&&retryable&&(timeout||status===429||status>=500))blocked.set(name,Date.now()+(error.retryAfter||30)*1000);
  }
 }
 throw {code:'providers_unavailable',status:429,retryAfter:last?.retryAfter||60};
}

async function route(req,env){const url=new URL(req.url);const path=url.pathname;
 if(path==='/api/sabia/status'&&req.method==='GET'){const providers=[env.GROQ_API_KEY?'Groq':null,env.AI?'Cloudflare Workers AI':null,env.GEMINI_API_KEY?'Gemini':null].filter(Boolean);return response({mode:providers.length?'generative':'unavailable',configured:providers.length>0,providers,message:providers.length?'Sabiá online: '+providers.join(' → '):'Sabiá ainda não configurada. Catálogo disponível.'});}
 if(path==='/api/catalog'&&req.method==='GET')return response({...CATALOG,demo:true});
 if(!['/api/sabia/session','/api/sabia','/api/sabia/product','/api/sabia/diagnostic'].includes(path)||req.method!=='POST')return failure('not_found','Operação não encontrada.',404);
 if(!authorizedOrigin(req,url))return failure('origin','Origem não autorizada.',403);
 if(!req.headers.get('content-type')?.startsWith('application/json'))return failure('content_type','Envie JSON.',415);
 const body=await postBody(req);
 const secret=env.SABIA_SESSION_SECRET;
 if(!secret||secret.length<32)return failure('not_configured','Configure SABIA_SESSION_SECRET nas configurações privadas do projeto.',503);
 const raw=cookie(req,'apete_sabia_cloud');let sid='',sig='';if(raw.includes('.'))[sid,sig]=raw.split('.');const verified=safeId(sid)&&/^[0-9a-f]{64}$/.test(sig)&&await sign(sid,secret)===sig;
 if(path==='/api/sabia/session'){const id=verified?sid:randomHex(),signature=verified?sig:await sign(id,secret),cid=safeId(body.conversationId)?body.conversationId:randomHex(),csrf=(await sign('csrf:'+id,secret)).slice(0,32);return response({conversationId:cid,csrfToken:csrf,history:[],status:{mode:env.GROQ_API_KEY||env.AI||env.GEMINI_API_KEY?'generative':'unavailable'}},200,{'Set-Cookie':`apete_sabia_cloud=${id}.${signature}; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=7200`});}
 if(!verified)return failure('session','Sua sessão expirou. Reabra a Sabiá.',401);
 const csrf=(await sign('csrf:'+sid,secret)).slice(0,32);if(req.headers.get('X-CSRF-Token')!==csrf)return failure('csrf','Sessão inválida. Reabra a Sabiá.',403);
 if(path==='/api/sabia/diagnostic'){
  const provider=String(body.provider||'').toLowerCase();
  if(!['cloudflare','gemini','groq'].includes(provider))return failure('provider','Provedor de diagnóstico inválido.',400);
  if(typeof body.question!=='string'||!body.question.trim()||body.question.length>1200||!validCity(body.city)||!['delivery','pickup'].includes(body.mode))return failure('invalid_request','Pergunta, cidade ou modalidade inválida.',400);
  if(!providerConfigured(provider,env))return response({ok:false,provider,model:providerModel(provider,env),stage:'not_configured',status:0,timeout:false,retryable:false,detail:'Provedor não configurado neste ambiente.'});
  const prior=messagesFor(body),constraints={...conversationConstraints(body.question,prior),intent:conversationIntent(body.question,prior)};
  let catalog=alternativeCatalog(summary(body.city,body.mode,body.question,constraints),constraints.intent,prior);
  if(constraints.intent.withDrink){
   const pair=mealDrinkPair(catalog,constraints,body.mode);
   if(pair)catalog=[pair.meal,pair.drink];
  }
  const context=sabiaContext(body.city,body.mode,constraints,catalog);
  const messages=[{role:'system',content:context},...prior,{role:'user',content:body.question.trim()}];
  const started=Date.now();
  try{
   const answer=await callProvider(provider,env,messages);
   const options=validatedRecommendations(answer.text,catalog,constraints.intent);
   const validated=catalogAnswer(options,body.mode,constraints,false,Boolean(constraints.intent?.another));
   const elapsedMs=Date.now()-started;
   console.info('sabia_provider_diagnostic',{provider:answer.provider,ok:true,model:answer.model,stage:'success',status:200,elapsedMs,rawPreview:safeProviderDetail(answer.text).slice(0,700),validatedPreview:safeProviderDetail(validated.text).slice(0,700),catalogSize:catalog.length});
   return response({ok:true,provider:answer.provider,model:answer.model,elapsedMs,stage:'success',status:200,raw:answer.text.slice(0,2400),validatedText:validated.text,productIds:validated.productIds,catalogSize:catalog.length});
  }catch(error){
   const elapsedMs=Date.now()-started,detail=safeProviderDetail(error?.detail||error?.message||'Sem detalhe adicional.');
   console.info('sabia_provider_diagnostic',{provider,ok:false,model:providerModel(provider,env),stage:error?.stage||'unknown',status:Number(error?.status)||0,timeout:Boolean(error?.timeout),retryable:Boolean(error?.retryable),elapsedMs,detail});
   return response({ok:false,provider,model:providerModel(provider,env),elapsedMs,stage:error?.stage||'unknown',status:Number(error?.status)||0,timeout:Boolean(error?.timeout),retryable:Boolean(error?.retryable),detail});
  }
 }
 if(path==='/api/sabia/product'){const p=productById.get(body.productId);const info=validCity(body.city)&&['delivery','pickup'].includes(body.mode)?productInfo(p||{},body.city,body.mode):null;if(!info||!info.available)return failure('unavailable','Produto indisponível para esta cidade.',409);return response(info);}
 if(!safeId(body.conversationId)||typeof body.question!=='string'||!body.question.trim()||body.question.length>1200||!validCity(body.city)||!['delivery','pickup'].includes(body.mode))return failure('invalid_request','Pergunta ou cidade inválida.',400);
 const immediateSemantic=localSemanticIntent(body.question);
 if(immediateSemantic.action==='chat')return response({text:'Oi! Posso te ajudar a encontrar algo do catálogo, comparar opções ou montar um pedido.',provider:'rules',model:'conversation-v1',products:[],stores:[],demo:true});
 const factAnswer=catalogFactAnswer(body.city,body.mode,body.question);
 if(factAnswer){
  const products=factAnswer.productIds.map(id=>productInfo(productById.get(id),body.city,body.mode)).filter(Boolean);
  const {productIds,...publicAnswer}=factAnswer;
  return response({...publicAnswer,products,stores:[],demo:true});
 }
 const prior=messagesFor(body),baseConstraints=conversationConstraints(body.question,prior),fallbackIntent=conversationIntent(body.question,prior);
 const available=availableCatalog(body.city,body.mode),fallbackSemantic=semanticFallbackIntent(body.question,prior);
 const semanticMessages=[{role:'system',content:semanticContext(body.city,body.mode,baseConstraints,available,fallbackSemantic)},...prior,{role:'user',content:body.question.trim()}];
 let answer;
 try{
  answer=await generateSemantic(env,semanticMessages,body.city,body.mode,body.question,prior,baseConstraints,fallbackIntent);
 }catch(e){
  if(!['not_configured','providers_unavailable'].includes(e?.code))throw e;
  answer=reserveSemanticAnswer(body.city,body.mode,body.question,prior,baseConstraints,fallbackIntent);
 }
 const {productIds,...publicAnswer}=answer;
 const products=productIds.map(id=>productInfo(productById.get(id)||{},body.city,body.mode)).filter(item=>item&&item.available);
 return response({...publicAnswer,products,stores:[],demo:true});
}
export default {async fetch(request,env){try{if(new URL(request.url).pathname.startsWith('/api/'))return await route(request,env);return env.ASSETS.fetch(request);}catch(e){return failure(e.code||'internal',e.message&&e.code?e.message:'A Sabiá está temporariamente indisponível. O catálogo continua acessível.',e.status||503,e.retryAfter||0);}}};
