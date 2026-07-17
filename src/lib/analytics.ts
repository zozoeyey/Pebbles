import { SUPABASE_URL, SUPABASE_ANON_KEY } from './supabase';
import { getSessionId } from './session';

/**
 * Fire-and-forget anonymous usage event. Never throws, never blocks the UI —
 * analytics must not be able to break the app.
 *
 * Event types in use:
 *   session_start, activity_viewed, activity_selected, activity_started,
 *   activity_completed, activity_saved, activity_unsaved,
 *   reflection_submitted, reflection_shared, peer_reflection_opened,
 *   community_activity_opened
 */
const OPT_OUT_KEY = 'pebbles_tracking_off';

/** Whether this device is excluded from analytics (for the team's own testing). */
export function isTrackingOff(): boolean {
  try {
    return localStorage.getItem(OPT_OUT_KEY) === '1';
  } catch {
    return false;
  }
}

export function setTrackingOff(off: boolean): void {
  try {
    if (off) localStorage.setItem(OPT_OUT_KEY, '1');
    else localStorage.removeItem(OPT_OUT_KEY);
  } catch { /* ignore */ }
}

export function logEvent(
  eventType: string,
  opts: { activityId?: string; payload?: Record<string, unknown> } = {},
): void {
  // No analytics from local dev servers, or from devices that opted out.
  if (import.meta.env.DEV || isTrackingOff()) return;
  try {
    fetch(`${SUPABASE_URL}/rest/v1/events`, {
      method: 'POST',
      headers: {
        apikey: SUPABASE_ANON_KEY,
        Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
        'Content-Type': 'application/json',
        Prefer: 'return=minimal',
      },
      body: JSON.stringify({
        session_id: getSessionId(),
        event_type: eventType,
        activity_id: opts.activityId ?? null,
        payload: opts.payload ?? null,
      }),
    }).catch(() => {});
  } catch {
    /* ignore — telemetry is best-effort */
  }
}
