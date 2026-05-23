import { useState, useCallback } from 'react';

const STORAGE_KEY = 'pebbles_saved_activities';

function load(): Set<string> {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? new Set(JSON.parse(raw)) : new Set();
  } catch {
    return new Set();
  }
}

function persist(ids: Set<string>) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify([...ids]));
}

export function useSavedActivities() {
  const [saved, setSaved] = useState<Set<string>>(load);

  const toggle = useCallback((id: string) => {
    setSaved(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      persist(next);
      return next;
    });
  }, []);

  const isSaved = useCallback((id: string) => saved.has(id), [saved]);

  return { saved, toggle, isSaved };
}
