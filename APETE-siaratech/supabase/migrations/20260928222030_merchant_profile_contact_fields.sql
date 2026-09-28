
    alter table public.stores add column if not exists instagram text not null default '';
    alter table public.stores add column if not exists contact_phone text not null default '';
    grant update(instagram,contact_phone) on public.stores to authenticated;
  
