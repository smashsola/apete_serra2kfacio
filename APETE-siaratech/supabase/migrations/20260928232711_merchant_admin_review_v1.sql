
create unique index if not exists merchant_applications_one_pending_user_idx
  on public.merchant_applications(user_id)
  where status='pending';

create or replace function public.review_merchant_application(
  p_application_id uuid,
  p_decision text
)
returns table(
  application_id uuid,
  application_status public.apete_merchant_application_status,
  created_store_id uuid
)
language plpgsql
security definer
set search_path=public
as $$
declare
  uid uuid:=auth.uid();
  app public.merchant_applications%rowtype;
  new_store_id uuid:=null;
begin
  if uid is null or not private.is_admin(uid) then
    raise exception 'admin_required' using errcode='42501';
  end if;
  if p_decision not in ('approve','reject') then
    raise exception 'invalid_review_decision' using errcode='22023';
  end if;

  select * into app
  from public.merchant_applications
  where id=p_application_id
  for update;

  if not found then
    raise exception 'merchant_application_not_found' using errcode='P0002';
  end if;
  if app.status<>'pending' then
    raise exception 'merchant_application_already_reviewed' using errcode='22023';
  end if;

  if p_decision='reject' then
    update public.merchant_applications
       set status='rejected',reviewed_by=uid,reviewed_at=now()
     where id=app.id;
  else
    insert into public.stores(
      name,category,city,description,hero,delivery_fee,producer,delivery,pickup,
      service_areas,cover,verified,active,demo,instagram,contact_phone
    ) values(
      trim(app.store_name),'',trim(app.city),'','',0,false,true,true,
      array[trim(app.city)],'',true,true,false,trim(app.instagram),regexp_replace(app.phone,'\D','','g')
    )
    returning id into new_store_id;

    insert into public.store_members(store_id,user_id,role)
    values(new_store_id,app.user_id,'owner');

    update public.profiles
       set role='merchant'
     where id=app.user_id;

    update public.merchant_applications
       set status='approved',reviewed_by=uid,reviewed_at=now()
     where id=app.id;
  end if;

  return query
  select app.id,
         case when p_decision='approve'
              then 'approved'::public.apete_merchant_application_status
              else 'rejected'::public.apete_merchant_application_status
          end,
         new_store_id;
end $$;

revoke all on function public.review_merchant_application(uuid,text) from public,anon;
grant execute on function public.review_merchant_application(uuid,text) to authenticated;

