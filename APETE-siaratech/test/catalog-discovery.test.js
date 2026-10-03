import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
const app=fs.readFileSync(new URL('../public/app.js',import.meta.url),'utf8');
function setup(scope){
  const state={city:'Croatá',ui:{catalogScope:scope},stores:[{id:1,city:'Croatá',open:true},{id:2,city:'Ipu',open:true},{id:3,city:'Ipu',open:false}],products:[{id:1,storeId:1,stock:5},{id:2,storeId:2,stock:4},{id:3,storeId:3,stock:5},{id:4,storeId:1,stock:0}]};
  const context={state,getStore:id=>state.stores.find(s=>s.id===id),esc:String};
  vm.createContext(context);
  vm.runInContext(app.slice(app.indexOf('function storeServesSelectedCity('),app.indexOf('function homePage()')),context);
  return context;
}
test('exploração regional exibe outras cidades sem ampliar elegibilidade de entrega',()=>{
  const context=setup('region');
  assert.equal(context.publicStoreVisible(context.state.stores[1]),true);
  assert.equal(context.storeServesSelectedCity(context.state.stores[1]),false);
  assert.equal(context.publicProductAvailable(context.state.products[1]),true);
  assert.equal(context.publicProductAvailable(context.state.products[2]),false);
  assert.equal(context.publicProductAvailable(context.state.products[3]),false);
  assert.equal(context.state.city,'Croatá');
});
test('escopo local mantém apenas produtos da cidade e informa total regional',()=>{
  const context=setup('city');
  assert.equal(context.publicProductAvailable(context.state.products[0]),true);
  assert.equal(context.publicProductAvailable(context.state.products[1]),false);
  const html=context.catalogOverview();
  assert.match(html,/2 estabelecimentos · 2 produtos na Serra/);
  assert.match(html,/Em Croatá: 1 estabelecimentos e 1 produtos/);
});
