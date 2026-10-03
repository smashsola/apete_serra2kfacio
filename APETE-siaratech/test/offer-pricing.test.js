import test from 'node:test';
import assert from 'node:assert/strict';
import '../public/offer-pricing.js';
const {project,isActive}=globalThis.APETE_OFFERS;
const start=Date.parse('2026-10-02T20:00:00Z'),end=start+3600000;
const product={price:1200,oldPrice:2000,lastBatch:true,offer:{startsAt:new Date(start).toISOString(),endsAt:new Date(end).toISOString()}};
test('offer has exact start and exclusive end; projection preserves the merchant discount',()=>{
 assert.equal(project(product,start-1).price,2000);
 assert.equal(project(product,start).price,1200);
 assert.equal(project(product,end-1).price,1200);
 assert.equal(project(product,end).price,2000);
 assert.equal(project(project(product,end),start).price,1200);
 assert.equal(isActive({...product,offer:null},start),false);
 assert.equal(project({...product,offer:null},start).price,2000);
 assert.equal(project({...product,lastBatch:false},end).price,1200);
});
