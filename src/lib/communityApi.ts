import { SUPABASE_URL, SUPABASE_ANON_KEY } from './supabase';
import { getSessionId } from './session';

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

const MY_SHARED_KEY = 'pebbles_my_shared_ids';

/** Ids of reflections this device shared — lets Community pin "your" posts. */
export function getMySharedIds(): string[] {
  try { return JSON.parse(localStorage.getItem(MY_SHARED_KEY) ?? '[]'); } catch { return []; }
}

/** Mark a reflection as shared with the community (RPC — see share_rpc migration). */
export async function shareReflection(id: string): Promise<void> {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/rpc/share_reflection`, {
    method: 'POST',
    headers: HEADERS,
    body: JSON.stringify({ reflection_id: id }),
  });
  if (!res.ok) throw new Error(await res.text());
  try {
    localStorage.setItem(MY_SHARED_KEY, JSON.stringify([...getMySharedIds(), id].slice(-20)));
  } catch { /* ignore */ }
}

/** Newest shared reflections — all of them, or just one activity's. */
export async function fetchSharedReflections(limit = 50, activityId?: string): Promise<SharedReflection[]> {
  const cols = 'id,created_at,activity_id,activity_title,child_age,summary,likes';
  const actFilter = activityId ? `&activity_id=eq.${encodeURIComponent(activityId)}` : '';
  const res = await fetch(
    `${SUPABASE_URL}/rest/v1/reflections?select=${cols}&shared=eq.true${actFilter}&order=created_at.desc&limit=${limit}`,
    { headers: HEADERS },
  );
  if (!res.ok) throw new Error(await res.text());
  return (await res.json()) as SharedReflection[];
}

export interface MyReflection {
  id: string;
  created_at: string;
  activity_id: string;
  activity_title: string;
  summary: string;
  shared: boolean;
}

/** This device's own reflections (shared or not) — powers the Toolkit. */
export async function fetchMyReflections(): Promise<MyReflection[]> {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/rpc/get_my_reflections`, {
    method: 'POST',
    headers: HEADERS,
    body: JSON.stringify({ p_session_id: getSessionId() }),
  });
  if (!res.ok) throw new Error(await res.text());
  return (await res.json()) as MyReflection[];
}

export interface ReflectionReply {
  id: string;
  created_at: string;
  reflection_ref: string;
  activity_id: string;
  reply_text: string;
  kind?: 'text' | 'voice';
}

/**
 * Upload a voice reply: audio goes to Storage, Whisper transcribes it, and the
 * transcript is stored as the public reply text. Returns the transcript.
 */
export async function postVoiceReply(reflectionRef: string, activityId: string, audio: Blob): Promise<string> {
  const form = new FormData();
  form.append('audio', audio, 'reply.webm');
  form.append('reflection_ref', reflectionRef);
  form.append('activity_id', activityId);
  form.append('session_id', getSessionId());
  const res = await fetch(`${SUPABASE_URL}/functions/v1/process-reply`, {
    method: 'POST',
    headers: { apikey: SUPABASE_ANON_KEY, Authorization: `Bearer ${SUPABASE_ANON_KEY}` },
    body: form,
  });
  if (!res.ok) throw new Error(await res.text());
  const { transcript } = (await res.json()) as { transcript: string };
  return transcript;
}

/** Post a public text reply on a reflection (live uuid or seed ref). */
export async function postReply(reflectionRef: string, activityId: string, text: string): Promise<void> {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/reflection_replies`, {
    method: 'POST',
    headers: { ...HEADERS, Prefer: 'return=minimal' },
    body: JSON.stringify({
      session_id: getSessionId(),
      reflection_ref: reflectionRef,
      activity_id: activityId,
      reply_text: text,
    }),
  });
  if (!res.ok) throw new Error(await res.text());
}

/** All replies for one activity's reflections, oldest first. */
export async function fetchReplies(activityId: string): Promise<ReflectionReply[]> {
  const cols = 'id,created_at,reflection_ref,activity_id,reply_text,kind';
  const res = await fetch(
    `${SUPABASE_URL}/rest/v1/reflection_replies?select=${cols}&activity_id=eq.${encodeURIComponent(activityId)}&order=created_at.asc`,
    { headers: HEADERS },
  );
  if (!res.ok) throw new Error(await res.text());
  return (await res.json()) as ReflectionReply[];
}

const LIKED_KEY = 'pebbles_liked_ids';

/** Reflections this device has liked — persists so hearts stay filled. */
export function getLikedIds(): Set<string> {
  try { return new Set(JSON.parse(localStorage.getItem(LIKED_KEY) ?? '[]')); } catch { return new Set(); }
}

function persistLiked(ids: Set<string>) {
  try { localStorage.setItem(LIKED_KEY, JSON.stringify([...ids])); } catch { /* ignore */ }
}

/** +1 a shared reflection (server-side increment via RPC). */
export async function likeReflection(id: string): Promise<void> {
  const ids = getLikedIds();
  ids.add(id);
  persistLiked(ids);
  const res = await fetch(`${SUPABASE_URL}/rest/v1/rpc/like_reflection`, {
    method: 'POST',
    headers: HEADERS,
    body: JSON.stringify({ reflection_id: id }),
  });
  if (!res.ok) throw new Error(await res.text());
}

/** Take a like back (floors at zero server-side). */
export async function unlikeReflection(id: string): Promise<void> {
  const ids = getLikedIds();
  ids.delete(id);
  persistLiked(ids);
  const res = await fetch(`${SUPABASE_URL}/rest/v1/rpc/unlike_reflection`, {
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
