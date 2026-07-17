// Actual time spent in the activity player, accumulated on this device.
// Sessions are capped so an abandoned tab doesn't count as hours together.
const KEY = 'pebbles_time_spent_secs';
const MAX_SESSION_SECS = 30 * 60;

export function addTimeSpent(seconds: number): void {
  try {
    const current = Number(localStorage.getItem(KEY)) || 0;
    const add = Math.min(Math.max(0, Math.round(seconds)), MAX_SESSION_SECS);
    localStorage.setItem(KEY, String(current + add));
  } catch { /* private mode — skip */ }
}

export function getTimeSpentMinutes(): number {
  try {
    return Math.round((Number(localStorage.getItem(KEY)) || 0) / 60);
  } catch {
    return 0;
  }
}
