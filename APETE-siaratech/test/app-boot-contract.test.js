import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

const source=fs.readFileSync(new URL('../public/app.js',import.meta.url),'utf8');

test('app mantém os helpers necessários antes do primeiro render',()=>{
  assert.match(source,/function makeDemoOrders\s*\(/);
  assert.match(source,/function extraPendingOrders\s*\(/);
  assert.match(source,/const PAGE_TITLES\s*=/);
  assert.match(source,/render\(\);\s*hydrateCatalogFromBackend\(\);/);
});

test('catálogo expandido mantém boot demo compatível com todos os perfis',()=>{
  assert.match(source,/function demoOrderItems\s*\(/);
  assert.match(source,/return STORES\.flatMap\(store=>statuses\.map/);
  assert.match(source,/return STORES\.flatMap\(store=>\[1,2\]\.map/);
});
