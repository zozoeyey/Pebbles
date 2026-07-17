# Activity Suggestion Rubric

How Pebbles picks the 2 suggested activities from onboarding answers.

Two implementations must stay in sync with this doc:
- **AI path** — the prompt in `supabase/functions/suggest-activities/index.ts` (Claude applies the rubric with judgment).
- **Local fallback** — the heuristic in `src/screens/ResultsScreen.tsx` (applies rules 1, 2, and 4 mechanically; shown until the AI responds or if the call fails).

## Inputs

| Input | Screen | Used for |
|---|---|---|
| Child age (3–11) | Age screen | Rule 1 (age fit), Rule 5 (attention span) |
| Challenge chips (preset ids) | Challenge screen | Rule 2 (skill mapping) |
| Custom challenge text | Challenge screen | Rule 2 (keyword match / AI context) |
| "What is SEL?" answer | SEL screen | Rule 3 (parent familiarity) |
| "How do you handle big emotions?" answer | SEL screen | Rule 3 (parent's current approach) |

## Rules (priority order)

### 1. Age fit — hard rule
Only suggest activities whose `ages` range includes the child's age, or misses by at most 1 year.
Local heuristic scoring: in range **+2**, within 1 year **0**, further out **−2**.
Age unknown: prefer broad ranges.

### 2. Challenge → skill mapping
One activity can match on any of its tags (`skills` array).

| Challenge chip | Wanted skills |
|---|---|
| Trouble naming feelings | Identifying emotions |
| Big reactions | Impulse control, Interoception |
| Tantrums during transition | Impulse control |
| Hard to calm down | Interoception, Impulse control |
| Low confidence or self-doubt | Impulse control (mistake-tolerance, e.g. Musical Drawings), Identifying emotions |

Local heuristic scoring: **+1 per matched skill**, plus **+1** if any custom-text/emotion-handling word (>3 letters) appears in the activity's title/description.

### 3. Parent readiness (SEL answers — AI path only)
- Parent sounds **new to SEL** (vague definition) or handles big emotions with only distraction/discipline → start with short, playful, in-the-moment tools: breathing activities, Freeze Feelings, Wiggle Cool Down.
- Parent **already names feelings** together → step up to reflective practices: What's My Temperature, Feelings Circle, Mood Diary.

### 4. Diversity of the pair
The 2 picks should not share the same primary skill (`skills[0]`). Ideally pair one **"calm down right now"** tool (breathing, Tense and Relax) with one **"build the skill over time"** practice (Feelings Circle, Mood Diary, Emotion Portraits).

### 5. Attention span
Age ≤ 5 → prefer activities of 10 minutes or less.

Ties break by catalog order (`EXPLORE_ACTS`).

## Current catalog coverage

Durations are calibrated for one parent + one child at home (classroom sources
overestimate: no group logistics). Rule of thumb used: movement/breathing games
= setup + 4–6 short rounds; drawing/reflection activities keep their source length.

| Activity | Ages | Skills | Time |
|---|---|---|---|
| Freeze Feelings | 3–7 | Impulse control, Interoception | 15 min |
| Emotion Charades | 3–9 | Identifying emotions | 15 min |
| Tense and Relax | 3–9 | Interoception | 10 min |
| What's My Temperature? | 5–10 | Identifying emotions | 15 min |
| Wiggle Cool Down | 3–7 | Impulse control | 5 min |
| Musical Drawings | 5–10 | Identifying emotions | 25 min |
| Balloon Breathing | 3–8 | Interoception, Impulse control | 5 min |
| Flower Breathing | 3–7 | Interoception, Impulse control | 5 min |
| Bubble Breathing | 3–8 | Impulse control, Interoception | 5 min |
| Feelings Circle | 3–8 | Identifying emotions | 10 min |
| Emotion Portraits | 5–9 | Identifying emotions | 25 min |
| Mood Diary | 7–11 | Identifying emotions, Interoception | 5 min/day |

Tags follow the team activity spreadsheet (July 2026 retag).
Tag balance: Identifying emotions ×6, Interoception ×6, Impulse control ×5.
Age coverage: 3 through 11 (Mood Diary); densest 3–9.
