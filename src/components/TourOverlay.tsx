import { useEffect, useState } from 'react';

// Coach-mark tour: dims the real app, spotlights one element at a time,
// and explains it in a tooltip. Runs on the live Explore screen.
interface TourStep {
  selector: string;
  title: string;
  text: string;
}

const STEPS: TourStep[] = [
  {
    selector: '.explore-list .ex-card',
    title: 'Picked for your child',
    text: "These suggestions match your child's age and what you told us. Tap a card, then \"Try Activity\" — you'll get a 1-minute video on the skill, then simple steps to follow together.",
  },
  {
    selector: '.explore-search-row',
    title: 'Find any activity',
    text: 'Search, or filter every activity by skill and how much time you have — most take just 5–15 minutes.',
  },
  {
    selector: '.explore-list .ex-save-btn',
    title: 'Save favorites',
    text: 'Bookmark an activity to keep it handy in your Toolkit.',
  },
  {
    selector: '.explore-nav .nav-tab:nth-child(2)',
    title: 'Learn from other parents',
    text: "After each activity, you'll record a quick voice note about how it went — we tidy it into a short journal entry. Share it here anonymously to help other parents, or keep it private. Always your choice.",
  },
  {
    selector: '.explore-nav .nav-tab:nth-child(3)',
    title: 'Watch your progress',
    text: 'Every reflection marks your calendar and builds your streak — your notes and saved activities live here too.',
  },
  {
    selector: '.explore-header .community-avatar-bub',
    title: 'This is you!',
    text: "Tap your pebble anytime to update your child's age or challenges — suggestions adapt right away.",
  },
];

const PAD = 8;

export default function TourOverlay({ active, onDone }: { active: boolean; onDone: () => void }) {
  const [idx, setIdx] = useState(0);
  const [rect, setRect] = useState<DOMRect | null>(null);

  useEffect(() => {
    if (active) setIdx(0);
  }, [active]);

  useEffect(() => {
    if (!active) return;
    let timer: ReturnType<typeof setTimeout>;
    const measure = () => {
      const el = document.querySelector(STEPS[idx].selector);
      if (!el) { setRect(null); return; }
      el.scrollIntoView({ block: 'center' });
      timer = setTimeout(() => setRect(el.getBoundingClientRect()), 150);
    };
    // Let the screen underneath render first.
    timer = setTimeout(measure, 250);
    window.addEventListener('resize', measure);
    return () => { clearTimeout(timer); window.removeEventListener('resize', measure); };
  }, [active, idx]);

  if (!active) return null;

  const step = STEPS[idx];
  const last = idx === STEPS.length - 1;
  // Tooltip goes under the spotlight when there's room, otherwise above it.
  const spaceBelow = rect ? window.innerHeight - rect.bottom : 0;
  const placeBelow = !rect || spaceBelow > 220;

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
          ? { top: rect ? rect.bottom + PAD + 14 : '50%' }
          : { bottom: window.innerHeight - (rect!.top - PAD) + 14 }}
      >
        <div className="tour-tip-count">{idx + 1} OF {STEPS.length}</div>
        <div className="tour-tip-title">{step.title}</div>
        <p className="tour-tip-text">{step.text}</p>
        <div className="tour-tip-row">
          <button className="tour-skip" onClick={onDone}>Skip tour</button>
          <button className="tour-next" onClick={() => (last ? onDone() : setIdx((i) => i + 1))}>
            {last ? 'Done!' : 'Next'}
          </button>
        </div>
      </div>
    </div>
  );
}
