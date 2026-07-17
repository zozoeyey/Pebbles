// Anonymous, device-scoped identity. No login: a friendly id like
// "sunny-otter-421" minted once and kept in localStorage, so Supabase rows can
// be tied to "this parent's device" across visits — and parents can read their
// id aloud during user testing. Devices that already have an older UUID keep
// it, so their history stays joined up.
// Swap for supabase.auth.signInAnonymously() when real accounts land.
const KEY = 'pebbles_session_id';

const ADJECTIVES = [
  'sunny', 'cozy', 'brave', 'gentle', 'merry', 'quiet', 'gleeful', 'plucky',
  'breezy', 'gold', 'rosy', 'dandy', 'spry', 'jolly', 'peachy', 'lucky',
  'minty', 'dewy', 'perky', 'snug', 'zesty', 'chirpy', 'nimble', 'tender',
];

const ANIMALS = [
  'otter', 'panda', 'bunny', 'koala', 'finch', 'fawn', 'cub', 'duckling',
  'kitten', 'lamb', 'owlet', 'pony', 'seal', 'chick', 'joey', 'piglet',
  'squirrel', 'hedgehog', 'puffin', 'dolphin', 'gosling', 'tadpole', 'wren', 'mole',
];

function friendlyId(): string {
  const pick = (list: string[]) => list[Math.floor(Math.random() * list.length)];
  return `${pick(ADJECTIVES)}-${pick(ANIMALS)}-${Math.floor(Math.random() * 1000)}`;
}

export function getSessionId(): string {
  try {
    let id = localStorage.getItem(KEY);
    if (!id) {
      id = friendlyId();
      localStorage.setItem(KEY, id);
    }
    return id;
  } catch {
    // localStorage unavailable (private mode) — fall back to a per-load id.
    return friendlyId();
  }
}
