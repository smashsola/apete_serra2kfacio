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
 assert.equal(data.products.length,1);
 assert.equal(data.products[0].id,1);
 assert.match(data.text,/2 unidades/i);
 assert.match(data.text,/R\$ 130,00/);
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
 assert.equal(data.stores.filter(store=>store.producer).length,5);
});
