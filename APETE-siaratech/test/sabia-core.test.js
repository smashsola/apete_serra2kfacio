import test from 'node:test';
import assert from 'node:assert/strict';
import {bundleTotal,hardConstraints,localIntent,normalizeIntent,parseJsonObject} from '../src/sabia-core.js';

test('agrupa linguagem natural em conceitos, inclusive diminutivos',()=>{
  for(const text of ['quero uma bebida','queria alguma coisa pra beber','uma bebidinha pra matar a sede'])assert.equal(localIntent(text).topic,'drink');
  assert.equal(localIntent('quero algo barato pra começar o dia').topic,'breakfast');
});

test('representa pedidos simples, compostos, dieta e fatos',()=>{
  assert.equal(localIntent('quero almoço').topic,'meal');
  assert.deepEqual(localIntent('quero almoço com bebida').components,['drink','meal']);
  assert.deepEqual(localIntent('sou vegano').preferences,['vegano']);
  assert.equal(localIntent('quero algo pra dieta').topic,'catalog');
  assert.equal(localIntent('qual o mais barato?').action,'fact');
  assert.equal(localIntent('qual o mais pedido?').action,'fact');
});

test('herda follow-up e troca intenção quando há novo assunto',()=>{
  const meal=localIntent('quero almoço com bebida');
  assert.equal(localIntent('tem algo diferente?',meal).action,'alternative');
  assert.deepEqual(localIntent('tem mais?',meal).components,meal.components);
  assert.equal(localIntent('agora quero algo da horta',meal).topic,'produce');
  assert.equal(localIntent('na verdade quero sobremesa',meal).topic,'dessert');
});

test('orçamento é regra objetiva, pode excluir entrega e ser removido',()=>{
  assert.equal(hardConstraints('quero almoço com bebida até 50 contando entrega').budget,5000);
  assert.equal(hardConstraints('quero almoço até 40 sem contar entrega').budgetScope,'products');
  assert.equal(hardConstraints('não quero tomate').exclusions[0],'tomate');
  assert.equal(hardConstraints('pode passar dos 40',['até 40 reais']).budget,null);
  assert.equal(hardConstraints('esquece o limite',['até 40 reais']).budget,null);
});

test('calcula conjuntos cobrando uma taxa por loja',()=>{
  const same=[{price:3600,storeId:1,fee:600},{price:900,storeId:1,fee:600}];
  const different=[same[0],{price:900,storeId:2,fee:450}];
  assert.equal(bundleTotal(same,'delivery'),5100);
  assert.equal(bundleTotal(different,'delivery'),5550);
  assert.equal(bundleTotal(different,'delivery','products'),4500);
});

test('normaliza JSON sem confiar em campos ou valores arbitrários',()=>{
  const parsed=parseJsonObject('```json\n{"topic":"drink","action":"recommend"}\n```');
  assert.equal(normalizeIntent({...parsed,preferences:['vegano','milagroso']},localIntent('bebida')).preferences[0],'vegano');
  assert.equal(parseJsonObject('{ruim'),null);
});
