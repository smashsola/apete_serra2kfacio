import test from 'node:test';
import assert from 'node:assert/strict';
import {bundleTotal,localIntent,normalizeIntent} from '../src/sabia-core.js';

test('fallback local agrupa formas brasileiras equivalentes sem depender de frase exata',()=>{
 for(const text of ['quero uma bebida','queria alguma coisa pra beber','uma bebidinha pra matar a sede','tem um suco aí?']){
  assert.equal(localIntent(text).topic,'drink',text);
 }
 assert.equal(localIntent('quero algo barato pra começar o dia').topic,'breakfast');
 assert.equal(localIntent('quero um rango').topic,'meal');
});

test('representa pedidos simples, compostos, dieta e produtor em intenção normalizada',()=>{
 assert.equal(localIntent('quero almoço').topic,'meal');
 assert.deepEqual(localIntent('quero almoço com bebida').components,['meal','drink']);
 assert.deepEqual(localIntent('sou vegano').preferences,['vegano']);
 assert.ok(localIntent('quero algo da horta').modifiers.includes('garden'));
 assert.equal(localIntent('quero algo pra dieta').action,'clarify');
});

test('follow-up preserva assunto e mudança explícita troca intenção',()=>{
 const meal=localIntent('quero almoço com bebida');
 const more=localIntent('tem algo diferente?',meal);
 assert.equal(more.action,'alternative');
 assert.equal(more.topic,'meal');
 assert.deepEqual(more.components,meal.components);
 assert.equal(localIntent('agora quero algo da horta',meal).topic,'produce');
 assert.equal(localIntent('na verdade quero sobremesa',meal).topic,'dessert');
});

test('normalização rejeita enums inventados e limita campos livres',()=>{
 const fallback=localIntent('bebida');
 const normalized=normalizeIntent({
  topic:'drink',
  action:'recommend',
  fact:'milagre',
  preferences:['vegano','milagroso'],
  modifiers:['juice','telepatia'],
  components:['drink','coisa-inventada'],
  exclusions:['tomate','x'.repeat(100)],
  confidence:9
 },fallback);
 assert.equal(normalized.topic,'drink');
 assert.deepEqual(normalized.preferences,['vegano']);
 assert.deepEqual(normalized.modifiers,['juice']);
 assert.deepEqual(normalized.components,['drink']);
 assert.equal(normalized.fact,'none');
 assert.equal(normalized.confidence,1);
 assert.ok(normalized.exclusions.every(value=>value.length<=48));
});

test('fatos objetivos são classificados sem dar autoridade comercial ao modelo',()=>{
 assert.equal(localIntent('qual é o mais barato?').fact,'cheapest');
 assert.equal(localIntent('qual pesa mais no bolso?').fact,'none');
 assert.equal(localIntent('qual é o mais vendido?').fact,'most_ordered');
 assert.equal(localIntent('quanto custa isso?').fact,'price');
});

test('total de conjunto cobra uma taxa por estabelecimento e respeita retirada',()=>{
 const same=[{price:3600,storeId:1,fee:600},{price:900,storeId:1,fee:600}];
 const different=[same[0],{price:900,storeId:2,fee:450}];
 assert.equal(bundleTotal(same,'delivery'),5100);
 assert.equal(bundleTotal(different,'delivery'),5550);
 assert.equal(bundleTotal(different,'delivery','products'),4500);
 assert.equal(bundleTotal(different,'pickup'),4500);
});
