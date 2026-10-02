
create table if not exists public.legal_acceptances (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  document_type text not null check (document_type in ('terms','privacy','merchant_terms')),
  version text not null check (char_length(version) between 1 and 40),
  accepted_at timestamptz not null default now(),
  unique(user_id,document_type,version)
);

create index if not exists legal_acceptances_user_idx
  on public.legal_acceptances(user_id,document_type,accepted_at desc);

alter table public.legal_acceptances enable row level security;

drop policy if exists legal_acceptances_own_read on public.legal_acceptances;
create policy legal_acceptances_own_read on public.legal_acceptances
for select to authenticated
using (user_id=(select auth.uid()) or private.is_admin());

drop policy if exists legal_acceptances_own_insert on public.legal_acceptances;
create policy legal_acceptances_own_insert on public.legal_acceptances
for insert to authenticated
with check (user_id=(select auth.uid()));

revoke all on public.legal_acceptances from anon,authenticated;
grant select,insert on public.legal_acceptances to authenticated;

drop policy if exists applications_own_insert on public.merchant_applications;
create policy applications_own_insert on public.merchant_applications
for insert to authenticated
with check (
  user_id=(select auth.uid())
  and status='pending'
  and exists (
    select 1 from public.legal_acceptances a
    where a.user_id=(select auth.uid()) and a.document_type='terms' and a.version='2026-09-28-v1'
  )
  and exists (
    select 1 from public.legal_acceptances a
    where a.user_id=(select auth.uid()) and a.document_type='privacy' and a.version='2026-09-28-v1'
  )
  and exists (
    select 1 from public.legal_acceptances a
    where a.user_id=(select auth.uid()) and a.document_type='merchant_terms' and a.version='2026-09-28-v1'
  )
);

create or replace function public.enforce_order_legal_acceptance()
returns trigger
language plpgsql
set search_path=public
as $$
begin
  if not exists (
    select 1 from public.legal_acceptances a
    where a.user_id=new.customer_id and a.document_type='terms' and a.version='2026-09-28-v1'
  ) or not exists (
    select 1 from public.legal_acceptances a
    where a.user_id=new.customer_id and a.document_type='privacy' and a.version='2026-09-28-v1'
  ) then
    raise exception 'legal_acceptance_required' using errcode='42501';
  end if;
  return new;
end $$;

drop trigger if exists orders_require_legal_acceptance on public.orders;
create trigger orders_require_legal_acceptance
before insert on public.orders
for each row execute function public.enforce_order_legal_acceptance();

revoke all on function public.enforce_order_legal_acceptance() from public,anon,authenticated;

