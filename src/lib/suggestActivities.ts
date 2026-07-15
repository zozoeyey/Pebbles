import { SUPABASE_URL, SUPABASE_ANON_KEY } from './supabase';
import type { ExploreAct } from '../types';

export interface AiSuggestion {
  id: string;
  reason: string;
}

interface SuggestPayload {
  childAge: number | null;
  challenges: string[];
  customText: string;
  /** Parent's answer to "what is SEL?" — gauges how new they are to this. */
  selDefinition?: string;
  /** Parent's answer to "how do you handle big emotions?" — signals current approach. */
  emotionHandling?: string;
  activities: ExploreAct[];
  count?: number;
}

/**
 * Ask the `suggest-activities` edge function (Claude) to rank activities for a
 * specific child. Throws on any network/function error — callers should catch
 * and fall back to a local heuristic.
 */
export async function fetchAiSuggestions({
  childAge,
  challenges,
  customText,
  selDefinition = '',
  emotionHandling = '',
  activities,
  count = 2,
}: SuggestPayload): Promise<AiSuggestion[]> {
  const res = await fetch(`${SUPABASE_URL}/functions/v1/suggest-activities`, {
    method: 'POST',
    headers: {
      apikey: SUPABASE_ANON_KEY,
      Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      childAge,
      challenges,
      customText,
      selDefinition,
      emotionHandling,
      count,
      activities: activities.map((a) => ({
        id: a.id,
        title: a.title,
        skills: a.skills,
        ages: a.ages,
        desc: a.desc,
        time: a.time,
      })),
    }),
  });
  if (!res.ok) throw new Error(await res.text());
  const data = (await res.json()) as { suggested?: AiSuggestion[] };
  return data.suggested ?? [];
}
