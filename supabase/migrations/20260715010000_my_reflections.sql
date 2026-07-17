-- Toolkit needs the parent's OWN reflections (shared or not), but the select
-- policy only exposes shared rows. This RPC returns rows for one session id —
-- safe columns only, never the transcript or audio path.
-- Tradeoff until real auth: anyone who knows a session id could call this;
-- ids are random enough for the prototype, revisit with anonymous auth.

create or replace function public.get_my_reflections(p_session_id text)
returns table (
  id uuid,
  created_at timestamptz,
  activity_id text,
  activity_title text,
  summary text,
  shared boolean
)
language sql
stable
security definer
set search_path = public
as $$
  select id, created_at, activity_id, activity_title, summary, shared
  from public.reflections
  where session_id = p_session_id
  order by created_at desc;
$$;

revoke all on function public.get_my_reflections(text) from public;
grant execute on function public.get_my_reflections(text) to anon, authenticated;
