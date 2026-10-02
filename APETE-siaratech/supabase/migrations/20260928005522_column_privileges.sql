revoke insert,update on public.products from authenticated;
grant insert(store_id,name,description,category,price,stock,image,old_price,last_batch,preferences,serves,active) on public.products to authenticated;
grant update(name,description,category,price,stock,image,old_price,last_batch,preferences,serves,active,updated_at) on public.products to authenticated;

revoke update on public.delivery_assignments from authenticated;
grant update(status,picked_up_at,delivered_at,updated_at) on public.delivery_assignments to authenticated;

