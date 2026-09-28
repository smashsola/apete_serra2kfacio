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


test('separa conversa, listagem e consulta de disponibilidade de recomendação',()=>{
 assert.equal(localIntent('opa boa noite').action,'chat');
 const list=localIntent('liste doces de até 30 reais');
 assert.equal(list.action,'list');
 assert.equal(list.topic,'dessert');
 const water=localIntent('tem água ou nao');
 assert.equal(water.action,'fact');
 assert.equal(water.fact,'availability');
 assert.ok(water.searchTerms.includes('agua'));
});

test('preferência explícita não vira esclarecimento genérico',()=>{
 const fallback=localIntent('tem algo pra vegetarianos ai');
 const normalized=normalizeIntent({
  topic:'catalog',
  action:'clarify',
  fact:'none',
  preferences:['vegetariano'],
  modifiers:[],
  exclusions:[],
  searchTerms:[],
  components:[],
  keepPreviousContext:false,
  confidence:.8
 },fallback);
 assert.equal(normalized.action,'recommend');
 assert.deepEqual(normalized.preferences,['vegetariano']);
});

test('follow-up sem novo assunto mantém contexto anterior',()=>{
 const breakfast=localIntent('quero café da manhã');
 const follow=localIntent('ainda tô com fome',breakfast);
 assert.equal(follow.topic,'breakfast');
 assert.equal(follow.keepPreviousContext,true);
});


test('confirmações curtas e com erro preservam o pedido anterior',()=>{
 const meal=localIntent('quero algo pro almoço');
 for(const text of ['sim','sin','cim','çim','~~çim','pode sugerir sim','pode']){
  const follow=localIntent(text,meal);
  assert.equal(follow.action,'confirm',text);
  assert.equal(follow.topic,'meal',text);
  assert.equal(follow.keepPreviousContext,true,text);
 }
});

test('tolera erro pequeno em palavra central sem depender da frase inteira',()=>{
 for(const text of ['queru ago pro aalmoço','quero algo pro almoco','queria uma refeicoa']){
  assert.equal(localIntent(text).topic,'meal',text);
 }
 assert.equal(localIntent('uma bebda').topic,'drink');
});


test('captura exclusões naturais sem confundir entrega e orçamento',()=>{
 for(const [text,expected] of [
  ['quero almoço sem tomate','tomate'],
  ['não quero carne','carne'],
  ['evita queijo','queijo'],
  ['tira coentro','coentro']
 ]){
  const intent=localIntent(text);
  assert.ok(intent.exclusions.includes(expected),text);
 }
 assert.deepEqual(localIntent('até 40 sem contar entrega').exclusions,[]);
 assert.deepEqual(localIntent('sem limite').exclusions,[]);
});

test('quantidade de pessoas é semântica e acompanha follow-up',()=>{
 const initial=localIntent('quero almoço para duas pessoas');
 assert.equal(initial.topic,'meal');
 assert.equal(initial.serves,2);
 const follow=localIntent('tem outra opção?',initial);
 assert.equal(follow.serves,2);
 assert.equal(follow.keepPreviousContext,true);
 assert.equal(localIntent('somos 4 e quero lanche').serves,4);
});

test('troca explícita limpa restrições semânticas antigas quando a nova intenção substitui o pedido',()=>{
 const initial=localIntent('quero almoço sem tomate para duas pessoas');
 const switched=localIntent('na verdade quero sobremesa',initial);
 assert.equal(switched.topic,'dessert');
 assert.equal(switched.action,'switch');
 assert.deepEqual(switched.exclusions,[]);
 assert.equal(switched.serves,null);
});


test('remover orçamento não apaga o assunto e fato curto continua no escopo anterior',()=>{
 const meal=localIntent('quero almoço até 40');
 const reset=localIntent('esquece o limite',meal);
 assert.equal(reset.topic,'meal');
 assert.equal(reset.action,'refine');
 assert.equal(reset.keepPreviousContext,true);
 const cheapest=localIntent('qual o mais barato?',meal);
 assert.equal(cheapest.topic,'meal');
 assert.equal(cheapest.action,'fact');
 assert.equal(cheapest.fact,'cheapest');
 assert.equal(cheapest.keepPreviousContext,true);
});


test('total de conjunto multiplica quantidade mas cobra uma taxa por estabelecimento',()=>{
 const sameStore=[
  {price:6200,quantity:2,storeId:1,fee:600},
  {price:900,quantity:1,storeId:1,fee:600}
 ];
 assert.equal(bundleTotal(sameStore,'delivery'),13900);
 assert.equal(bundleTotal(sameStore,'delivery','products'),13300);
 assert.equal(bundleTotal(sameStore,'pickup'),13300);
});
