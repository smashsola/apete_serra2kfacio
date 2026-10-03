-- Offer validity is enforced both in the catalogue and the order transaction.
alter table public.products add column offer_starts_at timestamptz;
alter table public.products add column offer_ends_at timestamptz;
alter table public.products add constraint product_offer_window check (
 (offer_starts_at is null and offer_ends_at is null) or
 (offer_starts_at is not null and offer_ends_at is not null and offer_ends_at>offer_starts_at));
grant insert(offer_starts_at,offer_ends_at),update(offer_starts_at,offer_ends_at) on public.products to authenticated;
-- Existing undated demo discounts remain editable, but are not valid offers.
create function private.validate_offer_dates() returns trigger language plpgsql set search_path='' as $$
begin
 if new.last_batch and (TG_OP='INSERT' or not old.last_batch or new.price is distinct from old.price or new.old_price is distinct from old.old_price or new.offer_starts_at is distinct from old.offer_starts_at or new.offer_ends_at is distinct from old.offer_ends_at) then
  if new.offer_starts_at is null or new.offer_ends_at is null or new.offer_ends_at<=now() or new.old_price<=new.price then
   raise exception 'invalid_offer_window' using errcode='22023';
  end if;
 end if;
 return new;
end $$;
revoke all on function private.validate_offer_dates() from public;
create trigger products_validate_offer_dates before insert or update on public.products for each row execute function private.validate_offer_dates();
create or replace function public.create_order(
  p_store_public_id bigint,
  p_city text,
  p_mode text,
  p_customer_name text,
  p_customer_phone text,
  p_address text,
  p_neighborhood text,
  p_note text,
  p_payment_method text,
  p_items jsonb
)
returns table(order_id uuid,public_number bigint,subtotal integer,delivery_fee integer,total integer)
language plpgsql
security definer
set search_path=public
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

  fee:=case when p_mode='delivery' then target_store.delivery_fee else 0 end;

  insert into public.orders(
    customer_id,store_id,status,mode,city,customer_name,customer_phone,address,neighborhood,note,
    payment_method,subtotal,delivery_fee,total
  ) values(
    uid,target_store.id,'pending',p_mode,trim(p_city),trim(p_customer_name),clean_phone,
    case when p_mode='delivery' then trim(p_address) else '' end,
    trim(coalesce(p_neighborhood,'')),coalesce(trim(p_note),''),
    p_payment_method,sub,fee,sub+fee
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

