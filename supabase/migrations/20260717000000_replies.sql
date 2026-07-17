-- Public replies on community reflections. A reply targets either a live
-- shared reflection (its uuid) or a seeded example ("seed-<activity>-<n>").
-- Text only for now — voice replies are still just flagged in events.

create table public.reflection_replies (
  id             uuid        primary key default gen_random_uuid(),
  created_at     timestamptz default now(),
  session_id     text        not null,
  reflection_ref text        not null,
  activity_id    text        not null,
  reply_text     text        not null
);

alter table public.reflection_replies enable row level security;

create policy "Anyone can insert replies" on public.reflection_replies
  for insert with check (true);

create policy "Replies are readable" on public.reflection_replies
  for select using (true);

-- Replies are public conversation, but who wrote them stays private.
revoke select, update, delete on public.reflection_replies from anon, authenticated;
grant select (id, created_at, reflection_ref, activity_id, reply_text)
  on public.reflection_replies to anon, authenticated;
grant insert on public.reflection_replies to anon, authenticated;

create index replies_activity_idx on public.reflection_replies (activity_id, created_at);
