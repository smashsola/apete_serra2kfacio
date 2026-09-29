
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

  if new.raw_user_meta_data->>'legal_terms_version'='2026-09-28-v1' then
    insert into public.legal_acceptances(user_id,document_type,version)
    values(new.id,'terms','2026-09-28-v1')
    on conflict(user_id,document_type,version) do nothing;
  end if;

  if new.raw_user_meta_data->>'legal_privacy_version'='2026-09-28-v1' then
    insert into public.legal_acceptances(user_id,document_type,version)
    values(new.id,'privacy','2026-09-28-v1')
    on conflict(user_id,document_type,version) do nothing;
  end if;

  if new.raw_user_meta_data->>'legal_merchant_terms_version'='2026-09-28-v1' then
    insert into public.legal_acceptances(user_id,document_type,version)
    values(new.id,'merchant_terms','2026-09-28-v1')
    on conflict(user_id,document_type,version) do nothing;
  end if;

  return new;
end $$;

