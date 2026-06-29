import { useState } from 'react';
import BackButton from '../components/BackButton';
import type { Screen } from '../types';

interface CustomActivity {
  title: string;
  skill: string;
  duration: string;
  steps: string[];
  tip: string;
}

interface Props {
  showScreen: (s: Screen) => void;
  onSaveCustom: (activity: CustomActivity) => void;
}

const SKILL_OPTIONS = ['Identifying emotions', 'Self-perception', 'Impulse & body control', 'Self-regulation', 'Social connection'];

function mockAiStructure(description: string): CustomActivity {
  const lower = description.toLowerCase();

  const skill =
    lower.includes('calm') || lower.includes('breath') || lower.includes('relax') ? 'Self-regulation'
    : lower.includes('body') || lower.includes('move') || lower.includes('stretch') ? 'Impulse & body control'
    : lower.includes('feel') || lower.includes('emotion') || lower.includes('name') ? 'Identifying emotions'
    : lower.includes('together') || lower.includes('share') || lower.includes('talk') ? 'Social connection'
    : 'Self-perception';

  const firstLine = description.split(/[.!?\n]/)[0].trim();
  const title = firstLine.length > 6 && firstLine.length < 60
    ? firstLine.replace(/^(we |i |my |let's |lets )/i, '').replace(/^\w/, c => c.toUpperCase())
    : 'Our Custom Activity';

  return {
    title,
    skill,
    duration: '15 mins',
    steps: [
      'Find a calm, distraction-free space together.',
      'Explain the activity in simple terms — keep it light and low-pressure.',
      description.length > 20 ? description.split(/[.!?\n]/)[0].trim() : 'Begin the main activity together.',
      'Check in halfway through — ask how they are feeling right now.',
      'Wrap up with a short reflection: what did they notice? What felt good?',
    ],
    tip: 'Follow your child\'s pace. If energy is low, shorten it. If they\'re engaged, let it run longer than planned.',
  };
}

export default function CreateActivityScreen({ showScreen, onSaveCustom }: Props) {
  const [step, setStep] = useState<'describe' | 'loading' | 'review'>('describe');
  const [description, setDescription] = useState('');
  const [activity, setActivity] = useState<CustomActivity | null>(null);
  const [saved, setSaved] = useState(false);

  function handleGenerate() {
    if (!description.trim()) return;
    setStep('loading');
    setTimeout(() => {
      setActivity(mockAiStructure(description));
      setStep('review');
    }, 1800);
  }

  function updateStep(i: number, val: string) {
    if (!activity) return;
    const steps = [...activity.steps];
    steps[i] = val;
    setActivity({ ...activity, steps });
  }

  function addStep() {
    if (!activity) return;
    setActivity({ ...activity, steps: [...activity.steps, ''] });
  }

  function removeStep(i: number) {
    if (!activity) return;
    setActivity({ ...activity, steps: activity.steps.filter((_, idx) => idx !== i) });
  }

  function handleSave() {
    if (!activity) return;
    onSaveCustom(activity);
    setSaved(true);
    setTimeout(() => showScreen('toolkit'), 900);
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      <div className="create-act-wrap">
        <div className="create-act-topbar">
          <BackButton onClick={() => showScreen('results')} />
        </div>

        {step === 'describe' && (
          <>
            <div className="create-act-heading">Create your own activity</div>
            <p className="create-act-sub">Describe what you have in mind — a rough idea is enough. AI will turn it into a structured activity you can use and save.</p>
            <textarea
              className="create-act-textarea"
              placeholder="e.g. We do yoga together before bed and I want to tie it to recognising feelings — maybe each pose could represent an emotion…"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={6}
            />
            <button
              className="create-act-generate-btn"
              disabled={description.trim().length < 10}
              onClick={handleGenerate}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
              </svg>
              Generate with AI
            </button>
          </>
        )}

        {step === 'loading' && (
          <div className="create-act-loading">
            <div className="create-act-spinner" />
            <div className="create-act-loading-text">Structuring your activity…</div>
          </div>
        )}

        {step === 'review' && activity && (
          <>
            <div className="create-act-ai-badge">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
              </svg>
              AI structured this — edit anything
            </div>

            <div className="create-act-field">
              <label className="create-act-label">Title</label>
              <input
                className="create-act-input"
                value={activity.title}
                onChange={(e) => setActivity({ ...activity, title: e.target.value })}
              />
            </div>

            <div className="create-act-row">
              <div className="create-act-field" style={{ flex: 1 }}>
                <label className="create-act-label">Duration</label>
                <input
                  className="create-act-input"
                  value={activity.duration}
                  onChange={(e) => setActivity({ ...activity, duration: e.target.value })}
                />
              </div>
              <div className="create-act-field" style={{ flex: 2 }}>
                <label className="create-act-label">SEL Skill</label>
                <select
                  className="create-act-input"
                  value={activity.skill}
                  onChange={(e) => setActivity({ ...activity, skill: e.target.value })}
                >
                  {SKILL_OPTIONS.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
            </div>

            <div className="create-act-field">
              <label className="create-act-label">Steps</label>
              {activity.steps.map((s, i) => (
                <div key={i} className="create-act-step-row">
                  <span className="create-act-step-num">{i + 1}</span>
                  <input
                    className="create-act-input"
                    value={s}
                    onChange={(e) => updateStep(i, e.target.value)}
                  />
                  <button className="create-act-remove-step" onClick={() => removeStep(i)} aria-label="Remove step">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                      <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                    </svg>
                  </button>
                </div>
              ))}
              <button className="create-act-add-step" onClick={addStep}>+ Add step</button>
            </div>

            <div className="create-act-field">
              <label className="create-act-label">Parent tip</label>
              <textarea
                className="create-act-textarea"
                value={activity.tip}
                onChange={(e) => setActivity({ ...activity, tip: e.target.value })}
                rows={3}
              />
            </div>

            <button
              className="create-act-save-btn"
              onClick={handleSave}
              disabled={saved}
            >
              {saved ? 'Saved ✓' : 'Save to My Library'}
            </button>
          </>
        )}
      </div>
    </div>
  );
}
