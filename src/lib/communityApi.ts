import { SUPABASE_URL, SUPABASE_ANON_KEY } from './supabase';

export interface SharedReflection {
  id: string;
  created_at: string;
  activity_id: string;
  activity_title: string;
  child_age: number | null;
  summary: string;
  likes: number;
}

const HEADERS = {
  apikey: SUPABASE_ANON_KEY,
  Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
  'Content-Type': 'application/json',
};

/** Mark a reflection as shared with the community. */
export async function shareReflection(id: string): Promise<void> {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/reflections?id=eq.${id}`, {
    method: 'PATCH',
    headers: { ...HEADERS, Prefer: 'return=minimal' },
    body: JSON.stringify({ shared: true }),
  });
  if (!res.ok) throw new Error(await res.text());
}

/** Newest shared reflections for the community feed. */
export async function fetchSharedReflections(limit = 20): Promise<SharedReflection[]> {
  const cols = 'id,created_at,activity_id,activity_title,child_age,summary,likes';
  const res = await fetch(
    `${SUPABASE_URL}/rest/v1/reflections?select=${cols}&shared=eq.true&order=created_at.desc&limit=${limit}`,
    { headers: HEADERS },
  );
  if (!res.ok) throw new Error(await res.text());
  return (await res.json()) as SharedReflection[];
}

/** +1 a shared reflection (server-side increment via RPC). */
export async function likeReflection(id: string): Promise<void> {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/rpc/like_reflection`, {
    method: 'POST',
    headers: HEADERS,
    body: JSON.stringify({ reflection_id: id }),
  });
  if (!res.ok) throw new Error(await res.text());
}

/** "2h ago"-style label from an ISO timestamp. */
export function timeAgo(iso: string): string {
  const mins = Math.max(1, Math.round((Date.now() - new Date(iso).getTime()) / 60000));
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.round(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.round(hours / 24);
  return `${days}d ago`;
}
