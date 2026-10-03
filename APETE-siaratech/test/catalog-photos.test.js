import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import crypto from 'node:crypto';
const read=path=>fs.readFileSync(new URL('../'+path,import.meta.url),'utf8');
const manifest=JSON.parse(read('public/catalog-photo-manifest.json'));
test('cada produto e estabelecimento demonstrativo tem arquivo próprio, sem cópias binárias',()=>{
  assert.equal(manifest.products.length,153);assert.equal(manifest.stores.length,30);
  const paths=[...manifest.products.map(p=>p.image),...manifest.stores.map(s=>s.cover)];
  assert.equal(new Set(paths).size,183);
  const hashes=paths.map(path=>{
    assert.match(path,/^assets\/images\/[a-z0-9-]+\.webp$/);
    return crypto.createHash('sha256').update(fs.readFileSync(new URL('../public/'+path,import.meta.url))).digest('hex');
  });
  assert.equal(new Set(hashes).size,183);
});
test('fontes estáticas e catálogo de recuperação mantêm a associação por identidade do produto',()=>{
  const app=read('public/app.js');
  const catalogues=[{products:JSON.parse(app.match(/const PRODUCTS = (\[[\s\S]*?\]);/)[1]),stores:JSON.parse(app.match(/const STORES = (\[[\s\S]*?\]);/)[1])},JSON.parse(read('src/worker.js').match(/const CATALOG=(\{.*\});/)[1]),JSON.parse(read('public/catalog-seed.js').match(/window\.APETE_CATALOG=(\{.*\});/)[1])];
  for(const catalog of catalogues){
    for(const product of manifest.products){const row=catalog.products.find(p=>p.id===product.id);assert.equal(row.name,product.name);assert.equal(row.image,product.image);}
    for(const store of manifest.stores){const row=catalog.stores.find(s=>s.id===store.id);assert.equal(row.name,store.name);assert.equal(row.cover,store.cover);}
  }
});
test('produtos que tinham associações erradas não voltam às fotos genéricas por categoria',()=>{
  for(const id of [26,27,29,33,36,37,48,51,53,61,62,63,64,65,71,72,75,83,84,87,89,1001,1016,1046,1062])assert.equal(manifest.products.find(p=>p.id===id).image,'assets/images/photo-product-'+id+'-v2.webp');
});
