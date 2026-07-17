-- Fix: the client-side PATCH to set shared=true silently updated 0 rows,
-- because PostgREST locates rows via SELECT policies and unshared rows are
-- not selectable. Sharing now goes through a security-definer RPC instead
-- (same pattern as like_reflection).

create or replace function public.share_reflection(reflection_id uuid)
returns void
language sql
security definer
set search_path = public
as $$
  update public.reflections set shared = true where id = reflection_id;
$$;

revoke all on function public.share_reflection(uuid) from public;
grant execute on function public.share_reflection(uuid) to anon, authenticated;

-- The broken client-update path is no longer needed.
drop policy if exists "Anyone can update by id" on public.reflections;
revoke update (shared) on public.reflections from anon, authenticated;

-- Clean up rows created by wiring tests.
delete from public.reflections where session_id in ('patch-test', 'smoke-test');
delete from public.events where session_id in ('patch-test', 'smoke-test');

-- Trim near-duplicate sample voices — keep one distinct story per activity
-- (freeze-feelings, tense-and-relax, feelings-circle, emotion-portraits).
delete from public.reflections
where session_id = 'seed'
  and (summary like 'The activity created space for more open conversation%'
    or summary like 'I jumped in too quickly%');
