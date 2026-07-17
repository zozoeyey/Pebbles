# Pebbles Data Map

Every piece of data the app stores, organized by where it lives.
(CSV version for spreadsheets: `docs/data-map.csv`)

Project dashboard: supabase.com/dashboard/project/ntftfszfebeeusppqffz

## Supabase table: `reflections`

One row per recorded reflection.

| Data stored | Page | Action that writes it |
|---|---|---|
| activity_id, activity_title, child_age, transcript, AI summary, audio_path, session_id | Reflection | Parent stops recording → processed & saved automatically |
| `shared` flips to true | Reflection | Parent taps "Share to Community" (opt-in) |
| `likes` +1 (via `like_reflection` RPC) | Community feed / activity thread | Another parent taps the heart |

Who can read: shared rows are public (safe columns only — never transcript,
audio, or session_id). A parent's own rows come back through the
`get_my_reflections` RPC (powers the Toolkit stats/calendar/list).

## Supabase table: `onboarding_responses`

One row per device (kept current by the `upsert_onboarding` RPC).

| Data stored | Page | Action that writes it |
|---|---|---|
| session_id, selected_age, selected_challenge (preset ids + custom text), sel_definition, emotion_handling | SEL screen (onboarding) | Parent taps "Next" |
| Same columns, updated in place | Profile | Any edit: age chip, challenge chip toggle, custom chip add/remove, SEL answer edits |

## Supabase table: `events` (write-only telemetry)

Columns: session_id, event_type, activity_id, payload, created_at.
Not written from `npm run dev` or devices with the Profile "test device" opt-out.

| event_type | Page | Action |
|---|---|---|
| session_start | any | App opened |
| activity_selected | Explore | Tap an activity card |
| activity_viewed | Detail | Detail page opened |
| activity_started | Activity player | Player opened |
| activity_completed | Reflection | "Complete" tapped |
| activity_saved / activity_unsaved | Explore | Bookmark tapped |
| reflection_submitted | Reflection | Summary came back after recording |
| reflection_shared | Reflection | "Share to Community" tapped |
| reflection_liked (payload: reflection id) | Community feed / thread | Heart tapped |
| reflection_replied (payload: reflection ref, text, voice flag) | Activity thread | "Send" on a reply |
| peer_reflection_opened | Reflection | Peer reflection card expanded |
| community_activity_opened | Community | An activity's thread opened |

## Supabase table: `reflection_replies`

Public conversation, readable by everyone (author's session_id stays private).

| Data stored | Page | Action |
|---|---|---|
| session_id, reflection_ref (live uuid or seed marker), activity_id, reply_text, kind='text' | Community activity thread | Parent sends a text reply |
| Same, with kind='voice', reply_text = Whisper transcript, audio_path (private) | Community activity thread | Parent sends a voice reply (processed by `process-reply` function) |

## Supabase Storage: `audio-reflections` bucket

| Data stored | Page | Action |
|---|---|---|
| Raw reflection audio (webm/m4a), path saved on the reflection row | Reflection | Recording processed by the `process-reflection` function |
| Raw voice-reply audio under `replies/`, path saved on the reply row | Community activity thread | Voice reply processed by the `process-reply` function |

## Device-only (localStorage — never leaves the phone/browser)

| Key | What it holds | Written when |
|---|---|---|
| pebbles_session_id | Anonymous id (e.g. `cozy-otter-421`) linking this device's rows across all tables | First visit |
| pebbles_profile | Age, challenges, custom text, SEL answers (drives suggestions + skips onboarding on return) | Any onboarding/Profile change |
| pebbles_saved_activities | Bookmarked activity ids | Bookmark tapped |
| pebbles_time_spent_secs | Real seconds spent in the activity player (Toolkit "Time Together") | Leaving the activity player |
| pebbles_tracking_off | "Test device" analytics opt-out | Profile checkbox |
