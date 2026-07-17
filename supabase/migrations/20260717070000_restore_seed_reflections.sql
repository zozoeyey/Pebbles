-- Restore the two sample community reflections removed during the earlier dedup.
-- Guarded so it won't double-insert if they already exist.

insert into public.reflections
  (activity_id, activity_title, child_age, summary, shared, likes, session_id, created_at)
select v.activity_id, v.activity_title, v.child_age, v.summary, true, v.likes, 'seed', now() - v.age_interval
from (values
  ('freeze-feelings', 'Freeze Feelings', 8,
   'The activity created space for more open conversation than usual, with the child sharing feelings they typically don''t express—showing how intentional slowing down unlocked emotional sharing.',
   24, interval '2 hours'),
  ('feelings-circle', 'Feelings Circle', 9,
   'I jumped in too quickly to label the ''right'' emotion instead of letting her sit with it. Next time I want to give more space for her to explore her own interpretations, and focus less on getting the ''right'' answer.',
   7, interval '6 hours')
) as v(activity_id, activity_title, child_age, summary, likes, age_interval)
where not exists (
  select 1 from public.reflections r
  where r.session_id = 'seed' and left(r.summary, 40) = left(v.summary, 40)
);
