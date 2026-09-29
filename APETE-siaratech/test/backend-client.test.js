import test from 'node:test';
import assert from 'node:assert/strict';

const memory=new Map();
globalThis.window={};
globalThis.localStorage={
  getItem:key=>memory.has(key)?memory.get(key):null,
  setItem:(key,value)=>memory.set(key,String(value)),
  removeItem:key=>memory.delete(key),
  clear:()=>memory.clear()
};

await import('../public/backend-client.js?backend-tests');
const backend=window.APETE_BACKEND;

const response=(data,status=200)=>new Response(data===null?'':JSON.stringify(data),{
  status,
  headers:{'Content-Type':'application/json'}
});

async function loginSession(){
  globalThis.fetch=async(url,options)=>{
    assert.match(String(url),/\/auth\/v1\/token\?grant_type=password$/);
    assert.equal(options.headers.apikey.startsWith('sb_publishable_'),true);
    return response({
      access_token:'user-jwt',
      refresh_token:'refresh-token',
      expires_in:3600,
      user:{id:'11111111-1111-1111-1111-111111111111',email:'cliente@apete.test'}
    });
  };
  await backend.signInCustomer({email:'cliente@apete.test',password:'Senha123'});
}

test('catálogo remoto usa apenas chave publicável e converte IDs públicos',async()=>{
  memory.clear();
  const calls=[];
  globalThis.fetch=async(url,options)=>{
    calls.push({url:String(url),options});
    if(String(url).includes('/stores?'))return response([{
      id:'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',public_id:5,name:'Loja Teste',category:'Regional',city:'Guaraciaba do Norte',
      description:'Teste',hero:'',delivery_fee:600,producer:false,delivery:true,pickup:true,service_areas:['Guaraciaba do Norte'],
      cover:'cover.webp',verified:true,active:true,demo:false,instagram:'@teste',contact_phone:'88999999999'
    }]);
    return response([{
      id:'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb',public_id:25,store_id:'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
      name:'Prato Teste',description:'Descrição',category:'Regional',price:2500,stock:4,image:'foto.webp',old_price:0,
      last_batch:false,preferences:[],serves:2,active:true,demo:false
    }]);
  };
  const catalog=await backend.loadCatalog();
  assert.equal(catalog.stores[0].id,5);
  assert.equal(catalog.stores[0].backendId,'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa');
  assert.equal(catalog.products[0].storeId,5);
  assert.equal(catalog.products[0].id,25);
  assert.equal(calls.every(call=>call.options.headers.apikey.startsWith('sb_publishable_')),true);
  assert.equal(calls.every(call=>String(call.options.headers.Authorization||'').startsWith('Bearer sb_publishable_')),true);
});

test('login salva sessão e leitura de perfil usa JWT do usuário',async()=>{
  memory.clear();
  await loginSession();
  let seenAuthorization='';
  globalThis.fetch=async(url,options)=>{
    assert.match(String(url),/\/rest\/v1\/profiles\?/);
    seenAuthorization=options.headers.Authorization;
    return response([{id:'11111111-1111-1111-1111-111111111111',role:'customer',full_name:'Cliente Teste',phone:'88999999999',address:'Rua A',neighborhood:'Centro',city:'Guaraciaba do Norte'}]);
  };
  const profile=await backend.getProfile();
  assert.equal(profile.email,'cliente@apete.test');
  assert.equal(profile.full_name,'Cliente Teste');
  assert.equal(seenAuthorization,'Bearer user-jwt');
  assert.equal(backend.hasStoredSession(),true);
});

test('criação de pedido envia apenas IDs e quantidades; preço fica no servidor',async()=>{
  memory.clear();
  await loginSession();
  let sent=null;
  globalThis.fetch=async(url,options)=>{
    assert.match(String(url),/\/rest\/v1\/rpc\/create_order$/);
    assert.equal(options.headers.Authorization,'Bearer user-jwt');
    sent=JSON.parse(options.body);
    return response([{order_id:'cccccccc-cccc-cccc-cccc-cccccccccccc',public_number:42,subtotal:5000,delivery_fee:600,total:5600}]);
  };
  const created=await backend.createOrder({
    storeId:2,city:'Guaraciaba do Norte',mode:'delivery',
    customer:{name:'Cliente',phone:'88999999999',address:'Rua A',neighborhood:'Centro'},
    note:'sem cebola',payment:'pix',
    items:[{productId:7,qty:2,price:1,total:2}]
  });
  assert.equal(created.public_number,42);
  assert.deepEqual(sent.p_items,[{productId:7,quantity:2}]);
  assert.equal('price' in sent.p_items[0],false);
  assert.equal('total' in sent.p_items[0],false);
});

test('painel real altera somente status pela rota autenticada',async()=>{
  memory.clear();
  await loginSession();
  let sent=null;
  globalThis.fetch=async(url,options)=>{
    assert.match(String(url),/\/rest\/v1\/orders\?id=eq\./);
    assert.equal(options.method,'PATCH');
    assert.equal(options.headers.Authorization,'Bearer user-jwt');
    sent=JSON.parse(options.body);
    return response([{id:'order-id',status:'ready'}]);
  };
  await backend.updateOrderStatus('order-id','ready');
  assert.deepEqual(sent,{status:'ready'});
});


test('aceites legais usam versão atual e JWT do próprio usuário',async()=>{
  memory.clear();
  await loginSession();
  let sent=null;
  globalThis.fetch=async(url,options)=>{
    assert.match(String(url),/\/rest\/v1\/legal_acceptances\?on_conflict=/);
    assert.equal(options.method,'POST');
    assert.equal(options.headers.Authorization,'Bearer user-jwt');
    sent=JSON.parse(options.body);
    return response(null,204);
  };
  await backend.acceptLegalDocuments(['terms','privacy','terms']);
  assert.equal(sent.length,2);
  assert.deepEqual(sent.map(item=>item.document_type).sort(),['privacy','terms']);
  assert.equal(sent.every(item=>item.user_id==='11111111-1111-1111-1111-111111111111'),true);
  assert.equal(sent.every(item=>item.version==='2026-09-28-v1'),true);
});


test('revisão de comerciante usa RPC autenticada e decisão permitida',async()=>{
  memory.clear();
  await loginSession();
  let sent=null;
  globalThis.fetch=async(url,options)=>{
    assert.match(String(url),/\/rest\/v1\/rpc\/review_merchant_application$/);
    assert.equal(options.method,'POST');
    assert.equal(options.headers.Authorization,'Bearer user-jwt');
    sent=JSON.parse(options.body);
    return response([{application_id:'app-id',application_status:'approved',created_store_id:'store-id'}]);
  };
  const result=await backend.reviewMerchantApplication('app-id','approve');
  assert.deepEqual(sent,{p_application_id:'app-id',p_decision:'approve'});
  assert.equal(result.application_status,'approved');
  await assert.rejects?.(()=>backend.reviewMerchantApplication('app-id','anything'));
});


test('signup anônimo envia Authorization com a chave publicável',async()=>{
  memory.clear();
  let auth='';
  let sent=null;
  globalThis.fetch=async(url,options)=>{
    assert.match(String(url),/\/auth\/v1\/signup$/);
    auth=options.headers.Authorization;
    sent=JSON.parse(options.body);
    return response({user:{id:'new-user',email:'novo@apete.test'},session:null});
  };
  const result=await backend.signUpCustomer({email:'novo@apete.test',password:'abcdef123',name:'Novo Cliente',phone:'88999999999',address:'Rua A',neighborhood:'Centro',city:'Guaraciaba do Norte',legalDocuments:['terms','privacy']});
  assert.equal(String(auth).startsWith('Bearer sb_publishable_'),true);
  assert.equal(sent.data.legal_terms_version,'2026-09-28-v1');
  assert.equal(sent.data.legal_privacy_version,'2026-09-28-v1');
  assert.equal(result.confirmationRequired,true);
});
