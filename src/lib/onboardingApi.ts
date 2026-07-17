import { SUPABASE_URL, SUPABASE_ANON_KEY } from './supabase';
import { getSessionId } from './session';

/**
 * Keep this device's onboarding row in sync with profile edits.
 * Fire-and-forget: profile changes must never block on the network.
 */
export function syncOnboarding(data: {
  age: number | null;
  challengeIds: string[];
  customText: string;
  selDefinition: string;
  emotionHandling: string;
}): void {
  const challenges = [...data.challengeIds, data.customText].filter(Boolean).join(', ');
  try {
    fetch(`${SUPABASE_URL}/rest/v1/rpc/upsert_onboarding`, {
      method: 'POST',
      headers: {
        apikey: SUPABASE_ANON_KEY,
        Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        p_session_id: getSessionId(),
        p_age: data.age,
        p_challenges: challenges,
        p_sel_definition: data.selDefinition,
        p_emotion_handling: data.emotionHandling,
      }),
    }).catch(() => {});
  } catch { /* offline — local state still holds the truth */ }
}
