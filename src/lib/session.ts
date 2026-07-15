// Anonymous, device-scoped identity. No login: a UUID minted once and kept in
// localStorage, so Supabase rows can be tied to "this parent's device" across
// visits. Swap for supabase.auth.signInAnonymously() when real accounts land.
const KEY = 'pebbles_session_id';

export function getSessionId(): string {
  try {
    let id = localStorage.getItem(KEY);
    if (!id) {
      id = crypto.randomUUID
        ? crypto.randomUUID()
        : Date.now().toString(36) + Math.random().toString(36).slice(2);
      localStorage.setItem(KEY, id);
    }
    return id;
  } catch {
    // localStorage unavailable (private mode) — fall back to a per-load id.
    return Date.now().toString(36) + Math.random().toString(36).slice(2);
  }
}
