const {test}=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const vm=require('node:vm');
const {webcrypto}=require('node:crypto');
const source=fs.readFileSync(require('node:path').join(__dirname,'../src/worker.js'),'utf8');
function load(overrides={}){
 const context=vm.createContext({Response,Request,URL,TextEncoder,AbortController,crypto:webcrypto,setTimeout,clearTimeout,console:{warn(){}},...overrides});
 vm.runInContext(source.replace('export default','const worker =')+'\nthis.api={conversationConstraints,conversationIntent,summary,reserveAnswer,validatedRecommendations,productInfo,productById,generate,worker};',context);
 return context.api;
}
const api=load(),city='Guaraciaba do Norte';
const user=content=>({role:'user',content});
function answer(query,{history=[],town=city,mode='delivery'}={}){
 const constraints={...api.conversationConstraints(query,history),intent:api.conversationIntent(query,history)};
 const catalog=api.summary(town,mode,query,constraints);
 const result=api.reserveAnswer(catalog,mode,query,history,constraints);
 return {...result,cards:result.productIds.map(id=>api.productInfo(api.productById.get(id),town,mode)),constraints};
}
test('current intent selects only compatible categories, even after an earlier budget',()=>{
 const history=[user('quero um almoço até 30 reais')];
 for(const query of ['quero almoço','quero uma refeição','quero jantar','quero um prato']){
  const result=answer(query,{history});
  assert.equal(result.constraints.budget,null);
  assert.ok(result.cards.length>0&&result.cards.every(p=>['Regional','Caseiro','Vegetariano'].includes(p.category)));
 }
 const dessert=answer('quero uma sobremesa',{history});
 assert.ok(dessert.cards.length>0);
 assert.ok(dessert.cards.every(p=>p.category==='Doces'||/Geleia/.test(p.name)));
 for(const query of ['quero bebida','quero suco'])assert.ok(answer(query).cards.every(p=>p.category==='Bebidas'));
 assert.ok(answer('quero suco').cards.every(p=>p.name.startsWith('Suco')));
 assert.ok(answer('quero lanche').cards.every(p=>['Padaria','Doces'].includes(p.category)));
 assert.equal(answer('quero café da manhã').cards.length,3);
 assert.equal(answer('quero vegetariano',{town:'São Benedito'}).cards[0].name,'Almoço vegetariano');
 assert.ok(answer('quero saudável',{town:'São Benedito'}).cards.every(p=>p.category==='Vegetariano'));
 assert.ok(answer('quero produtor').cards.every(p=>p.category==='Do produtor'));
 assert.ok(answer('quero horta').cards.every(p=>/hortaliças|horta/i.test(p.name)));
 assert.equal(answer('quero orgânico').cards.length,0);
 assert.ok(answer('quero orgânico',{town:'Ibiapina'}).cards.length>0);
});
test('another option excludes products in the latest assistant reply and is deterministic',()=>{
 const first=answer('quero uma sobremesa');
 const history=[user('quero uma sobremesa'),{role:'assistant',content:first.text}];
 const next=answer('quero outra coisa',{history});
 assert.ok(next.cards.length>0);
 assert.ok(next.cards.every(p=>!first.cards.some(old=>old.id===p.id)));
 assert.equal(next.text,answer('quero outra coisa',{history}).text);
});
test('new explicit searches clear the old budget and reset scope even without a new price',()=>{
 const history=[user('quero uma sobremesa até 25 reais sem contar entrega')];
 for(const query of ['quero sobremesa','quero café da manhã','quero almoço','quero um lanche','quero um lanchinho']){
  const c=answer(query,{history}).constraints;
  assert.equal(c.budget,null,query);assert.equal(c.budgetScope,'total',query);
 }
 const breakfast=answer('quero um café da manhã completo com café e algo pra comer',{history});
 assert.equal(breakfast.constraints.budget,null);
 assert.equal(breakfast.cards[0].id,10);
 const c=answer('quero um lanche só o produto',{history}).constraints;
 assert.equal(c.budget,null);assert.equal(c.budgetScope,'products');
 const followup=[user('quero um almoço até 40'),user('sem contar a entrega')];
 assert.equal(answer('sem contar a entrega',{history:[followup[0]]}).constraints.budget,4000);
 const changed=answer('pode ser até 50',{history:followup}).constraints;
 assert.equal(changed.budget,5000);assert.equal(changed.budgetScope,'products');assert.equal(changed.intent.kind,'meal');
 assert.equal(answer('sem contar entrega',{history:[...history,user('quero almoço')]}).constraints.budget,null);
});
test('snack variants recognize real combos, preserve follow-ups and respect restrictions',()=>{
 for(const word of ['lanche','lanches','lanchinho','lanchinhos']){
  const result=answer('quero '+word);
  assert.equal(result.constraints.intent.kind,'snack');
  assert.ok(result.cards.length>0&&result.cards.every(p=>['Padaria','Doces'].includes(p.category)));
  for(const suffix of ['completo','combo'])assert.equal(answer('quero '+word+' '+suffix).cards[0].id,10);
 }
 assert.equal(answer('pode ser até 40',{history:[user('quero lanchinho completo')]}).cards[0].id,10);
 assert.ok(!answer('quero lanchinho completo até 25').cards.some(p=>p.id===10));
 assert.equal(answer('quero lanchinho completo',{town:'São Benedito'}).cards.length,0);
 const query='quero lanchinho completo',intent=api.conversationIntent(query,[]);
 const catalog=api.summary(city,'delivery',query,{...api.conversationConstraints(query,[]),intent});
 const combo=catalog.find(p=>p.id===10),single=catalog.find(p=>p.id!==10);
 const json=p=>JSON.stringify({recommendations:[{productId:p.id,name:p.name}]});
 assert.throws(()=>api.validatedRecommendations(json(single),catalog,intent));
 assert.equal(api.validatedRecommendations(json(combo),catalog,intent)[0].id,10);
 assert.equal(api.validatedRecommendations(json(single),catalog.filter(p=>p.id!==10),intent)[0].id,single.id);
});
test('a new search with a new budget resets delivery scope while modifiers preserve it',()=>{
 const history=[user('quero um almoço até 40 sem contar entrega')];
 const dessert=answer('quero uma sobremesa até 25',{history});
 assert.equal(dessert.constraints.budgetScope,'total');
 assert.equal(dessert.constraints.budget,2500);
 assert.ok(dessert.cards.every(p=>p.total<=2500));
 assert.equal(answer('pode ser até 25',{history}).constraints.budgetScope,'products');
 assert.equal(answer('quero uma sobremesa até 25 só o produto',{history}).constraints.budgetScope,'products');
 const next=[...history,user('quero uma sobremesa até 25')];
 assert.equal(answer('pode ser até 30',{history:next}).constraints.budgetScope,'total');
 const breakfast=answer('quero café da manhã completo até 35',{history});
 assert.equal(breakfast.constraints.budgetScope,'total');
 assert.ok(!breakfast.cards.some(p=>p.id===10)); // R$32 + R$4.50 exceeds the new total cap.
});
test('complete breakfast ranks a real combo first, including after budget-only follow-ups',()=>{
 for(const query of ['quero café da manhã completo','quero um combo de café da manhã','quero café e algo para comer','quero café da manhã como refeição completa']){
  const result=answer(query);
  assert.equal(result.cards[0].id,10,query);
  assert.equal(result.cards[0].name,'Combo café da manhã');
 }
 assert.equal(answer('pode ser até 40',{history:[user('quero café da manhã completo')]}).cards[0].id,10);
 assert.ok(!answer('café da manhã completo até 30').cards.some(p=>p.id===10));
 assert.equal(answer('café da manhã completo até 32 só o produto').cards[0].id,10);
 assert.equal(answer('café da manhã completo até 32',{mode:'pickup'}).cards[0].id,10);
 assert.equal(answer('café da manhã completo',{town:'São Benedito'}).cards.length,0);
});
test('generative breakfast selection must also prioritize a compatible real combo',()=>{
 const query='quero café da manhã completo',intent=api.conversationIntent(query,[]);
 const constraints={...api.conversationConstraints(query,[]),intent};
 const catalog=api.summary(city,'delivery',query,constraints);
 const combo=catalog.find(p=>p.id===10),single=catalog.find(p=>p.id!==10);
 const json=items=>JSON.stringify({recommendations:items.map(p=>({productId:p.id,name:p.name}))});
 assert.throws(()=>api.validatedRecommendations(json([single]),catalog,intent));
 assert.equal(api.validatedRecommendations(json([combo,single]),catalog,intent)[0].id,10);
 assert.equal(api.validatedRecommendations(json([single]),catalog.filter(p=>p.id!==10),intent)[0].id,single.id);
});
test('delivery is included by default, excluded explicitly, and pickup has no fee',()=>{
 assert.equal(answer('almoço até 30',{town:'São Benedito'}).cards.length,1);
 const only=answer('almoço até 30 sem contar entrega',{town:'São Benedito'});
 assert.equal(only.cards.length,3);
 assert.ok(only.cards.some(p=>p.total>3000));
 assert.ok(only.cards.every(p=>p.price<=3000));
 assert.match(only.text,/entrega está discriminada/);
 const pickup=answer('almoço até 30',{town:'São Benedito',mode:'pickup'});
 assert.equal(pickup.cards.length,3);
 assert.ok(pickup.cards.every(p=>p.fee===0));
 assert.match(pickup.text,/retirada sem taxa/);
});
test('budget removals are explicit events and do not resurrect an older cap',()=>{
 for(const query of ['pode passar de 30 sem contar a entrega','pode passar de R$ 30 reais','não precisa ser até 30','sem limite','remova o limite','pode ultrapassar 30 reais']){
  const history=[user('quero almoço até 30'),user(query)];
  assert.equal(api.conversationConstraints(query,[history[0]]).budget,null,query);
  assert.equal(api.conversationConstraints('quero sobremesa',history).budget,null,query);
 }
 assert.equal(api.conversationConstraints('pode passar de 30, mas no máximo 50',[user('até 30')]).budget,5000);
 assert.equal(api.conversationConstraints('até 50 mas sem limite',[user('até 30')]).budget,null);
});
test('budget and scope persist independently and can be replaced explicitly',()=>{
 const history=[user('até 30')];
 for(const query of ['só a comida','só o produto','sem a entrega','sem incluir a entrega','apenas os produtos','fora o frete']){
  const c=api.conversationConstraints(query,history);
  assert.equal(c.budget,3000);assert.equal(c.budgetScope,'products',query);
  assert.equal(api.conversationConstraints('pode ser até 35',[...history,user(query)]).budgetScope,'products');
 }
 const c=api.conversationConstraints('até 45 com entrega',[...history,user('só a comida')]);
 assert.equal(c.budget,4500);assert.equal(c.budgetScope,'total');
 assert.equal(api.conversationConstraints('até R$ 29,50',[]).budget,2950);
});
test('intent is inherited only by modifiers, replaced by new subjects and reset by unrelated messages',()=>{
 const history=[user('quero um almoço até 30')];
 for(const query of ['sem a entrega, pode ser até 30','sem contar entrega','pode ser até 40','só a comida']){
  const result=answer(query,{history,town:'São Benedito'});
  assert.equal(result.constraints.intent.kind,'meal',query);
  assert.ok(result.cards.length>0);
  assert.ok(result.cards.every(p=>['Regional','Caseiro','Vegetariano'].includes(p.category)));
 }
 assert.equal(answer('quero uma sobremesa',{history}).constraints.intent.kind,'dessert');
 assert.equal(answer('quero café da manhã',{history}).constraints.intent.kind,'breakfast');
 assert.equal(answer('olá',{history}).constraints.intent.kind,'any');
 assert.equal(answer('até 40',{history:[...history,user('olá')]}).constraints.intent.kind,'any');
});
test('unknown IDs, invented names, injected prose and invalid recommendation structures are rejected',()=>{
 const constraints=api.conversationConstraints('quero almoço',[]),catalog=api.summary(city,'delivery','quero almoço',constraints);
 for(const name of ['Prato Regional','Prato Caseiro','Prato Vegetariano'])assert.throws(()=>api.validatedRecommendations(JSON.stringify({recommendations:[{productId:catalog[0].id,name}]}),catalog));
 for(const response of [
  {recommendations:[{productId:999,name:'Prato Regional'}]},
  {recommendations:[{productId:catalog[0].id,name:catalog[0].name}],text:'Recomendo Prato Regional'},
  {recommendations:[{productId:catalog[0].id,name:catalog[0].name,price:1}]},
  {recommendations:Array(4).fill({productId:catalog[0].id,name:catalog[0].name})},
  {recommendations:[{productId:String(catalog[0].id),name:catalog[0].name}]}
 ])assert.throws(()=>api.validatedRecommendations(JSON.stringify(response),catalog));
 assert.throws(()=>api.validatedRecommendations('Recomendo Prato Regional',catalog));
 const valid={recommendations:[{productId:catalog[0].id,name:catalog[0].name}]};
 assert.equal(api.validatedRecommendations(JSON.stringify(valid),catalog)[0].id,catalog[0].id);
 const constrained=api.summary(city,'delivery','até 1',api.conversationConstraints('até 1',[]));
 assert.throws(()=>api.validatedRecommendations(JSON.stringify(valid),constrained));
});
test('invalid generative output advances to the next provider; text and prices come from the catalog',async()=>{
 const constraints=api.conversationConstraints('quero sobremesa',[]),catalog=api.summary(city,'delivery','quero sobremesa',constraints),calls=[];
 const local=load({fetch:async()=>{calls.push('groq');return Response.json({choices:[{message:{content:JSON.stringify({recommendations:[{productId:7,name:'Prato Regional'}]})}}]});}});
 const env={GROQ_API_KEY:'test',AI:{run:async()=>{calls.push('cloudflare');return {response:JSON.stringify({recommendations:[{productId:catalog[0].id,name:catalog[0].name}]})};}}};
 const result=await local.generate(env,[],catalog,'delivery',constraints);
 assert.deepEqual(calls,['groq','cloudflare']);
 assert.equal(result.provider,'cloudflare');assert.ok(!result.text.includes('Prato Regional'));
 assert.equal(result.productIds[0],catalog[0].id);assert.ok(result.text.includes(catalog[0].name));
 assert.ok(result.text.includes(catalog[0].totalReais.replace('.',',')));
});
test('catalog data, exclusions, city and maximum cards are preserved',()=>{
 assert.equal(answer('quero sobremesa',{town:'Tianguá'}).cards.length,0);
 const result=answer('quero almoço sem carne');
 assert.ok(result.cards.every(p=>!p.name.toLowerCase().includes('carne')));
 assert.equal(result.provider,'reserve');assert.equal(result.model,'deterministic-v1');
 assert.ok(result.cards.length<=3);
 for(const p of result.cards){
  assert.ok(result.text.includes(p.name));
  assert.ok(result.text.includes((p.total/100).toFixed(2).replace('.',',')));
 }
 assert.match(result.text,/1 unidade/);
});
test('provider order, failure fallback and safe logging remain intact',async()=>{
 const calls=[],logs=[];
 const local=load({fetch:async url=>{calls.push(url.includes('groq')?'groq':'gemini');return new Response('{}',{status:429});},console:{warn:(label,data)=>logs.push({label,data})}});
 const env={GROQ_API_KEY:'test',GEMINI_API_KEY:'test',AI:{run:async()=>{calls.push('cloudflare');throw {status:503};}}};
 await assert.rejects(local.generate(env,[]),e=>e.code==='providers_unavailable');
 assert.deepEqual(calls,['groq','cloudflare','gemini']);
 assert.ok(logs.every(log=>Object.keys(log.data).sort().join(',')==='provider,retryable,status,timeout'));
 await assert.rejects(local.generate(env,[]),e=>e.code==='providers_unavailable');
 assert.equal(calls.length,3);
});
test('authenticated API uses reserve after provider failure and returns matching cards',async()=>{
 const local=load(),origin='https://test.example';
 const env={SABIA_SESSION_SECRET:'test-only-secret-'.repeat(3),AI:{run:async()=>{throw {status:503};}}};
 const session=await local.worker.fetch(new Request(origin+'/api/sabia/session',{method:'POST',headers:{Origin:origin,'Content-Type':'application/json'},body:'{}'}),env);
 const data=await session.json();
 const result=await local.worker.fetch(new Request(origin+'/api/sabia',{method:'POST',headers:{Origin:origin,'Content-Type':'application/json','X-CSRF-Token':data.csrfToken,Cookie:session.headers.get('Set-Cookie').split(';')[0]},body:JSON.stringify({conversationId:data.conversationId,question:'quero uma sobremesa',city,mode:'delivery',history:[user('quero almoço até 30')]})}),env);
 assert.equal(result.status,200);
 const body=await result.json();
 assert.equal(body.provider,'reserve');assert.equal(body.model,'deterministic-v1');
 assert.ok(body.products.length>0&&body.products.length<=3);
 assert.ok(body.products.every(p=>body.text.includes(p.name)&&['Doces','Do produtor'].includes(p.category)));
});
