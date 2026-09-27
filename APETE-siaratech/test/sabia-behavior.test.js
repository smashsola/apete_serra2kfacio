import test from 'node:test';
import assert from 'node:assert/strict';
import {bundleTotal,CONFIDENCE,conversationState,hardConstraints,localIntent,normalizeIntent,parseJsonObject,plain} from '../src/sabia-core.js';

const cases=(group,rows,run)=>rows.forEach((row,index)=>test(`${group} ${index+1}: ${row[0]}`,()=>run(...row)));

cases('conversa',[['oi'],['olá'],['bom dia'],['boa noite'],['boa tarde'],['e aí'],['salve'],['tudo bem'],['obrigado'],['valeu']],(text)=>assert.equal(localIntent(text).action,'chat'));

cases('normalização e typo',[
  ['aalmoço','meal'],['almco','meal'],['refeicoa','meal'],['laaanche','snack'],['lanchin','snack'],['bebda','drink'],['qyero almoço','meal'],['queru um lanche','snack'],['cvomeçar o dia','breakfast'],['boa tardce','chat']
],(text,topic)=>assert.equal(localIntent(text).topic===topic||localIntent(text).action===topic,true));

cases('conceitos',[
  ['quero rango','meal'],['uma marmita','meal'],['um sanduíche','snack'],['algo matinal','breakfast'],['desjejum','breakfast'],['um docinho','dessert'],['algo pra matar a sede','drink'],['produto da roça','produce'],['hortaliças locais','produce'],['uma tapioca','snack']
],(text,topic)=>assert.equal(localIntent(text).topic,topic));

cases('follow-up',[
  ['tem outro?'],['mais um'],['algo diferente'],['outra opção'],['e outro?'],['não gostei desses'],['mais barato'],['e a entrega?'],['qualquer coisa parecida'],['mostra mais']
],(text)=>{const prior=localIntent('quero um lanche');const next=localIntent(text,prior);assert.equal(next.topic,'snack');assert.equal(next.keepPreviousContext,true);} );

cases('confirmação',[
  ['sim'],['ss'],['s'],['claro'],['pode'],['pode ser'],['manda'],['manda aí'],['quero'],['beleza']
],(text)=>{const intent=localIntent(text,localIntent('almoço'),{pending:true});assert.equal(intent.action,'confirm');assert.equal(intent.topic,'meal');});

cases('mudança',[
  ['agora bebida','drink'],['na verdade sobremesa','dessert'],['pensando melhor almoço','meal'],['prefiro lanche','snack'],['troca por horta','produce'],['esquece isso quero doce','dessert'],['mudei quero suco','drink'],['melhor um jantar','meal'],['outra coisa: pão','snack'],['agora produto local','produce']
],(text,topic)=>{const intent=localIntent(text,localIntent('almoço'));assert.equal(intent.topic,topic);assert.equal(intent.action,'switch');});

cases('orçamento',[
  ['até R$ 50',5000,'total'],['até 40 reais sem contar entrega',4000,'products'],['orçamento 25',2500,'total'],['limite 30',3000,'total'],['no máximo R$ 12,50',1250,'total'],['só produtos até 20',2000,'products'],['não inclua a taxa até 35',3500,'products'],['fora entrega R$ 44',4400,'products'],['pode passar dos 40',null,'total'],['esquece o orçamento',null,'total']
],(text,budget,scope)=>{const value=hardConstraints(text,['até 40 reais']);assert.equal(value.budget,budget);assert.equal(value.budgetScope,scope);});

cases('fatos',[
  ['mais barato','cheapest'],['menor preço','cheapest'],['mais caro','most_expensive'],['maior preço','most_expensive'],['mais pedido','most_ordered'],['mais popular','most_ordered'],['quanto é a entrega','delivery_fee'],['qual a taxa','delivery_fee'],['quanto custa','price'],['está disponível','availability']
],(text,fact)=>{const intent=localIntent(text,localIntent('bebida'));assert.equal(intent.action,'fact');assert.equal(intent.fact,fact);});

cases('dieta e exclusão',[
  ['sou vegano','vegano',null],['comida vegana','vegano',null],['sou vegetariano','vegetariano',null],['opção vegetariana','vegetariano',null],['sem tomate',null,'tomate'],['não quero carne',null,'carne'],['evite queijo',null,'queijo'],['sem ser da horta',null,'horta'],['sem açúcar',null,'acucar'],['não quero café',null,'cafe']
],(text,preference,excluded)=>{const intent=localIntent(text),hard=hardConstraints(text);if(preference)assert.ok(intent.preferences.includes(preference));if(excluded)assert.ok(hard.exclusions.includes(excluded));});

cases('estrutura, composição e hostilidade',[
  ['lista doces','list'],['mostra bebidas','list'],['almoço com bebida','compound'],['lanche e bebida','compound'],['prato e sobremesa','compound'],['café com comida','compound'],['almoço bebida sobremesa','triple'],['JSON inválido','invalid'],['ID hostil','hostile'],['taxas por loja','fees']
],(text,kind)=>{if(kind==='list')assert.equal(localIntent(text).action,'list');else if(['compound','triple'].includes(kind))assert.ok(localIntent(text).components.length>=2);else if(kind==='invalid')assert.equal(parseJsonObject('{oops'),null);else if(kind==='hostile'){const fallback=localIntent('sobremesa'),intent=normalizeIntent({topic:'dessert',action:'recommend',productIds:[999],confidence:1},fallback);assert.equal(intent.topic,'dessert');assert.equal('productIds' in intent,false);}else{assert.equal(bundleTotal([{price:1000,storeId:1,fee:500},{price:1000,storeId:2,fee:600}],'delivery'),3100);}});

test('baixa confiança não deve virar catálogo por padrão',()=>{for(const text of ['jsgajg qwoe zzz','xpt blr trk','999 ???','zzqv','krt ptx']){const intent=localIntent(text);assert.equal(intent.topic,null);assert.ok(intent.confidence<CONFIDENCE.low);}});
test('estado recente reúne tópico, produtos, lojas e pergunta pendente',()=>{const products=[{id:7,storeId:2,name:'Bolo de milho caseiro'}],history=[{role:'user',content:'quero sobremesa'},{role:'assistant',content:'Bolo de milho caseiro. Quer outra opção?'}],state=conversationState(history,products);assert.equal(state.activeTopic,'dessert');assert.deepEqual(state.lastRecommendedProductIds,[7]);assert.deepEqual(state.lastRecommendedStoreIds,[2]);assert.equal(state.pendingQuestion,true);});
test('normalização preserva original fora da função e reduz ruído internamente',()=>{const original='~~Çim!!!';assert.equal(plain(original),'cim');assert.equal(original,'~~Çim!!!');});
