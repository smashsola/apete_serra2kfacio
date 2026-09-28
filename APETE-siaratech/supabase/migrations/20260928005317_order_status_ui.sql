create or replace function public.valid_order_transition(old_status public.apete_order_status,new_status public.apete_order_status)
returns boolean language sql immutable as $$
select case old_status
 when 'pending' then new_status in ('accepted','preparing','cancelled')
 when 'accepted' then new_status in ('preparing','cancelled')
 when 'preparing' then new_status in ('ready','cancelled')
 when 'ready' then new_status in ('out_for_delivery','delivered','cancelled')
 when 'out_for_delivery' then new_status in ('delivered','cancelled')
 else false end
$$;

