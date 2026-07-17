import { useState } from 'react';
import type { Screen } from '../types';

interface Props {
  showScreen: (s: Screen) => void;
  showResults: () => void;
  /** Returns false when skipping is blocked (first visit) — show a message instead. */
  onSkip: () => boolean;
  onAgeSelect: (age: number) => void;
}

const AGE_OPTIONS = [3, 4, 5, 6, 7, 8, 9, 10, 11];

export default function AgeScreen({ showScreen, onSkip, onAgeSelect }: Props) {
  const [selectedAge, setSelectedAge] = useState<number | null>(null);
  const [skipMsg, setSkipMsg] = useState(false);

  function selectAge(age: number) {
    setSelectedAge(age);
    onAgeSelect(age);
  }

  function handleSkip() {
    if (!onSkip()) {
      setSkipMsg(true);
      setTimeout(() => setSkipMsg(false), 4000);
    }
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      <div className="onboard-screen">
        <div className="onboard-top">
          <div className="onboard-progress">
            <div className="progress-segs">
              <div className="progress-seg"><div className="progress-seg-fill" style={{ width: '50%' }} /></div>
              <div className="progress-seg" />
              <div className="progress-seg" />
            </div>
            <button className="progress-skip" onClick={handleSkip}>Skip</button>
          </div>
          {skipMsg && (
            <div className="onboard-skip-msg">
              One quick minute! These few questions help us pick the right activities for your child. 💛
            </div>
          )}
          <div className="age-scene">
            <img src="assets/arc.svg" className="onboard-arc" alt="" />
            <img src="assets/char-center.svg" className="age-char-main" alt="" />
            <img src="assets/clock.svg" className="age-clock" alt="" />
            <img src="assets/flower-pink.svg" className="age-flower-left" alt="" />
            <img src="assets/flower-white.svg" className="age-flower-right" alt="" />
          </div>
        </div>
        <div className="onboard-card">
          <div className="onboard-texts">
            <div className="onboard-heading">How old is your child?</div>
            <p className="onboard-subtext">We'll tailor lessons to their stage.</p>
          </div>
          <div className="age-pills">
            {AGE_OPTIONS.map((age) => (
              <button
                key={age}
                className={`age-pill${selectedAge === age ? ' selected' : ''}`}
                onClick={() => selectAge(age)}
              >
                {age} yrs
              </button>
            ))}
          </div>
          <button
            className="onboard-cta"
            disabled={selectedAge === null}
            onClick={() => showScreen('challenge')}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}
