-- =============================================================================
-- Kontinue: keep request-history entries in the right order.
-- now() is the same for every row in one transaction, so several timeline
-- entries created together (e.g. status + consultant change) could appear out
-- of order. clock_timestamp() records the actual moment of each entry.
--
-- Run once in Supabase → SQL Editor (only needed if 0001 was run before this fix).
-- =============================================================================

create or replace function public.stamp_request_update()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  new.author_id := auth.uid();
  new.author_role := coalesce(public.current_app_role(), 'system');
  new.created_at := clock_timestamp();
  return new;
end;
$$;
