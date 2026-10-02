-- Additive RPC: retries with the same user/request ID return the original order.
-- Private data is never exposed through a public table or browser-side price.
create table private.checkout_requests (
  customer_id uuid not null references public.profiles(id) on delete cascade,
  request_id uuid not null,
  fingerprint bytea not null,
  order_id uuid not null references public.orders(id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key(customer_id,request_id)
);
alter table private.checkout_requests enable row level security;
revoke all on private.checkout_requests from public,anon,authenticated;

create function private.create_order_once(
  p_request_id uuid,
  p_store_public_id bigint,p_city text,p_mode text,p_customer_name text,
  p_customer_phone text,p_address text,p_neighborhood text,p_note text,
  p_payment_method text,p_items jsonb
)
returns table(order_id uuid,public_number bigint,subtotal integer,delivery_fee integer,total integer)
language plpgsql security definer set search_path=''
as $$
declare
  uid uuid:=auth.uid();
  fingerprint bytea;
  previous private.checkout_requests%rowtype;
  created record;
begin
  if uid is null then raise exception 'authentication_required' using errcode='28000'; end if;
  if p_request_id is null then raise exception 'invalid_order_request_id' using errcode='22023'; end if;
  fingerprint:=pg_catalog.sha256(pg_catalog.convert_to(pg_catalog.jsonb_build_object(
    'store',p_store_public_id,'city',p_city,'mode',p_mode,'name',p_customer_name,
    'phone',p_customer_phone,'address',p_address,'neighborhood',p_neighborhood,
    'note',p_note,'payment',p_payment_method,'items',p_items
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
  select * into created from public.create_order(p_store_public_id,p_city,p_mode,p_customer_name,
    p_customer_phone,p_address,p_neighborhood,p_note,p_payment_method,p_items);
  insert into private.checkout_requests(customer_id,request_id,fingerprint,order_id)
    values(uid,p_request_id,fingerprint,created.order_id);
  return query select created.order_id,created.public_number,created.subtotal,created.delivery_fee,created.total;
end $$;
revoke all on function private.create_order_once(uuid,bigint,text,text,text,text,text,text,text,text,jsonb) from public,anon,authenticated;
grant execute on function private.create_order_once(uuid,bigint,text,text,text,text,text,text,text,text,jsonb) to authenticated;

create function public.create_order_once(
  p_request_id uuid,
  p_store_public_id bigint,p_city text,p_mode text,p_customer_name text,
  p_customer_phone text,p_address text,p_neighborhood text,p_note text,
  p_payment_method text,p_items jsonb
)
returns table(order_id uuid,public_number bigint,subtotal integer,delivery_fee integer,total integer)
language sql security invoker set search_path=''
as $$ select * from private.create_order_once(p_request_id,p_store_public_id,p_city,p_mode,p_customer_name,
  p_customer_phone,p_address,p_neighborhood,p_note,p_payment_method,p_items) $$;
revoke all on function public.create_order_once(uuid,bigint,text,text,text,text,text,text,text,text,jsonb) from public,anon,authenticated;
grant execute on function public.create_order_once(uuid,bigint,text,text,text,text,text,text,text,text,jsonb) to authenticated;
