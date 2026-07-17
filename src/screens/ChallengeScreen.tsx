import { useState, useRef } from 'react';
import type { Screen } from '../types';
import { PRESET_CHALLENGES } from '../data/activities';

interface Props {
  showScreen: (s: Screen) => void;
  showResults: () => void;
  /** Returns false when skipping is blocked (first visit) — show a message instead. */
  onSkip: () => boolean;
  onChallengeSelect: (ids: Set<string>, custom: string) => void;
}

export default function ChallengeScreen({ showScreen, onSkip, onChallengeSelect }: Props) {
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [customText, setCustomText] = useState('');
  const [customSaved, setCustomSaved] = useState('');
  const [showAddOwn, setShowAddOwn] = useState(false);
  const [skipMsg, setSkipMsg] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  function handleSkip() {
    if (!onSkip()) {
      setSkipMsg(true);
      setTimeout(() => setSkipMsg(false), 4000);
    }
  }

  const hasSelection = selected.size > 0 || customSaved.length > 0;

  function selectPill(id: string) {
    const next = new Set(selected);
    if (next.has(id)) next.delete(id); else next.add(id);
    setSelected(next);
    onChallengeSelect(next, customSaved);
  }

  function toggleAddOwn() {
    setShowAddOwn((v) => !v);
    if (!showAddOwn) setTimeout(() => inputRef.current?.focus(), 0);
  }

  function saveOwnChallenge() {
    const val = customText.trim();
    if (!val) return;
    setCustomSaved(val);
    setShowAddOwn(false);
    setCustomText('');
    onChallengeSelect(selected, val);
  }

  function clearCustom() {
    setCustomSaved('');
    onChallengeSelect(selected, '');
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      <div className="onboard-screen">
        <div className="onboard-top">
          <div className="onboard-progress">
            <div className="progress-segs">
              <div className="progress-seg"><div className="progress-seg-fill" style={{ width: '100%' }} /></div>
              <div className="progress-seg"><div className="progress-seg-fill" style={{ width: '50%' }} /></div>
              <div className="progress-seg" />
            </div>
            <button className="progress-skip" onClick={handleSkip}>Skip</button>
          </div>
          {skipMsg && (
            <div className="onboard-skip-msg">
              One quick minute! These few questions help us pick the right activities for your child. 💛
            </div>
          )}
          <img src="assets/arc screen 3.svg" className="challenge-arc-img" alt="" />
        </div>
        <div className="onboard-card">
          <div className="onboard-texts">
            <div className="onboard-heading">What do you want to work on today?</div>
            <p className="onboard-subtext">Select all that apply.</p>
          </div>
          <div className="challenge-pill-grid">
            {PRESET_CHALLENGES.map((ch) => (
              <button
                key={ch.id}
                className={`challenge-pill${selected.has(ch.id) ? ' selected' : ''}`}
                onClick={() => selectPill(ch.id)}
              >
                {ch.label}
              </button>
            ))}
            {customSaved && (
              <button className="challenge-pill selected" onClick={clearCustom}>
                {customSaved} ×
              </button>
            )}
            {!customSaved && (
              <button className="challenge-pill-add" onClick={toggleAddOwn}>
                + Add your own
              </button>
            )}
          </div>
          {showAddOwn && (
            <div className="add-own-box">
              <input
                ref={inputRef}
                type="text"
                className="add-own-input"
                placeholder="e.g. refuses to share with siblings…"
                value={customText}
                onChange={(e) => setCustomText(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter') saveOwnChallenge(); }}
              />
              <button className="add-own-save" onClick={saveOwnChallenge}>Save</button>
            </div>
          )}
          <button
            className="onboard-cta"
            disabled={!hasSelection}
            onClick={() => showScreen('sel')}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}
