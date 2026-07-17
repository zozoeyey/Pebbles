-- Move the hardcoded community sample reflections into real rows, so every
-- card in the feed is likeable/replyable through the same pipeline.
-- session_id 'seed' marks them — exclude from analytics with session_id <> 'seed'.
-- (Two samples referenced retired/mismatched activities; reassigned to the
-- closest current activity.)

insert into public.reflections
  (activity_id, activity_title, child_age, summary, shared, likes, session_id, created_at)
values
  ('freeze-feelings', 'Freeze Feelings', 8,
   'The activity created space for more open conversation than usual, with the child sharing feelings they typically don''t express—showing how intentional slowing down unlocked emotional sharing.',
   true, 24, 'seed', now() - interval '2 hours'),
  ('freeze-feelings', 'Freeze Feelings', 6,
   'We did this right after school and it turned into one of the most connected moments we''ve had in a while. My daughter was shy about acting out ''embarrassed'' but ended up laughing and really got into it.',
   true, 17, 'seed', now() - interval '5 hours'),
  ('tense-and-relax', 'Tense and Relax', 5,
   'Tried the Tense and Relax activity with Lara while she was distracted and hyperactive — went ahead anyway despite the bad timing. What went well: the imagery made her giggle, and she noticed on her own that her hands felt ''floppy'' afterward.',
   true, 11, 'seed', now() - interval '1 day'),
  ('feelings-circle', 'Feelings Circle', 7,
   'Maya was able to name basic emotions easily and even added her own ("frustrated" when things don''t go her way); she seemed especially engaged when we connected the scenario to something that actually happened at school.',
   true, 18, 'seed', now() - interval '3 hours'),
  ('feelings-circle', 'Feelings Circle', 9,
   'I jumped in too quickly to label the ''right'' emotion instead of letting her sit with it. Next time I want to give more space for her to explore her own interpretations, and focus less on getting the ''right'' answer.',
   true, 7, 'seed', now() - interval '6 hours'),
  ('emotion-portraits', 'Emotion Portraits', 8,
   'Tried this with Marcus at the kitchen table using index cards and markers. He was engaged and excited to decorate; the prompt about how others can tell when he''s not doing well led to a surprisingly insightful response.',
   true, 13, 'seed', now() - interval '2 days');
