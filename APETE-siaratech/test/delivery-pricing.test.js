import test from 'node:test';
import assert from 'node:assert/strict';
import '../public/delivery-pricing.js';
const {quote}=globalThis.APETE_DELIVERY;
test('frete por km respeita mínimo, base e arredondamento em centavos',()=>{
  const store={deliveryBaseFee:0,feePerKm:150,minimumFee:300};
  assert.equal(quote(store,2).fee,300);
  assert.equal(quote(store,4).fee,600);
  assert.equal(quote(store,'3,5').fee,525);
  assert.equal(quote({...store,deliveryBaseFee:500},3).fee,950);
  assert.equal(quote({...store,feePerKm:101},'3.5').fee,354);
  assert.equal(quote(store,null,'pickup').fee,0);
});

test('tabela regional inclui os primeiros 3 km e cobra só o excedente',()=>{
  const store={deliveryBaseFee:200,feePerKm:100,minimumFee:500};
  assert.equal(globalThis.APETE_DELIVERY.isRegional(store),true);
  for(const [distance,fee] of [[0,500],[2,500],[3,500],[3.01,501],[5,700],[10,1200]]) {
    assert.equal(quote(store,distance).fee,fee);
  }
  assert.equal(quote(store,10,'pickup').fee,0);
});
test('não mostra total definitivo sem distância válida nem aceita precisão indevida',()=>{
  for(const value of ['',null,-1,'3.001','Infinity','NaN',201,'1e2'])assert.equal(quote({fee:0,feePerKm:150},value).ready,false);
  assert.equal(quote({fee:500,feePerKm:0},null).fee,500);
});
