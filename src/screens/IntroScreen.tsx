import { useState } from 'react';
import type { Screen } from '../types';

interface Props {
  showScreen: (s: Screen) => void;
}

// Walks parents through the whole loop once, right after onboarding:
// find → watch → do → record → share (or not). Replayable from Profile.
const SLIDES = [
  {
    img: 'assets/steps/emotion-portraits-1.svg',
    title: 'Find the right activity',
    text: "Explore suggests bite-size activities tuned to your child's age and what you told us. Tap any card to see what it teaches and why.",
  },
  {
    img: 'assets/it open.svg',
    title: 'Watch a 1-minute intro',
    text: 'Every activity starts with a short video explaining the skill it builds — the why, not just the how.',
  },
  {
    img: 'assets/steps/balloon-breathing-3.svg',
    title: 'Do it together',
    text: 'Follow simple illustrated steps with your child. Most activities take just 5–15 minutes.',
  },
  {
    img: 'assets/steps/flower-breathing-5.svg',
    title: 'Record how it went',
    text: 'Afterwards, talk into the mic for 30 seconds. We turn it into a tidy note, and your Toolkit calendar marks the day.',
  },
  {
    img: 'assets/steps/feelings-circle-4.svg',
    title: 'Share it — or keep it',
    text: "You can share your note with other parents, anonymously. Only the written summary, never your voice — and it's always your choice.",
  },
];

export default function IntroScreen({ showScreen }: Props) {
  const [idx, setIdx] = useState(0);
  const slide = SLIDES[idx];
  const last = idx === SLIDES.length - 1;

  function next() {
    if (last) showScreen('results');
    else setIdx((i) => i + 1);
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      <div className="intro-wrap">
        <div className="intro-art">
          <img src={slide.img} alt="" />
        </div>
        <div className="intro-card">
          <div className="intro-step-label">HOW PEBBLES WORKS · {idx + 1} OF {SLIDES.length}</div>
          <div className="intro-title">{slide.title}</div>
          <p className="intro-text">{slide.text}</p>
          <div className="intro-dots">
            {SLIDES.map((_, i) => (
              <button
                key={i}
                className={`intro-dot${i === idx ? ' active' : ''}`}
                onClick={() => setIdx(i)}
                aria-label={`Step ${i + 1}`}
              />
            ))}
          </div>
          <button className="onboard-cta" onClick={next}>
            {last ? "Let's go!" : 'Next'}
          </button>
        </div>
      </div>
    </div>
  );
}
