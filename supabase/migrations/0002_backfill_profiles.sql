-- =============================================================================
-- Kontinue: create missing profiles for accounts that registered BEFORE
-- 0001_kontinue_portal.sql was run (the sign-up trigger did not exist yet).
-- Safe to run more than once. Everyone gets role 'user'.
--
-- Run in Supabase: Dashboard → SQL Editor → New query → paste → Run.
-- =============================================================================

insert into public.profiles (id, email, full_name, phone, address)
select
  u.id,
  u.email,
  coalesce(u.raw_user_meta_data ->> 'full_name', ''),
  coalesce(u.raw_user_meta_data ->> 'phone', ''),
  coalesce(u.raw_user_meta_data ->> 'address', '')
from auth.users u
left join public.profiles p on p.id = u.id
where p.id is null
  and u.email is not null;

-- Check: every account should now have a profile (this should return 0).
select count(*) as accounts_without_profile
from auth.users u
left join public.profiles p on p.id = u.id
where p.id is null;
