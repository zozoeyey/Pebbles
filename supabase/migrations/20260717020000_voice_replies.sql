-- Voice replies: store the audio (private) and mark the reply kind so the UI
-- can show a small voice indicator. reply_text holds the Whisper transcript.

alter table public.reflection_replies
  add column if not exists kind text not null default 'text',
  add column if not exists audio_path text;

-- Clients may see that a reply was spoken, but never the audio path itself.
grant select (kind) on public.reflection_replies to anon, authenticated;
