import test from 'node:test';
import assert from 'node:assert/strict';
import worker from '../src/worker.js';

const origin='https://test.example';
const baseEnv={SABIA_SESSION_SECRET:'test-only-secret-'.repeat(3)};

async function session(env=baseEnv){
 const response=await worker.fetch(new Request(origin+'/api/sabia/session',{
  method:'POST',
  headers:{Origin:origin,'Content-Type':'application/json'},
  body:'{}'
 }),env);
 assert.equal(response.status,200);
 const data=await response.json();
 return {
  conversationId:data.conversationId,
  csrfToken:data.csrfToken,
  cookie:response.headers.get('Set-Cookie').split(';')[0]
 };
}

async function ask(question,{history=[],city='Guaraciaba do Norte',mode='delivery',env=baseEnv}={}){
 const auth=await session(env);
 const response=await worker.fetch(new Request(origin+'/api/sabia',{
  method:'POST',
  headers:{
   Origin:origin,
   'Content-Type':'application/json',
   'X-CSRF-Token':auth.csrfToken,
   Cookie:auth.cookie
  },
  body:JSON.stringify({conversationId:auth.conversationId,question,city,mode,history})
 }),env);
 assert.equal(response.status,200);
 return response.json();
}

test('frete variável é uma estimativa inicial e não confirma o orçamento final',async()=>{
 const data=await ask('quero almoço até 40 reais');
 assert.ok(data.products.length>0);
 assert.ok(data.products.every(item=>item.deliveryVariable&&item.feePerKm===100));
 assert.match(data.text,/orçamento só pode ser confirmado depois desse cálculo/);
 assert.match(data.text,/distância pela estrada/);
});

test('API reserva respeita exclusão em linguagem natural',async()=>{
 const data=await ask('quero almoço, não quero carne');
 assert.ok(data.products.length>0);
 assert.ok(data.products.every(item=>!((item.name+' '+item.description).toLowerCase().includes('carne'))));
});

test('saúde vaga não vira atributo inventado do catálogo',async()=>{
 const data=await ask('quero algo saudável');
 assert.equal(data.products.length,0);
 assert.match(data.text,/tipo de produto|preferência|restrição/i);
});

test('quantidade de pessoas usa somente capacidade cadastrada e multiplica unidades',async()=>{
 const data=await ask('quero almoço para 4 pessoas');
 assert.ok(data.products.length>0);
 for(const option of data.products){
  assert.ok(option.quantity*option.serves>=4);
  assert.equal(option.total,option.price*option.quantity+option.fee);
 }
});

test('esquecer orçamento preserva o assunto e não ressuscita o limite',async()=>{
 const history=[
  {role:'user',content:'quero almoço até 40'},
  {role:'user',content:'esquece o limite'}
 ];
 const data=await ask('qual o mais caro?',{history});
 assert.equal(data.products.length,1);
 assert.equal(data.products[0].id,1);
 assert.match(data.text,/mais cara/i);
});

test('popularidade sem dados permanece fato determinístico',async()=>{
 const data=await ask('qual o mais pedido?');
 assert.equal(data.products.length,0);
 assert.match(data.text,/não (?:registra|dá para afirmar)|nao (?:registra|da para afirmar)/i);
});

test('status expõe a ordem real de provedores sem chamar nenhum deles',async()=>{
 const env={...baseEnv,GROQ_API_KEY:'x',GEMINI_API_KEY:'y',AI:{run(){throw new Error('não deve chamar');}}};
 const response=await worker.fetch(new Request(origin+'/api/sabia/status'),env);
 assert.equal(response.status,200);
 const data=await response.json();
 assert.deepEqual(data.providers,['Groq','Gemini','Cloudflare Workers AI']);
});


test('catálogo regional expõe cidades e variedade mínima sem quebrar a API',async()=>{
 const response=await worker.fetch(new Request(origin+'/api/catalog'),baseEnv);
 assert.equal(response.status,200);
 const data=await response.json();
 assert.ok(Array.isArray(data.cities));
 assert.ok(data.cities.includes('Guaraciaba do Norte'));
 assert.ok(data.cities.includes('Tianguá'));
 assert.ok(data.stores.length>=18);
 assert.ok(data.products.length>=90);
 assert.ok(data.stores.filter(store=>store.producer).length>=9);
 for(const city of data.cities)assert.ok(data.stores.some(store=>store.city===city));
});


test('atalho Última Fornada explica a iniciativa sem confirmar promoções sem validade',async()=>{
 const data=await ask('O que é a Última Fornada? Há ofertas válidas?');
 assert.equal(data.model,'last-batch-info-v1');
 assert.match(data.text,/reduzir desperdício/);
 assert.match(data.text,/não há ofertas dentro do prazo/);
 assert.deepEqual(data.products,[]);
});

test('pedido de pizza reconhece categoria expandida e respeita cidade e orçamento',async()=>{
 const data=await ask('Quero uma pizza até R$ 80 com entrega.',{city:'Tianguá'});
 assert.ok(data.products.length>0);
 for(const p of data.products){assert.match(p.name,/pizza/i);assert.equal(p.city,'Tianguá');assert.ok(p.total<=8000);}
});

test('café e pão de queijo não são substituídos por pão de coco',async()=>{
 const data=await ask('Quero café e pão de queijo até R$ 30 com entrega.',{city:'Ubajara'});
 assert.ok(data.products.some(p=>/pão de queijo/i.test(p.name)));
 assert.ok(data.products.some(p=>/café|cappuccino/i.test(p.name)));
 assert.ok(data.products.every(p=>!/pão de coco/i.test(p.name)));
});

test('excluir pizza não transforma a exclusão em uma exigência de pizza',async()=>{
 const data=await ask('Quero almoço, não quero pizza, até R$ 60.',{city:'Guaraciaba do Norte'});
 assert.ok(data.products.length>0);
 assert.ok(data.products.every(p=>!/pizza/i.test(p.name)));
});
