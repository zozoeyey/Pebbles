-- Share-to-community support for reflections.
-- Parents opt in after seeing their AI summary; only then does a reflection
-- become publicly readable — and only its safe columns (never transcript/audio).

alter table public.reflections
  add column if not exists shared boolean not null default false,
  add column if not exists session_id text,
  add column if not exists likes integer not null default 0;

-- Shared rows are publicly readable…
create policy "Shared reflections are readable" on public.reflections
  for select using (shared = true);

-- …and the owner (who holds the row's unguessable uuid) can flip `shared`.
create policy "Anyone can update by id" on public.reflections
  for update using (true) with check (true);

-- Column-level grants keep transcript, audio_path and session_id private,
-- and stop clients from editing anything except the `shared` flag.
revoke select, update on public.reflections from anon, authenticated;
grant select (id, created_at, activity_id, activity_title, child_age, summary, likes, shared)
  on public.reflections to anon, authenticated;
grant update (shared) on public.reflections to anon, authenticated;

-- Likes go through an RPC so clients can only ever increment by one.
create or replace function public.like_reflection(reflection_id uuid)
returns void
language sql
security definer
set search_path = public
as $$
  update public.reflections
  set likes = likes + 1
  where id = reflection_id and shared;
$$;

grant execute on function public.like_reflection(uuid) to anon, authenticated;
