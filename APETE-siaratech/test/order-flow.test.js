import test from 'node:test';
import assert from 'node:assert/strict';
import {webcrypto} from 'node:crypto';
globalThis.window={};
await import('../public/order-flow.js');
const {createCheckoutController,createSingleFlight}=window.APETE_ORDER_FLOW;
const payload={storeId:1,city:'Teste',customer:{name:'Cliente',address:'Rua privada'},items:[{productId:2,qty:1}]};
function setup(){const data=new Map();const storage={getItem:k=>data.get(k),setItem:(k,v)=>data.set(k,v),removeItem:k=>data.delete(k)};return {data,storage,controller:createCheckoutController({storage,crypto:webcrypto})};}
test('reenvio após resposta perdida reutiliza identificador sem armazenar endereço',async()=>{
 const {controller,data}=setup();const ids=[];let fail=true;
 const backend={getSession:async()=>({user:{id:'cliente-a'}}),createOrder:async p=>{ids.push(p.requestId);if(fail){fail=false;throw Error('network');}return {order_id:'order',public_number:1};}};
 await assert.rejects(controller.submit(backend,payload),/network/);await controller.submit(backend,payload);
 assert.equal(ids[0],ids[1]);assert.equal([...data.values()].join('').includes('Rua privada'),false);
 controller.complete();await controller.submit(backend,payload);assert.notEqual(ids[1],ids[2]);
});
test('cliques simultâneos criam somente uma chamada',async()=>{
 const {controller}=setup();let calls=0;
 const backend={getSession:async()=>({user:{id:'a'}}),createOrder:async()=>{calls++;return {order_id:'order',public_number:2};}};
 await Promise.all([controller.submit(backend,payload),controller.submit(backend,payload)]);assert.equal(calls,1);
});
test('mudança de usuário ou sacola gera uma tentativa nova',async()=>{
 const {controller}=setup();let owner='a';const ids=[];const backend={getSession:async()=>({user:{id:owner}}),createOrder:async p=>{ids.push(p.requestId);return {order_id:'order',public_number:2};}};
 await controller.submit(backend,payload);owner='b';await controller.submit(backend,payload);await controller.submit(backend,{...payload,items:[{productId:2,qty:2}]});assert.equal(new Set(ids).size,3);
});
test('confirmação incompleta não é aceita e falha ao limpar storage não desfaz sucesso',async()=>{
 const {controller,storage}=setup();await assert.rejects(controller.submit({getSession:async()=>({user:{id:'a'}}),createOrder:async()=>({})},payload),/invalid_order_confirmation/);
 storage.removeItem=()=>{throw Error('storage');};assert.doesNotThrow(()=>controller.complete());
});
test('atualizações simultâneas são agrupadas e falhas permitem nova tentativa',async()=>{
 const run=createSingleFlight();let calls=0;const work=async()=>{calls++;throw Error('offline');};await Promise.allSettled([run('a',work),run('a',work)]);assert.equal(calls,1);await assert.rejects(run('a',work),/offline/);assert.equal(calls,2);
});
