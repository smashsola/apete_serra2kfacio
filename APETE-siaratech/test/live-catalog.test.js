import test from 'node:test';
import assert from 'node:assert/strict';
import worker from '../src/worker.js';
import {loadLiveCatalog} from '../src/live-catalog.js';
const origin='https://apete.test',city='Guaraciaba do Norte';
const env={SABIA_SESSION_SECRET:'catalog-test-secret-'.repeat(3),SUPABASE_URL:'https://catalog.example',SUPABASE_PUBLISHABLE_KEY:'sb_publishable_test'};
const store={id:'store-uuid',public_id:201,name:'Loja atual',city,delivery_fee:500,active:true,delivery:true,pickup:true,service_areas:[city],demo:false};
const product={id:'product-uuid',public_id:301,store_id:'store-uuid',name:'Produto atualizado',price:1700,stock:3,active:true,old_price:2000,last_batch:true,demo:false};
function catalogFetch(s=store,p=product) {return async(url,options)=>{
 assert.equal(options.headers.Authorization,'Bearer sb_publishable_test');
 const rows=String(url).includes('/stores?')?[s]:[p];
 return new Response(JSON.stringify(rows),{headers:{'Content-Range':`0-0/${rows.length}`}});
};}
async function session(e=env){const r=await worker.fetch(new Request(origin+'/api/sabia/session',{method:'POST',headers:{Origin:origin,'Content-Type':'application/json'},body:'{}'}),e);return {body:await r.json(),cookie:r.headers.get('Set-Cookie').split(';')[0]};}
async function lookup(e=env,auth=null,id=301){const a=auth||await session(e);return worker.fetch(new Request(origin+'/api/sabia/product',{method:'POST',headers:{Origin:origin,'Content-Type':'application/json',Cookie:a.cookie,'X-CSRF-Token':a.body.csrfToken},body:JSON.stringify({productId:id,city,mode:'delivery'})}),e);}
test('live catalogue price agrees with database checkout; edits and stock are rechecked',async()=>{
 const original=globalThis.fetch;
 try {
  globalThis.fetch=catalogFetch();const a=await session();
  const first=await (await lookup(env,a)).json();
  assert.equal(first.price,1700);assert.equal(first.total,2200);assert.equal(first.demo,false);
  globalThis.fetch=catalogFetch(store,{...product,price:1900});
  assert.equal((await (await lookup(env,a)).json()).price,1900);
  globalThis.fetch=catalogFetch(store,{...product,stock:0});assert.equal((await lookup(env,a)).status,409);
 } finally {globalThis.fetch=original;}
});
test('failure and empty live catalogue never fall back to demonstration products',async()=>{
 const original=globalThis.fetch;
 try {
  globalThis.fetch=async()=>new Response('{}',{status:503});
  assert.equal((await lookup()).status,503);
  globalThis.fetch=async()=>new Response('[]');
  assert.equal((await lookup()).status,409);
 } finally {globalThis.fetch=original;}
});
test('unauthenticated AI requests do not query the catalogue',async()=>{
 const original=globalThis.fetch;let calls=0;
 try {
  globalThis.fetch=async()=>{calls++;throw Error('should not fetch');};
  const r=await worker.fetch(new Request(origin+'/api/sabia/product',{method:'POST',headers:{Origin:origin,'Content-Type':'application/json'},body:'{}'}),env);
  assert.equal(r.status,401);assert.equal(calls,0);
 }finally {globalThis.fetch=original;}
});
test('overlapping requests keep separate catalogue maps',async()=>{
 const original=globalThis.fetch;
 try {
  globalThis.fetch=async(url)=>{
   const one=new URL(url).hostname==='one.example';
   if(one)await new Promise(resolve=>setTimeout(resolve,20));
   return new Response(JSON.stringify(String(url).includes('/stores?')?[store]:[{...product,name:one?'Primeiro':'Segundo',price:one?1100:3300}]));
  };
  const [one,two]=await Promise.all([lookup({...env,SUPABASE_URL:'https://one.example'}),lookup({...env,SUPABASE_URL:'https://two.example'})]);
  const a=await one.json(),b=await two.json();
  assert.equal(a.name,'Primeiro');assert.equal(a.price,1100);assert.equal(b.name,'Segundo');assert.equal(b.price,3300);
 }finally {globalThis.fetch=original;}
});
test('catalogue follows pagination rather than silently omitting products',async()=>{
 const original=globalThis.fetch;
 try {
  globalThis.fetch=async(url)=>{
   const u=new URL(url);
   if(u.pathname.includes('/stores'))return new Response(JSON.stringify([store]),{headers:{'Content-Range':'0-0/1'}});
   const offset=Number(u.searchParams.get('offset')),count=offset===0?1000:1;
   return new Response(JSON.stringify(Array.from({length:count},(_,i)=>({...product,public_id:offset+i+1}))),{headers:{'Content-Range':`${offset}-${offset+count-1}/1001`}});
  };
  assert.equal((await loadLiveCatalog(env,[city])).products.length,1001);
 }finally {globalThis.fetch=original;}
});
test('inactive or unavailable delivery does not produce an actionable recommendation',async()=>{
 const original=globalThis.fetch;
 try {
  globalThis.fetch=catalogFetch({...store,service_areas:['Tianguá']});assert.equal((await lookup()).status,409);
 }finally {globalThis.fetch=original;}
});
