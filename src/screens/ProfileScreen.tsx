import { useState } from 'react';
import { PRESET_CHALLENGES } from '../data/activities';
import type { Screen } from '../types';
import BottomNav from '../components/BottomNav';
import AvatarBubble from '../components/AvatarBubble';

const AGE_OPTIONS = [3, 4, 5, 6, 7, 8, 9, 10, 11];

interface Props {
  showScreen: (s: Screen) => void;
  activeTab: Screen;
  selectedAge: number | null;
  onAgeChange: (age: number) => void;
  selectedChallenges: Set<string>;
  customChallengeText: string;
  onChallengesChange: (ids: Set<string>, custom: string) => void;
  selAnswers: { selDefinition: string; emotionHandling: string };
  onSelAnswers: (selDefinition: string, emotionHandling: string) => void;
}

// Everything here edits the onboarding answers that drive suggestions.
// History (done/saved activities, calendar) lives on the Toolkit tab instead.
export default function ProfileScreen({
  showScreen, activeTab, selectedAge, onAgeChange,
  selectedChallenges, customChallengeText, onChallengesChange,
  selAnswers, onSelAnswers,
}: Props) {
  const [custom, setCustom] = useState(customChallengeText);
  const [q1, setQ1] = useState(selAnswers.selDefinition);
  const [q2, setQ2] = useState(selAnswers.emotionHandling);

  function toggleChallenge(id: string) {
    const next = new Set(selectedChallenges);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    onChallengesChange(next, custom);
  }

  return (
    <div style={{ flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      <div className="toolkit-wrap">
        {/* Header — same pattern as Toolkit/Community */}
        <div className="toolkit-header-row">
          <div>
            <div className="toolkit-heading">Profile</div>
            <div className="toolkit-subheading">Tell us about your child — it tunes your suggestions</div>
          </div>
          <AvatarBubble />
        </div>

        <div className="toolkit-section-label" style={{ marginTop: 8 }}>ABOUT YOUR CHILD</div>
        <div className="profile-card">
          <div className="profile-field-label">Age</div>
          <div className="filter-chips-wrap">
            {AGE_OPTIONS.map((age) => (
              <button
                key={age}
                className={`ex-chip${selectedAge === age ? ' active' : ''}`}
                onClick={() => onAgeChange(age)}
              >
                {age} yrs
              </button>
            ))}
          </div>

          <div className="profile-field-label">What feels hard right now</div>
          <div className="filter-chips-wrap">
            {PRESET_CHALLENGES.map((c) => (
              <button
                key={c.id}
                className={`ex-chip${selectedChallenges.has(c.id) ? ' active' : ''}`}
                onClick={() => toggleChallenge(c.id)}
              >
                {c.label}
              </button>
            ))}
          </div>

          <div className="profile-field-label">Anything else, in your words</div>
          <input
            type="text"
            className="profile-input"
            placeholder="e.g. gets frustrated with homework…"
            value={custom}
            onChange={(e) => setCustom(e.target.value)}
            onBlur={() => onChallengesChange(selectedChallenges, custom)}
          />
          <div className="profile-hint">Changes here re-tune your suggested activities on the Explore tab.</div>
        </div>

        <div className="toolkit-section-label" style={{ marginTop: 8 }}>HOW YOU PARENT</div>
        <div className="profile-card">
          <div className="profile-field-label">What does SEL mean to you?</div>
          <input
            type="text"
            className="profile-input"
            placeholder="Type your answer…"
            value={q1}
            onChange={(e) => setQ1(e.target.value)}
            onBlur={() => onSelAnswers(q1.trim(), q2.trim())}
          />
          <div className="profile-field-label">How do you usually handle big emotions?</div>
          <input
            type="text"
            className="profile-input"
            placeholder="Type your answer…"
            value={q2}
            onChange={(e) => setQ2(e.target.value)}
            onBlur={() => onSelAnswers(q1.trim(), q2.trim())}
          />
        </div>

        <div className="toolkit-section-label" style={{ marginTop: 8 }}>APP</div>
        <div className="profile-card" style={{ marginBottom: 12 }}>
          <button className="profile-redo-btn" onClick={() => showScreen('welcome')}>
            Redo onboarding
          </button>
          <div className="profile-hint" style={{ marginTop: 10 }}>
            Activities adapted from UC Berkeley's Greater Good in Education, Everyday Mental
            Health Classroom Resource, and Coping Skills for Kids.
          </div>
        </div>
      </div>

      <BottomNav activeTab={activeTab} showScreen={showScreen} />
    </div>
  );
}
