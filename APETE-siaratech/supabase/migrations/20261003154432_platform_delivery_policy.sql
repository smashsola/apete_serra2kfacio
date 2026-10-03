-- Experimental platform tariff: R$5 includes 3 km; R$1 for each additional km.
-- max(500,200 + 100 * distance) is equivalent in cents. No platform surcharge.
update public.stores set delivery_fee=200,delivery_fee_per_km=100,delivery_minimum_fee=500 where demo;
alter table public.stores alter column delivery_fee set default 200;
alter table public.stores alter column delivery_fee_per_km set default 100;
alter table public.stores alter column delivery_minimum_fee set default 500;
-- Merchants may edit their profile, but only platform administration can change freight.
revoke update(delivery_fee,delivery_fee_per_km,delivery_minimum_fee) on public.stores from authenticated;
create function private.assign_platform_delivery_policy() returns trigger
language plpgsql set search_path='' as $$
begin
 new.delivery_fee:=200; new.delivery_fee_per_km:=100; new.delivery_minimum_fee:=500;
 return new;
end $$;
revoke all on function private.assign_platform_delivery_policy() from public,anon,authenticated;
create trigger stores_platform_delivery_policy before insert on public.stores
for each row execute function private.assign_platform_delivery_policy();
