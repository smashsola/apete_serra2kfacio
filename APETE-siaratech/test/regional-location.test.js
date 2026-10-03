import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import '../public/regional-location.js';
const {requestPosition,nearestCity}=globalThis.APETE_LOCATION;
const centers={'Guaraciaba do Norte':[-4.16694,-40.7475],Croatá:[-4.41317,-40.90254]};

test('posição recente pode sugerir cidade sem solicitar GPS de alta precisão',async()=>{
  let options;
  const result=await requestPosition({getCurrentPosition(success,error,received){options=received;success({coords:{latitude:-4.41317,longitude:-40.90254,accuracy:100}});}});
  assert.equal(options.enableHighAccuracy,false);
  assert.equal(options.maximumAge,900000);
  assert.equal(nearestCity(result.coords,centers).city,'Croatá');
});
test('prazo da aplicação encerra espera mesmo quando navegador não responde; callback atrasado é ignorado',async()=>{
  let timeout,success,cleared=false;
  const promise=requestPosition({getCurrentPosition(callback){success=callback;}},{setTimer(callback){timeout=callback;return 1;},clearTimer(){cleared=true;}});
  timeout();
  await assert.rejects(promise,error=>error.code===3);
  success({coords:{latitude:-4.41317,longitude:-40.90254,accuracy:100}});
  assert.equal(cleared,true);
});
test('localização imprecisa, inválida ou fora da região exige seleção manual',()=>{
  for(const coords of [{latitude:NaN,longitude:0,accuracy:5},{latitude:91,longitude:0,accuracy:5},{latitude:-4.41317,longitude:-40.90254,accuracy:18000},{latitude:-23.55,longitude:-46.63,accuracy:100}])assert.equal(nearestCity(coords,centers),null);
});
test('permissão recusada é devolvida sem nova tentativa automática',async()=>{
  await assert.rejects(requestPosition({getCurrentPosition(success,error){error({code:1});}}),error=>error.code===1);
});
test('seleção manual durante localização não é substituída pelo resultado atrasado',async()=>{
  const app=fs.readFileSync(new URL('../public/app.js',import.meta.url),'utf8');
  const code=app.slice(app.indexOf('let locationRequestId=0;'),app.indexOf('async function sabiaRequest('));
  let resolve;
  const pending=new Promise(callback=>{resolve=callback;});
  const context={state:{city:'Guaraciaba do Norte',cart:[],ui:{}},locating:false,navigator:{geolocation:{}},globalThis:{APETE_LOCATION:{requestPosition:()=>pending,nearestCity:()=>({city:'Croatá'})}},REGIONAL_CITY_CENTERS:centers,updateGeolocationControl(){},toast(){},save(){},closeRegionSelector(){},render(){}};
  vm.createContext(context);vm.runInContext(code,context);
  const operation=context.useMyLocation();
  context.cancelLocationRequest();context.state.city='Ipu';
  resolve({coords:{}});await operation;
  assert.equal(context.state.city,'Ipu');assert.equal(context.locating,false);
});
