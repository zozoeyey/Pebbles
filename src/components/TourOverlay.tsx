import { useEffect, useState } from 'react';
import type { Screen } from '../types';

// Coach-mark tour that walks the REAL flow: it navigates screen to screen,
// dims the app, spotlights one element at a time, and explains it.
interface TourStep {
  screen: Screen;
  selector: string;
  title: string;
  text: string;
}

const STEPS: TourStep[] = [
  {
    screen: 'results',
    selector: '.explore-list .ex-card',
    title: 'Picked for your child',
    text: "These suggestions match your child's age and what you told us. Let's open this one and walk through how an activity works.",
  },
  {
    screen: 'detail',
    selector: '.bub-card',
    title: 'Start with the why',
    text: 'Every activity begins with a 1-minute video about the skill it builds — worth watching before your first try.',
  },
  {
    screen: 'detail',
    selector: '.act-start-btn',
    title: 'Then start the activity',
    text: 'This opens the step-by-step guide you\'ll follow together with your child.',
  },
  {
    screen: 'activity',
    selector: '.act-mode-toggle',
    title: 'Do it together',
    text: 'Follow the steps one by one — each has a little animation. Tap Read to go at your own pace, or Listen for audio guidance. Most activities take 5–15 minutes.',
  },
  {
    screen: 'reflection',
    selector: '.refl-record-btn',
    title: 'Record how it went',
    text: "Afterwards, talk for 30 seconds — what went well, what surprised you. We turn it into a tidy journal note, and you choose: share it anonymously, or keep it private.",
  },
  {
    screen: 'community',
    selector: '.community-card',
    title: 'Learn from other parents',
    text: 'Shared notes land here. Filter by activity, tap a heart, or reply to swap tips with parents trying the same things.',
  },
  {
    screen: 'toolkit',
    selector: '.toolkit-calendar',
    title: 'Watch your progress',
    text: 'Every reflection turns a day blue and builds your streak — your journal lives right here in the calendar.',
  },
  {
    screen: 'results',
    selector: '.explore-header .community-avatar-bub',
    title: 'This is you!',
    text: "Tap your pebble anytime to update your child's info — suggestions adapt right away. Ready to try your first activity for real?",
  },
];

const PAD = 8;

export default function TourOverlay({ active, screen, onNavigate, onDone }: {
  active: boolean;
  screen: Screen;
  onNavigate: (s: Screen) => void;
  onDone: () => void;
}) {
  const [idx, setIdx] = useState(0);
  const [rect, setRect] = useState<DOMRect | null>(null);

  useEffect(() => {
    if (active) { setIdx(0); setRect(null); }
  }, [active]);

  // Navigate to the step's screen if needed, then find + measure its target.
  useEffect(() => {
    if (!active) return;
    const step = STEPS[idx];
    if (screen !== step.screen) {
      setRect(null);
      onNavigate(step.screen);
      return; // re-runs when `screen` updates
    }
    let tries = 0;
    let timer: ReturnType<typeof setTimeout>;
    const attempt = () => {
      const el = document.querySelector(step.selector);
      if (!el) {
        // Screens fetch data async (e.g. community posts) — retry briefly.
        if (++tries < 15) timer = setTimeout(attempt, 200);
        else setRect(null);
        return;
      }
      el.scrollIntoView({ block: 'center' });
      timer = setTimeout(() => setRect(el.getBoundingClientRect()), 160);
    };
    timer = setTimeout(attempt, 300);
    window.addEventListener('resize', attempt);
    return () => { clearTimeout(timer); window.removeEventListener('resize', attempt); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active, idx, screen]);

  if (!active) return null;

  const step = STEPS[idx];
  const last = idx === STEPS.length - 1;
  // Oversized targets leave no room beside them — center the tooltip instead.
  const oversized = rect != null && rect.height > window.innerHeight * 0.55;
  const spaceBelow = rect ? window.innerHeight - rect.bottom : 0;
  const placeBelow = !rect || oversized || spaceBelow > 230;

  return (
    <div className="tour-root">
      {rect ? (
        <div
          className="tour-spot"
          style={{
            top: rect.top - PAD,
            left: rect.left - PAD,
            width: rect.width + PAD * 2,
            height: rect.height + PAD * 2,
          }}
        />
      ) : (
        <div className="tour-dim" />
      )}
      <div
        className="tour-tip"
        style={placeBelow
          ? { top: rect && !oversized ? rect.bottom + PAD + 14 : '40%' }
          : { bottom: window.innerHeight - (rect!.top - PAD) + 14 }}
      >
        <div className="tour-tip-count">{idx + 1} OF {STEPS.length}</div>
        <div className="tour-tip-title">{step.title}</div>
        <p className="tour-tip-text">{step.text}</p>
        <div className="tour-tip-row">
          <button className="tour-skip" onClick={onDone}>Skip tour</button>
          <button className="tour-next" onClick={() => (last ? onDone() : setIdx((i) => i + 1))}>
            {last ? "Let's go!" : 'Next'}
          </button>
        </div>
      </div>
    </div>
  );
}
