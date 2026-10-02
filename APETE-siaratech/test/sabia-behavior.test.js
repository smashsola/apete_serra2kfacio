import test from 'node:test';
import assert from 'node:assert/strict';
import {CONFIDENCE,localIntent} from '../src/sabia-core.js';

const cases=(group,rows,run)=>rows.forEach((row,index)=>test(`${group} ${index+1}: ${row[0]}`,()=>run(...row)));

cases('saudação',[
 ['oi'],['olá'],['opa'],['boa noite'],['boa tardce'],['bom dia'],['salve'],['valeu'],['obrigado'],['beleza']
],text=>assert.equal(localIntent(text).action,'chat'));

cases('typo e ruído',[
 ['aalmoço','meal'],['almco','meal'],['refeicoa','meal'],['laaanche','snack'],['lanchinho','snack'],
 ['bebda','drink'],['qyero almoço','meal'],['queru um lanche','snack'],['cvomeçar o dia','breakfast'],['sobremza','dessert'],
 ['prodtor local','produce'],['sanduiche','snack'],['marmtaa','meal'],['suuuco','drink'],['docinhoo','dessert']
],(text,topic)=>assert.equal(localIntent(text).topic,topic));

cases('conceitos',[
 ['quero rango','meal'],['uma marmita','meal'],['um prato','meal'],['jantar','meal'],['refeição','meal'],
 ['lanche','snack'],['tapioca','snack'],['pão','snack'],['sanduíche','snack'],['salgado','snack'],
 ['petisco','snack'],['café da manhã','breakfast'],['algo matinal','breakfast'],['desjejum','breakfast'],['começar o dia','breakfast'],
 ['sobremesa','dessert'],['doce','dessert'],['docinho','dessert'],['bolo','dessert'],['bebida','drink'],
 ['suco','drink'],['água','drink'],['quero tomar algo','drink'],['produto da roça','produce'],['hortaliça local','produce']
],(text,topic)=>assert.equal(localIntent(text).topic,topic));

cases('follow-up',[
 ['tem outro?','alternative'],['mais um','alternative'],['algo diferente','alternative'],['outra opção','alternative'],['não gostei','alternative'],
 ['qualquer coisa','recommend'],['algo gostoso','recommend'],['um mais barato','fact'],['e a entrega?','fact'],['quanto custa?','fact'],
 ['lista mais','alternative'],['mostra mais opções','alternative'],['pode sugerir','confirm'],['sim','confirm'],['pode','confirm']
],(text,action)=>{
 const previous=localIntent('quero um lanche');
 const current=localIntent(text,previous);
 assert.equal(current.topic,'snack');
 assert.equal(current.action,action);
 assert.equal(current.keepPreviousContext,true);
});

cases('mudança de assunto',[
 ['agora bebida','drink'],['na verdade sobremesa','dessert'],['pensando melhor almoço','meal'],['prefiro lanche','snack'],['troca por horta','produce'],
 ['esquece isso quero doce','dessert'],['mudei quero suco','drink'],['melhor um jantar','meal'],['outra coisa: pão','snack'],['agoraa um lanche','snack']
],(text,topic)=>{
 const current=localIntent(text,localIntent('almoço'));
 assert.equal(current.topic,topic);
 assert.equal(current.action,'switch');
});

cases('fatos',[
 ['mais barato','cheapest'],['menor preço','cheapest'],['mais em conta','cheapest'],['mais caro','most_expensive'],['maior preço','most_expensive'],
 ['mais pedido','most_ordered'],['mais vendido','most_ordered'],['mais popular','most_ordered'],['quanto custa','price'],['qual o preço','price'],
 ['quanto é a entrega','delivery_fee'],['qual a taxa','delivery_fee'],['frete?','delivery_fee'],['entrega custa quanto','delivery_fee'],['tem água','availability']
],(text,fact)=>{
 const current=localIntent(text,localIntent('quero um lanche'));
 assert.equal(current.action,'fact');
 assert.equal(current.fact,fact);
});

cases('listagem',[
 ['liste doces'],['lista bebidas'],['mostra opções'],['quais produtos'],['ver lanches'],
 ['todos os doces'],['todas bebidas'],['mostre itens'],['liste produtos'],['quais opções']
],text=>assert.equal(localIntent(text,localIntent('lanche')).action,'list'));

cases('baixa confiança',[
 ['jsgajg qwoe zzz'],['xpt blr trk'],['999 ???'],['zzqv'],['krt ptx'],
 ['asdasdasd'],['qwepoi zmxn'],['---'],['plokmijn'],['vbnmzxc']
],text=>{
 const current=localIntent(text);
 assert.ok(current.confidence<CONFIDENCE.low);
 assert.notEqual(current.action,'chat');
 assert.notEqual(current.action,'fact');
});

cases('dieta',[
 ['sou vegano','vegano'],['comida vegana','vegano'],['sou vegetariano','vegetariano'],['opção vegetariana','vegetariano']
],(text,preference)=>assert.ok(localIntent(text).preferences.includes(preference)));

test('dieta vaga pede esclarecimento',()=>assert.equal(localIntent('quero algo pra dieta').action,'clarify'));
test('regime vago pede esclarecimento',()=>assert.equal(localIntent('to de regime').action,'clarify'));
