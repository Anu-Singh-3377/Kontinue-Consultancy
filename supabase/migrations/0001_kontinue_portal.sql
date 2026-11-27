-- =============================================================================
-- Kontinue Consultancy: authentication, requests and portal
--
-- Run once in Supabase: Dashboard → SQL Editor → New query → paste → Run.
-- Creates: profiles, contact_requests, consultation_requests, request_updates,
--          request_notes (staff-only internal notes), helper functions,
--          triggers and Row Level Security policies.
--
-- Roles: 'user' (default for every sign-up), 'service' (consultant), 'admin'.
-- Nobody can choose or change their own role from the website. See the end of
-- this file for how to create the first admin.
-- =============================================================================

create extension if not exists pgcrypto;

-- -----------------------------------------------------------------------------
-- Profiles (one per auth user)
-- -----------------------------------------------------------------------------
create table public.profiles (
  id          uuid primary key references auth.users (id) on delete cascade,
  full_name   text not null default '',
  email       text not null,
  phone       text not null default '',
  address     text not null default '',
  role        text not null default 'user' check (role in ('user', 'service', 'admin')),
  is_active   boolean not null default true,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

create index profiles_role_idx on public.profiles (role);

-- -----------------------------------------------------------------------------
-- Role helpers. SECURITY DEFINER so policies can call them without recursing
-- into the profiles policies.
-- -----------------------------------------------------------------------------
create or replace function public.current_app_role()
returns text
language sql
stable
security definer
set search_path = public
as $$
  select role from public.profiles where id = auth.uid() and is_active
$$;

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select coalesce(public.current_app_role() = 'admin', false)
$$;

create or replace function public.is_service()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select coalesce(public.current_app_role() = 'service', false)
$$;

-- -----------------------------------------------------------------------------
-- Shared updated_at trigger
-- -----------------------------------------------------------------------------
create or replace function public.touch_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at := now();
  return new;
end;
$$;

create trigger profiles_touch before update on public.profiles
  for each row execute function public.touch_updated_at();

-- -----------------------------------------------------------------------------
-- Create a profile for every new auth user. Role is ALWAYS 'user'; any role in
-- the sign-up metadata is ignored.
-- -----------------------------------------------------------------------------
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, email, full_name, phone, address)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data ->> 'full_name', ''),
    coalesce(new.raw_user_meta_data ->> 'phone', ''),
    coalesce(new.raw_user_meta_data ->> 'address', '')
  );
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- Only admins may change role / active flag / email. Admins cannot remove their
-- own admin role (prevents locking everyone out). Direct SQL in the Supabase
-- dashboard (no auth.uid()) is allowed so the first admin can be created.
create or replace function public.guard_profile_update()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if auth.uid() is null then
    return new;
  end if;

  if new.id is distinct from old.id then
    raise exception 'Profile id cannot be changed';
  end if;

  if public.is_admin() then
    if old.id = auth.uid() and (new.role <> 'admin' or not new.is_active) then
      raise exception 'Admins cannot remove their own admin access';
    end if;
    return new;
  end if;

  if new.role is distinct from old.role
     or new.is_active is distinct from old.is_active
     or new.email is distinct from old.email then
    raise exception 'Not allowed to change role, status or email';
  end if;

  return new;
end;
$$;

create trigger profiles_guard before update on public.profiles
  for each row execute function public.guard_profile_update();

-- -----------------------------------------------------------------------------
-- Contact requests
-- -----------------------------------------------------------------------------
create table public.contact_requests (
  id              uuid primary key default gen_random_uuid(),
  reference       text not null unique
                  default ('KC-' || upper(substr(replace(gen_random_uuid()::text, '-', ''), 1, 8))),
  user_id         uuid not null default auth.uid() references public.profiles (id) on delete cascade,
  name            text not null check (length(btrim(name)) between 1 and 200),
  email           text not null check (email ~* '^[^@\s]+@[^@\s]+\.[^@\s]+$'),
  phone           text not null check (length(btrim(phone)) between 7 and 30),
  address         text not null check (length(btrim(address)) between 1 and 500),
  company         text check (company is null or length(company) <= 200),
  service         text check (service is null or length(service) <= 200),
  message         text not null check (length(btrim(message)) between 1 and 5000),
  status          text not null default 'new'
                  check (status in ('new', 'in_progress', 'contacted', 'resolved', 'closed')),
  admin_response  text,
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);

create index contact_requests_user_idx on public.contact_requests (user_id, created_at desc);
create index contact_requests_status_idx on public.contact_requests (status, created_at desc);

create trigger contact_requests_touch before update on public.contact_requests
  for each row execute function public.touch_updated_at();

-- -----------------------------------------------------------------------------
-- Consultation requests
-- -----------------------------------------------------------------------------
create table public.consultation_requests (
  id              uuid primary key default gen_random_uuid(),
  reference       text not null unique
                  default ('KB-' || upper(substr(replace(gen_random_uuid()::text, '-', ''), 1, 8))),
  user_id         uuid not null default auth.uid() references public.profiles (id) on delete cascade,
  name            text not null check (length(btrim(name)) between 1 and 200),
  email           text not null check (email ~* '^[^@\s]+@[^@\s]+\.[^@\s]+$'),
  phone           text not null check (length(btrim(phone)) between 7 and 30),
  address         text not null check (length(btrim(address)) between 1 and 500),
  company         text check (company is null or length(company) <= 200),
  service         text not null check (length(btrim(service)) between 1 and 200),
  preferred_date  date not null,
  preferred_time  time not null,
  message         text not null check (length(btrim(message)) between 1 and 5000),
  status          text not null default 'pending'
                  check (status in ('pending', 'under_review', 'contacted', 'scheduled',
                                    'completed', 'cancelled', 'rejected')),
  assigned_to     uuid references public.profiles (id) on delete set null,
  admin_response  text,
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);

create index consultation_requests_user_idx on public.consultation_requests (user_id, created_at desc);
create index consultation_requests_status_idx on public.consultation_requests (status, created_at desc);
create index consultation_requests_assigned_idx on public.consultation_requests (assigned_to);

create trigger consultation_requests_touch before update on public.consultation_requests
  for each row execute function public.touch_updated_at();

-- Consultants may only change status (to a limited set) and the client-facing
-- response on requests assigned to them. Admins may change anything.
create or replace function public.guard_consultation_update()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if auth.uid() is null or public.is_admin() then
    return new;
  end if;

  if public.is_service() and old.assigned_to = auth.uid() then
    if (new.user_id, new.name, new.email, new.phone, new.address, new.company, new.service,
        new.preferred_date, new.preferred_time, new.message, new.assigned_to, new.reference)
       is distinct from
       (old.user_id, old.name, old.email, old.phone, old.address, old.company, old.service,
        old.preferred_date, old.preferred_time, old.message, old.assigned_to, old.reference) then
      raise exception 'Consultants may only update status and response';
    end if;
    if new.status is distinct from old.status
       and new.status not in ('under_review', 'contacted', 'scheduled', 'completed') then
      raise exception 'Consultants cannot set this status';
    end if;
    return new;
  end if;

  raise exception 'Not allowed to update this request';
end;
$$;

create trigger consultation_requests_guard before update on public.consultation_requests
  for each row execute function public.guard_consultation_update();

-- -----------------------------------------------------------------------------
-- Request history / conversation (client-visible)
-- -----------------------------------------------------------------------------
create table public.request_updates (
  id               uuid primary key default gen_random_uuid(),
  consultation_id  uuid references public.consultation_requests (id) on delete cascade,
  contact_id       uuid references public.contact_requests (id) on delete cascade,
  author_id        uuid references public.profiles (id) on delete set null,
  author_role      text not null check (author_role in ('user', 'service', 'admin', 'system')),
  kind             text not null check (kind in ('submitted', 'status', 'response', 'assignment')),
  status           text,
  message          text check (message is null or length(message) <= 5000),
  created_at       timestamptz not null default now(),
  check (num_nonnulls(consultation_id, contact_id) = 1)
);

create index request_updates_consultation_idx on public.request_updates (consultation_id, created_at);
create index request_updates_contact_idx on public.request_updates (contact_id, created_at);

-- Author and role always come from the session, never from the client.
create or replace function public.stamp_request_update()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  new.author_id := auth.uid();
  new.author_role := coalesce(public.current_app_role(), 'system');
  new.created_at := clock_timestamp(); -- real time, so entries in one transaction stay in order
  return new;
end;
$$;

create trigger request_updates_stamp before insert on public.request_updates
  for each row execute function public.stamp_request_update();

-- A staff response also becomes the request's latest admin_response.
create or replace function public.apply_response()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if new.kind = 'response' and new.message is not null then
    if new.consultation_id is not null then
      update public.consultation_requests set admin_response = new.message where id = new.consultation_id;
    else
      update public.contact_requests set admin_response = new.message where id = new.contact_id;
    end if;
  end if;
  return new;
end;
$$;

create trigger request_updates_apply after insert on public.request_updates
  for each row execute function public.apply_response();

-- Automatic timeline entries: submission, status changes, assignment.
create or replace function public.log_request_change()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  is_consultation boolean := tg_table_name = 'consultation_requests';
begin
  if tg_op = 'INSERT' then
    insert into public.request_updates (consultation_id, contact_id, author_role, kind, status, message)
    values (case when is_consultation then new.id end, case when is_consultation then null else new.id end,
            'user', 'submitted', new.status, 'Request submitted');
    return new;
  end if;

  if new.status is distinct from old.status then
    insert into public.request_updates (consultation_id, contact_id, author_role, kind, status)
    values (case when is_consultation then new.id end, case when is_consultation then null else new.id end,
            'system', 'status', new.status);
  end if;

  if is_consultation and new.assigned_to is distinct from old.assigned_to and new.assigned_to is not null then
    insert into public.request_updates (consultation_id, author_role, kind, message)
    values (new.id, 'system', 'assignment', 'A consultant has been assigned to your request');
  end if;

  return new;
end;
$$;

create trigger contact_requests_log after insert or update on public.contact_requests
  for each row execute function public.log_request_change();

create trigger consultation_requests_log after insert or update on public.consultation_requests
  for each row execute function public.log_request_change();

-- -----------------------------------------------------------------------------
-- Internal staff notes (never visible to clients)
-- -----------------------------------------------------------------------------
create table public.request_notes (
  id               uuid primary key default gen_random_uuid(),
  consultation_id  uuid references public.consultation_requests (id) on delete cascade,
  contact_id       uuid references public.contact_requests (id) on delete cascade,
  author_id        uuid default auth.uid() references public.profiles (id) on delete set null,
  note             text not null check (length(btrim(note)) between 1 and 5000),
  created_at       timestamptz not null default now(),
  check (num_nonnulls(consultation_id, contact_id) = 1)
);

create index request_notes_consultation_idx on public.request_notes (consultation_id, created_at);
create index request_notes_contact_idx on public.request_notes (contact_id, created_at);

-- -----------------------------------------------------------------------------
-- Row Level Security
-- -----------------------------------------------------------------------------
alter table public.profiles              enable row level security;
alter table public.contact_requests      enable row level security;
alter table public.consultation_requests enable row level security;
alter table public.request_updates       enable row level security;
alter table public.request_notes         enable row level security;

-- Anonymous visitors get no access to any table.
revoke all on public.profiles, public.contact_requests, public.consultation_requests,
              public.request_updates, public.request_notes from anon;

-- Logged-in users need table privileges for the API to work at all (newer
-- Supabase projects no longer grant these automatically). The RLS policies
-- below still decide which rows each person can see or change.
grant usage on schema public to authenticated;
grant select, insert, update, delete on public.profiles, public.contact_requests,
      public.consultation_requests, public.request_updates, public.request_notes to authenticated;
grant execute on function public.current_app_role(), public.is_admin(), public.is_service() to authenticated;

-- profiles
create policy "profiles: read own or admin" on public.profiles
  for select to authenticated
  using (id = auth.uid() or public.is_admin());

create policy "profiles: update own or admin" on public.profiles
  for update to authenticated
  using (id = auth.uid() or public.is_admin())
  with check (id = auth.uid() or public.is_admin());
-- No insert policy (the sign-up trigger creates profiles). No delete policy.

-- contact_requests
create policy "contact: read own or admin" on public.contact_requests
  for select to authenticated
  using (user_id = auth.uid() or public.is_admin());

create policy "contact: create own" on public.contact_requests
  for insert to authenticated
  with check (user_id = auth.uid() and status = 'new' and admin_response is null);

create policy "contact: admin update" on public.contact_requests
  for update to authenticated
  using (public.is_admin()) with check (public.is_admin());

create policy "contact: admin delete" on public.contact_requests
  for delete to authenticated
  using (public.is_admin());

-- consultation_requests
create policy "consultation: read own, assigned or admin" on public.consultation_requests
  for select to authenticated
  using (user_id = auth.uid() or public.is_admin() or (public.is_service() and assigned_to = auth.uid()));

create policy "consultation: create own" on public.consultation_requests
  for insert to authenticated
  with check (user_id = auth.uid() and status = 'pending' and assigned_to is null and admin_response is null);

create policy "consultation: admin or assigned consultant update" on public.consultation_requests
  for update to authenticated
  using (public.is_admin() or (public.is_service() and assigned_to = auth.uid()))
  with check (public.is_admin() or (public.is_service() and assigned_to = auth.uid()));

create policy "consultation: admin delete" on public.consultation_requests
  for delete to authenticated
  using (public.is_admin());

-- request_updates: readable by whoever can see the parent request
create policy "updates: read with parent" on public.request_updates
  for select to authenticated
  using (
    public.is_admin()
    or exists (
      select 1 from public.consultation_requests c
      where c.id = request_updates.consultation_id
        and (c.user_id = auth.uid() or (public.is_service() and c.assigned_to = auth.uid()))
    )
    or exists (
      select 1 from public.contact_requests r
      where r.id = request_updates.contact_id and r.user_id = auth.uid()
    )
  );

-- Only staff post responses; the timeline's other entries come from triggers.
create policy "updates: staff respond" on public.request_updates
  for insert to authenticated
  with check (
    kind = 'response'
    and (
      public.is_admin()
      or (
        public.is_service()
        and contact_id is null
        and exists (
          select 1 from public.consultation_requests c
          where c.id = request_updates.consultation_id and c.assigned_to = auth.uid()
        )
      )
    )
  );

-- request_notes: admins, plus the assigned consultant for consultations
create policy "notes: staff read" on public.request_notes
  for select to authenticated
  using (
    public.is_admin()
    or (public.is_service() and exists (
      select 1 from public.consultation_requests c
      where c.id = request_notes.consultation_id and c.assigned_to = auth.uid()
    ))
  );

create policy "notes: staff write" on public.request_notes
  for insert to authenticated
  with check (
    author_id = auth.uid()
    and (
      public.is_admin()
      or (public.is_service() and contact_id is null and exists (
        select 1 from public.consultation_requests c
        where c.id = request_notes.consultation_id and c.assigned_to = auth.uid()
      ))
    )
  );

-- =============================================================================
-- First admin (run separately, AFTER that person has registered on the site):
--
--   update public.profiles set role = 'admin' where email = 'admin@example.com';
--
-- Afterwards, admins promote consultants from Admin → Users on the website.
-- =============================================================================
