-- Parents can take a like back. Floor at zero.
create or replace function public.unlike_reflection(reflection_id uuid)
returns void
language sql
security definer
set search_path = public
as $$
  update public.reflections
  set likes = greatest(likes - 1, 0)
  where id = reflection_id and shared;
$$;

revoke all on function public.unlike_reflection(uuid) from public;
grant execute on function public.unlike_reflection(uuid) to anon, authenticated;
