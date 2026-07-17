-- Anonymous usage analytics. Insert-only for clients: parents' devices write
-- events, but only the dashboard/service role can read them back.

create table public.events (
  id          uuid        primary key default gen_random_uuid(),
  created_at  timestamptz default now(),
  session_id  text        not null,
  event_type  text        not null,
  activity_id text,
  payload     jsonb
);

alter table public.events enable row level security;

create policy "Anyone can insert events" on public.events
  for insert with check (true);

-- No select/update/delete for clients — write-only telemetry.
revoke select, update, delete on public.events from anon, authenticated;

create index events_type_created_idx on public.events (event_type, created_at);
create index events_session_idx on public.events (session_id);
