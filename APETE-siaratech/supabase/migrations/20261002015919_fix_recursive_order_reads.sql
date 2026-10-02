-- Break orders -> delivery_assignments -> orders RLS recursion.
-- This helper only checks the authenticated caller's assignment.
create function private.is_assigned_courier(target_order uuid)
returns boolean language sql stable security definer set search_path=''
as $$ select auth.uid() is not null and exists (
  select 1 from public.delivery_assignments d
  where d.order_id=target_order and d.courier_id=auth.uid()
) $$;
revoke all on function private.is_assigned_courier(uuid) from public,anon,authenticated;
grant execute on function private.is_assigned_courier(uuid) to authenticated;
alter policy orders_read on public.orders using (
  customer_id=(select auth.uid()) or private.is_store_member(store_id)
  or private.is_admin() or private.is_assigned_courier(orders.id)
);
