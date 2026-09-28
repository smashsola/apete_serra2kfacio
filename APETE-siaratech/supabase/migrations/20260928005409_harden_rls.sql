create schema if not exists private;
revoke all on schema private from public,anon;
grant usage on schema private to authenticated;

create or replace function private.is_admin(uid uuid default auth.uid())
returns boolean
language sql stable security definer set search_path=public
as $$ select exists(select 1 from public.profiles p where p.id=uid and p.role='admin') $$;

create or replace function private.is_store_member(target_store uuid, uid uuid default auth.uid())
returns boolean
language sql stable security definer set search_path=public
as $$ select exists(select 1 from public.store_members sm where sm.store_id=target_store and sm.user_id=uid) $$;

create or replace function private.can_access_order(target_order uuid, uid uuid default auth.uid())
returns boolean
language sql stable security definer set search_path=public
as $$
select exists(
  select 1 from public.orders o
  where o.id=target_order
    and (
      o.customer_id=uid
      or private.is_store_member(o.store_id,uid)
      or private.is_admin(uid)
      or exists(select 1 from public.delivery_assignments d where d.order_id=o.id and d.courier_id=uid)
    )
) $$;

grant execute on function private.is_admin(uuid) to authenticated;
grant execute on function private.is_store_member(uuid,uuid) to authenticated;
grant execute on function private.can_access_order(uuid,uuid) to authenticated;

drop policy if exists profiles_self_select on public.profiles;
drop policy if exists profiles_self_update on public.profiles;
create policy profiles_self_select on public.profiles for select to authenticated
using (id=(select auth.uid()) or private.is_admin());
create policy profiles_self_update on public.profiles for update to authenticated
using (id=(select auth.uid()) or private.is_admin())
with check (id=(select auth.uid()) or private.is_admin());

drop policy if exists stores_member_update on public.stores;
create policy stores_member_update on public.stores for update to authenticated
using (private.is_store_member(id) or private.is_admin())
with check (private.is_store_member(id) or private.is_admin());

drop policy if exists members_self_read on public.store_members;
drop policy if exists members_admin_write on public.store_members;
create policy members_self_read on public.store_members for select to authenticated
using (user_id=(select auth.uid()) or private.is_admin());
create policy members_admin_insert on public.store_members for insert to authenticated
with check (private.is_admin());
create policy members_admin_update on public.store_members for update to authenticated
using (private.is_admin()) with check (private.is_admin());
create policy members_admin_delete on public.store_members for delete to authenticated
using (private.is_admin());

drop policy if exists products_member_insert on public.products;
drop policy if exists products_member_update on public.products;
drop policy if exists products_member_delete on public.products;
create policy products_member_insert on public.products for insert to authenticated
with check (private.is_store_member(store_id) or private.is_admin());
create policy products_member_update on public.products for update to authenticated
using (private.is_store_member(store_id) or private.is_admin())
with check (private.is_store_member(store_id) or private.is_admin());
create policy products_member_delete on public.products for delete to authenticated
using (private.is_store_member(store_id) or private.is_admin());

drop policy if exists orders_read on public.orders;
drop policy if exists orders_staff_status_update on public.orders;
create policy orders_read on public.orders for select to authenticated
using (
 customer_id=(select auth.uid())
 or private.is_store_member(store_id)
 or private.is_admin()
 or exists(select 1 from public.delivery_assignments d where d.order_id=id and d.courier_id=(select auth.uid()))
);
create policy orders_staff_status_update on public.orders for update to authenticated
using (
 private.is_store_member(store_id)
 or private.is_admin()
 or exists(select 1 from public.delivery_assignments d where d.order_id=id and d.courier_id=(select auth.uid()))
)
with check (
 private.is_store_member(store_id)
 or private.is_admin()
 or exists(select 1 from public.delivery_assignments d where d.order_id=id and d.courier_id=(select auth.uid()))
);

drop policy if exists order_items_read on public.order_items;
create policy order_items_read on public.order_items for select to authenticated
using (private.can_access_order(order_id));

drop policy if exists deliveries_read on public.delivery_assignments;
drop policy if exists deliveries_admin_write on public.delivery_assignments;
drop policy if exists deliveries_update on public.delivery_assignments;
create policy deliveries_read on public.delivery_assignments for select to authenticated
using (
 courier_id=(select auth.uid())
 or private.is_admin()
 or exists(select 1 from public.orders o where o.id=order_id and private.is_store_member(o.store_id))
);
create policy deliveries_admin_write on public.delivery_assignments for insert to authenticated
with check (private.is_admin());
create policy deliveries_update on public.delivery_assignments for update to authenticated
using (courier_id=(select auth.uid()) or private.is_admin())
with check (courier_id=(select auth.uid()) or private.is_admin());

drop policy if exists applications_own_read on public.merchant_applications;
drop policy if exists applications_own_insert on public.merchant_applications;
drop policy if exists applications_admin_update on public.merchant_applications;
create policy applications_own_read on public.merchant_applications for select to authenticated
using (user_id=(select auth.uid()) or private.is_admin());
create policy applications_own_insert on public.merchant_applications for insert to authenticated
with check (user_id=(select auth.uid()) and status='pending');
create policy applications_admin_update on public.merchant_applications for update to authenticated
using (private.is_admin()) with check (private.is_admin());

create index if not exists order_items_order_idx on public.order_items(order_id);
create index if not exists order_items_product_idx on public.order_items(product_id);
create index if not exists merchant_applications_reviewer_idx on public.merchant_applications(reviewed_by);

alter function public.touch_updated_at() set search_path=public;
alter function public.valid_order_transition(public.apete_order_status,public.apete_order_status) set search_path=public;
alter function public.enforce_order_status_transition() set search_path=public;

create or replace function private.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path=public
as $$
begin
  insert into public.profiles(id,full_name,phone)
  values(new.id,coalesce(new.raw_user_meta_data->>'full_name',''),coalesce(new.raw_user_meta_data->>'phone',''))
  on conflict(id) do nothing;
  return new;
end $$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created after insert on auth.users
for each row execute function private.handle_new_user();

revoke all on function public.handle_new_user() from public,anon,authenticated;
revoke all on function public.is_admin(uuid) from public,anon,authenticated;
revoke all on function public.is_store_member(uuid,uuid) from public,anon,authenticated;
revoke all on function public.can_access_order(uuid,uuid) from public,anon,authenticated;
drop function public.handle_new_user();
drop function public.is_admin(uuid);
drop function public.is_store_member(uuid,uuid);
drop function public.can_access_order(uuid,uuid);

