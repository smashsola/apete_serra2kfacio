-- Distances are customer-declared and must be agreed with the store, not GPS route measurements.
alter table public.stores add column delivery_fee_per_km integer not null default 0 check(delivery_fee_per_km between 0 and 10000);
alter table public.stores add column delivery_minimum_fee integer not null default 0 check(delivery_minimum_fee between 0 and 100000);
grant update(delivery_fee_per_km,delivery_minimum_fee) on public.stores to authenticated;
alter table public.orders add column delivery_distance_km numeric(7,2);
alter table public.orders add column delivery_rate_per_km integer not null default 0;
alter table public.orders add column delivery_base_fee integer not null default 0;
alter table public.orders add column delivery_minimum_fee integer not null default 0;
create function private.delivery_fee_for(base integer,rate integer,minimum integer,distance numeric)
returns integer language plpgsql immutable set search_path='' as $$
begin
 if base<0 or rate<0 or minimum<0 then raise exception 'invalid_delivery_rate' using errcode='22023'; end if;
 if rate=0 then return greatest(base,minimum); end if;
 if distance is null then raise exception 'distance_required' using errcode='22023'; end if;
 if distance<0 or distance>200 or distance<>round(distance,2) then raise exception 'invalid_delivery_distance' using errcode='22023'; end if;
 return greatest(minimum,base+round(rate*distance)::integer);
end $$;
revoke all on function private.delivery_fee_for(integer,integer,integer,numeric) from public,anon,authenticated;
create or replace function private.create_order_distance(
  p_store_public_id bigint,
  p_city text,
  p_mode text,
  p_customer_name text,
  p_customer_phone text,
  p_address text,
  p_neighborhood text,
  p_note text,
  p_payment_method text,
  p_items jsonb,
  p_distance_km numeric
)
returns table(order_id uuid,public_number bigint,subtotal integer,delivery_fee integer,total integer)
language plpgsql
security definer
set search_path=''
as $$
declare
  uid uuid:=auth.uid();
  target_store public.stores%rowtype;
  entry jsonb;
  prod public.products%rowtype;
  qty integer;
  effective_unit_price integer;
  sub integer:=0;
  fee integer:=0;
  created_order public.orders%rowtype;
  clean_phone text:=regexp_replace(coalesce(p_customer_phone,''),'\D','','g');
begin
  if uid is null then raise exception 'authentication_required' using errcode='28000'; end if;
  if p_mode not in ('delivery','pickup') then raise exception 'invalid_mode' using errcode='22023'; end if;
  if p_payment_method not in ('pix','card','card_on_delivery') then raise exception 'invalid_payment_method' using errcode='22023'; end if;
  if char_length(trim(coalesce(p_customer_name,''))) not between 2 and 120 then
    raise exception 'invalid_customer_name' using errcode='22023';
  end if;
  if char_length(clean_phone) not between 10 and 15 then
    raise exception 'invalid_customer_phone' using errcode='22023';
  end if;
  if char_length(trim(coalesce(p_address,'')))>240
     or char_length(trim(coalesce(p_neighborhood,'')))>120
     or char_length(coalesce(p_note,''))>500
     or char_length(trim(coalesce(p_city,'')))>100 then
    raise exception 'invalid_order_text' using errcode='22023';
  end if;
  if p_mode='delivery' and trim(coalesce(p_address,''))='' then
    raise exception 'address_required' using errcode='22023';
  end if;
  if jsonb_typeof(p_items)<>'array' or jsonb_array_length(p_items)=0 or jsonb_array_length(p_items)>30 then
    raise exception 'invalid_items' using errcode='22023';
  end if;

  select * into target_store
  from public.stores
  where public_id=p_store_public_id and active
  for update;
  if not found then raise exception 'store_unavailable' using errcode='P0002'; end if;
  if p_mode='delivery' and not target_store.delivery then raise exception 'delivery_unavailable' using errcode='22023'; end if;
  if p_mode='pickup' and not target_store.pickup then raise exception 'pickup_unavailable' using errcode='22023'; end if;
  if target_store.city<>p_city and not (p_city=any(target_store.service_areas)) then
    raise exception 'city_unavailable' using errcode='22023';
  end if;

  create temporary table if not exists pg_temp.apete_order_lines(
    product_id uuid primary key,
    product_name text,
    unit_price integer,
    quantity integer,
    line_subtotal integer
  ) on commit drop;
  truncate pg_temp.apete_order_lines;

  for entry in select value from jsonb_array_elements(p_items)
  loop
    if jsonb_typeof(entry)<>'object'
       or coalesce(entry->>'productId','') !~ '^\d+$'
       or coalesce(entry->>'quantity','') !~ '^\d+$' then
      raise exception 'invalid_item' using errcode='22023';
    end if;
    qty:=(entry->>'quantity')::integer;
    if qty<1 or qty>99 then raise exception 'invalid_quantity' using errcode='22023'; end if;

    select * into prod
    from public.products
    where public_id=(entry->>'productId')::bigint and active
    for update;
    if not found then raise exception 'product_unavailable' using errcode='P0002'; end if;
    if prod.store_id<>target_store.id then raise exception 'mixed_store_order' using errcode='22023'; end if;
    if prod.stock<qty then raise exception 'insufficient_stock' using errcode='22023'; end if;
    if exists(select 1 from pg_temp.apete_order_lines l where l.product_id=prod.id) then
      raise exception 'duplicate_product' using errcode='22023';
    end if;

    effective_unit_price:=case when prod.last_batch and prod.old_price>prod.price
      and (prod.offer_starts_at is null or prod.offer_ends_at is null or now()<prod.offer_starts_at or now()>=prod.offer_ends_at)
      then prod.old_price else prod.price end;
    if effective_unit_price<>prod.price and not (entry ? 'expectedPrice') then raise exception 'price_changed' using errcode='22023'; end if;
    if entry ? 'expectedPrice' and (jsonb_typeof(entry->'expectedPrice')<>'number' or entry->>'expectedPrice'<>effective_unit_price::text) then
      raise exception 'price_changed' using errcode='22023';
    end if;
    insert into pg_temp.apete_order_lines
      values(prod.id,prod.name,effective_unit_price,qty,effective_unit_price*qty);
    sub:=sub+(effective_unit_price*qty);
  end loop;

  fee:=case when p_mode='delivery' then private.delivery_fee_for(target_store.delivery_fee,target_store.delivery_fee_per_km,target_store.delivery_minimum_fee,p_distance_km) else 0 end;

  insert into public.orders(
    customer_id,store_id,status,mode,city,customer_name,customer_phone,address,neighborhood,note,
    payment_method,subtotal,delivery_fee,total,delivery_distance_km,delivery_rate_per_km,delivery_base_fee,delivery_minimum_fee
  ) values(
    uid,target_store.id,'pending',p_mode,trim(p_city),trim(p_customer_name),clean_phone,
    case when p_mode='delivery' then trim(p_address) else '' end,
    trim(coalesce(p_neighborhood,'')),coalesce(trim(p_note),''),
    p_payment_method,sub,fee,sub+fee,case when p_mode='delivery' then p_distance_km else null end,target_store.delivery_fee_per_km,target_store.delivery_fee,target_store.delivery_minimum_fee
  ) returning * into created_order;

  insert into public.order_items(order_id,product_id,product_name,unit_price,quantity,line_subtotal)
  select created_order.id,product_id,product_name,unit_price,quantity,line_subtotal
  from pg_temp.apete_order_lines;

  update public.products p
     set stock=p.stock-l.quantity
    from pg_temp.apete_order_lines l
   where p.id=l.product_id;

  return query select created_order.id,created_order.public_number,sub,fee,sub+fee;
end $$;


revoke all on function private.create_order_distance(bigint,text,text,text,text,text,text,text,text,jsonb,numeric) from public,anon,authenticated;
grant execute on function private.create_order_distance(bigint,text,text,text,text,text,text,text,text,jsonb,numeric) to authenticated;
-- Legacy orders still work for flat-rate stores; km stores require the distance-aware RPC.
create or replace function public.create_order(
p_store_public_id bigint,p_city text,p_mode text,p_customer_name text,p_customer_phone text,p_address text,p_neighborhood text,p_note text,p_payment_method text,p_items jsonb)
returns table(order_id uuid,public_number bigint,subtotal integer,delivery_fee integer,total integer)
language sql security invoker set search_path='' as $$
select * from private.create_order_distance(p_store_public_id,p_city,p_mode,p_customer_name,p_customer_phone,p_address,p_neighborhood,p_note,p_payment_method,p_items,null) $$;
create function private.create_order_distance_once(
  p_request_id uuid,
  p_store_public_id bigint,p_city text,p_mode text,p_customer_name text,
  p_customer_phone text,p_address text,p_neighborhood text,p_note text,
  p_payment_method text,p_items jsonb,p_distance_km numeric,p_expected_delivery_fee integer
)
returns table(order_id uuid,public_number bigint,subtotal integer,delivery_fee integer,total integer)
language plpgsql security definer set search_path=''
as $$
declare
  uid uuid:=auth.uid();
  fingerprint bytea;
  previous private.checkout_requests%rowtype;
  created record;
  current_store public.stores%rowtype;
  current_fee integer;
begin
  if uid is null then raise exception 'authentication_required' using errcode='28000'; end if;
  if p_request_id is null then raise exception 'invalid_order_request_id' using errcode='22023'; end if;
  fingerprint:=pg_catalog.sha256(pg_catalog.convert_to(pg_catalog.jsonb_build_object(
    'store',p_store_public_id,'city',p_city,'mode',p_mode,'name',p_customer_name,
    'phone',p_customer_phone,'address',p_address,'neighborhood',p_neighborhood,
    'note',p_note,'payment',p_payment_method,'items',p_items,'distance',p_distance_km,'expectedDelivery',p_expected_delivery_fee
  )::text,'UTF8'));
  -- Serializes identical attempts even if two browser tabs submit concurrently.
  perform pg_catalog.pg_advisory_xact_lock(pg_catalog.hashtextextended(uid::text||':'||p_request_id::text,0));
  select * into previous from private.checkout_requests r
    where r.customer_id=uid and r.request_id=p_request_id;
  if found then
    if previous.fingerprint<>fingerprint then
      raise exception 'order_request_conflict' using errcode='22023';
    end if;
    return query select o.id,o.public_number,o.subtotal,o.delivery_fee,o.total
      from public.orders o where o.id=previous.order_id and o.customer_id=uid;
    return;
  end if;
  select * into current_store from public.stores where public_id=p_store_public_id and active for update;
  if not found then raise exception 'store_unavailable' using errcode='P0002'; end if;
  current_fee:=case when p_mode='delivery' then private.delivery_fee_for(current_store.delivery_fee,current_store.delivery_fee_per_km,current_store.delivery_minimum_fee,p_distance_km) else 0 end;
  if p_expected_delivery_fee is null or p_expected_delivery_fee<>current_fee then raise exception 'delivery_price_changed' using errcode='22023'; end if;
  select * into created from private.create_order_distance(p_store_public_id,p_city,p_mode,p_customer_name,
    p_customer_phone,p_address,p_neighborhood,p_note,p_payment_method,p_items,p_distance_km);
  insert into private.checkout_requests(customer_id,request_id,fingerprint,order_id)
    values(uid,p_request_id,fingerprint,created.order_id);
  return query select created.order_id,created.public_number,created.subtotal,created.delivery_fee,created.total;
end $$;

revoke all on function private.create_order_distance_once(uuid,bigint,text,text,text,text,text,text,text,text,jsonb,numeric,integer) from public,anon,authenticated;
grant execute on function private.create_order_distance_once(uuid,bigint,text,text,text,text,text,text,text,text,jsonb,numeric,integer) to authenticated;
create function public.create_order_distance_once(
p_request_id uuid,p_store_public_id bigint,p_city text,p_mode text,p_customer_name text,p_customer_phone text,p_address text,p_neighborhood text,p_note text,p_payment_method text,p_items jsonb,p_distance_km numeric,p_expected_delivery_fee integer)
returns table(order_id uuid,public_number bigint,subtotal integer,delivery_fee integer,total integer)
language sql security invoker set search_path='' as $$
select * from private.create_order_distance_once(p_request_id,p_store_public_id,p_city,p_mode,p_customer_name,p_customer_phone,p_address,p_neighborhood,p_note,p_payment_method,p_items,p_distance_km,p_expected_delivery_fee) $$;
revoke all on function public.create_order_distance_once(uuid,bigint,text,text,text,text,text,text,text,text,jsonb,numeric,integer) from public,anon,authenticated;
grant execute on function public.create_order_distance_once(uuid,bigint,text,text,text,text,text,text,text,text,jsonb,numeric,integer) to authenticated;
