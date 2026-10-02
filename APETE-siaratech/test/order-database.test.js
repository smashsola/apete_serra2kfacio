import test from 'node:test';
import assert from 'node:assert/strict';
import {PGlite} from '@electric-sql/pglite';
import {readdir,readFile} from 'node:fs/promises';
const root=new URL('../supabase/migrations/',import.meta.url);
test('migrações reais: retry atômico, estoque e isolamento por usuário',async()=>{
 const db=new PGlite();
 try{
 await db.exec(`create role anon;create role authenticated;create role service_role;create schema auth;
 create table auth.users(id uuid primary key,raw_user_meta_data jsonb default '{}');
 create function auth.uid() returns uuid language sql stable as $$select nullif(current_setting('request.jwt.claim.sub',true),'')::uuid$$;
 grant usage on schema public,auth to anon,authenticated;grant execute on function auth.uid() to anon,authenticated;`);
 for(const name of (await readdir(root)).filter(x=>x.endsWith('.sql')).sort()){
   // PGlite uses builtin gen_random_uuid; the production pgcrypto extension is unchanged.
   const sql=(await readFile(new URL(name,root),'utf8')).replace('create extension if not exists pgcrypto;','');
   await db.exec(sql);
 }
 const a='11111111-1111-4111-8111-111111111111',b='22222222-2222-4222-8222-222222222222';
 await db.exec(`insert into auth.users(id,raw_user_meta_data) values ('${a}','{"legal_terms_version":"2026-09-28-v1","legal_privacy_version":"2026-09-28-v1"}'),('${b}','{"legal_terms_version":"2026-09-28-v1","legal_privacy_version":"2026-09-28-v1"}');
 insert into stores(public_id,name,city,service_areas,delivery_fee) values (9001,'Loja teste','Teste',array['Teste'],500);
 insert into products(public_id,store_id,name,price,stock) select 9001,id,'Produto teste',1200,10 from stores where public_id=9001;`);
 await db.exec(`insert into store_members(store_id,user_id,role) select id,'${b}','owner' from stores where public_id=9001;`);
 const request='aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa';
 const call=(qty=2)=>db.query(`select * from public.create_order_once($1,9001,'Teste','delivery','Cliente Teste','88999999999','Rua Teste 100','Centro','','pix',$2::jsonb)`,[request,JSON.stringify([{productId:9001,quantity:qty}])]);
 const asUser=async id=>db.exec(`reset role;set role authenticated;select set_config('request.jwt.claim.sub','${id}',false);`);
 await asUser(a);const first=(await call()).rows[0],again=(await call()).rows[0];assert.deepEqual(first,again);assert.equal(first.total,2900);
 await assert.rejects(call(3),/order_request_conflict/);
 await assert.rejects(db.query(`select * from public.create_order_once('bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb',9001,'Teste','delivery','Cliente Teste','88999999999','Rua Teste 100','Centro','','pix','[{"productId":9001,"quantity":99}]')`),/insufficient_stock/);
 await db.exec('reset role');assert.equal((await db.query('select stock from products where public_id=9001')).rows[0].stock,8);
 assert.equal((await db.query('select count(*)::int n from orders')).rows[0].n,1);
 await asUser(a);assert.equal((await db.query("update orders set status='preparing' where id=$1 returning id",[first.order_id])).rows.length,0);
 await db.exec('reset role;delete from store_members');
 await asUser(b);assert.equal((await db.query('select count(*)::int n from orders')).rows[0].n,0);
 const second=(await call()).rows[0];assert.notEqual(second.order_id,first.order_id);
 assert.equal((await db.query('select count(*)::int n from orders')).rows[0].n,1);
 await db.exec('reset role');
 await db.exec(`insert into store_members(store_id,user_id,role) select id,'${b}','owner' from stores where public_id=9001;`);
 await asUser(b);assert.equal((await db.query("update orders set status='preparing' where id=$1 returning id",[first.order_id])).rows.length,1);
 await assert.rejects(db.query("update orders set status='pending' where id=$1",[first.order_id]),/invalid_order_status_transition/);
 await assert.rejects(db.query('select * from private.checkout_requests'),/permission denied/);
 await db.exec("reset role;set role anon;select set_config('request.jwt.claim.sub','',false)");await assert.rejects(call(),/permission denied/);
 await db.exec('reset role');assert.equal((await db.query('select stock from products where public_id=9001')).rows[0].stock,6);
 }finally{await db.close();}
});
