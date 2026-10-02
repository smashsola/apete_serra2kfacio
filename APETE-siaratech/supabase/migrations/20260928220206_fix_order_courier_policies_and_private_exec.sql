
alter policy orders_read on public.orders
using (
  customer_id = (select auth.uid())
  or private.is_store_member(store_id)
  or private.is_admin()
  or exists (
    select 1
    from public.delivery_assignments d
    where d.order_id = orders.id
      and d.courier_id = (select auth.uid())
  )
);

alter policy orders_staff_status_update on public.orders
using (
  private.is_store_member(store_id)
  or private.is_admin()
  or exists (
    select 1
    from public.delivery_assignments d
    where d.order_id = orders.id
      and d.courier_id = (select auth.uid())
  )
)
with check (
  private.is_store_member(store_id)
  or private.is_admin()
  or exists (
    select 1
    from public.delivery_assignments d
    where d.order_id = orders.id
      and d.courier_id = (select auth.uid())
  )
);

revoke execute on function private.can_access_order(uuid,uuid) from public;
revoke execute on function private.is_store_member(uuid,uuid) from public;
revoke execute on function private.is_admin(uuid) from public;

grant execute on function private.can_access_order(uuid,uuid) to authenticated, service_role;
grant execute on function private.is_store_member(uuid,uuid) to authenticated, service_role;
grant execute on function private.is_admin(uuid) to authenticated, service_role;

