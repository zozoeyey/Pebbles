-- Profile edits keep the parent's onboarding row current. Update-else-insert
-- keyed on session_id, so re-onboarding or profile tweaks don't pile up rows.

create or replace function public.upsert_onboarding(
  p_session_id text,
  p_age integer,
  p_challenges text,
  p_sel_definition text,
  p_emotion_handling text
)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  update public.onboarding_responses
     set selected_age = p_age,
         selected_challenge = p_challenges,
         sel_definition = p_sel_definition,
         emotion_handling = p_emotion_handling
   where session_id = p_session_id;
  if not found then
    insert into public.onboarding_responses
      (session_id, selected_age, selected_challenge, sel_definition, emotion_handling)
    values
      (p_session_id, p_age, p_challenges, p_sel_definition, p_emotion_handling);
  end if;
end;
$$;

revoke all on function public.upsert_onboarding(text, integer, text, text, text) from public;
grant execute on function public.upsert_onboarding(text, integer, text, text, text) to anon, authenticated;
