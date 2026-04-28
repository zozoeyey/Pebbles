create table public.reflections (
  id            uuid        primary key default gen_random_uuid(),
  created_at    timestamptz default now(),
  activity_id   text        not null,
  activity_title text       not null,
  child_age     integer,
  audio_path    text,
  transcript    text,
  summary       text
);

alter table public.reflections enable row level security;

-- Parents can insert without a login; only service role can read all rows
create policy "Anyone can insert" on public.reflections
  for insert with check (true);
